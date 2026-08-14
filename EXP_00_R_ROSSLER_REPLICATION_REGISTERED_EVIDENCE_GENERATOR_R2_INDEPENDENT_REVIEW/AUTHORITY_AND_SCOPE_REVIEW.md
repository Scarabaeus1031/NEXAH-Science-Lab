# Authority and Scope Review

## Independent authority reconstruction

| Family | Frozen authority | R2 behavior | Result |
| --- | --- | --- | --- |
| N1 | A3 suffix order `REP,SEED`; physical TRAIN seed in tagged SEED | exact grammar and TRAIN registry | PASS |
| N2 | A3 suffix order `SPLIT,SEED`; physical seed belongs to named split | exact grammar and split-specific registry | PASS |
| N3 | A3 suffix order `SPLIT,ROW`; Export R1 fixes `ROW=SPLIT.<physical_seed>.<decision_index>` | parses and validates embedded seed, split and index | PASS |
| N4_T | A3 suffix order `SPLIT,CARRIER,STRATUM`; Export R1 binds membership/order to canonical physical-seed row keys | no SEED suffix; exact T grammar plus complete canonical row-population gate | PASS |
| N4_F | same N4 authority with F carrier | no SEED suffix; exact F grammar plus complete canonical row-population gate | PASS |

Reviewed authority hashes:

- A3 canonical contract: `3c6664f09f453607999fc1e54faf4721f22eaea114c31878d0e05263a31131ea`
- A3 machine rules: `0bd67734fdbb308d07aec6c494d1274c1f7a4f61d258f56a0d6cb94fdb2d9130`
- Export R1 G1 repair: `9a769610c140fd3a3506a4ee0727450a0ed33bca2c003f68c265ef83f649e01a`
- A4 N1–N4 contract: `3e362173d78c6d9c26ce532e3416e4036bf4001bfd3d00c3fccc83186f07b8eb`

The R1→R2 source diff changes the null namespace gate, threads the already-required canonical physical row population into that gate, factors the already-frozen config ID into a constant, and adds a byte-preservation helper used by validation tests. It does not change any null draw, model, endpoint, threshold, rank, population, serialization rule, hash-to-seed rule, or PCG64 initialization.

```text
CANONICAL NULL NAMESPACE MODIFIED: NO
NAMESPACE COMPONENT ADDED: NO
NAMESPACE COMPONENT REMOVED: NO
NAMESPACE COMPONENT REORDERED: NO
SERIALIZATION MODIFIED: NO
SHA-256 DERIVATION MODIFIED: NO
PCG64 INITIALIZATION MODIFIED: NO
NULL SEMANTICS MODIFIED: NO
PHYSICAL SEED AUTHORITY WEAKENED: NO
NEW SCIENTIFIC CHOICE INTRODUCED BY R2: NO
```
