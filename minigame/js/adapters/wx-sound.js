// SoundManager wx 替身（解耦第④步）：接口与 Web 版 sound.js 一致
// （enabled / speakEnabled / initVoices / ensureContext / play / speak）。
//
// 实现：wx 小游戏支持 WebAudioContext（wx.createWebAudioContext，基础库 2.19.0+），
// 这里把 sound.js 的振荡器合成逻辑原样移植，并做特性检测：
// 若运行环境缺 createWebAudioContext / createOscillator（旧基础库或真机差异），
// 自动降级为静默 no-op，游戏流程不受影响。
// TODO(真机验证)：iOS/Android 真机上 OscillatorNode 支持度与音量表现需实测；
// 若表现不佳，备选方案是预生成 7 个短音效文件（swap/match/collect/win/lose/
// invalid/tick）用 wx.createInnerAudioContext 播放。

class SoundManager {
    constructor() {
        this.enabled = true;
        this.speakEnabled = true;
        this.ctx = null;
        this.ctxBroken = false;   // 特性检测失败后不再重试
        this.preferredVoice = null;
        this.voiceReady = true;   // wx 无 speechSynthesis，语音选择无意义
    }

    // Web 版在此挑 speechSynthesis 音色；wx 版空实现保持接口
    initVoices() {}

    ensureContext() {
        if (this.ctx || this.ctxBroken) return;
        try {
            if (typeof wx === 'undefined' || typeof wx.createWebAudioContext !== 'function') {
                this.ctxBroken = true; return;
            }
            const ctx = wx.createWebAudioContext();
            if (typeof ctx.createOscillator !== 'function' || typeof ctx.createGain !== 'function') {
                this.ctxBroken = true; return;   // 环境不支持合成 → 静默降级
            }
            this.ctx = ctx;
        } catch (e) { this.ctxBroken = true; }
        if (this.ctx && this.ctx.state === 'suspended' && this.ctx.resume) {
            try { this.ctx.resume(); } catch (e) {}
        }
    }

    // 与 sound.js 完全同参的合成音效
    play(type, combo = 1) {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;    // 降级：静默
        const ctx = this.ctx, now = ctx.currentTime;
        const tone = (freq, dur, oscType = 'sine', vol = 0.12, delay = 0) => {
            try {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                const t0 = now + delay;
                o.type = oscType; o.frequency.setValueAtTime(freq, t0);
                g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
                o.start(t0); o.stop(t0 + dur);
            } catch (e) { /* 单音失败不影响流程 */ }
        };
        switch (type) {
            case 'swap': tone(600, 0.08); break;
            case 'match': {
                const pitch = Math.pow(2, Math.min(combo - 1, 5) * 2 / 12);
                [523, 659, 784].forEach((f, i) => tone(f * pitch, 0.15, 'sine', 0.1, i * 0.05));
                break;
            }
            case 'collect': tone(880, 0.25, 'sine', 0.15); break;
            case 'win': [[523, 659, 784], [587, 740, 880], [659, 830, 988]].forEach((ch, i) => ch.forEach(f => tone(f, 0.4, 'triangle', 0.06))); break;
            case 'lose': tone(200, 0.5, 'sawtooth', 0.08); break;
            case 'invalid': tone(150, 0.1, 'square', 0.06); break;
            case 'tick': tone(800, 0.05, 'sine', 0.05); break;
        }
    }

    // 朗读走 SpeechAdapter（wx 版只播烘焙音频，未命中静默）
    speak(text) {
        if (!this.speakEnabled) return;
        if (GameGlobal.SpeechAdapter) GameGlobal.SpeechAdapter.speak(text, { rate: 0.85 });
    }
}

GameGlobal.SoundManager = SoundManager;   // core bundle 以裸标识符 new SoundManager()
module.exports = SoundManager;
