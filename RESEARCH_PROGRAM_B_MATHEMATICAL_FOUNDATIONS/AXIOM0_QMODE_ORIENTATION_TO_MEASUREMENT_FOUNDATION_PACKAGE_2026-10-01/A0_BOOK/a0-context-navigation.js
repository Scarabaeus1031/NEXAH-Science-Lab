/* Shared map loader runs even on pages whose header uses a different layout. */
(() => {
  const src = document.currentScript?.src;
  if (!src || window.self !== window.top) return;
  const map = document.createElement('script');
  map.src = new URL('a0-orientation-map.js?v=20261029-a0-navigator-family-map-r2', src).href;
  document.head.append(map);
})();
(() => {
  const header = document.querySelector("header.top, header.topbar");
  const sourceNav = header?.querySelector("nav");
  if (!header || !sourceNav || header.dataset.a0Context === "ready") return;

  const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const localOwnerContext = (location.protocol === "file:" || ["127.0.0.1", "localhost"].includes(location.hostname)) && !location.pathname.includes("/a0-human/");
  const nexahedronPublicHref = "https://nexahedron.com/";
  const nexahedronStagingHref = "http://127.0.0.1:3001/";
  const nexahedronHref = localOwnerContext ? nexahedronStagingHref : nexahedronPublicHref;
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
    {code:"04 · BUILDER", title:"A0 Builder · Werkbank", copy:"Hauptmodule, Quellen, Adapter und Kopplungen gemeinsam öffnen.", href:"A0_WERKBANK.html?view=machina#bench-page-top", accent:"#2ca57a"},
    {code:"05 · SCIENCE", title:"A0 Science Desk", copy:"Vollständiger Arbeitsraum für Methode, Findings, Returns und Grenzen.", href:"A0_RESEARCH_DESK.html?desk=research#top", accent:"#806bd6"}
  ];

  /* One inventory, three reading intentions. Navigation does not change identity or evidence state. */
  const readerLanes = [
  {
    "key": "human",
    "code": "H",
    "label": "NEXAHEDRON · Human",
    "description": "Drehen, entdecken und ausprobieren",
    "entry": "https://nexahedron.com/",
    "sections": [
      {
        "label": "Beginnen",
        "items": [
          [
            "index.html#top",
            "NEXAH A0 · Startseite",
            "Zur gemeinsamen Owner-Abnahmesicht und den Häusern zurückkehren"
          ],
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
            "A0_OPIUM.html#entrance",
            "OPIUM / Club",
            "Club Machine, Relations Player und Control Room mit Rückweg zu A0 und THE MACHINA"
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
    "label": "A0 · Science",
    "description": "Begriffe, Methode und Evidenz",
    "entry": "A0_RESEARCH_DESK.html?desk=research&rev=currentness-r3-20261031#top",
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
        "label": "A0 NSNavigator · finden und zuordnen",
        "items": [
          [
            "A0_DATA_AND_REGISTERS.html#top",
            "A0 NSNavigator · Register Lens",
            "Welche Liste beantwortet welche Frage?"
          ],
          [
            "A0_DATA_AND_REGISTERS.html#search-order",
            "Vor einer neuen Liste",
            "Suchen → Autorität prüfen → vorhandenen Datensatz erweitern"
          ],
          [
            "A0_DATA_AND_REGISTERS.html#science-registers",
            "Science Navigator / Source Graph",
            "Quellen, Identitäten und typisierte Relationen"
          ],
          [
            "A0_VISUAL_FIELD_LIBRARY.html",
            "Visual Field Library",
            "Bilder, visuelle Felder und Quellenräume"
          ],
          [
            "A0_ASSET_INDEX.html",
            "A0 Asset Index",
            "Interner Datei- und Oberflächenindex"
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
    "label": "A0 · Builder",
    "description": "Tools, Neuerungen und Anwendungen",
    "entry": "A0_BUILDER_TOY_STORE.html#bench-page-top",
    "sections": [
      {
        "label": "Highlights · aktueller Build",
        "highlight": true,
        "items": [
          ["A0_TESSAREC_BLUE_BODY_LAB.html#guided-test", "01 · CARRIER / BLUE BODY", "Träger, Innenregister und kontrollierte Zustandsansichten"],
          ["A0_PINK_DIAMOND_GRID_ATLAS.html#diamond-lens", "02 · RELATION / PINK DIAMOND", "Grid, CRT16 und fünf gebundene Relationsansichten"],
          ["A0_BLUE_PINK_DODECA_CELL_RETURN.html#threeLissajousPlanes", "03 · COUPLING / BLUE × PINK", "Drei Lissajous-Ebenen verbinden Carrier, Zellen und Regime"],
          ["A0_SPIN_TO_BLOOM_MEASUREMENT.html#edelweissBridge", "04 · BLOOM / EDELWEISS", "Root-Carrier, Feld, zwölf Tips und White-Dodeca-Slots in einer Kopplungsbank"],
          ["A0_SPIN_TO_BLOOM_MEASUREMENT.html#translatorOrientationReceipt", "05 · RECEIPT / V12 TRANSLATOR", "6+6-Bank, Ratio-Bügel, RE-Exit und DO′-Return mit Negativkontrollen"],
          ["A0_LIVING_BLUEPRINT.html#a0-map-home", "06 · RETURN / LIVING BLUEPRINT", "Family Connection Map, Status, offene Fragen und Rückweg in den Gesamtbestand"]
        ]
      },
      {
        "label": "Workbench",
        "items": [
          ["A0_WERKBANK.html", "Werkbank · Start", "Eine Workbench; vier Flagship Labs; mehrere begrenzte Demonstratoren"],
          ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA · Viewer", "Maschinenkörper, GLBs und ihre source-bound Fenster"],
          ["A0_MACHINA_COCKPIT.html", "THE MACHINA · Pentagon Cockpit", "Orientierungsstation für 16/17, STILL XX/20 und 18/19"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf", "THE MACHINA · Parts Shelf", "Neun checksum-identische FAM-009 Modelle"],
          ["A0_BENCH_ENTDECKEN.html", "Bench · Entdecken", "Foyer, Rundgang und visuelle Flagships"],
          ["A0_BENCH_MODULES.html", "Bench · Module / Tool", "Einzeln bedienbare Views, Controls und Adapter"],
          ["A0_BENCH_ARBEITEN.html", "Bench · Arbeiten", "Arbeitsplatz, Tower und Return"],
          ["A0_BENCH_QUELLEN.html", "Bench · Source / Asset", "Originale, Assets, Records und Verträge"]
        ]
      },
      {
        "label": "Demonstratoren",
        "items": [
          ["A0_TOWER_RETURN_DEMONSTRATOR.html", "TOWER", "q-Adresse, D°G-Witness und Return"],
          ["A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship", "IOTA GRID BRIDGE", "Schedule, Q4/24, G8³/512, Zither 4×7 und Rank48"],
          ["A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html", "CROWN", "Fünfflaschenkrone, Herzmechanismus und gebundener Return"],
          ["A0_LANTERN_PANEL_V_CONTROL_LENS.html", "PANEL V", "147,5°-Kontrolllinse und Crown-Replay"],
          ["A0_ROOTROOM_CODON_ORIENTATION_RETURN.html", "ROOTROOM × CODON", "Fünf Green-Cube-Anker, Triplet-Register und Ein-/Zwei-Umlauf-Return"],
          ["A0_SPIN_TO_BLOOM_MEASUREMENT.html#kleinLamellaReturnBridge", "LAMELLA-DIAGNOSE", "Begrenzte Vergleichsansicht für Lamellen, Ebenen und lokalen Return"],
          ["A0_BREATHING_CRYSTAL_APERTURE.html", "CRYSTAL", "X|-Apertur, Materialansichten, Fourier-Reveal und visueller Return"]
        ]
      },
      {
        "label": "Bestand & Status",
        "items": [
          [
            "A0_NEXAH_RESEARCH_METHOD.html#top",
            "NEXAH Research Method · Find the joint",
            "Der ausführliche A0-Lesepfad von Record, Cut und View über Joint und Test bis Return"
          ],
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
            "A0_LIVING_BLUEPRINT.html#open-questions",
            "Status & offene Fragen",
            "Read-only Rückweg zu Status, Grenzen und dem autoritativen Desk"
          ],
          [
            "index.html?projection=builder-showcase",
            "A0 Builder Home",
            "Der lange eingefrorene Builder Showcase im bestehenden A0-Haus"
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
  // A0 is the frame, not a second Human site: local work opens the current
  // NEXAHEDRON staging application; public projections retain the live URL.
  readerLanes[0].entry = nexahedronHref;

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
          "A0_DATA_AND_REGISTERS.html",
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
          "A0_ASSEMBLY_ATLAS.html",
          "A0_MATHEMATICAL_JOINTS.html",
          "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html",
          "A0_PASCAL_GENERATION_CORNER.html",
          "A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html",
          "A0_7_11_TYPED_CROSSWALK.html",
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
          "A0_PENTAGON_BODY_EXHIBITION.html",
          "A0_PENTAGON_BODY_RETURN_GUIDED.html",
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
          "A0_MACHINA_ANATOMY_MAP.html",
          "A0_MACHINA_COCKPIT.html",
          "A0_TOWER_RETURN_DEMONSTRATOR.html",
          "A0_IOTA_BRIDGE_DEMONSTRATOR.html",
          "A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html",
          "A0_LANTERN_PANEL_V_CONTROL_LENS.html",
          "A0_ROOTROOM_CODON_ORIENTATION_RETURN.html",
          "A0_SPIN_TO_BLOOM_MEASUREMENT.html",
          "A0_NLK_LSHELL_DEVELOPMENT_PROBE.html",
          "A0_BREATHING_CRYSTAL_APERTURE.html",
          "A0_BENCH_ENTDECKEN.html",
          "A0_BENCH_MODULES.html",
          "A0_BENCH_ARBEITEN.html",
          "A0_BENCH_QUELLEN.html",
          "A0_ORIENTATION_CONTROLLER_BENCH.html",
          "A0_CROWN_SHADOW_CONTACT_BENCH.html",
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
          "A0_F_A0_26_REVIEW_PROBE.html",
          "A0_RESEARCH_BACKLOG.html",
          "A0_BUILDER_LOG.html",
          "A0_LABORATORY.html"
        ]
      }
    ]
  }
];
  const internalPages = new Set(["A0_RESEARCH_DESK.html","A0_F_A0_26_REVIEW_PROBE.html","A0_RESEARCH_BACKLOG.html","A0_BUILDER_LOG.html","A0_LABORATORY.html"]);
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
  // Only mark a Reader lane current when the page is explicitly listed in it.
  // Falling back to Science made unrelated tool/index pages look like Science
  // homes and inverted the intended two-step interaction: enter first, then
  // open that house's navigation on the destination page.
  const currentLane = file === "index.html"
    ? null
    : jointChildren[file]
      ? readerLanes[2]
      : (readerLanes.find((lane) => flatItems(lane).some(([href]) => targetFile(href) === file)) || null);
  const originalLinks = [...sourceNav.querySelectorAll(":scope > a")];
  const localLinks = originalLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  const contextualLinks = originalLinks.filter((link) => !(link.getAttribute("href") || "").startsWith("#"));

  const brand = header.querySelector(".brand") || document.createElement("a");
  brand.className = "brand a0-brand";
  brand.href = "index.html#top";
  brand.textContent = "NEXAH A0";
  brand.setAttribute("aria-label", "NEXAH A0 · gemeinsames Portal");
  brand.addEventListener("click", (event) => {
    const target = new URL(brand.href, location.href);
    if (target.pathname !== location.pathname || target.hash !== "#top") return;
    event.preventDefault();
    if (location.hash !== "#top") history.pushState(null, "", `${location.pathname}${location.search}#top`);
    window.scrollTo(0, 0);
  });

  const makeReaderLink = ([href, label, description]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label}</strong>${description ? `<span>${description}</span>` : ""}`;
    if (!quietEntry && targetFile(href) === file) link.setAttribute("aria-current", "page");
    return link;
  };

  // The shared A0 server is rooted at A0_BOOK. Keep its primary navigation
  // inside that served tree: ecosystem-level Mission-Control and Builder files
  // remain source authorities, but they are not safe browser routes here.
  const builderShowcaseHref = "A0_WERKBANK.html?view=machina&rev=a0-local-routes-r2-20261031#bench-page-top";
  const builderDeskHref = "A0_BUILDER_LOG.html?rev=currentness-r3-20261031#top";
  const missionControlHref = "A0_DATA_AND_REGISTERS.html#top";
  // Each lane gets its own invitation. Human is experience-led; Builder keeps the workshop.
  const humanShowcase = [
    ["a0-public-arkade-index.html#arkade", "ARKADE", "ONE PULSE und drei spielbare Welten direkt erleben", "arcade", "Play · Consumer View"],
    ["A0_OPIUM.html", "OPIUM / Club", "Club Machine, Relations Player und Control Room als ein bestehendes Erlebnis-Ensemble", "book", "Club · Human Flagship"],
    ["A0_LOOK_AGAIN_PLAY.html", "LOOK AGAIN", "Fünf Wahrnehmungsvergleiche: gleiche Quelle, andere sichtbare Relation", "cells", "Perception · Human Game"]
  ];
  // The long Builder Home remains the existing source-bound A0 projection.
  // Keep one identity and one maintained source; do not mint a second A0 copy.
  const builderShowcaseHome = ["index.html?projection=builder-showcase", "A0 Builder Home", "What can we build now? Der lange Builder Showcase mit Bestand, Anwendungen, Werkzeugwand und Grenzen", "nexah", "A0 · Builder Home"];
  const builderShowcase = [
    builderShowcaseHome,
    ["A0_MACHINA_COCKPIT.html#benchFoyer", "THE MACHINA", "Eigener Viewer, Cockpit, Parts Shelf und Full Bench", "body", "Haus / Host"],
    ["A0_BUILDER_TOY_STORE.html#instrument-atlas", "Instrument Atlas", "Kuratiertes Werkzeugregal und Consumer Cuts", "body", "Builder · Atlas"]
  ];
  const machinaMainModules = [
    ["A0_MACHINA_COCKPIT.html#machinaAssembly", "THE MACHINA", "HOUSE / ASSEMBLY", "Viewer, Cockpit, Räume und exakte Returns in einem gemeinsamen Host.", "house"],
    ["A0_TESSAREC_BLUE_BODY_LAB.html#module-entry", "BLUE BODY", "FLAGSHIP LAB", "Carrier, Innenregister und kontrollierte Zustandsansichten.", "carrier"],
    ["A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry", "PINK DIAMOND", "FLAGSHIP LAB", "Ein Carrier und mehrere gebundene Relationsansichten.", "relation"],
    ["A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry", "BLUE × PINK", "FLAGSHIP LAB", "Gekoppelter Träger, Zellenregister und typisierte Returns.", "coupling"],
    ["A0_TOWER_RETURN_DEMONSTRATOR.html#module-entry", "TOWER", "FLAGSHIP DEMONSTRATOR", "q-Adresse, Witness und quellgebundener Return.", "tower"],
    ["A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship", "IOTA GRID BRIDGE", "FLAGSHIP INSTRUMENT", "Schedule, Q4/24, G8³/512, Zither 4×7, Rank48 und gemeinsamer Return.", "bridge"],
    ["A0_SPIN_TO_BLOOM_MEASUREMENT.html#edelweissBridge", "EDELWEISS", "CURRENT FLAGSHIP", "Root → Field → Bloom → Dodeca → Receipt.", "edelweiss"],
    ["A0_NLK_LSHELL_DEVELOPMENT_PROBE.html#mainStageShell", "NLK / L-SHELL", "FLAGSHIP INSTRUMENT", "Grid, platonischer Körper, Package, Wave, Fold und Tri-View in einer source-bound Probe.", "nlk"]
  ];
  const builderCurrentFlagship =
    ["A0_SPIN_TO_BLOOM_MEASUREMENT.html#edelweissBridge", "EDELWEISS", "Root → Field → Bloom → Dodeca → Receipt: die integrierende Kopplungsbank", "edelweiss", "CURRENT FLAGSHIP"];
  const builderFlagshipConstellation = machinaMainModules.map(([route, name, role, copy, accent]) => [route, name, copy, accent, role]);
  const scienceHighlights = [
    ["A0_RESEARCH_DESK.html?desk=research&rev=currentness-r3-20261031#top", "A0 Science Desk", "Vollständiger Arbeitsraum für Prioritäten, Findings, Returns, Instrumente und Grenzen", "nexah", "Intern · autoritativer Desk"],
    ["A0_MATHEMATICAL_JOINTS.html", "Mathfield", "Mathematische Werkstatt für Buchstellen, Träger, Linsen, Fugen und ihre prüfbaren Returns", "cells", "Flagship · Mathematical Joints"],
    ["A0_DATA_AND_REGISTERS.html#top", "A0 NSNavigator", "A0-Struktur binden, zuständige Register finden und vorhandene Records weiterverwenden", "book", "Science · Source-bound Register Lens"]
  ];
  const laneNav = document.createElement("nav");
  laneNav.className = "a0-reader-lanes";
  laneNav.setAttribute("aria-label", "Reader nach Perspektive");
  brand.setAttribute("aria-label", "NEXAH A0 · gemeinsames Portal");
  // Werkbank is a Builder room, not an additional Reader perspective. Data
  // and registers belong to Science as a source-bound navigation section.
  readerLanes.filter((lane) => lane.key !== "human").forEach((lane) => {
    const laneIsCurrent = lane === currentLane;
    const group = document.createElement("details");
    group.className = `a0-reader-lane a0-reader-lane--${lane.key}`;
    group.dataset.lane = lane.key;
    if (laneIsCurrent) group.dataset.current = "true";
    const summary = document.createElement("summary");
    summary.innerHTML = lane.key === "builder"
      ? '<svg class="a0-builder-scarab" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="4" r="2.2"/><path d="M16 7c-4.2 0-6.5 3.2-6.5 7.7V20c0 4.5 2.3 7 6.5 9 4.2-2 6.5-4.5 6.5-9v-5.3C22.5 10.2 20.2 7 16 7Z"/><path d="M10 11C5.8 8.7 2.7 11 3.5 15.2c.7 3.6 3.1 5.8 6 6.2M22 11c4.2-2.3 7.3 0 6.5 4.2-.7 3.6-3.1 5.8-6 6.2M10 15H5M22 15h5M10 20l-5 3M22 20l5 3M13 8 9 4M19 8l4-4M10 24l-3 4M22 24l3 4"/></svg><strong>A0 · Builder</strong><i aria-hidden="true"></i>'
      : `<strong>${lane.label}</strong><i aria-hidden="true"></i>`;
    summary.setAttribute("aria-label", laneIsCurrent ? `${lane.label} Navigation öffnen` : `${lane.label} öffnen`);
    if (!laneIsCurrent && lane.key !== "builder") {
      if (lane.key === "human") summary.setAttribute("data-a0-nexahedron", "");
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        if (lane.key !== "human") window.location.href = lane.entry;
      });
    }
    const panel = document.createElement("div");
    panel.className = "a0-reader-panel";
    const sections = lane.sections || [{ label: "Reader", items: lane.items }];
    const grid = document.createElement("div");
    grid.className = "a0-reader-sections";
    sections.forEach((section) => {
      const folded = section.items.length > 6;
      const list = document.createElement(folded ? "details" : "section");
      list.className = `a0-reader-section${section.compact ? " is-compact" : ""}${section.highlight ? " is-highlight" : ""}`;
      list.innerHTML = folded ? `<summary>${section.label} · ${section.items.length} Ziele</summary>` : `<h3>${section.label}</h3>`;
      section.items.forEach((item) => list.append(makeReaderLink(item)));
      grid.append(list);
    });
    const layout = document.createElement("div");
    layout.className = "a0-reader-layout";
    const showcase = document.createElement("section");
    showcase.className = "a0-showcase";
    const isScience = lane.key === "science", isHuman = lane.key === "human";
    showcase.setAttribute("aria-label", isScience ? "Science · Stand, Daten und Beiträge" : isHuman ? "Human Experience · direkt erleben" : "Builder · direkt ausprobieren");
    showcase.innerHTML = isScience
      ? '<h3>Stand, Daten & Beiträge</h3><p>Was trägt, wo es liegt — und wo die Grenzen liegen.</p>'
      : isHuman
        ? '<span class="a0-human-signal">HUMAN VIEW · FLAGSHIPS</span><h3>Enter the living view.</h3><p>Nicht nur lesen: drehen, berühren, spielen und mit einem anderen Blick zurückkehren.</p>'
        : '<h3>Werkzeugfenster</h3><p>Bauen, prüfen und Instrumente direkt öffnen.</p>';
    const highlights = isScience ? scienceHighlights : isHuman ? humanShowcase : builderShowcase;
    highlights.forEach(([href, label, description, accent, status]) => {
      const card = document.createElement("a");
      card.className = `a0-showcase-card a0-showcase-card--${accent}`;
      card.href = href;
      if (href === builderShowcaseHref) card.setAttribute("data-a0-builder-showcase", "");
      card.innerHTML = `<span class="a0-showcase-art" aria-hidden="true"></span><span class="a0-showcase-copy"><small>${status}</small><strong>${label} <span aria-hidden="true">↗</span></strong><span>${description}</span></span>`;
      if (targetFile(href) === file) card.setAttribute("aria-current", "page");
      showcase.append(card);
    });
    let currentFlagship = null;
    let constellation = null;
    if (lane.key === "builder") {
      currentFlagship = document.createElement("section");
      currentFlagship.className = "a0-current-flagship";
      currentFlagship.setAttribute("aria-label", "Current Flagship · Edelweiß");
      const [href, label, description, accent, status] = builderCurrentFlagship;
      const card = document.createElement("a");
      card.className = `a0-showcase-card a0-showcase-card--${accent}`;
      card.href = href;
      card.innerHTML = `<span class="a0-showcase-art" aria-hidden="true"></span><span class="a0-showcase-copy"><small>${status}</small><strong>${label} <span aria-hidden="true">↗</span></strong><span>${description}</span></span>`;
      if (targetFile(href) === file) card.setAttribute("aria-current", "page");
      currentFlagship.append(card);

      constellation = document.createElement("section");
      constellation.className = "a0-flagship-constellation";
      constellation.setAttribute("aria-label", "Flagship Constellation");
      constellation.innerHTML = '<h3>Acht Hauptmodule</h3><p>Sechs eingefrorene Hauptzugänge plus Edelweiß und das neue NLK Flagship-Instrument. Rollen bleiben getrennt.</p>';
      builderFlagshipConstellation.forEach(([route, name, copy, role, status]) => {
        const link = document.createElement("a");
        link.className = `a0-constellation-card a0-constellation-card--${role}`;
        link.href = route;
        link.innerHTML = `<small>${status}</small><strong>${name}</strong><span>${copy}</span>`;
        if (targetFile(route) === file) link.setAttribute("aria-current", "page");
        constellation.append(link);
      });
    }
    const reading = document.createElement("section");
    reading.className = "a0-reader-reading";
    reading.innerHTML = '<h3>Verstehen & vertiefen</h3><p>Lesepfade, Theorie und Hintergründe</p>';
    reading.append(grid);
    if (lane.key === "builder") layout.append(showcase, currentFlagship, constellation, reading);
    else layout.append(showcase, reading);
    panel.append(layout);
    group.append(summary, panel);
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      laneNav.querySelectorAll("details[open]").forEach((other) => { if (other !== group) other.open = false; });
    });
    laneNav.append(group);
  });
  const workbenchEntry = document.createElement("details");
  workbenchEntry.className = "a0-workbench-entry";
  const workbenchSummary = document.createElement("summary");
  workbenchSummary.innerHTML = '<svg class="a0-machina-mark" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="10.5" ry="13"/><ellipse cx="16" cy="16" rx="5.5" ry="13"/><path d="M16 3v26"/></svg><strong>THE MACHINA</strong><i aria-hidden="true"></i>';
  workbenchSummary.setAttribute("aria-label", "THE MACHINA · Räume und Werkbank öffnen");
  const machinaRooms = [
    ["A0_WERKBANK.html#bench-page-top", "WERKBANK · START", "Hausübersicht, Produktionskette und Bestand"],
    ["A0_MACHINA_COCKPIT.html#benchFoyer", "01 · VIEWER", "Maschinenkörper, GLBs und source-bound Fenster"],
    ["A0_MACHINA_COCKPIT.html#machinaCockpitTitle", "02 · COCKPIT", "Rollen, Orientierung und Zustände"],
    ["A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf", "03 · PARTS SHELF", "Modelle, Bauteile und Adapter"],
    ["A0_ORIENTATION_CONTROLLER_BENCH.html#benchWorkDesk", "04 · FULL BENCH", "Verbinden, prüfen und Returns lesen"]
  ];
  const machinaMaps = [
    ["A0_MACHINA_ANATOMY_MAP.html#mainModules", "HAUPTMODULE · 8", "Große Eingangskarte vor der Anatomy-Linse"],
    ["A0_MACHINA_ANATOMY_MAP.html#anatomyMap", "ANATOMY · 7 ROLLEN", "Frame, Core, Body, Routing, Tract, Channel und Boundary"],
    ["A0_BENCH_ENTDECKEN.html#flagships", "FLAGSHIP OVERVIEW", "Räume, Labs und Demonstratoren nach Rolle"],
    ["A0_BUILDER_TOY_STORE.html#instrument-atlas", "INSTRUMENT ATLAS", "Vollständiger Bestand unterhalb der Hauptmodule"]
  ];
  const machinaMenu = document.createElement("div");
  machinaMenu.className = "a0-machina-menu";
  machinaMenu.setAttribute("role", "navigation");
  machinaMenu.setAttribute("aria-label", "THE MACHINA Räume, Hauptmodule und Karten");
  const appendMachinaGroup = (label, copy, items, className) => {
    const group = document.createElement("section");
    group.className = `a0-machina-menu-group ${className}`;
    group.innerHTML = `<header><b>${label}</b><span>${copy}</span></header>`;
    const links = document.createElement("nav");
    items.forEach((item) => links.append(makeReaderLink(item)));
    group.append(links);
    machinaMenu.append(group);
  };
  appendMachinaGroup("RÄUME & WORK", "Ein Host · getrennte Aufgaben", machinaRooms, "is-rooms");
  appendMachinaGroup("8 HAUPTMODULE", "6 eingefroren · + Edelweiß · + NLK", machinaMainModules.map(([href, label, role, copy]) => [href, `${role} · ${label}`, copy]), "is-modules");
  appendMachinaGroup("KARTEN & RETURN", "Orientieren, vertiefen, vollständig suchen", machinaMaps, "is-maps");
  workbenchEntry.append(workbenchSummary, machinaMenu);
  const workbenchFiles = new Set([
    "A0_WERKBANK.html", "A0_MACHINA_COCKPIT.html", "A0_ORIENTATION_CONTROLLER_BENCH.html",
    "A0_BENCH_ENTDECKEN.html", "A0_BENCH_MODULES.html", "A0_BENCH_ARBEITEN.html", "A0_BENCH_QUELLEN.html",
    "A0_TESSAREC_BLUE_BODY_LAB.html", "A0_PINK_DIAMOND_GRID_ATLAS.html",
    "A0_BLUE_PINK_DODECA_CELL_RETURN.html", "A0_TOWER_RETURN_DEMONSTRATOR.html",
    "A0_IOTA_BRIDGE_DEMONSTRATOR.html", "A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html",
    "A0_LANTERN_PANEL_V_CONTROL_LENS.html", "A0_ROOTROOM_CODON_ORIENTATION_RETURN.html", "A0_SPIN_TO_BLOOM_MEASUREMENT.html",
    "A0_BREATHING_CRYSTAL_APERTURE.html", "A0_NLK_LSHELL_DEVELOPMENT_PROBE.html", "A0_MACHINA_ANATOMY_MAP.html"
  ]);
  if (workbenchFiles.has(file)) workbenchEntry.dataset.current = "true";
  workbenchEntry.addEventListener("toggle", () => {
    if (!workbenchEntry.open) return;
    laneNav.querySelectorAll("details[open]").forEach((other) => { if (other !== workbenchEntry) other.open = false; });
  });
  laneNav.append(workbenchEntry);
  const registerEntry = document.createElement("a");
  registerEntry.className = "a0-register-entry";
  registerEntry.href = "A0_DATA_AND_REGISTERS.html#top";
  registerEntry.innerHTML = "<strong>A0 · NSNavigator</strong>";
  registerEntry.setAttribute("aria-label", "A0 NSNavigator · Quellen, Relationen, Register und autoritative Rückwege öffnen");
  if (file === "A0_DATA_AND_REGISTERS.html") registerEntry.setAttribute("aria-current", "page");
  laneNav.append(registerEntry);
  const publicChannels = document.createElement("span");
  publicChannels.className = "a0-public-channels";
  publicChannels.setAttribute("aria-label", "Öffentliche NEXAH Channels");
  const nexahedronPublic = document.createElement("a");
  nexahedronPublic.href = "https://nexahedron.com/";
  nexahedronPublic.target = "_blank";
  nexahedronPublic.rel = "noopener noreferrer";
  nexahedronPublic.textContent = "nexahedron ↗";
  const nexahPublic = document.createElement("a");
  nexahPublic.href = "https://nexah.de/";
  nexahPublic.target = "_blank";
  nexahPublic.rel = "noopener noreferrer";
  nexahPublic.textContent = "nexah.de ↗";
  const scarabaeusPublic = document.createElement("a");
  scarabaeusPublic.href = "https://www.scarabaeus1033.net/";
  scarabaeusPublic.target = "_blank";
  scarabaeusPublic.rel = "noopener noreferrer";
  scarabaeusPublic.textContent = "scarabæus1033 ↗";
  publicChannels.append(nexahedronPublic, nexahPublic, scarabaeusPublic);
  laneNav.append(publicChannels);
  const overview = document.createElement("details");
  overview.className = "a0-page-menu a0-overview-menu";
  overview.id = "a0-navigator";
  const overviewSummary = document.createElement("summary");
  overviewSummary.textContent = "A0 Navigator";
  overviewSummary.setAttribute("aria-label", "A0 Navigator · Bereiche, Karten und Seiteninhalt");
  const overviewBody = document.createElement("div");
  overviewBody.className = "a0-page-menu-body a0-overview-body";
  const actions = {book:"Lesen",map:"Zusammenhänge verstehen",workshops:"Werkzeuge nutzen",desk:"Ergebnisse einordnen"};
  const currentWays = document.createElement("section");
  currentWays.className = "a0-overview-current";
  currentWays.innerHTML = '<header><div><small>A0 NAVIGATOR · FÜNF EINSTIEGE</small><h3>Fünf Eingänge. Ein Werk.</h3></div><p>Wähle den Blick, der zu deiner Frage passt. Die Family Connection Map bleibt als technische Karte getrennt und zeigt Quellen, Joints, Adapter, Ansichten und Return.</p></header><nav aria-label="Fünf A0-Einstiege">'+overviewWays.map(way => '<a href="'+way.href+'" style="--way-accent:'+way.accent+'"'+(targetFile(way.href)===file?' aria-current="page"':'')+'><small>'+way.code+'</small><strong>'+way.title+'</strong><span>'+way.copy+'</span><em>'+(targetFile(way.href)===file?'DU BIST HIER':'ÖFFNEN ↗')+'</em></a>').join('')+'</nav>';
  overviewBody.innerHTML = '<section class="a0-overview-actions"><h3>Was möchtest du tun?</h3>'+navigationGroups.map(group => '<a href="'+group.entry+'"><strong>'+actions[group.key]+'</strong><span>'+group.title+'</span></a>').join('')+'</section><details class="a0-overview-cluster" open><summary><span>Orientieren &amp; vollständig suchen</span><small>Häuser, Touren, Karten, Families und alle A0-Seiten</small></summary><div><a href="index.html?projection=builder-showcase">A0 Builder Home</a><a href="A0_WERKBANK.html#bench-page-top">Werkbank · Start</a><a href="A0_BENCH_ENTDECKEN.html#bench-page-top">Entdecken · Tour</a><a href="A0_LIVING_BLUEPRINT.html">Living Blueprint · Tour</a><a href="A0_BENCH_ENTDECKEN.html#body-exhibition">Workbench Map</a><a href="A0_LIVING_BLUEPRINT.html#a0-map-home">Family Connection Map</a><a href="index.html#a0-navigation-directory">Alle A0-Seiten nach Themen</a><a href="A0_FAMILY_CONNECTION_ATLAS.html">F1–F7 · funktionale Families</a><a href="NEXAH_C_CONNECT.html">C · Connect</a></div></details>';
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
  const scarabaeusA0Href = "A0_BUILDER_TOY_STORE.html?edition=scarabaeus";
  // NEXAH owns its routes. A0 embeds the stable Staging root and never maps
  // individual public pages into a second A0 route tree.
  const ownerFrameParams = new URLSearchParams(location.search);
  const requestedNexahOrigin = ownerFrameParams.get("nexah-origin");
  const nexahStagingHref = (() => {
    if (!requestedNexahOrigin) return "http://127.0.0.1:4322/#top";
    try {
      const candidate = new URL(requestedNexahOrigin);
      const allowedPorts = new Set(["4321", "4322", "4325", "4326"]);
      return candidate.protocol === "http:" && candidate.hostname === "127.0.0.1" && allowedPorts.has(candidate.port)
        ? `${candidate.origin}/#top`
        : "http://127.0.0.1:4322/#top";
    } catch {
      return "http://127.0.0.1:4322/#top";
    }
  })();
  const requestedNexahPath = ownerFrameParams.get("nexah-path");
  const nexahProjectionHref = (() => {
    if (!requestedNexahPath) return nexahStagingHref;
    try {
      const stagingOrigin = new URL(nexahStagingHref).origin;
      const requested = new URL(requestedNexahPath, stagingOrigin);
      return requested.origin === stagingOrigin ? requested.href : nexahStagingHref;
    } catch {
      return nexahStagingHref;
    }
  })();
  const workspaceOverview = document.createElement("nav");
  workspaceOverview.className = "a0-workspace-overviews";
  workspaceOverview.setAttribute("aria-label", "Arbeitsübersichten");
  let scienceDeskLink = null;
  let builderDeskLink = null;
  let missionControlLink = null;
  if (localOwnerContext) {
    scienceDeskLink = document.createElement("a");
    scienceDeskLink.className = "a0-workspace-icon a0-science-desk-link";
    scienceDeskLink.href = "A0_RESEARCH_DESK.html?desk=research&rev=currentness-r3-20261031#top";
    scienceDeskLink.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="3"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5M7 7l4 4M21 21l4 4M25 7l-4 4M11 21l-4 4"/></svg><span class="a0-workspace-label">Science Desk</span>';
    scienceDeskLink.setAttribute("aria-label", "Science Desk · Status, Methoden, Daten, Register und Evidenz");
    scienceDeskLink.title = "Science Desk · Daten & Register";
    builderDeskLink = document.createElement("a");
    builderDeskLink.className = "a0-workspace-icon a0-builder-desk-link";
    builderDeskLink.href = builderDeskHref;
    builderDeskLink.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="4" r="2.2"/><path d="M16 7c-4.2 0-6.5 3.2-6.5 7.7V20c0 4.5 2.3 7 6.5 9 4.2-2 6.5-4.5 6.5-9v-5.3C22.5 10.2 20.2 7 16 7Z"/><path d="M10 11C5.8 8.7 2.7 11 3.5 15.2c.7 3.6 3.1 5.8 6 6.2M22 11c4.2-2.3 7.3 0 6.5 4.2-.7 3.6-3.1 5.8-6 6.2M10 15H5M22 15h5M10 20l-5 3M22 20l5 3"/></svg><span class="a0-workspace-label">Builder Desk</span>';
    builderDeskLink.setAttribute("aria-label", "Builder Desk · Werkbank, Flagship Labs und Werkzeuge");
    builderDeskLink.title = "Builder Desk · Werkbank";
    workspaceOverview.append(scienceDeskLink, builderDeskLink);
    missionControlLink = document.createElement("a");
    missionControlLink.className = "a0-workspace-icon a0-mission-control-link";
    missionControlLink.href = missionControlHref;
    missionControlLink.innerHTML = '<span class="a0-workspace-monogram" aria-hidden="true">A0</span><span class="a0-workspace-label">Control Register</span>';
    missionControlLink.setAttribute("aria-label", "A0 Control Register · Quellen, Relationen und Rückwege");
    missionControlLink.title = "A0 Control Register";
    workspaceOverview.append(missionControlLink);
  }
  header.replaceChildren(brand, laneNav, workspaceOverview, overview);
  header.className = "top a0-context-ready a0-context-compact";
  header.dataset.a0Lane = currentLane?.key || "portal";
  header.dataset.a0Context = "ready";
  const syncContextHeaderHeight = () => {
    if (typeof header.getBoundingClientRect !== "function") return;
    const height = Math.ceil(header.getBoundingClientRect().height);
    if (height > 0) document.documentElement?.style?.setProperty("--a0-context-header-height", `${height}px`);
  };
  syncContextHeaderHeight();
  if (typeof window.ResizeObserver === "function") new window.ResizeObserver(syncContextHeaderHeight).observe(header);
  else window.addEventListener("resize", syncContextHeaderHeight);
  if (document.body) {
    const siteProjections = [];
    const siteProjectionTriggers = [];
    const requestedProjection = new URLSearchParams(location.search).get("projection");
    const setProjectedLane = (laneKey = "") => {
      laneNav.querySelectorAll(".a0-reader-lane").forEach((group) => {
        if (group.dataset.current === "true") {
          if (laneKey) group.dataset.projectionObscured = "true";
          else delete group.dataset.projectionObscured;
        }
        if (group.dataset.lane === laneKey) group.dataset.projectionCurrent = "true";
        else delete group.dataset.projectionCurrent;
      });
      if (laneKey) header.dataset.a0ProjectedLane = laneKey;
      else delete header.dataset.a0ProjectedLane;
      // A projection temporarily owns the visible context. Preserve the
      // underlying THE MACHINA return state without showing two active pills.
      if (laneKey && workbenchEntry.getAttribute("aria-current") === "page") {
        workbenchEntry.dataset.a0ReturnCurrent = "page";
        workbenchEntry.removeAttribute("aria-current");
      } else if (!laneKey && workbenchEntry.dataset.a0ReturnCurrent === "page") {
        workbenchEntry.setAttribute("aria-current", "page");
        delete workbenchEntry.dataset.a0ReturnCurrent;
      }
    };
    const mountSiteProjection = ({ href, label, title, triggers, route, lane, refreshOnOpen = false, returnMessage = "" }) => {
      const projection = document.createElement("section");
      projection.className = "a0-site-projection";
      projection.hidden = true;
      projection.setAttribute("aria-label", label);
      const projectionBar = document.createElement("header");
      projectionBar.className = "a0-site-projection-bar";
      projectionBar.innerHTML = `<div><span><a class="a0-site-projection-home" href="index.html#top">NEXAH A0</a><small> · HAUSANSICHT</small></span><strong>${label}</strong></div>`;
      const projectionClose = document.createElement("button");
      projectionClose.type = "button";
      projectionClose.textContent = "A0 zurück";
      projectionClose.setAttribute("aria-label", `${label} schließen und zu A0 zurückkehren`);
      projectionBar.append(projectionClose);
      const projectionFrame = document.createElement("iframe");
      projectionFrame.className = "a0-site-projection-frame";
      projectionFrame.title = title;
      projectionFrame.setAttribute("loading", "eager");
      projection.append(projectionBar, projectionFrame);
      document.body.append(projection);
      let activeTrigger = null;
      const placeProjection = () => {
        const bottom = header.getBoundingClientRect?.().bottom || 64;
        projection.style.top = `${Math.max(0, Math.ceil(bottom))}px`;
      };
      const closeProjection = () => {
        projection.hidden = true;
        setProjectedLane();
        activeTrigger?.removeAttribute("aria-current");
        activeTrigger?.focus?.();
        activeTrigger = null;
      };
      const showProjection = (trigger = null) => {
        if (document.documentElement?.dataset?.nexahedronProjection) return;
        const owningLane = trigger?.parentNode?.className?.includes?.("a0-reader-lane") ? trigger.parentNode : null;
        siteProjections.forEach((other) => { if (other !== projection) other.hidden = true; });
        siteProjectionTriggers.forEach((other) => other?.removeAttribute("aria-current"));
        if (owningLane) owningLane.open = false;
        activeTrigger = trigger;
        const projectionHref = refreshOnOpen
          ? (() => {
              const currentHref = new URL(href, location.href);
              currentHref.searchParams.set("a0_preview", String(Date.now()));
              return currentHref.href;
            })()
          : href;
        if (projectionFrame.getAttribute("src") !== projectionHref) projectionFrame.setAttribute("src", projectionHref);
        placeProjection();
        projection.hidden = false;
        setProjectedLane(lane);
        activeTrigger?.setAttribute("aria-current", "page");
        projectionClose.focus?.();
      };
      const openProjection = (event) => {
        event.preventDefault();
        const owningLane = event.currentTarget?.parentNode?.className?.includes?.("a0-reader-lane") ? event.currentTarget.parentNode : null;
        if (!projection.hidden && owningLane?.dataset?.lane === lane) {
          closeProjection();
          owningLane.open = true;
          return;
        }
        showProjection(event.currentTarget);
      };
      siteProjections.push(projection);
      siteProjectionTriggers.push(...triggers);
      triggers.forEach((trigger) => trigger?.addEventListener("click", openProjection));
      projectionClose.addEventListener("click", closeProjection);
      if (returnMessage) {
        window.addEventListener("message", (event) => {
          if (event.origin !== new URL(href, location.href).origin || event.source !== projectionFrame.contentWindow) return;
          if (event.data?.type === returnMessage) closeProjection();
        });
      }
      if (route === "nexah-science") {
        const projectionOrigin = new URL(href, location.href).origin;
        window.addEventListener("message", (event) => {
          if (event.origin !== projectionOrigin || event.source !== projectionFrame.contentWindow) return;
          if (event.data?.type !== "nexah:owner-route" || typeof event.data.path !== "string") return;
          let next;
          try { next = new URL(event.data.path, projectionOrigin); } catch { return; }
          if (next.origin !== projectionOrigin) return;
          const ownerUrl = new URL(location.href);
          const framedPath = `${next.pathname}${next.search}${next.hash}`;
          if (ownerUrl.searchParams.get("nexah-path") === framedPath) return;
          ownerUrl.searchParams.set("nexah-path", framedPath);
          history.replaceState(history.state, "", ownerUrl);
        });
      }
      window.addEventListener("resize", () => { if (!projection.hidden) placeProjection(); });
      window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !projection.hidden) closeProjection(); });
      if (route && requestedProjection === route) showProjection();
      return projection;
    };

    const nexahedronEntries = [...document.querySelectorAll?.("[data-a0-nexahedron]") || []];
    nexahedronEntries.forEach((entry) => entry.setAttribute("href", nexahedronHref));
    [...document.querySelectorAll?.("[data-a0-nexahedron-preview]") || []]
      .forEach((preview) => preview.setAttribute("src", nexahedronHref));
    mountSiteProjection({
      href: nexahedronHref,
      label: "NEXAHEDRON · HUMAN VIEW",
      title: localOwnerContext ? "NEXAHEDRON · aktuelle Staging-Ansicht unter NEXAH A0" : "NEXAHEDRON · Human View unter NEXAH A0",
      triggers: nexahedronEntries,
      route: "nexahedron",
      lane: "human",
      refreshOnOpen: localOwnerContext,
      returnMessage: "nexah:a0-projection-return"
    });

    if (localOwnerContext) {
      const localNexahEntries = [...document.querySelectorAll?.("[data-a0-nexah-stage]") || []];
      localNexahEntries.forEach((entry) => entry.setAttribute("href", nexahStagingHref));
      [...document.querySelectorAll?.("[data-a0-nexah-stage-preview]") || []]
        .forEach((preview) => preview.setAttribute("src", nexahStagingHref));
      const localBuilderEntries = [...document.querySelectorAll?.("[data-a0-builder-showcase]") || []];
      mountSiteProjection({
        href: builderShowcaseHref,
        label: "A0 BUILDER HOME · SHOWCASE",
        title: "A0 Builder Home · vollständige Werkbank",
        triggers: localBuilderEntries,
        route: "builder-showcase",
        lane: "builder"
      });
      mountSiteProjection({
        href: builderDeskHref,
        label: "BUILDER DESK · CURRENTNESS / RETURNS",
        title: "A0 Builder Desk · Currentness, Chronik und Returns",
        triggers: [builderDeskLink],
        route: "builder-desk",
        lane: "builder"
      });
      mountSiteProjection({
        href: missionControlHref,
        label: "A0 CONTROL REGISTER",
        title: "A0 Control Register · Quellen und Rückwege",
        triggers: [missionControlLink],
        route: "mission-control"
      });
      const localScarabEntries = [...document.querySelectorAll?.("[data-a0-scarabaeus]") || []];
      localScarabEntries.forEach((entry) => entry.setAttribute("href", scarabaeusA0Href));
      [...document.querySelectorAll?.("[data-a0-scarabaeus-preview]") || []]
        .forEach((preview) => preview.setAttribute("src", scarabaeusA0Href));
      mountSiteProjection({
        href: nexahProjectionHref,
        label: "NEXAH SCIENCE · STAGING / OWNER-ABNAHME",
        title: "NEXAH Science · aktueller nexah.de Stagingstand",
        triggers: localNexahEntries,
        route: "nexah-science"
      });
    }
  }
  // A return banner is useful only when a crosswalk context was supplied.
  if (file === "A0_LIVING_BLUEPRINT.html" && ![...new URLSearchParams(location.search).keys()].some(key => key.startsWith("hc_"))) {
    const returnBanner = document.getElementById("humanCrosswalkReturn");
    if (returnBanner) returnBanner.hidden = true;
  }
  header.dataset.a0Lane = currentLane?.key || "portal";
  document.addEventListener("click", (event) => {
    if (event.target.closest(".a0-reader-lane, .a0-page-menu")) return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
})();
