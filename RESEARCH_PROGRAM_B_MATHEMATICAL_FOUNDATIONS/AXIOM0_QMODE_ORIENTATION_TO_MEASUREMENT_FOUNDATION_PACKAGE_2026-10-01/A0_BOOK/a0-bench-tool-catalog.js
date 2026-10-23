(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-bench-map.js'):root.A0BenchMap);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0BenchToolCatalog=api;root.A0BenchToolCatalogController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(Map){
 'use strict';
 const NAMES={SOURCE:'Quellen / Körper',STATE:'Zustand / Adresse',OPERATE:'Operatoren',VIEW:'Ansichten / Grids',RETURN:'Return',VERIFY:'Prüfung / Records'};
 const ALIASES={'game-atlas':'Chemistry Life Physics Joint Euler Fibonacci Ihara k NEG Teller Blue Body Dreierpakete','body-route':'cyan pink layer lagen haus house innenleben','mask-observer':'maske schnitt durchlass beobachter','mask-clock':'kopplung quelle phase','orbit-grid':'mandelbrot julia kritische bahn','glb-archive':'3D modell archiv cathedral kathedrale','pascal-aperture':'rest verdeckt witness trinomial','root5-crosswalk':'1728 1729 1730 17 29 root 5 wurzel pentagon taxicab cube kubus nulltest neighbor historical trigger geometric mask','root5-blind-audit':'1729 falsifier blind audit 2500 5000 50000 window stability ladder permutation cyclic label locked cube taxicab null control 52 493 1730 1836'};
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
 function sourceSvg(body){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280">'+body+'</svg>')}
 function sewingPoster(){
  const paths=Array.from({length:7},(_,i)=>{const y=38+i*32,amp=18+i*2,color=['#39cee9','#ee6ca5','#e5b340'][i%3];return '<path d="M35 '+y+' C 90 '+(y-amp)+' 145 '+(y+amp)+' 200 '+y+' S 310 '+(y-amp)+' 365 '+y+' S 420 '+(y+amp)+' 445 '+y+'" fill="none" stroke="'+color+'" stroke-width="2" opacity="'+(.45+i*.07)+'"/>';}).join('');
  return sourceSvg('<rect width="480" height="280" fill="#05151f"/><g>'+paths+'</g><circle cx="240" cy="140" r="92" fill="none" stroke="#a77de8" opacity=".45"/><path d="M240 30V250 M125 140H355" stroke="#9eb7c5" stroke-dasharray="4 7" opacity=".4"/><text x="24" y="258" fill="#a9c0cc" font-family="monospace" font-size="12">SEWING · 7 LESESTUFEN · EIGENE UHR</text>');
 }
 function atlasPoster(){
  const colors=['#36d1ea','#e3c147','#42ce92','#ee6ca5','#9c7be8','#f28f46','#6fb7ff','#d66bd7','#f05f66'];
  const cells=colors.map((color,i)=>{const x=42+(i%3)*142,y=24+Math.floor(i/3)*78,n=i+1;return '<g><rect x="'+x+'" y="'+y+'" width="112" height="58" rx="5" fill="#0b2430" stroke="'+color+'"/><circle cx="'+(x+25)+'" cy="'+(y+29)+'" r="12" fill="none" stroke="'+color+'"/><path d="M'+(x+47)+' '+(y+21)+'H'+(x+94)+' M'+(x+47)+' '+(y+31)+'H'+(x+84)+' M'+(x+47)+' '+(y+41)+'H'+(x+73)+'" stroke="'+color+'" opacity=".8"/><text x="'+(x+6)+'" y="'+(y+13)+'" fill="'+color+'" font-family="monospace" font-size="9">0'+n+'</text></g>';}).join('');
  return sourceSvg('<rect width="480" height="280" fill="#05151f"/>'+cells+'<text x="42" y="270" fill="#a9c0cc" font-family="monospace" font-size="12">3 WELTEN · 3 LESUNGEN · 3 ANSCHLÜSSE</text>');
 }
 const GROUP_COLOR={SOURCE:'#39cee9',STATE:'#e5b340',OPERATE:'#ee6ca5',VIEW:'#9c7be8',RETURN:'#69d39a',VERIFY:'#f28f46'};
 function gridDots(cols,rows,x,y,gap,seed){
  let out='';for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const on=((row*cols+col+seed)%5)<2;out+='<circle cx="'+(x+col*gap)+'" cy="'+(y+row*gap)+'" r="'+(on?3.1:1.7)+'" fill="'+(on?'currentColor':'none')+'" opacity="'+(on?.88:.42)+'"/>';}
  return out;
 }
 function contractMotif(m){
  const motifs={
   'body-route':'<g transform="translate(88 35)">'+gridDots(8,6,0,0,20,1)+'</g><path d="M300 60l70 38v76l-70 38-70-38V98z M230 98l70 38 70-38 M300 136v76"/>',
   'mask-clock':'<circle cx="168" cy="132" r="68"/><circle cx="168" cy="132" r="44"/><path d="M168 132l45-32 M286 72v120 M270 176l16 16 16-16"/><text x="320" y="137">TICK</text>',
   'integration':'<g transform="translate(35 50)">'+gridDots(8,6,0,0,16,2)+'</g><path d="M184 126h60 M226 109l18 17-18 17"/><g transform="translate(278 66)">'+gridDots(7,4,0,0,22,3)+'</g><text x="54" y="210">48 KEYS</text><text x="300" y="210">28 BINS</text>',
   'breath-grid':'<path d="M58 62h150v140H58z M88 62v140 M118 62v140 M148 62v140 M178 62v140 M58 90h150 M58 118h150 M58 146h150 M58 174h150"/><circle cx="133" cy="132" r="53"/><path d="M273 62h155v140H273z"/><ellipse cx="350" cy="132" rx="66" ry="42"/><path d="M226 132h30 M246 120l12 12-12 12"/>',
   'division-return':'<path d="M45 70h315l45 34-45 34H45 M405 170H90l-45 34 45 34h315"/><text x="62" y="61">3 SOURCE CONTRACTS</text><text x="250" y="194">INTEGER RETURN</text>',
   'number-return':'<text x="55" y="150" font-size="72">9 · 7 · 8</text><path d="M288 105h105l28 28-28 28H288"/><text x="310" y="150" font-size="38">8 · 7 · 9</text>',
   'source-bank':'<g>'+[0,1,2,3].map((n)=>'<rect x="'+(42+n*103)+'" y="62" width="78" height="86" rx="8"/><circle cx="'+(81+n*103)+'" cy="105" r="18"/><path d="M'+(81+n*103)+' 148v42"/>').join('')+'</g><path d="M81 190h309 M235 190v38"/><text x="174" y="254">SOURCE-OWNED</text>',
   'native-face':'<path d="M92 65l64-28 55 43-20 70h-70L92 65z M269 65l64-28 55 43-20 70h-70l-29-85z"/><path d="M191 150l71 52 36-52 M211 80h58"/><text x="102" y="182">BLUE</text><text x="322" y="182">PINK</text><text x="204" y="241">FACE RECORD</text>',
   'pent':'<g>'+[0,1,2,3,4,5].map(n=>'<rect x="'+(62+(n%3)*122)+'" y="'+(52+Math.floor(n/3)*88)+'" width="96" height="62" rx="7"/><text x="'+(74+(n%3)*122)+'" y="'+(88+Math.floor(n/3)*88)+'">FIELD '+(n+1)+'</text>').join('')+'</g><text x="151" y="246">RENDERED READBACK</text>',
   'life03':'<g transform="translate(94 43)">'+gridDots(12,8,0,0,22,4)+'</g><path d="M74 226h330"/><text x="137" y="252">SOURCE CLOCK · OWNED</text>',
   'family-role':'<path d="M55 134h370"/>'+[1,2,3,4,5,6,7].map((n,i)=>'<circle cx="'+(70+i*56)+'" cy="134" r="18"/><text x="'+(60+i*56)+'" y="140">F'+n+'</text>').join('')+'<text x="142" y="210">LOCAL READING LENS</text>',
   'ail':'<path d="M104 188L240 56l136 132z"/><circle cx="104" cy="188" r="22"/><circle cx="240" cy="56" r="22"/><circle cx="376" cy="188" r="22"/><text x="96" y="195">A</text><text x="235" y="63">i</text><text x="371" y="195">l</text>',
   'visual1':'<g>'+[[55,55],[190,55],[325,55],[190,155]].map((p,i)=>'<rect x="'+p[0]+'" y="'+p[1]+'" width="100" height="70" rx="6"/><text x="'+(p[0]+38)+'" y="'+(p[1]+41)+'">'+['P','A','I','T'][i]+'</text>').join('')+'</g>',
   'family-grid':'<rect x="55" y="62" width="105" height="145"/><rect x="188" y="62" width="105" height="145"/><rect x="320" y="62" width="105" height="145"/><text x="81" y="137">LIFE</text><text x="210" y="137">PLATE</text><text x="332" y="137">CYLINDER</text>',
   'ninefold':'<rect x="55" y="45" width="105" height="70"/><rect x="320" y="45" width="105" height="70"/><rect x="55" y="165" width="105" height="70"/><rect x="320" y="165" width="105" height="70"/><circle cx="240" cy="140" r="49"/><text x="222" y="147">RETURN</text>',
   'economy':'<circle cx="240" cy="140" r="82"/>'+[[240,38],[342,140],[240,242],[138,140]].map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="25"/><text x="'+(p[0]-8)+'" y="'+(p[1]+6)+'">C'+(i+1)+'</text>').join('')+'<path d="M262 44l18 6-14 13 M348 162l-6 18-13-14 M218 236l-18-6 14-13 M132 118l6-18 13 14"/>',
   'binder':'<path d="M45 55h105 M45 105h105 M45 155h105 M45 205h105 M150 55l100 70 M150 105l100 20 M150 155l100-20 M150 205l100-70"/><rect x="250" y="82" width="160" height="116" rx="9"/><text x="283" y="146">BINDER</text>',
   'replay':'<path d="M330 72A100 100 0 1 0 338 190 M330 72V28 M330 72h44"/><rect x="180" y="102" width="120" height="76" rx="8"/><text x="206" y="145">v1 · ACK</text>',
   'history':'<path d="M42 220h396 M65 202l58-48 52 22 61-88 55 43 58-70 66 37"/><circle cx="415" cy="98" r="9"/><text x="55" y="252">RETAINED TRACE · RESIDUAL</text>',
   'root5-blind-audit':'<rect x="50" y="55" width="105" height="145"/><rect x="188" y="55" width="105" height="145"/><rect x="325" y="55" width="105" height="145"/><path d="M50 105h105 M188 105h105 M325 105h105"/><text x="72" y="88">1728</text><text x="210" y="88">1729</text><text x="347" y="88">1730</text><path d="M62 164h82 M200 147h82 M337 177h82"/><text x="144" y="244">BLIND WINDOW LADDER</text>'
  };
  if(motifs[m.id])return motifs[m.id];
  let hash=2166136261;for(const ch of m.id)hash=(hash^ch.charCodeAt(0))*16777619>>>0;
  const points=Array.from({length:7},(_,i)=>{const a=(i/7)*Math.PI*2,r=54+((hash>>i)&31),x=240+Math.cos(a)*r,y=132+Math.sin(a)*r;return [x.toFixed(1),y.toFixed(1)];});
  const acronym=m.label.split(/[^A-Za-z0-9]+/).filter(Boolean).slice(0,4).map(x=>x[0]).join('').toUpperCase();
  return '<polygon points="'+points.map(p=>p.join(',')).join(' ')+'"/><circle cx="240" cy="132" r="36"/><text x="240" y="141" text-anchor="middle" font-size="24">'+esc(acronym)+'</text>'+points.map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(5+(hash>>i&3))+'"/>').join('');
 }
 function contractPoster(m){
  if(!m)return null;const color=GROUP_COLOR[m.group]||'#39cee9',binding=Map.BINDING_TYPES[m.bindingType]?.label||m.bindingType;
  const body='<rect width="480" height="280" fill="#05151f"/><text x="24" y="26" fill="'+color+'" font-family="monospace" font-size="11" font-weight="700">'+esc(m.id.toUpperCase())+' · '+esc(binding)+'</text><g fill="none" stroke="'+color+'" stroke-width="2.2" color="'+color+'" font-family="monospace" font-size="13">'+contractMotif(m)+'</g><text x="456" y="260" text-anchor="end" fill="#8fa9b7" font-family="monospace" font-size="10">CONTRACT PREVIEW · KEINE QUELLANSICHT</text>';
  return{kind:'bound-contract',label:'Modulvertrag · eigene gebundene Miniatur',url:sourceSvg(body)};
 }
 function boundPreview(moduleOrId,win){
  const m=typeof moduleOrId==='string'?Map.moduleById(moduleOrId):moduleOrId,id=m?.id||moduleOrId;
  if(id==='body-route'&&win.A0BenchBodyGallery){
   const gallery=win.A0BenchBodyGallery,item=gallery.ITEMS?.[0];
   if(item)return{kind:'bound-body',label:'Gebundene Körpergeometrie · feste Ansicht',url:sourceSvg(gallery.svg(item).replace(/^<svg[^>]*>|<\/svg>$/g,''))};
  }
  if(id==='glb-archive')return{kind:'bound-image',label:'Gebundene GLB-Bestandsansicht · Crystal View',url:'assets/images/crystal_view_poster.jpeg'};
  if(id==='sewing')return{kind:'bound-schematic',label:'Quellskizze · Sewing-Partitur',url:sewingPoster()};
  if(id==='game-atlas')return{kind:'bound-schematic',label:'Quellskizze · vorhandener 3 × 3-Atlas',url:atlasPoster()};
  return contractPoster(m);
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
  let markup='<div class="btc-heading"><div><small>VISUELLER WERKZEUGKATALOG · BESTEHENDE BENCH-MAP</small><h3>Welches Werkzeug suchst du?</h3><p>39 Module · Gruppen auswählen, suchen und direkt öffnen. Bilder sind eingefrorene Ansichten, keine zweite Simulation.</p></div><button type="button" data-btc-refresh>Vorschaubilder aktualisieren</button></div><div class="btc-filters"><label>Suche <input type="search" data-btc-query placeholder="z. B. Pascal, Grid, Observer, Return" autocomplete="off"></label><label>Bindung <select data-btc-binding><option value="ALL">Alle Bindungstypen</option>'+Object.entries(Map.BINDING_TYPES).map(([id,v])=>'<option value="'+id+'">'+esc(v.label)+'</option>').join('')+'</select></label><button type="button" data-btc-clear>Zurücksetzen</button></div><nav class="btc-groups" aria-label="Werkzeuge nach Arbeitsbereich filtern"><button type="button" data-btc-group="ALL" aria-pressed="true">Alle · '+Map.MODULES.length+'</button>'+Map.GROUPS.map(g=>'<button type="button" data-btc-group="'+g.id+'" aria-pressed="false">'+NAMES[g.id]+' · '+Map.MODULES.filter(m=>m.group===g.id).length+'</button>').join('')+'</nav><output data-btc-count role="status" aria-live="polite"></output><div class="btc-grid" data-btc-grid></div><p data-btc-empty hidden>Kein Werkzeug passt zu dieser Suche. Suche oder Filter zurücksetzen.</p><p class="btc-note">Vorschaubilder lesen vorhandene Grafiken, wenn das Modul sie bereits gerendert hat. Sonst erscheint eine eigene, aus ID und Modulvertrag gebildete Miniatur — ausdrücklich keine Quellansicht. Öffnen startet keine Quelle und lädt keinen GLB automatisch. Details und Abnahmegrenzen stehen im jeweiligen Modul.</p>';
  markup=markup.replace('<button type="button" data-btc-clear>','<label>Menü-Raster <select data-btc-layout><option value="auto">Nach Arbeitsbereich</option><option value="2">2 Spalten</option><option value="3">3 Spalten</option><option value="4">4 Spalten</option></select></label><button type="button" data-btc-clear>').replace('<nav class="btc-groups"','<p class="btc-note">Kachel / Zusammenhang öffnet das vorhandene Orientierungsfenster; „Zum Modul“ springt direkt zum Werkzeug. <a href="A0_LIVING_BLUEPRINT.html#a0-map-home">Große Orientierungsmap ↗</a>. Kontext ist Navigation, kein neuer Datenadapter. Das Menü-Raster verändert keine Quellgrids.</p><nav class="btc-groups"').replace('39 Module',Map.MODULES.length+' Module der bestehenden Bench-Map');
  host.innerHTML=markup;
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
    const m=Map.moduleById(card.dataset.btcCard),p=preview(doc.getElementById(m.focusTarget),doc,win),bound=p.url?null:boundPreview(m,win),shown=bound||p,image=card.querySelector('[data-btc-image]');
    image.src=shown.url;
    image.alt=(shown.kind==='svg'||shown.kind==='canvas'?'Quellansicht: ':'Contract-Miniatur: ')+m.label;
    card.dataset.preview=shown.kind;card.querySelector('[data-btc-preview-label]').textContent=shown.label;
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
    if(key&&win.A0OrientationMapView?.openNode){event.preventDefault();win.A0OrientationMapView.openNode(key,context);return;}
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
 return{NAMES,contextKey,search,sketch,sewingPoster,atlasPoster,contractPoster,boundPreview,preview,mount};
});
