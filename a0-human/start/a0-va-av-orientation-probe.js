(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0VaAvOrientationProbe=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.1.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const OWNER_CROSSWALK=Object.freeze({digits:Object.freeze(['9','6']),glyphs:Object.freeze(['V','A'])});
  const DIGIT_FLIP=Object.freeze({'9':'6','6':'9'});
  const GLYPH_FLIP=Object.freeze({V:'A',A:'V'});

  function assertPair(value,alphabet){
    if(typeof value!=='string'||value.length!==2||![...value].every(token=>alphabet.includes(token)))throw new TypeError(`Expected two-token ${alphabet.join('/')} pair`);
    return value;
  }

  function reverseOrder(value){
    return [...value].reverse().join('');
  }

  function complement(value){
    const alphabet=[...value].every(token=>token in DIGIT_FLIP)?DIGIT_FLIP:GLYPH_FLIP;
    assertPair(value,Object.keys(alphabet));
    return [...value].map(token=>alphabet[token]).join('');
  }

  function frameFlip(record){
    if(!record||typeof record.value!=='string')throw new TypeError('Frame record required');
    return Object.freeze({...record,frame:record.frame==='BACK'?'FRONT':'BACK',frameParity:(record.frameParity||0)^1});
  }

  function H(value){return reverseOrder(value)}
  function F(value){return complement(value)}
  function compose(outer,inner,value){return outer(inner(value))}

  function digitToGlyph(value){
    assertPair(value,['9','6']);
    return [...value].map(token=>token==='9'?'V':'A').join('');
  }

  function glyphToDigit(value){
    assertPair(value,['V','A']);
    return [...value].map(token=>token==='V'?'9':'6').join('');
  }

  function prefixedAxis(){
    return Object.freeze({down:'16',up:'19',fixedStem:'1',suffixAxis:'6|9',operation:'DIGIT_CONCATENATION_NOT_ADDITION'});
  }

  function arithmeticWindow(){
    return Object.freeze({values:Object.freeze([16,17,18,19]),exact:Object.freeze(['17-1=16','17+1=18','18=3*6','18+1=19']),boundary:'Exact local arithmetic does not identify the orientation operators.'});
  }

  function evaluate(value){
    const isDigits=/^[69]{2}$/.test(value),alphabet=isDigits?['9','6']:['V','A'];
    assertPair(value,alphabet);
    const h=H(value),f=F(value),foh=compose(F,H,value);
    const frameOnly=frameFlip({value:h,frame:'FRONT',frameParity:0});
    const frameAfterComposite=frameFlip({value:foh,frame:'FRONT',frameParity:0});
    return Object.freeze({
      input:value,H:h,F:f,FoH:foh,
      fFrameAfterH:frameOnly,fFrameAfterFoH:frameAfterComposite,
      interpretation:Object.freeze({
        H:'ORDER_REVERSAL',F:'TOKEN_COMPLEMENT',FoH:foh===value?'TWO_INVOLUTIONS_CANCEL':'NONTRIVIAL',
        fHo:'FRAME_FLIP_AFTER_ORDER_REVERSAL_PRESERVES_REVERSED_TOKENS',
        fFoH:'FRAME_FLIP_AFTER_TWO_CANCELING_TOKEN_INVOLUTIONS_PRESERVES_INPUT_TOKENS'
      })
    });
  }

  function buildRecord(){
    const digit=evaluate('96'),glyph=evaluate('VA');
    return Object.freeze({
      schema:'nexah.a0.va-av-69-96-orientation-probe/1',version:VERSION,identity:IDENTITY,
      status:'BOUNDED_ORIENTATION_PROBE_PASS',
      declaredCrosswalk:Object.freeze({'96':'VA','69':'AV'}),
      digit,glyph,prefixedAxis:prefixedAxis(),arithmetic:arithmeticWindow(),
      result:Object.freeze({
        reverse:'H gives 96->69 and VA->AV',
        complement:'F gives 96->69 and VA->AV under the declared token complement',
        composite:'F∘H returns 96 and VA because the two involutions cancel',
        frameAlternative:'f∘H may retain 69 and AV only when f changes frame metadata without complementing the tokens',
        literal_fFoH:'f∘F∘H returns the input tokens on the BACK frame because F and H cancel before f acts'
      }),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false}),
      boundary:'96/VA and 69/AV are an Owner-declared local view crosswalk. They are not numerical equality, etymology, a general glyph law, or a promoted F-A0 finding.'
    });
  }

  function createViewState(){
    return Object.freeze({operation:'READY',digits:'96',glyphs:'VA',frame:'FRONT',frameParity:0});
  }

  function applyOperation(operation,state=createViewState()){
    const op=String(operation||'RESET').toUpperCase();
    if(op==='RESET')return createViewState();
    const inputDigits='96',inputGlyphs='VA';
    const operations={
      H:{digits:H(inputDigits),glyphs:H(inputGlyphs),frame:'FRONT',frameParity:0},
      F:{digits:F(inputDigits),glyphs:F(inputGlyphs),frame:'FRONT',frameParity:0},
      FOH:{digits:compose(F,H,inputDigits),glyphs:compose(F,H,inputGlyphs),frame:'FRONT',frameParity:0},
      FHO:{digits:H(inputDigits),glyphs:H(inputGlyphs),frame:'BACK',frameParity:1},
      FFOH:{digits:compose(F,H,inputDigits),glyphs:compose(F,H,inputGlyphs),frame:'BACK',frameParity:1}
    };
    if(!operations[op])throw new RangeError(`Unknown view operation ${operation}`);
    return Object.freeze({operation:op,...operations[op]});
  }

  function svgMarkup(state=createViewState()){
    const back=state.frame==='BACK';
    const swap=state.digits==='69';
    const left=swap?'6':'9',right=swap?'9':'6';
    const leftGlyph=swap?'A':'V',rightGlyph=swap?'V':'A';
    return `<g class="vaav-frame${back?' is-back':''}"><path class="vaav-ring" d="M92 170 C92 75 308 75 308 170 C308 265 92 265 92 170Z"/><path class="vaav-axis" d="M200 58V282"/><path class="vaav-cross" d="M83 170H317"/><path class="vaav-diagonal" d="M119 89L281 251M281 89L119 251"/><circle class="vaav-still" cx="200" cy="170" r="12"/><text class="vaav-digit" x="112" y="159">${left}</text><text class="vaav-glyph" x="112" y="194">${leftGlyph}</text><text class="vaav-digit" x="274" y="159">${right}</text><text class="vaav-glyph" x="274" y="194">${rightGlyph}</text><text class="vaav-axis-label" x="208" y="76">19 · UP</text><text class="vaav-axis-label" x="208" y="274">16 · DOWN</text><text class="vaav-frame-label" x="200" y="320" text-anchor="middle">${state.frame} FRAME · ${state.operation}</text></g>`;
  }

  function viewRecord(state=createViewState()){
    return Object.freeze({
      ...buildRecord(),schema:'nexah.a0.va-av-69-96-orientation-view/1',view:Object.freeze({...state}),
      axis:prefixedAxis(),arithmetic:arithmeticWindow(),
      classification:'LOCAL_BOUNDED_VIEW',
      boundary:'Display operation only. Token orientation and FRONT/BACK frame are recorded independently.'
    });
  }

  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('vaAvOrientationProbe');
    if(!section)return null;
    const svg=doc.getElementById('vaAvOrientationSvg');
    const status=doc.getElementById('vaAvOrientationStatus');
    const digitOut=doc.getElementById('vaAvDigitOut');
    const glyphOut=doc.getElementById('vaAvGlyphOut');
    const frameOut=doc.getElementById('vaAvFrameOut');
    const opOut=doc.getElementById('vaAvOperatorOut');
    let state=createViewState();
    const render=()=>{
      section.dataset.operation=state.operation;
      section.dataset.frame=state.frame.toLowerCase();
      if(svg)svg.innerHTML=svgMarkup(state);
      if(status)status.textContent=`${state.operation} · ${state.digits}/${state.glyphs} · ${state.frame}`;
      if(digitOut)digitOut.textContent=state.digits;
      if(glyphOut)glyphOut.textContent=state.glyphs;
      if(frameOut)frameOut.textContent=`${state.frame} · parity ${state.frameParity}`;
      if(opOut)opOut.textContent=state.operation==='READY'?'INPUT HELD':`${state.operation} APPLIED`;
      return state;
    };
    const buttons=section.querySelectorAll?section.querySelectorAll('[data-vaav-operation]'):[];
    Array.from(buttons).forEach(button=>button.addEventListener('click',()=>{state=applyOperation(button.dataset.vaavOperation,state);render()}));
    const exportButton=doc.getElementById('vaAvOrientationExport');
    if(exportButton)exportButton.addEventListener('click',()=>{
      const record=viewRecord(state),json=JSON.stringify(record,null,2);
      if(host&&host.Blob&&host.URL&&typeof host.URL.createObjectURL==='function'&&doc.createElement){
        const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([json],{type:'application/json'}));link.download='a0-va-av-orientation-view.json';link.click();host.URL.revokeObjectURL(link.href);
      }
      section.dataset.lastExport=json;
    });
    render();
    return Object.freeze({getState:()=>state,apply(operation){state=applyOperation(operation,state);return render()},record:()=>viewRecord(state)});
  }

  return{VERSION,IDENTITY,OWNER_CROSSWALK,H,F,compose,frameFlip,digitToGlyph,glyphToDigit,prefixedAxis,arithmeticWindow,evaluate,buildRecord,createViewState,applyOperation,svgMarkup,viewRecord,mount};
});
