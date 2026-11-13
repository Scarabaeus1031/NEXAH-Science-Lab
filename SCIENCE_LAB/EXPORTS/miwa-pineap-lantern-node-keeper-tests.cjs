'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'MIWA_PINEAP_AN_DROMEDA.html'),'utf8');

test('MIWA master retains Lantern frame and observer-local Node Keeper',()=>{
  assert.match(html,/Laterne · Vorhang · Schattenspiel/);
  assert.match(html,/LATERNE-SCHATTEN-SCHNITT/);
  assert.match(html,/Scarab · Node Keeper/);
  assert.match(html,/PINEAL \/ PINEAPPLE APERTURE/);
  assert.match(html,/π · PHASE CANOPY/);
  assert.match(html,/not a physical carrier coupling or Source Graph relation/);
});

test('MIWA inline runtime remains syntactically valid',()=>{
  const scripts=[...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(source=>source.trim());
  assert.ok(scripts.length>0);
  scripts.forEach(source=>assert.doesNotThrow(()=>new Function(source)));
});

test('MIWA reuses the bounded light-time module without inventing carrier distance',()=>{
  assert.match(html,/LICHTLAUFZEIT · RECORD/);
  assert.match(html,/a0-light-time-measurement-bridge\.js\?rev=20261113-r2/);
  assert.match(html,/distance_parsec/);
  assert.match(html,/Prozedurale Position ist keine Distanzmessung/);
  assert.match(html,/\['SIRIUS','ALPHA_CANIS_MAJORIS'\]/);
  assert.match(html,/light_time_ledger:lightTimeLedgerSnapshot\(\)/);
  assert.match(html,/authority:false,graph_delta:0/);
  assert.match(html,/VOLLE LICHTZEIT-LINSE ÖFFNEN/);
});

test('MIWA Distance Threads separates bound records from unscaled frame nodes',()=>{
  assert.match(html,/data-frame="threads">Distanzfäden/);
  assert.match(html,/function drawDistanceThreads\(\)/);
  assert.match(html,/NEWTON[\s\S]*LEIBNIZ[\s\S]*GOETHE/);
  assert.match(html,/SOLID = DECLARED DISTANCE INPUT · DASHED = FRAME NODE WITHOUT COMMON SCALE/);
  assert.match(html,/SOLAR SYSTEM[\s\S]*SATURN · TITAN[\s\S]*URANUS · MOONS[\s\S]*MILKY WAY \/ M31/);
  assert.match(html,/Visual navigation lens only/);
  assert.match(html,/location\.hash==='\#distanceThreads'/);
  assert.match(html,/NEWTON · LEIBNIZ · GOETHE OBSERVER LENS/);
});

test('MIWA exposes explicit empty records and a bounded responsive reading route',()=>{
  assert.match(html,/id="nodeRecordState">WARTET/);
  assert.match(html,/id="starEmptyState"><b>Noch kein Stern gewählt/);
  assert.match(html,/ui\.starEmptyState\.hidden=Boolean\(meta\)/);
  assert.match(html,/@media\(max-width:720px\)\{html,body\{height:auto/);
  assert.match(html,/\.starcard\{order:2;display:block/);
  assert.match(html,/\.controls\{order:3;display:block/);
});

test('MIWA links the non-active scale and epoch design gate',()=>{
  assert.match(html,/MIWA_SCALE_EPOCH_DESIGN_GATE\.md/);
  const gate=fs.readFileSync(path.join(__dirname,'MIWA_SCALE_EPOCH_DESIGN_GATE.md'),'utf8');
  assert.match(gate,/DESIGN_ONLY \/ NOT ADMITTED \/ NOT ACTIVE/);
  assert.match(gate,/20,000/);
  assert.match(gate,/Human Owner authorization/);
});

test('MIWA Gaia bridge keeps catalog provenance, epoch and distance method visible',()=>{
  assert.match(html,/MIWA_GAIA_BRIDGE_README\.md/);
  assert.match(html,/function catalogProvenance\(row,filename\)/);
  assert.match(html,/epoch:first\(row,\['epoch','ref_epoch','obstime'\]\)/);
  assert.match(html,/source_catalog:first\(row,\['source_catalog','catalog_name'\]\)/);
  assert.match(html,/distance_method:first\(row,\['distance_method'\]\)/);
  assert.match(html,/field_role:first\(row,\['field_role'\]\)/);
  assert.match(html,/claim_boundary:first\(row,\['claim_boundary'\]\)/);
});

test('MIWA loads all three Gaia presets locally while retaining manual import',()=>{
  assert.match(html,/MIWA_GAIA_PRESETS\.js\?rev=20261113-r1/);
  assert.match(html,/data-gaia-preset="bright-nearby"/);
  assert.match(html,/data-gaia-preset="sirius-neighborhood"/);
  assert.match(html,/data-gaia-preset="andromeda-field"/);
  assert.match(html,/function activateCatalogRows\(rows,filename,source=\{\}\)/);
  assert.match(html,/source_type:'GAIA_PRESET_BUNDLE'/);
  assert.match(html,/id="catalogFile"/);
});

test('MIWA editorial entrance explains the reading order and preset boundary',()=>{
  assert.match(html,/NEXAH SKY THREADS · OBSERVER CUT/);
  assert.match(html,/01 · FIELD/);
  assert.match(html,/02 · APERTURE/);
  assert.match(html,/03 · RECORD/);
  assert.match(html,/id="gaiaPresetNote"/);
  assert.match(html,/ui\.gaiaPresetNote\.textContent=preset\.boundary/);
  assert.match(html,/Bildschirmnähe ist keine physische Verbindung/);
  assert.match(html,/A0_NEXAH_APERTURE_JOURNEY\.html#a0-human-apps/);
});
