(function(){
  'use strict';
  const M=globalThis.A0PrimecubeModel;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const path=points=>points.map((p,index)=>`${index?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  function transverse(record,mode){
    const cx=225,cy=278,scale=42,root=record.rootSlice;
    let shells='';
    if(mode==='ROOT_SLICES')for(let k=1;k<=12;k++){const r=Math.sqrt(k)*30;shells+=`<circle class="pc-rt-shell${k===root.k?' selected':''}" cx="${cx}" cy="${cy}" r="${r.toFixed(2)}"/>`}
    const pts=record.orbit.samples.map(p=>({x:cx+p.x*scale,y:cy-p.y*scale}));
    const crossing=record.winding.value===null;
    return `<g><text class="pc-rt-label strong" x="34" y="34">TRANSVERSE ROOT SLICE · (x,y)</text>${shells}<line class="pc-rt-cross" x1="55" y1="${cy}" x2="395" y2="${cy}"/><line class="pc-rt-cross" x1="${cx}" y1="108" x2="${cx}" y2="448"/><circle class="pc-rt-axis-dot${crossing?' fail':''}" cx="${cx}" cy="${cy}" r="8"/><path class="pc-rt-orbit${crossing?' fail':''}" d="${path(pts)}"/><text class="pc-rt-label" x="${cx+12}" y="${cy-13}">L ∩ slice</text><text class="pc-rt-label gold" x="55" y="476">ρ=${record.orbit.radius.toFixed(2)} · φ=${crossing?'UNDEFINED AT L':'atan2(y,x)'} · w=${crossing?'UNDEFINED':record.winding.value}</text></g>`;
  }
  function axial(record){
    const cx=665,top=82,bottom=470,sx=34,sy=86;
    const pts=record.orbit.samples.map(p=>({x:cx+p.x*sx,y:276-p.h*sy/3+p.y*6}));
    const front=pts.filter((_,i)=>record.orbit.samples[i].y>=0),back=pts.filter((_,i)=>record.orbit.samples[i].y<0);
    return `<g><text class="pc-rt-label strong" x="475" y="34">AXIAL PROJECTION · CRITICAL LINE L</text><line class="pc-rt-line" x1="${cx}" y1="${top}" x2="${cx}" y2="${bottom}"/><path class="pc-rt-orbit back" d="${path(back)}"/><path class="pc-rt-orbit" d="${path(front)}"/><text class="pc-rt-label" x="${cx+12}" y="${top+8}">L={(0,0,h)}</text><text class="pc-rt-label" x="475" y="500">closed γ:S¹→ℝ³∖L · m=${record.orbit.turns}</text><circle class="pc-rt-cap" cx="${cx}" cy="${top}" r="5"/><circle class="pc-rt-cap" cx="${cx}" cy="${bottom}" r="5"/></g>`;
  }
  function render(root,state){
    const crossing=state.mode==='AXIS_CROSSING';
    const record=M.criticalLineRootTopologyRecord({radius:state.radius,height:state.height,turns:state.turns,slice:state.slice,crossing});
    root.querySelector('[data-pc-rt-stage]').innerHTML=`<svg viewBox="0 0 900 540" role="img" aria-label="Critical line, root slices and closed-loop winding demonstrator">${transverse(record,state.mode)}<line class="pc-rt-divider" x1="450" y1="18" x2="450" y2="522"/>${axial(record)}</svg>`;
    const rootSlice=record.rootSlice,status=record.winding.status;
    root.querySelector('[data-pc-rt-detail]').innerHTML=`<div class="pc-eyebrow">Bounded topology record</div><h3>${crossing?'AXIS HIT':`w = ${record.winding.value}`}</h3><span class="pc-rt-status ${crossing?'fail':''}">${status.replaceAll('_',' ')}</span><dl><dt>Ambient</dt><dd>${record.ambientSpace}</dd><dt>Critical line</dt><dd>${esc(record.criticalLine.equation)}</dd><dt>Complement</dt><dd>${esc(record.criticalLine.complement)}</dd><dt>Orbit</dt><dd>closed · m=${record.orbit.turns}<br>ρ=${record.orbit.radius.toFixed(2)} · h=${record.orbit.height.toFixed(2)}</dd><dt>Winding</dt><dd>${record.winding.value===null?'UNDEFINED':record.winding.value}<br>${record.winding.formula}</dd><dt>Root slice</dt><dd>k=${rootSlice.k} · √k=${rootSlice.radius.toFixed(6)}<br>Δ=${rootSlice.delta.toFixed(9)}</dd><dt>Scope</dt><dd>${record.classification.scope.replaceAll('_',' ')}</dd><dt>Still needed</dt><dd>${record.additionalInvariants.join(' · ')}</dd><dt>Authority</dt><dd>0 new IDs · 0 relations</dd></dl><p class="pc-detail-boundary"><b>${crossing?'FAIL VISIBLE: POLAR ANGLE LOST.':'INTEGER CLASS INSIDE THE DECLARED COMPLEMENT.'}</b> ${record.boundary}</p>`;
    root.querySelectorAll('[data-pc-rt-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcRtMode===state.mode)));
    for(const key of ['radius','height','turns','slice'])root.querySelector(`[data-pc-rt-${key}-out]`).textContent=key==='radius'||key==='height'?Number(state[key]).toFixed(2):String(state[key]);
  }
  function boot(){
    const root=document.querySelector('[data-pc-root-topology]');if(!root||!M)return;
    const state={mode:'ORBIT',radius:2,height:.75,turns:1,slice:5};
    root.addEventListener('click',event=>{const button=event.target.closest('[data-pc-rt-mode]');if(!button)return;state.mode=button.dataset.pcRtMode;render(root,state)});
    for(const key of ['radius','height','turns','slice'])root.querySelector(`[data-pc-rt-${key}]`).addEventListener('input',event=>{state[key]=Number(event.target.value);render(root,state)});
    render(root,state);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
