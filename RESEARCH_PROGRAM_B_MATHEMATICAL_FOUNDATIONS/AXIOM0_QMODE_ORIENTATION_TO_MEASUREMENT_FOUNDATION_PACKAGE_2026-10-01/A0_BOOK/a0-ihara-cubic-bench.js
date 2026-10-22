/* Source-owned finite G(10,2) adjacency, manual directed-edge walk.
   C/D are ordered local choices, not globally named vertices or spatial turns. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./assets/a0-ihara-hashimoto-model.js'):root.A0IharaHashimotoModel);
 if(node)module.exports=api;else{root.A0IharaCubicBench=api;root.A0IharaCubicController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(M){
 'use strict';
 const SCHEMA='a0.ihara-cubic-bench/1',GRAPH='G(10,2)',LIMIT=128,clone=x=>JSON.parse(JSON.stringify(x));
 const graph=M.makeGraph('dodecahedron'),edges=M.directed(graph),index=new Map(edges.map((e,i)=>[e.join(','),i]));
 function valid(s){if(!s||!Number.isInteger(s.edgeIndex)||s.edgeIndex<0||s.edgeIndex>=edges.length||!Number.isSafeInteger(s.revision)||s.revision<0||!Array.isArray(s.history)||s.history.length>LIMIT)throw Error('invalid cubic state');return s;}
 function create(edgeIndex=0){return valid({edgeIndex,revision:0,history:[],lastAttempt:null,lastCommitted:null,status:'READY'});}
 function choices(s){
  valid(s);const t=M.transition(graph,s.edgeIndex);
  return{incoming:t.edge.slice(),allowed:t.allowed.map(e=>e.slice()).sort((a,b)=>a[1]-b[1]),blocked:t.blocked.slice()};
 }
 function step(s,branch){
  valid(s);if(!['c','d','reverse'].includes(branch))throw Error('invalid cubic branch');
  if(s.history.length>=LIMIT)return{...clone(s),status:'HOLD_JOURNAL_FULL'};
  const c=choices(s),out=branch==='reverse'?c.blocked:c.allowed[branch==='c'?0:1],from=s.edgeIndex,to=index.get(out.join(','));
  if(to===undefined||c.allowed.length!==2)throw Error('cubic source adjacency unavailable');
  const accepted=branch!=='reverse',attempt={revision:s.revision+1,branch,incoming:c.incoming,candidate:out,fromIndex:from,toIndex:to,committed:accepted,verdict:accepted?'COMMITTED':'BLOCK'};
  return{edgeIndex:accepted?to:from,revision:attempt.revision,history:[...clone(s.history),attempt],lastAttempt:attempt,lastCommitted:accepted?attempt:clone(s.lastCommitted),status:accepted?'COMMITTED':'BLOCKED_IMMEDIATE_REVERSE'};
 }
 function read(s){
  const c=choices(s),a=s.lastAttempt;
  return{schema:SCHEMA,graph:GRAPH,source:'assets/a0-ihara-hashimoto-model.js',vertices:20,undirectedEdges:30,directedCount:60,degree:3,
   edgeIndex:s.edgeIndex,revision:s.revision,current:c.incoming,allowed:c.allowed,blocked:c.blocked,status:s.status,
   channel:a?{incoming:{from:a.incoming[0],to:a.incoming[1]},candidate:{from:a.candidate[0],to:a.candidate[1]},verdict:a.verdict,committed:a.committed}:
    {incoming:{from:c.incoming[0],to:c.incoming[1]},candidate:{from:c.allowed[0][0],to:c.allowed[0][1]},verdict:'READY',committed:false},
   projectionChannel:s.lastCommitted?{incoming:{from:s.lastCommitted.incoming[0],to:s.lastCommitted.incoming[1]},candidate:{from:s.lastCommitted.candidate[0],to:s.lastCommitted.candidate[1]}}:
    {incoming:{from:c.incoming[0],to:c.incoming[1]},candidate:{from:c.allowed[0][0],to:c.allowed[0][1]}},
   lastCommitted:clone(s.lastCommitted),history:clone(s.history),
   branchRule:'C=lower numeric allowed target; D=higher numeric allowed target; re-evaluated at each incoming edge',
   sharedClock:false,primeAddressMapping:null,wholeMachineReturn:false};
 }
 const label=e=>e.map(v=>graph.labels[v]).join('→');
 function drawing(s){
  const c=choices(s),xy=i=>[190+graph.positions[i][0]*140,150+graph.positions[i][1]*125];
  let svg='<svg viewBox="0 0 380 310" role="img" aria-label="G(10,2): aktuelle gerichtete Kante und zwei erlaubte Fortsetzungen"><title>20 Knoten · 30 Kanten · 60 gerichtete Kantenzustände</title><defs>';
  for(const [i,color] of ['#51d9e8','#e38edd','#e8bb65'].entries())svg+='<marker id="cubic-arrow-'+i+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="'+color+'"/></marker>';
  svg+='</defs>';
  for(const [a,b] of graph.edges){const p=xy(a),q=xy(b);svg+='<path d="M'+p.join(' ')+' L'+q.join(' ')+'" stroke="#355362" fill="none"/>';}
  for(const [i,[edge,color]] of [[c.incoming,'#51d9e8'],[c.allowed[0],'#e38edd'],[c.allowed[1],'#e8bb65']].entries()){
   const p=xy(edge[0]),q=xy(edge[1]);svg+='<path d="M'+p.join(' ')+' L'+q.join(' ')+'" stroke="'+color+'" stroke-width="4" fill="none" marker-end="url(#cubic-arrow-'+i+')"/>';
  }
  for(let i=0;i<20;i++){const p=xy(i);svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(c.incoming.includes(i)?5:3)+'" fill="'+(i===c.incoming[1]?'#fff':'#91adba')+'"><title>'+graph.labels[i]+' · ID '+i+'</title></circle>';}
  return svg+'</svg>';
 }
 function mount(doc,win){
  const root=doc.querySelector('[data-ihara-cubic-fork]');if(!root)return null;
  const el=id=>doc.getElementById(id);let state=create();const subscribers=new Set();
  function render(){
   const r=read(state);root.dataset.branch=state.lastAttempt?.branch||'c';root.dataset.status=r.status;
   el('cubicReadout').textContent=r.status+' · aktuell '+label(r.current)+' · Kantenadresse '+r.edgeIndex+'/59 · Revision '+r.revision+'\nC: '+label(r.allowed[0])+' · D: '+label(r.allowed[1])+' · gesperrt: '+label(r.blocked);
   el('cubicSvg').innerHTML=drawing(state);el('cubicLedger').textContent=JSON.stringify(r,null,2);
   for(const button of root.querySelectorAll('[data-ihara-branch]')){button.disabled=state.history.length>=LIMIT;button.classList.toggle('primary',button.dataset.iharaBranch===state.lastAttempt?.branch);}
   win.A0Visual1GridController?.render();for(const fn of subscribers)try{fn();}catch(error){win.console?.error?.(error);}return r;
  }
  for(const button of root.querySelectorAll('[data-ihara-branch]'))button.addEventListener('click',()=>{state=step(state,button.dataset.iharaBranch);render();});
  el('cubicReverse').addEventListener('click',()=>{state=step(state,'reverse');render();});
  el('cubicReset').addEventListener('click',()=>{state=create();render();});
  render();return{snapshot:()=>read(state),render,subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn)},step(branch){state=step(state,branch);return render();}};
 }
 return{SCHEMA,GRAPH,LIMIT,create,choices,step,read,drawing,mount};
});
