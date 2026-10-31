(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0BridgeViewRack=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MODULI=Object.freeze([2,3,4,5,6,12,20]);
  const residue=(n,m)=>((Number(n)%Number(m))+Number(m))%Number(m);
  const hue=(r,m)=>Math.round((r/Math.max(1,m))*300+8);
  const project=(n,m)=>Object.freeze({sample:Number(n),modulus:Number(m),residue:residue(n,m)});
  function mount(doc){
    const rack=doc&&doc.querySelector('[data-bvr-rack]');
    if(!rack)return null;
    const step=doc.querySelector('[data-tfc-step]');
    const status=doc.querySelector('[data-bvr-status]');
    const viewOut=doc.querySelector('[data-bvr-view]');
    const sampleOut=doc.querySelector('[data-bvr-sample]');
    let selected=2;
    function currentSample(){return step?Number(step.value)||0:0;}
    function render(){
      const n=currentSample();
      rack.innerHTML=MODULI.map(m=>{
        const cells=Array.from({length:60},(_,i)=>`<i class="bvr-cell${i===n?' current':''}" style="--bvr-h:${hue(residue(i,m),m)}" title="n=${i} · r=${residue(i,m)}"></i>`).join('');
        return `<button type="button" class="bvr-card" data-bvr-mod="${m}" aria-pressed="${m===selected}"><h4>MOD ${m}</h4><span class="bvr-grid">${cells}</span><p>60 → ${m} Restklassen</p></button>`;
      }).join('');
      const p=project(n,selected);
      if(status)status.textContent=`MOD ${p.modulus} · n=${p.sample} → r=${p.residue}`;
      if(viewOut)viewOut.textContent=`MOD ${p.modulus} · ${p.modulus} RESIDUES`;
      if(sampleOut)sampleOut.textContent=`n=${p.sample} · r=${p.residue} · receipt (${p.sample},${p.modulus},${p.residue})`;
      const view=doc.defaultView;
      if(view&&typeof view.CustomEvent==='function')doc.dispatchEvent(new view.CustomEvent('a0:bvr-change',{detail:p}));
    }
    rack.addEventListener('click',event=>{const button=event.target.closest('[data-bvr-mod]');if(!button)return;selected=Number(button.dataset.bvrMod);render();});
    if(step){step.addEventListener('input',render);step.addEventListener('change',render);}
    render();
    return Object.freeze({render,getState:()=>project(currentSample(),selected)});
  }
  return Object.freeze({MODULI,residue,hue,project,mount});
});
