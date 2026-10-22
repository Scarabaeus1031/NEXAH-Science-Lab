(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0PentagonSewing=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LEVELS=['Quelle · acht Werte','Drei Paare wählen','Pentagon · fünf Koordinaten','Drei Unterschiede halten','AM / VM / PM lesen','Sewing · Spur und Schatten','Return · acht Werte'];
  function levels(mode='5+3'){return mode==='4+4'?['Quelle · acht Werte','Vier Paare wählen','Viereck · vier Koordinaten','Vier Unterschiede halten',...LEVELS.slice(4)]:LEVELS.slice();}
  function aperture(count=5,reference='ring90'){
    if(![4,5].includes(count))throw new RangeError('polygon count 4 or 5');
    if(!['ring90','incircle','circumcircle'].includes(reference))throw new RangeError('aperture circle reference');
    const radius=116,inradius=radius*Math.cos(Math.PI/count),circleRadius=reference==='ring90'?90:reference==='incircle'?inradius:radius;
    const polygon=Array.from({length:count},(_,i)=>[radius*Math.sin(i*2*Math.PI/count),-radius*Math.cos(i*2*Math.PI/count)]),contacts=[];
    const relation=reference==='incircle'?'tangent':reference==='circumcircle'?'vertices':circleRadius<inradius?'inside':'crossing';
    polygon.forEach((a,edge)=>{
      const b=polygon[(edge+1)%count],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      if(circleRadius<inradius-1e-9)return;
      const delta=Math.sqrt(Math.max(0,circleRadius**2-inradius**2))/length;
      const ts=relation==='tangent'?[.5]:[.5-delta,.5+delta];
      ts.forEach(t=>{if(t< -1e-9||t>1+1e-9)return;const u=Math.max(0,Math.min(1,t)),point=[a[0]+u*(b[0]-a[0]),a[1]+u*(b[1]-a[1])];
        const previous=contacts.find(c=>Math.hypot(c.point[0]-point[0],c.point[1]-point[1])<1e-7);
        if(previous){if(!previous.edges.includes(edge))previous.edges.push(edge);}else contacts.push({point,edges:[edge],kind:relation});
      });
    });
    return{count,reference,radius,inradius,circleRadius,edgeGap:inradius-circleRadius,relation,polygon,contacts,units:'SVG display units; geometric reference, not physical radius'};
  }
  function reconstruct(record){
    const out=Array(8);record.pairs.forEach(([a,b],i)=>{out[a]=record.quotient[i]+record.residuals[i];out[b]=record.quotient[i]-record.residuals[i];});record.singles.forEach((index,i)=>{out[index]=record.quotient[record.pairs.length+i];});return out;
  }
  function fold(values,offset=0,mode='5+3'){
    if(!Array.isArray(values)||values.length!==8||!values.every(Number.isFinite))throw new TypeError('eight finite values required');
    if(!Number.isInteger(offset)||offset<0||offset>7)throw new RangeError('offset 0..7');
    if(!['5+3','4+4'].includes(mode))throw new RangeError('mode 5+3 or 4+4');
    const count=mode==='4+4'?4:3,indices=Array.from({length:8},(_,i)=>(i+offset)%8),pairs=Array.from({length:count},(_,i)=>indices.slice(2*i,2*i+2)),singles=indices.slice(2*count),residuals=pairs.map(([a,b])=>values[a]/2-values[b]/2),quotient=pairs.map(([a,b])=>values[a]/2+values[b]/2).concat(singles.map(i=>values[i]));
    const record={source:values.slice(),offset,mode,pairs,singles,quotient,residuals};record.reconstructed=reconstruct(record);record.error=Math.max(...values.map((v,i)=>Math.abs(v-record.reconstructed[i])));return record;
  }
  function reading(record,time,frequencies=[3,2,1]){
    if(!Array.isArray(frequencies)||frequencies.length!==3||!frequencies.every(v=>Number.isFinite(v)&&v>0))throw new RangeError('three positive frequencies required');
    const offsets=[0,Math.PI/2,Math.PI/4],signals=record.residuals.slice(0,3).map((r,i)=>r*Math.sin(frequencies[i]*time+offsets[i]));
    return{time,signals,views:[[signals[0],signals[1]],[signals[1],signals[2]],[signals[2],signals[0]]],breath:1+.04*Math.sin(time),frequencies,rule:'r_i sin(omega_i t + delta_i); display adapter, not residual replacement'};
  }
  function advance(time,dt,speed=1){if(![time,dt,speed].every(Number.isFinite)||dt<0||speed<0)throw new RangeError('finite nonnegative time step and speed required');return time+dt*speed;}
  function levelAt(time){const step=Math.floor(time/2)%12;return step<=6?7-step:step-5;}
  return{LEVELS,levels,aperture,fold,reconstruct,reading,advance,levelAt};
});
