const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const C=require('./a0-coupled-window.js');

let checks=0;
function equal(actual,expected,message){checks++;assert.equal(actual,expected,message)}
function deep(actual,expected,message){checks++;assert.deepEqual(actual,expected,message)}
function ok(value,message){checks++;assert.ok(value,message)}

equal(C.VERSION,'1.3.0','component version');
equal(Object.keys(C.SCENARIOS).length,14,'fourteen coupled windows');
deep(Object.keys(C.SCENARIOS),['division-return','lens-return','antipode','ghostgons','window','control','native','measurement','bridges','adapters','economy','observatory','ledger','root'],'scenario order');
equal(C.DÜRER[1][1],10,'Dürer inner upper left');
equal(C.KHAJURAHO[1][1],13,'Khajuraho inner upper left');

deep(C.trace('durer',2,'planar').map(item=>item.sum),[34,26,34,30,34,38,34,42,34],'Dürer planar 2x2 ledger');
deep(C.trace('khajuraho',2,'planar').map(item=>item.sum),Array(9).fill(34),'Khajuraho planar 2x2 invariant');
deep(C.trace('durer',2,'torus').map(item=>item.sum),[34,26,34,42,30,34,38,34,34,42,34,26,38,34,30,34],'Dürer toroidal 2x2 ledger');
deep(C.trace('khajuraho',2,'torus').map(item=>item.sum),Array(16).fill(34),'Khajuraho toroidal 2x2 invariant');
deep(C.trace('durer',3,'planar').map(item=>item.sum),[69,72,81,84],'Dürer planar 3x3 ledger');
deep(C.trace('khajuraho',3,'planar').map(item=>item.sum),[72,77,82,75],'Khajuraho planar 3x3 ledger');
deep(C.trace('durer',3,'torus').map(item=>item.sum).sort((a,b)=>a-b),Array.from({length:16},(_,i)=>69+i),'Dürer toroidal 3x3 permutation');
deep(C.trace('khajuraho',3,'torus').map(item=>item.sum).sort((a,b)=>a-b),Array.from({length:16},(_,i)=>69+i),'Khajuraho toroidal 3x3 permutation');

for(const carrier of ['durer','khajuraho'])for(const size of [2,3])for(const boundary of ['planar','torus']){
  const total=C.positions(size,boundary).length;
  equal(total,boundary==='torus'?16:(5-size)**2,`${carrier} ${size} ${boundary} position count`);
  for(let index=0;index<total;index++){
    const shot=C.snapshot(C.createState({carrier,size,boundary,index}));
    equal(shot.returnExact,true,'declared residual returns exactly');
    equal(shot.selected.cells.length,size*size,'window cell count');
    ok(shot.candidates.some(candidate=>candidate.row===shot.selected.row&&candidate.col===shot.selected.col),'source included in candidate fibre');
  }
}
equal(C.candidates('khajuraho',2,'planar',34).length,9,'planar Khajuraho ambiguity');
equal(C.candidates('khajuraho',2,'torus',34).length,16,'toroidal Khajuraho ambiguity');
equal(C.candidates('durer',2,'planar',26).length,1,'Dürer unique local view exists');

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'a0-coupled-window.css'),'utf8');
const tour=fs.readFileSync(path.join(__dirname,'a0-bench-showcase-tour.js'),'utf8');
const packageRecord=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-coupled-window-system-v1.json'),'utf8'));
equal((html.match(/data-coupled-open=/g)||[]).length,14,'fourteen launcher buttons');
ok(html.includes('id="coupledWindowHub"'),'hub anchor');
ok(html.includes('id="coupledWindow"'),'dialog anchor');
ok(html.includes('a0-coupled-window.css'),'component stylesheet');
ok(html.includes('a0-coupled-window.js'),'component script');
ok(html.indexOf('a0-coupled-window.js')<html.indexOf('a0-bench-showcase-tour.js'),'window mounts before tour');
ok(html.includes('BEREIT · 56 STATIONEN'),'tour count');
ok(tour.includes("id:'moving-window'"),'moving window tour station');
ok(tour.includes("scenario:'measurement'"),'tour maps measurement window');
ok(tour.includes("requireCall('A0CoupledWindowController','open'"),'tour opens coupled stage through checked API');
ok(css.includes('@media(max-width:680px)'),'phone layout');
ok(css.includes('@media(prefers-reduced-motion:reduce)'),'reduced motion layout');
ok(css.includes('.coupled-window::backdrop'),'modal backdrop');
ok(html.includes('id="coupledWindowSize"'),'reader window size toggle');
ok(html.includes('id="coupledWindowReturn"'),'explicit return-to-reading-place control');
ok(html.includes('AUTO-DEMO WEITER ABSPIELEN'),'paused master control discloses automatic playback');
ok(css.includes('.coupled-window-maximized'),'maximized reader layout');
ok(css.includes('.cw-reader-frame'),'embedded document reader layout');
equal(C.SCENARIOS.native.custom,'source-chain','native window mounts live source chain');
ok(C.SCENARIOS.native.modules.every(module=>['nativeFaceBridge','ailApertureControl','fourApertureNinefold','ocbRecordReplay'].includes(module.target)),'four existing native source targets reused');
ok(css.includes('.cw-source-deck[data-mode="focus"]'),'focus plus three source layout');
ok(css.includes('.cw-source-deck[data-mode="overview"]'),'four-source overview layout');
ok(fs.readFileSync(path.join(__dirname,'a0-coupled-window.js'),'utf8').includes('cw-source-return:'),'source modules return to original DOM positions');
ok(fs.readFileSync(path.join(__dirname,'a0-coupled-window.js'),'utf8').includes('returnScroll'),'reader preserves exact scroll return');
ok(fs.readFileSync(path.join(__dirname,'a0-coupled-window.js'),'utf8').includes('openDocument'),'reusable document viewer API');
equal(packageRecord.benchVersion,'0.17.0','package bench version');
equal(packageRecord.windows.length,14,'package window count');
equal(packageRecord.authority.newCanonicalIdentity,false,'no identity creation');
for(const record of [...packageRecord.sources,...packageRecord.implementation]){
  const actual=crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,record.path))).digest('hex');
  equal(actual,record.sha256,`bound hash: ${record.path}`);
}

console.log(JSON.stringify({status:'PASS',checks,windowRecords:90,scenarios:14,tourStations:56,scope:'source-bound engineering window system; no new Study, carrier identity or graph relation'}));
