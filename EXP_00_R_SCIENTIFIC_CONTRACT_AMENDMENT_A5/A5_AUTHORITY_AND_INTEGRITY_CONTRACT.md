# A5 Authority and Integrity Contract

The validator reconstructs V1 authority from bytes. It enumerates exactly `EXP_00_R_FROZEN_CONFIG.yaml`, `run_exp00r.py`, every `src/**/*.py`, and `tests/test_exp00r.py`; sorts relative POSIX paths; forms `sha256(file_bytes) + two spaces + relative_path + newline`; concatenates those lines; and hashes the UTF-8 result. Exact expected composite: `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05` over 24 files.

A1–A4 machine contracts and classification-relevant external artifacts are immutable byte-hash anchors in `authority.external_files`. A5 does not trust an upstream stored digest.

`A5_PACKAGE_MANIFEST.json` lists every operative A5 Markdown contract, machine contract, validator, and test/fixture definition with relative path, role, size, and SHA-256. The manifest is intentionally not self-hashed because cryptographic self-hash is recursive; its schema, exact membership, and all member bytes are validated. Any material member mutation without a manifest regeneration fails. Manifest regeneration is a new freeze event and is prohibited after registered access by `NO_POST_ACCESS_SCIENTIFIC_MUTATION`.

The validator is contract-only, standard-library-only, imports no scientific module, never reads registered seed artifacts, and never creates authorization. Source/config/prose/machine/test failure stops before scientific classification.

