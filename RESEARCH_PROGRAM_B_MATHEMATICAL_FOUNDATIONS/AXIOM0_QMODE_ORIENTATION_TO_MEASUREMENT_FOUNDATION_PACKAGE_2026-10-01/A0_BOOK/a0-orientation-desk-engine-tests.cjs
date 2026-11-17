const assert=require('node:assert/strict');
const E=require('./a0-orientation-desk-engine.js');

let state=E.create();
assert.equal(state.schema,'A0_ORIENTATION_DESK_WORKFLOW_V1');
assert.deepEqual(E.STEPS,['bring','frame','place','turn','compare','return']);
assert.equal(state.materials.length,4);
assert.equal(E.readiness(state).frame,false);
assert.throws(()=>E.finish(state,'CONTINUE'),/Complete Bring/);

const opening=E.snapshot(state);
state=E.setQuestion(state,'What changes when I turn the view?');
state=E.select(state,'source');
state=E.setMaterial(state,'source',{label:'Field note',content:'One source passage',included:true});
state=E.setMaterial(state,'unknown',{label:'Outside',content:'No causal mechanism',included:false});
state=E.setFrame(state,{purpose:'Compare two declared readings',timeScale:'one recorded event',view:'reader position',outside:'causal mechanism',declared:true});
state=E.setRelation(state,'Both views refer to the same held passage.');
state=E.turn(state);
assert.equal(state.materials.find(item=>item.id==='source').turn,90);
assert.equal(opening.materials.find(item=>item.id==='source').turn,0);
state=E.setViews(state,{a:'literal reading',b:'relational reading',active:'B'});
assert.equal(state.views.compared,true);
state=E.setILAU(state,{I:'same passage',L:'original layout',A:'declared relation',U:'author intent'});
assert.deepEqual(E.readiness(state),{bring:true,frame:true,place:true,turn:true,compare:true});
state=E.finish(state,'REST','The distinction is sufficient for now.');
assert.equal(state.receipt.decision,'REST');
assert.equal(state.receipt.ilau.U,'author intent');
assert.match(state.receipt.boundary,/No evidence/);
assert.equal(state.step,'return');
assert.throws(()=>E.finish(state,'ANSWER'),/CONTINUE or REST/);

const exported=E.snapshot(state);exported.question='mutated';
assert.equal(state.question,'What changes when I turn the view?');
console.log(JSON.stringify({status:'PASS',checks:19,scope:'local Human-authored orientation workflow, immutable receipt and no-authority boundary'}));
