(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0FiniteFieldCarrierAddon=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MAX_SAFE_Q=Number.MAX_SAFE_INTEGER;
  const ADDONS=Object.freeze([
    Object.freeze({id:'A0_WHITE_FOLD_AXIS',format:'LIVE_VIEW',status:'REUSE_NATIVE',role:'F=0 folding axis / seam / return carrier',path:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#asymptoticSeamApertureBridge'}),
    Object.freeze({id:'A0_BLUE_PEARL',format:'GLB',status:'REUSE_NATIVE',role:'pearl / carrier comparison view',path:'assets/models/machina-blue-pearl.glb'}),
    Object.freeze({id:'A0_TESSAREC_FOLD',format:'GLB',status:'REUSE_NATIVE',role:'fold comparison view',path:'assets/universal-machine-fam009/Universal_FieldArt_TessarecFold_v3.glb'}),
    Object.freeze({id:'LOTUS_DRIFT_TORUS',format:'OBJ',status:'SOURCE_BOUND_ADDON',role:'external fold / drift comparison asset',path:'Documents/GitHub/NEXAH-CODEX/.../Modul 03 – Lotus Drift Bridge/glb/Lotus_Drift_Torus.obj'}),
    Object.freeze({id:'LOTUS_DRIFT_BREATH',format:'GIF',status:'SOURCE_BOUND_ADDON',role:'external animated comparison asset',path:'Documents/GitHub/NEXAH-CODEX/.../Modul 03 – Lotus Drift Bridge/visuals/Lotus_Drift_Breath.gif'}),
    Object.freeze({id:'RA_TH_MOBIUS',format:'OBJ',status:'SOURCE_BOUND_ADDON',role:'external seam / fold comparison asset',path:'Documents/GitHub/NEXAH-CODEX/.../Modul 02 – RA·TH Standing Wave/glb/RA_TH_StandingWave_phiNodes_SaturnIo_Mobius.obj'})
  ]);
  const GLYPHS=Object.freeze([
    Object.freeze({glyph:'ö',unicode:'U+00F6',mark:'diaeresis',status:'LOCAL_ORIENTATION_OPEN'}),
    Object.freeze({glyph:'ô',unicode:'U+00F4',mark:'circumflex',status:'LOCAL_ORIENTATION_OPEN'}),
    Object.freeze({glyph:'ò',unicode:'U+00F2',mark:'grave',status:'LOCAL_ORIENTATION_OPEN'}),
    Object.freeze({glyph:'ó',unicode:'U+00F3',mark:'acute',status:'LOCAL_ORIENTATION_OPEN'}),
    Object.freeze({glyph:'õ',unicode:'U+00F5',mark:'tilde',status:'LOCAL_ORIENTATION_OPEN'}),
    Object.freeze({glyph:'œ',unicode:'U+0153',mark:'ligature',status:'PRESERVE_REGISTERED_SEAM_TRANSITION'}),
    Object.freeze({glyph:'ø',unicode:'U+00F8',mark:'stroke',status:'PRESERVE_REGISTERED_SPLIT_CUT'}),
    Object.freeze({glyph:'ō',unicode:'U+014D',mark:'macron',status:'LOCAL_MODE_OPEN'})
  ]);

  function isPrime(value){
    const n=Number(value);
    if(!Number.isInteger(n)||n<2)return false;
    if(n%2===0)return n===2;
    for(let divisor=3;divisor*divisor<=n;divisor+=2)if(n%divisor===0)return false;
    return true;
  }
  function finiteFieldClock(characteristic,extensionDegree=1){
    const p=Number(characteristic),b=Number(extensionDegree);
    if(!isPrime(p))throw new RangeError('p must be prime');
    if(!Number.isInteger(b)||b<1)throw new RangeError('b must be a positive integer');
    const q=p**b;
    if(!Number.isSafeInteger(q)||q>MAX_SAFE_Q)throw new RangeError('q exceeds the exact integer display range');
    return Object.freeze({p,b,q,field:`F_${q}`,law:'q=p^b',primeField:b===1,exactReturn:q===p**b});
  }
  function polynomialRootAudit(degree,observedRoots=0){
    const d=Number(degree),roots=Number(observedRoots);
    if(!Number.isInteger(d)||d<0)throw new RangeError('d must be a non-negative integer');
    if(!Number.isInteger(roots)||roots<0)throw new RangeError('observedRoots must be a non-negative integer');
    return Object.freeze({degree:d,observedRoots:roots,rootCeiling:d,admitted:roots<=d,scope:'NONZERO_UNIVARIATE_POLYNOMIAL_OVER_A_FIELD',claim:'at most d distinct roots'});
  }
  function audit(){
    return Object.freeze({
      schema:'nexah.a0.finite-field-carrier-addon/1',
      rule:'REUSE_WHITE_LINE_REFERENCE_ASSETS_ONLY',
      identities:Object.freeze({whiteLine:'A0_WHITE_FOLD_AXIS',finiteField:'q=p^b',rootCeiling:'roots<=d'}),
      addons:ADDONS,
      glyphs:GLYPHS,
      claims:Object.freeze({newBody:false,newWhiteLine:false,assetDuplication:false,riemannHypothesisProof:false,physicalGluing:false,glyphIdentityCollapse:false})
    });
  }
  function mount(doc=document){
    const host=doc.getElementById('finiteFieldCarrierAddon');
    if(!host)return null;
    const p=doc.getElementById('finiteFieldP'),b=doc.getElementById('finiteFieldB'),d=doc.getElementById('finiteFieldD'),roots=doc.getElementById('finiteFieldRoots');
    const qOut=doc.getElementById('finiteFieldQ'),fieldOut=doc.getElementById('finiteFieldName'),rootOut=doc.getElementById('finiteFieldRootAudit'),bars=doc.getElementById('finiteFieldPearls');
    const addonHost=doc.getElementById('finiteFieldAddonRegistry'),glyphHost=doc.getElementById('finiteFieldGlyphRegistry');
    function render(){
      let clock=null;
      try{clock=finiteFieldClock(p.value,b.value);qOut.textContent=String(clock.q);fieldOut.textContent=`${clock.field} · ${clock.law} · ${clock.primeField?'prime field':'extension field'}`;host.dataset.clock='valid';}
      catch(error){qOut.textContent='INVALID';fieldOut.textContent=error.message;host.dataset.clock='invalid';}
      let rootAudit;
      try{rootAudit=polynomialRootAudit(d.value,roots.value);rootOut.textContent=`${rootAudit.observedRoots} observed · ceiling ${rootAudit.rootCeiling} · ${rootAudit.admitted?'PASS':'REJECT'}`;}
      catch(error){rootOut.textContent=error.message;return;}
      const count=Math.min(120,rootAudit.rootCeiling),shown=Math.min(count,rootAudit.observedRoots);
      bars.innerHTML=Array.from({length:count},(_,index)=>`<i class="${index<shown?'is-root':''}" aria-hidden="true"></i>`).join('');
      bars.setAttribute('aria-label',`${rootAudit.observedRoots} observed roots against degree ceiling ${rootAudit.rootCeiling}`);
    }
    addonHost.innerHTML=ADDONS.map(item=>`<article class="${item.status==='REUSE_NATIVE'?'native':'addon'}"><small>${item.format} · ${item.status}</small><b>${item.id}</b><span>${item.role}</span><code>${item.path}</code></article>`).join('');
    glyphHost.innerHTML=GLYPHS.map(item=>`<span title="${item.unicode} · ${item.mark} · ${item.status}">${item.glyph}<small>${item.status.startsWith('PRESERVE')?'LOCK':'OPEN'}</small></span>`).join('');
    [p,b,d,roots].forEach(control=>control.addEventListener('input',render));
    render();
    return Object.freeze({render,audit});
  }
  if(typeof window!=='undefined'){
    const start=()=>mount();
    document.readyState==='loading'?window.addEventListener('DOMContentLoaded',start,{once:true}):start();
  }
  return Object.freeze({MAX_SAFE_Q,ADDONS,GLYPHS,isPrime,finiteFieldClock,polynomialRootAudit,audit,mount});
});
