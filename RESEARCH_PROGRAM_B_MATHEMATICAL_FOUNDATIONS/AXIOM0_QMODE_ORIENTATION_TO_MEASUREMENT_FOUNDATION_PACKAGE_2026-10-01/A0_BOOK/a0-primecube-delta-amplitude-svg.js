(()=>{
  'use strict';
  const root=document.querySelector('.pc-111213');
  if(!root)return;
  const svg=root.querySelector('[data-pc-111213-amplitude-svg]');
  if(!svg)return;
  const ns='http://www.w3.org/2000/svg',metrics=Array.from({length:12},(_,i)=>Math.sqrt(i+2)-Math.sqrt(i+1)),max=metrics[0];
  let angle=0,motion=0,motionFrame=null,lastTime=null,roundingTimer=null;
  const make=(tag,attrs={},text='')=>{const node=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));if(text)node.textContent=text;return node};
  const defs=make('defs');
  const bg=make('radialGradient',{id:'pcDeltaBg',cx:'48%',cy:'50%',r:'72%'});[['0%','#19334a'],['55%','#0a1b28'],['100%','#07111a']].forEach(([offset,color])=>bg.append(make('stop',{offset,'stop-color':color})));defs.append(bg);
  const glow=make('filter',{id:'pcDeltaGlow',x:'-50%',y:'-50%',width:'200%',height:'200%'});glow.append(make('feGaussianBlur',{stdDeviation:'4',result:'blur'}));const merge=make('feMerge');merge.append(make('feMergeNode',{in:'blur'}),make('feMergeNode',{in:'SourceGraphic'}));glow.append(merge);defs.append(glow);svg.append(defs);
  svg.append(make('rect',{width:960,height:650,fill:'url(#pcDeltaBg)'}));
  const grid=make('g',{stroke:'#35d3ee','stroke-opacity':'.17','stroke-width':1});for(let i=0;i<12;i++){const y=108+(i+.5)*36;grid.append(make('line',{x1:52,y1:y,x2:908,y2:y}))}for(let i=0;i<=12;i++){const x=52+i*856/12;grid.append(make('line',{x1:x,y1:90,x2:x,y2:540}))}svg.append(grid);
  const title=make('text',{x:480,y:38,fill:'#eef7fb','font-size':19,'font-weight':800,'text-anchor':'middle','font-family':'ui-monospace,monospace'},'Δ1–Δ12 · ROOT AMPLITUDE / DOUBLE SLIT');svg.append(title);
  svg.append(make('text',{x:460,y:65,fill:'#f4c84a','font-size':11,'font-weight':800,'text-anchor':'middle','font-family':'ui-monospace,monospace'},'DISPLAY GATE · TWO APERTURES'));
  const gate=make('g',{fill:'#050c13',stroke:'#f4c84a','stroke-width':2,filter:'url(#pcDeltaGlow)'});gate.append(make('rect',{x:453,y:90,width:14,height:135}),make('rect',{x:453,y:275,width:14,height:100}),make('rect',{x:453,y:425,width:14,height:115}));svg.append(gate);
  const paths=make('g');svg.append(paths);
  const footer=make('g',{'font-family':'ui-monospace,monospace','font-size':11,'font-weight':650,fill:'#89a6b7'});footer.append(make('text',{x:52,y:585},'INCOMING GRID / STRAIGHT REFERENCE'),make('text',{x:908,y:585,'text-anchor':'end'},'ROUNDED BY ROTATION + DRIFT'));const status=make('text',{x:480,y:620,'text-anchor':'middle',fill:'#f4c84a'});footer.append(status);svg.append(footer);
  function update(){
    paths.replaceChildren();
    const phase=(angle+motion*8)*Math.PI/180,slits=[250,400];
    metrics.forEach((metric,index)=>{const norm=metric/max,row=126+index*34,slit=slits[index%2],sign=index%2?1:-1,round=(.22+.78*norm)*Math.sin(phase+index*.43),end=row+round*100,control=slit+sign*(52+82*norm)*Math.cos(phase-index*.17),color=index%2?'#ed68ad':'#35d3ee',opacity=.28+.7*norm,width=1.2+2.2*norm;
      paths.append(make('path',{d:`M 52 ${row} C 210 ${row}, 365 ${slit}, 451 ${slit}`,fill:'none',stroke:color,'stroke-width':width,'stroke-opacity':opacity,'stroke-linecap':'round'}));
      paths.append(make('path',{d:`M 469 ${slit} C 555 ${control}, 748 ${end-round*25}, 908 ${end}`,fill:'none',stroke:color,'stroke-width':width,'stroke-opacity':opacity,'stroke-linecap':'round'}));
      paths.append(make('rect',{x:447,y:slit-3,width:26,height:6,rx:3,fill:'#f4c84a',opacity:.9}));
      paths.append(make('text',{x:916,y:end+4,fill:'#eef7fb','fill-opacity':.6+.4*norm,'font-size':index<3?12:10,'font-weight':index<3?800:650,'font-family':'ui-monospace,monospace'},`Δ${index+1}`));
    });
    status.textContent=`θ ${Math.round(angle)}° · DRIFT 80° · EXACT COMPARATOR 72° · ΣΔk = √13−1`;
  }
  function animate(time){if(lastTime===null)lastTime=time;motion=(motion+(time-lastTime)/430)%28;lastTime=time;update();motionFrame=requestAnimationFrame(animate)}
  const motionButton=root.querySelector('[data-pc-111213-motion]'),playButton=root.querySelector('[data-pc-111213-play]');
  root.querySelector('[data-pc-111213-72]').addEventListener('click',()=>{angle=(angle+72)%360;update()});
  root.querySelector('[data-pc-111213-80]').addEventListener('click',()=>{angle=(angle+80)%360;update()});
  root.querySelector('[data-pc-111213-180]').addEventListener('click',()=>{angle=(angle+180)%360;update()});
  motionButton.addEventListener('click',()=>{if(motionFrame){cancelAnimationFrame(motionFrame);motionFrame=null;lastTime=null}else{motionFrame=requestAnimationFrame(animate)}});
  playButton.addEventListener('click',()=>{if(roundingTimer){clearInterval(roundingTimer);roundingTimer=null}else{angle=(angle+80)%360;update();roundingTimer=setInterval(()=>{angle=(angle+80)%360;update()},1200)}});
  update();
})();
