"""Repairs Arabic text extracted by pdftotext from الرحيق المختوم: lam-alef ligatures come out reversed."""
import re, json, sys, collections, itertools
DATA='/home/claude/anas-muslim/data/'
TASH=re.compile('[ً-ٰٟۖ-ۭـ]')
def wn(w): return w
vocab=collections.Counter()
def eat(x):
    if isinstance(x,str):
        for w in re.findall(r'[ء-ي]+',TASH.sub('',x)): vocab[w]+=1
    elif isinstance(x,dict):
        for k,v in x.items(): eat(v)
    elif isinstance(x,list):
        for v in x: eat(v)
for f in ('tafsir.json','qa.json','gharib.json'): eat(json.load(open(DATA+f,encoding='utf-8')))
try: eat(json.load(open('/home/claude/anas-muslim/quran.json',encoding='utf-8')))
except Exception as e: print('no quran',e)
# unambiguous words from the book itself (no 'ال' mid-word and no ligature artefacts) are added later
raw=open(sys.argv[1],encoding='utf-8').read() if len(sys.argv)>1 else ''
raw=re.sub('[‪-‮​-‏⁦-⁩﻿­]','',raw)
raw=raw.replace('\f','\n')
LIG=re.compile(r'[اإأآ]ل')
PRE='وفبكلس'
PFX=['و','ف','ب','ك','ل','س','ال','وال','فال','بال','كال','لل','ولل','فلل','وب','وك','ول','فب','فل','ولل','وس']
def freq(w):
    f=vocab.get(w,0)
    if f: return f*1.0
    best=0
    for p in PFX:
        if len(w)>len(p)+1 and w.startswith(p):
            best=max(best,vocab.get(w[len(p):],0)*0.5)
    return best
def variants(w):
    spots=[m.start() for m in re.finditer(r'(?=[اإأآ]ل)',w)]
    # non-overlapping
    sp=[];last=-2
    for s in spots:
        if s>=last+2: sp.append(s);last=s
    if not sp or len(sp)>6: return [w],sp
    out=[]
    for mask in itertools.product((0,1),repeat=len(sp)):
        v=list(w)
        for m,s in zip(mask,sp):
            if m: v[s],v[s+1]=v[s+1],v[s]
        out.append(''.join(v))
    return out,sp
cache={}
def fixword(w):
    if w in cache: return cache[w]
    o=w
    w=w.replace('هللا','الله')
    w=re.sub(r'هلل','لله',w)
    if w=='ال': r='لا'
    elif w in ('فال','وال','بال','كال') : r=w[0]+'لا' if freq(w)<5000 else w
    else:
        vs,sp=variants(w)
        if len(vs)==1: r=w
        else:
            sc=[(freq(v),-bin_swaps(w,v),v) for v in vs]
            sc.sort(reverse=True)
            if sc[0][0]>0: r=sc[0][2]
            else:
                # heuristic: swap every spot that is not at word start / right after a prefix+article
                v=list(w)
                for s in sp:
                    # unknown word: only article+hamza (األ، اإل، اآل) is certainly a reversed ligature
                    if w[s]!='ا' and s>=1 and w[s-1]=='ا':
                        v[s],v[s+1]=v[s+1],v[s]
                r=''.join(v)
    if r.startswith('لا') and len(r)>3 and vocab.get(r,0)==0 and vocab.get('ال'+r[2:],0)+vocab.get(r[2:],0)>0: r='ال'+r[2:]
    cache[o]=r;return r
def bin_swaps(a,b): return sum(1 for x,y in zip(a,b) if x!=y)
def fixline(l):
    return re.sub(r'[ء-يً-ٰٟ]+',lambda m:fixword_d(m.group(0)),l)
def fixword_d(w):
    # keep diacritics out of matching: strip them (book text shown without tashkeel anyway)
    return fixword(TASH.sub('',w))
out=[]
for l in raw.split('\n'):
    l=l.strip()
    if not l: out.append('');continue
    out.append(fixline(l))
if len(sys.argv)>2:
    open(sys.argv[2],'w',encoding='utf-8').write('\n'.join(out))
    print(len(vocab),'vocab words;',len(out),'lines')
