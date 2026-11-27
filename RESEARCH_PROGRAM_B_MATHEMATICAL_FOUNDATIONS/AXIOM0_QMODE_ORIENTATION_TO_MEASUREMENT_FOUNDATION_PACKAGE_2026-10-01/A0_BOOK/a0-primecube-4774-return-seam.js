(function(){
  'use strict';
  function boot(root){
    const M=window.A0PrimecubeModel,stage=root.querySelector('[data-pc-rs-stage]'),detail=root.querySelector('[data-pc-rs-detail]'),stepButton=root.querySelector('[data-pc-rs-step]');
    if(!M||!stage||!detail)return;
    const turingView='TURING';
    const primusView='PRIMUS_ONE';
    const linkedViews=new Map([
      ['#return-seam-4774-turing',turingView],
      ['#return-seam-4774-primus-one',primusView],
      ['#return-seam-4774-moire','MOIRE_OVERLAY']
    ]);
    const source=document.querySelector('[data-turing-record]');
    let view='WHOLE_W',step=0;
    let turingWord,turingSwaps=0;
    let primusRank=9,driftSteps=0;
    let wobble=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    function zebraSectors(slice){
      return Array.from({length:12},(_,i)=>{const hidden=slice&&![0,1,5,6,7,11].includes(i),a0=-Math.PI/2+i*Math.PI/6,a1=a0+Math.PI/6;return `<path d="${sectorPath(330,255,205,a0,a1)}" fill="${i%2?'#05070b':'#d7d9dd'}" opacity="${hidden?.08:1}" stroke="#334055" stroke-width="1"/>`}).join('');
    }
    function carrierSvg(record,slice){
      const sectors=zebraSectors(slice);
      const x=view==='PUNCTUATION_X'?'<path d="M230 155L430 355M430 155L230 355" stroke="#ffd153" stroke-width="5"/>':'';
      const ncs=view==='NCS_292'?'<path d="M410 105L278 105" stroke="#57ddf7" stroke-width="4" marker-end="url(#a)"/><text x="345" y="88" text-anchor="middle" fill="#57ddf7">293 → 292 · −1</text>':'';
      return `<svg viewBox="0 0 660 510" role="img">${arrowDefs()}<g transform="rotate(${record.returnGate.turnDegrees} 330 255)">${sectors}<path d="M105 255H555" stroke="#020308" stroke-width="16"/><path d="M105 255H555" stroke="#ffd153" stroke-width="2" opacity=".65"/><circle cx="330" cy="255" r="16" fill="#57ddf7" stroke="#fff" stroke-width="3"/><text x="330" y="262" text-anchor="middle" fill="#04121a" font-size="22" font-weight="900">·</text>${x}<text x="330" y="472" text-anchor="middle" fill="#ffd153" font-family="ui-monospace" font-size="18">${record.returnGate.word} · ${record.returnGate.turnDegrees}°</text></g>${ncs}</svg>`;
    }
    function renderTuring(pair){
      turingWord ??= pair.source.word;
      stage.innerHTML=`<svg viewBox="0 0 660 510" role="img" aria-label="Zwölf Zebra-Sektoren um einen festen Mittelpunkt mit goldener horizontaler Spiegelachse">
        <g class="pc-rs-turing-stripes" data-rs-turing-stripes>${zebraSectors(false)}</g>
        <path d="M105 255H555" stroke="#050b13" stroke-width="14"/>
        <path d="M105 255H555" stroke="#ffd153" stroke-width="3" data-rs-turing-axis/>
        <circle cx="330" cy="255" r="14" fill="#57ddf7" stroke="#fff" stroke-width="3"/>
        <circle cx="330" cy="255" r="3" fill="#04121a"/>
        <text x="96" y="295" text-anchor="middle" fill="#ffd153" font-size="22" data-rs-turing-left></text>
        <text x="564" y="295" text-anchor="middle" fill="#ffd153" font-size="22" data-rs-turing-right></text>
        <text x="330" y="489" text-anchor="middle" fill="#ffd153" font-size="18">Feste Spiegelachse</text>
      </svg>`;
      detail.innerHTML=`<h3>Turing · ZETAFAST</h3>
        <dl>
          <dt>Blockfolge</dt><dd><code data-rs-turing-word></code></dd>
          <dt>Rücklauf</dt><dd data-rs-turing-status aria-live="polite"></dd>
        </dl>
        <div class="pc-rs-mode-controls" role="group" aria-label="Zebra-Wobble und Blocktausch">
          <button type="button" data-rs-turing-wobble aria-pressed="false">Wobble</button>
          <button type="button" data-rs-turing-swap>Blöcke tauschen</button>
        </div>
        <div class="pc-rs-card pc-rs-turing-source">
          <strong>Fester ZETAFAST-Datensatz</strong>
          <code data-rs-turing-record></code>
          <code data-rs-turing-values></code>
          <a href="#primecube-tour-turing">↑ Zur Decodierung in der Tour</a>
        </div>
        <p>Der Wobble bewegt die Streifen um den Mittelpunkt. Der Blocktausch wirkt auf die 4774-Naht. Turings Daten dienen als feste Referenz für den Vergleich.</p>`;

      const stripes=stage.querySelector('[data-rs-turing-stripes]');
      const wobbleButton=detail.querySelector('[data-rs-turing-wobble]');
      const word=detail.querySelector('[data-rs-turing-word]');
      const status=detail.querySelector('[data-rs-turing-status]');
      function updateWobble(){
        stripes.classList.toggle('is-wobbling',wobble);
        wobbleButton.setAttribute('aria-pressed',String(wobble));
      }
      function updateSwap(){
        const [left,right]=turingWord.split('|');
        word.textContent=turingWord;
        stage.querySelector('[data-rs-turing-left]').textContent=left;
        stage.querySelector('[data-rs-turing-right]').textContent=right;
        const returned=turingWord===pair.source.word;
        status.textContent=turingSwaps===0 ? 'Ausgangsfolge'
          : returned ? 'Exakter Rücklauf · S₂² = id' : 'Getauscht · Rücklauf offen';
      }
      wobbleButton.addEventListener('click',()=>{wobble=!wobble;updateWobble()});
      detail.querySelector('[data-rs-turing-swap]').addEventListener('click',()=>{
        const [left,right]=turingWord.split('|');
        turingWord=`${right}|${left}`;
        turingSwaps++;
        updateSwap();
      });
      detail.querySelector('[data-rs-turing-record]').textContent=source.textContent.trim();
      detail.querySelector('[data-rs-turing-values]').textContent=['t','z']
        .map(field=>document.querySelector(`[data-turing-${field}]`).textContent)
        .join(' · ');
      updateWobble();
      updateSwap();
    }
    function renderPrimus(){
      const ringSlots=71;
      const primes=M.sieve(61);
      const markers=[{rank:9,color:'#ff7979'},{rank:18,color:'#74b9ff'}];
      const thetaForSlot=slot=>-2*Math.PI*slot/ringSlots;
      const ringTicks=Array.from({length:ringSlots},(_,slot)=>{
        const angle=thetaForSlot(slot);
        const inner=polar(330,255,218,angle);
        const outer=polar(330,255,224,angle);
        return `<path d="M${inner.join(' ')}L${outer.join(' ')}"/>`;
      }).join('');
      const ringMarkers=markers.map(({rank,color})=>{
        const [x,y]=polar(330,255,221,thetaForSlot(rank-1));
        const label=rank===18 ? [x-22,y-3,'end'] : [x+15,y-5,'start'];
        return `<g data-rs-primus-marker="${rank}" fill="${color}">
          <circle class="pc-rs-primus-halo" cx="${x}" cy="${y}" r="13"/>
          <circle cx="${x}" cy="${y}" r="6" stroke="#0a111c" stroke-width="2"/>
          <text x="${label[0]}" y="${label[1]}" text-anchor="${label[2]}" font-size="19" font-weight="700">P${rank} = ${primes[rank-1]}</text>
        </g>`;
      }).join('');
      stage.innerHTML=`<svg viewBox="0 0 660 510" role="img" aria-label="Zebrarad mit goldener θ₀-Referenz und Primus-One-Markern auf dem 71-Slot-Ring">
        <g data-rs-primus-stripes>${zebraSectors(false)}</g>
        <circle cx="330" cy="255" r="221" fill="none" stroke="#334055"/>
        <g fill="none" stroke="#7d8ca2">${ringTicks}</g>
        <path d="M105 255H555" stroke="#080c15" stroke-width="8"/>
        <path d="M105 255H555" stroke="#ffd153" stroke-width="2" opacity=".8"/>
        <path d="M330 255V53" stroke="#ffd153" stroke-width="2" data-rs-primus-reference/>
        <g data-rs-primus-pointer>
          <path d="M330 255V55" stroke="#57ddf7" stroke-width="2" stroke-dasharray="5 7"/>
          <circle cx="330" cy="55" r="4" fill="#57ddf7"/>
        </g>
        ${ringMarkers}
        <circle cx="330" cy="255" r="10" fill="#ffd153" stroke="#0a111c" stroke-width="3"/>
        <text x="330" y="22" text-anchor="middle" fill="#ffd153" font-size="20">θ₀</text>
      </svg>`;
      detail.innerHTML=`<h3>Primus One</h3>
        <div class="pc-rs-mode-controls pc-rs-primus-markers" role="group" aria-label="Primus-One-Marker">
          ${markers.map(({rank,color})=>`<button type="button" style="--marker-color:${color}" data-rs-primus-select="${rank}" aria-pressed="false">P${rank} = ${primes[rank-1]}</button>`).join('')}
        </div>
        <h4>Hexatych-Drift</h4>
        <dl>
          <dt>Marker</dt><dd data-rs-primus-readout></dd>
          <dt>Offset</dt><dd data-rs-primus-offset></dd>
          <dt>Orientierung</dt><dd data-rs-primus-status aria-live="polite"></dd>
        </dl>
        <div class="pc-rs-mode-controls" role="group" aria-label="Hexatych-Drift in Zehntelgrad">
          <button type="button" data-rs-primus-drift="-1">−0,1°</button>
          <button type="button" data-rs-primus-drift="1">+0,1°</button>
          <button type="button" data-rs-primus-return>Zurück zu θ₀</button>
        </div>
        <p class="pc-rs-primus-note">Die Marker liegen auf dem inneren 71-Slot-Band der Base-213-Vorlage. Der Offset dreht die Zebra-Ansicht relativ zu θ₀. Die gewählte Primzahl behält ihre Ringadresse.</p>`;

      const markerButtons=[...detail.querySelectorAll('[data-rs-primus-select]')];
      const ringMarkersInView=[...stage.querySelectorAll('[data-rs-primus-marker]')];
      const stripes=stage.querySelector('[data-rs-primus-stripes]');
      const pointer=stage.querySelector('[data-rs-primus-pointer]');
      const readout=detail.querySelector('[data-rs-primus-readout]');
      const offset=detail.querySelector('[data-rs-primus-offset]');
      const status=detail.querySelector('[data-rs-primus-status]');
      const angleFormat=new Intl.NumberFormat('de-DE',{signDisplay:'exceptZero',minimumFractionDigits:1,maximumFractionDigits:1});
      function updateMarker(){
        markerButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.rsPrimusSelect)===primusRank)));
        ringMarkersInView.forEach(marker=>marker.classList.toggle('is-selected',Number(marker.dataset.rsPrimusMarker)===primusRank));
        readout.textContent=`P${primusRank} = ${primes[primusRank-1]} · Slot ${primusRank} von ${ringSlots}`;
      }
      function updateDrift(returned=false){
        const angle=driftSteps/10;
        const transform=`rotate(${angle} 330 255)`;
        stripes.setAttribute('transform',transform);
        pointer.setAttribute('transform',transform);
        offset.textContent=`Δθ = ${angleFormat.format(angle)}°`;
        status.textContent=driftSteps ? 'Versetzt gegenüber θ₀'
          : returned ? 'θ₀ erreicht · Marker erhalten' : 'θ₀ · Referenz';
      }
      markerButtons.forEach(button=>button.addEventListener('click',()=>{
        primusRank=Number(button.dataset.rsPrimusSelect);
        updateMarker();
      }));
      detail.querySelectorAll('[data-rs-primus-drift]').forEach(button=>button.addEventListener('click',()=>{
        driftSteps+=Number(button.dataset.rsPrimusDrift);
        updateDrift();
      }));
      detail.querySelector('[data-rs-primus-return]').addEventListener('click',()=>{
        driftSteps=0;
        updateDrift(true);
      });
      updateMarker();
      updateDrift();
    }
    function render(){
      const isTuring=view===turingView,isPrimus=view===primusView;
      stepButton.hidden=isTuring||isPrimus;
      root.querySelectorAll('[data-pc-rs-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcRsView===view)));
      if(isPrimus){
        renderPrimus();
        return;
      }
      const record=M.returnSeam4774Record(step,isTuring?'WHOLE_W':view),slice=view==='MEMORY_M';
      if(isTuring){
        renderTuring(record.blockSwap);
        return;
      }
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
    }
    root.querySelectorAll('[data-pc-rs-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.pcRsView;render()}));
    stepButton.addEventListener('click',()=>{step=(step+1)%4;render()});
    function selectLinkedView(anchor){
      const nextView=linkedViews.get(anchor);
      if(nextView && view!==nextView){
        view=nextView;
        render();
      }
    }
    window.addEventListener('hashchange',()=>selectLinkedView(window.location.hash));
    for(const anchor of linkedViews.keys()){
      document.querySelectorAll(`a[href="${anchor}"]`).forEach(link=>link.addEventListener('click',()=>selectLinkedView(anchor)));
    }
    view=linkedViews.get(window.location.hash) ?? view;
    render();
  }
  document.querySelectorAll('[data-pc-return-seam]').forEach(boot);
})();
