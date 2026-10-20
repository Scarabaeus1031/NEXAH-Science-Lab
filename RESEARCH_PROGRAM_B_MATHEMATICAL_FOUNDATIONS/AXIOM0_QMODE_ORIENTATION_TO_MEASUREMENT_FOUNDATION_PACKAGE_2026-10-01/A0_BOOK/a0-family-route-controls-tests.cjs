const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/A0_FAMILY_CONNECTION_ATLAS.html','utf8');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++};
const line=part=>html.split('\n').find(l=>l.includes(part));
const groups=line('const routeGroups='),build=line('routeGroups.forEach('),render=line('function renderRoute(id)');
const routes={all:{kind:'overview',label:'Gesamtkarte'},observe:{kind:'route',label:'Beobachten',stages:['T1']},compare:{kind:'route',label:'Vergleichen',stages:['T3']},intervene:{kind:'route',label:'Eingreifen',stages:['T5']},return:{kind:'route',label:'Return',stages:['T7']},joints:{kind:'focus',label:'Fugen untersuchen'},ghost:{kind:'instrument',label:'Ghost Grid'}};
function element(){return {dataset:{},children:[],attrs:{},append(...nodes){this.children.push(...nodes)},setAttribute(k,v){this.attrs[k]=v}}}
const rail=element(),layers={open:false};const events=[];
const ctx={routes,selectedRoute:null,selectedFamily:null,selectedStage:null,document:{createElement:element,querySelectorAll:selector=>selector==='#routeRail button'?rail.children.flatMap(g=>g.children[1].children):[]},$:id=>id==='routeRail'?rail:id==='layers'?layers:element(),routeInstruments:()=>[],setOverviewMode:(mode,load)=>events.push(['mode',mode,load]),detail:()=>events.push(['detail']),draw:()=>events.push(['draw']),showLayer:()=>events.push(['layer']),renderInstrumentCards:()=>events.push(['cards']),setComparisonFrom:()=>events.push(['comparison'])};
vm.createContext(ctx);vm.runInContext(render+'\n'+groups+'\n'+build,ctx);
ok(rail.children.length===3,'one map group plus two distinct secondary groups');
const [map,focus,instrument]=rail.children;
ok(map.dataset.routeGroup==='map','map group styled explicitly');
ok(map.children[0].textContent==='Gesamtkarte & Gruppierungen','group heading');
const buttons=map.children[1].children;
assert.deepEqual(buttons.map(b=>b.dataset.route),['all','observe','compare','intervene','return']);checks++;
ok(focus.children[1].children[0].dataset.route==='joints','focus remains separate');
ok(instrument.children[1].children[0].dataset.route==='ghost','instrument remains separate');
ok(map.children[1].attrs.role==='group','semantic button group');
for(const button of buttons){events.length=0;button.onclick();ok(events[0][1]==='family','map remains visible: '+button.dataset.route);ok(button.attrs['aria-pressed']==='true','selection state: '+button.dataset.route);ok(buttons.filter(b=>b.attrs['aria-pressed']==='true').length===1,'single active route');ok(events.some(e=>e[0]==='draw'),'existing highlighting redrawn');}
events.length=0;focus.children[1].children[0].onclick();ok(events[0][1]==='joint','focus retains existing joint view');
events.length=0;instrument.children[1].children[0].onclick();ok(events[0][1]==='joint','Ghost retains existing joint view');
ok(html.includes('data-overview="sequence"'),'separate time view still available');
ok(html.includes('.route-group[data-route-group=map]{grid-column:1/-1;'),'map controls span desktop rail');
ok(html.includes('@media(max-width:780px){.route-group[data-route-group=map]{grid-template-columns:1fr}'),'mobile control wrapping');
console.log(JSON.stringify({status:'PASS',checks,scope:'actual control builder and route handler in simulated DOM; not pixel QA'},null,2));
