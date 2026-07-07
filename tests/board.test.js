// tests/board.test.js — 棋盘核心：生成 / 三连识别 / 消除填充 / 死板恢复
'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');
const { makeGame, setWord, plain } = require('./bootstrap.js');

// 已知死板：偶数行 ABCABC…、奇数行 DEFDEF…（周期 3 且相邻行字母集不相交，
// 任意一次交换最多产生两连，绝无三连）
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

function freshGame(word = 'CAT', opts = {}) {
    const g = makeGame();
    setWord(g, word, opts);
    return g;
}

function assertBoardFull(g) {
    assert.strictEqual(g.board.length, g.boardSize);
    for (let r = 0; r < g.boardSize; r++) {
        assert.strictEqual(g.board[r].length, g.boardSize);
        for (let c = 0; c < g.boardSize; c++) {
            assert.match(g.board[r][c], /^[A-Z]$/, `cell (${r},${c}) should be a letter`);
        }
    }
}

describe('generateBoard', () => {
    const samples = [
        ['低难度 3 字母词 6x6', 'CAT', { level: 1, boardSize: 6 }],
        ['中难度 5 字母词 6x6', 'MOUSE', { level: 8, boardSize: 6 }],
        ['高难度 9 字母词 7x7', 'CHOCOLATE', { level: 20, boardSize: 7 }]
    ];
    for (const [name, word, opts] of samples) {
        test(`${name}：50 次抽样均无现成三连且必有可行步`, () => {
            for (let i = 0; i < 50; i++) {
                const g = freshGame(word, opts);
                g.generateBoard();
                assertBoardFull(g);
                assert.strictEqual(g.findMatches().length, 0, '生成后不应有现成三连');
                assert.strictEqual(g.hasAnyValidMove(), true, '生成后必须有可行步');
            }
        });
    }
});

describe('findMatches', () => {
    test('横向三连：识别且只识别这 3 格', () => {
        const g = freshGame();
        g.board = deadBoard();
        g.board[2][1] = g.board[2][2] = g.board[2][3] = 'X';
        const found = plain(g.findMatches().map(m => `${m.r},${m.c}`).sort());
        assert.deepStrictEqual(found, ['2,1', '2,2', '2,3']);
    });

    test('纵向三连：识别且只识别这 3 格', () => {
        const g = freshGame();
        g.board = deadBoard();
        g.board[1][4] = g.board[2][4] = g.board[3][4] = 'X';
        const found = plain(g.findMatches().map(m => `${m.r},${m.c}`).sort());
        assert.deepStrictEqual(found, ['1,4', '2,4', '3,4']);
    });

    test('十字（横竖共享中心）：识别全部 5 格', () => {
        const g = freshGame();
        g.board = deadBoard();
        g.board[2][1] = g.board[2][2] = g.board[2][3] = 'X';
        g.board[1][2] = g.board[3][2] = 'X';
        const found = plain(g.findMatches().map(m => `${m.r},${m.c}`).sort());
        assert.deepStrictEqual(found, ['1,2', '2,1', '2,2', '2,3', '3,2']);
    });

    test('四连：整条 4 格都被识别', () => {
        const g = freshGame();
        g.board = deadBoard();
        g.board[5][0] = g.board[5][1] = g.board[5][2] = g.board[5][3] = 'X';
        assert.strictEqual(g.findMatches().length, 4);
    });

    test('死板无三连：返回空数组，且 match 项带正确字母', () => {
        const g = freshGame();
        g.board = deadBoard();
        assert.strictEqual(g.findMatches().length, 0);
        g.board[0][0] = g.board[0][1] = g.board[0][2] = 'Z';
        assert.ok(g.findMatches().every(m => m.letter === 'Z'));
    });
});

describe('removeAndFill', () => {
    test('消除后棋盘仍满，且每格都是合法字母', () => {
        const g = freshGame('CAT');
        g.board = deadBoard();
        const matches = [{ r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }];
        g.removeAndFill(matches);
        assertBoardFull(g);
    });

    test('重力下落：被消格子上方的字母按序落下，新字母从顶部补入', () => {
        const g = freshGame('CAT');
        g.board = deadBoard();
        const col0Before = [0, 1, 2, 3, 4].map(r => g.board[r][0]);
        g.removeAndFill([{ r: 5, c: 0 }]);
        // 原 0..4 行的字母整体下移一格到 1..5 行
        for (let r = 0; r < 5; r++) {
            assert.strictEqual(g.board[r + 1][0], col0Before[r]);
        }
        assert.match(g.board[0][0], /^[A-Z]$/, '顶部补入新字母');
    });
});

describe('plantGuaranteedMove / pickPlantLetter', () => {
    test('死板植入后必有可行步且无现成三连', () => {
        const g = freshGame('CAT');
        g.board = deadBoard();
        assert.strictEqual(g.hasAnyValidMove(), false, '前置：死板');
        const ok = g.plantGuaranteedMove();
        assert.strictEqual(ok, true);
        assert.strictEqual(g.findMatches().length, 0);
        assert.strictEqual(g.hasAnyValidMove(), true);
    });

    test('pickPlantLetter 优先选还没收集够的目标字母', () => {
        const g = freshGame('CAT');
        g.collectedLetters = { C: 1, A: 0, T: 0 };
        for (let i = 0; i < 30; i++) {
            const letter = g.pickPlantLetter();
            assert.ok(['A', 'T'].includes(letter), `C 已收集，应从 A/T 中选，实际 ${letter}`);
        }
    });
});

describe('reshuffleBoard', () => {
    test('死板洗牌后恢复可玩：尺寸不变、无现成三连、必有可行步', () => {
        const g = freshGame('CAT');
        g.board = deadBoard();
        g.reshuffleBoard(false);
        assertBoardFull(g);
        assert.strictEqual(g.findMatches().length, 0);
        assert.strictEqual(g.hasAnyValidMove(), true);
    });
});

describe('hasAnyValidMove / findValidMove', () => {
    test('手工死板返回 false', () => {
        const g = freshGame();
        g.board = deadBoard();
        assert.strictEqual(g.hasAnyValidMove(), false);
    });

    test('死板 findValidMove 返回 null；植入后能给出具体一步', () => {
        const g = freshGame('CAT');
        g.board = deadBoard();
        assert.strictEqual(g.findValidMove(), null);
        g.plantGuaranteedMove();
        const move = g.findValidMove();
        assert.ok(move && Number.isInteger(move.r1) && Number.isInteger(move.c2));
    });
});

describe('isWin / getNextNeededLetter', () => {
    test('未收集完时 isWin 为 false，收集完为 true', () => {
        const g = freshGame('CAT');
        assert.strictEqual(g.isWin(), false);
        g.collectedLetters = { C: 1, A: 1, T: 1 };
        assert.strictEqual(g.isWin(), true);
    });

    test('重复字母的单词需要收集足量（EGG 需要 2 个 G）', () => {
        const g = freshGame('EGG');
        g.collectedLetters = { E: 1, G: 1 };
        assert.strictEqual(g.isWin(), false);
        g.collectedLetters.G = 2;
        assert.strictEqual(g.isWin(), true);
    });

    test('getNextNeededLetter 按单词顺序给出缺口，收齐后返回空串', () => {
        const g = freshGame('EGG');
        assert.strictEqual(g.getNextNeededLetter(), 'E');
        g.collectedLetters = { E: 1, G: 1 };
        assert.strictEqual(g.getNextNeededLetter(), 'G');
        g.collectedLetters.G = 2;
        assert.strictEqual(g.getNextNeededLetter(), '');
    });
});
