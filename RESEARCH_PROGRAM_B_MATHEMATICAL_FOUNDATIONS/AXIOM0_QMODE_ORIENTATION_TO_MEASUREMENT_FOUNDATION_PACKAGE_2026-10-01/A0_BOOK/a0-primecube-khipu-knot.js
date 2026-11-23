(function(){
  'use strict';
  const M=globalThis.A0PrimecubeModel;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function knotGlyph(slot,x,y){
    if(slot.knotType==='ZERO_GAP')return `<rect class="zero-gap" x="${x-13}" y="${y-9}" width="26" height="18" rx="7"/><text class="status" x="${x+20}" y="${y+3}">GAP · 0</text>`;
    if(slot.knotType==='FIGURE_EIGHT')return `<path class="knot" d="M${x-10},${y} C${x-10},${y-11} ${x+10},${y-11} ${x+10},${y} C${x+10},${y+11} ${x-10},${y+11} ${x-10},${y} C${x-10},${y-7} ${x+10},${y-7} ${x+10},${y}"/><text class="status" x="${x+20}" y="${y+3}">FIGURE‑8 · 1</text>`;
    if(slot.knotType==='LONG_KNOT'){
      const turns=slot.digit,path=Array.from({length:turns},(_,i)=>`q8 -9 16 0 q-8 9 -16 0`).join(' ');
      return `<path class="knot" d="M${x-turns*4},${y} ${path}"/><text class="status" x="${x+turns*8+12}" y="${y+3}">LONG · ${turns}</text>`;
    }
    return `${Array.from({length:slot.digit},(_,i)=>`<circle cx="${x+(i-(slot.digit-1)/2)*7}" cy="${y}" r="3.2" fill="#62d6ee"/>`).join('')}<text class="status" x="${x+slot.digit*4+15}" y="${y+3}">SIMPLE ×${slot.digit}</text>`;
  }
  function crossingSvg(record){
    const mode=record.crossingMode,hit=record.axisHit;
    const vertical=`M190 52 C190 122 190 190 190 260`;
    const horizontal=`M55 156 C115 156 145 156 190 156 C235 156 275 156 330 156`;
    const over=mode==='OVER'?'vertical':mode==='UNDER'?'horizontal':null;
    const first=over==='vertical'?horizontal:vertical,second=over==='vertical'?vertical:horizontal;
    const firstClass=first===vertical?'cyan':'violet',secondClass=second===vertical?'cyan':'violet';
    const resolved=mode!=='UNRESOLVED';
    return `<g transform="translate(22 58)"><text class="title" x="0" y="0">AXIS HIT · ZERO / NULL GATE</text><line class="axis" x1="190" y1="32" x2="190" y2="282"/><line class="axis" x1="35" y1="156" x2="350" y2="156"/>${resolved?`<path class="cord under-line ${firstClass}" d="${first}"/><path class="cord under-mask" d="${second}"/><path class="cord over-line ${secondClass}" d="${second}"/>`:`<path class="cord under-line cyan" d="${vertical}"/><path class="cord under-line violet" d="${horizontal}"/>`}<circle class="${resolved?'lift':'hit'}" cx="190" cy="156" r="${resolved?8:10}"/><text class="digit" x="206" y="146">ρ = 0</text><text class="status" x="206" y="164">φ = NULL / UNDEFINED</text><text class="status" x="152" y="42">IN · 90°</text><text class="status" x="142" y="292">OUT · 270°</text><text class="status" x="45" y="320">${esc(hit.knotStatus.replaceAll('_',' '))}</text><text class="status" x="45" y="338">LIFT z = ${hit.lift.height>0?'+':''}${hit.lift.height} · ${esc(mode)}</text></g>`;
  }
  function ledgerSvg(record,register){
    const cords=record.khipu.generations,baseX=445,primaryY=90;
    const pendants=cords.map((generation,index)=>{
      const x=baseX+index*116,selected=generation.id===record.khipu.selected.id;
      const knots=generation.encoding.slots.map((slot,slotIndex)=>knotGlyph(slot,x,170+slotIndex*76)).join('');
      return `<g class="${selected?'selected-cord':''}"><path class="cord ${selected?'gold':'muted'}" stroke-width="${selected?5:3}" d="M${x} ${primaryY} V445"/><circle cx="${x}" cy="${primaryY}" r="6" fill="${selected?'#e6ad3d':'#405169'}"/>${knots}<text class="digit" text-anchor="middle" x="${x}" y="478">${generation.id} · ${generation.value}</text><text class="status" text-anchor="middle" x="${x}" y="496">${selected?register:'—'}</text></g>`;
    }).join('');
    return `<g><text class="title" x="420" y="32">KHIPU GENERATION LEDGER · DECLARED DEMO</text><path class="cord gold" stroke-width="8" d="M420 ${primaryY} H825"/><text class="status" x="420" y="72">PRIMARY CORD / CARRIER</text>${[1000,100,10,1].map((place,index)=>`<line class="place" x1="412" y1="${170+index*76}" x2="840" y2="${170+index*76}"/><text class="label" text-anchor="end" x="405" y="${174+index*76}">${place===1?'10⁰':place===10?'10¹':place===100?'10²':'10³'}</text>`).join('')}${pendants}<text class="status" x="420" y="526">SIMPLE = higher places · LONG = ones 2…9 · FIGURE‑8 = ones 1 · GAP = zero</text></g>`;
  }
  function boot(root){
    let state={crossingMode:'UNRESOLVED',generationIndex:1,register:'UNASSIGNED'};
    const stage=root.querySelector('[data-pc-khipu-stage]'),detail=root.querySelector('[data-pc-khipu-detail]');
    const render=()=>{
      const record=M.thothKhipuKnotRecord(state),selected=record.khipu.selected;
      root.querySelectorAll('[data-pc-knot-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcKnotMode===state.crossingMode)));
      root.querySelectorAll('[data-pc-khipu-generation]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pcKhipuGeneration)===state.generationIndex)));
      root.querySelectorAll('[data-pc-khipu-register]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcKhipuRegister===state.register)));
      stage.innerHTML=`<svg viewBox="0 0 860 550" role="img" aria-label="Axis crossing and synthetic Khipu generation ledger">${crossingSvg(record)}${ledgerSvg(record,state.register)}</svg>`;
      detail.innerHTML=`<div class="pc-eyebrow">Selected · ${esc(selected.id)}</div><h3>${selected.value}</h3><dl><dt>Digits</dt><dd>${selected.encoding.digits.join(' · ')}</dd><dt>Knot types</dt><dd>${selected.encoding.slots.map(slot=>slot.knotType).join('<br>')}</dd><dt>Crossing</dt><dd>${esc(record.crossingMode)}</dd><dt>ρ</dt><dd>0 · ${esc(record.axisHit.rhoStatus)}</dd><dt>φ</dt><dd>NULL · ${esc(record.axisHit.polarAngleStatus)}</dd><dt>Tangents</dt><dd>90° → 270°</dd><dt>Twist</dt><dd>${esc(state.register)} · context dependent</dd><dt>Return</dt><dd>SELECTED DISPLAY RECORD ONLY</dd></dl><div class="pc-khipu-card"><b>SYNTHETIC NEXAH LEDGER</b><br>${esc(selected.role)}<br><br>${esc(record.comparator.status)}<br><br>THOTH / AUA / IV O MA RI? MI ZE LI C → OWNER HOLD</div>`;
    };
    root.addEventListener('click',event=>{
      const mode=event.target.closest('[data-pc-knot-mode]'),generation=event.target.closest('[data-pc-khipu-generation]'),register=event.target.closest('[data-pc-khipu-register]');
      if(mode)state.crossingMode=mode.dataset.pcKnotMode;
      if(generation)state.generationIndex=Number(generation.dataset.pcKhipuGeneration);
      if(register)state.register=register.dataset.pcKhipuRegister;
      if(mode||generation||register)render();
    });
    render();
  }
  document.querySelectorAll('[data-pc-khipu-knot]').forEach(boot);
})();
