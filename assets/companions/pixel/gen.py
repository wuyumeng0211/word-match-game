#!/usr/bin/env python3
"""从原版 256px 像素立绘生成 6 级进化调色变体"""
from PIL import Image, ImageEnhance, ImageDraw
import sys, os

SRC = os.path.expanduser('~/Repos/word-match-game/assets/companions')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SRC, 'pixel')
os.makedirs(OUT, exist_ok=True)

GOLD = (232, 193, 90)

def lum(p): return 0.299*p[0] + 0.587*p[1] + 0.114*p[2]

def blend(p, target, t):
    return tuple(int(p[i]*(1-t) + target[i]*t) for i in range(3)) + (p[3],)

def gold_highlights(im, strength, threshold=140):
    """亮部向金色靠拢，暗部保留 —— 保持原作明暗结构"""
    im = im.copy(); px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if p[3] == 0: continue
            L = lum(p)
            if L > threshold:
                t = strength * min(1.0, (L - threshold) / (255 - threshold) + 0.35)
                px[x, y] = blend(p, GOLD, t)
    return im

def halo(im, scale=4):
    """头顶画像素光环（按 256px 网格，4px 一个逻辑像素）"""
    im = im.copy(); d = ImageDraw.Draw(im)
    # 找最高的非透明像素列范围，光环画在其上方
    px = im.load(); w, h = im.size
    top = next(y for y in range(h) if any(px[x, y][3] > 0 for x in range(w)))
    xs = [x for x in range(w) if px[x, max(0, top)][3] > 0]
    cx = (min(xs) + max(xs)) // 2 if xs else w // 2
    ry, rx = 3*scale, 9*scale
    y0 = max(2*scale, top - 6*scale)
    for t in range(2):  # 双圈像素光环
        color = (255, 230, 120, 255) if t == 0 else (200, 150, 40, 255)
        d.ellipse([cx-rx+t*scale, y0+t*scale, cx+rx-t*scale, y0+2*ry-t*scale], outline=color, width=scale)
    return im

def variant(im, level):
    if level == 1:
        v = ImageEnhance.Color(im).enhance(0.45)
        return ImageEnhance.Brightness(v).enhance(0.92)
    if level == 2:
        return ImageEnhance.Color(im).enhance(0.8)
    if level == 3:
        return im.copy()  # 原版即 3 级"完全体"
    if level == 4:
        v = ImageEnhance.Color(im).enhance(1.25)
        return ImageEnhance.Contrast(v).enhance(1.06)
    if level == 5:
        s, th = GOLD_PARAMS[CID][0]
        return gold_highlights(ImageEnhance.Color(im).enhance(1.15), s, threshold=th)
    if level == 6:
        s, th = GOLD_PARAMS[CID][1]
        return halo(gold_highlights(ImageEnhance.Color(im).enhance(1.35), s, threshold=th))

# 每角色鎏金参数 (L5:(强度,亮度阈值), L6:(强度,阈值))——按各自明度分布调，保住本体色
GOLD_PARAMS = {
    'dino':     [(0.35, 180), (0.42, 175)],
    'mecha':    [(0.55, 140), (0.80, 110)],
    'princess': [(0.45, 155), (0.62, 130)],
}
for cid in ['dino', 'mecha', 'princess']:
    CID = cid
    src = Image.open(f'{SRC}/{cid}.png').convert('RGBA')
    for lv in range(1, 7):
        variant(src, lv).save(f'{OUT}/{cid}-l{lv}.png', optimize=True)
    print(cid, 'ok')
