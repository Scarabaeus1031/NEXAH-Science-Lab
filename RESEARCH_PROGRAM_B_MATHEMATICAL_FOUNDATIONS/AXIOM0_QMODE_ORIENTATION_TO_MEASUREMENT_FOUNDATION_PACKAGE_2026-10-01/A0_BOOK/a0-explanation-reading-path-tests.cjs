const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,pages=['DRAFTS/A0_HUMAN_BOOK_DRAFT.html','A0_THEORY_STORYBOARD.html','A0_LIVING_BLUEPRINT.html','A0_SCIENTIFIC_POSITION_REPORT.html'],routePages=['A0_NEXAH_APERTURE_JOURNEY.html','A0_THEORY_STORYBOARD.html','A0_LIVING_BLUEPRINT.html','A0_SCIENTIFIC_POSITION_REPORT.html'];let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
for(let i=0;i<pages.length;i++){
 const html=fs.readFileSync(path.join(root,pages[i]),'utf8'),rail=html.match(/<nav class="a0-explanation-path"[\s\S]*?<\/nav>/)?.[0];
 ok(Boolean(rail),'visible reading rail '+pages[i]);
 ok((rail.match(/aria-current="step"/g)||[]).length===1,'one current step');
 ok(rail.includes('Erklärweg · '+(i+1)+' von 4'),'correct step');
 for(const p of routePages)ok(rail.includes('href="'+p+'#'),'all stations reachable');
 ok(html.includes('class="a0-explanation-next"'),'forward/back block');
 ok(html.includes('keine Übertragung laufender Instrumentzustände'),'navigation boundary');
 if(i<3)ok(html.includes('Weiter: '+['Zusammenhänge verstehen','Gesamtkarte lesen','Ergebnisse & Grenzen'][i]),'next step');
 for(const [,href] of [...rail.matchAll(/href="([^"]+)"/g),...html.match(/<section class="a0-explanation-next"[\s\S]*?<\/section>/)[0].matchAll(/href="([^"]+)"/g)]){
  const [name,fragment]=href.split('#'),file=path.join(root,name);ok(fs.existsSync(file),'file '+name);if(fragment)ok(fs.readFileSync(file,'utf8').includes('id="'+fragment+'"'),'anchor '+href);
 }
}
const story=fs.readFileSync(path.join(root,pages[1]),'utf8'),model=require('./a0-theory-storyboard.js');
ok(!story.includes('Family Method / TOI · Storyboard'),'no vocabulary prerequisite in introduction');
ok(story.includes('<summary>Instrumente und fachliche Grenzen</summary>'),'technical details retained');
ok(model.scenes.length===7&&model.layers.length===4,'existing scene and layer counts');
for(const scene of model.scenes){ok(Boolean(scene.open)&&Boolean(scene.built),'boundaries and source pointers retained');ok(!/Families|Runtime|Ledger|H7\/O8|Ghostgons/.test(scene.title+' '+scene.teaser+' '+scene.question+' '+scene.idea),'plain-language primary copy');}
ok(fs.readFileSync(path.join(root,'A0_TOURS.html'),'utf8').includes('id="explanation-path"'),'existing tours hub offers main path');
ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('A0_TOURS.html#explanation-path'),'book entrance links main path');
ok(fs.readFileSync(path.join(root,'a0-explanation-reading-path.css'),'utf8').includes('repeat(2,minmax(0,1fr))'),'mobile rail wraps');
console.log(JSON.stringify({status:'PASS',checks,scope:'four-step editorial path, local anchors and retained boundaries; no browser/device acceptance'},null,2));
