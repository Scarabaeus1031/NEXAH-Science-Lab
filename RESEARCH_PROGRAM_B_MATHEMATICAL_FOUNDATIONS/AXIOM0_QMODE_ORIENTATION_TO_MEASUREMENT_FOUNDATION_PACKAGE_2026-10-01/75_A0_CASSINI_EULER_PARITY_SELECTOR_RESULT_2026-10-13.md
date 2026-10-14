# Check 75 — Cassini / Euler Parity-Selector Result

Date: `2026-10-13`  
Study: `A0_CASSINI_EULER_PARITY_SELECTOR_2026_10_13`  
Run: `A0_CASSINI_EULER_PARITY_SELECTOR_RUN_001`  
Status: `VALIDATED_BOUNDED_FORMAL_RESULT / STOP REACHED / AWAITING_OWNER_DISPOSITION`

## Result

```text
EXACT_PARITY_REPARAMETERIZATION
```

Cassini does provide the exact alternating operator required to select the
two Euler-41 channels:

```text
C(n) = F(n+1)F(n-1) - F(n)^2 = (-1)^n
S(n) = n^2 + C(n)n + 41
```

But the parity-only control reproduces every output exactly. In this
construction, Fibonacci contributes the Cassini sign and no further
recurrence-state information.

## Exact reduction

For even and odd inputs:

```text
S(2k)   = E+(2k)
S(2k+1) = E-(2k+1) = E+(2k)
```

Therefore:

```text
S(2k) = S(2k+1) = 4k^2 + 2k + 41.
```

The two-channel selector folds adjacent inputs into one output. Across
`n=1..81`, 81 rows reduce to 41 unique values: the initial `41`, followed by
40 duplicated values from the even-index `E+` subsequence.

## What this gives us

- a clean machine operator: Cassini sign `{-1,+1}` selects `E-` or `E+`;
- an exact handoff: `E-(n)=E+(n-1)`;
- an exact pair-fold / quotient map from adjacent indices to one Euler value;
- a strong control result showing precisely which Fibonacci information
  survives the projection.

## What it does not give us

- no new Fibonacci–Euler theorem;
- no new prime generator;
- no evidence that Fibonacci magnitudes drive the Euler values;
- no change to the negative Euler/Tessarec spectral result in Check 71;
- no new Science Navigator identity or relation.

The first composite occurs at the folded pair `n=40,41`:

```text
S(40)=S(41)=1681=41^2.
```

Within the bounded domain there are 73 prime rows but only 37 unique prime
values. The row count is inflated by exact duplication and is not a prime
success metric.

## Operator reading

The useful abstraction is:

```text
Fibonacci recurrence
  -> Cassini determinant/sign
  -> binary channel selector
  -> Euler +/- branch
  -> adjacent-index fold
```

This is operationally useful because it exposes both the selector and its
information loss. It should be carried forward as a typed operator chain, not
as a claim of hidden numerical causation.

## Integrity and STOP

- exact integer domain: `n=1..81`;
- Cassini/parity equality: `PASS`;
- parity-control replacement: `PASS`;
- Euler branch and shift identities: `PASS`;
- 40 pair-fold identities: `PASS`;
- result ledger validator: `PASS`;
- claim promotion: `NOT AUTHORIZED`;
- Navigator activation: `NOT PERFORMED`;
- execution stopped for Owner disposition.

## Next logical experiment

If continued, the next test should preserve more than the Cassini sign. A
meaningful successor would compare a genuinely state-bearing Fibonacci
operator—such as the ordered pair `(F(n),F(n+1))` reduced by a declared finite
modulus—with the parity-only baseline. That successor is not authorized or
executed here.
