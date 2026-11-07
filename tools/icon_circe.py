"""Icônes « L'Oracle de Circé » : 3 propositions en SVG (A coupe, B lune et soleil, C œil), rendues en PNG par Chromium.
Usage : python3 tools/icon_circe.py <dossier sortie>  → A.png, A-mask.png, etc. L'icône en place est A."""
import asyncio, sys
from playwright.async_api import async_playwright

def sparkle(x, y, r, o=1):
    return f'<path d="M{x} {y-r} Q{x} {y} {x+r} {y} Q{x} {y} {x} {y+r} Q{x} {y} {x-r} {y} Q{x} {y} {x} {y-r}Z" fill="url(#gold)" opacity="{o}"/>'

STARS = [(70,90,1.6),(120,430,1.2),(430,80,1.4),(460,300,1.1),(60,300,1.3),(390,450,1.5),(250,40,1.1),(150,60,1),(470,190,1),(40,190,1.2),(330,480,1),(190,490,1.2)]
def defs():
    return '''<defs>
<radialGradient id="bg" cx="50%" cy="44%" r="72%"><stop offset="0" stop-color="#4b2a95"/><stop offset=".55" stop-color="#2a1662"/><stop offset="1" stop-color="#160b31"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcf0c4"/><stop offset=".45" stop-color="#e9c274"/><stop offset="1" stop-color="#b5832e"/></linearGradient>
<radialGradient id="potion" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#c9a6ff"/><stop offset=".6" stop-color="#7a4fd6"/><stop offset="1" stop-color="#3d2290"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#b98cff" stop-opacity=".55"/><stop offset="1" stop-color="#b98cff" stop-opacity="0"/></radialGradient>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feColorMatrix in="b" values="1 0 0 0 .1  0 .8 0 0 .05  0 0 .4 0 0  0 0 0 .75 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>'''

def frame(inner, ring=True, scale=1):
    stars = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity=".75"/>' for x, y, r in STARS)
    ringsvg = '<circle cx="256" cy="256" r="206" fill="none" stroke="url(#gold)" stroke-width="4" opacity=".75"/>' if ring else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">{defs()}
<rect width="512" height="512" fill="url(#bg)"/>{stars}
<g transform="translate(256 256) scale({scale}) translate(-256 -256)">{ringsvg}<circle cx="256" cy="250" r="170" fill="url(#halo)"/>{inner}</g></svg>'''

# A. La coupe de Circé : coupe de potion, fumée qui devient lune et étoiles
A = f'''<g filter="url(#glow)">
<path d="M256 262 C226 232 292 210 258 178 C236 158 246 138 262 130" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round" opacity=".9"/>
<mask id="cr"><rect width="512" height="512" fill="#fff"/><circle cx="282" cy="96" r="34" fill="#000"/></mask>
<circle cx="262" cy="108" r="38" fill="url(#gold)" mask="url(#cr)"/>
<path d="M172 266 H340 C340 334 304 368 256 370 C208 368 172 334 172 266 Z" fill="url(#gold)"/>
<path d="M194 290 C197 314 207 332 222 344" fill="none" stroke="#fff7dc" stroke-width="6" stroke-linecap="round" opacity=".4"/>
<ellipse cx="256" cy="266" rx="84" ry="16" fill="url(#gold)"/><ellipse cx="256" cy="266" rx="72" ry="10" fill="url(#potion)"/>
<path d="M247 368 L244 418 H268 L265 368 Z" fill="url(#gold)"/><ellipse cx="256" cy="392" rx="15" ry="7" fill="url(#gold)"/>
<path d="M200 434 Q256 410 312 434 Q256 446 200 434 Z" fill="url(#gold)"/>
</g>
{sparkle(176,170,20)}{sparkle(342,190,15)}{sparkle(338,104,9,.9)}{sparkle(196,232,8,.8)}{sparkle(318,316,0,0)}'''

# B. Lune et soleil : un croissant en forme de C (Circé) qui tient le soleil d'Hélios, son père
rays = ''.join(f'<rect x="298" y="190" width="6" height="18" rx="3" fill="url(#gold)" transform="rotate({a} 301 250)"/>' for a in range(0, 360, 30))
B = f'''<g filter="url(#glow)">
<mask id="cb"><rect width="512" height="512" fill="#fff"/><circle cx="306" cy="236" r="132" fill="#000"/></mask>
<circle cx="250" cy="262" r="154" fill="url(#gold)" mask="url(#cb)"/>
{rays}<circle cx="301" cy="250" r="34" fill="url(#gold)"/>
</g>
{sparkle(372,150,20)}{sparkle(394,330,13)}{sparkle(330,388,9,.9)}{sparkle(148,110,10,.8)}'''

# C. L'œil de l'oracle : œil en amande, iris soleil
irays = ''.join(f'<rect x="253" y="168" width="6" height="22" rx="3" fill="url(#gold)" transform="rotate({a} 256 256)"/>' for a in range(0, 360, 30))
C = f'''<g filter="url(#glow)">
<path d="M84 256 Q256 96 428 256 Q256 416 84 256 Z" fill="#1b0f3e" stroke="url(#gold)" stroke-width="12" stroke-linejoin="round"/>
<clipPath id="eye"><path d="M84 256 Q256 96 428 256 Q256 416 84 256 Z"/></clipPath>
<g clip-path="url(#eye)">{irays}<circle cx="256" cy="256" r="58" fill="url(#gold)"/><circle cx="256" cy="256" r="30" fill="url(#potion)"/><circle cx="244" cy="244" r="9" fill="#fff" opacity=".85"/></g>
<path d="M150 170 L132 140 M200 140 L192 108 M256 130 L256 96 M312 140 L320 108 M362 170 L380 140" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>
</g>
{sparkle(400,380,18)}{sparkle(112,372,12)}{sparkle(420,110,9,.9)}'''

VAR = {'A': A, 'B': B, 'C': C}
async def main(out):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 512, 'height': 512})
        for k, v in VAR.items():
            for ring, sc, suf in ((True, 1, ''), (False, .8, '-mask')):
                await pg.set_content(f'<html><body style="margin:0">{frame(v, ring, sc)}</body></html>')
                await pg.screenshot(path=f'{out}/{k}{suf}.png', clip={'x':0,'y':0,'width':512,'height':512})
        await b.close()
asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else '.'))
