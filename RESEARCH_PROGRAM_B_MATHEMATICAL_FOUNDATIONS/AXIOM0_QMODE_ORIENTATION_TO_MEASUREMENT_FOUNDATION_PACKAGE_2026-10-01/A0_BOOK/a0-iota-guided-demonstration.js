(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.A0IotaGuidedDemonstration=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STEPS=Object.freeze([
    Object.freeze({id:'ORIENT',target:'#module-entry',title:'1 · Eine Vorführung, zwei Bridges',copy:'PLAY in der Ringansicht bleibt der einzelne 8/12-Player. Diese Führung verbindet nur vorhandene Ansichten und hält ihre Verträge getrennt.'}),
    Object.freeze({id:'JOINT_RETURN',target:'#iota23Bridge',title:'2 · 8 und 12 schließen bei 24',copy:'Die Schedule-Bridge läuft bis zum ersten gemeinsamen Return. Drei Achter und zwei Zwölfer treffen denselben Endtick, ohne zu einem Carrier zu verschmelzen.'}),
    Object.freeze({id:'RHOMBUS_180',target:'#gridBridgeFlagship',title:'3 · Rhombus / 180°',copy:'Die Q4-Projektion kippt in die 45°-Karoansicht und die vorhandene Cube-View auf 180°. Das ist ein View-Wechsel; Source und Face-Adresse bleiben erhalten.'}),
    Object.freeze({id:'WHITE_ROPE',target:'#foldedAxisLrrlWindow',title:'4 · White Rope / Fold',copy:'Der weiße Faden zeigt die gefaltete Achse mit gekoppelten Polen. Er ist eine Leselinse über derselben Bench, kein neues Seil oder Körperteil.'}),
    Object.freeze({id:'LRRL_FACE',target:'#foldedAxisLrrlWindow',title:'5 · Zwei Augen · zwei Nasenlöcher',copy:'L–R–R–L macht die vier symmetrischen Kanäle sichtbar. Die Gesichtslesart ist eine hilfreiche visuelle Analogie; technisch bleiben es zwei äußere und zwei innere Displayrollen.'}),
    Object.freeze({id:'PBDQ_CUT',target:'#foldedAxisLrrlWindow',title:'6 · p · b · d · q schneidet die Lage',copy:'Eine Linie und ein Kreis erzeugen vier Lagen: Identität, horizontale Spiegelung, 180°-Drehung und vertikale Spiegelung. T ist die Übergangsachse, Q die Quadrantenbahn.'}),
    Object.freeze({id:'EXACT_RETURN',target:'#iota23Bridge',title:'7 · Exakter IOTA-Return',copy:'Die Vorführung setzt Ring und Fold auf ihre Quellenansicht zurück. Die Demonstration endet; die Einzel-Player bleiben unabhängig bedienbar.',returned:true})
  ]);
  const CONTRACT=Object.freeze({kind:'EXISTING_VIEW_ORCHESTRATION',identity:IDENTITY,stations:STEPS.length,reuses:Object.freeze(['A0_IOTA_2_3_BRIDGE','MOD:TESSAREC','NEXAH_A0_FOLDED_AXIS_LRRL_WINDOW']),newIdentity:false,newRelation:false,newOperator:false,anatomyClaim:false,sourceMutation:false});
  function receipt(index=0,running=false){return Object.freeze({schema:'nexah.a0.iota-guided-demonstration/1',version:VERSION,identity:IDENTITY,step:STEPS[index],running,contract:CONTRACT});}
  function mount(doc=globalThis.document,win=globalThis.window){
    const host=doc?.querySelector('[data-iota-tour]');if(!host)return null;
    const start=host.querySelector('[data-iota-tour-start]'),next=host.querySelector('[data-iota-tour-next]'),pause=host.querySelector('[data-iota-tour-pause]'),end=host.querySelector('[data-iota-tour-end]'),progress=host.querySelector('[data-iota-tour-progress]'),title=host.querySelector('[data-iota-tour-title]'),copy=host.querySelector('[data-iota-tour-copy]');
    let index=0,timer=null,running=false;
    const bridge=()=>win.A0Iota23BridgeController;
    const fold=()=>win.A0FoldedAxisLrrlController;
    const grid=()=>win.A0GridBridgeFlagshipController;
    function stop(){if(timer){win.clearTimeout(timer);timer=null}running=false;host.dataset.running='false';pause.disabled=true;start.setAttribute('aria-pressed','false');start.textContent='▶ IOTA VORFÜHRUNG'}
    function setRhombus180(){doc.querySelector('[data-tfc-projection="diamond"]')?.click();const rotate=doc.querySelector('[data-tfc-rotate]');let guard=0;while(grid()?.getState?.().quarter!==2&&guard<4){rotate?.click();guard+=1}}
    function apply(step){
      if(step.id==='JOINT_RETURN'){bridge()?.reset?.();for(let i=0;i<24;i+=1)bridge()?.step?.()}
      if(step.id==='RHOMBUS_180')setRhombus180();
      if(step.id==='WHITE_ROPE')fold()?.render?.('FOLD');
      if(step.id==='LRRL_FACE')fold()?.render?.('LRRL');
      if(step.id==='PBDQ_CUT')fold()?.render?.('PBDQ_TQ');
      if(step.id==='EXACT_RETURN'){bridge()?.reset?.();fold()?.render?.('FOLD')}
    }
    function show(nextIndex,{move=true}={}){index=Math.max(0,Math.min(STEPS.length-1,nextIndex));const step=STEPS[index];apply(step);progress.textContent=`${index+1} / ${STEPS.length} · ${step.returned?'RETURN':'VORFÜHRUNG'}`;title.textContent=step.title;copy.textContent=step.copy;host.dataset.station=step.id.toLowerCase();if(move)doc.querySelector(step.target)?.scrollIntoView?.({behavior:'smooth',block:'center'});return receipt(index,running)}
    function schedule(){if(!running)return;if(index>=STEPS.length-1){stop();progress.textContent=`${STEPS.length} / ${STEPS.length} · RETURN`;return}timer=win.setTimeout(()=>{show(index+1);schedule()},2600)}
    function run(){stop();running=true;host.dataset.running='true';pause.disabled=false;start.setAttribute('aria-pressed','true');start.textContent='VORFÜHRUNG LÄUFT…';show(0);schedule()}
    start.addEventListener('click',run);
    next.addEventListener('click',()=>{stop();show(index>=STEPS.length-1?0:index+1)});
    pause.addEventListener('click',()=>{stop();progress.textContent=`${index+1} / ${STEPS.length} · PAUSE`});
    end.addEventListener('click',()=>{stop();show(STEPS.length-1)});
    show(0,{move:false});
    return Object.freeze({run,stop,show,next:()=>show(index>=STEPS.length-1?0:index+1),getReceipt:()=>receipt(index,running)});
  }
  return Object.freeze({VERSION,IDENTITY,STEPS,CONTRACT,receipt,mount});
});
