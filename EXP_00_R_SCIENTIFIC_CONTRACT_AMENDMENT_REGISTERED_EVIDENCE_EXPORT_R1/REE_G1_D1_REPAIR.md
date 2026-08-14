# REE-G1-D1 Repair

## REE-G1-D1-R1

For ordinal `i=0..29`, the optional relational metadata remains:

```text
pair_id = ROSSLER_PAIR_<two-digit i>
TRAIN_OOF physical_seed_id = 5000+i
TEST      physical_seed_id = 6000+i
```

The pair relation is an encoding index only. It is not a matched-pair hypothesis and has no authority over simulation, fitting, randomization, clustering or inference.

## Authoritative identities

- state generation/RNG: physical seed integer;
- OOF fold identity: physical training seed integer;
- scientific canonical row key: `(split_code, physical_seed_id, decision_index)`;
- N1/N2 `SEED` suffix: unsigned canonical decimal physical seed;
- N3 `ROW` suffix: `SPLIT.<physical_seed_id>.<decision_index>`;
- N4 membership and ordering: canonical physical-seed row key;
- bootstrap cluster: physical TEST seed integer;
- per-seed attribution/dominance: physical TEST seed integer;
- training-half membership: physical training seed integer.

The schema may store `pair_id` and use it in an encoding-only foreign key or display ID. Every row must also contain `physical_seed_id`. When an encoded row ID contains a pair ID, the scientific row identity used by A3/A4 is independently reconstructed from split, `physical_seed_id` and decision index. Pair IDs are forbidden in any RNG namespace payload or scientific group/cluster identity.

Mappings are monotone and exhaustive; no seed is omitted, duplicated, permuted or rematched. TRAIN and TEST remain disjoint. The pairing never permits information transfer across splits.

