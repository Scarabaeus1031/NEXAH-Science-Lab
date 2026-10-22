(() => {
  const stageData = {
    source:{kicker:"01 · Situation / source",title:"Nothing begins as a neutral answer.",body:"Orientation begins with a situated source: an event, document, measurement, model, image or software output. Its version, custody and availability belong to the record.",input:"Named source · version · provenance",question:"What is actually available?",tool:"Source binding · provenance trace",evidence:"Source pointer · version · hash or custody state",families:"F1 · Observation / Record · F7 · Validation / Governance",recorder:"Source identity · provenance · custody state",instrument:"Source Graph · manifests · Navigator",boundary:"SOURCE ≠ RECORD ≠ INTERPRETATION"},
    question:{kicker:"02 · Question / position",title:"A question creates a direction of attention.",body:"Purpose, role, time, scale and prior knowledge shape what can become visible. The observer is operationally the declared position and procedure—not automatically a conscious cause or physical field.",input:"Purpose · role · scale · time",question:"Who asks what, from where, and why?",tool:"Question contract · context · scale",evidence:"Admission fields · comparator · STOP rule",families:"F2 · Address / Boundary · F7 · Validation / Governance",recorder:"Question pointer · scope · lifecycle boundary",instrument:"A0 Science · Lab Register · protocol",boundary:"POSITIONED VIEW ≠ ARBITRARY VIEW"},
    cut:{kicker:"03 · Cut / boundary",title:"A cut makes something inspectable.",body:"A selection, interval, category, threshold or frame admits some information and withholds other information. The boundary must remain visible because it can reveal, amplify, transform or co-produce the result.",input:"Selection rule · threshold · frame",question:"What enters, and what stays outside?",tool:"PT-SIG-01 · Aperture / Boundary",evidence:"Admitted · withheld · unavailable",families:"F2 · Address / Boundary · F7 · Validation / Governance",recorder:"Boundary relation · exclusions · unavailable state",instrument:"D-GATE fixture · Boundary instruments",boundary:"SELECTION ≠ WHOLE FIELD"},
    transform:{kicker:"04 · Operator / translation",title:"The path from source to view is part of the result.",body:"An operator, projection, encoding or translation changes representation. Its domain, codomain, parameters and failure semantics must be declared before outputs can be compared.",input:"Typed map · parameters · failure",question:"What happened between source and output?",tool:"PT-SIG-02 · Projection",evidence:"Map · collisions · reconstruction test",families:"F3 · Transition / Operator · F4 · Phase / Drift where declared",recorder:"Typed map · parameters · loss / collision state",instrument:"NEXAH Core · OLS contracts · HTML / GLB",boundary:"VIEW ≠ OPERATOR ≠ MECHANISM"},
    compare:{kicker:"05 · Comparison / I·L·A·U",title:"Difference is recorded before it is explained.",body:"Comparison separates what was retained, lost, added or remains unresolved. Endpoint similarity is not identity, and successful replay does not by itself establish meaning, causality or usefulness.",input:"Comparator · invariant · tolerance",question:"What survived—and at what cost?",tool:"I / L / A / U · comparator",evidence:"Baseline · controls · replay receipt",families:"F1 · Observation / Record · F7 · Validation / Governance · F4–F6 where declared",recorder:"Typed difference · relation basis · unresolved alternatives",instrument:"NEXAH Compare · audits · replays",boundary:"SIMILARITY ≠ IDENTITY"},
    residual:{kicker:"06 · Residual / claim ceiling",title:"The remainder is a typed address, not a waste bin.",body:"A residual only has meaning relative to a declared comparison rule, measure, tolerance and context. It can locate error, information loss, semantic difference or a still-open Human decision.",input:"Criterion · residual type · ceiling",question:"What does not close, and why?",tool:"PT-SIG-03 · Relation · residual typing",evidence:"Residual · negative result · claim ceiling",families:"F7 · Validation / Governance · F1 · Observation / Record",recorder:"PASS / FAIL / HOLD / INVALID · claim ceiling",instrument:"ORION bounded checks · Evidence Lens",boundary:"RESIDUAL ≠ UNIVERSAL SUBSTANCE"},
    return:{kicker:"07 · Human Return",title:"The system returns a record—not authority.",body:"The Human may confirm, amend, reject, abstain, stop, act or ask again. A valid Return can therefore be a decision, a better question, a reasoned objection or an explicit ‘not yet decidable’.",input:"Record · limits · options · STOP",question:"What remains for Human judgment?",tool:"Return · abstention · STOP",evidence:"Faithful report · receipt · open boundary",families:"F7 · Validation / Governance · F1 · Observation / Record",recorder:"Decision · objection · abstention · next question",instrument:"THE EYE · NEXAHEDRON · Reader / Observatory",boundary:"ORIENTATION SUPPORT ≠ DECISION AUTHORITY"}
  };
  const buttons = [...document.querySelectorAll("[data-stage]")];
  const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  buttons.forEach((button) => button.addEventListener("click", () => {
    const data = stageData[button.dataset.stage]; if (!data) return;
    buttons.forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    setText("stageKicker", data.kicker);setText("stageTitle", data.title);setText("stageBody", data.body);
    setText("stageInput", data.input);setText("stageQuestion", data.question);setText("stageTool", data.tool);
    setText("stageEvidence", data.evidence);setText("stageFamilies", data.families);setText("stageRecorder", data.recorder);
    setText("stageInstrument", data.instrument);setText("stageBoundary", data.boundary);
  }));

  const checks = [...document.querySelectorAll("[data-gate-check]")];
  const output = document.querySelector("[data-gate-result]");
  const updateGate = () => {
    if (!checks.length || !output) return;
    const count = checks.filter((item) => item.checked).length;
    const percent = Math.round((count / checks.length) * 100);
    output.dataset.ready = String(count === checks.length);
    output.querySelector("[data-gate-count]").textContent = `${count} / ${checks.length} declarations`;
    output.querySelector("[data-gate-title]").textContent = count === checks.length ? "Ready for an admission decision." : "Not yet a research object.";
    output.querySelector("[data-gate-copy]").textContent = count === checks.length
      ? "The declaration is complete enough to be reviewed. Admission, execution and publication still require their own authority."
      : "A compelling image, pattern or idea remains exploratory until the missing declarations are explicit.";
    output.querySelector(".gate-meter span").style.width = `${percent}%`;
  };
  checks.forEach((item) => item.addEventListener("change", updateGate));
  updateGate();
})();

