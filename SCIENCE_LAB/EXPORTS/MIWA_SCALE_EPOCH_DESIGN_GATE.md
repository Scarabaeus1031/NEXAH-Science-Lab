# MIWA Scale + Epoch Comparison — Design Gate

Date: `2026-11-13`

Status: `DESIGN_ONLY / NOT ADMITTED / NOT ACTIVE / NO RUN / NO GRAPH DELTA`

Identity reuse: `ART:MIWA:MAIN` · `MOD:OBSERVATORY_MIWA`

## Purpose

This gate specifies what must be true before MIWA may move from bounded static
Gaia presets to a larger catalog or a time-dependent proper-motion comparison.
It is not an implementation authorization, Study admission or astronomical
result.

## Bounded question

Can the same declared catalog sources be compared at two stated epochs while
preserving source identity, input epoch, coordinate frame, motion fields,
uncertainty and the difference from the current static projection?

## Required input contract

Every moving row must provide or explicitly mark as unavailable:

- stable source identifier and catalog release;
- right ascension, declination and reference epoch;
- proper motion in right ascension and declination with stated units;
- parallax and radial velocity when used by the propagation model;
- positional and motion uncertainty, including covariance when required;
- query fingerprint, source URL and retrieval timestamp.

Missing values remain `UNBOUND`; they may not be silently replaced by zero.

## Comparator and controls

1. **Static baseline:** the same selected rows at their source reference epoch,
   rendered by the current MIWA catalog projection.
2. **Epoch condition:** the same source IDs propagated to one declared target
   epoch by one frozen method and coordinate-frame contract.
3. **Zero-motion control:** a copied fixture with proper motion explicitly set
   to zero; expected screen displacement is zero within numeric tolerance.
4. **Round-trip control:** reference epoch → target epoch → reference epoch;
   report residual rather than forcing closure.
5. **Missing-data control:** rows without the required motion or uncertainty
   fields remain visible as excluded/unbound records.

## Metrics

- retained, excluded and unmatched source counts;
- angular displacement per source and aggregate quantiles;
- uncertainty envelope at both epochs;
- round-trip angular residual;
- p50 and p95 frame time, import time and memory estimate;
- visible difference between measured input, propagated view and normalized
  screen coordinates.

## Performance budget

The first authorized engineering fixture, if separately approved, is capped at
`20,000` rows. Target interaction budget is p95 frame time below `32 ms` on the
declared reference machine. Import must fail closed above the row cap; no
automatic sampling may change membership without an exported sampling record.

## STOP conditions

Stop before implementation or execution when any of these is unresolved:

- coordinate frame, epoch, unit or propagation method is ambiguous;
- the requested inference requires unavailable covariance or radial data;
- source IDs cannot be held across both comparison states;
- the zero-motion or round-trip control fails its declared tolerance;
- the performance cap requires silent row loss or provenance removal;
- the proposed display is described as physical entanglement, prediction or
  catalog membership evidence.

## Claim ceiling

At most this gate can support a source-bound **catalog coordinate comparison**.
Screen motion is not physical interaction; proximity is not association;
proper-motion propagation is not an ephemeris; a visual return is not identity.
No new Navigator identity, relation, Study, Finding, publication or deployment
is created by this document.

## Next permitted action

Editorial review of this contract only. Any implementation requires a separate
Human Owner authorization naming the frozen catalog query, method, reference
machine, tolerance, output receipt and reviewer.
