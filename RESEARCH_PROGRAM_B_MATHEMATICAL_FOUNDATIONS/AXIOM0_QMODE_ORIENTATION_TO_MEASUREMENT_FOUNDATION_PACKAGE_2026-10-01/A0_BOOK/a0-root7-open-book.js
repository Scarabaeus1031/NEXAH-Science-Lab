(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Root7Book=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.1.0',A=1/Math.sqrt(3);
const wings=typeof module==='object'&&module.exports?require('./a0-root7-wing-sequence.js'):globalThis.A0WingSequence;
// Local page coordinates (u,v). Rhombus O-U-T-D plus two hinge triangles.
const local={top:[0,1],upper:[A,1],tip:[2*A,0],lower:[A,-1],bottom:[0,-1],center:[0,0]};
const pageKeys=['top','upper','tip','lower','bottom'],rhombusKeys=['center','upper','tip','lower'];
function fold(p,side,angle){const h=angle*Math.PI/360,x=side*p[0]*Math.sin(h);return[x===0?0:x,p[1],p[0]*Math.cos(h)];}
function snapshot(tick,layer,options={}){
  const {mode='manual',angle=120,focus='both'}=options;
  if(!Number.isInteger(tick)||tick<0||tick>15||![0,1].includes(layer))throw new TypeError('valid source tick/layer required for book');
  if(!['manual','follow','sequence'].includes(mode)||!Number.isFinite(angle)||angle<0||angle>180||!['both','left','right'].includes(focus))throw new TypeError('invalid book options');
  const effectiveAngle=mode==='sequence'?wings.PHASES[tick][2]:mode==='follow'?22.5*Math.min(tick,16-tick):angle;
  const pages=[-1,1].map(side=>{
    const points=Object.fromEntries(Object.entries(local).map(([key,p])=>[key,fold(p,side,effectiveAngle)]));
    return{side:side<0?'left':'right',labels:side<0?['1','6','L*','5','4']:['1','2','R*','3','4'],points,vertices:pageKeys.map(k=>points[k]),rhombus:rhombusKeys.map(k=>points[k]),triangles:[[points.top,points.upper,points.center],[points.center,points.lower,points.bottom]],pageArea:3*A,rhombusArea:2*A};
  });
  const record={schema:'nexah.a0.root7-open-book-view/1',version:VERSION,status:'DECLARED_CONSTRUCTION',sourceTick:tick,sourceLayer:layer,options:{mode,angle:effectiveAngle,focus},geometry:{halfHeight:1,a:A,localPage:pageKeys.map(k=>local[k]),rhombus:rhombusKeys.map(k=>local[k]),pages,hinge:{top:[0,1,0],center:[0,0,0],bottom:[0,-1,0]},mirror:{rule:'(x,y,z) -> (-x,y,z)',pairs:[['6','2'],['5','3'],['L*','R*']],fixed:['1','O','4'],involutive:true},flatOutline:effectiveAngle===180?'HEXAGON_WITH_TWO_COLLINEAR_HINGE_WITNESSES':null,topology:{pageVertexIdentitiesAfterHingeSharing:8,closedPagesGeometricallyCoincident:true,hingeCenterWitness:1,sourceImageNumberedPositionsNotGraphCensus:true},areas:{pagesTotal:6*A,rhombiTotal:4*A,fourTrianglesTotal:2*A}},return:{hingeFixed:true,sourceStateModified:false,screenInverseClaim:false},boundary:'Declared non-regular pentagons, not recovered source coordinates. Source labels 1/4,6/2,5/3 retained as a visual correspondence. L*/R* are added construction vertices. Two rhombi plus four triangles fill the flat hexagon in this book model, not the stretch-cuboid section. Opening is not reciprocal Q-mirror, counter-rotation, field dynamics, a Riemann/primes mechanism or a fourth binary channel.'};
  record.wingSequence=wings.snapshot(tick,mode,effectiveAngle,options);
  record.options={...record.options,...record.wingSequence.options};record.return.activePosePath='wingSequence.facets';record.return.geometryScope='geometry retains the original local spine-construction map; wingSequence contains the active crease, rigid pose and observation cuts';return record;
}
function readOptions(doc){const val=(id,fallback)=>{const e=doc.getElementById(id);return e&&e.value!==undefined?e.value:fallback;};return{mode:val('root7BookMode','manual'),angle:Number(val('root7BookAngle',120)),focus:val('root7BookFocus','both'),crease:val('root7BookCrease','spine'),branch:val('root7BookBranch','front'),turn:Number(val('root7BookTurn',0)),tilt:Number(val('root7BookTilt',0)),palette:val('root7BookPalette','source'),cutAngle:Number(val('root7BookCutAngle',0)),cutOffset:Number(val('root7BookCutOffset',0))};}
const ps=points=>points.map(p=>p.join(',')).join(' ');
function drawing(r){
  if(r.wingSequence)return wings.drawing(r.wingSequence,r.options.focus);
  const line=(p,q,c,w=1,dash='')=>'<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+q[0]+'" y2="'+q[1]+'" stroke="'+c+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'"/>';
  const tx=(x,y,s,c='#afc4cf')=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" font-size="12" font-family="ui-monospace,monospace">'+s+'</text>';
  const project=p=>[215+122*(.86*p[0]+.5*p[2]),195-122*(p[1]+.22*p[2])];
  const flat=(p,side)=>[620+112*side*p[0],195-112*p[1]];
  let out='<title>Offenes Buch: zwei Pentagon-Seiten auf Rhombenbasis</title><desc>Links aktuelle räumliche Öffnung; rechts immer dieselbe flache Konstruktionskarte. Die linke Seite ist violett, die rechte gold. Zusätzliche Modellspitzen sind mit Stern markiert.</desc>';
  out+=tx(20,25,'BUCHRAUM · '+r.options.angle.toFixed(1)+'°','#62dfa0')+tx(465,25,'FLACHE BASIS · immer 180°')+tx(20,48,'1 — O — 4: gemeinsamer Rücken')+tx(465,48,'2 Rhomben + 4 Randdreiecke');
  const emit=(page,pr,opacity)=>{
    const color=page.side==='left'?'#b387ff':'#efbd59';
    let s='<g opacity="'+opacity+'"><polygon points="'+ps(page.vertices.map(pr))+'" fill="'+color+'18" stroke="'+color+'" stroke-width="2.4"/>';
    s+='<polygon points="'+ps(page.rhombus.map(pr))+'" fill="'+color+'55" stroke="'+color+'" stroke-width="1.4"/>';
    page.triangles.forEach(tri=>{s+='<polygon points="'+ps(tri.map(pr))+'" fill="none" stroke="'+color+'" stroke-width="1" stroke-dasharray="4 4"/>';});
    page.vertices.forEach((p,i)=>{if(i===0||i===4)return;const q=pr(p);s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="4" fill="'+color+'"/>'+tx(q[0]+7,q[1]-7,page.labels[i],color);});
    return s+'</g>';
  };
  r.geometry.pages.forEach(page=>{const side=page.side==='left'?-1:1,opacity=r.options.focus==='both'||r.options.focus===page.side?1:.16;out+=emit(page,project,opacity);const flatPage={...page,vertices:pageKeys.map(k=>[...local[k],0]),rhombus:rhombusKeys.map(k=>[...local[k],0]),triangles:[[local.top,local.upper,local.center],[local.center,local.lower,local.bottom]]};out+=emit(flatPage,p=>flat(p,side),opacity);});
  out+=line(project(r.geometry.hinge.top),project(r.geometry.hinge.bottom),'#dceaf0',3)+line(flat(local.top,1),flat(local.bottom,1),'#dceaf0',3);
  for(const [label,key]of [['1','top'],['O','center'],['4','bottom']]){for(const p of [project(r.geometry.hinge[key]),flat(local[key],1)])out+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#dceaf0"/>'+tx(p[0]+8,p[1]-8,label,'#dceaf0');}
  out+=tx(20,350,'6 ↔ 2 · 5 ↔ 3 · L* ↔ R*','#b387ff')+tx(465,350,'* L/R sind ergänzte Modellspitzen')+tx(20,375,'Räumliche Projektion ≠ Seitenmetrik')+tx(465,375,'Hexagon hier ≠ Root7-Quaderschnitt');
  return out;
}
function render(doc,record){
  const svg=doc.getElementById('root7BookSvg'),ledger=doc.getElementById('root7BookLedger');if(!svg||!ledger)return;
  const r=record.bookView;svg.innerHTML=drawing(r);
  const cutSvg=doc.getElementById('root7WingCutSvg');if(cutSvg)cutSvg.innerHTML=wings.cutDrawing(r.wingSequence);
  ledger.textContent='TICK '+r.sourceTick+' · w='+r.sourceLayer+' · Öffnung '+r.options.angle.toFixed(1)+'° · lokaler Konstruktionsrücken · Spiegel M²=id · Seitenfläche je '+(3*A).toFixed(4)+' · '+(r.options.angle===0?'GESCHLOSSEN / Seiten überdecken sich':r.options.angle===180?'FLACH / Hexagon':'AUFGEKLAPPT');
  ledger.textContent+=' · '+r.wingSequence.options.phase+' · '+r.wingSequence.options.turn+'° CCW · Knicklinie bewegt / Referenz fest'+(r.wingSequence.viewReturn?' · VIEW_RETURN_EXACT_POSE / kein Quellreturn':'');
  const slider=doc.getElementById('root7BookAngle');if(slider){slider.disabled=r.options.mode!=='manual';if(slider.disabled)slider.value=r.options.angle;}
  for(const [id,key]of [['root7BookCrease','crease'],['root7BookBranch','branch'],['root7BookTurn','turn']]){const el=doc.getElementById(id);if(el){el.disabled=r.options.mode==='sequence';if(el.disabled)el.value=r.options[key];}}
}
return{VERSION,A,fold,snapshot,readOptions,drawing,render};
});
