(function(root,factory){
  const coupler=typeof module==='object'&&module.exports?require('./a0-tesseract-face-coupler.js'):root.A0TesseractFaceCoupler;
  const api=factory(coupler);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0NlkIotaBridgeDock=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Coupler){
  'use strict';
  if(!Coupler)throw new Error('A0TesseractFaceCoupler is required');
  const BASES=Object.freeze([2,3,4,5,6,8,10,11,12,16,20,24]);
  const MODULI=Object.freeze([2,3,4,5,6,12,20]);
  const CARRIERS=Object.freeze([23,24,25]);
  const DEFAULTS=Object.freeze({base:12,modulus:20,carrier:24,face:0,tick:0,direction:1});
  const DIGITS='0123456789ABCDEFGHIJKLMN';
  const mod=(value,modulus)=>((Math.trunc(Number(value))%modulus)+modulus)%modulus;
  const allowed=(value,list,fallback)=>list.includes(Number(value))?Number(value):fallback;
  function normalize(input={}){
    return Object.freeze({
      base:allowed(input.base,BASES,DEFAULTS.base),
      modulus:allowed(input.modulus??input.mod,MODULI,DEFAULTS.modulus),
      carrier:allowed(input.carrier,CARRIERS,DEFAULTS.carrier),
      face:mod(input.face??DEFAULTS.face,24),tick:mod(input.tick??DEFAULTS.tick,48),
      direction:Number(input.direction??input.dir)<0?-1:1
    });
  }
  function baseWord(value,base){let n=Math.max(0,Math.trunc(Number(value))||0);if(n===0)return'0';let word='';while(n){word=DIGITS[n%base]+word;n=Math.floor(n/base)}return word}
  function encode(config,prefix='nlk'){
    const c=normalize(config),q=new URLSearchParams({[prefix]:'1',base:String(c.base),mod:String(c.modulus),carrier:String(c.carrier),face:String(c.face),tick:String(c.tick),dir:String(c.direction)});
    return q.toString();
  }
  function decode(search){const q=new URLSearchParams(String(search||'').replace(/^\?/,''));return normalize({base:q.get('base'),mod:q.get('mod'),carrier:q.get('carrier'),face:q.get('face'),tick:q.get('tick'),dir:q.get('dir')})}
  function receipt(config={}){
    const c=normalize(config),pipeline=Coupler.pipelineState(c.face,c.tick,Coupler.WINDING_MODE.INTERLEAVED_4J,c.direction),target=mod(pipeline.schedule.eulerAddress,24),relation=Coupler.matrix[c.face][target];
    return Object.freeze({
      schema:'nexah.a0.nlk-iota-typed-dock/1.0.0',config:c,
      switchword:`IOTA:B${c.base}|M${c.modulus}|F${String(c.face+1).padStart(2,'0')}|C${c.carrier}|K${String(c.tick).padStart(2,'0')}|D${c.direction>0?'+':'-'}`,
      source:Coupler.faces[c.face],target:Coupler.faces[target],targetIndex:target,relation,
      address:Object.freeze({baseWord:baseWord(c.tick,c.base),residue:mod(c.tick,c.modulus),phase11:mod(c.tick,11)}),
      handoff:pipeline.handoff,reconstruction:pipeline.reconstruction,
      boundary:Object.freeze({commonCarrier:false,commonClock:false,newGraphRelation:false,kind:'VIEW_CONTROL_HANDOFF'})
    });
  }
  function renderMatrix(doc,svg,r){
    if(!svg)return;while(svg.firstChild)svg.firstChild.remove();
    const ns='http://www.w3.org/2000/svg',x0=17,y0=17,pitch=16.5,size=13.5;
    for(let row=0;row<24;row+=1)for(let col=0;col<24;col+=1){
      const cell=doc.createElementNS(ns,'rect'),code=Coupler.matrix[row][col];
      cell.setAttribute('x',String(x0+col*pitch));cell.setAttribute('y',String(y0+row*pitch));cell.setAttribute('width',String(size));cell.setAttribute('height',String(size));cell.setAttribute('rx','2');
      cell.setAttribute('class',`nid-cell rel-${code.toLowerCase()}${row===r.config.face?' source-row':''}${col===r.targetIndex?' target-column':''}${row===r.config.face&&col===r.targetIndex?' active':''}`);
      const title=doc.createElementNS(ns,'title');title.textContent=`${Coupler.faces[row].id} × ${Coupler.faces[col].id} · ${code}`;cell.append(title);svg.append(cell);
    }
  }
  function setText(host,selector,text){const el=host.querySelector(selector);if(el)el.textContent=text}
  function mountNlk(doc,view){
    const host=doc.querySelector('[data-nlk-iota-dock]');if(!host)return null;
    const controls={base:host.querySelector('[data-nid-base]'),modulus:host.querySelector('[data-nid-mod]'),carrier:host.querySelector('[data-nid-carrier]'),face:host.querySelector('[data-nid-face]'),tick:host.querySelector('[data-nid-tick]')};
    let direction=1;
    if(new URLSearchParams(view.location.search).has('iotaReturn')){const restored=decode(view.location.search);Object.entries(controls).forEach(([key,node])=>{if(node)node.value=String(restored[key])});direction=restored.direction}
    function current(){return normalize({base:controls.base.value,modulus:controls.modulus.value,carrier:controls.carrier.value,face:controls.face.value,tick:controls.tick.value,direction})}
    function draw(){const r=receipt(current());renderMatrix(doc,host.querySelector('[data-nid-matrix]'),r);setText(host,'[data-nid-switchword]',r.switchword);setText(host,'[data-nid-source]',`${String(r.config.face+1).padStart(2,'0')} · ${r.source.id}`);setText(host,'[data-nid-target]',`${String(r.targetIndex+1).padStart(2,'0')} · ${r.target.id}`);setText(host,'[data-nid-relation]',`${r.relation} · ${Object.keys(Coupler.RELATION).find(key=>Coupler.RELATION[key]===r.relation)}`);setText(host,'[data-nid-address]',`${r.address.baseWord} (BASE ${r.config.base}) · r${r.address.residue}/MOD ${r.config.modulus} · SP ${r.address.phase11}/11`);setText(host,'[data-nid-return]',r.handoff.returnKey);setText(host,'[data-nid-reconstruct]',r.reconstruction.pass?'PASS · ADDRESS + WEIGHT + RESIDUE + RETURN':'FAIL · RECONSTRUCTION');setText(host,'[data-nid-face-out]',String(r.config.face+1).padStart(2,'0'));setText(host,'[data-nid-tick-out]',String(r.config.tick).padStart(2,'0'));host.querySelectorAll('[data-nid-dir]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.nidDir)===direction)));const link=host.querySelector('[data-nid-open-iota]');if(link)link.href=`A0_IOTA_BRIDGE_DEMONSTRATOR.html?${encode(r.config)}#gridBridgeFlagship`;return r}
    Object.values(controls).forEach(node=>node&&node.addEventListener(node.tagName==='SELECT'?'change':'input',draw));
    host.addEventListener('click',event=>{const dir=event.target.closest('[data-nid-dir]');if(dir){direction=Number(dir.dataset.nidDir)<0?-1:1;draw()}const reset=event.target.closest('[data-nid-reset]');if(reset){Object.entries(DEFAULTS).forEach(([key,value])=>{if(controls[key])controls[key].value=String(value)});direction=1;draw()}});
    const first=draw();return Object.freeze({draw,getState:current,getReceipt:()=>receipt(current()),initial:first});
  }
  function applyIota(doc,c){
    const click=selector=>{const node=doc.querySelector(selector);if(node)node.click()};
    click(`[data-tfc-mode="${c.carrier}"]`);const face=doc.querySelector('[data-tfc-face]');if(face){face.value=String(c.face);face.dispatchEvent(new Event('input',{bubbles:true}))}const tick=doc.querySelector('[data-tfc-step]');if(tick){tick.value=String(c.tick);tick.dispatchEvent(new Event('input',{bubbles:true}))}click(`[data-tfc-euler-direction="${c.direction}"]`);click(`[data-bvr-mod="${c.modulus}"]`);const base=doc.querySelector('[data-bad-base]');if(base){base.value=String(c.base);base.dispatchEvent(new Event('change',{bubbles:true}))}
  }
  function mountIota(doc,view){
    const q=new URLSearchParams(view.location.search),host=doc.querySelector('[data-iota-nlk-handoff]');if(!host||!q.has('nlk'))return null;const c=decode(view.location.search),r=receipt(c);applyIota(doc,c);host.hidden=false;setText(host,'[data-iota-nlk-word]',r.switchword);setText(host,'[data-iota-nlk-route]',`${String(c.face+1).padStart(2,'0')} → ${String(r.targetIndex+1).padStart(2,'0')} · ${r.relation} · tick ${String(c.tick).padStart(2,'0')}/48`);setText(host,'[data-iota-nlk-return-key]',r.handoff.returnKey);const link=host.querySelector('[data-iota-nlk-return]');if(link)link.href=`A0_NLK_LSHELL_DEVELOPMENT_PROBE.html?${encode(c,'iotaReturn')}#nlkIotaDock`;return Object.freeze({config:c,receipt:r});
  }
  return Object.freeze({BASES,MODULI,CARRIERS,DEFAULTS,normalize,baseWord,encode,decode,receipt,mountNlk,mountIota});
});
