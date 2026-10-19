/* Shared map loader runs even on pages whose header uses a different layout. */
(() => {
  const src = document.currentScript?.src;
  if (!src || window.self !== window.top) return;
  const map = document.createElement('script');
  map.src = new URL('a0-orientation-map.js', src).href;
  document.head.append(map);
})();
(() => {
  const header = document.querySelector("header.top, header.topbar");
  const sourceNav = header?.querySelector("nav");
  if (!header || !sourceNav || header.dataset.a0Context === "ready") return;

  const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const jointChildren = {
    "A0_MATHEMATICAL_JOINTS.html": ["mathfield", "Mathfield · mathematische Werkstatt"],
    "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html": ["pascal", "Pascal / Pentagon · Operator-Faden"],
    "A0_JOINT_APPLICATION_DEMONSTRATOR.html": ["applications", "Anwendungen / Return · Prüfbank"]
  };
  if (jointChildren[file] && window.self !== window.top && new URLSearchParams(location.search).get("embed") === "fugen") {
    header.hidden = true;
    header.style.display = "none";
    return; // The parent workspace owns navigation; keep all source-page instruments unchanged.
  }
  if (jointChildren[file]) {
    const style = document.createElement("link");
    style.rel = "stylesheet"; style.href = "a0-joint-workspace.css";
    document.head.append(style);
    const context = document.createElement("nav");
    context.className = "a0-joint-context";
    context.setAttribute("aria-label", "Übergeordneter Fugen-Arbeitsraum");
    const [key, label] = jointChildren[file];
    context.innerHTML = `<a href="A0_FIELDS_AND_JOINTS_ATLAS.html#workspace-${key}">← Im gemeinsamen Fugen-Arbeitsraum öffnen</a><span>Einzelansicht: ${label}</span>`;
    header.after(context);
  }
  const title = document.title.replace(/^NEXAH\s*[·—-]\s*/i, "").replace(/^A0\s*[·—-]\s*/i, "").trim();
  const quietEntry = file === "A0_NEXAH_APERTURE_JOURNEY.html";

  /* One inventory, three reading intentions. Navigation does not change identity or evidence state. */
  const readerLanes = [
    {
      key: "human", code: "H", label: "Human", description: "Drehen, entdecken und ausprobieren",
      entry: "A0_NEXAH_APERTURE_JOURNEY.html#human-view",
      sections: [
        { label: "Beginnen", items: [
          ["A0_TOURS.html", "A0 Touren · Wege & Karten", "Rundgang, große Karte, Crosswalk und historische HTMLs"],
          ["A0_NEXAH_APERTURE_JOURNEY.html", "Dreh es um · die Human-Reise", "Vier interaktive Stationen ohne Vorwissen"],
          ["A0_LIVING_BLUEPRINT.html#situated-orientation", "Living Blueprint · Gesamtkarte", "Leitgedanke, Werkzeugregal und Crosswalk"]
        ]},
        { label: "Szenen · Deep Links", compact: true, items: [
          ["A0_RAINBOW_PURPLE_RAIN.html", "Rainbow / Purple Rain", "Sieben Erscheinungsfenster"],
          ["A0_NEWTON_GOETHE_OBSERVER_LENS.html", "Observer Lens", "Quelle, Relation, Erscheinung"],
          ["A0_THE_LIVING_INTERIOR.html", "The Living Interior", "Innerer Rundgang"],
          ["A0_BLACK_SUN_BIG_MOON.html", "Black Sun / Big Moon", "Zwei Seiten der Sichtbarkeit"],
          ["A0_NEON_TRAP_DOOR.html", "NEON / Trap Door", "Übergang und Rückkehr"],
          ["A0_BLUE_PINK_DODECA_CELL_RETURN.html", "Blue / Pink Cell Return", "Human View auf die Blue-Body-Familie"]
        ]}
      ]
    },
    {
      key: "science", code: "S", label: "Science", description: "Begriffe, Methode und Evidenz", entry: "A0_SCIENCE.html",
      sections: [
        { label: "Lesen & Methode", items: [
          ["A0_SCIENTIFIC_POSITION_REPORT.html", "Scientific Position · Was NEXAH konkret macht", "Resultate, Instrumente und offene Grenzen · Quellenstand 19.10.2026"],
          ["A0_TOURS.html", "A0 Touren · Welche Tour wählst du?", "Sechs Einstiege und alle erhaltenen HTML-Demonstratoren"],
          ["A0_THEORY_STORYBOARD.html#overview", "Theorie-Storyboard · Gesamtkarte", "Sieben Szenen und 3+1-Architektur"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#root7Coupling", "Root7 · mitlaufende Q4-Ansicht", "Ein Quelltakt, Vorzeichen und deklarierter Stretch"],
          ["A0_TOURS.html#core-lorenz", "Forschungsbuch · Core ↔ A0", "Lorenz: Quelle, Projektion, Ereignis und Kontrollrecord"],
          ["A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html#connection-status", "Pascal / Pentagon · Anschlusskarte", "Historische Suchkarten, lokale Tools und begrenzte UI-State-Fuge"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#pentagonWorkbench", "Pascal-Werkzeugfach · Bench", "Opt-in Master-Kopplung; sechs UI-Felder mit Readback und Return"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#orientationRoleMap", "Regenbogen / Scarabaeus / CIKADA / Titan", "Rollen, vorhandene Ergebnisse und offene Adapter; keine Gleichsetzung"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#integrationCrosswalk", "Bestand → A0 · Integrationsabgleich", "26 vorhandene Quellen: Lesepfad, Code-Verbindung und fehlender State-Vertrag getrennt"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#life03Workbench", "LIFE03 ↔ Master", "Vorhandene Scale-Engine, bestätigter State-Vertrag und vollständiger deklarierter Source-Return; Browserabnahme offen"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#root7OpenBook", "Offenes Buch · Dual Pentagon", "Rhombenbasis, gemeinsamer Rücken und deklarierte Öffnung"],
          ["../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_LOOK_ORIENTATION_2026-10-08/index.html", "Root7 LOOK · Primärquellen", "8→16-Fixture, historische Bridge und geschlossener Record"],
          ["A0_SCIENCE.html", "A0 Science", "Ruhiger wissenschaftlicher Einstieg"],
          ["A0_LIVING_BLUEPRINT.html#orientation-shelf", "Gesamtregal & Crosswalk", "Träger, Operatoren, Linsen und Return"],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace", "Felder & Fugen · Arbeitsraum", "Gesamtkarte, Mathfield, Pascal und Anwendungen zusammen"],
          ["A0_NEXAH_RESEARCH_METHOD.html", "Research Method", "Geführter Prüf- und Vergleichsweg"],
          ["A0_METHOD.html", "About / Method", "Vertiefende Methodenkarte"],
          ["LAB_ORIENTATION_MACHINE.html", "Orientation Machine", "Interaktive Orientierung"]
        ]},
        { label: "Buch · A0 Fundamentals", compact: true, items: [
          ["index.html", "A0 Fundamentals →", "Übersichtsseite öffnen · Buch & Kapitel"],
          ["01_FROM_LINE_TO_READOUT.html", "01 · Line to Readout", ""],
          ["02_POINT_LINE_COORDINATE.html", "02 · Punkt, Linie, Koordinate", ""],
          ["03_THREE_POSITIONS_SEAM_RETURN.html", "03 · Position, Naht, Return", ""],
          ["04_DISCRETE_CARRIERS_NEIGHBORHOODS.html", "04 · Träger & Nachbarschaft", ""],
          ["05_DYNAMICS_TRANSITION_STABILITY.html", "05 · Dynamik & Stabilität", ""],
          ["06_PROJECTION_FOURIER_SHADOWS.html", "06 · Projektion & Schatten", ""],
          ["07_EVIDENCE_COMPARISON_DECISION.html", "07 · Evidenz & Entscheidung", ""],
          ["08_RETURN_ONE_CARRIER_SEVEN_QUESTIONS.html", "08 · Return", ""]
        ]},
        { label: "Gates & Status", items: [
          ["A0_LABORATORY.html", "Laboratory", "Admission, Runs und Resultate"],
          ["A0_RESEARCH_BACKLOG.html", "Research Backlog", "Offene Fugen"],
          ["A0_RESEARCH_DESK.html#log", "Research Log", "Chronologie und Returns"],
          ["A0_BUILDER_LOG.html", "Builder-Log · aktuelle Bauabschnitte", "Storyboard, Crosswalk, Bestand und offene Anschlüsse"]
        ]},
        { label: "Papers", compact: true, items: [
          ["A0_SCC_003_PASCAL_PENTAGON_PAPER.html", "Paper A · SCC-003", ""],
          ["A0_RETURN_WITHOUT_IDENTITY_PAPER.html", "Paper C · Return", ""],
          ["A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html", "Paper E · Family Method", ""],
          ["A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html", "Paper F · Tessarec", ""]
        ]},
        { label: "Ergebnisse & Einordnung · Reader", items: [
          ["A0_RESEARCH_DESK.html#achievements-reader", "09 · Achievements", "Konkrete Beiträge und ihre Grenzen"],
          ["A0_RESEARCH_DESK.html#scientific-position", "10 · Wissenschaftliche Einordnung", "Zusammenfassung und vollständiger Position Report"]
        ]},
        { label: "Authority & Currentness · Arbeitsfläche", items: [
          ["A0_RESEARCH_DESK.html", "Science Desk", "A0-Autorität, Arbeitsstand und nächste Gates"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html", "Orientation Controller Bench", "Apertur, Projektion, Zustand und Return"]
        ]}
      ]
    },
    {
      key: "builder", code: "B", label: "Builder", description: "Tools, Neuerungen und Anwendungen", entry: "../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html",
      sections: [
        { label: "Start & Atlanten", items: [
          ["A0_TOURS.html#historical-htmls", "A0 Touren · HTML-Bestand", "Erhaltene Demonstratoren und Quellen wiederfinden"],
          ["A0_LIVING_BLUEPRINT.html#orientation-shelf", "Gesamtregal & Crosswalk", "Welches Werkzeug macht was?"],
          ["../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html", "Builder Startseite", "Was ist neu? Was kann ich nutzen? Wo ist es eingebaut?"],
          ["A0_RESEARCH_DESK.html#builder", "Builder · Tools & Anwendungen", "Bewertete Toolbox, Neuerungen und Einbauorte"],
          ["A0_BUILDER_TOY_STORE.html", "Builder Toy Store", "Werkzeug-Einstieg"],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace", "Felder & Fugen · Arbeitsraum", "Gesamtkarte mit eingebetteten Werkstätten"],
          ["A0_FAMILY_CONNECTION_ATLAS.html", "Family Atlas", "Synchrone Ansichten"]
        ]},
        { label: "Indizes", compact: true, items: [
          ["A0_VISUAL_FIELD_LIBRARY.html", "Visual Field Library", "Visuelle Quellen"],
          ["A0_ASSET_INDEX.html", "Asset Index", "Vollständiges Repository-Inventar"]
        ]},
        { label: "Operatoren & Joints", compact: true, items: [
          ["A0_ORIENTATION_CONTROLLER_BENCH.html", "Orientation Controller", ""],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html#workspace-pascal", "Fugen → Pascal / Pentagon", "Ansicht im gemeinsamen Arbeitsraum"],
          ["A0_PASCAL_GENERATION_CORNER.html", "Generation Corner", ""],
          ["A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html", "Q4 Joint Audit", ""],
          ["A0_BOUNDARY_GRAPH_DEMONSTRATOR.html", "Boundary Graph", ""],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html#workspace-applications", "Fugen → Anwendungen / Return", "Ansicht im gemeinsamen Arbeitsraum"],
          ["A0_JARP_CROSS_LENS_EXTENSION.html", "JARP Cross-Lens", ""],
          ["A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html", "Ihara / Hashimoto", ""]
        ]},
        { label: "Blue Body & Carrier", compact: true, items: [
          ["A0_LIVING_BLUEPRINT.html#tessarec-module", "Tessarec · Modulüberblick", "Paper F, Instrumente, registrierter Master und Prüfgrenzen zusammen"],
          ["A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells", "Blue / Dodeca / Pink · Gesamtkarte", "Legende, Ansichten und Module im Fenster"],
          ["A0_TESSAREC_BLUE_BODY_LAB.html", "Blue Body Lab", ""],
          ["A0_BLUE_BODY_DODECA_COUNTERSHOT.html", "Dodeca Countershot", ""],
          ["A0_AXIS08_FOLD_RETURN_SEQUENCER.html", "AXIS08 Sequencer", ""],
          ["A0_AXIAL_CARRIER_ADAPTER_SUITE.html", "Axial Carrier Suite", ""],
          ["A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer", "GAME 4 LIFE +1", ""],
          ["A0_PINK_DIAMOND_GRID_ATLAS.html", "Pink Diamond Grid", ""]
        ]}
      ]
    }
  ];

  // Editorial navigation homes, not canonical Families, source ownership or evidence admission.
  const navigationGroups = [
    {
      "key": "book",
      "title": "A0 Buch & Einstieg",
      "entry": "index.html",
      "description": "Beginnen, lesen und eine Tour wählen.",
      "sections": [
        {
          "title": "Buch · acht Kapitel",
          "pages": [
            "index.html",
            "01_FROM_LINE_TO_READOUT.html",
            "02_POINT_LINE_COORDINATE.html",
            "03_THREE_POSITIONS_SEAM_RETURN.html",
            "04_DISCRETE_CARRIERS_NEIGHBORHOODS.html",
            "05_DYNAMICS_TRANSITION_STABILITY.html",
            "06_PROJECTION_FOURIER_SHADOWS.html",
            "07_EVIDENCE_COMPARISON_DECISION.html",
            "08_RETURN_ONE_CARRIER_SEVEN_QUESTIONS.html"
          ]
        },
        {
          "title": "Geführte und menschliche Ansichten",
          "pages": [
            "A0_TOURS.html",
            "A0_NEXAH_APERTURE_JOURNEY.html",
            "A0_RAINBOW_PURPLE_RAIN.html",
            "A0_NEWTON_GOETHE_OBSERVER_LENS.html",
            "A0_THE_LIVING_INTERIOR.html",
            "A0_BLACK_SUN_BIG_MOON.html",
            "A0_NEON_TRAP_DOOR.html"
          ]
        }
      ]
    },
    {
      "key": "map",
      "title": "Crosswalk & Karten",
      "entry": "A0_LIVING_BLUEPRINT.html",
      "description": "Zusammenhänge, Families und Quellen verstehen.",
      "sections": [
        {
          "title": "Zusammenhang und Methode",
          "pages": [
            "A0_LIVING_BLUEPRINT.html",
            "A0_THEORY_STORYBOARD.html",
            "A0_FAMILY_CONNECTION_ATLAS.html",
            "A0_NEXAH_RESEARCH_METHOD.html",
            "A0_METHOD.html"
          ]
        },
        {
          "title": "Quellen und vollständige Indizes",
          "pages": [
            "A0_VISUAL_FIELD_LIBRARY.html",
            "A0_ASSET_INDEX.html",
            "NEXAH_C_CONNECT.html"
          ]
        }
      ]
    },
    {
      "key": "workshops",
      "title": "Werkstätten & Instrumente",
      "entry": "A0_FIELDS_AND_JOINTS_ATLAS.html",
      "description": "Ein Themenfeld öffnen; einzelne Tools liegen darunter.",
      "sections": [
        {
          "title": "Joints · Mathematik und Return",
          "pages": [
            "A0_FIELDS_AND_JOINTS_ATLAS.html",
            "A0_MATHEMATICAL_JOINTS.html",
            "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html",
            "A0_PASCAL_GENERATION_CORNER.html",
            "A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html",
            "A0_BOUNDARY_GRAPH_DEMONSTRATOR.html",
            "A0_JOINT_APPLICATION_DEMONSTRATOR.html",
            "A0_JARP_CROSS_LENS_EXTENSION.html",
            "A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html"
          ]
        },
        {
          "title": "Grids · Adressen und Projektionen",
          "pages": [
            "A0_NUMBERMAGICK_GRID_RESEARCH.html",
            "A0_PINK_DIAMOND_GRID_ATLAS.html"
          ]
        },
        {
          "title": "Körper · Faltung und Dynamik",
          "pages": [
            "A0_BLUE_PINK_DODECA_CELL_RETURN.html",
            "A0_TESSAREC_BLUE_BODY_LAB.html",
            "A0_BLUE_BODY_DODECA_COUNTERSHOT.html",
            "A0_AXIS08_FOLD_RETURN_SEQUENCER.html",
            "A0_AXIAL_CARRIER_ADAPTER_SUITE.html",
            "A0_GAME_4_LIFE_PLUS_1.html",
            "A0_GAME_OF_WORLDS.html",
            "A0_GAME_OF_WORLDS_PLAY.html"
          ]
        },
        {
          "title": "Steuern und ausprobieren",
          "pages": [
            "A0_ORIENTATION_CONTROLLER_BENCH.html",
            "LAB_ORIENTATION_MACHINE.html",
            "A0_BUILDER_TOY_STORE.html"
          ]
        }
      ]
    },
    {
      "key": "desk",
      "title": "Science Desk & Papers",
      "entry": "A0_RESEARCH_DESK.html",
      "description": "Befunde, Papers, Regeln und offene Arbeit einordnen.",
      "sections": [
        {
          "title": "Desk · Status und Verlauf",
          "pages": [
            "A0_RESEARCH_DESK.html",
            "A0_SCIENCE.html",
            "A0_LABORATORY.html",
            "A0_RESEARCH_BACKLOG.html",
            "A0_BUILDER_LOG.html"
          ]
        },
        {
          "title": "Papers und Assessment",
          "pages": [
            "A0_SCC_003_PASCAL_PENTAGON_PAPER.html",
            "A0_RETURN_WITHOUT_IDENTITY_PAPER.html",
            "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html",
            "A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html",
            "A0_SCIENTIFIC_POSITION_REPORT.html"
          ]
        }
      ]
    }
  ];
  const pageHome = navigationGroups.find(group => group.sections.some(section => section.pages.includes(file)));
  const tessarecPages = [
    "A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html",
    "A0_TESSAREC_BLUE_BODY_LAB.html",
    "A0_BLUE_PINK_DODECA_CELL_RETURN.html",
    "A0_BLUE_BODY_DODECA_COUNTERSHOT.html",
    "A0_AXIS08_FOLD_RETURN_SEQUENCER.html"
  ];
  const allReaderItems = readerLanes.flatMap(lane => lane.sections.flatMap(section => section.items));
  const labelFor = name => allReaderItems.find(([href]) => href.split("#")[0] === name)?.[1] || name.replace(/\.html$/, "").replace(/^A0_/, "").replaceAll("_", " ");
  const directoryCards = navigationGroups.map(group => `<article><a class="a0-area-entry" href="${group.entry}"><strong>${group.title}</strong><span>${group.description}</span></a>${group.sections.map(section => `<details><summary>${section.title} · ${section.pages.length}</summary><ul>${section.pages.map(name => `<li><a href="${name}"${name===file?' aria-current="page"':""}>${labelFor(name)}</a></li>`).join("")}</ul></details>`).join("")}</article>`).join("");
  if (window.self === window.top && navigationGroups.some(group => group.entry === file)) {
    const main = document.querySelector("main");
    if (main && !document.getElementById("a0-navigation-directory")) {
      const directory = document.createElement("section");
      directory.id = "a0-navigation-directory";
      directory.className = "a0-navigation-directory";
      directory.setAttribute("aria-labelledby", "a0DirectoryTitle");
      directory.innerHTML = `<header><p>A0 · vier Hauptzugänge · gemeinsame Navigation</p><h2 id="a0DirectoryTitle">Hauptseite → Themenbereich → Werkzeug</h2><p>Wähle zuerst einen Zugang. Die aufklappbaren Bereiche zeigen seine Unterseiten. Human / Science / Builder sind Leseperspektiven; F1–F7 sind übergreifende Funktionen, keine sieben getrennten Website-Ordner.</p></header><div class="a0-directory-grid">${directoryCards}</div><p><a href="A0_LIVING_BLUEPRINT.html#tessarec-module">Tessarec · Modulüberblick →</a> · <a href="A0_FAMILY_CONNECTION_ATLAS.html">Nach F1–F7 erkunden →</a> · <a href="A0_RESEARCH_DESK.html#core-documents">Kerndokumente & Policies →</a></p>`;
      main.prepend(directory);
    }
  }

  const flatItems = (lane) => lane.items || lane.sections.flatMap((section) => section.items);
  const targetFile = (href) => decodeURIComponent(href.split("#")[0].split("/").pop() || "");
  const currentLane = jointChildren[file] ? readerLanes[2] : (readerLanes.find((lane) => flatItems(lane).some(([href]) => targetFile(href) === file)) || readerLanes[1]);
  const originalLinks = [...sourceNav.querySelectorAll(":scope > a")];
  const localLinks = originalLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  const contextualLinks = originalLinks.filter((link) => !(link.getAttribute("href") || "").startsWith("#"));

  const brand = header.querySelector(".brand") || document.createElement("a");
  brand.className = "brand a0-brand";
  brand.href = quietEntry ? "A0_NEXAH_APERTURE_JOURNEY.html#human-view" : "index.html";
  brand.textContent = "NEXAH";
  brand.setAttribute("aria-label", quietEntry ? "NEXAH Reader Start" : "A0 Startseite");

  const makeReaderLink = ([href, label, description]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label}</strong>${description ? `<span>${description}</span>` : ""}`;
    if (!quietEntry && targetFile(href) === file) link.setAttribute("aria-current", "page");
    return link;
  };

  const laneNav = document.createElement("nav");
  laneNav.className = "a0-reader-lanes";
  laneNav.setAttribute("aria-label", "Reader nach Perspektive");
  readerLanes.forEach((lane) => {
    const group = document.createElement("details");
    group.className = `a0-reader-lane a0-reader-lane--${lane.key}`;
    if (lane === currentLane) group.dataset.current = "true";
    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${lane.code}</span><strong>${lane.label}</strong><small>${lane.description}</small><i aria-hidden="true"></i>`;
    summary.setAttribute("aria-label", `${lane.label} Reader öffnen`);
    const panel = document.createElement("div");
    panel.className = "a0-reader-panel";
    panel.innerHTML = `<header><div><span>${lane.code} · Reader</span><h2>${lane.label}</h2><p>${lane.description}</p></div><a href="${lane.entry}">Zum Einstieg →</a></header>`;
    const sections = lane.sections || [{ label: "Reader", items: lane.items }];
    const grid = document.createElement("div");
    grid.className = "a0-reader-sections";
    sections.forEach((section) => {
      const folded = section.items.length > 6;
      const list = document.createElement(folded ? "details" : "section");
      list.className = section.compact ? "a0-reader-section is-compact" : "a0-reader-section";
      list.innerHTML = folded ? `<summary>${section.label} · ${section.items.length} Ziele</summary>` : `<h3>${section.label}</h3>`;
      section.items.forEach((item) => list.append(makeReaderLink(item)));
      grid.append(list);
    });
    panel.append(grid);
    group.append(summary, panel);
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      laneNav.querySelectorAll("details[open]").forEach((other) => { if (other !== group) other.open = false; });
    });
    laneNav.append(group);
    if (lane.key === "science") {
      // Direct sibling of Science, not inside a collapsed Reader panel.
      const positionLink = document.createElement("a");
      positionLink.className = "a0-scientific-position-direct";
      positionLink.href = "A0_SCIENTIFIC_POSITION_REPORT.html";
      positionLink.textContent = "Scientific Position";
      positionLink.setAttribute("aria-label", "Scientific Position · Was NEXAH konkret macht");
      if (file === "A0_SCIENTIFIC_POSITION_REPORT.html") positionLink.setAttribute("aria-current", "page");
      laneNav.append(positionLink);
    }
  });

  const pageContext = document.createElement("div");
  pageContext.className = "a0-page-context";
  pageContext.innerHTML = `<span><a href="index.html">A0</a>${pageHome && pageHome.entry !== "index.html" ? ` / <a href="${pageHome.entry}">${pageHome.title}</a>` : " / Buch & Einstieg"} · ${currentLane.label} Reader</span><strong>${title || file}</strong>`;

  const quickNav = document.createElement("nav");
  quickNav.className = "a0-quick-nav";
  quickNav.setAttribute("aria-label", "Schnellzugänge");
  quickNav.innerHTML = '<a href="A0_LIVING_BLUEPRINT.html#a0-map-home"><span>C</span><strong>Crosswalk</strong></a><a href="A0_RESEARCH_DESK.html"><span>S</span><strong>Science Desk</strong></a><a href="index.html#a0-navigation-directory"><span>A0</span><strong>Bereiche</strong></a>';

  const pageTools = document.createElement("div");
  pageTools.className = "a0-page-tools";
  const areas = document.createElement("details");
  areas.className = "a0-page-menu";
  areas.innerHTML = `<summary>A0 Bereiche · Hauptseiten</summary><div class="a0-page-menu-body a0-area-menu">${navigationGroups.map(group => `<a href="${group.entry}">${group.title}</a>`).join("")}<a href="index.html#a0-navigation-directory">Alle Unterseiten nach Themen →</a><a href="A0_FAMILY_CONNECTION_ATLAS.html">F1–F7 · funktionale Families →</a></div>`;
  pageTools.append(areas);
  if (localLinks.length || contextualLinks.length) {
    const details = document.createElement("details");
    details.className = "a0-page-menu";
    const summary = document.createElement("summary");
    summary.textContent = quietEntry ? "Explore" : (localLinks.length ? "Auf dieser Seite" : "Im Kontext");
    const body = document.createElement("div");
    body.className = "a0-page-menu-body";
    const addLinks = (label, links) => {
      if (!links.length) return;
      const section = document.createElement("section");
      section.innerHTML = `<h3>${label}</h3>`;
      links.forEach((link) => section.append(link));
      body.append(section);
    };
    if (quietEntry) {
      body.classList.add("a0-explore-index");
      readerLanes.forEach((lane) => {
        const column = document.createElement("div");
        column.className = "a0-explore-column";
        const heading = document.createElement("h2");
        const entry = document.createElement("a");
        entry.href = lane.entry;
        entry.textContent = `${lane.label} →`;
        heading.append(entry);
        column.append(heading);
        lane.sections.forEach((section) => {
          const group = document.createElement("section");
          const label = document.createElement("h3");
          label.textContent = section.label;
          group.append(label);
          section.items.forEach((item) => group.append(makeReaderLink(item)));
          column.append(group);
        });
        body.append(column);
      });
    } else {
      addLinks("Auf dieser Seite", localLinks);
      addLinks("Verwandte Wege", contextualLinks);
    }
    details.append(summary, body);
    pageTools.append(details);
  }
  const connect = document.createElement("a");
  connect.className = "a0-connect-link";
  connect.href = "NEXAH_C_CONNECT.html";
  connect.textContent = "C · Connect";
  pageTools.append(connect);

  header.replaceChildren(brand, laneNav, pageContext, quickNav, pageTools);
  header.className = "top a0-context-ready";
  if (quietEntry) header.classList.add("a0-context-quiet");
  header.dataset.a0Context = "ready";
  header.dataset.a0Lane = currentLane.key;
  if (tessarecPages.includes(file) && window.self === window.top) {
    const moduleNav = document.createElement("nav");
    moduleNav.className = "a0-module-context";
    moduleNav.setAttribute("aria-label", "Tessarec Modulkontext");
    moduleNav.innerHTML = '<strong>MOD:TESSAREC</strong><a href="A0_LIVING_BLUEPRINT.html#tessarec-module">← Tessarec · Überblick & alle Zugänge</a><a href="A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html#figure">Paper F · Erklärung</a><a href="A0_TESSAREC_BLUE_BODY_LAB.html#guided-test">Blue Body · Instrument</a><a href="A0_RESEARCH_DESK.html#tessarec-module-return">Belege & Science Desk</a>';
    header.after(moduleNav);
  }
  if (!quietEntry && window.self === window.top) {
    const primaryNav = document.createElement("nav");
    primaryNav.className = "a0-primary-navigation";
    primaryNav.setAttribute("aria-label", "A0 Hauptbereiche");
    const actions = {
      book: ["Lesen", "A0 Buch · Einstieg & Touren"],
      map: ["Zusammenhänge verstehen", "Crosswalk · Karten & Families"],
      workshops: ["Werkzeuge nutzen", "Werkstätten · Joints, Grids & Körper"],
      desk: ["Ergebnisse einordnen", "Science Desk · Papers, Belege & Gates"]
    };
    primaryNav.innerHTML = navigationGroups.map(group => `<a href="${group.entry}"${pageHome?.key === group.key ? ' aria-current="location"' : ""}><strong>${actions[group.key][0]}</strong><span>${actions[group.key][1]}</span></a>`).join("");
    header.after(primaryNav);
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest(".a0-reader-lane, .a0-page-menu")) return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
})();
