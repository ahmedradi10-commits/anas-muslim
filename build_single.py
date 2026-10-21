"""Builds one self-contained 'أنس مسلم.html' that stays light enough for iPhone.

Order inside the file matters: the splash screen and the app come first, so they appear quickly.
The heavy data (fonts and adhan audio) sits at the very end and is only read after the app has started.
"""
import base64, os, re, subprocess

root = os.path.dirname(os.path.abspath(__file__))
b64 = lambda p: base64.b64encode(open(p, "rb").read()).decode()

VOICES = ["makkah", "alafasy", "abdelbasit", "qatami", "refaat", "menshawy", "arkani"]   # + fajr; encoded by build_audio.py
audio_dir = os.path.join(root, "single_audio")

t = open(os.path.join(root, "template.html"), encoding="utf-8").read()
for ph, f in (("/*__MORE_CSS__*/", "more.css"), ("<!--MORE_HTML-->", "more.html"), ("//__MORE_JS__", "more.js"), ("/*__ASK_CSS__*/", "ask.css"), ("//__ASK_JS__", "ask.js")):
    assert ph in t, ph
    t = t.replace(ph, open(os.path.join(root, f), encoding="utf-8").read())
_h = open(os.path.join(root, "ask_data.html"), encoding="utf-8").read()
for ph, f in (("__QA_JSON__", "qa.json"), ("__GH_JSON__", "gharib.json"), ("__TF_JSON__", "tafsir.json")):
    # the single file stays light for iPhone: it carries the word meanings but not the long tafsir
    _h = _h.replace(ph, "{}" if f == "tafsir.json" else open(os.path.join(root, "data", f), encoding="utf-8").read().replace("</", "<\\/"))
t = t.replace("<!--ASK_HTML-->", open(os.path.join(root, "ask.html"), encoding="utf-8").read()).replace("<!--ASK_DATA-->", _h)
t = t.replace("__QURAN_JSON__", open(os.path.join(root, "quran.json"), encoding="utf-8").read())
t = t.replace("<!--SCENE-->", open(os.path.join(root, "scene_fragment.html"), encoding="utf-8").read().replace("/*__ADH_T__*/", open(os.path.join(root, "timings.js")).read()))
for _n in ("mosque", "arch", "book-l", "book-r"):
    t = t.replace('src="splash/%s.png"' % _n, 'src="data:image/png;base64,%s"' % b64(os.path.join(root, "web", "splash", _n + ".png")))
assert "//__SV__" in t
t = t.replace("var SINGLE_VOICES=null;//__SV__", "var SINGLE_VOICES=%s;" % str(VOICES).replace("'", '"'))

# fonts: taken out of the <head> and added by a script at the very end
faces = []
for fam, name, weight in [("Cairo", "Cairo", "200 1000"), ("Amiri Quran", "AmiriQuran", "400"),
                          ("Amiri", "Amiri-Regular", "400"), ("Amiri", "Amiri-Bold", "700")]:
    rule = "@font-face{font-family:'%s';src:url(fonts/%s.woff) format('woff');font-weight:%s;font-display:swap}" % (fam, name, weight)
    assert rule in t, rule
    t = t.replace(rule + "\n", "")
    uri = "data:font/woff;base64," + b64(os.path.join(root, "web", "fonts", name + ".woff"))
    faces.append("@font-face{font-family:'%s';src:url(%s) format('woff');font-weight:%s;font-display:swap}" % (fam, uri, weight))
assert "fonts/" not in t.split("</style>")[0], "a font is still loaded from a file"

# icon -> small data URI, drop manifest
icon = "data:image/png;base64," + b64(os.path.join(root, "web", "icon-192.png"))
t = t.replace('<link rel="manifest" href="manifest.webmanifest">\n', "")
t = t.replace('href="icon-192.png"', 'href="%s"' % icon)
t = t.replace("icon:'icon-192.png'", "icon:'%s'" % icon)

# heavy data at the end of <body>
tail = ['<script type="text/plain" id="font-css">%s</script>' % "\n".join(faces),
        "<script>(function(){try{var s=document.createElement('style');s.textContent=document.getElementById('font-css').textContent;document.head.appendChild(s)}catch(e){}})();</script>"]
for name in VOICES + ["fajr"]:
    tail.append('<script type="text/plain" id="aud-%s">%s</script>' % (name, b64(os.path.join(audio_dir, name + ".mp3"))))
assert t.rstrip().endswith("</body>\n</html>") or t.rstrip().endswith("</html>")
idx = t.rindex("</body>")
t = t[:idx] + "\n".join(tail) + "\n" + t[idx:]

out = os.path.join(root, "أنس مسلم.html")
open(out, "w", encoding="utf-8").write(t)
print("written", out, round(os.path.getsize(out) / 1e6, 1), "MB")
