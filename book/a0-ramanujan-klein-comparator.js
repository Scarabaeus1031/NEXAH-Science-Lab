(function(){
  "use strict";

  function factorial(n){
    let value=1;
    for(let i=2;i<=n;i+=1)value*=i;
    return value;
  }

  function ramanujanPi(termCount){
    let sum=0;
    for(let k=0;k<termCount;k+=1){
      sum+=(factorial(4*k)*(1103+26390*k))/(Math.pow(factorial(k),4)*Math.pow(396,4*k));
    }
    return 1/((2*Math.sqrt(2)/9801)*sum);
  }

  function gridState(size,mode,orientation){
    const n=Math.max(2,Math.min(1000,Math.round(Number(size)||100)));
    const raw=n*n;
    const edge=n-1;
    const state=mode==="one"?"one":mode==="two"?"two":"open";
    const reversed=orientation==="reversed";
    if(state==="one")return{n,mode:state,raw,vertices:n*edge,boundary:2*edge,duplicates:n,topology:reversed?"MÖBIUS STRIP":"CYLINDER"};
    if(state==="two")return{n,mode:state,raw,vertices:edge*edge,boundary:0,duplicates:2*n-1,topology:reversed?"KLEIN-TYPE QUOTIENT":"TORUS"};
    return{n,mode:"open",raw,vertices:raw,boundary:4*edge,duplicates:0,topology:"OPEN SHEET"};
  }

  function mount(root){
    const mesh=root.querySelector("[data-nkc-mesh]");
    const modeButtons=Array.from(root.querySelectorAll("[data-nkc-mode]"));
    const termRange=root.querySelector("[data-nkc-terms]");
    const termLabel=root.querySelector("[data-nkc-term-label]");
    const piOutput=root.querySelector("[data-nkc-pi]");
    const errorOutput=root.querySelector("[data-nkc-error]");
    const vertexOutput=root.querySelector("[data-nkc-vertices]");
    const boundaryOutput=root.querySelector("[data-nkc-boundary]");
    const duplicateOutput=root.querySelector("[data-nkc-duplicates]");
    const topologyOutput=root.querySelector("[data-nkc-topology]");
    const sizeRange=root.querySelector("[data-nkc-size]");
    const sizeLabel=root.querySelector("[data-nkc-size-label]");
    const sizePresets=Array.from(root.querySelectorAll("[data-nkc-size-preset]"));
    const orientationButtons=Array.from(root.querySelectorAll("[data-nkc-orientation]"));
    const rawFormula=root.querySelector("[data-nkc-raw-formula]");
    const boundaryFormula=root.querySelector("[data-nkc-boundary-formula]");
    const quotientFormula=root.querySelector("[data-nkc-quotient-formula]");
    const returnCopy=root.querySelector("[data-nkc-return-copy]");
    let currentMode="open";
    let currentOrientation="direct";

    if(mesh&&!mesh.children.length){
      for(let i=0;i<100;i+=1)mesh.appendChild(document.createElement("i"));
    }

    function renderGrid(){
      const state=gridState(sizeRange?.value||100,currentMode,currentOrientation);
      if(mesh){
        mesh.dataset.mode=state.mode;
        mesh.dataset.orientation=currentOrientation;
        mesh.setAttribute("aria-label",`Schematische zehn-mal-zehn-Anzeige für den ${state.n}-mal-${state.n}-Quotienten im Zustand ${state.mode}`);
      }
      modeButtons.forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.nkcMode===state.mode)));
      orientationButtons.forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.nkcOrientation===currentOrientation)));
      if(sizeLabel)sizeLabel.textContent=String(state.n);
      if(vertexOutput)vertexOutput.textContent=String(state.vertices);
      if(boundaryOutput)boundaryOutput.textContent=String(state.boundary);
      if(duplicateOutput)duplicateOutput.textContent=state.mode==="open"?`${2*state.n-1} pending`:`${state.duplicates} merged`;
      if(topologyOutput)topologyOutput.textContent=state.topology;
      if(rawFormula)rawFormula.textContent=`${state.n}² = ${state.raw} raw vertices`;
      if(boundaryFormula)boundaryFormula.textContent=`4·(${state.n}−1) = ${4*(state.n-1)} open boundary edges`;
      if(quotientFormula)quotientFormula.textContent=state.mode==="open"?`${state.raw} · quotient not applied`:state.mode==="one"?`${state.raw}−${state.n} = ${state.vertices} = ${state.n}·${state.n-1}`:`${state.raw}−${2*state.n-1} = ${state.vertices} = ${state.n-1}²`;
      if(returnCopy)returnCopy.innerHTML=state.mode==="open"?`Das Blatt ist offen. <code>${2*state.n-1}</code> mögliche Nahtkopien bleiben getrennt.`:state.mode==="one"?`Eine Randpaarung verschmilzt <code>${state.n}</code> Kopien. Direkte und umgekehrte Klebung haben denselben Count, aber verschiedene Orientierung.`:`Beide Randpaare verschmelzen <code>${2*state.n-1}</code> Kopien: <code>${state.raw}−${2*state.n-1}=${state.vertices}=(${state.n}−1)²</code>. Der Count allein unterscheidet Torus und Klein-Typ nicht.`;
    }

    function setMode(mode){
      currentMode=mode;
      renderGrid();
    }

    function setOrientation(orientation){
      currentOrientation=orientation==="reversed"?"reversed":"direct";
      renderGrid();
    }

    function setTerms(){
      const terms=Math.max(1,Math.min(3,Number(termRange?.value||1)));
      const approximation=ramanujanPi(terms);
      if(termLabel)termLabel.textContent=String(terms);
      if(piOutput)piOutput.textContent=approximation.toPrecision(16);
      if(errorOutput)errorOutput.textContent=Math.abs(Math.PI-approximation).toExponential(3);
    }

    modeButtons.forEach((button)=>button.addEventListener("click",()=>setMode(button.dataset.nkcMode)));
    orientationButtons.forEach((button)=>button.addEventListener("click",()=>setOrientation(button.dataset.nkcOrientation)));
    sizeRange?.addEventListener("input",renderGrid);
    sizePresets.forEach((button)=>button.addEventListener("click",()=>{if(sizeRange)sizeRange.value=button.dataset.nkcSizePreset;renderGrid();}));
    termRange?.addEventListener("input",setTerms);
    setMode("open");
    setTerms();
  }

  window.NEXAH_RK_COMPARATOR=Object.freeze({gridState});
  document.querySelectorAll("[data-ramanujan-klein-comparator]").forEach(mount);
})();
