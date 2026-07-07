// 学习闭环：掌握度、单词本、学习报告、分享图
Object.assign(WordMatchGame.prototype, {
    getMasteryInfo(word) {
        const data = this.wordMastery[word] || { correct: 0, fail: 0, review: 0 };
        const rawScore = Math.max(0, (data.correct || 0) * 2 + (data.review || 0) * 2 - (data.fail || 0));
        const days = data.lastSeen ? (Date.now() - data.lastSeen) / 86400000 : 0;
        const decay = Math.min(rawScore, Math.floor(days / 3));
        const score = Math.max(0, rawScore - decay);
        const percent = Math.max(0, Math.min(100,
            (data.correct || 0) * 18 +
            (data.review || 0) * 22 -
            (data.fail || 0) * 8 -
            decay * 6
        ));
        const levels = [
            { name: '初见', icon: '🌱', min: 0 },
            { name: '认识', icon: '🌿', min: 2 },
            { name: '熟悉', icon: '🌼', min: 5 },
            { name: '掌握', icon: '🌟', min: 9 },
            { name: '已巩固', icon: '🏆', min: 14 }
        ];
        let level = levels[0];
        for (const item of levels) {
            if (score >= item.min) level = item;
        }
        return { ...data, score, ...level, percent };
    },

    updateMastery(word, type) {
        const data = this.wordMastery[word] || { correct: 0, fail: 0, review: 0, lastSeen: 0 };
        if (type === 'correct') data.correct = (data.correct || 0) + 1;
        if (type === 'fail') data.fail = (data.fail || 0) + 1;
        if (type === 'review') data.review = (data.review || 0) + 1;
        data.lastSeen = Date.now();
        this.wordMastery[word] = data;
    },

    addLearnedWord() {
        const wordObj = { en: this.targetWord, cn: this.targetChinese, s: this.targetSentence, sc: this.targetSentenceCn };
        const exists = this.learnedWords.find(w => w.en === this.targetWord);
        this.totalCompletedWords++;
        this.updateMastery(this.targetWord, this.gameMode === 'review' ? 'review' : 'correct');
        if (!exists) {
            this.learnedWords.push(wordObj);
            this.unlockAchievement('first_word');
            if (this.learnedWords.length >= 50) this.unlockAchievement('collector');
        }
    },

    toggleFavorite() {
        const idx = this.favorites.findIndex(w => w.en === this.targetWord);
        if (idx >= 0) {
            this.favorites.splice(idx, 1);
            this.renderFavButton(false);
        } else {
            this.favorites.push({ en: this.targetWord, cn: this.targetChinese, s: this.targetSentence });
            this.renderFavButton(true);
        }
        this.saveGlobal();
    },

    removeFavorite(en) {
        this.favorites = this.favorites.filter(w => w.en !== en);
        this.saveGlobal();
        this.showVocab();
    }
});
