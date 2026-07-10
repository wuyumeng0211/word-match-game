// renderer-canvas-learn.js — Canvas 渲染层子模块（占位，实现进行中）
// 约定：必须在 renderer-canvas.js 之后加载（覆盖其 no-op 兜底）；
// tokens/helpers 经 this._pxKit() 取用（PX/F/panel/rr/wrapText）；
// 整屏用 _drawScreen_<名字> 注册 + cv.screen 切换；游戏屏内追加用 _drawGameExtras。
Object.assign(WordMatchGame.prototype, {
});
