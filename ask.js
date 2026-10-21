/* ===================== الاسم + اسأل أنس + معاني الكلمات + خلفيات المصحف ===================== */
(function(){
function jdata(id){try{var e=document.getElementById(id);return e?JSON.parse(e.textContent):null}catch(x){return null}}
function hesc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uName(){return String(store.get('userName','')||'')}
function aiName(){return 'الشيخ'}

/* ---------- الصورة الرمزية (رسم أصلي) ---------- */
/* كل أفاتار بيتعرض في أكثر من مكان في نفس الوقت (الترويسة، الإعدادات، شبكة الاختيار)،
   فلازم كل نسخة تاخد مُعرّفات SVG فريدة وإلا تضارب الـ id يخفي التدرّجات/الظل في بعض المتصفحات. */
function mkAv(o){
  var sk=o.skin,id='%ID%';
  var k='<svg viewBox="0 0 100 100" aria-hidden="true"><defs>'
   +'<radialGradient id="'+id+'f" cx=".34" cy=".26" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#6B2E12" stop-opacity=".34"/></radialGradient>'
   +'<radialGradient id="'+id+'b" cx=".28" cy=".18" r="1.05"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>'
   +'<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>'
   +'<filter id="'+id+'d" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.8" stdDeviation="1.6" flood-color="#2a1208" flood-opacity=".38"/></filter></defs>';
  k+='<rect width="100" height="100" fill="'+o.bg+'"/><rect width="100" height="100" fill="url(#'+id+'b)"/>';
  k+='<g>'+o.body+'</g><rect x="0" y="70" width="100" height="30" fill="url(#'+id+'s)"/>';
  k+='<ellipse cx="50" cy="77" rx="22" ry="6" fill="#000" opacity=".2"/>';
  k+='<rect x="42" y="66" width="16" height="15" rx="7" fill="'+o.neck+'"/><ellipse cx="50" cy="73" rx="9" ry="4" fill="#000" opacity=".14"/>'+(o.back||'');
  if(!o.girl)k+='<g filter="url(#'+id+'d)"><ellipse cx="29.5" cy="54" rx="3.8" ry="5.2" fill="'+sk+'"/><ellipse cx="70.5" cy="54" rx="3.8" ry="5.2" fill="'+sk+'"/></g><ellipse cx="29.8" cy="54.4" rx="1.6" ry="2.6" fill="#B9694A" opacity=".35"/><ellipse cx="70.2" cy="54.4" rx="1.6" ry="2.6" fill="#B9694A" opacity=".35"/>';
  var fx=o.girl?18.5:21.5,fy=o.girl?21.5:23.5;
  k+='<g filter="url(#'+id+'d)"><ellipse cx="50" cy="54" rx="'+fx+'" ry="'+fy+'" fill="'+sk+'"/></g>';
  k+='<ellipse cx="50" cy="54" rx="'+fx+'" ry="'+fy+'" fill="url(#'+id+'f)"/>';
  k+='<ellipse cx="36.5" cy="62.5" rx="5" ry="3.6" fill="#F0786A" opacity=".34"/><ellipse cx="63.5" cy="62.5" rx="5" ry="3.6" fill="#F0786A" opacity=".34"/>';
  k+='<ellipse cx="42" cy="55.5" rx="3.6" ry="4.4" fill="#1E120B"/><ellipse cx="58" cy="55.5" rx="3.6" ry="4.4" fill="#1E120B"/>';
  k+='<ellipse cx="43.2" cy="53.8" rx="1.35" ry="1.6" fill="#fff"/><ellipse cx="59.2" cy="53.8" rx="1.35" ry="1.6" fill="#fff"/><circle cx="41.1" cy="57.6" r=".7" fill="#fff" opacity=".7"/><circle cx="57.1" cy="57.6" r=".7" fill="#fff" opacity=".7"/>';
  k+='<path d="M37 48.6q5-3.4 10-.6M53 48q5-2.8 10 .6" fill="none" stroke="'+(o.brow||'#4A3426')+'" stroke-width="2.3" stroke-linecap="round"/>';
  k+='<ellipse cx="50" cy="60.5" rx="2.6" ry="2" fill="#000" opacity=".12"/><ellipse cx="49.6" cy="59.6" rx="2.2" ry="1.6" fill="#fff" opacity=".28"/>';
  k+='<path d="M42.5 65q7.5 6.5 15 0q-2 5.5-7.5 5.6q-5.5-.1-7.5-5.6z" fill="#B3463B"/><path d="M44.5 66q5.5 3 11 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".85"/><path d="M42.5 65q7.5 6.5 15 0" fill="none" stroke="#7E2B24" stroke-width="1.2" stroke-linecap="round"/>';
  k+=(o.front||'');
  return k+'<rect width="100" height="100" fill="url(#'+id+'b)" opacity=".55"/></svg>';
}
var THOBE='<path d="M12 100C14 82 30 75 50 75S86 82 88 100Z" fill="#fff"/><path d="M43 75l7 10 7-10z" fill="#E4E4E4"/>';
function hjb(c,d){return {back:'<path d="M50 11C28 11 21 32 22 53 23 73 32 82 50 82S77 73 78 53C79 32 72 11 50 11Z" fill="'+c+'"/>',body:'<path d="M8 100C10 80 30 72 50 72S90 80 92 100Z" fill="'+d+'"/>'}}
var AVSPEC=[
 {bg:'#2FA58B',skin:'#F5D0AE',neck:'#E2B48E',body:THOBE,front:'<path d="M30 42C30 27 40 22 50 22S70 27 70 42C60 37 40 37 30 42Z" fill="#fff" stroke="#D6D6D6" stroke-width="1"/><path d="M38 31h24M36 35h28" stroke="#E3E3E3" stroke-width="1.2"/>'},
 {bg:'#E0A83D',skin:'#D4A373',neck:'#B98557',body:'<path d="M12 100C14 82 30 75 50 75S86 82 88 100Z" fill="#F3E6CC"/><path d="M43 75l7 10 7-10z" fill="#D9C8A6"/>',front:'<path d="M30 43C30 28 40 22 50 22S70 28 70 43C60 38 40 38 30 43Z" fill="#1F3A5F"/><path d="M31 41C42 37 58 37 69 41" fill="none" stroke="#E0B964" stroke-width="1.6"/>'},
 {bg:'#7B6FD0',skin:'#E8BE92',neck:'#CFA074',body:THOBE,front:'<path d="M24 50C22 27 36 15 50 15S78 27 76 50L81 72C70 68 68 57 68 47C60 40 40 40 32 47C32 57 30 68 19 72Z" fill="#fff"/><path d="M31 34l7 7M43 28l7 7M57 28l7 7M69 34l-7 7M26 46l6 6M74 46l-6 6" stroke="#D63A3A" stroke-width="2.2" stroke-linecap="round"/><path d="M28 36C38 29 62 29 72 36" fill="none" stroke="#222" stroke-width="4.5" stroke-linecap="round"/>'},
 Object.assign({bg:'#F4D9A8',skin:'#F6D3B3',neck:'#E2B48E',girl:1},hjb('#1B8F8A','#157671')),
 Object.assign({bg:'#C7E6DC',skin:'#D7A878',neck:'#BA895C',girl:1},hjb('#D9577B','#BC4064')),
 Object.assign({bg:'#F1D6E0',skin:'#E9BF95',neck:'#CFA074',girl:1},hjb('#5B5AA6','#47468A'))
];
var SHEIKH_FACE='__SHEIKH_FACE__';
var AVATAR='<img class="sface" alt="" src="'+SHEIKH_FACE+'">';
var AVTPL=AVSPEC.map(mkAv);
var avUid=0;
function avHtml(i){avUid++;return AVTPL[i].replace(/%ID%/g,'avu'+avUid+'_')}
function uavIdx(){var i=parseInt(store.get('avatar',0),10);return isNaN(i)||i<0||i>5?0:i}

/* ---------- ترويسة الهوم ---------- */
function greet(){var h=new Date().getHours();return h<5?'تصبح على خير':h<12?'صباح الخير':h<18?'نهارك سعيد':'مساء الخير'}
function paintAvGrid(){
  var g=$('#avGrid');if(!g)return;
  var idx=uavIdx(),h='';
  for(var i=0;i<AVTPL.length;i++)h+='<button type="button" class="avopt'+(i===idx?' on':'')+'" data-i="'+i+'" aria-label="شخصية '+AR(i+1)+'"><span class="av">'+avHtml(i)+'</span></button>';
  g.innerHTML=h;
}
function renderHead(){
  var n=uName(),a=aiName();
  $('#hhead').innerHTML='<button class="askbtn" id="askOpen" aria-label="اسأل '+hesc(a)+'"><span class="av">'+AVATAR+'</span><b>اسأل '+hesc(a)+'</b></button><div class="hi"><h2>'+(n?'أهلاً يا '+hesc(n):'أهلاً بك')+'</h2><p>'+greet()+' · رفيقك في كل صلاة</p></div><button class="uav" id="uavOpen" aria-label="الإعدادات"><span class="av">'+avHtml(uavIdx())+'</span></button>';
  $('#askOpen').onclick=openAsk;$('#uavOpen').onclick=function(){showTab('settings')};
  var sa=$('#setAv');if(sa)sa.innerHTML=avHtml(uavIdx());paintAvGrid();
  $('#askTitle').textContent='اسأل '+a;
  var iu=$('#inUser');if(iu)iu.value=n;
}
document.addEventListener('click',function(e){var b=e.target.closest('#avGrid .avopt');if(!b)return;store.set('avatar',parseInt(b.getAttribute('data-i'),10));renderHead()});
$('#btnUser').onclick=function(){var v=$('#inUser').value.trim().slice(0,24);store.set('userName',v);renderHead();toast(v?'تم حفظ اسمك يا '+v:'تم حذف الاسم')};

/* ---------- أول دخول: اكتب اسمك ---------- */
function onboard(){
  var o=document.createElement('div'),pick=uavIdx();o.className='onb';
  var grid='';for(var i=0;i<AVTPL.length;i++)grid+='<button type="button" class="avopt'+(i===pick?' on':'')+'" data-i="'+i+'" aria-label="شخصية '+AR(i+1)+'"><span class="av">'+avHtml(i)+'</span></button>';
  o.innerHTML='<div class="card" role="dialog" aria-modal="true"><span class="av" id="onbAv">'+avHtml(pick)+'</span><h2>أهلاً بك في أنس مسلم</h2><p>اختر شخصيتك واكتب اسمك عشان نرحّب بيك كل مرة تفتح التطبيق.</p><div class="avgrid" id="onbGrid">'+grid+'</div><input id="onbIn" type="text" maxlength="24" placeholder="اسمك" autocomplete="off" enterkeyhint="done"><button class="go" id="onbGo">ابدأ</button><button class="skip" id="onbSkip">تخطّي</button></div>';
  document.body.appendChild(o);
  $('#onbGrid',o).addEventListener('click',function(e){var b=e.target.closest('.avopt');if(!b)return;pick=parseInt(b.getAttribute('data-i'),10);store.set('avatar',pick);$('#onbAv',o).innerHTML=avHtml(pick);o.querySelectorAll('.avopt').forEach(function(x){x.classList.toggle('on',x===b)})});
  function done(v){
    store.set('userName',v);store.set('onboarded',1);store.set('avatar',pick);
    o.style.transition='opacity .35s';o.style.opacity='0';setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o)},380);
    renderHead();if(v)toast('أهلاً يا '+v);
    afterOnboard();
  }
  $('#onbGo',o).onclick=function(){var v=$('#onbIn',o).value.trim();if(!v){$('#onbIn',o).focus();toast('اكتب اسمك الأول');return}done(v.slice(0,24))};
  $('#onbSkip',o).onclick=function(){done('')};
  $('#onbIn',o).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('#onbGo',o).click()}});
}
renderHead();

/* ---------- محرك البحث في الأسئلة الموثّقة ---------- */
var QA=[],DOCS=[],DF={},ready=false;
function nrm(s){return norm(String(s)).replace(/[ؤ]/g,'و').replace(/[ئ]/g,'ي').replace(/[^ء-ي0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
var SYN={ازاي:'كيف',ايه:'ما',فين:'اين',ليه:'لماذا',ينفع:'يجوز',مينفعش:'يحرم',عايز:'اريد',عاوز:'اريد',حرام:'يحرم',حلال:'يجوز',بتفطر:'يفطر',هصلي:'اصلي',صلاة:'صلاه'};
var STOP={};'ما ماذا هل هو هي في من علي عن الي يا كيف لماذا اريد ان انا انت هذا هذه ذلك لو اذا او ثم قد كان يكون ده دي دا مع بعد قبل عند ام ايضا بس كل لي لا لم لن ان انه انها اي ايه اللي الذي التي هم هن نحن ممكن لازم يعني وما وهل فيه فيها به بها له لها'.split(' ').forEach(function(w){STOP[w]=1});
function stem(w){
  w=w.replace(/^(وال|فال|بال|كال|لل|ال)(?=.{2})/,'');
  if(w.length>=5)w=w.replace(/^[وفبل](?=.{4})/,'');
  if(w.length>=5)w=w.replace(/(ها|هم|كم|نا|ان|ون|ين|ات)$/,'');
  if(w.length>=4)w=w.replace(/[هيك]$/,'');
  return w;
}
function toks(s){
  var out=[];nrm(s).split(' ').forEach(function(t){
    if(!t)return;if(SYN[t]!==undefined)t=SYN[t];
    t=nrm(t);if(!t||STOP[t])return;
    t.split(' ').forEach(function(u){u=stem(u);if(u&&u.length>1&&!STOP[u])out.push(u)});
  });
  return out;
}
function tm(a,b){
  if(a===b)return true;
  var m=Math.min(a.length,b.length),d=Math.abs(a.length-b.length);
  if(!(a.indexOf(b)===0||b.indexOf(a)===0))return false;
  if(m>=4)return d<=2;
  return m===3&&d===1&&'ةهيتكن'.indexOf((a.length>b.length?a:b).slice(-1))>-1;
}
function initQA(){
  if(ready)return;ready=true;
  QA=jdata('qa-data')||[];
  DOCS=QA.map(function(e,i){
    var strong=toks([e.q].concat(e.alt||[]).concat([e.k||'']).join(' ')),weak=toks(e.a||'');
    return {i:i,e:e,strong:strong,weak:weak,sset:Array.from(new Set(strong)),wset:Array.from(new Set(weak))};
  });
  DOCS.forEach(function(d){d.sset.forEach(function(t){DF[t]=(DF[t]||0)+1})});
}
function idf(t){var n=DOCS.length,df=0;for(var k in DF){if(tm(k,t))df+=DF[k]}return df?Math.log((n+1)/(df+0.5))+0.6:Math.log(n+1)+1.2}
function has(set,t){for(var i=0;i<set.length;i++)if(tm(set[i],t))return true;return false}
function search(q){
  initQA();
  var qt=Array.from(new Set(toks(q)));if(!qt.length)return null;
  var w={},tot=0;qt.forEach(function(t){w[t]=idf(t);tot+=w[t]});
  var best=null;
  DOCS.forEach(function(d){
    var s=0,strongN=0;
    qt.forEach(function(t){if(has(d.sset,t)){s+=w[t];strongN++}else if(has(d.wset,t))s+=w[t]*0.3});
    var cov=s/tot;
    if(!best||cov>best.cov||(cov===best.cov&&strongN>best.strongN))best={d:d,cov:cov,strongN:strongN,n:qt.length};
  });
  if(!best||best.strongN<1)return null;
  var need=best.n<=2?0.6:0.55;
  return best.cov>=need?best:null;
}
window.__askSearch=function(q){var r=search(q);return r?{q:r.d.e.q,cov:r.cov,u:r.d.e.u}:null};

/* ---------- المحادثة (اسأل الشيخ) ---------- */
var log=$('#askLog'),inited=false,busy=false,root=$('#v-ask'),cur=null;
var MICSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/></svg>';
var SPKSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>';
function endScroll(){var m=$('#skMain');setTimeout(function(){m.scrollTop=m.scrollHeight},40)}
function setQ(text,voice){
  var q=$('#skQ');q.hidden=false;q.className='skq'+(voice?' voiceq':(String(text).length>60?' long':''));
  if(voice){q.innerHTML=MICSVG+'<span>سؤال صوتي</span>'}else{q.innerHTML='<span></span>';q.firstChild.textContent=text}
}
function bub(cls,html){
  if(cls==='me')return null;
  var d=document.createElement('div');d.className='bub '+cls;d.innerHTML=html;log.appendChild(d);root.classList.add('has');root.classList.remove('idle');endScroll();return d;
}
function think(on){root.classList.toggle('think',!!on)}
function aiSay(html,cb,ms){
  think(true);root.classList.add('has');root.classList.remove('idle');
  setTimeout(function(){
    think(false);var d=bub('ai',html);
    if(cur&&!cur.said){cur.said=1;histAdd(cur.q,d);afterSay(d)}
    if(cb)cb(d);
  },ms||650);
}
function nm(){var n=uName();return n?' يا <b>'+hesc(n)+'</b>':''}
function showChips(){
  initQA();var box=$('#askChips');
  var pool=QA.filter(function(e){return e.q.length<46});
  var pick=[],seen={};
  while(pick.length<6&&pick.length<pool.length){var i=Math.floor(Math.random()*pool.length);if(!seen[i]){seen[i]=1;pick.push(pool[i])}}
  box.innerHTML=pick.map(function(e){return '<button type="button" data-q="'+hesc(e.q)+'">'+hesc(e.q)+'</button>'}).join('');
}
function hideChips(){$('#askChips').innerHTML=''}
$('#askChips').addEventListener('click',function(e){var b=e.target.closest('button');if(b)send(b.getAttribute('data-q'))});
function resetView(){
  if(busy)return;
  stopAll();log.innerHTML='';cur=null;st('');
  var q=$('#skQ');q.hidden=true;q.className='skq';q.innerHTML='<span id="skQt"></span>';
  root.classList.remove('has','think','listen','speak');root.classList.add('idle');setVol(1);showChips();
}
function openAsk(){
  if(window.__ayahClear)window.__ayahClear();
  showTab('ask');window.scrollTo(0,0);inited=true;resetView();
}
$('#askBack').onclick=function(){stopAll();showTab('home')};

/* ---------- سجل الأسئلة ---------- */
function hist(){var h=store.get('skHist',[]);return Array.isArray(h)?h:[]}
function histAdd(q,el){
  try{
    var c=el.cloneNode(true);c.querySelectorAll('.kbmore,.qnext,.bkmore,.spk').forEach(function(x){x.parentNode.removeChild(x)});
    var h=hist();h.unshift({q:q,a:c.innerHTML.slice(0,7000),t:Date.now()});store.set('skHist',h.slice(0,80));
  }catch(e){}
}
function ago2(t){var m=Math.floor((Date.now()-t)/6e4);if(m<1)return 'الآن';if(m<60)return 'منذ '+AR(m)+' دقيقة';var h=Math.floor(m/60);if(h<24)return 'منذ '+AR(h)+' ساعة';var d=Math.floor(h/24);return 'منذ '+AR(d)+' يوم'}
function paintHist(){
  var h=hist(),b=$('#skHist');
  b.innerHTML=h.length?h.map(function(r,i){return '<button type="button" class="skhi" data-i="'+i+'">'+hesc(r.q)+'<small>'+ago2(r.t)+'</small></button>'}).join(''):'<div class="skhe">لا توجد أسئلة سابقة بعد.</div>';
  $('#skClr').hidden=!h.length;
}
function drwOpen(p){$('#skDrw').hidden=false;drwTab(p||'h')}
function drwClose(){$('#skDrw').hidden=true}
function drwTab(p){
  document.querySelectorAll('.sktabs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-p')===p)});
  $('#skPgH').hidden=p!=='h';$('#skPgS').hidden=p!=='s';
  if(p==='h')paintHist();else paintVoices();
}
$('#skMenu').onclick=function(){drwOpen('h')};
$('#skBd').onclick=drwClose;
document.querySelector('.sktabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)drwTab(b.getAttribute('data-p'))});
$('#skHist').addEventListener('click',function(e){
  var b=e.target.closest('.skhi');if(!b)return;var r=hist()[parseInt(b.getAttribute('data-i'),10)];if(!r)return;
  stopAll();hideChips();setQ(r.q);log.innerHTML='';var d=bub('ai',r.a);cur=null;addSpk(d);drwClose();
  root.classList.remove('idle','think');root.classList.add('has');$('#skMain').scrollTop=0;
});
$('#skClr').onclick=function(){store.set('skHist',[]);paintHist()};
window.__askBack=function(){if(currentTab!=='ask')return false;if(!$('#skDrw').hidden){drwClose();return true}stopAll();return false};

/* ---------- الصوت: التحدث مع الشيخ ونطق الإجابة ---------- */
var NV=!!(window.AndroidVoice&&window.AndroidVoice.listen),listening=false,speaking=false,vol=1,spkTm=0,VOICES=[];
function st(t){$('#skSt').textContent=t||''}
function setVol(v){vol=v;root.style.setProperty('--vol',v.toFixed(3))}
function vget(k,d){var v=store.get('sk'+k,null);return v===null||v===undefined?d:v}
function online(){try{if(NV&&window.AndroidVoice.online)return!!window.AndroidVoice.online()}catch(e){}return navigator.onLine!==false}
function plain(el){
  var d=el.cloneNode(true);d.querySelectorAll('button,small,.src,.disc,.spk').forEach(function(x){x.parentNode.removeChild(x)});
  d.querySelectorAll('p,.qt').forEach(function(x){x.appendChild(document.createTextNode('. '))});
  return (d.textContent||'').replace(/[﴿﴾۞۩]/g,' ').replace(/\s+/g,' ').trim().slice(0,1600);
}
function addSpk(d){
  if(!d||d.querySelector('.spk'))return;
  var b=document.createElement('button');b.type='button';b.className='spk';b.innerHTML=SPKSVG+'<span>استمع للشيخ</span>';d.appendChild(b);
}
function afterSay(d){addSpk(d);if(cur&&(cur.voice||vget('Auto',false)))speakText(plain(d))}
log.addEventListener('click',function(e){
  var b=e.target.closest('.spk');if(!b)return;
  if(speaking){stopSpeak();return}
  speakText(plain(b.parentNode));
});
function speakUI(on){
  speaking=on;root.classList.toggle('speak',on);clearInterval(spkTm);
  if(on){st('الشيخ يتحدث…');spkTm=setInterval(function(){var t=Date.now()/1000;setVol(1.07+0.06*Math.sin(t*9)*Math.sin(t*2.3)+Math.random()*0.035)},70)}
  else{setVol(1);if(!listening)st('')}
}
function speakText(text){
  if(!text)return;stopSpeak();
  var voice=String(vget('Voice','')),pitch=(vget('Pitch',90))/100,rate=(vget('Rate',95))/100;
  if(NV){try{window.AndroidVoice.speak(text,voice,rate,pitch);speakUI(true)}catch(e){}return}
  if(window.speechSynthesis){
    var u=new SpeechSynthesisUtterance(text);u.lang='ar-SA';u.pitch=pitch;u.rate=rate;
    var vs=speechSynthesis.getVoices().filter(function(v){return /^ar/i.test(v.lang)});
    var v0=vs.filter(function(v){return v.name===voice})[0]||vs[0];if(v0){u.voice=v0;u.lang=v0.lang}
    u.onstart=function(){speakUI(true)};u.onend=u.onerror=function(){speakUI(false)};
    speechSynthesis.speak(u);
  }
}
function stopSpeak(){
  try{if(NV)window.AndroidVoice.stopSpeak();else if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
  if(speaking)speakUI(false);
}
function stopListenUI(){listening=false;root.classList.remove('listen');if(!speaking)setVol(1)}
function stopAll(){
  stopSpeak();
  if(listening){try{if(NV)window.AndroidVoice.cancel();else if(webRec)webRec.abort()}catch(e){}stopWebMic();stopListenUI();st('')}
}
function noNet(){
  if(busy)return;hideChips();log.innerHTML='';setQ('التحدّث مع الشيخ');cur={q:'',voice:true,said:1};
  root.classList.remove('idle');root.classList.add('has');
  var msg='لا يوجد إنترنت. ميزة التحدّث مع الشيخ بالصوت تحتاج إلى اتصال بالإنترنت لتحويل كلامك إلى كتابة. يمكنك كتابة سؤالك وسأجيبك بدون إنترنت.';
  aiSay('<span class="qt">لا يوجد إنترنت</span>'+fmt(msg),function(d){addSpk(d);speakText(msg)},400);
}
function micTap(){
  if(listening){
    if(NV){try{window.AndroidVoice.stopListen()}catch(e){}}else if(webRec){try{webRec.stop()}catch(e){}}
    st('أفهم كلامك…');return;
  }
  if(busy)return;
  stopSpeak();
  if(!online()){noNet();return}
  startListen();
}
$('#skMic').onclick=micTap;
$('#skAv').onclick=function(){if(speaking)stopSpeak();else if(listening)micTap()};
var webRec=null,wAC=null,wStream=null,wRaf=0;
function stopWebMic(){cancelAnimationFrame(wRaf);try{wStream&&wStream.getTracks().forEach(function(t){t.stop()})}catch(e){}try{wAC&&wAC.close()}catch(e){}wStream=wAC=null}
function startListen(){
  listening=true;root.classList.add('listen');st('جارٍ تشغيل الميكروفون…');hideChips();
  if(NV){try{window.AndroidVoice.listen('ar-EG')}catch(e){stopListenUI();st('')}return}
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){stopListenUI();st('');toast('هذا الجهاز لا يدعم التعرّف على الصوت');return}
  var got='';webRec=new SR();webRec.lang='ar-EG';webRec.interimResults=false;webRec.maxAlternatives=1;
  webRec.onstart=function(){st('أسمعك… تحدّث الآن')};
  webRec.onresult=function(e){got=e.results[0][0].transcript};
  webRec.onerror=function(e){stopWebMic();stopListenUI();webRec=null;vError(e.error==='network'?'net':(e.error==='not-allowed'?'perm':'nomatch'))};
  webRec.onend=function(){stopWebMic();if(!listening)return;stopListenUI();webRec=null;if(got)send(got,{voice:true});else vError('nomatch')};
  try{webRec.start()}catch(e){stopListenUI();return}
  try{navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
    wStream=s;wAC=new (window.AudioContext||window.webkitAudioContext)();var an=wAC.createAnalyser();an.fftSize=512;wAC.createMediaStreamSource(s).connect(an);var buf=new Uint8Array(an.fftSize);
    (function loop(){an.getByteTimeDomainData(buf);var m=0;for(var i=0;i<buf.length;i++){var x=(buf[i]-128)/128;m+=x*x}m=Math.sqrt(m/buf.length);setVol(vol+((1+Math.min(1,m*5)*0.38)-vol)*0.45);wRaf=requestAnimationFrame(loop)})();
  }).catch(function(){})}catch(e){}
}
function vError(k){
  st('');
  if(k==='net'){noNet();return}
  if(k==='perm'){toast('اسمح للتطبيق باستخدام الميكروفون من إعدادات الجهاز');return}
  st('لم أسمعك جيدًا، اضغط على الميكروفون وحاول مرة أخرى');
}
window.__vEv=function(ev,d){
  if(ev==='ready'){st('أسمعك… تحدّث الآن')}
  else if(ev==='rms'){var l=Math.max(0,Math.min(1,(parseFloat(d)+2)/11));setVol(vol+((1+l*0.4)-vol)*0.5)}
  else if(ev==='end'){st('أفهم كلامك…')}
  else if(ev==='result'){stopListenUI();d=String(d||'').trim();if(d)send(d,{voice:true});else vError('nomatch')}
  else if(ev==='error'){stopListenUI();var c=parseInt(d,10);vError(c===1||c===2||c===4?'net':(c===9?'perm':'nomatch'))}
  else if(ev==='perm'){if(d==='1'){}else{stopListenUI();st('');toast('لازم تسمح للتطبيق باستخدام الميكروفون')}}
  else if(ev==='speakStart'){speakUI(true)}
  else if(ev==='speakDone'){speakUI(false)}
  else if(ev==='speakError'){speakUI(false);if(d==='nolang'){toast('لا يوجد صوت عربي على جهازك: ثبّته من إعدادات تحويل النص إلى كلام');var b=$('#skTtsSet');if(b)b.hidden=false}}
  else if(ev==='voices'){try{VOICES=JSON.parse(d)}catch(e){}if(!$('#skPgS').hidden)paintVoices();if(vpkState.open){var vo=document.querySelector('.vpk');if(vo)paintVpkList(vo)}}
};
/* إعدادات الشيخ */
function paintVoices(){
  var sel=$('#skVoice');
  if(NV){try{VOICES=JSON.parse(window.AndroidVoice.voices()||'[]')}catch(e){}}
  else if(window.speechSynthesis){VOICES=speechSynthesis.getVoices().filter(function(v){return /^ar/i.test(v.lang)}).map(function(v){return {name:v.name,label:v.name,net:!v.localService}})}
  var cur0=String(vget('Voice',''));
  var h='<option value="">تلقائي (الأفضل المتاح)</option>';
  VOICES.forEach(function(v,i){h+='<option value="'+hesc(v.name)+'"'+(v.name===cur0?' selected':'')+'>'+hesc(v.label||('صوت '+AR(i+1)))+(v.net?' (يحتاج إنترنت)':'')+'</option>'});
  sel.innerHTML=h;
  $('#skPitch').value=vget('Pitch',90);$('#skRate').value=vget('Rate',95);$('#skAuto').checked=!!vget('Auto',false);
  $('#skTtsSet').hidden=!(NV&&!VOICES.length);
}
$('#skVoice').onchange=function(){store.set('skVoice',this.value)};
$('#skPitch').oninput=function(){store.set('skPitch',parseInt(this.value,10))};
$('#skRate').oninput=function(){store.set('skRate',parseInt(this.value,10))};
$('#skAuto').onchange=function(){store.set('skAuto',this.checked)};
$('#skTest').onclick=function(){speakText('السلام عليكم ورحمة الله وبركاته. أنا الشيخ، اسألني عن أي مسألة دينية.')};
$('#skTtsSet').onclick=function(){try{window.AndroidVoice.openTtsSettings()}catch(e){}};
if(window.speechSynthesis&&!NV)try{speechSynthesis.onvoiceschanged=function(){if(!$('#skPgS').hidden)paintVoices()}}catch(e){}

var SRC={islamweb:'إسلام ويب',islamqa:'إسلام سؤال وجواب',islamstory:'قصة الإسلام'},lastE=null;
function fmt(a){return String(a).split(/\n+/).map(function(p){return '<p>'+hesc(p)+'</p>'}).join('')}
function answer(q){
  try{q=correct(q)}catch(e){}
  var t=nrm(q);
  if(/(مصدر|منين|من فين|من اين|من اي موقع|من اي كتاب)/.test(t)&&t.split(' ').length<=6){
    if(lastE&&lastE.s==='quran')aiSay('هذا من المصحف في التطبيق (الميسر في غريب القرآن والتفسير الميسر).',function(){busy=false});
    else if(lastE&&lastE.s==='app')aiSay('هذه المعلومة من محتوى تطبيق أنس مسلم.',function(){busy=false});
    else if(lastE&&lastE.s==='ilm')aiSay('هذه المعلومة من الموسوعة الدينية داخل التطبيق، وهي ملخّصة مما استقر عليه جمهور أهل العلم والمصادر الموثوقة.',function(){busy=false});
    else if(lastE&&lastE.s==='sira')aiSay('هذه المعلومة من كتاب «الرحيق المختوم» لصفي الرحمن المباركفوري.',function(){busy=false});
    else if(lastE)aiSay('الإجابة السابقة مأخوذة من <a href="'+hesc(lastE.u)+'" target="_blank" rel="noopener" style="color:var(--brand);font-weight:800">'+SRC[lastE.s]+'</a>'+(lastE.t?' — '+hesc(lastE.t):'')+'.',function(){busy=false});
    else aiSay('أجاوب من موقعي إسلام ويب وإسلام سؤال وجواب.',function(){busy=false});
    return;
  }
  if(t.split(' ').length<=6&&/(^| )(الرسول|النبي|محمد)( |$)/.test(t)&&/(^| )(من هو|مين|عرفني|تعريف|نبذه|سيره|نسب|نسبه)( |$)/.test(t)&&!/(غزو|معرك|هجر|وفا|مات|ولد|اخلاق|زوج)/.test(t)){
    if(srLoad()){lastE={s:'sira'};aiSay(srShow(19,0),function(){busy=false;showChips()},500);return}
  }
  var qa2=quranAnswer(q);
  if(qa2){lastE={s:'quran'};aiSay(qa2,function(){busy=false;showChips()},500);return}
  var ta=timesAnswer(q);
  if(ta){lastE={s:'app'};aiSay('<span class="qt">'+hesc(ta.title)+'</span>'+fmt(ta.body),function(){busy=false;showChips()},500);return}
  if(KBGATE.test(t)){var kb2=kbSearch(q);if(kb2&&kb2.cov>=0.99){lastE={s:'app'};aiSay(kbShow(kb2.e),function(){busy=false;showChips()},500);return}}
  var il=ilmSearch(q);
  if(il&&il.cov>=0.75&&(il.tb>=0.5||il.s>=1.0)){lastE={s:'ilm'};aiSay(ilmShow(il.e),function(){busy=false;showChips()},500);return}
  var isl=islamSearch(q);
  if(isl&&isl.cov>=0.75&&(isl.tb>=0.5||isl.s>=1.0)){lastE={s:'islamstory',u:isl.e.u,t:isl.e.au};aiSay(islamShow(isl.e),function(){busy=false;showChips()},500);return}
  var r=search(q);
  if(r){
    var e=r.d.e;lastE=e;
    aiSay('<span class="qt">'+hesc(e.q)+'</span>'+fmt(e.a)+'<small class="disc">للمسائل الخاصة أو المعقّدة راجع أهل العلم.</small>',function(){busy=false;showChips()});
    return;
  }
  if(/^(السلام عليكم|سلام عليكم|سلام|مرحبا|اهلا|هلا|صباح الخير|مساء الخير)/.test(t)&&t.split(' ').length<=4){
    aiSay('وعليكم السلام ورحمة الله وبركاته'+nm()+'. اتفضّل اسأل.',function(){busy=false});return;
  }
  if(/(شكرا|جزاك الله|جزاك|بارك الله)/.test(t)&&t.split(' ').length<=5){
    aiSay('العفو'+nm()+'، وجزاك الله خيرًا.',function(){busy=false});return;
  }
  if(KBGATE.test(t)){var kb3=kbSearch(q);if(kb3){lastE={s:'app'};aiSay(kbShow(kb3.e),function(){busy=false;showChips()},500);return}}
  srAnswer(q,function(done){if(done)return;
    if(il&&il.cov>=0.6){lastE={s:'ilm'};aiSay(ilmShow(il.e),function(){busy=false;showChips()},400);return}
    if(isl&&isl.cov>=0.6){lastE={s:'islamstory',u:isl.e.u,t:isl.e.au};aiSay(islamShow(isl.e),function(){busy=false;showChips()},400);return}
    var sg=ilmSearch(q,3)||[],h='ليس لدي إجابة لهذا السؤال بعد.';
    if(sg.length&&sg[0].cov>=0.34)h+='<p>هل تقصد أحد هذه الأسئلة؟</p><div class="achips" style="flex-wrap:wrap">'+sg.map(function(x){return '<button type="button" class="sug" data-q="'+hesc(x.e.t)+'">'+hesc(x.e.t)+'</button>'}).join('')+'</div>';
    aiSay(h,function(){busy=false;showChips()});
  });
}
function send(text,o){
  text=String(text||'').trim();if(!text||busy)return;o=o||{};
  $('#askIn').value='';hideChips();stopSpeak();drwClose();
  log.innerHTML='';setQ(text,!!o.voice);root.classList.remove('idle');root.classList.add('has');
  cur={q:text,voice:!!o.voice,said:0};busy=true;st('');answer(text);
}
$('#askForm').addEventListener('submit',function(e){e.preventDefault();send($('#askIn').value)});




/* ---------- الموسوعة الدينية + تصحيح الأخطاء الإملائية ---------- */
var ILM=null,VOC=null,VOCS=null;
var ILW={};'قصه حكايه سيره نبذه معلومات معلومه عن احكي احكيلي اخبرني قول قولي اشرح اشرحلي وضح وضحلي هو هي هم تعريف سيدنا سيد الله عليه السلام رضي عنه عنها صحابي صحابيه الصحابه امير المؤمنين اريد اعرف عايز عاوز لو سمحت يا شيخ كل ايه كام ماذا ما من'.split(' ').forEach(function(w){toks(w).forEach(function(t){ILW[t]=1})});
function ed(a,b,mx){
  var la=a.length,lb=b.length;if(Math.abs(la-lb)>mx)return mx+1;
  var d=[],i,j;for(i=0;i<=la;i++)d[i]=[i];for(j=1;j<=lb;j++)d[0][j]=j;
  for(i=1;i<=la;i++){
    var mn=99;
    for(j=1;j<=lb;j++){
      var c=a.charCodeAt(i-1)===b.charCodeAt(j-1)?0:1;
      var v=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
      if(i>1&&j>1&&c&&a.charCodeAt(i-1)===b.charCodeAt(j-2)&&a.charCodeAt(i-2)===b.charCodeAt(j-1))v=Math.min(v,d[i-2][j-2]+1);
      d[i][j]=v;if(v<mn)mn=v;
    }
    if(mn>mx)return mx+1;
  }
  return d[la][lb];
}
function ftm(a,b){
  if(a===b)return 1;
  if(tm(a,b))return 0.93;
  var m=Math.min(a.length,b.length);
  if(m>=4){var mx=m>=8?2:1;if(a.charAt(0)===b.charAt(0)||m>=6){if(ed(a,b,mx)<=mx)return 0.85}}
  return 0;
}
function ilmLoad(){
  if(ILM)return ILM;
  var o=jdata('ilm-data')||[];
  ILM=o.map(function(r,i){
    var al=[r[0]].concat(r.slice(3)).map(function(x){return Array.from(new Set(toks(x)))});
    return {i:i,t:r[0],k:r[1]||'',b:r[2],al:al,ks:Array.from(new Set(toks(r[0]+' '+(r[1]||''))))};
  });
  return ILM;
}
function ilmScore(qt,W,e){
  var best=0,hits=0;
  var sets=[e.ks].concat(e.al);
  // تغطية الكلمات المفتاحية
  var cov=0,tw=0,hardHit=false;
  qt.forEach(function(t){
    var m=0;for(var i=0;i<e.ks.length;i++){var s=ftm(t,e.ks[i]);if(s>m){m=s;if(m===1)break}}
    cov+=W[t]*m;tw+=W[t];if(m>=0.85&&!ILW[t])hardHit=true;
  });
  var sc=tw?cov/tw:0;
  // تطابق العنوان / الصيغ البديلة
  var tb=0;
  e.al.forEach(function(a){
    if(!a.length)return;
    var qh=0,qw=0;qt.forEach(function(t){var m=0;for(var i=0;i<a.length;i++){var s=ftm(t,a[i]);if(s>m)m=s}qh+=W[t]*m;qw+=W[t]});
    var ah=0;a.forEach(function(x){var m=0;for(var i=0;i<qt.length;i++){var s=ftm(qt[i],x);if(s>m)m=s}ah+=m});
    var r=(qw?qh/qw:0)*(a.length?ah/a.length:0);
    if(r>tb)tb=r;
  });
  return {s:sc+0.35*tb,cov:sc,tb:tb,hard:hardHit};
}
function ilmSearch(q,topn){
  var E=ilmLoad();if(!E.length)return null;
  var qt=Array.from(new Set(toks(q)));if(!qt.length)return null;
  var nonCue=qt.filter(function(t){return!ILW[t]});if(!nonCue.length)return null;
  var df={};qt.forEach(function(t){var n=0;for(var i=0;i<E.length;i++){var e=E[i];for(var j=0;j<e.ks.length;j++){if(ftm(t,e.ks[j])>=0.85){n++;break}}}df[t]=n});
  var W={};qt.forEach(function(t){W[t]=(ILW[t]?0.25:1)*(df[t]?Math.log((E.length+1)/(df[t]+0.5))+0.4:0.9)});
  var res=[];
  E.forEach(function(e){var r=ilmScore(qt,W,e);if(r.hard&&r.cov>=0.3)res.push({e:e,s:r.s,cov:r.cov,tb:r.tb})});
  res.sort(function(a,b){return b.s-a.s});
  if(topn)return res.slice(0,topn);
  return res[0]||null;
}
var ILMSHOW=700;
function ilmShow(e,from){
  var ps=String(e.b).split('\n'),h=from?'':'<span class="qt">'+hesc(e.t)+'</span>',n=0,i=from||0;
  for(;i<ps.length;i++){h+='<p>'+hesc(ps[i])+'</p>';n+=ps[i].length;if(n>=ILMSHOW&&i<ps.length-1){i++;break}}
  if(i<ps.length)h+='<div class="abtns"><button type="button" class="ilmmore" data-e="'+e.i+'" data-p="'+i+'">تابع القراءة</button></div>';
  return h;
}
$('#askLog').addEventListener('click',function(ev){
  var b=ev.target.closest('.ilmmore');if(!b)return;
  var e=ILM[parseInt(b.getAttribute('data-e'),10)],p=parseInt(b.getAttribute('data-p'),10);
  b.parentNode.parentNode.removeChild(b.parentNode);aiSay(ilmShow(e,p),function(){},250);
});
$('#askLog').addEventListener('click',function(ev){
  var b=ev.target.closest('.sug');if(!b)return;send(b.getAttribute('data-q'));
});
/* ---------- محتوى موقع قصة الإسلام (islamstory.com) ---------- */
var ISL=null;
function islLoad(){
  if(ISL)return ISL;
  var o=jdata('isl-data')||[];
  ISL=o.map(function(r,i){
    var al=[Array.from(new Set(toks(r.t)))];
    return {i:i,t:r.t,k:r.k||'',b:r.b,u:r.u||'',au:r.au||'',al:al,ks:Array.from(new Set(toks(r.t+' '+(r.k||''))))};
  });
  return ISL;
}
function islamSearch(q,topn){
  var E=islLoad();if(!E.length)return null;
  var qt=Array.from(new Set(toks(q)));if(!qt.length)return null;
  var nonCue=qt.filter(function(t){return!ILW[t]});if(!nonCue.length)return null;
  var df={};qt.forEach(function(t){var n=0;for(var i=0;i<E.length;i++){var e=E[i];for(var j=0;j<e.ks.length;j++){if(ftm(t,e.ks[j])>=0.85){n++;break}}}df[t]=n});
  var W={};qt.forEach(function(t){W[t]=(ILW[t]?0.25:1)*(df[t]?Math.log((E.length+1)/(df[t]+0.5))+0.4:0.9)});
  var res=[];
  E.forEach(function(e){var r=ilmScore(qt,W,e);if(r.hard&&r.cov>=0.3)res.push({e:e,s:r.s,cov:r.cov,tb:r.tb})});
  res.sort(function(a,b){return b.s-a.s});
  if(topn)return res.slice(0,topn);
  return res[0]||null;
}
var ISLSHOW=700;
function islamShow(e,from){
  var ps=String(e.b).split('\n'),h=from?'':'<span class="qt">'+hesc(e.t)+'</span>',n=0,i=from||0;
  for(;i<ps.length;i++){h+='<p>'+hesc(ps[i])+'</p>';n+=ps[i].length;if(n>=ISLSHOW&&i<ps.length-1){i++;break}}
  if(i<ps.length){h+='<div class="abtns"><button type="button" class="islmore" data-e="'+e.i+'" data-p="'+i+'">تابع القراءة</button></div>'}
  else{h+='<div class="src">المصدر: <a href="'+hesc(e.u)+'" target="_blank" rel="noopener">قصة الإسلام</a>'+(e.au?' — '+hesc(e.au):'')+'</div>'}
  return h;
}
$('#askLog').addEventListener('click',function(ev){
  var b=ev.target.closest('.islmore');if(!b)return;
  var e=ISL[parseInt(b.getAttribute('data-e'),10)],p=parseInt(b.getAttribute('data-p'),10);
  b.parentNode.parentNode.removeChild(b.parentNode);aiSay(islamShow(e,p),function(){},250);
});
/* تصحيح الأخطاء الإملائية: أقرب كلمة معروفة في التطبيق */
function vocBuild(){
  if(VOC)return;
  VOC={};VOCS={};
  function add(s){String(s).split(' ').forEach(function(w){if(w.length>=3){VOC[w]=(VOC[w]||0)+1;VOCS[stem(w)]=1}})}
  initQA();QA.forEach(function(e){add(nrm(e.q+' '+(e.k||'')+' '+(e.alt||[]).join(' ')+' '+(e.a||'')))});
  ilmLoad().forEach(function(e){add(nrm(e.t+' '+e.k+' '+e.b))});
  try{srLoad();SR.forEach(function(r){add(nrm(r.h))})}catch(x){}
  try{qvBuild().forEach(function(v){})}catch(x){}
  try{Q.s.forEach(function(s){add(nrm(s.name));s.v.forEach(function(v){add(nrm(String(v).replace(/[۞۩]/g,'')))})})}catch(x){}
  try{if(KB)KB.forEach(function(e){add(nrm(e.title+' '+(e.tk||[]).join(' ')))})}catch(x){}
  VOCL={};Object.keys(VOC).forEach(function(w){(VOCL[w.length]=VOCL[w.length]||[]).push(w)});
}
var VOCL=null;
function correct(q){
  vocBuild();
  var out=nrm(q).split(' ').map(function(t){
    if(t.length<4||/[0-9]/.test(t)||VOC[t]||VOCS[stem(t)]||STOP[t]||SYN[t]!==undefined)return t;
    var base=t.replace(/^(وال|فال|بال|كال|لل|ال|و|ف|ب|ل|ك)(?=.{3})/,'');
    if(base!==t&&(VOC[base]||VOCS[stem(base)]))return t;
    var mx=t.length>=8?2:1,best=null,bd=mx+1,bf=0;
    for(var L=t.length-mx;L<=t.length+mx;L++){var arr=VOCL[L];if(!arr)continue;
      for(var i=0;i<arr.length;i++){var w=arr[i],d=ed(t,w,Math.min(bd,mx));
        if(d<bd||(d===bd&&d<=mx&&VOC[w]>bf)){bd=d;best=w;bf=VOC[w]}}}
    return best&&bd<=mx?best:t;
  });
  return out.join(' ');
}

window.__ilm=function(q,n){q=correct(q);return ilmSearch(q,n)};window.__correct=correct;
/* ---------- معرفة التطبيق: الأذكار والأدعية والعبادات ومواقيت الصلاة + معاني المصحف ---------- */
var KB=null;
function kbBuild(){
  if(KB)return KB;KB=[];
  var D=window.__appData||{},WUDU=D.WUDU,SALAH=D.SALAH,RAK=D.RAK,RK=D.RK,SUNAN=D.SUNAN,HADITH=D.HADITH,NAMES=D.NAMES,HM=D.HM,RTIPS=D.RTIPS,RDUA_IFTAR=D.RDUA_IFTAR;
  function add(title,keys,body,more){var e={title:title,body:body,tk:toks(title+' '+keys),more:more||null,date:false};KB.push(e);return e}
  function cnt(c){return c&&c>1?' ('+AR(c)+' مرة)':''}
  function strip(t){return String(t)}
  /* الأذكار */
  var AK={morning:'صباح الصباح اصبح صباحا',evening:'مساء المساء امسي مساءا',sleep:'نوم النوم نام استيقاظ اصحي صحيت',home:'بيت منزل دخول خروج',afterprayer:'بعدا بعد الصلاه سلمت ختام الصلاه',duas:'دعاء ادعيه دعوه',tasbih:'تسبيح تحميد تكبير'};
  try{AZ_ORDER.forEach(function(id){
    var a=AZ[id],items=a.items(),lines=items.map(function(it){return (it.h?it.h+': ':'')+strip(it.t)+cnt(it.c)});
    add(a.name,'اذكار ذكر '+(AK[id]||''),lines.slice(0,3).join('\n\n'),lines.length>3?lines.slice(3):null);
    var X={'عند الوضوء (قبله)':'قبلا قبل الوضوء','بعد الوضوء':'بعدا بعد الوضوء خلصت','قبل الطعام':'قبلا اكل الاكل ابدا','بعد الطعام':'بعدا اكل الاكل خلصت شبعت','دخول الخلاء':'حمام دخول الحمام الخلاء المرحاض','الخروج من الخلاء':'خروج الحمام طلعت','عند الركوب':'ركوب سفر عربيه سيارة مواصلات','دعاء الكرب':'ضيق هم حزن كرب قلق','سيد الاستغفار':'استغفار استغفر','دخول المسجد':'مسجد جامع ادخل','الخروج من المسجد':'مسجد جامع اخرج','دعاء دخول المنزل':'بيت منزل ادخل البيت','دعاء الخروج من المنزل':'بيت منزل اطلع اخرج','آية الكرسي':'كرسي ايه الكرسي'};
    items.forEach(function(it){if(it.h)add(it.h,'دعاء ذكر '+(X[it.h]||''),it.h+': '+strip(it.t)+cnt(it.c))});
  })}catch(e){}
  /* الوضوء والصلاة */
  try{add('طريقة الوضوء','وضوء اتوضا توضا خطوات كيفية الوضوء ازاي اتوضا',WUDU.map(function(s,i){return AR(i+1)+'. '+s[2]+': '+s[3]}).join('\n'))}catch(e){}
  try{add('طريقة الصلاة','صلاه اصلي خطوات كيفية الصلاه ازاي اصلي',SALAH.map(function(s,i){return AR(i+1)+'. '+s[2]+': '+s[3]}).join('\n'))}catch(e){}
  try{add('عدد ركعات الصلوات','صلاه صلاة ركعات ركعه كام ركعه عدد ركعات الفجر الظهر العصر المغرب العشاء الجمعه',RAK.map(function(r){return r[0]+': '+r[1]+' ركعات'}).join('\n'));
      add('ركعات الصلاة بالتفصيل','ركعه اولي ثانيه ثالثه رابعه تفصيل',RK.map(function(r){return r[1]}).join('\n'));
      add('السنن الرواتب','سنن راتبه سنه قبل بعد الفجر الظهر المغرب العشاء وتر',SUNAN.join('\n'))}catch(e){}
  /* أحاديث */
  try{HADITH.forEach(function(h){add('حديث',h[0],h[0]+'\n— '+h[1])});add('الأحاديث النبوية','احاديث حديث احاديث نبويه حديث عن',HADITH.slice(0,3).map(function(h){return h[0]+' — '+h[1]}).join('\n\n'),HADITH.slice(3).map(function(h){return h[0]+' — '+h[1]}))}catch(e){}
  /* أسماء الله الحسنى */
  try{
    add('أسماء الله الحسنى','اسماء الله الحسني التسعه والتسعين ٩٩',NAMES.slice(0,12).map(function(n){return n.n+': '+n.m}).join('\n'),NAMES.slice(12).map(function(n){return n.n+': '+n.m}));
    NAMES.forEach(function(n){add('اسم الله '+n.n,'معني يعني ما معني اسم الله '+n.n,n.n+': '+n.m)});
  }catch(e){window.__kbErr=(window.__kbErr||'')+' names:'+e}
  /* مناسبات وشهور هجرية */
  try{add('الشهور الهجرية','شهور هجريه تقويم هجري اسماء الشهور',HM.map(function(m,i){return AR(i+1)+'. '+m}).join('\n'))}catch(e){}
  /* رمضان */
  try{add('دعاء الإفطار','دعاء افطار فطار صايم',RDUA_IFTAR);add('نصائح رمضان','رمضان نصايح صيام',RTIPS.join('\n'))}catch(e){window.__kbErr=(window.__kbErr||'')+' ram:'+e}
  /* زكاة وتعريف بالتطبيق */
  add('نصاب الزكاة','زكاه نصاب الذهب زكاه المال كام الزكاه','النصاب = ٨٥ جرام ذهب عيار ٢٤. الزكاة ٢٫٥٪ من الصافي لو بلغ النصاب ومرّ عليه سنة هجرية كاملة. وفي التطبيق حاسبة للزكاة في «المزيد».');
  var APP=[
   ['المواقيت وتغيير المدينة','مواقيت المدينة غير غيري بلد مكان طريقة الحساب','مواقيت الصلاة بتتحسب على جهازك من غير نت. غيّر المدينة وطريقة الحساب (مثل الهيئة المصرية) من الإعدادات ← المدينة والمواقيت.'],
   ['الأذان في التطبيق','اذان مؤذن صوت اختيار مؤذن شغل الاذان','الأذان بيشتغل في وقته حتى لو التطبيق مقفول. اختار المؤذن وصوت الأذان من الإعدادات ← الأذان.'],
   ['التنبيهات والإقامة','تنبيه اشعار اقامه ثلث ساعه خمس دقايق','بعد الأذان بيظهر «ناقص ثلث ساعة على الإقامة» (والوقت تقدر تغيّره)، وقبل الإقامة بخمس دقائق يجيلك تنبيه «الإقامة ناقص لها خمس دقائق».'],
   ['تنبيهات الأذكار','تنبيه اذكار الصباح المساء ثمانيه الساعه ٨','الساعة ٨ الصبح تنبيه «هل قلت أذكار الصباح؟» والساعة ٨ بالليل «هل قلت أذكار المساء؟». تقدر توقفها من الإعدادات ← التنبيهات.'],
   ['القبلة','قبله اتجاه بوصله','أداة القبلة في «المزيد»: بوصلة وزاوية القبلة من مدينتك.'],
   ['المسبحة','مسبحه عداد تسبيح','المسبحة في «المزيد»: عدّاد تسبيح بهدف تحدده.'],
   ['التقويم الهجري','تقويم هجري مناسبات ايام البيض','التقويم الهجري في «المزيد» فيه المناسبات والأيام البيض.'],
   ['متابعة الصلوات','متابعه صلوات سجل يومي','سجّل صلواتك كل يوم وتابع الأيام المتتالية من «متابعة الصلوات».'],
   ['ختمة القرآن','ختمه ختم القران ورد يومي','حدد مدة الختمة والتطبيق يحسب لك الورد اليومي.'],
   ['المصحف في التطبيق','مصحف قران قراءة سوره خلفيه استماع معني كلمه','في المصحف: اضغط على أي كلمة تظهر لك معناها والتفسير، وفيه زر لقراءة السورة كاملة بصوت قارئ، و٦ خلفيات للمصحف.'],
   ['عايز أصوم','صيام صوم اصوم النهارده بكره سحور فطار','في «المزيد» زر «عايز أصوم النهارده / بكرة» يجدول لك تنبيه السحور والفطار.'],
   ['اسأل أنس','اسال انس مساعد مين انت','أنا أنس، أجاوب من محتوى التطبيق ومن مصادر إسلامية موثوقة، وبدون إنترنت.'],
   ['التطبيق بدون إنترنت','نت انترنت اوفلاين يشتغل بيشتغل شغال يعمل بدون غير من التطبيق','التطبيق يعمل بدون إنترنت: المواقيت والأذان والمصحف والأذكار واسأل أنس. استماع التلاوات وخريطة أقرب مسجد يحتاجان إنترنت.']
  ];
  APP.forEach(function(a){add(a[0],a[1],a[2])});
  /* تواريخ السيرة (هجري / ميلادي / من كام سنة) */
  function hnow(){try{return window.__hij(new Date()).y}catch(e){return 1448}}
  function ago(h,ce){
    var hy=hnow(),gy=new Date().getFullYear(),n1=hy-h,n2=gy-ce;
    return 'يعني من حوالي '+AR(n1)+' سنة هجرية ('+AR(n2)+' سنة ميلادية).'
  }
  function hijLabel(h){return h<0?'قبل الهجرة بنحو '+AR(-h)+' سنة':'سنة '+AR(h)+' هـ'}
  var TL=[
   ['مولد النبي ﷺ','مولد ولد اتولد ولادة ميلاد النبي الرسول محمد المصطفي امتي متي تاريخ سنه',-53,571,'ولد ﷺ يوم الاثنين ٩ ربيع الأول، في عام الفيل، ويوافق ذلك ٢٠ أو ٢٢ أبريل سنة ٥٧١م كما حقّقه المنصورفوري في «الرحيق المختوم» (وبعض أهل العلم يرجّح سنة ٥٧٠م).'],
   ['بعثة النبي ﷺ','بعثه بعث نزول الوحي غار حراء اول وحي النبوه امتي متي تاريخ سنه',-13,610,'نزل عليه الوحي في غار حراء في رمضان وعمره ﷺ أربعون سنة.'],
   ['الهجرة النبوية','هجره الهجره النبويه المدينه امتي متي تاريخ سنه',1,622,'هاجر النبي ﷺ من مكة إلى المدينة، وبها يبدأ التقويم الهجري.'],
   ['غزوة بدر الكبرى','غزوه بدر امتي متي تاريخ سنه',2,624,'وقعت في ١٧ رمضان.'],
   ['غزوة أحد','غزوه احد امتي متي تاريخ سنه',3,625,'وقعت في شوال.'],
   ['غزوة الأحزاب (الخندق)','غزوه احزاب خندق امتي متي تاريخ سنه',5,627,'وقعت في شوال.'],
   ['صلح الحديبية','حديبيه صلح الحديبيه عمره امتي متي تاريخ سنه',6,628,'كان في ذي القعدة.'],
   ['غزوة خيبر','غزوه خيبر امتي متي تاريخ سنه',7,628,'كانت في أول سنة ٧هـ.'],
   ['غزوة مؤتة','غزوه معركه مؤته امتي متي تاريخ سنه',8,629,'كانت في جمادى الأولى.'],
   ['فتح مكة','فتح مكه غزوه امتي متي تاريخ سنه',8,630,'كان في رمضان (٢٠ رمضان).'],
   ['غزوة حنين','غزوه حنين امتي متي تاريخ سنه',8,630,'كانت في شوال بعد فتح مكة.'],
   ['غزوة تبوك','غزوه تبوك امتي متي تاريخ سنه',9,630,'كانت في رجب.'],
   ['حجة الوداع','حجه الوداع حجه امتي متي تاريخ سنه',10,632,'حجّ فيها النبي ﷺ حجته الوحيدة، وخطب خطبة الوداع في عرفة.'],
   ['وفاة النبي ﷺ','وفاه موت مات توفي انتقل النبي الرسول محمد امتي متي تاريخ سنه',11,632,'توفي ﷺ يوم الاثنين ١٢ ربيع الأول، وعمره نحو ثلاث وستين سنة.']
  ];
  TL.forEach(function(t){
    add(t[0],t[1],function(){return t[4]+'\nالتاريخ: '+hijLabel(t[2])+'، الموافق سنة '+AR(t[3])+'م.\n'+ago(t[2],t[3])}).date=true;
  });
  add('تواريخ أهم أحداث السيرة','تواريخ تاريخ احداث السيره سيره اهم الاحداث جدول زمني',function(){return TL.map(function(t){return t[0]+': '+hijLabel(t[2])+' — '+AR(t[3])+'م'}).join('\n')}).date=true;
  /* تواريخ ميلاد الأنبياء والصحابة — تقريبية مشهورة عند المؤرخين، وليست نصوصًا ثابتة */
  var DK='مولد ولد اتولد ولادة ميلاد امتي متي تاريخ سنه ';
  function bh(ce){return ce<0?Math.round((621-ce)*1.0307):Math.round((622-ce)*1.0307)}
  function when(ce){return ce<0?'نحو '+AR(-ce)+' ق.م':'نحو '+AR(ce)+'م'}
  function bornText(name,ce,note,h){
    var gy=new Date().getFullYear(),n=ce<0?gy-ce:gy-ce,hy=hnow(),b=h!=null?h:-bh(ce);
    var hl=b<0?'قبل الهجرة بنحو '+AR(-b)+' سنة':'سنة '+AR(b)+' هـ';
    var hAgo=hy-b;
    return (/(عائشة|خديجة|فاطمة)/.test(name)?'وُلدت ':'وُلد ')+name+' تقريبًا '+when(ce)+' ('+hl+').'+(note?'\n'+note+'.':'')+'\nيعني من حوالي '+AR(n)+' سنة ميلادية ('+AR(hAgo)+' سنة هجرية).\nتنبيه: هذا التاريخ تقريبي مشهور عند المؤرخين، وفيه خلاف، وليس نصًا ثابتًا من القرآن أو السنة.'
  }
  var PR=[
   ['آدم عليه السلام','ادم',null,'لا يوجد تقدير معتمد لتاريخ آدم عليه السلام. وقد ورد عن ابن عباس أن بينه وبين نوح عشرة قرون'],
   ['إدريس عليه السلام','ادريس',null,'لا يوجد تقدير معتمد، ويُذكر أنه بين آدم ونوح'],
   ['نوح عليه السلام','نوح',-3000,'وهذا على قول بعض المؤرخين ولا يصح الجزم به'],
   ['هود عليه السلام','هود',null,'لا يوجد تقدير معتمد؛ وهو بعد نوح وقبل إبراهيم'],
   ['صالح عليه السلام','صالح',null,'لا يوجد تقدير معتمد؛ وهو بعد هود وقبل إبراهيم'],
   ['إبراهيم عليه السلام','ابراهيم خليل الله',-2000,'وبعضهم يقول بين ٢١٦٠ و١٩٠٠ ق.م'],
   ['لوط عليه السلام','لوط',-2000,'وهو معاصر لإبراهيم عليه السلام'],
   ['إسماعيل عليه السلام','اسماعيل',-1900,''],
   ['إسحاق عليه السلام','اسحاق',-1900,''],
   ['يعقوب عليه السلام','يعقوب اسرائيل',-1800,''],
   ['يوسف عليه السلام','يوسف',-1700,''],
   ['أيوب عليه السلام','ايوب',null,'لا يوجد تقدير معتمد لتاريخه'],
   ['شعيب عليه السلام','شعيب',null,'لا يوجد تقدير معتمد؛ ويُذكر أنه قبل موسى'],
   ['موسى عليه السلام','موسي كليم الله',-1300,'والأرجح أنه في عهد رمسيس الثاني'],
   ['هارون عليه السلام','هارون',-1300,'وهو أخو موسى عليهما السلام'],
   ['داود عليه السلام','داود',-1040,''],
   ['سليمان عليه السلام','سليمان',-990,''],
   ['إلياس عليه السلام','الياس',-900,'نحو القرن التاسع قبل الميلاد'],
   ['اليسع عليه السلام','اليسع',-850,'نحو القرن التاسع قبل الميلاد'],
   ['ذو الكفل عليه السلام','ذو الكفل',null,'لا يوجد تقدير معتمد لتاريخه'],
   ['يونس عليه السلام','يونس ذو النون',-780,'نحو القرن الثامن قبل الميلاد'],
   ['زكريا عليه السلام','زكريا',-50,'وهو والد يحيى، وكان قبيل ميلاد عيسى عليه السلام'],
   ['يحيى عليه السلام','يحيي',-6,'وهو أكبر من عيسى عليه السلام بنحو ستة أشهر'],
   ['عيسى عليه السلام','عيسي المسيح ابن مريم',-5,'وأكثر المؤرخين على أنه بين ٦ و٤ ق.م. وفي صحيح البخاري عن سلمان الفارسي: «بين عيسى ومحمد ﷺ ستمائة سنة»']
  ];
  PR.forEach(function(p){
    var e=add('ميلاد '+p[0],DK+'نبي '+p[1]+' '+p[0],function(){return p[2]===null?(p[3]+'.'):bornText(p[0],p[2],p[3])});e.date=true;
  });
  var SH=[
   ['أبو بكر الصديق رضي الله عنه','ابو بكر الصديق ابوبكر',573,'بعد عام الفيل بنحو سنتين وأشهر'],
   ['عمر بن الخطاب رضي الله عنه','عمر الفاروق ابن الخطاب',583,'والأقوال بين ٥٨٣ و٥٨٤م'],
   ['عثمان بن عفان رضي الله عنه','عثمان ذو النورين ابن عفان',576,'بعد عام الفيل بنحو ست سنين'],
   ['علي بن أبي طالب رضي الله عنه','علي ابن ابي طالب',600,'قبل البعثة بنحو عشر سنين'],
   ['خالد بن الوليد رضي الله عنه','خالد سيف الله ابن الوليد',590,'والأقوال بين ٥٨٥ و٥٩٢م. وأسلم سنة ٧هـ كما في «الرحيق المختوم»'],
   ['بلال بن رباح رضي الله عنه','بلال المؤذن ابن رباح',580,'والأقوال فيه تقريبية جدًا'],
   ['عائشة أم المؤمنين رضي الله عنها','عائشه ام المومنين',614,'بعد البعثة بنحو أربع سنين'],
   ['خديجة بنت خويلد رضي الله عنها','خديجه ام المومنين ابنه خويلد',555,'قبل عام الفيل بنحو خمس عشرة سنة'],
   ['فاطمة الزهراء رضي الله عنها','فاطمه الزهراء ابنه النبي',605,'قبل البعثة بنحو خمس سنين'],
   ['حمزة بن عبد المطلب رضي الله عنه','حمزه اسد الله ابن عبد المطلب',568,'وهو أكبر من النبي ﷺ بسنتين أو أربع'],
   ['عبد الرحمن بن عوف رضي الله عنه','عبد الرحمن عبدالرحمن ابن عوف',580,''],
   ['سعد بن أبي وقاص رضي الله عنه','سعد ابن ابي وقاص',595,''],
   ['الزبير بن العوام رضي الله عنه','الزبير ابن العوام',594,''],
   ['طلحة بن عبيد الله رضي الله عنه','طلحه ابن عبيد الله',594,''],
   ['أبو عبيدة بن الجراح رضي الله عنه','ابو عبيده ابن الجراح امين الامه',583,''],
   ['أبو هريرة رضي الله عنه','ابو هريره',603,'والأقوال بين ٥٩٨ و٦٠٣م'],
   ['عبد الله بن عباس رضي الله عنهما','ابن عباس عبد الله حبر الامه',619,'قبل الهجرة بثلاث سنين'],
   ['عبد الله بن عمر رضي الله عنهما','ابن عمر عبد الله',612,''],
   ['أنس بن مالك رضي الله عنه','انس ابن مالك خادم النبي',612,'قبل الهجرة بنحو عشر سنين'],
   ['معاذ بن جبل رضي الله عنه','معاذ ابن جبل',605,''],
   ['عمار بن ياسر رضي الله عنه','عمار ابن ياسر',570,''],
   ['عمرو بن العاص رضي الله عنه','عمرو ابن العاص',573,''],
   ['أسامة بن زيد رضي الله عنهما','اسامه ابن زيد',612,''],
   ['حسان بن ثابت رضي الله عنه','حسان ابن ثابت شاعر النبي',563,'قبل الهجرة بنحو ستين سنة'],
   ['الحسن بن علي رضي الله عنهما','الحسن ابن علي سبط النبي',625,'في رمضان سنة ٣هـ',3],
   ['الحسين بن علي رضي الله عنهما','الحسين ابن علي سبط النبي',626,'في شعبان سنة ٤هـ',4],
   ['عبد الله بن الزبير رضي الله عنهما','عبد الله ابن الزبير',623,'وهو أول مولود للمسلمين في المدينة بعد الهجرة (السنة الأولى، وقيل الثانية)',1]
  ];
  SH.forEach(function(p){
    var e=add('ميلاد '+p[0],DK+'صحابي صحابه '+p[1]+' '+p[0],function(){return bornText(p[0],p[2],p[3],p[4])});e.date=true;
  });
  var lineP=function(p){return p[2]===null?p[0]+': لا يوجد تقدير معتمد':p[0]+': '+when(p[2])};
  add('تواريخ ميلاد الأنبياء','انبياء الانبياء كل الانبياء '+DK,PR.slice(0,10).map(lineP).join('\n'),PR.slice(10).map(lineP)).date=true;
  add('تواريخ ميلاد الصحابة','صحابه الصحابه كل الصحابه '+DK,SH.slice(0,10).map(function(p){return p[0]+': '+when(p[2])}).join('\n'),SH.slice(10).map(function(p){return p[0]+': '+when(p[2])})).date=true;
  return KB;
}
var KBGATE=/(^| )(ولد|اتولد|مولد|ميلاد|تاريخ|امتي|متي|بدر|احد|خندق|احزاب|حديبيه|خيبر|مؤته|تبوك|حنين|بعثه|هجره|وفاه|مات|توفي|اذكار|ذكر|دعاء|ادعيه|دعوه|وضوء|اتوضا|توضا|صلاه|اصلي|ركعه|ركعات|سنن|سنه|حديث|احاديث|اسماء الله|اسم الله|الحسني|رمضان|افطار|فطار|زكاه|نصاب|هجري|هجريه|شهور|مواقيت|اذان|الاذان|مؤذن|اقامه|قبله|مسبحه|ختمه|اصوم|صيام|سحور|تنبيه|اشعار|انس مسلم|التطبيق|بدون نت|انترنت|مصحف|خلفيه|الفجر|الظهر|العصر|المغرب|العشاء|دخول|خروج|قبل الاكل|بعد الاكل|الكرب|الاستغفار|الكرسي)( |$)/;
var KBCUE={};'كانت كان حصلت حصل حدثت سنه سنة معني معنى يعني معناه كام عدد ايه ما ماذا اقول اقرا اذكر قول عايز عاوز اعرف معلومات عن لو سمحت يا ازاي كيف طريقه افضل'.split(' ').forEach(function(w){toks(w).forEach(function(t){KBCUE[t]=1})});
function kbSearch(q){
  q=q.replace(/(^| )قبل( |$)/g,'$1قبلا$2').replace(/(^| )بعد( |$)/g,'$1بعدا$2');
  var all=Array.from(new Set(toks(q)));
  var qt=all.filter(function(t){return!KBCUE[t]}),cues=all.filter(function(t){return KBCUE[t]});
  if(!qt.length)return null;
  kbBuild();
  var df={};qt.forEach(function(t){var n=0;KB.forEach(function(e){if(srIn(e.tk,t))n++});df[t]=n});
  var W={},tot=0;qt.forEach(function(t){W[t]=df[t]?Math.log(KB.length/(df[t]+0.5))+1:1.2;tot+=W[t]});
  var best=null,dateQ=/(امتي|متي|تاريخ|سنه|ولد|اتولد|مولد|ميلاد|مات|توفي|وفاه|كام سنه)/.test(nrm(q));
  KB.forEach(function(e){
    if(e.date&&!dateQ)return;
    var s=0;qt.forEach(function(t){if(srIn(e.tk,t))s+=W[t]});
    var cov=s/tot;
    if(cov>0){
      var cb=0;cues.forEach(function(t){if(srIn(e.tk,t))cb++});
      var sc=cov*10+cb*0.8-Math.log(e.tk.length+1)*0.25;
      if(!best||sc>best.sc)best={e:e,sc:sc,cov:cov}
    }
  });
  return best&&best.cov>=0.99?best:(best&&best.cov>=0.75&&qt.length>=3?best:null);
}
function kbShow(e){
  var h='<span class="qt">'+hesc(e.title)+'</span>'+fmt(typeof e.body==='function'?e.body():e.body);
  if(e.more&&e.more.length)h+='<button type="button" class="kbmore" data-k="'+KB.indexOf(e)+'" data-o="0">كمّل</button>';
  return h;
}
$('#askLog').addEventListener('click',function(ev){
  var b=ev.target.closest('.kbmore');if(!b)return;
  var e=KB[parseInt(b.getAttribute('data-k'),10)],o=parseInt(b.getAttribute('data-o'),10);b.parentNode.removeChild(b);
  var part=e.more.slice(o,o+4),h=fmt(part.join('\n\n'));
  if(o+4<e.more.length)h+='<button type="button" class="kbmore" data-k="'+KB.indexOf(e)+'" data-o="'+(o+4)+'">كمّل</button>';
  aiSay(h,function(){},300);
});
/* مواقيت الصلاة اليوم */
function timesAnswer(q){
  var t=nrm(q);
  if(!/(مواقيت|موعد|ميعاد|امتي|اذان|وقت)/.test(t))return null;
  var which=null;[['fajr','الفجر'],['sunrise','الشروق'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']].forEach(function(p){if(t.indexOf(nrm(p[1]))>-1)which=p});
  if(!which&&!/(مواقيت|الصلاه|الصلوات|الاذان)/.test(t))return null;
  try{
    var c=timesFor(0),T=c.t;
    function line(p){return p[1]+': '+fmtTime(T[p[0]],c.tz)}
    var arr=[['fajr','الفجر'],['sunrise','الشروق'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
    var body=which?('موعد '+which[1]+' اليوم في '+c.city[1]+': '+fmtTime(T[which[0]],c.tz)):arr.map(line).join('\n');
    return {title:'مواقيت الصلاة اليوم — '+c.city[1],body:body};
  }catch(e){return null}
}
/* معاني المصحف */
function wk(x){return nrm(String(x).replace(/[\u200b-\u200f\u2060\u202a-\u202e۞۩ۖ-ۭ]/g,'').replace(/\s+(?=[\u064b-\u0670])/g,'').replace(/\u0670/g,'ا')).replace(/ا/g,'')}
function qNameOf(n){return Q.s[n-1].name}
var QV=null;
function qvBuild(){if(QV)return QV;QV=[];Q.s.forEach(function(s,si){s.v.forEach(function(v,ai){QV.push({s:si+1,a:ai+1,n:wk(v)})})});return QV}
function tfOf(s,a){initGH();var t=TF&&TF[s+':'+a];return t?String(t):''}
function ayahCard(s,a,withNext){
  var S=Q.s[s-1],v=S.v[a-1];if(!v)return null;
  var tf=tfOf(s,a),items=(GH&&GH[s+':'+a])||[];
  var h='<span class="qt">سورة '+hesc(S.name)+' — الآية '+AR(a)+'</span><p class="qaya">﴿'+hesc(String(v).replace(/[۞۩]/g,''))+'﴾</p>';
  if(items.length)h+='<p><b>معاني الكلمات:</b> '+items.slice(0,8).map(function(it){return hesc(String(it[0]).replace(/[۞۩]/g,''))+': '+hesc(it[1])}).join(' — ')+'</p>';
  if(tf)h+='<p><b>التفسير:</b> '+hesc(tf.length>900?tf.slice(0,tf.indexOf(' ',880))+'…':tf)+'</p>';
  if(!items.length&&!tf)h+='<p>معاني الكلمات والتفسير متاحة داخل المصحف في التطبيق (اضغط على أي كلمة).</p>';
  if(a<S.v.length)h+='<button type="button" class="qnext" data-s="'+s+'" data-a="'+(a+1)+'">الآية التالية</button>';
  return h;
}
$('#askLog').addEventListener('click',function(ev){
  var b=ev.target.closest('.qnext');if(!b)return;
  var s=parseInt(b.getAttribute('data-s'),10),a=parseInt(b.getAttribute('data-a'),10);b.parentNode.removeChild(b);
  aiSay(ayahCard(s,a),function(){},300);
});
var QCUE='معني معنى يعني ايه ما هو هي كلمه كلمة في القران القرآن المصحف تفسير تفسيرها اشرح شرح اية آية ايه سوره سورة الايه الآية من لو سمحت عايز عاوز اعرف'.split(' ');
function suraFind(t){
  var best=null;
  Q.s.forEach(function(s){
    var nn=nrm(s.name),bare=nn.replace(/^ال/,'');
    if(!bare||bare.length<3)return;
    var re=new RegExp('(^| )(ال)?'+bare.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'( |$)');
    if(re.test(t)&&(!best||bare.length>best.l))best={n:s.n,l:bare.length};
  });
  return best&&best.n;
}
function quranAnswer(q){
  var t=nrm(q);
  if(!/(معني|يعني|تفسير|اشرح|شرح|كلمه|ايه|اية|سوره|قران|مصحف)/.test(t))return null;
  initGH();
  /* آية الكرسي وما شابه */
  if(/ايه الكرسي|اية الكرسي|آيه الكرسي/.test(t))return ayahCard(2,255);
  var an=t.match(/(?:ايه|اية|الايه|الاية)\s*(?:رقم\s*)?([0-9٠-٩]+)/),aya=an?parseInt(String(an[1]).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}),10):0;
  var sn=suraFind(t);
  /* معنى كلمة */
  var raw=t.split(' ').filter(function(w){return w&&QCUE.indexOf(w)===-1&&!STOP[w]});
  var w=raw.length&&raw.length<=2?raw.join(' '):'';
  var wordQ=/(كلمه|مفردات|غريب)/.test(t)||(/(معني|يعني)/.test(t)&&!sn);
  if(w&&wordQ){
    var hits=[],seen={},key=wk(w),pkey=ps(wn(w)).replace(/ا/g,'');
    for(var k in GH){
      GH[k].forEach(function(it){
        var parts=String(it[0]).split(/\s+(?=[^\u064b-\u0670\u2060])/).filter(Boolean),kk=wk(it[0]);
        var ok=kk===key||kk.replace(/^(ول|فل|بل|كل|لل|ل)/,'')===key||(key.indexOf(' ')<0&&kk.split(' ').some(function(x){return x===key||x.replace(/^(ول|فل|بل|كل|لل)/,'')===key||('ل'+x)===key||x===('ل'+key)}));
        if(ok){var m=String(it[1]);if(!seen[m]){seen[m]=1;var p=k.split(':');hits.push({s:+p[0],a:+p[1],w:it[0],m:m})}}
      });
      if(hits.length>=3)break;
    }
    if(hits.length)return '<span class="qt">معنى «'+hesc(w)+'» في القرآن</span>'+hits.map(function(x){return '<p><b>'+hesc(String(x.w).replace(/[۞۩\u2060]/g,'').replace(/\s+(?=[\u064b-\u0670])/g,''))+'</b> — '+hesc(x.m)+' <small>(سورة '+hesc(qNameOf(x.s))+' آية '+AR(x.a)+')</small></p>'}).join('');
  }
  /* سورة / آية */
  if(sn&&(/(تفسير|معني|اشرح|شرح|ايه|اية|يعني)/.test(t))){
    var S2=Q.s[sn-1];if(aya&&aya<=S2.v.length)return ayahCard(sn,aya);
    if(/(سوره|سورة)/.test(t)||!aya)return ayahCard(sn,1);
  }
  /* معنى آية بنصها */
  var qt=Array.from(new Set(t.split(' ').filter(function(w){return w&&QCUE.indexOf(w)===-1&&!STOP[w]&&w.length>1})));
  if(qt.length>=3&&/(ايه|اية|معني|تفسير|يعني)/.test(t)){
    var V=qvBuild(),found=null,n=0;
    var qk=qt.map(wk).filter(Boolean);V.forEach(function(v){if(qk.length>=3&&qk.every(function(w){return v.n.indexOf(w)>-1})){n++;if(!found)found=v}});
    if(found&&n<=3)return ayahCard(found.s,found.a);
  }
  return null;
}

/* ---------- السيرة النبوية (الرحيق المختوم) — بحث محلي بدون نت ---------- */
var SR=null;
var SRCUE={};'قصة قصص حكاية حكايه ايه ما ماذا حصل حدث اخبرني احكي احكى عن كيف متى اين لماذا سيرة سيره تفاصيل اشرح غزوة غزوه معركة معركه نبي رسول الله صلي وسلم محمد'.split(' ').forEach(function(w){toks(w).forEach(function(t){SRCUE[t]=1})});
var SRGATE=/(^| )(غزوه|غزوات|معركه|سريه|سرايا|هجره|بعثه|وحي|مولد|ولد النبي|وفاه النبي|وفاه الرسول|اسراء|معراج|بدر|احد|خندق|احزاب|خيبر|تبوك|حنين|مؤته|فتح مكه|حديبيه|وداع|بيعه|عقبه|بني قريظه|بني النضير|قينقاع|قريش|ابو طالب|ابو جهل|حبشه|شعب ابي طالب|طايف|الطائف|سيره النبي|سيره الرسول|النبي|الرسول|محمد|عام الفيل|حليمه|المدينه|ثقيف|هوازن|عمره القضاء|عمره الحديبيه|حجه الوداع|سبايا|اسري|الاسارى|اسارى)( |$)/;
function srLoad(){
  if(SR)return true;
  var o=jdata('sira-data');if(!o)return false;SR=o.map(function(r){return {h:r[0],t:r[1],p:r[2]||'',f:r[3]||0,ht:toks(r[0]+(r[3]?' '+r[2]:'')),pt:toks(r[2]||''),wt:toks(r[1].slice(0,220))}});return true;
}
function srIn(arr,t){for(var i=0;i<arr.length;i++){var a=arr[i];if(a===t||(a.length>=4&&t.length>=4&&tm(a,t)))return true}return false}
function srSearch(q){
  q=q.replace(/الخندق/g,'الاحزاب').replace(/الحديبية|الحديبيه/g,'الحديبية');
  var qt=Array.from(new Set(toks(q)));if(!qt.length)return null;
  var names=qt.filter(function(t){return!SRCUE[t]});if(!names.length)return null;
  var DFh={};qt.forEach(function(t){var n=0;SR.forEach(function(r){if(srIn(r.ht,t)||srIn(r.pt,t))n++});DFh[t]=n});
  var W={},tot=0;qt.forEach(function(t){W[t]=(SRCUE[t]?0.6:2)*(DFh[t]?Math.log(SR.length/(DFh[t]+0.5))+1:1.5);tot+=W[t]});
  var best=null;
  SR.forEach(function(r,i){
    var s=0,ok=true,strong=0;
    names.forEach(function(t){if(srIn(r.ht,t)){strong++}else if(srIn(r.pt,t)){strong+=0.6}else ok=false});
    if(!ok)return;
    qt.forEach(function(t){if(srIn(r.ht,t))s+=W[t];else if(srIn(r.pt,t))s+=W[t]*0.7;else if(srIn(r.wt,t))s+=W[t]*0.25});
    var cov=s/tot;s=cov*10+(r.p?(r.f?0.5:0):1)-((/الثاني/.test(norm(r.h))&&!/ثاني/.test(norm(q)))?1.5:0);
    if(!best||s>best.s)best={i:i,s:s,cov:cov,strong:strong};
  });
  if(best&&best.cov>=0.88)return best;
  if(qt.length<2)return null;
  var b2=null;
  SR.forEach(function(r,i){
    var s=0,all=true;
    names.forEach(function(t){if(!(srIn(r.ht,t)||srIn(r.pt,t)||srIn(r.wt,t)))all=false});
    if(!all)return;
    qt.forEach(function(t){if(srIn(r.ht,t))s+=W[t];else if(srIn(r.pt,t))s+=W[t]*0.7;else if(srIn(r.wt,t))s+=W[t]*0.6});
    var cov=s/tot;if(!b2||cov>b2.cov)b2={i:i,s:cov,cov:cov};
  });
  return b2&&b2.cov>=0.85?b2:null;
}
function srShow(i,o){
  var r=SR[i],t=r.t,n=t.length,e=Math.min(n,o+720);
  if(e<n){var d=t.indexOf('. ',e);var d2=t.indexOf(' ،',e);if(d>-1&&d-e<300)e=d+1;else{var sp=t.indexOf(' ',e);if(sp>-1)e=sp}}
  var h=(o===0?'<span class="qt">'+hesc(r.h)+'</span>':'')+'<p>'+hesc(t.slice(o,e).trim())+'</p>';
  var ni=i,no=e;if(e>=n-5){ni=i+1;no=0}
  if(ni<SR.length)h+='<button type="button" class="bkmore" data-s="'+ni+'" data-o="'+no+'">كمّل القراءة</button>';
  return h;
}
function srAnswer(q,cb){
  var t=nrm(q);if(!SRGATE.test(t))return cb(false);
  if(!srLoad())return cb(false);
  var r=srSearch(q);if(!r)return cb(false);
  lastE={s:'sira'};
  aiSay(srShow(r.i,0),function(){busy=false;showChips()},500);cb(true);
}
window.__kbDbg=function(){kbBuild();return {n:KB.length,t:KB.map(function(e){return e.title}).filter(function(x,i,a){return a.indexOf(x)===i}).slice(0,200),err:window.__kbErr||''}};
window.__quranAnswer=function(q){return quranAnswer(q)};
window.__kbSearch=function(q){var r=kbSearch(q);return r?{t:r.e.title,cov:r.cov}:null};
window.__srSearch=function(q){if(!srLoad())return null;var r=srSearch(q);return r?{i:r.i,cov:r.cov,h:SR[r.i].h,p:SR[r.i].p,t:SR[r.i].t.slice(0,160)}:null};
$('#askLog').addEventListener('click',function(e){
  var b=e.target.closest('.bkmore');if(!b)return;
  var si=parseInt(b.getAttribute('data-s'),10),so=parseInt(b.getAttribute('data-o'),10);b.parentNode.removeChild(b);
  aiSay(srShow(si,so),function(){},300);
});

/* ---------- معنى الكلمة والتفسير ---------- */
var GH=null,TF=null,ghDone=false;
function initGH(){if(ghDone)return;ghDone=true;GH=jdata('gh-data');TF=jdata('tf-data')}
function wn(s){return nrm(String(s).replace(/[۞۩ۖ-ۭ]/g,''))}
function ps(x){return x.replace(/^(وال|فال|بال|كال|لل|ال|و|ف|ب|ل|ك|س)(?=.{2})/,'')}
function findMeaning(s,a,word){
  initGH();var items=GH&&GH[s+':'+a];if(!items)return null;
  var w=wn(word);if(!w)return null;var pw=ps(w),exact=null,part=null;
  items.forEach(function(it){
    var k=wn(it[0]).split(' ').filter(Boolean);
    if(k.length===1&&(k[0]===w||ps(k[0])===pw)&&!exact)exact=it;
    else if(k.length>1&&!part&&k.some(function(t){return t===w||ps(t)===pw}))part=it;
  });
  return exact||part;
}
var wsEl=$('#wsheet'),curW=null;
function hideWord(){wsEl.hidden=true;if(curW){curW.classList.remove('on');curW=null}}
window.__wordTap=function(s,a,el){
  if(curW)curW.classList.remove('on');curW=el;el.classList.add('on');
  initGH();
  var word=el.textContent.trim(),m=findMeaning(s,a,word),tf=TF&&TF[s+':'+a],items=GH&&GH[s+':'+a];
  $('#wsWord').textContent=word;
  var h='';
  if(m)h+='<h4>معنى الكلمة</h4><p><b>'+hesc(m[0])+'</b>: '+hesc(m[1])+'</p>';
  else h+='<h4>معنى الكلمة</h4><p>الكلمة دي واضحة المعنى ومفيش لها شرح خاص في كتاب الغريب. اقرأ تفسير الآية تحت.</p>';
  if(items&&items.length>(m?1:0)){
    h+='<details><summary>باقي كلمات الآية</summary>'+items.filter(function(x){return x!==m}).map(function(x){return '<p><b>'+hesc(x[0])+'</b>: '+hesc(x[1])+'</p>'}).join('')+'</details>';
  }
  if(tf)h+='<details'+(m?'':' open')+'><summary>تفسير الآية (التفسير الميسر)</summary>'+tf.split(/\n+/).map(function(p){return '<p>'+hesc(p)+'</p>'}).join('')+'</details>';
  $('#wsBody').innerHTML=h;wsEl.hidden=false;
};
$('#wsClose').onclick=hideWord;
var _c2=window.__ayahClear;window.__ayahClear=function(){hideWord();if(_c2)_c2()};

/* ---------- خلفية المصحف + قراءة السورة ---------- */
var BGS=[['0','تلقائي'],['2','ورقي'],['3','أخضر'],['4','سماوي'],['5','رملي'],['6','ليلي']],BGC={'0':null,'2':'#F8EFD6','3':'#E3F1E6','4':'#E3EEF8','5':'#E9DABB','6':'#121C19'};
function applyBg(){
  var v=String(store.get('qbg','0')),b=$('#rBody');
  if(v==='0'){b.classList.remove('qbg');b.removeAttribute('data-q')}else{b.classList.add('qbg');b.setAttribute('data-q',v)}
}
var pop=$('#bgPop');
function paintPop(){
  var v=String(store.get('qbg','0'));
  pop.innerHTML=BGS.map(function(o){return '<button data-v="'+o[0]+'" class="'+(o[0]===v?'on':'')+'"><i class="'+(o[0]==='0'?'auto':'')+'" style="'+(BGC[o[0]]?'background:'+BGC[o[0]]:'')+'"></i>'+o[1]+'</button>'}).join('');
}
pop.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;store.set('qbg',b.getAttribute('data-v'));applyBg();paintPop();pop.hidden=true});
var sb=document.querySelector('.sizebtns');
var bgBtn=document.createElement('button');bgBtn.className='iconbtn';bgBtn.id='rBg';bgBtn.setAttribute('aria-label','خلفية المصحف');
bgBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s-.8-1.6-.8-2.5c0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/></svg>';
var lsBtn=document.createElement('button');lsBtn.className='iconbtn';lsBtn.id='rListen';lsBtn.setAttribute('aria-label','استماع للسورة');
var PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',STOPI='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
lsBtn.innerHTML=PLAY;
sb.insertBefore(lsBtn,sb.firstChild);sb.insertBefore(bgBtn,sb.firstChild);
bgBtn.onclick=function(){paintPop();pop.hidden=!pop.hidden};
lsBtn.onclick=function(){
  pop.hidden=true;
  if(window.__qaPlaying&&__qaPlaying()){__qaStop();lsBtn.innerHTML=PLAY;lsBtn.classList.remove('on');return}
  if(!window.__qaGo)return;
  __ayahSelected(rState.s,1);
  var f=document.querySelector('.ay[data-a="1"]');if(f){document.querySelectorAll('.ay.sel').forEach(function(x){x.classList.remove('sel')});f.classList.add('sel')}
  __qaGo(rState.s,1);lsBtn.innerHTML=STOPI;lsBtn.classList.add('on');
  toast('جاري قراءة سورة '+Q.s[rState.s-1].name);
};
setInterval(function(){if(lsBtn.classList.contains('on')&&window.__qaPlaying&&!__qaPlaying()){lsBtn.innerHTML=PLAY;lsBtn.classList.remove('on')}},700);
var _open=openReader;
openReader=function(si,ay){_open(si,ay);applyBg();lsBtn.innerHTML=PLAY;lsBtn.classList.remove('on');pop.hidden=true;hideWord()};
document.addEventListener('click',function(e){if(!pop.hidden&&!e.target.closest('#bgPop')&&!e.target.closest('#rBg'))pop.hidden=true},true);

/* ---------- تنبيهات: أذكار الصباح والمساء، قبل الإقامة بخمس دقائق، وخطة الصيام ---------- */
function tzOff(ts,tz){
  var f=Math.floor(ts/1000)*1000,p=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(f)),o={};
  p.forEach(function(x){o[x.type]=+x.value});return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute,o.second)-f;
}
function wall(y,m,d,h,mi,tz){var g=Date.UTC(y,m-1,d,h,mi);return g-tzOff(g,tz)}
function pkey(d){return d.y+'-'+d.m+'-'+d.d}
function planMap(){var m=store.get('fastPlan',{}),n=Date.now()-5*864e5,c=false;Object.keys(m).forEach(function(k){var a=k.split('-');if(Date.UTC(+a[0],+a[1]-1,+a[2])<n){delete m[k];c=true}});if(c)store.set('fastPlan',m);return m}
window.__fastPlan={
  get:function(off){return !!planMap()[pkey(timesFor(off).date)]},
  toggle:function(off){
    var m=planMap(),t=timesFor(off),k=pkey(t.date),on=!m[k];
    if(on)m[k]=1;else delete m[k];store.set('fastPlan',m);syncNativeSoon();
    if(on){
      var sf=t.t.fajr.getTime()-settings.suhoor*60000,msg=Date.now()<sf?'تمام! هنبعتلك تنبيه السحور '+fmtTime(new Date(sf),t.tz)+' وتنبيه الإفطار '+fmtTime(t.t.maghrib,t.tz):'تمام! هنبعتلك تنبيه الإفطار '+fmtTime(t.t.maghrib,t.tz);
      toast(msg);
    }else toast('تم إلغاء الصيام');
    return on;
  },
  info:function(off){var t=timesFor(off);return {suhoor:fmtTime(new Date(t.t.fajr.getTime()-settings.suhoor*60000),t.tz),iftar:fmtTime(t.t.maghrib,t.tz),fajr:fmtTime(t.t.fajr,t.tz)}}
};
var AZ_ITEMS=[[8,1500000000,'هل قلت أذكار الصباح؟','لا تنسَ أذكار الصباح، فهي حصنك طوال اليوم.'],[20,1600000000,'هل قلت أذكار المساء؟','لا تنسَ أذكار المساء، فهي حصنك حتى الصباح.']];
function dayItems(t,now){
  var out=[],bid=(t.date.y*10000+t.date.m*100+t.date.d)*10,ids={fajr:0,dhuhr:1,asr:2,maghrib:3,isha:4};
  if(settings.azkarRem!==0&&settings.azkarRem!=='0'){
    AZ_ITEMS.forEach(function(a){var ts=wall(t.date.y,t.date.m,t.date.d,a[0],0,t.tz);if(ts>now+2000)out.push({id:bid+a[1],t:ts,k:'rem',n:a[2],c:a[3],tm:'',w:'az'+a[0]})});
  }
  if(settings.adhan){
    PRAYERS.forEach(function(p){
      var k=p[0],tt=t.t[k],iq=iqamaMin(k);
      if(!settings.pr[k]||!tt||!isFinite(tt)||iq<=5)return;
      var ts=tt.getTime()+iq*60000-5*60000,nm=(k==='dhuhr'&&t.date.dow===5)?'الجمعة':p[1];
      if(ts>now+2000)out.push({id:bid+1700000000+ids[k],t:ts,k:'rem',n:'الإقامة ناقص لها خمس دقائق',c:'استعد لصلاة '+nm,tm:'',w:'iq'+k});
    });
  }
  if(planMap()[pkey(t.date)]){
    var h=window.__hij(t.date.utc);
    if(h.m!==9||!settings.ramNotif){
      var sf=t.t.fajr.getTime()-settings.suhoor*60000;
      if(sf>now+2000)out.push({id:bid+1300000000,t:sf,k:'rem',n:'حان وقت السحور',c:'تسحّروا فإن في السحور بركة. الفجر الساعة '+fmtTime(t.t.fajr,t.tz),tm:'',w:'ps'});
      var im=t.t.maghrib.getTime();
      if(im>now+2000)out.push({id:bid+1400000000,t:im,k:'rem',n:'حان موعد الإفطار، تقبّل الله صيامك',c:'ادعُ بدعاء الإفطار: «ذهب الظمأ وابتلّت العروق وثبت الأجر إن شاء الله»',tm:'',w:'pi'});
    }
  }
  return out;
}
var _ram=window.__ramItems;
window.__ramItems=function(t,items,now){
  if(_ram)_ram(t,items,now);
  dayItems(t,now).forEach(function(x){items.push(x)});
};
/* المتصفح: التنبيهات أثناء فتح الصفحة */
var wFired={};
setInterval(function(){
  try{
    if(NATIVE||!('Notification' in window)||Notification.permission!=='granted')return;
    var now=Date.now();
    [0,1].forEach(function(off){
      dayItems(timesFor(off),0).forEach(function(x){
        var id=x.id,d=now-x.t;
        if(d>=0&&d<90000&&!wFired[id]){wFired[id]=1;try{new Notification(x.n,{body:x.c,icon:'icon-192.png'})}catch(e){}toast(x.n)}
      });
    });
  }catch(e){}
},5000);
var _pm=window.__paintMoreSettings;
window.__paintMoreSettings=function(){
  if(_pm)_pm();
  seg('#segAzkarRem',[['1','تشغيل'],['0','إيقاف']],String(settings.azkarRem===0||settings.azkarRem==='0'?0:1),function(v){settings.azkarRem=parseInt(v,10);saveSettings();paintSettings()});
  seg('#segOpen',[['1','تشغيل'],['0','إيقاف']],String(settings.openSnd===0||settings.openSnd==='0'?0:1),function(v){settings.openSnd=parseInt(v,10);saveSettings();paintSettings()});
};
if(window.__paintMoreSettings)try{window.__paintMoreSettings()}catch(e){}

/* ---------- اختيار صوت الشيخ عند أول دخول للتطبيق ---------- */
var PLAYSVG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
var vpkState={open:false,pick:''};
function vGender(v){
  if(v&&v.gender)return v.gender;
  var n=String(v&&v.name||'').toLowerCase();
  if(/female|woman|(^|[^a-z])f(em)?[_#-]/.test(n)&&!/male|man|(^|[^a-z])m[_#-]/.test(n))return 'female';
  return 'male';
}
function vpkRaw(){
  if(NV){try{return JSON.parse(window.AndroidVoice.voices()||'[]')}catch(e){return []}}
  if(window.speechSynthesis){
    return speechSynthesis.getVoices().filter(function(v){return /^ar/i.test(v.lang)}).map(function(v,i){
      var cc=(v.lang.split('-')[1]||'').toUpperCase();
      return {name:v.name,label:'صوت '+AR(i+1),net:!v.localService,gender:vGender({name:v.name}),country:cc};
    });
  }
  return [];
}
function vpkList(){
  var all=vpkRaw();
  var males=all.filter(function(v){return vGender(v)!=='female'});
  var females=all.filter(function(v){return vGender(v)==='female'}).slice(0,2);
  return males.concat(females);
}
function vpkPreview(name){
  var pitch=(vget('Pitch',90))/100,rate=(vget('Rate',95))/100,sample='السلام عليكم، أنا الشيخ.';
  if(NV){try{window.AndroidVoice.speak(sample,name,rate,pitch)}catch(e){}return}
  if(window.speechSynthesis){
    try{speechSynthesis.cancel()}catch(e){}
    var u=new SpeechSynthesisUtterance(sample);u.lang='ar-SA';u.pitch=pitch;u.rate=rate;
    var vs=speechSynthesis.getVoices();var v0=vs.filter(function(v){return v.name===name})[0];if(v0){u.voice=v0;u.lang=v0.lang}
    speechSynthesis.speak(u);
  }
}
function paintVpkList(o){
  var list=vpkList(),b=$('#vpkList',o);
  if(!list.length){
    b.innerHTML='<p class="vpke">لا توجد أصوات عربية مثبتة على جهازك بعد. تقدر تكمّل وتفتح إعدادات الأصوات لاحقًا من اسأل الشيخ.</p>'+(NV?'<button type="button" class="go" id="vpkTtsSet">فتح إعدادات الأصوات</button>':'');
    var bt=$('#vpkTtsSet',o);if(bt)bt.onclick=function(){try{window.AndroidVoice.openTtsSettings()}catch(e){}};
    return;
  }
  if(!vpkState.pick||!list.some(function(v){return v.name===vpkState.pick}))vpkState.pick=list[0].name;
  b.innerHTML=list.map(function(v){
    var on=v.name===vpkState.pick;
    var sub=v.gender==='female'?'صوت أنثوي':(v.country?hesc(v.country):'');
    return '<div class="vpki'+(on?' on':'')+'" data-n="'+hesc(v.name)+'" role="radio" aria-checked="'+(on?'true':'false')+'" tabindex="0">'
      +'<span class="vpkr"><span class="dot"></span></span>'
      +'<span class="vpkt"><b>'+hesc(v.label)+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span>'
      +'<button type="button" class="vpkp" data-n="'+hesc(v.name)+'" aria-label="استمع لعيّنة الصوت">'+PLAYSVG+'</button>'
      +'</div>';
  }).join('');
}
function afterOnboard(){
  showVoicePicker(function(){if(window.__permStart)window.__permStart()});
}
function showVoicePicker(cb){
  if(store.get('voicePicked',0)){cb&&cb();return}
  vpkState.open=true;vpkState.pick='';
  var o=document.createElement('div');o.className='onb vpk';
  o.innerHTML='<div class="card" role="dialog" aria-modal="true"><h2>اختر صوت الشيخ</h2><p>هيقرأ بيه الشيخ إجاباته في «اسأل الشيخ». تقدر تغيّره لاحقًا من إعداداته.</p><div class="vpklist" id="vpkList"></div><button class="go" id="vpkGo">تم</button><button class="skip" id="vpkSkip">تخطّي</button></div>';
  document.body.appendChild(o);
  paintVpkList(o);
  $('#vpkList',o).addEventListener('click',function(e){
    var p=e.target.closest('.vpkp');
    if(p){var n=p.getAttribute('data-n');vpkState.pick=n;paintVpkList(o);vpkPreview(n);return}
    var it=e.target.closest('.vpki');if(!it)return;
    vpkState.pick=it.getAttribute('data-n');paintVpkList(o);
  });
  $('#vpkList',o).addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var it=e.target.closest('.vpki');if(!it)return;e.preventDefault();
    vpkState.pick=it.getAttribute('data-n');paintVpkList(o);
  });
  function close(save){
    vpkState.open=false;
    if(save&&vpkState.pick)store.set('skVoice',vpkState.pick);
    store.set('voicePicked',1);
    try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
    try{if(NV)window.AndroidVoice.stopSpeak()}catch(e){}
    o.style.transition='opacity .35s';o.style.opacity='0';setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o)},380);
    cb&&cb();
  }
  $('#vpkGo',o).onclick=function(){close(true)};
  $('#vpkSkip',o).onclick=function(){close(false)};
}
var _vpkVC=window.speechSynthesis&&speechSynthesis.onvoiceschanged;
if(window.speechSynthesis&&!NV)try{speechSynthesis.onvoiceschanged=function(){if(_vpkVC)_vpkVC();if(vpkState.open){var o=document.querySelector('.vpk');if(o)paintVpkList(o)}}}catch(e){}

if(!store.get('onboarded',0)&&!uName())onboard();
else{store.set('onboarded',1);afterOnboard()}
})();
