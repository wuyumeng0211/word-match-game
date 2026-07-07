// tests/bootstrap.js — Node 单元测试装载器（解耦第③步）
// 只加载逻辑模块（config / words-data / game 类骨架 / game-*.js），不加载 renderer-*.js。
// 平台假件：StorageAdapter（内存 Map）、SpeechAdapter（空函数）、SoundManager（哑声）。
// renderer 原型方法：运行时从 renderer-*.js 源码正则提取方法名，逐个赋 no-op。
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

// —— 平台假件 ——————————————————————————————————————————
const memoryStore = new Map();
const StorageAdapter = {
    get(key) { return memoryStore.has(key) ? memoryStore.get(key) : null; },
    set(key, value) { memoryStore.set(key, String(value)); },
    remove(key) { memoryStore.delete(key); }
};

const SpeechAdapter = {
    init() {}, speak() {}, speakWithVoice() {}, cancelSpeech() {}
};

class SoundManager {
    constructor() { this.enabled = true; this.speakEnabled = true; }
    play() {}
    speak() {}
    ensureContext() {}
    initVoices() {}
}

// setTimeout/setInterval 包一层 unref，避免游戏内计时器让测试进程挂着不退出
function safeTimer(fn) {
    return (...args) => { const t = fn(...args); if (t && t.unref) t.unref(); return t; };
}

// —— 沙箱（浏览器多 <script> 的等价物：同一 context 共享全局词法作用域）——
const sandbox = {
    StorageAdapter, SpeechAdapter, SoundManager,
    console,
    setTimeout: safeTimer(setTimeout), clearTimeout,
    setInterval: safeTimer(setInterval), clearInterval,
    Date, Math, JSON
};
const context = vm.createContext(sandbox);

function loadScript(file) {
    const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
}

// 按 index.html 中的顺序加载逻辑模块（跳过 adapter/sound/renderer/main）
[
    'events.js',
    'config.js',
    'words-data.js',
    'game.js',
    'game-save.js',
    'game-colors.js',
    'game-companion.js',
    'game-shop.js',
    'game-board.js',
    'game-modes.js',
    'game-learning.js',
    'game-ui.js'
].forEach(loadScript);

const WordMatchGame = vm.runInContext('WordMatchGame', context);
const GameEvents = vm.runInContext('GameEvents', context);
const getConst = (name) => vm.runInContext(name, context);

// —— renderer 方法名提取 → 原型 no-op ————————————————————————
const noop = function () {};
const rendererFiles = fs.readdirSync(ROOT).filter(f => /^renderer-.*\.js$/.test(f));
const rendererMethods = new Set();
for (const file of rendererFiles) {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const re = /^ {4}(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/gm;
    let m;
    while ((m = re.exec(src)) !== null) rendererMethods.add(m[1]);
}
for (const name of rendererMethods) WordMatchGame.prototype[name] = noop;

// 逻辑测试常用的可观测桩：showToast 记录消息，供断言拒绝路径
WordMatchGame.prototype.showToast = function (msg) {
    (this._toasts || (this._toasts = [])).push(String(msg));
};

// init() 不在测试中执行（DOM 绑定属于浏览器）；构造器里会调用它，直接掐掉
WordMatchGame.prototype.init = noop;

// —— 工厂 ——————————————————————————————————————————————
function makeGame({ keepStorage = false } = {}) {
    if (!keepStorage) memoryStore.clear();
    return new WordMatchGame();
}

// 测试便捷：把游戏切到指定目标单词（story 模式最小态）
function setWord(game, word, { level = 1, boardSize = 6, mode = 'story' } = {}) {
    game.gameMode = mode;
    game.level = level;
    game.boardSize = boardSize;
    game.targetWord = word;
    game.targetChinese = '';
    game.targetSentence = '';
    game.targetSentenceCn = '';
    game.collectedLetters = {};
    for (const ch of word) game.collectedLetters[ch] = 0;
    game.letterColorMap = {};
}

// vm 沙箱里创建的数组/对象与测试进程不同 realm（Array.prototype 不同），
// deepStrictEqual 会因原型不等而误报——先拍平成纯 JSON 再比较
const plain = (x) => JSON.parse(JSON.stringify(x));

module.exports = { WordMatchGame, GameEvents, makeGame, setWord, memoryStore, getConst, rendererMethods, plain };
