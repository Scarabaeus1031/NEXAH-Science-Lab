const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('./a0-club-crt-link.js'),adapter=require('./assets/a0-blue-body-interior-crt16-v1.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++},fail=f=>{assert.throws(f);checks++};
const mods=adapter.MODULI.map(BigInt),M=mods.reduce((a,b)=>a*b,1n);
eq(M,107147677900122307955347471n);
for(const n of api.FAMILY){
 const c=api.carrier(n,adapter.MODULI);eq(c.reconstructed,String(n));eq(c.exact,true);eq(c.quotient,'0');
 eq(c.residues,adapter.MODULI.map(m=>String(n%m)));
 const tuple=c.residues.map(BigInt),changed=[...tuple];changed[0]=(changed[0]+1n)%mods[0];
 ok(api.reconstruct(changed,mods).value!==BigInt(n));
}
eq(api.carrier(11537,[7,11]).reconstructed,'64');eq(api.carrier(11537,[7,11]).quotient,'149');
eq(api.carrier(11537,[7,11]).exact,true);
fail(()=>api.reconstruct([1n],[17n,19n]));fail(()=>api.reconstruct([17n],[17n]));
fail(()=>api.reconstruct([1n,2n],[6n,9n]));fail(()=>api.reconstruct([1n],[1n]));
fail(()=>api.carrier(-1,adapter.MODULI));fail(()=>api.carrier(1.5,adapter.MODULI));
const state=(address,layer)=>({plate:'tessarec',q4Address:address,q4Bits:address.toString(2).padStart(4,'0'),layer});
const keys=new Set();
for(let l=0;l<3;l++)for(let q=0;q<16;q++){
 const r=api.address(state(q,l),adapter);eq(r.status,'MATCH');eq(r.keys,['P'+l+':'+q.toString(2).padStart(4,'0')]);
 eq(adapter.ringGray(r.channel),q);eq(r.modulus,adapter.MODULI[r.channel]);keys.add(r.keys[0]);
}
eq(keys.size,48);
for(let q=0;q<16;q++){const a=api.address(state(q,null),adapter);eq(a.status,'LAYER_OPEN');eq(a.keys.length,3);}
eq(api.address({...state(1,0),q4Bits:'1111'},adapter),null);eq(api.address(state(16,0),adapter),null);
function el(){return{children:[],dataset:{},attrs:{},events:{},append(n){this.children.push(n)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}}}
const nodes=Object.fromEntries(['clubCRTLink','clubCRTCarrier','clubCRTChannels','clubCRTAddress','clubCRTResult'].map(id=>[id,el()]));
const selections=[],win={A0BlueBodyInteriorCRT16:adapter,A0ClubReturnMonitor:{choose:(...args)=>selections.push(args)}};
const view=api.mount({getElementById:id=>nodes[id],createElement:el},win);
eq(nodes.clubCRTCarrier.children.length,9);eq(nodes.clubCRTChannels.children.length,16);
eq(view.snapshot().carrier.n,11537);
view.observe(state(2,1));const expected=adapter.inverseRingGray(2);
eq(nodes.clubCRTChannels.children[expected].attrs['aria-pressed'],'true');
nodes.clubCRTChannels.children[5].events.click();eq(selections.at(-1),[adapter.ringGray(5),1]);
view.observe(state(2,null));nodes.clubCRTChannels.children[5].events.click();eq(selections.at(-1),[adapter.ringGray(5),null]);
eq(view.snapshot().carrier.n,11537);eq(view.snapshot().address.keys.length,3);
nodes.clubCRTCarrier.value='11357';nodes.clubCRTCarrier.events.change();
eq(view.snapshot().carrier.n,11357);eq(view.snapshot().address.channel,expected);
nodes.clubCRTCarrier.value='999';nodes.clubCRTCarrier.events.change();eq(view.snapshot().carrier.n,11357);
const register=fs.readFileSync(path.resolve(__dirname,'../../../00_INCOMING/THE_PRIME_GENESIS_CRT_ELEVATOR_QRT_FORMAT_LENS_GATE_01_2026-09-08/02_NUMBER_FAMILY_REGISTER.csv'),'utf8');
eq(register.trim().split(/\r?\n/).slice(1).map(row=>Number(row.split(',')[0])),api.FAMILY);
const js=fs.readFileSync(__dirname+'/a0-club-crt-link.js','utf8');ok(!/setInterval|setTimeout|fetch\(|localStorage/.test(js));
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
ok(html.indexOf('a0-blue-body-interior-crt16-v1.js')<html.indexOf('a0-club-crt-link.js'));
ok(html.indexOf('a0-club-crt-link.js')<html.indexOf('a0-club-return-monitor.js'));
console.log(JSON.stringify({status:'PASS',checks,scope:'existing 48-address adapter, open-layer candidates, source-registered 9 carriers, exact BigInt CRT tuples/modulus/shell, tamper and invalid controls, source-selection bridge; browser pixels OPEN'}));
