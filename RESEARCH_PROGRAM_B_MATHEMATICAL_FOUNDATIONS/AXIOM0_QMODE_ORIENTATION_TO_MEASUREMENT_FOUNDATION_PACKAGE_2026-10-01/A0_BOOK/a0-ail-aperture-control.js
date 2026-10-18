(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0AILApertureControl=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SCHEMA='nexah.a0.ail-aperture-control/1';
  const OPERATORS=Object.freeze({
    A:Object.freeze({id:'A',label:'GLOBAL SELECTION',domain:'NATIVE_SOURCE_STATE × BODY_FACE_INDEX[0..47]',codomain:'NATIVE_SOURCE_STATE',changes:['selected','hingeVertexIds'],preserves:['sourceId','geometry','localPoint','hingeAngle']}),
    i:Object.freeze({id:'i',label:'LOCAL POINT',domain:'SELECTED_PENTAGON × LOCAL_VERTEX_SLOT[0..4]',codomain:'LOCAL_POINT_WITNESS',changes:['localPoint'],preserves:['selected','geometry','hingeAngle']}),
    l:Object.freeze({id:'l',label:'LOCAL TURN',domain:'SELECTED_PENTAGON × HINGE_EDGE × ANGLE[-60..60]',codomain:'VISIBLE_FACE_POSE',changes:['hingeAngle','visibleFacePose'],preserves:['selected','localPoint','hingeVertexIds','facetDistances']})
  });
  const copy=v=>JSON.parse(JSON.stringify(v));
  function createState(overrides={}){return Object.assign({schema:SCHEMA,version:VERSION,selected:0,localPoint:0,hingeAngle:0,step:0,status:'READY',events:[],sourceRecord:null,returnReceipt:null},copy(overrides))}
  function apply(state,operator,value,readback=null){if(!OPERATORS[operator])throw Error('unknown A·i·l operator');const next=copy(state);if(operator==='A'){if(!Number.isInteger(value)||value<0||value>=48)throw Error('A requires native body face 0..47');next.selected=value}else if(operator==='i'){if(!Number.isInteger(value)||value<0||value>4)throw Error('i requires local vertex slot 0..4');next.localPoint=value}else{if(!Number.isFinite(value)||value<-60||value>60)throw Error('l requires angle -60..60');next.hingeAngle=value}next.step++;next.status='CONFIRMED';next.sourceRecord=readback?copy(readback):next.sourceRecord;next.events.push({sequence:next.step,operator,value,changes:OPERATORS[operator].changes.slice(),readback:readback?copy(readback):null});return next}
  function record(state){return{schema:SCHEMA,version:VERSION,status:state.status,expression:'S(t) → A·i·l → visible form',operators:OPERATORS,selected:state.selected,localPoint:state.localPoint,hingeAngle:state.hingeAngle,events:copy(state.events),sourceRecord:copy(state.sourceRecord),returnReceipt:copy(state.returnReceipt),boundary:'Visible source-bound form only; no linguistic, mathematical, glyph-family or physical identity claim.',authority:{newCarrier:false,newIdentity:false,researchExecution:false}}}
  return{VERSION,SCHEMA,OPERATORS,createState,apply,record};
});
