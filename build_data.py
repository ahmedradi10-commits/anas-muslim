"""Builds data/gharib.json, data/tafsir.json (from spa5k/tafsir_api checkout) and data/qa.json (merged Q&A)."""
import json, re, os, sys
SRC = os.environ.get("TAFSIR_SRC", "/tmp/claude-0/-home-claude/49113b4b-37cf-54ab-9d59-e8c9cb2a6229/scratchpad/ext/tafsir_api/tafsir")
QA = os.environ.get("QA_SRC", "/tmp/claude-0/-home-claude/49113b4b-37cf-54ab-9d59-e8c9cb2a6229/scratchpad/qa")
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
Q = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "quran.json")))

gh = {}
for s in Q["s"]:
    n = s["n"]
    for x in json.load(open(f"{SRC}/al-muyassar-fi-al-gharib/{n}.json")):
        items = []
        for blk in x["text"].split("\n\n"):
            m = re.match(r"^﴿(.+?)﴾\s*:?\s*(.*)$", blk.strip(), re.S)
            if m and m.group(2).strip():
                items.append([m.group(1).strip(), m.group(2).strip()])
        if items:
            gh[f"{n}:{x['ayah']}"] = items
json.dump(gh, open(f"{out}/gharib.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

tf = {}
for s in Q["s"]:
    n = s["n"]
    for x in json.load(open(f"{SRC}/ar-tafsir-muyassar/{n}.json")):
        t = x["text"]
        if t.startswith("تسمية السورة"):
            blocks = t.split("\n\n")
            # drop the sura intro blocks (title/purposes), keep what follows
            i = 0
            while i < len(blocks) and (blocks[i].strip().startswith(("تسمية السورة", "من مقاصد السورة", "•")) or not blocks[i].strip()):
                i += 1
            t = "\n\n".join(blocks[i:]).strip()
        t = re.sub(r'^\[التفسير\]\s*', '', t.strip()).strip()
        if t:
            tf[f"{n}:{x['ayah']}"] = t
json.dump(tf, open(f"{out}/tafsir.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

qa = []
for i in range(1, 6):
    for e in json.load(open(f"{QA}/qa{i}.json")):
        u = e["u"]
        m = re.match(r"(https://www\.islamweb\.net/ar/fatwa/\d+)", u)
        if m: u = m.group(1) + "/"
        e["u"] = u
        e["s"] = "islamqa" if "islamqa" in u else "islamweb"
        qa.append(e)
json.dump(qa, open(f"{out}/qa.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(gh), len(tf), len(qa), [os.path.getsize(f"{out}/{f}") for f in ("gharib.json", "tafsir.json", "qa.json")])
