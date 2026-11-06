(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0AlgoEightFloor=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const mod=(value,base)=>((value%base)+base)%base;
  const toBase=(value,base,width=1)=>mod(value,8).toString(base).padStart(width,'0');
  const state=(floor=0,face=1)=>{
    const f=mod(Number(floor)||0,8);
    const side=f===0&&Number(face)<0?-1:1;
    return {
      floor:f,
      face:side,
      binary:toBase(f,2,3),
      ternary:toBase(f,3,2),
      role:side<0?'RED SHADOW MEMORY':'ORANGE FLOOR / VISIBLE',
      address:side<0?'ALGO·F0·−1 · KG 1/−12':'ALGO·F'+f+'·+1'
    };
  };
  const createHost=()=>{
    const anchor=document.getElementById('heptad14Orientation')||document.querySelector('.cube-nav-rail');
    if(!anchor)return null;
    const host=document.createElement('section');
    host.className='algo8';
    host.id='algoEightFloorRegister';
    host.setAttribute('aria-labelledby','algoEightFloorTitle');
    host.innerHTML='<header><div><span class="eyebrow">ALGO REGISTER · SAME CARRIER</span><h3 id="algoEightFloorTitle">Acht Floors · Orange Entry · Red Shadow</h3><p>Ein lokales 0–7-Register mit binärer und trinärer Anzeige. Nur der unterste Floor besitzt die explizite ±1-Seitenlesung.</p></div><span class="algo8-status">VIEW / ADDRESS LAYER<br>GLB UNCHANGED</span></header><div class="algo8-grid"><div class="algo8-stack" aria-label="Acht wählbare ALGO Floors"><div class="algo8-herringbone" aria-hidden="true"></div></div><div class="algo8-panel"><div class="algo8-readout" aria-live="polite"><div><small>FLOOR</small><b data-a8-readout="floor">F0 / 7</b></div><div><small>FACE</small><b data-a8-readout="face">+1 · VISIBLE</b></div><div><small>BINARY</small><b data-a8-readout="binary">000₂</b></div><div><small>TERNARY</small><b data-a8-readout="ternary">00₃</b></div><div><small>ROLE</small><b data-a8-readout="role">ORANGE FLOOR</b></div><div><small>ADDRESS</small><b data-a8-readout="address">ALGO·F0·+1</b></div></div><div class="algo8-channel" aria-label="Deklarierter Farbkanal"><span class="algo8-black">BLACK<br>SLOT</span><span class="algo8-red">RED<br>THRESHOLD</span><span class="algo8-gold">GOLD<br>RETURN</span></div><div class="algo8-controls"><button type="button" data-a8-step="down">− FLOOR</button><button type="button" data-a8-face="shadow" aria-pressed="false">−1 SHADOW</button><button type="button" data-a8-face="visible" aria-pressed="true">+1 FLOOR</button><button type="button" data-a8-step="up">+ FLOOR</button></div><p class="algo8-boundary"><b>Vertrag:</b> F0…F7 sind acht Ansichten desselben ALGO-Registers. <code>+1</code> bezeichnet die sichtbare Orange-Floor-Seite; <code>−1 · KG · 1/−12</code> bezeichnet ausschließlich die untere Red-Shadow-Linse. Black ist Slot, Red Schwelle, Gold Return. Farben sind Rollen, keine zusätzlichen Floors.</p><div class="algo8-links"><a href="../../../A0_PINK_DIAMOND_GRID_ATLAS.html">Orange Floor Source ↗</a><a href="../../../results/a0-ioi-algo-eight-floor-register-return-2026-11-05.json">Register Receipt ↗</a></div></div></div>';
    anchor.insertAdjacentElement('afterend',host);
    return host;
  };
  const mount=()=>{
    const host=document.getElementById('algoEightFloorRegister')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    const stack=host.querySelector('.algo8-stack');
    const herringbone=stack.querySelector('.algo8-herringbone');
    for(let floor=7;floor>=0;floor--){
      const button=document.createElement('button');
      button.type='button';
      button.className='algo8-floor';
      button.dataset.floor=String(floor);
      button.setAttribute('aria-pressed',String(floor===0));
      button.innerHTML='<b>F'+floor+'</b><span></span><small>'+toBase(floor,2,3)+'₂ · '+toBase(floor,3,2)+'₃</small>';
      stack.insertBefore(button,herringbone);
    }
    const shadow=document.createElement('div');
    shadow.className='algo8-shadow';
    shadow.innerHTML='<b>F0−</b><span>RED SHADOW MEMORY</span><small>KG · 1/−12</small>';
    stack.insertBefore(shadow,herringbone);
    const floorButtons=[...host.querySelectorAll('[data-floor]')];
    const shadowButton=host.querySelector('[data-a8-face="shadow"]');
    const visibleButton=host.querySelector('[data-a8-face="visible"]');
    let floor=0;
    let face=1;
    const draw=()=>{
      const current=state(floor,face);
      floor=current.floor;
      face=current.face;
      floorButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.floor)===floor)));
      shadowButton.setAttribute('aria-pressed',String(face<0));
      visibleButton.setAttribute('aria-pressed',String(face>0));
      host.querySelector('[data-a8-readout="floor"]').textContent='F'+floor+' / 7';
      host.querySelector('[data-a8-readout="face"]').textContent=face<0?'−1 · SHADOW':'+1 · VISIBLE';
      host.querySelector('[data-a8-readout="binary"]').textContent=current.binary+'₂';
      host.querySelector('[data-a8-readout="ternary"]').textContent=current.ternary+'₃';
      host.querySelector('[data-a8-readout="role"]').textContent=current.role;
      host.querySelector('[data-a8-readout="address"]').textContent=current.address;
    };
    floorButtons.forEach(button=>button.addEventListener('click',()=>{floor=Number(button.dataset.floor);face=1;draw();}));
    host.querySelector('[data-a8-step="down"]').addEventListener('click',()=>{floor=mod(floor-1,8);face=1;draw();});
    host.querySelector('[data-a8-step="up"]').addEventListener('click',()=>{floor=mod(floor+1,8);face=1;draw();});
    shadowButton.addEventListener('click',()=>{floor=0;face=-1;draw();});
    visibleButton.addEventListener('click',()=>{face=1;draw();});
    draw();
  };
  return {mod,toBase,state,createHost,mount};
});
