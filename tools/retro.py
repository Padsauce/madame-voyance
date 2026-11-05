"""Pixel art aux palettes de consoles : 8 bits (NES) et 16 bits (Mega Drive, couleurs 9 bits)."""
import sys
from collections import Counter
from PIL import Image, ImageEnhance, ImageFilter
NES_HEX = """7C7C7C 0000FC 0000BC 4428BC 940084 A80020 A81000 881400 503000 007800 006800 005800 004058 000000
BCBCBC 0078F8 0058F8 6844FC D800CC E40058 F83800 E45C10 AC7C00 00B800 00A800 00A844 008888
F8F8F8 3CBCFC 6888FC 9878F8 F878F8 F85898 F87858 FCA044 F8B800 B8F818 58D854 58F898 00E8D8 787878
FCFCFC A4E4FC B8B8F8 D8B8F8 F8B8F8 F8A4C0 F0D0B0 FCE0A8 F8D878 D8F878 B8F8B8 B8F8D8 00FCFC F8D8F8""".split()
NES = sorted({tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) for h in NES_HEX})
def lab(c):
    def lin(v):
        v /= 255; return v / 12.92 if v <= 0.04045 else ((v + .055) / 1.055) ** 2.4
    r, g, b = (lin(v) for v in c)
    x = (r*.4124 + g*.3576 + b*.1805) / .95047; y = r*.2126 + g*.7152 + b*.0722; z = (r*.0193 + g*.1192 + b*.9505) / 1.08883
    f = lambda t: t ** (1/3) if t > .008856 else 7.787 * t + 16/116
    fx, fy, fz = f(x), f(y), f(z)
    return (116*fy - 16, 500*(fx - fy), 200*(fy - fz))
_LAB = {}
def dist(a, b):
    la = _LAB.get(a) or _LAB.setdefault(a, lab(a)); lb = _LAB.get(b) or _LAB.setdefault(b, lab(b))
    # CIE94, teinte renforcée : un pixel-artiste garde la teinte avant la saturation
    dL = la[0] - lb[0]; c1 = (la[1]**2 + la[2]**2) ** .5; c2 = (lb[1]**2 + lb[2]**2) ** .5; dC = c1 - c2
    dH2 = max(0, (la[1]-lb[1])**2 + (la[2]-lb[2])**2 - dC*dC)
    return dL*dL + (dC / (1 + .045*c1))**2 + 1.7 * dH2 / (1 + .015*c1)**2
def nearest(c, pal): return min(pal, key=lambda p: dist(c, p))
def snap9(c): return tuple(round(round(v / 255 * 7) * 255 / 7) for v in c)   # Mega Drive : 8 niveaux par canal
def retro(src, dst, kind):
    im = Image.open(src).convert('RGB')
    im = ImageEnhance.Color(im).enhance(1.2); im = ImageEnhance.Contrast(im).enhance(1.1)
    if kind == '8':  w, h, n, scale = 48, 82, 13, None
    else:            w, h, n, scale = 70, 120, 32, None
    im = im.filter(ImageFilter.MinFilter(3))          # épaissit l'encrage pour qu'il survive à la réduction
    small = im.resize((w, h), Image.BOX)
    if kind == '8':
        # chaque pixel vers la NES, puis on garde les n couleurs les plus présentes
        px = [nearest(c, NES) for c in small.getdata()]
        keep = [c for c, _ in Counter(px).most_common(n)]
        px = [c if c in keep else nearest(c, keep) for c in px]
        small = Image.new('RGB', (w, h)); small.putdata(px)
        out = small.resize((280, 480), Image.NEAREST)
    else:
        q = small.quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        pal = q.getpalette()[:n * 3]
        flat = [v for i in range(0, len(pal), 3) for v in snap9(tuple(pal[i:i+3]))]; flat += [0] * (768 - len(flat))
        q.putpalette(flat)
        out = q.convert('RGB').resize((280, 480), Image.NEAREST)
    out.save(dst, lossless=True) if dst.endswith('.webp') else out.save(dst)
if __name__ == '__main__':
    retro(sys.argv[1], sys.argv[2], sys.argv[3])
