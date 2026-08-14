# A4 Authority and Integrity Audit

## Independent checks

- Recomputed frozen V1 source/config/test composite from 24 files: `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05` — PASS.
- Recomputed A4 pre-review non-bytecode tree snapshot from 21 files: `17f528e59096ce9f35cc510d6f5ac765104dd9e30d92ce14d7b9f743279b7f90`.
- All nine file hashes listed in A4 `authority.external_files` matched.
- A4 contains Markdown, one JSON-compatible YAML contract, and standard-library contract tests only. No plant runner, seed registry release, authorization record, registered output, trajectory, fit, or classification artifact was found.
- A4's own 12 tests pass. That fact is not used as acceptance evidence.

## Authority defect

The A4 validator compares the stored machine digest and hashes only `authority.external_files`. It does not independently reconstruct `authority.v1_composite_sha256`; frozen V1 source changes outside the listed config file are invisible. The review's temporary-copy mutation proves a modified `src/exp00r/actions.py` still permits `validate_package` to pass.

It also checks only that A4 Markdown files exist. A material mutation to `A4_P1_P5_CONTRACT.md` passes because no prose composite or semantic anchors are verified.

These are class-B contract-encoding defects. The actual workspace authorities were not modified and currently match.

