// 静态配置：主题 / 配色 / 成就 / 商店 / 陪伴角色 / 教程
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
    { bg:'#3b3663', bg2:'#6b64a0', fg:'#ffffff', border:'#2a264a' },
    { bg:'#ff7f00', bg2:'#ffb24d', fg:'#ffffff', border:'#b85c00' },
    { bg:'#f0d264', bg2:'#f7e49c', fg:'#4a3a00', border:'#a88c2c' },
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
    'repeating-linear-gradient(135deg, rgba(255,255,255,.12) 0 4px, transparent 4px 12px)',
    'repeating-linear-gradient(0deg, rgba(255,255,255,.11) 0 3px, transparent 3px 11px)',
    'radial-gradient(circle at 22% 24%, rgba(255,255,255,.14) 0 3px, transparent 3px)',
    'repeating-linear-gradient(90deg, rgba(255,255,255,.10) 0 3px, transparent 3px 12px)',
    'repeating-linear-gradient(45deg, rgba(255,255,255,.10) 0 2px, transparent 2px 9px)'
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
