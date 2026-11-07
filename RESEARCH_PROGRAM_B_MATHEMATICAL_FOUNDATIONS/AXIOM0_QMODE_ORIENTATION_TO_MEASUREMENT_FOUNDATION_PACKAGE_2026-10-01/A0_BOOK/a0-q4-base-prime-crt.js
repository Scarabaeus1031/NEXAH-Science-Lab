(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Q4BasePrimeCrt=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const MOD_A=15,MOD_B=14,MODULUS=210;
  const mod=(n,m)=>((Number(n)%m)+m)%m;
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a};
  function crt210(r15,r14){return mod(196*mod(r15,15)+15*mod(r14,14),210)}
  function audit(value){const n=Number(value),r15=mod(n,15),r14=mod(n,14),result=crt210(r15,r14);return{value:n,r15,r14,result,quotient:(n-result)/210,equation:`${n} = ${(n-result)/210} × 210 + ${result}`}}
  function verify(){let passed=0,total=0;const check=x=>{total++;if(x)passed++};check(gcd(15,14)===1);check(15===3*5);check(14===2*7);check(210===2*3*5*7);check(crt210(1,0)===196);check(crt210(0,1)===15);for(let x=0;x<210;x++)check(crt210(x%15,x%14)===x);const a=audit(1221);check(a.result===171);check(a.equation==='1221 = 5 × 210 + 171');return{passed,total,ok:passed===total}}
  function mount(scope){const rootNode=scope||document,stage=rootNode.querySelector('[data-q4-crt210]');if(!stage)return null;const input=stage.querySelector('[data-q4-crt-input]');const out=k=>stage.querySelector(`[data-q4-crt-${k}]`);function render(value){const a=audit(value);out('r15').textContent=a.r15;out('r14').textContent=a.r14;out('result').textContent=`${a.result} mod 210`;out('equation').textContent=a.equation;out('status').textContent=`PASS · (${a.r15}, ${a.r14}) rekonstruiert ${a.result}`;return a}stage.querySelector('form').addEventListener('submit',e=>{e.preventDefault();render(input.value)});stage.querySelectorAll('[data-q4-crt-preset]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.q4CrtPreset;render(input.value)}));render(input.value);return{render}}
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{mount(document);if(location.hash==='#basePrimeCrtStage'){const b=document.querySelector('[data-view="base-prime-crt"]');if(b)b.click()}});
  return{MOD_A,MOD_B,MODULUS,mod,gcd,crt210,audit,verify,mount};
});
