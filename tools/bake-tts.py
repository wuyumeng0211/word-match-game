#!/usr/bin/env python3
"""TTS 预烘焙（产品拍板 A 方案）：words-data.js → audio/tts/*.m4a + manifest.json
用 macOS say(Samantha) 生成，afconvert 压成 32kbps 单声道 AAC。
manifest 按"调用方传入的完整文本"为 key，运行时命中即播文件、未命中回落浏览器 TTS。
重跑：python3 tools/bake-tts.py
"""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'tts')
os.makedirs(OUT, exist_ok=True)

# 从 words-data.js 提取词库（node 求值，避免手写解析）
words_json = subprocess.check_output(
    ['node', '-e', "eval(require('fs').readFileSync(process.argv[1],'utf8').replace('const WORD_LEVELS','globalThis.WORD_LEVELS')); console.log(JSON.stringify(globalThis.WORD_LEVELS))",
     os.path.join(ROOT, 'words-data.js')], text=True)
levels = json.loads(words_json)

VOICE, RATE = 'Samantha', '150'

def bake(text, fname):
    out = os.path.join(OUT, fname)
    if os.path.exists(out):
        return False
    with tempfile.NamedTemporaryFile(suffix='.aiff', delete=False) as tmp:
        pass
    subprocess.run(['say', '-v', VOICE, '-r', RATE, '-o', tmp.name, text], check=True)
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '32000', '-c', '1',
                    tmp.name, out], check=True, capture_output=True)
    os.unlink(tmp.name)
    return True

manifest, made = {}, 0
for level in levels:
    for w in level:
        key = re.sub(r'[^A-Za-z0-9]+', '-', w['en'].lower()).strip('-')
        made += bake(w['en'], f'w-{key}.m4a')
        manifest[w['en']] = f'w-{key}.m4a'
        combo = w['en'] + '. ' + w['s']          # 与调用方拼接格式严格一致
        made += bake(combo, f's-{key}.m4a')
        manifest[combo] = f's-{key}.m4a'

with open(os.path.join(OUT, 'manifest.json'), 'w') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=0)
total = subprocess.check_output(['du', '-sh', OUT], text=True).split()[0]
print(f'baked {made} new files, manifest {len(manifest)} entries, total {total}')
