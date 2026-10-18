'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),M=require('./a0-projection-overlay.js'),W=require('./a0-root7-wing-sequence.js'),F=require('./a0-fold-lag-lens.js');
let checks=0;const ok=(v,s)=>{checks++;assert.ok(v,s);},eq=(a,b)=>{checks++;assert.deepEqual(a,b);},near=(a,b)=>ok(Math.abs(a-b)<1e-9);
const binding=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-projection-overlay-v1.json','utf8')),crypto=require('node:crypto'),path=require('node:path');
for(const f of [...binding.implementationFiles,...binding.visualReferences])eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,f.path))).digest('hex'),f.sha256);
for(const value of Object.values(binding.authority))eq(value,false);
for(const scheme of ['redblue','spectrum'])for(let i=0;i<14;i++)for(const amount of [0,.25,.5,.75,1]){const c=M.color(i,scheme,amount);ok(/^#[0-9a-f]{6}$/.test(c));if(amount===0)ok(c.slice(1,3)===c.slice(3,5)&&c.slice(3,5)===c.slice(5,7),'neutral at grey end');}
for(const args of [[-1,'redblue',1],[0,'RGB',1],[0,'redblue',NaN],[0,'redblue',1.1]]){assert.throws(()=>M.color(...args));checks++;}
for(const crease of ['spine','horizontal'])for(const branch of ['front','back'])for(const angle of [0,45,90,180])for(const turn of [0,45,90,180,360]){
 const r=W.snapshot(4,'manual',angle,{crease,branch,turn,tilt:24,cutAngle:15,cutOffset:.1}),before=JSON.stringify(r),f=M.frame('book',r);
 eq(f.facets.map(f=>f.points),r.facets.map(f=>f.points));eq(f.cuts,r.cuts);
 f.facets.forEach((facet,i)=>facet.shadow.forEach((p,j)=>{const q=W.pose([r.facets[i].model[j][0],r.facets[i].model[j][1],0],turn,24);p.forEach((x,k)=>near(x,q[k]));}));
 eq(JSON.stringify(r),before);
 const state={current:f,frames:[f],dropped:0,error:null};
 for(const scheme of ['redblue','spectrum'])for(const amount of [0,1]){const svg=M.drawing(state,{scheme,amount});ok(!/NaN|Infinity|undefined/.test(svg),'finite overlay');eq(M.drawing(JSON.parse(JSON.stringify(state)),{scheme,amount}),svg);}
}
for(let z=0;z<29;z++){const r=F.snapshot(z,{lag:3}),f=M.frame('5b',r);eq(f.facets.map(f=>f.shadow),r.facets.map(f=>f.shadow));eq(f.cuts,[]);}
const store=M.createStore(),seed=W.snapshot(0,'sequence',180,{});store.accept('book',seed);store.accept('book',seed);eq(store.read('book').frames.length,1);
const input=W.snapshot(1,'sequence',180,{});store.accept('book',input);input.facets[0].points[0][0]=999;ok(store.read('book').current.facets[0].points[0][0]!==999,'immutable source snapshot');
const read=store.read('book');read.frames.length=0;eq(store.read('book').frames.length,2);
for(let i=0;i<80;i++)store.accept('book',W.snapshot(i%16,'sequence',180,{}));
eq(store.read('book').frames.length,64);eq(store.read('book').dropped,18);eq(store.read('5b').frames.length,0,'separate source histories');
store.accept('5b',F.snapshot(0));const old=store.read('book').frames.length;store.accept('book',W.snapshot(0,'manual',53,{}),false);eq(store.read('book').frames.length,old);near(store.read('book').current.options.angle,53);
store.clear('book');eq(store.read('book').frames,[]);eq(store.read('book').dropped,0);ok(store.read('book').current);eq(store.read('5b').frames.length,1);
for(const [s,r]of [['bad',seed],['book',null],['book',{facets:[1,2,3,4]}]]){assert.throws(()=>M.frame(s,r));checks++;}
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),els=new Map(),ids=['Source','Palette','Grey','Current','Shadow','Echo','Cuts','Record','Clear','Export','Svg','Status'];
ids.forEach(k=>{const id='projectionOverlay'+k;ok(html.includes('id="'+id+'"'));els.set(id,{value:({Source:'book',Palette:'redblue',Grey:'1'})[k],checked:true,events:{},addEventListener(k,fn){this.events[k]=fn;}});});
let exported=null,revoked=false;const doc={getElementById:id=>els.get(id),createElement:()=>({click(){ok(this.download==='a0-projection-overlay.json');}})},browser={A0WingSequence:W,URL:{createObjectURL(blob){exported=blob.parts[0];return'blob:test';},revokeObjectURL(){revoked=true;}},Blob:class{constructor(parts){this.parts=parts;}}};
vm.createContext(browser);vm.runInContext(fs.readFileSync(__dirname+'/a0-projection-overlay.js','utf8'),browser);
const view=browser.A0ProjectionOverlay.mount(doc);ok(els.get('projectionOverlaySvg').innerHTML.includes('WAITING'));
view.accept('book',seed);view.accept('5b',F.snapshot(7));eq(view.store.read('book').frames.length,1);eq(view.store.read('5b').frames.length,1);
view.accept('book',null);ok(els.get('projectionOverlaySvg').innerHTML.includes('HOLD'));ok(!els.get('projectionOverlaySvg').innerHTML.includes('<polygon'),'invalid source is not stale live pose');
view.accept('book',seed);ok(!els.get('projectionOverlaySvg').innerHTML.includes('HOLD'));
els.get('projectionOverlaySource').value='5b';els.get('projectionOverlaySource').events.input();ok(els.get('projectionOverlayStatus').textContent.includes('5B'));
els.get('projectionOverlayGrey').value='0';els.get('projectionOverlayGrey').events.input();ok(els.get('projectionOverlayStatus').textContent.includes('0%'));
for(const [k,layer]of [['Current','current'],['Shadow','shadow'],['Echo','echo'],['Cuts','cut']]){els.get('projectionOverlay'+k).checked=false;els.get('projectionOverlay'+k).events.input();ok(!els.get('projectionOverlaySvg').innerHTML.includes('data-overlay="'+layer+'"'));}
els.get('projectionOverlayExport').events.click();const result=JSON.parse(exported);eq(result.source,'5b');eq(result.settings.amount,0);ok(revoked&&!result.boundaries.sourceMutation&&!result.boundaries.mixedSources);eq(M.drawing(result,result.settings),els.get('projectionOverlaySvg').innerHTML);
els.get('projectionOverlayClear').events.click();eq(view.store.read('5b').frames.length,0);eq(view.store.read('book').frames.length,1);
// Actual 5B renderer hook drives overlay on each view-player frame, without an overlay timer.
const fake=new Map();for(const match of html.matchAll(/id="(foldLag[^"]+)"/g)){fake.set(match[1],{value:({foldLagMode:'target',foldLagDelay:'3',foldLagMirror:'none',foldLagSlice:'0'})[match[1]],checked:false,events:{},addEventListener(k,f){this.events[k]=f;},setAttribute(){}});}
let tick=null;const player=F.mount({getElementById:id=>fake.get(id)},{setInterval(fn){tick=fn;return 1;},clearInterval(){tick=null;}});
player.onRender=r=>view.accept('5b',r);player.render();fake.get('foldLagPlay').events.click();for(let i=0;i<28;i++)tick();ok(tick===null);eq(view.store.read('5b').current.step,28);eq(view.store.read('5b').frames.length,29);
ok(html.includes("window.A0OverlayView.accept('book',window.A0Root7CoupledRecord?.bookView?.wingSequence)"));ok(html.includes("window.A0FoldLagView.onRender=record=>window.A0OverlayView.accept('5b',record)"));
ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage/.test(fs.readFileSync(__dirname+'/a0-projection-overlay.js','utf8')),'passive local overlay');
console.log(JSON.stringify({status:'PASS',checks,historyLimit:64,sourceStreams:3,browserAcceptance:false,scientificClaimPromotion:false}));
