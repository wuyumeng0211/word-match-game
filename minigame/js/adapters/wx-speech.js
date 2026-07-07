// 语音适配器 wx 实现（解耦第④步）：接口与 Web 版 adapter-speech.js 一致。
// 策略：只播预烘焙音频（audio/tts/ 508 个 m4a）。wx 无 speechSynthesis，
// manifest 未命中时静默跳过（无 TTS 可回落）。
// manifest 由构建脚本从 audio/tts/manifest.json 生成为 js/core/tts-manifest.js
// （CommonJS），随主包走；音频本体在 audio/ 分包，入口 game.js 负责
// wx.loadSubpackage 并置 audioReady = true。

let manifest = null;
try {
    // 构建产物：tools/build-minigame.sh 生成；未构建时静默降级为"全部未命中"
    manifest = require('../core/tts-manifest.js');
} catch (e) { manifest = null; }

const SpeechAdapter = {
    manifest: manifest,
    _audio: null,          // 当前 InnerAudioContext
    audioReady: false,     // audio-tts 分包加载完成后由入口置 true

    // Web 版 init() 是 fetch manifest；wx 版 manifest 走 require，这里留空实现保持接口
    async init() {},

    speak(text) {
        const baked = this.manifest && this.manifest[text];
        if (!baked || !this.audioReady) return;   // wx 无 TTS 回落 → 静默跳过
        this.cancelSpeech();
        const audio = wx.createInnerAudioContext();
        audio.src = 'audio/tts/' + baked;          // 分包内文件，loadSubpackage 后可用
        audio.onEnded(() => { try { audio.destroy(); } catch (e) {} });
        audio.onError(() => { try { audio.destroy(); } catch (e) {} });  // 静默失败
        audio.play();
        this._audio = audio;
    },

    // 伙伴语音 wx 版暂缺：Web 版依赖 speechSynthesis 的音色/音高（pitch/rate/voice），
    // wx 没有 TTS 引擎，且伙伴台词是动态文本、无法预烘焙。留空实现，
    // 后续可为固定台词集烘焙专属音频或接第三方 TTS 云服务。
    speakWithVoice(voiceCfg, text) {},

    cancelSpeech() {
        if (this._audio) {
            try { this._audio.stop(); this._audio.destroy(); } catch (e) {}
            this._audio = null;
        }
    }
};

GameGlobal.SpeechAdapter = SpeechAdapter;   // core bundle 以裸标识符引用
module.exports = SpeechAdapter;
