'use strict';
// Bounded source-plot/adapter diagnostics, not a physics or historical-law test.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),A=require('./a0-mask-assembly.js');
const TAU=2*Math.PI,EPS=1e-9,green=t=>[Math.sin(t),Math.sin(2*t)/2],rad=a=>a*Math.PI/180;
const fixture=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-quantum-arch-source-fixture-v1.json','utf8'));
let checks=0;function ok(x,m){checks++;assert.ok(x,m);}function near(a,b,tol=1e-10){ok(Math.abs(a-b)<=tol,a+' ~= '+b);}function eq(a,b){checks++;assert.deepEqual(a,b);}
function unique(points){const out=[];for(const p of points)if(!out.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<EPS))out.push(p);return out;}
function intersections(degrees,ray=true){
 if(!Number.isFinite(degrees)||degrees<0||degrees>85)throw Error('declared diagnostic angle 0..85 degrees');
 const m=Math.tan(rad(degrees)),points=[[0,0]];
 if(degrees<45){const x=Math.sqrt(1-m*m);points.push([x,m*x],[-x,-m*x]);}
 return unique(points.filter(p=>!ray||p[0]>=-EPS&&p[0]<=1+EPS));
}
function circleHits(degrees,radius,ray=true){const a=rad(degrees),p=[radius*Math.cos(a),radius*Math.sin(a)];return ray?[p]:[p,p.map(x=>-x)];}
// Independent segment/line intersections for the actual 200-point source polyline.
function polylineHits(degrees,ray=true){const m=Math.tan(rad(degrees)),p=Array.from({length:200},(_,i)=>green(i*TAU/199)),hits=[];
 for(let i=1;i<p.length;i++){
  const a=p[i-1],b=p[i],ha=a[1]-m*a[0],hb=b[1]-m*b[0];
  if(Math.abs(ha)<1e-12)hits.push(a);
  if(ha*hb<0){const u=ha/(ha-hb);hits.push([a[0]+u*(b[0]-a[0]),a[1]+u*(b[1]-a[1])]);}
  if(i===p.length-1&&Math.abs(hb)<1e-12)hits.push(b);
 }
 return unique(hits.filter(p=>!ray||p[0]>=-EPS&&p[0]<=1+EPS));
}
function diagnostics(){
 const comparisons=[0,20,30,32,33,34,35,40,45,50].map(degrees=>({degrees,greenPositiveRay:intersections(degrees),greenFullLine:intersections(degrees,false),purplePositiveRay:circleHits(degrees,.5),orangePositiveRay:circleHits(degrees,1)}));
 const angle=33,m=Math.tan(rad(angle)),alpha=Math.acos(m);
 const events=[0,alpha,Math.PI,TAU-alpha].map(t=>({t,point:green(t),onSourcePositiveRay:green(t)[0]>=-EPS,origin:Math.abs(Math.sin(t))<EPS}));
 return {comparisons,angle33:{slope:m,sourceRayDistinctGreenPoints:2,extendedLineDistinctGreenPoints:3,parameterEventsOneCycle:events,positiveRayEventsOneCycle:events.filter(e=>e.onSourcePositiveRay).length,fullLineHalfPlaneSignFlipsOneCycle:4,candidateBinaryGate:'sign(y-tan(33deg)*x) requires extending the source ray to an infinite line; not present in the original plot.'},vmMap:{scope:'Current default raw VM pair only: ratio 3:2, phase 90 degrees',formula:'image green = (VM.y, VM.x/2), with image parameter u = sourceTime + pi/4',mapDeterminant:-.5,isIsometry:false,isRepresentationAdapter:true,newCarrier:false},conclusion:'USEFUL_EXACT_DEFAULT_VM_VIEW_ADAPTER_NO_UNIQUE_33_DEGREE_SELECTOR',motionRuleRecovered:false,redStaircaseBound:false,physicalClaim:false};
}
function test(){
 for(const source of [fixture.originalPlot,fixture.userImage])eq(crypto.createHash('sha256').update(fs.readFileSync(source.path)).digest('hex'),source.sha256);
 eq(crypto.createHash('sha256').update(fixture.recovered.code).digest('hex'),fixture.recovered.normalizedCodeSHA256);
 for(const code of ['x_snake1 = np.sin(t)','y_snake1 = np.sin(2 * t) / 2','x_snake2 = np.cos(t) / 2','y_snake2 = np.sin(t) / 2','x_red_alert = np.linspace(0, 1, 100)','np.deg2rad(33)','np.deg2rad(45)'])ok(fixture.recovered.code.includes(code),'recovered generator '+code);
 ok(!fixture.recovered.code.includes('plt.axis(\'equal\')'),'original aspect not declared equal');
 let vmError=0;for(let tick=0;tick<=120;tick++){
  const r=A.snapshot({...A.create(),tick}),v=r.planes.find(p=>p.id==='VM').point,p=green(r.time+Math.PI/4);
  near(v[1],p[0]);near(v[0]/2,p[1]);vmError=Math.max(vmError,Math.abs(v[1]-p[0]),Math.abs(v[0]/2-p[1]));
 }
 for(let i=0;i<=1000;i++){
  const t=i*TAU/1000,[x,y]=green(t);near(y*y,x*x*(1-x*x));ok(x*x+y*y<=1+1e-12,'green inside unit circle');
  const q=green(-t);near(q[0],-x);near(q[1],-y);
 }
 const r=diagnostics();for(const item of r.comparisons){
  eq(item.greenPositiveRay.length,item.degrees<45?2:1);eq(item.greenFullLine.length,item.degrees<45?3:1);
  for(const [ray,points]of [[true,item.greenPositiveRay],[false,item.greenFullLine]]){
   const numerical=polylineHits(item.degrees,ray);eq(numerical.length,points.length);
   for(const p of points){near(p[1]-Math.tan(rad(item.degrees))*p[0],0);near(p[1]*p[1],p[0]*p[0]*(1-p[0]*p[0]));ok(numerical.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<.002),'sampled source agrees with analytic intersection');}
  }
  for(const [radius,points]of [[.5,item.purplePositiveRay],[1,item.orangePositiveRay]])for(const p of points){near(Math.hypot(...p),radius);near(p[1]-Math.tan(rad(item.degrees))*p[0],0);}
 }
 eq(r.angle33.parameterEventsOneCycle.length,4);eq(r.angle33.positiveRayEventsOneCycle,3);
 const m=r.angle33.slope,h=t=>{const p=green(t);return p[1]-m*p[0];};for(const event of r.angle33.parameterEventsOneCycle){near(h(event.t),0);ok(h(event.t-1e-6)*h(event.t+1e-6)<0,'full-line gate sign flips at each declared parameter event');}
 const hits=intersections(33);near(hits[1][0],.7604405156864122);near(hits[1][1],.4938358450617868);
 // At 45 degrees one origin branch is tangent, another crosses; do not count it as a new closed return.
 const derivative=t=>[Math.cos(t),Math.cos(2*t)];eq(derivative(0),[1,1]);near(derivative(Math.PI)[0],-1);near(derivative(Math.PI)[1],1);
 for(const degree of [20,30,32,34,35,40])eq(intersections(degree).length,intersections(33).length);
 checks++;assert.throws(()=>intersections(NaN));checks++;assert.throws(()=>intersections(90));
 return {schema:'a0.quantum-arch-geometry-diagnostic/1',date:'2026-10-20',status:'PASS',checks,sourceFixture:'assets/a0-quantum-arch-source-fixture-v1.json',recoveredGenerator:true,maxDefaultVmError:vmError,...r,browserAcceptance:false,boundary:'Engineering diagnostics of recovered plot equations and existing source adapter. No scientific activation, historical physics adoption, 29-pose turn, whole-machine Return or red-step law.'};
}
if(require.main===module)console.log(JSON.stringify(test(),null,2));
module.exports={green,intersections,circleHits,polylineHits,diagnostics,test};
