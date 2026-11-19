(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0DoublePentagonBook=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STATES=['OPEN','FOLD','COUNTERFACE','RETURN'];
  const STATIONS=['AM₁','PM₁','VM','AM₂','PM₂'];
  const ORIENTATIONS=[0,90,180,270];
  function clamp(value,min,max){return Math.max(min,Math.min(max,Math.round(Number(value)||0)))}
  function addressAt(step){
    const requested=clamp(step,0,20),address=requested%20,stationIndex=address%5,quarterIndex=Math.floor(address/5)%4;
    return Object.freeze({requested,address,stationIndex,station:STATIONS[stationIndex],quarterIndex,orientation:ORIENTATIONS[quarterIndex],exactReturn:requested===20});
  }
  function viewAt(state){
    const id=STATES.includes(String(state).toUpperCase())?String(state).toUpperCase():'OPEN';
    return Object.freeze({id,left:{OPEN:-12,FOLD:-48,COUNTERFACE:-84,RETURN:-4}[id],right:{OPEN:12,FOLD:48,COUNTERFACE:84,RETURN:4}[id]});
  }
  function mount(node){
    if(!node)return null;
    const range=node.querySelector('[data-book-step]'),address=node.querySelector('[data-book-address]'),station=node.querySelector('[data-book-station]'),orientation=node.querySelector('[data-book-orientation]');
    let active='OPEN';
    function render(){
      const a=addressAt(range.value),v=viewAt(active);
      node.dataset.view=v.id.toLowerCase();node.style.setProperty('--left-fold',`${v.left}deg`);node.style.setProperty('--right-fold',`${v.right}deg`);
      address.textContent=a.exactReturn?'0|0 · RETURN':`${a.stationIndex}|${a.quarterIndex}`;station.textContent=a.station;orientation.textContent=a.exactReturn?'360° ≡ 0°':`${a.orientation}°`;
      node.querySelectorAll('[data-book-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.bookView===v.id)));
      node._bookState=Object.freeze({address:a,view:v});
    }
    range.addEventListener('input',render);
    node.querySelectorAll('[data-book-view]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.bookView;render()}));
    render();return{render,state:()=>node._bookState};
  }
  return Object.freeze({STATES,STATIONS,ORIENTATIONS,addressAt,viewAt,mount});
});
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-double-book-root]').forEach(node=>window.A0DoublePentagonBook.mount(node)));
