// renderer-canvas-learn.js — Canvas 渲染层子模块：学习闭环（单词本/详情/报告/成就/关卡地图）
// 约定：必须在 renderer-canvas.js 之后加载（覆盖其 no-op 兜底）；
// tokens/helpers 经 this._pxKit() 取用（PX/F/panel/rr/wrapText/LETTER_COLORS）；
// 整屏用 _drawScreen_<名字> 注册 + cv.screen 切换；本文件私有辅助方法一律 _learn 前缀防重名。
// 数据契约（均为只读，来自 game-learning.js / game-save.js / config.js，未新增字段）：
//   this.learnedWords: [{en,cn,s,sc}]      —— 已学单词（addLearnedWord 累积）
//   this.favorites:    [{en,cn,s}]         —— 收藏（无 sc，取详情时会回退）
//   this.wordMastery / getMasteryInfo(word) -> {..., score, name, icon, percent}
//   this.achievements: {id:true}           —— 配 config.js 的 ACHIEVEMENTS 数组渲染
//   this.level / getLearningStreak() / playDates / dailyCompletions / totalCompletedWords / bestEndlessWords / failedWords / wordLevels
Object.assign(WordMatchGame.prototype, {

    // ═══════════ 公共小工具：四个学习类整屏共用同一顶部导航（标题 + 返回菜单） ═══════════
    _learnHeader(ctx, cv, title) {
        const { PX, F, panel } = this._pxKit();
        const W = cv.W;
        const backW = 64, backH = 34, bx = 12, by = 10;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(20);
        ctx.fillText(title, W / 2, by + backH / 2 + 1);
        panel(ctx, bx, by, backW, backH, PX.panel);
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(13);
        ctx.fillText('‹ 返回', bx + backW / 2, by + backH / 2 + 1);
        cv.hits.push({ x: bx, y: by, w: backW, h: backH, action: () => this.backToMenu() });
        return by + backH + 20;
    },

    // 单词的展示信息：优先 learnedWords（含例句中译 sc），退到 favorites（无 sc），
    // 再退到正在进行的对局目标词字段（供 showWordDetail() 无参调用时使用）
    _learnWordInfo(word) {
        const learned = this.learnedWords.find(w => w.en === word);
        const fav = this.favorites.find(w => w.en === word);
        const isTarget = word === this.targetWord;
        return {
            cn: (learned && learned.cn) || (fav && fav.cn) || (isTarget ? this.targetChinese : '') || '',
            sentence: (learned && learned.s) || (fav && fav.s) || (isTarget ? this.targetSentence : '') || '',
            sentenceCn: (learned && learned.sc) || (isTarget ? (this.targetSentenceCn || this.targetChinese) : '') || '',
            mastery: this.getMasteryInfo(word),
            isFav: this.favorites.some(w => w.en === word)
        };
    },

    // 私有：任意单词（非仅当前对局 targetWord）的收藏态切换。
    // core 的 toggleFavorite()（game-learning.js）硬编码只认 this.targetWord，
    // 单词本里点击任意一行都要能收藏，故这里复刻同样的最小逻辑，字段结构照抄 {en,cn,s}，不新增数据。
    _learnToggleFavorite(word) {
        const idx = this.favorites.findIndex(w => w.en === word);
        if (idx >= 0) {
            this.favorites.splice(idx, 1);
        } else {
            const info = this._learnWordInfo(word);
            this.favorites.push({ en: word, cn: info.cn, s: info.sentence });
        }
        this.renderFavButton();
        this.saveGlobal();
    },

    // ═══════════ 单词本 ═══════════
    showVocab() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = 'vocab';
        cv.learnFilter = 'all';
        cv.learnPage = 0;
        cv.learnDetail = null;
        this._invalidate();
    },

    _drawScreen_vocab(ctx, cv) {
        // 详情浮层打开时，本帧只画浮层本身：避免同时给列表/分页/tab 注册命中区，
        // 否则浮层之外的区域会透传点击到底下的行/翻页按钮（cv.modal 的“吞掉其余输入”这里没有现成机制可复用）
        if (cv.learnDetail) { this._learnDrawDetailOverlay(ctx, cv); return; }

        const { PX, F, panel, LETTER_COLORS } = this._pxKit();
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        let y = this._learnHeader(ctx, cv, '📖 单词本');

        // 筛选 tab：全部 / 已收藏
        const tabW = (cw - 10) / 2, tabH = 40;
        [['all', '全部'], ['fav', '已收藏']].forEach(([key, label], i) => {
            const tx = x0 + i * (tabW + 10);
            const active = cv.learnFilter === key;
            panel(ctx, tx, y, tabW, tabH, active ? LETTER_COLORS[4] : PX.panel, active ? {} : { shadow: null });
            ctx.fillStyle = active ? '#fff' : PX.ink; ctx.font = F.cnH(15);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, tx + tabW / 2, y + tabH / 2 + 1);
            cv.hits.push({
                x: tx, y, w: tabW, h: tabH, action: () => {
                    if (cv.learnFilter !== key) { cv.learnFilter = key; cv.learnPage = 0; this._invalidate(); }
                }
            });
        });
        y += tabH + 14;

        const list = cv.learnFilter === 'fav' ? this.favorites : this.learnedWords;
        if (!list.length) {
            ctx.fillStyle = PX.soft; ctx.font = F.cn(14); ctx.textAlign = 'center';
            ctx.fillText(
                cv.learnFilter === 'fav' ? '还没有收藏单词，点开详情页的 ⭐ 试试' : '还没有学习记录，先去闯关模式拼出第一个单词吧',
                W / 2, y + 60
            );
            return;
        }

        // 分页不滚动：按剩余高度自适应每页行数，夹在 6~8 行之间
        const rowH = 54, btnAreaH = 56;
        const availH = H - y - btnAreaH - 16;
        const rowsPerPage = Math.max(6, Math.min(8, Math.floor(availH / rowH) || 6));
        const totalPages = Math.max(1, Math.ceil(list.length / rowsPerPage));
        cv.learnPage = Math.max(0, Math.min(cv.learnPage || 0, totalPages - 1));
        const startIdx = cv.learnPage * rowsPerPage;
        const pageItems = list.slice(startIdx, startIdx + rowsPerPage);

        pageItems.forEach((w, i) => {
            const ry = y + i * rowH;
            panel(ctx, x0, ry, cw, rowH - 8, PX.panel);
            const mastery = this.getMasteryInfo(w.en);
            const isFav = this.favorites.some(f => f.en === w.en);
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillStyle = PX.ink; ctx.font = F.mono(16);
            ctx.fillText(w.en, x0 + 14, ry + 18);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(12);
            ctx.fillText(w.cn || '', x0 + 14, ry + 36);
            ctx.textAlign = 'right';
            ctx.fillStyle = PX.ink; ctx.font = F.mono(12);
            ctx.fillText(`${mastery.icon} ${mastery.percent}%`, x0 + cw - 30, ry + 18);
            ctx.font = '16px sans-serif';
            ctx.fillText(isFav ? '⭐' : '☆', x0 + cw - 14, ry + 37);
            const word = w.en;
            cv.hits.push({ x: x0, y: ry, w: cw, h: rowH - 8, action: () => this.showWordDetail(word) });
        });
        y += pageItems.length * rowH + 8;

        // 翻页
        const btnY = H - btnAreaH + 4, btnW = (cw - 10) / 2;
        const prevDisabled = cv.learnPage <= 0, nextDisabled = cv.learnPage >= totalPages - 1;
        [
            ['‹ 上一页', prevDisabled, () => { cv.learnPage--; this._invalidate(); }],
            [`下一页 › (${cv.learnPage + 1}/${totalPages})`, nextDisabled, () => { cv.learnPage++; this._invalidate(); }]
        ].forEach(([label, disabled, action], i) => {
            const bx = x0 + i * (btnW + 10);
            panel(ctx, bx, btnY, btnW, 40, disabled ? PX.panelDim : PX.panel);
            ctx.fillStyle = disabled ? PX.soft : PX.ink; ctx.font = F.cnH(13);
            ctx.textAlign = 'center';
            ctx.fillText(label, bx + btnW / 2, btnY + 21);
            if (!disabled) cv.hits.push({ x: bx, y: btnY, w: btnW, h: 40, action });
        });
    },

    // 单词本行内详情浮层（多按钮：收藏切换 + 关闭）。
    // 与下方 showWordDetail() 走的 cv.modal 单按钮壳是两条路：
    // 通用 cv.modal 机制只支持一个按钮（_canvasHit 弹窗态只认 cv.modalBtnRect），
    // 单词本要「收藏 + 关闭」两个动作，故这里自绘、自管命中区。
    _learnDrawDetailOverlay(ctx, cv) {
        const { PX, F, panel, rr, wrapText, LETTER_COLORS } = this._pxKit();
        const word = cv.learnDetail.word;
        const info = this._learnWordInfo(word);
        ctx.fillStyle = 'rgba(74,59,47,0.45)';
        ctx.fillRect(0, 0, cv.W, cv.H);

        const mw = Math.min(cv.W - 48, 340);
        const innerW = mw - 40;
        ctx.font = F.mono(13);
        const sentLines = info.sentence ? wrapText(ctx, info.sentence, innerW - 10) : [];
        ctx.font = F.cn(12);
        const sentCnLines = info.sentenceCn ? wrapText(ctx, info.sentenceCn, innerW - 10) : [];
        const sentH = (sentLines.length || sentCnLines.length) ? (sentLines.length * 18 + sentCnLines.length * 17 + 20) : 0;
        const mh = 24 + 30 + 24 + 34 + sentH + (sentH ? 12 : 0) + 56;
        const mx = (cv.W - mw) / 2, my = Math.max(20, (cv.H - mh) / 2);
        panel(ctx, mx, my, mw, mh, PX.panel, { r: 6 });

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let y = my + 24 + 12;
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(22);
        ctx.fillText(word, cv.W / 2, y); y += 30;
        ctx.font = F.cn(14);
        ctx.fillText(info.cn || '', cv.W / 2, y); y += 20;

        // 掌握度条
        const barW = mw - 60, barX = (cv.W - barW) / 2, barY = y;
        panel(ctx, barX, barY, barW, 10, PX.panelDim, { shadow: null, r: 3 });
        const fillW = Math.max(0, Math.min(1, info.mastery.percent / 100)) * (barW - 4);
        if (fillW > 1) { ctx.fillStyle = LETTER_COLORS[4]; rr(ctx, barX + 2, barY + 2, fillW, 6, 2); ctx.fill(); }
        ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
        ctx.fillText(`${info.mastery.icon} ${info.mastery.name} · ${info.mastery.percent}%`, cv.W / 2, barY + 24);
        y = barY + 34;

        if (sentH) {
            panel(ctx, mx + 14, y, mw - 28, sentH, PX.panelDim, { shadow: null });
            let sy = y + 12;
            ctx.font = F.mono(13); ctx.fillStyle = PX.ink;
            for (const line of sentLines) { ctx.fillText(line, cv.W / 2, sy); sy += 18; }
            ctx.font = F.cn(12); ctx.fillStyle = PX.soft;
            for (const line of sentCnLines) { ctx.fillText(line, cv.W / 2, sy); sy += 17; }
            y += sentH + 12;
        }

        // 收藏切换 / 关闭
        const btnW = (mw - 28 - 10) / 2, btnH = 42, by = y;
        const favLabel = info.isFav ? '💔 取消收藏' : '⭐ 收藏';
        [
            [favLabel, LETTER_COLORS[2], () => { this._learnToggleFavorite(word); this._invalidate(); }],
            ['关闭', PX.panelDim, () => { cv.learnDetail = null; this._invalidate(); }]
        ].forEach(([label, fill, action], i) => {
            const bx2 = mx + 14 + i * (btnW + 10);
            panel(ctx, bx2, by, btnW, btnH, fill);
            ctx.fillStyle = fill === PX.panelDim ? PX.ink : '#fff'; ctx.font = F.cnH(14);
            ctx.fillText(label, bx2 + btnW / 2, by + btnH / 2 + 1);
            cv.hits.push({ x: bx2, y: by, w: btnW, h: btnH, action });
        });
    },

    // ═══════════ 单词详情：cv.modal 单按钮壳（对局内 ⭐/释义扩展卡入口，签名与 DOM 版一致：无参调用） ═══════════
    // word 为可选扩展：单词本行点击会传入具体单词并走上面的自绘浮层，此分支不会命中；
    // 其余既有调用点（game-shop.js useTool('definition_card') 等）均无参调用，行为与 DOM 版一致地读 this.targetWord。
    showWordDetail(word) {
        const cv = this._cv;
        if (!cv) return;
        if (word) {
            cv.learnDetail = { word };
            this._invalidate();
            this.sound.speak(word);
            return;
        }
        const w = this.targetWord;
        if (!w) return;
        const info = this._learnWordInfo(w);
        cv.modal = {
            icon: '📖',
            title: w,
            text: `${info.cn}\n掌握度：${info.mastery.icon} ${info.mastery.name} · ${info.mastery.percent}%`,
            sentence: info.sentence,
            sentenceCn: info.sentenceCn,
            btn: info.isFav ? '💔 取消收藏' : '⭐ 收藏',
            // 复用 core 的 toggleFavorite()：这条路径必是当前对局 targetWord，与 core 假设一致，直接调用不重复实现
            onBtn: () => { this.toggleFavorite(); this.closeModal(); }
        };
        this.locked = false;
        this._invalidate();
        this.sound.speak(w);
    },

    // renderFavButton 原是 DOM 版局部刷新 favBtn 文案的钩子（参数 isFav 决定文案）；
    // Canvas 每帧都从 this.favorites 现读现画，天然最新，不需要参数，直接请求重绘即可。
    renderFavButton() {
        this._invalidate();
    },

    // ═══════════ 学习报告 ═══════════
    showReport() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = 'report';
        this._invalidate();
    },

    _drawScreen_report(ctx, cv) {
        const { PX, F, panel } = this._pxKit();
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        let y = this._learnHeader(ctx, cv, '📊 学习报告');

        // 统计口径照搬 DOM 版 showReport（renderer-learning.js）
        const uniqueWords = [...new Set(this.learnedWords.map(w => w.en))];
        const playDays = Object.keys(this.playDates).length;
        const dailyDone = Object.keys(this.dailyCompletions).filter(k => this.dailyCompletions[k]).length;
        const streak = this.getLearningStreak();
        const items = [
            ['学习天数', `${playDays} 天`],
            ['连续学习', `${streak} 天`],
            ['已学单词', `${uniqueWords.length} 个`],
            ['累计拼词', `${this.totalCompletedWords} 次`],
            ['今日挑战', `${dailyDone} 次`],
            ['无尽最佳', `${this.bestEndlessWords} 词`]
        ];
        const cols = 3, gap = 10, cardW = (cw - (cols - 1) * gap) / cols, cardH = 60;
        items.forEach(([label, value], i) => {
            const cx = x0 + (i % cols) * (cardW + gap);
            const cy = y + Math.floor(i / cols) * (cardH + gap);
            panel(ctx, cx, cy, cardW, cardH, PX.panel);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = PX.ink; ctx.font = F.mono(18);
            ctx.fillText(value, cx + cardW / 2, cy + 24);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
            ctx.fillText(label, cx + cardW / 2, cy + 44);
        });
        y += Math.ceil(items.length / cols) * (cardH + gap) + 10;

        // 最近学习 / 需要多练：canvas 无滚动，按剩余高度自适应展示条数，超出的用省略提示收尾
        const recent = this.learnedWords.slice(-6).reverse();
        const recentLines = recent.length
            ? recent.map(w => `${w.en}  ${w.cn}`)
            : ['还没有学习记录，先去闯关模式拼出第一个单词吧'];

        const lowMastery = uniqueWords
            .map(word => ({ word, info: this.getMasteryInfo(word) }))
            .filter(item => item.info.score < 5)
            .slice(0, 5);
        const hard = Object.entries(this.failedWords).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const hardLines = (hard.length || lowMastery.length)
            ? [
                ...hard.map(([word, count]) => {
                    const found = this.wordLevels.flat().find(w => w.en === word) || this.learnedWords.find(w => w.en === word);
                    return `${word}  ${found ? found.cn : ''} · 失败${count}次`;
                }),
                ...lowMastery.map(({ word, info }) => `${word}  ${info.icon}${info.name}`)
            ]
            : ['暂时没有明显卡点，保持这个节奏'];

        const lineH = 20, titleH = 24, footerGap = 10;
        const availH = H - y - footerGap;
        const maxLines = Math.max(2, Math.floor((availH / 2 - titleH) / lineH));
        y = this._learnDrawListSection(ctx, x0, y, '最近学习', recentLines, maxLines, lineH, titleH);
        this._learnDrawListSection(ctx, x0, y, '需要多练', hardLines, maxLines, lineH, titleH);
    },

    // 只读文本列表小节：标题 + 最多 maxLines 行，超出显示省略提示（详情去单词本查看）
    _learnDrawListSection(ctx, x0, y, title, lines, maxLines, lineH, titleH) {
        const { PX, F } = this._pxKit();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(14);
        ctx.fillText(title, x0 + 2, y + 10);
        y += titleH;
        const shown = lines.slice(0, maxLines);
        ctx.font = F.cn(12);
        shown.forEach(line => {
            ctx.fillStyle = PX.ink;
            ctx.fillText(line, x0 + 10, y);
            y += lineH;
        });
        if (lines.length > maxLines) {
            ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
            ctx.fillText(`… 共 ${lines.length} 条，去单词本查看`, x0 + 10, y);
            y += lineH;
        }
        return y + 6;
    },

    // ═══════════ 成就（新契约：openAchievements） ═══════════
    openAchievements() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = 'achievements';
        this._invalidate();
    },

    _drawScreen_achievements(ctx, cv) {
        const { PX, F, panel, wrapText } = this._pxKit();
        const W = cv.W;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        let y = this._learnHeader(ctx, cv, '🏆 成就');

        // ACHIEVEMENTS 为 config.js 顶层 const，与 renderer-screens.js 的 renderAchievements() 同一取用方式
        const cols = cw >= 340 ? 3 : 2, gap = 10;
        const cardW = (cw - (cols - 1) * gap) / cols, cardH = 96;
        ACHIEVEMENTS.forEach((ach, i) => {
            const cx = x0 + (i % cols) * (cardW + gap);
            const cy = y + Math.floor(i / cols) * (cardH + gap);
            const unlocked = !!this.achievements[ach.id];
            panel(ctx, cx, cy, cardW, cardH, unlocked ? PX.panel : PX.panelDim);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.globalAlpha = unlocked ? 1 : 0.45;
            ctx.font = '30px sans-serif';
            ctx.fillText(ach.icon, cx + cardW / 2, cy + 28);
            ctx.fillStyle = PX.ink; ctx.font = F.cnH(13);
            ctx.fillText(ach.name, cx + cardW / 2, cy + 56);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(10);
            const descLines = wrapText(ctx, ach.desc, cardW - 12);
            let dy = cy + 72;
            descLines.slice(0, 2).forEach(line => { ctx.fillText(line, cx + cardW / 2, dy); dy += 13; });
            ctx.globalAlpha = 1;
        });
    },

    // ═══════════ 关卡地图（新契约：openLevelMap） ═══════════
    openLevelMap() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = 'levelmap';
        this._invalidate();
    },

    _drawScreen_levelmap(ctx, cv) {
        const { PX, F, panel, LETTER_COLORS } = this._pxKit();
        const W = cv.W;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        let y = this._learnHeader(ctx, cv, '🗺️ 关卡地图');

        const cols = 6, gap = 8;
        const nodeW = (cw - (cols - 1) * gap) / cols;
        for (let i = 1; i <= 26; i++) {
            const idx = i - 1;
            const cx = x0 + (idx % cols) * (nodeW + gap);
            const cy = y + Math.floor(idx / cols) * (nodeW + gap);
            const passed = i < this.level, current = i === this.level;
            const fill = current ? LETTER_COLORS[1] : passed ? LETTER_COLORS[4] : PX.panelDim;
            panel(ctx, cx, cy, nodeW, nodeW, fill, current ? { lw: 3, stroke: PX.ink } : { shadow: passed ? PX.ink : null });
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = (passed || current) ? '#fff' : PX.soft;
            ctx.font = F.mono(Math.max(10, nodeW * 0.4));
            ctx.fillText(String(i), cx + nodeW / 2, cy + nodeW / 2 + 1);
        }
        // 关卡节点本身不可点击跳关：已读 DOM 版 renderLevelMap（renderer-screens.js）确认它也只是纯进度展示、
        // 没有 click 跳关逻辑（style.css 的 .level-node 也无 cursor:pointer），故这里保持只读展示 + 顶部返回，
        // 不新增未经产品评审的交互。
    },

    // ═══════════ 分享图：微信小游戏无 canvas.toDataURL / <a download> 这类 DOM/BOM API， ═══════════
    // 浏览器 Canvas 原型阶段也没有分享需求，先占位说明；微信侧后续应换用 wx.shareAppMessage 之类的原生转发能力实现。
    generateShareImage() {}
});
