# E11-01 — Decimal 11-Elevator Audit

Date frozen: `2026-09-20`

Status: `POST_HOC_EXPLORATORY_SPECIFICITY_AUDIT`

## Question

Do the complete PHX-01 cycle-phase records contain a specific excess of the
predeclared decimal `11` structure, rather than isolated examples selected
from rounded summaries?

The hypothesis was formulated after observing values including `4.88` and
relations such as `77 + 11 = 88`. Therefore this audit cannot be confirmatory.

## Source and independent units

Source: PHX-01 `03_CYCLE_PHASE_RECORDS.csv`, SHA-256
`907ec0ef4bcde56c53ab39a656a78a4c12bbc6d343dc20732115762f28aa373a`.

Two corpora are registered:

1. `ABS_PHASE_72`: all 72 non-overlapping cycle phase estimates. Eight ordered
   series are defined by condition, cut and actuator.
2. `KAPPA_CYCLE_36`: 36 derived `B - A` phase differences matched by condition,
   actuator and ordinal cycle. Four ordered series are defined by condition and
   actuator. These are derived contrasts, not additional independent raw runs.

No KAPPA-02 overlapping local windows enter the primary audit.

## Primary decimal encoding

Use degrees, preserve the sign, and apply decimal `ROUND_HALF_UP` at
`q = 0.01 degree`:

```text
N2(x) = integer ROUND_HALF_UP(x / 0.01 degree)
B2(x) = abs(N2(x)) mod 100
M11 = {00,11,22,33,44,55,66,77,88,99}
```

The physical value, signed quantized integer and two-digit block remain
separate typed fields. A block hit is not a physical invariant.

## Frozen statistics

### S1 — station enrichment

Count records with `B2 in M11`. The representation-null preserves all measured
values and shifts the decimal origin through all 100 centidegree offsets:

```text
B2_r = abs(N2 + r) mod 100, r = 0..99
p_shift = fraction of offsets whose hit count is at least the observed r=0 count
```

This tests whether the chosen zero-origin is unusually aligned with the 11-grid.

### S2 — directed elevator transitions

Within each ordered series, define consecutive signed steps:

```text
Delta2(t) = N2(t+1) - N2(t)
```

The target is `Delta2 = +11`, corresponding to `+0.11 degree`. Janus control is
`-11`. Prespecified comparison steps are `+10`, `+12`, `+17`, `-10`, `-12` and
`-17`.

### S3 — local step-spectrum specificity

Count `abs(Delta2) = m` for every integer magnitude `m = 1..25`. The empirical
rank probability for magnitude 11 is:

```text
p_step_rank = (1 + number of other magnitudes with count >= count_11) / 25
```

The target must exceed each prespecified comparison magnitude 10, 12 and 17 to
be called 11-specific.

### S4 — rounding sensitivity

Run 20,000 deterministic-seed dither replicates. Add independent uniform noise
in `[-0.005, +0.005)` degree to every carrier, requantize and report the
distribution of station and transition counts. Seed: `20260920`.

Also quantize at `0.001 degree`. The same physical elevator step is represented
as `Delta3 = +110`; the two-decimal block rule itself is not silently redefined
as a 0.011-degree effect.

## Multiplicity and decision rule

Apply Holm correction to the four primary corpus/statistic probabilities:
two station `p_shift` values and two `p_step_rank` values.

`E11_SPECIFIC_ENRICHMENT` requires, within at least one corpus:

1. Holm-adjusted station probability `<= 0.05`;
2. Holm-adjusted step-rank probability `<= 0.05`;
3. magnitude-11 count greater than magnitudes 10, 12 and 17;
4. directed `+11` count greater than `-11`;
5. the signal is not created solely by two-decimal rounding, as assessed by
   the dither and three-decimal physical-step sensitivity outputs.

If only some conditions pass, classify `PARTIAL_E11_PATTERN_NOT_CONFIRMATORY`.
If none pass, classify `NO_SPECIFIC_E11_ENRICHMENT`.

## Claim boundary

This audit can evaluate decimal-code specificity in the existing data. It
cannot establish that 11 causes the phase behavior, that decimal notation is
physically privileged, or that an octave, morphogenesis or synchronization
mechanism has been demonstrated.

