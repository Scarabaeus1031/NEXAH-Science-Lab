# Scientific Object Manifest

Status: `TEMPLATE — SCIENTIFIC OBJECT NOT CREATED`

## Identity

| Field | Prepared value |
|---|---|
| canonical object ID | `UNASSIGNED` |
| scientific title | `Finite Identifiability Classification Under Four Orthographic Projections` |
| object version | `UNASSIGNED` |
| adoption date | `UNASSIGNED` |
| object status | `NOT CREATED` |
| protocol | `Program G Protocol 1.0 — candidate binding only` |

## Mathematical object

The future canonical object is:

```text
O = (S, J, X, Θ, H, τ_sci)
```

| Component | Intended frozen value |
|---|---|
| `S` | `{A,B,C,D}` |
| `J` | `{0,…,120}` |
| `X` | validated canonical `source_samples.csv` containing 484 dimensionless synthetic source samples |
| `Θ` | `{0,90,180,270}` |
| `H` | four fixed Program G integer observation matrices `R³→R²` |
| `τ_sci` | `1×10^-9` displayed-coordinate units |

This definition becomes canonical only when the source, input and protocol
manifests are adopted together.

## Required provenance binding

The future object manifest shall bind:

- canonical source repository and commit;
- canonical source-freeze manifest hash;
- canonical source file hashes;
- canonical CSV hash;
- export manifest and environment hashes;
- Program G Protocol 1.0 file inventory and hashes;
- protocol adoption record;
- scientific, freeze and review roles;
- validation and non-claim documents.

Phase A conceptual provenance remains necessary but is not a substitute for
this byte-level binding.

## Source bundle

Future required source bundle:

```text
source_freeze_manifest
tracked Lab 0.4 source candidate
canonical SHA-256 inventory
export evidence
canonical source_samples.csv
```

The originating implementation remains provenance. The canonical CSV becomes
the scientific input only after freeze approval.

## Protocol binding

Protocol version: `1.0`.

The future manifest must identify exact adopted hashes for all Program G
documents. Phase A hashes are observed candidates only.

Any later protocol revision requires a new object version and new review. It
must not silently reuse this object identity.

## Permitted execution environment

Current assignment: `UNASSIGNED`.

A future permitted environment must:

- use the canonical input read-only;
- verify all input and protocol hashes before computation;
- implement the four fixed integer matrices without runtime trigonometry;
- preserve exact identifiers and sample indices;
- support exact finite-decimal input parsing or demonstrate categorical
  conformance and numeric replay tolerance;
- pin language, runtime, dependencies and platform details;
- prohibit network-dependent input or mutable remote resources;
- write only to the separately authorized output boundary;
- preserve failed runs;
- prevent access to expected results before evidence freeze.

No language, runtime, implementation or output location is selected here.

## Permitted scientific use

If later frozen and authorized, the object may be used only to classify
view-specific observational equivalence under Program G Protocol 1.0.

## Exclusions

The object excludes:

- continuous source curves between samples;
- masks and availability classes;
- depth-assisted identification;
- reconstruction or inverse estimation;
- noise and probability models;
- mutual information;
- additional views;
- physical, astronomical or cosmological interpretation;
- architectural or OLS authority;
- expected partitions or terminal results;
- publication claims.

## Creation condition

The scientific object exists canonically only after:

1. source freeze approval;
2. canonical CSV export and validation;
3. complete byte-level manifest binding;
4. protocol and role approval;
5. independent protocol review;
6. explicit Human adoption.

None has occurred through this template.
