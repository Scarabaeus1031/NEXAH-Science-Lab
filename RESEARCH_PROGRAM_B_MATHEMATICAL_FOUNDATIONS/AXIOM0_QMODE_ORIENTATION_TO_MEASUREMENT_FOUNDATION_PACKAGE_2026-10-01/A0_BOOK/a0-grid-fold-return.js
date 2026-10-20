(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0GridFoldReturn=api;api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const cells=[[0,0],[1,0],[0,1],[1,1]],clone=x=>JSON.parse(JSON.stringify(x));
 function state(o={}){const s={selected:o.selected??1,keepV:o.keepV??true};if(!Number.isInteger(s.selected)||s.selected<0||s.selected>3||typeof s.keepV!=='boolean')throw Error('Invalid grid view');return s;}
 function inverse(observation){
  if(!observation||!Number.isInteger(observation.u)||observation.u<0||observation.u>2||!(observation.v===null||Number.isInteger(observation.v)))return {status:'INVALID',candidates:[]};
  const candidates=cells.filter(([x,y])=>x+y===observation.u&&(observation.v===null||x-y===observation.v)).map(p=>p.slice());
  return {status:candidates.length===1?'EXACT':candidates.length>1?'HOLD':'INVALID',candidates};
 }
 function snapshot(input={}){
  const s=state(input),[x,y]=cells[s.selected],u=x+y,v=x-y,observation={u,v:s.keepV?v:null};
  return {schema:'a0.grid-fold-return/1',state:s,source:[x,y],diagonal:{u,v},diamond:[u/Math.sqrt(2),v/Math.sqrt(2)],observation,return:inverse(observation),multiplicities:[1,2,1],
   boundary:'Declared 2x2 grid; u=x+y matches existing Atlas diagonal fold. Normalized (u,v) is an orthogonal reflection/rotation basis, not projection optics. Inverse reads observation only; source panel is comparison reference, not an inverse key. Sign v is symbolic grid orientation, not physical polarization.'};
 }
 function record(s){return {schema:'a0.grid-fold-view-record/1',reading:snapshot(s)};}
 function verify(r){try{return r?.schema==='a0.grid-fold-view-record/1'&&JSON.stringify(r)===JSON.stringify(record(r.reading.state))?'PASS':'INVALID';}catch{return 'INVALID';}}
 function drawing(input={}){
  const r=snapshot(input),colors=['#9bb7c5','#ffd36a','#55d7ec','#b68af4'],f=x=>Number(x.toFixed(6));
  const text=(x,y,t,color='#d9edf4',size=14)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui,sans-serif">'+t+'</text>';
  let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 310" style="display:block;width:100%;min-width:1120px" role="img" aria-label="Square to diamond to diagonal fold1 2 1 and information-bounded Return"><rect width="1120" height="310" rx="12" fill="#071b26"/>';
  const dot=(p,c,selected=false)=>'<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+(selected?9:6)+'" fill="'+c+'" stroke="'+(selected?'white':c)+'" stroke-width="2"/>';
  svg+=text(20,28,'1 · QUADRAT')+text(295,28,'2 · KARO: (u,v)/√2')+text(575,28,'3 · NUR u / + v')+text(850,28,'4 · RETURN');
  const square=p=>[55+140*p[0],215-140*p[1]],diamond=p=>[325+100*(p[0]+p[1])/Math.sqrt(2),155-100*(p[0]-p[1])/Math.sqrt(2)];
  for(const map of [square,diamond]){
   svg+='<polygon points="'+[0,1,3,2].map(i=>map(cells[i]).join(',')).join(' ')+'" fill="none" stroke="#456877" stroke-width="2"/>';
   cells.forEach((p,i)=>{const q=map(p);svg+=dot(q,colors[i],i===r.state.selected)+text(q[0]+12,q[1]-10,'('+p.join(',')+')',colors[i],12);});
  }
  svg+='<line x1="600" y1="155" x2="780" y2="155" stroke="#456877"/>';
  for(let u=0;u<3;u++)svg+=dot([600+90*u,155],u===r.observation.u?'#ffd36a':'#456877',u===r.observation.u)+text(586+90*u,130,'u='+u,'#d9edf4',12)+text(596+90*u,190,String(r.multiplicities[u]),'#b68af4',20);
  svg+=text(575,235,r.observation.v===null?'v fehlt · mittlere Faser hat 2 Kandidaten':'v behalten: '+r.observation.v,'#9bb7c5',12);
  const back=p=>[890+140*p[0],215-140*p[1]];
  svg+='<polygon points="'+[0,1,3,2].map(i=>back(cells[i]).join(',')).join(' ')+'" fill="none" stroke="#456877"/>';
  cells.forEach(p=>{const active=r.return.candidates.some(q=>q[0]===p[0]&&q[1]===p[1]),q=back(p);svg+=dot(q,active?'#55d7ec':'#263f4b',active);if(active)svg+=text(q[0]+10,q[1]-12,'('+p.join(',')+')','#d9edf4',12);});
  svg+=text(850,255,r.return.status,r.return.status==='EXACT'?'#63d9aa':'#ffd36a',18);
  return svg+text(20,292,'1:2:1 zählt Punkte pro Diagonale · identisches u allein unterscheidet (1,0) und (0,1) nicht.','#9bb7c5',13)+'</svg>';
 }
 function mount(doc,win){
  if(!doc||!doc.getElementById('gridFoldReturn'))return null;const el=id=>doc.getElementById(id);let s=state();
  function render(){const r=snapshot(s);el('gfrSelected').value=String(s.selected);el('gfrKeepV').checked=s.keepV;el('gfrDrawing').innerHTML=drawing(s);el('gfrStatus').textContent=r.return.status+' · u='+r.observation.u+' · v='+(r.observation.v===null?'NICHT ERHALTEN':r.observation.v)+' · '+r.return.candidates.length+' kompatible Adresse(n)';}
  el('gfrSelected').addEventListener('change',()=>{s=state({...s,selected:Number(el('gfrSelected').value)});render();});
  el('gfrKeepV').addEventListener('change',()=>{s=state({...s,keepV:el('gfrKeepV').checked});render();});
  el('gfrExport').addEventListener('click',()=>{const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(record(s),null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-grid-fold-return.json';a.click();win.URL.revokeObjectURL(url);});
  render();return {read:()=>clone(snapshot(s)),record:()=>record(s)};
 }
 return {state,inverse,snapshot,record,verify,drawing,mount};
});
