(() => {
  const records = {
    nexah: {type:"ORIENTATION HUB",title:"C Connect",copy:"Die Karte zwischen den Karten: Sie macht Wege und Zuständigkeiten sichtbar, ohne die Quellen zu verschmelzen.",role:"Route & return",boundary:"Navigation, keine neue Authority",trace:"Every door keeps its source",href:"#routes",action:"CHOOSE A ROUTE →"},
    experience: {type:"PUBLIC ENTRANCE",title:"NEXAH Experience",copy:"Die öffentliche und intellektuelle Einladung: lesen, entdecken und eine eigene Route durch das Ecosystem wählen.",role:"Public presentation",boundary:"Experience ≠ research proof",trace:"nexah.de · NEXAH-Experience",href:"https://nexah.de",action:"OPEN NEXAH.DE ↗"},
    science: {type:"RESEARCH & EVIDENCE",title:"Science Lab",copy:"Das Laboratory ist der lesbare Eingang in Programme, Evidence-Instrumente, Methoden und begrenzte Experimente. Von dort bleibt der technische Weg zum Repository offen.",role:"Research workspace",boundary:"Admission and evidence stay explicit",trace:"Laboratory → NEXAH-Science-Lab",href:"A0_LABORATORY.html",action:"ENTER LABORATORY →",sourceHref:"https://github.com/Scarabaeus1031/NEXAH-Science-Lab",sourceAction:"OPEN REPOSITORY ↗"},
    orion: {type:"CERTIFIED CORE",title:"NEXAH-ORION",copy:"Der deterministische Kern für strukturelle Repräsentation, Relationen, Navigation und prüfbare Expression.",role:"Core implementation",boundary:"Core ≠ total ecosystem",trace:"NEXAH-ORION",href:"https://github.com/Scarabaeus1031/NEXAH-ORION",action:"INSPECT ORION ↗"},
    workspace: {type:"HUMAN-FACING WORKSPACE",title:"NEXAHEDRON",copy:"Ein begrenzter Arbeitsraum für menschliche Orientierung, Begegnung und den Übergang von Bedeutung zu Handlung.",role:"Bounded workspace",boundary:"Workspace ≠ authority graph",trace:"nexahedron.com",href:"https://nexahedron.com",action:"ENTER WORKSPACE ↗"},
    library: {type:"PUBLIC LIBRARY",title:"Are.na Channels",copy:"Atlanten, Bücher, Bildspuren und Quellenmaterial als offene kulturelle Landschaft.",role:"Library & visual memory",boundary:"Collection ≠ validation",trace:"Are.na · NEXAH / Scarabaeus1031",href:"https://www.are.na/nexah-scarabaeus1031/channels",action:"EXPLORE LIBRARY ↗"},
    signals: {type:"PUBLIC SIGNALS",title:"Scarabaeus1033",copy:"Kurze öffentliche Spuren, Bilder und Fragen aus dem lebenden Prozess — Einladung, nicht Abschluss.",role:"Cultural signals",boundary:"Signal ≠ evidence",trace:"Instagram · X",href:"https://www.instagram.com/scarabaeus1033/",action:"FOLLOW THE SIGNAL ↗"}
  };
  const nodes = [...document.querySelectorAll(".system-node")];
  const out = {type:document.querySelector("#cardType"),title:document.querySelector("#cardTitle"),copy:document.querySelector("#cardCopy"),role:document.querySelector("#cardRole"),boundary:document.querySelector("#cardBoundary"),trace:document.querySelector("#cardTrace"),link:document.querySelector("#cardLink"),source:document.querySelector("#cardSource")};
  const playback = document.querySelector("#mapPlayback");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0;
  let timer;
  let paused = reduceMotion;
  const paintPlayback = () => {
    playback.closest(".orbit-map").classList.toggle("is-paused", paused);
    playback.setAttribute("aria-pressed", String(paused));
    playback.querySelector("span").textContent = paused ? "▶" : "Ⅱ";
    playback.querySelector("b").textContent = paused ? "PLAY MAP" : "PAUSE MAP";
    playback.querySelector("small").textContent = paused ? "reading mode" : "selection holds";
  };
  const schedule = () => {
    clearInterval(timer);
    if (!paused && !reduceMotion) timer = setInterval(() => show(nodes[(active + 1) % nodes.length]), 4200);
  };
  const setPaused = value => { paused = value; paintPlayback(); schedule(); };
  const show = (node, manual = false) => {
    const data = records[node.dataset.key]; if (!data) return;
    nodes.forEach(item => item.classList.toggle("active", item === node));
    out.type.textContent=data.type;out.title.textContent=data.title;out.copy.textContent=data.copy;out.role.textContent=data.role;out.boundary.textContent=data.boundary;out.trace.textContent=data.trace;out.link.href=data.href;out.link.textContent=data.action;
    if (/^https?:/.test(data.href)) {out.link.target="_blank";out.link.rel="noopener";} else {out.link.removeAttribute("target");out.link.removeAttribute("rel");}
    if (data.sourceHref) {out.source.hidden=false;out.source.href=data.sourceHref;out.source.textContent=data.sourceAction;out.source.target="_blank";out.source.rel="noopener";} else {out.source.hidden=true;out.source.removeAttribute("target");out.source.removeAttribute("rel");}
    active=nodes.indexOf(node);
    if (manual) setPaused(true);
  };
  nodes.forEach(node=>{node.addEventListener("click",()=>show(node,true));node.addEventListener("focus",()=>show(node,true));});
  playback.addEventListener("click",()=>setPaused(!paused));
  show(nodes[0]);paintPlayback();schedule();

  const canvas=document.querySelector("#connectCanvas"),ctx=canvas?.getContext("2d");
  if(!ctx)return;let points=[],w=0,h=0,t=0;
  const resize=()=>{const d=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);points=Array.from({length:48},(_,i)=>({a:(i/48)*Math.PI*2,r:80+Math.random()*Math.min(w,h)*.44,s:.0007+Math.random()*.0012,z:1+Math.random()*2.4}));};
  const draw=()=>{ctx.clearRect(0,0,w,h);const cx=w*.72,cy=h*.46;for(const p of points){if(!paused)p.a+=p.s;const x=cx+Math.cos(p.a)*p.r,y=cy+Math.sin(p.a)*p.r*.62;ctx.beginPath();ctx.arc(x,y,p.z,0,Math.PI*2);ctx.fillStyle=`rgba(${p.r%3<1?240:67},${p.r%3<1?79:215},${p.r%3<1?167:239},.5)`;ctx.fill();ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle="rgba(86,157,182,.055)";ctx.stroke();}t++;requestAnimationFrame(draw);};
  addEventListener("resize",resize,{passive:true});resize();if(!matchMedia("(prefers-reduced-motion: reduce)").matches)draw();
})();
