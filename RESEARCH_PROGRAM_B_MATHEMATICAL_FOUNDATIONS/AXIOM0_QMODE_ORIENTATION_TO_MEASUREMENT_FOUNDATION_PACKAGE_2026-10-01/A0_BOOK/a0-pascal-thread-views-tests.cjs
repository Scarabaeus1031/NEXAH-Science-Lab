const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const model=require('./a0-pascal-thread-views.js');let checks=0,paths=0,holds=0,wrong=0,singletons=0;
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++};
const ok=(a,label)=>{assert.ok(a,label);checks++};
const block=JSON.parse(fs.readFileSync(path.join(__dirname,'../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_PRIMEGRID_BLOCK02A_PASCAL_THREAD_QUOTIENT_2026-10-07/PRIMEGRID_BLOCK02A_RESULTS.json'),'utf8'));
for(let n=2;n<=8;n++){
 let sum=0;
 for(let k=0;k<=n;k++){const f=model.fiber(n,k);eq(f.length,block.rows_0_11[n][k],'existing Block02A row');sum+=f.length;}
 eq(sum,2**n,'row cardinality');
 for(let i=0;i<2**n;i++){
  const word=i.toString(2).padStart(n,'0');paths++;
  const full=model.snapshot(word,false,'none');eq(full.returned.value,word,'full addressed path returns without residual');
  const loss=model.snapshot(word,true,'none'),correct=model.snapshot(word,true,'correct'),bad=model.snapshot(word,true,'wrong');
  eq(correct.returned.value,word,'endpoint and correct ordinal return');
  eq(model.inverse(loss.record,loss.rank).value,word,'decoder uses record/key only');
  if(loss.candidates.length>1){holds++;eq(loss.verdict,'HOLD','missing key cannot invent history');wrong++;eq(bad.verdict,'WRONG_SOURCE','valid but wrong key fails source comparison');}
  else{singletons++;eq(loss.verdict,'EXACT','boundary singleton needs no residual');eq(bad.keyControl,'NO_ALTERNATIVE_KEY','no fake singleton negative control');}
  const steps=full.path.slice(1).map((p,j)=>p.k-full.path[j].k).join('');eq(steps,word,'node sequence preserves choices');
 }
 for(const view of model.VIEWS){
  const coords=[];
  for(let r=0;r<=n;r++)for(let k=0;k<=r;k++){
   const p=model.embedding(n,r,k,view);ok(p.every(Number.isFinite),'finite declared embedding');coords.push(p.map(v=>v.toFixed(10)).join(','));
   for(const a of [-90,0,45,90]){const q=model.screen(p,a,false),m=model.screen(p,a,true);ok(q.every(Number.isFinite),'finite camera');eq(m,[-q[0],q[1]],'mirror is display only');}
  }
  eq(new Set(coords).size,coords.length,'distinct finite 3D node coordinates; not a pixel inverse');
 }
}
for(const invalid of ['', '012', '1', '111111111','<script>']){assert.throws(()=>model.word(invalid));checks++;}
eq(model.inverse({kind:'endpoint',n:6,k:3},99).status,'INVALID_KEY','out of range rejected');
assert.throws(()=>model.inverse({kind:'path',n:2,ks:[0,2,2]}));checks++;
const defaults=model.snapshot('010101',true,'correct');eq(defaults.candidates.length,20,'C(6,3)');eq(defaults.bits.endpoint+defaults.bits.residual,8,'explicit fixed-width cost is not economy');
const tilt0=model.tiltProjection('010101',0),tilt60=model.tiltProjection('010101',60),tiltReturn=model.tiltProjection('010101',0),tilt90=model.tiltProjection('010101',90),ambiguity=model.tiltAmbiguity('010101',60);
eq(tilt60.connector.point,tilt0.connector.point,'connector world coordinate is invariant');
eq(tiltReturn.addressed,tilt0.addressed,'return restores complete world and projection state exactly');
eq(ambiguity.maxProjectionDifference,0,'opposite signed tilts have exact equal orthographic point data');
ok(ambiguity.maxWorldDifference>0,'equal projection does not imply equal spatial pose');
eq(ambiguity.sameImage,true,'same image classified');eq(ambiguity.sameSpatialPose,false,'different pose classified');
ok(tilt90.addressed.every(p=>Math.abs(p.projection[1]-tilt90.connector.point[1])<1e-12),'quarter tilt collapses planar bracket to line on declared axis');
eq(model.orthographicXY([2,3,4]),[2,3],'projection drops signed depth');
assert.throws(()=>model.tiltProjection('010101',91));checks++;
assert.throws(()=>model.rotateAroundXAxis([0,0],[0,0,0],0));checks++;
const elements=new Map();function element(id){if(!elements.has(id))elements.set(id,{dataset:{},value:'',checked:false,textContent:'',innerHTML:'',disabled:false,listeners:{},addEventListener(t,f){this.listeners[t]=f;}});return elements.get(id);}
const doc={getElementById:element};const ui=model.mount(doc);ok(ui,'actual controller mounts');eq(element('threadVerdict').textContent,'EXAKTER RETURN','full-path initial state');
function click(id){element(id).listeners.click({});}
click('threadLoss');eq(ui.snapshot().verdict,'HOLD','loss button');
click('threadReturn');eq(ui.snapshot().verdict,'EXACT','correct witness button');
click('threadWrong');eq(ui.snapshot().verdict,'WRONG_SOURCE','wrong witness button');
for(const view of model.VIEWS){element('threadView').value=view;element('threadView').listeners.change();eq(ui.snapshot().record,{kind:'endpoint',n:6,k:3},'view change preserves declared record');ok(element('threadSvg').innerHTML.includes('<title>'),'accessible SVG title');}
element('threadMirror').checked=true;element('threadMirror').listeners.change();eq(ui.state.source,'010101','mirror retains source');
element('threadAngle').value='90';element('threadAngle').listeners.input();eq(ui.state.source,'010101','camera retains source');
element('threadWord').value='bad';click('threadApply');ok(element('threadError').textContent.includes('Binärstellen'),'invalid input explained');eq(ui.state.source,'010101','invalid input does not mutate source');
element('threadWord').value='000000';click('threadApply');click('threadWrong');eq(ui.snapshot().keyControl,'NO_ALTERNATIVE_KEY','UI singleton explanation');
element('threadDepth').value='8';element('threadDepth').listeners.input();eq(ui.state.source,'00000000','depth change');
element('threadCandidates').listeners.click({target:{closest:()=>({dataset:{threadPath:'10101010'}})}});eq(ui.state.source,'10101010','candidate selection');
click('threadReset');eq(ui.state,{source:'010101',view:'grid',endpointOnly:false,key:'none',angle:0,mirror:false},'reset stable');
element('threadTiltAngle').value='60';element('threadTiltAngle').listeners.input();ok(element('threadTiltAmbiguity').textContent.includes('gleiches Bild: JA'),'tilt ambiguity visible in actual controller');
click('threadTiltReturn');eq(element('threadTiltAngle').value,'0','tilt return control');
eq(model.mount(doc),null,'mount idempotent');
const contract=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-pascal-thread-views-v1.json'),'utf8'));
eq(contract.new_finding,false,'no new scientific finding');eq(contract.research_execution,false,'no research run');ok(contract.source_limits.some(s=>s.includes('unlocated')),'exact Core membrane source open');
eq(contract.tilt_projection_connector.eleven_map_adapter,null,'no inferred 11-map adapter');eq(contract.tilt_projection_connector.projection,'orthographic XY onto z=0; not a light shadow','geometric projection boundary');
const tiltRecord=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-pascal-bracket-tilt-projection-2026-10-25.json'),'utf8'));
eq(tiltRecord.tests.plus_minus_60_max_projection_difference,ambiguity.maxProjectionDifference,'stored full-image ambiguity replay');
eq(tiltRecord.tests.plus_minus_60_max_world_difference_all_addressed_nodes,ambiguity.maxWorldDifference,'stored 3D distinction replay');
eq(tiltRecord.route.priority,'SUBORDINATE_TO_ENG-D1D2-01','technical priority retained');eq(tiltRecord.route.deployment,false,'no deployment');
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
for(const id of elements.keys())ok(html.includes('id="'+id+'"'),'live control exists '+id);
ok(!html.includes('requestAnimationFrame('),'no automatic animation');
for(const token of ['pascal-bracket-tilt-projection','Körper kippen, Rahmen und Kamera festhalten.','0.02','0.0','3.1','2.3','Ω','Monokel','rechte Braue','Golfschwung','øVō','.≠V','^°„¡“^°„¬','ENG-D1D2-01','kein Lichtschatten'])ok(html.includes(token),'tilt connector token '+token);
console.log(JSON.stringify({status:'PASS',checks,paths,endpointHoldCases:holds,wrongKeyDetected:wrong,singletonCases:singletons,scope:'software acceptance over declared finite fixture; actual controller in simulated DOM; no scientific replay or browser visual acceptance'},null,2));

