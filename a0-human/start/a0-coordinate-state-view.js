(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-orientation-controller-bench.js'):root.A0OrientationController);
 if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0CoordinateStateView=api;api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(C){
 'use strict';
 const graph=C.hypercubeGraph(4),copy=x=>JSON.parse(JSON.stringify(x));
 function valid(s){
  if(!s||Object.keys(s).sort().join(',')!=='angle,vertex,x,y'||!Number.isInteger(s.x)||s.x<0||s.x>24||!Number.isInteger(s.y)||s.y<0||s.y>24||!Number.isInteger(s.vertex)||s.vertex<0||s.vertex>15||!Number.isInteger(s.angle)||s.angle<0||s.angle>360)throw Error('INVALID · cell / vertex / angle');
  return copy(s);
 }
 function reading(input){
  const s=valid(input),bits=graph.vertices[s.vertex].bits;
  return {schema:'a0.coordinate-state-view-reading/1',state:s,cell:{x:s.x,y:s.y,localFlat:25*s.y+s.x,digitsXY:[Math.floor(s.x/5),s.x%5,Math.floor(s.y/5),s.y%5]},q4:{vertex:s.vertex,bits,vertices:graph.vertexCount,edges:graph.edgeCount},view:{angle:s.angle},
   boundary:'Local comparison tuple only: no map from base5 cell digits to Q4 bits, no original LOKI/Tessarec state readback, no shared source clock or physical movement. Projection rotation is independent of graph transitions.'};
 }
 function create(){
  let state={x:12,y:12,vertex:0,angle:0},anchor=null;
  function command(type,payload={}){
   if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('INVALID · payload');
   let next=copy(state),saved=copy(anchor);const keys=Object.keys(payload).sort().join(',');
   if(type==='CELL'){if(keys!=='x,y')throw Error('INVALID · CELL fields');next.x=payload.x;next.y=payload.y;}
   else if(type==='FLIP'){
    if(keys!=='axis'||!Number.isInteger(payload.axis)||payload.axis<0||payload.axis>3)throw Error('INVALID · flip axis');
    const e=graph.edges.find(e=>e.axis===payload.axis&&(e.from===state.vertex||e.to===state.vertex));
    next.vertex=e.from===state.vertex?e.to:e.from;
   }else if(type==='VIEW'){if(keys!=='angle')throw Error('INVALID · VIEW fields');next.angle=payload.angle;}
   else if(type==='CAPTURE'){if(keys)throw Error('INVALID · CAPTURE fields');saved=copy(state);}
   else if(type==='RETURN'){if(keys)throw Error('INVALID · RETURN fields');if(!anchor)throw Error('HOLD · zuerst lokalen Anker erfassen');next=copy(anchor);}
   else throw Error('INVALID · action');
   next=valid(next);state=next;anchor=saved;return reading(state);
  }
  function record(){return {schema:'a0.coordinate-state-view-record/1',reading:reading(state),anchor:copy(anchor),scope:'Saved local tuple restoration, not inverse path, chronology proof or whole-machine Return.'};}
  return {command,read:()=>reading(state),record};
 }
 function verify(r){
  try{
   if(!r||r.schema!=='a0.coordinate-state-view-record/1'||Object.keys(r).sort().join(',')!=='anchor,reading,schema,scope')throw Error('record');
   const e=create(),s=valid(r.reading.state);e.command('CELL',{x:s.x,y:s.y});e.command('VIEW',{angle:s.angle});
   for(let axis=0;axis<4;axis++)if((s.vertex>>axis)&1)e.command('FLIP',{axis});
   const expected=e.record();expected.anchor=r.anchor===null?null:valid(r.anchor);
   return JSON.stringify(expected)===JSON.stringify(r)?'PASS':'INVALID';
  }catch{return 'INVALID';}
 }
 function drawing(input){
  const r=reading(input),s=r.state,text=(x,y,t,c='#d9edf4',size=13)=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" font-size="'+size+'" font-family="system-ui,sans-serif">'+t+'</text>';
  let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 355" style="display:block;width:100%;min-width:1080px" role="img" aria-label="Independent cell address, Q4 bit state and rotated projection"><rect width="1120" height="355" rx="12" fill="#071b26"/>';
  svg+=text(20,28,'1 · ADRESSE: 25 × 25')+text(395,28,'2 · Q4-ZUSTAND: FESTE ANSICHT')+text(775,28,'3 · PROJEKTION: '+s.angle+'°');
  for(let y=0;y<25;y++)for(let x=0;x<25;x++)svg+='<rect data-asv-x="'+x+'" data-asv-y="'+y+'" x="'+(30+9*x)+'" y="'+(50+9*y)+'" width="9" height="9" fill="'+(x===s.x&&y===s.y?'#ffd36a':'#0d2632')+'" stroke="#456877" stroke-width=".4" style="cursor:pointer"/>';
  function pos(value,angle,cx){
   const bit=i=>2*((value>>i)&1)-1,x=26*(bit(0)+.45*bit(2)+1.65*bit(3)),y=26*(bit(1)+.35*bit(2)),a=angle*Math.PI/180;
   return [cx+x*Math.cos(a)-y*Math.sin(a),175-(x*Math.sin(a)+y*Math.cos(a))];
  }
  for(const [angle,cx]of [[0,550],[s.angle,930]]){
   for(const e of graph.edges){const a=pos(e.from,angle,cx),b=pos(e.to,angle,cx);svg+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(e.axis===3?'#63d9aa':'#456877')+'" stroke-width="'+(e.axis===3?1.6:1)+'"/>';}
   for(const v of graph.vertices){const p=pos(v.value,angle,cx),selected=v.value===s.vertex;svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(selected?7:3)+'" fill="'+(selected?'#ffd36a':'#55d7ec')+'" stroke="'+(selected?'#fff':'#55d7ec')+'"/>';if(selected)svg+=text(p[0]+10,p[1]-10,v.bits,'#ffd36a',12);}
   svg+=text(cx-140,278,'16 Zustände · 32 Kanten · 8 grüne Brücken','#9bb7c5',12);
  }
  svg+=text(20,303,'(x,y)=('+s.x+','+s.y+') · lokal n='+r.cell.localFlat+' (ab 0)')+text(395,303,'Vertex '+s.vertex+' · Bits '+r.q4.bits)+text(775,303,'Gleicher Vertex '+s.vertex+' · andere Ansicht');
  return svg+text(20,333,'Getrennte Rollen: Zelladresse ≠ Bitzustand ≠ Ansichtswinkel. Keine automatische Übertragung auf Originalplayer.','#9bb7c5',13)+'</svg>';
 }
 function mount(doc,win){
  if(!doc||!doc.getElementById('coordinateStateView'))return null;
  const el=id=>doc.getElementById(id),engine=create();
  function render(){
   const r=engine.read(),s=r.state,a=engine.record().anchor;
   el('asvX').value=s.x;el('asvY').value=s.y;el('asvAngle').value=s.angle;el('asvDrawing').innerHTML=drawing(s);
   el('asvReadout').textContent='Adresse ('+s.x+','+s.y+') · Basis5 (x hoch/niedrig, y hoch/niedrig): '+r.cell.digitsXY.join(',')+' · Q4 '+r.q4.bits+' · Winkel '+s.angle+'°';
   el('asvReturn').disabled=!a;
   el('asvDiff').textContent=a?'Zum Anker: Adresse '+(s.x===a.x&&s.y===a.y?'GLEICH':'GEÄNDERT')+' · Q4 '+(s.vertex===a.vertex?'GLEICH':'GEÄNDERT')+' · Winkel '+(s.angle===a.angle?'GLEICH':'GEÄNDERT'):'Kein lokaler Anker erfasst.';
  }
  function command(type,payload={}){
   try{engine.command(type,payload);el('asvStatus').textContent=type==='RETURN'?'EXACT · lokales Dreierpaket wiederhergestellt; Originalplayer unverändert.':type+' · ausschließlich lokaler Vergleich';render();return true;}
   catch(e){el('asvStatus').textContent=e.message;render();return false;}
  }
  for(const id of ['asvX','asvY'])el(id).addEventListener('change',()=>command('CELL',{x:Number(el('asvX').value),y:Number(el('asvY').value)}));
  el('asvAngle').addEventListener('input',()=>command('VIEW',{angle:Number(el('asvAngle').value)}));
  for(let axis=0;axis<4;axis++)el('asvFlip'+axis).addEventListener('click',()=>command('FLIP',{axis}));
  el('asvCapture').addEventListener('click',()=>command('CAPTURE'));el('asvReturn').addEventListener('click',()=>command('RETURN'));
  el('asvDrawing').addEventListener('click',event=>{const target=event.target.closest?.('[data-asv-x]');if(target)command('CELL',{x:Number(target.getAttribute('data-asv-x')),y:Number(target.getAttribute('data-asv-y'))});});
  el('asvExport').addEventListener('click',()=>{
   const r=engine.record();if(verify(r)!=='PASS'){el('asvStatus').textContent='INVALID · Export abgebrochen';return;}
   const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(r,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-address-state-view-record.json';a.click();win.URL.revokeObjectURL(url);
  });
  render();return {command,read:engine.read,record:engine.record};
 }
 return {valid,reading,create,verify,drawing,mount};
});
