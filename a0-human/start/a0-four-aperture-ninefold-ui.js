(function(){
  'use strict';
  function mount(doc,win=doc.defaultView||{}){const P=win.A0FourApertureNinefold,bridge=win.A0NativeFaceBenchController,status=doc.getElementById('ninefoldStatus'),trace=doc.getElementById('ninefoldTrace');let state=P.createState(),timer=0,busy=false,receipt=null;
    function render(){const phase=state.index<0?null:P.PHASES[state.index];status.textContent=state.index<0?'READY · 4×2+1':`${String(state.index+1).padStart(2,'0')} / 09 · ${phase.id}${state.completed?' · RETURNED':''}`;[...trace.children].forEach((n,i)=>{n.classList.toggle('active',i===state.index);n.classList.toggle('done',i<state.index||(state.completed&&i===state.index))});doc.getElementById('ninefoldRecord').textContent=JSON.stringify(P.record(state,receipt),null,2)}
    async function step(){if(busy||state.completed)return;busy=true;try{if(state.index<0){await bridge.connect();await bridge.capture()}state=P.next(state);const phase=P.PHASES[state.index];if(phase.direction==='PIVOT')await bridge.setFace(48,0);else await bridge.setFace(phase.face,P.angleFor(phase));if(state.completed){const result=await bridge.returnSource();receipt=result.returnReceipt;stop()}render()}catch(error){status.textContent=`HOLD · ${error.message}`;stop()}finally{busy=false}}
    function play(){if(state.completed)reset();doc.getElementById('ninefoldPlay').textContent='Ⅱ PAUSE';clearInterval(timer);timer=win.setInterval(step,850);step()}
    function stop(){clearInterval(timer);timer=0;doc.getElementById('ninefoldPlay').textContent='▶ PLAY 4×2+1'}
    function reset(){stop();state=P.createState();receipt=null;render()}
    doc.getElementById('ninefoldPlay').addEventListener('click',()=>timer?stop():play());doc.getElementById('ninefoldStep').addEventListener('click',step);doc.getElementById('ninefoldReset').addEventListener('click',reset);render();return Object.freeze({play,stop,step,reset,get record(){return P.record(state,receipt)}})}
  window.A0FourApertureNinefoldUI={mount};
})();
