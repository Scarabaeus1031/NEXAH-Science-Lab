(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Visual1GridGenerator=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const mod=(n,m)=>((Math.trunc(Number(n)||0)%m)+m)%m;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
  function derive(input={},manualAddress=null,edgeSource='c5'){
    if(!['c5','cubic'].includes(edgeSource))throw Error('unknown edge source');
    const edge=input.edge||{},journey=input.journey||{},baseIncoming=edge.incoming||{from:0,to:1},baseCandidate=edge.candidate||{from:1,to:2};
    const cubic=edgeSource==='cubic'?input.cubic:null;
    if(edgeSource==='cubic'&&(!cubic||cubic.schema!=='a0.ihara-cubic-bench/1'||cubic.graph!=='G(10,2)'||cubic.directedCount!==60||cubic.status?.startsWith('HOLD')))throw Error('G(10,2) source unavailable / HOLD');
    const incoming=cubic?cubic.channel?.incoming:baseIncoming,candidate=cubic?cubic.channel?.candidate:baseCandidate;
    if(cubic&&(![incoming?.from,incoming?.to,candidate?.from,candidate?.to].every(v=>Number.isInteger(v)&&v>=0&&v<20)||candidate.from!==incoming.to||!['READY','COMMITTED','BLOCK'].includes(cubic.channel.verdict)||cubic.channel.committed!==(cubic.channel.verdict==='COMMITTED')||(cubic.channel.verdict==='BLOCK')!==(candidate.to===incoming.from)))throw Error('invalid cubic edge witness');
    const gridIncoming=cubic?cubic.projectionChannel?.incoming:incoming,gridCandidate=cubic?cubic.projectionChannel?.candidate:candidate;
    if(cubic&&(![gridIncoming?.from,gridIncoming?.to,gridCandidate?.from,gridCandidate?.to].every(v=>Number.isInteger(v)&&v>=0&&v<20)||gridCandidate.from!==gridIncoming.to||gridCandidate.to===gridIncoming.from))throw Error('missing committed cubic projection witness');
    const phaseIndex=mod(journey.phaseIndex,6),layer=mod(edge.layer,3),aperture=Math.round(clamp(input.aperture,18,72));
    const automaticAddress=1+mod(phaseIndex*4+gridIncoming.to*5+gridCandidate.to+layer*7+Math.floor(aperture/9),28);
    const address=manualAddress==null?automaticAddress:Math.max(1,Math.min(28,Math.trunc(Number(manualAddress)||1)));
    return Object.freeze({
      schema:'nexah.a0.visual1-grid-generator/1',version:VERSION,address,automaticAddress,follow:manualAddress==null,
      phaseIndex,phaseId:journey.currentPhase?.id||['CARRIER','P_VIEW','BINDER','A_VIEW','RESIDUAL','RETURN'][phaseIndex],aperture,layer,
      incoming:Object.freeze({from:cubic?incoming.from:mod(incoming.from,5),to:cubic?incoming.to:mod(incoming.to,5)}),candidate:Object.freeze({from:cubic?candidate.from:mod(candidate.from,5),to:cubic?candidate.to:mod(candidate.to,5)}),
      pascal:Object.freeze({kind:'P_VIEW',iris:aperture}),antipode:Object.freeze({kind:'C6_CONTAINING_C8_VIEW',hexagonSector:mod(baseIncoming.to+phaseIndex,6),octagonSector:mod(baseCandidate.to+layer+phaseIndex,8)}),
      edge:Object.freeze({kind:'IHARA_EDGE_TURN',source:edgeSource==='cubic'?'G(10,2)':'C5',verdict:cubic?cubic.channel.verdict:candidate.to===incoming.from?'BLOCK':'ALLOW',confirmed:cubic?cubic.channel.committed:false}),
      cubicWitness:cubic?JSON.parse(JSON.stringify(cubic)):null,
      gridEdgeRead:Object.freeze({incoming:Object.freeze({...gridIncoming}),candidate:Object.freeze({...gridCandidate})}),
      boundary:'THREE_TYPED_READS_PLUS_ONE_TESA_VIEW_CONTROLLER; NOT A CARRIER MERGE OR HISTORICAL GENERATOR RECOVERY'
    });
  }
  function mount(document,window){
    const host=document.getElementById('visual1GridGenerator'),mini=document.getElementById('pxaTesaGenerator');if(!host||!mini)return null;
    const sourceControl=host.querySelector('[data-v1-edge-source]'),subscribers=new Set();
    const notify=()=>{for(const fn of subscribers)try{fn();}catch(error){window.console?.error?.(error);}};
    let edgeSource=sourceControl?.value==='cubic'?'cubic':'c5';
    const getInput=()=>({...((window.A0Visual1BenchState?.())||{}),cubic:edgeSource==='cubic'?window.A0IharaCubicController?.snapshot():null});let manual=null,last=null;
    function cells(root,state,compact=false){
      const grid=root.querySelector('[data-visual1-tesa-grid]');if(!grid)return;grid.replaceChildren();
      for(let address=1;address<=28;address+=1){const cell=document.createElement('button');cell.type='button';cell.textContent=String(address);cell.dataset.address=String(address);cell.className=address===state.address?'active':'';cell.title=`TESA ${address}`;if(!compact)cell.addEventListener('click',()=>{manual=address;render()});grid.appendChild(cell)}
    }
    function render(){
      try{last=derive(getInput(),manual,edgeSource);}catch(error){
        last=null;host.dataset.sourceState='HOLD';for(const root of [host,mini])root.querySelector('[data-visual1-tesa-grid]')?.replaceChildren();
        host.querySelector('[data-v1-e]').textContent='HOLD · '+error.message;
        host.querySelector('[data-v1-status]').textContent='HOLD · selected edge source missing; no C5 fallback';
        mini.querySelector('[data-v1-mini-status]').textContent='HOLD · Edge-Quelle fehlt';notify();return null;
      }
      host.dataset.sourceState='READY';cells(host,last,false);cells(mini,last,true);
      host.dataset.follow=last.follow?'true':'false';
      host.querySelector('[data-v1-p]').textContent=`IRIS ${last.aperture}% · phase ${last.phaseIndex}`;
      host.querySelector('[data-v1-a]').textContent=`C6:${last.antipode.hexagonSector} ⊃ C8:${last.antipode.octagonSector}`;
      host.querySelector('[data-v1-e]').textContent=`${last.edge.source} · ${last.incoming.from}→${last.incoming.to} ↦ ${last.candidate.from}→${last.candidate.to} · ${last.edge.verdict}`;
      host.querySelector('[data-v1-status]').textContent=`${last.follow?'FOLLOW VISUAL 1':'MANUAL HOLD'} · TESA ${last.address} · P/A/E getrennt · +1 Grid`;
      mini.querySelector('[data-v1-mini-status]').textContent=`TESA ${last.address} · ${last.follow?'FOLLOW':'HOLD'}`;
      notify();return last;
    }
    host.querySelector('[data-v1-follow]').addEventListener('click',()=>{manual=null;render()});
    host.querySelector('[data-v1-step]').addEventListener('click',()=>{if(!last)render();if(!last)return;manual=1+mod(last.address,28);render()});
    mini.querySelector('[data-v1-mini-follow]').addEventListener('click',()=>{manual=null;render()});
    sourceControl?.addEventListener('change',()=>{edgeSource=sourceControl.value;render()});
    const api={render,snapshot:()=>last?JSON.parse(JSON.stringify(last)):null,subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn)},
      setEdgeSource(value){if(!['c5','cubic'].includes(value))throw Error('unknown edge source');edgeSource=value;if(sourceControl)sourceControl.value=value;return render();},
      select:address=>{manual=address;return render()},follow:()=>{manual=null;return render()}};render();return api;
  }
  return{VERSION,derive,mount};
});
