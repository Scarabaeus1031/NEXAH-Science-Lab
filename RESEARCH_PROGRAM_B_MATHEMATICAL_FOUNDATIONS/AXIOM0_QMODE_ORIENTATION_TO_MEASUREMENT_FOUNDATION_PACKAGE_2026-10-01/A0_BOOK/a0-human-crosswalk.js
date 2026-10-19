(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.A0HumanCrosswalk=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const questions={
    real:{index:0,text:'What is real?'},know:{index:1,text:'What can I know?'},unseen:{index:2,text:'What am I not seeing?'},
    connect:{index:3,text:'What connects us?'},change:{index:4,text:'What changes — and what remains?'},
    attention:{index:5,text:'What deserves my attention?'},act:{index:6,text:'How do I want to act?'}
  };
  const rows=[
    {scene:1,question:'connect',human:'Was verbindet mich mit anderen, ohne Unterschiede aufzuheben?',blueprint:'situated-orientation',reason:'Relation und situierte Orientierung; keine Identität sozialer und mathematischer Beziehungen.',status:'bound'},
    {scene:2,question:'know',human:'Was kann ich erkennen — und was bleibt außerhalb meines Zugangs?',blueprint:'tube',reason:'Auswahlgrenze, Körper und Anschluss bleiben unterschiedliche Rollen. Blueprint öffnet den Abschnitt, nicht eine bestimmte Rohrpost-Station.',status:'bound'},
    {scene:3,question:'change',human:'Was verändert sich, wenn ich den Rahmen oder Maßstab wechsle?',blueprint:'blue-body-topology',reason:'Rahmenwechsel als Zugang; der endliche Zoom ist kein allgemeines Matroschka-Skalengesetz.',status:'bound'},
    {scene:4,question:'change',human:'Was verändert sich im Zusammenspiel — und was bleibt dabei erhalten?',blueprint:'phase-hypothesis',reason:'Phasenfrage und Darstellungswechsel; die R0-/Unadmitted-Grenzen des Blueprint bleiben erhalten.',status:'bound'},
    {scene:5,question:'unseen',human:'Was sehe ich gerade nicht — und welchen Anteil daran hat mein Ausschnitt?',blueprint:'view-coupling',reason:'Apertur, Projektion und Verlust vergleichen; keine Ableitung physikalischer Optik aus dem Storyboard.',status:'bound'},
    {scene:6,question:null,human:'Wann wird aus meinem Eindruck eine belastbare Aussage über ein neues Muster?',blueprint:null,reason:'Ein spezifischer Human-Emergenz-Einstieg ist nicht festgelegt. Die Zuordnung bleibt redaktionell offen.',status:'open'},
    {scene:7,question:'act',human:'Was nehme ich mit — und wie möchte ich verantwortlich handeln?',blueprint:'tube',reason:'Menschliches Urteil ist kein numerischer Rückfehler. Blueprint öffnet den Abschnitt, nicht automatisch die Return-Station.',status:'bound'}
  ];
  const layerKeys=['structure','coupling','visibility','return'];
  const keys=['hc_v','hc_from','hc_scene','hc_moment','hc_layer','hc_target','hc_question'];
  const rowFor=scene=>rows.find(row=>row.scene===scene)||null;
  function readContext(search,page){
    let p;try{p=new URLSearchParams(search);}catch{return{status:'invalid'};}
    const incoming=[...p.keys()].filter(key=>key.startsWith('hc_'));
    if(!incoming.length)return{status:'none'};
    const fail=()=>({status:'invalid'});
    if(!['storyboard','journey','blueprint'].includes(page)||incoming.some(key=>!keys.includes(key)||p.getAll(key).length!==1))return fail();
    if(p.get('hc_v')!=='1'||!/^([1-7])$/.test(p.get('hc_scene')||'')||!/^\d{1,3}$/.test(p.get('hc_moment')||''))return fail();
    const scene=Number(p.get('hc_scene')),moment=Number(p.get('hc_moment')),layer=p.get('hc_layer')||null;
    if(String(scene)!==p.get('hc_scene')||String(moment)!==p.get('hc_moment')||moment>100||(layer&&!layerKeys.includes(layer)))return fail();
    const context={scene,moment,layer};
    if(page==='storyboard'){
      if(p.get('hc_from')!=='human'||p.has('hc_target')||p.has('hc_question'))return fail();
      return{status:'valid',context};
    }
    const row=rowFor(scene);
    if(p.get('hc_from')!=='storyboard'||p.get('hc_target')!==page||!row||row.status!=='bound'||p.get('hc_question')!==row.question)return fail();
    return{status:'valid',context,row,question:questions[row.question]};
  }
  function params(context,from){
    if(!context||!Number.isInteger(context.scene)||!rowFor(context.scene)||!Number.isInteger(context.moment)||context.moment<0||context.moment>100||(context.layer&&!layerKeys.includes(context.layer)))return null;
    const p=new URLSearchParams({hc_v:'1',hc_from:from,hc_scene:String(context.scene),hc_moment:String(context.moment)});
    if(context.layer)p.set('hc_layer',context.layer);return p;
  }
  function outbound(context,target){
    const p=params(context,'storyboard'),row=context&&rowFor(context.scene);
    if(!p||!row||row.status!=='bound'||!['journey','blueprint'].includes(target))return null;
    p.set('hc_target',target);p.set('hc_question',row.question);
    return(target==='journey'?'A0_NEXAH_APERTURE_JOURNEY.html':'A0_LIVING_BLUEPRINT.html')+'?'+p.toString()+'#'+(target==='journey'?'human-view':row.blueprint);
  }
  function returnHref(context){const p=params(context,'human');return p?'A0_THEORY_STORYBOARD.html?'+p.toString()+'#scene-'+context.scene:'A0_THEORY_STORYBOARD.html#overview';}
  function mountHuman(doc,win){
    const banner=doc.getElementById('humanCrosswalkReturn');if(!banner)return null;
    const page=banner.dataset.hcPage,entry=readContext(win.location.search,page),link=doc.getElementById('humanCrosswalkBack'),copy=doc.getElementById('humanCrosswalkCopy'),navBack=doc.getElementById('humanCrosswalkNavBack');
    link.setAttribute('href','A0_THEORY_STORYBOARD.html#overview');
    navBack.setAttribute('href','A0_THEORY_STORYBOARD.html#overview');
    if(entry.status!=='valid'){copy.textContent=entry.status==='invalid'?'Der Rückkehrkontext ist ungültig. Neutraler Einstieg, keine Modellwerte übernommen.':'Human View und Modell sind verschiedene Zugänge. Ohne Eintrittskontext führt der Modell-Link zur Szenenübersicht.';return entry;}
    let applied=true;
    if(page==='journey'){const view=win.A0NexahApertureJourneyView;applied=Boolean(view&&typeof view.enterCrosswalk==='function'&&view.enterCrosswalk(entry.question.index));}
    link.setAttribute('href',returnHref(entry.context));link.textContent='Zurück zu Szene '+entry.context.scene+' · Regler '+entry.context.moment+' ↗';
    navBack.setAttribute('href',returnHref(entry.context));
    copy.textContent='Aus Storyboard-Szene '+entry.context.scene+' · '+(page==='journey'?(applied?'Human-Frage ausgewählt, automatische Schleifen pausiert.':'Frage konnte nicht direkt ausgewählt werden; bitte die Fragenleiste verwenden.'):'Blueprint-Abschnitt geöffnet; keine bestimmte dynamische Station ausgewählt.')+' Menschliche Lesart ≠ Modellbeweis.';
    return{...entry,applied};
  }
  function ready(doc,win){if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',()=>mountHuman(doc,win),{once:true});else mountHuman(doc,win);}
  return{questions,rows,layerKeys,rowFor,readContext,outbound,returnHref,mountHuman,ready};
});
