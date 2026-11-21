# A0 Prime Projection Test Suite · Contract

**Date:** 2026-11-21
**Status:** internal A0 engineering view
**Authority:** no publication authority; no Source Graph delta

## Purpose

This companion instrument compares one retained finite integer carrier through three declared views:

1. a boustrophedon strip projection of `1…1000`;
2. an exact `mod 11` address table across three declared numerical zones;
3. the finite CRT address orbit `n = 37 + 100k`, `k = 0…20`, in `Z3 × Z5 × Z7`.

The suite reuses the identities `MOD:NUMBER_VIEW_SUITE`, `ART:A0:MATHEMATICAL_JOINTS`, `NN:CRT_QRT_37_CARRIER_LADDER` and `NEXAH:PBM:V1`. It creates no canonical identity and changes no graph relation.

## Retained source facts

- Prime membership and prime rank are computed on the integer carrier.
- The strip contains `168` primes at or below `1000`.
- The CRT orbit has address period `21`, contains `6` prime carriers and `2` directed `+4` cousin-prime events.
- The zone table gives the descriptive finite statistic `χ² = 6.322679612870788` with `18` degrees of freedom.

## Added view encodings

Strip direction, row flips, three numerical zones, polar angle, radius, colors, node size and wheel position are presentation operators. The exact source number and its arithmetic record remain the return carrier.

## Claim boundary

The instrument does not claim prime generation, a physical fold, resonance, intrinsic zone coupling, a law connecting strip geometry to primality, or a transfer from finite CRT behavior to an infinite conjecture. The chi-square value is retained as a descriptive finite check only; no preregistered inferential claim is attached. This work is not a Study, Finding, paper claim or public release.

## Verification

The executable source check is `a0-prime-projection-suite-tests.cjs`. The machine-readable receipt is `results/a0-prime-projection-suite-2026-11-21.json`.
