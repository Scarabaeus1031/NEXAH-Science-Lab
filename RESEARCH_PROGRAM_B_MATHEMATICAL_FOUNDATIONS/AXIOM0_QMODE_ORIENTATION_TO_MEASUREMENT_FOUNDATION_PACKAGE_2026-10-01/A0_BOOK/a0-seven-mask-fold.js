(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root){root.A0SevenMaskFold=api;api.mountAll(root.document)}
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const reverseDigits=(value,width=String(value).length)=>Number(String(value).padStart(width,'0').split('').reverse().join(''));
  const mirror72=value=>144-value;
  const swapBlocks=(word,size=2)=>{const s=String(word);if(s.length!==size*2)throw new RangeError('word must contain exactly two equal blocks');return s.slice(size)+s.slice(0,size)};
  const isPalindrome=word=>String(word)===String(word).split('').reverse().join('');
  const factorize=value=>{let n=value;const out=[];for(let d=2;d*d<=n;d+=d===2?1:2){let e=0;while(n%d===0){n/=d;e++}if(e)out.push([d,e])}if(n>1)out.push([n,1]);return out};
  const factorText=value=>factorize(value).map(([p,e])=>e===1?String(p):`${p}^${e}`).join(' × ')||'1';
  const sevenOperations=()=>Object.freeze({sum:7+7,product:7*7,quotient:7/7,power:7**7});
  const MODES=Object.freeze({
    hinge:Object.freeze({left:'71',right:'73',center:'72',operator:'M₇₂',title:'71 ↔ 73 · Spiegel um 72',caption:'Zahlenspiegel',equations:['M₇₂(n)=144−n','M₇₂(71)=73 · M₇₂(73)=71','rev₂(71)=17=p₇ · rev₂(73)=37=p₁₂'],status:'PASS · Involution und Primindizes getrennt'}),
    blocks:Object.freeze({left:'74|47',right:'47|74',center:'S₂',operator:'BLOCK',title:'7447 ↔ 4774 · Zweierblock-Falte',caption:'zwei Masken',equations:['S₂(74|47)=47|74 · S₂²=id','rev₄(7447)=7447 · rev₄(4774)=4774','7447=11×677 · 4774=2×7×11×31'],status:'PASS · Blocktausch ≠ Ziffernumkehr'}),
    scarab:Object.freeze({left:'3301',right:'1033',center:'R₄',operator:'REVERSE',title:'3301 ↔ 1033 · vierstellige Ziffernumkehr',caption:'bestehende CIKADA/SCARAB-Spur',equations:['R₄(3301)=1033 · R₄(1033)=3301','3301 und 1033 sind prim','R₄ ist nicht der 1080-Komplementoperator'],status:'PASS · R₄²=id unter fester Breite 4'}),
    seven:Object.freeze({left:'7',right:'7',center:'4 OPS',operator:'TYPE',title:'7 und 7 · vier verschiedene Operatoren',caption:'Operatorfächer',equations:['7+7=14 · 7×7=49','7÷7=1 · 7^7=823543','p₇=17 · diese Aussage ist ein Primindex'],status:'PASS · keine Operatoren zusammengezogen'})
  });
  function audit(){const ops=sevenOperations();return Object.freeze({
    mirror:mirror72(71)===73&&mirror72(73)===71,
    primeFold:reverseDigits(71,2)===17,
    blockSwap:swapBlocks('7447')==='4774'&&swapBlocks('4774')==='7447',
    palindromes:isPalindrome('7447')&&isPalindrome('4774'),
    scarab:reverseDigits(3301,4)===1033&&reverseDigits(1033,4)===3301,
    seven:ops.sum===14&&ops.product===49&&ops.quotient===1&&ops.power===823543
  })}
  function render(root,modeName){const mode=MODES[modeName]||MODES.hinge;root.dataset.mode=modeName in MODES?modeName:'hinge';root.querySelectorAll('[data-smf-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.smfMode===root.dataset.mode)));
    const set=(name,value)=>{const node=root.querySelector(`[data-smf-${name}]`);if(node)node.textContent=value};
    set('left',mode.left);set('right',mode.right);set('center',mode.center);set('operator',mode.operator);set('title',mode.title);set('caption',mode.caption);set('status',mode.status);
    const equations=root.querySelector('[data-smf-equations]');if(equations)equations.innerHTML=mode.equations.map(text=>`<code>${text}</code>`).join('');
    const seven=root.querySelector('[data-smf-seven]');if(seven)seven.hidden=root.dataset.mode!=='seven';
  }
  function mount(root){if(!root||root.dataset.smfMounted==='true')return;root.dataset.smfMounted='true';root.querySelectorAll('[data-smf-mode]').forEach(button=>button.addEventListener('click',()=>render(root,button.dataset.smfMode)));render(root,'hinge')}
  function mountAll(doc){if(!doc)return;doc.querySelectorAll('[data-seven-mask-fold]').forEach(mount)}
  return Object.freeze({reverseDigits,mirror72,swapBlocks,isPalindrome,factorize,factorText,sevenOperations,MODES,audit,render,mount,mountAll});
});
