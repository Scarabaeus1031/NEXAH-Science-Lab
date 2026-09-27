# R1 stop — equal-information capability gate

Decision: `D_R1_EQUAL_INFORMATION_FAILED`. This directory is an **uncommitted,
unlocked Development-only implementation candidate**, not an R1 lock or a
utility result. No Evaluation or Replay fixture was generated.

The pinned Core commit `ead4223a9bea103ad2266fc3b71b433974de37dd`
exposes `verify_ieee_projection_fidelity_evidence_bundle`, which checks the
`manifest.json` declarations for `analysis.json`, `computation_result.json`
and `report.md`, and their bundle/record/report bindings. It does not parse the
common carrier's `transform.json`, `source.json`, `pca_fit.json`, `prov.json`,
`ro-crate-metadata.json`, `claim.json` or `checklist.json`. Repository search
found no existing verifier in the pinned Core for the full common-carrier
contract. A syntax-only adapter cannot supply those missing detections without
becoming a new semantic operator, which R1 expressly prohibits.

Direct Development gate: a valid carrier is `PASS` for Core and baseline;
an actual D01 residual removal in `transform.json` is also `PASS` for Core,
while the independent baseline reports `DEFECT`. This is **capability evidence
for the preflight stop**, not a measured utility comparison. Same directory
bytes were offered to both, but the pinned Core path lacks the necessary
input/operation contract to process the agreed carrier fairly. The authorized
decision rule therefore stops before R1 lock, commit, push or Mission Control
status update.

The local untracked candidate contains 114 Development cases and separate
Development gold, but this Git evidence slice publishes only the valid and
D01 carriers, the two gate outputs and their minimal reproducer. The other
112 cases, gold, generator, scorer and Development tests remain excluded and
untracked. `test_development.py` and deterministic Development regeneration
passed locally before the stop; neither is a sealed result. No PCA fit or R1
machine has been declared final.
No Human authoring hours were asserted. The local Keychain custody is
procedural under one macOS account, not independent. No biological, product,
utility or novelty claim follows from these materials.
