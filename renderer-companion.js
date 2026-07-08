// renderer-companion.js — DOM 渲染层（解耦第①步：DOM 代码从逻辑模块收拢至此，行为零变化）
Object.assign(WordMatchGame.prototype, {
    renderCompanionShop(grid) {
        grid.innerHTML = `<div class="companion-help">
            <strong>伙伴养成：</strong>小恐龙默认加入队伍；机甲和公主可使用积分解锁。每购买 1 个伙伴专属道具，或每通关一关（含每日/复习），当前出战伙伴羁绊 +1。羁绊达到 3 点和 8 点时，角色进化、外观升级，专属道具效果也随之增强。
        </div>`;
        COMPANIONS.forEach(companion => {
            const owned = this.unlockedCompanions.includes(companion.id);
            const equipped = this.equippedCompanion === companion.id;
            const item = COMPANION_ITEMS.find(entry => entry.companion === companion.id);
            const count = this.companionInventory[item.id] || 0;
            const growth = this.getCompanionGrowth(companion.id);
            const card = document.createElement('div');
            card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
            let actions = '';
            if (!owned) {
                actions = `<button class="shop-btn buy" onclick="game.buyCompanion('${companion.id}')" ${this.coins >= companion.price ? '' : 'disabled'}>${companion.price}分解锁</button>`;
            } else {
                actions = equipped
                    ? '<button class="shop-btn owned" disabled>已出战</button>'
                    : `<button class="shop-btn equip" onclick="game.equipCompanion('${companion.id}')">设为伙伴</button>`;
                actions += `<button class="shop-btn buy" onclick="game.buyCompanionItem('${item.id}')" ${this.coins >= item.price ? '' : 'disabled'}>${item.icon} ${item.price}分 · 已有${count}</button>`;
            }
            card.innerHTML = `
                ${equipped ? '<div class="equipped-badge">出战中</div>' : ''}
                <div class="companion-card-preview">${this.getCompanionAvatarHTML(companion, growth.level)}</div>
                <div class="shop-name">${companion.name}</div>
                <div class="companion-item-badge">${this.getCompanionEffectText(companion.id, growth.level)}</div>
                <div class="companion-level">${growth.label} · 羁绊 ${growth.points}/${growth.next}</div>
                <div class="companion-growth"><div class="companion-growth-fill" style="width:${growth.percent}%"></div></div>
                ${actions}
            `;
            grid.appendChild(card);
        });
    },

    renderCompanionDock() {
        const dock = document.getElementById('companionDock');
        if (!dock) return;
        const companion = COMPANIONS.find(item => item.id === this.equippedCompanion) || COMPANIONS[0];
        const count = this.companionInventory[companion.item] || 0;
        const growth = this.getCompanionGrowth(companion.id);
        const shield = this.mechaShieldMoves > 0 ? ` · 护盾剩余 ${this.mechaShieldMoves} 步` : '';
        const unlocked = !!this.companionRenameUnlocked[companion.id];
        dock.innerHTML = `
            <div class="companion-stage">
                ${this.getCompanionAvatarHTML(companion, growth.level)}
                <span class="companion-mood" id="companionMood">😊</span>
            </div>
            <div class="companion-copy">
                <div class="companion-name-row">
                    <span class="companion-name">${this._escapeHtml(growth.name)}</span>
                    <button class="companion-rename ${unlocked ? '' : 'locked'}" onclick="game.renameCompanion('${companion.id}')" title="给伙伴改名">✏️</button>
                    <button class="companion-voice" id="companionVoiceBtn" onclick="game.toggleCompanionVoice()" title="${this.companionVoiceOn ? '关闭伙伴语音' : '开启伙伴语音'}">${this.companionVoiceOn ? '🔊' : '🔇'}</button>
                </div>
                <div class="companion-bubble" id="companionBubble"></div>
                <div class="companion-effect">${this.getCompanionEffectText(companion.id, growth.level)}${shield}</div>
                <div class="companion-level">${growth.label} · 羁绊 ${growth.points}/${growth.next}</div>
                <div class="companion-growth"><div class="companion-growth-fill" style="width:${growth.percent}%"></div></div>
            </div>
            <button class="companion-use" onclick="game.useCompanionItem()" ${count <= 0 ? 'disabled' : ''}>${companion.itemName} ×${count}</button>
        `;
        // 注意：这里不再触发台词。dock 每次 updateUI 都会重渲染，若在此朗读，
        // 整关进行中会反复抢占 speech 通道、掐断例句朗读。伙伴台词改为只在每关开始时
        // 由 greetCompanion() 播一次。
    },

    // 平台输入框（解耦第③步：prompt 属于 BOM，从 game-companion.js 提取至此，行为零变化）
    uiPromptCompanionName(cur) {
        return prompt('给伙伴起个名字吧（最多6个字）', cur);
    },

    uiRefreshCompanionShopIfOpen() {
        const shopModal = document.getElementById('shopModal');
        if (shopModal && shopModal.classList.contains('active')) this.renderShop('companion');
    },

    sayCompanionLine(id, scene, soft = false, daysOverride = null, withVoice = false) {
        const bubble = document.getElementById('companionBubble');
        const mood = document.getElementById('companionMood');
        if (!bubble) return;
        if (soft && bubble.classList.contains('show')) return;
        const lines = (COMPANION_LINES[id] || {})[scene];
        if (!lines || !lines.length) return;
        const idx = Math.floor(Math.random() * lines.length);
        const line = lines[idx];
        const growth = this.getCompanionGrowth(id);
        const days = daysOverride != null ? daysOverride : (this.getLearningStreak ? this.getLearningStreak() : 0);
        const safeName = this._escapeHtml(growth.name);
        const en = line.en.replace(/\{name\}/g, safeName).replace(/\{days\}/g, days);
        const zh = line.zh.replace(/\{name\}/g, safeName).replace(/\{days\}/g, days);
        bubble.innerHTML = `<span class="bubble-en">${en}</span><span class="bubble-zh">${zh}</span>`;
        bubble.classList.add('show');
        const moods = { idle:'😊', win:'🤩', evolve:'✨', daily:'🥰', miss:'🥺' };
        if (mood) {
            mood.textContent = moods[scene] || '😊';
            if (!this.reduceMotion) { mood.classList.remove('bounce'); void mood.offsetWidth; mood.classList.add('bounce'); }
        }
        // 仅在「每关开始」这一次才发声（withVoice）。整关进行中绝不朗读伙伴台词，
        // 把 speechSynthesis 通道完整让给例句朗读——否则 speak() 里的 cancel()+speak()
        // 在真实 Chrome 上会有竞态，导致例句被丢弃读不出来（核心学习功能优先）。
        if (withVoice) this.speakCompanionLine(id, line.en.replace(/\{name\}/g, growth.name).replace(/\{days\}/g, days));
        clearTimeout(this._bubbleTimer);
        const dur = (scene === 'evolve' || scene === 'miss') ? 4000 : 2600;
        this._bubbleTimer = setTimeout(() => {
            bubble.classList.remove('show');
            // 注意：这里不再全局 cancel 朗读——伙伴台词是短句会自然播完，
            // 而例句朗读（sound.speak）共用同一个 speechSynthesis 通道，
            // 全局 cancel 会把通关后正在播放的例句拦腰掐断（核心学习内容优先）。
        }, dur);
    },

    showEvolveModal(id, growth) {
        const modal = document.getElementById('evolveModal');
        if (!modal) return;
        const companion = COMPANIONS.find(c => c.id === id) || COMPANIONS[0];
        const hero = document.getElementById('evolveHero');
        const label = document.getElementById('evolveLabel');
        const lineEn = document.getElementById('evolveLineEn');
        const lineZh = document.getElementById('evolveLineZh');
        if (hero) hero.innerHTML = this.getCompanionAvatarHTML(companion, growth.level);
        if (label) label.textContent = `${this._escapeHtml(growth.name)} · ${growth.label}`;
        const lines = (COMPANION_LINES[id] || {}).evolve || [];
        const line = lines.length ? lines[Math.floor(Math.random() * lines.length)] : { en: '', zh: '' };
        const safeName = this._escapeHtml(growth.name);
        if (lineEn) lineEn.textContent = line.en.replace(/\{name\}/g, growth.name);
        if (lineZh) lineZh.textContent = line.zh.replace(/\{name\}/g, growth.name);
        // 进化弹窗优先，挂起后续 win 弹窗/气泡
        modal.classList.add('active');
        this.sound.play('win');
        this.speakCompanionLine(id, line.en.replace(/\{name\}/g, growth.name));
        this.spawnConfetti(modal.querySelector('.modal-content'));
        const btn = document.getElementById('evolveBtn');
        if (btn) btn.onclick = () => {
            modal.classList.remove('active');
            SpeechAdapter.cancelSpeech();
            const cb = this._afterEvolveClose;
            this._afterEvolveClose = null;
            if (cb) cb();
        };
    }
});
