'use strict';
// Pure deterministic build; frozen sources remain read-only.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),P=require('./a0-life03-contract.js');
const SOURCES=[
  {
    "path": "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ORBIT_SCALE_LAB_V2_2026-10-07/scale-engine.js",
    "sha256": "f92b3c8a6dca74ee55a398191b64431740c1777f288fe395912a0345951ca660"
  },
  {
    "path": "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_DUAL_CLOCK_LIFE03_2026-10-07/index.html",
    "sha256": "6234a12fe8baf91b8b4fcd162871e74881aa7b0d1130c314bb926517bb4486e3"
  },
  {
    "path": "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_DUAL_CLOCK_LIFE03_2026-10-07/app.js",
    "sha256": "f3e5c1d07ac97166c1adeb1ecd43f9ea2eb5c8d18431f8863a796567502214dd"
  },
  {
    "path": "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_DUAL_CLOCK_LIFE03_2026-10-07/life-e8-engine.js",
    "sha256": "4c98cde7a75b36f1fd7bea644aa6cd5b095c0367ac3e2e2ec141fdefece1aa7e"
  },
  {
    "path": "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_DUAL_CLOCK_LIFE03_2026-10-07/styles.css",
    "sha256": "c3b58b3df4e996d44f9cc16e99d03d6e60f606653aa773d8fcff6ed2f166cef3"
  }
];
const read=n=>fs.readFileSync(path.resolve(__dirname,n),'utf8');
function build(){
 const values=SOURCES.map(s=>{const text=read(s.path);if(crypto.createHash('sha256').update(text).digest('hex')!==s.sha256)throw Error('LIFE03 source drift: '+s.path);return text;});
 if(crypto.createHash('sha256').update(JSON.stringify(SOURCES)).digest('hex')!==P.SOURCE_HASH)throw Error('source-set binding');
 let [scale,html,app,engine,css]=values;
 const marker='render();\n}());';if(app.split(marker).length!==2)throw Error('ambiguous authored render hook');
 const hook=String.raw`
stop();
for(const id of ['pattern','size','speed','tick','play','reset']){$(id).disabled=true;$(id).onclick=null;$(id).onchange=null;}
document.querySelectorAll('.mode').forEach(b=>{b.disabled=true;b.onclick=null;});
globalThis.A0Life03Child.install(window,{
 stop, timerRunning:()=>timer!==null,
 snapshot:()=>({mode,speed:Number($('speed').value),work:JSON.parse(JSON.stringify(work))}),
 restore:s=>{stop();mode=s.mode;work=JSON.parse(JSON.stringify(s.work));$('pattern').value=work.pattern;$('size').value=String(work.size);$('speed').value=String(s.speed);render();},
 step:()=>{stop();tick();},
 view:v=>{stop();mode=v;render();},
 readRendered:()=>({mode:document.querySelector('.mode.active').dataset.mode,pattern:$('pattern').value,size:Number($('size').value),speed:Number($('speed').value),generation:Number($('generation').textContent),e8Clock:$('e8Clock').textContent,rootAssignment:$('rootAssignment').textContent,trajectory:$('traceTrajectory').textContent})
},globalThis.A0Life03Contract);
render();
`;
 app=app.replace(marker,hook+'\n}());');
 html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>');
 // Links must leave the sandbox explicitly: no source page can replace its controlled document.
 html=html.replace(/<a href="[^"]*">([^<]*)<\/a>/g,'<span>$1 · siehe Quelllinks im A0-Parent</span>');
 const scripts=[scale,engine,read('a0-life03-contract.js'),read('a0-life03-child.js'),app].map(s=>'<script>'+s.replace(/<\/script/gi,'<\\/script')+'</script>').join('\n');
 const old='<script src="../NEXAH_LIFE_ORBIT_SCALE_LAB_V2_2026-10-07/scale-engine.js"></script><script src="life-e8-engine.js"></script><script src="app.js"></script>';
 if(!html.includes(old))throw Error('source script structure changed');
 html=html.replace(old,scripts);
 const csp="<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'\">";
 html=html.replace('<head>','<head>'+csp).replace('<body>','<body><p style="padding:12px;border:1px solid #416375">A0 source-derived LIFE03 · Blinker 64×64 · lokale Uhr gesperrt · nur bestätigte Parent-Befehle · höchstens 32 Generationen · keine wissenschaftliche Ausführung oder neue Ergebnisbewertung.</p>');
 return html.trimEnd()+'\n';
}
module.exports={build,SOURCES};if(require.main===module)process.stdout.write(build());
