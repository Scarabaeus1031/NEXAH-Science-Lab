# Serialization and Versioning

## V1 interchange

JSON is accepted as the V1 canonical interchange representation using JSON Schema Draft 2020-12.

Canonicalization requirements:

- UTF-8, no byte-order mark.
- stable snake_case field names and uppercase enum tokens.
- object keys sorted lexicographically for hashing.
- array order preserved where semantic; mathematically unordered arrays sorted by canonical member bytes when the owning rule declares them sets.
- finite JSON numbers only; no NaN or infinity; `-0` canonicalizes to `0` unless a domain contract explicitly preserves signed zero.
- no raw JSON `null`.
- timestamps use RFC 3339 UTC form for canonical bytes.
- units reference versioned unit records; uncertainty remains a typed object.
- hashes use lowercase `sha256:<64 hex>`.

Unknown fields fail closed because records set `additionalProperties=false`. Unknown enum values and unsupported major schema versions fail closed. Minor versions may add optional, semantically non-breaking fields only. Required-field changes, discriminator changes or changed meaning require a new major version. Old bytes and schemas remain immutable.

No serializer is implemented here.

