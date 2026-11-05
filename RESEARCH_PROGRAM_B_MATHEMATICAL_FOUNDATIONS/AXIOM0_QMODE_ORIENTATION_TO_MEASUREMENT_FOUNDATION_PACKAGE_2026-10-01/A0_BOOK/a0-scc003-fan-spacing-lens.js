(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0Scc003FanSpacingLens=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const SPACING_WORD=Object.freeze({positions:Object.freeze([3,22,32,33]),seamAfter:22,deltas:Object.freeze([19,10,1]),notation:'3–22 // 32–33'});
  const FOUR_PLATES=Object.freeze([
    Object.freeze({value:61,kind:'PRIME',primeIndex:18,reverse:16,pair:'A'}),
    Object.freeze({value:16,kind:'POWER',identity:'2⁴',reverse:61,pair:'A'}),
    Object.freeze({value:19,kind:'PRIME',primeIndex:8,reverse:91,pair:'B'}),
    Object.freeze({value:91,kind:'COMPOSITE',identity:'7×13',reverse:19,pair:'B'})
  ]);
  function gatePoints(){
    const points=[];
    for(let row=0;row<9;row+=1)for(let col=0;col<11;col+=1){
      const theta=(-0.78+(col/10)*1.56)+(row-4)*0.017,radius=36+row*12;
      points.push(Object.freeze({index:row*11+col+1,row,col,x:430+Math.sin(theta)*radius,y:312-Math.cos(theta)*radius}));
    }
    return Object.freeze(points);
  }
  function contract(){return Object.freeze({schema:'nexah.a0.scc003-fan-spacing-lens/1',version:VERSION,classification:'CONTEXTUAL_REPRESENTATION_OUTSIDE_THEOREM',sourceIdentity:'A0OE:PASCAL_PENTAGON_D5_TEST',gateCount:gatePoints().length,gateFactorization:'99=9×11',spacingWord:SPACING_WORD,alphaRole:'OPEN_EXTERNAL_WITNESS',balloonRole:'ONE_BIT_PROPOSAL_UNTYPED',projection106to99:null,residualRegister:null,newIdentity:false,newRelation:false,boundary:'The 99-gate fan and the spacing word are exact display objects. No map from the 106-vertex SCC-003 quotient to the 99 gates is defined. Alpha and the one-bit balloon remain open witness proposals, not theorem objects.'});}
  function reverseDigits(value){return Number(String(value).split('').reverse().join(''))}
  function fourPlateContract(){return Object.freeze({schema:'nexah.a0.scc003-four-plate-reversal-lens/1',classification:'CONTEXTUAL_ARITHMETIC_PLATE_OUTSIDE_THEOREM',plates:FOUR_PLATES,reversalPairs:Object.freeze([[61,16],[19,91]]),exact:Object.freeze({sixteen:'16=2^4',ninetyOne:'91=7×13',sixtyOnePrime:true,nineteenPrime:true}),colourRoles:Object.freeze({red:'BALLOON_WITNESS',blue:'BODY_HEAD_SKY_WATER_FRAME',green:'FLOOR_RETURN_FRAME'}),cloudWord:'CL·O·UD',cloudStatus:'UNBOUND_OWNER_MNEMONIC',sourceImageUsed:false,scc003Map:null,newIdentity:false,newRelation:false,boundary:'The four decimal plates and their reversals are exact arithmetic. Colour, cloud and balloon roles are an original abstract display and do not reproduce or derive evidence from the supplied cover image. No SCC-003 map, physical colour law or theorem extension is asserted.'});}
  function svgMarkup(){
    const marked=new Set(SPACING_WORD.positions);
    const points=gatePoints().map(p=>`<circle class="sfl-gate${marked.has(p.index)?' marked m'+p.index:''}" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${marked.has(p.index)?5.4:2.7}" data-index="${p.index}"/>`).join('');
    const labels=gatePoints().filter(p=>marked.has(p.index)).map(p=>`<text class="sfl-index" x="${(p.x+8).toFixed(2)}" y="${(p.y-7).toFixed(2)}">${p.index}</text>`).join('');
    return `<g><text class="sfl-kicker" x="145" y="34" text-anchor="middle">A · SCC-003 SOURCE</text><path class="sfl-pentagon" d="M145 70L245 143L207 260H83L45 143Z"/><circle class="sfl-apex" cx="145" cy="126" r="10"/><text class="sfl-big" x="145" y="181" text-anchor="middle">106</text><text class="sfl-small" x="145" y="209" text-anchor="middle">1 APEX · 30 SEAMS · 75 INTERIORS</text><text class="sfl-kicker" x="430" y="34" text-anchor="middle">B · EXACT 99-GATE FAN</text><path class="sfl-horizon" d="M292 312H568"/>${points}${labels}<text class="sfl-small" x="430" y="382" text-anchor="middle">99 = 9 × 11 · MARKERS 3 · 22 · 32 · 33</text><path class="sfl-open-arrow" d="M594 196H676"/><text class="sfl-open" x="635" y="181" text-anchor="middle">π ?</text><text class="sfl-kicker" x="815" y="34" text-anchor="middle">C · OPEN ADAPTER</text><line class="sfl-rail" x1="690" y1="240" x2="940" y2="240"/><g class="sfl-address"><circle cx="708" cy="240" r="11"/><text x="708" y="245">3</text><circle cx="788" cy="240" r="11"/><text x="788" y="245">22</text><path class="sfl-seam" d="M820 213L812 267M836 213L828 267"/><circle cx="870" cy="240" r="11"/><text x="870" y="245">32</text><circle cx="920" cy="240" r="11"/><text x="920" y="245">33</text></g><text class="sfl-word" x="815" y="300" text-anchor="middle">3–22 // 32–33</text><text class="sfl-small" x="815" y="329" text-anchor="middle">Δ = 19 // 10 · 1</text><circle class="sfl-alpha" cx="915" cy="104" r="18"/><text class="sfl-alpha-text" x="915" y="109" text-anchor="middle">α</text><path class="sfl-tether" d="M903 118Q850 153 833 211"/><circle class="sfl-balloon" cx="735" cy="111" r="16"/><path class="sfl-tether" d="M735 127Q756 167 788 211"/><text class="sfl-small" x="735" y="145" text-anchor="middle">1 BIT?</text><text class="sfl-warning" x="815" y="382" text-anchor="middle">α / BALLOON / π · OPEN · NOT IN THEOREM</text></g>`;
  }
  function plateSvgMarkup(){
    const xs=[145,355,645,855];
    const plates=FOUR_PLATES.map((plate,index)=>{const label=plate.kind==='PRIME'?`PRIME · p${plate.primeIndex}`:plate.identity;return `<g class="sfp-plate ${plate.kind.toLowerCase()}" transform="translate(${xs[index]} 218)"><rect x="-78" y="-92" width="156" height="184" rx="16"/><text class="sfp-number" y="4" text-anchor="middle">${plate.value}</text><text class="sfp-kind" y="43" text-anchor="middle">${label}</text><text class="sfp-reverse" y="69" text-anchor="middle">rev₁₀ → ${plate.reverse}</text></g>`}).join('');
    return `<g><rect class="sfp-sky" width="1000" height="380"/><rect class="sfp-water" y="276" width="1000" height="104"/><path class="sfp-floor" d="M0 338Q250 304 500 338T1000 338V380H0Z"/><g class="sfp-cloud"><circle cx="437" cy="57" r="26"/><circle cx="471" cy="45" r="36"/><circle cx="512" cy="57" r="28"/><rect x="420" y="57" width="115" height="25" rx="12"/></g><text class="sfp-cloud-word" x="478" y="68" text-anchor="middle">CL·O·UD</text>${plates}<path class="sfp-pair" d="M223 218H277"/><text class="sfp-pair-label" x="250" y="202" text-anchor="middle">REV A</text><path class="sfp-cut" d="M485 118L475 318M525 118L515 318"/><path class="sfp-pair" d="M723 218H777"/><text class="sfp-pair-label" x="750" y="202" text-anchor="middle">REV B</text><circle class="sfp-balloon" cx="505" cy="142" r="27"/><path class="sfp-string" d="M505 169V314"/><text class="sfp-bit" x="505" y="147" text-anchor="middle">b?</text><text class="sfp-title" x="500" y="20" text-anchor="middle">FOUR-PLATE REVERSAL LENS · ORIGINAL ABSTRACT DISPLAY</text><text class="sfp-boundary" x="500" y="367" text-anchor="middle">RED WITNESS · BLUE FRAME · GREEN RETURN · NO SCC-003 MAP</text></g>`;
  }
  function mount(doc){if(!doc||!doc.getElementById)return null;const svg=doc.getElementById('sccFanSpacingSvg'),plateSvg=doc.getElementById('sccFourPlateSvg');if(svg)svg.innerHTML=svgMarkup();if(plateSvg)plateSvg.innerHTML=plateSvgMarkup();if(!svg&&!plateSvg)return null;return Object.freeze({contract,fourPlateContract,gatePoints});}
  return Object.freeze({VERSION,SPACING_WORD,FOUR_PLATES,gatePoints,contract,reverseDigits,fourPlateContract,svgMarkup,plateSvgMarkup,mount});
});
