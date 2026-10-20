'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('./a0-seam-origins.js');
let checks=0;function check(v){assert.ok(v);checks++;}
check(api.paths.length===4);
check(JSON.stringify([-2,0,2].map(q=>api.paths.filter(p=>api.record(p.id).value===q).length))==='[1,2,1]');
for(const projection of ['sum','abs'])for(const keep of [true,false])for(const p of api.paths){
  const r=api.record(p.id,projection,keep),c=api.recover(JSON.parse(JSON.stringify(r)));
  check(c.includes(p.id));check(Object.hasOwn(r,'origin')===keep);
  check(keep?c.length===1:c.length===((projection==='sum'&&r.value!==0)?1:2));
  const svg=api.drawing(projection,keep,p.id);
  check(!/NaN|undefined/.test(svg));check(svg.includes('stroke-dasharray="7 5"'));
}
check(JSON.stringify(api.recover(api.record('PA','sum',false)))==='["PA","PB"]');
check(JSON.stringify(api.recover(api.record('B','abs',false)))==='["B","Y"]');
for(const args of [['X'],['B','invalid'],['B','sum',1]]){assert.throws(()=>api.record(...args));checks++;}
function element(value){return{value,checked:true,handlers:{},addEventListener(k,fn){this.handlers[k]=fn;},emit(k){this.handlers[k]();}};}
const el={origin:element('B'),projection:element('sum'),key:element(),reset:element(),drawing:element(),status:element(),record:element()};
const host={dataset:{},querySelector:s=>el[s.match(/"([^"]+)"/)[1]]};
const view=api.mount({getElementById:()=>host});check(!!view);check(api.mount({getElementById:()=>host})===null);
for(const p of api.paths)for(const projection of ['sum','abs'])for(const keep of [true,false]){
  el.origin.value=p.id;el.projection.value=projection;el.key.checked=keep;el.key.emit('change');
  check(Object.isFrozen(view.snapshot()));
  check(JSON.stringify(view.snapshot())===el.record.textContent.replace(/\s/g,''));
  check(el.status.textContent.includes(api.recover(view.snapshot()).length===1?'Eindeutiger':'MEHRDEUTIG'));
}
el.reset.emit('click');check(view.snapshot().origin==='B'&&view.snapshot().projection==='sum'&&el.key.checked);
check(api.mount({getElementById:()=>null})===null);
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
check(html.includes('id="seamOrigins"')&&html.includes('src="a0-seam-origins.js"'));
check(!/setInterval|requestAnimationFrame|postMessage|fetch\(|localStorage/.test(fs.readFileSync(path.join(__dirname,'a0-seam-origins.js'),'utf8')));
for(const digits of ['0','1','12321','100000000','1000000000000','9000000000000','9'.repeat(60)])for(const width of [3,4]){
  const g=api.digitGroups(digits,width);
  check(g.parts.join('')===digits);
  check(BigInt(g.parts.join('')).toString()===g.value);
  check(g.parts.slice(1).every(p=>p.length===width));
}
check(api.digitGroups('1000000000000',4).display==='1 | 0000 | 0000 | 0000');
check(api.digitGroups('100000000',4).display==='1 | 0000 | 0000');
for(const digits of ['','00','01','-1','1.2','1e12','<script>','9'.repeat(61)]){assert.throws(()=>api.digitGroups(digits,4));checks++;}
for(const width of [0,2,5,3.5,'3']){assert.throws(()=>api.digitGroups('123',width));checks++;}
for(let a=2;a<=9;a++)for(let b=1;b<=4;b++)for(let c=1;c<=4;c++){
  const p=api.powers(a,b,c);
  check(BigInt(p.left)===(BigInt(a)**BigInt(b))**BigInt(c));
  check(BigInt(p.right)===BigInt(a)**(BigInt(b)**BigInt(c)));
  check(p.same===(p.left===p.right));
}
check(api.powers(2,3,3).left==='512'&&api.powers(2,3,3).right==='134217728');
check(api.powers(2,1,1).same);
for(const args of [[1,3,3],[10,3,3],[2,0,3],[2,3,5],[2,1.5,2],[2,Infinity,3]]){assert.throws(()=>api.powers(...args));checks++;}
for(let i=0;i<3;i++){const s=api.structure(i);check(s.leaves.join(',')==='a,b');check(s.depth===(i===0?1:2));check(s.outerCardinality===(i===2?1:2));}
assert.throws(()=>api.structure(3));checks++;
const grammarEls=Object.fromEntries(['digits','width','base','powerB','powerC','nesting','grouped','groupStatus','powerLeft','powerRight','powerStatus','nested','nestStatus','grammarRecord'].map(k=>[k,element()]));
Object.assign(grammarEls.digits,{value:'1000000000000'});grammarEls.width.value='3';grammarEls.base.value='2';grammarEls.powerB.value='3';grammarEls.powerC.value='3';grammarEls.nesting.value='0';
const grammarHost={querySelector:s=>grammarEls[s.match(/"([^"]+)"/)[1]]},grammar=api.mountGrammar(grammarHost);
check(grammar.snapshot().powers.left==='512');
grammarEls.width.value='4';grammarEls.width.emit('change');
check(grammarEls.grouped.textContent==='1 | 0000 | 0000 | 0000');
check(grammar.snapshot().grouping.value==='1000000000000');
grammarEls.nesting.value='2';grammarEls.nesting.emit('change');
check(grammar.snapshot().structure.outerCardinality===1);
check(grammarEls.nestStatus.textContent.includes('Kein numerisches'));
grammarEls.powerB.value='1';grammarEls.powerC.value='1';grammarEls.powerB.emit('change');
check(grammarEls.powerStatus.textContent.includes('GLEICHER WERT'));
grammarEls.digits.value='9000000000000';grammarEls.digits.emit('change');
check(grammar.snapshot().grouping.value==='9000000000000');
check(JSON.parse(grammarEls.grammarRecord.textContent).structure.depth===2);
const detached=grammar.snapshot();detached.structure.leaves.pop();check(grammar.snapshot().structure.leaves.length===2);
check(api.grammarMarkup().includes('中文 万亿'));
check(!api.grammarMarkup().includes('<script'));
grammar.reset();check(grammar.snapshot().grouping.width===3&&grammar.snapshot().powers.right==='134217728'&&grammar.snapshot().structure.depth===1);
for(let i=0;i<5;i++){
  const r=api.radiusLedger(i);
  check(r.radius.numerator===api.radiusUnits[i]);
  check(r.radius.normalized===Number(r.source.literal));
  check(r.scale.units===r.radius.numerator&&r.scale.multiplier===100);
  check(r.decomposition===null||r.decomposition.value===r.scale.units);
  check(r.bookkeeping.NP===null&&r.bookkeeping.RR===null&&r.bookkeeping.flatAddress===null);
  check(!r.bookkeeping.acknowledged&&r.bookkeeping.targetCells===1000**2);
  check(r.bookkeeping.ownerLabel==='537 GG');
  check(r.source.status==='READ_SNAPSHOT_NOT_LIVE');
}
check(api.radiusLedger(3).decomposition.factors.join('*')==='4*17');
check(api.radiusLedger(4).eightReadings.every(x=>x.value===8));
for(const i of [-1,5,1.2,NaN,'3']){assert.throws(()=>api.radiusLedger(i));checks++;}
const radiusEls={radiusIndex:element('3'),radiusRecord:element(),radiusStatus:element()};
const radiusHost={querySelector:s=>radiusEls[s.match(/"([^"]+)"/)[1]]},ledger=api.mountRadius(radiusHost);
check(ledger.snapshot().scale.units===68);
radiusEls.radiusIndex.value='4';radiusEls.radiusIndex.emit('change');
check(ledger.snapshot().scale.units===88&&radiusEls.radiusStatus.textContent.includes('2³'));
check(JSON.parse(radiusEls.radiusRecord.textContent).bookkeeping.status==='HOLD_ADDRESS_MAP_UNDEFINED');
const copied=ledger.snapshot();copied.bookkeeping.NP=537;check(ledger.snapshot().bookkeeping.NP===null);
ledger.reset();check(ledger.snapshot().index===3);
check(api.mountRadius({querySelector:()=>null})===null);
const sourceFile=api.radiusLedger(0).source.path;
if(fs.existsSync(sourceFile)){
  const source=fs.readFileSync(sourceFile,'utf8'),crypto=require('node:crypto');
  check(crypto.createHash('sha256').update(source).digest('hex')===api.radiusLedger(0).source.sha256);
  const scales=source.match(/const fibSteps=\[([^\]]+)\]/)[1].split(',').map(Number);
  check(scales.every((v,i)=>v===api.radiusLedger(i).radius.normalized));
}
console.log('PASS · '+checks+' checks · fibers, grammar, radius provenance, HOLD boundary and DOM controls; browser acceptance open.');
