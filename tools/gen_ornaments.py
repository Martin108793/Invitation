#!/usr/bin/env python3
"""
Generates the original Kbach Khmer (ក្បាច់ខ្មែរ) and Rumduol (ផ្ការំដួល) SVG ornaments
used by the inside invitation page.  Run:  python3 tools/gen_ornaments.py

Vocabulary (inspired by Khmer temple carving, drawn from scratch):
  blade()    – a flame-leaf (kbach "kanok"): curved, tapering, with child flames
  vine()     – a tapered scroll that spirals inward, shedding flame leaves
  rosette()  – the diamond / lotus medallion used at cusps and centres
  rumduol()  – six-petalled flower (3 outer + 3 inner narrow petals)
"""
import math, random, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'ornaments')
os.makedirs(OUT, exist_ok=True)

GOLD_DEEP, GOLD, GOLD_BRIGHT, GOLD_PALE = '#8C5D28', '#B88643', '#D9AD62', '#F3DDA8'
PINK, PINK_DEEP, BLUSH, CREAM, IVORY = '#EBA3B2', '#D4768C', '#F8DDE0', '#FFF8F0', '#FFFDF9'

def n(v): return ('%.1f' % v).rstrip('0').rstrip('.')
def pstr(pts): return 'M' + 'L'.join(f'{n(x)} {n(y)}' for x, y in pts) + 'Z'

# ── geometry ───────────────────────────────────────────────
def bez(p0, p1, p2, p3, k=24):
    out = []
    for i in range(k + 1):
        t = i / k; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out

def tangents(pts):
    t = []
    for i in range(len(pts)):
        a = pts[max(i-1, 0)]; b = pts[min(i+1, len(pts)-1)]
        dx, dy = b[0]-a[0], b[1]-a[1]; l = math.hypot(dx, dy) or 1
        t.append((dx/l, dy/l))
    return t

def tapered(spine, wfun):
    """closed polygon around a polyline with width wfun(t)."""
    tg = tangents(spine); L, R = [], []
    for i, (p, t) in enumerate(zip(spine, tg)):
        w = wfun(i / (len(spine)-1)); nx, ny = -t[1], t[0]
        L.append((p[0]+nx*w, p[1]+ny*w)); R.append((p[0]-nx*w, p[1]-ny*w))
    return L + R[::-1]

def xf(pts, x, y, ang, s=1.0, flip=1):
    c, sn = math.cos(ang), math.sin(ang)
    return [(x + (px*flip*c - py*sn)*s, y + (px*flip*sn + py*c)*s) for px, py in pts]

# ── primitives (return svg strings) ────────────────────────
def blade(x, y, ang, L, W, curl=0.25, flip=1, depth=1, hi=True):
    """Flame leaf. ang = direction of growth in radians (0 = up)."""
    ang = ang  # rotation applied to a leaf drawn pointing up (-y)
    spine = bez((0, 0), (0.02*L, -0.35*L), (curl*L*0.9, -0.72*L), (curl*L, -L), 22)
    wf = lambda t: W * (0.38 + 0.62*math.sin(min(t/0.32, 1)*math.pi/2)) * (1-t)**0.8
    poly = xf(tapered(spine, wf), x, y, ang, 1, flip)
    out = [f'<path d="{pstr(poly)}" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".8" stroke-linejoin="round"/>']
    if hi:
        sp = xf(spine[2:-3], x, y, ang, 1, flip)
        out.append(f'<path d="M{"L".join(f"{n(a)} {n(b)}" for a,b in sp)}" fill="none" stroke="#FBEBC2" stroke-opacity=".7" stroke-width="{n(max(.6, W*.09))}" stroke-linecap="round"/>')
    if depth > 0:
        for tt, side, sc in ((0.34, 1, 0.5), (0.58, -1, 0.42), (0.78, 1, 0.3)):
            i = int(tt*(len(spine)-1)); px, py = spine[i]
            tgx, tgy = tangents(spine)[i]
            base_ang = math.atan2(tgx, -tgy)           # growth direction of spine here (0 = up)
            ca = base_ang + side*flip*0.95
            lx, ly = xf([(px, py)], x, y, ang, 1, flip)[0]
            out.append(blade(lx, ly, ang + ca*flip*0 + (ca if flip == 1 else -ca) , L*sc, W*0.62, curl*0.9*(side), flip, depth-1, False))
    return ''.join(out)

def vine(cx, cy, r0, turns, start, direction=1, w0=5.5, leaves=True, leaf_every=0.55, leaf_scale=0.55):
    """Spiral scroll that winds inward from radius r0; returns svg."""
    pts = []; steps = int(turns*40)
    for i in range(steps+1):
        th = i/40*2*math.pi*direction*1.0
        r = r0*math.exp(-0.34*i/40*1.0)
        pts.append((cx + r*math.cos(start+th), cy + r*math.sin(start+th)))
    poly = tapered(pts, lambda t: w0*(1-t)**0.9 + 0.5)
    out = [f'<path d="{pstr(poly)}" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".7" stroke-linejoin="round"/>']
    if leaves:
        k = 0
        tg = tangents(pts)
        for i in range(6, int(steps*0.62), max(4, int(40*leaf_every*0.45))):
            px, py = pts[i]
            ox, oy = px-cx, py-cy; l = math.hypot(ox, oy) or 1
            a = math.atan2(ox/l, -oy/l)                    # outward growth angle
            lean = -direction*0.55
            ls = leaf_scale*(1-i/steps*0.7)
            out.append(blade(px, py, a+lean, r0*ls*1.15, w0*1.35*ls+1.5, curl=-direction*0.3, flip=1, depth=0, hi=False))
    return ''.join(out)

def petal_path(L, W):
    return f'M0 0C{n(W)} {n(-L*.28)} {n(W*.9)} {n(-L*.72)} 0 {n(-L)}C{n(-W*.9)} {n(-L*.72)} {n(-W)} {n(-L*.28)} 0 0Z'

def rosette(cx, cy, r, rot=0, petals=8):
    """Diamond/lotus medallion."""
    g = [f'<g transform="translate({n(cx)} {n(cy)}) rotate({n(rot)})">']
    g.append(f'<circle r="{n(r*1.02)}" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".8"/>')
    for i in range(petals):
        a = i*360/petals
        g.append(f'<path transform="rotate({n(a)})" d="{petal_path(r*1.0, r*.30)}" fill="url(#goldv)" stroke="{GOLD_DEEP}" stroke-width=".6"/>')
    for i in range(petals):
        a = i*360/petals + 180/petals
        g.append(f'<path transform="rotate({n(a)})" d="{petal_path(r*.72, r*.2)}" fill="#F6E4B4" stroke="{GOLD_DEEP}" stroke-width=".5"/>')
    g.append(f'<circle r="{n(r*.36)}" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".8"/>')
    g.append(f'<circle r="{n(r*.24)}" fill="none" stroke="#FBEBC2" stroke-width=".7"/>')
    g.append(f'<circle r="{n(r*.1)}" fill="{GOLD_DEEP}"/></g>')
    return ''.join(g)

def diamond_medallion(cx, cy, r):
    """Reference-style diamond: four long petals + four short + rosette."""
    g = [f'<g transform="translate({n(cx)} {n(cy)})">']
    for a in (0, 90, 180, 270):
        g.append(f'<path transform="rotate({a})" d="{petal_path(r*1.55, r*.52)}" fill="url(#goldv)" stroke="{GOLD_DEEP}" stroke-width=".8"/>')
        g.append(f'<path transform="rotate({a})" d="{petal_path(r*1.2, r*.3)}" fill="none" stroke="#FBEBC2" stroke-width=".8"/>')
    for a in (45, 135, 225, 315):
        g.append(f'<path transform="rotate({a})" d="{petal_path(r*1.05, r*.34)}" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".7"/>')
    g.append('</g>')
    g.append(rosette(cx, cy, r*.62, 22.5))
    return ''.join(g)

# ── Rumduol (ផ្ការំដួល) ────────────────────────────────────
def rumduol(cx, cy, s, rot=0):
    """Six narrow, slightly twisted petals: 3 outer (long) + 3 inner (shorter)."""
    g = [f'<g transform="translate({n(cx)} {n(cy)}) rotate({n(rot)}) scale({n(s)})">']
    def pet(a, L, W, fill):
        d = (f'M0 0C{n(W*.9)} {n(-L*.22)} {n(W*1.15)} {n(-L*.62)} {n(W*.25)} {n(-L)}'
             f'C{n(-W*.55)} {n(-L*.66)} {n(-W*1.0)} {n(-L*.26)} 0 0Z')
        return (f'<g transform="rotate({a})"><path d="{d}" fill="{fill}" stroke="{PINK_DEEP}" stroke-opacity=".55" stroke-width=".5"/>'
                f'<path d="M0 {n(-L*.1)}Q{n(W*.2)} {n(-L*.55)} {n(W*.2)} {n(-L*.9)}" fill="none" stroke="{IVORY}" stroke-opacity=".75" stroke-width=".7"/></g>')
    for a in (0, 120, 240): g.append(pet(a, 25, 4.6, 'url(#rdp)'))
    for a in (60, 180, 300): g.append(pet(a, 20, 4.0, 'url(#rdp2)'))
    g.append(f'<circle r="3.2" fill="#E9C77E" stroke="{GOLD}" stroke-width=".5"/>')
    for i in range(7):
        a = i*2*math.pi/7
        g.append(f'<circle cx="{n(math.cos(a)*5)}" cy="{n(math.sin(a)*5)}" r=".9" fill="{GOLD_BRIGHT}"/>')
    g.append('</g>')
    return ''.join(g)

def bud(x, y, s, rot):
    return (f'<g transform="translate({n(x)} {n(y)}) rotate({n(rot)}) scale({n(s)})">'
            f'<path d="M0 0C5 -5 6 -14 0 -22C-6 -14 -5 -5 0 0Z" fill="url(#rdp)" stroke="{PINK_DEEP}" stroke-opacity=".6" stroke-width=".5"/>'
            f'<path d="M-2.4 0Q0 3 2.4 0Z" fill="#8E9A63"/></g>')

def leaf(x, y, ang, L, W=None):
    W = W or L*.26
    d = f'M0 0C{n(W)} {n(-L*.3)} {n(W)} {n(-L*.75)} 0 {n(-L)}C{n(-W)} {n(-L*.75)} {n(-W)} {n(-L*.3)} 0 0Z'
    return (f'<g transform="translate({n(x)} {n(y)}) rotate({n(ang)})"><path d="{d}" fill="url(#lf)" stroke="#6F7B4B" stroke-opacity=".6" stroke-width=".6"/>'
            f'<path d="M0 {n(-L*.06)}L0 {n(-L*.92)}" stroke="#E4E8C6" stroke-opacity=".7" stroke-width=".6"/></g>')

def branch(spine, rnd, flowers=0.5, size=(.7, 1.1), leaf_len=30, side_alt=True, w=3.2):
    """Branch with flowers, buds, leaves along a polyline. Returns svg."""
    tg = tangents(spine); out = [
        f'<path d="{pstr(tapered(spine, lambda t: w*(1-t*.75)))}" fill="#8A7A4A" stroke="#6C5F38" stroke-width=".5"/>']
    fl, lv = [], []
    side = 1
    for i in range(3, len(spine)-1, 3):
        (px, py), (tx, ty) = spine[i], tg[i]
        nx, ny = -ty, tx
        ang = math.degrees(math.atan2(tx, -ty))
        lv.append(leaf(px, py, ang + side*52, leaf_len*(0.7+rnd.random()*.5)))
        if rnd.random() < flowers:
            off = rnd.uniform(14, 30)*-side
            fl.append((px+nx*off, py+ny*off, rnd.uniform(*size), rnd.uniform(0, 120)))
            out.append(f'<path d="M{n(px)} {n(py)}L{n(px+nx*off)} {n(py+ny*off)}" stroke="#8A7A4A" stroke-width="1.4" fill="none"/>')
        elif rnd.random() < .6:
            bx, by = px-nx*side*10, py-ny*side*10
            out.append(f'<path d="M{n(px)} {n(py)}L{n(bx)} {n(by)}" stroke="#8A7A4A" stroke-width="1.2" fill="none"/>')
            out.append(bud(bx, by, rnd.uniform(.8, 1.1), ang - side*40))
        if side_alt: side = -side
    out = out[:1] + lv + out[1:]
    for x, y, s, r in fl: out.append(rumduol(x, y, s*1.35, r))
    ex, ey = spine[-1]
    out.append(bud(ex, ey, 1.1, math.degrees(math.atan2(tg[-1][0], -tg[-1][1]))))
    return ''.join(out)

def lotus(cx, cy, s, rot=0):
    g = [f'<g transform="translate({n(cx)} {n(cy)}) rotate({n(rot)}) scale({n(s)})">']
    layers = [(-70, 62, 17, 'url(#lt2)'), (70, 62, 17, 'url(#lt2)'), (-40, 70, 18, 'url(#lt)'), (40, 70, 18, 'url(#lt)'), (-14, 74, 17, 'url(#lt)'), (14, 74, 17, 'url(#lt)'), (0, 80, 19, 'url(#lt)')]
    for a, L, W, f in layers:
        g.append(f'<path transform="rotate({a})" d="{petal_path(L, W)}" fill="{f}" stroke="{PINK_DEEP}" stroke-opacity=".5" stroke-width=".8"/>')
        g.append(f'<path transform="rotate({a})" d="M0 -6Q4 {n(-L*.5)} 0 {n(-L*.88)}" fill="none" stroke="{IVORY}" stroke-opacity=".7" stroke-width="1"/>')
    g.append('<ellipse cy="-8" rx="10" ry="6" fill="#E9C77E" stroke="#B88643" stroke-width=".6"/></g>')
    return ''.join(g)

# ── shared <defs> ──────────────────────────────────────────
DEFS = f'''<defs>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E2AE"/><stop offset=".32" stop-color="{GOLD_BRIGHT}"/><stop offset=".68" stop-color="{GOLD}"/><stop offset="1" stop-color="{GOLD_DEEP}"/></linearGradient>
<linearGradient id="goldv" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{GOLD_DEEP}"/><stop offset=".45" stop-color="{GOLD}"/><stop offset="1" stop-color="#F3DDA8"/></linearGradient>
<linearGradient id="goldh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{GOLD_DEEP}"/><stop offset=".5" stop-color="#F3DDA8"/><stop offset="1" stop-color="{GOLD_DEEP}"/></linearGradient>
<linearGradient id="rdp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{IVORY}"/><stop offset=".45" stop-color="#F7CBD3"/><stop offset="1" stop-color="{PINK}"/></linearGradient>
<linearGradient id="rdp2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{IVORY}"/><stop offset=".55" stop-color="#FBDDE2"/><stop offset="1" stop-color="#F0B3C0"/></linearGradient>
<linearGradient id="lt" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF1EF"/><stop offset=".5" stop-color="#F8C9D4"/><stop offset="1" stop-color="#EB9FB1"/></linearGradient>
<linearGradient id="lt2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF6F2"/><stop offset="1" stop-color="#F3B7C4"/></linearGradient>
<linearGradient id="lf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7E8A57"/><stop offset="1" stop-color="#B3BC8B"/></linearGradient>
</defs>'''

def svg(w, h, body, name):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{DEFS}{body}</svg>'
    open(os.path.join(OUT, name), 'w').write(s)
    print(name, len(s)//1024, 'KB')

def mirror(inner, w):
    return f'<g id="half">{inner}</g><use href="#half" transform="matrix(-1 0 0 1 {w} 0)"/>'

# ═══ 1. CREST: cusped arch + kbach flame border + spire ═════
def crest():
    W, H, OY = 1000, 600, 78
    # cusped arch (left half, top→bottom order reversed below): pillar, shoulder lobe, great lobe, apex ogee
    segs = [((112, H), (112, 470), (112, 400), (112, 330+OY)),
            ((112, 330+OY), (112, 262+OY), (150, 238+OY), (222, 214+OY)),      # shoulder lobe → cusp
            ((222, 214+OY), (176, 120+OY), (300, 62+OY), (416, 72+OY)),        # great lobe (bulges out)
            ((416, 72+OY), (456, 72+OY), (488, 58+OY), (500, 22+OY))]          # apex ogee
    pts = []
    for sg in segs: pts += bez(*sg, k=30)[:-1]
    pts.append((500, 22+OY))
    left = pts
    full = left + [(W-x, y) for x, y in left[::-1]][1:]
    d = 'M' + 'L'.join(f'{n(x)} {n(y)}' for x, y in full)
    inner_fill = d + f'L{W-112} {H}L112 {H}Z'
    half = []
    base = [f'<path d="{inner_fill}" fill="url(#cream)"/>']
    mold = [f'<path d="{d}" fill="none" stroke="{GOLD_DEEP}" stroke-width="13" stroke-linejoin="round"/>',
            f'<path d="{d}" fill="none" stroke="url(#goldh)" stroke-width="9.5" stroke-linejoin="round"/>',
            f'<path d="{d}" fill="none" stroke="#FBEBC2" stroke-opacity=".85" stroke-width="2.2" stroke-linejoin="round" transform="translate(0 -1)"/>',
            f'<path d="{d}" fill="none" stroke="{GOLD}" stroke-width="1.4" stroke-linejoin="round" transform="translate(500 {H}) scale(.95) translate(-500 {-H})"/>']
    cum = [0]
    for i in range(1, len(left)):
        cum.append(cum[-1] + math.hypot(left[i][0]-left[i-1][0], left[i][1]-left[i-1][1]))
    tg = tangents(left)
    flames = []
    s0 = 118; alt = 0
    while s0 < cum[-1]-26:
        i = min(range(len(cum)), key=lambda k: abs(cum[k]-s0))
        (px, py), (tx, ty) = left[i], tg[i]
        nx, ny = ty, -tx
        if (px-500)*nx + (py-420)*ny < 0: nx, ny = -nx, -ny
        out_ang = math.atan2(nx, -ny)
        trav = math.atan2(tx, -ty)
        big = (alt % 2 == 0)
        a = out_ang + (trav-out_ang)*(0.62 if big else 0.4)
        L = 74 if big else 44
        flames.append(blade(px+nx*6, py+ny*6, a, L, 15 if big else 10, curl=0.34, flip=1, depth=1 if big else 0, hi=True))
        s0 += 56 if big else 40; alt += 1
    half += flames
    # outside scrolls at shoulder + cusp (they sit on the pink corner, behind the Rumduol)
    half.append(vine(92, 286+OY, 46, 1.7, math.pi*0.0, direction=1, w0=6.5))
    half.append(rosette(214, 206+OY, 27, 22.5))
    half.append(vine(262, 168+OY, 34, 1.6, math.pi*0.9, direction=1, w0=5))
    centre = []
    ay = 22+OY
    centre.append(blade(500, ay+8, 0, 112, 19, curl=0, depth=0))
    for a, L in ((-0.5, 72), (0.5, 72), (-1.0, 56), (1.0, 56)):
        centre.append(blade(500, ay+8, a, L, 13, curl=a*0.35, flip=1, depth=1, hi=False))
    centre.append(diamond_medallion(500, ay+4, 23))
    defs_extra = '<defs><linearGradient id="cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEFEA"/><stop offset=".35" stop-color="#FFF8F0"/><stop offset="1" stop-color="#FFF8F0"/></linearGradient></defs>'
    body = defs_extra + ''.join(base) + ''.join(mold) + mirror(''.join(half), W) + ''.join(centre)
    svg(W, H, body, 'kbach-crest.svg')

# ═══ 2. SIDE TILE (vertical vine pillar) ═══════════════════
def side_tile():
    W, T = 110, 300
    spine = [(58 + 11*math.sin(2*math.pi*(y-0)/T), y) for y in range(-20, T+21, 4)]
    parts = []
    # inner border lines (right edge = faces the paper)
    for x, sw, col in ((W-3, 3, GOLD_DEEP), (W-3, 1.6, GOLD_BRIGHT), (W-11, .9, GOLD)):
        parts.append(f'<path d="M{x} -2V{T+2}" stroke="{col}" stroke-width="{sw}"/>')
    parts.append(f'<path d="{pstr(tapered(spine, lambda t: 3.6))}" fill="url(#goldv)"/>')
    # scrolls alternate sides
    parts.append(vine(38, 82, 36, 1.7, math.pi*0.9, direction=1, w0=5))
    parts.append(vine(80, 232, 36, 1.7, math.pi*0.1, direction=-1, w0=5))
    parts.append(vine(38, 82+T, 36, 1.7, math.pi*0.9, direction=1, w0=5))   # wrap for seamless
    parts.append(vine(80, 232-T, 36, 1.7, math.pi*0.1, direction=-1, w0=5))
    for y, a in ((20, .35), (150, -.35), (270, .35)):
        parts.append(blade(58 + (11 if a < 0 else -11), y+18, a*1.2, 34, 9, curl=-a, depth=0, hi=False))
    parts.append(rosette(58, 157, 17, 22.5))
    parts.append(rosette(58, 7, 11, 22.5))
    parts.append(rosette(58, T+7-14, 11, 22.5))
    svg(W, T, ''.join(parts), 'kbach-side.svg')

# ═══ 3. RUMDUOL corner branch (top-left) ═══════════════════
def rumduol_corner():
    W = H = 560
    rnd = random.Random(7)
    body = []
    main = bez((-20, 30), (170, 0), (330, 120), (410, 330), 70)
    body.append(branch(main, rnd, flowers=.62, size=(.85, 1.25), leaf_len=44, w=4.4))
    sub1 = bez((90, 22), (120, 120), (150, 200), (110, 320), 45)
    body.append(branch(sub1, rnd, flowers=.5, size=(.75, 1.1), leaf_len=34, w=3.2))
    sub2 = bez((240, 78), (330, 60), (420, 90), (500, 170), 40)
    body.append(branch(sub2, rnd, flowers=.55, size=(.7, 1.05), leaf_len=32, w=3))
    sub3 = bez((350, 200), (410, 240), (470, 300), (500, 400), 36)
    body.append(branch(sub3, rnd, flowers=.5, size=(.7, 1.0), leaf_len=30, w=2.8))
    svg(W, H, ''.join(body), 'rumduol-corner.svg')

def rumduol_sprig(name, seed, curve, w=200, h=320):
    rnd = random.Random(seed)
    spine = bez(*curve, 50)
    svg(w, h, branch(spine, rnd, flowers=.6, size=(.8, 1.1), leaf_len=34, w=3.4), name)

# ═══ 4. FOOT: base band, centrepiece, lotus + Rumduol, Angkor
def angkor(cx, base, s):
    towers = []
    def tower(x, h, w, tiers):
        g = []
        for i in range(tiers):
            tw = w*(1 - i*.2); th = h/tiers
            y0 = base - h*0.18 - th*i - i*1
            g.append(f'<path d="M{n(x-tw/2)} {n(y0)}L{n(x-tw*.4)} {n(y0-th*.55)}L{n(x)} {n(y0-th*1.15)}L{n(x+tw*.4)} {n(y0-th*.55)}L{n(x+tw/2)} {n(y0)}Z" fill="url(#goldv)" stroke="{GOLD_DEEP}" stroke-width=".5"/>')
        g.append(f'<path d="M{n(x)} {n(base-h*1.2)}v-{n(h*.22)}" stroke="{GOLD}" stroke-width="1.4"/>')
        return ''.join(g)
    g = [f'<g transform="translate({n(cx)} 0) scale({n(s)}) translate({n(-cx)} {n(base*(1-s)/s)})">']
    g.append(tower(cx, 60, 30, 5)); g.append(tower(cx-34, 38, 20, 4)); g.append(tower(cx+34, 38, 20, 4))
    g.append(f'<rect x="{n(cx-54)}" y="{n(base-14)}" width="108" height="14" fill="url(#goldv)" stroke="{GOLD_DEEP}" stroke-width=".5"/>')
    for i in range(10):
        g.append(f'<rect x="{n(cx-50+i*10.6)}" y="{n(base-12)}" width="3.4" height="11" fill="{CREAM}" fill-opacity=".7"/>')
    g.append('</g>')
    return ''.join(g)

def foot():
    W, H = 1000, 350
    rnd = random.Random(11)
    P = []
    # paper body between the pillars
    P.append(f'<path d="M112 0V262H888V0Z" fill="{CREAM}"/>')
    # pillar lines
    for x in (112, 888):
        P.append(f'<path d="M{x} 0V270" stroke="{GOLD_DEEP}" stroke-width="3"/><path d="M{x} 0V270" stroke="{GOLD_BRIGHT}" stroke-width="1.4"/>')
    # woven band
    P.append(f'<rect x="0" y="262" width="{W}" height="62" fill="url(#band)"/>')
    P.append(f'<path d="M0 262H{W}" stroke="{GOLD_DEEP}" stroke-width="4"/><path d="M0 262H{W}" stroke="{GOLD_BRIGHT}" stroke-width="1.6"/>')
    P.append(f'<path d="M0 324H{W}" stroke="{GOLD_DEEP}" stroke-width="3"/><path d="M0 324H{W}" stroke="{GOLD_BRIGHT}" stroke-width="1.2"/>')
    P.append(f'<rect x="0" y="326" width="{W}" height="24" fill="{BLUSH}"/>')
    # centrepiece (kbach): half then mirror
    half = []
    half.append(blade(470, 262, -1.05, 120, 15, curl=-.3, depth=1, hi=False))
    half.append(blade(448, 262, -1.45, 96, 13, curl=-.35, depth=1, hi=False))
    half.append(blade(430, 262, -1.9, 70, 11, curl=-.3, depth=0, hi=False))
    half.append(vine(398, 236, 44, 1.7, math.pi*.1, direction=1, w0=6))
    half.append(blade(480, 262, -.45, 100, 14, curl=-.2, depth=1))
    half.append(blade(520-40, 238, 0, 0.1, 0.1))  # noop anchor
    centre = [blade(500, 262, 0, 150, 20, curl=0, depth=0),
              blade(500, 262, -.3, 110, 15, curl=.18, depth=1, hi=False),
              blade(500, 262, .3, 110, 15, curl=-.18, depth=1, hi=False)]
    body = ''.join(P) + mirror(''.join(half), W) + ''.join(centre) + diamond_medallion(500, 250, 30)
    # Angkor niches
    for cx in (258, 742):
        body += f'<path d="M{cx-72} 262V180Q{cx-72} 120 {cx} 112Q{cx+72} 120 {cx+72} 180V262Z" fill="#FBE4E2" stroke="{GOLD}" stroke-width="2"/>'
        body += f'<path d="M{cx-72} 262V180Q{cx-72} 120 {cx} 112Q{cx+72} 120 {cx+72} 180V262Z" fill="none" stroke="{GOLD_BRIGHT}" stroke-opacity=".7" stroke-width=".8" transform="translate({cx} 262) scale(.9) translate({-cx} -262)"/>'
        body += angkor(cx, 258, 1.0)
    # corner lotus + rumduol clusters (left; mirrored)
    corner = []
    cb = random.Random(5)
    corner.append(branch(bez((-10, 290), (40, 240), (110, 180), (190, 150), 40), cb, flowers=.5, size=(.7, .95), leaf_len=36, w=3))
    corner.append(leaf(30, 300, -50, 70)); corner.append(leaf(118, 304, 40, 66)); corner.append(leaf(70, 296, -10, 60))
    corner.append(lotus(72, 292, 1.05, 0))
    corner.append(lotus(150, 300, .62, 18))
    corner.append(rumduol(34, 236, 1.1, 20)); corner.append(rumduol(118, 236, .95, 70))
    body += mirror(''.join(corner), W)
    pat = f'<defs><pattern id="band" width="62" height="62" patternUnits="userSpaceOnUse"><rect width="62" height="62" fill="{BLUSH}"/><path d="M31 6L56 31L31 56L6 31Z" fill="none" stroke="{GOLD}" stroke-width="1.6"/><path d="M31 16L46 31L31 46L16 31Z" fill="{PINK}" fill-opacity=".55" stroke="{GOLD_DEEP}" stroke-width=".8"/><circle cx="31" cy="31" r="3.4" fill="{GOLD_BRIGHT}" stroke="{GOLD_DEEP}" stroke-width=".6"/><circle cx="0" cy="0" r="2.6" fill="{GOLD}"/><circle cx="62" cy="0" r="2.6" fill="{GOLD}"/><circle cx="0" cy="62" r="2.6" fill="{GOLD}"/><circle cx="62" cy="62" r="2.6" fill="{GOLD}"/></pattern></defs>'
    svg(W, H, pat + body, 'kbach-foot.svg')

# ═══ 5. Divider + band tile + paper patterns ═══════════════
def divider():
    W, H = 360, 60
    half = [f'<path d="M12 30H150" stroke="url(#goldh)" stroke-width="1.2"/>', f'<circle cx="8" cy="30" r="2.4" fill="{GOLD}"/>',
            blade(150, 30, math.pi/2, 52, 7, curl=-.25, depth=0, hi=False),
            blade(150, 30, math.pi/2+.55, 36, 6, curl=-.2, depth=0, hi=False), blade(150, 30, math.pi/2-.55, 36, 6, curl=-.2, depth=0, hi=False),
            vine(168, 30, 13, 1.5, 0, direction=1, w0=3, leaves=False)]
    body = mirror(''.join(half), W) + diamond_medallion(180, 30, 11)
    svg(W, H, body, 'kbach-divider.svg')

def band():
    W, H = 120, 30
    t = []
    t.append(f'<rect width="{W}" height="{H}" fill="{BLUSH}"/>')
    t.append(f'<path d="M0 3H{W}" stroke="{GOLD_DEEP}" stroke-width="2"/><path d="M0 3H{W}" stroke="{GOLD_BRIGHT}" stroke-width=".8"/>')
    t.append(f'<path d="M0 27H{W}" stroke="{GOLD_DEEP}" stroke-width="2"/><path d="M0 27H{W}" stroke="{GOLD_BRIGHT}" stroke-width=".8"/>')
    for cx in (30, 90):
        t.append(f'<path d="M{cx} 7L{cx+16} 15L{cx} 23L{cx-16} 15Z" fill="{PINK}" fill-opacity=".6" stroke="{GOLD}" stroke-width="1.2"/>')
        t.append(f'<circle cx="{cx}" cy="15" r="3" fill="url(#gold)" stroke="{GOLD_DEEP}" stroke-width=".5"/>')
        t.append(blade(cx+23, 24, 0.9, 12, 3, curl=.2, depth=0, hi=False)); t.append(blade(cx+23, 6, math.pi-.9, 12, 3, curl=.2, depth=0, hi=False))
    svg(W, H, ''.join(t), 'kbach-band.svg')

def paper():
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><g fill="none" stroke="{GOLD}" stroke-opacity=".16" stroke-width="1">
<path d="M48 6L90 48L48 90L6 48Z"/><path d="M48 22L74 48L48 74L22 48Z"/><circle cx="48" cy="48" r="4"/>
<path d="M0 0l8 8M96 0l-8 8M0 96l8-8M96 96l-8-8"/></g><g fill="{PINK}" fill-opacity=".12"><circle cx="0" cy="0" r="5"/><circle cx="96" cy="0" r="5"/><circle cx="0" cy="96" r="5"/><circle cx="96" cy="96" r="5"/><circle cx="48" cy="48" r="9"/></g></svg>'''
    open(os.path.join(OUT, 'khmer-paper.svg'), 'w').write(s); print('khmer-paper.svg')

if __name__ == '__main__':
    crest(); side_tile(); rumduol_corner()
    rumduol_sprig('rumduol-sprig.svg', 21, ((60, -10), (20, 90), (110, 170), (80, 300)))
    foot(); divider(); band(); paper()
