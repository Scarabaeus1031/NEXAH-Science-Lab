/* Shared map loader runs even on pages whose header uses a different layout. */
(() => {
  const src = document.currentScript?.src;
  if (!src || window.self !== window.top) return;
  const map = document.createElement('script');
  map.src = new URL('a0-orientation-map.js?v=20261023-overview-orientation-split', src).href;
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
  const overviewWays = [
    {code:"01 · HUMAN", title:"Schau noch einmal", copy:"Frage, Licht, Blick und Return.", href:"A0_NEXAH_APERTURE_JOURNEY.html#human-view", accent:"#f177b8"},
    {code:"02 · PLAY", title:"Game of Worlds", copy:"LIFE, Domains und Numbers in ONE PULSE.", href:"A0_GAME_OF_WORLDS_PLAY.html?world=pulse#pulse", accent:"#d99d00"},
    {code:"03 · MATHFIELD", title:"Mathematical Joints", copy:"Buchstellen, Träger, Linsen und Fugen.", href:"A0_MATHEMATICAL_JOINTS.html", accent:"#159bb4"},
    {code:"04 · BUILDER", title:"Orientation Bench", copy:"Quellen, Adapter und Kopplungen prüfen.", href:"A0_ORIENTATION_CONTROLLER_BENCH.html#benchFoyer", accent:"#2ca57a"},
    {code:"05 · SCIENCE", title:"A0 Science", copy:"Methode, Families, Ergebnisse und Grenzen des A0-Programms.", href:"A0_SCIENCE.html#top", accent:"#806bd6"}
  ];

  /* One inventory, three reading intentions. Navigation does not change identity or evidence state. */
  const readerLanes = [
  {
    "key": "human",
    "code": "H",
    "label": "Human",
    "description": "Drehen, entdecken und ausprobieren",
    "entry": "A0_NEXAH_APERTURE_JOURNEY.html#human-view",
    "sections": [
      {
        "label": "Beginnen",
        "items": [
          [
            "A0_TOURS.html",
            "A0 Touren · Wege & Karten",
            "Rundgang, große Karte, Crosswalk und historische HTMLs"
          ],
          [
            "A0_NEXAH_APERTURE_JOURNEY.html",
            "Aperture Journey · Human View",
            "Sieben Fragen, neun Apertures und der Human Return"
          ],
          [
            "A0_LOOK_AGAIN_PLAY.html",
            "LOOK AGAIN · Human Game",
            "Fünf kurze Wahrnehmungsvergleiche ohne Score oder Sehtest"
          ],
          [
            "A0_GAME_OF_WORLDS.html",
            "Game of Worlds · Human Flagship",
            "Originaler Einstieg vor ONE PULSE und den drei spielbaren Welten"
          ],
          [
            "A0_LIVING_BLUEPRINT.html#situated-orientation",
            "Living Blueprint · Gesamtkarte",
            "Leitgedanke, Werkzeugregal und Crosswalk"
          ]
        ]
      },
      {
        "label": "Szenen · Deep Links",
        "compact": true,
        "items": [
          [
            "A0_RAINBOW_PURPLE_RAIN.html",
            "Rainbow / Purple Rain",
            "Sieben Erscheinungsfenster"
          ],
          [
            "A0_NEWTON_GOETHE_OBSERVER_LENS.html",
            "Observer Lens",
            "Quelle, Relation, Erscheinung"
          ],
          [
            "A0_THE_LIVING_INTERIOR.html",
            "The Living Interior",
            "Innerer Rundgang"
          ],
          [
            "A0_BLACK_SUN_BIG_MOON.html",
            "Black Sun / Big Moon",
            "Zwei Seiten der Sichtbarkeit"
          ],
          [
            "A0_NEON_TRAP_DOOR.html",
            "NEON / Trap Door",
            "Übergang und Rückkehr"
          ],
          [
            "A0_BLUE_PINK_DODECA_CELL_RETURN.html",
            "Blue / Pink Cell Return",
            "Human View auf die Blue-Body-Familie"
          ],
          [
            "A0_PINK_DIAMOND_GRID_ATLAS.html#diamond-lens",
            "Diamond Lens · Look again",
            "Ein Carrier, fünf sichtbare Relationen"
          ]
        ]
      }
    ]
  },
  {
    "key": "science",
    "code": "S",
    "label": "Science",
    "description": "Begriffe, Methode und Evidenz",
    "entry": "A0_SCIENCE.html#top",
    "sections": [
      {
        "label": "Wo wir stehen · Ergebnisse & Einordnung",
        "items": [
          [
            "A0_SCIENTIFIC_POSITION_REPORT.html",
            "Scientific Position · Wo wir stehen",
            "Was NEXAH konkret macht, was trägt und was offen bleibt"
          ],
          [
            "A0_SCIENCE.html#contributions",
            "Konkrete Beiträge · Reader",
            "Formalresultate, geprüfte Übergänge und Instrumente getrennt lesen"
          ]
        ]
      },
      {
        "label": "Papers",
        "compact": true,
        "items": [
          [
            "A0_SCC_003_PASCAL_PENTAGON_PAPER.html",
            "Paper A · SCC-003",
            ""
          ],
          [
            "A0_RETURN_WITHOUT_IDENTITY_PAPER.html",
            "Paper C · Return",
            ""
          ],
          [
            "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html",
            "Paper E · Family Method",
            ""
          ],
          [
            "A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html",
            "Paper F · Tessarec",
            ""
          ]
        ]
      },
      {
        "label": "Verstehen & Zusammenhänge",
        "items": [
          ["A0_SCIENCE.html#understand", "Science · Zusammenhänge verstehen", "Erklärseiten und ihre unterschiedlichen Aufgaben"],
          ["A0_NEXAH_RESEARCH_METHOD.html", "Research Method", "Geführter Prüf- und Vergleichsweg"],
          ["A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation", "Families & Fugen · Raumkarte", "Wo bin ich – und wohin führt die nächste Fuge?"],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html", "Felder & Fugen · Erklärung", "Fachliche Heimaten, Rollen und Grenzen"],
          ["A0_METHOD.html", "About / Method", "Vertiefende Methodenkarte"]
        ]
      },
      {
        "label": "Lesepfade & Instrumentbezüge",
        "items": [
          [
            "A0_MATHEMATICAL_JOINTS.html",
            "Mathfield · mathematische Werkstatt",
            "Geometrie, Operatoren, Schnitte und quellengebundene Vergleiche"
          ],
          [
            "A0_TOURS.html",
            "A0 Touren · Welche Tour wählst du?",
            "Sechs Einstiege und alle erhaltenen HTML-Demonstratoren"
          ],
          [
            "A0_THEORY_STORYBOARD.html#overview",
            "Theorie-Storyboard · Gesamtkarte",
            "Sieben Szenen und 3+1-Architektur"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#root7Coupling",
            "Root7 · mitlaufende Q4-Ansicht",
            "Ein Quelltakt, Vorzeichen und deklarierter Stretch"
          ],
          [
            "A0_TOURS.html#core-lorenz",
            "Forschungsbuch · Core ↔ A0",
            "Lorenz: Quelle, Projektion, Ereignis und Kontrollrecord"
          ],
          [
            "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html#connection-status",
            "Pascal / Pentagon · Anschlusskarte",
            "Historische Suchkarten, lokale Tools und begrenzte UI-State-Fuge"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#pentagonWorkbench",
            "Pascal-Werkzeugfach · Bench",
            "Opt-in Master-Kopplung; sechs UI-Felder mit Readback und Return"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#orientationRoleMap",
            "Regenbogen / Scarabaeus / CIKADA / Titan",
            "Rollen, vorhandene Ergebnisse und offene Adapter; keine Gleichsetzung"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#integrationCrosswalk",
            "Bestand → A0 · Integrationsabgleich",
            "26 vorhandene Quellen: Lesepfad, Code-Verbindung und fehlender State-Vertrag getrennt"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#life03Workbench",
            "LIFE03 ↔ Master",
            "Vorhandene Scale-Engine, bestätigter State-Vertrag und vollständiger deklarierter Source-Return; Browserabnahme offen"
          ],
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html#root7OpenBook",
            "Offenes Buch · Dual Pentagon",
            "Rhombenbasis, gemeinsamer Rücken und deklarierte Öffnung"
          ],
          [
            "../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_LOOK_ORIENTATION_2026-10-08/index.html",
            "Root7 LOOK · Primärquellen",
            "8→16-Fixture, historische Bridge und geschlossener Record"
          ],
          [
            "A0_SCIENCE.html",
            "A0 Science",
            "Ruhiger wissenschaftlicher Einstieg"
          ],
          [
            "A0_LIVING_BLUEPRINT.html#orientation-shelf",
            "Gesamtregal & Crosswalk",
            "Träger, Operatoren, Linsen und Return"
          ],
          [
            "A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace",
            "Felder & Fugen · Arbeitsraum",
            "Gesamtkarte, Mathfield, Pascal und Anwendungen zusammen"
          ],
          [
            "LAB_ORIENTATION_MACHINE.html",
            "Orientation Machine",
            "Interaktive Orientierung"
          ]
        ]
      },
      {
        "label": "Buch · A0 Fundamentals",
        "compact": true,
        "items": [
          [
            "index.html",
            "A0 Fundamentals →",
            "Übersichtsseite öffnen · Buch & Kapitel"
          ],
          [
            "01_FROM_LINE_TO_READOUT.html",
            "01 · Line to Readout",
            ""
          ],
          [
            "02_POINT_LINE_COORDINATE.html",
            "02 · Punkt, Linie, Koordinate",
            ""
          ],
          [
            "03_THREE_POSITIONS_SEAM_RETURN.html",
            "03 · Position, Naht, Return",
            ""
          ],
          [
            "04_DISCRETE_CARRIERS_NEIGHBORHOODS.html",
            "04 · Träger & Nachbarschaft",
            ""
          ],
          [
            "05_DYNAMICS_TRANSITION_STABILITY.html",
            "05 · Dynamik & Stabilität",
            ""
          ],
          [
            "06_PROJECTION_FOURIER_SHADOWS.html",
            "06 · Projektion & Schatten",
            ""
          ],
          [
            "07_EVIDENCE_COMPARISON_DECISION.html",
            "07 · Evidenz & Entscheidung",
            ""
          ],
          [
            "08_RETURN_ONE_CARRIER_SEVEN_QUESTIONS.html",
            "08 · Return",
            ""
          ]
        ]
      },
      {
        "label": "Instrumente · optional vertiefen",
        "items": [
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html",
            "Orientation Controller Bench",
            "Apertur, Projektion, Zustand und Return"
          ]
        ]
      }
    ]
  },
  {
    "key": "builder",
    "code": "B",
    "label": "Builder",
    "description": "Tools, Neuerungen und Anwendungen",
    "entry": "../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html",
    "sections": [
      {
        "label": "Start & Werkstätten",
        "items": [
          ["A0_WERKBANK.html", "Werkbank · Start", "Sechs Flagships; THE MACHINA mit vier klar getrennten Innenräumen"],
          ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA · Viewer", "Maschinenkörper, GLBs und ihre source-bound Fenster"],
          ["A0_MACHINA_COCKPIT.html", "THE MACHINA · Pentagon Cockpit", "Orientierungsstation für 16/17, STILL XX/20 und 18/19"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf", "THE MACHINA · Parts Shelf", "Neun checksum-identische FAM-009 Modelle"],
          ["A0_BENCH_ENTDECKEN.html", "Bench · Entdecken", "Foyer, Rundgang und visuelle Flagships"],
          ["A0_BENCH_ARBEITEN.html", "Bench · Arbeiten", "Arbeitsplatz, Tower und Return"],
          ["A0_BENCH_QUELLEN.html", "Bench · Quellen & Prüfen", "Originale, Verträge und Records"],
          [
            "A0_TOURS.html#historical-htmls",
            "A0 Touren · HTML-Bestand",
            "Erhaltene Demonstratoren und Quellen wiederfinden"
          ],
          [
            "A0_LIVING_BLUEPRINT.html#orientation-shelf",
            "Gesamtregal & Crosswalk",
            "Welches Werkzeug macht was?"
          ],
          [
            "../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html",
            "Builder Startseite",
            "Was ist neu? Was kann ich nutzen? Wo ist es eingebaut?"
          ],
          [
            "A0_BUILDER_TOY_STORE.html",
            "Builder Toy Store",
            "Werkzeug-Einstieg"
          ],
          [
            "A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace",
            "Felder & Fugen · Arbeitsraum",
            "Gesamtkarte mit eingebetteten Werkstätten"
          ],
          [
            "A0_SCIENCE.html#understand",
            "Hintergründe in Science",
            "Methode, Family-Raumkarte und Zusammenhänge verstehen"
          ]
        ]
      },
      {
        "label": "Indizes",
        "compact": true,
        "items": [
          [
            "A0_VISUAL_FIELD_LIBRARY.html",
            "Visual Field Library",
            "Visuelle Quellen"
          ],
          [
            "A0_ASSET_INDEX.html",
            "Asset Index",
            "Vollständiges Repository-Inventar"
          ]
        ]
      },
      {
        "label": "Operatoren & Joints",
        "compact": true,
        "items": [
          [
            "A0_ORIENTATION_CONTROLLER_BENCH.html",
            "Orientation Controller",
            ""
          ],
          [
            "A0_FIELDS_AND_JOINTS_ATLAS.html#workspace-pascal",
            "Fugen → Pascal / Pentagon",
            "Ansicht im gemeinsamen Arbeitsraum"
          ],
          [
            "A0_PASCAL_GENERATION_CORNER.html",
            "Generation Corner",
            ""
          ],
          [
            "A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html",
            "Q4 Joint Audit",
            ""
          ],
          [
            "A0_BOUNDARY_GRAPH_DEMONSTRATOR.html",
            "Boundary Graph",
            ""
          ],
          [
            "A0_FIELDS_AND_JOINTS_ATLAS.html#workspace-applications",
            "Fugen → Anwendungen / Return",
            "Ansicht im gemeinsamen Arbeitsraum"
          ],
          [
            "A0_JARP_CROSS_LENS_EXTENSION.html",
            "JARP Cross-Lens",
            ""
          ],
          [
            "A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html",
            "Ihara / Hashimoto",
            ""
          ]
        ]
      },
      {
        "label": "Blue Body & Carrier",
        "compact": true,
        "items": [
          [
            "A0_LIVING_BLUEPRINT.html#tessarec-module",
            "Tessarec · Modulüberblick",
            "Paper F, Instrumente, registrierter Master und Prüfgrenzen zusammen"
          ],
          [
            "A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells",
            "Blue / Dodeca / Pink · Gesamtkarte",
            "Legende, Ansichten und Module im Fenster"
          ],
          [
            "A0_TESSAREC_BLUE_BODY_LAB.html",
            "Blue Body Lab",
            ""
          ],
          [
            "A0_BLUE_BODY_DODECA_COUNTERSHOT.html",
            "Dodeca Countershot",
            ""
          ],
          [
            "A0_AXIS08_FOLD_RETURN_SEQUENCER.html",
            "AXIS08 Sequencer",
            ""
          ],
          [
            "A0_AXIAL_CARRIER_ADAPTER_SUITE.html",
            "Axial Carrier Suite",
            ""
          ],
          [
            "A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer",
            "GAME 4 LIFE +1",
            ""
          ],
          [
            "A0_PINK_DIAMOND_GRID_ATLAS.html",
            "Pink Diamond Grid",
            ""
          ]
        ]
      }
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
          "A0_LOOK_AGAIN_PLAY.html",
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
          "A0_WERKBANK.html",
          "A0_MACHINA_COCKPIT.html",
          "A0_TOWER_RETURN_DEMONSTRATOR.html",
          "A0_IOTA_BRIDGE_DEMONSTRATOR.html",
          "A0_BENCH_ENTDECKEN.html",
          "A0_BENCH_ARBEITEN.html",
          "A0_BENCH_QUELLEN.html",
          "A0_ORIENTATION_CONTROLLER_BENCH.html",
          "LAB_ORIENTATION_MACHINE.html",
          "A0_BUILDER_TOY_STORE.html"
        ]
      },
      {
        "title": "Eigenständige Einstiege · Bestand",
        "pages": [
          "A0_OPIUM.html",
          "A0_ONE_PULSE_BENCH_MONITOR.html",
          "A0_CURSOR_HANDOFF_CLICKDUMMY.html"
        ]
      }
    ]
  },
  {
    "key": "desk",
    "title": "Ergebnisse & Papers",
    "entry": "A0_SCIENTIFIC_POSITION_REPORT.html",
    "description": "Wo wir stehen: Beiträge, Ergebnisse, Belege und offene Grenzen.",
    "sections": [
      {
        "title": "Wo wir stehen",
        "pages": [
          "NEXAH_SCIENCE.html",
          "A0_SCIENTIFIC_POSITION_REPORT.html",
          "A0_SCIENCE.html"
        ]
      },
      {
        "title": "Papers · nach der Einordnung",
        "pages": [
          "A0_SCC_003_PASCAL_PENTAGON_PAPER.html",
          "A0_RETURN_WITHOUT_IDENTITY_PAPER.html",
          "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html",
          "A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html"
        ]
      },
      {
        "title": "Intern · Arbeitsbereich",
        "internal": true,
        "pages": [
          "A0_RESEARCH_DESK.html",
          "A0_RESEARCH_BACKLOG.html",
          "A0_BUILDER_LOG.html",
          "A0_LABORATORY.html"
        ]
      }
    ]
  }
];
  const internalPages = new Set(["A0_RESEARCH_DESK.html","A0_RESEARCH_BACKLOG.html","A0_BUILDER_LOG.html","A0_LABORATORY.html"]);
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
  const directoryCards = navigationGroups.map(group => `<article><a class="a0-area-entry" href="${group.entry}"><strong>${group.title}</strong><span>${group.description}</span></a>${group.sections.filter(section => !section.internal).map(section => `<details><summary>${section.title} · ${section.pages.length}</summary><ul>${section.pages.map(name => `<li><a href="${name}"${name===file?' aria-current="page"':""}>${labelFor(name)}</a></li>`).join("")}</ul></details>`).join("")}</article>`).join("");
  if (window.self === window.top && file === "index.html") {
    const main = document.querySelector("main");
    if (main && !document.getElementById("a0-navigation-directory")) {
      const directory = document.createElement("details");
      directory.id = "a0-navigation-directory";
      directory.className = "a0-navigation-directory";
      directory.setAttribute("aria-labelledby", "a0DirectoryTitle");
      directory.innerHTML = `<summary>Gesamtübersicht · alle A0-Seiten</summary><header><p>A0 · vier Hauptzugänge · gemeinsame Navigation</p><h2 id="a0DirectoryTitle">Hauptseite → Themenbereich → Werkzeug</h2><p>Wähle zuerst einen Zugang. Die aufklappbaren Bereiche zeigen seine Unterseiten. Human / Science / Builder sind Leseperspektiven; F1–F7 sind übergreifende Funktionen, keine sieben getrennten Website-Ordner.</p></header><div class="a0-directory-grid">${directoryCards}</div><p><a href="A0_LIVING_BLUEPRINT.html#tessarec-module">Tessarec · Modulüberblick →</a> · <a href="A0_FAMILY_CONNECTION_ATLAS.html">Nach F1–F7 erkunden →</a> · <a href="A0_SCIENCE.html#who-we-are">Wer wir sind →</a> · <a href="https://nexah.de/about/" target="_blank" rel="noopener noreferrer">About NEXAH ↗</a></p>`;
      main.append(directory);
      const revealDirectory = () => { if (location.hash === "#a0-navigation-directory") { directory.open = true; directory.scrollIntoView?.({block:"start"}); } };
      window.addEventListener("hashchange", revealDirectory);
      revealDirectory();
    }
  }

  const flatItems = (lane) => lane.items || lane.sections.flatMap((section) => section.items);
  const targetFile = (href) => decodeURIComponent(href.split(/[?#]/)[0].split("/").pop() || "");
  const currentLane = jointChildren[file] ? readerLanes[2] : (readerLanes.find((lane) => flatItems(lane).some(([href]) => targetFile(href) === file)) || readerLanes[1]);
  const originalLinks = [...sourceNav.querySelectorAll(":scope > a")];
  const localLinks = originalLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  const contextualLinks = originalLinks.filter((link) => !(link.getAttribute("href") || "").startsWith("#"));

  const brand = header.querySelector(".brand") || document.createElement("a");
  brand.className = "brand a0-brand";
  brand.href = "index.html";
  brand.textContent = "NEXAH";
  brand.setAttribute("aria-label", "A0 Startseite");

  const makeReaderLink = ([href, label, description]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label}</strong>${description ? `<span>${description}</span>` : ""}`;
    if (!quietEntry && targetFile(href) === file) link.setAttribute("aria-current", "page");
    return link;
  };

  // Each lane gets its own invitation. Human is experience-led; Builder keeps the workshop.
  const humanShowcase = [
    ["a0-public-arkade-index.html#arkade", "ARKADE", "ONE PULSE und drei spielbare Welten direkt erleben", "arcade", "Play · Consumer View"],
    ["A0_OPIUM.html", "OPIUM / Club", "Club Machine, Relations Player und Control Room als ein bestehendes Erlebnis-Ensemble", "book", "Club · Human Flagship"],
    ["A0_LOOK_AGAIN_PLAY.html", "LOOK AGAIN", "Fünf Wahrnehmungsvergleiche: gleiche Quelle, andere sichtbare Relation", "cells", "Perception · Human Game"]
  ];
  const builderShowcase = [
    ["A0_WERKBANK.html", "Werkbank", "Maschine, Entdecken, Arbeiten und Quellen & Prüfen", "body", "Builder Flagship"],
    ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA", "Eigener Viewer, Cockpit, Parts Shelf und Full Bench", "body", "Maschinenhaus"],
    ["A0_BUILDER_TOY_STORE.html", "Toy Store", "Werkzeuge entdecken und direkt ausprobieren", "toys", "Werkzeug-Einstieg"]
  ];
  const scienceHighlights = [
    ["NEXAH_SCIENCE.html#overview", "NEXAH Science", "Forschungsfelder, Library, Programme, Ergebnisse und Quellen im Gesamtüberblick", "nexah", "Flagship · Gesamtforschung"],
    ["A0_MATHEMATICAL_JOINTS.html", "Mathfield", "Mathematische Werkstatt für Buchstellen, Träger, Linsen, Fugen und ihre prüfbaren Returns", "cells", "Flagship · Mathematical Joints"]
  ];
  const laneNav = document.createElement("nav");
  laneNav.className = "a0-reader-lanes";
  laneNav.setAttribute("aria-label", "Reader nach Perspektive · Werkbank");
  brand.setAttribute("aria-label", "NEXAH · A0 Startseite");
  const benchMenu = {
    key: "bench", code: "Werkstatt", label: "Werkbank",
    entry: "A0_WERKBANK.html",
    description: "Start · THE MACHINA · Blue Body · Pink Body · Tower · Bridge",
    sections: [
      { label: "00 · Start & THE MΛCHINΛ", items: [
        ["A0_WERKBANK.html", "Werkbank · Start", "Orientieren und einen Arbeitsweg wählen"],
        ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MΛCHINΛ · Viewer", "Maschinenkörper und GLBs als visueller Haupteinstieg"],
        ["A0_MACHINA_COCKPIT.html", "THE MΛCHINΛ · Pentagon Cockpit", "Lokale Rollen um den deklarierten STILL-Pin XX/20"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf", "THE MΛCHINΛ · Parts Shelf", "Neun FAM-009 Modelle einzeln prüfen"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#benchWorkDesk", "THE MΛCHINΛ · Full Bench", "Instrumente und Anschlüsse bedienen"]
      ]},
      { label: "Räume · Bodies & Returns", items: [
        ["A0_TESSAREC_BLUE_BODY_LAB.html#guided-test", "BLUE BODY", "Carrier, Innenraum und Zustandsansichten"],
        ["A0_PINK_DIAMOND_GRID_ATLAS.html#diamond-lens", "PINK DIAMOND", "Ein Carrier · fünf Views · Grid und CRT16 als Werkzeuge"],
        ["A0_TOWER_RETURN_DEMONSTRATOR.html", "TOWER", "q-Adresse, D°G-Witness und Return"],
        ["A0_IOTA_BRIDGE_DEMONSTRATOR.html", "BRIDGE", "8/12-Schedule und gemeinsamer Return bei 24"]
      ]},
      { label: "01 · Entdecken", items: [
        ["A0_BENCH_ENTDECKEN.html", "Entdecken · Einstieg", "Rundgang und visuelle Instrumente"],
        ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA Viewer", "Die Maschinenansichten kennenlernen"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#foyerDoors", "Alle Werkzeuge / Suche", "Den passenden Zugang wählen"]
      ]},
      { label: "02 · Arbeiten", items: [
        ["A0_BENCH_ARBEITEN.html", "Arbeiten · Einstieg", "Instrumente und Anschlüsse"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#benchWorkDesk", "Arbeitsplatz / Binder", "Lokale Lesepfade einzeln prüfen"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#anuTowerWorkbench", "Tower / ANU", "Sichtbarkeit lesen · Transport offen"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#pulseBenchMonitor", "ONE PULSE", "Separater Anschluss · kein automatisches Play"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#carrierReturnWorkbench", "CRT / Return / Ghost", "Adressen und Rückwege vergleichen"]
      ]},
      { label: "03 · Quellen & Prüfen", items: [
        ["A0_BENCH_QUELLEN.html", "Quellen & Prüfen · Einstieg", "Originale, Verträge und Records"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#nativeSourceBank", "Originalquellen", "Quelleneigene Sitzungen bleiben erhalten"],
        ["A0_ORIENTATION_CONTROLLER_BENCH.html#benchSetupDrawer", "Technik & Verträge", "Offene Anschlüsse nachschlagen"]
      ]}
    ]
  };
  const benchHighlights = [
    ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA", "Viewer · Maschinenkörper · GLBs · vier klare Räume", "body", "Viewer"],
    ["A0_TESSAREC_BLUE_BODY_LAB.html#guided-test", "Blue Body", "Carrier, Innenraum und Zustandsadressen", "body", "Body"],
    ["A0_PINK_DIAMOND_GRID_ATLAS.html#diamond-lens", "Pink Diamond", "Yellow, Emerald Shadow, Rainbow, Root/Shell und Evil Twin", "cells", "Diamond Lens"]
  ];
  // Bench is a tool area, not a fourth Reader perspective.
  [...readerLanes, benchMenu].forEach((lane) => {
    const isBench = lane.key === "bench";
    const group = document.createElement("details");
    group.className = `a0-reader-lane a0-reader-lane--${lane.key}`;
    if (isBench ? ["A0_WERKBANK.html","A0_MACHINA_COCKPIT.html","A0_IOTA_BRIDGE_DEMONSTRATOR.html","A0_TOWER_RETURN_DEMONSTRATOR.html","A0_ORIENTATION_CONTROLLER_BENCH.html"].includes(file) || file.startsWith("A0_BENCH_") : lane === currentLane) group.dataset.current = "true";
    const summary = document.createElement("summary");
    summary.innerHTML = `<strong>${lane.label}</strong><i aria-hidden="true"></i>`;
    summary.setAttribute("aria-label", isBench ? "Werkbank-Menü öffnen" : `${lane.label} Reader öffnen`);
    const panel = document.createElement("div");
    panel.className = "a0-reader-panel";
    panel.innerHTML = `<header><a class="a0-reader-home" href="${lane.entry}"><span>${isBench ? "A0 · Werkstatt" : lane.code + " · Reader"}</span><strong>${isBench ? "Zur Werkstatt →" : "Zum " + lane.label + " →"}</strong><small>${lane.description}</small></a></header>`;
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
    const layout = document.createElement("div");
    layout.className = "a0-reader-layout";
    const showcase = document.createElement("section");
    showcase.className = "a0-showcase";
    const isScience = lane.key === "science", isHuman = lane.key === "human";
    showcase.setAttribute("aria-label", isBench ? "Bench · Flagships" : isScience ? "Science · Stand und Beiträge" : isHuman ? "Human Experience · direkt erleben" : "Builder · direkt ausprobieren");
    showcase.innerHTML = isBench
      ? '<h3>Flagships</h3><p>Drei direkte Zugänge in die Werkstatt.</p>'
      : isScience
      ? '<h3>Stand & Beiträge</h3><p>Was trägt — und wo die Grenzen liegen.</p>'
      : isHuman
        ? '<span class="a0-human-signal">HUMAN VIEW · FLAGSHIPS</span><h3>Enter the living view.</h3><p>Nicht nur lesen: drehen, berühren, spielen und mit einem anderen Blick zurückkehren.</p>'
        : '<h3>Werkzeugfenster</h3><p>Bauen, prüfen und Instrumente direkt öffnen.</p>';
    const highlights = isBench ? benchHighlights : isScience ? scienceHighlights : isHuman ? humanShowcase : builderShowcase;
    highlights.forEach(([href, label, description, accent, status]) => {
      const card = document.createElement("a");
      card.className = `a0-showcase-card a0-showcase-card--${accent}`;
      card.href = href;
      card.innerHTML = `<span class="a0-showcase-art" aria-hidden="true"></span><span class="a0-showcase-copy"><small>${status}</small><strong>${label} <span aria-hidden="true">↗</span></strong><span>${description}</span></span>`;
      if (targetFile(href) === file) card.setAttribute("aria-current", "page");
      showcase.append(card);
    });
    const reading = document.createElement("section");
    reading.className = "a0-reader-reading";
    reading.innerHTML = isBench ? '<h3>Die Werkstatt</h3><p>Drei Bereiche · bestehende Instrumente und Quellen</p>' : '<h3>Verstehen & vertiefen</h3><p>Lesepfade, Theorie und Hintergründe</p>';
    reading.append(grid);
    layout.append(showcase, reading);
    panel.append(layout);
    group.append(summary, panel);
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      laneNav.querySelectorAll("details[open]").forEach((other) => { if (other !== group) other.open = false; });
    });
    laneNav.append(group);
  });

  const overview = document.createElement("details");
  overview.className = "a0-page-menu a0-overview-menu";
  const overviewSummary = document.createElement("summary");
  overviewSummary.textContent = "Übersicht";
  overviewSummary.setAttribute("aria-label", "Übersicht · Bereiche und Seiteninhalt");
  const overviewBody = document.createElement("div");
  overviewBody.className = "a0-page-menu-body a0-overview-body";
  const actions = {book:"Lesen",map:"Zusammenhänge verstehen",workshops:"Werkzeuge nutzen",desk:"Ergebnisse einordnen"};
  const currentWays = document.createElement("section");
  currentWays.className = "a0-overview-current";
  currentWays.innerHTML = '<header><div><small>ÜBERSICHT · FÜNF EINSTIEGE</small><h3>Fünf Eingänge. Ein Werk.</h3></div><p>Wähle den Blick, der zu deiner Frage passt. Die technische Orientierungsmap bleibt getrennt und zeigt Quellen, Anschlüsse, Ansichten und Return.</p></header><nav aria-label="Fünf A0-Einstiege">'+overviewWays.map(way => '<a href="'+way.href+'" style="--way-accent:'+way.accent+'"'+(targetFile(way.href)===file?' aria-current="page"':'')+'><small>'+way.code+'</small><strong>'+way.title+'</strong><span>'+way.copy+'</span><em>'+(targetFile(way.href)===file?'DU BIST HIER':'ÖFFNEN ↗')+'</em></a>').join('')+'</nav>';
  overviewBody.innerHTML = '<section class="a0-overview-actions"><h3>Was möchtest du tun?</h3>'+navigationGroups.map(group => '<a href="'+group.entry+'"><strong>'+actions[group.key]+'</strong><span>'+group.title+'</span></a>').join('')+'</section><details class="a0-overview-cluster" open><summary><span>Orientieren &amp; vollständig suchen</span><small>Karten, Families und alle A0-Seiten</small></summary><div><a href="A0_LIVING_BLUEPRINT.html#a0-map-home">Technische Orientierungsmap</a><a href="index.html#a0-navigation-directory">Alle A0-Seiten nach Themen</a><a href="A0_FAMILY_CONNECTION_ATLAS.html">F1–F7 · funktionale Families</a><a href="NEXAH_C_CONNECT.html">C · Connect</a></div></details>';
  overviewBody.prepend(currentWays);
  const addContext = (label, links, expanded = false) => {
    if (!links.length) return;
    const section = document.createElement("details");
    section.className = "a0-overview-cluster";
    section.open = expanded;
    const heading = document.createElement("summary");heading.innerHTML = `<span>${label}</span><small>${links.length} ${links.length === 1 ? "Ziel" : "Ziele"}</small>`;section.append(heading);
    const targets = document.createElement("div");links.forEach(link => targets.append(link));section.append(targets);overviewBody.append(section);
  };
  addContext("Auf dieser Seite", localLinks, true);
  addContext("Quellen und verwandte Wege", contextualLinks);
  if (tessarecPages.includes(file)) {
    const moduleContext = document.createElement("details");
    moduleContext.className = "a0-overview-cluster";
    moduleContext.innerHTML = '<summary><span>MOD:TESSAREC · Modulkontext</span><small>3 feste Rückwege</small></summary><div><a href="A0_LIVING_BLUEPRINT.html#tessarec-module">Modulüberblick</a><a href="A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html#figure">Paper F · Erklärfigur</a><a href="A0_TESSAREC_BLUE_BODY_LAB.html#guided-test">Blue Body · Instrument</a></div>';
    overviewBody.append(moduleContext);
  }
  const internalMenu = document.createElement("details");
  internalMenu.className = "a0-overview-internal";
  internalMenu.innerHTML = '<summary>Intern · Arbeitsbereich</summary><p>Operative Arbeitsseiten, kein Zugriffsschutz.</p><div><a href="A0_RESEARCH_BACKLOG.html">Backlog · Aufgaben</a><a href="A0_BUILDER_LOG.html">Builder-Log · Verlauf</a><a href="A0_LABORATORY.html">Laboratory · Admission und Runs</a></div>';
  if (internalPages.has(file)) overviewBody.append(internalMenu);
  overview.append(overviewSummary, overviewBody);
  overview.addEventListener("toggle", () => {if(overview.open)laneNav.querySelectorAll(".a0-reader-lane[open]").forEach(group=>{group.open=false;});});
  laneNav.addEventListener("toggle", event => {if(event.target.matches?.(".a0-reader-lane[open]"))overview.open=false;},true);
  const connectLink = document.createElement("a");
  connectLink.className = "a0-connect-link";
  connectLink.href = "NEXAH_C_CONNECT.html";
  connectLink.textContent = "C";
  connectLink.setAttribute("aria-label", "C · Connect öffnen");
  connectLink.title = "C · Connect";
  if (file === "NEXAH_C_CONNECT.html") connectLink.setAttribute("aria-current", "page");
  const scarabaeusLink = document.createElement("a");
  scarabaeusLink.className = "a0-scarabaeus-link";
  const localOwnerContext = location.protocol === "file:" || ["127.0.0.1", "localhost"].includes(location.hostname);
  scarabaeusLink.href = localOwnerContext ? "A0_RESEARCH_DESK.html" : "https://www.scarabaeus1033.net";
  if (!localOwnerContext) {
    scarabaeusLink.target = "_blank";
    scarabaeusLink.rel = "noopener noreferrer";
  }
  scarabaeusLink.innerHTML = '<svg class="a0-owner-scarab" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="4" r="2.2"/><path d="M16 7c-4.2 0-6.5 3.2-6.5 7.7V20c0 4.5 2.3 7 6.5 9 4.2-2 6.5-4.5 6.5-9v-5.3C22.5 10.2 20.2 7 16 7Z"/><path d="M10 11C5.8 8.7 2.7 11 3.5 15.2c.7 3.6 3.1 5.8 6 6.2M22 11c4.2-2.3 7.3 0 6.5 4.2-.7 3.6-3.1 5.8-6 6.2M10 15H5M22 15h5M10 20l-5 3M22 20l5 3M13 8 9 4M19 8l4-4M10 24l-3 4M22 24l3 4"/></svg>';
  scarabaeusLink.setAttribute("aria-label", localOwnerContext ? "Owner · A0 Science Desk öffnen" : "Scarabäus 1033 · Website öffnen");
  scarabaeusLink.title = localOwnerContext ? "Owner · A0 Science Desk" : "Scarabäus 1033 · www.scarabaeus1033.net";
  header.replaceChildren(brand, laneNav, connectLink, overview, scarabaeusLink);
  header.className = "top a0-context-ready a0-context-compact";
  header.dataset.a0Lane = currentLane.key;
  header.dataset.a0Context = "ready";
  // A return banner is useful only when a crosswalk context was supplied.
  if (file === "A0_LIVING_BLUEPRINT.html" && ![...new URLSearchParams(location.search).keys()].some(key => key.startsWith("hc_"))) {
    const returnBanner = document.getElementById("humanCrosswalkReturn");
    if (returnBanner) returnBanner.hidden = true;
  }
  header.dataset.a0Lane = currentLane.key;
  document.addEventListener("click", (event) => {
    if (event.target.closest(".a0-reader-lane, .a0-page-menu")) return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
})();
