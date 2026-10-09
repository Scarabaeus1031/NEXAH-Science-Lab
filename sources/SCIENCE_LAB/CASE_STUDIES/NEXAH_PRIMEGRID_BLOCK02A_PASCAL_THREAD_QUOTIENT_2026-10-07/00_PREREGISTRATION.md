# PRIMEGRID BLOCK 2A — Pascal Thread / Weight Quotient Audit

Date: `2026-10-07`

Status at lock: `PREREGISTERED / NOT YET EXECUTED`

## 1. Upstream contracts

```text
Block 1 result SHA-256:
b84eeeaa490d4e8264cb25c67be26c3bb17ce275d2083762fe94070ff2ae75cd

Block 2 result SHA-256:
31eadccd49936554ad458f3da27faf92dc055806d53a44118c11610960eb0468
```

Both upstream decisions must remain passed. Their implementations and results
are inputs, not adjustable parameters.

## 2. Question

Does Hamming-weight projection map the exact binary carriers `Q_n={0,1}^n`
onto Pascal row `n` with multiplicities `C(n,k)`, and what do the observed
counts `56` and `11x11=121` preserve or discard?

## 3. Frozen projection

```text
w(x) = sum_i x_i
pi_n : Q_n -> {0,...,n}
pi_n(x) = w(x)
```

Expected fiber multiplicity:

```text
|pi_n^-1(k)| = C(n,k)
sum_k C(n,k) = 2^n
```

The quotient is lossy whenever `C(n,k)>1`. Exact reconstruction is permitted
only when the weight node is accompanied by a within-fiber ordinal address.

## 4. Frozen thread multiplicity

Every Q_n edge changes weight by exactly one. The number of directed upward
edges from weight `k` to weight `k+1` is

```text
C(n,k) * (n-k) = C(n,k+1) * (k+1).
```

This is the exact bounded meaning of a Pascal thread in this block.

## 5. Registered 56 collision

Two separately typed sets have equal cardinality:

```text
DFT channel cells = {(s,nu): s=1..7, nu=0..7}  -> 7*8 = 56
Pascal weight-3 fiber in Q8                         -> C(8,3) = 56
Pascal weight-5 fiber in Q8                         -> C(8,5) = 56
```

Equal cardinality must be recorded as a count bridge only. No canonical
operator or identity between DFT cells and Q8 states is supplied.

## 6. Registered 11x11 / 121 boundary

In Q11:

```text
W1  = states of weight 1   -> 11 states
W10 = states of weight 10  -> 11 states
W1 x W10                   -> 121 ordered pairs
```

Bitwise complement gives only 11 matched pairs; the other 110 pairs are not
complements. Separately, the base-b numeral identity

```text
[121]_b = b^2 + 2b + 1 = (b+1)^2
```

gives `[121]_10=11^2=121`. Pascal row 11 has 12 nodes, total multiplicity
2048, and contains no coefficient 121. These registers must not be identified.

## 7. Frozen range

Pascal recurrence, carrier fibers, row sums and thread counts are tested for
all rows `n=0..11`. Q11 is the declared upper holdout surface.

## 8. Frozen gates

| Gate | Criterion |
|---|---|
| `G01_UPSTREAM_CONTRACTS` | Block 1 and Block 2 hashes and decisions match |
| `G02_PASCAL_RECURRENCE` | rows 0..11 satisfy boundary values and Pascal addition |
| `G03_WEIGHT_MULTIPLICITIES` | Q_n weight histograms equal `C(n,k)` for n=0..11 |
| `G04_ROW_SUM_STATE_COUNT` | every row sum equals `2^n` |
| `G05_THREAD_MULTIPLICITIES` | inter-weight Q_n edge counts satisfy both exact formulas |
| `G06_QUOTIENT_BOUNDARY` | projection collisions occur and `(weight,ordinal)` restores every state |
| `G07_KAPPA56_COUNT_BRIDGE` | `7*8=C(8,3)=C(8,5)=56`, recorded as non-identity |
| `G08_ELEVEN_BY_ELEVEN_BOUNDARY` | W1/W10 counts, 121 product, 11 complements, 110 residuals and register distinctions pass |
| `G09_REPLAY` | two executions produce byte-identical canonical result records |

## 9. Decision rule

All gates are required for:

```text
SUPPORTED_AS_PASCAL_WEIGHT_QUOTIENT_WITH_COUNT_BOUNDARIES
```

Any dependency, recurrence, multiplicity, reconstruction, count-boundary or
replay failure yields `INVALID_EXECUTION`.

## 10. Prohibited conclusions

- Pascal nodes and Q_n states are identical;
- equal count 56 proves a Kappa/DFT/Pascal operator identity;
- 121 is a coefficient or total of Pascal row 11;
- all 121 W1xW10 pairs are complement bridges;
- the quotient retains state address without residual information;
- the arithmetic establishes a physical thread, resonance or coding gain.

