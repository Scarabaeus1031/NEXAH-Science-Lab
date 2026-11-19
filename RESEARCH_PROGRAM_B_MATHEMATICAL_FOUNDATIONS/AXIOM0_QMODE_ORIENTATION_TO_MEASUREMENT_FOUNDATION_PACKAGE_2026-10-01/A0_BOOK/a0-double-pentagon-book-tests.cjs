'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const model=require('./underwindows/double-pentagon-book/a0-double-pentagon-book.js');
const html=fs.readFileSync('./underwindows/double-pentagon-book/index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('./assets/observer-lens/MANIFEST.json','utf8'));
assert.deepEqual(model.STATES,['OPEN','FOLD','COUNTERFACE','RETURN']);
assert.equal(new Set(Array.from({length:20},(_,i)=>{const a=model.addressAt(i);return `${a.stationIndex}|${a.quarterIndex}`})).size,20);
assert.equal(model.addressAt(20).exactReturn,true);assert.equal(model.addressAt(20).address,0);
assert.equal(model.viewAt('counterface').id,'COUNTERFACE');
for(const token of ['OPEN','FOLD','COUNTERFACE','RETURN'])assert.match(html,new RegExp(`data-book-view="${token}"`));
assert.match(html,/SAME ADDRESS · CHANGING VIEW/);assert.match(html,/SCC-003 besitzt einen eigenen Paper-, Operator- und Evidenzvertrag/);
assert.match(html,/keine neue Navigator-Identität und kein neues Forschungsmodul/);
assert.deepEqual(manifest.new_navigator_identities,[]);assert.deepEqual(manifest.new_navigator_relations,[]);assert.equal(manifest.publication_authorized,false);
for(const asset of manifest.assets){const bytes=fs.readFileSync(`./assets/observer-lens/${asset.file}`);assert.equal(bytes.length,asset.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256);}
console.log('A0 Double Pentagon Book tests: PASS · source-bound underwindow · 20 addresses · zero graph delta');
