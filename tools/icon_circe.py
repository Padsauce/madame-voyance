"""Icônes « L'Oracle de Circé » : soleil et lune avec visages (Circé, fille d'Hélios, oracle de la nuit).
Trois propositions en SVG, rendues en PNG par Chromium :
  D « Le baiser »        : croissant de profil face au soleil qui sourit (motif classique du tarot) ;
  E « Jour et nuit »     : un seul visage, moitié soleil doré, moitié lune sombre ;
  F « Le berceau »       : grand croissant de profil qui berce un petit soleil endormi.
Usage : python3 tools/icon_circe.py <dossier sortie>  → D.png, D-mask.png, etc."""
import asyncio, math, sys
from playwright.async_api import async_playwright

INK = '#5a3410'          # traits du visage sur l'or
ROSE = '#ef8f6f'

def sparkle(x, y, r, o=1):
    return f'<path d="M{x} {y-r} Q{x} {y} {x+r} {y} Q{x} {y} {x} {y+r} Q{x} {y} {x-r} {y} Q{x} {y} {x} {y-r}Z" fill="url(#gold)" opacity="{o}"/>'

def spline(pts):
    """Catmull-Rom → courbes de Bézier, à partir du premier point (déjà atteint)."""
    d = ''
    for i in range(len(pts) - 1):
        p0 = pts[max(i - 1, 0)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(i + 2, len(pts) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d

# profil du croissant (repère : centre 0,0, rayon 1, ouverture à droite), du bas vers le haut
PROFILE = [(0.30, 0.95), (0.08, 0.80), (-0.04, 0.58), (-0.03, 0.47), (0.05, 0.41), (0.00, 0.35), (0.07, 0.28),
           (0.03, 0.20), (0.17, 0.11), (0.00, -0.04), (-0.07, -0.13), (-0.03, -0.25), (-0.07, -0.46), (0.05, -0.76), (0.30, -0.95)]

def crescent(cx, cy, R, flip=False):
    """Croissant à visage de profil (regarde à droite ; flip = à gauche)."""
    sx = -1 if flip else 1
    P = lambda x, y: (cx + sx * x * R, cy + y * R)
    T, B = P(0.30, -0.95), P(0.30, 0.95)
    inner = [P(x, y) for x, y in PROFILE]
    body = f'<path d="M{T[0]:.1f} {T[1]:.1f} A{R} {R} 0 1 {1 if flip else 0} {B[0]:.1f} {B[1]:.1f}{spline(inner)} Z" fill="url(#gold)"/>'
    ex, ey = P(-0.30, -0.12); w = 0.13 * R
    eye = (f'<path d="M{ex - w:.1f} {ey:.1f} Q{ex:.1f} {ey + w * 0.9:.1f} {ex + w:.1f} {ey:.1f}" fill="none" stroke="{INK}" stroke-width="{R*0.035:.1f}" stroke-linecap="round"/>'
           + ''.join(f'<path d="M{ex + k * w * 0.6:.1f} {ey + w * 0.45:.1f} l{k * w * 0.25:.1f} {w * 0.4:.1f}" stroke="{INK}" stroke-width="{R*0.025:.1f}" stroke-linecap="round"/>' for k in (-1, 0, 1)))
    bx, by = P(-0.26, -0.32)
    brow = f'<path d="M{bx - w:.1f} {by + w*0.25:.1f} Q{bx:.1f} {by - w*0.35:.1f} {bx + w:.1f} {by + w*0.15:.1f}" fill="none" stroke="{INK}" stroke-width="{R*0.025:.1f}" stroke-linecap="round" opacity=".7"/>'
    kx, ky = P(-0.24, 0.20)
    cheek = f'<circle cx="{kx:.1f}" cy="{ky:.1f}" r="{R*0.11:.1f}" fill="{ROSE}" opacity=".45"/>'
    mx, my = P(-0.01, 0.35); m2x, m2y = P(-0.13, 0.33)
    smile = f'<path d="M{mx:.1f} {my:.1f} Q{(mx+m2x)/2:.1f} {my + R*0.03:.1f} {m2x:.1f} {m2y:.1f}" fill="none" stroke="{INK}" stroke-width="{R*0.03:.1f}" stroke-linecap="round"/>'
    return body + cheek + eye + brow + smile

def sun_rays(cx, cy, r, n=16, long=1.42, short=1.12, half=None):
    pts = []
    for i in range(n * 2):
        a = math.pi * i / n - math.pi / 2
        rr = r * (long if i % 2 == 0 else short)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'
    return f'<path d="{d}" fill="url(#gold)" stroke="url(#gold)" stroke-width="{r*0.06:.1f}" stroke-linejoin="round"/>'

def sun_face(cx, cy, r, asleep=True, ink=INK):
    w = r * 0.17; ey = cy - r * 0.08
    eyes = ''.join(f'<path d="M{x - w:.1f} {ey:.1f} Q{x:.1f} {ey + (w*0.9 if asleep else -w*0.9):.1f} {x + w:.1f} {ey:.1f}" fill="none" stroke="{ink}" stroke-width="{r*0.06:.1f}" stroke-linecap="round"/>' for x in (cx - r * 0.36, cx + r * 0.36))
    cheeks = ''.join(f'<circle cx="{x:.1f}" cy="{cy + r*0.22:.1f}" r="{r*0.15:.1f}" fill="{ROSE}" opacity=".45"/>' for x in (cx - r * 0.5, cx + r * 0.5))
    mouth = f'<path d="M{cx - r*0.22:.1f} {cy + r*0.36:.1f} Q{cx:.1f} {cy + r*0.56:.1f} {cx + r*0.22:.1f} {cy + r*0.36:.1f}" fill="none" stroke="{ink}" stroke-width="{r*0.06:.1f}" stroke-linecap="round"/>'
    nose = f'<path d="M{cx:.1f} {cy + r*0.02:.1f} Q{cx + r*0.08:.1f} {cy + r*0.16:.1f} {cx - r*0.02:.1f} {cy + r*0.2:.1f}" fill="none" stroke="{ink}" stroke-width="{r*0.04:.1f}" stroke-linecap="round" opacity=".7"/>'
    return cheeks + eyes + nose + mouth

STARS = [(70,90,1.6),(120,430,1.2),(430,80,1.4),(460,300,1.1),(60,300,1.3),(390,450,1.5),(250,40,1.1),(150,60,1),(470,190,1),(40,190,1.2),(330,480,1),(190,490,1.2)]
DEFS = '''<defs>
<radialGradient id="bg" cx="50%" cy="44%" r="72%"><stop offset="0" stop-color="#4b2a95"/><stop offset=".55" stop-color="#2a1662"/><stop offset="1" stop-color="#160b31"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcf0c4"/><stop offset=".45" stop-color="#e9c274"/><stop offset="1" stop-color="#c08a33"/></linearGradient>
<radialGradient id="night" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#3e2f86"/><stop offset="1" stop-color="#140b33"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#b98cff" stop-opacity=".5"/><stop offset="1" stop-color="#b98cff" stop-opacity="0"/></radialGradient>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feColorMatrix in="b" values="1 0 0 0 .1  0 .8 0 0 .05  0 0 .4 0 0  0 0 0 .7 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>'''

def frame(inner, ring=True, scale=1):
    stars = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity=".75"/>' for x, y, r in STARS)
    ringsvg = '<circle cx="256" cy="256" r="206" fill="none" stroke="url(#gold)" stroke-width="4" opacity=".75"/>' if ring else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">{DEFS}
<rect width="512" height="512" fill="url(#bg)"/>{stars}
<g transform="translate(256 256) scale({scale}) translate(-256 -256)">{ringsvg}<circle cx="256" cy="256" r="170" fill="url(#halo)"/>{inner}</g></svg>'''

# D. Le baiser : le soleil (à droite) sourit les yeux clos, le croissant de profil le regarde
D = f'''<g filter="url(#glow)">{sun_rays(318, 236, 80)}<circle cx="318" cy="236" r="80" fill="url(#gold)"/></g>
{sun_face(318, 236, 80)}
<g filter="url(#glow)"><g stroke="#2a1662" stroke-width="10">{crescent(206, 280, 132).split('/>')[0]}/></g></g>
{crescent(206, 280, 132)}
{sparkle(392,380,16)}{sparkle(120,120,12,.9)}{sparkle(406,108,9,.8)}'''

# E. Jour et nuit : un seul visage, moitié soleil, moitié lune sombre
cx, cy, r = 256, 256, 106
E = f'''<clipPath id="lh"><rect x="0" y="0" width="{cx}" height="512"/></clipPath><clipPath id="rh"><rect x="{cx}" y="0" width="{512-cx}" height="512"/></clipPath>
<g clip-path="url(#lh)" filter="url(#glow)">{sun_rays(cx, cy, r, n=18, long=1.4, short=1.1)}<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#gold)"/></g>
<g clip-path="url(#rh)"><circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#night)" stroke="url(#gold)" stroke-width="6"/>
  <circle cx="{cx+56}" cy="{cy-52}" r="12" fill="#4a3a96" opacity=".7"/><circle cx="{cx+76}" cy="{cy+44}" r="8" fill="#4a3a96" opacity=".7"/><circle cx="{cx+34}" cy="{cy+74}" r="6" fill="#4a3a96" opacity=".7"/></g>
<line x1="{cx}" y1="{cy-r}" x2="{cx}" y2="{cy+r}" stroke="url(#gold)" stroke-width="3" opacity=".6"/>
<g clip-path="url(#lh)">{sun_face(cx, cy, r)}</g>
<g clip-path="url(#rh)">{sun_face(cx, cy, r, ink="#f3d58e").replace(ROSE, "#9b7be0")}</g>
{sparkle(400,392,15)}{sparkle(408,128,11,.9)}{sparkle(116,404,9,.8)}'''

# F. Le berceau : grand croissant de profil qui berce un petit soleil endormi
F = f'''<g filter="url(#glow)">{crescent(232, 262, 150)}</g>{crescent(232, 262, 150)}
<g filter="url(#glow)">{sun_rays(326, 300, 44, n=12, long=1.45, short=1.12)}<circle cx="326" cy="300" r="44" fill="url(#gold)"/></g>{sun_face(326, 300, 44)}
{sparkle(386,150,18)}{sparkle(412,250,10,.9)}{sparkle(352,410,9,.8)}'''

VAR = {'D': D, 'E': E, 'F': F}

async def main(out):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 512, 'height': 512})
        for k, v in VAR.items():
            for ring, sc, suf in ((True, 1, ''), (False, .8, '-mask')):
                await pg.set_content(f'<html><body style="margin:0">{frame(v, ring, sc)}</body></html>')
                await pg.screenshot(path=f'{out}/{k}{suf}.png', clip={'x': 0, 'y': 0, 'width': 512, 'height': 512})
        await b.close()

if __name__ == '__main__':
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else '.'))
