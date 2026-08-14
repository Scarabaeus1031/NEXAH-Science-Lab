# A5XR Support, Identity and Provenance Audit

## Support and identity

The synthetic seed registry is separate from registered identities, which correctly avoids registered access. Exact registry membership and uniqueness of seed blocks are checked. However:

- the schema contains no T-supported or F-supported row membership from which T/F OOS is derived;
- T/F OOS values may be changed independently to any passing value;
- row prefixes may be arbitrary unique strings rather than canonical seed/decision IDs;
- joint counts are tied to joint fraction, but representation failure propagation cannot be reconstructed;
- the evaluator is hard-coded to `SYNTH_*`, so it is not itself a future registered-identity contract.

## Provenance

Expected tuples are constructed internally for support, null family summaries, N5 tier summaries and seed dominance. This improves over caller-supplied expectations. There is no canonical expected-artifact ledger, and no binding for observed carrier metrics, bootstrap draws, per-seed direction inputs, mandatory diagnostics or individual sensitivity result records.

## Authority transitivity

A5XR verifies the A5X root JSON digest but not its listed members. A byte mutation to an A5X member is outside A5XR's checks unless an external reviewer separately runs A5X verification. This violates the requested self-contained immutable dependency check.

**Identity/support/provenance: FAIL (Class B).**
