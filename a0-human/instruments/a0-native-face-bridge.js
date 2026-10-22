(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0NativeFaceBridge=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SCHEMA='nexah.a0.native-dodeca-face-bridge/1',SOURCE_ID='A0-VIEW-BLUE-PINK-DODECA-CELL-RETURN';
  const DEFAULT_FACES=Object.freeze([0,12,24,36]);
  const copy=value=>JSON.parse(JSON.stringify(value));
  const round=value=>Math.round(value*1e9)/1e9;
  function assertFace(index){if(!Number.isInteger(index)||index<0||index>=48)throw Error('native face index must be 0..47');return index}
  function faceAddress(index,model,geometry){assertFace(index);const cell=model.cellAt(index),face=geometry.faces[index%12];return{index,cellId:cell.cell_id,bodyId:cell.cell_id.split(':')[0],localFace:index%12,geometryFaceId:face.id,hingeVertexIds:[face.vertices[0],face.vertices[1]],vertexIds:face.vertices.slice()}}
  function rotatePointAroundAxis(point,a,b,angle){const axis=b.map((v,i)=>v-a[i]),length=Math.hypot(...axis)||1,u=axis.map(v=>v/length),p=point.map((v,i)=>v-a[i]),c=Math.cos(angle),s=Math.sin(angle),dot=p.reduce((n,v,i)=>n+v*u[i],0),cross=[u[1]*p[2]-u[2]*p[1],u[2]*p[0]-u[0]*p[2],u[0]*p[1]-u[1]*p[0]];return p.map((v,i)=>round(a[i]+v*c+cross[i]*s+u[i]*dot*(1-c)))}
  function hingeFace(vertices,face,edge,angle){const [left,right]=edge||[face.vertices[0],face.vertices[1]],a=vertices[left],b=vertices[right],fixed=new Set([left,right]);return face.vertices.map(id=>fixed.has(id)?vertices[id].slice():rotatePointAroundAxis(vertices[id],a,b,angle))}
  function distances(points){const out=[];for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)out.push(round(Math.hypot(...points[i].map((v,k)=>v-points[j][k]))));return out}
  function rigidityWitness(vertices,face,edge,angle){const before=face.vertices.map(id=>vertices[id].slice()),after=hingeFace(vertices,face,edge,angle),a=distances(before),b=distances(after),maxResidual=Math.max(...a.map((v,i)=>Math.abs(v-b[i])));return{before,after,pairwiseDistancesBefore:a,pairwiseDistancesAfter:b,maxResidual:round(maxResidual),rigid:maxResidual<1e-7}}
  function fingerprint(state){return JSON.stringify({sourceId:SOURCE_ID,selected:state.selected,hingeAngle:round(state.hingeAngle||0),hingeVertexIds:(state.hingeVertexIds||[]).slice(),projection:state.projection,yaw:round(state.yaw||0),pitch:round(state.pitch||0),fill:Number(state.fill),angle:Number(state.angle),breath:Number(state.breath)})}
  function capture(state,sequence=0){const snapshot=copy(state);return{schema:SCHEMA,version:VERSION,sourceId:SOURCE_ID,sequence,snapshot,fingerprint:fingerprint(snapshot)}}
  function returnReceipt(anchor,current){const exact=Boolean(anchor&&current&&anchor.fingerprint===current.fingerprint);return{schema:SCHEMA,version:VERSION,status:exact?'RETURN_EXACT':'RETURN_MISMATCH',sourceId:SOURCE_ID,anchorFingerprint:anchor?.fingerprint||null,currentFingerprint:current?.fingerprint||null,exact,wholeMachineReturn:false}}
  return{VERSION,SCHEMA,SOURCE_ID,DEFAULT_FACES,assertFace,faceAddress,rotatePointAroundAxis,hingeFace,rigidityWitness,fingerprint,capture,returnReceipt};
});
