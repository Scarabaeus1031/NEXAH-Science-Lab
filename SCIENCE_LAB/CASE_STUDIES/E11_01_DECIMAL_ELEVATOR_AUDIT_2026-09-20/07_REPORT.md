# E11-01 — Result report

## Status

`COMPLETE — POST_HOC_EXPLORATORY_SPECIFICITY_AUDIT`

Classification: `PARTIAL_E11_PATTERN_NOT_CONFIRMATORY`

## Main finding

The PHX data contain genuine two-digit 11-family blocks and three exact
centidegree transitions of magnitude 11. They do not show a population-level,
11-specific enrichment under the frozen tests.

| Corpus | Records | 11-station hits | Origin-shift p | +11 transitions | -11 transitions | |11| transitions | Step-rank p | Holm-adjusted primary p values |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Absolute cycle phase | 72 | 7 (9.72%) | 0.63 | 0 | 2 | 2 | 0.36 | 1.00, 1.00 |
| Cycle Kappa, B − A | 36 | 5 (13.89%) | 0.28 | 1 | 0 | 1 | 0.48 | 1.00, 1.00 |

The absolute-phase station rate is almost exactly the 10% rate expected when
10 of 100 two-digit blocks are designated as 11-family stations. The Kappa
rate is higher at 13.89%, but the chosen decimal origin is not unusual compared
with the 99 shifted origins.

## The observed 11-family values

The absolute-cycle corpus contains blocks `00`, `11`, `22`, `33`, `44` and
`66`. Examples include:

- `4.439412... deg -> 4.44 -> block 44`;
- `5.218997... deg -> 5.22 -> block 22`;
- `5.111924... deg -> 5.11 -> block 11`.

The Kappa corpus contains blocks `00`, `44`, `55` and `66`. Examples include:

- `-0.442843... deg -> -0.44 -> block 44`;
- `-0.550100... deg -> -0.55 -> block 55`.

These are valid decimal-code observations. The offset-null shows that their
combined count is not special to the unshifted decimal origin.

## Elevator transitions

Three cycle-to-cycle transitions round to a magnitude of 11 centidegrees:

1. absolute phase: `5.565439... -> 5.460184... deg`, raw change
   `-0.105255 deg`, encoded as `-11` centidegrees;
2. absolute phase: `5.644766... -> 5.528699... deg`, raw change
   `-0.116067 deg`, encoded as `-11` centidegrees;
3. cycle Kappa: `-0.397749... -> -0.293049... deg`, raw change
   `+0.104700 deg`, encoded as `+11` centidegrees.

The Kappa transition has the proposed direction toward zero. It is one event
among 32 Kappa transitions. Magnitude 10 occurs twice, magnitude 12 once and
magnitude 17 zero times. Therefore magnitude 11 neither exceeds all frozen
comparators nor forms a peak in the local step spectrum.

In the 64 absolute-phase transitions, the proposed `+11` direction never
occurs. Both magnitude-11 events are `-11`. This matches the general downward
phase trend and does not isolate an 11 mechanism.

## Rounding sensitivity

Uniform half-quantum dither leaves the observed counts inside ordinary null
ranges:

- absolute station count 7; dither 95% interval 5 to 9;
- Kappa station count 5; dither 95% interval 3 to 7;
- absolute magnitude-11 count 2; dither 95% interval 0 to 3;
- Kappa magnitude-11 count 1; dither 95% interval 0 to 2.

At three decimal places, none of the transitions is exactly `+110` or `-110`
millidegrees. The three raw changes are near 0.11 degree, but their exact 11
labels are products of the declared two-decimal quantization.

## Where 4.88 belongs

Values near `4.88 deg` occur in KAPPA-02's one-cycle, one-eighth-cycle-step
local windows, including `4.888179...`, `4.885785...` and `4.886636...`.
Those windows overlap strongly and are not independent observations. The
frozen primary test therefore used the complete non-overlapping PHX cycle
estimates rather than counting each local 4.88 window as separate evidence.

The closest primary cycle value to 4.88 is `4.855250... deg`, which rounds to
`4.86`, not `4.88`.

## Interpretation

The 11-Elevator is useful as a typed descriptive code:

```text
continuous phase -> declared 0.01-degree quantizer -> two-digit block -> 11-family label
```

It is not supported here as a privileged physical structure. The partial
classification records one directed `+11` Kappa transition and several valid
station examples, while explicitly rejecting confirmatory or causal claims.

## Next valid test

Keep the same frozen encoding and apply it once to independent KAPPA-01 runs.
The prospective target should be the rate of `+0.11-degree` Kappa transitions
relative to the already frozen `+0.10`, `+0.12`, `+0.17` and `-0.11` controls.
No target, precision or carrier should be changed after seeing those new data.

