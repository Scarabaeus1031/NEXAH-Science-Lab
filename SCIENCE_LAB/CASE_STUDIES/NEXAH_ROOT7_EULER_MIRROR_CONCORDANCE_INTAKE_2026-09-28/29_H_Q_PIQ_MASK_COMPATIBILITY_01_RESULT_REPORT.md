# H_Q_PIQ_MASK_COMPATIBILITY_01 result report

Date: `2026-09-29`

## Result

```text
PASS_SOURCE_BOUND_PIQ_MASK_COMPATIBILITY__MASK_EFFECT_EVALUABLE
```

All `10/10` preregistered checks passed. The primary output and both required
replays are byte-identical.

This closes a real interface that was still missing after `H_Q_RECORD_01`:

```text
Five-H keyed phase record
  -> typed five-angle adapter
  -> unchanged Double-Cut-0.2 Pi_Q projection
  -> unchanged Double-Cut-0.2 mask classifier.
```

It does not yet close a re-feed loop.

## Exact mask result

The unchanged source mask has horizontal bounds

```text
left = 272.24 px
right = 391.76 px.
```

The eight projected gates split as follows:

| Gate | x | y | Zone | Full trace | No full trace |
|---:|---:|---:|---|---|---|
| 3 h | 516.321485 | 166.353501 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |
| 6 h | 454.831491 | 158.638885 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |
| 9 h | 393.294656 | 152.025117 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |
| 12 h | 367.234521 | 146.960539 | inside | GENERATED_MASKED_RECOVERABLE | UNKNOWN |
| 24 h | 534.537929 | 169.415140 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |
| 36 h | 358.115326 | 141.666837 | inside | GENERATED_MASKED_RECOVERABLE | UNKNOWN |
| 42 h | 441.182740 | 137.356506 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |
| 48 h | 524.098410 | 164.107154 | outside | GENERATED_UNMASKED | GENERATED_UNMASKED |

Therefore the Full-Trace condition has an evaluable effect on exactly two
frozen points: `12 h` and `36 h`. Disabling Full Trace changes only their class
from `GENERATED_MASKED_RECOVERABLE` to `UNKNOWN`. It changes neither their
coordinates nor the mask geometry. The other six points remain unmasked.

The `9 h` point is outside, even though it is close to the right mask edge:
its x-coordinate is approximately `1.535 px` beyond the edge and therefore
outside the frozen `0.75 px` boundary tolerance. No post-result threshold was
changed.

## What was established

1. The Five-H record is accepted by an independently older executable
   projection contract without changing that contract.
2. All five clock identities and all forty source-cell keys remain attached as
   provenance to the eight projected records.
3. Input order is irrelevant after keyed reconstruction.
4. The fixed mask gives complete, exclusive classification: two inside, six
   outside and zero boundary cases.
5. The positive `+1/8`-turn control moves every projected gate; the maximum
   displacement is `186.963005947719 px`. The interface is therefore sensitive
   to changed phase input rather than emitting a constant display.
6. Classification does not mutate the source Five-H record.

## What is genuinely new here

This is a new verified application inside the NEXAH portfolio: the previously
separate Five-H phase ledger and Double-Cut mask instrument now share a tested,
typed interface. It reduces two previously parallel themes to one executable
chain: **record -> projection -> visibility class**.

The novelty is architectural and operational, not a new number-theoretic or
physical law. The result does not validate a special role for 12 or 36 beyond
this frozen operator and mask. It also does not connect this chain to the
Prime/101/404/808 family.

## Information loss remains explicit

The source record has five phase coordinates; the projection has two spatial
coordinates. No inverse decoder exists. The projected point alone is therefore

```text
NON_INVERTIBLE_WITHOUT_DECLARED_DECODER.
```

The retained source keys make the record auditable, but they do not make the
2D projection mathematically invertible. Thread Loom 0.4 remains an independent
boundary control: distinct sources may share a projection while retaining
separate identities.

## Portfolio effect

The overview becomes smaller, not larger:

```text
Five-H / Q° timing record
        +
Double-Cut Pi_Q / mask
        =
one source-bound observation pipeline.
```

The themes that remain separate are also clearer:

- `Re-feed / Return` is still a label until a state-update operator is sourced;
- Prime/101/404/808 and SCN/NCS remain arithmetic/operator investigations, not
  consequences of this projection;
- E8/H4 and M-Class remain separate higher-dimensional comparison programs;
- visual proximity is not source identity.

## Leadership decision for the next step

Do not tune the mask and do not test feedback benefit yet. The next controlled
step is `H_Q_STATE_UPDATE_SOURCE_AUDIT_01`:

1. inspect the Common Runtime Adapter, Closure Transit and related HTML/model
   sources for an executable transformation from a classified record back to a
   next state;
2. require an explicit state type, update equation, timing rule and invariant;
3. distinguish a binder or replay receipt from a dynamical update;
4. if no such operator exists, record `STATE_UPDATE_OPERATOR_ABSENT` and stop;
5. only if an independently pre-existing operator is found, preregister a
   re-feed comparison against a no-re-feed control.

This prevents the visually suggested return arrow from being promoted into a
feedback mechanism without a defined operation.

## Reproducibility

- preregistration: `28_H_Q_PIQ_MASK_COMPATIBILITY_01_PREREGISTRATION.md`
- lock: `H_Q_PIQ_MASK_COMPATIBILITY_01_PREREGISTRATION_LOCK.json`
- runner: `run_h_q_piq_mask_compatibility_01.js`
- execution log: `H_Q_PIQ_MASK_COMPATIBILITY_01_EXECUTION_LOG.md`
- machine result: `h_q_piq_mask_compatibility_01_results.json`

Machine-result SHA-256:

```text
226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc
```

## Claim boundary

Source-bound Five-H-to-Pi_Q projection and mask compatibility only. No re-feed
benefit, decoder, measured astronomy, causal feedback, SCN/NCS292/404, E8/H4
or M-Class claim follows from this result.
