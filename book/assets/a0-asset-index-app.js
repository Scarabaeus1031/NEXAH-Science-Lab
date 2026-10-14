(() => {
  const contextBack = document.querySelector("[data-context-back]");
  contextBack?.addEventListener("click", (event) => {
    if (!document.referrer || history.length <= 1) return;
    event.preventDefault();
    history.back();
  });

  const data = window.A0_ASSET_INDEX;
  if (!data) {
    document.querySelector("#load-state").textContent = "Asset-Datensatz konnte nicht geladen werden.";
    return;
  }

  const htmlFiles = data.files.filter((item) => item.extension === ".html" && item.path !== "A0_ASSET_INDEX.html");
  const entries = [
    ["A0_NEXAH_APERTURE_JOURNEY.html#instrument", "A1 Human · Album 09", "A0_NEXAH_APERTURE_JOURNEY.html", "Aperture Journey", "9 Apertures als Rundgang durch bestehende NEXAH Module."],
    ["A0_SCIENCE.html", "Orientierung"],
    ["index.html", "Buch"],
    ["A0_RESEARCH_DESK.html", "Steuerung"],
    ["A0_FAMILY_CONNECTION_ATLAS.html", "Verbindungen"],
    ["A0_TESSAREC_BLUE_BODY_LAB.html", "Instrument"],
    ["A0_RESEARCH_BACKLOG.html", "Backlog"]
  ];
  const flagshipGroups = [
    {
      id: "entry",
      label: "Entry & Orientation",
      description: "Drei gebündelte Einstiege für Human, Science und Builder.",
      paths: ["A0_NEXAH_APERTURE_JOURNEY.html", "A0_SCIENCE.html", "A0_BUILDER_TOY_STORE.html"]
    },
    {
      id: "maps",
      label: "Maps & Synchronized Views",
      description: "Methode, Felder und gekoppelte Leselinsen.",
      paths: ["A0_NEXAH_RESEARCH_METHOD.html", "A0_FIELDS_AND_JOINTS_ATLAS.html", "A0_FAMILY_CONNECTION_ATLAS.html"]
    },
    {
      id: "labs",
      label: "Labs & Demonstrators",
      description: "Prüfbare Instrumente für Joints, Carrier, Hüllen und Übergänge.",
      paths: ["A0_JOINT_APPLICATION_DEMONSTRATOR.html", "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html", "A0_TESSAREC_BLUE_BODY_LAB.html", "A0_GAME_4_LIFE_PLUS_1.html"]
    }
  ];
  const flagshipLabels = {
    "A0_NEXAH_APERTURE_JOURNEY.html": "A1 Human",
    "A0_SCIENCE.html": "A0 Science",
    "A0_BUILDER_TOY_STORE.html": "B1 Builder",
    "A0_NEXAH_RESEARCH_METHOD.html": "Method",
    "A0_FIELDS_AND_JOINTS_ATLAS.html": "Domain Map",
    "A0_FAMILY_CONNECTION_ATLAS.html": "Synchronized View",
    "A0_JOINT_APPLICATION_DEMONSTRATOR.html": "Return Protocol",
    "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html": "Operator Joint",
    "A0_TESSAREC_BLUE_BODY_LAB.html": "State Field",
    "A0_GAME_4_LIFE_PLUS_1.html": "LIFE"
  };
  const byPath = new Map(data.files.map((item) => [item.path, item]));
  const external = data.external_instruments || [];
  const familyColors = {
    "A0 Foundation": "#20d4ff", "Science Control": "#ffd13d", "Mathfield": "#6ce3bd",
    "Pascal / Pentagon": "#ff9d3d", "LIFE": "#8bd450", "Tessarec / Blue Body": "#6f8cff",
    "External Instruments": "#f3a84b", "Papers & Review": "#ff5aa5", "Fields & Joints": "#c78cff", "Evidence & Results": "#ff6a63",
    "Runtime & Source": "#8da6ad", "Visual & 3D Assets": "#49d6c8", "Repository Records": "#c1a77c"
  };
  const state = { query: "", family: "all", role: "all", work: "all", format: "all", limit: data.files.length };
  const cards = document.querySelector("#html-cards");
  const inventory = document.querySelector("#inventory");
  const empty = document.querySelector("#empty-state");
  const more = document.querySelector("#show-more");

  const escapeHtml = (value = "") => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const formatBytes = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
  const familySlug = (family) => family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const searchable = (item) => [item.path, item.title, item.headline, item.description, item.family, item.work, item.role, item.format].join(" ").toLowerCase();
  const matches = (item) => {
    if (state.query && !searchable(item).includes(state.query)) return false;
    if (state.family !== "all" && item.family !== state.family) return false;
    if (state.role !== "all" && item.role !== state.role) return false;
    if (state.work !== "all" && item.work !== state.work) return false;
    if (state.format !== "all" && item.format !== state.format) return false;
    return true;
  };

  document.querySelector("#entry-grid").innerHTML = entries.map(([path, kind, sourcePath = path, title, description]) => {
    const item = byPath.get(sourcePath);
    return `<a class="entry" href="${path}"><b>${kind}</b><div><h3>${escapeHtml(title || item?.headline || item?.title || path)}</h3><p>${escapeHtml(description || item?.description || "A0 Workspace Entry")}</p></div><em>Öffnen →</em></a>`;
  }).join("");

  document.querySelector("#stats").innerHTML = [
    [data.counts.files, "indexierte Dateien"],
    [data.counts.album_apertures, "Album-Apertures"],
    [data.counts.html - 1, "weitere HTML-Flächen"],
    [data.counts.registered_surfaces, "registrierte A0-Flächen"],
    [data.counts.families, "Families"],
    [data.counts.formats, "Dateiformate"]
  ].map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");

  const populate = (selector, values) => {
    const select = document.querySelector(selector);
    [...new Set(values)].sort().forEach((value) => select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
  };
  populate("#family-filter", data.family_order);
  populate("#role-filter", data.files.map((item) => item.role));
  populate("#work-filter", data.files.map((item) => item.work));
  populate("#format-filter", data.files.map((item) => item.format));

  const familyCounts = Object.fromEntries(data.family_order.map((family) => [family, data.files.filter((item) => item.family === family).length + external.filter((item) => item.family === family).length]));
  const familyMap = document.querySelector("#family-map");
  const center = { x: 380, y: 310 };
  familyMap.innerHTML = `
    <defs><radialGradient id="coreGlow"><stop offset="0" stop-color="#20d4ff" stop-opacity=".35"/><stop offset="1" stop-color="#20d4ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${center.x}" cy="${center.y}" r="128" fill="url(#coreGlow)"/>
    <circle cx="${center.x}" cy="${center.y}" r="66" class="family-core"/>
    <text x="${center.x}" y="${center.y - 4}" class="family-core__title">A0</text>
    <text x="${center.x}" y="${center.y + 21}" class="family-core__sub">WORKSPACE</text>
  ` + data.family_order.map((family, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / data.family_order.length;
    const orbit = index % 2 ? 236 : 254;
    const x = center.x + Math.cos(angle) * orbit;
    const y = center.y + Math.sin(angle) * orbit;
    const count = familyCounts[family];
    const radius = 24 + Math.min(20, Math.sqrt(count) * 2.2);
    const label = family.replace(" / ", " · ");
    return `<g class="family-node" data-family="${escapeHtml(family)}" tabindex="0" role="button" aria-label="${escapeHtml(family)}, ${count} Assets">
      <line x1="${center.x}" y1="${center.y}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${familyColors[family]}"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${familyColors[family]}"/>
      <text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" class="family-node__count">${count}</text>
      <text x="${x.toFixed(1)}" y="${(y + radius + 16).toFixed(1)}" class="family-node__label">${escapeHtml(label)}</text>
    </g>`;
  }).join("");

  const selectFamily = (family) => {
    state.family = family;
    document.querySelector("#family-filter").value = family;
    document.querySelectorAll(".family-node, .family-legend button").forEach((node) => node.classList.toggle("is-active", node.dataset.family === family));
    render();
  };
  document.querySelector("#family-legend").innerHTML = `<button type="button" data-family="all"><i></i><span>Alle Families</span><b>${data.files.length + external.length}</b></button>` + data.family_order.map((family) => `<button type="button" data-family="${escapeHtml(family)}" style="--swatch:${familyColors[family]}"><i></i><span>${escapeHtml(family)}</span><b>${familyCounts[family]}</b></button>`).join("");
  document.querySelectorAll(".family-node").forEach((node) => {
    node.addEventListener("click", () => selectFamily(node.dataset.family));
    node.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); selectFamily(node.dataset.family); } });
  });
  document.querySelectorAll(".family-legend button").forEach((button) => button.addEventListener("click", () => selectFamily(button.dataset.family)));

  const flagshipMarkup = (item, index, groupLabel) => `<article class="flagship family--${familySlug(item.family)}" data-path="${escapeHtml(item.path)}">
    <div class="flagship__preview preview">
      <div class="preview__fallback"><strong>${escapeHtml(item.headline || item.title)}</strong></div>
      <iframe data-src="${encodeURI(item.path)}" title="Flagship-Vorschau: ${escapeHtml(item.title)}" loading="lazy" sandbox="allow-same-origin" tabindex="-1"></iframe>
      <span class="flagship__number">${String(index + 1).padStart(2, "0")}</span>
    </div>
    <div class="flagship__body">
      <div class="family-tag">${escapeHtml(groupLabel)} · ${escapeHtml(flagshipLabels[item.path] || item.family)}</div>
      <h3>${escapeHtml(item.headline || item.title)}</h3>
      <p>${escapeHtml(item.description || "Kuratierte A0 Arbeitsfläche")}</p>
      <a class="asset-card__open" href="${encodeURI(item.path)}">Öffnen →</a>
    </div>
  </article>`;
  let flagshipIndex = 0;
  document.querySelector("#flagship-grid").innerHTML = flagshipGroups.map((group) => {
    const groupCards = group.paths.map((path) => {
      const item = byPath.get(path);
      if (!item) return "";
      const card = flagshipMarkup(item, flagshipIndex, group.label);
      flagshipIndex += 1;
      return card;
    }).join("");
    return `<section class="flagship-group" data-flagship-group="${escapeHtml(group.id)}">
      <header class="flagship-group__head"><div><span>${String(group.paths.length).padStart(2, "0")} FLAGSHIPS</span><h3>${escapeHtml(group.label)}</h3></div><p>${escapeHtml(group.description)}</p></header>
      <div class="flagship-group__grid">${groupCards}</div>
    </section>`;
  }).join("");

  const markerSvg = (marker) => {
    const motifs = {
      polyhedron: '<polygon points="60,13 104,38 96,91 60,112 22,88 16,39"/><path d="M60 13L60 112M16 39L96 91M104 38L22 88"/>',
      orbit: '<circle cx="60" cy="62" r="45"/><circle cx="60" cy="62" r="24"/><path d="M15 62C31 22 87 20 105 62C85 104 34 104 15 62Z"/>',
      word: '<path d="M12 76L34 42L57 76L80 42L108 76"/><circle cx="12" cy="76" r="5"/><circle cx="34" cy="42" r="5"/><circle cx="57" cy="76" r="5"/><circle cx="80" cy="42" r="5"/><circle cx="108" cy="76" r="5"/>',
      shell: '<ellipse cx="60" cy="96" rx="45" ry="13"/><ellipse cx="60" cy="73" rx="35" ry="11"/><ellipse cx="60" cy="51" rx="24" ry="9"/><path d="M60 103C22 76 99 64 60 42C31 26 73 14 60 8"/>',
      triple: '<circle cx="60" cy="62" r="12"/><path d="M60 62L60 12M60 62L103 87M60 62L17 87"/><circle cx="60" cy="12" r="9"/><circle cx="103" cy="87" r="9"/><circle cx="17" cy="87" r="9"/>',
      factor: '<path d="M13 89H107M22 80V58H42V46H62V34H82V22H102"/><text x="60" y="110">101</text>'
    };
    return `<svg viewBox="0 0 120 120" aria-hidden="true">${motifs[marker] || motifs.orbit}</svg>`;
  };
  document.querySelector("#external-grid").innerHTML = external.map((item) => `<article class="external-card" data-external-id="${escapeHtml(item.entity_id)}">
    <div class="external-marker external-marker--${escapeHtml(item.marker)}">${markerSvg(item.marker)}</div>
    <div class="external-card__body"><div class="family-tag">${escapeHtml(item.work)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><code>${escapeHtml(item.entity_id)}</code><a class="asset-card__open" href="${encodeURI(item.href)}">Im Quellinstrument öffnen →</a></div>
  </article>`).join("");

  cards.innerHTML = htmlFiles.map((item) => `<article class="asset-card family--${familySlug(item.family)}" data-path="${escapeHtml(item.path)}">
    <div class="preview">
      <div class="preview__fallback"><strong>${escapeHtml(item.headline || item.title)}</strong></div>
      <iframe data-src="${encodeURI(item.path)}" title="Vorschau: ${escapeHtml(item.title)}" loading="lazy" sandbox="allow-same-origin" tabindex="-1"></iframe>
    </div>
    <div class="asset-card__body">
      <div class="family-tag">${escapeHtml(item.family)}</div>
      <div class="card__meta"><span>${escapeHtml(item.work)}</span><span class="role">${escapeHtml(item.role)}</span></div>
      <h3>${escapeHtml(item.headline || item.title)}</h3>
      <p>${escapeHtml(item.description || "Interne A0 HTML-Fläche")}</p>
      <a class="asset-card__open" href="${encodeURI(item.path)}">Seite öffnen →</a>
    </div>
  </article>`).join("");

  inventory.innerHTML = data.family_order.map((family) => {
    const familyFiles = data.files.filter((item) => item.family === family);
    if (!familyFiles.length) return "";
    const rows = familyFiles.map((item) => `<a class="inventory-row" href="${encodeURI(item.path)}" data-path="${escapeHtml(item.path)}">
      <span class="inventory-row__format">${escapeHtml(item.format)}</span>
      <span class="inventory-row__path" title="${escapeHtml(item.path)}">${escapeHtml(item.path)}</span>
      <span class="inventory-row__work">${escapeHtml(item.work)}</span>
      <span class="inventory-row__role">${escapeHtml(item.role)}</span>
      <span class="inventory-row__size">${formatBytes(item.bytes)}</span>
    </a>`).join("");
    return `<section class="family-block family--${familySlug(family)}" data-family="${escapeHtml(family)}"><header class="family-head"><span>${escapeHtml(family)}</span><b>${familyFiles.length}</b></header>${rows}</section>`;
  }).join("");

  const observer = new IntersectionObserver((observations) => observations.forEach((observation) => {
    if (!observation.isIntersecting) return;
    const frame = observation.target.querySelector("iframe[data-src]");
    if (frame) {
      frame.src = frame.dataset.src;
      frame.removeAttribute("data-src");
    }
    observer.unobserve(observation.target);
  }), { rootMargin: "500px 0px" });
  document.querySelectorAll(".preview").forEach((preview) => observer.observe(preview));

  const render = () => {
    document.querySelectorAll(".flagship").forEach((node) => {
      const item = byPath.get(node.dataset.path);
      node.hidden = !matches(item);
    });
    document.querySelectorAll(".flagship-group").forEach((group) => {
      group.hidden = !group.querySelector(".flagship:not([hidden])");
    });
    document.querySelectorAll(".external-card").forEach((node) => {
      const item = external.find((candidate) => candidate.entity_id === node.dataset.externalId);
      node.hidden = !matches(item);
    });
    let visibleCards = 0;
    document.querySelectorAll(".asset-card").forEach((node) => {
      const item = byPath.get(node.dataset.path);
      node.hidden = !matches(item);
      if (!node.hidden) visibleCards += 1;
    });
    let visibleRows = 0;
    let matchedRows = 0;
    document.querySelectorAll(".inventory-row").forEach((node) => {
      const item = byPath.get(node.dataset.path);
      const match = matches(item);
      if (match) matchedRows += 1;
      node.hidden = !match || visibleRows >= state.limit;
      if (!node.hidden) visibleRows += 1;
    });
    document.querySelectorAll(".family-block").forEach((block) => {
      block.hidden = !block.querySelector(".inventory-row:not([hidden])");
    });
    document.querySelector("#result-count").textContent = `${matchedRows} von ${data.files.length} Dateien · ${visibleCards} HTML-Vorschauen`;
    empty.dataset.visible = String(matchedRows === 0);
    more.hidden = matchedRows <= state.limit;
  };

  document.querySelector("#search").addEventListener("input", (event) => { state.query = event.target.value.trim().toLowerCase(); state.limit = data.files.length; render(); });
  [["#family-filter", "family"], ["#role-filter", "role"], ["#work-filter", "work"], ["#format-filter", "format"]].forEach(([selector, key]) => {
    document.querySelector(selector).addEventListener("change", (event) => {
      state[key] = event.target.value;
      state.limit = data.files.length;
      if (key === "family") document.querySelectorAll(".family-node, .family-legend button").forEach((node) => node.classList.toggle("is-active", node.dataset.family === state.family));
      render();
    });
  });
  more.addEventListener("click", () => { state.limit += 150; render(); });
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    document.body.dataset.view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
  }));
  document.querySelector("#load-state").remove();
  render();
})();

