# Phase B validation record

## Reproduction

The Phase-B runner was executed twice from the package directory with the
bundled Python runtime. Both executions returned:

```text
status   PASS
decision PHASE_B_LOCAL_ORIENTATION_AUDIT_CONFIRMED
gates    12 / 12 PASS
```

The two generated outputs were byte-identical.

## Frozen inputs and implementation

| File | SHA-256 |
|---|---|
| `SOURCE_DATA/1XQQ.pdb` | `88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1` |
| `07_PHASE_B_ORIENTATION_PREREGISTRATION.md` | `bfa2b31f6c5915593bf18406b825c08185fc81fa51acdc10cc796187abe85eb5` |
| `phase_b_protocol.json` | `76ca2e3b22b9f078d4e515ee07c624b02f30642cdc9807994155da44763e5024` |
| `run_phase_b.py` | `06b8ae320472dbf3d3e76c66b76ed61141f42e4e03313948888e9973a895cd68` |

## Deterministic outputs

| File | SHA-256 |
|---|---|
| `phase_b_results.json` | `1692ee71057aebe5b215c88f2d07204429a3c58e6830bd47f498dc1026f0565e` |
| `phase_b_per_residue_orientation.csv` | `d60c80da70b2531a3a8591d7566ddd98cb1ed9ba331b91030b02d8b7f34f6aaa` |

## Independent control classes inside the run

- algebraic validity: orthonormality, determinant, quaternion norm and
  matrix roundtrip;
- representation identity: `q` and `-q`;
- projection boundary: explicit S1 Hopf-fiber noninjectivity;
- nuisance invariance: global translation plus proper rotation;
- chirality sensitivity: reflected carrier remains distinguishable;
- fail-closed input behavior: missing and degenerate backbone atoms.

## Claim-boundary validation

The run does not use model number as time, reconstruct a quaternion from the
Hopf view, infer a folding path, install a new operator, or admit AXIS08,
Mod7, or Mod11. Those claims remain outside the tested contract.

