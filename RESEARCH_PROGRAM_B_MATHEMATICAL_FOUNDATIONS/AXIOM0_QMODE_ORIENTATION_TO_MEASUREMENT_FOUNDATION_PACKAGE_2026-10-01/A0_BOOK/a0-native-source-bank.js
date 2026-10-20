(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.A0NativeSourceBank=api;root.A0NativeSourceBankView=api.mount(document,root);}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const cases='../../../SCIENCE_LAB/CASE_STUDIES/';
  const orbit=cases+'E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/';
  const entries=[
    {key:'box',title:'TESSAREC · Box / Laschen / CON–DAO',path:'A0_TESSAREC_BLUE_BODY_LAB.html#fold-contact',controls:'Schnitt t · Verlängerung e · Faltwinkel · Boden · Kontaktzyklus · CON–DAO · conDaoTick KEEP / 0…13 (STILL 6 und 7)',boundary:'Vier gekoppelt rotierende Klappen in einer Kontaktprojektion. Kein unabhängiger Zwei-Streifen-Transport und kein räumlicher Tunnel-Nachweis.'},
    {key:'double',title:'TESSAREC · Doppelkörper / Naht / M7',path:'A0_TESSAREC_BLUE_BODY_LAB.html#double',controls:'Getrennt / verbunden / O8-Projektion · M7-Rasteransichten',boundary:'Kombinatorische Naht und optionale Projektionslinsen; nicht mit dem Laschenschluss identifizieren.'},
    {key:'janus',title:'Janus Arithmetic Ladder',path:cases+'NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_JANUS_ARITHMETIC_LADDER.html',controls:'Inner mirror · Nested shells · Seven-state ladder · k = −3…3',boundary:'Affine Spiegelungen mit deklarierten Mittelpunkten. Verschiedene Mittelpunkte bleiben verschiedene Relationen.'},
    {key:'two-cut',title:'Euler Ladder · Antipode · Two-Cut',path:'../../../SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html',controls:'Trägerfamilie · Leiterstufe j · Euler-Stufe n · A20 · Return',boundary:'Wert- und Adressschnitt mit Binder. Nativer Return ist ein berechneter Rückkehrstatus, kein unabhängiger Bench-Checkpoint-/Readback-Nachweis.'},
    {key:'orbit',title:'E8 / H3 · Mutation / Orbit / Hedron',path:cases+'E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/NEXAH_E8_MUTATION_FAMILY_GRAPH.html',controls:'Topologie · Generator · ABBA · Coxeter · H3-Körper · Dual-Overlay · Kamera · gerichtete Adresse / Trit',boundary:'Trit und Richtung gehören zur Adressanzeige, nicht zum E8-Mutationsoperator. H3 und E8 bleiben getrennte Träger.'},
    {key:'roman',title:'MIWA / Astrolabium / Roman Stack',path:orbit+'NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html',controls:'LOKI / H3 / E8 · Wort · Schnittwinkel · zwölf Flächen · sechs Gegenpaare · PP/RP · Ghost',boundary:'Flächenapertur ist keine Scharnierfaltung. Vor automatischer Masteranbindung müssen Wort-Timer bei Reset/Systemwechsel abbrechbar sein.'},
    {key:'coupling',title:'Typed Coupling Workbench',path:orbit+'NEXAH_TYPED_COUPLING_WORKBENCH.html',controls:'Quellträger · typisierter Adapter · Zielansicht · Fasern / Kollisionen / Residuen',boundary:'Ein exakter Quotient kann einen mehrdeutigen Return haben. Der bestehende Live-Sequenzanschluss umfasst nicht automatisch alle nativen Familien.'},
    {key:'word',title:'Word / Orbit Sequencer',path:orbit+'NEXAH_WORD_ORBIT_SEQUENCER.html',controls:'Buchstabe · Wort · Potenz · Zyklus · Tempo · Play/Pause · Fibonacci/Euler-Vergleich',boundary:'Vorhandene Ausführungsquelle wiederverwenden. Der Live-Sequenzvertrag n=0…40 ist nicht zugleich ein nativer E8-/H3-Mastervertrag.'},
    {key:'eleven',title:'11-Space · Four Views',path:cases+'NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_ELEVEN_SPACE_FOUR_VIEWS.html',controls:'Integerauswahl · Restklassenring · Komponenten · Differenz · Rekonstruktion',boundary:'Gleicher Rest bedeutet nicht gleicher Integer. Der zweite Herkunftsmarker der Restklassenkollision bleibt separat offen.'}
  ];
  function remote(win,frame,source){
    const token=Array.from(win.crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
    let id=0,pending=null,first=true,listeners=new Set();
    const receive=event=>{
      const data=event.data;
      if(event.source!==frame.contentWindow||!data||data.protocol!=='A0_NATIVE_INSTRUMENT_V1'||data.token!==token||data.source!==source)return;
      if(data.id===0){for(const fn of listeners)fn(data.ack);return}
      if(!pending||data.id!==pending.id)return;
      const request=pending;pending=null;win.clearTimeout(request.timer);request.resolve(data.ack);
    };
    win.addEventListener('message',receive);
    return {schema:'nexah.a0.native-instrument/1',source,
      dispatch(request){
        if(pending)return Promise.reject(Error('source acknowledgement pending'));
        return new Promise((resolve,reject)=>{
          const next=++id,timer=win.setTimeout(()=>{pending=null;reject(Error('source acknowledgement timeout; READ reconnect required'))},5000);
          pending={id:next,timer,resolve,reject};
          frame.contentWindow.postMessage({protocol:'A0_NATIVE_INSTRUMENT_V1',source,token,id:next,connect:first,request},'*');first=false;
        });
      },
      subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
      disconnect(){if(pending){win.clearTimeout(pending.timer);pending.reject(Error('source disconnected'));pending=null}win.removeEventListener('message',receive);listeners.clear()}
    };
  }
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('nativeSourceBank');if(!host)return null;
    const make=(tag,text)=>{const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;return el};
    const title=make('h2','Vorhandene Quellen · native Steuerbank');
    const intro=make('p','Die Original-HTMLs bleiben die Engines. Box/Laschen, Janus und Two-Cut haben Quellenbefehle mit Readback und eigenem Checkpoint-Return; die übrigen Einstiege sind noch Bedienzugänge ohne diesen Vertrag. Zustände werden typisiert gesammelt, nicht gleichgesetzt.');
    const concept=make('p','Box → Öffnung → Klappenkontakt: t skaliert die Geometrie; e und Faltwinkel bestimmen den Kontakt. Bei 180° liegt der Mittelpunktkontakt bei e = φ/√2 ≈ 1,1441. Kontakt ist keine geprüfte flächige Abdichtung. Ein offener Boden erlaubt eine Durchgangs-Lesart; zwei unabhängig verschiebbare Streifen sind noch nicht angeschlossen.');
    const cue=make('p','Owner-Lesart: ??? → neun Zwischenschritte → !!! / Q → A; 5×9-Euler-Rad, Rainbow Drift und geschwungenes Pentagonraster. Die geprüfte Euler-Ansicht hat fünf Kanäle mit 40 Primzahlpunkten plus Randfall n=40, nicht bereits 45 registrierte Zustände. Dezimallabels 1111/3333/4444/7777 bleiben eine separate Zahlenansicht. Diese zusätzliche Zuordnung ist noch kein Steuervertrag. ');
    const rainbowLink=make('a','Vorhandene Rainbow-/Fragenansicht ↗');rainbowLink.href='A0_RAINBOW_PURPLE_RAIN.html';rainbowLink.target='_blank';rainbowLink.rel='noopener';cue.append(rainbowLink);
    const packageNote=make('p','Aktives enges Arbeitspaket: '),packageLink=make('a','Quellfuge · Joint Applications + Box / Laschen');packageLink.href='assets/a0-source-seam-joint-box-package-v1.json';packageNote.append(packageLink);
    const label=make('label','Instrument auswählen '),select=make('select');select.id='nativeBankChoice';
    entries.forEach(entry=>{const option=make('option',entry.title);option.value=entry.key;select.append(option)});select.value='box';label.append(select);
    const controls=make('p'),boundary=make('p'),actions=make('div');actions.className='native-bank-actions';
    const load=make('button','Quell-HTML hier laden'),unload=make('button','Quelle entladen · Sitzung verwerfen'),link=make('a','Original separat öffnen ↗');
    load.type=unload.type='button';unload.disabled=true;link.target='_blank';link.rel='noopener';
    const status=make('p','NICHT GELADEN · kein Quellzustand gelesen');status.setAttribute('role','status');
    const slot=make('div');slot.className='native-bank-slot';let active=null,frame=null;
    const bridgePanel=make('div'),bridgeActions=make('div'),fields=make('div'),readout=make('pre'),journalNote=make('p');
    bridgePanel.className='native-bank-bridge';bridgeActions.className='native-bank-actions';readout.className='native-bank-readout';
    let endpoint=null,unsubscribe=null,checkpoint=null,checkpointState=null,dispatching=false,held=false,hostSeq=0,journal=[],records={},inputs={};
    const clone=x=>JSON.parse(JSON.stringify(x)),commands={};
    const profiles={
      box:[['t',[.2,.85,.01]],['extension',[1,1.5,.001]],['foldDeg',[0,180,1]],['mode',['square','triangle']],['baseOn',['on','off']],['number',['1111','3333','4444','7777']],['layer',['HOLD','P0','P1','P2']],['conDaoTick',['KEEP',...Array.from({length:14},(_,i)=>String(i))]]],
      janus:[['view',['inner','outer','ladder']],['k',[-3,3]]],
      'two-cut':[['family',['exact','historical']],['j',[0,11]],['n',[0,40]]]
    };
    function aggregate(){
      const existing={};
      for(const [name,owner] of [['pentagon',win.A0PentagonBench],['life03',win.A0Life03Bench]]){
        try{existing[name]=owner?.exportRecord?clone(owner.exportRecord()):{status:'UNAVAILABLE'}}catch(e){existing[name]={status:'HOLD',error:e.message}}
      }
      try{existing.phaseView=win.A0PhaseWiringView?.snapshot?clone(win.A0PhaseWiringView.snapshot()):{status:'UNAVAILABLE'}}catch(e){existing.phaseView={status:'HOLD',error:e.message}}
      return clone({schema:'nexah.a0.typed-bench-state-journal/1',hostSeq,activeKey:active?.key||null,pending:dispatching,held,records,journal,limits:{journal:64},existingConnections:existing,simultaneousSnapshot:false,sharedCarrier:false,wholeMachineReturn:false,browserAcceptance:false});
    }
    function journalStatus(){journalNote.textContent=Object.keys(records).length+' native Quellprofile erfasst · '+journal.length+'/64 Journal-Ereignisse · letzte Rückmeldungen, kein simultaner Gesamtzustand.'}
    function accept(value){
      if(!active||!endpoint||value?.schema!=='nexah.a0.native-instrument/1'||value.source!==endpoint.source||!Number.isInteger(value.seq))throw Error('source acknowledgement mismatch');
      if(value.command==='RETURN'&&value.ok&&(!checkpointState||!value.returnWitness?.exact||value.returnWitness.checkpoint!==checkpoint||JSON.stringify(value.state)!==JSON.stringify(checkpointState)))throw Error('host checkpoint comparison failed');
      if(value.command==='CAPTURE'&&value.ok)checkpointState=clone(value.state);
      held=!!value.hold;checkpoint=value.checkpoint;
      records[active.key]={attached:true,lastObserved:++hostSeq,ack:clone(value)};
      journal.push({hostSeq,key:active.key,sourceSeq:value.seq,command:value.command,ok:value.ok,type:value.reading?.type,returnVerified:!!value.returnWitness});
      journal=journal.slice(-64);readout.textContent=JSON.stringify({source:value.source,state:value.state,reading:value.reading,returnWitness:value.returnWitness},null,2);
      for(const [key,input] of Object.entries(inputs))if(value.state[key]!==undefined)input.value=String(value.state[key]);
      Object.entries(commands).forEach(([key,button])=>{button.disabled=held&&key!=='READ'||key==='RETURN'&&!checkpoint||key==='MIRROR'&&!value.capabilities.includes('MIRROR')});
      status.textContent=(held?'HOLD':'QUELL-READBACK')+' · '+active.title+(value.error?' · '+value.error:'')+' · kein Gesamt-Return';
      journalStatus();
    }
    function fail(error){held=true;Object.entries(commands).forEach(([key,button])=>button.disabled=key!=='READ');status.textContent='HOLD · '+error.message+' · kein bestätigter Quellenbefehl';if(active&&records[active.key])records[active.key].attached=false;}
    function connect(){
      if(!active||!frame)throw Error('Quelle zuerst laden');
      const expected=decodeURIComponent(active.path.split('#')[0].split('/').pop());
      let candidate;
      try{candidate=frame.contentWindow.A0NativeInstrument}catch(_){/* Opaque file origins use the same typed message contract. */}
      if(!candidate&&profiles[active.key]){
        if(!endpoint)endpoint=remote(win,frame,expected);
        candidate=endpoint;
      }
      if(candidate?.schema!=='nexah.a0.native-instrument/1'||candidate.source!==expected||typeof candidate.dispatch!=='function')throw Error('Noch kein nativer Steuervertrag oder Quellzugriff gesperrt');
      if(candidate!==endpoint||!unsubscribe){
        unsubscribe?.();if(endpoint&&endpoint!==candidate)endpoint.disconnect?.();endpoint=candidate;checkpoint=null;checkpointState=null;
        unsubscribe=endpoint.subscribe(value=>{if(!dispatching)try{accept(value)}catch(e){fail(e)}});
        fields.replaceChildren();inputs={};
        for(const [key,options] of profiles[active.key]||[]){
          const label=make('label',key+' '),numeric=typeof options[0]==='number',input=make(numeric?'input':'select');
          if(numeric){input.type='number';input.min=options[0];input.max=options[1];input.step=options[2]??1;}
          else options.forEach(value=>{const option=make('option',value);option.value=value;input.append(option)});
          input.setAttribute('aria-label',active.title+' '+key);inputs[key]=input;label.append(input);fields.append(label);
        }
        if(active.key==='box'&&inputs.number&&inputs.layer){
          inputs.number.addEventListener('change',()=>{if(inputs.number.value!=='1111')inputs.layer.value='HOLD'});
        }
      }
    }
    function send(command){
      try{
        if(command==='READ')connect();
        if(!endpoint)throw Error('READ / Quellenverbindung erforderlich');
        const payload={};if(command==='SET')for(const [key,input] of Object.entries(inputs))payload[key]=input.type==='number'?Number(input.value):input.value;
        if(dispatching)throw Error('source acknowledgement pending');
        dispatching=true;const currentEndpoint=endpoint,requestFrame=frame;
        const finish=value=>{if(frame!==requestFrame||endpoint!==currentEndpoint)return null;dispatching=false;accept(value);return clone(value)};
        const value=endpoint.dispatch({command,payload,checkpoint});
        if(value&&typeof value.then==='function'){
          Object.values(commands).forEach(button=>button.disabled=true);status.textContent='WAITING · '+command+' · Quellenbestätigung ausstehend';
          return value.then(finish).catch(e=>{if(frame===requestFrame){dispatching=false;currentEndpoint.disconnect?.();endpoint=null;unsubscribe?.();unsubscribe=null;checkpoint=null;checkpointState=null;fail(e)}return null});
        }
        return finish(value);
      }catch(e){dispatching=false;fail(e);return null}
    }
    for(const [key,label] of [['READ','READ / verbinden'],['CAPTURE','CAPTURE'],['SET','Regler anwenden'],['STEP','STEP'],['MIRROR','J spiegeln'],['RETURN','RETURN zum Checkpoint']]){
      const button=make('button',label);button.type='button';button.disabled=key!=='READ';button.addEventListener('click',()=>send(key));commands[key]=button;bridgeActions.append(button);
    }
    const exportButton=make('button','Typisiertes Zustandsjournal exportieren');exportButton.type='button';
    exportButton.addEventListener('click',()=>{const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(aggregate(),null,2)],{type:'application/json'})),a=make('a');a.href=url;a.download='a0-typed-bench-state-journal.json';a.click();win.URL.revokeObjectURL(url)});
    bridgeActions.append(exportButton);bridgePanel.append(make('h3','Bench-Befehle → Quelle → Readback'),fields,bridgeActions,journalNote,readout);journalStatus();
    const chosen=()=>entries.find(entry=>entry.key===select.value)||entries[0];
    function describe(){const entry=chosen();controls.textContent='Native Regler: '+entry.controls;boundary.textContent='Grenze: '+entry.boundary;link.href=entry.path;load.disabled=!!active;}
    load.addEventListener('click',()=>{
      if(active)return;
      active=chosen();const next=make('iframe');frame=next;next.title=active.title+' · Originalinstrument';
      next.setAttribute('referrerpolicy','no-referrer');
      next.addEventListener('load',()=>{if(frame===next){
        unsubscribe?.();unsubscribe=null;endpoint?.disconnect?.();endpoint=null;checkpoint=null;checkpointState=null;dispatching=false;
        if(records[active.key])records[active.key].attached=false;readout.textContent='';
        Object.entries(commands).forEach(([key,button])=>button.disabled=key!=='READ');
        status.textContent='HTML GELADEN · '+active.title+' · READ verbindet ausdrücklich; noch kein Master-Readback';
      }});
      next.addEventListener('error',()=>{if(frame===next)status.textContent='LADEFEHLER · Original separat öffnen; keine Verbindung behauptet';});
      next.src=active.path;slot.replaceChildren(next);select.disabled=true;unload.disabled=false;load.disabled=true;
      status.textContent='LÄDT · '+active.title+' · native Seite kann eigene Animationen ausführen';
    });
    unload.addEventListener('click',()=>{
      if(!active)return;
      // Discard the browsing context, not a source Return or a pause checkpoint.
      unsubscribe?.();unsubscribe=null;endpoint?.disconnect?.();endpoint=null;checkpoint=null;checkpointState=null;dispatching=false;held=false;
      if(records[active.key])records[active.key].attached=false;
      frame=null;slot.replaceChildren();active=null;select.disabled=false;unload.disabled=true;fields.replaceChildren();inputs={};readout.textContent='';
      Object.entries(commands).forEach(([key,button])=>button.disabled=key!=='READ');describe();
      status.textContent='ENTLADEN · lokale Quellsitzung verworfen; kein Return. Separat geöffnete Fenster bleiben unabhängig.';
    });
    select.addEventListener('change',describe);actions.append(load,unload,link);
    host.append(title,intro,concept,cue,packageNote,label,controls,boundary,actions,bridgePanel,status,slot);describe();
    return {get activeKey(){return active?active.key:null;},send,snapshot:aggregate};
  }
  return {entries,mount,remote};
});
