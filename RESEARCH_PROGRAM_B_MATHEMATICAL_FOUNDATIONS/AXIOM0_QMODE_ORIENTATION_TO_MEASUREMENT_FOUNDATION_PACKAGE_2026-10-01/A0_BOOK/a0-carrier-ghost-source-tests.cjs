'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./a0-carrier-return.js');
const source=fs.readFileSync('a0-grid-atlas.js','utf8');
const start=source.indexOf('  function ghostCoordinate('),end=source.indexOf('  function ghostAddressAt(',start);
assert.ok(start>=0&&end>start);
const context={ghostSide:()=>1000,mod:(n,m)=>(n%m+m)%m};
vm.runInNewContext(source.slice(start,end),context);
let checks=0;
for(let n=0;n<=31000;n++){
 const actual=context.decodeGhostAddress(n,1000);
 const ghost=M.inspect(n).ghost;
 assert.equal(ghost.np,actual.np);assert.equal(ghost.rr,actual.rr);
 assert.equal(context.encodeGhostAddress(ghost.np,ghost.rr,1000),n);
 assert.equal(ghost.stateTransferred,false);checks+=4;
}
for(const [n,np,rr] of [[11537,11,537],[11573,11,573],[19463,19,463],[19427,19,427]]){
 const r=M.inspect(n);assert.equal(r.ghost.np,np);assert.equal(r.ghost.rr,rr);checks+=2;
}
const moduleText=fs.readFileSync('a0-carrier-return.js','utf8'),html=fs.readFileSync('A0_PINK_DIAMOND_GRID_ATLAS.html','utf8');
assert.ok(moduleText.includes('href="A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles"'));
assert.ok(html.includes('id="ghost-tiles"')&&html.includes('value="1000">1000×1000'));
assert.ok(moduleText.includes('Feldadresse ist nicht der prozedural erzeugte Zellwert'));
checks+=3;
console.log('PASS · '+checks+' Ghost address/source-link checks against actual existing encode/decode functions; no live handoff');
