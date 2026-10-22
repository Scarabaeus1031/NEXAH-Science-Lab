(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0CoreCycleComparator=api;api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const KS=[.2,.5,1,2],GROUPS=[[0,1,2,3,4],[5,6,7,8,9,10],[11,12,13,14,15,16]];
 const copy=x=>JSON.parse(JSON.stringify(x));
 function historicalReadout(){
  const points=[
   {role:'onset',label:'Onset (max. diskrete Steigung)',K:2.3181818181818183,metric:0.0204849985907506,anchor:23,expression:'23'},
   {role:'max_drift',label:'Maximum Driftmaß',K:2.5454545454545454,metric:0.4054911416475603,anchor:25,expression:'5² = 25'},
   {role:'max_events',label:'Maximum Event-Anteil',K:2.7727272727272725,metric:0.0116441856847625,anchor:27,expression:'3³ = 27'}
  ].map(p=>({...p,scaledK:10*p.K,integerPart:Math.floor(10*p.K),nearestInteger:Math.round(10*p.K),residual:10*p.K-p.anchor,exactMatch:10*p.K===p.anchor}));
  return {status:'HISTORICAL_SOURCE_READOUT_NOT_NEW_RUN',source:'A0_SCIENTIFIC_POSITION_REPORT.html',
   sourceSha256:'1a5492b4981b87b9a2cc581f8de6ed555b3e94414f62ac4c93371574f57aaf6b',
   displayScale:10,integerRule:'floor(10*K), explicit truncation, not nearest rounding',
   anchorStatus:'OWNER_NUMBER_READING_NOT_CRITICAL_CONSTANTS',points,
   boundary:'Historical N=128 seeded sweep; not the N=50 four-K sweep or the 18-node graph. PCA-derived angle drift and adaptive peak fraction do not establish physical instability. Red spline is a data envelope, not a proven phase boundary.'};
 }
 function historicalTable(){
  const f=x=>x.toFixed(6).replace('.',',');
  return '<table style="width:100%;border-collapse:collapse"><caption>Historische K-Markierungen · ×10-Zahlenspur (keine neue Messung)</caption><thead><tr>'+['Quellmarkierung','K','10K','⌊10K⌋','Zahlenlesart','10K − Anker','Gerundet'].map(x=>'<th scope="col" style="padding:8px;text-align:left">'+x+'</th>').join('')+'</tr></thead><tbody>'+
   historicalReadout().points.map(p=>'<tr>'+[p.label,f(p.K),f(p.scaledK),p.integerPart,p.expression,'+'+f(p.residual),p.nearestInteger].map(x=>'<td style="padding:8px;border-top:1px solid #315367">'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 }
 function options(o={}){
  const v={focus:o.focus??'all',K:o.K??.2,sign:o.sign??'documented'};
  if(!['all','0','1','2'].includes(v.focus)||!KS.includes(v.K)||!['documented','historical'].includes(v.sign))throw Error('Invalid comparison settings');
  return v;
 }
 function graph(){
  const nodes=[{id:'center',x:0,y:0,group:-1}];
  for(let i=0;i<17;i++)nodes.push({id:'s'+i,x:Math.cos(2*Math.PI*i/17),y:Math.sin(2*Math.PI*i/17),group:GROUPS.findIndex(g=>g.includes(i))});
  const edges=Array.from({length:17},(_,i)=>({a:'center',b:'s'+i,group:-1}));
  GROUPS.forEach((g,k)=>g.forEach((i,j)=>edges.push({a:'s'+i,b:'s'+g[(j+1)%g.length],group:k})));
  return {nodes,edges,cycleLengths:[5,6,6],layout:'uniform-17-circle-not-regular-polygon-faces'};
 }
 function draft(input={}){
  const o=options(input);
  return {schema:'a0.core-cycle-comparison-draft/1',status:'DRAFT_NOT_EXECUTABLE_STRUCTURE_FREEZE',researchExecution:false,
   graph:graph(),view:o,KValues:KS.slice(),selectedK:o.K,
   coupling:o.sign==='documented'?'sin(theta_j-theta_i)':'sin(theta_i-theta_j)',
   comparisonBoundary:'New proposed 18-node graph protocol, not a replay of the historical N=50 all-to-all K sweep.',
   pairedControl:{required:true,status:'UNASSIGNED_NO_RUN',sharedAcrossK:['theta0','omega','adjacency','normalization','integrator','dt','duration'],
    theta0:null,omega:null,normalization:null,integrator:null,dt:null,duration:null},
   gate:{runEnabled:false,requires:['separate owner reopening decision','admitted bounded question and run contract','fixed shared input arrays and numerical method','declared comparison metrics and tolerances']},
   results:null,historicalReadout:historicalReadout(),basinBoundary:'Historical basin edges mean segmentation adjacency, not transition rates.',
   nonidentity:['Pascal aperture','spatial folding','four fold states','measured physical coupling']};
 }
 function drawing(input={}){
  const o=options(input),g=graph(),colors=['#ffd36a','#55d7ec','#b68af4'];
  const point=id=>{const n=g.nodes.find(n=>n.id===id);return [230+160*n.x,220-160*n.y];};
  const edges=g.edges.map(e=>{const a=point(e.a),b=point(e.b),active=e.group<0||o.focus==='all'||o.focus===String(e.group);
   return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${e.group<0?'#456877':colors[e.group]}" stroke-width="${e.group<0?1:3}" opacity="${active?1:.12}"/>`;}).join('');
  const nodes=g.nodes.map(n=>{const [x,y]=point(n.id),c=n.group<0?'#ffffff':colors[n.group];return `<circle cx="${x}" cy="${y}" r="${n.group<0?10:7}" fill="${c}"/><text x="${x+(n.x<0?-13:13)}" y="${y-10}" text-anchor="${n.x<0?'end':'start'}" fill="#d9edf4" font-size="12">${n.id}</text>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 450" role="img" aria-label="C5 plus C6 plus C6: 17 outer nodes and center, 34 undirected edges"><rect width="460" height="450" rx="12" fill="#071b26"/>${edges}${nodes}<text x="230" y="435" text-anchor="middle" fill="#d9edf4" font-size="13">C5 (gold) · C6 A (cyan) · C6 B (purple)</text></svg>`;
 }
 function mount(doc,win){
  if(!doc||!doc.getElementById('coreCycleComparator'))return null;
  const el=id=>doc.getElementById(id);let state=options(),checkpoint=null;
  function render(){
   el('cccFocus').value=state.focus;el('cccK').value=String(state.K);el('cccSign').value=state.sign;
   el('cccDrawing').innerHTML=drawing(state);
   if(el('cccHistorical'))el('cccHistorical').innerHTML=historicalTable();
   el('cccStatus').textContent=`ENTWURF · K=${state.K} · ${draft(state).coupling} · KEIN LAUF / KEINE ERGEBNISSE`;
   el('cccRestore').disabled=!checkpoint;
  }
  ['cccFocus','cccK','cccSign'].forEach(id=>el(id).addEventListener('change',()=>{state=options({focus:el('cccFocus').value,K:Number(el('cccK').value),sign:el('cccSign').value});render();}));
  el('cccCapture').addEventListener('click',()=>{checkpoint=copy(state);render();});
  el('cccRestore').addEventListener('click',()=>{if(checkpoint){state=copy(checkpoint);render();}});
  el('cccExport').addEventListener('click',()=>{
   const a=doc.createElement('a'),url=win.URL.createObjectURL(new win.Blob([JSON.stringify(draft(state),null,2)],{type:'application/json'}));
   a.href=url;a.download='a0-core-cycle-comparison-DRAFT.json';a.click();win.URL.revokeObjectURL(url);
  });
  render();return {read:()=>copy(state),draft:()=>draft(state)};
 }
 return {options,graph,draft,drawing,historicalReadout,historicalTable,mount};
});
