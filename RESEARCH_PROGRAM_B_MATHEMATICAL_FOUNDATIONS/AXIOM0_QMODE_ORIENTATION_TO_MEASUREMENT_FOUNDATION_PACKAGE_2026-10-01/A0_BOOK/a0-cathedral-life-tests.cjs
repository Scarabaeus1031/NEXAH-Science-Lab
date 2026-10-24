const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const model=require('./a0-cathedral-life.js'),parts=require('./a0-cathedral-parts.js'),engine=require('./assets/game-of-worlds-play/cylinder-engine.js'),w={};vm.runInNewContext(fs.readFileSync(__dirname+'/assets/a0-cathedral-rc08.packed.js','utf8'),{window:w});const input=Buffer.from(w.A0CathedralPacked.RC08,'base64'),hash=x=>crypto.createHash('sha256').update(x).digest('hex'),sourceHash=hash(input),original=parts.parse(input);let checks=0;const ok=(v,m)=>{assert(v,m);checks++;};
ok(hash(fs.readFileSync(__dirname+'/assets/game-of-worlds-play/cylinder-engine.js'))===hash(fs.readFileSync(__dirname+'/../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/cylinder-engine.js')),'exact Core engine copy');
for(const pattern of model.PATTERNS){
 let s=model.start(pattern),native=engine.initial({kind:'pattern',pattern,size:16},'finite-dead');
 for(let g=0;g<=model.LIMIT;g++){ok(engine.equal(s.frames[g],native),'native LIFE equality '+pattern+' g'+g);if(g<model.LIMIT){const before=JSON.stringify(s);s=model.step(s);ok(JSON.stringify(s.frames.slice(0,-1))===JSON.stringify(JSON.parse(before).frames),'recorded history preserved');native=engine.step(native);}}
 assert.throws(()=>model.step(s));checks++;
 const stateBefore=JSON.stringify(s);
 for(const mode of model.MODES){const result=model.render(input,s,mode),{doc,tail}=parts.parse(result.bytes),record=doc.extras.a0_life,cells=doc.nodes.filter(n=>n.extras?.view_only&&n.extras?.cell);
  ok(record.generation===32&&record.frames.length===33,'all 33 frames recorded');ok(JSON.stringify(record.frames)===JSON.stringify(s.frames),'GLB preserves full states');ok(cells.length===s.frames.reduce((n,f)=>n+f.live.length,0),'all living cells across all generations displayed');
  for(const n of cells)ok(n.translation.every((v,i)=>v===model.position(...n.extras.cell,n.extras.generation,mode)[i]),'explicit cell-address mapping');
  ok(Buffer.from(tail).equals(Buffer.from(original.tail)),'source binary geometry unchanged');ok(!doc.animations,'no Cathedral animation drives LIFE');ok(record.rule==='B3/S23'&&record.boundary==='finite-dead','rule and boundary explicit');ok(doc.nodes[doc.nodes[0].children[0]].name.startsWith('ViewOnly_'),'source architecture remains separately wrapped');
 }
 ok(JSON.stringify(s)===stateBefore,'view changes do not mutate simulation');
}
let blinker=model.start('blinker');blinker=model.step(model.step(blinker));ok(engine.equal(blinker.frames[0],blinker.frames[2]),'blinker return after two generations');ok(blinker.frames.every(f=>f.live.length===3),'tower height is not population size');
ok(model.position(0,0,1,'body')[1]>model.position(0,0,0,'body')[1],'generation grows along Y');ok(hash(input)===sourceHash,'source GLB immutable');
const html=fs.readFileSync(__dirname+'/A0_RESEARCH_DESK.html','utf8');ok(!html.includes('id="cathedralLifeControls"'),'redundant Desk LIFE controls removed');ok(html.includes('A0_GAME_OF_WORLDS_PLAY.html?world=numbers&amp;view=cathedral'),'Desk routes Cathedral interaction to the game');
console.log(JSON.stringify({status:'PASS',checks,scope:'native engine equivalence through 32 generations for three patterns; all three GLB views; immutable history and source; no browser/WebGL acceptance'},null,2));
