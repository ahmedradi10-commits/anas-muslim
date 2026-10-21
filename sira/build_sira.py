"""fixed.txt -> sections.json  [[heading, text], ...]  (الرحيق المختوم)"""
import re, json, collections
TASH=re.compile('[ً-ٰٟۖ-ۭـ]')
FIX=[('اإلسال','الإسلا'),('إسال','إسلا'),('إعال','إعلا'),('احتال','احتلا'),('الميال','الميلا'),('الثالثاء','الثلاثاء'),('الإسالم','الإسلام'),('بالإسال','بالإسلا'),('إالأن','إلا أن'),('الجيش الإسالمي','الجيش الإسلامي'),('اإل','الإ'),('االس','الاس'),('االج','الاج'),('االق','الاق'),('االن','الان'),('االنس','الانس'),('االخ','الاخ'),('االح','الاح'),('االع','الاع'),('االد','الاد'),('االت','الات'),('االب','الاب'),('االر','الار'),('الاإ','الإ')]
def applyfix(t):
    for a,b in FIX: t=t.replace(a,b)
    return t
L=[applyfix(l.strip()) for l in open('fixed.txt',encoding='utf-8').read().split('\n')]
def junk(l):
    if not l: return True
    if 'ISLAMWAY' in l.upper(): return True
    if re.fullmatch(r'[\d\s.\-:\[\]()،]+',l): return True
    w=l.split()
    if len(w)>=2 and sum(len(x) for x in w)/len(w)<2.3: return True      # spaced-out fragments
    if len(l)<4: return True
    if re.search(r'\[[^\]]*\d+[^\]]*\]',l) and len(l)<40: return True
    return False
def is_head(l,nxt):
    if len(l)<4 or len(l)>70: return False
    if re.search(r'[\d.،:؟!{}\[\]()«»"]',l): return False
    w=l.split()
    if len(w)>9 or len(w)<1: return False
    return nxt is not None and len(nxt)>=45
rows=[];i=0
lines=[l for l in L]
# find first real section after table of contents: keep everything, TOC lines are short consecutive lines (no next long line)
sections=[];cur=None
clean=[]
for l in lines:
    if not l: clean.append('');continue
    if junk(l): continue
    clean.append(TASH.sub('',l))
cnt=collections.Counter(l for l in clean if l)
HEADS={l for l,n in cnt.items() if n>=2 and 4<=len(l)<=70 and not re.search(r'[\d.،:؟!{}\[\]()«»"]',l) and len(l.split())<=9}
HEADRE=re.compile(r'^(غزوة|سرية|سرايا|معركة|صلح|فتح|حجة|وفاة|بيعة|عمرة|حصار|وفود|الهجرة|الإسراء|مولد|المولد|الوحي)\b')
def nextlong(i):
    for j in range(i+1,min(i+4,len(clean))):
        if clean[j]: return clean[j]
    return None
for i,l in enumerate(clean):
    if not l: continue
    if (l in HEADS or (HEADRE.match(l) and 4<=len(l)<=75 and len(l.split())<=11 and not re.search(r'[.،:؟!{}\[\]()«»\"]',l))) and ((l in HEADS and (lambda n: n is not None and len(n)>=45)(nextlong(i))) or HEADRE.match(l)):
        cur=[l,[]];sections.append(cur)
    elif cur is not None:
        cur[1].append(l)
out=[];parent='';lastparent_used=''
for h,t in sections:
    txt=re.sub(r'\s+',' ',' '.join(t)).strip()
    major=bool(HEADRE.match(h))
    if major: parent=h
    if len(txt)<120: continue
    par=parent if (parent and parent!=h) else ''
    first=1 if (par and par!=lastparent_used) else 0
    if par: lastparent_used=par
    out.append([h,txt,par,first])
json.dump(out,open('sections.json','w',encoding='utf-8'),ensure_ascii=False)
print(len(out),'sections',sum(len(x[1]) for x in out),'chars')
pass
