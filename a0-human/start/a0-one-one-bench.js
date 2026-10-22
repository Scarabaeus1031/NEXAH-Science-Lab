/* Local inspection bridge. Reuses Numbers mixer frames and reads the Bench stack.
   Connecting a visual edge does not implement a shared operator or source clock. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0OneOneBench=api;const c=api.mount(document,root);if(c)root.A0OneOneBenchController=c;}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 function canonical(x){if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';return JSON.stringify(x);}
 function compare(a,b){return a==null||b==null?'HOLD':canonical(a)===canonical(b)?'MATCH':'CHANGED';}
 function create(model,scene,readStack){
  let session=model.start('mixer'),linked=false,anchor=null,last=null;
  function frame(){return session.frames[session.cursor];}
  function inspect(){
   const f=frame(),stack=readStack()||null;
   return{phase:f.state.phase,fold:model.mixerFold(f.state.phase),frame:copy(f),stack:stack?copy(stack):null,
    linked,cursor:session.cursor,savedFrames:session.frames.length,
    endpoints:{upper:{display:'1',address:f.identity,source:'a0-game-of-numbers-model.js'},
     lower:{display:'1',address:stack?.activePlate?.plate||null,source:'a0-aperture-stack-calibration.js'}},
    scope:'LOCAL_NUMBERS_MIXER_AND_BENCH_STACK_NOT_LIVE_CLUB_PLAYER',
    towerLegend:{source:'assets/a0-muindi-tower-legend-v1.json',binding:'DOCUMENTARY_ONLY',rowCorrespondence:null,labelExpansions:null,
     ownerProposal:{orangeReturnTray:'CANDIDATE_RESIDUE_COLLECTOR',collectedResidual:null,transportRule:null}},
    sharedOperator:false,sharedClock:false,wholeMachineReturn:false,
    last:last?copy(last):null};
  }
  function geometryReturn(){
   const a=scene.snapshot(0,'counter'),b=scene.snapshot(frame().state.phase,'counter');
   const av=a.pentagons.flatMap(p=>p.points.flat()),bv=b.pentagons.flatMap(p=>p.points.flat());
   return Math.max(...av.map((v,i)=>Math.abs(v-bv[i])))<1e-9;
  }
  return{snapshot:inspect,
   connect(){anchor={frame:copy(frame()),stack:copy(readStack()||null),cursor:session.cursor};linked=true;last=null;return inspect();},
   next(){if(session.cursor<model.limit('mixer'))session=model.step(session);last=null;return inspect();},
   station(n){if(![0,45,90,135,180].includes(n))throw Error('invalid mixer station');while(session.frames.length<=n)session=model.step(session);session=model.at(session,n);last=null;return inspect();},
   check(){const now=inspect();last={mixerRecord:compare(anchor?.frame,now.frame),stackRecord:compare(anchor?.stack,now.stack),geometryAtStart:geometryReturn(),sourceReturn:'HOLD_UNDECLARED_CROSS_STACK_OPERATOR'};return inspect();},
   returnCursor(){if(!anchor)throw Error('capture endpoints first');session=model.at(session,anchor.cursor);linked=false;this.check();last.method='SAVED_CURSOR_RETURN_NOT_COMPUTED_INVERSE';return inspect();},
   reset(){session=model.start('mixer');linked=false;anchor=null;last=null;return inspect();}
  };
 }
 function mount(doc,win){
  const host=doc.getElementById('oneOneTest');if(!host)return null;
  const el=id=>doc.getElementById(id),M=win.A0GameOfNumbers,S=win.A0LayeredPentagonScene;
  if(!M||!S){el('oneOneStatus').textContent='HOLD · Numbers/Stack dependencies unavailable';return null;}
  const c=create(M,S,()=>win.A0ApertureStackController?.record);
  function render(){
   const r=c.snapshot();host.dataset.linked=String(r.linked);
   // The Bench already has another scene SVG: isolate clip-path IDs.
   const drawing=S.drawing(S.snapshot(r.phase,'counter')).replace(/id="([^"]+)"/g,'id="one-one-$1"').replace(/url\(#([^)]*)\)/g,'url(#one-one-$1)');
   el('oneOneMixer').innerHTML='<svg viewBox="0 0 900 440" role="img" aria-label="Vorhandene Numbers-Mischer-Geometrie">'+drawing+'</svg>';
   el('oneOneUpperAddress').textContent=r.endpoints.upper.address+' · phase '+r.phase+'° · fold '+r.fold.angle+'°';
   const stack=r.stack,plates=stack?.fixture?.plates||[];
   // All SVG content below is bounded numeric data or fixed source labels.
   el('oneOneStack').innerHTML='<svg viewBox="0 0 640 230" role="img" aria-label="Sechs vorhandene Apertureplatten">'+plates.map((p,i)=>'<g><ellipse cx="300" cy="'+(25+i*35)+'" rx="160" ry="16" fill="#14313c" stroke="'+(p.reference?'#65e3b0':'#4c7484')+'"/><ellipse cx="300" cy="'+(25+i*35)+'" rx="45" ry="8" fill="#04141d" stroke="#608b98"/><text x="30" y="'+(30+i*35)+'" fill="#c4dbe3">'+(Number.isInteger(p.index)?'P'+(p.index+1):'?')+'</text><text x="480" y="'+(30+i*35)+'" fill="#f0c968">'+Number(p.nominalAngleDeg).toFixed(2)+'°</text></g>').join('')+'</svg>';
   el('oneOneLowerAddress').textContent=stack?(r.endpoints.lower.address+' · '+stack.sampleCount+' Samples · Fingerprint '+stack.sourceFingerprint):'HOLD · kein Bench-Stack-Record';
   const position=el('oneOneTowerPosition'),residual=el('oneOneTowerResidual');
   if(position)position.textContent=stack?'Adapterposition n='+stack.activePlate.index+' · '+stack.activePlate.plate+' · '+stack.activePlate.nominalAngleDeg+'° · ohne Plate-/Glyph-Zuordnung':'HOLD · keine Adapterposition';
   if(residual)residual.textContent=stack?'Lokaler Stack-Return: residual '+stack.return.residual+' · exact '+stack.return.exact+' · Residuum im orangefarbenen Teller weiterhin nicht bestimmt':'HOLD · kein Stack-Return; Teller-Residuum nicht bestimmt';
   el('oneOneStatus').textContent=(r.linked?'VERBUNDEN · lokale Record-Klammer':'OFFEN · zwei getrennte Anschlüsse')+' · '+r.savedFrames+' gespeicherte Frames · Live Club/Player: nicht gebunden';
   el('oneOneReturn').disabled=!r.linked;
   el('oneOneResult').textContent=r.last?'Mixer-Record: '+r.last.mixerRecord+' · Bench-Record: '+r.last.stackRecord+' · Startgeometrie: '+r.last.geometryAtStart+' · Quellenverbindung: HOLD': 'Noch kein Return-Vergleich';
   el('oneOneLedger').textContent=JSON.stringify(r,null,2);
  }
  for(const [id,method]of [['oneOneConnect','connect'],['oneOneStep','next'],['oneOneCheck','check'],['oneOneReturn','returnCursor'],['oneOneReset','reset']])el(id).addEventListener('click',()=>{c[method]();render();});
  for(const b of host.querySelectorAll('[data-one-one-station]'))b.addEventListener('click',()=>{c.station(Number(b.dataset.oneOneStation));render();});
  render();return{snapshot:c.snapshot,render};
 }
 return{canonical,compare,create,mount};
});
