'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const workbench=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8');
const desk=fs.readFileSync(path.join(root,'A0_RESEARCH_DESK.html'),'utf8');
const css=fs.readFileSync(path.join(root,'a0-bench-navigation.css'),'utf8');
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
ok(workbench.includes('id="typedMirrorWheelGateFinder"'),'permanent Workbench finder exists');
ok(workbench.includes('BEREITS GEBAUT · NICHT NEU BAUEN'),'finder exposes the duplicate-prevention instruction');
ok(workbench.includes('DRAFTS/A0_TYPED_MIRROR_ROTATION_COMPASS_DRAFT_2026-11-07.html#science-desk-return-crosswalk'),'finder routes to the single existing implementation');
ok(workbench.includes('A0_RESEARCH_DESK.html#typed-mirror-wheel-gate-closeout-20261108'),'finder routes to the Science Desk status');
ok(workbench.includes('id="typed-mirror-wheel-gate-demonstrator"'),'existing build appears in the Demonstrator inventory');
ok((workbench.match(/id="typedMirrorWheelGateFinder"/g)||[]).length===1,'finder identity occurs exactly once');
ok(css.includes('.bench-built-return')&&css.includes('@media(max-width:760px)'),'finder has responsive Workbench styling');
ok(workbench.includes('id="deskProductionRouting"'),'Desk-to-production routing audit exists in the Workbench');
ok(workbench.includes('NICHT BENCH · BEWUSST GETRENNT'),'routing audit keeps papers, history and policy outside the Bench');
ok(workbench.includes('Anti-Duplikat-Regel'),'routing audit states the duplicate-prevention contract');
ok(desk.includes('returns: new Set(["typed-mirror-wheel-gate-closeout-20261108"])'),'Typed Mirror closeout is explicitly classified as a Return');
ok(desk.includes('data-desk-view-button="archive">Historie / Parken</button>'),'Desk no longer presents the parking view as a general archive');
ok(desk.includes('id="desk-routing-8plus3"'),'Science Desk contains the 8+3 routing board');
ok(desk.includes('Acht vorhandene Objekte. Drei Anschlussrollen.'),'8+3 board distinguishes objects from routing roles');
ok(desk.includes('PROVISIONAL_ROUTING_MATRIX / NOT_CANONICAL_11_BODY_MODEL'),'8+3 board exposes its frozen non-canonical counting boundary');
ok(desk.includes('overview: new Set(["desk-routing-8plus3"'),'8+3 board is classified in the Desk overview');
for(const rel of [
  'downloads/NEXAH_Splinter_Geometrie_Offline_2026-10-27.html',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/curtain/NEXAH_PENTAGON_KNICK_CURTAIN_LAB.html',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/standalone/NEXAH_TEILER_STREIFEN_DESK_V4.html',
  'downloads/A0_THE_ONE_D1_D2_YUGO_INTAKE_2026-10-25/NEXAH_Yugo_One_Loop_Offline.html'
]) ok(fs.existsSync(path.join(root,rel)),`routed source exists: ${rel}`);
console.log(`PASS · ${checks} assertions · Typed Mirror finder + Desk production routing`);
