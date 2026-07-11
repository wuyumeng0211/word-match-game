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
    },

    // ═══════════ 伙伴进化仪式：Canvas 版三幕演出 ═══════════
    // 覆盖 renderer-canvas.js 里的占位版（setTimeout 350ms 直接跑 _afterEvolveClose 回调链，无画面）。
    // 编舞节奏对齐 renderer-companion.js 的 DOM 蓝本：
    //   聚气 0-1450ms（旧形态低饱和微颤 + 金环脉冲 + 14 枚金粒子向心汇聚 + 呼吸提示「羁绊满溢……」）
    //   → 白闪 1450-2080ms（全屏白闪，峰值 1750ms 完成新旧形态换装）
    //   → 亮相 2080ms 起（光芒盘旋转 + 新形态落地弹跳 + 报幕按延迟渐次登场 + 一次性金屑）
    // 与 sound.js/wx-sound.js 的 'evolve' 音序对齐（0-1.4s 上行琶音→1.55s 变身重音→2.05s 大和弦）。
    // 时间驱动：cv.overlay 的 state.start 记一次起点，draw() 每帧按 elapsed 插值，不再取随机数——
    // 粒子/金屑的随机角度/延迟/颜色在这里一次性摇好存进 state，否则每帧重摇会闪烁。
    // 点舞台任意处在亮相前快进到亮相（reveal()，speakCompanionLine/金屑只放一次，靠 state.revealed 防重）；
    // 亮相后只有按钮 rect 能关闭：cv.overlay=null + _invalidate + SpeechAdapter.cancelSpeech() +
    // 走 _afterEvolveClose 回调链（win 结算弹窗排在这条链后面，绝不能漏调，见 game-companion.js queueWinPresentation）。
    showEvolveModal(id, growth) {
        const cv = this._cv;
        if (!cv) return;
        const companion = COMPANIONS.find(c => c.id === id) || COMPANIONS[0];
        const prevLevel = Math.max(1, growth.level - 1);
        const oldLabel = this.getCompanionLevelLabel(id, prevLevel);
        const newLabel = `${growth.name} · ${growth.label}`;
        const lines = (COMPANION_LINES[id] || {}).evolve || [];
        const line = lines.length ? lines[Math.floor(Math.random() * lines.length)] : { en: '', zh: '' };
        const lineEn = (line.en || '').replace(/\{name\}/g, growth.name);
        const lineZh = (line.zh || '').replace(/\{name\}/g, growth.name);

        // 14 枚粒子：角度/距离/延迟一次性摇好（延迟 0~0.5s，对齐 DOM --d 随机区间）
        const particles = [];
        for (let i = 0; i < 14; i++) {
            const ang = Math.random() * Math.PI * 2;
            particles.push({ ang, dist: 110 + Math.random() * 90, delay: Math.random() * 0.5 });
        }
        // 20 枚金屑：一次性摇好各自的水平位置/延迟/下落速度/漂移/转速/颜色，2s 生命周期
        const CONFETTI_COLORS = ['#ffd700', '#ff9f40', '#7ee8c7', '#7ea8ff', '#ffb3d1'];
        const confetti = [];
        for (let i = 0; i < 20; i++) {
            confetti.push({
                x: Math.random(), delay: Math.random() * 0.6,
                fall: 90 + Math.random() * 60, drift: (Math.random() - 0.5) * 40,
                spin: (Math.random() - 0.5) * 6, size: 4 + Math.random() * 4,
                color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
            });
        }

        const state = {
            id, growth, companion, prevLevel, oldLabel, newLabel, lineEn, lineZh,
            particles, confetti,
            reduceMotion: !!this.reduceMotion,
            start: performance.now(),
            revealStart: null, revealed: false, spoken: false,
            btnRect: null
        };

        // 快进/自然推进/reduceMotion 三条路径共用同一个 reveal()：revealed 标记天然防重触发
        // （语音只报一次、金屑只放一次），语义与 DOM 版 reveal() 一致
        const reveal = () => {
            if (state.revealed) return;
            state.revealed = true;
            state.revealStart = performance.now();
            if (!state.spoken) {
                state.spoken = true;
                this.speakCompanionLine(id, lineEn);
            }
        };

        const draw = (ctx, drawCv) => this._companionDrawEvolve(ctx, drawCv, state, reveal);
        // onTap 不经 renderer-canvas.js 的 .call(this,...) 绑定（原样调用 cv.overlay.onTap(x,y)），
        // 用箭头函数捕获 showEvolveModal 自身的 this（game 实例）
        const onTap = (x, y) => {
            if (!state.revealed) { reveal(); this._invalidate(); return; }
            const b = state.btnRect;
            if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this._companionCloseEvolve();
            }
        };

        cv.overlay = { start: state.start, state, draw, onTap };

        if (state.reduceMotion) {
            this.sound.play('win');
            reveal();               // reduceMotion：无动画，直接进入亮相终态（报幕全部即时可见，无金屑）
        } else {
            this.sound.play('evolve');
        }
        this._invalidate();
    },

    // 关闭进化仪式：清覆盖层 → 停语音 → 走 _afterEvolveClose 回调链（存在才调，调后置 null）——
    // win 结算弹窗排在这条链后面（queueWinPresentation），断了 win 弹窗就再也弹不出来
    _companionCloseEvolve() {
        const cv = this._cv;
        if (cv) cv.overlay = null;
        this._invalidate();
        SpeechAdapter.cancelSpeech();
        const cb = this._afterEvolveClose;
        this._afterEvolveClose = null;
        if (cb) cb();
    },

    // ═══════════ 进化仪式逐帧绘制：按 elapsed 插值，state 里的随机数只读不重摇 ═══════════
    _companionDrawEvolve(ctx, cv, state, reveal) {
        const { PX, F, panel, rr, LETTER_COLORS } = this._pxKit();
        const skin = this._skin();
        const now = performance.now();
        const W = cv.W, H = cv.H;

        // 暗场底：classic/pixel 两套暖暗色，对齐 DOM .evolve-overlay 的遮罩基调
        ctx.fillStyle = skin === 'pixel' ? 'rgba(30,22,16,0.95)' : 'rgba(16,11,32,0.94)';
        ctx.fillRect(0, 0, W, H);

        const cx = W / 2, cy = H * 0.32;   // 立绘中上部
        const size = Math.max(104, Math.min(170, Math.min(W, H) * 0.34));

        // 自然推进：未快进时 elapsed 达到亮相起点(2080ms)自动触发 reveal()——与快进走同一条 reveal()
        if (!state.revealed && (now - state.start) >= 2080) reveal();

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        if (!state.revealed) {
            const elapsed = now - state.start;
            if (elapsed < 1450) {
                // 第一幕：聚气 —— 旧形态低饱和微颤 + 金环脉冲 + 粒子向心汇聚 + 呼吸提示
                const jx = Math.sin(elapsed * 0.023) * 2, jy = Math.cos(elapsed * 0.031) * 2;
                ctx.globalAlpha = 0.75;   // 模拟失色，对齐 DOM saturate(0.45) brightness(0.72) 的直觉效果
                this._companionEvolveSprite(ctx, state.id, state.prevLevel, state.growth.name, cx + jx, cy + jy, size);
                ctx.globalAlpha = 1;

                const pulse = (1 - Math.cos((elapsed % 750) / 750 * Math.PI * 2)) / 2;  // 0..1..0 / 0.75s
                ctx.strokeStyle = '#ffd700';
                ctx.globalAlpha = 0.85 + pulse * 0.15;
                ctx.lineWidth = 4;
                const ringR = size * 0.62 * (1 - pulse * 0.18);
                if (skin === 'pixel') { rr(ctx, cx - ringR, cy - ringR, ringR * 2, ringR * 2, 8); ctx.stroke(); }
                else { ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2); ctx.stroke(); }
                ctx.globalAlpha = 1;

                state.particles.forEach(p => {
                    const t = (elapsed / 1000) - p.delay;
                    if (t <= 0 || t >= 1.5) return;   // 未开始/已播完（播完后按 DOM forwards 语义停在 opacity:0）
                    const prog = t / 1.5;
                    const a = prog < 0.25 ? prog / 0.25 : 1 - (prog - 0.25) / 0.75;
                    const tx = Math.cos(p.ang) * p.dist * (1 - prog), ty = Math.sin(p.ang) * p.dist * (1 - prog);
                    const s = 0.5 + prog * 0.8;
                    ctx.globalAlpha = Math.max(0, a);
                    ctx.fillStyle = '#ffd700';
                    if (skin === 'pixel') { const r = 3.5 * s; ctx.fillRect(cx + tx - r, cy + ty - r, r * 2, r * 2); }
                    else { ctx.beginPath(); ctx.arc(cx + tx, cy + ty, 3.5 * s, 0, Math.PI * 2); ctx.fill(); }
                });
                ctx.globalAlpha = 1;

                const hintA = 0.55 + (1 - Math.cos((elapsed % 900) / 900 * Math.PI * 2)) / 2 * 0.45;
                ctx.fillStyle = `rgba(255,235,180,${hintA.toFixed(2)})`;
                ctx.font = F.cn(13);
                ctx.fillText('羁绊满溢……', cx, cy + size * 0.72);
            } else {
                // 第二幕：白闪 —— 峰值 1750ms 完成新旧形态换装（观众看不到换装缝隙）
                const heroLevel = elapsed >= 1750 ? state.growth.level : state.prevLevel;
                this._companionEvolveSprite(ctx, state.id, heroLevel, state.growth.name, cx, cy, size);
                const ft = Math.max(0, Math.min(1, (elapsed - 1450) / 630));
                const ease = p => 1 - (1 - p) * (1 - p);   // 二次 ease-out
                const alpha = ft <= 0.3 ? ease(ft / 0.3) : 1 - ease((ft - 0.3) / 0.7);
                ctx.globalAlpha = Math.max(0, alpha);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, W, H);
                ctx.globalAlpha = 1;
            }
            ctx.globalAlpha = 1;
            return;
        }

        // 第三幕：亮相 —— 光芒盘旋转 + 新形态落地弹跳 + 报幕渐次登场 + 一次性金屑
        const e2 = now - state.revealStart;
        const rayAngle = state.reduceMotion ? 0 : (e2 / 16000) * Math.PI * 2;   // 16s/圈，对齐 evolveRaysSpin
        this._companionEvolveRays(ctx, cx, cy, size * 1.3, rayAngle, 0.28);

        let scale = 1;
        if (!state.reduceMotion && e2 < 600) {
            // 分段线性插值模拟 cubic-bezier(0.2,1.5,0.4,1) 回弹：0%:0.6 → 55%:1.16 → 100%:1
            const t = e2 / 600;
            scale = t < 0.55 ? 0.6 + (t / 0.55) * 0.56 : 1.16 - ((t - 0.55) / 0.45) * 0.16;
        }
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
        this._companionEvolveSprite(ctx, state.id, state.growth.level, state.growth.name, cx, cy, size);
        ctx.restore();

        // 报幕：延迟渐次登场（reduceMotion 全部即时可见，无位移/无回弹）
        const enter = (delayMs, durMs) => state.reduceMotion ? 1 : Math.max(0, Math.min(1, (e2 - delayMs) / durMs));
        const pop = (delayMs, durMs) => {
            if (state.reduceMotion) return { alpha: 1, scale: 1 };
            const t = Math.max(0, Math.min(1, (e2 - delayMs) / durMs));
            if (t <= 0) return { alpha: 0, scale: 0.5 };
            if (t < 0.7) return { alpha: Math.min(1, t / 0.7 * 1.2), scale: 0.5 + (t / 0.7) * 0.65 };
            return { alpha: 1, scale: 1.15 - ((t - 0.7) / 0.3) * 0.15 };
        };

        let ty = cy + size * 0.58;
        const titleA = enter(150, 500);      // 对齐 DOM .evolve-title：delay 0.15s / dur 0.5s
        if (titleA > 0) {
            ctx.globalAlpha = titleA;
            ctx.fillStyle = '#ffd700'; ctx.font = F.cnH(24);
            ctx.fillText('进 化 ！', cx, ty - (1 - titleA) * 10);
        }
        ty += 28;
        const oldA = enter(450, 400);        // 对齐 .evolve-label-old：delay 0.45s / dur 0.4s
        if (oldA > 0) {
            ctx.globalAlpha = oldA;
            ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = F.cn(13);
            const oy = ty - (1 - oldA) * 10;
            const oldText = state.oldLabel + ' ↓';   // ↓ 对齐 DOM ::after 伪元素的划掉箭头
            ctx.fillText(oldText, cx, oy);
            const w = ctx.measureText(oldText).width;
            ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(cx - w / 2, oy); ctx.lineTo(cx + w / 2, oy); ctx.stroke();
        }
        ty += 22;
        const newP = pop(650, 550);          // 对齐 .evolve-label pop：delay 0.65s / dur 0.55s，70% 处 1.15 回落
        if (newP.alpha > 0) {
            ctx.globalAlpha = newP.alpha;
            ctx.save();
            ctx.translate(cx, ty); ctx.scale(newP.scale, newP.scale);
            ctx.fillStyle = '#ffd700'; ctx.font = F.cnH(19);
            ctx.fillText(state.newLabel, 0, 0);
            ctx.restore();
        }
        ty += 26;
        const lineA = enter(950, 500);       // 对齐 .evolve-line-en/zh：delay 0.95s / dur 0.5s
        if (lineA > 0) {
            ctx.globalAlpha = lineA;
            const ly = ty - (1 - lineA) * 10;
            ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = F.cn(13);
            ctx.fillText(state.lineEn, cx, ly);
            ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = F.cn(11);
            ctx.fillText(state.lineZh, cx, ly + 16);
        }
        ty += 40;
        ctx.globalAlpha = 1;

        const btnA = enter(1300, 500);       // 对齐 .evolve-btn：delay 1.3s / dur 0.5s
        const btnW = Math.min(200, W - 80), btnH = 46, btnX = cx - btnW / 2, btnY = ty;
        if (btnA > 0) {
            ctx.globalAlpha = btnA;
            panel(ctx, btnX, btnY, btnW, btnH, LETTER_COLORS[3]);
            ctx.fillStyle = '#fff'; ctx.font = F.cnH(15);
            ctx.fillText('太棒啦！', cx, btnY + btnH / 2 + 1);
            ctx.globalAlpha = 1;
        }
        // 命中区跟随自己的入场延迟一起可点，早于此不接受点击（与视觉可见度同步）
        state.btnRect = (state.reduceMotion || e2 >= 1300) ? { x: btnX, y: btnY, w: btnW, h: btnH } : null;

        // 一次性金屑：仅正常模式播放（reduceMotion 无粒子金屑），各自 2s 生命周期，到点自然消失
        if (!state.reduceMotion) {
            state.confetti.forEach(c => {
                const t = e2 - c.delay * 1000;
                if (t < 0 || t > 2000) return;
                const px = c.x * W + c.drift * (t / 1000);
                const py = -20 + c.fall * (t / 1000);
                const rot = c.spin * (t / 1000);
                const a = t > 1700 ? Math.max(0, (2000 - t) / 300) : 1;
                ctx.save();
                ctx.globalAlpha = a;
                ctx.translate(px, py); ctx.rotate(rot);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                ctx.restore();
            });
        }
        ctx.globalAlpha = 1;   // 兜底：确保覆盖层画完后不影响 renderer-canvas.js 紧接着画的 toast
    },

    // 旋转光芒盘：blades 扇形循环，classic/pixel 通用固定金色（暗场上两皮肤都读得清）
    _companionEvolveRays(ctx, cx, cy, radius, angle, alpha) {
        const blades = 12;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        for (let i = 0; i < blades; i++) {
            const a0 = (i / blades) * Math.PI * 2;
            const a1 = a0 + (Math.PI * 2 / blades) * 0.5;
            ctx.fillStyle = i % 2 === 0 ? '#ffd700' : '#ffd76a';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, a0, a1);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    },

    // 立绘兜底：图片就绪画图（居中 size×size），否则色块+首字兜底——逻辑对齐 _companionDrawSprite，
    // 独立成小方法是因为这里只要「以中心点定位的正方形」，不需要 equipped 描边等伙伴屏专属参数
    _companionEvolveSprite(ctx, id, level, name, cx, cy, size) {
        const { letterColor } = this._pxKit();
        const entry = this._companionImage(id, level);
        const x = cx - size / 2, y = cy - size / 2;
        if (entry.img && entry.loaded) {
            ctx.drawImage(entry.img, x, y, size, size);
        } else {
            ctx.fillStyle = letterColor((name || id)[0].toUpperCase());
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = '#fff';
            ctx.font = `900 ${Math.round(size * 0.4)}px "PingFang SC", sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText((name || id)[0], cx, cy + 1);
        }
    }
});
