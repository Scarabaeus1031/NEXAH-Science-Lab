(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-bench-map.js'):root.A0BenchMap,node?require('./a0-bench-body-gallery.js'):root.A0BenchBodyGallery,node?require('./a0-bench-structure-visuals.js'):root.A0BenchStructureVisuals);
 if(node)module.exports=api;else{root.A0BenchMachinePicture=api;root.A0BenchMachinePictureController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(Model,Body,Structure){
 'use strict';
 const GROUP_LABELS={SOURCE:'Körper / Quellen',STATE:'Zustand / Adresse',OPERATE:'Operatoren / Phase',VIEW:'Linsen / Ansichten',RETURN:'Return / Witness',VERIFY:'Prüfung / Records'};
 const GROUP_POS={SOURCE:[35,40],STATE:[445,40],VIEW:[855,40],OPERATE:[35,565],RETURN:[445,565],VERIFY:[855,565]};
 const COLORS={STATE_OWNER:'#54d7ef',LIVE_COUPLED:'#54d7ef',TYPED_HANDOFF:'#69d39a',VIEW_PROJECTION:'#b78aef',RETURN_WITNESS:'#efbd55',RESULT_LENS:'#ef6d9c',LAUNCHER:'#8b9fab',OPEN_UNBOUND:'#8b9fab'};
 const DASH={STATE_OWNER:'',LIVE_COUPLED:'',TYPED_HANDOFF:'8 5',VIEW_PROJECTION:'2 5',RETURN_WITNESS:'',RESULT_LENS:'8 4 2 4',LAUNCHER:'2 7',OPEN_UNBOUND:'3 6'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function layout(){
  return Model.MODULES.map(m=>{
   const index=Model.MODULES.filter(n=>n.group===m.group).findIndex(n=>n.id===m.id),[gx,gy]=GROUP_POS[m.group];
   return{...m,x:gx+17+(index%3)*112,y:gy+205+Math.floor(index/3)*56};
  });
 }
 function imageFor(group,doc){
  if(group==='SOURCE')return{url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(Body.svg(Body.ITEMS[0])),label:'Body-Quellgeometrie · feste Ansicht'};
  const ids={STATE:'state',OPERATE:'operators',VIEW:'mask-observer',RETURN:'economy',VERIFY:'record'};
  const card=doc?.querySelector('[data-btc-card="'+ids[group]+'"]'),img=card?.querySelector('[data-btc-image]');
  return card&&['svg','canvas'].includes(card.dataset.preview)&&img?.src?.startsWith('data:image/')?{url:img.src,label:'Original-Modul · Momentaufnahme'}:Structure.image(group);
 }
 function drawing(selected='body-route',doc){
  const nodes=layout(),byId=new Map(nodes.map(n=>[n.id,n])),active=byId.has(selected)?selected:null;
  let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 1090" role="group" aria-label="Architekturansicht der bestehenden Bench"><title>Sechs Arbeitsbereiche, 39 Module und 19 bestehende Kantenrecords</title><defs><linearGradient id="bmp-plate" x2=".7" y2="1"><stop stop-color="#173b4c"/><stop offset="1" stop-color="#071c29"/></linearGradient></defs><rect width="1260" height="1090" rx="20" fill="#03131e"/>';
  for(const group of Model.GROUPS){
   const [x,y]=GROUP_POS[group.id],pic=imageFor(group.id,doc);
   svg+='<g><path d="M'+x+' '+(y+25)+'l28 -25h330v444l-28 25H'+x+'Z" fill="url(#bmp-plate)" stroke="#3a6175"/><path d="M'+(x+28)+' '+y+'v444l-28 25 M'+(x+28)+' '+(y+444)+'h330" fill="none" stroke="#294e63"/><text x="'+(x+45)+'" y="'+(y+34)+'" fill="#deeff4" font-size="17" font-family="system-ui">'+esc(GROUP_LABELS[group.id])+'</text>';
   if(pic)svg+='<image x="'+(x+40)+'" y="'+(y+47)+'" width="280" height="125" href="'+esc(pic.url)+'" preserveAspectRatio="xMidYMid meet"/><text x="'+(x+45)+'" y="'+(y+187)+'" fill="#90afbf" font-size="10">'+esc(pic.label)+'</text>';
   else svg+='<g stroke="#355d72" fill="none"><rect x="'+(x+63)+'" y="'+(y+72)+'" width="210" height="70" rx="10"/><path d="M'+(x+83)+' '+(y+107)+'h170" stroke-dasharray="4 8"/></g><text x="'+(x+45)+'" y="'+(y+187)+'" fill="#90afbf" font-size="10">Architekturplatz · Quellgrafik nicht geladen</text>';
   svg+='</g>';
  }
  for(const edge of Model.EDGES){
   const a=byId.get(edge.from),b=byId.get(edge.to),on=edge.from===active||edge.to===active,x1=a.x+48,y1=a.y+23,x2=b.x+48,y2=b.y+23,mid=(x1+x2)/2;
   svg+='<path data-machine-edge="'+edge.id+'" d="M'+x1+' '+y1+'C'+mid+' '+y1+' '+mid+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="'+COLORS[edge.bindingType]+'" stroke-dasharray="'+DASH[edge.bindingType]+'" stroke-width="'+(on?3:1.3)+'" opacity="'+(on?.95:.18)+'"><title>'+esc(edge.from+' → '+edge.to+' · '+Model.BINDING_TYPES[edge.bindingType].label)+'</title></path>';
  }
  for(const n of nodes){
   const label=n.label.length>16?n.label.slice(0,14)+'…':n.label;
   svg+='<a href="#'+esc(n.focusTarget)+'" data-machine-select="'+n.id+'" aria-label="'+esc(n.label+'; Bindung '+Model.BINDING_TYPES[n.bindingType].label)+'" aria-current="'+(n.id===active?'true':'false')+'"><title>'+esc(n.label+' · '+n.description)+'</title><rect x="'+n.x+'" y="'+n.y+'" width="101" height="43" rx="7" fill="#082331" stroke="'+(n.id===active?'#fff':COLORS[n.bindingType])+'" stroke-width="'+(n.id===active?2.5:1)+'"/><circle cx="'+(n.x+10)+'" cy="'+(n.y+12)+'" r="3" fill="'+COLORS[n.bindingType]+'"/><text x="'+(n.x+6)+'" y="'+(n.y+30)+'" fill="#d9edf4" font-family="system-ui" font-size="10">'+esc(label)+'</text></a>';
  }
  return svg+'</svg>';
 }
 function mount(doc,win){
  const host=doc.getElementById('benchMachinePicture');if(!host)return null;
  let selected='body-route',returnFocus=false,mode='composition';
  host.innerHTML='<header class="bmp-head"><div><small>GESAMTKOMPOSITION · QUELLVISUALS + KONZEPTUELLE ANORDNUNG</small><h2>Die Werkbank im Zusammenhang.</h2><p>39 lokale Bench-Module · 19 verzeichnete Verbindungen. Weitere Quellzugänge wie Pink Grids stehen in den Regalen darunter; dies ist nicht das vollständige NEXAH-Inventar.</p></div><a href="#foyerDoors">Zu den visuellen Regalen ↓</a></header><div class="bmp-toolbar"><label>Baustein <select data-bmp-module>'+Model.MODULES.map(m=>'<option value="'+m.id+'">'+esc(m.label)+'</option>').join('')+'</select></label><button type="button" data-bmp-mode>Zum Lageplan</button><button type="button" data-bmp-size aria-pressed="false">Gesamtbild ausklappen</button><button type="button" data-bmp-refresh>Quellansichten aktualisieren</button></div><div class="bmp-scroll" data-bmp-drawing></div><div class="bmp-legend">'+Object.entries(Model.BINDING_TYPES).map(([id,v])=>'<span style="--connection:'+COLORS[id]+'"><i style="border-top-style:'+(DASH[id]?'dashed':'solid')+'"></i>'+esc(v.label)+'</span>').join('')+'</div><section class="bmp-inspector"><div><small data-bmp-binding></small><h3 data-bmp-title></h3><p data-bmp-copy></p><output data-bmp-links></output></div><div><a data-bmp-open>Instrument öffnen ↗</a><a data-bmp-demo hidden>Demonstrator erleben ↗</a><a href="#benchMap">Technisches Schaltbild ↗</a></div></section><details class="bmp-boundary"><summary>Was dieses Maschinenbild zeigt — und was nicht</summary><p>Räumliche Anordnung der sechs bestehenden Arbeitsgruppen, keine physikalisch gebaute Gesamtmaschine. Die 19 Linien übernehmen ausschließlich die Kantenrecords der Bench-Map. Ihre Typen unterscheiden bestätigte Teilanschlüsse, Ansichtsbezüge, Return und Launcher; sie melden keinen aktuellen Live-Zustand.</p><p>Module ohne Kantenrecord bleiben sichtbar. Fehlende Linien bedeuten „hier nicht erfasst“, nicht „nachweislich unverbunden“. Offene oder nicht erfasste Anschlüsse werden nicht durch erfundene Linien ergänzt. Bildähnlichkeit und gemeinsame Farbe beweisen keine Trägeridentität. Das Bild startet keine Quelle.</p></details>';
  const el=n=>host.querySelector('[data-bmp-'+n+']');
  function render(){
   const m=Model.moduleById(selected);el('drawing').innerHTML=mode==='composition'?Structure.composition(selected,COLORS,DASH):drawing(selected,doc);el('module').value=selected;
   el('title').textContent=m.label;el('copy').textContent=m.description;el('binding').textContent=Model.BINDING_TYPES[m.bindingType].label;
   const links=Model.EDGES.filter(e=>e.from===selected||e.to===selected);
   el('links').textContent=links.length?links.map(e=>e.from+' → '+e.to+' · '+Model.BINDING_TYPES[e.bindingType].label).join(' / '):'Kein Kantenrecord für dieses Modul in der bestehenden Map · Zuordnung offen / nicht erfasst';
   el('open').href='#'+m.focusTarget;
   const entry=win.A0BenchVisualShelves?.entries().find(e=>e.module===selected),demo=entry&&win.A0BenchVisualShelves?.demonstrator(entry);
   el('demo').hidden=!demo;if(demo)el('demo').href=demo;
   if(returnFocus)host.querySelector('[data-machine-select="'+selected+'"]')?.focus?.({preventScroll:true});
   returnFocus=false;
  }
  host.addEventListener('click',e=>{
   const a=e.target.closest?.('[data-machine-select]');if(!a)return;
   if(!Model.moduleById(a.dataset.machineSelect))return;
   e.preventDefault();selected=a.dataset.machineSelect;returnFocus=true;render();
  });
  el('module').addEventListener('change',()=>{if(Model.moduleById(el('module').value)){selected=el('module').value;render();}});
  el('open').addEventListener('click',e=>{if(win.A0BenchVisualShelvesController?.open?.(selected))e.preventDefault();});
  el('refresh').addEventListener('click',()=>{win.A0BenchToolCatalogController?.refresh();render();});
  el('mode').addEventListener('click',()=>{mode=mode==='composition'?'plan':'composition';el('mode').textContent=mode==='composition'?'Zum Lageplan':'Zur Gesamtkomposition';render();});
  el('size').addEventListener('click',()=>{const expanded=host.dataset.expanded!=='true';host.dataset.expanded=String(expanded);el('size').setAttribute('aria-pressed',String(expanded));el('size').textContent=expanded?'Gesamtbild einklappen':'Gesamtbild ausklappen';});
  render();win.addEventListener('load',render,{once:true});
  return{render,get selected(){return selected;}};
 }
 return{GROUP_LABELS,GROUP_POS,COLORS,DASH,layout,imageFor,drawing,mount};
});
