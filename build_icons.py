"""Draws the logo and writes the app icons (web + Android launcher/notification) and the animated splash artwork."""
import os, asyncio, shutil, sys
root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, root)
import logo_geom as G
BG = '#FFFDF8'
STOPS = [(0, '#FBE7A1'), (.38, '#E6B25E'), (.7, '#B97A2B'), (1, '#7C4714')]
GRAD = '<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="460" y2="500">%s</linearGradient>' % ''.join('<stop offset="%g" stop-color="%s"/>' % s for s in STOPS)
def P(paths): return ''.join('<path d="%s"/>' % d for d in paths)
ART = '<g fill="url(#g)">' + P(G.ALL_GOLD) + '</g><g fill="%s">' % BG + P(G.CUT_PATHS) + '</g>'

def svg(size, bg=True, scale=1.0, radius=112):
    tr = ' transform="translate(256 262) scale(%g) translate(-256 -272)"' % scale
    back = '<rect width="512" height="512" rx="%d" fill="%s"/>' % (radius, BG) if bg else ''
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 512 512"><defs>%s</defs>%s<g%s>%s</g></svg>') % (size, size, GRAD, back, tr, ART)
open(os.path.join(root, 'logo.svg'), 'w').write(svg(512))

# splash artwork: book opens, the mosque rises out of it, the arch appears
splash = ('<defs>' + GRAD + '<clipPath id="spClip"><rect x="0" y="0" width="512" height="436"/></clipPath></defs>'
  '<g id="spArch" fill="url(#g)">' + P(G.ARCH) + '</g>'
  '<g clip-path="url(#spClip)"><g id="spMosque"><g fill="url(#g)">' + P(G.MOSQUE) + '</g><g fill="%s">' % BG + P(G.CUT_PATHS) + '</g></g></g>'
  '<g id="spBookL" fill="url(#g)">' + P(G.BOOK[:2]) + '</g><g id="spBookR" fill="url(#g)">' + P(G.BOOK[2:]) + '</g>')
open(os.path.join(root, 'logo_inner.frag'), 'w').write(splash)

# Android vectors
res = os.path.join(root, 'android', 'app', 'src', 'main', 'res')
AAPT = 'http://schemas.android.com/aapt'
GRADX = ('<aapt:attr name="android:fillColor"><gradient android:startX="60" android:startY="40" android:endX="460" android:endY="500" android:type="linear">%s</gradient></aapt:attr>'
         % ''.join('<item android:offset="%g" android:color="%s"/>' % s for s in STOPS))
def vec(items, scale, tx, ty, size):
    body = ''
    for kind, d in items:
        if kind == 'grad': body += '        <path android:pathData="%s">%s</path>\n' % (d, GRADX)
        else: body += '        <path android:fillColor="%s" android:pathData="%s" />\n' % (kind, d)
    return ('<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android"\n    xmlns:aapt="%s"\n    android:width="%ddp"\n    android:height="%ddp"\n    android:viewportWidth="%d"\n    android:viewportHeight="%d">\n'
            '    <group android:scaleX="%g" android:scaleY="%g" android:translateX="%g" android:translateY="%g">\n%s    </group>\n</vector>\n') % (AAPT, size, size, size, size, scale, scale, tx, ty, body)
if os.path.isdir(os.path.join(res, 'drawable')):
    d = os.path.join(res, 'drawable')
    fs = .15   # emblem (about 450 units tall) fills ~68 of the 108 dp canvas
    open(os.path.join(d, 'ic_launcher_foreground.xml'), 'w').write(vec([('grad', p) for p in G.ALL_GOLD] + [(BG, p) for p in G.CUT_PATHS], fs, 54-256*fs, 54-272*fs, 108))
    ss = .046
    open(os.path.join(d, 'ic_stat_adhan.xml'), 'w').write(vec([('#FFFFFF', p) for p in G.ALL_GOLD], ss, 12-256*ss, 12-272*ss, 24))
    open(os.path.join(res, 'values', 'colors.xml'), 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_bg">%s</color>\n</resources>\n' % BG)

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, size, kw in [('icon-192', 192, {}), ('icon-512', 512, {}), ('icon-512-maskable', 512, {'radius': 0, 'scale': .78}), ('../icon-1024-preview', 1024, {})]:
            pg = await b.new_page(viewport={'width': size, 'height': size})
            await pg.set_content('<body style="margin:0;background:transparent">' + svg(size, **kw))
            await pg.screenshot(path=os.path.join(root, 'web', name + '.png'), omit_background=True)
        await b.close()
    # splash layers: light PNGs that the splash animates with cheap transforms
    sd = os.path.join(root, 'web', 'splash'); os.makedirs(sd, exist_ok=True)
    def layer(body):
        return '<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 512 512"><defs>%s</defs>%s</svg>' % (GRAD, body)
    mask = '<mask id="m"><rect width="512" height="512" fill="#fff"/><g fill="#000">' + P(G.CUT_PATHS) + '</g></mask>'
    layers = {
      'arch': layer('<g fill="url(#g)">' + P(G.ARCH) + '</g>'),
      'mosque': layer(mask + '<g mask="url(#m)" fill="url(#g)">' + P(G.MOSQUE) + '</g>'),
      'book-l': layer('<g fill="url(#g)">' + P(G.BOOK[:2]) + '</g>'),
      'book-r': layer('<g fill="url(#g)">' + P(G.BOOK[2:]) + '</g>'),
    }
    async with async_playwright() as p2:
        b2 = await p2.chromium.launch()
        for n, body in layers.items():
            pg = await b2.new_page(viewport={'width': 768, 'height': 768})
            await pg.set_content('<body style="margin:0;background:transparent">' + body)
            await pg.screenshot(path=os.path.join(sd, n + '.png'), omit_background=True)
        await b2.close()
    nd = os.path.join(res, 'drawable-nodpi')
    if os.path.isdir(res):
        os.makedirs(nd, exist_ok=True)
        shutil.copy(os.path.join(root, 'web', 'icon-192.png'), os.path.join(nd, 'ic_logo_large.png'))
    st = os.path.join(root, 'store')
    if os.path.isdir(st):
        shutil.copy(os.path.join(root, 'web', 'icon-512.png'), os.path.join(st, 'app-icon-512.png'))
asyncio.run(main())
print('icons done')
