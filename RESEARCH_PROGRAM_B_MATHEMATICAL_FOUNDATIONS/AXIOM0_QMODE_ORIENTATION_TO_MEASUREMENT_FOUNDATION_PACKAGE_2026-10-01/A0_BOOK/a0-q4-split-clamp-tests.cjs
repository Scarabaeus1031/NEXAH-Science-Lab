'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),S=require('./a0-q4-split-clamp.js');let passed=0;function test(name,fn){fn();passed++;}
test('four visual story stages',()=>assert.equal(S.STAGES.length,4));
test('stage order is split triangle clamps return',()=>assert.deepEqual(S.STAGES.map(s=>s.id),['split','pythagoras','clamps','return']));
test('three four hypotenuse is five',()=>assert.equal(S.hypotenuse(3,4),5));
test('three four five residual is zero',()=>assert.equal(S.pythagorasResidual(3,4,5),0));
test('non-right triangle retains residual',()=>assert.notEqual(S.pythagorasResidual(3,4,6),0));
test('clamp split saturates A at three',()=>assert.deepEqual(S.clampSplit(8),{x:8,CA:3,CB:5,reconstruct:8}));
test('clamp split reconstructs finite domain',()=>{for(let x=0;x<=12;x++)assert.equal(S.clampSplit(x).reconstruct,x)});
test('audit preserves exact and visual boundaries',()=>assert.deepEqual(S.audit(),{stages:4,hypotenuse:5,residual:0,clampReturn:true,gapRetained:true}));
test('HTML binds split clamp story',()=>{const html=fs.readFileSync(path.join(__dirname,'A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html'),'utf8');for(const token of ['data-q4-split-clamp','DER SPALT','3² + 4² = 5²','a0-q4-split-clamp.js'])assert.ok(html.includes(token),token)});
console.log(`Split clamp: ${passed}/9 PASS`);
