const assert=require('node:assert/strict'),{createPlayer,createShow}=require('./a0-family-club-tours.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
function harness(){
 let s={family:'F1',stop:'zeta'},busy=false,active=true,nextId=0;const timers=new Map(),calls=[];
 const clock={setTimeout(fn){timers.set(++nextId,fn);return nextId;},clearTimeout(id){timers.delete(id);}};
 const reader={snapshot:()=>({...s}),motion:()=>busy?{}:null,journey:()=>null,selectFamily(id){calls.push(id);s.family=id;return true;},travel(stop){calls.push(stop);s.stop=stop;return true;}};
 const updates=[],player=createPlayer(reader,clock,x=>updates.push(x),()=>active);
 return{player,timers,calls,updates,reader,tick(){const [id,fn]=timers.entries().next().value||[];if(fn){timers.delete(id);fn();}},busy:x=>busy=x,active:x=>active=x,set:x=>Object.assign(s,x)};
}
const f=harness();eq(f.player.snapshot().mode,'family');ok(f.player.play());eq(f.timers.size,1);
for(let i=2;i<=7;i++){f.tick();eq(f.reader.snapshot().family,'F'+i);eq(f.reader.snapshot().stop,'zeta');}
f.tick();ok(!f.player.snapshot().running);eq(f.player.snapshot().reason,'Tour beendet');eq(f.timers.size,0);
ok(f.player.play());eq(f.reader.snapshot().family,'F1');f.player.pause();eq(f.timers.size,0);
ok(f.player.step());eq(f.reader.snapshot().family,'F2');ok(!f.player.snapshot().running);
f.player.choose('elevator');eq(f.player.snapshot().length,3);ok(f.player.play());f.tick();eq(f.reader.snapshot().stop,'theta');eq(f.reader.snapshot().family,'F2');f.tick();eq(f.reader.snapshot().stop,'beta');f.tick();ok(!f.player.snapshot().running);
ok(!f.player.choose('invented'));eq(f.player.snapshot().mode,'elevator');
const wait=harness();wait.player.play();wait.busy(true);wait.tick();eq(wait.calls.length,0);eq(wait.timers.size,1);wait.busy(false);wait.tick();eq(wait.calls,['F2']);
wait.active(false);wait.tick();ok(!wait.player.snapshot().running);eq(wait.timers.size,0);ok(!wait.player.play());
const manual=harness();manual.player.play();manual.set({family:'F5'});manual.player.selectionChanged();ok(!manual.player.snapshot().running);eq(manual.timers.size,0);
const stale=harness();stale.player.play();const fn=[...stale.timers.values()][0];stale.player.pause();fn();eq(stale.calls.length,0);eq(stale.timers.size,0);
const end=harness();end.set({family:'F7'});ok(!end.player.step());eq(end.reader.snapshot().family,'F7');ok(end.player.play());eq(end.reader.snapshot().family,'F1');
// Expected asynchronous elevator arrival does not count as an external/manual selection.
const arrival=harness();let pending=null;
arrival.reader.travel=stop=>{pending=stop;return true;};arrival.player.choose('elevator');arrival.player.play();arrival.tick();
eq(pending,'theta');arrival.set({stop:pending});arrival.player.selectionChanged();ok(arrival.player.snapshot().running);
arrival.player.pause();eq(arrival.timers.size,0);
// Roundtrip visits all 21 coordinates and returns to its actual starting coordinate.
const round=harness();round.set({family:'F3',stop:'theta'});round.player.choose('roundtrip');ok(round.player.play());
const start=round.reader.snapshot(),visited=[start];
for(let i=0;i<21;i++){round.tick();visited.push(round.reader.snapshot());}
eq(new Set(visited.slice(0,21).map(s=>s.family+'@'+s.stop)).size,21);
for(const stop of ['zeta','theta','beta'])eq(new Set(visited.slice(0,21).filter(s=>s.stop===stop).map(s=>s.family)).size,7);
eq(round.reader.snapshot(),start);ok(round.player.snapshot().roundReturned);round.tick();ok(!round.player.snapshot().running);eq(round.timers.size,0);
const resumeRound=harness();resumeRound.player.choose('roundtrip');resumeRound.player.play();resumeRound.tick();resumeRound.player.pause();resumeRound.player.play();resumeRound.tick();eq(resumeRound.reader.snapshot().family,'F3');
resumeRound.player.interrupt();eq(resumeRound.player.snapshot().index,0);resumeRound.player.play();resumeRound.tick();eq(resumeRound.reader.snapshot().family,'F4');
// Real mounted UI: source buttons, status and manual-input lifecycle are wired together.
class El{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.parent=null;this.hidden=false;this.className='';}
 append(...nodes){for(const n of nodes){if(n.parent)n.parent.children=n.parent.children.filter(x=>x!==n);n.parent=this;this.children.push(n);}}
 before(n){const p=this.parent;p.children.splice(p.children.indexOf(this),0,n);n.parent=p;}
 contains(n){for(;n;n=n.parent)if(n===this)return true;return false;}
 setAttribute(k,v){this.attrs[k]=v;}
 getAttribute(k){return this.attrs[k];}
}
const ui=harness(),room=new El(),board=new El(),pickup=new El(),top=new El(),viewport=new El(),viewControl=new El(),formGroup=new El(),grid=new El('button'),events={},winEvents={};room.append(top,viewport,viewControl,formGroup,board);board.append(pickup);viewControl.setAttribute('data-club-control','view');viewControl.append(grid);formGroup.setAttribute('data-club-control','room');
let formClicks=0;for(let i=0;i<3;i++){const b=new El('button');b.onclick=()=>formClicks++;formGroup.append(b);}
let gridClicks=0;grid.onclick=()=>gridClicks++;
const exhibitGroup=new El();exhibitGroup.setAttribute('data-club-control','exhibit');board.append(exhibitGroup);
const lightGroup=new El();lightGroup.setAttribute('data-club-control','light');viewControl.append(lightGroup);
let lightClicks=0;const lightButton=new El('button');lightButton.onclick=()=>lightClicks++;lightGroup.append(lightButton);
let exhibitClicks=0;const exhibitButton=new El('button');exhibitButton.onclick=()=>exhibitClicks++;exhibitGroup.append(exhibitButton);
const elevatorGroup=new El();elevatorGroup.setAttribute('data-club-control','elevator');room.append(elevatorGroup);
room.querySelector=s=>s==='.club-cockpit'?board:s==='.club-pickup-console'?pickup:s==='.club-experience-bar'?top:s==='.spatial-viewport'?viewport:s==='[data-club-grid]'?grid:s==='[data-club-control="room"]'?formGroup:s==='[data-club-control="exhibit"]'?exhibitGroup:s==='[data-club-control="light"]'?lightGroup:s==='[data-club-control="view"]'?viewControl:s==='[data-club-control="elevator"]'?elevatorGroup:null;
let triangle=true;ui.reader.triangle=()=>triangle;ui.reader.setTriangle=on=>triangle=on;
const doc={hidden:false,getElementById:()=>room,createElement:tag=>new El(tag),addEventListener:(k,f)=>events[k]=f};
const win={A0FamilySpatialReader:ui.reader,setTimeout:(fn)=>{ui.timers.set(123,fn);return 123;},clearTimeout:id=>ui.timers.delete(id),addEventListener:(k,f)=>winEvents[k]=f};
const mounted=require('./a0-family-club-tours.js').mount(doc,win),bar=top.children[0],transport=bar.children[0],layouts=bar.children[1],exhibits=bar.children[2],settings=bar.children[3],status=bar.children[4];
eq(lightGroup.parent,settings);lightButton.onclick();eq(lightClicks,1);
eq(viewControl.parent,settings);eq(elevatorGroup.parent,room);ok(!settings.contains(elevatorGroup));
eq(exhibitGroup.parent,exhibits);eq(exhibits.className,'club-primary-exhibits');exhibitButton.onclick();eq(exhibitClicks,1);
eq(board.children[0],pickup);eq(bar.parent,top);eq(transport.children[0].textContent,'▶ Club-Tour');
eq(bar.className,'club-tour-player');eq(transport.children.length,1);eq(formGroup.parent,layouts);eq(formGroup.children.length,3);ok(status.textContent.includes('Runde'));eq(mounted.snapshot().mode,'roundtrip');ok(!triangle);ok(!mounted.choose);ok(!mounted.step);
formGroup.children[0].onclick();eq(formClicks,1);
eq(grid.parent,exhibits);eq(exhibits.children[0],exhibitGroup);eq(exhibits.children[1],grid);grid.onclick();eq(gridClicks,1);eq(viewport.children[0].className,'club-now-playing');ok(viewport.children[0].children[0].textContent.includes('F1'));
transport.children[0].onclick();ok(mounted.snapshot().running);eq(room.attrs['data-tour-running'],'true');eq(transport.children[0].attrs['aria-pressed'],'true');
events.pointerdown({target:viewControl});ok(mounted.snapshot().running);events.click({target:grid});ok(mounted.snapshot().running);
events.pointerdown({target:pickup});ok(!mounted.snapshot().running);eq(room.attrs['data-tour-running'],'false');
mounted.play();ui.tick();eq(ui.reader.snapshot().family,'F2');ok(status.textContent.includes('F2'));eq(mounted.snapshot().mode,'roundtrip');
mounted.play();doc.hidden=true;events.visibilitychange();ok(!mounted.snapshot().running);
doc.hidden=false;mounted.play();winEvents.hashchange();ok(!mounted.snapshot().running);
mounted.play();winEvents.pagehide();ok(!mounted.snapshot().running);
// Show cues run once at settled stations, preserve coordinates and sequence view after layout arrival.
const showState={family:'F1',stop:'zeta',layout:'polar',exhibit:'dodeca',camera:{yaw:.8,pitch:.38}},showCalls=[];let showBusy=false,held=false,showMode='room',calm=false,show;
const showReader={snapshot:()=>({...showState}),motion:()=>showBusy?{}:null,journey:()=>null,guide:()=>({held}),setGuideHeld(v){held=v;showCalls.push('grid:'+v);},setExhibit(v){showState.exhibit=v;showCalls.push(v);},changeLayout(v){showState.layout=v;showBusy=true;showCalls.push(v);}};
const showStage={snapshot:()=>({mode:showMode}),setMode(v){showMode=v;showCalls.push(v);show.update({running:true});}};
const views=[];show=createShow(showReader,showStage,v=>views.push(v),()=>calm);
show.update({running:false});eq(showCalls,[]);show.update({running:true});eq(showState.family,'F1');eq(showState.stop,'zeta');eq(showState.layout,'cylinder');eq(showState.exhibit,'none');ok(held);eq(views,[]);
const beforeBusy=showCalls.length;show.update({running:true});eq(showCalls.length,beforeBusy);showBusy=false;show.update({running:true});eq(views,['front']);show.update({running:true});eq(views,['front']);
showState.family='F2';show.update({running:true});eq(showState.exhibit,'bluebody');eq(showState.stop,'zeta');
showState.family='F3';show.update({running:true});eq(showMode,'room');ok(!held);eq(views.at(-1),'overview');
showState.family='F4';show.update({running:true});eq(showState.exhibit,'dodeca');showState.family='F5';show.update({running:true});eq(showMode,'dance');ok(held);eq(views.at(-1),'back');
const heldRoom=showState.layout,heldBody=showState.exhibit;showStage.setMode=v=>{showMode=v;};show.update({running:false});eq(showMode,'room');eq(showState.layout,heldRoom);eq(showState.exhibit,heldBody);
calm=true;const beforeCalm=views.length;show.update({running:true});eq(showMode,'room');eq(views.length,beforeCalm);
showState.stop='theta';show.update({running:true});eq(showState.layout,'polar');showBusy=false;show.update({running:true});eq(views.length,beforeCalm);
showState.stop='beta';show.update({running:true});eq(showState.layout,'plate');eq(showState.family,'F5');
console.log(JSON.stringify({status:'PASS',checks,scope:'finite local tours; settled-station decorative show cues; source coordinates retained; layout arrival before camera cue; reentrancy, reduced motion and pause; browser pixels OPEN'}));
