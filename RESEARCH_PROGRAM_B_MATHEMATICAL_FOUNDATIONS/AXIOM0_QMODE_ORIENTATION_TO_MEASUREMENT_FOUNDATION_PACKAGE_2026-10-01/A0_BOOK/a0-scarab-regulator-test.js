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
    ]
  };

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
      ?`PASS · ${passed}/${total} · CORE + HANDLE + P‑AXIS + NEGATIVE · SHADOW = VIEW/HOLD`
      :`FAIL · ${passed}/${total} · ${failures.join(" · ")}`;
    return {passed,total,failures,success};
  };

  root.querySelector("[data-nto-run]")?.addEventListener("click",runTests);
  window.A0ScarabRegulator=Object.freeze({runTests,isPrime,primeIndex,reverseNumber,isPalindrome});
})();
