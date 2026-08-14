# A3 Canonical RNG and Ordering Contract

## Canonical keys and orders

- Null families: `N1,N2,N3,N4`.
- Representations/carriers: `TRAJECTORY,LEARNED_FIELD` / `T,F`.
- Splits: `TRAIN_OOF,TEST`.
- Replicates: integers `0..199` ascending.
- Seeds: ascending integer seed ID.
- Actions: physical binary64 value ascending: `-0.5,-0.25,0,0.25,0.5`.
- Row key: `(split_code, seed_id, within_seed_decision_index)`, with split order above, seed ascending, and within-seed index `0..49` in ascending sampling-time order.
- Training action/path key appends canonical action index `0..4`.
- Phase, target, and support bins: integer index ascending.
- Donor pools and permutation populations: canonical row-key ascending.
- N4 carrier subworlds: `T` then `F`; stratum key is target-bin, magnitude class, then comma-separated ascending original support deciles.
- Whenever TRAJECTORY or LEARNED_FIELD selects nearest training neighbors during an N1 refit or either N5 tier, order candidates by finite binary64 distance ascending and then canonical training row key ascending; take the first frozen `k`. Exact distance ties never use library/partition order.

No incidental container, filesystem, dataframe, set, hash-table, neighbor-library, or unstable-sort order has authority. Exact key ties are duplicate-row-ID provenance failures.

## Namespace serialization

V1's prefix is retained exactly:

`UTF8(config_id) + "|" + ASCII(family_token) + "|" + ASCII(replicate_decimal)`.

Family tokens are the V1 names `action_label`, `rank_within_seed`, `state_mismatch`, and `support_matched`. Replicate decimal has no sign/leading zero except `0`.

Append ordered suffix fields as `|TAG=VALUE`. Tags and orders are:

- N1: `REP`, `SEED`;
- N2: `SPLIT`, `SEED`;
- N3: `SPLIT`, `ROW`;
- N4: `SPLIT`, `CARRIER`, `STRATUM`.

Value domains are closed: `REP` is `TRAJECTORY` or `LEARNED_FIELD`; `SPLIT` is `TRAIN_OOF` or `TEST`; `CARRIER` is `T` or `F`; `SEED` is the canonical unsigned integer seed ID; `ROW` and `STRATUM` use the formats below.

Enum/string values are uppercase ASCII matching `[A-Z0-9_.;,-]+`; integer values are unsigned canonical decimal; row is `SPLIT.SEED.INDEX`; stratum is `Q<q>;M<magnitude-token>;D<deciles-comma-separated>`, where the only magnitude tokens are `000`, `025`, and `050` for exact physical magnitudes `0.0`, `0.25`, and `0.5`. These alphabets exclude `|` and `=`, so serialization is injective. There is no length prefix or length field. The complete payload is UTF-8 with no terminator or whitespace.

## Hash, generator, and draws

Compute SHA-256 of the payload. Take digest bytes `[0:8]`, interpret as one unsigned 64-bit big-endian integer, and instantiate a fresh `numpy.random.Generator(numpy.random.PCG64(seed))` under NumPy 2.3.5 for that one namespace only. Conforming registered implementation is restricted to the frozen V1 Python 3.12.13 / NumPy 2.3.5 / macOS 26.5.2 arm64 environment; any other numerical environment fails preflight rather than generating an alternative stream.

- N1: exactly one `Generator.permutation(5)` call; output `p` defines `pi(action[j])=action[p[j]]`.
- N2: for the canonical `n` row IDs, exactly one `Generator.permutation(n)` call; output positions select donor rows.
- N3: after canonical donor filtering, exactly one `Generator.integers(0,n,endpoint=False,dtype=numpy.int64)` call; selected integer indexes the canonical donor list.
- N4: for the canonical `n` rows in one stored stratum, exactly one `Generator.permutation(n)` call.

No generator is reused across namespaces. No preliminary draw, shuffle, retry, rejection resampling, replacement stream, or draw after an invalidity condition is allowed. Empty/invalid inputs are detected before generator construction and invalidate under A2's accepted rule. Because streams are object-local, processing order cannot shift another object's choices; nevertheless artifacts serialize results in the canonical orders above.
