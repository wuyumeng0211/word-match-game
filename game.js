const THEMES = [
    { name:'forest', bg:'linear-gradient(135deg,#11998e 0%,#38ef7d 100%)', primary:'linear-gradient(135deg,#11998e 0%,#38ef7d 100%)', targetBg:'#e8f5e9', targetBorder:'#4caf50', select:'#4caf50', board:'#e8f5e9' },
    { name:'ocean', bg:'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)', primary:'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)', targetBg:'#e3f2fd', targetBorder:'#2196f3', select:'#2196f3', board:'#e3f2fd' },
    { name:'candy', bg:'linear-gradient(135deg,#ff9a9e 0%,#fecfef 100%)', primary:'linear-gradient(135deg,#ff9a9e 0%,#f093fb 100%)', targetBg:'#fce4ec', targetBorder:'#e91e63', select:'#e91e63', board:'#fce4ec' },
    { name:'space', bg:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', primary:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', targetBg:'#ede7f6', targetBorder:'#673ab7', select:'#673ab7', board:'#f3e5f5' },
    { name:'sunset', bg:'linear-gradient(135deg,#fa709a 0%,#fee140 100%)', primary:'linear-gradient(135deg,#fa709a 0%,#ffaa00 100%)', targetBg:'#fff3e0', targetBorder:'#ff9800', select:'#ff9800', board:'#fff8e1' },
    { name:'ice', bg:'linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%)', primary:'linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%)', targetBg:'#e0f7fa', targetBorder:'#00bcd4', select:'#00bcd4', board:'#e0f7fa' },
    { name:'fire', bg:'linear-gradient(135deg,#ff6b6b 0%,#ee5a24 100%)', primary:'linear-gradient(135deg,#ff6b6b 0%,#ee5a24 100%)', targetBg:'#ffebee', targetBorder:'#f44336', select:'#f44336', board:'#ffebee' },
    { name:'rainbow', bg:'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)', primary:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', targetBg:'#f3e5f5', targetBorder:'#9c27b0', select:'#9c27b0', board:'#f3e5f5' }
];

const ACHIEVEMENTS = [
    { id:'first_word', name:'初出茅庐', desc:'成功拼出第一个单词', icon:'✨' },
    { id:'zero_bomb', name:'零炸弹通关', desc:'不使用炸弹完成一关', icon:'🎯' },
    { id:'perfect_level', name:'一气呵成', desc:'一次性通过一关的3个单词', icon:'⚡' },
    { id:'speed_demon', name:'速度之星', desc:'限时模式拼出10个单词', icon:'⏱️' },
    { id:'collector', name:'词汇达人', desc:'累计学过50个单词', icon:'📚' },
    { id:'master', name:'通关大师', desc:'通关第26关', icon:'👑' }
];

const SHOP_ITEMS = [
    { id:'default_theme', name:'晨曦微光', type:'theme', price:0, preview:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', colors:{bg:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',primary:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',targetBg:'#fff3cd',targetBorder:'#ffc107',select:'#667eea',board:'#f8f9fa'} },
    { id:'ocean_theme', name:'深海秘境', type:'theme', price:1500, preview:'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)', colors:{bg:'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)',primary:'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',targetBg:'#e3f2fd',targetBorder:'#2196f3',select:'#2196f3',board:'#e3f2fd'} },
    { id:'candy_theme', name:'糖果乐园', type:'theme', price:1500, preview:'linear-gradient(135deg,#ff9a9e 0%,#fecfef 100%)', colors:{bg:'linear-gradient(135deg,#ff9a9e 0%,#fecfef 100%)',primary:'linear-gradient(135deg,#ff9a9e 0%,#f093fb 100%)',targetBg:'#fce4ec',targetBorder:'#e91e63',select:'#e91e63',board:'#fce4ec'} },
    { id:'cyber_theme', name:'赛博朋克', type:'theme', price:4000, preview:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', colors:{bg:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',primary:'linear-gradient(135deg,#00f260 0%,#0575e6 100%)',targetBg:'#1a1a2e',targetBorder:'#00f260',select:'#00f260',board:'#16213e'} },
    { id:'aurora_theme', name:'极光之夜', type:'theme', price:6000, preview:'linear-gradient(135deg,#2e3192 0%,#1bffff 100%)', colors:{bg:'linear-gradient(135deg,#2e3192 0%,#1bffff 100%)',primary:'linear-gradient(135deg,#7928ca 0%,#ff0080 100%)',targetBg:'#e8f5e9',targetBorder:'#00e676',select:'#00e676',board:'#e0f7fa'} },
    { id:'gold_theme', name:'黄金时代', type:'theme', price:8000, preview:'linear-gradient(135deg,#1a1a1a 0%,#434343 100%)', colors:{bg:'linear-gradient(135deg,#1a1a1a 0%,#434343 100%)',primary:'linear-gradient(135deg,#ffd700 0%,#ffaa00 100%)',targetBg:'#fff8e1',targetBorder:'#ffd700',select:'#ffd700',board:'#fafafa'} },
    { id:'default_board', name:'经典圆角', type:'board', price:0, preview:'#667eea' },
    { id:'crystal_board', name:'水晶方块', type:'board', price:2000, preview:'#a8edea' },
    { id:'pixel_board', name:'像素复古', type:'board', price:2500, preview:'#ff6b6b' },
    { id:'metal_board', name:'金属科技', type:'board', price:3500, preview:'#8899a6' },
    { id:'ink_board', name:'水墨国风', type:'board', price:5000, preview:'#2c3e50' },
    { id:'default_effect', name:'标准爆开', type:'effect', price:0, preview:'#e74c3c' },
    { id:'star_effect', name:'星光飞溅', type:'effect', price:2000, preview:'#ffd700' },
    { id:'heart_effect', name:'爱心飘散', type:'effect', price:2000, preview:'#ff6b9d' },
    { id:'paper_effect', name:'碎纸飘落', type:'effect', price:3000, preview:'#667eea' },
    { id:'rainbow_effect', name:'彩虹拖尾', type:'effect', price:5000, preview:'linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3)' },
    { id:'default_frame', name:'无框', type:'frame', price:0, preview:'#e9ecef' },
    { id:'bronze_frame', name:'青铜学者', type:'frame', price:3000, preview:'#cd7f32' },
    { id:'silver_frame', name:'白银探知者', type:'frame', price:6000, preview:'#c0c0c0' },
    { id:'gold_frame', name:'黄金词汇王', type:'frame', price:10000, preview:'#ffd700' }
];

const TUTORIAL_STEPS = [
    { icon:'🎮', title:'欢迎来到单词拼拼消', text:'这是一款将英语单词学习和消消乐结合的游戏。每一关你需要拼出3个单词，从3字母逐步挑战到10字母！' },
    { icon:'📖', title:'收集字母拼出单词', text:'点击棋盘上两个相邻的字母进行交换。连成3个或以上相同的字母即可消除，并收集该字母到目标单词中。' },
    { icon:'💡', title:'提示帮你找到方向', text:'遇到困难时点击"提示"按钮，系统会高亮显示可以交换的两个字母。提示有5秒冷却时间。' },
    { icon:'💣', title:'炸弹直接消除', text:'每积攒5000分可获得一枚字母炸弹。进入炸弹模式后，点击棋盘上任意3个字母即可直接消除它们！' },
    { icon:'🏆', title:'准备好了吗？', text:'通关后你会看到单词的英文例句和中文翻译，还能收藏到单词本中随时复习。开始你的单词之旅吧！' }
];

class SoundManager {
    constructor() { this.enabled = true; this.speakEnabled = true; this.ctx = null; this.preferredVoice = null; this.voiceReady = false; }
    initVoices() {
        if (this.voiceReady) return;
        const choose = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;
            this.preferredVoice = voices.find(v => v.name.includes('Google US English'))
                || voices.find(v => v.name.includes('Samantha'))
                || voices.find(v => v.name.includes('Microsoft') && v.lang === 'en-US')
                || voices.find(v => v.lang === 'en-US')
                || voices[0];
            this.voiceReady = true;
        };
        choose();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = choose;
        }
        if (!this.voiceReady) {
            setTimeout(choose, 300);
            setTimeout(choose, 800);
        }
    }
    ensureContext() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    play(type) {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx, now = ctx.currentTime;
        const tone = (freq, dur, type='sine', vol=0.12) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = type; o.frequency.setValueAtTime(freq, now);
            g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(0.001, now+dur);
            o.start(now); o.stop(now+dur);
        };
        switch(type) {
            case 'swap': tone(600, 0.08); break;
            case 'match': [523,659,784].forEach((f,i)=>tone(f,0.15,'sine',0.1)); break;
            case 'collect': tone(880, 0.25, 'sine', 0.15); break;
            case 'win': [[523,659,784],[587,740,880],[659,830,988]].forEach((ch,i)=>ch.forEach(f=>tone(f,0.4,'triangle',0.06))); break;
            case 'lose': tone(200, 0.5, 'sawtooth', 0.08); break;
            case 'invalid': tone(150, 0.1, 'square', 0.06); break;
            case 'tick': tone(800, 0.05, 'sine', 0.05); break;
        }
    }
    speak(text) {
        if (!this.speakEnabled) return;
        if (!window.speechSynthesis) return;
        this.initVoices();
        if (window.speechSynthesis.speaking) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
        if (!text || !text.trim()) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.85; u.volume = 1;
        if (this.preferredVoice) u.voice = this.preferredVoice;
        u.onerror = (e) => { console.warn('TTS error:', e.error); };
        try {
            window.speechSynthesis.speak(u);
        } catch(e) { console.warn('Speech synthesis failed:', e); }
    }
}

class WordMatchGame {
    constructor() {
        this.boardSize = 6; this.board = []; this.selectedTile = null;
        this.level = 1; this.moves = 30; this.score = 0;
        this.targetWord = ''; this.targetChinese = ''; this.targetSentence = ''; this.targetSentenceCn = '';
        this.collectedLetters = {}; this.isProcessing = false;
        this.hintCooldown = 0; this.autoHintTimer = null;
        this.sound = new SoundManager();
        this.gameMode = 'story';
        this.timedTimer = null; this.timeLeft = 60;
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
        this.particlePool = [];
        this.wordLevels = [];
        this.wordBank = [];
        this.dailyBest = null;

        this.loadGlobalSave();
        this.loadWordBank();
        this.loadDailySave();
        this.loadWords().then(() => this.init());
    }

    async loadWords() {
        try {
            const res = await fetch('words.json');
            if (!res.ok) throw new Error('Failed to load words.json');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                this.wordLevels = data;
            } else {
                this.wordLevels = [];
            }
        } catch (e) {
            console.warn('Could not load words.json:', e);
            this.wordLevels = [];
        }
    }

    loadGlobalSave() {
        try {
            const raw = localStorage.getItem('wordMatchGlobal');
            if (raw) {
                const data = JSON.parse(raw);
                const version = data.version || 1;
                this.learnedWords = data.learnedWords || [];
                this.favorites = data.favorites || [];
                this.level = data.level || 1;
                this.score = data.score || 0;
                this.bombs = data.bombs || 0;
                this.nextBombAt = data.nextBombAt || 8000;
                this.achievements = data.achievements || {};
                this.unlockedSkins = data.unlockedSkins || ['default_theme','default_board','default_effect','default_frame'];
                this.equippedTheme = data.equippedTheme || 'default_theme';
                this.equippedBoard = data.equippedBoard || 'default_board';
                this.equippedEffect = data.equippedEffect || 'default_effect';
                this.equippedFrame = data.equippedFrame || 'default_frame';
                if (data.speakEnabled !== undefined) this.sound.speakEnabled = data.speakEnabled;
                if (version < 2) {
                    this.nextBombAt = Math.max(this.nextBombAt, 8000);
                }
            }
        } catch(e) {}
    }

    saveGlobal() {
        const data = {
            version: 2,
            learnedWords: this.learnedWords,
            favorites: this.favorites,
            level: this.level,
            score: this.score,
            bombs: this.bombs,
            nextBombAt: this.nextBombAt,
            achievements: this.achievements,
            unlockedSkins: this.unlockedSkins,
            equippedTheme: this.equippedTheme,
            equippedBoard: this.equippedBoard,
            equippedEffect: this.equippedEffect,
            equippedFrame: this.equippedFrame,
            speakEnabled: this.sound.speakEnabled,
            date: Date.now()
        };
        localStorage.setItem('wordMatchGlobal', JSON.stringify(data));
        this.updateGlobalStats();
    }

    checkBombReward() {
        while (this.score >= this.nextBombAt) {
            this.bombs++;
            this.nextBombAt += 8000;
            this.showToast(`💣 获得字母炸弹! (当前 ${this.bombs} 个)`);
        }
    }

    showToast(msg) {
        const el = document.getElementById('saveIndicator');
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2000);
    }

    updateGlobalStats() {
        const uniqueWords = [...new Set(this.learnedWords.map(w => w.en))];
        document.getElementById('statLevel').textContent = this.level;
        document.getElementById('statScore').textContent = this.score;
        document.getElementById('statWords').textContent = uniqueWords.length;
        document.getElementById('statVocab').textContent = this.favorites.length;
        this.renderLevelMap();
        const statsGrid = document.getElementById('globalStats');
        if (statsGrid) {
            statsGrid.classList.remove('frame-bronze','frame-silver','frame-gold');
            if (this.equippedFrame === 'bronze_frame') statsGrid.classList.add('frame-bronze');
            else if (this.equippedFrame === 'silver_frame') statsGrid.classList.add('frame-silver');
            else if (this.equippedFrame === 'gold_frame') statsGrid.classList.add('frame-gold');
        }
    }

    init() {
        window.onerror = (msg, url, line, col, err) => {
            console.error('Game error:', msg, 'at', line, col, err);
            const indicator = document.getElementById('saveIndicator');
            if (indicator) {
                indicator.textContent = '错误: ' + msg;
                indicator.classList.add('show');
                setTimeout(() => indicator.classList.remove('show'), 5000);
            }
        };
        this.bindEvents();
        this.updateGlobalStats();
        this.renderAchievements();
        this.renderLevelMap();
        this.updateEquipBar();
        this.applyEquippedTheme();
        this.renderDailyChallenge();
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
        const board = document.getElementById('gameBoard');

        board.addEventListener('click', (e) => {
            if (this.ignoreNextClick) { this.ignoreNextClick = false; return; }
            const tile = e.target.closest('.tile');
            if (!tile) return;
            const r = parseInt(tile.dataset.r), c = parseInt(tile.dataset.c);
            this.handleClick(r, c);
        });

        let touchStart = null;
        board.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const tile = e.target.closest('.tile');
            if (!tile) { touchStart = null; return; }
            touchStart = {
                x: touch.clientX, y: touch.clientY,
                r: parseInt(tile.dataset.r), c: parseInt(tile.dataset.c)
            };
        }, { passive: true });

        board.addEventListener('touchend', (e) => {
            if (!touchStart) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStart.x;
            const dy = touch.clientY - touchStart.y;
            const r = touchStart.r, c = touchStart.c;
            touchStart = null;

            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                const nc = dx > 0 ? c + 1 : c - 1;
                if (nc >= 0 && nc < this.boardSize) { this.ignoreNextClick = true; this.handleSwipe(r, c, r, nc); }
            } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
                const nr = dy > 0 ? r + 1 : r - 1;
                if (nr >= 0 && nr < this.boardSize) { this.ignoreNextClick = true; this.handleSwipe(r, c, nr, c); }
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.bombMode) this.cancelBomb();
                else if (document.getElementById('shopModal').classList.contains('active')) this.closeShop();
                else if (document.getElementById('vocabModal').classList.contains('active')) document.getElementById('vocabModal').classList.remove('active');
                else if (document.getElementById('detailModal').classList.contains('active')) this.closeDetailModal();
                else if (document.getElementById('modal').classList.contains('active')) this.closeModal();
            }
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
        document.querySelector('[data-action="word-detail"]').addEventListener('click', () => this.showWordDetail());

        document.getElementById('tutorialBtn').addEventListener('click', () => this.nextTutorialStep());
        document.querySelectorAll('[data-shop-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchShopTab(tab.dataset.shopTab, e));
        });
        document.querySelector('[data-action="close-shop"]').addEventListener('click', () => this.closeShop());
        document.getElementById('modalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalShareBtn').addEventListener('click', () => this.generateShareImage());
        document.getElementById('favBtn').addEventListener('click', () => this.toggleFavorite());
        document.querySelector('[data-action="close-detail"]').addEventListener('click', () => this.closeDetailModal());
        document.querySelector('[data-action="close-vocab"]').addEventListener('click', () => {
            document.getElementById('vocabModal').classList.remove('active');
        });

        document.querySelector('[data-action="word-bank"]').addEventListener('click', () => this.openWordBank());
        document.querySelector('[data-action="close-word-bank"]').addEventListener('click', () => this.closeWordBank());
        document.getElementById('wbAddBtn').addEventListener('click', () => this.addWordBankFromForm());
        document.querySelector('[data-action="export-word-bank"]').addEventListener('click', () => this.exportWordBank());
        document.querySelector('[data-action="import-word-bank"]').addEventListener('click', () => document.getElementById('wbImportFile').click());
        document.getElementById('wbImportFile').addEventListener('change', (e) => this.importWordBank(e));
    }

    handleSwipe(r1, c1, r2, c2) {
        if (this.isProcessing || this.bombMode) return;
        if (this.gameMode !== 'endless' && this.moves <= 0) return;
        this.clearHint();
        this.trySwap(r1, c1, r2, c2);
    }

    openShop() {
        document.getElementById('shopModal').classList.add('active');
        this.renderShop('theme');
    }

    closeShop() {
        document.getElementById('shopModal').classList.remove('active');
    }

    switchShopTab(type, event) {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');
        this.renderShop(type);
    }

    renderShop(type) {
        const grid = document.getElementById('shopGrid');
        const scoreEl = document.getElementById('shopScore');
        if (!grid) return;
        grid.innerHTML = '';
        scoreEl.textContent = `当前积分: ${this.score}`;
        const items = SHOP_ITEMS.filter(i => i.type === type);
        items.forEach(item => {
            const owned = this.unlockedSkins.includes(item.id);
            const equipped = this[`equipped${type.charAt(0).toUpperCase() + type.slice(1)}`] === item.id;
            const card = document.createElement('div');
            card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
            let btnHtml = '';
            if (equipped) {
                btnHtml = `<button class="shop-btn owned" disabled>已装备</button>`;
            } else if (owned) {
                btnHtml = `<button class="shop-btn equip" onclick="game.equipSkin('${item.id}')">装备</button>`;
            } else {
                const canBuy = this.score >= item.price;
                btnHtml = `<button class="shop-btn buy" onclick="game.buySkin('${item.id}')" ${canBuy ? '' : 'disabled'}>${item.price === 0 ? '免费' : item.price + '分'}</button>`;
            }
            card.innerHTML = `
                ${equipped ? '<div class="equipped-badge">已装备</div>' : ''}
                <div class="shop-preview" style="background:${item.preview}"></div>
                <div class="shop-name">${item.name}</div>
                ${btnHtml}
            `;
            grid.appendChild(card);
        });
    }

    buySkin(id) {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item || this.unlockedSkins.includes(id)) return;
        if (this.score < item.price) {
            this.showToast('积分不足!');
            return;
        }
        this.score -= item.price;
        this.unlockedSkins.push(id);
        this.equipSkin(id);
        this.showToast(`✨ 解锁: ${item.name}`);
        this.saveGlobal();
        this.renderShop(item.type);
    }

    equipSkin(id) {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item || !this.unlockedSkins.includes(id)) return;
        const key = 'equipped' + item.type.charAt(0).toUpperCase() + item.type.slice(1);
        this[key] = id;
        this.applyEquippedTheme();
        this.updateEquipBar();
        this.saveGlobal();
        this.renderShop(item.type);
    }

    updateEquipBar() {
        const bar = document.getElementById('equipBar');
        if (!bar) return;
        const t = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        const b = SHOP_ITEMS.find(i => i.id === this.equippedBoard);
        const e = SHOP_ITEMS.find(i => i.id === this.equippedEffect);
        const f = SHOP_ITEMS.find(i => i.id === this.equippedFrame);
        bar.innerHTML = `
            <span class="equip-tag">🎨 ${t ? t.name : '默认'}</span>
            <span class="equip-tag">🔲 ${b ? b.name : '默认'}</span>
            <span class="equip-tag">✨ ${e ? e.name : '默认'}</span>
            <span class="equip-tag">🏅 ${f ? f.name : '无'}</span>
        `;
    }

    applyEquippedTheme() {
        const item = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        if (item && item.colors) {
            const root = document.documentElement;
            root.style.setProperty('--theme-bg', item.colors.bg);
            root.style.setProperty('--theme-primary', item.colors.primary);
            root.style.setProperty('--theme-target-bg', item.colors.targetBg);
            root.style.setProperty('--theme-target-border', item.colors.targetBorder);
            root.style.setProperty('--theme-select', item.colors.select);
            root.style.setProperty('--theme-board', item.colors.board);
        }
    }

    startTutorial() {
        this.tutorialStep = 0;
        document.getElementById('tutorialModal').classList.add('active');
        this.showTutorialStep(0);
    }

    showTutorialStep(step) {
        const s = TUTORIAL_STEPS[step];
        document.getElementById('tutorialIcon').textContent = s.icon;
        document.getElementById('tutorialTitle').textContent = s.title;
        document.getElementById('tutorialText').textContent = s.text;
        const dots = document.querySelectorAll('#tutorialDots .dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === step));
        const btn = document.getElementById('tutorialBtn');
        if (step === TUTORIAL_STEPS.length - 1) {
            btn.textContent = '开始游戏';
            btn.onclick = () => this.finishTutorial();
        } else {
            btn.textContent = '下一步';
            btn.onclick = () => this.nextTutorialStep();
        }
    }

    nextTutorialStep() {
        this.tutorialStep++;
        if (this.tutorialStep < TUTORIAL_STEPS.length) {
            this.showTutorialStep(this.tutorialStep);
        }
    }

    finishTutorial() {
        document.getElementById('tutorialModal').classList.remove('active');
        localStorage.setItem('wordMatchTutorial', 'done');
    }

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const unlocked = this.achievements[ach.id];
            const card = document.createElement('div');
            card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
            card.innerHTML = `<div class="icon">${ach.icon}</div><div class="name">${ach.name}</div><div class="desc">${ach.desc}</div>`;
            grid.appendChild(card);
        });
    }

    renderLevelMap() {
        const container = document.getElementById('levelMap');
        if (!container) return;
        container.innerHTML = '';
        const total = this.wordLevels.length || 1;
        for (let i = 1; i <= total; i++) {
            const node = document.createElement('div');
            let cls = 'level-node';
            if (i < this.level) cls += ' passed';
            else if (i === this.level) cls += ' current';
            else cls += ' locked';
            node.className = cls;
            node.textContent = i;
            container.appendChild(node);
        }
    }

    loadWordBank() {
        try {
            const raw = localStorage.getItem('wordMatchWordBank');
            this.wordBank = raw ? JSON.parse(raw) : [];
        } catch(e) { this.wordBank = []; }
    }

    saveWordBank() {
        localStorage.setItem('wordMatchWordBank', JSON.stringify(this.wordBank));
    }

    openWordBank() {
        document.getElementById('wordBankModal').classList.add('active');
        this.renderWordBank();
    }

    closeWordBank() {
        document.getElementById('wordBankModal').classList.remove('active');
    }

    renderWordBank() {
        const list = document.getElementById('wordBankList');
        if (!list) return;
        list.innerHTML = '';
        if (this.wordBank.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:#888;padding:20px">还没有自定义单词<br>在上方添加</div>';
        } else {
            this.wordBank.forEach(w => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                item.innerHTML = `<div><span class="word-text">${w.en}</span><span class="word-cn">${w.cn}</span></div>
                    <div class="actions">
                        <button onclick="game.sound.speak('${w.en}')">🔊</button>
                        <button onclick="game.removeWordFromBank('${w.en}')">🗑️</button>
                    </div>`;
                list.appendChild(item);
            });
        }
    }

    addWordBankFromForm() {
        const en = document.getElementById('wbEn').value.trim();
        const cn = document.getElementById('wbCn').value.trim();
        const s = document.getElementById('wbS').value.trim();
        const sc = document.getElementById('wbSc').value.trim();
        if (!en || !cn) { alert('请输入英文单词和中文意思'); return; }
        if (!/^[A-Za-z]+$/.test(en)) { alert('英文单词只能包含字母'); return; }
        const upper = en.toUpperCase();
        if (this.wordBank.find(w => w.en === upper)) { alert('该单词已存在'); return; }
        this.wordBank.push({ en: upper, cn, s: s || `${upper} is a word.`, sc: sc || cn });
        this.saveWordBank();
        this.renderWordBank();
        document.getElementById('wbEn').value = '';
        document.getElementById('wbCn').value = '';
        document.getElementById('wbS').value = '';
        document.getElementById('wbSc').value = '';
    }

    removeWordFromBank(en) {
        this.wordBank = this.wordBank.filter(w => w.en !== en);
        this.saveWordBank();
        this.renderWordBank();
    }

    exportWordBank() {
        const blob = new Blob([JSON.stringify(this.wordBank, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'word-bank.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importWordBank(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data)) throw new Error('格式错误');
                const valid = data.filter(w => w.en && w.cn);
                if (valid.length === 0) throw new Error('没有有效单词');
                if (confirm(`导入 ${valid.length} 个单词，是否覆盖现有单词库？\n选"确定"覆盖，选"取消"追加`)) {
                    this.wordBank = valid.map(w => ({...w, en: w.en.toUpperCase()}));
                } else {
                    for (let w of valid) {
                        const upper = w.en.toUpperCase();
                        if (!this.wordBank.find(x => x.en === upper)) this.wordBank.push({...w, en: upper});
                    }
                }
                this.saveWordBank();
                this.renderWordBank();
                this.showToast(`成功导入 ${valid.length} 个单词`);
            } catch (err) {
                alert('导入失败: ' + err.message);
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    loadDailySave() {
        try {
            const raw = localStorage.getItem('wordMatchDaily');
            if (raw) this.dailyBest = JSON.parse(raw);
        } catch(e) { this.dailyBest = null; }
    }

    saveDaily(best) {
        this.dailyBest = best;
        localStorage.setItem('wordMatchDaily', JSON.stringify(best));
    }

    getDailyWord() {
        if (!this.wordLevels.length) return null;
        const all = this.wordLevels.flat();
        const dateStr = new Date().toISOString().slice(0,10);
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        const index = Math.abs(hash) % all.length;
        return { word: all[index], date: dateStr };
    }

    renderDailyChallenge() {
        const daily = this.getDailyWord();
        const banner = document.getElementById('dailyChallengeBanner');
        const preview = document.getElementById('dailyWordPreview');
        const bestEl = document.getElementById('dailyBestScore');
        if (!banner) return;
        if (!daily) {
            banner.style.display = 'none';
            return;
        }
        banner.style.display = 'block';
        if (preview) preview.textContent = daily.word.en;
        const best = this.dailyBest && this.dailyBest.date === daily.date ? this.dailyBest.score : 0;
        if (bestEl) bestEl.textContent = best;
    }

    startDailyChallenge() {
        const daily = this.getDailyWord();
        if (!daily) return;
        this.targetWord = daily.word.en;
        this.targetChinese = daily.word.cn;
        this.targetSentence = daily.word.s;
        this.targetSentenceCn = daily.word.sc || '';
        this.collectedLetters = {};
        for (let ch of this.targetWord) this.collectedLetters[ch] = 0;
        this.moves = Math.floor(this.targetWord.length * 3.5 + 10);
        this.bombMode = false;
        this.bombSelected = [];
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.startAutoHint();
        this.initialMoves = this.moves;
        this.applyTheme();
        const dailyInfo = document.getElementById('dailyInfo');
        if (dailyInfo) {
            const best = this.dailyBest && this.dailyBest.date === daily.date ? this.dailyBest.score : 0;
            dailyInfo.textContent = `今日单词 · 最佳 ${best}`;
        }
    }

    unlockAchievement(id) {
        if (this.achievements[id]) return;
        this.achievements[id] = true;
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) this.showToast(`🏆 解锁成就：${ach.name}`);
        this.renderAchievements();
        this.saveGlobal();
    }

    unlockAudio() {
        if (this.audioUnlocked) return;
        this.audioUnlocked = true;
        this.sound.ensureContext();
        if (window.speechSynthesis) {
            this.sound.initVoices();
            try { window.speechSynthesis.cancel(); } catch(e){}
        }
    }

    selectMode(mode) {
        this.unlockAudio();
        this.gameMode = mode;
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        if (mode === 'daily') {
            this.startDailyChallenge();
        } else {
            this.startGame();
        }
    }

    backToMenu() {
        const inProgress = this.gameMode !== 'endless' &&
            document.getElementById('gameScreen').style.display !== 'none' &&
            this.initialMoves !== undefined &&
            this.moves < this.initialMoves &&
            !this.isWin();
        if (inProgress) {
            if (!confirm('当前游戏正在进行中，确定要退出吗？')) return;
        }
        clearInterval(this.timedTimer);
        clearTimeout(this.autoHintTimer);
        this.bombMode = false;
        this.bombSelected = [];
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        this.updateGlobalStats();
        this.updateEquipBar();
        this.renderDailyChallenge();
    }

    startGame() {
        this.selectedTile = null; this.isProcessing = false;
        document.getElementById('modal').classList.remove('active');

        if (this.gameMode === 'story') {
            this.loadLevel();
            this.generateBoard();
            this.renderBoard();
            this.updateUI();
            this.startAutoHint();
        } else if (this.gameMode === 'timed') {
            this.timeLeft = 60;
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
        }

        this.initialMoves = this.moves;
        this.applyTheme();
    }

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
    }

    loadLevel() {
        const idx = Math.min(this.level - 1, this.wordLevels.length - 1);
        const group = this.wordLevels[idx];
        if (!group || group.length === 0) {
            console.error('No words for level', this.level);
            alert('加载关卡数据失败，请检查 words.json 文件');
            this.backToMenu();
            return;
        }
        const shuffled = [...group].sort(() => Math.random() - 0.5);
        this.targetWords = shuffled.slice(0, Math.min(3, shuffled.length));
        this.currentWordIndex = 0;
        this.setCurrentTarget(0);
        const avgLen = this.targetWords.reduce((sum, w) => sum + w.en.length, 0) / this.targetWords.length;
        this.moves = Math.floor((avgLen * 4 + 12 + Math.floor(this.level / 2)) * 2.2);
        this.levelResetCount = 0;
        this.levelBombsUsed = 0;
        this.boardSize = this.level >= 15 ? 7 : 6;
    }

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
    }

    loadRandomWord() {
        let pool;
        if (this.gameMode === 'endless') {
            const maxIndex = Math.min(this.endlessDifficulty + 2, this.wordLevels.length - 1);
            pool = [];
            for (let i = 0; i <= maxIndex; i++) pool.push(...this.wordLevels[i]);
        } else {
            pool = this.wordLevels.flat();
        }
        if (this.wordBank.length > 0) {
            pool = pool.concat(this.wordBank);
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
        this.targetWords = null;
        this.currentWordIndex = 0;
    }

    loadReviewWord() {
        if (this.learnedWords.length === 0) {
            alert('还没有学过单词，先去闯关模式学习吧！');
            this.backToMenu();
            return;
        }
        const pool = [...this.learnedWords].sort(() => Math.random() - 0.5);
        this.targetWords = pool.slice(0, Math.min(3, pool.length));
        this.currentWordIndex = 0;
        this.setCurrentTarget(0);
        const avgLen = this.targetWords.reduce((sum, w) => sum + w.en.length, 0) / this.targetWords.length;
        this.moves = Math.floor((avgLen * 3 + 12) * 2.2);
    }

    getLetterPool() {
        const target = [...new Set(this.targetWord.split(''))];
        let extras = ['X', 'Y', 'Z'];
        if (this.gameMode === 'story') {
            if (this.level >= 6) extras.push('Q', 'J');
            if (this.level >= 11) extras.push('V', 'K');
            if (this.level >= 16) extras.push('W', 'F');
            if (this.level >= 21) extras.push('H', 'M');
        } else if (this.gameMode === 'endless') {
            extras = ['X', 'Y', 'Z', 'Q', 'J', 'V'];
            if (this.endlessDifficulty > 2) extras.push('K', 'W');
            if (this.endlessDifficulty > 4) extras.push('F', 'H');
        }
        const pool = [...target];
        for (let e of extras) if (!target.includes(e)) pool.push(e);
        return pool;
    }

    getTargetWeight() {
        if (this.gameMode === 'endless') return 0.45;
        if (this.gameMode === 'timed') return 0.50;
        if (this.gameMode === 'review') return 0.55;
        if (this.level <= 5) return 0.60;
        if (this.level <= 12) return 0.50;
        if (this.level <= 20) return 0.42;
        return 0.35;
    }

    generateBoard(attempts = 0) {
        if (attempts > 50) {
            console.warn('generateBoard: max attempts reached, forcing valid board');
        }
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
        if (!this.hasAnyValidMove() && attempts <= 50) this.generateBoard(attempts + 1);
    }

    removeInitialMatches() {
        let has = true;
        while (has) {
            const m = this.findMatches();
            if (m.length === 0) { has = false; continue; }
            for (let match of m) {
                const pool = this.getLetterPool();
                let nl;
                do { nl = pool[Math.floor(Math.random() * pool.length)]; }
                while (
                    (match.r > 0 && this.board[match.r - 1][match.c] === nl) ||
                    (match.r < this.boardSize - 1 && this.board[match.r + 1][match.c] === nl) ||
                    (match.c > 0 && this.board[match.r][match.c - 1] === nl) ||
                    (match.c < this.boardSize - 1 && this.board[match.r][match.c + 1] === nl)
                );
                this.board[match.r][match.c] = nl;
            }
        }
    }

    hasMatchAt(r, c) {
        const ch = this.board[r][c];
        if (!ch) return false;
        let count = 1;
        for (let i = c - 1; i >= 0 && this.board[r][i] === ch; i--) count++;
        for (let i = c + 1; i < this.boardSize && this.board[r][i] === ch; i++) count++;
        if (count >= 3) return true;
        count = 1;
        for (let i = r - 1; i >= 0 && this.board[i][c] === ch; i--) count++;
        for (let i = r + 1; i < this.boardSize && this.board[i][c] === ch; i++) count++;
        return count >= 3;
    }

    hasAnyValidMove() {
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (c < this.boardSize - 1) {
                    this.swap(r, c, r, c + 1);
                    const ok = this.hasMatchAt(r, c) || this.hasMatchAt(r, c + 1);
                    this.swap(r, c, r, c + 1);
                    if (ok) return true;
                }
                if (r < this.boardSize - 1) {
                    this.swap(r, c, r + 1, c);
                    const ok = this.hasMatchAt(r, c) || this.hasMatchAt(r + 1, c);
                    this.swap(r, c, r + 1, c);
                    if (ok) return true;
                }
            }
        }
        return false;
    }

    swap(r1, c1, r2, c2) {
        const t = this.board[r1][c1]; this.board[r1][c1] = this.board[r2][c2]; this.board[r2][c2] = t;
    }

    renderBoard() {
        const el = document.getElementById('gameBoard');
        el.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        el.style.maxWidth = this.boardSize === 7 ? '360px' : '320px';
        const boardSkin = this.equippedBoard;

        const existing = {};
        el.querySelectorAll('.tile').forEach(t => {
            const r = parseInt(t.dataset.r), c = parseInt(t.dataset.c);
            existing[`${r},${c}`] = t;
        });

        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const key = `${r},${c}`;
                const letter = this.board[r][c];
                const cls = 'tile-' + letter.toLowerCase();
                let skinCls = '';
                if (boardSkin === 'crystal_board') skinCls = ' tile-crystal';
                else if (boardSkin === 'pixel_board') skinCls = ' tile-pixel';
                else if (boardSkin === 'metal_board') skinCls = ' tile-metal';
                else if (boardSkin === 'ink_board') skinCls = ' tile-ink';
                const fullClass = `tile ${cls}${skinCls}`;

                let tile = existing[key];
                if (tile) {
                    if (tile.textContent !== letter) tile.textContent = letter;
                    if (tile.className !== fullClass) tile.className = fullClass;
                    delete existing[key];
                } else {
                    tile = document.createElement('div');
                    tile.className = fullClass;
                    tile.textContent = letter;
                    tile.dataset.r = r; tile.dataset.c = c;
                    el.appendChild(tile);
                }
            }
        }

        for (let key in existing) existing[key].remove();
        this.renderTarget();
    }

    renderTarget() {
        const el = document.getElementById('targetWord');
        el.innerHTML = '';
        const needed = {};
        for (let ch of this.targetWord) needed[ch] = (needed[ch] || 0) + 1;
        const got = {};
        for (let ch of this.targetWord) {
            got[ch] = (got[ch] || 0) + 1;
            const slot = document.createElement('div');
            const have = (this.collectedLetters[ch] || 0) >= got[ch];
            slot.className = `letter-slot ${have ? 'collected' : 'pending'}`;
            slot.textContent = have ? ch : '?';
            el.appendChild(slot);
        }
        let total = 0, have = 0;
        for (let ch in needed) { total += needed[ch]; have += Math.min(this.collectedLetters[ch] || 0, needed[ch]); }
        document.getElementById('progressFill').style.width = (have / total * 100) + '%';
        document.getElementById('chineseMeaning').textContent = this.targetChinese;
        const totalWords = this.targetWords ? this.targetWords.length : 1;
        const current = this.currentWordIndex !== undefined ? this.currentWordIndex + 1 : 1;
        document.getElementById('targetLabel').textContent = `目标单词 (${current}/${totalWords})`;
    }

    handleClick(r, c) {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.isProcessing) return;
        if (this.gameMode !== 'endless' && this.moves <= 0 && !this.bombMode) return;
        if (this.bombMode) { this.handleBombClick(r, c); return; }
        this.clearHint();
        const clicked = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (!this.selectedTile) {
            this.selectedTile = { r, c, el: clicked };
            clicked.classList.add('selected');
        } else {
            const prev = this.selectedTile;
            prev.el.classList.remove('selected');
            this.selectedTile = null;
            const dr = Math.abs(prev.r - r), dc = Math.abs(prev.c - c);
            if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                this.trySwap(prev.r, prev.c, r, c);
            }
        }
    }

    activateBomb() {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.bombMode) { this.cancelBomb(); return; }
        if (this.bombs <= 0 || this.isProcessing) return;
        this.levelBombsUsed++;
        this.bombMode = true;
        this.bombSelected = [];
        const remain = this.nextBombAt - this.score;
        const hint = remain > 0 ? `(再得 ${remain} 分兑换下一颗)` : '';
        this.showToast(`💣 炸弹模式：点击棋盘上的3个字母进行消除 ${hint}`);
        document.getElementById('gameBoard').style.cursor = 'crosshair';
    }

    cancelBomb() {
        this.bombMode = false;
        this.bombSelected = [];
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
        this.showToast('已取消炸弹模式');
    }

    async handleBombClick(r, c) {
        this.resetAutoHint();
        const idx = this.bombSelected.findIndex(t => t.r === r && t.c === c);
        const tileEl = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (idx >= 0) {
            this.bombSelected.splice(idx, 1);
            if (tileEl) tileEl.classList.remove('bomb-target');
            return;
        }
        this.bombSelected.push({ r, c });
        if (tileEl) tileEl.classList.add('bomb-target');
        if (this.bombSelected.length >= 3) {
            this.bombMode = false;
            this.bombs--;
            document.getElementById('gameBoard').style.cursor = '';
            this.updateUI();
            const matches = this.bombSelected.map(t => ({ r: t.r, c: t.c, letter: this.board[t.r][t.c] }));
            this.bombSelected = [];
            document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
            this.isProcessing = true;
            await this.processMatches(matches);
            this.isProcessing = false;
            this.checkWin();
        }
    }

    async trySwap(r1, c1, r2, c2) {
        this.isProcessing = true;
        this.swap(r1, c1, r2, c2);
        this.renderBoard();
        const matches = this.findMatches();
        if (matches.length > 0) {
            if (this.gameMode !== 'endless') this.moves--;
            this.sound.play('swap');
            await this.processMatches(matches);
            this.checkWin();
        } else {
            this.sound.play('invalid');
            const el1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
            const el2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
            if (el1) el1.classList.add('shake');
            if (el2) el2.classList.add('shake');
            setTimeout(() => {
                if (el1) el1.classList.remove('shake');
                if (el2) el2.classList.remove('shake');
            }, 400);
            await new Promise(r => setTimeout(r, 250));
            this.swap(r1, c1, r2, c2);
            this.renderBoard();
        }
        this.updateUI();
        this.isProcessing = false;
        if (this.gameMode !== 'endless' && this.moves <= 0 && !this.isWin()) {
            this.sound.play('lose');
            this.showModal('lose');
        }
    }

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
    }

    spawnParticles(x, y, color) {
        const container = document.getElementById('boardContainer');
        const effect = this.equippedEffect;
        const count = effect === 'rainbow_effect' ? 12 : 8;
        for (let i = 0; i < count; i++) {
            let p = this.particlePool.pop();
            if (!p) {
                p = document.createElement('div');
                p.style.position = 'absolute';
                p.style.pointerEvents = 'none';
                p.style.zIndex = '40';
            }
            p.style.display = '';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.transform = '';
            p.style.opacity = '';
            p.style.filter = '';
            p.style.transition = '';
            const angle = (Math.PI * 2 * i) / count;
            const dist = 30 + Math.random() * 30;
            p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            if (effect === 'star_effect') {
                p.className = '';
                p.innerHTML = '⭐';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 0.8s ease forwards';
            } else if (effect === 'heart_effect') {
                p.className = '';
                p.innerHTML = '💗';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 1s ease forwards';
            } else if (effect === 'paper_effect') {
                p.className = 'particle';
                p.innerHTML = '';
                p.style.width = '8px';
                p.style.height = '5px';
                p.style.borderRadius = '0';
                p.style.background = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57'][i % 5];
                p.style.animation = 'particleBurst 1.2s ease forwards';
            } else if (effect === 'rainbow_effect') {
                p.className = 'particle';
                p.innerHTML = '';
                p.style.width = '8px';
                p.style.height = '8px';
                p.style.borderRadius = '50%';
                p.style.background = `hsl(${(i * 360 / count)},80%,60%)`;
                p.style.transition = 'transform 0.3s, opacity 0.3s';
                p.style.animation = 'particleBurst 1s ease forwards';
                p.style.filter = 'drop-shadow(0 0 4px currentColor)';
            } else {
                p.className = 'particle';
                p.innerHTML = '';
                p.style.background = color;
                p.style.animation = 'particleBurst 0.8s ease forwards';
            }
            container.appendChild(p);
            const duration = effect === 'paper_effect' ? 1200 : 1000;
            setTimeout(() => {
                if (p.parentNode) p.parentNode.removeChild(p);
                p.style.display = 'none';
                this.particlePool.push(p);
            }, duration);
        }
    }

    spawnScorePopup(x, y, score) {
        const container = document.getElementById('boardContainer');
        const el = document.createElement('div');
        el.className = 'score-popup';
        el.textContent = '+' + score;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

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
                        collectedAny = true;
                    }
                }
            }
            if (collectedAny) this.sound.play('collect');
            this.sound.play('match');
            const pts = matches.length * 10 * combo;
            this.score += pts;

            for (let m of matches) {
                const t = document.querySelector(`[data-r="${m.r}"][data-c="${m.c}"]`);
                if (t) {
                    t.classList.add('matched');
                    const rect = t.getBoundingClientRect();
                    const containerRect = document.getElementById('boardContainer').getBoundingClientRect();
                    this.spawnParticles(rect.left - containerRect.left + rect.width / 2, rect.top - containerRect.top + rect.height / 2, getComputedStyle(t).background);
                    this.spawnScorePopup(rect.left - containerRect.left, rect.top - containerRect.top, pts / matches.length);
                }
            }
            if (combo > 1) {
                const el = document.createElement('div');
                el.className = 'combo-indicator';
                el.textContent = combo + ' COMBO!';
                document.getElementById('gameBoard').appendChild(el);
                setTimeout(() => el.remove(), 800);
            }
            await new Promise(r => setTimeout(r, 400));
            this.removeAndFill(matches);
            this.renderBoard();
            document.querySelectorAll('.tile').forEach(t => t.classList.add('falling'));
            await new Promise(r => setTimeout(r, 300));
            matches = this.findMatches();
        }
        if (matches.length === 0 && !this.hasAnyValidMove()) {
            this.generateBoard();
            this.renderBoard();
        }
        this.renderTarget();
        this.checkBombReward();
    }

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
    }

    isWin() {
        const need = {};
        for (let ch of this.targetWord) need[ch] = (need[ch] || 0) + 1;
        for (let ch in need) if ((this.collectedLetters[ch] || 0) < need[ch]) return false;
        return true;
    }

    checkWin() {
        if (this.isWin()) {
            this.addLearnedWord();
            if (this.gameMode === 'story') {
                if (this.currentWordIndex < this.targetWords.length - 1) {
                    this.score += 50 + this.targetWord.length * 20;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    this.isProcessing = true;
                    setTimeout(() => { this.isProcessing = false; this.showWordComplete(); }, 400);
                } else {
                    this.score += this.moves * 50;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    if (this.levelBombsUsed === 0) this.unlockAchievement('zero_bomb');
                    if (this.levelResetCount === 0) this.unlockAchievement('perfect_level');
                    if (this.level >= this.wordLevels.length) this.unlockAchievement('master');
                    this.isProcessing = true;
                    setTimeout(() => { this.isProcessing = false; this.showModal('win'); }, 400);
                }
            } else if (this.gameMode === 'timed') {
                this.score += 100 + this.targetWord.length * 50;
                this.checkBombReward();
                this.updateTimedUI();
                this.sound.play('win');
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                this.isProcessing = true;
                setTimeout(() => {
                    this.loadRandomWord();
                    this.generateBoard();
                    this.renderBoard();
                    this.isProcessing = false;
                }, 500);
            } else if (this.gameMode === 'endless') {
                this.endlessWords++;
                this.score += 100 + this.targetWord.length * 30;
                if (this.endlessWords % 3 === 0) this.endlessDifficulty++;
                this.checkBombReward();
                this.updateEndlessUI();
                this.sound.play('win');
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                this.isProcessing = true;
                setTimeout(() => {
                    this.loadRandomWord();
                    this.generateBoard();
                    this.renderBoard();
                    this.applyTheme();
                    this.isProcessing = false;
                }, 500);
            } else if (this.gameMode === 'review') {
                if (this.currentWordIndex < this.targetWords.length - 1) {
                    this.score += 30;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    this.isProcessing = true;
                    setTimeout(() => { this.isProcessing = false; this.showWordComplete(); }, 400);
                } else {
                    this.score += 50;
                    this.checkBombReward();
                    this.saveGlobal();
                    this.updateUI();
                    this.sound.play('win');
                    this.isProcessing = true;
                    setTimeout(() => { this.isProcessing = false; this.showModal('win'); }, 400);
                }
            } else if (this.gameMode === 'daily') {
                this.score += this.moves * 50;
                this.checkBombReward();
                this.saveGlobal();
                this.updateUI();
                this.sound.play('win');
                const daily = this.getDailyWord();
                const currentBest = this.dailyBest && this.dailyBest.date === daily.date ? this.dailyBest.score : 0;
                if (this.score > currentBest) {
                    this.saveDaily({ date: daily.date, score: this.score, word: this.targetWord });
                }
                this.isProcessing = true;
                setTimeout(() => { this.isProcessing = false; this.showModal('win'); }, 400);
            }
        }
    }

    addLearnedWord() {
        const wordObj = { en: this.targetWord, cn: this.targetChinese, s: this.targetSentence, sc: this.targetSentenceCn };
        const exists = this.learnedWords.find(w => w.en === this.targetWord);
        if (!exists) {
            this.learnedWords.push(wordObj);
            this.unlockAchievement('first_word');
            if (this.learnedWords.length >= 50) this.unlockAchievement('collector');
        }
    }

    showWordComplete() {
        const modal = document.getElementById('modal');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        const btn = document.getElementById('modalBtn');
        const sentenceBox = document.getElementById('sentenceBox');

        icon.textContent = '✅';
        title.textContent = `单词 ${this.currentWordIndex + 1}/${this.targetWords.length} 完成!`;
        text.textContent = `你成功拼出了 "${this.targetWord}" (${this.targetChinese})!\n准备挑战下一个单词`;
        document.getElementById('sentenceEn').textContent = this.targetSentence;
        document.getElementById('sentenceCn').textContent = this.targetSentenceCn;
        sentenceBox.style.display = 'block';
        document.getElementById('modalShareBtn').style.display = 'none';

        btn.textContent = '下一个单词';
        btn.onclick = () => {
            this.closeModal();
            this.currentWordIndex++;
            this.setCurrentTarget(this.currentWordIndex);
            this.generateBoard();
            this.renderBoard();
            this.renderTarget();
            this.updateUI();
        };

        modal.classList.add('active');
        this.sound.speak(this.targetWord + '. ' + this.targetSentence);
    }

    showModal(type) {
        const modal = document.getElementById('modal');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        const btn = document.getElementById('modalBtn');
        const sentenceBox = document.getElementById('sentenceBox');
        const actions = document.getElementById('modalActions');

        if (type === 'win') {
            icon.textContent = '🎉';
            document.getElementById('modalShareBtn').style.display = 'inline-block';
            if (this.gameMode === 'story') {
                const total = this.targetWords ? this.targetWords.length : 1;
                title.textContent = '恭喜通关!';
                text.textContent = `你成功拼出了 ${total} 个单词!\n剩余步数奖励已计入总分`;
                btn.textContent = '下一关';
                btn.onclick = () => { this.closeModal(); this.nextLevel(); };
            } else if (this.gameMode === 'timed') {
                title.textContent = '拼词成功!';
                text.textContent = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n继续挑战下一个！`;
                btn.textContent = '继续';
                btn.onclick = () => this.closeModal();
            } else if (this.gameMode === 'endless') {
                title.textContent = `第 ${this.endlessWords} 个单词!`;
                text.textContent = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n难度等级: ${this.endlessDifficulty}`;
                btn.textContent = '继续';
                btn.onclick = () => this.closeModal();
            } else if (this.gameMode === 'review') {
                const total = this.targetWords ? this.targetWords.length : 1;
                title.textContent = '复习完成!';
                text.textContent = `你成功拼出了 ${total} 个单词!`;
                btn.textContent = '再来一组';
                btn.onclick = () => { this.closeModal(); this.startGame(); };
            } else if (this.gameMode === 'daily') {
                title.textContent = '每日挑战完成!';
                text.textContent = `今日单词 "${this.targetWord}" (${this.targetChinese})\n得分 ${this.score}`;
                btn.textContent = '再来一次';
                btn.onclick = () => { this.closeModal(); this.startDailyChallenge(); };
            }
            document.getElementById('sentenceEn').textContent = this.targetSentence;
            document.getElementById('sentenceCn').textContent = this.targetChinese + '：' + this.targetSentence;
            sentenceBox.style.display = 'block';
            actions.style.display = 'flex';
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        } else {
            icon.textContent = '😢';
            if (this.gameMode === 'timed') {
                title.textContent = '时间到!';
                text.textContent = `时间到了！你一共拼出了 ${this.endlessWords} 个单词，得分 ${this.score}`;
            } else if (this.gameMode === 'daily') {
                title.textContent = '挑战失败';
                text.textContent = `今日单词 "${this.targetWord}" (${this.targetChinese})\n再试一次吧!`;
            } else {
                title.textContent = '步数用尽';
                text.textContent = `还差一点点就能拼出 "${this.targetWord}" (${this.targetChinese}) 了，再试一次吧!`;
            }
            sentenceBox.style.display = 'none';
            actions.style.display = 'flex';
            if (this.gameMode === 'timed') {
                if (this.endlessWords >= 10) this.unlockAchievement('speed_demon');
                btn.textContent = '再来一次';
                btn.onclick = () => { this.closeModal(); this.startGame(); };
            } else if (this.gameMode === 'daily') {
                btn.textContent = '再来一次';
                btn.onclick = () => { this.closeModal(); this.startDailyChallenge(); };
            } else {
                btn.textContent = '重试';
                btn.onclick = () => { this.closeModal(); this.resetLevel(); };
            }
        }
        modal.classList.add('active');
    }

    closeModal() { document.getElementById('modal').classList.remove('active'); }

    nextLevel() {
        this.clearHint();
        this.resetAutoHint();
        this.bombMode = false;
        this.bombSelected = [];
        this.isProcessing = false;
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));

        this.level++;
        this.loadLevel();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.applyTheme();
        this.saveGlobal();
        this.startAutoHint();
    }

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
    }

    resetLevel() {
        this.score = Math.max(0, this.score - 50);
        this.levelResetCount++;
        this.loadLevel();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.saveGlobal();
    }

    shuffleBoard() {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.gameMode !== 'endless' && this.moves < 5 && !this.bombMode) return;
        if (this.gameMode !== 'endless' && !this.bombMode) this.moves -= 5;
        this.clearHint();
        this.bombMode = false;
        this.bombSelected = [];
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.saveGlobal();
    }

    updateUI() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = this.gameMode === 'review' ? '复习' : '关卡';
        document.getElementById('labelMoves').textContent = this.gameMode === 'endless' ? '已拼' : '步数';
        if (this.gameMode === 'endless') document.getElementById('moves').textContent = this.endlessWords;
        this.updateBombUI();
    }

    updateBombUI() {
        const bombBtn = document.getElementById('bombBtn');
        const bombCount = document.getElementById('bombCount');
        if (bombCount) bombCount.textContent = this.bombs;
        if (bombBtn) {
            bombBtn.disabled = this.bombs <= 0 || this.bombMode || this.isProcessing;
            const remain = this.nextBombAt - this.score;
            bombBtn.title = remain > 0 ? `再得 ${remain} 分兑换下一颗炸弹` : '已有炸弹可用';
        }
    }

    updateTimedUI() {
        document.getElementById('level').textContent = '限时';
        document.getElementById('moves').textContent = this.timeLeft + 's';
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '剩余';
        document.getElementById('timerBar').style.display = 'block';
        this.updateBombUI();
    }

    updateEndlessUI() {
        document.getElementById('level').textContent = '无尽';
        document.getElementById('moves').textContent = this.endlessWords;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '已拼';
        document.getElementById('timerBar').style.display = 'none';
        this.updateBombUI();
    }

    startTimedMode() {
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
    }

    toggleSound() {
        this.sound.enabled = !this.sound.enabled;
        const btn = document.getElementById('soundBtn');
        btn.textContent = this.sound.enabled ? '🔊 音效' : '🔇 静音';
        btn.classList.toggle('off', !this.sound.enabled);
    }

    toggleTTS() {
        this.sound.speakEnabled = !this.sound.speakEnabled;
        const btn = document.getElementById('ttsBtn');
        btn.textContent = this.sound.speakEnabled ? '🗣️ 朗读' : '🤐 静音';
        btn.classList.toggle('off', !this.sound.speakEnabled);
        this.saveGlobal();
    }

    showHint() {
        this.unlockAudio();
        if (this.hintCooldown > 0 || this.isProcessing) return;
        this.clearHint();
        const move = this.findValidMove();
        if (!move) return;
        const t1 = document.querySelector(`[data-r="${move.r1}"][data-c="${move.c1}"]`);
        const t2 = document.querySelector(`[data-r="${move.r2}"][data-c="${move.c2}"]`);
        if (t1 && t2) { t1.classList.add('hint'); t2.classList.add('hint'); }
        this.hintCooldown = 10;
        this.updateHintButton();
        const interval = setInterval(() => {
            this.hintCooldown--;
            this.updateHintButton();
            if (this.hintCooldown <= 0) clearInterval(interval);
        }, 1000);
    }

    findValidMove() {
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (c < this.boardSize - 1) {
                    this.swap(r, c, r, c + 1);
                    const ok = this.hasMatchAt(r, c) || this.hasMatchAt(r, c + 1);
                    this.swap(r, c, r, c + 1);
                    if (ok) return { r1: r, c1: c, r2: r, c2: c + 1 };
                }
                if (r < this.boardSize - 1) {
                    this.swap(r, c, r + 1, c);
                    const ok = this.hasMatchAt(r, c) || this.hasMatchAt(r + 1, c);
                    this.swap(r, c, r + 1, c);
                    if (ok) return { r1: r, c1: c, r2: r + 1, c2: c };
                }
            }
        }
        return null;
    }

    clearHint() {
        document.querySelectorAll('.tile.hint').forEach(t => t.classList.remove('hint'));
    }

    updateHintButton() {
        const btn = document.getElementById('hintBtn');
        if (this.hintCooldown > 0) {
            btn.disabled = true;
            btn.innerHTML = `💡 提示 <span style="font-size:11px;display:block">${this.hintCooldown}s</span>`;
        } else {
            btn.disabled = false;
            btn.innerHTML = '💡 提示';
        }
    }

    startAutoHint() {
        this.scheduleAutoHint();
    }

    scheduleAutoHint() {
        if (this.autoHintTimer) clearTimeout(this.autoHintTimer);
        this.autoHintTimer = setTimeout(() => {
            if (!this.isProcessing && this.moves > 0 && this.hintCooldown <= 0 && !this.bombMode) {
                this.showHint();
            }
            this.scheduleAutoHint();
        }, 10000);
    }

    resetAutoHint() {
        if (this.autoHintTimer) clearTimeout(this.autoHintTimer);
        this.scheduleAutoHint();
    }

    showWordDetail() {
        document.getElementById('detailWord').textContent = this.targetWord;
        document.getElementById('detailSentence').textContent = this.targetSentence;
        document.getElementById('detailCn').textContent = this.targetSentenceCn || this.targetChinese;
        const isFav = this.favorites.some(w => w.en === this.targetWord);
        document.getElementById('favBtn').textContent = isFav ? '❤️ 已收藏' : '⭐ 收藏';
        document.getElementById('detailModal').classList.add('active');
        this.sound.speak(this.targetWord);
    }

    closeDetailModal() {
        document.getElementById('detailModal').classList.remove('active');
    }

    toggleFavorite() {
        const idx = this.favorites.findIndex(w => w.en === this.targetWord);
        if (idx >= 0) {
            this.favorites.splice(idx, 1);
            document.getElementById('favBtn').textContent = '⭐ 收藏';
        } else {
            this.favorites.push({ en: this.targetWord, cn: this.targetChinese, s: this.targetSentence });
            document.getElementById('favBtn').textContent = '❤️ 已收藏';
        }
        this.saveGlobal();
    }

    showVocab() {
        const list = document.getElementById('vocabList');
        list.innerHTML = '';
        if (this.favorites.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:#888;padding:20px">还没有收藏单词<br>游戏中点击 ⭐ 可以收藏</div>';
        } else {
            this.favorites.forEach(w => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                item.innerHTML = `<div><span class="word-text">${w.en}</span><span class="word-cn">${w.cn}</span></div>
                    <div class="actions">
                        <button onclick="game.sound.speak('${w.en}')">🔊</button>
                        <button onclick="game.removeFavorite('${w.en}')">🗑️</button>
                    </div>`;
                list.appendChild(item);
            });
        }
        document.getElementById('vocabModal').classList.add('active');
    }

    removeFavorite(en) {
        this.favorites = this.favorites.filter(w => w.en !== en);
        this.saveGlobal();
        this.showVocab();
    }

    wrapText(ctx, text, maxWidth) {
        const chars = text.split('');
        let line = '';
        const lines = [];
        for (let i = 0; i < chars.length; i++) {
            const testLine = line + chars[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line);
                line = chars[i];
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        return lines;
    }

    generateShareImage() {
        const canvas = document.getElementById('shareCanvas');
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        const w = 600, h = 400;
        canvas.width = w; canvas.height = h;

        const grd = ctx.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, '#667eea');
        grd.addColorStop(1, '#764ba2');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('单词拼拼消', w / 2, 70);

        ctx.font = 'bold 72px sans-serif';
        ctx.fillText(this.targetWord, w / 2, 160);

        ctx.font = '32px sans-serif';
        ctx.fillText(this.targetChinese, w / 2, 205);

        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        const sentenceLines = this.wrapText(ctx, this.targetSentence, w - 80);
        let sy = 245;
        sentenceLines.forEach(line => {
            ctx.fillText(line, w / 2, sy);
            sy += 32;
        });

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#ffd700';
        const modeText = this.gameMode === 'story' ? `第 ${this.level} 关` : this.gameMode === 'timed' ? '限时挑战' : '无尽模式';
        ctx.fillText(`${modeText} · 得分 ${this.score}`, w / 2, 355);

        const link = document.createElement('a');
        link.download = 'word-match-score.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

const game = new WordMatchGame();
