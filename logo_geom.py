"""Logo: golden pointed arch, mosque with two minarets and a ribbed dome, rising out of an open book (original drawing, bronze-gold colours)."""
import math, re

def mirror(d):
    toks = re.findall(r'[MLCVHAZ]|-?\d+\.?\d*', d)
    out, i, cmd = [], 0, None
    while i < len(toks):
        t = toks[i]
        if t in 'MLCVHAZ':
            cmd = t; out.append(t); i += 1
            if t == 'Z': continue
        n = {'M':2,'L':2,'C':6,'V':1,'H':1,'A':7}[cmd]
        a = [float(x) for x in toks[i:i+n]]; i += n
        if cmd in 'ML': a = [512-a[0], a[1]]
        elif cmd == 'C': a = [512-a[0],a[1],512-a[2],a[3],512-a[4],a[5]]
        elif cmd == 'H': a = [512-a[0]]
        elif cmd == 'A': a = [a[0],a[1],a[2],a[3],1-a[4],512-a[5],a[6]]
        out.append(' '.join(('%g' % v) for v in a))
    return ' '.join(out)

def crescent(cx, cy, R, r, d, deg):
    x = (d*d + R*R - r*r) / (2*d); y = math.sqrt(R*R - x*x)
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    p = [(cx + px*c - py*s, cy + px*s + py*c) for px, py in ((x, y), (x, -y))]
    return 'M%.1f %.1f A%g %g 0 1 0 %.1f %.1f A%g %g 0 0 1 %.1f %.1f Z' % (p[0][0], p[0][1], R, R, p[1][0], p[1][1], r, r, p[0][0], p[0][1])

ARCH = ['M92 384 V236 C92 150 188 104 256 46 C324 104 420 150 420 236 V384 H402 V240 C402 166 326 124 256 72 C186 124 110 166 110 240 V384 Z']
# left minaret (mirrored to the right)
MIN_L = [
 'M118 384 H176 V362 L160 342 H132 L118 362 Z',            # pedestal
 'M135 342 L139 276 H153 L157 342 Z',                       # shaft
 'M126 268 H166 V278 H126 Z',                               # balcony
 'M137 248 H155 V268 H137 Z',                               # lantern
 'M134 248 C134 234 146 228 146 212 C146 228 158 234 158 248 Z',  # onion dome
 'M145 192 H147 V214 H145 Z',                               # spire
 crescent(146, 180, 13, 10.5, 7, -35),
]
MIN_R = [mirror(p) for p in MIN_L]
CENTER = [
 'M168 384 V300 H344 V384 Z',                               # body
 'M200 384 H312 L296 418 H216 Z',                           # pedestal into the book
 'M206 300 V274 H306 V300 Z',                               # drum
 'M200 274 C200 230 226 202 256 188 C286 202 312 230 312 274 Z',  # dome
 'M168 300 C168 280 180 266 192 262 C204 266 214 280 214 300 Z',  # side dome left
 'M298 300 C298 280 308 266 320 262 C332 266 344 280 344 300 Z',  # side dome right
 'M253 150 H259 V192 H253 Z',                               # finial
 crescent(256, 138, 20, 16, 9, -35),
]
BOOK = [
 'M44 398 C124 386 204 398 256 434 V452 C204 416 126 406 44 416 Z',
 'M80 438 C146 430 208 442 256 476 V492 C210 460 146 452 80 456 Z',
]
BOOK += [mirror(b) for b in BOOK]
CUT = [
 'M240 384 V352 A16 16 0 0 1 272 352 V384 Z',
 'M192 384 V362 A9 9 0 0 1 210 362 V384 Z',
 'M302 384 V362 A9 9 0 0 1 320 362 V384 Z',
 'M141 252 H144 V264 H141 Z', 'M148 252 H151 V264 H148 Z',
]
CUT += [mirror(CUT[3]), mirror(CUT[4])]
for i in range(6):
    x = 214 + i*14.6
    CUT.append('M%.1f 280 H%.1f V294 H%.1f Z' % (x, x+7, x))
ALL_GOLD = ARCH + MIN_L + MIN_R + CENTER + BOOK
CUT_PATHS = CUT
MOSQUE = MIN_L + MIN_R + CENTER
