# Check 76 — Cassini / 41 Prime-Triple Decoder Protocol

Date: `2026-10-13`  
Status: `OWNER_AUTHORIZED_BOUNDED_FORMAL_DERIVATION / EXECUTED ONCE / RESULT IN CHECK 77`  
Parent: `EXACT_PARITY_REPARAMETERIZATION` · Check 75  
Identity effect: `EXTENDS EXISTING A0 AND NUMBERMAGICK RECORDS / NO NEW NAVIGATOR IDENTITY OR RELATION`

## Question

Can the Cassini sign channel be decoded into the two observed neighbors of
`41`, and does the prime-index product `P1*P2*P4` participate in an exact
double-path identity that is specific within a declared prime-triple class?

## Frozen definitions

```text
epsilon(n) = F(n+1)F(n-1)-F(n)^2 = (-1)^n
delta(epsilon) = (3*epsilon-1)/2
T(n) = 41 + delta(epsilon(n))
```

Hence the expected channels are:

```text
epsilon=+1 -> delta=+1 -> T=42
epsilon=-1 -> delta=-2 -> T=39
```

Let `P_i` denote the `i`th prime, with `P1=2`. For strictly increasing primes
`a<b<c`, test the double-path equation

```text
abc - 1 = b(ab+c) + a.                 (D)
```

The selected triple is `(a,b,c)=(P1,P2,P4)=(2,3,7)`.

## Gates

1. Cassini sign and the decoder are exact for `n=1..81`.
2. The two outputs are exactly `{39,42}` with odd/even counts `41/40`.
3. `42=P1*P2*P4=2*3*7`.
4. `39=P2*(P1*P2+P4)=3*(6+7)=3*13`.
5. Both paths return the same carrier:
   `42-1=39+2=41`.
6. Equation `(D)` has the unique strictly increasing prime solution
   `(2,3,7)`.
7. The affine decoder is classified as saturated: two target channels fix two
   affine coefficients exactly, so decoder fit alone is not evidence.

## Proof obligation for uniqueness

Equation `(D)` rearranges to

```text
b(ac-ab-c)=a+1.
```

Therefore `b | (a+1)`. Since `a<b` are prime, this forces `a=2,b=3`; inserting
them forces `c=7`. The computational search over the first 100 primes is only
an independent bounded cross-check, not the proof.

## Boundaries and STOP

The formula class was selected after observing the local arithmetic; internal
uniqueness does not establish external significance, causation or a new prime
law. No claim, publication, Navigator admission or Tessarec result change is
authorized.
