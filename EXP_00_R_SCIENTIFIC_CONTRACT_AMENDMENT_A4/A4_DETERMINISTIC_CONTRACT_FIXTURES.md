# A4 Deterministic Contract Fixtures

## RNG known answers

The four payload/digest/seed/call/output records in `rng.known_answers` were generated once under the frozen NumPy 2.3.5 PCG64 environment. A conforming implementation must reproduce the exact arrays/selected integer byte-for-byte before registered execution. The standard-library validator independently recomputes payload SHA-256 and big-endian seeds; a future environment preflight must also execute and compare PCG64 draws.

## Boundaries

- `+π` and `-π` → phase bin 0.
- every internal edge → higher bin; its immediate predecessor → lower bin.
- cuts `[1,1,2,3]`: value `1` → bin 2; predecessor of 1 → bin 0; 3 and values above → bin 4.
- clockwise: `(0,{7,2})→7`, `(1,{5})→5`, `(7,{6,0})→6`, no occupied bin → invalid.
- N1 3-cycle `[1,2,0,4,3]` proves forward output for action 0 is action 1 while inverse is action 2.
- N4 sizes `[4,0,7,11,0,0,12,0,0,9]` merge 0 upward with 2 and 9 downward with 6; total `<10` invalidates.
- Monte Carlo `k=4` passes and `k=5` fails; descriptive rank is sorted item 195 one-based.
- N5 explicit matrices equal the first 12 generated determinant-`+1` signed permutations.

The fixtures contain no Rössler seed, trajectory, fit, score, outcome, or result.

