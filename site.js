const hdr=document.getElementById('hdr');
const waf=document.querySelector('.wa-float');
addEventListener('scroll',()=>{
  hdr.classList.toggle('scrolled',scrollY>40);
  if(waf)waf.classList.toggle('show',scrollY>innerHeight*.8);
},{passive:true});

/* Event reels: tap to play, one at a time; native controls once playing */
(function(){
  const items=document.querySelectorAll('.m-item[data-video]');
  function start(item){
    items.forEach(o=>{if(o!==item)o.querySelector('video').pause();});
    const v=item.querySelector('video');
    v.controls=true;v.play();
  }
  items.forEach(item=>{
    const v=item.querySelector('video');
    item.addEventListener('click',()=>{if(v.paused&&!v.controls)start(item);});
    item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();v.paused?start(item):v.pause();}});
    v.addEventListener('play',()=>{item.classList.add('playing');items.forEach(o=>{if(o!==item)o.querySelector('video').pause();});});
    v.addEventListener('ended',()=>{item.classList.remove('playing');v.controls=false;v.load();});
  });
})();

/* Videos page: only one video plays at a time */
document.querySelectorAll('video.gv').forEach(v=>v.addEventListener('play',()=>{
  document.querySelectorAll('video.gv').forEach(o=>{if(o!==v)o.pause();});
}));

/* Videos page: event filter tabs */
(function(){
  const tabs=document.querySelectorAll('.tabs button');
  if(!tabs.length)return;
  const evs=document.querySelectorAll('.ev');
  function pick(f){
    tabs.forEach(o=>o.classList.toggle('on',o.dataset.f===f));
    evs.forEach(e=>e.hidden=f!=='all'&&e.id!==f);
    document.querySelectorAll('video.gv').forEach(v=>v.pause());
  }
  tabs.forEach(t=>t.addEventListener('click',()=>{pick(t.dataset.f);history.replaceState(null,'',t.dataset.f==='all'?location.pathname:'#'+t.dataset.f);}));
  const h=location.hash.slice(1);
  if(h&&document.getElementById(h))pick(h);
})();

/* Upcoming gigs: hide dates that have passed, flag the next one.
   Sets run until 02:00, so a gig still counts as "today" until then. */
(function(){
  const rows=[...document.querySelectorAll('.fx[data-date]')];
  if(!rows.length)return;
  const today=new Date();today.setHours(today.getHours()-2);today.setHours(0,0,0,0);
  const day=r=>new Date(r.dataset.date+'T00:00');
  const up=rows.filter(r=>!(r.hidden=day(r)<today));
  rows.forEach(r=>r.classList.toggle('next',r===up[0]));
  if(!up.length){document.querySelectorAll('#gigs,.next-gig,a[href="#gigs"]').forEach(e=>e.hidden=true);return;}
  const tonight=+day(up[0])===+today;
  if(tonight)up[0].querySelector('.fx-badge').textContent='Tonight';
  const pill=document.querySelector('.next-gig');
  if(!pill)return;
  pill.querySelector('em').textContent=tonight?'Tonight':'Next gig';
  pill.querySelector('b').textContent=tonight?'':up[0].dataset.label;
  pill.querySelector('span').textContent=up[0].querySelector('h4').textContent;
})();
