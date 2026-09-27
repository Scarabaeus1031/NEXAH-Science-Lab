# KAPPA-01 — Prospective Preregistration Architecture

## Scientific question

Does a predeclared active intervention alter the continuously measured
force-versus-displacement relative phase path more than a predeclared sham
intervention in the same apparatus?

## Experimental unit

The independent experimental unit is one complete physical session, not one
sample, window or cycle. Sessions are paired into randomized active/sham
crossover blocks. Cycles and phase windows remain repeated observations within
a session.

## Design

- paired randomized crossover;
- one active and one sham session per block;
- order concealed from the analysis pipeline until the primary result is
  frozen;
- washout criterion declared before acquisition;
- apparatus, fixture, preload, frequency, amplitude, sampling and processing
  held fixed within a block;
- no optional stopping based on observed condition differences;
- independent-session target determined from a predeclared MCID and variance
  source before unblinding.

## Continuous session record

Every session is a single uninterrupted acquisition from one hardware clock:

```text
PRE -> EVENT -> POST -> RECOVERY
```

The acquisition must not stop, restart its clock or concatenate independently
timestamped files at a phase boundary. A hardware/digital event marker is
recorded on the same clock as all measurement channels.

Minimum analysis windows after warm-up exclusion:

- PRE: at least 20 complete excitation cycles;
- POST: at least 20 complete excitation cycles;
- RECOVERY: at least 20 complete excitation cycles;
- EVENT/transition: fully recorded at the native sample rate.

The final protocol must declare event duration, recovery duration and washout
rule. These cannot be selected after inspecting outcomes.

## Required simultaneous channels

- measured drive voltage, not a software setpoint;
- calibrated displacement in millimetres;
- calibrated axial force in newtons;
- hardware event marker;
- sample index and timestamp from one clock;
- temperature or a justified environmental substitute.

Force and displacement must each have current calibration identifiers and
positive uncertainty. Channel delay/skew must be measured or bounded before
the first experimental session.

## Primary phase relation

Displacement is the reference and force is the response:

```text
theta(t) = wrap(phi_force(t) - phi_displacement(t))
```

The frozen estimator is complex demodulation at the declared excitation
frequency using a one-cycle Hann window advanced by one quarter cycle. Windows
touching missing samples, clipping or an undeclared clock discontinuity are
invalid rather than interpolated.

Drive-to-force phase is secondary and remains separately typed.

## Primary estimand

For each session:

```text
endpoint_shift = circular_mean(first 10 valid POST cycles)
               - circular_mean(last 10 valid PRE cycles)
```

wrapped into `[-180°, 180°)`.

The primary active effect is the paired session contrast:

```text
Delta_primary = endpoint_shift_active - endpoint_shift_sham
```

The confirmatory test is a two-sided paired randomization/sign-flip test at
`alpha=0.05`, with the randomization block as the unit. The effect estimate and
95% interval must be reported regardless of significance.

## Kappa path estimands

Secondary, ordered estimands are:

1. signed area of `theta(t) - PRE_mean` from event onset through the first ten
   POST cycles;
2. maximum absolute phase excursion in the same interval;
3. recovery time to enter and remain inside the predeclared PRE tolerance band;
4. number and signed direction of declared phase-cell boundary crossings.

These path outcomes are tested only if the primary endpoint passes. Holm
correction is then applied in the stated order. Decimal/modular summaries are
descriptive and cannot replace the continuous primary endpoint.

## Janus and Thoth roles

- Janus reverses the oriented path for a software identity check only; it does
  not exchange active and sham labels.
- Kappa is the measured continuous edge/path record.
- Thoth binds the raw-file hash, configuration hash, clock identity, event
  marker, exclusions, estimator version and result hash.

## Nulls and controls

Required controls:

- sham intervention;
- NULL/no-drive sensor-floor session before the campaign;
- channel-delay calibration;
- synthetic fixed-phase recovery;
- synthetic phase-jump recovery;
- rejection of clock reset, duplicate sample index, missing event marker,
  missing channel, clipping and non-finite values;
- label permutation/randomization test;
- sensitivity analysis excluding the first and last valid cycle of each
  primary window.

## Sample size gate

No target sample size is inferred from the PHX-01 cycles because those cycles
are not independent sessions. Before the final seal, the owner must supply:

- a smallest effect of interest in degrees (`MCID > 0`);
- a defensible standard deviation for paired session contrasts from an
  independent pilot or conservative external source;
- target power, at least 0.80;
- attrition allowance;
- minimum and maximum number of randomized blocks.

The readiness tool computes the normal-approximation paired target and checks
it against the declared bounds. Final inference remains the paired
randomization test.

## Stop and exclusion rules

Safety stops override every scientific objective. A session is excluded only
for predeclared technical causes: clock discontinuity, missing marker, channel
failure, clipping beyond the declared allowance, violation of fixed settings,
or safety stop. Physiologically or mechanically surprising but valid outcomes
are not exclusions.

## Claim boundary

A successful campaign may support an apparatus-bound intervention effect on a
measured phase path. It cannot establish a universal Kappa field, an earthquake
cause, an intrinsic decimal or modular mechanism, prime causation,
morphogenesis or consciousness.
