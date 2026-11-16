(function(){
  'use strict';
  const M=window.A0MatroschkaClusterModel;
  const $=s=>document.querySelector(s),fmt=(v,n=4)=>Number(v).toFixed(n),inputs=['a','b','c','azimuth','elevation'];
  const state={a:2,b:1,c:4,azimuth:35,elevation:25,side:'F0',snap:0,playing:false,timer:null,modelReady:false,modelPlaying:false,modelOrbit:false,nativeAnimation:false,modelLoadMode:'PENDING',offlineTried:false,modelRaf:0,modelLastMs:null};
  const model3d=$('#mcb-3d-model'),snapTimes=[0,2.5,5,7.5,10];
  const modelDirectSource=model3d&&model3d.dataset.mcbSrc;
  const offlineGlb=window.A0MatroschkaAtomicGlbOffline;
  function matrix(host,A){host.innerHTML=A.flat().map(v=>`<span>${fmt(v,2)}</span>`).join('')}
  function set(id,value){const el=$('#'+id);if(el)el.textContent=value}
  async function loadOfflineModel(){
    if(!model3d||!offlineGlb||state.offlineTried)return false;
    state.offlineTried=true;state.modelLoadMode='OFFLINE_BLOB';set('mcb-3d-state','UNPACKING GLB · SOURCE HASH 77622c77');
    try{model3d.src=await offlineGlb.getObjectUrl();document.body.dataset.mcb3dSource='offline-blob';return true}
    catch(error){state.modelLoadMode='FAILED';set('mcb-3d-state',`GLB OFFLINE ERROR · ${error.message||'DECODE FAILED'}`);return false}
  }
  function loadModel(){
    if(!model3d)return;
    if(location.protocol==='file:'&&offlineGlb){loadOfflineModel();return}
    state.modelLoadMode='DIRECT_URL';model3d.src=modelDirectSource;document.body.dataset.mcb3dSource='direct-url';
  }
  function setModelTime(time){
    if(!model3d||!state.nativeAnimation)return;
    try{model3d.currentTime=((Number(time)||0)%10+10)%10}catch(error){}
  }
  function modelTick(now){
    if(!state.modelPlaying||!model3d)return;
    if(state.modelLastMs!==null){const next=((Number(model3d.currentTime)||0)+(now-state.modelLastMs)/1000)%10;setModelTime(next);set('mcb-3d-frame',`FRAME ${fmt(next,2)} s · LIVE`)}
    state.modelLastMs=now;state.modelRaf=requestAnimationFrame(modelTick);
  }
  function modelPlay(){
    if(!state.modelReady||!model3d)return;
    if(state.nativeAnimation){model3d.setAttribute('animation-name','MCB_TRIPLE_WHEEL_RETURN_10S');if(typeof model3d.pause==='function')model3d.pause()}
    state.modelPlaying=true;state.modelLastMs=null;cancelAnimationFrame(state.modelRaf);state.modelRaf=requestAnimationFrame(modelTick);
    const button=$('#mcb-3d-play');if(button){button.textContent=state.nativeAnimation?'Ⅱ PAUSE WHEELS':'Ⅱ PAUSE SNAP CYCLE';button.setAttribute('aria-pressed','true')}
  }
  function modelPause(){
    if(state.modelReady&&state.nativeAnimation&&model3d&&typeof model3d.pause==='function')model3d.pause();
    state.modelPlaying=false;state.modelLastMs=null;cancelAnimationFrame(state.modelRaf);state.modelRaf=0;
    const button=$('#mcb-3d-play');if(button){button.textContent=state.nativeAnimation?'▶ PLAY WHEELS':'▶ PLAY SNAP CYCLE';button.setAttribute('aria-pressed','false')}
  }
  function syncModelSnap(index,preservePlayback=false){
    const snap=M.snapOf(index),time=snapTimes[snap.index];
    set('mcb-3d-state',`${state.modelReady?'READY':'LOADING'} · ${snap.angle}° ${snap.bearing}`);
    set('mcb-3d-frame',`FRAME ${fmt(time,2)} s · ${snap.polarity}`);
    document.querySelectorAll('[data-mcb-3d-snap]').forEach(button=>button.classList.toggle('is-active',Number(button.getAttribute('data-mcb-3d-snap'))===snap.index));
    if(!state.modelReady||!model3d)return;
    model3d.setAttribute('camera-orbit',`${snap.angle}deg 68deg 145%`);
    if(typeof model3d.jumpCameraToGoal==='function')model3d.jumpCameraToGoal();
    if(!state.nativeAnimation){state.modelPlaying=state.playing;state.modelPlaying?modelPlay():modelPause();return}
    const wasPlaying=state.modelPlaying;
    setModelTime(time);
    if(preservePlayback&&wasPlaying)modelPlay();else modelPause();
  }
  function render(){
    inputs.forEach(id=>state[id]=Number($('#mcb-'+id).value));
    const r=M.route([state.a,state.b,state.c],state),C=M.census(),color=r.cluster.color,snap=M.snapOf(state.snap);
    inputs.forEach(id=>set('mcb-'+id+'-value',state[id]+(id==='azimuth'||id==='elevation'?'°':'')));
    set('mcb-address',`(${r.source.join(',')}) ∈ Z₆³`);set('mcb-cluster',`${r.cluster.id} · ${r.cluster.label}`);
    set('mcb-radius',fmt(r.rho,6));set('mcb-chart',`${fmt(r.riemann.re,3)} ${r.riemann.im<0?'−':'+'} ${fmt(Math.abs(r.riemann.im),3)}i`);
    set('mcb-q',fmt(r.qDegree.measurement,6));set('mcb-return',r.return.epsilon.toExponential(2));
    set('mcb-witnessless',r.controls.witnessless.epsilon.toExponential(2));set('mcb-wrong',r.controls.wrongOrder.epsilon.toExponential(2));
    set('mcb-f0-side',r.f0.side);
    set('mcb-census',`${C.exactReturns}/${C.nodes}`);set('mcb-failures',`${C.witnesslessFailures} / ${C.wrongOrderFailures}`);
    $('#mcb-source-point').setAttribute('cx',150+state.a*22);$('#mcb-source-point').setAttribute('cy',484-state.b*18);$('#mcb-source-point').style.color=color;
    $('#mcb-cluster-point').setAttribute('cx',[315,405,495][r.cluster.index]);$('#mcb-cluster-point').setAttribute('cy',[390,330,390][r.cluster.index]);$('#mcb-cluster-point').style.color=color;
    const gx=690+r.oriented[0]*130,gy=310-r.oriented[1]*130;
    $('#mcb-geo-point').setAttribute('cx',gx);$('#mcb-geo-point').setAttribute('cy',gy);$('#mcb-geo-point').style.color=color;
    const qx=690+r.qDegree.axis[0]*150,qy=310-r.qDegree.axis[1]*150,mx=690-r.qDegree.axis[0]*150,my=310+r.qDegree.axis[1]*150;
    $('#mcb-q-plus').setAttribute('x2',qx);$('#mcb-q-plus').setAttribute('y2',qy);$('#mcb-q-minus').setAttribute('x2',mx);$('#mcb-q-minus').setAttribute('y2',my);
    $('#mcb-q-plus-label').setAttribute('x',qx+(qx>=690?8:-36));$('#mcb-q-plus-label').setAttribute('y',qy-8);
    $('#mcb-q-minus-label').setAttribute('x',mx+(mx>=690?8:-36));$('#mcb-q-minus-label').setAttribute('y',my+18);
    $('#mcb-route').setAttribute('d',`M${150+state.a*22},${484-state.b*18} C260,470 290,410 ${[315,405,495][r.cluster.index]},${[390,330,390][r.cluster.index]} S560,310 ${gx},${gy} S905,270 1035,315 S1110,430 1045,500`);
    $('#mcb-return-point').setAttribute('fill',r.return.exact?'#69df9e':'#ff4d83');
    set('mcb-snap-name',snap.label);set('mcb-snap-angle',`${snap.angle}° · ${snap.polarity} · ${snap.operator}`);
    set('mcb-bearing',snap.bearing);set('mcb-landing-token',snap.landing.token);set('mcb-landing-type',snap.landing.type);
    set('mcb-nest-state',snap.index===3?'EXTERNAL VIEW · RIEMANN / Q°':snap.index===4?'RETURN · ALL SHELLS CLOSE':`${snap.angle}° · ${snap.label} SHELL`);
    const roseAngle=(snap.angle%360)*Math.PI/180,roseX=690+Math.cos(roseAngle)*176,roseY=310-Math.sin(roseAngle)*176;
    $('#mcb-azimuth-ray').setAttribute('x2',roseX);$('#mcb-azimuth-ray').setAttribute('y2',roseY);
    $('#mcb-azimuth-head').setAttribute('cx',roseX);$('#mcb-azimuth-head').setAttribute('cy',roseY);
    set('mcb-azimuth-rose',`AZIMUT ${snap.angle}°`);
    const route=$('#mcb-route'),cursor=$('#mcb-snap-cursor'),fractions=[0,.24,.52,.76,1],point=route.getPointAtLength(route.getTotalLength()*fractions[snap.index]);
    cursor.setAttribute('cx',point.x);cursor.setAttribute('cy',point.y);
    document.querySelectorAll('[data-snap]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.snap)===snap.index));
    document.querySelectorAll('[data-snap-station]').forEach(station=>station.classList.toggle('is-active',Number(station.dataset.snapStation)===snap.index));
    document.querySelectorAll('[data-landing-station]').forEach(station=>station.classList.toggle('is-active',Number(station.dataset.landingStation)===snap.index));
    document.body.dataset.cluster=r.cluster.id;document.body.dataset.snap=String(snap.index);document.body.dataset.qPolarity=snap.polarity.endsWith('−')?'minus':'plus';document.body.dataset.playing=state.playing?'true':'false';
    $('#mcb-play').textContent=state.playing?'PAUSE BOLA':'PLAY BOLA';
  }
  function setSnap(index){
    state.snap=((Number(index)%M.SNAP_SEQUENCE.length)+M.SNAP_SEQUENCE.length)%M.SNAP_SEQUENCE.length;
    state.side=state.snap===3?'F0-':'F0';
    render();syncModelSnap(state.snap,state.playing);
  }
  function stop(){if(state.timer)clearInterval(state.timer);state.timer=null;state.playing=false;modelPause();render()}
  function togglePlay(){
    if(state.playing){stop();return}
    state.playing=true;modelPlay();render();state.timer=setInterval(()=>setSnap(state.snap+1),1100);
  }
  const translationCanvas=$('#mcb-translation-canvas'),translationContext=translationCanvas&&translationCanvas.getContext('2d');
  const translation={inner:'julia',outer:'riemann',rot:.35,scale:1,sample:1,phase:.35,ghostMode:'riemann',ghostGrid:true,ghostPearls:true,ghostEgg:true};
  const ghostComparator=M.ghostgridComparator({rotationDeg:90});
  const translationOperators=['invert','rotate','scale','sample','rank','phase'];
  const clamp01=value=>Math.max(0,Math.min(1,value));
  function translationField(cx,cy,radius,kind,time){
    const points=[],count=Math.max(64,Math.floor(340*translation.sample));
    for(let i=0;i<=count;i++){
      const q=i/count;
      if(kind==='julia'){
        const t=q*Math.PI*8,radial=.55+.18*Math.sin(3*t+time)+.1*Math.sin(7*t);
        points.push([cx+radius*radial*Math.cos(t),cy+radius*radial*Math.sin(t)]);
      }else if(kind==='mandelbrot'){
        const t=q*Math.PI*2,radial=.42*(1-Math.cos(t))+.12*Math.cos(5*t+time);
        points.push([cx+radius*radial*Math.cos(t),cy+radius*.72*radial*Math.sin(t)]);
      }else if(kind==='hofmann'){
        const t=q*Math.PI*4+time,a=.45722,u=Math.sin(t)*Math.cos(a*t),v=Math.sin(t)*Math.sin(a*t)*Math.sin(2*t);
        points.push([cx+radius*u*translation.scale,cy-radius*v*translation.scale]);
      }else{
        const t=-35+q*70,den=.25+t*t,u=.5/den,v=-t/den;
        points.push([cx+radius*v*.95,cy-radius*(u*5-.08)]);
      }
    }
    return points;
  }
  function translationLine(points,color,width=1.5){
    translationContext.beginPath();points.forEach((point,index)=>index?translationContext.lineTo(point[0],point[1]):translationContext.moveTo(point[0],point[1]));
    translationContext.strokeStyle=color;translationContext.lineWidth=width;translationContext.stroke();
  }
  function fittedField(points,cx,cy,radius){
    const extent=Math.max(...points.flatMap(point=>[Math.abs(point.x),Math.abs(point.y)]),1e-9);
    return points.map(point=>[cx+radius*point.x/extent,cy+radius*point.y/extent]);
  }
  function drawGhostGrid(cx,cy,radius){
    translationContext.save();translationContext.strokeStyle='rgba(237,247,250,.09)';translationContext.lineWidth=1;
    for(let k=-4;k<=4;k++){const d=radius*k/4;translationContext.beginPath();translationContext.moveTo(cx-radius,cy+d);translationContext.lineTo(cx+radius,cy+d);translationContext.stroke();translationContext.beginPath();translationContext.moveTo(cx+d,cy-radius);translationContext.lineTo(cx+d,cy+radius);translationContext.stroke()}
    translationContext.restore();
  }
  function drawGhostComparator(cx,cy,radius){
    const mode=translation.ghostMode,fields=ghostComparator.fields;
    if(translation.ghostGrid)drawGhostGrid(cx,cy,radius);
    const source=mode==='julia'?fields.julia:mode==='riemann'?fields.riemann:fields.rotatedRiemann;
    const main=fittedField(source,cx,cy,radius);
    if(mode==='bridge'){
      if(translation.ghostEgg){translationContext.save();translationContext.setLineDash([7,7]);translationContext.strokeStyle='rgba(255,208,91,.28)';translationContext.lineWidth=1.3;translationContext.beginPath();translationContext.ellipse(cx,cy,radius*1.02,radius*.78,0,0,Math.PI*2);translationContext.stroke();translationContext.restore()}
      const ghost=fittedField(fields.mandelbrot,cx,cy,radius*.82);translationLine(ghost,'rgba(255,77,131,.62)',1.5);
      if(translation.ghostPearls){
        for(let index=0;index<13;index++){const q=index/12,a=main[Math.round(q*(main.length-1))],b=ghost[Math.round(q*(ghost.length-1))];translationContext.strokeStyle='rgba(237,247,250,.12)';translationContext.beginPath();translationContext.moveTo(a[0],a[1]);translationContext.lineTo(b[0],b[1]);translationContext.stroke();translationContext.fillStyle='#edf7fa';translationContext.beginPath();translationContext.arc((a[0]+b[0])/2,(a[1]+b[1])/2,2.2,0,Math.PI*2);translationContext.fill()}
      }
    }
    translationLine(main,mode==='julia'?'rgba(255,77,131,.9)':'rgba(57,200,239,.95)',2);
    const first=main[0],last=main.at(-1);translationContext.fillStyle='#ffd05b';for(const point of [first,last]){translationContext.beginPath();translationContext.arc(point[0],point[1],3.5,0,Math.PI*2);translationContext.fill()}
    translationContext.fillStyle='#8eabb3';translationContext.font='800 8px ui-monospace';translationContext.fillText(mode==='bridge'?'INDEX CORRESPONDENCE · NOT CLOSURE':mode==='rot90'?'90° ISOMETRY · GAP HELD':mode==='julia'?'CLOSED PARAMETER CONTROL':'ENDPOINT RESIDUAL',cx,cy+radius+28);
    const gap=mode==='julia'?ghostComparator.endpointGap.julia:mode==='riemann'?ghostComparator.endpointGap.riemann:ghostComparator.endpointGap.rotatedRiemann;
    set('mcb-ghostgrid-gap',gap.toFixed(4));set('mcb-ghostgrid-invariant',ghostComparator.invariants.rigidRotationPreservesGap?'INVARIANT':'FAILED');set('mcb-ghostgrid-bridge',mode==='bridge'?'OVERLAY ≠ CLOSURE':'SEPARATE OVERLAY');set('mcb-ghostgrid-mode',({riemann:'RIEMANN OPEN',rot90:'RIEMANN +90°',bridge:'MANDELBROT GHOST',julia:'JULIA CONTROL'})[mode]);
  }
  function translationFlow(ax,ay,bx,by,time,color,reverse=false){
    translationContext.globalAlpha=.36;translationContext.strokeStyle=color;translationContext.beginPath();translationContext.moveTo(ax,ay);
    translationContext.bezierCurveTo((ax+bx)/2,ay-34,(ax+bx)/2,by+34,bx,by);translationContext.stroke();
    for(let k=0;k<5;k++){const q=((reverse?-time:time)*.12+k/5+2)%1,px=ax+(bx-ax)*q,py=ay+(by-ay)*q-Math.sin(q*Math.PI)*24;translationContext.beginPath();translationContext.arc(px,py,2.2,0,Math.PI*2);translationContext.fillStyle=color;translationContext.fill()}
    translationContext.globalAlpha=1;
  }
  function drawTranslation(timeMs=0){
    if(!translationContext)return;
    const ratio=Math.min(2,window.devicePixelRatio||1),rect=translationCanvas.getBoundingClientRect(),width=Math.max(720,rect.width||1080),height=Math.max(420,rect.height||620);
    if(translationCanvas.width!==Math.round(width*ratio)||translationCanvas.height!==Math.round(height*ratio)){translationCanvas.width=Math.round(width*ratio);translationCanvas.height=Math.round(height*ratio)}
    translationContext.setTransform(ratio,0,0,ratio,0,0);translationContext.fillStyle='#02090d';translationContext.fillRect(0,0,width,height);
    const time=timeMs/1000,L=width*.22,C=width*.5,R=width*.78,cy=height*.49,radius=Math.min(width*.16,height*.28),wheelRadius=Math.min(104,width*.09);
    translationContext.font='800 10px ui-monospace';translationContext.fillStyle='#8eabb3';translationContext.textAlign='center';
    translationContext.fillText('INNER DISPLAY · '+translation.inner.toUpperCase(),L,48);translationContext.fillText('DECLARED OPERATOR WHEEL',C,48);translationContext.fillText('OUTER DISPLAY · '+translation.outer.toUpperCase(),R,48);
    translationLine(translationField(L,cy,radius,translation.inner,time*.16),'rgba(255,77,131,.84)',1.7);
    if(translation.outer==='riemann')drawGhostComparator(R,cy,radius);else translationLine(translationField(R,cy,radius,translation.outer,time*translation.phase*.25),'rgba(57,200,239,.9)',1.8);
    for(let k=0;k<6;k++){translationContext.beginPath();translationContext.arc(C,cy,wheelRadius*(.35+k*.11),0,Math.PI*2);translationContext.strokeStyle=k%2?'rgba(57,200,239,.25)':'rgba(255,208,91,.25)';translationContext.stroke()}
    translationOperators.forEach((operator,index)=>{const angle=time*translation.rot+index*Math.PI/3,x=C+Math.cos(angle)*wheelRadius*.82,y=cy+Math.sin(angle)*wheelRadius*.82;translationContext.fillStyle=index<4?'#39c8ef':'#ffd05b';translationContext.fillText(operator,x,y)});
    translationContext.beginPath();translationContext.arc(C,cy,6,0,Math.PI*2);translationContext.fillStyle='#ffd05b';translationContext.fill();
    translationFlow(L+radius*.72,cy,C-wheelRadius*.82,cy,time,'#ff4d83');translationFlow(C+wheelRadius*.82,cy,R-radius*.72,cy,time+.4,'#39c8ef');
    translationFlow(R-radius*.72,cy+58,C+wheelRadius*.7,cy+58,time,'#ffd05b',true);translationFlow(C-wheelRadius*.7,cy+58,L+radius*.72,cy+58,time,'#ffd05b',true);
    const preserved=clamp01(.92-.28*(1-translation.sample)-.08*Math.abs(translation.scale-1));
    const changed=clamp01(.08+.42*Math.abs(translation.scale-1)+.18*translation.phase);
    const collapsed=clamp01((1-translation.sample)*.72);
    set('mcb-translation-preserved',(preserved*100).toFixed(1)+'%');set('mcb-translation-changed',(changed*100).toFixed(1)+'%');set('mcb-translation-collapsed',(collapsed*100).toFixed(1)+'%');
    set('mcb-translation-state',translation.inner.toUpperCase()+' → '+translation.outer.toUpperCase()+' · VIEW');
    requestAnimationFrame(drawTranslation);
  }
  if(translationCanvas){
    document.querySelectorAll('[data-mcb-inner-lens]').forEach(button=>button.addEventListener('click',()=>{translation.inner=button.dataset.mcbInnerLens;document.querySelectorAll('[data-mcb-inner-lens]').forEach(item=>item.classList.toggle('is-active',item===button))}));
    document.querySelectorAll('[data-mcb-outer-lens]').forEach(button=>button.addEventListener('click',()=>{translation.outer=button.dataset.mcbOuterLens;document.querySelectorAll('[data-mcb-outer-lens]').forEach(item=>item.classList.toggle('is-active',item===button))}));
    document.querySelectorAll('[data-mcb-ghost-mode]').forEach(button=>button.addEventListener('click',()=>{translation.ghostMode=button.dataset.mcbGhostMode;translation.outer='riemann';document.querySelectorAll('[data-mcb-ghost-mode]').forEach(item=>item.classList.toggle('is-active',item===button));document.querySelectorAll('[data-mcb-outer-lens]').forEach(item=>item.classList.toggle('is-active',item.dataset.mcbOuterLens==='riemann'))}));
    for(const [id,key] of [['mcb-ghostgrid-grid','ghostGrid'],['mcb-ghostgrid-pearls','ghostPearls'],['mcb-ghostgrid-egg','ghostEgg']]){$('#'+id).addEventListener('change',event=>translation[key]=event.target.checked)}
    for(const key of ['rot','scale','sample','phase']){$('#mcb-translation-'+key).addEventListener('input',event=>{translation[key]=Number(event.target.value);set('mcb-translation-'+key+'-value',translation[key].toFixed(2))})}
    requestAnimationFrame(drawTranslation);
  }
  const criticalCanvas=$('#mcb-critical-seam-canvas'),janusCanvas=$('#mcb-janus-seam-canvas');
  const janusMotion={cursor:0,index:0,playing:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,lastMs:null,periodMs:15000};
  function fitCanvas(canvas){
    const ratio=Math.min(2,window.devicePixelRatio||1),width=Math.max(360,canvas.clientWidth||720),height=Math.max(260,canvas.clientHeight||420);
    if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio)}
    const context=canvas.getContext('2d');context.setTransform(ratio,0,0,ratio,0,0);return {context,width,height};
  }
  function drawA0SourceMath(timeMs=0){
    const time=timeMs/1000;
    if(criticalCanvas){
      const {context:c,width:w,height:h}=fitCanvas(criticalCanvas),cx=w/2,top=38,bottom=h-34,breathe=.5+.5*Math.sin(time*.9);
      c.fillStyle='#02090d';c.fillRect(0,0,w,h);c.font='800 10px ui-monospace';c.textAlign='center';c.fillStyle='#8eabb3';c.fillText('J(s)=1−s̄ · FIXED SEAM Re(s)=1/2',cx,20);
      c.strokeStyle='rgba(255,208,91,.22)';for(let r=42;r<Math.min(w,h)*.48;r+=42){c.beginPath();c.arc(cx,h*.52,r,0,Math.PI*2);c.stroke()}
      const gap=10+26*breathe;c.lineWidth=2.2;c.strokeStyle='#39c8ef';c.beginPath();c.moveTo(cx-gap/2,top);c.lineTo(cx-gap/2,h*.51-gap*.12);c.stroke();c.strokeStyle='#ff4d83';c.beginPath();c.moveTo(cx+gap/2,h*.51+gap*.12);c.lineTo(cx+gap/2,bottom);c.stroke();
      c.setLineDash([5,6]);c.strokeStyle='rgba(255,255,255,.42)';c.beginPath();c.moveTo(cx,top);c.lineTo(cx,bottom);c.stroke();c.setLineDash([]);
      [14.134725,21.02204,25.010858,30.424876,32.935062].forEach((ordinate,index)=>{const y=top+(bottom-top)*(index+1)/6;c.beginPath();c.arc(cx,y,2.8,0,Math.PI*2);c.fillStyle='#39c8ef';c.fill();c.textAlign='left';c.fillStyle='#8eabb3';c.fillText('γ'+(index+1)+' ≈ '+ordinate.toFixed(3),cx+10,y+3)});
      c.textAlign='center';c.fillStyle='#ffcf5b';c.fillText('DISPLAY HOMOTOPY · SEAM HELD · NO RH CLAIM',cx,h-12);
    }
    if(janusCanvas){
      if(janusMotion.lastMs===null)janusMotion.lastMs=timeMs;
      const delta=Math.max(0,Math.min(100,timeMs-janusMotion.lastMs));janusMotion.lastMs=timeMs;
      if(janusMotion.playing){janusMotion.cursor=(janusMotion.cursor+delta*420/janusMotion.periodMs)%420;janusMotion.index=Math.floor(janusMotion.cursor)}
      const frame=M.finiteJanusFrame(janusMotion.index),{context:c,width:w,height:h}=fitCanvas(janusCanvas),left=w*.27,right=w*.72,cy=h*.5,r=Math.min(w*.19,h*.34);
      c.fillStyle='#02090d';c.fillRect(0,0,w,h);c.font='800 10px ui-monospace';c.textAlign='center';c.fillStyle='#8eabb3';c.fillText('FINITE PHASE θₖ=2πk/420 · JANUS DISPLAY PAIR',w/2,20);
      c.strokeStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(left,cy,r,0,Math.PI*2);c.stroke();
      for(let k=0;k<60;k++){const angle=2*Math.PI*k/60-Math.PI/2,x=left+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;c.beginPath();c.arc(x,y,k%10===0?2.4:1.2,0,Math.PI*2);c.fillStyle=k%2?'#39c8ef':'#a977e8';c.fill()}
      const ix=left+frame.i.re*r,iy=cy-frame.i.im*r,shadowX=left+frame.shadow.re*r;
      c.strokeStyle='#ffcf5b';c.lineWidth=1.4;c.beginPath();c.moveTo(left,cy);c.lineTo(ix,iy);c.stroke();
      c.setLineDash([5,5]);c.strokeStyle='rgba(255,255,255,.72)';c.beginPath();c.moveTo(ix,iy);c.lineTo(shadowX,cy);c.stroke();c.setLineDash([]);
      c.strokeStyle='rgba(105,223,158,.65)';c.beginPath();c.moveTo(left-r,cy);c.lineTo(left+r,cy);c.stroke();
      c.beginPath();c.arc(ix,iy,5,0,Math.PI*2);c.fillStyle='#ffcf5b';c.fill();c.beginPath();c.arc(shadowX,cy,5.5,0,Math.PI*2);c.fillStyle='#69df9e';c.fill();
      c.textAlign=ix>=left?'left':'right';c.fillStyle='#ffcf5b';c.fillText('i',ix+(ix>=left?8:-8),iy-7);c.fillStyle='#69df9e';c.fillText('SHADOW Q₀',shadowX+(shadowX>=left?8:-8),cy+17);c.textAlign='center';
      c.strokeStyle='rgba(255,255,255,.24)';c.beginPath();c.moveTo(w*.5,42);c.lineTo(w*.5,h-34);c.stroke();
      const mapU=point=>({x:right+point.x*r*.72,y:cy-r*.42+point.y*r*.96});
      c.strokeStyle='rgba(105,223,158,.38)';c.beginPath();c.moveTo(right-r*.8,cy+r*.5);c.lineTo(right+r*.82,cy+r*.5);c.stroke();
      c.beginPath();frame.path.forEach((point,index)=>{const p=mapU(point);index?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)});c.strokeStyle='#39c8ef';c.lineWidth=2.2;c.stroke();
      const loopPoints=frame.path.filter(point=>point.segment==='TONGUE_LOOP');c.beginPath();loopPoints.forEach((point,index)=>{const p=mapU(point);index?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)});c.strokeStyle='#ffcf5b';c.lineWidth=2.8;c.stroke();
      const up=mapU(frame.u),uShadowY=cy+r*.5;c.setLineDash([4,5]);c.strokeStyle='rgba(255,255,255,.58)';c.beginPath();c.moveTo(up.x,up.y);c.lineTo(up.x,uShadowY);c.stroke();c.setLineDash([]);
      c.beginPath();c.arc(up.x,up.y,6,0,Math.PI*2);c.fillStyle='#ff4d83';c.fill();c.beginPath();c.arc(up.x,uShadowY,4,0,Math.PI*2);c.fillStyle='#69df9e';c.fill();c.textAlign='left';c.fillStyle='#ff4d83';c.fillText('u · '+frame.u.segment,up.x+9,up.y-8);c.textAlign='center';
      c.fillStyle='#8eabb3';c.fillText(`k mod 420 · i: ${frame.phaseIndex}/420 · dⱼ ${frame.shadow.ghostDistance.toFixed(3)}`,left,h-14);c.fillText('u SINK · 2 HUMPS · 1:2:1 · TONGUE LOOP',right,h-14);
      set('mcb-janus-phase',`${frame.phaseIndex}/420`);set('mcb-janus-shadow',frame.shadow.ghostDistance.toFixed(3));set('mcb-janus-segment',frame.u.segment);set('mcb-janus-return',frame.return.exact?'EXACT RETURN':'IN FLIGHT');
      const scrub=$('#mcb-janus-scrub');if(scrub&&document.activeElement!==scrub)scrub.value=String(frame.phaseIndex);
      const play=$('#mcb-janus-play');if(play){play.textContent=janusMotion.playing?'PAUSE':'PLAY';play.setAttribute('aria-pressed',String(janusMotion.playing))}
    }
    if(criticalCanvas||janusCanvas)requestAnimationFrame(drawA0SourceMath);
  }
  if(criticalCanvas||janusCanvas)requestAnimationFrame(drawA0SourceMath);
  if(janusCanvas){
    $('#mcb-janus-play').addEventListener('click',()=>{janusMotion.playing=!janusMotion.playing;janusMotion.lastMs=null});
    $('#mcb-janus-step').addEventListener('click',()=>{janusMotion.playing=false;janusMotion.index=(janusMotion.index+1)%420;janusMotion.cursor=janusMotion.index;janusMotion.lastMs=null});
    $('#mcb-janus-reset').addEventListener('click',()=>{janusMotion.playing=false;janusMotion.index=0;janusMotion.cursor=0;janusMotion.lastMs=null});
    $('#mcb-janus-scrub').addEventListener('input',event=>{janusMotion.playing=false;janusMotion.index=Number(event.target.value);janusMotion.cursor=janusMotion.index;janusMotion.lastMs=null});
  }
  const hopfCanvas=$('#mcb-hopf-canvas'),stabilityBreathCanvas=$('#mcb-stability-breath-canvas');
  const hopf={phase:0,count:8,playing:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,lastMs:null};
  const hopfColors=['#ff4d83','#ff8b55','#ffd05b','#69df9e','#39c8ef','#6c9cff','#a977e8','#f06fd8','#9fe870','#59d6c7','#ffb45c','#d68cff'];
  function hopfFiber(baseZ,basePhi,samples=180){
    const theta=Math.acos(Math.max(-1,Math.min(1,baseZ))),a=Math.cos(theta/2),b=Math.sin(theta/2),points=[];
    for(let index=0;index<=samples;index++){
      const t=index/samples*Math.PI*2,x1=a*Math.cos(t+basePhi),y1=a*Math.sin(t+basePhi),x2=b*Math.cos(t),y2=b*Math.sin(t),den=Math.max(.055,1-y2);
      points.push({x:x1/den,y:y1/den,z:x2/den});
    }
    return points;
  }
  function rotateHopfPoint(point,yaw,pitch){
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),x=point.x*cy-point.z*sy,z=point.x*sy+point.z*cy;
    return{x,y:point.y*cp-z*sp,z:point.y*sp+z*cp};
  }
  function drawHopf(){
    if(!hopfCanvas)return;
    const {context:c,width:w,height:h}=fitCanvas(hopfCanvas),cx=w*.47,cy=h*.51,scale=Math.min(w,h)*.17,yaw=.58+hopf.phase*Math.PI/1440,pitch=-.34+.08*Math.sin(hopf.phase*Math.PI/180),fibers=[];
    c.fillStyle='#02090d';c.fillRect(0,0,w,h);c.strokeStyle='rgba(57,200,239,.08)';c.lineWidth=1;
    for(let ring=1;ring<=6;ring++){c.beginPath();c.arc(cx,cy,ring*Math.min(w,h)*.055,0,Math.PI*2);c.stroke()}
    c.setLineDash([3,7]);c.beginPath();c.moveTo(w*.08,cy);c.lineTo(w*.86,cy);c.moveTo(cx,h*.1);c.lineTo(cx,h*.9);c.stroke();c.setLineDash([]);
    for(let index=0;index<hopf.count;index++){
      const q=hopf.count===1?.5:index/(hopf.count-1),baseZ=.78-q*1.5,basePhi=index*Math.PI*(3-Math.sqrt(5)),points=hopfFiber(baseZ,basePhi).map(point=>rotateHopfPoint(point,yaw,pitch));
      fibers.push({index,baseZ,basePhi,points,depth:points.reduce((sum,point)=>sum+point.z,0)/points.length});
    }
    fibers.sort((a,b)=>a.depth-b.depth).forEach(fiber=>{
      const color=hopfColors[fiber.index%hopfColors.length];c.beginPath();let started=false;
      fiber.points.forEach(point=>{const perspective=4.7/(4.7+Math.max(-3.9,point.z)),x=cx+point.x*scale*perspective,y=cy-point.y*scale*perspective;if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x-cx)>w||Math.abs(y-cy)>h){started=false;return}if(!started){c.moveTo(x,y);started=true}else c.lineTo(x,y)});
      c.strokeStyle=color;c.globalAlpha=.78;c.lineWidth=1.8;c.shadowColor=color;c.shadowBlur=7;c.stroke();c.shadowBlur=0;c.globalAlpha=1;
      const markerIndex=Math.round((hopf.phase/360)*(fiber.points.length-1))%(fiber.points.length-1),marker=fiber.points[markerIndex],perspective=4.7/(4.7+Math.max(-3.9,marker.z)),mx=cx+marker.x*scale*perspective,my=cy-marker.y*scale*perspective;
      if(Number.isFinite(mx)&&Number.isFinite(my)&&Math.abs(mx-cx)<w&&Math.abs(my-cy)<h){c.beginPath();c.arc(mx,my,4.5,0,Math.PI*2);c.fillStyle='#fff';c.shadowColor=color;c.shadowBlur=14;c.fill();c.shadowBlur=0}
    });
    const sphereX=w*.86,sphereY=h*.72,sphereR=Math.min(w,h)*.105;c.beginPath();c.arc(sphereX,sphereY,sphereR,0,Math.PI*2);c.fillStyle='rgba(57,200,239,.035)';c.fill();c.strokeStyle='rgba(57,200,239,.46)';c.stroke();c.beginPath();c.ellipse(sphereX,sphereY,sphereR,sphereR*.3,0,0,Math.PI*2);c.strokeStyle='rgba(57,200,239,.22)';c.stroke();
    fibers.sort((a,b)=>a.index-b.index).forEach(fiber=>{const radial=Math.sqrt(Math.max(0,1-fiber.baseZ*fiber.baseZ)),x=sphereX+sphereR*radial*Math.cos(fiber.basePhi),y=sphereY-sphereR*fiber.baseZ;c.beginPath();c.arc(x,y,3.4,0,Math.PI*2);c.fillStyle=hopfColors[fiber.index%hopfColors.length];c.fill()});
    c.textAlign='center';c.font='900 9px ui-monospace';c.fillStyle='#8eabb3';c.fillText('S³ FIBERS · STEREOGRAPHIC R³ DISPLAY',cx,24);c.fillText('BASE S²',sphereX,sphereY+sphereR+18);c.fillStyle='#ffd05b';c.fillText('COMMON φ',cx,h-18);
  }
  function drawStabilityBreath(){
    if(!stabilityBreathCanvas)return;
    const {context:c,width:w,height:h}=fitCanvas(stabilityBreathCanvas),phase=hopf.phase*Math.PI/180,originX=w*.49,originY=h*.67,sx=w*.105,sy=h*.14,sz=h*.065,rows=13,cols=22,project=(x,y,z)=>({x:originX+(x-2.5)*sx+(y*.9)*sx,y:originY-(y*.62)*sy-z*sz});
    c.fillStyle='#031016';c.fillRect(0,0,w,h);c.lineWidth=1;
    const surface=(x,y)=>3.1+.72*Math.cos(x*.95)-2*y*y-.8*Math.sin(2*Math.PI*x/5+phase*.65);
    for(let yi=0;yi<rows;yi++){
      const y=-1+2*yi/(rows-1);c.beginPath();for(let xi=0;xi<cols;xi++){const x=5*xi/(cols-1),p=project(x,y,surface(x,y));xi?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)}c.strokeStyle=`hsla(${175+yi*4},72%,58%,${.18+yi/rows*.42})`;c.stroke()
    }
    for(let xi=0;xi<cols;xi++){
      const x=5*xi/(cols-1);c.beginPath();for(let yi=0;yi<rows;yi++){const y=-1+2*yi/(rows-1),p=project(x,y,surface(x,y));yi?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)}c.strokeStyle='rgba(169,119,232,.24)';c.stroke()
    }
    const runnerX=(hopf.phase%360)/360*5,runner=project(runnerX,0,surface(runnerX,0));c.beginPath();c.arc(runner.x,runner.y,5,0,Math.PI*2);c.fillStyle='#ffd05b';c.shadowColor='#ffd05b';c.shadowBlur=16;c.fill();c.shadowBlur=0;
    c.textAlign='center';c.font='900 9px ui-monospace';c.fillStyle='#8eabb3';c.fillText('ARCHIVED FORMULA · LOCAL DISPLAY REPLAY',w/2,20);c.fillStyle='#69df9e';c.fillText('τ BREATH · SOURCE STATE UNCHANGED',w/2,h-14);
  }
  function renderHopf(){
    const degrees=Math.round(hopf.phase)%360;set('mcb-hopf-state',`${hopf.playing?'LIVE':'HELD'} · ${hopf.count} FIBERS · φ ${degrees}°`);set('mcb-hopf-return',degrees===0?'φ 0° · CLOSED':`φ ${degrees}° · IN FLIGHT`);
    const play=$('#mcb-hopf-play');if(play){play.textContent=hopf.playing?'Ⅱ PAUSE FIBERS':'▶ PLAY FIBERS';play.setAttribute('aria-pressed',String(hopf.playing))}const phase=$('#mcb-hopf-phase');if(phase&&document.activeElement!==phase)phase.value=String(degrees);const count=$('#mcb-hopf-count');if(count)count.value=String(hopf.count);drawHopf();drawStabilityBreath();
  }
  function animateHopf(timeMs){
    if(hopfCanvas){if(hopf.lastMs===null)hopf.lastMs=timeMs;const delta=Math.min(60,Math.max(0,timeMs-hopf.lastMs));hopf.lastMs=timeMs;if(hopf.playing)hopf.phase=(hopf.phase+delta*.018)%360;renderHopf();requestAnimationFrame(animateHopf)}
  }
  if(hopfCanvas){
    $('#mcb-hopf-play').addEventListener('click',()=>{hopf.playing=!hopf.playing;hopf.lastMs=null;renderHopf()});$('#mcb-hopf-step').addEventListener('click',()=>{hopf.playing=false;hopf.phase=(Math.round(hopf.phase)+12)%360;hopf.lastMs=null;renderHopf()});$('#mcb-hopf-reset').addEventListener('click',()=>{hopf.playing=false;hopf.phase=0;hopf.lastMs=null;renderHopf()});$('#mcb-hopf-phase').addEventListener('input',event=>{hopf.playing=false;hopf.phase=Number(event.target.value);hopf.lastMs=null;renderHopf()});$('#mcb-hopf-count').addEventListener('input',event=>{hopf.count=Number(event.target.value);renderHopf()});requestAnimationFrame(animateHopf)
  }
  const finalPlugCanvas=$('#mcb-final-plug-canvas'),finalPlug={step:1,playing:false,timer:null};
  const finalPlugColors=['#ff4d83','#ff9d45','#ffd05b','#69df9e','#39c8ef'];
  function drawFinalPlug(){
    if(!finalPlugCanvas)return;
    const frame=M.finalPlugFrame(finalPlug.step),{context:c,width:w,height:h}=fitCanvas(finalPlugCanvas),cy=h*.49,left=w*.18,center=w*.5,right=w*.82,r=Math.min(h*.27,w*.12);
    c.fillStyle='#02090d';c.fillRect(0,0,w,h);c.textAlign='center';c.font='800 9px ui-monospace';c.fillStyle='#8eabb3';c.fillText('FIVE APERTURES · φ',left,24);c.fillText('HOPF DISPLAY · S³ → S²',center,24);c.fillText('IHARA AUDIT · C₅',right,24);
    for(let ring=0;ring<5;ring++){c.beginPath();c.arc(left,cy,r*(.36+ring*.14),0,Math.PI*2);c.strokeStyle='rgba(255,255,255,.08)';c.stroke()}
    for(let index=1;index<=5;index++){
      const angle=2*Math.PI*index/5-Math.PI/2,x=left+Math.cos(angle)*r*.94,y=cy+Math.sin(angle)*r*.94,active=index===frame.phaseStep;
      c.beginPath();c.moveTo(left+Math.cos(angle)*r*.28,cy+Math.sin(angle)*r*.28);c.lineTo(x,y);c.strokeStyle=active?finalPlugColors[index-1]:'rgba(255,255,255,.15)';c.lineWidth=active?2.6:1;c.stroke();
      c.beginPath();c.arc(x,y,active?8:4,0,Math.PI*2);c.fillStyle=active?finalPlugColors[index-1]:'#26404b';c.fill();c.fillStyle=active?'#fff':'#8eabb3';c.fillText('t'+index,x,y-13)
    }
    c.beginPath();c.arc(left,cy,r*.19,0,Math.PI*2);c.fillStyle='#ffd05b';c.fill();c.fillStyle='#07151d';c.font='900 18px Georgia,serif';c.fillText('φ',left,cy+6);
    c.setLineDash([4,6]);c.strokeStyle='rgba(169,119,232,.5)';c.beginPath();c.ellipse(center,cy,r*.88,r*.33,-.45,0,Math.PI*2);c.stroke();c.setLineDash([]);
    for(let index=0;index<5;index++){const offset=(index-2)*.085;c.beginPath();c.ellipse(center,cy+offset*r,r*(.72-Math.abs(offset)),r*(.58+Math.abs(offset)),offset*4,0,Math.PI*2);c.strokeStyle=index===frame.phaseStep-1?finalPlugColors[index]:'rgba(57,200,239,.18)';c.lineWidth=index===frame.phaseStep-1?2.5:1;c.stroke()}
    const fiberAngle=frame.phi-Math.PI/2,fx=center+Math.cos(fiberAngle)*r*.76,fy=cy+Math.sin(fiberAngle)*r*.54;
    c.beginPath();c.moveTo(center,cy);c.lineTo(fx,fy);c.strokeStyle=finalPlugColors[frame.phaseStep-1];c.lineWidth=1.5;c.stroke();c.beginPath();c.arc(fx,fy,7,0,Math.PI*2);c.fillStyle=finalPlugColors[frame.phaseStep-1];c.fill();
    c.beginPath();c.arc(center,cy,r*.24,0,Math.PI*2);c.fillStyle='#ffd05b';c.shadowColor='#ffd05b';c.shadowBlur=18;c.fill();c.shadowBlur=0;c.fillStyle='#07151d';c.font='900 21px Georgia,serif';c.fillText('ι',center,cy+1);c.font='800 8px ui-monospace';c.fillText('1.1 · BOLA',center,cy+16);
    const nodes=Array.from({length:5},(_,index)=>{const angle=2*Math.PI*index/5-Math.PI/2;return{x:right+Math.cos(angle)*r*.83,y:cy+Math.sin(angle)*r*.83}});
    for(let index=0;index<5;index++){const next=(index+1)%5,a=nodes[index],b=nodes[next],active=index<frame.phaseStep;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=active?finalPlugColors[index]:'rgba(255,255,255,.14)';c.lineWidth=active?2.5:1;c.stroke()}
    nodes.forEach((node,index)=>{const active=frame.ihara.routePrefix.includes(index),current=index===frame.ihara.activeNode;c.beginPath();c.arc(node.x,node.y,current?9:6,0,Math.PI*2);c.fillStyle=current?'#fff':active?finalPlugColors[Math.max(0,index-1)]:'#18313c';c.fill();c.fillStyle=current?'#07151d':'#8eabb3';c.font='900 8px ui-monospace';c.fillText(String(index),node.x,node.y+3)});
    c.beginPath();c.arc(right,cy,25,0,Math.PI*2);c.fillStyle=frame.returnGate.active?'#ffd05b':'#07151d';c.strokeStyle=frame.returnGate.active?'#ffd05b':'#35505b';c.lineWidth=2;c.shadowColor='#ffd05b';c.shadowBlur=frame.returnGate.active?20:0;c.fill();c.stroke();c.shadowBlur=0;c.fillStyle=frame.returnGate.active?'#07151d':'#596870';c.font='900 24px Georgia,serif';c.fillText(frame.returnGate.marker,right,cy+8);
    c.fillStyle=frame.return.exact?'#69df9e':'#8eabb3';c.font='900 10px ui-monospace';c.fillText(frame.return.exact?'¥ GATE · ρ HELD · ε=0 → 101':'¥ GATE · OPEN',right,cy+r+36);
    c.strokeStyle='rgba(255,255,255,.12)';c.beginPath();c.moveTo(w*.34,38);c.lineTo(w*.34,h-48);c.moveTo(w*.66,38);c.lineTo(w*.66,h-48);c.stroke();
    c.fillStyle='#8eabb3';c.font='800 8px ui-monospace';c.fillText(`φ ${(frame.phi*180/Math.PI).toFixed(0)}° · APERTURE ${frame.aperture.index}/5`,left,h-16);c.fillText(`BASE (${frame.hopf.base.x.toFixed(2)}, ${frame.hopf.base.y.toFixed(2)}, ${frame.hopf.base.z.toFixed(2)}) · FIXED`,center,h-16);c.fillText(frame.ihara.routePrefix.join('→'),right,h-16);
  }
  function renderFinalPlug(){
    if(!finalPlugCanvas)return;
    const frame=M.finalPlugFrame(finalPlug.step),degrees=Math.round(frame.phi*180/Math.PI);
    set('mcb-final-plug-status',`t${frame.phaseStep} · ${frame.time.toFixed(2)} · ${frame.return.exact?'EXACT RETURN':'IN FLIGHT'}`);set('mcb-final-plug-time',frame.time.toFixed(2));set('mcb-final-plug-phase',degrees+'°');set('mcb-final-plug-display',`${frame.display.token} · ${frame.display.type}`);set('mcb-final-plug-iota',`${frame.iota.displayValue.toFixed(1)} · HELD`);set('mcb-final-plug-hopf',`FIXED · ‖p‖=${frame.hopf.baseNorm.toFixed(0)}`);set('mcb-final-plug-ihara',frame.ihara.routePrefix.join('→')+' · NB');set('mcb-final-plug-return',frame.returnGate.active?'¥ ACTIVE · ρ HELD · ε=0 · 101':'¥ OPEN');
    $('#mcb-final-plug').dataset.return=String(frame.return.exact);$('#mcb-final-plug-scrub').value=String(frame.phaseStep);document.querySelectorAll('[data-mcb-final-step]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.mcbFinalStep)===frame.phaseStep));document.querySelectorAll('.mcb-final-plug-sequence span').forEach((item,index)=>item.classList.toggle('is-active',frame.phaseStep<5?index===frame.phaseStep-1:index>=4));const play=$('#mcb-final-plug-play');play.textContent=finalPlug.playing?'Ⅱ PAUSE':'▶ PLAY RETURN';play.setAttribute('aria-pressed',String(finalPlug.playing));drawFinalPlug();
  }
  function stopFinalPlug(){if(finalPlug.timer)clearInterval(finalPlug.timer);finalPlug.timer=null;finalPlug.playing=false;renderFinalPlug()}
  function setFinalPlugStep(step){finalPlug.step=Math.max(1,Math.min(5,Number(step)||1));renderFinalPlug()}
  function playFinalPlug(){
    if(finalPlug.playing){stopFinalPlug();return}
    if(finalPlug.step===5)finalPlug.step=1;finalPlug.playing=true;renderFinalPlug();finalPlug.timer=setInterval(()=>{if(finalPlug.step===5){stopFinalPlug();return}setFinalPlugStep(finalPlug.step+1)},900)
  }
  if(finalPlugCanvas){
    $('#mcb-final-plug-play').addEventListener('click',playFinalPlug);$('#mcb-final-plug-step').addEventListener('click',()=>{stopFinalPlug();setFinalPlugStep(finalPlug.step===5?1:finalPlug.step+1)});$('#mcb-final-plug-reset').addEventListener('click',()=>{stopFinalPlug();setFinalPlugStep(1)});$('#mcb-final-plug-scrub').addEventListener('input',event=>{stopFinalPlug();setFinalPlugStep(event.target.value)});document.querySelectorAll('[data-mcb-final-step]').forEach(button=>button.addEventListener('click',()=>{stopFinalPlug();setFinalPlugStep(button.dataset.mcbFinalStep)}));renderFinalPlug();window.addEventListener('resize',drawFinalPlug)
  }
  const moduleTourSteps=[
    {selector:'#mcb-route-chain',title:'Route zuerst: ADDRESS → RETURN.',copy:'Die fünf Stationen lesen dieselbe endliche Quelle; Pfeile sind typisierte Übergänge, keine neue Dynamik.'},
    {selector:'#mcb-live-frame',title:'Triple‑Six Live Frame: Quelle, Beobachtung, Rückweg.',copy:'Z₆³, Cluster, Geosphere, Q° und Riemann bleiben getrennte Records. Der gelbe Pfad hält den ρ‑Witness.'},
    {selector:'#mcb-maitroschka-joint',title:'Y teilt — ¥ bindet den Return.',copy:'C₁₂ liefert die klassische Algebra. Y zeigt ±i; ¥ ist der sichtbare Return-Marker mit erhaltenem Witness.'},
    {selector:'#mcb-nexahedron-v3-lens',title:'Ghostgrid: Relation zeigen, Identität verweigern.',copy:'Die 90°‑Drehung erhält die Lücke. Mandelbrot-Ghost, Ei und Perlen bleiben Vergleichsoverlays.'},
    {selector:'#mcb-pi-oval-sampler',title:'PI Oval: derselbe Rand, zwei diskrete Leser.',copy:'Platinum tastet 24 Punkte, Iridium 12 Punkte ab. Jeder zweite Pt-Punkt ist gemeinsam; φ ist Displayphase und ϕ nur Referenz.'},
    {selector:'#mcb-hopf-fibration',title:'Hopf sichtbar: S¹-Fasern über S².',copy:'Die klassische S³→S²-Abbildung wird stereographisch gezeigt. H‑air und Grid Breath bleiben getrennte Source-Referenzen.'},
    {selector:'#mcb-final-plug',title:'Final Plug: φ bewegt sich, ¥ schließt endlich.',copy:'Hopf zeigt kontinuierliche Phase, Ihara auditiert den C₅‑Pfad. Bei t₅ aktiviert ¥ mit ρ HELD und ε=0.'},
    {selector:'#mcb-3d-source-lens',title:'3D Return: Q‑Core, Triple Wheel, Ladder.',copy:'Die GLB-Linse projiziert denselben Träger in fünf Snaps; sie erzeugt keine zweite Asset-Identität.'},
    {selector:'#mcb-history-context',title:'Evidence-Grenze: Kontext ist kein Beweis.',copy:'Der historische Split erklärt Messbarkeit. Er bestätigt weder die Bridge noch ein neues physikalisches Gesetz.'}
  ];
  const moduleTour={index:-1,active:false};
  function renderModuleTour(move=false){
    document.querySelectorAll('.mcb-tour-focus').forEach(item=>item.classList.remove('mcb-tour-focus'));
    const valid=moduleTour.index>=0&&moduleTour.index<moduleTourSteps.length,step=valid?moduleTourSteps[moduleTour.index]:null,target=step&&$(step.selector);
    set('mcb-tour-progress',valid?`${moduleTour.index+1} / ${moduleTourSteps.length} · ${moduleTour.index===moduleTourSteps.length-1?'RETURN READY':'IN TOUR'}`:`0 / ${moduleTourSteps.length} · BEREIT`);set('mcb-tour-step-title',valid?step.title:'Ein Träger, neun kontrollierte Lesarten.');set('mcb-tour-step-copy',valid?step.copy:'Start führt von der endlichen Adresse über die getrennte Oval-Abtastung und sichtbare Hopf-Faser bis zum ¥‑Gate und anschließend zur Evidence-Grenze.');
    document.querySelectorAll('[data-mcb-tour-step]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.mcbTourStep)===moduleTour.index));$('#mcb-tour-prev').disabled=!valid||moduleTour.index===0;$('#mcb-tour-next').textContent=valid&&moduleTour.index===moduleTourSteps.length-1?'RETURN TOP':'WEITER →';$('#mcb-tour-start').textContent=moduleTour.active?'Ⅱ TOUR HALTEN':valid?'▶ TOUR FORTSETZEN':'▶ TOUR STARTEN';$('#mcb-tour-start').setAttribute('aria-pressed',String(moduleTour.active));
    if(target){target.classList.add('mcb-tour-focus');if(moduleTour.index===1){stop();setSnap(0)}if(moduleTour.index===3){translation.ghostMode='bridge';translation.outer='riemann';document.querySelectorAll('[data-mcb-ghost-mode]').forEach(button=>button.classList.toggle('is-active',button.dataset.mcbGhostMode==='bridge'))}if(moduleTour.index===5){hopf.playing=true;hopf.lastMs=null;renderHopf()}if(moduleTour.index===6){stopFinalPlug();setFinalPlugStep(5)}if(moduleTour.index===7){stop();setSnap(4)}if(move)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
  }
  function setModuleTourStep(index,move=true){moduleTour.index=Math.max(0,Math.min(moduleTourSteps.length-1,Number(index)||0));moduleTour.active=true;renderModuleTour(move)}
  function returnModuleTour(){moduleTour.active=false;moduleTour.index=-1;renderModuleTour(false);$('#mcb-module-tour').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
  if($('#mcb-module-tour')){
    $('#mcb-tour-start').addEventListener('click',()=>{if(moduleTour.active){moduleTour.active=false;renderModuleTour(false)}else setModuleTourStep(moduleTour.index<0?0:moduleTour.index)});$('#mcb-tour-prev').addEventListener('click',()=>setModuleTourStep(moduleTour.index-1));$('#mcb-tour-next').addEventListener('click',()=>moduleTour.index===moduleTourSteps.length-1?returnModuleTour():setModuleTourStep(moduleTour.index+1));$('#mcb-tour-return').addEventListener('click',returnModuleTour);document.querySelectorAll('[data-mcb-tour-step]').forEach(button=>button.addEventListener('click',()=>setModuleTourStep(button.dataset.mcbTourStep)));renderModuleTour(false)
  }
  inputs.forEach(id=>$('#mcb-'+id).addEventListener('input',render));
  $('#mcb-next').addEventListener('click',()=>{let n=state.a*36+state.b*6+state.c;n=(n+1)%216;state.a=Math.floor(n/36);state.b=Math.floor(n/6)%6;state.c=n%6;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-corner').addEventListener('click',()=>{state.a=5;state.b=5;state.c=5;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-center').addEventListener('click',()=>{state.a=2;state.b=2;state.c=2;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-f0').addEventListener('click',()=>{state.side=state.side==='F0'?'F0-':'F0';render()});
  $('#mcb-snap').addEventListener('click',()=>{stop();setSnap(state.snap+1)});
  $('#mcb-play').addEventListener('click',togglePlay);
  document.querySelectorAll('[data-snap]').forEach(button=>button.addEventListener('click',()=>{stop();setSnap(Number(button.dataset.snap))}));
  document.querySelectorAll('[data-mcb-3d-snap]').forEach(button=>button.addEventListener('click',()=>{stop();setSnap(Number(button.getAttribute('data-mcb-3d-snap')))}));
  if(model3d){
    model3d.addEventListener('load',()=>{
      state.modelReady=true;document.body.setAttribute('data-3d-loaded','true');
      if(typeof model3d.dismissPoster==='function')model3d.dismissPoster();
      state.nativeAnimation=typeof model3d.play==='function'&&Array.isArray(model3d.availableAnimations)&&model3d.availableAnimations.includes('MCB_TRIPLE_WHEEL_RETURN_10S');
      document.body.dataset.mcb3dMode=state.nativeAnimation?'native-clip':'snap-fallback';
      if(state.nativeAnimation){model3d.setAttribute('animation-name','MCB_TRIPLE_WHEEL_RETURN_10S');if('animationName' in model3d)model3d.animationName='MCB_TRIPLE_WHEEL_RETURN_10S'}
      syncModelSnap(state.snap,false);set('mcb-3d-state',`READY · ${state.modelLoadMode} · 0° ORIENT`);modelPause();
    });
    model3d.addEventListener('error',async()=>{state.modelReady=false;if(state.modelLoadMode==='DIRECT_URL'&&await loadOfflineModel())return;set('mcb-3d-state','GLB LOAD ERROR · SOURCE PRESERVED')});
    model3d.addEventListener('timeupdate',()=>{if(state.modelPlaying)set('mcb-3d-frame',`FRAME ${fmt(model3d.currentTime||0,2)} s · LIVE`) });
    loadModel();
  }
  $('#mcb-3d-play').addEventListener('click',()=>state.nativeAnimation?(state.modelPlaying?modelPause():modelPlay()):togglePlay());
  $('#mcb-3d-reset').addEventListener('click',()=>{
    if(!model3d)return;model3d.setAttribute('camera-orbit','0deg 68deg 145%');model3d.fieldOfView='auto';
    if(typeof model3d.resetTurntableRotation==='function')model3d.resetTurntableRotation();
    if(typeof model3d.jumpCameraToGoal==='function')model3d.jumpCameraToGoal();
  });
  $('#mcb-3d-orbit').addEventListener('click',()=>{
    state.modelOrbit=!state.modelOrbit;model3d.autoRotate=state.modelOrbit;
    const button=$('#mcb-3d-orbit');button.textContent=`AUTO ORBIT ${state.modelOrbit?'ON':'OFF'}`;button.setAttribute('aria-pressed',String(state.modelOrbit));
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing)stop();if(document.hidden&&state.modelPlaying)modelPause()});
  matrix($('#mcb-A1'),M.A1);matrix($('#mcb-A2'),M.A2);matrix($('#mcb-A3'),M.A3);render();syncModelSnap(0,false);
})();
