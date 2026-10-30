(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0MouseCutScanner=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.1.0';
  const MODES=Object.freeze({zero:Object.freeze({angle:0,label:'0° · ALONG'}),diagonal:Object.freeze({angle:45,label:'45° · CROSS'}),transverse:Object.freeze({angle:90,label:'90° · TRANSVERSE'}),tilted:Object.freeze({angle:102,label:'TILTED · LOCAL PLANE'})});
  const OCCUPIED=Object.freeze([1,2,3,6,7,8,13,14,17]);
  const CUT_PINS=Object.freeze([3,8,14,17]);
  const CHORDS=Object.freeze([[3,8],[8,14],[14,17]].map(pair=>Object.freeze(pair)));
  const SOURCE=Object.freeze({identity:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',carrier:'PURPLE_ADDRESS_POCKET',handle:Object.freeze([1087,7801]),gapRecord:'a0-scarab-pillar-projection.js#SCREEN_READ_TICKS',tiltedCue:'SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html#drawUranus',cueOnly:true});
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function runs(values=OCCUPIED){
    const sorted=[...new Set(values.map(Number))].filter(Number.isInteger).sort((a,b)=>a-b),out=[];
    for(const value of sorted){const last=out.at(-1);if(last&&value===last[1]+1)last[1]=value;else out.push([value,value])}
    return Object.freeze(out.map(pair=>Object.freeze(pair)));
  }
  function gaps(values=OCCUPIED,min=1,max=17){const set=new Set(values),out=[];for(let q=min;q<=max;q+=1)if(!set.has(q))out.push(q);return Object.freeze(out)}
  function normalizeState(input={}){
    const mode=String(input.mode||'zero'),cursor=clamp(Math.round(Number(input.cursor??1)),1,17);
    if(!Object.hasOwn(MODES,mode))throw Error(`unknown Mouse cut mode: ${mode}`);
    if(!Number.isFinite(Number(input.cursor??1)))throw Error('Mouse cursor must be finite');
    return Object.freeze({mode,cursor});
  }
  function buildRecord(input={}){
    const state=normalizeState(input),occupied=OCCUPIED.includes(state.cursor),arcRuns=runs(),missing=gaps();
    return Object.freeze({schema:'nexah.a0.mouse-cut-scanner-view/1',version:VERSION,identity:SOURCE.identity,source:SOURCE,state,cut:Object.freeze({angleDegrees:MODES[state.mode].angle,label:MODES[state.mode].label,localPlane:true,changesCarrier:false}),mouse:Object.freeze({kind:'MOVING_SAMPLE_HANDLE',gridAddress:state.cursor,screenRead:occupied?'OCCUPIED':'GAP',createsSample:false}),pinChordRecord:Object.freeze({pins:CUT_PINS,chords:CHORDS,cutCount:1,basis:'FOUR_EXISTING_OCCUPIED_RUN_ENDS',displayOnly:true}),arcRecord:Object.freeze({basis:'SCREEN_READ_CANDIDATE',quantizer:'q=round(1200*v)',occupied:OCCUPIED,missing,contiguousRuns:arcRuns,status:'HOLD',sourceRecordAvailable:false}),authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,astronomyClaim:false}),boundary:'The Mouse is a moving sampling handle over the existing Purple Address Pocket display. Four fixed display pins at q03, q08, q14 and q17 identify the ends of the four existing occupied runs; three display chords join them while one white cut follows the moving read point. Cut modes change only the local view plane. Gaps remain unsampled HOLD positions. No material connection, new operator, planetary, orbital or physical claim is made.'});
  }
  function pointFor(q){return 74+(q-1)*47}
  function gridMarkup(){let out='';for(let q=1;q<=17;q+=1){const x=pointFor(q);out+=`<line class="mcs-grid-line" x1="${x}" y1="70" x2="${x}" y2="402"/><text class="mcs-tick-label" x="${x}" y="430" text-anchor="middle">${q}</text>`}for(let y=70;y<=402;y+=55)out+=`<line class="mcs-grid-line horizontal" x1="74" y1="${y}" x2="826" y2="${y}"/>`;return out}
  function arcMarkup(){return runs().map(([start,end])=>{const x1=pointFor(start),x2=pointFor(end),mid=(x1+x2)/2,lift=22+Math.max(0,end-start)*12;return `<path class="mcs-run-arc" d="M${x1} 390 Q${mid} ${390-lift} ${x2} 390"/><line class="mcs-run-base" x1="${x1}" y1="390" x2="${x2}" y2="390"/>`}).join('')}
  function pinChordMarkup(cursor){
    const chords=CHORDS.map(([a,b],index)=>`<line class="mcs-chord" x1="${pointFor(a)}" y1="342" x2="${pointFor(b)}" y2="342"/><text class="mcs-chord-label" x="${(pointFor(a)+pointFor(b))/2}" y="330" text-anchor="middle">SEHNE ${index+1}</text>`).join('');
    const pins=CUT_PINS.map((q,index)=>`<g class="mcs-cut-pin${cursor===q?' active':''}" transform="translate(${pointFor(q)} 342)"><circle r="10"/><text y="4" text-anchor="middle">${index+1}</text></g>`).join('');
    return `${chords}${pins}`;
  }
  function silhouette(mode){
    if(mode==='zero')return '<path class="mcs-cut-shape" d="M250 155 L650 155 L724 250 L650 345 L250 345 L176 250 Z"/><path class="mcs-cut-inner" d="M250 155 L450 250 L250 345 M650 155 L450 250 L650 345"/>';
    if(mode==='diagonal')return '<path class="mcs-cut-shape" d="M284 118 L616 382 M616 118 L284 382"/><path class="mcs-cut-inner" d="M450 92 V408 M242 250 H658"/>';
    if(mode==='transverse')return '<path class="mcs-cut-shape" d="M450 92 L655 250 L450 408 L245 250 Z"/><path class="mcs-cut-inner" d="M450 154 L574 250 L450 346 L326 250 Z"/>';
    return '<g class="mcs-tilted-slices" transform="rotate(-12 450 250)"><path d="M300 126 C430 58 561 112 622 250 C561 388 430 442 300 374 C405 345 432 292 450 250 C432 208 405 155 300 126Z"/><path d="M600 126 C470 58 339 112 278 250 C339 388 470 442 600 374 C495 345 468 292 450 250 C468 208 495 155 600 126Z"/></g>';
  }
  function renderSvg(input={}){
    const record=buildRecord(input),{mode,cursor}=record.state,x=pointFor(cursor),angle=record.cut.angleDegrees,radians=angle*Math.PI/180,dx=Math.cos(radians)*118,dy=Math.sin(radians)*118,read=record.mouse.screenRead;
    return `${gridMarkup()}<path class="mcs-pocket-field" d="M176 250 L250 112 H650 L724 250 L650 388 H250 Z"/>${silhouette(mode)}<rect class="mcs-strip" x="435" y="72" width="30" height="316" rx="15"/>${arcMarkup()}${pinChordMarkup(cursor)}<line class="mcs-mouse-axis" x1="${(x-dx).toFixed(1)}" y1="${(250+dy).toFixed(1)}" x2="${(x+dx).toFixed(1)}" y2="${(250-dy).toFixed(1)}"/><g class="mcs-mouse ${read==='GAP'?'gap':''}" transform="translate(${x} 250)"><circle r="17"/><path d="M-25 0 H25 M0 -25 V25"/><path class="mcs-whisker" d="M-10 -10 -24 -23 M10 -10 24 -23 M-10 10 -24 23 M10 10 24 23"/></g><text class="mcs-mode-label" x="92" y="98">${esc(record.cut.label)} · GRID ${cursor.toString().padStart(2,'0')} · ${read}</text><text class="mcs-source-label" x="808" y="98" text-anchor="end">4 PINS → 3 CHORDS → 1 MOVING CUT</text><text class="mcs-hold-label" x="450" y="468" text-anchor="middle">PURPLE ARC = SCREEN-READ CANDIDATE · GAP = HOLD · NO PHYSICAL CLAIM</text>`;
  }
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('mouseCutScanner');if(!host)return null;
    const ids=['mouseCutScannerSvg','mouseCutScannerStatus','mouseCutScannerCursor','mouseCutScannerCursorOut','mouseCutScannerAddress','mouseCutScannerCut','mouseCutScannerArc','mouseCutScannerStep','mouseCutScannerBack','mouseCutScannerPlay','mouseCutScannerReset','mouseCutScannerExport'],nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)])),missing=ids.filter(id=>!nodes[id]);if(missing.length)throw Error(`Mouse Cut Scanner mount incomplete: ${missing.join(', ')}`);
    const modeButtons=[...doc.querySelectorAll('[data-mcs-mode]')];let state=normalizeState(),record=buildRecord(state),timer=null;
    function stop(){if(timer){(win.clearInterval||clearInterval)(timer);timer=null}nodes.mouseCutScannerPlay.textContent='PLAY SCAN';nodes.mouseCutScannerPlay.setAttribute('aria-pressed','false')}
    function render(){record=buildRecord(state);host.dataset.mode=state.mode;host.dataset.read=record.mouse.screenRead.toLowerCase();nodes.mouseCutScannerSvg.innerHTML=renderSvg(state);nodes.mouseCutScannerStatus.textContent=`${MODES[state.mode].label} · q${state.cursor.toString().padStart(2,'0')} · ${record.mouse.screenRead}`;nodes.mouseCutScannerCursor.value=String(state.cursor);nodes.mouseCutScannerCursorOut.textContent=`q ${state.cursor.toString().padStart(2,'0')} / 17`;nodes.mouseCutScannerAddress.textContent=`q ${state.cursor} / 17 · ${record.mouse.screenRead}`;nodes.mouseCutScannerCut.textContent=`${record.cut.angleDegrees}° · LOCAL VIEW PLANE`;nodes.mouseCutScannerArc.textContent='4 PINS · 3 CHORDS · 1 CUT';modeButtons.forEach(button=>button.classList.toggle('primary',button.dataset.mcsMode===state.mode));win.A0MouseCutScannerView=record;if(win.dispatchEvent&&win.CustomEvent)win.dispatchEvent(new win.CustomEvent('a0:mouse-cut-scanner',{detail:record}));return record}
    function setState(next){state=normalizeState({...state,...next});return render()}
    function step(delta=1){const next=((state.cursor-1+delta+17)%17)+1;return setState({cursor:next})}
    function play(){if(timer){stop();return}nodes.mouseCutScannerPlay.textContent='PAUSE SCAN';nodes.mouseCutScannerPlay.setAttribute('aria-pressed','true');timer=(win.setInterval||setInterval)(()=>step(1),520)}
    modeButtons.forEach(button=>button.addEventListener('click',()=>{stop();setState({mode:button.dataset.mcsMode})}));nodes.mouseCutScannerCursor.addEventListener('input',()=>{stop();setState({cursor:Number(nodes.mouseCutScannerCursor.value)})});nodes.mouseCutScannerStep.addEventListener('click',()=>{stop();step(1)});nodes.mouseCutScannerBack.addEventListener('click',()=>{stop();step(-1)});nodes.mouseCutScannerPlay.addEventListener('click',play);nodes.mouseCutScannerReset.addEventListener('click',()=>{stop();setState({mode:'zero',cursor:1})});nodes.mouseCutScannerExport.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-mouse-cut-scanner-view.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,play,stop,step,setState,get state(){return state},get record(){return record}})
  }
  return{VERSION,MODES,OCCUPIED,CUT_PINS,CHORDS,SOURCE,runs,gaps,normalizeState,buildRecord,pointFor,pinChordMarkup,renderSvg,mount};
});
