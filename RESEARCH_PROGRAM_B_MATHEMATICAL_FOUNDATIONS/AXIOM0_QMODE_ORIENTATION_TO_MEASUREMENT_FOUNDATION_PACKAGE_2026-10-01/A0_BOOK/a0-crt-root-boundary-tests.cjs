const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const M=require('./a0-crt-root-boundary-model.js');
let passed=0;
function ok(value,label){if(!value)throw new Error(`FAIL ${label}`);passed++;console.log(`PASS ${label}`)}
function same(a,b,label){ok(JSON.stringify(a)===JSON.stringify(b),label)}

const data=M.buildDataset();
same(M.RING_VALUES,[237,337,537,637,737,937],'six source markers frozen');
ok(M.isPrime(337)&&M.isPrime(937),'337 and 937 are prime');
ok([237,537,637,737].every(n=>!M.isPrime(n)),'four source markers are composite');
ok(M.formatFactorization(237)==='3 × 79','237 factorization');
ok(M.formatFactorization(537)==='3 × 179','537 factorization');
ok(M.formatFactorization(637)==='7^2 × 13','637 factorization');
ok(M.formatFactorization(737)==='11 × 67','737 factorization');
ok(M.ringOperator(1,'J6').target.n===937&&M.ringOperator(5,'J6').target.n===337,'J6 swaps slots 1 and 5');
ok(M.ringOperator(3,'R637').target.n===637,'R637 fixes center 637');
ok(M.ringOperator(0,'R637').target.n===1037&&!M.ringOperator(0,'R637').closed,'R637 exposes outside image 1037');
ok(M.ringOperator(4,'N37').type==='RESIDUE_NEGATION_ONLY','N37 remains residue-only');
ok(M.seamRecord(120).p===659&&M.seamRecord(121).p===661&&M.seamRecord(140).p===809,'prime-index seam fixtures');
ok(M.seamRecord(121).sqrt===11&&M.seamRecord(121).fraction===0&&M.seamRecord(121).squareSeam,'121 is exact 11 squared seam');
ok(M.seamRecord(121).r37===32&&M.seamRecord(140).r37===32,'661 and 809 share residue 32 mod 37');
ok(809-661===4*37,'boundary difference is four mod-37 periods');
ok(M.seamRecord(121).delta>M.seamRecord(140).delta,'root ruler gaps shrink');
const slice=M.crtSlice(32);
ok(slice.length===77,'mod-37 slice has 77 cells');
ok(new Set(slice.map(c=>`${c.mod7}:${c.mod11}`)).size===77,'slice covers every mod7/mod11 address once');
ok(slice.every(c=>c.mod37===32),'slice residue fixed at 32');
ok(M.crtCell(661%7,661%11).n===661&&M.crtCell(809%7,809%11).n===809,'CRT cells return boundary anchors');
const layers=Array.from({length:37},(_,r)=>M.crtSlice(r));
ok(layers.every(layer=>layer.length===77),'all 37 CRT layers contain 77 cells');
ok(new Set(layers.flat().map(c=>c.n)).size===2849,'37 layers cover all 2849 carrier nodes exactly once');
same(M.RING_VALUES.map(n=>n%37),[15,4,19,8,34,12],'ring markers map to declared residue layers');
ok(M.crtLayerSummary(18).inverse37===19&&M.crtLayerSummary(19).inverse37===18,'18 and 19 are additive inverse classes');
ok(M.crtLayerSummary(32).primeCount===13,'boundary layer has verified prime count 13');
same(M.crtLayerSummary(32).anchors.map(a=>a.n),[180,661,809,883,1031],'boundary layer anchor set retained');
ok(M.HEATMAP_ROWS.length===11&&M.HEATMAP_COLUMNS.length===6,'heatmap is 11 by 6');
ok(M.HEATMAP_ROWS.every(r=>r.scores.length===6),'all heatmap rows complete');
ok(M.heatmapRecord(0,0).operatorPolicy==='FIXED_TO_SOURCE_MARKER_NOT_TRANSFORMED','heatmap is source-fixed');
ok(data.identityReuse.length===3&&data.identityReuse.includes('NN:CRT_QRT_37_CARRIER_LADDER'),'existing CRT identity reused');
ok(/separate typed layers/i.test(data.boundary),'claim boundary keeps layers separate');

const html=fs.readFileSync('./A0_CRT_ROOT_BOUNDARY_AUDIT.html','utf8');
for(const marker of ['data-crt-root-audit','data-crb-ring','data-crb-root','data-crb-slice','data-crb-heatmap','a0-crt-root-boundary-model.js','a0-crt-root-boundary-ui.js'])ok(html.includes(marker),`HTML marker ${marker}`);
for(const marker of ['data-crb-layer','data-crb-layer-out','data-crb-layer-jump','37 × 77 = 2849'])ok(html.includes(marker),`37-layer HTML marker ${marker}`);
ok(/algebraisch irrational/i.test(html)&&/nicht transzendent/i.test(html),'HTML corrects root number type');
ok(/keine gemeinsame Mechanik/i.test(html),'HTML exposes type boundary');

const binding=JSON.parse(fs.readFileSync('./assets/a0-crt-root-boundary-audit-v1.json','utf8'));
ok(binding.identity_reuse.includes('NN:CRT_QRT_37_CARRIER_LADDER'),'binding reuses CRT identity');
ok(binding.navigator_effect.new_identities===0&&binding.navigator_effect.new_relations===0,'binding declares zero graph delta');
ok(binding.sources.length===5,'five source records pinned');
const resolveSource=source=>path.isAbsolute(source.path)?source.path:source.path.startsWith('A0_BOOK/')?path.resolve(__dirname,source.path.slice('A0_BOOK/'.length)):path.resolve(__dirname,'../../..',source.path);
ok(binding.sources.every(source=>fs.existsSync(resolveSource(source))),'all source locators resolve');
ok(binding.sources.every(source=>crypto.createHash('sha256').update(fs.readFileSync(resolveSource(source))).digest('hex')===source.sha256),'all source hashes match');

console.log(JSON.stringify({suite:'a0-crt-root-boundary-audit',passed,status:'PASS',scope:'finite ring arithmetic, typed operators, prime-index root seam, CRT slice and source-fixed observation scores'},null,2));
