# NEXAH method stewardship and bounded release path

Record date: 2026-09-16  
Record class: `MISSION_CONTROL_METHOD_CLOSEOUT`  
Operational effect: `NONE`  
Science Lab effect: `NONE`  
Release authority: `HUMAN_OWNER_ONLY`

## Closeout statement

This thread has produced a clearer NEXAH method statement, but no new physical
law and no authority to publish, deploy or disclose protected implementation
details.

The retained method is:

> NEXAH compares several declared observer-dependent records of one source,
> preserves the transformations and overlaps between those records, and keeps
> non-reconstructed information as an explicit residual rather than silently
> forcing every view into closure.

Compactly:

```text
NEXAH = {SOURCE, CUTS / MAPS, TRANSITIONS, OVERLAPS, RESIDUAL, RETURN}
```

## View and slice clarification

The historical `V` labels are primarily development and processing versions.
They are not automatically time slices or Fourier slices. A bounded connected
chain does exist in the historical IEEE work:

```text
V43 trajectory / derivative record
  -> V68 off-manifold sampling layer
  -> V69 constructed flow representation
```

This chain may be described as **observer- or aperture-slicing**: each declared
operator produces a map of the distinctions available through that operator.
The phrase "Fourier-like slicing" is permitted as an explanatory analogy only.
Use of the Fourier slice theorem would require a common source, explicit
projection operators, compatible coordinates and a demonstrated reconstruction
relation.

The maps show traces admitted by the cuts; they are not automatically direct
images of an underlying physical field.

## Nabe, Ghost Node and latent axis

The thread refined the earlier bird/cavity reading into a more precise working
object:

> A **Nabe** is a latent, possibly moving centerline or reference axis inferred
> from the organization of surrounding trajectories or phases.

It may organize a ring, spiral or vortex without itself being sampled by the
trajectory. In established language it is a candidate centerline, instantaneous
center, phase singularity, critical point or slow-manifold spine, depending on
the test. It is not admitted as a physical hidden node without persistence and
support tests.

Required evidence for promotion:

1. locate candidate zero- or minimum-speed points;
2. measure winding or circulation around them;
3. test persistence across grid, smoothing and observation cuts;
4. track movement through time where time-resolved data exist;
5. retain a null or corruption comparison.

## Space-time field mixture

A vortex cannot in general be represented by a scalar potential alone. The
appropriate candidate decomposition is:

```text
F(x,t) = -grad Phi(x,t) + grad_perp Psi(x,t) + H(x,t) + epsilon(x,t)
```

where:

- `Phi` is the potential or gradient component;
- `Psi` is the rotational or circulation component;
- `H` is a global/harmonic component sensitive to topology and boundary
  conditions;
- `epsilon` is the retained data/model residual.

This is a proposed scientific translation and test scaffold. It is not a
demonstrated decomposition of the historical V69 images.

## The `+1` residual

The `+1` is the information that does not close under the current map or model:

```text
+1 = model error
   + representation loss
   + unsupported boundary region
   + retained ambiguity
   + candidate unmodelled dynamics
```

It must not be interpreted automatically as new physics. It must also not be
discarded merely because a visual or model requires closure.

The historical IEEE chain already contains one concrete residual definition:

```text
r = d2c - a * |c|^p * |dc|^q
```

That residual is a model-specific predecessor, not the universal definition of
the NEXAH `+1`.

The distinctive candidate method is therefore not "finding mystery in every
remainder". It is **residual stewardship**: retaining the remainder with its
source, operator, support boundary and claim ceiling so that it can be compared
across later views.

## Self-knowledge as a recursive cut

The method also admits a bounded epistemic reading. An observer who belongs to
a changing system can produce only a situated record of that system, not an
exhaustive view from outside. In compact notation:

```text
Y_t = O_t(X_t)
```

The observed record is source-bound but is not identical to the total state:

```text
Y_t != X_t
```

Self-knowledge is therefore not an exhaustive view from outside. It is the
ability to know the conditions, blind regions and residual of one's own cut.
The return may resemble an earlier form while memory remains different.

Existing specialist architectures such as `CBP-I` retain their own definitions
and evidence gates. They are not required vocabulary for explaining the public
NEXAH method and are not expanded by this closeout.

## Boundary and red-rim rule

Regions outside measured support remain `UNKNOWN`, not zero and not evidence of
an external field. In the historical V69 clean reconstruction, interpolation
outside the convex hull was converted to zero before smoothing. A visible edge
or red-rim shadow can therefore mix source structure, boundary conditions and
rendering artifacts.

No across-boundary connection is promoted unless it is supported by an
overlapping independent cut or a declared extrapolation test.

## Stewardship agreement

The Human Owner and Mission Control adopt the following working rule:

> **Open in benefit. Testable in claims. Protected in the special recipe.
> Explicit in provenance.**

This is stewardship, not secrecy used to evade review.

### Tier 1 — public and shareable after owner approval

- purpose and ethical intent;
- the source/cut/map/transition/residual/return method;
- bounded diagrams and synthetic examples;
- falsifiable claims, limitations and negative results;
- sufficient definitions, inputs and metrics to evaluate any public scientific
  claim;
- attribution and provenance.

### Tier 2 — reviewable under controlled access

- sealed reference implementation;
- exact operator ordering required to reproduce a reviewed claim;
- frozen parameter set and environment;
- evaluation artifacts and independent-review access;
- cryptographic hashes proving that the reviewed package was not altered after
  the result was known.

### Tier 3 — private unless separately released by the Human Owner

- Homebase, cadastral, building, coordinate and household material;
- unpublished personal source narratives;
- implementation optimizations not necessary to assess a public claim;
- product-specific weights, orchestration and protected know-how;
- the complete integrated "Secret Sauce" recipe.

No public scientific claim may depend on inaccessible Tier-3 information. If a
claim cannot be tested without that information, the required portion must move
to Tier 1 or Tier 2, or the claim must remain private.

## How NEXAH can go out

The recommended first release is deliberately small:

### Release 1 — public orientation note

One illustrated note with one sentence of purpose, the six-part method, the
`+1` residual rule, one synthetic non-Homebase example and explicit non-claims.
Its purpose is understanding, not proof of a universal theory.

### Release 2 — reproducible synthetic demonstrator

One fresh public dataset with two or three declared cuts, an overlap/return
test, a residual ledger, ordinary baselines and one negative control. The
demonstrator must be independently runnable without the protected recipe.

### Release 3 — narrow methods contribution

Only after the demonstrator survives independent review: submit a bounded
methods or research-software contribution on observer-aware representation and
residual provenance. Do not lead with cosmology, hidden fields or universal
claims.

### Release 4 — applications

Invite collaborators to test the public method on their own domain data. Keep
the Human Owner's Homebase out of the application program. Operational or
safety-critical claims require separate domain validation.

## Public core statement

The recommended outward-facing statement is:

> NEXAH is an observer-aware mapping method for following what remains, what is
> lost and what is still unresolved when one source is represented through
> several partial views. It preserves provenance and residuals so that maps can
> be compared and returned to their evidence without pretending that any one
> map is the whole source.

## Present disposition

```text
METHOD_LANGUAGE                    RETAINED
RESIDUAL_STEWARDSHIP               RETAINED_AS_CANDIDATE_DISTINCTIVE_LAYER
SELF_KNOWLEDGE                     RECURSIVE_OBSERVER_DEPENDENT_CUT
V69                                HISTORICAL_CONNECTED_VIEW_CHAIN / NOT_NEW_RESULT
SECRET_SAUCE                       TIER_3_PRIVATE_BY_DEFAULT
PUBLIC_SCIENCE_REQUIREMENT         TESTABLE_CLAIMS_AND_SUFFICIENT_DISCLOSURE
HOMEBASE                           PRIVATE_AND_PARKED
RECOMMENDED_OUTWARD_FIRST_UNIT     ILLUSTRATED_ORIENTATION_NOTE
ACTIVE_RELEASE_AUTHORIZATION       NONE
ACTIVE_LAB_GATE                    NONE
```

This record closes the present conceptual synthesis. Any actual publication,
repository release, reviewer disclosure, patent action, licensing action or
public communication requires a new explicit Human Owner decision.
