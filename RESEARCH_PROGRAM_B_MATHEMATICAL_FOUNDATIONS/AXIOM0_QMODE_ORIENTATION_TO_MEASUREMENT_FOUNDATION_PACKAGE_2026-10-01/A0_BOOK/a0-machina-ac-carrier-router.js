(function(root,factory){
  'use strict';
  const api=factory(typeof module==='object'&&module.exports?require('./a0-machina-ac-carrier-contract.js'):root.A0MachinaAcCarrierContract);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0MachinaAcCarrierRouter=api;
  if(root.document)root.A0MachinaAcCarrierRouterController=api.mount(root.document,root);
})(typeof globalThis!=='undefined'?globalThis:this,function(contract){
  'use strict';
  const RECEIPTS=Object.freeze(['P60','R48','Q24','G512','Z28','V12','L84','K8']);
  const TAU=Math.PI*2;
  const mod=(value,base)=>((value%base)+base)%base;
  function sourceResidue(clock){if(!Number.isFinite(clock))throw new TypeError('finite source clock required');return mod(Math.floor(mod(clock,TAU)/TAU*28),28)}
  function state(input={}){
    const receipt=RECEIPTS.includes(input.receipt)?input.receipt:'P60',source=mod(Number.isInteger(input.source)?input.source:0,28),quarter=mod(Number.isInteger(input.quarter)?input.quarter:0,4),krIndex=mod(Number.isInteger(input.krIndex)?input.krIndex:0,8),marker=String(input.marker)==='21'?'21':'06',locatorMode=contract.LOCATOR_MODES.includes(input.locatorMode)?input.locatorMode:'TIP';
    const phase=contract.quarterPhase(source,quarter),krPort=contract.resolveTdPort(contract.KR_SEQUENCE[krIndex]);
    const locator=contract.locate({port:krPort,receipt,residue:phase.output,marker,focus:locatorMode});
    return Object.freeze({receipt,source,quarter,residue:phase.output,offsetSlots:phase.offsetSlots,offsetTurns:phase.offsetTurns,krIndex,krPort,tdPartner:contract.tdJanus(krPort),marker,returnMarker:contract.returnMarker(marker),locatorMode,locator,followSource:input.followSource!==false});
  }
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('machinaAcCarrierRouter');if(!host)return null;
    const get=id=>doc.getElementById(id),nodes={receipts:get('acReceiptPorts'),diagram:get('acTdDiagram'),ring:get('acZ28Ring'),locatorModes:get('acLocatorModes'),locatorDiagram:get('acLocatorDiagram'),locatorLedger:get('acLocatorLedger'),status:get('acRouterStatus'),receipt:get('acRouterReceipt'),quarter:get('acQuarterStep'),kr:get('acKrStep'),marker:get('acMarkerReturn'),follow:get('acFollowSource')};
    if(Object.values(nodes).some(node=>!node))throw new Error('AC carrier router mount incomplete');
    let current=state(),lastClock=0;
    function svg(tag,attrs={}){const node=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const[key,value]of Object.entries(attrs))node.setAttribute(key,String(value));return node}
    function label(x,y,text,className){const node=svg('text',{x,y,class:className,'text-anchor':'middle'});node.textContent=text;return node}
    function drawTd(){nodes.diagram.replaceChildren();nodes.diagram.append(svg('line',{x1:36,y1:150,x2:484,y2:150,class:'ac-axis'}));const positions=[88,190,330,432];for(let i=0;i<4;i+=1){const top=contract.TOP[i],down=contract.DOWN[i],x=positions[i],activeTop=current.krPort.id===top.id,activeDown=current.krPort.id===down.id;nodes.diagram.append(svg('line',{x1:x,y1:58,x2:positions[3-i],y2:242,class:`ac-thread thread-${i}`}),svg('circle',{cx:x,cy:58,r:activeTop?14:10,class:`ac-port top${activeTop?' active':''}`}),svg('circle',{cx:x,cy:242,r:activeDown?14:10,class:`ac-port down${activeDown?' active':''}`}),label(x,34,top.id,'ac-port-label'),label(x,270,down.id,'ac-port-label'))}nodes.diagram.append(svg('circle',{cx:260,cy:150,r:27,class:'ac-center'}),label(260,155,current.marker,'ac-center-label'),label(260,292,`${current.krPort.id} ↔ ${current.tdPartner.id} · KR ${current.krIndex+1}/8`,'ac-caption'));}
    function drawRing(){nodes.ring.replaceChildren();nodes.ring.append(svg('circle',{cx:150,cy:150,r:112,class:'ac-ring-line'}));for(let i=0;i<28;i+=1){const a=-Math.PI/2+i*TAU/28,x=150+Math.cos(a)*112,y=150+Math.sin(a)*112,active=i===current.residue,quarter=i%7===0;const dot=svg('circle',{cx:x,cy:y,r:active?8:quarter?5:3,class:`ac-ring-dot${active?' active':''}${quarter?' quarter':''}`});dot.appendChild(doc.createElementNS('http://www.w3.org/2000/svg','title')).textContent=`Z28 residue ${i}`;nodes.ring.append(dot)}nodes.ring.append(label(150,143,`r${String(current.residue).padStart(2,'0')}`,'ac-ring-value'),label(150,166,`+${current.offsetTurns.toFixed(2)} turn / ${current.offsetSlots} slots`,'ac-ring-small'));}
    function drawLocator(){
      nodes.locatorDiagram.replaceChildren();
      const angle=-Math.PI/2+current.krIndex*TAU/8,cx=320,cy=150,bx=cx+Math.cos(angle)*150,by=cy+Math.sin(angle)*82,ox=cx+Math.cos(angle)*258,oy=cy+Math.sin(angle)*126,rx=cx-Math.cos(angle)*150,ry=cy-Math.sin(angle)*82;
      nodes.locatorDiagram.append(svg('ellipse',{cx,cy,rx:150,ry:82,class:'ac-locator-boundary'}),svg('line',{x1:cx,y1:cy,x2:ox,y2:oy,class:'ac-locator-ray'}),svg('line',{x1:bx,y1:by,x2:rx,y2:ry,class:'ac-locator-return-path'}),svg('circle',{cx,cy,r:13,class:'ac-locator-pivot'}));
      const points=[['TIP',bx,by,current.krPort.id],['OUTSIDE',ox,oy,current.receipt],['RETURN',rx,ry,current.returnMarker]];
      for(const[mode,x,y,value]of points){nodes.locatorDiagram.append(svg('circle',{cx:x,cy:y,r:current.locatorMode===mode?16:11,class:`ac-locator-node mode-${mode.toLowerCase()}${current.locatorMode===mode?' active':''}`}),label(x,y-22,mode,'ac-locator-label'),label(x,y+5,value,'ac-locator-node-value'))}
      const ba=-Math.PI/2+current.residue*TAU/28,bbx=cx+Math.cos(ba)*150,bby=cy+Math.sin(ba)*82;nodes.locatorDiagram.append(svg('circle',{cx:bbx,cy:bby,r:current.locatorMode==='BOUNDARY'?15:8,class:`ac-locator-node mode-boundary${current.locatorMode==='BOUNDARY'?' active':''}`}),label(bbx,bby-19,'BOUNDARY','ac-locator-label'),label(cx,cy+5,'MP','ac-locator-node-value'),label(320,285,'ONE SOURCE · FOUR VIEW ROLES · NO SECOND BODY','ac-caption'));
      const rows=[['FOCUS',current.locatorMode],['TIP',`${current.locator.tip.address} · ${current.locator.tip.side}`],['BOUNDARY',current.locator.boundary.address],['OUTSIDE',current.locator.outside.address],['RETURN',`${current.locator.return.marker} → ${current.locator.return.partner}`],['TD PAIR',`${current.krPort.id} ↔ ${current.tdPartner.id}`]];nodes.locatorLedger.replaceChildren();for(const[key,value]of rows){const dt=doc.createElement('dt'),dd=doc.createElement('dd');dt.textContent=key;dd.textContent=value;nodes.locatorLedger.append(dt,dd)}
    }
    function render(next={}){current=state({...current,...next});nodes.receipts.querySelectorAll('[data-ac-receipt]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.acReceipt===current.receipt)));nodes.locatorModes.querySelectorAll('[data-ac-locator]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.acLocator===current.locatorMode)));nodes.quarter.textContent=`¼ PHASE · ${current.quarter}/4`;nodes.kr.textContent=`KR STEP · ${current.krIndex+1}/8`;nodes.marker.textContent=`RETURN ${current.marker} → ${current.returnMarker}`;drawTd();drawRing();drawLocator();const port=contract.PORTS[current.receipt];nodes.status.textContent=`PASS · ${current.receipt}/${port.count} · ${current.locatorMode} · Z28 r${current.residue} · ${current.krPort.id}↔${current.tdPartner.id} · ${current.marker}→${current.returnMarker} · ${current.followSource?'SOURCE CLOCK FOLLOW':'LOCAL VIEW HOLD'}`;nodes.receipt.textContent=JSON.stringify({schema:'nexah.a0.machina-ac-router-view/2',identity:contract.IDENTITY,sourceClock:lastClock,view:current,port,locator:current.locator,boundary:'Read-only view over existing receipts; TIP/BOUNDARY/OUTSIDE/RETURN are view roles; no second clock, source mutation, carrier identity, body or scientific relation.'},null,2);return current}
    nodes.receipts.addEventListener('click',event=>{const button=event.target.closest?.('[data-ac-receipt]');if(button)render({receipt:button.dataset.acReceipt})});
    nodes.locatorModes.addEventListener('click',event=>{const button=event.target.closest?.('[data-ac-locator]');if(button)render({locatorMode:button.dataset.acLocator})});
    nodes.quarter.addEventListener('click',()=>render({quarter:current.quarter+1}));nodes.kr.addEventListener('click',()=>render({krIndex:current.krIndex+1}));nodes.marker.addEventListener('click',()=>render({marker:current.returnMarker}));nodes.follow.addEventListener('change',()=>render({followSource:nodes.follow.checked}));
    win.addEventListener?.('a0-lissajous-frame',event=>{lastClock=event.detail?.clock??lastClock;if(current.followSource)render({source:sourceResidue(lastClock)})});
    render();return Object.freeze({render,get state(){return current},sourceResidue});
  }
  return Object.freeze({RECEIPTS,sourceResidue,state,mount});
});
