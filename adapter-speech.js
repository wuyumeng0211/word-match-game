// 语音适配器（解耦第②步）：单词/例句朗读 + 伙伴语音的唯一平台出口。
// 策略（产品拍板 A 方案）：优先播放预烘焙音频（audio/tts/manifest.json，
// 文本全文 → 文件路径），未命中回落浏览器 speechSynthesis。
// 微信小游戏（第④步）：烘焙音频改走 wx.createInnerAudioContext。
//
// 两种语义（沿自上游 Chrome 竞态修复，不可随意统一）：
//   speak()          学习内容：排队播放、绝不 cancel（cancel+speak 会丢语音）
//   speakWithVoice() 伙伴台词：仅关卡开始触发，先 cancel 再说
const SpeechAdapter = {
    manifest: null,
    _audio: null,

    async init() {
        try {
            const res = await fetch('audio/tts/manifest.json');
            if (res.ok) this.manifest = await res.json();
        } catch (e) { /* 无烘焙包时静默回落 */ }
    },

    speak(text, opts = {}) {
        const baked = this.manifest && this.manifest[text];
        if (baked) {
            if (this._audio) { try { this._audio.pause(); } catch (e) {} }
            this._audio = new Audio('audio/tts/' + baked);
            this._audio.play().catch(() => this._webSpeak(text, opts));
            return;
        }
        this._webSpeak(text, opts);
    },

    speakWithVoice(voiceCfg, text) {
        this.cancelSpeech();
        this._webSpeak(text, {
            pitch: voiceCfg.pitch != null ? voiceCfg.pitch : 1,
            rate:  voiceCfg.rate  != null ? voiceCfg.rate  : 1,
            voice: this._pickVoice(voiceCfg)
        });
    },

    cancelSpeech() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
    },

    _webSpeak(text, opts = {}) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        try {
            // 不 cancel：排队播放，保留上游对 Chrome cancel+speak 竞态的修复
            try { window.speechSynthesis.resume(); } catch (e) {}
            const u = new SpeechSynthesisUtterance(text);
            u.lang = opts.lang || 'en-US';
            u.rate = opts.rate != null ? opts.rate : 0.9;
            u.volume = 1;
            if (opts.pitch != null) u.pitch = opts.pitch;
            if (opts.voice) u.voice = opts.voice;
            u.onerror = (e) => console.warn('[TTS ERROR]', text, e.error);
            window.speechSynthesis.speak(u);
        } catch (e) { console.warn('Speech synthesis failed:', e); }
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

    _pickVoice(cfg) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().indexOf('en') === 0);
        if (!enVoices.length) return null;
        const prefer = cfg.prefer || [];
        for (const key of prefer) {
            const k = key.toLowerCase();
            const hit = enVoices.find(v => v.name && v.name.toLowerCase().indexOf(k) !== -1);
            if (hit) return hit;
        }
        if (cfg.gender) {
            const match = enVoices.find(v => this._guessGender(v) === cfg.gender);
            if (match) return match;
            const opposite = cfg.gender === 'male' ? 'female' : 'male';
            const notOpposite = enVoices.find(v => this._guessGender(v) !== opposite);
            if (notOpposite) return notOpposite;
        }
        return enVoices[0];
    }
};
