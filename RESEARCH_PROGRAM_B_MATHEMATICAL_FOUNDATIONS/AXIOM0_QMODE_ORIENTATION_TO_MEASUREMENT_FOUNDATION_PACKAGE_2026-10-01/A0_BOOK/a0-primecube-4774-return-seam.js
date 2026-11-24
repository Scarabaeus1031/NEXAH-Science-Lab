(function(){
  'use strict';
  function boot(root){
    const M=window.A0PrimecubeModel,stage=root.querySelector('[data-pc-rs-stage]'),detail=root.querySelector('[data-pc-rs-detail]'),stepButton=root.querySelector('[data-pc-rs-step]');
    if(!M||!stage||!detail)return;
    let view='WHOLE_W',step=0;
    const polar=(cx,cy,r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    function sectorPath(cx,cy,r,a0,a1){const p0=polar(cx,cy,r,a0),p1=polar(cx,cy,r,a1);return `M${cx},${cy}L${p0[0]},${p0[1]}A${r},${r} 0 0 1 ${p1[0]},${p1[1]}Z`}
    function arrowDefs(){return '<defs><marker id="a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#57ddf7"/></marker><filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter></defs>'}
    function moireSvg(record){
      const family=(count,color,phase)=>Array.from({length:count},(_,i)=>{const t=i/(count-1),y=82+t*346,wobble=18*Math.sin((t*6+phase)*Math.PI);return `<path d="M92 ${y.toFixed(2)} Q330 ${(255+wobble).toFixed(2)} 568 ${(428-y+82).toFixed(2)}" fill="none" stroke="${color}" stroke-width="1" opacity=".16"/>`}).join('');
      return `<svg class="pc-rs-moire" viewBox="0 0 660 510" role="img" aria-label="Constructed 47 and 74 line-family overlay">${arrowDefs()}<rect x="72" y="58" width="516" height="394" rx="24" fill="#05070b" stroke="#263b51"/><g class="pc-rs-moire-a" filter="url(#soft)">${family(47,'#57ddf7',0)}</g><g class="pc-rs-moire-b" filter="url(#soft)">${family(74,'#f064c7',.5)}</g><path d="M72 255H588" stroke="#ffd153" stroke-width="2"/><circle cx="330" cy="255" r="10" fill="#fff"/><text x="330" y="44" text-anchor="middle" fill="#e7efff" font-size="18" font-weight="800">47 LINES × 74 LINES · Δ 27</text><text x="330" y="480" text-anchor="middle" fill="#8295ad" font-family="ui-monospace" font-size="14">${record.moireOverlay.role}</text></svg>`;
    }
    function swapSvg(pair,accent,title){
      return `<svg viewBox="0 0 660 510" role="img" aria-label="${title}">${arrowDefs()}<rect x="66" y="112" width="206" height="210" rx="28" fill="#101c2b" stroke="${accent}" stroke-width="2"/><rect x="388" y="112" width="206" height="210" rx="28" fill="#101c2b" stroke="${accent}" stroke-width="2"/><text x="169" y="205" text-anchor="middle" fill="#e8f0ff" font-size="42" font-weight="900">${pair.source.word}</text><text x="491" y="205" text-anchor="middle" fill="#e8f0ff" font-size="42" font-weight="900">${pair.target.word}</text><text x="169" y="249" text-anchor="middle" fill="#8295ad" font-size="16">${pair.source.factorization}</text><text x="491" y="249" text-anchor="middle" fill="#8295ad" font-size="16">${pair.target.factorization}</text><path d="M286 190H374" stroke="${accent}" stroke-width="4" marker-end="url(#a)"/><path d="M374 250H286" stroke="${accent}" stroke-width="4" marker-end="url(#a)"/><text x="330" y="155" text-anchor="middle" fill="${accent}" font-size="24" font-weight="900">S₂</text><text x="330" y="370" text-anchor="middle" fill="#ffd153" font-size="20" font-weight="800">${pair.law}</text><text x="330" y="410" text-anchor="middle" fill="#8295ad" font-size="15">${title}</text></svg>`;
    }
    function carrierSvg(record,slice){
      const sectors=Array.from({length:12},(_,i)=>{const hidden=slice&&![0,1,5,6,7,11].includes(i),a0=-Math.PI/2+i*Math.PI/6,a1=a0+Math.PI/6;return `<path d="${sectorPath(330,255,205,a0,a1)}" fill="${i%2?'#05070b':'#d7d9dd'}" opacity="${hidden?.08:1}" stroke="#334055" stroke-width="1"/>`}).join('');
      const x=view==='PUNCTUATION_X'?'<path d="M230 155L430 355M430 155L230 355" stroke="#ffd153" stroke-width="5"/>':'';
      const ncs=view==='NCS_292'?'<path d="M410 105L278 105" stroke="#57ddf7" stroke-width="4" marker-end="url(#a)"/><text x="345" y="88" text-anchor="middle" fill="#57ddf7">293 → 292 · −1</text>':'';
      return `<svg viewBox="0 0 660 510" role="img">${arrowDefs()}<g transform="rotate(${record.returnGate.turnDegrees} 330 255)">${sectors}<path d="M105 255H555" stroke="#020308" stroke-width="16"/><path d="M105 255H555" stroke="#ffd153" stroke-width="2" opacity=".65"/><circle cx="330" cy="255" r="16" fill="#57ddf7" stroke="#fff" stroke-width="3"/><text x="330" y="262" text-anchor="middle" fill="#04121a" font-size="22" font-weight="900">·</text>${x}<text x="330" y="472" text-anchor="middle" fill="#ffd153" font-family="ui-monospace" font-size="18">${record.returnGate.word} · ${record.returnGate.turnDegrees}°</text></g>${ncs}</svg>`;
    }
    function render(){
      const record=M.returnSeam4774Record(step,view),slice=view==='MEMORY_M';
      stage.innerHTML=view==='MOIRE_OVERLAY'?moireSvg(record):view==='BLOCK_SWAP_S2'?swapSvg(record.blockSwap,'#57ddf7','EXACT 2+2 BLOCK SWAP · NOT REV₄'):view==='MIRROR_9119'?swapSvg(record.mirror9119,'#f064c7','SEPARATE COMPARATOR · NOT FESN:4774'):carrierSvg(record,slice);
      let body,title,card;
      if(view==='NCS_292'){
        title='NCS / NEIGHBOR';body='<dt>SOURCE</dt><dd>293 = p₆₂ · cube [6,4,2] · CRT (6,7,7)</dd><dt>ADAPTER</dt><dd>n−1 · Δcube [−1,0,0]</dd><dt>TARGET</dt><dd>292 = 2²·73 · cube [5,4,2] · CRT (5,6,6)</dd><dt>NCS</dt><dd>Td(x,y,z)=(x+d,y+d,z) · separate</dd>';card='HOPF · HOLD — kein S³→S²-Quotient und keine S¹-Fasern aus der Projektion.';
      }else if(view==='BLOCK_SWAP_S2'){
        title='S₂ / 47|74';body=`<dt>FORWARD</dt><dd>${record.blockSwap.source.word} = ${record.blockSwap.source.value}</dd><dt>SWAP</dt><dd>${record.blockSwap.target.word} = ${record.blockSwap.target.value}</dd><dt>RETURN</dt><dd>S₂² = id · EXACT</dd><dt>BOUNDARY</dt><dd>BLOCK SWAP ≠ REV₄</dd>`;card='Beide Endpunkte sind REV₄-fixierte Palindrome. Der wirksame Operator tauscht jedoch die beiden Zweierblöcke.';
      }else if(view==='MOIRE_OVERLAY'){
        title='MOIRÉ / MIDDLE';body=`<dt>FAMILY A</dt><dd>47 cyan screen lines</dd><dt>FAMILY B</dt><dd>74 magenta screen lines</dd><dt>TOTAL</dt><dd>${record.moireOverlay.totalLines} = 11²</dd><dt>PARAMETER</dt><dd>|74−47| = ${record.moireOverlay.differenceParameter}</dd>`;card='DISPLAY ONLY — konstruiertes Overlay zweier getrennter Inputs; keine physikalischen Schlieren, Energie oder Resonanz.';
      }else if(view==='MIRROR_9119'){
        title='9119 / COMPARATOR';body='<dt>FORWARD</dt><dd>91|19 = 9119 = 11·829</dd><dt>SWAP</dt><dd>19|91 = 1991 = 11·181</dd><dt>RETURN</dt><dd>S₂² = id · EXACT</dd><dt>STATUS</dt><dd>separate comparator</dd>';card='Die gemeinsame 11 ist exakte Arithmetik. Daraus folgt keine Identität oder Relation zu FESN:4774.';
      }else{
        title=view==='MEMORY_M'?'M / PARTIAL':view==='WHOLE_W'?'W / WHOLE':'· / X PUNCTUATION';body=`<dt>VIEW</dt><dd>${record.view}</dd><dt>SEAM</dt><dd>4|7|7|4 · PALINDROME</dd><dt>MATRIX</dt><dd>[[4,7],[7,4]] · λ=11,−3</dd><dt>RETURN</dt><dd>R₉₀^${record.returnGate.step} · ${record.returnGate.returned?'EXACT':'OPEN'}</dd><dt>CARRIER</dt><dd>6 WHITE + 6 BLACK · OWNER COUNT</dd>`;card=slice?'M(W) ist many-to-one: ohne den retained W-Träger ist die Rekonstruktion nicht eindeutig.':'HOPF · HOLD — kein S³→S²-Quotient und keine S¹-Fasern aus der Projektion.';
      }
      detail.innerHTML=`<div class="pc-eyebrow">Typed view · no identity merge</div><h3>${title}</h3><dl>${body}</dl><div class="pc-rs-card">${card}</div>`;
      stepButton.textContent=`NEXT · ${record.returnGate.step}/4`;
      root.querySelectorAll('[data-pc-rs-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcRsView===view)));
    }
    root.querySelectorAll('[data-pc-rs-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.pcRsView;render()}));
    stepButton.addEventListener('click',()=>{step=(step+1)%4;render()});render();
  }
  document.querySelectorAll('[data-pc-return-seam]').forEach(boot);
})();
