// 微信小游戏入口（解耦第④步）
// 顺序：canvas/全局注入 → DOM 垫片 → wx 适配器 → 音频分包 → core bundle → 实例化 → 触摸接入
// 注意：js/core/ 下的 bundle.js / tts-manifest.js 是 tools/build-minigame.sh 的构建产物，
// 首次导入前先在仓库根目录执行 `tools/build-minigame.sh`。

// ---- 1. canvas 与全局注入（renderer-canvas 读取的全局约定） ----
const canvas = wx.createCanvas();            // 首次 createCanvas = 上屏 canvas
const sysInfo = wx.getSystemInfoSync();

GameGlobal.canvas = canvas;
GameGlobal.devicePixelRatio = sysInfo.pixelRatio;   // window.devicePixelRatio 同源可取
GameGlobal.__DPR = sysInfo.pixelRatio;
GameGlobal.innerWidth = sysInfo.windowWidth;
GameGlobal.innerHeight = sysInfo.windowHeight;
// wx 的 canvas 没有 DOM 事件接口，renderer 若按浏览器习惯挂监听，这里吞掉
if (typeof canvas.addEventListener !== 'function') {
    canvas.addEventListener = function () {};
    canvas.removeEventListener = function () {};
}

// ---- 2. DOM/BOM 垫片（window/document/navigator） ----
require('./js/shim-dom.js');

// ---- 3. 平台适配器（core 以裸标识符引用，须先于 bundle 注入全局） ----
require('./js/adapters/wx-storage.js');
const SpeechAdapter = require('./js/adapters/wx-speech.js');
require('./js/adapters/wx-sound.js');

// ---- 4. 音频分包（audio/ 6.5MB，主包 4MB 限制放不下，见 game.json subpackages） ----
wx.loadSubpackage({
    name: 'audio-tts',
    success() { SpeechAdapter.audioReady = true; },
    fail(err) { console.warn('[minigame] 音频分包加载失败，朗读将静默跳过', err); }
});

// ---- 5. core bundle（events/config/words-data/game 骨架/game-*/renderer-canvas 拼接产物） ----
const { WordMatchGame } = require('./js/core/bundle.js');

// ---- 6. 实例化并进入菜单（renderer-canvas 的菜单渲染在 init() 内被触发） ----
const game = new WordMatchGame();
GameGlobal.game = game;

// ---- 7. 触摸输入 → 渲染器统一入口 ----
// 与 renderer-canvas 的接口约定（canvas.html 的鼠标/触摸走同一入口）：
//   game.canvasInput(type, x, y)，type ∈ 'start' | 'move' | 'end'，
//   x/y 为 CSS 逻辑像素（clientX/clientY），DPR 换算由渲染器内部处理。
// 若同事实现的方法名不同，只需改下面 forward() 一处。
function forward(type, e) {
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    if (!t) return;
    if (typeof game.canvasInput === 'function') {
        game.canvasInput(type, t.clientX, t.clientY);
    }
}
wx.onTouchStart((e) => forward('start', e));
wx.onTouchMove((e) => forward('move', e));
wx.onTouchEnd((e) => forward('end', e));
wx.onTouchCancel((e) => forward('end', e));
