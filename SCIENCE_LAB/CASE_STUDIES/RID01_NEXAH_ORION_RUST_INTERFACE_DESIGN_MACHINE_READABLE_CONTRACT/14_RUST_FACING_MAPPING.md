# Rust-Facing Mapping

This is a non-code design mapping.

| Schema construct | Likely Rust concept |
|---|---|
| registered record | `struct` |
| closed discriminator | `enum` |
| union with payload | data-carrying `enum` |
| global/local identifier | validated newtype candidate |
| `RevisionRef` | small immutable struct |
| genuinely optional field | `Option<T>` |
| semantic null/unknown/etc. | explicit enum, not `Option<T>` |
| validated record creation | private fields plus constructor/`TryFrom` candidate |
| schema/semantic rejection | typed error candidate |
| append-only history | collection behind validated append operation |

Likely module boundaries remain identity, provenance, structure, geometry, observation, representation, operation, comparison, decision, return/history and serialization. This mapping does not choose crates, lifetimes, storage, error libraries or async/runtime architecture.

`RUST_FACING_MAPPING_DEFINED=YES`

`RUST_SOURCE_CREATED=NO`

