# UTG Source & Formal Concordance 01

Status: `COMPLETED BASELINE / OBJECT-SPECIFIC CONTROL PASS ADDED`

Date: `2026-10-06`

Object: `Aperture / Transition`

## 1. Result

The four UTG plates now have repository custody, stable visual IDs and SHA-256
receipts. Their original book edition, page order and export lineage remain
unresolved. They therefore support a received framework constellation, not a
complete historical source lineage.

The first formal audit also finds that the visual vocabulary currently joins
two roles that the existing mathematical glossary keeps separate:

```text
aperture = admitted observation window / section / subset
gate     = boundary + explicit admissibility or transition rule
```

The UTG framework may discuss both under `Aperture / Transition`, but a formal
model must declare which role is meant. An observation aperture does not by
itself permit or cause a state transition.

## 2. Source concordance

| Plate | Repository identity | Custody | Historical source status |
|---|---|---|---|
| Framework | `VIS:UTG:FRAMEWORK` | unchanged copy + hash | original book/page unresolved |
| Glossary | `VIS:UTG:GLOSSARY` | unchanged copy + hash | original book/page unresolved |
| Perspective Map | `VIS:UTG:PERSPECTIVE_MAP` | unchanged copy + hash | original book/page unresolved |
| Series XIV | `VIS:UTG:SERIES_XIV` | unchanged copy + hash | original book/page unresolved |

The photos-library derivative paths are intake locators, not publication or
book-edition authorities. The repository copies are evidence receipts, not a
claim that the four images are the original exports.

## 3. Controlling definitions already present

The current mathematical glossary supplies the narrowest definitions:

- `geometric boundary`: boundary of a declared set relative to a topology;
- `gate`: boundary plus an explicit admissibility or transition rule;
- `crossing`: observed or computed change of declared side status;
- `aperture`: admitted window, section or subset through which a cut produces
  a record;
- `first-exit time`: first time a declared trajectory leaves a declared domain.

The boundary/escape synthesis adds the process grammar:

```text
declare state and frame
→ declare boundary and side semantics
→ classify relation
→ evaluate gate
→ stay | cross | escape | unresolved
→ translate
→ return
→ record residual and provenance
```

The historical Harmonic Transition report proposes `g(X)=0` as an aperture
condition. In current terminology this is better classified as an event or
switching surface. That report is a source candidate, not controlling proof.

## 4. Minimum formal candidate

Let:

- `X` be a declared state space;
- `T` be a declared time or index set;
- `x: T → X` be a trajectory or sampled state sequence;
- `g: X × T → R` be a declared event function;
- `B_t = {x in X | g(x,t)=0}` be the event boundary;
- `W_t ⊆ X` be an observation aperture;
- `P_t` be the sampling or record operation restricted to `W_t`;
- `G_t ⊆ B_t` be the subset on which a transition is admissible;
- `R_t` be an optional reset or transition map applied after an admitted event.

For a continuously sampled trajectory, a transversal crossing at `t*` requires:

```text
g(x(t*), t*) = 0
d/dt g(x(t), t) at t* != 0
```

For discrete samples, a candidate crossing requires a declared sign-change or
side-status rule plus a sampling-resolution statement. Touching, tangency and
unresolved intervals must not be silently classified as crossings.

## 5. Relation to the plate notation

The Series XIV plate displays an expression of the form:

```text
A(x,t) = o(-∂S/∂n (x,t))
```

It is retained as a visual/formal candidate only. Promotion is blocked because
`o`, `S`, `n`, the domain, regularity assumptions, sign convention and output
type are not defined in the bound UTG sources. No equivalence between this
expression and the event-surface specification above is asserted.

## 6. Existing bounded application evidence

`TOP-BOUNDARY-01` contains a reproducible synthetic optical aperture pipeline
with explicit masks, orientation states, complements and interaction residuals.
It validates its computational bookkeeping and awaits physical equipment
binding. It is a useful application reference, but it does not validate the
generic UTG aperture/transition model or turn observation masks into dynamical
gates.

## 7. Promotion decision

| Level | Decision | Reason |
|---|---|---|
| Framework | `CURRENT` | vocabulary and distinction are explicit |
| Formal Model | `OBJECT-SPECIFIC CONTROL PASS` | the Lorenz-63 crossing classifier passed its preregistered controls; the plate equation remains undefined |
| Validated Application | `NOT ESTABLISHED` | no controlled test of this generic event/gate model exists |

The result is recorded in
`UTG_FORMAL_01_LORENZ_CROSSING_CONTROL_2026-10-06/01_RESULT_REPORT.md`.
It supports one classifier, not a generic application claim; therefore the
Validated Application level remains unchanged.

## 8. Next smallest step

Recover the source-book/page lineage for the four plates. Open a second carrier
or nontrivial reset-map test only if a concrete application or A1/A2 reading
exposes that need. Do not generalize from the Lorenz control or the optical
aperture case without an explicit mapping contract.

## Controlling records

- `RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md`
- `RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/15_BOUNDARY_ESCAPE_RELATION_SYNTHESIS_2026-10-03.md`
- `SCIENCE_LAB/CASE_STUDIES/TOP_BOUNDARY_01_ORIENTATION_COMPLEMENT_INTERACTION_2026-09-26/00_README.md`
- `SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_MANDELBROT_INTAKE/Cikada 3301 Mandelbrot/NEXAH — Harmonic Transition Physics_ Mathematical Research Report.md`
- `SCIENCE_LAB/NAVIGATION/EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/UTG_FORMAL_01_LORENZ_CROSSING_CONTROL_2026-10-06/01_RESULT_REPORT.md`

## Claim boundary

This document defines a candidate specification and resolves vocabulary. It
does not prove the plate equation, establish a universal transition geometry,
or promote any application result.
