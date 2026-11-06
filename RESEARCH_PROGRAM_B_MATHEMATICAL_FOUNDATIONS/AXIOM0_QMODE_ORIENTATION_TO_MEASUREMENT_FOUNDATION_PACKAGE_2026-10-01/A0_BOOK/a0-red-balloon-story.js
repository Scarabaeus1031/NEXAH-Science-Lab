(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0RedBalloonStory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.6.0';
  const TAU=2*Math.PI;
  const PHI=(1+Math.sqrt(5))/2;
  const DE_RIS_GATES=Object.freeze([
    Object.freeze({id:'plug-thread',number:'01',title:'Plug is not thread',copy:'Der Grad-Plug adressiert eine Stelle des horizontalen φ/Euler-Gewindes; er ist nicht mit dessen kontinuierlichem Verlauf identisch.'}),
    Object.freeze({id:'front-back',number:'02',title:'Front / Back preserved',copy:'Front-X und Back-X bleiben als getrennte Orientierungsseiten im Receipt erhalten.'}),
    Object.freeze({id:'legs',number:'03',title:'Counter-legs distinct',copy:'Die Beine i und −i dürfen gemeinsam schließen, ohne als dieselbe Orientierung behandelt zu werden.'}),
    Object.freeze({id:'navel',number:'04',title:'Navel level fixed',copy:'Coccyx und Nabel bilden das deklarierte Lot; die Nabel-Wasserwaage bleibt Referenz, während das Gewinde dreht.'}),
    Object.freeze({id:'closure',number:'05',title:'Closure without reset',copy:'Eine volle 360°-Passage rekonstruiert Plug-Adresse und Orientierung, setzt aber Turn-Zähler und Geschichte nicht zurück.'}),
    Object.freeze({id:'lenses',number:'06',title:'Comparison lenses separate',copy:'η≈0.429, Spektralbänder und Root7 bleiben optionale Vergleichslinsen und werden nicht aus der Screw abgeleitet.'})
  ]);
  const ALGO_STREAM_STEPS=Object.freeze([
    Object.freeze({id:'hands',number:'01',title:'Hands / wrists',copy:'Linke und rechte Hand bleiben getrennte Enden der vorhandenen Körperansicht. Sie senden zwei sichtbare Routen aus; sie erzeugen keinen neuen Carrier.'}),
    Object.freeze({id:'x-route',number:'02',title:'X-route',copy:'Die beiden Handrouten kreuzen sich als X. Die Kreuzung ist eine Displayroute und kein Beweis für Kopplung, Kraft oder Identität.'}),
    Object.freeze({id:'grey-space',number:'03',title:'Grey Space',copy:'Å · I | GREY SPACE | O hält den Vergleichsraum offen: bounded mask, switch und unresolved interior — kein materielles graues Band.'}),
    Object.freeze({id:'algo-purple',number:'04',title:'ALGO Purple',copy:'F1, F2 und F3 bleiben drei getrennte ALGO_PURPLE_CO_SEAM-Adressen innerhalb derselben source-bound Ansicht.'}),
    Object.freeze({id:'pink-strip',number:'05',title:'Pink Strip',copy:'Der Pink Strip markiert Cut und Handoff. Er liest die endliche Route, speichert aber weder Geschichte noch einen verborgenen Zustand.'}),
    Object.freeze({id:'return',number:'06',title:'Return trace',copy:'Die Return Trace führt zur adressierbaren Quelle zurück. Sie rekonstruiert die Lesekette, ohne den früheren Zustand wiederherzustellen.'})
  ]);
  const STORIES=Object.freeze([
    Object.freeze({id:'witness',number:'01',title:'One witness',copy:'Der Red Balloon beginnt als ein gesetztes Bit am SP-Pivot. Noch ist er kein 99-Bit-Feld.',formula:'b*=1 · SP=(0,0)'}),
    Object.freeze({id:'field',number:'02',title:'Ninety-nine peas',copy:'Neun Reihen mit je elf adressierten Gates bilden das endliche Feld. Alle 99 Slots sind gesetzt; 49 Gegenpaare schließen und ein Witness bleibt übrig.',formula:'G={g1,…,g99} · 99=9×11=49×2+1'}),
    Object.freeze({id:'phase',number:'03',title:'The field receives colour',copy:'Die Binärmaske bleibt von der Farbe getrennt. Jedem Gate wird nur für diese Ansicht eine Phase auf dem Einheitskreis zugewiesen.',formula:'Hj=exp(iθj) · θj=2π(j−1)/99'}),
    Object.freeze({id:'ring',number:'04',title:'Sixteen steps, sixteen gaps',copy:'Der äußere Ring zählt 32 Halbphasen. Gerade Adressen sind Schritte; ungerade Adressen sind die dazwischenliegenden Lücken.',formula:'n∈Z32 · n mod 2∈{0,1} · Δ=11.25°'}),
    Object.freeze({id:'return',number:'05',title:'Balance, trajectory, closure',copy:'SP führt den Witness entlang einer deklarierten Bahn zum blauen Zustand. Die Gegenorientierungen i und −i bleiben getrennt; die Apertur schließt von Tα zu T0.',formula:'A=50=P+E=49+1 · i⁻¹=−i · Tα→T0'}),
    Object.freeze({id:'curtain',number:'06',title:'The other side of the curtain',copy:'Die geschlossene Fläche wird zur deklarierten Primmaske. Unter den Adressen 1 bis 99 sind genau 25 Primadressen offen; 74 Positionen bleiben Vorhang. Die gleiche Phase erscheint dahinter als weißes Funkeln.',formula:'P₉₉={p≤99 | p prim} · |P₉₉|=25 · 99−25=74'})
  ]);

  function isPrime(value){
    const n=Number(value);
    if(!Number.isInteger(n)||n<2)return false;
    for(let d=2;d*d<=n;d+=1)if(n%d===0)return false;
    return true;
  }

  function primeMask(){
    const records=Object.freeze(Array.from({length:99},(_,offset)=>{
      const address=offset+1,open=isPrime(address);
      const lane=!open?'OPAQUE':address===2||address===3?'SEED':address%6===1?'SIX_PLUS':'SIX_MINUS';
      return Object.freeze({address,open,lane});
    }));
    const holes=records.filter(item=>item.open).length;
    return Object.freeze({records,holes,opaque:records.length-holes,seeds:records.filter(item=>item.lane==='SEED').length,sixPlus:records.filter(item=>item.lane==='SIX_PLUS').length,sixMinus:records.filter(item=>item.lane==='SIX_MINUS').length});
  }

  function gateRecords(){
    const records=[];
    for(let row=0;row<9;row+=1)for(let col=0;col<11;col+=1){
      const index=row*11+col+1;
      const angle=(-0.78+(col/10)*1.56)+(row-4)*0.017;
      const radius=44+row*14;
      const theta=TAU*(index-1)/99;
      records.push(Object.freeze({
        index,row,col,bit:1,ledgerSign:index%2===1?1:-1,
        theta,phaseRe:Math.cos(theta),phaseIm:Math.sin(theta),
        x:400+Math.sin(angle)*radius,y:312-Math.cos(angle)*radius
      }));
    }
    return Object.freeze(records);
  }

  function parityRing(){
    return Object.freeze(Array.from({length:32},(_,n)=>Object.freeze({
      index:n,parity:n%2===0?'EVEN_STEP':'ODD_GAP',angleRadians:TAU*n/32,angleDegrees:360*n/32
    })));
  }

  function ledger(){
    const records=gateRecords();
    const assets=records.filter(item=>item.ledgerSign===1).length;
    const liabilities=records.filter(item=>item.ledgerSign===-1).length;
    return Object.freeze({assets,liabilities,equity:assets-liabilities,identity:`${assets}=${liabilities}+${assets-liabilities}`});
  }

  function aperture(alphaDegrees){
    const alpha=Math.max(0,Math.min(30,Number(alphaDegrees)));
    return Object.freeze({alphaDegrees:alpha,state:alpha===0?'T0_CLOSED':'T_ALPHA_OPEN',closed:alpha===0});
  }

  function derisScrew(angleDegrees=360){
    const raw=Math.max(0,Math.min(720,Number(angleDegrees)||0));
    const address=((raw%360)+360)%360;
    const radians=address*Math.PI/180;
    const turns=Math.floor(raw/360);
    const atReturn=address===0&&raw>0;
    const side=address<180?'FRONT_X':'BACK_X';
    const state=Object.freeze({
      schema:'nexah.a0.red-balloon-deris-screw-view/1',
      classification:'SOURCE_BOUND_VIEW_ONLY',
      angleDegrees:raw,plugAddressDegrees:address,turns,
      thread:Object.freeze({phiPitch:PHI,eulerPhase:Object.freeze({re:Math.cos(radians),im:Math.sin(radians)}),ringMeasure:'PI',continuous:true}),
      plug:Object.freeze({unit:'DEGREE',discreteAddress:true}),
      legs:Object.freeze({left:'i',right:'-i',distinct:true,sharedClosure:atReturn}),
      orientation:Object.freeze({side,front:'FRONT_X',back:'BACK_X',preserved:true,noseToChin:'DIRECTION',coccyxToNavel:'LEVEL_REFERENCE'}),
      balance:Object.freeze({navelLevel:0,fixed:true}),
      closure:Object.freeze({addressReturn:atReturn,orientationReturn:atReturn,historyReset:false,historyTurns:turns}),
      comparisonLenses:Object.freeze({eta0429:'SEPARATE',spectrum:'SEPARATE',root7:'SEPARATE'}),
      newIdentity:false,newRelation:false,newStudy:false,newFinding:false,publication:false
    });
    const tests=Object.freeze([
      Object.freeze({id:'plug-thread',pass:state.plug.discreteAddress&&state.thread.continuous&&state.plug.unit==='DEGREE',status:'PASS'}),
      Object.freeze({id:'front-back',pass:state.orientation.front!==state.orientation.back&&state.orientation.preserved,status:'PASS'}),
      Object.freeze({id:'legs',pass:state.legs.left!==state.legs.right&&state.legs.distinct,status:'PASS'}),
      Object.freeze({id:'navel',pass:state.balance.fixed&&state.balance.navelLevel===0,status:'PASS'}),
      Object.freeze({id:'closure',pass:state.closure.addressReturn&&state.closure.orientationReturn&&!state.closure.historyReset,status:atReturn?'PASS':'HOLD'}),
      Object.freeze({id:'lenses',pass:Object.values(state.comparisonLenses).every(value=>value==='SEPARATE'),status:'PASS'})
    ]);
    return Object.freeze({...state,tests,allPass:tests.every(test=>test.pass)});
  }

  function algoStream(stepIndex=0){
    const index=Math.max(0,Math.min(ALGO_STREAM_STEPS.length-1,Math.trunc(Number(stepIndex)||0)));
    return Object.freeze({
      schema:'nexah.a0.red-balloon-algo-stream-grey-space-view/1',
      classification:'SOURCE_BOUND_VIEW_ONLY',
      workingLabel:'ALGO STREAM / GREY SPACE',
      index,step:ALGO_STREAM_STEPS[index],
      hands:Object.freeze({left:'LEFT_WRIST',right:'RIGHT_WRIST',distinct:true}),
      xRoute:Object.freeze({from:Object.freeze(['LEFT_WRIST','RIGHT_WRIST']),crossing:'DISPLAY_CROSSING',routeOnly:true}),
      greySpace:Object.freeze({sourceLabel:'Å · I | GREY SPACE | O',role:'COMPARISON_MASK_SWITCH_UNRESOLVED_INTERIOR',physicalBand:false}),
      coSeams:Object.freeze(['F1','F2','F3'].map(id=>Object.freeze({id,role:'ALGO_PURPLE_CO_SEAM'}))),
      pinkStrip:Object.freeze({role:'CUT_HANDOFF_VIEW',memory:false}),
      returnTrace:Object.freeze({role:'PINK_STRIP_RETURN_TRACE',addressable:true,historyReset:false}),
      sourceCrosswalk:Object.freeze({lightOrgan:'LIGHT_ORGAN_ELEVATOR_CHANNEL_MASK',algoPurple:'FST_PHASE_V_PURPLE_FRAME'}),
      newIdentity:false,newRelation:false,newStudy:false,newFinding:false,publication:false
    });
  }

  function algoNlkReturnDock(stepIndex=5){
    const stream=algoStream(stepIndex),exact=stream.step.id==='return';
    const fields=Object.freeze({
      selectedNode:'X_ROUTE_DISPLAY_CROSSING',
      frameAndPerspective:'GREY_SPACE_COMPARISON_FRAME',
      cut:'PINK_STRIP_CUT_HANDOFF_VIEW',
      relationLayers:Object.freeze(stream.coSeams.map(item=>Object.freeze({source:item.id,role:item.role,nlkReading:'SEAM_WITNESS'}))),
      wavePhase:'UNBOUND_NO_SHARED_CLOCK',
      returnState:exact?'EXACT_VIEW_RETURN':'HOLD_UNTIL_ALGO_RETURN'
    });
    const checks=Object.freeze([
      Object.freeze({id:'source',label:'SOURCE HELD',pass:stream.newIdentity===false}),
      Object.freeze({id:'cut',label:'CUT DECLARED',pass:fields.cut==='PINK_STRIP_CUT_HANDOFF_VIEW'}),
      Object.freeze({id:'seams',label:'SEAMS DISTINCT',pass:new Set(fields.relationLayers.map(item=>item.source)).size===3}),
      Object.freeze({id:'view',label:'VIEW RETURNED',pass:exact}),
      Object.freeze({id:'history',label:'HISTORY NOT RESET',pass:stream.returnTrace.historyReset===false})
    ]);
    return Object.freeze({
      schema:'nexah.a0.algo-nlk-return-dock/1',
      classification:'SOURCE_BOUND_COORDINATED_INTERFACE_PROJECTION_ONLY',
      identityReuse:Object.freeze(['ART:A0:MATHEMATICAL_JOINTS','NLK_L_SHELL','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1']),
      source:Object.freeze({schema:stream.schema,step:stream.step.id,workingLabel:stream.workingLabel}),
      target:Object.freeze({instrument:'A0_NLK_LSHELL_DEVELOPMENT_PROBE.html',anchor:'mainStageShell',role:'OBSERVATORY_AND_SWITCHBOARD'}),
      fields,checks,status:checks.every(check=>check.pass)?'EXACT_RETURN':'HOLD',polarMirror:polarMirrorCrosswalk(),
      preserves:Object.freeze(['SOURCE_IDENTITY','TYPED_ADDRESS','RELATION_KIND','EXACT_COUNT','VIEW_SOURCE_DISTINCTION']),
      commonCarrier:false,commonClock:false,sourceMutation:false,historyReset:false,
      newIdentity:false,newRelation:false,newStudy:false,newFinding:false,publication:false,
      boundary:'NLK reads the existing ALGO receipt as a finite observatory projection. The Polar/Mirror/Brane panel is a display crosswalk only. It does not become a seventh gate, share a clock or carrier with J/VV8, identify F1/F2/F3 with NLK seams, turn the Pink Strip into the Pink Diamond, identify X/O with X/0, treat a view membrane as a physical brane, reset history, mutate the source or create a Source Graph relation.'
    });
  }

  function polarMirrorCrosswalk(){
    return Object.freeze({
      schema:'nexah.a0.polar-mirror-brane-crosswalk/1',classification:'SOURCE_BOUND_DISPLAY_CROSSWALK_ONLY',rawGlyphInput:'œøō+rö',
      sourceViews:Object.freeze(['EXP20-B_MIRROR_BRIDGES','EXP20-C_POLAR_CYLINDER','EXP10_MIRROR_DISTANCE','EXP11_X_O_TRANSITION']),
      polarCylinder:Object.freeze({role:'COORDINATE_PROJECTION',angle:'RESIDUE_CLASS',height:'LOG_P',transportLaw:false,torus:false}),
      mirrorDistance:Object.freeze({role:'BASIS_DEPENDENT_NUMBER_VIEW',geometricMirror:false}),
      sphere:Object.freeze({blue:'OUTER_VIEW_SHELL',grey:'INNER_COMPARISON_SHELL',sharedBody:false}),
      bridges:Object.freeze({role:'RELATION_CANDIDATES',requiresDeclaredMap:true}),
      branes:Object.freeze({role:'DISPLAY_MEMBRANE_LAYERS',physicalBrane:false}),
      transition:Object.freeze({ownerLabel:'X/0',historicalSourceLabel:'X/O',zeroAndLetterODistinct:true,classifierBound:false}),
      bridgeBraneReturnMatrix:bridgeBraneReturnMatrix(),
      newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,publication:false
    });
  }

  function bridgeBraneReturnMatrix(){
    const rows=[
      {id:'polar',source:'(p, r₁₁)',view:'θ=2πr₁₁/11 · h=log(p)',cut:'polar projection',bridge:'angle/height map',residual:'quotient information lost',return:'OPEN · inverse address map missing'},
      {id:'mirror',source:'(p, base, width)',view:'rev_b(p)',cut:'digit encoding',bridge:'p ↔ rev_b(p)',residual:'base and leading-zero dependence',return:'CONDITIONAL · rev_b²=id at fixed contract'},
      {id:'shells',source:'record_id + address',view:'BLUE OUTER / GREY INNER',cut:'outer/inner mask',bridge:'same declared address',residual:'render delta only',return:'EXACT · address retained'},
      {id:'branes',source:'entry_id + path_id',view:'B₁ / B₂ / B₃ membranes',cut:'layer occlusion',bridge:'provenance trace',residual:'hidden span remains unresolved',return:'CONDITIONAL · entry/exit receipt required'},
      {id:'xzero',source:'X + raw œøō+rö',view:'Owner X/0',cut:'0 aperture',bridge:'classifier not bound',residual:'X/O versus X/0 unresolved',return:'HOLD · 0 ≠ O'}
    ].map(row=>Object.freeze(row));
    return Object.freeze({
      schema:'nexah.a0.bridge-brane-return-matrix/1',
      columns:Object.freeze(['SOURCE_ADDRESS','VIEW','CUT_MASK','BRIDGE','RESIDUAL','RETURN']),
      rows:Object.freeze(rows),
      exactRows:Object.freeze(rows.filter(row=>row.return.startsWith('EXACT')).map(row=>row.id)),
      openRows:Object.freeze(rows.filter(row=>!row.return.startsWith('EXACT')).map(row=>row.id)),
      claimCeiling:'A matrix row is a typed comparison contract. OPEN, CONDITIONAL and HOLD rows are not promoted to relations, operators, mechanisms or findings.'
    });
  }

  function reverseFixedWidth(value,width=4){
    const n=Number(value),w=Math.trunc(Number(width));
    if(!Number.isInteger(n)||n<0||!Number.isInteger(w)||w<1||String(n).length>w)throw new RangeError('Fixed-width non-negative integer required');
    return Number(String(n).padStart(w,'0').split('').reverse().join(''));
  }

  function whiteLineCikadaJoint(activeLane='x32'){
    const laneId=['x31','x32','x33'].includes(activeLane)?activeLane:'x32';
    const machinaRail=Object.freeze([
      Object.freeze({source:41,target:1031,port:'SG.FINE_RAIL.41',workingLabel:'X31'}),
      Object.freeze({source:42,target:1032,port:'SG.FINE_RAIL.42',workingLabel:'X32'}),
      Object.freeze({source:43,target:1033,port:'SG.FINE_RAIL.43',workingLabel:'X33'})
    ]);
    const lanes=Object.freeze([
      Object.freeze({id:'x31',workingLabel:'X31',sourceBand:'F1',sourceSlot:41,machinaPort:'SG.FINE_RAIL.41',address:1031,role:'LEFT_PRIME_CARTRIDGE',return:'AXIS_REFLECTION_TO_1033'}),
      Object.freeze({id:'x32',workingLabel:'X32',sourceBand:'F2',sourceSlot:42,machinaPort:'SG.FINE_RAIL.42',address:1032,role:'WHITE_LINE_AXIS_CARTRIDGE',return:'FIXED_BY_AXIS'}),
      Object.freeze({id:'x33',workingLabel:'X33',sourceBand:'F3',sourceSlot:43,machinaPort:'SG.FINE_RAIL.43',address:1033,mirrorAddress:3301,role:'RIGHT_PRIME_AND_DECIMAL_MIRROR_CARTRIDGE',return:'FIXED_WIDTH_DECIMAL_RETURN'})
    ]);
    const reflect=n=>2064-Number(n);
    const selected=lanes.find(lane=>lane.id===laneId);
    const checks=Object.freeze([
      Object.freeze({id:'midpoint',label:'1031+1033=2×1032',pass:1031+1033===2*1032}),
      Object.freeze({id:'axis-involution',label:'R₁₀₃₂²=id',pass:reflect(reflect(1031))===1031&&reflect(1032)===1032}),
      Object.freeze({id:'decimal-involution',label:'rev₄²=id',pass:reverseFixedWidth(reverseFixedWidth(1033,4),4)===1033}),
      Object.freeze({id:'three-plus-one',label:'3 bands + 1 frame',pass:lanes.length===3}),
      Object.freeze({id:'machina-port-map',label:'SG 41–42–43 + 990',pass:machinaRail.every((entry,index)=>entry.target===entry.source+990&&entry.target===lanes[index].address&&entry.port===lanes[index].machinaPort)}),
      Object.freeze({id:'trace-source',label:'rail trace ≠ wave',pass:true}),
      Object.freeze({id:'patina-role',label:'Green = Floor / Return',pass:true}),
      Object.freeze({id:'view-boundary',label:'Patina ≠ material',pass:true})
    ]);
    return Object.freeze({
      schema:'nexah.a0.white-line-cikada-fold-joint/2',
      classification:'SOURCE_BOUND_VIEW_ADAPTER_ONLY',
      identityReuse:Object.freeze(['ART:A0:MATHEMATICAL_JOINTS','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE']),
      sourceGate:Object.freeze({host:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',surface:'A0_MACHINA_COCKPIT.html#threeVortexSwitchyard',route:'SG',routeRole:'SCARAB_GEOMETRY_VIEW',rail:'coupled_pink_axis.fine_rail',sourceAddresses:Object.freeze([41,42,43]),operator:'h↦h+990',addresses:Object.freeze([1031,1032,1033]),portMap:machinaRail,existingNumberView:true,newPort:false}),
      lanes,selected,
      sharedFrame:Object.freeze({address:1032,role:'PLUS_ONE_WHITE_FOLD_AXIS',fourthChannel:false,formula:'R_1032(n)=2064-n'}),
      decimalMirror:Object.freeze({width:4,source:1033,target:3301,formula:'rev_4(1033)=3301',sourceOperation:'reverse10',sourceSurface:'a0-scarab-pillar-projection.js',sourceReceipt:'results/a0-scarab-pillar-projection-engineering-2026-10-23.json',binding:'ARITHMETIC_RETURN_ONLY_NOT_CIKADA_IDENTITY',involution:true,leadingZeroContractRequired:true}),
      trace:Object.freeze({kind:'ORDERED_SCARAB_ADDRESS_RAIL_VIEW',source:'THE_MACHINA_THREE_VORTEX_SWITCHYARD',route:'SG',generator:'h↦h+990',sourceRail:Object.freeze([41,42,43]),targetRail:Object.freeze([1031,1032,1033]),waveform:false,clock:null,physicalTrace:false}),
      patina:Object.freeze({viewLayer:'PATINA_V',role:'GREEN_FLOOR_RETURN_VIEW',counterface:'COPPER_VIEW',carrier:'SAME_IMAGE_CARRIER',sourceSurface:'assets/a0-field-notes/index.html#visual-atlas',supportingSurface:'A0_SCC_003_PASCAL_PENTAGON_PAPER.html#four-plate-reversal-lens',cubeRoles:Object.freeze(['EDGE_ORANGE','O0_INSIDE_ORANGE','CARRIER_GREEN']),materialLayer:'PATINA_M',materialAnalogy:'REAL_METAL_ENVIRONMENT_SURFACE_TRANSITION',materialBinding:'OUTSIDE_CURRENT_ADAPTER_REQUIRES_DECLARED_SUBSTRATE_MEDIUM_TIME_AND_REACTION',materialRole:false,agingProcess:false,physicalSurface:false,disposition:'SOURCE_DEFINED_DISPLAY_ROLE_MATERIAL_ANALOGY_NOT_BOUND'}),
      arithmetic:Object.freeze({midpoint:'1031+1033=2064=2×1032',factorization1032:'2^3×3×43',primes:Object.freeze([1031,1033,3301])}),
      display:Object.freeze({greenFloor:'GREEN_FLOOR_RETURN_VIEW',whiteLine:'SHARED_FOLD_AXIS',scarabRailTrace:'SOURCE_BOUND_ADDRESS_ROUTE_VIEW',materialClaim:false,resonanceClaim:false,waveClaim:false}),
      ilau:Object.freeze({retained:Object.freeze(['SOURCE_ADDRESSES','MACHINA_SG_PORT_MAP','FINE_RAIL_GENERATOR','FIXED_WIDTH','RETURN_MAPS','BAND_DISTINCTION','GREEN_FLOOR_RETURN_ROLE']),lost:Object.freeze(['PHYSICAL_MATERIAL','SHARED_CLOCK']),added:Object.freeze(['GREEN_PATINA_VIEW','WHITE_AXIS_VIEW','SCARAB_RAIL_TRACE_VIEW']),unresolved:Object.freeze([])}),
      checks,status:checks.every(check=>check.pass)?'EXACT_VIEW_RETURN':'HOLD',
      newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,publication:false,
      boundary:'X31, X32 and X33 are local working labels for the existing THE MACHINA SG fine-rail ports 41, 42 and 43 under h↦h+990. The +1 is the shared white 1032 fold axis and frame, not a fourth equivalent channel. The lower trace is the ordered SCARAB address rail, not a waveform. rev₄ binds 1033 and 3301 arithmetically but does not identify the value with historical Cikada provenance. Patina-V is the source-bound Green Floor/Return counterview to Copper on the same image carrier. Patina-M names the real metal–environment surface-transition analogy, but remains outside this adapter until substrate, medium, time and reaction are declared; the displayed green floor is therefore not itself a material, aging process or physical surface. No resonance, planetary, physical-channel or mechanism claim is established.'
    });
  }

  function scarabM83Connector(){
    const primeIndex=Array.from({length:83},(_,index)=>index+1).filter(isPrime).length;
    const checks=Object.freeze([
      Object.freeze({id:'m83-prime',label:'83 ist prim',pass:isPrime(83)}),
      Object.freeze({id:'m83-index',label:'83=P₂₃',pass:primeIndex===23}),
      Object.freeze({id:'double-thirteen',label:'26=2×13',pass:26===2*13}),
      Object.freeze({id:'face-thirteen',label:'169=13²',pass:169===13**2}),
      Object.freeze({id:'nexit-cube',label:'26³=17 576',pass:26**3===17576}),
      Object.freeze({id:'face-volume',label:'17 576=104×169',pass:17576===104*169}),
      Object.freeze({id:'reverse-thirteen',label:'rev₂(13)=31',pass:reverseFixedWidth(13,2)===31}),
      Object.freeze({id:'offset-return',label:'231−200=31',pass:31+200===231&&231-200===31})
    ]);
    return Object.freeze({
      schema:'nexah.a0.scarab-m83-symbolic-connector-view/1',
      classification:'SOURCE_BOUND_SYMBOLIC_CONNECTOR_VIEW_ONLY',
      identityReuse:Object.freeze(['ART:A0:MATHEMATICAL_JOINTS','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH']),
      sourceLabel:Object.freeze({address:'M83',name:'SOUTHERN_PINWHEEL',role:'OWNER_SUPPLIED_ASTRONOMICAL_SYMBOL_ADDRESS',catalogueIndex:83,astronomicalMechanism:false}),
      scarabConnector:Object.freeze({workingLabel:'SC',expansions:Object.freeze(['SCARAB_CONNECTOR','SOUTH_CROSS_LENS']),role:'TOP_SYMBOLIC_CONNECTOR',newPort:false}),
      arithmetic:Object.freeze({primeMarker:Object.freeze({value:83,formula:'83=81+2=P_23',primeIndex:23,notP83:true,p83Value:431}),axis:Object.freeze({unit:13,double:26,formula:'26=2×13'}),face:Object.freeze({value:169,formula:'169=13²'}),volume:Object.freeze({value:17576,formula:'26³=17576=104×169',workingLabel:'NEXIT_CUBE_VIEW'})}),
      offsetReturn:Object.freeze({source:13,reversed:31,width:2,displayMarker:'+C',numericOffset:200,lifted:231,return:31,formula:'rev_2(13)=31; 31+200=231; 231-200=31',cBinding:'OWNER_DISPLAY_MARKER_NOT_ROMAN_NUMERAL_OR_GENERAL_OPERATOR'}),
      checks,status:checks.every(check=>check.pass)?'EXACT_SYMBOLIC_VIEW_RETURN':'HOLD',
      newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,publication:false,
      boundary:'M83 remains the owner-supplied Southern Pinwheel catalogue/symbol address. The separate arithmetic note 83=81+2=P23 does not identify M83 with P83, whose value is 431. SC is a Scarab Connector / South-Cross display lens. The 13, 26, 169 and 17576 stages are exact arithmetic display levels, not an astronomical scale law. +C is retained as an owner display marker; only the explicitly declared +200/-200 offset is evaluated. No astronomical mechanism, physical connector, resonance, dimensional law or new Source Graph relation is established.'
    });
  }

  function contract(){
    return Object.freeze({
      schema:'nexah.a0.red-balloon-story/1',version:VERSION,
      classification:'SOURCE_BOUND_MATHFIELD_STORY_LENS',
      identityReuse:Object.freeze(['A0OE:PASCAL_PENTAGON_D5_TEST','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH']),
      scenes:STORIES.length,gates:99,rows:9,columns:11,ringSlots:32,evenSteps:16,oddGaps:16,
      binaryMask:'99 addressable one-bit slots; current fixture sets all slots to 1',
      phaseOverlay:'H_j=exp(i*2pi*(j-1)/99)',ledger:ledger(),inverseImaginary:'i^-1=-i',
      derisScrew:Object.freeze({schema:'nexah.a0.red-balloon-deris-screw-view/1',classification:'SOURCE_BOUND_VIEW_ONLY',workingLabel:'DE(ris) Screw',gates:DE_RIS_GATES.length,defaultAngleDegrees:360}),
      algoStream:Object.freeze({schema:'nexah.a0.red-balloon-algo-stream-grey-space-view/1',classification:'SOURCE_BOUND_VIEW_ONLY',workingLabel:'ALGO STREAM / GREY SPACE',steps:ALGO_STREAM_STEPS.length,placement:'AFTER_DERIS_SCREW_NOT_GATE_7'}),
      algoNlkDock:Object.freeze({schema:'nexah.a0.algo-nlk-return-dock/1',classification:'SOURCE_BOUND_COORDINATED_INTERFACE_PROJECTION_ONLY',placement:'AFTER_ALGO_RETURN_AS_OBSERVATORY_NOT_GATE_7',target:'NLK_L_SHELL',polarMirrorSchema:polarMirrorCrosswalk().schema,bridgeBraneReturnMatrixSchema:bridgeBraneReturnMatrix().schema,whiteLineCikadaFoldSchema:whiteLineCikadaJoint().schema,scarabM83ConnectorSchema:scarabM83Connector().schema}),
      primeMask:Object.freeze({domain:'addresses 1..99',openAddresses:primeMask().holes,opaqueAddresses:primeMask().opaque,displayLanes:Object.freeze({seed:2,sixPlus:11,sixMinus:12})}),
      sourceContext:Object.freeze({record:'SF-NUMBERMAGICK-2025-AUDIT',graph:'G_T_PRIME_TRINITIES_CONNECTORS',vertices:7,edges:9,components:1,cycleRank:3,connector1032:'composite 2^3*3*43; historical connector vertex, not a prime or operator'}),
      newIdentity:false,newRelation:false,newStudy:false,newFinding:false,publication:false,
      holds:Object.freeze(['THOS','NAUTILUS','C5_RING_CAUSALITY','HOFMANN_RIEMANN','CULTURAL_MNEMONICS_AS_EVIDENCE','PRIME_FAMILY_COLOR_IDENTITY','LOTUS_TOPOLOGY','PRIME_PHYSICAL_CUT']),
      boundary:'This is one continuous reader story over finite display contracts. The 99-gate field is not mapped to the 106-vertex SCC-003 quotient. Colour is a phase overlay, not a bit value. Prime addresses select openings in a declared finite display mask; primes do not physically cut material. The 6k±1 display lanes are not the historical red/green/blue Prime Families. Lotus is a view label only. The SP-to-blue curve, ledger pairing and aperture closure are declared view rules, not a physical flow, financial model, theorem or scientific finding.'
    });
  }

  function polar(cx,cy,r,a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)]}
  function phaseColour(theta){return `hsl(${((theta/TAU)*360+360)%360} 82% 59%)`}

  function svgMarkup(sceneIndex,alphaDegrees){
    const scene=STORIES[Math.max(0,Math.min(STORIES.length-1,Number(sceneIndex)||0))];
    const showField=scene.id!=='witness';
    const showPhase=['phase','ring','return','curtain'].includes(scene.id);
    const showRing=['ring','return'].includes(scene.id);
    const showReturn=scene.id==='return';
    const curtain=scene.id==='curtain',mask=primeMask();
    const gates=gateRecords().map(item=>`<circle class="rb-gate${item.index===1?' rb-witness-gate':''}" data-gate="${item.index}" cx="${item.x.toFixed(2)}" cy="${item.y.toFixed(2)}" r="${item.index===1?5.8:4.2}" fill="${showPhase?phaseColour(item.theta):'#f64f68'}" opacity="${curtain?.04:showField?1:.08}"/>`).join('');
    const primeApertures=curtain?gateRecords().filter(item=>isPrime(item.index)).map(item=>{const pulse=(1.7+1.5*(item.phaseRe+1)/2).toFixed(2);return `<g class="rb-prime-aperture" data-prime="${item.index}" transform="translate(${item.x.toFixed(2)} ${item.y.toFixed(2)})"><circle r="${pulse}"/><path d="M-${(Number(pulse)+4).toFixed(2)} 0H${(Number(pulse)+4).toFixed(2)}M0 -${(Number(pulse)+4).toFixed(2)}V${(Number(pulse)+4).toFixed(2)}"/></g>`}).join(''):'';
    const ring=parityRing().map(item=>{const [x,y]=polar(400,300,220,item.angleRadians-Math.PI/2);return `<circle class="rb-ring-slot ${item.parity==='EVEN_STEP'?'is-step':'is-gap'}" data-slot="${item.index}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${item.parity==='EVEN_STEP'?5:3}" opacity="${showRing?1:.07}"/>`}).join('');
    const a=aperture(alphaDegrees),half=a.alphaDegrees*Math.PI/180;
    const [lx,ly]=polar(710,276,72,-Math.PI/2-half),[rx,ry]=polar(710,276,72,-Math.PI/2+half);
    return `<svg viewBox="0 0 900 560" role="img" aria-labelledby="rbStorySvgTitle rbStorySvgDesc">
      <title id="rbStorySvgTitle">The Red Balloon — one witness through a finite field</title>
      <desc id="rbStorySvgDesc">A six-scene mathematical display story: one witness, ninety-nine gates, phase colour, a thirty-two-slot parity ring, ledger balance, trajectory, aperture closure and a twenty-five-opening prime mask.</desc>
      <rect class="rb-stage-bg" x="1" y="1" width="898" height="558" rx="18"/>
      <line class="rb-axis" x1="400" y1="42" x2="400" y2="512"/>
      <line class="rb-horizon" x1="86" y1="438" x2="790" y2="438"/>
      ${ring}${gates}
      <g class="rb-curtain" opacity="${curtain?1:0}"><path d="M244 118Q400 55 556 118L536 340Q400 386 264 340Z"/><g class="rb-lotus"><path d="M400 338Q326 272 400 166Q474 272 400 338Z"/><path d="M400 338Q268 305 286 188Q390 208 400 338Z"/><path d="M400 338Q532 305 514 188Q410 208 400 338Z"/></g>${primeApertures}<text x="400" y="382">PRIME APERTURES 25 · OPAQUE 74</text><text class="rb-lotus-label" x="400" y="404">LOTUS · VIEW ONLY</text></g>
      <circle class="rb-sp" cx="400" cy="438" r="18"/><text class="rb-sp-label" x="400" y="443">SP</text>
      <path class="rb-trajectory" d="M400 438 Q520 402 650 222" opacity="${showReturn?1:.08}"/>
      <circle class="rb-blue" cx="650" cy="222" r="18" opacity="${showReturn?1:.12}"/><text class="rb-blue-label" x="650" y="227" opacity="${showReturn?1:.08}">B</text>
      <g class="rb-aperture" opacity="${showReturn?1:.08}"><line x1="710" y1="276" x2="${lx.toFixed(2)}" y2="${ly.toFixed(2)}"/><line x1="710" y1="276" x2="${rx.toFixed(2)}" y2="${ry.toFixed(2)}"/><line x1="676" y1="276" x2="744" y2="276"/><text x="710" y="320">${a.closed?'T₀':'Tα'} · ${a.alphaDegrees.toFixed(0)}°</text></g>
      <g class="rb-balloon" opacity="${curtain?.22:1}" transform="translate(${scene.id==='witness'?400:showReturn?650:400} ${scene.id==='witness'?386:showReturn?176:92})"><path d="M0 22C-22 4-20-30 0-38C20-30 22 4 0 22Z"/><path d="M0 22l-5 7h10z"/><line x1="0" y1="29" x2="0" y2="58"/></g>
      <text class="rb-counter" x="34" y="44">${scene.number} / 06 · ${scene.title.toUpperCase()}</text>
      <text class="rb-ledger" x="34" y="520" opacity="${showReturn?1:.08}">ASSETS 50 = LIABILITIES 49 + WITNESS 1</text>
      <text class="rb-orientation" x="650" y="264" opacity="${showReturn?1:.08}">i ↺ · −i ↻</text>
    </svg>`;
  }

  function derisSvgMarkup(angleDegrees=360,mode='SCREW'){
    const state=derisScrew(angleDegrees),m=['ANATOMY','SCREW','RETURN'].includes(mode)?mode:'SCREW';
    const a=(state.plugAddressDegrees-90)*Math.PI/180;
    const px=450+190*Math.cos(a),py=282+118*Math.sin(a);
    const threadOpacity=m==='ANATOMY'?0.2:1,returnOpacity=m==='RETURN'?1:0.34;
    const fingers=side=>Array.from({length:5},(_,index)=>{const x=side==='left'?132-index*8:768+index*8;return `<line x1="${side==='left'?174:726}" y1="326" x2="${x}" y2="${342+index*5}"/>`}).join('');
    return `<svg viewBox="0 0 900 620" role="img" aria-labelledby="derisSvgTitle derisSvgDesc">
      <title id="derisSvgTitle">DE(ris) Screw — Red Balloon body and orientation grammar</title>
      <desc id="derisSvgDesc">Null oval with U and two legs, coccyx to navel level, shoulder T and arc, front and back X, horizontal phi Euler thread, pi splitter rings, degree plug and nose to chin direction.</desc>
      <defs><marker id="derisArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z"/></marker></defs>
      <rect class="deris-bg" x="1" y="1" width="898" height="618" rx="22"/>
      <g class="deris-arc" opacity="${returnOpacity}"><path d="M165 222Q450 48 735 222"/><path d="M182 230Q450 82 718 230"/><text x="450" y="75">GROSSER ARC · RETURN</text></g>
      <g class="deris-splitters" opacity="${threadOpacity}"><ellipse cx="450" cy="122" rx="42" ry="20"/><ellipse cx="450" cy="122" rx="78" ry="38"/><ellipse cx="450" cy="122" rx="118" ry="56"/><circle cx="450" cy="122" r="4"/><text x="450" y="128">π</text></g>
      <g class="deris-body">
        <line class="deris-axis" x1="450" y1="172" x2="450" y2="488"/>
        <line class="deris-t" x1="250" y1="214" x2="650" y2="214"/><line class="deris-t" x1="450" y1="176" x2="450" y2="246"/>
        <path class="deris-limb" d="M250 214L184 286L204 350L172 402"/><path class="deris-limb" d="M650 214L716 286L696 350L728 402"/>
        <polygon class="deris-wrist" points="166,390 183,380 198,394 189,413 169,411"/><polygon class="deris-wrist" points="734,390 717,380 702,394 711,413 731,411"/>
        <g class="deris-fingers">${fingers('left')}${fingers('right')}</g>
        <path class="deris-front-x" d="M330 245L570 388M570 245L330 388"/><path class="deris-back-x" d="M350 252L550 380M550 252L350 380"/>
        <circle class="deris-navel" cx="450" cy="332" r="14"/><line class="deris-level" x1="382" y1="332" x2="518" y2="332"/><circle class="deris-bubble" cx="450" cy="332" r="6"/>
        <circle class="deris-coccyx" cx="450" cy="456" r="9"/>
        <ellipse class="deris-null" cx="450" cy="478" rx="124" ry="54"/><path class="deris-u" d="M376 452V485Q376 532 450 532Q524 532 524 485V452"/>
        <path class="deris-leg" d="M405 516L350 570"/><path class="deris-leg" d="M495 516L550 570"/>
        <circle class="deris-joint" cx="350" cy="570" r="8"/><circle class="deris-joint" cx="550" cy="570" r="8"/>
        <text class="deris-label" x="450" y="355">NABEL · LEVEL</text><text class="deris-label" x="450" y="447">COCCYX</text>
        <text class="deris-label" x="318" y="600">i · LEG</text><text class="deris-label" x="582" y="600">−i · LEG</text>
      </g>
      <g class="deris-direction"><path d="M450 160L466 180L450 174L434 180Z"/><line x1="450" y1="176" x2="450" y2="204" marker-end="url(#derisArrow)"/><text x="484" y="181">NASE → KINN · DIRECTION</text></g>
      <g class="deris-thread" opacity="${threadOpacity}"><path d="M120 282C200 214 270 350 350 282S500 214 580 282S730 350 810 282"/><path d="M120 300C200 368 270 232 350 300S500 368 580 300S730 232 810 300"/><ellipse cx="450" cy="282" rx="190" ry="118"/><text x="450" y="410">φ · eᶦᵗ · HORIZONTAL THREAD</text></g>
      <g class="deris-plug" transform="translate(${px.toFixed(2)} ${py.toFixed(2)})"><circle r="17"/><circle r="7"/><path d="M0 -28V-16M0 16V28M-28 0H-16M16 0H28"/><text x="0" y="48">${state.plugAddressDegrees.toFixed(0)}°</text></g>
      <text class="deris-mode" x="34" y="42">${m} · TURN ${state.turns} · ${state.orientation.side}</text>
      <text class="deris-boundary-copy" x="866" y="594">VIEW GRAMMAR · NO PHYSICAL SCREW</text>
    </svg>`;
  }

  function derisShellMarkup(){
    const gateMarkup=DE_RIS_GATES.map(gate=>`<article data-deris-gate="${gate.id}"><small>${gate.number}</small><b>${gate.title}</b><span>${gate.copy}</span><em>PASS</em></article>`).join('');
    return `<section class="deris-workbench" id="redBalloonDerisScrew" aria-labelledby="derisHeading"><header><div><div class="rb-kicker">Red Balloon · existing skeleton · six controlled gates</div><h4 id="derisHeading">DE(ris) Screw.</h4></div><p>Das vorhandene Red-Balloon-Skelett wird als Körper-, Gewinde- und Return-Grammatik lesbar. <code>φ</code>, Euler-Phase und <code>π</code> bilden das horizontale Gewinde; <code>°</code> adressiert einen Plug. Der Arbeitsname erzeugt keine neue Identität.</p></header><div class="deris-layout"><figure class="deris-stage"><div id="derisScrewSvg">${derisSvgMarkup(360,'SCREW')}</div></figure><aside class="deris-console"><nav class="deris-modes" aria-label="DE(ris) Screw Ansichten"><button type="button" data-deris-mode="ANATOMY" aria-pressed="false">Anatomy</button><button type="button" data-deris-mode="SCREW" aria-pressed="true">Screw</button><button type="button" data-deris-mode="RETURN" aria-pressed="false">Return</button></nav><label for="derisAngle"><span>Degree plug / two turns</span><output id="derisAngleOut">360° · PLUG 0°</output></label><input id="derisAngle" type="range" min="0" max="720" step="15" value="360"><div class="deris-actions"><button type="button" id="derisPlay">Play screw</button><button type="button" id="derisReturn">Set 360° return</button></div><div class="deris-receipt" id="derisReceipt" data-status="pass"><b>6/6 PASS</b><span>THREAD φ · eᶦᵗ · π</span><span>PLUG 0° · FRONT_X</span><span>LEGS DISTINCT · LEVEL FIXED</span><span>RETURN ADDRESS PASS</span><span>HISTORY RESET NO · TURN 1</span></div></aside></div><div class="deris-gates">${gateMarkup}</div><p class="rb-story-boundary"><strong>Boundary:</strong> Diese Linse annotiert eine bereits vorhandene Red-Balloon-View. <code>DE(ris) Screw</code> bleibt Owner-Arbeitsvokabular; η≈0.429, Spektralbänder und Root7 sind getrennte Vergleichslinsen. Kein physisches Gewinde, keine neue mathematische Relation, kein Finding und kein Geschichtsreset.</p></section>`;
  }

  function algoStreamSvgMarkup(stepIndex=0){
    const state=algoStream(stepIndex),active=state.index,on=step=>active>=step?1:.13;
    return `<svg viewBox="0 0 900 560" role="img" aria-labelledby="algoStreamSvgTitle algoStreamSvgDesc">
      <title id="algoStreamSvgTitle">ALGO Stream through the Grey Space</title>
      <desc id="algoStreamSvgDesc">Two distinct wrist routes form a display X, pass through a bounded Grey Space, expose F1 F2 and F3 as purple co-seams, cross a Pink Strip and return by a separate trace.</desc>
      <defs><marker id="algoArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker><linearGradient id="algoGrey" x1="0" x2="1"><stop offset="0" stop-color="#6e7881" stop-opacity=".08"/><stop offset=".5" stop-color="#aeb6bc" stop-opacity=".34"/><stop offset="1" stop-color="#6e7881" stop-opacity=".08"/></linearGradient></defs>
      <rect class="algo-bg" x="1" y="1" width="898" height="558" rx="22"/>
      <g class="algo-hands" opacity="${on(0)}"><path d="M90 286L148 286L174 310L148 334H90Z"/><path d="M810 286H752L726 310L752 334H810Z"/><circle cx="174" cy="310" r="13"/><circle cx="726" cy="310" r="13"/><text x="86" y="370">LEFT HAND · WRIST</text><text x="814" y="370" text-anchor="end">RIGHT HAND · WRIST</text></g>
      <g class="algo-x-route" opacity="${on(1)}"><path d="M174 310L690 126" marker-end="url(#algoArrow)"/><path d="M726 310L210 126" marker-end="url(#algoArrow)"/><circle cx="450" cy="212" r="10"/><text x="450" y="188">X-ROUTE · DISPLAY CROSSING</text></g>
      <g class="algo-grey" opacity="${on(2)}"><rect x="354" y="72" width="192" height="382" rx="90"/><path d="M374 96V430M526 96V430"/><text x="450" y="108">Å · I | GREY SPACE | O</text><text x="450" y="438">MASK · SWITCH · UNRESOLVED</text></g>
      <g class="algo-seams" opacity="${on(3)}"><path d="M405 135C372 210 390 300 420 390"/><path d="M450 125V404"/><path d="M495 135C528 210 510 300 480 390"/><circle cx="405" cy="135" r="7"/><circle cx="450" cy="125" r="7"/><circle cx="495" cy="135" r="7"/><text x="390" y="120">F1</text><text x="450" y="110">F2</text><text x="510" y="120">F3</text><text x="450" y="286">ALGO_PURPLE_CO_SEAM</text></g>
      <g class="algo-strip" opacity="${on(4)}"><path d="M594 92L566 430"/><path d="M612 92L584 430"/><text x="632" y="238">PINK STRIP</text><text x="632" y="258">CUT / HANDOFF</text></g>
      <g class="algo-return" opacity="${on(5)}"><path d="M584 430C538 520 272 520 174 340" marker-end="url(#algoArrow)"/><text x="444" y="510">PINK STRIP · RETURN TRACE</text></g>
      <text class="algo-phase" x="34" y="42">${state.step.number} / 06 · ${state.step.title.toUpperCase()}</text>
      <text class="algo-boundary-copy" x="866" y="538">CROSSWALK · NOT IDENTITY</text>
    </svg>`;
  }

  function algoStreamShellMarkup(){
    const buttons=ALGO_STREAM_STEPS.map((step,index)=>`<button type="button" data-algo-step="${index}" aria-pressed="${index===0?'true':'false'}"><small>${step.number}</small><span>${step.title}</span></button>`).join('');
    return `<section class="algo-stream-workbench" id="redBalloonAlgoStream" aria-labelledby="algoStreamHeading"><header><div><div class="rb-kicker">Mathfield · separate lens after the six DE(ris) gates</div><h4 id="algoStreamHeading">ALGO Stream / Grey Space.</h4></div><p>Die vorhandenen Rollen werden als Crosswalk gemeinsam lesbar: Hände senden die X-Route aus, <code>GREY SPACE</code> hält den Vergleich offen, <code>F1/F2/F3</code> bleiben ALGO-Purple-Co-Seams, und der Pink Strip trägt die getrennte Return Trace.</p></header><div class="algo-stream-layout"><figure class="algo-stream-stage"><div id="algoStreamSvg">${algoStreamSvgMarkup(0)}</div></figure><aside class="algo-stream-console"><nav class="algo-step-nav" aria-label="ALGO Stream Schritte">${buttons}</nav><div class="algo-stream-reading"><small id="algoStreamCounter">01 / 06</small><h5 id="algoStreamTitle">Hands / wrists</h5><p id="algoStreamCopy">${ALGO_STREAM_STEPS[0].copy}</p></div><div class="algo-stream-actions"><button type="button" id="algoStreamPrev">← zurück</button><button type="button" id="algoStreamNext">weiter →</button></div><div class="algo-stream-receipt" id="algoStreamReceipt" data-status="pass"><b>6 ROLES · SOURCE-BOUND</b><span>HANDS DISTINCT</span><span>X-ROUTE · DISPLAY ONLY</span><span>GREY SPACE · OPEN</span><span>F1/F2/F3 · UNCHANGED</span><span>RETURN · NO RESET</span></div></aside></div><p class="rb-story-boundary"><strong>Boundary:</strong> Diese Linse ist ein dokumentierter Crosswalk zwischen zwei vorhandenen Ansichten. <code>GREY SPACE</code> bleibt Vergleichsraum/Maskenrolle; <code>ALGO_PURPLE_CO_SEAM</code> bleibt die Rolle von F1/F2/F3. Das Hand-X ist eine Displayroute. Keine Identitätsverschmelzung, kein materielles Band, keine physische Strömung, kein neues Finding und kein Gate 7.</p></section>`;
  }

  function algoNlkDockShellMarkup(){
    const dock=algoNlkReturnDock(5);
    const checks=dock.checks.map(check=>`<span data-nlk-check="${check.id}" data-status="${check.pass?'pass':'hold'}">${check.label}</span>`).join('');
    return `<section class="algo-nlk-dock" id="algoNlkReturnDock" aria-labelledby="algoNlkDockHeading"><header><div><div class="rb-kicker">Existing identity · finite observatory · typed Return</div><h4 id="algoNlkDockHeading">ALGO → NLK Return Dock.</h4></div><p>NLK liest das vorhandene ALGO-Receipt als endliche Beobachtungsprojektion. Es hält Frame, Cut, drei getrennte Seam-Witnesses und Return-State zusammen, ohne selbst Gate 7 zu werden.</p></header><div class="algo-nlk-flow"><article class="algo-nlk-node source"><small>SOURCE</small><b>ALGO STREAM</b><span>HANDS · X · GREY · F1/F2/F3 · PINK</span></article><div class="algo-nlk-transfer"><i></i><strong id="algoNlkTransferState">RETURN RECEIPT</strong><small>typed handoff · no source write</small></div><article class="algo-nlk-node target"><small>OBSERVATORY</small><b>NLK / L-SHELL</b><span>FRAME · CUT · SEAM WITNESSES · RETURN</span></article></div><div class="algo-nlk-grid"><article><small>Selected node</small><b>X_ROUTE_DISPLAY_CROSSING</b></article><article><small>Frame / perspective</small><b>GREY_SPACE_COMPARISON_FRAME</b></article><article><small>Cut</small><b>PINK_STRIP_CUT_HANDOFF_VIEW</b></article><article><small>Phase</small><b>UNBOUND · NO SHARED CLOCK</b></article></div>${polarMirrorShellMarkup()}<div class="algo-nlk-actions"><button type="button" id="algoNlkTakeReceipt">ALGO Return übernehmen</button><a href="A0_NLK_LSHELL_DEVELOPMENT_PROBE.html#mainStageShell">NLK Main Stage öffnen ↗</a><a href="#experiments">EXP10/11/20 Quellen ↗</a></div><div class="algo-nlk-receipt" id="algoNlkReceipt" data-status="exact"><b id="algoNlkStatus">EXACT RETURN</b>${checks}</div><p class="rb-story-boundary"><strong>Boundary:</strong> Wiederverwendung von <code>NLK_L_SHELL</code> und <code>ART:A0:MATHEMATICAL_JOINTS</code>. Polar Cylinder, Mirror Distance, Bridges, Sphären und Branes bleiben getrennte View-Rollen. <code>X/O</code> der historischen EXP11-Quelle ist nicht <code>X/0</code>; der Rohstring <code>œøō+rö</code> wird nicht decodiert. Gemeinsamer Carrier: nein. Gemeinsamer Clock: nein. Physische Brane: nein. Neue ID 0 · Graphrelation 0 · Study 0 · Finding 0.</p></section>`;
  }

  function polarMirrorShellMarkup(){
    return `<section class="polar-mirror-crosswalk" aria-labelledby="polarMirrorHeading"><header><div><small>EXP20-B/C · EXP10 · EXP11 · SOURCE-BOUND CROSSWALK</small><h5 id="polarMirrorHeading">Polar Cylinder / Mirror Distance / Brane Views.</h5></div><code>RAW · œøō+rö</code></header><div class="polar-mirror-layout"><figure><svg viewBox="0 0 720 400" role="img" aria-labelledby="polarMirrorSvgTitle polarMirrorSvgDesc"><title id="polarMirrorSvgTitle">Polar mirror and brane display crosswalk</title><desc id="polarMirrorSvgDesc">A blue outer view shell and grey inner comparison shell surround a polar cylinder. Declared bridge candidates cross layered display membranes between a distinct X node and zero aperture.</desc><defs><radialGradient id="pmBlue"><stop stop-color="#42c8e5" stop-opacity=".22"/><stop offset="1" stop-color="#42c8e5" stop-opacity=".03"/></radialGradient><radialGradient id="pmGrey"><stop stop-color="#d4d9dc" stop-opacity=".28"/><stop offset="1" stop-color="#8b969d" stop-opacity=".04"/></radialGradient><marker id="pmArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><ellipse class="pm-sphere blue" cx="360" cy="200" rx="286" ry="164"/><ellipse class="pm-sphere grey" cx="360" cy="200" rx="218" ry="126"/><g class="pm-cylinder"><ellipse cx="360" cy="87" rx="92" ry="27"/><path d="M268 87V310M452 87V310"/><ellipse cx="360" cy="310" rx="92" ry="27"/></g><path class="pm-mirror" d="M360 42V354"/><g class="pm-branes"><path d="M128 146Q360 110 592 146"/><path d="M112 200Q360 165 608 200"/><path d="M128 254Q360 218 592 254"/></g><g class="pm-bridges"><path d="M154 200C230 86 490 86 566 200"/><path d="M154 200C230 314 490 314 566 200"/></g><path class="pm-transition" d="M176 200H544" marker-end="url(#pmArrow)"/><circle class="pm-node" cx="154" cy="200" r="24"/><text class="pm-node-label" x="154" y="207">X</text><circle class="pm-zero" cx="566" cy="200" r="24"/><text class="pm-node-label" x="566" y="207">0</text><text class="pm-label" x="360" y="66">POLAR CYLINDER</text><text class="pm-label" x="360" y="382">MIRROR DISTANCE · BASIS-DEPENDENT</text><text class="pm-label side" x="92" y="126">BLUE VIEW</text><text class="pm-label side" x="628" y="126">GREY VIEW</text></svg></figure><div class="polar-mirror-ledger"><article><small>SPHERES</small><b>BLUE OUTER / GREY INNER</b><span>zwei View-Shells · kein gemeinsamer Körper</span></article><article><small>BRIDGES</small><b>RELATION CANDIDATES</b><span>erst mit deklarierter Map belastbar</span></article><article><small>BRANES</small><b>DISPLAY MEMBRANES</b><span>Schicht-/Schnittansichten · keine physische Brane</span></article><article><small>TRANSITION</small><b>X/0 OWNER VIEW</b><span>getrennt von EXP11 X/O · 0 ≠ O</span></article></div></div></section>`;
  }

  function bridgeBraneReturnMatrixMarkup(){
    const matrix=bridgeBraneReturnMatrix();
    const rows=matrix.rows.map(row=>`<tr data-matrix-row="${row.id}"><th scope="row">${row.id.toUpperCase()}</th><td>${row.source}</td><td>${row.view}</td><td>${row.cut}</td><td>${row.bridge}</td><td>${row.residual}</td><td><b data-return-status="${row.return.split(' · ')[0].toLowerCase()}">${row.return}</b></td></tr>`).join('');
    return `<header><div><small>TYPED JOINT CONTRACT · FIVE SOURCE-DISTINCT ROWS</small><h5>Bridge–Brane–Return Matrix.</h5></div><code>SOURCE → VIEW → CUT → BRIDGE → Δ → RETURN</code></header><div class="bridge-return-scroll"><table><thead><tr><th>Lane</th><th>Source address</th><th>View</th><th>Cut / mask</th><th>Bridge</th><th>Residual</th><th>Return</th></tr></thead><tbody>${rows}</tbody></table></div><p><strong>Claim ceiling:</strong> ${matrix.claimCeiling}</p>`;
  }

  function whiteLineCikadaSvgMarkup(activeLane='x32'){
    const joint=whiteLineCikadaJoint(activeLane),active=joint.selected.id;
    const laneOpacity=id=>id===active?1:.22;
    return `<svg viewBox="0 0 900 520" role="img" aria-labelledby="whiteLineSvgTitle whiteLineSvgDesc">
      <title id="whiteLineSvgTitle">White-line Cikada fold joint</title>
      <desc id="whiteLineSvgDesc">Three THE MACHINA SG fine-rail ports 41, 42 and 43 translate by plus 990 to three distinct film-cartridge bands at 1031, 1032 and 1033 around a shared white fold axis. Fixed-width decimal reversal joins 1033 and 3301 arithmetically.</desc>
      <defs><linearGradient id="patinaFloor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#153d35"/><stop offset=".55" stop-color="#2d725e"/><stop offset="1" stop-color="#0b241f"/></linearGradient><marker id="foldArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>
      <rect class="white-line-bg" x="1" y="1" width="898" height="518" rx="20"/>
      <path class="patina-floor" d="M82 407L260 244H664L830 407L690 486H212Z"/>
      <g class="patina-grid"><path d="M212 486L450 244L690 486M312 486L500 244M588 486L400 244M134 407H782M178 367H741M220 328H700M260 286H660"/></g>
      <path class="cikada-trace" d="M94 383C140 325 180 439 226 383S312 327 358 383S444 439 490 383S576 327 622 383S708 439 754 383S815 343 850 383"/>
      <g class="film-lane lane-x31" opacity="${laneOpacity('x31')}"><path d="M130 170C252 118 340 142 450 255"/><circle cx="130" cy="170" r="31"/><text x="130" y="176">X31</text><text class="lane-address" x="192" y="128">F1 · 1031</text></g>
      <g class="film-lane lane-x32" opacity="${laneOpacity('x32')}"><path d="M125 255H775"/><circle cx="450" cy="255" r="31"/><text x="450" y="261">X32</text><text class="lane-address" x="468" y="223">F2 · 1032 · FIXED</text></g>
      <g class="film-lane lane-x33" opacity="${laneOpacity('x33')}"><path d="M450 255C560 142 648 118 770 170"/><circle cx="770" cy="170" r="31"/><text x="770" y="176">X33</text><text class="lane-address" x="610" y="128">F3 · 1033 ⇄ 3301</text></g>
      <path class="white-fold-axis" d="M450 54V455" marker-end="url(#foldArrow)"/><path class="white-fold-rip" d="M450 72L438 103L461 132L441 164L458 195L450 226"/>
      <text class="fold-axis-label" x="468" y="78">+1 · WHITE FOLD AXIS</text><text class="fold-axis-formula" x="450" y="503">1031 + 1033 = 2064 = 2×1032 · rev₄(1033)=3301</text>
      <text class="patina-label" x="74" y="452">GREEN FLOOR / RETURN · PATINA VIEW</text><text class="cikada-label" x="596" y="365">SG RAIL TRACE · 41–42–43 + 990</text>
    </svg>`;
  }

  function whiteLineCikadaJointMarkup(){
    const joint=whiteLineCikadaJoint();
    const connector=scarabM83Connector();
    const buttons=joint.lanes.map(lane=>`<button type="button" data-fold-lane="${lane.id}" aria-pressed="${lane.id==='x32'}">${lane.workingLabel}</button>`).join('');
    const checks=joint.checks.map(check=>`<span data-fold-check="${check.id}" data-status="${check.pass?'pass':'hold'}">${check.label}</span>`).join('');
    const connectorChecks=connector.checks.map(check=>`<span data-scarab-m83-check="${check.id}" data-status="${check.pass?'pass':'hold'}">${check.label}</span>`).join('');
    return `<header><div><small>3 BANDS + 1 SHARED FRAME · THE MACHINA SG FINE RAIL</small><h5>White-Line Fold / SCARAB–Cikada Patina Joint.</h5></div><code>41–42–43 + 990 → 1031–1032–1033 ⇄ 3301</code></header><div class="white-line-layout"><figure><div id="whiteLineCikadaSvg">${whiteLineCikadaSvgMarkup()}</div></figure><aside><nav aria-label="Kartusche wählen">${buttons}</nav><div class="white-line-reading"><small id="whiteLineLaneBand">F2 · SHARED FRAME</small><b id="whiteLineLaneTitle">X32 · 1032</b><span id="whiteLineLaneRole">WHITE_LINE_AXIS_CARTRIDGE</span></div><div class="white-line-ilau"><article><small>I · retained</small><b>Machina ports · returns · Green Floor role</b></article><article><small>L · lost</small><b>physical material · shared clock</b></article><article><small>A · added</small><b>patina · white axis · rail trace view</b></article><article><small>U · unresolved</small><b>none in this bounded adapter</b></article></div></aside></div><section class="scarab-m83-connector" id="scarabM83Connector" aria-labelledby="scarabM83ConnectorHeading"><header><div><small>M83 · SOUTHERN PINWHEEL · SYMBOL ADDRESS</small><h6 id="scarabM83ConnectorHeading">SC · Scarab Connector / South-Cross lens.</h6></div><code>13 → 26 → 169 → 26³</code></header><div class="scarab-m83-flow"><article class="m83-source"><small>TOP CONNECTOR</small><b>M83 · SC</b><span>83 = 81+2 = P₂₃ · M83 ≠ P₈₃</span></article><i aria-hidden="true"></i><article><small>DOUBLE AXIS</small><b>26 = 2×13</b><span>gekoppelter Doppelpol</span></article><i aria-hidden="true"></i><article><small>GATE FACE</small><b>169 = 13²</b><span>quadratische Flächenstufe</span></article><i aria-hidden="true"></i><article class="nexit-cube"><small>NEXIT VIEW</small><b>26³ = 17 576</b><span>17 576 = 104×169</span></article></div><div class="scarab-offset-return"><span>rev₂(13)=31</span><strong>31 + 200 = 231</strong><span>231 − 200 = 31 · RETURN</span><em>+C = Owner-Displayzeichen; nur ±200 ist hier numerisch deklariert.</em></div><div class="scarab-m83-receipt"><b>${connector.status}</b>${connectorChecks}</div><p><strong>Boundary:</strong> ${connector.boundary}</p></section><div class="white-line-receipt" data-status="exact"><b id="whiteLineStatus">EXACT VIEW RETURN</b>${checks}</div><p><strong>Source return:</strong> <a href="A0_MACHINA_COCKPIT.html#threeVortexSwitchyard">THE MACHINA · SCARAB-Zentrale / SG Fine Rail</a> · <a href="results/a0-scarab-pillar-projection-engineering-2026-10-23.json">1033 ⇄ 3301 decimal-return receipt</a> · <a href="assets/a0-field-notes/index.html#visual-atlas">Field Notes · Copper / Green Patina carrier</a> · <a href="A0_SCC_003_PASCAL_PENTAGON_PAPER.html#four-plate-reversal-lens">Four-Plate · Green Floor / Return</a><br><strong>Boundary:</strong> ${joint.boundary}</p>`;
  }

  function shellMarkup(){return `<header><div><div class="rb-kicker">The Red Balloon · one story · six controlled scenes</div><h4 id="redBalloonStoryHeading">One witness through a finite field.</h4></div><p>Ein gesetzter Witness tritt am SP-Pivot ein, durchläuft 99 adressierte Gates, erhält eine getrennte Phasenfarbe, passiert den 16+16-Paritätsring, schließt die Apertur und erscheint hinter einer deklarierten Primmaske. SCC‑003/Q106, das 99-Gate-Feld und die Displaymetaphern werden nicht gleichgesetzt.</p></header><div class="rb-story-layout"><figure class="rb-story-stage"><div id="redBalloonStorySvg"></div></figure><aside class="rb-story-console"><nav class="rb-scene-nav" aria-label="Red Balloon Szenen"><button type="button" data-rb-scene aria-pressed="true">01</button><button type="button" data-rb-scene aria-pressed="false">02</button><button type="button" data-rb-scene aria-pressed="false">03</button><button type="button" data-rb-scene aria-pressed="false">04</button><button type="button" data-rb-scene aria-pressed="false">05</button><button type="button" data-rb-scene aria-pressed="false">06</button></nav><div class="rb-story-reading"><small id="redBalloonStoryCounter">01 / 06</small><h5 id="redBalloonStoryTitle">One witness</h5><p id="redBalloonStoryCopy">Der Red Balloon beginnt als ein gesetztes Bit am SP-Pivot.</p><code id="redBalloonStoryFormula">b*=1 · SP=(0,0)</code></div><div class="rb-step-controls"><button type="button" id="redBalloonPrev">← zurück</button><button type="button" id="redBalloonNext">weiter →</button></div><div class="rb-aperture-control"><label for="redBalloonAlpha"><span>Alpha aperture</span><output id="redBalloonAlphaOut">Tα · 30°</output></label><input id="redBalloonAlpha" type="range" min="0" max="30" step="1" value="30"></div></aside></div><div class="rb-story-ledger"><div><b>99 = 9×11</b><span>adressierte Gates</span></div><div><b>32 = 16+16</b><span>Schritte und Lücken</span></div><div><b>Hj=eᶦθʲ</b><span>Farbe ≠ Bit</span></div><div><b>50=49+1</b><span>Aktiva = Passiva + Rest</span></div><div><b>i⁻¹=−i</b><span>Gegenorientierung</span></div><div><b>25 | 74</b><span>Primöffnungen | Vorhang</span></div></div><p class="rb-story-boundary"><strong>Grenze:</strong> Die Sequenz ist eine endliche, prüfbare Reader-Linse. Es gibt keine definierte Abbildung <code>Q106→G99</code>. Primzahlen wählen nur Öffnungen einer deklarierten Maske; sie schneiden kein Material. Die 6k±1-Lanes sind nicht die historischen rot/grün/blauen Prime Families, und Lotus ist nur eine Ansicht. Bahn, Ledger und Apertur sind Displayregeln, kein physikalischer Flow, Finanzmodell, Theorem oder Finding. THOS und Nautilus bleiben HOLD.</p>${derisShellMarkup()}${algoStreamShellMarkup()}${algoNlkDockShellMarkup()}`}

  function mount(doc){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    let host=doc.getElementById('redBalloonStory');
    if(!host){
      const parent=doc.getElementById('red-balloon-mathfield-intake');if(!parent)return null;
      host=doc.createElement('section');host.id='redBalloonStory';host.className='red-balloon-story';host.setAttribute('aria-labelledby','redBalloonStoryHeading');host.dataset.scene='witness';host.innerHTML=shellMarkup();
      const proof=parent.querySelector('.proof-grid');parent.insertBefore(host,proof||null);
    }
    const polarCrosswalk=host.querySelector('.polar-mirror-crosswalk');
    if(polarCrosswalk&&!doc.getElementById('bridgeBraneReturnMatrix')){
      const matrixSection=doc.createElement('section');matrixSection.id='bridgeBraneReturnMatrix';matrixSection.className='bridge-brane-return-matrix';matrixSection.setAttribute('aria-label','Bridge Brane Return Matrix');matrixSection.innerHTML=bridgeBraneReturnMatrixMarkup();
      polarCrosswalk.parentNode.insertBefore(matrixSection,polarCrosswalk.nextSibling);
    }
    const matrixSection=doc.getElementById('bridgeBraneReturnMatrix');
    if(matrixSection&&!doc.getElementById('whiteLineCikadaJoint')){
      const foldSection=doc.createElement('section');foldSection.id='whiteLineCikadaJoint';foldSection.className='white-line-cikada-joint';foldSection.setAttribute('aria-label','White Line Cikada Fold Joint');foldSection.innerHTML=whiteLineCikadaJointMarkup();
      matrixSection.parentNode.insertBefore(foldSection,matrixSection.nextSibling);
    }
    const svg=doc.getElementById('redBalloonStorySvg'),title=doc.getElementById('redBalloonStoryTitle'),copy=doc.getElementById('redBalloonStoryCopy'),formula=doc.getElementById('redBalloonStoryFormula'),counter=doc.getElementById('redBalloonStoryCounter'),alpha=doc.getElementById('redBalloonAlpha'),alphaOut=doc.getElementById('redBalloonAlphaOut');
    let index=doc.defaultView&&doc.defaultView.location&&doc.defaultView.location.hash==='#red-balloon-prime-curtain'?5:0;
    const render=()=>{const scene=STORIES[index],a=aperture(alpha?alpha.value:30);if(svg)svg.innerHTML=svgMarkup(index,a.alphaDegrees);if(title)title.textContent=scene.title;if(copy)copy.textContent=scene.copy;if(formula)formula.textContent=scene.formula;if(counter)counter.textContent=`${scene.number} / 06`;if(alphaOut)alphaOut.textContent=a.closed?'T₀ · CLOSED':`Tα · ${a.alphaDegrees.toFixed(0)}°`;host.dataset.scene=scene.id;host.dataset.aperture=a.state;host.querySelectorAll('[data-rb-scene]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));return Object.freeze({scene,a})};
    host.querySelectorAll('[data-rb-scene]').forEach((button,i)=>button.addEventListener('click',()=>{index=i;render()}));
    const prev=doc.getElementById('redBalloonPrev'),next=doc.getElementById('redBalloonNext');
    if(prev)prev.addEventListener('click',()=>{index=(index+STORIES.length-1)%STORIES.length;render()});
    if(next)next.addEventListener('click',()=>{index=(index+1)%STORIES.length;render()});
    if(alpha)alpha.addEventListener('input',render);
    const derisSvg=doc.getElementById('derisScrewSvg'),derisAngle=doc.getElementById('derisAngle'),derisAngleOut=doc.getElementById('derisAngleOut'),derisReceipt=doc.getElementById('derisReceipt'),derisPlay=doc.getElementById('derisPlay'),derisReturn=doc.getElementById('derisReturn');
    let derisMode='SCREW',derisTimer=0;
    const renderDeris=()=>{
      const state=derisScrew(derisAngle?derisAngle.value:360);
      if(derisSvg)derisSvg.innerHTML=derisSvgMarkup(state.angleDegrees,derisMode);
      if(derisAngleOut)derisAngleOut.textContent=`${state.angleDegrees.toFixed(0)}° · PLUG ${state.plugAddressDegrees.toFixed(0)}°`;
      host.querySelectorAll('[data-deris-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.derisMode===derisMode)));
      state.tests.forEach(test=>{const item=host.querySelector(`[data-deris-gate="${test.id}"]`);if(!item)return;item.dataset.status=test.status.toLowerCase();const status=item.querySelector('em');if(status)status.textContent=test.status});
      if(derisReceipt){const passed=state.tests.filter(test=>test.pass).length;derisReceipt.dataset.status=state.allPass?'pass':'hold';derisReceipt.innerHTML=`<b>${passed}/6 ${state.allPass?'PASS':'PASS · CLOSURE HOLD'}</b><span>THREAD φ · eᶦᵗ · π</span><span>PLUG ${state.plugAddressDegrees.toFixed(0)}° · ${state.orientation.side}</span><span>LEGS DISTINCT · LEVEL FIXED</span><span>RETURN ADDRESS ${state.closure.addressReturn?'PASS':'HOLD'}</span><span>HISTORY RESET NO · TURN ${state.turns}</span>`}
      return state;
    };
    host.querySelectorAll('[data-deris-mode]').forEach(button=>button.addEventListener('click',()=>{derisMode=button.dataset.derisMode;renderDeris()}));
    if(derisAngle)derisAngle.addEventListener('input',renderDeris);
    if(derisReturn)derisReturn.addEventListener('click',()=>{if(derisAngle)derisAngle.value='360';derisMode='RETURN';renderDeris()});
    if(derisPlay)derisPlay.addEventListener('click',()=>{const win=doc.defaultView;if(!win)return;if(derisTimer){win.clearInterval(derisTimer);derisTimer=0;derisPlay.textContent='Play screw';return}derisPlay.textContent='Pause screw';derisTimer=win.setInterval(()=>{if(!derisAngle)return;let next=Number(derisAngle.value)+15;if(next>720)next=0;derisAngle.value=String(next);renderDeris()},90)});
    const algoSvg=doc.getElementById('algoStreamSvg'),algoCounter=doc.getElementById('algoStreamCounter'),algoTitle=doc.getElementById('algoStreamTitle'),algoCopy=doc.getElementById('algoStreamCopy');
    const activeHash=doc.defaultView&&doc.defaultView.location?doc.defaultView.location.hash:'';
    let algoIndex=activeHash==='#algoNlkReturnDock'?ALGO_STREAM_STEPS.length-1:activeHash==='#red-balloon-algo-stream'?2:0;
    const nlkReceipt=doc.getElementById('algoNlkReceipt'),nlkStatus=doc.getElementById('algoNlkStatus'),nlkTransferState=doc.getElementById('algoNlkTransferState'),nlkTakeReceipt=doc.getElementById('algoNlkTakeReceipt');
    const renderAlgoNlkDock=()=>{const state=algoNlkReturnDock(algoIndex);if(nlkReceipt)nlkReceipt.dataset.status=state.status==='EXACT_RETURN'?'exact':'hold';if(nlkStatus)nlkStatus.textContent=state.status.replaceAll('_',' ');if(nlkTransferState)nlkTransferState.textContent=state.status==='EXACT_RETURN'?'RETURN RECEIPT · EXACT':`ALGO ${state.source.step.toUpperCase()} · HOLD`;state.checks.forEach(check=>{const item=host.querySelector(`[data-nlk-check="${check.id}"]`);if(item)item.dataset.status=check.pass?'pass':'hold'});return state};
    const renderAlgoStream=()=>{const state=algoStream(algoIndex);if(algoSvg)algoSvg.innerHTML=algoStreamSvgMarkup(algoIndex);if(algoCounter)algoCounter.textContent=`${state.step.number} / 06`;if(algoTitle)algoTitle.textContent=state.step.title;if(algoCopy)algoCopy.textContent=state.step.copy;host.querySelectorAll('[data-algo-step]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===algoIndex)));renderAlgoNlkDock();return state};
    host.querySelectorAll('[data-algo-step]').forEach((button,i)=>button.addEventListener('click',()=>{algoIndex=i;renderAlgoStream()}));
    const algoPrev=doc.getElementById('algoStreamPrev'),algoNext=doc.getElementById('algoStreamNext');
    if(algoPrev)algoPrev.addEventListener('click',()=>{algoIndex=(algoIndex+ALGO_STREAM_STEPS.length-1)%ALGO_STREAM_STEPS.length;renderAlgoStream()});
    if(algoNext)algoNext.addEventListener('click',()=>{algoIndex=(algoIndex+1)%ALGO_STREAM_STEPS.length;renderAlgoStream()});
    if(nlkTakeReceipt)nlkTakeReceipt.addEventListener('click',()=>{algoIndex=ALGO_STREAM_STEPS.length-1;renderAlgoStream()});
    let foldLane='x32';
    const foldSvg=doc.getElementById('whiteLineCikadaSvg'),foldBand=doc.getElementById('whiteLineLaneBand'),foldTitle=doc.getElementById('whiteLineLaneTitle'),foldRole=doc.getElementById('whiteLineLaneRole');
    const renderWhiteLineJoint=()=>{const state=whiteLineCikadaJoint(foldLane),lane=state.selected;if(foldSvg)foldSvg.innerHTML=whiteLineCikadaSvgMarkup(foldLane);if(foldBand)foldBand.textContent=`${lane.sourceBand} · ${lane.id==='x32'?'SHARED FRAME':'DISTINCT BAND'}`;if(foldTitle)foldTitle.textContent=`${lane.workingLabel} · ${lane.address}${lane.mirrorAddress?` ⇄ ${lane.mirrorAddress}`:''}`;if(foldRole)foldRole.textContent=lane.role;host.querySelectorAll('[data-fold-lane]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.foldLane===foldLane)));return state};
    host.querySelectorAll('[data-fold-lane]').forEach(button=>button.addEventListener('click',()=>{foldLane=button.dataset.foldLane;renderWhiteLineJoint()}));
    render();renderDeris();renderAlgoStream();renderWhiteLineJoint();
    if(activeHash==='#algoNlkReturnDock'){
      const dock=doc.getElementById('algoNlkReturnDock'),win=doc.defaultView;
      const reveal=()=>{if(dock&&typeof dock.scrollIntoView==='function')dock.scrollIntoView({block:'start'});};
      if(win&&typeof win.requestAnimationFrame==='function')win.requestAnimationFrame(()=>win.requestAnimationFrame(reveal));else reveal();
    }
    return Object.freeze({render,renderDeris,renderAlgoStream,renderAlgoNlkDock,renderWhiteLineJoint,getScene:()=>STORIES[index],getScrew:()=>derisScrew(derisAngle?derisAngle.value:360),getAlgoStream:()=>algoStream(algoIndex),getAlgoNlkDock:()=>algoNlkReturnDock(algoIndex),getBridgeBraneReturnMatrix:()=>bridgeBraneReturnMatrix(),getWhiteLineCikadaJoint:()=>whiteLineCikadaJoint(foldLane),contract});
  }

  return Object.freeze({VERSION,STORIES,DE_RIS_GATES,ALGO_STREAM_STEPS,isPrime,primeMask,gateRecords,parityRing,ledger,aperture,derisScrew,algoStream,algoNlkReturnDock,polarMirrorCrosswalk,bridgeBraneReturnMatrix,reverseFixedWidth,whiteLineCikadaJoint,scarabM83Connector,contract,svgMarkup,derisSvgMarkup,derisShellMarkup,algoStreamSvgMarkup,algoStreamShellMarkup,algoNlkDockShellMarkup,polarMirrorShellMarkup,bridgeBraneReturnMatrixMarkup,whiteLineCikadaSvgMarkup,whiteLineCikadaJointMarkup,shellMarkup,mount});
});
