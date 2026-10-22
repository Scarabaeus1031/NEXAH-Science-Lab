(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0FamilyNavigatorDemo=api;api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const STATUS={
  exact:{label:'Exakt',color:'#69d39a',line:'durchgezogen',copy:'Im Atlas als exakt klassifizierte Beziehung. Diese Karte führt keinen neuen Beweis oder Test aus.'},
  empirical:{label:'Empirisch',color:'#efbd55',line:'durchgezogen',copy:'Im Atlas als empirisch klassifizierter Anschluss. Geltungsbedingungen und Originalquelle bleiben maßgeblich.'},
  method:{label:'Methodisch',color:'#54d7ef',line:'gestrichelt',copy:'Eine methodische Prüf- oder Leserbeziehung, kein physikalischer Kanal.'},
  open:{label:'Offen',color:'#ed7777',line:'gepunktet',copy:'Offener Anschluss. Die gezeichnete Kante behauptet keinen abgeschlossenen Mechanismus.'},
  negative:{label:'Negativ / Nicht-Identität',color:'#b78aef',line:'Strich–Punkt',copy:'Ein negativer beziehungsweise nicht-identischer Zusammenhang. Nicht in eine positive Kopplung umdeuten.'}
 };
 const clone=x=>JSON.parse(JSON.stringify(x));
 function createBridge(data,notify=()=>{}){
  let state={family:'F1',elevatorFamily:'F1',route:'all',stage:null,mode:'family',stop:'zeta',selectedEdge:null};
  return{
   snapshot(){return clone({families:data.families,edges:data.edges,routes:data.routes,stops:data.stops,...state});},
   apply(next){
    if(!next||typeof next!=='object'||Array.isArray(next))return false;
    const before=JSON.stringify(state),oldFamily=state.family;
    if(next.family===null||data.families[next.family])state.family=next.family;
    if(data.families[next.elevatorFamily])state.elevatorFamily=next.elevatorFamily;
    if(data.routes[next.route])state.route=next.route;
    if(data.stops[next.stop])state.stop=next.stop;
    if(['family','joint','elevator'].includes(next.mode))state.mode=next.mode;
    if(state.family)state.elevatorFamily=state.family;
    if(state.mode!=='joint'||state.family!==oldFamily||next.selectedEdge===null)state.selectedEdge=null;
    if(state.mode==='joint'&&data.edges[next.selectedEdge]?.a===state.family)state.selectedEdge=next.selectedEdge;
    if(before!==JSON.stringify(state))notify(this.snapshot());return true;
   },
   selectEdge(id){const edge=data.edges[id];if(!edge)return false;state={...state,family:edge.a,elevatorFamily:edge.a,mode:'joint',selectedEdge:id};notify(this.snapshot());return true;}
  };
 }
 function dockJointPanel(doc,mount){
  const panel=doc.getElementById('jointWorkbench'),body=mount.querySelector('.spatial-body');
  if(!panel||!body||panel===mount)return false;
  const selection=mount.querySelector('[data-club-selection]'),legend=mount.querySelector('[data-club-legend]');
  if(selection&&legend){
   const article=doc.getElementById('jointExplanation');
   if(article)selection.append(article);
   const details=doc.createElement('details'),summary=doc.createElement('summary');summary.textContent='Zeichen & Legende';details.setAttribute('data-club-sign-legend','');
   details.append(summary,panel);legend.append(details);return true;
  }
  body.after(panel);return true;
 }
 function mount(doc,win){
  const data=win.A0FamilyNavigatorDemoData;if(!data)return null;
  const bridge=createBridge(data,()=>doc.dispatchEvent(new win.CustomEvent('a0:family-atlas-selection')));
  win.A0FamilyAtlasBridge=bridge;
  const byId=id=>doc.getElementById(id);
  function fact(label,value){const dt=doc.createElement('dt'),dd=doc.createElement('dd');dt.textContent=label;dd.textContent=value;byId('jointFacts').append(dt,dd);}
  function explain(){
   const s=bridge.snapshot(),edge=data.edges[s.selectedEdge];byId('jointFacts').replaceChildren();
   if(edge){
    const status=STATUS[edge.status];byId('jointTitle').textContent=edge.a+' → '+edge.b+' · '+edge.label;
    byId('jointMeaning').textContent=status.copy;
    fact('Ausgang',edge.a+' · '+data.families[edge.a].name);fact('Ziel',edge.b+' · '+data.families[edge.b].name);
    fact('Status im Original',status.label+' · '+status.line);fact('Die Verbindung sagt',edge.label);
    fact('Aussagegrenze','Vorhandener Relationsrecord, keine neue Engine-Kopplung. Die Leserichtung allein belegt keine Kausalität.');
   }else{
    const id=s.family||s.elevatorFamily,f=data.families[id];
    byId('jointTitle').textContent=id+' · '+f.name;byId('jointMeaning').textContent=f.question;
    fact('Diese Apertur liest',f.selects);fact('Leseposition',data.stops[s.stop].symbol+' · '+data.stops[s.stop].title);
    fact('Elevator',data.stops[s.stop].text);
   }
   for(const button of byId('jointDirectory').children){
    button.setAttribute('aria-pressed',String(button.dataset.edge===s.selectedEdge));
    const record=data.edges[button.dataset.edge];button.setAttribute('data-related',String(!s.family||record.a===s.family||record.b===s.family));
   }
  }
  for(const [id,info]of Object.entries(STATUS)){
   const b=doc.createElement('button');b.type='button';b.style.setProperty('--status',info.color);b.textContent=info.label+' · '+info.line;
   b.onclick=()=>{byId('statusMeaning').textContent=info.copy;for(const item of byId('statusLegend').children)item.setAttribute('aria-pressed',String(item===b));};
   b.setAttribute('aria-pressed','false');byId('statusLegend').append(b);
  }
  for(const [id,edge]of Object.entries(data.edges)){
   const b=doc.createElement('button');b.type='button';b.dataset.edge=id;b.style.setProperty('--status',STATUS[edge.status].color);
   const pair=doc.createElement('strong'),label=doc.createElement('small'),status=doc.createElement('span');
   pair.textContent=edge.a+' → '+edge.b;label.textContent=edge.label;status.textContent=edge.status;
   b.append(pair,label,status);b.title=edge.a+' → '+edge.b+' · '+edge.label+' · '+STATUS[edge.status].label;b.setAttribute('aria-label',b.title);
   b.onclick=()=>bridge.selectEdge(id);byId('jointDirectory').append(b);
  }
  byId('demoProvenance').textContent='Kopierter Atlas-Stand: '+data.meta.date+' · '+Object.keys(data.families).length+' Families / '+Object.keys(data.edges).length+' Relationsrecords · Quellhash '+data.meta.sha256.slice(0,16)+'…';
  doc.addEventListener('a0:family-atlas-selection',explain);explain();
  return{bridge,explain};
 }
 return{STATUS,createBridge,dockJointPanel,mount};
});
