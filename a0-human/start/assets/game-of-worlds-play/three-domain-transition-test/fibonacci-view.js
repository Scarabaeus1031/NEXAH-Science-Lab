(function(root,factory){
  const Model=typeof module==="object"&&module.exports?require("../../../a0-game-of-worlds-model.js"):root.A0GameOfWorldsModel;
  const api=factory(Model);
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.ThreeDomainFibonacciView=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(Model){
  "use strict";
  const NAMES=["chemistry","life","physics"],LIMIT=30,PERIOD=LIMIT+1,PHI=(1+Math.sqrt(5))/2,GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
  const COLORS={chemistry:"#22d3ee",life:"#f5bf42",physics:"#fb7185",fib:"#76e1b3",gold:"#f5bf42",grid:"#294451",text:"#edf8fb",muted:"#91a8b5",bg:"#040a10"};

  function sequence(){
    let session=Model.start({world:"fibonacci"});
    const frames=[session.frames[0]];
    for(let n=1;n<=LIMIT;n++){session=Model.step(session);frames.push(session.frames[n]);}
    return frames.map(frame=>Object.freeze({n:frame.generation,a:frame.state.a,b:frame.state.b,x:frame.points[0].x,y:frame.points[0].y}));
  }
  const SEQUENCE=Object.freeze(sequence());

  function buildFibonacciView(snapshots,generation){
    if(!Number.isInteger(generation)||generation<0)throw new TypeError("A non-negative integer generation is required");
    if(!snapshots||NAMES.some(name=>!Array.isArray(snapshots[name]?.events?.all)))throw new TypeError("Three addressed domain snapshots are required");
    const phase=generation%PERIOD,item=SEQUENCE[phase],a=BigInt(item.a),b=BigInt(item.b),previous=phase===0?1n:b-a,cassini=b*previous-a*a,expected=phase%2===0?1n:-1n;
    if(cassini!==expected)throw new Error("Cassini invariant failed");
    const domainEvents=Object.freeze(Object.fromEntries(NAMES.map(name=>[name,snapshots[name].events.all.length]))),eventTotal=NAMES.reduce((sum,name)=>sum+domainEvents[name],0),ratio=a===0n?null:Number(b)/Number(a);
    return Object.freeze({
      schema:"nexah.three-domain.fibonacci-view.v1",generation,phase,period:PERIOD,
      pair:Object.freeze({a:item.a,b:item.b,previous:String(previous)}),
      ratio,phi:PHI,phiError:ratio===null?null:Math.abs(ratio-PHI),cassini:String(cassini),
      domainEvents,eventTotal,sequence:SEQUENCE,
      recurrence:"(a,b) -> (b,a+b); seed (0,1)",
      viewGrammar:Object.freeze({
        primary:Object.freeze(["exact recurrence","ratio convergence","golden-angle address spiral"]),
        derived:"matrix/Cassini control computed from the same exact pair",
        fourthIsNewSequence:false
      }),
      boundary:"COMMON_CLOCK_READOUT_ONLY_DOMAIN_EVENTS_NOT_RECURRENCE_INPUTS_NO_FIBONACCI_RETURN"
    });
  }

  function label(ctx,text,x,y,color=COLORS.text,size=12,align="left"){
    ctx.fillStyle=color;ctx.font=`600 ${size}px Inter,system-ui,sans-serif`;ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign="left";
  }
  function format(value,digits=8){return value===null?"—":Number(value).toFixed(digits).replace(/\.0+$/,"").replace(/(\.\d*?)0+$/,"$1")}
  function spiralPoint(n,cx=0,cy=0,scale=10){const angle=n*GOLDEN_ANGLE,r=7+scale*Math.sqrt(n);return{x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)}}
  function drawPanel(ctx,x,y,w,h,title,color=COLORS.fib){ctx.fillStyle="rgba(16,36,48,.42)";ctx.strokeStyle=COLORS.grid;ctx.lineWidth=1;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);label(ctx,title,x+12,y+21,color,10)}
  function drawCanvas(canvas,projection){
    const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=COLORS.bg;ctx.fillRect(0,0,canvas.width,canvas.height);
    label(ctx,`Fibonacci · 3 views + 1 derived control · g${projection.generation}`,28,28,COLORS.muted,12);
    const p1={x:24,y:48,w:230,h:216},p2={x:266,y:48,w:230,h:216},p3={x:24,y:282,w:230,h:216},p4={x:266,y:282,w:230,h:216};
    drawPanel(ctx,p1.x,p1.y,p1.w,p1.h,"1 · EXACT RECURRENCE");
    label(ctx,"(a,b) → (b,a+b)",p1.x+18,p1.y+52,COLORS.muted,11);label(ctx,`F${projection.phase}`,p1.x+18,p1.y+92,COLORS.muted,10);label(ctx,projection.pair.a,p1.x+18,p1.y+126,COLORS.fib,19);label(ctx,"→",p1.x+103,p1.y+126,COLORS.gold,18,"center");label(ctx,`F${projection.phase+1}`,p1.x+128,p1.y+92,COLORS.muted,10);label(ctx,projection.pair.b,p1.x+128,p1.y+126,COLORS.gold,19);label(ctx,"seed (0,1) · exact integers",p1.x+18,p1.y+188,COLORS.muted,9);
    drawPanel(ctx,p2.x,p2.y,p2.w,p2.h,"2 · RATIO CONVERGENCE",COLORS.gold);
    const gx=p2.x+25,gy=p2.y+178,gw=182,gh=116,min=1,max=2.05;ctx.strokeStyle=COLORS.grid;ctx.beginPath();ctx.moveTo(gx,gy-gh);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();const phiY=gy-(PHI-min)/(max-min)*gh;ctx.strokeStyle=COLORS.gold;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(gx,phiY);ctx.lineTo(gx+gw,phiY);ctx.stroke();ctx.setLineDash([]);label(ctx,"φ",gx+gw+4,phiY+3,COLORS.gold,9);
    ctx.strokeStyle=COLORS.fib;ctx.lineWidth=2;ctx.beginPath();let started=false;projection.sequence.forEach((item,index)=>{if(index===0)return;const ratio=Number(item.b)/Number(item.a),x=gx+(index-1)/29*gw,y=gy-(ratio-min)/(max-min)*gh;if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)});ctx.stroke();if(projection.phase>0){const x=gx+(projection.phase-1)/29*gw,y=gy-(projection.ratio-min)/(max-min)*gh;ctx.fillStyle=COLORS.gold;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill()}label(ctx,`Fₙ₊₁/Fₙ = ${format(projection.ratio,5)}`,p2.x+18,p2.y+201,COLORS.text,9);
    drawPanel(ctx,p3.x,p3.y,p3.w,p3.h,"3 · ADDRESS SPIRAL",COLORS.chemistry);ctx.strokeStyle=COLORS.grid;ctx.lineWidth=1;ctx.beginPath();projection.sequence.forEach((item,index)=>{const point=spiralPoint(index,p3.x+115,p3.y+112,8.2);if(index)ctx.lineTo(point.x,point.y);else ctx.moveTo(point.x,point.y)});ctx.stroke();projection.sequence.forEach((item,index)=>{const point=spiralPoint(index,p3.x+115,p3.y+112,8.2),past=index<=projection.phase;ctx.fillStyle=index===projection.phase?COLORS.gold:past?COLORS.fib:"#142630";ctx.beginPath();ctx.arc(point.x,point.y,index===projection.phase?6:2.7,0,Math.PI*2);ctx.fill()});label(ctx,"golden angle · display geometry",p3.x+18,p3.y+201,COLORS.muted,9);
    drawPanel(ctx,p4.x,p4.y,p4.w,p4.h,"4 · DERIVED CONTROL",COLORS.physics);label(ctx,"[0  1]ⁿ · [0]",p4.x+31,p4.y+62,COLORS.muted,12);label(ctx,"[1  1]    [1]",p4.x+31,p4.y+84,COLORS.muted,12);label(ctx,"=",p4.x+121,p4.y+74,COLORS.physics,18,"center");label(ctx,`[${projection.pair.a}]`,p4.x+150,p4.y+62,COLORS.fib,12);label(ctx,`[${projection.pair.b}]`,p4.x+150,p4.y+84,COLORS.gold,12);label(ctx,"Cassini check",p4.x+18,p4.y+127,COLORS.muted,10);label(ctx,`Fₙ₊₁Fₙ₋₁ − Fₙ² = ${projection.cassini}`,p4.x+18,p4.y+157,COLORS.physics,11);label(ctx,"computed from view 1",p4.x+18,p4.y+201,COLORS.muted,9);
    label(ctx,`pair (${projection.pair.a}, ${projection.pair.b}) · |Δφ| ${format(projection.phiError)}`,28,524,COLORS.text,12);
    const cards=[[`g${projection.generation}`,"CLOCK"],[`n${projection.phase}`,"MOD 31"],[projection.cassini,"CASSINI"],[String(projection.eventTotal),"DOMAIN EVENTS"]];
    cards.forEach((item,index)=>{const x=28+index*121;ctx.fillStyle="rgba(16,36,48,.8)";ctx.strokeStyle=COLORS.grid;ctx.fillRect(x,548,108,66);ctx.strokeRect(x,548,108,66);label(ctx,item[1],x+10,569,COLORS.muted,9);label(ctx,item[0],x+10,596,index===2?COLORS.gold:COLORS.text,13)});
    label(ctx,"4 is derived from the same pair · no fourth sequence",28,646,COLORS.physics,10);
    label(ctx,"domain events remain context · never recurrence inputs",28,667,COLORS.muted,10);
  }

  function init(doc=document){
    const canvas=doc.getElementById("fibonacciCanvas"),host=doc.getElementById("fibonacciMotor");if(!canvas||!host)return null;
    const $=id=>doc.getElementById(id),state={generation:0,phase:0,follow:true,snapshots:null};
    function placeholderSnapshots(){return Object.fromEntries(NAMES.map(name=>[name,{events:{all:[]}}]))}
    function projection(){return buildFibonacciView(state.snapshots||placeholderSnapshots(),state.follow?state.generation:state.phase)}
    function renderRail(active){const rail=$("fibonacciRail");rail.replaceChildren();SEQUENCE.forEach(item=>{const cell=doc.createElement("div");cell.className=item.n===active?"is-active":"";cell.innerHTML=`<span>F${item.n}</span><b>${item.a}</b>`;rail.append(cell)})}
    function render(){
      const p=projection(),ratio=format(p.ratio),error=format(p.phiError);state.phase=p.phase;host.dataset.clock=state.follow?"three-domain":"local";$("fibonacciLivePath").dataset.mode=state.follow?"clock":"local";
      $("fibonacciGeneration").textContent=state.follow?`g${state.generation}`:"local";$("fibonacciN").textContent=`n${p.phase}`;$("fibonacciPairValue").textContent=`(${p.pair.a}, ${p.pair.b})`;$("fibonacciRatioValue").textContent=`ratio ${ratio}`;
      $("fibonacciPhase").value=String(p.phase);$("fibonacciPhaseValue").textContent=String(p.phase);$("fibonacciCurrent").textContent=`F${p.phase} = ${p.pair.a}`;$("fibonacciCassiniValue").textContent=`Cassini ${Number(p.cassini)>0?"+":""}${p.cassini}`;$("fibonacciPhiValue").textContent=`Δφ ${error}`;
      $("fibonacciPair").textContent=`${p.pair.a} / ${p.pair.b}`;$("fibonacciRatio").textContent=ratio;$("fibonacciCassini").textContent=p.cassini;$("fibonacciEvents").textContent=String(p.eventTotal);
      for(const name of NAMES)$("fibonacci"+name[0].toUpperCase()+name.slice(1)+"Events").textContent=String(p.domainEvents[name]);
      renderRail(p.phase);drawCanvas(canvas,p);return p;
    }
    function detach(){state.follow=false;$("fibonacciFollow").checked=false}
    $("fibonacciPhase").addEventListener("input",()=>{detach();state.phase=Number($("fibonacciPhase").value);render()});
    $("fibonacciFollow").addEventListener("change",()=>{state.follow=$("fibonacciFollow").checked;if(state.follow)state.phase=state.generation%PERIOD;render()});
    $("fibonacciStep").addEventListener("click",()=>{if(state.follow&&$("step")){$("step").click();return}state.phase=(state.phase+1)%PERIOD;render()});
    window.addEventListener("threedomain:render",event=>{if(!event.detail)return;state.snapshots=event.detail.snapshots;state.generation=event.detail.generation;if(state.follow)state.phase=state.generation%PERIOD;render()});
    render();return Object.freeze({state,render,buildFibonacciView});
  }
  if(typeof document!=="undefined")init(document);
  return Object.freeze({LIMIT,PERIOD,PHI,SEQUENCE,buildFibonacciView,drawCanvas,init});
});
