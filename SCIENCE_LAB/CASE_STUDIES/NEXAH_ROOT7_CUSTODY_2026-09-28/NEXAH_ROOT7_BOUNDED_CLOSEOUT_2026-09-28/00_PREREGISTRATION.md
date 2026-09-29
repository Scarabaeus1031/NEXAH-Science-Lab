# NEXAH Root7 — bounded closeout preregistration

- Experiment ID: `NEXAH_ROOT7_BOUNDED_CLOSEOUT_2026-09-28`
- Authority: Human Owner instruction of 2026-09-28: perform exactly the three proposed Root7 closeout tests
- Repository role: Science Lab research package; no NEXAH Core adoption
- Lock timestamp: `2026-09-28T16:13:30Z`
- Prior-result exposure: `YES`
- New combined-closeout result known at lock time: `NO`

This is a retrospective, bounded closeout of a previously explored package. The
component reports and earlier scripts were known before lock. Therefore this is
not a blind discovery experiment and cannot establish novelty or independent
confirmation. It may close the stated questions under the frozen finite models.

## Frozen source boundary

Only the files and hashes in `01_SOURCE_MANIFEST.sha256` may supply Root7 source
claims. Missing source bindings count as missing; they may not be reconstructed
from a numerical coincidence. The existing E8 package remains a reference and
is not a Root7 identity claim.

## Test 1 — axis/313 identifiability

### Domain

The four labelled channels are ordered `(sqrt2, sqrt3, sqrt5, sqrt7)`. An
admissible integer Euclidean scale vector has positive entries and squared full
diagonal seven. Within entries `{1,2}`, the candidates are exactly the four
permutations of `(2,1,1,1)`.

For every candidate, enumerate the 24 lattice points of the corresponding
stretched box and all paths

`Q0 -> Q1 -> Q2 -> Q3`

with squared radii `0,3,4,7`, with the last two transitions positive unit-axis
steps. Preserve the source convention that the middle transition is the fourth
channel's `47 -> 74` endpoint-bit flip. If the fourth axis is stretched, its
interior value `1` is not silently relabelled as the old terminal `74` state.

### Decision

- one surviving long-axis candidate: `SUPPORTED_UNIQUE`;
- more than one: `NON_IDENTIFIABLE`;
- none: `REFUTED`.

No visual axis name, prime label, E8 relation, or coordinate rename may break a
tie.

## Test 2 — route and 404 information boundary

### Frozen model

Use `START=(1,1,0,0)`, `S=(0,0,2,0)`, `L=(0,0,0,1)` and compare exactly the
operator histories `SL` and `LS`. Compare the fibers induced by:

1. final endpoint only;
2. static `4774` label;
3. initial/final `47/74` only;
4. ordered 3D projection history;
5. ordered `47/74` history;
6. typed operator sequence.

Also retain the synthetic 404 gate definition from checkpoint 05:

`phase=0 AND tilt=0 AND error=0 AND open_gap AND slow`.

Run exactly five location scenarios: both aligned, tip only, inner hinge only,
both gaps closed, and both too fast. Gate-location outcomes are model results,
not evidence that a NEXAH source binds 404 to either lattice point.

As a second information-loss control, enumerate payloads `m=-1000..1000` under
`v(m)=(2m,m,m,m)`, `r(m)=7m^2 mod 11`, and the unique SCN index `k in 0..10`
with `(7801+8k) mod 11 = r(m)`. Test whether the residue/index recovers signed
payload uniquely.

### Decision

- endpoint uniquely separates `SL` and `LS`: `ENDPOINT_SUFFICIENT`;
- otherwise: `ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED`.

The payload route is `INJECTIVE_ON_REGISTERED_DOMAIN` only if every signed
payload has a unique `(residue,k)` record; otherwise it is
`MANY_TO_ONE_CLASSIFIER`.

## Test 3 — source-bound bridge identification

### Required bridge contract

An identified bridge must provide exactly one source-bound, typed, unit-bearing
map for every required arrow:

- SCN residue `r in Z_11 -> regulator pair (a,b)`;
- SCN residue/regulator state -> 4D Root7 state;
- SCN residue/regulator state -> 7/6/13 angle state;
- regulator/angle state -> named gate pair and 404 decision.

It must also predict at least one held-out trace not used to choose the map.
The only executable SCN-to-regulator candidates admitted are those already
written in checkpoint 13:

- `F_centered_1`: `d=r` for `r<=5`, otherwise `r-11`; `(a,b)=(-d,d)`;
- `F_shifted_4`: `d=r-5`; `(a,b)=(-4d,4d)`.

Evaluate both with the existing gate predicate
`abs(b-a)<8`, `abs((a+b)/2)<6`, and
`hypot(4.2*(b-a),6.2*((a+b)/2))<34`.

No new fitted map is allowed. Absence of a required arrow is not repaired.

### Decision

- all required arrows present, unique, typed, unit-bearing and independently
  predictive: `IDENTIFIED`;
- multiple incompatible source candidates or any missing required arrow:
  `NOT_IDENTIFIED`;
- a complete unique contract that fails its frozen predictions: `REFUTED`.

## Overall closeout rule

The package is `CLOSED_BOUNDED` if all three tests execute without assertion
failure, all required artifacts are retained, and a clean replay produces the
same canonical scientific-result hash. Positive findings, negative findings,
`NON_IDENTIFIABLE`, and `NOT_IDENTIFIED` are all valid closeout outcomes.

The package cannot by itself authorize Core promotion, physical interpretation,
navigation, routing, encryption, E8 identity, publication, or a new RUN series.
