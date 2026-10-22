const fs=require('node:fs'),assert=require('node:assert/strict'),Notes=require('./build-a0-field-notes.cjs'),path=require('node:path');
let checks=0;const ok=v=>{assert.ok(v);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const md=fs.readFileSync(Notes.sourceFile,'utf8'),notes=Notes.parse(md),newNotes=notes.slice(41);
eq(newNotes.length,4);
for(const n of newNotes){eq(n.kind,'idea');for(const key of ['Gedanke','Quelle','Offen','Wieder aufnehmen, wenn','Stand','geparkt'])ok(n.body.includes(key));}
for(const label of ['1,1','F′','RETURN','12.6 / 13.7'])ok(newNotes.some(n=>n.title.includes(label)));
const desk=fs.readFileSync(__dirname+'/A0_RESEARCH_DESK.html','utf8'),workspace=fs.readFileSync(path.resolve(__dirname,'../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
ok(desk.includes('id="finding-intake-20261022"'));ok(workspace.includes('id="finding-intake-20261022"'));
const intake=workspace.split('## Finding intake / parked material')[1].split('<a id="club-control-return')[0];
ok(intake.includes('not a second'));ok(intake.includes('No manuscript'));ok(!/\| \x60F-A0-\d+/.test(intake));
eq(notes.filter(n=>n.kind==='idea').length,13);eq(notes.filter(n=>n.kind==='source').length,32);
const html=fs.readFileSync(Notes.outputFile,'utf8');eq(html,Notes.build(md));
for(const n of newNotes)ok(html.includes('id="'+n.id+'"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'existing notes store, four parked motifs with restart conditions, derived reader, no new finding/manuscript/status; browser pixels OPEN'}));
