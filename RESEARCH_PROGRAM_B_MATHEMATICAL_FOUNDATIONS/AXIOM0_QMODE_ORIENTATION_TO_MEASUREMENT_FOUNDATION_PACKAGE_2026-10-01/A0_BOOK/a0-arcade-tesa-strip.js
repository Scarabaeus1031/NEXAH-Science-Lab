(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ArcadeTesaStrip=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STONES=Object.freeze([31,25,13,23,11,5,41]);
  const ANCHOR=1;
  const SOURCE_MARKERS=Object.freeze({raster:'100×100',cikada:3301,scarab:1033,complexText:'33+0i'});

  const digitSum=n=>String(Math.abs(Number(n))).split('').reduce((sum,digit)=>sum+Number(digit),0);
  const reverse10=n=>Number(String(Math.abs(Number(n))).split('').reverse().join(''));
  const isPrime=n=>{n=Number(n);if(!Number.isSafeInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
  const crtCell=n=>Object.freeze({value:n,row:n%6,column:n%7,residue42:n%42});

  function analyse(){
    const scarab=SOURCE_MARKERS.scarab,cikada=SOURCE_MARKERS.cikada,difference=cikada-scarab;
    return Object.freeze({
      schema:'nexah.a0.arcade-tesa-strip/1',version:VERSION,identity:IDENTITY,
      classification:'SOURCE_BOUND_CRT_ADDRESS_STRIP',
      stones:STONES.map(crtCell),anchor:crtCell(ANCHOR),
      pair:Object.freeze({
        scarab,cikada,decimalReversal:reverse10(scarab)===cikada,
        scarabPrime:isPrime(scarab),cikadaPrime:isPrime(cikada),
        commonResidue42:scarab%42===cikada%42?scarab%42:null,
        commonResidue9:scarab%9===cikada%9?scarab%9:null,
        scarabDigitSum:digitSum(scarab),cikadaDigitSum:digitSum(cikada),
        difference,differenceInMod42Steps:difference/42
      }),
      parses:Object.freeze({raster:'100×100 DISPLAY RESOLUTION',complex:'33+0i = 33',cikada:'CIKADA 3301',scarab:'SCARAB 1033'}),
      bindings:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:TESSAREC','SG:LENS:ILAU_ORIENTATION']),
      authority:Object.freeze({newIdentity:false,newRelation:false,newStudy:false,newFinding:false,arcadeStateMutation:false,canonicalTrapdoorIdentity:false}),
      boundary:'The seven stones reproduce the supplied cyan CRT selections in source order. 1033 and 3301 meet exactly at residue 25 modulo 42 and residue 7 modulo 9; this does not validate the provisional EXP-45B spine. 33+0i equals 33, not 3301. The strip is a read-only address lens. Pink facelet-2 trapdoors remain a separate existing finite-cube contract.'
    });
  }

  function svgMarkup(selected=25){
    selected=STONES.includes(Number(selected))?Number(selected):25;
    const cells=STONES.map((value,index)=>{
      const x=52+index*72,cell=crtCell(value),active=value===selected;
      return `<g class="ats-stone${active?' active':''}" data-stone="${value}" transform="translate(${x} 92)"><path d="M-27 -22H21L29 0 21 22H-27L-35 0Z"/><circle cx="0" cy="0" r="${active?8:5}"/><text x="0" y="4" text-anchor="middle">${value}</text><text class="ats-address" x="0" y="38" text-anchor="middle">${cell.row}|${cell.column}</text></g>`;
    }).join('');
    const active=crtCell(selected),isGate=selected===25;
    return `<path class="ats-thread" d="M17 92H557"/>${cells}<g class="ats-anchor" transform="translate(52 28)"><circle r="12"/><text y="4" text-anchor="middle">1</text></g><path class="ats-anchor-line" d="M52 40V66"/><text class="ats-title" x="17" y="18">TESA STRIP · 7 SOURCE STONES · CRT 6×7</text><text class="ats-readout" x="557" y="18" text-anchor="end">STONE ${selected} · CELL ${active.row}|${active.column}</text><g class="ats-door${isGate?' active':''}" transform="translate(160 166)"><path d="M0 0H300V45H0Z"/><path d="M142 8L158 22 142 37 126 22Z"/><text x="16" y="28">${isGate?'25 · 1033 / 3301 COMMON CRT ADDRESS':'DISPLAY DOOR · ADDRESS ONLY'}</text></g><text class="ats-stop" x="310" y="230" text-anchor="middle">PINK FACELET‑2 TRAPDOOR = SEPARATE CONTRACT · NO STATE TRANSFER</text>`;
  }

  function mount(doc){
    const host=doc&&doc.getElementById('aeArcadeTesaStrip');
    if(!host)return null;
    const svg=doc.getElementById('aeArcadeTesaSvg'),select=doc.getElementById('aeArcadeTesaStone'),readout=doc.getElementById('aeArcadeTesaReadout');
    let selected=25;
    const render=()=>{const cell=crtCell(selected);svg.innerHTML=svgMarkup(selected);select.value=String(selected);readout.textContent=`STONE ${selected} · CRT (${cell.row},${cell.column}) · mod42=${cell.residue42}`;host.dataset.selected=String(selected);return cell;};
    select.addEventListener('change',()=>{selected=Number(select.value);render();});
    host.addEventListener('click',event=>{const stone=event.target&&event.target.closest&&event.target.closest('[data-stone]');if(stone){selected=Number(stone.getAttribute('data-stone'));render();}});
    render();
    const controller=Object.freeze({select(value){if(!STONES.includes(Number(value)))throw new RangeError('unknown TESA strip stone');selected=Number(value);return render();},record:analyse()});
    return controller;
  }

  return{VERSION,IDENTITY,STONES,ANCHOR,SOURCE_MARKERS,digitSum,reverse10,isPrime,crtCell,analyse,svgMarkup,mount};
});
