# Level-1B Owner Review Required

Date: 2026-08-13 (Europe/Berlin)  
Disposition: `NOT_ADOPTED`  
Status: `LEVEL1B_BLOCKED_OWNER_REVIEW_REQUIRED`

## Fail-closed result

The Level-1 baseline verified exactly:

- protocol `NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC` V1.0.0;
- manifest SHA-256 `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`;
- all 22 entries in the existing Level-1 hash manifest match actual bytes;
- all four existing raw artifacts identify the development partition and the
  exact manifest hash;
- no local Level-1 raw artifact identifies the evaluation partition.

The source extraction in `SOURCE_OF_TRUTH_EXTRACTION.md` found material choices
that can alter event time, warning/alarm time, lead, threshold calibration,
confidence bounds, or the final scientific outcome. The Level-1B evaluator,
verifier, development run, calibration, and hash freeze were therefore not
created or executed.

## Owner decisions required before a new Level-1B attempt

1. Define whether persistent warning/alarm time is the first qualifying sample
   or the tenth/confirming sample.
2. Reconcile the event duration rule: at `dt=0.01`, state whether 0.2 requires
   20 intervals/21 sampled states or whether the frozen “20 samples” field is
   intended despite spanning 0.19 between endpoints. Define event onset versus
   confirmation time.
3. Define whether a 10-sample run that begins during burn-in but confirms after
   stress onset is eligible, and which timestamp controls the after-onset gate.
4. Define calibration “event recall” as actionable-only or any persistent
   detection, plus the ranking of thresholds with no defined actionable lead.
5. Add a deterministic final threshold-value tie-break after all existing
   criteria tie.
6. Freeze the paired stratified bootstrap completely: replicate count, RNG and
   seed, resampling unit/allocation, interval method, and quantile convention.
7. Define the exact predicate for “directionally preserved” at ±10% thresholds
   and across rate strata.
8. Define timestep-halving persistence semantics, stochastic matching, and
   percent-change handling when the reference median lead is zero.
9. Define missing comparator detections, empty precision denominators, and
   calibration medians when no actionable lead exists.

These decisions are prospective: no development indicator result has been
computed. They require a versioned protocol amendment before evaluator coding.

## Required final-answer state

1. Frozen manifest exact: **Yes**.
2. All evaluator definitions unambiguous: **No**.
3. Scientific definitions changed: **No**.
4. R definition: frozen but not implemented.
5. V definition: frozen but not implemented.
6. Event definition: frozen text exists; discrete implementation is blocked.
7. Persistence: frozen counts/duration exist; timing semantics are blocked.
8. Warning/alarm: inequalities are frozen; timing/eligibility is blocked.
9. Lead: formulas are frozen; operands are not uniquely implementable.
10. Common-phase invariance proven: **Yes, algebraically**.
11. Level-1B numerical discrepancy: **Not measured**; prior forensic provenance was at most `5.6e-16`.
12. Evaluator replay: **Not run**.
13. Evaluator tests: **Not run**.
14. Development trajectories evaluated: **0**.
15. Development R results: **Not computed**.
16. Development V results: **Not computed**.
17. Definitions changed after results: **No; no results were generated**.
18. Evaluation trajectories generated: **No**.
19. Evaluation performance inspected: **No**.
20. Evaluator hash-frozen: **No; correctly blocked before implementation**.
21. Level-1B manifest SHA-256: **Not applicable; no evaluator manifest was created**.
22. Application 001 unchanged: **Yes**.
23. Canonical components unchanged: **Yes**.
24. Hypothesis scientifically tested: **No**.
25. Ready for sealed Level-1C evaluation: **No; Owner amendment and a new successful Level-1B freeze are required**.

## Firewalls and repository discipline

```text
EVALUATION_PARTITION_OPENED = NO
EVALUATION_PERFORMANCE_INSPECTED = NO
APPLICATION_001_CHANGED = NO
```

No raw simulator, Level-1 artifact, canonical component, historical file, or
unrelated working-tree material was modified. No Git add, commit, push, merge,
deployment, evaluation generation, development evaluation, or scientific
calibration occurred.
