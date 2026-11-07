(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0Base11DriftCubeDock=api;
  if(root.document)root.addEventListener('DOMContentLoaded',()=>api.mount());
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const RECORDS={
    4774:{decimal:4774,base11:'3650',prefix:'365',drift:5,kind:'signal'},
    7447:{decimal:7447,base11:'5660',prefix:'566',drift:null,kind:'control'}
  };

  function toBase(value,base){
    if(!Number.isInteger(value)||value<0||!Number.isInteger(base)||base<2||base>36)throw new TypeError('non-negative integer and base 2..36 required');
    return value.toString(base).toUpperCase();
  }

  function fromBase(digits,base){
    const text=String(digits).toUpperCase();
    if(!/^[0-9A-Z]+$/.test(text))throw new TypeError('invalid digit word');
    return [...text].reduce((sum,glyph)=>{
      const digit=parseInt(glyph,36);
      if(digit>=base)throw new RangeError('digit outside base');
      return sum*base+digit;
    },0);
  }

  function audit(decimal){
    const base11=toBase(decimal,11);
    const record=RECORDS[decimal]||{decimal,base11,prefix:base11.slice(0,-1),drift:null,kind:'other'};
    return Object.assign({},record,{roundTrip:fromBase(base11,11),exact:fromBase(base11,11)===decimal});
  }

  function shellAudit(outer=12,inner=11){
    if(!Number.isInteger(outer)||!Number.isInteger(inner)||outer<=inner||inner<1)throw new TypeError('outer > inner >= 1 required');
    const outerVolume=outer**3;
    const innerVolume=inner**3;
    return {outer,inner,offset:outer-inner,outerVolume,innerVolume,shellVolume:outerVolume-innerVolume};
  }

  function verify(){
    const signal=audit(4774),control=audit(7447),shell=shellAudit();
    return {
      pass:signal.base11==='3650'&&signal.roundTrip===4774&&control.base11==='5660'&&control.roundTrip===7447&&fromBase('365',11)===fromBase('360',11)+5&&4774===11*fromBase('365',11)&&shell.shellVolume===397,
      signal,control,shell
    };
  }

  function cubeSvg(){
    return '<svg viewBox="0 0 560 410" role="img" aria-label="Deklarierte 12 zu 11 Gegenhülle mit gemeinsamem Ursprung und fünf Residualmarken">'+
      '<g class="b11-shell b11-shell-outer"><path d="M95 106 287 42 468 126 271 198Z"/><path d="M95 106 271 198 271 365 95 264Z"/><path d="M271 198 468 126 468 286 271 365Z"/></g>'+
      '<g class="b11-shell b11-shell-inner"><path d="M125 124 287 70 438 140 272 201Z"/><path d="M125 124 272 201 272 338 125 253Z"/><path d="M272 201 438 140 438 270 272 338Z"/></g>'+
      '<path class="b11-offset" d="M95 106 125 124M468 126 438 140M271 365 272 338"/>'+
      '<g class="b11-origin"><circle cx="272" cy="201" r="9"/><path d="M272 201H350M272 201V280M272 201 218 176"/></g>'+
      '<g class="b11-drift-marks"><circle cx="355" cy="182" r="5"/><circle cx="374" cy="175" r="5"/><circle cx="393" cy="168" r="5"/><circle cx="412" cy="161" r="5"/><circle cx="431" cy="154" r="5"/></g>'+
      '<text x="88" y="91">12³ · VIEW SHELL</text><text x="301" y="88">11³ · INNER COUNTER-CUBE</text><text x="286" y="222">O₀ · coordinate choice</text><text x="348" y="150">V / +5 residual</text>'+
    '</svg>';
  }

  function render(root,decimal){
    const record=audit(decimal),isSignal=record.kind==='signal';
    root.dataset.record=String(decimal);
    root.querySelectorAll('[data-b11-record]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.b11Record)===decimal)));
    root.querySelector('[data-b11-decimal]').textContent=record.decimal+'₁₀';
    root.querySelector('[data-b11-base]').textContent=record.base11+'₁₁';
    root.querySelector('[data-b11-equation]').textContent=isSignal?'4774₁₀ = 3650₁₁ = 11 × 365₁₁':'7447₁₀ = 5660₁₁';
    root.querySelector('[data-b11-drift]').textContent=isSignal?'365₁₁ = 360₁₁ + 5':'CONTROL · kein 365-Präfix';
    root.querySelector('[data-b11-state]').textContent=isSignal?'EXACT +5 RESIDUAL':'CONTROL · NO 365 LENS';
    root.querySelector('[data-b11-state]').className='b11-state '+(isSignal?'is-signal':'is-control');
    root.querySelector('[data-b11-explain]').textContent=isSignal?
      'Die letzte Null macht 365₁₁ zum Elfer-Faktor: 3650₁₁ = 11 × 365₁₁. Innerhalb dieses Base-11-Worts ist +5 der exakte Abstand von 360₁₁ zu 365₁₁.':
      'Die gespiegelte Dezimalzahl ist ein harter Comparator. Ihr korrektes Base-11-Wort lautet 5660₁₁; es trägt weder das Präfix 365 noch denselben +5-Residualvertrag.';
  }

  function mount(){
    document.querySelectorAll('[data-base11-drift-cube]').forEach(root=>{
      if(root.dataset.mounted==='true')return;
      root.dataset.mounted='true';
      root.querySelector('[data-b11-cube]').innerHTML=cubeSvg();
      root.querySelectorAll('[data-b11-record]').forEach(button=>button.addEventListener('click',()=>render(root,Number(button.dataset.b11Record))));
      root.querySelector('[data-b11-reset]').addEventListener('click',()=>render(root,4774));
      render(root,4774);
    });
  }

  return {RECORDS,toBase,fromBase,audit,shellAudit,verify,cubeSvg,mount};
});
