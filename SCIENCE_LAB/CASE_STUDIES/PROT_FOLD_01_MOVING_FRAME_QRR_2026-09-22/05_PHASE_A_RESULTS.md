# Phase A results — source/centered/body-frame fidelity

Status: `PASS`  
Decision: `PHASE_A_FRAME_FIDELITY_CONFIRMED`  
Carrier: bound RCSB PDB `1XQQ`, models `1..128`, chain `A`, C-alpha
addresses `1..76`

## Result in one sentence

For the bound 1XQQ native-state conformer ensemble, removal of translation and
proper-Kabsch frame alignment preserves the preregistered rigid-motion
invariants and the retained centroid/rotation reconstructs the PDB source-file
coordinates to numerical precision; reflection and residue-identity corruption
are not mistaken for admissible frame changes.

## Primary gates

All eleven frozen gates passed:

| Gate | Result |
|---|---:|
| source SHA-256 match | `PASS` |
| model count = 128 | `PASS` |
| common selected C-alpha count = 76 | `PASS` |
| pair-distance invariance | `PASS` |
| source-frame reconstruction | `PASS` |
| proper rotations only | `PASS` |
| contact-matrix invariance | `PASS` |
| translation control | `PASS` |
| proper-rotation control | `PASS` |
| reflection detected | `PASS` |
| reversed identity detected | `PASS` |

Numerical fidelity:

```text
maximum pair-distance error       = 3.552713678800501e-14 Å
maximum reconstruction error      = 3.197442310920451e-14 Å
maximum |det(R)-1|                = 1.7763568394002505e-15
minimum contact-matrix agreement  = 1.0
actual-model chirality agreement  = 1.0
```

These values confirm the implementation of the declared coordinate change;
they are not evidence of a new protein mechanism.

## Controls

- The frozen translation and proper rotation align to the reference with RMSD
  below `4.2e-15 Å`.
- The reflected carrier flips the frozen chirality sign. Proper Kabsch retains
  `det(R)>0` and therefore cannot erase the reflection; aligned RMSD is
  `10.957 Å`.
- Reversing coordinate identity while retaining residue addresses gives
  aligned RMSD `12.331 Å` and contact agreement `0.89895`, so address corruption
  is not accepted as a frame change.

## Descriptive ensemble record

These summaries describe differences among submitted conformers after removal
of rigid translation and rotation. Model order is not time.

```text
RMSD to fixed model-1 reference:
  median  1.662 Å
  mean    1.674 Å
  p95     2.423 Å
  maximum 2.977 Å

Pairwise body-frame RMSD over all 8,128 unordered conformer pairs:
  median  1.534 Å
  mean    1.760 Å
  p95     3.143 Å
  maximum 3.992 Å
```

The ten largest mean C-alpha displacements from the fixed model-1 reference
occur at residues `76, 75, 74, 73, 9, 10, 72, 21, 8, 37`. Residue 76 has the
largest mean displacement (`8.083 Å`). This is reference-relative descriptive
variability, not a temporal path or causal folding event.

At the frozen `8 Å` C-alpha contact threshold with sequence separation at
least three, `79` residue pairs have occupancies between `0.05` and `0.95`.
The complete typed records are in `phase_a_per_residue.csv` and
`phase_a_contact_occupancy.csv`.

## Interpretation boundary

Supported:

- exact source/centered/body-frame accounting for the selected carrier;
- rigid-motion invariant preservation;
- proper-rotation gauge choice with explicit frame residual;
- descriptive conformer and contact-occupancy variation.

Not supported:

- a folding trajectory, transition rate or earlier/later ordering;
- a mechanistic explanation of protein folding;
- a natural AXIS08 pair;
- E8, Hopf or Mod-7/11 biological identity;
- prediction, intervention or a new capability.

Phases B, C and D remain on hold.
