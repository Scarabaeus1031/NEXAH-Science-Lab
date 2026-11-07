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
  const orbit=A.orbit(),pts=orbit.slice(0,A.TRAIL_POINT_COUNT).map(n=>{const a=-Math.PI/2+2*Math.PI*n/280;return `${cx+A.TRAIL_RADIUS*Math.cos(a)},${cy+A.TRAIL_RADIUS*Math.sin(a)}`;}).join(' ');el('polyline',{points:pts,class:'trail'});
  const stepLine=el('line',{class:'step'}),point=el('circle',{r:7,class:'point'}),origin=el('circle',{cx:300,cy:55,r:5,class:'origin'});
  [0,70,107,140,173,210].forEach(n=>{const a=-Math.PI/2+2*Math.PI*n/280,t=el('text',{x:cx+(r+22)*Math.cos(a),y:cy+(r+22)*Math.sin(a),'text-anchor':'middle',class:n===107?'hot':''});t.textContent=n;});
  function xy(n,rad=r-28){const a=-Math.PI/2+2*Math.PI*n/280;return [cx+rad*Math.cos(a),cy+rad*Math.sin(a)];}
  function render(){const [x,y]=xy(state.phase);point.setAttribute('cx',x);point.setAttribute('cy',y);stepLine.setAttribute('x1',300);stepLine.setAttribute('y1',55);stepLine.setAttribute('x2',x);stepLine.setAttribute('y2',y);document.getElementById('digit-word').textContent=state.source;document.getElementById('phase').textContent=state.phase;document.getElementById('orientation').textContent=state.circleMirrored?'mirrored':'direct';const log=[`SOURCE · ${state.source} · phase ${state.phase}`,...state.history.map((op,i)=>`${String(i+1).padStart(2,'0')} · ${op}`),`AUDIT · ${A.exactAudit().status}`];document.getElementById('ledger').textContent=log.join('\n');origin.setAttribute('opacity',state.phase===0?'1':'.35');const handoff=document.getElementById('pink-diamond-handoff');if(handoff)handoff.href=`../A0_PINK_DIAMOND_GRID_ATLAS.html?a0_phase=${state.phase}#typedBoundaryHingeDock`;}
  document.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>{state=A.apply(state,b.dataset.op);render();}));render();
  document.getElementById('tangent-radius').textContent=geometry.tangentRadius.toFixed(4);
  document.getElementById('ring-gap').textContent=geometry.ringGap.toFixed(4);
  document.getElementById('trail-count').textContent=`${geometry.trailPoints} / ${geometry.trailSegments}`;
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
