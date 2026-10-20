(() => {
  'use strict';
  const model=window.A0SewingScoreModel,view=window.A0PentagonSewingView,host=document.getElementById('sewingScore');if(!model||!view||!host)return;
  const $=id=>document.getElementById(id),svg=$('scoreSvg'),ns='http://www.w3.org/2000/svg',tracks={pulse:true,breath:true,floor:true,AM:true,VM:true,PM:true,sewing:true,shadow:true,echo:false};
  let bpm=78,meter=4,frequencies=[3,2,1],linked=true,delay=.5,lastState=null,needle=null,sourceKey=null;
  const rows=[['pulse','Grundpuls · Viertel / Achtel','#9bb7c5'],['breath','Atem · 6–1–6','#e5b340'],['floor','Boden · trägt durchgehend','#426679'],['AM','AM · s₁-Maxima','#e5b340'],['VM','VM · s₂-Maxima','#29c7ef'],['PM','PM · s₃-Maxima','#ee6ca5'],['sewing','Sewing · Beginn / Wende / Rückweg','#63d9aa'],['shadow','Schatten · Projektion ohne Verzögerung','#bca7dd'],['echo','Echo · Zusatzspur mit Nachlauf','#d778ff']];
  const add=(tag,attrs,label)=>{const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(label!==undefined)el.textContent=label;svg.appendChild(el);return el;},x=beat=>255+beat/model.layout(meter).beats*1020;
  function build(){
    svg.replaceChildren();const span=model.layout(meter),events=model.events(lastState?.residuals,frequencies,meter);
    for(let beat=0;beat<=span.beats;beat++){add('line',{x1:x(beat),y1:30,x2:x(beat),y2:415,stroke:beat%13===0?'#e5b340':beat%meter===0?'#5b8697':'#223d4b','stroke-width':beat%13===0?2:1});if(beat%meter===0)add('text',{x:x(beat)+3,y:20,fill:'#c0d5df','font-size':11},`T${beat/meter+1}`);}
    for(let theme=0;theme<span.themes;theme++)add('text',{x:x(theme*13)+3,y:45,fill:'#e5b340','font-size':10},`Thema ${theme+1}`);
    if(meter===5)add('text',{x:790,y:426,fill:'#e5b340','font-size':11},'Seam: 65 = 13×5 = p₆×p₃ = 64+1 · Raster-Return');
    rows.forEach(([key,label,color],i)=>{const y=73+i*39,index=['AM','VM','PM'].indexOf(key),currentLabel=index>=0?`${key} · s${index+1}-Maxima · ${frequencies[index]}`:label;add('text',{x:10,y:y+4,fill:tracks[key]?color:'#5b7280','font-size':11},currentLabel);add('line',{x1:255,y1:y,x2:1275,y2:y,stroke:'#294b5b'});if(!tracks[key])return;
      if(key==='pulse'){for(let n=0;n<span.beats*2;n++)add('line',{x1:x(n/2),y1:y-(n%2?4:9),x2:x(n/2),y2:y+4,stroke:n%(meter*2)===0?'#fff2ba':color,'stroke-width':n%(meter*2)===0?3:1});}
      else if(key==='floor')add('rect',{x:255,y:y-8,width:1020,height:16,fill:color,opacity:.65});
      else if(key==='breath'){for(let start=0;start<span.beats;start+=13)add('path',{d:`M${x(start)},${y+9} L${x(start+6)},${y-9} L${x(start+7)},${y-9} L${x(start+13)},${y+9}`,fill:'none',stroke:color,'stroke-width':2});}
      else{const beats=key==='echo'?model.echoes(events.shadow,delay,(lastState?.time??0)>=span.themes*model.TAU,meter):events[key];for(const beat of beats)add('circle',{cx:x(beat),cy:y,r:key==='echo'?4:3.5,fill:key==='echo'?'none':color,stroke:color,'stroke-width':1.5});}
    });
    needle=add('line',{x1:255,y1:30,x2:255,y2:415,stroke:'#ffffff','stroke-width':2});
    if(lastState)update(lastState);
  }
  function snapshot(){return{bpm,meter,frequencies:frequencies.slice(),arrangement:model.layout(meter),linked,delayBeats:delay,tracks:{...tracks},definition:'1 quarter = 1 BPM beat; 13 quarters per breath; meter and signal ratio are independent; events = upper extrema of first signal in each pair view'};}
  function update(state){const key=(state.residuals??[1,1,1]).join(',')+':'+(state.time>=model.layout(meter).themes*model.TAU);lastState=state;if(key!==sourceKey){sourceKey=key;build();return;}const p=model.position(state.time,meter);if(needle){needle.setAttribute('x1',x(p.arrangement));needle.setAttribute('x2',x(p.arrangement));}
    $('scorePlay').textContent=state.playing?'Pause':'Partitur starten';$('scorePosition').textContent=`${bpm} BPM · ${meter}/4 · Signale ${frequencies.join(':')} · ${model.layout(meter).beats} Viertel bis Raster-Return · Atem ${(bpm/13).toFixed(2)}/min · Position ${p.position}/13 · ${p.section} · Takt ${p.bar}, Viertel ${p.quarter} · ${linked?'mit Geometrie gekoppelt':'nur mitlaufende Anzeige; ×-Tempo aktiv'}`;
    $('scoreLink').textContent=linked?'Gemeinsame Uhr · an':'Gemeinsame Uhr · aus';$('scoreLink').setAttribute('aria-pressed',String(linked));
  }
  window.A0SewingScore={rate:()=>linked?model.rate(bpm):null,geometry:time=>linked?{...model.position(time,meter),frequencies:frequencies.slice(),tracks:{...tracks},echoDelay:tracks.echo?delay/13*model.TAU:null}:null,snapshot,update};
  rows.forEach(([key,label])=>{const wrapper=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=tracks[key];box.addEventListener('change',()=>{tracks[key]=box.checked;build();view.refresh();});wrapper.append(box,document.createTextNode(label));$('scoreTracks').appendChild(wrapper);});
  $('scoreBpm').addEventListener('input',()=>{bpm=Number($('scoreBpm').value);$('scoreBpmOut').textContent=String(bpm);view.refresh();});
  $('scoreMeter').addEventListener('change',()=>{meter=Number($('scoreMeter').value);build();view.refresh();});
  $('scoreRatio').addEventListener('change',()=>{frequencies=$('scoreRatio').value.split(':').map(Number);view.clearTrace();build();view.refresh();});
  $('scoreDelay').addEventListener('input',()=>{delay=Number($('scoreDelay').value)/2;$('scoreDelayOut').textContent=`${delay} Viertel`;build();view.refresh();});
  $('scoreLink').addEventListener('click',()=>{linked=!linked;view.clearTrace();view.refresh();});
  $('scorePlay').addEventListener('click',()=>view.setPlaying(!view.snapshot().playing));
  $('scoreReset').addEventListener('click',()=>view.reset());
  build();view.refresh();
})();
