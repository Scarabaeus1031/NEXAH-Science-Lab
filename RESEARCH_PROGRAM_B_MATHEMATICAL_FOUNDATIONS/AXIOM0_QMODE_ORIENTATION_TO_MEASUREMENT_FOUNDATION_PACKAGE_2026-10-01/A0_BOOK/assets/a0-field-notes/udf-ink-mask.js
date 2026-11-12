(function(global){
  'use strict';
  const masks=['540','720-A','720-B','1080'];
  function createState(){return{activeMask:'432',inkLedger:[],returned:true,sequence:0};}
  function apply(state,action){
    const next={activeMask:state.activeMask,inkLedger:state.inkLedger.slice(),returned:state.returned,sequence:state.sequence};
    if(action==='RETURN'){next.activeMask='432';next.returned=true;return next;}
    if(!masks.includes(action))throw new Error('UNKNOWN_MASK');
    next.sequence+=1;next.activeMask=action;next.returned=false;next.inkLedger.push(Object.freeze({sequence:next.sequence,mask:action,register:'432'}));return next;
  }
  function mount(doc=document){
    const root=doc.querySelector('[data-udf-ink-mask]');if(!root)return null;
    let state=createState();
    const buttons=[...root.querySelectorAll('[data-uim-action]')],history=root.querySelector('[data-uim-history]');
    function render(){
      root.dataset.uimMask=state.activeMask;root.dataset.uimReturned=String(state.returned);
      buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.uimAction===state.activeMask)));
      root.querySelectorAll('[data-uim-used]').forEach(path=>path.dataset.uimUsed=String(state.inkLedger.some(entry=>entry.mask===path.dataset.uimTrace)));
      const set=(key,value)=>{const node=root.querySelector('[data-uim-out="'+key+'"]');if(node)node.textContent=value;};
      set('mask',state.activeMask);set('count',String(state.inkLedger.length));set('return',state.returned?'AT 432 / VIEW RESET':'OPEN');set('last',state.inkLedger.at(-1)?.mask||'none');
      if(history)history.textContent=state.inkLedger.length?state.inkLedger.map(e=>'#'+e.sequence+' '+e.mask+' → 432').join(' · '):'Noch keine Ink-Spur. Eine Maske wählen.';
      return state;
    }
    buttons.forEach(button=>button.addEventListener('click',()=>{state=apply(state,button.dataset.uimAction);render();}));render();
    return{apply(action){state=apply(state,action);return render();},get state(){return state;}};
  }
  global.A0UdfInkMask={createState,apply,mount,masks:Object.freeze(masks.slice())};
  if(typeof module!=='undefined'&&module.exports)module.exports={createState,apply,mount,masks};
})(typeof window!=='undefined'?window:globalThis);
