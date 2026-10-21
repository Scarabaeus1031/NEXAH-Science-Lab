(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.A0IharaHashimotoModel=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const addEdge=(set,a,b)=>set.add(a<b?`${a},${b}`:`${b},${a}`);
  function makeGraph(kind="dodecahedron"){
    const edges=new Set(),positions=[],labels=[];let title,note;
    if(kind==="pentagon"){
      title="Pentagon C5";note="Five-joint control: one geometric 5-cycle, two orientations.";
      for(let i=0;i<5;i++){addEdge(edges,i,(i+1)%5);positions.push([Math.cos(-Math.PI/2+i*2*Math.PI/5),Math.sin(-Math.PI/2+i*2*Math.PI/5)]);labels.push(`p${i}`)}
    }else if(kind==="tree"){
      title="Tree negative control";note="Acyclic control: B is nilpotent, closed non-backtracking traces vanish and Z^-1=1.";
      [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]].forEach(([a,b])=>addEdge(edges,a,b));
      [[0,0],[.55,.42],[-.55,.42],[.85,.9],[.3,.9],[-.3,.9],[-.85,.9]].forEach((p,i)=>{positions.push(p);labels.push(`t${i}`)});
    }else{
      kind="dodecahedron";title="Dodecahedron · G(10,2)";note="Finite cubic carrier: 20 vertices, 30 edges and 60 directed-edge states.";
      for(let i=0;i<10;i++){addEdge(edges,i,(i+1)%10);addEdge(edges,10+i,10+(i+2)%10);addEdge(edges,i,10+i);positions.push([Math.cos(-Math.PI/2+i*Math.PI/5),Math.sin(-Math.PI/2+i*Math.PI/5)]);labels.push(`u${i}`)}
      for(let i=0;i<10;i++){positions.push([.49*Math.cos(-Math.PI/2+i*Math.PI/5),.49*Math.sin(-Math.PI/2+i*Math.PI/5)]);labels.push(`v${i}`)}
    }
    return Object.freeze({kind,title,note,positions:Object.freeze(positions),labels:Object.freeze(labels),edges:Object.freeze([...edges].map(e=>Object.freeze(e.split(",").map(Number))))});
  }
  const adjacency=g=>{const a=Array.from({length:g.positions.length},()=>[]);g.edges.forEach(([x,y])=>{a[x].push(y);a[y].push(x)});return a};
  const directed=g=>g.edges.flatMap(([a,b])=>[[a,b],[b,a]]);
  function matrixB(g){const ds=directed(g),index=new Map(ds.map((e,i)=>[e.join(","),i])),adj=adjacency(g),B=Array.from({length:ds.length},()=>Array(ds.length).fill(0));ds.forEach(([a,b],i)=>adj[b].forEach(c=>{if(c!==a)B[i][index.get(`${b},${c}`)]=1}));return B}
  function multiply(A,B){const n=A.length,C=Array.from({length:n},()=>Array(n).fill(0));for(let i=0;i<n;i++)for(let k=0;k<n;k++)if(A[i][k])for(let j=0;j<n;j++)if(B[k][j])C[i][j]+=A[i][k]*B[k][j];return C}
  function traces(B,max=10){if(!B.length)return[];let P=B.map(r=>r.slice());const out=[];for(let k=1;k<=max;k++){out.push(P.reduce((s,r,i)=>s+r[i],0));if(k<max)P=multiply(P,B)}return out}
  function determinant(M){const A=M.map(r=>r.slice());let det=1;for(let i=0;i<A.length;i++){let p=i;for(let j=i+1;j<A.length;j++)if(Math.abs(A[j][i])>Math.abs(A[p][i]))p=j;if(Math.abs(A[p][i])<1e-12)return 0;if(p!==i){[A[p],A[i]]=[A[i],A[p]];det*=-1}const q=A[i][i];det*=q;for(let j=i+1;j<A.length;j++){const f=A[j][i]/q;for(let k=i+1;k<A.length;k++)A[j][k]-=f*A[i][k]}}return det}
  function bass(g,u){const a=adjacency(g),n=a.length,m=g.edges.length,M=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>(i===j?1+u*u*(a[i].length-1):a[i].includes(j)?-u:0)));return Math.pow(1-u*u,m-n)*determinant(M)}
  function operatorDeterminant(g,u){const B=matrixB(g),M=B.map((row,i)=>row.map((x,j)=>(i===j?1:0)-u*x));return determinant(M)}
  function transition(g,index){const ds=directed(g),edge=ds[((index%ds.length)+ds.length)%ds.length],adj=adjacency(g),allowed=adj[edge[1]].filter(c=>c!==edge[0]).map(c=>[edge[1],c]);return Object.freeze({edge:Object.freeze(edge),allowed:Object.freeze(allowed.map(Object.freeze)),blocked:Object.freeze([edge[1],edge[0]])})}
  function walk(g,index,steps=8){if(!Number.isInteger(steps)||steps<1)throw new TypeError("steps must be a positive integer");const first=transition(g,index).edge,path=[first],adj=adjacency(g);for(let k=1;k<steps;k++){const [a,b]=path.at(-1),allowed=adj[b].filter(c=>c!==a);if(!allowed.length)break;path.push(Object.freeze([b,allowed[(index+k)%allowed.length]]))}return Object.freeze(path.map(Object.freeze))}
  function inspect(kind,generation,u=.18,maxTrace=10){if(!Number.isInteger(generation)||generation<0)throw new TypeError("generation must be a non-negative integer");if(!(u>0&&u<1))throw new RangeError("u must lie between 0 and 1");const graph=makeGraph(kind),B=matrixB(graph),trace=traces(B,maxTrace),bassValue=bass(graph,u),operatorValue=operatorDeterminant(graph,u),degrees=adjacency(graph).map(x=>x.length);return Object.freeze({graph,generation,u,directedCount:B.length,degreeRange:Object.freeze([Math.min(...degrees),Math.max(...degrees)]),transition:transition(graph,generation),walk:walk(graph,generation,8),traces:Object.freeze(trace),traceIndex:generation%maxTrace,traceValue:trace[generation%maxTrace],bassValue,operatorValue,gap:Math.abs(bassValue-operatorValue),criticalRadius:degrees.every(d=>d===degrees[0])&&degrees[0]>1?1/Math.sqrt(degrees[0]-1):null,boundary:"FINITE_GRAPH_HASHIMOTO_AND_IHARA_BASS_NUMERICAL_CROSSCHECK_ONLY"})}
  return Object.freeze({makeGraph,adjacency,directed,matrixB,traces,bass,operatorDeterminant,transition,walk,inspect});
});
