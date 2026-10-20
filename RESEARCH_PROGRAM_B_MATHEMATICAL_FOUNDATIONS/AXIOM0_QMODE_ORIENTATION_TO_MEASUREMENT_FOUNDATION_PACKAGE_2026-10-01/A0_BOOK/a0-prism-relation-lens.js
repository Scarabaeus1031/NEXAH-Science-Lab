(function(root){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const MODES={
    newton:{relation:'state',status:'NEWTON · 7 BANDS',readout:'Weiße Quelle → schematische Zerlegung in sieben geordnete Bänder.',boundary:'Zerlegung / Messansicht · keine kalibrierte Optik.'},
    leibniz:{relation:'rhombus',status:'LEIBNIZ · RELATION',readout:'Sieben Bänder werden als geordnete Differenzen und Paarbeziehungen gelesen.',boundary:'Relation / Ordnung · keine Identität der dargestellten Größen.'},
    goethe:{relation:'heart',status:'GOETHE · BOUNDARY',readout:'Die Bänder verdichten sich an Hell–Dunkel-Grenze und Spiegelachse.',boundary:'Erscheinung / Randkontrast · keine neue Farbphysik.'}
  };
  const PATHS={
    newton:['M228 194 L355 122','M228 194 L365 145','M228 194 L372 170','M228 194 L376 194','M228 194 L372 218','M228 194 L365 243','M228 194 L355 266'],
    leibniz:['M150 130 Q220 194 335 142','M150 150 Q220 194 335 158','M150 170 Q220 194 335 176','M150 194 L335 194','M150 218 Q220 194 335 212','M150 238 Q220 194 335 230','M150 258 Q220 194 335 246'],
    goethe:['M220 194 Q274 135 335 154','M220 194 Q283 151 343 168','M220 194 Q290 171 350 182','M220 194 L356 194','M220 194 Q290 217 350 206','M220 194 Q283 237 343 220','M220 194 Q274 253 335 234']
  };
  const RETURN_STAGES={
    number:{index:1,kicker:'01 · SOURCE CHECKPOINT',readout:'4774 + 4114 = 8888 · gcd(4774, 4114) = 22.',boundary:'Exakte Arithmetik; kein Prime-Selektivitätsbeweis und kein neuer Operator.',bindingType:'EXACT_SOURCE_CHECKPOINT',focusTarget:'numbers'},
    seam:{index:2,kicker:'02 · TYPED ZIPPER',readout:'140 Inzidenzen werden zu 106 Adressen plus typisiertem Residuum gelesen.',boundary:'BL-025 bleibt ein beschränktes SCC-003-Resultat; kein universeller Zipper.',bindingType:'TYPED_SEAM_PROJECTION',focusTarget:'typed-seam'},
    cut:{index:3,kicker:'03 · GEOMETRIC CUT',readout:'Zwei Dreiecksflächen zeigen denselben gebundenen Zustand von zwei Seiten.',boundary:'Schnittansichten sind View-Geometrie; sie erzeugen keinen neuen Carrier.',bindingType:'GEOMETRIC_CUT_VIEW',focusTarget:'cut-faces'},
    shadow:{index:4,kicker:'04 · FIELD CHANNELS',readout:'Weißes Licht, violettes Echo und Red Shadow bleiben getrennte Kanäle im Gamma-Frame.',boundary:'F7 light ≠ ε echo ≠ Red Shadow; Kopplung ist keine Identität.',bindingType:'GAMMA_FRAME_VIEW_COUPLING',focusTarget:'shadow-echo'},
    record:{index:5,kicker:'05 · RETURN RECEIPT',readout:'Quelle, Auswahl, Seam-Typ, View und Residuum werden gemeinsam quittiert.',boundary:'Gleicher Endzustand bedeutet nicht gleiche Geschichte.',bindingType:'TYPED_VIEW_RETURN',focusTarget:'return-record'}
  };
  function createReturnRecord(stage,mode){
    const stageId=RETURN_STAGES[stage]?stage:'number',modeId=MODES[mode]?mode:'newton',item=RETURN_STAGES[stageId];
    return Object.freeze({schema:'nexah.a0.prism-return/1',recordId:`PRISM-R${item.index}`,moduleId:'OCB:PRISM_RELATION_LENS',sourceId:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',sourceSurface:'A0_GAME_OF_WORLDS_PLAY.html#numbers',stage:stageId,mode:modeId,focusTarget:item.focusTarget,bindingType:item.bindingType,checkpoint:stageId==='number'?Object.freeze({left:4774,mirror:4114,sum:8888,gcd:22,primeSelectivity:'FAIL'}):null,openMarker:'Z / 77',preserves:Object.freeze(['source','selection','typed-seam','view','residual']),claimCeiling:'SOURCE_BOUND_OPERATIONAL_VIEW_NO_NEW_IDENTITY'});
  }
  function svgEl(name,attrs){const node=document.createElementNS(NS,name);Object.entries(attrs||{}).forEach(([key,value])=>node.setAttribute(key,value));return node}
  function mount(doc,win){
    const host=doc.getElementById('prismRelationLens'),machine=doc.getElementById('stateMachine'),svg=machine&&machine.querySelector('svg');
    if(!host||!machine||!svg)throw new Error('required state-machine mount missing');
    const status=doc.getElementById('prismRelationStatus'),readout=doc.getElementById('prismRelationReadout'),boundary=doc.getElementById('prismRelationBoundary');
    const modeButtons=[...doc.querySelectorAll('[data-prism-mode]')],sequenceButtons=[...doc.querySelectorAll('[data-prism-sequence]')],projections=[...doc.querySelectorAll('[data-prism-projection]')];
    const returnHost=doc.getElementById('prismReturnSpine'),returnButtons=[...doc.querySelectorAll('[data-prism-stage]')],returnPlay=doc.querySelector('[data-prism-return-play]');
    const returnKicker=doc.getElementById('prismReturnKicker'),returnReadout=doc.getElementById('prismReturnReadout'),returnBoundary=doc.getElementById('prismReturnBoundary'),returnBinding=doc.getElementById('prismReturnBinding'),returnFocus=doc.getElementById('prismReturnFocus'),returnRecord=doc.getElementById('prismReturnRecord');
    const group=svgEl('g',{class:'prism-overlay','aria-hidden':'true','data-binding-type':'VIEW_ONLY'});
    group.append(svgEl('path',{class:'prism-source-ray',d:'M82 194 L186 194'}));
    group.append(svgEl('path',{class:'prism-body',d:'M186 148 L246 194 L186 240 Z'}));
    for(let index=0;index<7;index++)group.append(svgEl('path',{class:'prism-ray','data-band':String(index),d:PATHS.newton[index]}));
    const firstContent=svg.querySelector('.ring');svg.insertBefore(group,firstContent||svg.firstChild);
    let mode='newton',timer=null,step=0,returnStage='number',returnTimer=null,returnStep=0;
    function stopReturn(reason){
      const wasPlaying=Boolean(returnTimer);
      if(returnTimer){win.clearInterval(returnTimer);returnTimer=null}
      if(returnPlay){returnPlay.classList.remove('is-playing');returnPlay.textContent='▶ RETURN-SEQUENZ'}
      if(wasPlaying&&reason!=='complete')win.dispatchEvent(new win.CustomEvent('a0:prism-return-playback',{detail:{moduleId:'OCB:PRISM_RELATION_LENS',state:reason==='interaction'?'PAUSED_BY_INTERACTION':'STOPPED',record:createReturnRecord(returnStage,mode)}}));
    }
    function setReturnStage(next,source){
      if(!RETURN_STAGES[next]||!returnHost)return;
      returnStage=next;const item=RETURN_STAGES[next],record=createReturnRecord(next,mode);
      returnHost.dataset.prismReturnStage=next;
      returnButtons.forEach(button=>{const active=button.dataset.prismStage===next;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});
      if(returnKicker)returnKicker.textContent=item.kicker;if(returnReadout)returnReadout.textContent=item.readout;if(returnBoundary)returnBoundary.textContent=item.boundary;
      if(returnBinding)returnBinding.textContent=item.bindingType;if(returnFocus)returnFocus.textContent=item.focusTarget;
      if(returnRecord)returnRecord.textContent=`${record.recordId} · ${record.stage} · ${record.mode} · source retained`;
      win.dispatchEvent(new win.CustomEvent('a0:prism-return-selection',{detail:{...record,source:source||'manual'}}));
    }
    function playReturn(){
      if(returnTimer){stopReturn('control');return}
      returnStep=0;if(returnPlay){returnPlay.classList.add('is-playing');returnPlay.textContent='Ⅱ RETURN PAUSIEREN'}
      setReturnStage('number','sequence');
      returnTimer=win.setInterval(()=>{returnStep+=1;if(returnStep>=5){stopReturn('complete');win.dispatchEvent(new win.CustomEvent('a0:prism-return-playback',{detail:{moduleId:'OCB:PRISM_RELATION_LENS',state:'COMPLETE',record:createReturnRecord('record',mode)}}));return}setReturnStage(['number','seam','cut','shadow','record'][returnStep],'sequence')},1500);
      win.dispatchEvent(new win.CustomEvent('a0:prism-return-playback',{detail:{moduleId:'OCB:PRISM_RELATION_LENS',state:'PLAYING',record:createReturnRecord('number',mode)}}));
    }
    function syncProjections(){
      projections.forEach(projection=>{
        projection.dataset.prismMode=mode;
        [...projection.querySelectorAll('.prism-ray')].forEach((ray,index)=>ray.setAttribute('d',PATHS[mode][index]));
        const projectionStatus=projection.querySelector('[data-prism-projection-status]'),projectionReadout=projection.querySelector('[data-prism-projection-readout]');
        if(projectionStatus)projectionStatus.textContent=MODES[mode].status;if(projectionReadout)projectionReadout.textContent=MODES[mode].readout;
      });
    }
    function stopSequence(){if(timer){win.clearInterval(timer);timer=null}sequenceButtons.forEach(button=>{button.classList.remove('is-playing');button.textContent=button.closest('[data-prism-projection]')?'▶ ALLE 3':'▶ ALLE 3 ALS SEQUENZ'})}
    function setMode(next,source){
      if(!MODES[next])return;
      mode=next;machine.dataset.prismMode=mode;
      [...group.querySelectorAll('.prism-ray')].forEach((ray,index)=>ray.setAttribute('d',PATHS[mode][index]));
      const relationButton=doc.querySelector(`[data-state-relation="${MODES[mode].relation}"]`);if(relationButton)relationButton.click();
      modeButtons.forEach(button=>button.classList.toggle('primary',button.dataset.prismMode===mode));
      status.textContent=MODES[mode].status;readout.textContent=MODES[mode].readout;boundary.textContent=MODES[mode].boundary;
      host.dataset.prismMode=mode;syncProjections();
      setReturnStage(returnStage,source==='mount'?'mount':'mode-change');
      win.dispatchEvent(new win.CustomEvent('a0:prism-relation-selection',{detail:{moduleId:'OCB:PRISM_RELATION_LENS',focusTarget:'statePanel',bindingType:'SOURCE_BOUND_VIEW',mode,source:source||'manual'}}));
    }
    function playSequence(){
      if(timer){stopSequence();return}
      step=0;sequenceButtons.forEach(button=>{button.classList.add('is-playing');button.textContent='Ⅱ SEQUENZ PAUSIEREN'});setMode('newton','sequence');
      timer=win.setInterval(()=>{step=(step+1)%3;setMode(['newton','leibniz','goethe'][step],'sequence')},2200);
      win.dispatchEvent(new win.CustomEvent('a0:prism-relation-playback',{detail:{moduleId:'OCB:PRISM_RELATION_LENS',state:'PLAYING'}}));
    }
    modeButtons.forEach(button=>button.addEventListener('click',()=>{stopSequence();setMode(button.dataset.prismMode,'manual')}));
    sequenceButtons.forEach(button=>button.addEventListener('click',playSequence));
    returnButtons.forEach(button=>button.addEventListener('click',()=>{stopReturn('interaction');setReturnStage(button.dataset.prismStage,'manual')}));
    if(returnPlay)returnPlay.addEventListener('click',playReturn);
    setMode('newton','mount');
    return {setMode,play:playSequence,stop:stopSequence,setReturnStage,playReturn,stopReturn,getReturnRecord:()=>createReturnRecord(returnStage,mode),getState:()=>({mode,playing:Boolean(timer),returnStage,returnPlaying:Boolean(returnTimer)})};
  }
  root.A0PrismRelationLens={mount,MODES,PATHS,RETURN_STAGES,createReturnRecord};
})(window);

