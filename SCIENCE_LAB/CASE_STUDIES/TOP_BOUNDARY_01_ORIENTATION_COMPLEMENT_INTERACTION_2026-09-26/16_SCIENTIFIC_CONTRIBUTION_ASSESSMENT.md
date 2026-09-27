# 16 — Scientific Contribution Assessment

**Assessment date:** `2026-09-27`  
**Mission-Control verdict:** `PLAUSIBLE_METHOD_CONTRIBUTION_CANDIDATE`  
**Physical result:** `NONE`  
**Novel physics:** `NOT_SUPPORTED`

## Decision first

`TOP-BOUNDARY-01` is potentially scientifically contributive, but not because
the current synthetic result discovers a new interaction or optical law.

Its credible candidate contribution is a **measurement and reporting
protocol** that combines:

1. a complete four-state interaction contrast;
2. additive null arms and a known coherent positive control;
3. eight registered boundary orientations;
4. native-frame and common-frame signed residual maps;
5. explicit separation of interaction strength from resampled view error;
6. preregistered stop rules, uncertainty requirements and claim ceilings.

That bundle is coherent and reproducible. Whether it is distinct enough to
publish as a method, benchmark or negative/result protocol remains open.

## What is already established

- The digital implementation matches its registered algebra.
- All 24 state/orientation records exist and all 12 deterministic tests pass.
- Linear intensity addition produces a numerical null interaction.
- Coherent field addition reproduces the expected Fourier cross term.
- Native interaction strength is stable across the eight synthetic
  orientations, while diagonal common-frame return is strongly
  interpolation/sampling-sensitive.
- The package already prevents display artifacts from being interpreted as
  physical interactions.

## What is established prior art

The following ingredients are not novelty claims:

- `R(B1+B2)-R(B1)-R(B2)+R(0)` is a two-factor interaction or mixed finite
  difference.
- For coherent fields, the surviving term is the standard pairwise
  interference cross term.
- Multi-slit experiments routinely use inclusion-exclusion combinations of
  separately measured aperture states; higher-order versions are used in
  Sorkin-parameter tests. See the experimental discussion in
  [Nature Communications 8, 13987](https://www.nature.com/articles/ncomms13987)
  and the boundary-condition analysis in
  [Scientific Reports 5, 10304](https://www.nature.com/articles/srep10304).
- Edge orientation, oversampling, binning bias and noise sensitivity are
  established imaging-metrology concerns. See the primary study
  [Modified slanted-edge method and multidirectional MTF estimation](https://doi.org/10.1364/OE.22.006040).
- Aperture geometry, edge quality, calibration traceability and uncertainty
  are standard metrology requirements. See
  [NIST SP 250-102](https://doi.org/10.6028/NIST.SP.250-102) and the NIST study
  on [parametric uncertainty in optical dimensional measurements](https://www.nist.gov/publications/parametric-uncertainty-nanoscale-optical-dimensional-measurements).

## Where a distinct contribution might remain

The candidate is not the formula by itself. It is the integrated experimental
discipline around it:

```text
controlled boundary states
  + orientation-complete acquisition
  + native versus returned-frame comparison
  + null and positive controls
  + signed interaction localization
  + uncertainty and stop ladder
  + explicit relation/view claim boundary
```

A contribution would be supported if this protocol demonstrably improves at
least one of the following over an established optical baseline:

- identification of detector, registration or mask non-additivity;
- separation of physical interaction strength from raster-return artifacts;
- reproducibility of orientation-dependent aperture measurements;
- localization and honest classification of a null or model mismatch;
- transport of the same controlled comparison contract to another bounded
  measurement system without mechanism transfer.

## Required gates

| Gate | Pass condition |
|---|---|
| Prior-art gate | targeted review finds no already-identical protocol and states the nearest baselines |
| Apparatus gate | source, mask, geometry, detector, calibration and safety are fully bound |
| Positive-control gate | coherent arm recovers the expected finite-slit interaction within the preregistered uncertainty |
| Artifact gate | diagonal return residual is explained or bounded by independent sampling/registration controls |
| Baseline gate | comparison against ordinary Fourier/MTF and uncertainty workflow identifies any incremental value |
| Repetition gate | result repeats across blocks and preferably a second apparatus or independent analyst |
| Contribution gate | evidence supports a method, benchmark, null, dataset or empirical claim with a precise ceiling |

## Downgrade and stop rules

Downgrade the candidate to `INTERNAL_REPRODUCIBILITY_FIXTURE` when:

- physical execution only reproduces the known coherent cross term and the
  protocol adds no measurable clarity over established analysis;
- diagonal effects are fully explained by interpolation or registration;
- uncertainty is too large to distinguish interaction from apparatus drift;
- the prior-art audit identifies an already-equivalent complete protocol.

Stop any stronger interpretation when lower-level detector, mask, alignment,
coherence or calibration explanations remain open.

## Current classification

```text
SCIENTIFIC_CONTRIBUTION_CANDIDATE = YES
CONTRIBUTION_TYPE = METHOD_PROTOCOL_AND_BENCHMARK
NEW_OPERATOR = NO
NEW_PHYSICS = NO
PHYSICAL_EVIDENCE = NONE
PUBLICATION_READY = NO
ACTIVE_RESEARCH = NO
NEXT_GATE = PRIOR_ART_PLUS_PHYSICAL_EQUIPMENT_BINDING
```
