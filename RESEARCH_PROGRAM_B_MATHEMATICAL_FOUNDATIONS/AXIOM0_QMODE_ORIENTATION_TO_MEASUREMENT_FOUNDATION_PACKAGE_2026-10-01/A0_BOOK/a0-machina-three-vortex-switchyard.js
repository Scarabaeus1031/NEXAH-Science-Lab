(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0MachinaThreeVortexSwitchyard=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='nexah.view.machina-three-vortex-switchyard/0.3.0-experimental';
  const VORTICES=Object.freeze([
    Object.freeze({id:'NT',role:'NUMBER_TOPOLOGY_VIEW',label:'NUMBER / TOPOLOGY',color:'gold',preserves:'typed address + register size'}),
    Object.freeze({id:'SG',role:'SCARAB_GEOMETRY_VIEW',label:'SCARAB / GEOMETRY',color:'cyan',preserves:'shape + source-view provenance'}),
    Object.freeze({id:'ER',role:'EXIT_RETURN_VIEW',label:'EXIT / RETURN',color:'pink',preserves:'source slot + inverse receipt'})
  ]);
  const REGISTERS=Object.freeze({
    '12x12':Object.freeze({label:'12×12',value:144,kind:'EVEN_FINITE_VIEW_REGISTER',center:'FOUR_CELLS_AROUND_GEOMETRIC_CENTER',claim:'12²=144'}),
    '11x11':Object.freeze({label:'11×11',value:121,kind:'ODD_FINITE_OBSERVER_GRID',center:'ONE_CENTER_CELL',claim:'11²=121'}),
    '23^3':Object.freeze({label:'23³',value:12167,kind:'BASE_TRANSLATION_ADDRESS_VIEW',center:'NOT_A_GRID_CENTER_CLAIM',claim:'23³=12167₁₀=2F87₁₆'})
  });
  const ROLES=Object.freeze({
    alpha:Object.freeze({label:'α · NXA',status:'HISTORICAL_HARMONY_VIEW_LABEL_NOT_FORMAT'}),
    beta:Object.freeze({label:'β · SCARAB',status:'HISTORICAL_RESONANCE_VIEW_LABEL_NOT_CARRIER'}),
    gamma:Object.freeze({label:'γ · XVA',status:'HISTORICAL_AXIS_BRIDGE_VIEW_LABEL_NOT_FORMAT'})
  });
  const PINK_AXIS=Object.freeze({
    kind:'COUPLED_TRACEABLE_ADDRESS_VIEW',
    coarse_rail:Object.freeze({addresses:Object.freeze([33,43,53]),pivot:43,stride:10,symmetric:true,witness:'33+53=2×43'}),
    fine_rail:Object.freeze({addresses:Object.freeze([41,42,43]),translation:Object.freeze({operator:'h↦h+990',targets:Object.freeze([1031,1032,1033])}),pivot_witness:'1032=24×43'}),
    carrier_lift:Object.freeze({source_pair:Object.freeze([25,31]),pair_is_typed:true,sum:56,divisor:7,multiplier:8,multiplier_form:'2^3',result:64,forward:'((25+31)/7)×2^3=64',inverse:'64×7/2^3=56',source_pair_required_for_exact_split_return:true}),
    lux:Object.freeze({address:2501,factor_witness:Object.freeze([41,61]),rule:'2501=41×61',separate_from_carrier_lift:true,derived_from_source_pair:false}),
    rotation:Object.freeze({kind:'VIEW_ROTATION_ONLY',preserves:Object.freeze(['coarse_rail','fine_rail','source_pair','operator_path','LUX_separation']),changes_source:false})
  });
  const DEMO_STEPS=Object.freeze([
    Object.freeze({vortexIndex:0,register:'12x12',title:'1 · Quelle lesen',copy:'NT liest 12×12 als gerades Register mit 144 adressierbaren Zellen.',route:'NT'}),
    Object.freeze({vortexIndex:1,register:'12x12',title:'2 · Form sehen',copy:'SG zeigt dasselbe 12×12-Register als Scarab-/Geometrieansicht. Die Zahl bleibt 144.',route:'SG'}),
    Object.freeze({vortexIndex:1,register:'11x11',title:'3 · Mittelpunkt vergleichen',copy:'11×11 wechselt den Zentrumstyp: Jetzt gibt es genau eine mittlere Zelle.',route:'SG'}),
    Object.freeze({vortexIndex:2,register:'23^3',title:'4 · Adresse ausgeben',copy:'ER liest 23³ als 12167₁₀ beziehungsweise 2F87₁₆. Das ist keine Grid-Mitte.',route:'ER'}),
    Object.freeze({vortexIndex:2,register:'23^3',title:'5 · Sanduhr hält den Beleg',copy:'}{ ist der interne Handoff. Register, Quelle und inverse Route bleiben im Receipt erhalten.',route:'ER',pivot:true}),
    Object.freeze({vortexIndex:0,register:'12x12',title:'6 · Exakter Return',copy:'Die View kehrt zu NT und zum Ausgangsregister 12×12 zurück. Nichts wurde verschmolzen.',route:'RETURN',returned:true})
  ]);
  const EFFECT_STEPS=Object.freeze([
    Object.freeze({scene:'zither',vortexIndex:0,register:'12x12',title:'1 · Zither / Quelle',copy:'Die Zither macht den Eingang als gezitterte Anzeige sichtbar. Sie ist ein source-bound Display-Translator, keine akustische Messung.',route:'NT'}),
    Object.freeze({scene:'elevator',vortexIndex:0,register:'11x11',title:'2 · Über den Würfel',copy:'Der Elevator hebt die Leseposition über den Cube. 11×111→1221 bleibt eine exakte Adressrechnung; die Kamera ist nur View.',route:'NT'}),
    Object.freeze({scene:'cube',vortexIndex:1,register:'11x11',title:'3 · Cube in Bewegung',copy:'Die vorhandene 1:2:3-Wobble-Ansicht bewegt den Körper, ohne Register oder Carrier umzuschreiben.',route:'SG'}),
    Object.freeze({scene:'polar',vortexIndex:1,register:'23^3',title:'4 · Polar / Euler',copy:'Die Linse wechselt zu θ/π und e^(iθ). Das sind Koordinaten derselben Anzeige, keine neue physikalische Kopplung.',route:'SG'}),
    Object.freeze({scene:'split',vortexIndex:1,register:'23^3',title:'5 · Adressen getrennt halten',copy:'4↔17, ℤ/77, π und Euler stehen als getrennte Marker am Split. Die Tour behauptet keine gemeinsame Gleichung.',route:'SG'}),
    Object.freeze({scene:'phase',vortexIndex:1,register:'12x12',title:'6 · Innenraum / Phase',copy:'Im Cube erscheint das vorhandene endliche 2⁶-Phasenregister: 64 Zustände, lesbar als 4×16.',route:'SG'}),
    Object.freeze({scene:'lorenz',vortexIndex:1,register:'12x12',title:'7 · Lorenz als Referenz',copy:'DYN:LORENZ_63 liefert eine dokumentarische Bewegungsreferenz. Hier läuft keine neue Simulation und keine Runtime-Kopplung.',route:'SG'}),
    Object.freeze({scene:'ty',vortexIndex:2,register:'23^3',title:'8 · T/Y-Split',copy:'QRT trennt T_Y und T_β am gemeinsamen Handoff. Beide bleiben getypte Ansichten.',route:'ER',pivot:true}),
    Object.freeze({scene:'pinkaxis',vortexIndex:2,register:'12x12',title:'9 · Gekoppelte Pink-Achse',copy:'33–43–53 und 41–42–43 drehen als View um den erhaltenen 43-Pivot. 25|31, ÷7 und ×2³ bleiben im Receipt, damit 64 rückverfolgbar bleibt.',route:'ER',pivot:true}),
    Object.freeze({scene:'return',vortexIndex:0,register:'12x12',title:'10 · IOI / exakter Return',copy:'Inside→Outside→Inside schließt auf NT. Drei orange Rails markieren die Anzeige; sie sind kein neuer Operator.',route:'RETURN',returned:true})
  ]);
  const mod=(n,m)=>((n%m)+m)%m;
  function createReceipt({vortexIndex=0,register='12x12'}={}){
    if(!Number.isInteger(vortexIndex)||vortexIndex<0||vortexIndex>=VORTICES.length)throw new TypeError('THREE_VORTEX_INDEX_INVALID');
    if(!REGISTERS[register])throw new TypeError('THREE_VORTEX_REGISTER_INVALID');
    return validate({
      schema:SCHEMA,
      state:'SOURCE_BOUND_SORTING_VIEW_NOT_FROZEN',
      host:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',
      route:['NT','SG','ER','NT'],
      selected_vortex:VORTICES[vortexIndex],
      selected_register:{id:register,...REGISTERS[register]},
      pivot:{glyph:'}{',role:'COMMON_INTERNAL_VIEW_HANDOFF',sandglass_inside:true,new_object:false},
      three_vortices:{count:3,kind:'DISPLAY_TOPOLOGY_ONLY',physical_vortex_claim:false},
      role_labels:ROLES,
      historical_numeric_marker:{value:17399,factors:[127,137],status:'EXACT_ARITHMETIC_MARKER_NOT_SHARED_MECHANISM'},
      coupled_pink_axis:PINK_AXIS,
      effect_tour:{kind:'EXISTING_INSTRUMENT_ORCHESTRATION',steps:EFFECT_STEPS.length,reuses:['A0_ZITHER_TRANSLATOR','A0_11X111_GRID_ELEVATOR','MACHINA_CUBE_WOBBLE','MACHINA_TRIANGLE_PHI_LENS','DYN:LORENZ_63','QRT_T_Y_T_BETA','INSIDE_OUTSIDE_INSIDE'],lorenz_runtime_execution:false,orange_rails_role:'DISPLAY_MARKER_ONLY',address_marker_4_17:'SEPARATE_UNEQUATED_VIEW_MARKER'},
      ullinirium_q4_reference:{outer_slots:12,common_pivots:1,q4_unordered_antipodal_pairs:12,relation:'DECLARED_VIEW_INDEX_ONLY'},
      separations:{registers_are_not_equal:true,SG_is_not_source_graph_prefix:true,format_conversion_implemented:false,carrier_merge:false},
      exact_return:true,
      identity_reuse:['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:TESSAREC','BT-045','OP-UDF-01'],
      new_canonical_ids:[],relation_changes:[],aliases:[],
      claim_boundary:'NT, SG and ER are Owner working labels for three sortable machine views. The sandglass is a common internal handoff. 12x12, 11x11 and 23^3 remain distinct typed registers. The coupled Pink Axis is a receipt-preserving local address view; 2501 stays a separate LUX factor witness and is not derived from 25|31. Alpha, beta and gamma remain historical view labels; no NXA, Scarab or XVA format, converter, carrier, physical vortex, shared mechanism or Navigator relation is established.'
    });
  }
  function validate(r){
    if(!r||r.schema!==SCHEMA)throw new TypeError('THREE_VORTEX_SCHEMA_INVALID');
    if(r.host!=='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'||r.route.join('>')!=='NT>SG>ER>NT'||r.exact_return!==true)throw new TypeError('THREE_VORTEX_ROUTE_INVALID');
    if(!VORTICES.some(v=>v===r.selected_vortex)||!REGISTERS[r.selected_register?.id])throw new TypeError('THREE_VORTEX_SELECTION_INVALID');
    if(r.selected_register.value!==REGISTERS[r.selected_register.id].value)throw new TypeError('THREE_VORTEX_REGISTER_VALUE_INVALID');
    if(r.pivot?.glyph!=='}{'||r.pivot.new_object!==false||r.three_vortices?.physical_vortex_claim!==false)throw new TypeError('THREE_VORTEX_PIVOT_BOUNDARY_INVALID');
    const p=r.coupled_pink_axis;
    if(!p||p.coarse_rail.addresses.join(',')!=='33,43,53'||p.coarse_rail.addresses[0]+p.coarse_rail.addresses[2]!==2*p.coarse_rail.pivot||p.fine_rail.addresses.join(',')!=='41,42,43'||p.fine_rail.translation.targets.join(',')!=='1031,1032,1033')throw new TypeError('THREE_VORTEX_PINK_AXIS_RAIL_INVALID');
    if(p.carrier_lift.source_pair.reduce((a,b)=>a+b,0)!==p.carrier_lift.sum||(p.carrier_lift.sum/p.carrier_lift.divisor)*p.carrier_lift.multiplier!==p.carrier_lift.result||p.carrier_lift.multiplier!==2**3||p.carrier_lift.source_pair_required_for_exact_split_return!==true)throw new TypeError('THREE_VORTEX_PINK_AXIS_LIFT_INVALID');
    if(p.lux.address!==2501||p.lux.factor_witness.reduce((a,b)=>a*b,1)!==2501||p.lux.separate_from_carrier_lift!==true||p.lux.derived_from_source_pair!==false||p.rotation.changes_source!==false)throw new TypeError('THREE_VORTEX_PINK_AXIS_BOUNDARY_INVALID');
    if(r.historical_numeric_marker.value!==127*137||r.separations.SG_is_not_source_graph_prefix!==true||r.separations.format_conversion_implemented!==false||r.effect_tour.lorenz_runtime_execution!==false||r.effect_tour.orange_rails_role!=='DISPLAY_MARKER_ONLY')throw new TypeError('THREE_VORTEX_BOUNDARY_INVALID');
    if(r.new_canonical_ids.length||r.relation_changes.length||r.aliases.length)throw new TypeError('THREE_VORTEX_GRAPH_DELTA_FORBIDDEN');
    return r;
  }
  function mount(host){
    if(!host)return null;let vortexIndex=0,register='12x12',timer=null,tourIndex=-1;
    const vortexButtons=[...host.querySelectorAll('[data-tvs-vortex]')],registerButtons=[...host.querySelectorAll('[data-tvs-register]')],next=host.querySelector('[data-tvs-next]'),reset=host.querySelector('[data-tvs-return]'),demo=host.querySelector('[data-tvs-demo]'),effectDemo=host.querySelector('[data-tvs-effect-demo]'),tour=host.querySelector('[data-tvs-tour]'),pause=host.querySelector('[data-tvs-pause]'),axisRotate=host.querySelector('[data-tvs-axis-rotate]'),axisReturn=host.querySelector('[data-tvs-axis-return]'),axisState=host.querySelector('[data-tvs-axis-state]'),status=host.querySelector('[data-tvs-status]'),role=host.querySelector('[data-tvs-role]'),value=host.querySelector('[data-tvs-value]'),center=host.querySelector('[data-tvs-center]'),receipt=host.querySelector('[data-tvs-receipt]'),guideProgress=host.querySelector('[data-tvs-guide-progress]'),guideTitle=host.querySelector('[data-tvs-guide-title]'),guideCopy=host.querySelector('[data-tvs-guide-copy]'),effectKicker=host.querySelector('[data-tvs-effect-kicker]'),effectTitle=host.querySelector('[data-tvs-effect-title]'),effectCopy=host.querySelector('[data-tvs-effect-copy]'),routeSteps=[...host.querySelectorAll('[data-tvs-route-step]')];
    const phaseDots=host.querySelector('.tvs-phase-dots');if(phaseDots&&!phaseDots.childElementCount)phaseDots.innerHTML=Array.from({length:64},(_,index)=>`<circle cx="${276+(index%8)*24}" cy="${174+Math.floor(index/8)*23}" r="4" fill="${index%4===0?'#f569ad':'#65ddd7'}"/>`).join('');
    function stop(){if(timer){clearTimeout(timer);timer=null}host.dataset.running='false';pause.disabled=true;demo.textContent='SORTIER-DEMO';effectDemo.textContent='▶ WIRKUNG ZEIGEN'}
    function draw(message,route){const r=createReceipt({vortexIndex,register});vortexButtons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===vortexIndex)));registerButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tvsRegister===register)));role.textContent=`${r.selected_vortex.id} · ${r.selected_vortex.label}`;value.textContent=`${r.selected_register.label} · ${r.selected_register.claim}`;center.textContent=r.selected_register.center.replaceAll('_',' ');status.textContent=message||`CONNECTED · ${r.selected_vortex.id} · ${r.selected_register.kind} · }{ PIVOT HELD`;receipt.textContent=JSON.stringify(r,null,2);host.dataset.vortex=r.selected_vortex.id.toLowerCase();host.dataset.register=register.replaceAll('^','-').replaceAll('x','-');effectKicker.textContent=`${r.selected_register.label} · ${r.selected_register.kind.replaceAll('_',' ')}`;effectTitle.textContent=register==='12x12'?'144 Adressen':register==='11x11'?'121 Zellen · 1 Mitte':'12167₁₀ · 2F87₁₆';effectCopy.textContent=register==='12x12'?'Vier Zellen treffen sich am geometrischen Mittelpunkt.':register==='11x11'?'Eine Zelle liegt exakt im Zentrum des Beobachterrasters.':'Drei sichtbare Schichten markieren eine Adressansicht, keinen Würfelkörper.';routeSteps.forEach(step=>step.classList.toggle('is-active',step.dataset.tvsRouteStep===(route||r.selected_vortex.id)));return r}
    function showStep(index,mode){const step=DEMO_STEPS[index];vortexIndex=step.vortexIndex;register=step.register;host.dataset.pivot=String(Boolean(step.pivot));guideProgress.textContent=`${index+1} / ${DEMO_STEPS.length} · ${mode}`;guideTitle.textContent=step.title;guideCopy.textContent=step.copy;draw(step.returned?'PASS · NT → SG → ER → NT · EXACT VIEW RETURN':`DEMO · ${step.title.toUpperCase()}`,step.route);tour.textContent=index===DEMO_STEPS.length-1?'TOUR NEU STARTEN':'TOUR: WEITER →'}
    function showEffectStep(index){const step=EFFECT_STEPS[index];vortexIndex=step.vortexIndex;register=step.register;host.dataset.effectTour='true';host.dataset.scene=step.scene;host.dataset.pivot=String(Boolean(step.pivot));guideProgress.textContent=`${index+1} / ${EFFECT_STEPS.length} · WIRKUNG`;guideTitle.textContent=step.title;guideCopy.textContent=step.copy;draw(step.returned?'PASS · ZITHER → ELEVATOR → PHASE → T/Y → IOI → NT':`WIRKUNG · ${step.title.toUpperCase()}`,step.route)}
    function manual(){stop();tourIndex=-1;host.dataset.pivot='false';host.dataset.effectTour='false';delete host.dataset.scene}
    function runDemo(){stop();tourIndex=-1;let index=0;host.dataset.running='true';pause.disabled=false;demo.textContent='DEMO LÄUFT…';const tick=()=>{showStep(index,'AUTO');index++;if(index<DEMO_STEPS.length){timer=setTimeout(tick,1900)}else{timer=setTimeout(()=>{stop();guideProgress.textContent='6 / 6 · FERTIG'},900)}};tick()}
    function runEffectDemo(){stop();tourIndex=-1;let index=0;host.dataset.running='true';host.dataset.effectTour='true';pause.disabled=false;effectDemo.textContent='WIRKUNG LÄUFT…';const tick=()=>{showEffectStep(index);index++;if(index<EFFECT_STEPS.length){timer=setTimeout(tick,1100)}else{timer=setTimeout(()=>{stop();guideProgress.textContent=`${EFFECT_STEPS.length} / ${EFFECT_STEPS.length} · RETURN`;host.dataset.running='false'},900)}};tick()}
    vortexButtons.forEach((button,index)=>button.addEventListener('click',()=>{manual();vortexIndex=index;draw()}));registerButtons.forEach(button=>button.addEventListener('click',()=>{manual();register=button.dataset.tvsRegister;draw()}));next.addEventListener('click',()=>{manual();vortexIndex=mod(vortexIndex+1,VORTICES.length);draw(vortexIndex===0?'PASS · NT → SG → ER → NT · EXACT VIEW RETURN':`STEP · ${VORTICES[vortexIndex].id} · ${VORTICES[vortexIndex].label}`)});reset.addEventListener('click',()=>{manual();vortexIndex=0;register='12x12';host.dataset.axisMotion='held';axisState.textContent='HELD · SOURCE PAIR VISIBLE';draw('RETURN · NT SOURCE VIEW AND START REGISTER RESTORED · REGISTERS KEPT DISTINCT','RETURN')});demo.addEventListener('click',runDemo);effectDemo.addEventListener('click',runEffectDemo);pause.addEventListener('click',()=>{stop();guideProgress.textContent=guideProgress.textContent.replace(/AUTO|WIRKUNG/,'PAUSE')});tour.addEventListener('click',()=>{stop();tourIndex=mod(tourIndex+1,DEMO_STEPS.length);showStep(tourIndex,'TOUR')});axisRotate.addEventListener('click',()=>{manual();vortexIndex=2;register='12x12';host.dataset.axisMotion='rotating';axisState.textContent='ROTATING VIEW · RECEIPT HELD';draw('PINK AXIS · VIEW ROTATES · 43 / 25|31 / 7 / 2³ REMAIN TRACEABLE','ER')});axisReturn.addEventListener('click',()=>{manual();vortexIndex=0;register='12x12';host.dataset.axisMotion='returned';axisState.textContent='PASS · 64×7÷2³=56 · 25|31 HELD';draw('PASS · 25|31 → 56 → ÷7 → ×2³ → 64 → ×7 → ÷2³ → 56 · PAIR RECEIPT RESTORES SPLIT','RETURN')});host.dataset.axisMotion='held';draw();return{getReceipt:()=>createReceipt({vortexIndex,register}),next:()=>{vortexIndex=mod(vortexIndex+1,3);return draw()},runDemo,runEffectDemo,showStep,showEffectStep,stop};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-three-vortex-switchyard]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return{SCHEMA,VORTICES,REGISTERS,ROLES,PINK_AXIS,DEMO_STEPS,EFFECT_STEPS,createReceipt,validate,mount,mountAll};
});
