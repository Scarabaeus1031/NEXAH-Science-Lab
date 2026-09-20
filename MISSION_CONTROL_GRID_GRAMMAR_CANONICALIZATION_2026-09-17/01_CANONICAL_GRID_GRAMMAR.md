# Canonical NEXAH Grid Grammar

Version: `0.1`  
Status: `CANONICAL_DOCUMENTARY_BASELINE`  
Claim ceiling: `KNOWN_MATHEMATICS / TYPED_NEXAH_COMPOSITION`

## 1. Purpose

The Grid Grammar describes the typed passage of one carrier through an
addressed representation, a declared transformation, a cut or query, a seam
or frame transition, and a bounded return comparison.

It is a grammar for records and tests. It is not a claim that every visual
grid shares one ontology or physical mechanism.

## 2. Minimum valid record

Every valid Grid Grammar record MUST declare:

```text
carrier
domain and state type
grid specification
indexing and boundary policy
frame and coordinate convention
operator and parameters
cut/query rule
return rule
comparison metric or structural comparator
residual type
ILAU assignment criteria
provenance
claim ceiling
```

A record missing one of these fields is incomplete. Missing information MUST
be `U` or `NOT_DECLARED`; it MUST NOT be inferred from appearance.

## 3. Typed objects

### 3.1 Carrier

`M` is the declared source object or state. Its identity, domain, version and
provenance remain distinct from every view of it.

```text
CarrierSpec = (carrier_id, domain, state_type, version, provenance)
```

### 3.2 Grid

```text
GridSpec = (
  width,
  height,
  cells_or_vertices,
  coordinate_origin,
  indexing_policy,
  boundary_policy
)
```

Grid size is an addressing property. It is not by itself a winding number,
prime invariant, physical dimension or topological class.

### 3.3 Frame

```text
FrameSpec = (frame_id, anchor, basis, orientation, handedness, scale, metric)
```

Coordinates belong to a frame. A frame change MAY change coordinates without
changing the carrier.

### 3.4 Sector

A sector partition of width `w` is an ordered tuple

```text
B = (b_1, ..., b_k),  b_j > 0,  sum(B) = w.
```

Sector boundaries are cumulative sums of `B`. A partition MUST be declared;
it is not natural or predictive merely because it is visually symmetric.

### 3.5 Operator

```text
OperatorSpec = (
  operator_id,
  domain,
  codomain,
  parameters,
  invertible,
  involutive,
  lossless_on_declared_domain
)
```

Supported operator classes include translation, rotation, reflection,
scaling, shear, finite permutation, modular projection and explicitly defined
folds. A name or arrow without a map is not an operator.

### 3.6 View

```text
ViewSpec = (projection, color_map, normalization, interpolation, labels)
```

Color, opacity, material, layer order and camera position belong to the view
unless separately promoted by a declared test. Neon or bronze changes
visibility; it does not change ontology.

## 4. Canonical index map

For zero-based logical index `n`, offset `o` and grid width `w`:

```text
a = n + o
row_0 = floor(a / w)
col_0 = a mod w.
```

For one-based displayed index `i = n + 1`:

```text
row_1 = floor((i + o - 1) / w) + 1
col_1 = ((i + o - 1) mod w) + 1.
```

An implementation MUST state whether offsets act on logical indices,
displayed indices or source values.

## 5. TQR execution grammar

The canonical execution order is:

```text
M --T--> M_T --Q--> y --R--> M_hat.
```

### T — Transform / Trace

`T` applies a declared typed operator and records the transformation path.

### Q — Query / Cut / Address

`Q` selects or observes a declared portion, cell, quadrant, layer or aperture.
It records what entered the view and what was excluded.

### R — Reconstruct / Return

`R` maps the observation into a declared comparison frame and produces
`M_hat`. Return means comparison after transport. It does not mean reset of
the complete state.

```text
RETURN != RESET
```

## 6. QRT and HRT records

The acronyms name records, not competing execution orders.

### QRT measurement record

```text
QRTRecord = (quadrant_or_query, relation, time_or_index, frame, provenance)
```

It answers where, under which relation, and at which index or time an event
was addressed.

### HRT hinge record

```text
HRTRecord = (
  entry_frame,
  hinge_or_seam,
  exit_frame,
  transport_rule,
  residual,
  provenance
)
```

It answers how a trace crossed a boundary or changed frames.

## 7. Seam and rope state

A seam is a declared correspondence between two boundary sides. It MUST NOT
be treated as equality unless the return comparator establishes equality on
the declared domain.

The local rope/trace state is:

```text
K_gamma = (P, D, C, Phi, S)
```

where:

- `P`: point or position;
- `D`: directed tangent or orientation;
- `C`: curvature or bend descriptor;
- `Phi`: phase or twist descriptor;
- `S`: scale or thickness descriptor.

Side status is separate:

```text
side_status in {IN, OUT, CROSSING, UNRESOLVED}.
```

The seam residual is:

```text
r_Sigma = Compare(Transport(K_gamma_in), declared_seam_data).
```

## 8. Return and residuals

For observation `y = Q(T(M))` and return `M_hat = R(y)`:

```text
ReturnRecord = (
  reference_state=M,
  reconstructed_state=M_hat,
  comparator,
  tolerance,
  exact_match_count,
  mismatch_count,
  residual
)
```

Residuals MUST be typed as one or more of:

- `NUMERIC`: a declared metric value `d(M, M_hat)`;
- `STRUCTURAL`: relations, order or adjacency not returned;
- `SEAM`: mismatch after boundary transport;
- `PROVENANCE`: missing or conflicting generator history;
- `OUT_OF_SUPPORT`: the return rule is not defined there;
- `UNRESOLVED`: insufficient evidence or missing rule.

Zero numeric residual does not establish identical generator history.

```text
SAME_OUTPUT != SAME_GENERATOR
NUMERICAL_CLOSURE != INFORMATIONAL_CLOSURE
```

## 9. Closure vocabulary

### 9.1 Register closure

For `N` sequential records, width `w` and logical offset `o`, a row closes
when:

```text
(N + o) mod w = 0.
```

For `o = 0`, the example `9592 = 22 * 436` is exact register closure at width
22. It is a finite divisibility identity, not a universal property of primes.

### 9.2 Exact return closure

Exact return closure holds only when the declared comparator reports equality
on the complete declared domain and no required information is unaccounted.

### 9.3 Tolerance closure

Tolerance closure holds when a declared metric satisfies:

```text
d(M, M_hat) <= epsilon.
```

The tolerance, units and authority MUST be recorded.

### 9.4 Near-closure

Near-closure preserves a nonzero difference as a residual trace. It MUST NOT
be labeled exact closure.

### 9.5 Visual closure

A closed contour or aligned rendering is view-local. It has no mathematical
closure authority without a declared comparator.

## 10. Cover, cut, kernel, gap and shadow

For state regions `U_i` inside declared frame `M`:

```text
Cover  = {U_i}
Kernel = intersection_i U_i
Gap    = M \ union_i U_i
Shadow_i(T) = U_i symmetric_difference T(U_i).
```

These definitions require a declared ambient set, membership rule and
operator. A visible overlap is not sufficient.

## 11. Standard transformation statements

- Rotation preserves Euclidean lengths and oriented area when declared in an
  appropriate Euclidean frame.
- Reflection preserves Euclidean lengths but reverses orientation.
- Uniform positive scaling preserves angles and scales lengths.
- The shear matrix `[[1,k],[0,1]]` has determinant `1` and preserves oriented
  area, but not generally lengths or angles.
- The Fibonacci identity
  `F_(n+1) - phi F_n = (-1)^n phi^(-n)` is an exact residual formula; it does
  not make irrational scaling an exact finite closure.

## 12. ILAU accounting

Every return MAY be accompanied by:

- `I`: retained or tested invariant content;
- `L`: content lost through cut, projection, frame or discretization;
- `A`: content added by representation, labels, interpolation or styling;
- `U`: unresolved content or absent test.

ILAU is an audit record. It is not a fifth state space, truth oracle or
physical mechanism.

## 13. Provenance and claim ceiling

Every record SHOULD preserve:

```text
source_id
source_hash
generator_id and generator_hash if available
parameters
runtime and dependency versions
output_hash
timestamp
actor or process
comparison rule
claim ceiling
```

Missing generator provenance MUST be `UNRESOLVED`; a visually matching script
MUST NOT be assigned by filename similarity alone.

## 14. Conformance levels

### G0 — Visual vocabulary

Labels or diagrams exist, but typed inputs, maps or comparisons are absent.

### G1 — Documentary grammar

The carrier, grid, operator, cut, return and residual are defined in prose or
schema.

### G2 — Executable demonstrator

The definitions are implemented with deterministic inputs and bounded output.

### G3 — Reproducible audit

The implementation has portable paths, dependency lock, assertions, negative
controls, machine-readable results and source/output hashes.

### G4 — Validated claim

An independently replayed result supports a predeclared claim on its stated
domain. G4 does not imply a new theorem or physical mechanism.

## 15. Prohibited inference

The Grid Grammar does not permit these shortcuts:

```text
grid alignment -> universal law
finite divisibility -> stable factor
color or material -> physical substance
same coordinates -> same object
same value -> same generator
selected numerical identity -> causal coupling
plot resemblance -> topology
closure of a row -> closure of a system
```

## 16. Canonical compact statement

> The NEXAH Grid Grammar is the typed passage of one carrier through a declared
> grid, frame, transformation, cut, seam and return. Closure is local to its
> domain and comparator; every loss, addition and unresolved remainder remains
> explicit.

