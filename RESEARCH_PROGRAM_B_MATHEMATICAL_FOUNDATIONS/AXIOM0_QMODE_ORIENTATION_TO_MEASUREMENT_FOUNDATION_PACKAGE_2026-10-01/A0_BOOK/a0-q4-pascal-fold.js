(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0Q4PascalFold=api;api.mountAll();}})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STATES=Array.from({length:16},(_,v)=>v);
  const popcount=v=>(Number(v)&15).toString(2).split('1').length-1;
  const bitcount=(v,mode='ones')=>mode==='zeros'?4-popcount(v):popcount(v);
  const freeCount=(v,mode='ones')=>{const ones=popcount((Number(v)&15)>>1);return mode==='zeros'?3-ones:ones;};
  const complement=v=>15-(Number(v)&15);
  const bits=v=>(Number(v)&15).toString(2).padStart(4,'0');
  function wingGroups(parity,mode='ones'){const groups=[[],[],[],[]];STATES.filter(v=>v%2===parity).forEach(v=>groups[freeCount(v,mode)].push(v));return groups;}
  function fusionBins(mode='ones'){return [0,1,2,3,4].map(k=>{const even=STATES.filter(v=>v%2===0&&bitcount(v,mode)===k),odd=STATES.filter(v=>v%2===1&&bitcount(v,mode)===k);return{k,even,odd,total:even.length+odd.length};});}
  function pascalRow(n){const row=[];for(let k=0;k<=n;k++){let x=1;for(let i=1;i<=k;i++)x=x*(n-k+i)/i;row.push(x)}return row;}
  function audit(){const ones=fusionBins('ones'),zeros=fusionBins('zeros');return{evenSize:wingGroups(0).flat().length,oddSize:wingGroups(1).flat().length,wingShape:wingGroups(0).map(g=>g.length),onesFusion:ones.map(b=>b.total),zerosFusion:zeros.map(b=>b.total),pascal4:pascalRow(4),complementParity:STATES.every(v=>v%2!==complement(v)%2),complementWeight:STATES.every(v=>popcount(complement(v))===4-popcount(v))};}
  function mount(el){let selected=15,oneBased=true,mode='ones';const $=s=>el.querySelector(s),display=v=>oneBased?v+1:v;
    function select(v){window.dispatchEvent(new CustomEvent('a0:q4-select',{detail:{value:v+1}}));}
    function renderWing(parity,target){const root=$(target);root.innerHTML='';wingGroups(parity,mode).forEach((states,k)=>{const row=document.createElement('div');row.className='q4-pf-level';row.innerHTML=`<span>${mode==='ones'?'1':'0'}×${k}</span><div class="q4-pf-peas"></div>`;const peas=row.querySelector('.q4-pf-peas');states.forEach(v=>{const b=document.createElement('button');b.type='button';b.textContent=display(v);b.setAttribute('aria-label',`${bits(v)}, ${mode==='ones'?'Einsen':'Nullen'} in freien Bits ${k}`);b.className=(v===selected?'selected ':'')+(v===complement(selected)?'pair':'');b.addEventListener('click',()=>select(v));peas.appendChild(b)});root.appendChild(row)});}
    function renderFusion(){const root=$('[data-q4-pf-fusion]');root.innerHTML='';fusionBins(mode).forEach(bin=>{const d=document.createElement('div');d.className='q4-pf-bin'+(bitcount(selected,mode)===bin.k?' selected':'');d.innerHTML=`<span>${mode==='ones'?'W':'Z'}${bin.k}</span><b>${bin.total}</b><i>${bin.even.length}+${bin.odd.length}</i>`;root.appendChild(d)});$('[data-q4-pf-equation]').textContent=`C(4,k) = C(3,k) + C(3,k−1) · ${pascalRow(4).join(' + ')} = 16 · ${mode==='ones'?'Einsen':'Nullen'}`;}
    function render(){renderWing(0,'[data-q4-pf-even]');renderWing(1,'[data-q4-pf-odd]');renderFusion();$('[data-q4-pf-axis]').textContent=`${bits(selected)} ↔ ${bits(complement(selected))}`;el.querySelectorAll('[data-q4-pf-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.q4PfMode===mode)));}
    el.querySelectorAll('[data-q4-pf-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.q4PfMode;render()}));window.addEventListener('a0:q4-update',e=>{selected=e.detail.selected-1;oneBased=e.detail.oneBased;render()});render();
  }
  function mountAll(){document.querySelectorAll('[data-q4-pascal-fold]').forEach(mount);}
  return{STATES,popcount,bitcount,freeCount,complement,bits,wingGroups,fusionBins,pascalRow,audit,mount,mountAll};
});
