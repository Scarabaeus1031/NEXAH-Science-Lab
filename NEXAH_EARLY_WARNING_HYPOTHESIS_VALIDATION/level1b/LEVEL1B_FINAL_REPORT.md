# Level-1B Final Report

```text
ORIGINAL_LEVEL1_MANIFEST_VERIFIED = YES
PROTOCOL_AMENDMENT_CREATED = YES
AMENDMENT_SHA256 = c5df438954b3f32d44a4eea6d4add89bb9f10c71e3b32ba8ce135d8b473c870a
SCIENTIFIC_RAW_MODEL_CHANGED = NO
R_FORMULA_CHANGED = NO
V_FORMULA_CHANGED = NO
DEVELOPMENT_RESULTS_SEEN_BEFORE_AMENDMENT = NO
EVALUATION_PARTITION_OPENED = NO
EVALUATION_PERFORMANCE_INSPECTED = NO
APPLICATION_001_CHANGED = NO
```

## Required 25 answers

1. **Level-1 manifest exact:** Yes, V1.0.0 at the controlling SHA.
2. **All definitions unambiguous:** Yes, after prospective amendment V1.0.1.
3. **Scientific definitions changed:** No formulas/model/paths/seeds changed; only previously unresolved operational semantics were frozen.
4. **R:** `abs(mean_i(exp(1j*delta_i(t))))`.
5. **V:** `max_i abs(omega_i(t)-omega_COI(t))`, with inertia-weighted COI.
6. **Event:** first state of 21 consecutive states spanning 20 intervals/0.2 at primary dt, all with pairwise separation strictly `>pi`; confirmation at state 21.
7. **Persistence:** primary R/V exactly 10 qualifying states; onset at state 1 and confirmation at state 10; no failed sequence detection and no pre-onset carry.
8. **Warning/alarm:** strict `R<tau_R` / `V>tau_V`, onset at/after stress time 5.
9. **Lead:** `L_N=T_E-T_N`, `L_B=T_E-T_B`, `Delta_L=L_N-L_B`; actionable inclusive `[0.2,5.0]`.
10. **Common-phase invariance:** Yes, algebraically and numerically; representational only.
11. **Maximum discrepancy:** `5.551115123125783e-16`.
12. **Byte replay:** Yes.
13. **Evaluator tests:** All A–S passed.
14. **Development trajectories:** 357 primary runs.
15. **Development R:** `tau_R=.50`; 0/357 detections, FPR 0, no events, recall/lead undefined.
16. **Development V:** `tau_V=1.00`; 0/357 detections, FPR 0, no events, recall/lead undefined.
17. **Post-result definition changes:** No.
18. **Evaluation trajectories generated:** No.
19. **Evaluation performance inspected:** No.
20. **Evaluator hash-frozen:** Yes.
21. **Level-1B spec SHA-256:** `2a3a53da5841154f60b07b97b489ac9bdc89df79de65e33b5cb9b36cb0b59839`.
22. **Application 001:** Unchanged.
23. **Canonical components:** Unchanged.
24. **Hypothesis scientifically tested:** No; development is not held-out evaluation.
25. **Ready for separately authorized Level-1C:** Yes, using the byte-identical frozen evaluator and sealed evaluation protocol.

## Additional exact specifications

Detection/confirmation, interval/state conversion, persistence, sensitivity,
tie-break, bootstrap, and undefined policy are recorded verbatim in
`LEVEL1B_FREEZE_RECORD.md` and the machine evaluator specification. The
stochastic timestep comparison remains transparently not comparable without a
new Owner-reviewed simulator amendment; this does not open evaluation or alter
the primary evaluator.
