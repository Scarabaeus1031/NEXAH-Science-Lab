'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('./a0-q4-lamella-fold.js');let passed=0;function test(name,fn){fn();passed++;process.stdout.write(`PASS ${name}\n`);}
test('V is held at cube center',()=>assert.deepEqual(L.CENTER,{x:5,y:5,z:5}));
test('keypad omits held center five',()=>assert.deepEqual(L.KEYS,[1,2,3,4,6,7,8,9]));
test('king has eight unique neighbors',()=>assert.equal(L.audit().kingNeighbors,8));
test('king move is plus or minus one per active coordinate',()=>assert.deepEqual(L.move('king',1,5,'xy').target,{x:4,y:4,z:5}));
test('queen reaches five cells along a ray',()=>assert.deepEqual(L.ray('queen',6,5,'xy').at(-1),{x:10,y:5,z:5}));
test('queen has forty unique center-ray targets',()=>assert.equal(L.audit().queenTargets,40));
test('knight uses exact two-plus-one move',()=>assert.deepEqual(L.move('knight',3,5,'xy').target,{x:4,y:7,z:5}));
test('knight has eight unique destinations',()=>assert.equal(L.audit().knightTargets,8));
test('XY maps onto fixed z lamella',()=>assert.deepEqual(L.move('king',9,1,'xy').target,{x:6,y:6,z:5}));
test('XZ maps onto fixed y lamella',()=>assert.deepEqual(L.move('king',9,1,'xz').target,{x:6,y:5,z:6}));
test('YZ maps onto fixed x lamella',()=>assert.deepEqual(L.move('king',9,1,'yz').target,{x:5,y:6,z:6}));
test('three folds return to XY',()=>assert.equal(L.audit().foldCycle,true));
test('all declared center moves remain inside 11 cube',()=>assert.equal(L.audit().allValid,true));
test('HTML binds lamella controls and module',()=>{const html=fs.readFileSync(path.join(__dirname,'A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html'),'utf8');assert.match(html,/data-q4-lamella-fold/);assert.match(html,/1–2–3 \/ 4–V–6 \/ 7–8–9/);assert.match(html,/a0-q4-lamella-fold\.js/)});
process.stdout.write(`Lamella fold: ${passed}/14 PASS\n`);
