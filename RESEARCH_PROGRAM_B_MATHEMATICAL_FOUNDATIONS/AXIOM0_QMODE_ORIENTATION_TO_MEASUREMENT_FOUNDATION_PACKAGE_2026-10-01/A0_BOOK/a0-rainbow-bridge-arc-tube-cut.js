(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0RainbowBridgeArcTubeCut=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='A0-VIEW-RAINBOW-PURPLE-RAIN';
  const CLASSIFICATION='HUMAN_VIEW_CROSS_SECTION_INSTRUMENT';
  const COLORS=['#ff4f61','#ff9d32','#ffd84d','#53dc8d','#25d8ea','#438fff','#916cff'];
  const STAGES=Object.freeze([
    Object.freeze({key:'POINT',label:'Punkt',hint:'Ein adressierter Schnittpunkt.'}),
    Object.freeze({key:'LINE',label:'Linie',hint:'Der Schnitt öffnet eine gerichtete Spur.'}),
    Object.freeze({key:'WEDGE',label:'Keil',hint:'Zwei Richtungen bilden eine begrenzte Öffnung.'}),
    Object.freeze({key:'ARC',label:'Bogen',hint:'Die gestreckte Projektion liest sich als Brücke.'}),
    Object.freeze({key:'LENS',label:'Linse',hint:'Zwei Bögen begrenzen ein gemeinsames Fenster.'}),
    Object.freeze({key:'TUBE',label:'Tube',hint:'Viele Schnitte staffeln sich zu einem Durchgang.'}),
    Object.freeze({key:'CRYSTAL',label:'Kristall',hint:'Rasterkreuzungen werden als lokale Knoten sichtbar.'})
  ]);
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const lerp=(a,b,t)=>a+(b-a)*t;
  function stageAt(height){const h=clamp(Number(height)||0,0,100),index=Math.min(6,Math.floor(h/100*7));return Object.freeze({...STAGES[index],index})}
  function model(input={}){
    const height=clamp(Number(input.height??52),0,100),stretch=clamp(Number(input.stretch??62),0,100),observer=clamp(Number(input.observer??38),0,90),t=height/100,stage=stageAt(height),section=Math.sin(Math.PI*clamp(t,.001,.999)),diagonal=Math.SQRT2,arcRise=(.1+.9*stretch/100)*section;
    return Object.freeze({height,stretch,observer,t,stage,section,diagonal,arcRise,cutPosition:lerp(.34,.78,t),tubeRadius:lerp(.08,.34,section),observerRadians:observer*Math.PI/180});
  }
  function buildRecord(input={}){const state=model(input);return Object.freeze({schema:'nexah.a0.rainbow-bridge-arc-tube-cut/1',version:VERSION,identity:IDENTITY,classification:CLASSIFICATION,state,bindings:Object.freeze(['A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS','A0-VIEW-RAINBOW-PURPLE-RAIN','ART:MIWA:MAIN','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH']),authority:Object.freeze({newGraphIdentity:false,newGraphRelation:false,scientificEvidence:false,calibratedOptics:false,physicalWormhole:false,universalRootPattern:false}),boundary:'The exact square diagonal ratio is sqrt(2). Arcs, tubes, waves, crystals, heights and aperture cuts are observer-local display constructions. They do not establish a wormhole, universal root law, optical calibration, carrier identity, cosmology or new Source Graph relation.'})}
  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const canvas=doc.getElementById('rainbowBridgeCanvas');if(!canvas)return null;
    const ctx=canvas.getContext('2d'),height=doc.getElementById('rbHeight'),stretch=doc.getElementById('rbStretch'),observer=doc.getElementById('rbObserver'),heightOut=doc.getElementById('rbHeightOut'),stretchOut=doc.getElementById('rbStretchOut'),observerOut=doc.getElementById('rbObserverOut'),stageOut=doc.getElementById('rbStageOut'),stageHint=doc.getElementById('rbStageHint'),diagOut=doc.getElementById('rbDiagOut'),cutOut=doc.getElementById('rbCutOut'),nodeOut=doc.getElementById('rbNodeOut'),play=doc.getElementById('rbPlay'),reset=doc.getElementById('rbReset'),exportButton=doc.getElementById('rbExport');
    const layerButtons=[...doc.querySelectorAll('[data-rb-layer]')],layers={grid:true,wave:true,crystal:true};let running=false,raf=0,last=0,phase=0;
    const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
    function size(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,(host&&host.devicePixelRatio)||1),w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);return{w,h}}
    const line=(x1,y1,x2,y2,color,width=1,alpha=1)=>{ctx.strokeStyle=rgba(color,alpha);ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()};
    function background(w,h){const g=ctx.createRadialGradient(w*.55,h*.48,0,w*.55,h*.48,w*.62);g.addColorStop(0,'#0c2937');g.addColorStop(.45,'#06131d');g.addColorStop(1,'#02070c');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<70;i++){const x=(i*89.13%997)/997*w,y=(i*47.71%991)/991*h,a=.12+(i%5)*.035;ctx.fillStyle=`rgba(205,238,255,${a})`;ctx.fillRect(x,y,i%11===0?1.6:.7,i%11===0?1.6:.7)}}
    function prism(w,h,cy){const px=w*.18,py=cy,side=Math.min(w,h)*.105;ctx.fillStyle='rgba(197,229,239,.055)';ctx.strokeStyle='rgba(198,234,244,.72)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(px-side*.72,py+side);ctx.lineTo(px,py-side);ctx.lineTo(px+side*.72,py+side);ctx.closePath();ctx.fill();ctx.stroke();line(w*.025,cy,px-side*.45,cy,'#ffffff',3,.9);ctx.fillStyle='#c8dce4';ctx.font='800 10px ui-monospace,monospace';ctx.fillText('WHITE INPUT',w*.025,cy-13);return{x:px+side*.43,y:cy}}
    function drawGrid(cx,cy,rx,ry,angle,color,alpha){ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.clip();ctx.strokeStyle=rgba(color,alpha);ctx.lineWidth=.7;const step=Math.max(10,rx/13);for(let p=-rx*1.45;p<=rx*1.45;p+=step){ctx.beginPath();ctx.moveTo(p,-ry*1.8);ctx.lineTo(p,ry*1.8);ctx.stroke();ctx.beginPath();ctx.moveTo(-rx*1.6,p);ctx.lineTo(rx*1.6,p);ctx.stroke()}ctx.restore()}
    function render(){
      const {w,h}=size(),state=model({height:height.value,stretch:stretch.value,observer:observer.value}),cy=h*.54,x0=w*.30,x1=w*.91,span=x1-x0,baseRise=h*(.12+.23*state.arcRise),cutX=lerp(x0,x1,state.cutPosition),bodyRy=h*(.08+.24*state.section),rot=(state.observerRadians-.45)*.28;ctx.clearRect(0,0,w,h);background(w,h);const src=prism(w,h,cy);
      COLORS.forEach((color,i)=>{const d=(i-3)*h*.018;line(src.x,src.y,x0,cy+d,color,2.4,.88)});
      if(layers.wave){for(let i=0;i<9;i++){ctx.strokeStyle=rgba(i%2?'#25d8ea':'#8d6cff',.09);ctx.lineWidth=1.2;ctx.beginPath();for(let x=x0;x<=x1;x+=7){const u=(x-x0)/span,y=cy+Math.sin(u*Math.PI*6+phase+i*.65)*h*.022+(i-4)*h*.045;if(x===x0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}}
      ctx.save();ctx.translate((x0+x1)/2,cy);ctx.rotate(rot);ctx.translate(-(x0+x1)/2,-cy);
      ctx.fillStyle='rgba(20,91,113,.08)';ctx.strokeStyle='rgba(177,226,240,.22)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(x0,cy);ctx.quadraticCurveTo((x0+x1)/2,cy-bodyRy,x1,cy);ctx.quadraticCurveTo((x0+x1)/2,cy+bodyRy,x0,cy);ctx.closePath();ctx.fill();ctx.stroke();
      if(layers.grid){drawGrid((x0+x1)/2,cy,span*.44,bodyRy*.9,.18+rot,'#25d8ea',.34);drawGrid((x0+x1)/2,cy,span*.44,bodyRy*.9,-.18+rot,'#ffc84d',.30)}
      COLORS.forEach((color,i)=>{const offset=(i-3)*h*.013;ctx.strokeStyle=rgba(color,.88);ctx.lineWidth=2.2;ctx.beginPath();for(let x=x0;x<=x1;x+=6){const u=(x-x0)/span,y=cy+offset-baseRise*Math.sin(Math.PI*u);if(x===x0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();ctx.strokeStyle=rgba(color,.24);ctx.beginPath();for(let x=x0;x<=x1;x+=6){const u=(x-x0)/span,y=cy-offset+baseRise*.82*Math.sin(Math.PI*u);if(x===x0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()});
      if(state.stage.index>=4){for(let i=1;i<13;i++){const u=i/13,x=lerp(x0,x1,u),r=bodyRy*Math.sin(Math.PI*u);ctx.strokeStyle=rgba('#a9d9e7',.08+(i===Math.round(13*state.cutPosition)?.34:0));ctx.lineWidth=i===Math.round(13*state.cutPosition)?1.8:.65;ctx.beginPath();ctx.ellipse(x,cy,Math.max(2,r*.24),Math.max(3,r),0,0,Math.PI*2);ctx.stroke()}}
      let nodes=0;if(layers.crystal){for(let row=-7;row<=7;row++)for(let col=0;col<=18;col++){const u=col/18,x=lerp(x0,x1,u),limit=bodyRy*Math.sin(Math.PI*u),y=cy+row*bodyRy/7+(col%2?bodyRy/14:0);if(Math.abs(y-cy)>limit)continue;const nearCut=Math.abs(x-cutX)<span*.045,n=(row+8)*19+col,twinkle=.28+.72*(.5+.5*Math.sin(phase*1.8+n*.71));ctx.fillStyle=rgba(nearCut?'#fff3ae':COLORS[(row+col+21)%7],nearCut?twinkle:.22);ctx.beginPath();ctx.arc(x,y,nearCut?1.7+twinkle*2.4:1.05,0,Math.PI*2);ctx.fill();if(nearCut)nodes++}}
      ctx.restore();
      ctx.fillStyle='rgba(255,79,156,.055)';ctx.fillRect(cutX-12,h*.16,24,h*.70);line(cutX,h*.16,cutX,h*.86,'#ff4f9c',1.6,.9);ctx.strokeStyle=rgba('#ff4f9c',.72);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cutX,cy,Math.max(5,bodyRy*.19),Math.max(9,bodyRy),0,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#ffd6e8';ctx.font='800 10px ui-monospace,monospace';ctx.fillText('CUT / APERTURE',cutX+12,h*.18);ctx.fillStyle='#b8d1da';ctx.fillText('√2 · SQUARE DIAGONAL',x0,h*.90);ctx.fillStyle='#ffc84d';ctx.fillText(`${state.stage.index+1}/7 · ${state.stage.key}`,x0,h*.12);
      heightOut.textContent=`${state.height.toFixed(0)}%`;stretchOut.textContent=`${state.stretch.toFixed(0)}%`;observerOut.textContent=`${state.observer.toFixed(0)}°`;stageOut.textContent=`${state.stage.index+1}/7 · ${state.stage.label}`;stageHint.textContent=state.stage.hint;diagOut.textContent=state.diagonal.toFixed(5);cutOut.textContent=`${(state.cutPosition*100).toFixed(1)}%`;nodeOut.textContent=String(nodes);return state
    }
    function loop(time){if(!running)return;const dt=Math.min(40,time-last||16);last=time;phase+=dt*.001;height.value=String((Number(height.value)+dt*.0045)%101);render();raf=host.requestAnimationFrame(loop)}
    [height,stretch,observer].forEach(input=>input.addEventListener('input',()=>{running=false;play.textContent='Play height';play.setAttribute('aria-pressed','false');if(raf)host.cancelAnimationFrame(raf);render()}));
    layerButtons.forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.rbLayer;layers[key]=!layers[key];button.setAttribute('aria-pressed',String(layers[key]));render()}));
    play.addEventListener('click',()=>{running=!running;play.setAttribute('aria-pressed',String(running));play.textContent=running?'Pause height':'Play height';if(running){last=0;raf=host.requestAnimationFrame(loop)}else if(raf)host.cancelAnimationFrame(raf)});
    reset.addEventListener('click',()=>{running=false;if(raf)host.cancelAnimationFrame(raf);height.value='52';stretch.value='62';observer.value='38';phase=0;play.textContent='Play height';play.setAttribute('aria-pressed','false');render()});
    exportButton.addEventListener('click',()=>{const record=buildRecord({height:height.value,stretch:stretch.value,observer:observer.value});const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([JSON.stringify(record,null,2)],{type:'application/json'}));link.download='A0_RAINBOW_BRIDGE_ARC_TUBE_CUT_STATE.json';link.click();setTimeout(()=>host.URL.revokeObjectURL(link.href),1000)});
    host.addEventListener('resize',render,{passive:true});render();return Object.freeze({render,record:()=>buildRecord({height:height.value,stretch:stretch.value,observer:observer.value}),destroy(){running=false;if(raf)host.cancelAnimationFrame(raf)}})
  }
  if(typeof window!=='undefined'&&window.document)window.addEventListener('DOMContentLoaded',()=>mount(window.document,window));
  return{VERSION,IDENTITY,CLASSIFICATION,COLORS,STAGES,clamp,lerp,stageAt,model,buildRecord,mount};
});
