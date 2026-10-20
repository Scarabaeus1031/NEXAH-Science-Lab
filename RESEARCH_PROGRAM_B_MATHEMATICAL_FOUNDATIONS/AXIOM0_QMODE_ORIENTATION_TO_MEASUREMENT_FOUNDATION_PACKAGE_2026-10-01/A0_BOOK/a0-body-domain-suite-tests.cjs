const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('./a0-body-domain-suite.js'),record=require('./assets/a0-body-domain-suite-v1.json');
let checks=0;const ok=(value,message)=>{checks++;assert.ok(value,message)};
ok(api.VERSION==='1.0.0','version');ok(api.roles.length===7,'seven typed roles');ok(api.domains.length===6,'six governed domain projections');
for(const id of ['CARRIER-48','HOST-BLUE','BLUE-01','BLUE-02','PINK-01','PINK-02','RETURN-00'])ok(api.roles.some(role=>role.id===id),id);
ok(api.roles.filter(role=>role.kind==='blue'||role.kind==='pink').length===4,'four satellites');ok(api.roles.filter(role=>role.kind==='return').length===1,'one return body');
ok(record.identity_action==='REUSE_EXTEND_RELATE','governance action');ok(record.counts.display_face_slots===60,'60 display slots');ok(record.counts.source_carriers===1,'one source carrier');
for(const file of record.surfaces){const html=fs.readFileSync(path.join(__dirname,file),'utf8');ok(html.includes('data-body-domain-suite'),`${file} mount`);ok(html.includes('a0-body-domain-suite.css'),`${file} css`);ok(html.includes('a0-body-domain-suite.js'),`${file} js`)}
for(const domain of api.domains){const[file,hash]=domain.target.split('#'),html=fs.readFileSync(path.join(__dirname,file),'utf8');ok(!hash||html.includes(`id="${hash}"`),`${domain.id} target`)}
ok(record.claim_boundary.includes('NO_NEW_CARRIER'),'carrier boundary');ok(record.claim_boundary.includes('NO_NEW_FAMILY'),'family boundary');
ok(fs.readFileSync(path.join(__dirname,'assets/a0-blue-body-interior-crt16-v1.js'),'utf8').includes('if (phaseOutput)'), 'optional phase output is null-safe');
ok(fs.readFileSync(path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html'),'utf8').includes('Math.max(0,now-last)'), 'animation delta is finite and nonnegative');
ok(fs.readFileSync(path.join(__dirname,'a0-body-domain-suite.js'),'utf8').includes('win.A0BodyDomainSuiteController=controllers[0]'),'guided tour can address the mounted suite');
console.log(JSON.stringify({status:'PASS',checks,roles:api.roles.length,domains:api.domains.length}));
