(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0CutQLensReturnBench=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const SOURCE='A0_FIELD_FIXTURE_31_33_1024_1031_1033';
  const CUTS=Object.freeze([
    Object.freeze({id:'C1',label:'CUT · ROOT WINDOW',values:[31,32,33],read:'31 | 32 | 33',witness:'31+33=64=2×32'}),
    Object.freeze({id:'C2',label:'Q° · OFFSET LENS',values:[7,8,9],read:'1024 + [7 | 8 | 9]',witness:'7+9=16=2×8'}),
    Object.freeze({id:'C3',label:'RETURN · ADDRESS',values:[1031,1032,1033],read:'1031 | 1032 | 1033',witness:'1031+1033=2064=2×1032'})
  ]);
  const LISSAJOUS_WINDOWS=Object.freeze([
    Object.freeze({address:7,plane:'AM',pair:'XY'}),
    Object.freeze({address:8,plane:'VM',pair:'YZ'}),
    Object.freeze({address:9,plane:'PM',pair:'ZX'})
  ]);

  function relation(values){
    return values[0]+values[2]===2*values[1];
  }

  function locateLissajousWindow(cut,exactReturn){
    if(!cut.touched)return{status:'OPEN',candidates:LISSAJOUS_WINDOWS,selected:null};
    if(!cut.pass)return{status:'REFUSED_CONFLICT',candidates:LISSAJOUS_WINDOWS,selected:null};
    const selected=LISSAJOUS_WINDOWS.find(item=>item.address===cut.values[1])||null;
    return{
      status:exactReturn?'LOCATED_CONFIRMED':'LOCATED_PENDING_RETURN',
      candidates:LISSAJOUS_WINDOWS,
      selected,
      rule:'Declared view adapter: ordered TESA window 7|8|9 reads AM|VM|PM; midpoint 8 selects VM/YZ.',
      writes_source:false
    };
  }

  function evaluate(input){
    const touched=Array.isArray(input&&input.touched)?input.touched:[];
    const tamper=Boolean(input&&input.tamper);
    const witness=input&&input.witness!==false;
    const cuts=CUTS.map((cut,index)=>{
      const values=cut.values.slice();
      if(tamper&&index===1)values[1]=10;
      return Object.assign({},cut,{values,pass:relation(values),touched:touched.includes(cut.id)});
    });
    const complete=cuts.every(cut=>cut.touched);
    const consistent=cuts.every(cut=>cut.pass);
    let status='OPEN';
    if(complete&&!witness)status='HOLD_MISSING_WITNESS';
    else if(complete&&!consistent)status='VIEW_INDUCED';
    else if(complete&&consistent)status='INVARIANT_CANDIDATE';
    const exactReturn=complete&&consistent&&witness;
    return {
      schema:'A0_CUT_Q_LENS_TOUCH_RECEIPT/v1',
      identity:IDENTITY,
      source:SOURCE,
      route:['CUT','Q°_LENS','TOUCH','RETURN_RECEIPT'],
      status,
      complete,
      consistent,
      witness,
      exact_return:exactReturn,
      cuts,
      tesa_lissajous_window:locateLissajousWindow(cuts[1],exactReturn),
      arithmetic:{
        seed:'16+17=33',phase:'31+33=64=2^6',midpoint:'(31+33)/2=32=2^5',lift:'32^2=1024',address:'1024+[7,8,9]=[1031,1032,1033]'
      },
      boundary:'Deterministic engineering receipt; no scientific finding, carrier, operator or graph relation.'
    };
  }

  function mount(doc,win){
    const host=doc&&doc.getElementById('cutQLensReturnBench');
    if(!host)return null;
    const state={touched:[],tamper:false,witness:true};
    const status=doc.getElementById('cutQLensStatus');
    const receipt=doc.getElementById('cutQLensReceipt');
    const gate=doc.getElementById('cutQLensGate');
    const windowOut=doc.getElementById('cutQLensWindow');
    const tamperButton=doc.getElementById('cutQLensTamper');
    const witnessButton=doc.getElementById('cutQLensWitness');
    const touchButtons=[...host.querySelectorAll('[data-cql-touch]')];

    function render(){
      const result=evaluate(state);
      host.dataset.status=result.status;
      status.textContent=result.status.replaceAll('_',' · ');
      gate.textContent=result.exact_return?'CLOSED · EXACT VIEW RETURN':result.complete?'HOLD · RECEIPT REFUSED':'OPEN · TOUCH ALL 3 CUTS';
      const located=result.tesa_lissajous_window;
      windowOut.textContent=located.selected?`${located.status.replaceAll('_',' · ')} · TESA ${located.selected.address} → ${located.selected.plane}/${located.selected.pair}`:located.status.replaceAll('_',' · ');
      result.cuts.forEach(cut=>{
        const card=host.querySelector(`[data-cql-cut="${cut.id}"]`);
        if(!card)return;
        card.dataset.pass=String(cut.pass);
        card.dataset.touched=String(cut.touched);
        card.querySelector('[data-cql-values]').textContent=cut.values.join(' | ');
        card.querySelector('[data-cql-relation]').textContent=cut.pass?'a+c = 2b · PASS':'a+c ≠ 2b · CONFLICT';
      });
      touchButtons.forEach(button=>button.setAttribute('aria-pressed',String(state.touched.includes(button.dataset.cqlTouch))));
      tamperButton.setAttribute('aria-pressed',String(state.tamper));
      witnessButton.setAttribute('aria-pressed',String(!state.witness));
      receipt.textContent=JSON.stringify(result,null,2);
      return result;
    }

    touchButtons.forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.cqlTouch;
      if(!state.touched.includes(id))state.touched.push(id);
      render();
    }));
    doc.getElementById('cutQLensRun').addEventListener('click',()=>{state.touched=CUTS.map(c=>c.id);render();});
    tamperButton.addEventListener('click',()=>{state.tamper=!state.tamper;render();});
    witnessButton.addEventListener('click',()=>{state.witness=!state.witness;render();});
    doc.getElementById('cutQLensReset').addEventListener('click',()=>{state.touched=[];state.tamper=false;state.witness=true;render();});
    doc.getElementById('cutQLensExport').addEventListener('click',()=>{
      const result=render();
      const blob=new win.Blob([JSON.stringify(result,null,2)],{type:'application/json'});
      const link=doc.createElement('a');
      link.href=win.URL.createObjectURL(blob);
      link.download='a0-cut-q-lens-touch-receipt.json';
      link.click();
      win.URL.revokeObjectURL(link.href);
    });
    return {state,render,evaluate};
  }

  return {IDENTITY,SOURCE,CUTS,LISSAJOUS_WINDOWS,relation,locateLissajousWindow,evaluate,mount};
});
