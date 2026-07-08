// 游戏模式与流程：闯关/限时/无尽/复习/每日挑战（DOM 渲染已迁至 renderer-screens.js）
Object.assign(WordMatchGame.prototype, {
    selectMode(mode) {
        this.unlockAudio();
        this.markPlayDay();
        this.saveGlobal();
        this.gameMode = mode;
        this.uiShowGameScreen();
        this.startGame();
    },

    backToMenu() {
        this.locked = false;
        clearInterval(this.timedTimer);
        clearTimeout(this.autoHintTimer);
        this.bombMode = false;
        this.bombSelected = [];
        this.uiShowStartScreen();
        this.updateGlobalStats();
        this.updateEquipBar();
    },

    startGame() {
        this.selectedTile = null; this.isProcessing = false; this.locked = false;
        this.score = 0;
        clearInterval(this.timedTimer);
        clearTimeout(this.autoHintTimer);
        this.uiHideModal();

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
        // 优先级：玩家装备的非默认商店主题 > 关卡主题
        const custom = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        const useCustom = custom && custom.colors && custom.id !== 'default_theme';
        const themeIndex = Math.min(Math.floor((this.level - 1) / 3), THEMES.length - 1);
        const t = useCustom ? custom.colors : THEMES[themeIndex];
        this.renderTheme(t);
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
        this.uiShowTimerBar();
        this.timedTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimedUI();
            this.renderTimerFill();
            if (this.timeLeft <= 10) this.sound.play('tick');
            if (this.timeLeft <= 0) {
                clearInterval(this.timedTimer);
                this.sound.play('lose');
                this.showModal('lose');
            }
        }, 1000);
    }
});
