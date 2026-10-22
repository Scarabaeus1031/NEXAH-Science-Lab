/* Source-bound snapshot of 66 cells; no network, no scientific runner. */
(function(root){
"use strict";
const data={"markers":[237,337,537,637,737,937],"rows":[{"name":"Ceres","scores":[0.380162,0.440437,0.345636,0.321261,0.381536,0.404536]},{"name":"Earth","scores":[0.4,0.4,0.4,0.4,0.4,0.4]},{"name":"Eris","scores":[0.391321,0.375632,0.309538,0.276491,0.256556,0.32265]},{"name":"Jupiter","scores":[0.331581,0.2783,0.301937,0.307944,0.382174,0.337588]},{"name":"Mars","scores":[0.289769,0.29978,0.321122,0.268427,0.357976,0.262926]},{"name":"Mercury","scores":[0.31375,0.382421,0.280236,0.288435,0.357106,0.305552]},{"name":"Neptune","scores":[0.431598,0.497565,0.377018,0.395464,0.461431,0.413152]},{"name":"Pluto","scores":[0.296021,0.395953,0.320098,0.371876,0.263851,0.347799]},{"name":"Saturn","scores":[0.532089,0.575774,0.637967,0.594282,0.550597,0.537884]},{"name":"Uranus","scores":[0.355674,0.255959,0.356528,0.256813,0.342903,0.257666]},{"name":"Venus","scores":[0.284733,0.258882,0.29282,0.318671,0.344522,0.396225]}]};
const mods=[3,5,7,37];
function address(n){return mods.map(m=>n%m);}
function reduced(n){return n%105;}
function candidates(n,full){return full?Array.from({length:37},(_,q)=>reduced(n)+105*q):data.markers.filter(v=>reduced(v)===reduced(n));}
function slot(i,mirror){return mirror?(6-i)%6:i;}
function restore(r,q){return r+105*q;}
const api={data,address,reduced,candidates,slot,restore};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
if(!root.document)return;
const doc=root.document,host=doc.getElementById("six-marker-comparison");
if(!host)return;
let selected=737;
const el=id=>doc.getElementById(id);
function mark(n){return 'data-grid-marker="'+n+'" aria-pressed="'+(n===selected)+'"';}
function ring(mirror){
 return '<svg viewBox="0 0 320 300" role="group" aria-label="'+(mirror?'Gespiegelter':'Polar')+' Sechs-Marker-Ring"><circle cx="160" cy="145" r="100" fill="none" stroke="currentColor" opacity=".25"/>'+data.markers.map((n,i)=>{
 const a=slot(i,mirror)*Math.PI/3,x=160+100*Math.cos(a),y=145-100*Math.sin(a);
 return '<g role="button" tabindex="0" aria-label="Marker '+n+'" '+mark(n)+'><circle cx="'+x.toFixed(3)+'" cy="'+y.toFixed(3)+'" r="24" class="'+(n===selected?'active':'')+'"/><text x="'+x.toFixed(3)+'" y="'+(y+5).toFixed(3)+'" text-anchor="middle">'+n+'</text></g>';
 }).join('')+'</svg>';
}
function render(){
 const hide=el("gridHide37").checked,key=el("gridReturnKey").checked,full=el("gridFullDomain").checked;
 el("gridMarkerRail").innerHTML=data.markers.map(n=>'<button type="button" '+mark(n)+'>'+n+'</button>').join('');
 el("gridHeatmap").innerHTML='<table><caption>66 Originalscores · Base 10 / AU · Werte auf zwei Stellen angezeigt</caption><thead><tr><th scope="col">Quellzeile</th>'+data.markers.map(n=>'<th scope="col"><button type="button" '+mark(n)+'>'+n+'</button></th>').join('')+'</tr></thead><tbody>'+data.rows.map(r=>'<tr><th scope="row">'+r.name+'</th>'+r.scores.map((v,i)=>'<td><button type="button" '+mark(data.markers[i])+' style="background:rgba(173,42,116,'+(v*.38).toFixed(3)+')" aria-label="'+r.name+', S='+data.markers[i]+', Originalscore '+v.toFixed(6)+'">'+v.toFixed(2)+'</button></td>').join('')+'</tr>').join('')+'</tbody></table>';
 el("gridCrt").innerHTML='<table><caption>Reste modulo 3, 5, 7, 37</caption><thead><tr><th>Marker</th>'+mods.map(m=>'<th>mod '+m+'</th>').join('')+'</tr></thead><tbody>'+data.markers.map(n=>'<tr class="'+(n===selected?'selected':'')+'"><th><button type="button" '+mark(n)+'>'+n+'</button></th>'+address(n).map((r,i)=>'<td>'+(hide&&i===3?'verborgen':r)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 el("gridPolar").innerHTML=ring(false);el("gridMirror").innerHTML=ring(true);
 const c=candidates(selected,full),r=reduced(selected),q=Math.floor(selected/105);
 el("gridReadout").textContent='Marker '+selected+' · CRT ('+address(selected).join(', ')+') · reduzierte Adresse '+r+' · '+c.length+' kompatible Zahl'+(c.length===1?'':'en')+' im '+(full?'Bereich 0–3884':'Sechser-Set')+'.';
 el("gridLoss").textContent=hide?'mod 37 verborgen: '+(full?'37 Kandidaten je Adresse.':'Diese sechs Marker bleiben trotzdem unterscheidbar.'):'Alle vier CRT-Koordinaten sichtbar: eindeutiger Return im Bereich 0–3884.';
 el("gridReturn").textContent=key?'Rückschlüssel q='+q+': '+r+' + 105 × '+q+' = '+restore(r,q)+'.':'Rückschlüssel ausgeblendet. Ein Score oder eine Farbe allein ist keine Marker-ID.';
 el("gridCandidates").textContent=hide?'Kompatible Zahlen: '+c.join(', '):'Kollisionskontrolle: 237 und 342 besitzen beide die reduzierte Adresse 27.';
}
host.addEventListener("click",ev=>{const b=ev.target.closest("[data-grid-marker]");if(!b||!host.contains(b))return;selected=Number(b.dataset.gridMarker);render();});
host.addEventListener("keydown",ev=>{if(ev.target.tagName.toLowerCase()==="g"&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();ev.target.dispatchEvent(new root.MouseEvent("click",{bubbles:true}));}});
["gridHide37","gridReturnKey","gridFullDomain"].forEach(id=>el(id).addEventListener("change",render));
render();
})(typeof window==="undefined"?globalThis:window);

