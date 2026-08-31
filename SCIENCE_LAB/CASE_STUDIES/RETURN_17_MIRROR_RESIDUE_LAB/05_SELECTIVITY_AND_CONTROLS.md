# Selectivity and Controls

## Exact arithmetic

Calibration passed:

```text
41 - 74 = -33 = -2*17 + 1
74 - 41 =  33 =  2*17 - 1
signed residues at n=17: +1 and -1
```

The tested “mirror” is subtraction-order reversal only. Coordinate reflection, image mirroring, traversal reversal, and graph-edge reversal were not silently equated with it.

## Neighbor control

Among the complete 5×5 local matrix, 5 of 25 pairs produced signed `+1` and 3 produced signed `-1`. Thus 8/25 (`0.32`) produced ±1. The target `(41,74)` is one of five diagonal pairs with difference `-33`; it is not locally unique.

## Modulus sweep

For fixed difference `-33` and `n=2..40`:

- canonical residue `1`: `n={2,17,34}` because `n` divides 34;
- signed residue `+1`: `n={2,17,34}`;
- signed residue `-1`: `n={4,8,16,32}` because `n` divides 32, with the frozen positive tie convention at `n=2`;
- signed residue `±1`: `n={2,4,8,16,17,32,34}`;
- exact closure `0`: `n={3,11,33}` because `n` divides 33.

Seventeen is therefore neither the only small-residue modulus nor an independently fixed cycle length in the source.

## Archive-number control

The only objectively bounded integer set was frozen from the exact retrospective list at Markdown line 2019:

```text
{3,6,9,12,17,24,29,33,41,48,96,137,1836}
```

This is P2 retrospective evidence and notably excludes 74.

| Measure | Result |
|---|---:|
| Ordered unequal pairs | 156 |
| Pair/modulus tests (`n=2..40`) | 6,084 |
| Signed +1 among all tests | 448 (`0.07364`) |
| Signed -1 among all tests | 364 (`0.05983`) |
| Closure 0 among all tests | 566 (`0.09303`) |
| +1 at fixed `n=17` | 8/156 (`0.05128`) |
| Pair reaches +1 under any post-hoc modulus | 138/156 (`0.88462`) |

This arm is admissible as a bounded retrospective comparison, not as proof that its list was selected independently in 2024.

## Deterministic random baseline

Five thousand sets of 13 unique integers were sampled from `3..1836` with seed `330117`. Each set used 156 ordered unequal pairs.

| Search regime | Raw pair match rate | Set-level family-wise rate |
|---|---:|---:|
| Fixed before test: `n=17`, signed +1 | `0.05924` | `0.999` |
| Modulus selected after pair: any `n=2..40`, signed +1 | `0.84525` | `1.000` |

The set-level rates describe the declared selection search; they are not p-values. Searching across many pairs and moduli makes at least one small residual effectively guaranteed in this control design.

## Safeguard result

The target relation depends on choosing the sequence labels 41 and 74 and privileging modulus 17 after inspection. No contemporaneous artifact fixes that triple. The raw exact congruence survives, but selectivity and independence do not.

> For any integers a and b, a modulus can often be selected after the fact to produce a small desired residue. Exact congruence alone is therefore not evidence of a privileged historical structure.
