# Independent Adversarial Scientific-Contract Review of A4

**Review date:** 2026-08-08  
**Scope:** contract review only; no implementation, authorization, registered-data access, or registered execution.

## Decision

**REJECT A4.** It is not a scientific-contract fixpoint.

A4 successfully closes N4 distance, classification overlap, RNG/order, N1–N5 construction, and the Lorenz-v2 ceiling. Its two declared prospective choices are outcome-blind and local. However, A4 also makes an undeclared scientific choice in P4: it limits classification-critical attribution to the T/F primary carriers and makes the preregistered TRAJECTORY-only and LEARNED_FIELD-only outcome-prediction analyses report-only. Frozen V1 P4 requires positive direction and log-loss gain for every preregistered carrier/leave-one-representation attribution. Whether and how the single-representation analyses enter P4 is not uniquely executable from V1; A4 cannot silently choose the less restrictive interpretation.

This is defect class **A — SCIENTIFIC CONTRACT DEFECT**. A new prospective scientific choice is required; therefore the next object is A5, not merely A4.x. Three additional class-B encoding defects would also need repair: incomplete executable validity predicates/sensitivity output schemas, an undefined zero-tolerance seed-dominance identity field, and validator integrity gaps.

## Blocking findings

| ID | Class | Location | Finding | Consequence |
|---|---|---|---|---|
| A4-R21 | A — scientific contract | A4 P4 prose lines 19–25; machine `P.P4`; V1 cross-system P4 | A4 makes T/F the only classification-critical analyses and declares T-only/F-only report-only without labeling a new choice. | P4 and replication can change; an A5 prospective choice is required. |
| A4-R22 | B — encoding | machine `validity.gates` | parity, distinctness, leakage, train/test, provenance, and binding appear as tokens rather than executable predicates; exact representation/parity sources are not machine-bound. | Two teams can certify the same named gate differently. |
| A4-R23 | B — encoding | P5 prose line 31 vs machine `P.P5` | prose requires coefficient, gain, support, and provenance for all diagnostics; machine lacks the per-sensitivity output/completeness schema. | `ALL_12_SENSITIVITIES_COMPLETE` has no complete mechanical predicate. |
| A4-R24 | B — encoding | validator lines 64–69, 133–149 | validator seals the machine object and nine files, but does not recompute V1 composite or hash/check A4 prose. Independent tests show both mutations escape. | Validator PASS cannot establish authority or prose/machine integrity. |
| A4-R25 | B — encoding | machine `seed_dominance.aggregate_identity_tolerance=0.0`; P4 prose | zero tolerance is machine-only and does not specify which float/exact objects are compared; A2 defines exact rational dominance, while A1's prior float aggregate identity used `1e-12`. | Validity can diverge at the identity gate; remove or type the comparison in a re-freeze. |

No registered scientific information was needed to reach this decision.

