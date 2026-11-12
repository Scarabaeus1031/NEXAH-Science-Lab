'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),G=require('./a0-galileo-package-story.js');let passed=0;function test(name,fn){fn();passed++;}
test('four bounded story stages',()=>assert.equal(G.STAGES.length,4));
test('natural landmarks map uniquely to squares',()=>assert.equal(new Set(G.finiteCorrespondence(50).map(r=>r.square)).size,50));
test('square gaps follow two n plus one',()=>{for(let n=1;n<30;n++)assert.equal(G.square(n+1)-G.square(n),G.squareGap(n))});
test('cube gaps follow cubic difference',()=>{for(let n=1;n<30;n++)assert.equal(G.cube(n+1)-G.cube(n),G.cubeGap(n))});
test('triple gate exposes minus one zero plus one',()=>assert.deepEqual([0,1,2].map(i=>G.gateState(i).value),[-1,0,1]));
test('plus one is red balloon witness',()=>assert.match(G.gateState(2).label,/RED BALLOON/));
test('audit passes exact contracts',()=>assert.deepEqual(G.audit(),{uniqueSquares:true,squareGaps:true,cubeGaps:true,sameGray:true,gate:[-1,0,1],stages:4}));
test('HTML binds visual story and module',()=>{const html=fs.readFileSync(path.join(__dirname,'A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html'),'utf8');assert.match(html,/data-galileo-package-story/);assert.match(html,/GALILEO’S PARADOX/);assert.match(html,/PIPE CONSTELLATION/);assert.match(html,/a0-galileo-package-story\.js/)});
console.log(`Galileo package story: ${passed}/8 PASS`);
