(function(){
  'use strict';
  const A=window.A0TypedCompass,svg=document.getElementById('wheel'),NS='http://www.w3.org/2000/svg';
  let state=A.createState(1087);
  const handedPhase=new URLSearchParams(window.location.search).get('a0_phase');
  if(handedPhase!==null) state={...state,phase:A.mod(Math.trunc(Number(handedPhase)||0))};
  function el(name,attrs,parent=svg){const node=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));parent.appendChild(node);return node;}
  const cx=300,cy=300,r=245,geometry=A.geometryAudit();
  [80,160,245].forEach(rad=>el('circle',{cx,cy,r:rad,class:'ring'}));
  el('circle',{cx,cy,r:geometry.tangentRadius,class:'tangent-envelope'});
  [[55,300,545,300],[300,55,300,545]].forEach(v=>el('line',{x1:v[0],y1:v[1],x2:v[2],y2:v[3],class:'axis'}));
  el('line',{x1:300,y1:45,x2:300,y2:555,class:'mirror-axis'});
  for(let i=0;i<280;i++){const a=-Math.PI/2+2*Math.PI*i/280,inner=i%10===0?r-12:r-5;el('line',{x1:cx+inner*Math.cos(a),y1:cy+inner*Math.sin(a),x2:cx+r*Math.cos(a),y2:cy+r*Math.sin(a),class:'tick'});}
  function wheelPoint(n,rad){const a=-Math.PI/2+2*Math.PI*n/280;return [cx+rad*Math.cos(a),cy+rad*Math.sin(a)];}
  const alphaRadius=126,alphaStart=wheelPoint(A.STEP,alphaRadius),alphaEnd=wheelPoint(A.HALF_TURN,alphaRadius),alphaGuide=wheelPoint(A.STEP,r-38),alphaLabelPoint=wheelPoint((A.STEP+A.HALF_TURN)/2,alphaRadius+34);
  el('line',{x1:cx,y1:cy,x2:alphaGuide[0],y2:alphaGuide[1],class:'alpha33-guide'});
  el('path',{d:`M ${alphaStart[0]} ${alphaStart[1]} A ${alphaRadius} ${alphaRadius} 0 0 1 ${alphaEnd[0]} ${alphaEnd[1]}`,class:'alpha33-arc'});
  const alphaLabel=el('text',{x:alphaLabelPoint[0],y:alphaLabelPoint[1],'text-anchor':'middle',class:'alpha33-label'});alphaLabel.textContent='α₃₃ · 42.429°';
  const orbit=A.orbit(),pts=orbit.slice(0,A.TRAIL_POINT_COUNT).map(n=>{const a=-Math.PI/2+2*Math.PI*n/280;return `${cx+A.TRAIL_RADIUS*Math.cos(a)},${cy+A.TRAIL_RADIUS*Math.sin(a)}`;}).join(' ');el('polyline',{points:pts,class:'trail'});
  const stepLine=el('line',{class:'step'}),point=el('circle',{r:7,class:'point'}),origin=el('circle',{cx:300,cy:55,r:5,class:'origin'});
  [0,70,107,140,173,210].forEach(n=>{const a=-Math.PI/2+2*Math.PI*n/280,t=el('text',{x:cx+(r+22)*Math.cos(a),y:cy+(r+22)*Math.sin(a),'text-anchor':'middle',class:n===107?'hot':''});t.textContent=n;});
  function xy(n,rad=r-28){const a=-Math.PI/2+2*Math.PI*n/280;return [cx+rad*Math.cos(a),cy+rad*Math.sin(a)];}
  function render(){const [x,y]=xy(state.phase);point.setAttribute('cx',x);point.setAttribute('cy',y);stepLine.setAttribute('x1',300);stepLine.setAttribute('y1',55);stepLine.setAttribute('x2',x);stepLine.setAttribute('y2',y);document.getElementById('digit-word').textContent=state.source;document.getElementById('phase').textContent=state.phase;document.getElementById('orientation').textContent=state.circleMirrored?'mirrored':'direct';const log=[`SOURCE · ${state.source} · phase ${state.phase}`,...state.history.map((op,i)=>`${String(i+1).padStart(2,'0')} · ${op}`),`AUDIT · ${A.exactAudit().status}`];document.getElementById('ledger').textContent=log.join('\n');origin.setAttribute('opacity',state.phase===0?'1':'.35');const handoff=document.getElementById('pink-diamond-handoff');if(handoff)handoff.href=`../A0_PINK_DIAMOND_GRID_ATLAS.html?a0_phase=${state.phase}#typedBoundaryHingeDock`;}
  document.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>{state=A.apply(state,b.dataset.op);render();}));render();
  document.getElementById('tangent-radius').textContent=geometry.tangentRadius.toFixed(4);
  document.getElementById('ring-gap').textContent=geometry.ringGap.toFixed(4);
  document.getElementById('trail-count').textContent=`${geometry.trailPoints} / ${geometry.trailSegments}`;
  const seedSvg=document.getElementById('seed-field'),seedField=A.seedFieldAudit(),primeGrid=A.primeGateGridAudit(),seedCx=360,seedCy=360,seedOuter=308;
  function seedEl(name,attrs,parent=seedSvg){const node=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));parent.appendChild(node);return node;}
  const seedRings=seedEl('g',{class:'seed-rings'}),wheelSeeds=seedEl('g',{class:'seed-cloud wheel-seeds'}),goldenSeeds=seedEl('g',{class:'seed-cloud golden-seeds'}),primeThreads=seedEl('g',{class:'prime-grid-threads'}),primeTriangles=seedEl('g',{class:'prime-grid-triangles'}),primeRelations=seedEl('g',{class:'prime-grid-svg-relations'}),gateSeeds=seedEl('g',{class:'seed-gates'}),seedLabels=seedEl('g',{class:'seed-labels'});
  [0.25,0.5,0.75,1].forEach(scale=>seedEl('circle',{cx:seedCx,cy:seedCy,r:seedOuter*scale},seedRings));
  const seedPoint=(degrees,radius)=>{const angle=-Math.PI/2+degrees*Math.PI/180;return [seedCx+radius*Math.cos(angle),seedCy+radius*Math.sin(angle)];};
  seedField.points.forEach(entry=>{
    const radius=22+entry.radius*(seedOuter-22),wheel=seedPoint(entry.wheelDegrees,radius),golden=seedPoint(entry.goldenDegrees,radius),size=entry.ordinal%7===0?3.5:2.45;
    seedEl('circle',{cx:wheel[0],cy:wheel[1],r:size,'data-ordinal':entry.ordinal},wheelSeeds);
    seedEl('circle',{cx:golden[0],cy:golden[1],r:size,'data-ordinal':entry.ordinal},goldenSeeds);
  });
  const wheelGatePoints=[],goldenGatePoints=[];
  seedField.gateOrdinals.forEach((ordinal,index)=>{
    const entry=seedField.points[ordinal-1],radius=22+entry.radius*(seedOuter-22),point=seedPoint(entry.wheelDegrees,radius),shadow=seedPoint(entry.goldenDegrees,radius),relation=primeGrid.gates[index];
    wheelGatePoints.push(point);goldenGatePoints.push(shadow);
    seedEl('circle',{cx:shadow[0],cy:shadow[1],r:7,'data-shadow-gate':ordinal,class:'prime-grid-shadow-node'},primeTriangles);
    seedEl('circle',{cx:point[0],cy:point[1],r:8,'data-gate':ordinal},gateSeeds);
    const label=seedEl('text',{x:point[0]+12,y:point[1]-10},seedLabels);label.textContent=`p${ordinal}=${seedField.gatePrimes[index]}`;
    const relationLabel=seedEl('text',{x:point[0]+12,y:point[1]+18,class:'prime-grid-relation-label'},primeRelations);relationLabel.textContent=`${ordinal}+${relation.prime}=${relation.sum}`;
  });
  seedEl('polygon',{points:wheelGatePoints.map(point=>point.join(',')).join(' '),class:'prime-grid-wheel-triangle'},primeTriangles);
  seedEl('polygon',{points:goldenGatePoints.map(point=>point.join(',')).join(' '),class:'prime-grid-shadow-triangle'},primeTriangles);
  const arcPath=(radius,startDegrees,endDegrees)=>{const start=seedPoint(startDegrees,radius),end=seedPoint(endDegrees,radius);return `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 0 1 ${end[0]} ${end[1]}`;};
  primeGrid.threads.forEach((thread,index)=>{
    const gate=primeGrid.gates[index],startDegrees=gate.wheelDegrees-118;
    seedEl('path',{d:arcPath(thread.radius,startDegrees,gate.wheelDegrees),class:`prime-grid-thread lane-${thread.lane}`,'data-thread':thread.index},primeThreads);
    const threadStart=seedPoint(startDegrees,thread.radius),threadEnd=seedPoint(gate.wheelDegrees,thread.radius);
    seedEl('circle',{cx:threadStart[0],cy:threadStart[1],r:3,class:'prime-grid-thread-end'},primeThreads);
    seedEl('circle',{cx:threadEnd[0],cy:threadEnd[1],r:3,class:'prime-grid-thread-end'},primeThreads);
  });
  seedEl('circle',{cx:seedCx,cy:seedCy,r:18,class:'seed-core'});
  const seedCoreTop=seedEl('text',{x:seedCx,y:seedCy-3,'text-anchor':'middle',class:'seed-core-label'});seedCoreTop.textContent='SEED 7';
  const seedCoreBottom=seedEl('text',{x:seedCx,y:seedCy+12,'text-anchor':'middle',class:'seed-core-label small'});seedCoreBottom.textContent='p7=17';
  let seedMode='wheel';
  function renderSeedMode(mode){
    seedMode=mode;
    seedSvg.dataset.mode=mode;
    document.querySelectorAll('[data-seed-mode]').forEach(button=>{const active=button.dataset.seedMode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active?'true':'false');});
    const label=document.getElementById('seed-mode-label'),angleLabel=document.getElementById('seed-angle-label');
    if(mode==='wheel'){label.textContent='WHEEL FIELD · R107/280';angleLabel.textContent=`Δθ = ${seedField.wheel.degrees.toFixed(6)}° · finite return 280`;}
    else if(mode==='golden'){label.textContent='GOLDEN-ANGLE COMPARATOR';angleLabel.textContent=`Δθ = ${seedField.goldenComparator.degrees.toFixed(6)}° · comparator only`;}
    else if(mode==='compare'){label.textContent='OVERLAY · TWO NONIDENTICAL VIEWS';angleLabel.textContent=`single-step Δ = ${seedField.goldenComparator.perStepDifference.toFixed(6)}°`;}
    else{label.textContent='PRIME GRID · THREE SEPARATE THREADS';angleLabel.textContent=`yellow wheel triangle · green drift ${primeGrid.gates[0].driftDegrees.toFixed(3)}°–${primeGrid.gates.at(-1).driftDegrees.toFixed(3)}°`;}
  }
  document.querySelectorAll('[data-seed-mode]').forEach(button=>button.addEventListener('click',()=>renderSeedMode(button.dataset.seedMode)));
  renderSeedMode(seedMode);
  const octagonSvg=document.getElementById('octagon-wobble-map'),octagon=A.octagonWobbleAudit(),octagonCx=295,octagonCy=238,octagonRadius=142;
  const octagonEl=(name,attrs,parent=octagonSvg)=>seedEl(name,attrs,parent);
  const octagonCircle=octagonEl('g',{class:'octagon-layer octagon-circle-layer'}),octagonInner=octagonEl('g',{class:'octagon-layer octagon-inner-layer'}),octagonOuter=octagonEl('g',{class:'octagon-layer octagon-outer-layer'}),octagonHits=octagonEl('g',{class:'octagon-layer octagon-hits-layer'}),octagonMask=octagonEl('g',{class:'octagon-layer octagon-mask-layer'}),octagonStrip=octagonEl('g',{class:'octagon-layer octagon-strip-layer'});
  const radialPoint=(radius,degrees)=>{const angle=(degrees-90)*Math.PI/180;return [octagonCx+radius*Math.cos(angle),octagonCy+radius*Math.sin(angle)];};
  octagonEl('circle',{cx:octagonCx,cy:octagonCy,r:octagonRadius,class:'octagon-unit-circle'},octagonCircle);
  octagonEl('circle',{cx:octagonCx,cy:octagonCy,r:4,class:'octagon-centre'},octagonCircle);
  const innerPoints=Array.from({length:8},(_,index)=>radialPoint(octagonRadius,index*45)),outerRadius=octagonRadius/Math.cos(Math.PI/8),outerPoints=Array.from({length:8},(_,index)=>radialPoint(outerRadius,22.5+index*45));
  octagonEl('polygon',{points:innerPoints.map(point=>point.join(',')).join(' '),class:'octagon-inner'},octagonInner);
  octagonEl('polygon',{points:outerPoints.map(point=>point.join(',')).join(' '),class:'octagon-outer'},octagonOuter);
  innerPoints.forEach((point,index)=>{
    octagonEl('circle',{cx:point[0],cy:point[1],r:6,class:'octagon-vertex','data-vertex':index+1},octagonInner);
    const label=octagonEl('text',{x:point[0],y:point[1]-12,'text-anchor':'middle',class:'octagon-vertex-label'},octagonInner);label.textContent=index+1;
  });
  const iLabel=octagonEl('text',{x:octagonCx-105,y:octagonCy-106,class:'octagon-ij-label inner'},octagonInner);iLabel.textContent='I · 3.061467…';
  const jLabel=octagonEl('text',{x:octagonCx+102,y:octagonCy-122,class:'octagon-ij-label outer'},octagonOuter);jLabel.textContent='J · 3.313708…';
  octagonEl('line',{x1:octagonCx,y1:octagonCy,x2:octagonCx+outerRadius+72,y2:octagonCy,class:'octagon-pi-ray'},octagonOuter);
  const piLabel=octagonEl('text',{x:octagonCx+outerRadius+80,y:octagonCy+5,class:'octagon-pi-label'},octagonOuter);piLabel.textContent='π OUTWARD';
  octagon.hits.forEach(entry=>{
    const point=radialPoint((octagonRadius+47)*entry.wobbleRadius,entry.degrees),hit=octagonEl('text',{x:point[0],y:point[1]+5,'text-anchor':'middle',class:'octagon-hit','data-hit':entry.index},octagonHits);hit.textContent='×';
  });
  const hitLabel=octagonEl('text',{x:535,y:88,class:'octagon-hit-caption'},octagonHits);hitLabel.textContent='29 X-HITS · 360°/29';
  octagonEl('path',{d:'M 378 73 A 184 184 0 0 1 378 403 A 133 160 0 0 0 378 73 Z',class:'octagon-crescent'},octagonMask);
  const maskLabel=octagonEl('text',{x:508,y:245,class:'octagon-mask-label'},octagonMask);maskLabel.textContent='SCHUTZBLECH · MASK';
  const stripX=74,stripY=478,cellWidth=26;
  octagon.hits.forEach((entry,index)=>{
    octagonEl('rect',{x:stripX+index*cellWidth,y:stripY,width:cellWidth-2,height:34,class:'octagon-strip-cell','data-strip':entry.index},octagonStrip);
    const mark=octagonEl('text',{x:stripX+index*cellWidth+(cellWidth-2)/2,y:stripY+22,'text-anchor':'middle',class:'octagon-strip-mark'},octagonStrip);mark.textContent=index%7===0||index===28?entry.index:'×';
  });
  const stripLabel=octagonEl('text',{x:stripX,y:stripY-12,class:'octagon-strip-label'},octagonStrip);stripLabel.textContent='CIRCULAR ORDER UNWRAPPED · 1 → 29';
  function renderOctagonMode(mode){
    const audit=A.octagonWobbleAudit(mode);octagonSvg.dataset.mode=mode;
    document.querySelectorAll('[data-octagon-mode]').forEach(button=>{const active=button.dataset.octagonMode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active?'true':'false');});
    const labels={octagon:['8 POINTS · OCTAGON','8 vertices · 45° turn'], 'pi-out':['π OUTWARD · I/J BRACKET',`${audit.octagon.innerPerimeter.toFixed(6)} < π < ${audit.octagon.outerPerimeter.toFixed(6)}`],wobble29:['29 X-HITS · WOBBLE TRACE','Δθ=12.413793…° · graphic offset only'],'crescent-strip':['CRESCENT MASK · STRIP READOUT','same 29 addresses · circular order unwrapped']};
    [document.getElementById('octagon-mode-label').textContent,document.getElementById('octagon-mode-detail').textContent]=labels[mode];
  }
  document.querySelectorAll('[data-octagon-mode]').forEach(button=>button.addEventListener('click',()=>renderOctagonMode(button.dataset.octagonMode)));
  renderOctagonMode('octagon');
  const towerSvg=document.getElementById('pascal-string-tower-map'),roundInput=document.getElementById('pascal-round'),iotaInput=document.getElementById('iota-offset');
  const towerEl=(name,attrs,parent=towerSvg)=>seedEl(name,attrs,parent);
  function rotatePoint(point,pivot,degrees){const a=degrees*Math.PI/180,x=point[0]-pivot[0],y=point[1]-pivot[1];return[pivot[0]+x*Math.cos(a)-y*Math.sin(a),pivot[1]+x*Math.sin(a)+y*Math.cos(a)];}
  function superscript(value){return String(value).replace(/0/g,'⁰').replace(/1/g,'¹').replace(/2/g,'²').replace(/3/g,'³').replace(/4/g,'⁴').replace(/5/g,'⁵').replace(/6/g,'⁶').replace(/7/g,'⁷').replace(/8/g,'⁸').replace(/9/g,'⁹');}
  function renderPascalTower(){
    const audit=A.pascalStringTowerAudit(Number(roundInput.value),Number(iotaInput.value));
    towerSvg.querySelectorAll(':scope > g').forEach(node=>node.remove());
    const grid=towerEl('g',{class:'pascal-tower-grid-layer'}),oct=towerEl('g',{class:'pascal-open8-layer'}),tri=towerEl('g',{class:'pascal-triangle-layer'}),labels=towerEl('g',{class:'pascal-tower-label-layer'});
    const visible=Math.min(audit.round,12),x0=72,y0=54,rowGap=31;
    for(let row=0;row<=visible;row+=1){
      for(let column=0;column<=row;column+=1){
        const x=x0+(visible-row)*13+column*26,y=y0+row*rowGap;
        towerEl('circle',{cx:x,cy:y,r:row===visible?6:4,class:row===visible?'pascal-cell active':'pascal-cell'},grid);
      }
    }
    const pTitle=towerEl('text',{x:62,y:28,class:'pascal-map-caption'},labels);pTitle.textContent=`PASCAL · k=${audit.round} · Σ=2^${audit.round}`;
    const triX=380,triY=76,triGap=25;
    for(let a=0;a<=Math.min(audit.round,8);a+=1)for(let b=0;b<=Math.min(audit.round,8)-a;b+=1){const c=Math.min(audit.round,8)-a-b;towerEl('circle',{cx:triX+(b-a)*14,cy:triY+(a+b)*triGap,r:3.8,class:`trinomial-cell c${c%3}`},grid);}
    const tTitle=towerEl('text',{x:310,y:28,class:'pascal-map-caption'},labels);tTitle.textContent=`TRINOMIAL · Σ=3^${audit.round}`;
    const ocx=610,ocy=180,or=105,points=Array.from({length:8},(_,index)=>{const a=-Math.PI/2+index*Math.PI/4;return[ocx+or*Math.cos(a),ocy+or*Math.sin(a)];});
    towerEl('path',{d:points.map((p,i)=>`${i?'L':'M'} ${p[0]} ${p[1]}`).join(' '),class:'pascal-open-octagon'},oct);
    points.forEach((p,index)=>{towerEl('circle',{cx:p[0],cy:p[1],r:index===7?8:5,class:index===7?'open8-node held':'open8-node'},oct);const tx=towerEl('text',{x:p[0],y:p[1]-11,'text-anchor':'middle',class:'open8-label'},labels);tx.textContent=index+1;});
    const open=towerEl('text',{x:ocx-48,y:ocy-118,class:'open8-caption'},labels);open.textContent='OPEN 8 · EDGE 8→1 HELD';
    const fixed=[[545,468],[545,348],[705,468]],pivot=[545,468],shadow=fixed.map(point=>rotatePoint(point,pivot,audit.iota.offsetDegrees));
    towerEl('polygon',{points:fixed.map(p=>p.join(',')).join(' '),class:'yellow-triangle fixed'},tri);
    towerEl('polygon',{points:shadow.map(p=>p.join(',')).join(' '),class:'yellow-triangle iota'},tri);
    const cable=towerEl('text',{x:548,y:490,class:'triangle-caption'},labels);cable.textContent='ΔA · 30–40–50';
    const iota=towerEl('text',{x:712,y:425,class:'triangle-caption iota'},labels);iota.textContent=`ΔB · IOTA ${audit.iota.offsetDegrees.toFixed(1)}°`;
    document.getElementById('pascal-round-output').textContent=audit.round;
    document.getElementById('iota-offset-output').textContent=`${audit.iota.offsetDegrees.toFixed(1)}°`;
    document.getElementById('pascal-tower-label').textContent=`k=${audit.round} · ${audit.pascal.layers} LAYERS`;
    document.getElementById('pascal-radix-label').textContent=`${audit.sharedCounter.decimal}₁₀ = ${audit.sharedCounter.binary}₂ = ${audit.sharedCounter.ternary}₃`;
    document.getElementById('pascal-row-cells').textContent=audit.pascal.rowCells;
    document.getElementById('pascal-row-sum').textContent=`Σ=2${superscript(audit.round)}=${audit.pascal.rowSum}`;
    document.getElementById('trinomial-layer-cells').textContent=audit.trinomial.layerCells;
    document.getElementById('trinomial-layer-sum').textContent=`Σ=3${superscript(audit.round)}=${audit.trinomial.coefficientSum}`;
    document.getElementById('rice-field-mass').textContent=audit.doubling.fieldMass;
    document.getElementById('rice-through-mass').textContent=`through k: ${audit.doubling.totalThroughField}`;
  }
  roundInput.addEventListener('input',renderPascalTower);iotaInput.addEventListener('input',renderPascalTower);renderPascalTower();
  const daySvg=document.getElementById('keystone-day-map'),daySeconds=document.getElementById('new-day-seconds'),dayMicro=document.getElementById('new-day-micro'),dayReset=document.getElementById('new-day-reset');
  const dayEl=(name,attrs,parent=daySvg)=>seedEl(name,attrs,parent);
  function polygonPoints(centerX,centerY,radius,count,rotation=-90){return Array.from({length:count},(_,index)=>{const angle=(rotation+index*360/count)*Math.PI/180;return[centerX+radius*Math.cos(angle),centerY+radius*Math.sin(angle)];});}
  function clockHandPoint(centerX,centerY,length,degrees){const angle=(degrees-90)*Math.PI/180;return[centerX+length*Math.cos(angle),centerY+length*Math.sin(angle)];}
  function renderKeystoneDay(){
    const audit=A.keystoneNewDayAudit(Number(daySeconds.value),Number(dayMicro.value));
    daySvg.querySelectorAll(':scope > g').forEach(node=>node.remove());
    const tower=dayEl('g',{class:'keystone-day-tower'}),clock=dayEl('g',{class:'keystone-day-clock'}),frames=dayEl('g',{class:'keystone-day-frames'}),labels=dayEl('g',{class:'keystone-day-labels'});
    const gx=62,gy=82,size=300,step=size/50;
    dayEl('rect',{x:gx,y:gy,width:size,height:size,class:'keystone-grid-back'},tower);
    for(let index=0;index<=50;index+=1){const position=index*step;dayEl('line',{x1:gx+position,y1:gy,x2:gx+position,y2:gy+size,class:index%10===0?'keystone-grid-major':'keystone-grid-line'},tower);dayEl('line',{x1:gx,y1:gy+position,x2:gx+size,y2:gy+position,class:index%10===0?'keystone-grid-major':'keystone-grid-line'},tower);}
    dayEl('path',{d:`M ${gx+size/2-22} ${gy-6} L ${gx+size/2} ${gy-34} L ${gx+size/2+22} ${gy-6} Z`,class:'keystone-cap'},tower);
    const towerTitle=dayEl('text',{x:gx,y:gy-48,class:'keystone-day-caption'},labels);towerTitle.textContent='TOWER · 50×50 + KEYSTONE';
    const towerCount=dayEl('text',{x:gx+size/2,y:gy+size/2,'text-anchor':'middle',class:'keystone-total'},labels);towerCount.textContent='2500 + 1 = 2501';
    const towerFactors=dayEl('text',{x:gx+size/2,y:gy+size/2+24,'text-anchor':'middle',class:'keystone-factor'},labels);towerFactors.textContent='41 × 61 · L²+1';
    const cx=755,cy=278,radius=218,outer=polygonPoints(cx,cy,radius,8,-90);
    dayEl('polygon',{points:outer.map(point=>point.join(',')).join(' '),class:'keystone-day-octagon'},clock);
    dayEl('circle',{cx,cy,r:174,class:'keystone-day-dial'},clock);
    const leftPent=polygonPoints(cx-68,cy,92,5,-90),rightPent=polygonPoints(cx+68,cy,92,5,-54);
    dayEl('path',{d:`M ${cx-74} ${cy-52} L ${cx+74} ${cy-52} L ${cx+74} ${cy+52} L ${cx-74} ${cy+52} Z`,class:'keystone-day-tube'},clock);
    dayEl('polygon',{points:leftPent.map(point=>point.join(',')).join(' '),class:'keystone-day-pentagon pre'},clock);
    dayEl('polygon',{points:rightPent.map(point=>point.join(',')).join(' '),class:'keystone-day-pentagon post'},clock);
    const handSpecs=[['hour',audit.clockHands.hourDegrees,88],['minute',audit.clockHands.minuteDegrees,126],['second',audit.clockHands.secondDegrees,148]];
    handSpecs.forEach(([kind,degrees,length])=>{const point=clockHandPoint(cx,cy,length,degrees);dayEl('line',{x1:cx,y1:cy,x2:point[0],y2:point[1],class:`keystone-clock-hand ${kind}`},clock);});
    dayEl('circle',{cx,cy,r:10,class:'keystone-iota-pivot'},clock);
    const iotaLabel=dayEl('text',{x:cx,y:cy+20,'text-anchor':'middle',class:'keystone-iota-label'},labels);iotaLabel.textContent='IOTA · t4';
    const yugoPoint=clockHandPoint(cx,cy,190,audit.clockHands.secondDegrees+30);dayEl('line',{x1:cx,y1:cy,x2:yugoPoint[0],y2:yugoPoint[1],class:'keystone-yugo-vector'},clock);
    const pentLabels=[{x:cx-100,text:'PRE · 5'},{x:cx+100,text:'POST · 5'}];pentLabels.forEach(entry=>{const label=dayEl('text',{x:entry.x,y:cy+132,'text-anchor':'middle',class:'keystone-pentagon-label'},labels);label.textContent=entry.text;});
    const frameX=[470,610,730,850,990];
    audit.frames.forEach((frame,index)=>{const active=frame.id===audit.closestFrame.id;dayEl('circle',{cx:frameX[index],cy:552,r:active?12:8,class:active?'keystone-frame active':'keystone-frame'},frames);const id=dayEl('text',{x:frameX[index],y:530,'text-anchor':'middle',class:'keystone-frame-id'},labels);id.textContent=frame.id;const time=dayEl('text',{x:frameX[index],y:582,'text-anchor':'middle',class:'keystone-frame-time'},labels);time.textContent=frame.label;});
    dayEl('line',{x1:frameX[0],y1:552,x2:frameX.at(-1),y2:552,class:'keystone-frame-rail'},frames);
    const octLabel=dayEl('text',{x:cx,y:38,'text-anchor':'middle',class:'keystone-day-caption'},labels);octLabel.textContent='OUTER 8 · TWO PENTAGON VIEWS · TIME TUBE';
    document.getElementById('new-day-seconds-output').textContent=`${audit.offsetSeconds<0?'−':audit.offsetSeconds>0?'+':''}${Math.abs(audit.offsetSeconds)} s`;
    document.getElementById('new-day-micro-output').textContent=`${String(audit.microseconds).padStart(6,'0')} µs`;
    document.getElementById('new-day-time-label').textContent=audit.displayTime;
    document.getElementById('new-day-frame-label').textContent=`nearest ${audit.closestFrame.id} · ${audit.closestFrame.role}`;
  }
  daySeconds.addEventListener('input',renderKeystoneDay);dayMicro.addEventListener('input',renderKeystoneDay);dayReset.addEventListener('click',()=>{daySeconds.value='0';dayMicro.value='0';renderKeystoneDay();});renderKeystoneDay();
  const nautilusSvg=document.getElementById('nautilus-stair-map'),nautilus=A.nautilusStairAudit();
  const nautilusEl=(name,attrs,parent=nautilusSvg)=>seedEl(name,attrs,parent);
  const defs=nautilusEl('defs',{}),arrow=nautilusEl('marker',{id:'nautilus-arrow',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'},defs);
  nautilusEl('path',{d:'M 0 0 L 10 5 L 0 10 z',class:'nautilus-arrow-head'},arrow);
  const spiralGroup=nautilusEl('g',{class:'nautilus-layer nautilus-path-layer'}),stairsGroup=nautilusEl('g',{class:'nautilus-layer nautilus-stairs-layer'}),triangleGroup=nautilusEl('g',{class:'nautilus-layer nautilus-triangle-layer'}),cubeGroup=nautilusEl('g',{class:'nautilus-layer nautilus-cube-layer'}),handoffGroup=nautilusEl('g',{class:'nautilus-handoff-layer'});
  const spiralPoints=Array.from({length:160},(_,i)=>{const t=i/159*Math.PI*4.15,radius=7+12.6*t;return [190+radius*Math.cos(t),310+radius*.72*Math.sin(t)];});
  nautilusEl('path',{d:spiralPoints.map((point,index)=>`${index?'L':'M'} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(' '),class:'nautilus-spiral'},spiralGroup);
  for(let i=0;i<13;i+=1){const point=spiralPoints[Math.round(i*(spiralPoints.length-1)/12)];nautilusEl('circle',{cx:point[0],cy:point[1],r:i===0?10:4,class:i===0?'nautilus-seed':'nautilus-pearl'},spiralGroup);}
  const seedLabel=nautilusEl('text',{x:202,y:300,class:'nautilus-label gold'},spiralGroup);seedLabel.textContent='A · 7 / B · 17';
  const spiralLabel=nautilusEl('text',{x:78,y:92,class:'nautilus-caption'},spiralGroup);spiralLabel.textContent='R107/280 · NAUTILUS PATH';
  const stairPoints=nautilus.stairs.map((entry,index)=>({x:398+index*38,y:458-index*42,...entry}));
  let nautilusStairPath=`M ${stairPoints[0].x} ${stairPoints[0].y}`;
  stairPoints.slice(1).forEach(point=>{nautilusStairPath+=` H ${point.x} V ${point.y}`;});
  nautilusEl('path',{d:nautilusStairPath,class:'nautilus-stair-path'},stairsGroup);
  stairPoints.forEach((point,index)=>{
    nautilusEl('circle',{cx:point.x,cy:point.y,r:7,class:'nautilus-step'},stairsGroup);
    const value=nautilusEl('text',{x:point.x,y:point.y-13,'text-anchor':'middle',class:'nautilus-step-label'},stairsGroup);value.textContent=point.prime;
    const ordinal=nautilusEl('text',{x:point.x,y:point.y+22,'text-anchor':'middle',class:'nautilus-step-index'},stairsGroup);ordinal.textContent=`p${point.index}`;
  });
  const stairTitle=nautilusEl('text',{x:510,y:92,'text-anchor':'middle',class:'nautilus-caption'},stairsGroup);stairTitle.textContent='EIGHT EXISTING CHECKPOINTS';
  nautilusEl('path',{d:'M 714 405 L 765 205 L 842 390 Z',class:'nautilus-pink-triangle'},triangleGroup);
  [[714,405,'107','C'],[765,205,'109','D'],[842,390,'113','E']].forEach(([x,y,value,face])=>{
    nautilusEl('circle',{cx:x,cy:y,r:13,class:'nautilus-triangle-node'},triangleGroup);
    const label=nautilusEl('text',{x,y:y-20,'text-anchor':'middle',class:'nautilus-triangle-label'},triangleGroup);label.textContent=`${face} · ${value}`;
  });
  const triangleTitle=nautilusEl('text',{x:778,y:92,'text-anchor':'middle',class:'nautilus-caption pink'},triangleGroup);triangleTitle.textContent='PINK TRIANGLE · PRIME GATE';
  nautilusEl('polygon',{points:'894,254 946,224 998,254 946,284',class:'nautilus-cube-face top'},cubeGroup);
  nautilusEl('polygon',{points:'894,254 946,284 946,366 894,336',class:'nautilus-cube-face left'},cubeGroup);
  nautilusEl('polygon',{points:'946,284 998,254 998,336 946,366',class:'nautilus-cube-face right'},cubeGroup);
  const cubeLabels=[['A',920,263],['B',972,263],['C',920,314],['D',972,314],['E',946,214],['F',946,390]];
  cubeLabels.forEach(([face,x,y])=>{const label=nautilusEl('text',{x,y,'text-anchor':'middle',class:'nautilus-cube-label'},cubeGroup);label.textContent=face;});
  const cubeTitle=nautilusEl('text',{x:946,y:92,'text-anchor':'middle',class:'nautilus-caption'},cubeGroup);cubeTitle.textContent='LETTER CUBE';
  [[spiralPoints.at(-1),[stairPoints[0].x,stairPoints[0].y]],[[stairPoints.at(-1).x,stairPoints.at(-1).y],[714,405]],[[842,390],[894,336]]].forEach(([from,to])=>nautilusEl('line',{x1:from[0]??from.x,y1:from[1]??from.y,x2:to[0]??to.x,y2:to[1]??to.y,class:'nautilus-handoff','marker-end':'url(#nautilus-arrow)'},handoffGroup));
  const boundaryLabel=nautilusEl('text',{x:520,y:558,'text-anchor':'middle',class:'nautilus-boundary-label'});boundaryLabel.textContent='ORDERED DISPLAY HANDOFF · NO ASTROPHYSICS · ZERO GRAPH DELTA';
  function renderNautilusMode(mode){
    const audit=A.nautilusStairAudit(mode);
    nautilusSvg.dataset.mode=mode;
    document.querySelectorAll('[data-nautilus-mode]').forEach(button=>{const active=button.dataset.nautilusMode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active?'true':'false');});
    const label=document.getElementById('nautilus-mode-label'),detail=document.getElementById('nautilus-mode-detail');
    const labels={nautilus:['NAUTILUS · ORDERED PATH','seed 7 → p₇=17 → R107/280'],stairs:['STAIRS · EIGHT CHECKPOINTS','p₂₅=97 → p₂₀₀=1223'],triangle:['PINK TRIANGLE · PRIME GATE','p₂₈=107 · p₂₉=109 · p₃₀=113'],cube:['LETTER CUBE · LOCAL FACE MAP','A=7 · B=17 · C=107 · D=109 · E=113 · F=280']};
    [label.textContent,detail.textContent]=labels[audit.mode];
  }
  document.querySelectorAll('[data-nautilus-mode]').forEach(button=>button.addEventListener('click',()=>renderNautilusMode(button.dataset.nautilusMode)));
  renderNautilusMode('nautilus');
  const stairSvg=document.getElementById('prime-stair'),primeStair=A.primeStairAudit(),stairNS='http://www.w3.org/2000/svg';
  function stairEl(name,attrs){const node=document.createElementNS(stairNS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));stairSvg.appendChild(node);return node;}
  const milestoneColours={1:'#3f7fc4',4:'#a56de2',7:'#bdd63b',8:'#43d6e6'},stairX=i=>62+i*110,stairY=p=>305-(p-97)/(1223-97)*245;
  [97,379,691,863,1223].forEach(value=>{const y=stairY(value);stairEl('line',{x1:45,y1:y,x2:855,y2:y,class:'prime-gridline'});const label=stairEl('text',{x:38,y:y+4,'text-anchor':'end',class:'prime-axis-label'});label.textContent=value;});
  let stairPath=`M ${stairX(0)} ${stairY(primeStair.milestones[0].prime)}`;
  primeStair.milestones.slice(1).forEach((entry,i)=>{stairPath+=` H ${stairX(i+1)} V ${stairY(entry.prime)}`;});
  stairEl('path',{d:stairPath,class:'prime-step-path'});
  stairEl('line',{x1:stairX(0),y1:352,x2:stairX(7),y2:352,class:'purple-rail'});
  primeStair.milestones.forEach((entry,i)=>{
    const x=stairX(i),y=stairY(entry.prime),node=stairEl('circle',{cx:x,cy:y,r:9,fill:milestoneColours[entry.mod9],class:'prime-milestone-node'});node.dataset.mod9=entry.mod9;
    const primeLabel=stairEl('text',{x,y:y-15,'text-anchor':'middle',class:'prime-node-label'});primeLabel.textContent=entry.prime;
    const indexLabel=stairEl('text',{x,y:y+25,'text-anchor':'middle',class:'prime-index-label'});indexLabel.textContent=`p${entry.index} · r${entry.mod9}`;
    stairEl('circle',{cx:x,cy:352,r:6,class:'purple-node'});
    const phaseLabel=stairEl('text',{x,y:374,'text-anchor':'middle',class:'purple-label'});phaseLabel.textContent=entry.indexMod11;
  });
  const carpetSvg=document.getElementById('flying-carpet'),carpet=A.flyingCarpetAudit(),carpetGrid=seedEl('g',{class:'carpet-grid-lines'},carpetSvg),carpetSpectrum=seedEl('g',{class:'carpet-spectrum'},carpetSvg),carpetBranch=seedEl('g',{class:'carpet-branch'},carpetSvg),carpetPoints=seedEl('g',{class:'carpet-points'},carpetSvg),carpetGaps=seedEl('g',{class:'carpet-gaps'},carpetSvg),carpetAddress=seedEl('g',{class:'carpet-address-marker'},carpetSvg);
  const carpetProject=(u,v)=>[105+u*52+v*20,438-v*30];
  for(let lane=0;lane<=10;lane++){
    const u0=carpetProject(lane,0),u1=carpetProject(lane,10),v0=carpetProject(0,lane),v1=carpetProject(10,lane);
    seedEl('line',{x1:u0[0],y1:u0[1],x2:u1[0],y2:u1[1],class:'carpet-grid-line'},carpetGrid);
    seedEl('line',{x1:v0[0],y1:v0[1],x2:v1[0],y2:v1[1],class:'carpet-grid-line'},carpetGrid);
  }
  const carpetColour={1:'#3f7fc4',4:'#a56de2',7:'#bdd63b',8:'#43d6e6'},carpetPositions=carpet.points.map(entry=>carpetProject(entry.gridU,entry.gridV));
  seedEl('path',{d:carpetPositions.map((p,i)=>`${i?'L':'M'} ${p[0]} ${p[1]}`).join(' '),class:'carpet-orange-path'},carpetBranch);
  carpet.points.forEach((entry,index)=>{
    const [x,y]=carpetPositions[index],colour=carpetColour[entry.mod9];
    seedEl('circle',{cx:x,cy:y,r:24,stroke:colour,class:'carpet-spectrum-halo'},carpetSpectrum);
    seedEl('circle',{cx:x,cy:y,r:8,fill:colour,class:'carpet-point'},carpetPoints);
    const prime=seedEl('text',{x,y:y-14,'text-anchor':'middle',class:'carpet-prime-label'},carpetPoints);prime.textContent=entry.prime;
    const coordinate=seedEl('text',{x,y:y+22,'text-anchor':'middle',class:'carpet-coordinate-label'},carpetPoints);coordinate.textContent=`${entry.gridU}:${entry.gridV}`;
  });
  [0,4].forEach((index,gapIndex)=>{
    const entry=carpet.points[index],[x,y]=carpetPositions[index],side=gapIndex===0?-1:1,labelX=x+side*62,labelY=y-42;
    seedEl('line',{x1:x,y1:y,x2:labelX,y2:labelY,class:'carpet-gap-line'},carpetGaps);
    seedEl('circle',{cx:x,cy:y,r:15,class:'carpet-gap-ring'},carpetGaps);
    const label=seedEl('text',{x:labelX,y:labelY-6,'text-anchor':'middle',class:'carpet-gap-label'},carpetGaps);label.textContent=`${entry.prime} | ${entry.cFreeLabel}`;
    const small=seedEl('text',{x:labelX,y:labelY+10,'text-anchor':'middle',class:'carpet-gap-small'},carpetGaps);small.textContent=gapIndex===0?'FIRST CUT':'LAST-2 DIGITS';
  });
  const [addressX,addressY]=carpetProject(5,5);seedEl('path',{d:`M ${addressX} ${addressY-17} L ${addressX+17} ${addressY} L ${addressX} ${addressY+17} L ${addressX-17} ${addressY} Z`,class:'carpet-address-diamond'},carpetAddress);
  const addressText=seedEl('text',{x:addressX,y:addressY-28,'text-anchor':'middle',class:'carpet-address-label'},carpetAddress);addressText.textContent='N15 · 151';
  function renderCarpetMode(mode){
    const audit=A.flyingCarpetAudit(mode);carpetSvg.dataset.mode=mode;
    document.querySelectorAll('[data-carpet-mode]').forEach(button=>button.classList.toggle('active',button.dataset.carpetMode===mode));
    const modeText={grid:'GRID · (n mod 11, label mod 11)',branch:'ORANGE BRANCH · milestone order',spectrum:'SPECTRA · p mod 9 classes'};
    document.getElementById('carpet-gap-label').textContent=`${modeText[mode]} · ${audit.yellowApertures.map(entry=>`${entry.prime} | ${entry.displayLabel}`).join(' · ')}`;
  }
  document.querySelectorAll('[data-carpet-mode]').forEach(button=>button.addEventListener('click',()=>renderCarpetMode(button.dataset.carpetMode)));renderCarpetMode('grid');
  const hingeOneSvg=document.getElementById('hinge-one'),hingeOne=A.hingeOneAudit(),hingeSplit=seedEl('g',{class:'hinge-one-split'},hingeOneSvg),hingeHedge=seedEl('g',{class:'hinge-one-hedge'},hingeOneSvg),hingeDrip=seedEl('g',{class:'hinge-one-drip'},hingeOneSvg),hingeGlyphs=seedEl('g',{class:'hinge-one-glyphs'},hingeOneSvg),h1x=360,h1y=248;
  seedEl('polygon',{points:'70,248 360,58 610,248 360,248',class:'hinge-face orange'},hingeSplit);
  seedEl('polygon',{points:'70,248 360,438 360,248',class:'hinge-face purple'},hingeSplit);
  seedEl('polygon',{points:'360,58 610,248 360,438 360,248',class:'hinge-face pink'},hingeSplit);
  seedEl('line',{x1:70,y1:248,x2:610,y2:248,class:'hinge-seam'},hingeSplit);
  seedEl('line',{x1:360,y1:58,x2:360,y2:438,class:'hinge-seam vertical'},hingeSplit);
  const hingeRing=seedEl('circle',{cx:h1x,cy:h1y,r:25,class:'hinge-one-ring'},hingeSplit),hingeCore=seedEl('circle',{cx:h1x,cy:h1y,r:10,class:'hinge-one-core'},hingeSplit);
  const hingeLabel=seedEl('text',{x:h1x,y:h1y+5,'text-anchor':'middle',class:'hinge-one-label'},hingeSplit);hingeLabel.textContent='1';
  const hingeCaption=seedEl('text',{x:h1x,y:h1y+45,'text-anchor':'middle',class:'hinge-one-caption'},hingeSplit);hingeCaption.textContent='H1 · DISPLAY HINGE';
  for(let mark=0;mark<hingeOne.pinkHedge.markCount;mark++){
    const t=mark/(hingeOne.pinkHedge.markCount-1),first=t<=.5,local=first?t*2:(t-.5)*2;
    const ax=first?70+(360-70)*local:360+(610-360)*local,ay=first?248+(58-248)*local:58+(248-58)*local;
    const offset=7+7*Math.sin(mark*1.7),x=ax+(first?-0.55:0.6)*offset,y=ay-offset;
    const cross=seedEl('text',{x,y,'text-anchor':'middle',class:'hinge-hedge-mark'},hingeHedge);cross.textContent='×';
  }
  const hedgeLabel=seedEl('text',{x:360,y:34,'text-anchor':'middle',class:'hinge-hedge-label'},hingeHedge);hedgeLabel.textContent='PINK HEDGE · 60 × · ONE DISPLAY TURN';
  hingeOne.glyphRegister.glyphs.forEach((entry,index)=>{
    const row=Math.floor(index/3),column=index%3,x=690+column*72,y=150+row*76;
    seedEl('circle',{cx:x,cy:y,r:23,class:`hinge-glyph-orb role-${entry.colourRole.toLowerCase()}`},hingeGlyphs);
    const glyph=seedEl('text',{x,y:y+7,'text-anchor':'middle',class:'hinge-glyph'},hingeGlyphs);glyph.textContent=entry.glyph;
    const slot=seedEl('text',{x,y:y+38,'text-anchor':'middle',class:'hinge-glyph-slot'},hingeGlyphs);slot.textContent=`G${entry.slot}`;
  });
  const glyphTitle=seedEl('text',{x:762,y:82,'text-anchor':'middle',class:'hinge-glyph-title'},hingeGlyphs);glyphTitle.textContent='UNASSIGNED GLYPH REGISTER · 3 × 3';
  hingeOne.glyphRegister.glyphs.forEach((entry,index)=>{
    const t=(index+1)/hingeOne.yellowDrip.dropCount,x=h1x+155*Math.sin(t*Math.PI)*.22,y=h1y+28+t*174,r=3+index*.55;
    seedEl('line',{x1:h1x,y1:h1y+20,x2:x,y2:y,class:'hinge-drip-thread'},hingeDrip);
    seedEl('circle',{cx:x,cy:y,r,class:'hinge-drip-drop'},hingeDrip);
  });
  const dripLabel=seedEl('text',{x:h1x+56,y:455,'text-anchor':'start',class:'hinge-drip-label'},hingeDrip);dripLabel.textContent='YELLOW DRIP · 9 DISPLAY DROPS';
  function renderHingeOneMode(mode){
    const audit=A.hingeOneAudit(mode);hingeOneSvg.dataset.mode=mode;
    document.querySelectorAll('[data-hinge-one-mode]').forEach(button=>button.classList.toggle('active',button.dataset.hingeOneMode===mode));
    const readout={split:'SPLIT · H1 separates display roles only',hedge:`PINK HEDGE · ${audit.pinkHedge.markCount} ×-marks · no Pantone binding`,drip:`YELLOW DRIP · ${audit.yellowDrip.dropCount} display drops · no flow claim`,glyphs:'GLYPHS · 3 × 3 owner-supplied register · meanings unassigned'};
    document.getElementById('hinge-one-readout').textContent=readout[mode];
  }
  document.querySelectorAll('[data-hinge-one-mode]').forEach(button=>button.addEventListener('click',()=>renderHingeOneMode(button.dataset.hingeOneMode)));renderHingeOneMode('split');
  const ulamSvg=document.getElementById('ulam-spiral'),ulam=A.ulamMilestoneAudit(),uc=340,us=18;
  function ulamEl(name,attrs){const node=document.createElementNS(stairNS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));ulamSvg.appendChild(node);return node;}
  const ux=x=>uc+x*us,uy=y=>uc-y*us;
  for(let c=-17;c<=17;c++){
    ulamEl('line',{x1:ux(c),y1:34,x2:ux(c),y2:646,class:c===0?'ulam-axis':'ulam-gridline'});
    ulamEl('line',{x1:34,y1:uy(c),x2:646,y2:uy(c),class:c===0?'ulam-axis':'ulam-gridline'});
  }
  for(let n=2;n<=ulam.limit;n++)if(A.isPrime(n)){
    const p=A.ulamCoordinate(n);ulamEl('circle',{cx:ux(p.x),cy:uy(p.y),r:2.25,class:'ulam-prime'});
  }
  ulam.milestones.forEach((entry,i)=>{
    const x=ux(entry.x),y=uy(entry.y),colour=milestoneColours[entry.mod9];
    ulamEl('circle',{cx:x,cy:y,r:8,fill:colour,class:'ulam-milestone'});
    ulamEl('line',{x1:x-7,y1:y-7,x2:x+7,y2:y+7,stroke:colour,class:'ulam-cross'});
    ulamEl('line',{x1:x+7,y1:y-7,x2:x-7,y2:y+7,stroke:colour,class:'ulam-cross'});
    const anchor=entry.x>10?'end':'start',dx=entry.x>10?-11:11,dy=i%2===0?-8:14;
    const t=ulamEl('text',{x:x+dx,y:y+dy,'text-anchor':anchor,class:'ulam-label'});t.textContent=`${entry.prime} · ${entry.cFreeLabel}`;
  });
  const originLabel=ulamEl('text',{x:ux(0)+7,y:uy(0)-7,class:'ulam-origin-label'});originLabel.textContent='1';
  const eulerSvg=document.getElementById('euler-rainbow'),euler=A.eulerRainbowAudit(),eulerColours=['#f5c65b','#ed8e45','#ef6b73','#ef6cb5','#54bce8','#43d6e6','#39c989','#9bcf4a','#f0b93f','#e87c4f','#ee657c','#dc6ec7','#49b7e8'];
  function eulerEl(name,attrs){const node=document.createElementNS(stairNS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));eulerSvg.appendChild(node);return node;}
  const ex=n=>45+n/60*620,ey=v=>350-(v-13)/(5119-13)*310;
  [0,20,40,60].forEach(n=>{eulerEl('line',{x1:ex(n),y1:32,x2:ex(n),y2:350,class:'euler-grid'});const t=eulerEl('text',{x:ex(n),y:373,'text-anchor':'middle',class:'euler-label'});t.textContent=n;});
  [0,1000,2000,3000,4000,5000].forEach(v=>{eulerEl('line',{x1:45,y1:ey(Math.max(v,13)),x2:665,y2:ey(Math.max(v,13)),class:'euler-grid'});const t=eulerEl('text',{x:39,y:ey(Math.max(v,13))+4,'text-anchor':'end',class:'euler-label'});t.textContent=v;});
  euler.historicalFloors.forEach((c,i)=>{let d='';for(let n=0;n<=60;n+=2){d+=`${n?'L':'M'} ${ex(n)} ${ey(n*n+n+c)} `;}eulerEl('path',{d,class:`euler-curve floor-${i<8?'lower':'upper'}`,stroke:eulerColours[i]});});
  const gearSvg=document.getElementById('zeta-timegear'),gear=A.timegearAudit(),gcx=260,gcy=260,gearRadii=[128,174,220],gearColours=['#e7f6fa','#43d6e6','#a56de2'];
  function gearEl(name,attrs){const node=document.createElementNS(stairNS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));gearSvg.appendChild(node);return node;}
  gear.cycles.forEach((count,ring)=>{const radius=gearRadii[ring];gearEl('circle',{cx:gcx,cy:gcy,r:radius,fill:'none',stroke:gearColours[ring],class:'gear-ring'});for(let tick=0;tick<count;tick++){const a=-Math.PI/2+2*Math.PI*tick/count,major=tick%(count/20)===0,inner=radius-(major?11:4);gearEl('line',{x1:gcx+inner*Math.cos(a),y1:gcy+inner*Math.sin(a),x2:gcx+radius*Math.cos(a),y2:gcy+radius*Math.sin(a),stroke:gearColours[ring],class:major?'gear-tick major':'gear-tick'});}});
  for(let g=0;g<20;g++){const a=-Math.PI/2+2*Math.PI*g/20;gearEl('line',{x1:gcx+88*Math.cos(a),y1:gcy+88*Math.sin(a),x2:gcx+116*Math.cos(a),y2:gcy+116*Math.sin(a),class:'gear-spoke'});}
  const centre=gearEl('text',{x:gcx,y:gcy-4,'text-anchor':'middle',class:'gear-centre'});centre.textContent='20 GATES';const centre2=gearEl('text',{x:gcx,y:gcy+16,'text-anchor':'middle',class:'gear-centre small'});centre2.textContent='18° · RETURN 8400';
  const breathSvg=document.getElementById('euler-ring-breath-svg'),breathCx=380,breathCy=280,breathMaxRadius=226,breathDirect=seedEl('g',{class:'euler-breath-rings direct'},breathSvg),breathMirror=seedEl('g',{class:'euler-breath-rings mirror'},breathSvg),breathBridge=seedEl('line',{class:'euler-breath-bridge'},breathSvg);
  const directRings=[],mirrorRings=[];
  for(let ring=1;ring<=13;ring++){
    const radius=22+(ring-1)*(breathMaxRadius-22)/12,role=ring<=8?'inner':'outer';
    directRings.push(seedEl('circle',{cx:breathCx,cy:breathCy,r:radius,class:`${role} ring-${ring}`},breathDirect));
    mirrorRings.push(seedEl('circle',{cx:breathCx,cy:breathCy,r:radius,class:`${role} ring-${ring}`},breathMirror));
  }
  const breathDirectLabel=seedEl('text',{x:breathCx-120,y:34,'text-anchor':'middle',class:'euler-breath-label direct'},breathSvg);breathDirectLabel.textContent='DIRECT · 8+5';
  const breathMirrorLabel=seedEl('text',{x:breathCx+120,y:34,'text-anchor':'middle',class:'euler-breath-label mirror'},breathSvg);breathMirrorLabel.textContent='MIRROR · 8+5';
  const breathCentre=seedEl('circle',{cx:breathCx,cy:breathCy,r:7,class:'euler-breath-centre'},breathSvg);
  const breathStep=document.getElementById('euler-breath-step');
  function renderEulerBreath(){
    const audit=A.eulerRingBreathAudit(Number(breathStep.value)),terminal=A.eulerRingBreathAudit(280).drift.normalizedAperture;
    const separation=terminal===0?0:audit.drift.normalizedAperture/terminal*112,left=breathCx-separation/2,right=breathCx+separation/2;
    directRings.forEach(circle=>circle.setAttribute('cx',left));mirrorRings.forEach(circle=>circle.setAttribute('cx',right));
    breathBridge.setAttribute('x1',left);breathBridge.setAttribute('x2',right);breathBridge.setAttribute('y1',breathCy);breathBridge.setAttribute('y2',breathCy);
    breathCentre.setAttribute('cx',breathCx);
    breathDirectLabel.setAttribute('x',left);breathMirrorLabel.setAttribute('x',right);
    document.getElementById('euler-breath-step-label').textContent=`${audit.step} / 280`;
    document.getElementById('euler-breath-drift').textContent=`${audit.drift.relativeDegrees.toFixed(3)}°`;
    document.getElementById('euler-breath-aperture').textContent=audit.drift.normalizedAperture.toFixed(4);
  }
  breathStep.addEventListener('input',renderEulerBreath);renderEulerBreath();
  const choirSvg=document.getElementById('e8-spoke-choir'),choir=A.e8SpokeChoirAudit(),cc=360,canonicalOuter=305,pairColours=['#70aeea','#ed8e45','#68e7b0','#ef6cb5'];
  function choirEl(name,attrs){const node=document.createElementNS(stairNS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));choirSvg.appendChild(node);return node;}
  const choirRadius=value=>value/choir.rings.at(-1).radius*canonicalOuter;
  for(let spoke=0;spoke<choir.pointsPerOrbit;spoke++){
    const a=-Math.PI/2+2*Math.PI*spoke/choir.pointsPerOrbit;
    choirEl('line',{x1:cc+44*Math.cos(a),y1:cc+44*Math.sin(a),x2:cc+canonicalOuter*Math.cos(a),y2:cc+canonicalOuter*Math.sin(a),class:'e8-spoke'});
  }
  choir.rings.forEach((entry,index)=>{
    const radius=choirRadius(entry.radius),colour=index<2?'#70aeea':index<4?'#ed8e45':index<6?'#68e7b0':'#ef6cb5';
    choirEl('circle',{cx:cc,cy:cc,r:radius,stroke:colour,class:'e8-ring'});
    for(let spoke=0;spoke<choir.pointsPerOrbit;spoke++){
      const a=-Math.PI/2+2*Math.PI*spoke/choir.pointsPerOrbit;
      choirEl('circle',{cx:cc+radius*Math.cos(a),cy:cc+radius*Math.sin(a),r:2.65,fill:colour,class:'e8-root'});
    }
    const la=-Math.PI/2-0.045;
    const label=choirEl('text',{x:cc+(radius+9)*Math.cos(la),y:cc+(radius+9)*Math.sin(la),'text-anchor':'middle',class:'e8-ring-label'});label.textContent=`R${entry.ring}`;
  });
  const tubeOffsets=[0,7,15,22],tubeViews=choir.pairs.map((pair,index)=>({pair,line:choirEl('line',{stroke:pairColours[index],class:'e8-tube'}),inner:choirEl('circle',{r:7,fill:pairColours[index],class:'e8-tube-node'}),outer:choirEl('circle',{r:7,fill:pairColours[index],class:'e8-tube-node'})}));
  const choirCenter=choirEl('text',{x:cc,y:cc-5,'text-anchor':'middle',class:'e8-centre'});choirCenter.textContent='8 × 30';
  const choirCenter2=choirEl('text',{x:cc,y:cc+15,'text-anchor':'middle',class:'e8-centre small'});choirCenter2.textContent='240 ROOTS · 12°';
  const phaseInput=document.getElementById('e8-spoke-phase'),phaseReadout=document.getElementById('e8-spoke-readout');
  function renderChoirTubes(){
    const phase=Number(phaseInput.value);phaseReadout.textContent=`${phase} / 29`;
    tubeViews.forEach((view,index)=>{
      const a=-Math.PI/2+2*Math.PI*((phase+tubeOffsets[index])%choir.pointsPerOrbit)/choir.pointsPerOrbit;
      const innerRadius=choirRadius(choir.rings[view.pair.inner-1].radius),outerRadius=choirRadius(choir.rings[view.pair.outer-1].radius);
      const points={x1:cc+innerRadius*Math.cos(a),y1:cc+innerRadius*Math.sin(a),x2:cc+outerRadius*Math.cos(a),y2:cc+outerRadius*Math.sin(a)};
      Object.entries(points).forEach(([key,value])=>view.line.setAttribute(key,value));
      view.inner.setAttribute('cx',points.x1);view.inner.setAttribute('cy',points.y1);view.outer.setAttribute('cx',points.x2);view.outer.setAttribute('cy',points.y2);
    });
  }
  phaseInput.addEventListener('input',renderChoirTubes);renderChoirTubes();
})();
