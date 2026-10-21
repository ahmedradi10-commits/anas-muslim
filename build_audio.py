"""Re-encodes the adhan recordings: all voices into web/audio (APK), a lighter set into single_audio (single HTML),
and writes timings.js (line start times for the voices where the pauses between lines were found reliably)."""
import json, os, subprocess
root = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ["ADHAN_SRC"]
F = {'abdelbasit':'Athan Abed Albase6.mp3','naina':'Athan Ahmad Nuyne3.mp3','fajr':'Athan Al-fajer - Malek chebae.mp3','deghreri':'Athan Hamad Deghreri.mp3','malki':'Athan Hamdan Almalki.mp3','arkani':'Athan Ibrahim Al-Arkani.mp3','hamathani':'Athan Majed Al-hamathani.mp3','makkah':'Athan Makkah.mp3','zahrani':'Athan Mansoor Az-Zahrani.mp3','alafasy':'Athan Mishary Alafasi.mp3','menshawy':'Athan Mohammad Almenshawy.mp3','refaat':'Athan Mohammad Ref3at.mp3','qatami':'Athan Nasser Alqatami.mp3','khatba':'Athan Suhaib Khatba.mp3'}
SINGLE = ['makkah','abdelbasit','alafasy','menshawy','arkani','refaat','qatami','fajr']
seg = json.load(open(os.path.join(root,'timings_src.json')))
SYNC = {k:v for k,v in seg.items() if v['good']==v['n']-1 and k in ('abdelbasit','fajr','arkani','makkah','alafasy','menshawy')}
for d in ('web/audio','single_audio'): os.makedirs(os.path.join(root,d),exist_ok=True)
for k,f in F.items():
    cut = ['-t', '%.2f' % (SYNC[k]['end']+2.5)] if k in SYNC else []
    src = os.path.join(SRC,f)
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vn','-map','0:a:0']+cut+['-ac','1','-ar','22050','-c:a','libmp3lame','-b:a','32k',os.path.join(root,'web/audio',k+'.mp3')],check=True,stderr=subprocess.DEVNULL)
    if k in SINGLE:
        subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vn','-map','0:a:0']+cut+['-ac','1','-ar','16000','-c:a','libmp3lame','-b:a','12k',os.path.join(root,'single_audio',k+'.mp3')],check=True,stderr=subprocess.DEVNULL)
W12 = [1,1,1.1,1.1,1.2,1.2,.9,.9,.9,.9,1,.8]
T = {k:[round(x,2) for x in v['starts']] for k,v in SYNC.items()}
# voices without clear pauses: approximate line times by the usual proportions of the adhan
for k in F:
    if k in T: continue
    on, end = (seg[k]['on'], seg[k]['end']) if k in seg else (0.3, 138.8)
    tot = sum(W12); acc = 0; st = [on]
    for w in W12:
        acc += w; st.append(round(on + (end-on)*acc/tot, 2))
    T[k] = st[:-1]   # start time of each of the 12 lines
open(os.path.join(root,'timings.js'),'w').write('var ADH_T='+json.dumps(T)+';')
print('sync voices:',list(T), 'lines', {k:len(v)-1 for k,v in T.items()})
