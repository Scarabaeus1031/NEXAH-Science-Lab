(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0FA026Review = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => api.mount(document));
    else api.mount(document);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const choose = (n, k) => {
    let value = 1;
    for (let i = 1; i <= k; i += 1) value = value * (n - k + i) / i;
    return value;
  };

  const keyboardPositions = [1, 3, 6, 8, 10];
  const cyclicGaps = positions => positions.map((value, index) => (
    index < positions.length - 1 ? positions[index + 1] - value : positions[0] + 12 - value
  ));

  const review = {
    finding: "F-A0-26",
    ownerScope: "CLOSED_BOUNDED_DESCRIPTIVE_FINDING",
    independentReview: "OPEN",
    partition: [2, 3],
    total: 5,
    labeledCuts: choose(5, 2),
    keyboard: {
      positions: keyboardPositions,
      gaps: cyclicGaps(keyboardPositions),
      semitoneSteps: 12,
      endpointInclusivePositions: 13,
      exactSpacingOrbitCountAmongFiveOfTwelve: 12,
      allFiveOfTwelveSelections: choose(12, 5)
    },
    graph: {
      fullDegree: 5,
      cycleDegree: 2,
      residualDegree: 3,
      anchoredUndirectedHamiltonianCycles: 1280,
      labeledAssignments: 30720,
      distinguishedCycle: false
    },
    clamp: {
      declaredUpRoles: 3,
      declaredDownRoles: 2,
      mirrorSwapsRoles: true,
      mechanicsTransported: false
    },
    acoustics: {
      evidenceClass: "EXISTING_MODEL_AND_COMPARATOR_RESULTS",
      frequencyRail: [24, 27, 30, 32, 36, 40, 45, 48],
      octaveRatio: 2,
      equalRatioClass: "16/15",
      pythagoreanCommaCents: 23.460010384649014,
      measuredInput: "OPEN",
      includedInExactFindingCore: false
    },
    verdicts: {
      recurrence: "PASS",
      countSpecificity: "FAIL",
      sharedTransport: "HOLD",
      sharedMechanism: "REJECT",
      acousticMeasurement: "OPEN",
      threePlusOneBands: "HOLD"
    }
  };

  function evaluate(mode, mirrored) {
    const base = {
      mode,
      mirrored,
      left: mirrored ? 3 : 2,
      right: mirrored ? 2 : 3
    };
    if (mode === "observed") return {...base, status: "PASS", note: "Die geordnete Partition bleibt auf allen drei deklarierten Trägern sichtbar."};
    if (mode === "cuts") return {...base, status: "FAIL_SPECIFICITY", note: `${review.labeledCuts} labelgebundene 2|3-Schnitte besitzen dieselbe Zählsignatur.`};
    if (mode === "graph") return {...base, status: "FAIL_UNIQUENESS", note: `${review.graph.anchoredUndirectedHamiltonianCycles} zulässige Zyklen liefern lokal Grad 2 plus Restgrad 3; keiner ist ausgezeichnet.`};
    return {...base, status: "HOLD_TRANSPORT", note: "Spiegelung erhält {2,3}, vertauscht aber Rollen und Richtung. Ein Witness ist erforderlich."};
  }

  function mount(doc) {
    const root = doc.querySelector("[data-f-a0-26-probe]");
    if (!root) return;
    let mode = "observed";
    let mirrored = false;
    const status = root.querySelector("[data-review-status]");
    const note = root.querySelector("[data-review-note]");
    const left = root.querySelector("[data-left-count]");
    const right = root.querySelector("[data-right-count]");
    const paint = () => {
      const result = evaluate(mode, mirrored);
      status.textContent = result.status;
      status.dataset.state = result.status;
      note.textContent = result.note;
      left.textContent = result.left;
      right.textContent = result.right;
      root.querySelectorAll("[data-review-mode]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.reviewMode === mode));
      });
      const mirror = root.querySelector("[data-review-mirror]");
      mirror.setAttribute("aria-pressed", String(mirrored));
      mirror.textContent = mirrored ? "Spiegel lösen" : "Rollen spiegeln";
    };
    root.querySelectorAll("[data-review-mode]").forEach(button => button.addEventListener("click", () => {
      mode = button.dataset.reviewMode;
      paint();
    }));
    root.querySelector("[data-review-mirror]").addEventListener("click", () => {
      mirrored = !mirrored;
      paint();
    });
    paint();
  }

  return {review, choose, cyclicGaps, evaluate, mount};
});
