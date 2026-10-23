'use strict';

const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');

const here=__dirname;
const navRoot=path.resolve(here,'../../../SCIENCE_LAB/NAVIGATION');
const freezeSnapshotPath=path.join(navRoot,'FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_SNAPSHOT.json');
const freezeRecordPath=path.join(navRoot,'FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_RECORD.md');
const adapterPath=path.join(navRoot,'BUILD/build_registry_exports.mjs');
const verifierPath=path.join(navRoot,'BUILD/verify_registry_exports.mjs');
const currentDistPath=path.join(navRoot,'BUILD/registry-dist/navigator.internal.json');

const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'));

function auditTyped170(){
  const freeze=readJson(freezeSnapshotPath);
  const freezeRecord=fs.readFileSync(freezeRecordPath,'utf8');
  const adapter=fs.readFileSync(adapterPath,'utf8');
  const currentDist=readJson(currentDistPath);
  const regenerated=JSON.parse(child.execFileSync(process.execPath,[verifierPath],{cwd:navRoot,encoding:'utf8'}));
  const baseline=freeze.baseline;
  const generatorEvidence={
    entityCount:baseline.internal_entities,
    rejectionCount:baseline.fail_closed_rejections,
    typedRelations:baseline.typed_relations,
    frozen:freeze.state==='FROZEN',
    sourceBound:/INTERNAL_MANIFEST = 170 entities \/ 23 typed relations/.test(freezeRecord),
    deterministicAdapter:/const rejected = internalEntities\.map/.test(adapter)&&/entities: internalEntities/.test(adapter),
    currentDistEntities:currentDist.entities.length,
    regeneratedEntities:regenerated.internal_entities,
    regeneratedRelations:regenerated.internal_relations,
    regeneratedPass:regenerated.status==='PASS'
  };
  const admission={
    exactValue170:generatorEvidence.entityCount===170,
    explicitSemanticType:true,
    sourceAndGeneratorBound:generatorEvidence.sourceBound&&generatorEvidence.deterministicAdapter,
    reproducibleFrozenReceipt:generatorEvidence.frozen,
    sameRoleAs252And332:false,
    sameGeneratingContractAs252And332:false,
    currentLikeForLikeCounter:generatorEvidence.regeneratedEntities===170
  };
  const records=[
    {value:170,type:'navigator_internal_entity_count',role:'registry_population',state:'FROZEN_HISTORICAL_BASELINE',source:path.relative(here,freezeSnapshotPath),generator:path.relative(here,adapterPath),admittedAsTyped170:true,compatibleWithCensusSequence:false},
    {value:170,type:'fail_closed_rejection_count',role:'one_rejection_per_internal_entity',state:'DERIVED_FROM_SAME_FROZEN_POPULATION',source:path.relative(here,freezeSnapshotPath),generator:path.relative(here,adapterPath),admittedAsTyped170:true,independentRecord:false,compatibleWithCensusSequence:false}
  ];
  const status=admission.exactValue170&&admission.sourceAndGeneratorBound&&!admission.sameRoleAs252And332
    ?'TYPED_170_LOCATED_ROLE_AND_GENERATOR_MISMATCH'
    :'NO_ADMISSIBLE_TYPED_170';
  const checks=[
    baseline.internal_entities===170,
    baseline.fail_closed_rejections===170,
    baseline.typed_relations===23,
    freeze.state==='FROZEN',
    freeze.visibility==='not_public',
    freeze.publication_authorized===false,
    generatorEvidence.sourceBound,
    generatorEvidence.deterministicAdapter,
    generatorEvidence.regeneratedPass,
    currentDist.entities.length!==170,
    regenerated.internal_entities!==170,
    records.length===2,
    records[1].independentRecord===false,
    admission.sameRoleAs252And332===false,
    admission.sameGeneratingContractAs252And332===false,
    status==='TYPED_170_LOCATED_ROLE_AND_GENERATOR_MISMATCH'
  ];
  return {
    schema:'nexah.a0.typed-170-source-audit/1',
    date:'2026-10-23',
    status,
    admissionContract:{
      required:['exact value 170','explicit semantic type','source and generator binding','reproducible record','same role as the compared counters','same generating contract as the compared counters','compatible currentness'],
      rule:'A numerical hit is not a sequence rung unless all seven conditions hold.'
    },
    records,
    comparison:{
      typed170:'registry entities / derived public rejections',
      observed252:'Navigator app predicates and HTML artifact coverage',
      observed332:'Coupled Window test assertions',
      likeForLike:false,
      reason:'The values count different object classes, use different generators, and belong to different currentness states.'
    },
    currentness:{
      frozenV1Entities:170,
      checkedInRegistryDistEntities:generatorEvidence.currentDistEntities,
      regeneratedAdapterEntities:generatorEvidence.regeneratedEntities,
      regeneratedAdapterRelations:generatorEvidence.regeneratedRelations,
      note:'The 170 record is real and reproducible as a frozen v1 receipt, but it is not the current output cardinality of the same adapter.'
    },
    excludedHitClasses:['SVG/CSS coordinates and sizes','plot marker sizes, DPI and color maxima','hash substrings','dates and filename fragments','per-artifact local_href_count fields','untyped prose occurrences'],
    decision:{sequenceEstablished:false,classification:'CANDIDATE_PATTERN_TYPED_170_ROLE_MISMATCH',nextGate:'KEEP_AS_CROSS_LEDGER_RESONANCE_UNLESS_A_LIKE_FOR_LIKE_170_CHANNEL_RECORD_PREEXISTS',promotionAuthorized:false},
    authority:{researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newFamily:false,newStudy:false,publicationAuthorized:false},
    audit:{status:checks.every(Boolean)?'PASS':'FAIL',checks:checks.length,passed:checks.filter(Boolean).length}
  };
}

if(require.main===module){
  const result=auditTyped170();
  console.log(JSON.stringify(result,null,2));
  process.exitCode=result.audit.status==='PASS'?0:1;
}

module.exports={auditTyped170};
