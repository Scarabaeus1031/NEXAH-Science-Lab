const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),api=require('./a0-numbermagick-number-lens.js'),shared=require('./a0-family-spatial-navigation.js');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++};
for(const [input,canonical] of [['7','7'],['6/8','3/4'],['1/-2','-1/2'],['0/13','0'],['0.5','1/2'],['-0.125','-1/8'],['1,25','5/4'],['√2','√2'],['-sqrt(2)','-√2']])ok(api.text(api.parse(input))===canonical,'exact parse '+input);
for(const invalid of ['1/0','abc','Infinity','2+3i','1e3','0.0000001','1000001','1/1000001','<script>']){assert.throws(()=>api.parse(invalid));checks++}
const cases=[
['7','0',[true,true,true,true,true,true]],['0','0',[true,true,true,true,true,false]],
['1','0',[true,true,true,true,true,false]],['-3','0',[false,true,true,true,true,false]],
['1/2','0',[false,false,true,true,true,false]],['√2','0',[false,false,false,true,true,false]],
['0','1',[false,false,false,false,true,false]],['3','4',[false,false,false,false,true,false]]
];
for(const [re,im,expected] of cases)ok(JSON.stringify(Object.values(api.membership(api.number(re,im))))===JSON.stringify(expected),'exact membership '+re+' + '+im+'i');
function simplePrime(n){if(n<2)return false;for(let d=2;d<n;d++)if(n%d===0)return false;return true}
for(let n=0;n<=1000;n++)ok(api.membership(api.number(String(n))).P===simplePrime(n),'prime check '+n);
for(let n=-500;n<=500;n++){
  const g=api.grid(api.number(String(n)));
  ok(g.a===(n%7+7)%7&&g.b===(n%11+11)%11,'Euclidean residues '+n);
  ok(api.reconstruct(g)===String(n),'exact CRT and quotient Return '+n);
}
ok(api.grid(api.number('237')).r===api.grid(api.number('314')).r,'genuine modulo-77 collision');
ok(api.grid(api.number('1/2'))===null&&api.grid(api.number('0','1'))===null,'grid rejects nonintegers rather than rounding');
for(const re of ['7','-3','1/2','√2','0'])for(const im of ['0','1/3','-√2']){
  const original=api.number(re,im);let z=original;for(let i=0;i<4;i++)z=api.rotate(z);
  ok(api.key(z)===api.key(original),'four Euler quarter-turns exact Return');
  const next=api.rotate(original);ok(Math.abs(Math.hypot(api.approximate(next.re),api.approximate(next.im))-Math.hypot(api.approximate(original.re),api.approximate(original.im)))<1e-10,'Euler norm preserved');
}
for(let k=0;k<29;k++)ok(BigInt(api.fibonacci(k))+BigInt(api.fibonacci(k+1))===BigInt(api.fibonacci(k+2)),'Fibonacci recurrence '+k);
ok(api.fibonacci(0)==='0'&&api.fibonacci(1)==='1'&&api.fibonacci(30)==='832040','bounded Fibonacci seeds and endpoint');
assert.throws(()=>api.fibonacci(31));checks++;
// Execute real UI controller against a minimal DOM, not just static text.
const html=fs.readFileSync(__dirname+'/A0_NUMBERMAGICK_GRID_RESEARCH.html','utf8'),nodes={};
function element(){return{children:[],dataset:{},attrs:{},append(...a){this.children.push(...a)},replaceChildren(...a){this.children=a},setAttribute(k,v){this.attrs[k]=v}}}
for(const m of html.matchAll(/id="([^"]+)"/g))nodes[m[1]]=element();
nodes.numberLensKey.checked=true;
const sandbox={A0SpatialReaderPrimitives:{createTrail:shared.createTrail},document:{getElementById:id=>nodes[id],createElement:element}};sandbox.window=sandbox;
vm.runInNewContext(fs.readFileSync(__dirname+'/a0-numbermagick-number-lens.js','utf8'),sandbox);
const lens=sandbox.A0NumbermagickNumberLens;
ok(lens.snapshot().z.re.n==='7','UI starts with 7');
const initial=JSON.stringify(lens.snapshot());
nodes.numberLensViewgrid.onclick();
ok(api.key(lens.snapshot().z)===api.key(api.number('7')),'view change preserves exact number');
ok(lens.snapshot().sideA.view==='complex'&&lens.snapshot().view==='grid','two sides retain source and target views');
ok(api.key(lens.snapshot().sideA.z)===api.key(lens.snapshot().z),'view channel preserves number on both sides');
ok(nodes.numberLensChannel.textContent.includes('VIEW'),'channel declares view operation');
nodes.numberLensGridReturn.onclick();ok(nodes.numberLensReturnResult.textContent.startsWith('PASS'),'grid Return with quotient');
nodes.numberLensKey.checked=false;nodes.numberLensKey.onchange();
nodes.numberLensGridReturn.onclick();ok(nodes.numberLensReturnResult.textContent.startsWith('UNBESTIMMT'),'grid without quotient is honestly ambiguous');
nodes.numberLensReturn.onclick();ok(JSON.stringify(lens.snapshot())===initial,'anchor restores number, view, Fibonacci index and key flag');
nodes.numberLensAnchor.onclick();nodes.numberLensEuler.onclick();
ok(lens.snapshot().sideA.z.re.n==='7'&&lens.snapshot().z.im.n==='7','Euler channel exposes source and target numeric records');
ok(nodes.numberLensChannel.textContent.includes('OPERATOR'),'numeric transformation declared separately from view change');
for(let i=0;i<3;i++)nodes.numberLensEuler.onclick();
ok(api.key(lens.snapshot().z)===api.key(api.number('7')),'real Euler UI exact four-turn Return');
for(let i=0;i<7;i++)nodes.numberLensFib.onclick();
ok(lens.snapshot().fib===7&&lens.snapshot().z.re.n==='13','Fibonacci UI reaches F7=13');
nodes.numberLensPrevious.onclick();ok(lens.snapshot().fib===6&&lens.snapshot().z.re.n==='8','history restores Fibonacci state');
nodes.numberLensNext.onclick();ok(lens.snapshot().fib===7,'history forward');
lens.select('0','1');
ok(nodes.numberLensLine.innerHTML.includes('Imaginärteil geht'),'nonreal line projection declares loss');
ok(nodes.numberLensGrid.innerHTML.includes('NICHT ANWENDBAR'),'nonreal grid not fabricated');
nodes.numberLensRe.value='1/0';nodes.numberLensApply.onclick();
ok(nodes.numberLensError.textContent.includes('Nenner'),'invalid input visibly rejected');
ok(lens.snapshot().z.im.n==='1','invalid input cannot mutate source');
ok(nodes.numberLensPresets.children.length===9,'all presets wired');
for(const file of ['a0-family-spatial-navigation.js','a0-numbermagick-number-lens.js','a0-numbermagick-number-lens.css','A0_GAME_4_LIFE_PLUS_1.html','A0_TESSAREC_BLUE_BODY_LAB.html'])ok(fs.existsSync(__dirname+'/'+file),'local dependency '+file);
console.log(JSON.stringify({status:'PASS',checks,scope:'exact bounded arithmetic, memberships, CRT loss/Return, Euler/Fibonacci, actual UI in simulated DOM; not browser pixel or Human utility acceptance'},null,2));
