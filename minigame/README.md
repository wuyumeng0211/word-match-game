# 微信小游戏版（解耦第④步脚手架）

Web 版 core（纯逻辑，无 DOM/平台 API）+ wx 适配器 + Canvas 渲染器（renderer-canvas.js，并行开发中）组成的小游戏工程。

## 一、构建（导入前必做）

js/core/ 与 audio/ 是构建产物，不入库、勿手改。在仓库根目录执行：

```bash
tools/build-minigame.sh
```

脚本做四件事（可重复执行，先清后拷）：

1. 把 core 源文件按 index.html 的 script 顺序拼接成 `js/core/bundle.js`
   （events → config → words-data → game.js 骨架 → game-*.js → renderer-canvas.js）。
   拼接而非逐文件 require 的原因：wx 是 CommonJS 环境，没有浏览器多 script 共享
   全局作用域的语义，而 core 源文件是顶层 const 互相引用的全局脚本风格。
2. `audio/tts/manifest.json` 转成 CommonJS 的 `js/core/tts-manifest.js`（随主包）。
3. 506 个 m4a 拷入 `audio/tts/`（分包，见下）。
4. node --check 全部产物与手写 js。

若提示 renderer-canvas.js 缺失：Canvas 渲染器尚未就绪，就绪后重跑脚本即可。

## 二、微信开发者工具导入步骤

1. 打开微信开发者工具 → 首页「小游戏」标签 → 「导入」。
2. 目录选择本 `minigame/` 目录（不是仓库根目录）。
3. AppID：填自己的小游戏 AppID；没有就点「测试号」（project.config.json 中
   预置的 `touristappid` 即游客模式占位，工具会引导切换）。
4. 导入后直接编译预览；真机预览用工具栏「预览」扫码。

## 三、包体积与分包方案（实测）

| 部分 | 实测体积 | 说明 |
|---|---|---|
| 主包（代码 + manifest） | 约 160 KB | bundle.js 108K + tts-manifest.js 24K + 入口/适配器，远低于 4MB 限制 |
| audio-tts 分包（506 个 m4a） | 约 6.5 MB | 单独放主包必超 4MB，故做分包 |
| 整包合计 | 约 6.7 MB | 低于小游戏 20MB 总限制 |

方案（已配置，无需再改）：`game.json` 里 `subpackages` 把 `audio/` 声明为
分包 `audio-tts`；入口 game.js 启动时 `wx.loadSubpackage` 异步加载，完成前
朗读静默跳过（`SpeechAdapter.audioReady` 门控），不阻塞进入游戏。
若未来音频继续膨胀，可按关卡组拆多个分包或改用 CDN + wx.downloadFile 缓存。

## 四、与 renderer-canvas.js 的接口约定

- 渲染器以 `Object.assign(WordMatchGame.prototype, {...})` 挂方法，需提供
  game.js/init() 会调用的全部渲染方法（renderLevelMap、renderAchievements、
  updateEquipBar、renderCompanionDock、applySkin、applyEquippedTheme 等
  ——Web 版这些在 renderer-*.js DOM 渲染器里，Canvas 版必须给出对应实现）。
- canvas 元素：浏览器由 canvas.html 提供；wx 版入口注入 `GameGlobal.canvas`
  （另有 `GameGlobal.__DPR` / `devicePixelRatio` / `innerWidth` / `innerHeight`）。
  document 垫片对含 "canvas" 的 id/选择器也返回这个真 canvas。
- 输入统一入口：`game.canvasInput(type, x, y)`，type ∈ 'start' | 'move' | 'end'，
  x/y 为 CSS 逻辑像素（clientX/clientY），DPR 换算在渲染器内部做。
  浏览器的鼠标/触摸事件与 wx.onTouchStart/Move/End/Cancel 都映射到它。
  如果同事最终方法名不同，只改入口 game.js 的 forward() 一处。

## 五、已知限制

- 伙伴语音无：wx 无 speechSynthesis，`speakWithVoice` 为空实现（台词动态、
  无法预烘焙）；单词/例句朗读走预烘焙 m4a，manifest 未命中即静默。
- 商店、词汇本、学习报告、教程等界面依赖 Canvas 版实现进度，未实现的界面
  点击无响应（DOM 调用被垫片吞掉，不会崩溃）。
- 分享图（generateShareImage）在 wx 的离屏 canvas 行为未验证。
- PWA 安装、service worker 相关逻辑在 wx 下自动短路，无功能。
- 音效为 WebAudioContext 移植版，若基础库/机型不支持 createOscillator 会
  自动降级静默（见 js/adapters/wx-sound.js 的 TODO）。

## 六、必须在微信开发者工具 / 真机验证的事项

本机 node 只能做语法检查，以下需工具或真机实测：

1. bundle 在 wx 全局（GameGlobal）下的运行时行为，尤其 DOM 垫片是否吞掉了
   所有残留 document 调用。
2. wx.loadSubpackage 加载 6.5MB 分包的耗时与失败率；分包内 m4a 经
   InnerAudioContext 播放是否正常。
3. wx.createWebAudioContext 的 OscillatorNode 合成音效在 iOS/Android 真机
   的支持度与音量。
4. 触摸坐标与渲染器 DPR 换算是否对齐（点击命中格子）。
5. 存档读写（wx.setStorageSync 10MB 配额，当前存档远小于此，理论安全）。
6. project.config.json 的 libVersion（3.4.0）与工具版本兼容性。
