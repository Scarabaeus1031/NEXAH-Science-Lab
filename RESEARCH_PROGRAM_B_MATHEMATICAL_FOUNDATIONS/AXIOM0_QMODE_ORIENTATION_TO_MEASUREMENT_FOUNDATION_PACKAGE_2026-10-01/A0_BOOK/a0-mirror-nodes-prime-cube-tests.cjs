'use strict';
const fs=require('fs');
const path=require('path');
const M=require('./a0-mirror-nodes-prime-cube.js');
let passed=0;
function check(label,condition){if(!condition)throw new Error(`FAIL ${label}`);passed++;console.log(`PASS ${label}`)}
function close(a,b,eps=1e-10){return Math.abs(a-b)<=eps}

const ledger=M.arithmeticLedger();
check('1033 reverses to 3301',M.reverseDigits(1033)===3301);
check('1031 negative control reverses to 1301',M.reverseDigits(1031)===1301);
check('1032 negative control reverses to 2301',M.reverseDigits(1032)===2301);
check('concatenation palindrome has digit sum 14',String(ledger.concatenation.value)===String(ledger.concatenation.value).split('').reverse().join('')&&ledger.concatenation.digitSum===14);
check('doubled concatenation has digit sum 28',ledger.concatenation.double===20666602&&ledger.concatenation.doubleDigitSum===28);
check('1033 cube is exact and ends in 937',ledger.cube.value===1102302937&&ledger.cube.value%1000===937);
check('crown sum is 17399 equals 127 times 137',ledger.crown.sum===17399&&127*137===ledger.crown.sum);
check('cube exposes twelve edges',M.CUBE_EDGES.length===12);

const poles=M.CUBE_VERTICES.filter(M.isPole).map(M.projectAlongBodyDiagonal);
check('two body-diagonal poles project to center',poles.length===2&&poles.every(p=>close(p.x,0)&&close(p.y,0)));
const ring=M.orderedRingVertices();
const radii=ring.map(({projection:p})=>Math.hypot(p.x,p.y));
check('six non-polar vertices form one radius',ring.length===6&&radii.every(r=>close(r,radii[0])));
const angles=ring.map(({projection:p})=>Math.atan2(p.y,p.x));
const gaps=angles.map((a,i)=>i<5?angles[i+1]-a:angles[0]+2*Math.PI-a);
check('hexagon angular gaps are sixty degrees',gaps.every(g=>close(g,Math.PI/3)));

const distinct=M.nodeSet('distinct');
const doubled=M.nodeSet('double3201');
check('distinct carrier preserves six declared values',JSON.stringify(distinct.map(n=>n.value))===JSON.stringify([1031,3301,3201,1033,7801,1032]));
check('variant changes only the lower antipode slot',doubled[3].value===3201&&distinct[3].value===1033&&doubled.filter((n,i)=>i!==3&&n.value!==distinct[i].value).length===0);
check('cube antipodes are index-opposite and separate from decimal reversal',JSON.stringify(M.antipodePairs('distinct').map(pair=>pair.map(n=>n.value)))===JSON.stringify([[1031,1033],[3301,7801],[3201,1032]]));

const html=fs.readFileSync(path.join(__dirname,'A0_MIRROR_NODES_PRIME_CUBE.html'),'utf8');
['mirrorNodesPrimeCube','cubeStage','projectionMode','nodeVariant','operatorMode','nodeLedger','governanceBoundary'].forEach(id=>check(`HTML anchor ${id}`,html.includes(`id="${id}"`)));
check('existing module identity is reused',html.includes('MOD:NUMBER_VIEW_SUITE'));
check('Duerer and Khajuraho remain comparison operators',html.includes('Dürer')&&html.includes('Khajuraho')&&html.includes('nicht derselbe Ortsoperator'));
check('no new canonical identity is claimed',html.includes('keine neue kanonische Identität'));
const numbermagick=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
check('Numbermagick Prime Address links to the companion instrument',numbermagick.includes('href="A0_MIRROR_NODES_PRIME_CUBE.html"'));

console.log(JSON.stringify({suite:'a0-mirror-nodes-prime-cube',passed,status:'PASS',scope:'exact arithmetic, cube projection, typed operator boundaries and static integration'},null,2));
