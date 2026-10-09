(() => {
  const grid = document.querySelector("#instrument-grid");
  const relationList = document.querySelector("#relation-list");
  const search = document.querySelector("#search");
  const evidence = document.querySelector("#evidence");
  const state = document.querySelector("#loaded-state");
  const kappaGrid = document.querySelector("#kappa-grid");
  const kappaPair = document.querySelector("#kappa-pair");
  const kappaAddress = document.querySelector("#kappa-address");
  const kappaReturn = document.querySelector("#kappa-return");
  const kappaResidual = document.querySelector("#kappa-residual");
  const kappaNote = document.querySelector("#kappa-note");
  const multiGridNodes = document.querySelector("#multigrid-nodes");
  const multiGridEdges = document.querySelector("#multigrid-edges");
  const multiGridSelected = document.querySelector("#multigrid-selected");
  const multiGridRole = document.querySelector("#multigrid-role");
  let matrix = null;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const evidenceClass = (item) => /negative/i.test(item.status + item.evidence) ? "negative" : /exact/i.test(item.evidence) ? "exact" : "bounded";

  function renderInstruments() {
    const term = search.value.trim().toLowerCase();
    const wanted = evidence.value;
    const matches = matrix.instruments.filter((item) => {
      const haystack = Object.values(item).join(" ").toLowerCase();
      return (!term || haystack.includes(term)) && (wanted === "all" || evidenceClass(item) === wanted);
    });
    grid.innerHTML = matches.map((item) => `<article class="instrument">
      <header><div><div class="family">${esc(item.family)}</div><h3>${esc(item.title)}</h3></div><span class="pill">${esc(item.status)}</span></header>
      <dl><dt>Carrier</dt><dd>${esc(item.carrier)}</dd><dt>Operator</dt><dd>${esc(item.operator)}</dd><dt>View</dt><dd>${esc(item.view)}</dd><dt>Fiber</dt><dd>${esc(item.fiber)}</dd><dt>Return</dt><dd>${esc(item.return)}</dd></dl>
      <footer><span>${esc(item.claim_ceiling)}</span><a href="${esc(item.path)}">Open source ↗</a></footer>
    </article>`).join("") || `<p>No bounded instrument matches this filter.</p>`;
  }

  function renderRelations() {
    const names = new Map(matrix.instruments.map((item) => [item.id, item.title]));
    relationList.innerHTML = matrix.relations.map((item) => `<article class="relation">
      <strong>${esc(names.get(item.source) || item.source)}</strong><span class="type">${esc(item.type)} →</span><strong>${esc(names.get(item.target) || item.target)}</strong>
      <p><em>retains:</em> ${esc(item.preserves)} · <i>does not retain:</i> ${esc(item.loses)}</p>
    </article>`).join("");
  }

  const rows = "ABCDEFG";
  const setKappaReadout = ({pair, address, returnState, residual, note}) => {
    kappaPair.textContent = pair;
    kappaAddress.textContent = address;
    kappaReturn.textContent = returnState;
    kappaResidual.textContent = residual;
    kappaNote.textContent = note;
  };

  if (kappaGrid) {
    kappaGrid.innerHTML = Array.from({length: 49}, (_, index) => {
      const lower = index + 1;
      const upper = 100 - lower;
      const row = rows[Math.floor(index / 7)];
      const column = index % 7 + 1;
      return `<button type="button" data-kappa-lower="${lower}" data-kappa-upper="${upper}" data-kappa-address="${row}${column}"><small>${row}${column}</small><strong>${lower}</strong><span>${upper}</span></button>`;
    }).join("");
    const choose = (button) => {
      document.querySelectorAll("[data-kappa-lower], [data-kappa-kind]").forEach((node) => node.classList.remove("selected"));
      button.classList.add("selected");
      if (button.dataset.kappaKind === "boundary") {
        setKappaReadout({pair:"{0, 100}", address:"BOUNDARY · outer pair", returnState:"side key required", residual:"100 directed units", note:"The two endpoints share one quotient address but remain distinct carrier states."});
      } else if (button.dataset.kappaKind === "hinge") {
        setKappaReadout({pair:"{50}", address:"HINGE · fixed point", returnState:"unique · no side key", residual:"0", note:"The central state is its own image under J and therefore survives the fold without ambiguity."});
      } else {
        const lower = Number(button.dataset.kappaLower);
        const upper = Number(button.dataset.kappaUpper);
        setKappaReadout({pair:`{${lower}, ${upper}}`, address:`${button.dataset.kappaAddress} · interior ${lower}/49`, returnState:"side key required", residual:`${upper-lower} directed units`, note:"The grid stores the orbit address; it does not by itself retain which representative entered."});
      }
    };
    document.querySelectorAll("[data-kappa-lower], [data-kappa-kind]").forEach((button) => button.addEventListener("click", () => choose(button)));
    choose(kappaGrid.querySelector("button"));
  }

  if (multiGridNodes && window.NEXAH_MULTI_GRID_LEDGER) {
    const ledger = window.NEXAH_MULTI_GRID_LEDGER;
    const nodeMap = new Map(ledger.nodes.map((node) => [node.id, node]));
    const edgeClass = (status) => `edge-${status.replace(/[^a-z]+/g, "-")}`;
    const renderGridRelations = (selectedId) => {
      const selected = nodeMap.get(selectedId);
      multiGridNodes.querySelectorAll("button").forEach((button) => {
        const active = button.dataset.gridId === selectedId;
        button.classList.toggle("selected", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      multiGridSelected.textContent = `${selected.label} · ${selected.size}`;
      multiGridRole.textContent = `${selected.kind} — ${selected.role}`;
      const related = ledger.edges.filter((edge) => edge.source === selectedId || edge.target === selectedId);
      multiGridEdges.innerHTML = related.map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        return `<article class="multigrid-edge ${edgeClass(edge.status)}">
          <div class="edge-route"><strong>${esc(source.label)}</strong><span>→</span><strong>${esc(target.label)}</strong><small>${esc(edge.status)}</small></div>
          <h3>${esc(edge.operator)}</h3>
          <p><b>retains</b> ${esc(edge.preserves)} <i>loses</i> ${esc(edge.loses)} <em>return</em> ${esc(edge.return_key)}</p>
        </article>`;
      }).join("") || `<p class="boundary">No registered relation touches this node.</p>`;
    };
    multiGridNodes.innerHTML = ledger.nodes.map((node) => `<button type="button" data-grid-id="${esc(node.id)}" aria-pressed="false" aria-label="${esc(`${node.label}, ${node.size}, ${node.role}`)}"><small>${esc(node.id)}</small><strong>${esc(node.label)}</strong><span>${esc(node.size)}</span></button>`).join("");
    multiGridNodes.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => renderGridRelations(button.dataset.gridId)));
    renderGridRelations("Q51");
  }

  const loadMatrix = window.NEXAH_OBSERVATORY_MATRIX
    ? Promise.resolve(window.NEXAH_OBSERVATORY_MATRIX)
    : fetch("FAMILY_RELATIONS_MATRIX.json")
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  loadMatrix.then((data) => {
      matrix = data;
      renderInstruments();
      renderRelations();
      state.textContent = `${data.instruments.length} instruments · ${data.relations.length} typed relations · ${data.status}`;
    })
    .catch(() => {
      state.textContent = "Open through the Codex browser or a local HTTP server to load the JSON matrix.";
      grid.innerHTML = `<article class="instrument"><h3>Matrix available as a separate record</h3><p>This page keeps the source JSON external so the machine-readable record remains authoritative.</p><a href="FAMILY_RELATIONS_MATRIX.json">Open matrix →</a></article>`;
    });

  search.addEventListener("input", () => matrix && renderInstruments());
  evidence.addEventListener("change", () => matrix && renderInstruments());
})();
