# CA-IDENT-03 Annex · Fourier views and CRT address sidecar

Status: `EXACT ARITHMETIC ANNEX / NOT PART OF THE LOCKED UTILITY GATE`

## One distribution, two transformations, three nonidentical views

For one normalized carrier `p(x,y)`, the dashboard distinguishes:

1. `p(x,y)` — spatial distribution with its address;
2. `F[p]` — complex Fourier coefficients, from which exact return is possible;
3. `-p log p` — local entropy density, whose sum is total entropy.

Fourier magnitude `|F[p]|` is a further lossy view. A cyclic translation can
retain the same magnitude while changing the carrier address. Likewise, local
entropy density and total entropy are derived records, not carrier identities.

## The 29/31 gate

`29` and `31` are coprime mirrors around `30`:

```text
29 × 31 = 30² − 1 = 899.
```

The owner visual's arithmetic decomposes exactly into the two residue channels:

| value | mod 29 | mod 31 |
|---:|---:|---:|
| 11357 | 18 | 11 |
| 19643 | 10 | 20 |
| 31000 | 28 | 0 |

Componentwise addition gives `(18+10 mod 29, 11+20 mod 31) = (28,0)`.
The Chinese Remainder Theorem reconstructs the canonical address `434 mod 899`,
and `31000 mod 899 = 434`.

## Connection to 49/51

`49` and `51` are the same standard arithmetic schema around `50`:

```text
49 × 51 = 50² − 1 = 2499,  gcd(49,51)=1.
```

For `31000`, the residue pair is `(32,43)` and reconstructs `1012 mod 2499`.
This confirms a shared **dual coprime register pattern**. It does not resolve
the historical semantics of the Rath 49/51 operator.

## What this can add to LIFE

A useful bounded architecture is:

```text
translation-invariant spectral signature + explicit CRT address sidecar
```

The spectrum can support comparison while the sidecar preserves the discrete
shift/address required for return. The sidecar adds address information; it is
not recovered from Fourier magnitude. Therefore this is a provenance and
reconstruction proposal, not evidence that CRT improves LIFE prediction.

## The exact 63/64 Fourier boundary

For a 64-sample discrete Fourier transform there are exactly 64 bin addresses:

```text
k = 0, 1, ..., 63.
```

The final address `63` is the modular frequency class `-1 mod 64`. For a real
input, bin `63` is the complex-conjugate partner of bin `1`. A spatial shift by
`delta` multiplies bin `k` by the phase factor
`exp(-2 pi i k delta / 64)` while preserving its magnitude.

This makes 63/64 useful as an **index, phase and return boundary** for the
64×64 LIFE carrier. It does not by itself establish a quantum link, physical
asymmetry or new Fourier law. Although `gcd(63,64)=1`, treating the pair as a
CRT gate would be an additional declared construction, not an inherent fact of
the 64-point DFT.

## Existing Fourier lineage

The controlled NEXAH LAB visual index records `EXP-JANUS-14B` as a strong
arithmetic periodicity result. Its Fourier spectrum has dominant periods
`T = 2, 3, 6`; the interpretation is synchronization of mod-2 and mod-3 cycles,
not a special role for seven. This is a useful methodological predecessor for
LIFE spectral diagnostics, but it is a different carrier and does not transfer
its result to cellular automata.

## Claim ceiling

Standard CRT arithmetic and finite Fourier distinctions only. No new theorem,
physical resonance, quantum link, universal decoder, semantic 49/51 operator
or LIFE utility gain is established.
