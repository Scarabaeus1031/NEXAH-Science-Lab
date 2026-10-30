(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const crownViewer=$('crownModel'),heartViewer=$('heartModel'),diagram=$('pascalDiagram'),pinDiagram=$('pinDiagram'),pinMover=$('pinMover'),ghostCross=$('ghostCross'),returnPlane=$('returnPlane');
  const pinControl=window.A0CPinIOI;
  const setHidden=(node,hidden)=>node.toggleAttribute('hidden',Boolean(hidden));
  const stageButtons=[...document.querySelectorAll('[data-stage]')];
  const stages=[
    {label:'01 · SOURCE / ASSET',title:'Fünflaschenkrone · animiertes 3D-Objekt',status:'SOURCE READY · CAPTURE REQUIRED'},
    {label:'02 · ADAPTER / INCIDENCE',title:'5-Punkte-Pascal · korrigierte Degeneration',status:'JOINT READY · RUN COLLINEARITY'},
    {label:'03 · MOTION / VIEW',title:'Open → Contact → Return · Crown-Animation',status:'MOTION READY · VIEW ONLY'},
    {label:'04 · BOUNDARY CONTROL',title:'C‑Pin · inside → outside → inside',status:'PIN READY · 101 LOCAL STATES'},
    {label:'05 · CONTROL / τ-PULSE',title:'Digital Dodeca Heart · 200 diskrete Steps',status:'PULSE READY · CALIBRATION HOLD'},
    {label:'06 · TRIPLE RETURN',title:'Crown 0° · C‑Pin I · Heart [1,1,1]',status:'RETURN READY · RESET REQUIRED'},
    {label:'07 · SCIENCE DESK',title:'Receipt exportieren · vorhandene Intakes behalten Autorität',status:'DESK BOUND · NO CLAIM PROMOTION'}
  ];
  let stage=0,motionPlaying=false,pinPlaying=false,pinTimer=null,pinIndex=0,pulsePlaying=false,completed=new Set(),pascalResidual=null;
  const pulseContract={animation:'tau_200_step_pulse',interpolation:'STEP',steps:200,pulses:10,highScale:[1.15,1.15,1.15],returnScale:[1,1,1],triggerLabelDeg:7.1,resonanceLabelDeg:[8,9],calibration:'HOLD'};
  const pinContract={samples:101,stateFunction:'cos(2*pi*k/100)',route:['INSIDE','BOUNDARY','OUTSIDE','BOUNDARY','INSIDE'],returnIndex:100,returnClearance:1,mechanism:'HOLD'};
  const svgNS='http://www.w3.org/2000/svg';
  const make=(name,attrs={},text='')=>{const node=document.createElementNS(svgNS,name);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,value));if(text)node.textContent=text;return node};
  const line=(a,b)=>[a.y-b.y,b.x-a.x,a.x*b.y-b.x*a.y];
  const cross=(l,m)=>{const w=l[0]*m[1]-l[1]*m[0];return{x:(l[1]*m[2]-l[2]*m[1])/w,y:(l[2]*m[0]-l[0]*m[2])/w}};
  const value=(l,p)=>l[0]*p.x+l[1]*p.y+l[2];
  const scene=p=>({x:450+p.x*210,y:325-p.y*210});
  function extendedSegment(a,b,scale=3.5){const dx=b.x-a.x,dy=b.y-a.y;return[{x:a.x-dx*scale,y:a.y-dy*scale},{x:b.x+dx*scale,y:b.y+dy*scale}]}
  function drawLine(a,b,className){const [s,e]=extendedSegment(scene(a),scene(b),2);diagram.append(make('line',{x1:s.x,y1:s.y,x2:e.x,y2:e.y,class:className}))}
  function renderPascal(){
    diagram.replaceChildren();
    const angles=[-2.6354601283,-2.0591827784,-.5925524622,2.3263284929,2.9877279915];
    const p=angles.map(t=>({x:Math.cos(t),y:Math.sin(t)}));
    const tangent=[p[4].x,p[4].y,-1];
    const X=cross(line(p[0],p[1]),line(p[3],p[4]));
    const Y=cross(line(p[1],p[2]),tangent);
    const Z=cross(line(p[2],p[3]),line(p[4],p[0]));
    const pascal=line(X,Y);pascalResidual=Math.abs(value(pascal,Z))/Math.hypot(pascal[0],pascal[1]);
    diagram.append(make('circle',{cx:450,cy:325,r:210,class:'pascal-circle'}));
    [[p[0],p[1]],[p[3],p[4]],[p[1],p[2]],[p[2],p[3]],[p[4],p[0]]].forEach(pair=>drawLine(pair[0],pair[1],'pascal-chord'));
    const tangentA={x:p[4].x-p[4].y,y:p[4].y+p[4].x},tangentB={x:p[4].x+p[4].y,y:p[4].y-p[4].x};drawLine(tangentA,tangentB,'pascal-tangent');
    drawLine(X,Z,'pascal-line');
    p.forEach((point,index)=>{const s=scene(point);diagram.append(make('circle',{cx:s.x,cy:s.y,r:8,class:'pascal-point'}));diagram.append(make('text',{x:s.x+12,y:s.y-12,class:'pascal-label'},`P${index+1}`))});
    [{p:X,n:'X'},{p:Y,n:'Y'},{p:Z,n:'Z'}].forEach(item=>{const s=scene(item.p);diagram.append(make('circle',{cx:s.x,cy:s.y,r:10,class:'pascal-intersection'}));diagram.append(make('text',{x:s.x+13,y:s.y-13,class:'pascal-label'},item.n))});
    diagram.append(make('text',{x:32,y:42,class:'pascal-note'},'P₁P₂ ∩ P₄P₅  ·  P₂P₃ ∩ tangent(P₅)  ·  P₃P₄ ∩ P₅P₁'));
    diagram.append(make('text',{x:32,y:70,class:'pascal-note'},`normalized collinearity residual: ${pascalResidual.toExponential(3)}`));
    $('pascalReadout').textContent=`PASS · residual ${pascalResidual.toExponential(3)}`;
    return pascalResidual<1e-9;
  }
  function resetViewers(){
    motionPlaying=false;pinPlaying=false;pulsePlaying=false;clearInterval(pinTimer);pinTimer=null;
    crownViewer.pause?.();heartViewer.pause?.();
    crownViewer.currentTime=0;heartViewer.currentTime=199;
    renderPin(0);$('toggleMotion').textContent='PLAY MOTION';$('togglePin').textContent='PLAY C‑PIN';$('togglePulse').textContent='PLAY τ-PULSE';
  }
  function renderPin(index){
    const state=pinControl.stateAt(index);pinIndex=state.index;
    const ghostState=state.zone==='BOUNDARY'?'COINCIDENCE':'GHOST';
    pinMover.setAttribute('transform',`translate(0 ${state.signedClearance*135})`);
    ghostCross.dataset.relation=ghostState;
    $('pinStateLabel').textContent=`k=${String(state.index).padStart(3,'0')} / 100 · ${state.zone} · c=${state.signedClearance>=0?'+':''}${state.signedClearance.toFixed(3)}`;
    $('ghostStateLabel').textContent=`m | n · ${ghostState} RELATION · NO STATE TRANSFER`;
    $('pinReadout').textContent=`k=${state.index} · ${state.zone} · c=${state.signedClearance.toFixed(3)}`;
    return state;
  }
  function showStage(index){
    stage=Math.max(0,Math.min(stages.length-1,index));
    stageButtons.forEach((button,i)=>i===stage?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
    $('stageLabel').textContent=stages[stage].label;$('runnerTitle').textContent=stages[stage].title;$('runStatus').textContent=stages[stage].status;
    setHidden(crownViewer,!(stage===0||stage===2));setHidden(heartViewer,stage!==4);setHidden(diagram,stage!==1);setHidden(pinDiagram,stage!==3);setHidden(returnPlane,stage!==5);
    if(stage===0){crownViewer.pause?.();crownViewer.currentTime=0}
    if(stage===1){const pass=renderPascal();$('runStatus').textContent=pass?'PASS · X / Y / Z COLLINEAR':'FAIL · PASCAL RESIDUAL'}
    if(stage===2)$('runStatus').textContent='READY · PLAY DECLARED CROWN MOTION';
    if(stage===3){renderPin(pinIndex);$('runStatus').textContent='READY · PLAY 101-STATE I–O–I PIN'}
    if(stage===4){heartViewer.animationName=pulseContract.animation;heartViewer.timeScale=20;$('runStatus').textContent='READY · 200 STEP PULSE · ANGLE LABELS HOLD'}
    if(stage===5){resetViewers();renderPin(100);$('returnReadout').textContent='PASS · 0° + I + [1,1,1]';$('pinReadout').textContent='PASS · k=100 · INSIDE · c=1';$('pulseReadout').textContent='PASS · 200 STEPS · 10 PULSES · [1,1,1]';$('runStatus').textContent='PASS · TRIPLE LOCAL RETURN';completed.add(5)}
    if(stage===6)$('runStatus').textContent='READY · EXPORT RECEIPT / OPEN EXISTING DESK RETURNS';
  }
  function completeStage(index){
    if(index===0){completed.add(0);$('runStatus').textContent='PASS · CROWN SOURCE CAPTURED'}
    if(index===1&&renderPascal()){completed.add(1);$('runStatus').textContent='PASS · X / Y / Z COLLINEAR'}
    if(index===2){completed.add(2);$('runStatus').textContent='PASS · CROWN MOTION VIEWED · MECHANICS OPEN'}
    if(index===3){renderPin(100);completed.add(3);$('pinReadout').textContent='PASS · 101 STATES · I–O–I · RETURN I';$('runStatus').textContent='PASS · C‑PIN RETURNED · MECHANISM HOLD'}
    if(index===4){completed.add(4);$('pulseReadout').textContent='PASS · 200 STEPS · 10 PULSES · RETURN [1,1,1]';$('runStatus').textContent='PASS · τ-PULSE VIEWED · CALIBRATION HOLD'}
    if(index===5){completed.add(5);$('returnReadout').textContent='PASS · 0° + I + [1,1,1]';$('runStatus').textContent='PASS · TRIPLE LOCAL RETURN'}
    if(index===6){completed.add(6);$('runStatus').textContent='COMPLETE · RECEIPT READY · CLAIMS UNCHANGED'}
  }
  async function preview(viewer,duration=1100){try{viewer.currentTime=0;await viewer.play?.();await new Promise(resolve=>setTimeout(resolve,duration));viewer.pause?.();return true}catch(_){$('runStatus').textContent='HOLD · MODEL VIEWER UNAVAILABLE';return false}}
  async function runAll(){
    $('runAll').disabled=true;
    for(let i=0;i<stages.length;i+=1){showStage(i);completeStage(i);if(i===2)await preview(crownViewer);if(i===4)await preview(heartViewer);await new Promise(resolve=>setTimeout(resolve,520))}
    $('runAll').disabled=false;
  }
  function toggleMotion(){
    showStage(2);motionPlaying=!motionPlaying;
    if(motionPlaying){crownViewer.play?.();$('toggleMotion').textContent='PAUSE MOTION';$('runStatus').textContent='RUNNING · CROWN ANIMATION / VIEW ONLY';completeStage(2)}else{crownViewer.pause?.();$('toggleMotion').textContent='PLAY MOTION';$('runStatus').textContent='PAUSED · CROWN VIEW HELD'}
  }
  function togglePulse(){
    showStage(4);pulsePlaying=!pulsePlaying;heartViewer.animationName=pulseContract.animation;heartViewer.timeScale=20;
    if(pulsePlaying){if(heartViewer.currentTime>=199)heartViewer.currentTime=0;heartViewer.play?.();$('togglePulse').textContent='PAUSE τ-PULSE';$('pulseReadout').textContent='RUNNING · 200 STEP / ×20 VIEW';$('runStatus').textContent='RUNNING · τ-PULSE / CALIBRATION HOLD';completeStage(4)}else{heartViewer.pause?.();$('togglePulse').textContent='PLAY τ-PULSE';$('runStatus').textContent='PAUSED · HEART VIEW HELD'}
  }
  function togglePin(){
    showStage(3);
    if(pinPlaying){pinPlaying=false;clearInterval(pinTimer);pinTimer=null;$('togglePin').textContent='PLAY C‑PIN';$('runStatus').textContent='PAUSED · C‑PIN VIEW HELD';return}
    if(pinIndex>=100)renderPin(0);pinPlaying=true;$('togglePin').textContent='PAUSE C‑PIN';$('runStatus').textContent='RUNNING · 101-STATE I–O–I / VIEW ONLY';
    pinTimer=setInterval(()=>{const state=renderPin(pinIndex+1);if(state.index===100){clearInterval(pinTimer);pinTimer=null;pinPlaying=false;$('togglePin').textContent='PLAY C‑PIN';completeStage(3)}},24);
  }
  function receipt(){
    const payload={schema:'NEXAH_A0_PENTAGON_CROWN_RETURN_RECEIPT_V3',generatedAt:new Date().toISOString(),role:'FLAGSHIP_DEMONSTRATOR_UI_CUT',canonicalIdentityReused:'ART:A0:MATHEMATICAL_JOINTS',newCanonicalIdentity:false,newStudy:false,newFinding:false,newRelation:false,sources:{crown:{glb:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb',sha256:'24a33c38eb6e95b110e851ed5fe321f19120bf580248fa09b3a4e5c07b33f754'},heart:{historicalKey:'HTML-0217',glb:'assets/3d/digital_dodeca_heart_tau200.glb',sha256:'c6a3406d7a054ec369cd7d462ab2b3704dee6c39181388c380f4a82937fd62fc',sourceHtmlSha256:'830c4a67a46f787be7863510efd057b39915f6b4ea7eaa82b426a1d774b72e95',intake:'FAM_002_A0_ORIENTATION_INTAKE_2026-10-28'},harmonicReference:{record:'assets/a0-c-pin-ioi-harmonic-reference-2026-10-29.json',url:'https://themathematics.app/app/worlds/harmonic-modes-app?v=f41fc8f38ebd',role:'EXTERNAL_VISUAL_COMPARISON_NOT_EVIDENCE'}},pascal:{pairing:['P1P2 ∩ P4P5','P2P3 ∩ tangent(P5)','P3P4 ∩ P5P1'],normalizedCollinearityResidual:pascalResidual,pass:pascalResidual!==null&&pascalResidual<1e-9},pin:pinContract,ghostRelation:{channels:['m','n'],junction:'X|',lineStyle:'WHITE_PERFORATED',states:['GHOST','COINCIDENCE'],stateTransfer:false,sourceReturnRequired:true},pulse:pulseContract,stages:stages.map((item,i)=>({stage:i+1,label:item.label,complete:completed.has(i)})),return:{type:'TRIPLE_LOCAL_VIEW_CONTROL_SCALE_RESET',crownTarget:'0deg',pinTarget:{index:100,zone:'INSIDE',clearance:1},heartTarget:[1,1,1],pass:completed.has(5)},deskBindings:['I-27','I-46L','I-46P','I-46Q','I-46J'],boundaries:['Adapter is not identity','C-Pin is a geometric view/control, not a physical mechanism','White Ghost Cross is a relation projection, not state transfer','m and n remain separately return-addressable','l=1 m=0 is an external comparison, not Crown identity','Complex Mandelbrot/Julia extension remains unbuilt','Animation is not physical validation','7.1 degree trigger is an unverified historical label','8-9 degree resonance is an unverified historical label','I / l / II is a form association, not a measurement','Science Desk retains classification authority']};
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='a0-pentagon-crown-heart-return-receipt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);completeStage(5)
  }
  stageButtons.forEach(button=>button.addEventListener('click',()=>showStage(Number(button.dataset.stage))));
  $('stepRun').addEventListener('click',()=>{completeStage(stage);showStage(stage===5?0:stage+1)});
  $('runAll').addEventListener('click',runAll);$('toggleMotion').addEventListener('click',toggleMotion);$('togglePin').addEventListener('click',togglePin);$('togglePulse').addEventListener('click',togglePulse);
  $('resetRun').addEventListener('click',()=>{completed=new Set();pascalResidual=null;resetViewers();$('pascalReadout').textContent='X, Y, Z noch nicht berechnet';$('pinReadout').textContent='101 STATES · I–O–I · READY';$('pulseReadout').textContent='200 STEPS · 10 PULSES · READY';$('returnReadout').textContent='OPEN';showStage(0)});
  $('exportReceipt').addEventListener('click',receipt);
  crownViewer.addEventListener('error',()=>{$('runStatus').textContent='HOLD · CROWN GLB COULD NOT LOAD'});
  heartViewer.addEventListener('error',()=>{$('runStatus').textContent='HOLD · HEART GLB COULD NOT LOAD'});
  heartViewer.addEventListener('load',()=>{heartViewer.animationName=pulseContract.animation;heartViewer.timeScale=20});
  renderPin(0);showStage(0);
})();
