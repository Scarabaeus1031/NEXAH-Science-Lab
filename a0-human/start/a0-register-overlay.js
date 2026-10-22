/* Source-clock view adapter. No address conversion, independent timer, or physical fusion. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./assets/a0-tesa-grid-candidate.js'):root.A0TesaGridCandidate);if(typeof module==='object'&&module.exports)module.exports=api;root.A0RegisterOverlayModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(tesa){
  'use strict';
  const modes=['tesa','eight'],effects=['still','drift','wobble','opacity','combined'];
  const zone=Object.freeze({x:430,y:100,width:40,height:240});
  function settings(o={}){const mode=o.mode??'tesa',effect=o.effect??'combined';if(!modes.includes(mode)||!effects.includes(effect))throw new RangeError('register mode/effect');return{mode,effect};}
  function intersect(a,b){const x=Math.max(a.x,b.x),y=Math.max(a.y,b.y),width=Math.min(a.x+a.width,b.x+b.width)-x,height=Math.min(a.y+a.height,b.y+b.height)-y;return width>0&&height>0?{x,y,width,height}:null;}
  function cells(mode,layer){
    if(!modes.includes(mode)||!['A','B'].includes(layer))throw new RangeError('register address space');
    if(mode==='tesa')return tesa.fixture.values.map(address=>{const p=tesa.cell(address);return{id:`${layer}:TESA:${address}`,address,row:p.row,col:p.col,x:114+p.col*96,y:132+p.row*44,width:96,height:44};});
    return Array.from({length:8},(_,i)=>({id:`${layer}:8:${i+1}`,address:i+1,row:layer==='A'?0:1,col:i,x:114+i*84,y:layer==='A'?132:276,width:84,height:44}));
  }
  function pose(time,o={},reduced=false){
    if(!Number.isFinite(time)||time<0)throw new RangeError('finite nonnegative source elapsed');
    const config=settings(o),t=reduced?0:time,drift=['drift','combined'].includes(config.effect),wobble=['wobble','combined'].includes(config.effect),fade=['opacity','combined'].includes(config.effect);
    const layers=['A','B'].map((name,i)=>{const sign=i?1:-1,dx=sign*((drift?20*Math.sin(t*.25):0)+(wobble?2*Math.sin(t*2):0)),dy=sign*(wobble?1.5*Math.sin(t*1.5):0),opacity=fade?.5+sign*.15*Math.sin(t*.5):.65;
      return{name,dx,dy,opacity,cells:cells(config.mode,name).map(c=>{const displayed={x:c.x+dx,y:c.y+dy,width:c.width,height:c.height};return{...c,displayed,zoneIntersection:intersect(displayed,zone)};})};});
    return{...config,time,reducedMotion:reduced,zone:{...zone},layers,externalMarkers:config.mode==='tesa'?[29]:[],rule:'TESA addresses reuse documentary fixture. 8 ị 8 contains separate A/B addresses. Translations in SVG view units; opacity 0.35..0.65. Zone intersection is display geometry, not numeric fusion, a recovered generator, or a mapping to 60 body cells.'};
  }
  function delta(a,b){if(![a,b].every(Number.isFinite))return 0;return b>=a?b-a:b-a+2*Math.PI;}
  return{modes,effects,zone,settings,intersect,cells,pose,delta};
});
(() => {
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('registerOverlay'),view=window.A0ThreeLissajousPlanesView,model=window.A0RegisterOverlayModel;
  if(!host||!view||!model)return;
  const svg=$('registerOverlaySvg'),ns='http://www.w3.org/2000/svg',media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed=0,previous=view.snapshot.clock,lastDraw=-Infinity,held=null;
  const options=()=>({mode:$('registerMode').value,effect:$('registerEffect').value});
  const add=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;svg.appendChild(el);return el;};
  function snapshot(){return{kind:'REGISTER_OVERLAY_VIEW_ADAPTER',sourceClock:view.snapshot.clock,sourceState:JSON.parse(JSON.stringify(view.state)),pose:model.pose(elapsed,options(),media.matches),provenance:{tesa:'assets/a0-tesa-grid-candidate.js · existing documentary fixture; 29 external',eight:'Owner 81D461F2-6DDB-4C68-B6C7-EF5CC20DBEF8_1_102_o.jpeg · layout inspiration, not historical reconstruction',motion:'Owner C4EB13E9-FCFE-47C0-BA71-787679EAAADA_1_105_c.jpeg · motion names, not measured rates'},boundary:'No address conversion between TESA, 8 ị 8 and 60-cell bodies; ị is the owner-defined closure/Return notation.'};}
  function draw(){const p=model.pose(elapsed,options(),media.matches);svg.replaceChildren();
    add('rect',{x:0,y:0,width:900,height:420,fill:'#020d15'});
    add('text',{x:40,y:34,fill:'#dff2f7','font-size':17},p.mode==='tesa'?'TESA · 4 × 7 · 28 innere Adressen':'8 ị 8 · zwei getrennte Achterregister');
    add('text',{x:40,y:62,fill:'#93aebc','font-size':12},'Grau: feste Referenz · Cyan A / Pink B: bewegte Überlagerungen');
    const references=p.mode==='tesa'?model.cells('tesa','A'):[...model.cells('eight','A'),...model.cells('eight','B')];
    references.forEach(c=>{add('rect',{x:c.x,y:c.y,width:c.width,height:c.height,fill:'none',stroke:'#53646c','stroke-width':1,'data-role':'register-reference'});add('text',{x:c.x+9,y:c.y+26,fill:'#7f929c','font-size':12},p.mode==='tesa'?c.address:`${c.row?'B':'A'}${c.address}`);});
    add('rect',{...p.zone,fill:'#e5b340',opacity:.12,stroke:'#ffe397','stroke-width':1,'data-role':'closure-zone'});
    for(const layer of p.layers){const color=layer.name==='A'?'#29c7ef':'#ee6ca5';for(const c of layer.cells){add('rect',{...c.displayed,fill:color,'fill-opacity':.035,stroke:color,'stroke-opacity':layer.opacity,'stroke-width':1.7,'data-role':'register-cell','data-address':c.id});if(c.zoneIntersection)add('rect',{...c.zoneIntersection,fill:color,opacity:layer.opacity*.22,'data-role':'zone-overlap'});}
      add('text',{x:40,y:layer.name==='A'?365:389,fill:color,'font-size':12},`${layer.name} · Δx ${layer.dx.toFixed(2)} · Δy ${layer.dy.toFixed(2)} · Deckkraft ${layer.opacity.toFixed(2)}`);
    }
    if(p.mode==='tesa')for(const point of window.A0OneFlow?.mapping.points??[]){if(!point.cell)continue;const col=point.plane==='AM'?'#e5b340':point.plane==='VM'?'#29c7ef':'#ee6ca5';add('circle',{cx:114+(point.point[0]+1)*336,cy:132+(1-point.point[1])*88,r:5,fill:col,'data-role':'mapped-source','data-address':point.cell.address});}
    if(p.mode==='tesa')window.A0FlowGrid?.renderTesaReference(add,{x:114,y:132,width:96,height:44});
    add('text',{x:450,y:89,fill:'#ffe397','text-anchor':'middle','font-size':18},'ị · }{ · RETURN');
    if(p.mode==='tesa'){add('circle',{cx:825,cy:310,r:21,fill:'#020d15',stroke:'#ee6ca5','stroke-width':2});add('text',{x:825,y:315,fill:'#ee6ca5','text-anchor':'middle','font-size':14,'data-role':'external-29'},'29');}
    $('registerStatus').textContent=`${view.state.playing?'Gemeinsamer Zeitlauf':'Gehalten'} · Registerzeit ${elapsed.toFixed(2)} · ${p.effect} · ${p.layers.map(l=>`${l.name}: ${l.cells.filter(c=>c.zoneIntersection).length} Zellen schneiden die ị-Zone`).join(' / ')}${p.reducedMotion?' · reduzierte Bewegung: statische Darstellung':''}. Keine Adressverschmelzung.`;
  }
  function configure(mode,effect){model.settings({mode,effect});$('registerMode').value=mode;$('registerEffect').value=effect;draw();}
  function hold(){window.A0EnjoyLoop?.stop('Register-Return gehalten');view.setPlaying(false);view.refresh?.();held=JSON.parse(JSON.stringify(snapshot()));$('registerRecord').textContent=JSON.stringify(held,null,2);$('registerRecordDetails').open=true;window.A0RootRoomPhaseBridge?.select('RETURN');draw();}
  for(const id of ['registerMode','registerEffect'])$(id).addEventListener('change',draw);
  $('registerHold').addEventListener('click',hold);
  window.addEventListener('a0-lissajous-frame',event=>{const t=event.detail.clock;elapsed+=model.delta(previous,t);previous=t;if(elapsed-lastDraw>=.05||!view.state.playing){lastDraw=elapsed;draw();}});
  media.addEventListener?.('change',draw);
  window.A0RegisterOverlay={configure,hold,refresh:draw,get snapshot(){const s=snapshot();s.signalMapping=window.A0OneFlow?.mapping??null;return s;},get held(){return held?JSON.parse(JSON.stringify(held)):null;}};
  draw();
})();
