// tests/economy.test.js — 经济系统：购买 / 库存 / 炸弹奖励
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame } = require('./bootstrap.js');

describe('buyTool', () => {
    test('金币不足：拒绝购买，金币与库存不变', () => {
        const g = makeGame();
        g.coins = 100; // first_hint 价格 600
        g.buyTool('first_hint');
        assert.strictEqual(g.coins, 100);
        assert.strictEqual(g.toolInventory.first_hint || 0, 0);
        assert.ok(g._toasts.some(t => t.includes('积分不足')));
    });

    test('金币足够：扣款并入库存', () => {
        const g = makeGame();
        g.coins = 600;
        g.buyTool('first_hint');
        assert.strictEqual(g.coins, 0);
        assert.strictEqual(g.toolInventory.first_hint, 1);
    });

    test('重复购买同一道具：库存累加', () => {
        const g = makeGame();
        g.coins = 1800;
        g.buyTool('definition_card'); // 900
        g.buyTool('definition_card');
        assert.strictEqual(g.coins, 0);
        assert.strictEqual(g.toolInventory.definition_card, 2);
    });

    test('review_boost：不入库存，置 reviewBoostActive 标志', () => {
        const g = makeGame();
        g.coins = 2200;
        g.buyTool('review_boost');
        assert.strictEqual(g.coins, 0);
        assert.strictEqual(g.reviewBoostActive, true);
        assert.strictEqual(g.toolInventory.review_boost || 0, 0);
    });

    test('未知道具 id：不扣款', () => {
        const g = makeGame();
        g.coins = 5000;
        g.buyTool('no_such_tool');
        assert.strictEqual(g.coins, 5000);
    });
});

describe('buySkin / equipSkin', () => {
    test('金币不足：拒绝，不解锁', () => {
        const g = makeGame();
        g.coins = 1000; // ocean_theme 价格 1500
        g.buySkin('ocean_theme');
        assert.strictEqual(g.coins, 1000);
        assert.ok(!g.unlockedSkins.includes('ocean_theme'));
    });

    test('金币足够：扣款、入 unlockedSkins 并自动装备', () => {
        const g = makeGame();
        g.coins = 1500;
        g.buySkin('ocean_theme');
        assert.strictEqual(g.coins, 0);
        assert.ok(g.unlockedSkins.includes('ocean_theme'));
        assert.strictEqual(g.equippedTheme, 'ocean_theme');
    });

    test('已拥有的皮肤：不重复扣款', () => {
        const g = makeGame();
        g.coins = 3000;
        g.buySkin('ocean_theme');
        g.buySkin('ocean_theme');
        assert.strictEqual(g.coins, 1500);
        assert.strictEqual(g.unlockedSkins.filter(s => s === 'ocean_theme').length, 1);
    });

    test('equipSkin 未解锁的皮肤：拒绝装备', () => {
        const g = makeGame();
        g.equipSkin('gold_theme');
        assert.strictEqual(g.equippedTheme, 'default_theme');
    });
});

describe('consumeTool', () => {
    test('有库存：返回 true 并递减', () => {
        const g = makeGame();
        g.toolInventory.retry_card = 2;
        assert.strictEqual(g.consumeTool('retry_card'), true);
        assert.strictEqual(g.toolInventory.retry_card, 1);
    });

    test('递减到 0 后再消耗：返回 false，不为负', () => {
        const g = makeGame();
        g.toolInventory.retry_card = 1;
        assert.strictEqual(g.consumeTool('retry_card'), true);
        assert.strictEqual(g.toolInventory.retry_card, 0);
        assert.strictEqual(g.consumeTool('retry_card'), false);
        assert.strictEqual(g.toolInventory.retry_card, 0, '库存不允许为负');
    });

    test('从未拥有的道具：返回 false', () => {
        const g = makeGame();
        assert.strictEqual(g.consumeTool('sentence_card'), false);
    });
});

describe('checkBombReward', () => {
    test('金币跨过多个 8000 阈值：一次性补发对应数量炸弹', () => {
        const g = makeGame();
        g.coins = 16500; // 跨过 8000 与 16000
        g.checkBombReward();
        assert.strictEqual(g.bombs, 2);
        assert.strictEqual(g.nextBombAt, 24000);
    });

    test('未达阈值：不发炸弹', () => {
        const g = makeGame();
        g.coins = 7999;
        g.checkBombReward();
        assert.strictEqual(g.bombs, 0);
        assert.strictEqual(g.nextBombAt, 8000);
    });
});

describe('buyCompanion', () => {
    test('金币不足：拒绝解锁', () => {
        const g = makeGame();
        g.coins = 100; // mecha 价格 5200
        g.buyCompanion('mecha');
        assert.ok(!g.unlockedCompanions.includes('mecha'));
        assert.strictEqual(g.coins, 100);
    });

    test('金币足够：扣款、解锁并自动出战', () => {
        const g = makeGame();
        g.coins = 5200;
        g.buyCompanion('mecha');
        assert.strictEqual(g.coins, 0);
        assert.ok(g.unlockedCompanions.includes('mecha'));
        assert.strictEqual(g.equippedCompanion, 'mecha');
    });
});
