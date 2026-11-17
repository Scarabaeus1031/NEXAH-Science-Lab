(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports) module.exports=api;
  root.A0MissingCondition=api;
  if(root.document){
    const start=()=>api.mount(root.document);
    if(root.document.readyState==="loading") root.document.addEventListener("DOMContentLoaded",start,{once:true}); else start();
  }
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const STAGES=[
    {key:"inside",label:"01 · INSIDE",title:"You are already inside.",copy:"Das Ei ist kein Gegenstand vor dir. Es ist zunächst die Welt, die den Körper hält. Orientierung beginnt, indem der Beobachter seine eigene Position im Feld erklärt.",formula:"HUMAN VIEW = FIELD + SITUATED BODY"},
    {key:"hedge",label:"02 · HEDGE",title:"A boundary holds potential.",copy:"Die Schale trennt Innen und Außen, ohne beide aus derselben Geschichte zu lösen. Sie schützt, begrenzt und macht eine spätere Passage überhaupt erst lesbar.",formula:"A · EGG = INSIDE | BOUNDARY | OUTSIDE"},
    {key:"hinge",label:"03 · HINGE",title:"The crack changes the contract.",copy:"Der Crack ist die lokale Apertur. Er zerstört nicht einfach eine Form; er verändert, was innen, außen, offen und passierbar bedeutet.",formula:"A —[ Bε · CRACK ]→ A′"},
    {key:"passage",label:"04 · PASSAGE",title:"The bird orients within the field.",copy:"Das Chicken ist nicht mit dem Ei identisch, aber es liegt auch nicht außerhalb seiner Geschichte. Als Vogel wird es zur Orientierungsfigur: Körper, Feld, Richtung und erinnerte Spur bleiben relational lesbar. Das ist eine Human-View-Metapher, keine neue Theorie biologischer Navigation.",formula:"Ω(A) —[ Q° · R° · T° ]→ A′ · ORIENTATION = BODY · FIELD · DIRECTION · TRACE"},
    {key:"receipt",label:"05 · RECEIPT",title:"Life In Transition.",copy:"Nicht eine Sache erklärt den Übergang. Wir halten fest, was blieb, was verloren ging, was die Darstellung einführte und was weiterhin unbekannt ist — und entscheiden erst danach über STOP oder CONTINUE.",formula:"LIT = LIFE IN TRANSITION · I/L/A/U → STOP | CONTINUE"}
  ];
  function mount(doc){
    const host=doc.getElementById("missing-condition");
    if(!host) return null;
    const stage=host.querySelector("[data-mc-stage]");
    const title=doc.getElementById("mcStageTitle");
    const copy=doc.getElementById("mcStageCopy");
    const formula=doc.getElementById("mcStageFormula");
    const count=doc.getElementById("mcStageCount");
    const buttons=[...host.querySelectorAll("[data-mc-go]")];
    let index=0;
    function render(next){
      index=Math.max(0,Math.min(STAGES.length-1,Number(next)||0));
      const item=STAGES[index];
      stage.dataset.mcStage=item.key;
      title.textContent=item.title;
      copy.textContent=item.copy;
      formula.textContent=item.formula;
      count.textContent=String(index+1).padStart(2,"0")+" / "+String(STAGES.length).padStart(2,"0");
      buttons.forEach(button=>button.setAttribute("aria-pressed",String(Number(button.dataset.mcGo)===index)));
      return item;
    }
    buttons.forEach(button=>button.addEventListener("click",()=>render(button.dataset.mcGo)));
    doc.getElementById("mcPrevious").addEventListener("click",()=>render(index-1));
    doc.getElementById("mcNext").addEventListener("click",()=>render(index+1));
    render(0);
    return{get index(){return index},render};
  }
  return{STAGES,mount};
});
