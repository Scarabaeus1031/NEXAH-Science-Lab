const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Tube=require('./assets/a0-field-notes/tube-routing.js');
let checks=0;
const ok=(value,label)=>{assert.ok(value,label);checks++;};

const s0=Tube.reset();
const s1=Tube.next(s0);
const s2=Tube.next(s1);
const s3=Tube.next(s2);
ok(s0.phase==='INPUT'&&s0.inputRecord==='SRC:G7'&&s0.status==='PENDING','input record is explicit');
ok(s1.phase==='ROUTE'&&s1.rule==='PRIME_INDEX(n)','routing rule is explicit');
ok(s2.phase==='OUTPUT'&&s2.outputAddress==='Q17'&&s2.outputValue===17,'output address is explicit');
ok(s3.phase==='RETURN'&&s3.returnKey==='G7'&&s3.status==='PASS'&&Tube.verify(s3),'matching key closes exact return');
const fail=Tube.derive(3,'mismatch');
ok(fail.returnKey==='G8'&&fail.status==='FAIL_CLOSED'&&!Tube.verify(fail),'wrong key fails closed');
ok(Tube.next(s3).step===3&&Tube.derive(-5).step===0,'step range is bounded');

const g80=Tube.reset('match','g8');
const g81=Tube.next(g80);
const g82=Tube.next(g81);
const g83=Tube.next(g82);
ok(g80.phase==='DO'&&g80.inputRecord==='SRC:G8'&&g80.inputValue===8,'G8 starts at DO with exact cube value');
ok(g81.phase==='RE'&&g81.rule==='KEY_CORNER(R,R,R,L)','G8 declares three right and one left moves');
ok(g82.phase==='MI'&&g82.outputAddress==='KEY_CORNER'&&g82.outputValue==='DO·RE·MI·FA','G8 reaches typed Key Corner output');
ok(g83.phase==='FA / RETURN'&&g83.returnKey==='G8'&&g83.status==='PASS'&&Tube.verify(g83),'matching G8 key closes exact return');
const g8fail=Tube.derive(3,'mismatch','g8');
ok(g8fail.returnKey==='G7'&&g8fail.status==='FAIL_CLOSED'&&!Tube.verify(g8fail),'G7 key fails closed on G8 route');
ok(Tube.ROUTES.g8.path.includes('R/R/R/L')&&Tube.ROUTES.g8.expectedKey==='G8','G8 route contract is exported');

const html=fs.readFileSync(path.join(__dirname,'assets/a0-field-notes/index.html'),'utf8');
ok(html.includes('tube-routing.js?v=')&&html.includes('tube-routing.css?v='),'reader binds versioned routing assets');
ok(html.includes('G8=2³ · Key Corner')&&html.includes('DO/RE/MI/FA')&&html.includes('R/R/R/L'),'reader exposes G8 closure');
ok(html.includes('G8³=512')&&html.includes('G=R F L U⁻¹')&&html.includes('neue Identität, Relation, Lab Run und Physik: <code>0</code>'),'claim boundary remains visible');

console.log(`PASS A0 Tube Routing · ${checks}/${checks}`);
