'use strict';
// Offline static rendering of this bounded Mermaid subset. Mermaid remains the
// only maintained graph source; Graphviz changes layout, not routes or colours.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const source=path.join(__dirname,'assets/a0-navigation-blueprint-20261021.mmd');
function parse(text){
 const nodes=new Map(),classes=new Map(),edges=[];
 for(const raw of text.split('\n')){
  const l=raw.trim();if(!l||l==='flowchart TD')continue;
  let m=l.match(/^(\w+)(\{\{|\[\(|\[|\()"([^"]+)"(\}\}|\)\]|\]|\))$/);
  if(m){nodes.set(m[1],{label:m[3].replace(/<br\/>/g,'\n'),shape:m[2]==='{{'?'hexagon':m[2]==='[('?'cylinder':'box',rounded:m[2]==='('});continue;}
  m=l.match(/^(\w+) (-->|==>|-\.->)(?:\|"([^"]+)"\|)? (\w+)$/);
  if(m){edges.push({from:m[1],to:m[4],label:m[3]||'',dashed:m[2]==='-.->',coupled:m[2]==='==>'});continue;}
  m=l.match(/^classDef (\w+) (.+)$/);
  if(m){classes.set(m[1],Object.fromEntries(m[2].split(',').map(p=>{const i=p.indexOf(':');return[p.slice(0,i),p.slice(i+1)];})));continue;}
  m=l.match(/^class ([\w,]+) (\w+)$/);
  if(m){for(const id of m[1].split(',')){if(!nodes.has(id))throw Error('unknown node '+id);nodes.get(id).kind=m[2];}continue;}
  throw Error('unsupported blueprint line: '+l);
 }
 for(const e of edges)if(!nodes.has(e.from)||!nodes.has(e.to))throw Error('unknown endpoint');
 for(const n of nodes.values())if(!classes.has(n.kind))throw Error('missing colour class');
 return{nodes,classes,edges};
}
const q=s=>JSON.stringify(String(s));
function dot(graph){
 const lines=['digraph Blueprint {','graph [rankdir=TB,bgcolor="#061620",pad="0.3",nodesep="0.22",ranksep="0.55",fontname="Arial"];','node [fontname="Arial",fontsize=14,margin="0.16,0.12"];','edge [fontname="Arial",fontsize=10,color="#91b4c4",fontcolor="#c1d5df",arrowsize=0.65];'];
 for(const[id,n]of graph.nodes){const c=graph.classes.get(n.kind),style=['filled',...(n.rounded?['rounded']:[]),...(n.kind==='planned'?['dashed']:[])].join(',');lines.push(id+' [label='+q(n.label)+',shape='+n.shape+',style='+q(style)+',fillcolor='+q(c.fill)+',color='+q(c.stroke)+',fontcolor='+q(c.color)+',penwidth='+parseFloat(c['stroke-width'])+'];');}
 for(const e of graph.edges)lines.push(e.from+' -> '+e.to+' [label='+q(e.label)+',style='+q(e.dashed?'dashed':'solid')+(e.coupled?',penwidth=3,color="#ffc84d",fontcolor="#ffe5a3"':'')+(!['Gespeicherte Leseposition','Zusammenhang','Zusammenhang verstehen','Zur passenden Atlas-Werkstatt'].includes(e.label)?'':',constraint=false')+'];');
 return lines.join('\n')+'\n}\n';
}
function build(){const graph=parse(fs.readFileSync(source,'utf8')),output=source.replace(/\.mmd$/,'.svg');const result=spawnSync('dot',['-Tsvg','-o',output],{input:dot(graph),encoding:'utf8'});if(result.error||result.status!==0)throw result.error||Error(result.stderr);return{output,nodes:graph.nodes.size,edges:graph.edges.length};}
if(require.main===module)console.log(JSON.stringify(build()));
module.exports={parse,dot,build};
