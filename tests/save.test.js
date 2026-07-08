// tests/save.test.js — 存档往返 / 损坏容错 / 日期与随机工具
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame, memoryStore, plain } = require('./bootstrap.js');

describe('saveGlobal → loadGlobalSave 往返', () => {
    test('关键字段一致：coins/level/learnedWords/skin/wordMastery', () => {
        const g = makeGame();
        g.coins = 1234;
        g.level = 7;
        g.learnedWords = [{ en: 'CAT', cn: '猫', s: 'I have a cat.', sc: '我有一只猫。' }];
        g.skin = 'pixel';
        g.wordMastery = { CAT: { correct: 3, fail: 1, review: 2, lastSeen: 1700000000000 } };
        g.saveGlobal();

        const g2 = makeGame({ keepStorage: true }); // 构造器里 loadGlobalSave
        assert.strictEqual(g2.coins, 1234);
        assert.strictEqual(g2.level, 7);
        assert.deepStrictEqual(g2.learnedWords, g.learnedWords);
        assert.strictEqual(g2.skin, 'pixel');
        assert.deepStrictEqual(g2.wordMastery, g.wordMastery);
    });

    test('扩展字段一致：bombs/toolInventory/companionGrowth/equippedCompanion/speakEnabled', () => {
        const g = makeGame();
        g.bombs = 3;
        g.toolInventory = { retry_card: 2 };
        g.companionGrowth = { dino: 9 };
        g.unlockedCompanions = ['dino', 'mecha'];
        g.equippedCompanion = 'mecha';
        g.sound.speakEnabled = false;
        g.saveGlobal();

        const g2 = makeGame({ keepStorage: true });
        assert.strictEqual(g2.bombs, 3);
        assert.deepStrictEqual(g2.toolInventory, { retry_card: 2 });
        assert.deepStrictEqual(g2.companionGrowth, { dino: 9 });
        assert.strictEqual(g2.equippedCompanion, 'mecha');
        assert.strictEqual(g2.sound.speakEnabled, false);
    });
});

describe('损坏与缺省容错', () => {
    test('损坏 JSON 存档：不崩溃，回落默认值', () => {
        memoryStore.clear();
        memoryStore.set('wordMatchGlobal', '{"coins": 999, oops');
        let g;
        assert.doesNotThrow(() => { g = makeGame({ keepStorage: true }); });
        assert.strictEqual(g.coins, 0);
        assert.strictEqual(g.level, 1);
        assert.strictEqual(g.learnedWords.length, 0);
    });

    test('空存档：全部字段落在构造器默认值', () => {
        const g = makeGame(); // 清空存储
        assert.strictEqual(g.coins, 0);
        assert.strictEqual(g.level, 1);
        assert.deepStrictEqual(plain(g.unlockedCompanions), ['dino']);
        assert.strictEqual(g.nextBombAt, 8000);
    });

    test('旧版本存档（version 1）：nextBombAt 迁移到至少 8000', () => {
        memoryStore.clear();
        memoryStore.set('wordMatchGlobal', JSON.stringify({ version: 1, coins: 50, nextBombAt: 100 }));
        const g = makeGame({ keepStorage: true });
        assert.strictEqual(g.coins, 50);
        assert.ok(g.nextBombAt >= 8000);
    });
});

describe('日期与随机工具', () => {
    test('getDateKey 输出 YYYY-MM-DD', () => {
        const g = makeGame();
        assert.match(g.getDateKey(), /^\d{4}-\d{2}-\d{2}$/);
        assert.strictEqual(g.getDateKey(new Date(2026, 0, 5)), '2026-01-05');
    });

    test('hashString 确定性且非负', () => {
        const g = makeGame();
        assert.strictEqual(g.hashString('2026-07-07'), g.hashString('2026-07-07'));
        assert.notStrictEqual(g.hashString('2026-07-07'), g.hashString('2026-07-08'));
        assert.ok(g.hashString('anything') >= 0);
    });

    test('seededPick 确定性、数量正确、无重复、是原池子集', () => {
        const g = makeGame();
        const pool = ['a', 'b', 'c', 'd', 'e', 'f'];
        const p1 = g.seededPick(pool, 3, 42);
        const p2 = g.seededPick(pool, 3, 42);
        assert.deepStrictEqual(p1, p2, '同种子结果一致');
        assert.strictEqual(p1.length, 3);
        assert.strictEqual(new Set(p1).size, 3, '无重复');
        assert.ok(p1.every(x => pool.includes(x)));
        assert.deepStrictEqual(pool.length, 6, '不改动原池');
    });
});
