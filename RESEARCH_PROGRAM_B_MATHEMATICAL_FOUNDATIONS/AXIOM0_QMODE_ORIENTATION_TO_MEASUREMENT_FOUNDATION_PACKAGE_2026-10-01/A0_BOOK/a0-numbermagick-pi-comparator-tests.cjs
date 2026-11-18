const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('./a0-numbermagick-pi-comparator.js');

let checks=0;
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};
const near=(actual,expected,tolerance=1e-12,message='values differ')=>{assert.ok(Math.abs(actual-expected)<=tolerance,`${message}: ${actual} vs ${expected}`);checks++};
const ok=(value,message)=>{assert.ok(value,message);checks++};

eq(C.VERSION,'1.0.0','version');
eq(C.MODES,['ADDRESS','CATALAN','JANUS','CONTRACTION'],'four typed registers');

const address=C.addressAudit();
eq(address.values,[333,340,350,432],'address values');
eq(address.adjacentGaps,[7,10,82],'adjacent gaps');
eq(address.handleGaps,[99,92,82],'432 handle gaps');
eq(address.factorizations['7'],[7],'7 prime');
eq(address.factorizations['10'],[2,5],'10 factors');
eq(address.factorizations['82'],[2,41],'82 factors');
eq(address.factorizations['92'],[2,2,23],'92 factors');
eq(address.factorizations['99'],[3,3,11],'99 factors');
eq(C.primeFactors(1),[],'one has no prime factorization');
for(const n of[2,3,5,7,11,13,17,19,23,41])eq(C.primeFactors(n),[n],`${n} prime factorization`);

const catalans=[1n,1n,2n,5n,14n,42n,132n,429n,1430n];
catalans.forEach((value,n)=>eq(C.catalan(n),value,`Catalan C${n}`));
eq(C.triangulationCount(5),5n,'pentagon triangulations C3');
eq(C.triangulationCount(6),14n,'hexagon triangulations C4');
eq(C.triangulationCount(7),42n,'heptagon triangulations C5');
for(let n=0;n<8;n++){
  let sum=0n;
  for(let k=0;k<=n;k++)sum+=C.catalan(k)*C.catalan(n-k);
  eq(sum,C.catalan(n+1),`Catalan recurrence ${n}`);
}
assert.throws(()=>C.catalan(-1),/non-negative integer/); checks++;
assert.throws(()=>C.triangulationCount(2),/at least 3/); checks++;

const involutions=[
  ['ZIPPER',C.janusZipper,[0,.1,.5,.9,1],.5],
  ['MOBIUS',C.janusMobius,[-2,-.5,0,.5,2],0],
  ['KLEIN',C.janusKlein,[0,.3,Math.PI,5.2,Math.PI*2],Math.PI]
];
for(const[name,fn,values,fixed]of involutions){
  values.forEach(value=>near(fn(fn(value)),value,1e-12,`${name} involution`));
  near(fn(fixed),fixed,1e-12,`${name} fixed point`);
}
const janus=C.janusAudit();
eq(janus.status,'PASS_THREE_TYPED_INVOLUTIONS','Janus status');
eq(janus.sharedCarrier,false,'no shared carrier');
eq(janus.maps.map(row=>row.id),['ZIPPER','MOBIUS','KLEIN'],'typed Janus maps');
eq(janus.maps.map(row=>row.carrier),['UNIT_INTERVAL_BINDING_PARAMETER','MOBIUS_TRANSVERSE_INTERVAL','KLEIN_PERIODIC_SEAM'],'carriers remain typed and separate');
eq(janus.maps.map(row=>row.orientationEffect),['REVERSES_PARAMETER_ORDER','REVERSES_TRANSVERSE_SIGN','REFLECTS_PERIODIC_SEAM'],'orientation effects remain typed');
eq(janus.maps.map(row=>row.boundaryEffect),['EXCHANGES_ENDPOINTS','EXCHANGES_TRANSVERSE_EDGES','QUOTIENT_CLOSED_NO_BOUNDARY'],'boundary effects remain typed');
eq(janus.maps[0].fixedClasses,['u=1/2'],'zipper fixed class');
eq(janus.maps[1].fixedClasses,['v=0'],'Mobius fixed class');
eq(janus.maps[2].fixedClasses,['[v=0]','[v=pi]'],'Klein quotient fixed classes');
ok(janus.maps.every(row=>row.carrierPreserved),'each Janus map returns to its own carrier');
ok(janus.maps.every(row=>row.orientationReversing),'each declared Janus map reverses its typed coordinate orientation');

const matrix=C.claimMatrix();
eq(matrix.map(row=>row.id),['ADDRESS_GAPS','CATALAN_COUNT','VISIBLE_FAN','JANUS_RETURN','SHELL_ROLE_SWITCH','ROOT_SHRINK','CALENDAR_MAPPING'],'claim matrix row order');
eq(matrix.map(row=>row.state),['EXACT','EXACT','DISPLAY','TESTED','DISPLAY','NEGATIVE_CONTROL','HOLD'],'claim matrix states');
eq(matrix.find(row=>row.id==='JANUS_RETURN').result,'PASS · J^2=id · THREE CARRIERS','Janus claim result');
eq(matrix.find(row=>row.id==='ROOT_SHRINK').result,'NO RETURN','contraction remains negative control');

eq(C.shellRole(1.8),'PLATINUM INNER → IRIDIUM OUTER','outer role');
eq(C.shellRole(.8),'IRIDIUM INNER → PLATINUM OUTER','inverse role');
eq(C.shellRole(1),'COINCIDENT SHELLS · SPLIT ZERO','split zero');

const expected=[.429,.184041,.033871089681,.0011472507161783445];
expected.forEach((value,n)=>near(C.rootShrink(.429,n),value,1e-15,`root shrinking n=${n}`));
for(const base of[.429,.439,.456]){
  let previous=Infinity;
  for(let n=0;n<8;n++){
    const value=C.rootShrink(base,n);
    ok(value>0,`positive contraction ${base}/${n}`);
    ok(value<previous,`strict contraction ${base}/${n}`);
    previous=value;
  }
}
const contraction=C.contractionAudit();
eq(contraction.status,'PASS_CONTRACTION_NEGATIVE_CONTROL','contraction status');
eq(contraction.involution,false,'not involutive');
eq(contraction.exactReturn,false,'no exact return');
assert.throws(()=>C.rootShrink(1,0),/strictly between 0 and 1/); checks++;
assert.throws(()=>C.rootShrink(.5,-1),/non-negative integer/); checks++;

const audit=C.audit();
eq(audit.status,'PASS_TYPED_CROSS_DOMAIN_COMPARATOR','integrated audit');
eq(audit.newCanonicalIds,[],'no new IDs');
eq(audit.relationChanges,[],'no relation changes');
eq(audit.graphDelta,{nodes:0,relations:0,aliases:0},'zero graph delta');
eq(audit.identityReuse,['SF-NUMBERMAGICK-2025-AUDIT','MOD:NUMBER_VIEW_SUITE','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1'],'identity reuse');
eq(audit.claims.commonGenerator,false,'no common generator claim');
eq(audit.claims.physicalMechanism,false,'no physical mechanism claim');

const html=fs.readFileSync(path.join(__dirname,'A0_PLATINUM_IRIDIUM_PI_LENS.html'),'utf8');
for(const token of['id="numbermagickPiComparator"','data-npi-mode="ADDRESS"','data-npi-mode="CATALAN"','data-npi-mode="JANUS"','data-npi-mode="CONTRACTION"','id="npiCanvas"','class="npi-claim-matrix"','EXACT / TESTED / DISPLAY / HOLD','UNIT_INTERVAL_BINDING_PARAMETER','KLEIN_PERIODIC_SEAM','a0-numbermagick-pi-comparator.js','a0-numbermagick-pi-comparator.css'])ok(html.includes(token),`PI HTML contains ${token}`);
const numbermagick=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
ok(numbermagick.includes('A0_PLATINUM_IRIDIUM_PI_LENS.html#numbermagickPiComparator'),'Numbermagick links to canonical comparator');

console.log(JSON.stringify({status:'PASS',checks,address,catalan:catalans.map(String),janus:janus.status,contraction:contraction.status,graphDelta:audit.graphDelta},null,2));
