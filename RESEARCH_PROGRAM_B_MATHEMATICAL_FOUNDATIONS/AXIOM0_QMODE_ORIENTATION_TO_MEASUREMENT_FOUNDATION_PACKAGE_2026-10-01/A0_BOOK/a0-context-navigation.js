(() => {
  const header = document.querySelector("header.top, header.topbar");
  const sourceNav = header?.querySelector("nav");
  if (!header || !sourceNav || header.dataset.a0Context === "ready") return;

  const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const title = document.title.replace(/^NEXAH\s*[·—-]\s*/i, "").replace(/^A0\s*[·—-]\s*/i, "").trim();
  const quietEntry = file === "A0_NEXAH_APERTURE_JOURNEY.html";

  /* One inventory, three reading intentions. Navigation does not change identity or evidence state. */
  const readerLanes = [
    {
      key: "human", code: "H", label: "Human", description: "Fragen, Bilder und Erfahrung",
      entry: "A0_NEXAH_APERTURE_JOURNEY.html#human-view",
      sections: [
        { label: "Beginnen", items: [
          ["A0_NEXAH_APERTURE_JOURNEY.html", "Aperture Journey", "Geführter Lesepfad"],
          ["A0_LIVING_BLUEPRINT.html", "Living Blueprint", "Orientierungskarte"]
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
          ["A0_SCIENCE.html", "A0 Science", "Ruhiger wissenschaftlicher Einstieg"],
          ["index.html", "A0 Fundamentals", "Buch und Kapitelübersicht"],
          ["A0_NEXAH_RESEARCH_METHOD.html", "Research Method", "Geführter Prüf- und Vergleichsweg"],
          ["A0_METHOD.html", "About / Method", "Vertiefende Methodenkarte"],
          ["LAB_ORIENTATION_MACHINE.html", "Orientation Machine", "Interaktive Orientierung"]
        ]},
        { label: "Kapitel 01–08", compact: true, items: [
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
          ["A0_RESEARCH_DESK.html#log", "Research Log", "Chronologie und Returns"]
        ]},
        { label: "Papers", compact: true, items: [
          ["A0_SCC_003_PASCAL_PENTAGON_PAPER.html", "Paper A · SCC-003", ""],
          ["A0_RETURN_WITHOUT_IDENTITY_PAPER.html", "Paper C · Return", ""],
          ["A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html", "Paper E · Family Method", ""],
          ["A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html", "Paper F · Tessarec", ""]
        ]},
        { label: "Authority & Currentness · Arbeitsfläche", items: [
          ["A0_RESEARCH_DESK.html", "Science Desk", "A0-Autorität, Arbeitsstand und nächste Gates"],
          ["A0_SCIENTIFIC_POSITION_REPORT.html", "Scientific Position", "Wo NEXAH wissenschaftlich steht"],
          ["A0_ORIENTATION_CONTROLLER_BENCH.html", "Orientation Controller Bench", "Apertur, Projektion, Zustand und Return"]
        ]}
      ]
    },
    {
      key: "builder", code: "B", label: "Builder", description: "Tools, Neuerungen und Anwendungen", entry: "../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html",
      sections: [
        { label: "Start & Atlanten", items: [
          ["../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html", "Builder Startseite", "Was ist neu? Was kann ich nutzen? Wo ist es eingebaut?"],
          ["A0_RESEARCH_DESK.html#builder", "Builder · Tools & Anwendungen", "Bewertete Toolbox, Neuerungen und Einbauorte"],
          ["A0_BUILDER_TOY_STORE.html", "Builder Toy Store", "Werkzeug-Einstieg"],
          ["A0_MATHEMATICAL_JOINTS.html", "Mathematical Joints", "Mathematikwerkstatt"],
          ["A0_FIELDS_AND_JOINTS_ATLAS.html", "Fields & Joints", "Atlas"],
          ["A0_FAMILY_CONNECTION_ATLAS.html", "Family Atlas", "Synchrone Ansichten"]
        ]},
        { label: "Indizes", compact: true, items: [
          ["A0_VISUAL_FIELD_LIBRARY.html", "Visual Field Library", "Visuelle Quellen"],
          ["A0_ASSET_INDEX.html", "Asset Index", "Vollständiges Repository-Inventar"]
        ]},
        { label: "Operatoren & Joints", compact: true, items: [
          ["A0_ORIENTATION_CONTROLLER_BENCH.html", "Orientation Controller", ""],
          ["A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html", "Pascal / Pentagon", ""],
          ["A0_PASCAL_GENERATION_CORNER.html", "Generation Corner", ""],
          ["A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html", "Q4 Joint Audit", ""],
          ["A0_BOUNDARY_GRAPH_DEMONSTRATOR.html", "Boundary Graph", ""],
          ["A0_JOINT_APPLICATION_DEMONSTRATOR.html", "Joint Applications", ""],
          ["A0_JARP_CROSS_LENS_EXTENSION.html", "JARP Cross-Lens", ""],
          ["A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html", "Ihara / Hashimoto", ""]
        ]},
        { label: "Blue Body & Carrier", compact: true, items: [
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

  const flatItems = (lane) => lane.items || lane.sections.flatMap((section) => section.items);
  const targetFile = (href) => decodeURIComponent(href.split("#")[0].split("/").pop() || "");
  const currentLane = readerLanes.find((lane) => flatItems(lane).some(([href]) => targetFile(href) === file)) || readerLanes[1];
  const originalLinks = [...sourceNav.querySelectorAll(":scope > a")];
  const localLinks = originalLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  const contextualLinks = originalLinks.filter((link) => !(link.getAttribute("href") || "").startsWith("#"));

  const brand = header.querySelector(".brand") || document.createElement("a");
  brand.className = "brand a0-brand";
  brand.href = "A0_NEXAH_APERTURE_JOURNEY.html#human-view";
  brand.textContent = "NEXAH";
  brand.setAttribute("aria-label", "NEXAH Reader Start");

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
      const list = document.createElement("section");
      list.className = section.compact ? "a0-reader-section is-compact" : "a0-reader-section";
      list.innerHTML = `<h3>${section.label}</h3>`;
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
  });

  const pageContext = document.createElement("div");
  pageContext.className = "a0-page-context";
  pageContext.innerHTML = `<span>${currentLane.label} Reader</span><strong>${title || file}</strong>`;

  const quickNav = document.createElement("nav");
  quickNav.className = "a0-quick-nav";
  quickNav.setAttribute("aria-label", "Schnellzugänge");
  quickNav.innerHTML = '<a href="A0_RESEARCH_DESK.html"><span>S</span><strong>Science Desk</strong></a><a href="A0_RESEARCH_DESK.html#achievements-reader"><span>A</span><strong>Achievements</strong></a><a href="A0_ASSET_INDEX.html"><span>I</span><strong>Index</strong></a>';

  const pageTools = document.createElement("div");
  pageTools.className = "a0-page-tools";
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
  document.addEventListener("click", (event) => {
    if (event.target.closest(".a0-reader-lane, .a0-page-menu")) return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    header.querySelectorAll("details[open]").forEach((details) => { details.open = false; });
  });
})();
