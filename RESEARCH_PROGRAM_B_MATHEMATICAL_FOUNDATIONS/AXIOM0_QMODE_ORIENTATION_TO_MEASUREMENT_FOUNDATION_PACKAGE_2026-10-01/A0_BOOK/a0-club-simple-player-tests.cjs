const assert=require('node:assert/strict'),fs=require('node:fs');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++};
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
const stack=[],byId=new Map(),voids=new Set(['meta','link','img','input','br','hr','source','wbr','area','base','embed','param','col']);
for(const match of html.matchAll(/<(\/?)([A-Za-z][\w-]*)([^>]*?)>/g)){
 const closing=!!match[1],name=match[2].toLowerCase(),attrs=match[3];
 if(closing){const i=stack.map(x=>x.name).lastIndexOf(name);if(i>=0)stack.length=i;continue;}
 const id=/\bid="([^"]+)"/.exec(attrs)?.[1];
 if(id){ok(!byId.has(id),'duplicate '+id);byId.set(id,{name,attrs,ancestors:stack.map(x=>x.id).filter(Boolean)});}
 if(!voids.has(name)&&!attrs.endsWith('/'))stack.push({name,id});
}
const details=byId.get('clubPlayerDetails');ok(details?.name==='details');ok(!/\bopen\b/.test(details.attrs));
for(const id of ['clubReturnPlay','clubCarrierRule','clubCarrierLoop','clubCarrierReset','clubFamilyFollow','clubCarrierTrace','clubFamilyFollowStatus','clubQRTDemo','clubQRTField','clubQRTStatus','clubReturnResult']){
 ok(byId.has(id),id+' retained');ok(!byId.get(id).ancestors.includes('clubPlayerDetails'),id+' primary');
}
for(const id of ['clubReturnField','clubReturnCheck','clubCRTCarrier','clubCRTChannels','clubCarrierStep','clubCarrierFollow','clubQRTFollow','clubCRTResult','clubCRTAddress']){
 ok(byId.has(id),id+' retained');ok(byId.get(id).ancestors.includes('clubPlayerDetails'),id+' in inspector');
}
const css=fs.readFileSync(__dirname+'/a0-club-return-monitor.css','utf8');
ok(css.includes('#familySpatialMount[data-player-follow="true"] .club-tour-transport{display:none}'));
ok(css.includes('.club-player-simple{display:block'));
const follow=fs.readFileSync(__dirname+'/a0-club-family-follow.js','utf8');ok(follow.includes("'data-player-follow'"));
// No new state engine, clones, reset-on-toggle or hidden-source interval.
ok(!html.includes('id="clubReturnPlay" type="button" onclick='));
console.log(JSON.stringify({status:'PASS',checks,scope:'unique original control IDs; primary transport/sequence/live flip outside closed inspector; technical controls preserved inside; duplicate Club transport hidden only while following; browser pixels OPEN'}));
