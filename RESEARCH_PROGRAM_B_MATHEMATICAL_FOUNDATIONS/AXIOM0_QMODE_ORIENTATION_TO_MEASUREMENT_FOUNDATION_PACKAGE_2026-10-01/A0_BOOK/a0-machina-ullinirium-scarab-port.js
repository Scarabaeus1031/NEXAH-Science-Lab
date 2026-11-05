(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-ullinirium-q4-view-anchor.js'):root.A0UlliniriumQ4ViewAnchor);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0MachinaUlliniriumScarabPort=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(U){
  'use strict';
  if(!U)throw new Error('A0_ULLINIRIUM_Q4_VIEW_ANCHOR_REQUIRED');

  const SCHEMA='nexah.udf.machina-ullinirium-scarab-view-port/0.2.0-experimental';
  const PHASES=Object.freeze([
    Object.freeze({id:'INSIDE_SOURCE',short:'IN',label:'INSIDE · SLOT / SOURCE'}),
    Object.freeze({id:'OUTSIDE_Q4_VIEW',short:'OUT',label:'OUTSIDE · Q4 / SCARAB VIEW'}),
    Object.freeze({id:'INSIDE_EXACT_RETURN',short:'IN',label:'INSIDE · EXACT RETURN'})
  ]);
  const TOUR_STEPS=Object.freeze([
    Object.freeze({title:'1 · SLOT / QUELLE',copy:'Wähle einen der zwölf ULLINIRIUM-Slots. Quelle und Slot bleiben unverändert.',route:'YELLOW',phaseIndex:0,focus:'slot'}),
    Object.freeze({title:'2 · YELLOW ROUTE',copy:'Die gelbe Route macht den ersten lesbaren Pfad zum zugehörigen Q4-Antipodenpaar sichtbar.',route:'YELLOW',phaseIndex:0,focus:'route'}),
    Object.freeze({title:'3 · OUTSIDE / SCARAB VIEW',copy:'NEXT IOI STEP wechselt nach außen: dieselbe Adresse erscheint als lokale Scarab-Ansicht.',route:'YELLOW',phaseIndex:1,focus:'step'}),
    Object.freeze({title:'4 · INSIDE / EXACT RETURN',copy:'Der nächste IOI-Schritt führt nach innen zurück und hält exakt denselben ULLINIRIUM-Slot.',route:'YELLOW',phaseIndex:2,focus:'return'}),
    Object.freeze({title:'5 · RECEIPT / RÜCKWEG',copy:'Das Receipt protokolliert Slot, Route, Q4-Paar und exakten Return – ohne neue ID oder Relation.',route:'YELLOW',phaseIndex:2,focus:'receipt',returned:true})
  ]);
  function createReceipt({slot=0,route='YELLOW',phaseIndex=0}={}){
    if(!Number.isInteger(phaseIndex)||phaseIndex<0||phaseIndex>=PHASES.length)throw new TypeError('IOI_PHASE_INVALID');
    const anchor=U.createReceipt({slot,route}),phase=phaseIndex;
    return validate({
      schema:SCHEMA,
      profile_state:'EXPERIMENTAL_MACHINE_VIEW_PORT_NOT_FROZEN',
      host:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',
      assembly:'THE_MACHINA',
      port:{
        role:'SCARAB_VIEW_PORT',
        carrier_implementation:false,
        glb_mutation:false,
        source_mutation:false
      },
      navigation:{
        sequence:'INSIDE_OUTSIDE_INSIDE',
        shorthand:'IOI',
        owner_notation:'IOI (j)',
        j_status:'OWNER_WORKING_MARK_NOT_OPERATOR',
        phase_index:phase,
        phase:PHASES[phase],
        exact_return:phase===2
      },
      anchor,
      guided_tour:{kind:'EXISTING_PORT_ORCHESTRATION',steps:TOUR_STEPS.length,teaches:['slot','route','outside_view','exact_return','receipt'],new_operator:false},
      identity_reuse:['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:TESSAREC','BT-045','OP-UDF-01'],
      new_canonical_ids:[],
      relation_changes:[],
      aliases:[],
      claim_boundary:'THE MACHINA consumes the existing ULLINIRIUM-to-Q4 receipt as a local Scarab view port. IOI (j) is an owner working notation for the three display phases, not a new operator. No Scarab carrier format, GLB mutation, geometric identity, shared physics or Navigator relation is established.'
    });
  }

  function validate(record){
    if(!record||record.schema!==SCHEMA)throw new TypeError('MACHINA_ULLINIRIUM_SCHEMA_INVALID');
    if(record.host!=='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'||record.assembly!=='THE_MACHINA')throw new TypeError('MACHINA_HOST_INVALID');
    if(record.port?.role!=='SCARAB_VIEW_PORT'||record.port.carrier_implementation!==false||record.port.glb_mutation!==false||record.port.source_mutation!==false)throw new TypeError('SCARAB_VIEW_PORT_BOUNDARY_INVALID');
    if(record.navigation?.sequence!=='INSIDE_OUTSIDE_INSIDE'||record.navigation.shorthand!=='IOI'||record.navigation.j_status!=='OWNER_WORKING_MARK_NOT_OPERATOR')throw new TypeError('IOI_BOUNDARY_INVALID');
    if(!Number.isInteger(record.navigation.phase_index)||record.navigation.phase_index<0||record.navigation.phase_index>2||record.navigation.phase!==PHASES[record.navigation.phase_index])throw new TypeError('IOI_PHASE_INVALID');
    U.validate(record.anchor);
    if(record.guided_tour?.kind!=='EXISTING_PORT_ORCHESTRATION'||record.guided_tour.steps!==TOUR_STEPS.length||record.guided_tour.new_operator!==false)throw new TypeError('IOI_TOUR_BOUNDARY_INVALID');
    if(record.anchor.source.selected_slot!==record.anchor.return.slot)throw new TypeError('IOI_RETURN_SLOT_INVALID');
    if(record.new_canonical_ids.length||record.relation_changes.length||record.aliases.length)throw new TypeError('MACHINA_GRAPH_DELTA_FORBIDDEN');
    return record;
  }

  function mount(host){
    if(!host)return null;
    const slot=host.querySelector('[data-mus-slot]'),routeButtons=[...host.querySelectorAll('[data-mus-route]')],phaseButtons=[...host.querySelectorAll('[data-mus-phase]')],stepButton=host.querySelector('[data-mus-step]'),returnButton=host.querySelector('[data-mus-return]'),ring=host.querySelector('[data-mus-ring]'),status=host.querySelector('[data-mus-status]'),pair=host.querySelector('[data-mus-pair]'),path=host.querySelector('[data-mus-path]'),phase=host.querySelector('[data-mus-phase-readout]'),receipt=host.querySelector('[data-mus-receipt]'),tourAuto=host.querySelector('[data-mus-tour-auto]'),tourNext=host.querySelector('[data-mus-tour-next]'),tourPause=host.querySelector('[data-mus-tour-pause]'),tourProgress=host.querySelector('[data-mus-tour-progress]'),tourTitle=host.querySelector('[data-mus-tour-title]'),tourCopy=host.querySelector('[data-mus-tour-copy]');
    U.PAIRS.forEach(item=>{const option=document.createElement('option');option.value=String(item.slot);option.textContent=`${String(item.slot+1).padStart(2,'0')} · ${item.origin} ↔ ${item.target}`;slot.append(option);const marker=document.createElement('button');marker.type='button';marker.dataset.musMarker=String(item.slot);marker.style.setProperty('--i',String(item.slot));marker.textContent=String(item.slot+1).padStart(2,'0');marker.setAttribute('aria-label',`ULLINIRIUM Slot ${item.slot+1}`);ring.append(marker)});
    let selected=0,route='YELLOW',phaseIndex=0,tourIndex=-1,tourTimer=null;
    function draw(message){
      const record=createReceipt({slot:selected,route,phaseIndex});
      [...ring.querySelectorAll('[data-mus-marker]')].forEach(marker=>marker.setAttribute('aria-pressed',String(Number(marker.dataset.musMarker)===selected)));
      routeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.musRoute===route)));
      phaseButtons.forEach((button,index)=>button.setAttribute('aria-current',index===phaseIndex?'step':'false'));
      pair.textContent=`${record.anchor.mapping.origin} ↔ ${record.anchor.mapping.antipode}`;
      path.textContent=record.anchor.mapping.route_path.join(' → ');
      phase.textContent=record.navigation.phase.label;
      status.textContent=message||`CONNECTED · SLOT ${String(selected+1).padStart(2,'0')} · ${route} · ${record.navigation.phase.short} · IOI (j) VIEW MARK`;
      receipt.textContent=JSON.stringify(record,null,2);
      host.dataset.phase=String(phaseIndex);host.dataset.route=route.toLowerCase();
      return record;
    }
    function stopTour(clearFocus=false){if(tourTimer){clearInterval(tourTimer);tourTimer=null}if(tourPause)tourPause.disabled=true;if(tourAuto)tourAuto.setAttribute('aria-pressed','false');if(clearFocus)delete host.dataset.tourFocus}
    function showTourStep(index){tourIndex=((index%TOUR_STEPS.length)+TOUR_STEPS.length)%TOUR_STEPS.length;const step=TOUR_STEPS[tourIndex];route=step.route;phaseIndex=step.phaseIndex;host.dataset.tourFocus=step.focus;if(tourTitle)tourTitle.textContent=step.title;if(tourCopy)tourCopy.textContent=step.copy;if(tourProgress)tourProgress.textContent=`${tourIndex+1} / ${TOUR_STEPS.length} · ${step.returned?'RETURN HELD':'YELLOW ROUTE'}`;return draw(step.returned?'PASS · TOUR COMPLETE · EXACT SOURCE SLOT RESTORED':`TOUR · ${step.title}`)}
    function runTour(){stopTour();showTourStep(0);if(tourPause)tourPause.disabled=false;if(tourAuto)tourAuto.setAttribute('aria-pressed','true');tourTimer=setInterval(()=>{if(tourIndex>=TOUR_STEPS.length-1){stopTour();return}showTourStep(tourIndex+1)},1500)}
    function manual(){stopTour(true);if(tourProgress)tourProgress.textContent='MANUELL · TOUR BEREIT'}
    slot.addEventListener('change',()=>{manual();selected=Number(slot.value);phaseIndex=0;draw()});
    ring.addEventListener('click',event=>{const marker=event.target.closest('[data-mus-marker]');if(!marker)return;manual();selected=Number(marker.dataset.musMarker);slot.value=String(selected);phaseIndex=0;draw()});
    routeButtons.forEach(button=>button.addEventListener('click',()=>{manual();route=button.dataset.musRoute;phaseIndex=0;draw()}));
    stepButton.addEventListener('click',()=>{manual();phaseIndex=Math.min(2,phaseIndex+1);draw(phaseIndex===2?'PASS · INSIDE → OUTSIDE → INSIDE · EXACT SLOT RETURN':`STEP · ${PHASES[phaseIndex].label}`)});
    returnButton.addEventListener('click',()=>{manual();phaseIndex=2;draw('PASS · IOI RETURN HELD · SOURCE SLOT RESTORED')});
    if(tourAuto)tourAuto.addEventListener('click',runTour);
    if(tourNext)tourNext.addEventListener('click',()=>{stopTour();showTourStep(tourIndex+1)});
    if(tourPause)tourPause.addEventListener('click',()=>stopTour());
    draw();
    return{getReceipt:()=>createReceipt({slot:selected,route,phaseIndex}),setSlot:value=>{selected=value;slot.value=String(value);phaseIndex=0;draw()},step:()=>{phaseIndex=Math.min(2,phaseIndex+1);return draw()},showTourStep,runTour,stopTour};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-machina-ullinirium-port]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return{SCHEMA,PHASES,TOUR_STEPS,createReceipt,validate,mount,mountAll};
});
