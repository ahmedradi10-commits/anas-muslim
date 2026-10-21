"""ilm/*.txt  ->  ilm/ilm.json   (## العنوان | كلمات | سؤال بديل | سؤال بديل ...  ثم فقرات)"""
import os, json, glob, sys
root = os.path.dirname(os.path.abspath(__file__))
out = []; seen = {}
for f in sorted(glob.glob(os.path.join(root, "ilm", "*.txt"))):
    cur = None
    for line in open(f, encoding="utf-8"):
        line = line.rstrip("\n")
        if line.startswith("## "):
            if cur: out.append(cur)
            parts = [x.strip() for x in line[3:].split("|")]
            title = parts[0]; keys = parts[1] if len(parts) > 1 else ""; alts = parts[2:]
            if title in seen: print("DUP", title, os.path.basename(f))
            seen[title] = 1
            cur = [title, keys, ""] + alts; cur_b = []
            cur[2] = []
        elif cur is not None and line.strip():
            cur[2].append(line.strip())
    if cur: out.append(cur); cur = None
for e in out: e[2] = "\n".join(e[2])
json.dump(out, open(os.path.join(root, "ilm", "ilm.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(out), "entries", sum(len(e[2]) for e in out), "chars")
