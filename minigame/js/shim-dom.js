// DOM/BOM 垫片（解耦第④步）：wx 小游戏无 window/document/navigator。
// core 中仅 game.js（类骨架）的 bindEvents/init 仍触碰 document —— 这些
// 调用在 Canvas 版里没有对应元素，用"万能空对象"吞掉即可（点击输入统一
// 走 wx.onTouch* → game.canvasInput，见入口 game.js）。
//
// GameGlobal 是 wx 小游戏的全局对象：挂在它上面的属性可被任何模块以
// 裸标识符（window / document / navigator）解析到，等价于浏览器全局。

// 万能空 stub：任意取属性返回自身、可调用（返回自身）、可赋值（吞掉）。
// 覆盖 el.classList.toggle(...) / el.addEventListener(...) / el.textContent = x 等链式用法。
function makeStub() {
    const target = function () {};
    const stub = new Proxy(target, {
        get(t, prop) {
            if (prop === Symbol.toPrimitive) return () => '';
            if (prop === 'toString') return () => '';
            if (prop === Symbol.iterator) return function* () {};
            if (prop === 'length') return 0;
            return stub;
        },
        set() { return true; },
        apply() { return stub; },
        construct() { return stub; }
    });
    return stub;
}

const documentShim = {
    // 特判：按 id/选择器找 canvas 时返回真 canvas（renderer-canvas 在浏览器
    // 由 canvas.html 提供 canvas 元素，wx 版由入口 game.js 注入 GameGlobal.canvas）
    getElementById(id) {
        if (/canvas/i.test(String(id)) && GameGlobal.canvas) return GameGlobal.canvas;
        return makeStub();
    },
    querySelector(sel) {
        if (/canvas/i.test(String(sel)) && GameGlobal.canvas) return GameGlobal.canvas;
        return makeStub();
    },
    querySelectorAll() { return []; },          // 真数组：forEach/展开都安全（回调不执行）
    createElement(tag) {
        // 离屏 canvas：wx.createCanvas() 第二次起即为离屏（分享图等用）
        if (String(tag).toLowerCase() === 'canvas' && typeof wx !== 'undefined' && wx.createCanvas) {
            return wx.createCanvas();
        }
        return makeStub();
    },
    body: makeStub(),
    documentElement: makeStub(),
    head: makeStub(),
    addEventListener() {},
    removeEventListener() {}
};

GameGlobal.window = GameGlobal;                  // window.xxx → 全局属性
GameGlobal.document = documentShim;
if (!GameGlobal.navigator) {
    // 故意不放 serviceWorker / speechSynthesis：core 里的特性检测
    // （'serviceWorker' in navigator 等）应走"不支持"分支
    GameGlobal.navigator = { language: 'zh-CN', userAgent: 'wechat-minigame', platform: 'wechat' };
}
if (typeof GameGlobal.addEventListener !== 'function') {
    GameGlobal.addEventListener = function () {};   // window.addEventListener('beforeinstallprompt', ...) 等
    GameGlobal.removeEventListener = function () {};
}
if (!GameGlobal.Image && typeof wx !== 'undefined' && wx.createImage) {
    GameGlobal.Image = function Image() { return wx.createImage(); };
}
// 注意：不 shim matchMedia / fetch / speechSynthesis —— 让特性检测自然短路。

module.exports = documentShim;
