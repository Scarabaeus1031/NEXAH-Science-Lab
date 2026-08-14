# EXP-ORION-L3-001 — Information-Loss Record

```text
R0 full state/time/equations
├── R1 bijective coordinates: no information loss
├── R2 geometry: time and exact intersample dynamics lost
│   └── R4 graph: coordinates/time/equations lost
│       └── R6 rendering: state identity and color semantics lost
├── R3 z only: x/y/sign/identity/direction lost
└── R5 sample estimator: exact field identity/off-support behavior unavailable
```

The three restricted claims behaved correctly:

- C04 received one z scalar. C+ and C− both supplied z=27 with opposite sign(x); result UNDEFINED.
- C06 received graph/estimated-field domain facts without equilibrium query or Jacobian; stability result UNDEFINED.
- C10 received one color token. C+ and C− shared it while remaining distinct states; result UNDEFINED.

No claimant accessed source state, hidden coordinates, time, step, source ID, history/future, analytic equations, generator intermediates, or restricted correspondence beyond its registered view. Information-loss boundaries: PASS.

