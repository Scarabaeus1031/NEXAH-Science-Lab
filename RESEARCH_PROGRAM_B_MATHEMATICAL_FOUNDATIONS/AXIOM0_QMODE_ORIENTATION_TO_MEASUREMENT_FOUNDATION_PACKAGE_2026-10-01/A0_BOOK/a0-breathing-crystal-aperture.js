(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0BreathingCrystalApertureModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const STAGES=['SOURCE','ALIGN','PUNCH','BREATHE','FOURIER','RETURN'];
  const MATERIALS={bronze:{label:'BRONZE',faces:['#4c2f1e','#8b5a2b','#b57a3b','#d19a55'],edge:'#e3b866'},obsidian:{label:'OBSIDIAN',faces:['#020304','#0a0b0d','#17191c','#292c30'],edge:'#a4854d'},graphite:{label:'GRAPHITE',faces:['#15171a','#2a2d31','#464b50','#6c7277'],edge:'#d0b06a'},gold:{label:'GOLD',faces:['#3d2b08','#75510b','#b9891d','#e7c45b'],edge:'#ffe6a1'}};
  function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}
  function ease(v){v=clamp(v);return v*v*(3-2*v);}
  function stageState(stage,time=0){
    const i=typeof stage==='number'?stage:STAGES.indexOf(stage),s=STAGES[clamp(i,0,STAGES.length-1)]||STAGES[0],wave=Math.sin(time*Math.PI*2);
    const state={stage:s,index:STAGES.indexOf(s),aperture:0,crystalY:.72,scale:.78,breath:0,reveal:0,returnError:0};
    if(s==='ALIGN')Object.assign(state,{aperture:.35,crystalY:.42,scale:.86});
    if(s==='PUNCH')Object.assign(state,{aperture:1,crystalY:.05,scale:.92});
    if(s==='BREATHE')Object.assign(state,{aperture:1,crystalY:0,scale:1+.035*wave,breath:.5+.5*wave});
    if(s==='FOURIER')Object.assign(state,{aperture:1,crystalY:0,scale:1+.025*wave,breath:.5+.5*wave,reveal:.72+.18*wave});
    return state;
  }
  function returnCheck(state){const expected=stageState('RETURN',0),keys=['aperture','crystalY','scale','breath','reveal'],error=Math.max(...keys.map(k=>Math.abs(state[k]-expected[k])));return{pass:error<=1e-12,error,expected,keys};}
  return{STAGES,MATERIALS,clamp,ease,stageState,returnCheck};
});

(()=>{
  if(typeof window==='undefined')return;
  const model=window.A0BreathingCrystalApertureModel,canvas=document.getElementById('crystalCanvas');if(!model||!canvas)return;
  const ctx=canvas.getContext('2d'),img=document.getElementById('fourierTexture'),status=document.getElementById('crystalStatus');
  const stageButtons=[...document.querySelectorAll('[data-crystal-stage]')],materialButtons=[...document.querySelectorAll('[data-crystal-material]')];
  let stage=0,material='bronze',running=false,stageStart=0,raf=0;
  function fit(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);draw(performance.now());}
  function polygon(points,fill,stroke,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  function drawCrystal(cx,cy,size,state,palette){
    const sy=size*state.scale,rx=sy*.43,mid=cy,top=cy-sy*.72,bottom=cy+sy*.72,left=cx-rx,right=cx+rx;
    ctx.save();ctx.shadowColor=palette.edge;ctx.shadowBlur=10+state.breath*15;
    polygon([[cx,top],[right,mid],[cx,mid+sy*.12]],palette.faces[2],palette.edge,1.25);
    polygon([[cx,top],[cx,mid+sy*.12],[left,mid]],palette.faces[3],palette.edge,1.25);
    polygon([[left,mid],[cx,mid+sy*.12],[cx,bottom]],palette.faces[1],palette.edge,1.25);
    polygon([[cx,mid+sy*.12],[right,mid],[cx,bottom]],palette.faces[0],palette.edge,1.25);
    ctx.shadowBlur=0;
    if(state.reveal>0&&img.complete&&img.naturalWidth){ctx.save();ctx.beginPath();ctx.moveTo(cx,top);ctx.lineTo(right,mid);ctx.lineTo(cx,bottom);ctx.lineTo(left,mid);ctx.closePath();ctx.clip();ctx.globalAlpha=.18+.28*state.reveal;ctx.globalCompositeOperation='screen';ctx.filter='grayscale(1) sepia(1) saturate(1.6) hue-rotate(342deg)';ctx.drawImage(img,cx-sy*.58,cy-sy*.58,sy*1.16,sy*1.16);ctx.restore();}
    ctx.restore();
  }
  function draw(now){
    const w=canvas.clientWidth,h=canvas.clientHeight,t=running?(now-stageStart)/2600:0,state=model.stageState(stage,t),p=model.MATERIALS[material];ctx.clearRect(0,0,w,h);
    const bg=ctx.createRadialGradient(w*.5,h*.46,10,w*.5,h*.46,Math.max(w,h)*.68);bg.addColorStop(0,'#162127');bg.addColorStop(.48,'#090d10');bg.addColorStop(1,'#020304');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(190,201,205,.18)';ctx.setLineDash([5,8]);ctx.beginPath();ctx.moveTo(w*.5,h*.06);ctx.lineTo(w*.5,h*.94);ctx.moveTo(w*.12,h*.37);ctx.lineTo(w*.88,h*.37);ctx.stroke();ctx.setLineDash([]);
    const ax=w*.5,ay=h*.37,rx=Math.min(w*.34,270),ry=Math.max(34,rx*.22),wall=h*.23;
    ctx.fillStyle='rgba(18,43,49,.72)';ctx.beginPath();ctx.ellipse(ax,ay+wall,rx,ry,0,0,Math.PI);ctx.lineTo(ax-rx,ay);ctx.ellipse(ax,ay,rx,ry,0,Math.PI,Math.PI*2,true);ctx.closePath();ctx.fill();ctx.strokeStyle='#5bdce4';ctx.lineWidth=2;ctx.stroke();
    ctx.strokeStyle=p.edge;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(ax,ay,rx,ry,0,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([8,8]);ctx.strokeStyle='rgba(215,224,226,.7)';ctx.beginPath();ctx.moveTo(ax-rx,ay);ctx.lineTo(ax,ay-ry*2.2);ctx.lineTo(ax+rx,ay);ctx.lineTo(ax,ay+ry*2.2);ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#0a1115';ctx.strokeStyle='#eef3f2';ctx.setLineDash([4,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(ax-31,ay-22,62,44,10);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#f5f1e8';ctx.font='700 18px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('X|',ax,ay+6);
    if(state.reveal>0&&img.complete&&img.naturalWidth){ctx.save();ctx.globalAlpha=.08+.16*state.reveal;ctx.globalCompositeOperation='screen';ctx.drawImage(img,ax-rx*.72,ay-rx*.72,rx*1.44,rx*1.44);ctx.restore();}
    drawCrystal(ax,ay+state.crystalY*h*.47,Math.min(w,h)*.24,state,p);
    ctx.fillStyle='rgba(243,235,213,.72)';ctx.font='600 11px ui-monospace,monospace';ctx.textAlign='left';ctx.fillText(`${state.stage} · ${p.label} · VIEW LAYER`,18,h-20);
    status.textContent=state.stage==='RETURN'?'RETURN · 0.000 · VISUAL STATE RESTORED':`${String(stage+1).padStart(2,'0')} / 06 · ${state.stage} · ${p.label}`;
    if(running)raf=requestAnimationFrame(draw);
  }
  function selectStage(i,play=false){stage=model.clamp(i,0,model.STAGES.length-1);running=play&&(model.STAGES[stage]==='BREATHE'||model.STAGES[stage]==='FOURIER');stageStart=performance.now();stageButtons.forEach((b,n)=>b.toggleAttribute('aria-current',n===stage));cancelAnimationFrame(raf);draw(stageStart);if(running)raf=requestAnimationFrame(draw);}
  stageButtons.forEach((b,i)=>b.addEventListener('click',()=>selectStage(i,true)));
  materialButtons.forEach(b=>b.addEventListener('click',()=>{material=b.dataset.crystalMaterial;materialButtons.forEach(x=>x.toggleAttribute('aria-pressed',x===b));draw(performance.now());}));
  document.getElementById('crystalRun').addEventListener('click',async()=>{for(let i=0;i<model.STAGES.length;i++){selectStage(i,i===3||i===4);await new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?180:850));}selectStage(5,false);});
  document.getElementById('crystalReturn').addEventListener('click',()=>selectStage(5,false));
  document.getElementById('crystalExport').addEventListener('click',()=>{const state=model.stageState(stage,0),payload={schema:'nexah.a0.breathing-crystal-aperture-return/1.0.0',created_at:new Date().toISOString(),identity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',stage:model.STAGES[stage],material,visual_return:model.returnCheck(model.stageState('RETURN',0)),fourier_texture:'assets/references/Fourier_Reveal_Enhanced_Inverted.png',claim_boundary:'Display demonstrator only; no measured spectrum, resonance evidence, physical prototype or material prescription.'},a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='a0-breathing-crystal-aperture-return.json';a.click();URL.revokeObjectURL(a.href);});
  new ResizeObserver(fit).observe(canvas);img.addEventListener('load',()=>draw(performance.now()));selectStage(0,false);
})();
