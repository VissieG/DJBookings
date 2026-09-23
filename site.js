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

/* Respect reduced-motion: hold the hero on its poster frame */
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  const hv=document.querySelector('.hero-bg video');
  if(hv){hv.removeAttribute('autoplay');hv.pause();}
}
