(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-plate-mirror-reference.js'):root.A0PlateMirrorReference);if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0PlateMirrorView=api;root.A0PlateMirrorController=api.mount(document,root);}})(typeof globalThis==='undefined'?this:globalThis,function(R){
  'use strict';
  function record(phase,source,reference=true,mirror=true){
    if(!['mixer','mask'].includes(source)||typeof reference!=='boolean'||typeof mirror!=='boolean')throw Error('invalid reference view options');
    return {schema:'a0.plate-mirror-reference/1',source,sourcePhase:phase,reference,mirror,geometry:R.snapshot(phase),
      sourceMapping:source==='mixer'?'existing mixer phase degrees; no source write':'existing mask tick 0..120 -> phase=tick*3 degrees; display probe only',
      nodeBinding:'N1=(1/sqrt(2),1/sqrt(2)), N2=H(N1); auxiliary reference, not recovered historical addresses',
      sourceClock:'none added; original mask animation when explicitly selected',wholeMachineReturn:false};
  }
  function verify(r){try{if(JSON.stringify(record(r.sourcePhase,r.source,r.reference,r.mirror))!==JSON.stringify(r))throw Error('source geometry differs');return {status:'PASS'};}catch(e){return {status:'INVALID',reason:e.message};}}
  function mount(doc,win={}){
    const host=doc.getElementById('plateMirrorBench');if(!host)return null;const el=id=>doc.getElementById(id);let latestMask=win.A0MaskObserverController?.state??null,current=null,currentCylinder=null;
    function render(){
      const source=el('plateMirrorSource').value,phase=source==='mask'?(latestMask?latestMask.tick*3:null):win.A0BenchLensReturnController?.state?.phase;
      if(!Number.isFinite(phase)){current=null;currentCylinder=null;el('plateMirrorStatus').textContent='HOLD · gewählte Quellphase nicht verfügbar';if(el('plateCylinderDrawing'))el('plateCylinderDrawing').innerHTML='';if(el('plateCylinderStatus'))el('plateCylinderStatus').textContent='HOLD · gewählte Quellphase nicht verfügbar';return;}
      current=record(phase,source,el('plateMirrorReference').checked,el('plateMirrorEnabled').checked);
      el('plateMirrorFlat').innerHTML=R.referenceDrawing(current.geometry,{reference:current.reference,mirror:current.mirror});
      el('plateMirrorSpatial').innerHTML=R.plateDrawing(current.geometry,current.mirror);
      const cylinder=win.A0RotatingCylinder,target=el('plateCylinderDrawing');
      if(cylinder&&target){
        const direction=el('plateCylinderDirection').value==='reverse'?-1:1;
        currentCylinder=cylinder.snapshot(phase,{direction,copies:el('plateCylinderCopies').checked});
        target.innerHTML=cylinder.drawing(currentCylinder);
        el('plateCylinderStatus').textContent='φ '+phase+'° · '+(direction===1?'VORWÄRTS':'GEGENLAUF')+' · z-Transport 0 · scheinbarer Bandversatz '+currentCylinder.apparentAxialShift.toFixed(3)+' · P1–P3 oben / P4–P6 unten';
      }
      el('plateMirrorReturn').disabled=!latestMask?.anchor;
      el('plateMirrorStatus').textContent=(source==='mask'?'MASKENQUELLE · Tick '+latestMask.tick+'/120':'MIXERQUELLE')+' · φ '+phase+'° · feste ±45°-Referenz · '+(current.mirror?'Spiegel EIN':'Spiegel AUS')+' · keine neue Faltstation';
    }
    function chooseMask(buttonId){const button=el(buttonId);if(!button||!win.A0MaskObserverController){el('plateMirrorStatus').textContent='HOLD · Originalplayer fehlt';return false;}el('plateMirrorSource').value='mask';button.click();latestMask=win.A0MaskObserverController.state;render();return true;}
    el('plateMirrorPlay').addEventListener('click',()=>chooseMask('maskPlay'));
    el('plateMirrorStep').addEventListener('click',()=>chooseMask('maskStep'));
    el('plateMirrorCapture').addEventListener('click',()=>chooseMask('maskCapture'));
    el('plateMirrorReturn').addEventListener('click',()=>chooseMask('maskReturn'));
    for(const id of ['plateMirrorSource','plateMirrorReference','plateMirrorEnabled'])el(id).addEventListener('change',render);
    for(const event of ['input','change','click'])el('benchLensReturn')?.addEventListener(event,render);
    const unsubscribe=win.A0MaskObserverController?.subscribe?.(state=>{latestMask=state;if(el('plateMirrorSource').value==='mask')render();});
    el('plateMirrorExport').addEventListener('click',()=>{render();if(!current||verify(current).status!=='PASS')return;const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(current,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-plate-mirror-reference.json';a.click();win.URL.revokeObjectURL(url);});
    el('plateMirrorOriginal').addEventListener('click',()=>{const pane=win.A0BenchPerspectiveDeckView?.panes.A;if(!pane){el('plateMirrorStatus').textContent='HOLD · Quellfenster nicht verfügbar';return;}pane.unload();pane.select('plate');pane.open();el('benchPerspectiveDeck')?.scrollIntoView({block:'start',behavior:'auto'});});
    for(const id of ['plateCylinderDirection','plateCylinderCopies'])el(id)?.addEventListener('change',render);
    el('plateCylinderExport')?.addEventListener('click',()=>{
      render();if(!currentCylinder||win.A0RotatingCylinder.verify(currentCylinder).status!=='PASS')return;
      const payload={schema:'a0.source-bound-cylinder-view/1',geometry:currentCylinder,phaseSource:current.source,sourceMapping:current.sourceMapping,wholeMachineReturn:false};
      const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');
      a.href=url;a.download='a0-rotating-cylinder-view.json';a.click();win.URL.revokeObjectURL(url);
    });
    render();return {render,record:()=>current?JSON.parse(JSON.stringify(current)):null,cylinderRecord:()=>currentCylinder?JSON.parse(JSON.stringify(currentCylinder)):null,destroy(){unsubscribe?.();}};
  }
  return {record,verify,mount};
});
