(()=>{
  const NS="http://www.w3.org/2000/svg", $=(q)=>document.querySelector(q);
  const addEdge=(set,a,b)=>set.add(a<b?`${a},${b}`:`${b},${a}`);
  const makeGraph=(kind)=>{
    const edges=new Set(), positions=[], labels=[]; let title,note;
    if(kind==="pentagon"){
      title="Pentagon C5"; note="Der elementare Kontrollfall: zwei orientierte primitive Klassen derselben geometrischen 5-Runde.";
      for(let i=0;i<5;i++){addEdge(edges,i,(i+1)%5); positions.push([380+230*Math.cos(-Math.PI/2+i*2*Math.PI/5),300+230*Math.sin(-Math.PI/2+i*2*Math.PI/5)]);labels.push(`p${i}`)}
    }else if(kind==="dodecahedron"){
      title="Dodekaeder · generalized Petersen G(10,2)"; note="Exakter kubischer Graph: 20 Ecken, 30 Kanten. φ gehört zu möglichen Koordinatenrealisierungen, nicht zum Hashimoto-Operator.";
      for(let i=0;i<10;i++){addEdge(edges,i,(i+1)%10);addEdge(edges,10+i,10+(i+2)%10);addEdge(edges,i,10+i);positions.push([380+245*Math.cos(-Math.PI/2+i*Math.PI/5),300+245*Math.sin(-Math.PI/2+i*Math.PI/5)]);labels.push(`u${i}`)}
      for(let i=0;i<10;i++){positions.push([380+120*Math.cos(-Math.PI/2+i*Math.PI/5),300+120*Math.sin(-Math.PI/2+i*Math.PI/5)]);labels.push(`v${i}`)}
    }else if(kind==="word"){
      title="Word-return carrier";note="Ein deklarierter 12-State-Democarrier: Ring plus drei typed return chords. Er illustriert die Übersetzung eines endlichen Operatorworts in edge states.";
      for(let i=0;i<12;i++){addEdge(edges,i,(i+1)%12);positions.push([380+235*Math.cos(-Math.PI/2+i*Math.PI/6),300+235*Math.sin(-Math.PI/2+i*Math.PI/6)]);labels.push(`q${i}`)}
      [[0,6],[2,8],[4,10]].forEach(([a,b])=>addEdge(edges,a,b));
    }else{
      title="Tree control · no cycle";note="Azyklische Negativkontrolle. B ist nilpotent, alle geschlossenen non-backtracking traces verschwinden und Z⁻¹=1.";
      const p=[[380,70],[260,175],[500,175],[185,300],[335,300],[425,300],[575,300],[135,450],[235,450],[305,450],[365,450],[395,450],[455,450],[525,450],[625,450]];p.forEach((x,i)=>{positions.push(x);labels.push(`t${i}`)});[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[4,9],[4,10],[5,11],[5,12],[6,13],[6,14]].forEach(([a,b])=>addEdge(edges,a,b));
    }
    return{title,note,positions,labels,edges:[...edges].map(e=>e.split(",").map(Number))};
  };
  const adjacency=(g)=>{const a=Array.from({length:g.positions.length},()=>[]);g.edges.forEach(([x,y])=>{a[x].push(y);a[y].push(x)});return a};
  const rotations=(a)=>a.map((_,i)=>a.slice(i).concat(a.slice(0,i)));
  const canonical=(a)=>rotations(a).map(x=>x.join(",")).sort()[0];
  const primitive=(a)=>{for(let p=1;p<a.length;p++)if(a.length%p===0&&a.every((v,i)=>v===a[i%p]))return false;return true};
  const cycles=(g,max)=>{
    const adj=adjacency(g), seen=new Map();
    for(const [s,n] of g.edges.flatMap(([a,b])=>[[a,b],[b,a]])){
      const walk=(path)=>{const last=path.at(-1),prev=path.at(-2),len=path.length-1;if(len>=max)return;
        for(const next of adj[last]){if(next===prev)continue;if(next===s){const word=path.slice();if(len+1>=3&&last!==path[1]&&primitive(word)){const key=canonical(word);if(!seen.has(key))seen.set(key,word)}continue}if(len+1<max)walk([...path,next])}
      };walk([s,n]);
    }
    return[...seen.values()].sort((a,b)=>a.length-b.length||canonical(a).localeCompare(canonical(b)));
  };
  const directed=(g)=>g.edges.flatMap(([a,b])=>[[a,b],[b,a]]);
  const matrixB=(g)=>{const ds=directed(g),idx=new Map(ds.map((e,i)=>[e.join(","),i])),adj=adjacency(g),B=Array.from({length:ds.length},()=>Array(ds.length).fill(0));ds.forEach(([a,b],i)=>adj[b].forEach(c=>{if(c!==a)B[i][idx.get(`${b},${c}`)]=1}));return B};
  const multiply=(A,B)=>{const n=A.length,C=Array.from({length:n},()=>Array(n).fill(0));for(let i=0;i<n;i++)for(let k=0;k<n;k++)if(A[i][k])for(let j=0;j<n;j++)if(B[k][j])C[i][j]+=A[i][k]*B[k][j];return C};
  const traces=(B,max)=>{if(!B.length)return[];let P=B.map(r=>r.slice());const out=[];for(let k=1;k<=max;k++){out.push(P.reduce((s,r,i)=>s+r[i],0));if(k<max)P=multiply(P,B)}return out};
  const determinant=(M)=>{const A=M.map(r=>r.slice());let det=1;for(let i=0;i<A.length;i++){let p=i;for(let j=i+1;j<A.length;j++)if(Math.abs(A[j][i])>Math.abs(A[p][i]))p=j;if(Math.abs(A[p][i])<1e-12)return 0;if(p!==i){[A[p],A[i]]=[A[i],A[p]];det*=-1}const q=A[i][i];det*=q;for(let j=i+1;j<A.length;j++){const f=A[j][i]/q;for(let k=i+1;k<A.length;k++)A[j][k]-=f*A[i][k]}}return det};
  const bass=(g,u)=>{const a=adjacency(g),n=a.length,m=g.edges.length,M=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>(i===j?1+u*u*(a[i].length-1):a[i].includes(j)?-u:0)));return Math.pow(1-u*u,m-n)*determinant(M)};
  const spectralRadius=(B)=>{if(!B.length)return 0;let v=Array(B.length).fill(1/Math.sqrt(B.length)),rho=0;for(let k=0;k<80;k++){const w=B.map(r=>r.reduce((s,x,j)=>s+x*v[j],0)),norm=Math.hypot(...w);if(norm<1e-12)return 0;v=w.map(x=>x/norm);rho=norm}return rho};
  let current=[],selected=0,graph;
  const svgEl=(tag,attrs,text)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!=null)e.textContent=text;return e};
  function drawGraph(){const svg=$("#graphSvg"),c=current[selected]||[],selectedEdges=new Set(c.map((v,i)=>{const w=c[(i+1)%c.length];return v<w?`${v},${w}`:`${w},${v}`}));svg.innerHTML="";graph.edges.forEach(([a,b])=>{const key=a<b?`${a},${b}`:`${b},${a}`;svg.append(svgEl("line",{x1:graph.positions[a][0],y1:graph.positions[a][1],x2:graph.positions[b][0],y2:graph.positions[b][1],class:`edge ${selectedEdges.has(key)?"selected":""}`}))});graph.positions.forEach(([x,y],i)=>{svg.append(svgEl("circle",{cx:x,cy:y,r:13,class:`node ${c.includes(i)?"selected":""}`}));svg.append(svgEl("text",{x,y:y+4,class:"node-label"},graph.labels[i]))});$("#cycleName").textContent=c.length?`primitive oriented class · length ${c.length} · ${selected+1}/${current.length}`:"no primitive cycle in selected range";$("#cycleWord").textContent=c.length?c.map(i=>graph.labels[i]).join(" → ")+` → ${graph.labels[c[0]]}`:"acyclic control"}
  function drawOperator(){const s=$("#edgeSvg");s.innerHTML="";const pts=[[70,125],[270,55],[270,195],[490,55],[490,195]];[[0,1],[0,2],[1,3],[1,4],[2,3],[2,4]].forEach(([a,b],i)=>s.append(svgEl("line",{x1:pts[a][0],y1:pts[a][1],x2:pts[b][0],y2:pts[b][1],stroke:i<2?"#32d8ff":"#ff4fa3","stroke-width":i<2?5:3,"marker-end":"url(#arrow)"})));const defs=svgEl("defs",{}),marker=svgEl("marker",{id:"arrow",viewBox:"0 0 10 10",refX:9,refY:5,markerWidth:6,markerHeight:6,orient:"auto-start-reverse"});marker.append(svgEl("path",{d:"M0 0L10 5L0 10Z",fill:"#ff4fa3"}));defs.append(marker);s.prepend(defs);[[70,125,"a→b"],[270,55,"b→c"],[270,195,"b→d"],[490,55,"c→…"],[490,195,"d→…"]].forEach(([x,y,t])=>{s.append(svgEl("circle",{cx:x,cy:y,r:29,fill:"#071f2a",stroke:"#ffd05a","stroke-width":2}));s.append(svgEl("text",{x,y:y+5,fill:"#eaf5f7","text-anchor":"middle","font-family":"monospace","font-size":14},t))})}
  function update(){graph=makeGraph($("#graphSelect").value);const max=+$("#depth").value,u=+$("#uRange").value/1000;current=cycles(graph,max);selected=Math.min(selected,current.length-1);if(selected<0)selected=0;const B=matrixB(graph),ts=traces(B,max),adj=adjacency(graph),degrees=adj.map(x=>x.length),euler=current.reduce((p,c)=>p*(1-Math.pow(u,c.length)),1),bv=bass(graph,u),rho=spectralRadius(B);$("#graphTitle").textContent=graph.title;$("#graphNote").textContent=graph.note;$("#depthValue").textContent=max;$("#uValue").textContent=u.toFixed(3);$("#metricVertices").textContent=graph.positions.length;$("#metricEdges").textContent=graph.edges.length;$("#metricDirected").textContent=2*graph.edges.length;$("#metricDegree").textContent=Math.min(...degrees)===Math.max(...degrees)?String(degrees[0]):`${Math.min(...degrees)}–${Math.max(...degrees)}`;$("#metricCycles").textContent=current.length;$("#eulerValue").textContent=euler.toFixed(9);$("#bassValue").textContent=bv.toFixed(9);$("#gapValue").textContent=Math.abs(euler-bv).toExponential(3);$("#rhoValue").textContent=rho.toFixed(6);const maxT=Math.max(1,...ts);$("#traceBars").innerHTML=ts.map((v,i)=>`<div class="trace-row"><span>k=${i+1}</span><i style="width:${100*v/maxT}%"></i><b>${v}</b></div>`).join("");const hist=new Map();current.forEach(c=>hist.set(c.length,(hist.get(c.length)||0)+1));const mh=Math.max(1,...hist.values());$("#cycleHistogram").innerHTML=[...hist.entries()].map(([k,v])=>`<div><b>${v}</b><i style="height:${Math.max(2,120*v/mh)}px"></i><span>ℓ=${k}</span></div>`).join("")||"<p class='micro'>No cycle factors: Euler product and Bass inverse are exactly 1.</p>";drawGraph()}
  $("#graphSelect").addEventListener("change",()=>{selected=0;update()});$("#depth").addEventListener("input",()=>{selected=0;update()});$("#uRange").addEventListener("input",update);$("#nextCycle").addEventListener("click",()=>{if(current.length){selected=(selected+1)%current.length;drawGraph()}});drawOperator();update();
})();
