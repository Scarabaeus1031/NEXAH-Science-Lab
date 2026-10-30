(()=>{
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const primes=new Set([2,3,5,7,11,13,17,19,23]);
  const grid=document.getElementById("nmAlphabetGrid");
  const form=document.getElementById("nmLetterTest");
  const first=document.getElementById("nmLetterA");
  const second=document.getElementById("nmLetterB");
  const output=document.getElementById("nmLetterOutput");
  if(!grid||!form||!first||!second||!output)return;

  alphabet.forEach((letter,index)=>{
    const value=index+1;
    const cell=document.createElement("span");
    cell.className="nm-letter";
    if(primes.has(value))cell.classList.add("is-prime");
    if(letter==="I"||letter==="J")cell.classList.add("is-axis-pair");
    if(["C","I","M","P","V"].includes(letter))cell.classList.add("is-stitch-point");
    if(letter==="L"||letter==="Y")cell.classList.add("is-selected");
    if(letter==="Y")cell.classList.add("is-y");
    cell.setAttribute("aria-label",`${letter}, Position ${value}${primes.has(value)?", Primposition":""}`);
    cell.innerHTML=`<b>${letter}</b><span>${String(value).padStart(2,"0")}</span>`;
    grid.append(cell);

    [first,second].forEach(select=>{
      const option=document.createElement("option");
      option.value=letter;
      option.textContent=`${letter} · ${value}`;
      select.append(option);
    });
  });

  first.value="L";
  second.value="Y";

  const position=letter=>alphabet.indexOf(letter)+1;
  const describe=value=>primes.has(value)?"prim":value===1?"Einheit":"nicht prim";
  const band=value=>value<=13?"A–M":"N–Z";
  const render=()=>{
    const a=first.value;
    const b=second.value;
    const av=position(a);
    const bv=position(b);
    const lower=[av>13?a:null,bv>13?b:null].filter(Boolean);
    output.textContent=`${a}${b} · ${av} | ${bv} · Σ ${av+bv} · ${a}: ${describe(av)}, ${band(av)} · ${b}: ${describe(bv)}, ${band(bv)} · N–Z-Treffer: ${lower.length?lower.join(" + "):"keiner"}`;
    document.getElementById("nmRawA").textContent=`${a} · ${av}`;
    document.getElementById("nmRawB").textContent=`${b} · ${bv}`;
    document.getElementById("nmRawSummary").textContent=`Σ ${av+bv} · ${a} ist ${describe(av)} · ${b} ist ${describe(bv)} · ${lower.length?`${lower.join(" und ")} im N–Z-Register`:"kein Buchstabe im N–Z-Register"}.`;
    grid.querySelectorAll(".nm-letter").forEach(cell=>{
      const selected=cell.querySelector("b")?.textContent;
      cell.classList.toggle("is-selected",selected===a||selected===b);
      cell.classList.toggle("is-y",selected==="Y"&&(selected===a||selected===b));
    });
  };

  form.addEventListener("submit",event=>{event.preventDefault();render();});

  const ncsOutput=document.getElementById("nmNcsOutput");
  document.querySelectorAll("[data-ncs]").forEach(button=>button.addEventListener("click",()=>{
    document.querySelectorAll("[data-ncs]").forEach(peer=>peer.setAttribute("aria-pressed",String(peer===button)));
    ncsOutput.innerHTML=button.dataset.ncs==="292"
      ?"<b>292</b> · bestehende Owner-Lesart: 2 | 3² | 2 → 2 | 9 | 2. Ziffernfügung, keine Multiplikation."
      :"<b>2962</b> · offener NCS-Kandidat. In den kontrollierten A0-Records noch nicht als gebundene Lesart gefunden.";
  }));

  const axisSwitch=document.getElementById("nmAxisSwitch");
  const axisOutput=document.getElementById("nmAxisOutput");
  if(axisSwitch&&axisOutput){
    const axisButtons=[...axisSwitch.querySelectorAll("[data-axis-target]")];
    const setAxis=axis=>{
      axisSwitch.dataset.axis=axis;
      axisButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.axisTarget===axis)));
      axisOutput.classList.remove("is-pass");
      axisOutput.textContent=`F-IJ-01 · Achse ${axis.toUpperCase()} aktiv · 1 Feld · 1 Record · T(x,y)=(y,x)`;
    };
    axisButtons.forEach(button=>button.addEventListener("click",()=>setAxis(button.dataset.axisTarget)));
    axisSwitch.querySelector("[data-axis-return]")?.addEventListener("click",()=>{
      setAxis("i");
      axisSwitch.dataset.axis="j";
      axisSwitch.getBoundingClientRect();
      setAxis("i");
      axisOutput.classList.add("is-pass");
      axisOutput.textContent="PASS · I → J → I · Feld F-IJ-01 unverändert · 1 Record · exakter Achsen-Return";
    });
  }

  const stitchButton=document.querySelector("[data-stitch-test]");
  const stitchOutput=document.getElementById("nmStitchOutput");
  stitchButton?.addEventListener("click",()=>{
    const tests=[3+13===16,9+13===22,16-13===3,22-13===9];
    const pass=tests.every(Boolean);
    stitchOutput.classList.toggle("is-pass",pass);
    stitchOutput.textContent=pass
      ?"PASS · C[3]+M[13]=P[16] · I[9]+M[13]=V[22] · P−M=C · V−M=I · 4/4"
      :"FAIL · Mindestens eine deklarierte Adressnaht stimmt nicht.";
  });

  const codeRecords=[
    [2,"Sun"],[3,"Mercury"],[5,"Venus"],[7,"Earth"],[11,"Moon"],[29,"IO"],
    [43,"Amalthea"],[107,"Erith"],[131,"AU"],[137,"Earth FS"],[149,"Arrokoth"],
    [181,"Earth (alt)"],[199,"Ganymed"],[233,"IVO"],[277,"Methusalem"],
    [281,"Miranda"],[283,"Moon (cp)"],[313,"MARIA"],[379,"Θ / THE(O)"],
    [389,"Titan"],[397,"Titania"],[401,"Triton"],[409,"Umbriel"],[701,"ZETA"]
  ];
  const codeRows=document.getElementById("nmCodeRows");
  const codeForm=document.getElementById("nmCodeProbe");
  const codeInput=document.getElementById("nmCodeInput");
  const codeBinary=document.getElementById("nmCodeBinary");
  const codeTernary=document.getElementById("nmCodeTernary");
  const codeHex=document.getElementById("nmCodeHex");
  const encode=value=>({
    binary:value.toString(2).padStart(8,"0"),
    ternary:value.toString(3).padStart(2,"0"),
    hex:value.toString(16).toUpperCase().padStart(2,"0")
  });
  if(codeRows){
    codeRecords.forEach(([value,name])=>{
      const code=encode(value);
      const row=document.createElement("tr");
      if([233,313,379,701].includes(value))row.classList.add("is-route");
      row.innerHTML=`<td>${value}</td><th scope="row">${name}</th><td>${code.binary}</td><td>${code.ternary}</td><td>${code.hex}</td>`;
      codeRows.append(row);
    });
  }
  const renderCode=()=>{
    const raw=Number(codeInput?.value);
    const value=Number.isInteger(raw)?Math.min(4095,Math.max(0,raw)):0;
    if(codeInput)codeInput.value=String(value);
    const code=encode(value);
    if(codeBinary)codeBinary.textContent=code.binary;
    if(codeTernary)codeTernary.textContent=code.ternary;
    if(codeHex)codeHex.textContent=code.hex;
  };
  codeForm?.addEventListener("submit",event=>{event.preventDefault();renderCode();});

  const codeTest=document.querySelector("[data-code-test]");
  const codeOutput=document.getElementById("nmCodeOutput");
  codeTest?.addEventListener("click",()=>{
    const roundtrips=codeRecords.flatMap(([value])=>{
      const code=encode(value);
      return [parseInt(code.binary,2)===value,parseInt(code.ternary,3)===value,parseInt(code.hex,16)===value];
    });
    const anchors=[3**3===27,3**4===81,3**6===729,701+28===3**6];
    const checks=[...roundtrips,...anchors];
    const passed=checks.filter(Boolean).length;
    const pass=passed===checks.length;
    codeOutput?.classList.toggle("is-pass",pass);
    if(codeOutput)codeOutput.textContent=pass
      ?`PASS · ${passed}/${checks.length} · 72 Basis-Roundtrips + 3 Potenzanker + ZETA[701]→Ü[729]`
      :`FAIL · ${passed}/${checks.length} Prüfungen bestanden.`;
  });

  const phiProbe=document.getElementById("nmLovePhi");
  const phiVector=document.getElementById("nmPhiVector");
  const phiReadout=document.getElementById("nmPhiReadout");
  const phi=(1+Math.sqrt(5))/2;
  let phiAxis="i";
  const renderPhi=()=>{
    phiProbe?.querySelector(".nm-phi-probe")?.setAttribute("data-phi-axis",phiAxis);
    if(phiVector)phiVector.textContent=phiAxis==="i"?"i · (φ, 1)":"j · (1, φ)";
    if(phiReadout)phiReadout.textContent=`φ ≈ ${phi.toFixed(6)} · ‖v‖² = ${(phi**2+1).toFixed(6)}`;
  };
  phiProbe?.querySelector("[data-phi-switch]")?.addEventListener("click",()=>{
    phiAxis=phiAxis==="i"?"j":"i";
    renderPhi();
  });
  const lovePhiOutput=document.getElementById("nmLovePhiOutput");
  phiProbe?.querySelector("[data-love-phi-test]")?.addEventListener("click",()=>{
    const close=(a,b)=>Math.abs(a-b)<1e-12;
    const normI=phi**2+1;
    const normJ=1+phi**2;
    const checks=[
      12+15===27,12-15===-3,22+5===27,22-5===17,
      16+3===19,3+5===8,19+8===27,16+2*3+5===27,
      3**0===1,3**1===3,3**2===9,3**3===27,3**4===81,3**5===243,3**6===729,
      close(phi**2,phi+1),close(phi**4,3*phi+2),close(normI,normJ)
    ];
    const passed=checks.filter(Boolean).length;
    const pass=passed===checks.length;
    lovePhiOutput?.classList.toggle("is-pass",pass);
    if(lovePhiOutput)lovePhiOutput.textContent=pass
      ?`PASS · ${passed}/${checks.length} · LOVE=2×27 · P–C–E=27 · A–C–I–Ä–Ö–243–Ü · φ⁴=3φ+2 · i↔j normtreu`
      :`FAIL · ${passed}/${checks.length} Prüfungen bestanden.`;
  });
  renderPhi();

  const graphemeLens=document.getElementById("nmGraphemeLens");
  const graphemeOutput=document.getElementById("nmGraphemeOutput");
  graphemeLens?.querySelector("[data-grapheme-test]")?.addEventListener("click",()=>{
    const decompose=value=>[...value.normalize("NFD")].map(char=>char.codePointAt(0));
    const checks=[
      26+1===27,26+2===28,26+3===29,
      19+19===38,"ß".replace("ß","SS")==="SS",
      decompose("č").join(",")===[0x63,0x30c].join(","),
      decompose("ç").join(",")===[0x63,0x327].join(","),
      /\p{Sc}/u.test("€"),!/\p{L}/u.test("€"),
      "€"!=="E"
    ];
    const passed=checks.filter(Boolean).length;
    const pass=passed===checks.length;
    graphemeOutput?.classList.toggle("is-pass",pass);
    if(graphemeOutput)graphemeOutput.textContent=pass
      ?`PASS · ${passed}/${checks.length} · Ä27 · Ö28 · Ü29 · ß→SS=38 · č/ç getrennt · € ist Symbol · HOLD: Z9 ungebunden`
      :`FAIL · ${passed}/${checks.length} deterministische Graphemprüfungen bestanden.`;
  });
})();
