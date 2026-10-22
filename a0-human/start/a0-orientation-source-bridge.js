/* Read-only bridge between existing local source pages and the Sewing workspace.
   file: origins can be null; validate the actual parent Window and a narrow protocol. */
(() => {
  'use strict';
  if(window.parent===window)return;
  const $=id=>document.getElementById(id),protocol='A0_ORIENTATION_READING_V1';
  const kind=$('pascalShadowGon')?'pascal':$('ghostPreset')?'grid':null;
  if(!kind)return;
  function snapshot(){
    if(kind==='pascal'){
      const C=window.A0OrientationController;
      if(!C)throw new Error('Pascal model unavailable');
      const depth=Number($('pascalDepth').value),sides=Number(($('shadowTitle').textContent.match(/^(\d+)-gon/)||[])[1]);
      const plus=C.shadowGonProjection(depth,sides,1),minus=C.shadowGonProjection(depth,sides,-1);
      return{source:'A0_ORIENTATION_CONTROLLER_BENCH.html#pascalShadow',kind:'TRINOMIAL_SECTOR_PROJECTION',depth,sides,selectedStateText:$('pascalState').textContent,plus,minus,projectionCollision:plus.sectors.every((v,i)=>v===minus.sectors[i]),handle:C.antipodalSpecificityAblation(depth,sides),boundary:'Depth n and frame m are independent; sector mass is not a temporal signal. Retained sign does not establish E8 specificity.'};
    }
    const ghost=window.A0GhostTiles,preset=$('ghostPreset').value;
    if(!ghost)throw new Error('Grid model unavailable');
    return{source:'A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles',kind:'GRID_SOURCE_SELECTION',preset,selection:ghost.selection,side:ghost.side,phase:ghost.phase,tesa:preset==='tesa28'?window.A0TesaGridLens?.snapshot()??null:null,recordNotes:{layers:7,intervals:9,windings:11,status:'PROPOSED_ROLES_NOT_DERIVED_FROM_SEWING'},boundary:'TESA labels and sample times are fixture data, not Pascal sectors or Sewing source indices.'};
  }
  window.addEventListener('message',event=>{
    const data=event.data;
    if(event.source!==window.parent||!data||data.protocol!==protocol||data.target!==kind)return;
    if(data.action==='focus'&&['source','orientation','projection','return'].includes(data.focus)){
      const id=kind==='pascal'?(data.focus==='return'?'handleDecision':'pascalShadow'):(data.focus==='source'||data.focus==='orientation'?'crt16-tile':'ghost-tiles');
      $(id)?.scrollIntoView({block:'start',behavior:'auto'});return;
    }
    if(data.action!=='snapshot'||typeof data.requestId!=='string'||data.requestId.length>100)return;
    try{window.parent.postMessage({protocol,source:kind,requestId:data.requestId,status:'READ',capturedAt:new Date().toISOString(),record:snapshot()},'*');}
    catch(error){window.parent.postMessage({protocol,source:kind,requestId:data.requestId,status:'UNAVAILABLE',error:String(error.message)},'*');}
  });
})();
