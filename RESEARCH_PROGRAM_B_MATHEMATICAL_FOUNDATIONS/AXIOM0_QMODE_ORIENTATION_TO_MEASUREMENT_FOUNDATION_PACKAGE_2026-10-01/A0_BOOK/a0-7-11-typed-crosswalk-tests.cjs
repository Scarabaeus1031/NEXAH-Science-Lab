const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++};
const file=path.join(__dirname,'A0_7_11_TYPED_CROSSWALK.html'),html=fs.readFileSync(file,'utf8');
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){const [raw,anchor]=match[1].split('#'),target=path.resolve(__dirname,raw.split('?')[0]||'A0_7_11_TYPED_CROSSWALK.html');ok(fs.existsSync(target),match[1]);if(anchor&&!target.endsWith('/NAVIGATION/APP/index.html'))ok(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),anchor);}
for(const phrase of ['Zwei Adresszahlen','7×8 = 56','11×11 = 121','11 Matches, 110 Residuen','Kein universeller 7/11-Operator','keine gleiche Struktur','P7 ist Ansicht','keine elf zusätzlichen Gelenke','Neue universelle Operatoren'])ok(html.includes(phrase),phrase);
ok((html.match(/<tr>/g)||[]).length===6,'header plus five source rows');ok(!/<iframe|https?:\/\/|autoplay|fetch\(/.test(html),'no remote or active embed');
console.log(JSON.stringify({status:'PASS',checks,scope:'7/11 source-bound comparative view; local routes and claim boundaries'}));
