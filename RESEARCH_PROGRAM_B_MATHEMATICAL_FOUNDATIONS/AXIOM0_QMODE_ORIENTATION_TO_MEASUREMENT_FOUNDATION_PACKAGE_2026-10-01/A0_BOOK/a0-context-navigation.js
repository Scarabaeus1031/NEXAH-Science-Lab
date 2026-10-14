(() => {
  const header = document.querySelector("header.top");
  const sourceNav = header?.querySelector("nav");
  if (!header || !sourceNav || header.dataset.a0Context === "ready") return;

  const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const assetIndexPath = "A0_ASSET_INDEX.html";
  const works = [
    ["A0_SCIENCE.html", "A0 Science · Orientierung"],
    ["index.html", "A0 Book · Grundlagen"],
    ["A0_MATHEMATICAL_JOINTS.html", "Mathfield · Mathematikwerkstatt"],
    ["A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html", "Pascal/Pentagon · Operator-Instrument"],
    ["A0_FAMILY_CONNECTION_ATLAS.html", "Family Atlas · synchrone Ansichten"],
    ["A0_GAME_4_LIFE_PLUS_1.html", "GAME 4 LIFE +1 · Übergänge"]
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
    "A0_SCIENCE.html": ["A0 Science", "Start"],
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
    brand.href = "A0_SCIENCE.html";
    brand.innerHTML = "NEXAH <span>· A0 Science</span>";
    brand.setAttribute("aria-label", "Zur A0 Science Startseite");
  }

  sourceNav.replaceChildren();
  sourceNav.className = "a0-works-nav";
  sourceNav.setAttribute("aria-label", "A0 Werke");
  const worksLabel = document.createElement("span");
  worksLabel.className = "a0-works-label";
  worksLabel.textContent = "A0 Werke";
  sourceNav.append(worksLabel);
  const navigatorLink = document.createElement("a");
  navigatorLink.className = "a0-navigator-link";
  navigatorLink.href = "../../../SCIENCE_LAB/NAVIGATION/APP/index.html#home";
  navigatorLink.textContent = "NN · Source & Recorder";
  navigatorLink.setAttribute("aria-label", "NEXAH Science Navigator als Source- und Recorder-Ansicht öffnen");
  sourceNav.append(navigatorLink);
  works.forEach(([href, label]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href.split("/").pop() === file) link.setAttribute("aria-current", "page");
    sourceNav.append(link);
  });
  const locationBar = document.createElement("div");
  locationBar.className = "a0-location-bar";
  locationBar.innerHTML = `<div class="a0-breadcrumb"><span class="a0-breadcrumb-label">Du bist hier</span><a href="A0_SCIENCE.html">A0 Science</a><span class="a0-separator">›</span>${trail.map((item, index) => `<strong${index === trail.length - 1 ? ' aria-current="page"' : ""}>${item}</strong>`).join('<span class="a0-separator">›</span>')}</div>`;

  const statusPanel = document.createElement("div");
  statusPanel.className = "a0-status-panel";
  const currentness = document.createElement("a");
  currentness.className = "a0-currentness-strip";
  currentness.href = "A0_RESEARCH_DESK.html#method";
  currentness.innerHTML = '<span>Science current · 12 Oct 2026</span><strong>A0 Science → Science Desk → Laboratory</strong><em>6 flagships in development · active research 0 · Science Desk →</em>';
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
  statusPanel.append(currentness, routeList, paperList);

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
    const startLink = document.createElement("a");
    startLink.href = href;
    startLink.textContent = label;
    startLink.setAttribute("aria-label", `${label} Startseite öffnen`);
    startLink.addEventListener("click", (event) => event.stopPropagation());
    const toggle = document.createElement("span");
    toggle.className = "a0-context-toggle";
    toggle.setAttribute("aria-hidden", "true");
    summary.append(startLink, toggle);
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
  const assetIndexLink = document.createElement("a");
  assetIndexLink.className = "a0-asset-index-button";
  assetIndexLink.href = assetIndexPath;
  assetIndexLink.textContent = "Asset Index";
  assetIndexLink.setAttribute("aria-label", "A0 Asset Index öffnen");
  if (file === assetIndexPath) assetIndexLink.setAttribute("aria-current", "page");
  contextGroups.append(assetIndexLink);

  header.replaceChildren(brand, locationBar, contextGroups);
  header.classList.add("a0-context-ready");
  header.dataset.a0Context = "ready";

})();
