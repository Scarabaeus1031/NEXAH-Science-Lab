# Versioning

`0.1-candidate` is nonproduction. Candidate snapshots are content-hash bound and must never change in place after an approved release. Repository and schema versions remain distinct.

Compatibility classes:

- `ADDITIVE_COMPATIBLE`: registered optional namespace with declared handling and no changed required meaning.
- `NEW_MINOR_CONTRACT`: optional bounded capability under the same authority.
- `BREAKING_MAJOR`: required-field, enum, canonicalization, identity, hash or authority change.
- `EDITORIAL_ONLY`: no schema, validation, ownership or meaning effect.

This staging package is not a published release and creates no compatibility promise.

