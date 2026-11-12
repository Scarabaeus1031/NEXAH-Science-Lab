(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0MatroschkaClusterModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const EPS=1e-10;
  const CLUSTERS=[
    {id:'A',label:'WAGON AXIS',color:'#39c8ef'},
    {id:'B',label:'TRIANGLE HANDLE',color:'#ff9c3b'},
    {id:'C',label:'COUPLER RING',color:'#69df9e'}
  ];
  const rad=d=>d*Math.PI/180;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const mod=(x,n)=>((x%n)+n)%n;
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const norm=a=>Math.sqrt(dot(a,a));
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const scale=(a,s)=>a.map(v=>v*s);
  const transpose=A=>A[0].map((_,i)=>A.map(r=>r[i]));
  const mv=(A,v)=>A.map(r=>dot(r,v));
  const mm=(A,B)=>A.map(r=>transpose(B).map(c=>dot(r,c)));
  const det=A=>A[0][0]*(A[1][1]*A[2][2]-A[1][2]*A[2][1])-A[0][1]*(A[1][0]*A[2][2]-A[1][2]*A[2][0])+A[0][2]*(A[1][0]*A[2][1]-A[1][1]*A[2][0]);
  const eye=()=>[[1,0,0],[0,1,0],[0,0,1]];
  const rz=d=>{const c=Math.cos(rad(d)),s=Math.sin(rad(d));return [[c,-s,0],[s,c,0],[0,0,1]]};
  const rx=d=>{const c=Math.cos(rad(d)),s=Math.sin(rad(d));return [[1,0,0],[0,c,-s],[0,s,c]]};
  const ry=d=>{const c=Math.cos(rad(d)),s=Math.sin(rad(d));return [[c,0,s],[0,1,0],[-s,0,c]]};
  const A1=rz(90);
  const A2=rx(180);
  const A3=mm([[-1,0,0],[0,1,0],[0,0,1]],ry(270));
  const F0_MINUS=[[-1,0,0],[0,1,0],[0,0,1]];
  const H=mm(A3,mm(A2,A1));
  const HINV=mm(transpose(A1),mm(transpose(A2),transpose(A3)));
  const WRONG_INV=mm(transpose(A3),mm(transpose(A2),transpose(A1)));
  const SNAP_SEQUENCE=[
    {index:0,angle:0,label:'ADDRESS',operator:'I',polarity:'Q°+',orientation:1,bearing:'ORIENT',landing:{token:'101',type:'ADDRESS / IDENTITY'},exit:false,return:false},
    {index:1,angle:90,label:'CLUSTER',operator:'A₁',polarity:'Q°+',orientation:1,bearing:'ZENITH',landing:{token:'1.1',type:'DISPLAY / SEAM'},exit:false,return:false},
    {index:2,angle:180,label:'GEOSPHERE',operator:'A₂A₁',polarity:'Q°+',orientation:1,bearing:'OCCIDENT',landing:{token:'1.21',type:'1:2:1 DISPLAY FILL'},exit:false,return:false},
    {index:3,angle:270,label:'N exiT°',operator:'A₃A₂A₁',polarity:'Q°−',orientation:-1,bearing:'NADIR',landing:{token:'1.1',type:'RETURN VIEW'},exit:true,return:false},
    {index:4,angle:360,label:'RETURN',operator:'H⁻¹H',polarity:'Q°+',orientation:1,bearing:'ORIENT / HERE',landing:{token:'101',type:'RETURN IDENTITY'},exit:false,return:true}
  ];
  const DISPLAY_RETURN={
    addressToken:'101',
    displayValue:1.1,
    fillValue:1.21,
    displayMap:'D:(1,0,1) -> 1.1',
    inverseDisplayMap:'D^-1:1.1 -> (1,0,1)',
    boundary:'101 is an address token; it is not numerically equal to 1.1'
  };
  const MATRYOSHKA_CARRIER={
    layers:[
      {index:0,id:'ADDRESS',object:'(a,b,c) in Z6^3',role:'discrete source record'},
      {index:1,id:'CLUSTER',object:'X_i subset of X',role:'local neighbourhood cell'},
      {index:2,id:'CUBE',object:'u in [-1,1]^3',role:'finite embedding carrier'},
      {index:3,id:'GEOSPHERE_WITH_WITNESS',object:'(u/||u||, rho)',role:'direction plus retained radial witness'}
    ],
    externalView:{id:'RIEMANN_Q_VIEW',object:'stereographic chart plus Q-degree observer',role:'projection and observation; not a carrier shell'},
    returnPath:'RIEMANN_Q_VIEW -> GEOSPHERE_WITH_WITNESS -> CUBE -> CLUSTER -> ADDRESS',
    boundary:'nested-carrier visualization; visual similarity is not evidence'
  };
  const NEXAHEDRON_V3_SOURCE_LENS={
    source:'Mission Control quarantine / Nexah Transition Machine / NEXA V instrument / nexahedron_v3/nexahedron-v3.html',
    sha256:'f792bb7ad784f40ea2fb3c99e67925c4003828f9bf43aa2557b9eea97489824b',
    custody:'READ_ONLY_HISTORICAL_SOURCE / QUARANTINE_REMAINS_NONAUTHORITATIVE',
    position:'GEOSPHERE_WITH_WITNESS -> TRANSLATION_LENS -> RIEMANN_Q_VIEW',
    innerLenses:['JULIA','MANDELBROT'],
    outerLenses:['RIEMANN','HOFMANN'],
    operators:['INVERT','ROTATE','SCALE','SAMPLE','RANK','PHASE'],
    metrics:'OPERATIONAL_DISPLAY_HEURISTIC_ONLY / NOT_SCIENTIFIC_VALIDATION',
    returnAuthority:'NONE / TYPED MCB RETURN STILL REQUIRES RHO WITNESS',
    graphDelta:{identities:0,relations:0,aliases:0}
  };
  function snapOf(index){
    const i=mod(Number(index)||0,SNAP_SEQUENCE.length);
    return {...SNAP_SEQUENCE[i]};
  }
  function matrixDistance(A,B){return Math.sqrt(A.reduce((s,r,i)=>s+r.reduce((t,v,j)=>t+(v-B[i][j])**2,0),0))}
  function address(input){
    if(!Array.isArray(input)||input.length!==3)throw new TypeError('Triple-Six address must contain three coordinates');
    const out=input.map(Number);
    if(!out.every(Number.isInteger)||!out.every(v=>v>=0&&v<6))throw new RangeError('Triple-Six coordinates must be integers in Z6');
    return out;
  }
  function clusterOf(input){
    const x=address(input),index=mod(x[0]+x[1]+x[2],3);
    return {...CLUSTERS[index],index,rule:'(a+b+c) mod 3'};
  }
  function cubeOf(input){return address(input).map(v=>(2*v-5)/5)}
  function sphereOf(input){
    const cube=cubeOf(input),rho=norm(cube);
    return {cube,rho,point:scale(cube,1/rho)};
  }
  function stereographic(point){
    const den=1-point[2];
    if(Math.abs(den)<EPS)throw new RangeError('north-pole chart singularity');
    return {re:point[0]/den,im:point[1]/den,chart:'north-pole stereographic'};
  }
  function inverseStereographic(z){
    const r2=z.re*z.re+z.im*z.im,d=r2+1;
    return [2*z.re/d,2*z.im/d,(r2-1)/d];
  }
  function observer(azimuth=35,elevation=25){
    const a=rad(Number(azimuth)),e=rad(Number(elevation));
    return [Math.cos(e)*Math.cos(a),Math.cos(e)*Math.sin(a),Math.sin(e)];
  }
  function nearestAddress(cube){return cube.map(v=>clamp(Math.round((5*v+5)/2),0,5))}
  function route(input,options={}){
    const source=address(input),cluster=clusterOf(source),geo=sphereOf(source);
    const oriented=mv(H,geo.point),side=options.side==='F0-'?'F0-':'F0';
    const viewed=side==='F0-'?mv(F0_MINUS,oriented):oriented,chart=stereographic(viewed);
    const q=observer(options.azimuth??35,options.elevation??25);
    const measured=dot(viewed,q);
    const chartReturn=inverseStereographic(chart);
    const unmirrored=side==='F0-'?mv(F0_MINUS,chartReturn):chartReturn;
    const sourceSphere=mv(HINV,unmirrored);
    const returnedCube=scale(sourceSphere,geo.rho);
    const returned=nearestAddress(returnedCube);
    const epsilon=norm(sub(returnedCube,geo.cube));
    const witnesslessCube=sourceSphere;
    const witnessless=nearestAddress(witnesslessCube);
    const witnesslessEpsilon=norm(sub(witnesslessCube,geo.cube));
    const wrongSphere=mv(WRONG_INV,unmirrored);
    const wrongCube=scale(wrongSphere,geo.rho);
    const wrongOrder=nearestAddress(wrongCube);
    const wrongOrderEpsilon=norm(sub(wrongCube,geo.cube));
    return {
      source,cluster,cube:geo.cube,rho:geo.rho,geosphere:geo.point,oriented,viewed,riemann:chart,
      f0:{side,counterviewStored:true,carrierUnchanged:true,operator:side==='F0-'?'diag(-1,1,1)':'I',namespace:'METHOD:F0/F0-; not CF:F0'},
      qDegree:{azimuth:Number(options.azimuth??35),elevation:Number(options.elevation??25),axis:q,measurement:measured,role:'observation state; source unchanged'},
      return:{address:returned,cube:returnedCube,epsilon,exact:epsilon<EPS},
      controls:{witnessless:{address:witnessless,epsilon:witnesslessEpsilon,exact:witnesslessEpsilon<EPS},wrongOrder:{address:wrongOrder,epsilon:wrongOrderEpsilon,exact:wrongOrderEpsilon<EPS}}
    };
  }
  function allAddresses(){const out=[];for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++)out.push([a,b,c]);return out}
  function census(){
    const rows=allAddresses().map(x=>route(x));
    const counts=[0,0,0],edgeCounts={AB:0,BC:0,AC:0};
    for(const x of allAddresses()){
      counts[clusterOf(x).index]++;
      for(let axis=0;axis<3;axis++){
        const y=x.slice();y[axis]=mod(y[axis]+1,6);
        const pair=[clusterOf(x).id,clusterOf(y).id].sort().join('');
        edgeCounts[pair]++;
      }
    }
    return {
      carrier:'DECLARED_TRIPLE_SIX_PILOT_Z6_CUBED',nodes:rows.length,clusterCounts:counts,undirectedEdges:648,edgeCounts,
      exactReturns:rows.filter(r=>r.return.exact).length,maxReturnEpsilon:Math.max(...rows.map(r=>r.return.epsilon)),
      witnesslessFailures:rows.filter(r=>!r.controls.witnessless.exact).length,
      wrongOrderFailures:rows.filter(r=>!r.controls.wrongOrder.exact).length,
      matrix:{determinants:[det(A1),det(A2),det(A3),det(H)],orthogonality:matrixDistance(mm(transpose(H),H),eye()),commutator12:matrixDistance(mm(A1,A2),mm(A2,A1)),commutator23:matrixDistance(mm(A2,A3),mm(A3,A2))}
    };
  }
  return {EPS,CLUSTERS,A1,A2,A3,F0_MINUS,H,HINV,WRONG_INV,SNAP_SEQUENCE,DISPLAY_RETURN,MATRYOSHKA_CARRIER,NEXAHEDRON_V3_SOURCE_LENS,snapOf,address,clusterOf,cubeOf,sphereOf,stereographic,inverseStereographic,observer,route,allAddresses,census,math:{dot,norm,sub,scale,transpose,mv,mm,det,eye,matrixDistance}};
});
