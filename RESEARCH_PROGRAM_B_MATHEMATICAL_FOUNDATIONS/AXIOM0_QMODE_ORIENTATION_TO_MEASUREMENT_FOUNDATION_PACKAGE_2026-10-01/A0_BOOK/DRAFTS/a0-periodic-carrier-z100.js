(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0PeriodicCarrierZ100=api;
  if(typeof document!=="undefined")document.addEventListener("DOMContentLoaded",()=>api.mount(document));
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const VIEW_LABELS={modern:"MODERNE PERIODENORDNUNG",cycle:"ZYKLISCHE LINSE",cube:"Z100 CARRIER"};

  function carrierRows(data){
    if(!data||!Array.isArray(data.rows))throw new Error("A0_Z100_DATA fehlt");
    return data.rows.filter(row=>row.z>=1&&row.z<=100);
  }

  function boundaryControl(data){
    return data.rows.find(row=>row.z===101);
  }

  function periodicPosition(z){
    if(z===1)return {row:1,col:1};
    if(z===2)return {row:1,col:18};
    if(z>=3&&z<=4)return {row:2,col:z-2};
    if(z>=5&&z<=10)return {row:2,col:z+8};
    if(z>=11&&z<=12)return {row:3,col:z-10};
    if(z>=13&&z<=18)return {row:3,col:z};
    if(z>=19&&z<=36)return {row:4,col:z-18};
    if(z>=37&&z<=54)return {row:5,col:z-36};
    if(z>=55&&z<=56)return {row:6,col:z-54};
    if(z>=57&&z<=71)return {row:8,col:z-54};
    if(z>=72&&z<=86)return {row:6,col:z-68};
    if(z>=87&&z<=88)return {row:7,col:z-86};
    if(z>=89&&z<=100)return {row:9,col:z-86};
    return null;
  }

  function cubePosition(z){
    return {deck:Math.floor((z-1)/10)+1,slot:(z-1)%10+1};
  }

  function cyclicPosition(z){
    const t=(z-1)/99;
    const angle=(z-1)*137.507764*Math.PI/180;
    const radius=8+39*Math.sqrt(t);
    return {x:50+Math.cos(angle)*radius,y:50+Math.sin(angle)*radius};
  }

  function unique(values){return [...new Set(values.filter(v=>v>=1&&v<=100))].sort((a,b)=>a-b);}

  function modernNeighbors(z){
    const p=periodicPosition(z);
    if(!p)return [];
    const out=[];
    for(let n=1;n<=100;n++){
      if(n===z)continue;
      const q=periodicPosition(n);
      if(q&&Math.abs(p.row-q.row)+Math.abs(p.col-q.col)===1)out.push(n);
    }
    return unique(out);
  }

  function cycleNeighbors(z){
    const previous=z===1?100:z-1;
    const next=z===100?1:z+1;
    return unique([previous,next,z-10,z+10]);
  }

  function cubeNeighbors(z){
    const p=cubePosition(z);
    const out=[];
    if(p.slot>1)out.push(z-1);
    if(p.slot<10)out.push(z+1);
    if(p.deck>1)out.push(z-10);
    if(p.deck<10)out.push(z+10);
    return unique(out);
  }

  function neighbors(view,z){
    if(view==="modern")return modernNeighbors(z);
    if(view==="cycle")return cycleNeighbors(z);
    if(view==="cube")return cubeNeighbors(z);
    throw new Error(`Unbekannte Ansicht: ${view}`);
  }

  function ledger(z,alternate){
    const baseline=modernNeighbors(z);
    const candidate=neighbors(alternate,z);
    const retained=baseline.filter(v=>candidate.includes(v));
    const lost=baseline.filter(v=>!candidate.includes(v));
    const introduced=candidate.filter(v=>!baseline.includes(v));
    return {baseline,candidate,retained,lost,introduced,unresolved:[]};
  }

  function pa231SevenfoldCalibration(){
    const nuclear={atomicNumber:91,neutrons:140,massNumber:231,divisor:7,quotients:[13,20,33]};
    const angular={l:3,m:[-3,-2,-1,0,1,2,3],electronConfiguration:"[Rn] 5f2 6d1 7s2"};
    const nuclearPass=nuclear.atomicNumber+nuclear.neutrons===nuclear.massNumber&&
      nuclear.quotients.every((q,index)=>[nuclear.atomicNumber,nuclear.neutrons,nuclear.massNumber][index]===nuclear.divisor*q);
    const angularPass=angular.m.length===2*angular.l+1&&angular.m[0]===-angular.l&&angular.m.at(-1)===angular.l;
    return {
      id:"A0_PA231_SEVENFOLD_CARDINALITY_CALIBRATION_R0",
      carrier:"Pa-231",
      nuclear,
      angular,
      ledger:{
        retained:["cardinality:7"],
        lost:["nuclear partition meaning"],
        introduced:["5f angular labels m_l=-3…+3"],
        unresolved:["causal coupling","shared physical mechanism"]
      },
      result:nuclearPass&&angularPass?"CARDINALITY_ONLY_PASS":"FIXTURE_FAILURE",
      stop:"SAME COUNT / DIFFERENT PHYSICAL ORIGINS / NO NEW RELATION"
    };
  }

  function broSisRelationTest(data){
    const bySymbol=new Map(carrierRows(data).map(row=>[row.symbol,row]));
    const declared={bro:["Br","O"],sis:["S","I","S"],brother:["Br","O","Th","Er"]};
    const cut=tokens=>tokens.map(symbol=>{
      const row=bySymbol.get(symbol);
      return row?{symbol:row.symbol,z:row.z,name:row.name}:null;
    });
    const cuts={bro:cut(declared.bro),sis:cut(declared.sis),brother:cut(declared.brother)};
    const complete=Object.values(cuts).flat().every(Boolean);
    return {
      id:"A0_Z100_BRO_SIS_DECLARED_TOKEN_COMPARISON_R0",
      carrier:"Z100 official element register",
      cuts,
      frame:{time:"T",relation:"R",insideA:"BRO",insideB:"SIS"},
      ledger:{
        retained:["Z100 carrier","declared time T","comparison record R"],
        lost:["view-local word reading"],
        introduced:["alternate token order and repetition"],
        unresolved:["O↔0 glyph reading","Th↔θ glyph reading","semantic coupling","causal coupling"]
      },
      result:complete?"EXACT_ADDRESS_FIXTURE_PASS":"FIXTURE_FAILURE",
      stop:"ELEMENT SYMBOL != NUMBER GLYPH != ANGLE GLYPH != WORD MEANING / NO NEW RELATION"
    };
  }

  function ioiQ0CounterAxisTest(data){
    const byZ=new Map(carrierRows(data).map(row=>[row.z,row]));
    const addresses={topLeft:45,topRight:46,bottomLeft:55,bottomRight:56};
    const cells=Object.fromEntries(Object.entries(addresses).map(([key,z])=>[key,byZ.get(z)||null]));
    const complete=Object.values(cells).every(Boolean);
    const fold={
      a:[addresses.topLeft,addresses.bottomRight],
      b:[addresses.topRight,addresses.bottomLeft]
    };
    const diagonalSums={
      a:fold.a.reduce((sum,z)=>sum+z,0),
      b:fold.b.reduce((sum,z)=>sum+z,0)
    };
    const counterAxis={
      left:addresses.topLeft+addresses.bottomLeft,
      right:addresses.topRight+addresses.bottomRight,
      top:addresses.topLeft+addresses.topRight,
      bottom:addresses.bottomLeft+addresses.bottomRight
    };
    const carrierTotal=Object.values(addresses).reduce((sum,z)=>sum+z,0);
    const center=diagonalSums.a;
    return {
      id:"A0_Z100_IOI_Q0_COUNTER_AXIS_FIXTURE_R0",
      carrier:"Z100 official element register",
      notation:{view:"I0I",aperture:"Q°",number:101,externalElement:"Md/Z101"},
      cells,
      fold,
      diagonalSums,
      counterAxis,
      offsets:{left:counterAxis.left-center,right:counterAxis.right-center,top:counterAxis.top-center,bottom:counterAxis.bottom-center},
      carrierTotal,
      mean:carrierTotal/4,
      ledger:{
        retained:["four exact Z addresses","two diagonal sums:101","counter-axis side information"],
        lost:["path provenance when only 101 is retained"],
        introduced:["declared Q° aperture","I0I view notation"],
        unresolved:["physical mechanism","chemical coupling","prime or zero interpretation"]
      },
      result:complete&&diagonalSums.a===101&&diagonalSums.b===101?"EXACT_COUNTER_AXIS_FIXTURE_PASS":"FIXTURE_FAILURE",
      stop:"I0I != 101 != Md/Z101 / Q° IS AN APERTURE, NOT AN ELEMENT OR ZERO / NO NEW RELATION"
    };
  }

  function validate(data){
    const rows=carrierRows(data);
    const md=boundaryControl(data);
    const zSet=new Set(rows.map(r=>r.z));
    const symbolSet=new Set(rows.map(r=>r.symbol));
    const periodicSet=new Set(rows.map(r=>{const p=periodicPosition(r.z);return `${p.row}:${p.col}`;}));
    const cubeSet=new Set(rows.map(r=>{const p=cubePosition(r.z);return `${p.deck}:${p.slot}`;}));
    const failures=[];
    if(rows.length!==100)failures.push("Z100 muss genau 100 Einträge enthalten");
    if(zSet.size!==100)failures.push("Z-Adressen sind nicht eindeutig");
    if(symbolSet.size!==100)failures.push("Elementsymbole sind nicht eindeutig");
    if(periodicSet.size!==100)failures.push("Moderne View-Adressen sind nicht eindeutig");
    if(cubeSet.size!==100)failures.push("Z100-Adressen sind nicht eindeutig");
    if(!md||md.symbol!=="Md"||md.name!=="Mendelevium")failures.push("Z101-Grenzkontrolle ist nicht Mendelevium");
    if(rows.some(r=>/ullin/i.test(`${r.symbol} ${r.name}`)))failures.push("ULLINIRIUM ist fälschlich im Elementregister");
    for(const row of rows){
      if(!periodicPosition(row.z)||!cubePosition(row.z)||!cyclicPosition(row.z))failures.push(`Fehlende View-Adresse Z${row.z}`);
    }
    return {ok:failures.length===0,failures,carrierCount:rows.length,boundary:md};
  }

  function elementButton(row,view,selected){
    const button=document.createElement("button");
    button.type="button";
    button.className="element-node";
    button.dataset.z=String(row.z);
    button.dataset.category=row.groupBlock.replace(/\s+/g,"-").toLowerCase();
    button.setAttribute("aria-label",`${row.name}, Z ${row.z}`);
    button.setAttribute("aria-pressed",String(row.z===selected));
    button.innerHTML=`<small>${row.z}</small><b>${row.symbol}</b>`;
    if(view==="modern"){
      const p=periodicPosition(row.z);
      button.style.gridRow=String(p.row);
      button.style.gridColumn=String(p.col);
    }else if(view==="cycle"){
      const p=cyclicPosition(row.z);
      button.style.left=`${p.x}%`;
      button.style.top=`${p.y}%`;
    }else{
      const p=cubePosition(row.z);
      button.style.gridRow=String(p.deck);
      button.style.gridColumn=String(p.slot);
    }
    return button;
  }

  function formatSet(values,byZ){
    if(!values.length)return '<span class="empty">∅</span>';
    return values.map(z=>`<button type="button" data-jump-z="${z}">${byZ.get(z).symbol}<small>${z}</small></button>`).join("");
  }

  function mount(doc){
    const data=typeof globalThis!=="undefined"?globalThis.A0_Z100_DATA:null;
    const app=doc.querySelector("[data-c100-app]");
    if(!app||!data)return;
    const report=validate(data);
    if(!report.ok){app.dataset.state="invalid";throw new Error(report.failures.join("; "));}
    const rows=carrierRows(data);
    const byZ=new Map(data.rows.map(row=>[row.z,row]));
    const state={view:"modern",compare:"cycle",selected:100};
    const field=app.querySelector("[data-c100-field]");
    const detail=app.querySelector("[data-c100-detail]");
    const ledgerRoot=app.querySelector("[data-c100-ledger]");
    const status=app.querySelector("[data-c100-status]");
    const viewButtons=[...app.querySelectorAll("[data-c100-view]")];
    const compareButtons=[...app.querySelectorAll("[data-c100-compare]")];
    const calibration=pa231SevenfoldCalibration();
    const calibrationRoot=app.querySelector("[data-pa231-calibration]");
    const broSis=broSisRelationTest(data);
    const broSisRoot=app.querySelector("[data-bro-sis-test]");
    const ioi=ioiQ0CounterAxisTest(data);
    const ioiRoot=app.querySelector("[data-ioi-test]");

    function render(){
      field.className=`carrier-field view-${state.view}`;
      field.setAttribute("aria-label",VIEW_LABELS[state.view]);
      field.replaceChildren(...rows.map(row=>elementButton(row,state.view,state.selected)));
      const row=byZ.get(state.selected);
      const p=state.view==="modern"?periodicPosition(row.z):state.view==="cycle"?cyclicPosition(row.z):cubePosition(row.z);
      detail.innerHTML=`<small>EXAKTER CARRIER-RETURN · ${VIEW_LABELS[state.view]}</small><div><strong>${row.symbol}</strong><span><b>${row.name}</b> · Z ${row.z}<br>${row.groupBlock} · ${row.electronConfiguration}</span></div><code>${state.view.toUpperCase()} ADDRESS ${Object.values(p).map(v=>typeof v==="number"?Number(v.toFixed(2)):v).join(" · ")} → Z${row.z}/${row.symbol}</code>`;
      const l=ledger(row.z,state.compare);
      ledgerRoot.querySelector("[data-ledger=retained]").innerHTML=formatSet(l.retained,byZ);
      ledgerRoot.querySelector("[data-ledger=lost]").innerHTML=formatSet(l.lost,byZ);
      ledgerRoot.querySelector("[data-ledger=introduced]").innerHTML=formatSet(l.introduced,byZ);
      ledgerRoot.querySelector("[data-ledger=unresolved]").innerHTML=formatSet(l.unresolved,byZ);
      ledgerRoot.querySelector("[data-ledger-title]").textContent=`MODERN ↔ ${VIEW_LABELS[state.compare]}`;
      status.textContent=`100/100 IDENTITIES · ${state.selected===100?"FM AT Z100 BOUNDARY":"RETURN EXACT"} · MD Z101 OUTSIDE · ULLINIRIUM META ONLY`;
      viewButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.c100View===state.view)));
      compareButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.c100Compare===state.compare)));
    }

    app.addEventListener("click",event=>{
      const view=event.target.closest("[data-c100-view]");
      const compare=event.target.closest("[data-c100-compare]");
      const element=event.target.closest("[data-z]");
      const jump=event.target.closest("[data-jump-z]");
      if(view)state.view=view.dataset.c100View;
      if(compare)state.compare=compare.dataset.c100Compare;
      if(element)state.selected=Number(element.dataset.z);
      if(jump)state.selected=Number(jump.dataset.jumpZ);
      if(view||compare||element||jump)render();
    });
    if(calibrationRoot){
      const output=calibrationRoot.querySelector("[data-pa231-output]");
      const buttons=[...calibrationRoot.querySelectorAll("[data-pa231-view]")];
      const copy={
        nuclear:`CUT A · 91 = 7×13 · 140 = 7×20 · 231 = 7×33 · A = Z + N`,
        angular:`CUT B · l = 3 · 2l+1 = 7 · m_l = ${calibration.angular.m.join(" · ")}`,
        return:`${calibration.result} · RETAINED: 7 · UNRESOLVED: CAUSAL COUPLING · STOP`
      };
      calibrationRoot.addEventListener("click",event=>{
        const button=event.target.closest("[data-pa231-view]");
        if(!button)return;
        buttons.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
        calibrationRoot.dataset.view=button.dataset.pa231View;
        output.textContent=copy[button.dataset.pa231View];
      });
      output.textContent=copy.nuclear;
    }
    if(broSisRoot){
      const output=broSisRoot.querySelector("[data-bro-sis-output]");
      const buttons=[...broSisRoot.querySelectorAll("[data-bro-sis-view]")];
      const addresses=cut=>cut.map(row=>`${row.symbol}/Z${row.z}`).join(" → ");
      const copy={
        bro:`INSIDE A · ${addresses(broSis.cuts.bro)} · exact register addresses`,
        sis:`INSIDE B · ${addresses(broSis.cuts.sis)} · repeated S positions retained`,
        return:`${broSis.result} · I: CARRIER/T/R · L: LOCAL READING · A: TOKEN ORDER · U: O↔0 / Th↔θ / COUPLING · STOP`
      };
      broSisRoot.addEventListener("click",event=>{
        const button=event.target.closest("[data-bro-sis-view]");
        if(!button)return;
        buttons.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
        broSisRoot.dataset.view=button.dataset.broSisView;
        output.textContent=copy[button.dataset.broSisView];
      });
      output.textContent=copy.bro;
    }
    if(ioiRoot){
      const output=ioiRoot.querySelector("[data-ioi-output]");
      const buttons=[...ioiRoot.querySelectorAll("[data-ioi-view]")];
      const copy={
        fold:`FOLD · Rh/Z45 + Ba/Z56 = ${ioi.diagonalSums.a} · Pd/Z46 + Cs/Z55 = ${ioi.diagonalSums.b} · TWO PATHS / ONE VALUE`,
        counter:`COUNTER-AXIS · L/R ${ioi.counterAxis.left}/${ioi.counterAxis.right} = 101 ${ioi.offsets.left}/${ioi.offsets.right} · U/D ${ioi.counterAxis.top}/${ioi.counterAxis.bottom} = 101 ${ioi.offsets.top}/${ioi.offsets.bottom} · SIDE-BITS RETAINED`,
        return:`${ioi.result} · I: ADDRESSES/101/AXIS · L: PATH WITHOUT SIDE-BIT · A: Q°/I0I NOTATION · U: MECHANISM/COUPLING/ZERO · STOP`
      };
      ioiRoot.addEventListener("click",event=>{
        const button=event.target.closest("[data-ioi-view]");
        if(!button)return;
        buttons.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
        ioiRoot.dataset.view=button.dataset.ioiView;
        output.textContent=copy[button.dataset.ioiView];
      });
      output.textContent=copy.fold;
    }
    render();
  }

  return {VIEW_LABELS,carrierRows,boundaryControl,periodicPosition,cubePosition,cyclicPosition,modernNeighbors,cycleNeighbors,cubeNeighbors,neighbors,ledger,pa231SevenfoldCalibration,broSisRelationTest,ioiQ0CounterAxisTest,validate,mount};
});
