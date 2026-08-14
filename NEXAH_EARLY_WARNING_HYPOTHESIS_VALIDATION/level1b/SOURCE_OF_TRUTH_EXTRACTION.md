# Level-1B Source-of-Truth Extraction

Status: `OWNER_REVIEW_REQUIRED`  
Controlling protocol: `NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC` V1.0.0  
Controlling manifest SHA-256: `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`

This table was completed before evaluator code or development execution. An
ambiguity is material when a permissible implementation choice can change a
warning, alarm, event, lead, calibrated threshold, or final outcome.

| Item | Controlling source and section | Extracted definition | Implementation consequence | Ambiguity |
|---|---|---|---|---|
| A. Candidate R(t) | `04_PREREGISTRATION.md`, Frozen Level-1 protocol; JSON `frozen_definitions_only.candidate_indicator` | `R(t)=abs(mean_i(exp(1j*delta_i(t))))` | Apply independently to every raw angle row; no smoothing, reference phase, or Cubit term | None |
| B. Comparator V(t) | `04_PREREGISTRATION.md`, Frozen Level-1 protocol; JSON `frozen_definitions_only.comparator` | `V(t)=max_i abs(omega_i(t)-omega_COI(t))`, with `omega_COI=sum_i M_i omega_i/sum_i M_i` | Use frozen inertia weights and raw speed row | None |
| C. Event onset | `04_PREREGISTRATION.md`, Frozen Level-1 protocol; JSON `terminal_event` and `persistence` | First time maximum pairwise unwrapped angle separation is strictly greater than `pi` continuously for 0.2 time units | Requires a discrete duration/count rule and a choice of onset versus confirmation timestamp | **Material:** JSON also says `primary_dt_terminal_event_samples=20`; 20 samples span 0.19 at `dt=0.01`, while 20 intervals/21 samples span 0.2 |
| D. Persistence | `04_PREREGISTRATION.md`, candidate/comparator/event rows; JSON `persistence` | R below threshold for 10 consecutive samples; V above threshold for 10 consecutive samples; event breach sustained 0.2 time units | Implement a consecutive-run detector | **Material:** record time at first qualifying sample or at the confirming sample is not frozen; event sample/interval count is inconsistent as noted above |
| E. Warning/alarm condition | `04_PREREGISTRATION.md`, Frozen protocol and Exclusions | Warning: strict `R<tau_R`; alarm: strict `V>tau_V`; no warning scored during pre-stress burn-in | Threshold equality does not cross | **Material:** a persistent run beginning before/on onset and completing after onset is not assigned an eligibility/timestamp rule |
| F. Lead time | `06_METRICS_AND_PASS_FAIL_CRITERIA.md`, Run-level definitions | `L_N=T_E-T_N`, `L_B=T_E-T_B`, `Delta_L=L_N-L_B`; credit only in inclusive `[0.2,5.0]` and warning after stress onset | Preserve undefined lead when required time is absent; evaluate interval inclusively | Formula is clear, but values depend materially on unresolved event/warning timestamp conventions |
| G. Development calibration | `04_PREREGISTRATION.md`, Threshold calibration | R grid 0.50–0.95 by 0.01; V grid 0.02–1.00 by 0.01; require non-event FPR ≤0.10; maximize recall, then median actionable lead; then lower FPR, then shorter lead | Evaluate each indicator separately using development only | **Material:** “event recall” is not explicitly limited to actionable detections; handling of thresholds with recall but no defined lead is absent; no final threshold-value tie-break remains if all criteria tie |
| H. Success/failure criteria | `06_METRICS_AND_PASS_FAIL_CRITERIA.md`, PASS/FAIL/INCONCLUSIVE | Seven joint PASS gates; substantive failure with adequate data is FAIL; listed validity/data failures are INCONCLUSIVE | Must return exactly one frozen outcome only after sealed evaluation | **Material:** “directionally preserved” at ±10% and across two rate strata has no mathematical predicate; exact bootstrap procedure required by gate 4 is not frozen |
| I. Aggregation across seeds | `06_METRICS_AND_PASS_FAIL_CRITERIA.md`, Required metrics | Run-level distributions; median/IQR/empirical 95% intervals; stratify by seed/path; paired bootstrap stratified by path; raw counts | Preserve all runs and strata | **Material:** bootstrap replicate count, RNG/seed, resampling unit/allocation, interval construction, quantile convention, and “hierarchical summaries” are unspecified |
| J. Numerical sensitivity | `06_METRICS_AND_PASS_FAIL_CRITERIA.md`, Required metrics and PASS gate 6 | Compare `dt=0.01` with `0.005`; classification-rate change ≤0.02 and median-lead change ≤10% | Requires matched primary/fine executions and fixed classification convention | **Material:** whether 10-sample warning persistence remains 10 samples or preserves elapsed duration is unstated; stochastic path coupling across timesteps and zero-denominator percent change are unstated |
| K. Missing/non-crossing | `04_PREREGISTRATION.md`, Exclusions; `06_METRICS...`, Run-level definitions | Event-free runs remain in FPR; missing warning on event run is false negative; out-of-horizon warning is not actionable; numerical invalidity is not event | Emit explicit missing values and never manufacture zero lead | **Partial ambiguity:** missing comparator detection and precision denominator edge cases are not explicitly specified; calibration median when no actionable leads is undefined |
| L. Ties and equality | `04_PREREGISTRATION.md`, Frozen protocol and calibration | R uses `<`; V and event use `>`; FPR eligibility uses `≤`; actionable horizon is `[0.2,5.0]`; lead gate uses `>0` | Respect strict/non-strict boundaries exactly | **Material:** persistence time boundary and final calibration tie after all listed criteria are not specified |

## Algebraic common-phase finding

The algebraic definition itself establishes

```text
R'(t) = |mean_k exp(i(delta_k-alpha))|
      = |exp(-i alpha)| |mean_k exp(i delta_k)|
      = R(t).
```

This proves that a common phase shift is representational for this magnitude;
it cannot add predictive information. The requested numerical maximum cannot
be produced by a Level-1B verifier because implementation is blocked before
coding. The prior forensic check remains provenance only and reported a
roundoff-scale maximum of `5.6e-16`; it is not substituted for the missing
Level-1B verification result.

## Neutral details that would not require Owner choice

Canonical JSON serialization, finite-array validation, raw hash verification,
read-only input handling, and exact decimal-grid construction from integer
indices are scientifically neutral. They were identified but not implemented,
because the task requires stopping before code when material scientific
ambiguity remains.
