(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0ObserverJourney=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const timerHost=typeof globalThis!=='undefined'?globalThis:this;
  const STATIONS=Object.freeze([
    Object.freeze({id:'source',label:'SOURCE',angle:'0°',view:'NEWTON',selector:'#journeySource'}),
    Object.freeze({id:'relation',label:'RELATION',angle:'90°',view:'LEIBNIZ',selector:'#journeyRelation'}),
    Object.freeze({id:'boundary',label:'BOUNDARY',angle:'180°',view:'GOETHE',selector:'#journeyBoundary'}),
    Object.freeze({id:'fold',label:'FOLD',angle:'270°',view:'Q°',selector:'#doublePentagonBook'}),
    Object.freeze({id:'return',label:'RETURN',angle:'360° ≡ 0°',view:'OPEN CUBE',selector:'#openCubeStage'})
  ]);
  const CLOCK_RHYTHM=Object.freeze([5,4,3,2,1]);
  const TOUR_TIMING=Object.freeze({breathMs:4200,overviewMs:3600,stationMs:3300});
  const TOUR_SEQUENCE=Object.freeze([
    Object.freeze({phase:'breathe',station:0,focus:true,holdLens:false,label:'PYRAMID BREATH / α SWEEP'}),
    Object.freeze({phase:'overview',station:0,focus:false,holdLens:false,label:'THREE WINDOWS'}),
    Object.freeze({phase:'vertical',station:0,focus:true,holdLens:false,label:'VERTICAL SOURCE'}),
    Object.freeze({phase:'station',station:1,focus:true,holdLens:false,label:'RELATION'}),
    Object.freeze({phase:'station',station:2,focus:true,holdLens:false,label:'BOUNDARY'}),
    Object.freeze({phase:'handoff',station:3,focus:true,holdLens:true,label:'FOLD BELOW'}),
    Object.freeze({phase:'handoff',station:4,focus:true,holdLens:true,label:'RETURN BELOW'})
  ]);
  const SCORE_STATIONS=Object.freeze([
    Object.freeze({id:'source',frequencyHz:220,relationHz:0,filterHz:5200,dry:.13,return:.01,delay:.18,bandCount:1,bandMode:'single carrier',label:'FUNDAMENTAL / DRY'}),
    Object.freeze({id:'relation',frequencyHz:220,relationHz:223,filterHz:4200,dry:.11,return:.025,delay:.21,bandCount:2,bandMode:'paired traces',label:'PAIR / 3 Hz BEAT'}),
    Object.freeze({id:'boundary',frequencyHz:196,relationHz:294,filterHz:720,dry:.10,return:.04,delay:.24,bandCount:3,bandMode:'aperture selection',label:'FILTER / SHADOW'}),
    Object.freeze({id:'fold',frequencyHz:164.81,relationHz:247,filterHz:1500,dry:.08,return:.13,delay:.34,bandCount:5,bandMode:'layered neon fold',label:'DELAYED RETURN'}),
    Object.freeze({id:'return',frequencyHz:220,relationHz:440,filterHz:2800,dry:.055,return:.09,delay:.30,bandCount:1,bandMode:'one carrier + four tails',label:'RESOLVE / TAIL → SILENCE'})
  ]);
  function stationAt(input){
    const index=Math.max(0,Math.min(STATIONS.length-1,Math.round(Number(input)||0)));
    return Object.freeze({index,...STATIONS[index]});
  }
  function statusAt(input){const s=stationAt(input);return `${String(s.index+1).padStart(2,'0')} / 05 · ${s.label} · ${s.angle} · ${s.view}`}
  function clockAt(input){
    const state=stationAt(input);
    return Object.freeze({index:state.index,countdown:CLOCK_RHYTHM[state.index],anchor:'Q',plusOne:true,role:'READING_CLOCK_NOT_TIME_MEASUREMENT'});
  }
  function scoreAt(input){
    const station=stationAt(input),score=SCORE_STATIONS[station.index];
    return Object.freeze({index:station.index,station:station.id,...score,role:'INTERFACE_SONIFICATION_NOT_SOUND_IN_SPACE'});
  }
  function createScorePanel(rootNode,documentNode){
    const panel=documentNode.createElement('section');
    panel.className='journey-score';
    panel.dataset.journeyScore='off';
    panel.setAttribute('aria-label','Tour-Soundtrack der fünf Lesestationen mit manuellem Mute-Schalter');
    panel.innerHTML='<button type="button" data-journey-score-toggle aria-pressed="false"><b>SOUND / SCORE</b><span>OFF</span></button><div class="journey-score-readout"><small>TOUR SONIFICATION</small><output data-journey-score-frequency>f_z —</output><b data-journey-score-label>READY / STARTS WITH TOUR</b></div><div class="journey-nbands" aria-label="n-Bands: variable Display-Schichtung innerhalb der Pyramide"><div class="journey-nbands-head"><b data-score-bands>n-BANDS · 1 / 5</b><span data-score-band-mode>SINGLE CARRIER</span></div><svg viewBox="0 0 280 62" role="img" aria-label="Fünf mögliche Anzeige-Spuren in einer schematischen Pyramide"><path class="nband-pyramid" d="M140 3 L274 57 H6 Z"></path><g class="nband-lines"><path data-n-band="1" d="M18 31 C66 5 105 53 140 31 S214 5 262 31"></path><path data-n-band="2" d="M18 25 C66 -1 105 47 140 25 S214 -1 262 25"></path><path data-n-band="3" d="M18 37 C66 11 105 59 140 37 S214 11 262 37"></path><path data-n-band="4" d="M34 19 C74 0 108 40 140 19 S206 0 246 19"></path><path data-n-band="5" d="M34 43 C74 24 108 61 140 43 S206 24 246 43"></path></g><line class="nband-aperture" x1="140" y1="9" x2="140" y2="54"></line><circle class="nband-carrier" cx="140" cy="31" r="3.4"></circle></svg></div><div class="journey-score-mix"><span data-score-dry>DRY · —</span><span data-score-return>RETURN · —</span></div><p><strong>PLAY TOUR</strong> startet Bild und Score gemeinsam; am Return blendet der Sound weich aus. Der Schalter bleibt als Mute verfügbar. Kein Schall im Weltraum; <em>Echo</em> bedeutet hier nur verzögerten hörbaren Return. <strong>n-BANDS</strong> sind eine variable Display-Schichtung — nicht Newtons sieben Wellenlängen, keine Lichtschichten und keine Ausführung des historischen, testpflichtigen n-band-Kandidaten.</p>';
    const footer=rootNode.querySelector('.journey-footer');
    if(footer)footer.insertAdjacentElement('afterend',panel);else rootNode.appendChild(panel);
    return panel;
  }
  function createAudioScore(windowNode){
    const AudioContext=windowNode&&(windowNode.AudioContext||windowNode.webkitAudioContext);
    let context=null,master=null,filter=null,dryGain=null,returnGain=null,feedback=null,delay=null,primary=null,relation=null,primaryGain=null,relationGain=null,enabled=false;
    function set(param,value,seconds=.08){
      if(!context||!param)return;
      param.cancelScheduledValues(context.currentTime);
      param.setTargetAtTime(value,context.currentTime,seconds);
    }
    function ensure(){
      if(context||!AudioContext)return Boolean(context);
      context=new AudioContext();master=context.createGain();filter=context.createBiquadFilter();dryGain=context.createGain();returnGain=context.createGain();feedback=context.createGain();delay=context.createDelay(1);primary=context.createOscillator();relation=context.createOscillator();primaryGain=context.createGain();relationGain=context.createGain();
      primary.type='sine';relation.type='triangle';filter.type='lowpass';master.gain.value=0;primaryGain.gain.value=1;relationGain.gain.value=0;feedback.gain.value=.18;delay.delayTime.value=.2;
      primary.connect(primaryGain);relation.connect(relationGain);primaryGain.connect(filter);relationGain.connect(filter);filter.connect(dryGain);dryGain.connect(master);filter.connect(delay);delay.connect(returnGain);returnGain.connect(master);returnGain.connect(feedback);feedback.connect(delay);master.connect(context.destination);primary.start();relation.start();
      return true;
    }
    async function setEnabled(next,fadeSeconds=.04){
      enabled=Boolean(next);
      if(enabled&&ensure()){
        if(context.state==='suspended')await context.resume();
        set(master.gain,.42,fadeSeconds);
      }else if(context){set(master.gain,0,fadeSeconds)}
      return enabled&&Boolean(context);
    }
    function apply(index){
      const score=scoreAt(index);
      if(!enabled||!ensure())return score;
      set(primary.frequency,score.frequencyHz,.035);set(relation.frequency,score.relationHz||score.frequencyHz,.035);set(relationGain.gain,score.relationHz?.55:0,.06);set(filter.frequency,score.filterHz,.08);set(dryGain.gain,score.dry,.08);set(returnGain.gain,score.return,.1);set(delay.delayTime,score.delay,.08);set(feedback.gain,score.id==='fold'?.26:.16,.1);set(master.gain,.42,.04);
      return score;
    }
    function fadeOut(seconds=1.6){
      enabled=false;
      if(context&&master){
        const now=context.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value,now);
        master.gain.linearRampToValueAtTime(0,now+seconds);
      }
      return false;
    }
    function suspend(){if(context)set(master.gain,0,.04)}
    function state(){return Object.freeze({enabled,available:Boolean(AudioContext),contextState:context?context.state:'uncreated'})}
    return Object.freeze({setEnabled,apply,fadeOut,suspend,state});
  }
  function mount(rootNode,doc){
    if(!rootNode)return null;
    const documentNode=doc||rootNode.ownerDocument;
    const buttons=[...rootNode.querySelectorAll('[data-journey-target]')];
    const marker=rootNode.querySelector('[data-journey-marker]');
    const status=rootNode.querySelector('[data-journey-status]');
    const lightSegments=[...rootNode.querySelectorAll('[data-journey-lightbar] i')];
    const clockNodes=[...rootNode.querySelectorAll('[data-journey-clock-node]')];
    const countdownOut=rootNode.querySelector('[data-journey-countdown]');
    const previousButton=rootNode.querySelector('[data-journey-prev]');
    const nextButton=rootNode.querySelector('[data-journey-next]');
    const tourButton=rootNode.querySelector('[data-journey-tour]');
    const deeperLink=rootNode.querySelector('[data-journey-deeper]');
    const sweepButton=documentNode.querySelector('#playButton');
    const instrument=documentNode.querySelector('#lens');
    const transitionStage=documentNode.querySelector('[data-journey-transition]');
    const transitionKicker=transitionStage&&transitionStage.querySelector('[data-transition-kicker]');
    const transitionTitle=transitionStage&&transitionStage.querySelector('[data-transition-title]');
    const transitionCopy=transitionStage&&transitionStage.querySelector('[data-transition-copy]');
    const transitionRole=transitionStage&&transitionStage.querySelector('[data-transition-role]');
    const scorePanel=createScorePanel(rootNode,documentNode);
    const scoreToggle=scorePanel.querySelector('[data-journey-score-toggle]');
    const scoreFrequency=scorePanel.querySelector('[data-journey-score-frequency]');
    const scoreLabel=scorePanel.querySelector('[data-journey-score-label]');
    const scoreBands=scorePanel.querySelector('[data-score-bands]');
    const scoreBandMode=scorePanel.querySelector('[data-score-band-mode]');
    const bandLines=[...scorePanel.querySelectorAll('[data-n-band]')];
    const scoreDry=scorePanel.querySelector('[data-score-dry]');
    const scoreReturn=scorePanel.querySelector('[data-score-return]');
    const audioScore=createAudioScore(documentNode.defaultView||(typeof globalThis!=='undefined'?globalThis:null));
    let active=0,mode='overview',touring=false,tourTimer=0,tourToken=0,tourOwnsSweep=false,tourAudioRequested=false;
    function syncScoreToggle(activeAudio){
      scoreToggle.setAttribute('aria-pressed',String(activeAudio));
      scoreToggle.querySelector('span').textContent=activeAudio?'ON':'OFF';
      scorePanel.dataset.journeyScore=activeAudio?'on':'off';
    }
    async function setScoreEnabled(next,fadeSeconds=.04){
      const activeAudio=await audioScore.setEnabled(next,fadeSeconds);
      syncScoreToggle(activeAudio);
      if(activeAudio)audioScore.apply(active);else scoreLabel.textContent=`${scoreAt(active).label} / MUTED`;
      return activeAudio;
    }
    function fadeTourScore(seconds=1.6){
      tourAudioRequested=false;
      audioScore.fadeOut(seconds);
      syncScoreToggle(false);
      scorePanel.dataset.journeyScore='fadeout';
      scoreLabel.textContent=`${scoreAt(active).label} / FADING OUT`;
    }
    function startTourSweep(){
      if(sweepButton&&!sweepButton.classList.contains('active')){sweepButton.click();tourOwnsSweep=true}
    }
    function stopTourSweep(){
      if(tourOwnsSweep&&sweepButton&&sweepButton.classList.contains('active'))sweepButton.click();
      tourOwnsSweep=false;
    }
    function render(index,focusPanel,holdLensFocus){
      const state=stationAt(index),clock=clockAt(index),score=scoreAt(index);active=state.index;
      mode=focusPanel===false?'overview':'station';
      rootNode.style.setProperty('--journey-position',`${10+state.index*20}%`);
      if(marker)marker.dataset.station=state.id;
      if(status)status.textContent=mode==='overview'?'OVERVIEW · THREE WINDOWS · STATIONS READY':statusAt(state.index);
      buttons.forEach((button,i)=>{
        const journeyState=i<state.index?'complete':i===state.index?'active':'upcoming';
        button.setAttribute('aria-current',i===state.index?'step':'false');
        button.dataset.journeyState=journeyState;
      });
      lightSegments.forEach((segment,i)=>segment.dataset.state=i<state.index?'complete':i===state.index?'active':'upcoming');
      clockNodes.forEach((node,i)=>node.dataset.state=i<state.index?'complete':i===state.index?'active':'upcoming');
      if(countdownOut)countdownOut.textContent=String(clock.countdown);
      if(previousButton)previousButton.disabled=touring||state.index===0;
      if(nextButton){nextButton.disabled=touring||state.index===STATIONS.length-1;nextButton.textContent=state.index===STATIONS.length-1?'RETURNED':'WEITER →'}
      const panels=[...documentNode.querySelectorAll('[data-journey-panel]')];
      const isPanel=state.index<3&&focusPanel!==false;
      const isTransition=state.index>=3&&focusPanel!==false;
      const panelStation=state.index<3?state.id:'boundary';
      instrument&&instrument.classList.toggle('journey-has-focus',isPanel||isTransition);
      instrument&&instrument.classList.toggle('journey-has-transition',isTransition);
      panels.forEach(panel=>{
        const selected=isPanel&&panel.dataset.journeyPanel===panelStation;
        panel.classList.toggle('journey-focus',selected);
        panel.hidden=isPanel&&!selected;
      });
      if(transitionStage){
        transitionStage.hidden=!isTransition;
        transitionStage.dataset.transitionState=state.id;
        if(isTransition&&state.id==='fold'){
          transitionKicker.textContent='04 · FOLD · 270° · Q°';
          transitionTitle.textContent='Die Fläche faltet sich zur Gegenansicht.';
          transitionCopy.textContent='Zwei Leseseiten teilen eine Naht. Die verschlungenen Schleifen zeigen eine deklarierte Hopf-Fold-Projektion – keine zusätzliche Raumdimension.';
          transitionRole.textContent='FOLD / COUNTERFACE';
        }
        if(isTransition&&state.id==='return'){
          transitionKicker.textContent='05 · RETURN · 360° ≡ 0°';
          transitionTitle.textContent='Die Schleife schließt die Adresse.';
          transitionCopy.textContent='Die Neon-Brezel kehrt zum gehaltenen Q-Anker zurück. Zustandsadresse und Orientierung schließen gemeinsam; die Perspektive bleibt untersuchbar.';
          transitionRole.textContent='RETURN / ADDRESS CLOSED';
        }
      }
      rootNode.dataset.activeStation=state.id;
      rootNode.dataset.iotaCountdown=String(clock.countdown);
      rootNode.dataset.journeyMode=mode;
      documentNode.body.dataset.observerJourney=state.id;
      documentNode.body.dataset.observerJourneyMode=mode;
      scorePanel.dataset.station=score.id;
      scoreFrequency.textContent=`f_z ${score.frequencyHz.toFixed(score.frequencyHz%1?2:0)} Hz`;
      scoreLabel.textContent=score.label;
      scoreBands.textContent=`n-BANDS · ${score.bandCount} / 5`;
      scoreBandMode.textContent=score.bandMode.toUpperCase();
      bandLines.forEach((line,i)=>{line.dataset.state=i<score.bandCount?'active':score.id==='return'?'tail':'held'});
      scoreDry.textContent=`DRY · ${Math.round(score.dry*100)}%`;
      scoreReturn.textContent=`RETURN · ${Math.round(score.return*100)}% / ${Math.round(score.delay*1000)} ms`;
      audioScore.apply(state.index);
      documentNode.dispatchEvent(new CustomEvent('a0:observer-journey-change',{detail:Object.freeze({...state,mode,clock,score})}));
      return state;
    }
    function stopTour(resetLabel){
      const wasTouring=touring;
      tourToken+=1;
      if(tourTimer)timerHost.clearTimeout(tourTimer);
      tourTimer=0;touring=false;rootNode.dataset.touring='false';rootNode.dataset.tourPhase='paused';
      stopTourSweep();
      if(wasTouring&&tourAudioRequested)fadeTourScore(.28);
      if(tourButton&&resetLabel!==false)tourButton.innerHTML='<span>▶</span><b>PLAY TOUR</b><small>ATEM → 3 FENSTER → EINZELN → RETURN</small>';
      render(active,true,active>=3);
    }
    function runTour(){
      stopTour(false);touring=true;rootNode.dataset.touring='true';
      tourAudioRequested=true;
      void setScoreEnabled(true);
      startTourSweep();
      if(deeperLink)deeperLink.hidden=true;
      if(tourButton)tourButton.innerHTML='<span>■</span><b>PAUSE TOUR</b><small>CLOCK + PRISM RUNNING</small>';
      rootNode.scrollIntoView({behavior:'smooth',block:'start'});
      const token=++tourToken;
      function phaseAt(position){
        if(!touring||token!==tourToken)return;
        if(position>=TOUR_SEQUENCE.length){
          touring=false;rootNode.dataset.touring='complete';tourTimer=0;
          rootNode.dataset.tourPhase='complete';stopTourSweep();
          if(tourAudioRequested||audioScore.state().enabled)fadeTourScore(1.6);
          if(overviewButton)overviewButton.click();
          render(0,false);
          if(status)status.textContent='TOUR COMPLETE · JETZT SELBST SCROLLEN UND ENTDECKEN';
          if(tourButton)tourButton.innerHTML='<span>↻</span><b>REPLAY TOUR</b><small>3 FENSTER · SELBST ENTDECKEN</small>';
          if(previousButton)previousButton.disabled=false;
          if(nextButton)nextButton.disabled=true;
          if(deeperLink)deeperLink.hidden=false;
          return;
        }
        const phase=TOUR_SEQUENCE[position];
        rootNode.dataset.tourPhase=phase.phase;
        if(phase.phase==='overview'&&overviewButton)overviewButton.click();
        if(phase.phase==='vertical'&&guidedButton)guidedButton.click();
        render(phase.station,phase.focus,phase.holdLens);
        const duration=phase.phase==='breathe'?TOUR_TIMING.breathMs:phase.phase==='overview'?TOUR_TIMING.overviewMs:TOUR_TIMING.stationMs;
        rootNode.style.setProperty('--journey-beat',`${duration}ms`);
        if(status)status.textContent=`TOUR ${String(position+1).padStart(2,'0')} / ${String(TOUR_SEQUENCE.length).padStart(2,'0')} · ${phase.label} · ${clockAt(phase.station).countdown}|Q+1`;
        tourTimer=timerHost.setTimeout(()=>phaseAt(position+1),duration);
      }
      phaseAt(0);
    }
    function go(index){
      const state=render(index,true),target=state.index<3?documentNode.querySelector(state.selector):instrument;
      if(target)target.scrollIntoView({behavior:'smooth',block:state.index<3?'center':'start'});
    }
    buttons.forEach((button,index)=>button.addEventListener('click',()=>{stopTour();button.blur();go(index)}));
    if(previousButton)previousButton.addEventListener('click',()=>{stopTour();go(active-1)});
    if(nextButton)nextButton.addEventListener('click',()=>{stopTour();go(active+1)});
    if(tourButton)tourButton.addEventListener('click',()=>touring?stopTour():runTour());
    if(scoreToggle)scoreToggle.addEventListener('click',async()=>{
      const next=scoreToggle.getAttribute('aria-pressed')!=='true';
      const activeAudio=await setScoreEnabled(next,next ? .04 : .18);
      if(touring)tourAudioRequested=activeAudio;
    });
    documentNode.querySelectorAll('[data-journey-panel]').forEach((panel,index)=>panel.addEventListener('click',()=>render(index,true)));
    const overviewButton=documentNode.querySelector('#wideModeButton');
    if(overviewButton)overviewButton.addEventListener('click',()=>render(active,false));
    const guidedButton=documentNode.querySelector('#verticalModeButton');
    if(guidedButton)guidedButton.addEventListener('click',()=>render(Math.min(active,2),true));
    if(typeof IntersectionObserver==='function'){
      const observer=new IntersectionObserver(entries=>{
        const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible)return;
        const index=STATIONS.findIndex(item=>item.selector===`#${visible.target.id}`);
        if(index>=3)render(index,true);
      },{rootMargin:'-18% 0px -52% 0px',threshold:[.05,.25,.5]});
      STATIONS.slice(3).forEach(item=>{const node=documentNode.querySelector(item.selector);if(node)observer.observe(node)});
    }
    documentNode.addEventListener('visibilitychange',()=>{if(documentNode.hidden)audioScore.suspend()});
    function openPanelFromHash(){
      const hash=documentNode.defaultView?.location?.hash;
      const index=STATIONS.slice(0,3).findIndex(station=>station.selector===hash);
      if(index<0)return false;
      stopTour();
      go(index);
      return true;
    }
    if(documentNode.defaultView){
      documentNode.defaultView.addEventListener('pagehide',audioScore.suspend,{once:true});
      documentNode.defaultView.addEventListener('hashchange',openPanelFromHash);
    }
    if(!openPanelFromHash())render(0,true);
    return Object.freeze({go,render,runTour,stopTour,setOverview:()=>render(active,false),state:()=>Object.freeze({...stationAt(active),mode,touring,score:scoreAt(active),audio:audioScore.state()})});
  }
  return Object.freeze({STATIONS,CLOCK_RHYTHM,TOUR_TIMING,TOUR_SEQUENCE,SCORE_STATIONS,stationAt,statusAt,clockAt,scoreAt,mount});
});

if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-journey-root]').forEach(node=>window.A0ObserverJourney.mount(node,document)));
