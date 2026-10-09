# BLOCK-01 result assessment

Date: `2026-10-06`

## Decision

```text
SUPPORTED_AS_BOUNDED_BLOCK_PROJECTION_FIXTURE
```

All nine frozen gates passed. The result validates a finite mathematical and
computational fixture. It does not validate the historical physical labels of
the supplied TESSARNA/phi visuals.

## Execution summary

```text
unit tests                         8 / 8 PASS
G01_CARRIER_COUNTS                 PASS
G02_SIX_FACE_JANUS                 PASS
G03_ROTATION_GROUP                 PASS
G04_Q4_BRIDGES                     PASS
G05_BLOCK_GLUE_RETURN              PASS
G06_PROJECTION_COLLISION           PASS
G07_FOURIER_BOUNDARY               PASS
G08_ENTROPY_BOUNDARY               PASS
G09_REPLAY                         PASS
```

## Exact retained structure

- `Q3` has 8 vertices and 12 edges.
- `Q4` has 16 vertices and 32 edges.
- The fourth binary coordinate creates exactly eight pairwise Q3 bridges.
- The cube has six directed boundary faces in three Janus pairs.
- The proper cube rotation group contains exactly 24 matrices.
- Two face-glued unit cubes expose ten boundary faces.
- Rotation followed by its inverse returns the exact cell-address set.

## Registered information-loss findings

### Projection

Distinct 2x2x2 occupancy masks `22` and `23` have identical maximum
projections along all three coordinate axes. Projection equality therefore
does not identify the carrier.

### Fourier

A cyclic translation of the 8x8 cross mask preserves Fourier magnitude to
floating-point tolerance while changing the complex spectrum. Retaining phase
permits inverse return with maximum error approximately `1.60e-15`.

The residual is classified as ordinary float64 numerical error, not a signal.

### Entropy

The five-pixel cross and dispersed five-pixel mask both have normalized
Shannon entropy

```text
H = ln(5) = 1.6094379124341003 nats
```

but their grid adjacency counts are `4` and `0`. Entropy equality therefore
does not identify geometry.

## Navigator disposition

```text
EXISTING MODULE              MOD:TESSAREC
NEW CONNECTION FAMILY        NO
NEW PHYSICAL CLAIM           NO
BLOCK FIXTURE                SUPPORTED
PROJECTION BOUNDARY          SUPPORTED
FOURIER/ENTROPY IDENTITY     REJECTED
NAVIGATOR ROUTE CHANGE       NOT YET APPLIED
```

BLOCK-01 is suitable as a tested supporting fixture for the existing Tessarec
route. Adoption, placement and UI design remain separate decisions.

