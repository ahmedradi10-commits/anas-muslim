/* ---------- Wudu & prayer guide (drawn figures) ---------- */
function fig(pose,hl){
  var C='var(--ink)',H='var(--brand)',g=function(k){return hl&&hl.indexOf(k)>-1?H:C};
  var P={
   stand:'<circle cx="50" cy="16" r="8" stroke="'+g('head')+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-12 20M50 30l12 20" stroke="'+g('arms')+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+g('feet')+'"/>',
   hands:'<circle cx="50" cy="16" r="8" stroke="'+C+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-14 12 9 2M50 30l14 12-9 2" stroke="'+H+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+C+'"/>',
   raise:'<circle cx="50" cy="16" r="8" stroke="'+C+'" fill="none"/><path d="M50 24v34" stroke="'+C+'"/><path d="M50 30l-16-8M50 30l16-8" stroke="'+H+'"/><path d="M50 58l-9 34M50 58l9 34" stroke="'+C+'"/>',
   ruku:'<circle cx="22" cy="44" r="7" stroke="'+C+'" fill="none"/><path d="M29 47l32 2" stroke="'+C+'"/><path d="M36 48l16 22" stroke="'+H+'"/><path d="M61 49l-3 43" stroke="'+C+'"/>',
   sujud:'<circle cx="18" cy="84" r="7" stroke="'+H+'" fill="none"/><path d="M25 82l24-12 22 10" stroke="'+C+'"/><path d="M30 80l-8 11" stroke="'+C+'"/><path d="M71 80l6 12h14" stroke="'+C+'"/>',
   sit:'<circle cx="46" cy="28" r="8" stroke="'+C+'" fill="none"/><path d="M46 36v34" stroke="'+C+'"/><path d="M46 44l16 14" stroke="'+H+'"/><path d="M46 70l22 4M68 74l-20 14" stroke="'+C+'"/>',
   salam:'<circle cx="46" cy="28" r="8" stroke="'+H+'" fill="none"/><path d="M60 24l8 0M62 30l9 3" stroke="'+H+'"/><path d="M46 36v34" stroke="'+C+'"/><path d="M46 44l16 14" stroke="'+C+'"/><path d="M46 70l22 4M68 74l-20 14" stroke="'+C+'"/>'
  };
  return '<svg viewBox="0 0 100 100" width="84" height="84" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 96h88" stroke="var(--line)" stroke-width="3"/>'+(P[pose]||P.stand)+'</svg>';
}
var WUDU=[
 ['stand','',['النية في القلب والتسمية: «بسم الله».']],
 ['hands','arms',['غسل الكفين ثلاث مرات.']],
 ['stand','head',['المضمضة والاستنشاق ثلاثًا (يدخل الماء الفم والأنف ثم يُخرجه).']],
 ['stand','head',['غسل الوجه ثلاثًا، من منابت الشعر إلى الذقن ومن الأذن إلى الأذن.']],
 ['stand','arms',['غسل اليدين مع المرفقين ثلاثًا، اليمنى ثم اليسرى.']],
 ['stand','head',['مسح الرأس كله مرة واحدة ومعه الأذنان.']],
 ['stand','feet',['غسل الرجلين مع الكعبين ثلاثًا، اليمنى ثم اليسرى.']],
 ['raise','',['الذكر بعد الوضوء: «أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله».']]
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
var SUNAN=['ركعتان قبل الفجر','أربع ركعات قبل الظهر وركعتان بعدها','ركعتان بعد المغرب','ركعتان بعد العشاء','ثم الوتر بعد العشاء، والضحى من ركعتين فأكثر'];
function stepCard(i,pose,hl,title,text){
  return '<div class="mcard stepc"><div class="fig">'+fig(pose,hl)+'</div><div class="stx"><b>'+AR(i)+'. '+title+'</b><p>'+text+'</p></div></div>';
}
RENDER.wudu=function(box){
  box.innerHTML=WUDU.map(function(w,i){return stepCard(i+1,w[0],w[1],'',w[2][0]).replace('. </b>','</b>')}).join('')+
   '<div class="mcard"><p class="mnote">الأعضاء المظلّلة بالأخضر في الرسم هي موضع الغسل أو المسح في كل خطوة. من نواقض الوضوء: ما خرج من السبيلين، والنوم المستغرق، وزوال العقل.</p></div>';
};
RENDER.salah=function(box){
  box.innerHTML=SALAH.map(function(s,i){return stepCard(i+1,s[0],s[1],s[2],s[3])}).join('')+
   '<div class="mcard"><h3>عدد الركعات</h3><div class="kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+RAK.map(function(r){return '<div><b>'+r[1]+'</b><span>'+r[0]+'</span></div>'}).join('')+'</div></div>'+
   '<div class="mcard"><h3>السنن الرواتب (١٢ ركعة)</h3><ul style="margin:0;padding-inline-start:20px;line-height:2">'+SUNAN.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div>';
};
