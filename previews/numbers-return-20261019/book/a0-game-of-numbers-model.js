(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('a0-game-of-worlds-model.js'):root.A0GameOfWorldsModel);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0GameOfNumbers=api;
})(typeof globalThis==='undefined'?this:globalThis,function(source){
  'use strict';
  const VIEWS=['rings','spiral','grid','tower','rails','elevator','joint','mixer','rgb','pq','groups','wheels'],RULES=['euler','fibonacci','zero','repunit','dyadic','carrier','elevator','sumlift','mixer','pq','groups','wheels'],goldenAngle=Math.PI*(3-Math.sqrt(5));
  const labels={euler:'Euler · Orbit',fibonacci:'Fibonacci · Wachstum',zero:'10…01 · Zero Rails',repunit:'1111² · Repunit',dyadic:'×2 · Pink Paired Rails',carrier:'11537 · Carrier Route',elevator:'QRT20 · Family Elevator',sumlift:'1836 + 1729 · Joint Lift',mixer:'Tessarec · Layered Mixer',pq:'P/Q · Conjugate Orbit v7',groups:'R / S · Gruppen auf einem Grid',wheels:'1836 / 1729 · XIX Wheels'};
  const railLimits={zero:7,repunit:8,dyadic:16,carrier:2,elevator:16,sumlift:16,mixer:180,pq:96,groups:8,wheels:180};
  const MIXER_FOLD_STOPS=Object.freeze([
    Object.freeze({phase:0,angle:0,label:'OPEN'}),
    Object.freeze({phase:90,angle:78,label:'TORUS / AXIS I'}),
    Object.freeze({phase:180,angle:33,label:'THREE-AXIS HINGE'}),
    Object.freeze({phase:270,angle:7,label:'RETURN GAP'}),
    Object.freeze({phase:360,angle:0,label:'VIEW CLOSED'})
  ]);
  const clone=x=>JSON.parse(JSON.stringify(x)),isRail=r=>Object.hasOwn(railLimits,r);
  function mixerFold(phase){
    if(!Number.isFinite(phase)||phase<0||phase>360)throw Error('Invalid mixer fold phase');
    const end=MIXER_FOLD_STOPS.findIndex(stop=>phase<=stop.phase),i=Math.max(1,end),a=MIXER_FOLD_STOPS[i-1],b=MIXER_FOLD_STOPS[i],u=(phase-a.phase)/(b.phase-a.phase),angle=a.angle+(b.angle-a.angle)*u;
    const stopIndex=MIXER_FOLD_STOPS.findIndex(stop=>stop.phase===phase);
    return{angle:Number(angle.toFixed(6)),from:a.angle,to:b.angle,segment:i-1,label:phase===b.phase?b.label:a.label+' → '+b.label,crownTick:phase===360?0:Math.floor(phase/18),axis:['I','II','III','RETURN'][i-1],station:stopIndex>=0,stopIndex,foldReturn:phase===360};
  }
  function groupAction(op,p){
    if(!p||![p.x,p.y].every(Number.isSafeInteger)||!['R','S'].includes(op))throw Error('Invalid D4 action');
    return op==='R'?{x:-p.y||0,y:p.x}:{x:p.x,y:-p.y||0};
  }
  function groupState(n){
    if(!Number.isInteger(n)||n<0||n>8)throw Error('Invalid D4 step');
    let rs={x:3,y:1},sr={x:3,y:1},rPower={x:3,y:1},sPower={x:3,y:1},rsWord='',srWord='';
    for(let i=0;i<n;i++){const a=i%2?'S':'R',b=i%2?'R':'S';rs=groupAction(a,rs);sr=groupAction(b,sr);rPower=groupAction('R',rPower);sPower=groupAction('S',sPower);rsWord+=a;srWord+=b;}
    return{a:String(n),rs,sr,rPower,sPower,rsWord,srWord};
  }
  function wheelConfig(ratio='3:2',direction='counter'){
    if(!['3:2','2:3'].includes(ratio)||!['counter','co'].includes(direction))throw Error('Invalid wheel preset');
    return{ratio,direction};
  }
  function wheelState(n,ratio='3:2',direction='counter'){
    if(!Number.isInteger(n)||n<0||n>180)throw Error('Invalid wheel sample');wheelConfig(ratio,direction);
    const rates=ratio.split(':').map(Number),aRate=rates[0],bRate=rates[1]*(direction==='counter'?-1:1),aTurns=aRate*n,bTurns=bRate*n,mod=x=>((x%180)+180)%180,aTick=mod(aTurns),bTick=mod(bTurns);
    return{a:'1836',companion:'1729',phaseDegrees:2*n,rate1836:aRate,rate1729:bRate,turnNumerator1836:aTurns,turnNumerator1729:bTurns,turnDenominator:180,tick1836:aTick,tick1729:bTick,alignment:mod(aTick-bTick)===0,orientationReturn:n>0&&aTick===0&&bTick===0};
  }
  function jointConfig(direction='co'){
    if(!['co','counter'].includes(direction))throw Error('Invalid joint direction');
    return direction==='counter'?{world:'sumlift',direction}:{world:'sumlift'};
  }
  function jointProjection(left,right,modulus=11,direction='co'){
    jointConfig(direction);
    if(![11,12,13].includes(modulus))throw Error('Unsupported joint modulus');
    const a=BigInt(left),b=BigInt(right),m=BigInt(modulus),res=v=>Number(((v%m)+m)%m),gcd=(a,b)=>b?gcd(b,a%b):a,rates=[11,direction==='counter'?-11:11,direction==='counter'?0:22];
    return{modulus,left:String(a),right:String(b),sum:String(a+b),delta:String(a-b),residues:[res(a),res(b),res(a+b)],steps:rates.map(v=>((v%modulus)+modulus)%modulus),periods:rates.map(v=>modulus/gcd(modulus,Math.abs(v))),boundary:'Residue return only; full integers and history remain distinct'};
  }
  function railFrame(rule,n,config={}){
    let state,operation;
    if(rule==='zero'){state={a:String(10n**BigInt(n+1)+1n),middleZeros:n};operation=n?'10a−9':'seed 11';}
    if(rule==='repunit'){const rep=(10n**BigInt(n+1)-1n)/9n;state={a:String(rep*rep),repunit:String(rep),ones:n+1};operation='R_k²; k=n+1';}
    if(rule==='dyadic'){const scale=2n**BigInt(n),left=97n*scale,right=101n*scale;state={a:String(right),left:String(left),sum:String(left+right),delta:String(right-left)};operation=n?'paired ×2':'seed (97,101)';}
    if(rule==='carrier'){let word='11537';for(let i=1;i<=n;i++){const suffix=word.slice(2),order=i===1?[0,2,1]:[2,0,1];word=word.slice(0,2)+order.map(j=>suffix[j]).join('')}state={a:word};operation=['seed','ref:2 suffix','rot:2 suffix'][n];}
    if(rule==='elevator'){state={a:String(11537n+20n*BigInt(n)),lift:String(20n*BigInt(n))};operation=n?'declared +20 lift; not digit permutation':'seed family';}
    if(rule==='sumlift'){const left=1836n+11n*BigInt(n),right=1729n+(config.direction==='counter'?-11n:11n)*BigInt(n);state={a:String(left+right),left:String(left),right:String(right),delta:String(left-right)};operation=config.direction==='counter'?(n?'declared counter lift (+11,-11); sum 3565 retained':'counter seed (1836,1729)'):(n?'declared coupled +11 lift; sum recomputed':'seed (1836,1729)');}
    if(rule==='mixer'){const phase=2*n,fold=mixerFold(phase);state={a:String(n),phase,foldAngle:fold.angle,foldSegment:fold.segment,crownTick:fold.crownTick};operation='source scene phase=2n degrees; counter rotation [3phase,36−2phase,18]; declared view-fold 0→78→33→7→0 on same cursor';}
    if(rule==='pq'){state={a:String(n),clip_ms:500*n};operation='existing GLB clip position; 500ms per saved sample; not numeric recurrence';}
    if(rule==='groups'){state=groupState(n);operation=n?'one chronological R/S action on each lane; R-only and S-only controls in parallel':'seed (3,1); same carrier copied for comparison';}
    if(rule==='wheels'){state=wheelState(n,config.ratio,config.direction);operation='declared coupled wheel display: thetaA=rateA·phase; thetaB=signedRateB·phase; fixed XIX/outer7 references';}
    const v=BigInt(state.a),identity=rule+(rule==='sumlift'&&config.direction==='counter'?'|counter':'')+'|n'+n;
    return{generation:n,state,operation,size:11,height:7,points:[{x:Number(v%11n),y:Number(v%7n),generation:n,id:identity}],identity,fingerprint:JSON.stringify(state)};
  }
  function start(rule='euler',options={}){if(!RULES.includes(rule))throw Error('Unknown number rule');const config=rule==='wheels'?{world:rule,...wheelConfig(options.ratio,options.direction)}:rule==='sumlift'?jointConfig(options.direction):{world:rule};return isRail(rule)?{schema:'nexah.number-rails/1',config,frames:[railFrame(rule,0,config)],cursor:0}:source.start({world:rule,re:3,im:4})}
  function step(session){if(!isRail(session.config.world))return source.step(session);const s=clone(session);if(s.cursor<s.frames.length-1){s.cursor++;return s}if(s.cursor>=railLimits[s.config.world])throw Error('Rail horizon reached');s.cursor++;s.frames.push(railFrame(s.config.world,s.cursor,s.config));return s}
  function at(session,n){if(!Number.isInteger(n)||n<0||n>=session.frames.length)throw Error('Invalid sequence index');const s=clone(session);s.cursor=n;return s}
  function codec(n){const v=BigInt(n),r=((v%20n)+20n)%20n,q=(v-r)/20n,binary=(v<0n?'-':'')+(v<0n?-v:v).toString(2),back=binary.startsWith('-')?-BigInt('0b'+binary.slice(1)):BigInt('0b'+binary);return{decimal:String(v),binary,q:String(q),r:String(r),exact:back===v&&20n*q+r===v}}
  function contact(frame){const channels=Object.entries(frame.state).filter(([,v])=>/^-?\d+$/.test(String(v))).map(([key,v])=>({key,...codec(v)}));return{scope:'REPRESENTATION_IDENTITY_ONLY',frame_id:frame.identity,fingerprint:frame.fingerprint,channels,status:channels.length&&channels.every(x=>x.exact)?'PASS':'HOLD',vendissimal_X_TOUCH_binding:'OPEN_NOT_RECONSTRUCTED'}}
  function railReplay(s){try{const rule=s.config.world;if(s.schema!=='nexah.number-rails/1'||JSON.stringify(s.config)!==JSON.stringify(rule==='wheels'?{world:rule,...wheelConfig(s.config.ratio,s.config.direction)}:rule==='sumlift'?jointConfig(s.config.direction):{world:rule})||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>=s.frames.length||s.frames.length<1||s.frames.length>railLimits[rule]+1)return{status:'INVALID'};for(let n=0;n<s.frames.length;n++)if(JSON.stringify(s.frames[n])!==JSON.stringify(railFrame(rule,n,s.config)))return{status:'FAIL',generation:n};return{status:'PASS',frames:s.frames.length}}catch{return{status:'INVALID'}}}
  function value(frame,rule){if(rule==='wheels')return '1836 / 1729';if(rule==='groups')return '('+frame.state.rs.x+','+frame.state.rs.y+') / ('+frame.state.sr.x+','+frame.state.sr.y+')';return rule==='euler'?frame.state.re+(frame.state.im<0?' − ':' + ')+Math.abs(frame.state.im)+'i':frame.state.a}
  function point(frame,rule,view,first=0){
    if(!RULES.includes(rule)||!VIEWS.includes(view))throw Error('Unknown number view');
    const g=frame.generation,s=frame.state;
    if(view==='wheels'){const s=rule==='wheels'?frame.state:wheelState(0);const a=s.tick1836/180*2*Math.PI;return[2*Math.cos(a),0,2*Math.sin(a)]}
    if(view==='groups'){const p=rule==='groups'?s.rs:{x:0,y:0};return[p.x/2,0,p.y/2]}
    if(['elevator','joint','mixer','rgb','pq'].includes(view)){const c=codec(rule==='euler'?s.re:s.a);return[(Number(c.r)/19-.5)*4,(g-first)*.15-1,0]}
    if(view==='rails'){const p=frame.points[0];return[(p.x/10-.5)*4,(frame.generation-first)*.15-1,(p.y/6-.5)*3]}
    if(view==='grid'){const p=frame.points[0];return[(p.x/(frame.size-1)-.5)*4,0,(p.y/(frame.height-1)-.5)*4]}
    if(view==='rings'){if(rule==='euler')return[s.re/3,0,s.im/3];const angle=2*Math.PI*Number(BigInt(s.a)%11n)/11;return[2*Math.cos(angle),0,2*Math.sin(angle)]}
    if(view==='spiral'){const angle=rule==='euler'?Math.atan2(4,3)+g*Math.PI/2:g*goldenAngle,r=rule==='euler'?.35+g*.035:.3+Math.log1p(Number(s.a))/Math.max(Math.log1p(832040),Math.log1p(Number(s.a)))*2.5;return[r*Math.cos(angle),0,r*Math.sin(angle)]}
    const angle=rule==='euler'?Math.atan2(s.im,s.re):2*Math.PI*Number(BigInt(s.a)%11n)/11,r=rule==='euler'?1.65:1+Number(BigInt(s.a)%7n)/8;
    return[r*Math.cos(angle),(g-first)*.24-2.5,r*Math.sin(angle)];
  }
  function contract(rule,view,inspection={},config={}){if(!RULES.includes(rule)||!VIEWS.includes(view))throw Error('Unknown contract');return{
    kind:'NUMBER_VIEW_NOT_LIFE_OR_PHYSICAL_DYNAMICS',rule:rule==='euler'?'(a,b) → (−b,a); seed (3,4)':rule==='fibonacci'?'(a,b) → (b,a+b); seed (0,1)':{zero:'a_n=10^(n+1)+1; n=0..7',repunit:'R_k=(10^k−1)/9; a=R_k²; k=1..9',dyadic:'(97·2^n,101·2^n); n=0..16',carrier:'11537 → 11573 → 11357; suffix actions ref:2, rot:2',elevator:'n_i(k)=seed_i+20k; nine supplied seeds; k=0..16; declared game lift',sumlift:'A=1836+11k; B=1729+11k; a=A+B; delta=A−B=107; k=0..16; declared game lift',mixer:'phase=2n degrees; n=0..180; existing layered scene snapshot(counter); declared view-fold stations 0°→78°→33°→7°→0° at phase 0/90/180/270/360; linear between stations; 20-tick crown from same cursor; VIEW_PHASE_AND_FOLD_NOT_NUMBER_RECURRENCE',pq:'source GLB OIL_RIS_ORBITAL_CLOSURE_48S; clip_ms=500n; n=0..96; view animation cursor, not number recurrence',groups:'D4 on integer grid [-4,4]²; seed (3,1); R(x,y)=(-y,x), S(x,y)=(x,-y); chronological alternating lanes R→S and S→R; R-only/S-only controls; n=0..8; not Bench J',wheels:'declared presets 3:2 or 2:3; theta1836=rate1836·phase; theta1729=signedRate1729·phase; ratio/direction in session.config; phase=2n degrees n0..180; not historical reconstruction'}[rule],
    ...(view==='wheels'?{wheel_binding:{presets:['3:2','2:3'],directions:['counter','co'],teeth1836:17,teeth1729:29,fixed_axis:'XIX / 19; vertical display reference, not 19 degrees',outer_reference:'seven fixed divisions, not a third driven wheel',marker_labels:[29,31,33,45,78],boundary:'DECLARED_GAME_MAPPING_NOT_RECOVERED_HISTORICAL_RATE_OR_PHYSICAL_COUPLING'}}:{}),
    ...(view==='groups'?{group_action:{group:'D4 order 8',carrier:'Z² intersect [-4,4]²',seed:[3,1],R:'(x,y)→(-y,x)',S:'(x,y)→(x,-y)',composition:'arrow labels chronological left-to-right, one operator per tick',relations:['R^4=I','S^2=I','S R S=R^-1'],boundary:'EXPLICIT_LOCAL_ACTION_NOT_BENCH_J_OR_UNIVERSAL_RULE_COMPOSER'}}:{}),
    ...(view==='pq'?{source_asset:{path:'assets/3d/nexah_pq_conjugate_orbit_v7.glb',sha256:'c819195b69c1bb9b0513f4d582c80fc5856a2e5415d4fa58c501adb784494fc9',clip:'OIL_RIS_ORBITAL_CLOSURE_48S',duration_ms:48000,source_kind:'CLOCKWORK_CUSTODY_OUTPUT_COPY_ILLUSTRATIVE_NOT_MEASUREMENT'}}:{}),
    ...(view==='rgb'?{view_comparison:{from:'mixer',to:'rgb',selection:'same saved frame, same source snapshot and same lens windows; compare view only, not consecutive phases',I:['full integer/phase state','source pentagon coordinates','intersection geometry','H3 body coordinates','A/B clipping windows','pink reference-point trajectory'],L:['original red/green/violet channel palette replaced; original mixer view remains available'],A:['R/G/B display channels','screen blend on black backdrop'],U:['physical optical meaning','Q°/OI operator identity','pillar/pyramid state mapping'],boundary:'DECLARED_PROPERTY_LEDGER_NOT_UNIVERSAL_OR_PIXEL_VERIFIED_COMPARATOR'}}:{}),
    view,local_palette:rule==='dyadic'?'pink = paired ×2 lane, not global number identity':'declared presentation palette',axes:view==='wheels'?'two rotating divided circles with one base phase; cyan 1836/17 teeth, pink 1729/29 teeth; positive counterclockwise; fixed XIX and outer7; unwrapped signed turns retained; markers are labels not angles':view==='groups'?'shared exact integer plane; cyan chronological R→S lane, pink S→R lane; gold R-only, violet S-only controls; no interpolated arithmetic; at other rules reference seed only':view==='pq'?'existing GLB animation pose at clip_ms/1000 seconds, or 48*cursor/horizon for other rules; native viewer paused and seeked by PLAY; manual camera only; no HZ/FZ bootstrap data':view==='rgb'?'same source mixer snapshot and same declared fold guide; P-A=red, P-B=green, P-C=blue; screen blending in SVG display; no new recurrence or physical light model':view==='mixer'?'existing A0LayeredPentagonScene.snapshot(phase,counter); full three-pentagon intersection, H3 body projection and moving magenta reference point; declared three-axis fold guide 0→78→33→7→0 and 20-tick crown share the phase cursor; fold is a constructed view coordinate, not source deformation, physical time or a Numbers operator':view==='elevator'?'20 columns r=0..19; vertical position q in n=20q+r; nine seeds translated by current lift, selected full integer retained':view==='joint'?'full integer operands and sum; mod-11 projection separate; red/green historical adapter OPEN; coupled +11 is a declared game rule':view==='rails'?'decimal word and exact binary word on separate rails; QRT n=20q+r; X contact checks representation identity only':view==='tower'?'height = sequence index; angle = complex argument / F mod 11; integer radius = 1 + (a mod 7)/8':view==='grid'?'Euler: Re+10, Im+10 on 21×21; integer: a mod 11, a mod 7 on 11×7':view==='spiral'?'Euler: angle arg(3+4i)+g·π/2, radius .35+.035g; integer: angle g·π(3−√5), radius .3+2.5·ln(1+a)/max(ln(1+F30),ln(1+a))':'Euler: complex plane at 1/3 display scale; integer: a mod 11 and a mod 7 on two rings',
    ...(view==='joint'&&inspection.jointModulus!==undefined?{axes:config.direction==='counter'&&rule==='sumlift'?'full integer operands and sum projected onto selected residue circle; A advances +11, B -11, sum constant 3565; channel radii and straight trails are display only':'full integer operands and sum projected onto selected residue circle; A/B advance +11, sum +22; channel radii and straight trails are display only',joint_projection:{modulus:jointProjection(1836,1729,inspection.jointModulus).modulus,embedding:'theta=-2πr/m−π/2 on canvas; front positive counterclockwise; back mirrored view',radii:[.82,.94,1.06],trail:'last up to 14 saved residue states; straight chords not hidden intermediate states',source_scope:'Core circle residue embedding reused as display grammar; stochastic prime transition kernel, C12 Pascal map and CRT validation remain separate',return_boundary:'residue return is not integer or whole-record return'}}:{}),
    ...(rule==='sumlift'&&config.direction==='counter'?{rule:'A=1836+11n; B=1729−11n; sum=3565; delta=107+22n; n=0..16; declared counter-coupling, not reverse playback',joint_coupling:{direction:'counter',signed_steps:[11,-11,0],conserved:'sum=3565',not_conserved:'difference=107+22n',boundary:'Separate retained run; not Flip, inverse playback or physical coupling'}}:{}),
    boundary:'Display coordinates are declared projections, not extra recurrence terms. Full exact state is retained. Orbit moves only camera. Loop replays saved bounded frames, not a mathematical return of Fibonacci.'
  }}
  function legacyReplay(r){try{const rule=r.session.config.world,view=r.display.view;if(!['euler','fibonacci'].includes(rule)||!['rings','spiral','grid','tower'].includes(view))return{status:'INVALID'};const expected=contract(rule,view);delete expected.local_palette;expected.axes={tower:'height = sequence index; angle = complex argument / F mod 11; Fibonacci radius = 1 + (F mod 7)/8',grid:'Euler: Re+10, Im+10 on 21×21; Fibonacci: F mod 11, F mod 7 on 11×7',spiral:'Euler: angle arg(3+4i)+g·π/2, radius .35+.035g; Fibonacci: angle g·π(3−√5), radius .3+2.5·ln(1+F)/ln(1+F30)',rings:'Euler: complex plane at 1/3 display scale; Fibonacci: F mod 11 and F mod 7 on two rings'}[view];if(JSON.stringify(expected)!==JSON.stringify(r.display))return{status:'INVALID'};return source.replay(r.session)}catch{return{status:'INVALID'}}}
  function record(session,view,inspection={side:'front',touch:null}){return{schema:'nexah.game-of-numbers.record/2',session,display:contract(session.config.world,view,inspection,session.config),inspection:clone(inspection)}}
  function replay(r){if(r?.schema==='nexah.game-of-numbers.record/1')return legacyReplay(r);if(r?.schema!=='nexah.game-of-numbers.record/2')return{status:'INVALID'};try{if(JSON.stringify(r.display)!==JSON.stringify(contract(r.session.config.world,r.display.view,r.inspection||{},r.session.config)))return{status:'INVALID'};if(r.inspection){if(!['front','back'].includes(r.inspection.side))return{status:'INVALID'};if(r.inspection.jointModulus!==undefined&&![11,12,13].includes(r.inspection.jointModulus))return{status:'INVALID'};if(r.inspection.aperture!==undefined&&!['all','A','B'].includes(r.inspection.aperture))return{status:'INVALID'};if(r.inspection.touch&&JSON.stringify(r.inspection.touch)!==JSON.stringify(contact(r.session.frames[r.session.cursor])))return{status:'INVALID'}};return isRail(r.session.config.world)?railReplay(r.session):source.replay(r.session)}catch{return{status:'INVALID'}}}
  function elevatorFamily(frame){const lift=BigInt(frame.state.lift||0);return [10537,11357,11537,11573,11735,12537,13571,13573,14357].map(seed=>({seed:String(seed),...codec(BigInt(seed)+lift)}))}
  return{jointConfig,jointProjection,wheelConfig,wheelState,groupAction,groupState,elevatorFamily,mixerFold,MIXER_FOLD_STOPS,VIEWS,RULES,labels,start,step,at,value,point,contract,record,replay,codec,contact,limit:rule=>isRail(rule)?railLimits[rule]:source.worlds[rule].limit};
});
