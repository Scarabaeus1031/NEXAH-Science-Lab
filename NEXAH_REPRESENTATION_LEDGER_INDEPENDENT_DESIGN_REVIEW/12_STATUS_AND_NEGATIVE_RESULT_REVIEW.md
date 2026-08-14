# Status and Negative-Result Review

`VERIFIED` is too coarse. Across the cases it could mean source inspected, callable exists, output replayed, mathematical property proven, provenance complete, or interpretation supported. The prior prose narrows its meaning manually, but the enum does not.

Minimum independent dimensions are:

- operator/definition status;
- execution/reproduction status;
- provenance status;
- individual claim status.

Case D proves successful execution can coexist with rejected interpretation. The current record can place `PARTIALLY_VERIFIED` beside `negative_results`, but that single status obscures what succeeded. More seriously, a later schema-valid record can set `VERIFIED` and submit an empty `negative_results` array. No record revision, supersession link, append-only identity, or monotonic negative-retention rule prevents erasure.

Thus negative evidence is representable but not safely preserved. This violates the validator gate until record lineage and non-deletion checks are defined.

