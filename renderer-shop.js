// renderer-shop.js — DOM 渲染层（解耦第①步：DOM 代码从逻辑模块收拢至此，行为零变化）
Object.assign(WordMatchGame.prototype, {
    openShop() {
        document.getElementById('shopModal').classList.add('active');
        this.renderShop('theme');
    },

    closeShop() {
        document.getElementById('shopModal').classList.remove('active');
    },

    switchShopTab(type, event) {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');
        this.renderShop(type);
    },

    renderShop(type) {
        const grid = document.getElementById('shopGrid');
        const scoreEl = document.getElementById('shopScore');
        if (!grid) return;
        grid.innerHTML = '';
        scoreEl.textContent = `当前积分: ${this.coins}`;
        if (type === 'companion') {
            this.renderCompanionShop(grid);
            return;
        }
        const items = SHOP_ITEMS.filter(i => i.type === type);
        items.forEach(item => {
            const isTool = type === 'tool';
            const owned = isTool ? false : this.unlockedSkins.includes(item.id);
            const equipped = !isTool && this[`equipped${type.charAt(0).toUpperCase() + type.slice(1)}`] === item.id;
            const count = this.toolInventory[item.id] || 0;
            const card = document.createElement('div');
            card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
            let btnHtml = '';
            if (isTool) {
                const canBuy = this.coins >= item.price;
                btnHtml = `<button class="shop-btn buy" onclick="game.buyTool('${item.id}')" ${canBuy ? '' : 'disabled'}>${item.price}分 · 已有${count}</button>`;
            } else if (equipped) {
                btnHtml = `<button class="shop-btn owned" disabled>已装备</button>`;
            } else if (owned) {
                btnHtml = `<button class="shop-btn equip" onclick="game.equipSkin('${item.id}')">装备</button>`;
            } else {
                const canBuy = this.coins >= item.price;
                btnHtml = `<button class="shop-btn buy" onclick="game.buySkin('${item.id}')" ${canBuy ? '' : 'disabled'}>${item.price === 0 ? '免费' : item.price + '分'}</button>`;
            }
            card.innerHTML = `
                ${equipped ? '<div class="equipped-badge">已装备</div>' : ''}
                ${this.getShopPreviewHTML(item)}
                <div class="shop-name">${item.name}</div>
                ${item.desc ? `<div class="shop-desc">${item.desc}</div>` : ''}
                ${btnHtml}
            `;
            grid.appendChild(card);
        });
    },

    updateEquipBar() {
        const bar = document.getElementById('equipBar');
        if (!bar) return;
        const t = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        const b = SHOP_ITEMS.find(i => i.id === this.equippedBoard);
        const e = SHOP_ITEMS.find(i => i.id === this.equippedEffect);
        const f = SHOP_ITEMS.find(i => i.id === this.equippedFrame);
        const c = COMPANIONS.find(i => i.id === this.equippedCompanion);
        bar.innerHTML = `
            <span class="equip-tag">🎨 ${t ? t.name : '默认'}</span>
            <span class="equip-tag">🔲 ${b ? b.name : '默认'}</span>
            <span class="equip-tag">✨ ${e ? e.name : '默认'}</span>
            <span class="equip-tag">🏅 ${f ? f.name : '无'}</span>
            <span class="equip-tag">🎮 ${c ? c.name : '伙伴'}</span>
        `;
    },

    applyEquippedTheme() {
        // 在关卡内切换装备时，统一走 applyTheme 的优先级逻辑（商店主题 > 关卡主题），并同步 body 背景
        if (document.body.classList.contains('in-game')) {
            this.applyTheme();
            return;
        }
        // 主菜单：只更新主题变量做预览，不染 body（菜单保持默认米色）
        const item = SHOP_ITEMS.find(i => i.id === this.equippedTheme);
        if (item && item.colors) {
            const root = document.documentElement;
            root.style.setProperty('--theme-bg', item.colors.bg);
            root.style.setProperty('--theme-primary', item.colors.primary);
            root.style.setProperty('--theme-target-bg', item.colors.targetBg);
            root.style.setProperty('--theme-target-border', item.colors.targetBorder);
            root.style.setProperty('--theme-select', item.colors.select);
            root.style.setProperty('--theme-board', item.colors.board);
        }
    },

    updateBombUI() {
        const bombBtn = document.getElementById('bombBtn');
        const bombCount = document.getElementById('bombCount');
        if (bombCount) bombCount.textContent = this.bombs;
        if (bombBtn) {
            bombBtn.disabled = this.bombs <= 0 || this.bombMode || this.isProcessing;
            const remain = this.nextBombAt - this.coins;
            bombBtn.title = remain > 0 ? `再得 ${remain} 分兑换下一颗炸弹` : '已有炸弹可用';
        }
    },

    updateToolUI() {
        const map = {
            first_hint: 'toolFirstHint',
            definition_card: 'toolDefinition',
            sentence_card: 'toolSentence'
        };
        Object.entries(map).forEach(([tool, id]) => {
            const el = document.getElementById(id);
            const btn = document.querySelector(`[data-tool="${tool}"]`);
            const count = this.toolInventory[tool] || 0;
            if (el) el.textContent = count;
            if (btn) btn.disabled = count <= 0 || this.isProcessing;
        });
    },

    uiHighlightHintLetter(letter) {
        document.querySelectorAll('.tile').forEach(t => {
            if (t.textContent === letter) t.classList.add('hint');
        });
    },

    uiSetBoardCursor(cursor) {
        document.getElementById('gameBoard').style.cursor = cursor;
    },

    uiToggleBombTarget(r, c, selected) {
        const tileEl = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (tileEl) tileEl.classList.toggle('bomb-target', selected);
    },

    uiClearBombTargets() {
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
    }
});
