// 通用 UI 逻辑：教程流程、成就解锁、开关状态（DOM 渲染已迁至 renderer-screens.js）
Object.assign(WordMatchGame.prototype, {
    // applySkin 的实现在 renderer-screens.js（渲染层，后加载覆盖）——此处不能有定义：
    // 本文件会打进微信小游戏 bundle，出现 document 引用会破坏逻辑层纯度
    toggleSkin() {
        this.skin = this.skin === 'pixel' ? 'classic' : 'pixel';
        this.saveGlobal();
        this.applySkin();
        this.showToast(this.skin === 'pixel' ? '🕹️ 已切换到像素风格' : '🎨 已切换到经典风格');
    },

    // 通关展示排队：进化弹窗优先 → win 结算弹窗 → win 气泡（修复气泡被结算弹窗遮住的 bug）

    nextTutorialStep() {
        this.tutorialStep++;
        if (this.tutorialStep < TUTORIAL_STEPS.length) {
            this.showTutorialStep(this.tutorialStep);
        }
    },

    unlockAchievement(id) {
        if (this.achievements[id]) return;
        this.achievements[id] = true;
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) this.showToast(`🏆 解锁成就：${ach.name}`);
        this.renderAchievements();
        this.saveGlobal();
    },

    unlockAudio() {
        if (this.audioUnlocked) return;
        this.audioUnlocked = true;
        this.sound.ensureContext();
        this.uiUnlockSpeechSynthesis();
    },

    toggleSound() {
        this.sound.enabled = !this.sound.enabled;
        this.renderSoundToggle();
    },

    toggleTTS() {
        this.sound.speakEnabled = !this.sound.speakEnabled;
        this.renderTTSToggle();
        this.saveGlobal();
    },

    async installApp() {
        if (!this.deferredInstallPrompt) {
            this.showToast('请在浏览器菜单里选择“添加到主屏幕”');
            return;
        }
        await this.uiTriggerInstallPrompt();
        this.deferredInstallPrompt = null;
        this.uiHideInstallCard();
    }
});
