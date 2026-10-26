(()=>{
  'use strict';
  const root=document.querySelector('[data-amt-deck]');
  if(!root)return;
  const viewport=root.querySelector('[data-amt-window]');
  const items=[...root.querySelectorAll('[data-amt-item]')];
  const status=root.querySelector('[data-amt-status]');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index=Math.max(0,items.findIndex(item=>item.hasAttribute('aria-current')));
  let frame=0;

  function label(item){return (item.getAttribute('aria-label')||item.textContent||'Deck').trim()}
  function render(next,announce=true){
    index=(next+items.length)%items.length;
    const target=items[index];
    target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
    items.forEach((item,itemIndex)=>item.dataset.amtNear=String(Math.abs(itemIndex-index)<=1));
    if(announce)status.textContent=`AMT · Deck ${index+1}/${items.length} · ${label(target)} → fester Tower`;
  }
  function nearest(){
    const center=viewport.getBoundingClientRect().left+viewport.clientWidth/2;
    let best=0;
    let distance=Infinity;
    items.forEach((item,itemIndex)=>{const box=item.getBoundingClientRect();const delta=Math.abs(box.left+box.width/2-center);if(delta<distance){distance=delta;best=itemIndex}});
    index=best;
    items.forEach((item,itemIndex)=>item.dataset.amtNear=String(Math.abs(itemIndex-index)<=1));
    status.textContent=`AMT · Deck ${index+1}/${items.length} · ${label(items[index])} → fester Tower`;
  }
  root.querySelectorAll('[data-amt-step]').forEach(button=>button.addEventListener('click',()=>render(index+Number(button.dataset.amtStep))));
  viewport.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();render(index-1)}if(event.key==='ArrowRight'){event.preventDefault();render(index+1)}});
  viewport.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;event.preventDefault();render(index+(event.deltaX>0?1:-1))},{passive:false});
  viewport.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(nearest)},{passive:true});
  render(index,false);
})();
