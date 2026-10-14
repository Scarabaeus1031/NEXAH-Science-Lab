(() => {
  "use strict";

  const manifest = window.NEXAH_NAVIGATOR_MANIFEST;
  const entry = window.NEXAH_NAVIGATOR_ENTRY;
  const lineage = window.NEXAH_LINEAGE_BINDER;
  const utg = window.NEXAH_UTG_BINDER;
  const ladders = window.NEXAH_LADDER_ATLAS_BINDER;
  const lifeOrbit = window.NEXAH_LIFE_ORBIT_ADMISSION;
  const lifeProgram = window.NEXAH_LIFE_PROGRAM;
  const primeCrystal = window.NEXAH_PRIME_CRYSTAL_INSTRUMENT;
  const observatoryBinding = window.NEXAH_OBSERVATORY_BINDING;
  const root7Look = window.NEXAH_ROOT7_LOOK;
  const ilauOrientation = window.NEXAH_ILAU_ORIENTATION_INSTRUMENTS;
  const primeBaseMode = window.NEXAH_PRIME_BASE_MODE;
  const labRegister = window.NEXAH_LAB_REGISTER;
  const findingsFrontiers = window.NEXAH_FINDINGS_FRONTIERS;
  const a0OrientationEvidence = window.NEXAH_A0_ORIENTATION_EVIDENCE;
  const orientationCatalog = window.NEXAH_ORIENTATION_CATALOG;
  const orionEvidence = window.NEXAH_ORION_CAPABILITY_EVIDENCE;
  const baseAdmission = window.NEXAH_NAVIGATOR_ADMISSION || { rejected: [], reason_summary: {} };
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

  if (!manifest || !Array.isArray(manifest.entities) || !Array.isArray(manifest.relations) || !entry || !Array.isArray(entry.domains) || !Array.isArray(entry.current_focus) || !Array.isArray(entry.terms) || lifeOrbit?.status !== "INTERNAL_ADMITTED" || !Array.isArray(lifeOrbit.entities) || !Array.isArray(lifeOrbit.relations) || lifeProgram?.status !== "INTERNAL_READ_ONLY_PROGRAM_LENS" || lifeProgram?.records?.length !== 21 || primeCrystal?.status !== "INTERNAL_READ_ONLY_CALIBRATION_FAMILY" || primeCrystal?.three_cut_control?.length !== 3 || observatoryBinding?.status !== "INTERNAL_READ_ONLY_LENS" || observatoryBinding?.typed_fields?.length !== 8 || observatoryBinding?.family_bindings?.length !== 7 || root7Look?.status !== "INTERNAL_READ_ONLY_ORIENTATION_LENS" || root7Look?.decisions?.length !== 3 || ilauOrientation?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || ilauOrientation?.instruments?.length !== 19 || primeBaseMode?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || primeBaseMode?.type_boundaries?.length !== 8 || primeBaseMode?.sources?.length !== 9 || primeBaseMode?.nodes?.length !== 14 || primeBaseMode?.relations?.length !== 16 || labRegister?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || !Array.isArray(labRegister.studies) || labRegister.studies.length !== labRegister.study_count || findingsFrontiers?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LEAD_LENS" || findingsFrontiers?.classes?.length !== 5 || findingsFrontiers?.sources?.length !== 11 || a0OrientationEvidence?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || a0OrientationEvidence?.sources?.length !== 98 || a0OrientationEvidence?.a0_surface_coverage?.bound_surfaces !== 33 || a0OrientationEvidence?.nodes?.length !== 27 || a0OrientationEvidence?.relations?.length !== 39 || a0OrientationEvidence?.pascal_pentagon_suite?.tests?.length !== 7 || a0OrientationEvidence?.orientation_operator_cycle?.stages?.length !== 4 || a0OrientationEvidence?.a0_entry_map?.numeric_anchors?.length !== 3 || a0OrientationEvidence?.grid_interaction_atlas?.layers?.length !== 4 || a0OrientationEvidence?.grid_interaction_atlas?.channel_contract?.length !== 6 || a0OrientationEvidence?.a0_core_statement?.typed_chain?.length !== 6 || orientationCatalog?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || orientationCatalog?.records?.length !== 61 || orientationCatalog?.registered_works?.length !== 10 || orientationCatalog?.concepts?.length !== 17 || orionEvidence?.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS" || orionEvidence?.evidence_ladder?.length !== 5) {
    app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Validated manifest unavailable</h1><p>Rebuild <span class="mono">data.internal.js</span> and reload this page.</p></section>`;
    return;
  }
  if (a0OrientationEvidence?.findings_paper_flow?.findings?.length !== 16 || a0OrientationEvidence?.findings_paper_flow?.paper_lanes?.length !== 4) {
    app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>A0 findings flow unavailable</h1><p>Rebuild <span class="mono">a0-orientation-evidence.internal.js</span> and reload this page.</p></section>`;
    return;
  }

  const baseEntityIds = new Set(manifest.entities.map((entity) => entity.entity_id));
  const admittedEntities = lifeOrbit.entities.filter((entity) => !baseEntityIds.has(entity.entity_id));
  const baseRelationIds = new Set(manifest.relations.map((relation) => relation.relation_id));
  const admittedRelations = lifeOrbit.relations.filter((relation) => !baseRelationIds.has(relation.relation_id));
  const admission = {
    ...baseAdmission,
    rejected: [
      ...(Array.isArray(baseAdmission.rejected) ? baseAdmission.rejected : []),
      ...admittedEntities.map((entity) => ({ entity_id: entity.entity_id, reasons: ["NO_PUBLIC_ALLOWLIST", "INTERNAL_ONLY"] }))
    ],
    reason_summary: {
      ...(baseAdmission.reason_summary || {}),
      NO_PUBLIC_ALLOWLIST: (baseAdmission.reason_summary?.NO_PUBLIC_ALLOWLIST || 0) + admittedEntities.length,
      INTERNAL_ONLY: admittedEntities.length
    }
  };
  const entities = [...manifest.entities, ...admittedEntities].sort((a, b) =>
    (TYPE_ORDER[a.entity_type] ?? 9) - (TYPE_ORDER[b.entity_type] ?? 9) || a.title.localeCompare(b.title)
  );
  const relations = [...manifest.relations, ...admittedRelations].sort((a, b) => a.relation_id.localeCompare(b.relation_id));
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
    const bridgeMedia = list(utg?.comparative_dynamics?.media).find((item) => item.media_id === "MEDIA:DYN:CROSS_SYSTEM_STRUCTURE");
    const bridgeHref = bridgeMedia ? safeLocalHref(bridgeMedia.file) : "";
    const fullConnectionMap = entityById.get("ART:ATLAS:MAP_V2");
    const fullConnectionMapHref = safeLocalHref(fullConnectionMap?.internal?.local_path);
    app.innerHTML = `
      <section class="hero home-hero">
        <div>
          <p class="eyebrow">NEXAH Science Lab · Orientation instrument</p>
          <h1>Different systems.<br>Comparable transitions.<br>Explicit limits.</h1>
          <p class="lede">This navigator connects mathematical models, visual experiments and evidence across the NEXAH Science Lab. Use it to see what is changing, where a transition is defined and how strongly a claimed connection is supported.</p>
          <div class="hero-actions home-actions">
            <a class="instrument-action" href="#about">Understand the framework</a>
            ${fullConnectionMapHref ? `<a class="secondary-action" href="${fullConnectionMapHref}">Open the connection map ↗</a>` : `<a class="secondary-action" href="#atlas">Open the connection atlas</a>`}
            <a class="secondary-action" href="#evidence">Inspect the evidence</a>
          </div>
        </div>
        <aside class="home-question" aria-label="Starting questions">
          <p class="overline">Begin with a question</p>
          <p>What is changing?</p>
          <p>Where is the boundary?</p>
          <p>What would count as evidence?</p>
        </aside>
      </section>
      <p class="home-boundary">Comparison is not identity. A shared language does not create shared evidence.</p>

      <section class="home-value" aria-labelledby="home-value-title">
        <header><p class="eyebrow">Why this is useful</p><h2 id="home-value-title">See what is changing—and what you can responsibly compare.</h2></header>
        <div><p>Complex systems are often shown through isolated equations, simulations, diagrams or stories. The Navigator brings those representations into one inspectable map.</p><p>It helps you locate regimes and boundaries, compare transition structures, trace the evidence behind a visual claim and identify the next question worth testing.</p></div>
        <p class="home-value-line">From observation → to comparison → to evidence.</p>
      </section>

      <section class="metric-grid" aria-label="Manifest inventory">
        <div class="metric"><strong>${typeCounts.module || 0}</strong><span>modules</span></div>
        <div class="metric"><strong>${typeCounts.surface || 0}</strong><span>HTML / instrument surfaces</span></div>
        <div class="metric"><strong>${typeCounts.evidence || 0}</strong><span>evidence nodes</span></div>
        <div class="metric"><strong>${relations.length}</strong><span>typed, bounded relations</span></div>
      </section>

      <header class="section-heading home-section-heading"><p class="eyebrow">How the map is organized</p><h2>One framework. Seven functional families. Many distinct objects.</h2><p>The framework supplies a shared grammar. The families name recurring kinds of relational work. Concrete systems keep their own mathematics, and evidence remains local to the tested claim.</p></header>
      <section class="framework-stack" aria-label="Framework to evidence hierarchy">
        <article><span>01</span><div><strong>Framework</strong><p>Shared grammar, constraints and claim boundaries.</p></div></article>
        <article><span>02</span><div><strong>Connection Families F1–F7</strong><p>Recurring functional questions—not universal mechanisms.</p></div></article>
        <article><span>03</span><div><strong>Systems, models and visual works</strong><p>Concrete, non-identical carriers such as Lorenz, Rössler, Halvorsen, Kuramoto and IEEE data.</p></div></article>
        <article><span>04</span><div><strong>Evidence and maturity</strong><p>Observed · reconstructed · tested · proposed.</p></div></article>
      </section>
      ${fullConnectionMapHref ? `<p class="map-primary-action"><span>The Family Connection Map shows how the seven functional families relate.</span><a class="instrument-action" href="${fullConnectionMapHref}">Open the interactive map ↗</a></p>` : ""}

      ${renderEntryFamilyMap()}

      ${bridgeHref ? `<section class="home-visual-bridge">
        <div class="home-visual-copy"><p class="eyebrow">See the question move</p><h2>Different dynamics can be compared without being equated.</h2><p>Across Lorenz, Halvorsen and Rössler, the same sequence asks comparable questions: Where are regimes? What counts as a crossing? Which field supports a possible path?</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(bridgeMedia.claim_boundary)}</p><a class="secondary-action" href="#dynamics">Open comparative dynamics →</a></div>
        <a class="home-visual-frame" href="${bridgeHref}"><img src="${bridgeHref}" alt="${esc(bridgeMedia.title)}"><span>Dynamics → field → regime geometry → transition structure</span></a>
      </section>` : ""}

      <section class="research-question" aria-labelledby="research-question-title">
        <p class="eyebrow">The research question</p>
        <h2 id="research-question-title">Can transitions across different systems share a common, inspectable grammar without erasing their mathematics, evidence and limits?</h2>
        <div class="research-prompts"><span>Which structures recur?</span><span>Which similarities survive formal testing?</span><span>What evidence is required before promotion?</span></div>
      </section>

      <header class="section-heading home-section-heading"><p class="eyebrow">Three ways to enter</p><h2>Understand. Explore. Verify.</h2><p>Choose the depth that matches your question. No prior knowledge of UTG is required.</p></header>
      <section class="entrance-grid home-primary-entrances" aria-label="Three primary entrances">
        <a class="entrance-card" href="#utg">
          <span class="card-code">01 · UNDERSTAND</span>
          <span><strong>Understand UTG</strong><p>Read what the framework proposes, where it stops and what formal promotion would require.</p></span>
          <span class="card-action">Open the framework →</span>
        </a>
        <a class="entrance-card" href="#dynamics">
          <span class="card-code">02 · EXPLORE</span>
          <span><strong>Explore a transition</strong><p>Compare dynamical carriers and visual studies without flattening their differences.</p></span>
          <span class="card-action">Open comparative dynamics →</span>
        </a>
        <a class="entrance-card" href="#evidence">
          <span class="card-code">03 · VERIFY</span>
          <span><strong>Inspect the evidence</strong><p>Open source records, provenance, tests and explicit claim ceilings.</p></span>
          <span class="card-action">Open evidence inspector →</span>
        </a>
      </section>
      <nav class="home-link-rail" aria-label="Secondary research routes"><a href="#lab-register">Open the Lab Register →</a><a href="../EVIDENCE/NEXAH_META_ARCHITECTURE_TRACE_2026-10-06/NEXAH_META_ARCHITECTURE_41_TRACE.html">Trace one motif across the architecture →</a><a href="#envelope">Understand Envelope →</a><a href="#ladders">Compare recurring ladders →</a><a href="#atlas">Browse the complete atlas →</a><a href="#relations">Follow bounded relations →</a><a href="#lineage">Trace visual and model lineage →</a><a href="#prime-base-mode">Inspect Prime · Base · Mode →</a><a href="#catalog">Search all registered objects →</a></nav>

      <section class="home-invitation">
        <p class="eyebrow">The invitation</p><h2>Bring a system in motion.</h2>
        <p>Begin with one transition you want to understand. Locate the states. Mark the boundary. Follow what crosses it. Compare another representation. Then inspect whether the connection is visual, computational or formally supported.</p>
        <p>You do not need to accept the framework. Use it to find a missing distinction, a counterexample or a better question.</p>
        <a class="instrument-action" href="#dynamics">Begin with a transition →</a>
      </section>`;
    setContext({ object: "Orientation", boundary: manifest.authority_statement, receipt: receiptSummary() });
  }

  function renderAbout() {
    app.innerHTML = `${pageHeader("About the Science Lab Navigator", "Making transition research inspectable.", "The NEXAH Science Lab Navigator is an internal research instrument for exploring relationships among mathematical models, visual experiments, formal tests and evidence records. It makes the programme visible without turning proximity, analogy or shared vocabulary into proof.")}
      <section class="about-statement"><span>01</span><div><p class="eyebrow">The research problem</p><h2>Finding a pattern is not yet understanding a transition.</h2><p>Complex systems can display recurring forms: basins, crossings, phase drift, return structures and navigable corridors. These forms may be useful to compare, but visual similarity alone cannot establish a shared mechanism. The Navigator preserves both sides of the work: the possible connection and the reason it may fail.</p></div></section>
      <section class="about-statement"><span>02</span><div><p class="eyebrow">The exploratory roof</p><h2>UTG is a framework under development—not a finished universal theory.</h2><p>Unified Transition Geometry is the working name for a common descriptive architecture around transitions between regimes. It brings event surfaces, direction, transversality, return semantics, fields and navigation into one inspectable grammar. Formal validity must still be established separately for each object, system and application domain.</p><a class="secondary-action" href="#utg">Inspect the UTG framework →</a></div></section>
      <section class="about-statement"><span>03</span><div><p class="eyebrow">The connection architecture</p><h2>Families organize recurring relational work.</h2><p>The seven Connection Families are functional lenses. They locate whether an object contributes a record, an address or boundary, a transition operator, a direction field, a connectivity structure, a synchronization or control relation, or a validation and governance record. They organize comparison; they do not certify identity.</p><a class="secondary-action" href="#families">Open the seven families →</a></div></section>
      <section class="about-statement"><span>04</span><div><p class="eyebrow">The claim boundary</p><h2>Every strong visual needs an equally visible status.</h2><p>The Navigator distinguishes source records, explanatory reconstructions, computational experiments, preregistered tests and formal candidates. A visual may clarify an idea without validating it. A successful test may validate one bounded claim without validating the whole framework.</p><a class="secondary-action" href="#evidence">Inspect the evidence →</a></div></section>

      <header class="section-heading home-section-heading"><p class="eyebrow">One ecosystem · distinct responsibilities</p><h2>The Navigator is a research place within a larger journey.</h2><p>The surfaces should feel connected while remaining explicit about the kind of authority each one holds.</p></header>
      <section class="ecosystem-grid">
        <article><span>PUBLIC HOME</span><h3>NEXAH</h3><p>The public and intellectual home: Orientation, Library, Atlas and routes into the ecosystem.</p><a href="https://nexah.de/" target="_blank" rel="noreferrer">Visit nexah.de ↗</a></article>
        <article class="is-current"><span>RESEARCH MAP · YOU ARE HERE</span><h3>Science Lab Navigator</h3><p>An inspectable projection of frameworks, experiments, methods, evidence and limits.</p><a href="#atlas">Open the research atlas →</a></article>
        <article><span>DETERMINISTIC CORE</span><h3>ORION</h3><p>Certified structural artifacts within declared responsibility boundaries; no ownership of Human meaning.</p></article>
        <article><span>HUMAN-FACING WORKSPACE</span><h3>NEXAHEDRON</h3><p>One person, one question, one bounded Workspace and a Human-owned Orientation Record.</p><span class="future-link">Public route planned · not released</span></article>
      </section>

      <section class="research-question about-question"><p class="eyebrow">The central question</p><h2>Can transitions across different systems share a common, inspectable grammar without losing their distinct mathematics, evidence and claim boundaries?</h2></section>
      <section class="home-invitation about-invitation"><p class="eyebrow">Begin with a question</p><h2>Explore a connection. Inspect its boundary. Propose a better map.</h2><p>Find a system, follow one family across several objects, or open an evidence package and test whether the claimed connection survives inspection.</p><div class="hero-actions"><a class="instrument-action" href="#dynamics">Explore comparative dynamics</a><a class="secondary-action" href="https://nexah.de/about/" target="_blank" rel="noreferrer">About the NEXAH ecosystem ↗</a></div></section>`;
    setContext({ object: "About the Science Lab Navigator", boundary: "The Navigator organizes research orientation. It does not authorize publication, transfer evidence between domains or replace Human interpretation.", receipt: "Editorial copy V1 · 2026-10-06 · internal implementation" });
  }

  function navigatorMark(kind) {
    const marks = {
      question: `<svg viewBox="0 0 64 48" aria-hidden="true"><circle cx="18" cy="24" r="7"/><path d="M25 24h20M40 18l6 6-6 6"/></svg>`,
      status: `<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M10 13h30M10 24h22M10 35h36"/><circle cx="49" cy="13" r="5"/><circle cx="41" cy="24" r="5"/><circle cx="54" cy="35" r="5"/></svg>`,
      source: `<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M14 8h27l9 9v23H14z"/><path d="M41 8v10h9M21 25h22M21 32h16"/></svg>`,
      relation: `<svg viewBox="0 0 64 48" aria-hidden="true"><circle cx="13" cy="24" r="6"/><circle cx="51" cy="13" r="6"/><circle cx="51" cy="35" r="6"/><path d="M19 22l26-8M19 26l26 8"/></svg>`,
      residual: `<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M9 12h46v24H9z"/><path d="M20 24h13"/><path d="M40 18c7 0 7 12 0 12"/></svg>`
    };
    return `<span class="navigator-mark">${marks[kind] || marks.question}</span>`;
  }

  function plainFocusStatus(item) {
    const labels = {
      "FOCUS:PRIMEGRID_101": "Bounded chain · negative retained",
      "FOCUS:OIL_RIS_MULTI_LENS": "Machine-checked · Human review open",
      "FOCUS:READOUT_RECONSTRUCTION": "Bounded module · source binding open",
      "FOCUS:GLB_GATEWAY": "Custody checked · role review continues",
      "FOCUS:ARCHAEOLOGY_INTAKE": "Candidate · not admitted"
    };
    return labels[item.focus_id] || item.status_label;
  }

  function renderHomeV2() {
    const domains = list(entry?.domains);
    const focusItems = list(entry?.current_focus);
    const e8Mutatio = entityById.get("ART:E8:FAMILY_GRAPH");
    const e8MutatioHref = safeLocalHref(e8Mutatio?.internal?.local_path);
    const root7Href = "#root7";
    const lokiHref = safeLocalHref("SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html");
    const transversumHref = safeLocalHref("SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html");
    const bookHref = safeLocalHref("RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/index.html");
    const researchDeskHref = safeLocalHref("RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/A0_RESEARCH_DESK.html");
    const game4LifeA0Href = safeLocalHref("RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/A0_GAME_4_LIFE_PLUS_1.html");
    const life08ReturnHref = safeLocalHref("SCIENCE_LAB/MISSION_CONTROL_RETURN_LIFE08_BOUNDARY_CYLINDER_2026-10-11.md");
    const domainById = new Map(domains.map((domain) => [domain.domain_id, domain]));
    const routeLabel = (route) => route === "home" ? "Start" : titleCase(route);
    const domainCards = domains.map((domain) => {
      const primaryRoute = list(domain.routes)[0] || "home";
      return `<a class="domain-card" href="#${esc(primaryRoute)}">
        <span class="card-code">${esc(domain.domain_id.replace("DOMAIN:", ""))}</span>
        <strong>${esc(domain.title)}</strong>
        <p>${esc(domain.question)}</p>
        <span class="card-action">Open ${esc(routeLabel(primaryRoute))} →</span>
      </a>`;
    }).join("");
    const focusCards = focusItems.map((item, index) => {
      const sourceHref = safeLocalHref(item.controlling_record);
      const domainsText = list(item.domain_ids).map((id) => domainById.get(id)?.title || id).join(" · ");
      return `<article class="focus-card focus-${esc(item.lifecycle)}">
        <header><span class="card-code">${String(index + 1).padStart(2, "0")} · ${esc(item.short_title)}</span><span class="focus-status" title="${esc(item.status_label)}">${esc(plainFocusStatus(item))}</span></header>
        <h3>${esc(item.display_title)}</h3>
        ${item.first_use ? `<p class="focus-first-use">${esc(item.first_use)}</p>` : ""}
        <p>${esc(item.plain_summary)}</p>
        <dl class="focus-meta">
          <div><dt>Why current</dt><dd>${esc(item.why_current)}</dd></div>
          <div><dt>Next step</dt><dd>${esc(item.next_step)}</dd></div>
          <div><dt>Domains</dt><dd>${esc(domainsText)}</dd></div>
        </dl>
        <p class="focus-boundary"><strong>Boundary</strong> ${esc(item.claim_boundary)}</p>
        <footer><a class="mini-action primary" href="#${esc(item.primary_route)}">${esc(item.primary_action)} →</a>${sourceHref ? `<a class="mini-action" href="${sourceHref}">Controlling record ↗</a>` : ""}</footer>
      </article>`;
    }).join("");

    app.innerHTML = `<section class="hero home-hero navigator-home-hero">
      <div>
        <p class="eyebrow">NEXAH Science Lab Navigator · Source &amp; Relation Graph</p>
        <h1>See what was found.<br>Trace what supports it.<br>Keep the open visible.</h1>
        <p class="lede">This is the Science Lab's central map. It points to findings, studies, sources, relations and open frontiers without repeating the records that govern them.</p>
        <div class="hero-actions home-actions"><a class="instrument-action" href="#findings-frontiers">What has NEXAH found?</a><a class="secondary-action" href="#lab-register">Which studies exist?</a><a class="secondary-action" href="#catalog">Find a source</a></div>
      </div>
      <aside class="home-question navigator-role" aria-label="What the Science Lab Navigator does"><p class="overline">START · use it as a map</p><p>Find the claim.</p><p>Open its record.</p><p>Follow its relation.</p><p>Retain its boundary.</p></aside>
    </section>
    <p class="home-boundary">The Navigator belongs to the NEXAH Science Lab. Original packages retain scientific authority; Mission Control governs currentness and release. The map does not turn resemblance into proof.</p>

    <section class="navigator-compass" aria-labelledby="navigator-compass-title">
      <header><p class="eyebrow">Five pointers · the shortest route</p><h2 id="navigator-compass-title">Start with the question you actually have.</h2><p>Each pointer opens the responsible view. The Start page only keeps the overview.</p></header>
      <div class="navigator-compass-grid">
        <a href="#findings-frontiers">${navigatorMark("question")}<span>01</span><strong>Findings &amp; Frontiers</strong><small>What is exact, bounded, negative, historical or open?</small></a>
        <a href="#lab-register">${navigatorMark("status")}<span>02</span><strong>Lab Register</strong><small>Which study carries the work and what is its lifecycle?</small></a>
        <a href="#catalog">${navigatorMark("source")}<span>03</span><strong>Source Catalog</strong><small>Which record actually carries the statement?</small></a>
        <a href="#relations">${navigatorMark("relation")}<span>04</span><strong>Relations</strong><small>What is connected—and what is explicitly not identical?</small></a>
        <a href="#admission">${navigatorMark("residual")}<span>05</span><strong>Admission</strong><small>What remains candidate, unresolved or outside the graph?</small></a>
      </div>
    </section>

    <details class="navigator-human-view"><summary>Human View · How do I begin?</summary><div><p>You do not need the whole system first. Ask: <strong>What am I looking at, which source says it, and how well is it supported?</strong></p><p>Begin with Findings &amp; Frontiers. Open a source only when you want the evidence behind the summary.</p></div></details>

    <header class="section-heading flagship-heading"><p class="eyebrow">Current internal flagships · one foundation, one live instrument</p><h2>Two entry points now carry the clearest NEXAH reading.</h2><p>They are connected by a declared representation method. They are not the same object, and neither card changes scientific or publication authority.</p></header>
    <section class="flagship-grid" aria-label="Current internal flagships">
      <article class="flagship-card a0-flagship">
        <header><span>FOUNDATION · ART:A0:MATHEMATICAL_JOINTS</span><strong>Source-bound · documentary + exact instruments</strong></header>
        <h2>A0<br>Foundation</h2>
        <p>The book, mathematical joints, Research Desk and evidence lineage now form one inspectable route from orientation grammar to exact representation instruments, work protocols and retained research questions.</p>
        <dl><div><dt>Carrier</dt><dd>A0 Book, A0-BL-031 and the existing Mathematical Joints surface.</dd></div><div><dt>Shows</dt><dd>How area, boundary, graph and joint can remain synchronized without becoming identical.</dd></div><div><dt>State</dt><dd>Internal foundation and evidence route; no new graph identity and no public release.</dd></div></dl>
        <p class="flagship-boundary"><strong>Boundary</strong> Exact representation arithmetic does not establish a physical channel, shared mechanism or universal ontology.</p>
        <footer><a class="mini-action primary" href="#a0-orientation-evidence">Open A0 evidence lineage →</a>${researchDeskHref ? `<a class="mini-action" href="${researchDeskHref}">Open A0 Research Desk ↗</a>` : ""}${bookHref ? `<a class="mini-action" href="${bookHref}">Read A0 Book ↗</a>` : ""}${game4LifeA0Href ? `<a class="mini-action" href="${game4LifeA0Href}">Open GAME 4 LIFE +1 ↗</a>` : ""}</footer>
      </article>
      <article class="flagship-card life-flagship">
        <header><span>INSTRUMENT · LIFE08 POST-CLOSE LAYER</span><strong>Closed Study · synchronized observation</strong></header>
        <h2>GAME 4<br>LIFE +1</h2>
        <p>One deterministic Conway transition is read through the field, event register, phase/control reading, 3D observatory and boundary residual while every event keeps its address and identity.</p>
        <dl><div><dt>4</dt><dd>Event, birth, survival and death remain distinct quaternion slots.</dd></div><div><dt>+1</dt><dd>Q° carries the declared rule, boundary and time control instead of acting as a fifth Life force.</dd></div><div><dt>Shows</dt><dd>Which patterns appear only when synchronized views can be compared and inverted.</dd></div></dl>
        <p class="flagship-boundary"><strong>Boundary</strong> The instrument does not reopen LIFE08, change B3/S23, create a biological mechanism or make Chemistry, Life and Spin identical.</p>
        <footer><a class="mini-action primary" href="#life-orbit">Open LIFE programme lens →</a>${game4LifeA0Href ? `<a class="mini-action" href="${game4LifeA0Href}">Open A0 instrument window ↗</a>` : ""}${life08ReturnHref ? `<a class="mini-action" href="${life08ReturnHref}">Open LIFE08 Return ↗</a>` : ""}</footer>
      </article>
    </section>
    <section class="flagship-bridge" aria-label="Flagship relation"><div><span>A0 supplies</span><strong>a typed grammar for comparing representations</strong></div><b>↔</b><div><span>LIFE08 supplies</span><strong>one deterministic carrier with synchronized readings</strong></div><a href="#relations">Inspect relations →</a></section>

    <section class="research-question compact-question" aria-labelledby="research-question-title"><p class="eyebrow">Current research direction</p><h2 id="research-question-title">What remains identifiable and invariant when the same carrier is transformed, observed or represented differently—and what is introduced by view, cut or coupling?</h2><div class="hero-actions"><a class="secondary-action" href="#families">Seven research families</a><a class="secondary-action" href="#prime-base-mode">Prime · Base · Mode</a><a class="secondary-action" href="#observatory">7×8 inspection record</a></div></section>
    <header class="section-heading home-section-heading"><p class="eyebrow">Current work · explicitly bounded</p><h2>What the Lab is connecting now.</h2><p>These routes record active orientation work—not promotion, universal validity or public release.</p></header>
    <section class="focus-grid" aria-label="Current governed work">${focusCards}</section>
    <section class="home-handoff"><div><p class="eyebrow">Responsibility before depth</p><h2>Know what this instrument can—and cannot—decide.</h2><p>Read the role and authority map, or open the controlled vocabulary before entering the dense research views.</p></div><div class="hero-actions"><a class="instrument-action" href="#about">About the Navigator</a><a class="secondary-action" href="#glossary">Open Vocabulary</a></div></section>`;
    setContext({ object: "NEXAH Science Lab Navigator", boundary: manifest.authority_statement, receipt: `${entry?.content_id || "Entry content unavailable"} · ${entry?.maintained || "unknown date"}` });
  }

  function labRecordHref(sourcePath) {
    if (!sourcePath || sourcePath.startsWith("/") || /^[a-z]+:/i.test(sourcePath)) return "";
    const upOne = sourcePath.startsWith("../");
    const clean = upOne ? sourcePath.slice(3) : sourcePath;
    if (!clean || clean.includes("../")) return "";
    const encoded = clean.split("/").map(encodeURIComponent).join("/");
    return `${upOne ? "../../../" : "../../"}${encoded}`;
  }

  function registerStatusClass(status) {
    const value = String(status || "").toUpperCase();
    if (value.includes("BLOCKED")) return "blocked";
    if (value.includes("ACTIVE") || value.includes("READY")) return "active";
    if (value.includes("AWAITING") || value.includes("PENDING") || value.includes("PREREGISTERED")) return "pending";
    if (value.includes("CLOSED") || value.includes("FILED")) return "closed";
    return "other";
  }

  function renderLabRegisterCards(studies) {
    if (!studies.length) return `<section class="empty-state"><h2>No matching register entry</h2><p>Try a study ID, question, status, evidence term or next action.</p></section>`;
    return `<div class="lab-register-list">${studies.map((study) => {
      const recordHref = labRecordHref(study.primary_record?.path);
      const statusClass = registerStatusClass(study.common_status);
      return `<article class="lab-register-card status-${statusClass}">
        <header><span class="idline">${esc(study.study_id)}</span><span class="register-state ${statusClass}">${esc(statusClass)}</span></header>
        <h2>${esc(study.question)}</h2>
        <dl class="register-fields">
          <div><dt>Common Lab status</dt><dd>${esc(study.common_status)}</dd></div>
          <div><dt>Native state</dt><dd>${esc(trimText(study.native_state, 260))}</dd></div>
          <div><dt>Evidence scope</dt><dd>${esc(trimText(study.evidence_summary, 300))}</dd></div>
          <div><dt>Next authorized action</dt><dd>${esc(trimText(study.next_action, 260))}</dd></div>
        </dl>
        <footer>${recordHref ? `<a class="secondary-action" href="${recordHref}">${esc(study.primary_record.label)} ↗</a>` : `<span class="muted">Primary record retained in canonical register</span>`}</footer>
      </article>`;
    }).join("")}</div>`;
  }

  function renderLabRegister() {
    const studies = labRegister.studies;
    const classes = studies.reduce((acc, study) => {
      const key = registerStatusClass(study.common_status);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    app.innerHTML = `${pageHeader("Science Lab · canonical lifecycle window", "Lab Register", "Search the maintained Science Lab studies by identity, question, evidence state or next authorized action. This is a read-only view: LAB_REGISTER.md remains the authority.", `<a class="secondary-action" href="../../LAB_REGISTER.md">Open canonical register ↗</a>`)}
      <section class="metric-strip lab-register-metrics">
        <article><span>Studies</span><strong>${studies.length}</strong><small>owner-maintained identities</small></article>
        <article><span>Closed / filed</span><strong>${classes.closed || 0}</strong><small>bounded dispositions retained</small></article>
        <article><span>Active / ready</span><strong>${classes.active || 0}</strong><small>not automatic activation</small></article>
        <article><span>Blocked</span><strong>${classes.blocked || 0}</strong><small>explicit gates preserved</small></article>
        <article><span>Pending</span><strong>${classes.pending || 0}</strong><small>awaiting review or input</small></article>
      </section>
      <section class="panel register-authority"><p class="overline">Authority boundary</p><h2>Window, not replacement.</h2><p>${esc(labRegister.authority)}</p><p><strong>Source receipt:</strong> <span class="mono">${esc(labRegister.source_sha256)}</span></p></section>
      <section class="register-search" aria-label="Search Lab Register"><label for="lab-register-query">Find a study</label><input id="lab-register-query" type="search" placeholder="Study ID, question, status, evidence, next action…" autocomplete="off"><span id="lab-register-result-count">${studies.length} entries</span></section>
      <div id="lab-register-results">${renderLabRegisterCards(studies)}</div>`;
    const query = document.querySelector("#lab-register-query");
    const results = document.querySelector("#lab-register-results");
    const count = document.querySelector("#lab-register-result-count");
    query?.addEventListener("input", () => {
      const needle = query.value.trim().toLowerCase();
      const filtered = needle ? studies.filter((study) => Object.values(study).some((value) => {
        const text = typeof value === "object" ? JSON.stringify(value) : String(value || "");
        return text.toLowerCase().includes(needle);
      })) : studies;
      results.innerHTML = renderLabRegisterCards(filtered);
      count.textContent = `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`;
    });
    setContext({ object: "Lab Register", boundary: "This lens does not create, rename, activate, close or promote a study. LAB_REGISTER.md and the linked package records retain authority.", receipt: `${labRegister.source} · SHA-256 ${labRegister.source_sha256}` });
  }

  function renderAboutV2() {
    app.innerHTML = `${pageHeader("About the Science Lab Navigator", "The Source & Toolbox Map for Orientation research.", "NEXAH is an independent research and design laboratory developing Orientation as a discipline. The Navigator is its internal map for finding governed sources, tools, instruments, relations and evidence without turning proximity, analogy or shared vocabulary into proof.")}
      <section class="about-statement"><span>01</span><div><p class="eyebrow">The position</p><h2>Orientation begins between representations.</h2><p>A model selects variables. A map selects relations. An image selects a frame. A story selects a sequence. None contains the whole situation.</p><p>The practical question is therefore not only whether one representation is correct, but where we are, which view we are using, what it preserves or omits, how it relates to other views and which paths remain possible.</p><a class="secondary-action" href="https://nexah.de/about/" target="_blank" rel="noreferrer">Read the public About page ↗</a></div></section>
      <section class="about-statement"><span>02</span><div><p class="eyebrow">Why this instrument exists</p><h2>Finding a pattern is not yet understanding a transition.</h2><p>Complex systems can display recurring boundaries, crossings, phase drift, return structures and possible paths. These forms may be useful to compare. Visual similarity alone cannot establish a common mechanism.</p><p>The Navigator preserves both sides of a connection: what can be compared and what the comparison does not imply.</p></div></section>
      <section class="about-statement"><span>03</span><div><p class="eyebrow">How it is organized</p><h2>Framework → families → objects → evidence.</h2><p>The framework supplies shared questions and declarations. Functional families organize recurring relational work. Concrete objects retain their mathematics and provenance. Evidence remains package-local and keeps negative controls and maturity visible.</p></div></section>
      <section class="about-language source-standard"><p class="eyebrow">Science Lab source standard</p><h2>No detached claim enters as a fact.</h2><p>A governed Navigator record must retain a named source, identity or version, custody, role, relation type, evidence state, claim boundary and return path. Missing information stays missing. Negative, historical, open and non-identity states remain visible.</p><p>An item may be discoverable before it is bound. Discoverability is not admission; a link is not evidence; navigation placement is not authority.</p></section>
      <section class="does-grid" aria-label="Navigator responsibilities"><article><p class="eyebrow">The Navigator does</p><ul><li>Orient across governed and source-bound records.</li><li>Expose typed connections and their limits.</li><li>Launch registered tools and instruments.</li><li>Retain negative, historical and no-result states.</li><li>Return every bound statement to its owning source.</li></ul></article><article class="does-not"><p class="eyebrow">The Navigator does not</p><ul><li>Claim that every repository or asset is already indexed.</li><li>Certify a universal theory or turn resemblance into proof.</li><li>Silently admit an unbound intake.</li><li>Rewrite package-local verdicts or repository authority.</li><li>Activate research, runtime or publication.</li></ul></article></section>
      <section class="panel governance-panel intake-panel"><p class="overline">Consolidation boundary · Source Field → Source Graph</p><h2>One entrance, two explicit states.</h2><p>The Mission Control Source Field is the broader discovery and intake catalog: it answers <em>what may exist and where?</em> The Science Navigator is the governed Source and Relation Graph: it answers <em>what has been matched, bound, typed and returned to authority?</em></p><p class="governance-cycle"><strong>Discovery path</strong> DISCOVER / INTAKE / UNBOUND → MATCH → BIND → RELATE → EVIDENCE → RETURN</p><p>The intended consolidation is a read-only Source Field lens inside the Navigator—not a copied database and not the silent promotion of its currently unbound records.</p><div class="governance-actions"><a class="instrument-action" href="../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html#source-field">Open Source Field ↗</a><a class="secondary-action" href="#catalog">Search bound objects</a><a class="secondary-action" href="#admission">Inspect admission rules</a></div></section>
      <header class="section-heading home-section-heading"><p class="eyebrow">Repository constellation · coverage is not completeness</p><h2>The clean source remains distributed.</h2><p>The Navigator connects repository authorities; it does not absorb them. These are the principal source homes and their current relationship to this map.</p></header>
      <section class="ecosystem-grid repository-grid" aria-label="Repository source homes">
        <article class="is-current"><span>BOUND CORE · SCIENCE AUTHORITY</span><h3>NEXAH Science Lab</h3><p>Questions, preregistrations, fixtures, results, negative findings, Labreports and Navigator governance. Primary source of the present graph.</p><a href="../../../README.md">Open Science Lab ↗</a></article>
        <article><span>AUTHORITATIVE SOURCE · PARTIALLY BOUND</span><h3>NEXAH Core / NEXAH</h3><p>Framework, Orientation Language, Kernel, reference applications, Library and long-term research record. The full repository is not ingested here.</p><a href="../../../../../10%20NEXAH%20CORE/NEXAH/README.md">Open NEXAH Core ↗</a></article>
        <article><span>DISCOVERY / CURRENTNESS · READ-ONLY BRIDGE</span><h3>Mission Control</h3><p>Broader Source Field, intake and currentness. Its records remain unbound until matched to a governed Navigator identity or relation.</p><a href="../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html#source-field">Open Source Field ↗</a></article>
        <article class="repo-historical"><span>HISTORICAL / AMBIGUOUS CLONE</span><h3>NEXAH-CODEX</h3><p>Historical Codex lineage and provenance archive. It is not current NEXAH authority and is not bulk-imported; relevant records require explicit source binding.</p><a href="../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/CURRENT/ECOSYSTEM_REGISTER.md">Read the custody classification ↗</a></article>
        <article><span>DETERMINISTIC AUTHORITY · SELECTIVE LINKS</span><h3>ORION</h3><p>Certified structural artifacts and ORION-owned contracts within its frozen responsibility boundary.</p><a href="../../../../../20%20ORION/NEXAH-ORION/README.md">Open ORION ↗</a></article>
        <article><span>HUMAN / INTERACTION AUTHORITY</span><h3>NEXAHEDRON</h3><p>Human-facing workspace, presentation and explicit confirmation. Interaction does not become scientific evidence automatically.</p><a href="../../../../../40%20EXPERIENCE%20PRODUCTION/NEXAHEDRON/README.md">Open NEXAHEDRON ↗</a></article>
        <article><span>PUBLIC PRESENTATION AUTHORITY</span><h3>NEXAH Experience</h3><p>Source of nexah.de, the public Library, Living Atlas, reading spaces and routes into the ecosystem.</p><a href="../../../../../40%20EXPERIENCE%20PRODUCTION/NEXAH-Experience/README.md">Open Experience source ↗</a></article>
        <article><span>PUBLIC AND INTELLECTUAL HOME</span><h3>nexah.de</h3><p>The public entrance to Orientation, the research record and the invitation to inspect, challenge and propose better maps.</p><a href="https://nexah.de/" target="_blank" rel="noreferrer">Visit nexah.de ↗</a></article>
      </section>
      <p class="coverage-note"><strong>Coverage statement:</strong> the current Navigator is authoritative for its governed bindings and relations, not exhaustive for the ecosystem. Absence here does not mean absence from NEXAH; presence here does not transfer ownership from the source repository.</p>
      <section class="panel governance-panel"><p class="overline">Science Lab governance · source graph</p><h2>One Lab register. One Source Graph. No second scientific database.</h2><p>The Lab Constitution governs the Science Lab. <span class="mono">LAB_REGISTER.md</span> retains study identity, lifecycle and disposition authority. The Science Navigator is the Lab's central Source and Relation Graph and presents a read-only register lens. Mission Control receives a generated control projection for currentness, priority, activation, lifecycle and release.</p><p class="governance-cycle"><strong>Required cycle</strong> SEARCH → MATCH → BIND → BUILD → RETURN → GOVERN</p><div class="governance-actions"><a class="instrument-action" href="#lab-register">Open Lab Register</a><a class="secondary-action" href="../GOVERNANCE/NAVIGATOR_GOVERNANCE_INDEX_2026-10-10.md">Governance index ↗</a><a class="secondary-action" href="../GOVERNANCE/NAVIGATOR_CONSTITUTION_V1_2026-10-10.md">Navigator Charter ↗</a><a class="secondary-action" href="../GOVERNANCE/NAVIGATOR_WORKFLOW_V1_2026-10-10.md">Workflow ↗</a></div></section>
      <header class="section-heading home-section-heading"><p class="eyebrow">One ecosystem · distinct responsibilities</p><h2>The Navigator is a research place within a larger journey.</h2><p>The surfaces should feel connected while remaining explicit about the kind of authority each one holds.</p></header>
      <section class="ecosystem-grid authority-grid">
        <article><span>PUBLIC HOME</span><h3>NEXAH</h3><p>The public and intellectual entrance to the wider ecosystem.</p><a href="https://nexah.de/" target="_blank" rel="noreferrer">Visit nexah.de ↗</a></article>
        <article class="is-current"><span>RESEARCH MAP · YOU ARE HERE</span><h3>Science Lab Navigator</h3><p>Orientation, retrieval, comparison and explicit connection paths.</p><a href="#atlas">Open the research atlas →</a></article>
        <article><span>CURRENTNESS / AUTHORITY</span><h3>Mission Control</h3><p>Currentness, activation, authority and portfolio priority.</p></article>
        <article><span>RESEARCH RECORD</span><h3>Science Lab</h3><p>Discovery, experiments, evidence and bounded interpretation. The Lab Register remains the lifecycle authority.</p><a href="#lab-register">Inspect the register →</a></article>
        <article><span>SEMANTIC AUTHORITY</span><h3>OLS 1.0</h3><p>Normative semantic language; no silent extension from Navigator visuals.</p></article>
        <article><span>DETERMINISTIC CORE</span><h3>ORION</h3><p>Certified structural artifacts within declared responsibility boundaries.</p></article>
        <article><span>HUMAN / VISUAL SPACE</span><h3>NEXAHEDRON / OVS</h3><p>Human-facing and experimental representation spaces, not automatic scientific authority.</p></article>
      </section>
      <section class="about-language"><p class="eyebrow">How to read the language</p><h2>Meaning first. Vocabulary connected. Codes retained.</h2><p>The Navigator begins with a plain-language function, connects it to established or adjacent vocabulary, identifies any NEXAH-specific usage and shows the internal code only as secondary provenance.</p><p>A locally defined term is not presented as a standard scientific term. An unresolved expansion remains unresolved rather than being completed for editorial convenience.</p><div class="hero-actions"><a class="secondary-action" href="#glossary">Open Vocabulary →</a><a class="secondary-action" href="${safeLocalHref("SCIENCE_LAB/NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07.md")}">Read the framework handbook ↗</a></div></section>
      <section class="home-invitation about-invitation"><p class="eyebrow">Closing invitation</p><h2>Follow one connection all the way to its boundary.</h2><p>Choose one transition, open its instrument, inspect the relation and read the evidence beside the claim ceiling. Use the map to find a missing distinction, a counterexample or a better next test.</p><div class="hero-actions"><a class="instrument-action" href="#families">Explore a relation</a><a class="secondary-action" href="https://nexah.de/about/" target="_blank" rel="noreferrer">About the NEXAH ecosystem ↗</a></div></section>`;
    setContext({ object: "About the Science Lab Navigator · Source & Toolbox Map", boundary: "The Navigator is authoritative for its governed bindings, not exhaustive for every repository or asset. It does not admit unbound intake, authorize publication, transfer evidence between domains or replace Human interpretation.", receipt: "Editorial copy V3 · 2026-10-12 · source-field consolidation boundary · no graph-count change" });
  }

  function renderGlossary() {
    const terms = list(entry?.terms);
    app.innerHTML = `${pageHeader("Controlled first-use language", "Vocabulary", "Meaning leads. Established or adjacent vocabulary provides connection. NEXAH-specific usage and internal codes remain explicit and bounded.")}
      <p class="namespace-guard glossary-rule"><strong>Naming rule</strong> Meaning → established vocabulary → NEXAH usage → code. Unknown expansions remain unresolved.</p>
      <section class="glossary-grid">${terms.map((term) => {
        const sourceHref = safeLocalHref(term.controlling_source);
        return `<article class="glossary-card glossary-${esc(term.status)}"><header><span class="term-token">${esc(term.token || term.display_name)}</span><span class="term-status">${esc(titleCase(term.status))}</span></header><h2>${esc(term.display_name)}</h2>${term.expansion ? `<p class="term-expansion"><strong>Expansion</strong> ${esc(term.expansion)}</p>` : ""}<p>${esc(term.plain_language_definition)}</p><dl><div><dt>Established / adjacent vocabulary</dt><dd>${esc(list(term.established_or_adjacent_vocabulary).join(" · "))}</dd></div><div><dt>NEXAH usage</dt><dd>${esc(term.nexah_specific_usage)}</dd></div><div><dt>Does not mean</dt><dd>${esc(list(term.does_not_mean).join(" · "))}</dd></div></dl>${sourceHref ? `<a class="mini-action" href="${sourceHref}">Controlling source ↗</a>` : ""}</article>`;
      }).join("")}</section>`;
    setContext({ object: "Vocabulary", boundary: "A local term remains local unless its controlling authority admits it. Similar words across domains do not transfer equations, mechanisms or evidence.", receipt: `${terms.length} controlled first-use records · ${entry?.maintained || "unknown date"}` });
  }

  function renderEntryFamilyMap() {
    const fullMap = entityById.get("ART:ATLAS:MAP_V2");
    const fullMapHref = safeLocalHref(fullMap?.internal?.local_path);
    const canonical = Object.entries(FAMILY_NAMES).map(([family, name]) => `<a class="entry-family family-${esc(family.slice(-2).toLowerCase())}" href="${familyHref(family)}">
      <span>${esc(family.replace("CF:", ""))}</span><strong>${esc(name)}</strong><small>${familyCounts[family] || 0} registered objects</small>
    </a>`).join("");
    return `<section class="entry-map" aria-label="Interactive connection-family map">
      <header><div><p class="eyebrow">Interactive orientation map</p><h2>Framework above · families below</h2></div><p>Enter through one canonical relation family. The proposed axis extension and the historical cultural shelf remain visibly separate.</p></header>
      <div class="entry-map-grid">${canonical}
        <a class="entry-family candidate-family" href="#sequence"><span>CAND:F8</span><strong>Axis extension</strong><small>Owner hypothesis · open bridge</small></a>
        <a class="entry-family historical-family" href="#catalog"><span>HL:F8</span><strong>Human / cultural orientation</strong><small>Historical shelf · not CF:F8</small></a>
      </div>
      <footer><span>No canonical F8 or F9 is currently registered.</span><span class="entry-map-actions">${fullMapHref ? `<a href="${fullMapHref}">Open Family Connection Map ↗</a>` : ""}<a href="#atlas">Open Connection Atlas →</a></span></footer>
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
        <div class="utg-actions"><a class="secondary-action" href="#envelope">Open Envelope definition →</a><a class="secondary-action" href="${safeLocalHref(utg.controlling_records?.mathematical_glossary)}">Open mathematical glossary →</a><a class="secondary-action" href="#lineage">Open visual + GLB lineage →</a><a class="secondary-action" href="#evidence">Inspect evidence →</a><a class="secondary-action" href="#admission">Check release boundary →</a></div>
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

  function renderEnvelope() {
    const envelope = utg?.envelope_framework;
    if (!envelope) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Envelope definition unavailable</h1><p>Rebuild <span class="mono">utg.internal.js</span> and reload this page.</p></section>`;
      return;
    }
    const recordHref = safeLocalHref(utg.controlling_records?.envelope_archaeology_and_typing);
    app.innerHTML = `${pageHeader("Controlled UTG vocabulary · transversal role", "Envelope", "A boundary, modulation, containment or record around a declared carrier—not a new family and not one universal mechanism.", recordHref ? `<a class="instrument-action" href="${recordHref}">Open archaeology record ↗</a>` : "")}
      <section class="envelope-definition panel">
        <p class="overline">Operational definition</p>
        <h2>${esc(envelope.title)}</h2>
        <p>${esc(envelope.definition)}</p>
        <div class="envelope-grammar" aria-label="Carrier Envelope Cut Return Residual Record grammar">${list(envelope.short_grammar).map((step, index) => `<span><small>${String(index + 1).padStart(2, "0")}</small>${esc(step)}</span>`).join("")}</div>
        <p class="lineage-boundary"><strong>Family boundary</strong> ${esc(envelope.family_status)}</p>
      </section>

      <header class="section-heading"><p class="eyebrow">Nine typed uses</p><h2>Same word, different declared objects</h2><p>Select the subtype before comparing examples. Every subtype requires its own carrier, rule and evidence.</p></header>
      <section class="envelope-type-grid">${list(envelope.subtypes).map((item) => `<article>
        <span class="idline">${esc(item.type_id)} · ${esc(item.state)}</span><h3>${esc(item.title)}</h3><p>${esc(item.definition)}</p>
        <div class="tag-row">${list(item.family_routes).map((family) => `<a class="tag family" href="${familyHref(family)}">${esc(family)}</a>`).join("")}</div>
        <div class="lineage-boundary"><strong>Declare</strong> ${esc(list(item.minimum_declaration).join(" · "))}</div>
      </article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Recovered lineage</p><h2>Existing NEXAH uses, now separated by type</h2><p>Lineage explains why the term recurs. It does not make the examples identical.</p></header>
      <section class="envelope-lineage">${list(envelope.lineage).map((item) => `<article>
        <span class="idline">${esc(item.lineage_id)}</span><h3>${esc(item.title)}</h3><div class="tag-row">${list(item.subtypes).map((type) => `<span class="tag family">${esc(type)}</span>`).join("")}</div><p>${esc(item.assessment)}</p><a class="secondary-action" href="${safeLocalHref(item.source)}">Open source →</a>
      </article>`).join("")}</section>

      <section class="detail-layout envelope-gate">
        <article class="panel source-panel"><p class="overline">Formalization gate</p><h2>When S = g(zeta) becomes testable</h2><ol>${list(envelope.formalization_gate).map((item) => `<li>${esc(item)}</li>`).join("")}</ol></article>
        <article class="panel boundary-panel"><p class="overline">Claim ceiling</p><h2>What this definition does not claim</h2><p>${esc(envelope.claim_boundary)}</p><p><strong>Current status:</strong> ${esc(envelope.status)}</p></article>
      </section>`;
    setContext({ object: "Envelope · transversal UTG role", boundary: envelope.claim_boundary, receipt: `${envelope.framework_id} · ${envelope.subtypes.length} typed uses · ${utg.controlling_records?.envelope_archaeology_and_typing}` });
  }

  function renderLadders() {
    if (!ladders || !Array.isArray(ladders.core_ladders) || ladders.core_ladders.length !== 8) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Ladder Atlas unavailable</h1><p>Rebuild <span class="mono">ladders.internal.js</span> and reload this page.</p></section>`;
      return;
    }
    const renderSourceAction = (item) => {
      const route = item.route || "";
      const source = safeLocalHref(item.instrument || item.source || item.controlling_source);
      if (route) return `<a class="secondary-action" href="${esc(route)}">Open Navigator route →</a>`;
      return source ? `<a class="secondary-action" href="${source}">Open controlling source ↗</a>` : "";
    };
    const renderLadderCard = (ladder, index) => {
      const visualHref = safeLocalHref(ladder.visual);
      const sourceHref = safeLocalHref(ladder.controlling_source);
      const instrumentHref = safeLocalHref(ladder.instrument);
      return `<article class="ladder-card ladder-status-${esc(ladder.status_class)}">
        ${visualHref ? `<a class="ladder-visual" href="${visualHref}"><img src="${visualHref}" alt="${esc(ladder.title)} source visual" loading="lazy"></a>` : ""}
        <div class="ladder-card-body">
          <div class="ladder-card-head"><span class="ladder-number">${String(index + 1).padStart(2, "0")}</span><span class="ladder-status">${esc(ladder.status)}</span></div>
          <p class="idline">${esc(ladder.ladder_id)} · ${esc(ladder.family)}</p><h2>${esc(ladder.title)}</h2><p>${esc(ladder.summary)}</p>
          <dl class="ladder-fields">
            <div><dt>Type</dt><dd>${esc(ladder.type)}</dd></div>
            <div><dt>Carrier</dt><dd>${esc(ladder.carrier)}</dd></div>
            <div><dt>Operator</dt><dd>${esc(ladder.operator)}</dd></div>
            <div><dt>Invariant</dt><dd>${esc(ladder.invariant)}</dd></div>
            <div><dt>Information loss</dt><dd>${esc(ladder.information_loss)}</dd></div>
            <div><dt>Return condition</dt><dd>${esc(ladder.return_condition)}</dd></div>
          </dl>
          <div class="ladder-rungs"><strong>Rungs / order</strong><ol>${list(ladder.rungs).map((rung) => `<li>${esc(rung)}</li>`).join("")}</ol></div>
          <div class="ladder-claim"><strong>Claim ceiling</strong><p>${esc(ladder.claim_ceiling)}</p></div>
          <div class="ladder-nonclaim"><strong>Does not imply</strong><p>${esc(list(ladder.does_not_imply).join(" · "))}</p></div>
          ${ladder.note ? `<p class="ladder-note"><strong>Version note</strong> ${esc(ladder.note)}</p>` : ""}
          <div class="ladder-card-footer"><span>Verified ${esc(ladder.last_verified)}</span><span class="ladder-actions">${instrumentHref ? `<a href="${instrumentHref}">Open instrument ↗</a>` : ""}${sourceHref ? `<a href="${sourceHref}">Source ↗</a>` : ""}</span></div>
        </div>
      </article>`;
    };
    app.innerHTML = `${pageHeader("Internal comparison surface · eight-card core", ladders.title, ladders.summary)}
      <section class="ladder-boundary"><strong>Comparison boundary</strong><p>${esc(ladders.claim_boundary)}</p></section>
      ${renderBreathBridge("Ladder → executable sequence")}
      ${renderCarrierViewJoint()}
      <section class="ladder-question-grid" aria-label="Four ladder orientation questions">${ladders.questions.map((item, index) => `<article class="accent-${esc(item.accent)}"><span>Q${index + 1}</span><h2>${esc(item.title)}</h2><p>${esc(item.question)}</p></article>`).join("")}</section>

      <section class="ladder-status-key" aria-label="Ladder status key">${ladders.status_legend.map((item) => `<article class="ladder-status-${esc(item.class)}"><strong>${esc(item.label)}</strong><p>${esc(item.definition)}</p></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Eight core ladders</p><h2>Compare the contract, not the silhouette</h2><p>Every card names the carrier, operation, invariant, loss and return before suggesting a connection.</p></header>
      <section class="ladder-grid">${ladders.core_ladders.map(renderLadderCard).join("")}</section>

      <details class="ladder-drawer">
        <summary><span>More validation and research ladders</span><small>${ladders.supporting_ladders.length} bounded routes</small></summary>
        <div class="ladder-support-grid">${ladders.supporting_ladders.map((item) => `<article><span class="idline">${esc(item.status)}</span><h3>${esc(item.title)}</h3><p>${esc(item.role)}</p>${renderSourceAction(item)}</article>`).join("")}</div>
      </details>

      <details class="ladder-drawer historical-drawer">
        <summary><span>Historical metaphor archive</span><small>${ladders.historical_metaphors.length} provenance groups</small></summary>
        <div class="historical-warning"><strong>HISTORICAL METAPHOR · PROVENANCE ONLY · NOT EVIDENCE OF A MECHANISM</strong><p>These records explain vocabulary and visual lineage. They stay outside the formal core unless a carrier, operator, invariant and test are separately declared.</p></div>
        <div class="ladder-support-grid">${ladders.historical_metaphors.map((item) => `<article class="historical-item"><span class="idline">${esc(item.provenance_state)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(item.boundary)}</p></article>`).join("")}</div>
      </details>

      <section class="detail-layout ladder-governance">
        <article class="panel source-panel"><p class="overline">Editorial rules</p><h2>How the atlas stays readable</h2><ol>${ladders.editorial_rules.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></article>
        <article class="panel residual-panel"><p class="overline">Known version conflicts</p><h2>Nothing is silently harmonized</h2>${ladders.known_version_conflicts.map((item) => `<div class="version-conflict"><strong>${esc(item.title)}</strong><p>${esc(item.resolution)}</p></div>`).join("")}</article>
      </section>`;
    setContext({ object: "Ladder Atlas · eight-card core", boundary: ladders.claim_boundary, receipt: `${ladders.binder_id} · ${ladders.maintained} · ${ladders.core_ladders.length} core · internal only` });
  }

  function renderCarrierViewJoint() {
    const joint = ladders?.carrier_view_joint;
    const comparator = ladders?.spectral_comparator;
    if (!joint || !Array.isArray(joint.bindings)) return "";
    const recordHref = safeLocalHref(joint.controlling_record);
    return `<section class="carrier-view-joint">
      <header><div><p class="overline">Existing identities · source-bound crosswalk</p><h2>${esc(joint.title)}</h2><p>${esc(joint.summary)}</p></div><span class="joint-status">${esc(joint.status)}</span></header>
      <div class="joint-grammar" aria-label="Carrier view slice boundary residual return grammar">${list(joint.grammar).map((step, index) => `<span><small>${String(index + 1).padStart(2, "0")}</small>${esc(step.replaceAll("_", " / "))}</span>`).join("")}</div>
      <p class="lineage-boundary"><strong>Slice rule</strong> ${esc(joint.slice_rule)}</p>
      <div class="joint-binding-grid">${joint.bindings.map((binding) => {
        const evidenceHref = safeLocalHref(binding.evidence?.[0]);
        return `<article><span class="idline">${esc(binding.relation)}</span><h3>${esc(binding.source)} <b>→</b> ${esc(binding.target)}</h3><p><strong>Preserves</strong> ${esc(list(binding.preserves).join(" · "))}</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(binding.boundary)}</p>${evidenceHref ? `<a class="secondary-action" href="${evidenceHref}">Open evidence →</a>` : ""}</article>`;
      }).join("")}</div>
      ${comparator ? `<article class="spectral-comparator"><div><p class="overline">${esc(comparator.status)}</p><h3>${esc(comparator.title)}</h3><p>${esc(comparator.graph_object)} ${esc(comparator.comparison_object)}</p><p>${esc(comparator.use)}</p>${comparator.result ? `<p class="lineage-boundary"><strong>Result</strong> ${esc(comparator.result)} · ${esc(comparator.result_summary)}</p>` : ""}${comparator.secondary_diagnostic_result ? `<p class="lineage-boundary"><strong>Secondary localization</strong> ${esc(comparator.secondary_diagnostic_result)} · ${esc(comparator.secondary_diagnostic_summary)}</p>` : ""}<p class="lineage-boundary"><strong>Offset guard</strong> ${esc(comparator.offset_guard)}</p><p class="lineage-boundary"><strong>Rank amendment</strong> ${esc(comparator.rank_direction_amendment)}</p></div><div class="comparator-boundary"><strong>Primary</strong><p>${esc(comparator.primary_statistic)}</p><strong>Nulls</strong><p>${esc(comparator.null_population)}</p><strong>Correction</strong><p>${esc(comparator.terminal_correction)}</p><strong>STOP</strong><p>${esc(comparator.stop_rule)}</p>${safeLocalHref(comparator.secondary_diagnostic_report) ? `<a class="secondary-action" href="${safeLocalHref(comparator.secondary_diagnostic_report)}">Open Check 73 diagnostic →</a>` : ""}${safeLocalHref(comparator.result_report) ? `<a class="secondary-action" href="${safeLocalHref(comparator.result_report)}">Open Check 71 result →</a>` : ""}${safeLocalHref(comparator.preregistration) ? `<a class="secondary-action" href="${safeLocalHref(comparator.preregistration)}">Open Check 69 preregistration →</a>` : ""}${safeLocalHref(comparator.run_contract_candidate) ? `<a class="secondary-action" href="${safeLocalHref(comparator.run_contract_candidate)}">Open Check 70 run contract →</a>` : ""}</div></article>` : ""}
      <div class="joint-actions">${recordHref ? `<a class="instrument-action" href="${recordHref}">Open Check 68 binding ↗</a>` : ""}</div>
    </section>`;
  }

  function renderBreathBridge(kicker) {
    const breath = ladders?.breath_sequencer;
    if (!breath) return "";
    const instrumentHref = safeLocalHref(breath.instrument);
    const sourceHref = safeLocalHref(breath.controlling_source);
    const provenanceHref = safeLocalHref(breath.historical_provenance);
    return `<section class="breath-bridge">
      <div class="breath-copy"><p class="overline">${esc(kicker)}</p><h2>${esc(breath.title)}</h2><p>${esc(breath.summary)}</p>
        <div class="breath-lenses">${list(breath.lenses).map((item) => `<span>${esc(item)}</span>`).join("")}</div>
        <p class="lineage-boundary"><strong>Boundary</strong> ${esc(breath.claim_boundary)}</p>
        <div class="breath-actions">${instrumentHref ? `<a class="instrument-action" href="${instrumentHref}">Open Breath Sequencer ↗</a>` : ""}${sourceHref ? `<a class="secondary-action" href="${sourceHref}">Read contract →</a>` : ""}${provenanceHref ? `<a class="secondary-action" href="${provenanceHref}">Historical custody →</a>` : ""}</div>
      </div>
      <div class="breath-mini" aria-label="CON Stillpoint DAO sequence"><div class="breath-side con"><strong>CON</strong><span>6 · 5 · 4 · 3 · 2 · 1</span></div><div class="breath-still"><strong>STILL</strong><span>source 0</span><span>role 1 / UNITY</span><small>dwell 2</small></div><div class="breath-side dao"><strong>DAO</strong><span>1 · 2 · 3 · 4 · 5 · 6</span></div><div class="breath-janus">J²=id · J(STILL)=STILL</div></div>
    </section>`;
  }

  function renderDynamics() {
    const comparison = utg?.comparative_dynamics;
    if (!comparison || !Array.isArray(comparison.systems)) {
      app.innerHTML = `<section class="empty-state error-state"><p class="eyebrow">Load error</p><h1>Comparative Dynamics binder unavailable</h1><p>Rebuild <span class="mono">utg.internal.js</span> and reload this page.</p></section>`;
      return;
    }
    const shortHash = (hash) => hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : "not available";
    const mediaById = new Map(comparison.media.map((item) => [item.media_id, item]));
    const renderDynamicsMedia = (media) => {
      const href = safeLocalHref(media.file);
      return `<article class="media-library-card">
        <a class="dynamics-media" href="${href}"><img src="${href}" alt="${esc(media.title)}" loading="lazy"></a>
        <div><span class="idline">${esc(media.media_id)} · ${esc(media.evidence_label || "HISTORICAL VISUAL")}</span><h3>${esc(media.title)}</h3><p>${esc(media.description)}</p>
        <div class="tag-row">${list(media.connection_families).map((item) => `<span class="tag family">${esc(item)}</span>`).join("")}</div>
        <p class="lineage-boundary"><strong>Boundary</strong> ${esc(media.claim_boundary)}</p>
        <div class="visual-receipt"><span>${esc(media.dimensions)}</span><span class="mono">${esc(shortHash(media.sha256))}</span><a href="${href}">Open ${esc(media.format)} ↗</a></div></div>
      </article>`;
    };
    app.innerHTML = `${pageHeader("UTG carrier comparison · internal", comparison.title, comparison.summary)}
      <section class="dynamics-status-strip" aria-label="Comparative dynamics status">
        <article><strong>${comparison.systems.length}</strong><span>declared carriers</span></article>
        <article><strong>${comparison.systems.filter((item) => item.evidence_state.includes("FORMAL PASS")).length}</strong><span>object-specific formal pass</span></article>
        <article><strong>${comparison.media.filter((item) => item.format === "GIF").length}</strong><span>recovered Core animations</span></article>
        <article><strong>0</strong><span>generic cross-system claims adopted</span></article>
      </section>

      <section class="dynamics-layer-key" aria-label="Evidence layer key">
        <article class="tone-green"><span>FORMAL CONTROL</span><p>Declared objects, controls and acceptance gates passed for one bounded carrier.</p></article>
        <article class="tone-cyan"><span>COMPUTATIONAL CANDIDATE</span><p>Executable or measured material that still needs a UTG-specific contract.</p></article>
        <article class="tone-violet"><span>HISTORICAL VISUAL</span><p>Useful provenance or intuition; not independent evidence for a mechanism.</p></article>
        <article class="tone-amber"><span>MEASUREMENT LAYER</span><p>Lyapunov, FTLE and related quantities describe dynamics; they are not carriers.</p></article>
      </section>

      <header class="section-heading"><p class="eyebrow">Carrier map</p><h2>Same contract family · system-specific gates</h2><p>No common section is assumed. Each carrier must declare its own event function, orientation, transversality and return semantics.</p></header>
      <section class="dynamics-grid">${comparison.systems.map((system) => {
        const media = comparison.media.find((item) => item.media_id === system.primary_media_id);
        const href = media ? safeLocalHref(media.file) : "";
        return `<article class="dynamics-card ${esc(system.tone)}">
          ${href ? `<a class="dynamics-media" href="${href}"><img src="${href}" alt="${esc(media.title)}" loading="lazy"></a>` : ""}
          <div class="dynamics-card-body"><span class="idline">${esc(system.system_id)} · ${esc(system.evidence_state)}</span><h2>${esc(system.title)}</h2><p class="dynamics-role">${esc(system.role)}</p>
          <div class="tag-row">${list(system.available_layers).map((item) => `<span class="tag family">${esc(item)}</span>`).join("")}</div>
          <dl class="dynamics-definition"><div><dt>UTG bridge</dt><dd>${esc(system.utg_bridge)}</dd></div><div><dt>Current limit</dt><dd>${esc(system.current_limit)}</dd></div><div><dt>Next contract</dt><dd>${esc(system.next_contract)}</dd></div></dl>
          <p class="source-path"><strong>Core source</strong><span class="mono">${esc(system.core_source)}</span></p>
          ${media ? `<div class="visual-receipt"><span>${esc(media.dimensions)}</span><span class="mono">${esc(shortHash(media.sha256))}</span><a href="${href}">Open ${esc(media.format)} ↗</a></div>` : ""}
          </div></article>`;
      }).join("")}</section>

      <header class="section-heading"><p class="eyebrow">V69 placement</p><h2>Field is a representation layer — not an eighth family</h2><p>The connection families name functional relations. V69 crosses several of them because it turns an observed trajectory into a directional field and then supports transition or control operations.</p></header>
      <section class="field-classification">
        <article class="field-object"><span>REPRESENTATION</span><strong>${esc(comparison.v69_classification.representation)}</strong><p>${esc(comparison.v69_classification.object_definition)}</p></article>
        ${list(comparison.v69_classification.family_roles).map((role) => `<article class="${role.primary ? "is-primary" : ""}"><span>${esc(role.family)}</span><strong>${esc(role.role)}</strong><p>${esc(role.reason)}</p></article>`).join("")}
      </section>
      <section class="panel boundary-panel"><p class="overline">V69 assessment</p><h2>Reconstructed extension field, not directly observed ground truth</h2><p>${esc(comparison.v69_classification.assessment)}</p><p class="lineage-boundary"><strong>Boundary</strong> ${esc(comparison.v69_classification.claim_boundary)}</p></section>

      ${list(comparison.collections).map((collection) => `<section class="dynamics-collection">
        <header class="section-heading"><p class="eyebrow">${esc(collection.collection_id)} · ${esc(collection.evidence_label)}</p><h2>${esc(collection.title)}</h2><p>${esc(collection.summary)}</p></header>
        <div class="dynamics-collection-grid">${list(collection.media_ids).map((id) => mediaById.get(id)).filter(Boolean).map(renderDynamicsMedia).join("")}</div>
        <p class="collection-boundary"><strong>Collection boundary</strong> ${esc(collection.claim_boundary)}</p>
      </section>`).join("")}

      <section class="panel dynamics-next"><p class="overline">Registered next test · not executed</p><h2>${esc(comparison.next_test.test_id)} · ${esc(comparison.next_test.title)}</h2><p>${esc(comparison.next_test.purpose)}</p>
        <ol>${list(comparison.next_test.requirements).map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
        <p class="lineage-boundary"><strong>Stop rule</strong> ${esc(comparison.next_test.stop_rule)}</p>
      </section>
      <section class="panel boundary-panel"><p class="overline">Lyapunov / FTLE placement</p><h2>Measure, do not add as a fifth system</h2><p>${esc(comparison.lyapunov_boundary)}</p></section>`;
    setContext({ object: comparison.title, boundary: comparison.claim_boundary, receipt: `${comparison.binder_id} · Core ${comparison.core_snapshot.slice(0, 12)} · ${comparison.media.length} media receipts · ${comparison.collections.length} collections` });
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

    app.innerHTML = `${pageHeader("Clickable system inventory", "The Connection Atlas", "This view shows which concrete modules and instruments are registered in each family. Use the Family Connection Map to inspect how the families and research routes relate.", fullAtlasHref ? `<a class="instrument-action" href="${fullAtlasHref}">Open Family Connection Map ↗</a>` : "")}
      ${renderFeaturedEvidenceCase("atlas")}
      <section class="atlas-zoom-guide"><article><span>RELATION VIEW</span><h2>Family Connection Map</h2><p>What connects to what? Families, typed edges, route examples and open research frontiers.</p>${fullAtlasHref ? `<a href="${fullAtlasHref}">Open relation map ↗</a>` : ""}</article><article class="is-current"><span>INVENTORY VIEW · YOU ARE HERE</span><h2>Connection Atlas</h2><p>What exists in each family? Registered modules, instruments, overlaps and source routes.</p></article></section>
      <p class="atlas-status-note"><strong>Family status ≠ bridge status.</strong> F6 contains ${familyCounts["CF:F6"] || 0} registered objects although its generic incoming bridges remain open. F7 contains ${familyCounts["CF:F7"] || 0} objects and acts transversally across validation and governance.</p>
      <div class="atlas-toolbar"><a href="#sequence">Read the directed sequence →</a><a href="#catalog">Search all ${entities.length} objects →</a><a href="#relations">Inspect ${relations.length} typed edges →</a><a href="${entityHref("ART:ATLAS:MAP_V2")}">Inspect atlas source receipt →</a></div>
      <section class="system-map" aria-label="Seven clickable connection-family fields">${familyColumns}</section>`;
    setContext({ object: "Connection atlas", boundary: "The atlas shows registered family overlap and typed routes. Spatial proximity and repeated membership do not establish mechanism identity.", receipt: fullAtlas ? `${fullAtlas.entity_id} · ${fullAtlas.internal?.local_path}` : receiptSummary() });
  }

  function renderSequence() {
    const atlas = entityById.get("ART:ATLAS:MAP_V2");
    const atlasHref = safeLocalHref(atlas?.internal?.local_path);
    const anchor = (id) => atlasHref ? `${atlasHref}#${id}` : "#atlas";
    const carrierAuditHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/P6R01_PENTAGON_HEXAGON_RESIDUAL_GEOMETRY_AUDIT/12_FINAL_P6R01_DECISION.md");
    const viewOperatorAuditHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_VIEW_OPERATOR_AUDIT_01_RECIPROCAL_POLAR_DFT_2026-10-07/01_RESULT_ASSESSMENT.md");
    const multiLensAuditHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_OIL_RIS_MULTI_LENS_REVEAL_AUDIT_2026-10-07/01_RESULT_ASSESSMENT.md");
    const circleStages = [
      {
        number: "01",
        title: "Phase / gate source",
        detail: "Five-H supplies the already registered phase-and-gate comparison route.",
        status: "EXISTING · BOUNDED",
        href: entityHref("MOD:FIVE_H_PHASE_CUT")
      },
      {
        number: "02",
        title: "Number / view audits",
        detail: "H_Q, F50→SNCE, E-Line/Fourier/Poincaré and Eleven/Janus remain distinct views in one suite.",
        status: "EXISTING · BOUNDED",
        href: entityHref("MOD:NUMBER_VIEW_SUITE")
      },
      {
        number: "03",
        title: "Eight-state lift",
        detail: "BLOCK-01 generates the finite binary carrier states used by the next transform.",
        status: "8/8 TESTS",
        href: entityHref("ART:TESSAREC:PRIMEGRID_BLOCK01_STATE_LIFT")
      },
      {
        number: "04",
        title: "DFT shift / return",
        detail: "BLOCK-02 changes spectral coordinates and verifies exact inverse return.",
        status: "EXACT FIXTURE",
        href: entityHref("ART:TESSAREC:PRIMEGRID_BLOCK02_DFT_RETURN")
      },
      {
        number: "05",
        title: "Pascal quotient / address",
        detail: "BLOCK-02A returns the carrier to Number/View as Hamming-weight fibers plus residual ordinal.",
        status: "9/9 GATES · RETURN",
        href: entityHref("ART:NUMBER:PRIMEGRID_BLOCK02A_PASCAL")
      },
      {
        number: "06",
        title: "Trinary Pascal / antipode",
        detail: "BLOCK-02B lifts into the three-state Pascal pyramid, retains one global orientation, and adds a bounded 101/O-lane bridge: six state marks, ø cut, œ seam.",
        status: "12/12 GATES · 101/O8 ADDENDUM",
        href: entityHref("ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE")
      },
      {
        number: "07",
        title: "Prime address / controls",
        detail: "BLOCK-03 retains an exact prime selector but rejects a prime-specific coding advantage against matched controls.",
        status: "10/10 GATES · VALID NEGATIVE",
        href: entityHref("ART:NUMBER:PRIMEGRID_BLOCK03_PRIME_CONTROL")
      },
      {
        number: "08",
        title: "Readout / reconstruction / GLB",
        detail: "Recovered MRB and ACR controls connect groove-to-time, compatibility, reversible mixing, lossy projection and residual return to the canonical OIL/RIS and P/Q GLBs.",
        status: "6/6 INTAKE GATES · ACR-42 FONT QUARANTINE",
        href: entityHref("ART:READOUT:GLB_GATEWAY")
      }
    ];
    const operatorComparisons = [
      { label: "Q-Mirror", formula: "Q(z)=1/z", result: "Involution for z ≠ 0", boundary: "Undefined at zero · near-zero ill-conditioned", tone: "cyan" },
      { label: "HZ/FZ", formula: "(x,y) ↔ (r,θ)", result: "Observed vector returns", boundary: "Origin angle is not identifiable", tone: "violet" },
      { label: "Finite DFT", formula: "x ↔ DFT(x)", result: "Complex inverse return", boundary: "Magnitude alone has 8-way collision", tone: "green" },
      { label: "Q-Time · HTML-0513", formula: "operator unknown", result: "Legacy row retained", boundary: "Source missing · historical visual only", tone: "red" }
    ];
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
      <header class="section-heading"><p class="eyebrow">Integrated tested loop</p><h2>Primegrid representation circle</h2><p>Existing instruments and the five executable blocks now form one navigable route. Block 2B adds the trinary Pascal pyramid, one global antipode and typed number handles; Block 3 retains the selector but rejects coding advantage.</p></header>
      <section class="primegrid-circle" aria-label="Primegrid representation circle">
        ${circleStages.map((stage, index) => `<article class="circle-stage"><a href="${stage.href}"><span>${stage.number} · ${esc(stage.status)}</span><strong>${esc(stage.title)}</strong><p>${esc(stage.detail)}</p></a>${index < circleStages.length - 1 ? `<i aria-hidden="true">→</i>` : `<i class="circle-return" aria-hidden="true">↺ 02</i>`}</article>`).join("")}
      </section>
      <p class="circle-boundary"><strong>Typed boundary:</strong> Carrier state, Fourier coordinates, binary or trinary Pascal multiplicity, global antipode, prime selection and historical phase/gate views are connected representations—not one operator or physical mechanism. The equality 56 = C(8,3) remains a count bridge only; 43, 77 and 3301 remain typed handles rather than selectors, and reproducible prime selection does not imply coding gain.</p>
      <section class="panel boundary-panel"><p class="overline">OIL / RIS MULTI-LENS AUDIT · 12/12 PASS</p><h2>Multi-channel reveal with residual source ambiguity</h2><p>Three registered lossy views reconstruct the declared relation state only when address and overlap agree. Every aligned result still has two possible complete source records; missing, shifted or contradictory channels remain ambiguous or return <span class="mono">ABSTAIN</span>.</p><p class="lineage-boundary"><strong>Typed symbols</strong> <span class="mono">ø</span> is the package-local split/cut; <span class="mono">œ</span> is the registered seam. The tested RIS composition is a new finite fixture, not recovered historical semantics.</p><a class="secondary-action" href="${multiLensAuditHref}">Open scanner audit →</a></section>
      <header class="section-heading operator-heading"><p class="eyebrow">VIEW-OPERATOR AUDIT 01 · 9/9 PASS</p><h2>Shared return grammar · distinct operators</h2><p>The comparison reuses existing tested records. It does not reconstruct the missing historical Q-Time source.</p></header>
      <section class="operator-compare-grid" aria-label="Reciprocal polar DFT and legacy operator comparison">
        ${operatorComparisons.map((item) => `<article class="tone-${item.tone}"><span>${esc(item.label)}</span><strong>${esc(item.formula)}</strong><p>${esc(item.result)}</p><small>${esc(item.boundary)}</small></article>`).join("")}
      </section>
      <p class="operator-audit-link"><a href="${viewOperatorAuditHref}">Open the complete operator-disambiguation result →</a></p>
      <section class="naming-rule"><p class="overline">Naming rule</p><p><strong>Plain function first</strong> · retained NEXAH term second · stable registry ID underneath. Names are translated for orientation, never rewritten in source records.</p></section>
      ${renderBreathBridge("Sequence → reversible playback")}
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
    setContext({ object: "Directed sequence + tested Primegrid circle + multi-lens and view-operator audits + candidate F8", boundary: "The OIL/RIS scanner supports aligned relation-state reveal without full source recovery; its finite RIS fixture is not recovered historical semantics and does not establish an O8/Block-2B identity. Block 3 supports a reproducible prime selector without coding advantage. Q-Mirror, HZ/FZ polar coordinates and finite DFT share a bounded return grammar, not one operator. CAND:F8_AXIS_EXTENSION remains an owner hypothesis.", receipt: "OIL/RIS MULTI-LENS AUDIT 12/12 · VIEW-OPERATOR AUDIT 01 · PRIMEGRID BLOCK-01 / BLOCK-02 / BLOCK-02A / BLOCK-02B / BLOCK-03 result assessments · P6R01 final decision" });
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

  function renderPrimeBaseMode() {
    const nodeById = new Map(list(primeBaseMode.nodes).map((node) => [node.node_id, node]));
    const shortHash = (hash) => hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : "not available";
    const ledger = primeBaseMode.claim_ledger || {};
    const ledgerColumns = [
      ["Exact", "exact"],
      ["Supported · bounded", "supported_bounded"],
      ["Rejected / not supported", "rejected_or_not_supported"],
      ["Open", "open"]
    ];

    app.innerHTML = `${pageHeader("Source-bound research atlas", "Prime · Base · Mode", "A bounded map of how one finite number carrier can be viewed through prime order, modular residues, bases, products, grids and polygons. The route connects records while keeping representation, operator and evidence class distinct.")}
      <section class="metric-grid pbm-metrics" aria-label="Prime Base Mode lens inventory">
        <div class="metric"><strong>${list(primeBaseMode.sources).length}</strong><span>hash-bound sources</span></div>
        <div class="metric"><strong>${list(primeBaseMode.nodes).length}</strong><span>bounded nodes</span></div>
        <div class="metric"><strong>${list(primeBaseMode.relations).length}</strong><span>typed relations</span></div>
        <div class="metric"><strong>${list(primeBaseMode.type_boundaries).length}</strong><span>type boundaries</span></div>
      </section>

      <section class="panel boundary-panel pbm-question"><p class="overline">Research object · not a result announcement</p><h2>How much structure can basic number operators generate—and what survives a change of view?</h2><p>${esc(primeBaseMode.purpose)}</p><p class="lineage-boundary"><strong>Claim ceiling</strong> ${esc(primeBaseMode.claim_ceiling)}</p></section>

      <header class="section-heading"><p class="eyebrow">Development layers</p><h2>From visual seed to controlled question</h2><p>The archive is not flattened. Historical imagery, exact mathematics, executable experiments, validation and synthesis retain different evidence roles.</p></header>
      <section class="pbm-layer-flow">${list(primeBaseMode.development_layers).map((item) => `<article><span>${esc(item.layer)} · ${esc(item.state)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Type discipline</p><h2>Similar notation does not create identity</h2><p>This is the central guardrail for numbers such as 7, 11 and 17: a prime value, a modulus, a base, a grid width and a polygon are different mathematical objects.</p></header>
      <section class="pbm-type-grid">${list(primeBaseMode.type_boundaries).map((item) => `<article><span>${esc(item.example)}</span><h3>${esc(item.type)}</h3><p>${esc(item.meaning)}</p><p class="lineage-boundary"><strong>Not identical to</strong> ${esc(item.not_identity)}</p></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Research graph</p><h2>Fourteen objects · sixteen declared routes</h2><p>Exact equivalence, tested support, negative control, historical lineage and open questions remain visibly different.</p></header>
      <section class="pbm-node-grid">${list(primeBaseMode.nodes).map((node) => `<article><span class="idline">${esc(node.node_id)} · ${esc(node.status)}</span><h3>${esc(node.title)}</h3><p>${esc(node.summary)}</p><div class="tag-row">${list(node.families).map((item) => `<span class="tag family">${esc(item)}</span>`).join("")}${list(node.fields).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div><p class="lineage-boundary"><strong>Boundary</strong> ${esc(node.claim_boundary)}</p></article>`).join("")}</section>
      <section class="lineage-relations pbm-relations">${list(primeBaseMode.relations).map((relation) => `<article><div class="lineage-route"><strong>${esc(nodeById.get(relation.source)?.title || relation.source)}</strong><span>${esc(relation.type)} · ${esc(relation.status)} →</span><strong>${esc(nodeById.get(relation.target)?.title || relation.target)}</strong></div><p>${esc(relation.explanation)}</p><p><strong>Preserves</strong> ${esc(list(relation.preserves).join(" · "))}</p><p class="lineage-boundary"><strong>Does not imply</strong> ${esc(list(relation.does_not_imply).join(" · "))}</p></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Number genealogy</p><h2>One token · several legitimate roles</h2></header>
      <section class="pbm-number-strip">${list(primeBaseMode.number_genealogy).map((item) => `<article><strong>${esc(item.number)}</strong><p>${esc(list(item.roles).join(" · "))}</p><small>${esc(item.current_reading)}</small></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Evidence ledger</p><h2>What is known, bounded, rejected or open</h2></header>
      <section class="pbm-ledger">${ledgerColumns.map(([title, key]) => `<article class="ledger-${key}"><h3>${esc(title)}</h3><ul>${list(ledger[key]).map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Source receipts</p><h2>Nine records · no detached claim</h2><p>Every source in this lens is repository-bound and SHA-256 checked by the binder validator.</p></header>
      <section class="pbm-source-list">${list(primeBaseMode.sources).map((source) => `<article><div><span class="idline">${esc(source.source_id)} · ${esc(source.repository)}</span><h3>${esc(source.title)}</h3><p>${esc(source.role)}</p></div><div><span class="mono">${esc(shortHash(source.sha256))}</span><a class="secondary-action" href="${esc(source.href)}">Open source →</a></div></article>`).join("")}</section>

      <section class="panel open-questions"><p class="overline">Next archaeological passes</p><h2>Continue by binding operators—not by multiplying metaphors</h2><ol>${list(primeBaseMode.next_passes).map((item) => `<li>${esc(item)}</li>`).join("")}</ol></section>`;
    setContext({ object: "Prime · Base · Mode lens", boundary: primeBaseMode.claim_ceiling, receipt: `${primeBaseMode.binder_id} · ${primeBaseMode.maintained} · ${primeBaseMode.sources.length} verified source hashes · canonical counts unchanged` });
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

  function renderOrientationCatalog() {
    const recordByKey = new Map(list(orientationCatalog.records).map((record) => [record.catalog_key, record]));
    const conceptById = new Map(list(orientationCatalog.concepts).map((concept) => [concept.concept_id, concept]));
    const pointersByKey = list(orientationCatalog.navigator_pointers).reduce((map, pointer) => {
      if (!map.has(pointer.catalog_key)) map.set(pointer.catalog_key, []);
      map.get(pointer.catalog_key).push(pointer);
      return map;
    }, new Map());
    const featured = list(orientationCatalog.featured_keys).map((key) => recordByKey.get(key)).filter(Boolean);
    const registeredWorkByKey = new Map(list(orientationCatalog.registered_works).map((work) => [work.catalog_key, work]));
    const renderRecord = (record, featuredCard = false) => {
      const registered = registeredWorkByKey.get(record.catalog_key);
      const pointers = pointersByKey.get(record.catalog_key) || [];
      return `<article class="orientation-catalog-card ${featuredCard ? "is-featured" : ""}">
        <header><span class="idline">${esc(registered?.work_id || record.catalog_key)}</span><span class="catalog-classification">${esc(record.classification_state)} · ${esc(record.revision_state)}</span></header>
        <h3>${esc(record.title)}</h3>
        <p>${esc(record.summary)}</p>
        <div class="tag-row"><span class="tag">${esc(record.type)}</span><span class="tag family">${esc(record.form)}</span>${record.series ? `<span class="tag">${esc(record.series)}</span>` : ""}</div>
        <footer><a class="mini-action primary" href="${esc(safeExternalHref(record.source_url))}" target="_blank" rel="noreferrer">Open source ↗</a>${pointers.map((pointer) => `<a class="mini-action" href="${esc(pointer.target_route)}">${esc(pointer.relation_type)} →</a>`).join("")}</footer>
      </article>`;
    };
    const registeredCards = list(orientationCatalog.registered_works).map((work) => `<article class="orientation-work-card">
      <header><span class="idline">${esc(work.work_id)} · ${esc(work.current_edition || "edition not registered")}</span><h3>${esc(work.title)}</h3></header>
      <p>${esc(work.summary)}</p>
      <div class="orientation-concept-chips">${list(work.concept_ids).map((id) => `<span title="${esc(conceptById.get(id)?.definition)}"><b>${esc(id)}</b>${esc(conceptById.get(id)?.label || id)}</span>`).join("")}</div>
    </article>`).join("");
    const pointerRows = list(orientationCatalog.navigator_pointers).map((pointer) => {
      const record = recordByKey.get(pointer.catalog_key);
      return `<article class="orientation-pointer"><div><span class="idline">${esc(pointer.pointer_id)} · ${esc(pointer.relation_type)}</span><h3>${esc(record?.title || pointer.catalog_key)}</h3><p>${esc(pointer.claim_boundary)}</p></div><a class="secondary-action" href="${esc(pointer.target_route)}">Open NN lens →</a></article>`;
    }).join("");

    app.innerHTML = `${pageHeader("Experience catalog · read-only projection", "Orientation Catalog", "Sixty-one existing Experience records remain in their owning catalog. This lens foregrounds twelve orientation-relevant works, reuses ten registered Library Work identities and exposes their existing Concept links without turning books into Families or evidence.")}
      <section class="metric-grid orientation-catalog-metrics">
        <article class="metric"><strong>${orientationCatalog.records.length}</strong><span>Experience records</span></article>
        <article class="metric"><strong>${orientationCatalog.featured_keys.length}</strong><span>orientation selection</span></article>
        <article class="metric"><strong>${orientationCatalog.registered_works.length}</strong><span>registered NX Works</span></article>
        <article class="metric"><strong>${orientationCatalog.concepts.length}</strong><span>registered NX-OP Concepts</span></article>
      </section>
      <section class="panel orientation-catalog-boundary"><p class="overline">Authority boundary</p><h2>Catalog relation ≠ scientific relation</h2><p>${esc(orientationCatalog.claim_ceiling)}</p><ul>${list(orientationCatalog.source_boundaries).map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>

      <header class="section-heading"><p class="eyebrow">Curated beginning</p><h2>Twelve orientation-relevant works</h2><p>These are editorial starting points. Their status remains exactly as recorded by Experience.</p></header>
      <section class="orientation-catalog-grid">${featured.map((record) => renderRecord(record, true)).join("")}</section>

      <header class="section-heading"><p class="eyebrow">Stable Library graph</p><h2>Ten Works · seventeen Concepts</h2><p>The IDs and Work-to-Concept assignments come from the NEXAH Core Library Registry. They are reused here, not recreated.</p></header>
      <section class="orientation-work-grid">${registeredCards}</section>

      <header class="section-heading"><p class="eyebrow">NN reading pointers</p><h2>Connected without authority transfer</h2><p>Each pointer has an explicit boundary. It guides reading but does not enter the canonical relation count.</p></header>
      <section class="orientation-pointer-list">${pointerRows}</section>

      <details class="orientation-full-catalog"><summary>Show the complete Experience catalog · ${orientationCatalog.records.length} records</summary><section class="orientation-catalog-grid">${list(orientationCatalog.records).map((record) => renderRecord(record)).join("")}</section></details>`;
    setContext({ object: "Orientation Catalog", boundary: orientationCatalog.claim_ceiling, receipt: `${orientationCatalog.binder_id} · Experience catalog ${orientationCatalog.source_catalog.sha256.slice(0, 12)}… · canonical counts unchanged` });
  }

  function renderFamilies() {
    const max = Math.max(...Object.values(familyCounts));
    app.innerHTML = `${pageHeader("Connection architecture", "Seven families", "Families organize recurring relational work across modules, surfaces and evidence. They are navigation instruments—not assertions of a universal mechanism.")}
      ${renderEntryFamilyMap()}
      <section class="family-grid">${Object.entries(FAMILY_NAMES).map(([id, name]) => `
        <a class="family-card" href="${familyHref(id)}">
          <span class="card-code">${esc(id)}</span><h2>${esc(name)}</h2>
          <p>${familyCounts[id] || 0} connected entities</p>
          <div class="family-bar" aria-hidden="true"><span style="width:${Math.round((familyCounts[id] || 0) / max * 100)}%"></span></div>
        </a>`).join("")}</section>`;
    setContext({ object: "Connection families", boundary: "The same object may participate in several families. Overlap is recorded; it is not collapsed into identity.", receipt: receiptSummary() });
  }

  function renderLifeOrbit() {
    const instrumentHref = safeLocalHref(lifeOrbit.instrument.path);
    const validationHref = safeLocalHref(lifeOrbit.instrument.validation_record);
    const closingVisuals = [
      {
        title: "From Cell to Evidence",
        role: "Method grammar",
        copy: "The developed LIFE skill set: carrier, state, operator, view, fiber, return, residual and bounded evidence.",
        path: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_PROGRAM_CONSOLIDATION_2026-10-07/assets/closing_visuals_2026-10-08/NEXAH_LIFE_FROM_CELL_TO_EVIDENCE_2026-10-08.png"
      },
      {
        title: "The Hit That Became a Method",
        role: "Evidence story",
        copy: "Observed resonance passes through holdouts and matched controls, then returns as typed outcomes rather than one shared mechanism.",
        path: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_PROGRAM_CONSOLIDATION_2026-10-07/assets/closing_visuals_2026-10-08/NEXAH_LIFE_HIT_BECAME_METHOD_2026-10-08.png"
      },
      {
        title: "LIFE Event Crystal",
        role: "Visual invitation",
        copy: "One finite cellular evolution shown as grid, event alphabet, space-time body and explicitly separate observation coordinates.",
        path: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_PROGRAM_CONSOLIDATION_2026-10-07/assets/closing_visuals_2026-10-08/NEXAH_LIFE_EVENT_CRYSTAL_2026-10-08.png"
      }
    ].map((visual) => ({ ...visual, href: safeLocalHref(visual.path) }));
    const p5rHref = safeLocalHref("SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_RECONCILIATION_2026-10-07/P5R_VALIDATION_REPORT.json");
    const navUtilityHref = safeLocalHref(primeCrystal.sources.nav_utility_01);
    const navUtilityPreregHref = safeLocalHref(primeCrystal.sources.nav_utility_01_preregistration);
    const navUtilityLockHref = safeLocalHref(primeCrystal.sources.nav_utility_01_lock);
    const navUtilityMissionHref = safeLocalHref(primeCrystal.sources.nav_utility_01_mission_control);
    const e8Href = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/README.md");
    const usefulnessHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_IDENTIFIABILITY_CA_IDENT_01_2026-10-08/index.html");
    const usefulnessRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_IDENTIFIABILITY_CA_IDENT_01_2026-10-08/README.md");
    const usefulnessResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_IDENTIFIABILITY_CA_IDENT_01_2026-10-08/results/CA_IDENT_01_RESULT.json");
    const utilityGateHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/index.html");
    const utilityGateRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/README.md");
    const utilityGateLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/PREREGISTRATION_LOCK.json");
    const utilityGateResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/results/CA_IDENT_02_RESULT.json");
    const cubeGateHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/index.html");
    const cubeGateRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/README.md");
    const cubeGateAnnexHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/CRT_SHADOW_ANNEX.md");
    const cubeGateLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/PREREGISTRATION_LOCK.json");
    const cubeGateResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/results/CA_IDENT_03_RESULT.json");
    const fusionAuditHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08/index.html");
    const fusionAuditRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08/README.md");
    const fusionAuditLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08/PREREGISTRATION_LOCK.json");
    const fusionAuditResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08/results/CA_IDENT_04_RESULT.json");
    const alphaBetaHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/index.html");
    const alphaBetaRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/README.md");
    const alphaBetaLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/PREREGISTRATION_LOCK.json");
    const alphaBetaResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/results/CA_IDENT_05_RESULT.json");
    const kappaOpenSetHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08/index.html");
    const kappaOpenSetRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08/README.md");
    const kappaOpenSetLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08/PREREGISTRATION_LOCK.json");
    const kappaOpenSetResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08/results/CA_IDENT_06_RESULT.json");
    const generationalBinderHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/index.html");
    const generationalBinderRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/README.md");
    const generationalBinderLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/PREREGISTRATION_LOCK.json");
    const generationalBinderResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/results/CA_IDENT_07_RESULT.json");
    const cTaxonomyHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/C_TAXONOMY_AND_OBSERVATION_CLASS_CROSSWALK.md");
    const conditionalObserverHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/index.html");
    const conditionalObserverRecordHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/README.md");
    const conditionalObserverLockHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/PREREGISTRATION_LOCK.json");
    const conditionalObserverResultHref = safeLocalHref("SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/results/CA_IDENT_08_RESULT.json");
    const primeCrystalBinderHref = safeLocalHref(primeCrystal.sources.binder);
    const primeCrystalReadmeHref = safeLocalHref(primeCrystal.sources.readme);
    const primeCrystalAuditHref = safeLocalHref(primeCrystal.sources.forensic_audit);
    const primeCrystalViewerHref = safeLocalHref(primeCrystal.sources.viewer);
    const primeCrystalSceneHref = safeLocalHref(primeCrystal.sources.scene_spec);
    const primeCrystalTestHref = safeLocalHref(primeCrystal.sources.ca_ident_09_readme);
    const primeCrystalResultHref = safeLocalHref(primeCrystal.sources.ca_ident_09_result);
    const primeCrystalLockHref = safeLocalHref(primeCrystal.sources.ca_ident_09_lock);
    const primeCrystalMissionHref = safeLocalHref(primeCrystal.sources.mission_control_return);
    const lifeTransferHref = safeLocalHref(primeCrystal.sources.ca_ident_10_readme);
    const lifeTransferResultHref = safeLocalHref(primeCrystal.sources.ca_ident_10_result);
    const lifeTransferLockHref = safeLocalHref(primeCrystal.sources.ca_ident_10_lock);
    const lifeTransferMissionHref = safeLocalHref(primeCrystal.sources.ca_ident_10_mission_control);
    const carrierViewSynthesisHref = safeLocalHref(primeCrystal.sources.canonical_synthesis);
    const carrierViewMissionHref = safeLocalHref(primeCrystal.sources.mission_control_consolidation);
    const closedControlHrefs = new Map([
      ["WNI-01", safeLocalHref(primeCrystal.sources.wni_01_decision)],
      ["ETRI-01", safeLocalHref(primeCrystal.sources.etri_01_decision)],
      ["NOS-01", safeLocalHref(primeCrystal.sources.nos_01_decision)],
      ["TITAN-01", safeLocalHref(primeCrystal.sources.titan_01_decision)]
    ]);
    const wniMarkerHref = safeLocalHref(primeCrystal.sources.wni_01_marker);
    const elevenSpaceJanusHref = safeLocalHref(primeCrystal.sources.eleven_space_janus);
    const hmaBoundaryHref = safeLocalHref(primeCrystal.sources.hma_01_boundary);
    const admittedEntityIds = new Set(lifeOrbit.entities.map((entity) => entity.entity_id));
    const routeEntities = entities.filter((entity) => admittedEntityIds.has(entity.entity_id));
    const routeRelations = relations.filter((relation) => lifeOrbit.relations.some((item) => item.relation_id === relation.relation_id));
    const lifeRecordById = new Map(lifeProgram.records.map((record) => [record.id, record]));
    const lifeLineTitles = {
      LIFE01: "LIFE01 · executable vertical build",
      LIFE02_LIFE04: "LIFE02–LIFE04 · variants, scale and E8 controls",
      LIFE05: "LIFE05 · event and Prime/N experiments",
      LIFE06: "LIFE06 · transition language and identifiability"
    };
    const lifeStatusClass = (status) => /NEGATIVE|NOT_REPLICATED/.test(status) ? "negative" : /MIXED|POST_HOC/.test(status) ? "mixed" : "pass";
    const lifeInstrumentHref = (record) => {
      if (!record.html_path) return "";
      const href = safeLocalHref(record.html_path);
      return record.route ? `${href}${record.route}` : href;
    };
    const lifeRecordCard = (record) => `<article class="life-program-card ${lifeStatusClass(record.status)}">
      <header><span>${esc(record.id)}</span><small>${esc(record.status.replaceAll("_", " "))}</small></header>
      <h3>${esc(record.title)}</h3>
      <p>${esc(record.claim_ceiling)}</p>
      <div class="life-program-meta"><span>${esc(record.authority_role.replaceAll("_", " "))}</span><span>${record.html_path ? esc(record.delivery_kind.replaceAll("_", " ")) : "non-HTML kernel"}</span></div>
      <nav>${lifeInstrumentHref(record) ? `<a class="mini-action primary" href="${lifeInstrumentHref(record)}">Open instrument ↗</a>` : ""}<a class="mini-action" href="${safeLocalHref(record.readme)}">Record ↗</a><a class="mini-action" href="${safeLocalHref(record.validation)}">Validation ↗</a></nav>
    </article>`;
    app.innerHTML = `
      <section class="hero life-orbit-hero">
        <div>
          <p class="eyebrow">Internal admitted route · LIFE01 P6</p>
          <h1>Local rule.<br>Living geometry.</h1>
          <p class="lede">Conway Life is retained as an exact generation history, navigated as a space-time body and compared with a separately typed E8 word orbit without collapsing their carriers, operators or clocks.</p>
          <div class="hero-actions home-actions">
            ${instrumentHref ? `<a class="instrument-action" href="${instrumentHref}">Open working instrument ↗</a>` : ""}
            <a class="secondary-action" href="#entity=${slug(lifeOrbit.module_id)}">Inspect admitted module</a>
            <a class="secondary-action" href="#relations">Open relation register</a>
          </div>
        </div>
        <aside class="life-orbit-mark" aria-label="Life Orbit family route">
          <span class="life-ring ring-one"></span><span class="life-ring ring-two"></span><span class="life-ring ring-three"></span>
          <span class="life-spine"></span><i class="life-node node-one"></i><i class="life-node node-two"></i><i class="life-node node-three"></i>
        </aside>
      </section>

      <section class="life-orbit-status" aria-label="Admission status">
        <article><strong>${esc(lifeOrbit.result.replaceAll("_", "–"))}</strong><span>validated lineage</span></article>
        <article><strong>${lifeOrbit.family_route.length}</strong><span>Functional Families</span></article>
        <article><strong>${routeRelations.length}</strong><span>typed relations</span></article>
        <article><strong>0</strong><span>public entities</span></article>
      </section>

      <header class="section-heading life-visual-heading"><p class="eyebrow">LIFE closing series · 2026-10-08</p><h2>What we built, what the tests changed, what became visible</h2><p>Three visual entrances into the governed LIFE programme. They invite exploration without replacing the executable instruments or their package-local verdicts.</p></header>
      <section class="life-visual-story" aria-label="LIFE closing documentation visuals">
        ${closingVisuals.map((visual, index) => `<a class="life-visual-card ${index === 0 ? "is-primary" : ""}" href="${visual.href}" aria-label="Open ${esc(visual.title)} documentation visual">
          <img src="${visual.href}" alt="${esc(visual.title)} — ${esc(visual.copy)}" ${index === 0 ? "" : 'loading="lazy"'}>
          <span class="life-visual-copy"><small>${esc(visual.role)} · documentation visual</small><strong>${esc(visual.title)}</strong><span>${esc(visual.copy)}</span></span>
        </a>`).join("")}
      </section>
      <p class="life-visual-boundary"><strong>Visual boundary</strong> These assets summarize the LIFE01–LIFE06D cycle. They add no samples, tests or evidence and do not establish a universal LIFE–E8–Prime mechanism.</p>

      <header class="section-heading"><p class="eyebrow">Family route</p><h2>One object across five inspection layers</h2><p>No new Functional Family is introduced.</p></header>
      <ol class="life-family-route">${lifeOrbit.family_route.map((step) => `<li><span>${esc(step.family_id.replace("CF:", ""))}</span><strong>${esc(FAMILY_NAMES[step.family_id])}</strong><p>${esc(step.role)}</p></li>`).join("")}</ol>

      <header class="section-heading"><p class="eyebrow">Admitted objects</p><h2>Module and executable surfaces</h2><p>The route is compositional: one bounded module, its GLB predecessor and its typed comparison master.</p></header>
      <div class="entity-list">${routeEntities.map(renderEntityCard).join("")}</div>

      <header class="section-heading"><p class="eyebrow">Typed relations</p><h2>Connections without collapse</h2><p>Version succession, application analogy and method grammar remain distinct records.</p></header>
      <div class="relation-list life-relation-list">${routeRelations.map((relation) => relationCard(relation)).join("")}</div>

      <header class="section-heading"><p class="eyebrow">Instrument view</p><h2>Follow the code through time</h2><p>The embedded P4 object retains Field, Space-time, Slice, Worldlines, Life/E8 Comparison and Causal Inspector views.</p></header>
      <section class="life-instrument-shell">
        ${instrumentHref ? `<iframe title="NEXAH LIFE ORBIT P4 instrument" src="${instrumentHref}" sandbox="allow-scripts allow-same-origin allow-downloads" loading="lazy"></iframe>` : `<p>Instrument path unavailable.</p>`}
      </section>

      <header class="section-heading"><p class="eyebrow">Evidence and boundary</p><h2>What is bound—and what is not</h2></header>
      <section class="life-evidence-grid">
        <article><span>P4 execution</span><strong>14 tests · 30 offline checks · render PASS</strong>${validationHref ? `<a href="${validationHref}">Open validation record ↗</a>` : ""}</article>
        <article><span>P5R integrity</span><strong>17/17 current hashes · six delta pairs · 11 unchanged</strong>${p5rHref ? `<a href="${p5rHref}">Open reconciliation receipt ↗</a>` : ""}</article>
        <article><span>E8 source identity</span><strong>Separate carrier · separate operator · separate clock</strong>${e8Href ? `<a href="${e8Href}">Open E8 source record ↗</a>` : ""}</article>
      </section>

      <header class="section-heading"><p class="eyebrow">CA-IDENT-01 · executed 2026-10-08</p><h2>Do the extra views add usefulness?</h2><p>A centered training fixture is tested on translated LIFE holdouts. Grid, Fourier, Shadow Memory, 17/19/29-gon shadows and an explicitly lossy E8 adapter remain separate records.</p></header>
      <section class="life-usefulness-card">
        <div>
          <span class="card-code">LIMITED VIEW SIGNAL · INTERNAL FIXTURE</span>
          <h3>Fourier and shadow-gons recover one additional holdout; the current E8 adapter does not.</h3>
          <p>The baseline identifies 82/84 translated records. Fourier magnitude and the polygon shadows identify 83/84. The absolute 5×5 grid reaches 35/84; the E8 adapter reaches 36/84; the unweighted combined view remains at 82/84. This is a bounded reason to continue testing, not a usefulness proof.</p>
          <div class="life-usefulness-actions">${usefulnessHref ? `<a class="instrument-action" href="${usefulnessHref}">Open Multi-View Lab ↗</a>` : ""}${usefulnessRecordHref ? `<a class="mini-action" href="${usefulnessRecordHref}">Method record ↗</a>` : ""}${usefulnessResultHref ? `<a class="mini-action" href="${usefulnessResultHref}">Frozen result ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Baseline</dt><dd>97.62%</dd></div>
          <div><dt>Fourier / gons</dt><dd>98.81%</dd></div>
          <div><dt>E8 adapter</dt><dd>42.86%</dd></div>
          <div><dt>External utility</dt><dd>not tested</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Boundary:</strong> shadow-gons are observation frames, not LIFE carriers. The E8 mapping is a negative adapter control on this target. Descartes and Poincaré are reversible chart views, not new dynamics.</p>
      </section>

      <section class="life-usefulness-card life-utility-gate">
        <div>
          <span class="card-code">CA-IDENT-02 · PREREGISTERED · PARTIAL SIGNAL · GATE FAIL</span>
          <h3>Memory and radial Fourier help; the naïve Cathedral fusion does not pass.</h3>
          <p>Across five rules, ten seeds and 750 transformed holdouts, Shadow Memory reaches 0.4433 and radial Fourier 0.4174 primary macro-F1 against a 0.2909 baseline. The combined record reaches only 0.3295—below the locked +0.10 utility threshold. Shadow-gons do not replicate their small CA-IDENT-01 advantage; E8 remains a negative control.</p>
          <div class="life-usefulness-actions">${utilityGateHref ? `<a class="instrument-action" href="${utilityGateHref}">Open CA-IDENT-02 Cathedral ↗</a>` : ""}${utilityGateRecordHref ? `<a class="mini-action" href="${utilityGateRecordHref}">Result record ↗</a>` : ""}${utilityGateLockHref ? `<a class="mini-action" href="${utilityGateLockHref}">Preregistration lock ↗</a>` : ""}${utilityGateResultHref ? `<a class="mini-action" href="${utilityGateResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Primary baseline</dt><dd>0.2909 F1</dd></div>
          <div><dt>Shadow Memory</dt><dd>0.4433 F1</dd></div>
          <div><dt>Radial Fourier</dt><dd>0.4174 F1</dd></div>
          <div><dt>Combined delta</dt><dd>+0.0386 / +0.10 required</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Cathedral role:</strong> evidence-preserving layer registry and comparison route only. No physical resonance, shared operator or new canonical Functional Family is inferred.</p>
      </section>

      <section class="life-usefulness-card life-cube-gate">
        <div>
          <span class="card-code">CA-IDENT-03 · RETURN PASS · FUSION NO GAIN</span>
          <h3>The cube returns exactly; it does not improve the LIFE task.</h3>
          <p>A locked three-frame x–y–time experiment reproduces the BLOCK-01 distinction: full complex Fourier data returns a 2×2×2 carrier to 1.22×10⁻16, while magnitude alone loses address. On 100 independent behavior holdouts, however, radial Fourier remains strongest at 0.8814 macro-F1; Cube fusion reaches only 0.6305.</p>
          <div class="life-usefulness-actions">${cubeGateHref ? `<a class="instrument-action" href="${cubeGateHref}">Open CA-IDENT-03 Cube Gate ↗</a>` : ""}${cubeGateRecordHref ? `<a class="mini-action" href="${cubeGateRecordHref}">Result record ↗</a>` : ""}${cubeGateAnnexHref ? `<a class="mini-action" href="${cubeGateAnnexHref}">Fourier / CRT annex ↗</a>` : ""}${cubeGateLockHref ? `<a class="mini-action" href="${cubeGateLockHref}">Preregistration lock ↗</a>` : ""}${cubeGateResultHref ? `<a class="mini-action" href="${cubeGateResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Complex return</dt><dd>1.22×10⁻16 · PASS</dd></div>
          <div><dt>Radial Fourier</dt><dd>0.8814 F1</dd></div>
          <div><dt>Cube fusion</dt><dd>0.6305 F1</dd></div>
          <div><dt>Fusion vs best</dt><dd>−0.2509 · FAIL</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Cathedral disposition:</strong> retain Cube Face as a return and information-loss transept. It is not the primary LIFE predictor, and no physical resonance or universal projection mechanism is inferred.</p>
      </section>

      <section class="life-usefulness-card life-balanced-gate">
        <div>
          <span class="card-code">CA-IDENT-04 · FRESH HOLDOUT · BOTH GATES FAIL</span>
          <h3>Correct view balancing does not rescue fusion.</h3>
          <p>On fresh seeds R20–R24, radial Fourier classifies all 100 rows correctly. Post-standardization Memory + Fourier balancing falls to 0.7700 macro-F1; adding Cube magnitude falls again to 0.7632. The old 110-coordinate fusion rises to 0.9869, exposing split sensitivity rather than a single dimensionality defect.</p>
          <div class="life-usefulness-actions">${fusionAuditHref ? `<a class="instrument-action" href="${fusionAuditHref}">Open CA-IDENT-04 Fusion Audit ↗</a>` : ""}${fusionAuditRecordHref ? `<a class="mini-action" href="${fusionAuditRecordHref}">Result record ↗</a>` : ""}${fusionAuditLockHref ? `<a class="mini-action" href="${fusionAuditLockHref}">Preregistration lock ↗</a>` : ""}${fusionAuditResultHref ? `<a class="mini-action" href="${fusionAuditResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Radial Fourier</dt><dd>1.0000 F1</dd></div>
          <div><dt>Balanced core</dt><dd>0.7700 F1</dd></div>
          <div><dt>+ Cube magnitude</dt><dd>0.7632 F1</dd></div>
          <div><dt>Transient support</dt><dd>1 · underpowered</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Next gate:</strong> coverage before architecture. Freeze a larger seed bank with adequate rare-class support, then test Fourier stability under new rules and boundaries. No Cube, CRT, resonance or quantum claim is promoted.</p>
      </section>

      <section class="life-usefulness-card life-alpha-beta-gate">
        <div>
          <span class="card-code">CA-IDENT-05 · 2,000 FRESH ROWS · ALPHA-BETA NO GAIN</span>
          <h3>P = A + B is exact bookkeeping; the proposed 63/64 direction does not win.</h3>
          <p>The registered metric assigns 63/64 to radial Fourier and 1/64 to Shadow Memory. It reaches 0.5277 macro-F1 versus 0.5307 for Fourier alone. Equal weighting reaches 0.5853; the reversed 1/64 Fourier + 63/64 Memory control is strongest at 0.6084. A new constant-count class appears 19 times in holdout but never in training.</p>
          <div class="life-usefulness-actions">${alphaBetaHref ? `<a class="instrument-action" href="${alphaBetaHref}">Open CA-IDENT-05 Alpha/Beta Audit ↗</a>` : ""}${alphaBetaRecordHref ? `<a class="mini-action" href="${alphaBetaRecordHref}">Result record ↗</a>` : ""}${alphaBetaLockHref ? `<a class="mini-action" href="${alphaBetaLockHref}">Preregistration lock ↗</a>` : ""}${alphaBetaResultHref ? `<a class="mini-action" href="${alphaBetaResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>63/64 Fourier + 1/64 Memory</dt><dd>0.5277 F1</dd></div>
          <div><dt>Equal split</dt><dd>0.5853 F1</dd></div>
          <div><dt>Reverse control</dt><dd>0.6084 F1</dd></div>
          <div><dt>Unseen class</dt><dd>19 · recall 0</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Disposition:</strong> retain 63/64 + 1/64 as a declared complement/normalization relation, not a universal predictive orientation. The next gap is open-set class discovery and training support—not a resonance, radiance or quantum mechanism.</p>
      </section>

      <section class="life-usefulness-card life-kappa-gate">
        <div>
          <span class="card-code">CA-IDENT-06 · KAPPA ABSTENTION · COVERAGE GATE FAIL</span>
          <h3>The fracture stays open when the registered unknown does not arrive.</h3>
          <p>Kappa is implemented as frozen distance from known support, returning ABSTAIN_UNKNOWN beyond a training-only 99th-percentile aperture. In 2,000 fresh rows the registered constant-count class has zero support, so unknown recall is not interpretable. The known-side control remains narrow: 13 false abstentions and 99.35% specificity.</p>
          <div class="life-usefulness-actions">${kappaOpenSetHref ? `<a class="instrument-action" href="${kappaOpenSetHref}">Open CA-IDENT-06 Kappa Audit ↗</a>` : ""}${kappaOpenSetRecordHref ? `<a class="mini-action" href="${kappaOpenSetRecordHref}">Result record ↗</a>` : ""}${kappaOpenSetLockHref ? `<a class="mini-action" href="${kappaOpenSetLockHref}">Preregistration lock ↗</a>` : ""}${kappaOpenSetResultHref ? `<a class="mini-action" href="${kappaOpenSetResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Known evaluation</dt><dd>2,000 rows</dd></div>
          <div><dt>False abstentions</dt><dd>13</dd></div>
          <div><dt>Known specificity</dt><dd>99.35%</dd></div>
          <div><dt>Unknown support</dt><dd>0 · stop</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Kappa boundary:</strong> an abstention/residual edge record, not a forced class or physical field. Future validation must collect under a frozen threshold until an event quota or maximum seed budget is reached.</p>
      </section>

      <section class="life-usefulness-card life-generational-gate">
        <div>
          <span class="card-code">CA-IDENT-07 · FOUR CUTS · COVERAGE GATE FAIL</span>
          <h3>Relations can arrive later without becoming useful automatically.</h3>
          <p>The historical A/B→C→S′→D/E/F→G grammar is translated into signed first- and second-order temporal residuals. On 2,000 fresh rows, snapshot reaches 0.6408 descriptive macro-F1, two cuts 0.6095 and the full signed binder 0.5846. Relation-only falls to 0.4208. The registered rare class again has zero evaluation support, so the primary result remains unknown.</p>
          <div class="life-usefulness-actions">${generationalBinderHref ? `<a class="instrument-action" href="${generationalBinderHref}">Open CA-IDENT-07 Generation Audit ↗</a>` : ""}${cTaxonomyHref ? `<a class="mini-action" href="${cTaxonomyHref}">C taxonomy ↗</a>` : ""}${generationalBinderRecordHref ? `<a class="mini-action" href="${generationalBinderRecordHref}">Result record ↗</a>` : ""}${generationalBinderLockHref ? `<a class="mini-action" href="${generationalBinderLockHref}">Preregistration lock ↗</a>` : ""}${generationalBinderResultHref ? `<a class="mini-action" href="${generationalBinderResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Snapshot</dt><dd>0.6408 F1</dd></div>
          <div><dt>Two cuts</dt><dd>0.6095 F1</dd></div>
          <div><dt>Signed generations</dt><dd>0.5846 F1</dd></div>
          <div><dt>Rare-class support</dt><dd>0 · stop</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Learned boundary:</strong> a residual records change; it is not automatically predictive. The C taxonomy separates comparator, intersection, closure, cycle and observer class. The next test needs a training-only conditional residual gate plus prospective event quota—not unconditional history concatenation and not a physical Kappa field.</p>
      </section>

      <section class="life-usefulness-card life-conditional-observer-gate">
        <div>
          <span class="card-code">CA-IDENT-08 · EVENT QUOTA REACHED · PRIMARY GAIN</span>
          <h3>History helps, but the present conditional gate is not uniquely necessary.</h3>
          <p>Prospective collection reaches 16 constant-count rows at R504, giving all seven classes coverage. The training-selected gate opens on 32.28% of 3,600 evaluation rows and improves snapshot macro-F1 from 0.4891 to 0.5379. It makes exactly the same decisions as always-open history, so gate specificity fails. Separately, observer resolution merges seven prototypes through 7→5→2→1 classes.</p>
          <div class="life-usefulness-actions">${conditionalObserverHref ? `<a class="instrument-action" href="${conditionalObserverHref}">Open CA-IDENT-08 Conditional Gate ↗</a>` : ""}${conditionalObserverRecordHref ? `<a class="mini-action" href="${conditionalObserverRecordHref}">Result record ↗</a>` : ""}${conditionalObserverLockHref ? `<a class="mini-action" href="${conditionalObserverLockHref}">Preregistration lock ↗</a>` : ""}${conditionalObserverResultHref ? `<a class="mini-action" href="${conditionalObserverResultHref}">Frozen metrics ↗</a>` : ""}</div>
        </div>
        <dl>
          <div><dt>Coverage</dt><dd>7/7 classes · PASS</dd></div>
          <div><dt>Conditional delta</dt><dd>+0.0488 F1</dd></div>
          <div><dt>Gate open rate</dt><dd>32.28%</dd></div>
          <div><dt>Observer classes</dt><dd>7 → 5 → 2 → 1</dd></div>
        </dl>
        <p class="life-usefulness-boundary"><strong>Disposition:</strong> residual utility is supported; selective superiority of this gate is not. The finite observer sweep distinguishes state count from observable class count but does not establish Shannon capacity, a universal observer law or a physical Kappa field.</p>
      </section>

      <header class="section-heading prime-crystal-heading"><p class="eyebrow">CALIBRATION FAMILY · ADDED 2026-10-08</p><h2>Breathing / Prime Crystal</h2><p>A known integer carrier turns the historical Prime-Crystal material into a three-cut representation control and a negative control for LIFE / CA-IDENT.</p></header>
      <section class="prime-crystal-instrument" aria-label="Breathing and Prime Crystal calibration family">
        <div class="prime-crystal-intro">
          <span class="card-code">${esc(primeCrystal.status.replaceAll("_", " "))}</span>
          <h3>Same carrier. Three cuts. Different apparent topology.</h3>
          <p>${esc(primeCrystal.three_cut_finding)}</p>
          <div class="life-usefulness-actions">${carrierViewSynthesisHref ? `<a class="instrument-action" href="${carrierViewSynthesisHref}">Open condensed finding ↗</a>` : ""}${carrierViewMissionHref ? `<a class="mini-action" href="${carrierViewMissionHref}">Consolidated Mission Control ↗</a>` : ""}${lifeTransferHref ? `<a class="mini-action" href="${lifeTransferHref}">CA-IDENT-10 LIFE transfer ↗</a>` : ""}${lifeTransferResultHref ? `<a class="mini-action" href="${lifeTransferResultHref}">LIFE frozen metrics ↗</a>` : ""}${lifeTransferLockHref ? `<a class="mini-action" href="${lifeTransferLockHref}">LIFE preregistration lock ↗</a>` : ""}${lifeTransferMissionHref ? `<a class="mini-action" href="${lifeTransferMissionHref}">LIFE Mission Control ↗</a>` : ""}${primeCrystalTestHref ? `<a class="mini-action" href="${primeCrystalTestHref}">CA-IDENT-09 calibration ↗</a>` : ""}${primeCrystalResultHref ? `<a class="mini-action" href="${primeCrystalResultHref}">Prime frozen metrics ↗</a>` : ""}${primeCrystalLockHref ? `<a class="mini-action" href="${primeCrystalLockHref}">Prime preregistration lock ↗</a>` : ""}${primeCrystalMissionHref ? `<a class="mini-action" href="${primeCrystalMissionHref}">Prime Mission Control ↗</a>` : ""}${primeCrystalViewerHref ? `<a class="mini-action" href="${primeCrystalViewerHref}">Breathing Crystal viewer ↗</a>` : ""}${primeCrystalBinderHref ? `<a class="mini-action" href="${primeCrystalBinderHref}">Machine binder ↗</a>` : ""}${primeCrystalReadmeHref ? `<a class="mini-action" href="${primeCrystalReadmeHref}">Instrument record ↗</a>` : ""}${primeCrystalAuditHref ? `<a class="mini-action" href="${primeCrystalAuditHref}">Forensic control ↗</a>` : ""}${primeCrystalSceneHref ? `<a class="mini-action" href="${primeCrystalSceneHref}">Scene specification ↗</a>` : ""}</div>
        </div>
        <div class="prime-cut-grid" aria-label="Three grid cuts">
          ${primeCrystal.three_cut_control.map((cut) => `<article class="${cut.columns === 20 ? "is-active" : ""}"><span>${cut.columns} columns</span><strong>${cut.view_edges_total}</strong><small>visible prime-neighbour edges</small><em>CV ${cut.prime_column_cv}</em></article>`).join("")}
        </div>
        <ol class="prime-crystal-layers">
          ${primeCrystal.instrument_layers.map((layer) => `<li><span>${esc(layer.layer_id.replace("BPC:", ""))}</span><div><strong>${esc(layer.title)}</strong><p>${esc(layer.role)}</p><small>${esc(layer.evidence_state.replaceAll("_", " "))}</small></div></li>`).join("")}
        </ol>
        <div class="prime-crystal-ilau">
          ${[["I · retained", primeCrystal.ilau_return.retained], ["L · lost", primeCrystal.ilau_return.lost], ["A · introduced", primeCrystal.ilau_return.introduced], ["U · unresolved", primeCrystal.ilau_return.unresolved]].map(([label, items]) => `<article><strong>${esc(label)}</strong><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`).join("")}
        </div>
        <div class="prime-crystal-control">
          <div><span>Exact carrier inventory</span><strong>${primeCrystal.exact_inventory.primes} primes · ${primeCrystal.exact_inventory.twin_prime_members} twin members · ${primeCrystal.exact_inventory.euler_41_values} Euler values · ${primeCrystal.exact_inventory.root_band_primes} root-band primes</strong></div>
          <div><span>Overlap control</span><strong>Euler–Twin p=${primeCrystal.overlap_control.hypergeometric_upper_tail.euler_twin} · Euler–Root p=${primeCrystal.overlap_control.hypergeometric_upper_tail.euler_root}</strong></div>
          <div><span>CA-IDENT-09 · PBC-01</span><strong>${esc(primeCrystal.calibration_result.gates_passed)} gates · ${primeCrystal.calibration_result.exact_returns} exact returns · ${esc(primeCrystal.calibration_result.verdict)}</strong></div>
          <div><span>Cross-cut prediction residual</span><strong>stable 0% / 0% · view ${(primeCrystal.calibration_result.view_prediction_disagreement.width_19 * 100).toFixed(1)}% / ${(primeCrystal.calibration_result.view_prediction_disagreement.width_21 * 100).toFixed(1)}%</strong></div>
        </div>
        <p class="prime-crystal-result"><strong>Executed finding:</strong> ${esc(primeCrystal.calibration_result.interpretation)} <span>Next: ${esc(primeCrystal.life_bridge.next_test)}</span></p>
        <section class="prime-life-transfer" aria-label="CA-IDENT-10 LIFE transfer result">
          <div><span>CA-IDENT-10 · LIFE-VIEW-01</span><strong>${esc(primeCrystal.life_transfer_result.gates_passed)} gates · ${esc(primeCrystal.life_transfer_result.verdict)}</strong><p>${esc(primeCrystal.life_transfer_result.interpretation)}</p></div>
          <dl>
            <div><dt>Frozen event occurrences</dt><dd>${primeCrystal.life_transfer_result.eligible_event_occurrences.toLocaleString()}</dd></div>
            <div><dt>Exact inverse returns</dt><dd>${primeCrystal.life_transfer_result.exact_returns.toLocaleString()}</dd></div>
            <div><dt>Topology Jaccard</dt><dd>${primeCrystal.life_transfer_result.topology_jaccard.width_31.toFixed(3)} / ${primeCrystal.life_transfer_result.topology_jaccard.width_33.toFixed(3)}</dd></div>
            <div><dt>View decision residual</dt><dd>${(primeCrystal.life_transfer_result.view_prediction_disagreement.width_31 * 100).toFixed(2)}% / ${(primeCrystal.life_transfer_result.view_prediction_disagreement.width_33 * 100).toFixed(2)}%</dd></div>
          </dl>
        </section>
        <section class="closed-control-ladder" aria-label="Closed carrier view control lineage">
          <header><span>CLOSED CONTROL LINEAGE</span><h3>One positive invariant control, one transform control, two boundary controls.</h3><p>These records strengthen the method grammar without reopening their experiments or becoming additional LIFE evidence.</p></header>
          <div>
            ${primeCrystal.closed_control_lineage.map((control) => `<article><span>${esc(control.control_id)} · ${esc(control.status)}</span><strong>${esc(control.role)}</strong><p>${esc(control.finding)}</p><small>${esc(control.boundary)}</small>${closedControlHrefs.get(control.control_id) ? `<a class="mini-action" href="${closedControlHrefs.get(control.control_id)}">Closed decision ↗</a>` : ""}</article>`).join("")}
          </div>
          <footer><strong>Context only:</strong> ${esc(primeCrystal.contextual_examples.interpretation)} <nav>${wniMarkerHref ? `<a class="mini-action" href="${wniMarkerHref}">WNI closure marker ↗</a>` : ""}${elevenSpaceJanusHref ? `<a class="mini-action" href="${elevenSpaceJanusHref}">CRT / Janus examples ↗</a>` : ""}${hmaBoundaryHref ? `<a class="mini-action" href="${hmaBoundaryHref}">HMA visual-only boundary ↗</a>` : ""}</nav></footer>
        </section>
        <section class="nav-utility-gate-card" aria-label="NAV-UTILITY-01 open human utility gate">
          <div>
            <span>NAV-UTILITY-01 · HUMAN OWNER GATE</span>
            <strong>${esc(primeCrystal.utility_assessment.status.replaceAll("_", " "))}</strong>
            <p>${esc(primeCrystal.utility_assessment.decision_question)}</p>
          </div>
          <div class="nav-utility-gate-state">
            <small>Current result</small>
            <strong>${esc(primeCrystal.utility_assessment.result.replaceAll("_", " "))}</strong>
            <p>${primeCrystal.utility_assessment.time_limit_seconds / 60} minutes · ${primeCrystal.utility_assessment.registered_gates} locked gates · ${esc(primeCrystal.utility_assessment.participant_scope)} · ${esc(primeCrystal.utility_assessment.execution_disposition.replaceAll("_", " "))}</p>
          </div>
          <div class="life-usefulness-actions">${navUtilityHref ? `<a class="instrument-action" href="${navUtilityHref}">Start usefulness test ↗</a>` : ""}${navUtilityPreregHref ? `<a class="mini-action" href="${navUtilityPreregHref}">Frozen protocol ↗</a>` : ""}${navUtilityLockHref ? `<a class="mini-action" href="${navUtilityLockHref}">Hash lock ↗</a>` : ""}${navUtilityMissionHref ? `<a class="mini-action" href="${navUtilityMissionHref}">Mission Control readiness ↗</a>` : ""}</div>
          <p class="nav-utility-gate-boundary">${esc(primeCrystal.utility_assessment.interpretation_boundary)}</p>
        </section>
        <p class="life-usefulness-boundary"><strong>Claim boundary:</strong> ${esc(primeCrystal.claim_ceiling)}</p>
      </section>

      <header class="section-heading"><p class="eyebrow">Complete LIFE program</p><h2>All twenty-one records · nineteen standalone HTML instruments</h2><p>The admitted P6 route is the entrance, not the whole programme. Every package keeps its own status, authority and claim ceiling.</p></header>
      <section class="life-program-summary" aria-label="LIFE program counts">
        <article><strong>${lifeProgram.records.length}</strong><span>program records</span></article>
        <article><strong>${lifeProgram.counts.dedicated_html_apps}</strong><span>standalone HTML apps</span></article>
        <article><strong>${lifeProgram.counts.navigator_host_surfaces}</strong><span>Navigator host route</span></article>
        <article><strong>${lifeProgram.counts.non_html_engine_packages}</strong><span>deterministic kernel</span></article>
      </section>
      <section class="life-program-lines">
        ${lifeProgram.program_lines.map((line, index) => `<details ${index === 0 ? "open" : ""}><summary><span>${esc(line.id)}</span><strong>${esc(lifeLineTitles[line.id] || line.kind)}</strong><small>${line.sequence.length} records</small></summary><div class="life-program-grid">${line.sequence.map((id) => lifeRecordCard(lifeRecordById.get(id))).join("")}</div></details>`).join("")}
      </section>
      <div class="life-program-actions"><a class="secondary-action" href="${safeLocalHref(lifeProgram.readme)}">Open programme consolidation ↗</a><a class="secondary-action" href="${safeLocalHref(lifeProgram.controlling_record)}">Open machine register ↗</a><a class="secondary-action" href="${safeLocalHref(lifeProgram.audit)}">Open programme audit ↗</a></div>
      <section class="life-claim-boundary"><span>Programme claim ceiling</span><p>${esc(lifeProgram.global_claim_ceiling)}</p><p>${esc(lifeOrbit.claim_ceiling)}</p></section>`;
    setContext({
      object: "LIFE//ORBIT · internally admitted",
      boundary: `${lifeProgram.global_claim_ceiling} ${lifeOrbit.claim_ceiling}`,
      receipt: `${lifeOrbit.admission_id} · ${lifeProgram.records.length} programme records · ${lifeProgram.counts.dedicated_html_apps} standalone HTML apps · public release false`
    });
  }

  function renderRoot7Look() {
    const href = (key) => safeLocalHref(root7Look.sources[key]);
    const dossierHref = href("dossier_html");
    app.innerHTML = `${pageHeader("SOURCE-BOUND ORIENTATION · NO REOPEN", "ROOT7 · LOOK", "An exact 8→16 sign-state fixture and the declared 4D vector (2,1,1,1) are shown together while their mathematical roles remain distinct. The closed ROOT7 verdict controls every interpretation.", dossierHref ? `<a class="instrument-action" href="${dossierHref}">Open Lab dossier ↗</a>` : "")}
      <section class="root7-equation-grid" aria-label="ROOT7 exact distinctions">
        <article><span>CARDINALITY</span><strong>2³ = 8 → 2⁴ = 16</strong><p>Three binary coordinates and one separately declared binary channel.</p></article>
        <div aria-hidden="true">≠</div>
        <article><span>EUCLIDEAN NORM</span><strong>(2,1,1,1) → √7</strong><p>2² + 1² + 1² + 1² = 7. Metric calculation, not state-count identity.</p></article>
      </section>
      ${dossierHref ? `<section class="life-instrument-shell root7-instrument"><iframe title="ROOT7 LOOK source-bound Lab dossier" src="${dossierHref}" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe></section>` : ""}
      <header class="section-heading"><p class="eyebrow">BOUND CLOSEOUT</p><h2>Three gates remain negative.</h2><p>The orientation layer displays the result; it does not revise it.</p></header>
      <section class="life-evidence-grid root7-decisions">${root7Look.decisions.map((item) => `<article><span>${esc(item.gate)}</span><strong>${esc(item.result)}</strong></article>`).join("")}</section>
      <section class="root7-source-grid">
        <article><p class="overline">LAB SOURCE</p><h2>Orientation record</h2><p>Hash-bound synthesis of the two registered HTML instruments.</p>${href("source_readme") ? `<a href="${href("source_readme")}">Open README ↗</a>` : ""}${href("source_binding") ? `<a href="${href("source_binding")}">Open source receipt ↗</a>` : ""}</article>
        <article><p class="overline">DECISION AUTHORITY</p><h2>Closed bounded result</h2><p>Axis, route-history and bridge-identification decisions remain package-local.</p>${href("closeout") ? `<a href="${href("closeout")}">Open closeout ↗</a>` : ""}${href("custody") ? `<a href="${href("custody")}">Open custody record ↗</a>` : ""}</article>
      </section>
      <p class="root7-boundary"><strong>Claim ceiling</strong> ${esc(root7Look.claim_ceiling)}</p>`;
    setContext({ object: "ROOT7 · LOOK", boundary: root7Look.claim_ceiling, receipt: `${root7Look.binder_id} · ${root7Look.source_record} · publication false` });
  }

  function renderIlauOrientation() {
    const primary = ilauOrientation.instruments[0];
    const primaryHref = safeLocalHref(primary.local_path);
    const sourceHref = safeLocalHref(ilauOrientation.source_family.readme);
    const inventoryHref = safeLocalHref(ilauOrientation.source_family.inventory);
    const boundaryHref = safeLocalHref(ilauOrientation.sources.human_owner_boundary);
    const bookHref = safeLocalHref(ilauOrientation.sources.book_chapter);
    const cards = ilauOrientation.instruments.map((instrument, index) => {
      const href = safeLocalHref(instrument.local_path);
      return `<article class="ilau-instrument-card ${index === 0 ? "is-primary" : ""}">
        <span class="idline">${esc(instrument.classification)} · ${esc(instrument.family)}</span>
        <h2>${esc(instrument.title)}</h2>
        <p>${esc(instrument.summary)}</p>
        <dl><div><dt>Role</dt><dd>${esc(instrument.role)}</dd></div><div><dt>SHA-256</dt><dd class="mono">${esc(instrument.sha256.slice(0, 12))}…</dd></div></dl>
        <p class="lineage-boundary"><strong>Boundary</strong> ${esc(instrument.claim_boundary)}</p>
        ${href ? `<a class="secondary-action" href="${href}">Open HTML instrument ↗</a>` : ""}
      </article>`;
    }).join("");
    app.innerHTML = `${pageHeader("SOURCE-BOUND DOCUMENTARY LENS · EXTENDED 2026-10-10", ilauOrientation.title, ilauOrientation.subtitle, bookHref ? `<a class="instrument-action" href="${bookHref}">Open A0 Chapter 08 ↗</a>` : "")}
      <section class="ilau-route-chain" aria-label="ILAU return chain">${ilauOrientation.return_chain.map((step) => `<span>${esc(step)}</span>`).join("<i>→</i>")}</section>
      ${primaryHref ? `<section class="life-instrument-shell ilau-primary-instrument"><iframe title="${esc(primary.title)} source-bound instrument" src="${primaryHref}" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe></section>` : ""}
      <header class="section-heading"><p class="eyebrow">Nineteen source-bound entries</p><h2>One lineage, several distinct jobs.</h2><p>The route keeps carrier, aperture, seam, cartographic encoding, residual, music/register and return views separate while preserving their common documentary source.</p></header>
      <section class="ilau-instrument-grid">${cards}</section>
      <header class="section-heading"><p class="eyebrow">Local comparison vocabulary</p><h2>I · L · A · U</h2><p>These states classify a declared comparison. They do not explain cause or choose a decision rule.</p></header>
      <section class="ilau-status-grid">${ilauOrientation.ilau.map((item) => `<article data-code="${esc(item.code)}"><strong>${esc(item.code)}</strong><h3>${esc(item.label)}</h3><p>${esc(item.definition)}</p></article>`).join("")}</section>
      <section class="ilau-source-strip"><article><span>CONTROLLING INTAKE</span><strong>${esc(ilauOrientation.source_family.source_count)} source files · ${esc(ilauOrientation.source_family.html_instrument_count)} HTML instruments</strong>${sourceHref ? `<a href="${sourceHref}">Open intake README ↗</a>` : ""}${inventoryHref ? `<a href="${inventoryHref}">Open exact inventory ↗</a>` : ""}</article><article><span>DECISION BOUNDARY</span><strong>Classification remains distinct from decision.</strong>${boundaryHref ? `<a href="${boundaryHref}">Open Human Owner closure ↗</a>` : ""}</article></section>
      <p class="root7-boundary"><strong>Claim ceiling</strong> ${esc(ilauOrientation.claim_ceiling)}</p>`;
    setContext({ object: ilauOrientation.title, boundary: ilauOrientation.claim_ceiling, receipt: `${ilauOrientation.binder_id} · ${ilauOrientation.instruments.length}/${ilauOrientation.instruments.length} instrument hashes bound · publication false` });
  }

  function renderRelations() {
    app.innerHTML = `${pageHeader("Typed relation records", "Connections with edges", "Every displayed connection has named endpoints, an explanation, provenance and a negative boundary. No free-floating visual similarity is promoted to a relation.")}
      <div class="relation-list">${relations.length ? relations.map((relation) => relationCard(relation)).join("") : `<section class="empty-state"><h2>No admitted relations</h2></section>`}</div>`;
    setContext({ object: "Relations", boundary: "A relation record preserves an inspectable comparison path. It does not prove causal, mathematical or physical identity unless its own contract says so.", receipt: `${relations.length} admitted relations · endpoints resolved` });
  }

  function renderObservatory() {
    const sourceHref = (key) => safeLocalHref(observatoryBinding.sources[key]);
    const observatoryHref = sourceHref("observatory");
    const fieldById = new Map(observatoryBinding.typed_fields.map((field) => [field.id, field]));
    const fieldToken = (id, strength) => {
      const field = fieldById.get(id);
      return `<span class="observatory-field-token ${strength}" title="${esc(field?.question || id)}"><b>${esc(id)}</b>${esc(field?.title || id)}</span>`;
    };
    app.innerHTML = `${pageHeader("V1.3 · internal read-only lens", "Transition & Identifiability Observatory", "Seven canonical Connection Families meet one eight-field inspection grammar. The fields structure comparison across families; they do not create an eighth family or merge distinct carriers, operators and evidence.", observatoryHref ? `<a class="instrument-action" href="${observatoryHref}">Open Observatory V1.3 ↗</a>` : "")}
      <section class="observatory-namespace" aria-label="Namespace distinction">
        <article><span>CF:F1–F7</span><strong>Seven Connection Families</strong><p>Recurring kinds of relational work in the Navigator.</p><a href="#families">Open Family map →</a></article>
        <div aria-hidden="true">×</div>
        <article><span>TF:01–TF:08</span><strong>Eight typed fields</strong><p>One inspection record applied across distinct objects and claims.</p></article>
      </section>
      <section class="observatory-flow" aria-label="Canonical typed record">
        ${observatoryBinding.typed_fields.map((field) => `<article title="${esc(field.question)}"><span>${esc(field.id)}</span><strong>${esc(field.title)}</strong><small>${esc(field.formula)}</small></article>`).join("")}
      </section>

      <header class="section-heading"><p class="eyebrow">7 × 8 CROSSWALK</p><h2>Family questions, typed inspection fields</h2><p>Filled tokens mark the primary inspection emphasis; outlined tokens are supporting fields. Every assignment is navigational and non-exclusive.</p></header>
      <section class="observatory-crosswalk" aria-label="Seven families by eight typed fields">
        ${observatoryBinding.family_bindings.map((family) => `<article>
          <header><span>${esc(family.family_id)}</span><div><strong>${esc(family.title)}</strong><p>${esc(family.question)}</p></div></header>
          <div class="observatory-field-row">${family.primary_fields.map((id) => fieldToken(id, "primary")).join("")}${family.supporting_fields.map((id) => fieldToken(id, "supporting")).join("")}</div>
          <small>${esc(family.boundary)}</small>
        </article>`).join("")}
      </section>

      <header class="section-heading"><p class="eyebrow">V1.3 FINDINGS</p><h2>What the archaeology actually recovered</h2><p>Exact, bounded and unresolved layers remain visibly separate.</p></header>
      <section class="observatory-highlights">
        ${observatoryBinding.highlights.map((item) => `<article><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span><small>${esc(item.status)}</small></article>`).join("")}
      </section>

      <section class="panel-grid observatory-panels">
        <article class="panel"><p class="eyebrow">RELATIONS</p><h2>Family & Relations Matrix</h2><p>Eleven instrument groups and eleven typed relations state what is preserved, lost and required for return.</p>${sourceHref("matrix") ? `<a href="${sourceHref("matrix")}">Open machine record ↗</a>` : ""}</article>
        <article class="panel"><p class="eyebrow">MULTI-GRID</p><h2>Grid family, not universal grid</h2><p>Fifteen nodes and fifteen typed edges separate exact, bounded, candidate and visual-only paths.</p>${sourceHref("multi_grid_finding") ? `<a href="${sourceHref("multi_grid_finding")}">Open finding ↗</a>` : ""}${sourceHref("multi_grid_ledger") ? `<a href="${sourceHref("multi_grid_ledger")}">Open ledger ↗</a>` : ""}</article>
        <article class="panel"><p class="eyebrow">GEOMETRIA NOVA</p><h2>Resonance Cathedral lineage</h2><p>Identifier inheritance, GLB counterparts and model co-location are bound without claiming USDZ recovery or mesh derivation.</p>${sourceHref("lineage_intake") ? `<a href="${sourceHref("lineage_intake")}">Open intake ↗</a>` : ""}</article>
        <article class="panel"><p class="eyebrow">RECONSTRUCTION</p><h2>Operator tests and recovery</h2><p>The reproducible line-mesh contract and six resampling paths pass their bounded tests; the historical generator remains open.</p>${sourceHref("recovery_finding") ? `<a href="${sourceHref("recovery_finding")}">Open recovery finding ↗</a>` : ""}</article>
      </section>

      <section class="observatory-residuals">
        <div><p class="eyebrow">RESIDUAL / STILL OPEN</p><h2>Four boundaries survive the closeout</h2><ol>${observatoryBinding.open_residuals.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></div>
        <nav aria-label="Observatory closeout records">
          ${sourceHref("open_questions") ? `<a href="${sourceHref("open_questions")}">Open questions ↗</a>` : ""}
          ${sourceHref("freeze") ? `<a href="${sourceHref("freeze")}">V1.3 freeze record ↗</a>` : ""}
          ${sourceHref("mission_control_return") ? `<a href="${sourceHref("mission_control_return")}">Mission Control return ↗</a>` : ""}
        </nav>
      </section>`;
    setContext({
      object: "Transition & Identifiability Observatory V1.3",
      boundary: observatoryBinding.claim_ceiling,
      receipt: `${observatoryBinding.release} · 7 canonical families · 8 typed fields · internal read-only lens`
    });
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
      ${renderOrionEvidenceLens()}
      ${renderFeaturedEvidenceCase("evidence")}
      <div class="entity-list">${evidence.map(renderEntityCard).join("")}</div>`;
    setContext({ object: "Evidence · ORION lens", boundary: "A negative or null package result remains negative or null in its original scope. Science Lab evidence does not extend ORION product authority.", receipt: `${evidence.length} evidence nodes · ORION L0–L4 source-bound · canonical counts unchanged` });
  }

  function renderOrionEvidenceLens() {
    const sourceLink = (source, label = "Source") => {
      const href = safeLocalHref(source);
      return href ? `<a href="${href}">${esc(label)} ↗</a>` : "";
    };
    const authority = orionEvidence.authority_chain.map((item) => `<article><span>${esc(item.layer)}</span><h3>${esc(item.role)}</h3><p>${esc(item.boundary)}</p>${sourceLink(item.source)}</article>`).join("");
    const levels = orionEvidence.evidence_ladder.map((item) => `<article class="orion-level orion-${esc(item.status_class)}"><header><strong>${esc(item.level)}</strong><span>${esc(item.status.replaceAll("_", " "))}</span></header><h3>${esc(item.carrier)}</h3><p>${esc(item.result)}</p><small>${esc(item.claim_boundary)}</small><nav>${sourceLink(item.source, "Primary")}${item.secondary_source ? sourceLink(item.secondary_source, "Second run") : ""}</nav></article>`).join("");
    const interfaces = orionEvidence.interfaces.map((item) => `<article><span>${esc(item.state.replaceAll("_", " "))}</span><h3>${esc(item.name)}</h3><p>${esc(item.role)}</p><small>${esc(item.boundary)}</small>${sourceLink(item.source)}</article>`).join("");
    return `<section id="orion-capability-evidence" class="orion-evidence-lens">
      <header class="orion-lead"><div><p class="eyebrow">Source-bound method and capability view</p><h2>${esc(orionEvidence.title)}</h2><p>${esc(orionEvidence.summary)}</p></div><div class="orion-status"><span>CERTIFIED CORE</span><strong>bounded</strong><span>SCIENCE EVIDENCE</span><strong>L0–L3</strong><span>OPEN / INVALID</span><strong>L4</strong></div></header>
      <div class="orion-authority-chain" aria-label="ORION authority chain">${authority}</div>
      <details open class="orion-drawer"><summary><span>Validation ladder</span><small>L0–L4 · negative result retained</small></summary><div class="orion-level-grid">${levels}</div></details>
      <details class="orion-drawer"><summary><span>Certified scope</span><small>included and explicitly excluded</small></summary><div class="orion-scope-grid"><article><h3>Certified V1 includes</h3><ul>${orionEvidence.certified_core.included.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article><article class="orion-excluded"><h3>Certified V1 excludes</h3><ul>${orionEvidence.certified_core.excluded.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article></div></details>
      <details class="orion-drawer"><summary><span>Interfaces and lineage</span><small>not one runtime</small></summary><div class="orion-interface-grid">${interfaces}</div></details>
      <div class="orion-bottom-grid"><article><p class="eyebrow">OPEN GATES</p><h3>What still has to be earned</h3><ol>${orionEvidence.open_gates.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></article><article class="orion-boundary"><p class="eyebrow">NON-IDENTITIES</p><h3>What must not collapse</h3><ul>${orionEvidence.non_identities.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article></div>
      <footer><strong>Claim ceiling</strong><p>${esc(orionEvidence.claim_ceiling)}</p><a href="#ladders">Open comparative Ladder Atlas →</a><a href="#findings-frontiers">Open Findings &amp; Frontiers →</a></footer>
    </section>`;
  }

  function renderFindingsFrontiers() {
    const sourceById = new Map(findingsFrontiers.sources.map((source) => [source.source_id, source]));
    const classCards = findingsFrontiers.classes.map((group) => `
      <article class="findings-class-card tone-${esc(group.evidence_class)}">
        <header><span>${esc(group.evidence_class.toUpperCase())}</span><h2>${esc(group.label)}</h2></header>
        <p>${esc(group.summary)}</p>
        <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        <div class="findings-source-links">${group.source_ids.map((id) => {
          const source = sourceById.get(id);
          const href = source ? safeLocalHref(source.href) : "";
          return source && href ? `<a href="${href}">${esc(source.title)} ↗</a>` : "";
        }).join("")}</div>
        <p class="findings-boundary"><strong>Boundary</strong> ${esc(group.claim_boundary)}</p>
      </article>`).join("");
    const surfaces = findingsFrontiers.navigator_evidence_surfaces.map((surface) => `
      <a class="findings-surface-card" href="${esc(surface.route)}"><span>${esc(surface.title)}</span><p>${esc(surface.role)}</p><small>Open governed evidence surface →</small></a>`).join("");
    const sourceLinks = findingsFrontiers.sources.map((source) => {
      const href = safeLocalHref(source.href);
      return href ? `<a href="${href}"><span>${esc(source.title)}</span><small>${esc(source.authority_role)} ↗</small></a>` : "";
    }).join("");
    const readinessGates = findingsFrontiers.frontier.readiness_gates.map((gate) => `
      <article class="findings-gate">
        <div><span>${esc(gate.gate_id)}</span><small>${esc(gate.status.replaceAll("_", " "))}</small></div>
        <h3>${esc(gate.label)}</h3>
        <p>${esc(gate.evidence)}</p>
      </article>`).join("");
    app.innerHTML = `${pageHeader("Evidence · lead synthesis · internal", findingsFrontiers.title, "One claim-preserving route through what is exact, bounded, negative, historical and still open. Original packages remain the result authorities.", `<a class="secondary-action" href="../EVIDENCE/FINDINGS_AND_FRONTIERS_2026-10-10/README.md">Open lead document ↗</a>`)}
      <section class="findings-lead">
        <p class="eyebrow">Current research object</p>
        <h2>${esc(findingsFrontiers.research_object)}</h2>
        <blockquote>${esc(findingsFrontiers.lead_finding)}</blockquote>
        <p class="findings-return">${esc(findingsFrontiers.operational_return)}</p>
        <div class="findings-grammar">${findingsFrontiers.inspection_grammar.map((field, index) => `<span><small>TF:${String(index + 1).padStart(2, "0")}</small>${esc(field)}</span>`).join("")}</div>
      </section>
      <section class="findings-class-grid" aria-label="Evidence classes">${classCards}</section>
      <section class="findings-frontier">
        <div>
          <p class="eyebrow">Owner-selected research backlog · preparation only · not active</p>
          <h2>${esc(findingsFrontiers.frontier.title)}</h2>
          <p class="findings-human-question">${esc(findingsFrontiers.frontier.human_question)}</p>
          <p>${esc(findingsFrontiers.frontier.hypothesis)}</p>
          <div class="tag-row">${findingsFrontiers.frontier.decomposition.map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div>
        </div>
        <div class="findings-test-grid">
          <article><span>MINIMUM TEST</span><ol>${findingsFrontiers.frontier.minimum_test.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></article>
          <article><span>FAIL / STOP</span><ul>${findingsFrontiers.frontier.fail_conditions.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>
        </div>
      </section>
      <section class="findings-gates">
        <header class="section-heading"><p class="eyebrow">Scientific readiness</p><h2>Six gates, one next decisive test</h2><p>Internal evidence is not the same as external validation. Gate 5 is the next permitted preparation target; execution still requires admission.</p></header>
        <div class="findings-gate-grid">${readinessGates}</div>
        <div class="findings-next-action"><span>NEXT PERMITTED ACTION</span><p>${esc(findingsFrontiers.frontier.owner_selection.next_permitted_action)}</p></div>
      </section>
      <section>
        <header class="section-heading"><p class="eyebrow">Evidence surfaces</p><h2>One lead route, several distinct inspectors</h2><p>The lead document orders these surfaces; it does not merge their evidence or authority.</p></header>
        <div class="findings-surface-grid">${surfaces}</div>
      </section>
      <section>
        <header class="section-heading"><p class="eyebrow">Controlling sources</p><h2>Follow every synthesis back to its record</h2></header>
        <div class="findings-source-register">${sourceLinks}</div>
      </section>
      <section class="panel boundary-panel"><p class="overline">Claim ceiling</p><h2>Lead document ≠ evidence authority</h2><p>${esc(findingsFrontiers.claim_ceiling)}</p></section>`;
    setContext({ object: findingsFrontiers.binder_id, boundary: findingsFrontiers.claim_ceiling, receipt: `${findingsFrontiers.sources.length} hash-bound sources · ${findingsFrontiers.classes.length} evidence classes · canonical counts unchanged` });
  }

  function renderA0OrientationEvidence() {
    const sourceLinks = a0OrientationEvidence.sources.map((source) => `<a class="secondary-action" href="${esc(source.href)}"><span>${esc(source.title)}</span><small>${esc(source.authority_role)} · ${esc(source.sha256.slice(0, 12))}… ↗</small></a>`).join("");
    const aliases = a0OrientationEvidence.aliases.map((item) => `<article class="panel"><p class="overline">${esc(item.canonical)}</p><div class="tag-row">${item.search_terms.map((term) => `<span class="tag">${esc(term)}</span>`).join("")}</div></article>`).join("");
    const nodes = a0OrientationEvidence.nodes.map((node) => `<article class="panel"><span class="idline">${esc(node.node_id)}</span><h3>${esc(node.label)}</h3><p>${esc(node.kind.replaceAll("-", " "))}</p><div class="tag-row"><span class="tag">${esc(node.state.replaceAll("_", " "))}</span>${node.node_id.startsWith("ART:") || node.node_id.startsWith("MOD:") ? `<span class="tag family">existing identity</span>` : `<span class="tag">lens-local reference</span>`}</div></article>`).join("");
    const relationRows = a0OrientationEvidence.relations.map((relation) => `<article class="panel"><p class="overline">${esc(relation.type)} · ${esc(relation.status)}</p><h3>${esc(relation.source)} → ${esc(relation.target)}</h3><p>${esc(relation.statement)}</p><p class="findings-boundary"><strong>Boundary</strong> ${esc(relation.claim_boundary)}</p></article>`).join("");
    const orientationCycle = a0OrientationEvidence.orientation_operator_cycle;
    const stageCards = orientationCycle.stages.map((stage) => `<article class="panel"><p class="overline">${esc(stage.range)} · ${esc(stage.stage)}</p><h3>${stage.operators.map(esc).join(" · ")}</h3><p>${esc(stage.function)}</p><div class="tag-row"><span class="tag">HTML positions ${stage.demonstrator_positions.join("–")}</span><span class="tag ${stage.source_state.includes("GAP") ? "warning" : "family"}">${esc(stage.source_state.replaceAll("_", " "))}</span></div></article>`).join("");
    const entryMap = a0OrientationEvidence.a0_entry_map;
    const entryNumberCards = entryMap.numeric_anchors.map((item) => `<article class="panel"><p class="overline">Exact numeric anchor · ${esc(item.label)}</p><h3>${esc(item.exact)}</h3><p class="findings-boundary"><strong>Boundary</strong> ${esc(item.boundary)}</p></article>`).join("");
    const gridAtlas = a0OrientationEvidence.grid_interaction_atlas;
    const gridLayerCards = gridAtlas.layers.map((item) => `<article class="panel"><p class="overline">${esc(item.layer)} · ${esc(item.status.replaceAll("_", " "))}</p><h3>${esc(item.contract)}</h3>${item.operators.length ? `<div class="tag-row">${item.operators.map((operator) => `<span class="tag">${esc(operator)}</span>`).join("")}</div>` : `<p class="findings-boundary">Contract required before execution.</p>`}</article>`).join("");
    const pascalSuite = a0OrientationEvidence.pascal_pentagon_suite;
    const pascalEmbeddingLinks = pascalSuite.embedded_surfaces.map((item) => `<a class="instrument-action" href="${esc(item.href)}">${esc(item.role === "embedded current Point 03 view" ? "Open embedded Point 03" : "Open embedded companion")} ↗</a>`).join("");
    const pascalCards = pascalSuite.tests.map((test) => `<article class="panel"><p class="overline">${esc(test.test_id)} · ${esc(test.layer)}</p><h3>${esc(test.status.replaceAll("_", " "))}</h3><p>${esc(test.result)}</p></article>`).join("");
    const findingsFlow = a0OrientationEvidence.findings_paper_flow;
    const surfaceCoverage = a0OrientationEvidence.a0_surface_coverage;
    const findingCards = findingsFlow.findings.map((item) => `<article class="panel"><p class="overline">${esc(item.finding_id)} · ${esc(item.state.replaceAll("_", " "))}</p><h3>${esc(item.statement)}</h3><p class="findings-boundary"><strong>Route</strong> ${esc(item.disposition)}</p></article>`).join("");
    const paperLaneCards = findingsFlow.paper_lanes.map((item) => `<article class="panel"><p class="overline">Paper ${esc(item.lane)} · ${esc(item.state.replaceAll("_", " "))}</p><h3>${esc(item.title)}</h3><p><strong>Next gate:</strong> ${esc(item.next_gate)}</p><a class="instrument-action" href="${esc(item.href)}">Open controlled source ↗</a></article>`).join("");
    app.innerHTML = `${pageHeader("Evidence · source-bound lineage · internal", a0OrientationEvidence.title, a0OrientationEvidence.summary, `<a class="secondary-action" href="../EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/README.md">Open binder note ↗</a>`)}
      <section class="findings-lead"><p class="eyebrow">Identity reuse</p><h2>A0 remains one existing object</h2><p>${esc(a0OrientationEvidence.purpose)}</p><div class="findings-grammar"><span><small>SURFACE</small>${esc(a0OrientationEvidence.identity_reuse.a0_surface_entity_id)}</span><span><small>MODULE</small>${esc(a0OrientationEvidence.identity_reuse.a0_module_entity_id)}</span><span><small>LANGUAGE AUTHORITY</small>${esc(a0OrientationEvidence.identity_reuse.ols_release_id)}</span><span><small>PACKAGE</small>${esc(a0OrientationEvidence.identity_reuse.source_package_state)}</span></div></section>
      <section class="panel boundary-panel"><p class="overline">A0 module/surface return · ${esc(surfaceCoverage.status.replaceAll("_", " "))}</p><h2>${surfaceCoverage.bound_surfaces} / ${surfaceCoverage.registered_surfaces} registered A0 surfaces are bound to NN</h2><p>Nine work groups reuse the existing A0, Number View, Orientation, Return, LIFE and Tessarec identities. This is a complete machine-readable coverage projection, not 33 new modules.</p><div class="tag-row"><span class="tag family">33 / 33 bound</span><span class="tag">${surfaceCoverage.work_groups} work groups</span><span class="tag">0 unbound</span><span class="tag warning">canonical count effect: ${esc(surfaceCoverage.canonical_count_effect)}</span></div><a class="instrument-action" href="../EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_MODULE_SURFACE_COVERAGE_V1_2026-10-14.json">Open machine-readable coverage ↗</a></section>
      <header class="section-heading"><p class="eyebrow">NN binding · existing lens reused</p><h2>MRB → ACR/Lissajous → NCS/Q106 → Triple-19 → TripleSix → general fold → interface assembly → A0</h2><p>${esc(a0OrientationEvidence.nn_return_crosswalk_binding.a0_extension)}</p><div class="tag-row"><span class="tag family">${esc(a0OrientationEvidence.nn_return_crosswalk_binding.node_id)}</span><span class="tag">F-A0-14</span><span class="tag">F-A0-15</span><span class="tag">F-A0-16</span><span class="tag warning">no new identity</span></div><p class="findings-boundary"><strong>Completed formal question</strong> ${esc(a0OrientationEvidence.nn_return_crosswalk_binding.completed_formal_question)}</p><p class="findings-boundary"><strong>Next package boundary</strong> ${esc(a0OrientationEvidence.nn_return_crosswalk_binding.next_formal_question)}</p><p class="findings-boundary"><strong>Boundary</strong> ${esc(a0OrientationEvidence.nn_return_crosswalk_binding.claim_boundary)}</p></header>
      <header class="section-heading"><p class="eyebrow">Findings · source-bound · no claim promotion</p><h2>Sixteen findings, four paper lanes, explicit gates</h2><p>The research journey is now readable from bounded source to finding, claim ceiling, paper lane and decision gate. A visual or a Navigator placement never upgrades the evidence state.</p></header><section class="detail-layout">${findingCards}</section>
      <header class="section-heading"><p class="eyebrow">Paper routing · preparation only</p><h2>Existing paper, companion note, or parked outline?</h2><p>Each lane has a different scope and next permitted action. The narrow SCC-003 theorem remains separate from D30, Return synthesis and documentary archaeology.</p></header><section class="detail-layout">${paperLaneCards}</section><section class="panel boundary-panel"><p class="overline">Controlled editorial flow</p><h2>${findingsFlow.flow.map(esc).join(" → ")}</h2><p>${esc(findingsFlow.claim_boundary)}</p></section>
      <header class="section-heading"><p class="eyebrow">A0 entrance · historical crosscuts · ${esc(entryMap.verified_local_source_date)}</p><h2>${esc(entryMap.editorial_thesis)}</h2><p>Five vertical stacks and nine thematic groups plus the Applications lane are retained as different readings of one documentary surface—not as one proven universal geometry.</p></header><section class="detail-layout"><article class="panel"><p class="overline">Vertical condensation</p><h3>${entryMap.vertical_crosscut.map(esc).join(" → ")}</h3><p>A possible route from carrier to navigable path. Every arrow still needs an explicit map.</p></article><article class="panel"><p class="overline">Horizontal editorial map</p><h3>${entryMap.horizontal_crosscut.map(esc).join(" → ")}</h3><p>Organizes representations and tools; it is not automatically a causal sequence.</p></article></section><section class="detail-layout">${entryNumberCards}</section><section class="panel boundary-panel"><p class="overline">Ledger and unresolved alias</p><h2>${esc(entryMap.ledger_rule)}</h2><p>${esc(entryMap.ledger_boundary)}</p><div class="tag-row"><span class="tag warning">U-field unresolved</span><span class="tag">4 source visuals</span><span class="tag">2 July date verified</span></div><p class="findings-boundary"><strong>Boundary</strong> ${esc(entryMap.claim_boundary)}</p><a class="instrument-action" href="${esc(entryMap.book_href)}">Open A0 System Map ↗</a></section>
      <header class="section-heading"><p class="eyebrow">Point 03 · typed grid interactions</p><h2>Carrier → fold → envelope → channel</h2><p>The pentagon envelope is not silently identified with its source grid. Exact finite maps, bounded phase coupling and open visual hypotheses remain status-separated.</p></header><section class="detail-layout">${gridLayerCards}</section><section class="panel boundary-panel"><p class="overline">Coupled-channel contract · not a flow law</p><h2>Symmetric asymmetry becomes testable only after six declarations</h2><div class="tag-row">${gridAtlas.channel_contract.map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div><p class="findings-boundary"><strong>Boundary</strong> ${esc(gridAtlas.claim_boundary)}</p><div class="tag-row"><span class="tag">3 hash-bound search markers</span><span class="tag">C5/C6 remain non-identical</span><span class="tag warning">Envelope ≠ carrier</span></div><a class="instrument-action" href="${esc(gridAtlas.book_href)}">Open Grid Interaction Atlas ↗</a></section>
      <section class="panel boundary-panel"><p class="overline">A0 core principle</p><h2>${esc(a0OrientationEvidence.a0_core_statement.principle)}</h2><blockquote>${esc(a0OrientationEvidence.a0_core_statement.strongest_statement)}</blockquote><div class="findings-grammar">${a0OrientationEvidence.a0_core_statement.typed_chain.map((item, index) => `<span><small>${String(index + 1).padStart(2, "0")}</small>${esc(item)}</span>`).join("")}</div><div class="tag-row">${a0OrientationEvidence.a0_core_statement.protected_distinctions.map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div></section>
      <section class="panel boundary-panel"><p class="overline">Vocabulary control and OLS</p><h2>Aligned, but not identical</h2><p>${esc(a0OrientationEvidence.vocabulary_boundary.answer)}</p><div class="detail-layout"><div><h3>Preserved</h3><ul>${a0OrientationEvidence.vocabulary_boundary.preserved.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><div><h3>Not transferred</h3><ul>${a0OrientationEvidence.vocabulary_boundary.not_transferred.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div></div></section>
      <header class="section-heading"><p class="eyebrow">Working crosswalk · not canonical taxonomy</p><h2>${esc(orientationCycle.title)}</h2><p>The existing HTML demonstrator identity is reused; the twelve process operators remain distinct from the T1–T7 transformation battery.</p></header><section class="detail-layout">${stageCards}</section>
      <section class="panel boundary-panel"><p class="overline">Closure / Return · position ${orientationCycle.closure.position}</p><h2>${esc(orientationCycle.closure.label)}</h2><p>${esc(orientationCycle.closure.source_state.replaceAll("_", " "))}. The supplied storyboard is hash-bound through HP-007, but remains noncanonical; no missing HTML or unfinished operator page is reconstructed.</p><div class="tag-row"><span class="tag">HP-007 source bound</span><span class="tag">T1–T4 controls</span><span class="tag">T5–T7 candidates</span><span class="tag warning">contextualized, never merged</span></div></section>
      <header class="section-heading"><p class="eyebrow">Bounded interactive test suite</p><h2>Pascal pentagon · structure, metric, boundary, 3D lift, roots, growth, coupling</h2><p>One lens-local identity, seven replay records and one non-evidentiary interactive view.</p></header><section class="detail-layout">${pascalCards}</section><section class="detail-layout"><article class="panel"><p class="overline">PENT-07 view · D1…D5 × D30</p><h3>${esc(pascalSuite.d30_formal_extension.status.replaceAll("_", " "))}</h3><p>${esc(pascalSuite.d30_formal_extension.interactive_view)}</p><div class="tag-row"><span class="tag family">${esc(pascalSuite.d30_formal_extension.word_audit)}</span><span class="tag">65 / 150 register-phase places</span><span class="tag warning">no PENT-08</span></div><p class="findings-boundary"><strong>Boundary</strong> ${esc(pascalSuite.d30_formal_extension.claim_boundary)}</p></article></section><section class="panel boundary-panel"><p class="overline">Interactive source-bound view</p><h2>PENT-01 → PENT-02 → PENT-03 → PENT-04 → PENT-05 → PENT-06 → PENT-07</h2><p>${esc(pascalSuite.claim_boundary)}</p><a class="instrument-action" href="${esc(pascalSuite.instrument_href)}">Open Pascal Pentagon Explorer ↗</a>${pascalEmbeddingLinks}</section>
      <header class="section-heading"><p class="eyebrow">Search vocabulary</p><h2>Aliases lead to one bound object</h2><p>These terms improve retrieval. They do not create new canonical names.</p></header><section class="detail-layout">${aliases}</section>
      <header class="section-heading"><p class="eyebrow">Bound objects</p><h2>Existing identities and lens-local references</h2></header><section class="detail-layout">${nodes}</section>
      <header class="section-heading"><p class="eyebrow">Typed relations</p><h2>What is connected—and where it stops</h2></header><section class="detail-layout">${relationRows}</section>
      <header class="section-heading"><p class="eyebrow">Controlling sources</p><h2>${a0OrientationEvidence.sources.length} hash-bound records</h2><p>${esc(a0OrientationEvidence.visual_policy)}</p></header><section class="findings-source-register">${sourceLinks}</section>
      <section class="panel boundary-panel"><p class="overline">Claim ceiling</p><h2>Navigation ≠ activation</h2><p>${esc(a0OrientationEvidence.claim_ceiling)}</p></section>`;
    setContext({ object: a0OrientationEvidence.binder_id, boundary: a0OrientationEvidence.claim_ceiling, receipt: `${a0OrientationEvidence.sources.length} verified source hashes · ${a0OrientationEvidence.relations.length} bounded relations · canonical counts unchanged` });
  }

  function renderFeaturedEvidenceCase(placement = "home") {
    const item = entry?.featured_evidence_case;
    if (!item) return "";
    const caseHref = safeLocalHref(item.surface);
    const resultHref = safeLocalHref(list(item.controlling_records)[0]);
    const moduleHref = item.module_id ? entityHref(item.module_id) : "#atlas";
    const families = list(item.connection_family_ids).map((id) => `${id.replace("CF:", "")} ${FAMILY_NAMES[id] || ""}`).join(" · ");
    return `<section class="featured-evidence-case featured-${esc(placement)}" aria-labelledby="featured-case-${esc(placement)}">
      <div class="featured-case-copy">
        <p class="eyebrow">Current Evidence Case · Navigator v2 preview</p>
        <h2 id="featured-case-${esc(placement)}">${esc(item.title)}</h2>
        <p class="featured-question">${esc(item.question)}</p>
        <p>${esc(item.supported_finding)}</p>
        <div class="tag-row"><span class="tag evidence">${esc(item.result)}</span><span class="tag">${esc(item.human_utility_status)}</span><span class="tag">${esc(item.internal_provenance_label)} · internal label</span></div>
      </div>
      <dl class="featured-case-meta">
        <div><dt>Module</dt><dd>${esc(item.module_id)}</dd></div>
        <div><dt>Families</dt><dd>${esc(families)}</dd></div>
        <div><dt>Residual</dt><dd>Source provenance remains unresolved.</dd></div>
        <div><dt>Next gate</dt><dd>One independent four-question Human Return.</dd></div>
      </dl>
      <div class="featured-case-actions">${caseHref ? `<a class="instrument-action" href="${caseHref}">Open Multi-View Reconstruction ↗</a>` : ""}<a class="secondary-action" href="${moduleHref}">Open Readout Reconstruction</a>${resultHref ? `<a class="secondary-action" href="${resultHref}">Machine result ↗</a>` : ""}</div>
      <p class="featured-case-boundary"><strong>Boundary</strong> ${esc(item.claim_ceiling)}</p>
    </section>`;
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

  function safeExternalHref(value) {
    return /^https:\/\/www\.are\.na\//.test(String(value || "")) ? String(value) : "#orientation-catalog";
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
    return `${manifest.title} · ${manifest.version} · ${entities.length} entities · ${relations.length} relations · P6 overlay admitted`;
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
      case "orientation-catalog": renderOrientationCatalog(); break;
      case "atlas": renderAtlas(); break;
      case "lab-register": renderLabRegister(); break;
      case "about": renderAboutV2(); break;
      case "glossary": renderGlossary(); break;
      case "utg": renderUTG(); break;
      case "dynamics": renderDynamics(); break;
      case "envelope": renderEnvelope(); break;
      case "ladders": renderLadders(); break;
      case "life-orbit": renderLifeOrbit(); break;
      case "observatory": renderObservatory(); break;
      case "root7": renderRoot7Look(); break;
      case "ilau-orientation": renderIlauOrientation(); break;
      case "sequence": renderSequence(); break;
      case "lineage": renderLineage(); break;
      case "prime-base-mode": renderPrimeBaseMode(); break;
      case "relations": renderRelations(); break;
      case "relation": renderRelation(value); break;
      case "families": renderFamilies(); break;
      case "family": renderCatalog({ family: value }); break;
      case "evidence": renderEvidence(); break;
      case "findings-frontiers": renderFindingsFrontiers(); break;
      case "a0-orientation-evidence": renderA0OrientationEvidence(); break;
      case "admission": renderAdmission(); break;
      case "entity": renderEntity(value); break;
      default: renderHomeV2(); break;
    }
    document.querySelector("#workspace")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function initializeChrome() {
    document.querySelector("#build-entity-count").textContent = entities.length;
    document.querySelector("#build-relation-count").textContent = relations.length;
    const currentness = typeof manifest.currentness === "object"
      ? `${manifest.currentness.status || "UNKNOWN"} · ${manifest.currentness.controlling_sources_verified || 0} source receipts`
      : manifest.currentness;
    document.querySelector("#build-date").textContent = `As of ${manifest.as_of} · ${currentness}`;
    familyNav.innerHTML = Object.keys(FAMILY_NAMES).map((family) => `<a href="${familyHref(family)}"><span>${esc(family.replace("CF:", ""))}</span><small>${familyCounts[family] || 0}</small></a>`).join("");
  }

  initializeChrome();
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
})();
