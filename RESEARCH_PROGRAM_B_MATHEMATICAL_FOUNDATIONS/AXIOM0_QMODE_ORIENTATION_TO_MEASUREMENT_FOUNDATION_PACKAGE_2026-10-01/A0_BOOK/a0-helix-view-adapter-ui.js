(function(){
  'use strict';
  const root=document.querySelector('[data-helix-adapter]');
  const M=window.A0HelixViewAdapter;
  if(!root||!M)return;
  const canvas=root.querySelector('[data-hv-canvas]'),ctx=canvas.getContext('2d');
  const modeButtons=[...root.querySelectorAll('[data-hv-mode]')],strandButtons=[...root.querySelectorAll('[data-hv-strand]')],registerButtons=[...root.querySelectorAll('[data-hv-register]')],railToggle=root.querySelector('[data-hv-rail]');
  const mixInput=root.querySelector('[data-hv-mix]'),phaseOut=root.querySelector('#helixPhaseOut');
  const phaseControl=root.querySelector('.hv-phase-control'),zetaControl=root.querySelector('[data-hv-zeta-control]'),logXInput=root.querySelector('[data-hv-logx]'),betaOffsetInput=root.querySelector('[data-hv-beta-offset]');
  const residueControl=root.querySelector('[data-hv-residue-control]'),residueAngleButtons=[...root.querySelectorAll('[data-hv-residue-angle]')],residueSummary=root.querySelector('[data-hv-residue-summary]');
  const zetaLensButtons=[...root.querySelectorAll('[data-hv-zeta-lens]')],traceWordButtons=[...root.querySelectorAll('[data-hv-trace-word]')],traceSwitch=root.querySelector('[data-hv-trace-switch]');
  const zetaSummary=root.querySelector('[data-hv-zeta-summary]'),betaLabel=root.querySelector('[data-hv-beta-label]'),zetaX=root.querySelector('[data-hv-zeta-x]'),zetaLogX=root.querySelector('[data-hv-zeta-logx]'),zetaRho=root.querySelector('[data-hv-zeta-rho]'),zetaTheta=root.querySelector('[data-hv-zeta-theta]'),zetaEnvelope=root.querySelector('[data-hv-zeta-envelope]'),zetaContribution=root.querySelector('[data-hv-zeta-contribution]'),zetaLensOut=root.querySelector('[data-hv-zeta-lens-out]'),zetaWitness=root.querySelector('[data-hv-zeta-witness]');
  const turnsOut=root.querySelector('[data-hv-turns]'),iotaOut=root.querySelector('[data-hv-iota]'),daoOut=root.querySelector('[data-hv-dao]'),pitchOut=root.querySelector('[data-hv-pitch]'),curvatureOut=root.querySelector('[data-hv-curvature]'),torsionOut=root.querySelector('[data-hv-torsion]');
  const indexInput=root.querySelector('[data-hv-index]'),prev=root.querySelector('[data-hv-prev]'),next=root.querySelector('[data-hv-next]');
  const recordEl=root.querySelector('[data-hv-record]'),pairEl=root.querySelector('[data-hv-pair]'),detailEl=root.querySelector('[data-hv-detail]'),countEl=root.querySelector('[data-hv-count]'),strandReadout=root.querySelector('[data-hv-strand-readout]'),registerReadout=root.querySelector('[data-hv-register-readout]');
  let mode='twins',strandMode='double',registerMode='pair',residueAngle='paired',mix=0,logX=Math.log(1000),betaOffset=0,zetaLens='smooth',traceWord='RLLR',showRail=true,selected=0,rotX=-0.08,rotY=0.42,drag=null,screenRungs=[];

  function css(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim()}
  function records(){return M.modeRecords(mode)}
  function geometry(){return M.buildGeometry(records(),{mix,strandMode,logX,betaOffset,zetaLens,traceWord,residueAngle})}
  function doubleView(){return mode==='residue'?residueAngle==='paired':strandMode==='double'}
  function resize(){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
    if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr)}
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function project(point,w,h){
    const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);
    const x1=point.x*cy-point.z*sy,z1=point.x*sy+point.z*cy;
    const y2=point.y*cx-z1*sx,z2=point.y*sx+z1*cx;
    const scale=Math.min(w,h)*.38,perspective=4.4/(4.4+z2);
    return{x:w/2+x1*scale*perspective,y:h/2+y2*scale*perspective,z:z2,p:perspective};
  }
  function path(points,color,width=1,alpha=1){
    if(!points.length)return;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.stroke();ctx.restore();
  }
  function dot(point,r,color,stroke){ctx.beginPath();ctx.arc(point.x,point.y,r,0,M.TAU);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.lineWidth=2;ctx.strokeStyle=stroke;ctx.stroke()}}
  function registerOverlay(g,w,h,colors){
    if(mode==='zeta'||mode==='residue'||registerMode==='pair')return;
    if(registerMode==='fh14'||registerMode==='triad21'){
      const bundle=M.registerGeometry(registerMode,g.rungs.length,{step:g.step,radius:g.innerRadius*1.18,height:g.height});
      const palette=registerMode==='fh14'?[colors.a,colors.b]:[colors.a,colors.blue,colors.b];
      bundle.strands.forEach((strand,i)=>path(strand.points.map(p=>project(p,w,h)),palette[registerMode==='fh14'?(strand.family==='F'?0:1):(strand.triad-1)],registerMode==='fh14'?1.1:.9,registerMode==='fh14'?.28:.2));
      return;
    }
    const y=g.rungs[selected]&&g.rungs[selected].strandA.y||0,frame=M.z37Frame({y,radius:g.innerRadius*1.3});
    const ring=frame.points.map(p=>project(p,w,h));
    path([...ring,ring[0]],colors.blue,1.2,.55);
    frame.pairs.forEach(pair=>path([project(pair.pointA,w,h),project(pair.pointB,w,h)],colors.line,.75,.22));
    path(frame.axis.map(p=>project(p,w,h)),colors.text,2,.85);
    ring.forEach((p,r)=>dot(p,r===0?5:(r===18||r===19?4:2.1),r===0?colors.text:(r===18||r===19?colors.b:colors.blue)));
  }
  function draw(){
    const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,g=geometry();ctx.clearRect(0,0,w,h);
    const colors={a:css('--cyan'),b:css('--orange'),rail:css('--gold'),line:css('--line'),text:css('--text'),blue:css('--blue')},showDouble=doubleView();
    const projected=g.rungs.map(r=>({r,a:project(r.strandA,w,h),b:project(r.strandB,w,h),mid:project(r.midpoint,w,h),railA:project(r.railA,w,h),railB:project(r.railB,w,h)}));
    const byDepth=projected.slice().sort((u,v)=>u.a.z-v.a.z);screenRungs=projected;
    registerOverlay(g,w,h,colors);
    if(showDouble&&mode!=='zeta'&&mode!=='residue'){
      const axisTop=project({x:0,y:-g.height/2,z:0},w,h),axisBottom=project({x:0,y:g.height/2,z:0},w,h);
      ctx.save();ctx.setLineDash([4,5]);path([axisTop,axisBottom],colors.line,1.1,.65);ctx.restore();
    }
    if(mode==='zeta'&&zetaLens==='seam'&&showDouble){
      ctx.save();ctx.setLineDash([7,5]);path(projected.map(x=>x.b),colors.b,4,.86);ctx.restore();path(projected.map(x=>x.a),colors.a,2.1,.95);
    }else{path(projected.map(x=>x.a),colors.a,2.2,.82);if(showDouble)path(projected.map(x=>x.b),colors.b,2.2,.78)}
    if(showRail&&mode!=='zeta'&&mode!=='residue'){path(projected.map(x=>x.railA),colors.rail,1.4,.64);if(showDouble)path(projected.map(x=>x.railB),colors.rail,1.4,.42)}
    for(const item of byDepth){
      const active=item.r.index-1===selected;if(showDouble&&!(mode==='zeta'&&zetaLens==='seam')){path([item.a,item.b],active?colors.text:(item.r.kink?colors.blue:item.r.codon?colors.blue:colors.line),active?2.6:(item.r.kink?2:1),active?1:(mode==='residue'?.18:.72));if(mode!=='zeta'&&mode!=='residue')dot(item.mid,active?3.7:1.8,active?colors.text:colors.blue)}
      const radius=(item.r.codon?4:mode==='residue'?2.1:2.5)*item.a.p;dot(item.a,radius,mode==='residue'?residueColor(item.r,residueAngle==='mod11'?11:7):colors.a,active?colors.text:null);if(showDouble)dot(item.b,radius,mode==='residue'?residueColor(item.r,11):colors.b,active?colors.text:null);
      if(mode==='zeta'&&item.r.kink){dot(item.a,6.2*item.a.p,colors.blue,active?colors.text:colors.rail);if(showDouble)dot(item.b,6.2*item.b.p,colors.blue,active?colors.text:colors.rail)}
      if(mode==='zeta'&&zetaLens==='seam'&&active){dot(item.b,8.5*item.b.p,colors.b,colors.text);dot(item.a,4.5*item.a.p,colors.a,colors.text)}
      if(showRail&&mode!=='zeta'&&mode!=='residue'&&item.r.fibonacci){dot(item.railA,4.4*item.railA.p,colors.rail,colors.text);if(showDouble)dot(item.railB,4.4*item.railB.p,colors.rail,colors.text)}
    }
  }
  function setSelected(index){
    const list=records();selected=(index+list.length)%list.length;indexInput.max=String(list.length);indexInput.value=String(selected+1);countEl.textContent=mode==='zeta'?`${list.length} zero pairs · ${zetaLens.toUpperCase()} LENS`:mode==='residue'?`${list.length} prime records · ${residueAngle.toUpperCase()}`:`${list.length} ${strandMode==='double'?'rungs':'nodes'} · ${registerLabel()}`;const info=M.inspection(mode,selected,mix,strandMode,{logX,betaOffset,zetaLens,traceWord,residueAngle});
    recordEl.textContent=info.recordId;pairEl.textContent=mode==='residue'?String(info.prime):strandMode==='double'?`${info.pair[0]} ↔ ${info.pair[1]}`:`${info.single[0]}`;
    if(mode==='zeta'){
      const trace=M.traceWordData(traceWord),seam=M.phaseSeamData();
      const mirror=zetaLens==='smooth'?'θ ↔ −θ · conjugate wave':zetaLens==='trace'?`${traceWord} slot ${info.traceSlot}/4 · ${info.traceSymbol} · ${info.kink?'KINK':'run'}`:'−1/12 ≡ 11/12 (mod 1) · lift Δ=1';
      detailEl.innerHTML=`<dt>Carrier</dt><dd>ζ zero conjugate pair · finite sample</dd><dt>Source β</dt><dd>${decimal(info.sourceBeta,3)} · fixed</dd><dt>Probe β</dt><dd>${decimal(info.beta,3)} · view only</dd><dt>γ</dt><dd>${decimal(info.gamma,12)}</dd><dt>Phase θ</dt><dd>${decimal(info.theta,6)} rad</dd><dt>Comparator</dt><dd>${mirror}</dd><dt>Return</dt><dd>EXACT → [${info.return.values.join(', ')}]</dd>`;
      strandReadout.innerHTML=strandMode==='double'?(zetaLens==='smooth'?'<b>ζ CONJUGATE PAIR</b> · <code>ρ=β±iγ</code> · mirror <code>θ↔−θ</code> · no central-axis claim':zetaLens==='trace'?`<b>${traceWord} TRACE</b> · signs <code>${trace.signs.join(' ')}</code> · ${trace.kinkCount} kinks / word · complement ${trace.complement}`:'<b>PHASE SEAM</b> · same circle point · distinct lift/history witness'):'<b>ζ POSITIVE ORDINATE</b> · one sampled zero · companion hidden';
      registerReadout.innerHTML=zetaLens==='smooth'?'<b>EXPLICIT FORMULA</b> · finite pair term · <code>θ=γ log x</code> · normalized by <code>√x</code>':zetaLens==='trace'?'<b>TRACE WORD</b> · path witness only · not a Dirichlet character':'<b>VIEW CUT</b> · <code>−1/12 ≡ 11/12 (mod 1)</code> · source lift retained';
      zetaSummary.textContent=`x=${formatNumber(info.x,3)} · β=${decimal(info.beta,3)}`;betaLabel.textContent=decimal(betaOffset,3);
      zetaX.textContent=formatNumber(info.x,3);zetaLogX.textContent=decimal(info.logX,6);zetaRho.textContent=`${decimal(info.beta,3)} + ${decimal(info.gamma,6)}i`;zetaTheta.textContent=`${decimal(info.theta,6)} rad`;zetaEnvelope.textContent=decimal(info.normalizedAmplitude,6);zetaContribution.textContent=decimal(info.normalizedContribution,8);
      zetaLensOut.textContent=zetaLens.toUpperCase();zetaWitness.textContent=zetaLens==='smooth'?'θ ↔ −θ':zetaLens==='trace'?`${traceWord} · kinks ${trace.kinkPositions.join(',')}`:`${fraction(seam.shadow)} ↔ ${fraction(seam.visible)} · lift +1`;
      draw();return;
    }
    if(mode==='residue'){
      const viewLabel=info.angleMode==='paired'?'7|11 · SAME RECORD / TWO RAILS':info.angleMode.toUpperCase();
      detailEl.innerHTML=`<dt>Carrier</dt><dd>Prime p≤1000 · shared finite carrier</dd><dt>Prime index</dt><dd>${info.index} / 168</dd><dt>p mod 7</dt><dd>${info.residue7} · ${decimal(info.angleDegrees7,6)}°</dd><dt>p mod 11</dt><dd>${info.residue11} · ${decimal(info.angleDegrees11,6)}°</dd><dt>Tail boundary</dt><dd>${info.tail.length} primes · 1000&lt;p≤1111 · outside view</dd><dt>Return</dt><dd>EXACT → ${info.return.values[0]}</dd>`;
      strandReadout.innerHTML=`<b>${viewLabel}</b> · vertical order = prime index · angle only changes the view`;
      registerReadout.innerHTML='<b>VIEW CROSSWALK</b> · same <code>PC1111</code> record · no antipodal/DNA rung claim';
      residueSummary.textContent=info.angleMode==='paired'?'7|11 · two declared angle rails':`${info.angleMode.toUpperCase()} · one declared angle rail`;
      draw();return;
    }
    const role=mode==='twins'?'Twin prime pair':(info.fixed?'Fixed point orbit':'Two-cycle orbit');
    const axis=info.axisIntersection?`(${nearZero(info.axisIntersection.x)}, ${info.axisIntersection.y.toFixed(6)}, ${nearZero(info.axisIntersection.z)})`:'NONE · SINGLE STRAND';
    detailEl.innerHTML=`<dt>Carrier</dt><dd>${role}</dd><dt>View</dt><dd>${strandMode==='double'?'(c)D|⁄|A · 2-STRAND':'RN\\A · 1-STRAND'}</dd><dt>Phase step</dt><dd>${info.phaseDegrees.toFixed(6)}°</dd><dt>3er register</dt><dd>Codon ${info.codonIndex} · slot ${info.codonSlot}/3</dd><dt>Axis Lₖ(1/2)</dt><dd>${axis}</dd><dt>Fibonacci index</dt><dd>${info.fibonacciMarker?'YES':'NO'}</dd><dt>Return</dt><dd>EXACT → [${info.return.values.join(', ')}]</dd>`;
    strandReadout.innerHTML=strandMode==='double'?'<b>(c)D|⁄|A</b> · antipodaler Doppelstrang · <code>Lₖ(1/2)=(0,zₖ,0)</code>':'<b>RN\\A</b> · gerichteter Einzelstrang A · kein Gegenstrang / keine Sprosse';
    registerReadout.innerHTML=registerDescription();
    const measures=info.measures;turnsOut.textContent=`${decimal(measures.turns,6)} turns`;iotaOut.textContent=`${decimal(measures.iota,6)} / rad`;daoOut.textContent=decimal(measures.dao,6);pitchOut.textContent=`${decimal(measures.pitchPerTurn,6)} view units`;curvatureOut.textContent=decimal(measures.curvature,6);torsionOut.textContent=`${decimal(measures.torsionMagnitude,6)} / view unit`;
    draw();
  }
  function nearZero(value){return Math.abs(value)<1e-12?'0':value.toFixed(6)}
  function decimal(value,digits){return value.toFixed(digits).replace('.',',')}
  function formatNumber(value,digits){return new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(value)}
  function setMode(nextMode){
    mode=nextMode;const zeta=mode==='zeta',residue=mode==='residue',locked=zeta||residue;modeButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvMode===mode)));
    phaseControl.hidden=locked;zetaControl.hidden=!zeta;residueControl.hidden=!residue;registerButtons.forEach(btn=>btn.disabled=locked);strandButtons.forEach(btn=>btn.disabled=residue);railToggle.disabled=locked;railToggle.closest('.hv-check').classList.toggle('is-disabled',locked);
    setSelected(0);
  }
  function setStrandMode(nextMode){strandMode=M.strandMode(nextMode);strandButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvStrand===strandMode)));setSelected(selected)}
  function registerLabel(){return({pair:'PAIR 1+1',fh14:'F/H 7+7',triad21:'TRIAD 3×7',z37frame:'ℤ₃₇ 1+18'})[registerMode]}
  function registerDescription(){return({pair:'<b>PAIR · 1+1</b> · geprüfter Quellträger ohne zusätzlichen Phasen-Layer',fh14:'<b>F/H · 7+7</b> · F1…F7 plus antipodale H1…H7 auf demselben z-Register',triad21:'<b>TRIAD · 3×7</b> · 21 eindeutige Phasenlagen aus drei 7er-Familien',z37frame:'<b>ℤ₃₇ · 1+18</b> · Fixpunkt 0, 18 Inversionspaare, Achse 0 ↔ Naht 18|19'})[registerMode]}
  function setRegisterMode(nextMode){registerMode=M.registerMode(nextMode);registerButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvRegister===registerMode)));setSelected(selected)}
  function setMix(value){mix=Math.max(0,Math.min(1,value));const deg=M.degrees(M.phaseStep(mix));phaseOut.textContent=`${deg.toFixed(6).replace('.',',')}° · ${mix===0?'10er-Takt':mix===1?'Goldener Winkel':'deklarierter Mix'}`;setSelected(selected)}
  function setLogX(value){logX=Math.max(Math.log(2),Math.min(Math.log(1000000),value));setSelected(selected)}
  function setBetaOffset(value){betaOffset=Math.max(-.08,Math.min(.08,value));setSelected(selected)}
  function setZetaLens(value){zetaLens=M.zetaLensMode(value);zetaLensButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvZetaLens===zetaLens)));traceSwitch.hidden=zetaLens!=='trace';setSelected(selected)}
  function setTraceWord(value){traceWord=M.traceWordData(value).word;traceWordButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvTraceWord===traceWord)));setSelected(selected)}
  function setResidueAngle(value){residueAngle=M.residueAngleMode(value);residueAngleButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvResidueAngle===residueAngle)));setSelected(selected)}
  function residueColor(record,modulus){const residue=modulus===11?record.residue11:record.residue7;return `hsl(${Math.round(300*residue/(modulus-1)+25)} 82% 62%)`}
  function fraction(value){return value===-1/12?'−1/12':value===11/12?'11/12':decimal(value,6)}
  function distanceToSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy;if(!l2)return Math.hypot(p.x-a.x,p.y-a.y);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l2));return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy))}
  function point(event){const r=canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top}}
  modeButtons.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.hvMode)));
  strandButtons.forEach(btn=>btn.addEventListener('click',()=>setStrandMode(btn.dataset.hvStrand)));
  registerButtons.forEach(btn=>btn.addEventListener('click',()=>setRegisterMode(btn.dataset.hvRegister)));
  zetaLensButtons.forEach(btn=>btn.addEventListener('click',()=>setZetaLens(btn.dataset.hvZetaLens)));
  traceWordButtons.forEach(btn=>btn.addEventListener('click',()=>setTraceWord(btn.dataset.hvTraceWord)));
  residueAngleButtons.forEach(btn=>btn.addEventListener('click',()=>setResidueAngle(btn.dataset.hvResidueAngle)));
  railToggle.addEventListener('change',()=>{showRail=railToggle.checked;draw()});mixInput.addEventListener('input',()=>setMix(Number(mixInput.value)/1000));logXInput.addEventListener('input',()=>setLogX(Number(logXInput.value)));betaOffsetInput.addEventListener('input',()=>setBetaOffset(Number(betaOffsetInput.value)));indexInput.addEventListener('input',()=>setSelected(Number(indexInput.value)-1));prev.addEventListener('click',()=>setSelected(selected-1));next.addEventListener('click',()=>setSelected(selected+1));
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);drag={...point(event),rotX,rotY,moved:false}});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;const p=point(event);if(Math.abs(p.x-drag.x)+Math.abs(p.y-drag.y)>4)drag.moved=true;rotY=drag.rotY+(p.x-drag.x)*.009;rotX=Math.max(-1.2,Math.min(1.2,drag.rotX+(p.y-drag.y)*.007));draw()});
  canvas.addEventListener('pointerup',event=>{const p=point(event);if(drag&&!drag.moved){let best={distance:Infinity,index:0};screenRungs.forEach((r,i)=>{const distance=doubleView()?distanceToSegment(p,r.a,r.b):Math.hypot(p.x-r.a.x,p.y-r.a.y);if(distance<best.distance)best={distance,index:i}});if(best.distance<18)setSelected(best.index)}drag=null});
  window.addEventListener('resize',resize);new ResizeObserver(resize).observe(canvas);setMix(0);resize();
})();
