(function(){
  'use strict';
  const api=window.A0ThreeMatrixHolonomy,canvas=document.getElementById('holonomyCanvas'),ctx=canvas.getContext('2d');
  let state=api.clonePreset('lamella'),view={yaw:-28,pitch:19,zoom:1},drag=null,result=null,breathing=false,breathScale=1,breathRaf=0;
  const colors=['#58dbe4','#66e2b5','#ffcb4f'];
  const format=value=>Math.abs(value)<1e-10?'0.000e+0':value.toExponential(3);
  const matrixMarkup=matrix=>matrix.flat().map(value=>`<span>${Math.abs(value)<5e-10?'0.000':value.toFixed(3)}</span>`).join('');
  function buildStages(){
    const root=document.getElementById('stageControls');
    root.innerHTML=state.stages.map((stage,index)=>`<article class="stage" data-stage="${index}"><header><h3>A${index+1} · ${stage.angle}°</h3><output>det <span data-stage-det>—</span></output></header><label>FLIP θ · <output data-value="angle">${stage.angle.toFixed(1)}°</output></label><input data-key="angle" type="range" min="0" max="360" step="1" value="${stage.angle}"><label>LAMELLA AZIMUTH · <output data-value="azimuth">${stage.azimuth.toFixed(1)}°</output></label><input data-key="azimuth" type="range" min="0" max="360" step="1" value="${stage.azimuth}"><label>LAMELLA TILT · <output data-value="tilt">${stage.tilt.toFixed(1)}°</output></label><input data-key="tilt" type="range" min="0" max="90" step=".1" value="${stage.tilt}"><div class="matrix" data-matrix></div><div class="matrix-meta"><span>L${index+1} R L${index+1}ᵀ</span><span>${index===2&&state.kleinFlip?'KLEIN F · det −1':'SO(3) · det +1'}</span></div></article>`).join('');
    root.querySelectorAll('input').forEach(input=>input.addEventListener('input',event=>{const card=event.target.closest('[data-stage]'),index=Number(card.dataset.stage),key=event.target.dataset.key;state.stages[index][key]=Number(event.target.value);card.querySelector(`[data-value="${key}"]`).textContent=`${Number(event.target.value).toFixed(1)}°`;card.querySelector('h3').textContent=`A${index+1} · ${state.stages[index].angle}°`;refresh();}));
  }
  function project(vector){
    let v=api.apply(api.rotationY(view.yaw),vector);v=api.apply(api.rotationX(view.pitch),v);
    const scale=Math.min(canvas.width,canvas.height)*.24*view.zoom*breathScale;
    return[canvas.width*.5+v[0]*scale,canvas.height*.53-v[1]*scale,v[2]];
  }
  function line(a,b,color,width=2,alpha=1){const p=project(a),q=project(b);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.restore();}
  function arrow(origin,vector,color,width=2,alpha=1){line(origin,vector,color,width,alpha);const p=project(origin),q=project(vector),angle=Math.atan2(q[1]-p[1],q[0]-p[0]);ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]-10*Math.cos(angle-.45),q[1]-10*Math.sin(angle-.45));ctx.lineTo(q[0]-10*Math.cos(angle+.45),q[1]-10*Math.sin(angle+.45));ctx.fill();ctx.restore();}
  function plane(stage,color,index){
    const basis=api.frame(stage.azimuth,stage.tilt),points=[];
    for(let i=0;i<=64;i+=1){const t=Math.PI*2*i/64,local=[Math.cos(t)*(.72+index*.1),Math.sin(t)*(.72+index*.1),0];points.push(project(api.apply(basis,local)));}
    ctx.save();ctx.strokeStyle=color;ctx.globalAlpha=.38;ctx.lineWidth=1.5;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
    const normal=api.apply(basis,[0,0,1.15]);arrow([0,0,0],normal,color,1.5,.65);
  }
  function triad(matrix,alpha=1){const basis=[[1,0,0],[0,1,0],[0,0,1]],palette=['#ff5a8b','#f1f5f6','#9b7cff'];basis.forEach((axis,index)=>arrow([0,0,0],api.apply(matrix,axis),palette[index],index===0?3:2,alpha));}
  function draw(){
    const ratio=window.devicePixelRatio||1,rect=canvas.getBoundingClientRect(),width=Math.max(1,Math.round(rect.width*ratio)),height=Math.max(1,Math.round(rect.height*ratio));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(ratio,ratio);ctx.restore();
    line([-1.5,0,0],[1.5,0,0],'#244d58',1);line([0,-1.5,0],[0,1.5,0],'#244d58',1);line([0,0,-1.5],[0,0,1.5],'#244d58',1);
    state.stages.forEach((stage,index)=>plane(stage,colors[index],index));
    triad(api.I(),.24);triad(result.forward,1);triad(result.reverse,.28);
    ctx.fillStyle='#92abb2';ctx.font=`${12*(window.devicePixelRatio||1)}px ui-monospace`;ctx.fillText('DRAG · ROTATE / WHEEL · ZOOM',18*(window.devicePixelRatio||1),28*(window.devicePixelRatio||1));
  }
  function refresh(){
    result=api.analyze(state);
    document.querySelectorAll('.stage').forEach((card,index)=>{card.querySelector('[data-matrix]').innerHTML=matrixMarkup(result.matrices[index]);card.querySelector('[data-stage-det]').textContent=result.metrics.stageDeterminants[index].toFixed(3);});
    const orientation=result.metrics.determinant<0?'ORIENTATION −':'ORIENTATION +';
    document.getElementById('classification').textContent=result.classification.replaceAll('_',' ');
    document.getElementById('orientation').textContent=orientation;
    document.getElementById('determinant').textContent=result.metrics.determinant.toFixed(6);
    document.getElementById('determinant').className=result.metrics.determinant<0?'flip':'';
    document.getElementById('orthogonality').textContent=format(result.metrics.orthogonalityResidual);
    document.getElementById('commutator').textContent=format(result.metrics.maxCommutator);
    document.getElementById('commutator').className=result.metrics.maxCommutator>api.EPS?'hot':'';
    document.getElementById('orderResidual').textContent=format(result.metrics.orderResidual);
    document.getElementById('returnResidual').textContent=format(result.metrics.returnResidual);
    document.getElementById('holonomyAngle').textContent=result.metrics.holonomyAngle===null?'N/A · det −1':`${result.metrics.holonomyAngle.toFixed(3)}°`;
    document.getElementById('decision').textContent=result.classification==='CYCLIC_C4_CONTROL'?'Gleiche Achse: Die drei Winkel addieren sich zu 540° ≡ 180°. Alle Kommutatoren verschwinden.':result.classification==='NONCOMMUTING_LAMELLA_HOLONOMY'?'Verschiedene Lamellen-Normalen: Die Operatoren kommutieren nicht. Die Reihenfolge ist Teil des Ergebnisses.':'Der dritte lokale Schritt enthält eine Spiegelung. Die Gesamttransformation ist orthogonal, aber orientierungsumkehrend.';
    document.getElementById('commutatorList').textContent=result.metrics.commutators.map(item=>`${item.pair} ${format(item.residual)}`).join(' · ');
    document.getElementById('orderDecision').textContent=result.metrics.orderResidual>api.EPS?'FORWARD ≠ REVERSE':'FORWARD = REVERSE';
    document.getElementById('penroseGate').textContent=result.penroseGate==='PROJECTIVE_ANALOGY_ONLY_NO_APERIODIC_TILING'?'Gate offen für die projective Analogie; mathematische Penrose-Klassifikation bleibt HOLD.':'Planarer Control: kein Penrose-Gate.';
    draw();
  }
  function breathFrame(time){
    if(!breathing)return;
    breathScale=1+.105*Math.sin(time*.002);
    canvas.dataset.breathScale=breathScale.toFixed(4);
    draw();
    breathRaf=window.requestAnimationFrame(breathFrame);
  }
  function setBreathing(next){
    const allowed=Boolean(next)&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(allowed===breathing)return;
    breathing=allowed;
    document.documentElement.dataset.matrixMotion=breathing?'breathe':'hold';
    window.cancelAnimationFrame(breathRaf);
    breathScale=1;
    canvas.dataset.breathScale=breathScale.toFixed(4);
    if(breathing)breathRaf=window.requestAnimationFrame(breathFrame);else draw();
  }
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-preset]').forEach(item=>item.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');state=api.clonePreset(button.dataset.preset);buildStages();refresh();}));
  document.getElementById('resetView').addEventListener('click',()=>{view={yaw:-28,pitch:19,zoom:1};state=api.clonePreset('lamella');document.querySelectorAll('[data-preset]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.preset==='lamella')));buildStages();refresh();});
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,yaw:view.yaw,pitch:view.pitch};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;view.yaw=drag.yaw+(event.clientX-drag.x)*.35;view.pitch=Math.max(-85,Math.min(85,drag.pitch+(event.clientY-drag.y)*.35));draw();});
  canvas.addEventListener('pointerup',()=>{drag=null;});canvas.addEventListener('pointercancel',()=>{drag=null;});
  canvas.addEventListener('wheel',event=>{event.preventDefault();view.zoom=Math.max(.55,Math.min(2.2,view.zoom*Math.exp(-event.deltaY*.001)));draw();},{passive:false});
  window.addEventListener('message',event=>{if(event.source!==window.parent||event.data?.type!=='A0_PI_MATRIX_MOTION')return;setBreathing(event.data.active&&event.data.motion==='BREATH');});
  window.addEventListener('resize',draw);buildStages();refresh();
  window.A0ThreeMatrixWorkbench=Object.freeze({snapshot:()=>result,setPreset:name=>{state=api.clonePreset(name);buildStages();refresh();return result;},setBreathing,get breathing(){return breathing;},get breathScale(){return breathScale;}});
})();
