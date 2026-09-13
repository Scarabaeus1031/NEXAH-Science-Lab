# Parameter versus state doubling

`14 → 28 → 56` changes the translation parameter and is `PARAMETER_DOUBLING`. It is not state doubling and not Feigenbaum period doubling.

State doubling is (D_N(x)=2xmod N).

| Carrier | Factorization | Fixed points | Cycles by length | Max cycle | Tail counts | Max tail |
|---:|---|---|---|---:|---|---:|
| 1428 | (2^2cdot3cdot7cdot17) | 0 | {"1":1,"2":1,"3":2,"6":2,"8":6,"24":12} | 24 | {"0":357,"1":357,"2":714} | 2 |
| 392 | (2^3cdot7^2) | 0 | {"1":1,"3":2,"21":2} | 21 | {"0":49,"1":49,"2":98,"3":196} | 3 |

The even factors create preperiodic trees: the powers (2^2) and (2^3) bound the observed tails by 2 and 3. After the 2-primary component reaches zero, the odd component is permuted by multiplication by 2. Full cycle node lists are preserved in `CRT_CIRCLE_RESULTS.json`.
