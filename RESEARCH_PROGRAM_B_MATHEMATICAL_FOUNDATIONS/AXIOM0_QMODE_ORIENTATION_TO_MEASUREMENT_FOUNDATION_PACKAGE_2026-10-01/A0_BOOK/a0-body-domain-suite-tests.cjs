const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('./a0-body-domain-suite.js'),record=require('./assets/a0-body-domain-suite-v1.json');
let checks=0;const ok=(value,message)=>{checks++;assert.ok(value,message)};
ok(api.VERSION==='1.3.0','version');ok(api.roles.length===7,'seven typed roles');ok(api.domains.length===6,'six governed domain projections');
ok(api.IDEAL_BODY_ROUTE.angles.join('/')==='60/90/90','ordered three-axis body route');ok(api.IDEAL_BODY_ROUTE.tlAxis===1,'TL is the first 60-degree axis');ok(api.IDEAL_BODY_ROUTE.tlRole==='TOPOLOGICAL_LASSO','TL typed as topological lasso');ok(api.IDEAL_BODY_ROUTE.distributionRole==='TUB_OPERATOR_DISTRIBUTION','TUB three-axis view role');ok(api.IDEAL_BODY_ROUTE.axisCount===3,'three axes');ok(api.IDEAL_BODY_ROUTE.mnemonic==='T · EF · LO_in','T EF LO in mnemonic');ok(api.IDEAL_BODY_ROUTE.topologyClaim===false,'ideal route makes no topology proof');ok(api.IDEAL_BODY_ROUTE.operatorClaim===false,'TUB distribution makes no new operator claim');
for(const id of ['CARRIER-48','HOST-BLUE','BLUE-01','BLUE-02','PINK-01','PINK-02','RETURN-00'])ok(api.roles.some(role=>role.id===id),id);
ok(api.roles.filter(role=>role.kind==='blue'||role.kind==='pink').length===4,'four satellites');ok(api.roles.filter(role=>role.kind==='return').length===1,'one return body');
ok(record.identity_action==='REUSE_EXTEND_RELATE','governance action');ok(record.counts.display_face_slots===60,'60 display slots');ok(record.counts.source_carriers===1,'one source carrier');
for(const file of record.surfaces){const html=fs.readFileSync(path.join(__dirname,file),'utf8');ok(html.includes('data-body-domain-suite'),`${file} mount`);ok(html.includes('a0-body-domain-suite.css'),`${file} css`);ok(html.includes('a0-body-domain-suite.js'),`${file} js`)}
for(const file of record.surfaces){const html=fs.readFileSync(path.join(__dirname,file),'utf8');ok(html.includes('a0-body-domain-tl-route.css'),`${file} TL route css`)}
const suiteSource=fs.readFileSync(path.join(__dirname,'a0-body-domain-suite.js'),'utf8');for(const token of ['1 · 60° · TL','2 · 90°','3 · 90°','TUB OPERATOR DISTRIBUTION · 3 AXES','T · EF · LOᵢₙ','TOPOLOGICAL LASSO','data-bds-ideal-route'])ok(suiteSource.includes(token),`suite exposes ${token}`);
for(const token of ['LIVE ROLE ROUTER','48 → BODY → 4+1 → RETURN','bds-flow-particles','bds-return-ripples','SOURCE FLOW · HOST RESPONSE · SATELLITE HANDOFF · RETURN PULSE'])ok(api.visualMarkup().includes(token),`live router exposes ${token}`);
const suiteCss=fs.readFileSync(path.join(__dirname,'a0-body-domain-suite.css'),'utf8');for(const token of ['bdsTravel','bdsFieldRotate','bdsHostBreathe','prefers-reduced-motion'])ok(suiteCss.includes(token),`live router CSS exposes ${token}`);
for(const domain of api.domains){const[file,hash]=domain.target.split('#'),html=fs.readFileSync(path.join(__dirname,file),'utf8');ok(!hash||html.includes(`id="${hash}"`),`${domain.id} target`)}
ok(record.claim_boundary.includes('NO_NEW_CARRIER'),'carrier boundary');ok(record.claim_boundary.includes('NO_NEW_FAMILY'),'family boundary');
ok(fs.readFileSync(path.join(__dirname,'assets/a0-blue-body-interior-crt16-v1.js'),'utf8').includes('if (phaseOutput)'), 'optional phase output is null-safe');
ok(fs.readFileSync(path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html'),'utf8').includes('Math.max(0,now-last)'), 'animation delta is finite and nonnegative');
ok(fs.readFileSync(path.join(__dirname,'a0-body-domain-suite.js'),'utf8').includes('win.A0BodyDomainSuiteController=controllers[0]'),'guided tour can address the mounted suite');
console.log(JSON.stringify({status:'PASS',checks,roles:api.roles.length,domains:api.domains.length}));
