#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const here=__dirname;
const failures=[];
let checks=0;
const expect=(condition,label)=>{checks++;if(!condition)failures.push(label);};
const read=file=>fs.readFileSync(path.join(here,file),"utf8");
const exists=file=>fs.existsSync(path.join(here,file));
const html=read("A0_WERKBANK.html");
const desk=read("A0_RESEARCH_DESK.html");
const js=read("a0-consolidation-master-map.js");
const css=read("a0-consolidation-master-map.css");
const receipt=JSON.parse(read("results/a0-consolidation-master-map-2026-11-22.json"));
expect(html.includes('id="a0ConsolidationMasterMap"'),"master map anchor");
expect(html.includes("a0-consolidation-master-map.css"),"master map css mounted");
expect(html.includes("a0-consolidation-master-map.js"),"master map js mounted");
expect(desk.includes('id="a0-master-map-consolidation-return-20261122"'),"science desk return");
for(const level of ["exact","bounded","view","metaphor"]){
  expect(html.includes(`data-amm-claim-row="${level}"`),`claim row ${level}`);
  expect(html.includes(`data-amm-claim-filter="${level}"`),`claim filter ${level}`);
}
expect((html.match(/data-amm-claims=/g)||[]).length===6,"six master routes");
expect((html.match(/data-amm-asset-role=/g)||[]).length===5,"five curated asset entries");
for(const file of receipt.masterRoutes.map(item=>item.path))expect(exists(file),`route exists ${file}`);
for(const file of ["A0_ASSET_INDEX.html","A0_PRIMECUBE_GAP_FOLD_LAB.html","A0_HELIX_VIEW_ADAPTER.html","A0_BLUE_PINK_DODECA_CELL_RETURN.html","A0_CRT_ROOT_BOUNDARY_AUDIT.html","A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html","A0_AXIS08_FOLD_RETURN_SEQUENCER.html"])expect(exists(file),`host exists ${file}`);
expect(receipt.identityDecision.action==="REUSE_AND_EXTEND_EXISTING_WORKBENCH_LENS","identity reuse");
expect(receipt.claimBoundary.graphDelta===0&&receipt.claimBoundary.newCanonicalIds===0&&receipt.claimBoundary.newRelations===0,"zero graph delta");
expect(receipt.claimBoundary.publicationAuthorized===false&&receipt.claimBoundary.studyActivated===false,"no publication or activation");
expect(receipt.assetDecision.duplicateBytes===0&&receipt.assetDecision.newGeometry===0,"no asset or geometry duplication");
expect(js.includes("data-amm-claim-filter")&&js.includes("data-amm-asset-filter"),"filter logic");
expect(css.includes(".a0-master-map")&&css.includes(".amm-matrix"),"scoped styles");
const localAssets=receipt.assets.filter(item=>item.localPath);
for(const asset of localAssets){
  const target=path.join(here,asset.localPath);
  expect(fs.existsSync(target),`asset exists ${asset.id}`);
  if(fs.existsSync(target))expect(crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")===asset.sha256,`asset hash ${asset.id}`);
}
const sourceAssets=receipt.assets.filter(item=>item.sourcePath);
for(const asset of sourceAssets){
  expect(fs.existsSync(asset.sourcePath),`source asset exists ${asset.id}`);
  if(fs.existsSync(asset.sourcePath))expect(crypto.createHash("sha256").update(fs.readFileSync(asset.sourcePath)).digest("hex")===asset.sha256,`source asset hash ${asset.id}`);
}
console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",checks,rule:"ONE_EXISTING_WORKBENCH_LENS_NO_DUPLICATE_REGISTER",failures},null,2));
process.exitCode=failures.length?1:0;
