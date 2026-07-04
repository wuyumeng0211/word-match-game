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

const LETTER_COLOR_PALETTE = [
    { bg:'#005ab5', bg2:'#3f8fd8', fg:'#ffffff', border:'#003f80' },
    { bg:'#009e73', bg2:'#42c69e', fg:'#ffffff', border:'#006f51' },
    { bg:'#d81b60', bg2:'#ec6793', fg:'#ffffff', border:'#a50f45' },
    { bg:'#000000', bg2:'#4b5563', fg:'#ffffff', border:'#000000' },
    { bg:'#ff7f00', bg2:'#ffb24d', fg:'#ffffff', border:'#b85c00' },
    { bg:'#ffff33', bg2:'#fff98a', fg:'#3f3f00', border:'#b5ad00' },
    { bg:'#0067b9', bg2:'#3b9ae1', fg:'#ffffff', border:'#004d8a' },
    { bg:'#e87500', bg2:'#f7ad45', fg:'#ffffff', border:'#a94f00' },
    { bg:'#008f5a', bg2:'#40c98c', fg:'#ffffff', border:'#006b43' },
    { bg:'#c43c8c', bg2:'#e47db6', fg:'#ffffff', border:'#92286a' },
    { bg:'#b73a18', bg2:'#e97955', fg:'#ffffff', border:'#842610' },
    { bg:'#7055c7', bg2:'#a18ae9', fg:'#ffffff', border:'#503b99' },
    { bg:'#9b6b00', bg2:'#d8a82f', fg:'#ffffff', border:'#704d00' },
    { bg:'#00838f', bg2:'#42bdc4', fg:'#ffffff', border:'#005e66' },
    { bg:'#5e7314', bg2:'#9bac50', fg:'#ffffff', border:'#43520e' },
    { bg:'#7b4a2d', bg2:'#b57b55', fg:'#ffffff', border:'#58331e' },
    { bg:'#343a70', bg2:'#6870b5', fg:'#ffffff', border:'#252a52' },
    { bg:'#8f2c21', bg2:'#c9685d', fg:'#ffffff', border:'#661e17' },
    { bg:'#334155', bg2:'#718096', fg:'#ffffff', border:'#1f2937' },
    { bg:'#a54800', bg2:'#d97d37', fg:'#ffffff', border:'#753300' },
    { bg:'#506b00', bg2:'#8cab36', fg:'#ffffff', border:'#384c00' },
    { bg:'#156b78', bg2:'#58aab5', fg:'#ffffff', border:'#0e4c56' }
];

const CORE_LETTER_COLORS = LETTER_COLOR_PALETTE.slice(0, 6);

const LETTER_PATTERNS = [
    '',
    'repeating-linear-gradient(135deg, rgba(255,255,255,.16) 0 4px, transparent 4px 12px)',
    'repeating-linear-gradient(0deg, rgba(255,255,255,.14) 0 3px, transparent 3px 11px)',
    'radial-gradient(circle at 22% 24%, rgba(255,255,255,.22) 0 3px, transparent 3px)',
    'repeating-linear-gradient(90deg, rgba(255,255,255,.13) 0 3px, transparent 3px 12px)',
    'repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 2px, transparent 2px 9px)'
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
    { id:'gold_frame', name:'黄金词汇王', type:'frame', price:10000, preview:'#ffd700' },
    { id:'first_hint', name:'首字母提示', type:'tool', price:600, preview:'#fde68a', desc:'高亮下一个还没收集够的字母' },
    { id:'definition_card', name:'释义扩展卡', type:'tool', price:900, preview:'#bfdbfe', desc:'查看单词词义、例句和掌握度' },
    { id:'sentence_card', name:'例句拆解卡', type:'tool', price:900, preview:'#bbf7d0', desc:'显示例句中文翻译并自动朗读' },
    { id:'retry_card', name:'错词复活卡', type:'tool', price:1600, preview:'#fecaca', desc:'失败后保留当前单词进度重试' },
    { id:'review_boost', name:'复习加倍卡', type:'tool', price:2200, preview:'#ddd6fe', desc:'下一次复习完成奖励翻倍' }
];

const COMPANIONS = [
    { id:'dino', name:'背包小恐龙', price:0, image:'assets/companions/dino.png', item:'dino_snack', itemName:'能量果干' },
    { id:'mecha', name:'苍蓝机甲', price:5200, image:'assets/companions/mecha.png', item:'mecha_cell', itemName:'护盾电池' },
    { id:'princess', name:'星愿公主', price:5200, image:'assets/companions/princess.png', item:'princess_wand', itemName:'星光糖果' }
];

const COMPANION_ITEMS = [
    { id:'dino_snack', companion:'dino', name:'能量果干', price:900, icon:'🍎' },
    { id:'mecha_cell', companion:'mecha', name:'护盾电池', price:1200, icon:'🔋' },
    { id:'princess_wand', companion:'princess', name:'星光糖果', price:1100, icon:'⭐' }
];

const COMPANION_DEFAULT_NAMES = { dino:'阿啦', mecha:'小蓝', princess:'星儿' };
const COMPANION_LINES = {
  dino: { // 阿啦：活泼好奇的小恐龙，像兴奋的小朋友，口语化、爱感叹
    idle: [
      {en:"Rawr! Let's learn together!", zh:"吼！我们一起学习吧！"},
      {en:"Yay, you're back! I missed you!", zh:"耶，你回来啦！我好想你！"},
      {en:"New words are so yummy to me!", zh:"新单词对我来说超好吃的！"}
    ],
    win: [
      {en:"Wow! You're super duper strong!", zh:"哇！你超级超级厉害！"},
      {en:"We did it! High five!", zh:"我们做到啦！击个掌！"},
      {en:"Rawr! That was awesome!", zh:"吼！太棒啦！"}
    ],
    evolve: [
      {en:"I'm growing bigger! Thank you!", zh:"我长大啦！谢谢你！"},
      {en:"Rawr-some! I feel so strong now!", zh:"吼——我现在感觉好强大！"}
    ],
    daily: [
      {en:"{days} days together! So happy!", zh:"在一起{days}天啦！好开心！"},
      {en:"You came back for {days} days! Yay!", zh:"你连续来了{days}天！耶！"}
    ],
    miss: [
      {en:"I waited so long... I missed you!", zh:"我等了好久…好想你！"},
      {en:"You're here! Don't go away again!", zh:"你来啦！别再走开了嘛！"}
    ]
  },
  mecha: { // 小蓝：机甲机器人，精准、科技感、报告式口吻，称呼 Captain
    idle: [
      {en:"Systems online. Ready for action!", zh:"系统在线，准备就绪！"},
      {en:"Learning module activated, Captain.", zh:"学习模块已激活，队长。"},
      {en:"Scanning for new words... ready!", zh:"正在扫描新单词…准备完毕！"}
    ],
    win: [
      {en:"Mission complete. Outstanding work!", zh:"任务完成，表现出色！"},
      {en:"Victory confirmed. Shields at full!", zh:"胜利确认，护盾全开！"},
      {en:"Performance: excellent. Well done!", zh:"性能评估：优秀。干得好！"}
    ],
    evolve: [
      {en:"Core upgrade complete. Powering up!", zh:"核心升级完成，能量提升！"},
      {en:"Evolution sequence finished. Stronger now!", zh:"进化程序完成，更强了！"}
    ],
    daily: [
      {en:"{days} days of loyalty logged. Impressive!", zh:"已记录{days}天忠诚登录，了不起！"},
      {en:"Streak: {days} days. Discipline confirmed!", zh:"连续{days}天，纪律性确认！"}
    ],
    miss: [
      {en:"Signal restored. I was on standby.", zh:"信号恢复，我一直在待机。"},
      {en:"Reconnection successful. Welcome back, Captain.", zh:"重新连接成功，欢迎回来，队长。"}
    ]
  },
  princess: { // 星儿：温柔优雅的星星公主，鼓励式、有礼貌、梦幻
    idle: [
      {en:"You shine so brightly today!", zh:"你今天闪闪发光呢！"},
      {en:"Let's spell something wonderful!", zh:"我们来拼出美妙的单词吧！"},
      {en:"I believe in you, always.", zh:"我永远相信你。"}
    ],
    win: [
      {en:"Gracefully done, my dear friend!", zh:"完成得真优雅，我亲爱的朋友！"},
      {en:"Simply magical! You were wonderful.", zh:"简直像魔法！你太棒了。"},
      {en:"Another star earned. Beautiful!", zh:"又赢得一颗星，真美！"}
    ],
    evolve: [
      {en:"My magic awakens. Thank you, dear!", zh:"我的魔法觉醒了，谢谢你！"},
      {en:"I sparkle brighter now, thanks to you!", zh:"因为有你，我闪得更亮了！"}
    ],
    daily: [
      {en:"{days} days by your side. So grateful!", zh:"陪你{days}天啦，好感激！"},
      {en:"Our {days}-day promise, I remember it.", zh:"我们{days}天的约定，我都记得。"}
    ],
    miss: [
      {en:"I felt lonely without you...", zh:"没有你，我有点寂寞…"},
      {en:"You're back at last. I missed you.", zh:"你终于回来啦，我好想你。"}
    ]
  }
};

const COMPANION_VOICE = {
  dino:     { pitch: 1.6,  rate: 1.05, gender: 'female', prefer: ['samantha','google us english','zira','ava','allison'] }, // 高、活泼（女童声）
  mecha:    { pitch: 0.5,  rate: 0.92, gender: 'male',   prefer: ['daniel','alex','fred','google uk english male','david','mark','rishi','aaron','tom'] }, // 低沉机械（男声）
  princess: { pitch: 1.15, rate: 0.9,  gender: 'female', prefer: ['karen','victoria','serena','google uk english female','tessa','moira','samantha'] } // 柔和（女声）
};
// 浏览器多数不提供 voice.gender，靠音色名推断性别（裸 male/female 关键字无意义，故只放具体名）
const VOICE_GENDER_HINTS = {
  male:   ['daniel','alex','fred','aaron','tom','reed','rishi','oliver','gordon','lee','david','mark','george','james','ravi','guy','arthur','eddy male','reed male','rocko male'],
  female: ['samantha','karen','victoria','tessa','moira','fiona','allison','ava','susan','zoe','kate','serena','zira','hazel','catherine','google us english','eddy female','flo female']
};

const TUTORIAL_STEPS = [
    { icon:'🎮', title:'欢迎来到单词拼拼消', text:'这是一款将英语单词学习和消消乐结合的游戏。每一关你需要拼出3个单词，从3字母逐步挑战到10字母！' },
    { icon:'📖', title:'收集字母拼出单词', text:'点击棋盘上两个相邻的字母进行交换。连成3个或以上相同的字母即可消除，并收集该字母到目标单词中。' },
    { icon:'💡', title:'提示帮你找到方向', text:'遇到困难时点击"提示"按钮，系统会高亮显示可以交换的两个字母。提示有5秒冷却时间。' },
    { icon:'💣', title:'炸弹直接消除', text:'每积攒8000分可获得一枚字母炸弹。进入炸弹模式后，点击棋盘上任意3个字母即可直接消除它们！' },
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
        // Chrome 真实环境 cancel()+speak() 竞态会导致 utterance 被丢弃，
        // 因此不再 cancel——让例句在 speech 队列里排队播放，宁可等一秒也不丢语音。
        try { window.speechSynthesis.resume(); } catch(e){}
        const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85; u.volume = 1;
        if (this.preferredVoice) u.voice = this.preferredVoice;
        u.onstart = () => console.log('[TTS START]', text);
        u.onend  = () => console.log('[TTS END]', text);
        u.onerror = (e) => console.warn('[TTS ERROR]', text, e.error);
        try {
            window.speechSynthesis.speak(u);
            console.log('[TTS QUEUED]', text, 'speaking=', window.speechSynthesis.speaking);
        } catch(e) { console.warn('Speech synthesis failed:', e); }
    }
}

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

        this.wordLevels = WORD_LEVELS;

        this.loadGlobalSave();
        this.init();
    }

    loadGlobalSave() {
        try {
            const raw = localStorage.getItem('wordMatchGlobal');
            if (raw) {
                const data = JSON.parse(raw);
                const version = data.version || 1;
                this.learnedWords = Array.isArray(data.learnedWords) ? data.learnedWords : [];
                this.favorites = Array.isArray(data.favorites) ? data.favorites : [];
                this.level = data.level || 1;
                this.coins = data.coins != null ? data.coins : (data.score || 0);
                this.bombs = data.bombs || 0;
                this.nextBombAt = data.nextBombAt || 8000;
                this.achievements = data.achievements || {};
                this.unlockedSkins = Array.isArray(data.unlockedSkins) ? data.unlockedSkins : ['default_theme','default_board','default_effect','default_frame'];
                this.equippedTheme = data.equippedTheme || 'default_theme';
                this.equippedBoard = data.equippedBoard || 'default_board';
                this.equippedEffect = data.equippedEffect || 'default_effect';
                this.equippedFrame = data.equippedFrame || 'default_frame';
                this.playDates = data.playDates || {};
                this.dailyCompletions = data.dailyCompletions || {};
                this.failedWords = data.failedWords || {};
                this.totalCompletedWords = data.totalCompletedWords || 0;
                this.bestTimedWords = data.bestTimedWords || 0;
                this.bestEndlessWords = data.bestEndlessWords || 0;
                this.wordMastery = data.wordMastery || {};
                this.toolInventory = data.toolInventory || {};
                this.reviewBoostActive = !!data.reviewBoostActive;
                this.reduceMotion = !!data.reduceMotion;
                this.colorBlindMode = !!data.colorBlindMode;
                this.unlockedCompanions = Array.isArray(data.unlockedCompanions) ? data.unlockedCompanions : ['dino'];
                this.equippedCompanion = data.equippedCompanion || 'dino';
                this.companionInventory = data.companionInventory || {};
                this.companionGrowth = data.companionGrowth || {};
                this.companionNames = data.companionNames || {};
                this.companionRenameUnlocked = data.companionRenameUnlocked || {};
                this.companionVoiceOn = data.companionVoiceOn !== undefined ? data.companionVoiceOn : true;
                this.mechaShieldMoves = data.mechaShieldMoves || 0;
                this.lastCompanionGreetDate = data.lastCompanionGreetDate !== undefined ? data.lastCompanionGreetDate : '';
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
            coins: this.coins,
            bombs: this.bombs,
            nextBombAt: this.nextBombAt,
            achievements: this.achievements,
            unlockedSkins: this.unlockedSkins,
            equippedTheme: this.equippedTheme,
            equippedBoard: this.equippedBoard,
            equippedEffect: this.equippedEffect,
            equippedFrame: this.equippedFrame,
            playDates: this.playDates,
            dailyCompletions: this.dailyCompletions,
            failedWords: this.failedWords,
            totalCompletedWords: this.totalCompletedWords,
            bestTimedWords: this.bestTimedWords,
            bestEndlessWords: this.bestEndlessWords,
            wordMastery: this.wordMastery,
            toolInventory: this.toolInventory,
            reviewBoostActive: this.reviewBoostActive,
            reduceMotion: this.reduceMotion,
            colorBlindMode: this.colorBlindMode,
            unlockedCompanions: this.unlockedCompanions,
            equippedCompanion: this.equippedCompanion,
            companionInventory: this.companionInventory,
            companionGrowth: this.companionGrowth,
            companionNames: this.companionNames,
            companionRenameUnlocked: this.companionRenameUnlocked,
            companionVoiceOn: this.companionVoiceOn,
            mechaShieldMoves: this.mechaShieldMoves,
            lastCompanionGreetDate: this.lastCompanionGreetDate,
            speakEnabled: this.sound.speakEnabled,
            date: Date.now()
        };
        localStorage.setItem('wordMatchGlobal', JSON.stringify(data));
        this.updateGlobalStats();
    }

    checkBombReward() {
        while (this.coins >= this.nextBombAt) {
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
        document.getElementById('statScore').textContent = this.coins;
        document.getElementById('statWords').textContent = uniqueWords.length;
        document.getElementById('statVocab').textContent = this.favorites.length;
        this.updateDailyCard();
        this.renderLevelMap();
        const statsGrid = document.getElementById('globalStats');
        if (statsGrid) {
            statsGrid.classList.remove('frame-bronze','frame-silver','frame-gold');
            if (this.equippedFrame === 'bronze_frame') statsGrid.classList.add('frame-bronze');
            else if (this.equippedFrame === 'silver_frame') statsGrid.classList.add('frame-silver');
            else if (this.equippedFrame === 'gold_frame') statsGrid.classList.add('frame-gold');
        }
    }

    getDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    hashString(str) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return Math.abs(hash >>> 0);
    }

    seededPick(pool, count, seed) {
        const arr = [...pool];
        const picked = [];
        let s = seed || 1;
        while (arr.length && picked.length < count) {
            s = (s * 1664525 + 1013904223) >>> 0;
            const idx = s % arr.length;
            picked.push(arr.splice(idx, 1)[0]);
        }
        return picked;
    }

    hexToLab(hex) {
        const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255);
        const linear = rgb.map(value => value > 0.04045
            ? Math.pow((value + 0.055) / 1.055, 2.4)
            : value / 12.92);
        const x = (linear[0] * 0.4124 + linear[1] * 0.3576 + linear[2] * 0.1805) / 0.95047;
        const y = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        const z = (linear[0] * 0.0193 + linear[1] * 0.1192 + linear[2] * 0.9505) / 1.08883;
        const pivot = value => value > 0.008856 ? Math.cbrt(value) : (7.787 * value) + (16 / 116);
        const fx = pivot(x), fy = pivot(y), fz = pivot(z);
        return { l:(116 * fy) - 16, a:500 * (fx - fy), b:200 * (fy - fz) };
    }

    colorDistance(left, right) {
        const a = this.hexToLab(left), b = this.hexToLab(right);
        return Math.sqrt(
            Math.pow(a.l - b.l, 2) +
            Math.pow(a.a - b.a, 2) +
            Math.pow(a.b - b.b, 2)
        );
    }

    selectDistinctPalette(count, seedText) {
        let seed = this.hashString(seedText || 'word-match');
        const core = [...CORE_LETTER_COLORS];
        for (let i = core.length - 1; i > 0; i--) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            const j = seed % (i + 1);
            [core[i], core[j]] = [core[j], core[i]];
        }
        const selected = core.slice(0, Math.min(count, core.length));
        const coreHex = new Set(CORE_LETTER_COLORS.map(color => color.bg));
        const remaining = LETTER_COLOR_PALETTE.filter(color => !coreHex.has(color.bg));
        while (selected.length < count && remaining.length > 0) {
            let bestIndex = 0;
            let bestScore = -1;
            remaining.forEach((candidate, index) => {
                const minDistance = Math.min(...selected.map(color => this.colorDistance(candidate.bg, color.bg)));
                if (minDistance > bestScore) {
                    bestIndex = index;
                    bestScore = minDistance;
                }
            });
            selected.push(remaining.splice(bestIndex, 1)[0]);
        }
        return selected;
    }

    buildLetterColorMap() {
        const letters = [...new Set(this.getLetterPool())].sort();
        const targetSet = new Set(this.targetWord.split(''));
        const ordered = [
            ...letters.filter(ch => targetSet.has(ch)),
            ...letters.filter(ch => !targetSet.has(ch))
        ];
        const palette = this.selectDistinctPalette(ordered.length, `${this.gameMode}-${this.level}-${this.targetWord}`);
        this.letterColorMap = {};
        ordered.forEach((letter, index) => {
            const color = palette[index];
            const previousColors = palette.slice(0, index);
            const nearestDistance = previousColors.length
                ? Math.min(...previousColors.map(previous => this.colorDistance(color.bg, previous.bg)))
                : Infinity;
            const needsPattern = nearestDistance < 52;
            const pattern = needsPattern
                ? LETTER_PATTERNS[(index % (LETTER_PATTERNS.length - 1)) + 1]
                : '';
            this.letterColorMap[letter] = { ...color, pattern };
        });
    }

    applyTileColor(tile, letter) {
        const color = this.letterColorMap[letter] || LETTER_COLOR_PALETTE[0];
        const gradient = `linear-gradient(135deg, ${color.bg} 0%, ${color.bg2} 100%)`;
        const fallbackPattern = LETTER_PATTERNS[(Math.max(0, letter.charCodeAt(0) - 65) % (LETTER_PATTERNS.length - 1)) + 1];
        const pattern = this.colorBlindMode ? fallbackPattern : color.pattern;
        const background = pattern ? `${pattern}, ${gradient}` : gradient;
        tile.style.setProperty('background', background, 'important');
        tile.style.color = color.fg;
        tile.style.border = `2px solid ${color.border}`;
        tile.style.textShadow = '0 1px 2px rgba(0,0,0,0.28)';
    }

    markPlayDay() {
        this.playDates[this.getDateKey()] = true;
    }

    getLearningStreak() {
        let streak = 0;
        const date = new Date();
        while (true) {
            const key = this.getDateKey(date);
            if (!this.playDates[key]) break;
            streak++;
            date.setDate(date.getDate() - 1);
        }
        return streak;
    }

    // 把「今天」也算进连续天数：今天若已游玩则与 getLearningStreak 等价；
    // 今天尚未记录（如登录问候发生在 markPlayDay 之前）则按「昨天往回连续天数 + 1」计。
    // 仅用于读取，不写入 playDates，无副作用。
    getStreakIncludingToday() {
        if (this.playDates[this.getDateKey()]) return this.getLearningStreak();
        let streak = 0;
        const date = new Date();
        date.setDate(date.getDate() - 1);
        while (true) {
            const key = this.getDateKey(date);
            if (!this.playDates[key]) break;
            streak++;
            date.setDate(date.getDate() - 1);
        }
        return streak + 1;
    }

    // 距上次游玩的天数（0=今天玩过，1=昨天，>1=隔了几天没来）；无任何记录返回 0
    getDaysSinceLastPlay() {
        const keys = Object.keys(this.playDates || {});
        if (!keys.length) return 0;
        const today = new Date();
        for (let gap = 0; gap <= 365; gap++) {
            const d = new Date(today);
            d.setDate(today.getDate() - gap);
            if (this.playDates[this.getDateKey(d)]) return gap;
        }
        return 366;
    }

    // 登录回访：连续天数 daily 台词 / 久违 miss 台词，每日各只触发一次
    companionLoginGreet() {
        const id = this.equippedCompanion;
        if (!id) return;
        const today = this.getDateKey();
        if (this.lastCompanionGreetDate === today) return;
        const gap = this.getDaysSinceLastPlay();
        // 含今天口径：登录早于 markPlayDay，今天还没记录，需把今天算进连续天数
        const streak = this.getStreakIncludingToday();
        let scene = null;
        if (gap > 1) scene = 'miss';
        else if (streak >= 2) scene = 'daily';
        if (scene) {
            this.lastCompanionGreetDate = today;
            this.saveGlobal();
            // daily 显示的连续天数须与触发口径一致（含今天），故显式传入
            const daysOverride = scene === 'daily' ? streak : null;
            setTimeout(() => this.sayCompanionLine(id, scene, false, daysOverride, true), 600);
        }
    }

    updateDailyCard() {
        const el = document.getElementById('dailyDesc');
        if (!el) return;
        const today = this.getDateKey();
        el.innerHTML = this.dailyCompletions[today]
            ? '今日已完成<br>明天再来挑战'
            : '每天固定3个单词<br>完成奖励800分';
    }

    init() {
        this.loadGlobalSave();
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

    async installApp() {
        if (!this.deferredInstallPrompt) {
            this.showToast('请在浏览器菜单里选择“添加到主屏幕”');
            return;
        }
        this.deferredInstallPrompt.prompt();
        await this.deferredInstallPrompt.userChoice;
        this.deferredInstallPrompt = null;
        const card = document.getElementById('installCard');
        if (card) card.classList.remove('show');
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
        scoreEl.textContent = `当前积分: ${this.coins}`;
        if (type === 'companion') {
            this.renderCompanionShop(grid);
            return;
        }
        const items = SHOP_ITEMS.filter(i => i.type === type);
        items.forEach(item => {
            const isTool = type === 'tool';
            const owned = isTool ? false : this.unlockedSkins.includes(item.id);
            const equipped = !isTool && this[`equipped${type.charAt(0).toUpperCase() + type.slice(1)}`] === item.id;
            const count = this.toolInventory[item.id] || 0;
            const card = document.createElement('div');
            card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
            let btnHtml = '';
            if (isTool) {
                const canBuy = this.coins >= item.price;
                btnHtml = `<button class="shop-btn buy" onclick="game.buyTool('${item.id}')" ${canBuy ? '' : 'disabled'}>${item.price}分 · 已有${count}</button>`;
            } else if (equipped) {
                btnHtml = `<button class="shop-btn owned" disabled>已装备</button>`;
            } else if (owned) {
                btnHtml = `<button class="shop-btn equip" onclick="game.equipSkin('${item.id}')">装备</button>`;
            } else {
                const canBuy = this.coins >= item.price;
                btnHtml = `<button class="shop-btn buy" onclick="game.buySkin('${item.id}')" ${canBuy ? '' : 'disabled'}>${item.price === 0 ? '免费' : item.price + '分'}</button>`;
            }
            card.innerHTML = `
                ${equipped ? '<div class="equipped-badge">已装备</div>' : ''}
                ${this.getShopPreviewHTML(item)}
                <div class="shop-name">${item.name}</div>
                ${item.desc ? `<div class="shop-desc">${item.desc}</div>` : ''}
                ${btnHtml}
            `;
            grid.appendChild(card);
        });
    }

    renderCompanionShop(grid) {
        grid.innerHTML = `<div class="companion-help">
            <strong>伙伴养成：</strong>小恐龙默认加入队伍；机甲和公主可使用积分解锁。每购买 1 个伙伴专属道具，或每通关一关（含每日/复习），当前出战伙伴羁绊 +1。羁绊达到 3 点和 8 点时，角色进化、外观升级，专属道具效果也随之增强。
        </div>`;
        COMPANIONS.forEach(companion => {
            const owned = this.unlockedCompanions.includes(companion.id);
            const equipped = this.equippedCompanion === companion.id;
            const item = COMPANION_ITEMS.find(entry => entry.companion === companion.id);
            const count = this.companionInventory[item.id] || 0;
            const growth = this.getCompanionGrowth(companion.id);
            const card = document.createElement('div');
            card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
            let actions = '';
            if (!owned) {
                actions = `<button class="shop-btn buy" onclick="game.buyCompanion('${companion.id}')" ${this.coins >= companion.price ? '' : 'disabled'}>${companion.price}分解锁</button>`;
            } else {
                actions = equipped
                    ? '<button class="shop-btn owned" disabled>已出战</button>'
                    : `<button class="shop-btn equip" onclick="game.equipCompanion('${companion.id}')">设为伙伴</button>`;
                actions += `<button class="shop-btn buy" onclick="game.buyCompanionItem('${item.id}')" ${this.coins >= item.price ? '' : 'disabled'}>${item.icon} ${item.price}分 · 已有${count}</button>`;
            }
            card.innerHTML = `
                ${equipped ? '<div class="equipped-badge">出战中</div>' : ''}
                <div class="companion-card-preview">${this.getCompanionAvatarHTML(companion, growth.level)}</div>
                <div class="shop-name">${companion.name}</div>
                <div class="companion-item-badge">${this.getCompanionEffectText(companion.id, growth.level)}</div>
                <div class="companion-level">${growth.label} · 羁绊 ${growth.points}/${growth.next}</div>
                <div class="companion-growth"><div class="companion-growth-fill" style="width:${growth.percent}%"></div></div>
                ${actions}
            `;
            grid.appendChild(card);
        });
    }

    buyCompanion(id) {
        const companion = COMPANIONS.find(item => item.id === id);
        if (!companion || this.unlockedCompanions.includes(id)) return;
        if (this.coins < companion.price) return this.showToast('积分不足!');
        this.coins -= companion.price;
        this.unlockedCompanions.push(id);
        this.equipCompanion(id);
        this.showToast(`🎮 新伙伴加入：${companion.name}`);
        this.saveGlobal();
        this.renderShop('companion');
    }

    equipCompanion(id) {
        if (!this.unlockedCompanions.includes(id)) return;
        this.equippedCompanion = id;
        this.renderCompanionDock();
        this.saveGlobal();
        this.renderShop('companion');
    }

    buyCompanionItem(id) {
        const item = COMPANION_ITEMS.find(entry => entry.id === id);
        if (!item || !this.unlockedCompanions.includes(item.companion)) return;
        if (this.coins < item.price) return this.showToast('积分不足!');
        this.coins -= item.price;
        this.companionInventory[id] = (this.companionInventory[id] || 0) + 1;
        this.showToast(`🎒 获得 ${item.name}`);
        this.gainCompanionBond(item.companion, 1);
        this.renderCompanionDock();
        this.saveGlobal();
        this.renderShop('companion');
        this.updateUI();
    }

    useCompanionItem() {
        const companion = COMPANIONS.find(item => item.id === this.equippedCompanion) || COMPANIONS[0];
        const count = this.companionInventory[companion.item] || 0;
        if (count <= 0) {
            this.showToast(`去伙伴商店购买「${companion.itemName}」`);
            return;
        }
        const level = this.getCompanionGrowth(companion.id).level;
        if (companion.id === 'dino') {
            if (this.gameMode === 'endless') return this.showToast('无尽模式不需要补充步数');
            this.moves += [5, 6, 8, 9, 10, 12][level - 1];
        } else if (companion.id === 'mecha') {
            this.mechaShieldMoves += [3, 4, 5, 6, 7, 8][level - 1];
        } else {
            const fillCount = [1, 1, 2, 2, 3, 3][level - 1];
            let filled = 0;
            for (let i = 0; i < fillCount; i++) {
                const missing = this.targetWord.split('').find(letter => {
                    const needed = this.targetWord.split(letter).length - 1;
                    return (this.collectedLetters[letter] || 0) < needed;
                });
                if (!missing) break;
                this.collectedLetters[missing] = (this.collectedLetters[missing] || 0) + 1;
                filled++;
            }
            if (filled === 0) return this.showToast('当前单词已经收集完成');
            this.renderTarget();
            this.checkWin();
        }
        this.companionInventory[companion.item]--;
        this.showToast(`✨ ${companion.itemName} 已生效`);
        this.renderCompanionDock();
        this.updateUI();
        this.saveGlobal();
    }

    renderCompanionDock() {
        const dock = document.getElementById('companionDock');
        if (!dock) return;
        const companion = COMPANIONS.find(item => item.id === this.equippedCompanion) || COMPANIONS[0];
        const count = this.companionInventory[companion.item] || 0;
        const growth = this.getCompanionGrowth(companion.id);
        const shield = this.mechaShieldMoves > 0 ? ` · 护盾剩余 ${this.mechaShieldMoves} 步` : '';
        const unlocked = !!this.companionRenameUnlocked[companion.id];
        dock.innerHTML = `
            <div class="companion-stage">
                ${this.getCompanionAvatarHTML(companion, growth.level)}
                <span class="companion-mood" id="companionMood">😊</span>
            </div>
            <div class="companion-copy">
                <div class="companion-name-row">
                    <span class="companion-name">${this._escapeHtml(growth.name)}</span>
                    <button class="companion-rename ${unlocked ? '' : 'locked'}" onclick="game.renameCompanion('${companion.id}')" title="给伙伴改名">✏️</button>
                    <button class="companion-voice" id="companionVoiceBtn" onclick="game.toggleCompanionVoice()" title="${this.companionVoiceOn ? '关闭伙伴语音' : '开启伙伴语音'}">${this.companionVoiceOn ? '🔊' : '🔇'}</button>
                </div>
                <div class="companion-bubble" id="companionBubble"></div>
                <div class="companion-effect">${this.getCompanionEffectText(companion.id, growth.level)}${shield}</div>
                <div class="companion-level">${growth.label} · 羁绊 ${growth.points}/${growth.next}</div>
                <div class="companion-growth"><div class="companion-growth-fill" style="width:${growth.percent}%"></div></div>
            </div>
            <button class="companion-use" onclick="game.useCompanionItem()" ${count <= 0 ? 'disabled' : ''}>${companion.itemName} ×${count}</button>
        `;
        // 注意：这里不再触发台词。dock 每次 updateUI 都会重渲染，若在此朗读，
        // 整关进行中会反复抢占 speech 通道、掐断例句朗读。伙伴台词改为只在每关开始时
        // 由 greetCompanion() 播一次。
    }

    // 每关开始时伙伴打一次招呼（含语音）。整关进行中不再发声，
    // 例句朗读因此始终独占 speech 通道，稳定可读出。
    greetCompanion() {
        const id = this.equippedCompanion;
        if (!id) return;
        this.sayCompanionLine(id, 'idle', false, null, true);
    }

    getCompanionName(id) {
        return this.companionNames[id] || COMPANION_DEFAULT_NAMES[id] || '伙伴';
    }

    renameCompanion(id) {
        if (!this.companionRenameUnlocked[id]) {
            this.showToast('进化后才能给伙伴改名哦~');
            return;
        }
        const cur = this.getCompanionName(id);
        const input = prompt('给伙伴起个名字吧（最多6个字）', cur);
        if (input === null) return;
        const name = input.trim().slice(0, 6);
        if (!name) { this.showToast('名字不能为空哦'); return; }
        this.companionNames[id] = name;
        this.saveGlobal();
        this.renderCompanionDock();
        const shopModal = document.getElementById('shopModal');
        if (shopModal && shopModal.classList.contains('active')) this.renderShop('companion');
        this.showToast('已改名为「' + name + '」');
    }

    _escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    _guessGender(v) {
        const name = (v.name || '').toLowerCase();
        const g = v.gender ? String(v.gender).toLowerCase() : '';
        if (g.indexOf('female') !== -1) return 'female';
        if (g.indexOf('male') !== -1) return 'male';
        if (VOICE_GENDER_HINTS.female.some(n => name.indexOf(n) !== -1)) return 'female';
        if (VOICE_GENDER_HINTS.male.some(n => name.indexOf(n) !== -1)) return 'male';
        return null;
    }
    _pickVoice(id) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().indexOf('en') === 0);
        if (!enVoices.length) return null;
        const cfg = COMPANION_VOICE[id] || {};
        // 1) 先按具体音色名精确匹配
        const prefer = cfg.prefer || [];
        for (const key of prefer) {
            const k = key.toLowerCase();
            const hit = enVoices.find(v => v.name && v.name.toLowerCase().indexOf(k) !== -1);
            if (hit) return hit;
        }
        // 2) 按期望性别推断（多数浏览器无 voice.gender，靠音色名库）
        if (cfg.gender) {
            const match = enVoices.find(v => this._guessGender(v) === cfg.gender);
            if (match) return match;
            // 3) 退而求其次：避免选到反性别的音色
            const opposite = cfg.gender === 'male' ? 'female' : 'male';
            const notOpposite = enVoices.find(v => this._guessGender(v) !== opposite);
            if (notOpposite) return notOpposite;
        }
        return enVoices[0];
    }

    speakCompanionLine(id, text) {
        if (!this.companionVoiceOn) return;
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            const v = COMPANION_VOICE[id] || {};
            u.pitch = v.pitch != null ? v.pitch : 1;
            u.rate  = v.rate  != null ? v.rate  : 1;
            const picked = this._pickVoice(id);
            if (picked) u.voice = picked;
            window.speechSynthesis.speak(u);
        } catch(e) {}
    }

    sayCompanionLine(id, scene, soft = false, daysOverride = null, withVoice = false) {
        const bubble = document.getElementById('companionBubble');
        const mood = document.getElementById('companionMood');
        if (!bubble) return;
        if (soft && bubble.classList.contains('show')) return;
        const lines = (COMPANION_LINES[id] || {})[scene];
        if (!lines || !lines.length) return;
        const idx = Math.floor(Math.random() * lines.length);
        const line = lines[idx];
        const growth = this.getCompanionGrowth(id);
        const days = daysOverride != null ? daysOverride : (this.getLearningStreak ? this.getLearningStreak() : 0);
        const safeName = this._escapeHtml(growth.name);
        const en = line.en.replace(/\{name\}/g, safeName).replace(/\{days\}/g, days);
        const zh = line.zh.replace(/\{name\}/g, safeName).replace(/\{days\}/g, days);
        bubble.innerHTML = `<span class="bubble-en">${en}</span><span class="bubble-zh">${zh}</span>`;
        bubble.classList.add('show');
        const moods = { idle:'😊', win:'🤩', evolve:'✨', daily:'🥰', miss:'🥺' };
        if (mood) {
            mood.textContent = moods[scene] || '😊';
            if (!this.reduceMotion) { mood.classList.remove('bounce'); void mood.offsetWidth; mood.classList.add('bounce'); }
        }
        // 仅在「每关开始」这一次才发声（withVoice）。整关进行中绝不朗读伙伴台词，
        // 把 speechSynthesis 通道完整让给例句朗读——否则 speak() 里的 cancel()+speak()
        // 在真实 Chrome 上会有竞态，导致例句被丢弃读不出来（核心学习功能优先）。
        if (withVoice) this.speakCompanionLine(id, line.en.replace(/\{name\}/g, growth.name).replace(/\{days\}/g, days));
        clearTimeout(this._bubbleTimer);
        const dur = (scene === 'evolve' || scene === 'miss') ? 4000 : 2600;
        this._bubbleTimer = setTimeout(() => {
            bubble.classList.remove('show');
            // 注意：这里不再全局 cancel 朗读——伙伴台词是短句会自然播完，
            // 而例句朗读（sound.speak）共用同一个 speechSynthesis 通道，
            // 全局 cancel 会把通关后正在播放的例句拦腰掐断（核心学习内容优先）。
        }, dur);
    }

    toggleCompanionVoice() {
        this.companionVoiceOn = !this.companionVoiceOn;
        if (!this.companionVoiceOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
        this.saveGlobal();
        this.renderCompanionDock();
        this.showToast(this.companionVoiceOn ? '🔊 伙伴语音已开启' : '🔇 伙伴语音已静音');
    }

    gainCompanionBond(id, amount) {
        if (!id || !amount) return { growth: null, evolved: false };
        const before = this.getCompanionGrowth(id).level;
        this.companionGrowth[id] = (this.companionGrowth[id] || 0) + amount;
        const growth = this.getCompanionGrowth(id);
        const evolved = growth.level > before;
        if (evolved) {
            this.companionRenameUnlocked[id] = growth.level;
            this.showToast(`✨ 进化为「${growth.label}」，可以改名啦！`);
            this.showEvolveModal(id, growth);
        }
        this.renderCompanionDock();
        return { growth, evolved };
    }

    showEvolveModal(id, growth) {
        const modal = document.getElementById('evolveModal');
        if (!modal) return;
        const companion = COMPANIONS.find(c => c.id === id) || COMPANIONS[0];
        const hero = document.getElementById('evolveHero');
        const label = document.getElementById('evolveLabel');
        const lineEn = document.getElementById('evolveLineEn');
        const lineZh = document.getElementById('evolveLineZh');
        if (hero) hero.innerHTML = this.getCompanionAvatarHTML(companion, growth.level);
        if (label) label.textContent = `${this._escapeHtml(growth.name)} · ${growth.label}`;
        const lines = (COMPANION_LINES[id] || {}).evolve || [];
        const line = lines.length ? lines[Math.floor(Math.random() * lines.length)] : { en: '', zh: '' };
        const safeName = this._escapeHtml(growth.name);
        if (lineEn) lineEn.textContent = line.en.replace(/\{name\}/g, growth.name);
        if (lineZh) lineZh.textContent = line.zh.replace(/\{name\}/g, growth.name);
        // 进化弹窗优先，挂起后续 win 弹窗/气泡
        modal.classList.add('active');
        this.sound.play('win');
        this.speakCompanionLine(id, line.en.replace(/\{name\}/g, growth.name));
        this.spawnConfetti(modal.querySelector('.modal-content'));
        const btn = document.getElementById('evolveBtn');
        if (btn) btn.onclick = () => {
            modal.classList.remove('active');
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }
            const cb = this._afterEvolveClose;
            this._afterEvolveClose = null;
            if (cb) cb();
        };
    }

    spawnConfetti(host) {
        if (this.reduceMotion || !host) return;
        const colors = ['#ff4081','#ff9800','#ffeb3b','#4caf50','#00e5ff','#7c4dff','#ffd700'];
        for (let i = 0; i < 26; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[i % colors.length];
            piece.style.animationDuration = (1.1 + Math.random() * 1.1) + 's';
            piece.style.animationDelay = (Math.random() * 0.35) + 's';
            host.appendChild(piece);
            setTimeout(() => piece.remove(), 2800);
        }
    }

    getCompanionGrowth(id) {
        const THRESHOLDS = [0, 3, 8, 16, 28, 45];
        const MAX = THRESHOLDS.length; // 6
        const points = this.companionGrowth[id] || 0;
        let level = 1;
        for (let i = 0; i < THRESHOLDS.length; i++) {
            if (points >= THRESHOLDS[i]) level = i + 1;
        }
        const labels = {
            dino: ['幼年探险家','荒野侦察员','远古守护者','烈焰猎手','陨星霸王','创世神龙'],
            mecha: ['基础机体','重装先锋','苍蓝统帅','量子骑士','虹光战神','永恒守望者'],
            princess: ['星愿学徒','星辉公主','银河女王','极光仙子','虹羽圣女','永恒星神']
        };
        const isMax = level >= MAX;
        const cur = THRESHOLDS[level - 1];
        const next = isMax ? THRESHOLDS[MAX - 1] : THRESHOLDS[level];
        const span = isMax ? 1 : (next - cur);
        const percent = isMax ? 100 : (points - cur) / span * 100;
        const labelArr = labels[id] || labels.dino;
        return {
            points, level, max: MAX, isMax,
            next: isMax ? 'MAX' : next,
            percent: Math.min(100, Math.round(percent)),
            label: labelArr[Math.min(level, MAX) - 1],
            name: this.getCompanionName(id)
        };
    }

    getCompanionEffectText(id, level) {
        if (id === 'dino') return `使用后立即增加 ${[5,6,8,9,10,12][level-1]} 步`;
        if (id === 'mecha') return `接下来 ${[3,4,5,6,7,8][level-1]} 次有效交换不消耗步数`;
        if (id === 'princess') return `立即补齐 ${[1,1,2,2,3,3][level-1]} 个尚未收集的目标字母`;
        return '';
    }

    getCompanionAvatarHTML(companion, level) {
        return `<div class="companion-avatar ${companion.id} level-${level}">
            <img class="companion-sprite" src="${companion.image}" alt="${companion.name}">
        </div>`;
    }

    getShopPreviewHTML(item) {
        const sampleColors = ['#005ab5','#009e73','#d81b60','#ff7f00','#7055c7','#00838f'];
        const letters = ['A','B','C','A','C','B'];
        let tileClass = '';
        if (item.id === 'pixel_board') tileClass = ' pixel';
        else if (item.id === 'metal_board') tileClass = ' metal';
        else if (item.id === 'ink_board') tileClass = ' ink';
        else if (item.id === 'crystal_board') tileClass = ' crystal';
        const miniTiles = letters.map((letter, index) =>
            `<span class="shop-mini-tile${tileClass}" style="background:${sampleColors[index]}">${letter}</span>`
        ).join('');
        const boardBg = item.colors?.board || item.preview;
        return `<div class="shop-preview" style="background:${item.preview}">
            <div class="shop-mini-board" style="background:${boardBg}">${miniTiles}</div>
        </div>`;
    }

    buyTool(id) {
        const item = SHOP_ITEMS.find(i => i.id === id && i.type === 'tool');
        if (!item) return;
        if (this.coins < item.price) {
            this.showToast('积分不足!');
            return;
        }
        this.coins -= item.price;
        if (id === 'review_boost') {
            this.reviewBoostActive = true;
            this.showToast('📚 下一次复习奖励已加倍');
        } else {
            this.toolInventory[id] = (this.toolInventory[id] || 0) + 1;
            this.showToast(`🎒 获得道具：${item.name}`);
        }
        this.saveGlobal();
        this.renderShop('tool');
        this.updateToolUI();
        this.updateUI();
    }

    buySkin(id) {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item || this.unlockedSkins.includes(id)) return;
        if (this.coins < item.price) {
            this.showToast('积分不足!');
            return;
        }
        this.coins -= item.price;
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
        const c = COMPANIONS.find(i => i.id === this.equippedCompanion);
        bar.innerHTML = `
            <span class="equip-tag">🎨 ${t ? t.name : '默认'}</span>
            <span class="equip-tag">🔲 ${b ? b.name : '默认'}</span>
            <span class="equip-tag">✨ ${e ? e.name : '默认'}</span>
            <span class="equip-tag">🏅 ${f ? f.name : '无'}</span>
            <span class="equip-tag">🎮 ${c ? c.name : '伙伴'}</span>
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
        for (let i = 1; i <= 26; i++) {
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
            // 用一个空 utterance 解锁移动端 speech synthesis
            const empty = new SpeechSynthesisUtterance('');
            empty.volume = 0;
            try { window.speechSynthesis.speak(empty); } catch(e){}
        }
    }

    selectMode(mode) {
        this.unlockAudio();
        this.markPlayDay();
        this.saveGlobal();
        this.gameMode = mode;
        document.body.classList.add('in-game');
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        this.startGame();
    }

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
    }

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
        this.letterColorMap = {};
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
    }

    loadReviewWord() {
        if (this.learnedWords.length === 0) {
            alert('还没有学过单词，先去闯关模式学习吧！');
            this.backToMenu();
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
    }

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
    }

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
        if (!this.hasAnyValidMove() && (_depth || 0) < 20) return this.generateBoard((_depth || 0) + 1);
        this.buildLetterColorMap();
    }

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
    }

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
                    this.applyTileColor(tile, letter);
                    delete existing[key];
                } else {
                    tile = document.createElement('div');
                    tile.className = fullClass;
                    tile.textContent = letter;
                    tile.dataset.r = r; tile.dataset.c = c;
                    this.applyTileColor(tile, letter);
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
            slot.dataset.letter = ch;
            slot.dataset.occurrence = got[ch] - 1;
            el.appendChild(slot);
        }
        let total = 0, have = 0;
        for (let ch in needed) { total += needed[ch]; have += Math.min(this.collectedLetters[ch] || 0, needed[ch]); }
        const progress = Math.round(have / total * 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('wordProgressText').textContent = progress + '%';
        document.getElementById('chineseMeaning').textContent = this.targetChinese;
        const mastery = this.getMasteryInfo(this.targetWord);
        const masteryFill = document.getElementById('targetMasteryFill');
        if (masteryFill) masteryFill.style.width = mastery.percent + '%';
        const masteryText = document.getElementById('targetMasteryText');
        if (masteryText) masteryText.textContent = mastery.percent + '%';
        const totalWords = this.targetWords ? this.targetWords.length : 1;
        const current = this.currentWordIndex !== undefined ? this.currentWordIndex + 1 : 1;
        document.getElementById('targetLabel').textContent = `目标单词 (${current}/${totalWords})`;
    }

    handleClick(r, c) {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.isProcessing || this.locked) return;
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
        if (this.bombs <= 0 || this.bombMode || this.isProcessing) return;
        this.levelBombsUsed++;
        this.bombMode = true;
        this.bombSelected = [];
        const remain = this.nextBombAt - this.coins;
        const hint = remain > 0 ? `(再得 ${remain} 分兑换下一颗)` : '';
        this.showToast(`💣 炸弹模式：点击棋盘上的3个字母进行消除 ${hint}`);
        document.getElementById('gameBoard').style.cursor = 'crosshair';
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

    animateSwap(r1, c1, r2, c2) {
        const el1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
        const el2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
        if (this.reduceMotion || !el1 || !el2) {
            this.swap(r1, c1, r2, c2);
            this.renderBoard();
            return Promise.resolve();
        }
        const a = el1.getBoundingClientRect();
        const b = el2.getBoundingClientRect();
        const dx = b.left - a.left, dy = b.top - a.top;
        // 落到最终态（节点按坐标复用，字母已互换）
        this.swap(r1, c1, r2, c2);
        this.renderBoard();
        const n1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
        const n2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
        if (!n1 || !n2) return Promise.resolve();
        // Invert：先把两枚棋子摆回交换前的视觉位置
        n1.style.transition = 'none';
        n2.style.transition = 'none';
        n1.style.zIndex = '5';
        n2.style.zIndex = '5';
        n1.style.transform = `translate(${dx}px, ${dy}px)`;
        n2.style.transform = `translate(${-dx}px, ${-dy}px)`;
        // Play：下一帧滑回真实位置
        return new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                n1.style.transition = 'transform 0.15s ease';
                n2.style.transition = 'transform 0.15s ease';
                n1.style.transform = '';
                n2.style.transform = '';
                setTimeout(() => {
                    [n1, n2].forEach(n => {
                        n.style.transition = '';
                        n.style.zIndex = '';
                    });
                    resolve();
                }, 160);
            }));
        });
    }

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
        if (this.reduceMotion) return;
        const container = document.getElementById('boardContainer');
        const effect = this.equippedEffect;
        const count = effect === 'rainbow_effect' ? 12 : 8;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.position = 'absolute';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '40';
            const angle = (Math.PI * 2 * i) / count;
            const dist = 30 + Math.random() * 30;
            p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            if (effect === 'star_effect') {
                p.innerHTML = '⭐';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 0.8s ease forwards';
            } else if (effect === 'heart_effect') {
                p.innerHTML = '💗';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 1s ease forwards';
            } else if (effect === 'paper_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '5px';
                p.style.borderRadius = '0';
                p.style.background = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57'][i % 5];
                p.style.animation = 'particleBurst 1.2s ease forwards';
            } else if (effect === 'rainbow_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '8px';
                p.style.borderRadius = '50%';
                p.style.background = `hsl(${(i * 360 / count)},80%,60%)`;
                p.style.transition = 'transform 0.3s, opacity 0.3s';
                p.style.animation = 'particleBurst 1s ease forwards';
                p.style.filter = 'drop-shadow(0 0 4px currentColor)';
            } else {
                p.className = 'particle';
                p.style.background = color;
                p.style.animation = 'particleBurst 0.8s ease forwards';
            }
            container.appendChild(p);
            setTimeout(() => p.remove(), effect === 'paper_effect' ? 1200 : 1000);
        }
    }

    spawnScorePopup(x, y, score) {
        const container = document.getElementById('boardContainer');
        const el = document.createElement('div');
        el.className = 'score-popup';
        el.textContent = '+' + Math.round(score);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    flyLetterToTarget(r, c, letter, occurrence) {
        if (this.reduceMotion) return;
        const tile = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        const slot = document.querySelector(`.letter-slot[data-letter="${letter}"][data-occurrence="${occurrence}"]`);
        if (!tile || !slot) return;
        const tileRect = tile.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        const flyer = document.createElement('div');
        flyer.className = 'letter-fly';
        flyer.textContent = letter;
        flyer.style.left = tileRect.left + 'px';
        flyer.style.top = tileRect.top + 'px';
        flyer.style.width = tileRect.width + 'px';
        flyer.style.height = tileRect.height + 'px';
        flyer.style.background = getComputedStyle(tile).background;
        flyer.style.color = getComputedStyle(tile).color;
        flyer.style.border = getComputedStyle(tile).border;
        flyer.style.setProperty('--fly-x', (slotRect.left + slotRect.width / 2 - tileRect.left - tileRect.width / 2) + 'px');
        flyer.style.setProperty('--fly-y', (slotRect.top + slotRect.height / 2 - tileRect.top - tileRect.height / 2) + 'px');
        document.body.appendChild(flyer);
        setTimeout(() => {
            flyer.remove();
            const arrivedSlot = document.querySelector(`.letter-slot[data-letter="${letter}"][data-occurrence="${occurrence}"]`);
            if (!arrivedSlot) return;
            arrivedSlot.classList.add('arriving');
            setTimeout(() => arrivedSlot.classList.remove('arriving'), 450);
        }, 550);
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
                        this.flyLetterToTarget(m.r, m.c, m.letter, this.collectedLetters[m.letter] - 1);
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
                    this.spawnScorePopup(rect.left - containerRect.left + rect.width / 2, rect.top - containerRect.top, pts / matches.length);
                }
            }
            if (combo > 1) {
                const el = document.createElement('div');
                el.className = 'combo-indicator';
                el.textContent = `Combo ×${combo}`;
                document.getElementById('gameBoard').appendChild(el);
                setTimeout(() => el.remove(), 800);
                if (!this.reduceMotion) {
                    const board = document.getElementById('gameBoard');
                    board.classList.remove('combo-shake');
                    void board.offsetWidth;
                    board.classList.add('combo-shake');
                    setTimeout(() => board.classList.remove('combo-shake'), 280);
                }
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
        this.buildLetterColorMap();
    }

    isWin() {
        const need = {};
        for (let ch of this.targetWord) need[ch] = (need[ch] || 0) + 1;
        for (let ch in need) if ((this.collectedLetters[ch] || 0) < need[ch]) return false;
        return true;
    }

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
    }

    getMasteryInfo(word) {
        const data = this.wordMastery[word] || { correct: 0, fail: 0, review: 0 };
        const rawScore = Math.max(0, (data.correct || 0) * 2 + (data.review || 0) * 2 - (data.fail || 0));
        const days = data.lastSeen ? (Date.now() - data.lastSeen) / 86400000 : 0;
        const decay = Math.min(rawScore, Math.floor(days / 3));
        const score = Math.max(0, rawScore - decay);
        const percent = Math.max(0, Math.min(100,
            (data.correct || 0) * 18 +
            (data.review || 0) * 22 -
            (data.fail || 0) * 8 -
            decay * 6
        ));
        const levels = [
            { name: '初见', icon: '🌱', min: 0 },
            { name: '认识', icon: '🌿', min: 2 },
            { name: '熟悉', icon: '🌼', min: 5 },
            { name: '掌握', icon: '🌟', min: 9 },
            { name: '已巩固', icon: '🏆', min: 14 }
        ];
        let level = levels[0];
        for (const item of levels) {
            if (score >= item.min) level = item;
        }
        return { ...data, score, ...level, percent };
    }

    updateMastery(word, type) {
        const data = this.wordMastery[word] || { correct: 0, fail: 0, review: 0, lastSeen: 0 };
        if (type === 'correct') data.correct = (data.correct || 0) + 1;
        if (type === 'fail') data.fail = (data.fail || 0) + 1;
        if (type === 'review') data.review = (data.review || 0) + 1;
        data.lastSeen = Date.now();
        this.wordMastery[word] = data;
    }

    addLearnedWord() {
        const wordObj = { en: this.targetWord, cn: this.targetChinese, s: this.targetSentence, sc: this.targetSentenceCn };
        const exists = this.learnedWords.find(w => w.en === this.targetWord);
        this.totalCompletedWords++;
        this.updateMastery(this.targetWord, this.gameMode === 'review' ? 'review' : 'correct');
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
        title.textContent = `${this.targetWord} · ${this.targetChinese}`;
        text.textContent = `单词 ${this.currentWordIndex + 1}/${this.targetWords.length} 完成，听一遍例句再继续。`;
        document.getElementById('sentenceEn').textContent = this.targetSentence;
        document.getElementById('sentenceCn').textContent = this.targetSentenceCn;
        sentenceBox.style.display = 'block';
        title.classList.remove('learning-highlight');
        sentenceBox.classList.remove('learning-highlight');
        void sentenceBox.offsetWidth;
        title.classList.add('learning-highlight');
        sentenceBox.classList.add('learning-highlight');
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
        this.locked = false;
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
        sentenceBox.classList.remove('failure-card');
        sentenceBox.classList.remove('learning-highlight');
        title.classList.remove('learning-highlight');
        document.getElementById('modalShareBtn').textContent = '📤 分享';
        document.getElementById('modalShareBtn').onclick = () => this.generateShareImage();

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
                title.textContent = '今日挑战完成!';
                text.textContent = this.lastDailyReward === 800
                    ? '首次完成今天的3个单词，获得 800 分奖励。'
                    : '再次完成今天的3个单词，获得 200 分奖励。';
                btn.textContent = '返回首页';
                btn.onclick = () => { this.closeModal(); this.backToMenu(); };
            }
            document.getElementById('sentenceEn').textContent = this.targetSentence;
            document.getElementById('sentenceCn').textContent = this.targetSentenceCn || this.targetChinese;
            sentenceBox.style.display = 'block';
            actions.style.display = 'flex';
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        } else {
            icon.textContent = '😢';
            title.textContent = this.gameMode === 'timed' ? '时间到!' : '步数用尽';
            text.textContent = this.gameMode === 'timed'
                ? `时间到了！你一共拼出了 ${this.endlessWords} 个单词，得分 ${this.score}`
                : `先复习一下 "${this.targetWord}" (${this.targetChinese})，再试一次会更稳。`;
            if (this.gameMode !== 'timed') {
                this.failedWords[this.targetWord] = (this.failedWords[this.targetWord] || 0) + 1;
                this.updateMastery(this.targetWord, 'fail');
                document.getElementById('sentenceEn').textContent = this.targetSentence;
                document.getElementById('sentenceCn').textContent = this.targetSentenceCn || this.targetChinese;
                sentenceBox.classList.add('failure-card');
                sentenceBox.style.display = 'block';
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                this.saveGlobal();
            } else {
                sentenceBox.classList.remove('failure-card');
                sentenceBox.style.display = 'none';
                if (this.endlessWords > this.bestTimedWords) {
                    this.bestTimedWords = this.endlessWords;
                    this.saveGlobal();
                }
            }
            actions.style.display = 'flex';
            if (this.gameMode === 'timed') {
                if (this.endlessWords >= 10) this.unlockAchievement('speed_demon');
                btn.textContent = '再来一次';
                btn.onclick = () => { this.closeModal(); this.startGame(); };
            } else {
                btn.textContent = '重试';
                btn.onclick = () => { this.closeModal(); this.resetLevel(); };
                if ((this.toolInventory.retry_card || 0) > 0) {
                    text.textContent += `\n可使用错词复活卡保留当前字母进度。`;
                    document.getElementById('modalShareBtn').style.display = 'inline-block';
                    document.getElementById('modalShareBtn').textContent = `🧯 复活卡 ${this.toolInventory.retry_card}`;
                    document.getElementById('modalShareBtn').onclick = () => this.useRetryCard();
                } else {
                    document.getElementById('modalShareBtn').style.display = 'none';
                }
            }
        }
        modal.classList.add('active');
        this.locked = false;
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        const cb = this._afterWinModalClose;
        this._afterWinModalClose = null;
        if (cb) setTimeout(cb, 260); // 等弹窗淡出后再让伙伴说话，保证玩家看得见 win 气泡
    }

    // 通关展示排队：进化弹窗优先 → win 结算弹窗 → win 气泡（修复气泡被结算弹窗遮住的 bug）
    queueWinPresentation(id, bond) {
        const showWin = () => {
            this._afterWinModalClose = () => { if (id) this.sayCompanionLine(id, 'win'); };
            this.showModal('win');
        };
        if (bond && bond.evolved) {
            // 进化弹窗已由 gainCompanionBond 打开，关闭后再走 win 弹窗
            this._afterEvolveClose = () => setTimeout(showWin, 200);
        } else {
            setTimeout(showWin, 400);
        }
    }

    useRetryCard() {
        if (!this.consumeTool('retry_card')) return;
        this.closeModal();
        this.moves = Math.max(this.moves, Math.ceil(this.targetWord.length * 2 + 8));
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.showToast('🧯 已复活：当前单词进度保留');
    }

    nextLevel() {
        this.level++;
        this.loadLevel();
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.applyTheme();
        this.saveGlobal();
        this.greetCompanion();
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
        if (this.gameMode === 'review') this.loadReviewWord();
        else if (this.gameMode === 'daily') this.loadDailyChallenge();
        else this.loadLevel();
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
        document.getElementById('timerBar').style.display = 'none';
        document.getElementById('level').textContent = this.gameMode === 'daily' ? '今日' : this.level;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = this.gameMode === 'review' ? '复习' : (this.gameMode === 'daily' ? '挑战' : '关卡');
        document.getElementById('labelMoves').textContent = this.gameMode === 'endless' ? '已拼' : '步数';
        if (this.gameMode === 'endless') document.getElementById('moves').textContent = this.endlessWords;
        this.updateBombUI();
        this.updateToolUI();
        this.renderCompanionDock();
    }

    updateBombUI() {
        const bombBtn = document.getElementById('bombBtn');
        const bombCount = document.getElementById('bombCount');
        if (bombCount) bombCount.textContent = this.bombs;
        if (bombBtn) {
            bombBtn.disabled = this.bombs <= 0 || this.bombMode || this.isProcessing;
            const remain = this.nextBombAt - this.coins;
            bombBtn.title = remain > 0 ? `再得 ${remain} 分兑换下一颗炸弹` : '已有炸弹可用';
        }
    }

    updateToolUI() {
        const map = {
            first_hint: 'toolFirstHint',
            definition_card: 'toolDefinition',
            sentence_card: 'toolSentence'
        };
        Object.entries(map).forEach(([tool, id]) => {
            const el = document.getElementById(id);
            const btn = document.querySelector(`[data-tool="${tool}"]`);
            const count = this.toolInventory[tool] || 0;
            if (el) el.textContent = count;
            if (btn) btn.disabled = count <= 0 || this.isProcessing;
        });
    }

    consumeTool(id) {
        if ((this.toolInventory[id] || 0) <= 0) {
            this.showToast('这个道具还没有库存，可以去商店兑换');
            return false;
        }
        this.toolInventory[id]--;
        this.saveGlobal();
        this.updateToolUI();
        return true;
    }

    useTool(id) {
        this.unlockAudio();
        if (this.isProcessing) return;
        if (id === 'first_hint') {
            if (!this.consumeTool(id)) return;
            const next = this.getNextNeededLetter();
            if (!next) { this.showToast('这个单词已经快完成了'); return; }
            document.querySelectorAll('.tile').forEach(t => {
                if (t.textContent === next) t.classList.add('hint');
            });
            this.showToast(`🔤 优先收集字母 ${next}`);
            setTimeout(() => this.clearHint(), 3000);
        } else if (id === 'definition_card') {
            if (!this.consumeTool(id)) return;
            this.showWordDetail();
        } else if (id === 'sentence_card') {
            if (!this.consumeTool(id)) return;
            this.showToast(`${this.targetSentence} / ${this.targetSentenceCn || this.targetChinese}`);
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        }
    }

    getNextNeededLetter() {
        const seen = {};
        for (let ch of this.targetWord) {
            seen[ch] = (seen[ch] || 0) + 1;
            if ((this.collectedLetters[ch] || 0) < seen[ch]) return ch;
        }
        return '';
    }

    updateTimedUI() {
        document.getElementById('level').textContent = '限时';
        document.getElementById('moves').textContent = this.timeLeft + 's';
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '剩余';
        document.getElementById('timerBar').style.display = 'block';
        this.updateBombUI();
        this.updateToolUI();
    }

    updateEndlessUI() {
        document.getElementById('level').textContent = '无尽';
        document.getElementById('moves').textContent = this.endlessWords;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '已拼';
        document.getElementById('timerBar').style.display = 'none';
        this.updateBombUI();
        this.updateToolUI();
    }

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
        const mastery = this.getMasteryInfo(this.targetWord);
        document.getElementById('detailMastery').textContent = `掌握度：${mastery.icon} ${mastery.name} · ${mastery.percent}%`;
        document.getElementById('detailMasteryFill').style.width = mastery.percent + '%';
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
                const mastery = this.getMasteryInfo(w.en);
                item.className = 'vocab-item';
                item.innerHTML = `<div><span class="word-text">${w.en}</span><span class="word-cn">${w.cn}</span></div>
                    <span class="mastery-pill">${mastery.icon} ${mastery.name}</span>
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

    showReport() {
        const uniqueWords = [...new Set(this.learnedWords.map(w => w.en))];
        const playDays = Object.keys(this.playDates).length;
        const dailyDone = Object.keys(this.dailyCompletions).filter(k => this.dailyCompletions[k]).length;
        const streak = this.getLearningStreak();
        const reportItems = [
            ['学习天数', `${playDays} 天`],
            ['连续学习', `${streak} 天`],
            ['已学单词', `${uniqueWords.length} 个`],
            ['累计拼词', `${this.totalCompletedWords} 次`],
            ['今日挑战', `${dailyDone} 次`],
            ['无尽最佳', `${this.bestEndlessWords} 词`]
        ];
        const grid = document.getElementById('reportGrid');
        grid.innerHTML = reportItems.map(([label, value]) =>
            `<div class="report-card"><div class="num">${value}</div><div class="label">${label}</div></div>`
        ).join('');

        const recent = this.learnedWords.slice(-6).reverse();
        document.getElementById('recentWordsReport').innerHTML = recent.length
            ? recent.map(w => `<div><strong>${w.en}</strong> <span style="color:#999">${w.cn}</span></div>`).join('')
            : '还没有学习记录，先去闯关模式拼出第一个单词吧。';

        const lowMastery = uniqueWords
            .map(word => ({ word, info: this.getMasteryInfo(word) }))
            .filter(item => item.info.score < 5)
            .slice(0, 5);
        const hard = Object.entries(this.failedWords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        document.getElementById('hardWordsReport').innerHTML = (hard.length || lowMastery.length)
            ? [
                ...hard.map(([word, count]) => {
                const found = this.wordLevels.flat().find(w => w.en === word) || this.learnedWords.find(w => w.en === word);
                const cn = found ? found.cn : '';
                return `<div><strong>${word}</strong> <span style="color:#999">${cn}</span> · 失败 ${count} 次</div>`;
                }),
                ...lowMastery.map(({word, info}) => `<div><strong>${word}</strong> <span class="mastery-pill">${info.icon} ${info.name}</span></div>`)
            ].join('')
            : '暂时没有明显卡点，保持这个节奏。';

        document.getElementById('reportModal').classList.add('active');
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
        ctx.fillText('单词拼拼消', w / 2, 80);

        ctx.font = 'bold 72px sans-serif';
        ctx.fillText(this.targetWord, w / 2, 180);

        ctx.font = '32px sans-serif';
        ctx.fillText(this.targetChinese, w / 2, 230);

        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(this.targetSentence, w / 2, 280);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#ffd700';
        const modeText = {
            story: `第 ${this.level} 关`,
            timed: '限时挑战',
            endless: '无尽模式',
            review: '单词复习',
            daily: '每日挑战'
        }[this.gameMode] || '单词拼拼消';
        ctx.fillText(`${modeText} · 得分 ${this.score}`, w / 2, 340);

        const link = document.createElement('a');
        link.download = 'word-match-score.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

const game = new WordMatchGame();
