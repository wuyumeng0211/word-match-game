// tests/mastery.test.js — 学习闭环：掌握度打分与边界
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame } = require('./bootstrap.js');

describe('updateMastery 对 score 的影响方向', () => {
    test('correct：score 上升', () => {
        const g = makeGame();
        const before = g.getMasteryInfo('CAT').score;
        g.updateMastery('CAT', 'correct');
        assert.ok(g.getMasteryInfo('CAT').score > before);
    });

    test('review：score 上升', () => {
        const g = makeGame();
        const before = g.getMasteryInfo('DOG').score;
        g.updateMastery('DOG', 'review');
        assert.ok(g.getMasteryInfo('DOG').score > before);
    });

    test('fail：score 相对下降（不会低于 0）', () => {
        const g = makeGame();
        g.updateMastery('SUN', 'correct');
        g.updateMastery('SUN', 'correct');
        const before = g.getMasteryInfo('SUN').score;
        g.updateMastery('SUN', 'fail');
        const after = g.getMasteryInfo('SUN').score;
        assert.ok(after < before, `fail 应拉低 score（${before} -> ${after}）`);
        // 纯 fail 也不为负
        for (let i = 0; i < 10; i++) g.updateMastery('BED', 'fail');
        assert.strictEqual(g.getMasteryInfo('BED').score, 0);
    });

    test('lastSeen 被更新为当前时间', () => {
        const g = makeGame();
        const t0 = Date.now();
        g.updateMastery('PEN', 'correct');
        assert.ok(g.wordMastery.PEN.lastSeen >= t0);
    });
});

describe('getMasteryInfo 边界', () => {
    test('未见过的词：score 0、计数全 0、等级为初见', () => {
        const g = makeGame();
        const info = g.getMasteryInfo('NEVERSEEN');
        assert.strictEqual(info.score, 0);
        assert.strictEqual(info.correct, 0);
        assert.strictEqual(info.fail, 0);
        assert.strictEqual(info.review, 0);
        assert.strictEqual(info.name, '初见');
        assert.strictEqual(info.percent, 0);
    });

    test('percent 始终被夹在 0..100', () => {
        const g = makeGame();
        for (let i = 0; i < 20; i++) g.updateMastery('HI', 'correct');
        assert.strictEqual(g.getMasteryInfo('HI').percent, 100);
        for (let i = 0; i < 20; i++) g.updateMastery('LO', 'fail');
        assert.strictEqual(g.getMasteryInfo('LO').percent, 0);
    });

    test('等级阶梯：score 0/2/5/9/14 分别对应 初见/认识/熟悉/掌握/已巩固', () => {
        const g = makeGame();
        const now = Date.now();
        const cases = [
            [0, '初见'], [1, '认识'], [3, '熟悉'], [5, '掌握'], [7, '已巩固']
        ]; // correct*2 = score（lastSeen 为今天，无衰减）
        for (const [correct, expected] of cases) {
            const word = 'W' + correct;
            g.wordMastery[word] = { correct, fail: 0, review: 0, lastSeen: now };
            // 边界修正：0 correct 时不写 lastSeen 也应是初见
            const info = g.getMasteryInfo(word);
            assert.strictEqual(info.name, expected, `correct=${correct} score=${info.score}`);
        }
    });

    test('时间衰减：9 天没见，raw score 4 衰减 3 只剩 1', () => {
        const g = makeGame();
        g.wordMastery.OLD = { correct: 2, fail: 0, review: 0, lastSeen: Date.now() - 9 * 86400000 };
        assert.strictEqual(g.getMasteryInfo('OLD').score, 1);
    });
});
