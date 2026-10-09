# UTG-FORMAL-01 — Lorenz Crossing Control Result

Date: `2026-10-06`

Status: `PASS / OBJECT-SPECIFIC FORMAL CONTROL SUPPORTED / NO APPLICATION VALIDATION`

## Result

The preregistered Aperture / Boundary / Gate / Crossing classifier passed all
eight acceptance gates on the declared Lorenz-63 carrier.

| Sampling step | Crossings | Admitted positive | Rejected negative | Nontransversal | Time MAE vs reference | `z` MAE vs reference |
|---:|---:|---:|---:|---:|---:|---:|
| `0.001` | 50 | 25 | 25 | 0 | 0 | 0 |
| `0.005` | 50 | 25 | 25 | 0 | `2.123e-05` | `7.823e-04` |
| `0.01` | 50 | 25 | 25 | 0 | `8.621e-05` | `3.189e-03` |
| `0.02` | 50 | 25 | 25 | 0 | `3.634e-04` | `1.341e-02` |

All interpolated events have `g=x=0` to the recorded numerical precision. The
coarsest declared sampling level remains inside the preregistered error bounds
of `0.001` for mean event-time error and `0.05` for mean section-`z` error.

## Frozen control outcomes

| Control | Result |
|---|---|
| positive transversal crossing | detected and admitted |
| negative transversal crossing | detected and rejected by directional gate |
| same-side near miss | no crossing |
| boundary touch | touch/unresolved, not promoted |
| sign change with zero declared normal velocity | nontransversal, not admitted |

The result files are byte-identical across two executions:

- `UTG_FORMAL_01_RESULTS.json` — SHA-256
  `3a6505239a89d240b80a9f0ebeeaf4ea3f559040b3fa2a1a0967101f3c9ce695`;
- `UTG_FORMAL_01_EVENTS.csv` — SHA-256
  `9bad1915a49b9dd4f25d576948e4754d8af8001c59498c9e36dfa85110707251`.

## What the test resolves

The test makes the UTG distinction operational on one carrier:

```text
W = observation aperture around the section
B = event location x=0
crossing = declared side change + interpolation + transversality check
G = directional admission rule
R = identity record return, not a physical reset
```

The aperture sample count changes with observation resolution (`8841`, `1768`,
`883`, `441`) while the 50 event classifications remain stable. This is direct
computational evidence, on this carrier, that aperture membership is not the
same operation as crossing detection or gate admission.

## Decision

Promote the `Aperture / Transition` candidate only to:

`OBJECT-SPECIFIC FORMAL CONTROL SUPPORTED — LORENZ-63 CROSSING CLASSIFIER`

Do not promote:

- the Series XIV plate equation;
- a universal UTG transition operator;
- a physical mechanism;
- a new Lorenz-63 property;
- a validated application or cross-domain transfer.

## Residuals

- The test uses numerical RK4 states and linear event interpolation; it is not
  a proof about all Lorenz trajectories or all event detectors.
- The return map is deliberately identity and record-only. A nontrivial reset
  requires a separately declared hybrid system.
- Historical source-book/page lineage for the four UTG plates remains open.
- Application value, comparative advantage and external legibility remain
  untested.
