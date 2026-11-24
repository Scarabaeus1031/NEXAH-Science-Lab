(function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=v=>(Math.round(v*1000)/1000).toFixed(3);

  function svgEl(name,attrs={}){const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
  function orderedArms(){
    const cells=[];
    for(let d=1;d<=5;d++)[[5-d,5],[5+d,5],[5,5-d],[5,5+d]].forEach(([x,y])=>cells.push({x,y}));
    return cells;
  }
  function orderedDiagonalArms(){
    const cells=[];
    for(let d=1;d<=5;d++)[[5-d,5-d],[5+d,5-d],[5-d,5+d],[5+d,5+d]].forEach(([x,y])=>cells.push({x,y}));
    return cells;
  }
  function addSvgText(svg,text,x,y,attrs={}){const node=svgEl('text',{x,y,'text-anchor':'middle','font-family':'ui-monospace, monospace','font-weight':800,...attrs});node.textContent=text;svg.appendChild(node);return node;}
  function drawSideMask(host,record,role){
    host.textContent='';
    const svg=svgEl('svg',{viewBox:'0 0 420 450',role:'img','aria-label':'Declared i k side view with carrier and shadow layers'});
    const shadow='80,105 315,105 365,165 130,165',carrier='55,245 290,245 340,305 105,305';
    svg.appendChild(svgEl('polygon',{points:shadow,fill:'#0b1d35',stroke:'#2e6fb8','stroke-width':2,'stroke-dasharray':'7 5'}));
    svg.appendChild(svgEl('polygon',{points:carrier,fill:'#203a66',stroke:'#58dcff','stroke-width':2}));
    [[80,105,55,245],[315,105,290,245],[365,165,340,305],[130,165,105,305]].forEach(([x1,y1,x2,y2])=>svg.appendChild(svgEl('line',{x1,y1,x2,y2,stroke:'#526983','stroke-dasharray':'4 5'})));
    svg.appendChild(svgEl('line',{x1:198,y1:65,x2:198,y2:355,stroke:'#f4bf32','stroke-width':2}));
    svg.appendChild(svgEl('path',{d:'M192 76 L198 64 L204 76',fill:'none',stroke:'#f4bf32','stroke-width':2}));
    svg.appendChild(svgEl('path',{d:'M192 344 L198 356 L204 344',fill:'none',stroke:'#f4bf32','stroke-width':2}));
    svg.appendChild(svgEl('line',{x1:85,y1:275,x2:310,y2:275,stroke:'#42d5b1','stroke-width':2}));
    svg.appendChild(svgEl('circle',{cx:198,cy:275,r:12,fill:'#f0a51b',stroke:'#fff','stroke-width':2}));
    addSvgText(svg,'1',198,280,{fill:'#fff','font-size':12});
    addSvgText(svg,'−k · BLUE SHADOW',198,48,{fill:'#6db7ff','font-size':13});
    addSvgText(svg,'+k · CARRIER',198,382,{fill:'#58dcff','font-size':13});
    addSvgText(svg,'−i',72,270,{fill:'#7ff0d2','font-size':13});addSvgText(svg,'+i',326,270,{fill:'#7ff0d2','font-size':13});
    addSvgText(svg,`SQUARE COMPLETION · ${record.grid.completion}/20`,198,386,{fill:'#a8ffe8','font-size':9});
    for(let i=0;i<20;i++)svg.appendChild(svgEl('rect',{class:`pc-dot-completion-tick${i<record.grid.completion?' is-filled':''}`,x:61+i*14,y:394,width:10,height:10,rx:2}));
    addSvgText(svg,'j · EDGE-ON',198,416,{fill:'#8fa0b8','font-size':11});
    addSvgText(svg,'DECLARED DEPTH LIFT · NOT DERIVED FROM 2D MASK',210,438,{fill:'#8fa0b8','font-size':9});
    host.appendChild(svg);
  }
  function drawMask(host,record,role,axisView,maskMode){
    if(axisView==='SIDE_IK'){drawSideMask(host,record,role);return;}
    host.textContent='';
    const svg=svgEl('svg',{viewBox:'0 0 420 450',role:'img','aria-label':`${record.grid.visible} of 121 grid cells selected`});
    const plusArms=orderedArms(),timesArms=orderedDiagonalArms(),plusFilled=new Set(plusArms.slice(0,record.grid.completion).map(p=>`${p.x},${p.y}`)),timesFilled=new Set(timesArms.slice(0,record.grid.completion).map(p=>`${p.x},${p.y}`));
    const primeColours={TOP:'#356fb4',LEFT:'#2d62a1',BOTTOM:'#244f84',RIGHT:'#3d7fc8'};
    const sectorFor=(x,y)=>{const dx=x-5,dy=y-5;if(Math.abs(dy)>Math.abs(dx))return dy<0?'TOP':'BOTTOM';return dx<0?'LEFT':'RIGHT'};
    for(let y=0;y<11;y++)for(let x=0;x<11;x++){
      const center=x===5&&y===5,cross=(x===5||y===5)&&!center,diagonal=(Math.abs(x-5)===Math.abs(y-5))&&!center,key=`${x},${y}`;
      let selected=false,fill='#0b1727';
      if(maskMode==='TIMES_ZERO'){selected=!diagonal||center;fill=center?'#f0a51b':selected?'#24487d':timesFilled.has(key)?'#42d5b1':'#0b1727'}
      else if(maskMode==='PLUS_TIMES_OVERLAP'){selected=(!cross&&!diagonal)||center;fill=center?'#f0a51b':selected?'#31517d':'#080f1a'}
      else if(maskMode==='PRIME_QUADRANTS'){selected=!diagonal||center;fill=center?'#f0a51b':selected?primeColours[sectorFor(x,y)]:'#080f1a'}
      else{selected=!cross||center;fill=center?'#f0a51b':selected?'#24487d':plusFilled.has(key)?'#42d5b1':'#0b1727'}
      svg.appendChild(svgEl('rect',{x:20+x*35,y:20+y*35,width:30,height:30,rx:3,fill,stroke:selected?'#566c88':'#293c56','stroke-width':1}));
    }
    const diagonalStroke=maskMode==='TIMES_ZERO'||maskMode==='PLUS_TIMES_OVERLAP'||maskMode==='PRIME_QUADRANTS'?'#4d91dc':'#f4bf32';
    svg.appendChild(svgEl('line',{x1:20,y1:20,x2:400,y2:400,stroke:diagonalStroke,'stroke-dasharray':'6 5',opacity:.85}));
    svg.appendChild(svgEl('line',{x1:400,y1:20,x2:20,y2:400,stroke:diagonalStroke,'stroke-dasharray':'6 5',opacity:.85}));
    const dot=svgEl('text',{x:210,y:218,'text-anchor':'middle',fill:'#fff','font-size':28,'font-weight':900});dot.textContent=role==='DECIMAL_POINT'?'.':'×';svg.appendChild(dot);
    const modeCounts={PLUS_ZERO:`101 + ${record.grid.completion} = ${101+record.grid.completion} / 121`,TIMES_ZERO:`101 + ${record.grid.completion} = ${101+record.grid.completion} / 121`,PLUS_TIMES_OVERLAP:'81 = 9² COUNT · NOT A 9×9 SUBGRID',PRIME_QUADRANTS:'25×(2,3,5,7) · CENTER 1'};
    const label=svgEl('text',{x:210,y:435,'text-anchor':'middle',fill:'#aab8cd','font-size':12,'font-family':'ui-monospace, monospace'});label.textContent=modeCounts[maskMode]||modeCounts.PLUS_ZERO;svg.appendChild(label);
    addSvgText(svg,'+j',210,16,{fill:'#7ff0d2','font-size':13});addSvgText(svg,'−j',210,420,{fill:'#7ff0d2','font-size':13});
    addSvgText(svg,'−i',10,214,{fill:'#7ff0d2','font-size':13});addSvgText(svg,'+i',410,214,{fill:'#7ff0d2','font-size':13});
    addSvgText(svg,'−i+j',59,48,{fill:'#e7d477','font-size':10});addSvgText(svg,'i+j',361,48,{fill:'#e7d477','font-size':10});
    addSvgText(svg,'−i−j',59,397,{fill:'#e7d477','font-size':10});addSvgText(svg,'i−j',361,397,{fill:'#e7d477','font-size':10});
    addSvgText(svg,'1',210,191,{fill:'#fff','font-size':11});addSvgText(svg,'k=0 · TOP SLICE',210,445,{fill:'#8fa0b8','font-size':9});
    if(maskMode==='PRIME_QUADRANTS'){
      addSvgText(svg,'QⅠ · 2',210,92,{fill:'#fff','font-size':15});addSvgText(svg,'QⅡ · 3',92,214,{fill:'#fff','font-size':15});
      addSvgText(svg,'QⅢ · 5',210,337,{fill:'#fff','font-size':15});addSvgText(svg,'QⅣ · 7',328,214,{fill:'#fff','font-size':15});
    }
    host.appendChild(svg);
  }
  function recurrence(alpha,beta,steps){
    const out=[1,.98];
    for(let i=2;i<steps;i++){
      let next=alpha*out[i-1]+beta*(out[i-1]-out[i-2]);
      if(!Number.isFinite(next))next=0;
      out.push(clamp(next,-1e6,1e6));
    }
    const peak=Math.max(1,...out.map(Math.abs));
    return out.map(v=>v/peak);
  }
  function drawPolar(canvas,angle,alpha,beta,steps){
    const dpr=Math.min(window.devicePixelRatio||1,2),rect=canvas.getBoundingClientRect(),w=Math.max(320,rect.width),h=440;
    canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
    const cx=w*.36,cy=h*.52,R=Math.min(w*.3,h*.37);c.strokeStyle='#233751';c.lineWidth=1;
    for(const q of [.33,.66,1]){c.beginPath();c.arc(cx,cy,R*q,0,Math.PI*2);c.stroke();}
    const vals=recurrence(alpha,beta,steps),turn=angle*Math.PI/180;c.strokeStyle='#3b83ff';c.lineWidth=1.6;c.beginPath();
    vals.forEach((r,i)=>{const a=-Math.PI/2+i*turn,x=cx+Math.abs(r)*R*Math.cos(a),y=cy+Math.abs(r)*R*Math.sin(a);i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();
    c.fillStyle='#dce8fa';c.font='700 12px ui-monospace, monospace';c.fillText(`${angle}° · mod 11 = ${angle%11}`,18,24);c.fillStyle='#7f93ae';c.fillText(`rₙ₊₁=αrₙ+β(rₙ−rₙ₋₁)`,18,h-18);
    const ix=w*.79,iy=h*.25,ir=Math.min(70,w*.14);c.strokeStyle='#3a4e69';c.beginPath();c.arc(ix,iy,ir,0,Math.PI*2);c.stroke();
    for(let k=0;k<11;k++){const a=-Math.PI/2+k*2*Math.PI/11,x=ix+ir*Math.cos(a),y=iy+ir*Math.sin(a);c.fillStyle=k===angle%11?'#f4bf32':k===5||k===6?'#3b83ff':'#71829a';c.beginPath();c.arc(x,y,k===angle%11?6:k===5||k===6?4:3,0,Math.PI*2);c.fill();c.fillStyle='#9fafc4';c.fillText(String(k),x-4,y-8);}
    const pt=k=>({x:ix+ir*Math.cos(-Math.PI/2+k*2*Math.PI/11),y:iy+ir*Math.sin(-Math.PI/2+k*2*Math.PI/11)}),p5=pt(5),p6=pt(6);c.strokeStyle='#f4bf32';c.setLineDash([5,4]);c.beginPath();c.moveTo(p5.x,p5.y);c.lineTo(p6.x,p6.y);c.stroke();c.setLineDash([]);c.fillStyle='#d9c879';c.fillText('5+6≡0',ix-27,iy+ir+30);
  }
  function initialViewSlots(control){return Object.fromEntries(Object.entries(control.initialViewPlacement).map(([slot,glyph])=>[glyph,slot]));}
  function shiftViewSlots(viewSlots,transform){return Object.fromEntries(Object.entries(viewSlots).map(([glyph,slot])=>[glyph,transform[slot]]));}
  function renderViewPlates(root,plates){
    Object.values(plates).forEach(plate=>{const host=root.querySelector(`[data-pc-view-plate="${plate.id}"]`);if(!host)return;host.innerHTML=plate.matrix.flat().map(value=>`<b${value===13?' class="is-focus"':''}>${value}</b>`).join('');});
  }
  function renderPbdq(root,control,viewSlots,lastOperation){
    root.querySelectorAll('[data-pc-pbdq-view]').forEach(token=>token.dataset.slot=viewSlots[token.dataset.pcPbdqView]);
    root.querySelector('[data-pc-pbdq-status]').textContent=lastOperation;
    root.querySelectorAll('[data-pc-pbdq-op]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcPbdqOp===lastOperation)));
    const bySlot=Object.fromEntries(Object.entries(viewSlots).map(([glyph,slot])=>[slot,glyph])),registers=control.parkingRegisters;
    root.querySelector('[data-pc-pbdq-readout]').innerHTML=`<dt>Carrier</dt><dd>${control.carrier.id} · ${control.carrier.state} · ${control.carrier.bodyColor}</dd><dt>View operation</dt><dd>${lastOperation}</dd><dt>Registers</dt><dd>${registers.map(r=>`${r.slot}←${bySlot[r.slot]}`).join(' · ')}</dd><dt>ZERO</dt><dd>${control.zero.role}</dd><dt>NULL</dt><dd>${control.null.role}</dd><dt>Laws</dt><dd>${control.laws.join(' · ')}</dd><dt>Comparator</dt><dd>${control.comparator}</dd>`;
  }
  function boot(){
    const root=document.querySelector('[data-pc-aljabr-dot]'),M=window.A0PrimecubeModel;if(!root||!M)return;
    const state={role:'CENTER_DOT',completion:0,angle:102,alpha:.985,beta:.25,steps:60,axisView:'TOP_IJ',maskMode:'PLUS_ZERO',coupledStep:0,playing:false};
    const initial=M.alJabrDotLensRecord(0),mask=root.querySelector('[data-pc-dot-mask]'),canvas=root.querySelector('[data-pc-dot-polar]'),detail=root.querySelector('[data-pc-dot-detail]'),pbdq=initial.quadrantShiftControl,coupled=initial.coupledCompletion.sequence;
    let viewSlots=initialViewSlots(pbdq),lastPbdqOperation='IDENTITY',timer=null;
    renderViewPlates(root,initial.viewPlates);
    const applyCoupledStep=step=>{const frame=coupled[clamp(step,0,20)];state.coupledStep=frame.step;state.completion=frame.completion;state.role=frame.role;state.angle=frame.angle;state.maskMode='PLUS_ZERO';};
    const setPlaying=value=>{state.playing=value;if(timer){clearInterval(timer);timer=null}if(value){if(state.coupledStep>=20)applyCoupledStep(0);timer=setInterval(()=>{if(state.coupledStep>=20){setPlaying(false);render();return}applyCoupledStep(state.coupledStep+1);render()},480)}};
    function render(){
      const rec=M.alJabrDotLensRecord(state.completion),op=rec.operators.find(x=>x.id===state.role),angle=rec.polar.angles.find(x=>x.degrees===state.angle),axis=rec.quaternionAxisOverlay,dual=rec.dualMaskControl;
      drawMask(mask,rec,state.role,state.axisView,state.maskMode);drawPolar(canvas,state.angle,state.alpha,state.beta,state.steps);
      root.querySelector('[data-pc-dot-completion]').value=String(state.completion);
      root.querySelector('[data-pc-dot-completion-out]').textContent=String(state.completion);
      root.querySelector('[data-pc-dot-alpha-out]').textContent=fmt(state.alpha);root.querySelector('[data-pc-dot-beta-out]').textContent=fmt(state.beta);
      const coupledFrame=coupled[state.coupledStep],play=root.querySelector('[data-pc-dot-coupled-play]');play.setAttribute('aria-pressed',String(state.playing));play.textContent=state.playing?'PAUSE':'PLAY · 101→121';root.querySelector('[data-pc-dot-coupled-status]').textContent=`${coupledFrame.step}/20 · C · ${coupledFrame.viewRegister} · ${coupledFrame.angle}° · ${101+state.completion}/121`;
      const maskReading=state.maskMode==='PLUS_TIMES_OVERLAP'?dual.comparison.intersectionEquation:state.maskMode==='PRIME_QUADRANTS'?dual.primeQuadrants.laws.join(' · '):state.maskMode==='TIMES_ZERO'?dual.timesZero.equation:dual.plusZero.equation;
      detail.innerHTML=`<div class="pc-eyebrow">Typed operator · ${op.id}</div><h3>${op.glyph} · ${op.meaning}</h3><dl class="pc-dot-readout"><dt>Equation</dt><dd>${op.equation}</dd><dt>Coupled view</dt><dd>${coupledFrame.step}/20 · ${coupledFrame.phase}<br>${rec.coupledCompletion.route}</dd><dt>Mask mode</dt><dd>${state.maskMode}</dd><dt>Mask return</dt><dd>${maskReading}</dd><dt>Grid</dt><dd>${rec.grid.equation} · ${rec.grid.closed?'CLOSED':'OPEN'}</dd><dt>Axis view</dt><dd>${state.axisView==='TOP_IJ'?'k=0 · visible i/j · 1 scalar':'visible i/k · j edge-on · ±k depth'}</dd><dt>Rays</dt><dd>${axis.topSlice.quadrantRays.join(' · ')}</dd><dt>Product test</dt><dd>${axis.multiplicationReference.orientationTest}</dd><dt>Angle</dt><dd>${angle.degrees}° → residue ${angle.residue} mod 11</dd><dt>Exact</dt><dd>${rec.polar.exactRelations.join(' · ')}</dd><dt>5 / 6</dt><dd>additive inverses mod 11; not antipodal</dd><dt>α / β</dt><dd>${fmt(state.alpha)} / ${fmt(state.beta)} · independent</dd></dl><div class="pc-dot-callout"><code>+ ZERO</code> und <code>× ZERO</code> sind zwei 101-Selektionen. Die gekoppelte Sequenz choreografiert Zellergänzung, Punktrolle und Winkel; sie leitet <code>α</code> oder <code>β</code> nicht aus der Maske ab. Die Quaternionenreferenz <code>ij=k; ji=−k</code> wird nicht aus der Maske abgeleitet. Ihr Schnitt zählt <code>81=9²</code> Zellen, bildet aber kein 9×9-Untergitter. Die Primsektoren liefern <code>17</code>, <code>210</code>, <code>840</code> und den konstruierten Permutationsvergleich <code>24·210=5040</code>. <a class="pc-dot-link" href="#mandelbrot-memory-field">Zum α/β-Fraktalfeld ↑</a></div>`;
      root.querySelectorAll('[data-pc-dot-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pcDotRole===state.role)));root.querySelectorAll('[data-pc-dot-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pcDotAngle)===state.angle)));root.querySelectorAll('[data-pc-dot-axis-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pcDotAxisView===state.axisView)));root.querySelectorAll('[data-pc-dot-mask-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pcDotMaskMode===state.maskMode)));
    }
    root.addEventListener('click',e=>{const r=e.target.closest('[data-pc-dot-role]'),a=e.target.closest('[data-pc-dot-angle]'),v=e.target.closest('[data-pc-dot-axis-view]'),m=e.target.closest('[data-pc-dot-mask-mode]'),shift=e.target.closest('[data-pc-pbdq-op]'),play=e.target.closest('[data-pc-dot-coupled-play]'),next=e.target.closest('[data-pc-dot-coupled-step]'),reset=e.target.closest('[data-pc-dot-coupled-reset]');if(r)state.role=r.dataset.pcDotRole;if(a)state.angle=Number(a.dataset.pcDotAngle);if(v)state.axisView=v.dataset.pcDotAxisView;if(m)state.maskMode=m.dataset.pcDotMaskMode;if(play){setPlaying(!state.playing);render()}if(next){setPlaying(false);applyCoupledStep((state.coupledStep+1)%21);render()}if(reset){setPlaying(false);applyCoupledStep(0);render()}if(shift){lastPbdqOperation=shift.dataset.pcPbdqOp;viewSlots=lastPbdqOperation==='IDENTITY'?initialViewSlots(pbdq):shiftViewSlots(viewSlots,pbdq.transforms[lastPbdqOperation]);renderPbdq(root,pbdq,viewSlots,lastPbdqOperation);}if(r||a||v||m)render();});
    root.querySelector('[data-pc-dot-completion]').addEventListener('input',e=>{setPlaying(false);state.completion=Number(e.target.value);state.coupledStep=state.completion;render();});
    root.querySelector('[data-pc-dot-alpha]').addEventListener('input',e=>{state.alpha=Number(e.target.value);render();});
    root.querySelector('[data-pc-dot-beta]').addEventListener('input',e=>{state.beta=Number(e.target.value);render();});
    window.addEventListener('resize',render,{passive:true});render();renderPbdq(root,pbdq,viewSlots,lastPbdqOperation);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
