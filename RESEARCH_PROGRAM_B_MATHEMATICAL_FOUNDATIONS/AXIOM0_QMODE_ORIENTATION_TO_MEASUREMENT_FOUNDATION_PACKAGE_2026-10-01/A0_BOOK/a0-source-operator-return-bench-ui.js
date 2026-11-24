(function () {
  "use strict";
  const model = globalThis.A0SourceOperatorReturnBench;
  if (!model) return;

  const format = (value, digits = 9) => Number(value).toLocaleString("de-DE", { maximumFractionDigits: digits });
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  document.querySelectorAll("[data-source-operator-return-bench]").forEach((scope) => {
    const fixtures = model.fixtureSuite();
    const projectionRecord = fixtures.product820;
    const projectionOutput = scope.querySelector("[data-sor-projection]");
    const rootOutput = scope.querySelector("[data-sor-roots]");
    const receiptOutput = scope.querySelector("[data-sor-receipt]");

    scope.querySelector("[data-sor-713]").innerHTML = `
      <strong>${escape(fixtures.product713.label)} → ${fixtures.product713.result}</strong>
      <span>composite · ${fixtures.product713.factorization.join(" × ")}</span>
      <code>${escape(fixtures.product713.record_id)}</code>`;

    scope.querySelector("[data-sor-820]").innerHTML = `
      <strong>${escape(fixtures.product820.label)} = ${escape(fixtures.squares820.label)} = 820</strong>
      <span>same result: ${fixtures.arrival820.same_result} · same derivation: ${fixtures.arrival820.same_derivation}</span>
      <code>${escape(fixtures.product820.record_id)}<br>${escape(fixtures.squares820.record_id)}</code>`;

    scope.querySelector("[data-sor-140]").innerHTML = `
      <strong>${escape(fixtures.sum140.label)} = ${escape(fixtures.scaled140.label)} = 140</strong>
      <span>same result: ${fixtures.arrival140.same_result} · same source: ${fixtures.arrival140.same_source_address}</span>`;

    rootOutput.innerHTML = fixtures.roots.map((item) => `<li><b>√${item.k}</b><span>Δ${item.k}=${format(item.gap)}</span><small>residual ${item.residual.toExponential(1)}</small></li>`).join("");

    function renderProjection(dimension) {
      const projection = model.project(projectionRecord, dimension);
      scope.querySelectorAll("[data-sor-dimension]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.sorDimension === dimension)));
      projectionOutput.innerHTML = `
        <strong>${dimension} · [${projection.projected_coordinate.join(", ")}]</strong>
        <span>${escape(projection.inverse_status)}</span>
        <code>record_id: ${escape(projection.record_id)}<br>lost: ${escape(projection.lost_fields.join(", ") || "none")}</code>`;
      receiptOutput.textContent = JSON.stringify({
        selected_record: projectionRecord,
        projection,
        same_arrival_820: fixtures.arrival820,
        claim_boundary: projectionRecord.claim_boundary
      }, null, 2);
    }

    scope.querySelectorAll("[data-sor-dimension]").forEach((button) => button.addEventListener("click", () => renderProjection(button.dataset.sorDimension)));
    renderProjection("3D");
  });
})();
