(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0OrientationDeskEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='A0_ORIENTATION_DESK_WORKFLOW_V1';
  const STEPS=Object.freeze(['bring','frame','place','turn','compare','return']);
  const KINDS=Object.freeze(['source','claim','relation','unknown']);
  const clean=value=>String(value??'').trim().slice(0,1200);
  const copy=value=>JSON.parse(JSON.stringify(value));
  const defaults=()=>({
    schema:VERSION,
    status:'LOCAL_A0_CANDIDATE',
    step:'bring',
    question:'Can another view help me find my bearings?',
    frame:{purpose:'',timeScale:'',view:'',outside:'',declared:false},
    materials:[
      {id:'source',kind:'source',label:'Source',content:'What is present?',included:true,turn:0},
      {id:'claim',kind:'claim',label:'Claim',content:'What is being said?',included:true,turn:0},
      {id:'relation',kind:'relation',label:'Relation',content:'What connects?',included:true,turn:0},
      {id:'unknown',kind:'unknown',label:'Outside',content:'What remains unavailable?',included:false,turn:0}
    ],
    selectedId:null,
    progress:{brought:false},
    relation:'',
    views:{a:'',b:'',active:'A',compared:false},
    ilau:{I:'',L:'',A:'',U:''},
    receipt:null
  });
  function validate(state){
    if(!state||state.schema!==VERSION)throw new Error('Invalid desk state');
    if(!STEPS.includes(state.step))throw new Error('Invalid workflow step');
    if(state.materials.length!==4||new Set(state.materials.map(item=>item.id)).size!==4)throw new Error('Four distinct desk slots required');
    if(state.materials.some(item=>!KINDS.includes(item.kind)||![0,90,180,270].includes(item.turn)))throw new Error('Invalid material slot');
    return state;
  }
  function create(overrides={}){
    const state=defaults();
    if(overrides.question!==undefined)state.question=clean(overrides.question);
    return validate(state);
  }
  function change(state,fn){const next=copy(validate(state));fn(next);next.receipt=null;return validate(next)}
  function setStep(state,step){if(!STEPS.includes(step))throw new Error('Unknown step');return change(state,next=>{next.step=step})}
  function setQuestion(state,question){return change(state,next=>{next.question=clean(question)})}
  function setFrame(state,frame){return change(state,next=>{next.frame={purpose:clean(frame.purpose),timeScale:clean(frame.timeScale),view:clean(frame.view),outside:clean(frame.outside),declared:Boolean(frame.declared)}})}
  function setMaterial(state,id,patch){return change(state,next=>{const item=next.materials.find(entry=>entry.id===id);if(!item)throw new Error('Unknown material');if(patch.label!==undefined){item.label=clean(patch.label).slice(0,48)||item.label;next.progress.brought=true}if(patch.content!==undefined){item.content=clean(patch.content);next.progress.brought=true}if(patch.included!==undefined)item.included=Boolean(patch.included);if(patch.kind!==undefined){if(!KINDS.includes(patch.kind))throw new Error('Unknown material kind');item.kind=patch.kind}})}
  function select(state,id){return change(state,next=>{if(id!==null&&!next.materials.some(item=>item.id===id))throw new Error('Unknown material');next.selectedId=id})}
  function turn(state){return change(state,next=>{const item=next.materials.find(entry=>entry.id===next.selectedId);if(!item)throw new Error('Select a material first');item.turn=(item.turn+90)%360;next.step='turn'})}
  function setRelation(state,relation){return change(state,next=>{next.relation=clean(relation)})}
  function setViews(state,views){return change(state,next=>{next.views.a=clean(views.a);next.views.b=clean(views.b);if(views.active!==undefined)next.views.active=views.active==='B'?'B':'A';next.views.compared=Boolean(next.views.a&&next.views.b)})}
  function setILAU(state,ilau){return change(state,next=>{for(const key of ['I','L','A','U'])next.ilau[key]=clean(ilau[key])})}
  function readiness(state){
    validate(state);
    return{
      bring:Boolean(state.question&&state.progress.brought&&state.materials.some(item=>item.content)),
      frame:Boolean(state.frame.declared&&state.frame.purpose),
      place:Boolean(state.relation&&state.materials.some(item=>item.included)&&state.materials.some(item=>!item.included)),
      turn:Boolean(state.materials.some(item=>item.turn!==0)),
      compare:Boolean(state.views.compared&&Object.values(state.ilau).some(Boolean))
    };
  }
  function finish(state,decision,note=''){
    if(!['CONTINUE','REST'].includes(decision))throw new Error('Return must be CONTINUE or REST');
    const ready=readiness(state);if(!ready.bring||!ready.frame||!ready.place||!ready.turn||!ready.compare)throw new Error('Complete Bring, Frame, Place, Turn and Compare before Return');
    const next=copy(state);next.step='return';next.receipt={
      schema:'A0_ORIENTATION_DESK_RETURN_V1',createdAt:new Date().toISOString(),decision,note:clean(note),
      question:next.question,frame:copy(next.frame),materials:copy(next.materials),relation:next.relation,
      views:copy(next.views),ilau:copy(next.ilau),
      boundary:'Human-authored local session receipt. No evidence, scientific finding, publication authority or automatic judgment.'
    };return validate(next);
  }
  return Object.freeze({VERSION,STEPS,KINDS,create,validate,setStep,setQuestion,setFrame,setMaterial,select,turn,setRelation,setViews,setILAU,readiness,finish,snapshot:state=>copy(validate(state))});
});
