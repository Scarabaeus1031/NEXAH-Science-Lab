(function(){
  'use strict';
  const M=globalThis.A0PrimecubeModel;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const project=({x,y,z})=>({x:455+(x-y)*19,y:322+(x+y)*7-z*22});
  const point=(item,classes,r=2.15)=>{const p=project(item.address);return `<circle class="${classes}" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r}"/>`};
  const line=(a,b,klass='pc-shadow-frame')=>{const p=project(a),q=project(b);return `<path class="${klass}" d="M${p.x},${p.y}L${q.x},${q.y}"/>`};
  function frame(){
    let out='';
    for(const x of [0,10])for(const y of [0,10])out+=line({x,y,z:0},{x,y,z:10});
    for(const z of [0,9,10]){for(const x of [0,10])out+=line({x,y:0,z},{x,y:10,z},z===9?'pc-shadow-plane':'pc-shadow-frame');for(const y of [0,10])out+=line({x:0,y,z},{x:10,y,z},z===9?'pc-shadow-plane':'pc-shadow-frame')}
    return out;
  }
  function axis(){
    const nodes=Array.from({length:11},(_,i)=>`<g transform="translate(${260+i*39} 541)"><circle class="${i===5?'dot':''}" r="7"/><text class="pc-shadow-label ${i===5?'gold':''}" text-anchor="middle" y="22">${i===5?'·':i<5?i+1:11-i}</text></g>`).join('');
    return `<g class="pc-shadow-dot-axis">${nodes}<text class="pc-shadow-label strong" x="455" y="585" text-anchor="middle">5 + · + 5 = 11 · TEN FINGERS / ONE SPLINTER AXIS</text></g>`;
  }
  function cikada(){
    return `<g class="pc-shadow-cikada" transform="translate(46 442)"><rect width="169" height="66" rx="10"/><rect class="outside" x="169" width="169" height="66" rx="10"/><rect x="338" width="169" height="66" rx="10"/><text x="84" y="21" text-anchor="middle">CI · INSIDE</text><text x="253" y="21" text-anchor="middle" class="accent">KA · OUTSIDE</text><text x="422" y="21" text-anchor="middle">DA · INSIDE′</text><text x="84" y="43" text-anchor="middle">1111 · RECORD</text><text x="253" y="43" text-anchor="middle">1112…1331 · ADDRESS</text><text x="422" y="43" text-anchor="middle">PROJECTION RETURN</text><text x="253" y="59" text-anchor="middle" class="pc-shadow-label">RETURN ≠ CARRIER REENTRY</text></g>`;
  }
  function packingInset(record,packing){
    const x0=735,y0=54;
    if(packing==='mask-extrusion'){
      let cells='';
      for(let y=0;y<11;y++)for(let x=0;x<11;x++){
        const selected=(x!==5&&y!==5)||(x===5&&y===5);
        cells+=`<rect class="${selected?'carrier':'shadow'}" x="${x0+x*11}" y="${y0+y*11}" width="9" height="9" rx="1"/>`;
      }
      return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">REPACKED MASK · 101 / 20</text>${cells}<text x="${x0}" y="${y0+140}">101×11 + 20×11 = 1331</text></g>`;
    }
    if(packing==='z-slices'){
      let bars='';
      for(let z=0;z<11;z++){const yy=y0+z*13,carrier=z<9?121:z===9?22:0,shadow=121-carrier;bars+=`<rect class="carrier" x="${x0}" y="${yy}" width="${carrier}" height="8"/><rect class="shadow" x="${x0+carrier}" y="${yy}" width="${shadow}" height="8"/><text x="${x0-18}" y="${yy+7}">z${z}</text>`}
      return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">NATIVE Z-SLICES</text>${bars}<text x="${x0}" y="${y0+158}">9×121 + 22 | 99 + 121</text></g>`;
    }
    return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">FULL ADDRESS ENVELOPE</text><rect class="carrier" x="${x0}" y="${y0}" width="101" height="24"/><rect class="shadow" x="${x0+101}" y="${y0}" width="20" height="24"/><text x="${x0}" y="${y0+42}">1111 / 1331 = 101 / 121</text><text x="${x0}" y="${y0+58}">220 / 1331 = 20 / 121</text></g>`;
  }
  function render(root,state){
    const record=M.shadowCubeEnvelopeRecord(state.reach),allCarrier=state.mode!=='shadow',allShadow=state.mode!=='carrier';
    const carrier=[];
    if(allCarrier){for(let n=1;n<=1111;n++){const address=M.fullCubeAddress(n);carrier.push(point({address},'pc-shadow-carrier',n>1089?2.45:1.15))}}
    const shadow=allShadow?record.shadow.map((item,index)=>point(item,`pc-shadow-address${index<record.revealed?' is-reached':''}${item.n===1210||item.n===1331?' is-seam':''}`,item.n===1210||item.n===1331?4:2.2)).join(''):'';
    const traceItems=[{n:1111,address:M.fullCubeAddress(1111)},...record.visibleShadow],trace=traceItems.map(item=>{const p=project(item.address);return `${p.x.toFixed(2)},${p.y.toFixed(2)}`}).join(' ');
    const labels=record.checkpoints.map(item=>{const p=project(item.address),active=item.n<=1111||item.n<=1111+record.revealed;return `<g opacity="${active?1:.3}"><circle cx="${p.x}" cy="${p.y}" r="5" fill="${item.n===1111?'#55d9f2':'#ffd35a'}" stroke="#fff"/><text class="pc-shadow-label ${item.n===1210||item.n===1331?'gold':''}" x="${p.x+8}" y="${p.y-8}">${item.n} · ${item.role.replaceAll('_',' ')}</text></g>`}).join('');
    root.querySelector('[data-pc-shadow-stage]').innerHTML=`<svg viewBox="0 0 910 610" role="img" aria-label="Primecube carrier and growing Shadow Cube address envelope"><text class="pc-shadow-label strong" x="24" y="27">${state.mode.toUpperCase()} · REACH ${record.revealed}/220</text><text class="pc-shadow-label" x="886" y="27" text-anchor="end">11 × 11 × 11 · 1331 ADDRESSES</text>${frame()}<g>${carrier.join('')}${shadow}</g>${trace?`<polyline class="pc-shadow-path" points="${trace}"/>`:''}${labels}${packingInset(record,state.packing)}${cikada()}${axis()}</svg>`;
    const current=record.revealed?record.visibleShadow.at(-1):record.checkpoints[0],phase=record.revealed===0?'CARRIER_BOUNDARY':record.revealed<=99?'LAYER_10_REMAINDER':'LAYER_11_FULL';
    const pack=record.packingViews.find(item=>item.id===state.packing),balance=record.volumeBalance;
    root.querySelector('[data-pc-shadow-detail]').innerHTML=`<div class="pc-eyebrow">Address envelope record</div><h3>${esc(current.n)}</h3><span class="pc-shadow-status">${phase.replaceAll('_',' ')}</span><dl><dt>Mode</dt><dd>${state.mode.toUpperCase()}</dd><dt>Packing</dt><dd>${pack.label}<br>${pack.equation}</dd><dt>Reach</dt><dd>${record.revealed} / 220 shadow addresses</dd><dt>Address</dt><dd>[${current.address.x},${current.address.y},${current.address.z}]</dd><dt>Base 11</dt><dd>${M.toBase11(current.n)}₁₁ · addr ${M.toBase11(current.n-1)}₁₁</dd><dt>Carrier</dt><dd>${balance.carrier.reducedRatio} = ${balance.carrier.ratio.toFixed(7)}</dd><dt>Shadow</dt><dd>${balance.shadow.reducedRatio} = ${balance.shadow.ratio.toFixed(7)}</dd><dt>−0.834</dt><dd>separate cosine input<br>gap ${balance.cosineComparator.absoluteGap.toFixed(7)}</dd><dt>Dot</dt><dd>${record.reach.notation}<br>${record.reach.meaning.replaceAll('_',' ')}</dd><dt>CIKADA</dt><dd>CI → KA → DA<br>INSIDE → OUTSIDE → INSIDE′</dd><dt>Authority</dt><dd>0 new IDs · 0 relations</dd></dl><p class="pc-detail-boundary"><b>${pack.addressing.replaceAll('_',' ')}.</b> ADDRESS EXISTS · RECORD ABSENT. No primality or constellation predicate is evaluated for this shadow address.</p>`;
    root.querySelector('[data-pc-shadow-reach]').value=String(record.revealed);root.querySelector('[data-pc-shadow-reach-out]').textContent=`${record.revealed} / 220`;
    root.querySelectorAll('[data-pc-shadow-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcShadowMode===state.mode)));
    root.querySelectorAll('[data-pc-shadow-packing]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcShadowPacking===state.packing)));
  }
  function boot(){
    const root=document.querySelector('[data-pc-shadow-envelope]');if(!root||!M)return;
    const state={mode:'envelope',packing:'full-envelope',reach:220},slider=root.querySelector('[data-pc-shadow-reach]');
    root.addEventListener('click',event=>{const mode=event.target.closest('[data-pc-shadow-mode]'),packing=event.target.closest('[data-pc-shadow-packing]');if(mode)state.mode=mode.dataset.pcShadowMode;if(packing)state.packing=packing.dataset.pcShadowPacking;if(event.target.closest('[data-pc-shadow-grow]'))state.reach=Math.min(220,state.reach+11);if(event.target.closest('[data-pc-shadow-reset]'))state.reach=0;if(event.target.closest('[data-pc-shadow-complete]'))state.reach=220;if(mode||packing||event.target.closest('[data-pc-shadow-grow],[data-pc-shadow-reset],[data-pc-shadow-complete]'))render(root,state)});
    slider.addEventListener('input',()=>{state.reach=Number(slider.value);render(root,state)});render(root,state);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
