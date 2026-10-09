# PRIMEGRID BLOCK 2 — DFT Shift / Phase Address / Return Audit

Date: `2026-10-06`

Status at lock: `PREREGISTERED / NOT YET EXECUTED`

## 1. Upstream frozen contract

This block consumes the passed carrier/address contract from PRIMEGRID Block 1.

```text
Block 1 result SHA-256:
b84eeeaa490d4e8264cb25c67be26c3bb17ce275d2083762fe94070ff2ae75cd

Block 1 decision:
SUPPORTED_AS_BINARY_STATE_LIFT_GENERATOR
```

The Block 1 implementation and result are inputs, not adjustable parameters.

## 2. Question

For a binary field sampled on the eight Q3 addresses, does a cyclic carrier
shift preserve DFT magnitude while placing the shift address in complex phase,
and can the complete complex spectrum return the shifted field exactly?

This block tests the DFT as an alternative coordinate register. It does not
identify that register with physical space or light.

## 3. Frozen development carrier

```text
N = 8
Q3 addresses = 0..7
occupied addresses A = {0,1,3,6}
x[a] = 1 if a in A, else 0
tested cyclic shifts S = {0,1,2,3,4,5,6,7}
```

The field is deliberately aperiodic, so its eight cyclic shifts must be eight
distinct addressed carriers.

## 4. Frozen transform and shift convention

```text
X[k] = sum_n x[n] exp(-2 pi i k n / N)
x[n] = (1/N) sum_k X[k] exp(+2 pi i k n / N)

T_s(x)[n] = x[(n-s) mod N]
DFT(T_s(x))[k] = exp(-2 pi i k s / N) X[k]
```

Shift recovery tests all candidates `s=0..N-1` and chooses the unique candidate
with minimum squared complex-spectrum prediction error. Ties or a wrong minimum
fail closed.

## 5. Registered destructive control

All eight shifted carriers have the same DFT magnitude. A magnitude-only
representation therefore has an eight-way address collision. Any method that
claims to recover the shift from magnitude alone fails this block.

## 6. Structural holdout

The untouched holdout is:

```text
N = 16
occupied addresses = {0,1,2,4,7,9,12,14}
shift = 5
```

The same transform, recovery and inverse routines must pass without a
holdout-specific branch.

## 7. Frozen gates

| Gate | Criterion |
|---|---|
| `G01_UPSTREAM_CONTRACT` | Block 1 result hash and decision match the frozen receipt |
| `G02_DFT_COORDINATE_REGISTER` | inverse DFT returns the base field and Parseval energy agrees |
| `G03_SHIFT_THEOREM` | the complex shift theorem holds for all eight development shifts |
| `G04_MAGNITUDE_COLLISION` | all eight distinct shifted carriers have equal magnitudes |
| `G05_PHASE_ADDRESS_RECOVERY` | complex-spectrum search uniquely recovers every shift |
| `G06_COMPLEX_INVERSE_RETURN` | inverse DFT returns every shifted carrier |
| `G07_MAGNITUDE_ABLATION` | magnitude cannot identify a unique shift address |
| `G08_HOLDOUT_N16` | theorem, phase recovery and inverse return pass for the frozen N16 holdout |
| `G09_REPLAY` | two executions produce byte-identical canonical result records |

## 8. Decision rule

All gates are required for:

```text
SUPPORTED_AS_DFT_SHIFT_PHASE_RETURN_FIXTURE
```

Any dependency, numerical, uniqueness, ablation, holdout or replay failure
yields `INVALID_EXECUTION`.

## 9. Prohibited conclusions

- DFT magnitude identifies carrier position;
- Fourier coordinates are a physical space;
- phase recovery proves optical propagation or a light mechanism;
- the DFT creates additional carrier states;
- passing this block establishes Primegrid coding gain or error correction;
- visual spectral similarity establishes carrier identity.

