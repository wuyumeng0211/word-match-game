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
                const pool = this.getLetterPool();
                let nl, tries = 0;
                do { nl = pool[Math.floor(Math.random() * pool.length)]; tries++; }
                while (tries < 40 && (
                    (match.r > 0 && this.board[match.r - 1][match.c] === nl) ||
                    (match.r < this.boardSize - 1 && this.board[match.r + 1][match.c] === nl) ||
                    (match.c > 0 && this.board[match.r][match.c - 1] === nl) ||
                    (match.c < this.boardSize - 1 && this.board[match.r][match.c + 1] === nl)
                ));
                this.board[match.r][match.c] = nl;
            }
        }
    },

    hasAnyValidMove() {
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
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
        await this.animateSwap(r1, c1, r2, c2);
        const matches = this.findMatches();
        if (matches.length > 0) {
            if (this.gameMode !== 'endless') {
                if (this.mechaShieldMoves > 0) {
                    this.mechaShieldMoves--;
                    this.showToast(`🛡️ 机甲护盾生效，剩余 ${this.mechaShieldMoves} 步`);
                } else {
                    this.moves--;
                }
            }
            this.sound.play('swap');
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

    // animateSwap（纯 DOM 动画）已迁移至 renderer-board.js

    findMatches() {
        const set = new Set();
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize - 2; c++) {
                const ch = this.board[r][c];
                if (ch && this.board[r][c + 1] === ch && this.board[r][c + 2] === ch) {
                    set.add(`${r},${c}`); set.add(`${r},${c + 1}`); set.add(`${r},${c + 2}`);
                    let k = c + 3; while (k < this.boardSize && this.board[r][k] === ch) { set.add(`${r},${k}`); k++; }
                }
            }
        }
        for (let c = 0; c < this.boardSize; c++) {
            for (let r = 0; r < this.boardSize - 2; r++) {
                const ch = this.board[r][c];
                if (ch && this.board[r + 1][c] === ch && this.board[r + 2][c] === ch) {
                    set.add(`${r},${c}`); set.add(`${r + 1},${c}`); set.add(`${r + 2},${c}`);
                    let k = r + 3; while (k < this.boardSize && this.board[k][c] === ch) { set.add(`${k},${c}`); k++; }
                }
            }
        }
        return Array.from(set).map(s => { const [r, c] = s.split(',').map(Number); return { r, c, letter: this.board[r][c] }; });
    },

    async processMatches(matches) {
        let combo = 0;
        while (matches.length > 0) {
            combo++;
            let collectedAny = false;
            for (let m of matches) {
                if (this.collectedLetters[m.letter] !== undefined) {
                    const need = this.targetWord.split(m.letter).length - 1;
                    if (this.collectedLetters[m.letter] < need) {
                        this.collectedLetters[m.letter]++;
                        this.flyLetterToTarget(m.r, m.c, m.letter, this.collectedLetters[m.letter] - 1);
                        collectedAny = true;
                    }
                }
            }
            if (collectedAny) this.sound.play('collect');
            this.sound.play('match', combo);
            const pts = matches.length * 10 * combo;
            this.score += pts;

            this.uiMatchedTilesFx(matches, pts);
            if (combo > 1) this.uiComboIndicator(combo);
            await new Promise(r => setTimeout(r, 400));
            this.removeAndFill(matches);
            this.renderBoard();
            this.uiTilesFalling();
            await new Promise(r => setTimeout(r, 300));
            matches = this.findMatches();
        }
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
