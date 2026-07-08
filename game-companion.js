// 陪伴角色系统：购买/装备/羁绊/进化/台词/语音
Object.assign(WordMatchGame.prototype, {
    companionLoginGreet() {
        const id = this.equippedCompanion;
        if (!id) return;
        const today = this.getDateKey();
        if (this.lastCompanionGreetDate === today) return;
        const gap = this.getDaysSinceLastPlay();
        // 含今天口径：登录早于 markPlayDay，今天还没记录，需把今天算进连续天数
        const streak = this.getStreakIncludingToday();
        let scene = null;
        if (gap > 1) scene = 'miss';
        else if (streak >= 2) scene = 'daily';
        if (scene) {
            this.lastCompanionGreetDate = today;
            this.saveGlobal();
            // daily 显示的连续天数须与触发口径一致（含今天），故显式传入
            const daysOverride = scene === 'daily' ? streak : null;
            setTimeout(() => this.sayCompanionLine(id, scene, false, daysOverride, true), 600);
        }
    },

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

    buyCompanion(id) {
        const companion = COMPANIONS.find(item => item.id === id);
        if (!companion || this.unlockedCompanions.includes(id)) return;
        if (this.coins < companion.price) return this.showToast('积分不足!');
        this.coins -= companion.price;
        this.unlockedCompanions.push(id);
        this.equipCompanion(id);
        this.showToast(`🎮 新伙伴加入：${companion.name}`);
        this.saveGlobal();
        this.renderShop('companion');
    },

    equipCompanion(id) {
        if (!this.unlockedCompanions.includes(id)) return;
        this.equippedCompanion = id;
        this.renderCompanionDock();
        this.saveGlobal();
        this.renderShop('companion');
    },

    buyCompanionItem(id) {
        const item = COMPANION_ITEMS.find(entry => entry.id === id);
        if (!item || !this.unlockedCompanions.includes(item.companion)) return;
        if (this.coins < item.price) return this.showToast('积分不足!');
        this.coins -= item.price;
        this.companionInventory[id] = (this.companionInventory[id] || 0) + 1;
        this.showToast(`🎒 获得 ${item.name}`);
        this.gainCompanionBond(item.companion, 1);
        this.renderCompanionDock();
        this.saveGlobal();
        this.renderShop('companion');
        this.updateUI();
    },

    useCompanionItem() {
        const companion = COMPANIONS.find(item => item.id === this.equippedCompanion) || COMPANIONS[0];
        const count = this.companionInventory[companion.item] || 0;
        if (count <= 0) {
            this.showToast(`去伙伴商店购买「${companion.itemName}」`);
            return;
        }
        const level = this.getCompanionGrowth(companion.id).level;
        if (companion.id === 'dino') {
            if (this.gameMode === 'endless') return this.showToast('无尽模式不需要补充步数');
            this.moves += [5, 6, 8, 9, 10, 12][level - 1];
        } else if (companion.id === 'mecha') {
            this.mechaShieldMoves += [3, 4, 5, 6, 7, 8][level - 1];
        } else {
            const fillCount = [1, 1, 2, 2, 3, 3][level - 1];
            let filled = 0;
            for (let i = 0; i < fillCount; i++) {
                const missing = this.targetWord.split('').find(letter => {
                    const needed = this.targetWord.split(letter).length - 1;
                    return (this.collectedLetters[letter] || 0) < needed;
                });
                if (!missing) break;
                this.collectedLetters[missing] = (this.collectedLetters[missing] || 0) + 1;
                filled++;
            }
            if (filled === 0) return this.showToast('当前单词已经收集完成');
            this.renderTarget();
            this.checkWin();
        }
        this.companionInventory[companion.item]--;
        this.showToast(`✨ ${companion.itemName} 已生效`);
        this.renderCompanionDock();
        this.updateUI();
        this.saveGlobal();
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

    // 每关开始时伙伴打一次招呼（含语音）。整关进行中不再发声，
    // 例句朗读因此始终独占 speech 通道，稳定可读出。

    greetCompanion() {
        const id = this.equippedCompanion;
        if (!id) return;
        this.sayCompanionLine(id, 'idle', false, null, true);
    },

    getCompanionName(id) {
        return this.companionNames[id] || COMPANION_DEFAULT_NAMES[id] || '伙伴';
    },

    renameCompanion(id) {
        if (!this.companionRenameUnlocked[id]) {
            this.showToast('进化后才能给伙伴改名哦~');
            return;
        }
        const cur = this.getCompanionName(id);
        const input = prompt('给伙伴起个名字吧（最多6个字）', cur);
        if (input === null) return;
        const name = input.trim().slice(0, 6);
        if (!name) { this.showToast('名字不能为空哦'); return; }
        this.companionNames[id] = name;
        this.saveGlobal();
        this.renderCompanionDock();
        const shopModal = document.getElementById('shopModal');
        if (shopModal && shopModal.classList.contains('active')) this.renderShop('companion');
        this.showToast('已改名为「' + name + '」');
    },

    _guessGender(v) {
        const name = (v.name || '').toLowerCase();
        const g = v.gender ? String(v.gender).toLowerCase() : '';
        if (g.indexOf('female') !== -1) return 'female';
        if (g.indexOf('male') !== -1) return 'male';
        if (VOICE_GENDER_HINTS.female.some(n => name.indexOf(n) !== -1)) return 'female';
        if (VOICE_GENDER_HINTS.male.some(n => name.indexOf(n) !== -1)) return 'male';
        return null;
    },

    _pickVoice(id) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().indexOf('en') === 0);
        if (!enVoices.length) return null;
        const cfg = COMPANION_VOICE[id] || {};
        // 1) 先按具体音色名精确匹配
        const prefer = cfg.prefer || [];
        for (const key of prefer) {
            const k = key.toLowerCase();
            const hit = enVoices.find(v => v.name && v.name.toLowerCase().indexOf(k) !== -1);
            if (hit) return hit;
        }
        // 2) 按期望性别推断（多数浏览器无 voice.gender，靠音色名库）
        if (cfg.gender) {
            const match = enVoices.find(v => this._guessGender(v) === cfg.gender);
            if (match) return match;
            // 3) 退而求其次：避免选到反性别的音色
            const opposite = cfg.gender === 'male' ? 'female' : 'male';
            const notOpposite = enVoices.find(v => this._guessGender(v) !== opposite);
            if (notOpposite) return notOpposite;
        }
        return enVoices[0];
    },

    speakCompanionLine(id, text) {
        if (!this.companionVoiceOn) return;
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            const v = COMPANION_VOICE[id] || {};
            u.pitch = v.pitch != null ? v.pitch : 1;
            u.rate  = v.rate  != null ? v.rate  : 1;
            const picked = this._pickVoice(id);
            if (picked) u.voice = picked;
            window.speechSynthesis.speak(u);
        } catch(e) {}
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

    toggleCompanionVoice() {
        this.companionVoiceOn = !this.companionVoiceOn;
        if (!this.companionVoiceOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
        this.saveGlobal();
        this.renderCompanionDock();
        this.showToast(this.companionVoiceOn ? '🔊 伙伴语音已开启' : '🔇 伙伴语音已静音');
    },

    gainCompanionBond(id, amount) {
        if (!id || !amount) return { growth: null, evolved: false };
        const before = this.getCompanionGrowth(id).level;
        this.companionGrowth[id] = (this.companionGrowth[id] || 0) + amount;
        const growth = this.getCompanionGrowth(id);
        const evolved = growth.level > before;
        if (evolved) {
            this.companionRenameUnlocked[id] = growth.level;
            this.showToast(`✨ 进化为「${growth.label}」，可以改名啦！`);
            this.showEvolveModal(id, growth);
        }
        this.renderCompanionDock();
        return { growth, evolved };
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
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }
            const cb = this._afterEvolveClose;
            this._afterEvolveClose = null;
            if (cb) cb();
        };
    },

    getCompanionGrowth(id) {
        const THRESHOLDS = [0, 3, 8, 16, 28, 45];
        const MAX = THRESHOLDS.length; // 6
        const points = this.companionGrowth[id] || 0;
        let level = 1;
        for (let i = 0; i < THRESHOLDS.length; i++) {
            if (points >= THRESHOLDS[i]) level = i + 1;
        }
        const labels = {
            dino: ['幼年探险家','荒野侦察员','远古守护者','烈焰猎手','陨星霸王','创世神龙'],
            mecha: ['基础机体','重装先锋','苍蓝统帅','量子骑士','虹光战神','永恒守望者'],
            princess: ['星愿学徒','星辉公主','银河女王','极光仙子','虹羽圣女','永恒星神']
        };
        const isMax = level >= MAX;
        const cur = THRESHOLDS[level - 1];
        const next = isMax ? THRESHOLDS[MAX - 1] : THRESHOLDS[level];
        const span = isMax ? 1 : (next - cur);
        const percent = isMax ? 100 : (points - cur) / span * 100;
        const labelArr = labels[id] || labels.dino;
        return {
            points, level, max: MAX, isMax,
            next: isMax ? 'MAX' : next,
            percent: Math.min(100, Math.round(percent)),
            label: labelArr[Math.min(level, MAX) - 1],
            name: this.getCompanionName(id)
        };
    },

    getCompanionEffectText(id, level) {
        if (id === 'dino') return `使用后立即增加 ${[5,6,8,9,10,12][level-1]} 步`;
        if (id === 'mecha') return `接下来 ${[3,4,5,6,7,8][level-1]} 次有效交换不消耗步数`;
        if (id === 'princess') return `立即补齐 ${[1,1,2,2,3,3][level-1]} 个尚未收集的目标字母`;
        return '';
    },

    getCompanionAvatarHTML(companion, level) {
        return `<div class="companion-avatar ${companion.id} level-${level}">
            <img class="companion-sprite" src="${companion.image}" alt="${this._escapeHtml(this.getCompanionName(companion.id))}">
        </div>`;
    },

    queueWinPresentation(id, bond) {
        const showWin = () => {
            this._afterWinModalClose = () => { if (id) this.sayCompanionLine(id, 'win'); };
            this.showModal('win');
        };
        if (bond && bond.evolved) {
            // 进化弹窗已由 gainCompanionBond 打开，关闭后再走 win 弹窗
            this._afterEvolveClose = () => setTimeout(showWin, 200);
        } else {
            setTimeout(showWin, 400);
        }
    }
});
