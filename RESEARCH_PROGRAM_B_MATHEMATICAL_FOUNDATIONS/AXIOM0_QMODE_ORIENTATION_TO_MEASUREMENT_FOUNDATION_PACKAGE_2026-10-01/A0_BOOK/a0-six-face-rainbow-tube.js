(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0SixFaceRainbowTube=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.2.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const CLASSIFICATION='BOUNDED_FINITE_CUBE_PERMUTATION_VIEW';
  const FACES=Object.freeze(['U','D','L','R','F','B']);
  const FACE_PAIRS=Object.freeze([Object.freeze(['U','D']),Object.freeze(['L','R']),Object.freeze(['F','B'])]);
  const COLORS=Object.freeze({U:'#f7f3df',D:'#ffd43b',L:'#ff9f1c',R:'#ef476f',F:'#25c6da',B:'#8c63ff'});
  const COMMUTATOR=Object.freeze(['R','U',"R'","U'"]);
  const GOLD_WORD=Object.freeze(['R','F','L',"U'"]);
  const GOLD_ADDRESSES=Object.freeze(['D2','B2','R2']);
  const ALGO_WORD=COMMUTATOR;
  const PAIR_ADDRESS='R2';
  const SPLIT_SOURCE='2-3-1';
  const QUARTER_TURNS=Object.freeze(['U',"U'",'D',"D'",'L',"L'",'R',"R'",'F',"F'",'B',"B'"]);

  const key=(p,n)=>`${p.join(',')}|${n.join(',')}`;
  function slot(face,row,col){
    let position,normal;
    if(face==='F'){position=[col-1,1-row,1];normal=[0,0,1]}
    if(face==='B'){position=[1-col,1-row,-1];normal=[0,0,-1]}
    if(face==='U'){position=[col-1,1,row-1];normal=[0,1,0]}
    if(face==='D'){position=[col-1,-1,1-row];normal=[0,-1,0]}
    if(face==='R'){position=[1,1-row,1-col];normal=[1,0,0]}
    if(face==='L'){position=[-1,1-row,col-1];normal=[-1,0,0]}
    return Object.freeze({face,row,col,position:Object.freeze(position),normal:Object.freeze(normal),address:`${face}${row*3+col+1}`});
  }
  const SLOTS=Object.freeze(FACES.flatMap(face=>Array.from({length:9},(_,index)=>slot(face,Math.floor(index/3),index%3))));
  const SLOT_INDEX=new Map(SLOTS.map((item,index)=>[key(item.position,item.normal),index]));
  const SOLVED=Object.freeze(SLOTS.map((_,index)=>index));
  const TRAPDOOR_STICKERS=Object.freeze(FACES.map(face=>SLOTS.findIndex(item=>item.face===face&&item.row===0&&item.col===1)));

  function rotateVector(vector,axis,direction){
    const [x,y,z]=vector;
    if(axis==='x')return direction>0?[x,-z,y]:[x,z,-y];
    if(axis==='y')return direction>0?[z,y,-x]:[-z,y,x];
    return direction>0?[-y,x,z]:[y,-x,z];
  }
  const MOVE_DEF=Object.freeze({
    U:Object.freeze({axis:'y',layer:1,direction:1}),D:Object.freeze({axis:'y',layer:-1,direction:-1}),
    R:Object.freeze({axis:'x',layer:1,direction:1}),L:Object.freeze({axis:'x',layer:-1,direction:-1}),
    F:Object.freeze({axis:'z',layer:1,direction:-1}),B:Object.freeze({axis:'z',layer:-1,direction:1})
  });
  function parseMove(move){
    const token=String(move).toUpperCase(),face=token[0],base=MOVE_DEF[face];
    if(!base||!/^[UDLRFB]'?$/.test(token))throw new RangeError(`Unknown cube move ${move}`);
    return Object.freeze({...base,face,direction:token.endsWith("'")?-base.direction:base.direction,token});
  }
  function applyMove(state,move){
    const def=parseMove(move),axisIndex={x:0,y:1,z:2}[def.axis],next=state.slice();
    SLOTS.forEach((source,index)=>{
      if(source.position[axisIndex]!==def.layer)return;
      const position=rotateVector(source.position,def.axis,def.direction);
      const normal=rotateVector(source.normal,def.axis,def.direction);
      const target=SLOT_INDEX.get(key(position,normal));
      if(target===undefined)throw new Error(`Unmapped slot ${key(position,normal)}`);
      next[target]=state[index];
    });
    return Object.freeze(next);
  }
  function applySequence(state,moves){return moves.reduce((next,move)=>applyMove(next,move),state)}
  function inverseSequence(moves){return Object.freeze([...moves].reverse().map(move=>move.endsWith("'")?move.slice(0,-1):`${move}'`))}
  function isSolved(state){return state.every((sticker,index)=>sticker===index)}
  function colorCounts(state){return Object.freeze(FACES.reduce((out,face)=>{out[face]=state.filter(id=>SLOTS[id].face===face).length;return out},{}))}
  function isBijection(state){return state.length===54&&new Set(state).size===54&&state.every(id=>Number.isInteger(id)&&id>=0&&id<54)}
  function currentSlot(state,stickerId){const index=state.indexOf(stickerId);return index<0?null:SLOTS[index]}
  function permutationOrder(moves=COMMUTATOR,limit=512){
    let state=SOLVED;
    for(let order=1;order<=limit;order++){state=applySequence(state,moves);if(isSolved(state))return order}
    return null;
  }
  function stickerOrbit(stickerId=37,moves=COMMUTATOR){
    const order=permutationOrder(moves),addresses=[],seen=new Set();let state=SOLVED;
    for(let cycle=0;cycle<=order;cycle++){
      const address=currentSlot(state,stickerId).address;addresses.push(address);seen.add(address);state=applySequence(state,moves);
    }
    return Object.freeze({stickerId,origin:SLOTS[stickerId].address,order,addresses:Object.freeze(addresses),distinctAddresses:seen.size,closed:addresses[0]===addresses[addresses.length-1]});
  }
  function stickerId(address){const id=SLOTS.findIndex(item=>item.address===address);if(id<0)throw new RangeError(`Unknown facelet address ${address}`);return id}
  function trackedSignature(state,ids){return ids.map(id=>currentSlot(state,id).address).join('|')}
  function findShortestGoldWord(maxDepth=4){
    const ids=GOLD_ADDRESSES.map(stickerId),target=['B2','R2','D2'].join('|'),queue=[Object.freeze({cube:SOLVED,word:Object.freeze([])})],seen=new Set([trackedSignature(SOLVED,ids)]);
    for(let head=0;head<queue.length;head++){
      const item=queue[head];if(item.word.length>=maxDepth)continue;
      for(const move of QUARTER_TURNS){
        if(item.word.length&&item.word[item.word.length-1][0]===move[0])continue;
        const cube=applyMove(item.cube,move),signature=trackedSignature(cube,ids),word=Object.freeze([...item.word,move]);
        if(signature===target)return Object.freeze({word,depth:word.length,visited:seen.size+1,target});
        if(seen.has(signature))continue;seen.add(signature);queue.push(Object.freeze({cube,word}));
      }
    }
    return null;
  }
  function goldDiagonalAudit(){
    const ids=GOLD_ADDRESSES.map(stickerId),frames=[];let cube=SOLVED;
    for(let tick=0;tick<=3;tick++){frames.push(Object.freeze(ids.map(id=>currentSlot(cube,id).address)));if(tick<3)cube=applySequence(cube,GOLD_WORD)}
    const shortest=findShortestGoldWord(),inverse=inverseSequence(GOLD_WORD),onePass=applySequence(SOLVED,GOLD_WORD);
    return Object.freeze({word:GOLD_WORD,inverse,addresses:GOLD_ADDRESSES,frames:Object.freeze(frames),markerCycleClosed:frames[0].every((address,index)=>address===frames[3][index]),wholeCubeClosedAfterThree:isSolved(cube),wholeCubeOrder:permutationOrder(GOLD_WORD,512),inverseReturn:isSolved(applySequence(onePass,inverse)),shortestWord:shortest?shortest.word:null,shortestDepth:shortest?shortest.depth:null});
  }
  function isPrime(value){if(!Number.isInteger(value)||value<2)return false;for(let divisor=2;divisor*divisor<=value;divisor++)if(value%divisor===0)return false;return true}
  function primeIndex(value){if(!isPrime(value))return null;let index=0;for(let candidate=2;candidate<=value;candidate++)if(isPrime(candidate))index+=1;return index}
  function splitReadingAudit(){
    const left=23-1,right=2-31,index23=primeIndex(23),index31=primeIndex(31);
    return Object.freeze({source:SPLIT_SOURCE,cuts:Object.freeze([Object.freeze({tokens:Object.freeze([23,1]),expression:'(23)-1',result:left}),Object.freeze({tokens:Object.freeze([2,31]),expression:'2-(31)',result:right})]),primeIndexProjection:Object.freeze({values:Object.freeze([23,31]),indices:Object.freeze([index23,index31]),address:`${index23}|${index31}`,powerRead:`3^2|${index31}`,ownerLabel:'T9|11',compactOwnerLabel:'T911',multiplicationValue:3**2*11}),boundary:'T9|11 and T911 are address labels. 3^2|11 retains its separator; only an explicitly declared multiplication reads 3^2*11=99.'});
  }
  function twoToOneAudit(){
    const sticker=stickerId(PAIR_ADDRESS),goldMoves=Object.freeze(Array.from({length:3},()=>GOLD_WORD).flat()),algoApplications=permutationOrder(ALGO_WORD),algoMoves=Object.freeze(Array.from({length:algoApplications},()=>ALGO_WORD).flat());
    const goldCube=applySequence(SOLVED,goldMoves),algoCube=applySequence(SOLVED,algoMoves),goldAddress=currentSlot(goldCube,sticker).address,algoAddress=currentSlot(algoCube,sticker).address;
    const joinedAddress=goldAddress===PAIR_ADDRESS&&algoAddress===PAIR_ADDRESS;
    const goldReturned=applySequence(goldCube,inverseSequence(goldMoves)),algoReturned=applySequence(algoCube,inverseSequence(algoMoves));
    return Object.freeze({contract:'2_TO_1_TO_2',pinkAddress:PAIR_ADDRESS,gold:Object.freeze({word:GOLD_WORD,applications:3,quarterTurns:goldMoves.length,address:goldAddress,markerReturned:goldAddress===PAIR_ADDRESS,carrierReturned:isSolved(goldCube),inverseReturned:isSolved(goldReturned)}),algo:Object.freeze({word:ALGO_WORD,applications:algoApplications,quarterTurns:algoMoves.length,address:algoAddress,markerReturned:algoAddress===PAIR_ADDRESS,carrierReturned:isSolved(algoCube),inverseReturned:isSolved(algoReturned)}),join:Object.freeze({samePinkAddress:joinedAddress,addressGate:joinedAddress?'MATCH':'OPEN',carrierGate:joinedAddress&&isSolved(goldCube)&&isSolved(algoCube)?'CLOSED':'HOLD'}),split:Object.freeze({goldReceipt:isSolved(goldReturned),algoReceipt:isSolved(algoReturned),independentReceipts:isSolved(goldReturned)&&isSolved(algoReturned)})});
  }
  function verify(){
    let moved=SOLVED;FACES.forEach(face=>{for(let i=0;i<4;i++)moved=applyMove(moved,face)});
    const after=applySequence(SOLVED,COMMUTATOR),returned=applySequence(after,inverseSequence(COMMUTATOR)),counts=colorCounts(after),order=permutationOrder();
    const gold=goldDiagonalAudit(),pair=twoToOneAudit(),split=splitReadingAudit();
    const assertions=Object.freeze({faceCount:FACES.length===6,facelets:SLOTS.length===54,axisPairs:FACE_PAIRS.length===3,bijection:isBijection(after),colorConservation:FACES.every(face=>counts[face]===9),quarterTurnClosure:isSolved(moved),inverseReturn:isSolved(returned),commutatorNonIdentity:!isSolved(after),commutatorFiniteOrder:Number.isInteger(order)&&order>1,selectedOrbitCloses:stickerOrbit().closed,goldExactThreeCycle:gold.markerCycleClosed&&gold.frames[1].join('|')==='B2|R2|D2',goldShortestFourTurns:gold.shortestDepth===4&&gold.shortestWord.join(' ')===GOLD_WORD.join(' '),goldResidualVisible:gold.wholeCubeClosedAfterThree===false,goldInverseReturn:gold.inverseReturn,pairSamePinkAddress:pair.join.samePinkAddress,pairAddressBeforeCarrier:pair.join.addressGate==='MATCH'&&pair.join.carrierGate==='HOLD',pairIndependentReturn:pair.split.independentReceipts,splitCutsExact:split.cuts[0].result===22&&split.cuts[1].result===-29,primeIndicesExact:split.primeIndexProjection.address==='9|11'&&split.primeIndexProjection.multiplicationValue===99});
    return Object.freeze({status:Object.values(assertions).every(Boolean)?'PASS':'FAIL',assertions,commutatorOrder:order,goldDiagonal:gold,twoToOne:pair,splitReading:split,colorCounts:counts});
  }
  function createState(selectedSticker=37){return Object.freeze({cube:SOLVED,selectedSticker,moveIndex:0,cycle:0,history:Object.freeze([]),trace:Object.freeze([SLOTS[selectedSticker].address]),mode:'WEAVE'})}
  function step(state=createState()){
    const move=COMMUTATOR[state.moveIndex],cube=applyMove(state.cube,move),moveIndex=(state.moveIndex+1)%COMMUTATOR.length,cycle=state.cycle+(moveIndex===0?1:0),slotNow=currentSlot(cube,state.selectedSticker),history=Object.freeze([...state.history,move]),trace=Object.freeze([...state.trace,slotNow.address]);
    return Object.freeze({...state,cube,moveIndex,cycle,history,trace,mode:'WEAVE'});
  }
  function reset(selectedSticker=37){return createState(selectedSticker)}
  function selectNext(state=createState()){
    const current=TRAPDOOR_STICKERS.indexOf(state.selectedSticker),selectedSticker=TRAPDOOR_STICKERS[(current+1+TRAPDOOR_STICKERS.length)%TRAPDOOR_STICKERS.length];return createState(selectedSticker);
  }
  function runClosedOrbit(state=createState()){
    const order=permutationOrder(),moves=Array.from({length:order},()=>COMMUTATOR).flat(),cube=applySequence(SOLVED,moves),history=Object.freeze(moves);
    let walk=SOLVED;const trace=[SLOTS[state.selectedSticker].address];moves.forEach(move=>{walk=applyMove(walk,move);trace.push(currentSlot(walk,state.selectedSticker).address)});
    return Object.freeze({...state,cube,moveIndex:0,cycle:order,history,trace:Object.freeze(trace),mode:'RETURN'});
  }
  function runGoldDiagonal(){
    const selectedSticker=stickerId('D2'),moves=Array.from({length:3},()=>GOLD_WORD).flat();let cube=SOLVED,walk=SOLVED;const trace=['D2'];
    for(let tick=0;tick<3;tick++){walk=applySequence(walk,GOLD_WORD);trace.push(currentSlot(walk,selectedSticker).address)}
    cube=walk;
    return Object.freeze({cube,selectedSticker,moveIndex:0,cycle:3,history:Object.freeze(moves),trace:Object.freeze(trace),mode:'GOLD_TRIANGLE'});
  }
  function returnGoldDiagonal(state=runGoldDiagonal()){
    const returnMoves=inverseSequence(state.history),cube=applySequence(state.cube,returnMoves),trace=Object.freeze([...state.trace,currentSlot(cube,state.selectedSticker).address]);
    return Object.freeze({...state,cube,moveIndex:0,history:Object.freeze([...state.history,...returnMoves]),trace,mode:'GOLD_RETURN'});
  }
  function runTwoToOne(){
    const audit=twoToOneAudit(),selectedSticker=stickerId(PAIR_ADDRESS),goldMoves=Array.from({length:audit.gold.applications},()=>GOLD_WORD).flat(),algoMoves=Array.from({length:audit.algo.applications},()=>ALGO_WORD).flat(),cube=applySequence(SOLVED,goldMoves);
    return Object.freeze({cube,selectedSticker,moveIndex:0,cycle:audit.gold.applications,history:Object.freeze(goldMoves),trace:Object.freeze([PAIR_ADDRESS,audit.gold.address]),mode:'PAIR_JOIN',pair:Object.freeze({...audit,goldMoves:Object.freeze(goldMoves),algoMoves:Object.freeze(algoMoves),returned:false})});
  }
  function returnTwoToOne(state=runTwoToOne()){
    const pair=state.pair||runTwoToOne().pair,cube=applySequence(state.cube,inverseSequence(pair.goldMoves));
    return Object.freeze({...state,cube,history:Object.freeze([...state.history,...inverseSequence(pair.goldMoves)]),trace:Object.freeze([...state.trace,PAIR_ADDRESS]),mode:'PAIR_RETURN',pair:Object.freeze({...pair,returned:isSolved(cube)&&pair.algo.carrierReturned})});
  }
  function gridPosition(face,row,col){
    const origins={U:[70,45],D:[680,45],L:[70,205],R:[680,205],F:[70,365],B:[680,365]},[x,y]=origins[face],size=34;
    return{x:x+col*size,y:y+row*size,size};
  }
  function svgMarkup(state=createState()){
    const selectedSlot=currentSlot(state.cube,state.selectedSticker),orbit=stickerOrbit(state.selectedSticker),proof=verify();
    const cells=SLOTS.map((target,index)=>{const sticker=SLOTS[state.cube[index]],p=gridPosition(target.face,target.row,target.col),selected=state.cube[index]===state.selectedSticker,trapdoor=target.row===0&&target.col===1;return `<g class="sfr-cell${trapdoor?' trapdoor':''}${selected?' selected':''}"><rect x="${p.x}" y="${p.y}" width="30" height="30" rx="4" fill="${COLORS[sticker.face]}"/><text x="${p.x+15}" y="${p.y+20}" text-anchor="middle">${target.row*3+target.col+1}</text>${trapdoor?`<path class="sfr-port" d="M${p.x+15} ${p.y+4}l11 11-11 11-11-11z"/>`:''}${selected?`<circle class="sfr-payload" cx="${p.x+15}" cy="${p.y+15}" r="5"/>`:''}</g>`}).join('');
    const labels=FACE_PAIRS.map((pair,row)=>`<text class="sfr-pair" x="450" y="${90+row*160}">${pair[0]} ↔ ${pair[1]}</text>`).join('');
    const rainbow=['#ff8a22','#ffd84a','#5ee59e','#40d7ef','#8c63ff','#ff55b7'];
    const tubes=rainbow.map((color,index)=>`<path class="sfr-tube" style="stroke:${color}" d="M175 ${92+index*3} C310 ${35+index*12},355 ${250-index*7},450 280 C545 ${310+index*5},590 ${40+index*13},680 ${92+index*3}"/>`).join('');
    return `<g class="sfr-figure"><rect class="sfr-back" x="18" y="18" width="864" height="524" rx="22"/><ellipse class="sfr-tunnel" cx="450" cy="280" rx="88" ry="170"/>${tubes}<path class="sfr-pretzel" d="M330 280C330 175 450 175 450 280S570 385 570 280S450 175 450 280S330 385 330 280"/><path class="sfr-coil" d="M585 280c55-70 120-38 82 12-31 40-95 4-58-30 29-27 69 8 40 28"/><g class="sfr-gold-diagonal"><path d="M405 205L515 280L405 355Z"/><circle class="yellow" cx="405" cy="205" r="8"/><circle class="violet" cx="515" cy="280" r="8"/><circle class="red" cx="405" cy="355" r="8"/><text x="385" y="198">D2</text><text x="525" y="276">B2</text><text x="385" y="374">R2</text><text x="450" y="180" text-anchor="middle">G = R F L U⁻¹</text></g>${cells}${labels}<g class="sfr-pair-contract"><path class="gold-rail" d="M318 242Q382 236 430 270"/><path class="algo-rail" d="M582 242Q518 236 470 270"/><path class="gold-rail" d="M440 298L414 330"/><path class="algo-rail" d="M460 298L486 330"/><text x="300" y="235">GOLD</text><text x="600" y="235" text-anchor="end">ALGO</text><text x="450" y="348" text-anchor="middle">2 → R2 → 2 RECEIPTS</text></g><g class="sfr-gate" transform="translate(450 280)"><path d="M0-24L24 0 0 24-24 0Z"/><circle r="8"/><text x="0" y="4" text-anchor="middle">2</text></g><text class="sfr-side-role left" x="178" y="340">L · PUSHED →</text><text class="sfr-side-role right" x="720" y="340">R · COILED ↻</text><text class="sfr-title" x="450" y="38" text-anchor="middle">3 AXIS PAIRS · 6 FACES · 54 FACELETS</text><text class="sfr-caption" x="450" y="523" text-anchor="middle">PINK ${selectedSlot.address} · [R,U] ORDER ${proof.commutatorOrder} · GOLD ORDER ${proof.goldDiagonal.wholeCubeOrder} · ${state.mode}</text></g>`;
  }
  function buildRecord(state=createState()){
    const proof=verify(),orbit=stickerOrbit(state.selectedSticker);
    return Object.freeze({schema:'nexah.a0.six-face-rainbow-tube/1',version:VERSION,identity:IDENTITY,classification:CLASSIFICATION,status:proof.status,proof,view:Object.freeze({selected:SLOTS[state.selectedSticker].address,current:currentSlot(state.cube,state.selectedSticker).address,trapdoorLocalAddress:2,sideRoles:Object.freeze({L:'PUSHED',R:'COILED'}),cycle:state.cycle,moveIndex:state.moveIndex,history:state.history,closed:isSolved(state.cube)}),carrier:Object.freeze({axisPairs:3,faces:6,faceletsPerFace:9,facelets:54,centers:6,edgeStickers:24,cornerStickers:24}),operator:Object.freeze({commutator:COMMUTATOR,order:proof.commutatorOrder,orbit,trapdoor:'LOCAL_FACELET_2',goldDiagonal:Object.freeze({word:GOLD_WORD,addressCycle:GOLD_ADDRESSES,markerClosureAfterApplications:3,wholeCubeOrder:proof.goldDiagonal.wholeCubeOrder,wholeCubeClosedAfterThree:false,inverseReturn:proof.goldDiagonal.inverseReturn}),twoToOne:proof.twoToOne,splitReading:proof.splitReading}),bindings:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','SG:LENS:ILAU_ORIENTATION','ART:TESSAREC:BLOCK01_CUBE_LAB']),authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,canonicalRubikModel:false,physicalTube:false,physicalTorus:false,physicalPushOrCoil:false}),boundary:'Finite 3x3 facelet permutations only. Local facelet 2 is the declared Pink Diamond trapdoor. The bounded 2-to-1-to-2 witness runs Gold and ALGO independently toward R2: matching the same Pink address is necessary but does not close the carrier. Gold retains a whole-cube residual until its explicit inverse Return; ALGO closes under the commutator order. The source string 2-3-1 has two declared cuts, (23)-1 and 2-(31); its prime-index projection is 9|11 or 3^2|11. T9|11 and T911 are owner address labels, not multiplication. L=PUSHED and R=COILED are directed display roles. No physical push, coil, torus, field, attractor, IEEE architecture or universal mechanism is claimed.'});
  }
  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('sixFaceRainbowTube');if(!section)return null;
    const svg=doc.getElementById('sixFaceRainbowTubeSvg'),status=doc.getElementById('sixFaceRainbowStatus'),moveOut=doc.getElementById('sixFaceRainbowMove'),addressOut=doc.getElementById('sixFaceRainbowAddress'),orbitOut=doc.getElementById('sixFaceRainbowOrbit'),returnOut=doc.getElementById('sixFaceRainbowReturn');let state=createState();
    const render=()=>{const proof=verify(),orbit=stickerOrbit(state.selectedSticker),slotNow=currentSlot(state.cube,state.selectedSticker),goldMode=state.mode.startsWith('GOLD'),pairMode=state.mode.startsWith('PAIR');if(svg)svg.innerHTML=svgMarkup(state);if(status)status.textContent=pairMode?`${state.mode} · GOLD ${state.pair.gold.quarterTurns} / ALGO ${state.pair.algo.quarterTurns}`:`${state.mode} · ${state.history.length} QUARTER TURNS`;if(moveOut)moveOut.textContent=pairMode?`GOLD G³ · ALGO [R,U]⁶`:goldMode?`G = ${GOLD_WORD.join(' ')} · SHORTEST 4`:`${COMMUTATOR[state.moveIndex]} · step ${state.moveIndex+1}/4`;if(addressOut)addressOut.textContent=pairMode?`GOLD ${state.pair.gold.address} = ALGO ${state.pair.algo.address}`:goldMode?state.trace.slice(0,4).join(' → '):`${SLOTS[state.selectedSticker].address} → ${slotNow.address}`;if(orbitOut)orbitOut.textContent=pairMode?`2 PATHS → ${state.pair.pinkAddress} → 2 RECEIPTS`:goldMode?`MARKER 3-CYCLE · CUBE ORDER ${proof.goldDiagonal.wholeCubeOrder}`:`ORDER ${proof.commutatorOrder} · ${orbit.distinctAddresses} ADDRESSES`;if(returnOut)returnOut.textContent=pairMode?(state.pair.returned?'PAIR RETURN · 2/2 CLOSED':'ADDRESS MATCH · GOLD RESIDUAL'):isSolved(state.cube)?'IDENTITY · CLOSED':state.mode==='GOLD_TRIANGLE'?'GOLD CLOSED · CUBE RESIDUAL':'OPEN · ADDRESS IN TRANSIT';section.dataset.status=isSolved(state.cube)?'closed':'transit';return state};
    const stepButton=doc.getElementById('sixFaceRainbowStep'),runButton=doc.getElementById('sixFaceRainbowRun'),goldButton=doc.getElementById('sixFaceRainbowGold'),goldReturnButton=doc.getElementById('sixFaceRainbowGoldReturn'),pairButton=doc.getElementById('sixFaceRainbowPair'),pairReturnButton=doc.getElementById('sixFaceRainbowPairReturn'),selectButton=doc.getElementById('sixFaceRainbowSelect'),resetButton=doc.getElementById('sixFaceRainbowReset'),exportButton=doc.getElementById('sixFaceRainbowExport');
    if(stepButton)stepButton.addEventListener('click',()=>{state=step(state);render()});
    if(runButton)runButton.addEventListener('click',()=>{state=runClosedOrbit(state);render()});
    if(goldButton)goldButton.addEventListener('click',()=>{state=runGoldDiagonal();render()});
    if(goldReturnButton)goldReturnButton.addEventListener('click',()=>{state=returnGoldDiagonal(state.mode==='GOLD_TRIANGLE'?state:runGoldDiagonal());render()});
    if(pairButton)pairButton.addEventListener('click',()=>{state=runTwoToOne();render()});
    if(pairReturnButton)pairReturnButton.addEventListener('click',()=>{state=returnTwoToOne(state.mode==='PAIR_JOIN'?state:runTwoToOne());render()});
    if(selectButton)selectButton.addEventListener('click',()=>{state=selectNext(state);render()});
    if(resetButton)resetButton.addEventListener('click',()=>{state=reset(state.selectedSticker);render()});
    if(exportButton)exportButton.addEventListener('click',()=>{const json=JSON.stringify(buildRecord(state),null,2);section.dataset.lastExport=json;if(host&&host.Blob&&host.URL&&doc.createElement){const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([json],{type:'application/json'}));link.download='a0-six-face-rainbow-tube-view.json';link.click();host.URL.revokeObjectURL(link.href)}});
    render();return Object.freeze({getState:()=>state,step(){state=step(state);return render()},run(){state=runClosedOrbit(state);return render()},runPair(){state=runTwoToOne();return render()},returnPair(){state=returnTwoToOne(state.mode==='PAIR_JOIN'?state:runTwoToOne());return render()},reset(){state=reset(state.selectedSticker);return render()},record:()=>buildRecord(state)});
  }
  return{VERSION,IDENTITY,CLASSIFICATION,FACES,FACE_PAIRS,COLORS,COMMUTATOR,GOLD_WORD,GOLD_ADDRESSES,ALGO_WORD,PAIR_ADDRESS,SPLIT_SOURCE,QUARTER_TURNS,SLOTS,SOLVED,TRAPDOOR_STICKERS,rotateVector,parseMove,applyMove,applySequence,inverseSequence,isSolved,colorCounts,isBijection,currentSlot,permutationOrder,stickerOrbit,stickerId,trackedSignature,findShortestGoldWord,goldDiagonalAudit,isPrime,primeIndex,splitReadingAudit,twoToOneAudit,verify,createState,step,reset,selectNext,runClosedOrbit,runGoldDiagonal,returnGoldDiagonal,runTwoToOne,returnTwoToOne,svgMarkup,buildRecord,mount};
});
