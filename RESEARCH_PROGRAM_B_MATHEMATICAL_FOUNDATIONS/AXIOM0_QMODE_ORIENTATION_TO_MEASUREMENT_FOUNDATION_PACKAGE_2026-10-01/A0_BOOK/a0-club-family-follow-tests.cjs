const assert=require('node:assert/strict'),{createFollower,mount}=require('./a0-club-family-follow.js'),{createPlayer}=require('./a0-family-club-tours.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
function fixture(){
 let s={family:'F1',stop:'zeta'},busy=false,active=true,playing=false,control;
 const timers=new Map(),reader={snapshot:()=>({...s}),motion:()=>busy?{}:null,journey:()=>null,selectFamily:f=>{s.family=f;return true},travel:p=>{s.stop=p;return true}};
 const player=createPlayer(reader,{setTimeout:f=>{timers.set(1,f);return 1},clearTimeout:id=>timers.delete(id)},()=>control?.pump(),()=>active,'roundtrip');
 control=createFollower({busy:()=>busy,active:()=>active,playing:v=>playing=v,step:()=>{if(player.snapshot().roundReturned)player.choose('roundtrip');return player.step();}});
 return{control,reader,timers,player,busy:v=>busy=v,active:v=>active=v,playing:()=>playing};
}
const f=fixture();f.control.observe({q4Address:0},true);eq(f.reader.snapshot().family,'F1');eq(f.playing(),true);
const visited=[f.reader.snapshot()];
for(let i=1;i<=21;i++){f.control.observe({q4Address:i%16},true);visited.push(f.reader.snapshot());eq(f.timers.size,0);}
eq(new Set(visited.slice(0,21).map(x=>x.family+'@'+x.stop)).size,21);
eq(f.reader.snapshot(),{family:'F1',stop:'zeta'});
f.control.observe({q4Address:6},true);eq(f.reader.snapshot(),{family:'F2',stop:'zeta'});
const count=f.control.snapshot().steps;f.control.observe({q4Address:6,layer:2},true);eq(f.control.snapshot().steps,count);
f.busy(true);f.control.observe({q4Address:7},true);f.control.observe({q4Address:8},true);eq(f.reader.snapshot().family,'F2');ok(f.control.snapshot().queued);
f.busy(false);f.control.pump();eq(f.reader.snapshot().family,'F3');eq(f.control.snapshot().queued,false);eq(f.timers.size,0);
f.control.follow(false);f.control.observe({q4Address:9},true);eq(f.reader.snapshot().family,'F3');eq(f.playing(),false);
f.control.follow(true);f.active(false);f.control.observe({q4Address:10},true);eq(f.reader.snapshot().family,'F3');
f.active(true);f.control.pump();eq(f.reader.snapshot().family,'F4');
f.control.observe({q4Address:11},false);eq(f.reader.snapshot().family,'F4');eq(f.playing(),false);
f.control.suspend();eq(f.control.snapshot().running,false);eq(f.control.snapshot().queued,false);eq(f.control.snapshot().last,null);
f.control.observe({q4Address:99},true);eq(f.control.snapshot().last,null);eq(f.control.snapshot().q4FamilyMapping,false);
// Mounted controls call the original source transport, not a new tour timer.
const nodes={clubFamilyFollow:{attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}},clubFamilyFollowStatus:{},familySpatialMount:{hidden:false}};
const events={},requests=[];let opened=0;
const w={A0FamilySpatialReader:f.reader,A0ClubTours:{externalStep:()=>f.player.step(),externalPlaying:()=>{}},
 A0ClubReturnMonitor:{setPlaying:value=>{requests.push(value);return true}},requestAnimationFrame:fn=>fn(),
 A0LDVRoomRoute:{show:()=>opened++}};
const ui=mount({getElementById:id=>nodes[id],addEventListener:(k,fn)=>events[k]=fn},w);
ui.observe({q4Address:0},true);ui.transport();eq(requests.at(-1),false);
ui.manual();ok(!ui.snapshot().enabled);ok(nodes.clubFamilyFollowStatus.textContent.includes('Manueller'));
nodes.clubFamilyFollow.events.click();ok(ui.snapshot().enabled);
w.A0ClubReturnMonitor.setPlaying=()=>false;ui.transport();eq(opened,1);
console.log(JSON.stringify({status:'PASS',checks,scope:'source-driven existing 21-stop tour, no timers or Q4-to-F map, roundtrip/repeat, busy coalescing, reentrancy, manual release, mounted transport, hidden/paused guards; browser pixels OPEN'}));
