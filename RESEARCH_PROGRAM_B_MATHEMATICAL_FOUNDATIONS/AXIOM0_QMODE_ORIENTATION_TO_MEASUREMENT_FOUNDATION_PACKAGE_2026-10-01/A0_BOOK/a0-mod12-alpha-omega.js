(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0Mod12AlphaOmega=api;
})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const MODULUS=12;
  const PITCHES=Object.freeze(['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B']);
  const OPERATORS=Object.freeze({
    alpha:Object.freeze({id:'ALPHA',step:7,color:'#52d8ef',reading:'CIRCLE_OF_FIFTHS_ADDRESS_WALK'}),
    omega:Object.freeze({id:'OMEGA',step:11,color:'#e46db5',reading:'DESCENDING_CHROMATIC_ADDRESS_WALK'})
  });
  const mod=value=>((value%MODULUS)+MODULUS)%MODULUS;
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  function order(step){return MODULUS/gcd(MODULUS,mod(step));}
  function walk(step,start=0,count=MODULUS){
    if(!Number.isInteger(step)||!Number.isInteger(start)||!Number.isInteger(count)||count<0)throw Error('Invalid Z12 walk');
    const normalizedStep=mod(step),normalizedStart=mod(start),addresses=Array.from({length:count+1},(_,n)=>mod(normalizedStart+n*normalizedStep));
    return{modulus:MODULUS,step,normalized_step:normalizedStep,start:normalizedStart,order:order(normalizedStep),visits_all_nodes:order(normalizedStep)===MODULUS,self_inverse:mod(normalizedStep*normalizedStep)===1,addresses,labels:addresses.map(address=>PITCHES[address]),return_exact:count>0&&addresses[count]===normalizedStart};
  }
  function stationIndex(step,address,start=0){
    const route=walk(step,start,MODULUS).addresses.slice(0,-1),index=route.indexOf(mod(address));
    return index<0?null:index;
  }
  function snapshot(cursor=0,mode='alpha',start=0){
    if(!Number.isInteger(cursor)||cursor<0||!OPERATORS[mode])throw Error('Invalid Z12 lens state');
    const operator=OPERATORS[mode],route=walk(operator.step,start,MODULUS),n=cursor%MODULUS,address=route.addresses[n];
    return{schema:'nexah.a0.mod12-alpha-omega-lens/1',mode,operator,n,cursor,address,label:PITCHES[address],route,stations:{G:{address:7,n:stationIndex(operator.step,7,start)},E:{address:4,n:stationIndex(operator.step,4,start)}},direction:operator.step===11?'DESCENDING_CHROMATIC':'FIFTHS_GENERATOR',return_exact:cursor>0&&cursor%MODULUS===0};
  }
  function receipt(){
    const alpha=walk(7),omega=walk(11),compositionStep=mod(7+11);
    return{
      schema:'nexah.a0.mod12-alpha-omega-return/1',
      date:'2026-11-06',status:'PASS_SOURCE_BOUND_FORMAL_VIEW',
      identity_reuse:['MOD:NUMBER_VIEW_SUITE'],new_identity:false,new_relation:false,new_alias:false,new_operator:false,new_study:false,new_finding:false,publication:false,
      carrier:{kind:'Z12_ADDRESS_REGISTER',modulus:MODULUS,labels:PITCHES},
      alpha:{step:7,gcd:gcd(7,12),order:alpha.order,visits_all_nodes:alpha.visits_all_nodes,self_inverse:alpha.self_inverse,route:alpha.addresses},
      omega:{step:11,signed_reading:-1,gcd:gcd(11,12),order:omega.order,visits_all_nodes:omega.visits_all_nodes,self_inverse:omega.self_inverse,route:omega.addresses},
      composition:{step:compositionStep,order:order(compositionStep),relation:'ALPHA_AFTER_OMEGA_EQUALS_PLUS_6',mutual_inverses:false},
      addressed_stations:{G:7,E:4,alpha_steps:{G:stationIndex(7,7),E:stationIndex(7,4)},omega_steps:{G:stationIndex(11,7),E:stationIndex(11,4)}},
      controls:{step_6:{order:order(6),visits_all_nodes:false},step_4:{order:order(4),visits_all_nodes:false},step_3:{order:order(3),visits_all_nodes:false}},
      notation:{N:'LOCAL_STEP_INDEX_ONLY',BODIE_DOYLE:'OWNER_MNEMONIC_UNBOUND',G_E:'ADDRESSED_STATION_PAIR_ONLY',DU_UD:'VIEW_ORIENTATION_FLIP_ONLY'},
      boundary:'FINITE PITCH-CLASS ADDRESS VISUALIZATION IN EQUAL-TEMPERED Z12. NO ACOUSTIC MEASUREMENT, MAJOR/MINOR DERIVATION, MOBIUS TOPOLOGY, PHYSICAL SPIN, NORTH-POLE CLAIM, BODIE/DOYLE IDENTITY OR NEW NUMBER OPERATOR.'
    };
  }
  function mount(host){
    if(!host||typeof host.querySelector!=='function')throw Error('Missing Z12 lens host');
    let mode='alpha',cursor=0;
    const plot=host.querySelector('[data-z12-plot]'),status=host.querySelector('[data-z12-status]'),routeOut=host.querySelector('[data-z12-route]');
    const point=i=>{const angle=-Math.PI/2+2*Math.PI*i/MODULUS;return{x:210+150*Math.cos(angle),y:210+150*Math.sin(angle)}};
    function draw(){
      const state=snapshot(cursor,mode),operator=state.operator,points=state.route.addresses.slice(0,-1).map(point),current=point(state.address);
      const path=points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join(' ')+' Z';
      const nodes=PITCHES.map((label,i)=>{const p=point(i),active=i===state.address;return'<g class="z12-node'+(active?' is-active':'')+'"><circle cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="'+(active?10:6)+'"></circle><text x="'+p.x.toFixed(2)+'" y="'+(p.y+24).toFixed(2)+'">'+label+'</text></g>'}).join('');
      plot.innerHTML='<svg viewBox="0 0 420 420" role="img" aria-label="Z₁₂ Adressring mit '+operator.id+' Lauf"><circle class="z12-ring" cx="210" cy="210" r="150"></circle><path class="z12-chord" style="--z12-color:'+operator.color+'" d="'+path+'"></path>'+nodes+'<circle class="z12-cursor" style="--z12-color:'+operator.color+'" cx="'+current.x.toFixed(2)+'" cy="'+current.y.toFixed(2)+'" r="14"></circle><text class="z12-centre" x="210" y="204">'+operator.id+'</text><text class="z12-centre small" x="210" y="228">+'+operator.step+' ≡ '+(operator.step===11?'−1':'7')+' (mod 12)</text></svg>';
      status.textContent=operator.id+' · n='+state.n+' · '+state.label+' ['+state.address+'] · G@n'+state.stations.G.n+' · E@n'+state.stations.E.n+(state.return_exact?' · RETURN':'');
      routeOut.textContent=state.route.labels.slice(0,-1).join(' → ')+' → C';
      host.querySelectorAll('[data-z12-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.z12Mode===mode)));
    }
    host.querySelectorAll('[data-z12-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.z12Mode;cursor=0;draw()}));
    host.querySelector('[data-z12-step="next"]').addEventListener('click',()=>{cursor++;draw()});
    host.querySelector('[data-z12-step="return"]').addEventListener('click',()=>{cursor=0;draw()});
    draw();
    return{snapshot:()=>snapshot(cursor,mode),receipt};
  }
  function autoMount(){if(typeof document==='undefined')return;document.querySelectorAll('[data-z12-alpha-omega]').forEach(host=>mount(host));}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoMount);else autoMount();}
  return{MODULUS,PITCHES,OPERATORS,mod,gcd,order,walk,stationIndex,snapshot,receipt,mount};
});
