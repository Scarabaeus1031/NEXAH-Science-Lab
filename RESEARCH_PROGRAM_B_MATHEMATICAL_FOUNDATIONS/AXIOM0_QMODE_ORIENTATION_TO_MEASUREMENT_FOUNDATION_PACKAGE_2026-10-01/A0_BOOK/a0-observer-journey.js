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
  function stationAt(input){
    const index=Math.max(0,Math.min(STATIONS.length-1,Math.round(Number(input)||0)));
    return Object.freeze({index,...STATIONS[index]});
  }
  function statusAt(input){const s=stationAt(input);return `${String(s.index+1).padStart(2,'0')} / 05 · ${s.label} · ${s.angle} · ${s.view}`}
  function clockAt(input){
    const state=stationAt(input);
    return Object.freeze({index:state.index,countdown:CLOCK_RHYTHM[state.index],anchor:'Q',plusOne:true,role:'READING_CLOCK_NOT_TIME_MEASUREMENT'});
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
    let active=0,mode='overview',touring=false,tourTimer=0,tourToken=0,tourOwnsSweep=false;
    function startTourSweep(){
      if(sweepButton&&!sweepButton.classList.contains('active')){sweepButton.click();tourOwnsSweep=true}
    }
    function stopTourSweep(){
      if(tourOwnsSweep&&sweepButton&&sweepButton.classList.contains('active'))sweepButton.click();
      tourOwnsSweep=false;
    }
    function render(index,focusPanel,holdLensFocus){
      const state=stationAt(index),clock=clockAt(index);active=state.index;
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
      documentNode.dispatchEvent(new CustomEvent('a0:observer-journey-change',{detail:Object.freeze({...state,mode,clock})}));
      return state;
    }
    function stopTour(resetLabel){
      tourToken+=1;
      if(tourTimer)timerHost.clearTimeout(tourTimer);
      tourTimer=0;touring=false;rootNode.dataset.touring='false';rootNode.dataset.tourPhase='paused';
      stopTourSweep();
      if(tourButton&&resetLabel!==false)tourButton.innerHTML='<span>▶</span><b>PLAY TOUR</b><small>ATEM → 3 FENSTER → EINZELN → RETURN</small>';
      render(active,true,active>=3);
    }
    function runTour(){
      stopTour(false);touring=true;rootNode.dataset.touring='true';
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
    render(0,true);
    return Object.freeze({go,render,runTour,stopTour,setOverview:()=>render(active,false),state:()=>Object.freeze({...stationAt(active),mode,touring})});
  }
  return Object.freeze({STATIONS,CLOCK_RHYTHM,TOUR_TIMING,TOUR_SEQUENCE,stationAt,statusAt,clockAt,mount});
});

if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-journey-root]').forEach(node=>window.A0ObserverJourney.mount(node,document)));
