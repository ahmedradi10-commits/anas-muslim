
/* ---------- معرفة التطبيق: الأذكار والأدعية والعبادات ومواقيت الصلاة + معاني المصحف ---------- */
var KB=null;
function kbBuild(){
  if(KB)return KB;KB=[];
  function add(title,keys,body,more){KB.push({title:title,body:body,tk:toks(title+' '+keys),more:more||null})}
  function cnt(c){return c&&c>1?' ('+AR(c)+' مرة)':''}
  function strip(t){return String(t)}
  /* الأذكار */
  var AK={morning:'صباح الصباح اصبح صباحا',evening:'مساء المساء امسي مساءا',sleep:'نوم النوم نام استيقاظ اصحي صحيت',home:'بيت منزل دخول خروج',afterprayer:'بعد الصلاه سلمت ختام الصلاه',duas:'دعاء ادعيه دعوه',tasbih:'تسبيح تحميد تكبير'};
  try{AZ_ORDER.forEach(function(id){
    var a=AZ[id],items=a.items(),lines=items.map(function(it){return (it.h?it.h+': ':'')+strip(it.t)+cnt(it.c)});
    add(a.name,'اذكار ذكر '+(AK[id]||''),lines.slice(0,3).join('\n\n'),lines.length>3?lines.slice(3):null);
    var X={'عند الوضوء (قبله)':'قبل الوضوء اتوضا','بعد الوضوء':'بعد الوضوء خلصت وضوء','قبل الطعام':'اكل الاكل قبل الاكل ابدا الاكل','بعد الطعام':'خلصت اكل بعد الاكل شبعت','دخول الخلاء':'حمام دخول الحمام الخلاء المرحاض','الخروج من الخلاء':'خروج الحمام طلعت','عند الركوب':'ركوب سفر عربيه سيارة مواصلات','دعاء الكرب':'ضيق هم حزن كرب قلق','سيد الاستغفار':'استغفار استغفر','دخول المسجد':'مسجد جامع ادخل','الخروج من المسجد':'مسجد جامع اخرج','دعاء دخول المنزل':'بيت منزل ادخل البيت','دعاء الخروج من المنزل':'بيت منزل اطلع اخرج','آية الكرسي':'كرسي ايه الكرسي'};
    items.forEach(function(it){if(it.h)add(it.h,'دعاء ذكر '+(X[it.h]||''),it.h+': '+strip(it.t)+cnt(it.c))});
  })}catch(e){}
  /* الوضوء والصلاة */
  try{add('طريقة الوضوء','وضوء اتوضا توضا خطوات كيفية الوضوء ازاي اتوضا',WUDU.map(function(s,i){return AR(i+1)+'. '+s[2].join(' ')}).join('\n'))}catch(e){}
  try{add('طريقة الصلاة','صلاه اصلي خطوات كيفية الصلاه ازاي اصلي',SALAH.map(function(s,i){return AR(i+1)+'. '+s[2]+': '+s[3]}).join('\n'))}catch(e){}
  try{add('عدد ركعات الصلوات','ركعات ركعه كام ركعه عدد ركعات الفجر الظهر العصر المغرب العشاء الجمعه',RAK.map(function(r){return r[0]+': '+r[1]+' ركعات'}).join('\n'));
      add('ركعات الصلاة بالتفصيل','ركعه اولي ثانيه ثالثه رابعه تفصيل',RK.map(function(r){return r[1]}).join('\n'));
      add('السنن الرواتب','سنن راتبه سنه قبل بعد الفجر الظهر المغرب العشاء وتر',SUNAN.join('\n'))}catch(e){}
  /* أحاديث */
  try{HADITH.forEach(function(h){add('حديث',h[0],h[0]+'\n— '+h[1])})}catch(e){}
  /* أسماء الله الحسنى */
  try{
    add('أسماء الله الحسنى','اسماء الله الحسني التسعه والتسعين ٩٩',NAMES.slice(0,12).map(function(n){return n.n+': '+n.m}).join('\n'),NAMES.slice(12).map(function(n){return n.n+': '+n.m}));
    NAMES.forEach(function(n){add('اسم الله '+n.n,'معني يعني ما معني اسم الله '+n.n,n.n+': '+n.m)});
  }catch(e){}
  /* مناسبات وشهور هجرية */
  try{add('الشهور الهجرية','شهور هجريه تقويم هجري اسماء الشهور',HM.map(function(m,i){return AR(i+1)+'. '+m}).join('\n'))}catch(e){}
  /* رمضان */
  try{add('دعاء الإفطار','دعاء افطار فطار صايم',RDUA_IFTAR);add('نصائح رمضان','رمضان نصايح صيام',RTIPS.join('\n'))}catch(e){}
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
   ['التطبيق بدون إنترنت','نت انترنت اوفلاين يشتغل بدون','التطبيق يعمل بدون إنترنت: المواقيت والأذان والمصحف والأذكار واسأل أنس. استماع التلاوات وخريطة أقرب مسجد يحتاجان إنترنت.']
  ];
  APP.forEach(function(a){add(a[0],a[1],a[2])});
  return KB;
}
var KBGATE=/(^| )(اذكار|ذكر|دعاء|ادعيه|دعوه|وضوء|اتوضا|توضا|صلاه|اصلي|ركعه|ركعات|سنن|سنه|حديث|احاديث|اسماء الله|اسم الله|الحسني|رمضان|افطار|فطار|زكاه|نصاب|هجري|هجريه|شهور|مواقيت|اذان|الاذان|مؤذن|اقامه|قبله|مسبحه|ختمه|اصوم|صيام|سحور|تنبيه|اشعار|انس مسلم|التطبيق|بدون نت|انترنت|مصحف|خلفيه|الفجر|الظهر|العصر|المغرب|العشاء|دخول|خروج|قبل الاكل|بعد الاكل|الكرب|الاستغفار|الكرسي)( |$)/;
var KBCUE={};'ايه ما ماذا اقول اقرا اذكر قول عايز عاوز اعرف معلومات عن لو سمحت يا ازاي كيف طريقه افضل'.split(' ').forEach(function(w){toks(w).forEach(function(t){KBCUE[t]=1})});
function kbSearch(q){
  var qt=Array.from(new Set(toks(q))).filter(function(t){return!KBCUE[t]});if(!qt.length)return null;
  kbBuild();
  var df={};qt.forEach(function(t){var n=0;KB.forEach(function(e){if(srIn(e.tk,t))n++});df[t]=n});
  var W={},tot=0;qt.forEach(function(t){W[t]=df[t]?Math.log(KB.length/(df[t]+0.5))+1:1.2;tot+=W[t]});
  var best=null;
  KB.forEach(function(e,i){
    var s=0;qt.forEach(function(t){if(srIn(e.tk,t))s+=W[t]});
    var cov=s/tot;
    if(cov>0){var sc=cov*10-Math.log(e.tk.length+1)*0.25;if(!best||sc>best.sc)best={e:e,sc:sc,cov:cov}}
  });
  return best&&best.cov>=0.99?best:(best&&best.cov>=0.75&&qt.length>=3?best:null);
}
function kbShow(e){
  var h='<span class="qt">'+hesc(e.title)+'</span>'+fmt(e.body);
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
function qNameOf(n){return Q.s[n-1].name}
var QV=null;
function qvBuild(){if(QV)return QV;QV=[];Q.s.forEach(function(s,si){s.v.forEach(function(v,ai){QV.push({s:si+1,a:ai+1,n:nrm(String(v).replace(/[۞۩ۖ-ۭ]/g,''))})})});return QV}
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
  if(sn&&(/(تفسير|معني|اشرح|شرح|ايه|اية|يعني)/.test(t))){
    var S=Q.s[sn-1];if(aya&&aya<=S.v.length)return ayahCard(sn,aya);
    if(/(سوره|سورة)/.test(t)||!aya)return ayahCard(sn,1);
  }
  /* معنى كلمة */
  var cand=toks(t).filter(function(x){return QCUE.map(function(c){return toks(c)[0]}).indexOf(x)===-1});
  var raw=t.split(' ').filter(function(w){return w&&QCUE.indexOf(w)===-1&&!STOP[w]});
  var w=raw.length&&raw.length<=2?raw.join(' '):'';
  if(w&&/(معني|يعني|كلمه|مفردات|غريب)/.test(t)){
    var hits=[],seen={};
    var key=wn(w),pk=ps(key);
    for(var k in GH){
      GH[k].forEach(function(it){
        var kk=wn(it[0]);
        if(kk===key||ps(kk)===pk||(key.indexOf(' ')<0&&kk.split(' ').some(function(x){return x===key||ps(x)===pk}))){
          var m=String(it[1]);if(!seen[m]){seen[m]=1;var p=k.split(':');hits.push({s:+p[0],a:+p[1],w:it[0],m:m})}
        }
      });
      if(hits.length>=3)break;
    }
    if(hits.length){
      var h='<span class="qt">معنى «'+hesc(w)+'» في القرآن</span>'+hits.map(function(x){return '<p><b>'+hesc(String(x.w).replace(/[۞۩]/g,''))+'</b> — '+hesc(x.m)+' <small>(سورة '+hesc(qNameOf(x.s))+' آية '+AR(x.a)+')</small></p>'}).join('');
      return h;
    }
  }
  /* معنى آية بنصها */
  var qt=Array.from(new Set(t.split(' ').filter(function(w){return w&&QCUE.indexOf(w)===-1&&!STOP[w]&&w.length>1})));
  if(qt.length>=3&&/(ايه|اية|معني|تفسير|يعني)/.test(t)){
    var V=qvBuild(),found=null,n=0;
    V.forEach(function(v){if(qt.every(function(w){return v.n.indexOf(w)>-1})){n++;if(!found)found=v}});
    if(found&&n<=3)return ayahCard(found.s,found.a);
  }
  return null;
}
