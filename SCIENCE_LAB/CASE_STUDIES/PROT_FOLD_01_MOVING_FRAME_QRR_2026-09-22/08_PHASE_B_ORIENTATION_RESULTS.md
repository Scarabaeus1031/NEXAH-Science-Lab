# Phase B results — local orientation and Hopf boundary

Status: `PASS`

Decision: `PHASE_B_LOCAL_ORIENTATION_AUDIT_CONFIRMED`

Phase B executed the frozen protocol in
`07_PHASE_B_ORIENTATION_PREREGISTRATION.md` against the same hash-bound 1XQQ
ensemble used in Phase A. All 12 primary gates passed.

## What was measured

For every one of the 76 chain-A residues in all 128 conformers, a right-handed
local backbone frame was constructed from `N`, `CA`, and `C` after the frozen
Phase-A global body alignment. This produced 9,728 valid local frames. Each
frame was compared with the corresponding frame in model 1 using an SO(3)
relative rotation, a canonical scalar-first quaternion, and a noninvertible
Hopf view.

Model order was not interpreted as time.

## Primary gate results

| Gate | Result | Observed value |
|---|---:|---:|
| all local frames valid | PASS | 9,728 / 9,728 |
| frame orthonormality | PASS | max error `6.66e-16` |
| right-handed frames | PASS | max determinant error `8.88e-16` |
| unit quaternions | PASS | max norm error `2.22e-16` |
| quaternion/matrix roundtrip | PASS | max error `6.66e-16` |
| `q ~ -q` rotation and Hopf invariance | PASS | max error `0` |
| unit Hopf output | PASS | max error `4.44e-16` |
| S1 fiber noninjectivity | PASS | Hopf error `6.66e-16`; SO(3) change `1.46 rad` |
| global proper-rotation invariance | PASS | max angle error `4.33e-15 rad` |
| reflection detected | PASS | mean difference `1.912 rad` |
| missing atom rejected | PASS | rejected |
| degenerate frame rejected | PASS | rejected |

## Descriptive result

Across all model/residue comparisons to model 1, the local orientation angle
had median `13.36 degrees`, mean `18.77 degrees`, p95 `47.58 degrees`, and
maximum `179.66 degrees`.

The largest mean orientation variability occurred at residues 76, 75, 74,
73, 10, 72, 8, 71, 47, and 21. The strong C-terminal signal agrees
qualitatively with the Phase-A displacement ranking, but this agreement is a
descriptive property of this ensemble, not a folding-path claim.

## What the Hopf result means

The implemented Hopf map is a valid many-to-one view of the quaternion
carrier. A frozen S1 fiber action preserved the Hopf point while changing the
represented SO(3) rotation by `1.46 rad`. Therefore the Hopf coordinate cannot
serve as the sole persistent orientation address and cannot reconstruct the
discarded fiber coordinate.

The controlling orientation record remains the SO(3) matrix plus the
canonical quaternion equivalence class. Hopf is a projection/view only.

## Scientific interpretation

Phase A showed that rigid translation and proper rotation can be removed
without changing internal geometry, leaving a real conformer residual. Phase
B now shows that this residual includes structured local backbone orientation
variation. Thus the useful decomposition is:

```text
observed coordinates
  = global rigid frame
  + body-frame conformation
  + local orientation field
```

This is a representation statement for the bound ensemble. It is not evidence
that Hopf geometry causes protein folding, and it does not make conformer index
a temporal trajectory.

## Holds

- Phase C / AXIS08: `HOLD_NATURAL_PAIR_UNRESOLVED`
- Mod7/Mod11 admission: `HOLD`
- protein prediction or biological mechanism: not claimed

