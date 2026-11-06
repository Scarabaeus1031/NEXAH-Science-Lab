const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'assets/game-of-worlds-play/ioi-world-cube');
const api=require(path.join(root,'algo-eight-floor-register.js'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const controller=fs.readFileSync(path.join(root,'algo-eight-floor-register.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'MANIFEST.json'),'utf8'));
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
for(let floor=0;floor<8;floor++){
  const current=api.state(floor,1);
  check(current.floor===floor,'floor preserved');
  check(current.binary===floor.toString(2).padStart(3,'0'),'three-bit floor address');
  check(current.ternary===floor.toString(3).padStart(2,'0'),'two-digit ternary floor view');
  check(current.face===1,'visible face default');
}
const shadow=api.state(0,-1);
check(shadow.face===-1,'F0 shadow face');
check(shadow.address.includes('KG 1/−12'),'source-bound shadow address');
check(api.state(3,-1).face===1,'shadow is exclusive to F0');
check(html.includes('algo-eight-floor-register.css'),'register stylesheet');
check(html.includes('algo-eight-floor-register.js'),'register controller');
check(controller.includes('BLACK<br>SLOT'),'black slot role');
check(controller.includes('RED<br>THRESHOLD'),'red threshold role');
check(controller.includes('GOLD<br>RETURN'),'gold return role');
check(manifest.contract.algo_eight_floor_register.includes('F0..F7'),'manifest register contract');
console.log(JSON.stringify({status:'PASS',checks}));
