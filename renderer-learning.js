// renderer-learning.js — DOM 渲染层（解耦第①步：DOM 代码从逻辑模块收拢至此，行为零变化）
Object.assign(WordMatchGame.prototype, {
    // ===== 来自 game-learning.js =====
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

    renderFavButton(isFav) {
        document.getElementById('favBtn').textContent = isFav ? '❤️ 已收藏' : '⭐ 收藏';
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
    },

    // ===== 来自 game-colors.js =====
    applyTileColor(tile, cell) {
        // 万能块不进字母色表：清掉内联样式，外观全交给 .tile-wild 的 CSS
        if (this.isWildCell(cell)) {
            tile.style.removeProperty('background');
            tile.style.color = '';
            tile.style.border = '';
            tile.style.textShadow = '';
            return;
        }
        const letter = this.cellLetter(cell);
        const color = this.letterColorMap[letter] || LETTER_COLOR_PALETTE[0];
        const gradient = `linear-gradient(135deg, ${color.bg} 0%, ${color.bg2} 100%)`;
        const fallbackPattern = LETTER_PATTERNS[(Math.max(0, letter.charCodeAt(0) - 65) % (LETTER_PATTERNS.length - 1)) + 1];
        const pattern = this.colorBlindMode ? fallbackPattern : color.pattern;
        const background = pattern ? `${pattern}, ${gradient}` : gradient;
        tile.style.setProperty('background', background, 'important');
        tile.style.color = color.fg;
        tile.style.border = `2px solid ${color.border}`;
        // 浅色字（白）配深色描边，深色字（黄块）配浅色底衬，保证叠加花纹后仍可读
        const darkFg = this.hexToLab(color.fg).l < 60;
        tile.style.textShadow = darkFg
            ? '0 0 3px rgba(255,255,255,0.65), 0 1px 2px rgba(255,255,255,0.5)'
            : '0 0 3px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.45)';
    },

    spawnParticles(x, y, color) {
        if (this.reduceMotion) return;
        const container = document.getElementById('boardContainer');
        const effect = this.equippedEffect;
        const count = effect === 'rainbow_effect' ? 12 : 8;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.position = 'absolute';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '40';
            const angle = (Math.PI * 2 * i) / count;
            const dist = 30 + Math.random() * 30;
            p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            if (effect === 'star_effect') {
                p.innerHTML = '⭐';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 0.8s ease forwards';
            } else if (effect === 'heart_effect') {
                p.innerHTML = '💗';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 1s ease forwards';
            } else if (effect === 'paper_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '5px';
                p.style.borderRadius = '0';
                p.style.background = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57'][i % 5];
                p.style.animation = 'particleBurst 1.2s ease forwards';
            } else if (effect === 'rainbow_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '8px';
                p.style.borderRadius = '50%';
                p.style.background = `hsl(${(i * 360 / count)},80%,60%)`;
                p.style.transition = 'transform 0.3s, opacity 0.3s';
                p.style.animation = 'particleBurst 1s ease forwards';
                p.style.filter = 'drop-shadow(0 0 4px currentColor)';
            } else {
                p.className = 'particle';
                p.style.background = color;
                p.style.animation = 'particleBurst 0.8s ease forwards';
            }
            container.appendChild(p);
            setTimeout(() => p.remove(), effect === 'paper_effect' ? 1200 : 1000);
        }
    },

    spawnScorePopup(x, y, score) {
        const container = document.getElementById('boardContainer');
        const el = document.createElement('div');
        el.className = 'score-popup';
        el.textContent = '+' + Math.round(score);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    spawnConfetti(host) {
        if (this.reduceMotion || !host) return;
        const colors = ['#ff4081','#ff9800','#ffeb3b','#4caf50','#00e5ff','#7c4dff','#ffd700'];
        for (let i = 0; i < 26; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[i % colors.length];
            piece.style.animationDuration = (1.1 + Math.random() * 1.1) + 's';
            piece.style.animationDelay = (Math.random() * 0.35) + 's';
            host.appendChild(piece);
            setTimeout(() => piece.remove(), 2800);
        }
    },

    // ===== 来自 game-save.js =====
    updateGlobalStats() {
        const uniqueWords = [...new Set(this.learnedWords.map(w => w.en))];
        document.getElementById('statLevel').textContent = this.level;
        document.getElementById('statScore').textContent = this.coins;
        document.getElementById('statWords').textContent = uniqueWords.length;
        document.getElementById('statVocab').textContent = this.favorites.length;
        this.updateDailyCard();
        this.renderLevelMap();
        const statsGrid = document.getElementById('globalStats');
        if (statsGrid) {
            statsGrid.classList.remove('frame-bronze','frame-silver','frame-gold');
            if (this.equippedFrame === 'bronze_frame') statsGrid.classList.add('frame-bronze');
            else if (this.equippedFrame === 'silver_frame') statsGrid.classList.add('frame-silver');
            else if (this.equippedFrame === 'gold_frame') statsGrid.classList.add('frame-gold');
        }
    }
});
