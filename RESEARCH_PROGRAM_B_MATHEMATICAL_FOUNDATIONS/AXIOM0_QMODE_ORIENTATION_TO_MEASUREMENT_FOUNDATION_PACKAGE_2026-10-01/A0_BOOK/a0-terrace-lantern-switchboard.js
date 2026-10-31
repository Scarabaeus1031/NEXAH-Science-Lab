(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(
    node?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,
    node?require('./a0-lantern-panel-v-control-lens.js'):root.A0LanternPanelVControlLens
  );
  if(node)module.exports=api;else root.A0TerraceLanternSwitchboard=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(numbers,lantern){
  'use strict';
  const HORIZON=16,PROFILE='CERTIFIED_147_5';
  const clampStep=value=>Math.max(0,Math.min(HORIZON,Math.trunc(Number(value)||0)));
  function model(step=0){
    const n=clampStep(step),terrace=numbers.eightfoldTerrace(n,HORIZON),progress=n/HORIZON,light=lantern.sample(PROFILE,progress);
    return Object.freeze({
      schema:'nexah.a0.terrace-lantern-switchboard/1',
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:NUMBER_VIEW_SUITE','A0_LANTERN_PANEL_V_CONTROL_LENS']),
      step:n,horizon:HORIZON,terrace,lantern:light,
      coupling:Object.freeze({kind:'LOCAL_BENCH_CURSOR_PROJECTION',sharedCursor:true,sharedClock:false,sourceMutation:false,causalFeed:false}),
      authority:Object.freeze({newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,claimPromotion:false,publication:false}),
      boundary:'ONE LOCAL BENCH CURSOR PROJECTS TWO EXISTING CONTRACTS. k=8b+s REMAINS A NUMBER ADDRESS; PANEL V REMAINS A FIVE-CHANNEL BODY/SHADOW VIEW. NO SHARED SOURCE CLOCK, CAUSAL FEED, PHYSICAL LIGHT LAW OR RUN EXTENSION.'
    });
  }
  function verify(){
    let checks=0;const need=(value,label)=>{if(!value)throw new Error(label);checks++};
    const open=model(0),stop=model(8),returned=model(16);
    need(open.terrace.address==='b0 / s0'&&open.lantern.event==='OPEN','open address');
    need(stop.terrace.address==='b1 / s0'&&stop.lantern.event==='STOP'&&stop.lantern.angle===147.5,'certified stop');
    need(returned.terrace.address==='b2 / s0'&&returned.lantern.event==='EXACT_RETURN'&&returned.lantern.angle===0,'exact return');
    need(returned.terrace.cells.length===64&&returned.terrace.declared_horizon===16,'projection boundary');
    need(stop.lantern.channels.length===5&&stop.lantern.channels.every(channel=>channel.angle===147.5),'five channels');
    need(stop.coupling.kind==='LOCAL_BENCH_CURSOR_PROJECTION'&&stop.coupling.sharedCursor===true&&stop.coupling.sharedClock===false&&stop.coupling.sourceMutation===false&&stop.coupling.causalFeed===false,'cursor only');
    need(Object.values(stop.authority).every(value=>value===false),'authority boundary');
    return Object.freeze({status:'PASS_SOURCE_BOUND_BENCH_COMPOSITION',checks,newCanonicalIds:[],relationChanges:[],holds:['shared source clock','causal feed','physical light law','run extension beyond n16']});
  }
  const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));return node;};
  const text=(stage,x,y,value,klass)=>{const node=svg('text',{x,y,class:klass});node.textContent=value;stage.append(node);return node;};
  const polar=(cx,cy,r,degrees)=>{const a=(degrees-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  function render(stage,record){
    stage.replaceChildren();stage.setAttribute('viewBox','0 0 920 430');
    text(stage,42,35,'EIGHTFOLD TERRACE · k = 8b + s','tls-title');
    text(stage,607,35,'PANEL V · FIVE CHANNELS','tls-title');
    const x0=52,y0=72,size=31,gap=4;
    record.terrace.cells.forEach(cell=>{
      const x=x0+(cell.local*(size+gap)),y=y0+(cell.block*(size+gap));
      const rect=svg('rect',{x,y,width:size,height:size,rx:3,class:`tls-cell is-${cell.state.toLowerCase()}`,'data-k':cell.k});stage.append(rect);
      if(cell.state==='ACTIVE')text(stage,x+size/2,y+20,String(cell.k),'tls-cell-label');
    });
    text(stage,52,374,`ACTIVE ${record.terrace.address} · n${record.step}`,'tls-readout');
    text(stage,52,397,'CYAN ≤ n16 · OUTER CELLS = PROJECTION','tls-boundary-text');
    stage.append(svg('path',{d:'M352 212 C430 212 460 212 520 212',class:'tls-cursor-cable'}));
    text(stage,432,198,'LOCAL BENCH CURSOR','tls-cable-label');
    text(stage,432,232,'NO SOURCE FEED','tls-cable-label is-hold');
    const cx=704,cy=212,r=132,travel=record.lantern.progress<=.5?record.lantern.progress*2:(1-record.lantern.progress)*2;
    stage.append(svg('circle',{cx,cy,r,class:'tls-shadow-ring'}));
    stage.append(svg('circle',{cx,cy,r:r*(.42+.34*travel),class:'tls-body-ring'}));
    for(let i=0;i<5;i++){
      const degrees=-90+i*72,outer=polar(cx,cy,r-10,degrees),left=polar(cx,cy,54,degrees-25),right=polar(cx,cy,54,degrees+25);
      stage.append(svg('path',{d:`M${left[0]} ${left[1]} L${outer[0]} ${outer[1]} L${right[0]} ${right[1]} Z`,class:'tls-leaf',style:`opacity:${(.2+.8*travel).toFixed(3)}`}));
      text(stage,outer[0],outer[1]+4,`θ${i+1}`,'tls-channel-label');
    }
    stage.append(svg('circle',{cx,cy,r:24,class:'tls-heart'}));
    text(stage,cx,cy+5,record.lantern.event,'tls-event');
    text(stage,cx,374,`${record.lantern.angle.toFixed(3)}° · ${record.lantern.phase}`,'tls-readout');
    text(stage,cx,397,'BODY ≠ SHADOW · VIEW ONLY','tls-boundary-text');
  }
  function mount(scope=document,win=scope.defaultView||{}){
    const root=scope.querySelector?.('#terraceLanternSwitchboard');if(!root)return null;
    const stage=root.querySelector('[data-tls-stage]'),output=root.querySelector('[data-tls-output]'),slider=root.querySelector('[data-tls-slider]'),run=root.querySelector('[data-tls-run]');let step=0,timer=null;
    function stop(){if(timer){win.clearInterval(timer);timer=null}run.setAttribute('aria-pressed','false');run.textContent='RUN 0→16→RETURN'}
    function paint(){const record=model(step);slider.value=String(step);render(stage,record);output.textContent=`n${step} · ${record.terrace.address} · ${record.lantern.event} · ${record.lantern.angle.toFixed(3)}° · LOCAL CURSOR / NO SHARED CLOCK`;root.dataset.event=record.lantern.event.toLowerCase();return record}
    function set(value){step=clampStep(value);return paint()}
    function advance(delta=1){return set(step+delta)}
    function runAll(){if(timer){stop();return}if(step>=HORIZON)step=0;paint();run.setAttribute('aria-pressed','true');run.textContent='PAUSE';if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){set(HORIZON);stop();return}timer=win.setInterval(()=>{if(step>=HORIZON){stop();return}advance(1)},360)}
    root.querySelector('[data-tls-prev]').addEventListener('click',()=>{stop();advance(-1)});root.querySelector('[data-tls-next]').addEventListener('click',()=>{stop();advance(1)});root.querySelector('[data-tls-reset]').addEventListener('click',()=>{stop();set(0)});slider.addEventListener('input',()=>{stop();set(slider.value)});run.addEventListener('click',runAll);paint();
    return Object.freeze({set,advance,run:runAll,reset:()=>set(0),verify,get record(){return model(step)}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document,window));
  return Object.freeze({HORIZON,PROFILE,model,verify,render,mount});
});
