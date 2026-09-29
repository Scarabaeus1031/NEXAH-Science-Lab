# H_Q_RECORD_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / SOURCE-BOUND PARTIAL EXECUTION ALLOWED`

## Single question

Does the source-defined Five-H Q° record/return procedure reduce circular
phase-reconstruction error relative to the same representation without
re-feed at the eight declared gates?

## Source audit before freeze

The source family defines and executes:

- five period-based phase channels;
- one local Q° time cut;
- gates `3, 6, 9, 12, 24, 36, 42, 48 h`;
- immutable Cut A/B records in the Common Runtime Adapter;
- clock-ID binding, phase-delta comparison and Euclidean residual;
- deterministic receipt hashing and verification.

The source family does **not** define an executable numerical operator for:

- `Pi_Q` dimensional projection;
- allocation into retained, masked and lost fields;
- a state update performed by the drawn `RETURN / RE-FEED` path.

The trace waveform in `NEXAH_FIVE_H_ONE_Q_CUT.html` is generated for display
from two sine terms and is not computed from the five phase vector. It is
therefore excluded from the primary metric.

## Frozen provenance

| Source | SHA-256 |
|---|---|
| Test 04C preregistration | `d54c1c1693c1ccd6ce0d63da361d96a7086c62437195f492a1069ebff4ecd1b2` |
| Test 04C implementation | `e221984abbbc2a661914c3b0df6c30407a9e002f93f525b9c4fdca24ef7ccfb7` |
| Five-H runtime profiles | `9e2a55497ae2c7fe5510398818e75658d6d27b83b6e7c89606465e26f85cd71d` |
| Five-H HTML | `8c733218dfd1ae6e8632653439877c059429286fa45e09889d0ccfdce0e123ca` |

## Frozen input

Epoch: `2024-01-15T00:00:00Z`.

Location inherited from the executable Test 04A/04C source:

```text
latitude  = 50.8514 degrees north
longitude = 5.69097 degrees east
height    = 55.0 metres
label     = TEST_04C_MAASTRICHT_SITE
```

The coordinates are the Maastricht test site used in the source code. Visual
Rödelheim branding is not treated as coordinate provenance. Location is
recorded but does not enter the period-only phase calculation.

Base periods in days:

```text
sidereal spin        0.9972695663
annual orbit       365.256363004
lunar sidereal      27.321661
principal nodes   18.613 * 365.2422
axial precession 25772.0 * 365.2422
```

Five recorded H channels:

```text
H1 solar day       = beat(sidereal spin, annual orbit)
H2 synodic month   = beat(lunar sidereal, annual orbit)
H3 annual orbit
H4 principal nodes
H5 axial precession
```

Phase convention:

```text
phase_j(t) = fractional_part(elapsed_days / period_j)
phase_j(epoch) = 0
```

This is an elapsed-phase convention, not an ephemeris-derived absolute phase.

## Frozen records and reconstruction

At each gate the source-bound record contains:

```text
gate_hour, clock_id, phase_turns
```

Reconstruction joins by `gate_hour` and `clock_id`. It does not rely on row
order. Circular error for one phase is

```text
d(a,b) = min(abs(a-b), 1-abs(a-b)).
```

The aggregate metric is circular RMSE across all 40 gate-clock cells.

## Primary estimand and fail-closed rule

```text
delta_RMSE = RMSE(no_re_feed) - RMSE(re_feed)
```

The primary effect is evaluable only if both arms have independently defined
and different executable state-update operators. If `re-feed` is only a drawn
return path and no update rule is present, the required result is:

`PRIMARY_EFFECT_NOT_EVALUABLE_OPERATOR_ABSENT`.

Zero reconstruction error of an identity record must not be relabelled as a
benefit of re-feed.

## Frozen controls

1. **Direct-formula comparator** — reconstruct the source phase vector from
   the period formula; tolerance `1e-12 turns`.
2. **Shuffled gate order** — fixed order
   `[24, 3, 48, 12, 36, 6, 42, 9]`; gate and clock identifiers retained.
3. **Positive phase-offset controls** — add `+1/8` and `-1/8` turn modulo one;
   expected circular RMSE `0.125 turns`.
4. **No-re-feed representation** — remove the return label/flag but preserve
   the same source record. Equality with the labelled arm demonstrates absence
   of an executable update, not efficacy.
5. **Record completeness** — exactly 40 unique gate-clock cells; no duplicate
   or missing key.
6. **Deterministic replay** — two clean executions must be byte-identical.

## Sensitivity

The two signed `1/8`-turn offsets are the declared sensitivity checks. No
threshold, mask width, projection matrix or feedback gain may be fitted after
execution.

## Decision rules

- `PASS_SOURCE_BOUND_RECORD_RECONSTRUCTION` if completeness, direct
  reconstruction, shuffle invariance, offset detection and deterministic
  replay pass.
- `PRIMARY_EFFECT_NOT_EVALUABLE_OPERATOR_ABSENT` if no numerical re-feed
  update exists.
- `FAIL` if any source-bound phase or record check fails.

The combined result may therefore be a technical pass with a non-evaluable
primary effect.

## Exclusions

- SCN, NCS292 and the historical 404 gate;
- E8/H4 and M-Class;
- physical feedback, causality or astronomical prediction;
- physical fourth-axis or spacetime interpretation;
- claims that the gate sequence is a natural law;
- replacement of the missing operators after results are observed.

## Stop rule

One frozen primary execution, one clean replay and the declared signed-offset
sensitivities. Stop after classification. Any future numerical `Pi_Q`, mask or
re-feed operator requires a new source, a new preregistration and an independent
test.
