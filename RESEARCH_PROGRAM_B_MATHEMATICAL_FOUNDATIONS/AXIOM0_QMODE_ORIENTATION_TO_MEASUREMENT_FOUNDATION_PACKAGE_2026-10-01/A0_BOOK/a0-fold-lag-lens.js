(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-root7-wing-sequence.js'):root.A0WingSequence);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0FoldLagLens=api;})(typeof globalThis!=='undefined'?globalThis:this,function(W){
'use strict';
const VERSION='1.1.0',ANGLES=[0,90,45,33,7],BASE=[[0,0,0],[.5,.12,0],[1.55,.45,0],[1.05,.95,0],[.24,.62,0]],rad=x=>x*Math.PI/180;
function options(o={}){const mode=o.mode===undefined?'target':o.mode,mirror=o.mirror===undefined?'none':o.mirror,lag=o.lag===undefined?3:Number(o.lag);if(!['target','increment'].includes(mode)||!['none','horizontal','double'].includes(mirror)||!Number.isInteger(lag)||lag<0||lag>7)throw Error('invalid 5B options');return{mode,mirror,lag};}
function rotation(slice,mode){const stops=mode==='target'?ANGLES:[0,90,135,168,175],k=Math.min(3,Math.floor(slice/7)),f=(slice-k*7)/7;return stops[k]+f*(stops[k+1]-stops[k]);}
function snapshot(slice=0,o={}){
 if(!Number.isInteger(slice)||slice<0||slice>28)throw Error('5B slice must be 0..28');o=options(o);
 const turn=rotation(slice,o.mode),facets=[];
 for(let i=0;i<4;i++){
  const localSlice=Math.max(0,slice-(i===3?o.lag:0)),fold=70*Math.sin(2*Math.PI*localSlice/28),a=rad(fold),r=rad(i*90);
  const model=BASE.map(([x,y])=>{const q=[x,y*Math.cos(a),y*Math.sin(a)];return[Math.cos(r)*q[0]-Math.sin(r)*q[1],Math.sin(r)*q[0]+Math.cos(r)*q[1],q[2]];});
  const reflect=p=>[p[0]*(o.mirror==='double'?-1:1),p[1]*(o.mirror!=='none'?-1:1),p[2]],project=p=>W.pose(reflect(p),turn,18);
  facets.push({id:'wing-'+(i+1),localSlice,fold,model,points:model.map(project),shadow:model.map(p=>project([p[0],p[1],0]))});
 }
 return{schema:'nexah.a0.fold-lag-lens/1',version:VERSION,slice,slices:29,options:o,turn,facets,referenceCrossFixed:true,sourceMutation:false,physicalTimeClaim:false,connectedOrigamiClaim:false,zSemantics:'synthetic sequence index; not LIFE08 generation or physical time',shadowSemantics:'parallel projection onto model z=0; no light-source physics',echoSemantics:'earlier synthetic poses; not shadow',reflectionDeterminant:o.mirror==='horizontal'?-1:1};
}
function drawing(r){
 const p=q=>[255+112*q[0],250-112*q[1]],poly=ps=>ps.map(p).map(x=>x.join(',')).join(' '),line=(a,b,c,w=1)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}"/>`,text=(x,y,t,c='#b7ccd6')=>`<text x="${x}" y="${y}" fill="${c}" font-size="13" font-family="system-ui,sans-serif">${t}</text>`;
 let s='<title>5B: vier unabhängige Flügel, feste Referenz, Schatten und Sequenz-Z</title><desc>Konstruierte 29-Schritt-Demonstration. Flügel 4 folgt verzögert; keine zusammenhängende Origami-Fläche und keine physikalische Zeit.</desc>';
 s+=line([55,250],[455,250],'#fff',2)+line([255,50],[255,450],'#fff',2)+text(35,29,'WEISSES KREUZ FEST · MOTIV DREHT', '#eef7fb');
 for(const f of r.facets)s+=`<polygon points="${poly(f.shadow)}" fill="#4a286a" fill-opacity=".55" stroke="#80609c" stroke-width="1"/>`;
 for(const ago of [6,3])if(r.slice>=ago){const old=snapshot(r.slice-ago,r.options);for(const f of old.facets)s+=`<polygon points="${poly(f.points)}" fill="none" stroke="#9967c5" stroke-opacity=".55" stroke-dasharray="4 5"/>`;}
 for(const f of [...r.facets].sort((a,b)=>a.points.reduce((s,p)=>s+p[2],0)-b.points.reduce((s,p)=>s+p[2],0))){const tip=p(f.points[2]);s+=`<polygon points="${poly(f.points)}" fill="#d2a9ff" fill-opacity=".38" stroke="#dfbcff" stroke-width="2"/>`+text(tip[0]+4,tip[1]-4,f.id.slice(-1)+(f.id==='wing-4'?' · NACHLAUF':''),'#f1dfff');}
 s+=text(35,479,`ψ=${r.turn.toFixed(1)}° CCW · Schnitt ${r.slice+1}/29 · Spiegelung ${r.options.mirror}`);
 s+=text(535,29,'Z · SEQUENZSTAPEL (0–28)','#eef7fb');
 for(let z=0;z<29;z++){const y=435-z*13;s+=`<ellipse cx="685" cy="${y}" rx="114" ry="15" fill="${z===r.slice?'#213c4c':'none'}" stroke="${z===r.slice?'#f3c25a':'#294453'}" stroke-width="${z===r.slice?2:1}"/>`;}
 for(let i=0;i<4;i++){let d='';for(let z=0;z<29;z++){const q=snapshot(z,r.options).facets[i].points[2],x=685+q[0]*55,y=435-z*13+q[1]*7;d+=(z?'L':'M')+x+','+y;}s+=`<path d="${d}" fill="none" stroke="${i===3?'#efbd59':'#9f7dc8'}" stroke-width="1.5"/>`;const q=r.facets[i].points[2];s+=`<circle cx="${685+q[0]*55}" cy="${435-r.slice*13+q[1]*7}" r="4" fill="${i===3?'#efbd59':'#e0bcff'}"/>`;}
 return s+text(535,479,'Gold: gewählter Z-Schnitt / Flügel 4');
}
function mount(doc,clock=globalThis){
 const el=id=>doc.getElementById(id);if(!el('foldLagSvg'))return null;
 let lastClock=0,timer=null,started=false;
 const updatePlayer=()=>{el('foldLagPlay').textContent=timer!==null?'Pause':Number(el('foldLagSlice').value)===28?'Sequenz erneut abspielen':started?'Sequenz fortsetzen':'▶ Sequenz abspielen';el('foldLagPlay').setAttribute('aria-pressed',String(timer!==null));};
 const pause=()=>{if(timer!==null){clock.clearInterval(timer);timer=null;}updatePlayer();};
 const read=()=>({mode:el('foldLagMode').value,lag:Number(el('foldLagDelay').value),mirror:el('foldLagMirror').value});
 const render=()=>{const r=snapshot(Number(el('foldLagSlice').value),read());el('foldLagSvg').innerHTML=drawing(r);el('foldLagReadout').textContent=`Z ${r.slice}/28 · ψ ${r.turn.toFixed(1)}° · Flügel 4: lokaler Schritt ${r.facets[3].localSlice} · Nachlauf ${r.options.lag}`;el('foldLagSlice').disabled=el('foldLagFollow').checked;if(api.onRender)api.onRender(JSON.parse(JSON.stringify(r)));return r;};
 const sync=tick=>{if(!Number.isInteger(tick)||tick<0||tick>15)throw Error('invalid Q4 tick');lastClock=tick;if(el('foldLagFollow').checked)el('foldLagSlice').value=String(Math.round(tick*28/15));const r=render();updatePlayer();return r;};
 const api={sync,render,pause,beforePlay:null,onRender:null,snapshot:()=>snapshot(Number(el('foldLagSlice').value),read())};
 el('foldLagPlay').addEventListener('click',()=>{if(timer!==null){pause();return;}if(api.beforePlay)api.beforePlay();el('foldLagFollow').checked=false;if(!started||Number(el('foldLagSlice').value)===28)el('foldLagSlice').value='0';started=true;render();timer=clock.setInterval(()=>{el('foldLagSlice').value=String(Math.min(28,Number(el('foldLagSlice').value)+1));render();if(Number(el('foldLagSlice').value)===28)pause();},400);updatePlayer();});
 for(const id of ['foldLagMode','foldLagDelay','foldLagMirror','foldLagSlice'])el(id).addEventListener('input',()=>{pause();started=true;render();updatePlayer();});
 el('foldLagFollow').addEventListener('change',()=>{pause();sync(lastClock);});
 el('foldLagNext').addEventListener('click',()=>{pause();started=true;el('foldLagFollow').checked=false;el('foldLagSlice').value=String(Math.min(28,Number(el('foldLagSlice').value)+1));render();updatePlayer();});
 el('foldLagReset').addEventListener('click',()=>{pause();started=false;el('foldLagFollow').checked=false;el('foldLagSlice').value='0';render();updatePlayer();});
 if(doc.addEventListener)doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pause();});
 el('foldLagExport').addEventListener('click',()=>{const payload={...render(),clock:{tick:lastClock,follow:el('foldLagFollow').checked,mapping:'round(Q4 tick * 28 / 15); display resampling, not source identity'},sequence:Array.from({length:29},(_,i)=>snapshot(i,read()))},url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-5b-fold-lag.json';a.click();URL.revokeObjectURL(url);});
 render();updatePlayer();return api;
}
return{VERSION,ANGLES,BASE,options,rotation,snapshot,drawing,mount};
});
