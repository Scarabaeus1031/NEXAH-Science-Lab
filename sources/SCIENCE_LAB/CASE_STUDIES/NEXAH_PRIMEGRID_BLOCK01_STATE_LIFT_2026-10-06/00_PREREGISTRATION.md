# PRIMEGRID BLOCK 1 — Binary State-Lift / Address Audit

Date: `2026-10-06`

Status at lock: `PREREGISTERED / NOT YET EXECUTED`

## 1. Question

Can a fresh finite generator build the binary carrier ladder

```text
Q1 -> Q2 -> Q3 -> Q4 -> Q5
 2     4     8    16    32 states
```

while keeping state, address, adjacency, lift, projection and traversal
separate and exactly reversible where declared?

This block tests the carrier grammar only. It does not test Fourier shift,
prime anchoring, error correction, light propagation or a physical field.

## 2. Frozen carrier

For dimension `n >= 1`:

```text
Q_n = {0,1}^n
address(b_0,...,b_{n-1}) = sum(b_i * 2^(n-1-i))
edge(u,v) iff HammingDistance(u,v) = 1
```

Expected exact counts:

```text
|V(Q_n)| = 2^n
|E(Q_n)| = n * 2^(n-1)
degree(v) = n for every v
```

## 3. Frozen operators

1. `encode(state)` maps one binary tuple to its integer address.
2. `decode(address,n)` returns exactly one `n`-bit tuple.
3. `lift(state,bit)` appends one new independent binary coordinate.
4. `project(child)` removes the final coordinate.
5. `gray(i) = i xor (i >> 1)` defines the traversal order.
6. parity is `sum(bits) mod 2` and must bipartition every edge.

No prime-number rule is permitted as an input to this block.

## 4. Development range and holdout

The declared development ladder is `n=1..5`. The untouched structural
holdout is `n=8` (`256` states). The same implementation must satisfy the
count, degree, address and Gray-cycle checks at `n=8` without a separate
special case.

## 5. Frozen gates

| Gate | Criterion |
|---|---|
| `G01_STATE_COUNTS` | `Q1..Q5` contain exactly `2,4,8,16,32` states |
| `G02_EDGE_COUNTS` | every `Q_n` has `n*2^(n-1)` undirected edges |
| `G03_ADDRESS_BIJECTION` | encode/decode is one-to-one, onto and round-trips |
| `G04_LIFT_PARTITION` | `Q_(n+1)` is two disjoint `Q_n` layers plus exactly `2^n` bridge edges |
| `G05_PROJECTION_FIBERS` | dropping the new bit is exactly two-to-one and lift/project returns |
| `G06_LOCAL_GEOMETRY` | all vertices have degree `n`; every edge crosses parity |
| `G07_GRAY_CYCLE` | Gray traversal visits every state once and each consecutive pair, including closure, differs by one bit |
| `G08_HOLDOUT_Q8` | all count, degree, address and Gray-cycle checks pass at `n=8` |
| `G09_REPLAY` | two executions produce byte-identical canonical result records |

## 6. Decision rule

All gates are required for:

```text
SUPPORTED_AS_BINARY_STATE_LIFT_GENERATOR
```

Any failed arithmetic, adjacency, lift, holdout or replay gate yields
`INVALID_EXECUTION`.

## 7. Prohibited conclusions

- two states alone imply eight states without three independent coordinates;
- a bit address is a physical position;
- a hypercube drawing is the carrier itself;
- the passing carrier generator is already a Fourier or Primegrid code;
- prime placement, optical propagation, QR decoding or error correction has
  been validated by this block;
- exponential state count alone demonstrates emergence, intelligence or a
  physical higher dimension.

