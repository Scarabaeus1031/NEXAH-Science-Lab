# Preregistration Draft — Repair R1

Status: `SUPERSEDED_BY_FROZEN_PHASE_A_EXECUTION / PHASE_A_PASS`

The controlling executed specification is now
`04_PHASE_A_EXECUTION_PREREGISTRATION.md` plus `phase_a_protocol.json`. This
earlier Repair-R1 draft remains as design provenance; Phases B–D remain on
hold.

Only Phase A is eligible for later executable preparation. Phases B–D remain
on hold and are not activated by this draft.

## Phase A — Source / Centered / Body Frame Fidelity

Question: Do centering and proper Kabsch alignment preserve preregistered
intrinsic relations, and can retained frame residuals reconstruct the bound
source-file coordinate frame?

Controls:

1. seeded synthetic common translations;
2. seeded proper rotations;
3. one reflection as negative chirality control;
4. one selected-atom permutation as negative identity control.

Primary metrics:

- pair-distance maximum absolute error;
- proper-superposition RMSD;
- contact-matrix agreement under frozen selection and threshold;
- chirality-sign agreement;
- source-frame reconstruction error from body frame plus frame residual.

Gates:

1. translations preserve pair distances within `1e-10`;
2. proper rotations preserve pair distances within `1e-10`;
3. proper alignment never applies reflection;
4. the reflection control is detected by chirality;
5. the atom-permutation control fails identity-sensitive comparisons;
6. source-file coordinates reconstruct within a tolerance frozen after parser
   and numeric-precision selection but before source execution.

## Phase B — Local Orientation and Quaternion Audit

Status: `HOLD_PENDING_FRAME_QUATERNION_AND_FIBER_CONTRACT`

No execution until local-frame construction, `u ~ -u`, sign convention,
degeneracy policy, `SO(3)` metric and Hopf-fiber residual policy are frozen.

## Phase C — FEATURE8 / AXIS08

Status: `HOLD_PENDING_NATURAL_PAIR_GATE`

```text
AXIS08_PAIR_STATUS = UNRESOLVED
```

The existing FEATURE8 candidate contains no admitted natural pair.
Accessibility/hydropathy coupling is prohibited. A torsion sine/cosine pair is
permitted only as `CALIBRATION_PAIR_ONLY_NOT_BIOLOGICAL`. If no natural pair is
declared before outcomes, Phase C stops.

Any later execution must retain fit-only means/scales, missing-value policy,
terminal policy and all feature transformations. PCA7 and seeded RANDOM7 are
descriptive baselines only after Phase C admission.

## Phase D — optional Mod-7/11 address sidecar

Status: `HOLD_PENDING_TYPED_UTILITY_QUESTION`

The exact CRT fixture on addresses `0..76` remains independent. The 76-residue
protein carrier is not a full CRT77 cycle. No utility test exists until a
sampling task, metric and equal-size controls are preregistered.

## Prohibited analyses for 1XQQ

- temporal path length or turn angle through submitted model order;
- transition speed or earlier/later semantics;
- events defined between model `m` and `m+1`;
- treatment of model order as a time axis;
- observed folding-trajectory claims.

## Data gates before any freeze

- bind exact 1XQQ PDBx/mmCIF bytes and SHA-256;
- verify submitted model and residue counts from bound source metadata;
- inventory chains, atoms, alt locations and missing coordinates;
- freeze atom mapping and reference conformer without comparative tuning;
- freeze contact selection/threshold and chirality definition;
- freeze parser, numeric environment and all tolerances;
- create source-independent algebraic fixtures;
- obtain separate Mission-Control execution authorization.

## Claim ceiling

Allowed after a later successful execution: bounded representation,
invariance, gauge/frame-loss and reconstruction statements for the bound
ensemble.

Prohibited: folding dynamics, causal biology, E8 identity, Hopf causation,
modular biological frequencies, universal protein prediction or a new
registered capability.
