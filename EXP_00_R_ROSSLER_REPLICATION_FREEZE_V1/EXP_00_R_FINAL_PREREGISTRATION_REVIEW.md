# EXP-00-R Final Preregistration Review

## Review decisions

### OD-1 — actuator: ACCEPTED AND FROZEN

Scalar additive x-channel control is a minimal, physically typed actuator. It is coupled to the chosen target but does not encode a complete ranking: over (H=1), perturbations propagate into (y) and (z), and the objective is three-dimensional. Claims remain actuator-specific.

### OD-2 — target: ACCEPTED AND FROZEN

The training-only high-x target ball is a reproducible operational navigation target. It is neither a natural Rössler goal nor a cross-system invariant. Its center, scale, and radius use training states only. Its quantile construction prevents empty/full occupancy by design without inspecting action outcomes.

### OD-3 — horizon: ACCEPTED AND FROZEN

(H=1.0) is approximately one-sixth of the near-planar Rössler rotation, permits indirect actuator coupling, and is resolved by 200 RK4 steps. Sensitivities 0.5 and 1.5 remain fixed.

### OD-4 — classification ceiling: RETAINED AND FROZEN

Frozen Lorenz v2 is trajectory-dependent. EXP-00-R alone therefore cannot earn strict `CROSS-SYSTEM REPLICATION`; its maximum cross-system label is `PARTIAL CROSS-SYSTEM REPLICATION` until a carrier-balanced Lorenz replication exists.

### Carrier population: REVISED BEFORE FREEZE

The common-nonzero filter was rejected because inclusion depended jointly on the representations' outputs. Frozen v1 uses all jointly supported states. A carrier-selected zero action has $\Delta J=0$ and binary failure under the fixed threshold. This preserves one common population without conditioning on carrier activity.

### Two-representation coherence

The hypothesis is one pairwise agreement hypothesis. The two learned estimators are distinct but not claimed independent. No consensus, majority, redundancy, or invariance interpretation is allowed.

## Implementation review

The experiment-local implementation contains the Rössler plant, deterministic RK4, scalar actions, training-only target, two learned representations, ranking/ties, single-pair coherence, support/whole-ranking abstention, frozen baselines, null transformations, sensitivity registry, prediction analysis, provenance, pipeline, CLI, and registered execution guard.

An initial weak transitive dependency between LEARNED_FIELD and the plant-generating data module was found and removed before freeze. The neutral raw rollout contract is now isolated.

## Validation

- 24/24 final deterministic tests passed.
- information parity: PASS.
- representation distinctness: PASS.
- target/actuator nontriviality: PASS with explicit actuator-specific limitation.
- configuration mutation detection: PASS.
- deliberate unfair-action negative test: PASS.
- registered seed lock: PASS.
- default command: static validation only.
- registered seeds/outcomes/coherence: not generated, fitted, or inspected.

## Remaining scientific uncertainty

Implementation readiness does not imply the hypothesis is likely true. Support may fail; one action may dominate; coherence may match nulls; the coefficient may be null or negative; one carrier may explain the signal; amplitude sensitivity may fail. Each is preserved by the frozen classification rules.

## Implementation-readiness blocker

The primary registered pipeline is implemented, and null, sensitivity, bootstrap, per-seed, and classification primitives exist. They are not yet wired into one end-to-end sealed execution that automatically performs all 200 repetitions of every frozen null, all one-factor sensitivities (including training halves), clustered intervals, per-seed attribution, support validity gates, and mechanical experiment/cross-system classification. The coordinate-registration control is validated on synthetic fixtures but is not yet orchestrated on frozen registered representation outputs.

Because the requested future command must execute the complete preregistered experiment rather than only its primary analysis, this gap prevents execution authorization. It cannot be repaired after outcomes are visible. A new additive implementation version and freeze manifest are required.
