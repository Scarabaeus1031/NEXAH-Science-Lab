# Next-test sequence — closeout

Date: `2026-09-29`

Status: `STEP 1 CLOSED / STEP 2 PREREGISTERED NOT EVALUABLE / STEP 3 RECONFIRMED`

## Step 1 — operator-collision matrix

Closed by `NEXAH_OPERATOR_COLLISION_MATRIX_001`:

- `17/17 PASS`;
- three byte-identical executions;
- unique integer collision `A404(404)=D(404)=808`;
- immediate path separation at 808: `1212` versus `1616`;
- classification:
  `SINGLE_OPERATOR_COLLISION_AT_404_TYPED_PATHS_SEPARATE`.

## Step 2 — SCN/NCS-to-404 gate bridge

The experiment is now preregistered in
`22_SCN_NCS_404_GATE_BRIDGE_PREREGISTRATION.md`. The historical Knickfield gate
is executable, but the cross-system bridge remains

`NOT_EVALUABLE_WITHOUT_INDEPENDENT_SOURCE_BOUND_H`.

No synthetic map was fitted to the desired number marks. Execution requires a
dated formula with units, state definitions, predictions and negative controls.

## Step 3 — full E8/H4 four-dimensional reference

The proposed stronger E8 test was found to be already complete in the existing
E8-REP-03 benchmark. It was therefore not reimplemented. The original records
were rerun unchanged with the bundled workspace Python runtime.

Reconfirmed results:

- Root7 intake benchmark: `PASS_BOUNDED`;
- E8 assertions: `19/19 PASS`;
- E8 roots: `240`, all with norm squared `2`;
- four-dimensional projection: two shells with `120` points each;
- both shells pass canonical H4 Gram, simple-root and reflection-closure tests;
- Coxeter projection: eight 30-point orbits and four phi-scaled radius pairs;
- E8 edge count: `6720`;
- source edge partition: `1920 + 1920 + 2880 = 6720`;
- nearest-neighbor H4 edges per shell: `720`;
- overlap of those H4 edges with source E8 edges: small shell `0`, large shell
  `720`.

This remains a calibration benchmark. It does not identify the Root7 stretched
box, SCN channel, Ghostgrid or modular graphs with E8/H4.

## Runtime note

The host system Python 3.9 cannot execute the unchanged benchmark because it
lacks `zip(strict=...)` and NumPy. The successful rerun used the bundled
workspace Python. No test source was modified.

## Reconfirmed provenance

| Artifact | SHA-256 |
|---|---|
| `ROOT7_INTAKT_BENCHMARK.py` | `4c98c7185cdca06e39c927d29185f2a862a7fb610566a3170361d29e47b08802` |
| `RESULTS.json` | `9570febc2d2add072dc3edc414ba84ead66c417d061043942abb79790ba638c7` |
| `E8_H4_EDGE_RELATION.py` | `1d85c9673a969a4b6e377a642032a87ed686ea1b90a2819bf3df69b325388ed6` |
| `E8_H4_EDGE_RESULTS.json` | `042679f3e5d44ffa6f60399393500548c2ee3602010b3d05eed9741255ddaa21` |
| original E8 benchmark ZIP | `20de5d42a099a853b57f3c4ced7abae47de7d74d62f2d697fc407afc5c03411d` |
| E8 final report | `6847b06a3e7329463c228732e711caf70df4f2dc2d4db7c2c0def0a6f28d1259` |
| E8 results | `6e45b73c8f857e39715357d0150a59f7e3eee8ef41fd063a8bbe2bf9e1540e96` |

## Sequence decision

The executable work is complete. The only remaining step in this sequence is
external to arithmetic: supply an independently justified `H` for the gate
bridge. Until then, further number-only fitting would reduce rather than
increase evidential value.
