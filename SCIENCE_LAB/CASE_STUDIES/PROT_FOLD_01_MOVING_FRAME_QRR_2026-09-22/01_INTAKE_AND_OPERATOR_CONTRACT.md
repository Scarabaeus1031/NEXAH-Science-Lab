# Intake and Operator Contract — Repair R1

## 1. Carrier semantics

For an ensemble with `M` submitted conformers and a fixed set of `N` selected
atoms, the source carrier is:

```text
X^(m) in R^(N x 3), m = 1,...,M.
```

`m` is only a model/conformer index. Model order has no earlier/later,
velocity, transition, path-length or event-between-neighbors meaning.

Allowed analyses include pairwise conformer differences, ensemble
distributions, contact occupancy, torsion distributions, local orientation
variability and representation/reconstruction audits.

## 2. Typed carriers

- `SOURCE_FRAME3N`: unchanged coordinates from the bound source file;
- `CENTERED3N`: translation of the frozen selected atom set removed;
- `BODY_FRAME3N`: centered coordinates aligned by a proper Kabsch rotation to
  one preregistered reference conformer;
- `FRAME_RESIDUAL`: centroid plus proper rotation required to reconstruct the
  source-file coordinate frame;
- `DIST_NN`: selected-atom pair-distance matrix;
- `CONTACT_NN`: contact matrix under a frozen atom set and threshold;
- `LOCAL_ORIENTATION`: local backbone frames represented on `SO(3)` and, when
  useful, by equivalence classes of unit quaternions;
- `FEATURE8_CANDIDATE`: an unapproved eight-component feature proposal;
- `Q_ONLY7` and `Q_PLUS_RESIDUAL8`: available only after the Natural Pair
  Gate;
- `MOD7_VIEW`, `MOD11_VIEW`, `CRT77_FIXTURE`: optional address sidecar types.

Every conversion must name input type, output type, parameters, retained
relations, losses and failure behavior.

## 3. Centering, Kabsch and gauge boundary

For the frozen selected-atom set, let `c_m` be its centroid. Let `R_m` be the
proper Kabsch rotation in `SO(3)` to a reference conformer chosen before any
comparative result:

```text
C(X^(m)) = X^(m) - c_m
B(X^(m)) = C(X^(m)) R_m.
```

Selecting one aligned representative is a gauge/frame choice. It is not a
recovery of physical world motion. Reflections are prohibited in alignment.

Allowed statement:

> The original source-file coordinate frame can be reconstructed from the
> body-frame representation and the retained frame residual.

Prohibited statement:

> The physical world motion of the protein was reconstructed.

Preferred intrinsic references are pair distances, contact matrices,
proper-superposition RMSD and chirality signs.

## 4. Local orientation and Hopf boundary

The local backbone-frame construction, handedness, atom requirements and
degeneracy policy must be frozen before Phase B. A rotation represented by a
unit quaternion obeys:

```text
u ~ -u.
```

Required before execution:

- local orthonormal-frame construction;
- quaternion component/order convention;
- sign or hemisphere convention;
- missing-backbone and degenerate-frame behavior;
- a metric on `SO(3)` that respects `u ~ -u`.

A Hopf projection `S3 -> S2` loses an `S1` fiber. If inverse reconstruction is
claimed, that fiber coordinate must be stored as a typed residual. Otherwise
the projection remains a noninvertible orientation view.

## 5. FEATURE8 candidate and standardization

The intake candidate remains recorded, not admitted:

```text
(sin(phi), cos(phi), sin(psi), cos(psi),
 sin(omega), cos(omega), accessibility, hydropathy)
```

This vector is eight-dimensional but is not an E8 object. Accessibility and
hydropathy have different semantics and are not a natural pair merely because
they occupy coordinates seven and eight.

Before any FEATURE8 execution, freeze and retain:

- observation unit;
- fit/evaluation split;
- per-feature mean and scale;
- missing-value and terminal-residue policy;
- angle, accessibility and hydropathy definitions;
- every transformation parameter.

No standardizer may be refitted on the evaluation split.

## 6. Natural Pair Gate and AXIS08/QRR

```text
AXIS08_PAIR_STATUS = UNRESOLVED
```

The gate must resolve before Phase C as exactly one of:

- `PASS_NATURAL_PAIR_DECLARED_BEFORE_RESULTS`;
- `STOP_NO_NATURAL_PAIR`;
- `CALIBRATION_PAIR_ONLY_NOT_BIOLOGICAL`.

Only after a pass may a declared pair `(z_a,z_b)` use:

```text
q = (z_a + z_b) / sqrt(2)
r = (z_a - z_b) / sqrt(2).
```

A torsion sine/cosine pair may serve as an algebraic calibration only. It is
not a biological AXIS08 discovery. Quotient plus residual stores eight
scalars and is not a compression claim.

## 7. E8 boundary

E8 is retained only as the already existing exact calibration carrier of the
separate AXIS08/QRR program. No map from protein states or FEATURE8 into E8
roots is registered here. A future protein–E8 map would require its own typed
operator, baselines, preregistration and authorization.

## 8. Mod-7/11 sidecar

The algebraic fixture

```text
i -> (i mod 7, i mod 11), i in 0..76
```

remains an independent exact CRT control. Human ubiquitin has 76 residues and
does not fill a complete 77-address cycle. No model/conformer index is treated
as time.

```text
MOD7_11_PROTEIN_SIDECAR = HOLD_PENDING_TYPED_UTILITY_QUESTION
```

Any later utility question must freeze a sampling task and equal-size random
and consecutive controls before viewing outcomes.

## 9. PC naming boundary

`PC` remains unresolved. No executable operator may use that name until its
full name, equation, input/output carrier and failure behavior are registered.
Prefix/pancake reversal is a discrete ordering operator, not physical folding.
Projection/cut would require its own typed projection contract.

## 10. Correspondence ceiling

| source concept | formal use | preserved relation | failure condition |
|---|---|---|---|
| native-state conformer ensemble | unordered model-indexed carrier | selected-atom identity | temporal interpretation of model order |
| source-file coordinates | `SOURCE_FRAME3N` | deposited coordinate values | calling the file frame a world frame |
| aligned representative | gauge-selected `BODY_FRAME3N` | intrinsic rigid-motion invariants | reflection or post-hoc reference choice |
| local rotation | `SO(3)` / quaternion class | orientation modulo `u ~ -u` | hidden sign or degeneracy policy |
| FEATURE8 | typed candidate record | declared feature semantics | treating dimension eight as E8 |
| AXIS08/QRR | gated pair quotient/residual | exact algebra after pair declaration | improvised or semantically mismatched pair |
| Mod 7/11 | optional address sidecar | exact CRT fixture on `Z_77` | biological-frequency or full-cycle claim for 76 residues |

