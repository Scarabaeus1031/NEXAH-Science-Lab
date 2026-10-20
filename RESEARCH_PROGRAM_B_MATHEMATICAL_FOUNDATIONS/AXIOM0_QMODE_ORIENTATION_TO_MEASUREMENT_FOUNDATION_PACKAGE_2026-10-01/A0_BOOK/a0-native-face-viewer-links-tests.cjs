'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
const css=fs.readFileSync('./a0-native-face-ninefold.css','utf8');
const coupled=fs.readFileSync('./a0-coupled-window.js','utf8');
let checks=0;
function ok(value,message){assert.ok(value,message);checks++}
const bridge=html.slice(html.indexOf('id="nativeFaceBridge"'),html.indexOf('id="fourApertureNinefold"'));
ok(bridge.includes('data-reader-viewer'),'Native Face exposes the in-place reader viewer');
ok(bridge.includes('target="_blank"')&&bridge.includes('rel="noopener"'),'Native Face exposes a safe new-tab route');
ok((bridge.match(/A0_BLUE_PINK_DODECA_CELL_RETURN\.html\?bridge=1#cell-machine/g)||[]).length===3,'frame, viewer and new tab use the same source target');
ok(bridge.includes('data-module-id="A0-VIEW-BLUE-PINK-DODECA-CELL-RETURN"'),'existing source identity is exposed');
ok(bridge.includes('data-focus-target="cell-machine"')&&bridge.includes('data-binding-type="source-view"'),'focus and binding metadata are exposed');
ok(coupled.includes("a[data-reader-viewer]"),'existing Coupled Window listener owns the viewer route');
ok(coupled.includes('rememberReadingPlace()')&&coupled.includes('returnScroll'),'viewer preserves and restores reading position');
ok(css.includes('.native-face-openers')&&css.includes('@media(max-width:560px)'),'desktop and phone controls are styled');
console.log(JSON.stringify({status:'PASS',checks,scope:'Native Face source viewer and safe new-tab route; existing source identity reused'}));
