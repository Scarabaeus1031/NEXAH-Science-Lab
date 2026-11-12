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
  const MAITROSCHKA_JOINT={
    label:'Maị­troschka',
    status:'OWNER_MNEMONIC / TYPED VIEW ADAPTER / NOT_A_NEW_NUMBER_OR_OPERATOR',
    carrier:'C12 = Z/12Z',
    generator:'zeta_12 = exp(2*pi*i/12)',
    positions:{one:0,plusI:3,minusOne:6,minusI:9,return:12},
    split:{marker:'Y',plus:'zeta_12^3 = i',minus:'zeta_12^-3 = zeta_12^9 = -i',role:'oriented display branches'},
    return:{marker:'¥',law:'zeta_12^12 = 1',lift:'Z -> Z/12Z',role:'visible return marker; not currency and not an algebraic operator'},
    shiftGear:{
      keyboard:{carrier:'V4 = C2 x C2',modifiers:['PLAIN','SHIFT','OPTION','SHIFT+OPTION'],sampleLayout:'MAC_US',sampleKey:{PLAIN:'a',SHIFT:'A',OPTION:'å','SHIFT+OPTION':'Å'},boundary:'layout-dependent input transducer; no glyph etymology'},
      symmetry:{carrier:'Sym(12-gon)',order:24,notation:'D12 (order 24; also called D24 by the order convention)',relations:['r^12 = e','s^2 = e','s r s = r^-1'],roles:{r:'rotation',s:'flip / trapdoor view'}},
      gear:{states:['P','R','N','D','3','2','1'],type:'FINITE_DIRECTED_STATE_GRAPH_NOT_A_GROUP',auto:'TRANSITION_CONTROLLER_NOT_A_GEAR_STATE'},
      pipeline:'KEY x V4 MODIFIER x GEAR STATE -> VISIBLE GLYPH / ORIENTED VIEW',
      boundary:'Keyboard output, twelve-gon symmetry and gear selection are three typed layers. AUTO selects transitions. No vehicle physics, ancient-sign genealogy, new algebraic operator or canonical vocabulary is asserted.'
    },
    typedComposition:'T_[1:5] + R_i-under-dot',
    boundary:'The glyph i-under-dot marks the declared i<->j pin/hinge. Y and ¥ are presentation markers. All algebra remains ordinary roots-of-unity and typed-return mathematics.'
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
    visualSources:{
      criticalSeam:{sha256:'d9d66ef9369fd7b82222a7e112357fc2dad51cb640c1a88576a3b6cd097c10b8',custody:'MISSION_CONTROL_QUARANTINE / READ_ONLY'},
      polarJanus:{sha256:'58de13847b70a4c6a42818e0cbc38e07b92898f4b20c75e80d9907a74835e947',custody:'SCIENCE_LAB_CASE_STUDY / HISTORICAL_VISUAL'}
    },
    identityReuse:{
      criticalSeam:'DIRECT-ZETA / Re(s)=1/2 / SOURCE_BOUND_COORDINATE_VIEW_ONLY',
      polarJanus:'CAND:POLARPASS / polar-janus-420-wheel / OWNER_VISUAL_NOT_VALIDATED_RESULT',
      stillpoint:'ORION Stillpoint Compass / COMPARATOR_REVIEW_ONLY'
    },
    mathematicalReadings:{
      criticalSeam:'J(s)=1-conj(s); Fix(J)={s:Re(s)=1/2}; display breathing is a homotopy, not RH evidence',
      polarJanus:'theta_k=2*pi*k/420 on Z/420Z; psi_plus(t)=-psi_minus(-t) is a display symmetry, not a physical ratchet law'
    },
    a0Crosswalk:[
      'results/a0-red-balloon-mathfield-intake-2026-11-03.json#zeta_axis_register',
      'results/a0-splinter-geometry-cl-td-intake-2026-10-27.json#critical_line',
      'A0_ORIENTATION_CONTROLLER_BENCH.html#orientationRoleMap',
      '../../../SCIENCE_LAB/NAVIGATION/POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json'
    ],
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
  return {EPS,CLUSTERS,A1,A2,A3,F0_MINUS,H,HINV,WRONG_INV,SNAP_SEQUENCE,DISPLAY_RETURN,MATRYOSHKA_CARRIER,MAITROSCHKA_JOINT,NEXAHEDRON_V3_SOURCE_LENS,snapOf,address,clusterOf,cubeOf,sphereOf,stereographic,inverseStereographic,observer,route,allAddresses,census,math:{dot,norm,sub,scale,transpose,mv,mm,det,eye,matrixDistance}};
});
