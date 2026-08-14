# Frozen V1-to-Generator R2 Authority and Field Trace

| Producer output | Frozen source | Adapter operation | Generator R2 enforcement |
| --- | --- | --- | --- |
| target definition | V1 `build_target` / `TargetRegion` | typed pass-through of mean, population SD, center, radius | `TargetDefinition` |
| physical row identity | V1 decision-state split, physical seed and index; Export R1 G1 | derive pair ordinal only from physical seed; never use pair ID scientifically | `build_row`, exact 3,000-row order |
| `state_signal` | V1 `TargetRegion.distance`; G4 | Generator R2 computes from state and frozen target | `state_signal`, `validate_row` |
| T/F scores | frozen trajectory/learned-field source costs | preserve nonserialized source costs in `BoundRow`; exact unary negation by R2 | `validate_score_export` |
| support | V1 trajectory nearest distance and learned-field complete path distances | T scalar forwarded; F exported as exact path maximum | `validate_support_export` |
| per-action outcomes | V1 shared five-action rollout terminal table and target objective | forward exact five `delta_j`; R2 derives binary success | `action_outcomes` |
| N1–N4_T/F | A3/A4 already-computed canonical namespace descriptors | wrap exact component lists; no suffix modification | R2 family-specific `validate_null_worlds` |
| bootstrap | frozen 500 seed-clustered repetitions | exact registry construction | `validate_bootstrap` |
| N5 | frozen population, field terminals, trajectory neighbor IDs/weights/terminals; A3 signed Q registry | construct Q witnesses and witness-derived utilities | `validate_n5` |
| sensitivities | frozen twelve one-factor universes and source rows | registry metadata derived from R2 constants; all rows remain source-bound | `validate_sensitivities` |
| G9 | Export R1 registered-generation runtime authority | validate exact authority and artifact tree before assembly | `validate_runtime` |
| provenance | complete assembled sections | Generator R2 canonical section digests | `fixture_payload`, `validate_payload` |
| bytes | complete validated payload | Generator R2 canonical JSON only | `validate_canonical_bytes` |

The producer accepts scientific quantities; it does not recompute representations, null draws, fits, registered trajectories, sensitivities, or outcomes. N5 evidence shaping and score derivation are the already-frozen witness-to-schema mapping, not a new scientific algorithm.

```text
CONTRACT-TO-CODE TRACE: PASS
CANONICAL NULL NAMESPACE MODIFIED: NO
NULL RNG STREAM MODIFIED: NO
```
