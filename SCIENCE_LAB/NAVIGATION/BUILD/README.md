# NEXAH Navigator fixture exporter

Status: `WP2 FIXTURE PILOT / NO FULL-CATALOG ADAPTER / NO PUBLICATION`

`build_fixture_exports.mjs` creates deterministic, canonical JSON outputs for
the validated Internal and Public fixtures and emits a fail-closed rejected
public-items report.

```sh
node build_fixture_exports.mjs
node verify_fixture_exports.mjs
```

The pilot proves separation, canonical serialization, payload/source receipts,
rejection reporting and byte-identical repeated builds. It does not yet ingest
Module Registry v2, the 111-row HTML Artifact Registry or evidence slices.
Generated Public data remains a non-authorized preview.

`build_registry_exports.mjs` is the first real-source adapter. It joins Module
Registry v2, HTML Artifact Registry v1 and the Polar-Janus Evidence Slice into
one deduplicated Internal manifest. Until an explicit allowlist exists, its
Public manifest is empty and every Internal entity appears in the rejected
items report as `NO_PUBLIC_ALLOWLIST`.

```sh
node build_registry_exports.mjs
node verify_registry_exports.mjs
```

The mapping and non-claim rules are recorded in
[`REGISTRY_ADAPTER_SPEC_V1_2026-10-06.md`](REGISTRY_ADAPTER_SPEC_V1_2026-10-06.md).
