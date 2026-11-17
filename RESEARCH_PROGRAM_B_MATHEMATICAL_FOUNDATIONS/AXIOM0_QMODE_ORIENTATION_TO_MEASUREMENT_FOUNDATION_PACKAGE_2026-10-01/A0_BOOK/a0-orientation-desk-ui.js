(()=>{
  'use strict';
  const E=window.A0OrientationDeskEngine;if(!E)return;
  const $=id=>document.getElementById(id),all=selector=>[...document.querySelectorAll(selector)];
  const body=document.body,eye=$('eyeToggle'),question=$('question'),readout=$('readout'),fragments=all('.fragment');
  let state=E.create();
  const stepIndex=()=>E.STEPS.indexOf(state.step);
  function values(prefix,keys){return Object.fromEntries(keys.map(key=>[key,$(prefix+key).value]))}
  function setEye(on){body.classList.toggle('eye-on',on);eye.setAttribute('aria-pressed',String(on));eye.textContent=on?'Close THE EYE':'Open THE EYE'}
  function setStep(step){state=E.setStep(state,step);render();}
  function render(){
    question.value=state.question;
    all('[data-workflow-step]').forEach(button=>{const active=button.dataset.workflowStep===state.step;button.setAttribute('aria-current',active?'step':'false');button.classList.toggle('is-done',E.STEPS.indexOf(button.dataset.workflowStep)<stepIndex())});
    all('[data-stage]').forEach(stage=>stage.hidden=stage.dataset.stage!==state.step);
    fragments.forEach(node=>{const item=state.materials.find(entry=>entry.id===node.dataset.id);node.querySelector('b').textContent=item.label;node.querySelector('small').textContent=item.content||'Empty slot';node.setAttribute('aria-pressed',String(item.id===state.selectedId));node.classList.toggle('is-outside',!item.included);node.style.transform='rotate('+item.turn+'deg)'});
    const selected=state.materials.find(item=>item.id===state.selectedId);readout.innerHTML=selected?'<strong>'+selected.label+'</strong><br>'+(selected.included?'Inside the declared cut.':'Held outside the declared cut.')+' · view turn '+selected.turn+'°':'<strong>No fragment selected.</strong><br>Begin with what caught your attention.';
    $('frameStatus').textContent=state.frame.declared?'FRAME DECLARED':'FRAME OPEN';
    $('returnOutput').textContent=state.receipt?JSON.stringify(state.receipt,null,2):'No return receipt yet.';
    const ready=E.readiness(state);$('readiness').textContent='BRING '+(ready.bring?'✓':'○')+' · FRAME '+(ready.frame?'✓':'○')+' · PLACE '+(ready.place?'✓':'○')+' · TURN '+(ready.turn?'✓':'○')+' · COMPARE '+(ready.compare?'✓':'○');
  }
  fragments.forEach(node=>node.addEventListener('click',()=>{state=E.select(state,node.dataset.id);const item=state.materials.find(entry=>entry.id===state.selectedId);$('materialKind').value=item.kind;$('materialLabel').value=item.label;$('materialContent').value=item.content;$('materialIncluded').checked=item.included;$('placementIncluded').checked=item.included;render()}));
  question.addEventListener('input',()=>{state=E.setQuestion(state,question.value)});
  all('[data-workflow-step]').forEach(button=>button.addEventListener('click',()=>setStep(button.dataset.workflowStep)));
  all('[data-next]').forEach(button=>button.addEventListener('click',()=>setStep(E.STEPS[Math.min(E.STEPS.length-1,stepIndex()+1)])));
  all('[data-back]').forEach(button=>button.addEventListener('click',()=>setStep(E.STEPS[Math.max(0,stepIndex()-1)])));
  $('holdMaterial').addEventListener('click',()=>{const id=state.selectedId||'source';state=E.select(state,id);state=E.setMaterial(state,id,{kind:$('materialKind').value,label:$('materialLabel').value,content:$('materialContent').value,included:$('materialIncluded').checked});render()});
  $('declareFrame').addEventListener('click',()=>{state=E.setFrame(state,{purpose:$('framePurpose').value,timeScale:$('frameTimeScale').value,view:$('frameView').value,outside:$('frameOutside').value,declared:true});render()});
  $('savePlacement').addEventListener('click',()=>{if(!state.selectedId){readout.innerHTML='<strong>Select a fragment first.</strong><br>Then decide whether it belongs inside the cut.';return}state=E.setMaterial(state,state.selectedId,{included:$('placementIncluded').checked});state=E.setRelation(state,$('relationText').value);render()});
  $('turn').addEventListener('click',()=>{try{state=E.turn(state);render()}catch(error){readout.innerHTML='<strong>Select a fragment first.</strong><br>'+error.message}});
  $('saveViews').addEventListener('click',()=>{state=E.setViews(state,{a:$('viewA').value,b:$('viewB').value,active:state.views.active});setEye(true);render()});
  $('flipView').addEventListener('click',()=>{state=E.setViews(state,{a:$('viewA').value,b:$('viewB').value,active:state.views.active==='A'?'B':'A'});body.classList.toggle('view-b',state.views.active==='B');$('activeView').textContent='ACTIVE VIEW · '+state.views.active;render()});
  $('saveComparison').addEventListener('click',()=>{state=E.setViews(state,{a:$('viewA').value,b:$('viewB').value,active:state.views.active});state=E.setILAU(state,values('ilau',['I','L','A','U']));setEye(true);render()});
  function returnWith(decision){try{state=E.finish(state,decision,$('returnNote').value);render()}catch(error){$('returnOutput').textContent=error.message}}
  $('continueReturn').addEventListener('click',()=>returnWith('CONTINUE'));$('restReturn').addEventListener('click',()=>returnWith('REST'));
  $('downloadReturn').addEventListener('click',()=>{if(!state.receipt)return;const url=URL.createObjectURL(new Blob([JSON.stringify(state.receipt,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='a0-orientation-desk-return.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  eye.addEventListener('click',()=>{setEye(!body.classList.contains('eye-on'));if(body.classList.contains('eye-on'))setStep('compare')});
  $('reset').addEventListener('click',()=>{state=E.create();setEye(false);body.classList.remove('view-b');for(const id of ['materialLabel','materialContent','framePurpose','frameTimeScale','frameView','frameOutside','relationText','viewA','viewB','ilauI','ilauL','ilauA','ilauU','returnNote'])$(id).value='';$('materialKind').value='source';$('materialIncluded').checked=true;$('placementIncluded').checked=true;$('activeView').textContent='ACTIVE VIEW · A';render()});
  window.A0OrientationDesk={snapshot:()=>E.snapshot(state),engine:E};render();
})();
