(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0ArchitectureDifferenceTZL=api;api.mountAll();}})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=2*Math.PI;
  function binomial(n,k){if(!Number.isInteger(n)||!Number.isInteger(k)||n<0||k<0||k>n)return 0;let v=1;for(let i=1;i<=Math.min(k,n-k);i++)v=v*(n-i+1)/i;return v;}
  function pascalRow(n){return Array.from({length:n+1},(_,k)=>binomial(n,k));}
  function fibonacci(n){if(!Number.isInteger(n)||n<0)throw new RangeError('n must be a non-negative integer');let a=0,b=1;for(let i=0;i<n;i++)[a,b]=[b,a+b];return a;}
  function fibonacciDiagonal(n){const terms=[];for(let k=0;k<=Math.floor(n/2);k++)terms.push(binomial(n-k,k));return{n,terms,sum:terms.reduce((a,b)=>a+b,0),fibonacci:fibonacci(n+1)};}
  function cubeLedger(d){
    if(!Number.isInteger(d)||d<1||d>30)throw new RangeError('d must be an integer from 1 to 30');
    const shells=pascalRow(d),total=shells.reduce((a,b)=>a+b,0),signed=shells.reduce((a,b,k)=>a+(k%2?-b:b),0);
    return{dimension:d,shells,total,normalized:shells.map(v=>v/total),normalizedTotal:shells.reduce((a,b)=>a+b/total,0),signed};
  }
  function exactCubeFacts(){return{twelveCube:12**3,ramanujan:12**3+1,ramanujanA:1**3+12**3,ramanujanB:9**3+10**3,consecutive:23**3+24**3+25**3,square:204**2,voxelTen:10**3,binaryTen:2**10};}
  function add(a,b){return{re:a.re+b.re,im:a.im+b.im};}
  function phase(weight,harmonic,theta){return{weight,harmonic,re:weight*Math.cos(harmonic*theta),im:weight*Math.sin(harmonic*theta)};}
  function eulerBridge(theta){const components=[phase(1,0,theta),phase(2,1,theta),phase(1,2,theta)];const resultant=components.reduce(add,{re:0,im:0});const amplitude=4*Math.cos(theta/2)**2;const closed={re:amplitude*Math.cos(theta),im:amplitude*Math.sin(theta)};return{theta,components,resultant,closed,magnitude:Math.hypot(resultant.re,resultant.im),amplitude,phase:Math.atan2(resultant.im,resultant.re)};}
  function audit(){const diagonals=Array.from({length:10},(_,n)=>fibonacciDiagonal(n));const samples=Array.from({length:33},(_,i)=>eulerBridge(TAU*i/32));const ledgers=Array.from({length:10},(_,i)=>cubeLedger(i+1));const facts=exactCubeFacts();return{row2:pascalRow(2),diagonalsMatch:diagonals.every(d=>d.sum===d.fibonacci),eulerMatches:samples.every(s=>Math.hypot(s.resultant.re-s.closed.re,s.resultant.im-s.closed.im)<1e-10),cubeLedgersClose:ledgers.every(d=>d.total===2**d.dimension&&d.signed===0&&Math.abs(d.normalizedTotal-1)<1e-12),cubeFactsClose:facts.ramanujan===facts.ramanujanA&&facts.ramanujan===facts.ramanujanB&&facts.consecutive===facts.square,constructive:eulerBridge(0).magnitude,quarter:eulerBridge(Math.PI/2).magnitude,cut:eulerBridge(Math.PI).magnitude};}
  function mount(el){
    const slider=el.querySelector('[data-tzl-theta]'),valueEls=el.querySelectorAll('[data-tzl-value]'),magnitude=el.querySelector('[data-tzl-magnitude]'),state=el.querySelector('[data-tzl-state]');
    const componentEls=[0,1,2].map(i=>el.querySelector(`[data-tzl-component="${i}"]`)),resultantEl=el.querySelector('[data-tzl-resultant]'),pointEls=[0,1,2,3].map(i=>el.querySelector(`[data-tzl-point="${i}"]`));
    const origin={x:270,y:230},scale=48,screen=p=>({x:origin.x+scale*p.re,y:origin.y-scale*p.im});
    function line(node,a,b){node.setAttribute('x1',a.x);node.setAttribute('y1',a.y);node.setAttribute('x2',b.x);node.setAttribute('y2',b.y);}
    function render(){const degrees=Number(slider.value),bridge=eulerBridge(degrees*Math.PI/180),points=[{re:0,im:0}];bridge.components.forEach(c=>points.push(add(points[points.length-1],c)));const screenPoints=points.map(screen);componentEls.forEach((node,i)=>line(node,screenPoints[i],screenPoints[i+1]));line(resultantEl,screenPoints[0],screenPoints[3]);pointEls.forEach((node,i)=>{node.setAttribute('cx',screenPoints[i].x);node.setAttribute('cy',screenPoints[i].y);});valueEls.forEach(node=>node.textContent=`${degrees.toFixed(0)}°`);magnitude.textContent=bridge.magnitude.toFixed(3);state.textContent=bridge.magnitude<1e-8?'cut / cancellation':bridge.magnitude>3.95?'constructive alignment':'partial composition';}
    slider.addEventListener('input',render);render();
  }
  function mountCubeLedger(el){
    const slider=el.querySelector('[data-cube-dimension]'),dimension=el.querySelector('[data-cube-d]'),row=el.querySelector('[data-cube-row]'),total=el.querySelector('[data-cube-total]'),signed=el.querySelector('[data-cube-signed]'),normalized=el.querySelector('[data-cube-normalized]');
    function render(){const d=Number(slider.value),ledger=cubeLedger(d);dimension.textContent=d;row.textContent=ledger.shells.join(' : ');total.textContent=ledger.total;normalized.textContent=ledger.normalizedTotal.toFixed(1);signed.textContent=ledger.signed;}
    slider.addEventListener('input',render);render();
  }
  function mountFrameExpressionJoint(el){
    const model=el.querySelector('#feJointModel');
    if(!model)return;
    el.querySelectorAll('[data-fe-animation]').forEach(button=>button.addEventListener('click',()=>{
      model.animationName=button.dataset.feAnimation;
      model.currentTime=0;
      model.play?.();
    }));
    el.querySelector('[data-fe-pause]')?.addEventListener('click',()=>model.pause?.());
  }
  function mountAll(){document.querySelectorAll('[data-tzl-bridge]').forEach(mount);document.querySelectorAll('[data-cube-ledger]').forEach(mountCubeLedger);document.querySelectorAll('[data-fe-glb]').forEach(mountFrameExpressionJoint);}
  return{TAU,binomial,pascalRow,fibonacci,fibonacciDiagonal,cubeLedger,exactCubeFacts,eulerBridge,audit,mount,mountCubeLedger,mountFrameExpressionJoint,mountAll};
});
