const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),api=require('./a0-cathedral-world-projection.js'),parts=require('./a0-cathedral-parts.js'),life=require('./assets/game-of-worlds-play/cylinder-engine.js'),P=require('./assets/game-of-worlds-play/crystal-projection.js'),numbers=require('./a0-game-of-numbers-model.js');
let checks=0;const ok=(v,m)=>{assert(v,m);checks++;},w={};vm.runInNewContext(fs.readFileSync(__dirname+'/assets/a0-cathedral-rc08.packed.js','utf8'),{window:w});const bytes=Buffer.from(w.A0CathedralPacked.RC08,'base64'),before=crypto.createHash('sha256').update(bytes).digest('hex'),tail=parts.parse(bytes).tail;
for(const [pattern,size] of [['acorn',56],['rPentomino',48],['glider',32],['blinker',32]])for(const boundary of ['finite-dead','cylinder-x','cylinder-y']){
 const spec={id:pattern,kind:'pattern',pattern,size,horizon:70},run=life.run(spec,boundary),finite=life.run(spec,'finite-dead');
 for(const g of [0,1,24,70]){const snapshot=P.buildSnapshot(run,finite,g,{historyWindow:60}),frozen=JSON.stringify(snapshot),view=api.life(snapshot);
  ok(view.generation===g&&view.rule==='B3/S23'&&view.boundary===boundary,'source clock/rule/boundary retained');
  for(const f of view.frames){const cells=f.points.map(p=>p.address).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);ok(JSON.stringify(cells)===JSON.stringify(run.states[f.generation].live),'history reconstructed exactly '+pattern+' '+boundary+' '+f.generation);}
  if(g===24)for(const mode of ['body','scaffold','exploded']){const result=api.render(bytes,view,mode),parsed=parts.parse(result.bytes);ok(parsed.doc.extras.a0_world_projection.generation===g,'GLB current generation exact');ok(Buffer.from(parsed.tail).equals(Buffer.from(tail)),'original binary chunks preserved');ok(result.last===24&&result.first>=0,'visible window explicit');}
  ok(JSON.stringify(snapshot)===frozen,'source snapshot immutable');
 }
}
for(const rule of numbers.RULES){let session=numbers.start(rule);for(let i=0;i<Math.min(40,numbers.limit(rule));i++)session=numbers.step(session);const frozen=JSON.stringify(session),view=api.numbers(session),result=api.render(bytes,view),d=parts.parse(result.bytes).doc.extras.a0_world_projection;
 ok(view.kind==='NUMBER_NATIVE_STATE_VIEW_NOT_LIFE','Numbers not reclassified as LIFE');ok(d.rule===rule&&d.generation===session.cursor,'native number rule/cursor retained');ok(JSON.stringify(d.frames.at(-1).state)===JSON.stringify(session.frames[session.cursor].state),'exact number state retained despite lossy positions');ok(JSON.stringify(session)===frozen,'number session immutable');ok(d.semantics.includes('mod 97'),'numeric residue mapping explicit');
}
ok(crypto.createHash('sha256').update(bytes).digest('hex')===before,'original GLB unchanged');
const html=fs.readFileSync(__dirname+'/A0_GAME_OF_WORLDS_PLAY.html','utf8');ok((html.match(/data-view="cathedral"/g)||[]).length===2,'cathedral in LIFE and Numbers');ok(!html.includes('Buch · Leo / J–L / G–H'),'ambiguous view-row book link removed');ok(html.includes('class="play-reading"'),'reading separate from view buttons');
console.log(JSON.stringify({status:'PASS',checks,scope:'native snapshots through g70, three boundaries and source sizes; all Numbers rules; no state mutations; GLB and link contracts; no browser/WebGL acceptance'},null,2));
