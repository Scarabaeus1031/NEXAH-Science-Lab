# Selected-pair specificity

## Exact factorization

```text
11357 = 41 * 277
19643 = 13 * 1511
```

All four factors are prime. The legacy statement `11357 = 3*5*757` is false because the right side is `11355`.

## Decimal structure

- `11357` splits lexically as prefix/suffix `11 | 357`. Its prefix happens also to equal its residue modulo 31.
- `19643` splits as `19 | 643`, while its residue modulo 31 is `20`; therefore decimal prefix/suffix is not the CRT map.
- Both decimal suffixes equal the mod-1000 residues by base-10 place value. That is generic, not pair-specific.

## 37 corridor

The source-defined selected corridor `37,137,237,...,1037` consists of values congruent to 37 modulo 100. `11357 mod100=57` and `19643 mod100=43`; neither belongs. Historical sources assign `11357` multiple separate roles, but the earlier generator audit found no source-defined generator joining the full `37/137/237/537/11357` sequence.

## Universal versus selected

Universal for every canonical nonzero `x mod31000`: `x+S_N(x)=31000`, componentwise CRT negation, involution, and unique reconstruction. Universal fixed-point rule: `2x=0 mod31000`, giving `0` and `15500`.

Specific to the selected pair: its two prime factorizations; the decimal strings; the accidental equality `prefix(11357)=11357 mod31=11`; and its explicit appearance in the Clockwork manifests.

No source-backed property beyond the universal complement law and these descriptive arithmetic features was established. The pair was documented before this audit, but no prospective selection rule or preregistration was found; its mathematical selection is therefore retrospective relative to the available corpus.
