# 01 — Protocol Freeze

## Frozen comparison object

`AXIS08-QRR-01` was selected before executing the return tests because it has:

- preregistered Science Lab protocols and results;
- a typed reusable NEXAH Core implementation;
- a canonical Core validation artifact and bound computation bundle;
- a Mission Control source receipt and bounded portfolio interpretation;
- explicit negative claim boundaries.

## Role and authority freeze

| Role | Repository | Authority in this test |
|---|---|---|
| source evidence | Science Lab | experiment design, result, interpretation, and scientific claim ceiling |
| reusable computation | NEXAH Core | implementation contract, canonical computation artifact, verifier, and bundle format |
| currentness / routing | Mission Control | source pointer, expected source hash, role summary, and ecosystem routing |
| Human | outside the automated return | adoption, rejection, interpretation, and continuation |

No authority transfers merely because an artifact is copied, summarized,
executed, or registered elsewhere.

## Frozen source references

### Science Lab

- `SCIENCE_LAB/CASE_STUDIES/AXIS08_QRR_01_QUOTIENT_RESIDUAL_RECONSTRUCTION_2026-09-21/06_PHASE_B_IEEE_RESULTS.md`
- observed SHA-256: `591a0c767f81002763267c8143a0d12614acf3f917cf742f29b4b06925a418e4`
- status: `IEEE_TRANSFER_REPRESENTATION_FIDELITY_CONFIRMED`

### NEXAH Core

- integration anchor: commit `53dd958c`
- anchor is an ancestor of observed Core HEAD `ead4223a`
- protocol SHA-256: `b51144d61ddaa4954a24de4e215221498bcfc901d3152acb31d3114598629db1`
- canonical result SHA-256: `b816d68088cc8aab17475fe2a7dd69acb77bda795104180bc0e885863e3f23e7`
- evidence-bundle manifest SHA-256: `bba089166b6ed50cee55f9236a5540b10d5141bff571b1e320de10f2e59dc825`

### Mission Control

- source ID: `AXIS08_QRR_01`
- registered source SHA-256: `591a0c767f81002763267c8143a0d12614acf3f917cf742f29b4b06925a418e4`
- authority: `Science Lab preregistered method result`

## Frozen tests

1. Verify the Science Lab package manifest.
2. Verify the bound Core evidence bundle.
3. Recompute the Core canonical result from committed source frames.
4. Compare replay and canonical result bytewise.
5. If bytes differ, compare all JSON fields and quantify numerical drift.
6. Resolve the Mission Control source pointer and compare its expected hash to the authoritative Science Lab result.
7. Compare claim, decision, and authority semantics across both handoffs.

## Decision rules

- Any source-pointer/hash mismatch: `SOURCE_RECEIPT_FAIL`.
- Invalid Core evidence bundle: `CORE_BUNDLE_FAIL`.
- Changed categorical status, decision, protocol, input hashes, claim ceiling,
  or authority: `SEMANTIC_RETURN_FAIL`.
- Numerical replay differences above `1e-12`: `NUMERIC_RETURN_FAIL`.
- Byte difference with all categorical fields retained and numerical differences
  within `1e-12`: `BYTE_FAIL / SEMANTIC_PASS / TYPED_NUMERIC_RESIDUAL`.
- Missing edge evidence remains `U`; it may not be inferred into existence.
