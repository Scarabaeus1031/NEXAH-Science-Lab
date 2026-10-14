# Check 74 — Cassini / Euler Parity-Selector Protocol

Date: `2026-10-13`  
Status: `OWNER_AUTHORIZED_BOUNDED_FORMAL_TEST / EXECUTED ONCE / RESULT IN CHECK 75`  
Identity effect: `REUSES EXISTING SOURCE FAMILIES / NO NEW NAVIGATOR IDENTITY OR RELATION`

## Question

Does the Cassini residual

```text
C(n) = F(n+1)F(n-1) - F(n)^2 = (-1)^n
```

provide a nontrivial Fibonacci coupling when it selects between the two
Euler-41 branches

```text
E+(n) = n^2 + n + 41
E-(n) = n^2 - n + 41,
```

or does it reduce exactly to a parity-controlled reparameterization?

## Frozen definitions

- Fibonacci convention: `F(0)=0`, `F(1)=1`,
  `F(n+1)=F(n)+F(n-1)`.
- Domain: integer `n=1..81`.
- Cassini selector: `C(n)=F(n+1)F(n-1)-F(n)^2`.
- Selected output: `S(n)=n^2+C(n)n+41`.
- Parity control: `P(n)=(-1)^n` and
  `S_parity(n)=n^2+P(n)n+41`.
- Shift control: `E-(n)=E+(n-1)`.
- All recurrence and identity checks use exact integer arithmetic.
- Primality is descriptive only and is checked by exact trial division over
  the bounded output range.

## Frozen gates

The test passes only if all of the following hold across the declared domain:

1. `C(n)=(-1)^n`.
2. `S(n)=S_parity(n)`.
3. even `n` selects `E+(n)` and odd `n` selects `E-(n)`.
4. for every `k=1..40`, `S(2k)=S(2k+1)=E+(2k)`.
5. the 81-row output has exactly 41 unique values.
6. the first composite is reported without treating prime production as a
   success gate.

## Interpretation rule

If the parity control is identical to the Cassini selector, the result must be
recorded as:

```text
EXACT_PARITY_REPARAMETERIZATION
```

This means that Cassini supplies a valid two-channel operator, while the
selected output uses only its sign bit and discards Fibonacci magnitude and
recurrence-state information. It is not evidence for a deeper
Fibonacci–Euler generator.

## Boundaries and STOP

```text
NEW_THEOREM                         NO
NEW_PRIME_GENERATOR_CLAIM           NO
PHYSICAL_INTERPRETATION             NO
TESSAREC_SPECTRAL_RESULT_CHANGED    NO
SCIENCE_NAVIGATOR_ACTIVATION        NO
PUBLICATION                         NO
```

The test emits one machine-readable result ledger and one independent
validator, then stops for Owner disposition.
