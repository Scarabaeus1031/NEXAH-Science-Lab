(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-orientation-controller-bench.js'):root.A0OrientationController,node?require('./a0-mask-observer.js'):root.A0MaskObserver,node?require('./a0-return-economy.js'):root.A0ReturnEconomy,node?require('./a0-bench-body-gallery.js'):root.A0BenchBodyGallery,node?require('./a0-bench-map.js'):root.A0BenchMap);
 if(node)module.exports=api;else root.A0BenchStructureVisuals=api;
})(typeof globalThis==='undefined'?this:globalThis,function(C,Mask,Return,Body,MapModel){
 'use strict';
 const META={
  SOURCE:{label:'Quellgeometrie · Body-Referenz',source:'a0-pentagon-body-player-v1.js / buildBody',kind:'SOURCE_GEOMETRY'},
  STATE:{label:'Quellfixture · fünf Adresskanäle',source:'a0-orientation-controller-bench.js / createState, PRIMES',kind:'SOURCE_FIXTURE'},
  OPERATE:{label:'Quellfixture · J / R / E',source:'a0-orientation-controller-bench.js / applyOperator',kind:'SOURCE_FIXTURE'},
  VIEW:{label:'Quellgeometrie · Maskentick 0',source:'a0-mask-observer.js / frame(DEFAULT, 0)',kind:'SOURCE_GEOMETRY'},
  RETURN:{label:'Quellfixture · Q106-Return',source:'a0-return-economy.js / q106Record(42)',kind:'SOURCE_FIXTURE'},
  VERIFY:{label:'Konzeptgrafik · vorhandene Record-Struktur',source:'a0-bench-map.js / MODULES, EDGES',kind:'CONCEPT'}
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=(x,y,s,color='#b5cfda',size=13)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="system-ui" font-size="'+size+'">'+esc(s)+'</text>';
 const line=(x,y,a,b,color='#5cd7df')=>'<path d="M'+x+' '+y+'L'+a+' '+b+'" stroke="'+color+'" fill="none"/>';
 function fixture(group){
  if(group==='STATE')return{primes:C.PRIMES.slice(),state:C.createState()};
  if(group==='OPERATE'){const before=C.createState();return{before,after:['J','R','E'].map(op=>({op,state:C.applyOperator(before,op,{},false)}))};}
  if(group==='VIEW')return Mask.frame(Mask.DEFAULT,0);
  if(group==='RETURN')return Return.q106Record(42);
  if(group==='VERIFY')return{modules:MapModel.MODULES.length,edges:MapModel.EDGES.length,groups:MapModel.GROUPS.length};
  return null;
 }
 function svg(group){
  if(!META[group])throw Error('unknown structure group');
  if(group==='SOURCE')return Body.svg(Body.ITEMS[0]).replace('<rect width="440" height="270" fill="#04151f"/>','');
  let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 270" role="img"><title>'+esc(META[group].label)+'</title>',f=fixture(group);
  if(group==='STATE'){
   for(let i=0;i<5;i++){const x=55+i*72;
    s+='<path d="M'+x+' 60l18 -15h40v125l-18 15H'+x+'Z" fill="#102e3e" stroke="#4a8ca4"/>';
    s+=text(x+17,78,f.primes[i],'#e7bf63',19)+text(x+19,126,f.state.address[i],i===0?'#64e4dc':'#8eafbe',25);
   }s+=text(55,225,'feste Adresse ['+f.state.address.join(', ')+'] · kein Live-Readback');
  }else if(group==='OPERATE'){
   for(let i=0;i<3;i++){const x=78+i*140,a=f.after[i];s+='<circle cx="'+x+'" cy="112" r="43" fill="#092432" stroke="'+['#ed75b1','#5fdce2','#e8be62'][i]+'"/>';
    s+=text(x-10,120,a.op,'#e9f5f8',27);
    s+=text(x-42,188,i===0?'x: '+f.before.position+' → '+a.state.position:i===1?'θ: 0° → '+a.state.orientation+'°':'s: 1 → '+a.state.scale);
   }s+=text(38,236,'Drei getrennte Operatorbeispiele · kein gemeinsamer Antrieb');
  }else if(group==='VIEW'){
   const pts=p=>p.map(([x,y])=>(148+x*90).toFixed(2)+','+(134-y*90).toFixed(2)).join(' ');
   s+='<polygon points="'+pts(f.a)+'" fill="#31cde922" stroke="#31cde9"/><polygon points="'+pts(f.b)+'" fill="#ef75b122" stroke="#ef75b1"/>';
   for(const p of f.cuts.points)s+='<circle cx="'+(148+p[0]*90)+'" cy="'+(134-p[1]*90)+'" r="3" fill="#d3f5e8"/>';
   s+='<circle cx="335" cy="45" r="5" fill="white"/>'+line(280,130,414,130,'#7b98a8');
   for(const w of f.windows){s+=line(335,45,335+w.screenInterval[0]*130,130)+line(335,45,335+w.screenInterval[1]*130,130,'#ef75b1');}
   s+=text(48,250,f.cuts.points.length+' Schnitte · zwei Maskenfenster · feste Referenz');
  }else if(group==='RETURN'){
   const values=[['Quelle',f.label],['View',f.view],['Rest',f.residual],['Return',f.returnLabel]];
   values.forEach(([label,value],i)=>{const x=15+i*108;s+='<rect x="'+x+'" y="75" width="98" height="112" rx="12" fill="#102b3a" stroke="'+(i===3?'#71ddb0':'#6b8b9d')+'"/>'+text(x+9,106,label,'#e8bd62')+text(x+9,145,value,'#cce8ee',i===2?10:15);if(i<3)s+=line(x+98,130,x+108,130);});
   s+=text(30,235,f.exact?'Exakter Beispiel-Return · Quellschlüssel und Rest behalten':'HOLD');
  }else{
   for(let i=0;i<3;i++){const x=64+i*92,y=60+i*12;s+='<path d="M'+x+' '+y+'h110v120H'+x+'Z" fill="#0a2939" stroke="'+['#54d7ef','#b78aef','#efbd55'][i]+'"/>';for(let j=0;j<4;j++)s+=line(x+14,y+25+j*18,x+95,y+25+j*18,'#4d758b');}
   s+=text(44,235,f.modules+' Module · '+f.edges+' Kantenrecords · keine neuen Testergebnisse');
  }
  return s+'</svg>';
 }
 function image(group){return{url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(group)),label:META[group].label,kind:META[group].kind};}
 const POS={SOURCE:[440,240,360,235],STATE:[35,40,340,215],OPERATE:[35,430,340,215],VIEW:[865,40,340,215],RETURN:[865,430,340,215],VERIFY:[440,630,360,215]};
 function ports(){
  return MapModel.MODULES.map(m=>{const [x,y,w,h]=POS[m.group],i=MapModel.MODULES.filter(n=>n.group===m.group).findIndex(n=>n.id===m.id);return{...m,x:x+30+(i%6)*48,y:y+h+15+Math.floor(i/6)*26};});
 }
 function composition(selected,colors,dashes){
  const nodes=ports(),byId=new Map(nodes.map(n=>[n.id,n])),current=MapModel.moduleById(selected);
  let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 960" role="group" aria-label="Räumliche Gesamtkomposition der Bench"><title>Quellvisuals in konzeptioneller räumlicher Anordnung; nur bestehende Kantenrecords</title><ellipse cx="620" cy="815" rx="530" ry="90" fill="none" stroke="#214455" stroke-dasharray="3 12"/>';
  for(const e of MapModel.EDGES){const a=byId.get(e.from),b=byId.get(e.to),active=e.from===selected||e.to===selected;
   s+='<path data-machine-edge="'+e.id+'" d="M'+a.x+' '+a.y+'Q620 415 '+b.x+' '+b.y+'" fill="none" stroke="'+colors[e.bindingType]+'" stroke-dasharray="'+dashes[e.bindingType]+'" opacity="'+(active?.8:.13)+'" stroke-width="'+(active?3:1.2)+'"><title>'+esc(e.from+' → '+e.to+' · '+e.bindingType)+'</title></path>';}
  for(const g of MapModel.GROUPS){const [x,y,w,h]=POS[g.id],im=image(g.id),active=current?.group===g.id;
   s+='<g opacity="'+(active?1:.8)+'"><image x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" href="'+esc(im.url)+'"/>'+text(x+15,y-8,{SOURCE:'Körper / Träger',STATE:'Adressplatten',OPERATE:'Operatoren',VIEW:'Schnitt / Observer',RETURN:'Rest / Rückweg',VERIFY:'Record / Prüfung'}[g.id],active?'#f3d183':'#c0dbe6',17)+text(x+15,y+h-2,im.label,'#95b4c4',10)+'</g>';}
  for(const [i,n]of nodes.entries())s+='<a href="#'+esc(n.focusTarget)+'" data-machine-select="'+n.id+'" aria-label="'+esc(n.label)+'" aria-current="'+(n.id===selected)+'"><title>'+esc(n.label+' · '+n.bindingType)+'</title><circle cx="'+n.x+'" cy="'+n.y+'" r="'+(n.id===selected?11:8)+'" fill="#082638" stroke="'+(n.id===selected?'#fff':colors[n.bindingType])+'" stroke-width="2"/>'+text(n.x-4,n.y+3,String(i+1),'#e2f0f4',8)+'</a>';
  return s+text(365,940,'KONZEPTUELLE ANORDNUNG ≠ PHYSISCHE GESAMTMASCHINE','#8aa9bb',12)+'</svg>';
 }
 return{META,POS,fixture,svg,image,ports,composition};
});
