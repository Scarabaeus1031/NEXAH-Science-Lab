(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0IotaStage=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STATIONS=['AM₁','PM₁','VM','AM₂','PM₂'];
  const ORIENTATIONS=['0° · ORIGIN','90° · QUARTER','180° · JANUS','270° · BACKFLIP'];
  const JOINT_PERIOD=20;
  function stateAt(input){
    const requested=Math.max(0,Math.min(JOINT_PERIOD,Math.round(Number(input)||0)));
    const address=requested%JOINT_PERIOD;
    const stationIndex=address%5;
    const quarterIndex=Math.floor(address/5)%4;
    return Object.freeze({requested,address,stationIndex,station:STATIONS[stationIndex],quarterIndex,angle:quarterIndex*90,orientation:ORIENTATIONS[quarterIndex],cycle:Math.floor(requested/5),exactReturn:requested===JOINT_PERIOD,milestone:requested%5===0});
  }
  function uniqueAddresses(){return Array.from({length:JOINT_PERIOD},(_,i)=>`${stateAt(i).stationIndex}|${stateAt(i).quarterIndex}`)}
  function mount(rootNode){
    if(!rootNode)return null;
    const range=rootNode.querySelector('[data-iota-step]'),out=rootNode.querySelector('[data-iota-step-out]'),stationOut=rootNode.querySelector('[data-iota-station-out]'),angleOut=rootNode.querySelector('[data-iota-angle-out]'),addressOut=rootNode.querySelector('[data-iota-address-out]'),degree=rootNode.querySelector('[data-iota-degree]'),book=rootNode.querySelector('[data-iota-book]'),cube=rootNode.querySelector('[data-iota-cube]'),title=rootNode.querySelector('[data-stage-title]');
    let timer=0;
    function render(){
      const s=stateAt(range.value);out.textContent=`${s.requested} / 20`;stationOut.textContent=s.station;angleOut.textContent=s.exactReturn?'360° ≡ 0°':`${s.angle}°`;addressOut.textContent=s.exactReturn?'0|0 · RETURN':`${s.stationIndex}|${s.quarterIndex}`;
      degree.style.transform=`rotate(${s.angle-90}deg)`;
      rootNode.querySelectorAll('[data-station]').forEach((node,index)=>node.classList.toggle('active',index===s.stationIndex));
      const fold=18+s.quarterIndex*17;book.style.setProperty('--book-left',`${-fold}deg`);book.style.setProperty('--book-right',`${fold}deg`);
      cube.style.setProperty('--cube-open',String(.3+s.requested/20*1.3));title.classList.toggle('on',s.exactReturn);
      rootNode.dataset.state=s.exactReturn?'return':`step-${s.requested}`;
      rootNode.querySelectorAll('[data-milestone]').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.milestone)===s.requested));
      rootNode._iotaState=s;
    }
    range.addEventListener('input',render);
    rootNode.querySelectorAll('[data-milestone]').forEach(btn=>btn.addEventListener('click',()=>{range.value=btn.dataset.milestone;render()}));
    rootNode.querySelector('[data-iota-prev]').addEventListener('click',()=>{range.value=Math.max(0,Number(range.value)-1);render()});
    rootNode.querySelector('[data-iota-next]').addEventListener('click',()=>{range.value=Math.min(20,Number(range.value)+1);render()});
    rootNode.querySelector('[data-iota-play]').addEventListener('click',event=>{if(timer){clearInterval(timer);timer=0;event.currentTarget.textContent='PLAY 20';return}range.value=0;render();event.currentTarget.textContent='PAUSE';timer=setInterval(()=>{const n=Number(range.value)+1;range.value=Math.min(20,n);render();if(n>=20){clearInterval(timer);timer=0;event.currentTarget.textContent='PLAY 20'}},460)});
    render();return{render,state:()=>rootNode._iotaState};
  }
  return Object.freeze({STATIONS,ORIENTATIONS,JOINT_PERIOD,stateAt,uniqueAddresses,mount});
});

if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-iota-root]').forEach(node=>window.A0IotaStage.mount(node)));
