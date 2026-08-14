# EXP-ORION-L2-001 — Execution Record

Lock timestamp: 2026-08-10T17:17:32Z  
Execution and replay completed: 2026-08-10T17:22:57Z  
Reviewed preregistration SHA-256 reverified before lock and execution: `ad28dbd77611a3e04852d47d5f031eac01705548a1e7f9fd2770aac3091c3c87`

The review state remained 0 CRITICAL, 0 MAJOR, and one preserved MINOR interpretive limitation. Generator and observer accepted no expected-class input. Observer rules were class-free. Comparator opened expected classes only after verifying the canonical observation seal.

The primary run generated all native, reference, transformed, fixture, rendered, and destructive-control records in `primary/`. The clean replay began with a new `replay/` directory. Its generator input was only the locked experiment configuration; its observer input was only newly generated replay records and class-free rules. No primary path was passed to any replay stage.

All ten corresponding scientific/environment files were independently compared and are byte-identical, including raw source, reference, representations, fixtures, controls, blind observations, and classification result.

```text
PRIMARY RESULT HASH: 11059d77f455d3c75d3b9efae869ac6a37fc2dc9315317bc3af4a0f9b706d67b
REPLAY RESULT HASH:  11059d77f455d3c75d3b9efae869ac6a37fc2dc9315317bc3af4a0f9b706d67b
REPLAY IDENTICAL: YES
```

