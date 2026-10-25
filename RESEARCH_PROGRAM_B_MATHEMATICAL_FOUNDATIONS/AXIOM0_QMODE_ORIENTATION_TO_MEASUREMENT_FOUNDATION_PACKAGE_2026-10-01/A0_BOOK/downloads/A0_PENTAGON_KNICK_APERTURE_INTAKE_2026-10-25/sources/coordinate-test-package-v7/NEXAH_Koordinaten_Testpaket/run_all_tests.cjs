const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(__dirname+'/NEXAH_Pentagon_Knick_Lab.html','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext('const rad=x=>x*Math.PI/180;'+html.slice(html.indexOf('function calc(p)'),html.indexOf('let rgbStep='))+';globalThis.api={calc,openings,tipGeometry,rgbRoute};',ctx);
const model=ctx.api,native=require(__dirname+'/a0-blue-body-interior-crt16-v1.js'),TAU=2*Math.PI;
const D=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i])),norm=a=>Math.hypot(...a),assert=(v,msg)=>{if(!v)throw Error(msg)},rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a),p[2]],rad=d=>d*Math.PI/180;
const key=(l,q)=>`P${l}:${q.toString(2).padStart(4,'0')}`,pop=q=>q.toString(2).replace(/0/g,'').length;
function edge(a,b){const [l,q]=[+a[1],parseInt(a.slice(3),2)],[m,r]=[+b[1],parseInt(b.slice(3),2)];return l===m?pop(q^r)===1:q===r&&Math.abs(l-m)===1;}
const J={};for(let i=0;i<5;i++)for(const [g,l,ch]of [['A',0,i],['M',1,i],['B',2,i],['C',1,i+8]])J[g+i]=native.bind(l,ch).sourceKey;
const graphEdges=[];for(let i=0;i<5;i++){for(const g of ['A','B','C'])graphEdges.push([g+i,g+((i+1)%5)]);for(const g of ['A','B','C'])graphEdges.push([g+i,'M'+i]);}
const paths=graphEdges.map(([a,b])=>{const start=J[a],end=J[b];if(edge(start,end))return {from:a,to:b,path:[start,end]};const l=+start[1],q=parseInt(start.slice(3),2),r=parseInt(end.slice(3),2);const middle=key(l,(q&r)|4);assert(edge(start,middle)&&edge(middle,end),'invalid bridge');return {from:a,to:b,path:[start,middle,end]};});
const allkeys=[...new Set(paths.flatMap(p=>p.path))],used=new Set(paths.flatMap(p=>p.path.slice(1).map((k,i)=>[p.path[i],k].sort().join('|'))));
const extra=[];for(let i=0;i<allkeys.length;i++)for(let j=i+1;j<allkeys.length;j++)if(edge(allkeys[i],allkeys[j])&&!used.has([allkeys[i],allkeys[j]].sort().join('|')))extra.push([allkeys[i],allkeys[j]]);
let common=[];for(let l=0;l<3;l++)for(let q=0;q<16;q++){const k=key(l,q);if([0,1,2,3,4].every(i=>edge(k,J['M'+i])))common.push(k);}
assert(allkeys.length===23&&used.size===33&&extra.length===8,'graph counts');
let phaseCases=0,maxSourceInverse=0,maxRodError=0,maxReturn=0;
function viewMap(ch,l,phase,theta){const p={theta,mode:'kink',meaning:'interior',angle:137,s:1,L:1},r=model.calc(p),src=native.tilePoint(ch,l,phase),target=l===0?-theta/2:l===2?theta/2:0,correction=rad(180+target-(l===1?-1:1)*phase*30),rho=l===1?norm([r.M[0][0],r.M[0][1]]):r.R,ratio=rho/.62;const xy=rot([src.x,src.y,src.z],correction);return{source:src,target:[xy[0]*ratio,xy[1]*ratio,l*r.h/2],correction,ratio,r};}
for(let phase=0;phase<12;phase++){
 const theta=65.8*Math.sin(TAU*phase/12);
 for(let l=0;l<3;l++)for(let i=0;i<5;i++){const v=viewMap(i,l,phase,theta),dst=v.target,group=['A','M','B'][l];assert(D(dst,v.r[group][i])<1e-12,'phase map');const back=rot([dst[0]/v.ratio,dst[1]/v.ratio,l-1],-v.correction);maxSourceInverse=Math.max(maxSourceInverse,D(back,[v.source.x,v.source.y,v.source.z]));phaseCases++;}
 const r=model.calc({theta,mode:'kink',meaning:'interior',angle:137,s:1,L:1});for(let i=0;i<5;i++)for(const g of ['A','B'])maxRodError=Math.max(maxRodError,Math.abs(D(r[g][i],r.M[i])-.5));
}
const ref=model.calc({theta:0,mode:'kink',meaning:'interior',angle:137,s:1,L:1}),last=model.calc({theta:65.8*Math.sin(TAU),mode:'kink',meaning:'interior',angle:137,s:1,L:1});for(const g of ['A','M','B'])for(let i=0;i<5;i++)maxReturn=Math.max(maxReturn,D(ref[g][i],last[g][i]));
let tunedCases=0,maxTriangleError=0,rows=[];
for(const theta of [36,-65.8]){
 const p={theta,mode:'kink',meaning:'interior',angle:137,s:1,L:1},r=model.calc(p),o=model.openings(p,r,.2),P=[0,0,r.h/2],old=model.tipGeometry(p,r,o,.75),ratio=2*o.rho/Math.sqrt(7),t=model.tipGeometry(p,r,o,ratio),scale=o.rho/Math.sqrt(7);
 for(let i=0;i<5;i++){const leg1=D(P,r.M[i]),leg2=D(P,t.coordinate),hyp=D(r.M[i],t.coordinate);maxTriangleError=Math.max(maxTriangleError,Math.abs(leg1/scale-Math.sqrt(7)),Math.abs(leg2/scale-2),Math.abs(hyp/scale-Math.sqrt(11)));tunedCases++;}
 const points={...Object.fromEntries(['A','M','B'].flatMap(g=>r[g].map((v,i)=>[g+i,v]))),...Object.fromEntries(o.C.map((v,i)=>['C'+i,v])),T:old.coordinate,P};const pts=Object.values(points);let checks=0,matches=0,best=Infinity;
 for(let i=0;i<pts.length;i++)for(let j=0;j<pts.length;j++)for(let k=j+1;k<pts.length;k++){if(i===j||i===k)continue;const a=D(pts[i],pts[j])**2,b=D(pts[i],pts[k])**2,c=D(pts[j],pts[k])**2;const residual=Math.max(Math.abs(a+b-c)/(a+b),Math.min(Math.abs(4*a-7*b),Math.abs(7*a-4*b))/(a+b));checks++;best=Math.min(best,residual);if(residual<1e-10)matches++;}
 rows.push({theta,rho:o.rho,oldDelta:.75,requiredDelta:ratio,adjustment:ratio-.75,tunedTriangleScale:scale,existingPointSetSize:pts.length,existingPointTripleChecks:checks,existingExactRatioMatches:matches,bestDimensionlessResidual:best});
}
const data=JSON.parse(fs.readFileSync(__dirname+'/NEXAH_Konstanten_11er_Map.json','utf8'));let sequenceEntries=0,routeCount=0,zeroCount=0;
for(const v of Object.values(data.constants))for(const row of v.rows){sequenceEntries++;const s=row.signed;if(!s){zeroCount++;continue;}const i=Math.abs(s)-1,word=s>0?'GR':'RG',route=model.rgbRoute(i,word),inverse=model.rgbRoute(i,s>0?'RG':'GR');assert(route.nodes.join('|')===inverse.nodes.slice().reverse().join('|'),'sequence route reversal');row.route={word,nodes:route.nodes};routeCount++;}
const result={scope:'Declared comparison adapters; no changes to public A0 code.',graph:{originalNodes:20,originalEdges:30,subdivisionNodes:allkeys.length,subdivisionEdges:used.size,extraNativeEdges:extra,paths,singleStepTipCandidates:common,sourceLabelMap:J},phase:{phaseCases,maxSourceInverse,maxRodError,maxReturn,rule:'theta=65.8*sin(2pi*p/12). Per-deck rotation correction 180+targetAngle-sign(layer)*30p; radial rescaling and z=layer*h/2. New constructed view adapter, not native dynamics.'},triangles:{tunedCases,maxTriangleError,referenceStates:rows,tipRule:'delta=2*rho/sqrt7; P-M_i-T is similar to sqrt7,2,sqrt11. Virtual radial measurement P-M_i crosses the ring; not a new physical strut.'},sequence:{entries:sequenceEntries,nonzeroRoutes:routeCount,zeroNoHopMarkers:zeroCount,rule:'positive: A_i -> M_i -> B_i; negative exact reverse; zero: reference P with no graph hop; retain original source pair and position.'}};
assert(maxSourceInverse<1e-12&&maxRodError<1e-12&&maxTriangleError<1e-12,'numeric tolerances');
fs.writeFileSync(__dirname+'/nexah-all-tests.json',JSON.stringify(result,null,2));fs.writeFileSync(__dirname+'/nexah-sequence-routes.json',JSON.stringify(data,null,2));console.log(JSON.stringify(result,null,2));
