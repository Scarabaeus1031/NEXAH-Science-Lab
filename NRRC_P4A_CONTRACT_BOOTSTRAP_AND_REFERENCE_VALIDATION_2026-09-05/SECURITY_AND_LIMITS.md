# Security and limits

The reference validator rejects duplicate JSON keys, nonfinite numbers, unsupported versions, malformed SHA-256 values, unresolved references, noncontiguous provenance, undeclared fields and inconsistent decisions.

P4A local safety limits are implementation guards, not production policy:

```text
MAX_INPUT_BYTES = 1048576
MAX_JSON_DEPTH = 64
MAX_COLLECTION_ITEMS = 10000
MAX_STRING_CODEPOINTS = 65536
MAX_PROVENANCE_STAGES = 256
MAX_RESIDUAL_COMPONENTS = 4096
```

Values exceeding these limits fail closed. No URI is fetched and no source path is dereferenced. Untrusted text remains inert. Production limits require a later security-owner review and release decision.

