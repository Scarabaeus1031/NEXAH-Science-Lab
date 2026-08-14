# Independent Adversarial Scientific-Contract Review of A2

**Review date:** 2026-08-08  
**Scope:** contract review only; no V3 implementation, authorization, registered-seed access, or registered scientific execution.

## Decision

**REJECT A2.**

A2 repairs R-01 and makes the original/null population and support contract explicit. It also preserves the intended Monte Carlo and P1–P3 decision mapping. It does not meet the governing acceptance standard that two independent implementers must have zero remaining scientific or statistical discretion.

## Blocking findings

| ID | Class | Location | Finding | Consequence |
|---|---|---|---|---|
| A2-R08 | unauthorized scientific change | `A2_N1_N4_NULL_WORLD_CONTRACT.md`, N3 frozen strata | V1 requires empty phase strata to merge **clockwise**. A2 numbers bins counterclockwise and maps an empty bin by **increasing** index, which is counterclockwise under its own numbering. A2 neither preserves nor declares this as a new ambiguity choice. | Scope preservation fails; N3 donor pools change. |
| A2-R09 | RNG under-specification | all N1–N4 `rng_namespace` fields | A2 names namespace components but does not freeze tuple serialization, separator/typing, hash-to-seed conversion, bit width, generator family/version, or stream consumption order. V1's three-component `rng_for` does not define the new five-to-six-component namespaces. | Identical frozen inputs can produce different 200-replicate null distributions. |
| A2-R10 | bin-assignment under-specification | N3/N4 strata | NumPy `linear` specifies cutpoint calculation, not assignment of values equal to a cutpoint. N3 also does not normalize the `atan2` positive-π boundary to `[-π,π)`. | Rows at exact boundaries can enter different donor/permutation strata. |
| A2-R11 | N1 map under-specification | N1 action relabeling | A bijection is drawn, but A2 does not define whether an original action label `a` is relabeled as `π(a)` or whether the permuted label indexes `π⁻¹(a)`. | The refitted null representations and selected null outcomes can differ. |
| A2-R12 | randomization ordering under-specification | N1–N4 | Canonical row, candidate, stratum, and action-label order is not frozen for permutation/donor draws. A namespace alone does not determine how random indices map to scientific rows. | Teams using the same RNG state can generate different null worlds. |
| A2-R13 | N5 prose/machine omission | `A2_MACHINE_READABLE_RULES.yaml` | The machine contract gives determinant/order/count but not the accepted A1 rule **first 12**; it also omits explicit action-conditioned path generation for every synthetic training state and the minimum-over-all-comparisons aggregation. | Accepted N5 cannot be reconstructed from the controlling machine artifact alone. |
| A2-R14 | accepted A1 machine omission | A2 machine Monte Carlo block | The accepted A1 descriptive sorted-null/nearest-rank 97.5th-percentile reporting rule is absent and has no immutable reference. | A2's claim to encode every accepted operative A1 rule is false. |
| A2-R15 | validator incompleteness | static validator | The supplied validator rejected 7 of 17 required adversarial mutations and accepted 10 material mutations. | Static validation cannot establish A2 contract integrity. |

R-01 is resolved exactly. R-02–R-04 are substantially narrowed, and fixed population/support semantics are resolved, but the remaining null construction choices above are classification-relevant.

## Integrity and nonexecution

- Independent V1 source/config/test composite: `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05` — exact match over 24 frozen `.py`/`.yaml` files.
- Pre-review whole-tree snapshots were recorded for V1, V2, V3, A1, the A1 review, and A2. Post-review snapshots match for every one of those packages.
- A2's supplied static validator and 16 contract-only tests were run; no scientific pipeline was invoked.
- No registered seed registry was enumerated or released. No trajectory, fit, coherence, outcome, null result, sensitivity, bootstrap interval, or classification was inspected or produced.
- The only new files are this additive independent-review package.

## Overall answer

Two competent teams cannot implement frozen V1 + accepted A1 + A2 and be guaranteed the same N1–N4 null rows, donor assignments, refits, null statistics, and classification. The answer to the controlling review question is **NO**.
