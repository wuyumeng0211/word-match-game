// 音效与 TTS：Web Audio 合成音 + 语音朗读
class SoundManager {
    constructor() { this.enabled = true; this.speakEnabled = true; this.ctx = null; this.preferredVoice = null; this.voiceReady = false; }
    initVoices() {
        if (this.voiceReady) return;
        const choose = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;
            this.preferredVoice = voices.find(v => v.name.includes('Google US English'))
                || voices.find(v => v.name.includes('Samantha'))
                || voices.find(v => v.name.includes('Microsoft') && v.lang === 'en-US')
                || voices.find(v => v.lang === 'en-US')
                || voices[0];
            this.voiceReady = true;
        };
        choose();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = choose;
        }
        if (!this.voiceReady) {
            setTimeout(choose, 300);
            setTimeout(choose, 800);
        }
    }
    ensureContext() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    play(type) {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx, now = ctx.currentTime;
        const tone = (freq, dur, type='sine', vol=0.12) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = type; o.frequency.setValueAtTime(freq, now);
            g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(0.001, now+dur);
            o.start(now); o.stop(now+dur);
        };
        switch(type) {
            case 'swap': tone(600, 0.08); break;
            case 'match': [523,659,784].forEach((f,i)=>tone(f,0.15,'sine',0.1)); break;
            case 'collect': tone(880, 0.25, 'sine', 0.15); break;
            case 'win': [[523,659,784],[587,740,880],[659,830,988]].forEach((ch,i)=>ch.forEach(f=>tone(f,0.4,'triangle',0.06))); break;
            case 'lose': tone(200, 0.5, 'sawtooth', 0.08); break;
            case 'invalid': tone(150, 0.1, 'square', 0.06); break;
            case 'tick': tone(800, 0.05, 'sine', 0.05); break;
        }
    }
    speak(text) {
        if (!this.speakEnabled) return;
        if (!window.speechSynthesis) return;
        this.initVoices();
        // Chrome 真实环境 cancel()+speak() 竞态会导致 utterance 被丢弃，
        // 因此不再 cancel——让例句在 speech 队列里排队播放，宁可等一秒也不丢语音。
        try { window.speechSynthesis.resume(); } catch(e){}
        const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85; u.volume = 1;
        if (this.preferredVoice) u.voice = this.preferredVoice;
        u.onstart = () => console.log('[TTS START]', text);
        u.onend  = () => console.log('[TTS END]', text);
        u.onerror = (e) => console.warn('[TTS ERROR]', text, e.error);
        try {
            window.speechSynthesis.speak(u);
            console.log('[TTS QUEUED]', text, 'speaking=', window.speechSynthesis.speaking);
        } catch(e) { console.warn('Speech synthesis failed:', e); }
    }
}
