// tests/special.test.js — 特殊块系统：编码 / 连串分组 / 生成 / 十字引爆 / 万能交换 / 守护
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame, setWord } = require('./bootstrap.js');

// 已知死板（与 board.test.js 同款）：任意交换绝无三连
function deadBoard(size = 6) {
    const board = [];
    for (let r = 0; r < size; r++) {
        board.push([]);
        for (let c = 0; c < size; c++) {
            board[r][c] = (r % 2 ? 'DEF' : 'ABC')[c % 3];
        }
    }
    return board;
}

// 确定性补位：被消格子按死板花纹回填（不走随机池），杜绝连锁与洗牌带来的测试抖动。
// 只替换补位逻辑，移除语义不变——重力下落不在本文件的测试目标内（board.test.js 已覆盖）。
function stubFill(g) {
    g.removeAndFill = function (matches) {
        for (const m of matches) {
            this.board[m.r][m.c] = (m.r % 2 ? 'DEF' : 'ABC')[m.c % 3];
        }
    };
}

function freshGame(word = 'CAT', opts = {}) {
    const g = makeGame();
    setWord(g, word, opts);
    g.instantAnimations = true;  // 跳过 processMatches 的动画等待
    g.board = deadBoard();
    return g;
}

// 死板盘在消除收尾时会触发自动洗牌，把盘面（含特殊块位置）搅乱——
// 需要断言盘面终态的用例先冻结洗牌（洗牌本身的行为有独立用例覆盖）
function freezeReshuffle(g) {
    g.reshuffleBoard = () => {};
}

describe('特殊块编码助手', () => {
    test('cellLetter：十字块取字母，万能块为 null，普通字母原样', () => {
        const g = freshGame();
        assert.strictEqual(g.cellLetter('*A'), 'A');
        assert.strictEqual(g.cellLetter('?'), null);
        assert.strictEqual(g.cellLetter('B'), 'B');
    });

    test('isCrossCell / isWildCell / isSpecialCell', () => {
        const g = freshGame();
        assert.strictEqual(g.isCrossCell('*A'), true);
        assert.strictEqual(g.isCrossCell('A'), false);
        assert.strictEqual(g.isWildCell('?'), true);
        assert.strictEqual(g.isWildCell('*A'), false);
        assert.strictEqual(g.isSpecialCell('*A'), true);
        assert.strictEqual(g.isSpecialCell('?'), true);
        assert.strictEqual(g.isSpecialCell('A'), false);
    });
});

describe('连串分组与匹配', () => {
    test('十字块按其字母参与三连', () => {
        const g = freshGame();
        g.board[2][1] = 'X'; g.board[2][2] = '*X'; g.board[2][3] = 'X';
        const found = g.findMatches().map(m => `${m.r},${m.c}`).sort();
        assert.deepStrictEqual([...found], ['2,1', '2,2', '2,3']);
        assert.ok(g.findMatches().every(m => m.letter === 'X'), '匹配项带有效字母');
    });

    test('万能块不参与任何连线', () => {
        const g = freshGame();
        g.board[2][1] = 'X'; g.board[2][2] = '?'; g.board[2][3] = 'X';
        assert.strictEqual(g.findMatches().length, 0, '? 不补中间');
        g.board[4][0] = g.board[4][1] = g.board[4][2] = '?';
        assert.strictEqual(g.findMatches().length, 0, '三个 ? 不算连线');
    });

    test('findMatchGroups 保留连串长度与方向', () => {
        const g = freshGame();
        g.board[1][1] = g.board[1][2] = g.board[1][3] = g.board[1][4] = 'X';
        g.board[3][5] = g.board[4][5] = g.board[5][5] = 'Y';
        const groups = g.findMatchGroups();
        const h = groups.find(x => x.dir === 'h'), v = groups.find(x => x.dir === 'v');
        assert.strictEqual(h.letter, 'X');
        assert.strictEqual(h.cells.length, 4);
        assert.strictEqual(v.letter, 'Y');
        assert.strictEqual(v.cells.length, 3);
    });
});

describe('特殊块生成（processMatches）', () => {
    test('恰 4 连：在玩家交换格原地生成十字块', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        g.board[1][1] = g.board[1][2] = g.board[1][3] = g.board[1][4] = 'X';
        g._lastSwapCells = [{ r: 1, c: 3 }, { r: 0, c: 3 }];
        await g.processMatches(g.findMatches());
        assert.strictEqual(g.board[1][3], '*X', '交换格原地留十字块');
        assert.strictEqual(g.board[1][1], 'E', '其余连串格被消除回填');
    });

    test('连锁波（无交换格）：十字块生成在连串中间', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        g.board[1][1] = g.board[1][2] = g.board[1][3] = g.board[1][4] = 'X';
        await g.processMatches(g.findMatches());
        assert.strictEqual(g.board[1][3], '*X', '4 连中间格（下标 2）');
    });

    test('5 连及以上：生成万能块', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        for (let c = 0; c <= 4; c++) g.board[1][c] = 'X';
        g._lastSwapCells = [{ r: 1, c: 0 }, { r: 2, c: 0 }];
        await g.processMatches(g.findMatches());
        assert.strictEqual(g.board[1][0], '?', '5 连在交换格生成万能块');
    });

    test('恰 3 连：不生成任何特殊块', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][1] = g.board[2][2] = g.board[2][3] = 'X';
        g._lastSwapCells = [{ r: 2, c: 2 }, { r: 3, c: 2 }];
        await g.processMatches(g.findMatches());
        const flat = g.board.flat();
        assert.ok(!flat.some(cell => g.isSpecialCell(cell)), '盘上不应有特殊块');
    });

    test('炸弹波（任意 3 格、无连串）：不生成特殊块', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        const bombCells = [{ r: 0, c: 0 }, { r: 2, c: 3 }, { r: 5, c: 5 }]
            .map(t => ({ ...t, letter: g.cellLetter(g.board[t.r][t.c]) }));
        await g.processMatches(bombCells);
        const flat = g.board.flat();
        assert.ok(!flat.some(cell => g.isSpecialCell(cell)));
    });
});

describe('十字块引爆', () => {
    test('十字块被消：整行整列进移除集，基础全价+波及半价', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][1] = 'X'; g.board[2][2] = '*X'; g.board[2][3] = 'X';
        const before = g.score;
        await g.processMatches(g.findMatches());
        // 基础 3 格 ×10 + 波及（行 2 其余 3 格 + 列 2 其余 5 格）8 格 ×5 = 70
        assert.strictEqual(g.score - before, 70);
        assert.ok(!g.board.flat().some(cell => g.isCrossCell(cell)), '十字块已消耗');
    });

    test('引爆顺带收集目标字母（封顶不超所需）', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][1] = 'X'; g.board[2][2] = '*X'; g.board[2][3] = 'X';
        await g.processMatches(g.findMatches());
        // 行 2 波及 A(2,0)与 C(2,5)，列 2 波及 C(0,2)/C(4,2)——C 出现多次但封顶 1
        assert.strictEqual(g.collectedLetters.A, 1);
        assert.strictEqual(g.collectedLetters.C, 1);
        assert.strictEqual(g.collectedLetters.T, 0);
    });

    test('行列中的第二枚十字块链式引爆', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][1] = 'X'; g.board[2][2] = '*X'; g.board[2][3] = 'X';
        g.board[4][2] = '*Y';  // 在列 2 的波及范围内
        const before = g.score;
        await g.processMatches(g.findMatches());
        // 基础 3×10 + 波及 13×5（行2:3 + 列2:5 + 链式行4:5）= 95
        assert.strictEqual(g.score - before, 95);
        assert.ok(!g.board.flat().some(cell => g.isCrossCell(cell)));
    });

    test('本波新生的特殊块不被同波引爆波及', async () => {
        const g = freshGame();
        stubFill(g);
        freezeReshuffle(g);
        // 4 连（生成十字）与另一枚现存十字同列相交：新块必须活过本波
        g.board[1][1] = g.board[1][2] = g.board[1][3] = g.board[1][4] = 'X';
        g.board[3][3] = '*Y';
        g.board[3][2] = 'Y'; g.board[3][4] = 'Y';  // 让 *Y 也在本波被消（横向 3 连）
        g._lastSwapCells = [{ r: 1, c: 3 }, { r: 0, c: 3 }];
        await g.processMatches(g.findMatches());
        assert.strictEqual(g.board[1][3], '*X', '新十字在 *Y 的列引爆范围内仍幸存');
    });
});

describe('万能块交换', () => {
    test('与相邻字母交换：清全盘该字母，计分半价，消耗一步', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][2] = '?';
        g.moves = 10;
        const before = g.score;
        await g.trySwap(2, 2, 2, 3);  // (2,3)='A'
        // 全盘 A：偶数行(0,2,4)×列(0,3)=6 枚，其中 (2,0) 一枚 + 其余 5，加万能自身 = 7 格 ×5 = 35
        assert.strictEqual(g.score - before, 35);
        assert.strictEqual(g.collectedLetters.A, 1, '收集封顶');
        assert.strictEqual(g.moves, 9, '消耗一步');
        assert.ok(!g.board.flat().some(cell => g.isWildCell(cell)), '万能块已消耗');
    });

    test('双万能相邻交换：清空整盘', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][2] = '?'; g.board[2][3] = '?';
        g.moves = 10;
        const before = g.score;
        await g.trySwap(2, 2, 2, 3);
        assert.strictEqual(g.score - before, 36 * 5, '36 格全清 ×5 分');
        assert.deepStrictEqual(
            { C: g.collectedLetters.C, A: g.collectedLetters.A, T: g.collectedLetters.T },
            { C: 1, A: 1, T: 0 },
            '清盘收集 C/A（死板盘无 T，封顶各 1）'
        );
    });

    test('清字母时波及的十字块照常引爆', async () => {
        const g = freshGame('CAT');
        stubFill(g);
        freezeReshuffle(g);
        g.board[2][2] = '?';
        g.board[4][3] = '*A';  // 全盘清 A 会点到它 → 引爆行 4 + 列 3
        const before = g.score;
        await g.trySwap(2, 2, 2, 3);
        // 基础：全盘 A（6 枚，其中 (4,3) 已换成 *A 仍算 A）+ 万能自身 = 7；
        // 波及：行 4 其余 4 格（(4,0) 是 A 已在基础）+ 列 3 其余 4 格（(0,3)(2,3) 是 A 已在基础）
        assert.ok(g.score - before > 7 * 5, '有引爆波及，分数高于仅清字母');
        assert.ok(!g.board.flat().some(cell => g.isSpecialCell(cell)));
    });

    test('盘上有万能块时永远有可行步（不触发洗牌）', () => {
        const g = freshGame();
        assert.strictEqual(g.hasAnyValidMove(), false, '前置：死板');
        g.board[3][3] = '?';
        assert.strictEqual(g.hasAnyValidMove(), true);
    });
});

describe('守护：特殊块不被系统动作吞掉', () => {
    test('removeInitialMatches 破坏连串但永不改写特殊块', () => {
        const g = freshGame();
        g.board[2][1] = 'X'; g.board[2][2] = '*X'; g.board[2][3] = 'X';
        g.removeInitialMatches();
        assert.strictEqual(g.board[2][2], '*X', '十字块原样保留');
        assert.strictEqual(g.findMatches().length, 0, '连串已被普通格重掷破坏');
    });

    test('plantGuaranteedMove 的植入点避开特殊块', () => {
        const g = freshGame();
        g.board[2][2] = '*A'; g.board[3][3] = '?';
        const ok = g.plantGuaranteedMove();
        assert.strictEqual(ok, true);
        assert.strictEqual(g.board[2][2], '*A');
        assert.strictEqual(g.board[3][3], '?');
    });

    test('reshuffleBoard 洗牌后特殊块数量不变', () => {
        const g = freshGame();
        g.board[1][1] = '*A'; g.board[4][4] = '?';
        g.reshuffleBoard(false);
        const flat = g.board.flat();
        assert.strictEqual(flat.filter(cell => g.isCrossCell(cell)).length, 1);
        assert.strictEqual(flat.filter(cell => g.isWildCell(cell)).length, 1);
    });
});
