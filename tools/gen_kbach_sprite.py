"""Generates the Kbach Khmer sprite component (original artwork).
Run: python3 tools/gen_kbach_sprite.py  →  src/app/shared/components/kbach-sprite/kbach-sprite.ts
"""
import math, json

def rot(cx, cy, a): return f'rotate({a} {cx} {cy})'

GRAD = '''
<linearGradient id="k-gold" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#8C5D28"/><stop offset=".28" stop-color="#D9AD62"/>
  <stop offset=".5" stop-color="#F1D699"/><stop offset=".72" stop-color="#B88643"/>
  <stop offset="1" stop-color="#8C5D28"/></linearGradient>
<linearGradient id="k-gold-v" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="#8C5D28"/><stop offset=".45" stop-color="#C99A50"/>
  <stop offset=".8" stop-color="#E8C783"/><stop offset="1" stop-color="#D9AD62"/></linearGradient>
<linearGradient id="k-gold-h" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#B88643" stop-opacity="0"/><stop offset=".3" stop-color="#B88643"/>
  <stop offset=".5" stop-color="#E8C783"/><stop offset=".7" stop-color="#B88643"/>
  <stop offset="1" stop-color="#B88643" stop-opacity="0"/></linearGradient>
<linearGradient id="r-petal" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="#FFF3EE"/><stop offset=".45" stop-color="#F8D2D8"/>
  <stop offset="1" stop-color="#EBA3B2"/></linearGradient>
<linearGradient id="r-petal-in" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="#FFFDF9"/><stop offset="1" stop-color="#F3B9C4"/></linearGradient>
<linearGradient id="r-leaf" x1="0" y1="1" x2="1" y2="0">
  <stop offset="0" stop-color="#7C8E5E"/><stop offset="1" stop-color="#B2C095"/></linearGradient>
'''

# ── Kbach primitives (all drawn around the origin, pointing up) ─────────
FLAME = '''
<g id="k-flame">
  <path fill="url(#k-gold-v)" stroke="#8C5D28" stroke-width=".9" stroke-linejoin="round"
   d="M0 0C-15-12-22-34-14-54C-10-64-13-72-8-84C-3-77-1-70-3-62C4-70 7-82 2-98C15-84 20-66 15-48C21-52 26-60 25-70C34-52 29-30 16-16C11-9 6-4 0 0Z"/>
  <path fill="none" stroke="#FFF3D0" stroke-opacity=".75" stroke-width="1" stroke-linecap="round"
   d="M-1-8C-8-24-9-42-5-58M5-14C14-26 17-42 15-54"/>
  <path fill="none" stroke="#6E4519" stroke-opacity=".7" stroke-width=".9" stroke-linecap="round"
   d="M1-6C-3-30-1-60 1-90"/>
</g>
<g id="k-flame-s">
  <path fill="url(#k-gold-v)" stroke="#8C5D28" stroke-width=".9" stroke-linejoin="round"
   d="M0 0C-9-9-12-24-6-38C-3-30-2-24-3-18C4-28 6-40 2-54C12-40 14-24 9-12C6-6 3-3 0 0Z"/>
  <path fill="none" stroke="#6E4519" stroke-opacity=".6" stroke-width=".8" d="M1-5C-1-22 0-38 1-50"/>
</g>
'''

ROSETTE = '''
<g id="k-rosette">
  <g fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".8" stroke-linejoin="round">
    %s
    %s
  </g>
  <circle r="14" fill="#FFF8F0" stroke="url(#k-gold)" stroke-width="2.2"/>
  <circle r="9.5" fill="none" stroke="#B88643" stroke-width=".8" stroke-dasharray="1.4 2.2"/>
  <circle r="5" fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".7"/>
</g>
''' % (
  ''.join(f'<path transform="rotate({a})" d="M0-46C9-36 9-24 0-15C-9-24-9-36 0-46Z"/>' for a in range(0,360,45)),
  ''.join(f'<path transform="rotate({a})" d="M0-30C5-24 5-19 0-15C-5-19-5-24 0-30Z" fill="#FFF3D0" fill-opacity=".85"/>' for a in range(22,360,45)),
)

SPIRE = '''
<g id="k-spire">
  <path d="M0-132L3-104H-3Z" fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".7"/>
  <path fill="url(#k-gold-v)" stroke="#8C5D28" stroke-width=".9" stroke-linejoin="round"
   d="M0-110C7-98 13-88 12-76C11-66 5-62 0-58C-5-62-11-66-12-76C-13-88-7-98 0-110Z"/>
  <path fill="none" stroke="#FFF3D0" stroke-opacity=".8" stroke-width=".9" d="M0-102C5-92 8-84 7-76M0-102C-5-92-8-84-7-76M0-96V-64"/>
  <path fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".8" d="M-9-58H9L7-52H-7Z"/>
  <path fill="url(#k-gold-v)" stroke="#8C5D28" stroke-width=".8" d="M-5-52H5C7-34 4-18 0 0C-4-18-7-34-5-52Z"/>
  <path fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".8" d="M-12-38C-4-44 4-44 12-38C6-32-6-32-12-38Z"/>
  <use href="#k-flame-s" transform="translate(-6 -50) rotate(-38) scale(.9)"/>
  <use href="#k-flame-s" transform="translate(6 -50) rotate(38) scale(.9) scale(-1 1)"/>
  <use href="#k-flame-s" transform="translate(-4 -62) rotate(-22) scale(.8)"/>
  <use href="#k-flame-s" transform="translate(4 -62) rotate(22) scale(-.8 .8)"/>
</g>
'''

# spiral scroll vine ending in a curl; flames sprout along the outside
SCROLL = '''
<g id="k-scroll">
  <path fill="none" stroke="url(#k-gold)" stroke-width="4.2" stroke-linecap="round"
   d="M0 0C34-10 70 4 80 34C88 58 64 76 46 64C32 55 38 36 54 38C63 39 64 50 57 52"/>
  <path fill="none" stroke="#FFF3D0" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"
   d="M4-2C34-11 68 2 78 32"/>
  <use href="#k-flame-s" transform="translate(20 -7) rotate(-35)"/>
  <use href="#k-flame-s" transform="translate(48 -3) rotate(-10) scale(1.1)"/>
  <use href="#k-flame-s" transform="translate(72 14) rotate(32) scale(1.05)"/>
  <use href="#k-flame-s" transform="translate(81 40) rotate(80) scale(.95)"/>
  <circle cx="57" cy="52" r="3.4" fill="url(#k-gold)" stroke="#8C5D28" stroke-width=".6"/>
</g>
'''

def mirror(inner, axis_x):  # mirror a group about x=axis_x
    return f'<g transform="translate({2*axis_x} 0) scale(-1 1)">{inner}</g>'


def bez(p0,p1,p2,p3,t):
    u=1-t
    x=u**3*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t**3*p3[0]
    y=u**3*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t**3*p3[1]
    dx=3*u*u*(p1[0]-p0[0])+6*u*t*(p2[0]-p1[0])+3*t*t*(p3[0]-p2[0])
    dy=3*u*u*(p1[1]-p0[1])+6*u*t*(p2[1]-p1[1])+3*t*t*(p3[1]-p2[1])
    return x,y,math.degrees(math.atan2(dy,dx))

def vine_with_flames(p, ts, side, bias, scale, w=4.0, curl=None, both=False, sym='k-flame'):
    """Draw cubic vine p and sprout flames at ts. Flame 'up' is -y, so a flame
    pointing along tangent angle A needs rotate(A+90). side=+1 → sprouts to the
    left of travel direction, -1 → right."""
    out = f'<path d="M{p[0][0]} {p[0][1]}C{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} {p[3][0]} {p[3][1]}" fill="none" stroke="url(#k-gold)" stroke-width="{w}" stroke-linecap="round"/>'
    for i,t in enumerate(ts):
        x,y,a = bez(*p,t)
        sides = [side,-side] if both else [side]
        for sd in sides:
            rot = a + 90 - sd*bias   # rotate flame away from the stem
            sc = scale*(1.0 - 0.28*t)
            out += f'<use href="#{sym}" transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f}) scale({sc:.2f})"/>'
    return out

def curl_end(x,y,r,rot):
    # little spiral that finishes a vine
    return f'<path transform="translate({x} {y}) rotate({rot})" d="M0 0C{r} {-r*.2} {r*1.1} {r*1.1} 0 {r*1.1}C{-r*.8} {r*1.1} {-r*.7} {r*.2} {-r*.1} {r*.1}C{r*.3} 0 {r*.4} {r*.5} {r*.1} {r*.5}" fill="none" stroke="url(#k-gold)" stroke-width="3.4" stroke-linecap="round"/>'

def pediment():
    half = ''
    # outer sweeping base vine, curls out at the tip
    v1 = [(304,306),(246,322),(168,314),(112,284)]
    half += vine_with_flames(v1,[.12,.3,.5,.7,.9],1,25,.5,w=4.6)
    half += curl_end(112,284,26,-150)
    # second vine rises toward the shoulder
    v2 = [(302,292),(252,288),(212,262),(200,214)]
    half += vine_with_flames(v2,[.2,.4,.6,.8,.98],1,22,.58,w=4.2,both=False)
    half += vine_with_flames(v2,[.3,.55,.8],-1,30,.4,w=0.01)
    # inner vine hugging the spire
    v3 = [(308,276),(284,262),(270,232),(274,188)]
    half += vine_with_flames(v3,[.25,.5,.75,.97],1,16,.55,w=3.8)
    half += vine_with_flames(v3,[.45,.8],-1,20,.34,w=0.01)
    half += '<use href="#k-rosette" transform="translate(130 292) scale(.36)"/>'
    out = half + mirror(half, 320)
    out += '<use href="#k-flame" transform="translate(320 276) rotate(-13) scale(.7)"/>'
    out += '<use href="#k-flame" transform="translate(320 276) rotate(13) scale(.7)"/>'
    out += '<use href="#k-spire" transform="translate(320 272) scale(1.12)"/>'
    out += '<use href="#k-rosette" transform="translate(320 298) scale(.86)"/>'
    return out

# ── Rumduol flower & botanical sprays ──────────────────────────────────
FLOWER = '''
<g id="r-flower">
  <g fill="url(#r-petal)" stroke="#D98497" stroke-width=".5" stroke-opacity=".7">
    <path d="M0 0C-7-3-8-13 0-20C8-13 7-3 0 0Z"/>
    <path transform="rotate(120)" d="M0 0C-7-3-8-13 0-20C8-13 7-3 0 0Z"/>
    <path transform="rotate(240)" d="M0 0C-7-3-8-13 0-20C8-13 7-3 0 0Z"/>
  </g>
  <g fill="url(#r-petal-in)" stroke="#D98497" stroke-width=".45" stroke-opacity=".6">
    <path transform="rotate(60)" d="M0 0C-4.5-2-5.5-9 0-15C5.5-9 4.5-2 0 0Z"/>
    <path transform="rotate(180)" d="M0 0C-4.5-2-5.5-9 0-15C5.5-9 4.5-2 0 0Z"/>
    <path transform="rotate(300)" d="M0 0C-4.5-2-5.5-9 0-15C5.5-9 4.5-2 0 0Z"/>
  </g>
  <g stroke="#C9788C" stroke-width=".4" stroke-opacity=".55" fill="none">
    <path d="M0-2V-15M0-2L-6-13M0-2L6-13" transform="rotate(0)"/>
    <path d="M0-2V-15" transform="rotate(120)"/><path d="M0-2V-15" transform="rotate(240)"/>
  </g>
  <circle r="2.6" fill="#F3D58C" stroke="#B88643" stroke-width=".5"/>
  <circle r="1" fill="#B88643"/>
</g>
<g id="r-bud">
  <path d="M0 0C-4-3-5-10 0-17C5-10 4-3 0 0Z" fill="url(#r-petal)" stroke="#D98497" stroke-width=".5"/>
  <path d="M0-1C-2-6-1-11 0-15" stroke="#C9788C" stroke-width=".4" fill="none"/>
  <path d="M-2.5 0H2.5L1 3H-1Z" fill="#8A9A6A"/>
</g>
<g id="r-leaf2">
  <path d="M0 0C6-4 18-4 30 0C18 5 6 4 0 0Z" fill="url(#r-leaf)" stroke="#6F8352" stroke-width=".5"/>
  <path d="M1 0C10-.5 20-.4 28 0" stroke="#F0F4E4" stroke-opacity=".55" stroke-width=".5" fill="none"/>
</g>
'''

def spray():
    """Corner branch (viewBox 0 0 340 360, rooted at the top-left corner)."""
    s = ''
    stem = 'M-6 20C70 14 138 44 188 104C232 158 252 228 246 330'
    stem2 = 'M60 26C96 66 100 120 78 176C66 206 70 246 94 292'
    stem3 = 'M168 86C214 70 262 78 300 112'
    s += f'<path d="{stem}" fill="none" stroke="#7B6A3A" stroke-width="3.2" stroke-linecap="round"/>'
    s += f'<path d="{stem2}" fill="none" stroke="#7B6A3A" stroke-width="2.4" stroke-linecap="round"/>'
    s += f'<path d="{stem3}" fill="none" stroke="#7B6A3A" stroke-width="2" stroke-linecap="round"/>'
    leaves = [(30,20,18),(84,26,32),(126,50,48),(162,84,58),(196,118,68),(222,160,84),(240,214,98),(246,268,105),
              (74,60,100),(92,110,92),(84,156,80),(72,206,110),(88,262,100),
              (206,82,-10),(250,88,10),(280,104,28)]
    for i,(x,y,a) in enumerate(leaves):
        s += f'<use href="#r-leaf2" transform="translate({x} {y}) rotate({a}) scale({0.95 if i%2 else 0.8})"/>'
    flowers = [(14,34,26,12),(62,28,30,-8),(112,52,34,20),(150,82,36,-14),(186,116,32,8),(222,150,38,24),
               (248,214,34,-10),(246,300,30,14),(76,84,24,-20),(94,138,28,10),(78,198,26,-6),(92,262,24,18),
               (232,92,24,0),(278,106,22,12),(290,104,0,0)]
    for (x,y,sz,a) in flowers:
        if sz==0: continue
        s += f'<use href="#r-flower" transform="translate({x} {y}) rotate({a}) scale({sz/20*1.0})"/>'
    buds = [(34,50,150),(96,34,200),(138,62,160),(176,98,205),(210,138,160),(236,184,200),(244,248,170),(96,240,200),(64,150,160),(266,96,120),(300,124,130)]
    for (x,y,a) in buds:
        s += f'<use href="#r-bud" transform="translate({x} {y}) rotate({a-180}) scale(.9)"/>'
    return s

def vine():
    """Slim vertical vine for side borders (viewBox 0 0 60 300)."""
    s = '<path d="M30 0C8 40 52 70 30 110C8 150 52 190 30 230C20 260 24 280 30 300" fill="none" stroke="#7B6A3A" stroke-width="2.4" stroke-linecap="round"/>'
    for (x,y,a) in [(22,20,200),(38,56,-20),(22,96,210),(38,134,-10),(24,170,200),(38,206,-15),(24,246,205)]:
        s += f'<use href="#r-leaf2" transform="translate({x} {y}) rotate({a}) scale(.8)"/>'
    for (x,y,sz,a) in [(14,46,22,-10),(46,92,24,15),(14,128,22,5),(46,180,24,-12),(16,218,22,10),(40,262,22,-6)]:
        s += f'<use href="#r-flower" transform="translate({x} {y}) rotate({a}) scale({sz/20})"/>'
    for (x,y,a) in [(30,72,30),(32,150,-30),(26,196,20),(28,284,10)]:
        s += f'<use href="#r-bud" transform="translate({x} {y}) rotate({a}) scale(.85)"/>'
    return s

# side-border tile (width 56, height 160) → pattern
TILE = '''
<g>
  <path d="M28 0C6 30 6 52 28 80C50 108 50 130 28 160" fill="none" stroke="url(#k-gold)" stroke-width="3.2" stroke-linecap="round"/>
  <use href="#k-flame-s" transform="translate(12 40) rotate(-70) scale(.62)"/>
  <use href="#k-flame-s" transform="translate(44 40) rotate(70) scale(.62) scale(-1 1) scale(-1 1)"/>
  <use href="#k-flame-s" transform="translate(44 120) rotate(70) scale(.62)"/>
  <use href="#k-flame-s" transform="translate(12 120) rotate(-70) scale(.62)"/>
  <use href="#k-rosette" transform="translate(28 80) scale(.3)"/>
  <circle cx="28" cy="0" r="3" fill="url(#k-gold)"/>
</g>
'''
# horizontal tile for the lower band (width 80, height 40)
HTILE = '''
<g>
  <path d="M0 20C14 2 28 2 40 20C52 38 66 38 80 20" fill="none" stroke="url(#k-gold)" stroke-width="2.6" stroke-linecap="round"/>
  <use href="#k-flame-s" transform="translate(20 8) rotate(-12) scale(.5)"/>
  <use href="#k-flame-s" transform="translate(60 32) rotate(168) scale(.5)"/>
  <use href="#k-rosette" transform="translate(40 20) scale(.2)"/>
</g>
'''

def build():
    defs = GRAD + FLAME + ROSETTE + SPIRE + SCROLL
    defs += '<symbol id="k-pediment" viewBox="0 100 640 240">' + pediment() + '</symbol>'
    defs += '<pattern id="k-tile" width="56" height="160" patternUnits="userSpaceOnUse">' + TILE + '</pattern>'
    return defs

if __name__ == '__main__':
    import re, os
    d = build()
    d = re.sub(r'<linearGradient id="r-[^>]*>.*?</linearGradient>', '', d, flags=re.S)
    d = re.sub(r'\s+', ' ', d).replace('> <', '><')
    out = os.path.join(os.path.dirname(__file__), '..', 'src', 'app', 'shared', 'components', 'kbach-sprite', 'kbach-sprite.ts')
    src = open(out).read()
    src = re.sub(r'<defs>.*</defs>', lambda m: '<defs>' + d.replace('`', '\\`') + '</defs>', src, flags=re.S)
    open(out, 'w').write(src)
    print('wrote', out, len(d), 'bytes of defs')
