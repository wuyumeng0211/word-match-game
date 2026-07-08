#!/usr/bin/env bash
# 构建微信小游戏产物（解耦第④步）—— 可重复执行（先清后拷）。
#
# 产出（均为生成物，勿手改）：
#   minigame/js/core/bundle.js        core 全部源文件按 index.html 加载顺序拼接
#   minigame/js/core/tts-manifest.js  audio/tts/manifest.json → CommonJS（随主包）
#   minigame/audio/tts/*.m4a          预烘焙音频（game.json 中配置为分包 audio-tts）
#
# 为什么拼接成单一 bundle 而不是逐文件 require：
#   wx 小游戏是 CommonJS 模块环境，没有浏览器"多个 <script> 共享全局作用域"的
#   拼接语义；而 core 源文件是全局脚本风格（顶层 const 互相引用，如 game-*.js
#   引用 game.js 声明的 WordMatchGame）。逐文件 require 时每个文件都是独立模块
#   作用域，顶层 const 互不可见。零构建工具下最稳的做法就是按原加载顺序拼接
#   进同一个模块作用域。
#
# 关于 game.js 重名：core 的 game.js（类骨架）与小游戏入口 minigame/game.js 重名。
#   采用拼接方案后它不再以独立文件落盘，而是以 "game.js (game-core)" 区块头
#   拼进 bundle.js —— 等价于任务书中"复制为 js/core/game-core.js"的去歧义目的。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MG="$ROOT/minigame"
CORE="$MG/js/core"

# ---- 先清后拷（只清生成物目录，不碰手写的 adapters/shim/入口） ----
rm -rf "$CORE" "$MG/audio"
mkdir -p "$CORE" "$MG/audio/tts"

# ---- 1. 拼接 core bundle（顺序 = index.html 的 <script> 顺序，去掉 Web 适配器/
#         sound.js/DOM 渲染器，换 renderer-canvas.js；Web 三件套由 minigame/js/
#         adapters/ 下的 wx 实现以同名全局顶替） ----
ORDER=(
    events.js
    config.js
    words-data.js
    game.js
    game-save.js
    game-colors.js
    game-companion.js
    game-shop.js
    game-board.js
    game-modes.js
    game-learning.js
    game-ui.js
    renderer-canvas.js
)

BUNDLE="$CORE/bundle.js"
{
    echo "// bundle.js —— 由 tools/build-minigame.sh 自动拼接生成，勿手改。"
    echo "// window/document/navigator 等全局由 minigame/js/shim-dom.js 提供；"
    echo "// StorageAdapter/SpeechAdapter/SoundManager 由 minigame/js/adapters/ 的 wx 实现提供。"
} > "$BUNDLE"

MISSING_RENDERER=0
for f in "${ORDER[@]}"; do
    src="$ROOT/$f"
    if [[ ! -f "$src" ]]; then
        if [[ "$f" == "renderer-canvas.js" ]]; then
            echo "[WARN] renderer-canvas.js 尚不存在（同事并行编写中）——本次跳过，就绪后重跑本脚本" >&2
            MISSING_RENDERER=1
            continue
        fi
        echo "[ERROR] 缺少 core 源文件：$src" >&2
        exit 1
    fi
    label="$f"
    [[ "$f" == "game.js" ]] && label="game.js (game-core：core 类骨架，与小游戏入口 game.js 重名，故以区块形式拼入)"
    {
        echo ""
        echo "/* ===================== $label ===================== */"
        cat "$src"
    } >> "$BUNDLE"
done

cat >> "$BUNDLE" <<'EOF'

/* ===================== bundle 导出（构建脚本追加） ===================== */
if (typeof WordMatchGame !== 'undefined') GameGlobal.WordMatchGame = WordMatchGame;
if (typeof GameEvents !== 'undefined') GameGlobal.GameEvents = GameEvents;
module.exports = {
    WordMatchGame: typeof WordMatchGame !== 'undefined' ? WordMatchGame : undefined,
    GameEvents: typeof GameEvents !== 'undefined' ? GameEvents : undefined
};
EOF

# ---- 2. manifest.json → CommonJS（24KB，随主包；音频本体走分包） ----
{
    printf '// 由 tools/build-minigame.sh 从 audio/tts/manifest.json 生成，勿手改\nmodule.exports = '
    cat "$ROOT/audio/tts/manifest.json"
    printf ';\n'
} > "$CORE/tts-manifest.js"

# ---- 3. 预烘焙音频 → 分包目录（manifest.json 不拷，已转 js 随主包） ----
find "$ROOT/audio/tts" -name '*.m4a' -exec cp {} "$MG/audio/tts/" \;

# ---- 4. 语法检查 ----
if command -v node >/dev/null 2>&1; then
    for f in "$BUNDLE" "$CORE/tts-manifest.js" "$MG/game.js" "$MG/js/shim-dom.js" "$MG"/js/adapters/*.js; do
        node --check "$f"
        echo "[OK] node --check $(basename "$f")"
    done
else
    echo "[WARN] 未找到 node，跳过语法检查" >&2
fi

# ---- 5. 体积报告 ----
echo ""
echo "==== 体积报告 ===="
TOTAL_KB=$(du -sk "$MG" | awk '{print $1}')
AUDIO_KB=$(du -sk "$MG/audio" | awk '{print $1}')
echo "minigame/ 总计 ${TOTAL_KB} KB = 主包 $((TOTAL_KB - AUDIO_KB)) KB（限 4MB）+ audio-tts 分包 ${AUDIO_KB} KB（整包限 20MB）"
du -sh "$CORE/bundle.js" "$CORE/tts-manifest.js" "$MG/audio/tts" 2>/dev/null
echo "音频文件数: $(find "$MG/audio/tts" -name '*.m4a' | wc -l | tr -d ' ')"
[[ $MISSING_RENDERER -eq 1 ]] && echo "[提醒] bundle 缺 renderer-canvas.js，同事文件就绪后需重跑本脚本" >&2
echo "==== 构建完成 ===="
