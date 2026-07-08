// 商店与道具：主题皮肤、学习道具、炸弹
Object.assign(WordMatchGame.prototype, {
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

    checkBombReward() {
        while (this.coins >= this.nextBombAt) {
            this.bombs++;
            this.nextBombAt += 8000;
            this.showToast(`💣 获得字母炸弹! (当前 ${this.bombs} 个)`);
        }
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
            this.uiHighlightHintLetter(next);
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
        this.uiSetBoardCursor('crosshair');
    },

    async handleBombClick(r, c) {
        this.resetAutoHint();
        const idx = this.bombSelected.findIndex(t => t.r === r && t.c === c);
        if (idx >= 0) {
            this.bombSelected.splice(idx, 1);
            this.uiToggleBombTarget(r, c, false);
            return;
        }
        this.bombSelected.push({ r, c });
        this.uiToggleBombTarget(r, c, true);
        if (this.bombSelected.length >= 3) {
            this.bombMode = false;
            this.bombs--;
            this.uiSetBoardCursor('');
            this.updateUI();
            const matches = this.bombSelected.map(t => ({ r: t.r, c: t.c, letter: this.board[t.r][t.c] }));
            this.bombSelected = [];
            this.uiClearBombTargets();
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
