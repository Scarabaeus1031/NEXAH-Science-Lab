const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=__dirname;
const html=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8');
let checks=0;
const ok=(value,label)=>{assert.ok(value,label);checks++};
for(const token of ['id="pinkKeystoneAxis"','11 in Pink','TD‑Janus · O6','LY · I ↔ J','7 × 4 TESA','28 / 28 RETURN','G11 · self-paired','Pantone‑Pink','keine neue Identity oder Source‑Graph‑Relation'])ok(html.includes(token),token);
for(const anchor of ['nmAxisSwitch','tesaZitherTranslator','octaveRailCoilReturn','pascalJointCounterweight'])ok(html.includes(`id="${anchor}"`),anchor);
const external='A0_BLUE_PINK_DODECA_CELL_RETURN.html';
const externalHtml=fs.readFileSync(path.join(root,external),'utf8');
ok(externalHtml.includes('id="acRouterTitle"'),'TD-Janus anchor');
for(const target of ['A0_NUMBERMAGICK_GRID_RESEARCH.html#ioi-keystone-2501-101-bridge-20261104','A0_METHOD.html#floor-zero-method']){
  const [file,anchor]=target.split('#');
  ok(fs.existsSync(path.join(root,file)),file);
  ok(fs.readFileSync(path.join(root,file),'utf8').includes(`id="${anchor}"`),target);
}
ok(html.indexOf('id="pinkKeystoneAxis"')<html.indexOf('id="workbenchSwitchboard"'),'route precedes switchboard');
console.log(JSON.stringify({status:'PASS',checks,scope:'existing workbench route lens only; no new identity or relation'}));
