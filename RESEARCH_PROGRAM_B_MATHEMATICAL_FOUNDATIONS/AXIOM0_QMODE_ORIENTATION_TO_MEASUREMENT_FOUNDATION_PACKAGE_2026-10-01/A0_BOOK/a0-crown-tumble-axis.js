(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0CrownTumbleAxis=api;
  if(typeof document!=="undefined"){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",api.mount);
    else api.mount();
  }
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const addresses=Object.freeze({ALPHA:2,DELTA:7,THETA:17,ZETA:19,IOTA:23});
  const rotate90=([x,y])=>[-y,x];
  const distance=([x,y])=>Math.hypot(x,y);
  const coefficient=(crownRadius,tumbleLength)=>crownRadius/tumbleLength;
  const classify=value=>value<0.9?"TALL / FALL-AXIS VIEW":value>1.1?"WIDE / CROWN VIEW":"BALANCED VIEW";
  const close=(a,b)=>Math.abs(a-b)<1e-12;
  const runChecks=()=>{
    const points=[[0,0],[2,3],[-7,17],[19,-23]];
    const rotated=points.map(rotate90);
    const returned=rotated.map(rotate90).map(rotate90).map(rotate90);
    const checks=[
      Object.keys(addresses).length===5,
      Object.values(addresses).join(",")==="2,7,17,19,23",
      coefficient(100,100)===1,
      coefficient(50,100)===0.5,
      coefficient(150,100)===1.5,
      classify(0.5)==="TALL / FALL-AXIS VIEW",
      classify(1)==="BALANCED VIEW",
      classify(1.5)==="WIDE / CROWN VIEW",
      points.every((point,index)=>close(distance(point),distance(rotated[index]))),
      points.every((point,index)=>close(point[0],returned[index][0])&&close(point[1],returned[index][1])),
      3**2===9,
      2**5===32
    ];
    return {checks,passed:checks.filter(Boolean).length,total:checks.length,pass:checks.every(Boolean)};
  };
  const mount=()=>{
    const stage=document.getElementById("crownTumbleAxis");
    if(!stage||stage.dataset.mounted==="true")return;
    stage.dataset.mounted="true";
    const crown=stage.querySelector("#ctCrownRadius");
    const tumble=stage.querySelector("#ctTumbleLength");
    const crownValue=stage.querySelector("#ctCrownRadiusValue");
    const tumbleValue=stage.querySelector("#ctTumbleLengthValue");
    const ratio=stage.querySelector("#ctRatio");
    const ratioClass=stage.querySelector("#ctRatioClass");
    const output=stage.querySelector("#ctOutput");
    const axisStar=stage.querySelector(".ct-axis-star");
    let tilt=0,phase=0;
    const render=()=>{
      const cr=Number(crown.value),tl=Number(tumble.value),pc=coefficient(cr,tl);
      crownValue.value=String(cr);crownValue.textContent=String(cr);
      tumbleValue.value=String(tl);tumbleValue.textContent=String(tl);
      ratio.textContent=`PC = ${pc.toFixed(3)}`;
      ratioClass.textContent=classify(pc);
      stage.dataset.phase=String(phase%3);
      stage.dataset.tilt=String(tilt);
      axisStar?.setAttribute("transform",`translate(510 214) rotate(${tilt})`);
    };
    [crown,tumble].forEach(input=>input.addEventListener("input",()=>{output.classList.remove("is-pass");render()}));
    stage.querySelector("[data-ct-rotate]")?.addEventListener("click",()=>{
      tilt=(tilt+90)%360;render();output.classList.remove("is-pass");
      output.textContent=`VIEW · R${tilt} · starre Achsendrehung; keine Zeit- oder Fallbewegung inferiert.`;
    });
    stage.querySelector("[data-ct-step]")?.addEventListener("click",()=>{
      phase=(phase+1)%3;render();output.classList.remove("is-pass");
      output.textContent=`DISPLAY PHASE ${phase}/2 · nur eine Visualisierungsspur; keine gemessene Dynamik.`;
    });
    stage.querySelector("[data-ct-return]")?.addEventListener("click",()=>{
      const result=runChecks();tilt=0;phase=0;crown.value="100";tumble.value="100";render();
      output.classList.toggle("is-pass",result.pass);
      output.textContent=result.pass
        ?`PASS · ${result.passed}/${result.total} · R90 normtreu · R90⁴ = Return · PC=1 · Adressen 2|7|17|19|23 · 3²=9 · 2⁵=32 · MOTION HOLD`
        :`FAIL · ${result.passed}/${result.total} deterministische Prüfungen bestanden.`;
    });
    render();
  };
  return {addresses,rotate90,distance,coefficient,classify,runChecks,mount};
});
