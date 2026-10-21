(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-bench-map.js'):root.A0BenchMap);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0BenchToolCatalog=api;root.A0BenchToolCatalogController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(Map){
 'use strict';
 const NAMES={SOURCE:'Quellen / Körper',STATE:'Zustand / Adresse',OPERATE:'Operatoren',VIEW:'Ansichten / Grids',RETURN:'Return',VERIFY:'Prüfung / Records'};
 const ALIASES={'game-atlas':'Chemistry Life Physics Joint Euler Fibonacci Ihara k NEG Teller Blue Body Dreierpakete','body-route':'cyan pink layer lagen haus house innenleben','mask-observer':'maske schnitt durchlass beobachter','mask-clock':'kopplung quelle phase','orbit-grid':'mandelbrot julia kritische bahn','glb-archive':'3D modell archiv cathedral kathedrale','pascal-aperture':'rest verdeckt witness trinomial'};
 const fold=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const CONTEXT={'body-route':'body','native-face':'blue','family-role':'families'};
 function contextKey(id,map){
  const m=Map.moduleById(id);if(!m)return null;
  const exact=map?.nodes?.find(n=>n.href==='A0_ORIENTATION_CONTROLLER_BENCH.html#'+m.focusTarget);
  const candidate=exact?.key||CONTEXT[id]||'bench';
  return map?.nodes?.some(n=>n.key===candidate)?candidate:null;
 }
 function search(query='',group='ALL',binding='ALL'){
  if(group!=='ALL'&&!Map.GROUPS.some(g=>g.id===group))throw Error('unknown catalog group');
  if(binding!=='ALL'&&!Map.BINDING_TYPES[binding])throw Error('unknown catalog binding');
  const words=fold(query).trim().split(/\s+/).filter(Boolean);
  return Map.MODULES.filter(m=>(group==='ALL'||m.group===group)&&(binding==='ALL'||m.bindingType===binding)&&words.every(w=>fold([m.id,m.label,m.description,m.focusTarget,m.group,NAMES[m.group],m.bindingType,Map.BINDING_TYPES[m.bindingType].label,ALIASES[m.id]||''].join(' ')).includes(w)));
 }
 function sketch(group){
  const drawings={
   SOURCE:'<path d="M120 40L210 80V170L120 210L30 170V80Z M30 80L120 125L210 80 M120 125V210"/><path d="M255 70L330 100V175L255 205L225 175V100Z" stroke="#ee6ca5"/>',
   STATE:'<path d="M70 45H270V205H70Z M120 45V205 M170 45V205 M220 45V205 M70 85H270 M70 125H270 M70 165H270"/><circle cx="145" cy="105" r="13" fill="#e5b340"/>',
   OPERATE:'<path d="M40 125H280 M245 90L280 125L245 160"/><circle cx="115" cy="125" r="55"/><path d="M115 70A55 55 0 0 1 170 125" stroke="#ee6ca5"/>',
   VIEW:'<path d="M40 190L165 35L290 190 M70 100H260 M90 140H240"/><ellipse cx="165" cy="190" rx="110" ry="25" stroke="#ee6ca5"/>',
   RETURN:'<path d="M240 80A85 85 0 1 0 245 170 M240 80V35 M240 80H285"/><circle cx="165" cy="125" r="18" fill="#e5b340"/>',
   VERIFY:'<path d="M85 35H245V215H85Z M110 80H220 M110 115H220 M110 150H220"/><path d="M140 175L160 195L205 155" stroke="#69d39a"/>'
  };
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 250"><rect width="330" height="250" fill="#05151f"/><g fill="none" stroke="#39cee9" stroke-width="3">'+drawings[group]+'</g></svg>';
 }
 function preview(target,doc,win){
  if(!target)return{kind:'missing',label:'Ziel nicht verfügbar',url:null};
  if(/^H[1-6]$/.test(target.tagName||''))target=target.closest?.('section')||target;
  try{
   const svg=target.matches?.('svg')?target:target.querySelector?.('svg');
   if(svg&&svg.querySelector?.('path,rect,circle,ellipse,line,polygon,polyline,text')){
    const copy=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
    if(clones.length>2500)throw Error('SVG preview limit');
    const styles=['fill','stroke','stroke-width','opacity','fill-opacity','stroke-opacity','font-family','font-size','font-weight','text-anchor'];
    clones.forEach((n,i)=>{
     if(win.getComputedStyle){const computed=win.getComputedStyle(originals[i]);for(const key of styles){const v=computed.getPropertyValue(key);if(v&&!/url\(/.test(v))n.setAttribute(key,v);}}
     for(const a of Array.from(n.attributes||[])){if(/^on/i.test(a.name)||['class','style','tabindex'].includes(a.name)||/href$/i.test(a.name)&&!a.value.startsWith('#'))n.removeAttribute(a.name);}
    });
    copy.querySelectorAll('script,foreignObject,image,iframe,animate,animateTransform,animateMotion,set').forEach(n=>n.remove());
    copy.setAttribute('xmlns','http://www.w3.org/2000/svg');
    if(!copy.getAttribute('viewBox'))copy.setAttribute('viewBox','0 0 '+(parseFloat(svg.getAttribute('width'))||640)+' '+(parseFloat(svg.getAttribute('height'))||400));
    copy.setAttribute('width','480');copy.setAttribute('height','280');
    const xml=new win.XMLSerializer().serializeToString(copy);if(xml.length>700000)throw Error('SVG preview limit');
    return{kind:'svg',label:'Quellansicht · Momentaufnahme',url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml)};
   }
   const canvas=target.matches?.('canvas')?target:target.querySelector?.('canvas');
   if(canvas?.width&&canvas?.height){
    const small=doc.createElement('canvas');small.width=480;small.height=280;
    const ctx=small.getContext('2d'),scale=Math.min(480/canvas.width,280/canvas.height),w=canvas.width*scale,h=canvas.height*scale;
    ctx.fillStyle='#05151f';ctx.fillRect(0,0,480,280);ctx.drawImage(canvas,(480-w)/2,(280-h)/2,w,h);
    return{kind:'canvas',label:'Quellansicht · Momentaufnahme',url:small.toDataURL('image/png')};
   }
  }catch(error){return{kind:'unavailable',label:'Quellvorschau nicht lesbar',url:null};}
  return{kind:'unloaded',label:'Quelle nicht geladen / keine Grafik',url:null};
 }
 function mount(doc,win){
  const host=doc.getElementById('benchToolCatalog');if(!host)return null;
  host.innerHTML='<div class="btc-heading"><div><small>VISUELLER WERKZEUGKATALOG · BESTEHENDE BENCH-MAP</small><h3>Welches Werkzeug suchst du?</h3><p>39 Module · Gruppen auswählen, suchen und direkt öffnen. Bilder sind eingefrorene Ansichten, keine zweite Simulation.</p></div><button type="button" data-btc-refresh>Vorschaubilder aktualisieren</button></div><div class="btc-filters"><label>Suche <input type="search" data-btc-query placeholder="z. B. Pascal, Grid, Observer, Return" autocomplete="off"></label><label>Bindung <select data-btc-binding><option value="ALL">Alle Bindungstypen</option>'+Object.entries(Map.BINDING_TYPES).map(([id,v])=>'<option value="'+id+'">'+esc(v.label)+'</option>').join('')+'</select></label><button type="button" data-btc-clear>Zurücksetzen</button></div><nav class="btc-groups" aria-label="Werkzeuge nach Arbeitsbereich filtern"><button type="button" data-btc-group="ALL" aria-pressed="true">Alle · '+Map.MODULES.length+'</button>'+Map.GROUPS.map(g=>'<button type="button" data-btc-group="'+g.id+'" aria-pressed="false">'+NAMES[g.id]+' · '+Map.MODULES.filter(m=>m.group===g.id).length+'</button>').join('')+'</nav><output data-btc-count role="status" aria-live="polite"></output><div class="btc-grid" data-btc-grid></div><p data-btc-empty hidden>Kein Werkzeug passt zu dieser Suche. Suche oder Filter zurücksetzen.</p><p class="btc-note">Vorschaubilder lesen nur bereits vorhandene Grafiken. Bei ungeladenen Originalen zeigt eine beschriftete Orientierungsskizze die Arbeitsgruppe, nicht das Originalinstrument. Öffnen startet keine Quelle und lädt keinen GLB automatisch. Details und Abnahmegrenzen stehen im jeweiligen Modul.</p>';
  host.innerHTML=host.innerHTML.replace('<button type="button" data-btc-clear>', '<label>Menü-Raster <select data-btc-layout><option value="auto">Nach Arbeitsbereich</option><option value="2">2 Spalten</option><option value="3">3 Spalten</option><option value="4">4 Spalten</option></select></label><button type="button" data-btc-clear>').replace('<nav class="btc-groups"', '<p class="btc-note">Kachel / Zusammenhang öffnet das vorhandene Orientierungsfenster; „Zum Modul“ springt direkt zum Werkzeug. <a href="A0_LIVING_BLUEPRINT.html#a0-map-home">Große Orientierungsmap ↗</a>. Kontext ist Navigation, kein neuer Datenadapter. Das Menü-Raster verändert keine Quellgrids.</p><nav class="btc-groups"');
  host.innerHTML=host.innerHTML.replace('39 Module',Map.MODULES.length+' Module der bestehenden Bench-Map');
  const el=n=>host.querySelector('[data-btc-'+n+']');let group='ALL',cards=[];
  function build(){
   el('grid').innerHTML=Map.MODULES.map(m=>'<article class="btc-card" data-btc-card="'+m.id+'"><a class="btc-preview" data-btc-open="'+m.id+'" href="#'+m.focusTarget+'"><img data-btc-image alt="" loading="lazy" decoding="async"><span data-btc-preview-label></span></a><div class="btc-card-copy"><small>'+esc(NAMES[m.group])+' · '+esc(Map.BINDING_TYPES[m.bindingType].label)+'</small><h4><a data-btc-open="'+m.id+'" href="#'+m.focusTarget+'">'+esc(m.label)+'</a></h4><p>'+esc(m.description)+'</p><a class="btc-open" data-btc-open="'+m.id+'" href="#'+m.focusTarget+'">Zum Modul ↗</a><code>#'+m.focusTarget+'</code></div></article>').join('');
   for(const a of host.querySelectorAll('.btc-preview,[data-btc-card] h4 a')){const id=a.dataset.btcOpen;a.removeAttribute('data-btc-open');a.setAttribute('data-btc-context',id);a.href='A0_LIVING_BLUEPRINT.html#a0-map-home';}
   cards=Array.from(host.querySelectorAll('[data-btc-card]'));
   for(const card of cards){const button=doc.createElement('button');button.type='button';button.className='btc-context';button.dataset.btcContext=card.dataset.btcCard;button.textContent='Zusammenhang';card.querySelector('.btc-card-copy').appendChild(button);}
  }
  function filter(){
   const visible=new Set(search(el('query').value,group,el('binding').value).map(m=>m.id));
   cards.forEach(card=>card.hidden=!visible.has(card.dataset.btcCard));
   host.querySelectorAll('[data-btc-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.btcGroup===group)));
   el('count').textContent=visible.size+' / '+Map.MODULES.length+' Werkzeuge · '+(group==='ALL'?'alle Arbeitsbereiche':NAMES[group]);
   el('empty').hidden=visible.size>0;return visible.size;
  }
  function layout(){host.dataset.catalogGroup=group;host.dataset.catalogColumns=el('layout').value;}
  function refresh(){
   for(const card of cards){
    const m=Map.moduleById(card.dataset.btcCard),p=preview(doc.getElementById(m.focusTarget),doc,win),image=card.querySelector('[data-btc-image]');
    image.src=p.url||'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(sketch(m.group));
    image.alt=p.url?'Momentaufnahme: '+m.label:'Orientierungsskizze für '+NAMES[m.group]+'; keine Quellansicht';
    card.dataset.preview=p.kind;card.querySelector('[data-btc-preview-label]').textContent=p.url?p.label:'Orientierungsskizze · '+p.label;
   }
  }
  function open(id){
   const module=Map.moduleById(id),target=module&&doc.getElementById(module.focusTarget);if(!target)return false;
   win.A0MaskClockBench?.focus(false);
   for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
   win.A0BenchMapController?.select(id);
   if(win.location)win.location.hash=module.focusTarget;
   target.scrollIntoView({block:'start',behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
   target.setAttribute('tabindex','-1');target.focus?.({preventScroll:true});
   return true;
  }
  host.addEventListener('click',event=>{
   const context=event.target.closest?.('[data-btc-context]');
   if(context){
    const key=contextKey(context.dataset.btcContext,win.A0OrientationMap);
    if(key&&win.A0OrientationMapView?.openNode){event.preventDefault();win.A0OrientationMapView.openNode(key);return;}
    if(context.tagName==='BUTTON')el('count').textContent='Orientierungsfenster noch nicht bereit · Große Orientierungsmap über den Link öffnen';
    return;
   }
   const item=event.target.closest?.('[data-btc-open]');
   if(item){event.preventDefault();if(!open(item.dataset.btcOpen))el('count').textContent='HOLD · Modulziel nicht verfügbar';return;}
   const chip=event.target.closest?.('[data-btc-group]');if(chip){group=chip.dataset.btcGroup;filter();layout();}
  });
  el('query').addEventListener('input',filter);el('binding').addEventListener('change',filter);
  el('clear').addEventListener('click',()=>{el('query').value='';el('binding').value='ALL';el('layout').value='auto';group='ALL';filter();layout();});
  el('layout').addEventListener('change',layout);
  el('refresh').addEventListener('click',refresh);
  build();filter();layout();refresh();win.addEventListener?.('load',refresh,{once:true});
  return{refresh,filter,open,get state(){return{query:el('query').value,group,binding:el('binding').value};}};
 }
 return{NAMES,contextKey,search,sketch,preview,mount};
});
