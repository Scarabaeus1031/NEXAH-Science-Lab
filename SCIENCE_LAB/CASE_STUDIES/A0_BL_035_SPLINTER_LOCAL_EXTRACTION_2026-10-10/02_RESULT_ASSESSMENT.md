# A0-BL-035 — Result assessment

Date: `2026-10-10`

Status: `VALID_RESULT / SPLINTER_PARTIAL / CLOSED / OWNER_ACCEPTED`

## Verdict

The frozen decision rule returns:

```text
SPLINTER_PARTIAL
```

`SPL_LOCAL` removes the address-only ambiguity but does not compress the 100
histories: every radius produces 100 signatures for 100 records. No
`SPLINTER_SUFFICIENT_COMPRESSED` candidate exists.

## Exact metrics

| Model | Signatures | Cross-class collisions | Impure signatures | H(C\|M), bits | Compression |
|---|---:|---:|---:|---:|---:|
| M0 address | 56 | 54 | 36 | 0.950195500087 | 0.56 |
| M1 profiles | 60 | 46 | 36 | 0.84 | 0.60 |
| M2 oriented seam | 100 | 0 | 0 | 0 | 1.00 |
| M3 local radius 0 | 100 | 0 | 0 | 0 | 1.00 |
| M3 local radius 1 | 100 | 0 | 0 | 0 | 1.00 |
| M3 local radius 2 | 100 | 0 | 0 | 0 | 1.00 |
| M4 full history | 100 | 0 | 0 | 0 | 1.00 |
| M5 terminal oracle | 56 | 0 | 0 | 0 | 0.56 |

The scientific interpretation is narrower than “Splinter predicts the
class.” The orientation choices already distinguish every history once joined
to its address. `SPL_LOCAL` adds no compression and no improvement over M2.
The within-address permutation control is consequently uninformative: it also
retains 100 unique signatures.

## Controls and reproducibility

- frozen predecessor hash: PASS;
- 100 histories, 56 addresses, 56 classes: PASS;
- zero/one-based address invariance: PASS;
- cyclic address-reindex metric invariance: PASS;
- `J^2=id` for all radii: PASS;
- terminal oracle excluded from candidate models: PASS;
- independent structural verifier: PASS;
- Primary/Replay SHA-256:
  `e8e05d7a20db80130d8473a02a31d9b5a62604e008d9ac8cedfebf8dc661e1b3`;
- Primary and Replay bytes: identical.

The first sandboxed launch passed the lock but could not create the declared
artifact directory. It produced no result file and no interpreted output. The
unchanged locked sequence was then executed with filesystem authorization.

## Bounded conclusion

The run supports a local transition-description reading of Splinter, but not
a compressed selector or autonomous operator. The exact retained statement is:

> Local seam orientation is enough to distinguish the 100 frozen histories,
> while the tested `SPL_LOCAL` neighborhoods provide no further compression.

No physical corridor, universal Splinter operator, C5 symmetry, terminal-class
bijection, PENT-08 or canonical vocabulary follows. The secondary question
whether `J` induces a total function on observed terminal classes was not part
of the emitted primary metrics and remains unclaimed.

## Owner disposition

The Human Owner accepted this result on `2026-10-10`. The Study is closed with
no active successor, publication authority or claim promotion.
