(() => {
  const header = document.querySelector("header.top");
  const sourceNav = header?.querySelector("nav");
  if (!header || !sourceNav || header.dataset.a0Context === "ready") return;

  const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const assetIndexPath = "A0_ASSET_INDEX.html";
  const scienceDeskPath = "A0_RESEARCH_DESK.html";
  const humanEntryPath = "A0_NEXAH_APERTURE_JOURNEY.html#human-view";
  const builderEntryPath = "A0_BUILDER_TOY_STORE.html";
  const connectEntryPath = "NEXAH_C_CONNECT.html";
  const humanRouteFiles = new Set([
    "A0_NEXAH_APERTURE_JOURNEY.html",
    "A0_RAINBOW_PURPLE_RAIN.html",
    "A0_NEWTON_GOETHE_OBSERVER_LENS.html",
    "A0_NEON_TRAP_DOOR.html",
    "A0_BLACK_SUN_BIG_MOON.html",
    "A0_BLUE_PINK_DODECA_CELL_RETURN.html",
    "A0_THE_LIVING_INTERIOR.html"
  ]);
  const humanRouteActive = humanRouteFiles.has(file);
  const builderRouteActive = file === builderEntryPath;
  const works = [
    ["A0_NEXAH_APERTURE_JOURNEY.html", "NEXAH Aperture Journey · LIFE & COSMOS", "Experience"],
    ["A0_RAINBOW_PURPLE_RAIN.html", "Rainbow / Purple Rain · Seven Windows", "Experience"],
    ["A0_NEWTON_GOETHE_OBSERVER_LENS.html", "Newton / Leibniz / Goethe · Observer Lens", "Experience"],
    ["A0_THE_LIVING_INTERIOR.html", "The Living Interior · Inner Passage", "Experience"],
    [builderEntryPath, "Builder · Toy Store", "Build & inspect"],
    ["A0_MATHEMATICAL_JOINTS.html", "Mathfield · Mathematikwerkstatt", "Build & inspect"],
    ["A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html", "Pascal/Pentagon · Operator-Instrument", "Build & inspect"],
    ["A0_FAMILY_CONNECTION_ATLAS.html", "Family Atlas · synchrone Ansichten", "Build & inspect"],
    ["A0_GAME_4_LIFE_PLUS_1.html", "GAME 4 LIFE +1 · Übergänge", "Build & inspect"],
    ["A0_SCIENCE.html", "A0 Science · Orientierung", "Read & govern"],
    ["index.html", "A0 Book · Grundlagen", "Read & govern"]
  ];
  const papers = [
    ["A0_SCC_003_PASCAL_PENTAGON_PAPER.html", "Pascal-Fünfflächen-Quotient", "Enger mathematischer Claim", "Paper A · SCC-003"],
    ["A0_RETURN_WITHOUT_IDENTITY_PAPER.html", "Rückkehr ohne Identitätsbehauptung", "Source-bound Synthese", "Paper C · Return without identity"],
    ["A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html", "NEXAH Family Method", "Orientierungs- und Vergleichsverfahren", "Paper E · Method White Paper"],
    ["A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html", "Tessarec: Frame, Hülle und Beobachter", "Begrenzter Theorie- und Instrumentenentwurf", "Paper F · R0"]
  ];
  const researchRoutes = [
    ["A0_RESEARCH_DESK.html", "Science Desk", "Tests, Lücken und aktueller Arbeitsstand"],
    ["A0_LABORATORY.html", "Laboratory", "Zugelassene Runs und Resultate"],
    ["A0_NEXAH_RESEARCH_METHOD.html", "Research Method", "Prüf- und Vergleichsverfahren"]
  ];
  const pages = {
    "A0_ASSET_INDEX.html": ["A0 Workspace", "Asset Index"],
    "A0_BUILDER_TOY_STORE.html": ["B1 Builder", "Toy Store · Flagships & Tools"],
    "NEXAH_C_CONNECT.html": ["C Connect", "Ecosystem · Repositories · Sources"],
    "A0_SCIENCE.html": ["A0 Science", "Science Entry"],
    "index.html": ["A0 Book", "Übersicht"],
    "A0_FIELDS_AND_JOINTS_ATLAS.html": ["Mathfield", "Fields & Joints Atlas"],
    "A0_MATHEMATICAL_JOINTS.html": ["Mathfield", "Mathematical Joints"],
    "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html": ["Pascal/Pentagon Operator-Instrument", "Arbeitsraum · kein Paper"],
    "A0_GAME_4_LIFE_PLUS_1.html": ["GAME 4 LIFE +1", "Transition Observatory"],
    "A0_SCC_003_PASCAL_PENTAGON_PAPER.html": ["Pascal-Fünfflächen-Quotient", "Paper A · SCC-003"],
    "A0_RETURN_WITHOUT_IDENTITY_PAPER.html": ["Rückkehr ohne Identitätsbehauptung", "Paper C · source-bound synthesis"],
    "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html": ["NEXAH Family Method", "Paper E · Orientierungsverfahren"],
    "A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html": ["Tessarec: Frame, Hülle und Beobachter", "Paper F · R0 theory draft"],
    "A0_RESEARCH_DESK.html": ["Science Desk", "Overview"],
    "A0_METHOD.html": ["Science Desk", "About / Method"],
    "A0_NEXAH_RESEARCH_METHOD.html": ["Science Desk", "Research Method"],
    "A0_FAMILY_CONNECTION_ATLAS.html": ["Family Atlas", "Synchrone Ansichten"],
    "A0_NEWTON_GOETHE_OBSERVER_LENS.html": ["Newton / Leibniz / Goethe", "Quelle · Relation · Erscheinung"],
    "A0_RAINBOW_PURPLE_RAIN.html": ["Rainbow / Purple Rain", "Seven Windows of Appearance"],
    "A0_NEXAH_APERTURE_JOURNEY.html": ["NEXAH Instrument", "The Aperture Journey"],
    "A0_THE_LIVING_INTERIOR.html": ["The Living Interior", "The Inner Passage"],
    "A0_LABORATORY.html": ["Laboratory", "Runs & Results"],
    "A0_RESEARCH_BACKLOG.html": ["Science Research Desk", "A0 Backlog Ledger"],
    "A0_BOUNDARY_GRAPH_DEMONSTRATOR.html": ["Mathfield", "Boundary Graph"],
    "A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html": ["Mathfield", "Q4 Joint Audit"],
    "A0_PASCAL_GENERATION_CORNER.html": ["Pascal Joint", "Generation Corner"]
  };
  const trail = pages[file] || ["A0", document.title.replace(/^.*?·\s*/, "")];
  const workFiles = new Set([...works, ...papers, ...researchRoutes].map(([href]) => href.split("/").pop()));
  workFiles.add(assetIndexPath);
  const originalLinks = [...sourceNav.querySelectorAll(":scope > a")];
  const localLinks = [];
  const relatedLinks = [];
  const externalLinks = [];

  originalLinks.forEach((link) => {
    const raw = link.getAttribute("href") || "";
    const targetFile = decodeURIComponent(raw.split("#")[0].split("/").pop() || "");
    if (workFiles.has(targetFile)) return;
    if (raw.startsWith("#")) localLinks.push(link);
    else if (/^(?:https?:|\.\.\/|\/)/.test(raw)) externalLinks.push(link);
    else relatedLinks.push(link);
  });

  const brand = header.querySelector(".brand");
  if (brand) {
    brand.href = humanEntryPath;
    brand.textContent = "NEXAH";
    brand.setAttribute("aria-label", "Zur menschlichen NEXAH Startseite · A1 Human");
  }

  const entrySwitch = document.createElement("nav");
  entrySwitch.className = "a0-entry-switch";
  entrySwitch.setAttribute("aria-label", "Drei Einstiege: Science, Human und Builder");
  const humanEntry = document.createElement("a");
  humanEntry.className = "a0-entry a0-entry--human";
  humanEntry.href = humanEntryPath;
  humanEntry.innerHTML = "<span>A1</span><strong>Human</strong>";
  humanEntry.setAttribute("aria-label", "A1 Human: menschlicher Einstieg über Frage, Bedeutung und Orientierung");
  if (humanRouteActive) humanEntry.setAttribute("aria-current", "page");
  const scienceEntry = document.createElement("a");
  scienceEntry.className = "a0-entry a0-entry--science";
  scienceEntry.href = "A0_SCIENCE.html";
  scienceEntry.innerHTML = "<span>A0</span><strong>Science</strong>";
  scienceEntry.setAttribute("aria-label", "A0 Science: wissenschaftlicher Einstieg über Instrument, Methode und Prüfung");
  if (file === "A0_SCIENCE.html") scienceEntry.setAttribute("aria-current", "page");
  const builderEntry = document.createElement("a");
  builderEntry.className = "a0-entry a0-entry--builder";
  builderEntry.href = builderEntryPath;
  builderEntry.innerHTML = "<span>B1</span><strong>Builder</strong>";
  builderEntry.setAttribute("aria-label", "B1 Builder: Flagships, Demonstratoren und Werkzeuge öffnen");
  if (builderRouteActive) builderEntry.setAttribute("aria-current", "page");
  entrySwitch.append(scienceEntry, humanEntry, builderEntry);

  // The human entry is an invitation, not a control surface. Keep only the
  // three public-facing doors and the quiet repository index at this threshold.
  if (file === "A0_NEXAH_APERTURE_JOURNEY.html") {
    const entryIndex = document.createElement("a");
    entryIndex.className = "a0-entry-index";
    entryIndex.href = assetIndexPath;
    entryIndex.innerHTML = "<span>I</span><strong>Index</strong>";
    entryIndex.setAttribute("aria-label", "A0 Asset Index öffnen");

    header.replaceChildren(brand, entrySwitch, entryIndex);
    header.classList.add("a0-context-ready", "a0-entry-minimal");
    header.dataset.a0Context = "ready";
    return;
  }

  sourceNav.replaceChildren();
  sourceNav.className = "a0-works-nav";
  sourceNav.setAttribute("aria-label", "A0 Werke");
  const worksLabel = document.createElement("span");
  worksLabel.className = "a0-works-label";
  worksLabel.textContent = "A0 Werke";
  sourceNav.append(worksLabel);
  sourceNav.classList.add("a0-works-columns");
  const workColumns = new Map();
  works.forEach(([href, label, category]) => {
    if (!workColumns.has(category)) {
      const column = document.createElement("section");
      column.className = "a0-work-column";
      column.innerHTML = `<h3>${category}</h3>`;
      workColumns.set(category, column);
      sourceNav.append(column);
    }
    const link = document.createElement("a");
    link.href = href;
    const [title, description = ""] = label.split(" · ");
    link.innerHTML = `<strong>${title}</strong><span>${description}</span>`;
    if (href.split("/").pop() === file) link.setAttribute("aria-current", "page");
    workColumns.get(category).append(link);
  });
  const locationBar = document.createElement("div");
  locationBar.className = "a0-location-bar";
  const entryRoot = builderRouteActive
    ? [builderEntryPath, "B1 Builder"]
    : humanRouteActive
      ? [humanEntryPath, "A1 Human"]
      : ["A0_SCIENCE.html", "A0 Science"];
  const displayTrail = trail[0] === entryRoot[1] ? trail.slice(1) : trail;
  locationBar.innerHTML = `<div class="a0-breadcrumb"><span class="a0-breadcrumb-label">Du bist hier</span><a href="${entryRoot[0]}">${entryRoot[1]}</a><span class="a0-separator">›</span>${displayTrail.map((item, index) => `<strong${index === displayTrail.length - 1 ? ' aria-current="page"' : ""}>${item}</strong>`).join('<span class="a0-separator">›</span>')}</div>`;
  const connectOrb = document.createElement("a");
  connectOrb.className = "a0-connect-orb";
  connectOrb.href = connectEntryPath;
  connectOrb.innerHTML = '<span aria-hidden="true">C</span><em>CONNECT</em>';
  connectOrb.setAttribute("aria-label", "C Connect: Ecosystem, Repositories und Quellen öffnen");
  connectOrb.title = "C CONNECT · follow the sources";
  if (file === connectEntryPath) connectOrb.setAttribute("aria-current", "page");
  locationBar.querySelector(".a0-breadcrumb")?.append(connectOrb);

  const statusPanel = document.createElement("div");
  statusPanel.className = "a0-status-panel";
  const currentness = document.createElement("a");
  currentness.className = "a0-currentness-strip";
  currentness.href = "A0_RESEARCH_DESK.html#method";
  currentness.innerHTML = '<span>Science current · 14 Oct 2026</span><strong>A0 Science → Science Desk → Laboratory</strong><em>Orientation first · admission remains explicit →</em>';
  const statusMetrics = document.createElement("div");
  statusMetrics.className = "a0-status-metrics";
  statusMetrics.innerHTML = '<span><b>0</b> active studies</span><span><b>6</b> flagships in development</span><span><b>3</b> control routes</span>';
  const routeList = document.createElement("div");
  routeList.className = "a0-status-list";
  const routeLabel = document.createElement("h3");
  routeLabel.textContent = "Steuerung & Methode";
  routeList.append(routeLabel);
  researchRoutes.forEach(([href, label, description]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label}</strong><span>${description}</span>`;
    if (href === file) link.setAttribute("aria-current", "page");
    routeList.append(link);
  });
  const paperList = document.createElement("div");
  paperList.className = "a0-paper-list";
  const paperLabel = document.createElement("h3");
  paperLabel.textContent = "Papers & Entwürfe";
  paperList.append(paperLabel);
  papers.forEach(([href, title, description, code]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${title}</strong><span>${description}</span><small>${code}</small>`;
    if (href.split("/").pop() === file) link.setAttribute("aria-current", "page");
    paperList.append(link);
  });
  statusPanel.append(currentness, statusMetrics, routeList, paperList);

  const subnav = document.createElement("div");
  subnav.className = "a0-subnav";
  const addGroup = (label, links, type) => {
    if (!links.length) return;
    const group = document.createElement("div");
    group.className = `a0-subnav-group a0-subnav-group--${type}`;
    const title = document.createElement("span");
    title.className = "a0-subnav-label";
    title.textContent = label;
    links.forEach((link) => {
      if (type === "external" && !/↗\s*$/.test(link.textContent)) link.textContent = `${link.textContent.trim()} ↗`;
    });
    group.append(title, ...links);
    subnav.append(group);
  };
  addGroup("In diesem Werk", localLinks, "local");
  addGroup("Verwandte Seiten", relatedLinks, "related");
  addGroup("Quellen & Navigator", externalLinks, "external");

  const contextGroups = document.createElement("nav");
  contextGroups.className = "a0-context-groups";
  contextGroups.setAttribute("aria-label", "A0 Orientierung");
  const contextStart = works.find(([, label]) => label === trail[0])?.[0] || file;
  const makeGroup = (label, href, content, type) => {
    const group = document.createElement("details");
    group.className = `a0-context-group a0-context-group--${type}`;
    const summary = document.createElement("summary");
    const startLabel = document.createElement("span");
    startLabel.className = "a0-context-start";
    startLabel.textContent = label;
    summary.setAttribute("aria-label", `${label} öffnen`);
    const toggle = document.createElement("span");
    toggle.className = "a0-context-toggle";
    toggle.setAttribute("aria-hidden", "true");
    summary.append(startLabel, toggle);
    const body = document.createElement("div");
    body.className = "a0-context-group-body";
    body.append(content);
    group.append(summary, body);
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      contextGroups.querySelectorAll("details[open]").forEach((other) => {
        if (other !== group) other.open = false;
      });
    });
    return group;
  };
  contextGroups.append(
    makeGroup("A0 Werke", "index.html", sourceNav, "works"),
    makeGroup("Im Kontext", contextStart, subnav, "context"),
    makeGroup("Forschungsstatus", "A0_RESEARCH_DESK.html#method", statusPanel, "status")
  );
  const systemSwitch = document.createElement("nav");
  systemSwitch.className = "a0-system-switch";
  systemSwitch.setAttribute("aria-label", humanRouteActive ? "Rundgang und Index" : "Systemzugänge: Science Desk und Index");
  const scienceDeskLink = document.createElement("a");
  scienceDeskLink.href = humanRouteActive ? "A0_NEXAH_APERTURE_JOURNEY.html#instrument" : scienceDeskPath;
  scienceDeskLink.innerHTML = humanRouteActive ? "<span>09</span><strong>Album</strong>" : "<span>S</span><strong>Science Desk</strong>";
  scienceDeskLink.setAttribute("aria-label", humanRouteActive ? "Zum Album: Rundgang durch neun Apertures" : "Science Desk öffnen: Tests, Lücken und aktueller Arbeitsstand");
  if (file === scienceDeskPath) scienceDeskLink.setAttribute("aria-current", "page");
  const assetIndexLink = document.createElement("a");
  assetIndexLink.href = assetIndexPath;
  assetIndexLink.innerHTML = "<span>I</span><strong>Index</strong>";
  assetIndexLink.setAttribute("aria-label", "A0 Asset Index öffnen");
  if (file === assetIndexPath) assetIndexLink.setAttribute("aria-current", "page");
  systemSwitch.append(scienceDeskLink, assetIndexLink);

  header.replaceChildren(brand, entrySwitch, locationBar, systemSwitch, contextGroups);
  header.classList.add("a0-context-ready");
  header.dataset.a0Context = "ready";

})();
