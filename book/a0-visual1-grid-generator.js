(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Visual1GridGenerator=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const mod=(n,m)=>((Math.trunc(Number(n)||0)%m)+m)%m;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
  function derive(input={},manualAddress=null){
    const edge=input.edge||{},journey=input.journey||{},incoming=edge.incoming||{from:0,to:1},candidate=edge.candidate||{from:1,to:2};
    const phaseIndex=mod(journey.phaseIndex,6),layer=mod(edge.layer,3),aperture=Math.round(clamp(input.aperture,18,72));
    const automaticAddress=1+mod(phaseIndex*4+incoming.to*5+candidate.to+layer*7+Math.floor(aperture/9),28);
    const address=manualAddress==null?automaticAddress:Math.max(1,Math.min(28,Math.trunc(Number(manualAddress)||1)));
    return Object.freeze({
      schema:'nexah.a0.visual1-grid-generator/1',version:VERSION,address,automaticAddress,follow:manualAddress==null,
      phaseIndex,phaseId:journey.currentPhase?.id||['CARRIER','P_VIEW','BINDER','A_VIEW','RESIDUAL','RETURN'][phaseIndex],aperture,layer,
      incoming:Object.freeze({from:mod(incoming.from,5),to:mod(incoming.to,5)}),candidate:Object.freeze({from:mod(candidate.from,5),to:mod(candidate.to,5)}),
      pascal:Object.freeze({kind:'P_VIEW',iris:aperture}),antipode:Object.freeze({kind:'C6_CONTAINING_C8_VIEW',hexagonSector:mod(incoming.to+phaseIndex,6),octagonSector:mod(candidate.to+layer+phaseIndex,8)}),
      edge:Object.freeze({kind:'IHARA_EDGE_TURN',verdict:candidate.to===incoming.from?'BLOCK':'ALLOW'}),
      boundary:'THREE_TYPED_READS_PLUS_ONE_TESA_VIEW_CONTROLLER; NOT A CARRIER MERGE OR HISTORICAL GENERATOR RECOVERY'
    });
  }
  function mount(document,window){
    const host=document.getElementById('visual1GridGenerator'),mini=document.getElementById('pxaTesaGenerator');if(!host||!mini)return null;
    const getInput=()=>window.A0Visual1BenchState?.()||{};let manual=null,last=null;
    function cells(root,state,compact=false){
      const grid=root.querySelector('[data-visual1-tesa-grid]');if(!grid)return;grid.replaceChildren();
      for(let address=1;address<=28;address+=1){const cell=document.createElement('button');cell.type='button';cell.textContent=String(address);cell.dataset.address=String(address);cell.className=address===state.address?'active':'';cell.title=`TESA ${address}`;if(!compact)cell.addEventListener('click',()=>{manual=address;render()});grid.appendChild(cell)}
    }
    function render(){
      last=derive(getInput(),manual);cells(host,last,false);cells(mini,last,true);
      host.dataset.follow=last.follow?'true':'false';
      host.querySelector('[data-v1-p]').textContent=`IRIS ${last.aperture}% · phase ${last.phaseIndex}`;
      host.querySelector('[data-v1-a]').textContent=`C6:${last.antipode.hexagonSector} ⊃ C8:${last.antipode.octagonSector}`;
      host.querySelector('[data-v1-e]').textContent=`${last.incoming.from}→${last.incoming.to} ↦ ${last.candidate.from}→${last.candidate.to} · ${last.edge.verdict}`;
      host.querySelector('[data-v1-status]').textContent=`${last.follow?'FOLLOW VISUAL 1':'MANUAL HOLD'} · TESA ${last.address} · P/A/E getrennt · +1 Grid`;
      mini.querySelector('[data-v1-mini-status]').textContent=`TESA ${last.address} · ${last.follow?'FOLLOW':'HOLD'}`;
      return last;
    }
    host.querySelector('[data-v1-follow]').addEventListener('click',()=>{manual=null;render()});
    host.querySelector('[data-v1-step]').addEventListener('click',()=>{manual=1+mod((last?.address||derive(getInput()).address),28);render()});
    mini.querySelector('[data-v1-mini-follow]').addEventListener('click',()=>{manual=null;render()});
    const api={render,snapshot:()=>JSON.parse(JSON.stringify(last||render())),select:address=>{manual=address;return render()},follow:()=>{manual=null;return render()}};render();return api;
  }
  return{VERSION,derive,mount};
});
