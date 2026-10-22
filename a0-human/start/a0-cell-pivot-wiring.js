/* Explicit display-slot adapter; existing Play cell return remains the only cell player. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0CellPivotWiringModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const bodies=['BLUE-01','BLUE-02','PINK-01','PINK-02','RETURN-00'];
  function id(index){if(!Number.isInteger(index)||index<0||index>=60)throw new RangeError('cell index 0..59');return`${bodies[Math.floor(index/12)]}:F${String(index%12+1).padStart(2,'0')}`;}
  function route(selected,shift=0){id(selected);if(!Number.isInteger(shift)||shift<0||shift>11)throw new RangeError('slot shift 0..11');
    const slot=selected<48?selected%12:(selected%12-shift+12)%12,pivot=48+(slot+shift)%12,sources=Array.from({length:4},(_,body)=>body*12+slot);
    return{adapter:'DECLARED_CYCLIC_FACE_SLOT_COMPARISON',shift,selected:{index:selected,id:id(selected)},origin:selected<48?{index:selected,id:id(selected)}:null,pivot:{index:pivot,id:id(pivot)},sources:sources.map(index=>({index,id:id(index)})),linkedIndices:[...sources,pivot],edges:sources.map(index=>({from:id(index),fromIndex:index,to:id(pivot),toIndex:pivot})),inverse:'Pivot slot plus shift recovers face slot, but not source body. Retain origin body or four candidates remain.',boundary:'Display-slot permutation only; not a geometric face correspondence, dynamics, optical path or new cell count'};
  }
  function recover(pivot,body,shift=0){if(!Number.isInteger(pivot)||pivot<48||pivot>=60||!Number.isInteger(body)||body<0||body>3)throw new RangeError('return cell and source body required');const r=route(pivot,shift);return r.sources[body];}
  return{id,route,recover};
});
(() => {
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('cellPivotWiring'),model=window.A0CellPivotWiringModel,view=window.A0BluePinkDodecaCellReturnView;
  if(!host||!model||!view)return;
  let trail=[],lastSelected=null,held=null;
  const enabled=()=>$('pivotWiringEnabled').checked,shift=()=>Number($('pivotWiringShift').value),current=()=>model.route(view.state.selected,shift());
  const clone=value=>JSON.parse(JSON.stringify(value));
  function snapshot(){return{kind:'FOUR_BODY_RETURN_PIVOT_COMPARISON',enabled:enabled(),route:current(),bodyView:clone(view.state),trail:clone(trail),scope:'Last 120 cell-selection changes driven by existing controls/Play cell return; not animation-frame history',counts:{body:48,return:12,total:60},tesaMapping:'UNBOUND_60_FACE_SLOTS_ARE_NOT_28_TESA_ADDRESSES'};}
  function update(){const r=current(),selected=view.state.selected;
    if(enabled()&&selected!==lastSelected){trail.push({step:(trail.at(-1)?.step??0)+1,source:r.origin,selected:r.selected,pivot:r.pivot,shift:shift(),sourceCandidates:r.origin?undefined:r.sources,filled:view.state.fill});trail=trail.slice(-120);}lastSelected=selected;
    document.querySelectorAll('.cell-dot').forEach(dot=>{const linked=enabled()&&r.linkedIndices.includes(Number(dot.dataset.index));dot.classList.toggle('pivot-linked',linked);});
    $('pivotWiringStatus').textContent=enabled()?`${r.origin?r.origin.id:'Return-Auswahl: vier mögliche Quellkörper'} → ${r.pivot.id} · vier explizite Slot-Vergleichswege · Versatz ${shift()} · ${trail.length} Auswahl-Schritte. Die Quelladresse bleibt erhalten; gleiche Slotnummer bedeutet keine geometrische Identität.`:'Verschaltung ausgeblendet. Die bestehenden Zelladressen und der vorhandene Spieler bleiben unverändert.';
    view.drawConnections?.();
  }
  function refresh(){update();view.refresh();}
  window.A0CellPivotWiring={
    isLinked(index,selected){return enabled()&&model.route(selected,shift()).linkedIndices.includes(index);},
    draw(context,faces){if(!enabled())return;const r=current(),center=index=>{const face=faces.find(f=>f.globalIndex===index);return face?[face.poly.reduce((s,p)=>s+p[0],0)/face.poly.length,face.poly.reduce((s,p)=>s+p[1],0)/face.poly.length]:null;},p=center(r.pivot.index);if(!p)return;
      context.save();context.strokeStyle='#63d9aa';context.lineWidth=2;context.setLineDash([4,5]);
      r.sources.forEach(source=>{const q=center(source.index);if(!q)return;context.beginPath();context.moveTo(q[0],q[1]);context.lineTo(p[0],p[1]);context.stroke();});context.setLineDash([]);context.fillStyle='#63d9aa';context.beginPath();context.arc(p[0],p[1],5,0,2*Math.PI);context.fill();context.restore();
    },get snapshot(){return snapshot();}
  };
  window.addEventListener('a0-cell-selection',update);
  $('pivotWiringEnabled').addEventListener('change',refresh);
  $('pivotWiringShift').addEventListener('change',()=>{trail=[];lastSelected=null;held=null;$('pivotWiringRecord').textContent='Noch kein Verschaltungsrecord gehalten.';refresh();});
  $('pivotWiringClear').addEventListener('click',()=>{trail=[];lastSelected=view.state.selected;update();});
  $('pivotWiringHold').addEventListener('click',()=>{view.pauseFill();held=clone({...snapshot(),capturedAt:new Date().toISOString()});$('pivotWiringRecord').textContent=JSON.stringify(held,null,2);});
  $('pivotWiringExport').addEventListener('click',()=>{const record=held??snapshot(),url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='a0-cell-pivot-wiring-return.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  refresh();
})();
