(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0LanternHeartColorBridge=api;
  if(typeof document!=="undefined"){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",api.mount);
    else api.mount();
  }
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const complements=Object.freeze({
    R:Object.freeze({residual:"CYAN",vector:Object.freeze([0,1,1])}),
    G:Object.freeze({residual:"MAGENTA",vector:Object.freeze([1,0,1])}),
    B:Object.freeze({residual:"YELLOW",vector:Object.freeze([1,1,0])})
  });
  const candidates=Object.freeze({
    lantern:Object.freeze({pass:"source/GLB replay, finite envelope, hinge/bearing detail, external actuator route, continuous clearance certificate, housing and kinematic prototype",hold:"load / fatigue / wear / thermal / torque / fastener / fabrication release"}),
    heart:Object.freeze({pass:"declared pivot role",hold:"physical drive"}),
    lymph:Object.freeze({pass:"address and axis contract",hold:"physical or biological coupling"}),
    color:Object.freeze({pass:"discrete RGB to CMY complement",hold:"calibrated spectrum"}),
    axis:Object.freeze({pass:"R90 fourth-power return",hold:"measured motion"})
  });
  const bridge=channel=>{
    const key=String(channel).toUpperCase();
    if(!Object.hasOwn(complements,key))throw new Error("channel must be R, G, or B");
    const item=complements[key];
    return Object.freeze({missing:key,residual:item.residual,vector:item.vector,restore:`+${key} → RGB`});
  };
  const runChecks=()=>{
    const r=bridge("R"),g=bridge("G"),b=bridge("B");
    const checks=[
      r.residual==="CYAN",JSON.stringify(r.vector)==="[0,1,1]",r.restore==="+R → RGB",
      g.residual==="MAGENTA",JSON.stringify(g.vector)==="[1,0,1]",g.restore==="+G → RGB",
      b.residual==="YELLOW",JSON.stringify(b.vector)==="[1,1,0]",b.restore==="+B → RGB",
      !Object.hasOwn(complements,"K"),
      Object.keys(candidates).join(",")==="lantern,heart,lymph,color,axis",
      Object.values(candidates).every(candidate=>candidate.pass&&candidate.hold),
      candidates.lantern.hold.includes("fabrication release"),
      candidates.heart.hold==="physical drive",
      candidates.lymph.hold.includes("biological"),
      candidates.color.hold==="calibrated spectrum",
      candidates.axis.hold==="measured motion"
    ];
    return Object.freeze({checks:Object.freeze(checks),passed:checks.filter(Boolean).length,total:checks.length,pass:checks.every(Boolean)});
  };
  const mount=()=>{
    const host=document.getElementById("lanternHeartColorBridge");
    if(!host||host.dataset.mounted==="true")return;
    host.dataset.mounted="true";
    const input=host.querySelector("#bcpInput"),residual=host.querySelector("#bcpResidual"),returned=host.querySelector("#bcpReturn"),output=host.querySelector("#bcpOutput");
    const render=channel=>{
      const state=bridge(channel);host.dataset.channel=state.missing;
      input.textContent=`RGB − ${state.missing}`;residual.textContent=state.residual;returned.textContent=state.restore;
      host.querySelectorAll("[data-bcp-channel]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.bcpChannel===state.missing)));
      output.classList.remove("is-pass");output.textContent=`VIEW · −${state.missing} → ${state.residual} · K separat · Carrier unverändert.`;
    };
    host.querySelectorAll("[data-bcp-channel]").forEach(button=>button.addEventListener("click",()=>render(button.dataset.bcpChannel)));
    host.querySelector("[data-bcp-lantern-run]")?.addEventListener("click",()=>{
      const replay=globalThis.A0LanternCrownReplay?.runReplay();
      const lanternOutput=host.querySelector("#bcpLanternOutput");
      if(!replay){lanternOutput.textContent="FAIL · Source-Replay-Modul fehlt.";return;}
      lanternOutput.classList.toggle("is-pass",replay.pass);
      lanternOutput.textContent=replay.pass
        ?`PASS · ${replay.passed}/${replay.total} · 121 FRAMES · MAX LEG ${replay.maxLegError.toExponential(2)} · CONTACT ${replay.maxContactError.toExponential(2)} · RETURN ${replay.maxReturnError.toExponential(2)} · MECHANISM HOLD`
        :`FAIL · ${replay.passed}/${replay.total} Source-Replay-Prüfungen bestanden.`;
    });
    host.querySelector("[data-bcp-envelope-run]")?.addEventListener("click",()=>{
      const envelope=globalThis.A0LanternCrownEnvelope?.runEnvelope();
      const envelopeOutput=host.querySelector("#bcpEnvelopeOutput");
      if(!envelope){envelopeOutput.textContent="FAIL · Finite-Envelope-Modul fehlt.";return;}
      envelopeOutput.classList.toggle("is-pass",envelope.pass);
      envelopeOutput.textContent=envelope.pass
        ?`PASS · ${envelope.passed}/${envelope.total} · STOP ${envelope.safeAngleDegrees.toFixed(2)}° · RESTÖFFNUNG ${(envelope.safeApertureDiameter*100).toFixed(2)} mm · FIXED CLEARANCE ${(envelope.minOperatingFixedGap*100).toFixed(2)} mm · CONTINUOUS HOLD`
        :`FAIL · ${envelope.passed}/${envelope.total} Hüllenprüfungen bestanden.`;
    });
    host.querySelector("[data-bcp-engineering-run]")?.addEventListener("click",()=>{
      const engineering=globalThis.A0LanternHingeActuatorEngineering?.runEngineering();
      const engineeringOutput=host.querySelector("#bcpEngineeringOutput");
      if(!engineering){engineeringOutput.textContent="FAIL · Engineering-Modul fehlt.";return;}
      engineeringOutput.classList.toggle("is-pass",engineering.pass);
      engineeringOutput.textContent=engineering.pass
        ?`PASS · ${engineering.passed}/${engineering.total} · CONTINUOUS ≥${engineering.certificate.certifiedPairClearanceMillimetres.toFixed(3)} mm · STOP ${engineering.geometry.operatingStopDegrees.toFixed(2)}° · APERTUR ${engineering.geometry.stopApertureDiameterMillimetres.toFixed(2)} mm · HOUSING ${engineering.geometry.housingRadialMarginMillimetres.toFixed(2)}/${engineering.geometry.housingTopMarginMillimetres.toFixed(2)} mm · LOAD HOLD`
        :`FAIL · ${engineering.passed}/${engineering.total} Engineering-Verträge bestanden.`;
    });
    host.querySelector("[data-bcp-run]")?.addEventListener("click",()=>{
      const result=runChecks(),lantern=globalThis.A0LanternCrownReplay?.runReplay(),envelope=globalThis.A0LanternCrownEnvelope?.runEnvelope(),engineering=globalThis.A0LanternHingeActuatorEngineering?.runEngineering();
      const pass=result.pass&&lantern?.pass&&envelope?.pass&&engineering?.pass;output.classList.toggle("is-pass",pass);
      output.textContent=pass
        ?`PASS · PACKAGE ${result.passed}/${result.total} · REPLAY ${lantern.passed}/${lantern.total} · ENVELOPE ${envelope.passed}/${envelope.total} · ENGINEERING ${engineering.passed}/${engineering.total} · STOP ${engineering.geometry.operatingStopDegrees.toFixed(2)}° · RGB↔CMY 9/9 · LOAD + FOUR DOMAIN HOLDS`
        :`FAIL · PACKAGE ${result.passed}/${result.total} · REPLAY ${lantern?.passed||0}/${lantern?.total||0} · ENVELOPE ${envelope?.passed||0}/${envelope?.total||0} · ENGINEERING ${engineering?.passed||0}/${engineering?.total||0}.`;
    });
    render("R");
  };
  return Object.freeze({complements,candidates,bridge,runChecks,mount});
});
