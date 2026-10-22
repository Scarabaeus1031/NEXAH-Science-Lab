/* Source geometry reused as reader landmarks, never as a Family/face equivalence. */
(function(root,factory){
  const api=factory(typeof module==='object'?require('./assets/a0-tessarec-blue-body-v1.js'):root.A0TessarecBlueBody,typeof module==='object'?require('./assets/a0-blue-body-dodeca-countershot-v1.js'):root.A0BlueBodyDodecaCountershot);
  if(typeof module==='object')module.exports=api;root.A0FamilySpatialBodies=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(blue,counter){
  'use strict';
  // Same declared ring embedding as A0_BLUE_BODY_DODECA_COUNTERSHOT.html.
  const ringSpec={A:[1.03,2.36,0],B:[1.66,1.14,0],C:[1.98,.72,Math.PI/8],E:[1.98,-.72,Math.PI/8],D:[1.66,-1.14,0],F:[1.03,-2.36,0]};
  function build(kind){
    let vertices,faces,edges,title,source;
    if(kind==='bluebody'){
      const shell=blue.buildShell(),points={};
      for(const [ring,[r,y,offset]] of Object.entries(ringSpec))for(let i=0;i<8;i++){const a=i*Math.PI/4+offset;points[ring+i]=[r*Math.cos(a),y,r*Math.sin(a)]}
      vertices=shell.vertices.map(id=>points[id]);const index=new Map(shell.vertices.map((id,i)=>[id,i]));
      faces=shell.faces.map(f=>({...f,vertices:f.vertices.map(id=>index.get(id)),color:f.type==='P'?'#54d7ef':f.type==='H'?'#32779b':'#b78aef'}));
      edges=[...shell.edgeOwners.keys()].map(key=>key.split('|').map(id=>index.get(id)));
      title='Blue Body · O2 / P16 / H8';source='A0_BLUE_BODY_DODECA_COUNTERSHOT.html';
    }else if(kind==='dodeca'){
      const body=counter.buildDodecahedron();vertices=body.vertices;edges=body.edges;
      // One solid, not two reconstructed solids; opposite face pairs receive red/green.
      const palette={};for(const [a,b] of body.oppositePairs){palette[a]='#ed7777';palette[b]='#69d39a'}
      faces=body.faces.map((f,i)=>({...f,color:palette[i]}));
      title='H3 Dodeca · Rot/Grün-Gegenflächen';source='A0_BLUE_BODY_DODECA_COUNTERSHOT.html';
    }else return null;
    const scale=1.25/Math.max(...vertices.map(p=>Math.hypot(...p)));
    return{vertices:vertices.map(p=>p.map(x=>x*scale)),faces,edges,title,source,scale,classification:'SOURCE_GEOMETRY_WITH_DECLARED_READER_EMBEDDING_AND_PALETTE'};
  }
  return{build,ringSpec};
});
