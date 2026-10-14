# Envelope archaeology and UTG typing

Date: `2026-10-06`

Status: `CONTROLLED_FRAMEWORK_VOCABULARY / TRANSVERSAL_ROLE / NO_NEW_FAMILY / NO_CLAIM_PROMOTION`

## Decision

`Envelope` is retained as a controlled UTG role, not introduced as a new
scientific object, universal operator or eighth Functional Family. The term is
established in mathematics, signal processing, dynamical systems, geometry and
software. NEXAH's contribution is the explicit routing between several typed
uses while keeping their carriers, operators and evidence distinct.

The shortest operational definition is:

> An envelope is a declared boundary, modulation, containment or record layer
> around a carrier. It makes an inside/outside, admissible range or observation
> context explicit without becoming identical to the carrier.

## Why the type split is necessary

The archaeology recovered repeated but non-identical uses:

- amplitude, beat and standing-wave envelopes;
- geometric shells and field boundaries;
- dynamical containment and coherence regions;
- upper/lower bounds and residual corridors;
- observer and projection frames;
- record and provenance containers;
- discrete phase-layer constructions;
- closure, return and memory views;
- a symbolic `Stability Envelope` written as `S = g(zeta)`.

Treating all of these as one mechanism would erase the very distinctions UTG
is intended to preserve.

## Controlled subtype register

| ID | Name | Minimum declaration | Primary family routes | Current status |
|---|---|---|---|---|
| `ENV-SIG` | Signal envelope | signal/carrier, amplitude rule, time or sample domain | F1, F4 | established neighboring concept; object-specific use required |
| `ENV-GEO` | Geometric envelope | ambient space, boundary/shell, inside/outside rule | F2, F5 | established neighboring concept; NEXAH mapping is framework-level |
| `ENV-DYN` | Dynamical envelope | state space, evolution, containment or invariance criterion | F3, F5 | formal only when the criterion is defined |
| `ENV-BOUND` | Bound/residual envelope | measured quantity, lower/upper bounds, tolerance | F1, F7 | method role; does not explain the residual |
| `ENV-OBS` | Observer envelope | frame, projection/cut, accessible observables | F1, F2, F4 | perspective role; not a physical shell by default |
| `ENV-REC` | Record envelope | payload, scope, time, evidence and provenance | F1, F7 | established software/evidence pattern |
| `ENV-LAYER` | Layer envelope | index set, layer rule, adjacency or ordering | F2, F5 | constructed register until carrier semantics are supplied |
| `ENV-INT` | Integration/return envelope | source, completed history, return/closure rule, retained memory | F3, F7 | NEXAH synthesis role; not a universal return law |
| `ENV-STAB` | Stability envelope | stability quantity, threshold parameter, domain, estimator and failure rule | F4, F5, F6, F7 | formal candidate only |

Envelope is therefore transversal across canonical `CF:F1-F7`. It is not
`CF:F8`, `HL:F8` or `CAND:F8_AXIS_EXTENSION`.

## Recovered NEXAH lineage

### Executable modulation precursor

`PROTO_CORE/FIELD_LAYER/NAVIGATION_ENGINE/scripts/core/navigator_v28_envelope_field.py`
uses

```text
envelope(t) = 1 + 0.4 sin(0.03 t)
```

to modulate an attractor-field strength. This is a bounded computational
prototype of `ENV-SIG`; it is not evidence for a new envelope law.

### Vessel and shell lineage

`RESEARCH/CORE_CONCEPTS/vessel_geometry.md` uses bounded coherence regions,
transport shells and recursive coherence envelopes. These are routed to
`ENV-GEO` or `ENV-DYN` depending on whether a boundary or an evolution-based
containment property is actually defined.

### Two-cut, shadow and record lineage

The Transversum / Two-Cut synthesis declares one carrier, two bounded readings,
a binder, a return comparison and a typed residual. Its standing resultants
belong to `ENV-SIG`; its declared sentence/record boundary belongs to
`ENV-REC`; a residual corridor belongs to `ENV-BOUND`.

### Observer, closure and phase-layer lineage

OIL/RIS, Crown Aperture and Triple-19 plates use outer observer or phase-layer
envelopes. They remain `ENV-OBS`, `ENV-INT` or `ENV-LAYER` constructions until
their carrier, operator and invariance semantics are separately declared.

### Phi Orbit lineage

The Phi Orbit plate contains the operator vocabulary

```text
phi   Golden Expansion     r_n = r_0 phi^n
tau   Transition Flow      delta s = f(tau)
zeta  Stability Envelope   S = g(zeta)
O     Center Reference     O = 0
```

The displayed phi scales are the exact geometric progression
`1, phi, phi^2, ...`. They do not by themselves define a logarithmic spiral;
an angle-to-radius relation is also required. Calling each phi step an octave
is retained as historical visual language, not as the acoustical `2:1`
definition of an octave.

The archived executable
`EXPERIMENTAL/BUILDER_LAB/ARCHIVE_ENGINE/archived/analysis/navigation_level39_phi_orbit_spiral_lock.py`
detects consecutive speed ratios near phi under a fixed tolerance. It is a
historical computational candidate, not an implementation or validation of
`S = g(zeta)`.

## Formalization gate for `ENV-STAB`

`S = g(zeta)` remains a signature until all of the following are supplied:

1. carrier and state space;
2. stability quantity or estimator;
3. meaning and domain of `zeta`;
4. explicit construction of `g`;
5. lower/upper or membership rule;
6. time horizon and scale;
7. null/comparator and sensitivity analysis;
8. failure and stop rule;
9. replayable record and residual.

Admissible example forms include a sublevel region

```text
S_zeta = {x : Lambda_T(x) <= zeta}
```

or a bounded observation corridor

```text
L_zeta(t) <= y(t) <= U_zeta(t).
```

Neither form is adopted as the universal NEXAH definition. They demonstrate
what a typed formal candidate would need to expose.

## Claim ceiling

```text
ENVELOPE_AS_ESTABLISHED_NEIGHBORING_TERM       = YES
NEXAH_ENVELOPE_AS_CONTROLLED_TRANSVERSAL_ROLE = YES
ALL_ENVELOPE_USES_ARE_ONE_OBJECT              = NO
ENVELOPE_IS_A_NEW_FUNCTIONAL_FAMILY           = NO
S_EQUALS_G_ZETA_FORMALIZED                    = NO
PHI_STABILITY_EFFECT_VALIDATED                = NO
NEW_RESEARCH_CYCLE_ACTIVATED                  = NO
```

## Navigator placement

The Navigator exposes a dedicated `#envelope` lens. It is a definition and
routing surface: visitors can distinguish subtype, carrier declaration,
family route, current evidence state and claim ceiling before following the
existing Sequence, Lineage, Dynamics or Evidence views.

