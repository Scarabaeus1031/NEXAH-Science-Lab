# A5XR Sensitivity Derivation

The expected registry is sealed in derivation code: exact 12 IDs/paths/primary/alternate values. Canonical JSON is sorted compact UTF-8 without NaN. Each variant and unchanged-leaf digest is independently recomputed from frozen V1 JSON. Each ID has separate T/F coefficient/gain and typed support; support ranges/counts/seed keys are validated. One fixed provenance binding comes from V1/A5X authority, never from the record being judged. Missing, duplicate, extra, substituted, wrong-config or impossible records fail.

