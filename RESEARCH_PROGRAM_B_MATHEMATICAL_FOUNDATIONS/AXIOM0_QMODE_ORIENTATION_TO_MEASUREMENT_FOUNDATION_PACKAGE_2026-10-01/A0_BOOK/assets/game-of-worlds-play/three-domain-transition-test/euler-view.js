(function(root,factory){
  const Gear=typeof module==="object"&&module.exports?require("../logarithmic-gearbox.js"):root.LogarithmicGearbox;
  const api=factory(Gear);
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.ThreeDomainEulerView=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(Gear){
  "use strict";
  const NAMES=["chemistry","life","physics"];
  const COLORS={chemistry:"#22d3ee",life:"#f5bf42",physics:"#fb7185",aggregate:"#a78bfa",grid:"#294451",text:"#edf8fb",muted:"#91a8b5",bg:"#040a10",green:"#4ade80"};

  function eulerPhasor(ledger){
    if(!ledger||!Number.isFinite(ledger.total)||ledger.total<=0)throw new TypeError("A finite transition ledger is required");
    const re=(ledger.c11-ledger.c00)/ledger.total;
    const im=(ledger.c01-ledger.c10)/ledger.total;
    return Object.freeze({re,im,magnitude:Math.hypot(re,im),angle:Math.atan2(im,re)});
  }

  function buildEulerView(snapshots,generation,baseId="euler"){
    if(!snapshots||NAMES.some(name=>!snapshots[name]?.ledger))throw new TypeError("Three addressed domain snapshots are required");
    const domains=Object.freeze(Object.fromEntries(NAMES.map(name=>[name,eulerPhasor(snapshots[name].ledger)])));
    const re=NAMES.reduce((sum,name)=>sum+domains[name].re,0)/NAMES.length;
    const im=NAMES.reduce((sum,name)=>sum+domains[name].im,0)/NAMES.length;
    const clock=Gear.lifeClockProjection(generation),gear=Gear.buildState(baseId,clock.phase);
    return Object.freeze({
      schema:"nexah.three-domain.euler-view.v1",
      generation,domains,
      aggregate:Object.freeze({re,im,magnitude:Math.hypot(re,im),angle:Math.atan2(im,re)}),
      viewGrammar:Object.freeze({
        primary:Object.freeze(["chemistry phasor","life phasor","spin phasor"]),
        derived:"arithmetic centroid Z-bar = (Z-chemistry + Z-life + Z-spin) / 3",
        fourthIsNewOperator:false
      }),
      eventTotal:NAMES.reduce((sum,name)=>sum+snapshots[name].events.all.length,0),
      clock,gear,
      boundary:"COMMON_COMPLEX_READOUT_ONLY_NO_SHARED_OPERATOR"
    });
  }

  function format(value,digits=3){return Number(value).toFixed(digits).replace(/\.0+$/,"").replace(/(\.\d*?)0+$/,"$1");}
  function label(ctx,text,x,y,color=COLORS.text,size=12,align="left"){
    ctx.fillStyle=color;ctx.font=`600 ${size}px Inter,system-ui,sans-serif`;ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign="left";
  }
  function drawArrow(ctx,cx,cy,r,phasor,color,width=3){
    const x=cx+r*phasor.re,y=cy-r*phasor.im;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,width+2,0,Math.PI*2);ctx.fill();return{x,y};
  }
  function drawPanel(ctx,x,y,w,h,title,color){
    ctx.fillStyle="rgba(16,36,48,.42)";ctx.strokeStyle=COLORS.grid;ctx.lineWidth=1;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);label(ctx,title,x+12,y+21,color,10);
  }
  function drawPlane(ctx,cx,cy,r){
    ctx.strokeStyle=COLORS.grid;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.moveTo(cx-r-7,cy);ctx.lineTo(cx+r+7,cy);ctx.moveTo(cx,cy-r-7);ctx.lineTo(cx,cy+r+7);ctx.stroke();
    label(ctx,"HOLD",cx+r+9,cy+3,COLORS.muted,8);label(ctx,"POS",cx,cy-r-8,COLORS.muted,8,"center");label(ctx,"INACT",cx-r-9,cy+3,COLORS.muted,8,"right");label(ctx,"NEG",cx,cy+r+14,COLORS.muted,8,"center");
  }
  function drawCanvas(canvas,projection){
    const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=COLORS.bg;ctx.fillRect(0,0,canvas.width,canvas.height);
    label(ctx,`Euler · 3 primary readouts + 1 derived joint · g${projection.generation}`,28,28,COLORS.muted,12);
    const panels=[{x:24,y:48,name:"chemistry",title:"1 · CHEMISTRY"},{x:266,y:48,name:"life",title:"2 · LIFE"},{x:24,y:282,name:"physics",title:"3 · SPIN"},{x:266,y:282,name:"joint",title:"4 · DERIVED JOINT"}];
    panels.forEach(panel=>{
      const color=panel.name==="joint"?COLORS.aggregate:COLORS[panel.name];drawPanel(ctx,panel.x,panel.y,230,216,panel.title,color);const cx=panel.x+115,cy=panel.y+112,r=65;drawPlane(ctx,cx,cy,r);
      if(panel.name!=="joint"){
        const p=projection.domains[panel.name],end=drawArrow(ctx,cx,cy,r,p,color,4);label(ctx,`Z = ${format(p.re)} ${p.im<0?"−":"+"} ${format(Math.abs(p.im))}i`,panel.x+12,panel.y+198,color,9);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.arc(end.x,end.y,7,0,Math.PI*2);ctx.stroke();
      }else{
        NAMES.forEach(name=>{ctx.save();ctx.globalAlpha=.42;drawArrow(ctx,cx,cy,r,projection.domains[name],COLORS[name],2);ctx.restore()});const end=drawArrow(ctx,cx,cy,r,projection.aggregate,COLORS.aggregate,5);ctx.strokeStyle=COLORS.aggregate;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(end.x,end.y,9,0,Math.PI*2);ctx.stroke();label(ctx,"Z̄",end.x+9,end.y-6,COLORS.aggregate,11);label(ctx,"mean of 1 + 2 + 3",panel.x+12,panel.y+198,COLORS.aggregate,9);
      }
    });
    label(ctx,`Z̄ = ${format(projection.aggregate.re)} ${projection.aggregate.im<0?"−":"+"} ${format(Math.abs(projection.aggregate.im))}i · |Z̄| ${format(projection.aggregate.magnitude)}`,28,524,COLORS.text,13);
    const cards=[[`g${projection.generation}`,"CLOCK"],[`n${projection.clock.phase}`,"MOD 8"],[`c${projection.clock.primeChannel.k}=${projection.clock.primeChannel.channelValue}`,"PRIME CHANNEL"],[projection.clock.axisMode==="hinge"?"XI · 99":"JANUS · 100","AXIS"]];
    cards.forEach((item,index)=>{const x=28+index*121;ctx.fillStyle="rgba(16,36,48,.8)";ctx.strokeStyle=COLORS.grid;ctx.fillRect(x,548,108,66);ctx.strokeRect(x,548,108,66);label(ctx,item[1],x+10,569,COLORS.muted,9);label(ctx,item[0],x+10,596,index===3?COLORS.aggregate:COLORS.text,13)});
    label(ctx,"4 is derived: arithmetic centroid · no fourth world or operator",28,646,COLORS.aggregate,10);
    label(ctx,"e^{iθ} is a coordinate map · not a shared physical mechanism",28,667,COLORS.muted,10);
  }

  function init(doc=document){
    const canvas=doc.getElementById("eulerCanvas"),host=doc.getElementById("eulerMotor");if(!canvas||!host)return null;
    const $=id=>doc.getElementById(id),state={generation:0,phase:0,baseId:"euler",follow:true,snapshots:null};
    function renderRail(gear){const rail=$("eulerRail");rail.replaceChildren();for(let n=0;n<8;n++){const cell=doc.createElement("div");cell.className=n===state.phase?"is-active":"";cell.innerHTML=`<span>n${n}</span><b>${Gear.formatNumber(Math.pow(gear.base.value,n))}</b>`;rail.append(cell)}}
    function renderZeroLadder(gear){const rail=$("eulerZeroLadder");rail.replaceChildren();gear.zeroInsertion.sequence.forEach((value,n)=>{const cell=doc.createElement("i");cell.className=n===state.phase?"is-active":"";cell.textContent=String(value);rail.append(cell)})}
    function renderMotor(){
      const gear=Gear.buildState(state.baseId,state.phase),zero=gear.zeroInsertion.sequence[state.phase],axis=gear.primeAxis[state.generation%2===0?"hinge":"janus"],channel=Gear.primeChannelProjection(state.follow?state.generation:state.phase),baseLabel=gear.base.label;
      host.dataset.clock=state.follow?"three-domain":"local";
      $("eulerLivePath").dataset.mode=state.follow?"clock":"local";$("eulerGeneration").textContent=state.follow?`g${state.generation}`:"local";$("eulerN").textContent=`n${state.phase}`;
      $("eulerPower").textContent=`${baseLabel}^${state.phase} = ${Gear.formatNumber(gear.geometric.current)}`;$("eulerZeroValue").textContent=String(zero);$("eulerAxisValue").textContent=axis.id==="hinge"?"XI · 99":"JANUS · 100";
      $("eulerArithmetic").textContent=`${state.phase} → ${state.phase+1}`;$("eulerGeometric").textContent=`${Gear.formatNumber(gear.geometric.current)} → ${Gear.formatNumber(gear.geometric.next)}`;$("eulerOperator").textContent=`+1 ⇄ ${gear.base.step}`;
      $("eulerFormula").textContent=state.baseId==="euler"?"Gₙ=eⁿ · ln(Gₙ)=n":`Gₙ=${baseLabel}ⁿ · log_${baseLabel}(Gₙ)=n`;$("eulerPhase").value=String(state.phase);$("eulerPhaseValue").textContent=String(state.phase);
      $("eulerZeroTitle").textContent=String(zero);$("eulerAxisTitle").textContent=axis.id==="hinge"?"XI hinge · 97—99—101":"Janus axis · 97—100—103";$("eulerAxisCenter").textContent=String(axis.center);$("eulerAxisRight").textContent=String(axis.right);
      $("eulerPrimeChannel").textContent=`k${channel.k} · P${channel.primeOrdinal}=${channel.primeValue} · c${channel.k}=${channel.channelValue}${channel.base50GateActive?" · J50 GATE":""}`;
      renderRail(gear);renderZeroLadder(gear);doc.querySelectorAll("[data-euler-base]").forEach(button=>{const active=button.dataset.eulerBase===state.baseId;button.classList.toggle("is-active",active);button.setAttribute("aria-pressed",String(active))});return gear;
    }
    function renderProjection(){if(!state.snapshots)return;const projection=buildEulerView(state.snapshots,state.generation,state.baseId);drawCanvas(canvas,projection);$("eulerCoherence").textContent=format(projection.aggregate.magnitude);$("eulerEvents").textContent=String(projection.eventTotal);$("eulerZero").textContent=String(projection.gear.zeroInsertion.sequence[state.phase]);$("eulerAxis").textContent=state.generation%2===0?"XI · 99":"Janus · 100"}
    function render(){renderMotor();renderProjection()}
    function detach(){state.follow=false;$("eulerFollow").checked=false}
    doc.querySelectorAll("[data-euler-base]").forEach(button=>button.addEventListener("click",()=>{state.baseId=button.dataset.eulerBase;render()}));
    $("eulerPhase").addEventListener("input",()=>{detach();state.phase=Number($("eulerPhase").value);render()});
    $("eulerFollow").addEventListener("change",()=>{state.follow=$("eulerFollow").checked;if(state.follow)state.phase=state.generation%8;render()});
    $("eulerStep").addEventListener("click",()=>{if(state.follow&&$("step")){$("step").click();return}state.phase=(state.phase+1)%8;render()});
    window.addEventListener("threedomain:render",event=>{if(!event.detail)return;state.snapshots=event.detail.snapshots;state.generation=event.detail.generation;if(state.follow)state.phase=state.generation%8;render()});
    renderMotor();return Object.freeze({state,render,buildEulerView});
  }
  if(typeof document!=="undefined")init(document);
  return Object.freeze({eulerPhasor,buildEulerView,drawCanvas,init});
});
