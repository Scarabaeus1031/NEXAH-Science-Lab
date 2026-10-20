# Project Scope and Boundaries

## Primary question

> Does a declared `3+1` partition of the ordered prime sequence provide a
> useful typed record for comparing local gaps, transitions and selected
> residue views, after accounting for phase choice and representation-induced
> structure?

## Secondary Builder question

> Can the same bounded record be serialized without losing the distinction
> between value, prime index, local role, representation, provenance and open
> transition?

This Builder question may later inform `.xva` / `.scrb` or a format-neutral
sidecar. No format adoption is authorized in Project 0.1.

## Objects kept distinct

| Object | Type | Boundary |
|---|---|---|
| `p_n` | ordered prime at one-based index `n` | value and index are distinct |
| `G_k` | four-entry local cell under one frozen phase | grouping is declared, not discovered |
| `A,B,C` | first three ordered roles in one cell | different primes, not three views of one object |
| `+1 / Binder` | fourth local role | cut-induced role, not intrinsic prime class |
| internal gap vector | three consecutive differences inside a cell | derived exact arithmetic |
| forward gap | difference from Binder to next prime | retains open continuation |
| representation view | value, index, gap or frozen residue channel | view is not identity |
| OLS mapping | semantic application profile | does not extend OLS primitives |

## Typed convergence around 101

Several existing records meet at the numeral `101`, but they do not perform
the same function:

```text
64/37 selector:
  next_prime(99) = 101
  upper endpoint of 97-99-101 = 101
  64 + P_12 = 64 + 37 = 101

F_50 factor field:
  F_50 = 5^2 * 11 * 101 * 151 * 3001
```

The first three lines are the three frozen routes of the bounded selector
contract. They are arithmetic cross-checks, not independent samples. The
`F_50` line is a separate exact compatibility record: it confirms that 101 is
a factor, but it does not select 101 because 151 is an equal rank-50 factor
candidate. Likewise, `100/2 = 50` explains the index label `F_50`; it supplies
no additional selector.

The existing bubble-boundary demonstrator is also kept separate. Its neutral
state is `50/50`; away from that boundary, a directed residual orients the
record toward one side. This is a useful representation of unresolved versus
oriented state, not a prime-selection rule. The remembered label `L 90/50`
has not been recovered as a frozen operator or formula and therefore remains
`UNRESOLVED_TERM` until its `L`, numerator, denominator and transformation
rule are supplied.

## Relation to the n+1 candidate

The prime-cell grammar is a related application and possible test fixture, but
it is not yet the strict minimum scientific fixture in the n+1 contribution
candidate. Consecutive primes `A`, `B` and `C` are different objects. The n+1
minimum test instead requires three bounded representations of one stable
source object. Project 0.1 must not collapse these two designs.

A later bridge may construct several representations of the same prime cell:

```text
VALUE VIEW + GAP VIEW + RESIDUE VIEW + 1 RELATION RECORD
```

That bridge remains a design question until a schema and matched baseline are
frozen.

## In scope

1. exact finite prime and gap ledger;
2. four matched phase offsets;
3. explicit role typing for repeated values such as 101;
4. finite value, index, gap and predeclared residue views;
5. Binder-rail description as a cut-induced subsequence;
6. null and destruction controls;
7. OLS-semantic mapping without OLS modification;
8. a future serialization fixture, if separately authorized.

## Out of scope

- a prime generator or prime predictor;
- an infinite recurrence or theorem;
- an intrinsic law of every fourth prime;
- proof that 7, 101 or any other number is universally privileged;
- Riemann, physical, cosmological, biological or causal conclusions;
- selection of constants or moduli after inspecting a desired pattern;
- merging Prime Lens, `F_50`, SNCE, CRT/QRT, Fibonacci or Scarab records by
  shared numeric appearance alone;
- amendment of OLS, ILAU, NRRC or Core authority;
- production implementation or public novelty language.

## Claim ceiling

Before execution, the strongest permitted statement is:

> Project 0.1 defines a finite, typed and testable prime-sequence orientation
> profile with explicit phase and representation controls.

It does not yet establish that the profile adds mathematical information
beyond a convenient partition and derived arithmetic.
