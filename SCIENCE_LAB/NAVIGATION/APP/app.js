(() => {
  "use strict";

  const manifest = window.NEXAH_NAVIGATOR_MANIFEST;
  const lineage = window.NEXAH_LINEAGE_BINDER;
  const utg = window.NEXAH_UTG_BINDER;
  const admission = window.NEXAH_NAVIGATOR_ADMISSION || { rejected: [], reason_summary: {} };
  const release = window.NEXAH_NAVIGATOR_RELEASE || { publication_authorized: false, public_entity_count: 0, release_state: "unknown" };
  const app = document.querySelector("#app");
  const familyNav = document.querySelector("#family-nav");
  const boundaryNode = document.querySelector("#context-boundary");
  const selectionNode = document.querySelector("#context-selection");
  const receiptNode = document.querySelector("#context-receipt");

  const FAMILY_NAMES = {
    "CF:F1": "Observation / Record",
    "CF:F2": "Address / Boundary",
    "CF:F3": "Transition / Operator",
    "CF:F4": "Phase / Drift",
    "CF:F5": "Connectivity / Topology",
    "CF:F6": "Synchronization / Control",
    "CF:F7": "Validation / Governance"
  };
  const HTML_SHELF_NAMES = {
    "HL:F1": "Observation / Selection / Cut / Record / Return",
    "HL:F2": "Projection / Shadow / Mask / Visibility",
    "HL:F3": "Carrier / Address / Grid / CRT",
    "HL:F4": "Frame / Tessarec / Root Space / Green Bridge",
    "HL:F5": "Time / Phase / Rhythm / Five-H",
    "HL:F6": "Number / Prime / Euler / Fibonacci / Mirror",
    "HL:F7": "Runtime / Receipts / Comparison Infrastructure",
    "HL:F8": "Human Instruments / Games / Cultural Orientation"
  };
  const FUNCTIONAL_NAMES = {
    "MOD:ERITH_DUAL_BELT": "Inside / Outside dual-belt interface",
    "MOD:TESSAREC": "Discrete sign-carrier envelope",
    "MOD:E8_COXETER": "Finite root, orbit and exact return",
    "MOD:TRANSVERSUM_TWO_CUT": "Two-cut comparison and residual return",
    "MOD:NUMBER_VIEW_SUITE": "Number and representation test suite"
  };

  const TYPE_ORDER = { module: 0, surface: 1, evidence: 2 };
  const state = { query: "", types: new Set(), families: new Set(), roles: new Set(), filtersOpen: true };

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const slug = (value) => encodeURIComponent(String(value ?? ""));
  const entityHref = (id) => `#entity=${slug(id)}`;
  const familyHref = (id) => `#family=${slug(id)}`;
  const list = (value) => Array.isArray(value) ? value : [];
  const unique = (values) => [...new Set(values.filter(Boolean))];
  const titleCase = (value) => String(value ?? "").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const trimText = (value, max = 190) => {
    const text = String(value ?? "");
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  };

  if (!manifest || !Array.isArray(manifest.entities) || !Array.isArray(manifest.relations)) {
    app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Validated manifest unavailable</h1><p>Rebuild <span class="mono">data.internal.js</span> and reload this page.</p></section>`;
    return;
  }

  const entities = [...manifest.entities].sort((a, b) =>
    (TYPE_ORDER[a.entity_type] ?? 9) - (TYPE_ORDER[b.entity_type] ?? 9) || a.title.localeCompare(b.title)
  );
  const relations = [...manifest.relations].sort((a, b) => a.relation_id.localeCompare(b.relation_id));
  const entityById = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const rejectionById = new Map(list(admission.rejected).map((item) => [item.entity_id, item.reasons]));
  const typeCounts = entities.reduce((acc, entity) => {
    acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1;
    return acc;
  }, {});
  const familyCounts = entities.reduce((acc, entity) => {
    list(entity.connection_family_ids).forEach((family) => { acc[family] = (acc[family] || 0) + 1; });
    return acc;
  }, {});

  function entityLabel(id) {
    const entity = entityById.get(id);
    return entity ? entity.title : id;
  }

  function functionalName(entity) {
    return FUNCTIONAL_NAMES[entity?.entity_id] || entity?.title || "Unknown object";
  }

  function renderTags(entity, includeStatus = false) {
    const tags = [
      `<span class="tag ${esc(entity.entity_type)}">${esc(entity.entity_type)}</span>`,
      ...list(entity.connection_family_ids).map((family) => `<span class="tag family">${esc(family.replace("CF:", ""))}</span>`)
    ];
    if (includeStatus) tags.push(`<span class="tag">${esc(entity.status)}</span>`);
    return tags.join("");
  }

  function renderEntityCard(entity) {
    const assessment = entity.attributes?.assessment;
    const directHref = entity.entity_type === "surface" ? safeLocalHref(entity.internal?.local_path) : "";
    const context = assessment
      ? `${titleCase(assessment.content_role)} · ${titleCase(assessment.representation_role)}`
      : titleCase(entity.attributes?.kind || entity.entity_type);
    return `
      <article class="entity-card">
        <span>
          <span class="idline">${esc(entity.entity_id)}</span>
          <h2><a class="card-title-link" href="${entityHref(entity.entity_id)}">${esc(entity.title)}</a></h2>
          <p>${esc(trimText(entity.summary))}</p>
          <span class="tag-row">${renderTags(entity)}</span>
        </span>
        <span class="entity-card-meta">
          <span class="status-dot ${esc(entity.status)}">${esc(entity.status)}</span>
          <span class="idline">${esc(context)}</span>
          <span class="entity-card-actions">
            ${directHref ? `<a class="mini-action primary" href="${directHref}">Open HTML ↗</a>` : ""}
            <a class="mini-action" href="${entityHref(entity.entity_id)}">Inspect →</a>
          </span>
        </span>
      </article>`;
  }

  function relationCard(relation, compact = false) {
    const source = entityById.get(relation.source_id);
    const target = entityById.get(relation.target_id);
    return `
      <article class="relation-item ${compact ? "compact-relations" : ""}">
        <div class="relation-path">
          <a class="relation-node" href="${entityHref(relation.source_id)}">
            <span class="idline">${esc(relation.source_id)}</span>
            <strong>${esc(source?.title || relation.source_id)}</strong>
          </a>
          <div class="relation-type"><a href="#relation=${slug(relation.relation_id)}">${esc(titleCase(relation.relation_type))}</a><br><span aria-hidden="true">→</span></div>
          <a class="relation-node" href="${entityHref(relation.target_id)}">
            <span class="idline">${esc(relation.target_id)}</span>
            <strong>${esc(target?.title || relation.target_id)}</strong>
          </a>
        </div>
        <p class="relation-explanation">${esc(relation.explanation)}</p>
        <p class="relation-boundary"><strong>Does not imply:</strong> ${esc(list(relation.does_not_imply).join(" · ") || relation.claim_boundary)}</p>
      </article>`;
  }

  function pageHeader(eyebrow, title, copy, trailing = "") {
    return `<header class="page-header"><div class="page-header-row"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1></div>${trailing}</div><p>${esc(copy)}</p></header>`;
  }

  function renderHome() {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Internal orientation instrument</p>
        <h1>One structure.<br>Many bounded perspectives.</h1>
        <p class="lede">Unified Transition Geometry is the exploratory orientation roof. Navigate ${entities.length} curated modules, surfaces and evidence records without flattening their differences or promoting a shared vocabulary into a universal claim.</p>
      </section>
      <section class="metric-grid" aria-label="Manifest inventory">
        <div class="metric"><strong>${typeCounts.module || 0}</strong><span>modules</span></div>
        <div class="metric"><strong>${typeCounts.surface || 0}</strong><span>HTML / instrument surfaces</span></div>
        <div class="metric"><strong>${typeCounts.evidence || 0}</strong><span>evidence nodes</span></div>
        <div class="metric"><strong>${relations.length}</strong><span>typed, bounded relations</span></div>
      </section>
      ${renderEntryFamilyMap()}
      <section class="entrance-grid" aria-label="Three entrances">
        <a class="entrance-card" href="#utg">
          <span class="card-code">00 · FRAME</span>
          <span><strong>Enter through UTG</strong><p>Read the mission, perspective grammar, three maturity levels and registered media constellations.</p></span>
          <span class="card-action">Open framework roof →</span>
        </a>
        <a class="entrance-card" href="#atlas">
          <span class="card-code">01 · ORIENT</span>
          <span><strong>Browse the system</strong><p>Search the complete internal inventory and distinguish central instruments, supporting views and evidence.</p></span>
          <span class="card-action">Open clickable atlas →</span>
        </a>
        <a class="entrance-card" href="#relations">
          <span class="card-code">02 · CONNECT</span>
          <span><strong>Follow a relation</strong><p>Read why two entities connect, what the route preserves and what it cannot establish.</p></span>
          <span class="card-action">Follow typed paths →</span>
        </a>
        <a class="entrance-card" href="#evidence">
          <span class="card-code">03 · INSPECT</span>
          <span><strong>Audit the evidence</strong><p>Keep package-local verdicts next to their current interpretation and controlling records.</p></span>
          <span class="card-action">Open evidence inspector →</span>
        </a>
        <a class="entrance-card" href="#lineage">
          <span class="card-code">04 · TRACE</span>
          <span><strong>Follow the 2–3 / 8.8 lineage</strong><p>Place Prime Grid, Cathedral GLBs, PG88, bridges, Ghostgrid and Human Return in one bounded provenance view.</p></span>
          <span class="card-action">Open visual + GLB binder →</span>
        </a>
      </section>
      <header class="section-heading"><p class="eyebrow">Guided relation paths</p><h2>Start with a real connection</h2><p>Three bounded paths selected for the internal utility pass.</p></header>
      <section class="guided-grid" aria-label="Guided paths">
        <a class="family-card" href="#family=${slug("CF:F2")}"><span class="card-code">F2 · INSIDE / OUTSIDE</span><h2>Cut, frame, return</h2><p>Trace the shared family across Two-Cut, NEXAH ⇄ ERITH and Tessarec.</p></a>
        <a class="family-card" href="#relation=${slug("REL:EVIDENCE:Q7_TO_Q11")}"><span class="card-code">Q7 → Q11</span><h2>Tessarec expansion</h2><p>Follow the exact grammar and keep the missing empirical transfer visible.</p></a>
        <a class="family-card" href="${entityHref("ART:HTML:AD37946854D2")}"><span class="card-code">APPLICATION · SOLAR</span><h2>Q° Port / Conic Gate</h2><p>Inspect an application view together with its source receipt and claim ceiling.</p></a>
      </section>`;
    setContext({ object: "Orientation", boundary: manifest.authority_statement, receipt: receiptSummary() });
  }

  function renderEntryFamilyMap() {
    const canonical = Object.entries(FAMILY_NAMES).map(([family, name]) => `<a class="entry-family family-${esc(family.slice(-2).toLowerCase())}" href="${familyHref(family)}">
      <span>${esc(family.replace("CF:", ""))}</span><strong>${esc(name)}</strong><small>${familyCounts[family] || 0} registered objects</small>
    </a>`).join("");
    return `<section class="entry-map" aria-label="Interactive connection-family map">
      <header><div><p class="eyebrow">Interactive orientation map</p><h2>Framework above · families below</h2></div><p>Enter through one canonical relation family. The proposed axis extension and the historical cultural shelf remain visibly separate.</p></header>
      <div class="entry-map-grid">${canonical}
        <a class="entry-family candidate-family" href="#sequence"><span>CAND:F8</span><strong>Axis extension</strong><small>Owner hypothesis · open bridge</small></a>
        <a class="entry-family historical-family" href="#catalog"><span>HL:F8</span><strong>Human / cultural orientation</strong><small>Historical shelf · not CF:F8</small></a>
      </div>
      <footer><span>No canonical F8 or F9 is currently registered.</span><a href="#atlas">Open the full module atlas →</a></footer>
    </section>`;
  }

  function renderUTG() {
    if (!utg) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>UTG binder unavailable</h1><p>Rebuild <span class="mono">utg.internal.js</span> and reload this page.</p></section>`;
      return;
    }
    const visualHref = (visual) => safeLocalHref(visual.file);
    const shortHash = (hash) => hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : "not available";
    app.innerHTML = `${pageHeader("Exploratory framework · internal", utg.title, utg.tagline)}
      <section class="utg-mission panel">
        <p class="overline">Mission statement</p>
        <h2>Orientation through structured transitions</h2>
        <p>${esc(utg.mission_statement.en)}</p>
        <p class="utg-mission-de">${esc(utg.mission_statement.de)}</p>
        <div class="utg-actions"><a class="secondary-action" href="${safeLocalHref(utg.controlling_records?.mathematical_glossary)}">Open mathematical glossary →</a><a class="secondary-action" href="#lineage">Open visual + GLB lineage →</a><a class="secondary-action" href="#evidence">Inspect evidence →</a><a class="secondary-action" href="#admission">Check release boundary →</a></div>
      </section>

      ${renderEntryFamilyMap()}

      <header class="section-heading"><p class="eyebrow">Maturity ladder</p><h2>Framework is not validation</h2><p>Promotion occurs per object and domain. A higher level never transfers automatically to the framework as a whole.</p></header>
      <section class="utg-maturity">${list(utg.maturity_levels).map((level, index) => `<article class="${index === 0 ? "is-current" : ""}">
        <span class="idline">${esc(level.level_id)} · ${esc(level.state)}</span><h3>${esc(level.title)}</h3><p>${esc(level.definition)}</p>
        <div class="lineage-boundary"><strong>Entry</strong> ${esc(level.entry_rule)}</div><div class="lineage-boundary"><strong>Does not imply</strong> ${esc(level.does_not_imply)}</div>
      </article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Core sequence</p><h2>From field to reconstruction</h2></header>
      <section class="utg-sequence">${list(utg.core_sequence).map((step, index) => `<span><small>${String(index + 1).padStart(2, "0")}</small>${esc(step)}</span>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Canonical introduction</p><h2>Four received plates, four distinct roles</h2><p>Each plate is an unchanged, hashed copy. Together they form one framework constellation, not four independent confirmations.</p></header>
      <section class="lineage-gallery">${list(utg.visuals).map((visual) => `<article class="visual-card">
        <a class="visual-preview" href="${visualHref(visual)}"><img src="${visualHref(visual)}" alt="${esc(visual.title)}" loading="lazy"></a>
        <div class="visual-card-body"><span class="idline">${esc(visual.visual_id)} · ${esc(visual.role)}</span><h3>${esc(visual.title)}</h3>
          <p>${esc(list(visual.depicts).join(" · "))}</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(visual.claim_boundary)}</p>
          <div class="visual-receipt"><span>${esc(visual.dimensions)}</span><span class="mono">${esc(shortHash(visual.sha256))}</span><a href="${visualHref(visual)}">Open image ↗</a></div>
        </div></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Media constellation model</p><h2>Book · Navigator · 3D · equations · evidence</h2><p>A pairing records provenance and preserved relations. It does not erase medium-specific differences.</p></header>
      <section class="utg-constellations">${list(utg.media_constellations).map((item) => `<article>
        <span class="idline">${esc(item.constellation_id)} · ${esc(item.status)}</span><h3>${esc(item.title)}</h3>
        <div class="tag-row">${list(item.surfaces).map((surface) => `<span class="tag family">${esc(surface)}</span>`).join("")}</div>
        <p><strong>Preserves:</strong> ${esc(list(item.preserves).join(" · "))}</p><p><strong>Abstracts:</strong> ${esc(list(item.loses_or_abstracts).join(" · "))}</p>
        <p class="lineage-boundary"><strong>Boundary</strong> ${esc(item.claim_boundary)}</p>
      </article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">First formal audit</p><h2>Aperture is not automatically a transition gate</h2><p>The first concordance resolves vocabulary before testing an equation.</p></header>
      <section class="utg-formal-candidates">${list(utg.formal_candidates).map((candidate) => `<article>
        <span class="idline">${esc(candidate.candidate_id)} · ${esc(candidate.state)}</span><h3>${esc(candidate.title)}</h3><p>${esc(candidate.resolved_distinction)}</p>
        <div class="tag-row">${list(candidate.minimum_objects).map((item) => `<span class="tag family">${esc(item)}</span>`).join("")}</div>
        <p class="lineage-boundary"><strong>Blocked by</strong> ${esc(list(candidate.promotion_blockers).join(" · "))}</p>
        <a class="secondary-action" href="${safeLocalHref(candidate.record)}">Open concordance →</a>
      </article>`).join("")}</section>

      <section class="panel open-questions"><p class="overline">Open audit queue</p><h2>What still has to be recovered or tested</h2><ol>${list(utg.open_questions).map((question) => `<li>${esc(question)}</li>`).join("")}</ol></section>`;
    setContext({ object: "Unified Transition Geometry", boundary: utg.claim_boundary, receipt: `${utg.binder_id} · ${utg.maintained} · ${utg.visuals.length} visual hashes · ${utg.media_constellations.length} media constellations` });
  }

  function renderAtlas() {
    const modules = entities.filter((entity) => entity.entity_type === "module");
    const fullAtlas = entityById.get("ART:ATLAS:MAP_V2");
    const fullAtlasHref = safeLocalHref(fullAtlas?.internal?.local_path);
    const familyColumns = Object.entries(FAMILY_NAMES).map(([family, name]) => {
      const members = modules.filter((module) => list(module.connection_family_ids).includes(family));
      return `<section class="atlas-family family-${esc(family.slice(-2).toLowerCase())}">
        <a class="atlas-family-head" href="${familyHref(family)}"><span>${esc(family.replace("CF:", ""))}</span><strong>${esc(name)}</strong><small>${members.length} modules</small></a>
        <div class="atlas-nodes">${members.map((module) => {
          const masterId = module.attributes?.current_master_surface;
          const master = masterId ? entityById.get(masterId) : null;
          const masterHref = master ? safeLocalHref(master.internal?.local_path) : "";
          const edgeCount = entityRelations(module).length;
          return `<article class="atlas-node">
            <a class="atlas-node-title" href="${entityHref(module.entity_id)}"><span class="idline">${esc(module.entity_id)}</span><strong>${esc(module.title)}</strong></a>
            <div class="atlas-node-meta"><span>${edgeCount} typed edges</span>${masterHref ? `<a href="${masterHref}">Open master ↗</a>` : `<span>No master HTML</span>`}</div>
          </article>`;
        }).join("") || `<p class="muted">No module currently registered.</p>`}</div>
      </section>`;
    }).join("");

    app.innerHTML = `${pageHeader("Clickable system overview", "The connection atlas", "Begin with a family field, open a module, or launch its current master instrument. Repeated modules show where families overlap; repetition is not identity.", fullAtlasHref ? `<a class="instrument-action" href="${fullAtlasHref}">Open full Family Connection Map ↗</a>` : "")}
      <div class="atlas-toolbar"><a href="#sequence">Read the directed sequence →</a><a href="#catalog">Search all 140 objects →</a><a href="#relations">Inspect 14 typed edges →</a><a href="${entityHref("ART:ATLAS:MAP_V2")}">Inspect atlas source receipt →</a></div>
      <section class="system-map" aria-label="Seven clickable connection-family fields">${familyColumns}</section>`;
    setContext({ object: "Connection atlas", boundary: "The atlas shows registered family overlap and typed routes. Spatial proximity and repeated membership do not establish mechanism identity.", receipt: fullAtlas ? `${fullAtlas.entity_id} · ${fullAtlas.internal?.local_path}` : receiptSummary() });
  }

  function renderSequence() {
    const atlas = entityById.get("ART:ATLAS:MAP_V2");
    const atlasHref = safeLocalHref(atlas?.internal?.local_path);
    const anchor = (id) => atlasHref ? `${atlasHref}#${id}` : "#atlas";
    const carrierAuditHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/P6R01_PENTAGON_HEXAGON_RESIDUAL_GEOMETRY_AUDIT/12_FINAL_P6R01_DECISION.md");
    const sequenceStages = [
      {
        number: "01",
        role: "Envelope / observer frame",
        plain: "Bounded inside/outside views share a declared carrier and record.",
        native: "ERITH · Tessarec · Inside/Outside",
        status: "EXACT LOCAL DATA + METHOD BRIDGE",
        tone: "cyan",
        links: [
          ["Inside / Outside dual-belt interface", entityHref("MOD:ERITH_DUAL_BELT")],
          ["Discrete sign-carrier envelope", entityHref("MOD:TESSAREC")],
          ["Full Inside/Outside route", anchor("inside")]
        ],
        boundary: "Paired views do not add a dimension or make their carriers identical."
      },
      {
        number: "02",
        role: "Diagonal / root and residual",
        plain: "Finite root/orbit routes meet an explicit comparison space: The Rest.",
        native: "E8/H3 · Iota · THE REST",
        status: "EXACT ROUTES + TRANSVERSAL ROLE",
        tone: "green",
        links: [
          ["Finite root, orbit and exact return", entityHref("MOD:E8_COXETER")],
          ["The Rest as transversal axis", anchor("rest")],
          ["E8 / H3 route", anchor("e8")]
        ],
        boundary: "The Rest is not one substance; REST→NEXT remains open until a typed operator exists."
      },
      {
        number: "03",
        role: "Connector",
        plain: "A declared sign carrier maps through quaternion normalization into Hopf base and phase records.",
        native: "F40 · Hopf · C4 audit",
        status: "EXACT_MAP + NON_EQUIVALENCE",
        tone: "violet",
        links: [
          ["Open Hopf / F40 route", anchor("hopf")],
          ["Number and representation tests", entityHref("MOD:NUMBER_VIEW_SUITE")]
        ],
        boundary: "Continuous Hopf holonomy and finite C4 return are related but not globally equivalent."
      },
      {
        number: "04",
        role: "Axis roles / sender and receiver",
        plain: "The owner model reads phase/drift as a sending role and synchronization/control as a receiving role, with topology carrying the extension between them.",
        native: "CF:F4 sender · CF:F5 axis carrier · CF:F6 receiver",
        status: "OWNER MODEL + OPEN_BRIDGE",
        tone: "amber",
        links: [
          ["Inspect the open frontier", anchor("all")],
          ["Browse F4 members", familyHref("CF:F4")],
          ["Browse F5 members", familyHref("CF:F5")],
          ["Browse F6 members", familyHref("CF:F6")]
        ],
        boundary: "Sender and receiver are proposed functional roles. F4→F6 and F5→F6 remain OPEN_BRIDGE, not demonstrated causal transport."
      },
      {
        number: "05",
        role: "Carrier comparison",
        plain: "The same method can be tested on differently typed finite carriers without treating their geometries as one object.",
        native: "proposed F1↔F7 pentagonal carrier · proposed F6 hexagonal carrier · Q4 · LOKI-Q4 · E8 240 roots",
        status: "TYPED CARRIERS + NON-IDENTITY",
        tone: "cyan",
        links: [
          ["Discrete Q4 carrier", entityHref("MOD:TESSAREC")],
          ["LOKI / MIWA frame view", entityHref("MOD:OBSERVATORY_MIWA")],
          ["E8 240-root carrier", entityHref("MOD:E8_COXETER")],
          ["Pentagon / hexagon audit", carrierAuditHref]
        ],
        boundary: "Q4 has 16 sign states; LOKI is a Q4 frame-binding view; E8 has a registered 240-root carrier. The proposed pentagon/hexagon reading is not yet a registered carrier equivalence, and the existing P6R01 audit rejects a defined 'pentagon holds hexagon' claim."
      },
      {
        number: "06",
        role: "Candidate F8 axis extension",
        plain: "The proposed F4/F5 extension is retained as a new network hypothesis that may complete the method graph after a typed operator and carrier contract are declared.",
        native: "CAND:F8_AXIS_EXTENSION ≠ HL:F8",
        status: "OWNER HYPOTHESIS + OPEN_BRIDGE",
        tone: "violet",
        links: [
          ["Inspect F4 phase / drift", familyHref("CF:F4")],
          ["Inspect F5 connectivity / topology", familyHref("CF:F5")],
          ["Read the canonical open front", anchor("frontier")]
        ],
        boundary: "This F8 is not yet a canonical Connection Family and must not be confused with historical HL:F8, which means Human Instruments / Games / Cultural Orientation."
      },
      {
        number: "07",
        role: "Return / audit",
        plain: "Replay, nulls, residuals, stop rules and claim ceilings keep every passage bounded.",
        native: "CF:F7 · ILAU · typed return",
        status: "TRANSVERSAL AUDIT",
        tone: "red",
        links: [
          ["Two-cut residual return", entityHref("MOD:TRANSVERSUM_TWO_CUT")],
          ["Browse F7 members", familyHref("CF:F7")],
          ["Inspect evidence", "#evidence"]
        ],
        boundary: "Return records what survives the passage; it does not retroactively prove a source mechanism."
      }
    ];

    app.innerHTML = `${pageHeader("Directed architecture", "From envelope to candidate extension", "This view separates the canonical seven-family method from a new owner-proposed F8 axis extension. Functional names lead; historical NEXAH names remain visible as aliases and stable IDs remain unchanged.", `<a class="instrument-action" href="${anchor("all")}">Open full sequence instrument ↗</a>`)}
      <section class="naming-rule"><p class="overline">Naming rule</p><p><strong>Plain function first</strong> · retained NEXAH term second · stable registry ID underneath. Names are translated for orientation, never rewritten in source records.</p></section>
      <section class="namespace-guard" aria-label="Namespace distinction">
        <article><span>CANONICAL RELATION LAYER</span><strong>CF:F1–F7</strong><p>${esc(Object.values(FAMILY_NAMES).join(" · "))}</p></article>
        <article><span>HISTORICAL BROWSE LAYER</span><strong>HL:F1–F8</strong><p>HL:F8 remains “${esc(HTML_SHELF_NAMES["HL:F8"])}”. It is not the new axis extension.</p></article>
        <article class="candidate"><span>OWNER HYPOTHESIS</span><strong>CAND:F8_AXIS_EXTENSION</strong><p>Proposed F4/F5 axis extension. Pending typed carrier, operator, direction and return contract.</p></article>
      </section>
      <section class="sequence-flow" aria-label="Directed family sequence">
        ${sequenceStages.map((stage, index) => `<div class="sequence-unit"><article class="sequence-stage tone-${stage.tone}">
          <div class="sequence-head"><span>${stage.number}</span><small>${esc(stage.status)}</small></div>
          <h2>${esc(stage.role)}</h2><p>${esc(stage.plain)}</p><div class="native-alias">Alias · ${esc(stage.native)}</div>
          <div class="sequence-links">${stage.links.map(([label, href]) => `<a href="${href}">${esc(label)} →</a>`).join("")}</div>
          <div class="sequence-boundary"><strong>Boundary</strong>${esc(stage.boundary)}</div>
        </article>${index < sequenceStages.length - 1 ? `<div class="sequence-arrow" aria-hidden="true">→</div>` : ""}</div>`).join("")}
      </section>`;
    setContext({ object: "Directed sequence + candidate F8", boundary: "The CF:F1–F7 route is registered. CAND:F8_AXIS_EXTENSION, the sender/receiver reading and the pentagon/hexagon carrier assignment are owner hypotheses; F4→F6, F5→F6 and REST→NEXT remain explicit open bridges.", receipt: "SCIENCE_LAB/FAMILY_CONNECTION_MAP_V2_2026-10-05.md · NEXAH_TAXONOMY_CROSSWALK_V2_2026-10-05.md · P6R01 final decision" });
  }

  function renderLineage() {
    if (!lineage) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Lineage binder unavailable</h1><p>Rebuild <span class="mono">lineage.internal.js</span> and reload this page.</p></section>`;
      return;
    }
    const nodeById = new Map(list(lineage.lineage_nodes).map((node) => [node.node_id, node]));
    const visualHref = (visual) => safeLocalHref(visual.file);
    const shortHash = (hash) => hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : "not available";
    const availabilityLabel = (value) => value === "CURRENT_EXTERNAL_REPOSITORY" ? "Current + hash verified" : "Census only · path missing";

    app.innerHTML = `${pageHeader("Visual + GLB evidence binder", "Prime · Bridge · 2–3 / 8.8 lineage", "One bounded view of recurrent arithmetic, grids, bridges, Cathedral models, Ghostgrid and Human Return. Similar tokens remain typed: 8×8 is not 8|8, and neither is automatically v8.8 or PG88.")}
      <section class="metric-grid lineage-metrics" aria-label="Lineage binder inventory">
        <div class="metric"><strong>${list(lineage.visuals).length}</strong><span>hashed owner visuals</span></div>
        <div class="metric"><strong>${list(lineage.glb_assets).filter((item) => item.availability === "CURRENT_EXTERNAL_REPOSITORY").length}</strong><span>current GLBs verified</span></div>
        <div class="metric"><strong>${list(lineage.glb_assets).filter((item) => item.availability !== "CURRENT_EXTERNAL_REPOSITORY").length}</strong><span>census-only GLBs</span></div>
        <div class="metric"><strong>${list(lineage.relations).length}</strong><span>bounded lineage links</span></div>
      </section>

      <section class="lineage-grammar" aria-label="Typed 2–3 and 8.8 grammar">
        <article><span>2 × 3</span><strong>6 directions</strong><p>Typed product: three axes with two orientations.</p></article>
        <article><span>2³</span><strong>8 states</strong><p>Typed power: binary corner or sign states.</p></article>
        <article><span>3²</span><strong>9 cells</strong><p>Typed power or triadic 3×3 field.</p></article>
        <article><span>8×8 · 8|8 · v8.8 · PG88</span><strong>Related, not identical</strong><p>Carrier, doubled state, version and addressing labels stay distinct.</p></article>
      </section>

      <header class="section-heading"><p class="eyebrow">Five collections</p><h2>One archive, several evidence roles</h2><p>Collections organize entry routes. They do not raise the claim ceiling of their contents.</p></header>
      <section class="lineage-collections">${list(lineage.collections).map((collection) => {
        const count = list(lineage.visuals).filter((visual) => list(visual.collections).includes(collection.collection_id)).length;
        return `<article><span class="idline">${esc(collection.collection_id)} · ${count} visuals</span><h3>${esc(collection.title)}</h3><p>${esc(collection.summary)}</p></article>`;
      }).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Owner-supplied visual register</p><h2>Visuals with receipts and boundaries</h2><p>Each image is an unchanged repository copy with a SHA-256 receipt. Its labels are source evidence, not instructions or automatic claims.</p></header>
      <section class="lineage-gallery">${list(lineage.visuals).map((visual) => `<article class="visual-card">
        <a class="visual-preview" href="${visualHref(visual)}"><img src="${visualHref(visual)}" alt="${esc(visual.title)}" loading="lazy"></a>
        <div class="visual-card-body"><span class="idline">${esc(visual.visual_id)}</span><h3>${esc(visual.title)}</h3>
          <div class="tag-row">${list(visual.collections).map((collection) => `<span class="tag family">${esc(collection.replace("COL:", ""))}</span>`).join("")}</div>
          <p>${esc(list(visual.depicts).join(" · "))}</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(visual.claim_boundary)}</p>
          <div class="visual-receipt"><span>${esc(visual.dimensions)}</span><span class="mono">${esc(shortHash(visual.sha256))}</span><a href="${visualHref(visual)}">Open image ↗</a></div>
        </div>
      </article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">3D evidence</p><h2>Current binaries and missing historical anchors</h2><p>Current external GLBs were re-hashed. Census-only records remain visible as recovery leads and are not presented as inspected binaries.</p></header>
      <section class="glb-register">${list(lineage.glb_assets).map((asset) => `<article class="glb-row ${asset.availability === "CURRENT_EXTERNAL_REPOSITORY" ? "is-current" : "is-missing"}">
        <div><span class="idline">${esc(asset.asset_id)}</span><h3>${esc(asset.title)}</h3><p>${esc(asset.evidence)}</p></div>
        <div class="glb-state"><span class="status-dot ${asset.availability === "CURRENT_EXTERNAL_REPOSITORY" ? "active" : "provisional"}">${esc(availabilityLabel(asset.availability))}</span><span class="mono">${esc(shortHash(asset.sha256))}</span></div>
        <p class="lineage-boundary"><strong>Boundary</strong> ${esc(asset.claim_boundary)}</p>
      </article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Typed lineage</p><h2>What connects — and what does not follow</h2></header>
      <section class="lineage-relations">${list(lineage.relations).map((relation) => `<article>
        <div class="lineage-route"><strong>${esc(nodeById.get(relation.source)?.title || relation.source)}</strong><span>${esc(titleCase(relation.type))} →</span><strong>${esc(nodeById.get(relation.target)?.title || relation.target)}</strong></div>
        <p>${esc(relation.evidence)}</p><p class="lineage-boundary"><strong>Does not imply</strong> ${esc(relation.boundary)}</p>
      </article>`).join("")}</section>

      <section class="panel open-questions"><p class="overline">Open provenance queue</p><h2>Five questions that remain genuinely open</h2><ol>${list(lineage.open_questions).map((question) => `<li>${esc(question)}</li>`).join("")}</ol></section>`;
    setContext({ object: "Prime · Bridge · 2–3 / 8.8 lineage", boundary: lineage.claim_boundary, receipt: `${lineage.binder_id} · ${lineage.maintained} · ${lineage.visuals.length} visual hashes · ${lineage.glb_assets.length} GLB records` });
  }

  function filterMarkup() {
    const typeChips = ["module", "surface", "evidence"].map((type) => `
      <label class="filter-chip"><input type="checkbox" name="type" value="${type}" ${state.types.has(type) ? "checked" : ""}><span>${titleCase(type)} · ${typeCounts[type] || 0}</span></label>`).join("");
    const familyChips = Object.keys(FAMILY_NAMES).map((family) => `
      <label class="filter-chip"><input type="checkbox" name="family" value="${esc(family)}" ${state.families.has(family) ? "checked" : ""}><span>${esc(family.replace("CF:", ""))} · ${familyCounts[family] || 0}</span></label>`).join("");
    const roleChips = ["human", "builder", "science", "governance"].map((role) => `
      <label class="filter-chip"><input type="checkbox" name="role" value="${role}" ${state.roles.has(role) ? "checked" : ""}><span>${titleCase(role)}</span></label>`).join("");
    return `<div class="control-bar">
        <div class="search-field"><label for="catalog-search">⌕</label><input id="catalog-search" type="search" value="${esc(state.query)}" placeholder="Search title, ID, concept, source record…" autocomplete="off"></div>
        <button class="filter-toggle" type="button" aria-expanded="${state.filtersOpen}">${state.filtersOpen ? "Hide" : "Show"} filters</button>
      </div>
      <div class="filters" ${state.filtersOpen ? "" : "hidden"}>
        <fieldset class="filter-group"><legend>Object type</legend><div class="check-grid">${typeChips}</div></fieldset>
        <fieldset class="filter-group"><legend>Connection family</legend><div class="check-grid">${familyChips}</div></fieldset>
        <fieldset class="filter-group"><legend>User role</legend><div class="check-grid">${roleChips}</div></fieldset>
      </div>`;
  }

  function searchableText(entity) {
    return [
      entity.entity_id, entity.title, entity.summary, entity.status, entity.entity_type,
      ...list(entity.connection_family_ids), ...list(entity.roles), ...list(entity.controlling_record_ids),
      ...list(entity.attributes?.concepts), entity.attributes?.kind,
      entity.attributes?.assessment?.content_role, entity.attributes?.assessment?.representation_role,
      entity.internal?.local_path
    ].filter(Boolean).join(" ").toLocaleLowerCase();
  }

  function filteredEntities(base = entities) {
    const query = state.query.trim().toLocaleLowerCase();
    return base.filter((entity) => {
      if (state.types.size && !state.types.has(entity.entity_type)) return false;
      if (state.families.size && ![...state.families].every((family) => list(entity.connection_family_ids).includes(family))) return false;
      if (state.roles.size && ![...state.roles].some((role) => list(entity.roles).includes(role))) return false;
      return !query || searchableText(entity).includes(query);
    });
  }

  function renderCatalog(options = {}) {
    if (options.family) state.families = new Set([options.family]);
    const heading = options.family ? `${options.family.replace("CF:", "")} · ${FAMILY_NAMES[options.family] || "Connection family"}` : "Catalog";
    const copy = options.family
      ? `${familyCounts[options.family] || 0} entities currently carry this connection-family route. The family groups comparable work; it does not make the entities identical.`
      : "The validated internal inventory. Find one object, then inspect its role, representations, relations and source receipt.";
    app.innerHTML = `${pageHeader(options.family ? "Connection family" : "Browse", heading, copy)}${filterMarkup()}<div id="catalog-results"></div>`;
    wireCatalogControls(options);
    updateCatalogResults();
    setContext({ object: options.family || "Catalog", boundary: "A family is an orientation route across objects. Membership does not transfer mechanism identity, evidence strength or claim ceiling.", receipt: receiptSummary() });
  }

  function wireCatalogControls(options) {
    const search = document.querySelector("#catalog-search");
    search.addEventListener("input", () => { state.query = search.value; updateCatalogResults(); });
    document.querySelector(".filter-toggle").addEventListener("click", () => {
      state.filtersOpen = !state.filtersOpen;
      renderCatalog(options);
      document.querySelector("#catalog-search")?.focus();
    });
    document.querySelectorAll('input[name="type"]').forEach((input) => input.addEventListener("change", () => {
      input.checked ? state.types.add(input.value) : state.types.delete(input.value);
      updateCatalogResults();
    }));
    document.querySelectorAll('input[name="family"]').forEach((input) => input.addEventListener("change", () => {
      input.checked ? state.families.add(input.value) : state.families.delete(input.value);
      updateCatalogResults();
    }));
    document.querySelectorAll('input[name="role"]').forEach((input) => input.addEventListener("change", () => {
      input.checked ? state.roles.add(input.value) : state.roles.delete(input.value);
      updateCatalogResults();
    }));
  }

  function updateCatalogResults() {
    const target = document.querySelector("#catalog-results");
    if (!target) return;
    const results = filteredEntities();
    target.innerHTML = `<div class="result-summary"><span>${results.length} of ${entities.length} entities</span><span>${state.query ? `Query: “${esc(state.query)}”` : "Validated internal manifest"}</span></div>
      <div class="entity-list">${results.length ? results.map(renderEntityCard).join("") : `<section class="empty-state"><h2>No matching objects</h2><p>Broaden the query or remove one filter.</p></section>`}</div>`;
  }

  function renderFamilies() {
    const max = Math.max(...Object.values(familyCounts));
    app.innerHTML = `${pageHeader("Connection architecture", "Seven families", "Families organize recurring relational work across modules, surfaces and evidence. They are navigation instruments—not assertions of a universal mechanism.")}
      <section class="family-grid">${Object.entries(FAMILY_NAMES).map(([id, name]) => `
        <a class="family-card" href="${familyHref(id)}">
          <span class="card-code">${esc(id)}</span><h2>${esc(name)}</h2>
          <p>${familyCounts[id] || 0} connected entities</p>
          <div class="family-bar" aria-hidden="true"><span style="width:${Math.round((familyCounts[id] || 0) / max * 100)}%"></span></div>
        </a>`).join("")}</section>`;
    setContext({ object: "Connection families", boundary: "The same object may participate in several families. Overlap is recorded; it is not collapsed into identity.", receipt: receiptSummary() });
  }

  function renderRelations() {
    app.innerHTML = `${pageHeader("Typed relation records", "Connections with edges", "Every displayed connection has named endpoints, an explanation, provenance and a negative boundary. No free-floating visual similarity is promoted to a relation.")}
      <div class="relation-list">${relations.length ? relations.map((relation) => relationCard(relation)).join("") : `<section class="empty-state"><h2>No admitted relations</h2></section>`}</div>`;
    setContext({ object: "Relations", boundary: "A relation record preserves an inspectable comparison path. It does not prove causal, mathematical or physical identity unless its own contract says so.", receipt: `${relations.length} admitted relations · endpoints resolved` });
  }

  function renderRelation(id) {
    const relation = relations.find((item) => item.relation_id === id);
    if (!relation) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Unknown relation</p><h1>Relation not found</h1><p class="mono">${esc(id)}</p><p><a href="#relations">Return to relations</a></p></section>`;
      setContext({ object: "Missing relation", boundary: "No connection is inferred for an unresolved relation identifier.", receipt: id });
      return;
    }
    app.innerHTML = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Navigator</a> / <a href="#relations">Relations</a> / ${esc(relation.relation_id)}</nav>
      ${pageHeader("Bounded relation", titleCase(relation.relation_type), relation.explanation)}
      ${relationCard(relation)}
      <div class="detail-layout">
        <section class="panel"><h2>What the route preserves</h2><div class="tag-row">${list(relation.preserves).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div><h3>Evidence records</h3>${list(relation.evidence_record_ids).length ? `<div class="link-list">${list(relation.evidence_record_ids).map((record) => `<span class="mono wrap">${esc(record)}</span>`).join("")}</div>` : `<p>No separate evidence record listed.</p>`}</section>
        <section class="panel boundary-panel"><p class="overline">Claim boundary</p><h2>What does not transfer</h2><p>${esc(relation.claim_boundary)}</p><h3>Confidence / status</h3><p>${esc(relation.confidence)} · ${esc(relation.status)}</p></section>
      </div>`;
    setContext({ object: relation.relation_id, boundary: relation.claim_boundary, receipt: list(relation.evidence_record_ids).join(" · ") || "Relation registry" });
  }

  function renderEvidence() {
    const evidence = entities.filter((entity) => entity.entity_type === "evidence");
    app.innerHTML = `${pageHeader("Evidence inspector", "Verdict and interpretation", "Evidence remains package-local. The current Navigator interpretation is shown beside—not over—the recorded local result.")}
      <div class="entity-list">${evidence.map(renderEntityCard).join("")}</div>`;
    setContext({ object: "Evidence", boundary: "A negative or null package result remains negative or null in its original scope. Later orientation may contextualize it but cannot rewrite it.", receipt: `${evidence.length} evidence nodes · package-local verdict retained` });
  }

  function renderAdmission() {
    const rejected = list(admission.rejected);
    const candidates = entities
      .filter((entity) => entity.entity_type === "module" || entity.attributes?.assessment?.centrality_score >= 5)
      .slice(0, 20);
    app.innerHTML = `${pageHeader("Public admission gate", "Nothing is public by default", "This view exposes export readiness without changing authority. An attractive or central object is not a released object.")}
      <section class="panel admission-summary"><p class="overline">Current decision · ${esc(release.release_state)}</p><h2><strong>${release.public_entity_count} admitted</strong> · ${rejected.length} rejected</h2><p>All current objects stop at <span class="reason-code">NO_PUBLIC_ALLOWLIST</span>. No candidate is presently safe to present as a public release. Human Owner selection, rights, public locators and a signed release receipt remain required.</p></section>
      <header class="section-heading"><p class="eyebrow">Review queue</p><h2>Central candidates, still blocked</h2><p>Centrality helps choose what to review; it never bypasses the release gate.</p></header>
      <div class="entity-list">${candidates.map((entity) => {
        const reasons = rejectionById.get(entity.entity_id) || ["NOT_IN_PUBLIC_BUILD"];
        return `<a class="entity-card" href="${entityHref(entity.entity_id)}"><span><span class="idline">${esc(entity.entity_id)}</span><h2>${esc(entity.title)}</h2><p>${esc(trimText(entity.summary))}</p></span><span class="entity-card-meta"><span class="reason-code">${esc(reasons.join(" · "))}</span></span></a>`;
      }).join("")}</div>`;
    setContext({ object: "Public admission", boundary: "No centrality, visual quality or internal PASS can substitute for explicit release admission.", receipt: `${rejected.length} rejected · ${Object.entries(admission.reason_summary || {}).map(([reason, count]) => `${reason}:${count}`).join(" · ")}` });
  }

  function safeLocalHref(localPath) {
    if (!localPath || localPath.startsWith("/") || localPath.includes("..") || /^[a-z]+:/i.test(localPath)) return "";
    return `../../../${localPath.split("/").map(encodeURIComponent).join("/")}`;
  }

  function sourceActionLabel(entity) {
    const path = entity.internal?.local_path || "";
    if (entity.entity_type === "surface" && /\.html?$/i.test(path)) return "Open HTML instrument ↗";
    if (entity.entity_type === "module") return "Open controlling record ↗";
    return "Open source record ↗";
  }

  function renderSurfaceLink(surface, masterId) {
    const directHref = safeLocalHref(surface.internal?.local_path);
    const isMaster = surface.entity_id === masterId;
    return `<article class="surface-row ${isMaster ? "is-master" : ""}">
      <div><span class="idline">${esc(surface.entity_id)}</span><h3>${esc(surface.title)}</h3><div class="tag-row">${isMaster ? `<span class="tag family">Current master</span>` : ""}${renderTags(surface)}</div></div>
      <div class="surface-actions">${directHref ? `<a class="mini-action primary" href="${directHref}">Open HTML ↗</a>` : ""}<a class="mini-action" href="${entityHref(surface.entity_id)}">Inspect →</a></div>
    </article>`;
  }

  function datum(label, value, options = {}) {
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return "";
    const content = Array.isArray(value) ? value.join(" · ") : value;
    return `<div class="datum"><dt>${esc(label)}</dt><dd class="${options.mono ? "mono" : ""}"><strong>${esc(content)}</strong></dd></div>`;
  }

  function relatedEntityLinks(ids, exclude) {
    const resolved = unique(list(ids)).filter((id) => id !== exclude && entityById.has(id));
    if (!resolved.length) return `<p class="muted">No additional linked entities in this manifest.</p>`;
    return `<div class="link-list">${resolved.map((id) => `<a href="${entityHref(id)}"><span class="idline">${esc(id)}</span><br>${esc(entityLabel(id))}</a>`).join("")}</div>`;
  }

  function evidencePair(entity) {
    const local = entity.attributes?.local_verdict;
    const current = entity.attributes?.current_interpretation;
    if (!local && !current) return "";
    return `<section class="evidence-pair" aria-label="Evidence interpretation pair">
      <div class="verdict local"><p class="overline">Package-local verdict</p><strong>${esc(local || "Not recorded")}</strong><p>This statement remains attached to its original package and test boundary.</p></div>
      <div class="verdict current"><p class="overline">Current interpretation</p><strong>${esc(current || "Not recorded")}</strong><p>Context for navigation only; it does not overwrite the local result.</p></div>
    </section>`;
  }

  function entityRelations(entity) {
    return relations.filter((relation) => relation.source_id === entity.entity_id || relation.target_id === entity.entity_id);
  }

  function renderEntity(id) {
    const entity = entityById.get(id);
    if (!entity) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Unknown object</p><h1>Entity not found</h1><p class="mono">${esc(id)}</p><p><a href="#catalog">Return to catalog</a></p></section>`;
      setContext({ object: "Missing entity", boundary: "No claim is made for an unresolved identifier.", receipt: id });
      return;
    }
    const assessment = entity.attributes?.assessment || {};
    const localHref = safeLocalHref(entity.internal?.local_path);
    const ownRelations = entityRelations(entity);
    const records = list(entity.controlling_record_ids);
    const rejectionReasons = rejectionById.get(entity.entity_id) || [];
    const moduleSurfaces = entity.entity_type === "module"
      ? entities.filter((candidate) => candidate.entity_type === "surface" && candidate.attributes?.module_id === entity.entity_id)
      : [];
    const masterSurfaceId = entity.attributes?.current_master_surface;
    const masterSurface = masterSurfaceId ? entityById.get(masterSurfaceId) : null;
    const masterHref = masterSurface ? safeLocalHref(masterSurface.internal?.local_path) : "";
    moduleSurfaces.sort((a, b) => (a.entity_id === masterSurfaceId ? -1 : b.entity_id === masterSurfaceId ? 1 : a.title.localeCompare(b.title)));

    app.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Navigator</a> / <a href="#catalog">Catalog</a> / ${esc(entity.entity_type)} / ${esc(entity.entity_id)}</nav>
      <header class="detail-header">
        <p class="eyebrow">${esc(entity.entity_type)} · ${esc(entity.status)}</p>
        <h1 class="detail-title">${esc(entity.title)}</h1>
        <p class="lede">${esc(entity.summary)}</p>
        <div class="tag-row">${renderTags(entity, true)}</div>
        ${masterHref ? `<div class="hero-actions"><a class="instrument-action" href="${masterHref}">Open primary instrument ↗</a><a class="secondary-action" href="${entityHref(masterSurfaceId)}">Inspect master surface</a></div>` : localHref && entity.entity_type === "surface" ? `<div class="hero-actions"><a class="instrument-action" href="${localHref}">Open HTML instrument ↗</a></div>` : ""}
      </header>
      ${evidencePair(entity)}
      <div class="detail-layout">
        <div class="panel-stack">
          <section class="panel">
            <h2>Object profile</h2>
            <dl class="data-grid">
              ${datum("Entity ID", entity.entity_id, { mono: true })}
              ${datum("Roles", list(entity.roles))}
              ${datum("Current master surface", entity.attributes?.current_master_surface || entity.attributes?.relationship?.current_master_surface, { mono: true })}
              ${datum("Centrality", assessment.centrality_score ? `${assessment.centrality_score}/5 · ${assessment.centrality_label}` : "")}
              ${datum("Content role", assessment.content_role)}
              ${datum("Representation", assessment.representation_role)}
              ${datum("Interaction", assessment.interaction_level)}
              ${datum("Lifecycle", assessment.lifecycle)}
              ${datum("Curation", assessment.curation_state)}
              ${datum("Evidence status", assessment.evidence_status)}
              ${datum("Kind", entity.attributes?.kind)}
              ${datum("Concepts", list(entity.attributes?.concepts))}
              ${datum("Technology", Object.entries(entity.attributes?.technology || {}).filter(([, value]) => value).map(([key]) => key))}
            </dl>
          </section>
          ${moduleSurfaces.length ? `<section class="panel"><h2>HTML instruments and views</h2><p>${moduleSurfaces.length} registered surfaces resolve to this module. Open the instrument directly or inspect its provenance and boundary first.</p><div class="surface-list">${moduleSurfaces.map((surface) => renderSurfaceLink(surface, masterSurfaceId)).join("")}</div></section>` : ""}
          <section class="panel">
            <h2>Related objects</h2>
            ${relatedEntityLinks(entity.related_entity_ids, entity.entity_id)}
          </section>
          <section class="panel">
            <h2>Typed relations</h2>
            ${ownRelations.length ? `<div class="relation-list">${ownRelations.map((relation) => relationCard(relation)).join("")}</div>` : `<p>No admitted typed edge currently has this object as an endpoint. Family membership and registry links may still provide orientation routes.</p>`}
          </section>
        </div>
        <div class="panel-stack">
          <section class="panel boundary-panel"><p class="overline">Claim boundary</p><h2>What this object cannot carry across</h2><p>${esc(entity.claim_ceiling)}</p></section>
          <section class="panel source-panel">
            <p class="overline">Source receipt</p><h2>Internal provenance</h2>
            <dl class="data-grid">
              ${datum("Repository", entity.internal?.repository)}
              ${datum("Source state", entity.internal?.source_state)}
              ${datum("Local path", entity.internal?.local_path, { mono: true })}
              ${datum("SHA-256", entity.internal?.sha256, { mono: true })}
              ${datum("Controlling records", records, { mono: true })}
            </dl>
            ${localHref ? `<a class="local-open" href="${localHref}">${sourceActionLabel(entity)}</a>` : ""}
          </section>
          <section class="panel admission-summary"><p class="overline">Public admission</p><h2>${rejectionReasons.length ? "Not admitted" : "No rejection record"}</h2><p>${rejectionReasons.length ? `Current gate: ${esc(rejectionReasons.join(" · "))}. Internal visibility and centrality do not authorize release.` : "Consult the signed public release receipt before treating this object as public."}</p></section>
          <section class="panel residual-panel"><p class="overline">Residual / the rest</p><h2>Still distinct</h2><p>${esc(ownRelations.length ? unique(ownRelations.flatMap((relation) => list(relation.does_not_imply))).join(" · ") : "No relation should be inferred from visual resemblance alone. Unregistered differences remain explicit residual space.")}</p></section>
        </div>
      </div>`;

    setContext({ object: entity.title, boundary: entity.claim_ceiling, receipt: `${entity.internal?.repository || "registry"} · ${entity.internal?.local_path || records[0] || entity.entity_id}` });
  }

  function receiptSummary() {
    const receipt = manifest.build_receipt || {};
    return `${manifest.title} · ${manifest.version} · ${receipt.entity_count ?? entities.length} entities · ${receipt.relation_count ?? relations.length} relations`;
  }

  function setContext({ object, boundary, receipt }) {
    boundaryNode.textContent = boundary || "No claim boundary supplied.";
    selectionNode.innerHTML = `
      <div><dt>Object</dt><dd>${esc(object)}</dd></div>
      <div><dt>Profile</dt><dd>${esc(manifest.profile)}</dd></div>
      <div><dt>Release</dt><dd>${release.publication_authorized ? "Authorized" : "Not authorized"}</dd></div>`;
    receiptNode.textContent = receipt || receiptSummary();
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#/, "") || "home";
    const [route, value] = raw.split("=");
    return { route, value: value ? decodeURIComponent(value) : "" };
  }

  function renderRoute() {
    const { route, value } = parseRoute();
    document.querySelectorAll("[data-route-link]").forEach((link) => {
      const current = link.dataset.routeLink === route || (route === "family" && link.dataset.routeLink === "families") || (route === "entity" && link.dataset.routeLink === "catalog");
      current ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
    });
    if (route !== "catalog" && route !== "family") {
      state.query = ""; state.types.clear(); state.families.clear(); state.roles.clear();
    }
    switch (route) {
      case "catalog": renderCatalog(); break;
      case "atlas": renderAtlas(); break;
      case "utg": renderUTG(); break;
      case "sequence": renderSequence(); break;
      case "lineage": renderLineage(); break;
      case "relations": renderRelations(); break;
      case "relation": renderRelation(value); break;
      case "families": renderFamilies(); break;
      case "family": renderCatalog({ family: value }); break;
      case "evidence": renderEvidence(); break;
      case "admission": renderAdmission(); break;
      case "entity": renderEntity(value); break;
      default: renderHome(); break;
    }
    document.querySelector("#workspace")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function initializeChrome() {
    document.querySelector("#build-entity-count").textContent = entities.length;
    document.querySelector("#build-relation-count").textContent = relations.length;
    document.querySelector("#build-date").textContent = `As of ${manifest.as_of} · ${manifest.currentness}`;
    familyNav.innerHTML = Object.keys(FAMILY_NAMES).map((family) => `<a href="${familyHref(family)}"><span>${esc(family.replace("CF:", ""))}</span><small>${familyCounts[family] || 0}</small></a>`).join("");
  }

  initializeChrome();
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
})();
