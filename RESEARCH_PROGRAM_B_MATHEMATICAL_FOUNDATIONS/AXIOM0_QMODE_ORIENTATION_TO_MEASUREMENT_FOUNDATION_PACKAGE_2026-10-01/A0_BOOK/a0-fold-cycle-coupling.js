(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-fold-lag-lens.js'):root.A0FoldLagLens);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0FoldCycleCoupling=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(F){
  'use strict';
  function snapshot(source,enabled=true){
    if(!source||source.schema!=='nexah.a0.fold-lag-lens/1'||!Number.isInteger(source.slice)||source.slice<0||source.slice>28)throw Error('Expected a 5B pose, Z=0..28');
    if(typeof enabled!=='boolean')throw Error('enabled must be boolean');
    const z=source.slice,terminal=z===28,group=Math.min(3,Math.floor(z/7)),phase=2*Math.PI*z/28;
    return {schema:'a0.fold-cycle-coupling/1',source:JSON.parse(JSON.stringify(source)),enabled,z,pose:z+1,group:group+1,completedGroups:Math.floor(z/7),stepInGroup:terminal?7:z%7,
      phase,cyan:Math.sin(phase),red:group%2===0?1:-1,redBoundary:'right-continuous +,-,+,- on [0,28); final value held from left',
      closureMarker:enabled&&terminal?0:null,flip:enabled&&terminal,displayDeterminant:enabled&&terminal?-1:1,
      rule:'4 x 7 transitions; pose 29 is Z=28; closure 0 and display flip at fourth group completion, no extra dwell',
      flipScope:'screen horizontal axis: projected y -> -y; current facets and projected shadows only; echoes and source stack retained',
      statefulAcrossRuns:false,calendarMapping:false,sharedSourceIdentity:false,wholeMachineReturn:false};
  }
  function presentation(record){
    const source=JSON.parse(JSON.stringify(record.source));
    if(record.flip)for(const facet of source.facets)for(const key of ['points','shadow'])facet[key]=facet[key].map(([x,y,z])=>[x,-y,z]);
    const label=record.flip?'29. POSE · 0 · ANSICHTSFLIP':'4 × 7 · '+(record.enabled?'KOPPLUNG EIN':'ORIGINALANSICHT');
    return F.drawing(source)+'<text x="35" y="48" fill="#f3c25a" font-size="13">'+label+'</text>';
  }
  function diagram(r){
    const x=60+r.z/28*560,y=140-60*r.cyan;
    let s='<title>Vier Siebenergruppen, rote Treppe und Abschluss bei Pose 29</title><path d="M60 140H620" stroke="#8ba3ad"/>';
    for(let i=0;i<=4;i++)s+='<text x="'+(60+140*i)+'" y="245" fill="#b7ccd6" text-anchor="middle">'+(7*i)+'</text>';
    let d='';for(let z=0;z<=280;z++){const u=z/280;d+=(z?'L':'M')+(60+560*u)+','+(140-60*Math.sin(2*Math.PI*u));}
    s+='<path d="'+d+'" stroke="#19d6ef" fill="none" stroke-width="2"/><path d="M60 80H200V200H340V80H480V200H620" stroke="#ff5362" fill="none" stroke-width="3"/>';
    s+='<path d="M'+x+' 55V220" stroke="#f3c25a" stroke-dasharray="4 4"/><circle cx="'+x+'" cy="'+y+'" r="5" fill="#19d6ef"/>';
    s+='<circle cx="'+x+'" cy="'+(140-60*r.red)+'" r="5" fill="#ff5362"/>';
    if(r.closureMarker===0)s+='<circle cx="620" cy="140" r="8" fill="#d2a9ff"/><text x="620" y="125" text-anchor="middle" fill="#d2a9ff">0 / FLIP</text>';
    return s+'<text x="340" y="275" text-anchor="middle" fill="#b7ccd6">Z · 28 Übergänge / 29 Posen · Rot ±1, Abschluss-0 separat</text>';
  }
  function mount(doc,view){
    const el=id=>doc.getElementById(id),toggle=el('foldCycleEnabled');if(!toggle||!view)return null;
    const previousRender=view.onRender;
    const prism=doc.querySelector('#prismReturnSpine .red-shadow'),oldPath=prism&&prism.getAttribute('d');
    if(prism&&!el('foldCyclePrismCursor')){const cursor=doc.createElementNS('http://www.w3.org/2000/svg','circle');cursor.setAttribute('id','foldCyclePrismCursor');cursor.setAttribute('r','5');cursor.setAttribute('fill','#f3c25a');cursor.setAttribute('aria-label','5B Z-Cursor der Abschlusskopplung');prism.parentNode.appendChild(cursor);}
    let current;
    function update(source){
      current=snapshot(source,toggle.checked);
      el('foldLagSvg').innerHTML=toggle.checked?presentation(current):F.drawing(source);
      el('foldCycleReadout').textContent=`Pose ${current.pose}/29 · Gruppe ${current.group}/4 · ${current.completedGroups}/4 abgeschlossen · Rot ${current.red>0?'+1':'−1'} · ${current.flip?'0-Abschluss / lila Ansichtsflip':'Abschlussmarker —'}`;
      el('foldCycleDiagram').innerHTML=diagram(current);
      if(prism)prism.setAttribute('d',current.enabled?'M506 45H533V79H560V45H587V79H614':oldPath);
      const cursor=el('foldCyclePrismCursor');if(cursor){cursor.setAttribute('cx',506+108*current.z/28);cursor.setAttribute('cy',current.closureMarker===0?62:current.red>0?45:79);cursor.setAttribute('visibility',current.enabled?'visible':'hidden');}
    }
    view.onRender=source=>{if(previousRender)previousRender(source);update(source);};
    toggle.addEventListener('change',()=>{view.pause();view.render();});
    el('foldCycleExport').addEventListener('click',()=>{
      const payload=snapshot(view.snapshot(),toggle.checked),url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
      const a=doc.createElement('a');a.href=url;a.download='a0-fold-cycle-coupling.json';a.click();URL.revokeObjectURL(url);
    });
    view.render();return {snapshot:()=>snapshot(view.snapshot(),toggle.checked),render:()=>view.render()};
  }
  return {snapshot,presentation,diagram,mount};
});
