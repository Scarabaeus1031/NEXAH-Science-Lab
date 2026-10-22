'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const source='A0_FAMILY_CONNECTION_ATLAS.html';
function extract(text){
 const start=text.indexOf('    const families={'),end=text.indexOf('    const stages=[',start),s=text.indexOf('    const elevatorStops={'),e=text.indexOf('\n    };',s);
 if([start,end,s,e].some(i=>i<0))throw Error('Atlas declaration boundary missing');
 const code=text.slice(start,end)+'\n'+text.slice(s,e+7)+'\nJSON.stringify({families,edges,routes,stops:elevatorStops})';
 return JSON.parse(vm.runInNewContext(code,{}, {timeout:1000}));
}
function build(){
 const bytes=fs.readFileSync(path.join(__dirname,source)),data=extract(bytes.toString());
 const result={meta:{source,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),scope:'Standalone presentation snapshot; not a new registry or admission',date:'2026-10-21'},...data};
 fs.writeFileSync(path.join(__dirname,'a0-family-navigator-demo-data.js'),'/* Generated from the owning Atlas; rebuild explicitly, never infer graph relations. */\nwindow.A0FamilyNavigatorDemoData='+JSON.stringify(result,null,2)+';\n');
 return result;
}
if(require.main===module){const d=build();console.log(JSON.stringify({families:Object.keys(d.families).length,relations:Object.keys(d.edges).length,sourceSha256:d.meta.sha256}));}
module.exports={extract,build};
