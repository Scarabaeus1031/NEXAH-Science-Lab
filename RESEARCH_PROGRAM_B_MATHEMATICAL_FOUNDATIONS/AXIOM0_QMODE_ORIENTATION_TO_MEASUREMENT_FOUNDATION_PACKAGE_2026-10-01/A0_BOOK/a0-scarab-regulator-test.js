(()=>{
  "use strict";

  const root=document.getElementById("numberTowerOrientationLens");
  if(!root)return;

  const isPrime=(value)=>{
    if(value<2)return false;
    if(value%2===0)return value===2;
    for(let divisor=3;divisor*divisor<=value;divisor+=2){
      if(value%divisor===0)return false;
    }
    return true;
  };
  const primeIndex=(value)=>{
    if(!isPrime(value))return null;
    let count=0;
    for(let candidate=2;candidate<=value;candidate+=1){
      if(isPrime(candidate))count+=1;
    }
    return count;
  };
  const reverseNumber=(value)=>Number(String(value).split("").reverse().join(""));
  const isPalindrome=(value)=>String(value)===String(value).split("").reverse().join("");
  const primes=[];
  for(let candidate=2;primes.length<1000;candidate+=1){
    if(isPrime(candidate))primes.push(candidate);
  }
  const recordForIndex=(index,kind="paxis")=>{
    const prime=primes[index-1];
    const reversed=reverseNumber(prime);
    return {
      index,prime,reversed,reversePrime:isPrime(reversed),
      previous:primes[index-2],next:primes[index],
      gapBefore:prime-primes[index-2],gapAfter:primes[index]-prime,
      kind
    };
  };
  const elevatorRecords=[];
  for(let index=11;index<=999;index+=1){
    if(isPalindrome(index))elevatorRecords.push(recordForIndex(index,[181,464].includes(index)?"scarab":"paxis"));
  }
  const controlRecords=[180,182,463,465].map((index)=>recordForIndex(index,"control"));
  const mirrorSurvivors=elevatorRecords.filter((record)=>record.reversePrime);
  const conDaoStates=["CON-6","CON-5","CON-4","CON-3","CON-2","CON-1","STILL","DAO-1","DAO-2","DAO-3","DAO-4","DAO-5","DAO-6"];
  const janus=(state)=>state==="STILL"?state:state.startsWith("CON-")?`DAO-${state.slice(4)}`:`CON-${state.slice(4)}`;
  const nnCarrier=Object.freeze([
    Object.freeze({route:"G°D",side:-1,handle:"GD"}),
    Object.freeze({route:"STILL",side:0,handle:"STILL"}),
    Object.freeze({route:"D°G",side:1,handle:"DG"})
  ]);
  const nnFlip=(state)=>state.side===0?state:Object.freeze({route:state.route==="G°D"?"D°G":"G°D",side:-state.side,handle:state.handle});
  const nnWithHandle=(state)=>`${Math.abs(state.side)}|${state.handle}`;
  const nnShadow=(state)=>String(Math.abs(state.side));
  const e88Theta=Math.atan2(80,120)*180/Math.PI;
  const e88Complement=90-e88Theta;
  const e88Carrier=Object.freeze([
    Object.freeze({route:"G°D",landing:88,witness:"THETA",angle:e88Theta}),
    Object.freeze({route:"D°G",landing:88,witness:"COMPLEMENT",angle:e88Complement})
  ]);
  const e88Flip=(state)=>Object.freeze({
    route:state.route==="G°D"?"D°G":"G°D",
    landing:state.landing,
    witness:state.witness==="THETA"?"COMPLEMENT":"THETA",
    angle:state.witness==="THETA"?e88Complement:e88Theta
  });
  const e88Shadow=(state)=>String(state.landing);
  const e88WithWitness=(state)=>`${state.landing}|${state.witness}`;
  const e88dFloors=Object.freeze([87,88,89]);
  const e88dAngles=Object.freeze([
    Object.freeze({mask:"A0",name:"θ−0.17°",degrees:e88Theta-.17}),
    Object.freeze({mask:"A1",name:"θ",degrees:e88Theta}),
    Object.freeze({mask:"A2",name:"θ+0.17°",degrees:e88Theta+.17}),
    Object.freeze({mask:"A3",name:"COMPLEMENT",degrees:e88Complement})
  ]);
  const e88dDirections=Object.freeze(["MASK_A","MASK_B"]);
  const e88dBlindOrder=Object.freeze([17,4,21,8,13,0,19,6,23,10,15,2,18,5,22,9,12,1,20,7,16,3,14,11]);
  const e88dCells=Object.freeze(e88dFloors.flatMap((floor)=>e88dAngles.flatMap((angle)=>e88dDirections.map((directionMask)=>Object.freeze({floor,floorMask:`L${e88dFloors.indexOf(floor)}`,angleMask:angle.mask,angleName:angle.name,degrees:angle.degrees,directionMask})))));
  const e88dProjection=Object.freeze({
    landingOnly:(cell)=>`L${cell.floor}`,
    landingAngle:(cell)=>`L${cell.floor}|${cell.angleMask}`,
    withWitness:(cell)=>`L${cell.floor}|${cell.angleMask}|${cell.directionMask}`
  });
  const e88dPairs=Object.freeze(e88dFloors.flatMap((floor)=>e88dAngles.map((angle)=>{
    const pair=e88dCells.filter((cell)=>cell.floor===floor&&cell.angleMask===angle.mask);
    return Object.freeze({floor,angleMask:angle.mask,landingOnlyUnique:new Set(pair.map(e88dProjection.landingOnly)).size,landingAngleUnique:new Set(pair.map(e88dProjection.landingAngle)).size,withWitnessUnique:new Set(pair.map(e88dProjection.withWitness)).size});
  })));
  const e88dSelfSelects=e88dPairs.filter((pair)=>pair.floor===88).every((pair)=>pair.landingOnlyUnique===2)&&e88dPairs.filter((pair)=>pair.floor!==88).every((pair)=>pair.landingOnlyUnique===1);
  const e88dWitnessOnly=e88dPairs.every((pair)=>pair.landingOnlyUnique===1&&pair.landingAngleUnique===1&&pair.withWitnessUnique===2);
  const directionHandleAudit=Object.freeze({field:"directionMask",origin:"TARGET_DIRECTION_MASK",externalSourcePointer:null,availableBeforeTarget:false,targetDependency:"DIRECT",counterfactualRelabelInvariant:false,withWitnessUnique:2,ablatedUnique:1});
  const directionHandleQualified=directionHandleAudit.externalSourcePointer!==null&&directionHandleAudit.availableBeforeTarget&&directionHandleAudit.targetDependency==="NONE"&&directionHandleAudit.counterfactualRelabelInvariant&&directionHandleAudit.withWitnessUnique===2&&directionHandleAudit.ablatedUnique===1;
  const tBoundaryT=([a,b])=>Object.freeze([b,a]);
  const tBoundaryH=([a,b])=>Math.sign(b-a);
  const tBoundarySlices=Object.freeze([
    Object.freeze({name:"main-sum-16",states:Object.freeze([[7,9],[8,8],[9,7]])}),
    Object.freeze({name:"control-sum-12",states:Object.freeze([[5,7],[6,6],[7,5]])}),
    Object.freeze({name:"control-sum-14",states:Object.freeze([[6,8],[7,7],[8,6]])}),
    Object.freeze({name:"control-sum-15",states:Object.freeze([[7,8],[8,7]])}),
    Object.freeze({name:"control-sum-17",states:Object.freeze([[8,9],[9,8]])})
  ]);
  const tBoundaryStates=Object.freeze(tBoundarySlices.flatMap((slice)=>slice.states));
  const tBoundaryMain=tBoundarySlices[0].states;
  const tBoundaryFixedMain=tBoundaryMain.filter((state)=>tBoundaryH(state)===0);
  const tBoundaryFixedControls=tBoundaryStates.filter((state)=>tBoundaryH(state)===0);

  const groups={
    core:[
      ["1031 is prime",()=>isPrime(1031)],
      ["1032 is composite",()=>!isPrime(1032)],
      ["1033 is prime",()=>isPrime(1033)],
      ["1032 = 24 × 43",()=>1032===24*43]
    ],
    handle:[
      ["reverse(1033) = 3301",()=>reverseNumber(1033)===3301],
      ["reverse(3301) = 1033",()=>reverseNumber(3301)===1033],
      ["3301 is prime",()=>isPrime(3301)],
      ["3301 = p464",()=>primeIndex(3301)===464]
    ],
    paxis:[
      ["1087 is prime",()=>isPrime(1087)],
      ["1087 = p181",()=>primeIndex(1087)===181],
      ["181 is palindrome",()=>isPalindrome(181)],
      ["464 is palindrome",()=>isPalindrome(464)]
    ],
    negative:[
      ["173 is not palindrome",()=>!isPalindrome(173)],
      ["174 is not palindrome",()=>!isPalindrome(174)],
      ["reverse(1032) = 2301",()=>reverseNumber(1032)===2301],
      ["2301 is composite",()=>!isPrime(2301)],
      ["3303 is composite",()=>!isPrime(3303)]
    ],
    elevator:[
      ["99 palindromic indices in 11..999",()=>elevatorRecords.length===99],
      ["17 prime reversals in P-index set",()=>mirrorSurvivors.length===17],
      ["1087 reverses to composite 7801",()=>reverseNumber(1087)===7801&&!isPrime(7801)],
      ["7801 = 29 × 269",()=>7801===29*269],
      ["3301 reverses to prime 1033",()=>reverseNumber(3301)===1033&&isPrime(1033)],
      ["four adjacent controls are non-palindromic",()=>[180,182,463,465].every((index)=>!isPalindrome(index))],
      ["three controls have prime reversals",()=>controlRecords.filter((record)=>record.reversePrime).length===3],
      ["no palindromic prime value in bounded set",()=>elevatorRecords.every((record)=>!isPalindrome(record.prime))]
    ],
    hinge:[
      ["179 and 181 are twin primes",()=>isPrime(179)&&isPrime(181)&&181-179===2],
      ["180 is their arithmetic midpoint",()=>179+181===360&&(179+181)/2===180],
      ["p179 = 1063",()=>primes[178]===1063],
      ["p180 = 1069",()=>primes[179]===1069],
      ["p181 = 1087",()=>primes[180]===1087],
      ["prime-value gaps are 6 and 18",()=>1069-1063===6&&1087-1069===18],
      ["97 + Roman C = 197",()=>97+100===197],
      ["97 = p25 and 197 = p45",()=>primeIndex(97)===25&&primeIndex(197)===45],
      ["A0Z25 GH address is 67",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("G")===6&&"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("H")===7],
      ["A1Z26 GH address is 78",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("G")+1===7&&"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("H")+1===8]
    ],
    generation:[
      ["A1Z26 G = 7",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("G")+1===7],
      ["A1Z26 Q = 17",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("Q")+1===17],
      ["p7 = 17",()=>primes[6]===17],
      ["p17 = 59 negative control",()=>primes[16]===59],
      ["A0Z25 G = 6 negative control",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("G")===6],
      ["A0Z25 Q = 16 negative control",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("Q")===16],
      ["G7 to p7=17 to Q17 holds under A1Z26",()=>primeIndex("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("Q")+1)==="ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("G")+1],
      ["Q17 is not p17",()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf("Q")+1!==primes[16]],
      ["source image equations are rejected",()=>Math.abs(Math.log(((1+Math.sqrt(5))/2)*Math.PI)-.428)>.1&&Math.abs(Math.PI*((1+Math.sqrt(5))/2)-23.14)>1],
      ["typed namespaces remain distinct",()=>"Q17"!=="q17/r11"&&"G7"!=="A INTERSECT B INTERSECT C"],
      ["exactly nine prime lifts remain inside A1Z26",()=>primes.filter((prime,index)=>index<26&&prime<=26).length===9],
      ["nine in-alphabet prime values are exact",()=>primes.slice(0,9).join(",")==="2,3,5,7,11,13,17,19,23"],
      ["p10=29 exits the alphabet",()=>primes[9]===29&&primes[9]>26],
      ["G/Q is lane seven of nine",()=>primes.slice(0,9).findIndex((prime)=>prime===17)===6],
      ["TESA R1C7 selects G without arithmetic uniqueness",()=>document.getElementById("tesaZitherTranslator")!==null&&primes.filter((prime)=>prime<=26).length>1],
      ["seven lane values survive decimal prime reversal",()=>primes.slice(0,9).filter((prime)=>isPrime(reverseNumber(prime))).length===7],
      ["seven lane values are twin-prime members",()=>primes.slice(0,9).filter((prime)=>isPrime(prime-2)||isPrime(prime+2)).length===7],
      ["six lanes survive reverse and twin intersection",()=>primes.slice(0,9).filter((prime)=>isPrime(reverseNumber(prime))&&(isPrime(prime-2)||isPrime(prime+2))).length===6],
      ["G/Q17 survives arithmetic intersection",()=>isPrime(reverseNumber(17))&&(isPrime(15)||isPrime(19))],
      ["D/G7 is a matched arithmetic control",()=>isPrime(reverseNumber(7))&&(isPrime(5)||isPrime(9))],
      ["F/M13 is a matched arithmetic control",()=>isPrime(reverseNumber(13))&&(isPrime(11)||isPrime(15))],
      ["H/S19 fails reverse while retaining twin membership",()=>!isPrime(reverseNumber(19))&&isPrime(17)],
      ["selector matrix contains exactly one source-selected lane",()=>document.querySelectorAll(".nto-selector-matrix tr[data-sm-selected='true']").length===1]
    ],
    blind:[
      ["blind protocol freezes exactly nine candidates",()=>document.querySelectorAll(".nto-blind-scarab [data-bs-candidate]").length===9],
      ["blind order is frozen and deterministic",()=>[...document.querySelectorAll(".nto-blind-scarab [data-bs-candidate]")].map((candidate)=>candidate.dataset.bsLane).join(",")==="4,9,2,7,1,8,5,3,6"],
      ["blind order contains every lane exactly once",()=>new Set([...document.querySelectorAll(".nto-blind-scarab [data-bs-candidate]")].map((candidate)=>candidate.dataset.bsLane)).size===9],
      ["five Scarab features are defined before reveal",()=>document.querySelectorAll(".nto-blind-features span").length===5],
      ["geometry mapping is open for every candidate",()=>[...document.querySelectorAll(".nto-blind-scarab [data-bs-candidate] em")].every((status)=>status.textContent.trim()==="GEOMETRY OPEN")],
      ["blind arithmetic survivor set contains six candidates",()=>document.querySelectorAll(".nto-blind-scarab [data-bs-arithmetic='true']").length===6],
      ["blind protocol starts with labels concealed",()=>document.querySelector(".nto-blind-scarab")?.dataset.bsInitial==="blind"],
      ["no candidate receives an invented geometry selection",()=>document.querySelectorAll(".nto-blind-scarab [data-bs-geometry='selected']").length===0],
      ["reveal preserves the arithmetic survivor set",()=>document.querySelectorAll(".nto-blind-scarab [data-bs-arithmetic='true']").length===6],
      ["TESA remains one separate source selection",()=>document.querySelectorAll(".nto-blind-scarab [data-bs-selected='true']").length===1]
    ],
    dao:[
      ["DAO bridge reuses the existing Workbench lens",()=>document.querySelectorAll(".nto-dao-bridge").length===1],
      ["D°G reference preserves 18 samples",()=>document.querySelector(".nto-dao-bridge")?.dataset.dgSamples==="18"],
      ["D°G reference preserves 5 bands",()=>document.querySelector(".nto-dao-bridge")?.dataset.dgBands==="5"],
      ["G°D remains open and unbound",()=>document.querySelector(".nto-dao-stage .is-gd span")?.textContent.trim()==="OPEN · UNBOUND"],
      ["three relationship hypotheses are preregistered",()=>document.querySelectorAll(".nto-dao-hypotheses [data-dao-hypothesis]").length===3],
      ["no D/G to CON/DAO binding is asserted",()=>document.querySelector(".nto-dao-bridge")?.dataset.daoBinding==="none"],
      ["CON–DAO carrier has thirteen unique states",()=>conDaoStates.length===13&&new Set(conDaoStates).size===13],
      ["CON–DAO has six Janus pairs",()=>conDaoStates.filter((state)=>state.startsWith("CON-")).every((state)=>janus(state).startsWith("DAO-"))],
      ["CON–DAO involution closes",()=>conDaoStates.every((state)=>janus(janus(state))===state)],
      ["STILL is the fixed Janus point",()=>janus("STILL")==="STILL"]
    ],
    nn:[
      ["NN candidate reuses the existing Triple Gate source",()=>document.querySelector(".nto-nn-seam a[href*='goReturnTitle']")!==null],
      ["N swaps the two symbolic sides",()=>nnFlip(nnCarrier[0]).side===1&&nnFlip(nnCarrier[2]).side===-1],
      ["N squared closes on all three symbolic states",()=>nnCarrier.every((state)=>{const returned=nnFlip(nnFlip(state));return returned.route===state.route&&returned.side===state.side&&returned.handle===state.handle;})],
      ["retained handles keep the two side records unique",()=>new Set(nnCarrier.filter((state)=>state.side!==0).map(nnWithHandle)).size===2],
      ["handle ablation produces a two-to-one shadow collision",()=>nnCarrier.filter((state)=>state.side!==0).length===2&&new Set(nnCarrier.filter((state)=>state.side!==0).map(nnShadow)).size===1]
    ],
    e88:[
      ["Elevator 88 is an exact palindromic P-index address",()=>88===8*11&&isPalindrome(88)&&primes[87]===457],
      ["p88 reversal is a composite control",()=>reverseNumber(457)===754&&!isPrime(754)],
      ["source geometry keeps exact rounded and residual records separate",()=>Math.abs(e88Theta-33.690067525979785)<1e-12&&Math.abs(e88Complement-56.309932474020215)<1e-12&&Math.abs(e88Theta+e88Complement-90)<1e-12&&Math.abs(Math.hypot(80,120)-144.22205101855957)<1e-12&&Math.hypot(80,120)!==144&&51.84+48.16===100&&72+24===96&&100-(72+24)===4&&Math.abs(360/27-40/3)<1e-12&&7.83+.17===8],
      ["landing ablation produces a two-to-one collision",()=>new Set(e88Carrier.map(e88Shadow)).size===1&&new Set(e88Carrier.map(e88WithWitness)).size===2],
      ["Elevator 88 witness swap closes under N squared",()=>e88Carrier.every((state)=>{const returned=e88Flip(e88Flip(state));return returned.route===state.route&&returned.landing===state.landing&&returned.witness===state.witness&&Math.abs(returned.angle-state.angle)<1e-12;})]
    ],
    e88d:[
      ["discrimination matrix is exactly 3 by 4 by 2",()=>e88dFloors.length===3&&e88dAngles.length===4&&e88dDirections.length===2&&e88dCells.length===24],
      ["blind order covers twenty-four cells exactly once",()=>e88dBlindOrder.length===24&&new Set(e88dBlindOrder).size===24&&e88dBlindOrder.every((index)=>index>=0&&index<24)],
      ["neighbor prime controls are exact",()=>primes[86]===449&&primes[87]===457&&primes[88]===461],
      ["frozen angle variants are finite and exact",()=>e88dAngles.every((angle)=>Number.isFinite(angle.degrees))&&Math.abs(e88dAngles[0].degrees-(e88Theta-.17))<1e-12&&Math.abs(e88dAngles[3].degrees-e88Complement)<1e-12],
      ["initial view conceals labels and target direction",()=>document.querySelector(".nto-e88-discrimination")?.dataset.edInitial==="blind"&&document.querySelector("[data-ed-reveal]")!==null],
      ["DAO binding default remains none",()=>document.querySelector(".nto-e88-discrimination")?.dataset.edDaoBinding==="none"],
      ["floor-only projection collapses all twelve direction pairs",()=>e88dPairs.length===12&&e88dPairs.every((pair)=>pair.landingOnlyUnique===1)],
      ["floor-plus-angle projection collapses all twelve direction pairs",()=>e88dPairs.every((pair)=>pair.landingAngleUnique===1)],
      ["direction witness preserves all twelve direction pairs",()=>e88dPairs.every((pair)=>pair.withWitnessUnique===2)],
      ["floor 88 does not self-select and witness-only rule closes",()=>e88dSelfSelects===false&&e88dWitnessOnly===true]
    ],
    dhi:[
      ["direction handle origin is declared",()=>directionHandleAudit.origin==="TARGET_DIRECTION_MASK"],
      ["existing witness has no independent external source",()=>directionHandleAudit.externalSourcePointer===null&&directionHandleAudit.targetDependency==="DIRECT"],
      ["existing witness is not available before target assignment",()=>directionHandleAudit.availableBeforeTarget===false],
      ["counterfactual relabel changes the witness record",()=>directionHandleAudit.counterfactualRelabelInvariant===false],
      ["ablation proves necessity but not independence",()=>directionHandleAudit.withWitnessUnique===2&&directionHandleAudit.ablatedUnique===1&&directionHandleQualified===false]
    ],
    tbd:[
      ["T squared closes on all thirteen frozen states",()=>tBoundaryStates.length===13&&tBoundaryStates.every((state)=>{const returned=tBoundaryT(tBoundaryT(state));return returned[0]===state[0]&&returned[1]===state[1];})],
      ["signed handle flips under T and vanishes on diagonal",()=>tBoundaryStates.every((state)=>tBoundaryH(tBoundaryT(state))===-tBoundaryH(state))&&tBoundaryStates.filter((state)=>state[0]===state[1]).every((state)=>tBoundaryH(state)===0)],
      ["eight-eight is the unique fixed point on the sum-sixteen slice",()=>tBoundaryFixedMain.length===1&&tBoundaryFixedMain[0][0]===8&&tBoundaryFixedMain[0][1]===8],
      ["T-boundary handle is computable before view labels",()=>tBoundaryMain.map(tBoundaryH).join(",")==="1,0,-1"&&79+97===176&&176===2*88&&isPrime(79)&&isPrime(97)],
      ["matched diagonal controls reject global uniqueness",()=>tBoundaryFixedControls.length===3&&tBoundaryFixedControls.map((state)=>state.join("")).join(",")==="88,66,77"]
    ]
  };

  const generationBridge=root.querySelector(".nto-generation-bridge");
  if(generationBridge){
    const generationOutput=generationBridge.querySelector("[data-gq-output]");
    generationBridge.querySelectorAll("button[data-gq-view]").forEach((button)=>{
      button.addEventListener("click",()=>{
        const view=button.dataset.gqView;
        generationBridge.dataset.gqView=view;
        generationBridge.querySelectorAll("button[data-gq-view]").forEach((candidate)=>candidate.setAttribute("aria-pressed",String(candidate===button)));
        generationOutput.textContent=view==="ladder"
          ?"FULL 9-LANE · G7/Q17 SOURCE-SELECTED · NOT UNIQUE"
          :view==="chain"
            ?"EXACT CHAIN · A1Z26 · G7 → p7=17 → Q17"
            :"CONTROLS · A0Z25 G6/Q16 · p17=59 · q17/r11 · DEFG-G";
      });
    });
    const selectorMatrix=generationBridge.querySelector(".nto-selector-matrix");
    const selectorOutput=selectorMatrix?.querySelector("[data-sm-output]");
    selectorMatrix?.querySelectorAll("button[data-sm-filter]").forEach((button)=>{
      button.addEventListener("click",()=>{
        const filter=button.dataset.smFilter;
        selectorMatrix.dataset.smFilter=filter;
        selectorMatrix.querySelectorAll("button[data-sm-filter]").forEach((candidate)=>candidate.setAttribute("aria-pressed",String(candidate===button)));
        const rows=[...selectorMatrix.querySelectorAll("tbody tr")];
        rows.forEach((row)=>{
          row.hidden=filter==="arithmetic"
            ?!(row.dataset.smReverse==="true"&&row.dataset.smTwin==="true")
            :filter==="selected"&&row.dataset.smSelected!=="true";
        });
        const visible=rows.filter((row)=>!row.hidden).length;
        selectorOutput.textContent=filter==="all"
          ?"ALL 9 · ARITHMETIC INTERSECTION 6 · TESA SELECTED 1"
          :filter==="arithmetic"
            ?`ARITHMETIC INTERSECTION · ${visible}/9 · G NOT UNIQUE`
            :`TESA SOURCE SELECTION · ${visible}/9 · LANE 7`;
      });
    });
    generationBridge.querySelector("[data-gq-test]")?.addEventListener("click",()=>{
      const tests=groups.generation;
      const passed=tests.filter(([,test])=>test()).length;
      generationOutput.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} · G/Q17 CROSSWALK · NAMESPACES HELD`
        :`FAIL · ${passed}/${tests.length} · GENERATION CONTRACT`;
    });
  }

  const hingePress=root.querySelector(".nto-hinge-press");
  if(hingePress){
    const phaseNames={1:"INITIAL",2:"STABLE",3:"RESONANT",4:"TRANSIENT"};
    const hingeOutput=hingePress.querySelector("[data-hp-output]");
    const phaseNumber=hingePress.querySelector(".hp-phase-number");
    hingePress.querySelectorAll("button[data-hp-phase]").forEach((button)=>{
      button.addEventListener("click",()=>{
        const phase=Number(button.dataset.hpPhase);
        hingePress.dataset.hpPhase=String(phase);
        hingePress.querySelectorAll("button[data-hp-phase]").forEach((candidate)=>candidate.setAttribute("aria-pressed",String(candidate===button)));
        phaseNumber.textContent=String(phase);
        hingeOutput.textContent=`PHASE ${phase} · ${phaseNames[phase]} · INDEX HINGE ACTIVE`;
      });
    });
    hingePress.querySelector("[data-hp-test]")?.addEventListener("click",()=>{
      const tests=groups.hinge;
      const passed=tests.filter(([,test])=>test()).length;
      hingeOutput.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} · 180° HINGE + BLUE/YELLOW PRESS · VIEW ROLES HELD`
        :`FAIL · ${passed}/${tests.length} · HINGE CONTRACT`;
    });
  }

  const blindScarab=root.querySelector(".nto-blind-scarab");
  if(blindScarab){
    const blindOutput=blindScarab.querySelector("[data-bs-output]");
    const revealButton=blindScarab.querySelector("[data-bs-reveal]");
    blindScarab.querySelector("[data-bs-run]")?.addEventListener("click",()=>{
      const tests=groups.blind;
      const passed=tests.filter(([,test])=>test()).length;
      blindOutput.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} · 6 ARITHMETIC · 0 GEOMETRY · MAPPING OPEN`
        :`FAIL · ${passed}/${tests.length} · BLIND CONTRACT`;
    });
    revealButton?.addEventListener("click",()=>{
      blindScarab.dataset.bsState="revealed";
      revealButton.setAttribute("aria-pressed","true");
      blindOutput.textContent="REVEALED · K4 = G7→Q17 · TESA SOURCE ONLY · GEOMETRY MAPPING OPEN";
    });
    blindScarab.querySelector("[data-bs-reset]")?.addEventListener("click",()=>{
      blindScarab.dataset.bsState="blind";
      revealButton?.setAttribute("aria-pressed","false");
      blindOutput.textContent="BLIND · 9 FROZEN · 6 ARITHMETIC · GEOMETRY MAPPING OPEN";
    });
  }

  const daoBridge=root.querySelector(".nto-dao-bridge");
  if(daoBridge){
    const daoOutput=daoBridge.querySelector("[data-dao-output]");
    const stepStatus=(step,text)=>{const target=daoBridge.querySelector(`[data-dao-step="${step}"] em`);if(target)target.textContent=text;};
    daoBridge.querySelector("[data-dao-run]")?.addEventListener("click",()=>{
      const tests=groups.dao;
      const passed=tests.filter(([,test])=>test()).length;
      daoBridge.dataset.daoState="tested";
      stepStatus(1,"REFERENCE HELD");
      stepStatus(2,"OPEN · UNBOUND");
      stepStatus(3,"FIXED · SEPARATE");
      stepStatus(4,"3 × NOT TESTABLE");
      stepStatus(5,"UNDEFINED_CONTRACT");
      daoBridge.querySelectorAll(".nto-dao-hypotheses span").forEach((status)=>{status.textContent="NOT TESTABLE · G°D MAP ABSENT";});
      daoOutput.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} BOUNDARIES · UNDEFINED_CONTRACT · DAO BINDING NONE`
        :`FAIL · ${passed}/${tests.length} · DAO BOUNDARY CONTRACT`;
    });
    daoBridge.querySelector("[data-dao-reset]")?.addEventListener("click",()=>{
      daoBridge.dataset.daoState="undefined";
      ["REFERENCE","OPEN · UNBOUND","NON-IDENTITY","NOT RUN","NO BINDING"].forEach((text,index)=>stepStatus(index+1,text));
      ["NOT TESTABLE","NOT TESTABLE FOR D/G","NOT DECIDABLE"].forEach((text,index)=>{const status=daoBridge.querySelectorAll(".nto-dao-hypotheses span")[index];if(status)status.textContent=text;});
      daoOutput.textContent="READY · D°G 18/5 · G°D OPEN · DAO BINDING NONE";
    });
    const nnSeam=daoBridge.querySelector(".nto-nn-seam");
    const nnOutput=nnSeam?.querySelector("[data-nn-output]");
    const nnStepStatus=(step,text)=>{const target=nnSeam?.querySelector(`[data-nn-step="${step}"] em`);if(target)target.textContent=text;};
    nnSeam?.querySelector("[data-nn-run]")?.addEventListener("click",()=>{
      const tests=groups.nn;
      const passed=tests.filter(([,test])=>test()).length;
      nnSeam.dataset.nnState="tested";
      ["1 FIXED POINT","LEFT ↔ RIGHT","N² = ID","2 UNIQUE","2→1 COLLISION"].forEach((text,index)=>nnStepStatus(index+1,text));
      nnOutput.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} · SYMBOLIC INVOLUTION · HANDLE NECESSARY · NO G/D BINDING`
        :`FAIL · ${passed}/${tests.length} · NN SEAM CONTRACT`;
    });
    nnSeam?.querySelector("[data-nn-reset]")?.addEventListener("click",()=>{
      nnSeam.dataset.nnState="ready";
      [1,2,3,4,5].forEach((step)=>nnStepStatus(step,"READY"));
      nnOutput.textContent="READY · 3 STATES · 1 FIXED SEAM · HANDLE TEST";
    });
    const e88Junction=nnSeam?.querySelector(".nto-e88-junction");
    const e88Output=e88Junction?.querySelector("[data-e88-output]");
    const e88StepStatus=(step,text)=>{const target=e88Junction?.querySelector(`[data-e88-step="${step}"] em`);if(target)target.textContent=text;};
    e88Junction?.querySelector("[data-e88-run]")?.addEventListener("click",()=>{
      const tests=groups.e88;
      const passed=tests.filter(([,test])=>test()).length;
      e88Junction.dataset.e88State="tested";
      ["p88=457","754 COMPOSITE","TYPED PRECISION","2→1 / 2 UNIQUE","N²=ID"].forEach((text,index)=>e88StepStatus(index+1,text));
      e88Output.textContent=passed===tests.length
        ?`PASS · ${passed}/${tests.length} · LANDING NEEDS WITNESS · DAO BINDING NONE`
        :`FAIL · ${passed}/${tests.length} · ELEVATOR 88 CONTRACT`;
    });
    e88Junction?.querySelector("[data-e88-reset]")?.addEventListener("click",()=>{
      e88Junction.dataset.e88State="ready";
      [1,2,3,4,5].forEach((step)=>e88StepStatus(step,"READY"));
      e88Output.textContent="READY · p88=457 · LANDING COLLISION · DAO BINDING NONE";
    });
    const e88Discrimination=e88Junction?.querySelector(".nto-e88-discrimination");
    const edOutput=e88Discrimination?.querySelector("[data-ed-output]");
    const edMatrix=e88Discrimination?.querySelector("[data-ed-matrix]");
    const edReveal=e88Discrimination?.querySelector("[data-ed-reveal]");
    const renderEdMatrix=(revealed=false)=>{
      if(!edMatrix)return;
      edMatrix.replaceChildren(...e88dBlindOrder.map((cellIndex,blindIndex)=>{
        const cell=e88dCells[cellIndex];
        const article=document.createElement("article");
        article.className="nto-ed-cell";
        const route=cell.directionMask==="MASK_A"?"G°D":"D°G";
        article.innerHTML=revealed
          ?`<b>B${String(blindIndex+1).padStart(2,"0")}</b><span>${cell.floor} · ${cell.angleName}</span><em>${route} · WITNESS</em>`
          :`<b>B${String(blindIndex+1).padStart(2,"0")}</b><span>${cell.floorMask} · ${cell.angleMask}</span><em>TARGET HIDDEN</em>`;
        return article;
      }));
    };
    renderEdMatrix(false);
    e88Discrimination?.querySelector("[data-ed-run]")?.addEventListener("click",()=>{
      const labelsWereHidden=e88Discrimination.dataset.edState==="blind"&&[...edMatrix.querySelectorAll("em")].every((item)=>item.textContent==="TARGET HIDDEN");
      const tests=groups.e88d;
      const passed=tests.filter(([,test])=>test()).length;
      e88Discrimination.dataset.edState="tested";
      if(edReveal)edReveal.disabled=false;
      edOutput.textContent=labelsWereHidden&&passed===tests.length
        ?`NEGATIVE · ${passed}/${tests.length} CONTRACTS · 24/24 CELLS · 88 DOES NOT SELECT · WITNESS ONLY · DAO NONE`
        :`ABORT · ${passed}/${tests.length} · BLINDING OR CONTRACT FAILURE`;
    });
    edReveal?.addEventListener("click",()=>{
      if(e88Discrimination.dataset.edState!=="tested")return;
      e88Discrimination.dataset.edState="revealed";
      renderEdMatrix(true);
      edReveal.disabled=true;
      edOutput.textContent="REVEALED AFTER CLASSIFICATION · NEGATIVE 88 SELECTOR · WITNESS CANDIDATE · DAO NONE";
    });
    e88Discrimination?.querySelector("[data-ed-reset]")?.addEventListener("click",()=>{
      e88Discrimination.dataset.edState="blind";
      if(edReveal)edReveal.disabled=true;
      renderEdMatrix(false);
      edOutput.textContent="BLIND · 24 CELLS · TARGET HIDDEN · DAO BINDING NONE";
    });
    const directionHandleIsolation=e88Junction?.querySelector(".nto-direction-handle-isolation");
    const dhiOutput=directionHandleIsolation?.querySelector("[data-dhi-output]");
    const dhiGateStatus=(gate,text)=>{const target=directionHandleIsolation?.querySelector(`[data-dhi-gate="${gate}"] em`);if(target)target.textContent=text;};
    directionHandleIsolation?.querySelector("[data-dhi-run]")?.addEventListener("click",()=>{
      const tests=groups.dhi;
      const passed=tests.filter(([,test])=>test()).length;
      directionHandleIsolation.dataset.dhiState="tested";
      ["DECLARED","FAIL · TARGET-DERIVED","FAIL · NOT PRE-TARGET","FAIL · RELABEL-DEPENDENT","PASS · 2→1"].forEach((text,index)=>dhiGateStatus(index+1,text));
      dhiOutput.textContent=passed===tests.length
        ?`NEGATIVE · ${passed}/${tests.length} AUDIT CONTRACTS · TARGET-DERIVED WITNESS · ACTUAL HANDLE OPEN · DAO NONE`
        :`ABORT · ${passed}/${tests.length} · HANDLE AUDIT CONTRACT FAILURE`;
    });
    directionHandleIsolation?.querySelector("[data-dhi-reset]")?.addEventListener("click",()=>{
      directionHandleIsolation.dataset.dhiState="ready";
      [1,2,3,4,5].forEach((gate)=>dhiGateStatus(gate,"READY"));
      dhiOutput.textContent="READY · 5 GATES · ACTUAL HANDLE OPEN · DAO NONE";
    });
    const tBoundary=directionHandleIsolation?.querySelector(".nto-t-boundary");
    const tbdOutput=tBoundary?.querySelector("[data-tbd-output]");
    const tbdReveal=tBoundary?.querySelector("[data-tbd-reveal]");
    const tbdTestStatus=(test,text)=>{const target=tBoundary?.querySelector(`[data-tbd-test="${test}"] em`);if(target)target.textContent=text;};
    tBoundary?.querySelector("[data-tbd-run]")?.addEventListener("click",()=>{
      const labelsWereHidden=tBoundary.dataset.tbdState==="blind";
      const tests=groups.tbd;
      const passed=tests.filter(([,test])=>test()).length;
      tBoundary.dataset.tbdState="tested";
      ["PASS · T²=ID","PASS · +/0/−","PASS · LOCAL","PASS · PRELABEL","PASS · GLOBAL ×"].forEach((text,index)=>tbdTestStatus(index+1,text));
      if(tbdReveal)tbdReveal.disabled=false;
      tbdOutput.textContent=labelsWereHidden&&passed===tests.length
        ?`PASS · ${passed}/${tests.length} · LOCAL PRELABEL HANDLE · GLOBAL UNIQUE × · BINDINGS NONE`
        :`ABORT · ${passed}/${tests.length} · BLINDING OR CONTRACT FAILURE`;
    });
    tbdReveal?.addEventListener("click",()=>{
      if(tBoundary.dataset.tbdState!=="tested")return;
      tBoundary.dataset.tbdState="revealed";
      tbdReveal.disabled=true;
      tbdOutput.textContent="REVEALED AFTER CLASSIFICATION · INSIDE/OUTSIDE + GOD/DOG + G°D/D°G REMAIN OPEN";
    });
    tBoundary?.querySelector("[data-tbd-reset]")?.addEventListener("click",()=>{
      tBoundary.dataset.tbdState="blind";
      [1,2,3,4,5].forEach((test)=>tbdTestStatus(test,"READY"));
      if(tbdReveal)tbdReveal.disabled=true;
      tbdOutput.textContent="BLIND · 13 STATES · LABELS HIDDEN · DAO NONE";
    });
  }

  const elevator=root.querySelector(".nto-elevator");
  if(elevator){
    const rows=elevator.querySelector("[data-pe-rows]");
    const filter=elevator.querySelector("[data-pe-filter]");
    const sort=elevator.querySelector("[data-pe-sort]");
    const pageOutput=elevator.querySelector("[data-pe-page]");
    const previousButton=elevator.querySelector("[data-pe-prev]");
    const nextButton=elevator.querySelector("[data-pe-next]");
    const exportButton=elevator.querySelector("[data-pe-export]");
    const exportOutput=elevator.querySelector("[data-pe-output]");
    const pageSize=12;
    let page=0;

    const activeRecords=()=>{
      const mode=filter.value;
      const source=mode==="control"?controlRecords:elevatorRecords;
      const selected=source.filter((record)=>mode==="all"||mode==="control"||(mode==="survivor"&&record.reversePrime)||(mode==="scarab"&&record.kind==="scarab"));
      return [...selected].sort((a,b)=>{
        if(sort.value==="index-desc")return b.index-a.index;
        if(sort.value==="prime-asc")return a.prime-b.prime;
        if(sort.value==="gap-desc")return Math.max(b.gapBefore,b.gapAfter)-Math.max(a.gapBefore,a.gapAfter)||a.index-b.index;
        return a.index-b.index;
      });
    };
    const roleFor=(record)=>{
      if(record.kind==="scarab")return record.index===181?"SCARAB · ANCHOR":"SCARAB · HANDLE";
      if(record.kind==="control")return "NEGATIVE CONTROL";
      if(record.reversePrime)return "MIRROR SURVIVOR";
      return "P‑INDEX HIT";
    };
    const render=()=>{
      const records=activeRecords();
      const pageCount=Math.max(1,Math.ceil(records.length/pageSize));
      page=Math.min(page,pageCount-1);
      const visible=records.slice(page*pageSize,(page+1)*pageSize);
      rows.replaceChildren(...visible.map((record)=>{
        const row=document.createElement("tr");
        if(record.reversePrime)row.classList.add("is-survivor");
        if(record.kind==="scarab")row.classList.add("is-scarab");
        if(record.kind==="control")row.classList.add("is-control");
        const roleClass=record.kind==="scarab"?"is-scarab":record.kind==="control"?"is-control":record.reversePrime?"is-survivor":"";
        row.innerHTML=`<td><b>p${record.index}</b></td><td><b>${record.prime}</b></td><td>${record.reversed} · ${record.reversePrime?"PRIME":"COMPOSITE"}</td><td>${record.previous} ← ${record.prime} → ${record.next} · Δ${record.gapBefore}/${record.gapAfter}</td><td><span class="nto-role ${roleClass}">${roleFor(record)}</span></td>`;
        return row;
      }));
      pageOutput.textContent=`${page+1} / ${pageCount} · ${records.length}`;
      previousButton.disabled=page===0;
      nextButton.disabled=page>=pageCount-1;
    };
    filter.addEventListener("change",()=>{page=0;render();});
    sort.addEventListener("change",()=>{page=0;render();});
    previousButton.addEventListener("click",()=>{page=Math.max(0,page-1);render();});
    nextButton.addEventListener("click",()=>{page+=1;render();});
    exportButton.addEventListener("click",async()=>{
      const receipt={scope:"p11..p999",palindromic_indices:99,prime_reversal_survivors:17,scarab:{181:{prime:1087,reverse:7801,reverse_prime:false,factorization:"29*269"},464:{prime:3301,reverse:1033,reverse_prime:true}},controls:controlRecords};
      const payload=JSON.stringify(receipt,null,2);
      try{await navigator.clipboard.writeText(payload);exportOutput.textContent="Kopiert · 99/17 · Scarab 1/2 · controls 3/4";}
      catch(error){exportOutput.textContent="Beleg bereit · Clipboard nicht verfügbar";}
    });
    render();
  }

  const setLayer=(name,active)=>{
    root.querySelectorAll(`[data-nto-layer~="${name}"]`).forEach((element)=>{
      element.classList.toggle("is-layer-off",!active);
    });
  };

  root.querySelectorAll("[data-nto-toggle]").forEach((button)=>{
    button.addEventListener("click",()=>{
      const active=button.getAttribute("aria-pressed")!=="true";
      button.setAttribute("aria-pressed",String(active));
      setLayer(button.dataset.ntoToggle,active);
    });
  });

  const runTests=()=>{
    let passed=0;
    let total=0;
    const failures=[];
    Object.entries(groups).forEach(([group,tests])=>{
      let groupPass=true;
      tests.forEach(([label,test])=>{
        total+=1;
        const ok=Boolean(test());
        if(ok)passed+=1;
        else{
          failures.push(label);
          groupPass=false;
        }
      });
      const badge=root.querySelector(`[data-nto-result="${group}"]`);
      if(badge){
        badge.classList.toggle("is-pass",groupPass);
        badge.classList.toggle("is-fail",!groupPass);
      }
    });
    const output=root.querySelector("[data-nto-output]");
    const success=passed===total;
    output.classList.toggle("is-pass",success);
    output.classList.toggle("is-fail",!success);
    output.textContent=success
      ?`PASS · ${passed}/${total} · CORE + HANDLE + P‑AXIS + NEGATIVE + ELEVATOR + HINGE + G/Q17 + BLIND SCARAB + DAO BOUNDARY + NN SEAM + E88 WITNESS + E88 DISCRIMINATION + HANDLE ISOLATION + T‑BOUNDARY · G°D = OPEN`
      :`FAIL · ${passed}/${total} · ${failures.join(" · ")}`;
    return {passed,total,failures,success};
  };

  root.querySelector("[data-nto-run]")?.addEventListener("click",runTests);
  window.A0ScarabRegulator=Object.freeze({runTests,isPrime,primeIndex,reverseNumber,isPalindrome,elevatorRecords,controlRecords,conDaoStates,janus,nnCarrier,nnFlip,nnWithHandle,nnShadow,e88Carrier,e88Flip,e88Shadow,e88WithWitness,e88dCells,e88dPairs,e88dSelfSelects,e88dWitnessOnly,directionHandleAudit,directionHandleQualified,tBoundaryT,tBoundaryH,tBoundaryStates});
})();
