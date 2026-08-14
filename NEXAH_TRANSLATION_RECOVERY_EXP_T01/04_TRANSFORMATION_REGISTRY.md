# Transformation Registry

## Exact / bijective positive controls

| ID | Fixture | Transform / inverse | Expected |
|---|---|---|---|
| `E1_TRANSLATE_1D` | F1 | `y=x+5`; `x=y-5` | exact recovery |
| `E2_SCALE_1D` | F1 | `y=3x`; `x=y/3` | exact recovery |
| `E3_ROTATE_2D` | F2 | rotation `+pi/3`; inverse `-pi/3` | numerical exact recovery |
| `E4_ORTHOGONAL_2D` | F2 | `(x,y)->(-y,x)`; inverse `(u,v)->(v,-u)` | exact recovery |
| `E5_RELABEL_GRAPH` | F3 | permutation `0→2,1→4,2→1,3→0,4→3`; explicit inverse | exact recovery |

## Invertible but perturbed

F1 uses `E1` followed by deterministic additive pattern
`epsilon*[1,-1,0.5,-0.5]` for `epsilon = 1e-6, 0.1, 0.8`. F2 uses `E3`
followed by nearest-step quantization for step `0.001, 0.05, 0.5`.
The ordinary inverse is then applied. These are empirical numerical
reconstructions, not exact inverses of the perturbation.

## Deliberately lossy / non-injective

| ID | Fixture | Map | Expected primary status |
|---|---|---|---|
| `L1_SIGN_SQUARE` | F1 | coordinatewise `x→x^2`; preimages `x` and `-x` exhibited | `UNIDENTIFIABLE` |
| `L2_PROJECT_X` | F2 | `(x,y)→x` | `INFORMATION_LOST` |
| `L3_COARSE_QUANTIZE` | F1 | nearest integer | `INFORMATION_LOST` |
| `L4_DELETE_EDGE` | F3 | delete registered edge `12` | `INFORMATION_LOST` |

No lossy map is assigned a pseudoinverse. Recovery error must be `null`.

