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

    showWordComplete() {
        const modal = document.getElementById('modal');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        const btn = document.getElementById('modalBtn');
        const sentenceBox = document.getElementById('sentenceBox');

        icon.textContent = '✅';
        title.textContent = `${this.targetWord} · ${this.targetChinese}`;
        text.textContent = `单词 ${this.currentWordIndex + 1}/${this.targetWords.length} 完成，听一遍例句再继续。`;
        document.getElementById('sentenceEn').textContent = this.targetSentence;
        document.getElementById('sentenceCn').textContent = this.targetSentenceCn;
        sentenceBox.style.display = 'block';
        title.classList.remove('learning-highlight');
        sentenceBox.classList.remove('learning-highlight');
        void sentenceBox.offsetWidth;
        title.classList.add('learning-highlight');
        sentenceBox.classList.add('learning-highlight');
        document.getElementById('modalShareBtn').style.display = 'none';

        btn.textContent = '下一个单词';
        btn.onclick = () => {
            this.closeModal();
            this.currentWordIndex++;
            this.setCurrentTarget(this.currentWordIndex);
            this.generateBoard();
            this.renderBoard();
            this.renderTarget();
            this.updateUI();
        };

        modal.classList.add('active');
        this.locked = false;
        this.sound.speak(this.targetWord + '. ' + this.targetSentence);
    },

    showWordDetail() {
        document.getElementById('detailWord').textContent = this.targetWord;
        document.getElementById('detailSentence').textContent = this.targetSentence;
        document.getElementById('detailCn').textContent = this.targetSentenceCn || this.targetChinese;
        const mastery = this.getMasteryInfo(this.targetWord);
        document.getElementById('detailMastery').textContent = `掌握度：${mastery.icon} ${mastery.name} · ${mastery.percent}%`;
        document.getElementById('detailMasteryFill').style.width = mastery.percent + '%';
        const isFav = this.favorites.some(w => w.en === this.targetWord);
        document.getElementById('favBtn').textContent = isFav ? '❤️ 已收藏' : '⭐ 收藏';
        document.getElementById('detailModal').classList.add('active');
        this.sound.speak(this.targetWord);
    },

    closeDetailModal() {
        document.getElementById('detailModal').classList.remove('active');
    },

    toggleFavorite() {
        const idx = this.favorites.findIndex(w => w.en === this.targetWord);
        if (idx >= 0) {
            this.favorites.splice(idx, 1);
            document.getElementById('favBtn').textContent = '⭐ 收藏';
        } else {
            this.favorites.push({ en: this.targetWord, cn: this.targetChinese, s: this.targetSentence });
            document.getElementById('favBtn').textContent = '❤️ 已收藏';
        }
        this.saveGlobal();
    },

    showVocab() {
        const list = document.getElementById('vocabList');
        list.innerHTML = '';
        if (this.favorites.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:#888;padding:20px">还没有收藏单词<br>游戏中点击 ⭐ 可以收藏</div>';
        } else {
            this.favorites.forEach(w => {
                const item = document.createElement('div');
                const mastery = this.getMasteryInfo(w.en);
                item.className = 'vocab-item';
                item.innerHTML = `<div><span class="word-text">${w.en}</span><span class="word-cn">${w.cn}</span></div>
                    <span class="mastery-pill">${mastery.icon} ${mastery.name}</span>
                    <div class="actions">
                        <button onclick="game.sound.speak('${w.en}')">🔊</button>
                        <button onclick="game.removeFavorite('${w.en}')">🗑️</button>
                    </div>`;
                list.appendChild(item);
            });
        }
        document.getElementById('vocabModal').classList.add('active');
    },

    removeFavorite(en) {
        this.favorites = this.favorites.filter(w => w.en !== en);
        this.saveGlobal();
        this.showVocab();
    },

    showReport() {
        const uniqueWords = [...new Set(this.learnedWords.map(w => w.en))];
        const playDays = Object.keys(this.playDates).length;
        const dailyDone = Object.keys(this.dailyCompletions).filter(k => this.dailyCompletions[k]).length;
        const streak = this.getLearningStreak();
        const reportItems = [
            ['学习天数', `${playDays} 天`],
            ['连续学习', `${streak} 天`],
            ['已学单词', `${uniqueWords.length} 个`],
            ['累计拼词', `${this.totalCompletedWords} 次`],
            ['今日挑战', `${dailyDone} 次`],
            ['无尽最佳', `${this.bestEndlessWords} 词`]
        ];
        const grid = document.getElementById('reportGrid');
        grid.innerHTML = reportItems.map(([label, value]) =>
            `<div class="report-card"><div class="num">${value}</div><div class="label">${label}</div></div>`
        ).join('');

        const recent = this.learnedWords.slice(-6).reverse();
        document.getElementById('recentWordsReport').innerHTML = recent.length
            ? recent.map(w => `<div><strong>${w.en}</strong> <span style="color:#999">${w.cn}</span></div>`).join('')
            : '还没有学习记录，先去闯关模式拼出第一个单词吧。';

        const lowMastery = uniqueWords
            .map(word => ({ word, info: this.getMasteryInfo(word) }))
            .filter(item => item.info.score < 5)
            .slice(0, 5);
        const hard = Object.entries(this.failedWords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        document.getElementById('hardWordsReport').innerHTML = (hard.length || lowMastery.length)
            ? [
                ...hard.map(([word, count]) => {
                const found = this.wordLevels.flat().find(w => w.en === word) || this.learnedWords.find(w => w.en === word);
                const cn = found ? found.cn : '';
                return `<div><strong>${word}</strong> <span style="color:#999">${cn}</span> · 失败 ${count} 次</div>`;
                }),
                ...lowMastery.map(({word, info}) => `<div><strong>${word}</strong> <span class="mastery-pill">${info.icon} ${info.name}</span></div>`)
            ].join('')
            : '暂时没有明显卡点，保持这个节奏。';

        document.getElementById('reportModal').classList.add('active');
    },

    generateShareImage() {
        const canvas = document.getElementById('shareCanvas');
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        const w = 600, h = 400;
        canvas.width = w; canvas.height = h;

        const grd = ctx.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, '#667eea');
        grd.addColorStop(1, '#764ba2');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('单词拼拼消', w / 2, 80);

        ctx.font = 'bold 72px sans-serif';
        ctx.fillText(this.targetWord, w / 2, 180);

        ctx.font = '32px sans-serif';
        ctx.fillText(this.targetChinese, w / 2, 230);

        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(this.targetSentence, w / 2, 280);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#ffd700';
        const modeText = {
            story: `第 ${this.level} 关`,
            timed: '限时挑战',
            endless: '无尽模式',
            review: '单词复习',
            daily: '每日挑战'
        }[this.gameMode] || '单词拼拼消';
        ctx.fillText(`${modeText} · 得分 ${this.score}`, w / 2, 340);

        const link = document.createElement('a');
        link.download = 'word-match-score.png';
        link.href = canvas.toDataURL();
        link.click();
    }
});
