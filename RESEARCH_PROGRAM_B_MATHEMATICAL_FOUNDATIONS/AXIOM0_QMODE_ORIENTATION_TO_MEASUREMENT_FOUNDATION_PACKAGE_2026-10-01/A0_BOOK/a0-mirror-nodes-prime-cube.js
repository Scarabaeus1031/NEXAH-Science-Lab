(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0MirrorNodesPrimeCube=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SQRT2=Math.sqrt(2);
  const SQRT3=Math.sqrt(3);
  const SQRT6=Math.sqrt(6);
  const DIAGONAL_BASIS=Object.freeze({
    view:Object.freeze([1/SQRT3,1/SQRT3,1/SQRT3]),
    horizontal:Object.freeze([1/SQRT2,-1/SQRT2,0]),
    vertical:Object.freeze([1/SQRT6,1/SQRT6,-2/SQRT6])
  });
  const CUBE_VERTICES=Object.freeze([
    Object.freeze([1,1,1]),Object.freeze([1,1,-1]),Object.freeze([1,-1,1]),Object.freeze([-1,1,1]),
    Object.freeze([1,-1,-1]),Object.freeze([-1,1,-1]),Object.freeze([-1,-1,1]),Object.freeze([-1,-1,-1])
  ]);
  const CUBE_EDGES=Object.freeze(CUBE_VERTICES.flatMap((v,i)=>CUBE_VERTICES.slice(i+1).map((w,j)=>[i,i+1+j]).filter(([,k])=>{
    const w=CUBE_VERTICES[k];
    return Math.abs(v[0]-w[0])+Math.abs(v[1]-w[1])+Math.abs(v[2]-w[2])===2;
  })).map(pair=>Object.freeze(pair)));
  const NODE_ORDER=Object.freeze([1031,3301,3201,1033,7801,1032]);
  const DOUBLE_3201_ORDER=Object.freeze([1031,3301,3201,3201,7801,1032]);
  const NODE_META=Object.freeze({
    1031:Object.freeze({prime:true,factors:Object.freeze([1031]),role:'Twin prime · left endpoint'}),
    1032:Object.freeze({prime:false,factors:Object.freeze([2,2,2,3,43]),role:'Composite seam · midpoint'}),
    1033:Object.freeze({prime:true,factors:Object.freeze([1033]),role:'Twin prime · decimal mirror source'}),
    3201:Object.freeze({prime:false,factors:Object.freeze([3,11,97]),role:'Composite slot · not a reversal of 1031/1032'}),
    3301:Object.freeze({prime:true,factors:Object.freeze([3301]),role:'Prime · reverse₁₀(1033)'}),
    7801:Object.freeze({prime:false,factors:Object.freeze([29,269]),role:'Composite outer gate'})
  });

  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
  function add(a,b){return[a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
  function scale(v,s){return[v[0]*s,v[1]*s,v[2]*s]}
  function reverseDigits(n){return Number(String(Math.trunc(Math.abs(n))).split('').reverse().join(''))}
  function digitSum(n){return String(Math.trunc(Math.abs(n))).split('').reduce((sum,d)=>sum+Number(d),0)}
  function projectAlongBodyDiagonal(vertex){
    return Object.freeze({
      x:dot(vertex,DIAGONAL_BASIS.horizontal),
      y:dot(vertex,DIAGONAL_BASIS.vertical),
      depth:dot(vertex,DIAGONAL_BASIS.view)
    });
  }
  function isPole(vertex){return Math.abs(vertex[0])===1&&vertex[0]===vertex[1]&&vertex[1]===vertex[2]}
  function orderedRingVertices(){
    return CUBE_VERTICES.filter(v=>!isPole(v)).map(vertex=>({vertex,projection:projectAlongBodyDiagonal(vertex)}))
      .sort((a,b)=>Math.atan2(a.projection.y,a.projection.x)-Math.atan2(b.projection.y,b.projection.x));
  }
  function rotateVertex(vertex,rotation){
    const cy=Math.cos(rotation.y),sy=Math.sin(rotation.y),cx=Math.cos(rotation.x),sx=Math.sin(rotation.x);
    const x1=vertex[0]*cy-vertex[2]*sy,z1=vertex[0]*sy+vertex[2]*cy;
    return Object.freeze({x:x1,y:vertex[1]*cx-z1*sx,depth:vertex[1]*sx+z1*cx});
  }
  function nodeSet(variant){
    const values=variant==='double3201'?DOUBLE_3201_ORDER:NODE_ORDER;
    const vertices=orderedRingVertices();
    return values.map((value,index)=>Object.freeze({
      slot:index,
      value,
      vertex:vertices[index].vertex,
      projection:vertices[index].projection,
      meta:NODE_META[value]
    }));
  }
  function antipodePairs(variant){
    const nodes=nodeSet(variant);
    return Object.freeze([0,1,2].map(i=>Object.freeze([nodes[i],nodes[i+3]])));
  }
  function arithmeticLedger(){
    const values=NODE_ORDER;
    const crown=values.reduce((sum,n)=>sum+n,0);
    return Object.freeze({
      twin:Object.freeze({left:1031,seam:1032,right:1033,gap:2}),
      decimalReversal:Object.freeze({source:1033,target:3301,negativeControls:Object.freeze([[1031,1301],[1032,2301]])}),
      concatenation:Object.freeze({value:10333301,digitSum:digitSum(10333301),double:20666602,doubleDigitSum:digitSum(20666602)}),
      cube:Object.freeze({base:1033,value:1033**3,suffix:937}),
      crown:Object.freeze({values, sum:crown,factors:Object.freeze([127,137])})
    });
  }
  function screenPoint(point,width,height,scaleFactor){
    return{x:width/2+point.x*scaleFactor,y:height/2-point.y*scaleFactor,depth:point.depth};
  }
  function cubeVertexFromCoords(coords){
    return CUBE_VERTICES.findIndex(v=>v[0]===coords[0]&&v[1]===coords[1]&&v[2]===coords[2]);
  }
  function interpolatedProjection(vertex,t){
    const diagonal=projectAlongBodyDiagonal(vertex);
    const perspective=rotateVertex(vertex,{x:-0.52,y:0.68});
    return Object.freeze({
      x:perspective.x+(diagonal.x-perspective.x)*t,
      y:perspective.y+(diagonal.y-perspective.y)*t,
      depth:perspective.depth+(diagonal.depth-perspective.depth)*t
    });
  }

  return Object.freeze({
    DIAGONAL_BASIS,CUBE_VERTICES,CUBE_EDGES,NODE_ORDER,DOUBLE_3201_ORDER,NODE_META,
    dot,add,scale,reverseDigits,digitSum,projectAlongBodyDiagonal,isPole,orderedRingVertices,
    rotateVertex,nodeSet,antipodePairs,arithmeticLedger,screenPoint,cubeVertexFromCoords,interpolatedProjection
  });
});
