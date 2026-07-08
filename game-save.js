// 存档与统计：全局存档（经 StorageAdapter）、连续学习天数、日期与随机工具
Object.assign(WordMatchGame.prototype, {
    loadGlobalSave() {
        try {
            const raw = StorageAdapter.get('wordMatchGlobal');
            if (raw) {
                const data = JSON.parse(raw);
                const version = data.version || 1;
                this.learnedWords = Array.isArray(data.learnedWords) ? data.learnedWords : [];
                this.favorites = Array.isArray(data.favorites) ? data.favorites : [];
                this.level = data.level || 1;
                this.coins = data.coins != null ? data.coins : (data.score || 0);
                this.bombs = data.bombs || 0;
                this.nextBombAt = data.nextBombAt || 8000;
                this.achievements = data.achievements || {};
                this.unlockedSkins = Array.isArray(data.unlockedSkins) ? data.unlockedSkins : ['default_theme','default_board','default_effect','default_frame'];
                this.equippedTheme = data.equippedTheme || 'default_theme';
                this.equippedBoard = data.equippedBoard || 'default_board';
                this.equippedEffect = data.equippedEffect || 'default_effect';
                this.equippedFrame = data.equippedFrame || 'default_frame';
                this.playDates = data.playDates || {};
                this.dailyCompletions = data.dailyCompletions || {};
                this.failedWords = data.failedWords || {};
                this.totalCompletedWords = data.totalCompletedWords || 0;
                this.bestTimedWords = data.bestTimedWords || 0;
                this.bestEndlessWords = data.bestEndlessWords || 0;
                this.wordMastery = data.wordMastery || {};
                this.toolInventory = data.toolInventory || {};
                this.reviewBoostActive = !!data.reviewBoostActive;
                this.reduceMotion = !!data.reduceMotion;
                this.colorBlindMode = !!data.colorBlindMode;
                this.unlockedCompanions = Array.isArray(data.unlockedCompanions) ? data.unlockedCompanions : ['dino'];
                this.equippedCompanion = data.equippedCompanion || 'dino';
                this.companionInventory = data.companionInventory || {};
                this.companionGrowth = data.companionGrowth || {};
                this.companionNames = data.companionNames || {};
                this.companionRenameUnlocked = data.companionRenameUnlocked || {};
                this.companionVoiceOn = data.companionVoiceOn !== undefined ? data.companionVoiceOn : true;
                this.mechaShieldMoves = data.mechaShieldMoves || 0;
                this.lastCompanionGreetDate = data.lastCompanionGreetDate !== undefined ? data.lastCompanionGreetDate : '';
                this.skin = data.skin || 'classic';
                if (data.speakEnabled !== undefined) this.sound.speakEnabled = data.speakEnabled;
                if (version < 2) {
                    this.nextBombAt = Math.max(this.nextBombAt, 8000);
                }
            }
        } catch(e) {}
    },

    saveGlobal() {
        const data = {
            version: 2,
            learnedWords: this.learnedWords,
            favorites: this.favorites,
            level: this.level,
            coins: this.coins,
            bombs: this.bombs,
            nextBombAt: this.nextBombAt,
            achievements: this.achievements,
            unlockedSkins: this.unlockedSkins,
            equippedTheme: this.equippedTheme,
            equippedBoard: this.equippedBoard,
            equippedEffect: this.equippedEffect,
            equippedFrame: this.equippedFrame,
            playDates: this.playDates,
            dailyCompletions: this.dailyCompletions,
            failedWords: this.failedWords,
            totalCompletedWords: this.totalCompletedWords,
            bestTimedWords: this.bestTimedWords,
            bestEndlessWords: this.bestEndlessWords,
            wordMastery: this.wordMastery,
            toolInventory: this.toolInventory,
            reviewBoostActive: this.reviewBoostActive,
            reduceMotion: this.reduceMotion,
            colorBlindMode: this.colorBlindMode,
            unlockedCompanions: this.unlockedCompanions,
            equippedCompanion: this.equippedCompanion,
            companionInventory: this.companionInventory,
            companionGrowth: this.companionGrowth,
            companionNames: this.companionNames,
            companionRenameUnlocked: this.companionRenameUnlocked,
            companionVoiceOn: this.companionVoiceOn,
            mechaShieldMoves: this.mechaShieldMoves,
            lastCompanionGreetDate: this.lastCompanionGreetDate,
            skin: this.skin,
            speakEnabled: this.sound.speakEnabled,
            date: Date.now()
        };
        StorageAdapter.set('wordMatchGlobal', JSON.stringify(data));
        this.updateGlobalStats();
    },

    markPlayDay() {
        this.playDates[this.getDateKey()] = true;
    },

    getLearningStreak() {
        let streak = 0;
        const date = new Date();
        while (true) {
            const key = this.getDateKey(date);
            if (!this.playDates[key]) break;
            streak++;
            date.setDate(date.getDate() - 1);
        }
        return streak;
    },

    // 把「今天」也算进连续天数：今天若已游玩则与 getLearningStreak 等价；
    // 今天尚未记录（如登录问候发生在 markPlayDay 之前）则按「昨天往回连续天数 + 1」计。
    // 仅用于读取，不写入 playDates，无副作用。

    getStreakIncludingToday() {
        if (this.playDates[this.getDateKey()]) return this.getLearningStreak();
        let streak = 0;
        const date = new Date();
        date.setDate(date.getDate() - 1);
        while (true) {
            const key = this.getDateKey(date);
            if (!this.playDates[key]) break;
            streak++;
            date.setDate(date.getDate() - 1);
        }
        return streak + 1;
    },

    // 距上次游玩的天数（0=今天玩过，1=昨天，>1=隔了几天没来）；无任何记录返回 0

    getDaysSinceLastPlay() {
        const keys = Object.keys(this.playDates || {});
        if (!keys.length) return 0;
        const today = new Date();
        for (let gap = 0; gap <= 365; gap++) {
            const d = new Date(today);
            d.setDate(today.getDate() - gap);
            if (this.playDates[this.getDateKey(d)]) return gap;
        }
        return 366;
    },

    // 登录回访：连续天数 daily 台词 / 久违 miss 台词，每日各只触发一次

    getDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    hashString(str) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return Math.abs(hash >>> 0);
    },

    seededPick(pool, count, seed) {
        const arr = [...pool];
        const picked = [];
        let s = seed || 1;
        while (arr.length && picked.length < count) {
            s = (s * 1664525 + 1013904223) >>> 0;
            const idx = s % arr.length;
            picked.push(arr.splice(idx, 1)[0]);
        }
        return picked;
    }
});
