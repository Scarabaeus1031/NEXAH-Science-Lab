(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-mask-observer.js'):root.A0MaskObserver,node?require('./a0-one-flow.js'):root.A0OneFlowModel,node?require('./assets/a0-blue-pink-dodeca-cell-return-v1.js'):root.A0BluePinkDodecaCellReturn);
  if(node)module.exports=api;else root.A0MaskAssembly=api;
})(typeof globalThis==='undefined'?this:globalThis,function(M,O,B){
  'use strict';
  const SCHEMA='a0.mask-assembly/1',clone=x=>JSON.parse(JSON.stringify(x)),defaults={rotation:0,plane:'AM',lens:'eight',palette:'source'};
  const sameKeys=(a,b)=>Object.keys(a).sort().join('|')===Object.keys(b).sort().join('|');
  function settings(s){if(!s||!sameKeys(s,defaults)||![0,90,180,270].includes(s.rotation)||!['AM','VM','PM'].includes(s.plane)||!['eight','legacy'].includes(s.lens)||!['source','bronze'].includes(s.palette))throw Error('invalid assembly settings');return clone(s);}
  const core=s=>({config:s.config,tick:s.tick,history:s.history,anchor:s.anchor});
  function create(){return {...M.create(),assembly:clone(defaults),assemblyAnchor:null,dropped:0,droppedAnchor:null};}
  function validate(s){
    if(!s||!sameKeys(s,create()))throw Error('invalid assembly state');
    M.validate(core(s));settings(s.assembly);
    if(!Number.isSafeInteger(s.dropped)||s.dropped<0)throw Error('invalid discarded count');
    if(s.assemblyAnchor!==null)settings(s.assemblyAnchor);
    if((s.anchor===null)!==(s.assemblyAnchor===null)||(s.anchor===null)!==(s.droppedAnchor===null)||s.droppedAnchor!==null&&(!Number.isSafeInteger(s.droppedAnchor)||s.droppedAnchor<0))throw Error('incomplete assembly anchor');
    return s;
  }
  function apply(input,action,value){
    validate(input);const s=clone(input);
    if(action==='ASSEMBLY'){
      if(!value||!Object.keys(value).length||Object.keys(value).some(k=>!Object.hasOwn(defaults,k)))throw Error('unknown assembly setting');
      s.assembly=settings({...s.assembly,...value});return s;
    }
    if(action==='RESET')return create();
    const next={...s,...M.apply(core(s),action,value)};
    if(action==='CAPTURE'){next.assemblyAnchor=clone(s.assembly);next.droppedAnchor=s.dropped;}
    else if(action==='RETURN'){next.assembly=clone(s.assemblyAnchor);next.dropped=s.droppedAnchor;}
    else if(['SET','TICK','STEP'].includes(action)&&s.history.length===128)next.dropped++;
    return validate(next);
  }
  function snapshot(s){
    validate(s);
    const source=M.frame(s.config,s.tick),time=s.tick/M.STEPS*O.TAU,band=O.triadReading(time,{ratio:'3:2',phaseDegrees:90},'mobius-paired');
    const phases=band.bands.filter(b=>b.side==='out').map(b=>b.sourcePhase),signals=phases.map(Math.sin);
    const planes=B.buildThreeLissajousPlanes().planes.map((p,i)=>{
      const point=p.projection.map(k=>signals[k]),xy=point.map(x=>x/Math.sqrt(2)),radius=Math.hypot(...xy),angle=Math.atan2(xy[1],xy[0]);
      const plate=O.plate(1,Math.min(1,radius),angle),shadow=O.plate(1,Math.abs(xy[0]),xy[0]<0?Math.PI:0);
      return {id:['AM','VM','PM'][i],pair:p.projection,point,shadow:[point[0],0],plate:plate.map((x,k)=>k===2?x-.9:x),plateShadow:shadow.map((x,k)=>k===2?x-.9:x)};
    });
    const local=s.assembly.lens==='eight'?M.loopPoint(time):[.65*Math.sin(time),.35*Math.sin(2*time)];
    const lensCenter=local.map((x,k)=>x+source.pivot[k]),marker=O.mobius(2*time,.18).map((x,k)=>k===2?x+.9:x+source.pivot[k]);
    return {time,sourceTick:s.tick,signals,planes,lens:{mode:s.assembly.lens,center:lensCenter,radius:.43,magnification:13/8,rule:s.assembly.lens==='eight'?'CENTER_ON_VISIBLE_EIGHT':'LEGACY_SMALLER_EIGHT'},band:{u:2*time,marker,seam:'u=4pi returns v=+0.18; no endpoint-only 2pi return'},display:clone(s.assembly),gate:source.probeProjection,trace:{retained:s.history.length,discarded:s.dropped},wholeMachineReturn:false,closedCycle:s.tick===M.STEPS};
  }
  function record(s){return {schema:SCHEMA,mask:M.record(core(validate(s))),assembly:clone(s.assembly),assemblyAnchor:clone(s.assemblyAnchor),dropped:s.dropped,droppedAnchor:s.droppedAnchor,derived:snapshot(s),returnType:'SAVED_MASK_AND_ASSEMBLY_STATE',wholeMachineReturn:false};}
  function verify(r){
    if(r?.schema===M.SCHEMA)return M.verify(r);
    try{
      if(!r||r.schema!==SCHEMA||!sameKeys(r,{schema:0,mask:0,assembly:0,assemblyAnchor:0,dropped:0,droppedAnchor:0,derived:0,returnType:0,wholeMachineReturn:0})||M.verify(r.mask).status!=='PASS')throw Error('invalid assembly envelope');
      const s={...r.mask.state,assembly:r.assembly,assemblyAnchor:r.assemblyAnchor,dropped:r.dropped,droppedAnchor:r.droppedAnchor};
      if(JSON.stringify(record(s))!==JSON.stringify(r))throw Error('assembly readback mismatch');
      return {status:'PASS',scope:'CONSISTENT_SAVED_STATE_NOT_TRAJECTORY_AUTHENTICATION'};
    }catch(error){return {status:'INVALID',error:String(error.message||error)};}
  }
  const plateCurves=O.curves('plates'),bandCurves=O.curves('mobius');
  function draw(s){
    const r=snapshot(s),f=M.frame(s.config,s.tick),angle=s.assembly.rotation*Math.PI/180;
    const at=p=>{const q=O.project(p,angle);return [500+q[0]*170,270+q[1]*150];},n=x=>Number(x.toFixed(4)),points=ps=>ps.map(p=>at(p).map(n).join(',')).join(' ');
    const line=(ps,color,width=1,dash='')=>'<polyline points="'+points(ps)+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-dasharray="'+dash+'"/>';
    const colors=s.assembly.palette==='bronze'?['#cb935d','#779b91','#959da5']:['#f2ce5d','#29c7ef','#ee6ca5'];
    let out='<title>Eine lokale Phase: Aufsicht, gelbe Detail-Linse, obere lila Bandansicht, untere Teller und drei Lissajous-Lesarten</title>';
    out+='<text x="20" y="26" fill="#e2f4ff">GEMEINSAMER LOKALER TICK · t='+r.time.toFixed(3)+' · Ansicht '+s.assembly.rotation+'°</text>';
    // Teller below the planar carrier; source curves reused, only display z-offset added.
    for(const c of plateCurves)out+=line(c.points.map(p=>p.map((x,k)=>k===2?x-.9:x)),colors[c.index],1);
    out+='<g data-assembly-layer="background"><polygon points="'+points(f.a.map(p=>[...p,0]))+'" fill="#f2ce5d10" stroke="#f2ce5d"/><polygon points="'+points(f.b.map(p=>[...p,0]))+'" fill="#81a4ff18" stroke="#81a4ff"/>';
    for(const w of f.windows)if(w.polygon.length)out+='<polygon points="'+points(w.polygon.map(p=>[...p,0]))+'" fill="'+(w.id==='L'?'#29c7ef30':'#ee6ca530')+'" stroke="none"/>';
    out+='</g>';
    for(const plane of r.planes){
      const i=['AM','VM','PM'].indexOf(plane.id),p=at(plane.plate),q=at(plane.plateShadow);
      out+=line([plane.plate,plane.plateShadow],colors[i],2,'4 4')+'<circle cx="'+n(p[0])+'" cy="'+n(p[1])+'" r="5" fill="'+colors[i]+'"/><circle cx="'+n(q[0])+'" cy="'+n(q[1])+'" r="4" fill="'+colors[i]+'"/>';
    }
    if(f.fold.visible){
      out+='<g data-assembly-layer="top">';
      for(const c of bandCurves)out+=line(c.points.map(p=>p.map((x,k)=>k===2?x+.9:x+f.pivot[k])),'#c687ff',c.boundary?2:1);
      out+=line(f.fold.points.map(p=>[...p,1.2]),'#f17cfa',2);
      const p=at(r.band.marker);out+='<circle cx="'+n(p[0])+'" cy="'+n(p[1])+'" r="5" fill="#f17cfa"/>';
      out+='</g>';
    }
    const ring=Array.from({length:65},(_,i)=>{const t=i*O.TAU/64;return [r.lens.center[0]+.43*Math.cos(t),r.lens.center[1]+.43*Math.sin(t),1.2];});
    out+=line(ring,'#ffd36b',3);
    // Same complete background, enlarged around focus: not an independent geometric source.
    const cx=840,cy=155,scale=115*r.lens.magnification,focus=r.lens.center;
    const local=p=>[cx+(p[0]-focus[0])*scale,cy-(p[1]-focus[1])*scale];
    const localPoints=ps=>ps.map(p=>local(p).map(n).join(',')).join(' ');
    out+='<defs><clipPath id="maskAssemblyDetailClip"><circle cx="'+cx+'" cy="'+cy+'" r="78"/></clipPath></defs><g clip-path="url(#maskAssemblyDetailClip)"><circle cx="'+cx+'" cy="'+cy+'" r="78" fill="#0c1a2a"/><polygon points="'+localPoints(f.a)+'" fill="#f2ce5d22" stroke="#f2ce5d"/><polygon points="'+localPoints(f.b)+'" fill="#81a4ff33" stroke="#81a4ff"/>';
    for(const w of f.windows)if(w.polygon.length)out+='<polygon points="'+localPoints(w.polygon)+'" fill="'+(w.id==='L'?'#29c7ef30':'#ee6ca530')+'" stroke="none"/>';
    if(f.fold.visible)out+='<polyline points="'+localPoints(f.fold.points)+'" fill="none" stroke="#e677ff"/>';
    out+='</g><circle cx="'+cx+'" cy="'+cy+'" r="78" fill="none" stroke="#ffd36b"/><text x="740" y="252" fill="#ffd36b">13/8 · derselbe Hintergrund</text>';
    out+='<text x="20" y="510" fill="#bcd6e0">Teller unten / Band oben: deklarierte Ansichtslagen · keine physikalische Spule</text>';
    for(let i=0;i<3;i++){
      const plane=r.planes[i],cx=190+i*300,cy=610,curve=Array.from({length:121},(_,j)=>{
        const t=j/120*O.TAU,a=[Math.sin(3*t),Math.sin(2*t+Math.PI/2),Math.sin(t+Math.PI/4)];
        return [cx+a[plane.pair[0]]*65,cy-a[plane.pair[1]]*45];
      });
      out+='<line x1="'+(cx-75)+'" y1="'+cy+'" x2="'+(cx+75)+'" y2="'+cy+'" stroke="#425b70"/><polyline points="'+curve.map(p=>p.map(n).join(',')).join(' ')+'" fill="none" stroke="'+colors[i]+'"/><circle cx="'+n(cx+plane.point[0]*65)+'" cy="'+n(cy-plane.point[1]*45)+'" r="5" fill="#fff"/><circle cx="'+n(cx+plane.shadow[0]*65)+'" cy="'+cy+'" r="4" fill="'+colors[i]+'"/><text x="'+cx+'" y="690" fill="'+colors[i]+'" text-anchor="middle">'+plane.id+(plane.id===s.assembly.plane?' · FOKUS':'')+'</text>';
    }
    return out;
  }
  return {SCHEMA,defaults,core,create,validate,settings,apply,snapshot,record,verify,draw};
});
