const fs=require('fs'),vm=require('vm');
const path=require('path'),ROOT=__dirname;
const native=require(__dirname+'/a0-blue-body-interior-crt16-v1.js');
const data=JSON.parse(fs.readFileSync(path.join(ROOT,'NEXAH_Primstellen_Ziffernspur.json'),'utf8')).divisor_address_adapter;
const html=fs.readFileSync(path.join(ROOT,'NEXAH_Pentagon_Knick_Lab.html'),'utf8'),ctx={};vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('function arithmeticAddress('),html.indexOf('function splitPatches('))+';globalThis.address=arithmeticAddress;',ctx);
const assert=(x,m)=>{if(!x)throw Error(m)},byKey=new Map(data.records.map(r=>[r.sourceKey,r])),edge=(a,b)=>a.layer===b.layer?(a.q4^b.q4).toString(2).replace(/0/g,'').length===1:a.q4===b.q4&&Math.abs(a.layer-b.layer)===1;
let comparisons=0,edges=0,inverses=0,helper=0;
for(let i=0;i<data.records.length;i++){
 const a=data.records[i],s=native.unbind(a.sourceKey);assert(s&&s.q4===a.q4&&s.layer===a.layer,'native address');
 const comp=byKey.get(a.complement_sourceKey);assert(comp.divisor*a.divisor===11550&&comp.complement_sourceKey===a.sourceKey,'complement inverse');inverses++;
 for(let j=i+1;j<data.records.length;j++){
  const b=data.records[j],[lo,hi]=[a.divisor,b.divisor].sort((x,y)=>x-y),arith=hi%lo===0&&[2,3,5,7,11].includes(hi/lo),adj=edge(a,b);assert(arith===adj,'cover edge');assert(edge(comp,byKey.get(b.complement_sourceKey))===adj,'complement edge');comparisons++;if(adj)edges++;
 }
}
for(const g of ['A','M','B','C'])for(let i=0;i<5;i++){const a=ctx.address(g+i),r=byKey.get(a.sourceKey);assert(r&&r.divisor===a.divisor&&r.nativeModulusLabel===a.nativeModulusLabel,'HTML arithmetic label');helper++;}
assert(comparisons===1128&&edges===128,'counts');console.log(JSON.stringify({nativeAddressReturns:48,pairComparisons:comparisons,coverEdges:edges,complementInvolutions:inverses,HTMLPointLabelChecks:helper,status:'PASS'}));
