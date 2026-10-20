(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-gh-hinge.js'):root.A0GHHinge);
  if(node)module.exports=api;else{root.A0CodeCalendarLens=api;if(root.document)api.mount(root.document);}
})(typeof globalThis==='undefined'?this:globalThis,function(G){
  'use strict';
  const pairs=[['123','321'],['132','231'],['213','312']],ratios=[[3,4],[2,3],[1,2]],clone=x=>JSON.parse(JSON.stringify(x));
  function validate(s){if(!s||Object.keys(s).sort().join(',')!=='axis,direction,ratio'||!Number.isInteger(s.axis)||s.axis<0||s.axis>2||!Number.isInteger(s.ratio)||s.ratio<0||s.ratio>2||![1,-1].includes(s.direction))throw Error('invalid comparator state');return s;}
  function initial(){return{axis:0,ratio:0,direction:1};}
  function reverse(s){validate(s);return{...s,direction:-s.direction};}
  function snapshot(s){
    validate(s);const [a,b]=ratios[s.ratio],words=pairs[s.axis],dates=G.calendarWitnesses();
    return{schema:'a0.code-calendar-lens/1',state:clone(s),arithmetic:[{expression:'3²',value:3**2},{expression:'2³',value:2**3},{expression:'2×5',value:2*5}],dates,
      selectedWords:s.direction===1?[...words]:[...words].reverse(),ratio:{a,b,value:a/b},
      addresses:(s.direction===1?[[7,9],[8,10]]:[[9,7],[10,8]]),
      calendarBinding:null,amPmAssignment:null,ratioToAxisBinding:null,fold29Rule:null,
      boundary:'Independent comparison selectors; no recovered ratio-to-axis, AM/PM, date-to-motion or 29-pose turn rule.'};
  }
  function test(){
    let checks=0;const failures=[],ok=(condition,label)=>{checks++;if(!condition)failures.push(label);};
    const base=snapshot(initial());ok(JSON.stringify(base.arithmetic.map(x=>x.value))==='[9,8,10]','arithmetic');
    ok(JSON.stringify(base.dates.map(x=>x.year))==='[1974,1974,1974,1972]','3+1 source years');
    ok(JSON.stringify(base.dates.map(x=>x.valid))==='[true,true,false,true]','source date validity');
    for(let axis=0;axis<3;axis++)for(let ratio=0;ratio<3;ratio++)for(const direction of [1,-1]){
      const s={axis,ratio,direction},r=snapshot(s),other=snapshot(reverse(s));
      ok(JSON.stringify(reverse(reverse(s)))===JSON.stringify(s),'double reversal');
      ok(r.selectedWords[0].split('').reverse().join('')===r.selectedWords[1],'word reversal');
      ok(JSON.stringify(other.addresses)===JSON.stringify(r.addresses.map(([a,b])=>[b,a])),'address inverse');
      ok(r.ratio.value>0&&r.ratio.value<1,'bounded ratio');
      ok(r.calendarBinding===null&&r.amPmAssignment===null&&r.ratioToAxisBinding===null&&r.fold29Rule===null,'open bindings');
    }
    return{status:failures.length?'FAIL':'PASS',checks,failures,scope:'Arithmetic, original date witnesses and independent comparator reversals only; not a motion-law test.'};
  }
  function drawing(s){
    const r=snapshot(s),x=75*r.ratio.value,y=150,rhs=r.selectedWords;
    return '<title>V-Prüfskizze: Breite zu Höhe '+r.ratio.a+':'+r.ratio.b+'; Wortpaar umschaltbar, keine mechanische Faltung</title><path d="M'+(240-x)+',50 L240,'+(50+y)+' L'+(240+x)+',50" fill="none" stroke="#c78af0" stroke-width="4"/><path d="M240,30V220" stroke="#ffd36b" stroke-dasharray="5 5"/><circle cx="240" cy="200" r="5" fill="#ffd36b"/><text x="20" y="245" fill="#e4f5ff">'+rhs[0]+' ↔ '+rhs[1]+' · Verhältnis '+r.ratio.a+':'+r.ratio.b+'</text><text x="20" y="270" fill="#b8cfda">Deklarierte V-Skizze, kein Scharnier-/Origamimodell</text>';
  }
  function mount(doc){
    if(!doc.getElementById('codeCalendarLens'))return null;
    const el=id=>doc.getElementById(id);let state=initial(),anchor=null;
    function render(){const r=snapshot(state);el('codeCalendarSvg').innerHTML=drawing(state);
      el('codeCalendarDates').textContent=r.dates.map(d=>d.label+' · '+(d.valid?'Kalenderdatum gültig':'VOID DATE · kalenderungültig, Quelltext erhalten')).join('\n');
      el('codeCalendarReadout').textContent=r.selectedWords.join(' → ')+' · Adressen '+r.addresses.map(p=>p.join(' → ')).join(' / ')+' · Verhältnis '+r.ratio.a+':'+r.ratio.b+' unabhängig gewählt';
      el('codeCalendarRecord').textContent=JSON.stringify(r,null,2);el('codeCalendarReturn').disabled=!anchor;
      el('codeCalendarAxis').value=String(state.axis);el('codeCalendarRatio').value=String(state.ratio);return r;}
    for(const [id,key] of [['codeCalendarAxis','axis'],['codeCalendarRatio','ratio']])el(id).addEventListener('change',()=>{const next={...state,[key]:Number(el(id).value)};validate(next);state=next;render();});
    el('codeCalendarReverse').addEventListener('click',()=>{state=reverse(state);render();});
    el('codeCalendarCapture').addEventListener('click',()=>{anchor=clone(state);render();});
    el('codeCalendarReturn').addEventListener('click',()=>{if(anchor)state=clone(anchor);render();});
    el('codeCalendarTest').addEventListener('click',()=>{const r=test();el('codeCalendarTests').textContent=r.status+' · '+r.checks+' Prüfungen · '+r.scope;});
    render();return{snapshot:()=>snapshot(state),render};
  }
  return{initial,reverse,snapshot,test,drawing,mount};
});
