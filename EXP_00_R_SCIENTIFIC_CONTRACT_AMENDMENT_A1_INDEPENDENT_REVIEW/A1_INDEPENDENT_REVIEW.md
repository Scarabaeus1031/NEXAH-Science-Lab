# Independent Adversarial Scientific-Contract Review of A1

**Review date:** 2026-08-08  
**Scope:** contract review only; no implementation, authorization, or registered execution.

## Decision

**REJECT A1.**

A1 preserves the V1 hypothesis and makes a scientifically defensible two-tier N5 choice. Its Monte Carlo arithmetic is correct. It nevertheless fails the acceptance standard because an implementer still must make scientifically meaningful choices, and one stated mathematical boundary is not implemented by its own mandated numerical rule.

## Blocking defects

| ID | Classification | Exact location | Defect | Consequence |
|---|---|---|---|---|
| R-01 | Mathematical inconsistency | `A1_PER_SEED_DOMINANCE_CONTRACT.md`, “Top-three dominance” | A1 says exactly 0.50 passes, mandates float64, forbids tolerance, and compares the stored ratio directly. Six equal signed contributions of `0.1` have mathematical ratio 0.50 but float64 computes `(0.1+0.1+0.1)/(0.1×6) = 0.5000000000000001`, so the mandated rule returns `FAIL_DOMINATED`. | The exact scientific boundary depends on floating representation and contradicts the prose. |
| R-02 | Scientific/population ambiguity | `A1_NULL_PREDICTIVE_GAIN_CONTRACT.md`, “Stochastic null families” | “Applicable fixed primary agreement population” is not typed. A1 does not say whether every N1–N4 statistic uses the original observed jointly supported rows, null-specific support rows, or an intersection. | Null distributions and Monte Carlo decisions can differ by implementer. |
| R-03 | Scientific ambiguity | same | Carrier-specific null log-loss outcomes are underdefined. When N1 refits rankings or N2–N4 replace a ranking, A1 does not state whether carrier actions/outcome labels remain the original frozen outcome rows or are recomputed/reselected from the transformed rankings. | P3's null target changes depending on an unregistered scientific choice. |
| R-04 | Scientific/support ambiguity | same | N1 refitting can change learned-field predicted paths and therefore path-support flags even if the support model is fixed. A1 does not specify whether original support membership is frozen, transformed membership is used, or changed membership invalidates the repetition. | Row inclusion and null statistics are not reproducible from A1. |
| R-05 | Prose/YAML mismatch | `A1_N5_COORDINATE_REGISTRATION_CONTRACT.md` versus YAML `N5.tiers.N5_SYNTH` | Prose mandates unchanged primary representation hyperparameters and support quantile 0.99 for N5-SYNTH. YAML contains neither the TRAJECTORY/LEARNED_FIELD hyperparameters nor the 0.99 support rule. | Machine-readable N5 remains incomplete. |
| R-06 | Prose/YAML mismatch | seed-dominance prose versus YAML | Prose mandates float64 direct comparison without tolerance and declares fewer than three contributing seeds invalid. YAML does not encode numeric type/no-tolerance semantics or the fewer-than-three failure. | Different conforming implementations can disagree at the boundary. |
| R-07 | Prose/YAML mismatch / population ambiguity | null prose versus YAML `NULL_PREDICTIVE_GAIN` | YAML contains no null evaluation population, support-membership rule, outcome-row rule, or family-specific randomization units/dependencies. | The advertised machine-executable contract is not complete for C. |

R-01 through R-04 independently require an additive A2. They must not be repaired in this review.

## Integrity and nonexecution

- V1 composite independently matches `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05`.
- V2 composite independently matches `cc604d23328379ae1f6b12a37a2e8fe94e287ca12dd664f965e66010221c8985`.
- Original-design and V2-review tree snapshots remain unchanged from the V3 audit.
- A1 contains nine Markdown/YAML contract files and no executable V3 source.
- No authorization or registered output exists in A1 or this review package.
- This review used only static reading and deterministic contract-logic toy values.

## Scope audit

| Frozen field outside A–C | A1 effect | Result |
|---|---|---|
| Plant, parameters, RK4, dt | none | PRESERVED |
| Actuator and physical action set | transformed only inside N5 coordinate diagnostic; experiment unchanged | PRESERVED |
| Target, objective, horizon, success | coordinate-registered metadata only; scientific definitions unchanged | PRESERVED |
| Representations/information parity | no scientific estimator change | PRESERVED |
| Support thresholds/abstention | no experiment threshold change | PRESERVED |
| Primary and nonzero support-gate populations | declared unchanged | PRESERVED, though null population remains ambiguous |
| Carriers/ranking/coherence/model/covariates | no frozen primary change | PRESERVED |
| Bootstrap/sensitivities | none | PRESERVED |
| Lorenz-v2 interpretation/cross-system ceiling | none | PRESERVED |

**Scientific scope preserved: PASS. Contract completeness: FAIL.**
