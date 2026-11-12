(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.A0TubeRouting=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const MAX_STEP=3;
  const ROUTES=Object.freeze({
    g7:Object.freeze({
      id:'g7',inputRecord:'SRC:G7',inputValue:7,rule:'PRIME_INDEX(n)',
      outputAddress:'Q17',outputValue:17,expectedKey:'G7',
      phases:['INPUT','ROUTE','OUTPUT','RETURN'],
      nodeLabels:['INPUT','RULE','OUTPUT','RETURN'],nodeValues:['G7','p₇','Q17','KEY'],
      path:'G7 → p₇=17 → Q17 → G7'
    }),
    g8:Object.freeze({
      id:'g8',inputRecord:'SRC:G8',inputValue:8,rule:'KEY_CORNER(R,R,R,L)',
      outputAddress:'KEY_CORNER',outputValue:'DO·RE·MI·FA',expectedKey:'G8',
      phases:['DO','RE','MI','FA / RETURN'],
      nodeLabels:['DO','RE','MI','FA'],nodeValues:['R','R','R','L'],
      path:'G8=2³ → DO/RE/MI/FA → R/R/R/L → G8'
    })
  });
  const clamp=n=>Math.max(0,Math.min(MAX_STEP,Number(n)||0));
  const routeFor=id=>ROUTES[id==='g8'?'g8':'g7'];
  function derive(step=0,keyMode='match',routeId='g7'){
    const route=routeFor(routeId),s=clamp(step),mode=keyMode==='mismatch'?'mismatch':'match';
    const wrongKey=route.expectedKey==='G7'?'G8':'G7';
    const returned=mode==='match'?route.expectedKey:wrongKey;
    const done=s===MAX_STEP;
    return {
      routeId:route.id,step:s,keyMode:mode,phase:route.phases[s],
      inputRecord:route.inputRecord,inputValue:route.inputValue,
      rule:s>=1?route.rule:'PENDING',
      outputAddress:s>=2?route.outputAddress:'—',
      outputValue:s>=2?route.outputValue:null,
      returnKey:s>=3?returned:'—',expectedKey:route.expectedKey,
      status:done?(mode==='match'?'PASS':'FAIL_CLOSED'):'PENDING',
      nodeLabels:route.nodeLabels,nodeValues:route.nodeValues,path:route.path
    };
  }
  function next(state){return derive(clamp((state?.step||0)+1),state?.keyMode,state?.routeId);}
  function reset(keyMode='match',routeId='g7'){return derive(0,keyMode,routeId);}
  function verify(state){
    const route=routeFor(state?.routeId);
    return state?.step===MAX_STEP&&state.inputRecord===route.inputRecord&&
      state.inputValue===route.inputValue&&state.rule===route.rule&&
      state.outputAddress===route.outputAddress&&state.outputValue===route.outputValue&&
      state.returnKey===route.expectedKey&&state.status==='PASS';
  }
  function mount(doc){
    const host=doc?.getElementById('tube-routing-contract');
    if(!host)return null;
    let state=derive(0,'match','g7');
    const out=name=>host.querySelector('[data-tube-output="'+name+'"]');
    const nodes=[...host.querySelectorAll('[data-tube-node]')];
    const keyModes=[...host.querySelectorAll('[data-tube-key-mode]')];
    const routeModes=[...host.querySelectorAll('[data-tube-route]')];
    function render(){
      host.dataset.tubeStep=String(state.step);
      host.dataset.tubeStatus=state.status;
      host.dataset.tubeRoute=state.routeId;
      for(const key of ['phase','inputRecord','inputValue','rule','outputAddress','outputValue','returnKey','status']){
        const el=out(key); if(el) el.textContent=state[key]===null?'—':String(state[key]);
      }
      nodes.forEach((node,index)=>{
        node.dataset.active=String(index<=state.step);
        const label=node.querySelector('[data-tube-node-label]');
        const value=node.querySelector('[data-tube-node-value]');
        if(label)label.textContent=state.nodeLabels[index];
        if(value)value.textContent=state.nodeValues[index];
      });
      routeModes.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tubeRoute===state.routeId)));
      keyModes.forEach(button=>{
        const key=button.dataset.tubeKeyMode==='match'?state.expectedKey:(state.expectedKey==='G7'?'G8':'G7');
        button.textContent='Key '+key+(button.dataset.tubeKeyMode==='match'?' · passend':' · Kontrolle');
        button.setAttribute('aria-pressed',String(button.dataset.tubeKeyMode===state.keyMode));
      });
      const routeLabel=host.querySelector('[data-tube-route-label]');
      if(routeLabel)routeLabel.textContent=state.routeId==='g8'?'G8=2³ · KEY CORNER · R/R/R/L':'G7 → Q17 → G7 · PRIME ROUTE';
      const caption=host.querySelector('[data-tube-caption]');
      if(caption)caption.innerHTML=state.routeId==='g8'?
        '<code>G8=2³</code> läuft als deklarierte View-Choreografie <code>DO→RE→MI→FA</code> mit <code>R/R/R/L</code>. Das ist kein neuer Rubik-Operator.':
        'Die Regel ist endlich und source-bound: <code>G7 → p₇=17 → Q17</code>. Der Rückschlüssel prüft Herkunft, nicht bloß denselben Zahlenwert.';
      const live=host.querySelector('[data-tube-live]');
      if(live) live.textContent=state.status==='PASS'?'Exact return: '+state.path:
        state.status==='FAIL_CLOSED'?'Return blocked: expected '+state.expectedKey+', received '+state.returnKey:
        state.phase+' selected';
    }
    host.querySelector('[data-tube-next]')?.addEventListener('click',()=>{state=next(state);render();});
    host.querySelector('[data-tube-run]')?.addEventListener('click',()=>{state=derive(MAX_STEP,state.keyMode,state.routeId);render();});
    host.querySelector('[data-tube-reset]')?.addEventListener('click',()=>{state=reset(state.keyMode,state.routeId);render();});
    routeModes.forEach(button=>button.addEventListener('click',()=>{state=derive(0,'match',button.dataset.tubeRoute);render();}));
    keyModes.forEach(button=>button.addEventListener('click',()=>{state=derive(state.step,button.dataset.tubeKeyMode,state.routeId);render();}));
    render();
    return {getState:()=>({...state}),derive,next,reset,verify};
  }
  return {derive,next,reset,verify,mount,MAX_STEP,ROUTES};
});
