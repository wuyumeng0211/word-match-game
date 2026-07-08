// 游戏核心：类骨架 + 初始化 + 事件绑定（其余方法在 game-*.js 中挂到原型上）
class WordMatchGame {
    constructor() {
        this.boardSize = 6; this.board = []; this.selectedTile = null;
        this.level = 1; this.moves = 30; this.score = 0; this.coins = 0;
        this.targetWord = ''; this.targetChinese = ''; this.targetSentence = ''; this.targetSentenceCn = '';
        this.collectedLetters = {}; this.isProcessing = false;
        this.hintCooldown = 0; this.autoHintTimer = null;
        this.sound = new SoundManager();
        this.gameMode = 'story';
        this.timedTimer = null; this.timeLeft = 60; this.locked = false;
        this.endlessWords = 0; this.endlessDifficulty = 1;
        this.learnedWords = [];
        this.favorites = [];
        this.bombs = 0;
        this.nextBombAt = 8000;
        this.bombMode = false;
        this.bombSelected = [];
        this.achievements = {};
        this.levelResetCount = 0;
        this.levelBombsUsed = 0;
        this.unlockedSkins = ['default_theme','default_board','default_effect','default_frame'];
        this.equippedTheme = 'default_theme';
        this.equippedBoard = 'default_board';
        this.equippedEffect = 'default_effect';
        this.equippedFrame = 'default_frame';
        this.playDates = {};
        this.dailyCompletions = {};
        this.failedWords = {};
        this.totalCompletedWords = 0;
        this.bestTimedWords = 0;
        this.bestEndlessWords = 0;
        this.dailyDate = '';
        this.lastDailyReward = 0;
        this.wordMastery = {};
        this.toolInventory = {};
        this.reviewBoostActive = false;
        this.reduceMotion = false;
        this.colorBlindMode = false;
        this.unlockedCompanions = ['dino'];
        this.equippedCompanion = 'dino';
        this.companionInventory = {};
        this.companionGrowth = {};
        this.companionNames = {};
        this.companionRenameUnlocked = {};
        this.companionVoiceOn = true;
        this.mechaShieldMoves = 0;
        this.lastCompanionGreetDate = '';
        this.deferredInstallPrompt = null;
        this.letterColorMap = {};
        this.skin = 'classic';

        this.wordLevels = WORD_LEVELS;

        this.loadGlobalSave();
        this.init();
    }

    init() {
        this.loadGlobalSave();
        this.applySkin();
        this.bindEvents();
        this.updateGlobalStats();
        this.renderAchievements();
        this.renderLevelMap();
        this.updateEquipBar();
        this.updateToolUI();
        this.renderCompanionDock();
        this.companionLoginGreet();
        this.applyEquippedTheme();
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && localStorage.getItem('wordMatchGlobal') === null) {
            this.reduceMotion = true;
        }
        this.applyAccessibilitySettings();
        this.setupPWA();
        const ttsBtn = document.getElementById('ttsBtn');
        if (ttsBtn) {
            ttsBtn.textContent = this.sound.speakEnabled ? '🗣️ 朗读' : '🤐 静音';
            ttsBtn.classList.toggle('off', !this.sound.speakEnabled);
        }
        if (!localStorage.getItem('wordMatchTutorial')) {
            setTimeout(() => this.startTutorial(), 300);
        }
    }

    bindEvents() {
        document.getElementById('gameBoard').addEventListener('click', (e) => {
            const tile = e.target.closest('.tile');
            if (!tile) return;
            const r = parseInt(tile.dataset.r), c = parseInt(tile.dataset.c);
            this.handleClick(r, c);
        });

        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => this.selectMode(card.dataset.mode));
        });

        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('soundBtn').addEventListener('click', () => this.toggleSound());
        document.getElementById('ttsBtn').addEventListener('click', () => this.toggleTTS());
        document.querySelector('[data-action="shuffle"]').addEventListener('click', () => this.shuffleBoard());
        document.getElementById('bombBtn').addEventListener('click', () => this.activateBomb());
        document.querySelector('[data-action="menu"]').addEventListener('click', () => this.backToMenu());
        document.querySelector('[data-action="vocab"]').addEventListener('click', () => this.showVocab());
        document.querySelector('[data-action="shop"]').addEventListener('click', () => this.openShop());
        document.querySelector('[data-action="report"]').addEventListener('click', () => this.showReport());
        document.querySelector('[data-action="skin"]').addEventListener('click', () => this.toggleSkin());
        document.querySelector('[data-action="word-detail"]').addEventListener('click', () => this.showWordDetail());
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => this.useTool(btn.dataset.tool));
        });
        const installBtn = document.querySelector('[data-action="install"]');
        if (installBtn) installBtn.addEventListener('click', () => this.installApp());
        document.getElementById('reduceMotionToggle').addEventListener('change', (event) => {
            this.reduceMotion = event.target.checked;
            this.applyAccessibilitySettings();
            this.saveGlobal();
        });
        document.getElementById('colorBlindToggle').addEventListener('change', (event) => {
            this.colorBlindMode = event.target.checked;
            this.applyAccessibilitySettings();
            if (this.board.length) this.renderBoard();
            this.saveGlobal();
        });

        document.getElementById('tutorialBtn').addEventListener('click', () => this.nextTutorialStep());
        document.querySelectorAll('[data-shop-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchShopTab(tab.dataset.shopTab, e));
        });
        document.querySelector('[data-action="close-shop"]').addEventListener('click', () => this.closeShop());
        document.getElementById('modalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalShareBtn').onclick = () => this.generateShareImage();
        document.getElementById('favBtn').addEventListener('click', () => this.toggleFavorite());
        document.querySelector('[data-action="close-detail"]').addEventListener('click', () => this.closeDetailModal());
        document.querySelector('[data-action="close-vocab"]').addEventListener('click', () => {
            document.getElementById('vocabModal').classList.remove('active');
        });
        document.querySelector('[data-action="close-report"]').addEventListener('click', () => {
            document.getElementById('reportModal').classList.remove('active');
        });
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredInstallPrompt = e;
            const card = document.getElementById('installCard');
            if (card) card.classList.add('show');
        });
    }

    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js').catch(() => {});
        }
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            const card = document.getElementById('installCard');
            if (card) card.classList.remove('show');
        } else {
            const card = document.getElementById('installCard');
            if (card) card.classList.add('show');
        }
    }

    applyAccessibilitySettings() {
        document.body.classList.toggle('reduce-motion', this.reduceMotion);
        document.getElementById('reduceMotionToggle').checked = this.reduceMotion;
        document.getElementById('colorBlindToggle').checked = this.colorBlindMode;
    }

    _escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}
