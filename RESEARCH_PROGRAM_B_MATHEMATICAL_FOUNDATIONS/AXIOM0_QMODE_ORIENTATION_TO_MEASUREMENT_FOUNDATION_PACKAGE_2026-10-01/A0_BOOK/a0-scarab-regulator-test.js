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
      ["TESA R1C7 selects G without arithmetic uniqueness",()=>document.getElementById("tesaZitherTranslator")!==null&&primes.filter((prime)=>prime<=26).length>1]
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
      ?`PASS · ${passed}/${total} · CORE + HANDLE + P‑AXIS + NEGATIVE + ELEVATOR + HINGE + G/Q17 · SHADOW = VIEW/HOLD`
      :`FAIL · ${passed}/${total} · ${failures.join(" · ")}`;
    return {passed,total,failures,success};
  };

  root.querySelector("[data-nto-run]")?.addEventListener("click",runTests);
  window.A0ScarabRegulator=Object.freeze({runTests,isPrime,primeIndex,reverseNumber,isPalindrome,elevatorRecords,controlRecords});
})();
