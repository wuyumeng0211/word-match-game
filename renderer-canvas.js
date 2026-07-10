// renderer-canvas.js — Canvas 渲染层（解耦第④步：微信小游戏舞台原型，先在浏览器跑通）
// 与 renderer-*.js（DOM 舞台）互斥加载：本文件用同名原型方法的 Canvas 实现替换 DOM 实现。
// 视觉规格来自 skin-pixel.css 头部的 design tokens（暖纸/墨色/降饱和八色/2px 硬边框/4px 圆角/2px 硬投影）。
// 重绘策略：脏标记 + rAF；仅在有进行中动画时连续跑帧，静止画面零重绘。
(() => {
'use strict';

// ── Design Tokens（源：skin-pixel.css）─────────────────────────
const PX = {
    paper:  '#f8f3ef',
    panel:  '#fffdf8',
    panelDim: '#f1e8dd',
    ink:    '#4a3b2f',
    soft:   '#96826d',
    shadowSoft: '#e0d2c0'
};
// 八色扁平降饱和色板：字母块按 26 字母 8 色循环
const LETTER_COLORS = ['#c76f5f','#d79a52','#c9b45c','#8ca872','#6fa39b','#7c94b6','#9d87ae','#c48fa0'];
const letterColor = ch => LETTER_COLORS[(ch.charCodeAt(0) - 65 + 8 * 26) % 8];

const F = {
    mono: s => `900 ${s}px "Courier New", ui-monospace, Menlo, monospace`,
    cn:   s => `700 ${s}px "PingFang SC", "Microsoft YaHei", sans-serif`,
    cnH:  s => `900 ${s}px "PingFang SC", "Microsoft YaHei", sans-serif`
};

function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
}

// 像素三件套面板：2px 硬投影 + 填色 + 2px 墨色硬边框
function panel(ctx, x, y, w, h, fill, opts) {
    const o = opts || {};
    const r = o.r != null ? o.r : 4;
    const shadow = o.shadow !== undefined ? o.shadow : PX.ink;
    if (shadow) { ctx.fillStyle = shadow; rr(ctx, x + 2, y + 2, w, h, r); ctx.fill(); }
    ctx.fillStyle = fill; rr(ctx, x, y, w, h, r); ctx.fill();
    ctx.lineWidth = o.lw != null ? o.lw : 2;
    ctx.strokeStyle = o.stroke || PX.ink;
    rr(ctx, x, y, w, h, r); ctx.stroke();
}

// 中英混排按字符折行（canvas 无原生换行）
function wrapText(ctx, text, maxW) {
    const out = [];
    for (const raw of String(text).split('\n')) {
        let line = '';
        for (const ch of raw) {
            if (line && ctx.measureText(line + ch).width > maxW) { out.push(line); line = ch; }
            else line += ch;
        }
        out.push(line);
    }
    return out;
}

const noop = function () {};

const canvasImpl = {

    // ═══════════ 初始化（DOM 版 init 的 Canvas 等价物由 main-canvas.js 编排）═══════════
    // 覆盖类上的 DOM 版 init：构造器会调用它，这里置空，真正的初始化在 main-canvas.js
    init() {},

    _canvasInit() {
        if (this._cv) return;
        const canvas = document.getElementById('gameCanvas');
        const cv = this._cv = {
            canvas, ctx: canvas.getContext('2d'),
            W: 0, H: 0, dpr: 1,
            screen: 'menu',
            hits: [],            // 每帧重建的命中区域 [{x,y,w,h,action}]
            boardRect: null,     // 棋盘几何缓存（命中检测用）
            modalBtnRect: null,
            selected: null, hint: null,
            swapAnim: null, matchedFx: null, shake: null,
            fallingUntil: 0, arriving: [], scorePop: null, combo: null,
            toast: null, modal: null,
            raf: 0
        };
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            cv.dpr = dpr;
            cv.W = window.innerWidth;
            cv.H = window.innerHeight;
            canvas.width = Math.round(cv.W * dpr);   // 物理像素 = CSS 像素 × DPR
            canvas.height = Math.round(cv.H * dpr);
            canvas.style.width = cv.W + 'px';
            canvas.style.height = cv.H + 'px';
            this._invalidate();
        };
        if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('resize', resize);
        resize();
        // 浏览器：pointer 事件；微信小游戏：canvas 无 addEventListener，
        // 由入口的 wx.onTouchStart 转发到统一入口 canvasInput()
        if (canvas.addEventListener) {
            canvas.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.canvasInput('start', e.clientX, e.clientY);
            });
        }
    },

    // 平台无关的输入统一入口（与 minigame/game.js 的触摸转发约定一致）
    // type: 'start' | 'move' | 'end'，x/y 为 CSS 逻辑像素
    canvasInput(type, x, y) {
        if (type === 'start') this._canvasHit(x, y);
        // move/end 当前交互模型（点选两格）不需要，保留入口以兼容拖拽扩展
    },

    // 共享绘制工具包：本文件的 tokens/helpers 在 IIFE 内私有，
    // renderer-canvas-*.js 子模块（商店/伙伴/道具/学习）经此取用，保证同一套像素语言
    _pxKit() {
        return { PX, F, panel, rr, wrapText, LETTER_COLORS, letterColor };
    },

    _invalidate() {
        const cv = this._cv;
        if (!cv || cv.raf) return;
        cv.raf = requestAnimationFrame(() => {
            cv.raf = 0;
            this._draw();
            if (this._animActive()) this._invalidate();  // 动画期间续帧，静止即停
        });
    },

    _animActive() {
        const cv = this._cv, now = performance.now();
        if (!cv) return false;
        if (cv.swapAnim || cv.shake) return true;
        if (cv.matchedFx && now - cv.matchedFx.start < cv.matchedFx.dur) return true;
        if (cv.fallingUntil > now) return true;
        if (cv.arriving.some(a => a.until > now)) return true;
        if (cv.scorePop && cv.scorePop.until > now) return true;
        if (cv.combo && cv.combo.until > now) return true;
        return false;
    },

    // ═══════════ 命中检测 ═══════════
    _canvasHit(clientX, clientY) {
        const cv = this._cv;
        if (!cv) return;
        const rect = cv.canvas.getBoundingClientRect();
        const x = clientX - rect.left, y = clientY - rect.top;
        if (cv.modal) {  // 弹窗打开时吞掉其余输入
            const b = cv.modalBtnRect;
            if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                const fn = cv.modal.onBtn;
                if (fn) fn();
            }
            return;
        }
        for (const h of cv.hits) {
            if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { h.action(); return; }
        }
        const b = cv.boardRect;
        if (cv.screen === 'game' && b && x >= b.x && y >= b.y && x < b.x + b.side && y < b.y + b.side) {
            const c = Math.floor((x - b.x) / (b.tile + b.gap));
            const r = Math.floor((y - b.y) / (b.tile + b.gap));
            if (r >= 0 && r < b.n && c >= 0 && c < b.n) this.handleClick(r, c);
        }
    },

    // ═══════════ 主绘制 ═══════════
    _draw() {
        const cv = this._cv, ctx = cv.ctx;
        ctx.setTransform(cv.dpr, 0, 0, cv.dpr, 0, 0);
        ctx.clearRect(0, 0, cv.W, cv.H);
        ctx.fillStyle = PX.paper;
        ctx.fillRect(0, 0, cv.W, cv.H);
        cv.hits = [];
        cv.boardRect = null;
        cv.modalBtnRect = null;
        if (cv.screen === 'menu') this._drawMenu(ctx, cv);
        else if (cv.screen === 'game') this._drawGame(ctx, cv);
        else {
            // 可扩展屏幕分发：子模块用 _drawScreen_<名字> 注册自己的整屏
            //（如 _drawScreen_shop），设 cv.screen='shop' + _invalidate() 即可切换
            const drawScreen = this['_drawScreen_' + cv.screen];
            if (drawScreen) drawScreen.call(this, ctx, cv);
            else this._drawGame(ctx, cv);
        }
        if (cv.modal) this._drawModal(ctx, cv);
        this._drawToast(ctx, cv);
    },

    _drawMenu(ctx, cv) {
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 32, 400), x0 = (W - cw) / 2;
        let y = Math.max(48, H * 0.10);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(34);
        ctx.fillText('单词消消乐', W / 2, y);
        y += 32;
        ctx.fillStyle = PX.soft; ctx.font = F.mono(13);
        ctx.fillText('WORD MATCH · CANVAS STAGE', W / 2, y);
        y += 34;
        // 统计面板：金币 / 关卡
        panel(ctx, x0, y, cw, 54, PX.panel);
        ctx.fillStyle = PX.ink; ctx.font = F.cn(16);
        ctx.fillText(`金币 ${this.coins}      关卡 ${this.level}`, W / 2, y + 28);
        y += 54 + 28;
        const modes = [
            ['story',   '闯 关 模 式', '三词一关 · 步数挑战', 3],
            ['timed',   '限 时 模 式', '60 秒极速拼词',       1],
            ['endless', '无 尽 模 式', '难度递增 · 无限拼词', 5]
        ];
        for (const [mode, name, desc, ci] of modes) {
            panel(ctx, x0, y, cw, 66, PX.panel);
            ctx.fillStyle = LETTER_COLORS[ci];
            rr(ctx, x0 + 16, y + 17, 32, 32, 4); ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = PX.ink;
            rr(ctx, x0 + 16, y + 17, 32, 32, 4); ctx.stroke();
            ctx.textAlign = 'left';
            ctx.fillStyle = PX.ink; ctx.font = F.cnH(18);
            ctx.fillText(name, x0 + 64, y + 25);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(12);
            ctx.fillText(desc, x0 + 64, y + 47);
            ctx.textAlign = 'center';
            const m = mode;
            cv.hits.push({ x: x0, y, w: cw, h: 66, action: () => this.selectMode(m) });
            y += 66 + 16;
        }
    },

    _hudData() {
        const mode = this.gameMode;
        const levelLabel = mode === 'review' ? '复习' : mode === 'daily' ? '挑战'
            : (mode === 'timed' || mode === 'endless') ? '模式' : '关卡';
        const levelValue = mode === 'daily' ? '今日' : mode === 'timed' ? '限时'
            : mode === 'endless' ? '无尽' : this.level;
        const movesLabel = mode === 'endless' ? '已拼' : mode === 'timed' ? '剩余' : '步数';
        const movesValue = mode === 'endless' ? this.endlessWords
            : mode === 'timed' ? this.timeLeft + 's' : this.moves;
        return [
            { label: levelLabel, value: levelValue },
            { label: movesLabel, value: movesValue },
            { label: '分数', value: this.score }
        ];
    },

    _drawGame(ctx, cv) {
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        let y = 10;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // HUD：关卡 / 步数 / 分数
        const bw = (cw - 20) / 3;
        this._hudData().forEach((h, i) => {
            const bx = x0 + i * (bw + 10);
            panel(ctx, bx, y, bw, 52, PX.panel);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
            ctx.fillText(h.label, bx + bw / 2, y + 15);
            ctx.fillStyle = PX.ink; ctx.font = F.mono(18);
            ctx.fillText(String(h.value), bx + bw / 2, y + 36);
        });
        y += 62;
        // 限时模式计时条
        if (this.gameMode === 'timed') {
            panel(ctx, x0, y, cw, 12, PX.panelDim, { shadow: null, r: 2 });
            const w = Math.max(0, Math.min(1, this.timeLeft / 60)) * (cw - 6);
            if (w > 1) {
                ctx.fillStyle = this.timeLeft <= 10 ? LETTER_COLORS[0] : LETTER_COLORS[4];
                rr(ctx, x0 + 3, y + 3, w, 6, 2); ctx.fill();
            }
            y += 22;
        }
        y = this._drawTarget(ctx, cv, x0, y, cw) + 12;
        // 棋盘
        const btnH = 44;
        const avail = H - y - btnH - 26;
        const side = Math.max(120, Math.min(cw, avail));
        const n = this.boardSize, gap = 4;
        const tile = (side - (n - 1) * gap) / n;
        const bx = (W - side) / 2, by = y;
        cv.boardRect = { x: bx, y: by, side, tile, gap, n };
        if (this.board && this.board.length) this._drawBoard(ctx, cv, bx, by, tile, gap, n);
        // 底部按钮：返回 / 提示 / 刷新
        const yb = by + side + 12;
        const btnW = (cw - 20) / 3;
        const btns = [
            ['返回', () => this.backToMenu(), false],
            [this.hintCooldown > 0 ? `提示 ${this.hintCooldown}s` : '提示', () => this.showHint(), this.hintCooldown > 0],
            ['刷新', () => this.shuffleBoard(), false]
        ];
        btns.forEach(([label, action, disabled], i) => {
            const bx2 = x0 + i * (btnW + 10);
            panel(ctx, bx2, yb, btnW, btnH, disabled ? PX.panelDim : PX.panel);
            ctx.fillStyle = disabled ? PX.soft : PX.ink; ctx.font = F.cnH(15);
            ctx.fillText(label, bx2 + btnW / 2, yb + btnH / 2 + 1);
            cv.hits.push({ x: bx2, y: yb, w: btnW, h: btnH, action });
        });
        // 游戏屏扩展钩子：子模块（炸弹/道具工具条等）在此追加绘制与 hit 区，
        // 传入按钮行底部 y 作为起笔线，避免与本函数的固定布局互踩
        if (this._drawGameExtras) this._drawGameExtras(ctx, cv, yb + btnH);
        // 连击提示 / 分数飘字
        const now = performance.now();
        if (cv.combo && cv.combo.until > now) {
            ctx.fillStyle = PX.ink; ctx.font = F.mono(24);
            ctx.fillText(`Combo x${cv.combo.n}`, W / 2, by + side / 2);
        }
        if (cv.scorePop && cv.scorePop.until > now) {
            const t = 1 - (cv.scorePop.until - now) / 600;
            ctx.globalAlpha = 1 - t;
            ctx.fillStyle = PX.ink; ctx.font = F.mono(18);
            ctx.fillText(cv.scorePop.text, W / 2, by + 30 - t * 24);
            ctx.globalAlpha = 1;
        }
    },

    _drawTarget(ctx, cv, x0, y, cw) {
        const word = this.targetWord || '';
        const h = 100;
        panel(ctx, x0, y, cw, h, PX.panel);
        const total = this.targetWords ? this.targetWords.length : 1;
        const current = this.currentWordIndex !== undefined ? this.currentWordIndex + 1 : 1;
        // 进度百分比（与 DOM 版同口径）
        const needed = {};
        for (const ch of word) needed[ch] = (needed[ch] || 0) + 1;
        let tot = 0, have = 0;
        for (const ch in needed) { tot += needed[ch]; have += Math.min(this.collectedLetters[ch] || 0, needed[ch]); }
        const progress = tot ? Math.round(have / tot * 100) : 0;
        ctx.textAlign = 'left'; ctx.fillStyle = PX.soft; ctx.font = F.cn(12);
        ctx.fillText(`目标单词 (${current}/${total})`, x0 + 14, y + 18);
        ctx.textAlign = 'right';
        ctx.fillText(progress + '%', x0 + cw - 14, y + 18);
        ctx.textAlign = 'center';
        // 字母格：已收集 = 彩色字母，未收集 = 暗面板 '?'
        const len = Math.max(word.length, 1);
        const s = Math.min(34, (cw - 28 - (len - 1) * 6) / len);
        const rowW = len * s + (len - 1) * 6;
        let sx = x0 + (cw - rowW) / 2;
        const sy = y + 30;
        const got = {};
        const now = performance.now();
        let i = 0;
        for (const ch of word) {
            got[ch] = (got[ch] || 0) + 1;
            const collected = (this.collectedLetters[ch] || 0) >= got[ch];
            const arriving = cv.arriving.some(a => a.letter === ch && a.occurrence === got[ch] - 1 && a.until > now);
            panel(ctx, sx, sy, s, s, collected ? this._pxColor(ch) : PX.panelDim,
                arriving ? { stroke: LETTER_COLORS[1], lw: 3 } : { shadow: collected ? PX.ink : null });
            ctx.fillStyle = collected ? '#fff' : PX.soft;
            ctx.font = F.mono(s * 0.55);
            ctx.fillText(collected ? ch : '?', sx + s / 2, sy + s / 2 + 1);
            sx += s + 6;
            i++;
        }
        ctx.fillStyle = PX.ink; ctx.font = F.cn(13);
        ctx.fillText(this.targetChinese || '', x0 + cw / 2, y + h - 16);
        return y + h;
    },

    // 字母取色：优先当关字母池的动态色位（同关不同字母不撞色），
    // 色表未建时回落到 charCode 循环
    _pxColor(letter) {
        const info = this.letterColorMap && this.letterColorMap[letter];
        return info && info.pxIndex !== undefined ? LETTER_COLORS[info.pxIndex] : letterColor(letter);
    },

    _drawBoard(ctx, cv, bx, by, tile, gap, n) {
        const now = performance.now();
        const anim = cv.swapAnim, fx = cv.matchedFx, shake = cv.shake;
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const cell = this.board[r] && this.board[r][c];
                if (!cell) continue;
                const isWild = this.isWildCell(cell), isCross = this.isCrossCell(cell);
                const letter = isWild ? '★' : this.cellLetter(cell);
                let px = bx + c * (tile + gap), py = by + r * (tile + gap);
                let scale = 1, alpha = 1;
                if (anim) {  // 交换动画：从对方格位滑到本格位（this.board 已是交换后状态）
                    const t = Math.min(1, (now - anim.start) / anim.dur);
                    const e = 1 - Math.pow(1 - t, 2);
                    let from = null;
                    if (r === anim.r1 && c === anim.c1) from = [bx + anim.c2 * (tile + gap), by + anim.r2 * (tile + gap)];
                    else if (r === anim.r2 && c === anim.c2) from = [bx + anim.c1 * (tile + gap), by + anim.r1 * (tile + gap)];
                    if (from) { px = from[0] + (px - from[0]) * e; py = from[1] + (py - from[1]) * e; }
                }
                if (fx && fx.cells.has(r + ',' + c)) {  // 消除：缩小 + 淡出
                    const t = Math.min(1, (now - fx.start) / fx.dur);
                    scale = 1 - 0.85 * t; alpha = 1 - t;
                }
                if (cv.fallingUntil > now) {  // 下落补位：整体从上方 18px 滑入
                    const t = 1 - (cv.fallingUntil - now) / 260;
                    py -= (1 - Math.max(0, Math.min(1, t))) * 18;
                }
                if (shake && shake.cells.some(cell => cell[0] === r && cell[1] === c)) {
                    const t = (now - shake.start) / shake.dur;
                    if (t < 1) px += Math.sin(t * Math.PI * 6) * 4;
                }
                const isSel = cv.selected && cv.selected.r === r && cv.selected.c === c;
                const isHint = cv.hint && ((cv.hint.r1 === r && cv.hint.c1 === c) || (cv.hint.r2 === r && cv.hint.c2 === c));
                const s = tile * scale;
                const ox = px + (tile - s) / 2, oy = py + (tile - s) / 2;
                ctx.globalAlpha = alpha;
                panel(ctx, ox, oy, s, s, isWild ? PX.ink : this._pxColor(letter), isSel ? { stroke: PX.ink, lw: 4 } : {});
                if (isHint) { ctx.lineWidth = 3; ctx.strokeStyle = LETTER_COLORS[1]; rr(ctx, ox - 3, oy - 3, s + 6, s + 6, 6); ctx.stroke(); }
                if (isSel) { ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; rr(ctx, ox + 4, oy + 4, s - 8, s - 8, 2); ctx.stroke(); }
                if (isCross) { ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; rr(ctx, ox + 3, oy + 3, s - 6, s - 6, 3); ctx.stroke(); }
                ctx.fillStyle = '#fff'; ctx.font = F.mono(s * 0.48);
                ctx.fillText(letter, ox + s / 2, oy + s / 2 + 1);
                if (isCross) { ctx.font = F.mono(s * 0.22); ctx.fillText('✚', ox + s - s * 0.18, oy + s * 0.2); }
                ctx.globalAlpha = 1;
            }
        }
    },

    _drawToast(ctx, cv) {
        const now = performance.now();
        if (!cv.toast || cv.toast.until <= now) return;
        ctx.font = F.cn(14);
        const w = Math.min(cv.W - 40, ctx.measureText(cv.toast.msg).width + 44);
        const x = (cv.W - w) / 2;
        panel(ctx, x, 12, w, 40, PX.ink, { shadow: PX.shadowSoft, stroke: PX.ink });
        ctx.fillStyle = PX.panel; ctx.textAlign = 'center';
        ctx.fillText(cv.toast.msg, cv.W / 2, 12 + 21);
    },

    _drawModal(ctx, cv) {
        const m = cv.modal;
        ctx.fillStyle = 'rgba(74,59,47,0.45)';  // 半透明遮罩
        ctx.fillRect(0, 0, cv.W, cv.H);
        const mw = Math.min(cv.W - 48, 340);
        const innerW = mw - 40;
        ctx.font = F.cn(14);
        const textLines = wrapText(ctx, m.text || '', innerW);
        let sentLines = [], sentCnLines = [];
        if (m.sentence) {
            ctx.font = F.mono(13);
            sentLines = wrapText(ctx, m.sentence, innerW - 20);
            ctx.font = F.cn(12);
            sentCnLines = wrapText(ctx, m.sentenceCn || '', innerW - 20);
        }
        const sentH = m.sentence ? (sentLines.length * 18 + sentCnLines.length * 17 + 24) : 0;
        const mh = 24 + 40 + 30 + textLines.length * 20 + 12 + sentH + (sentH ? 14 : 0) + 46 + 22;
        const mx = (cv.W - mw) / 2, my = Math.max(24, (cv.H - mh) / 2);
        panel(ctx, mx, my, mw, mh, PX.panel, { r: 6 });
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let y = my + 24 + 18;
        ctx.font = '36px sans-serif';
        ctx.fillText(m.icon || '', cv.W / 2, y); y += 40;
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(19);
        ctx.fillText(m.title || '', cv.W / 2, y); y += 30;
        ctx.font = F.cn(14); ctx.fillStyle = PX.ink;
        for (const line of textLines) { ctx.fillText(line, cv.W / 2, y); y += 20; }
        y += 4;
        if (m.sentence) {
            panel(ctx, mx + 14, y, mw - 28, sentH, PX.panelDim, { shadow: null });
            let sy = y + 14;
            ctx.font = F.mono(13); ctx.fillStyle = PX.ink;
            for (const line of sentLines) { ctx.fillText(line, cv.W / 2, sy); sy += 18; }
            ctx.font = F.cn(12); ctx.fillStyle = PX.soft;
            for (const line of sentCnLines) { ctx.fillText(line, cv.W / 2, sy); sy += 17; }
            y += sentH + 14;
        }
        const btnW = Math.min(200, mw - 60), btnX = (cv.W - btnW) / 2;
        panel(ctx, btnX, y, btnW, 46, LETTER_COLORS[3]);
        ctx.fillStyle = '#fff'; ctx.font = F.cnH(16);
        ctx.fillText(m.btn || '继续', cv.W / 2, y + 24);
        cv.modalBtnRect = { x: btnX, y, w: btnW, h: 46 };
    },

    // ═══════════ 与 core 对接的舞台方法（Canvas 实现）═══════════
    renderBoard() {
        const cv = this._cv;
        if (cv) cv.matchedFx = null;  // 棋盘已重排，消除特效结束
        this.renderTarget();
    },

    renderTarget() { this._invalidate(); },
    updateUI() { this._invalidate(); },
    updateTimedUI() { this._invalidate(); },
    updateEndlessUI() { this._invalidate(); },
    updateGlobalStats() { this._invalidate(); },
    updateHintButton() { this._invalidate(); },
    renderTimerFill() { this._invalidate(); },
    uiShowTimerBar() { this._invalidate(); },

    uiShowGameScreen() {
        const cv = this._cv;
        cv.screen = 'game';
        cv.selected = null; cv.hint = null; cv.modal = null;
        this._invalidate();
    },

    uiShowStartScreen() {
        const cv = this._cv;
        cv.screen = 'menu';
        cv.selected = null; cv.hint = null; cv.modal = null;
        this._invalidate();
    },

    uiSelectTile(r, c) {
        const cv = this._cv;
        cv.selected = { r, c };
        this._invalidate();
        return cv.selected;  // handleClick 把返回值存进 selectedTile.el，deselect 时传回
    },

    uiDeselectTile() {
        this._cv.selected = null;
        this._invalidate();
    },

    uiShowHint(move) {
        this._cv.hint = move;
        this._invalidate();
    },

    clearHint() {
        const cv = this._cv;
        if (cv && cv.hint) { cv.hint = null; this._invalidate(); }
    },

    // 时序契约：core 用 await 对时序 —— swap 在动画开始前落盘，Promise 在动画结束后 resolve
    animateSwap(r1, c1, r2, c2) {
        this.swap(r1, c1, r2, c2);
        const cv = this._cv;
        if (this.reduceMotion || !cv) { this._invalidate(); return Promise.resolve(); }
        cv.swapAnim = { r1, c1, r2, c2, start: performance.now(), dur: 150 };
        this._invalidate();
        return new Promise(resolve => setTimeout(() => {
            cv.swapAnim = null;
            this._invalidate();
            resolve();
        }, 160));
    },

    uiShakeTiles(r1, c1, r2, c2) {
        const cv = this._cv;
        cv.shake = { cells: [[r1, c1], [r2, c2]], start: performance.now(), dur: 250 };
        this._invalidate();
        return new Promise(resolve => setTimeout(() => {
            cv.shake = null;
            this._invalidate();
            resolve();
        }, 250));
    },

    // 消除特效：闪烁缩小淡出（core 自行等待 400ms 后 removeAndFill + renderBoard）
    uiMatchedTilesFx(matches, pts) {
        const cv = this._cv;
        cv.matchedFx = {
            cells: new Set(matches.map(m => m.r + ',' + m.c)),
            start: performance.now(), dur: 380
        };
        cv.scorePop = { text: '+' + pts, until: performance.now() + 600 };
        this._invalidate();
    },

    uiTilesFalling() {
        this._cv.fallingUntil = performance.now() + 260;
        this._invalidate();
    },

    // 简化实现：不做飞行轨迹，目标格直接点亮（橙色描边脉冲 600ms）
    flyLetterToTarget(r, c, letter, occurrence) {
        const cv = this._cv;
        const until = performance.now() + 600;
        cv.arriving = cv.arriving.filter(a => a.until > performance.now());
        cv.arriving.push({ letter, occurrence, until });
        this._invalidate();
    },

    uiComboIndicator(combo) {
        this._cv.combo = { n: combo, until: performance.now() + 800 };
        this._invalidate();
    },

    showToast(msg) {
        const cv = this._cv;
        if (!cv) { console.log('[toast]', msg); return; }
        cv.toast = { msg: String(msg), until: performance.now() + 2000 };
        this._invalidate();
        setTimeout(() => this._invalidate(), 2050);  // 到点擦除
    },

    // ═══════════ 弹窗（wordComplete / win / lose）═══════════
    showModal(type) {
        const cv = this._cv;
        const m = {};
        if (type === 'win') {
            m.icon = '🎉';
            if (this.gameMode === 'story') {
                const total = this.targetWords ? this.targetWords.length : 1;
                m.title = '恭喜通关!';
                m.text = `你成功拼出了 ${total} 个单词!\n剩余步数奖励已计入总分`;
                m.btn = '下一关';
                m.onBtn = () => { this.closeModal(); this.nextLevel(); };
            } else if (this.gameMode === 'timed') {
                m.title = '拼词成功!';
                m.text = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n继续挑战下一个！`;
                m.btn = '继续';
                m.onBtn = () => this.closeModal();
            } else if (this.gameMode === 'endless') {
                m.title = `第 ${this.endlessWords} 个单词!`;
                m.text = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n难度等级: ${this.endlessDifficulty}`;
                m.btn = '继续';
                m.onBtn = () => this.closeModal();
            } else if (this.gameMode === 'review') {
                const total = this.targetWords ? this.targetWords.length : 1;
                m.title = '复习完成!';
                m.text = `你成功拼出了 ${total} 个单词!`;
                m.btn = '再来一组';
                m.onBtn = () => { this.closeModal(); this.startGame(); };
            } else if (this.gameMode === 'daily') {
                m.title = '今日挑战完成!';
                m.text = this.lastDailyReward === 800
                    ? '首次完成今天的3个单词，获得 800 分奖励。'
                    : '再次完成今天的3个单词，获得 200 分奖励。';
                m.btn = '返回首页';
                m.onBtn = () => { this.closeModal(); this.backToMenu(); };
            }
            m.sentence = this.targetSentence;
            m.sentenceCn = this.targetSentenceCn || this.targetChinese;
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        } else {
            m.icon = '😢';
            m.title = this.gameMode === 'timed' ? '时间到!' : '步数用尽';
            m.text = this.gameMode === 'timed'
                ? `时间到了！你一共拼出了 ${this.endlessWords} 个单词，得分 ${this.score}`
                : `先复习一下 "${this.targetWord}" (${this.targetChinese})，再试一次会更稳。`;
            if (this.gameMode !== 'timed') {
                this.failedWords[this.targetWord] = (this.failedWords[this.targetWord] || 0) + 1;
                this.updateMastery(this.targetWord, 'fail');
                m.sentence = this.targetSentence;
                m.sentenceCn = this.targetSentenceCn || this.targetChinese;
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                this.saveGlobal();
                m.btn = '重试';
                m.onBtn = () => { this.closeModal(); this.resetLevel(); };
            } else {
                if (this.endlessWords > this.bestTimedWords) {
                    this.bestTimedWords = this.endlessWords;
                    this.saveGlobal();
                }
                if (this.endlessWords >= 10) this.unlockAchievement('speed_demon');
                m.btn = '再来一次';
                m.onBtn = () => { this.closeModal(); this.startGame(); };
            }
        }
        cv.modal = m;
        this.locked = false;
        this._invalidate();
    },

    showWordComplete() {
        const cv = this._cv;
        cv.modal = {
            icon: '✅',
            title: `${this.targetWord} · ${this.targetChinese}`,
            text: `单词 ${this.currentWordIndex + 1}/${this.targetWords.length} 完成，听一遍例句再继续。`,
            sentence: this.targetSentence,
            sentenceCn: this.targetSentenceCn,
            btn: '下一个单词',
            onBtn: () => {
                this.closeModal();
                this.currentWordIndex++;
                this.setCurrentTarget(this.currentWordIndex);
                this.generateBoard();
                this.renderBoard();
                this.renderTarget();
                this.updateUI();
            }
        };
        this.locked = false;
        this._invalidate();
        this.sound.speak(this.targetWord + '. ' + this.targetSentence);
    },

    closeModal() {
        const cv = this._cv;
        if (cv) { cv.modal = null; this._invalidate(); }
        const cb = this._afterWinModalClose;
        this._afterWinModalClose = null;
        if (cb) setTimeout(cb, 260);
    },

    uiHideModal() {
        const cv = this._cv;
        if (cv && cv.modal) { cv.modal = null; this._invalidate(); }
    },

    // 进化弹窗简化为 toast（gainCompanionBond 已发 toast）；
    // 但 queueWinPresentation 依赖 _afterEvolveClose 回调链才能弹出 win 结算，这里代跑
    showEvolveModal() {
        setTimeout(() => {
            const cb = this._afterEvolveClose;
            this._afterEvolveClose = null;
            if (cb) cb();
        }, 350);
    },

    // ═══════════ 平台能力（沿用 DOM 版实现，浏览器阶段可用）═══════════
    uiUnlockSpeechSynthesis() {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        this.sound.initVoices();
        const empty = new SpeechSynthesisUtterance('');
        empty.volume = 0;
        try { window.speechSynthesis.speak(empty); } catch (e) {}
    }
};

// ═══════════ 其余舞台方法：no-op 兜底（商店/成就/单词本/报告/教程/伙伴/皮肤等，Canvas 菜单未画入口）═══════════
const NOOP_METHODS = [
    'applyEquippedTheme', 'applySkin', 'applyTileColor',
    'closeDetailModal', 'closeShop', 'finishTutorial', 'generateShareImage',
    'openShop', 'renderAchievements', 'renderCompanionDock', 'renderCompanionShop',
    'renderFavButton', 'renderLevelMap', 'renderShop', 'renderSoundToggle',
    'renderTTSToggle', 'renderTheme', 'sayCompanionLine', 'showReport',
    'showTutorialStep', 'showVocab', 'showWordDetail', 'spawnConfetti',
    'spawnParticles', 'spawnScorePopup', 'startTutorial', 'switchShopTab',
    'uiClearBombTargets', 'uiHideInstallCard', 'uiHighlightHintLetter',
    'uiPromptCompanionName', 'uiRefreshCompanionShopIfOpen', 'uiSetBoardCursor',
    'uiToggleBombTarget', 'uiTriggerInstallPrompt',
    'updateBombUI', 'updateDailyCard', 'updateEquipBar', 'updateToolUI'
];
for (const name of NOOP_METHODS) {
    if (!canvasImpl[name]) canvasImpl[name] = noop;
}

Object.assign(WordMatchGame.prototype, canvasImpl);
})();
