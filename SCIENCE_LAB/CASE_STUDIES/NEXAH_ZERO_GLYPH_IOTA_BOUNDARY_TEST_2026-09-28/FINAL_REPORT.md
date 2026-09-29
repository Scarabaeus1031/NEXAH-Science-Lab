# NEXAH Zero/Glyph/Iota Boundary Test — final report

Date: `2026-09-28`

## Decision

```text
REVIEWED DESIGN: LOCKED BEFORE IMPLEMENTATION
PREREGISTRATION SHA-256: 071e6c2f8a0adef634c346139e1543c6bb06a3ecd588ec45d3700c1bbc702956
EXECUTED: YES
CLEAN REPLAY: YES
REPLAY IDENTICAL: YES
PRIMARY SCIENTIFIC HASH: b11b52e3c7c4fc8432607364feb211d5f6965d900fb49ff6ee0cf9e81daa86a5
REPLAY SCIENTIFIC HASH: b11b52e3c7c4fc8432607364feb211d5f6965d900fb49ff6ee0cf9e81daa86a5
OVERALL STATUS: SUPPORTED_AS_TYPED_REPRESENTATION_GRAMMAR
```

## Results

### T1 — positional rollover: PASS

All `60/60` frozen cases across bases `2..16` and widths `1..4` passed.
`b^k-1 -> b^k` is a general positional-domain rollover. In decimal,
`99 -> 100` is exactly the `b=10,k=2` instance.

### T2 — decimal/Roman transport: PASS

All integers `1..3999` round-tripped through the frozen Roman encoder and
decoder. The registered examples are:

```text
99  <-> XCIX
100 <-> C
```

Numerical value is preserved. Decimal digit width is not representation
invariant, so `C` is a representation change, not a new numerical value.

### T3 — Unicode state separation: PASS

`0`, `o` and `°` remained distinct under NFC, NFD, NFKC and NFKD. None of the
other tested glyphs normalized to digit zero.

The six forms `ö ô ò ó õ ō` decomposed under NFD into base `o` plus combining
mark. `ø` and `œ` did not decompose under the tested Unicode database and must
not be treated as ordinary diacritic states. `º` compatibility-normalized to
`o`; `˚` compatibility-decomposed to space plus combining ring. These are
typed Unicode relations, not common numerical identity.

### T4 — `6/9` half-turn morphology: FONT-DEPENDENT

| Font | IoU after rotating `6` by 180° | Class |
|---|---:|---|
| Menlo | 0.916624 | STRONG |
| Helvetica | 0.891949 | PARTIAL |
| Avenir | 0.908234 | STRONG |
| Times New Roman | 0.901981 | STRONG |
| Courier New | 0.838838 | PARTIAL |

The preregistered all-font requirement failed. `6↔9` is a useful orientation
mnemonic in some fonts but not a font-independent operator.

### T5 — angular information of the ring: PASS

The ideal unmarked ring had one state under `C4` rotation. Adding one radial
marker produced four distinguishable states at `0°`, `90°`, `180°` and `270°`.

Therefore `°` or an unmarked circular boundary carries closure but no absolute
angle. An angle state requires a marker, directed cut, frame or external
reference.

### T6 — directed Iota boundary / `IO | Tα`: PASS

- joint-rotation equivariance: `256/256`;
- direction-reversal checks: `64/64`;
- at every tested angle: `7 I`, `7 O`, `2 M` boundary samples.

The result supports this finite rule:

```text
I  if nα·x >  ε
O  if nα·x < -ε
M  if |nα·x| <= ε
```

The two boundary samples prevent a forced global `50/50` assignment. Reversing
the directed cut swaps `I/O` and preserves the shared boundary class `M`.

## Retained implementation failure

The first run incorrectly counted `-0.0` and `0.0` as distinct serialized ring
coordinates. Both first-run outputs are retained under
`failed_attempts/attempt_01_negative_zero_bug/`. Repair 01 changed only zero
canonicalization and numeric state comparison; no scientific threshold,
sample, hypothesis or decision rule changed.

## What this establishes

The tested material supports a coherent typed representation grammar:

1. positional rollover marks a representation-domain boundary;
2. Roman and decimal forms can preserve value while changing representation;
3. circular Unicode/glyph forms must remain typed rather than conflated;
4. a marked ring can carry orientation while an unmarked ring cannot;
5. a directed angular cut yields reproducible IN/OUT/boundary states and
   behaves equivariantly under joint rotation.

This gives the previously documentary `0-6-9` field one bounded operational
interpretation: `0/o/°` may serve as typed carrier/boundary forms, while `6/9`
may serve as font-qualified direction markers. It does not make the entire
historical `0-6-9` compound a single invariant law.

## What this does not establish

It does not establish physical bubble dynamics, a universal `0-6-9` law,
Tesla/vortex physics, privileged primes, linguistic derivation of Iota,
universal equivalence of the glyphs, or a state rule connecting Root7's
`99/100` choice to `101 -> 404`.

`IO | Tα` is validated only as the declared finite notation **IN/OUT under an
angular transform**. Any broader semantic adoption requires a separate Human
Owner decision.
