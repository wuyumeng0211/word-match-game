// renderer-canvas-shop.js — Canvas 渲染层子模块：外观商店（主题/棋盘/特效/边框/伙伴/道具）
// 约定：必须在 renderer-canvas.js 之后加载（覆盖其 no-op 兜底）；
// tokens/helpers 经 this._pxKit() 取用（PX/F/panel/rr/wrapText/LETTER_COLORS）；
// 整屏用 _drawScreen_<名字> 注册 + cv.screen 切换；游戏屏内追加用 _drawGameExtras。
// 数据只读 config.js 的 SHOP_ITEMS/COMPANIONS/COMPANION_ITEMS，状态改写全部走 game-shop.js /
// game-companion.js 现成的 core 方法（buySkin/equipSkin/buyTool/buyCompanion/equipCompanion/
// buyCompanionItem），本文件不自行修改 coins/unlockedSkins 等状态字段。
// 列表无滚动，按页翻（PAGE_SIZE 条/页 + 上一页/下一页按钮），cv.shopPage 随 tab 切换重置。
Object.assign(WordMatchGame.prototype, {

    // ═══════════ 入口：开关商店 ═══════════
    openShop() {
        const cv = this._cv;
        if (!cv) return;
        // 记住来路（当前只有菜单会打开商店，但预留从其它整屏进入的可能），关店时回去
        if (cv.screen !== 'shop') cv.shopFrom = cv.screen;
        cv.screen = 'shop';
        cv.shopTab = cv.shopTab || 'theme';
        cv.shopPage = 0;
        this._invalidate();
    },

    closeShop() {
        const cv = this._cv;
        if (!cv) return;
        cv.screen = cv.shopFrom || 'menu';
        cv.shopFrom = null;
        this._invalidate();
    },

    switchShopTab(tab) {
        const cv = this._cv;
        if (!cv) return;
        cv.shopTab = tab;
        cv.shopPage = 0;  // 换 tab 从第一页看起，避免翻到后页看到不相关列表的空白
        this._invalidate();
    },

    // DOM 版这三个方法负责重新拿数据刷 innerHTML；Canvas 版每帧都从 state 重画整屏，
    // 所以「刷新」在这里等价于「请求下一帧重绘」，不需要局部 DOM 操作
    renderShop() { this._invalidate(); },
    updateEquipBar() { this._invalidate(); },
    uiRefreshCompanionShopIfOpen() { this._invalidate(); },

    // Canvas 版视觉是写死的暖纸像素体系（design tokens 见 renderer-canvas.js 头部），
    // 多主题实时切换会破坏这套像素语言，与美术方向冲突。主题购买/装备的数据层
    // （coins/unlockedSkins/equippedTheme）仍照常生效，只是视觉表现留给后续美术 PR 接入。
    applyEquippedTheme() {},

    // ═══════════ 整屏：商店 ═══════════
    _drawScreen_shop(ctx, cv) {
        const { PX, F, panel } = this._pxKit();
        const W = cv.W, H = cv.H;
        const cw = Math.min(W - 24, 420), x0 = (W - cw) / 2;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // ── 顶部：金币余额 + 关闭按钮（y 10-54）──
        let y = 10;
        const closeW = 44, closeH = 44;
        panel(ctx, x0, y, cw - closeW - 8, closeH, PX.panel);
        ctx.textAlign = 'left';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(16);
        ctx.fillText(`金币 ${this.coins}`, x0 + 16, y + closeH / 2 + 1);
        panel(ctx, x0 + cw - closeW, y, closeW, closeH, PX.panel);
        ctx.textAlign = 'center';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(20);
        ctx.fillText('×', x0 + cw - closeW / 2, y + closeH / 2 + 1);
        cv.hits.push({ x: x0 + cw - closeW, y, w: closeW, h: closeH, action: () => this.closeShop() });
        y += closeH + 10;

        // ── tab 栏：外观四类 + 伙伴 + 道具（y 64-98，照搬 DOM 版 switchShopTab 的划分）──
        const tabs = [
            ['theme', '主题'], ['board', '棋盘'], ['effect', '特效'],
            ['frame', '边框'], ['companion', '伙伴'], ['tool', '道具']
        ];
        const tabH = 34, tabW = cw / tabs.length;
        const curTab = cv.shopTab || 'theme';
        tabs.forEach(([id, label], i) => {
            const tx = x0 + i * tabW;
            const active = curTab === id;
            panel(ctx, tx + 2, y, tabW - 4, tabH, active ? PX.ink : PX.panel, active ? { shadow: null } : {});
            ctx.fillStyle = active ? '#fff' : PX.ink; ctx.font = F.cn(12);
            ctx.fillText(label, tx + tabW / 2, y + tabH / 2 + 1);
            cv.hits.push({ x: tx, y, w: tabW, h: tabH, action: () => this.switchShopTab(id) });
        });
        y += tabH + 10;

        // ── 商品列表（分页，不滚动）：占满中段，底部留出翻页条 ──
        const footerH = 44;
        const listTop = y, listH = H - footerH - 10 - listTop;
        const totalPages = curTab === 'companion'
            ? this._shopDrawCompanionTab(ctx, cv, x0, listTop, cw, listH)
            : this._shopDrawItemTab(ctx, cv, curTab, x0, listTop, cw, listH);

        // ── 翻页条（y 底部 footerH）──
        this._shopDrawPagination(ctx, cv, x0, H - footerH, cw, footerH - 10, totalPages);
    },

    // ═══════════ 外观/道具 tab：主题/棋盘/特效/边框/道具（SHOP_ITEMS 按 type 过滤）═══════════
    _shopDrawItemTab(ctx, cv, type, x, top, w, listH) {
        const PAGE_SIZE = 5;
        const items = SHOP_ITEMS.filter(i => i.type === type);
        const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
        cv.shopPage = Math.min(cv.shopPage || 0, totalPages - 1);
        const page = cv.shopPage;
        const pageItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
        const gap = 8;
        const itemH = (listH - (PAGE_SIZE - 1) * gap) / PAGE_SIZE;
        let iy = top;
        for (const item of pageItems) {
            this._shopDrawItemCard(ctx, cv, item, type, x, iy, w, itemH);
            iy += itemH + gap;
        }
        return totalPages;
    },

    _shopDrawItemCard(ctx, cv, item, type, x, y, w, h) {
        const { PX, F, panel, rr, LETTER_COLORS } = this._pxKit();
        const isTool = type === 'tool';
        const owned = isTool ? false : this.unlockedSkins.includes(item.id);
        const equippedKey = 'equipped' + type.charAt(0).toUpperCase() + type.slice(1);
        const equipped = !isTool && this[equippedKey] === item.id;
        const count = isTool ? (this.toolInventory[item.id] || 0) : 0;
        const afford = this.coins >= item.price;

        panel(ctx, x, y, w, h, PX.panel, equipped ? { stroke: LETTER_COLORS[5], lw: 3 } : {});

        // 预览色块：SHOP_ITEMS.preview 多是 CSS 渐变字符串，Canvas 不能直接吃 CSS gradient，
        // 这里提取其中的十六进制色标手搓一个近似渐变，纯色项（道具/边框）天然只取到一个色标
        const sw = Math.min(h - 20, 56);
        const sx = x + 12, sy = y + (h - sw) / 2;
        ctx.fillStyle = this._shopPreviewFill(ctx, sx, sy, sw, sw, item.preview);
        rr(ctx, sx, sy, sw, sw, 6); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = PX.ink; rr(ctx, sx, sy, sw, sw, 6); ctx.stroke();

        // 按钮先量出宽度，文字区域据此收窄，避免长名称/描述压到按钮
        const btnW = 92, btnH = 40;
        const bx = x + w - btnW - 10;
        const tx = sx + sw + 12;
        const textMaxW = bx - 10 - tx;

        ctx.textAlign = 'left';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(15);
        ctx.fillText(item.name, tx, y + 22, textMaxW);
        if (item.desc) {
            ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
            ctx.fillText(item.desc, tx, y + 40, textMaxW);
        }
        let statusText, statusColor;
        if (equipped) { statusText = '已装备'; statusColor = LETTER_COLORS[5]; }
        else if (owned) { statusText = '已拥有 · 可装备'; statusColor = PX.soft; }
        else if (isTool) { statusText = (afford ? '可购买' : '金币不足') + ` · 已有${count}`; statusColor = afford ? LETTER_COLORS[4] : LETTER_COLORS[0]; }
        else { statusText = afford ? '可购买' : '金币不足'; statusColor = afford ? LETTER_COLORS[4] : LETTER_COLORS[0]; }
        ctx.fillStyle = statusColor; ctx.font = F.cn(11);
        ctx.fillText(statusText, tx, y + h - 14, textMaxW);

        // 操作按钮：道具永远是「购买」；外观类按 未拥有→购买(购买后 core 自动装备) /
        // 已拥有未装备→装备 / 已装备→禁用 三态，状态与按钮动作完全对照 game-shop.js
        let btnLabel, action = null, disabled = false;
        if (isTool) {
            btnLabel = item.price + '分';
            action = () => this.buyTool(item.id);
        } else if (equipped) {
            btnLabel = '已装备'; disabled = true;
        } else if (owned) {
            btnLabel = '装备';
            action = () => this.equipSkin(item.id);
        } else {
            btnLabel = item.price === 0 ? '免费' : item.price + '分';
            action = () => this.buySkin(item.id);
        }
        panel(ctx, bx, y + (h - btnH) / 2, btnW, btnH, disabled ? PX.panelDim : LETTER_COLORS[3], disabled ? { shadow: null } : {});
        ctx.textAlign = 'center';
        ctx.fillStyle = disabled ? PX.soft : '#fff'; ctx.font = F.cnH(13);
        ctx.fillText(btnLabel, bx + btnW / 2, y + h / 2 + 1);
        // 金币不足时也保留点击：core 的 buySkin/buyTool 会自己校验并弹 showToast('积分不足!')，
        // 这里不重复造一套校验逻辑，只负责把状态色显示出来提醒用户
        if (!disabled) cv.hits.push({ x: bx, y: y + (h - btnH) / 2, w: btnW, h: btnH, action });
    },

    // CSS 渐变字符串 → Canvas 近似填充：抽取十六进制色标做线性渐变，退化到纯色/兜底色
    _shopPreviewFill(ctx, x, y, w, h, previewStr) {
        const { PX } = this._pxKit();
        const hexes = String(previewStr || '').match(/#[0-9a-fA-F]{3,8}/g) || [];
        if (hexes.length === 0) return PX.soft;
        if (hexes.length === 1) return hexes[0];
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        hexes.forEach((hex, i) => grad.addColorStop(i / (hexes.length - 1), hex));
        return grad;
    },

    // ═══════════ 伙伴 tab：COMPANIONS + 每个伙伴的补给道具（COMPANION_ITEMS）═══════════
    _shopDrawCompanionTab(ctx, cv, x, top, w, listH) {
        const PAGE_SIZE = 3;  // 目前只有 3 个伙伴，天然一页装完，分页机制仍保留以便后续加角色
        const totalPages = Math.max(1, Math.ceil(COMPANIONS.length / PAGE_SIZE));
        cv.shopPage = Math.min(cv.shopPage || 0, totalPages - 1);
        const page = cv.shopPage;
        const pageItems = COMPANIONS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
        const gap = 10;
        const itemH = (listH - (PAGE_SIZE - 1) * gap) / PAGE_SIZE;
        let iy = top;
        for (const comp of pageItems) {
            this._shopDrawCompanionCard(ctx, cv, comp, x, iy, w, itemH);
            iy += itemH + gap;
        }
        return totalPages;
    },

    _shopDrawCompanionCard(ctx, cv, comp, x, y, w, h) {
        const { PX, F, panel, rr, LETTER_COLORS } = this._pxKit();
        const owned = this.unlockedCompanions.includes(comp.id);
        const equipped = this.equippedCompanion === comp.id;
        panel(ctx, x, y, w, h, PX.panel, equipped ? { stroke: LETTER_COLORS[5], lw: 3 } : {});

        // 头像：不加载 png（伙伴屏同事的事），用色块 + 名字首字代替
        const avSize = Math.min(h - 20, 64);
        const ax = x + 12, ay = y + (h - avSize) / 2;
        const name = this.getCompanionName(comp.id) || comp.name;
        ctx.fillStyle = LETTER_COLORS[comp.id.charCodeAt(0) % LETTER_COLORS.length];
        rr(ctx, ax, ay, avSize, avSize, 6); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = PX.ink; rr(ctx, ax, ay, avSize, avSize, 6); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = F.cnH(Math.round(avSize * 0.4));
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(name.slice(0, 1), ax + avSize / 2, ay + avSize / 2 + 1);

        const btnW = 100, btnH = 32;
        const bx = x + w - btnW - 10;
        const tx = ax + avSize + 12;
        const textMaxW = bx - 10 - tx;
        ctx.textAlign = 'left';
        ctx.fillStyle = PX.ink; ctx.font = F.cnH(15);
        ctx.fillText(comp.name, tx, y + 22, textMaxW);

        if (owned) {
            const growth = this.getCompanionGrowth(comp.id);
            ctx.fillStyle = PX.soft; ctx.font = F.cn(11);
            ctx.fillText(`${growth.label} · 羁绊 ${growth.points}/${growth.next}`, tx, y + 40, textMaxW);
            const barW = Math.min(140, textMaxW), barH = 6, barY = y + 50;
            panel(ctx, tx, barY, barW, barH, PX.panelDim, { shadow: null, r: 2 });
            ctx.fillStyle = LETTER_COLORS[4];
            rr(ctx, tx + 2, barY + 2, Math.max(0, (barW - 4) * growth.percent / 100), barH - 4, 1); ctx.fill();
        } else {
            const afford = this.coins >= comp.price;
            ctx.fillStyle = afford ? LETTER_COLORS[4] : LETTER_COLORS[0]; ctx.font = F.cn(11);
            ctx.fillText(afford ? '可解锁' : '金币不足', tx, y + 40, textMaxW);
        }

        ctx.textAlign = 'center';
        if (!owned) {
            // 未拥有：只有解锁按钮，竖直居中
            const by = y + (h - btnH) / 2;
            panel(ctx, bx, by, btnW, btnH, LETTER_COLORS[3]);
            ctx.fillStyle = '#fff'; ctx.font = F.cnH(13);
            ctx.fillText(comp.price + '分解锁', bx + btnW / 2, by + btnH / 2 + 1);
            cv.hits.push({ x: bx, y: by, w: btnW, h: btnH, action: () => this.buyCompanion(comp.id) });
        } else {
            // 已拥有：上方「出战/设为伙伴」+ 下方「购买补给道具」两个按钮
            const b1y = y + 10;
            if (equipped) {
                panel(ctx, bx, b1y, btnW, btnH, PX.panelDim, { shadow: null });
                ctx.fillStyle = PX.soft; ctx.font = F.cnH(13);
                ctx.fillText('出战中', bx + btnW / 2, b1y + btnH / 2 + 1);
            } else {
                panel(ctx, bx, b1y, btnW, btnH, PX.panel);
                ctx.fillStyle = PX.ink; ctx.font = F.cnH(13);
                ctx.fillText('设为伙伴', bx + btnW / 2, b1y + btnH / 2 + 1);
                cv.hits.push({ x: bx, y: b1y, w: btnW, h: btnH, action: () => this.equipCompanion(comp.id) });
            }
            const item = COMPANION_ITEMS.find(it => it.companion === comp.id);
            if (item) {
                const count = this.companionInventory[item.id] || 0;
                const b2y = y + h - btnH - 10;
                panel(ctx, bx, b2y, btnW, btnH, PX.panel);
                ctx.fillStyle = PX.ink; ctx.font = F.cn(11);
                ctx.fillText(`${item.icon} ${item.price}分·有${count}`, bx + btnW / 2, b2y + btnH / 2 + 1);
                cv.hits.push({ x: bx, y: b2y, w: btnW, h: btnH, action: () => this.buyCompanionItem(item.id) });
            }
        }
    },

    // ═══════════ 翻页条：上一页 / 页码 / 下一页（Canvas 无滚动条，商品分页浏览）═══════════
    _shopDrawPagination(ctx, cv, x, y, w, h, totalPages) {
        const { PX, F, panel } = this._pxKit();
        const page = cv.shopPage || 0;
        const btnW = 90;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const prevDisabled = page <= 0;
        panel(ctx, x, y, btnW, h, prevDisabled ? PX.panelDim : PX.panel);
        ctx.fillStyle = prevDisabled ? PX.soft : PX.ink; ctx.font = F.cnH(13);
        ctx.fillText('‹ 上一页', x + btnW / 2, y + h / 2 + 1);
        if (!prevDisabled) cv.hits.push({ x, y, w: btnW, h, action: () => { cv.shopPage = page - 1; this._invalidate(); } });

        const nextDisabled = page >= totalPages - 1;
        const nx = x + w - btnW;
        panel(ctx, nx, y, btnW, h, nextDisabled ? PX.panelDim : PX.panel);
        ctx.fillStyle = nextDisabled ? PX.soft : PX.ink; ctx.font = F.cnH(13);
        ctx.fillText('下一页 ›', nx + btnW / 2, y + h / 2 + 1);
        if (!nextDisabled) cv.hits.push({ x: nx, y, w: btnW, h, action: () => { cv.shopPage = page + 1; this._invalidate(); } });

        ctx.fillStyle = PX.soft; ctx.font = F.cn(12);
        ctx.fillText(`${page + 1}/${totalPages}`, x + w / 2, y + h / 2 + 1);
    }
});
