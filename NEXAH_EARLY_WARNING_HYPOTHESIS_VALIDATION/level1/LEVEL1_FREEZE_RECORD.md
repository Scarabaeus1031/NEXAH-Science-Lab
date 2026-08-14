# Level-1 Freeze Record

Freeze time: 2026-08-13T03:35:47+02:00  
Protocol: `NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC` V1.0.0  
Disposition: `NOT_ADOPTED`

## Freeze decision

The ten controlling validation documents and the historical demonstrator were
read before implementation. The reviewed protocol is internally consistent
for deterministic implementation. No reviewed scientific parameter was
changed.

The manifest makes two implementation details explicit that were necessary to
remove hidden defaults: a deterministic Newton tolerance of `1e-12` (maximum
100 iterations) and four independent PCG64 Wiener channels for the already
frozen `sigma=0.01` mechanical-power diffusion. These specify numerical
execution; they do not alter the reviewed model, paths, seeds, stress, outcome,
indicator, comparator, or endpoint definitions.

The manifest SHA-256 is
`d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`.
The simulator verifies its own finalized source hash against this manifest and
fails closed on drift.

## Separation and scope

Development and evaluation paths/seeds are separate manifest objects.
Verification generated only one registered development path. Evaluation raw
states and indicator performance were not inspected. The simulator contains no
indicator, comparator, persistence, event, plotting, or outcome code.

Raw state is serialized directly from the integration record. It is never
smoothed, clipped, reshaped, suffix-replaced, or visually adjusted. All
stochastic forcing is applied during integration with explicit seed and
`sqrt(dt)` scaling; no direct angle noise or implicit global RNG is used.

## Boundaries

`APPLICATION_001_CHANGED = NO`. Canonical NEXAH, ORION, NEXAHEDRON,
Experience, Interface V1, LYRA, and LUCY were not changed or invoked. The
scientific hypothesis remains untested.
