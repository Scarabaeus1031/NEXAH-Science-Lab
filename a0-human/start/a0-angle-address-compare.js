(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else{root.A0AngleAddressCompare=api;root.A0AngleAddressCompareController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const N=120;
  const TRACKS={
    A:{id:'A',stepDeg:3,addressStep:1,title:'3° · REGULAR 120-GON',color:'cyan',role:'PRIMARY'},
    B:{id:'B',stepDeg:111,addressStep:37,title:'111° · STAR {120/37}',color:'pink',role:'PRIMARY'},
    C:{id:'C',stepDeg:333,addressStep:111,title:'333° · 40-ADDRESS CONTROL',color:'gold',role:'NEGATIVE_CONTROL'}
  };
  const mod=(n,m)=>((n%m)+m)%m;
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
  function inverse(a,m){for(let k=0;k<m;k++)if(mod(a*k,m)===1)return k;return null;}
  function address(track,k){return mod(TRACKS[track].addressStep*k,N);}
  function angle(track,k){return address(track,k)*3;}
  function sequence(track){return Array.from({length:N},(_,k)=>({k,address:address(track,k),angleDeg:angle(track,k)}));}
  function uniqueAddresses(track){return [...new Set(sequence(track).map(item=>item.address))];}
  function result(){
    const a=sequence('A'),b=sequence('B'),c=sequence('C'),setA=[...new Set(a.map(x=>x.address))].sort((x,y)=>x-y),setB=[...new Set(b.map(x=>x.address))].sort((x,y)=>x-y),setC=[...new Set(c.map(x=>x.address))].sort((x,y)=>x-y);
    return{
      schema:'nexah.a0.angle-address-compare/1.0.0',status:'PASS_EXACT_FINITE_ADDRESS_COMPARISON',scope:'A and B are the fixed two-sequence comparison; C is a separate 333-degree negative control',radius:1,startDeg:0,steps:120,
      relations:{factorization111:'111=3*37',gcd37_120:gcd(37,120),inverse37Mod120:inverse(37,120),forwardMap:'j=37k mod 120',inverseMap:'k=13j mod 120'},
      A:{stepDeg:3,uniqueDirections:setA.length,closureAddress:address('A',120),path:'regular polygon {120/1}'},
      B:{stepDeg:111,uniqueDirections:setB.length,closureAddress:address('B',120),path:'regular star polygon {120/37}'},
      comparison:{samePointSet:JSON.stringify(setA)===JSON.stringify(setB),eachDirectionOnceA:setA.length===N,eachDirectionOnceB:setB.length===N,closedAfter120A:address('A',120)===0,closedAfter120B:address('B',120)===0},
      control333:{stepDeg:333,factorization:'333=3*111',gcd111_120:gcd(111,120),uniqueDirections:setC.length,firstReturnStep:40,closureAddressAfter120:address('C',120),visitsPerDirection:3,path:'three repeats of {40/37}, equivalently reverse {40/3}'},
      ownerNotes:['111','|11','1–2–3'],ownerNoteBoundary:'retained notations only; no additional operator meaning',claimBoundary:'Exact finite modular geometry and display comparison only. No radius growth, prime filter, golden spiral, physical mechanism, Study, Finding or publication claim.'
    };
  }
  function pointForAddress(j,cx=180,cy=180,r=142){const a=j*3*Math.PI/180;return{x:cx+r*Math.cos(a),y:cy-r*Math.sin(a)}}
  function path(track,step,cx=180,cy=180,r=142){const end=Math.min(N,Math.max(0,Math.trunc(step))),items=[];for(let k=0;k<=end;k++){const p=pointForAddress(address(track,k),cx,cy,r);items.push(`${p.x.toFixed(3)},${p.y.toFixed(3)}`)}return items.join(' ')}
  function panel(track,step,lines){
    const meta=TRACKS[track],current=address(track,step),visited=new Set(sequence(track).slice(0,Math.min(step+1,N)).map(x=>x.address)),dots=Array.from({length:N},(_,j)=>{const p=pointForAddress(j);return`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${j===current?5.8:visited.has(j)?2.6:1.8}" class="aac-dot ${j===current?'current':''} ${visited.has(j)?'visited':''}"><title>Adresse ${j} · ${j*3}°</title></circle>`}).join(''),poly=lines?`<polyline points="${path(track,step)}" class="aac-path ${meta.color}"/>`:'';
    return`<svg viewBox="0 0 360 360" role="img" aria-label="${meta.title}; Schritt ${step}; Adresse ${current}"><title>${meta.title}</title><circle cx="180" cy="180" r="142" class="aac-ring"/>${poly}${dots}<line x1="180" y1="180" x2="322" y2="180" class="aac-zero"/><circle cx="180" cy="180" r="3" class="aac-center"/></svg>`;
  }
  function mount(doc,win){
    const host=doc.getElementById('angleAddressCompare');if(!host)return null;const $=name=>host.querySelector(`[data-aac-${name}]`);let step=0,lines=true,playing=false,timer=null;
    function render(){for(const key of ['A','B','C'])$('view-'+key.toLowerCase()).innerHTML=panel(key,step,lines);$('step').value=String(step);$('step-out').textContent=String(step);$('address-a').textContent=String(address('A',step));$('angle-a').textContent=`${angle('A',step)}°`;$('address-b').textContent=String(address('B',step));$('angle-b').textContent=`${angle('B',step)}°`;$('address-c').textContent=String(address('C',step));$('angle-c').textContent=`${angle('C',step)}°`;$('status').textContent=`${playing?'PLAY':'PAUSE'} · Schritt ${step}/120 · A:${address('A',step)} · B:${address('B',step)} · C:${address('C',step)}`;$('play').textContent=playing?'Ⅱ Pause':'▶ Play';$('play').setAttribute('aria-pressed',String(playing));}
    function stop(){playing=false;if(timer!==null)win.clearInterval(timer);timer=null;render()}
    function advance(){step=step>=120?0:step+1;render();if(step===120)stop()}
    $('play').addEventListener('click',()=>{if(playing)return stop();playing=true;timer=win.setInterval(advance,90);render()});$('next').addEventListener('click',()=>{stop();step=step>=120?0:step+1;render()});$('reset').addEventListener('click',()=>{stop();step=0;render()});$('step').addEventListener('input',event=>{stop();step=Number(event.target.value);render()});$('lines').addEventListener('change',event=>{lines=event.target.checked;render()});render();return{get state(){return{step,lines,playing}},stop,result};
  }
  return{N,TRACKS,mod,gcd,inverse,address,angle,sequence,uniqueAddresses,result,pointForAddress,path,panel,mount};
});
