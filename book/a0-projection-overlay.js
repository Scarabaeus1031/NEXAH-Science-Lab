(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-root7-wing-sequence.js'):root.A0WingSequence,typeof module==='object'&&module.exports?require('./a0-layered-pentagon-scene.js'):root.A0LayeredPentagonScene);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0ProjectionOverlay=api;})(typeof globalThis!=='undefined'?globalThis:this,function(W,L){
'use strict';
const VERSION='1.0.0',LIMIT=64,PALETTE=[[244,67,54],[255,152,0],[255,235,59],[76,175,80],[33,150,243],[63,81,181],[156,39,176]],RB=[[238,91,115],[74,151,238]],clone=v=>JSON.parse(JSON.stringify(v));
function color(index,scheme,amount){if(!Number.isInteger(index)||index<0||!['redblue','spectrum'].includes(scheme)||!Number.isFinite(amount)||amount<0||amount>1)throw Error('invalid overlay colour');const c=(scheme==='redblue'?RB:PALETTE)[index%(scheme==='redblue'?2:7)],gray=c.reduce((s,x)=>s+x,0)/3;return'#'+c.map(x=>Math.round(gray+(x-gray)*amount).toString(16).padStart(2,'0')).join('');}
function frame(source,r){
 if(source==='stack'){L.validate(r);return{source,step:r.phase,options:{motion:r.mode},scene:clone(r),facets:r.pentagons.map((f,i)=>({id:f.id,channel:i%2,points:f.points.map(p=>[...p,0]),shadow:f.points.map(p=>[...p,0])})),cuts:[]};}
 if(!['book','5b'].includes(source)||!r||!Array.isArray(r.facets)||r.facets.length!==4)throw Error('missing overlay source');
 const facets=r.facets.map((f,i)=>{const shadow=source==='book'?f.model.map(p=>W.pose([p[0],p[1],0],r.options.turn,r.options.tilt)):f.shadow;
  if(!Array.isArray(f.points)||!Array.isArray(shadow)||f.points.length<3||shadow.length!==f.points.length||![...f.points,...shadow].every(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)))throw Error('invalid overlay geometry');
  return{id:f.id,channel:source==='book'?(f.side==='left'?0:1):i%2,points:clone(f.points),shadow:clone(shadow)};});
 const cuts=source==='book'?clone(r.cuts):[];
 if(!Array.isArray(cuts)||cuts.some(c=>!Array.isArray(c.segments)||c.segments.some(s=>!Array.isArray(s.points)||s.points.length!==2||!s.points.every(p=>p.length===3&&p.every(Number.isFinite)))))throw Error('invalid overlay cut');
 return{source,step:source==='book'?r.sourceTick:r.slice,options:clone(r.options),facets,cuts};
}
function createStore(){
 const states={book:{current:null,frames:[],dropped:0,error:null},'5b':{current:null,frames:[],dropped:0,error:null},stack:{current:null,frames:[],dropped:0,error:null}};
 function accept(source,r,record=true){const f=frame(source,r),s=states[source],key=JSON.stringify(f);s.current=f;s.error=null;if(record&&(!s.frames.length||JSON.stringify(s.frames[s.frames.length-1])!==key)){s.frames.push(clone(f));if(s.frames.length>LIMIT){s.frames.shift();s.dropped++;}}return clone(f);}
 function read(source){if(!states[source])throw Error('invalid overlay source');return clone(states[source]);}
 function clear(source){if(!states[source])throw Error('invalid overlay source');states[source].frames=[];states[source].dropped=0;}
 function fail(source){if(states[source])states[source].error='HOLD · ungültige Quelldaten';}
 return{accept,read,clear,fail};
}
const defaults={scheme:'redblue',amount:1,current:true,shadow:true,echo:true,cuts:true};
function settings(o={}){const v={...defaults,...o};color(0,v.scheme,v.amount);for(const k of ['current','shadow','echo','cuts'])if(typeof v[k]!=='boolean')throw Error('invalid overlay layer');return v;}
function drawing(state,o={}){
 o=settings(o);const current=state.current;if(state.error||!current)return'<title>Overlay wartet</title><text x="30" y="50" fill="#efbd59" font-size="16">'+(state.error?'HOLD · ungültige Quelldaten':'WAITING · Quelle noch nicht gelesen')+'</text>';
 if(current.source==='stack'){const last=state.frames.at(-1),past=last&&JSON.stringify(last)===JSON.stringify(current)?state.frames.slice(0,-1):state.frames;return L.drawing(current.scene,o,past.map(f=>f.scene));}
 const p=q=>[270+112*q[0],225-112*q[1]],poly=ps=>ps.map(p).map(q=>q.join(',')).join(' '),line=(a,b,c,w=1,dash='')=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+c+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'"/>',tx=(x,y,t,c='#bad0da')=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" font-size="13" font-family="system-ui,sans-serif">'+t+'</text>';
 let out='<title>Quellgebundener Projektions-Overlay: Pose, Schatten, Echo und Schnitte</title><desc>Farbumschaltung verändert keine Geometrie. Grau ist kein Übereinstimmungsnachweis. Nur die ausgewählte Quelle wird gezeigt.</desc>'+line([40,225],[500,225],'#526976',1,'4 5')+line([270,40],[270,410],'#526976',1,'4 5');
 const last=state.frames[state.frames.length-1],echoes=last&&JSON.stringify(last)===JSON.stringify(current)?state.frames.slice(0,-1):state.frames;
 if(o.echo)echoes.forEach((f,j)=>{const alpha=(.05+.18*(j+1)/Math.max(1,echoes.length)).toFixed(3);out+='<g opacity="'+alpha+'" data-overlay="echo">';for(let i=0;i<f.facets.length;i++){const facet=f.facets[i],c=color(o.scheme==='spectrum'?i:facet.channel,o.scheme,o.amount);out+='<polygon points="'+poly(facet.points)+'" fill="none" stroke="'+c+'" stroke-dasharray="3 5"/>';if(o.shadow)out+='<polygon points="'+poly(facet.shadow)+'" fill="none" stroke="'+c+'" stroke-dasharray="8 4"/>';}if(o.cuts)f.cuts.forEach((c,i)=>c.segments.forEach(s=>{const channel=f.facets.find(f=>f.id===s.facet)?.channel||0;out+=line(...s.points.map(p),color(o.scheme==='spectrum'?i+4:channel,o.scheme,o.amount),1,'3 5');}));out+='</g>';});
 if(o.shadow)current.facets.forEach((f,i)=>{out+='<polygon points="'+poly(f.shadow)+'" fill="'+color(o.scheme==='spectrum'?i:f.channel,o.scheme,o.amount)+'" fill-opacity=".09" stroke="'+color(o.scheme==='spectrum'?i:f.channel,o.scheme,o.amount)+'" stroke-width="1" stroke-dasharray="8 4" data-overlay="shadow"/>';});
 if(o.current)current.facets.forEach((f,i)=>{out+='<polygon points="'+poly(f.points)+'" fill="'+color(o.scheme==='spectrum'?i:f.channel,o.scheme,o.amount)+'" fill-opacity=".12" stroke="'+color(o.scheme==='spectrum'?i:f.channel,o.scheme,o.amount)+'" stroke-width="2" data-overlay="current"/>';});
 if(o.cuts)current.cuts.forEach((c,i)=>c.segments.forEach(s=>{const channel=current.facets.find(f=>f.id===s.facet)?.channel||0;out+='<g data-overlay="cut">'+line(...s.points.map(p),color(o.scheme==='spectrum'?i+4:channel,o.scheme,o.amount),3)+'</g>';}));
 out+='<circle cx="270" cy="225" r="4" fill="#fff"/>'+tx(280,218,'O');
 out+=tx(32,28,current.source==='book'?'BUCH · tatsächlich gelesene Pose':'5B · tatsächlich gelesene Pose','#eef7fb')+tx(540,52,'EIN REFERENZRAHMEN', '#eef7fb')+tx(540,84,'Pose: durchgezogene Kontur')+tx(540,112,'Schatten: lange Striche')+tx(540,140,'Echo: kurze Striche')+tx(540,168,current.cuts.length?'Schnitte: aktuelle Buchpose':'Schnitte: für 5B nicht definiert')+tx(540,212,'Aufgezeichnet: '+state.frames.length+' / '+LIMIT)+tx(540,240,'Ältere verworfen: '+state.dropped)+tx(540,286,'Grau ≠ geometrische Gleichheit')+tx(32,437,'Schritt '+current.step+' · nur ausgewählte Quelle · Geometrie unverändert');
 for(let i=0;i<7;i++)out+='<rect x="'+(540+i*33)+'" y="330" width="28" height="32" fill="'+color(i,'spectrum',o.amount)+'"/>';
 return out+tx(540,386,'Grau → Spektrum · Displayfarben');
}
function mount(doc){
 const el=id=>doc.getElementById(id);if(!el('projectionOverlaySvg'))return null;const store=createStore();
 const opts=()=>({scheme:el('projectionOverlayPalette').value,amount:Number(el('projectionOverlayGrey').value),stackLayers:L?.readLayers(doc),...Object.fromEntries(['current','shadow','echo','cuts'].map(k=>[k,el('projectionOverlay'+k[0].toUpperCase()+k.slice(1)).checked]))});
 const render=()=>{const source=el('projectionOverlaySource').value,s=store.read(source);el('projectionOverlaySvg').innerHTML=drawing(s,opts());el('projectionOverlayStatus').textContent=s.error||(({book:'Buch','5b':'5B',stack:'Schichten'}[source])+' · '+(s.current?'Schritt '+s.current.step:'WAITING')+' · Spur '+s.frames.length+'/'+LIMIT+' · verworfen '+s.dropped+' · Farbe '+Math.round(opts().amount*100)+'%'+(el('projectionOverlayRecord').checked?' · Aufzeichnung an':' · Aufzeichnung pausiert'));return s;};
 const accept=(source,r)=>{try{store.accept(source,r,el('projectionOverlayRecord').checked);}catch(e){store.fail(source);}if(source===el('projectionOverlaySource').value)render();};
 for(const id of ['projectionOverlaySource','projectionOverlayPalette','projectionOverlayGrey','projectionOverlayCurrent','projectionOverlayShadow','projectionOverlayEcho','projectionOverlayCuts','projectionOverlayRecord'])el(id).addEventListener('input',render);
 if(L)for(const k of Object.keys(L.layerDefaults))el('layerScene_'+k)?.addEventListener('input',render);
 el('projectionOverlayClear').addEventListener('click',()=>{store.clear(el('projectionOverlaySource').value);render();});
 el('projectionOverlayExport').addEventListener('click',()=>{const source=el('projectionOverlaySource').value,payload={schema:'nexah.a0.projection-overlay/1',version:VERSION,source,settings:opts(),recording:el('projectionOverlayRecord').checked,...store.read(source),boundaries:{history:'Only visited source frames since this page load; latest 64 per source; no old conversations or automatic reconstruction.',shadow:'parallel model z=0 projection followed by original camera transform; no physical illumination',grey:'arithmetic mean of display R/G/B channels then linear colour interpolation; not physical luminance or equality',mixedSources:false,sourceMutation:false}},url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-projection-overlay.json';a.click();URL.revokeObjectURL(url);});
 render();return{accept,render,store,exportState:()=>({source:el('projectionOverlaySource').value,settings:opts(),recording:el('projectionOverlayRecord').checked,streams:{book:store.read('book'),'5b':store.read('5b'),stack:store.read('stack')}})};
}
return{VERSION,LIMIT,PALETTE,color,frame,createStore,settings,drawing,mount};
});
