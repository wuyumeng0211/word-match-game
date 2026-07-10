// 棋盘核心：生成/交换/消除/连锁/提示/胜负判定
Object.assign(WordMatchGame.prototype, {
    loadLevel() {
        const group = this.wordLevels[Math.min(this.level - 1, this.wordLevels.length - 1)];
        const shuffled = [...group].sort(() => Math.random() - 0.5);
        this.targetWords = shuffled.slice(0, Math.min(3, shuffled.length));
        this.currentWordIndex = 0;
        this.setCurrentTarget(0);
        const avgLen = this.targetWords.reduce((sum, w) => sum + w.en.length, 0) / this.targetWords.length;
        this.moves = Math.floor((avgLen * 4 + 12 + Math.floor(this.level / 2)) * 1.6);
        this.levelResetCount = 0;
        this.levelBombsUsed = 0;
        this.boardSize = this.level >= 15 ? 7 : 6;
    },

    setCurrentTarget(index) {
        const w = this.targetWords[index];
        this.targetWord = w.en;
        this.targetChinese = w.cn;
        this.targetSentence = w.s;
        this.targetSentenceCn = w.sc || '';
        this.collectedLetters = {};
        for (let ch of this.targetWord) this.collectedLetters[ch] = 0;
        this.bombMode = false;
        this.bombSelected = [];
        this.letterColorMap = {};
    },

    loadRandomWord() {
        let pool;
        if (this.gameMode === 'endless') {
            const maxIndex = Math.min(this.endlessDifficulty + 2, this.wordLevels.length - 1);
            pool = [];
            for (let i = 0; i <= maxIndex; i++) pool.push(...this.wordLevels[i]);
        } else {
            pool = this.wordLevels.flat();
        }
        const wordObj = pool[Math.floor(Math.random() * pool.length)];
        this.targetWord = wordObj.en;
        this.targetChinese = wordObj.cn;
        this.targetSentence = wordObj.s;
        this.targetSentenceCn = wordObj.sc || '';
        this.collectedLetters = {};
        for (let ch of this.targetWord) this.collectedLetters[ch] = 0;
        this.moves = 999;
        this.bombMode = false;
        this.bombSelected = [];
        this.letterColorMap = {};
    },

    loadReviewWord() {
        if (this.learnedWords.length === 0) {
            this.backToMenu();
            this.showToast('还没有学过单词，先去闯关模式学习吧！');
            return;
        }
        const pool = [...this.learnedWords].sort((a, b) => {
            const ma = this.getMasteryInfo(a.en).score;
            const mb = this.getMasteryInfo(b.en).score;
            return ma - mb || Math.random() - 0.5;
        });
        this.targetWords = pool.slice(0, Math.min(3, pool.length));
        this.currentWordIndex = 0;
        this.setCurrentTarget(0);
        const avgLen = this.targetWords.reduce((sum, w) => sum + w.en.length, 0) / this.targetWords.length;
        this.moves = Math.floor((avgLen * 3 + 12) * 2.2);
    },

    loadDailyChallenge() {
        const today = this.getDateKey();
        this.dailyDate = today;
        const daySeed = this.hashString(today);
        const levelIndex = daySeed % this.wordLevels.length;
        this.dailyLevelIndex = levelIndex;
        const pool = this.wordLevels[levelIndex];
        this.targetWords = this.seededPick(pool, Math.min(3, pool.length), daySeed);
        this.currentWordIndex = 0;
        this.setCurrentTarget(0);
        const avgLen = this.targetWords.reduce((sum, w) => sum + w.en.length, 0) / this.targetWords.length;
        this.moves = Math.floor((avgLen * 4 + 18) * 2.1);
        this.levelResetCount = 0;
        this.levelBombsUsed = 0;
        this.boardSize = levelIndex >= 14 ? 7 : 6;
    },

    getLetterPool() {
        const target = [...new Set(this.targetWord.split(''))];
        let extras = ['X', 'Y', 'Z'];
        if (this.gameMode === 'story' || this.gameMode === 'daily') {
            const difficulty = this.gameMode === 'daily' ? (this.dailyLevelIndex || 0) + 1 : this.level;
            if (difficulty >= 6) extras.push('Q', 'J');
            if (difficulty >= 11) extras.push('V', 'K');
            if (difficulty >= 16) extras.push('W', 'F');
            if (difficulty >= 21) extras.push('H', 'M');
        } else if (this.gameMode === 'endless') {
            extras = ['X', 'Y', 'Z', 'Q', 'J', 'V'];
            if (this.endlessDifficulty > 2) extras.push('K', 'W');
            if (this.endlessDifficulty > 4) extras.push('F', 'H');
        }
        const pool = [...target];
        for (let e of extras) if (!target.includes(e)) pool.push(e);
        return pool;
    },

    getTargetWeight() {
        if (this.gameMode === 'endless') return 0.45;
        if (this.gameMode === 'timed') return 0.50;
        if (this.gameMode === 'review') return 0.55;
        if (this.level <= 5) return 0.60;
        if (this.level <= 12) return 0.50;
        if (this.level <= 20) return 0.42;
        return 0.35;
    },

    generateBoard(_depth) {
        const pool = this.getLetterPool();
        const targetSet = new Set(this.targetWord.split(''));
        const targetWeight = this.getTargetWeight();
        this.board = [];
        for (let r = 0; r < this.boardSize; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.boardSize; c++) {
                if (Math.random() < targetWeight && targetSet.size > 0) {
                    const arr = Array.from(targetSet);
                    this.board[r][c] = arr[Math.floor(Math.random() * arr.length)];
                } else {
                    this.board[r][c] = pool[Math.floor(Math.random() * pool.length)];
                }
            }
        }
        this.removeInitialMatches();
        if (!this.hasAnyValidMove()) {
            if ((_depth || 0) < 5) return this.generateBoard((_depth || 0) + 1);
            this.plantGuaranteedMove();
        }
        this.buildLetterColorMap();
    },

    // 选一个"还没收集到的目标字母"作为植入字母，保证死锁恢复后仍能推进拼词
    pickPlantLetter() {
        const needed = [];
        const got = {};
        for (const ch of this.targetWord) {
            got[ch] = (got[ch] || 0) + 1;
            if ((this.collectedLetters[ch] || 0) < got[ch]) needed.push(ch);
        }
        const src = needed.length ? needed : this.targetWord.split('');
        return src[Math.floor(Math.random() * src.length)];
    },

    // 构造式保证可玩：种下 L·L 横排 + 下方中间一个 L，交换一次即成三连。
    // 随机重掷可能连续失败，构造式植入必然成功——这是死板的最终兜底。
    plantGuaranteedMove() {
        const L = this.pickPlantLetter();
        for (let attempt = 0; attempt < 12; attempt++) {
            const r = Math.floor(Math.random() * (this.boardSize - 1));
            const c = Math.floor(Math.random() * (this.boardSize - 2));
            const cells = [[r, c], [r, c + 1], [r, c + 2], [r + 1, c + 1]];
            // 植入点避开特殊块（不吞玩家挣来的），换个位置重试
            if (cells.some(([rr, cc]) => this.isSpecialCell(this.board[rr][cc]))) continue;
            const backup = cells.map(([rr, cc]) => this.board[rr][cc]);
            this.board[r][c] = L;
            this.board[r][c + 2] = L;
            this.board[r + 1][c + 1] = L;
            if (this.board[r][c + 1] === L) {
                this.board[r][c + 1] = this.getLetterPool().find(x => x !== L) || 'X';
            }
            if (this.findMatches().length === 0 && this.hasAnyValidMove()) return true;
            // 植入意外形成了现成三连：还原，换个位置重试
            cells.forEach(([rr, cc], i) => { this.board[rr][cc] = backup[i]; });
        }
        this.removeInitialMatches();
        return false;
    },

    // 死锁恢复：保留现有字母重新洗牌（而非整盘重掷），玩家的字母分布不突变
    reshuffleBoard(showTip) {
        const letters = this.board.flat();
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        let k = 0;
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) this.board[r][c] = letters[k++];
        }
        this.removeInitialMatches();
        if (!this.hasAnyValidMove()) this.plantGuaranteedMove();
        this.buildLetterColorMap();
        if (showTip) this.showToast('没有可消除的组合，已自动洗牌');
    },

    removeInitialMatches() {
        let has = true, guard = 0;
        while (has && guard++ < 200) {
            const m = this.findMatches();
            if (m.length === 0) { has = false; continue; }
            for (let match of m) {
                // 永不改写特殊块（玩家挣来的）：一条连串至少含一枚普通格，破坏连串必然成功
                if (this.isSpecialCell(this.board[match.r][match.c])) continue;
                const pool = this.getLetterPool();
                let nl, tries = 0;
                do { nl = pool[Math.floor(Math.random() * pool.length)]; tries++; }
                while (tries < 40 && (
                    (match.r > 0 && this.cellLetter(this.board[match.r - 1][match.c]) === nl) ||
                    (match.r < this.boardSize - 1 && this.cellLetter(this.board[match.r + 1][match.c]) === nl) ||
                    (match.c > 0 && this.cellLetter(this.board[match.r][match.c - 1]) === nl) ||
                    (match.c < this.boardSize - 1 && this.cellLetter(this.board[match.r][match.c + 1]) === nl)
                ));
                this.board[match.r][match.c] = nl;
            }
        }
    },

    hasAnyValidMove() {
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                // 盘上有万能块=永远有步可走（与任意相邻格交换都合法），不许洗牌把它洗没意义
                if (this.isWildCell(this.board[r][c])) return true;
                if (c < this.boardSize - 1) {
                    this.swap(r, c, r, c + 1);
                    if (this.findMatches().length > 0) { this.swap(r, c, r, c + 1); return true; }
                    this.swap(r, c, r, c + 1);
                }
                if (r < this.boardSize - 1) {
                    this.swap(r, c, r + 1, c);
                    if (this.findMatches().length > 0) { this.swap(r, c, r + 1, c); return true; }
                    this.swap(r, c, r + 1, c);
                }
            }
        }
        return false;
    },

    swap(r1, c1, r2, c2) {
        const t = this.board[r1][c1]; this.board[r1][c1] = this.board[r2][c2]; this.board[r2][c2] = t;
    },

    // ===== 特殊块：字符串前缀编码（'*A'=十字块，'?'=万能块），格子仍是纯字符串 =====
    // 十字块平时当普通字母参与连线；被以任何方式移除时引爆整行整列。
    // 万能块不参与连线；与任意相邻格交换即触发，清全盘该字母（双万能=清盘）。
    cellLetter(cell) {
        if (!cell || cell === '?') return null;
        return cell.charAt(0) === '*' ? cell.slice(1) : cell;
    },
    isCrossCell(cell) { return typeof cell === 'string' && cell.charAt(0) === '*'; },
    isWildCell(cell) { return cell === '?'; },
    isSpecialCell(cell) { return this.isCrossCell(cell) || this.isWildCell(cell); },

    // 动画节拍：instantAnimations 仅测试用（跳过真实等待），玩家侧行为不变
    _animDelay(ms) {
        return this.instantAnimations ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
    },

    // renderBoard / renderTarget（纯 DOM）已迁移至 renderer-board.js

    handleClick(r, c) {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.isProcessing || this.locked) return;
        if (this.gameMode !== 'endless' && this.moves <= 0 && !this.bombMode) return;
        if (this.bombMode) { this.handleBombClick(r, c); return; }
        this.clearHint();
        if (!this.selectedTile) {
            const clicked = this.uiSelectTile(r, c);
            this.selectedTile = { r, c, el: clicked };
        } else {
            const prev = this.selectedTile;
            this.uiDeselectTile(prev.el);
            this.selectedTile = null;
            const dr = Math.abs(prev.r - r), dc = Math.abs(prev.c - c);
            if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                this.trySwap(prev.r, prev.c, r, c);
            }
        }
    },

    async trySwap(r1, c1, r2, c2) {
        this.isProcessing = true;
        // 万能块：与任意相邻格交换永远是合法一步，触发"清全盘该字母"
        if (this.isWildCell(this.board[r1][c1]) || this.isWildCell(this.board[r2][c2])) {
            await this.animateSwap(r1, c1, r2, c2);
            this.consumeMove();
            this.sound.play('swap');
            await this.activateWildSwap(r1, c1, r2, c2);
            this.checkWin();
            this.updateUI();
            this.isProcessing = false;
            if (this.gameMode !== 'endless' && this.moves <= 0 && !this.isWin()) {
                this.sound.play('lose');
                this.showModal('lose');
            }
            return;
        }
        await this.animateSwap(r1, c1, r2, c2);
        const matches = this.findMatches();
        if (matches.length > 0) {
            this.consumeMove();
            this.sound.play('swap');
            this._lastSwapCells = [{ r: r1, c: c1 }, { r: r2, c: c2 }];
            await this.processMatches(matches);
            this.checkWin();
        } else {
            this.sound.play('invalid');
            await this.uiShakeTiles(r1, c1, r2, c2);
            this.swap(r1, c1, r2, c2);
            this.renderBoard();
        }
        this.updateUI();
        this.isProcessing = false;
        if (this.gameMode !== 'endless' && this.moves <= 0 && !this.isWin()) {
            this.sound.play('lose');
            this.showModal('lose');
        }
    },

    // 一次有效操作的步数结算：机甲护盾优先抵扣（原 trySwap 内联逻辑，与万能块共用）
    consumeMove() {
        if (this.gameMode === 'endless') return;
        if (this.mechaShieldMoves > 0) {
            this.mechaShieldMoves--;
            this.showToast(`🛡️ 机甲护盾生效，剩余 ${this.mechaShieldMoves} 步`);
        } else {
            this.moves--;
        }
    },

    // 万能块激活：清全盘目标字母（双万能=清盘）。被清掉的十字块照常引爆行列。
    // 收集照常（封顶不变），计分全按波及层半价——万能本身已是超杀，不再叠全价。
    async activateWildSwap(r1, c1, r2, c2) {
        const a = this.board[r1][c1], b = this.board[r2][c2];
        const bothWild = this.isWildCell(a) && this.isWildCell(b);
        const targetLetter = bothWild ? null : this.cellLetter(this.isWildCell(a) ? b : a);
        const base = [];
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const cell = this.board[r][c];
                const isSwapWild = (r === r1 && c === c1 && this.isWildCell(a)) || (r === r2 && c === c2 && this.isWildCell(b));
                if (bothWild || isSwapWild || (targetLetter && this.cellLetter(cell) === targetLetter)) {
                    base.push({ r, c, letter: this.cellLetter(cell) });
                }
            }
        }
        const blast = this.expandSpecialBlast(base, null);
        const removed = base.concat(blast);
        if (this.collectFromCells(removed)) this.sound.play('collect');
        this.sound.play('match', 1);
        const pts = removed.length * 5;
        this.score += pts;
        this.uiMatchedTilesFx(removed, pts);
        await this._animDelay(400);
        this.removeAndFill(removed);
        this.renderBoard();
        this.uiTilesFalling();
        await this._animDelay(300);
        // 补位可能引发连锁，交给标准流程（其中也含死锁自救与结算收尾）
        await this.processMatches(this.findMatches());
    },

    // animateSwap（纯 DOM 动画）已迁移至 renderer-board.js

    // 连串分组检测：按行/列扫长度≥3 的同字母连串。比较用有效字母（十字块算它的字母，
    // 万能块不参与）。分组保留"连了几个"——特殊块的生成判定（4连/5连）依赖它。
    findMatchGroups() {
        const groups = [];
        for (let r = 0; r < this.boardSize; r++) {
            let c = 0;
            while (c < this.boardSize) {
                const ch = this.cellLetter(this.board[r][c]);
                if (!ch) { c++; continue; }
                let k = c + 1;
                while (k < this.boardSize && this.cellLetter(this.board[r][k]) === ch) k++;
                if (k - c >= 3) {
                    const cells = [];
                    for (let i = c; i < k; i++) cells.push({ r, c: i });
                    groups.push({ letter: ch, dir: 'h', cells });
                }
                c = k;
            }
        }
        for (let c = 0; c < this.boardSize; c++) {
            let r = 0;
            while (r < this.boardSize) {
                const ch = this.cellLetter(this.board[r][c]);
                if (!ch) { r++; continue; }
                let k = r + 1;
                while (k < this.boardSize && this.cellLetter(this.board[k][c]) === ch) k++;
                if (k - r >= 3) {
                    const cells = [];
                    for (let i = r; i < k; i++) cells.push({ r: i, c });
                    groups.push({ letter: ch, dir: 'v', cells });
                }
                r = k;
            }
        }
        return groups;
    },

    findMatches() {
        const map = new Map();
        for (const g of this.findMatchGroups()) {
            for (const cell of g.cells) map.set(`${cell.r},${cell.c}`, { r: cell.r, c: cell.c, letter: g.letter });
        }
        return Array.from(map.values());
    },

    // 收集目标字母（封顶：不超过单词所需），返回本轮是否收到东西
    collectFromCells(cells) {
        let collectedAny = false;
        for (const m of cells) {
            if (!m.letter) continue;
            if (this.collectedLetters[m.letter] !== undefined) {
                const need = this.targetWord.split(m.letter).length - 1;
                if (this.collectedLetters[m.letter] < need) {
                    this.collectedLetters[m.letter]++;
                    this.flyLetterToTarget(m.r, m.c, m.letter, this.collectedLetters[m.letter] - 1);
                    collectedAny = true;
                }
            }
        }
        return collectedAny;
    },

    // 特殊块生成判定：恰 4 连=十字（带该字母），5 连及以上=万能。
    // 位置：玩家刚交换的格子在连串内则就地生成（更有"是我造出来的"感），连锁波取连串中间。
    chooseSpawns(groups, swapCells) {
        const spawns = [];
        const taken = new Set();
        for (const g of groups) {
            if (g.cells.length < 4) continue;
            const code = g.cells.length === 4 ? '*' + g.letter : '?';
            let at = swapCells && g.cells.find(p => swapCells.some(s => s.r === p.r && s.c === p.c));
            if (!at) at = g.cells[Math.floor(g.cells.length / 2)];
            const key = `${at.r},${at.c}`;
            if (taken.has(key)) continue;
            taken.add(key);
            spawns.push({ r: at.r, c: at.c, code });
        }
        return spawns;
    },

    // 十字扩散：移除集里每枚十字把整行整列拉进波及层，波及到的十字链式引爆。
    // BFS 每格只进一次天然防死循环；protectedKeys（本波新生成的特殊块）绝不波及。
    expandSpecialBlast(baseCells, protectedKeys) {
        const seen = new Set(baseCells.map(m => `${m.r},${m.c}`));
        const queue = baseCells.filter(m => this.isCrossCell(this.board[m.r][m.c]));
        const blast = [];
        const visit = (r, c) => {
            const key = `${r},${c}`;
            if (seen.has(key) || (protectedKeys && protectedKeys.has(key))) return;
            seen.add(key);
            const cell = this.board[r][c];
            const entry = { r, c, letter: this.cellLetter(cell) };
            blast.push(entry);
            if (this.isCrossCell(cell)) queue.push(entry);
        };
        while (queue.length) {
            const { r, c } = queue.shift();
            for (let i = 0; i < this.boardSize; i++) { visit(r, i); visit(i, c); }
        }
        return blast;
    },

    async processMatches(matches) {
        let combo = 0;
        while (matches.length > 0) {
            combo++;
            // spawn 判定独立于传入的 matches——炸弹波塞的是任意 3 格，此时盘上没有连串，
            // findMatchGroups 为空即自然不产特殊块；正常波两者一致。
            const groups = this.findMatchGroups();
            const spawns = this.chooseSpawns(groups, combo === 1 ? this._lastSwapCells : null);
            const spawnKeys = new Set(spawns.map(s => `${s.r},${s.c}`));
            for (const s of spawns) this.board[s.r][s.c] = s.code;
            // 基础层（真正连线/炸弹点名，剔除新生特殊块）全价；波及层（十字引爆扩进来的）半价
            const base = matches.filter(m => !spawnKeys.has(`${m.r},${m.c}`));
            const blast = this.expandSpecialBlast(base, spawnKeys);
            const collectedBase = this.collectFromCells(base);
            const collectedBlast = this.collectFromCells(blast);
            if (collectedBase || collectedBlast) this.sound.play('collect');
            this.sound.play('match', combo);
            const pts = (base.length * 10 + blast.length * 5) * combo;
            this.score += pts;

            const removed = base.concat(blast);
            this.uiMatchedTilesFx(removed, pts);
            if (combo > 1) this.uiComboIndicator(combo);
            await this._animDelay(400);
            this.removeAndFill(removed);
            this.renderBoard();
            this.uiTilesFalling();
            await this._animDelay(300);
            matches = this.findMatches();
        }
        this._lastSwapCells = null;
        if (matches.length === 0 && !this.hasAnyValidMove()) {
            this.reshuffleBoard(true);
            this.renderBoard();
        }
        this.renderTarget();
        this.checkBombReward();
    },

    // flyLetterToTarget（纯 DOM 动画）已迁移至 renderer-board.js

    removeAndFill(matches) {
        const rem = new Set();
        for (let m of matches) rem.add(`${m.r},${m.c}`);
        for (let c = 0; c < this.boardSize; c++) {
            let wr = this.boardSize - 1;
            for (let r = this.boardSize - 1; r >= 0; r--) {
                if (!rem.has(`${r},${c}`)) { this.board[wr][c] = this.board[r][c]; wr--; }
            }
            const pool = this.getLetterPool();
            const targetSet = new Set(this.targetWord.split(''));
            const targetWeight = this.getTargetWeight();
            while (wr >= 0) {
                const arr = Array.from(targetSet);
                if (Math.random() < targetWeight && arr.length > 0) {
                    this.board[wr][c] = arr[Math.floor(Math.random() * arr.length)];
                } else {
                    this.board[wr][c] = pool[Math.floor(Math.random() * pool.length)];
                }
                wr--;
            }
        }
        this.buildLetterColorMap();
    },

    isWin() {
        const need = {};
        for (let ch of this.targetWord) need[ch] = (need[ch] || 0) + 1;
        for (let ch in need) if ((this.collectedLetters[ch] || 0) < need[ch]) return false;
        return true;
    },

    checkWin() {
        if (this.isWin()) {
            this.locked = true;
            this.addLearnedWord();
            if (this.gameMode === 'story') {
                if (this.currentWordIndex < this.targetWords.length - 1) {
                    const reward = 50 + this.targetWord.length * 20;
                    this.score += reward;
                    this.coins += reward;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    setTimeout(() => this.showWordComplete(), 400);
                } else {
                    const reward = this.moves * 50;
                    this.score += reward;
                    this.coins += reward;
                    const bond = this.gainCompanionBond(this.equippedCompanion, 1);
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    if (this.levelBombsUsed === 0) this.unlockAchievement('zero_bomb');
                    if (this.levelResetCount === 0) this.unlockAchievement('perfect_level');
                    if (this.level >= 26) this.unlockAchievement('master');
                    this.queueWinPresentation(this.equippedCompanion, bond);
                }
            } else if (this.gameMode === 'timed') {
                this.endlessWords++;
                this.score += 100 + this.targetWord.length * 50;
                if (this.endlessWords > this.bestTimedWords) {
                    this.bestTimedWords = this.endlessWords;
                    this.coins += 80;
                    this.checkBombReward();
                }
                this.saveGlobal();
                this.updateTimedUI();
                this.sound.play('win');
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                setTimeout(() => {
                    this.loadRandomWord();
                    this.generateBoard();
                    this.renderBoard();
                    this.locked = false;
                }, 500);
            } else if (this.gameMode === 'endless') {
                this.endlessWords++;
                this.score += 100 + this.targetWord.length * 30;
                if (this.endlessWords > this.bestEndlessWords) {
                    this.bestEndlessWords = this.endlessWords;
                    this.coins += 80;
                    this.checkBombReward();
                }
                if (this.endlessWords % 3 === 0) this.endlessDifficulty++;
                this.saveGlobal();
                this.updateEndlessUI();
                this.sound.play('win');
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                setTimeout(() => {
                    this.loadRandomWord();
                    this.generateBoard();
                    this.renderBoard();
                    this.applyTheme();
                    this.locked = false;
                }, 500);
            } else if (this.gameMode === 'review') {
                const rewardMultiplier = this.reviewBoostActive ? 2 : 1;
                if (this.currentWordIndex < this.targetWords.length - 1) {
                    this.score += 30 * rewardMultiplier;
                    this.coins += 30 * rewardMultiplier;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    setTimeout(() => this.showWordComplete(), 400);
                } else {
                    this.score += 50 * rewardMultiplier;
                    this.coins += 50 * rewardMultiplier;
                    const bond = this.gainCompanionBond(this.equippedCompanion, 1);
                    this.reviewBoostActive = false;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    this.queueWinPresentation(this.equippedCompanion, bond);
                }
            } else if (this.gameMode === 'daily') {
                if (this.currentWordIndex < this.targetWords.length - 1) {
                    const reward = 80 + this.targetWord.length * 25;
                    this.score += reward;
                    this.coins += reward;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    setTimeout(() => this.showWordComplete(), 400);
                } else {
                    const today = this.dailyDate || this.getDateKey();
                    const firstTime = !this.dailyCompletions[today];
                    this.dailyCompletions[today] = true;
                    this.lastDailyReward = firstTime ? 800 : 200;
                    this.score += this.lastDailyReward;
                    this.coins += this.lastDailyReward;
                    // 当日首次完成学习：额外羁绊（+2 而非 +1），每日仅一次由 dailyCompletions 天然防重
                    const bond = this.gainCompanionBond(this.equippedCompanion, firstTime ? 2 : 1);
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    this.queueWinPresentation(this.equippedCompanion, bond);
                }
            }
        }
    },

    getNextNeededLetter() {
        const seen = {};
        for (let ch of this.targetWord) {
            seen[ch] = (seen[ch] || 0) + 1;
            if ((this.collectedLetters[ch] || 0) < seen[ch]) return ch;
        }
        return '';
    },

    findValidMove() {
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (c < this.boardSize - 1) {
                    this.swap(r, c, r, c + 1);
                    if (this.findMatches().length > 0) { this.swap(r, c, r, c + 1); return { r1: r, c1: c, r2: r, c2: c + 1 }; }
                    this.swap(r, c, r, c + 1);
                }
                if (r < this.boardSize - 1) {
                    this.swap(r, c, r + 1, c);
                    if (this.findMatches().length > 0) { this.swap(r, c, r + 1, c); return { r1: r, c1: c, r2: r + 1, c2: c }; }
                    this.swap(r, c, r + 1, c);
                }
            }
        }
        return null;
    },

    shuffleBoard() {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.gameMode !== 'endless' && this.moves < 5 && !this.bombMode) return;
        if (this.gameMode !== 'endless' && !this.bombMode) this.moves -= 5;
        this.clearHint();
        this.bombMode = false;
        this.bombSelected = [];
        this.uiClearBombTargets();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.saveGlobal();
    },

    showHint() {
        this.unlockAudio();
        if (this.hintCooldown > 0 || this.isProcessing) return;
        this.clearHint();
        const move = this.findValidMove();
        if (!move) return;
        this.uiShowHint(move);
        this.hintCooldown = 10;
        this.updateHintButton();
        const interval = setInterval(() => {
            this.hintCooldown--;
            this.updateHintButton();
            if (this.hintCooldown <= 0) clearInterval(interval);
        }, 1000);
    },

    // clearHint / updateHintButton（纯 DOM）已迁移至 renderer-board.js

    startAutoHint() {
        this.scheduleAutoHint();
    },

    scheduleAutoHint() {
        if (this.autoHintTimer) clearTimeout(this.autoHintTimer);
        this.autoHintTimer = setTimeout(() => {
            if (!this.isProcessing && this.moves > 0 && this.hintCooldown <= 0 && !this.bombMode) {
                this.showHint();
            }
            this.scheduleAutoHint();
        }, 10000);
    },

    resetAutoHint() {
        if (this.autoHintTimer) clearTimeout(this.autoHintTimer);
        this.scheduleAutoHint();
    }
});
