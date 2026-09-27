# Canonical serialization and hashing

P4A canonical JSON uses UTF-8, lexicographically sorted object keys, no insignificant whitespace, JSON literals in lowercase and direct Unicode output. Duplicate keys and nonfinite numbers reject before canonicalization.

The envelope `content_hash` is lowercase SHA-256 over canonical bytes after omitting exactly the top-level `content_hash` property. No nested property is omitted. The stored value must use `sha256:<64 lowercase hex>`.

Object member order in input is irrelevant. Array order is significant. Numbers retain the deterministic Python JSON representation used by this candidate validator. This last rule requires cross-language compatibility review before production release.

