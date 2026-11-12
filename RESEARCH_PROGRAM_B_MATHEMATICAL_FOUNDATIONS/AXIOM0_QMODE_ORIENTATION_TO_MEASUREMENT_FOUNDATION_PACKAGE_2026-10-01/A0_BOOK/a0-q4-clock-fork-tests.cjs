const assert=require('node:assert/strict');
const c=require('./a0-q4-clock-fork.js');
assert.deepEqual(c.projection(0),{g:0,phase8:0,quarter:0,angle:0,side:'A',arity:2,depth:3,branch:'000',branchIndex:0,branchSpan:8,returnPeriod:8});
assert.equal(c.projection(4).side,'A′');assert.equal(c.projection(7).angle,270);assert.equal(c.projection(8).phase8,0);
assert.equal(c.encodeBranch(5,2,3),'101');assert.equal(c.encodeBranch(26,3,3),'222');
assert.deepEqual(c.forkCounts(2),{leaves:8,nodes:15});assert.deepEqual(c.forkCounts(3),{leaves:27,nodes:40});
assert.equal(c.projection(0,3).returnPeriod,216);assert.equal(c.swapFamily(4774).apply('4774'),'7447');
assert.deepEqual(c.audit(),{clockReturn:true,quarterReturn:true,binaryReturn:true,ternaryReturn:true,binaryCounts:{leaves:8,nodes:15},ternaryCounts:{leaves:27,nodes:40},blockSwap:true});
console.log('a0-q4-clock-fork: 16/16 PASS');
