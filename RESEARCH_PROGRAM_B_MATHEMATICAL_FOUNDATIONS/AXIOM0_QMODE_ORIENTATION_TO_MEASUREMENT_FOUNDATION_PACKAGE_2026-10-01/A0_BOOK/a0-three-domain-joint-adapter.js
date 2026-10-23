(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ThreeDomainJointAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const CHANNEL_NAME='nexah-a0-three-domain-joint-v1';
  const DOMAINS=Object.freeze(['chemistry','life','physics']);
  const CHANNELS=Object.freeze([
    Object.freeze({key:'c00',label:'C₀₀',transition:'0→0',role:'inactive retention',color:'#647786'}),
    Object.freeze({key:'c01',label:'C₀₁',transition:'0→1',role:'birth / positive',color:'#22d3ee'}),
    Object.freeze({key:'c10',label:'C₁₀',transition:'1→0',role:'death / negative',color:'#f653ad'}),
    Object.freeze({key:'c11',label:'C₁₁',transition:'1→1',role:'survive / retained',color:'#f5bf42'})
  ]);
  const MASK_CONTRACT=Object.freeze({outer:'D5_PENTAGON',inner:'D6_HEXAGON',crossDeg:45,shellCount:11,gridView:'11x11',addressReference:'7x11',identityRule:'D5 ≠ D6 ≠ 11x11 ≠ 7x11'});
  const copy=value=>JSON.parse(JSON.stringify(value));
  const round=value=>Number(Number(value).toFixed(9));

  function validateLedger(ledger,label='ledger'){
    if(!ledger||typeof ledger!=='object')throw new TypeError(`${label} required`);
    for(const key of ['c00','c01','c10','c11','total'])if(!Number.isSafeInteger(ledger[key])||ledger[key]<0)throw new TypeError(`${label}.${key} must be a non-negative safe integer`);
    if(ledger.c00+ledger.c01+ledger.c10+ledger.c11!==ledger.total)throw new TypeError(`${label} partition mismatch`);
    const previous={zero:ledger.c00+ledger.c01,one:ledger.c10+ledger.c11};
    const current={zero:ledger.c00+ledger.c10,one:ledger.c01+ledger.c11};
    if(ledger.previous&&(ledger.previous.zero!==previous.zero||ledger.previous.one!==previous.one))throw new TypeError(`${label} source marginal mismatch`);
    if(ledger.current&&(ledger.current.zero!==current.zero||ledger.current.one!==current.one))throw new TypeError(`${label} target marginal mismatch`);
    return Object.freeze({c00:ledger.c00,c01:ledger.c01,c10:ledger.c10,c11:ledger.c11,total:ledger.total,previous:Object.freeze(previous),current:Object.freeze(current)});
  }

  function phasor(ledger){
    const total=Math.max(1,ledger.total);
    return Object.freeze({re:round((ledger.c11-ledger.c00)/total),im:round((ledger.c01-ledger.c10)/total)});
  }

  function canonical(record){
    return JSON.stringify({generation:record.generation,domains:record.domains.map(domain=>[domain.id,...CHANNELS.map(channel=>domain.ledger[channel.key]),domain.ledger.total])});
  }

  function normalize(detail,meta={}){
    if(!detail||!Number.isSafeInteger(detail.generation)||detail.generation<0)throw new TypeError('three-domain generation required');
    const domains=DOMAINS.map(id=>{
      const snapshot=detail.snapshots?.[id];
      if(!snapshot)throw new TypeError(`three-domain snapshot missing: ${id}`);
      if(snapshot.generation!==detail.generation)throw new TypeError(`${id} generation mismatch`);
      const ledger=validateLedger(snapshot.ledger,`${id}.ledger`),total=Math.max(1,ledger.total);
      return Object.freeze({
        id,
        generation:snapshot.generation,
        controller:Object.freeze(copy(snapshot.controller||{})),
        ledger,
        normalized:Object.freeze(Object.fromEntries(CHANNELS.map(channel=>[channel.key,round(ledger[channel.key]/total)]))),
        phasor:phasor(ledger)
      });
    });
    const joint={
      re:round(domains.reduce((sum,domain)=>sum+domain.phasor.re,0)/DOMAINS.length),
      im:round(domains.reduce((sum,domain)=>sum+domain.phasor.im,0)/DOMAINS.length)
    };
    joint.magnitude=round(Math.hypot(joint.re,joint.im));
    const record={
      schema:'nexah.a0.three-domain-channel-joint/1',version:VERSION,status:'SOURCE_BOUND',
      generation:detail.generation,observedAt:meta.observedAt||new Date().toISOString(),
      source:Object.freeze({path:'assets/game-of-worlds-play/three-domain-transition-test/app.js',event:'threedomain:render',identityReuse:Object.freeze(['ART:A0:MATHEMATICAL_JOINTS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'])}),
      coordinateMap:Object.freeze({outerPorts:Object.freeze(DOMAINS.slice()),innerChannels:Object.freeze(CHANNELS.map(channel=>channel.key)),joint:'ARITHMETIC_CENTROID_OF_LEDGER_PHASORS',mask:MASK_CONTRACT,feedback:false}),
      domains:Object.freeze(domains),joint:Object.freeze(joint),
      invariants:Object.freeze({partition:true,marginals:true,domainCarriersRemainDistinct:true,greyC00IsObservedZeroState:true})
    };
    record.fingerprint=canonical(record);
    return Object.freeze(record);
  }

  function capture(record){
    if(!record||record.schema!=='nexah.a0.three-domain-channel-joint/1')throw new TypeError('normalized channel-joint record required');
    return Object.freeze({schema:'nexah.a0.three-domain-channel-capture/1',capturedAt:new Date().toISOString(),fingerprint:record.fingerprint,record});
  }

  function compare(captured,current){
    if(!captured||!current)return Object.freeze({status:'HOLD_SOURCE',exact:false,reason:'CAPTURE_AND_CURRENT_REQUIRED'});
    const exact=captured.fingerprint===current.fingerprint;
    return Object.freeze({status:exact?'EXACT_RETURN':'REJECT_CHANGED_SOURCE',exact,capturedGeneration:captured.record.generation,currentGeneration:current.generation,partition:current.invariants.partition,marginals:current.invariants.marginals});
  }

  function svgMarkup(record,angleDeg=0){
    if(!record)return '<text class="pbr-channel-wait" x="300" y="190" text-anchor="middle">WAITING FOR ARCADE SOURCE RECORD</text>';
    const ys=[70,190,310],joint={x:580,y:190},angle=Number(angleDeg)||0;
    const paths=record.domains.map((domain,index)=>{
      const y=ys[index],label=domain.id==='physics'?'PHYSICS / SPIN':domain.id.toUpperCase();
      const fibres=CHANNELS.map((channel,channelIndex)=>{
        const offset=(channelIndex-1.5)*8,weight=domain.normalized[channel.key],width=(1.25+18*weight).toFixed(2),bend=90+(index-1)*20+(channelIndex-1.5)*6;
        return `<path class="pbr-channel-fibre" data-channel="${channel.key}" d="M104 ${y+offset} C250 ${y+offset}, 402 ${bend}, ${joint.x} ${joint.y+offset*.22}" style="stroke:${channel.color};stroke-width:${width}"/><title>${label} · ${channel.label} ${channel.transition} · ${domain.ledger[channel.key]}/${domain.ledger.total}</title>`;
      }).join('');
      return `<g class="pbr-channel-port"><circle cx="82" cy="${y}" r="25"/><text x="82" y="${y+4}" text-anchor="middle">${index+1}</text><text class="pbr-channel-domain" x="118" y="${y-24}">${label}</text>${fibres}</g>`;
    }).join('');
    const legend=CHANNELS.map((channel,index)=>`<g transform="translate(${126+index*116} 354)"><line x1="0" y1="0" x2="25" y2="0" style="stroke:${channel.color};stroke-width:4"/><text x="32" y="4">${channel.label} ${channel.transition}</text></g>`).join('');
    const pentagon=`${joint.x},${joint.y-58} ${joint.x+55},${joint.y-18} ${joint.x+34},${joint.y+47} ${joint.x-34},${joint.y+47} ${joint.x-55},${joint.y-18}`;
    const hexagon=`${joint.x-34},${joint.y} ${joint.x-17},${joint.y-30} ${joint.x+17},${joint.y-30} ${joint.x+34},${joint.y} ${joint.x+17},${joint.y+30} ${joint.x-17},${joint.y+30}`;
    const mask=`<g class="pbr-carrier-mask"><polygon class="d5" points="${pentagon}"/><polygon class="d6" points="${hexagon}"/><path class="cross45" d="M${joint.x-42} ${joint.y-42}L${joint.x+42} ${joint.y+42}M${joint.x+42} ${joint.y-42}L${joint.x-42} ${joint.y+42}"/><polygon class="wing violet" points="${joint.x},${joint.y} ${joint.x-31},${joint.y-18} ${joint.x-24},${joint.y+24}"/><polygon class="wing gold" points="${joint.x},${joint.y} ${joint.x+31},${joint.y-18} ${joint.x+24},${joint.y+24}"/><circle cx="${joint.x}" cy="${joint.y}" r="7"/><text x="${joint.x}" y="${joint.y+4}" text-anchor="middle">Z̄</text></g>`;
    return `<g class="pbr-channel-projection" transform="rotate(${angle%360} 340 190)">${paths}${mask}</g>${legend}<text class="pbr-channel-generation" x="22" y="378">g${record.generation} · 3 PORTS × 4 CHANNELS · NO FEEDBACK</text><text class="pbr-mask-contract" x="660" y="378" text-anchor="end">D5 GREEN ≠ D6 RED · X 45° · 5+6=11 ≠ 11×11 ≠ 7×11</text>`;
  }

  function createTransport(win,options={}){
    const role=options.role==='source'?'source':'sink',onRecord=typeof options.onRecord==='function'?options.onRecord:()=>{};
    let latest=null,closed=false,channel=null,sourceWindow=options.sourceWindow||null;
    const validRecord=record=>Boolean(record&&record.schema==='nexah.a0.three-domain-channel-joint/1'&&record.fingerprint===canonical(record));
    const deliver=message=>{
      if(!message||message.schema!=='nexah.a0.three-domain-joint-transport/1')return;
      if(role==='source'&&message.type==='REQUEST'&&latest)send({type:'RECORD',record:latest});
      if(role==='sink'&&message.type==='RECORD'&&validRecord(message.record)){latest=message.record;onRecord(latest);}
    };
    const onLocal=event=>deliver(event.detail);
    const onMessage=event=>deliver(event.data);
    function send(payload){
      if(closed)return;
      const message={schema:'nexah.a0.three-domain-joint-transport/1',...payload};
      channel?.postMessage(message);
      if(typeof win.dispatchEvent==='function'&&typeof win.CustomEvent==='function')win.dispatchEvent(new win.CustomEvent('a0:three-domain-joint-transport',{detail:message}));
      if(role==='source'&&win.opener&&!win.opener.closed)win.opener.postMessage(message,'*');
      if(role==='sink'&&sourceWindow&&!sourceWindow.closed)sourceWindow.postMessage(message,'*');
    }
    if(typeof win.BroadcastChannel==='function')try{channel=new win.BroadcastChannel(CHANNEL_NAME);if(typeof channel.addEventListener==='function')channel.addEventListener('message',event=>deliver(event.data));else channel.onmessage=event=>deliver(event.data);}catch(error){channel=null;}
    win.addEventListener?.('a0:three-domain-joint-transport',onLocal);
    win.addEventListener?.('message',onMessage);
    if(role==='sink')send({type:'REQUEST'});
    return Object.freeze({
      publish(detail){if(role!=='source')throw new Error('sink cannot publish source records');latest=normalize(detail);send({type:'RECORD',record:latest});return latest;},
      request(){if(role==='sink')send({type:'REQUEST'});},
      attachSource(target){if(role!=='sink')throw new Error('only a sink can attach a source window');sourceWindow=target;send({type:'REQUEST'});return Boolean(sourceWindow);},
      close(){closed=true;channel?.close?.();win.removeEventListener?.('a0:three-domain-joint-transport',onLocal);win.removeEventListener?.('message',onMessage);},
      get latest(){return latest;}
    });
  }

  return{VERSION,CHANNEL_NAME,DOMAINS,CHANNELS,MASK_CONTRACT,validateLedger,phasor,normalize,capture,compare,svgMarkup,createTransport};
});
