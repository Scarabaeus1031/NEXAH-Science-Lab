(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0SewingScoreModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=2*Math.PI,THEME=13,ARRANGEMENT=52;
  function rate(bpm){if(!Number.isFinite(bpm)||bpm<20||bpm>240)throw new RangeError('BPM must be 20..240');return TAU*bpm/(60*THEME);}
  function layout(meter=4){if(![4,5].includes(meter))throw new RangeError('meter 4 or 5 required');return{meter,beats:13*meter,themes:meter,bars:13};}
  function position(time,meter=4){const span=layout(meter).beats,beats=time/TAU*THEME,phase=((beats%THEME)+THEME)%THEME,position=Math.floor(phase),envelope=phase<6?phase/6:phase<7?1:(13-phase)/6;return{beats,arrangement:((beats%span)+span)%span,phase,position:position+1,bar:Math.floor(beats/meter)+1,quarter:Math.floor(beats%meter)+1,level:position<=6?7-position:position-5,envelope,breath:.96+.08*envelope,section:phase<6?'Öffnen':phase<7?'Wenden':'Schließen'};}
  function peaks(frequency,offset=0){const out=[];for(let n=-2;n<frequency+2;n++){const t=(Math.PI/2-offset+TAU*n)/frequency,beat=t/TAU*THEME;if(beat>=-1e-10&&beat<THEME-1e-10)out.push(Math.max(0,beat));}return out;}
  function events(residuals=[1,1,1],frequencies=[3,2,1],meter=4){if(![[3,2,1],[4,3,2]].some(p=>p.every((v,i)=>v===frequencies[i])))throw new RangeError('ratio 3:2:1 or 4:3:2 required');const tracks={AM:[],VM:[],PM:[],sewing:[],shadow:[]};for(let theme=0;theme<layout(meter).themes;theme++){const start=theme*13;[[frequencies[0],0,'AM'],[frequencies[1],Math.PI/2,'VM'],[frequencies[2],Math.PI/4,'PM']].forEach(([frequency,offset,key],i)=>{if(residuals[i]!==0)peaks(frequency,offset+(residuals[i]<0?Math.PI:0)).forEach(beat=>tracks[key].push(start+beat));});tracks.sewing.push(start,start+6,start+7);}
    // Shadow projection (x,y)->(x,0) has no temporal lag. Its x-coordinate's peaks match the first coordinate of each pair view.
    tracks.shadow=[...new Set([...tracks.AM,...tracks.VM,...tracks.PM])].sort((a,b)=>a-b);return tracks;}
  function echoes(source,delayBeats,wrap=false,meter=4){const span=layout(meter).beats;if(!Number.isFinite(delayBeats)||delayBeats<0||delayBeats>4)throw new RangeError('echo delay 0..4 quarters');return source.map(beat=>beat+delayBeats).filter(beat=>wrap||beat<span).map(beat=>wrap?beat%span:beat).sort((a,b)=>a-b);}
  return{TAU,THEME,ARRANGEMENT,rate,layout,position,peaks,events,echoes};
});
