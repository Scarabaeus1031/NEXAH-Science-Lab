# NEXAH-ORI-02 — Vertex, Record and Symbol Collision

Date: 2026-09-26  
State: frozen before execution  
Test class: known-physics semantic collision and inverse-record ambiguity control

## Question

Can the NEXAH orientation contract prevent two false closures:

1. treating the glyph sequence `pi, tau, phi, K, kappa, sqrt2` as one physical process;
2. treating a visible positron plus missing momentum as proof of one unique upstream decay history?

Does it detect an error that a strong conventional particle-data baseline with typed particle identifiers and an explicit decay graph misses?

## Physical source boundary

The fixture uses established decay relations only:

- `phi(1020) -> K+ K-`;
- `K+ -> mu+ nu_mu`;
- `pi+ -> mu+ nu_mu`;
- `mu+ -> e+ nu_e anti_nu_mu`;
- `tau+ -> e+ nu_e anti_nu_tau`.

Particle authority: Particle Data Group 2025 update and its 2024 Review of Particle Physics base publication. The test does not estimate branching fractions or propose a new decay.

## Frozen semantic types

- `pi` may name the mathematical constant or a pion; these are not one entity.
- `tau` may name proper time or a tau lepton; these are not one entity.
- `phi` may name an angle, the golden ratio or the phi meson; these are not one entity.
- `K` names a kaon only under a particle namespace.
- `kappa` is a declared model parameter/channel label and is not a kaon.
- `sqrt2` is a mathematical value and enters physics only through a declared equation or normalization.

## Equal-information arms

### Strong conventional baseline

Use typed particle identifiers, a directed decay graph, charge/flavour labels and an explicit `unobserved` final-state flag. Reject edges absent from the source graph and return all compatible histories for an incomplete record.

### NEXAH contract

Declare source namespace, context, selection/aperture, vertices, outgoing worldlines, visible record, transformation/reconstruction, I/L/A/U and claim ceiling. Reject cross-namespace identity and retain non-unique histories as unresolved.

## Gates

- `G1_TYPED_SOURCE_GRAPH`: all source relations resolve to declared particle nodes.
- `G2_NAIVE_GLYPH_COLLISION_EXPOSED`: an untyped glyph join can fabricate the proposed mixed chain.
- `G3_BASELINE_REJECTS_MIXED_CHAIN`: strong baseline rejects the chain as absent and cross-category.
- `G4_NEXAH_REJECTS_MIXED_CHAIN`: NEXAH rejects it and records the namespace/category loss.
- `G5_RECORD_IS_NONUNIQUE`: `e+ + missing` is compatible with at least three source histories.
- `G6_BASELINE_BLOCKS_UNIQUE_SOURCE`: strong baseline refuses a unique upstream claim.
- `G7_NEXAH_BLOCKS_UNIQUE_SOURCE`: NEXAH refuses it and types the residual.
- `G8_INCREMENTAL_DETECTION`: NEXAH catches a critical false closure missed by the strong baseline.

## Outcome rule

`G1`–`G7` demonstrate method functioning. Incremental detection utility requires `G8`. A tie is a valid null result. No novelty follows from a clearer vocabulary alone.
