# Check 81 — MOD2501 CRT Two-Channel Operator Protocol

Date: `2026-10-13`  
Status: `OWNER_AUTHORIZED BOUNDED ENGINEERING PROTOCOL / EXECUTED ONCE / RESULT IN CHECK 82`  
Parent: Check 80 · `A0_T64_137_TO_8_RING_CROSSCHECK_2026_10_13`  
Identity effect: `EXTENDS LOCAL A0 OPERATOR INSTANCES / REUSES OP_MODULO AND OP_CONGRUENCE / NO NAVIGATOR OR ORION REGISTRY CHANGE`

## Question

Can modulo arithmetic be represented as a typed operator system rather than a
collection of number motifs; and does a two-channel CRT split, channelwise
action and bind commute exactly for the established multiplier `64` on both
`Z_365` and `Z_2501`?

## Carrier/operator distinction

`2501` is frozen as a carrier modulus, not as an operator:

```text
Z_2501 ~= Z_41 x Z_61,  because 2501=41*61.
```

The operator classes under test are:

```text
REDUCE_m(x)       = x mod m
TRANSLATE_b,m(x)  = x+b mod m
MULTIPLY_a,m(x)   = a*x mod m
MIRROR_m(x)       = -x mod m
CRT_SPLIT_p,q(x)  = (x mod p, x mod q)
CRT_BIND_p,q(r,s) = the unique c mod p*q with c=r mod p and c=s mod q
CRT_SHELL_M(n,c)  = (n-c)/M when n=c mod M
```

`CRT_BIND` is admitted only for pairwise-coprime channel moduli in this
protocol. A non-coprime declaration must fail closed.

## Frozen systems

### Comparison carrier

```text
M=365=5*73
a=64
seed=137
```

### Primary carrier

```text
M=2501=41*61
a=64
seed=137
```

### Controls on `Z_2501`

```text
MULTIPLY_41,2501  nonunit collapse control
MULTIPLY_61,2501  nonunit collapse control
MIRROR_2501       involution control
TRANSLATE_100,2501 Portalstone-step control
```

### Visual-template fixture

The supplied four-view visual is used only as a formal template fixture:

```text
m1=131, m2=83, M=10873, n=13183
r1=83, r2=69, c=2310, u=1
n=M*u+c.
```

Colors, ellipses and spatial placement are representation annotations, not
operator semantics or mathematical evidence.

## Gates

1. Verify both factorizations and exhaustive CRT split/bind reconstruction.
2. Verify the commuting square for every state on both carriers:

   ```text
   CRT_SPLIT(MULTIPLY_64(n))
     = CHANNEL_MULTIPLY_64(CRT_SPLIT(n)).
   ```

3. Verify that the same seed is carrier-dependent:
   `137 -> 8` on `Z_365`, but `137 -> 1265` on `Z_2501`.
4. Verify inverse, order and complete cycle census of `MULTIPLY_64` on both
   carriers.
5. Verify kernel and image sizes for the nonunit controls `41` and `61`.
6. Verify the full-cycle translation and mirror census on `Z_2501`.
7. Replay the visual-template CRT ledger exactly.
8. Reject non-coprime CRT channel declarations.
9. Validate unique class and instance IDs in the local A0 registry.

## Claim boundary

- A commuting CRT diagram establishes an exact representation equivalence for
  the declared finite rings; it does not establish physical coupling.
- A color pair is not an operator pair until domain, codomain and rules exist.
- Different outputs for the same multiplier and seed demonstrate carrier
  dependence; they do not privilege either modulus.
- The registry is a local, source-bound A0 engineering inventory. It is not a
  canonical Numbermagick theory, an ORION executable registry, a Navigator
  identity, a research activation or a publication.

