(function(root,factory){
  const adapter=typeof module==='object'&&module.exports?require('./a0-three-domain-joint-adapter.js'):root.A0ThreeDomainJointAdapter;
  const cutLens=typeof module==='object'&&module.exports?require('./a0-cut-q-lens-return-bench.js'):root.A0CutQLensReturnBench;
  const api=factory(adapter,cutLens);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0JointControlReturnAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(adapter,cutLens){
  'use strict';

  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const ILAU_ID='SG:LENS:ILAU_ORIENTATION';
  const SCHEMA='nexah.a0.joint-control-return-audit/1';
  const PORT_ORDINALS=Object.freeze({chemistry:1,life:2,physics:3});
  const CONTROL_POINTS=Object.freeze({C:Object.freeze({x:0,y:-1}),T:Object.freeze({x:0,y:0}),L:Object.freeze({x:-1,y:0}),R:Object.freeze({x:1,y:0})});
  const GATE_ORDER=Object.freeze([
    Object.freeze({key:'capture',label:'CAPTURE'}),
    Object.freeze({key:'touch',label:'TOUCH'}),
    Object.freeze({key:'witness',label:'WITNESS'}),
    Object.freeze({key:'kappa',label:'KAPPA'}),
    Object.freeze({key:'available',label:'AVAILABLE'}),
    Object.freeze({key:'cut',label:'CUT/Q'})
  ]);
  const copy=value=>JSON.parse(JSON.stringify(value));
  const uniq=items=>[...new Set((items||[]).map(String))];

  function ratioLens(large=63,small=1){
    if(!Number.isSafeInteger(large)||!Number.isSafeInteger(small)||large<0||small<0||large+small===0)throw new TypeError('ratio terms must be non-negative safe integers with positive total');
    const total=large+small;
    return Object.freeze({large,small,total,large_share:large/total,small_share:small/total,small_to_large:large===0?null:small/large,read:`${large}:${small}`,normalized:`${large}/${total} | ${small}/${total}`});
  }

  function controlFrame(side='R'){
    const selected=side==='L'?'L':'R',other=selected==='L'?'R':'L';
    const vertical={x:CONTROL_POINTS.C.x-CONTROL_POINTS.T.x,y:CONTROL_POINTS.C.y-CONTROL_POINTS.T.y};
    const horizontal={x:CONTROL_POINTS[selected].x-CONTROL_POINTS.T.x,y:CONTROL_POINTS[selected].y-CONTROL_POINTS.T.y};
    const rawDot=vertical.x*horizontal.x+vertical.y*horizontal.y,dot=Object.is(rawDot,-0)?0:rawDot;
    return Object.freeze({schema:'nexah.a0.ctrl-frame/1',points:CONTROL_POINTS,selected,other,turn:'90°|90°',dot,orthogonal:dot===0,mirror:Object.freeze({L:'R',R:'L'}),read:`C→T→${selected}`});
  }

  function ilauPartition(sourceKeys=[],targetKeys=[],unavailableKeys=[]){
    const source=new Set(uniq(sourceKeys)),target=new Set(uniq(targetKeys)),unavailable=new Set(uniq(unavailableKeys));
    const universe=uniq([...source,...target,...unavailable]).sort();
    const I=[],L=[],A=[],U=[];
    for(const key of universe){
      if(unavailable.has(key)){U.push(key);continue;}
      if(source.has(key)&&target.has(key))I.push(key);
      else if(source.has(key))L.push(key);
      else if(target.has(key))A.push(key);
    }
    const flat=[...I,...L,...A,...U],disjoint=new Set(flat).size===flat.length,exhaustive=flat.length===universe.length;
    return Object.freeze({schema:'nexah.a0.ilau-partition/1',identity:ILAU_ID,I:Object.freeze(I),L:Object.freeze(L),A:Object.freeze(A),U:Object.freeze(U),universe:Object.freeze(universe),counts:Object.freeze({I:I.length,L:L.length,A:A.length,U:U.length}),disjoint,exhaustive,read:`I${I.length}·L${L.length}·A${A.length}·U${U.length}`});
  }

  function returnGate(input={}){
    const touch=Boolean(input.touch),witness=input.witness===true,kappa=Number(input.kappa),requiredUnavailable=Boolean(input.requiredUnavailable);
    let status='EXACT_RETURN',exact=true,reason='TOUCH_KAPPA_WITNESS_HELD';
    if(!touch){status='HOLD_MISSING_TOUCH';exact=false;reason='TOUCH_REQUIRED';}
    else if(input.witness==null){status='HOLD_MISSING_WITNESS';exact=false;reason='WITNESS_REQUIRED';}
    else if(!witness){status='HOLD_CONFLICTING_WITNESS';exact=false;reason='WITNESS_REJECTED';}
    else if(!Number.isFinite(kappa)||kappa<=0||kappa>1){status='HOLD_INVALID_KAPPA';exact=false;reason='KAPPA_MUST_BE_IN_(0,1]';}
    else if(requiredUnavailable){status='HOLD_REQUIRED_INFORMATION_UNAVAILABLE';exact=false;reason='U_INTERSECTS_REQUIRED_RETURN_INPUT';}
    return Object.freeze({schema:'nexah.a0.return-gate/1',status,exact,touch,kappa:Number.isFinite(kappa)?kappa:null,witness:input.witness??null,requiredUnavailable,reason});
  }

  function gateBits(mask){
    if(!Number.isSafeInteger(mask)||mask<0||mask>63)throw new RangeError('phase-space mask must be an integer in [0,63]');
    const bits={};
    GATE_ORDER.forEach((gate,index)=>{bits[gate.key]=Boolean(mask&(1<<(5-index)));});
    return Object.freeze(bits);
  }

  function matrixCell(mask){
    const bits=gateBits(mask),failures=[];
    if(!bits.capture)failures.push('HOLD_CAPTURE');
    if(!bits.touch)failures.push('HOLD_MISSING_TOUCH');
    if(!bits.witness)failures.push('HOLD_CONFLICTING_WITNESS');
    if(!bits.kappa)failures.push('HOLD_INVALID_KAPPA');
    if(!bits.available)failures.push('HOLD_REQUIRED_INFORMATION_UNAVAILABLE');
    if(!bits.cut)failures.push('HOLD_INCOMPLETE_CUT_Q');
    const exact=failures.length===0;
    const category=exact?'exact':!bits.available?'unavailable':(!bits.touch||!bits.witness)?'conflict':'incomplete';
    return Object.freeze({mask,binary:mask.toString(2).padStart(6,'0'),bits,status:exact?'EXACT_RETURN':failures[0],exact,category,failures:Object.freeze(failures)});
  }

  function returnMatrix(){
    const states=Object.freeze(Array.from({length:64},(_,mask)=>matrixCell(mask)));
    const summary={total:states.length,exact:0,incomplete:0,conflict:0,unavailable:0};
    states.forEach(state=>{summary[state.category]+=1;});
    return Object.freeze({schema:'nexah.a0.return-matrix/1',gate_order:GATE_ORDER,states,summary:Object.freeze(summary)});
  }

  function audit(input={}){
    if(!adapter)throw new Error('three-domain adapter unavailable');
    const record=input.jointRecord;
    if(!record||record.schema!=='nexah.a0.three-domain-channel-joint/1')throw new TypeError('normalized jointRecord required');
    const domain=input.domain||'chemistry',channel=input.channel||'c10';
    const trace=adapter.trace(record,domain,channel),ratio=ratioLens(input.large??63,input.small??1);
    const ilau=ilauPartition(input.sourceKeys||adapter.CHANNELS.map(item=>item.key),input.targetKeys||adapter.CHANNELS.map(item=>item.key),input.unavailableKeys||[]);
    const frame=controlFrame(input.side),comparison=input.capture?adapter.compare(input.capture,input.currentRecord||record):Object.freeze({status:'HOLD_CAPTURE',exact:false,reason:'CAPTURE_REQUIRED'});
    const requiredUnavailable=Boolean(input.requireSelected)&&ilau.U.includes(channel);
    const gate=returnGate({touch:input.touch,witness:input.witness,kappa:ratio.large_share,requiredUnavailable});
    const cutReceipt=cutLens&&input.includeCut!==false?cutLens.evaluate({touched:['C1','C2','C3'],witness:input.witness!==false,tamper:Boolean(input.tamper)}):null;
    let status='EXACT_RETURN';
    if(!comparison.exact)status=comparison.status;
    else if(!gate.exact)status=gate.status;
    else if(cutReceipt&&!cutReceipt.exact_return)status='HOLD_INCOMPLETE_CUT_Q';
    const exact=status==='EXACT_RETURN';
    return Object.freeze({
      schema:SCHEMA,identity:IDENTITY,ilau_identity:ILAU_ID,status,exact,
      source_bound:true,source_generation:record.generation,source_fingerprint:record.fingerprint,port:Object.freeze({domain,ordinal:PORT_ORDINALS[domain],ordinal_is_address:false,address_series:[1031,1032,1033]}),
      selection:Object.freeze({domain,channel}),trace,ratio,control_frame:frame,ilau,gate,comparison,cut_q_receipt:cutReceipt,
      contracts:Object.freeze({feedback:false,writes_source:false,identity_reuse:Object.freeze([IDENTITY,ILAU_ID]),new_ids:Object.freeze([]),new_aliases:Object.freeze([]),new_relations:Object.freeze([]),claim:'deterministic interface audit; no scientific finding'})
    });
  }

  function exhaustiveBattery(record){
    if(!record||record.schema!=='nexah.a0.three-domain-channel-joint/1')throw new TypeError('normalized jointRecord required');
    const capture=adapter.capture(record),matrix=returnMatrix(),sides=['L','R'];
    const counts={cases:0,exact:0,hold:0,mismatches:0,ports:{},channels:{},sides:{L:0,R:0}},mismatch_samples=[];
    for(const state of matrix.states){
      for(const domain of Object.keys(PORT_ORDINALS)){
        for(const channel of adapter.CHANNELS.map(item=>item.key)){
          for(const side of sides){
            const result=audit({
              jointRecord:record,currentRecord:record,capture:state.bits.capture?capture:null,
              domain,channel,side,large:state.bits.kappa?63:0,small:1,
              touch:state.bits.touch,witness:state.bits.witness,
              unavailableKeys:state.bits.available?[]:[channel],requireSelected:true,tamper:!state.bits.cut
            });
            counts.cases+=1;counts[result.exact?'exact':'hold']+=1;
            counts.ports[domain]=(counts.ports[domain]||0)+1;
            counts.channels[channel]=(counts.channels[channel]||0)+1;
            counts.sides[side]+=1;
            if(result.status!==state.status){
              counts.mismatches+=1;
              if(mismatch_samples.length<8)mismatch_samples.push({mask:state.mask,binary:state.binary,domain,channel,side,expected:state.status,actual:result.status});
            }
          }
        }
      }
    }
    return Object.freeze({schema:'nexah.a0.return-battery/1',matrix_schema:matrix.schema,dimensions:Object.freeze({states:64,ports:3,channels:4,sides:2}),counts:Object.freeze(copy(counts)),pass:counts.cases===1536&&counts.exact===24&&counts.hold===1512&&counts.mismatches===0,mismatch_samples:Object.freeze(mismatch_samples)});
  }

  function svgMarkup(result){
    const selected=result?.control_frame?.selected||'R',trace=result?.trace,ratio=result?.ratio||ratioLens();
    const sideX=selected==='L'?112:348,otherX=selected==='L'?348:112;
    const channelColor=adapter?.CHANNELS?.find(item=>item.key===trace?.selection?.channel)?.color||'#22d3ee';
    return `<g class="jcra-ctrl"><path class="jcra-axis" d="M230 36V194M80 194H380"/><circle cx="230" cy="194" r="7"/><text x="238" y="185">T</text><text x="238" y="48">Cκ</text><text x="70" y="214">L</text><text x="382" y="214">R</text><path class="jcra-active" d="M230 194H${sideX}"/><path class="jcra-muted" d="M230 194H${otherX}"/><path class="jcra-brace" d="M230 74 Q${selected==='L'?158:302} 104 ${sideX} 194"/><text x="230" y="232" text-anchor="middle">CTRL · 90°|90° · ${selected}</text></g><g class="jcra-ratio" transform="translate(70 266)"><rect width="320" height="30" rx="8"/><rect class="large" width="${320*ratio.large_share}" height="30" rx="8"/><rect class="small" x="${320*ratio.large_share}" width="${Math.max(2,320*ratio.small_share)}" height="30"/><text x="160" y="21" text-anchor="middle">κ ${ratio.read} · ${ratio.normalized}</text></g><g class="jcra-trace" transform="translate(70 326)"><line x1="0" y1="0" x2="320" y2="0" style="stroke:${channelColor}"/><circle cx="${trace?160+trace.port.selectedContribution.re*120:160}" cy="${trace?trace.port.selectedContribution.im*-80:0}" r="6" style="fill:${channelColor}"/><text x="160" y="28" text-anchor="middle">${trace?`${trace.selection.domain.toUpperCase()} · ${trace.selection.label} · ${trace.selection.count}/${trace.selection.total}`:'SOURCE HOLD'}</text></g>`;
  }

  function mount(doc,win){
    const host=doc&&doc.getElementById('jointControlReturnAudit');
    if(!host||!adapter)return null;
    const q=id=>doc.getElementById(id),matrix=returnMatrix(),state={record:null,capture:null,side:'R',touch:true,witness:true,unavailable:false,matrixSelection:63,battery:null};
    let transport=null;
    const read=()=>({large:Number(q('jcraLarge').value),small:Number(q('jcraSmall').value),domain:q('jcraDomain').value,channel:q('jcraChannel').value,side:state.side,touch:state.touch,witness:state.witness,unavailableKeys:state.unavailable?[q('jcraChannel').value]:[],requireSelected:true});
    function renderMatrix(){
      const selected=matrix.states[state.matrixSelection];
      q('jcraReturnMatrix').innerHTML=matrix.states.map(item=>`<button type="button" class="jcra-matrix-cell ${item.category}${item.mask===state.matrixSelection?' selected':''}" data-mask="${item.mask}" role="gridcell" aria-label="state ${item.binary}: ${item.status}"><span>${item.binary}</span><small>${item.mask}</small></button>`).join('');
      q('jcraMatrixSummary').textContent=`64 STATES · ${matrix.summary.exact} EXACT · ${matrix.summary.incomplete} INCOMPLETE · ${matrix.summary.conflict} CONFLICT · ${matrix.summary.unavailable} U`;
      q('jcraMatrixDetail').textContent=`${selected.binary} · ${selected.status}\n${GATE_ORDER.map(gate=>`${gate.label}:${selected.bits[gate.key]?'1':'0'}`).join(' · ')}\n${selected.failures.length?selected.failures.join('\n'):'ALL SIX GATES HELD'}`;
      q('jcraBatteryStatus').textContent=state.battery?`${state.battery.pass?'PASS':'HOLD'} · ${state.battery.counts.cases} CASES · ${state.battery.counts.exact} EXACT · ${state.battery.counts.hold} HOLD · ${state.battery.counts.mismatches} MISMATCH`:(state.record?'READY · 64 × 3 × 4 × 2':'HOLD · SOURCE REQUIRED');
    }
    function render(){
      renderMatrix();
      if(!state.record){q('jcraStatus').textContent='HOLD · SOURCE REQUIRED';q('jcraSvg').innerHTML=svgMarkup(null);q('jcraReceipt').textContent=JSON.stringify({schema:SCHEMA,status:'HOLD_SOURCE',identity:IDENTITY},null,2);return null;}
      let result;
      try{result=audit({...read(),jointRecord:state.record,capture:state.capture,currentRecord:state.record});}
      catch(error){q('jcraStatus').textContent=`HOLD · ${error.message}`;return null;}
      host.dataset.status=result.status;q('jcraStatus').textContent=result.status.replaceAll('_',' · ');q('jcraSvg').innerHTML=svgMarkup(result);
      q('jcraRatio').textContent=`${result.ratio.read} → ${result.ratio.normalized}`;q('jcraIlau').textContent=`${result.ilau.read} · ${result.ilau.disjoint&&result.ilau.exhaustive?'PARTITION PASS':'PARTITION HOLD'}`;
      q('jcraTrace').textContent=`PORT ${result.port.ordinal} ≠ ADDRESS ${result.port.address_series.join('/')} · ${result.trace.selection.label} ${result.trace.selection.count}/${result.trace.selection.total}`;
      const view=Object.freeze({...result,phase_space:Object.freeze({schema:matrix.schema,summary:matrix.summary,selected:matrix.states[state.matrixSelection]}),battery:state.battery});
      q('jcraGate').textContent=`${result.gate.status} · ${result.comparison.status} · ${result.status}`;q('jcraReceipt').textContent=JSON.stringify(view,null,2);win.A0JointControlReturnAuditView=view;
      if(typeof win.CustomEvent==='function'&&typeof win.dispatchEvent==='function')win.dispatchEvent(new win.CustomEvent('a0-joint-control-return',{detail:view}));
      return result;
    }
    q('jcraRequest').addEventListener('click',()=>transport?.request());
    q('jcraCapture').addEventListener('click',()=>{if(state.record)state.capture=adapter.capture(state.record);render();});
    q('jcraMirror').addEventListener('click',()=>{state.side=state.side==='R'?'L':'R';render();});
    q('jcraTouch').addEventListener('click',()=>{state.touch=!state.touch;q('jcraTouch').setAttribute('aria-pressed',String(state.touch));render();});
    q('jcraWitness').addEventListener('click',()=>{state.witness=!state.witness;q('jcraWitness').setAttribute('aria-pressed',String(state.witness));render();});
    q('jcraUnavailable').addEventListener('click',()=>{state.unavailable=!state.unavailable;q('jcraUnavailable').setAttribute('aria-pressed',String(state.unavailable));render();});
    q('jcraReturnMatrix').addEventListener('click',event=>{const cell=event.target.closest('[data-mask]');if(!cell)return;state.matrixSelection=Number(cell.dataset.mask);render();});
    q('jcraBatteryRun').addEventListener('click',()=>{if(!state.record){render();return;}state.battery=exhaustiveBattery(state.record);render();});
    ['jcraLarge','jcraSmall','jcraDomain','jcraChannel'].forEach(id=>q(id).addEventListener('input',render));
    q('jcraExport').addEventListener('click',()=>{const result=render();if(!result)return;const blob=new win.Blob([JSON.stringify(result,null,2)],{type:'application/json'}),url=win.URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='a0-joint-control-return-audit.json';a.click();win.URL.revokeObjectURL(url);});
    transport=adapter.createTransport(win,{role:'sink',onRecord(record){state.record=record;state.battery=null;render();}});render();return Object.freeze({render,get state(){return copy(state);},request(){transport.request();},close(){transport.close();}});
  }

  return Object.freeze({IDENTITY,ILAU_ID,SCHEMA,PORT_ORDINALS,CONTROL_POINTS,GATE_ORDER,ratioLens,controlFrame,ilauPartition,returnGate,gateBits,matrixCell,returnMatrix,audit,exhaustiveBattery,svgMarkup,mount});
});
