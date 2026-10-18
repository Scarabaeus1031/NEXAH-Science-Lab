(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0PentagonContract=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.0.0',PROTOCOL='A0_PENTAGON_UI_V1',SOURCE_HASH='4cfc870b3fcbe0d97c34098a1cd0767c79e0d3e316208da5a43575f17cc846f6';
const DEFAULT={mode:'structure',op:'0',growthStep:'5',couplingView:'cycles',dRegister:0,branchWord:'LRRL'};
const FIELDS=Object.keys(DEFAULT),MODES=['structure','metric','boundary','lift','roots','growth','coupling','d30'];
function state(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||Object.keys(s).sort().join('|')!==FIELDS.slice().sort().join('|'))throw Error('six-field UI record required');
 if(!MODES.includes(s.mode)||!['0','1','2','3','4','m'].includes(s.op)||!['1','2','3','4','5','closed'].includes(s.growthStep)||!['cycles','triangles','handle7','octagon'].includes(s.couplingView)||!Number.isInteger(s.dRegister)||s.dRegister<0||s.dRegister>4||typeof s.branchWord!=='string'||!/^[LR]{0,6}$/.test(s.branchWord))throw Error('invalid PENT UI state');
 return Object.fromEntries(FIELDS.map(k=>[k,s[k]]));
}
const equal=(a,b)=>FIELDS.every(k=>a[k]===b[k]);
function phase(word){if(typeof word!=='string'||!/^[LR]{0,6}$/.test(word))throw Error('invalid branch word');return((Array.from(word).reduce((sum,c)=>sum+(c==='R'?1:-1),0)%30)+30)%30;}
function command(input,action,value){const s=state(input);
 switch(action){
 case 'VIEW':s.mode=value;break;
 case 'STRUCTURE_OP':s.mode='structure';s.op=value;break;
 case 'GROWTH':s.mode='growth';s.growthStep=value;break;
 case 'COUPLING':s.mode='coupling';s.couplingView=value;break;
 case 'D30_ROTATE':s.mode='d30';s.dRegister=(s.dRegister+1)%5;break;
 case 'D30_MIRROR':s.mode='d30';s.dRegister=[0,4,3,2,1][s.dRegister];break;
 case 'LEFT':case 'RIGHT':if(s.branchWord.length>=6)throw Error('six-letter branch boundary');s.mode='d30';s.branchWord+=action==='LEFT'?'L':'R';break;
 case 'WORD':s.mode='d30';s.branchWord=value;break;
 case 'REGISTER':s.mode='d30';s.dRegister=value;break;
 default:throw Error('unknown PENT command');
 }return state(s);
}
const MASTER_CUES=Object.freeze({SOURCE:'VIEW:structure; op=0',OPERATOR:'STRUCTURE_OP:m',EDGE:'D30_ROTATE',SHADOW:'VIEW:lift',FAMILY:'VIEW:roots',GRID:'COUPLING:cycles',RETURN:'VIEW:boundary',FOLD:'COUPLING:triangles',ROOT:'WORD:LRRL',RECORD:'RETURN_TO_CAPTURED_UI_STATE'});
function master(input,id){if(!Object.hasOwn(MASTER_CUES,id))throw Error('unknown Master phase');if(id==='RECORD')return null;if(id==='SOURCE')return command(input,'STRUCTURE_OP','0');if(id==='OPERATOR')return command(input,'STRUCTURE_OP','m');if(id==='EDGE')return command(input,'D30_ROTATE');if(id==='SHADOW')return command(input,'VIEW','lift');if(id==='FAMILY')return command(input,'VIEW','roots');if(id==='GRID')return command(input,'COUPLING','cycles');if(id==='RETURN')return command(input,'VIEW','boundary');if(id==='FOLD')return command(input,'COUPLING','triangles');return command(input,'WORD','LRRL');}
function witness(w){
 if(!w||w.sourceHash!==SOURCE_HASH||!Number.isSafeInteger(w.revision)||w.revision<0)throw Error('source/revision mismatch');
 const s=state(w.state),rendered=state(w.rendered);if(!equal(s,rendered))throw Error('rendered UI disagrees with source state');
 if(w.phase!==phase(s.branchWord)||typeof w.resultText!=='string'||w.resultText.length>3000||!Number.isSafeInteger(w.svgElements)||w.svgElements<=0)throw Error('invalid rendered witness');
 return{sourceHash:SOURCE_HASH,revision:w.revision,state:s,rendered,phase:w.phase,resultText:w.resultText,svgElements:w.svgElements};
}
return{VERSION,PROTOCOL,SOURCE_HASH,DEFAULT,FIELDS,MODES,MASTER_CUES,state,equal,phase,command,master,witness};
});
