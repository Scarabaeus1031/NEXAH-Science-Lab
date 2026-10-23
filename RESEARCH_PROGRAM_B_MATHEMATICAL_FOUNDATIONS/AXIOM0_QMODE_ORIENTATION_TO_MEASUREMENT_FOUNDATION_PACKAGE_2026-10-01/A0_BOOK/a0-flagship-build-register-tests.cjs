"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++};
const root=__dirname;
const record=JSON.parse(fs.readFileSync(path.join(root,"results/a0-flagship-build-register-2026-10-23.json"),"utf8"));
const report=fs.readFileSync(path.join(root,"A0_FLAGSHIP_BUILD_REGISTER_2026-10-23.md"),"utf8");
const exhibit=fs.readFileSync(path.join(root,"A0_BENCH_ENTDECKEN.html"),"utf8");
const desk=fs.readFileSync(path.join(root,"A0_RESEARCH_DESK.html"),"utf8");
ok(record.flagships.length===6,"six existing flagship rooms");
ok(record.demonstrator_chips.length===3,"three subordinate demonstrator chips");
ok(record.decision==="NO_SEVENTH_FLAGSHIP_REQUIRED_HARDEN_CURRENT_SIX","curation decision explicit");
ok(record.governance.new_navigator_identities===0&&record.governance.new_graph_relations===0,"no graph expansion");
ok(record.flagships.every(x=>x.score>=0&&x.score<=10&&x.route),"bounded scores and routes");
ok(new Set(record.flagships.map(x=>x.chip)).size===6,"unique flagship chips");
ok(new Set(record.demonstrator_chips.map(x=>x.chip)).size===3,"unique demonstrator chips");
for(const item of [...record.flagships,...record.demonstrator_chips]){
  const [file,anchor]=item.route.split("#"),html=fs.readFileSync(path.join(root,file),"utf8");
  const linkedScripts=[...html.matchAll(/<script[^>]+src="([^"?#]+)[^"]*"/g)]
    .map(match=>match[1]).filter(src=>!/^https?:/.test(src)&&fs.existsSync(path.join(root,src)))
    .map(src=>fs.readFileSync(path.join(root,src),"utf8")).join("\n");
  ok((html+linkedScripts).includes('id="'+anchor+'"')||(html+linkedScripts).includes("id='"+anchor+"'"),item.chip+" route target exists");
}
ok(report.includes("The total is a curation score, not an evidence score."),"rating boundary in human report");
ok(report.includes("New Navigator identities: `0`"),"identity boundary in human report");
ok(exhibit.includes("id=\"flagship-currentness\""),"exhibition links currentness panel");
ok(desk.includes("id=\"flagship-build-register-20261023\""),"Science Desk exposes register");
ok(desk.includes("class=\"flagship-register-icon\""),"Science Desk exposes register icon");
ok((desk.match(/data-flagship-chip=/g)||[]).length===6,"register icon carries six flagship chips");
ok(desk.includes("results/a0-flagship-build-register-2026-10-23.json"),"Science Desk exposes machine record");
ok(desk.includes("Mission Control · 23.10."),"Science Desk exposes current Mission Control return");
console.log(JSON.stringify({status:"PASS",checks,flagships:6,demonstrator_chips:3,scope:"curation and route integrity only; no scientific replay"}));
