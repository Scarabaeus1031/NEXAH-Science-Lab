(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0EdelweissGenesisTranslation=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const TAU=2*Math.PI;
  const STAGES=Object.freeze(['RING','CUT','UNROLL','JOINT','FOLD','PILLAR','GHOST','RETURN']);
  const SOURCE=Object.freeze({
    catalogId:'ASSET-108D97E1FE03',
    sha256:'f792bb7ad784f40ea2fb3c99e67925c4003828f9bf43aa2557b9eea97489824b',
    role:'HISTORICAL_EXCLUDED_SOURCE_BOUND_VIEW',
    title:'NEXAHEDRON V3 — INNER ↔ ALGO ↔ OUTER'
  });
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function stageIndex(stage){const index=STAGES.indexOf(stage);if(index<0)throw new RangeError(`unknown stage ${stage}`);return index;}
  function pentagonVertices(radius=1,rotation=-Math.PI/2){return Array.from({length:5},(_,i)=>({x:Math.cos(rotation+i*TAU/5)*radius,y:Math.sin(rotation+i*TAU/5)*radius}));}
  function lissajous119({phaseDegrees=90,samples=900}={}){const phase=phaseDegrees*Math.PI/180;return Array.from({length:samples+1},(_,i)=>{const t=TAU*i/samples;return{x:Math.sin(11*t+phase),y:Math.sin(9*t)}});}
  function analyze({stage='RING',wobbleDegrees=18,phaseDegrees=90,layers=['BODY','SHADOW','GHOST']}={}){
    const index=stageIndex(stage),returning=stage==='RETURN',sourceHeld=stage==='RING'||returning;
    wobbleDegrees=clamp(Number(wobbleDegrees)||0,0,55);phaseDegrees=((Number(phaseDegrees)||0)%360+360)%360;
    return{
      schema:'a0.edelweiss-genesis-translation/1.0.0',status:returning?'PASS_EXACT_DISPLAY_RETURN':'PASS_BOUNDED_TRANSLATION_VIEW',identity:'ART:A0:MATHEMATICAL_JOINTS',
      stage,index,parameters:{wobbleDegrees,phaseDegrees,layers:[...layers]},geometry:{ringEdges:5,cuts:sourceHeld?0:index>=1?5:0,flaps:sourceHeld?0:index>=2?5:0,joints:sourceHeld?0:index>=3?5:0,triangleVisible:!sourceHeld&&index>=4,pillarVisible:!sourceHeld&&index>=5,shadowDepths:3,lissajousTraceVisible:!sourceHeld&&index>=6},
      invariants:{edgeCountPreserved:true,flapCountPreserved:true,jointCountPreserved:true,sourceReturnResidual:returning?0:null,lissajousPair:'11:9',lissajousClosed:true,lissajousComparatorSlots:12,lissajousOpenComparatorSlots:1},
      roles:{innerTriangle:'A2 / KITE LOCAL FOLD HYPOTHESIS',pillar:'HELD CENTRAL VIEW AXIS',pascalJoint:'LOCAL WORKING NAME; SCC IDENTITY OPEN',wobble:'VIEW CONTROLLER ONLY'},
      source:SOURCE,identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],
      claimBoundary:'A source-bound display reconstruction of the historical NEXAHEDRON V3 Inner→Algo→Outer interaction grammar. Five visible joints are not identified with a tested Pascal SCC without a seam witness. The A2/Kite triangle, pillar, obelisk, shadows and wobble are local view roles, not a physical mechanism. The 11:9 trace is closed; its one open comparator slot is separate from the curve. No Euler-disc energy, friction, material, botanical genesis, new identity, Study or canonical relation is asserted.'
    };
  }
  function createState(input={}){return{stage:input.stage||'RING',wobbleDegrees:input.wobbleDegrees??18,phaseDegrees:input.phaseDegrees??90,layers:new Set(input.layers||['BODY','SHADOW','GHOST']),playing:false};}
  function setStage(state,stage){stageIndex(stage);state.stage=stage;return analyze({...state,layers:[...state.layers]});}
  function step(state){const next=(stageIndex(state.stage)+1)%STAGES.length;state.stage=STAGES[next];return analyze({...state,layers:[...state.layers]});}
  function returnToSource(state){state.playing=false;state.stage='RETURN';return analyze({...state,layers:[...state.layers]});}
  function mount(doc,win){
    const host=doc&&doc.getElementById('edelweissGenesisTranslation');if(!host)return null;
    const canvas=doc.getElementById('edelweissGenesisCanvas'),ctx=canvas.getContext('2d'),wobble=doc.getElementById('edelweissGenesisWobble'),phase=doc.getElementById('edelweissGenesisPhase'),state=createState();let animation=0,last=0;
    const el=id=>doc.getElementById(id);
    function fit(){const dpr=Math.min(win.devicePixelRatio||1,2),w=Math.max(360,Math.floor(canvas.clientWidth)),h=Math.max(430,Math.floor(canvas.clientHeight));if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr)){canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);return[w,h];}
    function line(points,color,width=1,dash=[],close=false,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));if(close)ctx.closePath();ctx.stroke();ctx.restore();}
    function fill(points,color,alpha=.15){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.restore();}
    function dot(p,color,r=4){ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fillStyle=color;ctx.fill();}
    function map(points,cx,cy,rx,ry=rx,tilt=0){const c=Math.cos(tilt),s=Math.sin(tilt);return points.map(p=>({x:cx+(p.x*c-p.y*s)*rx,y:cy+(p.x*s+p.y*c)*ry}));}
    function drawSource(cx,cy,r,audit){const ring=map(pentagonVertices(),cx,cy,r,r*.78,state.wobbleDegrees*Math.PI/900);if(audit.geometry.cuts){line(ring,'rgba(102,225,233,.38)',1,[5,6],true);ring.forEach((p,i)=>{const q=ring[(i+1)%5],m={x:(p.x+q.x)/2,y:(p.y+q.y)/2};dot(m,'#ef6ab4',4)});}else{fill(ring,'#66e1e9',.08);line(ring,'#66e1e9',2,[],true);}ctx.fillStyle='#9eb6be';ctx.font='700 9px monospace';ctx.textAlign='center';ctx.fillText(audit.geometry.cuts?'INNER · FIVE CUTS':'INNER · CLOSED RING',cx,cy+r*1.18);}
    function drawCrown(cx,cy,r,audit){const base=map(pentagonVertices(),cx,cy+r*.2,r,r*.45,state.wobbleDegrees*Math.PI/720),fold=clamp((audit.index-2)/3,0,1),apex={x:cx,y:cy-r*(.15+fold*.92)};if(audit.geometry.flaps){base.forEach((p,i)=>{const q=base[(i+1)%5],mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2},tip={x:mid.x+(mid.x-cx)*(.5-fold*.38),y:mid.y+(mid.y-cy)*(.5-fold*.38)};const target={x:tip.x*(1-fold)+apex.x*fold,y:tip.y*(1-fold)+apex.y*fold};fill([p,q,target],i%2?'#ef6ab4':'#66e1e9',.08+.08*fold);line([p,q,target,p],i%2?'rgba(239,106,180,.8)':'rgba(102,225,233,.8)',1.4);if(audit.geometry.joints)dot(mid,'#ef6ab4',4);});line(base,'rgba(102,225,233,.6)',1.5,[],true);}if(audit.geometry.triangleVisible){const tri=[base[0],base[2],apex];fill(tri,'#ef6ab4',.1);line(tri,'#ef6ab4',2);ctx.fillStyle='#ef6ab4';ctx.fillText('A2 / KITE',cx,cy+r*.74);}if(audit.geometry.pillarVisible){line([{x:cx,y:cy+r*.62},apex],'#ffd15c',3);dot(apex,'#ffd15c',6);ctx.fillStyle='#ffd15c';ctx.fillText('PILLAR / OBELISK',cx,cy-r*1.25);}ctx.fillStyle='#9eb6be';ctx.fillText(audit.geometry.flaps?'OUTER · FIVE-FLAP CROWN':'OUTER · WAITING',cx,cy+r*1.18);}
    function drawGhost(cx,cy,r,audit){if(!audit.geometry.lissajousTraceVisible||!state.layers.has('GHOST'))return;const pts=lissajous119({phaseDegrees:state.phaseDegrees,samples:1000}).map(p=>({x:cx+p.x*r*.52,y:cy-p.y*r*.52}));line(pts,'rgba(234,246,247,.62)',1.15);ctx.fillStyle='#eaf6f7';ctx.font='700 9px monospace';ctx.textAlign='center';ctx.fillText('11:9 · CLOSED GHOST TRACE',cx,cy-r*.68);}
    function draw(){const audit=analyze({...state,layers:[...state.layers]}),[w,h]=fit(),left={x:w*.23,y:h*.49},right={x:w*.73,y:h*.49},r=Math.min(w*.16,h*.25);ctx.clearRect(0,0,w,h);ctx.fillStyle='#020e16';ctx.fillRect(0,0,w,h);if(state.layers.has('SHADOW')&&audit.index>=4&&!['RETURN','RING'].includes(state.stage)){for(let i=3;i>=1;i--){const poly=map(pentagonVertices(),right.x+i*8,right.y+i*5,r*(1+i*.07),r*.46,state.wobbleDegrees*Math.PI/720);line(poly,'rgba(239,106,180,.16)',1,[],true);}}drawGhost(right.x,right.y,r*1.45,audit);drawSource(left.x,left.y,r,audit);if(state.layers.has('BODY'))drawCrown(right.x,right.y,r,audit);line([{x:left.x+r*1.3,y:left.y},{x:w*.5-30,y:h*.5},{x:right.x-r*1.3,y:right.y}],'rgba(255,209,92,.5)',1,[4,7]);ctx.beginPath();ctx.arc(w*.5,h*.5,34,0,TAU);ctx.strokeStyle='#ffd15c';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#ffd15c';ctx.font='700 10px monospace';ctx.textAlign='center';ctx.fillText('ALGO',w*.5,h*.5-2);ctx.fillText('CUT / FOLD',w*.5,h*.5+12);ctx.fillStyle='#66e1e9';ctx.textAlign='left';ctx.fillText(`INNER · ${state.stage}`,18,25);ctx.textAlign='right';ctx.fillText(`OUTER · Q° ${state.wobbleDegrees}°`,w-18,25);refresh(audit);return audit;}
    function refresh(audit){host.querySelectorAll('[data-eg-stage]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.egStage===state.stage)));host.querySelectorAll('[data-eg-layer]').forEach(button=>button.setAttribute('aria-pressed',String(state.layers.has(button.dataset.egLayer))));el('edelweissGenesisStatus').textContent=audit.status==='PASS_EXACT_DISPLAY_RETURN'?'RETURN · SOURCE EXACTLY RESTORED':`${state.stage} · ${audit.geometry.flaps} FLAPS / ${audit.geometry.joints} JOINTS`;el('edelweissGenesisWobbleOut').textContent=`${state.wobbleDegrees}°`;el('edelweissGenesisPhaseOut').textContent=`${state.phaseDegrees}°`;el('edelweissGenesisRing').textContent=`5 / ${audit.geometry.cuts}`;el('edelweissGenesisJoints').textContent=`${audit.geometry.flaps} / ${audit.geometry.joints}`;el('edelweissGenesisPillar').textContent=audit.geometry.pillarVisible?'HELD · VIEW':'WAITING';el('edelweissGenesisTrace').textContent=audit.geometry.lissajousTraceVisible?'CLOSED · GAP 1 SEPARATE':'CLOSED · SEPARATE';el('edelweissGenesisResidual').textContent=audit.invariants.sourceReturnResidual===0?'0 · SOURCE':'— · IN TRANSIT';el('edelweissGenesisPlay').textContent=state.playing?'Ⅱ PAUSE':'▶ RUN CUT';}
    function select(stage){setStage(state,stage);draw();}
    function tick(time){if(state.playing&&time-last>850){last=time;const index=stageIndex(state.stage);if(index>=STAGES.length-2){state.playing=false;}else state.stage=STAGES[index+1];draw();}animation=win.requestAnimationFrame(tick);}
    host.querySelectorAll('[data-eg-stage]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.egStage)));
    host.querySelectorAll('[data-eg-layer]').forEach(button=>button.addEventListener('click',()=>{const layer=button.dataset.egLayer;state.layers.has(layer)?state.layers.delete(layer):state.layers.add(layer);draw()}));
    wobble.addEventListener('input',()=>{state.wobbleDegrees=Number(wobble.value);draw()});phase.addEventListener('input',()=>{state.phaseDegrees=Number(phase.value);draw()});
    el('edelweissGenesisPlay').addEventListener('click',()=>{state.playing=!state.playing;if(state.playing&&stageIndex(state.stage)>=6)state.stage='RING';draw()});el('edelweissGenesisStep').addEventListener('click',()=>{state.playing=false;step(state);draw()});el('edelweissGenesisReturn').addEventListener('click',()=>{returnToSource(state);draw()});
    el('spinMasterStart')?.addEventListener('click',()=>{state.stage='RING';state.playing=true;draw()});el('spinMasterPause')?.addEventListener('click',()=>{state.playing=false;draw()});el('spinMasterReturn')?.addEventListener('click',()=>{returnToSource(state);draw()});
    win.ResizeObserver&&new win.ResizeObserver(draw).observe(canvas);draw();animation=win.requestAnimationFrame(tick);
    return{draw,analyze:()=>analyze({...state,layers:[...state.layers]}),setStage:select,step:()=>{step(state);return draw()},startAll:()=>{state.playing=true;return draw()},pauseAll:()=>{state.playing=false;return draw()},holdReturn:()=>{returnToSource(state);return draw()},destroy:()=>win.cancelAnimationFrame(animation),state};
  }
  return{TAU,STAGES,SOURCE,pentagonVertices,lissajous119,analyze,createState,setStage,step,returnToSource,mount};
});
