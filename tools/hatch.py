#!/usr/bin/env python3
"""Jeu « Encre » : la carte redessinée en hachures de stylos de couleur sur papier crème.

Chaque zone de couleur de la carte source devient un réseau de traits d'un seul stylo :
- zones très claires : papier laissé blanc (comme les nuages réservés) ;
- zones moyennes : hachures dans un sens ;
- zones sombres : quadrillage, plus serré quand c'est plus foncé.
Les contours d'origine restent tracés à l'encre sombre. Le titre français est écrit sous l'image.

Usage : python3 tools/hatch.py <dossier source> <dossier destination> [ids…]
"""
import os, sys, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance

sys.path.insert(0, os.path.dirname(__file__))
from retro_strict import to_lab, card_name

OUT_W, OUT_H = 350, 600          # image finale (format des cartes de l'app)
SS = 2                           # sur-échantillonnage pour des traits nets
PAPER = np.array([246, 240, 228], float)
# Stylos (proches de la référence : turquoise, bleus, indigo, verts, rouge, brun, plus quelques teintes du tarot)
PENS = {
    'turquoise': (44, 170, 160), 'ciel': (52, 140, 210), 'outremer': (40, 70, 170), 'indigo': (52, 44, 140),
    'violet': (120, 70, 160), 'vert': (100, 175, 60), 'sapin': (40, 110, 70), 'rouge': (200, 40, 45),
    'rose': (220, 90, 130), 'orange': (230, 120, 40), 'ocre': (215, 160, 30), 'brun': (120, 62, 48), 'gris': (110, 110, 120),
}
PEN_RGB = np.array(list(PENS.values()), float)
INK = np.array([40, 34, 70], float)   # encre des contours : indigo très sombre

def smooth_noise(h, w, scale, seed):
    rng = np.random.default_rng(seed)
    small = rng.standard_normal((h // scale + 3, w // scale + 3)).astype(np.float32)
    im = Image.fromarray(small).resize((w + 3 * scale, h + 3 * scale), Image.BICUBIC)
    return np.asarray(im)[:h, :w]

def kmeans(X, k, iters=12, seed=0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(iters):
        lab = ((X[:, None] - C[None]) ** 2).sum(-1).argmin(1)
        C = np.stack([X[lab == j].mean(0) if (lab == j).any() else C[j] for j in range(k)])
    return C, lab

def hatch(src, dst, cid, seed=None):
    seed = seed if seed is not None else sum(map(ord, cid))
    W, H = OUT_W * SS, OUT_H * SS
    m = 16 * SS                                                  # marge de papier
    art_box = (m, m, W - m, H - 64 * SS)                         # zone dessinée ; titre en dessous
    aw, ah = art_box[2] - art_box[0], art_box[3] - art_box[1]

    im = Image.open(src).convert('RGB')
    sw, sh = im.size
    im = im.crop((round(sw * .015), round(sh * .01), round(sw * .985), round(sh * .905)))   # retire le bandeau anglais
    im = ImageEnhance.Color(im).enhance(1.35)
    big = im.resize((aw, ah), Image.LANCZOS)
    rgb = np.asarray(big, float)

    # Contours : les traits noirs d'origine, un peu affinés
    L = to_lab(rgb)[..., 0]
    ink = (L < 36).astype(np.uint8) * 255
    ink = Image.fromarray(ink).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))   # retire les points isolés
    ink = np.asarray(ink.filter(ImageFilter.GaussianBlur(.7)), float) / 255

    # Zones de couleur : couleurs lissées puis k-moyennes
    soft = np.asarray(big.filter(ImageFilter.MedianFilter(9)).resize((aw // 6, ah // 6), Image.BOX), float)
    lab_s = to_lab(soft).reshape(-1, 3)
    dark = lab_s[:, 0] < 30
    C, lab_id = kmeans(lab_s[~dark] if (~dark).sum() > 50 else lab_s, 9, seed=seed)
    ids = np.full(len(lab_s), -1); ids[~dark] = lab_id
    # pixels sombres : rattachés à la zone la plus proche en teinte
    if dark.any():
        ids[dark] = ((lab_s[dark][:, None, 1:] - C[None, :, 1:]) ** 2).sum(-1).argmin(1)
    zone = Image.fromarray(ids.reshape(soft.shape[:2]).astype(np.uint8)).resize((aw, ah), Image.NEAREST)
    zone = np.asarray(zone.filter(ImageFilter.ModeFilter(9)))

    # Stylo de chaque zone : la teinte la plus proche, en Lab
    pen_lab = to_lab(PEN_RGB)
    yy, xx = np.mgrid[0:ah, 0:aw].astype(np.float32)
    wob = smooth_noise(ah, aw, 40 * SS, seed) * 1.6 * SS        # tremblé de la main
    canvas = np.ones((ah, aw, 3), np.float32)                     # facteur multiplicatif sur le papier
    angles = [0, 45, -45, 90, 30, -60, 60, -30, 15]
    rng = np.random.default_rng(seed)
    order = rng.permutation(len(angles))
    for j, c in enumerate(C):
        mask = (zone == j)
        if not mask.any(): continue
        Lz, chroma = c[0], math.hypot(c[1], c[2])
        if Lz > 86 and chroma < 22: continue                      # très clair : papier réservé
        if chroma < 10:
            pen = PENS['gris'] if Lz > 45 else PENS['indigo']
        else:
            d = ((pen_lab[:, 1:] - c[1:]) ** 2).sum(1) + .04 * (pen_lab[:, 0] - c[0]) ** 2   # la teinte prime sur la clarté
            pen = PEN_RGB[d.argmin()]
        # densité selon la clarté
        if Lz > 78:   spacing, cross, width = 5.5, False, 1.4
        elif Lz > 62: spacing, cross, width = 4.6, False, 1.5
        elif Lz > 45: spacing, cross, width = 4.6, True, 1.5
        else:         spacing, cross, width = 3.8, True, 1.6
        spacing *= SS; width *= SS
        a = math.radians(angles[order[j % len(angles)]])
        def lines(theta, phase):
            t = xx * math.cos(theta) + yy * math.sin(theta) + wob + phase
            f = np.abs(((t / spacing) % 1) - .5) * spacing          # distance au trait le plus proche
            return np.clip(width / 2 + .5 - (spacing / 2 - f), 0, 1)
        stroke = lines(a, rng.uniform(0, spacing))
        if cross: stroke = np.maximum(stroke, lines(a + math.radians(rng.choice([60, 90, 120])), rng.uniform(0, spacing)))
        alpha = stroke * mask
        tint = 1 - alpha[..., None] * (1 - pen / PAPER)            # encre en multiplication sur le papier
        canvas *= tint
    canvas *= 1 - ink[..., None] * .95 * (1 - INK / PAPER)

    out = np.ones((H, W, 3), np.float32) * PAPER
    out[art_box[1]:art_box[3], art_box[0]:art_box[2]] = PAPER * canvas
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

    # Titre à l'encre indigo, en capitales espacées
    d = ImageDraw.Draw(img)
    name = card_name(cid).upper()
    size = 19 * SS
    font_path = '/usr/share/fonts/truetype/crosextra/Caladea-Bold.ttf'
    if not os.path.exists(font_path): font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
    while True:
        f = ImageFont.truetype(font_path, size)
        spaced = '\u2009'.join(name) if len(name) <= 14 else name
        tw = d.textlength(spaced, font=f)
        if tw <= W - 2 * m or size < 12 * SS: break
        size -= SS
    ty = art_box[3] + (H - art_box[3]) // 2
    d.text((W // 2, ty), spaced, font=f, fill=tuple(int(v) for v in INK), anchor='mm')
    img = img.resize((OUT_W, OUT_H), Image.LANCZOS)
    img.save(dst, quality=82, method=6)

if __name__ == '__main__':
    sdir, ddir = sys.argv[1], sys.argv[2]; only = sys.argv[3:]
    os.makedirs(ddir, exist_ok=True)
    for f in sorted(os.listdir(sdir)):
        cid = f.split('.')[0]
        if only and cid not in only: continue
        hatch(os.path.join(sdir, f), os.path.join(ddir, cid + '.webp'), cid)
        print(cid, flush=True)
