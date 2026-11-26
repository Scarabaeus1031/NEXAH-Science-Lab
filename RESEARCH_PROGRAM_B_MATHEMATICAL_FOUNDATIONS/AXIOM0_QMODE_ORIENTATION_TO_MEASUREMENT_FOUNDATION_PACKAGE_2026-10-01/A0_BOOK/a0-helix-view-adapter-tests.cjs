const assert=require('node:assert/strict');
global.A0PrimecubeModel=require('./a0-primecube-model.js');
const M=require('./a0-helix-view-adapter.js');
const twins=M.twinRungs(),orbits=M.z37Orbits();
assert.equal(twins.length,40);assert.deepEqual([twins[0].a,twins[0].b],[3,5]);assert.deepEqual([twins[29].a,twins[29].b],[659,661]);assert.deepEqual([twins.at(-1).a,twins.at(-1).b],[1091,1093]);
for(const pair of twins){assert.equal(pair.b-pair.a,2);assert(M.isPrime(pair.a)&&M.isPrime(pair.b))}
assert.equal(orbits.length,19);assert.equal(orbits.filter(x=>x.fixed).length,1);assert.deepEqual([orbits[0].a,orbits[0].b],[0,0]);
const covered=[];for(const orbit of orbits){assert.equal((37-orbit.a)%37,orbit.b);covered.push(orbit.a);if(!orbit.fixed)covered.push(orbit.b)}assert.deepEqual(covered.sort((a,b)=>a-b),Array.from({length:37},(_,i)=>i));
assert(Math.abs(M.EULER_STEP*10-M.TAU)<1e-12);assert(Math.abs(M.degrees(M.GOLDEN_ANGLE)-137.50776405003785)<1e-12);
const g=M.buildGeometry(twins,{mix:0});assert(Math.abs(g.railRatio-M.PHI)<1e-12);assert.equal(g.rungs.filter(x=>x.fibonacci).length,8);assert.equal(g.rungs.filter(x=>x.codon).length,13);
const golden=M.buildGeometry(twins,{mix:1}),measures=g.measures;
assert.equal(measures.intervals,39);assert(Math.abs(measures.spanRadians-39*M.EULER_STEP)<1e-12);assert(Math.abs(measures.turns-3.9)<1e-12);
assert(Math.abs(measures.pitchPerRadian-(g.height/39)/M.EULER_STEP)<1e-12);assert(Math.abs(measures.pitchPerTurn-M.TAU*measures.pitchPerRadian)<1e-12);
assert.equal(measures.theta,g.step);assert.equal(measures.iota,measures.pitchPerRadian);assert(Math.abs(measures.dao-(g.innerRadius**2+measures.iota**2))<1e-12);
assert(Math.abs(measures.curvature-g.innerRadius/(g.innerRadius**2+measures.pitchPerRadian**2))<1e-12);assert(Math.abs(measures.torsionMagnitude-measures.pitchPerRadian/(g.innerRadius**2+measures.pitchPerRadian**2))<1e-12);
assert(golden.measures.turns>measures.turns);assert(golden.measures.pitchPerTurn<measures.pitchPerTurn);assert(golden.measures.torsionMagnitude<measures.torsionMagnitude);assert(golden.measures.curvature>measures.curvature);
assert.deepEqual(M.STRAND_MODES,['single','double']);assert.equal(M.strandMode('single'),'single');assert.throws(()=>M.strandMode('triple'),RangeError);
assert.deepEqual(M.REGISTER_MODES,['pair','fh14','triad21','z37frame']);assert.equal(M.registerMode('triad21'),'triad21');assert.throws(()=>M.registerMode('cube'),RangeError);
const fh=M.fhBundle(40,{step:g.step,radius:g.innerRadius,height:g.height});assert.equal(fh.strandCount,14);assert.equal(fh.strands.length,14);assert(fh.strands.every(s=>s.points.length===40));
for(let j=0;j<7;j++){const f=fh.strands[j*2],h=fh.strands[j*2+1];for(let k=0;k<40;k++){assert(Math.abs(f.points[k].x+h.points[k].x)<1e-12);assert(Math.abs(f.points[k].z+h.points[k].z)<1e-12);assert.equal(f.points[k].y,h.points[k].y)}}
const triad=M.triadBundle(40,{step:g.step});assert.equal(triad.strandCount,21);assert.equal(new Set(triad.strands.map(s=>((s.phase%M.TAU)+M.TAU)%M.TAU).map(x=>x.toFixed(12))).size,21);
const frame=M.z37Frame({y:.25,radius:.72});assert.equal(frame.points.length,37);assert.equal(frame.orbits.length,19);assert.equal(frame.pairs.length,18);assert.equal(frame.fixedPoint.residue,0);assert.deepEqual(frame.seam,[18,19]);assert(Math.abs(frame.seamMidpoint.z)<1e-12);assert(frame.seamMidpoint.x<0);assert.equal(frame.axis[0].residue,0);
for(const rung of g.rungs){
  const dot=rung.strandA.x*rung.strandB.x+rung.strandA.z*rung.strandB.z;assert(Math.abs(dot+g.innerRadius**2)<1e-12);
  assert(Math.abs(rung.strandA.x+rung.strandB.x)<1e-12);assert(Math.abs(rung.strandA.z+rung.strandB.z)<1e-12);assert(Math.abs(rung.strandA.y-rung.strandB.y)<1e-12);
  assert(Math.abs(rung.midpoint.x)<1e-12);assert(Math.abs(rung.midpoint.z)<1e-12);assert(Math.abs(rung.midpoint.y-rung.strandA.y)<1e-12);
  assert.equal(rung.codonIndex,Math.floor((rung.index-1)/3)+1);assert.equal(rung.codonSlot,(rung.index-1)%3+1);
}
const doubleInspection=M.inspection('twins',29,0,'double'),singleInspection=M.inspection('twins',29,0,'single');
assert.deepEqual(doubleInspection.pair,[659,661]);assert.deepEqual(doubleInspection.return.values,[659,661]);assert(Math.abs(doubleInspection.axisIntersection.x)<1e-12);assert(Math.abs(doubleInspection.axisIntersection.z)<1e-12);
assert.deepEqual(singleInspection.single,[659]);assert.deepEqual(singleInspection.return.values,[659]);assert.equal(singleInspection.axisIntersection,null);
assert.deepEqual(M.inspection('z37',18,1,'double').pair,[18,19]);
const zeros=M.zetaZeroRecords();assert.equal(zeros.length,20);assert.equal(zeros[0].beta,.5);assert(Math.abs(zeros[0].gamma-14.134725141734693)<1e-14);assert(Math.abs(zeros.at(-1).gamma-77.1448400688748)<1e-13);
const atCritical=M.explicitFormulaPair(zeros[0],Math.log(1000));assert(Math.abs(atCritical.normalizedAmplitude-1)<1e-12);assert(Math.abs(atCritical.rawAmplitude-Math.sqrt(1000))<1e-12);
const offCritical=M.explicitFormulaPair(zeros[0],Math.log(100),.6);assert(Math.abs(offCritical.normalizedAmplitude-100**.1)<1e-12);
const expectedContribution=-2*(.5*Math.cos(atCritical.theta)+zeros[0].gamma*Math.sin(atCritical.theta))/(.25+zeros[0].gamma**2);assert(Math.abs(atCritical.normalizedContribution-expectedContribution)<1e-12);
// Compare the three terms independently and keep the p=2, r=1 documentation example pinned.
function assertNear(actual,expected,label){
  assert(Math.abs(actual-expected)<1e-12,`${label}: ${actual} ≠ ${expected}`);
}
let termCombinations=0;
for(const record of zeros){
  for(const prime of [2,3,5,7]){
    for(let repeat=1;repeat<=6;repeat++){
      const x=prime**repeat;
      const phase=record.gamma*Math.log(x);
      const absoluteRho=Math.hypot(.5,record.gamma);
      const helixPhase=phase-Math.atan2(record.gamma,.5);
      const primeWeight=Math.log(prime)/(Math.PI*Math.sqrt(x));
      const [realU,imagU]=[.5*Math.cos(record.gamma*Math.log(prime)/3),.5*Math.sin(record.gamma*Math.log(prime)/3)];
      let real=1,imag=0;
      for(let edge=0;edge<3*repeat;edge++) [real,imag]=[real*realU-imag*imagU,real*imagU+imag*realU];
      const terms=M.comparePrimeRepeat(record,prime,repeat);
      assert.equal(terms.x,x);
      assertNear(terms.phase,phase,'shared phase');
      assertNear(terms.helixPhase,helixPhase,'phase after 1/rho');
      assertNear(terms.helixWeight,2/absoluteRho,'zero-pair weight');
      assertNear(terms.helixTerm,-2/absoluteRho*Math.cos(helixPhase),'signed zero-pair term');
      assertNear(terms.primeWeight,primeWeight,'prime weight');
      assertNear(terms.primeTerm,-primeWeight*Math.cos(phase),'prime term with minus');
      assertNear(terms.withoutMinus,primeWeight*Math.cos(phase),'prime term without minus');
      assert.equal(M.iharaTriangleTerm(phase,repeat,'same'),null);
      const ihara=M.iharaTriangleTerm(phase,repeat,'other');
      assertNear(ihara.phase,phase,'declared Ihara phase');
      assertNear(ihara.weight,3*Math.hypot(real,imag),'Ihara repetition weight');
      assertNear(ihara.realTerm,3*real,'real part of +3u^(3r)');
      termCombinations++;
    }
  }
}
assert.equal(termCombinations,480);
const example=M.comparePrimeRepeat(zeros[0],2,1);
const triangle=M.iharaTriangleTerm(example.phase,1,'other');
assert.deepEqual(
  [example.phase,example.helixPhase,example.helixWeight,example.helixTerm,example.primeWeight,
    example.primeTerm,example.withoutMinus,triangle.weight,triangle.realTerm].map(value=>value.toFixed(6)),
  ['9.797445','8.262008','0.141407','0.056110','0.156013','0.145304','-0.145304','0.375000','-0.349260'],
);
const zg=M.buildZetaGeometry(zeros,{logX:Math.log(1000),betaOffset:0,strandMode:'double'});assert.equal(zg.kind,'zeta-explicit-formula');assert.equal(zg.measures,null);assert.equal(zg.rungs.length,20);
for(const pair of zg.rungs){assert(Math.abs(pair.strandA.x-pair.strandB.x)<1e-12);assert(Math.abs(pair.strandA.z+pair.strandB.z)<1e-12);assert.equal(pair.strandA.y,pair.strandB.y);assert.equal(pair.axisIntersection,null)}
const zi=M.inspection('zeta',0,0,'double',{logX:Math.log(1000),betaOffset:0});assert.equal(zi.sourceBeta,.5);assert.equal(zi.beta,.5);assert.equal(zi.axisIntersection,null);assert.equal(zi.conjugateMirror,true);assert.deepEqual(zi.return.values,[zeros[0].a,zeros[0].b]);
const rllr=M.traceWordData('RLLR'),lrrl=M.traceWordData('LRRL');assert.deepEqual(rllr.signs,[1,-1,-1,1]);assert.deepEqual(rllr.kinkPositions,[1,3]);assert.equal(rllr.kinkCount,2);assert.equal(rllr.balance,0);assert.equal(rllr.complement,'LRRL');assert.equal(rllr.palindrome,true);assert.equal(lrrl.complement,'RLLR');assert.throws(()=>M.traceWordData('RRRR'),RangeError);
const seam=M.phaseSeamData();assert.equal(seam.shadow,-1/12);assert.equal(seam.visible,11/12);assert.equal(seam.liftDelta,1);assert.equal(seam.equivalentModuloOne,true);
const traceGeometry=M.buildZetaGeometry(zeros,{logX:Math.log(1000),zetaLens:'trace',traceWord:'RLLR'});assert.equal(traceGeometry.lensMode,'trace');assert.equal(traceGeometry.rungs.filter(r=>r.kink).length,10);assert.deepEqual(traceGeometry.rungs.slice(0,4).map(r=>r.traceSymbol),['R','L','L','R']);
const seamGeometry=M.buildZetaGeometry(zeros,{logX:Math.log(1000),zetaLens:'seam'});assert.equal(seamGeometry.lensMode,'seam');for(const pair of seamGeometry.rungs){assert(Math.abs(pair.strandA.x-pair.strandB.x)<1e-12);assert(Math.abs(pair.strandA.z-pair.strandB.z)<1e-12);assert.equal(pair.phaseLift.liftDelta,1);assert.equal(pair.conjugateMirror,false)}
const traceInspection=M.inspection('zeta',1,0,'double',{logX:Math.log(1000),zetaLens:'trace',traceWord:'RLLR'}),seamInspection=M.inspection('zeta',0,0,'double',{logX:Math.log(1000),zetaLens:'seam'});assert.equal(traceInspection.traceSymbol,'L');assert.equal(traceInspection.kink,true);assert.equal(seamInspection.phaseLift.equivalentModuloOne,true);assert.equal(seamInspection.conjugateMirror,false);
const residueRecords=M.primeResidueRecords(),primeTail=M.primeTailRecords();assert.equal(residueRecords.length,168);assert.equal(residueRecords[0].prime,2);assert.equal(residueRecords.at(-1).prime,997);assert.equal(primeTail.length,18);assert.equal(primeTail[0],1009);assert.equal(primeTail.at(-1),1109);

const primecube=global.A0PrimecubeModel;
assert.deepEqual(residueRecords.map(({prime})=>prime),primecube.sieve(1000));
for(const {index,prime,sourceIds} of residueRecords){
  const cubeAddress=primecube.cubeAddress(prime);
  assert.equal(primecube.cubeNumber(cubeAddress),prime);
  assert.equal(M.inspection('residue',index-1,0,'double',{residueAngle:'paired'}).recordId,sourceIds[0]);
  assert.equal(sourceIds[0],'PC1111:N'+String(prime).padStart(4,'0'));
}
const loki419=M.inspection('residue',80,0,'double',{residueAngle:'paired'});
assert.deepEqual([loki419.index,loki419.prime,loki419.recordId],[81,419,'PC1111:N0419']);
assert.deepEqual(primecube.cubeAddress(loki419.prime),{x:0,y:5,z:3});
assert.equal(primecube.cubeNumber({x:0,y:5,z:3}),loki419.prime);
assert.equal(primecube.cubeNumber({x:0,y:3,z:3}),397);
const constantSpectrum=M.sliceSpectrum([1,1,1,1]);
assert.equal(constantSpectrum.mean,1);
assert.ok(constantSpectrum.bins.every(term=>term.amplitude===0));
const alternatingSpectrum=M.sliceSpectrum([1,0,1,0]);
assert.equal(alternatingSpectrum.mean,0.5);
assert.ok(alternatingSpectrum.bins[0].amplitude<1e-12);
assert.equal(alternatingSpectrum.bins[1].amplitude,0.5);
for(const [residue,peakBin,amplitude] of [[2,64,0.13167346804130486],[6,71,0.14495052341231754]]){
  const {mean,bins}=M.sliceSpectrum(residueRecords.map(record=>Number(record.residue7===residue)));
  assert.equal(mean,27/168);
  assert.equal(bins.length,84);
  const peak=bins.reduce((best,term)=>term.amplitude>best.amplitude?term:best);
  assert.equal(peak.bin,peakBin);
  assert.ok(Math.abs(peak.amplitude-amplitude)<1e-12);
}

const fourierWindows=M.mod7FourierComparison();
assert.deepEqual(fourierWindows.map(({start,end,first,last})=>[start,end,first,last]),[
  [1,168,2,997],[169,336,1009,2267],[337,504,2269,3607],[505,672,3613,5011]
]);
assert.deepEqual(fourierWindows.map(({tracks})=>tracks.map(({hits,peak})=>[hits,peak.bin])),[
  [[27,64],[27,71]],[[29,38],[31,51]],[[28,35],[26,65]],[[25,82],[31,16]]
]);
for(const {start,trials,tracks} of fourierWindows){
  assert.equal(trials,999);
  for(const {reference,bins,mixed95,max95} of tracks){
    assert.equal(bins.length,84);
    assert.equal(mixed95.length,84);
    assert.ok(max95>=Math.max(...mixed95));
    assert.equal(bins[reference-1].amplitude>mixed95[reference-1],start===1);
  }
}
assert.ok(Math.abs(fourierWindows[0].tracks[0].max95-.15320045591817863)<1e-9);
assert.ok(Math.abs(fourierWindows[3].tracks[1].mixed95[70]-.10614455717752176)<1e-9);

assert.deepEqual(M.RESIDUE_ANGLE_MODES,['mod7','mod11','paired']);assert.equal(M.residueAngleMode('paired'),'paired');assert.throws(()=>M.residueAngleMode('rainbow'),RangeError);
const residuePaired=M.buildPrimeResidueGeometry(residueRecords,{residueAngle:'paired'}),residue7=M.buildPrimeResidueGeometry(residueRecords,{residueAngle:'mod7'}),residue11=M.buildPrimeResidueGeometry(residueRecords,{residueAngle:'mod11'});
assert.equal(residuePaired.kind,'prime-residue-helix');assert.equal(residuePaired.rungs.length,168);assert.equal(residuePaired.strandMode,'double');assert.equal(residue7.strandMode,'single');assert.equal(residue11.strandMode,'single');assert.equal(residuePaired.tail.length,18);
for(const rung of residuePaired.rungs){assert.equal(rung.residue7,rung.prime%7);assert.equal(rung.residue11,rung.prime%11);assert(Math.abs(Math.hypot(rung.point7.x,rung.point7.z)-residuePaired.innerRadius)<1e-12);assert(Math.abs(Math.hypot(rung.point11.x,rung.point11.z)-residuePaired.innerRadius)<1e-12)}
assert.deepEqual(residuePaired.stack51.map(({prime,index})=>[prime,index]),[[89,24],[397,78],[859,149]]);
const stackBase=residuePaired.stack51[0];
for(const rail of ['point7','point11']){
  for(const rung of residuePaired.stack51){
    assert.equal(rung[rail].x,stackBase[rail].x);
    assert.equal(rung[rail].z,stackBase[rail].z);
    assert.equal(rung[rail].y,rung.point7.y);
  }
}
assert.notDeepEqual(stackBase.point7,stackBase.point11);
assert.deepEqual(residue7.rungs[20].strandA,residue7.rungs[20].point7);assert.deepEqual(residue11.rungs[20].strandA,residue11.rungs[20].point11);
const residueInspection=M.inspection('residue',0,0,'double',{residueAngle:'paired'});assert.equal(residueInspection.recordId,'PC1111:N0002');assert.equal(residueInspection.prime,2);assert.equal(residueInspection.residue7,2);assert.equal(residueInspection.residue11,2);assert.deepEqual(residueInspection.return.values,[2]);assert.equal(residueInspection.axisIntersection,null);
const fs=require('node:fs'),html=fs.readFileSync(require('node:path').join(__dirname,'A0_HELIX_VIEW_ADAPTER.html'),'utf8');
for(const marker of ['data-hv-strand="double"','data-hv-strand="single"','data-hv-mode="zeta"','data-hv-mode="residue"','data-hv-register="pair"','data-hv-register="fh14"','data-hv-register="triad21"','data-hv-register="z37frame"','data-hv-zeta-lens="smooth"','data-hv-zeta-lens="trace"','data-hv-zeta-lens="seam"','data-hv-trace-word="RLLR"','data-hv-trace-word="LRRL"','data-hv-residue-angle="mod7"','data-hv-residue-angle="mod11"','data-hv-residue-angle="paired"','data-hv-residue-control','data-hv-logx','data-hv-beta-offset','data-hv-zeta-envelope','data-hv-turns','data-hv-iota','data-hv-dao','data-hv-pitch','data-hv-curvature','data-hv-torsion','THETA Θ','DAO=R²+ι²','RN\\A','(c)D|⁄|A','Lₖ(1/2)','RDMH · 1.6.0','θ=γ log x','−1/12 ≡ 11/12','keine Dirichlet-Charaktere','kein RH-Beweis','168 primes p≤1000','keine natürliche Primzahlhelix'])assert(html.includes(marker));
const rosslerCycles=M.rosslerLiftCycles();
const refinedRosslerCycles=M.rosslerLiftCycles({step:0.0025});
assert.equal(rosslerCycles.length,5);
assert.equal(refinedRosslerCycles.length,rosslerCycles.length);
for(const [index,cycle] of rosslerCycles.entries()){
  const {samples,returnRadius}=cycle;
  const first=samples[0],last=samples.at(-1);
  for(const crossing of [first,last]){
    assert.equal(crossing.x,0);
    assert(crossing.y<0&&-crossing.y-crossing.z>0);
  }
  assert(first.t>=40);
  assert.deepEqual(samples.slice(1,-1).filter(sample=>sample.x===0),[]);
  for(let i=1;i<samples.length;i++){
    assert(samples[i].t>samples[i-1].t);
    assert(samples[i].peakZ>=samples[i-1].peakZ);
    assert(samples[i].peakZ>=samples[i].z);
  }
  assert.equal(returnRadius,Math.hypot(last.x,last.y));
  const refined=refinedRosslerCycles[index];
  assert(Math.abs(returnRadius-refined.returnRadius)<0.001);
  assert(Math.abs(last.peakZ-refined.samples.at(-1).peakZ)<0.001);
  if(index<rosslerCycles.length-1){
    const {peakZ,...endPoint}=last;
    const {peakZ:nextPeak,...nextStart}=rosslerCycles[index+1].samples[0];
    assert.deepEqual(endPoint,nextStart);
    assert.equal(nextPeak,nextStart.z);
  }
}
assert(rosslerCycles[0].samples.at(-1).peakZ<0.2);
assert(rosslerCycles[4].samples.at(-1).peakZ>21);
assert(html.includes('id="helix-rossler-lift"'));
assert(html.includes('data-rossler-view="flat"')&&html.includes('data-rossler-view="lift"'));
const partition=M.rosslerClusterComparison(rosslerCycles);
assert.equal(partition.samples.length,rosslerCycles.reduce((sum,cycle)=>sum+cycle.samples.length,0)-4);
assert.equal(new Set(partition.samples.map(({cycle,index})=>cycle+':'+index)).size,partition.samples.length);
assert(partition.samples.every(({point,cycle,index},i)=>
  point===rosslerCycles[cycle-1].samples[index]&&(!i||point.t>partition.samples[i-1].point.t)));
assert.deepEqual(M.matchSampleClusters([0,0,1,1,2,2],[2,2,0,0,1,1],3),{mapping:[1,2,0],matched:6});
assert.deepEqual(partition.aligned,partition.xyz.map(label=>partition.mapping[label]));
assert.equal(partition.matched,partition.xy.filter((label,i)=>label===partition.aligned[i]).length);
for(const matrix of [partition.reference,partition.before,partition.after]){
  assert.equal(matrix.counts.flat().reduce((sum,count)=>sum+count,0),partition.samples.length-1);
  for(const row of matrix.probabilities)assert(Math.abs(row.reduce((sum,value)=>sum+value,0)-1)<1e-12);
}
for(let from=0;from<6;from++)for(let to=0;to<6;to++){
  assert.equal(partition.before.counts[from][to],partition.after.counts[partition.mapping[from]][partition.mapping[to]]);
}
assert(Math.abs(partition.largest.delta)>0.1);
assert(html.includes('id="helix-rossler-clusters"'));
const janusRows=M.rosslerJanusOverlap(rosslerCycles);
assert.equal(janusRows.flat().filter(Boolean).length,192);
for(const [cycleIndex,rows] of janusRows.entries()){
  assert.equal(rows[0],null);
  assert.equal(rows.at(-1),null);
  for(const record of rows.filter(Boolean)){
    assert.equal(record.point,rosslerCycles[cycleIndex].samples[record.index]);
    assert(record.janus>=0&&record.janus<=1);
    assert(Number.isFinite(record.curvature)&&record.curvature>=0);
  }
}
const overlap=janusRows.flat().filter(record=>record?.overlap);
assert.deepEqual(overlap.map(({cycleIndex,index})=>[cycleIndex+1,index]),[
  [2,15],[3,14],[5,8],[5,9],[5,13],[5,18],[5,19]
]);
assert.equal(janusRows[4][13].janus.toFixed(3),'0.522');
assert.equal(janusRows[4][13].curvature.toFixed(3),'0.516');
assert(html.includes('id="helix-rossler-janus"'));
const audit=M.audit();assert.equal(audit.version,'1.6.0');assert.equal(audit.carrier.zetaZeroPairs,20);assert.equal(audit.carrier.primeResidueSharedCarrier,168);assert.equal(audit.carrier.primeResidueTail,18);assert.equal(audit.residueHelix.naturalHelixClaim,false);assert.equal(audit.residueHelix.eulerAuditIdentity,false);assert.equal(audit.explicitFormula.sourceBeta,.5);assert.equal(audit.explicitFormula.betaProbe,'COUNTERFACTUAL_VIEW_PARAMETER_ONLY');assert.equal(audit.strands.doublePhaseOffset,'π');assert.equal(audit.registers.z37frame,'1_FIXED_POINT + 18_INVERSION_PAIRS');assert.equal(audit.differentialGeometry.dao,'DAO=R^2+iota^2');assert.equal(audit.differentialGeometry.role,'DERIVED_NORMALIZED_VIEW_METRICS');assert.equal(audit.traceSeam.kinksPerWord,2);assert.equal(audit.traceSeam.dirichletCharacter,false);assert(audit.boundary.includes('not inferred as a set difference'));
const desk=fs.readFileSync(require('node:path').join(__dirname,'A0_RESEARCH_DESK.html'),'utf8'),deskReceipt=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'results/a0-prime-projection-helix-paper-routing-2026-11-21.json'),'utf8'));
for(const marker of ['RDMH Helix Register Adapter Science Desk Addendum','1+1 · 7+7 · 3×7 · 1+18','Θ=Δθ','ι=Δz/Δθ','DAO=R²+ι²','Explicit-Formula-Linse','θ=γ log x','RDMH trace / seam comparator return','Trace word ≠ Dirichlet character','−1/12 ≡ 11/12 (mod 1)','EXISTING PAPER ROUTES C+E+F','NEW ID 0 / RELATION 0'])assert(desk.includes(marker));
assert.equal(deskReceipt.schema,'nexah.a0.prime-projection-helix-paper-routing/1.3.0');assert.equal(deskReceipt.exact_checks.helix_register_modes.triad,'3x7');assert.equal(deskReceipt.exact_checks.differential_view_register.dao,'DAO=R^2+iota^2');assert.equal(deskReceipt.exact_checks.explicit_formula_lens.zero_pairs,20);assert.equal(deskReceipt.exact_checks.trace_seam_comparator.kinks_per_word,2);assert.equal(deskReceipt.exact_checks.trace_seam_comparator.dirichlet_character_claim,false);assert(deskReceipt.paper_routes.C.includes('PPS-06')&&deskReceipt.paper_routes.E.includes('PPS-06')&&deskReceipt.paper_routes.F.includes('PPS-06'));
console.log(JSON.stringify({status:'PASS',schema:'nexah.a0.helix-view-adapter-test/1.6.0',assertions:'all',termCombinations,strandModes:M.STRAND_MODES,registerModes:M.REGISTER_MODES,zetaLensModes:M.ZETA_LENS_MODES,traceWords:M.TRACE_WORDS,residueAngleModes:M.RESIDUE_ANGLE_MODES,twinRungs:twins.length,z37Orbits:orbits.length,zetaZeroPairs:zeros.length,primeResidueCarrier:residueRecords.length,primeResidueTail:primeTail.length,traceSeam:{kinksPerWord:rllr.kinkCount,shadow:seam.shadow,visible:seam.visible,liftDelta:seam.liftDelta},registers:{fh:fh.strandCount,triad:triad.strandCount,z37:`${frame.orbits.filter(x=>x.fixed).length}+${frame.pairs.length}`},explicitFormula:{sourceBeta:.5,firstGamma:zeros[0].gamma,criticalNormalizedAmplitude:atCritical.normalizedAmplitude},eulerMeasures:{theta:measures.theta,iota:measures.iota,dao:measures.dao,turns:measures.turns,pitchPerTurn:measures.pitchPerTurn,curvature:measures.curvature,torsionMagnitude:measures.torsionMagnitude},goldenMeasures:{turns:golden.measures.turns,pitchPerTurn:golden.measures.pitchPerTurn,curvature:golden.measures.curvature,torsionMagnitude:golden.measures.torsionMagnitude},goldenAngleDegrees:M.degrees(M.GOLDEN_ANGLE),lastTwin:[twins.at(-1).a,twins.at(-1).b]},null,2));
