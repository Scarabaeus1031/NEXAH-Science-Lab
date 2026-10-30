(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0LokiTessarecPipe=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STATIONS=7,ORIENTATIONS=8,RETURN=STATIONS*ORIENTATIONS;
  const mod=(n,m)=>((n%m)+m)%m;
  function state(step,twist=true){const station=mod(step,STATIONS),orientation=twist?mod(step,ORIENTATIONS):0;return Object.freeze({step,station,orientation,bits:orientation.toString(2).padStart(3,'0')});}
  function orbit(twist=true){return Object.freeze(Array.from({length:twist?RETURN:STATIONS},(_,step)=>state(step,twist)));}
  function band28(){return Object.freeze(Array.from({length:28},(_,i)=>Object.freeze({station:i%7,left:(i>>0)&1,right:(i>>1)&1,address:i+1})));}
  function lift56(){return Object.freeze(band28().flatMap(cell=>[0,1].map(cube=>Object.freeze({...cell,cube,liftedAddress:(cell.address-1)*2+cube+1}))));}
  function isPrime(n){if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
  function nthPrime(index){let value=1,count=0;while(count<index){value++;if(isPrime(value))count++;}return value;}
  function m37Probe(){
    const rungs=[2,3,4].map(index=>Object.freeze({index,prime:nthPrime(index),scaled:nthPrime(index)*37}));
    return Object.freeze({
      schema:'nexah.a0.m37-ghostgrid-probe/1',sourceFact:Object.freeze({size:111,factor:37,multiplier:3,square:12321}),rungs:Object.freeze(rungs),step:74,midpoint:185,
      labels:Object.freeze({M37:'LOCAL_MULTIPLIER_OR_MIDDLE_LENS',M_A1Z26:13,C5:'UNDEFINED_COORDINATE_MARKER',D5:'UNDEFINED_DIMENSION_MARKER'}),
      identityReuse:Object.freeze(['GHOSTGRID_ALPHABET_ROTATION_RECONSTRUCTION_AUDIT_2026-09-10','NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK']),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      boundary:'Only 111=3×37 and 111²=3²×37² are source-bound GhostGrid facts. The P2→P4 ladder is an arithmetic comparator. M37, 5C and 5D remain local or undefined labels.'
    });
  }
  function verifyM37(){const p=m37Probe();let checks=0;
    if(p.sourceFact.size!==p.sourceFact.multiplier*p.sourceFact.factor||p.sourceFact.square!==p.sourceFact.size**2)throw new Error('GhostGrid 37 factor');checks++;
    if(p.rungs.map(r=>r.prime).join(',')!=='3,5,7'||p.rungs.map(r=>r.scaled).join(',')!=='111,185,259')throw new Error('P2-P4 ladder');checks++;
    if(p.rungs[1].scaled!==(p.rungs[0].scaled+p.rungs[2].scaled)/2||p.rungs[1].scaled-p.rungs[0].scaled!==74)throw new Error('middle rung');checks++;
    if(nthPrime(12)!==37||p.labels.M_A1Z26===37)throw new Error('typed M/37 separation');checks++;
    if(!p.labels.C5.startsWith('UNDEFINED')||!p.labels.D5.startsWith('UNDEFINED')||p.newCanonicalIds.length||p.relationChanges.length)throw new Error('notation boundary');checks++;
    return Object.freeze({status:'PASS',checks,sourceBound:['111=3×37','111²=3²×37²'],comparator:['P2×37=111','P3×37=185','P4×37=259','Δ=74'],holds:['M37 identity','5C meaning','5D meaning'],newCanonicalIds:[],relationChanges:[]});
  }
  const ROMAN_VALUES=Object.freeze({I:1,V:5,X:10,L:50,C:100,D:500,M:1000});
  function romanDecode(input){
    const text=String(input||'').toUpperCase(),subtractive=Object.freeze({IV:4,IX:9,XL:40,XC:90,CD:400,CM:900});let total=0;
    for(let i=0;i<text.length;i++){const pair=text.slice(i,i+2);if(subtractive[pair]){total+=subtractive[pair];i++;}else if(ROMAN_VALUES[text[i]])total+=ROMAN_VALUES[text[i]];else return NaN;}
    return total;
  }
  function pBreathProbe(){
    const signed=Object.freeze([6,1,0,-1,0,5]),shell=Object.freeze(signed.map(Math.abs));
    const signedCore=signed.reduce((a,b)=>a+b,0),absoluteShell=shell.reduce((a,b)=>a+b,0),mirrorCarrier=Number(String(absoluteShell).split('').reverse().join(''));
    const threadingMask=Object.freeze(signed.map(value=>value===0?0:1)),threadingWord=threadingMask.join('');
    const holdPositions=Object.freeze(signed.flatMap((value,index)=>value===0?[index+1]:[])),counterRotationPositions=Object.freeze(signed.flatMap((value,index)=>value<0?[index+1]:[]));
    return Object.freeze({
      schema:'nexah.a0.p-breath-comparator/2',ownerCode:'CON DAO',signed,shell,signedCore,absoluteShell,mirrorCarrier,delta:absoluteShell-signedCore,midpoint:(signedCore+absoluteShell)/2,
      threading:Object.freeze({mask:threadingMask,word:threadingWord,activeLanes:threadingMask.reduce((a,b)=>a+b,0),holdLanes:holdPositions.length,holdPositions,counterRotationPositions,binaryView:Number.parseInt(threadingWord,2),binaryViewType:'OPTIONAL_VIEW_NOT_IDENTITY'}),
      primeLadder:Object.freeze({signedIndex:5,signedPrime:nthPrime(5),shellIndex:6,shellPrime:nthPrime(6),mirrorIndex:11,mirrorPrime:nthPrime(11)}),
      typeControls:Object.freeze({letterP_A1Z26:16,CONDAO_A1Z26:52,P6:'UNDEFINED_UNLESS_TYPED_AS_PRIME_INDEX'}),
      identityReuse:Object.freeze(['NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK','ART:A0:MATHEMATICAL_JOINTS']),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      boundary:'The declared owner code has signed sum 11, absolute shell 13, decimal digit reversal 31 and a typed activity mask 110101 with holds at lanes 3 and 5. The negative lane at position 4 is the sole display counter-rotation; converting -1 to +1 explains the shell lift by 2. HOLD is not temporal stutter without a declared clock. This is a finite arithmetic and display comparator, not a biological breath, anatomical pineal mechanism, A1Z26 decoding, physical field or canonical relation.'
    });
  }
  function verifyPBreath(){const p=pBreathProbe();let checks=0;
    if(p.signedCore!==11||p.absoluteShell!==13||p.delta!==2||p.midpoint!==12)throw new Error('signed core / absolute shell');checks++;
    if(p.primeLadder.signedPrime!==11||p.primeLadder.shellPrime!==13||p.primeLadder.mirrorPrime!==31)throw new Error('prime ladder 5/6/11');checks++;
    if(p.mirrorCarrier!==31||Number(String(p.mirrorCarrier).split('').reverse().join(''))!==13)throw new Error('13/31 digit return');checks++;
    if(p.typeControls.letterP_A1Z26!==16||p.typeControls.CONDAO_A1Z26!==52)throw new Error('A1Z26 type controls');checks++;
    if(p.midpoint===p.mirrorCarrier||p.typeControls.P6!=='UNDEFINED_UNLESS_TYPED_AS_PRIME_INDEX')throw new Error('center and P6 guards');checks++;
    if(p.threading.word!=='110101'||p.threading.activeLanes!==4||p.threading.holdLanes!==2)throw new Error('threading mask');checks++;
    if(p.threading.holdPositions.join(',')!=='3,5'||p.threading.counterRotationPositions.join(',')!=='4')throw new Error('hold / counter-rotation lanes');checks++;
    if(p.threading.binaryView!==53||p.threading.binaryViewType!=='OPTIONAL_VIEW_NOT_IDENTITY')throw new Error('binary view guard');checks++;
    if(p.newCanonicalIds.length||p.relationChanges.length)throw new Error('identity boundary');checks++;
    return Object.freeze({status:'PASS_BOUNDED_P_BREATH_COMPARATOR',checks,exact:['signed sum=11=p5','absolute sum=13=p6','reverse(13)=31=p11','delta=2','midpoint(11,13)=12','thread mask=110101','holds at lanes 3 and 5','counter-rotation at lane 4'],holds:['temporal stutter without clock','biological breath','pineal mechanism','CON DAO A1Z26 identity','P6 untyped identity'],newCanonicalIds:[],relationChanges:[]});
  }
  function m11PrimeFoldProbe(){
    const glyph=Object.freeze([[-1,-1],[-1,1],[0,-1],[1,1],[1,-1]].map(([x,y])=>Object.freeze({x,y})));
    return Object.freeze({
      schema:'nexah.a0.m11-prime-fold-roman-control/1',glyph,
      primeBridge:Object.freeze({index:5,prime:nthPrime(5),romanIndex:'V',decimalPrime:11,romanPrime:'XI'}),
      roman:Object.freeze({I:1,V:5,X:10,L:50,C:100,D:500,M:1000,XC:90}),
      geometry:Object.freeze({LAngleDegrees:90,outerPillars:2,centerFold:'V',mirrorAxis:'x=0'}),
      scale:Object.freeze({D_over_L:10,M_over_D:2,M_over_L:20}),
      topology:Object.freeze({carrier:'OPEN_POLYLINE',edgeIdentification:'UNDEFINED',halfTwists:'UNDEFINED',moebiusResult:'OPEN'}),
      identityReuse:Object.freeze(['NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK','ART:A0:MATHEMATICAL_JOINTS']),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      boundary:'p5=11, the M mirror geometry, L=50, the 90 degree L-angle, XC=90, D=500 and M=1000 are typed facts. They are not one equality. The open M polyline does not establish a Moebius strip or a Lissajous generator.'
    });
  }
  function verifyM11PrimeFold(){const p=m11PrimeFoldProbe();let checks=0;
    if(p.primeBridge.prime!==11||p.primeBridge.index!==romanDecode('V')||romanDecode('XI')!==11)throw new Error('p5=11 bridge');checks++;
    const set=new Set(p.glyph.map(q=>`${q.x}:${q.y}`));if(!p.glyph.every(q=>set.has(`${-q.x}:${q.y}`)))throw new Error('M mirror set');checks++;
    const a={x:0,y:1},b={x:1,y:0};if(a.x*b.x+a.y*b.y!==0||p.geometry.LAngleDegrees!==90)throw new Error('L right angle');checks++;
    if(romanDecode('L')!==50||romanDecode('XC')!==90||romanDecode('D')!==500||romanDecode('M')!==1000)throw new Error('Roman controls');checks++;
    if(p.roman.D/p.roman.L!==10||p.roman.M/p.roman.D!==2||p.roman.M/p.roman.L!==20)throw new Error('Roman scale');checks++;
    if(p.topology.moebiusResult!=='OPEN'||p.topology.edgeIdentification!=='UNDEFINED')throw new Error('topology hold');checks++;
    if(p.newCanonicalIds.length||p.relationChanges.length)throw new Error('identity boundary');checks++;
    return Object.freeze({status:'PASS_WITH_TOPOLOGY_HOLD',checks,exact:['p5=11','V=5','XI=11','L=50','angle(L)=90°','XC=90','D=500','M=1000','D=10L','M=2D=20L'],holds:['Moebius edge identification','Lissajous generator'],newCanonicalIds:[],relationChanges:[]});
  }
  function verify(){
    const full=orbit(true),control=orbit(false),keys=full.map(s=>`${s.station}:${s.orientation}`);let checks=0;
    if(new Set(keys).size!==56)throw new Error('56-state uniqueness');checks++;
    if(state(56).station!==0||state(56).orientation!==0)throw new Error('56-step return');checks++;
    if(state(7).station!==0||state(7).orientation!==7||state(8).station!==1||state(8).orientation!==0)throw new Error('coprime seam');checks++;
    if(control.length!==7||new Set(control.map(s=>`${s.station}:${s.orientation}`)).size!==7)throw new Error('negative control');checks++;
    if(band28().length!==28||lift56().length!==56||new Set(lift56().map(x=>x.liftedAddress)).size!==56)throw new Error('28-to-56 lift');checks++;
    if(5.5+5.5!==11||5+6!==11)throw new Error('typed eleven comparators');checks++;
    return Object.freeze({status:'PASS',checks,orbitLength:56,negativeControlLength:7,band:28,lift:56,identityReuse:['NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK','MOD:TESSAREC','ART:A0:MATHEMATICAL_JOINTS'],newCanonicalIds:[],relationChanges:[],claimCeiling:'BOUNDED_DISPLAY_TEST'});
  }
  const svg=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
  function renderSheet(stage,active){stage.replaceChildren();for(let r=0;r<7;r++)for(let c=0;c<7;c++){const held=r===3,g=svg('g',{transform:`translate(${34+c*42} ${22+r*34})`,class:`lp-cell ${held?'held':''} ${held&&c===active.station?'active':''}`});const rect=svg('rect',{width:32,height:25,rx:4}),t=svg('text',{x:16,y:17,'text-anchor':'middle'});t.textContent=held?c+1:'·';g.append(rect,t);stage.append(g);}const label=svg('text',{x:18,y:278,class:'lp-caption'});label.textContent='7×7 SOURCE SHEET · CENTER ROW HELD AS SUGAR-STICK AXIS';stage.append(label);}
  function renderBand(stage,active){stage.replaceChildren();band28().forEach((cell,i)=>{const x=22+cell.station*40,y=22+(cell.left*2+cell.right)*42,g=svg('g',{transform:`translate(${x} ${y})`,class:`lp-cell ${cell.station===active.station?'active':''}`}),rect=svg('rect',{width:31,height:31,rx:4}),t=svg('text',{x:15.5,y:20,'text-anchor':'middle'});t.textContent=`${cell.left}${cell.right}`;g.append(rect,t);stage.append(g);});const label=svg('text',{x:18,y:208,class:'lp-caption'});label.textContent='2×7×2 = 28 · TWO HINGE BITS AROUND SEVEN STATIONS';stage.append(label);}
  function renderPipe(stage,active){stage.replaceChildren();const cy=130;for(let s=0;s<7;s++){const x=34+s*45;stage.append(svg('line',{x1:x,y1:28,x2:x,y2:232,class:s===active.station?'lp-axis active':'lp-axis'}));for(let o=0;o<8;o++){const a=2*Math.PI*o/8,yy=cy+78*Math.sin(a),r=(s===active.station&&o===active.orientation)?7:3;stage.append(svg('circle',{cx:x,cy:yy,r,class:(s===active.station&&o===active.orientation)?'lp-node active':'lp-node'}));}}const route=`${orbit(true).map((p,i)=>{const x=34+p.station*45,y=cy+78*Math.sin(2*Math.PI*p.orientation/8);return`${i?'L':'M'}${x} ${y}`;}).join(' ')} Z`;stage.insertBefore(svg('path',{d:route,class:'lp-route'}),stage.firstChild);const axis=svg('line',{x1:18,y1:cy,x2:322,y2:cy,class:'lp-stick'}),label=svg('text',{x:18,y:258,class:'lp-caption'});label.textContent='LOKI LOCAL TWIST · ONE COPRIME ORBIT · RETURN AFTER 56';stage.append(axis,label);}
  function renderM37(stage,active=3){stage.replaceChildren();const probe=m37Probe(),max=259;probe.rungs.forEach((r,i)=>{const x=88+i*190,w=112,h=190*r.scaled/max,y=238-h,g=svg('g',{class:`m37-rung ${active===r.index?'active':''}`}),bar=svg('rect',{x,y,width:w,height:h,rx:8}),p=svg('text',{x:x+w/2,y:y-34,'text-anchor':'middle',class:'prime'}),v=svg('text',{x:x+w/2,y:y-12,'text-anchor':'middle',class:'value'}),formula=svg('text',{x:x+w/2,y:264,'text-anchor':'middle',class:'formula'});p.textContent=`P${r.index} = ${r.prime}`;v.textContent=String(r.scaled);formula.textContent=`${r.prime} × 37`;g.append(bar,p,v,formula);stage.append(g);});stage.append(svg('line',{x1:250,y1:98,x2:250,y2:236,class:'m37-middle'}));const delta1=svg('text',{x:217,y:290,'text-anchor':'middle',class:'delta'}),delta2=svg('text',{x:407,y:290,'text-anchor':'middle',class:'delta'});delta1.textContent='Δ74';delta2.textContent='Δ74';stage.append(delta1,delta2);}
  function renderM11(stage,mode='GLYPH'){
    stage.replaceChildren();const label=(x,y,value,klass='m11-label')=>{const t=svg('text',{x,y,'text-anchor':'middle',class:klass});t.textContent=value;stage.append(t);};
    if(mode==='GLYPH'){
      stage.append(svg('line',{x1:325,y1:28,x2:325,y2:270,class:'m11-axis'}));
      stage.append(svg('path',{d:'M125 250 L125 55 L325 250 L525 55 L525 250',class:'m11-glyph'}));
      label(125,36,'I');label(325,286,'V FOLD');label(525,36,'I');label(325,20,'M = MIRROR-SET');
    }else if(mode==='PRIME'){
      stage.append(svg('line',{x1:120,y1:150,x2:530,y2:150,class:'m11-bridge'}));
      [['V','5',120],['p₅','11',325],['XI','11',530]].forEach(([top,bottom,x])=>{stage.append(svg('circle',{cx:x,cy:150,r:46,class:'m11-node'}));label(x,143,top,'m11-symbol');label(x,167,bottom,'m11-value');});
      label(222,132,'PRIME INDEX');label(428,132,'ROMAN RETURN');label(325,245,'p₅ = 11 · V = 5 · XI = 11','m11-proof');
    }else if(mode==='ROMAN'){
      const items=[['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]],max=1000;
      items.forEach(([symbol,value],i)=>{const x=48+i*86,h=30+165*Math.log10(value+1)/Math.log10(max+1),y=235-h;stage.append(svg('rect',{x,y,width:55,height:h,rx:5,class:'m11-bar'}));label(x+27.5,y-9,symbol,'m11-symbol');label(x+27.5,257,String(value),'m11-value');});
      label(325,286,'×5, ×2, ×5, ×2, ×5, ×2','m11-proof');
    }else if(mode==='ANGLE'){
      stage.append(svg('path',{d:'M145 70 L145 235 L310 235',class:'m11-l'}));stage.append(svg('path',{d:'M365 72 C500 72 500 235 365 235 Z',class:'m11-d'}));
      label(145,48,'L = 50');label(240,216,'90°','m11-value');label(430,48,'D = 500');label(325,286,'D = 10·L · M = 2·D = 20·L','m11-proof');
    }else{
      const p=pBreathProbe(),nodes=[['SIGNED CORE',p.signedCore,'p₅',130],['ABS SHELL',p.absoluteShell,'p₆',325],['MIRROR',p.mirrorCarrier,'p₁₁',520]];
      stage.append(svg('path',{d:'M130 112 H325 M325 112 H520',class:'m11-breath-route'}));
      nodes.forEach(([name,value,prime,x])=>{stage.append(svg('circle',{cx:x,cy:112,r:54,class:'m11-breath-node'}));label(x,92,name,'m11-breath-name');label(x,124,String(value),'m11-breath-value');label(x,148,prime,'m11-breath-prime');});
      label(227,102,'COUNTER −1→+1 · Δ2');label(422,102,'DIGIT REVERSE');
      p.signed.forEach((value,i)=>{const x=112+i*86,y=230,h=Math.abs(value)*8,klass=value<0?'m11-breath-bar negative':'m11-breath-bar';stage.append(svg('line',{x1:x,y1:y,x2:x,y2:y-(value<0?-h:h),class:klass}));label(x,263,value>0?`+${value}`:String(value),'m11-value');});
      label(325,282,'THREAD 110101 · HOLD@3,5 · COUNTER@4','m11-proof');
      label(325,302,'Σ signed = 11 · Σ |·| = 13 · reverse(13) = 31','m11-proof');
    }
  }
  function mount(scope=document){const root=scope.querySelector?.('#lokiTessarecPipeTest');if(!root)return null;const sheet=root.querySelector('[data-lp-sheet]'),band=root.querySelector('[data-lp-band]'),pipe=root.querySelector('[data-lp-pipe]'),out=root.querySelector('[data-lp-output]');let step=0,timer=null;
    const paint=()=>{const s=state(step);renderSheet(sheet,s);renderBand(band,s);renderPipe(pipe,s);root.querySelector('[data-lp-step]').textContent=String(step).padStart(2,'0');root.querySelector('[data-lp-station]').textContent=String(s.station+1);root.querySelector('[data-lp-orientation]').textContent=`${s.orientation} · ${s.bits}`;root.querySelector('[data-lp-progress]').style.width=`${100*step/56}%`;out.textContent=step===56?'EXACT RETURN · (0,0) AFTER 56 STEPS':`STATE ${step}/56 · S${s.station+1} · O${s.orientation} (${s.bits}) · ${56-step} TO RETURN`;return s;};
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}root.querySelector('[data-lp-play]').textContent='PLAY 56';};
    root.querySelector('[data-lp-next]').addEventListener('click',()=>{stop();step=(step+1)%57;paint();});
    root.querySelector('[data-lp-return]').addEventListener('click',()=>{stop();step=56;paint();});
    root.querySelector('[data-lp-reset]').addEventListener('click',()=>{stop();step=0;paint();});
    root.querySelector('[data-lp-play]').addEventListener('click',e=>{if(timer){stop();return;}step=0;e.currentTarget.textContent='PAUSE';paint();timer=setInterval(()=>{step++;paint();if(step===56)stop();},90);});
    const m37=root.querySelector('[data-m37-grid]'),m37Out=root.querySelector('[data-m37-output]');if(m37){let rung=3;const paintM37=()=>{renderM37(m37,rung);const p=m37Probe(),r=p.rungs.find(x=>x.index===rung);m37Out.textContent=rung===2?'SOURCE PASS · P2=3 · 3×37=111 · 111²=12321':rung===3?'MIDDLE PASS · P3=5 · 5×37=185 · Δ74 / Δ74':`COMPARATOR PASS · P4=7 · 7×37=259 · GHOSTGRID SOURCE BINDING OPEN`;root.querySelectorAll('[data-m37-rung]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.m37Rung===rung)));};root.querySelectorAll('[data-m37-rung]').forEach(b=>b.addEventListener('click',()=>{rung=+b.dataset.m37Rung;paintM37();}));paintM37();}
    const m11=root.querySelector('[data-m11-stage]'),m11Out=root.querySelector('[data-m11-output]');if(m11){let mode='GLYPH';const messages={GLYPH:'MIRROR PASS · TWO I-PILLARS · CENTER V-FOLD · AXIS x=0',PRIME:'PRIME PASS · V=5 · p₅=11 · XI=11',ROMAN:'ROMAN PASS · I V X L C D M · ALTERNATING ×5 / ×2',ANGLE:'TYPE PASS · L=50 · ∠L=90° · XC=90 · D=500',BREATH:'P-BREATH PASS · THREAD 110101 · HOLD@3,5 · COUNTER@4 · 11→13→31 · SEHNE/TAN HOLD'};const paintM11=()=>{renderM11(m11,mode);m11Out.textContent=messages[mode];root.querySelectorAll('[data-m11-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m11View===mode)));};root.querySelectorAll('[data-m11-view]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.m11View;paintM11();}));paintM11();}
    paint();return{paint,verify,verifyM37,verifyM11PrimeFold};
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document));
  return Object.freeze({STATIONS,ORIENTATIONS,RETURN,state,orbit,band28,lift56,isPrime,nthPrime,romanDecode,pBreathProbe,verifyPBreath,m37Probe,verifyM37,m11PrimeFoldProbe,verifyM11PrimeFold,verify,mount});
});
