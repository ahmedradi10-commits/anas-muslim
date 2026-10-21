"""Builds web/index.html (+ web/adhan.html) from the templates, then copies web/ into the Android assets."""
import os, shutil

root = os.path.dirname(os.path.abspath(__file__))
read = lambda *p: open(os.path.join(root, *p), encoding="utf-8").read()

timings = read("timings.js")
scene = read("scene_fragment.html").replace("/*__ADH_T__*/", timings)
tpl = read("template.html")
assert "__QURAN_JSON__" in tpl and "<!--SCENE-->" in tpl
def ask_data():
    h = read("ask_data.html")
    for ph, f in (("__QA_JSON__", "qa.json"), ("__GH_JSON__", "gharib.json"), ("__TF_JSON__", "tafsir.json")):
        h = h.replace(ph, read("data", f).replace("</", "<\\/"))
    h = h.replace("__ILM_JSON__", read("ilm", "ilm.json").replace("</", "<\\/"))
    h = h.replace("__ISL_JSON__", read("data", "islamstory.json").replace("</", "<\\/"))
    return h.replace("__SIRA_JSON__", read("sira", "sections.json").replace("</", "<\\/"))
for ph,f in (("/*__MORE_CSS__*/","more.css"),("<!--MORE_HTML-->","more.html"),("//__MORE_JS__","more.js"),("/*__ASK_CSS__*/","ask.css"),("//__ASK_JS__","ask.js")):
    assert ph in tpl, ph
    tpl = tpl.replace(ph, read(f))
assert "<!--ASK_HTML-->" in tpl
tpl = tpl.replace("<!--ASK_HTML-->", read("ask.html")).replace("<!--ASK_DATA-->", ask_data())
import base64
def b64(f): return "data:image/webp;base64," + base64.b64encode(open(os.path.join(root, "sheikh", f), "rb").read()).decode()
page = tpl.replace("__QURAN_JSON__", read("quran.json")).replace("<!--SCENE-->", scene)
page = page.replace("__SHEIKH_CIRCLE__", b64("circle.webp")).replace("__SHEIKH_FACE__", b64("face.webp"))
os.makedirs(os.path.join(root, "web"), exist_ok=True)
open(os.path.join(root, "web", "index.html"), "w", encoding="utf-8").write(page)

shell = read("adhan_shell.html")
assert "<!--SCENE-->" in shell
open(os.path.join(root, "web", "adhan.html"), "w", encoding="utf-8").write(shell.replace("<!--SCENE-->", scene))

dest = os.path.join(root, "android", "app", "src", "main", "assets", "www")
if os.path.isdir(os.path.join(root, "android")):
    if os.path.isdir(dest):
        shutil.rmtree(dest)
    shutil.copytree(os.path.join(root, "web"), dest, ignore=shutil.ignore_patterns("sw.js", "manifest.webmanifest", "OFL-*"))
print("built")
