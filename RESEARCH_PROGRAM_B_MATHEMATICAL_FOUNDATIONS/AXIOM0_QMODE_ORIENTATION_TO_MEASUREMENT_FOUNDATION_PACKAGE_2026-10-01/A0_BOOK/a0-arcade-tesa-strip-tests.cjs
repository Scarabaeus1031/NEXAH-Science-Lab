const fs=require('fs'),A=require('./a0-arcade-tesa-strip.js');
let checks=0;const ok=(value,label)=>{checks++;if(!value)throw new Error(label);};const eq=(a,b,label)=>ok(JSON.stringify(a)===JSON.stringify(b),`${label}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
eq(A.STONES,[31,25,13,23,11,5,41],'seven supplied stones');
eq(A.STONES.map(A.crtCell).map(cell=>[cell.value,cell.row,cell.column]),[[31,1,3],[25,1,4],[13,1,6],[23,5,2],[11,5,4],[5,5,5],[41,5,6]],'CRT cell addresses');
const record=A.analyse();
ok(record.pair.decimalReversal,'1033 reverses to 3301');ok(record.pair.scarabPrime&&record.pair.cikadaPrime,'both endpoints prime');eq(record.pair.commonResidue42,25,'common mod42 stone');eq(record.pair.commonResidue9,7,'common mod9 residue');eq(record.pair.scarabDigitSum,7,'1033 digit sum');eq(record.pair.cikadaDigitSum,7,'3301 digit sum');eq(record.pair.difference,2268,'difference');eq(record.pair.differenceInMod42Steps,54,'42-step difference');eq(record.parses.complex,'33+0i = 33','complex parse stop');ok(!record.authority.newIdentity&&!record.authority.newRelation&&!record.authority.canonicalTrapdoorIdentity,'authority stops');
const svg=A.svgMarkup(25);eq((svg.match(/data-stone=/g)||[]).length,7,'seven SVG stones');ok(svg.includes('COMMON CRT ADDRESS')&&svg.includes('SEPARATE CONTRACT'),'SVG boundaries');
const html=fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const token of ['id="aeArcadeTesaStrip"','id="aeArcadeTesaSvg"','id="aeArcadeTesaStone"','1033 ↔ 3301','33+0i = 33','mod 42 = 25','mod 9 = 7','PINK FACELET‑2 TRAPDOOR'])ok(html.includes(token),`HTML ${token}`);
console.log(JSON.stringify({status:'PASS',checks,boundary:'Read-only CRT address strip; provisional Scarab/CIKADA spine remains unvalidated; no trapdoor identity.'}));
