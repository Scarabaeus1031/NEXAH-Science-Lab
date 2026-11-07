(function(root,factory){
  const cube=typeof module==='object'&&module.exports?require('../../../a0-six-face-rainbow-tube.js'):root.A0SixFaceRainbowTube;
  const api=factory(cube);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0RubikQdcCrossSection=api;
  if(root.document)root.addEventListener('DOMContentLoaded',()=>api.mount());
})(typeof globalThis!=='undefined'?globalThis:this,function(CUBE){
  'use strict';

  if(!CUBE)throw new Error('A0SixFaceRainbowTube cube verifier is required');

  const MAGIC=34;
  const DURER=[[16,3,2,13],[5,10,11,8],[9,6,7,12],[4,15,14,1]];
  const KHAJURAHO=[[7,12,1,14],[2,13,8,11],[16,3,10,5],[9,6,15,4]];
  const AXIS_A='ABCDEFGHIJKL'.split('');
  const AXIS_B='MNOPQRSTUVWX'.split('');
  const ADDRESS_STATES={
    split:{label:'V1 · V9',detail:'Zwei Teiladressen auf V₁₀′; noch keine Rechnung.',tokens:['V1','V9']},
    concat:{label:'V19',detail:'1 ∥ 9 = 19 · Ziffernverkettung, keine Addition.',tokens:['V19']},
    step:{label:'W19',detail:'succ(V)=W · Carrier +1, Zahlenkanal bleibt 19.',tokens:['W19']},
    return:{label:'M78',detail:'Σ₁¹²=78 · expliziter Checksum-Return auf M₁′.',tokens:['M78']}
  };
  const GRAMMAR_STATES={
    t1:{label:'M83',time:'t1',detail:'M83 · bestehende SC/Messier-Katalogansicht. SPG bleibt ein Owner-View-Label.',pin:'SOURCE PIN'},
    t2:{label:'W38',time:'t2',detail:'rot₁₈₀(M)=W und rev₂(83)=38 · Glyphen- und Ziffernview bleiben getrennt prüfbar.',pin:'MIRROR PIN'},
    t3:{label:'100 · C?',time:'t3',detail:'83+17=100 ist exakt. C bleibt daneben ein Owner-Closure-Marker, nicht die Gleichung C=100.',pin:'OFFSET PIN'}
  };
  const STEERING_CODES=[
    {code:'000',vector:[0,0,0],role:'HOME',label:'NULL / HOME'},
    {code:'100',vector:[1,0,0],role:'AXIS',label:'X-ACHSE'},
    {code:'010',vector:[0,1,0],role:'AXIS',label:'Y-ACHSE'},
    {code:'001',vector:[0,0,1],role:'AXIS',label:'Z-ACHSE'},
    {code:'110',vector:[1,1,0],role:'FACE_DIAGONAL',label:'XY-FLÄCHENDIAGONALE'},
    {code:'101',vector:[1,0,1],role:'FACE_DIAGONAL',label:'XZ-FLÄCHENDIAGONALE'},
    {code:'011',vector:[0,1,1],role:'FACE_DIAGONAL',label:'YZ-FLÄCHENDIAGONALE'},
    {code:'111',vector:[1,1,1],role:'BODY_DIAGONAL',label:'XYZ-KÖRPERDIAGONALE'}
  ];
  const LO_SHU=[[2,7,6],[9,5,1],[4,3,8]];
  const LO_SHU_LINES=[
    {id:'R1',family:'ROW',cells:[[0,0],[0,1],[0,2]]},
    {id:'R2',family:'ROW',cells:[[1,0],[1,1],[1,2]]},
    {id:'R3',family:'ROW',cells:[[2,0],[2,1],[2,2]]},
    {id:'C1',family:'COLUMN',cells:[[0,0],[1,0],[2,0]]},
    {id:'C2',family:'COLUMN',cells:[[0,1],[1,1],[2,1]]},
    {id:'C3',family:'COLUMN',cells:[[0,2],[1,2],[2,2]]},
    {id:'D1',family:'DIAGONAL',cells:[[0,0],[1,1],[2,2]]},
    {id:'D2',family:'DIAGONAL',cells:[[0,2],[1,1],[2,0]]}
  ];
  const HEPTAD_ARCHETYPES=['EULER','RIEMANN','RAMANUJAN','GAUSS','GÖDEL','PENROSE','WEIL'];
  const HEPTAD_CROSSWALK_CODES=['100','010','001','110','101','011','111'];
  const ROOT7_CONTROL={vector:[2,1,1,1],normSquared:7,norm:'sqrt(7)',lens:'SG:LENS:ROOT7_LOOK',status:'CLOSED_BOUNDED_CONTROL_NOT_IDENTITY'};
  const ALIGNMENT_PROFILES={
    J_LUV:{label:'J-LUV / KITE VIEW',center:[180,100],tip:[180,18],hingeY:105,source:'A0_WERKBANK.html#machinaHouseTitle'},
    HEPTAD:{label:'HEPTAD REFERENCE',center:[250,250],tip:[250,36],hingeY:250,source:'heptad-14-orientation.js'}
  };
  function macroblockFootprint(row,column){
    const rows=[row*3,row*3+1,row*3+2],columns=[column*3,column*3+1,column*3+2];
    return {rows,columns,humanRows:(rows[0]+1)+'-'+(rows[2]+1),humanColumns:(columns[0]+1)+'-'+(columns[2]+1)};
  }

  function buildDualRouteFixture(row,column){
    if(!Number.isInteger(row)||!Number.isInteger(column)||row<0||row>3||column<0||column>3)throw new Error('Macroblock coordinates must be integers from zero to three');
    const macro=[row,column],qIntermediate=[row,0];
    let dIntermediate=[row,(column+1)%4];
    if(dIntermediate[0]===qIntermediate[0]&&dIntermediate[1]===qIntermediate[1])dIntermediate=[(row+1)%4,(column+1)%4];
    const qRoute=[[0,0],qIntermediate,macro],dRoute=[[0,0],dIntermediate,macro];
    return {block:'B'+row+column,macro,unitFootprint:macroblockFootprint(row,column),qValue:DURER[row][column],dValue:KHAJURAHO[row][column],qRoute,dRoute,qReturn:qRoute.slice().reverse(),dReturn:dRoute.slice().reverse(),turn:{forward:1,return:-1,modulus:4}};
  }

  const DUAL_ROUTE_REGISTER=Array.from({length:4},(_,row)=>Array.from({length:4},(_,column)=>buildDualRouteFixture(row,column))).flat();
  const DUAL_ROUTE_FIXTURE=DUAL_ROUTE_REGISTER.find(item=>item.block==='B12');
  const Q3D_SOURCE=[1,2,3,4,5,6,7,8,9];
  const Q3D_RAILS={Q:[3,4,5],D:[1,4,7]};
  const Q3D_POSITION_TYPES=['CORNER','EDGE','CORNER','EDGE','CENTER','EDGE','CORNER','EDGE','CORNER'];
  const RUBIK_GENERATOR_CLASSES={OUTER:['U','D','L','R','F','B'],SLICE:['M','E','S'],ROTATION:['x','y','z']};
  const Q3D_EDGE_RAILS={QE:[1,5,3],DE:[1,5,7]};
  const Q3D_EDGE_FACELETS={B:['U2','B2'],D:['U4','L2'],F:['U6','R2'],H:['U8','F2']};
  const Q3D_EDGE_SEQUENCES={
    QE:['R',"U'",'R','U','R','U','R',"U'","R'","U'",'R','R'],
    DE:['U','R',"U'",'R','U','R','U','R',"U'","R'","U'",'R','R',"U'"]
  };
  const MOVES={
    home:{label:'HOME',detail:'Originale Q- und D-Platte',transform:m=>clone(m)},
    both:{label:'R90',detail:'Ganze Platte um 90° gedreht',transform:rotate90},
    q:{label:'Q CROSS',detail:'Mittlere Spalten 2 ↔ 3',transform:m=>permuteCols(m,[0,2,1,3])},
    d:{label:'D WRAP',detail:'Alle Spalten toroidal +1',transform:m=>shiftAllRows(m,1)},
    neither:{label:'SLICE',detail:'Nur obere Zeile +1',transform:m=>shiftFirstRow(m,1)}
  };

  function clone(matrix){return matrix.map(row=>row.slice());}
  function sum(values){return values.reduce((total,value)=>total+value,0);}
  function rotate90(matrix){return matrix[0].map((_,column)=>matrix.map(row=>row[column]).reverse());}
  function permuteCols(matrix,order){return matrix.map(row=>order.map(index=>row[index]));}
  function shiftRow(row,amount){const n=row.length,step=((amount%n)+n)%n;return row.slice(n-step).concat(row.slice(0,n-step));}
  function shiftAllRows(matrix,amount){return matrix.map(row=>shiftRow(row,amount));}
  function shiftFirstRow(matrix,amount){const next=clone(matrix);next[0]=shiftRow(next[0],amount);return next;}

  function qAudit(matrix){
    const rows=matrix.map(sum);
    const columns=matrix[0].map((_,column)=>sum(matrix.map(row=>row[column])));
    const diagonals=[sum(matrix.map((row,index)=>row[index])),sum(matrix.map((row,index)=>row[matrix.length-1-index]))];
    const pass=[...rows,...columns,...diagonals].every(value=>value===MAGIC);
    return {pass,rows,columns,diagonals};
  }

  function dAudit(matrix){
    const n=matrix.length,broken=[],blocks=[];
    for(let offset=0;offset<n;offset++){
      broken.push(sum(matrix.map((row,index)=>row[(index+offset)%n])));
      broken.push(sum(matrix.map((row,index)=>row[(offset-index+n*2)%n])));
    }
    for(let row=0;row<n;row++)for(let column=0;column<n;column++){
      blocks.push(matrix[row][column]+matrix[row][(column+1)%n]+matrix[(row+1)%n][column]+matrix[(row+1)%n][(column+1)%n]);
    }
    const normal=qAudit(matrix);
    return {pass:normal.rows.concat(normal.columns,broken,blocks).every(value=>value===MAGIC),broken,blocks,normal};
  }

  function packingAudit(side,moduleSide=3){
    const volume=side**3,moduleVolume=moduleSide**3,axisCount=Math.floor(side/moduleSide),spatialCount=axisCount**3;
    return {side,moduleSide,volume,moduleVolume,volumeQuotient:Math.floor(volume/moduleVolume),volumeRemainder:volume%moduleVolume,axisCount,spatialCount,spatialCovered:spatialCount*moduleVolume,spatialRemainder:volume-spatialCount*moduleVolume};
  }

  function elevatorGridAddress(n){
    if(!Number.isInteger(n)||n<0||n>=1221)throw new Error('Elevator address must be an integer from zero to 1220');
    const row=Math.floor(n/111),column=n%111;
    return {n,row,column,rowCount:11,columnCount:111,roundTrip:row*111+column,label:'G'+row+':'+column};
  }

  function cubePacketAddress(n){
    if(!Number.isInteger(n)||n<0||n>=1221)throw new Error('Cube packet address must be an integer from zero to 1220');
    const packet=Math.floor(n/27),slot=n%27,isCap=packet===45;
    return {n,packet,slot,packetSize:27,completePackets:45,capSize:6,isCap,roundTrip:packet*27+slot,label:'P'+packet+':S'+slot};
  }

  function returnCubePacket(packet,slot){
    if(!Number.isInteger(packet)||!Number.isInteger(slot)||packet<0||packet>45||slot<0)throw new Error('Packet and slot must be bounded non-negative integers');
    const slotLimit=packet===45?6:27;
    if(slot>=slotLimit)throw new Error('Slot is outside the declared packet or cap');
    return packet*27+slot;
  }

  function elevatorWorldCrosswalk(n){
    const grid=elevatorGridAddress(n),packet=cubePacketAddress(n),returned=returnCubePacket(packet.packet,packet.slot);
    return {n,grid,packet,returned,pass:grid.roundTrip===n&&packet.roundTrip===n&&returned===n,route:'n ↔ (row₁₁,column₁₁₁) ↔ (packet₂₇,slot₂₇)'};
  }

  function elevatorWorldContract(){
    const states=Array.from({length:1221},(_,n)=>elevatorWorldCrosswalk(n));
    const gridKeys=new Set(states.map(state=>state.grid.row+':'+state.grid.column));
    const packetKeys=new Set(states.map(state=>state.packet.packet+':'+state.packet.slot));
    const decomposition={total:1221,completePackets:45,packetSize:27,capSize:6,recomposed:45*27+6};
    return {pass:states.every(state=>state.pass)&&gridKeys.size===1221&&packetKeys.size===1221&&decomposition.recomposed===1221,decomposition,cardinality:{states:states.length,gridKeys:gridKeys.size,packetKeys:packetKeys.size},boundary:'EUCLIDEAN_ADDRESS_LEDGER_NOT_SPATIAL_PACKING_NOT_CANONICAL_CUBE_MOVE_DOES_NOT_CLOSE_1221_TO_12321_LIFT'};
  }

  function alphaAddress(letter){
    const symbol=String(letter||'').toUpperCase();
    const globalIndex=symbol.length===1?symbol.charCodeAt(0)-64:0;
    if(AXIS_A.includes(symbol))return {letter:symbol,registered:true,axis:'A-L',globalIndex,localIndex:globalIndex,prime:false,label:symbol+globalIndex};
    if(AXIS_B.includes(symbol))return {letter:symbol,registered:true,axis:'M-X',globalIndex,localIndex:globalIndex-12,prime:true,label:symbol+(globalIndex-12)+"'"};
    return {letter:symbol,registered:false,axis:'RESERVED',globalIndex,localIndex:null,prime:null,label:symbol+'·RESERVED'};
  }

  function concatenateAddress(carrier,left,right){
    const address=alphaAddress(carrier);
    if(!address.registered)throw new Error('Carrier must be inside A-X register');
    return {carrier:address.letter,value:Number(String(left)+String(right)),operation:'CONCAT',label:address.letter+String(left)+String(right)};
  }

  function successorAddress(address){
    const carrier=String(address.carrier||'').toUpperCase();
    const index=AXIS_A.concat(AXIS_B).indexOf(carrier);
    if(index<0||index===23)throw new Error('Successor requires carrier A-W');
    const next=AXIS_A.concat(AXIS_B)[index+1];
    return {carrier:next,value:address.value,operation:'CARRIER_STEP',label:next+address.value};
  }

  function axisChecksum(size=12){return size*(size+1)/2;}

  function parseAddressToken(token){
    const normalized=String(token||'').trim().toUpperCase().replaceAll("'",'′');
    const match=/^([A-Z])(\d+)(′)?$/.exec(normalized);
    if(!match)throw new Error('Address token must be LETTER + positive decimal payload');
    const carrier=alphaAddress(match[1]),value=Number(match[2]);
    if(!carrier.registered||!Number.isInteger(value)||value<0)throw new Error('Address token outside A-X register');
    const primeMark=Boolean(match[3]),payloadLabel=String(value)+(primeMark?'′':'');
    return {token:match[0],carrier:carrier.letter,value,primeMark,axis:carrier.axis,localIndex:carrier.localIndex,carrierCoordinate:carrier.label,carrierPrime:carrier.prime,payloadLane:primeMark?'PRIME':'BASE',payloadLabel,addressType:'CARRIER_PLUS_DECIMAL_PAYLOAD',coordinateEquality:value===carrier.localIndex&&primeMark===carrier.prime};
  }

  function compositeAddressContract(){
    const k12=parseAddressToken('K12'),l12Prime=parseAddressToken('L12′'),m83=parseAddressToken('M83');
    const examples={K12:k12,"L12′":l12Prime,M83:m83};
    return {grammar:'LETTER + DECIMAL PAYLOAD + OPTIONAL PAYLOAD PRIME',examples,reserved:['Y','Z'],rules:['carrier coordinate is intrinsic and immutable','decimal payload is not an alphabet position','terminal prime marks payload lane only','carrier prime and payload prime are independent'],pass:k12.carrierCoordinate==='K11'&&k12.payloadLabel==='12'&&l12Prime.carrierCoordinate==='L12'&&l12Prime.payloadLabel==='12′'&&m83.carrierCoordinate==="M1'"&&m83.payloadLabel==='83'&&!k12.coordinateEquality&&!l12Prime.coordinateEquality&&!m83.coordinateEquality};
  }

  function rotateGlyph(letter){
    const symbol=String(letter||'').toUpperCase();
    if(symbol==='M')return 'W';
    if(symbol==='W')return 'M';
    throw new Error('Local glyph rotation is declared only for M and W');
  }

  function reverseFixed(value,width=2){
    if(!Number.isInteger(value)||value<0||!Number.isInteger(width)||width<1)throw new Error('Fixed reversal requires non-negative integer and positive width');
    const source=String(value).padStart(width,'0');
    if(source.length!==width)throw new Error('Value exceeds fixed width');
    return Number(source.split('').reverse().join(''));
  }

  function mirrorAddress(token){
    const parsed=parseAddressToken(token),carrier=rotateGlyph(parsed.carrier),value=reverseFixed(parsed.value,2);
    return {source:parsed.token,carrier,value,operation:'GLYPH_ROTATION_PLUS_FIXED_REVERSAL',label:carrier+String(value).padStart(2,'0')};
  }

  function offsetAddress(token,delta){
    const parsed=parseAddressToken(token);
    if(!Number.isInteger(delta))throw new Error('Offset must be an integer');
    const value=parsed.value+delta;
    if(value<0)throw new Error('Offset leaves non-negative payload rail');
    return {source:parsed.token,carrier:parsed.carrier,value,delta,operation:'NUMERIC_OFFSET',label:parsed.carrier+value};
  }

  function addressGrammarV2(){
    const mirror=mirrorAddress('M83'),plus1=offsetAddress('M78',1),plus12=offsetAddress('M78',12),closure=83+17;
    const timeline=[
      {time:'t1',address:'M83',role:'SC/MESSIER SOURCE VIEW'},
      {time:'t2',address:mirror.label,role:'M/W GLYPH + 83/38 DIGIT VIEW'},
      {time:'t3',address:String(closure),role:'OFFSET CLOSURE; C OWNER MARKER SEPARATE'}
    ];
    const hinge={majorPins:2,microPins:3,closureGlyph:'ị',frame:'SQUARE',shell:'ROUND',crossing:['PURPLE VIEW TRACE','GREEN CUT AXIS']};
    return {mirror,plus1,plus12,closure,timeline,hinge,cRole:'OWNER_CLOSURE_MARKER_NOT_ROMAN_NUMERAL_NOT_EQUALITY',dimeRole:'OWNER_MNEMONIC_VIEW_IN_TIME_ONLY',lokiRole:'EXISTING_REGISTERED_SUBVIEW_NEIGHBOR_NOT_BOUND',pass:mirror.label==='W38'&&plus1.label==='M79'&&plus12.label==='M90'&&closure===100&&rotateGlyph(rotateGlyph('M'))==='M'&&reverseFixed(reverseFixed(83,2),2)===83};
  }

  function normalizeSteeringCode(code){
    const value=String(code==null?'':code).trim();
    if(!/^[01]{3}$/.test(value))throw new Error('Steering code must be a fixed three-bit word');
    return value;
  }

  function steeringWeight(code){return normalizeSteeringCode(code).split('').reduce((total,bit)=>total+Number(bit),0);}

  function steeringClass(code){
    const weight=steeringWeight(code);
    return weight===0?'HOME':weight===1?'AXIS':weight===2?'FACE_DIAGONAL':'BODY_DIAGONAL';
  }

  function xorSteering(left,right){
    const a=normalizeSteeringCode(left),b=normalizeSteeringCode(right);
    return a.split('').map((bit,index)=>String(Number(bit)^Number(b[index]))).join('');
  }

  function steeringState(code='000'){
    const normalized=normalizeSteeringCode(code),record=STEERING_CODES.find(item=>item.code===normalized);
    const returned=xorSteering(normalized,normalized);
    return {code:normalized,vector:record.vector.slice(),role:record.role,label:record.label,weight:steeringWeight(normalized),route:['000',normalized,returned],returnCode:returned,operation:'XOR_SELF_RETURN',pass:returned==='000'&&record.role===steeringClass(normalized)};
  }

  function steeringContract(){
    const states=STEERING_CODES.map(item=>steeringState(item.code));
    const counts=states.reduce((out,state)=>{out[state.role]=(out[state.role]||0)+1;return out;},{});
    return {states,nonzero:states.filter(state=>state.code!=='000'),counts,context:{binaryCube:'2^3=8=1 HOME + 7 NONZERO WAYS',faceRegister:'3^2=9',moduleRegister:'3^3=27',addressSidecar:'W=23; 46=23+23=2*23'},ownerView:{lateral:'six nonzero axis/face-diagonal ways may be read as KIEMEN',body:'111 may be read as PHANTOMZINKE'},boundary:'FINITE Z2^3 DIRECTION COMPARATOR; NOT A CANONICAL RUBIK MOVE, Q/D PLATE MAPPING, PHYSICAL GILL OR PHANTOM OBJECT',pass:states.length===8&&states.filter(state=>state.code!=='000').length===7&&states.every(state=>state.pass)&&counts.HOME===1&&counts.AXIS===3&&counts.FACE_DIAGONAL===3&&counts.BODY_DIAGONAL===1};
  }

  function loShuAudit(matrix=LO_SHU){
    if(!Array.isArray(matrix)||matrix.length!==3||matrix.some(row=>!Array.isArray(row)||row.length!==3))throw new Error('Lo Shu audit requires a 3x3 matrix');
    const lines=LO_SHU_LINES.map(line=>{
      const values=line.cells.map(([row,column])=>matrix[row][column]);
      return {...line,values,total:sum(values),pass:sum(values)===15};
    });
    const center=matrix[1][1],flat=matrix.flat(),outer=flat.filter((_,index)=>index!==4);
    const pairCells=[[[0,0],[2,2]],[[0,1],[2,1]],[[0,2],[2,0]],[[1,0],[1,2]]];
    const pairs=pairCells.map((cells,index)=>{
      const values=cells.map(([row,column])=>matrix[row][column]),pairTotal=sum(values);
      return {id:'P'+(index+1),cells,values,pairTotal,withCenter:pairTotal+center,pass:pairTotal===10&&pairTotal+center===15};
    });
    const corners=[matrix[0][0],matrix[0][2],matrix[2][0],matrix[2][2]];
    const edges=[matrix[0][1],matrix[1][0],matrix[1][2],matrix[2][1]];
    const familyCounts=lines.reduce((out,line)=>{out[line.family]=(out[line.family]||0)+1;return out;},{});
    const gap={faceCells:9,steeringStates:STEERING_CODES.length,stateDifference:9-STEERING_CODES.length,checksum12:axisChecksum(12),faceTotal:sum(flat),checksumGap:axisChecksum(12)-sum(flat)};
    const cubeContext={order:3,cells:3**3,magicConstant:3*(3**3+1)/2,status:'CONTEXT_ONLY_NOT_CONSTRUCTED'};
    return {matrix:clone(matrix),magicConstant:15,lines,familyCounts,center,cellCount:flat.length,total:sum(flat),outer,outerTotal:sum(outer),pairs,corners,cornerTotal:sum(corners),edges,edgeTotal:sum(edges),gap,cubeContext,boundary:'LO SHU 3X3 FINITE AUDIT; NOT YET A 3X3X3 MAGIC CUBE OR RUBIK CONTROL MAP',pass:lines.length===8&&lines.every(line=>line.pass)&&familyCounts.ROW===3&&familyCounts.COLUMN===3&&familyCounts.DIAGONAL===2&&center===5&&sum(flat)===45&&outer.length===8&&sum(outer)===40&&pairs.every(pair=>pair.pass)&&sum(corners)===20&&sum(edges)===20&&gap.stateDifference===1&&gap.checksumGap===33&&cubeContext.magicConstant===42};
  }

  function loShuState(lineId='D1'){
    const audit=loShuAudit(),line=audit.lines.find(item=>item.id===lineId)||audit.lines.find(item=>item.id==='D1');
    const containsCenter=line.cells.some(([row,column])=>row===1&&column===1);
    return {lineId:line.id,family:line.family,cells:line.cells.map(cell=>cell.slice()),values:line.values.slice(),total:line.total,containsCenter,equation:line.values.join(' + ')+' = '+line.total,detail:containsCenter?'CENTER HINGE · Gegenpaar + 5 = 15':'OUTER AUDIT · Summenlinie ohne Center-Hinge',pass:line.pass};
  }

  function heptadCrosswalkState(code='100'){
    const normalized=normalizeSteeringCode(code);
    if(normalized==='000')throw new Error('HOME 000 stays outside the seven-way Heptad crosswalk');
    const index=HEPTAD_CROSSWALK_CODES.indexOf(normalized);
    if(index<0)throw new Error('Crosswalk requires one of seven declared nonzero steering words');
    const steering=steeringState(normalized),primaryStep=index*2,antipode=(primaryStep+7)%14,sector=primaryStep%7;
    return {index,code:normalized,steering,heptad:{index,sector,primaryStep,antipode,primaryTheta:primaryStep+'π/7',antipodeTheta:antipode+'π/7',archetype:HEPTAD_ARCHETYPES[index],sameSector:sector===antipode%7},root7:{...ROOT7_CONTROL,vector:ROOT7_CONTROL.vector.slice()},route:[normalized,'H'+index,'n'+primaryStep,'n'+antipode],boundary:'DECLARED DISPLAY BIJECTION; NOT A CANONICAL RUBIK MOVE, ROOT7 AXIS, EDGE IDENTITY OR PHYSICAL ROUTE',pass:steering.code!=='000'&&steering.pass&&sector===antipode%7&&ROOT7_CONTROL.vector.reduce((total,value)=>total+value*value,0)===ROOT7_CONTROL.normSquared};
  }

  function heptadCrosswalkCode(primaryStep){
    const step=Number(primaryStep);
    if(!Number.isInteger(step)||step<0||step>12||step%2!==0)throw new Error('Primary Heptad step must be one of 0,2,4,6,8,10,12');
    return HEPTAD_CROSSWALK_CODES[step/2];
  }

  function heptadCrosswalkContract(){
    const states=HEPTAD_CROSSWALK_CODES.map(heptadCrosswalkState),primarySteps=states.map(state=>state.heptad.primaryStep),antipodes=states.map(state=>state.heptad.antipode),sectors=states.map(state=>state.heptad.sector);
    const root7NormSquared=ROOT7_CONTROL.vector.reduce((total,value)=>total+value*value,0);
    return {states,home:'000',primarySteps,antipodes,sectors,root7:{...ROOT7_CONTROL,vector:ROOT7_CONTROL.vector.slice()},cardinality:{nonzeroSteering:states.length,heptadPrimary:primarySteps.length,root7NormSquared},identity:false,boundary:'CARDINALITY AND DISPLAY CROSSWALK ONLY; 000, CENTER 5, HEPTAD 7 AND SQRT7 REMAIN TYPE-SEPARATE',pass:states.length===7&&states.every(state=>state.pass)&&new Set(primarySteps).size===7&&new Set(antipodes).size===7&&new Set(sectors).size===7&&states.every(state=>heptadCrosswalkCode(state.heptad.primaryStep)===state.code)&&root7NormSquared===7};
  }

  function alignmentAudit(){
    const source=ALIGNMENT_PROFILES.J_LUV,reference=ALIGNMENT_PROFILES.HEPTAD;
    const tipDistance=Math.abs(source.center[1]-source.tip[1]);
    const rawHingeOffset=source.hingeY-source.center[1];
    const normalizedHingeOffset=rawHingeOffset/tipDistance;
    return {tipDistance,rawHingeOffset,normalizedHingeOffset,ratio:'5/82',centerGap:0,axisGap:0,centerPass:true,axisPass:true,hingePass:false,threeAnchorPass:false,classification:'TWO_ANCHOR_PASS / HINGE_OFFSET_5_OVER_82 / THREE_ANCHOR_IDENTITY_REJECTED',source:{...source,center:source.center.slice(),tip:source.tip.slice()},reference:{...reference,center:reference.center.slice(),tip:reference.tip.slice()},boundary:'SOURCE-NORMALIZED VIEW COMPARATOR ONLY; NO COMMON CARRIER, MATERIAL, FORCE, MECHANISM OR IDENTITY'};
  }

  function alignmentState(mode='source'){
    if(!['source','forced'].includes(mode))throw new Error('Alignment mode must be source or forced');
    const audit=alignmentAudit(),forced=mode==='forced';
    return {...audit,mode,displayHingeOffset:forced?0:audit.normalizedHingeOffset,displayRatio:forced?'0 · SNAP':'5/82 · SOURCE',status:forced?'CONSTRUCTED_SNAP_CONTROL_NOT_SOURCE_ALIGNMENT':audit.classification,identity:false,redBalloonRole:'CENTER_WITNESS_ONLY',teapotRole:'OWNER_SILHOUETTE_QUESTION_NOT_IDENTITY'};
  }

  function dualRouteFixture(block='B12'){
    const fixture=DUAL_ROUTE_REGISTER.find(item=>item.block===block);
    if(!fixture)throw new Error('Unknown macroblock '+block);
    return fixture;
  }

  function dualRouteAudit(block='B12'){
    const fixture=dualRouteFixture(block),endpoint=fixture.macro;
    const qEnd=fixture.qRoute.at(-1),dEnd=fixture.dRoute.at(-1),qHome=fixture.qReturn.at(-1),dHome=fixture.dReturn.at(-1);
    const turnReturn=((fixture.turn.forward+fixture.turn.return)%fixture.turn.modulus+fixture.turn.modulus)%fixture.turn.modulus;
    const sameEndpoint=qEnd[0]===dEnd[0]&&qEnd[1]===dEnd[1]&&qEnd[0]===endpoint[0]&&qEnd[1]===endpoint[1],distinctIntermediate=qRouteKey(fixture.qRoute)!==qRouteKey(fixture.dRoute),qReturnsHome=qHome[0]===0&&qHome[1]===0,dReturnsHome=dHome[0]===0&&dHome[1]===0,fieldIdentityMerged=fixture.qValue===fixture.dValue;
    return {fixture:{...fixture,macro:fixture.macro.slice(),unitFootprint:{...fixture.unitFootprint,rows:fixture.unitFootprint.rows.slice(),columns:fixture.unitFootprint.columns.slice()},qRoute:fixture.qRoute.map(point=>point.slice()),dRoute:fixture.dRoute.map(point=>point.slice()),qReturn:fixture.qReturn.map(point=>point.slice()),dReturn:fixture.dReturn.map(point=>point.slice()),turn:{...fixture.turn}},sameEndpoint,distinctIntermediate,qReturnsHome,dReturnsHome,turnReturn,qFieldIdentity:'Q:R'+endpoint[0]+'C'+endpoint[1]+'='+fixture.qValue,dFieldIdentity:'D:R'+endpoint[0]+'C'+endpoint[1]+'='+fixture.dValue,fieldIdentityMerged,status:'SAME_MACROBLOCK / DISTINCT_PLATE_FIELDS / DUAL_ROUTE_RETURN_PASS',boundary:'DISPLAY ROUTES TO ONE 3X3 MACROBLOCK; NOT CANONICAL RUBIK MOVES OR Q/D FIELD IDENTITY',pass:sameEndpoint&&distinctIntermediate&&qReturnsHome&&dReturnsHome&&turnReturn===0&&!fieldIdentityMerged};
  }

  function qRouteKey(route){return route.map(point=>point.join(',')).join('>');}

  function dualRouteRegisterAudit(){
    const audits=DUAL_ROUTE_REGISTER.map(item=>dualRouteAudit(item.block)),blocks=audits.map(item=>item.fixture.block),qValues=audits.map(item=>item.fixture.qValue).sort((a,b)=>a-b),dValues=audits.map(item=>item.fixture.dValue).sort((a,b)=>a-b);
    const fullCoverage=blocks.length===16&&new Set(blocks).size===16&&qValues.every((value,index)=>value===index+1)&&dValues.every((value,index)=>value===index+1);
    return {count:audits.length,blocks,qValues,dValues,fullCoverage,allReturn:audits.every(item=>item.pass),fieldPairsRemainDistinct:audits.every(item=>!item.fieldIdentityMerged),status:'16 MACROBLOCKS / 16 Q FIELDS / 16 D FIELDS / ALL RETURNS PASS',boundary:'FINITE 4X4 DISPLAY REGISTER; NOT A RUBIK MOVE TABLE OR FIELD IDENTITY',pass:fullCoverage&&audits.every(item=>item.pass)};
  }

  function dualRouteState(mode='both',block='B12'){
    if(!['q','d','both','return'].includes(mode))throw new Error('Dual route mode must be q, d, both or return');
    const audit=dualRouteAudit(block),returning=mode==='return';
    const showQ=mode==='q'||mode==='both'||returning,showD=mode==='d'||mode==='both'||returning;
    return {...audit,mode,showQ,showD,returning,qTrace:returning?audit.fixture.qRoute.concat(audit.fixture.qReturn.slice(1)):audit.fixture.qRoute,dTrace:returning?audit.fixture.dRoute.concat(audit.fixture.dReturn.slice(1)):audit.fixture.dRoute,layerQuarterTurns:returning?audit.turnReturn:1,displayStatus:returning?'RETURN PASS · B00 · '+block+' · TURN 0':'TARGET '+block+' · SAME BLOCK · DISTINCT ROUTES'};
  }

  function q3dApply(cells,rail,direction=1){
    if(!Array.isArray(cells)||cells.length!==9||new Set(cells).size!==9)throw new Error('Q3D requires a nine-token permutation');
    if(!Q3D_RAILS[rail]||![1,-1].includes(direction))throw new Error('Q3D rail must be Q or D with direction plus or minus one');
    const indices=Q3D_RAILS[rail],next=cells.slice(),step=direction===1?1:indices.length-1;
    indices.forEach((source,index)=>{next[indices[(index+step)%indices.length]]=cells[source];});
    return next;
  }

  function q3dRun(operations){
    return operations.reduce((cells,[rail,direction])=>q3dApply(cells,rail,direction),Q3D_SOURCE.slice());
  }

  function q3dCycle(rail,direction=1){
    if(!Q3D_RAILS[rail]||![1,-1].includes(direction))throw new Error('Q3D cycle requires rail Q or D and direction plus or minus one');
    const labels='ABCDEFGHI'.split(''),indices=Q3D_RAILS[rail],ordered=direction===1?indices:indices.slice().reverse();
    return '('+ordered.map(index=>labels[index]).join(' ') + ')';
  }

  function q3dRubikFeasibility(rail,direction=1,block='B12'){
    dualRouteAudit(block);
    const cells=q3dApply(Q3D_SOURCE,rail,direction),transfers=Q3D_SOURCE.map((token,source)=>{
      const target=cells.indexOf(token);
      return {token,source,target,sourceType:Q3D_POSITION_TYPES[source],targetType:Q3D_POSITION_TYPES[target],preservesType:Q3D_POSITION_TYPES[source]===Q3D_POSITION_TYPES[target]};
    }),violations=transfers.filter(item=>!item.preservesType),center=transfers.find(item=>item.sourceType==='CENTER');
    return {block,rail,direction,tokenCycle:q3dCycle(rail,direction),inverseCycle:q3dCycle(rail,-direction),cells,positionTypes:Q3D_POSITION_TYPES.slice(),checkedGeneratorClasses:{OUTER:RUBIK_GENERATOR_CLASSES.OUTER.slice(),SLICE:RUBIK_GENERATOR_CLASSES.SLICE.slice(),ROTATION:RUBIK_GENERATOR_CLASSES.ROTATION.slice()},invariant:'LEGAL 3X3 MOVES PRESERVE CORNER / EDGE / CENTER CUBIE CLASS',centerTransfer:center,violations,legalSequenceExists:false,canonicalSequence:null,shortestCanonicalLength:null,reason:'CENTER_TO_EDGE_TYPE_VIOLATION',classification:'Q3D_TOKEN_PERMUTATION_ONLY',status:'CANONICAL RUBIK REALIZATION REJECTED',pass:violations.length>0&&center&&!center.preservesType};
  }

  function q3dRubikAudit(block='B12'){
    const operations=[['Q',1],['Q',-1],['D',1],['D',-1]].map(([rail,direction])=>q3dRubikFeasibility(rail,direction,block));
    const qInverse=q3dApply(q3dApply(Q3D_SOURCE,'Q',1),'Q',-1),dInverse=q3dApply(q3dApply(Q3D_SOURCE,'D',1),'D',-1);
    return {block,operations,cycles:operations.map(item=>item.tokenCycle),allCanonicalRealizationsRejected:operations.every(item=>!item.legalSequenceExists&&item.reason==='CENTER_TO_EDGE_TYPE_VIOLATION'),tokenInversesExact:qInverse.join(',')===Q3D_SOURCE.join(',')&&dInverse.join(',')===Q3D_SOURCE.join(','),canonicalSequence:null,classification:'RETAIN Q3D TOKEN GRAMMAR / DO NOT PROMOTE TO RUBIK MOVE',boundary:'FINITE CENTER-TYPE INVARIANT PROOF; NO EXHAUSTIVE SEARCH CLAIM, CANONICAL RUBIK OPERATOR OR PHYSICAL ACTUATION',pass:operations.every(item=>item.pass)&&qInverse.join(',')===Q3D_SOURCE.join(',')&&dInverse.join(',')===Q3D_SOURCE.join(',')};
  }

  function q3dRubikRegisterAudit(){
    const audits=DUAL_ROUTE_REGISTER.map(item=>q3dRubikAudit(item.block));
    return {count:audits.length,blocks:audits.map(item=>item.block),reference:'B12',allRejected:audits.every(item=>item.allCanonicalRealizationsRejected),allTokenInversesExact:audits.every(item=>item.tokenInversesExact),classification:'SAME NON-CANONICAL Q3D TOKEN GRAMMAR AT ALL SIXTEEN EXISTING ADDRESSES',pass:audits.length===16&&audits.every(item=>item.pass)};
  }

  function q3dEdgeApply(cells,rail,direction=1){
    if(!Array.isArray(cells)||cells.length!==9||new Set(cells).size!==9)throw new Error('Q3D edge redesign requires a nine-token permutation');
    if(!Q3D_EDGE_RAILS[rail]||![1,-1].includes(direction))throw new Error('Q3D edge rail must be QE or DE with direction plus or minus one');
    const indices=Q3D_EDGE_RAILS[rail],next=cells.slice(),step=direction===1?1:indices.length-1;
    indices.forEach((source,index)=>{next[indices[(index+step)%indices.length]]=cells[source];});
    return next;
  }

  function q3dEdgeCycle(rail,direction=1){
    if(!Q3D_EDGE_RAILS[rail]||![1,-1].includes(direction))throw new Error('Q3D edge cycle requires rail QE or DE with direction plus or minus one');
    const labels='ABCDEFGHI'.split(''),indices=Q3D_EDGE_RAILS[rail],ordered=direction===1?indices.slice():indices.slice().reverse();
    while(ordered[0]!==indices[0])ordered.push(ordered.shift());
    return '('+ordered.map(index=>labels[index]).join(' ')+')';
  }

  function q3dEdgeSequence(rail,direction=1){
    if(!Q3D_EDGE_SEQUENCES[rail]||![1,-1].includes(direction))throw new Error('Q3D edge sequence requires rail QE or DE with direction plus or minus one');
    return (direction===1?Q3D_EDGE_SEQUENCES[rail]:CUBE.inverseSequence(Q3D_EDGE_SEQUENCES[rail])).slice();
  }

  function q3dEdgeRubikFeasibility(rail,direction=1,block='B12'){
    dualRouteAudit(block);
    const labels=Object.keys(Q3D_EDGE_FACELETS),sequence=q3dEdgeSequence(rail,direction),cube=CUBE.applySequence(CUBE.SOLVED,sequence),cells=q3dEdgeApply(Q3D_SOURCE,rail,direction);
    const transfers=labels.map(label=>{
      const sourceIndex='ABCDEFGHI'.indexOf(label),token=Q3D_SOURCE[sourceIndex],targetIndex=cells.indexOf(token),targetLabel='ABCDEFGHI'[targetIndex];
      const actual=Q3D_EDGE_FACELETS[label].map(address=>CUBE.currentSlot(cube,CUBE.stickerId(address)).address);
      const expected=Q3D_EDGE_FACELETS[targetLabel].slice();
      return {label,targetLabel,sourceIndex,targetIndex,sourceType:Q3D_POSITION_TYPES[sourceIndex],targetType:Q3D_POSITION_TYPES[targetIndex],actual,expected,preservesType:Q3D_POSITION_TYPES[sourceIndex]===Q3D_POSITION_TYPES[targetIndex],orientationPreserved:actual.join('|')===expected.join('|')};
    });
    const changed=CUBE.SLOTS.map((slot,index)=>cube[index]===index?null:{source:CUBE.SLOTS[cube[index]].address,target:slot.address}).filter(Boolean),expectedChanged=Q3D_EDGE_RAILS[rail].flatMap(index=>Q3D_EDGE_FACELETS['ABCDEFGHI'[index]]);
    const expectedChangedSet=new Set(expectedChanged),changedTargets=new Set(changed.map(item=>item.target));
    const centersFixed=['U5','D5','L5','R5','F5','B5'].every(address=>CUBE.currentSlot(cube,CUBE.stickerId(address)).address===address);
    const onlyDeclaredEdgeFaceletsMove=changed.length===6&&changed.every(item=>expectedChangedSet.has(item.target))&&expectedChanged.every(address=>changedTargets.has(address));
    const inverseReturned=CUBE.isSolved(CUBE.applySequence(cube,q3dEdgeSequence(rail,-direction)));
    const orderThree=CUBE.isSolved(CUBE.applySequence(CUBE.SOLVED,[...sequence,...sequence,...sequence]));
    const legalOuterTurns=sequence.every(move=>RUBIK_GENERATOR_CLASSES.OUTER.includes(move[0]));
    return {block,rail,direction,tokenCycle:q3dEdgeCycle(rail,direction),inverseCycle:q3dEdgeCycle(rail,-direction),cells,sequence,inverseSequence:q3dEdgeSequence(rail,-direction),sequenceLength:sequence.length,sequenceMinimality:'NOT_CLAIMED',transfers,changedFacelets:changed,changedFaceletCount:changed.length,centersFixed,cornersFixed:onlyDeclaredEdgeFaceletsMove,edgeOrientationsPreserved:transfers.every(item=>item.orientationPreserved),onlyDeclaredEdgeFaceletsMove,inverseReturned,orderThree,legalOuterTurns,legalSequenceExists:true,classification:'VERIFIED_TYPE_PRESERVING_OUTER_TURN_REALIZATION',status:'LEGAL RUBIK REALIZATION VERIFIED',pass:transfers.every(item=>item.preservesType&&item.orientationPreserved)&&centersFixed&&onlyDeclaredEdgeFaceletsMove&&inverseReturned&&orderThree&&legalOuterTurns};
  }

  function q3dEdgeRubikAudit(block='B12'){
    const operations=[['QE',1],['QE',-1],['DE',1],['DE',-1]].map(([rail,direction])=>q3dEdgeRubikFeasibility(rail,direction,block));
    const qPlus=q3dEdgeSequence('QE',1),dPlus=q3dEdgeSequence('DE',1),qdCube=CUBE.applySequence(CUBE.SOLVED,[...qPlus,...dPlus]),dqCube=CUBE.applySequence(CUBE.SOLVED,[...dPlus,...qPlus]);
    const qdTokens=q3dEdgeApply(q3dEdgeApply(Q3D_SOURCE,'QE',1),'DE',1),dqTokens=q3dEdgeApply(q3dEdgeApply(Q3D_SOURCE,'DE',1),'QE',1);
    const qInverse=q3dEdgeApply(q3dEdgeApply(Q3D_SOURCE,'QE',1),'QE',-1),dInverse=q3dEdgeApply(q3dEdgeApply(Q3D_SOURCE,'DE',1),'DE',-1);
    return {block,operations,cycles:operations.map(item=>item.tokenCycle),allLegalRealizationsVerified:operations.every(item=>item.legalSequenceExists&&item.pass),allFullStateChecksPass:operations.every(item=>item.changedFaceletCount===6&&item.centersFixed&&item.cornersFixed&&item.edgeOrientationsPreserved),tokenInversesExact:qInverse.join(',')===Q3D_SOURCE.join(',')&&dInverse.join(',')===Q3D_SOURCE.join(','),cubeInversesExact:operations.every(item=>item.inverseReturned),orderThree:operations.every(item=>item.orderThree),nonCommutativeTokens:qdTokens.join(',')!==dqTokens.join(','),nonCommutativeCube:qdCube.join(',')!==dqCube.join(','),sequenceMinimality:'NOT_CLAIMED',operatorPromotion:false,classification:'LOCAL VERIFIED EDGE-ONLY REDESIGN / SAME QDC-Q3D FIXTURE',boundary:'LEGAL OUTER-TURN WORDS VERIFIED ON THE EXISTING 54-FACELET CUBE MODEL; NO SHORTEST-WORD CLAIM, NEW NAVIGATOR OPERATOR, FAMILY VOCABULARY, PHYSICAL ACTUATION OR CLAIM PROMOTION',pass:operations.every(item=>item.pass)&&qInverse.join(',')===Q3D_SOURCE.join(',')&&dInverse.join(',')===Q3D_SOURCE.join(',')&&qdTokens.join(',')!==dqTokens.join(',')&&qdCube.join(',')!==dqCube.join(',')};
  }

  function q3dEdgeRubikRegisterAudit(){
    const audits=DUAL_ROUTE_REGISTER.map(item=>q3dEdgeRubikAudit(item.block));
    return {count:audits.length,blocks:audits.map(item=>item.block),reference:'B12',allLegal:audits.every(item=>item.allLegalRealizationsVerified),allFullStateChecksPass:audits.every(item=>item.allFullStateChecksPass),allReturnsExact:audits.every(item=>item.tokenInversesExact&&item.cubeInversesExact),allOrderSensitive:audits.every(item=>item.nonCommutativeTokens&&item.nonCommutativeCube),classification:'SAME VERIFIED EDGE-ONLY REDESIGN AT ALL SIXTEEN EXISTING ADDRESSES',pass:audits.length===16&&audits.every(item=>item.pass)};
  }

  function q3dAudit(block='B12'){
    const macro=dualRouteAudit(block);
    const q=q3dRun([['Q',1]]),d=q3dRun([['D',1]]),qd=q3dRun([['Q',1],['D',1]]),dq=q3dRun([['D',1],['Q',1]]);
    const qReturn=q3dApply(q,'Q',-1),dReturn=q3dApply(d,'D',-1),qdReturn=q3dApply(q3dApply(qd,'D',-1),'Q',-1),dqReturn=q3dApply(q3dApply(dq,'Q',-1),'D',-1);
    const permutation=cells=>cells.slice().sort((a,b)=>a-b).every((value,index)=>value===index+1);
    const tokenReturn=[qReturn,dReturn,qdReturn,dqReturn].every(cells=>cells.join(',')===Q3D_SOURCE.join(','));
    return {source:Q3D_SOURCE.slice(),rails:{Q:Q3D_RAILS.Q.slice(),D:Q3D_RAILS.D.slice()},intersection:Q3D_RAILS.Q.filter(index=>Q3D_RAILS.D.includes(index)),q,d,qd,dq,qReturn,dReturn,qdReturn,dqReturn,nonCommutative:qd.join(',')!==dq.join(','),target:block,macroAddress:{qRoute:macro.fixture.qRoute.map(point=>point.slice()),dRoute:macro.fixture.dRoute.map(point=>point.slice()),qReturn:macro.fixture.qReturn.map(point=>point.slice()),dReturn:macro.fixture.dReturn.map(point=>point.slice()),bothReturnB00:macro.qReturnsHome&&macro.dReturnsHome},tokenReturn,composedReturn:tokenReturn&&macro.qReturnsHome&&macro.dReturnsHome,boundary:'DECLARED 3X3 SLICE PERMUTATIONS PARAMETERIZED BY EXISTING B00-B33 MACROBLOCK ADDRESS; NOT CANONICAL RUBIK GENERATORS, PHYSICAL ACTUATION OR GENERAL QD CONTROL LAW',pass:macro.pass&&[q,d,qd,dq].every(permutation)&&tokenReturn&&qd.join(',')!==dq.join(',')};
  }

  function q3dRegisterAudit(){
    const audits=DUAL_ROUTE_REGISTER.map(item=>q3dAudit(item.block)),blocks=audits.map(audit=>audit.target);
    return {count:audits.length,blocks,allMacroReturns:audits.every(audit=>audit.macroAddress.bothReturnB00),allTokenReturns:audits.every(audit=>audit.tokenReturn),allComposedReturns:audits.every(audit=>audit.composedReturn),allOrderSensitive:audits.every(audit=>audit.nonCommutative),reference:'B12',boundary:'SAME BOUNDED TOKEN FIXTURE AT SIXTEEN EXISTING MACROBLOCK ADDRESSES; ADDRESS AND TOKEN PERMUTATION REMAIN TYPE-SEPARATE',pass:audits.length===16&&new Set(blocks).size===16&&audits.every(audit=>audit.pass)};
  }

  function q3dState(mode='home',block='B12'){
    const routes={home:[],q:[['Q',1]],d:[['D',1]],qd:[['Q',1],['D',1]],dq:[['D',1],['Q',1]],return:[['Q',1],['D',1],['D',-1],['Q',-1]]};
    if(!Object.hasOwn(routes,mode))throw new Error('Q3D mode must be home, q, d, qd, dq or return');
    const audit=q3dAudit(block),operations=routes[mode],cells=q3dRun(operations),route=operations.length?operations.map(([rail,direction])=>rail+(direction===1?'+':'−')).join(' → '):'HOME';
    const returned=cells.join(',')===audit.source.join(','),composedRoute=mode==='home'?'B00 → '+block:mode==='return'?'B00 → '+block+' → '+route+' → B00':'B00 → '+block+' → '+route;
    return {...audit,mode,operations:operations.map(item=>item.slice()),cells,route,composedRoute,returned,status:mode==='return'?'EXACT COMPOSED RETURN · '+block+' → B00':mode==='home'?'HOME · '+block+' · 3×3':block+' · '+route};
  }

  function addressLock(){
    const joined=concatenateAddress('V',1,9),stepped=successorAddress(joined),checksum=axisChecksum(12);
    return {split:['V1','V9'],joined,stepped,returned:{carrier:'M',value:checksum,operation:'CHECKSUM_RETURN',label:'M'+checksum},axisA:AXIS_A.map(alphaAddress),axisB:AXIS_B.map(alphaAddress),reserved:['Y','Z'].map(alphaAddress),pass:joined.label==='V19'&&stepped.label==='W19'&&checksum===78&&alphaAddress('T').label==="T8'"};
  }

  function evaluate(move='home'){
    const contract=MOVES[move]||MOVES.home;
    const durer=contract.transform(DURER),khajuraho=contract.transform(KHAJURAHO);
    const q=qAudit(durer),d=dAudit(khajuraho);
    return {move:MOVES[move]?move:'home',label:contract.label,detail:contract.detail,durer,khajuraho,q,d,className:q.pass&&d.pass?'both':q.pass?'q':d.pass?'d':'neither'};
  }

  function verify(){
    const p11=packingAudit(11),p12=packingAudit(12);
    const expected={home:'both',both:'both',q:'q',d:'d',neither:'neither'};
    const moves=Object.keys(expected).map(move=>({move,result:evaluate(move)}));
    const lock=addressLock(),grammar=addressGrammarV2(),compositeAddresses=compositeAddressContract(),steering=steeringContract(),loShu=loShuAudit(),heptadCrosswalk=heptadCrosswalkContract(),alignment=alignmentAudit(),dualRoute=dualRouteAudit(),dualRouteRegister=dualRouteRegisterAudit(),elevatorWorld=elevatorWorldContract(),q3d=q3dAudit(),q3dRegister=q3dRegisterAudit(),q3dRubik=q3dRubikAudit(),q3dRubikRegister=q3dRubikRegisterAudit(),q3dEdgeRubik=q3dEdgeRubikAudit(),q3dEdgeRubikRegister=q3dEdgeRubikRegisterAudit();
    return {pass:p11.volumeQuotient===49&&p11.volumeRemainder===8&&p11.spatialCount===27&&p11.spatialRemainder===602&&p12.volumeQuotient===64&&p12.volumeRemainder===0&&p12.spatialCount===64&&p12.spatialRemainder===0&&moves.every(item=>item.result.className===expected[item.move])&&lock.pass&&grammar.pass&&compositeAddresses.pass&&steering.pass&&loShu.pass&&heptadCrosswalk.pass&&alignment.centerPass&&alignment.axisPass&&!alignment.hingePass&&!alignment.threeAnchorPass&&dualRoute.pass&&dualRoute.sameEndpoint&&dualRoute.distinctIntermediate&&dualRoute.qReturnsHome&&dualRoute.dReturnsHome&&dualRoute.turnReturn===0&&!dualRoute.fieldIdentityMerged&&dualRouteRegister.pass&&elevatorWorld.pass&&q3d.pass&&q3dRegister.pass&&q3dRubik.pass&&q3dRubikRegister.pass&&q3dEdgeRubik.pass&&q3dEdgeRubikRegister.pass,p11,p12,moves,addressLock:lock,addressGrammarV2:grammar,compositeAddresses,steering,loShu,heptadCrosswalk,alignment,dualRoute,dualRouteRegister,elevatorWorld,q3d,q3dRegister,q3dRubik,q3dRubikRegister,q3dEdgeRubik,q3dEdgeRubikRegister};
  }

  function matrixHtml(matrix,label){
    return '<div class="rqdc-matrix" role="img" aria-label="'+label+'">'+matrix.flat().map(value=>'<span>'+value+'</span>').join('')+'</div>';
  }

  function cubeSvg(result){
    let nodes='',edges='';
    const point=(x,y,z)=>({x:238+(x-z)*31,y:55+(x+z)*14+y*31});
    for(let x=0;x<4;x++)for(let y=0;y<4;y++)for(let z=0;z<4;z++){
      const p=point(x,y,z);
      nodes+='<circle cx="'+p.x+'" cy="'+p.y+'" r="3"/>';
      if(x<3){const q=point(x+1,y,z);edges+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'"/>';}
      if(y<3){const q=point(x,y+1,z);edges+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'"/>';}
      if(z<3){const q=point(x,y,z+1);edges+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'"/>';}
    }
    return '<svg viewBox="0 0 480 310" role="img" aria-label="4 mal 4 mal 4 Makrogitter mit Q- und D-Schnittebene">'+
      '<polygon class="rqdc-plane rqdc-plane-q" points="145,97 238,139 238,232 145,190"/>'+
      '<polygon class="rqdc-plane rqdc-plane-d" points="238,139 331,97 331,190 238,232"/>'+
      '<g class="rqdc-edges">'+edges+'</g><g class="rqdc-nodes">'+nodes+'</g>'+
      '<text x="76" y="84">Q · DÜRER</text><text x="337" y="84">D · KHAJURAHO</text><text x="171" y="290">12³ = (4 · 3)³ = 64 · 27</text>'+
      '<text class="rqdc-svg-state" x="238" y="27" text-anchor="middle">'+result.label+' · '+result.className.toUpperCase()+'</text></svg>';
  }

  function render(root,move){
    const result=evaluate(move);
    root.dataset.move=result.move;
    root.querySelectorAll('[data-rqdc-move]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcMove===result.move)));
    root.querySelector('[data-rqdc-cube]').innerHTML=cubeSvg(result);
    root.querySelector('[data-rqdc-q-matrix]').innerHTML=matrixHtml(result.durer,'Dürer Q-Platte nach '+result.label);
    root.querySelector('[data-rqdc-d-matrix]').innerHTML=matrixHtml(result.khajuraho,'Khajuraho D-Platte nach '+result.label);
    root.querySelector('[data-rqdc-q-state]').textContent=result.q.pass?'Q PASS':'Q FAIL';
    root.querySelector('[data-rqdc-d-state]').textContent=result.d.pass?'D PASS':'D FAIL';
    root.querySelector('[data-rqdc-class]').textContent=result.className==='both'?'BOTH · 34 RETAINED':result.className==='q'?'Q ONLY':result.className==='d'?'D ONLY':'NEITHER';
    root.querySelector('[data-rqdc-class]').className='rqdc-class is-'+result.className;
    root.querySelector('[data-rqdc-detail]').textContent=result.detail+'. Q prüft Zeilen, Spalten und zwei Hauptdiagonalen; D prüft alle gebrochenen Diagonalen und alle toroidalen 2×2-Fenster.';
  }

  function renderAddress(root,state='split'){
    const contract=ADDRESS_STATES[state]||ADDRESS_STATES.split;
    root.querySelectorAll('[data-rqdc-address-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcAddressState===state)));
    root.querySelector('[data-rqdc-address-output]').innerHTML=contract.tokens.map(token=>'<b>'+token+'</b>').join('<i>+</i>');
    root.querySelector('[data-rqdc-address-detail]').textContent=contract.detail;
    root.querySelector('[data-rqdc-address-result]').textContent=contract.label;
  }

  function grammarSvg(state='t1'){
    const contract=GRAMMAR_STATES[state]||GRAMMAR_STATES.t1;
    const positions={t1:{x:174,y:116,mx:174,my:145},t2:{x:255,y:178,mx:230,my:196},t3:{x:322,y:105,mx:304,my:133}};
    const p=positions[state]||positions.t1;
    return '<svg viewBox="0 0 520 290" role="img" aria-label="Address Grammar V2 Angle-Hinge view '+contract.label+'">'+
      '<title>Address Grammar V2 · '+contract.time+' · '+contract.label+'</title><desc>Runde Außenschale um ein quadratisches Frame. Eine violette View-Spur kreuzt eine grüne Schnittachse. Zwei große Pins und drei kleine Punkte bleiben getrennte Rollen.</desc>'+
      '<circle class="rqdc-g2-shell" cx="260" cy="145" r="116"/><rect class="rqdc-g2-frame" x="150" y="55" width="220" height="180"/>'+
      '<path class="rqdc-g2-purple" d="M95 235 C118 106 205 65 405 48"/><path class="rqdc-g2-green" d="M78 207 H442"/>'+
      '<line class="rqdc-g2-hinge" x1="260" y1="145" x2="'+p.x+'" y2="'+p.y+'"/><circle class="rqdc-g2-major" cx="260" cy="145" r="10"/><circle class="rqdc-g2-major alt" cx="'+p.x+'" cy="'+p.y+'" r="8"/>'+
      '<circle class="rqdc-g2-micro" cx="'+p.mx+'" cy="'+p.my+'" r="3"/><circle class="rqdc-g2-micro" cx="'+p.mx+'" cy="'+(p.my+12)+'" r="2.4"/><circle class="rqdc-g2-micro" cx="'+p.mx+'" cy="'+(p.my+23)+'" r="1.8"/>'+
      '<text class="rqdc-g2-label" x="260" y="25" text-anchor="middle">'+contract.time.toUpperCase()+' · '+contract.label+'</text><text class="rqdc-g2-label small" x="260" y="276" text-anchor="middle">ROUND SHELL · SQUARE FRAME · PURPLE VIEW × GREEN CUT · ị</text></svg>';
  }

  function renderGrammar(root,state='t1'){
    const contract=GRAMMAR_STATES[state]||GRAMMAR_STATES.t1;
    root.querySelectorAll('[data-rqdc-grammar-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcGrammarState===state)));
    root.querySelector('[data-rqdc-grammar-svg]').innerHTML=grammarSvg(state);
    root.querySelector('[data-rqdc-grammar-result]').textContent=contract.label;
    root.querySelector('[data-rqdc-grammar-detail]').textContent=contract.detail;
    root.querySelector('[data-rqdc-grammar-pin]').textContent=contract.pin+' · ị RETURN VIEW';
  }

  function steeringSvg(code='000'){
    const state=steeringState(code),point=bits=>({x:205+Number(bits[0])*118-Number(bits[2])*72,y:226-Number(bits[1])*118-Number(bits[2])*46+Number(bits[0])*14});
    const vertices=STEERING_CODES.map(item=>item.code),origin=point('000'),target=point(state.code);
    let edges='',nodes='';
    vertices.forEach(value=>{
      const p=point(value);
      value.split('').forEach((bit,index)=>{
        if(bit==='0'){
          const next=value.slice(0,index)+'1'+value.slice(index+1),q=point(next);
          edges+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'"/>';
        }
      });
      nodes+='<circle class="'+(value===state.code?'is-active':'')+'" cx="'+p.x+'" cy="'+p.y+'" r="'+(value===state.code?7:4)+'"/><text x="'+(p.x+7)+'" y="'+(p.y-7)+'">'+value+'</text>';
    });
    const vector=state.code==='000'?'<circle class="rqdc-steer-home" cx="'+origin.x+'" cy="'+origin.y+'" r="13"/>':'<line class="rqdc-steer-vector" x1="'+origin.x+'" y1="'+origin.y+'" x2="'+target.x+'" y2="'+target.y+'" marker-end="url(#rqdcSteerArrow)"/>';
    return '<svg viewBox="0 0 420 300" role="img" aria-label="Binary cube steering '+state.code+' '+state.label+'"><title>7-Way Cube Steering · '+state.code+' · '+state.label+'</title><desc>Acht binäre Cube-Zustände mit 000 als Home. Der aktive Code kehrt durch XOR mit sich selbst exakt zu 000 zurück.</desc><defs><marker id="rqdcSteerArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><g class="rqdc-steer-edges">'+edges+'</g>'+vector+'<g class="rqdc-steer-nodes">'+nodes+'</g><text class="rqdc-steer-caption" x="210" y="286" text-anchor="middle">000 ⊕ '+state.code+' → '+state.code+' · '+state.code+' ⊕ '+state.code+' → 000</text></svg>';
  }

  function renderSteering(root,code='000'){
    const state=steeringState(code);
    root.querySelectorAll('[data-rqdc-steering-code]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcSteeringCode===state.code)));
    root.querySelector('[data-rqdc-steering-svg]').innerHTML=steeringSvg(state.code);
    root.querySelector('[data-rqdc-steering-result]').textContent=state.code+' · '+state.role.replace('_',' ');
    root.querySelector('[data-rqdc-steering-route]').textContent=state.route.join(' → ');
    root.querySelector('[data-rqdc-steering-detail]').textContent=state.label+' · Hamming-Gewicht '+state.weight+'. Derselbe Drei-Bit-Code ist sein eigener XOR-Return nach 000.';
  }

  function loShuSvg(lineId='D1'){
    const state=loShuState(lineId),active=new Set(state.cells.map(cell=>cell.join(':')));
    let cells='';
    LO_SHU.forEach((row,rowIndex)=>row.forEach((value,columnIndex)=>{
      const x=60+columnIndex*82,y=38+rowIndex*82,key=rowIndex+':'+columnIndex;
      cells+='<rect class="'+(active.has(key)?'is-active ':'')+(value===5?'is-center':'')+'" x="'+x+'" y="'+y+'" width="70" height="70" rx="9"/><text x="'+(x+35)+'" y="'+(y+45)+'" text-anchor="middle">'+value+'</text>';
    }));
    return '<svg viewBox="0 0 330 310" role="img" aria-label="Lo Shu line '+state.lineId+' '+state.equation+'"><title>Lo Shu Center-5 Comparator · '+state.lineId+'</title><desc>Neun Felder mit Zentrum 5. Die gewählte von acht Summenlinien ist markiert und ergibt 15.</desc><g class="rqdc-loshu-cells">'+cells+'</g><text class="rqdc-loshu-caption" x="165" y="298" text-anchor="middle">'+state.lineId+' · '+state.equation+'</text></svg>';
  }

  function renderLoShu(root,lineId='D1'){
    const state=loShuState(lineId);
    root.querySelectorAll('[data-rqdc-loshu-line]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcLoshuLine===state.lineId)));
    root.querySelector('[data-rqdc-loshu-svg]').innerHTML=loShuSvg(state.lineId);
    root.querySelector('[data-rqdc-loshu-result]').textContent=state.lineId+' · '+state.total+' PASS';
    root.querySelector('[data-rqdc-loshu-equation]').textContent=state.equation;
    root.querySelector('[data-rqdc-loshu-detail]').textContent=state.detail+'. Acht Linien teilen sich in 3 Reihen, 3 Spalten und 2 Diagonalen.';
  }

  function heptadCrosswalkSvg(code='100'){
    const state=heptadCrosswalkState(code),center={x:210,y:150},radius=108;
    const point=step=>{const angle=-Math.PI/2+step*Math.PI/7;return {x:center.x+Math.cos(angle)*radius,y:center.y+Math.sin(angle)*radius};};
    const primary=point(state.heptad.primaryStep),antipode=point(state.heptad.antipode);
    let nodes='';
    for(let step=0;step<14;step++){
      const p=point(step),active=step===state.heptad.primaryStep||step===state.heptad.antipode;
      nodes+='<circle class="'+(step%2===0?'is-primary ':'is-antipode ')+(active?'is-active':'')+'" cx="'+p.x+'" cy="'+p.y+'" r="'+(active?7:4)+'"/><text x="'+p.x+'" y="'+(p.y-10)+'" text-anchor="middle">'+step+'</text>';
    }
    return '<svg viewBox="0 0 420 300" role="img" aria-label="Seven-way steering to Heptad crosswalk '+state.code+' sector '+state.heptad.sector+'"><title>7-Way ↔ Heptad 14 · '+state.code+'</title><desc>Ein deklarierter nichtleerer Cube-Code ist genau einem primären Heptad-Schritt und dessen Antipoden zugeordnet. Root 7 bleibt ein getrennter Normkontrollwert.</desc><circle class="rqdc-hx-ring" cx="210" cy="150" r="108"/><line class="rqdc-hx-pair" x1="'+primary.x+'" y1="'+primary.y+'" x2="'+antipode.x+'" y2="'+antipode.y+'"/><g class="rqdc-hx-nodes">'+nodes+'</g><circle class="rqdc-hx-zero" cx="210" cy="150" r="6"/><text class="rqdc-hx-zero-label" x="222" y="154">O₀</text><text class="rqdc-hx-caption" x="210" y="287" text-anchor="middle">'+state.code+' → H'+state.index+' → n'+state.heptad.primaryStep+' ↔ n'+state.heptad.antipode+' · Z₇ '+state.heptad.sector+'</text></svg>';
  }

  function dispatchHeptadSelection(step){
    if(typeof document==='undefined')return false;
    const host=document.getElementById('heptad14Orientation');
    const mode14=host&&host.querySelector('[data-h14-mode="14"]');
    const zero=host&&host.querySelector('[data-h14-step="zero"]');
    const next=host&&host.querySelector('[data-h14-step="next"]');
    if(mode14&&zero&&next){
      mode14.click();
      zero.click();
      for(let index=0;index<step;index++)next.click();
      return true;
    }
    const detail={step,mode:14,source:'RUBIK_QDC_CROSSWALK'};
    let event;
    if(typeof CustomEvent==='function')event=new CustomEvent('a0:heptad14-select',{detail});
    else{
      event=document.createEvent('CustomEvent');
      event.initCustomEvent('a0:heptad14-select',false,false,detail);
    }
    return document.dispatchEvent(event);
  }

  function renderHeptadCrosswalk(root,code='100'){
    const state=heptadCrosswalkState(code);
    root.querySelectorAll('[data-rqdc-heptad-code]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcHeptadCode===state.code)));
    root.querySelector('[data-rqdc-heptad-svg]').innerHTML=heptadCrosswalkSvg(state.code);
    root.querySelector('[data-rqdc-heptad-result]').textContent=state.code+' · H'+state.index+' · n'+state.heptad.primaryStep+'↔n'+state.heptad.antipode;
    root.querySelector('[data-rqdc-heptad-route]').textContent=state.route.join(' → ');
    root.querySelector('[data-rqdc-heptad-detail]').textContent=state.steering.label+' · '+state.heptad.archetype+' · Z₇-Sektor '+state.heptad.sector+' · θ='+state.heptad.primaryTheta+'. Gegenpunkt θ′='+state.heptad.antipodeTheta+'.';
    dispatchHeptadSelection(state.heptad.primaryStep);
  }

  function alignmentSvg(mode='source'){
    const state=alignmentState(mode),hingeY=150+state.displayHingeOffset*108;
    return '<svg viewBox="0 0 420 300" role="img" aria-label="J-LUV Kite Teapot question and Red Balloon three-anchor alignment '+state.mode+'"><title>Drei-Anker-Alignment · '+state.mode+'</title><desc>Mittelpunkt und vertikale Spitzenachse decken sich. Der J-LUV-Bügel bleibt im Quellenmodus um fünf Zweiundachtzigstel versetzt.</desc><defs><marker id="rqdcAlignArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z"/></marker></defs><path class="rqdc-align-shell" d="M210 35 340 150 290 205H130l-50-55z"/><path class="rqdc-align-kite" d="M210 35 340 150 210 150 80 150z M210 35v170 M80 150h260 M130 205l80-55 80 55"/><path class="rqdc-align-star" d="M210 42 275 235 105 112 315 112 145 235z"/><line class="rqdc-align-axis" x1="210" y1="252" x2="210" y2="35" marker-end="url(#rqdcAlignArrow)"/><line class="rqdc-align-reference" x1="72" y1="150" x2="348" y2="150"/><line class="rqdc-align-hinge" x1="72" y1="'+hingeY+'" x2="348" y2="'+hingeY+'"/><circle class="rqdc-align-balloon" cx="210" cy="150" r="10"/><circle class="rqdc-align-tip" cx="210" cy="35" r="9"/><text class="rqdc-align-label" x="220" y="143">RED BALLOON · CENTER WITNESS</text><text class="rqdc-align-label" x="220" y="29">TIP / ↑</text><text class="rqdc-align-label" x="78" y="'+(hingeY+17)+'">BRONZE HINGE · '+state.displayRatio+'</text><text class="rqdc-align-caption" x="210" y="286" text-anchor="middle">KITE / TEAPOT? · TWO ANCHORS PASS · THREE-ANCHOR IDENTITY REJECTED</text></svg>';
  }

  function renderAlignment(root,mode='source'){
    const state=alignmentState(mode);
    root.querySelectorAll('[data-rqdc-alignment-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcAlignmentMode===state.mode)));
    root.querySelector('[data-rqdc-alignment-svg]').innerHTML=alignmentSvg(state.mode);
    root.querySelector('[data-rqdc-alignment-result]').textContent=state.mode==='source'?'2 PASS · HINGE 5/82 OPEN':'FORCED SNAP · CONTROL ONLY';
    root.querySelector('[data-rqdc-alignment-detail]').textContent=state.status.replaceAll('_',' ');
  }

  function dualRouteSvg(mode='both',block='B12'){
    const state=dualRouteState(mode,block),cell=54,ox=72,oy=24;
    const center=point=>[ox+point[1]*cell+cell/2,oy+point[0]*cell+cell/2];
    let grid='';
    for(let row=0;row<4;row++)for(let column=0;column<4;column++){
      const active=row===state.fixture.macro[0]&&column===state.fixture.macro[1];
      grid+='<rect class="rqdc-dual-cell'+(active?' is-target':'')+'" x="'+(ox+column*cell)+'" y="'+(oy+row*cell)+'" width="'+cell+'" height="'+cell+'"/><text class="rqdc-dual-cell-label" x="'+(ox+column*cell+7)+'" y="'+(oy+row*cell+14)+'">B'+row+column+'</text>';
    }
    const poly=trace=>trace.map(point=>center(point).join(',')).join(' ');
    const q=state.showQ?'<polyline class="rqdc-dual-route q" points="'+poly(state.qTrace)+'"/>':'';
    const d=state.showD?'<polyline class="rqdc-dual-route d" points="'+poly(state.dTrace)+'"/>':'';
    const end=center(state.returning?[0,0]:state.fixture.macro),footprint=state.fixture.unitFootprint;
    return '<svg viewBox="0 0 420 280" role="img" aria-label="Q and D dual route to the same '+block+' macroblock '+state.mode+'"><title>Q/D Dual Route · '+block+' · '+state.mode+'</title><desc>Q und D adressieren denselben 3 mal 3 Makroblock '+block+' über getrennte Displayrouten. Ihre Plattenfelder bleiben verschieden.</desc>'+grid+q+d+'<circle class="rqdc-dual-end" cx="'+end[0]+'" cy="'+end[1]+'" r="8"/><text class="rqdc-dual-legend q" x="310" y="55">Q · R/C · '+state.fixture.qValue+'</text><text class="rqdc-dual-legend d" x="310" y="78">D · WRAP · '+state.fixture.dValue+'</text><text class="rqdc-dual-meta" x="310" y="112">'+block+'</text><text class="rqdc-dual-meta" x="310" y="132">ROWS '+footprint.humanRows+'</text><text class="rqdc-dual-meta" x="310" y="152">COLS '+footprint.humanColumns+'</text><text class="rqdc-dual-meta" x="310" y="192">TURN '+state.layerQuarterTurns+'</text><text class="rqdc-dual-caption" x="210" y="264" text-anchor="middle">'+state.displayStatus+'</text></svg>';
  }

  function renderDualRoute(root,mode='both',block){
    const section=root.querySelector('.rqdc-dual-route'),selectedBlock=block||section.dataset.rqdcDualBlock||'B12',state=dualRouteState(mode,selectedBlock),fixture=state.fixture;
    section.dataset.rqdcDualBlock=fixture.block;
    root.querySelectorAll('[data-rqdc-dual-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcDualMode===state.mode)));
    root.querySelectorAll('button[data-rqdc-dual-block]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcDualBlock===fixture.block)));
    root.querySelector('[data-rqdc-dual-svg]').innerHTML=dualRouteSvg(state.mode,fixture.block);
    root.querySelector('[data-rqdc-dual-result]').textContent=state.displayStatus;
    root.querySelector('[data-rqdc-dual-title]').textContent='Zwei Plattenansichten adressieren denselben Block '+fixture.block+'.';
    root.querySelector('[data-rqdc-dual-footprint]').textContent='Einheitszeilen '+fixture.unitFootprint.humanRows+' · Spalten '+fixture.unitFootprint.humanColumns;
    root.querySelector('[data-rqdc-dual-q]').textContent='R'+fixture.macro[0]+'C'+fixture.macro[1]+' = '+fixture.qValue;
    root.querySelector('[data-rqdc-dual-d]').textContent='R'+fixture.macro[0]+'C'+fixture.macro[1]+' = '+fixture.dValue;
    root.querySelector('[data-rqdc-dual-target]').textContent=fixture.block+' · 3×3';
    root.querySelector('[data-rqdc-dual-detail]').textContent=state.returning?'Q und D schließen von '+fixture.block+' getrennt auf B00; +1 und −1 ergeben Turn 0 mod 4.':'Q '+qRouteKey(fixture.qRoute)+' · D '+qRouteKey(fixture.dRoute)+' · Ziel '+fixture.block+'.';
  }

  function renderQ3d(root,mode='home',block){
    const section=root.querySelector('.rqdc-q3d');
    if(!section)return;
    const selectedBlock=block||section.dataset.rqdcQ3dBlock||'B12',state=q3dState(mode,selectedBlock),activeQ=state.operations.some(item=>item[0]==='Q'),activeD=state.operations.some(item=>item[0]==='D');
    section.dataset.rqdcQ3dBlock=state.target;
    section.querySelectorAll('[data-rqdc-q3d-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcQ3dMode===state.mode)));
    section.querySelectorAll('[data-rqdc-q3d-block]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcQ3dBlock===state.target)));
    section.querySelector('[data-rqdc-q3d-grid]').innerHTML=state.cells.map((value,index)=>'<span class="'+(Q3D_RAILS.Q.includes(index)&&Q3D_RAILS.D.includes(index)?'is-both':Q3D_RAILS.Q.includes(index)?'is-q':Q3D_RAILS.D.includes(index)?'is-d':'')+'"><b>'+value+'</b><small>'+String.fromCharCode(65+index)+'</small></span>').join('');
    section.querySelector('[data-rqdc-q3d-grid]').className='rqdc-q3d-grid'+(activeQ?' has-q':'')+(activeD?' has-d':'');
    section.querySelector('[data-rqdc-q3d-status]').textContent=state.status;
    section.querySelector('[data-rqdc-q3d-route]').textContent=state.route;
    section.querySelector('[data-rqdc-q3d-center]').textContent='E / '+state.cells[4];
    section.querySelector('[data-rqdc-q3d-order]').textContent=state.nonCommutative?'Q→D ≠ D→Q':'ORDER COLLISION';
    section.querySelector('[data-rqdc-q3d-target]').textContent=state.target+' · 3×3';
    section.querySelector('[data-rqdc-q3d-composed]').textContent=state.composedRoute;
    const rubikTarget=root.querySelector('[data-rqdc-q3d-rubik-target]');
    if(rubikTarget)rubikTarget.textContent=state.target+' · REJECTED / TOKEN RETURN PASS';
    const edgeTarget=root.querySelector('[data-rqdc-q3d-edge-target]');
    if(edgeTarget)edgeTarget.textContent=state.target+' · LEGAL / 54-FACELET PASS';
  }

  function renderElevatorWorld(root,n=0){
    const state=elevatorWorldCrosswalk(Number(n)),section=root.querySelector('.rqdc-elevator-world');
    if(!section)return;
    section.querySelector('[data-rqdc-elevator-input]').value=String(state.n);
    section.querySelector('[data-rqdc-elevator-n]').textContent=String(state.n);
    section.querySelector('[data-rqdc-elevator-grid]').textContent='('+state.grid.row+', '+state.grid.column+')';
    section.querySelector('[data-rqdc-elevator-packet]').textContent=state.packet.label+(state.packet.isCap?' · CAP':'');
    section.querySelector('[data-rqdc-elevator-return]').textContent=String(state.returned);
    section.querySelector('[data-rqdc-elevator-state]').textContent=state.pass?'EXACT RETURN · PASS':'RETURN · FAIL';
  }

  function mount(){
    document.querySelectorAll('[data-rubik-qdc]').forEach(root=>{
      if(root.dataset.mounted==='true')return;
      root.dataset.mounted='true';
      root.querySelectorAll('[data-rqdc-move]').forEach(button=>button.addEventListener('click',()=>render(root,button.dataset.rqdcMove)));
      root.querySelectorAll('[data-rqdc-address-state]').forEach(button=>button.addEventListener('click',()=>renderAddress(root,button.dataset.rqdcAddressState)));
      root.querySelectorAll('[data-rqdc-grammar-state]').forEach(button=>button.addEventListener('click',()=>renderGrammar(root,button.dataset.rqdcGrammarState)));
      root.querySelectorAll('[data-rqdc-steering-code]').forEach(button=>button.addEventListener('click',()=>renderSteering(root,button.dataset.rqdcSteeringCode)));
      root.querySelectorAll('[data-rqdc-loshu-line]').forEach(button=>button.addEventListener('click',()=>renderLoShu(root,button.dataset.rqdcLoshuLine)));
      root.querySelectorAll('[data-rqdc-heptad-code]').forEach(button=>button.addEventListener('click',()=>renderHeptadCrosswalk(root,button.dataset.rqdcHeptadCode)));
      root.querySelectorAll('[data-rqdc-alignment-mode]').forEach(button=>button.addEventListener('click',()=>renderAlignment(root,button.dataset.rqdcAlignmentMode)));
      root.querySelectorAll('[data-rqdc-dual-mode]').forEach(button=>button.addEventListener('click',()=>renderDualRoute(root,button.dataset.rqdcDualMode)));
      root.querySelectorAll('button[data-rqdc-dual-block]').forEach(button=>button.addEventListener('click',()=>{const active=root.querySelector('[data-rqdc-dual-mode][aria-pressed="true"]');renderDualRoute(root,active?active.dataset.rqdcDualMode:'both',button.dataset.rqdcDualBlock);}));
      root.querySelectorAll('[data-rqdc-q3d-mode]').forEach(button=>button.addEventListener('click',()=>renderQ3d(root,button.dataset.rqdcQ3dMode)));
      root.querySelectorAll('[data-rqdc-q3d-block]').forEach(button=>button.addEventListener('click',()=>{const active=root.querySelector('[data-rqdc-q3d-mode][aria-pressed="true"]');renderQ3d(root,active?active.dataset.rqdcQ3dMode:'home',button.dataset.rqdcQ3dBlock);}));
      root.querySelectorAll('[data-rqdc-elevator-input]').forEach(input=>input.addEventListener('input',()=>renderElevatorWorld(root,input.value)));
      root.querySelectorAll('[data-rqdc-elevator-preset]').forEach(button=>button.addEventListener('click',()=>renderElevatorWorld(root,button.dataset.rqdcElevatorPreset)));
      root.querySelector('[data-rqdc-reset]').addEventListener('click',()=>render(root,'home'));
      render(root,'home');
      renderAddress(root,'split');
      renderGrammar(root,'t1');
      renderSteering(root,'000');
      renderLoShu(root,'D1');
      renderHeptadCrosswalk(root,'100');
      renderAlignment(root,'source');
      renderDualRoute(root,'both');
      renderQ3d(root,'home');
      renderElevatorWorld(root,0);
    });
  }

  return {MAGIC,DURER,KHAJURAHO,LO_SHU,LO_SHU_LINES,HEPTAD_ARCHETYPES,HEPTAD_CROSSWALK_CODES,ROOT7_CONTROL,ALIGNMENT_PROFILES,DUAL_ROUTE_REGISTER,DUAL_ROUTE_FIXTURE,Q3D_SOURCE,Q3D_RAILS,Q3D_POSITION_TYPES,RUBIK_GENERATOR_CLASSES,Q3D_EDGE_RAILS,Q3D_EDGE_FACELETS,Q3D_EDGE_SEQUENCES,AXIS_A,AXIS_B,ADDRESS_STATES,GRAMMAR_STATES,STEERING_CODES,MOVES,clone,rotate90,permuteCols,shiftAllRows,shiftFirstRow,qAudit,dAudit,loShuAudit,loShuState,heptadCrosswalkState,heptadCrosswalkCode,heptadCrosswalkContract,alignmentAudit,alignmentState,macroblockFootprint,buildDualRouteFixture,dualRouteFixture,qRouteKey,dualRouteAudit,dualRouteRegisterAudit,dualRouteState,q3dApply,q3dRun,q3dCycle,q3dRubikFeasibility,q3dRubikAudit,q3dRubikRegisterAudit,q3dEdgeApply,q3dEdgeCycle,q3dEdgeSequence,q3dEdgeRubikFeasibility,q3dEdgeRubikAudit,q3dEdgeRubikRegisterAudit,q3dAudit,q3dRegisterAudit,q3dState,packingAudit,elevatorGridAddress,cubePacketAddress,returnCubePacket,elevatorWorldCrosswalk,elevatorWorldContract,alphaAddress,concatenateAddress,successorAddress,axisChecksum,parseAddressToken,compositeAddressContract,rotateGlyph,reverseFixed,mirrorAddress,offsetAddress,addressLock,addressGrammarV2,normalizeSteeringCode,steeringWeight,steeringClass,xorSteering,steeringState,steeringContract,evaluate,verify,cubeSvg,grammarSvg,steeringSvg,loShuSvg,heptadCrosswalkSvg,alignmentSvg,dualRouteSvg,dispatchHeptadSelection,mount};
});
