// renderer-canvas-companion.js — Canvas 渲染层子模块：伙伴屏
// 约定：必须在 renderer-canvas.js 之后加载（覆盖其 no-op 兜底）；
// tokens/helpers 经 this._pxKit() 取用（PX/F/panel/rr/wrapText/LETTER_COLORS/letterColor）；
// 整屏用 _drawScreen_<名字> 注册 + cv.screen 切换；游戏屏内追加用 _drawGameExtras。
// 私有辅助方法一律 _companion 前缀，避免与其它 renderer-canvas-*.js 子模块撞名。
Object.assign(WordMatchGame.prototype, {

    // ═══════════ 入口契约：菜单按钮调用（同事在 renderer-canvas.js 里接线）═══════════
    openCompanionScreen() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = 'companion';
        cv.modal = null;       // 从别的弹窗态切进来时保险清空
        cv.selected = null; cv.hint = null;
        this._invalidate();
    },

    // ═══════════ 整屏绘制：cv.screen === 'companion' 时由 renderer-canvas.js 主循环分发 ═══════════
    _drawScreen_companion(ctx, cv) {
        const { PX, F, panel, rr, LETTER_COLORS } = this._pxKit();
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        const companion = COMPANIONS.find(item => item.id === this.equippedCompanion) || COMPANIONS[0];
        const growth = this.getCompanionGrowth(companion.id);
        const item = COMPANION_ITEMS.find(entry => entry.companion === companion.id);
        const count = item ? (this.companionInventory[item.id] || 0) : 0;

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let y = 14;

        // ── 顶栏：返回 + 标题 + 语音开关 ──────────────────────────
        const backW = 64, backH = 32;
        panel(ctx, x0, y, backW, backH, PX.panel, { r: 6 });
        ctx.fillStyle = PX.ink; ctx.font = F.cn(13);
        ctx.fillText('‹ 菜单', x0 + backW / 2, y + backH / 2 + 1);
        cv.hits.push({ x: x0, y, w: backW, h: backH, action: () => this.backToMenu() });

        const voiceW = 32;
        const voiceX = x0 + cw - voiceW;
        panel(ctx, voiceX, y, voiceW, backH, PX.panel, { r: 6 });
        ctx.font = '16px sans-serif';
        ctx.fillText(this.companionVoiceOn ? '🔊' : '🔇', voiceX + voiceW / 2, y + backH / 2 + 1);
        cv.hits.push({ x: voiceX, y, w: voiceW, h: backH, action: () => this.toggleCompanionVoice() });

        ctx.fillStyle = PX.ink; ctx.font = F.cnH(18);
        ctx.fillText('我的伙伴', W / 2, y + backH / 2 + 1);
        y += backH + 14;

        // ── 立绘面板：像素变体图 + 等级角标 ──────────────────────
        const portraitH = Math.min(180, Math.max(120, H * 0.22));
        panel(ctx, x0, y, cw, portraitH, PX.panel);
        this._companionDrawSprite(ctx, companion.id, growth, x0 + (cw - portraitH * 0.7) / 2, y + 10, portraitH * 0.7, portraitH - 20);
        // Lv 角标（右上角小面板，压在立绘面板之上）
        const badgeW = 52, badgeH = 26;
        panel(ctx, x0 + cw - badgeW - 10, y + 10, badgeW, badgeH, PX.ink, { r: 4, shadow: null });
        ctx.fillStyle = PX.panel; ctx.font = F.mono(13);
        ctx.fillText('Lv.' + growth.level, x0 + cw - badgeW - 10 + badgeW / 2, y + 10 + badgeH / 2 + 1);
        y += portraitH + 12;

        // ── 名字行：自定义名/默认名 + 改名按钮 ────────────────────
        const nameH = 48;
        panel(ctx, x0, y, cw, nameH, PX.panel);
        ctx.textAlign = 'left'; ctx.fillStyle = PX.ink; ctx.font = F.cnH(17);
        ctx.fillText(growth.name, x0 + 16, y + nameH / 2 + 1);
        ctx.textAlign = 'center';
        const renameW = 64, renameH = 32;
        const renameX = x0 + cw - renameW - 8, renameY = y + (nameH - renameH) / 2;
        const renameUnlocked = !!this.companionRenameUnlocked[companion.id];
        // 未解锁改名时面板用暗色提示"当前不可用"，但 hit 区仍保留——renameCompanion()
        // 自己会在未解锁时弹 toast 说明("进化后才能给伙伴改名哦~")，这里不重复判断
        panel(ctx, renameX, renameY, renameW, renameH, renameUnlocked ? PX.panel : PX.panelDim, { r: 6 });
        ctx.fillStyle = renameUnlocked ? PX.ink : PX.soft; ctx.font = F.cn(12);
        ctx.fillText('✏️ 改名', renameX + renameW / 2, renameY + renameH / 2 + 1);
        cv.hits.push({ x: renameX, y: renameY, w: renameW, h: renameH, action: () => this.renameCompanion(companion.id) });
        y += nameH + 10;

        // ── 羁绊面板：称号 + 进度条 ────────────────────────────
        const bondH = 74;
        panel(ctx, x0, y, cw, bondH, PX.panel);
        ctx.textAlign = 'left'; ctx.fillStyle = PX.ink; ctx.font = F.cn(14);
        ctx.fillText(growth.label, x0 + 16, y + 22);
        ctx.textAlign = 'right'; ctx.fillStyle = PX.soft; ctx.font = F.mono(12);
        ctx.fillText(`羁绊 ${growth.points}/${growth.next}`, x0 + cw - 16, y + 22);
        const barW = cw - 32, barX = x0 + 16, barY = y + 38, barH = 12;
        panel(ctx, barX, barY, barW, barH, PX.panelDim, { shadow: null, r: 3 });
        const fillW = Math.max(0, Math.min(1, growth.percent / 100)) * (barW - 4);
        if (fillW > 1) {
            ctx.fillStyle = LETTER_COLORS[4];
            rr(ctx, barX + 2, barY + 2, fillW, barH - 4, 2); ctx.fill();
        }
        ctx.textAlign = 'left'; ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
        const shield = companion.id === 'mecha' && this.mechaShieldMoves > 0 ? ` · 护盾剩余 ${this.mechaShieldMoves} 步` : '';
        ctx.fillText(this.getCompanionEffectText(companion.id, growth.level) + shield, x0 + 16, y + bondH - 12);
        y += bondH + 10;

        // ── 补给道具面板：余量展示 ─────────────────────────────
        const itemH = 56;
        panel(ctx, x0, y, cw, itemH, PX.panel);
        ctx.textAlign = 'left'; ctx.fillStyle = PX.ink; ctx.font = F.cn(14);
        ctx.fillText(`${companion.itemName} × ${count}`, x0 + 16, y + itemH / 2 + 1);
        y += itemH + 10;

        // ── 装备切换 dock：仅当拥有多个伙伴时展示 ──────────────
        if (this.unlockedCompanions.length > 1) {
            const dockH = 60;
            panel(ctx, x0, y, cw, dockH, PX.panel);
            const slots = this.unlockedCompanions.length;
            const slotW = Math.min(56, (cw - 16) / slots);
            let sx = x0 + (cw - slotW * slots) / 2;
            this.unlockedCompanions.forEach(id => {
                const g = this.getCompanionGrowth(id);
                const equipped = id === companion.id;
                const size = 44;
                const sy = y + (dockH - size) / 2;
                this._companionDrawSprite(ctx, id, g, sx + (slotW - size) / 2, sy, size, size, equipped);
                const hitX = sx, hitY = y;
                cv.hits.push({ x: hitX, y: hitY, w: slotW, h: dockH, action: () => { if (!equipped) this.equipCompanion(id); } });
                sx += slotW;
            });
            y += dockH + 10;
        }

        // ── 底部动作条：说一句 / 使用道具 / 返回 ─────────────────
        const btnH = 46;
        const btnW = (cw - 20) / 3;
        const btns = [
            ['说一句', () => this.sayCompanionLine(companion.id, 'idle', false, null, true)],
            [count > 0 ? '使用道具' : '去获取', () => this.useCompanionItem()],
            ['返回菜单', () => this.backToMenu()]
        ];
        btns.forEach(([label, action], i) => {
            const bx = x0 + i * (btnW + 10);
            panel(ctx, bx, y, btnW, btnH, PX.panel);
            ctx.fillStyle = PX.ink; ctx.font = F.cnH(14);
            ctx.fillText(label, bx + btnW / 2, y + btnH / 2 + 1);
            cv.hits.push({ x: bx, y, w: btnW, h: btnH, action });
        });
    },

    // ═══════════ 立绘绘制：图片就绪画图，否则色块+首字兜底 ═══════════
    // equipped 仅用于装备 dock 里给当前出战伙伴描边高亮
    _companionDrawSprite(ctx, id, growth, x, y, w, h, equipped) {
        const { PX, letterColor } = this._pxKit();
        const entry = this._companionImage(id, growth.level);
        if (entry.img && entry.loaded) {
            ctx.drawImage(entry.img, x, y, w, h);
        } else {
            // 加载中/失败：色块 + 名字首字兜底，保证屏幕不空白
            ctx.fillStyle = letterColor((growth.name || id)[0].toUpperCase());
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#fff';
            ctx.font = `900 ${Math.round(h * 0.4)}px "PingFang SC", sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText((growth.name || id)[0], x + w / 2, y + h / 2 + 1);
        }
        if (equipped) {
            ctx.lineWidth = 3; ctx.strokeStyle = PX.ink;
            ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
        }
    },

    // 懒加载 + 缓存像素变体立绘（assets/companions/pixel/<id>-l<level>.png，等级 1-6 对齐
    // getCompanionGrowth 的 level）。浏览器用 Image，微信小游戏用 wx.createImage（特性检测，
    // 不裸引用全局 wx，避免在非 wx 环境直接引用未声明标识符报错）。
    _companionImage(id, level) {
        this._companionImgCache = this._companionImgCache || {};
        const key = id + '-l' + level;
        let entry = this._companionImgCache[key];
        if (entry) return entry;
        entry = { img: null, loaded: false, failed: false };
        this._companionImgCache[key] = entry;
        const src = 'assets/companions/pixel/' + id + '-l' + level + '.png';
        try {
            const wxApi = this._companionWx();
            let img = null;
            if (wxApi && typeof wxApi.createImage === 'function') {
                img = wxApi.createImage();
            } else if (typeof Image !== 'undefined') {
                img = new Image();
            }
            if (!img) { entry.failed = true; return entry; }
            img.onload = () => { entry.loaded = true; this._invalidate(); };
            img.onerror = () => { entry.failed = true; this._invalidate(); };
            img.src = src;
            entry.img = img;
        } catch (e) {
            entry.failed = true;
        }
        return entry;
    },

    // 微信小游戏环境特性检测：runtime 里 GameGlobal 即全局对象，wx SDK 挂在其上；
    // 用 typeof 保护避免浏览器下裸 GameGlobal/wx 标识符抛 ReferenceError
    _companionWx() {
        try {
            return (typeof GameGlobal !== 'undefined' && GameGlobal.wx) ? GameGlobal.wx : null;
        } catch (e) {
            return null;
        }
    },

    // ═══════════ 与 core 对接的舞台方法（Canvas 实现）═══════════
    // DOM 版把伙伴挂件渲染进 #companionDock（主页/游戏屏常驻）。Canvas 版没有常驻挂件——
    // 伙伴信息只在专属的伙伴屏（cv.screen==='companion'）里画。core 在羁绊变化/改名/切换
    // 语音等时机调用 renderCompanionDock() 通知"该刷新伙伴展示了"，这里的等价动作就是
    // 请求整屏重绘：若当前正停在伙伴屏，下一帧会用最新 state 重画；若在其它屏幕，
    // 这次重绘等于空操作（对应屏幕的 draw 函数本就不读伙伴数据），开销可忽略。
    renderCompanionDock() {
        this._invalidate();
    },

    // ═══════════ 台词：对照 renderer-companion.js 的 DOM 气泡实现，Canvas 版落地为 toast ═══════════
    // 签名对齐 game-companion.js 的实际调用点（companionLoginGreet / greetCompanion）：
    // sayCompanionLine(id, scene, soft, daysOverride, withVoice)
    sayCompanionLine(id, scene, soft, daysOverride, withVoice) {
        id = id || this.equippedCompanion;
        if (!id) return;
        const lines = (COMPANION_LINES[id] || {})[scene];
        if (!lines || !lines.length) return;
        const cv = this._cv;
        const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
        // soft：已有台词提示在屏时不打断（对齐 DOM 版"气泡显示中则跳过"的语义）
        if (soft && cv && cv.toast && cv.toast.until > now) return;
        const line = lines[Math.floor(Math.random() * lines.length)];
        const growth = this.getCompanionGrowth(id);
        const days = daysOverride != null ? daysOverride : (this.getLearningStreak ? this.getLearningStreak() : 0);
        const en = line.en.replace(/\{name\}/g, growth.name).replace(/\{days\}/g, days);
        const zh = line.zh.replace(/\{name\}/g, growth.name).replace(/\{days\}/g, days);
        // toast 不支持自动换行/多行，只放中文台词，保持够短不溢出面板（en 转给语音朗读）
        this.showToast(`${growth.name}：${zh}`);
        if (withVoice) this.speakCompanionLine(id, en);   // speakCompanionLine 是 core 方法（game-companion.js），内部已走 SpeechAdapter.speakWithVoice + companionVoiceOn 开关
    },

    // ═══════════ 改名输入：平台差异适配 ═══════════
    // renameCompanion(id)（game-companion.js）用同步返回值消费 uiPromptCompanionName(cur)：
    //   const input = this.uiPromptCompanionName(cur); if (input === null) return; ...
    // 浏览器 prompt() 天然同步，可以直接走这条路径。
    // 但 wx.showModal 是异步回调，无法同步返回输入值——renameCompanion 这次调用只能先拿到
    // null（视为"用户取消"提前返回），真正的改名结果在 wx 回调里才落地。这里没有去改
    // game-companion.js（超出本文件职责范围），改用 _companionCommitRename 在回调里复刻
    // renameCompanion 的校验与收尾（写入 companionNames、saveGlobal、刷新展示、toast 反馈）。
    // 遗留风险：若未来有别的调用点在"非当前装备伙伴"上触发改名，这里 wx 分支硬编码
    // this.equippedCompanion 会认错对象——目前唯一调用点（伙伴屏改名按钮）永远是装备中的
    // 伙伴，暂时安全，但值得在 game-companion.js 里给 renameCompanion 加个 id 透传参数修正。
    uiPromptCompanionName(cur) {
        const wxApi = this._companionWx();
        if (wxApi && typeof wxApi.showModal === 'function') {
            const id = this.equippedCompanion;
            try {
                wxApi.showModal({
                    title: '给伙伴起个名字吧',
                    content: cur || '',
                    editable: true,
                    placeholderText: '最多6个字',
                    success: (res) => {
                        if (res && res.confirm) this._companionCommitRename(id, res.content);
                    },
                    fail: () => this.showToast('改名未完成')
                });
            } catch (e) {
                this.showToast('改名功能暂不可用');
            }
            return null;  // 异步：本次同步调用只能先返回 null，真正改名在 success 回调里完成
        }
        if (typeof prompt === 'function') {
            try {
                return prompt('给伙伴起个名字吧（最多6个字）', cur);
            } catch (e) {
                this.showToast('改名功能暂不支持');
                return null;
            }
        }
        this.showToast('当前环境暂不支持改名');
        return null;
    },

    // wx 异步改名收尾：与 renameCompanion(id) 中输入合法之后的逻辑保持一致
    _companionCommitRename(id, rawName) {
        if (!id || typeof rawName !== 'string') return;
        const name = rawName.trim().slice(0, 6);
        if (!name) { this.showToast('名字不能为空哦'); return; }
        this.companionNames[id] = name;
        this.saveGlobal();
        this.renderCompanionDock();
        this.uiRefreshCompanionShopIfOpen();
        this.showToast('已改名为「' + name + '」');
    }
});
