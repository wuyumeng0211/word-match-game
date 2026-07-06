// 游戏模式与流程：闯关/限时/无尽/复习/每日挑战
Object.assign(WordMatchGame.prototype, {
    selectMode(mode) {
        this.unlockAudio();
        this.markPlayDay();
        this.saveGlobal();
        this.gameMode = mode;
        document.body.classList.add('in-game');
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        this.startGame();
    },

    backToMenu() {
        this.locked = false;
        clearInterval(this.timedTimer);
        clearTimeout(this.autoHintTimer);
        this.bombMode = false;
        this.bombSelected = [];
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.body.classList.remove('in-game');
        this.updateGlobalStats();
        this.updateEquipBar();
    },

    startGame() {
        this.selectedTile = null; this.isProcessing = false; this.locked = false;
        this.score = 0;
        clearInterval(this.timedTimer);
        clearTimeout(this.autoHintTimer);
        document.getElementById('modal').classList.remove('active');

        if (this.gameMode === 'story') {
            this.loadLevel();
            this.generateBoard();
            this.renderBoard();
            this.updateUI();
            this.startAutoHint();
        } else if (this.gameMode === 'timed') {
            this.timeLeft = 60;
            this.endlessWords = 0;
            this.loadRandomWord();
            this.generateBoard();
            this.renderBoard();
            this.updateTimedUI();
            this.startTimedMode();
        } else if (this.gameMode === 'endless') {
            this.endlessWords = 0;
            this.endlessDifficulty = 1;
            this.loadRandomWord();
            this.generateBoard();
            this.renderBoard();
            this.updateEndlessUI();
            this.startAutoHint();
        } else if (this.gameMode === 'review') {
            this.loadReviewWord();
            this.generateBoard();
            this.renderBoard();
            this.updateUI();
            this.startAutoHint();
        } else if (this.gameMode === 'daily') {
            this.loadDailyChallenge();
            this.generateBoard();
            this.renderBoard();
            this.updateUI();
            this.startAutoHint();
        }

        this.applyTheme();
        this.greetCompanion();
    },

    applyTheme() {
        const custom = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        if (custom && custom.colors) {
            const root = document.documentElement;
            root.style.setProperty('--theme-bg', custom.colors.bg);
            root.style.setProperty('--theme-primary', custom.colors.primary);
            root.style.setProperty('--theme-target-bg', custom.colors.targetBg);
            root.style.setProperty('--theme-target-border', custom.colors.targetBorder);
            root.style.setProperty('--theme-select', custom.colors.select);
            root.style.setProperty('--theme-board', custom.colors.board);
            return;
        }
        const themeIndex = Math.min(Math.floor((this.level - 1) / 3), THEMES.length - 1);
        const t = THEMES[themeIndex];
        const root = document.documentElement;
        root.style.setProperty('--theme-bg', t.bg);
        root.style.setProperty('--theme-primary', t.primary);
        root.style.setProperty('--theme-target-bg', t.targetBg);
        root.style.setProperty('--theme-target-border', t.targetBorder);
        root.style.setProperty('--theme-select', t.select);
        root.style.setProperty('--theme-board', t.board);
    },

    nextLevel() {
        this.level++;
        this.loadLevel();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.applyTheme();
        this.saveGlobal();
        this.greetCompanion();
    },

    nextReview() {
        if (this.currentWordIndex < this.targetWords.length - 1) {
            this.currentWordIndex++;
            this.setCurrentTarget(this.currentWordIndex);
            this.generateBoard();
            this.renderBoard();
            this.renderTarget();
            this.updateUI();
        } else {
            this.startGame();
        }
    },

    resetLevel() {
        this.score = Math.max(0, this.score - 50);
        this.levelResetCount++;
        if (this.gameMode === 'review') this.loadReviewWord();
        else if (this.gameMode === 'daily') this.loadDailyChallenge();
        else this.loadLevel();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.saveGlobal();
    },

    startTimedMode() {
        clearInterval(this.timedTimer);
        document.getElementById('timerBar').style.display = 'block';
        this.timedTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimedUI();
            document.getElementById('timerFill').style.width = (this.timeLeft / 60 * 100) + '%';
            if (this.timeLeft <= 10) this.sound.play('tick');
            if (this.timeLeft <= 0) {
                clearInterval(this.timedTimer);
                this.sound.play('lose');
                this.showModal('lose');
            }
        }, 1000);
    },

    updateTimedUI() {
        document.getElementById('level').textContent = '限时';
        document.getElementById('moves').textContent = this.timeLeft + 's';
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '剩余';
        document.getElementById('timerBar').style.display = 'block';
        this.updateBombUI();
        this.updateToolUI();
    },

    updateEndlessUI() {
        document.getElementById('level').textContent = '无尽';
        document.getElementById('moves').textContent = this.endlessWords;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '已拼';
        document.getElementById('timerBar').style.display = 'none';
        this.updateBombUI();
        this.updateToolUI();
    },

    updateDailyCard() {
        const el = document.getElementById('dailyDesc');
        if (!el) return;
        const today = this.getDateKey();
        el.innerHTML = this.dailyCompletions[today]
            ? '今日已完成<br>明天再来挑战'
            : '每天固定3个单词<br>完成奖励800分';
    }
});
