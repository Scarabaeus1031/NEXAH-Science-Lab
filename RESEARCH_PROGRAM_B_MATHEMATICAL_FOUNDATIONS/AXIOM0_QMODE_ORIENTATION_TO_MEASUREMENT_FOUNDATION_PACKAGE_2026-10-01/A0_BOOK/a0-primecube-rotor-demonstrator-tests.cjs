const assert=require('node:assert/strict');
const fs=require('node:fs');
const D=require('./a0-primecube-rotor-demonstrator.js');
let passed=0;
function check(label,fn){fn();passed++;console.log(`PASS ${label}`)}

check('four typed modes are frozen',()=>assert.deepEqual(D.MODES,['ROTOR','HANDLE_101','CONTROL_369','JOINT_89']));
check('index normalization wraps both directions',()=>assert.deepEqual([D.normalizeIndex(-1,10),D.normalizeIndex(10,10),D.normalizeIndex(11,10)],[9,0,1]));
check('rotor begins with exact 2 to 4 map',()=>assert.deepEqual([D.view('ROTOR',0).current,D.view('ROTOR',0).next],[2,4]));
check('rotor returns from 1 to 2 at step ten',()=>assert.deepEqual([D.view('ROTOR',9).current,D.view('ROTOR',9).next],[1,2]));
check('101 handle keeps integer inequality visible',()=>assert.match(D.view('HANDLE_101').status,/2501≠2×101/));
check('3 6 9 control fails closure',()=>assert.equal(D.view('CONTROL_369').status,'FAIL_CLOSED_SUBSET'));
check('3 6 9 control retains Root2 hold',()=>assert.match(D.view('CONTROL_369').detail,/Root2 remains HOLD/));
check('8 9 joint retains prime index return',()=>assert.match(D.view('JOINT_89').status,/83=p₂₃ · 23\|3565/));
check('8 9 joint exposes typed arithmetic',()=>assert.equal(D.view('JOINT_89').equation,'8+9=17 · 8×9=72 · (8/9)(9/8)=1'));
check('SVG identifies the exact rotor operator',()=>assert.match(D.stageSvg(D.view('ROTOR',2)),/r ↦ 2r mod 11/));
check('SVG highlights a directed current edge',()=>assert.match(D.stageSvg(D.view('ROTOR',2)),/marker-end="url\(#rotorArrow\)"/));
check('unknown mode fails visibly',()=>assert.throws(()=>D.view('ROOT2'),RangeError));

const html=fs.readFileSync('./A0_PRIMECUBE_GAP_FOLD_LAB.html','utf8');
for(const marker of ['id="mod11-rotor-demonstrator"','data-pc-rotor-demo','data-pc-rotor-mode="ROTOR"','data-pc-rotor-mode="HANDLE_101"','data-pc-rotor-mode="CONTROL_369"','data-pc-rotor-mode="JOINT_89"','data-pc-rotor-prev','data-pc-rotor-next','data-pc-rotor-run','data-pc-rotor-reset','data-pc-rotor-stage','data-pc-rotor-detail','a0-primecube-rotor-demonstrator.js'])check(`HTML marker ${marker}`,()=>assert.ok(html.includes(marker)));

console.log(JSON.stringify({suite:'a0-primecube-rotor-demonstrator',passed,status:'PASS'},null,2));
