(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ApertureInvarianceObservatory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const TRANSFORMS=Object.freeze(['identity','otherCarrier','rotate90','rotate180','reflectX','translate22','control']);
  const mod=(v,n)=>((v%n)+n)%n;
  const clone=grid=>grid.map(row=>row.slice());
  function transform(grid,id){
    const g=clone(grid),n=4;
    if(id==='identity')return g;
    if(id==='rotate90')return g[0].map((_,x)=>g.map(row=>row[x]).reverse());
    if(id==='rotate180')return g.map(row=>row.slice().reverse()).reverse();
    if(id==='reflectX')return g.map(row=>row.slice().reverse());
    if(id==='translate22')return g.map((_,y)=>g.map((__,x)=>g[mod(y+2,n)][mod(x+2,n)]));
    if(id==='control'){
      const flat=g.flat(),order=[0,5,10,15,1,6,11,12,2,7,8,13,3,4,9,14];
      return Array.from({length:n},(_,y)=>order.slice(y*n,y*n+n).map(index=>flat[index]));
    }
    throw Error(`unknown transform: ${id}`);
  }
  function positions(size,boundary){const width=boundary==='torus'?4:5-size;return Array.from({length:width*width},(_,i)=>({row:Math.floor(i/width),col:i%width}))}
  function windowSum(grid,size,row,col,boundary){let sum=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const yy=boundary==='torus'?mod(row+y,4):row+y,xx=boundary==='torus'?mod(col+x,4):col+x;if(yy<0||yy>3||xx<0||xx>3)throw Error('window outside grid');sum+=grid[yy][xx]}return sum}
  function trace(grid,size,boundary){return positions(size,boundary).map(({row,col})=>Object.freeze({row,col,sum:windowSum(grid,size,row,col,boundary)}))}
  const sorted=values=>values.slice().sort((a,b)=>a-b);
  function arraysEqual(a,b){return a.length===b.length&&a.every((value,index)=>value===b[index])}
  function compare(base,candidate,size,boundary){
    const a=trace(base,size,boundary),b=trace(candidate,size,boundary),av=a.map(x=>x.sum),bv=b.map(x=>x.sum),samePosition=arraysEqual(av,bv),sameMultiset=arraysEqual(sorted(av),sorted(bv));
    const uniqueA=new Set(av).size,uniqueB=new Set(bv).size;
    const classification=samePosition?'INVARIANT':sameMultiset?'LOCATION_DEPENDENT':'PLACEMENT_DEPENDENT';
    return Object.freeze({size,boundary,base:a,candidate:b,samePosition,sameMultiset,uniqueBase:uniqueA,uniqueCandidate:uniqueB,classification,minBase:Math.min(...av),maxBase:Math.max(...av),minCandidate:Math.min(...bv),maxCandidate:Math.max(...bv)});
  }
  function createState(overrides={}){return Object.assign({carrier:'durer',transform:'identity',size:2,boundary:'planar',running:false},overrides)}
  function snapshot(state,carriers){const base=carriers[state.carrier];if(!base)throw Error(`unknown carrier: ${state.carrier}`);const candidate=state.transform==='otherCarrier'?clone(carriers[state.carrier==='durer'?'khajuraho':'durer']):transform(base,state.transform),result=compare(base,candidate,state.size,state.boundary);return Object.freeze({version:VERSION,state:Object.freeze(Object.assign({},state)),base:clone(base),candidate,comparison:result,returnExact:sorted(base.flat()).join(',')===sorted(candidate.flat()).join(','),authority:'FINITE_ENGINEERING_COMPARISON_NOT_RESEARCH_RUN'})}
  function mount(container,options={}){
    const win=options.window||container.ownerDocument?.defaultView||{},carriers=options.carriers||win.A0CoupledWindow?.CARRIERS;
    if(!carriers)throw Error('observatory carriers missing');
    let state=createState(),timer=0;
    container.innerHTML=`<div class="aio-controls"><label>Source<select data-aio="carrier"><option value="durer">Dürer</option><option value="khajuraho">Khajuraho</option></select></label><label>Operator<select data-aio="transform">${TRANSFORMS.map(id=>`<option value="${id}">${id}</option>`).join('')}</select></label><label>Window<select data-aio="size"><option value="2">2×2</option><option value="3">3×3</option></select></label><label>Boundary<select data-aio="boundary"><option value="planar">Planar</option><option value="torus">Toroidal</option></select></label><button type="button" data-aio="play">▶ OPERATOR TOUR</button><button type="button" data-aio="capture">CAPTURE TO LEDGER</button></div><div class="aio-grid-pair"><article><small>BASE</small><div class="aio-grid" data-aio-grid="base"></div><div class="aio-heat" data-aio-heat="base"></div></article><article><small>CANDIDATE</small><div class="aio-grid" data-aio-grid="candidate"></div><div class="aio-heat" data-aio-heat="candidate"></div></article></div><div class="aio-verdict"><small>FINITE COMPARISON</small><b data-aio="verdict">—</b><span data-aio="detail">—</span></div>`;
    const $=key=>container.querySelector(`[data-aio="${key}"]`),reduced=()=>Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    function stop(){if(timer)win.clearInterval(timer);timer=0;state=createState({...state,running:false})}
    function renderGrid(key,grid){$(key).innerHTML=grid.flatMap((row,y)=>row.map((value,x)=>`<b data-row="${y}" data-col="${x}">${value}</b>`)).join('')}
    function renderHeat(key,records){const values=records.map(r=>r.sum),lo=Math.min(...values),hi=Math.max(...values),span=Math.max(1,hi-lo);$(key).innerHTML=records.map(r=>`<i style="--heat:${((r.sum-lo)/span).toFixed(3)}"><span>${r.row},${r.col}</span><b>${r.sum}</b></i>`).join('')}
    function render(){const shot=snapshot(state,carriers);renderGrid('base',shot.base);renderGrid('candidate',shot.candidate);renderHeat('base',shot.comparison.base);renderHeat('candidate',shot.comparison.candidate);$('verdict').textContent=shot.comparison.classification;$('detail').textContent=`position ${shot.comparison.samePosition?'same':'changed'} · multiset ${shot.comparison.sameMultiset?'same':'changed'} · unique ${shot.comparison.uniqueBase}→${shot.comparison.uniqueCandidate} · source Return ${shot.returnExact?'exact':'hold'}`;$('play').textContent=state.running?'Ⅱ PAUSE TOUR':'▶ OPERATOR TOUR';return shot}
    ['carrier','transform','size','boundary'].forEach(key=>$(key).addEventListener('change',()=>{stop();state=createState({...state,[key]:key==='size'?Number($(key).value):$(key).value});render()}));
    $('play').addEventListener('click',()=>{if(state.running){stop();render();return}state=createState({...state,running:true});timer=win.setInterval(()=>{const index=(TRANSFORMS.indexOf(state.transform)+1)%TRANSFORMS.length;state=createState({...state,transform:TRANSFORMS[index],running:true});$('transform').value=state.transform;render()},reduced()?2600:1400);render()});
    $('capture').addEventListener('click',()=>{const record={scenario:'observatory',title:'Aperture Invariance',payload:render()};if(win.A0BenchSessionLedgerController?.capture)win.A0BenchSessionLedgerController.capture(record);else win.A0BenchSessionLedger?.captureStored?.(win.localStorage,record)});
    const first=render();
    return Object.freeze({snapshot:()=>snapshot(state,carriers),stop,render,state:()=>Object.assign({},state),first});
  }
  return{VERSION,TRANSFORMS,transform,positions,windowSum,trace,compare,createState,snapshot,mount};
});
