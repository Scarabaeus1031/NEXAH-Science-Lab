# F47 execution-identity contract

## Typed modes

`FIXTURE` requires:

- `registered=false`, `registered_data=false`, `fixture=true`;
- `payload_kind=SYNTHETIC_FIXTURE`;
- `conformance_only=true`, `scientific_result_claimed=false`;
- no execution authorization.

`REGISTERED` has two structurally expressible purposes:

1. This package tests only `SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE`: `registered=true`, `registered_data=true`, `fixture=false`, synthetic payload, conformance-only, no scientific-result claim, no authorization.
2. `REGISTERED_SCIENTIFIC_EVIDENCE` is a future interface state: the same three Boolean predicates, non-synthetic payload, not conformance-only, and a scientific-result claim. A5XEFR can validate its structure but must refuse scientific derivation unless a future external authorization gate succeeds. A5XEFR supplies no such authorization mechanism or token.

## Scientific invariance

The envelope is validated and provenance-bound before use. For synthetic conformance only, identity fields are canonicalized to the fixture representation required by sealed A5XEF; provenance for the canonicalized scientific evidence object is recomputed. No state, scores, outcomes, configuration, population rule, model rule, RNG rule, null, bootstrap, N5, sensitivity, proposition, threshold or classification rule changes.

Both A5XEF scientific implementations receive the same canonical scientific evidence they previously consumed. Identity is restored only as audit metadata around their complete outputs.

## Safety

Schema capability is not authorization. `authorization.present` must remain false in this package. A registered-interface conformance result is always top-level `CONFORMANCE_ONLY`, `scientific_result=false`, and `release_permitted=false`, irrespective of the nested synthetic scientific calculation used for equality testing.
