# A0 Evidence Class Matrix — freeze

Date: `2026-11-15`

Status: `FROZEN A0 CLAIM-WRITING CONTRACT / INTERNAL / NO CLAIM PROMOTION`

Owning identity: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`

## Purpose

This matrix fixes four labels for writing and reviewing A0 claims. It
classifies a specific assertion in its declared scope; it does not classify
an entire file, image, instrument, Study or research programme by proximity.

The labels are an A0-local editorial and evidence-routing contract. They are
not new Source Graph vocabulary, do not alter Navigator counts, and do not
replace the Science Lab result vocabulary or the orthogonal reproducibility
classes `R0` through `R4`.

## Frozen matrix

| Class | Required support | Permitted wording | Mandatory boundary |
|---|---|---|---|
| `EXACT` | explicit definitions plus an inspectable proof, exhaustive finite check, exact arithmetic, bijection, involution or lossless typed Return | “equals”, “is bijective”, “returns exactly”, only for the declared carrier and operator | no physical, empirical, novelty or cross-carrier implication |
| `BOUNDED_COMPUTATIONAL` | frozen inputs and method, declared controls, machine result, verifier and stated finite or numerical domain | “the frozen run returned”, “within the tested grid”, with metric and tolerance | no generalization outside the frozen domain; negative and null gates remain visible |
| `MODEL` | declared assumptions, variables, mapping and intended explanatory or architectural role | “the model represents”, “under these assumptions”, “candidate mechanism” | not observation, measurement, validation or evidence that nature uses the model |
| `VISUAL_HYPOTHESIS` | source-bound image, motif, resemblance or proposed reading with provenance | “suggests”, “resembles”, “may guide a test” | no identity, relation, mechanism, equation or finding follows from appearance |

## Decision rules

1. Classify the smallest assertion, not the surrounding page.
2. Use the lowest class actually supported by the cited evidence.
3. Multiple weak views do not accumulate into a stronger class.
4. A visualization of an `EXACT` result remains a view; the visual itself is
   not the proof.
5. A deterministic model run may be `BOUNDED_COMPUTATIONAL` while its
   interpretation remains `MODEL`.
6. External novelty, empirical validity, utility and publication readiness
   require separate gates and are never implied by these four labels.
7. Unknown, negative, null, failed and non-identity states remain explicit.

## Current anchor examples

| Assertion | Class | Source and boundary |
|---|---|---|
| The TESA 28-sample record preserves order and values through its four declared views | `EXACT` | `results/a0-tesa-hz-ivomaria-fz-four-view-2026-11-15.json`; no identity with the separate 48-sample record |
| The Janus ladder implements the declared affine reflection and exact chart conversions | `EXACT` | `results/a0-janus-coordinate-atlas-return-2026-11-15.json`; no new physical Janus mechanism |
| A0-BL-058 returned a boundary-locked, phase-sensitive event under its frozen grid | `BOUNDED_COMPUTATIONAL` | Science Lab A0-BL-058 Primary/Replay and verifier; no carrier-intrinsic or physical-breath claim |
| B2 is a typed cartographic grammar for roles and history | `MODEL` | `DRAFTS/A0_B2_CGRID_TYPED_ROLES_FORMAL_AUDIT_2026-11-14.md`; the audit found no held-out predictive gain over B1 |
| Pancake, rolled-sheet, egg, scarab and related visual echoes may guide later questions | `VISUAL_HYPOTHESIS` | source-bound visuals only; no geometry, topology or mechanism inferred from resemblance |

## Governance and return

This freeze reuses the existing A0 package and evidence-lineage binder. It
creates `0` Navigator entities, `0` relations, `0` aliases, `0` Studies
and `0` Findings. It changes no Claim Ceiling by itself and authorizes no
run, build, publication, deployment or outreach.
