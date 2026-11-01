(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0ScarabStretchChamber=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.1.0';
  const SOURCE_ID='NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1';
  const BENCH_ID='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const PHASE_EVENT='a0:breathing-crystal-measurement';
  const VIEW_ORDER=Object.freeze(['STRETCH_BODY','SECTION_CUT','SEAM_RETURN']);
  const SEAM_ORDER=Object.freeze([3,1,2]);
  const THETA_PAIR=Object.freeze([5,4]);
  const ADDRESS_FIXTURES=Object.freeze({left:63,right:64,pair:127,facets:54,total:181});
  const MECHANISM_PARTITION=Object.freeze({source_flanks:2,mirror_passes:2,oriented_return:1,ratio:'2:2:1'});
  const PLATE_PROJECTION=Object.freeze({view_role:'SECTION_CUT',camera_pose:'TOP_DOWN_Z',shape:'CARO',new_view:false});
  const clamp=phase=>Math.max(0,Math.min(1,Number.isFinite(Number(phase))?Number(phase):0));
  function lambdaAt(phase=0){return 1+0.22*Math.sin(2*Math.PI*clamp(phase));}
  function stretchMatrix(phase=0){const lambda=lambdaAt(phase),cross=1/Math.sqrt(lambda);return Object.freeze([[lambda,0,0],[0,cross,0],[0,0,cross]].map(row=>Object.freeze(row)));}
  function determinant(matrix){return matrix[0][0]*matrix[1][1]*matrix[2][2];}
  function snapshot(phase=0){
    const p=clamp(phase),lambda=lambdaAt(p),matrix=stretchMatrix(p),cross=matrix[1][1],det=determinant(matrix),returnError=Math.max(Math.abs(lambda-1),Math.abs(cross-1));
    return Object.freeze({schema:'nexah.a0.scarab-stretch-chamber-frame/1.1.0',version:VERSION,source_identity:SOURCE_ID,bench_identity:BENCH_ID,phase:p,clock:'breath.phase',source_dimensions:Object.freeze([2,1,1]),stretch_dimensions:Object.freeze([2*lambda,cross,cross]),stretch_matrix:matrix,determinant:det,volume_preserved:Math.abs(det-1)<=1e-12,source_plus_views:Object.freeze({source:1,views:VIEW_ORDER}),mechanism_partition:MECHANISM_PARTITION,plate_projection:PLATE_PROJECTION,seam_order:SEAM_ORDER,theta_pair:THETA_PAIR,address_fixtures:ADDRESS_FIXTURES,exact_return:returnError<=1e-12,return_error:returnError,source_mutation:false,new_canonical_ids:Object.freeze([]),relation_changes:Object.freeze([]),claim_boundary:'Source-bound 1+3 view coupling only. The Teller/Caro is a TOP_DOWN_Z camera pose inside SECTION_CUT, not another source or view identity. The 2:2:1 mechanism ledger means two source flanks, two typed mirror passes A/B and one oriented return; it is distinct from the existing 1:2:1 diagonal point count. Scarabaeus is a transport/view role; stretch is an analytic display transform; seam order, theta pair and arithmetic fixtures do not establish a new carrier, topology, physical chamber or scientific identity.'});
  }
  function cuboidPoints(frame){const [x,y,z]=frame.stretch_dimensions,sx=58*x,sy=72*y,sz=42*z,ox=110,oy=128;return{a:[ox-sx/2,oy+sy/2],b:[ox+sx/2,oy+sy/2],c:[ox+sx/2,oy-sy/2],d:[ox-sx/2,oy-sy/2],e:[ox-sx/2+sz,oy+sy/2-sz],f:[ox+sx/2+sz,oy+sy/2-sz],g:[ox+sx/2+sz,oy-sy/2-sz],h:[ox-sx/2+sz,oy-sy/2-sz]};}
  const path=(points,ids)=>ids.map((id,index)=>`${index?'L':'M'}${points[id][0].toFixed(2)} ${points[id][1].toFixed(2)}`).join(' ')+'Z';
  function drawing(frame){
    const p=cuboidPoints(frame),pulse=(frame.phase*360).toFixed(1),lambda=frame.stretch_matrix[0][0].toFixed(6),cross=frame.stretch_matrix[1][1].toFixed(6),ret=frame.exact_return?'EXACT RETURN':'STRETCH VIEW';
    const plateX=310,plateY=75,plateRx=32*frame.stretch_matrix[0][0]/1.22,plateRy=32*frame.stretch_matrix[1][1]/1.132277;
    return `<g class="ssc-source"><path d="${path(p,['a','b','c','d'])}"/><path d="${path(p,['e','f','g','h'])}"/><path d="M${p.a.join(' ')}L${p.e.join(' ')}M${p.b.join(' ')}L${p.f.join(' ')}M${p.c.join(' ')}L${p.g.join(' ')}M${p.d.join(' ')}L${p.h.join(' ')}"/></g><g class="ssc-cut"><path d="M${p.d.join(' ')}L${p.f.join(' ')}L${p.g.join(' ')}L${p.a.join(' ')}Z"/><path d="M${p.d.join(' ')}L${p.g.join(' ')}M${p.a.join(' ')}L${p.f.join(' ')}"/></g><g class="ssc-plate"><circle cx="${plateX}" cy="${plateY}" r="48"/><path d="M${plateX} ${plateY-plateRy}L${plateX+plateRx} ${plateY}L${plateX} ${plateY+plateRy}L${plateX-plateRx} ${plateY}Z"/><path d="M${plateX} ${plateY-plateRy}L${plateX} ${plateY+plateRy}M${plateX-plateRx} ${plateY}L${plateX+plateRx} ${plateY}"/><circle cx="${plateX}" cy="${plateY}" r="4"/><text x="${plateX-42}" y="${plateY+66}">TELLER · CARO · Z↓</text><text x="${plateX-4}" y="${plateY-plateRy-5}">3</text><text x="${plateX+plateRx+5}" y="${plateY+3}">1</text><text x="${plateX-4}" y="${plateY+plateRy+12}">2</text></g><g class="ssc-seam"><circle cx="${p.d[0]}" cy="${p.d[1]}" r="5"/><circle cx="${p.f[0]}" cy="${p.f[1]}" r="5"/><circle cx="${p.g[0]}" cy="${p.g[1]}" r="5"/><text x="18" y="25">SOURCE · 2×1×1</text><text x="18" y="210">λ ${lambda} · μ ${cross}</text><text x="18" y="230">θ ${pulse}° · ${ret}</text></g>`;
  }
  function receipt(frame){return{schema:'nexah.a0.scarab-stretch-chamber-return/1.1.0',created_at:new Date().toISOString(),...frame,identity_reuse:[SOURCE_ID,BENCH_ID,'NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1'],reading_candidates:['C+3^3','12:1','SCARAB_CHAMBER'],finding_or_manuscript_effect:'NONE',publication_or_deployment:'NONE'};}
  function mount(doc,rootWindow){
    const shell=doc.querySelector('[data-ssc]');if(!shell)return null;const win=rootWindow||doc.defaultView||root,svg=shell.querySelector('[data-ssc-svg]'),status=shell.querySelector('[data-ssc-status]'),phaseOut=shell.querySelector('[data-ssc-phase]'),lambdaOut=shell.querySelector('[data-ssc-lambda]'),crossOut=shell.querySelector('[data-ssc-cross]'),detOut=shell.querySelector('[data-ssc-det]'),returnOut=shell.querySelector('[data-ssc-return]');let current=snapshot(0);
    function render(frame=current){current=frame;svg.innerHTML=drawing(frame);phaseOut.textContent=frame.phase.toFixed(6);lambdaOut.textContent=frame.stretch_matrix[0][0].toFixed(6);crossOut.textContent=frame.stretch_matrix[1][1].toFixed(6);detOut.textContent=frame.determinant.toFixed(12);returnOut.textContent=frame.exact_return?'PASS · EXACT':'OPEN · SHARED PHASE';status.textContent=`${frame.volume_preserved?'PASS':'FAIL'} · 1+3 · MECHANISM 2:2:1 · DET ${frame.determinant.toFixed(12)} · SEAM 3→1→2 · θ 5|4 · ${frame.exact_return?'RETURN':'STRETCH'}`;shell.dataset.sscReturn=frame.exact_return?'exact':'open';return frame;}
    function setSharedPhase(value){const input=doc.querySelector('[data-bcb-phase]');if(!input)return render(snapshot(value));input.value=String(clamp(value));input.dispatchEvent(new win.Event('input',{bubbles:true}));return current;}
    doc.addEventListener(PHASE_EVENT,event=>{const phase=event.detail&&event.detail.frame?event.detail.frame.phase:0;render(snapshot(phase));});
    shell.querySelectorAll('[data-ssc-set-phase]').forEach(button=>button.addEventListener('click',()=>setSharedPhase(Number(button.dataset.sscSetPhase))));
    shell.querySelector('[data-ssc-export]').addEventListener('click',()=>{const a=doc.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(receipt(current),null,2)],{type:'application/json'}));a.download='a0-scarab-stretch-chamber-return.json';a.click();URL.revokeObjectURL(a.href);});
    render(current);return{getState:()=>current,setPhase:setSharedPhase,render,receipt:()=>receipt(current)};
  }
  return{VERSION,SOURCE_ID,BENCH_ID,PHASE_EVENT,VIEW_ORDER,SEAM_ORDER,THETA_PAIR,ADDRESS_FIXTURES,MECHANISM_PARTITION,PLATE_PROJECTION,lambdaAt,stretchMatrix,determinant,snapshot,drawing,receipt,mount};
});
