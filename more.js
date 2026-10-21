/* ===================== more tools ===================== */
(function(){
var NUMS='٠١٢٣٤٥٦٧٨٩',DAY=864e5;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toLat(s){return String(s).replace(/[٠-٩]/g,function(d){return NUMS.indexOf(d)}).replace(/٫/g,'.').replace(/[٬,\s]/g,'')}
function num(v){var n=parseFloat(toLat(v));return isFinite(n)?n:0}
function fmtN(n,dec){return AR(Number(n).toLocaleString('en-US',{maximumFractionDigits:dec==null?0:dec}))}
function tzOf(){return cityById(settings.city)[5]}
function localDate(off){return cityDate(tzOf(),off||0)}
function keyOf(d){return d.y+'-'+pad(d.m)+'-'+pad(d.d)}
function vibrate(p){try{if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
function mk(name,def){return store.get(name,def)}

var IC={
  qibla:svg('<circle cx="12" cy="12" r="9"/><path d="M12 6l2.6 7H9.4z" fill="currentColor"/><path d="M12 18.5V16"/>'),
  tasbih:ICON.beads,
  calendar:svg('<rect x="4" y="5" width="16" height="15" rx="2.2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  tracker:svg('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 12.5l3 3 5-6"/>'),
  names:svg('<path d="M12 3l2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z"/>'),
  khatma:ICON.book,
  zakat:svg('<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.5.8-2.5 1.9 0 2.7 5.2 1.3 5.2 4 0 1.2-1.1 2-2.7 2-1.2 0-2.2-.5-2.7-1.4M12 6.5V8m0 8v1.5"/>')
};
var TILES=[
  ['qibla','اتجاه القبلة','بوصلة وزاوية القبلة من مدينتك'],
  ['tasbih','المسبحة','عدّاد تسبيح بهدف'],
  ['calendar','التقويم الهجري','المناسبات والأيام البيض'],
  ['tracker','متابعة الصلوات','سجل يومي وأيام متتالية'],
  ['names','أسماء الله الحسنى','٩٩ اسمًا بمعانيها'],
  ['khatma','ختمة القرآن','ورد يومي حسب المدة'],
  ['zakat','حاسبة الزكاة','نصاب الذهب و٢٫٥٪']
];
var RENDER={},cleanup=null,current=null;

function paintMoreHome(){
  $('#mgrid').innerHTML=TILES.map(function(t,i){
    return '<button class="acard'+(i===TILES.length-1?' wide':'')+'" data-m="'+t[0]+'"><span class="ic">'+IC[t[0]]+'</span><b>'+t[1]+'</b><small>'+t[2]+'</small></button>';
  }).join('');
}
function openMore(id){
  var t=TILES.filter(function(x){return x[0]===id})[0];if(!t||!RENDER[id])return;
  runCleanup();current=id;
  $('#moreHome').hidden=true;var d=$('#moreDetail');d.hidden=false;
  d.innerHTML='<div class="zhead"><button class="iconbtn" id="mBack" aria-label="رجوع">'+ICON.back+'</button><div class="ttl"><h2>'+t[1]+'</h2><small>'+t[2]+'</small></div></div><div id="mBody"></div>';
  $('#mBack').onclick=closeMore;
  RENDER[id]($('#mBody'));
  window.scrollTo(0,0);
}
function runCleanup(){if(cleanup){try{cleanup()}catch(e){}cleanup=null}}
function closeMore(){runCleanup();current=null;$('#moreDetail').hidden=true;$('#moreHome').hidden=false;window.scrollTo(0,0)}
window.__moreReset=function(){runCleanup();current=null;$('#moreDetail').hidden=true;$('#moreHome').hidden=false;paintMoreHome()};
window.__openMore=function(id){showTab('more',true);openMore(id)};
$('#mgrid').addEventListener('click',function(e){var b=e.target.closest('.acard');if(b)openMore(b.getAttribute('data-m'))});
var prevBack=window.__back;
window.__back=function(){
  if(currentTab==='more'&&current){closeMore();return true}
  return prevBack?prevBack():false;
};

/* ---------- Qibla ---------- */
var KAABA={lat:21.4225,lng:39.8262},R2=Math.PI/180;
function qBearing(lat,lng){
  var p1=lat*R2,p2=KAABA.lat*R2,dl=(KAABA.lng-lng)*R2;
  var y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
  return (Math.atan2(y,x)/R2+360)%360;
}
function qDist(lat,lng){
  var p1=lat*R2,p2=KAABA.lat*R2,dp=(KAABA.lat-lat)*R2,dl=(KAABA.lng-lng)*R2;
  var a=Math.sin(dp/2)*Math.sin(dp/2)+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)*Math.sin(dl/2);
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
var WINDS=['شمال','شمال شرق','شرق','جنوب شرق','جنوب','جنوب غرب','غرب','شمال غرب'];
function windName(b){return WINDS[Math.round(b/45)%8]}
RENDER.qibla=function(box){
  var c=cityById(settings.city),b=qBearing(c[3],c[4]),dist=qDist(c[3],c[4]);
  var ticks='';
  for(var a=0;a<360;a+=10){
    var big=a%90===0,r1=big?100:104,r2=114,rad=a*R2;
    ticks+='<line class="cmp-tick'+(big?' big':'')+'" x1="'+(120+r1*Math.sin(rad)).toFixed(1)+'" y1="'+(120-r1*Math.cos(rad)).toFixed(1)+'" x2="'+(120+r2*Math.sin(rad)).toFixed(1)+'" y2="'+(120-r2*Math.cos(rad)).toFixed(1)+'"/>';
  }
  var letters='<text class="cmp-l n" x="120" y="40">ش</text><text class="cmp-l" x="200" y="120">ق</text><text class="cmp-l" x="120" y="200">ج</text><text class="cmp-l" x="40" y="120">غ</text>';
  box.innerHTML=
   '<div class="mcard"><div class="compass" id="cmp"><svg viewBox="0 0 240 240" aria-label="بوصلة القبلة">'+
   '<circle class="cmp-ring" cx="120" cy="120" r="116"/>'+
   '<g id="cmpDial">'+ticks+letters+
   '<g transform="rotate('+b.toFixed(1)+' 120 120)"><line class="cmp-needle" x1="120" y1="120" x2="120" y2="46"/><rect class="cmp-kaaba" x="108" y="18" width="24" height="24" rx="3"/><rect class="cmp-kaaba-t" x="108" y="24" width="24" height="4"/><rect class="cmp-kaaba-t" x="117" y="32" width="6" height="10" rx="1"/></g></g>'+
   '<circle class="cmp-hub" cx="120" cy="120" r="6"/>'+
   '<path class="cmp-pointer" d="M120 -2l-9 -14h18z" transform="translate(0 6)"/></svg></div>'+
   '<div class="qbig">'+AR(Math.round(b))+'°</div>'+
   '<div class="qsub">'+windName(b)+' · '+fmtN(dist)+' كم من '+esc(c[1])+'</div>'+
   '<div class="qstat" id="qStat"></div>'+
   '<div class="btnrow"><button class="btn fill" id="btnCompass">تشغيل البوصلة</button></div></div>'+
   '<div class="mcard"><p class="mnote">لما تشغّل البوصلة، لفّ الموبايل لحد ما يعدّل شكل الدائرة وتتحوّل للأخضر: ساعتها أعلى الموبايل ناحية القبلة. ابعد عن المغناطيس والمعادن، وحرّك الموبايل على شكل ٨ لو الاتجاه مش دقيق. لو البوصلة مش شغالة على جهازك، استخدم الزاوية ' + AR(Math.round(b)) + '° من اتجاه الشمال.</p>'+
   '<p class="mnote" style="margin-top:8px">الحساب من مدينة <b>'+esc(c[1])+'</b>. غيّر المدينة أو استخدم موقعك من الإعدادات لنتيجة أدق.</p></div>';
  var dial=$('#cmpDial'),cmp=$('#cmp'),stat=$('#qStat'),smooth=null,evName=null,handler=null,timer=null,okNow=false;
  function paint(h){
    dial.setAttribute('transform','rotate('+(-h).toFixed(1)+' 120 120)');
    var diff=Math.abs(((b-h+540)%360)-180),ok=diff<4;
    cmp.classList.toggle('ok',ok);
    stat.textContent=ok?'انت متجه للقبلة ✓':'لفّ الموبايل ناحية الكعبة';
    if(ok&&!okNow)vibrate(40);okNow=ok;
  }
  function setH(h){
    if(smooth==null)smooth=h;else{var d=((h-smooth+540)%360)-180;smooth=(smooth+d*0.25+360)%360}
    paint(smooth);
  }
  function attach(){
    var got=false;
    evName=('ondeviceorientationabsolute' in window)?'deviceorientationabsolute':'deviceorientation';
    handler=function(e){
      var h=null;
      if(typeof e.webkitCompassHeading==='number')h=e.webkitCompassHeading;
      else if(e.alpha!=null&&(e.absolute===true||evName==='deviceorientationabsolute'))h=(360-e.alpha)%360;
      if(h==null)return;got=true;setH(h);
    };
    window.addEventListener(evName,handler,true);
    stat.textContent='جاري قراءة الاتجاه…';
    timer=setTimeout(function(){if(!got)stat.textContent='مستشعر الاتجاه مش متاح هنا. اتجه ناحية '+AR(Math.round(b))+'° من الشمال.'},2800);
    $('#btnCompass').textContent='البوصلة شغّالة';
  }
  $('#btnCompass').onclick=function(){
    if(handler)return;
    if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'){
      DeviceOrientationEvent.requestPermission().then(function(r){if(r==='granted')attach();else stat.textContent='تم رفض إذن البوصلة.'}).catch(function(){stat.textContent='تعذّر تشغيل البوصلة.'});
    }else attach();
  };
  paint(0);cmp.classList.remove('ok');stat.textContent='';
  cleanup=function(){if(handler)window.removeEventListener(evName,handler,true);clearTimeout(timer)};
};

/* ---------- Tasbih ---------- */
var PHR=['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ','لَا إِلَهَ إِلَّا اللَّهُ','أَسْتَغْفِرُ اللَّهَ','اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ'];
RENDER.tasbih=function(box){
  var S=mk('tasbih',{p:0,t:33,c:{},tot:0,day:'',dn:0});
  function save(){store.set('tasbih',S)}
  var today=keyOf(localDate(0));if(S.day!==today){S.day=today;S.dn=0;save()}
  var CIRC=2*Math.PI*104;
  box.innerHTML=
   '<div class="tsb-phrases" id="tsbP"></div>'+
   '<div class="tsb-phrase" id="tsbName"></div>'+
   '<div class="tsb-wrap"><svg viewBox="0 0 240 240"><circle class="tsb-track" cx="120" cy="120" r="104"/><circle class="tsb-prog" id="tsbRing" cx="120" cy="120" r="104" stroke-dasharray="'+CIRC.toFixed(1)+'" stroke-dashoffset="'+CIRC.toFixed(1)+'"/></svg>'+
   '<button class="tsb-btn" id="tsbBtn" aria-label="عدّ"><b id="tsbN">٠</b><small id="tsbT"></small></button></div>'+
   '<div class="dayopts" id="tsbTargets" style="margin-bottom:12px"></div>'+
   '<div class="tsb-stats"><div><b id="tsbDay">٠</b><span>تسبيح اليوم</span></div><div><b id="tsbTot">٠</b><span>الإجمالي</span></div></div>'+
   '<div class="btnrow"><button class="btn" id="tsbReset">تصفير العدّاد</button></div>';
  function paint(){
    var ph=PHR[S.p],n=S.c[S.p]||0;
    $('#tsbP').innerHTML=PHR.map(function(x,i){return '<button data-i="'+i+'" class="'+(i===S.p?'on':'')+'">'+x.replace(/[ً-ٰٟ]/g,'')+'</button>'}).join('');
    $('#tsbName').textContent=ph;
    $('#tsbN').textContent=AR(n);
    $('#tsbT').textContent=S.t?'الهدف '+AR(S.t):'بدون هدف';
    var f=S.t?Math.min(1,(n%S.t===0&&n>0)?1:(n%S.t)/S.t):0;
    $('#tsbRing').setAttribute('stroke-dashoffset',(CIRC*(1-f)).toFixed(1));
    $('#tsbTargets').innerHTML=[[33,'٣٣'],[99,'٩٩'],[100,'١٠٠'],[0,'مفتوح']].map(function(x){return '<button data-t="'+x[0]+'" class="'+(S.t===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('');
    $('#tsbDay').textContent=AR(S.dn);$('#tsbTot').textContent=AR(S.tot);
  }
  $('#tsbBtn').onclick=function(){
    S.c[S.p]=(S.c[S.p]||0)+1;S.tot++;S.dn++;
    var n=S.c[S.p];
    if(S.t&&n%S.t===0){vibrate([60,40,60]);toast('ما شاء الله، أتممت '+AR(S.t))}else vibrate(12);
    save();paint();
  };
  $('#tsbP').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.p=parseInt(b.getAttribute('data-i'),10);save();paint()};
  $('#tsbTargets').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.t=parseInt(b.getAttribute('data-t'),10);save();paint()};
  $('#tsbReset').onclick=function(){S.c[S.p]=0;save();paint();toast('تم تصفير العدّاد')};
  paint();
};

/* ---------- Hijri calendar ---------- */
var HF=null;
try{HF=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric',timeZone:'UTC'})}catch(e){}
var HM=['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
window.__hij=function(u){return hij(u)};
function hij(utc){
  var d=new Date(utc.getTime()+(settings.hijriAdj||0)*DAY),o={};
  HF.formatToParts(d).forEach(function(x){if(x.type!=='literal'&&x.type!=='era')o[x.type]=parseInt(x.value,10)});
  return {y:o.year,m:o.month,d:o.day};
}
var OCC={'1-1':'رأس السنة الهجرية','1-9':'تاسوعاء (يُستحب صيامه)','1-10':'يوم عاشوراء (يُستحب صيامه)','3-12':'ذكرى المولد النبوي','7-27':'ذكرى الإسراء والمعراج','8-15':'ليلة النصف من شعبان','9-1':'أول أيام رمضان','9-21':'بداية العشر الأواخر من رمضان','9-27':'ليلة ٢٧ رمضان (تُرجى فيها ليلة القدر)','10-1':'عيد الفطر','10-2':'بداية صيام ستة من شوال','12-1':'بداية العشر الأوائل من ذي الحجة','12-9':'يوم عرفة','12-10':'عيد الأضحى','12-11':'أول أيام التشريق'};
var MAJOR=['1-1','1-10','9-1','10-1','12-9','12-10'];
var DOWS=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
function nextOcc(from){
  for(var i=0;i<=420;i++){
    var d=new Date(from.getTime()+i*DAY),h=hij(d),k=h.m+'-'+h.d;
    if(MAJOR.indexOf(k)>-1)return {days:i,name:OCC[k],date:d,h:h};
  }
  return null;
}
function monthStartOf(utc){var h=hij(utc);return new Date(utc.getTime()-(h.d-1)*DAY)}
RENDER.calendar=function(box){
  if(!HF){box.innerHTML='<div class="mcard"><p class="mnote">المتصفح ده مش بيدعم حساب التاريخ الهجري.</p></div>';return}
  var td=localDate(0).utc,start=monthStartOf(td);
  var gf=new Intl.DateTimeFormat('ar-EG',{timeZone:'UTC',day:'numeric',month:'long'});
  var gm=new Intl.DateTimeFormat('ar-EG',{timeZone:'UTC',month:'long',year:'numeric'});
  function paint(){
    var h0=hij(start),days=[],d=new Date(start.getTime());
    for(var i=0;i<31;i++){var h=hij(d);if(i>0&&h.d===1)break;days.push({u:new Date(d.getTime()),h:h});d=new Date(d.getTime()+DAY)}
    var lead=(start.getUTCDay()+1)%7,cells='';
    for(i=0;i<7;i++)cells+='<div class="w">'+DOWS[i].replace('ال','')+'</div>';
    for(i=0;i<lead;i++)cells+='<div class="d blank"></div>';
    var isToday=function(u){return u.getTime()===td.getTime()};
    days.forEach(function(x){
      var k=x.h.m+'-'+x.h.d,cls='d';
      if(x.u.getUTCDay()===5)cls+=' fri';
      if(x.h.d>=13&&x.h.d<=15)cls+=' white';
      if(OCC[k])cls+=' occ';
      if(isToday(x.u))cls+=' today';
      cells+='<div class="'+cls+'"><b>'+AR(x.h.d)+'</b><small>'+AR(x.u.getUTCDate())+'</small></div>';
    });
    var list=days.filter(function(x){return OCC[x.h.m+'-'+x.h.d]}).map(function(x){
      return '<div class="o"><i>'+AR(x.h.d)+' '+HM[x.h.m-1]+'</i><span>'+OCC[x.h.m+'-'+x.h.d]+'<small>'+gf.format(x.u)+'</small></span></div>';
    }).join('');
    var n=nextOcc(td),nx='';
    if(n)nx='<div class="nextocc"><small>المناسبة القادمة</small><b>'+n.name+'</b><small>'+(n.days===0?'النهارده':'بعد '+AR(n.days)+' يوم')+' · '+gf.format(n.date)+'</small></div>';
    var fasting='<p class="mnote">الأيام البيض (١٣ و١٤ و١٥) متحددة بإطار ذهبي. ويُستحب كمان صيام الاثنين والخميس.</p>';
    $('#calBody').innerHTML=nx+
      '<div class="mcard"><div class="calhead"><button class="iconbtn" id="calN" aria-label="الشهر التالي">'+ICON.back.replace('<svg','<svg style="transform:scaleX(-1)"')+'</button><div class="t">'+HM[h0.m-1]+' '+AR(h0.y)+'<small>'+gm.format(start)+'</small></div><button class="iconbtn" id="calP" aria-label="الشهر السابق">'+ICON.back+'</button></div><div class="cal">'+cells+'</div></div>'+
      '<div class="mcard"><h3>مناسبات الشهر</h3>'+(list?'<div class="occlist">'+list+'</div>':'<p class="mnote">لا توجد مناسبات رئيسية في هذا الشهر.</p>')+'<div style="margin-top:10px">'+fasting+'</div></div>';
    $('#calN').onclick=function(){
      var d2=new Date(start.getTime()+27*DAY);
      for(var j=0;j<6;j++){if(hij(d2).d===1)break;d2=new Date(d2.getTime()+DAY)}
      start=d2;paint();
    };
    $('#calP').onclick=function(){start=monthStartOf(new Date(start.getTime()-DAY));paint()};
  }
  box.innerHTML='<div id="calBody"></div>';
  paint();
};

/* ---------- Prayer tracker ---------- */
var TP=[['fajr','الفجر'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
RENDER.tracker=function(box){
  var D=mk('track',{});
  function get(k){return D[k]||[0,0,0,0,0]}
  function done(k){var a=get(k),n=0;a.forEach(function(x){n+=x?1:0});return n}
  function stats(){
    var streak=0,off=0,total=0,k;
    Object.keys(D).forEach(function(x){total+=done(x)});
    if(done(keyOf(localDate(0)))<5)off=1;
    while(off<400){k=keyOf(localDate(-off));if(done(k)===5){streak++;off++}else break}
    return {streak:streak,total:total};
  }
  function paint(){
    var tk=keyOf(localDate(0)),a=get(tk),st=stats();
    var rows=TP.map(function(p,i){return '<button class="r'+(a[i]?' on':'')+'" data-i="'+i+'"><span class="box">'+ICON.check+'</span><b>'+p[1]+'</b></button>'}).join('');
    var wk='';
    for(var i=6;i>=0;i--){
      var d=localDate(-i),n=done(keyOf(d));
      wk+='<div><i class="'+(n?'':'z')+'" style="height:'+(n?(n/5*100):6)+'%"></i><span>'+DOWS[(d.dow+1)%7].replace('ال','')+'</span></div>';
    }
    box.innerHTML=
     '<div class="mcard"><div class="mrow"><h3 style="margin:0">صلوات اليوم</h3><span class="mnote">'+AR(done(tk))+' من ٥</span></div><div class="trk" style="margin-top:6px">'+rows+'</div></div>'+
     '<div class="mcard"><div class="kpis"><div><b>'+AR(st.streak)+'</b><span>أيام متتالية</span></div><div><b>'+AR(st.total)+'</b><span>إجمالي الصلوات</span></div><div><b>'+AR(done(tk))+'</b><span>اليوم</span></div></div></div>'+
     '<div class="mcard"><h3>آخر ٧ أيام</h3><div class="wk">'+wk+'</div><p class="mnote" style="margin-top:8px">السجل محفوظ على جهازك فقط.</p></div>';
    box.querySelectorAll('.trk .r').forEach(function(b){b.onclick=function(){
      var i=parseInt(b.getAttribute('data-i'),10),arr=get(tk).slice();arr[i]=arr[i]?0:1;D[tk]=arr;
      var keys=Object.keys(D).sort();while(keys.length>400){delete D[keys.shift()]}
      store.set('track',D);vibrate(10);paint();
    }});
  }
  paint();
};

/* ---------- 99 names ---------- */
var NAMES=('الرحمن|واسع الرحمة بجميع الخلق\nالرحيم|الرحيم بالمؤمنين\nالملك|صاحب الملك والتصرف المطلق\nالقدوس|المنزّه عن كل نقص\nالسلام|السالم من كل عيب\nالمؤمن|المصدّق لرسله والمؤمّن لعباده\nالمهيمن|الرقيب الحافظ لكل شيء\nالعزيز|الغالب الذي لا يُقهر\nالجبار|القاهر الذي يجبر الكسير\nالمتكبر|المتعالي عن صفات الخلق\nالخالق|المقدّر للأشياء قبل إيجادها\nالبارئ|الموجد للخلق على غير تفاوت\nالمصور|الذي صوّر المخلوقات كما شاء\nالغفار|كثير المغفرة\nالقهار|الغالب على كل شيء\nالوهاب|كثير العطاء بلا مقابل\nالرزاق|المتكفّل بأرزاق العباد\nالفتاح|فاتح أبواب الرزق والرحمة\nالعليم|الذي يعلم كل شيء\nالقابض|الذي يقبض الرزق والأرواح بحكمته\nالباسط|الذي يبسط الرزق لمن يشاء\nالخافض|الذي يخفض المتكبرين\nالرافع|الذي يرفع المؤمنين ومن يشاء\nالمعز|الذي يهب العزة لمن يشاء\nالمذل|الذي يُذلّ من يشاء\nالسميع|الذي يسمع كل صوت\nالبصير|الذي يرى كل شيء\nالحكم|الفاصل بين خلقه بالحق\nالعدل|المنزّه عن الظلم\nاللطيف|العالم بدقائق الأمور الرفيق بعباده\nالخبير|العالم ببواطن الأمور\nالحليم|الذي لا يعاجل بالعقوبة\nالعظيم|ذو العظمة والكبرياء\nالغفور|كثير الستر والمغفرة\nالشكور|يجازي على القليل بالكثير\nالعلي|المتعالي فوق كل شيء\nالكبير|ذو الكبرياء والعظمة\nالحفيظ|الحافظ لكل شيء\nالمقيت|المقتدر الذي يوصل الأقوات\nالحسيب|الكافي والمحاسب لعباده\nالجليل|ذو الجلال والعظمة\nالكريم|كثير الخير والعطاء\nالرقيب|المراقب لكل شيء\nالمجيب|الذي يجيب دعاء من دعاه\nالواسع|الذي وسع علمه ورحمته كل شيء\nالحكيم|الذي يضع الأشياء مواضعها\nالودود|المحب لعباده الصالحين\nالمجيد|ذو المجد والعظمة\nالباعث|الذي يبعث الخلق يوم القيامة\nالشهيد|المطلع على كل شيء\nالحق|الثابت الذي لا شك فيه\nالوكيل|المتكفّل بأمور خلقه\nالقوي|صاحب القوة التامة\nالمتين|الشديد القوة الذي لا يلحقه ضعف\nالولي|الناصر والمتولي أمور عباده\nالحميد|المحمود في ذاته وأفعاله\nالمحصي|الذي أحصى كل شيء عددًا\nالمبدئ|الذي بدأ الخلق\nالمعيد|الذي يعيد الخلق بعد الموت\nالمحيي|واهب الحياة\nالمميت|الذي يقدّر الموت\nالحي|ذو الحياة الكاملة الدائمة\nالقيوم|القائم بنفسه المقيم لغيره\nالواجد|الذي لا يعجزه شيء ولا يفقد شيئًا\nالماجد|ذو المجد الكامل\nالواحد|المنفرد بذاته وصفاته وأفعاله\nالأحد|الذي لا شبيه له ولا نظير\nالصمد|الذي تُقصد إليه الحوائج\nالقادر|الذي لا يعجزه شيء\nالمقتدر|البالغ في القدرة\nالمقدم|الذي يقدّم من يشاء\nالمؤخر|الذي يؤخّر من يشاء\nالأول|الذي ليس قبله شيء\nالآخر|الذي ليس بعده شيء\nالظاهر|الذي ليس فوقه شيء\nالباطن|الذي ليس دونه شيء\nالوالي|المتصرف في خلقه\nالمتعالي|المنزّه عن صفات النقص\nالبر|المحسن إلى عباده\nالتواب|الذي يقبل توبة التائبين\nالمنتقم|الذي ينتقم من الظالمين\nالعفو|الذي يمحو الذنوب ويتجاوز عنها\nالرؤوف|شديد الرحمة والرأفة\nمالك الملك|المالك لكل شيء\nذو الجلال والإكرام|صاحب العظمة والفضل\nالمقسط|العادل في حكمه\nالجامع|الذي يجمع الخلق ليوم القيامة\nالغني|المستغني عن كل ما سواه\nالمغني|الذي يغني من يشاء\nالمانع|الذي يمنع ما يشاء بحكمته\nالضار|الذي يقدّر الضر لحكمة\nالنافع|الذي يقدّر النفع\nالنور|منوّر السماوات والأرض\nالهادي|الذي يهدي من يشاء\nالبديع|مبدع الخلق على غير مثال\nالباقي|الدائم الذي لا يفنى\nالوارث|الباقي بعد فناء الخلق\nالرشيد|الذي يرشد الخلق إلى ما ينفعهم\nالصبور|الذي لا يعاجل العصاة بالعقوبة').split('\n').map(function(l){var p=l.split('|');return {n:p[0],m:p[1]}});
RENDER.names=function(box){
  var idx=Math.floor(localDate(0).utc.getTime()/DAY)%NAMES.length,nd=NAMES[idx];
  box.innerHTML='<div class="nday"><small>اسم اليوم</small><b>'+nd.n+'</b><p>'+nd.m+'</p></div>'+
   '<input class="search" id="nSearch" type="search" placeholder="ابحث في الأسماء" autocomplete="off" style="margin-bottom:10px">'+
   '<div class="ngrid" id="nGrid"></div>';
  function paint(){
    var q=norm($('#nSearch').value||'');
    var list=NAMES.map(function(x,i){return {x:x,i:i}}).filter(function(o){return !q||norm(o.x.n).indexOf(q)>-1||norm(o.x.m).indexOf(q)>-1});
    $('#nGrid').innerHTML=list.length?list.map(function(o){return '<div class="ncard"><div class="i">'+AR(o.i+1)+'</div><div class="n">'+o.x.n+'</div><p>'+o.x.m+'</p></div>'}).join(''):'<div class="empty" style="grid-column:1/-1">مفيش نتيجة</div>';
  }
  $('#nSearch').addEventListener('input',paint);paint();
};

/* ---------- Khatma ---------- */
var CUM=null,TOTAL=0;
function buildCum(){if(CUM)return;CUM=[];var t=0;Q.s.forEach(function(s){CUM.push(t);t+=s.v.length});TOTAL=t}
function vAt(i){buildCum();var s=0;while(s+1<Q.s.length&&CUM[s+1]<=i)s++;return {s:s+1,a:i-CUM[s]+1}}
function portion(day,days){buildCum();var a=Math.floor((day-1)*TOTAL/days),b=Math.floor(day*TOTAL/days)-1;return {from:vAt(a),to:vAt(Math.max(a,b))}}
function sName(n){return Q.s[n-1].name}
function pText(p){return 'من سورة <b>'+sName(p.from.s)+'</b> آية <b>'+AR(p.from.a)+'</b><br>إلى سورة <b>'+sName(p.to.s)+'</b> آية <b>'+AR(p.to.a)+'</b>'}
function daysBetween(k1,k2){var a=k1.split('-').map(Number),b=k2.split('-').map(Number);return Math.round((Date.UTC(b[0],b[1]-1,b[2])-Date.UTC(a[0],a[1]-1,a[2]))/DAY)}
RENDER.khatma=function(box){
  var K=mk('khatma',null);
  function paint(){
    if(!K){
      box.innerHTML='<div class="mcard"><h3>ابدأ ختمة جديدة</h3><p class="mnote" style="margin-bottom:10px">اختار المدة، وهنقسم لك القرآن على أيام متساوية، وتقرا ورد كل يوم.</p><div class="dayopts" id="kDays">'+[[7,'أسبوع'],[15,'١٥ يوم'],[30,'شهر'],[60,'شهرين'],[90,'٣ شهور']].map(function(x,i){return '<button data-d="'+x[0]+'" class="'+(x[0]===30?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div><div class="btnrow"><button class="btn fill" id="kStart">ابدأ الختمة</button></div></div>';
      var sel=30;
      $('#kDays').onclick=function(e){var b=e.target.closest('button');if(!b)return;sel=parseInt(b.getAttribute('data-d'),10);box.querySelectorAll('#kDays button').forEach(function(x){x.classList.toggle('on',x===b)})};
      $('#kStart').onclick=function(){K={start:keyOf(localDate(0)),days:sel,done:{}};store.set('khatma',K);paint()};
      return;
    }
    var today=keyOf(localDate(0)),idx=Math.min(K.days,Math.max(1,daysBetween(K.start,today)+1)),n=0,first=0;
    for(var i=1;i<=K.days;i++){if(K.done[i])n++;else if(!first&&i<=idx)first=i}
    var finished=n>=K.days;
    var show=first||idx,p=portion(show,K.days);
    var late=first&&first<idx;
    box.innerHTML=
     '<div class="mcard"><div class="mrow"><h3 style="margin:0">'+(finished?'ما شاء الله، أتممت الختمة':(late?'ورد متأخر · اليوم '+AR(first):'ورد اليوم · اليوم '+AR(show)+' من '+AR(K.days)))+'</h3></div>'+
     '<div class="bar" style="margin-top:10px"><i style="width:'+(n/K.days*100).toFixed(1)+'%"></i></div>'+
     (finished?'<p class="mnote">تقبّل الله منك. ابدأ ختمة جديدة لما تحب.</p>':'<p class="portion">'+pText(p)+'</p><div class="btnrow"><button class="btn" id="kOpen">افتح في المصحف</button><button class="btn fill" id="kDone">تم الورد</button></div>')+
     '<p class="mnote" style="margin-top:10px">خلّصت '+AR(n)+' من '+AR(K.days)+' يوم'+(late?' · عليك ورد متأخر':'')+'.</p></div>'+
     '<div class="mcard"><div class="btnrow" style="margin-top:0"><button class="btn" id="kReset">ابدأ ختمة جديدة</button></div></div>';
    if(!finished){
      $('#kOpen').onclick=function(){openReader(p.from.s,p.from.a)};
      $('#kDone').onclick=function(){K.done[show]=1;store.set('khatma',K);vibrate(20);toast('تقبّل الله');paint()};
    }
    $('#kReset').onclick=function(){K=null;store.set('khatma',null);paint()};
  }
  paint();
};

/* ---------- Zakat ---------- */
RENDER.zakat=function(box){
  var Z=mk('zakat',{cash:'',gold:'',price:'',trade:'',debt:''});
  box.innerHTML=
   '<div class="mcard mstack">'+
   [['cash','النقد والمدخرات (بعملتك)'],['gold','الذهب (بالجرام عيار ٢٤ أو ما يعادله)'],['price','سعر جرام الذهب عيار ٢٤ اليوم'],['trade','عروض التجارة (قيمتها)'],['debt','الديون الحالّة عليك']].map(function(f){
     return '<div class="mfield"><label for="z_'+f[0]+'">'+f[1]+'</label><input class="minput" id="z_'+f[0]+'" inputmode="decimal" autocomplete="off" placeholder="٠" value="'+esc(Z[f[0]])+'"></div>';
   }).join('')+'</div>'+
   '<div id="zRes"></div>'+
   '<div class="mcard"><p class="mnote">النصاب = ٨٥ جرام ذهب عيار ٢٤. الزكاة ٢٫٥٪ من الصافي لو بلغ النصاب ومرّ عليه سنة هجرية كاملة. سعر الذهب اللي بتدخله أنت بنفسك. للحالات الخاصة (ذهب الزينة، الأسهم، العقارات) اسأل أهل العلم.</p></div>';
  function calc(){
    ['cash','gold','price','trade','debt'].forEach(function(k){Z[k]=$('#z_'+k).value});
    store.set('zakat',Z);
    var price=num(Z.price),assets=num(Z.cash)+num(Z.gold)*price+num(Z.trade),net=Math.max(0,assets-num(Z.debt)),nisab=85*price,el=$('#zRes');
    if(price<=0){el.innerHTML='<div class="zres no"><p class="mnote" style="margin:0">أدخل سعر جرام الذهب عشان نحسب النصاب.</p></div>';return}
    if(net>=nisab){el.innerHTML='<div class="zres"><div class="mnote">الزكاة المستحقة</div><div class="big">'+fmtN(net*0.025,2)+'</div><p class="mnote" style="margin:6px 0 0">الصافي '+fmtN(net,2)+' · النصاب '+fmtN(nisab,2)+'</p></div>'}
    else{el.innerHTML='<div class="zres no"><div class="big">لا زكاة عليك الآن</div><p class="mnote" style="margin:6px 0 0">الصافي '+fmtN(net,2)+' أقل من النصاب '+fmtN(nisab,2)+'</p></div>'}
  }
  box.querySelectorAll('.minput').forEach(function(i){i.addEventListener('input',calc)});
  calc();
};

/* ---------- Home extras ---------- */
var VERSES=[[2,255],[2,286],[13,28],[94,5],[94,6],[65,3],[65,2],[2,152],[39,53],[3,139],[2,186],[40,60],[2,153],[12,87],[16,128],[93,5],[9,40],[3,173],[51,56],[33,56],[2,201],[3,8],[14,7],[7,56],[6,162],[39,10],[29,69],[20,114],[55,13],[57,4]];
window.__homeExtras=function(){
  if(!cur)return;
  var T=cur.t,tz=cur.tz,ex=$('#timesExtra');
  try{
    var nf=timesFor(dayOffset+1).t.fajr,night=nf-T.maghrib;
    var rows=[['الضحى',new Date(T.sunrise.getTime()+15*60000)],['منتصف الليل',new Date(T.maghrib.getTime()+night/2)],['الثلث الأخير من الليل',new Date(T.maghrib.getTime()+night*2/3)]];
    ex.innerHTML='<div class="hd">أوقات إضافية</div>'+rows.map(function(r){return '<div class="trow minor"><span class="nm">'+r[0]+'</span><span class="tm num">'+fmtTime(r[1],tz)+'</span></div>'}).join('');
    ex.hidden=false;
  }catch(e){ex.hidden=true}
  var h='';
  var rn=ramNow();
  if(rn&&dayOffset===0)h+='<button class="nudge" data-go="ramadan" style="margin-top:12px"><span class="ic">'+IC.ramadan+'</span><span><b>رمضان كريم · اليوم '+AR(rn.day)+'</b><small>السحور حتى '+fmtTime(T.fajr,tz)+' · الإفطار '+fmtTime(T.maghrib,tz)+'</small></span></button>';
  else if(!rn){var rx=ramNext();if(rx&&rx.days<=30)h+='<button class="nudge" data-go="ramadan" style="margin-top:12px"><span class="ic">'+IC.ramadan+'</span><span><b>رمضان بعد '+AR(rx.days)+' يوم</b><small>الإمساكية وما نفعله كل يوم</small></span></button>'}
  if(dayOffset===0&&cur.date.dow===5)h+='<button class="nudge fri" id="friCard"><span class="ic">'+ICON.book+'</span><span><b>يوم الجمعة</b><small>اقرأ سورة الكهف وأكثر من الصلاة على النبي ﷺ</small></span></button>';
  var vi=Math.floor(cur.date.utc.getTime()/DAY)%VERSES.length,v=VERSES[vi],vs=Q.s[v[0]-1];
  if(vs&&vs.v[v[1]-1])h+='<button class="vday" id="vdayCard"><small>آية اليوم</small><p>'+vs.v[v[1]-1]+' <span class="no num" style="font:700 14px Cairo;color:var(--gold)">﴿'+AR(v[1])+'﴾</span></p><em>سورة '+vs.name+'</em></button>';
  h+='<div class="shortcuts">'+[['qibla','القبلة'],['tasbih','المسبحة'],['calendar','التقويم'],['tracker','صلواتي']].map(function(s){return '<button data-go="'+s[0]+'"><span class="ic">'+IC[s[0]]+'</span>'+s[1]+'</button>'}).join('')+'</div>';
  $('#homeExtra').innerHTML=h;
  var f=$('#friCard');if(f)f.onclick=function(){openReader(18,1)};
  var vc=$('#vdayCard');if(vc)vc.onclick=function(){openReader(v[0],v[1])};
  $('#homeExtra').querySelectorAll('[data-go]').forEach(function(b){b.onclick=function(){window.__openMore(b.getAttribute('data-go'))}});
};

/* ---------- Settings additions ---------- */
window.__paintMoreSettings=function(){
  seg('#segHijri',[['-1','يوم أقل'],['0','تلقائي'],['1','يوم أكثر']],String(settings.hijriAdj||0),function(v){settings.hijriAdj=parseInt(v,10);saveSettings();paintSettings();cur=null;if(!$('#v-home').hidden)renderHome()});
  var n=$('#geoNote');
  if(n)n.textContent=settings.geo?'المحفوظ: '+settings.geo.lat.toFixed(3)+'، '+settings.geo.lng.toFixed(3)+'. اختار «موقعي الحالي» من قائمة المدن لاستخدامه.':'لحساب المواقيت والقبلة بدقة لو مدينتك مش في القائمة.';
};
$('#btnGeo').onclick=function(){
  if(!navigator.geolocation){toast('الجهاز ده مش بيدعم تحديد الموقع');return}
  toast('جاري تحديد الموقع…');
  navigator.geolocation.getCurrentPosition(function(p){
    var tz='UTC';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch(e){}
    settings.geo={lat:p.coords.latitude,lng:p.coords.longitude,tz:tz};settings.city='gps';saveSettings();
    dayOffset=0;cur=null;paintSettings();toast('تم تحديد موقعك');
  },function(){toast('تعذّر تحديد الموقع. اختار مدينتك من القائمة')},{timeout:12000,maximumAge:600000});
};

/* ---------- Quran: verse search, bookmarks, ayah bar ---------- */
var qMode='suras',NV=null,searchT=null;
function marks(){return store.get('marks',[])}
function paintMarkCount(){var n=marks().length;$('#qmarkN').textContent=n?AR(n):''}
function trunc(s,n){return s.length>n?s.slice(0,n)+'…':s}
function paintQuran(){
  var panel=$('#qpanel'),suras=$('#suras'),chips=$('#juzchips'),inp=$('#qsearch');
  $('#qmodes').querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-m')===qMode)});
  if(qMode==='suras'){panel.hidden=true;suras.hidden=false;chips.hidden=false;inp.placeholder='ابحث عن سورة بالاسم أو الرقم';return}
  suras.hidden=true;chips.hidden=true;panel.hidden=false;
  if(qMode==='marks'){
    inp.placeholder='العلامات المرجعية';
    var m=marks();
    panel.innerHTML=m.length?m.map(function(x,i){var s=Q.s[x.s-1];return '<button class="vres" data-s="'+x.s+'" data-a="'+x.a+'"><small>سورة '+s.name+' · آية '+AR(x.a)+'</small><p>'+trunc(s.v[x.a-1]||'',140)+'</p></button>'}).join(''):'<div class="empty">مفيش علامات. اضغط على أي آية في المصحف واختار «علامة».</div>';
    return;
  }
  inp.placeholder='اكتب كلمة أو أكثر من الآية';
  runSearch();
}
function runSearch(){
  var panel=$('#qpanel'),q=norm($('#qsearch').value||'');
  if(q.length<2){panel.innerHTML='<div class="empty">اكتب كلمتين على الأقل للبحث في آيات القرآن كله.</div>';return}
  if(!NV){NV=Q.s.map(function(s){return s.v.map(norm)})}
  var words=q.split(/\s+/).filter(Boolean),res=[];
  for(var i=0;i<NV.length&&res.length<60;i++){
    for(var j=0;j<NV[i].length&&res.length<60;j++){
      var t=NV[i][j],ok=true;
      for(var k=0;k<words.length;k++){if(t.indexOf(words[k])<0){ok=false;break}}
      if(ok)res.push([i,j]);
    }
  }
  panel.innerHTML=res.length?'<p class="mnote" style="margin-top:10px">'+AR(res.length)+(res.length>=60?'+':'')+' نتيجة</p>'+res.map(function(r){var s=Q.s[r[0]];return '<button class="vres" data-s="'+s.n+'" data-a="'+(r[1]+1)+'"><small>سورة '+s.name+' · آية '+AR(r[1]+1)+'</small><p>'+trunc(s.v[r[1]],140)+'</p></button>'}).join(''):'<div class="empty">مفيش نتيجة لـ «'+esc($('#qsearch').value)+'»</div>';
}
$('#qmodes').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;qMode=b.getAttribute('data-m');paintQuran();if(qMode!=='suras'&&qMode!=='marks')$('#qsearch').focus()});
$('#qsearch').addEventListener('input',function(){if(qMode==='verses'){clearTimeout(searchT);searchT=setTimeout(runSearch,250)}});
$('#qpanel').addEventListener('click',function(e){var b=e.target.closest('.vres');if(b)openReader(parseInt(b.getAttribute('data-s'),10),parseInt(b.getAttribute('data-a'),10))});

var selAyah=null;
function hasMark(s,a){return marks().some(function(x){return x.s===s&&x.a===a})}
window.__ayahSelected=function(s,a){
  selAyah={s:s,a:a};
  $('#ayahTitle').textContent='سورة '+Q.s[s-1].name+' · آية '+AR(a);
  $('#abMark').textContent=hasMark(s,a)?'إزالة العلامة':'علامة';
  $('#ayahbar').hidden=false;
};
window.__ayahClear=function(){selAyah=null;$('#ayahbar').hidden=true;document.querySelectorAll('.ay.sel').forEach(function(x){x.classList.remove('sel')})};
$('#abClose').onclick=function(){window.__ayahClear()};
$('#abMark').onclick=function(){
  if(!selAyah)return;
  var m=marks();
  if(hasMark(selAyah.s,selAyah.a)){m=m.filter(function(x){return !(x.s===selAyah.s&&x.a===selAyah.a)});toast('تم حذف العلامة')}
  else{m.unshift({s:selAyah.s,a:selAyah.a});toast('تم حفظ العلامة')}
  store.set('marks',m);paintMarkCount();$('#abMark').textContent=hasMark(selAyah.s,selAyah.a)?'إزالة العلامة':'علامة';
};
$('#abCopy').onclick=function(){
  if(!selAyah)return;
  var t=Q.s[selAyah.s-1].v[selAyah.a-1]+' ﴿'+AR(selAyah.a)+'﴾ [سورة '+Q.s[selAyah.s-1].name+']';
  function fallback(){
    var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
    var ok=false;try{ok=document.execCommand('copy')}catch(e){}
    document.body.removeChild(ta);toast(ok?'تم نسخ الآية':'تعذّر النسخ');
  }
  try{navigator.clipboard.writeText(t).then(function(){toast('تم نسخ الآية')},fallback)}catch(e){fallback()}
};

/* ===== extra tools: fasting, qada, guide, hajj, hadith, mosques, Quran audio ===== */
IC.fasting=svg('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>');
IC.qada=svg('<path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="9"/>');
IC.wudu=svg('<path d="M12 3s6 6.2 6 10.5A6 6 0 016 13.5C6 9.2 12 3 12 3z"/>');
IC.salah=svg('<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>');
IC._h=svg('<rect x="6" y="8" width="12" height="12" rx="1.5"/><path d="M6 12h12M10 8v-2h4v2"/>');
IC.hadith=svg('<path d="M4 5h7a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-7"/><path d="M20 5v13h-7"/>');
IC.mosque=svg('<path d="M12 3c1.5 1.5 3.5 3 3.5 5.5a3.5 3.5 0 01-7 0C8.5 6 10.5 4.5 12 3zM5 21v-8h14v8M3 21h18M9 21v-4h6v4"/>');
TILES.splice(TILES.length,0,
  ['fasting','الصيام','سنن الصيام وإمساكية اليوم'],
  ['qada','قضاء الصلوات','عدّاد الصلوات الفائتة'],
  ['ramadan','رمضان','الإمساكية وما نفعله كل يوم'],
  ['wudu','كيف أتوضأ','خطوات الوضوء بالرسم'],
  ['salah','كيف أصلي','خطوات الصلاة بالرسم'],
  ['hadith','أحاديث نبوية','أحاديث مختارة بمصدرها'],
  ['mosque','مساجد قريبة','افتح الخريطة حواليك']
);
/* last tile spans full width only when the count is odd */
paintMoreHome=function(){
  $('#mgrid').innerHTML=TILES.map(function(t,i){
    return '<button class="acard'+(i===TILES.length-1&&TILES.length%2?' wide':'')+'" data-m="'+t[0]+'"><span class="ic">'+IC[t[0]]+'</span><b>'+t[1]+'</b><small>'+t[2]+'</small></button>';
  }).join('');
};

/* ---------- Fasting ---------- */
RENDER.fasting=function(box){
  var D=mk('fasts',{});
  function nextWhite(){for(var i=0;i<40;i++){var d=localDate(i),h=hij(d.utc);if(h.d>=13&&h.d<=15)return {i:i,h:h,d:d}}}
  function nextDow(w){for(var i=0;i<8;i++){var d=localDate(i);if(d.dow===w)return i}}
  function lbl(i){return i===0?'النهاردة':i===1?'بكرة':'بعد '+AR(i)+' أيام'}
  function paint(){
    var tk=keyOf(localDate(0)),h=hij(localDate(0).utc),on=!!D[tk],n=0,yr=0;
    Object.keys(D).forEach(function(k){n++});
    var t=cur&&cur.t,tz=cur&&cur.tz,im='';
    if(t){im='<div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div><b class="num">'+fmtTime(t.fajr,tz)+'</b><span>الإمساك (الفجر)</span></div><div><b class="num">'+fmtTime(t.maghrib,tz)+'</b><span>الإفطار (المغرب)</span></div></div>'}
    var nw=nextWhite(),mon=nextDow(1),thu=nextDow(4);
    var FP=window.__fastPlan,fp0=FP&&FP.get(0),fp1=FP&&FP.get(1),fpi=FP?FP.info(fp1&&!fp0?1:0):{suhoor:'',iftar:''};
    var occ=OCC[h.m+'-'+h.d];
    box.innerHTML=
     '<div class="mcard"><div class="mrow"><h3 style="margin:0">صيام اليوم</h3><span class="mnote">'+AR(h.d)+' '+HM[h.m-1]+'</span></div>'+im+
     '<div class="btnrow"><button class="btn'+(on?'':' primary')+'" id="fToggle">'+(on?'تم تسجيل الصيام ✓':'أنا صائم اليوم')+'</button></div>'+(occ?'<p class="mnote" style="margin-top:8px">'+occ+'</p>':'')+'</div>'+
     '<div class="mcard"><h3>عايز تصوم؟</h3><p class="mnote">دوس على اليوم اللي هتصومه وهنبعتلك تنبيه السحور وتنبيه الإفطار.</p><div class="btnrow"><button class="btn'+(fp0?'':' primary')+'" id="fPlanT">'+(fp0?'تم ✓ هتصوم النهارده':'عايز أصوم النهارده')+'</button><button class="btn'+(fp1?'':' primary')+'" id="fPlanN">'+(fp1?'تم ✓ هتصوم بكرة':'عايز أصوم بكرة')+'</button></div>'+((fp0||fp1)?'<p class="mnote" style="margin-top:8px">السحور '+fpi.suhoor+' · الإفطار '+fpi.iftar+(fp0&&!fp1?' (النهارده)':fp1&&!fp0?' (بكرة)':'')+'</p>':'')+'</div>'+
     '<div class="mcard"><h3>الصيام القادم المستحب</h3><div class="occlist">'+
      '<div class="o"><i>اثنين</i><span>الاثنين<small>'+lbl(mon)+'</small></span></div>'+
      '<div class="o"><i>خميس</i><span>الخميس<small>'+lbl(thu)+'</small></span></div>'+
      (nw?'<div class="o"><i>'+AR(nw.h.d)+'</i><span>الأيام البيض (١٣ و١٤ و١٥)<small>'+lbl(nw.i)+' · '+HM[nw.h.m-1]+'</small></span></div>':'')+
     '</div></div>'+
     '<div class="mcard"><div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div><b>'+AR(n)+'</b><span>أيام صيام مسجّلة</span></div><div><b>'+AR(Object.keys(D).filter(function(k){return k.slice(0,4)===String(localDate(0).y)}).length)+'</b><span>في السنة دي</span></div></div></div>'+
     '<div class="mcard"><h3>أيام يُستحب صيامها</h3><p class="mnote">الاثنين والخميس · الأيام البيض من كل شهر هجري · ستة من شوال · يوم عرفة لغير الحاج · تاسوعاء وعاشوراء · أكثر من الصيام في شعبان.<br>ويحرم الصيام في يومي العيدين.</p></div>';
    $('#fPlanT').onclick=function(){if(window.__fastPlan){__fastPlan.toggle(0);paint()}};$('#fPlanN').onclick=function(){if(window.__fastPlan){__fastPlan.toggle(1);paint()}};
    $('#fToggle').onclick=function(){if(D[tk])delete D[tk];else D[tk]=1;store.set('fasts',D);vibrate(10);paint()};
  }
  paint();
};

/* ---------- Qada ---------- */
RENDER.qada=function(box){
  var D=mk('qada',{fajr:0,dhuhr:0,asr:0,maghrib:0,isha:0,witr:0});
  var L=[['fajr','الفجر'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء'],['witr','الوتر']];
  function paint(){
    var tot=0;L.forEach(function(l){tot+=D[l[0]]||0});
    box.innerHTML='<div class="mcard"><div class="mrow"><h3 style="margin:0">الصلوات الفائتة</h3><span class="mnote">الإجمالي '+AR(tot)+'</span></div><div class="trk" style="margin-top:6px">'+
     L.map(function(l){return '<div class="r"><b>'+l[1]+'</b><button class="btn sm" data-k="'+l[0]+'" data-d="-1" aria-label="نقص">−</button><b style="flex:none;min-width:44px;text-align:center" class="num">'+AR(D[l[0]]||0)+'</b><button class="btn sm primary" data-k="'+l[0]+'" data-d="1" aria-label="زيادة">+</button></div>'}).join('')+
     '</div></div><div class="mcard"><p class="mnote">اكتب عدد الصلوات اللي عليك قضاؤها، وكل ما تقضي صلاة اضغط (−). المحفوظ على جهازك فقط.</p><div class="btnrow"><button class="btn" id="qReset">تصفير الكل</button></div></div>';
    box.querySelectorAll('[data-k]').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-k');D[k]=Math.max(0,(D[k]||0)+parseInt(b.getAttribute('data-d'),10));store.set('qada',D);vibrate(8);paint()}});
    $('#qReset').onclick=function(){if(confirm('تصفير كل العدّادات؟')){L.forEach(function(l){D[l[0]]=0});store.set('qada',D);paint()}};
  }
  paint();
};

/* ---------- Wudu & prayer guide (drawn figures) ---------- */
function wfig(k){
  var C='var(--ink)',H='var(--brand)',dr=function(x,y){return '<path d="M'+x+' '+y+'c-3 4-5 6-5 9a5 5 0 0010 0c0-3-2-5-5-9z" fill="#3b9ed8" stroke="none"/>'};
  var face='<circle cx="50" cy="52" r="28" stroke="'+(k==='face'?H:C)+'" fill="none"/><circle cx="40" cy="46" r="2.4" fill="'+C+'" stroke="none"/><circle cx="60" cy="46" r="2.4" fill="'+C+'" stroke="none"/>';
  var P={
   hands:'<rect x="18" y="52" width="26" height="30" rx="12" transform="rotate(-14 31 67)" stroke="'+H+'"/><rect x="56" y="52" width="26" height="30" rx="12" transform="rotate(14 69 67)" stroke="'+H+'"/>'+dr(50,14)+dr(36,28)+dr(64,28),
   mouth:face+'<path d="M50 52v8" stroke="'+H+'"/><path d="M40 68q10 8 20 0" stroke="'+H+'"/>'+dr(14,20)+dr(80,22),
   face:face+'<path d="M42 66q8 6 16 0" stroke="'+C+'"/>'+dr(12,36)+dr(84,40)+dr(48,6),
   arms:'<path d="M18 80L62 44" stroke="'+H+'" stroke-width="10"/><circle cx="20" cy="79" r="7" stroke="'+C+'" fill="none"/><path d="M62 44l14-14M62 44l16-4M62 44l10 12" stroke="'+C+'"/>'+dr(46,10)+dr(76,66),
   head:face+'<path d="M26 40q24-30 48 0" stroke="'+H+'" stroke-width="6"/><path d="M22 50q-6 4 0 10M78 50q6 4 0 10" stroke="'+H+'"/>',
   feet:'<path d="M20 90c-4-18 0-40 14-44 10-2 14 8 10 22l-2 22z" stroke="'+H+'"/><path d="M56 90c-4-18 0-40 14-44 10-2 14 8 10 22l-2 22z" stroke="'+H+'"/>'+dr(30,10)+dr(66,10)
  };
  return P[k]||'';
}
function fig(pose,hl){
  if(pose.indexOf('w:')===0){return '<svg viewBox="0 0 100 100" width="132" height="132" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+wfig(pose.slice(2))+'</svg>'}
  var C='var(--ink)',H='var(--brand)',g=function(k){return hl&&hl.indexOf(k)>-1?H:C};
  var P={
   stand:'<circle cx="50" cy="16" r="8" stroke="'+g('head')+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-12 20M50 30l12 20" stroke="'+g('arms')+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+g('feet')+'"/>',
   hands:'<circle cx="50" cy="16" r="8" stroke="'+C+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-14 12 9 2M50 30l14 12-9 2" stroke="'+H+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+C+'"/>',
   raise:'<circle cx="50" cy="16" r="8" stroke="'+C+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-16-8M50 30l16-8" stroke="'+H+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+C+'"/>',
   ruku:'<circle cx="22" cy="42" r="7" stroke="'+C+'" fill="none"/><path d="M29 44h38" stroke="'+C+'"/><path d="M38 45l24 24" stroke="'+H+'"/><path d="M67 44v50" stroke="'+C+'"/>',
   sujud:'<circle cx="20" cy="84" r="7" stroke="'+H+'" fill="none"/><path d="M27 82l36-24" stroke="'+C+'"/><path d="M63 58l12 30l18 4" stroke="'+C+'"/><path d="M34 77l-8 17" stroke="'+C+'"/>',
   sit:'<circle cx="46" cy="28" r="8" stroke="'+C+'" fill="none"/><path d="M46 36v34" stroke="'+C+'"/><path d="M46 44l16 14" stroke="'+H+'"/><path d="M46 70l22 4M68 74l-20 14" stroke="'+C+'"/>',
   salam:'<circle cx="46" cy="28" r="8" stroke="'+H+'" fill="none"/><path d="M60 24l8 0M62 30l9 3" stroke="'+H+'"/><path d="M46 36v34" stroke="'+C+'"/><path d="M46 44l16 14" stroke="'+C+'"/><path d="M46 70l22 4M68 74l-20 14" stroke="'+C+'"/>'
  };
  return '<svg viewBox="0 0 100 100" width="132" height="132" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 96h88" stroke="var(--line)" stroke-width="3"/>'+(P[pose]||P.stand)+'</svg>';
}
var WUDU=[
 ['stand','','النية والتسمية','النية في القلب، ثم تقول: «بسم الله».'],
 ['w:hands','','غسل الكفين','غسل الكفين ثلاث مرات.'],
 ['w:mouth','','المضمضة والاستنشاق','ثلاث مرات: يدخل الماء الفم والأنف ثم يُخرجه.'],
 ['w:face','','غسل الوجه','ثلاثًا، من منابت الشعر إلى الذقن ومن الأذن إلى الأذن.'],
 ['w:arms','','غسل اليدين','مع المرفقين ثلاثًا، اليمنى ثم اليسرى.'],
 ['w:head','','مسح الرأس','مرة واحدة بالرأس كله، ومعه مسح الأذنين.'],
 ['w:feet','','غسل الرجلين','مع الكعبين ثلاثًا، اليمنى ثم اليسرى.'],
 ['raise','','الذكر بعد الوضوء','«أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله».']
];
var SALAH=[
 ['stand','','النية واستقبال القبلة','تنوي الصلاة في قلبك وتقف متجهًا للقبلة.'],
 ['raise','','تكبيرة الإحرام','ترفع يديك حذو كتفيك وتقول «الله أكبر».'],
 ['hands','','القيام','تضع اليمنى على اليسرى على صدرك، وتقرأ دعاء الاستفتاح ثم الفاتحة ثم ما تيسّر من القرآن.'],
 ['ruku','','الركوع','تقول «الله أكبر» وتنحني واضعًا يديك على ركبتيك، وتقول «سبحان ربي العظيم» ثلاثًا.'],
 ['stand','','الرفع من الركوع','تقول «سمع الله لمن حمده، ربنا ولك الحمد».'],
 ['sujud','','السجود','تقول «الله أكبر» وتسجد على سبعة أعضاء (الجبهة والأنف والكفين والركبتين وأطراف القدمين)، وتقول «سبحان ربي الأعلى» ثلاثًا.'],
 ['sit','','الجلوس بين السجدتين','تجلس مطمئنًا وتقول «رب اغفر لي»، ثم تسجد السجدة الثانية.'],
 ['sit','','التشهد','بعد الركعة الثانية تجلس للتشهد: «التحيات لله والصلوات والطيبات، السلام عليك أيها النبي ورحمة الله وبركاته، السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله وأشهد أن محمدًا عبده ورسوله»، وفي الأخيرة تضيف الصلاة الإبراهيمية.'],
 ['salam','','التسليم','تسلّم عن يمينك ثم عن يسارك: «السلام عليكم ورحمة الله».']
];
var RAK=[['الفجر','٢'],['الظهر','٤'],['العصر','٤'],['المغرب','٣'],['العشاء','٤'],['الجمعة','٢']];
var RK=[['١','الركعة الأولى: تكبيرة الإحرام، الاستفتاح، الفاتحة وسورة، ركوع، رفع، سجدتان.'],['٢','الركعة الثانية: قيام، الفاتحة وسورة، ركوع، رفع، سجدتان، ثم التشهد (الأخير في الثنائية مع التسليم، والأول في المغرب والرباعية).'],['٣','الركعة الثالثة (المغرب والرباعية): قيام، الفاتحة فقط، ركوع، رفع، سجدتان. وفي المغرب تتشهد بعدها وتسلّم.'],['٤','الركعة الرابعة (الظهر والعصر والعشاء): الفاتحة فقط، ركوع، رفع، سجدتان، ثم التشهد الأخير والصلاة الإبراهيمية والتسليم.']];
var SUNAN=['ركعتان قبل الفجر','أربع ركعات قبل الظهر وركعتان بعدها','ركعتان بعد المغرب','ركعتان بعد العشاء','ثم الوتر بعد العشاء، والضحى من ركعتين فأكثر'];
function stepCard(i,pose,hl,title,text){
  return '<div class="mcard stepc"><div class="fig"><span class="nb">'+AR(i)+'</span>'+fig(pose,hl)+'</div><div class="stx"><b>'+title+'</b><p>'+text+'</p></div></div>';
}
RENDER.wudu=function(box){
  box.innerHTML=WUDU.map(function(w,i){return stepCard(i+1,w[0],w[1],w[2],w[3])}).join('')+
   '<div class="mcard"><p class="mnote">الأعضاء المظلّلة بالأخضر في الرسم هي موضع الغسل أو المسح في كل خطوة. من نواقض الوضوء: ما خرج من السبيلين، والنوم المستغرق، وزوال العقل.</p></div>';
};
RENDER.salah=function(box){
  box.innerHTML=SALAH.map(function(s,i){return stepCard(i+1,s[0],s[1],s[2],s[3])}).join('')+
   '<div class="mcard"><h3>ترتيب الركعات</h3><div class="occlist">'+RK.map(function(r){return '<div class="o"><i>'+r[0]+'</i><span>'+r[1]+'</span></div>'}).join('')+'</div></div>'+
   '<div class="mcard"><h3>عدد الركعات</h3><div class="kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+RAK.map(function(r){return '<div><b>'+r[1]+'</b><span>'+r[0]+'</span></div>'}).join('')+'</div></div>'+
   '<div class="mcard"><h3>السنن الرواتب (١٢ ركعة)</h3><ul style="margin:0;padding-inline-start:20px;line-height:2">'+SUNAN.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div>';
};

/* ---------- Hadith ---------- */
var HADITH=[
 ['إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.','متفق عليه'],
 ['بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وحج البيت، وصوم رمضان.','متفق عليه'],
 ['من أحدث في أمرنا هذا ما ليس منه فهو رد.','متفق عليه'],
 ['لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.','متفق عليه'],
 ['من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت.','متفق عليه'],
 ['الدين النصيحة.','رواه مسلم'],
 ['لا تغضب.','رواه البخاري'],
 ['إن الله كتب الإحسان على كل شيء.','رواه مسلم'],
 ['دع ما يريبك إلى ما لا يريبك.','رواه الترمذي والنسائي'],
 ['من حسن إسلام المرء تركه ما لا يعنيه.','رواه الترمذي'],
 ['اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن.','رواه الترمذي'],
 ['الطهور شطر الإيمان.','رواه مسلم'],
 ['الكلمة الطيبة صدقة.','متفق عليه'],
 ['تبسمك في وجه أخيك صدقة.','رواه الترمذي'],
 ['خيركم من تعلّم القرآن وعلّمه.','رواه البخاري'],
 ['المسلم من سلم المسلمون من لسانه ويده.','متفق عليه'],
 ['أحب الأعمال إلى الله أدومها وإن قلّ.','متفق عليه'],
 ['كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم.','متفق عليه']
];
RENDER.hadith=function(box){
  var i=Math.floor(localDate(0).utc.getTime()/DAY)%HADITH.length,h=HADITH[i];
  box.innerHTML='<div class="nday"><small>حديث اليوم</small><p style="font-size:19px;line-height:2;margin:6px 0">'+h[0]+'</p><small>'+h[1]+'</small></div>'+
   '<div class="mstack">'+HADITH.map(function(x,j){return '<div class="mcard"><p style="margin:0;line-height:2;font-size:16px">'+AR(j+1)+'. '+x[0]+'</p><p class="mnote" style="margin:4px 0 0">'+x[1]+'</p></div>'}).join('')+'</div>';
};

/* ---------- Nearby mosques ---------- */
RENDER.mosque=function(box){
  function url(){var c=cityById(settings.city);return 'https://www.google.com/maps/search/'+encodeURIComponent('مسجد')+'/@'+c[3]+','+c[4]+',15z'}
  box.innerHTML='<div class="mcard"><h3>أقرب مسجد</h3><p class="mnote">هيفتح الخريطة على مدينتك الحالية ('+esc(cityById(settings.city)[1])+'). لدقة أعلى فعّل «موقعي الحالي» من الإعدادات، أو اتحرك على الخريطة بإيدك.</p><div class="btnrow"><a class="btn primary" id="mapGo" target="_blank" rel="noopener" style="display:grid;place-items:center;text-decoration:none">افتح الخريطة</a></div></div>';
  $('#mapGo').href=url();
};
/* home shortcut row stays at four tiles; extra tiles live in the More tab */

/* ---------- Quran audio (streams from everyayah.com, needs internet) ---------- */
var RECS=[['Alafasy_128kbps','العفاسي'],['Husary_128kbps','الحصري'],['Minshawy_Murattal_128kbps','المنشاوي'],['Abdul_Basit_Murattal_192kbps','عبد الباسط']];
var recI=Math.max(0,RECS.map(function(r){return r[0]}).indexOf(store.get('reciter','Alafasy_128kbps')));
var qa=new Audio(),qPlaying=false,qS=0,qA=0;qa.preload='none';
function p3(n){return ('00'+n).slice(-3)}
function qaStop(){qPlaying=false;try{qa.pause()}catch(e){}$('#abPlay').textContent='استماع'}
function qaGo(s,a){
  qS=s;qA=a;qPlaying=true;
  qa.src='https://everyayah.com/data/'+RECS[recI][0]+'/'+p3(s)+p3(a)+'.mp3';
  var pr=qa.play();if(pr&&pr.catch)pr.catch(function(){qaStop();toast('تعذّر تشغيل الصوت، تأكد من الإنترنت')});
  $('#abPlay').textContent='إيقاف';
  document.querySelectorAll('.ay.sel').forEach(function(x){x.classList.remove('sel')});
  var el=document.querySelector('.ay[data-a="'+a+'"]');if(el){el.classList.add('sel');try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
  $('#ayahTitle').textContent='سورة '+Q.s[s-1].name+' · آية '+AR(a)+' · '+RECS[recI][1];
  selAyah={s:s,a:a};
}
qa.addEventListener('ended',function(){if(!qPlaying)return;if(qA<Q.s[qS-1].v.length)qaGo(qS,qA+1);else{qaStop();toast('انتهت السورة')}});
qa.addEventListener('error',function(){if(qPlaying){qaStop();toast('تعذّر تحميل الصوت، تأكد من الإنترنت')}});
var pb=document.createElement('button');pb.id='abPlay';pb.textContent='استماع';
var rb=document.createElement('button');rb.id='abRec';rb.textContent='🎙';rb.setAttribute('aria-label','القارئ');rb.style.paddingInline='10px';
$('#ayahbar').insertBefore(rb,$('#abMark'));$('#ayahbar').insertBefore(pb,rb);
pb.onclick=function(){if(qPlaying){qaStop();return}if(selAyah)qaGo(selAyah.s,selAyah.a)};
rb.onclick=function(){recI=(recI+1)%RECS.length;store.set('reciter',RECS[recI][0]);toast('القارئ: '+RECS[recI][1]);if(qPlaying)qaGo(qS,qA)};
window.__qaGo=qaGo;window.__qaStop=qaStop;window.__qaPlaying=function(){return qPlaying};
var _clr=window.__ayahClear;window.__ayahClear=function(){qaStop();_clr()};
$('#abClose').onclick=function(){window.__ayahClear()};

/* ===== Ramadan ===== */
IC.ramadan=svg('<path d="M12 3v2M7 8h10l-1 11H8z"/><path d="M9 21h6M10 5h4"/>');
var RTIPS=['أفطر على تمر أو رطب أو ماء، وادعُ عند الإفطار فإن للصائم دعوة لا تُردّ.','تسحّر ولو بتمرة أو شربة ماء: «تسحّروا فإن في السحور بركة».','اقرأ جزءًا من القرآن اليوم، وحاول تختم في رمضان.','تصدّق اليوم بأي مبلغ ولو صغير، أو ساعد جارك أو قريبك.','أفطِر صائمًا ولو بتمرة أو كوب ماء.','أكثر من الاستغفار: «أستغفر الله وأتوب إليه».','صلّ التراويح ولو بعض الركعات مع الإمام.','صِل رحمك بمكالمة أو زيارة.','احفظ لسانك وعينيك: الصيام صيام الجوارح كلها.','اقرأ أذكار الصباح والمساء ولا تتركها.','تعلّم دعاءً جديدًا واحفظه اليوم.','أكثر من الصلاة على النبي ﷺ.','تجنّب الإسراف في الأكل والشراب عند الإفطار.','اقرأ تفسير آيات من الجزء اللي بتقرأه.','صلّ ركعتين في وقت الضحى.','سامح من أخطأ في حقك واصفح.','اقرأ سورة الكهف إن كان يوم جمعة.','أكثر من التسبيح والتهليل والتكبير.','اطلب من الله حاجتك قبل الإفطار فهو وقت إجابة.','ساهم في سلّة أو وجبة إفطار لمحتاج.','تحرّى ليلة القدر في الليالي الوتر من العشر الأواخر.','قم ولو بركعتين في آخر الليل ثم ادعُ.','اقرأ ورد القرآن بتدبّر وتأمّل المعنى.','أكثر من دعاء «اللهم إنك عفو تحب العفو فاعف عني».','اعتكف ساعة في المسجد أو بيتك مع الذكر والقرآن.','راجع ما حفظت من القرآن.','أخرج زكاة الفطر قبل العيد (ويُستحب قبل صلاة العيد).','أكثر من الدعاء لأهلك وللمسلمين.','أتمّ ختمتك أو اقرأ ما تبقّى لك.','اشكر الله على نعمة الصيام وأكثر من حمده.','استعد للعيد: أخرج زكاة الفطر، وتهيّأ لصلاة العيد وصلة الرحم.'];
var RDUA_IFTAR='«ذهب الظمأ وابتلّت العروق وثبت الأجر إن شاء الله»';
function ramNow(){var d=localDate(0),h=hij(d.utc);return h.m===9?{day:h.d,date:d}:null}
function ramNext(){for(var i=0;i<400;i++){var d=localDate(i),h=hij(d.utc);if(h.m===9&&h.d===1)return {days:i,date:d}}return null}
window.__ramItems=function(t,items,now){
  if(!settings.ramNotif)return;
  var h=hij(t.date.utc);if(h.m!==9)return;
  var bid=(t.date.y*10000+t.date.m*100+t.date.d)*10;
  var sf=t.t.fajr.getTime()-settings.suhoor*60000;
  if(sf>now+2000)items.push({id:bid+1100000000,t:sf,k:'rem',n:'حان وقت السحور',c:'تسحّروا فإن في السحور بركة. الفجر الساعة '+fmtTime(t.t.fajr,t.tz)+' (بعد '+AR(settings.suhoor)+' دقيقة).',tm:''});
  var im=t.t.maghrib.getTime();
  if(im>now+2000)items.push({id:bid+1200000000,t:im,k:'rem',n:'حان موعد الإفطار، تقبّل الله صيامك',c:'ادعُ بدعاء الإفطار: '+RDUA_IFTAR,tm:''});
};
/* web: notifications while the page is open */
var ramFired={};
setInterval(function(){
  try{
    if(NATIVE||!settings.ramNotif||!('Notification' in window)||Notification.permission!=='granted')return;
    var t=timesFor(0),h=hij(t.date.utc);if(h.m!==9)return;var now=Date.now(),k=keyOf(t.date);
    [[t.t.fajr.getTime()-settings.suhoor*60000,'s','حان وقت السحور','تسحّروا فإن في السحور بركة.'],[t.t.maghrib.getTime(),'i','حان موعد الإفطار','ادعُ: '+RDUA_IFTAR]].forEach(function(x){
      var id=k+x[1];if(now-x[0]>=0&&now-x[0]<90000&&!ramFired[id]){ramFired[id]=1;try{new Notification(x[2],{body:x[3],icon:'icon-192.png'})}catch(e){}toast(x[2])}
    });
  }catch(e){}
},5000);
RENDER.ramadan=function(box){
  var R=ramNow(),N=ramNext(),K=mk('ram',{}),tk=keyOf(localDate(0));
  function paint(){
    var h='';
    if(R){
      var tip=RTIPS[(R.day-1)%RTIPS.length],last=R.day>=21,tt=(cur&&cur.t)||timesFor(0).t,tz=(cur&&cur.tz)||timesFor(0).tz;
      var td=K[tk]||{};
      var items=[['fast','صيام اليوم'],['taraweeh','صلاة التراويح'],['quran','ورد القرآن'],['sadaqa','صدقة اليوم'],['dhikr','أذكار واستغفار']];
      if(last)items.push(['qadr','قيام الليل وتحرّي ليلة القدر']);
      h+='<div class="nextocc"><small>رمضان كريم</small><b>اليوم '+AR(R.day)+' من رمضان</b><small>'+(30-R.day>0?'باقي '+AR(30-R.day)+' يوم':'آخر يوم')+'</small></div>'+
        '<div class="mcard"><div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div><b class="num">'+fmtTime(tt.fajr,tz)+'</b><span>السحور حتى الفجر</span></div><div><b class="num">'+fmtTime(tt.maghrib,tz)+'</b><span>الإفطار (المغرب)</span></div></div></div>'+
        '<div class="mcard"><h3>ما نفعله اليوم</h3><div class="trk">'+items.map(function(x){return '<button class="r'+(td[x[0]]?' on':'')+'" data-k="'+x[0]+'"><span class="box">'+ICON.check+'</span><b>'+x[1]+'</b></button>'}).join('')+'</div></div>'+
        '<div class="mcard"><h3>توصية اليوم</h3><p style="margin:0;line-height:2">'+tip+'</p></div>'+
        '<div class="mcard"><h3>دعاء الإفطار</h3><p style="margin:0;line-height:2;font-size:17px">'+RDUA_IFTAR+'</p></div>'+
        (last?'<div class="mcard"><h3>العشر الأواخر</h3><p style="margin:0;line-height:2">تحرَّ ليلة القدر في الليالي الوتر. ومن الدعاء فيها: «اللهم إنك عفو تحب العفو فاعف عني».</p></div>':'');
    }else if(N){
      h+='<div class="nextocc"><small>رمضان القادم</small><b>بعد '+AR(N.days)+' يوم</b><small>جهّز نفسك بالقرآن والذكر وقيام الليل</small></div>';
    }
    h+='<div class="mcard"><h3>الإمساكية</h3><div id="imsak"></div></div>'+
      '<div class="mcard"><h3>ما نفعله في رمضان</h3><ul style="margin:0;padding-inline-start:20px;line-height:2"><li>صيام النهار والتسحّر قبل الفجر.</li><li>الإفطار على تمر أو ماء مع الدعاء.</li><li>صلاة التراويح وقيام الليل.</li><li>ختمة القرآن، ولو جزء كل يوم.</li><li>الصدقة وإفطار الصائم وصلة الرحم.</li><li>تحرّي ليلة القدر في العشر الأواخر.</li><li>زكاة الفطر قبل العيد.</li></ul><p class="mnote" style="margin-top:8px">يوصلك تنبيه السحور وتنبيه الإفطار في رمضان من الإعدادات.</p></div>';
    box.innerHTML=h;
    box.querySelectorAll('.trk .r').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-k');K[tk]=K[tk]||{};K[tk][k]=K[tk][k]?0:1;var ks=Object.keys(K).sort();while(ks.length>60)delete K[ks.shift()];store.set('ram',K);vibrate(10);paint()}});
    // imsakiyah: the 30 days of Ramadan (or the next 30 days outside Ramadan)
    var start=R?-(R.day-1):(N?N.days:0),rows='';
    for(var i=0;i<30;i++){
      try{var tm=timesFor(start+i),d=localDate(start+i),hh=hij(d.utc);
        rows+='<div class="trow'+(R&&i===R.day-1?'':' minor')+'" style="'+(R&&i===R.day-1?'background:var(--soft);border-radius:10px':'')+'"><span class="nm">'+AR(i+1)+'</span><span class="tm num">'+fmtTime(tm.t.fajr,tm.tz)+' &nbsp;|&nbsp; '+fmtTime(tm.t.maghrib,tm.tz)+'</span></div>'}catch(e){}
    }
    $('#imsak').innerHTML='<div class="mnote" style="margin-bottom:6px">اليوم · الفجر | المغرب</div>'+rows;
  }
  paint();
};

/* ---------- First launch (Android): ask once to enable the adhan permissions ---------- */
var setupSteps=['notif','exact','battery','full'],setupI=0,setupOn=false;
function setupNext(){
  var st=nativeStatus();if(!st){setupOn=false;return}
  while(setupI<setupSteps.length&&st[setupSteps[setupI]])setupI++;
  if(setupI>=setupSteps.length){setupOn=false;toast('تم تفعيل الأذان بنجاح');paintNativeStatus();return}
  var k=setupSteps[setupI];setupI++;
  try{({notif:NATIVE.requestNotifications,exact:NATIVE.requestExact,battery:NATIVE.requestBattery,full:NATIVE.requestFullScreen})[k].call(NATIVE)}catch(e){setupOn=false}
}
var prevResume=window.__resume;
window.__resume=function(){if(prevResume)prevResume();if(setupOn)setTimeout(setupNext,700)};
function askPerms(){
  var st=nativeStatus();if(!st||(st.notif&&st.exact&&st.battery&&st.full))return;
  var o=document.createElement('div');o.className='permask';
  o.innerHTML='<div class="box" role="dialog" aria-modal="true"><h3>تشغيل الأذان والموبايل مقفول؟</h3><p>عشان الأذان يشتغل والتطبيق مقفول، هنفعّل كام صلاحية: الإشعارات، والمنبّه الدقيق، واستثناء البطارية (هتظهر نافذة صغيرة: اضغط «السماح»)، والعرض على شاشة القفل. هتظهرلك نوافذ واحدة ورا التانية، وافق عليها وارجع للتطبيق.</p><div class="btnrow"><button class="btn primary" id="paYes">تفعيل الآن</button><button class="btn" id="paNo">لاحقًا</button></div></div>';
  document.body.appendChild(o);
  $('#paNo',o).onclick=function(){document.body.removeChild(o)};
  $('#paYes',o).onclick=function(){document.body.removeChild(o);setupOn=true;setupI=0;setupNext()};
}
window.__permStart=function(){if(NATIVE&&!store.get('permAsked',0)){store.set('permAsked',1);setTimeout(askPerms,900)}};

window.__appData={WUDU:WUDU,SALAH:SALAH,RAK:RAK,RK:RK,SUNAN:SUNAN,HADITH:HADITH,NAMES:NAMES,HM:HM,OCC:OCC,RTIPS:RTIPS,RDUA_IFTAR:RDUA_IFTAR};
paintMoreHome();paintMarkCount();
})();
