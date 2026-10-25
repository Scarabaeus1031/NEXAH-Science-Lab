# A0 `D + E + F → G(ΔDEF)` relation/view non-identity test design

Date: 2026-10-23  
Status: `ENGINEERING FIXTURE IMPLEMENTED / SCIENTIFIC NOT_ADMITTED / NO ACTIVE LAB CYCLE`

Owner direction on 2026-10-23 authorized an executable test. Because the Lab
Constitution remains in `STRUCTURE_FREEZE`, this activates only the bounded A0
Book engineering fixture. It does not reopen the Science Lab or admit a
scientific cycle.

## Purpose

This record turns one bounded part of the existing A0 generation notation into
a falsifiable test design:

`Sₜ → A+B → C(ΔAB) → S′ₜ → D+E+F → G(ΔDEF) → S″ₜ ↺`

The notation already exists in the A0 Family Connection Atlas and method
paper. Here `D`, `E`, `F` and `G` remain **local model roles**. They do not
become canonical Families, physical quantities or new Navigator identities.

Source bindings:

- [`A0 Family Connection Atlas`](A0_BOOK/A0_FAMILY_CONNECTION_ATLAS.html) —
  the exact generation chain and its view boundary;
- [`NEXAH Orientation Method position paper`](35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md) —
  the rule that `D/E/F/G` are local model notation rather than canonical
  Families or a proven general algebra;
- [`A0 ↔ ORION finite structure return`](111_A0_ORION_Z777_Z3885_FINITE_STRUCTURE_RETURN_2026-10-22.md) —
  the current NSN boundary for GURT and THOTH: two contextual source lineages,
  not a demonstrated common module or mathematical bridge.

The question is deliberately narrow:

> Can one predeclared ternary relation record `G(ΔDEF)` be recovered from the
> same typed `D/E/F` source record across multiple declared views `V`, or is the
> apparent `G` only a property of a particular rendering?

## Type lock

| Symbol | Type in this design | Explicitly not |
|---|---|---|
| `D,E,F` | three typed source records on one frozen finite carrier | letters whose visual shape or alphabetic order is evidence |
| `ΔDEF` | a predeclared ternary comparison operator | an undefined metaphor or a value chosen after observation |
| `G` | the registered output/relation record of `ΔDEF` | a new Family, carrier, field, cause or identity |
| `Vᵢ` | a deterministic view map applied after the source/relation record exists | a second source or an operator that silently changes `G` |
| `Rᵢ` | residual needed to return from `Vᵢ` to the registered record | decorative metadata |

The contract is therefore:

```text
x = (D,E,F) on frozen carrier X
g = ΔDEF(x)                         source-owned relation record
yᵢ = Vᵢ(x,g)                        view-owned representation
(x̂ᵢ, ĝᵢ) = Returnᵢ(yᵢ, Rᵢ)         typed reconstruction
```

No view is permitted to redefine `ΔDEF` or overwrite the registered `g`.

## Admission requirements

This design cannot become an executable protocol until all of the following
are frozen **before** a Primary run:

1. one existing finite carrier and three source channels for `D/E/F`;
2. domains, codomains and serialization for each channel;
3. one explicit formula or lookup rule for `ΔDEF`;
4. at least three deterministic views `V₁…Vₖ`, including one deliberately
   lossy view;
5. the residual supplied to each Return;
6. a fixture set, holdout set and mutation set fixed by hashes;
7. a Primary runner, separate Replay path and independent verifier;
8. the complete `B/P/D` and `C0–C6` registration fields required by A0.

If any item is selected after seeing outcomes, the test is invalid rather than
inconclusive.

## Implemented engineering fixture

The software-only fixture freezes:

- carrier `Q₃ = {0,1}³` with eight exhaustive `D/E/F` records;
- `ΔDEF = (D⊕E, E⊕F, F⊕D, D⊕E⊕F, D+E+F)`;
- exact, permuted, deliberately lossy weight and look-shuffled views;
- typed source/relation keys plus view-bound residual receipts;
- 108 deterministic controls covering Return, ablation, mutation, collision,
  look shuffle and wrong-residual failure.

Executable surface: [`A0 DEF→G Relation / View Lab`](A0_BOOK/assets/a0-def-g-relation-view-lab/index.html)  
Test command: `node A0_BOOK/a0-def-g-relation-view-tests.cjs`  
Engineering return: [`113_A0_DEF_G_RELATION_VIEW_ENGINEERING_RESULT_2026-10-23.md`](113_A0_DEF_G_RELATION_VIEW_ENGINEERING_RESULT_2026-10-23.md)

### Glyph / transversal addendum

The same interactive surface now carries a second, independent orientation
fixture for the proposed G-shaped move. It freezes an incoming `01:30`
tangent, one sharp `90°` corner, an outgoing `04:30` tangent, front/side
projections, a planar `R180·R90=R270` composition and a separate half-angle
double cover. The latter changes sign at `360°` and returns at `720°`.

This addendum does not redefine `ΔDEF`, infer glyph geometry from the letters
`D/E/F/G`, or identify the planar `270°` composition with the `720°` return.
Its 24 controls and source hashes are recorded in
[`114_A0_G_GLYPH_TRANSVERSAL_DOUBLE_COVER_ENGINEERING_RESULT_2026-10-23.md`](114_A0_G_GLYPH_TRANSVERSAL_DOUBLE_COVER_ENGINEERING_RESULT_2026-10-23.md).

## Competing hypotheses

### `H_relation`

`G` is a reproducible relation record. For every admitted fixture and every
declared view, the typed Return reconstructs the same registered `g` while
view-only changes alter `yᵢ` but not `g`.

### `H_view`

The alleged `G` is not identifiable independently of `V`: at least one
view-only change changes the recovered relation, or two distinct source/relation
records collide in the available view and residual contract.

The design does not presume that one of these must win. `UNDERDETERMINED` is a
valid outcome.

## Required controls

1. **View-only control** — hold `D/E/F`, `ΔDEF` and `g` fixed; change only
   `V`. Any registered change of `g` fails the separation.
2. **Relation mutation** — hold the view family fixed; permute or mutate one of
   `D/E/F`. The evaluator must detect every predeclared change that changes
   `g`.
3. **Single-input ablation** — remove `D`, then `E`, then `F`. A missing input
   must produce typed `HOLD`, never an invented value.
4. **Collision control** — include distinct `(x,g)` records with equal lossy
   views. View equality must not be reported as relation or carrier identity.
5. **Return control** — exact views reconstruct without hidden state; lossy
   views reconstruct only with their declared residual or return `HOLD`.
6. **Look shuffle** — change color, label order and layout without changing the
   serialized record. Result classification must remain unchanged.
7. **Wrong-residual control** — a residual from another fixture must fail
   closed.

## Decision rule

The run may return exactly one of four labels:

- `PASS_RELATION_VIEW_SEPARATED` — all registered `g` values replay exactly
  across every admitted view; all mutations, collisions and wrong residuals
  behave as preregistered.
- `VIEW_DEPENDENT_ONLY` — a view-only change alters the recovered `g`, or the
  implementation computes `g` from pixels/layout rather than the frozen
  source record.
- `UNDERDETERMINED` — the declared view/residual set cannot distinguish at
  least one frozen pair of different relation records.
- `INVALID_CONTRACT` — a type, hash, source, control, replay or independence
  requirement is missing or changed after activation.

A pass establishes only the finite software statement that relation record and
view were separated for the frozen fixture. It does not establish a universal
`G`, a natural law, a GURT/THOTH operator, consciousness, resonance or a
physical mechanism.

## STOP conditions

Stop before execution if the proposed `ΔDEF` is still interpretive, if `V` is
allowed to change the carrier, if the residual is not explicit, if the fixture
was chosen for a pleasing image, or if an independent Replay cannot be
provided. Stop after one completed and dispositioned cycle; no automatic
successor is authorized.

## A0 / NSN return

- A0 Chapter 02 supplies the distinction `support ≠ operation` and the
  projection/phase/residual warning.
- The Family Connection Atlas supplies the generation notation only.
- `G` remains a relation output and `V` a representation channel.
- GURT and THOTH remain separate provenance axes. Neither supplies `ΔDEF`
  unless a later source-bound admission declares and tests such an operator.
- Existing A0 Book and mathematical-joints identities are reused.
- New Navigator nodes, Source Graph relations, Families, Studies, Findings,
  publication claims and active experiment slots: **0**.

This document remains the scientific design boundary. The linked software
result may report an engineering PASS for its frozen finite fixture; it is not
authorization to activate an experiment or promote a scientific claim.
