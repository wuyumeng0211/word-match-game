// main-canvas.js — Canvas 舞台入口（解耦第④步）
// 不走 DOM 版 init()（renderer-canvas.js 已把原型上的 init 覆盖为空函数，
// 构造器内的 init() 调用因此无害），在此做等价初始化：
//   loadGlobalSave → SpeechAdapter.init → Canvas 初始化 → 进入主菜单屏。
// 有意跳过的 DOM 步骤：bindEvents（DOM 事件绑定）、setupPWA（service worker 注册）、
// startTutorial（教程弹窗）、companionLoginGreet（伙伴 dock 问候）。
const game = new WordMatchGame();

game.loadGlobalSave();
SpeechAdapter.init();
game._canvasInit();
game.uiShowStartScreen();
game.updateGlobalStats();
