(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./a0-primecube-model.js'));
  else{
    const api=factory(root.A0PrimecubeModel);
    root.A0PrimecubeRotorDemonstrator=api;
    if(root.document)api.boot(root.document);
  }
})(typeof window!=='undefined'?window:globalThis,function(M){
  'use strict';

  const MODES=Object.freeze(['ROTOR','HANDLE_101','CONTROL_369','JOINT_89']);

  function normalizeIndex(index,period){
    const n=Math.trunc(Number(index)||0);
    return ((n%period)+period)%period;
  }

  function view(mode='ROTOR',index=0){
    if(!M)throw new Error('A0PrimecubeModel is required');
    if(!MODES.includes(mode))throw new RangeError(`unknown rotor mode ${mode}`);
    const record=M.fractalDirectFieldRecord(),rotor=record.mod11Rotor,joint=record.joint89;
    const step=normalizeIndex(index,rotor.order),current=rotor.orbit[step],next=rotor.orbit[step+1];
    if(mode==='HANDLE_101')return Object.freeze({mode,step,current:2,next:4,title:'101 HANDLE / REPRESENTATIVE SWITCH',equation:'101₁₀=92₁₁≡2 → 4',status:'2501≠2×101',detail:'101 and 2501 are distinct integers; only their residues follow the ×2 operator.'});
    if(mode==='CONTROL_369')return Object.freeze({mode,step,current,next,title:'3–6–9 CLOSURE PROBE',equation:'3→6 · 6→1 · 9→7',status:'FAIL_CLOSED_SUBSET',detail:'1 and 7 leave {3,6,9}; Root2 remains HOLD.'});
    if(mode==='JOINT_89')return Object.freeze({mode,step,current:8,next:9,title:'8/9 TYPED JOINT',equation:'8+9=17 · 8×9=72 · (8/9)(9/8)=1',status:'83=p₂₃ · 23|3565',detail:'8|3 is decimal concatenation; it is not multiplication or residue reduction.',joint});
    return Object.freeze({mode,step,current,next,title:'COMPLETE ×2 MOD 11 ROTOR',equation:`${current}×2≡${next} (mod 11)`,status:`STEP ${step+1}/10`,detail:'The ten-step orbit visits every nonzero residue and returns to 2.'});
  }

  function stageSvg(snapshot){
    const record=M.fractalDirectFieldRecord(),orbit=record.mod11Rotor.orbit,cx=180,cy=170,r=122,positions=[];
    for(let n=0;n<11;n++){const a=-Math.PI/2+n*Math.PI*2/11;positions[n]=[cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
    const subset=snapshot.mode==='CONTROL_369'?[3,6,9]:[];
    const nodes=[];
    for(let n=0;n<11;n++){
      const [x,y]=positions[n],active=n===snapshot.current,target=n===snapshot.next,inSubset=subset.includes(n);
      const fill=active?'#ef62dd':target?'#58dcff':inSubset?'#f5d56a':n===0?'#202c3c':'#405674';
      nodes.push(`<g><circle cx="${x}" cy="${y}" r="${active?14:target?12:inSubset?10:7}" fill="${fill}" stroke="#e9f2ff" stroke-width="${active||target?2:1}"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="${inSubset&&!active&&!target?'#111827':'#fff'}" font-size="10" font-weight="800">${n}</text></g>`);
    }
    const [x1,y1]=positions[snapshot.current],[x2,y2]=positions[snapshot.next];
    const path=snapshot.mode==='ROTOR'?`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="3" marker-end="url(#rotorArrow)"/>`:'';
    const ghost=snapshot.mode==='ROTOR'?orbit.slice(0,-1).map((n,i)=>{const [x,y]=positions[n];return `<text x="${x}" y="${y-17}" text-anchor="middle" fill="#718198" font-size="8">${i+1}</text>`}).join(''):'';
    return `<svg viewBox="0 0 360 340" role="img" aria-label="${snapshot.title}"><defs><marker id="rotorArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#fff"/></marker></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#334760" stroke-dasharray="3 5"/>${path}${ghost}${nodes.join('')}<text x="${cx}" y="${cy-4}" text-anchor="middle" fill="#dce8f7" font-size="13">${snapshot.mode==='ROTOR'?'r ↦ 2r mod 11':snapshot.mode.replaceAll('_',' ')}</text><text x="${cx}" y="${cy+17}" text-anchor="middle" fill="#91a0b5" font-size="9">${snapshot.status}</text></svg>`;
  }

  function boot(doc){
    const root=doc.querySelector('[data-pc-rotor-demo]');
    if(!root)return false;
    let mode='ROTOR',index=0,timer=null;
    const stage=root.querySelector('[data-pc-rotor-stage]'),title=root.querySelector('[data-pc-rotor-title]'),equation=root.querySelector('[data-pc-rotor-equation]'),status=root.querySelector('[data-pc-rotor-status]'),detail=root.querySelector('[data-pc-rotor-detail]');
    function stop(){if(timer!==null){clearInterval(timer);timer=null}root.querySelector('[data-pc-rotor-run]').textContent='RUN 10'}
    function render(){const snapshot=view(mode,index);stage.innerHTML=stageSvg(snapshot);title.textContent=snapshot.title;equation.textContent=snapshot.equation;status.textContent=snapshot.status;detail.textContent=snapshot.detail;root.querySelectorAll('[data-pc-rotor-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcRotorMode===mode)))}
    root.querySelectorAll('[data-pc-rotor-mode]').forEach(button=>button.addEventListener('click',()=>{stop();mode=button.dataset.pcRotorMode;index=0;render()}));
    root.querySelector('[data-pc-rotor-prev]').addEventListener('click',()=>{stop();index--;render()});
    root.querySelector('[data-pc-rotor-next]').addEventListener('click',()=>{stop();index++;render()});
    root.querySelector('[data-pc-rotor-reset]').addEventListener('click',()=>{stop();mode='ROTOR';index=0;render()});
    root.querySelector('[data-pc-rotor-run]').addEventListener('click',event=>{if(timer!==null){stop();return}mode='ROTOR';index=0;event.currentTarget.textContent='PAUSE';render();timer=setInterval(()=>{index++;render();if(normalizeIndex(index,10)===0&&index>0)stop()},420)});
    render();
    return true;
  }

  return Object.freeze({MODES,normalizeIndex,view,stageSvg,boot});
});
