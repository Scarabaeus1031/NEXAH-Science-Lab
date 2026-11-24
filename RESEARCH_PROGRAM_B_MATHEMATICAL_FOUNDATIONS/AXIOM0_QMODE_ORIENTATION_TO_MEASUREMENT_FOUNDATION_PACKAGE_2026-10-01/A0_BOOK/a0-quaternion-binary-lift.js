(() => {
  const powers = [[1,0,0,0],[1,1,1,1],[-2,2,2,2],[-8,0,0,0],[-8,-8,-8,-8],[16,-16,-16,-16],[64,0,0,0]];
  const labels = ["1","1+i+j+k","−2+2i+2j+2k","−8","−8−8i−8j−8k","16−16i−16j−16k","64"];
  const stateLabels = ["positive scalar start","four-channel expansion","signed tetra-channel state","opposite scalar return","four-channel re-expansion","signed tetra-channel state","positive orientation return"];
  const root = document.getElementById("quaternion-binary-lift-demonstrator");
  if (!root) return;
  const slider = root.querySelector("#qblStep"), stepOutput = root.querySelector("#qblStepOutput"), ladder = root.querySelector("#qblLadder"), playButton = root.querySelector('[data-action="play"]');
  const axes = ["Re","I","J","K"], directions = [[1,0],[0,-1],[Math.SQRT1_2,-Math.SQRT1_2],[-Math.SQRT1_2,-Math.SQRT1_2]];
  let timer = null;
  powers.forEach((_,n) => { const step=document.createElement("div"); step.className="qbl-demo__step"; step.dataset.step=String(n); step.innerHTML=`<span>n=${n}</span><b>${2501*(2**n)}</b>`; ladder.appendChild(step); });
  const setBar=(axis,value,scale)=>{const fill=root.querySelector(`#qblBar${axis}`),output=root.querySelector(`#qblOut${axis}`),width=Math.abs(value)/scale*50;fill.style.width=`${width}%`;fill.style.left=value<0?`${50-width}%`:"50%";output.value=String(value);};
  const stop=()=>{if(timer)clearInterval(timer);timer=null;playButton.textContent="Play";playButton.setAttribute("aria-pressed","false");};
  const render=requested=>{const n=Math.max(0,Math.min(6,Number(requested))),tuple=powers[n],scale=Math.max(1,...tuple.map(Math.abs));slider.value=String(n);stepOutput.value=String(n);root.querySelector("#qblStepState").textContent=`Step n=${n}`;root.querySelector("#qblStateClass").textContent=stateLabels[n];root.querySelector("#qblTuple").textContent=`(${tuple.join(", ")})`;root.querySelector("#qblPower").textContent=`qB${["⁰","¹","²","³","⁴","⁵","⁶"][n]} = ${labels[n]}`;root.querySelector("#qblMagnitude").textContent=`|qB${["⁰","¹","²","³","⁴","⁵","⁶"][n]}| = ${2**n}`;root.querySelector("#qblCarrier").textContent=String(2501*(2**n));root.querySelector("#qblNorm").textContent=String(4**n);axes.forEach((axis,index)=>setBar(axis,tuple[index],scale));tuple.forEach((value,index)=>{const length=value/scale*136,x=310+directions[index][0]*length,y=198+directions[index][1]*length,axis=axes[index],line=root.querySelector(`#qblVec${axis}`),node=root.querySelector(`#qblNode${axis}`);line.setAttribute("x2",x.toFixed(2));line.setAttribute("y2",y.toFixed(2));node.setAttribute("cx",x.toFixed(2));node.setAttribute("cy",y.toFixed(2));});root.querySelector("#qblReturn").innerHTML=n===3?"<strong>n=3:</strong> qB³=−8. Exakte skalare Gegenseite; der Vektorteil ist null.":n===6?"<strong>n=6:</strong> qB⁶=64. Positive skalare Orientierung kehrt zurück; der Betrag ist 64-fach.":n===0?"<strong>Start:</strong> positive scalar axis; no return has occurred.":"<strong>Transit:</strong> Vektoranteile sind aktiv; noch kein skalarer Return.";ladder.querySelectorAll(".qbl-demo__step").forEach(step=>Number(step.dataset.step)===n?step.setAttribute("aria-current","step"):step.removeAttribute("aria-current"));};
  root.querySelector('[data-action="previous"]').addEventListener("click",()=>{stop();render(Number(slider.value)-1);});
  root.querySelector('[data-action="next"]').addEventListener("click",()=>{stop();render(Number(slider.value)+1);});
  slider.addEventListener("input",()=>{stop();render(slider.value);});
  playButton.addEventListener("click",()=>{if(timer){stop();return;}playButton.textContent="Pause";playButton.setAttribute("aria-pressed","true");timer=setInterval(()=>render((Number(slider.value)+1)%7),900);});
  render(0);
})();
