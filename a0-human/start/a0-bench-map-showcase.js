(function(root,factory){
 'use strict';
 if(typeof module==='object'&&module.exports)module.exports=factory;
 else root.A0BenchMapShowcase=factory(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(doc,win){
 'use strict';
 const host=doc.getElementById('benchMap'),Map=win.A0BenchMap;
 if(!host||!Map||!win.A0BenchToolCatalog)return null;
 const pane=doc.createElement('div');pane.className='bms-window';
 pane.innerHTML='<div class="bms-picture"><img alt="" data-bms-image><span data-bms-label></span></div><div class="bms-copy"><small>SCHAUFENSTER · VORSCHAU, KEIN LIVE-LAUF</small><h3 data-bms-title></h3><p data-bms-description></p><p>Über eine Werkzeugtafel fahren, per Tab fokussieren oder antippen. Die große Ansicht bleibt stehen. Erst „Zum Werkzeug“ öffnet das Modul.</p><a data-bms-open>Zum Werkzeug ↓</a><button type="button" data-bms-refresh>Bilder aktualisieren</button><button type="button" data-bms-mode aria-pressed="true">Bilder ausblenden</button></div>';
 host.querySelector('.bench-map-stage').before(pane);
 host.dataset.showcase='on';
 const el=name=>pane.querySelector('[data-bms-'+name+']');
 const nodes=Array.from(host.querySelectorAll('[data-bench-map-module]'));
 let current=Map.MODULES[0].id;
 const images=Object.create(null);
 // Local cache only: snapshots already produced by the existing catalogue.
 function show(id){
  const m=Map.moduleById(id),p=images[id];if(!m||!p)return false;
  current=id;el('image').src=p.src;el('image').alt=p.alt;
  el('label').textContent=p.label;el('title').textContent=m.label;
  el('description').textContent=m.description;el('open').href='#'+m.focusTarget;
  nodes.forEach(n=>n.classList.toggle('bms-previewed',n.dataset.benchMapModule===id));
  return true;
 }
 function sync(){
  for(const node of nodes){
   const id=node.dataset.benchMapModule,m=Map.moduleById(id);
   const card=doc.querySelector('[data-btc-card="'+id+'"]');
   const original=card?.querySelector('[data-btc-image]');
   const p={src:original?.src||'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(win.A0BenchToolCatalog.sketch(m.group)),
    alt:original?.alt||'Orientierungsskizze; keine Quellansicht',
    label:card?.querySelector('[data-btc-preview-label]')?.textContent||'Orientierungsskizze · Quelle nicht geladen'};
   images[id]=p;
   let frame=node.querySelector('.bms-thumb');
   if(!frame){frame=doc.createElement('span');frame.className='bms-thumb';frame.innerHTML='<img alt="" loading="lazy" decoding="async"><span></span>';node.prepend(frame);}
   frame.querySelector('img').src=p.src;frame.querySelector('span').textContent=p.label;
  }
  show(current);
 }
 function inspect(event){
  const node=event.target.closest?.('[data-bench-map-module]');
  if(node&&host.contains(node))show(node.dataset.benchMapModule);
 }
 host.addEventListener('pointerover',inspect);
 host.addEventListener('focusin',inspect);
 host.addEventListener('click',inspect);
 el('open').addEventListener('click',event=>{
  event.preventDefault();win.A0BenchToolCatalogController?.open(current);
 });
 el('refresh').addEventListener('click',()=>{win.A0BenchToolCatalogController?.refresh();sync();});
 el('mode').addEventListener('click',()=>{
  const on=host.dataset.showcase!=='on';host.dataset.showcase=on?'on':'off';
  el('mode').setAttribute('aria-pressed',String(on));
  el('mode').textContent=on?'Bilder ausblenden':'Bilder einblenden';
 });
 doc.querySelector('[data-btc-refresh]')?.addEventListener('click',sync);
 sync();win.addEventListener('load',sync,{once:true});
 return Object.freeze({show,refresh:sync,get current(){return current;}});
});
