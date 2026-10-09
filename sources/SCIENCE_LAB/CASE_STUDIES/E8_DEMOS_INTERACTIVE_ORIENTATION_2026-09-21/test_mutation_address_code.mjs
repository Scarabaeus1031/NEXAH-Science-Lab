import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const code=require('./mutation_address_code.js');

assert.deepEqual(code.directedAddress(5,7),{
  from:5,to:7,word:'57',value:107,antipodeWord:'75',antipodeValue:145
});
assert.deepEqual(code.carrier(42),{decimal:42,vigesimal:'22',senary:'110'});
assert.deepEqual(code.carrier(1032),{decimal:1032,vigesimal:'2BC',senary:'4440'});
assert.deepEqual(code.gate(42).mod9,[5,6,7]);
assert.deepEqual(code.gate(1032).mod9,[5,6,7]);

const states=[];
for(const trit of [-1,0,1])for(const direction of [0,1])states.push(code.sixState(trit,direction));
assert.deepEqual(states.map(state=>state.code),[0,1,2,3,4,5]);
for(const state of states){
  const antipode=code.sixState(state.antipodeTrit,state.antipodeDirection);
  assert.equal(antipode.code,state.antipodeCode);
  assert.equal(state.code+state.antipodeCode,5);
  assert.equal(code.sixState(antipode.antipodeTrit,antipode.antipodeDirection).code,state.code);
}
const handles=code.numberHandles();
assert.deepEqual(handles.carry,{from:43,to:1032,quotient:24,localMod9:[5,6,7],liftedMod9:[5,6,7]});
assert.deepEqual(handles.reversal,{left:1078,right:8701,exact:true,common:77,leftQuotient:14,rightQuotient:113});
assert.deepEqual(handles.page.indices,[21,22,23,24,25,26]);
assert.deepEqual(handles.anchor,{value:3301,index:464,twin:3299,selector:false});
for(let depth=0;depth<=11;depth++){
  const layer=code.pyramidLayer(depth);
  assert.equal(layer.length,(depth+1)*(depth+2)/2);
  assert.equal(layer.reduce((sum,node)=>sum+node.multiplicity,0),3**depth);
}
assert.deepEqual(code.pyramidAntipode(code.pyramidAntipode([3,2,1,1])),[3,2,1,1]);
console.log('mutation address code: all checks PASS');
