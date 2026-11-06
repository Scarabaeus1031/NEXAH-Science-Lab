(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0PascalGenerationTurn=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PHASES=['EMPTY','FILLING','COMPLETE','RELEASED','J-TURN'];
  const MAX_DEPTH=6;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const address=(row,column)=>`P(${row},${column})`;
  const valueAt=(rows,row,column)=>column<0||column>row?0:rows[row]?.[column]?.value??0;
  const makeCell=(rows,row,column)=>{
    const left=valueAt(rows,row-1,column-1);
    const right=valueAt(rows,row-1,column);
    return {
      row,column,value:left+right,
      address:address(row,column),
      parents:[address(row-1,column-1),address(row-1,column)],
      parentValues:[left,right],
      relation:`(${address(row-1,column-1)}, ${address(row-1,column)}) → R(${row},${column}) → ${address(row,column)}`
    };
  };
  const seedRows=()=>[
    [{row:0,column:0,value:1,address:address(0,0),parents:[],parentValues:[],relation:'SEED'}],
    [
      {row:1,column:0,value:1,address:address(1,0),parents:[address(0,-1),address(0,0)],parentValues:[0,1],relation:`(${address(0,-1)}, ${address(0,0)}) → R(1,0) → ${address(1,0)}`},
      {row:1,column:1,value:1,address:address(1,1),parents:[address(0,0),address(0,1)],parentValues:[1,0],relation:`(${address(0,0)}, ${address(0,1)}) → R(1,1) → ${address(1,1)}`}
    ]
  ];
  const createState=(maxDepth=MAX_DEPTH)=>({
    maxDepth:Math.max(2,Math.floor(maxDepth)),
    phase:'EMPTY',
    targetRow:2,
    rows:seedRows(),
    draft:[],
    records:[],
    history:[{t:0,event:'SEED',detail:'P(0) + P(1) retained'}],
    t:0,gR:0,gP:1,gM:0,angle:0,cycle:0
  });
  const can=(state,action)=>({
    FILL:state.phase==='EMPTY'||state.phase==='FILLING',
    RELEASE:state.phase==='COMPLETE',
    TURN:state.phase==='RELEASED',
    NEXT:state.phase==='J-TURN'&&state.targetRow<state.maxDepth
  })[action]===true;
  const stamp=(state,event,detail)=>{
    state.t+=1;
    state.history.push({t:state.t,event,detail});
  };
  const fillOne=input=>{
    const state=clone(input);
    if(!can(state,'FILL'))return state;
    const column=state.draft.length;
    const cell=makeCell(state.rows,state.targetRow,column);
    state.draft.push(cell);
    state.records.push(cell);
    state.gR=state.records.length;
    state.phase=state.draft.length===state.targetRow+1?'COMPLETE':'FILLING';
    stamp(state,'FILL',`${cell.parents.join(' + ')} = ${cell.value}`);
    return state;
  };
  const fillRow=input=>{
    let state=clone(input);
    while(can(state,'FILL'))state=fillOne(state);
    return state;
  };
  const release=input=>{
    const state=clone(input);
    if(!can(state,'RELEASE'))return state;
    state.rows.push(state.draft.map(clone));
    state.draft=[];
    state.phase='RELEASED';
    state.gP=state.targetRow;
    stamp(state,'RELEASE',`Generation P${state.targetRow} committed; ancestry retained`);
    return state;
  };
  const turn=input=>{
    const state=clone(input);
    if(!can(state,'TURN'))return state;
    state.phase='J-TURN';
    state.gM+=1;
    state.cycle+=1;
    state.angle=(state.angle+90)%360;
    stamp(state,'J-TURN',`+90° → ${state.angle}°; state not reset`);
    return state;
  };
  const next=input=>{
    const state=clone(input);
    if(!can(state,'NEXT'))return state;
    state.targetRow+=1;
    state.phase='EMPTY';
    stamp(state,'NEXT',`target P${state.targetRow}; prior generations retained`);
    return state;
  };
  const transition=(state,action)=>({FILL:fillOne,FILL_ROW:fillRow,RELEASE:release,TURN:turn,NEXT:next}[action]||clone)(state);
  const stateLabel=state=>`S(${state.t}, ${state.gR}, ${state.gP}, ${state.gM})`;
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const createHost=()=>{
    const anchor=document.getElementById('cpmrSpiralCube')||document.getElementById('algoEightFloorRegister')||document.getElementById('heptad14Orientation')||document.querySelector('.cube-nav-rail');
    if(!anchor)return null;
    const host=document.createElement('section');
    host.className='pgt';
    host.id='pascalGenerationTurn';
    host.setAttribute('aria-labelledby','pgtTitle');
    host.innerHTML=`<header><div><span class="eyebrow">J ALGORITHM · GENERATION CORNER · SOURCE-BOUND</span><h3 id="pgtTitle">Pascal Pyramid — Fill · Release · J‑Turn</h3><p>Eine Generation wird aus adressierten Elternrelationen aufgebaut, als Reihe freigegeben und erst danach um die Ecke gedreht. Die Orientierung kann zurückkehren; die Geschichte tut es nicht.</p></div><span class="pgt-status">ISOLATED MODULE<br>GLB UNCHANGED</span></header><div class="pgt-grid"><div class="pgt-stage"><div class="pgt-chamber"><div class="pgt-turn-ring" aria-hidden="true"><i></i><span>J</span></div><div class="pgt-pyramid" role="img" aria-label="Interaktive Pascal-Pyramide mit freigegebenen und im Aufbau befindlichen Generationen"></div><div class="pgt-axis"><span>FILL</span><i></i><span>RELEASE</span><i></i><span>TURN</span></div></div><div class="pgt-phase-track" aria-label="Zustandsfolge"></div><p class="pgt-stage-note">LOCAL RETURN ≠ HISTORY RESET · vier J‑Turns führen die Ansicht zu 0°, nicht den Zustand zu S₀.</p></div><div class="pgt-panel"><div class="pgt-state" aria-live="polite"><div><small>STATE</small><b data-pgt-readout="state">S(0, 0, 1, 0)</b></div><div><small>PHASE</small><b data-pgt-readout="phase">EMPTY</b></div><div><small>TARGET</small><b data-pgt-readout="target">P2</b></div><div><small>J ANGLE</small><b data-pgt-readout="angle">0°</b></div><div><small>RELATIONS gR</small><b data-pgt-readout="relations">0</b></div><div><small>GENERATIONS gP</small><b data-pgt-readout="generations">1</b></div></div><div class="pgt-controls"><button type="button" data-pgt-action="FILL">FILL +1<small>next relation</small></button><button type="button" data-pgt-action="FILL_ROW">FILL ROW<small>complete layer</small></button><button type="button" data-pgt-action="RELEASE">RELEASE<small>commit generation</small></button><button type="button" data-pgt-action="TURN">J‑TURN +90°<small>orientation step</small></button><button type="button" data-pgt-action="NEXT">NEXT GENERATION<small>keep history</small></button></div><div class="pgt-relation"><small>LATEST TYPED RECORD</small><code data-pgt-readout="relation">SEED → P(0), P(1)</code></div><div class="pgt-ledger"><div class="pgt-ledger-head"><b>GENEALOGICAL LEDGER</b><span data-pgt-readout="events">1 event</span></div><ol></ol></div><p class="pgt-boundary"><b>Vertrag:</b> Das Modul reimplementiert die vorhandene Generation-Corner-Lesart und den gebundenen Pascal-Crosswalk. <code>J</code> ist hier ausschließlich der sichtbare +90° Iterationsschritt. Keine neue Pascal-Identität, kein physikalischer Resonanzmechanismus und keine Rekonstruktion der vier fehlenden historischen HTMLs.</p><div class="pgt-links"><a href="../../../../29_A0_PASCAL_GENERATION_CORNER_CROSSWALK_2026-10-10.md">Crosswalk ↗</a><a href="../../../results/a0-ioi-pascal-generation-turn-return-2026-11-05.json">Module Receipt ↗</a></div></div></div>`;
    anchor.insertAdjacentElement('afterend',host);
    return host;
  };
  const mount=()=>{
    const host=document.getElementById('pascalGenerationTurn')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    let state=createState();
    const pyramid=host.querySelector('.pgt-pyramid');
    const turnRing=host.querySelector('.pgt-turn-ring');
    const phaseTrack=host.querySelector('.pgt-phase-track');
    const ledger=host.querySelector('.pgt-ledger ol');
    const buttons=[...host.querySelectorAll('[data-pgt-action]')];
    const render=()=>{
      const rows=state.rows.concat(state.draft.length?[state.draft]:[]);
      pyramid.innerHTML=rows.map((row,rowIndex)=>`<div class="pgt-row${rowIndex===state.targetRow?' is-draft':''}" data-row="${rowIndex}">${row.map(cell=>`<span class="pgt-cell${rowIndex<state.rows.length?' is-released':' is-filling'}" title="${escape(cell.relation)}"><b>${cell.value}</b><small>${escape(cell.address)}</small></span>`).join('')}${rowIndex===state.targetRow&&state.draft.length<state.targetRow+1?Array.from({length:state.targetRow+1-state.draft.length},(_,index)=>`<span class="pgt-cell is-empty"><b>·</b><small>${escape(address(state.targetRow,state.draft.length+index))}</small></span>`).join(''):''}</div>`).join('');
      phaseTrack.innerHTML=PHASES.map(phase=>`<span class="${phase===state.phase?'is-active':''}">${phase}</span>`).join('<i>→</i>');
      turnRing.style.setProperty('--pgt-angle',`${state.angle}deg`);
      host.dataset.phase=state.phase.toLowerCase().replace(/[^a-z]+/g,'-');
      host.querySelector('[data-pgt-readout="state"]').textContent=stateLabel(state);
      host.querySelector('[data-pgt-readout="phase"]').textContent=state.phase;
      host.querySelector('[data-pgt-readout="target"]').textContent=`P${state.targetRow} / depth ${state.maxDepth}`;
      host.querySelector('[data-pgt-readout="angle"]').textContent=`${state.angle}° · turn ${state.gM}`;
      host.querySelector('[data-pgt-readout="relations"]').textContent=String(state.gR);
      host.querySelector('[data-pgt-readout="generations"]').textContent=String(state.gP);
      const latest=state.records.at(-1);
      host.querySelector('[data-pgt-readout="relation"]').textContent=latest?latest.relation:'SEED → P(0), P(1)';
      host.querySelector('[data-pgt-readout="events"]').textContent=`${state.history.length} events`;
      ledger.innerHTML=state.history.slice(-7).reverse().map(item=>`<li><span>t${item.t} · ${escape(item.event)}</span><small>${escape(item.detail)}</small></li>`).join('');
      buttons.forEach(button=>{
        const action=button.dataset.pgtAction;
        const key=action==='FILL_ROW'?'FILL':action;
        button.disabled=!can(state,key)||(action==='NEXT'&&state.targetRow>=state.maxDepth);
      });
      if(state.targetRow>=state.maxDepth&&state.phase==='J-TURN')host.querySelector('[data-pgt-action="NEXT"] small').textContent='depth-six bound';
    };
    buttons.forEach(button=>button.addEventListener('click',()=>{
      state=transition(state,button.dataset.pgtAction);
      render();
    }));
    render();
  };
  return {PHASES,MAX_DEPTH,address,makeCell,createState,can,fillOne,fillRow,release,turn,next,transition,stateLabel,createHost,mount};
});
