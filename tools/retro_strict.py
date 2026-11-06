#!/usr/bin/env python3
"""Pixel art aux vraies contraintes des consoles, avec bandeau de titre redessiné.

NES (8 bits)        : 96×160 px, couleurs de la palette NES uniquement.
                      Une couleur de fond commune (noir) + 4 palettes de 3 couleurs.
                      Chaque bloc de 16×16 px n'utilise qu'une palette : 4 couleurs au plus, fond compris.
Mega Drive (16 bits): 144×240 px, couleurs 9 bits (8 niveaux par canal, 512 possibles).
                      Une couleur de fond commune + 4 palettes de 15 couleurs.
                      Chaque carreau de 8×8 px n'utilise qu'une palette.

Usage : python3 tools/retro_strict.py nes|md <dossier source> <dossier destination>
"""
import os, sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# ---------- Couleurs ----------
NES_HEX = """7C7C7C 0000FC 0000BC 4428BC 940084 A80020 A81000 881400 503000 007800 006800 005800 004058 000000
BCBCBC 0078F8 0058F8 6844FC D800CC E40058 F83800 E45C10 AC7C00 00B800 00A800 00A844 008888
F8F8F8 3CBCFC 6888FC 9878F8 F878F8 F85898 F87858 FCA044 F8B800 B8F818 58D854 58F898 00E8D8 787878
FCFCFC A4E4FC B8B8F8 D8B8F8 F8B8F8 F8A4C0 F0D0B0 FCE0A8 F8D878 D8F878 B8F8B8 B8F8D8 00FCFC F8D8F8""".split()
NES = np.array(sorted({tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) for h in NES_HEX}), float)
MD = np.array([(r, g, b) for r in range(8) for g in range(8) for b in range(8)], float) * 255 / 7

def to_lab(rgb):
    c = np.asarray(rgb, float) / 255
    c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)
    M = np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]])
    xyz = c @ M.T / np.array([.95047, 1, 1.08883])
    f = np.where(xyz > .008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def dist(P, C):
    """CIE94 avec la teinte renforcée. P : (n,3) Lab des pixels, C : (k,3) Lab des couleurs -> (n,k)."""
    dL = P[:, None, 0] - C[None, :, 0]
    c1 = np.hypot(P[:, 1], P[:, 2])[:, None]; c2 = np.hypot(C[:, 1], C[:, 2])[None, :]
    dC = c1 - c2
    da = P[:, None, 1] - C[None, :, 1]; db = P[:, None, 2] - C[None, :, 2]
    dH2 = np.maximum(0, da * da + db * db - dC * dC)
    return dL * dL + (dC / (1 + .045 * c1)) ** 2 + 1.7 * dH2 / (1 + .015 * c1) ** 2

# ---------- Police pixel 3×5 (accents sur 2 lignes au-dessus) ----------
G = {'A':'010101111101101','B':'110101110101110','C':'011100100100011','D':'110101101101110','E':'111100110100111',
     'F':'111100110100100','G':'011100101101011','H':'101101111101101','I':'111010010010111','J':'001001001101010',
     'K':'101101110101101','L':'100100100100111','M':'101111111101101','N':'110101101101101','O':'010101101101010',
     'P':'110101110100100','Q':'010101101110011','R':'110101110101101','S':'011100010001110','T':'111010010010010',
     'U':'101101101101111','V':'101101101101010','W':'101101111111101','X':'101101010101101','Y':'101101010010010',
     'Z':'111001010100111'}
ACC = {'É': ('E', '001010'), 'È': ('E', '100010'), 'Ê': ('E', '010101'), 'Â': ('A', '010101'), 'À': ('A', '100010')}
def text_mask(txt, scale=1):
    """Renvoie un tableau booléen (7*scale, largeur) du texte en capitales."""
    cols = []
    for ch in txt.upper():
        if ch == ' ': cols.append(np.zeros((7, 2), bool)); continue
        if ch in "'’": g = np.zeros((7, 1), bool); g[2:4, 0] = True; cols += [g, np.zeros((7, 1), bool)]; continue
        base, acc = ACC.get(ch, (ch, '000000'))
        bits = G.get(base, '000' * 5)
        g = np.zeros((7, 3), bool)
        g[0:2] = np.array([c == '1' for c in acc]).reshape(2, 3)
        g[2:7] = np.array([c == '1' for c in bits]).reshape(5, 3)
        cols += [g, np.zeros((7, 1), bool)]
    m = np.concatenate(cols[:-1] if cols else [np.zeros((7, 1), bool)], 1)
    return np.kron(m, np.ones((scale, scale), bool)) if scale > 1 else m

# ---------- Noms des cartes (identiques à src/data.js) ----------
MAJ = ["Le Mat","Le Bateleur","La Papesse","L'Impératrice","L'Empereur","Le Pape","L'Amoureux","Le Chariot","La Force","L'Ermite",
       "La Roue de Fortune","La Justice","Le Pendu","L'Arcane sans nom","La Tempérance","Le Diable","La Maison Dieu","L'Étoile",
       "La Lune","Le Soleil","Le Jugement","Le Monde"]
RANKS = ["As","Deux","Trois","Quatre","Cinq","Six","Sept","Huit","Neuf","Dix","Valet","Cavalier","Reine","Roi"]
SUIT = {'w': 'Bâtons', 'c': 'Coupes', 's': 'Épées', 'p': 'Deniers'}
def card_name(cid):
    if cid[0] == 'm': return MAJ[int(cid[1:])]
    s = SUIT[cid[0]]
    return RANKS[int(cid[1:]) - 1] + (" d'" if s[0] in 'AEIOUÉ' else ' de ') + s

# ---------- Préparation de l'image ----------
def prepare(src, w, h, sat=1.25):
    im = Image.open(src).convert('RGB')
    im = ImageEnhance.Color(im).enhance(sat); im = ImageEnhance.Contrast(im).enhance(1.1)
    im = im.filter(ImageFilter.MinFilter(3))                    # encrage épaissi : il survit à la réduction
    W, H = im.size; r = w / h                                     # recadrage au bon format
    if W / H > r: nw = round(H * r); im = im.crop(((W - nw) // 2, 0, (W - nw) // 2 + nw, H))
    else: nh = round(W / r); im = im.crop((0, (H - nh) // 2, W, (H - nh) // 2 + nh))
    return np.asarray(im.resize((w, h), Image.BOX), float)

# ---------- Optimisation des palettes par zone ----------
def solve(lab, h, w, tile, cand_lab, bg, n_pal, n_col, fixed_pal0, fixed_tiles):
    """lab : (h,w,3). Renvoie (palettes : liste d'indices de candidats, attribution des carreaux)."""
    th, tw = h // tile, w // tile
    tiles = lab.reshape(th, tile, tw, tile, 3).transpose(0, 2, 1, 3, 4).reshape(th * tw, tile * tile, 3)
    wgt = 1 + np.hypot(tiles[..., 1], tiles[..., 2]) / 30          # un graphiste garde d'abord les couleurs vives
    D = np.stack([dist(t, cand_lab) for t in tiles]) * wgt[..., None]   # (tiles, px, cand)
    Dbg = D[:, :, bg]
    def err(t_ids, pal):
        if len(t_ids) == 0: return 0.0
        m = np.minimum(Dbg[t_ids], D[t_ids][:, :, pal].min(-1) if pal else np.inf)
        return m.sum()
    def tile_err(pal):   # erreur de chaque carreau avec cette palette
        m = D[:, :, pal].min(-1) if pal else np.full(Dbg.shape, np.inf)
        return np.minimum(Dbg, m).sum(1)
    def best_palette(t_ids, start, fixed=()):
        pal = list(start)
        for _ in range(2):
            for i in range(len(pal)):
                if pal[i] in fixed: continue
                sub = D[t_ids]; base = np.minimum(Dbg[t_ids], sub[:, :, [p for j, p in enumerate(pal) if j != i]].min(-1) if len(pal) > 1 else np.inf)
                scores = np.minimum(base[:, :, None], sub).sum((0, 1))   # (cand,)
                pal[i] = int(scores.argmin())
        return pal
    def grow(t_ids, fixed=()):
        pal = list(fixed)
        while len(pal) < n_col:
            sub = D[t_ids]
            base = np.minimum(Dbg[t_ids], sub[:, :, pal].min(-1) if pal else np.inf)
            pal.append(int(np.minimum(base[:, :, None], sub).sum((0, 1)).argmin()))
        return best_palette(t_ids, pal, fixed)
    all_t = np.arange(len(tiles))
    fixed0 = tuple(fixed_pal0)
    pals = [grow(all_t, fixed0)]
    while len(pals) < n_pal:                                     # nouvelle palette pour les carreaux les plus mal servis
        e = np.min([tile_err(p) for p in pals], 0)
        worst = np.argsort(e)[-max(3, len(tiles) // 10):]
        pals.append(grow(worst))
    for _ in range(4):
        E = np.stack([tile_err(p) for p in pals])                # (n_pal, tiles)
        assign = E.argmin(0); assign[fixed_tiles] = 0
        new = []
        for k in range(n_pal):
            ids = np.where(assign == k)[0]
            new.append(best_palette(ids, pals[k], fixed0 if k == 0 else ()) if len(ids) else pals[k])
        pals = new
    E = np.stack([tile_err(p) for p in pals]); assign = E.argmin(0); assign[fixed_tiles] = 0
    return pals, assign, D

def solve_kmeans(lab, h, w, tile, cand_lab, bg, n_pal, n_col, fixed_pal0, fixed_tiles, iters=3, seed=1):
    """Pour les grandes palettes (Mega Drive) : k-moyennes par groupe de carreaux, puis arrondi aux couleurs 9 bits."""
    rng = np.random.default_rng(seed)
    th, tw = h // tile, w // tile
    tiles = lab.reshape(th, tile, tw, tile, 3).transpose(0, 2, 1, 3, 4).reshape(th * tw, tile * tile, 3).astype(np.float32)
    wgt = 1 + np.hypot(tiles[..., 1], tiles[..., 2]) / 30
    D = np.stack([dist(t, cand_lab) for t in tiles]).astype(np.float32) * wgt[..., None]
    Dbg = D[:, :, bg]
    feat = tiles.mean(1)
    cent = feat[rng.choice(len(feat), n_pal, replace=False)]
    for _ in range(8):
        assign = ((feat[:, None] - cent[None]) ** 2).sum(-1).argmin(1); assign[fixed_tiles] = 0
        cent = np.stack([feat[assign == k].mean(0) if (assign == k).any() else cent[k] for k in range(n_pal)])
    def tile_err(pal): return np.minimum(Dbg, D[:, :, pal].min(-1)).sum(1)
    pals = [None] * n_pal
    for it in range(iters):
        for k in range(n_pal):
            ids = np.where(assign == k)[0]
            if not len(ids): pals[k] = pals[k] or list(range(n_col)); continue
            px = tiles[ids].reshape(-1, 3); ww = wgt[ids].reshape(-1)
            keep = Dbg[ids].reshape(-1) > 60                          # le noir est déjà fourni par le fond commun
            if keep.sum() > n_col: px, ww = px[keep], ww[keep]
            fixed = [cand_lab[c] for c in fixed_pal0] if k == 0 else []
            nfree = n_col - len(fixed)
            c = px[rng.choice(len(px), min(nfree, len(px)), replace=False)]
            for _ in range(10):
                allc = np.concatenate([np.array(fixed).reshape(-1, 3), c]) if fixed else c
                lab_ = ((px[:, None] - allc[None]) ** 2).sum(-1).argmin(1) - len(fixed)
                c = np.stack([np.average(px[lab_ == j], axis=0, weights=ww[lab_ == j]) if (lab_ == j).any() else c[j] for j in range(len(c))])
            snapped = list(dict.fromkeys(int(dist(c[j:j+1].astype(float), cand_lab).argmin()) for j in range(len(c))))
            pals[k] = (list(fixed_pal0) if k == 0 else []) + [x for x in snapped if x not in fixed_pal0 and x != bg]
        E = np.stack([tile_err(p) for p in pals]); assign = E.argmin(0); assign[fixed_tiles] = 0
    return pals, assign, D

def render(h, w, tile, pals, assign, D, bg):
    th, tw = h // tile, w // tile
    out = np.zeros((th * tw, tile * tile), int)
    for t in range(th * tw):
        allowed = [bg] + pals[assign[t]]
        out[t] = np.array(allowed)[D[t][:, allowed].argmin(-1)]
    return out.reshape(th, tw, tile, tile).transpose(0, 2, 1, 3).reshape(h, w)

def despeckle(idx, tile, assign, pals, bg, passes=1):
    """Retouche : un pixel seul de sa couleur prend la couleur majoritaire de ses voisins, si sa palette le permet."""
    h, w = idx.shape; tw = w // tile
    for _ in range(passes):
        new = idx.copy()
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                c = idx[y, x]; nb = [idx[y-1, x], idx[y+1, x], idx[y, x-1], idx[y, x+1]]
                if c in nb: continue
                vals, cnt = np.unique(nb, return_counts=True)
                if cnt.max() < 3: continue
                v = vals[cnt.argmax()]
                if v == bg or v in pals[assign[(y // tile) * tw + x // tile]]: new[y, x] = v
        idx = new
    return idx

def draw_band(idx, name, light, dark, scale, top):
    """Bandeau de titre redessiné : fond clair, filet et texte foncés."""
    h, w = idx.shape
    idx[top] = dark; idx[top + 1:h - 1] = light; idx[h - 1] = dark
    m = text_mask(name, scale)
    if m.shape[1] > w - 4 and scale > 1:                         # trop long : police resserrée en largeur
        m = np.kron(text_mask(name), np.ones((scale, 1), bool))
    if m.shape[1] > w - 4:                                       # toujours trop long : on retire l'article
        short = name.split(' ', 1)[1] if ' ' in name else name
        m = np.kron(text_mask(short), np.ones((scale, 1), bool)) if scale > 1 else text_mask(short)
    th = h - 1 - (top + 1)
    y0 = top + 1 + (th - m.shape[0]) // 2; x0 = (w - m.shape[1]) // 2
    reg = idx[y0:y0 + m.shape[0], x0:x0 + m.shape[1]]
    reg[m[:, :reg.shape[1]]] = dark
    return idx

def convert(kind, src, dst, cid):
    if kind == 'nes':
        w, h, tile, n_pal, n_col, scale, font = 96, 160, 16, 4, 3, 3, 1
        cand = NES
    else:
        w, h, tile, n_pal, n_col, scale, font = 144, 240, 8, 4, 15, 2, 2
        cand = MD
    rgb = prepare(src, w, h, sat=1.8 if kind == 'nes' else 1.25)   # NES : teintes franches, sinon les tons pâles tombent dans les gris
    lab = to_lab(rgb)
    cand_lab = to_lab(cand)
    black = int(np.argmin(cand.sum(1)))
    light = int(np.argmin(((cand - np.array([252, 224, 168])) ** 2).sum(1)))   # crème du bandeau
    band_top = h - (11 if kind == 'nes' else 18)
    th, tw = h // tile, w // tile
    fixed_tiles = np.array([t for t in range(th * tw) if (t // tw + 1) * tile > band_top])
    if kind == 'nes':
        # Fond commun : on essaie le noir et les couleurs dominantes de la carte, on garde le meilleur rendu.
        near = dist(lab.reshape(-1, 3), cand_lab).argmin(1)
        tries = list(dict.fromkeys([black] + [int(c) for c in np.bincount(near, minlength=len(cand)).argsort()[::-1][:3]]))
        best = None
        for bg in tries:
            fixed = [light] if bg == black else [light, black]       # le bandeau a besoin du crème et du noir
            pals, assign, D = solve(lab, h, w, tile, cand_lab, bg, n_pal, n_col, fixed, fixed_tiles)
            err = sum(D[t][:, [bg] + pals[assign[t]]].min(-1).sum() for t in range(th * tw))
            if best is None or err < best[0]: best = (err, bg, pals, assign, D)
        _, bg, pals, assign, D = best
    else:
        bg = black
        pals, assign, D = solve_kmeans(lab, h, w, tile, cand_lab, bg, n_pal, n_col, [light], fixed_tiles)
    idx = render(h, w, tile, pals, assign, D, bg)
    idx = despeckle(idx, tile, assign, pals, bg, passes=2 if kind == 'nes' else 1)
    idx = draw_band(idx, card_name(cid), light, black, font, band_top)
    img = Image.fromarray(cand[idx].astype(np.uint8), 'RGB').resize((w * scale, h * scale), Image.NEAREST)
    img.save(dst, lossless=True, method=6)
    return pals, assign

if __name__ == '__main__':
    kind, sdir, ddir = sys.argv[1], sys.argv[2], sys.argv[3]
    only = sys.argv[4:]
    os.makedirs(ddir, exist_ok=True)
    for f in sorted(os.listdir(sdir)):
        cid = f.split('.')[0]
        if only and cid not in only: continue
        convert(kind, os.path.join(sdir, f), os.path.join(ddir, cid + '.webp'), cid)
        print(cid, flush=True)
