(function(root,factory){
  const api=factory(typeof module==='object'?require('A0_SCIENTIFIC_POSITION_REPORT.html'):root.LifeCylinder,typeof module==='object'?require('./a0-numbermagick-number-lens.js'):root.A0NumbermagickNumberLensModel,typeof module==='object'?require('A0_SCIENTIFIC_POSITION_REPORT.html'):root.ThreeDomainEngine);
  if(typeof module==='object'&&module.exports)module.exports=api;root.A0GameOfWorldsModel=api;
})(typeof globalThis==='undefined'?this:globalThis,function(life,numbers,jointSource){
  'use strict';
  const SCHEMA='nexah.game-of-worlds.local/1',clone=x=>JSON.parse(JSON.stringify(x));
  const worlds={
    life:{name:'LIFE · Living Field',equation:'s′=1 ⇔ N=3 ∨ (s=1 ∧ N=2)',rule:'B3/S23',carrier:'16×16 Zellen',limit:64},
    euler:{name:'Euler · Orbit of Numbers',equation:'zₜ₊₁ = i zₜ · (a,b) ↦ (−b,a)',rule:'EXACT_QUARTER_TURN',carrier:'Gaußsche ganze Zahlen; Ansichtsfenster −10..10',limit:64},
    fibonacci:{name:'Fibonacci · Growing Worlds',equation:'(a,b)ₜ₊₁ = (b,a+b)ₜ · F₀=0, F₁=1',rule:'FIBONACCI_PAIR',carrier:'Exaktes Paar; Grid zeigt nur Restadresse',limit:30}
  };
  function config(input={}){
    const world=input.world||'life';if(!Object.hasOwn(worlds,world))throw Error('Unbekannte Welt.');
    if(world==='life'){const pattern=input.pattern||'blinker',boundary=input.boundary||'finite-dead';if(!['blinker','glider','block'].includes(pattern)||!life.MODES.includes(boundary))throw Error('Ungültiger LIFE-Start.');return{world,pattern,boundary}}
    if(world==='euler'){const re=Number(input.re??3),im=Number(input.im??4);if(String(input.re??3).trim()===''||String(input.im??4).trim()===''||!Number.isInteger(re)||!Number.isInteger(im)||Math.abs(re)>10||Math.abs(im)>10)throw Error('Euler-Start: ganze Koordinaten −10..10.');return{world,re,im}}
    return{world};
  }
  function initial(c){if(c.world==='life')return life.initial({kind:'pattern',pattern:c.pattern,size:16},c.boundary);if(c.world==='euler')return{re:c.re,im:c.im};return{a:'0',b:'1'}}
  function advance(c,state){
    if(c.world==='life')return life.step(state);
    if(c.world==='euler')return{re:-state.im||0,im:state.re||0};
    return{a:state.b,b:String(BigInt(state.a)+BigInt(state.b))};
  }
  function fingerprint(state){return JSON.stringify(state)}
  function makeFrame(c,state,generation){
    const run=JSON.stringify(c),points=[],size=c.world==='life'?16:c.world==='euler'?21:11;
    if(c.world==='life')for(const [x,y] of state.live)points.push({x,y});
    else if(c.world==='euler')points.push({x:state.re+10,y:state.im+10});
    else{const n=BigInt(state.a);points.push({x:Number(n%11n),y:Number(n%7n)})}
    return{generation,state:clone(state),size,height:c.world==='fibonacci'?7:size,points:points.map(p=>({...p,generation,id:run+'|g'+generation+'|'+p.x+','+p.y})),identity:run+'|g'+generation,fingerprint:fingerprint(state)};
  }
  function viewContract(c){return{scope:'VIEW_ONLY_NOT_WORLD_DYNAMICS',projection_only:true,carrier_id:c.world==='life'?'LIFE16:'+c.boundary:c.world==='euler'?'GAUSSIAN_INTEGER_WINDOW_21':'FIBONACCI_PAIR_REMAINDER_11x7',axis_kind:c.world==='life'?'time':'sequence',z_semantics:c.world==='life'?'discrete LIFE generation':c.world==='euler'?'quarter-turn iteration index':'Fibonacci sequence index',theta_address:'display column, not Euler phase',radial_lane:'display row',source_pointer:'LifeTemporalZ.map; A0SpatialReaderPrimitives.project',claim_boundary:'Shared view geometry does not identify world operators; no physical time claimed for sequence axes.'}}
  function start(input){const c=config(input);return{schema:SCHEMA,config:c,viewContract:viewContract(c),frames:[makeFrame(c,initial(c),0)],cursor:0}}
  function step(session){
    const s=clone(session);if(s.cursor<s.frames.length-1){s.cursor++;return s}
    const g=s.frames[s.cursor].generation;if(g>=worlds[s.config.world].limit)throw Error('Horizont erreicht.');
    s.frames.push(makeFrame(s.config,advance(s.config,s.frames[s.cursor].state),g+1));s.cursor++;return s;
  }
  function at(session,index){const s=clone(session);if(!Number.isInteger(index)||index<0||index>=s.frames.length)throw Error('Ungültiger Replay-Schritt.');s.cursor=index;return s}
  function eventLedger(session){
    const f=session.frames[session.cursor],previous=session.frames[Math.max(0,session.cursor-1)];
    if(session.config.world==='life'){const sets=life.eventSets(previous.state,f.state);return{births:sets.births.length,survivals:sets.survivals.length,deaths:sets.deaths.length,sets,kind:session.cursor?'NATIVE_LIFE_TRANSITION':'INITIAL_STATE_NOT_TRANSITION'}}
    return{kind:'NUMBER_TRANSITION_NOT_LIFE_EVENT',source:clone(previous.state),target:clone(f.state),prime:session.config.world==='fibonacci'?numbers.isPrime(BigInt(f.state.a)):null};
  }
  function mission(session){
    const c=session.config,f=session.frames[session.cursor],g=f.generation;
    if(c.world==='euler')return{title:'Vier Vierteldrehungen: finde den Start wieder.',target:4,success:g>=4&&f.fingerprint===session.frames[0].fingerprint};
    if(c.world==='fibonacci')return{title:'Erreiche F₇ = 13 mit der Paarregel.',target:7,success:g>=7&&BigInt(f.state.a)>=13n};
    if(c.pattern==='glider')return{title:'Beobachte acht adressierte Generationen.',target:8,success:g>=8};
    const target=c.pattern==='block'?1:2;return{title:'Finde den Startzustand nach '+target+' Schritt(en) wieder.',target,success:g>=target&&f.fingerprint===session.frames[0].fingerprint};
  }
  function joint(session){
    const current=session.frames[session.cursor],previous=session.frames[Math.max(0,session.cursor-1)],binary=frame=>{const out=new Uint8Array(frame.size*frame.height);for(const p of frame.points)out[p.y*frame.size+p.x]=1;return out},a=binary(previous),b=binary(current);
    return{...jointSource.transitionLedger(a,b),kind:'DISPLAY_OCCUPANCY_PARTITION_NOT_OPERATOR_IDENTITY',hasTransition:session.cursor>0,occupancyEqual:a.every((v,i)=>v===b[i]),fullStateEqual:previous.fingerprint===current.fingerprint};
  }
  function replay(record){
    if(record?.schema!==SCHEMA||!Array.isArray(record.frames)||!Number.isInteger(record.cursor))return{status:'INVALID',reason:'schema'};
    try{let expected=start(record.config);if(JSON.stringify(expected.config)!==JSON.stringify(record.config)||JSON.stringify(expected.viewContract)!==JSON.stringify(record.viewContract)||record.frames.length>worlds[expected.config.world].limit+1||!record.frames.length||record.cursor<0||record.cursor>=record.frames.length)return{status:'INVALID',reason:'bounds/config/view contract'};
      for(let i=0;i<record.frames.length;i++){if(i)expected=step(expected);if(JSON.stringify(expected.frames[i])!==JSON.stringify(record.frames[i]))return{status:'FAIL',generation:i}}
      return{status:'PASS',frames:record.frames.length,scope:'DETERMINISTIC_LOCAL_REPLAY_NOT_INVERSE_DYNAMICS'};
    }catch(error){return{status:'INVALID',reason:error.message}}
  }
  return{SCHEMA,worlds,config,start,step,at,eventLedger,mission,joint,viewContract,replay,advance,fingerprint};
});
