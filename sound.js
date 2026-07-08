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
    play(type, combo = 1) {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx, now = ctx.currentTime;
        const tone = (freq, dur, type='sine', vol=0.12, delay=0) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            const t0 = now + delay;
            o.type = type; o.frequency.setValueAtTime(freq, t0);
            g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0+dur);
            o.start(t0); o.stop(t0+dur);
        };
        switch(type) {
            case 'swap': tone(600, 0.08); break;
            case 'match': {
                const pitch = Math.pow(2, Math.min(combo - 1, 5) * 2 / 12);
                [523,659,784].forEach((f,i)=>tone(f*pitch,0.15,'sine',0.1,i*0.05));
                break;
            }
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
        SpeechAdapter.speak(text, { rate: 0.85, voice: this.preferredVoice });
    }
}
