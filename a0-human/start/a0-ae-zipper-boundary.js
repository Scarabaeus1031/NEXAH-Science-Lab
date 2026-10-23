(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0AeZipperBoundary=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.5.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const PHASES=Object.freeze(['BEFORE','STRIP','AFTER','RETURN']);
  const PENTAGON_AXES=Object.freeze({
    YE:Object.freeze({id:'YE',angleDeg:90,orientation:'VERTICAL',role:'OWNER_ORIENTATION_LABEL'}),
    TRANSVERSE:Object.freeze({id:'TRANSVERSE',angleDeg:0,orientation:'HORIZONTAL',role:'ENGINEERING_VIEW_AXIS'}),
    PHI_NW_SE:Object.freeze({id:'PHI_NW_SE',glyph:'Φ',angleDeg:135,orientation:'NW_SE',role:'OWNER_ORIENTATION_LABEL'}),
    PSI_NE_SW:Object.freeze({id:'PSI_NE_SW',glyph:'Ψ',angleDeg:45,orientation:'NE_SW',role:'OWNER_ORIENTATION_LABEL'})
  });
  const rounded=value=>Number(value.toFixed(6));
  const freezePoint=point=>Object.freeze({x:rounded(point.x),y:rounded(point.y)});

  function buildPaperBoatGeometry(){
    const vertices=Array.from({length:5},(_,index)=>{const angle=(-90+index*72)*Math.PI/180;return{x:Math.cos(angle),y:Math.sin(angle)}});
    const cross=(a,b)=>a.x*b.y-a.y*b.x,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
    function axisHits(angleDeg){
      const angle=angleDeg*Math.PI/180,direction={x:Math.cos(angle),y:Math.sin(angle)},hits=[];
      vertices.forEach((start,index)=>{const end=vertices[(index+1)%vertices.length],edge=sub(end,start),denominator=cross(direction,edge);if(Math.abs(denominator)<1e-10)return;const along=cross(start,edge)/denominator,onEdge=cross(start,direction)/denominator;if(onEdge>=-1e-10&&onEdge<=1+1e-10)hits.push({x:direction.x*along,y:direction.y*along})});
      return hits.sort((a,b)=>a.y-b.y);
    }
    function chordAt(y){
      const xs=[];vertices.forEach((start,index)=>{const end=vertices[(index+1)%vertices.length];if(Math.abs(start.y-end.y)<1e-10||y<Math.min(start.y,end.y)-1e-10||y>Math.max(start.y,end.y)+1e-10)return;const t=(y-start.y)/(end.y-start.y);if(t>=-1e-10&&t<=1+1e-10)xs.push(start.x+t*(end.x-start.x))});
      const unique=[...new Set(xs.map(value=>rounded(value)))].sort((a,b)=>a-b);return Object.freeze({y:rounded(y),left:unique[0],right:unique.at(-1),width:rounded(unique.at(-1)-unique[0])});
    }
    const phiHits=axisHits(135),psiHits=axisHits(45),rows=Object.freeze([chordAt(Math.min(phiHits[0].y,psiHits[0].y)),chordAt(0),chordAt(Math.max(phiHits.at(-1).y,psiHits.at(-1).y))]);
    function quadrilateral(id,top,bottom,angles){const height=rounded(bottom.y-top.y),area=rounded((top.width+bottom.width)*height/2);return Object.freeze({id,top,bottom,height,area,anglesDeg:Object.freeze(angles),vertices:Object.freeze([freezePoint({x:top.left,y:top.y}),freezePoint({x:top.right,y:top.y}),freezePoint({x:bottom.right,y:bottom.y}),freezePoint({x:bottom.left,y:bottom.y})])})}
    const upper=quadrilateral('UPPER_BOAT_QUAD',rows[0],rows[1],[115.111772,115.111772,64.888228,64.888228]),lower=quadrilateral('LOWER_BOAT_QUAD',rows[1],rows[2],[72,72,108,108]),pentagonArea=5*Math.sin(72*Math.PI/180)/2;
    return Object.freeze({schema:'nexah.a0.d5-paper-boat-geometry/1',normalization:'REGULAR_PENTAGON_CIRCUMRADIUS_R_EQUALS_1',axisAnglesDeg:Object.freeze([0,45,90,135]),touchAxes:Object.freeze(['PHI_NW_SE','PSI_NE_SW']),transverseRows:rows,quadrilaterals:Object.freeze([upper,lower]),metrics:Object.freeze({chordWidths:Object.freeze(rows.map(row=>row.width)),heights:Object.freeze([upper.height,lower.height]),areas:Object.freeze([upper.area,lower.area]),centerToUpperWidth:rounded(rows[1].width/rows[0].width),lowerToCenterWidth:rounded(rows[2].width/rows[1].width),lowerToUpperArea:rounded(lower.area/upper.area),combinedArea:rounded(upper.area+lower.area),pentagonArea:rounded(pentagonArea),pentagonCoverage:rounded((upper.area+lower.area)/pentagonArea)}),createsCarrier:false,createsOperator:false});
  }
  const PAPER_BOAT_GEOMETRY=buildPaperBoatGeometry();
  const PENTAGON_PRECUT=Object.freeze({id:'A0OE:PASCAL_PENTAGON_D5_TEST',role:'UPSTREAM_VIEW_PRECUT',sides:5,rotationStepDeg:72,status:'EXISTING_SOURCE_BOUND_VIEW',axes:Object.freeze(Object.keys(PENTAGON_AXES)),orthogonalPairs:Object.freeze([Object.freeze(['YE','TRANSVERSE']),Object.freeze(['PHI_NW_SE','PSI_NE_SW'])]),paperBoat:PAPER_BOAT_GEOMETRY.schema,ownerName:'ORTHODOX_CROSS',geometryName:'FOUR_AXIS_ORTHOGONAL_OVERLAY',createsCarrier:false,createsOperator:false});
  const PLATES=Object.freeze({
    ETHER:Object.freeze({id:'ETHER',role:'CARRIER_FIELD_VIEW',status:'OWNER_CANDIDATE',accent:'#43d6e8'}),
    ZETA:Object.freeze({id:'ZETA',role:'ZERO_ROOT_CROSSING_VIEW',status:'OWNER_CANDIDATE',accent:'#ffbd35'}),
    BETA:Object.freeze({id:'BETA',role:'WEIGHT_BRANCH_VIEW',status:'OWNER_CANDIDATE',accent:'#a78bfa'}),
    EURO:Object.freeze({id:'EURO',glyph:'€',role:'EXCHANGE_VALUE_VIEW',status:'OWNER_CANDIDATE',accent:'#65e6b4'})
  });
  const PUNCTUATION=Object.freeze({'.':'ADDRESS_POINT',',':'DIRECTED_CONTINUATION','"':'PAIRED_CUTS'});
  const ADDRESS_APERTURE=Object.freeze({
    id:'A0_ENGINEERING_CHECK_49_ADDRESS_RETURN_VIEW',
    role:'SOURCE_BOUND_DECIMAL_REVERSAL_READOUT',
    operator:'R10_DECIMAL_REVERSAL',
    involutive:true,
    source:Object.freeze({path:'A0_SCIENTIFIC_POSITION_REPORT.html',status:'CORRECTED_DOCUMENTARY_VIEW'}),
    sourceRow:Object.freeze([
      Object.freeze({value:1031,class:'PRIME'}),
      Object.freeze({value:1032,class:'COMPOSITE',factorization:'2^3 * 3 * 43'}),
      Object.freeze({value:1033,class:'PRIME'})
    ]),
    returnRow:Object.freeze([
      Object.freeze({value:1301,class:'PRIME'}),
      Object.freeze({value:2301,class:'COMPOSITE',factorization:'3 * 13 * 59'}),
      Object.freeze({value:3301,class:'PRIME'})
    ]),
    sourceStride:1,
    returnStride:1000,
    pattern:'PRIME_COMPOSITE_PRIME',
    createsOperator:false
  });
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function normalizeAddress(value='1.111.111.111'){
    const display=String(value&&typeof value==='object'&&'display' in value?value.display:value).trim();
    if(!/^\d+(?:\.\d+){3}$/.test(display))throw Error('symbolic address must contain four dot-separated numeric segments');
    return Object.freeze({scheme:'NEXAH_OWNER_NOTATION',display,segments:Object.freeze(display.split('.').map(Number)),networkAddress:false});
  }

  function createState(input={}){
    const state={
      phase:PHASES.includes(input.phase)?input.phase:'BEFORE',
      step:Number.isInteger(input.step)?clamp(input.step,0,3):0,
      angle:Number(input.angle)===135?135:45,
      zipper:input.zipper==='CLOSED'?'CLOSED':'OPEN',
      plate:Object.hasOwn(PLATES,String(input.plate||''))?String(input.plate):'ETHER',
      pentagonArmed:Boolean(input.pentagonArmed),
      coupled:Boolean(input.coupled),
      addressAperture:input.addressAperture==='OPEN'?'OPEN':'CLOSED',
      address:normalizeAddress(input.address),
      sourceFingerprint:String(input.sourceFingerprint||'A0-OWNER-FIXTURE'),
      history:Object.freeze(Array.isArray(input.history)?input.history.slice(-16):[])
    };
    return Object.freeze(state);
  }

  function viewRotate(state){
    const current=createState(state);
    return createState({...current,angle:current.angle===45?135:45,history:[...current.history,{action:'VIEW_ROTATE_90',from:current.angle,to:current.angle===45?135:45}]});
  }

  function toggleZipper(state){
    const current=createState(state),zipper=current.zipper==='OPEN'?'CLOSED':'OPEN';
    return createState({...current,zipper,history:[...current.history,{action:'AE_ZIPPER',value:zipper}]});
  }

  function advance(state){
    const current=createState(state),step=(current.step+1)%4,phase=PHASES[step];
    return createState({...current,step,phase,history:[...current.history,{action:'ADVANCE_3_PLUS_1',step,phase}]});
  }

  function armPentagon(state){
    const current=createState(state);
    return createState({...current,pentagonArmed:true,history:[...current.history,{action:'ARM_PENTAGON_PRECUT',source:PENTAGON_PRECUT.id,sides:PENTAGON_PRECUT.sides,rotationStepDeg:PENTAGON_PRECUT.rotationStepDeg}]});
  }

  function selectPlate(state,plate){
    const current=createState(state),next=String(plate||'').toUpperCase();
    if(!Object.hasOwn(PLATES,next))throw Error(`unknown transversal plate: ${plate}`);
    return createState({...current,plate:next,coupled:false,phase:'STRIP',step:1,history:[...current.history,{action:'SELECT_TRANSVERSAL_PLATE',plate:next,psiQuarterTurnDeg:90}]});
  }

  function couple(state){
    const current=createState(state);
    const precut=current.pentagonArmed?[]:[{action:'ARM_PENTAGON_PRECUT',source:PENTAGON_PRECUT.id,sides:PENTAGON_PRECUT.sides,rotationStepDeg:PENTAGON_PRECUT.rotationStepDeg,automatic:true}];
    return createState({...current,pentagonArmed:true,coupled:true,phase:'STRIP',step:1,zipper:'CLOSED',history:[...current.history,...precut,{action:'COUPLE_TRANSVERSAL_VIEW',plate:current.plate,psiQuarterTurnDeg:90,target:'SCARAB_TRANSVERSE'}]});
  }

  function toggleAddressAperture(state){
    const current=createState(state),addressAperture=current.addressAperture==='OPEN'?'CLOSED':'OPEN',opening=addressAperture==='OPEN';
    return createState({...current,addressAperture,phase:opening?'RETURN':current.phase,step:opening?3:current.step,history:[...current.history,{action:'ADDRESS_APERTURE_R10',value:addressAperture,operator:ADDRESS_APERTURE.operator,sourceRow:ADDRESS_APERTURE.sourceRow.map(item=>item.value),returnRow:ADDRESS_APERTURE.returnRow.map(item=>item.value)}]});
  }

  function reset(state){
    const current=createState(state);
    return createState({address:current.address.display,sourceFingerprint:current.sourceFingerprint});
  }

  function inspect(state){
    const current=createState(state);
    const zero=Object.freeze({token:'ZERO',value:0,status:'ADDRESSED_PRESENT'});
    const nullToken=Object.freeze({token:'NŪLL',value:null,status:'OPEN_UNASSIGNED'});
    return Object.freeze({
      identity:IDENTITY,
      phase:current.phase,
      viewAxis:`${current.angle}°`,
      counterAxis:`${(current.angle+90)%180}°`,
      zipper:current.zipper,
      pentagonPrecut:Object.freeze({...PENTAGON_PRECUT,armed:current.pentagonArmed}),
      paperBoatGeometry:PAPER_BOAT_GEOMETRY,
      transversalPlate:PLATES[current.plate],
      coupled:current.coupled,
      addressAperture:current.addressAperture,
      addressReturn:ADDRESS_APERTURE,
      psiQuarterTurnDeg:90,
      address:current.address,
      zero,
      null:nullToken,
      zeroNullDistinct:zero.value!==nullToken.value&&zero.status!==nullToken.status,
      sourceFingerprint:current.sourceFingerprint,
      pipeline:Object.freeze(['PENTAGON_D5_PRECUT','AE_ZIPPER_LONGITUDINAL','TRANSVERSAL_PLATE','PSI_90','SCARAB_TRANSVERSE','ADDRESS_APERTURE_R10_RETURN'])
    });
  }

  function buildReceipt(state){
    const current=createState(state),reading=inspect(current);
    return Object.freeze({
      schema:'nexah.a0.ae-zipper-boundary-record/2',version:VERSION,identity:IDENTITY,
      classification:'OWNER_PROPOSED_ENGINEERING_LENS',
      sourcePrecursor:{id:'MRB-09',role:'zipper, reversal, center retention and auxiliary-bit gate',identityClaim:false},
      contract:{orderedPipeline:['PENTAGON_D5_PRECUT','AE_ZIPPER_LONGITUDINAL','TRANSVERSAL_PLATE','PSI_90','SCARAB_TRANSVERSE','ADDRESS_APERTURE_R10_RETURN'],upstreamPentagon:PENTAGON_PRECUT,paperBoatGeometry:PAPER_BOAT_GEOMETRY,addressAperture:ADDRESS_APERTURE,sequence:'BEFORE -> STRIP -> AFTER + RETURN',viewRotationDeg:90,transversalCutDeg:90,zipperGlyph:'æ',endpoints:['ø','ō'],punctuation:PUNCTUATION,plates:PLATES},
      current:reading,history:current.history,
      authority:{researchRun:false,scientificEvidence:false,newCanonicalIdentity:false,newRelation:false,networkAddress:false},
      boundary:'The source-bound D5 Pentagon is an upstream orientation pre-cut, not a new carrier and not a generator of the zipper or plate. The finite boundary remains visible. ZERO is an addressed present value; NŪLL is open/unassigned. ETHER, ZETA, BETA and EURO are Owner-candidate view labels, not established substances, operators or mechanisms. The 90-degree psi mark denotes a view coupling only. The Address Aperture displays exact integer adjacency and decimal reversal facts from the corrected documentary source; it does not establish the provisional Scarab operator spine.'
    });
  }

  function svgMarkup(state){
    const current=createState(state),closed=current.zipper==='CLOSED',phaseIndex=PHASES.indexOf(current.phase),plate=PLATES[current.plate];
    const orbitX=[165,310,455,310][phaseIndex],orbitY=[300,155,300,445][phaseIndex];
    const teeth=Array.from({length:9},(_,index)=>{const y=190+index*28,reach=closed?18:34;return `<path class="ae-tooth ae-tooth-l" d="M ${310-reach} ${y} L 310 ${y+10}"/><path class="ae-tooth ae-tooth-r" d="M ${310+reach} ${y} L 310 ${y+10}"/>`}).join('');
    const mapPoint=point=>`${(310+point.x*239).toFixed(2)},${(300+point.y*239).toFixed(2)}`;
    const boatPolygons=PAPER_BOAT_GEOMETRY.quadrilaterals.map((quad,index)=>`<polygon class="boat-q boat-q-${index+1}" points="${quad.vertices.map(mapPoint).join(' ')}"/><text x="310" y="${index===0?230:385}">Q${index+1} · A ${quad.area.toFixed(4)}R²</text>`).join('');
    const boatChords=PAPER_BOAT_GEOMETRY.transverseRows.map((row,index)=>`<path class="boat-chord boat-chord-${index+1}" d="M ${(310+row.left*239).toFixed(2)} ${(300+row.y*239).toFixed(2)} H ${(310+row.right*239).toFixed(2)}"/>`).join('');
    return `<defs><filter id="aeGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="aePlateFade" x1="0" x2="1"><stop offset="0" stop-color="${plate.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${plate.accent}" stop-opacity=".34"/><stop offset="1" stop-color="${plate.accent}" stop-opacity="0"/></linearGradient></defs>
      <g class="ae-grid">${Array.from({length:13},(_,i)=>`<path d="M ${70+i*40} 70 V 530 M 70 ${70+i*40} H 550"/>`).join('')}</g>
      <path class="ae-pentagon-envelope ${current.pentagonArmed?'armed':''}" d="M310 61 L537 226 L450 493 L170 493 L83 226 Z"/><g class="ae-paper-boat ${current.pentagonArmed?'armed':''}">${boatPolygons}${boatChords}</g><g class="ae-pentagon-axis-field ${current.pentagonArmed?'armed':''}"><path class="ye" d="M310 68 V488"/><path class="transverse" d="M106.70 300 H513.30"/><path class="phi" d="M448.43 161.57 L156.55 453.45"/><path class="psi" d="M171.57 161.57 L463.45 453.45"/><text x="321" y="112">YE</text><text x="486" y="290">T</text><text x="151" y="154">Φ / NW</text><text x="469" y="154" text-anchor="end">Ψ / NE</text></g><text class="ae-pentagon-label" x="310" y="91">D5 PRE-CUT · 3 CHORDS · 2 QUADS · ${current.pentagonArmed?'ARMED':'READY'}</text>
      <circle class="ae-lasso" cx="310" cy="300" r="205"/>
      <g class="ae-transversal-plate ${current.coupled?'coupled':''}"><rect x="72" y="267" width="476" height="66" rx="8" fill="url(#aePlateFade)"/><path d="M92 300 H528" style="stroke:${plate.accent}"/><text x="96" y="287" style="fill:${plate.accent}">${plate.glyph||plate.id} · ψ 90°</text><text x="524" y="321" text-anchor="end">${plate.role.replaceAll('_',' ')}</text></g>
      <g class="ae-propeller" transform="rotate(${current.angle} 310 300)"><path d="M310 300 C225 260 190 175 235 125 C285 175 315 220 310 300Z"/><path d="M310 300 C350 215 435 180 485 225 C435 275 390 305 310 300Z"/><path d="M310 300 C395 340 430 425 385 475 C335 425 305 380 310 300Z"/><path d="M310 300 C270 385 185 420 135 375 C185 325 230 295 310 300Z"/></g>
      <path class="ae-axis" d="M105 ${current.angle===45?505:95} L515 ${current.angle===45?95:505}"/>
      <path class="ae-counter-axis" d="M105 ${current.angle===45?95:505} L515 ${current.angle===45?505:95}"/>
      <rect class="ae-boundary" x="286" y="92" width="48" height="416" rx="20"/>
      <g class="ae-teeth ${closed?'closed':'open'}">${teeth}</g>
      <text class="ae-glyph" x="310" y="320">æ</text><text class="ae-side ae-zero" x="116" y="305">ZERO · 0</text><text class="ae-side ae-null" x="504" y="305">NŪLL · ∅</text>
      <circle class="ae-orbit" cx="${orbitX}" cy="${orbitY}" r="12"/><text class="ae-phase-label" x="310" y="565">${current.phase} · ${current.step===3?'RETURN / +1':`STEP ${current.step+1} / 3`}</text>`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('aeZipperBoundaryBench');if(!host)return null;
    const svg=doc.getElementById('aeZipperSvg'),status=doc.getElementById('aeZipperStatus'),phase=doc.getElementById('aeZipperPhase'),axis=doc.getElementById('aeZipperAxis'),zip=doc.getElementById('aeZipperState'),distinction=doc.getElementById('aeZeroNull'),address=doc.getElementById('aeAddress'),plateOut=doc.getElementById('aePlateReadout'),couplingOut=doc.getElementById('aeCouplingReadout'),pentagonOut=doc.getElementById('aePentagonReadout'),boatWidths=doc.getElementById('aeBoatWidths'),boatUpper=doc.getElementById('aeBoatUpper'),boatLower=doc.getElementById('aeBoatLower'),boatAngles=doc.getElementById('aeBoatAngles'),boatRatios=doc.getElementById('aeBoatRatios'),addressApertureOut=doc.getElementById('aeAddressApertureStatus'),primePatternOut=doc.getElementById('aeAddressPrimePattern'),pentagonButton=doc.getElementById('aePentagonPrecut'),step=doc.getElementById('aeZipperStep'),rotate=doc.getElementById('aeZipperRotate'),toggle=doc.getElementById('aeZipperToggle'),addressApertureButton=doc.getElementById('aeAddressAperture'),coupleButton=doc.getElementById('aeZipperCouple'),resetButton=doc.getElementById('aeZipperReset'),exportButton=doc.getElementById('aeZipperExport');
    const required={svg,status,phase,axis,zip,distinction,address,plateOut,couplingOut,pentagonOut,boatWidths,boatUpper,boatLower,boatAngles,boatRatios,addressApertureOut,primePatternOut,pentagonButton,step,rotate,toggle,addressApertureButton,coupleButton,resetButton,exportButton};
    const missing=Object.entries(required).filter(([,node])=>!node).map(([name])=>name);if(missing.length)throw Error(`Æ Zipper mount missing: ${missing.join(', ')}`);
    const plateButtons=[...(doc.querySelectorAll?doc.querySelectorAll('[data-ae-plate]'):[])];
    let state=createState();
    function render(){const reading=inspect(state),plate=reading.transversalPlate,apertureOpen=state.addressAperture==='OPEN',geometry=reading.paperBoatGeometry,metrics=geometry.metrics,[upper,lower]=geometry.quadrilaterals;host.dataset.phase=state.phase.toLowerCase();host.dataset.zipper=state.zipper.toLowerCase();host.dataset.plate=state.plate.toLowerCase();host.dataset.pentagon=state.pentagonArmed?'armed':'ready';host.dataset.coupled=String(state.coupled);host.dataset.addressAperture=state.addressAperture.toLowerCase();svg.innerHTML=svgMarkup(state);status.textContent=`${state.pentagonArmed?'PRE-CUT ARMED':'PRE-CUT READY'} · ${state.phase} · æ ${state.zipper} · ${plate.glyph||plate.id} · ${reading.viewAxis}`;phase.textContent=state.phase;axis.textContent=`/ ${reading.viewAxis} · \\ ${reading.counterAxis}`;zip.textContent=`æ ${state.zipper}`;distinction.textContent=reading.zeroNullDistinct?'ZERO ≠ NŪLL':'HOLD';address.textContent=reading.address.display;plateOut.textContent=`${plate.glyph||plate.id} · ${plate.role.replaceAll('_',' ')}`;pentagonOut.textContent=state.pentagonArmed?'D5 · 3 CHORDS · 2 QUADS · ARMED':'D5 · 3 CHORDS · READY · NOT APPLIED';boatWidths.textContent=`${metrics.chordWidths.map(value=>value.toFixed(4)).join(' · ')} R`;boatUpper.textContent=`A ${upper.area.toFixed(4)} R² · h ${upper.height.toFixed(4)} R`;boatLower.textContent=`A ${lower.area.toFixed(4)} R² · h ${lower.height.toFixed(4)} R`;boatAngles.textContent=`Q1 115.112° / 64.888° · Q2 72° / 108°`;boatRatios.textContent=`A₂/A₁ ${metrics.lowerToUpperArea.toFixed(4)} · coverage ${metrics.pentagonCoverage.toFixed(4)}`;addressApertureOut.textContent=apertureOpen?'OPEN · R₁₀ RETURN VISIBLE':'CLOSED · SOURCE ROW HELD';primePatternOut.textContent=apertureOpen?'P–C–P → P–C–P · EXACT':'P–C–P · WAITING FOR RETURN';pentagonButton.classList.toggle('primary',state.pentagonArmed);addressApertureButton.classList.toggle('primary',apertureOpen);addressApertureButton.textContent=apertureOpen?'CLOSE ADDRESS APERTURE':'OPEN ADDRESS APERTURE';couplingOut.textContent=state.coupled?'D5 → ZIPPER × PLATE · ψ 90° → SCARAB':'READY · ARM PRE-CUT / SELECT A PLATE';plateButtons.forEach(button=>button.classList.toggle('active',button.dataset.aePlate===state.plate));win.A0AeZipperBoundaryView=buildReceipt(state);return reading}
    function syncScarab(){const scarab=win.A0ScarabPillarProjectionController;if(scarab&&typeof scarab.selectView==='function'&&typeof scarab.setAngle==='function'){scarab.selectView('transverse');scarab.setAngle(90);return true}return false}
    pentagonButton.addEventListener('click',()=>{state=armPentagon(state);render()});step.addEventListener('click',()=>{state=advance(state);render()});rotate.addEventListener('click',()=>{state=viewRotate(state);render()});toggle.addEventListener('click',()=>{state=toggleZipper(state);render()});addressApertureButton.addEventListener('click',()=>{state=toggleAddressAperture(state);render()});plateButtons.forEach(button=>button.addEventListener('click',()=>{state=selectPlate(state,button.dataset.aePlate);render()}));coupleButton.addEventListener('click',()=>{state=couple(state);render();const synced=syncScarab();couplingOut.textContent=synced?'D5 → ZIPPER × PLATE · ψ 90° → SCARAB TRANSVERSE':'D5 → ZIPPER × PLATE · ψ 90° · SCARAB WAITING'});resetButton.addEventListener('click',()=>{state=reset(state);render()});
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildReceipt(state),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-ae-zipper-boundary-record.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,armPentagon(){state=armPentagon(state);return render()},step(){state=advance(state);render()},rotate(){state=viewRotate(state);render()},toggle(){state=toggleZipper(state);render()},toggleAddressAperture(){state=toggleAddressAperture(state);return render()},selectPlate(plate){state=selectPlate(state,plate);return render()},couple(){state=couple(state);render();syncScarab();return buildReceipt(state)},reset(){state=reset(state);render()},get state(){return state},get record(){return buildReceipt(state)}});
  }

  return{VERSION,IDENTITY,PHASES,PENTAGON_AXES,PAPER_BOAT_GEOMETRY,PENTAGON_PRECUT,PLATES,PUNCTUATION,ADDRESS_APERTURE,normalizeAddress,createState,viewRotate,toggleZipper,toggleAddressAperture,advance,armPentagon,selectPlate,couple,reset,inspect,buildReceipt,svgMarkup,mount};
});
