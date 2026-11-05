(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0RedBalloonStory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.1.0';
  const TAU=2*Math.PI;
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

  function contract(){
    return Object.freeze({
      schema:'nexah.a0.red-balloon-story/1',version:VERSION,
      classification:'SOURCE_BOUND_MATHFIELD_STORY_LENS',
      identityReuse:Object.freeze(['A0OE:PASCAL_PENTAGON_D5_TEST','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH']),
      scenes:STORIES.length,gates:99,rows:9,columns:11,ringSlots:32,evenSteps:16,oddGaps:16,
      binaryMask:'99 addressable one-bit slots; current fixture sets all slots to 1',
      phaseOverlay:'H_j=exp(i*2pi*(j-1)/99)',ledger:ledger(),inverseImaginary:'i^-1=-i',
      primeMask:Object.freeze({domain:'addresses 1..99',openAddresses:primeMask().holes,opaqueAddresses:primeMask().opaque,displayLanes:Object.freeze({seed:2,sixPlus:11,sixMinus:12})}),
      sourceContext:Object.freeze({record:'SF-NUMBERMAGICK-2025-AUDIT',graph:'G_T_PRIME_TRINITIES_CONNECTORS',vertices:7,edges:9,components:1,cycleRank:3,connector1032:'composite 2^4*3*43; historical connector vertex, not a prime or operator'}),
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

  function shellMarkup(){return `<header><div><div class="rb-kicker">The Red Balloon · one story · six controlled scenes</div><h4 id="redBalloonStoryHeading">One witness through a finite field.</h4></div><p>Ein gesetzter Witness tritt am SP-Pivot ein, durchläuft 99 adressierte Gates, erhält eine getrennte Phasenfarbe, passiert den 16+16-Paritätsring, schließt die Apertur und erscheint hinter einer deklarierten Primmaske. SCC‑003/Q106, das 99-Gate-Feld und die Displaymetaphern werden nicht gleichgesetzt.</p></header><div class="rb-story-layout"><figure class="rb-story-stage"><div id="redBalloonStorySvg"></div></figure><aside class="rb-story-console"><nav class="rb-scene-nav" aria-label="Red Balloon Szenen"><button type="button" data-rb-scene aria-pressed="true">01</button><button type="button" data-rb-scene aria-pressed="false">02</button><button type="button" data-rb-scene aria-pressed="false">03</button><button type="button" data-rb-scene aria-pressed="false">04</button><button type="button" data-rb-scene aria-pressed="false">05</button><button type="button" data-rb-scene aria-pressed="false">06</button></nav><div class="rb-story-reading"><small id="redBalloonStoryCounter">01 / 06</small><h5 id="redBalloonStoryTitle">One witness</h5><p id="redBalloonStoryCopy">Der Red Balloon beginnt als ein gesetztes Bit am SP-Pivot.</p><code id="redBalloonStoryFormula">b*=1 · SP=(0,0)</code></div><div class="rb-step-controls"><button type="button" id="redBalloonPrev">← zurück</button><button type="button" id="redBalloonNext">weiter →</button></div><div class="rb-aperture-control"><label for="redBalloonAlpha"><span>Alpha aperture</span><output id="redBalloonAlphaOut">Tα · 30°</output></label><input id="redBalloonAlpha" type="range" min="0" max="30" step="1" value="30"></div></aside></div><div class="rb-story-ledger"><div><b>99 = 9×11</b><span>adressierte Gates</span></div><div><b>32 = 16+16</b><span>Schritte und Lücken</span></div><div><b>Hj=eᶦθʲ</b><span>Farbe ≠ Bit</span></div><div><b>50=49+1</b><span>Aktiva = Passiva + Rest</span></div><div><b>i⁻¹=−i</b><span>Gegenorientierung</span></div><div><b>25 | 74</b><span>Primöffnungen | Vorhang</span></div></div><p class="rb-story-boundary"><strong>Grenze:</strong> Die Sequenz ist eine endliche, prüfbare Reader-Linse. Es gibt keine definierte Abbildung <code>Q106→G99</code>. Primzahlen wählen nur Öffnungen einer deklarierten Maske; sie schneiden kein Material. Die 6k±1-Lanes sind nicht die historischen rot/grün/blauen Prime Families, und Lotus ist nur eine Ansicht. Bahn, Ledger und Apertur sind Displayregeln, kein physikalischer Flow, Finanzmodell, Theorem oder Finding. THOS und Nautilus bleiben HOLD.</p>`}

  function mount(doc){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    let host=doc.getElementById('redBalloonStory');
    if(!host){
      const parent=doc.getElementById('red-balloon-mathfield-intake');if(!parent)return null;
      host=doc.createElement('section');host.id='redBalloonStory';host.className='red-balloon-story';host.setAttribute('aria-labelledby','redBalloonStoryHeading');host.dataset.scene='witness';host.innerHTML=shellMarkup();
      const proof=parent.querySelector('.proof-grid');parent.insertBefore(host,proof||null);
    }
    const svg=doc.getElementById('redBalloonStorySvg'),title=doc.getElementById('redBalloonStoryTitle'),copy=doc.getElementById('redBalloonStoryCopy'),formula=doc.getElementById('redBalloonStoryFormula'),counter=doc.getElementById('redBalloonStoryCounter'),alpha=doc.getElementById('redBalloonAlpha'),alphaOut=doc.getElementById('redBalloonAlphaOut');
    let index=doc.defaultView&&doc.defaultView.location&&doc.defaultView.location.hash==='#red-balloon-prime-curtain'?5:0;
    const render=()=>{const scene=STORIES[index],a=aperture(alpha?alpha.value:30);if(svg)svg.innerHTML=svgMarkup(index,a.alphaDegrees);if(title)title.textContent=scene.title;if(copy)copy.textContent=scene.copy;if(formula)formula.textContent=scene.formula;if(counter)counter.textContent=`${scene.number} / 06`;if(alphaOut)alphaOut.textContent=a.closed?'T₀ · CLOSED':`Tα · ${a.alphaDegrees.toFixed(0)}°`;host.dataset.scene=scene.id;host.dataset.aperture=a.state;host.querySelectorAll('[data-rb-scene]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));return Object.freeze({scene,a})};
    host.querySelectorAll('[data-rb-scene]').forEach((button,i)=>button.addEventListener('click',()=>{index=i;render()}));
    const prev=doc.getElementById('redBalloonPrev'),next=doc.getElementById('redBalloonNext');
    if(prev)prev.addEventListener('click',()=>{index=(index+STORIES.length-1)%STORIES.length;render()});
    if(next)next.addEventListener('click',()=>{index=(index+1)%STORIES.length;render()});
    if(alpha)alpha.addEventListener('input',render);
    render();return Object.freeze({render,getScene:()=>STORIES[index],contract});
  }

  return Object.freeze({VERSION,STORIES,isPrime,primeMask,gateRecords,parityRing,ledger,aperture,contract,svgMarkup,shellMarkup,mount});
});
