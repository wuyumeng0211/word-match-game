// 商店与道具：主题皮肤、学习道具、炸弹
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

    getShopPreviewHTML(item) {
        const sampleColors = ['#005ab5','#009e73','#d81b60','#ff7f00','#7055c7','#00838f'];
        const letters = ['A','B','C','A','C','B'];
        let tileClass = '';
        if (item.id === 'pixel_board') tileClass = ' pixel';
        else if (item.id === 'metal_board') tileClass = ' metal';
        else if (item.id === 'ink_board') tileClass = ' ink';
        else if (item.id === 'crystal_board') tileClass = ' crystal';
        const miniTiles = letters.map((letter, index) =>
            `<span class="shop-mini-tile${tileClass}" style="background:${sampleColors[index]}">${letter}</span>`
        ).join('');
        const boardBg = item.colors?.board || item.preview;
        return `<div class="shop-preview" style="background:${item.preview}">
            <div class="shop-mini-board" style="background:${boardBg}">${miniTiles}</div>
        </div>`;
    },

    buyTool(id) {
        const item = SHOP_ITEMS.find(i => i.id === id && i.type === 'tool');
        if (!item) return;
        if (this.coins < item.price) {
            this.showToast('积分不足!');
            return;
        }
        this.coins -= item.price;
        if (id === 'review_boost') {
            this.reviewBoostActive = true;
            this.showToast('📚 下一次复习奖励已加倍');
        } else {
            this.toolInventory[id] = (this.toolInventory[id] || 0) + 1;
            this.showToast(`🎒 获得道具：${item.name}`);
        }
        this.saveGlobal();
        this.renderShop('tool');
        this.updateToolUI();
        this.updateUI();
    },

    buySkin(id) {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item || this.unlockedSkins.includes(id)) return;
        if (this.coins < item.price) {
            this.showToast('积分不足!');
            return;
        }
        this.coins -= item.price;
        this.unlockedSkins.push(id);
        this.equipSkin(id);
        this.showToast(`✨ 解锁: ${item.name}`);
        this.saveGlobal();
        this.renderShop(item.type);
    },

    equipSkin(id) {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item || !this.unlockedSkins.includes(id)) return;
        const key = 'equipped' + item.type.charAt(0).toUpperCase() + item.type.slice(1);
        this[key] = id;
        this.applyEquippedTheme();
        this.updateEquipBar();
        this.saveGlobal();
        this.renderShop(item.type);
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

    checkBombReward() {
        while (this.coins >= this.nextBombAt) {
            this.bombs++;
            this.nextBombAt += 8000;
            this.showToast(`💣 获得字母炸弹! (当前 ${this.bombs} 个)`);
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

    consumeTool(id) {
        if ((this.toolInventory[id] || 0) <= 0) {
            this.showToast('这个道具还没有库存，可以去商店兑换');
            return false;
        }
        this.toolInventory[id]--;
        this.saveGlobal();
        this.updateToolUI();
        return true;
    },

    useTool(id) {
        this.unlockAudio();
        if (this.isProcessing) return;
        if (id === 'first_hint') {
            if (!this.consumeTool(id)) return;
            const next = this.getNextNeededLetter();
            if (!next) { this.showToast('这个单词已经快完成了'); return; }
            document.querySelectorAll('.tile').forEach(t => {
                if (t.textContent === next) t.classList.add('hint');
            });
            this.showToast(`🔤 优先收集字母 ${next}`);
            setTimeout(() => this.clearHint(), 3000);
        } else if (id === 'definition_card') {
            if (!this.consumeTool(id)) return;
            this.showWordDetail();
        } else if (id === 'sentence_card') {
            if (!this.consumeTool(id)) return;
            this.showToast(`${this.targetSentence} / ${this.targetSentenceCn || this.targetChinese}`);
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        }
    },

    activateBomb() {
        this.resetAutoHint();
        this.unlockAudio();
        if (this.bombs <= 0 || this.bombMode || this.isProcessing) return;
        this.levelBombsUsed++;
        this.bombMode = true;
        this.bombSelected = [];
        const remain = this.nextBombAt - this.coins;
        const hint = remain > 0 ? `(再得 ${remain} 分兑换下一颗)` : '';
        this.showToast(`💣 炸弹模式：点击棋盘上的3个字母进行消除 ${hint}`);
        document.getElementById('gameBoard').style.cursor = 'crosshair';
    },

    async handleBombClick(r, c) {
        this.resetAutoHint();
        const idx = this.bombSelected.findIndex(t => t.r === r && t.c === c);
        const tileEl = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (idx >= 0) {
            this.bombSelected.splice(idx, 1);
            if (tileEl) tileEl.classList.remove('bomb-target');
            return;
        }
        this.bombSelected.push({ r, c });
        if (tileEl) tileEl.classList.add('bomb-target');
        if (this.bombSelected.length >= 3) {
            this.bombMode = false;
            this.bombs--;
            document.getElementById('gameBoard').style.cursor = '';
            this.updateUI();
            const matches = this.bombSelected.map(t => ({ r: t.r, c: t.c, letter: this.board[t.r][t.c] }));
            this.bombSelected = [];
            document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
            this.isProcessing = true;
            await this.processMatches(matches);
            this.isProcessing = false;
            this.checkWin();
        }
    },

    useRetryCard() {
        if (!this.consumeTool('retry_card')) return;
        this.closeModal();
        this.moves = Math.max(this.moves, Math.ceil(this.targetWord.length * 2 + 8));
        this.generateBoard();
        this.renderBoard();
        this.updateUI();
        this.showToast('🧯 已复活：当前单词进度保留');
    }
});
