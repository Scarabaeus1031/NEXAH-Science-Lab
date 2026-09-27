# KAPPA-02 — Within-run phase-path audit

## Question

Is the Before/After phase difference seen in the PHX Hertz/frequency experiment a nearly constant offset, or does it evolve systematically over the course of a run?

This is **Goal A**: extract additional structure from the existing recordings. It is not a new causal earthquake experiment and it does not test digit, prime, modulo, Janus, Thoth, or other number-symbolic hypotheses.

## Frozen estimator

- Signal pair: force relative to displacement.
- Local estimator: weighted harmonic regression at the commanded frequency in a one-cycle Hann window.
- Step: one eighth of a cycle.
- Inclusion: complete windows inside the common active-cycle interval.
- Comparison: Before and After are paired only by normalized ordinal window index. They are not physically time-synchronized records.
- Kappa channel: `kappa(u) = theta_after(u) - theta_before(u)`.
- Janus control: reversing subtraction must give `-kappa(u)`.

The original direct-demodulation implementation failed its prospective synthetic tolerance by 0.05504 degrees versus the frozen 0.05-degree limit. No empirical output was accepted from that implementation. `METHOD_AMENDMENT_01.md` sealed the switch to weighted harmonic regression before empirical rerun; all synthetic controls then passed.

## Main result

The four paths are not consistent with one perfectly constant Before/After offset. In every channel, Kappa is negative but moves toward zero across the run. Three of four paths satisfy the frozen `ORDINAL_RELAXATION_LIKE` rule; the remaining path has the same directional change but is more nonlinear and narrowly misses the linear-fit improvement threshold.

| Condition | Actuator | Mean Kappa (deg) | First quartile (deg) | Last quartile (deg) | Last − first (deg) | Linear slope (deg/run) | Frozen label |
|---|---:|---:|---:|---:|---:|---:|---|
| 0.5 Hz / 20 mm | 1 | -0.679 | -0.768 | -0.632 | +0.136 | +0.174 | ordinal relaxation-like |
| 0.5 Hz / 20 mm | 2 | -0.459 | -0.559 | -0.410 | +0.149 | +0.193 | nonlinear or mixed |
| 1.0 Hz / 40 mm | 1 | -0.253 | -0.386 | -0.166 | +0.220 | +0.286 | ordinal relaxation-like |
| 1.0 Hz / 40 mm | 2 | -0.229 | -0.378 | -0.162 | +0.216 | +0.291 | ordinal relaxation-like |

The 0.5 Hz / 20 mm actuator-2 path misses the frozen relaxation label only because the linear model reduces RMSE by 9.71%, just below the 10% threshold. Its positive slope and +0.149-degree first-to-last-quartile change still point in the same direction as the other three paths.

## What the sign means

`Kappa < 0` means the After-run force–displacement phase is smaller than the Before-run phase at the matched ordinal location. A positive Kappa slope means that this negative gap becomes less negative over the run: the Before/After difference relaxes toward zero.

Both Before and After phase paths themselves tend downward. The Before path falls faster than the After path in all four comparisons, producing the positive Kappa slope. Thus the result is not “After alone returns to baseline”; it is a relative within-run convergence of two separately acquired paths.

## Relation to the earlier PHX result

The earlier PHX values of roughly 4.4–5.6 degrees describe the absolute force–displacement phase during active cycles. The reported -0.26 to -0.70 degree values describe the After-minus-Before contrast. They are different levels of measurement and should not be treated as two digits or two adjacent cuts of one number.

KAPPA-02 adds a third level: the contrast as a function of normalized run position. Its result shows that the PHX mean shift compresses a changing path into one average. The shift is therefore not well described as a completely uniform offset throughout the run.

## Internal controls and cross-checks

- Synthetic fixed-phase maximum error: `5.68e-14 deg`.
- Synthetic linear-drift endpoint maximum error: `0.000888 deg`.
- Unequal-amplitude maximum error: `5.68e-14 deg`.
- Maximum Janus antisymmetry error in empirical paths: `0 deg`.
- Number of accepted local records: `520`.
- Number of ordinal Kappa records: `260`.
- Mean local-window phase estimates reproduce the earlier PHX cycle means to within `0.0795 deg` in every condition/channel. The small residual is expected because the estimators and weighting differ.

## Scientific interpretation

The defensible conclusion is descriptive:

> In the available PHX recordings, the After-minus-Before force–displacement phase difference is not temporally uniform. It is negative on average and tends to become less negative from early to late ordinal run positions, with a stronger linear pattern in the 1.0 Hz / 40 mm condition.

This is evidence for within-run structure, not for a specific physical mechanism. Frequency and displacement amplitude change together between the two conditions, so their effects cannot be separated. The result also does not validate digit grouping, prime factorization, palindromes, modulo-2/3 constructions, or named mathematical constants; those remain hypothesis-generation devices unless independently specified and tested on new data.

## Recommended next experiment

Run the already prepared KAPPA-01 prospective shared-clock campaign. It should acquire synchronized force and displacement, randomized or counterbalanced conditions, repeated runs, and a true between-condition Kappa contrast. Factor frequency and amplitude independently if feasible. That experiment can test whether the ordinal relaxation reproduces and whether it is attributable to the campaign rather than run order, drift, or estimator structure.

