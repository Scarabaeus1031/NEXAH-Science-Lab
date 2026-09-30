# Scientific/Builder Contribution Candidate

## Working name

```text
NEXAH n+1 Relational Stack
```

Alternative descriptive label:

```text
Relational Frame Contract with Inspectable Return
```

The descriptive label should be preferred in scientific communication until
the mechanism and benchmark are frozen.

## Formal object

Let the local records or frames be

```text
M_1, M_2, ..., M_n
```

and let a declared relation from `M_i` to `M_j` be

```text
R_ij : M_i -> M_j.
```

The Binder is not `M_(n+1)`. It is a typed contract:

```text
B = (frames, relations, domains, codomains, provenance,
     tolerances, I-L-A-U ledgers, tests, residuals).
```

For a declared cycle `i -> j -> k -> i`, a return residual may be defined as

```text
Delta_i = d(R_ki o R_jk o R_ij, I_i),
```

provided the maps are composable and the discrepancy `d`, identity `I_i` and
tolerance are fixed before observing the result.

`Delta_i = 0` establishes only closure under that contract. It does not prove
truth, physical identity, semantic equivalence or lossless invertibility.

## Why `3+1` is the first complete cell

Two frames allow an inverse or round-trip check. Three frames create the first
independent direct-versus-composed comparison:

```text
R_13  versus  R_23 o R_12.
```

For a connected graph with `n` frame vertices and `m` relation edges, the
cycle-space rank is `m - n + 1`. For a complete frame graph this gives:

| Stack | Pair relations | Independent cycles |
|---|---:|---:|
| `3+1` | 3 | 1 |
| `4+1` | 6 | 3 |
| `5+1` | 10 | 6 |
| `6+1` | 15 | 10 |

The table is a graph-count fact, not evidence that every additional frame
improves a system. Topology, independence, map quality and information bounds
must be declared.

## Optional QCRT/residue layer

For pairwise coprime moduli `p_i`, one record `x` may be represented by

```text
r_i = x mod p_i.
```

The CRT reconstructs `x` only within its declared product range. The prime
ladder

```text
2*3*5 = 30
2*3*5*7 = 210
2*3*5*7*11 = 2310
2*3*5*7*11*13 = 30030
```

is therefore a legitimate address-space construction. It is established
number theory, not a new theorem. Error detection or correction requires
declared redundancy; a Binder alone does not create missing information.

For technical work, distinguish:

```text
k information channels + r redundant channels + 1 Binder/decoder.
```

## Candidate contribution statement

> The proposed contribution is a relation-preserving representation stack in
> which multiple local records remain distinct and an independent Binder makes
> transformation paths, information loss, introduced content, unresolved
> ambiguity, provenance and return residuals jointly machine-readable and
> human-inspectable.

## Scientific value candidate

The candidate may provide a testable method for:

- detecting inconsistent translations between representations;
- localizing which edge or cut introduced a discrepancy;
- distinguishing geometric closure from information preservation;
- comparing direct and mediated readings;
- exposing selection and framing decisions to a human reviewer.

These are hypotheses, not current results.

## Builder value candidate

A practical implementation can use existing containers rather than inventing
an immediate new binary format:

- GLB/glTF or USD for scene geometry and local transforms;
- JSON or a versioned glTF extension for relation records;
- stable IDs for frames, features and correspondence sets;
- explicit Binder records outside cyclic parent-child scene hierarchies;
- deterministic test fixtures and round-trip hashes.

The historical UDF/NXA/SCARAB work contributes useful prototype ideas:
declarative records, deterministic seeds, compact rules, state transitions,
queries, signatures and browser rendering. It does not by itself implement
the present relation contract.

## Mission fit

The candidate directly supports the NEXAH mission when it is used to preserve
human orientation rather than to claim a universal model:

```text
The grid distributes.
The mesh situates.
The Binder makes relations inspectable.
The return tests without erasing the gap.
```

For AI and cultural systems, the intended benefit is that an output remains a
situated representation rather than becoming an unmarked absolute statement.
The Human retains the authority to inspect the selection, cut, translation,
residual and alternatives before deciding.

## Current assessment

| Dimension | Status |
|---|---|
| Mission fit | strong |
| Builder feasibility | plausible |
| Architecture originality | plausible synthesis |
| Scientific utility | testable candidate |
| Scientific novelty | unknown |
| Patent novelty | not searched to claim standard |
| Performance or storage advantage | untested |
| Error correction | not established |
| Production adoption | not authorized |
