// renderer-screens.js — DOM 渲染层（解耦第①步：DOM 代码从逻辑模块收拢至此，行为零变化）
Object.assign(WordMatchGame.prototype, {
    // ===== 整体搬迁自 game-ui.js =====
    showToast(msg) {
        const el = document.getElementById('saveIndicator');
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2000);
    },

    applySkin() {
        if (this.skin === 'pixel') {
            document.body.dataset.skin = 'pixel';
        } else {
            delete document.body.dataset.skin;
        }
    },

    showModal(type) {
        const modal = document.getElementById('modal');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        const btn = document.getElementById('modalBtn');
        const sentenceBox = document.getElementById('sentenceBox');
        const actions = document.getElementById('modalActions');
        sentenceBox.classList.remove('failure-card');
        sentenceBox.classList.remove('learning-highlight');
        title.classList.remove('learning-highlight');
        document.getElementById('modalShareBtn').textContent = '📤 分享';
        document.getElementById('modalShareBtn').onclick = () => this.generateShareImage();

        if (type === 'win') {
            icon.textContent = '🎉';
            document.getElementById('modalShareBtn').style.display = 'inline-block';
            if (this.gameMode === 'story') {
                const total = this.targetWords ? this.targetWords.length : 1;
                title.textContent = '恭喜通关!';
                text.textContent = `你成功拼出了 ${total} 个单词!\n剩余步数奖励已计入总分`;
                btn.textContent = '下一关';
                btn.onclick = () => { this.closeModal(); this.nextLevel(); };
            } else if (this.gameMode === 'timed') {
                title.textContent = '拼词成功!';
                text.textContent = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n继续挑战下一个！`;
                btn.textContent = '继续';
                btn.onclick = () => this.closeModal();
            } else if (this.gameMode === 'endless') {
                title.textContent = `第 ${this.endlessWords} 个单词!`;
                text.textContent = `你拼出了 "${this.targetWord}" (${this.targetChinese})!\n难度等级: ${this.endlessDifficulty}`;
                btn.textContent = '继续';
                btn.onclick = () => this.closeModal();
            } else if (this.gameMode === 'review') {
                const total = this.targetWords ? this.targetWords.length : 1;
                title.textContent = '复习完成!';
                text.textContent = `你成功拼出了 ${total} 个单词!`;
                btn.textContent = '再来一组';
                btn.onclick = () => { this.closeModal(); this.startGame(); };
            } else if (this.gameMode === 'daily') {
                title.textContent = '今日挑战完成!';
                text.textContent = this.lastDailyReward === 800
                    ? '首次完成今天的3个单词，获得 800 分奖励。'
                    : '再次完成今天的3个单词，获得 200 分奖励。';
                btn.textContent = '返回首页';
                btn.onclick = () => { this.closeModal(); this.backToMenu(); };
            }
            document.getElementById('sentenceEn').textContent = this.targetSentence;
            document.getElementById('sentenceCn').textContent = this.targetSentenceCn || this.targetChinese;
            sentenceBox.style.display = 'block';
            actions.style.display = 'flex';
            this.sound.speak(this.targetWord + '. ' + this.targetSentence);
        } else {
            icon.textContent = '😢';
            title.textContent = this.gameMode === 'timed' ? '时间到!' : '步数用尽';
            text.textContent = this.gameMode === 'timed'
                ? `时间到了！你一共拼出了 ${this.endlessWords} 个单词，得分 ${this.score}`
                : `先复习一下 "${this.targetWord}" (${this.targetChinese})，再试一次会更稳。`;
            if (this.gameMode !== 'timed') {
                this.failedWords[this.targetWord] = (this.failedWords[this.targetWord] || 0) + 1;
                this.updateMastery(this.targetWord, 'fail');
                document.getElementById('sentenceEn').textContent = this.targetSentence;
                document.getElementById('sentenceCn').textContent = this.targetSentenceCn || this.targetChinese;
                sentenceBox.classList.add('failure-card');
                sentenceBox.style.display = 'block';
                this.sound.speak(this.targetWord + '. ' + this.targetSentence);
                this.saveGlobal();
            } else {
                sentenceBox.classList.remove('failure-card');
                sentenceBox.style.display = 'none';
                if (this.endlessWords > this.bestTimedWords) {
                    this.bestTimedWords = this.endlessWords;
                    this.saveGlobal();
                }
            }
            actions.style.display = 'flex';
            if (this.gameMode === 'timed') {
                if (this.endlessWords >= 10) this.unlockAchievement('speed_demon');
                btn.textContent = '再来一次';
                btn.onclick = () => { this.closeModal(); this.startGame(); };
            } else {
                btn.textContent = '重试';
                btn.onclick = () => { this.closeModal(); this.resetLevel(); };
                if ((this.toolInventory.retry_card || 0) > 0) {
                    text.textContent += `\n可使用错词复活卡保留当前字母进度。`;
                    document.getElementById('modalShareBtn').style.display = 'inline-block';
                    document.getElementById('modalShareBtn').textContent = `🧯 复活卡 ${this.toolInventory.retry_card}`;
                    document.getElementById('modalShareBtn').onclick = () => this.useRetryCard();
                } else {
                    document.getElementById('modalShareBtn').style.display = 'none';
                }
            }
        }
        modal.classList.add('active');
        this.locked = false;
    },

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        const cb = this._afterWinModalClose;
        this._afterWinModalClose = null;
        if (cb) setTimeout(cb, 260); // 等弹窗淡出后再让伙伴说话，保证玩家看得见 win 气泡
    },

    updateUI() {
        document.getElementById('timerBar').style.display = 'none';
        document.getElementById('level').textContent = this.gameMode === 'daily' ? '今日' : this.level;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = this.gameMode === 'review' ? '复习' : (this.gameMode === 'daily' ? '挑战' : '关卡');
        document.getElementById('labelMoves').textContent = this.gameMode === 'endless' ? '已拼' : '步数';
        if (this.gameMode === 'endless') document.getElementById('moves').textContent = this.endlessWords;
        this.updateBombUI();
        this.updateToolUI();
        this.renderCompanionDock();
    },

    startTutorial() {
        this.tutorialStep = 0;
        document.getElementById('tutorialModal').classList.add('active');
        this.showTutorialStep(0);
    },

    showTutorialStep(step) {
        const s = TUTORIAL_STEPS[step];
        document.getElementById('tutorialIcon').textContent = s.icon;
        document.getElementById('tutorialTitle').textContent = s.title;
        document.getElementById('tutorialText').textContent = s.text;
        const dots = document.querySelectorAll('#tutorialDots .dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === step));
        const btn = document.getElementById('tutorialBtn');
        if (step === TUTORIAL_STEPS.length - 1) {
            btn.textContent = '开始游戏';
            btn.onclick = () => this.finishTutorial();
        } else {
            btn.textContent = '下一步';
            btn.onclick = () => this.nextTutorialStep();
        }
    },

    finishTutorial() {
        document.getElementById('tutorialModal').classList.remove('active');
        StorageAdapter.set('wordMatchTutorial', 'done');
    },

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const unlocked = this.achievements[ach.id];
            const card = document.createElement('div');
            card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
            card.innerHTML = `<div class="icon">${ach.icon}</div><div class="name">${ach.name}</div><div class="desc">${ach.desc}</div>`;
            grid.appendChild(card);
        });
    },

    renderLevelMap() {
        const container = document.getElementById('levelMap');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 26; i++) {
            const node = document.createElement('div');
            let cls = 'level-node';
            if (i < this.level) cls += ' passed';
            else if (i === this.level) cls += ' current';
            else cls += ' locked';
            node.className = cls;
            node.textContent = i;
            container.appendChild(node);
        }
    },

    // ===== 从 game-ui.js 混合方法中提取的 DOM 片段 =====
    renderSoundToggle() {
        const btn = document.getElementById('soundBtn');
        btn.textContent = this.sound.enabled ? '🔊 音效' : '🔇 静音';
        btn.classList.toggle('off', !this.sound.enabled);
    },

    renderTTSToggle() {
        const btn = document.getElementById('ttsBtn');
        btn.textContent = this.sound.speakEnabled ? '🗣️ 朗读' : '🤐 静音';
        btn.classList.toggle('off', !this.sound.speakEnabled);
    },

    uiHideInstallCard() {
        const card = document.getElementById('installCard');
        if (card) card.classList.remove('show');
    },

    // ===== 整体搬迁自 game-modes.js =====
    updateTimedUI() {
        document.getElementById('level').textContent = '限时';
        document.getElementById('moves').textContent = this.timeLeft + 's';
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '剩余';
        document.getElementById('timerBar').style.display = 'block';
        this.updateBombUI();
        this.updateToolUI();
    },

    updateEndlessUI() {
        document.getElementById('level').textContent = '无尽';
        document.getElementById('moves').textContent = this.endlessWords;
        document.getElementById('score').textContent = this.score;
        document.getElementById('labelLevel').textContent = '模式';
        document.getElementById('labelMoves').textContent = '已拼';
        document.getElementById('timerBar').style.display = 'none';
        this.updateBombUI();
        this.updateToolUI();
    },

    updateDailyCard() {
        const el = document.getElementById('dailyDesc');
        if (!el) return;
        const today = this.getDateKey();
        el.innerHTML = this.dailyCompletions[today]
            ? '今日已完成<br>明天再来挑战'
            : '每天固定3个单词<br>完成奖励800分';
    },

    // ===== 从 game-modes.js 混合方法中提取的 DOM 片段 =====
    uiShowGameScreen() {
        document.body.classList.add('in-game');
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
    },

    uiShowStartScreen() {
        document.getElementById('gameBoard').style.cursor = '';
        document.querySelectorAll('.tile.bomb-target').forEach(t => t.classList.remove('bomb-target'));
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.body.classList.remove('in-game');
        // 清掉内联背景，还原 style.css 中 body 的默认米色纸纹
        document.body.style.background = '';
    },

    uiHideModal() {
        document.getElementById('modal').classList.remove('active');
    },

    renderTheme(t) {
        const root = document.documentElement;
        root.style.setProperty('--theme-bg', t.bg);
        root.style.setProperty('--theme-primary', t.primary);
        root.style.setProperty('--theme-target-bg', t.targetBg);
        root.style.setProperty('--theme-target-border', t.targetBorder);
        root.style.setProperty('--theme-select', t.select);
        root.style.setProperty('--theme-board', t.board);
        // 主题真正染到全屏：body 背景随主题渐变（CSS 已带 0.5s transition）
        document.body.style.background = t.bg;
    },

    uiShowTimerBar() {
        document.getElementById('timerBar').style.display = 'block';
    },

    renderTimerFill() {
        document.getElementById('timerFill').style.width = (this.timeLeft / 60 * 100) + '%';
    }
});
