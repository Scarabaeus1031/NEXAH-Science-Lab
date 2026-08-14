# Replication Protocol

Status: prospective; freeze before execution.  
Hypotheses:

- **H-REP:** across multiple controlled structural families, v0.7 retains the
  same label-free coarse topology across faithful representations more often
  than arbitrary instability would suggest. This study reports rates; it does
  not construct a chance p-value because no defensible random-representation
  population is defined.
- **H-DISC:** matched structural counterfactuals alter at least one frozen
  certificate. Robustness and discrimination are evaluated separately.

## Representation sets

Faithful set (six, including baseline):

- R0 scalar source;
- R1 redundant affine `[x,1.7x-0.4]`;
- R2 nonlinear injective `[x,x³]`;
- R3 one-step delay `[x_t,x_(t-1)]`;
- R4 seeded noise `sigma=1e-5`, `PCG64(8100 + family_index)`;
- R5 factor-two sampling.

Lossy controls are never pooled with faithful results:

- L1 non-injective `x²`;
- L2 factor-four sampling;
- L3 three-level sign projection `sign(x)`.

## Canonical configuration grid

Every cell is retained:

| ID | Clusters | Window | Seed | Normalize |
|---|---:|---:|---:|---|
| C0 | 3 | 6 | 7 | yes |
| C1 | 3 | 4 | 7 | yes |
| C2 | 3 | 10 | 7 | yes |
| C3 | 4 | 6 | 19 | yes |

The grid deliberately includes under/over-resolution relative to some declared
families. No configuration may be selected post hoc.

## Disposition rule

- `ROBUST_AND_DISCRIMINATIVE`: at least one nondefinitional certificate has
  HIGH representation robustness and HIGH structural sensitivity across at
  least six families, with no material configuration dependence.
- `ROBUST_BUT_LOSSY`: coarse support has HIGH robustness but structural
  sensitivity is below HIGH or counterfactual misses are frequent.
- `CONFIGURATION_DEPENDENT`: preservation materially depends on configuration,
  defined prospectively as max-minus-min configuration preservation rate
  `>=0.25`, unless a stronger first rule is already satisfied across all configs.
- `NOT_REPLICATED`: coarse support robustness is LOW.
- otherwise `INCONCLUSIVE`.

No rescue experiment, IEEE escalation or protocol modification is permitted.
