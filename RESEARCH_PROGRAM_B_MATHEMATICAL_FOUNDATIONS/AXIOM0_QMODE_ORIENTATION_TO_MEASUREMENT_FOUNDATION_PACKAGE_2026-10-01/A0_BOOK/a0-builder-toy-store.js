(() => {
  const lifeCanvas = document.querySelector("#builder-life-field");
  const lifeMachine = document.querySelector("#life-machine");
  const lifeCore = document.querySelector("#machine-core");
  const lifeToggle = document.querySelector("#life-toggle");
  const lifeState = document.querySelector("#machine-state");
  const domainButtons = [...document.querySelectorAll("[data-domain]")];
  const domainCards = [...document.querySelectorAll("[data-domain-card]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lifeContext = lifeCanvas?.getContext("2d");
  const lifeSize = 42;
  const domainColours = { human:"#f45ca9", science:"#38d5ee", builder:"#ffc84d" };
  let lifeGrid = new Uint8Array(lifeSize * lifeSize);
  let previousLifeGrid = new Uint8Array(lifeGrid.length);
  let lifeRunning = false;
  let activeDomain = "human";
  let lifeGeneration = 0;
  let lifeBirths = 0;
  let lifeDeaths = 0;
  let lastLifeStep = 0;

  const lifeCell = (x, y) => y * lifeSize + x;
  const seedLife = () => {
    lifeGrid.fill(0);
    [[8,8],[9,9],[7,10],[8,10],[9,10],[28,12],[29,12],[30,12],[27,13],[28,14],[30,14],[31,13],[14,28],[15,28],[16,28],[16,27],[15,26],[29,30],[30,30],[31,30],[29,31],[30,32]].forEach(([x,y]) => { lifeGrid[lifeCell(x,y)] = 1; });
    previousLifeGrid.set(lifeGrid);
    lifeGeneration = 0;
    lifeBirths = 0;
    lifeDeaths = 0;
  };

  const stepLife = () => {
    const next = new Uint8Array(lifeGrid.length);
    lifeBirths = 0;
    lifeDeaths = 0;
    for (let y = 0; y < lifeSize; y += 1) {
      for (let x = 0; x < lifeSize; x += 1) {
        let neighbours = 0;
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if ((!offsetX && !offsetY) || x + offsetX < 0 || x + offsetX >= lifeSize || y + offsetY < 0 || y + offsetY >= lifeSize) continue;
            neighbours += lifeGrid[lifeCell(x + offsetX, y + offsetY)];
          }
        }
        const position = lifeCell(x,y);
        next[position] = lifeGrid[position] ? Number(neighbours === 2 || neighbours === 3) : Number(neighbours === 3);
        if (!lifeGrid[position] && next[position]) lifeBirths += 1;
        if (lifeGrid[position] && !next[position]) lifeDeaths += 1;
      }
    }
    previousLifeGrid = lifeGrid;
    lifeGrid = next;
    lifeGeneration += 1;
    if (!lifeGrid.some(Boolean)) seedLife();
  };

  const drawLife = () => {
    if (!lifeContext || !lifeCanvas) return;
    const width = lifeCanvas.width;
    const height = lifeCanvas.height;
    const cellWidth = width / lifeSize;
    const cellHeight = height / lifeSize;
    lifeContext.clearRect(0,0,width,height);
    lifeContext.fillStyle = "rgba(3,13,20,.58)";
    lifeContext.fillRect(0,0,width,height);
    const colour = domainColours[activeDomain];
    lifeContext.shadowColor = colour;
    lifeContext.shadowBlur = activeDomain === "human" ? 10 : 5;
    for (let y = 0; y < lifeSize; y += 1) {
      for (let x = 0; x < lifeSize; x += 1) {
        const position = lifeCell(x,y);
        const alive = lifeGrid[position];
        const changed = alive !== previousLifeGrid[position];
        if (!alive && !(activeDomain === "builder" && changed)) continue;
        if (activeDomain === "science") {
          lifeContext.strokeStyle = alive ? colour : "transparent";
          lifeContext.globalAlpha = .8;
          lifeContext.strokeRect(x * cellWidth + 1,y * cellHeight + 1,Math.max(1,cellWidth - 2),Math.max(1,cellHeight - 2));
        } else {
          lifeContext.fillStyle = activeDomain === "builder" && changed ? "#ff8b58" : colour;
          lifeContext.globalAlpha = changed ? 1 : .72;
          const inset = activeDomain === "human" ? cellWidth * .14 : cellWidth * .22;
          lifeContext.fillRect(x * cellWidth + inset,y * cellHeight + inset,Math.max(1,cellWidth - inset * 2),Math.max(1,cellHeight - inset * 2));
        }
      }
    }
    lifeContext.globalAlpha = 1;
    lifeContext.shadowBlur = 0;
  };

  const resizeLife = () => {
    if (!lifeCanvas || !lifeContext) return;
    const size = Math.max(1, lifeCanvas.clientWidth);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    lifeCanvas.width = Math.round(size * ratio);
    lifeCanvas.height = Math.round(size * ratio);
    drawLife();
  };

  const updateLifeReadouts = () => {
    const population = lifeGrid.reduce((total, cell) => total + cell, 0);
    document.querySelector("#human-readout").textContent = `${population} visible cells`;
    document.querySelector("#science-readout").textContent = `${lifeBirths} born · ${lifeDeaths} return`;
    document.querySelector("#builder-readout").textContent = `generation ${lifeGeneration}`;
  };

  const setDomain = domain => {
    activeDomain = domain;
    lifeMachine.style.setProperty("--domain", domainColours[domain]);
    domainButtons.forEach(button => {
      const selected = button.dataset.domain === domain;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    domainCards.forEach(button => button.classList.toggle("active", button.dataset.domainCard === domain));
    drawLife();
  };

  const updateLifeControls = () => {
    lifeMachine.classList.toggle("running", lifeRunning);
    lifeCore.setAttribute("aria-pressed", String(lifeRunning));
    lifeToggle.setAttribute("aria-pressed", String(lifeRunning));
    lifeState.textContent = lifeRunning ? "ALIVE" : reducedMotion ? "STEP" : "TOUCH";
    lifeCore.querySelector("small").textContent = lifeRunning ? "PAUSE LIFE" : reducedMotion ? "STEP LIFE" : "START LIFE";
    lifeToggle.textContent = lifeRunning ? "Pause 3-domain" : reducedMotion ? "Step 3-domain" : "Start 3-domain";
  };

  const toggleLife = () => {
    if (reducedMotion) {
      stepLife();
      updateLifeReadouts();
      drawLife();
      return;
    }
    lifeRunning = !lifeRunning;
    updateLifeControls();
  };

  const animateLife = time => {
    if (lifeRunning && time - lastLifeStep > 210) {
      stepLife();
      updateLifeReadouts();
      drawLife();
      lastLifeStep = time;
    }
    window.requestAnimationFrame(animateLife);
  };

  if (lifeCanvas && lifeCore && lifeToggle) {
    seedLife();
    setDomain("human");
    updateLifeReadouts();
    updateLifeControls();
    resizeLife();
    window.addEventListener("resize", resizeLife);
    lifeCore.addEventListener("click", toggleLife);
    lifeToggle.addEventListener("click", toggleLife);
    domainButtons.forEach(button => button.addEventListener("click", () => { setDomain(button.dataset.domain); if (!lifeRunning && !reducedMotion) toggleLife(); }));
    domainCards.forEach(button => button.addEventListener("click", () => setDomain(button.dataset.domainCard)));
    window.requestAnimationFrame(animateLife);
  }

  const flagships = [
    { title:"Rainbow / Purple Rain", tag:"APPEARANCE · SPECTRUM", description:"Sieben Fenster zeigen, wie ein Spektrum nicht nur zerlegt, sondern als Bedingung von Erscheinung gelesen werden kann.", kind:"Experience", href:"A0_RAINBOW_PURPLE_RAIN.html", accent:"#f45ca9" },
    { title:"Black Sun / The Big Moon", tag:"FIELD · VISIBILITY", description:"Ein Feld, zwei beobachtbare Seiten und ein Sichtbarkeitsfenster zwischen Black Sun, Big Egg, NEON und Big Moon.", kind:"Experience", href:"A0_BLACK_SUN_BIG_MOON.html", accent:"#9c73ff" },
    { title:"Newton · Leibniz · Goethe", tag:"SOURCE · RELATION · APPEARANCE", description:"Drei Linsen halten Zerlegung, relationale Ordnung und Erscheinungsbedingung nebeneinander – ohne sie gleichzusetzen.", kind:"Observer lens", href:"A0_NEWTON_GOETHE_OBSERVER_LENS.html", accent:"#38d5ee" },
    { title:"The Living Interior", tag:"BODY · TRANSITION", description:"Die äußere Optik kippt nach innen: Zellen, Nachbarschaft, Relation und Game-of-Life-Übergang werden zu einem lebenden Korridor.", kind:"Experience", href:"A0_THE_LIVING_INTERIOR.html", accent:"#67e7b0" },
    { title:"GAME 4 LIFE +1", tag:"STATE · TRANSITION · RETURN", description:"Fünf synchronisierte Darstellungen desselben deterministischen Übergangs machen Zeit, Nachbarschaft und Rückweg vergleichbar.", kind:"Instrument", href:"A0_GAME_4_LIFE_PLUS_1.html", accent:"#ff8b58" },
    { title:"Pascal / Pentagon Joint", tag:"PHASE · QUOTIENT · JOINT", description:"Pascal-Träger, fünf Phasen und der Operator-Joint werden als prüfbares mathematisches Instrument zusammengesetzt.", kind:"Instrument", href:"A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html", accent:"#ffc84d" },
    { title:"Fields & Joints Atlas", tag:"DOMAIN · SEAM · RETURN", description:"Eine Karte berührter Felder zeigt Families, Rollen und Fugen – inklusive der Grenzen zwischen formaler und empirischer Gültigkeit.", kind:"Atlas", href:"A0_FIELDS_AND_JOINTS_ATLAS.html", accent:"#38d5ee" },
    { title:"Family Connection Atlas", tag:"MANY VIEWS · ONE RECORD", description:"Synchrone Ansichten, Families und bestehende Instrumente werden als klickbare Schichten mit sichtbaren Übergängen lesbar.", kind:"Atlas", href:"A0_FAMILY_CONNECTION_ATLAS.html", accent:"#67e7b0" },
    { title:"Tessarec / Blue Body Lab", tag:"FRAME · ENVELOPE · OBSERVER", description:"Ein dichtes Laborfenster für Träger, Hülle, Beobachter und die Grenzen des gegenwärtigen Tessarec-Entwurfs.", kind:"Lab", href:"A0_TESSAREC_BLUE_BODY_LAB.html", accent:"#708cff" },
    { title:"NEXAH Aperture Journey", tag:"LIFE · COSMOS · ORIENTATION", description:"Die menschliche Reise durch Frage, Bedeutung, Methode, Instrument und Return verbindet die Module zu einer lesbaren Einladung.", kind:"Journey", href:"A0_NEXAH_APERTURE_JOURNEY.html", accent:"#f45ca9" }
  ];

  const selector = document.querySelector("#flagship-selector");
  const stage = {
    visual: document.querySelector("#stage-visual"), title: document.querySelector("#stage-title"),
    tag: document.querySelector("#stage-tag"), description: document.querySelector("#stage-description"),
    kind: document.querySelector("#stage-kind"), index: document.querySelector("#stage-index"),
    link: document.querySelector("#stage-link"), number: document.querySelector(".stage-number")
  };
  let current = 0;
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;

  const showFlagship = (index, restart = true) => {
    current = (index + flagships.length) % flagships.length;
    const item = flagships[current];
    const display = String(current + 1).padStart(2, "0");
    stage.visual.style.setProperty("--accent", item.accent);
    stage.title.textContent = item.title;
    stage.tag.textContent = item.tag;
    stage.description.textContent = item.description;
    stage.kind.textContent = item.kind;
    stage.index.textContent = `${display} / ${flagships.length}`;
    stage.number.textContent = display;
    stage.link.href = item.href;
    stage.link.textContent = `Open ${item.kind} →`;
    selector.querySelectorAll("button").forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === current));
    if (restart) startTimer();
  };

  flagships.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.setProperty("--swatch", item.accent);
    button.innerHTML = `<span>${String(index + 1).padStart(2, "0")} · ${item.kind}</span><strong>${item.title}</strong>`;
    button.addEventListener("click", () => showFlagship(index));
    selector.append(button);
  });

  const startTimer = () => {
    clearInterval(timer);
    if (!paused) timer = setInterval(() => showFlagship(current + 1, false), 5200);
  };
  document.querySelector("#flagship-prev").addEventListener("click", () => showFlagship(current - 1));
  document.querySelector("#flagship-next").addEventListener("click", () => showFlagship(current + 1));
  const toggle = document.querySelector("#flagship-toggle");
  const updateToggle = () => { toggle.textContent = paused ? "Play auto" : "Pause auto"; toggle.setAttribute("aria-pressed", String(paused)); };
  toggle.addEventListener("click", () => { paused = !paused; updateToggle(); startTimer(); });
  updateToggle();
  showFlagship(0);

  const index = window.A0_ASSET_INDEX || { files:[], external_instruments:[] };
  const experiences = new Set([
    "A0_RAINBOW_PURPLE_RAIN.html", "A0_BLACK_SUN_BIG_MOON.html", "A0_NEON_TRAP_DOOR.html",
    "A0_NEWTON_GOETHE_OBSERVER_LENS.html", "A0_NEXAH_APERTURE_JOURNEY.html", "A0_THE_LIVING_INTERIOR.html"
  ]);
  const excluded = new Set(["A0_BUILDER_TOY_STORE.html"]);
  const localTools = (index.files || []).filter(item => item.extension === ".html" && !excluded.has(item.path)).map(item => ({
    ...item, href:item.path, source:"A0 local", type:experiences.has(item.path) ? "experience" : item.role
  }));
  const externalTools = (index.external_instruments || []).map(item => ({
    ...item, path:item.source_path, type:"external", source:"Source-bound"
  }));
  const allTools = [...localTools, ...externalTools];
  const palette = ["#38d5ee", "#f45ca9", "#ffc84d", "#67e7b0", "#9c73ff", "#ff8b58"];
  const grid = document.querySelector("#tool-grid");
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#tool-search");
  const filters = document.querySelector("#tool-filters");
  let activeFilter = "all";

  const safe = value => String(value || "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
  const render = () => {
    const query = search.value.trim().toLowerCase();
    const visible = allTools.filter(item => {
      const matchesFilter = activeFilter === "all" || item.type === activeFilter || (activeFilter === "instrument" && item.role === "instrument");
      const haystack = [item.title,item.headline,item.description,item.family,item.work,item.path,item.role,item.type].join(" ").toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });
    count.textContent = `${visible.length} of ${allTools.length} HTML doors`;
    grid.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p"); empty.className = "empty"; empty.textContent = "No door matches this cut. Change the filter or the words."; grid.append(empty); return;
    }
    visible.forEach((item, itemIndex) => {
      const card = document.createElement("a");
      card.className = "tool-card";
      card.href = item.href;
      card.style.setProperty("--accent", palette[itemIndex % palette.length]);
      card.innerHTML = `<div class="card-top"><span>${safe(item.type || item.role)}</span><span>${item.registered_surface ? "BOUND" : safe(item.source)}</span></div><h3>${safe(item.title || item.name)}</h3><p>${safe(item.description || item.headline || "Open the source-bound surface and inspect its current function.")}</p><div class="card-bottom"><span>${safe(item.family || item.work || "NEXAH")}</span><span class="open">open ↗</span></div>`;
      grid.append(card);
    });
  };
  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]"); if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
    render();
  });
  search.addEventListener("input", render);
  render();
})();
