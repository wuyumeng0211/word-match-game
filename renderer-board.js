// renderer-board.js — DOM 渲染层（解耦第①步：DOM 代码从逻辑模块收拢至此，行为零变化）
Object.assign(WordMatchGame.prototype, {
    renderBoard() {
        const el = document.getElementById('gameBoard');
        el.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        el.style.maxWidth = this.boardSize === 7 ? '360px' : '320px';
        const boardSkin = this.equippedBoard;

        const existing = {};
        el.querySelectorAll('.tile').forEach(t => {
            const r = parseInt(t.dataset.r), c = parseInt(t.dataset.c);
            existing[`${r},${c}`] = t;
        });

        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const key = `${r},${c}`;
                const letter = this.board[r][c];
                const cls = 'tile-' + letter.toLowerCase();
                let skinCls = '';
                if (boardSkin === 'crystal_board') skinCls = ' tile-crystal';
                else if (boardSkin === 'pixel_board') skinCls = ' tile-pixel';
                else if (boardSkin === 'metal_board') skinCls = ' tile-metal';
                else if (boardSkin === 'ink_board') skinCls = ' tile-ink';
                const fullClass = `tile ${cls}${skinCls}`;

                let tile = existing[key];
                if (tile) {
                    if (tile.textContent !== letter) tile.textContent = letter;
                    if (tile.className !== fullClass) tile.className = fullClass;
                    this.applyTileColor(tile, letter);
                    delete existing[key];
                } else {
                    tile = document.createElement('div');
                    tile.className = fullClass;
                    tile.textContent = letter;
                    tile.dataset.r = r; tile.dataset.c = c;
                    this.applyTileColor(tile, letter);
                    el.appendChild(tile);
                }
            }
        }

        for (let key in existing) existing[key].remove();
        this.renderTarget();
    },

    renderTarget() {
        const el = document.getElementById('targetWord');
        el.innerHTML = '';
        el.classList.toggle('long-word', this.targetWord.length >= 8);
        const needed = {};
        for (let ch of this.targetWord) needed[ch] = (needed[ch] || 0) + 1;
        const got = {};
        for (let ch of this.targetWord) {
            got[ch] = (got[ch] || 0) + 1;
            const slot = document.createElement('div');
            const have = (this.collectedLetters[ch] || 0) >= got[ch];
            slot.className = `letter-slot ${have ? 'collected' : 'pending'}`;
            slot.textContent = have ? ch : '?';
            slot.dataset.letter = ch;
            slot.dataset.occurrence = got[ch] - 1;
            el.appendChild(slot);
        }
        let total = 0, have = 0;
        for (let ch in needed) { total += needed[ch]; have += Math.min(this.collectedLetters[ch] || 0, needed[ch]); }
        const progress = Math.round(have / total * 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('wordProgressText').textContent = progress + '%';
        document.getElementById('chineseMeaning').textContent = this.targetChinese;
        const mastery = this.getMasteryInfo(this.targetWord);
        const masteryFill = document.getElementById('targetMasteryFill');
        if (masteryFill) masteryFill.style.width = mastery.percent + '%';
        const masteryText = document.getElementById('targetMasteryText');
        if (masteryText) masteryText.textContent = mastery.percent + '%';
        const totalWords = this.targetWords ? this.targetWords.length : 1;
        const current = this.currentWordIndex !== undefined ? this.currentWordIndex + 1 : 1;
        document.getElementById('targetLabel').textContent = `目标单词 (${current}/${totalWords})`;
    },

    // handleClick 的 DOM 部分：选中一枚棋子（加高亮），返回其元素
    uiSelectTile(r, c) {
        const clicked = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        clicked.classList.add('selected');
        return clicked;
    },

    // handleClick 的 DOM 部分：取消选中高亮
    uiDeselectTile(el) {
        el.classList.remove('selected');
    },

    // trySwap 的 DOM 部分：无效交换的抖动反馈，返回换回前的等待 Promise
    uiShakeTiles(r1, c1, r2, c2) {
        const el1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
        const el2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
        if (el1) el1.classList.add('shake');
        if (el2) el2.classList.add('shake');
        setTimeout(() => {
            if (el1) el1.classList.remove('shake');
            if (el2) el2.classList.remove('shake');
        }, 400);
        return new Promise(r => setTimeout(r, 250));
    },

    animateSwap(r1, c1, r2, c2) {
        const el1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
        const el2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
        if (this.reduceMotion || !el1 || !el2) {
            this.swap(r1, c1, r2, c2);
            this.renderBoard();
            return Promise.resolve();
        }
        const a = el1.getBoundingClientRect();
        const b = el2.getBoundingClientRect();
        const dx = b.left - a.left, dy = b.top - a.top;
        // 落到最终态（节点按坐标复用，字母已互换）
        this.swap(r1, c1, r2, c2);
        this.renderBoard();
        const n1 = document.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
        const n2 = document.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
        if (!n1 || !n2) return Promise.resolve();
        // Invert：先把两枚棋子摆回交换前的视觉位置
        n1.style.transition = 'none';
        n2.style.transition = 'none';
        n1.style.zIndex = '5';
        n2.style.zIndex = '5';
        n1.style.transform = `translate(${dx}px, ${dy}px)`;
        n2.style.transform = `translate(${-dx}px, ${-dy}px)`;
        // Play：下一帧滑回真实位置
        return new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                n1.style.transition = 'transform 0.15s ease';
                n2.style.transition = 'transform 0.15s ease';
                n1.style.transform = '';
                n2.style.transform = '';
                setTimeout(() => {
                    [n1, n2].forEach(n => {
                        n.style.transition = '';
                        n.style.zIndex = '';
                    });
                    resolve();
                }, 160);
            }));
        });
    },

    // processMatches 的 DOM 部分：被消除棋子的高亮 + 粒子 + 分数飘字
    uiMatchedTilesFx(matches, pts) {
        for (let m of matches) {
            const t = document.querySelector(`[data-r="${m.r}"][data-c="${m.c}"]`);
            if (t) {
                t.classList.add('matched');
                const rect = t.getBoundingClientRect();
                const containerRect = document.getElementById('boardContainer').getBoundingClientRect();
                this.spawnParticles(rect.left - containerRect.left + rect.width / 2, rect.top - containerRect.top + rect.height / 2, getComputedStyle(t).background);
                this.spawnScorePopup(rect.left - containerRect.left + rect.width / 2, rect.top - containerRect.top, pts / matches.length);
            }
        }
    },

    // processMatches 的 DOM 部分：连击提示 + 棋盘震动
    uiComboIndicator(combo) {
        const el = document.createElement('div');
        el.className = 'combo-indicator';
        el.textContent = `Combo ×${combo}`;
        document.getElementById('gameBoard').appendChild(el);
        setTimeout(() => el.remove(), 800);
        if (!this.reduceMotion) {
            const board = document.getElementById('gameBoard');
            board.classList.remove('combo-shake');
            void board.offsetWidth;
            board.classList.add('combo-shake');
            setTimeout(() => board.classList.remove('combo-shake'), 280);
        }
    },

    // processMatches 的 DOM 部分：补位棋子下落动画
    uiTilesFalling() {
        document.querySelectorAll('.tile').forEach(t => t.classList.add('falling'));
    },

    flyLetterToTarget(r, c, letter, occurrence) {
        if (this.reduceMotion) return;
        const tile = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        const slot = document.querySelector(`.letter-slot[data-letter="${letter}"][data-occurrence="${occurrence}"]`);
        if (!tile || !slot) return;
        const tileRect = tile.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        const flyer = document.createElement('div');
        flyer.className = 'letter-fly';
        flyer.textContent = letter;
        flyer.style.left = tileRect.left + 'px';
        flyer.style.top = tileRect.top + 'px';
        flyer.style.width = tileRect.width + 'px';
        flyer.style.height = tileRect.height + 'px';
        flyer.style.background = getComputedStyle(tile).background;
        flyer.style.color = getComputedStyle(tile).color;
        flyer.style.border = getComputedStyle(tile).border;
        flyer.style.setProperty('--fly-x', (slotRect.left + slotRect.width / 2 - tileRect.left - tileRect.width / 2) + 'px');
        flyer.style.setProperty('--fly-y', (slotRect.top + slotRect.height / 2 - tileRect.top - tileRect.height / 2) + 'px');
        document.body.appendChild(flyer);
        setTimeout(() => {
            flyer.remove();
            const arrivedSlot = document.querySelector(`.letter-slot[data-letter="${letter}"][data-occurrence="${occurrence}"]`);
            if (!arrivedSlot) return;
            arrivedSlot.classList.add('arriving');
            setTimeout(() => arrivedSlot.classList.remove('arriving'), 450);
        }, 550);
    },

    // shuffleBoard 的 DOM 部分：清除炸弹瞄准态（光标 + 高亮）
    uiClearBombTargets() {
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
    },

    // showHint 的 DOM 部分：给可交换的两枚棋子加提示高亮
    uiShowHint(move) {
        const t1 = document.querySelector(`[data-r="${move.r1}"][data-c="${move.c1}"]`);
        const t2 = document.querySelector(`[data-r="${move.r2}"][data-c="${move.c2}"]`);
        if (t1 && t2) { t1.classList.add('hint'); t2.classList.add('hint'); }
    },

    clearHint() {
        document.querySelectorAll('.tile.hint').forEach(t => t.classList.remove('hint'));
    },

    updateHintButton() {
        const btn = document.getElementById('hintBtn');
        if (this.hintCooldown > 0) {
            btn.disabled = true;
            btn.innerHTML = `💡 提示 <span style="font-size:11px;display:block">${this.hintCooldown}s</span>`;
        } else {
            btn.disabled = false;
            btn.innerHTML = '💡 提示';
        }
    }
});
