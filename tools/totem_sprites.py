#!/usr/bin/env python3
"""Sprites pixel art des animaux totems, à partir de silhouettes PhyloPic (domaine public / CC0).

Chaque sprite fait 28×20 px, en deux images côte à côte (56×20) pour l'animation :
- marche / reptation : les pattes (bas de la silhouette) se décalent d'un pixel ;
- saut : l'animal se tasse ;
- vol : les ailes (haut de la silhouette) battent ;
- nage : la queue ondule.
Couleurs : teinte de l'animal (champ c dans src/data.js), lumière en haut, ombre en bas, contour sombre, un œil.

Usage : python3 tools/totem_sprites.py <dossier silhouettes> <choix.json> <dossier sortie>
choix.json : {"lion": [0, false], ...}  (indice de la silhouette, retournement horizontal pour regarder à droite)
"""
import json, os, re, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from totem_hand import HAND

W, H = 28, 20
OUTLINE = (28, 20, 48)
STRIPES = {'abeille': .7, 'tigre': .78}   # part du corps rayée, en partant de l'arrière
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def animals():
    src = open(os.path.join(ROOT, 'src', 'data.js'), encoding='utf-8').read()
    return {m.group(1): (m.group(2), m.group(3)) for m in re.finditer(r"\{id:'(\w+)', n:'[^']*', el:'\w+', v:\[[^\]]*\], c:'(#[0-9a-f]{6})', mv:'(\w+)'", src)}

def hexrgb(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
def mix(a, b, t): return a * (1 - t) + b * t

def silhouette(path, flip):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im)[..., 3] if np.asarray(im)[..., 3].max() > 0 else 255 - np.asarray(im.convert('L'))
    ys, xs = np.where(a > 40)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    if flip: a = a[:, ::-1]
    return a

def fit(alpha, maxw=W - 2, maxh=H - 2):
    h, w = alpha.shape; s = min(maxw / w, maxh / h)
    tw, th = max(4, round(w * s)), max(3, round(h * s))
    small = np.asarray(Image.fromarray(alpha).resize((tw, th), Image.BOX), float) / 255
    m = np.zeros((H, W), bool)
    x0 = (W - tw) // 2; y0 = H - 1 - th                          # posé sur le sol (ligne du bas libre pour le contour)
    m[y0:y0 + th, x0:x0 + tw] = small > .42
    return m

def frame2(m, mv):
    f = m.copy(); ys, xs = np.where(m)
    if not len(ys): return f
    top, bot, left, right = ys.min(), ys.max(), xs.min(), xs.max()
    if mv in ('walk', 'crawl'):                                  # pattes : bande du bas, avant et arrière décalés
        band = max(2, (bot - top + 1) // 3); y = bot - band + 1
        mid = (left + right) // 2
        f[y:, :] = False
        f[y:, 1:mid + 1] |= m[y:, 0:mid]                          # pattes arrière vers la droite
        f[y:, mid:-1] |= m[y:, mid + 1:]                          # pattes avant vers la gauche
    elif mv == 'hop':                                            # tassement
        sub = m[top:bot + 1]; nh = max(2, round(sub.shape[0] * .85))
        sq = np.asarray(Image.fromarray(sub.astype(np.uint8) * 255).resize((W, nh), Image.NEAREST)) > 0
        f[:] = False; f[bot + 1 - nh:bot + 1] = sq
    elif mv == 'fly':                                            # ailes : moitié haute abaissée de 2 px
        half = top + (bot - top) // 2
        f[:half + 1] = False; f[top + 2:half + 3] |= m[top:half + 1]
    elif mv == 'swim':                                           # queue : tiers gauche relevé d'1 px
        q = left + (right - left) // 3
        f[:, :q] = False; f[:-1, :q] |= m[1:, :q]
    return f

def paint(m, base, stripes=0):
    rgb = np.zeros((H, W, 4), np.uint8)
    light, dark = mix(base, np.array([255, 250, 235.]), .38), mix(base, np.zeros(3), .38)
    up = np.zeros_like(m); up[1:] = m[:-1]
    down = np.zeros_like(m); down[:-1] = m[1:]
    ys, xs = np.where(m)
    if not len(ys): return Image.fromarray(rgb)
    top, bot = ys.min(), ys.max()
    for y, x in zip(ys, xs):
        c = base
        if not up[y, x]: c = light                                # arête du haut : lumière
        elif not down[y, x] or y > top + (bot - top) * .72: c = dark   # bas : ombre
        rgb[y, x, :3] = c; rgb[y, x, 3] = 255
    # motifs redessinés : rayures de l'abeille et du tigre (l'avant, la tête, reste uni)
    if stripes:
        left, right = xs.min(), xs.max(); cut = left + (right - left) * stripes
        for y, x in zip(ys, xs):
            if x < cut and (x - left) % 3 == 1:
                rgb[y, x, :3] = mix(base, np.zeros(3), .75)
    # contour : tout pixel vide touchant la silhouette
    pad = np.pad(m, 1)
    near = pad[:-2, 1:-1] | pad[2:, 1:-1] | pad[1:-1, :-2] | pad[1:-1, 2:]
    o = near & ~m
    lum = base @ np.array([.299, .587, .114])
    rgb[o, :3] = OUTLINE if lum > 75 else (150, 130, 210)       # animal sombre : contour clair pour rester visible sur la nuit
    rgb[o, 3] = 255
    # œil : pixel intérieur le plus haut dans le quart avant (l'animal regarde à droite)
    left, right = xs.min(), xs.max()
    inner = m & up & down & np.roll(m, 1, 1) & np.roll(m, -1, 1)
    cand = [(y, x) for y, x in zip(*np.where(inner)) if x >= right - max(2, (right - left) // 4)]
    if cand:
        y, x = min(cand, key=lambda p: (p[0] - p[1] * .6))
        rgb[y, x, :3] = OUTLINE if base.mean() > 60 else (250, 240, 210)
    return Image.fromarray(rgb, 'RGBA')

def hand_frame(rows, pal):
    assert len(set(map(len, rows))) == 1, 'lignes de longueurs différentes'
    h, w = len(rows), len(rows[0])
    a = np.zeros((h, w, 4), np.uint8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch != '.': a[y, x, :3] = hexrgb(pal[ch]); a[y, x, 3] = 255
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    im.alpha_composite(Image.fromarray(a, 'RGBA'), ((W - w) // 2, H - h))   # centré, posé en bas
    return im

def hand_sheet(spec, mv):
    f1 = hand_frame(spec['frames'][0], spec['pal'])
    if len(spec['frames']) > 1: f2 = hand_frame(spec['frames'][1], spec['pal'])
    else:                                                        # saut : tassement de l'image
        bb = f1.getbbox(); part = f1.crop(bb); nh = max(2, round(part.height * .9))
        f2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); f2.alpha_composite(part.resize((part.width, nh), Image.NEAREST), (bb[0], H - nh))
    sheet = Image.new('RGBA', (W * 2, H), (0, 0, 0, 0)); sheet.paste(f1, (0, 0)); sheet.paste(f2, (W, 0))
    return sheet

def build(sil_dir, choices, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    meta = animals()
    for slug, (idx, flip) in choices.items():
        color, mv = meta[slug]
        if slug in HAND:                                         # dessiné à la main (tools/totem_hand.py)
            hand_sheet(HAND[slug], mv).save(os.path.join(out_dir, slug + '.png'), optimize=True); print(slug, 'main'); continue
        m = fit(silhouette(os.path.join(sil_dir, slug, f'{idx}.png'), flip))
        base = hexrgb(color)
        sheet = Image.new('RGBA', (W * 2, H), (0, 0, 0, 0))
        st = STRIPES.get(slug, 0)
        sheet.paste(paint(m, base, st), (0, 0)); sheet.paste(paint(frame2(m, mv), base, st), (W, 0))
        sheet.save(os.path.join(out_dir, slug + '.png'), optimize=True)
        print(slug, mv)

if __name__ == '__main__':
    build(sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3])
