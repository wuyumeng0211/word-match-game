// renderer-canvas-tools.js — Canvas 渲染层子模块：游戏屏工具条（炸弹 + 三张学习道具卡）
// 约定：必须在 renderer-canvas.js 之后加载（覆盖其 no-op 兜底）；
// tokens/helpers 经 this._pxKit() 取用（PX/F/panel/rr/wrapText）；
// 整屏用 _drawScreen_<名字> 注册 + cv.screen 切换；游戏屏内追加用 _drawGameExtras。
// 私有辅助方法一律 _tools 前缀，避免与其它 renderer-canvas-*.js 子模块撞名。
Object.assign(WordMatchGame.prototype, {

    // ═══════════ 游戏屏扩展钩子：_drawGame 画完返回/提示/刷新按钮后调用 ═══════════
    // topY = 按钮行底部 y。这里追加一行工具条 + 棋盘覆盖高亮（覆盖高亮画在棋盘之后，
    // 才能压在已画好的格子上面）。
    _drawGameExtras(ctx, cv, topY) {
        this._tools_drawToolbar(ctx, cv, topY);
        this._tools_drawBombOverlay(ctx, cv);
        this._tools_drawHintLetterOverlay(ctx, cv);
    },

    // ── 工具条：炸弹 + 首字母提示 + 释义卡 + 例句卡，一行 4 个小按钮 ──
    // 炸弹模式激活中，四个按钮收起为一条引爆进度提示（省空间，375×667 也放得下）。
    _tools_drawToolbar(ctx, cv, topY) {
        const { PX, F, panel } = this._pxKit();
        const W = cv.W;
        // 与 _drawGame 内部完全一致的 x0/cw 算法，保证工具条和上方按钮行左右对齐
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        const y = topY + 8, barH = 34;

        if (this.bombMode) {
            const n = (this.bombSelected || []).length;
            panel(ctx, x0, y, cw, barH, PX.ink, { shadow: null });
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = PX.panel; ctx.font = F.cnH(13);
            ctx.fillText(`点棋盘 3 格引爆 (已选 ${n}/3)`, W / 2, y + barH / 2 + 1);
            return;
        }

        const gap = 8, bw = (cw - gap * 3) / 4;
        const items = [
            { label: `炸弹 ${this.bombs || 0}`, count: this.bombs || 0, action: () => this.activateBomb() },
            { label: `首字母 ${(this.toolInventory && this.toolInventory.first_hint) || 0}`,
              count: (this.toolInventory && this.toolInventory.first_hint) || 0,
              action: () => this.useTool('first_hint') },
            { label: `释义卡 ${(this.toolInventory && this.toolInventory.definition_card) || 0}`,
              count: (this.toolInventory && this.toolInventory.definition_card) || 0,
              action: () => this.useTool('definition_card') },
            { label: `例句卡 ${(this.toolInventory && this.toolInventory.sentence_card) || 0}`,
              count: (this.toolInventory && this.toolInventory.sentence_card) || 0,
              action: () => this.useTool('sentence_card') }
        ];
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        items.forEach((it, i) => {
            const bx = x0 + i * (bw + gap);
            const disabled = it.count <= 0;
            panel(ctx, bx, y, bw, barH, disabled ? PX.panelDim : PX.panel, { r: 4 });
            ctx.fillStyle = disabled ? PX.soft : PX.ink;
            ctx.font = F.cn(11);
            ctx.fillText(it.label, bx + bw / 2, y + barH / 2 + 1);
            if (!disabled) cv.hits.push({ x: bx, y, w: bw, h: barH, action: it.action });
        });
    },

    // ── 炸弹选中格覆盖高亮：读 this.bombSelected（单一事实源，不自存副本）──
    _tools_drawBombOverlay(ctx, cv) {
        const b = cv.boardRect;
        if (!b || !this.bombSelected || !this.bombSelected.length) return;
        const { PX, LETTER_COLORS, rr } = this._pxKit();
        ctx.lineWidth = 3;
        ctx.strokeStyle = LETTER_COLORS[0];  // 暖红色位，与消息条低电量配色同源，语义醒目
        for (const t of this.bombSelected) {
            const px = b.x + t.c * (b.tile + b.gap), py = b.y + t.r * (b.tile + b.gap);
            rr(ctx, px - 3, py - 3, b.tile + 6, b.tile + 6, 6);
            ctx.stroke();
        }
    },

    // ── 首字母提示覆盖高亮：cv.hintLetter 由 uiHighlightHintLetter 写入，带 until 时限 ──
    _tools_drawHintLetterOverlay(ctx, cv) {
        const hl = cv.hintLetter;
        if (!hl || performance.now() >= hl.until) return;
        const b = cv.boardRect;
        if (!b || !this.board) return;
        const { LETTER_COLORS, rr } = this._pxKit();
        ctx.lineWidth = 3;
        ctx.strokeStyle = LETTER_COLORS[1];  // 金色位，与棋盘既有“建议交换”提示同色，含义一致
        for (let r = 0; r < b.n; r++) {
            for (let c = 0; c < b.n; c++) {
                const cell = this.board[r] && this.board[r][c];
                if (!cell || this.cellLetter(cell) !== hl.letter) continue;
                const px = b.x + c * (b.tile + b.gap), py = b.y + r * (b.tile + b.gap);
                rr(ctx, px - 3, py - 3, b.tile + 6, b.tile + 6, 6);
                ctx.stroke();
            }
        }
    },

    // ═══════════ 与 core 对接的方法（覆盖 renderer-canvas.js 的 NOOP 兜底）═══════════

    // 炸弹数量变化（购买/兑换/消耗）：canvas 每帧从 this.bombs 现读现画，这里只需请求重绘
    updateBombUI() { this._invalidate(); },

    // 道具库存变化：同上，工具条每帧从 this.toolInventory 现读现画
    updateToolUI() { this._invalidate(); },

    // 炸弹目标选中态切换：this.bombSelected 是 core 侧的单一事实源，
    // 覆盖高亮直接读它，这里不额外维护副本，只请求重绘
    uiToggleBombTarget(r, c, on) { this._invalidate(); },

    uiClearBombTargets() { this._invalidate(); },

    // 触屏设备没有鼠标光标概念，DOM 版靠 CSS cursor 做视觉提示，Canvas 版无需处理
    uiSetBoardCursor() {},

    // 首字母提示：存 letter + 3 秒到期时间戳，绘制时按 until 过滤（见 _tools_drawHintLetterOverlay）
    uiHighlightHintLetter(letter) {
        const cv = this._cv;
        if (!cv) return;
        const dur = 3000;
        cv.hintLetter = { letter, until: performance.now() + dur };
        this._invalidate();
        // 高亮本身不是持续动画，_animActive() 感知不到这个计时态，
        // 所以到期后手动补一帧重绘，把描边擦掉（core 侧另有 setTimeout 调 clearHint，
        // 但那个只清 cv.hint 移动提示，不清这里的 cv.hintLetter，需要自己续帧）
        setTimeout(() => this._invalidate(), dur + 20);
    }
});
