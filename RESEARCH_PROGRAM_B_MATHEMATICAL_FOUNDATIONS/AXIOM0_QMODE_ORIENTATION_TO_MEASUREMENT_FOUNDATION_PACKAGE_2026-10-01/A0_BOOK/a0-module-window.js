(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else{root.A0ModuleWindow=api;const boot=()=>api.mount(document,window);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function mount(doc,win){
    if(win.self!==win.top||doc.getElementById('a0ModuleWindow'))return null;
    const links=Array.from(doc.querySelectorAll('a[data-a0-window]'));
    if(!links.length)return null;
    const dialog=doc.createElement('dialog');
    dialog.id='a0ModuleWindow';
    dialog.className='a0-module-window';
    dialog.setAttribute('aria-modal','true');
    dialog.setAttribute('aria-labelledby','a0ModuleWindowTitle');
    dialog.innerHTML='<div class="a0-module-window__shell"><header><div><small>BENCH WINDOW · AUSGANGSPUNKT BLEIBT ERHALTEN</small><h2 id="a0ModuleWindowTitle">A0 Modul</h2><p>Links im Modul bleiben in diesem Fenster. Schließen bringt dich exakt zur Ausgangsstelle zurück.</p></div><nav><a data-a0-window-external target="_blank" rel="noopener">IN NEUEM TAB ÖFFNEN ↗</a><button type="button" data-a0-window-close>SCHLIESSEN · ZURÜCK ×</button></nav></header><iframe data-a0-window-frame title="A0 Modulfenster"></iframe></div>';
    doc.body.append(dialog);
    const frame=dialog.querySelector('[data-a0-window-frame]');
    const title=dialog.querySelector('#a0ModuleWindowTitle');
    const external=dialog.querySelector('[data-a0-window-external]');
    const close=dialog.querySelector('[data-a0-window-close]');
    let place=null;
    const afterPaint=callback=>typeof win.requestAnimationFrame==='function'?win.requestAnimationFrame(callback):callback();
    function open(link){
      const href=new URL(link.getAttribute('href'),win.location.href).href;
      place={trigger:link,x:Number(win.scrollX||0),y:Number(win.scrollY||0)};
      title.textContent=link.getAttribute('data-a0-window-title')||(link.textContent||'A0 Modul').trim();
      frame.title=title.textContent+' · eingebettetes Originalmodul';
      frame.src=href;
      external.href=href;
      doc.documentElement.classList.add('a0-module-window-open');
      if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');dialog.open=true;}
      close.focus();
    }
    function shut(){
      const restore=place;
      if(typeof dialog.close==='function'&&dialog.open)dialog.close();else{dialog.removeAttribute('open');dialog.open=false;}
      frame.src='about:blank';
      doc.documentElement.classList.remove('a0-module-window-open');
      place=null;
      if(restore)afterPaint(()=>{win.scrollTo({left:restore.x,top:restore.y,behavior:'instant'});restore.trigger.focus({preventScroll:true});});
    }
    links.forEach(link=>link.addEventListener('click',event=>{
      if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      open(link);
    }));
    close.addEventListener('click',shut);
    dialog.addEventListener('cancel',event=>{event.preventDefault();shut();});
    dialog.addEventListener('click',event=>{if(event.target===dialog)shut();});
    doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open){event.preventDefault();shut();}});
    return{open,close:shut,snapshot:()=>({open:Boolean(dialog.open),href:frame.src,returnReady:Boolean(place)})};
  }
  return{mount};
});
