# Two-implementer audit

The reference and independent A5XEFR adapters separately validate envelope shape, provenance, authority, authorization, mode tuples, manifest identity and evidence authority. They invoke the two distinct sealed A5XEF scientific implementations.

They share constants and the deterministic identity-removal helper. To avoid treating this shared helper as independent confirmation, the review separately reimplemented canonicalization and compared its complete output with the sealed helper for both modes. All objects were exactly equal.

No remaining discretion was found concerning:

- identity validity;
- registered structural representability;
- absence of authorization;
- the exact scientific evidence delivered to A5XEF;
- scientific output;
- top-level result/release status.

Two-independent-implementers test: **PASS**.
