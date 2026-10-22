(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-mask-assembly.js'):root.A0MaskAssembly,node?require('./a0-fold-lag-lens.js'):root.A0FoldLagLens);
  if(node)module.exports=api;else root.A0CompassAssembly=api;
})(typeof globalThis==='undefined'?this:globalThis,function(A,F){
  'use strict';
  const SCHEMA='a0.compass-assembly/1',clone=x=>JSON.parse(JSON.stringify(x));
  // One table of the original assembly's 121 signal readings, no independent clock.
  const samples=Array.from({length:121},(_,tick)=>A.snapshot({...A.create(),tick}).planes.map(p=>({id:p.id,point:p.point,shadow:p.shadow})));
  function reading(plane,tick){return clone(samples[tick].find(p=>p.id===plane));}
  function snapshot(s){
    A.validate(s);const current=reading(s.assembly.plane,s.tick),length=Math.hypot(...current.point);
    const slice=Math.round(s.tick*28/120),fold=F.snapshot(slice,{mode:'target',mirror:'none',lag:3});
    return {tick:s.tick,plane:current.id,centre:[0,0],tip:current.point,shadow:current.shadow,length,
      direction:length<1e-9?null:Math.atan2(current.point[1],current.point[0]),
      status:length<1e-9?'HOLD_DIRECTION_UNDEFINED_AT_CENTRE':'DIRECTED_NEEDLE',
      crosses:[0,3,6,9].filter(ago=>s.tick>=ago).map(ago=>({ago,tick:s.tick-ago,point:reading(current.id,s.tick-ago).point,role:ago?'RECOMPUTED_EARLIER_POSE':'CURRENT_POSE'})),
      trace:s.history.map(h=>({tick:h.tick,point:reading(current.id,h.tick).point})),
      traceMeaning:'Stored visited ticks reprojected through the currently selected signal pair; not a log of previous plane selections.',
      discarded:s.dropped,selectionRing:{slice,total:29,mapping:'round(localTick*28/120); display sampling only'},
      fold:{source:'a0-fold-lag-lens.js',options:fold.options,turn:fold.turn,facets:fold.facets,referenceCrossFixed:fold.referenceCrossFixed},
      boundary:'Four temporal needle crosses are not four independent axes. 5B has four independent wings. Its endpoint is 7 degrees, not an exact fold return. No compass magnetism or Fibonacci/Euler/Ramanujan law.'};
  }
  function record(s){return {schema:SCHEMA,assembly:A.record(s),compass:snapshot(s),wholeMachineReturn:false,scope:'SCOPED_LOCAL_SAVED_STATE_AND_REPROJECTED_TRACE'};}
  function verify(r){
    if(r?.schema!==SCHEMA)return A.verify(r);
    try{
      if(Object.keys(r).sort().join('|')!==['schema','assembly','compass','wholeMachineReturn','scope'].sort().join('|')||A.verify(r.assembly).status!=='PASS')throw Error('invalid compass envelope');
      const a=r.assembly,s={...a.mask.state,assembly:a.assembly,assemblyAnchor:a.assemblyAnchor,dropped:a.dropped,droppedAnchor:a.droppedAnchor};
      if(JSON.stringify(record(s))!==JSON.stringify(r))throw Error('compass/source mismatch');
      return {status:'PASS',scope:'CONSISTENT_LOCAL_READING_NOT_AUTHENTICATED_EXECUTION'};
    }catch(error){return {status:'INVALID',error:String(error.message||error)};}
  }
  function draw(s){
    const r=snapshot(s),rotation=s.assembly.rotation*Math.PI/180,c=Math.cos(rotation),sin=Math.sin(rotation);
    const at=p=>[240+110*(c*p[0]-sin*p[1]),290-110*(sin*p[0]+c*p[1])],n=x=>Number(x.toFixed(4));
    const path=ps=>ps.map((p,i)=>(i?'L':'M')+at(p).map(n).join(',')).join(' ');
    let out='<title>Tellerkompass: eine gerichtete Nadel, zeitliche Positionskreuze und getrennte vierflügelige 5B-Referenz</title>';
    out+='<text x="20" y="28" fill="#e4f5ff">TELLERKOMPASS · '+r.plane+' · '+r.status+'</text>';
    out+='<ellipse cx="240" cy="290" rx="177" ry="177" fill="#0a1d2d" stroke="#ffd36b" stroke-width="2" data-compass-role="selection-ring"/>';
    out+='<path d="M45,290H435M240,95V485" fill="none" stroke="#819aaa" stroke-width="1"/>';
    for(let i=0;i<29;i++){const a=i*2*Math.PI/29,x=240+177*Math.sin(a),y=290-177*Math.cos(a);out+='<g data-compass-slice="'+i+'" role="button" tabindex="0" aria-label="Sequenzschnitt '+i+' von 28 wählen" aria-pressed="'+(i===r.selectionRing.slice)+'"><circle cx="'+n(x)+'" cy="'+n(y)+'" r="12" fill="transparent"/><circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+(i===r.selectionRing.slice?5:2)+'" fill="'+(i===r.selectionRing.slice?'#ffd36b':'#647a8e')+'"/></g>';}
    if(r.trace.length)out+='<path d="'+path(r.trace.map(t=>t.point))+'" fill="none" stroke="#79b5bf" stroke-width="1.2" data-compass-role="stored-tick-trace"/>';
    for(const q of r.crosses){const [x,y]=at(q.point),color=q.ago?'#9d73ca':'#fff';out+='<path d="M'+n(x-5)+','+n(y-5)+'L'+n(x+5)+','+n(y+5)+'M'+n(x-5)+','+n(y+5)+'L'+n(x+5)+','+n(y-5)+'" stroke="'+color+'" stroke-width="2" fill="none" data-compass-role="temporal-cross"/><text x="'+n(x+8)+'" y="'+n(y-8)+'" fill="'+color+'" font-size="11">'+(q.ago?'−'+q.ago:'JETZT')+'</text>';}
    const tip=at(r.tip),shadow=at(r.shadow);
    if(r.direction!==null){
      const centre=at([0,0]),dx=tip[0]-centre[0],dy=tip[1]-centre[1],len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
      out+='<path d="'+path([[0,0],r.tip])+'" stroke="#ffd36b" stroke-width="3" fill="none" data-compass-role="directed-needle"/><polygon points="'+[[tip[0],tip[1]],[tip[0]-ux*13-uy*5,tip[1]-uy*13+ux*5],[tip[0]-ux*13+uy*5,tip[1]-uy*13-ux*5]].map(p=>p.map(n).join(',')).join(' ')+'" fill="#ffd36b"/>';
    }
    out+='<path d="'+path([r.tip,r.shadow])+'" stroke="#ce9ee7" stroke-dasharray="4 5" fill="none"/><circle cx="'+n(shadow[0])+'" cy="'+n(shadow[1])+'" r="4" fill="#ce9ee7"/><circle cx="240" cy="290" r="5" fill="#fff"/>';
    out+='<text x="20" y="530" fill="#ffd36b">Gold: gewählter Schnitt '+r.selectionRing.slice+'/28 · Blickdrehung '+s.assembly.rotation+'°</text>';
    out+='<text x="20" y="554" fill="#c0d5df">Bis vier Kreuze = t, t−3, t−6, t−9 · keine vier Nordrichtungen</text>';
    out+='<text x="20" y="578" fill="#c0d5df">Spur: '+r.trace.length+'/128 besuchte Ticks in aktueller Paaransicht · verworfen '+r.discarded+'</text>';
    const source=F.snapshot(r.selectionRing.slice,r.fold.options);
    out+='<svg x="490" y="60" width="850" height="500" viewBox="0 0 850 500" data-compass-role="original-5b-reference">'+F.drawing(source)+'</svg>';
    out+='<text x="510" y="590" fill="#c0d5df">5B: Originalgeometrie · vier unabhängige Flügel · Zielwinkel / Nachlauf 3</text>';
    out+='<text x="510" y="616" fill="#c0d5df">Nur Anzeigeresampling 120 → 28; Originalplayer bleibt unabhängig. Ende 7°, kein Falt-Return.</text>';
    return out;
  }
  return {SCHEMA,reading,snapshot,record,verify,draw};
});
