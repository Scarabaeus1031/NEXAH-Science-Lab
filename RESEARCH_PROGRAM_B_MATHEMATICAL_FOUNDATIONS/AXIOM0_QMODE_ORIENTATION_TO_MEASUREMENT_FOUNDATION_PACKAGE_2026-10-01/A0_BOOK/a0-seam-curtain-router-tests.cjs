#!/usr/bin/env node
const assert=require('node:assert/strict');
const C=require('./a0-tesseract-face-coupler.js');

const checks=[];
const test=(name,fn)=>{try{fn();checks.push({name,pass:true})}catch(error){checks.push({name,pass:false,error:error.message})}};
const boundary=C.seamBoundary();
const audit=C.seamCurtainAudit();
const route=C.seamHandleRoute();
const edgeIds=new Set(boundary.cubeEdges.map(edge=>edge.id));
const seamEdgeIds=new Set(boundary.seamEdges.map(edge=>edge.id));

test('G8 cubed carrier retains 512 addressed nodes',()=>assert.equal(C.cubeSamples.length,512));
test('orthogonal G8 cubed lattice has exactly 1344 undirected edges',()=>assert.equal(C.cubeEdges.length,1344));
test('orthogonal lattice edge addresses are unique',()=>assert.equal(edgeIds.size,1344));
test('QW mask partitions all nodes into 256 BLUE and 256 PINK',()=>assert.deepEqual([boundary.blue.length,boundary.pink.length],[256,256]));
test('BLUE and PINK are disjoint',()=>{const blue=new Set(boundary.blue.map(node=>node.linear));assert(boundary.pink.every(node=>!blue.has(node.linear)))});
test('BLUE union PINK reconstructs all 512 nodes',()=>assert.equal(new Set([...boundary.blue,...boundary.pink].map(node=>node.linear)).size,512));
test('mask side is determined only by q3',()=>C.cubeSamples.forEach(node=>assert.equal(C.maskSide(node),node.q4[3]===0?'BLUE':'PINK')));
test('discrete seam has exact 576 crossing edges',()=>assert.equal(boundary.seamEdges.length,576));
test('every seam edge joins one BLUE and one PINK node',()=>boundary.seamEdges.forEach(edge=>assert.notEqual(C.maskSide(edge.a),C.maskSide(edge.b))));
test('every seam edge is a declared orthogonal lattice edge',()=>boundary.seamEdges.forEach(edge=>assert(edgeIds.has(edge.id))));
test('seam exposes 504 unique addressed boundary nodes',()=>assert.equal(new Set(boundary.seamNodes.map(node=>node.linear)).size,504));
test('node address preserves x y z and Q4 bits',()=>assert.equal(C.nodeAddress(73),'G8:1,1,1|q=1110'));
test('z curtain ordering yields eleven occupied midpoint slices',()=>assert.equal(C.curtainSlices(boundary,'z').length,11));
test('curtain slices are strictly ordered by midpoint key',()=>{const keys=C.curtainSlices(boundary,'z').map(slice=>slice.key);assert.deepEqual(keys,[...keys].sort((a,b)=>a-b));assert.equal(new Set(keys).size,keys.length)});
test('curtain slices partition seam edges without duplication',()=>{const ids=C.curtainSlices(boundary,'z').flatMap(slice=>slice.edges.map(edge=>edge.id));assert.equal(ids.length,576);assert.equal(new Set(ids).size,576)});
test('curtain slice union reconstructs the exact seam',()=>assert.equal(audit.slicesReconstructSeam,true));
test('seam graph component count is exact and explicit',()=>assert.equal(route.componentCount,117));
test('largest seam component has eight nodes and twelve edges',()=>assert.deepEqual([route.componentNodeCount,route.componentEdgeCount],[8,12]));
test('both route handles are addressed seam nodes',()=>{const nodes=new Set(boundary.seamNodes.map(node=>node.linear));assert(nodes.has(route.start));assert(nodes.has(route.end));assert.match(route.startAddress,/^G8:/);assert.match(route.endAddress,/^G8:/)});
test('handle route uses only declared seam edges',()=>{for(let i=1;i<route.path.length;i+=1)assert(seamEdgeIds.has(`${Math.min(route.path[i-1],route.path[i])}~${Math.max(route.path[i-1],route.path[i])}`))});
test('deterministic handle route is the three-edge component diameter',()=>assert.equal(route.pathEdgeCount,3));
test('swing Return reverses the route and closes exactly',()=>{assert.equal(route.returnGap,0);assert.equal(route.cycle[0],route.cycle.at(-1));assert.deepEqual(route.cycle.slice(route.path.length),route.path.slice(0,-1).reverse())});
test('receipt names the existing MOD:TESSAREC carrier',()=>assert.equal(C.receipt.carrier,'MOD:TESSAREC'));
test('receipt refuses physical seam closure',()=>assert.equal(C.receipt.seamCurtain.physicalClosure,false));
test('audit retains the non-physical claim boundary',()=>assert.match(audit.claimBoundary,/no shell closure.*physical swing mechanism/i));

const failures=checks.filter(check=>!check.pass);
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks:checks.length,failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',checks:checks.length,audit,route:{start:route.startAddress,end:route.endAddress,path:route.path,cycle:route.cycle}},null,2));
