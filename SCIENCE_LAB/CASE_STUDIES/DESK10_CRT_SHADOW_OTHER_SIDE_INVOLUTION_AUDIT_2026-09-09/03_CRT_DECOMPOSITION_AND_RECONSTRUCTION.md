# CRT decomposition and reconstruction

## Register A: 31 × 1000

`31000=31*1000` and `gcd(31,1000)=1`. The canonical map is

`Phi(x)=(x mod31, x mod1000)`.

```text
Phi(11357) = (11,357)
Phi(19643) = (20,643)
11+20 = 31 = 0 mod31
357+643 = 1000 = 0 mod1000
```

Because `1000=8 mod31` and `8^{-1}=4 mod31`, reconstruct `(a,b)` by

`x = b + 1000 * (((a-b)*4) mod31) mod31000`.

- `(11,357)`: correction index `11`; reconstruction `357+11000=11357`.
- `(20,643)`: correction index `19`; reconstruction `643+19000=19643`.

For every residue, CRT is a group isomorphism, so `Phi(S_N(x))=(-x mod31,-x mod1000)`. The exhaustive run confirms zero commutation failures.

## Register B: 8 × 125 × 31

`31000=2^3*5^3*31=8*125*31`. The moduli are pairwise coprime. Selected tuples:

```text
11357 -> (5,107,11)
19643 -> (3,18,20)
component sums -> (8,125,31) -> (0,0,0)
```

A canonical idempotent reconstruction is

`x = r8*(3875*3) + r125*(248*62) + r31*(1000*4) mod31000`.

It returns 11357 and 19643 respectively. Registers A and B therefore encode the same class modulo 31000 at different prime-power granularity.

`3 + 1000` is not a CRT factorization. In the absence of a source-defined operator it is typed only as `DECIMAL_OR_LEXICAL_ANNOTATION`.
