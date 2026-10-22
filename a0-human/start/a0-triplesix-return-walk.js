(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-orientation-controller-bench.js'):root.A0OrientationController);
  if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0TripleSixReturnWalk=api;api.mount(document,window);}
})(typeof globalThis==='undefined'?this:globalThis,function(C){
  'use strict';
  const SCHEMA='a0.triplesix-return-walk/1',clone=x=>JSON.parse(JSON.stringify(x));
  const states=C.s3PermutationRegister().states,byWord=Object.fromEntries(states.map(s=>[s.word,s]));
  const operators={identity:[],cycle:['cycle'],reverse:['reverse'],'cycle-reverse':['cycle','reverse'],'reverse-cycle':['reverse','cycle']};
  const canonical=x=>x&&typeof x==='object'?Array.isArray(x)?'['+x.map(canonical).join(',')+']':'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
  function config(s={word:'123',operator:'cycle-reverse',residual:'keep'}){
    if(!s||Object.keys(s).sort().join(',')!=='operator,residual,word'||!Object.hasOwn(byWord,s.word)||!Object.hasOwn(operators,s.operator)||!['keep','drop','wrong'].includes(s.residual))throw Error('Invalid TripleSix walk configuration');
    return clone(s);
  }
  function action(word,op,inverse=false){
    if(!Object.hasOwn(byWord,word)||!['cycle','reverse'].includes(op))throw Error('Invalid S3 action');
    return op==='reverse'?[...word].reverse().join(''):inverse?word.slice(-1)+word.slice(0,-1):word.slice(1)+word[0];
  }
  function transform(word,operator,inverse=false){
    if(!Object.hasOwn(byWord,word)||!Object.hasOwn(operators,operator))throw Error('Invalid transform');
    const path=inverse?[...operators[operator]].reverse():operators[operator];
    return path.reduce((w,op)=>action(w,op,inverse),word);
  }
  // Deliberately no source word / oracle argument. Decode only the lossy view and supplied sidecar.
  function reconstruct(observation){
    if(!observation||Object.keys(observation).sort().join(',')!=='axis,carrier,operator,side'||observation.carrier!=='S3'||!['A','B','C'].includes(observation.axis)||!Object.hasOwn(operators,observation.operator)||![null,-1,1].includes(observation.side))throw Error('Invalid typed observation');
    const transformedCandidates=states.filter(s=>s.axis===observation.axis&&(observation.side===null||s.side===observation.side));
    return transformedCandidates.map(s=>transform(s.word,observation.operator,true)).sort();
  }
  function run(input){
    const s=config(input),source=byWord[s.word],word=transform(s.word,s.operator),target=byWord[word];
    const observation={carrier:'S3',axis:target.axis,operator:s.operator,side:s.residual==='drop'?null:target.side*(s.residual==='wrong'?-1:1)};
    const candidates=reconstruct(observation),unique=candidates.length===1,exact=unique&&candidates[0]===source.word;
    const structural=candidates.every(w=>byWord[w].axis===source.axis),invariant=candidates.every(w=>[...w].sort().join('')==='123');
    return {source:{carrier:'S3',...clone(source)},transform:{operator:s.operator,steps:[...operators[s.operator]],word,axis:target.axis,side:target.side},
      cut:{map:'S3 -> {A,B,C}; forget parity orientation',axis:target.axis,fibre:states.filter(t=>t.axis===target.axis).map(t=>t.word),fibreSize:2},
      observation,residual:{mode:s.residual,suppliedSide:observation.side,requiredBits:1,sourceWordUsedByDecoder:false},
      reconstruction:{candidates,unique,word:unique?candidates[0]:null,status:unique?'UNIQUE_CANDIDATE':'HOLD_AMBIGUOUS'},
      returns:{exact:{status:exact?'PASS':unique?'FAIL':'HOLD',condition:'one reconstructed source word equals selected source word'},
        carrier:{status:'PASS',condition:'retained S3 provenance tag and declared source register; not recovered from appearance'},
        structural:{status:structural?'PASS':unique?'FAIL':'HOLD',condition:'all reconstructed candidates retain the source reversal-axis label'},
        invariant:{status:invariant?'PASS':'FAIL',condition:'symbol multiset {1,2,3} retained; weak invariant, not identity'}},
      boundary:'Selected six-state S3 quotient only; no multi-axis cube-fold reconstruction, glyph/OCR test, historical Janus choice, 74/222/294 map or physical mechanism.'};
  }
  function record(input){const s=config(input);return {schema:SCHEMA,config:s,reading:run(s),classification:'DECLARED_LOCAL_ENGINEERING_DEMONSTRATION'};}
  function verify(r){try{if(!r||Object.keys(r).sort().join(',')!=='classification,config,reading,schema'||r.schema!==SCHEMA)throw Error('schema');return {status:canonical(record(r.config))===canonical(r)?'PASS':'REJECT',boundary:'Deterministic record consistency, not provenance authentication or an exact-return verdict.'};}catch(error){return {status:'REJECT',reason:String(error.message||error)};}}
  function battery(){
    let cases=0,failures=[];
    for(const source of states)for(const operator of Object.keys(operators))for(const residual of ['keep','drop','wrong']){
      const s={word:source.word,operator,residual},r=run(s);cases++;
      const expected=residual==='keep'?'PASS':residual==='drop'?'HOLD':'FAIL';
      if(r.returns.exact.status!==expected||verify(record(s)).status!=='PASS')failures.push(s);
    }
    return {status:failures.length?'FAIL':'PASS',cases,failures,scope:'finite engineering controls for this declared six-state display; not a Lab run'};
  }
  const titles=['1 · Quelle','2 · Transformation','3 · Schnitt / Verlust','4 · Rekonstruktion','5 · Return-Prüfung'];
  const labels={identity:'Identität',cycle:'Positionen zyklisch verschieben',reverse:'Wortpositionen umkehren','cycle-reverse':'Verschieben → Umkehren','reverse-cycle':'Umkehren → Verschieben'};
  function diagram(r,stage){
    function word(w,x,title,color){let s='<text x="'+x+'" y="28" fill="#b7ccd6">'+title+'</text>';for(let i=0;i<3;i++)s+='<circle cx="'+(x+18+i*34)+'" cy="62" r="15" fill="#102735" stroke="'+color+'"/><text x="'+(x+18+i*34)+'" y="67" text-anchor="middle" fill="'+color+'">'+w[i]+'</text>';return s;}
    let s='<title>TripleSix source, declared transformation, lossy axis view and reconstruction</title>'+word(r.source.word,20,'QUELLE','#54d7ef');
    if(stage>=1)s+='<path d="M135 62H165" stroke="#b7ccd6"/>'+word(r.transform.word,180,'TRANSFORMIERT','#f3c25a');
    if(stage>=2)s+='<path d="M295 62H325" stroke="#b7ccd6"/><rect x="340" y="42" width="100" height="40" rx="8" fill="#242032" stroke="#bc94e8"/><text x="390" y="68" text-anchor="middle" fill="#dfbcff">ACHSE '+r.cut.axis+'</text><text x="340" y="110" fill="#b7ccd6">2 mögliche Seiten</text>';
    if(stage>=3)s+='<path d="M450 62H480" stroke="#b7ccd6"/><text x="500" y="48" fill="#b7ccd6">REKONSTRUIERT</text><text x="500" y="76" fill="#f3c25a">'+r.reconstruction.candidates.join(' / ')+'</text>';
    return s;
  }
  function mount(doc,win){
    const host=doc.getElementById('tripleSixReturnWalk');if(!host)return null;
    const el=id=>doc.getElementById(id);let selection=config(),stage=0;
    const word=el('s3WalkWord'),op=el('s3WalkOperator'),residual=el('s3WalkResidual');
    word.innerHTML=states.map(s=>'<option value="'+s.word+'">'+s.word+' · '+s.axis+(s.side>0?'+':'−')+'</option>').join('');
    function render(){
      const r=run(selection);word.value=selection.word;op.value=selection.operator;residual.value=selection.residual;
      el('s3WalkStage').textContent=titles[stage];el('s3WalkDiagram').innerHTML=diagram(r,stage);
      const text=[`S3 · ${r.source.word} · Achse ${r.source.axis} · Seite ${r.source.side>0?'+':'−'}`,
        `${labels[selection.operator]}: ${r.source.word} → ${r.transform.word}. Umkehrung kennt die umgekehrte Operatorreihenfolge.`,
        `Schnitt zeigt nur Achse ${r.cut.axis}. Verdeckte Kandidaten: ${r.cut.fibre.join(' / ')}. Restinformation: ${r.observation.side===null?'entfernt':r.observation.side>0?'+1':'−1'} (${selection.residual}).`,
        `${r.reconstruction.status} · Rückweg liefert ${r.reconstruction.candidates.join(' / ')}. Der Decoder erhält das Quellwort nicht.`,
        Object.entries(r.returns).map(([name,value])=>name.toUpperCase()+': '+value.status).join(' · ')];
      el('s3WalkReadout').textContent=text[stage];
      el('s3WalkLevels').hidden=stage<4;el('s3WalkLevels').textContent=Object.entries(r.returns).map(([name,v])=>name.toUpperCase()+': '+v.status+' — '+v.condition).join('\n');
      el('s3WalkBack').disabled=stage===0;el('s3WalkNext').disabled=stage===4;el('s3WalkExport').disabled=stage<4;
      el('s3WalkRecord').textContent=stage===4?JSON.stringify(record(selection),null,2):'Record wird nach der Return-Prüfung angezeigt.';
    }
    function select(){selection=config({word:word.value,operator:op.value,residual:residual.value});stage=0;render();el('s3WalkStatus').textContent='Auswahl geändert · neuer Lesegang ab Quelle; frühere Prüfung gilt nicht als diese Ausführung.';}
    for(const control of [word,op,residual])control.addEventListener('change',select);
    el('s3WalkBack').addEventListener('click',()=>{stage=Math.max(0,stage-1);render();});
    el('s3WalkNext').addEventListener('click',()=>{stage=Math.min(4,stage+1);render();});
    el('s3WalkAll').addEventListener('click',()=>{stage=4;render();});
    el('s3WalkReset').addEventListener('click',()=>{stage=0;render();el('s3WalkStatus').textContent='Lesegang zurückgesetzt · Auswahl beibehalten.';});
    el('s3WalkTests').addEventListener('click',()=>{const r=battery();el('s3WalkStatus').textContent=r.status+' · '+r.cases+' lokale Kontrollfälle · kein Lab-Run.';});
    el('s3WalkExport').addEventListener('click',()=>{
      if(stage<4)return;const r=record(selection);if(verify(r).status!=='PASS')throw Error('Record verification failed');
      const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(r,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-triplesix-return-walk.json';a.click();win.URL.revokeObjectURL(url);
      el('s3WalkStatus').textContent='Record-Konsistenz PASS · Exact Return '+r.reading.returns.exact.status+' · exportiert.';
    });
    el('s3WalkImport').addEventListener('change',async event=>{
      try{const file=event.target.files?.[0];if(!file)return;if(file.size>1024*1024)throw Error('Datei über 1 MiB');const r=JSON.parse(await file.text()),v=verify(r);el('s3WalkStatus').textContent=v.status+' · Recordprüfung ohne Zustandsübernahme'+(v.status==='PASS'?' · Exact Return '+r.reading.returns.exact.status:'');}
      catch(error){el('s3WalkStatus').textContent='REJECT · '+error.message;}finally{event.target.value='';}
    });
    doc.addEventListener('click',event=>{const button=event.target.closest?.('[data-s3-word]');if(!button||!Object.hasOwn(byWord,button.dataset.s3Word))return;selection={...selection,word:button.dataset.s3Word};stage=0;render();el('s3WalkStatus').textContent='Bestehende Registerauswahl übernommen · eigener Lesegang, keine anderen Bench-Werte geändert.';});
    render();const api={record:()=>record(selection),get stage(){return stage;}};win.A0TripleSixReturnWalkController=api;return api;
  }
  return {SCHEMA,config,action,transform,reconstruct,run,record,verify,battery,diagram,mount};
});
