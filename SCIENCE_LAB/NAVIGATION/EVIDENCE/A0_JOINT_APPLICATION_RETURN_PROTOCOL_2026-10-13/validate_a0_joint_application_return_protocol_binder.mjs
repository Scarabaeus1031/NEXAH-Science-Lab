import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,'../../../..');
const binderPath=path.join(here,'A0_JOINT_APPLICATION_RETURN_PROTOCOL_BINDER_V1_2026-10-13.json');
const binder=JSON.parse(fs.readFileSync(binderPath,'utf8'));
const failures=[];
let checks=0;
const check=(condition,message)=>{checks+=1;if(!condition)failures.push(message)};
const sha256=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

check(binder.node_id==='NN:A0_JOINT_APPLICATION_RETURN_PROTOCOL','stable node id');
check(binder.status==='INTERNAL_SOURCE_BOUND_ENGINEERING_LENS','bounded status');
check(binder.publication_authorized===false,'publication must remain false');
check(binder.science_run_activated===false,'science run must remain inactive');
check(binder.changes_canonical_module_count===false,'module count must not change');
check(binder.changes_canonical_family_count===false,'family count must not change');
check(binder.protocol.protocol_id==='A0:JARP:V1','protocol id');
check(binder.protocol.case_count===10,'ten cases');
check(binder.protocol.validator_check_count===52,'52 protocol checks');
check(binder.protocol.validator_status==='PASS','protocol validator pass');
check(Object.keys(binder.protocol.case_results).length===10,'ten case receipts');
check(binder.protocol.case_results['APP-05']==='PASS_NEGATIVE_CONTROL','negative control retained');
check(binder.protocol.case_results['APP-09']==='REJECT_IDENTITY_COLLAPSE','namespace rejection retained');
check(binder.extension.extension_id==='A0:JARP:X1','extension id');
check(binder.extension.extends_protocol==='A0:JARP:V1','extension parent');
check(binder.extension.frozen_core_unchanged===true,'frozen core unchanged');
check(binder.extension.case_count===8,'eight extension cases');
check(binder.extension.validator_check_count===64,'64 extension checks');
check(binder.extension.validator_status==='PASS','extension validator pass');
check(Object.keys(binder.extension.case_results).length===8,'eight extension receipts');
check(binder.extension.case_results['APP-16']==='PASS_NEGATIVE_CONTROL','LIFE E8 negative control retained');
check(binder.extension.case_results['APP-17']==='HOLD_UNRESOLVED_ALIAS','epsilon7 alias hold retained');
check(binder.extension.identity_findings.life_e8_identity===false,'LIFE E8 non-identity');
check(binder.extension.identity_findings.e8_specificity===false,'E8 specificity not established');
check(binder.extension.identity_findings.root7_norm_squared===7,'ROOT7 norm squared');
check(binder.extension.identity_findings.root7_axis_identifiable===false,'ROOT7 axis not identifiable');
check(binder.extension.identity_findings.epsilon7_source_definition_found===false,'epsilon7 definition absent');
check(binder.identity_reuse.module_ids.includes('MOD:TESSAREC'),'Tessarec reuse');
check(binder.identity_reuse.module_ids.includes('MOD:NUMBER_VIEW_SUITE'),'Number View reuse');
check(binder.identity_reuse.lens_ids.includes('NN:CRT_QRT_37_CARRIER_LADDER'),'CRT/QRT lens reuse');
check(binder.identity_reuse.lens_ids.includes('NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK'),'Q106 lens reuse');
check(binder.identity_reuse.lens_ids.includes('NEXAH:NAVIGATOR:ROOT7:LOOK:2026-10-08'),'ROOT7 lens reuse');
check(binder.identity_reuse.lens_ids.includes('NEXAH_LIFE_BOUNDARY_CYLINDER_LIFE08_2026_10_11'),'LIFE08 identity reuse');
check(binder.relations.length===8,'eight bounded relations');
check(new Set(binder.relations.map(item=>item.relation_id)).size===8,'unique relation ids');
check(binder.relations.every(item=>item.source_id===binder.node_id),'relation sources');
check(binder.sources.length===13,'thirteen hash-bound sources');

for(const source of binder.sources){
  const absolute=path.resolve(repoRoot,source.path);
  check(fs.existsSync(absolute),`source exists: ${source.path}`);
  if(fs.existsSync(absolute))check(sha256(absolute)===source.sha256,`source hash: ${source.path}`);
}

const result={status:failures.length?'FAIL':'PASS',checks,sources:binder.sources.length,relations:binder.relations.length,failures};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
