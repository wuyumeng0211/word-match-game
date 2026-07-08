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
        const input = this.uiPromptCompanionName(cur);
        if (input === null) return;
        const name = input.trim().slice(0, 6);
        if (!name) { this.showToast('名字不能为空哦'); return; }
        this.companionNames[id] = name;
        this.saveGlobal();
        this.renderCompanionDock();
        this.uiRefreshCompanionShopIfOpen();
        this.showToast('已改名为「' + name + '」');
    },



    speakCompanionLine(id, text) {
        if (!this.companionVoiceOn) return;
        SpeechAdapter.speakWithVoice(COMPANION_VOICE[id] || {}, text);
    },


    toggleCompanionVoice() {
        this.companionVoiceOn = !this.companionVoiceOn;
        if (!this.companionVoiceOn) SpeechAdapter.cancelSpeech();
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
