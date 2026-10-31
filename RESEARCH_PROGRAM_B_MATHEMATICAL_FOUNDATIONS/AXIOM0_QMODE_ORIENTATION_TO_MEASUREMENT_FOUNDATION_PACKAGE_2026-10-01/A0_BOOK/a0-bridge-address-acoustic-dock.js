(function(root,factory){
  const acoustic=typeof module==='object'&&module.exports?require('./a0-acoustic-source-projection.js'):root.A0AcousticSourceProjection;
  const api=factory(acoustic);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0BridgeAddressAcousticDock=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Acoustic){
  'use strict';
  const BASES=Object.freeze([2,3,4,5,6,8,10,11,12,16,20,24]);
  const DIGITS='0123456789ABCDEFGHIJKLMN';
  const mod=(value,modulus)=>((Math.trunc(Number(value))%Number(modulus))+Number(modulus))%Number(modulus);
  function baseWord(value,base){
    const n=Math.trunc(Number(value)),b=Math.trunc(Number(base));
    if(!Number.isSafeInteger(n)||n<0)throw new RangeError('value must be a non-negative safe integer');
    if(!BASES.includes(b))throw new RangeError('unsupported address base');
    if(n===0)return '0';
    let rest=n,word='';
    while(rest>0){word=DIGITS[rest%b]+word;rest=Math.floor(rest/b)}
    return word;
  }
  function state(sample=0,base=12,modulus=2){
    const n=Math.max(0,Math.trunc(Number(sample))||0),b=Number(base),m=Math.max(1,Math.trunc(Number(modulus))||1);
    const railIndex=mod(n,24),opposite=mod(railIndex+12,24),phase11=mod(n,11);
    const step=Acoustic.walkerStep(railIndex,true,24);
    return Object.freeze({
      schema:'nexah.a0.bridge-address-acoustic-dock/1.0.0',carrier:n,
      base:b,baseWord:baseWord(n,b),modulus:m,residue:mod(n,m),phase11,
      railIndex,opposite,pitchClass:Acoustic.pitchClass(railIndex),note:Acoustic.noteName(railIndex),
      fifthClass:mod(Acoustic.pitchClass(railIndex)+7,12),passage:step.passage,passageStatus:step.status,
      source:'A0_ACOUSTIC_SOURCE_PROJECTION_RETURN_V1',measuredInput:false,commonCarrier:false
    });
  }
  function svg(s){
    const socketX=index=>54+index*66;
    const railX=index=>54+index*(726/23);
    const sockets=Array.from({length:11},(_,index)=>`<circle cx="${socketX(index)}" cy="58" r="${index===s.phase11?12:7}" class="bad-socket${index===s.phase11?' active':''}"/><text x="${socketX(index)}" y="32" class="bad-small">${index}</text>`).join('');
    const rays=Array.from({length:24},(_,index)=>`<line x1="417" y1="286" x2="${railX(index)}" y2="218" class="bad-ray${index===s.railIndex?' source':index===s.opposite?' opposite':''}"/>`).join('');
    return `<line x1="54" y1="58" x2="714" y2="58" class="bad-phase-rail"/>${sockets}<text x="384" y="96" class="bad-label">SP · PHASE ${s.phase11}/11</text><path d="M190 132 L384 175 L578 132 Z" class="bad-triad"/><circle cx="190" cy="132" r="25" class="bad-node base"/><circle cx="384" cy="175" r="25" class="bad-node mod"/><circle cx="578" cy="132" r="25" class="bad-node sp"/><text x="190" y="138" class="bad-node-text">B${s.base}</text><text x="384" y="181" class="bad-node-text">r${s.residue}</text><text x="578" y="138" class="bad-node-text">SP</text><line x1="54" y1="218" x2="780" y2="218" class="bad-lyra-rail"/>${rays}<circle cx="${railX(s.railIndex)}" cy="218" r="9" class="bad-pole source"/><circle cx="${railX(s.opposite)}" cy="218" r="9" class="bad-pole opposite"/><circle cx="417" cy="286" r="10" class="bad-apex"/><text x="417" y="324" class="bad-label">LYRA · ${String(s.railIndex).padStart(2,'0')} ↔ ${String(s.opposite).padStart(2,'0')} · ${s.note}</text>`;
  }
  function mount(doc=document){
    const host=doc.querySelector('[data-bad-dock]');if(!host)return null;
    const step=doc.querySelector('[data-tfc-step]'),base=host.querySelector('[data-bad-base]'),graphic=host.querySelector('[data-bad-svg]');
    const outputs={word:host.querySelector('[data-bad-word]'),mod:host.querySelector('[data-bad-mod]'),phase:host.querySelector('[data-bad-phase]'),rail:host.querySelector('[data-bad-rail]'),status:host.querySelector('[data-bad-status]')};
    let modulus=2;
    function render(){
      const s=state(step?step.value:0,base.value,modulus);
      graphic.innerHTML=svg(s);
      outputs.word.textContent=`${s.carrier}₁₀ = ${s.baseWord} (BASE ${s.base})`;
      outputs.mod.textContent=`${s.carrier} mod ${s.modulus} = ${s.residue}`;
      outputs.phase.textContent=`SP ${s.phase11}/11 · display phase only`;
      outputs.rail.textContent=`rail:${String(s.railIndex).padStart(2,'0')} ↔ ${String(s.opposite).padStart(2,'0')} · ${s.note} · +7→${Acoustic.NOTE_NAMES[s.fifthClass]}`;
      outputs.status.textContent=`SOURCE-BOUND · ${s.passageStatus} ${s.passage} · MEASURED INPUT OPEN`;
      host.dataset.phase=String(s.phase11);return s;
    }
    base.addEventListener('change',render);
    if(step){step.addEventListener('input',render);step.addEventListener('change',render)}
    doc.addEventListener('a0:bvr-change',event=>{modulus=event.detail.modulus;render()});
    render();return Object.freeze({render,getState:render});
  }
  return Object.freeze({BASES,DIGITS,baseWord,state,svg,mount});
});
