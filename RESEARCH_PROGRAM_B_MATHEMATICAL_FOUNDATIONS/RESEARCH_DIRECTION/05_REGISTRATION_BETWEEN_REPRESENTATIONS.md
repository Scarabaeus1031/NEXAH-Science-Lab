# Registration Between Representations

Status: `BOUNDED RESEARCH NOTE`

Scientific novelty: `NOT CLAIMED`

Operational effect: `NONE`

## 1. Purpose

This note records one bounded mathematical subproblem: registration between
representations when the representation change is not known in advance and
must be estimated from correspondence evidence.

The note does not extend the repository architecture, governance, protocol,
source-freeze process or research-program structure. It does not establish a
new research direction. It records a question already covered by established
mathematical and engineering literature so that future work can use existing
registration terminology.

## Practical intuition

Registration is the task of determining how two or more representations should
be placed in correspondence. For example, it may be used when aligning two
satellite images of the same region, registering two point clouds of the same
object, matching landmarks between historical and modern maps, or estimating
relative camera motion from corresponding image features.

These examples are illustrative only. Each registration problem still requires
an explicitly declared representation, correspondence rule, transformation
class and comparison criterion.

> Registration determines how different representations correspond to one another when that correspondence is not already known.

## 2. Scope

This note concerns only:

- correspondences;
- registration;
- unknown representation changes;
- transformation estimation;
- stability of registration.

No other scientific, architectural or operational subject is introduced.

## 3. Existing Mathematical Homes

The subproblem belongs to established work in:

- image registration;
- point-set registration;
- multi-view geometry;
- photogrammetry;
- graph matching;
- manifold atlases;
- synchronization.

These fields remain authoritative for terminology, methods and prior results.

## 4. Connection to the Mathematical Core

The existing [Mathematical Core](01_MATHEMATICAL_CORE.md) defines representation
maps, representation changes, comparison defects, identifiability and
stability requirements.

This note refines only one case already admitted by that core:

```text
representation change

is

unknown

and therefore must be estimated from correspondence evidence.
```

The Mathematical Core remains unchanged and authoritative.

## 5. Minimal Research Question

> Under which conditions does a finite landmark configuration uniquely and
> stably determine a declared relative transformation under an explicitly
> declared transformation class?

## 6. Explicit Non-Claims

This note is not:

- a new geometry;
- a universal theory of registration;
- a Theory of Everything;
- a replacement for existing registration mathematics;
- evidence of mathematical novelty.

The protective boundaries in [Non-Claims](03_NON_CLAIMS.md) remain unchanged.

## 7. Recommendation

Any future work on this question belongs only inside the existing Research
Direction and must use established registration terminology and literature.

No new package is recommended.
