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
