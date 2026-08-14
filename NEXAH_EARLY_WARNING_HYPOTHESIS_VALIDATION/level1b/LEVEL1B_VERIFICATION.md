# Level-1B Evaluator Verification

Machine result: `verification/verification_result.json`  
Status: `ALL_A_TO_S_TESTS_PASS`

| Test | Verified result |
|---|---|
| A | Exact V1.0.0 protocol and manifest identity |
| B | Canonical raw identity and embedded manifest hash |
| C | Deterministic evaluator replay |
| D | Direct tiny hand-check fixtures |
| E | Exact R formula |
| F | Exact inertia-weighted V formula |
| G | Strict event boundary; 21 states/20 intervals at primary dt |
| H | Ten-state persistence onset and confirmation semantics |
| I | Strict warning/alarm equality and burn-in behavior |
| J | Exact rational lead arithmetic and inclusive horizon boundaries |
| K | Explicit no-crossing result |
| L | NaN/Inf rejection |
| M | Raw-input hash unchanged before/after evaluation |
| N | Canonical JSON ordering and bytes |
| O | Algebraic and numerical common-phase magnitude invariance |
| P | Sealed partition firewall; no evaluation artifact present |
| Q | No evaluation path/seed constants in evaluator source |
| R | Evaluator reads states without state-changing post-processing |
| S | Same input yields byte-identical derived output |

The new common-phase test used four common rotations on an existing development
trajectory. Maximum absolute magnitude discrepancy was
`5.551115123125783e-16`. Thus the shift is representational for R magnitude and
does not add predictive information.

PASS/FAIL/INCONCLUSIVE gate fixtures also returned their expected outcomes;
they test software logic only. No scientific evaluation outcome was computed.
