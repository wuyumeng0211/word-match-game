// tests/companion.test.js — 伙伴养成：六级阈值 / 羁绊升级 / 道具 / 改名
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame } = require('./bootstrap.js');

// 六级阈值 THRESHOLDS = [0, 3, 8, 16, 28, 45]
describe('getCompanionGrowth 六级阈值边界', () => {
    const boundaries = [
        [1, 0, 2],   // level, 下边界, 上边界（该级最后一点）
        [2, 3, 7],
        [3, 8, 15],
        [4, 16, 27],
        [5, 28, 44],
        [6, 45, 999]
    ];
    for (const [level, lo, hi] of boundaries) {
        test(`羁绊 ${lo}~${hi} 点 → ${level} 级`, () => {
            const g = makeGame();
            for (const points of [lo, hi]) {
                g.companionGrowth.dino = points;
                const growth = g.getCompanionGrowth('dino');
                assert.strictEqual(growth.level, level, `points=${points}`);
            }
        });
    }

    test('满级（45+）：isMax、next 为 MAX、percent 100', () => {
        const g = makeGame();
        g.companionGrowth.dino = 45;
        const growth = g.getCompanionGrowth('dino');
        assert.strictEqual(growth.isMax, true);
        assert.strictEqual(growth.next, 'MAX');
        assert.strictEqual(growth.percent, 100);
    });

    test('未满级：next 指向下一阈值，percent 不超过 100', () => {
        const g = makeGame();
        g.companionGrowth.dino = 5; // 2 级（3~7）
        const growth = g.getCompanionGrowth('dino');
        assert.strictEqual(growth.next, 8);
        assert.ok(growth.percent >= 0 && growth.percent <= 100);
    });
});

describe('gainCompanionBond', () => {
    test('跨过阈值：evolved 为 true，并解锁改名', () => {
        const g = makeGame();
        g.companionGrowth.dino = 2;
        const result = g.gainCompanionBond('dino', 1); // 2 -> 3，升 2 级
        assert.strictEqual(result.evolved, true);
        assert.strictEqual(result.growth.level, 2);
        assert.strictEqual(g.companionRenameUnlocked.dino, 2);
    });

    test('未跨阈值：evolved 为 false，羁绊正常累加', () => {
        const g = makeGame();
        const result = g.gainCompanionBond('dino', 1); // 0 -> 1，仍 1 级
        assert.strictEqual(result.evolved, false);
        assert.strictEqual(g.companionGrowth.dino, 1);
    });

    test('amount 为 0 或 id 为空：直接返回 {growth:null, evolved:false}', () => {
        const g = makeGame();
        const r1 = g.gainCompanionBond('dino', 0);
        assert.strictEqual(r1.growth, null);
        assert.strictEqual(r1.evolved, false);
        const r2 = g.gainCompanionBond('', 1);
        assert.strictEqual(r2.growth, null);
        assert.strictEqual(r2.evolved, false);
        assert.strictEqual(g.companionGrowth.dino || 0, 0);
    });
});

describe('useCompanionItem', () => {
    test('库存为 0：拒绝，步数不变', () => {
        const g = makeGame();
        const moves = g.moves;
        g.useCompanionItem();
        assert.strictEqual(g.moves, moves);
        assert.ok(g._toasts.some(t => t.includes('购买')));
    });

    test('小恐龙 1 级道具：步数 +5，库存递减到 0', () => {
        const g = makeGame();
        g.companionInventory.dino_snack = 1;
        g.moves = 10;
        g.useCompanionItem();
        assert.strictEqual(g.moves, 15);
        assert.strictEqual(g.companionInventory.dino_snack, 0);
    });

    test('无尽模式用小恐龙道具：拒绝且不消耗库存', () => {
        const g = makeGame();
        g.gameMode = 'endless';
        g.companionInventory.dino_snack = 1;
        g.useCompanionItem();
        assert.strictEqual(g.companionInventory.dino_snack, 1);
        assert.ok(g._toasts.some(t => t.includes('无尽模式')));
    });

    test('机甲道具：护盾步数 +3（1 级）', () => {
        const g = makeGame();
        g.unlockedCompanions.push('mecha');
        g.equippedCompanion = 'mecha';
        g.companionInventory.mecha_cell = 1;
        g.useCompanionItem();
        assert.strictEqual(g.mechaShieldMoves, 3);
        assert.strictEqual(g.companionInventory.mecha_cell, 0);
    });
});

describe('renameCompanion', () => {
    test('未进化：拒绝改名', () => {
        const g = makeGame();
        g.uiPromptCompanionName = () => '小小龙';
        g.renameCompanion('dino');
        assert.strictEqual(g.companionNames.dino, undefined);
        assert.ok(g._toasts.some(t => t.includes('进化后')));
    });

    test('已进化 + 输入合法：改名成功（截断到 6 个字）', () => {
        const g = makeGame();
        g.companionRenameUnlocked.dino = 2;
        g.uiPromptCompanionName = () => '  超级无敌小恐龙  ';
        g.renameCompanion('dino');
        assert.strictEqual(g.companionNames.dino, '超级无敌小恐');
        assert.strictEqual(g.getCompanionName('dino'), '超级无敌小恐');
    });

    test('取消输入（null）：名字不变', () => {
        const g = makeGame();
        g.companionRenameUnlocked.dino = 2;
        g.uiPromptCompanionName = () => null;
        g.renameCompanion('dino');
        assert.strictEqual(g.companionNames.dino, undefined);
    });

    test('输入空白：拒绝并提示', () => {
        const g = makeGame();
        g.companionRenameUnlocked.dino = 2;
        g.uiPromptCompanionName = () => '   ';
        g.renameCompanion('dino');
        assert.strictEqual(g.companionNames.dino, undefined);
        assert.ok(g._toasts.some(t => t.includes('名字不能为空')));
    });

    test('getCompanionName 未改名时返回默认名', () => {
        const g = makeGame();
        assert.strictEqual(g.getCompanionName('dino'), '阿啦');
        assert.strictEqual(g.getCompanionName('unknown_id'), '伙伴');
    });
});
