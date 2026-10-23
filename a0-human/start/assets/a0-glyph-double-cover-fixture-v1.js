(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0GlyphDoubleCover=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',EPS=1e-10;
  const rad=d=>d*Math.PI/180,near=(a,b)=>Math.abs(a-b)<EPS;
  function clockBearing(hour,minute=0){return ((hour%12)*30+minute*.5)%360}
  function clockVector(degrees){const a=rad(degrees);return [Math.sin(a),-Math.cos(a)]}
  function dot(a,b){return a.reduce((sum,v,i)=>sum+v*b[i],0)}
  function norm(a){return Math.sqrt(dot(a,a))}
  function angleBetween(a,b){return Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(norm(a)*norm(b)))))*180/Math.PI}
  function glyph(length=1){
    const incoming=clockVector(clockBearing(1,30)),outgoing=clockVector(clockBearing(4,30));
    return {incoming,outgoing,points3:[[-incoming[0]*length,-incoming[1]*length,0],[0,0,0],[outgoing[0]*length,outgoing[1]*length,0]],kinkDegrees:angleBetween(incoming,outgoing),outgoingClock:'04:30',pathWord:'FRONT>K90>OUT_0430'};
  }
  function rotateZ90([x,y,z]){return [-y,x,z]}
  function axisPair(length=1){
    const horizontal=glyph(length),verticalPoints3=horizontal.points3.map(rotateZ90);
    return {horizontalPoints3:horizontal.points3,verticalPoints3,kinkDegrees:horizontal.kinkDegrees,relation:'SAME_K90_ORTHOGONAL_VIEW',roles:{horizontal:{start:'L_PUSH',end:'R_TORQUE'},vertical:{start:'TOP_PUSH',end:'BOTTOM_TORQUE'}}};
  }
  const FLAP_PAIRS=Object.freeze({
    lr:Object.freeze({id:'lr',label:'L / R',faces:Object.freeze(['L','R']),hingeAxis:'Y'}),
    tb:Object.freeze({id:'tb',label:'TOP / BOTTOM',faces:Object.freeze(['TOP','BOTTOM']),hingeAxis:'X'}),
    fb:Object.freeze({id:'fb',label:'FRONT / BACK',faces:Object.freeze(['FRONT','BACK']),hingeAxis:'Z'})
  });
  const PINK_HINGE_ADDRESS='PINK_K90_DIAMOND';
  function flapState(pair='lr',angle=0,state='CLOSED'){
    const contract=FLAP_PAIRS[pair];
    if(!contract)throw new TypeError('pair must be lr, tb or fb');
    if(!Number.isFinite(angle)||angle<0||angle>90)throw new RangeError('flap angle must be within 0..90 degrees');
    return {schema:'a0.glyph-flap-state/1',pair,faces:[...contract.faces],hingeAxis:contract.hingeAxis,hingeAddress:PINK_HINGE_ADDRESS,angle,state};
  }
  function flapTransition(current,action,pair=current?.pair||'lr'){
    const source=current||flapState(pair);
    if(!FLAP_PAIRS[pair])throw new TypeError('pair must be lr, tb or fb');
    if(action==='open')return flapState(pair,90,'OPEN');
    if(action==='hold')return flapState(pair,source.angle,'HOLD');
    if(action==='close')return flapState(pair,0,'CLOSED_RETURN');
    throw new TypeError('action must be open, hold or close');
  }
  function runFlapAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail}),faces=[];
    Object.keys(FLAP_PAIRS).forEach(pair=>{
      const start=flapState(pair),open=flapTransition(start,'open'),hold=flapTransition(open,'hold'),close=flapTransition(hold,'close');
      faces.push(...start.faces);
      check(`${pair}-pair`,start.faces.length===2,`${pair} exposes two typed faces`);
      check(`${pair}-open`,open.angle===90&&open.state==='OPEN',`${pair} opens to 90°`);
      check(`${pair}-hold`,hold.angle===open.angle&&hold.state==='HOLD',`${pair} hold preserves angle`);
      check(`${pair}-close`,close.angle===0&&close.state==='CLOSED_RETURN',`${pair} closes to Return`);
      check(`${pair}-address`,[start,open,hold,close].every(s=>s.hingeAddress===PINK_HINGE_ADDRESS),`${pair} preserves Pink hinge address`);
    });
    check('six-faces',faces.length===6,'three pairs expose six faces');
    check('six-unique',new Set(faces).size===6,'all six face roles are unique');
    check('three-hinges',new Set(Object.values(FLAP_PAIRS).map(p=>p.hingeAxis)).size===3,'X/Y/Z hinge axes stay separate');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.glyph-flap.audit/1',fixtureVersion:VERSION,pairs:Object.keys(FLAP_PAIRS),faces,assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_SIX_FLAPS_TYPED_RETURN':'INVALID_FLAP_CONTRACT',claimBoundary:'FINITE_2D_FOLD_PROJECTION_ONLY / VIEW_NOT_FORCE_OR_3D_MECHANISM',details:checks};
  }
  const RGB_CHANNELS=Object.freeze(['R','G','B']);
  const RGB_PARENT_ADDRESS='1.111.111.111';
  const RGB_LOCAL_RETURN_ADDRESS='127.0.0.1:8878/A0';
  const RGB_LOCAL_RETURN_SHORT='1:8878/A0';
  const AR_GRID_SIZE=100;
  const ADDRESS_SCALE_LADDER=Object.freeze({DeC:Object.freeze({dimensions:Object.freeze([10,10]),role:'COARSE_REGISTER'}),B_AR:Object.freeze({dimensions:Object.freeze([100,100]),role:'BOUNDARY_REGISTER'}),UHA:Object.freeze({dimensions:Object.freeze([1000,1000]),role:'FINE_CARRIER'})});
  const SEAM_FIELDS=Object.freeze([Object.freeze({fieldSize:10,seamCount:11,label:'10×10 / 11 FUGEN'}),Object.freeze({fieldSize:12,seamCount:13,label:'12×12 / 13 FUGEN'})]);
  const BOUNDARY_PHASES=Object.freeze(['FOLD_OPEN','RING_BOUND','RGB_ROUTED','RETURN']);
  const RA_TH_BRIDGE=Object.freeze({
    name:'RA–TH Bridge',
    status:'OPEN_BRIDGE',
    sourceClass:'ARCHITECTURALLY_VISIBLE_NOT_SCIENTIFICALLY_ESTABLISHED',
    sourcePath:'RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/TRACE_TO_MOTION_0_1_PROTOCOL_DRAFT/../A0_SCIENTIFIC_POSITION_REPORT.html',
    sourceTerm:'(β-m|j)η-SPLIT',
    claimBoundary:'SOURCE_BOUND_VIEW_ONLY / UNASSESSED_ARCHITECTURAL_HYPOTHESIS / NO_MECHANISM_OR_PHYSICS_CLAIM'
  });
  function rgbCouplerState(values=[1,.55,.12],orientation='HOLD',step=0){
    if(!Array.isArray(values)||values.length!==3||values.some(value=>!Number.isFinite(value)||value<0||value>1))throw new TypeError('RGB values must be three finite numbers within 0..1');
    return {schema:'a0.rgb-orange-coupler-state/1',channels:[...RGB_CHANNELS],values:[...values],orientation,step,parentAddress:RGB_PARENT_ADDRESS,localReturnAddress:RGB_LOCAL_RETURN_ADDRESS,localReturnShort:RGB_LOCAL_RETURN_SHORT,address:`${RGB_PARENT_ADDRESS} : ${RGB_LOCAL_RETURN_SHORT}`};
  }
  function spinRGB(current,direction){
    const source=current||rgbCouplerState(),[r,g,b]=source.values;
    if(direction==='up')return rgbCouplerState([b,r,g],'SPIN_UP',source.step+1);
    if(direction==='down')return rgbCouplerState([g,b,r],'SPIN_DOWN',source.step-1);
    if(direction==='hold')return rgbCouplerState(source.values,'HOLD',source.step);
    throw new TypeError('direction must be up, down or hold');
  }
  function runRGBCouplerAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
    const bases=[[1,0,0],[0,1,0],[0,0,1]];
    bases.forEach((basis,index)=>{
      const source=rgbCouplerState(basis),up=spinRGB(source,'up'),down=spinRGB(source,'down');
      const expectedUp=[basis[2],basis[0],basis[1]],expectedDown=[basis[1],basis[2],basis[0]];
      check(`basis-${index}-up`,JSON.stringify(up.values)===JSON.stringify(expectedUp),'Spin up advances one RGB address slot');
      check(`basis-${index}-down`,JSON.stringify(down.values)===JSON.stringify(expectedDown),'Spin down reverses one RGB address slot');
      check(`basis-${index}-up-down`,JSON.stringify(spinRGB(up,'down').values)===JSON.stringify(basis),'down is the inverse of up');
      check(`basis-${index}-down-up`,JSON.stringify(spinRGB(down,'up').values)===JSON.stringify(basis),'up is the inverse of down');
    });
    const source=rgbCouplerState([.9,.5,.2]),up=spinRGB(source,'up'),down=spinRGB(source,'down'),sorted=state=>[...state.values].sort((a,b)=>a-b).join(',');
    check('up-sum',near(up.values.reduce((a,b)=>a+b,0),1.6),'Spin up preserves channel sum');
    check('down-sum',near(down.values.reduce((a,b)=>a+b,0),1.6),'Spin down preserves channel sum');
    check('up-multiset',sorted(up)===sorted(source),'Spin up permutes without mixing');
    check('down-multiset',sorted(down)===sorted(source),'Spin down permutes without mixing');
    check('up-address',up.address===source.address,'Spin up preserves parent and local Return address');
    check('down-address',down.address===source.address,'Spin down preserves parent and local Return address');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.rgb-orange-coupler.audit/1',fixtureVersion:VERSION,channels:[...RGB_CHANNELS],address:source.address,assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_RGB_ORANGE_ADDRESS_COUPLER':'INVALID_RGB_COUPLER_CONTRACT',claimBoundary:'FINITE_RGB_SLOT_PERMUTATION_ONLY / ORANGE_IS_COUPLING_FRAME_NOT_FOURTH_CHANNEL / NO_PHYSICAL_SPIN',details:checks};
  }
  function boundaryAR(a=50,r=50,phase='FOLD_OPEN'){
    if(!Number.isInteger(a)||!Number.isInteger(r)||a<0||a>=AR_GRID_SIZE||r<0||r>=AR_GRID_SIZE)throw new RangeError('a and r must be integers within 0..99');
    if(!BOUNDARY_PHASES.includes(phase))throw new TypeError('phase must be FOLD_OPEN, RING_BOUND, RGB_ROUTED or RETURN');
    const phaseIndex=BOUNDARY_PHASES.indexOf(phase),returned=phase==='RETURN';
    return {schema:'a0.boundary-ar-cell/1',operator:'B(a,r)',axes:{a:'ADDRESS',r:'RETURN_RESIDUAL'},dimensions:[AR_GRID_SIZE,AR_GRID_SIZE],cardinality:AR_GRID_SIZE*AR_GRID_SIZE,a,r,cellIndex:a*AR_GRID_SIZE+r,cellAddress:`B(${String(a).padStart(2,'0')},${String(r).padStart(2,'0')})`,phase,phaseIndex,purpleFold:'VIEW_ONLY',orangeRing:phaseIndex===0?'OPEN':returned?'CLOSED_RETURN':'BOUND',rgbRouted:phaseIndex>=2,returned,parentAddress:RGB_PARENT_ADDRESS,localReturnAddress:RGB_LOCAL_RETURN_ADDRESS};
  }
  function scaleLadder(a=50,r=50){
    const cell=boundaryAR(a,r);
    return {schema:'a0.address-scale-ladder/1',DeC:{dimensions:[10,10],coordinate:[Math.floor(a/10),Math.floor(r/10)]},B_AR:{dimensions:[100,100],coordinate:[a,r],cellAddress:cell.cellAddress},UHA:{dimensions:[1000,1000],xRange:[a*10,a*10+9],yRange:[r*10,r*10+9]},mapping:'DeC 10×10 ← B(a,r) 100×100 ← U/H/A 1000×1000',identityClaim:false};
  }
  function raThBridgeLens(a=7,r=9){
    const cell=boundaryAR(a,r,'RING_BOUND'),orderedPair=[r,a],slotSeparation=Math.abs(r-a);
    return {schema:'a0.ra-th-open-bridge-lens/1',name:RA_TH_BRIDGE.name,status:RA_TH_BRIDGE.status,sourceClass:RA_TH_BRIDGE.sourceClass,sourcePath:RA_TH_BRIDGE.sourcePath,sourceTerm:RA_TH_BRIDGE.sourceTerm,inputOrder:'r,a',orderedPair,cellAddress:cell.cellAddress,cell,slotSeparation,slotSeparationRole:'DISPLAY_ADDRESS_DIFFERENCE_ONLY',transversalHandoff:'UNRESOLVED',mechanismClaim:false,scientificStatusClaim:false,claimBoundary:RA_TH_BRIDGE.claimBoundary};
  }
  function runRaThBridgeAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail}),lens=raThBridgeLens(7,9);
    check('ordered-input',JSON.stringify(lens.orderedPair)==='[9,7]','owner input r,a = 9,7 remains ordered');
    check('cell-address',lens.cellAddress==='B(07,09)','r,a = 9,7 resolves to a=7, r=9');
    check('bridge-open',lens.status==='OPEN_BRIDGE','RA–TH remains an open bridge');
    check('source-class',lens.sourceClass==='ARCHITECTURALLY_VISIBLE_NOT_SCIENTIFICALLY_ESTABLISHED','source status is preserved');
    check('source-term',lens.sourceTerm==='(β-m|j)η-SPLIT','the source split remains named');
    check('display-gap',lens.slotSeparation===2&&lens.slotSeparationRole==='DISPLAY_ADDRESS_DIFFERENCE_ONLY','|r-a| = 2 is display bookkeeping only');
    check('transversal-unresolved',lens.transversalHandoff==='UNRESOLVED','the transversal handoff is not silently defined');
    check('no-mechanism',lens.mechanismClaim===false,'no mechanism claim is minted');
    check('no-status-promotion',lens.scientificStatusClaim===false,'no scientific status is promoted');
    check('boundary-held',lens.cell.orangeRing==='BOUND'&&lens.cell.purpleFold==='VIEW_ONLY','orange holds the seam while purple remains a view');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.ra-th-open-bridge.audit/1',fixtureVersion:VERSION,assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_RA_TH_OPEN_BRIDGE_LENS':'INVALID_RA_TH_BRIDGE_LENS',claimBoundary:RA_TH_BRIDGE.claimBoundary,details:checks};
  }
  function seamField(fieldSize){
    const contract=SEAM_FIELDS.find(item=>item.fieldSize===fieldSize);
    if(!contract)throw new TypeError('fieldSize must be 10 or 12');
    return {schema:'a0.field-seam-patch/1',dimensions:[contract.fieldSize,contract.fieldSize],fieldCount:contract.fieldSize*contract.fieldSize,seamsPerAxis:contract.seamCount,seamIntersections:contract.seamCount*contract.seamCount,relation:'N_FIELDS_REQUIRE_N_PLUS_1_BOUNDARIES',orangeRole:'SEAM',purpleRole:'FIELD_VIEW'};
  }
  function transitionBoundaryAR(current,action){
    const source=current||boundaryAR();
    if(action==='reset')return boundaryAR(source.a,source.r,'FOLD_OPEN');
    if(action==='next')return boundaryAR(source.a,source.r,BOUNDARY_PHASES[Math.min(source.phaseIndex+1,BOUNDARY_PHASES.length-1)]);
    if(BOUNDARY_PHASES.includes(action))return boundaryAR(source.a,source.r,action);
    throw new TypeError('action must be next, reset or a declared boundary phase');
  }
  function runBoundaryARAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
    const origin=boundaryAR(0,0),last=boundaryAR(99,99),sample=boundaryAR(23,31),sequence=BOUNDARY_PHASES.map(phase=>boundaryAR(sample.a,sample.r,phase));
    check('dimensions',JSON.stringify(sample.dimensions)==='[100,100]','a × r declares a 100 × 100 Cartesian grid');
    check('cardinality',sample.cardinality===10000,'the grid contains 10,000 address/Return cells');
    check('origin',origin.cellIndex===0&&origin.cellAddress==='B(00,00)','origin is stable');
    check('last',last.cellIndex===9999&&last.cellAddress==='B(99,99)','last cell is stable');
    check('row-neighbor',boundaryAR(23,32).cellIndex===sample.cellIndex+1,'r advances within one address row');
    check('column-neighbor',boundaryAR(24,31).cellIndex===sample.cellIndex+100,'a advances to the next address row');
    check('phase-count',BOUNDARY_PHASES.length===4,'four typed handshake phases');
    check('phase-order',sequence.every((state,index)=>state.phaseIndex===index),'handshake order is frozen');
    check('pair-preserved',sequence.every(state=>state.a===23&&state.r===31),'a/r pair survives every phase');
    check('purple-view',sequence.every(state=>state.purpleFold==='VIEW_ONLY'),'purple remains a fold/view role');
    check('orange-ring',sequence[1].orangeRing==='BOUND'&&sequence[2].orangeRing==='BOUND','orange ring holds the seam during routing');
    check('exact-return',sequence[3].returned&&sequence[3].cellAddress===sample.cellAddress,'Return closes on the same B(a,r) cell');
    const ladder=scaleLadder(23,31);
    check('scale-sizes',JSON.stringify([ladder.DeC.dimensions[0],ladder.B_AR.dimensions[0],ladder.UHA.dimensions[0]])==='[10,100,1000]','DeC, B(a,r) and U/H/A retain distinct 10/100/1000 side lengths');
    check('scale-cardinality',10*10===100&&100*100===10000&&1000*1000===1000000,'each tenfold side step is a hundredfold cell step');
    check('scale-containment',JSON.stringify(ladder.DeC.coordinate)==='[2,3]'&&JSON.stringify(ladder.UHA.xRange)==='[230,239]'&&JSON.stringify(ladder.UHA.yRange)==='[310,319]','B(23,31) binds one DeC cell and one 10 × 10 U/H/A patch');
    check('scale-nonidentity',ladder.identityClaim===false,'projection across scales does not assert cell identity');
    const field10=seamField(10),field12=seamField(12);
    check('field-10-seams-11',field10.seamsPerAxis===field10.dimensions[0]+1,'10 fields require 11 boundary lines per axis');
    check('field-12-seams-13',field12.seamsPerAxis===field12.dimensions[0]+1,'12 fields require 13 boundary lines per axis');
    check('field-separation',field10.fieldCount===100&&field12.fieldCount===144,'10×10 and 12×12 remain distinct field patches');
    check('seam-role-lock',[field10,field12].every(field=>field.orangeRole==='SEAM'&&field.purpleRole==='FIELD_VIEW'),'orange marks seams while purple remains the field view');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.boundary-ar.audit/1',fixtureVersion:VERSION,operator:'B(a,r)',dimensions:[AR_GRID_SIZE,AR_GRID_SIZE],assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_BOUNDARY_AR_100X100_RETURN':'INVALID_BOUNDARY_AR_CONTRACT',claimBoundary:'FINITE_CARTESIAN_ADDRESS_RETURN_GRID / PURPLE_IS_VIEW / ORANGE_IS_BOUNDARY / NO_PHYSICAL_OR_NETWORK_IDENTITY',details:checks};
  }
  const FORMAT_CONTRACTS=Object.freeze({
    A0:Object.freeze({family:'ISO_A',portrait:Object.freeze([841,1189])}),A1:Object.freeze({family:'ISO_A',portrait:Object.freeze([594,841])}),A2:Object.freeze({family:'ISO_A',portrait:Object.freeze([420,594])}),A3:Object.freeze({family:'ISO_A',portrait:Object.freeze([297,420])}),A4:Object.freeze({family:'ISO_A',portrait:Object.freeze([210,297])}),A5:Object.freeze({family:'ISO_A',portrait:Object.freeze([148,210])}),
    B0:Object.freeze({family:'ISO_B',portrait:Object.freeze([1000,1414])}),B1:Object.freeze({family:'ISO_B',portrait:Object.freeze([707,1000])}),B2:Object.freeze({family:'ISO_B',portrait:Object.freeze([500,707])}),B3:Object.freeze({family:'ISO_B',portrait:Object.freeze([353,500])}),B4:Object.freeze({family:'ISO_B',portrait:Object.freeze([250,353])}),B5:Object.freeze({family:'ISO_B',portrait:Object.freeze([176,250])}),
    LETTER:Object.freeze({family:'US_LETTER',portrait:Object.freeze([215.9,279.4])})
  });
  const FORMAT_ORIENTATIONS=Object.freeze(['PORTRAIT','LANDSCAPE']);
  const LOTUS88_PHASES=Object.freeze(['ORANGE_HOLD','YELLOW_FRAME','ORANGE_RETURN']);
  const IOTA_LEAF_OFFSETS=Object.freeze([0,5,10,15,20]);
  const IOTA_LEAF_COLORS=Object.freeze(['ORANGE','CYAN','GREEN','YELLOW','BLUE']);
  const RED_SHADOW_OFFSET=45;
  function formatFrame(format='A4',orientation='PORTRAIT'){
    const contract=FORMAT_CONTRACTS[format];
    if(!contract)throw new TypeError('format must be A0..A5, B0..B5 or LETTER');
    if(!FORMAT_ORIENTATIONS.includes(orientation))throw new TypeError('orientation must be PORTRAIT or LANDSCAPE');
    const dimensions=orientation==='PORTRAIT'?[...contract.portrait]:[contract.portrait[1],contract.portrait[0]],ratio=Math.max(...dimensions)/Math.min(...dimensions);
    return {schema:'a0.field-cut-frame/1',format,family:contract.family,orientation,dimensionsMm:dimensions,areaMm2:dimensions[0]*dimensions[1],longShortRatio:ratio,fieldCut:'ORIENTATION_VIEW',frameIdentity:`${format}:${orientation}`,ratioClass:contract.family==='US_LETTER'?'LETTER_11_TO_8_5':'ISO_ROOT2_APPROX'};
  }
  function iotaLeafRays(baseAngle=0){
    if(!Number.isFinite(baseAngle))throw new TypeError('baseAngle must be finite');
    return IOTA_LEAF_OFFSETS.map((offset,index)=>({index,offsetDegrees:offset,angleDegrees:baseAngle+offset,color:IOTA_LEAF_COLORS[index],pinRole:'BLACK_LOCAL_ANCHOR'}));
  }
  function lotus88State(step=0,phase='ORANGE_HOLD',format='A4',orientation='PORTRAIT'){
    if(!Number.isInteger(step)||step<0||step>=88)throw new RangeError('step must be an integer within 0..87');
    if(!LOTUS88_PHASES.includes(phase))throw new TypeError('phase must be ORANGE_HOLD, YELLOW_FRAME or ORANGE_RETURN');
    const frame=formatFrame(format,orientation);
    const angleDegrees=step*360/88;
    return {schema:'a0.lotus88-format-regulator/1',interface:'RAINBOW_INTERFACE',step,slots:88,angleDegrees,phase,color:phase==='YELLOW_FRAME'?'YELLOW':'ORANGE',transitionWord:phase==='YELLOW_FRAME'?'ORANGE_TO_YELLOW':phase==='ORANGE_RETURN'?'YELLOW_TO_ORANGE_RETURN':'ORANGE_HOLD',pin:'BLACK_LOCAL_ANCHOR',glyph:'^°',frame,iotaRing:{step,angleDegrees,role:'DRIVER_VIEW'},greenWheel:{step,displayAngleDegrees:angleDegrees,drivenBy:'IOTA_RING',coupling:'DISPLAY_SLOT_LOCK',transferRatioClaim:false},iotaLeaf:iotaLeafRays(angleDegrees),redShadow:{offsetDegrees:RED_SHADOW_OFFSET,angleDegrees:angleDegrees+RED_SHADOW_OFFSET,role:'VIEW_DIRECTION_GUIDE',channel:false},returned:phase==='ORANGE_RETURN'&&step===0};
  }
  function transitionLotus88(current,action){
    const source=current||lotus88State();
    if(action==='advance')return lotus88State((source.step+1)%88,source.phase,source.frame.format,source.frame.orientation);
    if(action==='release')return lotus88State(source.step,'YELLOW_FRAME',source.frame.format,source.frame.orientation);
    if(action==='return')return lotus88State(0,'ORANGE_RETURN',source.frame.format,source.frame.orientation);
    if(action==='hold')return lotus88State(source.step,'ORANGE_HOLD',source.frame.format,source.frame.orientation);
    throw new TypeError('action must be advance, release, return or hold');
  }
  function runFormatLotus88Audit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail}),isoIds=Object.keys(FORMAT_CONTRACTS).filter(id=>id!=='LETTER');
    check('format-count',Object.keys(FORMAT_CONTRACTS).length===13,'six A formats, six B formats and US Letter are declared');
    isoIds.forEach(id=>check(`${id}-root2`,Math.abs(formatFrame(id).longShortRatio-Math.SQRT2)<.007,`${id} retains the rounded ISO √2 frame ratio`));
    check('letter-distinct',Math.abs(formatFrame('LETTER').longShortRatio-Math.SQRT2)>.1,'US Letter remains distinct from the ISO √2 families');
    const portrait=formatFrame('A4','PORTRAIT'),landscape=formatFrame('A4','LANDSCAPE');
    check('format-preserved',portrait.format===landscape.format&&portrait.family===landscape.family,'orientation does not change format identity');
    check('orientation-swap',portrait.dimensionsMm[0]===landscape.dimensionsMm[1]&&portrait.dimensionsMm[1]===landscape.dimensionsMm[0],'landscape swaps width and height');
    check('area-preserved',near(portrait.areaMm2,landscape.areaMm2),'orientation preserves frame area');
    const held=lotus88State(17),released=transitionLotus88(held,'release'),returned=transitionLotus88(released,'return');
    check('hold-orange',held.phase==='ORANGE_HOLD'&&held.color==='ORANGE','orange is the held pin/seam state');
    check('release-yellow',released.phase==='YELLOW_FRAME'&&released.color==='YELLOW','yellow is the released frame state');
    check('directed-color-word',released.transitionWord==='ORANGE_TO_YELLOW','the color transition is directed Orange → Yellow');
    check('return-orange',returned.phase==='ORANGE_RETURN'&&returned.color==='ORANGE'&&returned.returned,'Return closes on orange at slot zero');
    check('slot-count',held.slots===88,'Lotus88 declares exactly 88 finite regulator slots');
    let cycle=lotus88State();for(let i=0;i<88;i++)cycle=transitionLotus88(cycle,'advance');
    check('cycle-return',cycle.step===0&&near(cycle.angleDegrees,0),'88 advances return to the starting regulator slot');
    check('five-rays',held.iotaLeaf.length===5,'the bounded Iota leaf exposes five rays');
    check('five-degree-split',held.iotaLeaf.slice(1).every((ray,index)=>near(ray.angleDegrees-held.iotaLeaf[index].angleDegrees,5)),'adjacent Iota rays are separated by 5°');
    check('black-pin',held.iotaLeaf.every(ray=>ray.pinRole==='BLACK_LOCAL_ANCHOR'),'all rays retain one black local pin');
    check('red-shadow-45',near(held.redShadow.angleDegrees-held.angleDegrees,45),'the red shadow remains a +45° direction guide');
    check('red-shadow-not-channel',held.redShadow.role==='VIEW_DIRECTION_GUIDE'&&held.redShadow.channel===false,'the red shadow is not a sixth Iota ray or color channel');
    check('rainbow-interface',held.interface==='RAINBOW_INTERFACE','pin, fan, transition and shadow meet at one typed Rainbow interface');
    check('iota-drives-green',held.greenWheel.drivenBy==='IOTA_RING'&&held.greenWheel.step===held.iotaRing.step,'the Iota ring advances the green display wheel on the same slot');
    check('drive-boundary',held.greenWheel.coupling==='DISPLAY_SLOT_LOCK'&&held.greenWheel.transferRatioClaim===false,'the drive is a UI slot lock, not a torque or transfer-ratio claim');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.format-lotus88.audit/1',fixtureVersion:VERSION,formats:Object.keys(FORMAT_CONTRACTS),assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_FORMAT_LOTUS88_ORANGE_TO_YELLOW':'INVALID_FORMAT_LOTUS88_CONTRACT',claimBoundary:'FINITE_FORMAT_VIEW_AND_88_SLOT_DISPLAY_REGULATOR / ORANGE_TO_YELLOW_IS_A_TYPED_UI_TRANSITION / IOTA_5_DEGREE_RAYS_ARE_A_DECLARED_GENERATOR_NOT_RECOVERED_PHYSICS',details:checks};
  }
  function matrix2(deg){const c=Math.cos(rad(deg)),s=Math.sin(rad(deg));return [[c,-s],[s,c]]}
  function mul2(a,b){return [[a[0][0]*b[0][0]+a[0][1]*b[1][0],a[0][0]*b[0][1]+a[0][1]*b[1][1]],[a[1][0]*b[0][0]+a[1][1]*b[1][0],a[1][0]*b[0][1]+a[1][1]*b[1][1]]]}
  function matrixNear(a,b){return a.every((row,i)=>row.every((v,j)=>near(v,b[i][j])))}
  function flipY180(p){return [-p[0],p[1],-p[2]]}
  function project(points,view){
    if(view==='front')return points.map(([x,y])=>[x,y]);
    if(view==='side')return points.map(([,y,z])=>[z,y]);
    throw new TypeError('view must be front or side');
  }
  function vectorState(deg){return [Math.cos(rad(deg)),Math.sin(rad(deg))]}
  function spinorState(deg){return [Math.cos(rad(deg/2)),Math.sin(rad(deg/2))]}
  function runAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
    const g=glyph(),front=project(g.points3,'front'),side=project(g.points3,'side'),flip2=g.points3.map(flipY180).map(flipY180);
    check('clock-0430',near(clockBearing(4,30),135),'4:30 is 135° clockwise from 12');
    check('out-x',near(g.outgoing[0],Math.SQRT1_2),'4:30 x component');
    check('out-y',near(g.outgoing[1],Math.SQRT1_2),'4:30 screen-y component');
    check('kink-dot',near(dot(g.incoming,g.outgoing),0),'tangents orthogonal');
    check('kink-90',near(g.kinkDegrees,90),'sharp 90° corner');
    check('polyline-three',g.points3.length===3,'two straight legs and one corner');
    check('same-axis-270',matrixNear(mul2(matrix2(180),matrix2(90)),matrix2(270)),'R180·R90 = R270 in one oriented plane');
    check('flip-involution',flip2.every((p,i)=>p.every((v,j)=>near(v,g.points3[i][j]))),'transversal 180° flip squared returns');
    check('front-side-differ',JSON.stringify(front)!==JSON.stringify(side),'front and side are different projections');
    check('side-collision',near(side[0][0],side[2][0])&&near(side[0][1],side[2][1]),'side view collides endpoints');
    check('front-distinct',!near(front[0][0],front[2][0]),'front view separates endpoints');
    check('projection-source-fixed',g.points3[1][0]===0&&g.points3[1][1]===0,'projection leaves source corner fixed');
    const v0=vectorState(0),v360=vectorState(360),s0=spinorState(0),s180=spinorState(180),s270=spinorState(270),s360=spinorState(360),s720=spinorState(720);
    check('vector-360-x',near(v0[0],v360[0]),'ordinary vector returns after 360°');
    check('vector-360-y',near(v0[1],v360[1]),'ordinary vector y returns after 360°');
    check('spinor-360-minus-x',near(s360[0],-s0[0]),'half-angle state changes sign at 360°');
    check('spinor-360-zero-y',near(s360[1],0),'360° half-angle state is antipodal');
    check('spinor-720-x',near(s720[0],s0[0]),'half-angle state returns at 720°');
    check('spinor-720-y',near(s720[1],s0[1]),'720° second component returns');
    check('double-cover-return',s720.every((v,i)=>near(v,s0[i])),'720° exact double-cover return');
    check('double-cover-not-360',!s360.every((v,i)=>near(v,s0[i])),'360° is not spinor identity');
    check('spinor-270-not-return',!s270.every((v,i)=>near(v,s0[i])),'270° is not double-cover return');
    check('spinor-180-not-return',!s180.every((v,i)=>near(v,s0[i])),'180° is not double-cover return');
    check('look-invariant',JSON.stringify({...g,look:undefined})===JSON.stringify({...glyph(),look:undefined}),'color label is outside geometry');
    check('direction-sensitive',g.pathWord!==g.pathWord.split('>').reverse().join('>'),'reversing the path changes the directed word');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.glyph-double-cover.audit/1',fixtureVersion:VERSION,geometry:'sharp K90 with outgoing 04:30 clock bearing',views:['front','side'],angles:[0,90,180,270,360,720],assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_GLYPH_DOUBLE_COVER_SEPARATED':'INVALID_CONTRACT',claimBoundary:'FINITE_ORIENTATION_ENGINEERING_ONLY / HALF_ANGLE_DOUBLE_COVER_NOT_PHYSICAL_DIRAC_CLAIM',details:checks};
  }
  return {VERSION,clockBearing,clockVector,glyph,rotateZ90,axisPair,FLAP_PAIRS,PINK_HINGE_ADDRESS,flapState,flapTransition,runFlapAudit,RGB_CHANNELS,RGB_PARENT_ADDRESS,RGB_LOCAL_RETURN_ADDRESS,RGB_LOCAL_RETURN_SHORT,rgbCouplerState,spinRGB,runRGBCouplerAudit,AR_GRID_SIZE,ADDRESS_SCALE_LADDER,SEAM_FIELDS,BOUNDARY_PHASES,RA_TH_BRIDGE,boundaryAR,scaleLadder,raThBridgeLens,runRaThBridgeAudit,seamField,transitionBoundaryAR,runBoundaryARAudit,FORMAT_CONTRACTS,FORMAT_ORIENTATIONS,LOTUS88_PHASES,IOTA_LEAF_OFFSETS,IOTA_LEAF_COLORS,RED_SHADOW_OFFSET,formatFrame,iotaLeafRays,lotus88State,transitionLotus88,runFormatLotus88Audit,matrix2,mul2,flipY180,project,vectorState,spinorState,runAudit};
});
