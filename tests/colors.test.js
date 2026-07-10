// tests/colors.test.js — 字母配色：像素色位按字母池动态分配（同关不撞色）
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame, setWord } = require('./bootstrap.js');

function builtMap(word, opts = {}) {
    const g = makeGame();
    setWord(g, word, opts);
    g.buildLetterColorMap();
    return g.letterColorMap;
}

describe('像素色位 pxIndex', () => {
    test('池内前 8 个字母互不同色（旧版 charCode 循环 A/I 同红的回归防线）', () => {
        // AIR 的 A、I 在旧静态映射里同为红色；动态分配后必须不同
        const map = builtMap('AIR', { level: 1 });
        const letters = Object.keys(map);
        assert.ok(letters.length <= 8, `前置：低难度池 ${letters.length} 个字母不超 8`);
        const seen = new Set(letters.map(ch => map[ch].pxIndex));
        assert.strictEqual(seen.size, letters.length, '池内 pxIndex 应两两不同');
        assert.ok(letters.every(ch => map[ch].pxCycle === 0), '未溢出时不标记周期');
    });

    test('目标字母排在色位前列（最常出现的字母优先占用高区分度色）', () => {
        const map = builtMap('BIG', { level: 1 });
        for (const ch of ['B', 'G', 'I']) {
            assert.ok(map[ch].pxIndex < 3, `目标字母 ${ch} 应占 0-2 号色位，实际 ${map[ch].pxIndex}`);
        }
    });

    test('字母池超 8 个时：溢出字母循环用色并带 pxCycle 标记', () => {
        // 高难度：目标字母多 + extras 多，凑出 >8 的池
        const map = builtMap('CHOCOLATE', { level: 21, boardSize: 7 });
        const letters = Object.keys(map);
        if (letters.length > 8) {
            const overflow = letters.filter(ch => map[ch].pxCycle > 0);
            assert.ok(overflow.length === letters.length - 8, '第 9 个起都应标记溢出周期');
            assert.ok(overflow.every(ch => map[ch].pxIndex < 8), '溢出色位仍在 0-7');
        } else {
            // 池不足 9 时该用例退化为不撞色断言
            const seen = new Set(letters.map(ch => map[ch].pxIndex));
            assert.strictEqual(seen.size, letters.length);
        }
    });

    test('近亲色阈值：距离 <58 的后来色必须带花纹', () => {
        const g = makeGame();
        setWord(g, 'CHOCOLATE', { level: 21, boardSize: 7 });
        g.buildLetterColorMap();
        const entries = Object.values(g.letterColorMap);
        // 逐对检查：若两色 Lab 距离 <58，至少一方有花纹（可区分）
        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const d = g.colorDistance(entries[i].bg, entries[j].bg);
                if (d < 58) {
                    assert.ok(entries[i].pattern || entries[j].pattern,
                        `近亲色对 ${entries[i].bg}/${entries[j].bg}（距离 ${d.toFixed(1)}）应有花纹区分`);
                }
            }
        }
    });
});
