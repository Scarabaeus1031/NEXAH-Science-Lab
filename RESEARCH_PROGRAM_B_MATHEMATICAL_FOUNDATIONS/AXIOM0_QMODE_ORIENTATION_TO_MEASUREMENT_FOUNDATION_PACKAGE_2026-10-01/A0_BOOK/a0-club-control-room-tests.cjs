const assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('./a0-club-control-room.js'),model=require('./a0-game-of-numbers-model.js');
const sequence=require('./a0-club-carrier-sequence.js').createSequence(model);
let checks=0;function ok(v){assert.ok(v);checks++;}function eq(a,b){assert.deepEqual(a,b);checks++;}
const projection=api.createProjection(),report=()=>({sequence:sequence.snapshot(),carrier:{exact:true}});
let s=projection.observe(report());eq(s.current.n,11537);eq(s.previous,null);
sequence.step();s=projection.observe(report());eq(s.current.n,11573);eq(s.previous.n,11537);eq(s.history.length,1);
s=projection.observe(report());eq(s.history.length,1);
sequence.step();s=projection.observe(report());eq(s.current.n,11357);eq(s.previous.n,11573);
sequence.reset();s=projection.observe(report());eq(s.previous,null);eq(s.history,[]);
sequence.mode('elevator');
for(let k=0;k<=16;k++){
 s=projection.observe(report());eq(s.family.length,9);
 for(const c of s.family){eq(c.n,c.seed+20*k);eq(c.n,20*c.q+c.r);const p=api.position(c);ok(p.y>=34&&p.y<=484);ok(p.x>=28&&p.x<=885);}
 if(k<16)sequence.step();
}
sequence.seed(14357);s=projection.observe(report());eq(s.current.n,14677);eq(s.previous,null);
sequence.loop(true);sequence.step();s=projection.observe(report());eq(s.current.n,14357);eq(s.history,[]);
ok(api.svg(s).includes('14357'));ok(api.svg(s).includes('role="img"'));
eq(api.point({decimal:'<script>',q:0,r:0}),null);eq(api.point({decimal:'11537',q:576,r:18}),null);
eq(projection.observe({sequence:{}}),null);
// Mount consumes one existing snapshot and publishes updates without another timer.
function el(){return{children:[],attrs:{},events:{},append(b){this.children.push(b)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}}}
const nodes={controlElevatorGrid:el(),controlElevatorStatus:el(),controlCarrierList:el()},selected=[];
const doc={getElementById:id=>nodes[id],createElement:()=>el()};
const win={A0ClubCRTLink:{snapshot:report,selectSeed:n=>selected.push(n)}};
const room=api.mount(doc,win);eq(nodes.controlCarrierList.children.length,9);
nodes.controlCarrierList.children[2].events.click();eq(selected,[11537]);
const copy=room.snapshot();copy.current.n=0;ok(room.snapshot().current.n!==0);
sequence.mode('carrier');room.observe(report());ok(nodes.controlCarrierList.children.every(b=>b.disabled));
ok(!/setInterval|setTimeout|requestAnimationFrame|localStorage|fetch\(/.test(fs.readFileSync(__dirname+'/a0-club-control-room.js','utf8')));
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
for(const needle of ['id="control-room"','data-jukebox-room="control"','data-club-hero-title="control"','../a0-club-control-room.js','../a0-club-control-room.css'])ok(html.includes(needle));
ok(fs.readFileSync(__dirname+'/a0-club-crt-link.js','utf8').includes('win.A0ClubControlRoom?.observe(report)'));
console.log(JSON.stringify({status:'PASS',checks,scope:'native nine-seed grid, all 17 lifts, route, trace, reset, loop, seed, receipt validation, read-only snapshot, shared source updates; browser pixels OPEN'}));
