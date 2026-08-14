# Null-Namespace Authority Trace

## Authority precedence: resolved

| Family | Frozen A3 suffix order | Physical-seed binding | R2 validation |
| --- | --- | --- | --- |
| N1 | `REP`, `SEED` | `SEED` is a physical TRAIN seed | exact config/token/replicate/REP/tagged seed grammar |
| N2 | `SPLIT`, `SEED` | `SEED` must belong to the named TRAIN_OOF or TEST split | exact split/tagged seed grammar |
| N3 | `SPLIT`, `ROW` | `ROW=SPLIT.<physical_seed>.<decision_index>` | parses the seed from ROW; checks split, allowed physical range and index 0–49 |
| N4_T | `SPLIT`, `CARRIER`, `STRATUM` | N4 membership/order uses canonical physical-seed row keys | exact T carrier/stratum grammar plus complete canonical row-population gate |
| N4_F | `SPLIT`, `CARRIER`, `STRATUM` | N4 membership/order uses canonical physical-seed row keys | exact F carrier/stratum grammar plus complete canonical row-population gate |

Authority chain:

1. Frozen V1 config supplies the unchanged `config_id`, physical seed sets and null families.
2. A3 freezes tokens, ordered suffix tags, closed value encodings, UTF-8 serialization, SHA-256, first-eight-byte big-endian conversion and NumPy PCG64.
3. A4 freezes the object-local N1–N4 populations and randomization units.
4. Export R1 `REE_G1_D1_REPAIR.md` declares physical integers as scientific/RNG identities, locates N3 identity in ROW, and locates N4 identity in canonical physical-seed row membership/order.
5. Generator R1 correctly intended to enforce G1, but its single `payload[-1]` integer check contradicted A3 for N3/N4.

Therefore the over-broad validator, not the canonical namespace, is repaired. No unresolved scientific choice is required.

For N4, R2 does not pretend that STRATUM contains a seed. Full payload validation first proves the exact 3,000-row `(split, physical_seed_id, decision_index)` population; that same canonical population is mandatory at the null gate and is the frozen source from which N4 strata and membership are reconstructed.
