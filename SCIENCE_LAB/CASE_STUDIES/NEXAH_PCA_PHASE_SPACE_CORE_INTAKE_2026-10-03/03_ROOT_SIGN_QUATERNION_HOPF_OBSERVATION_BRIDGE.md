# Root/sign -> quaternion -> Hopf -> observation bridge candidate

Date: `2026-10-03`

Status: `FORMAL BRIDGE CANDIDATE / CONDITIONAL F40 AND FINITE O RECONSTRUCTED / GLOBAL RETURN OPEN / NO ACTIVATION`

## Purpose

The recovered Root7, Root-40 quaternion, Hopf, grid and PCA records support one
explicit bridge question. The follow-on exhaustive test now establishes a
conditional finite bridge under declared axioms, but not its historical use.
The candidate chain is

```text
Root/sign carrier
  --F--> H\{0}
  --normalization--> S3
  --pi_Hopf--> S2
  --observation--> Grid / PCA / Record.
```

Every arrow is separately typed. Shared labels, a four-coordinate display or
visual resemblance may motivate the chain but cannot supply a missing map.

## 1. Source carrier

Let

```text
K3 = Q(sqrt(2),sqrt(3),sqrt(5))
K4 = Q(sqrt(2),sqrt(3),sqrt(5),sqrt(7)).
```

The real embeddings are indexed by independent sign choices:

```text
Sigma3 = {+1,-1}^3,  |Sigma3| = 8
Sigma4 = {+1,-1}^4,  |Sigma4| = 16.
```

This is the exact content of the Root7 extension used here. `Sigma4` is a
finite sign carrier or embedding index. It is not quaternion space, `S3`, a
Hopf fiber or a PCA basis.

## 2. Encoding map F

The first required map is

```text
F : Sigma4 -> H\{0}
F(s) = a(s) + b(s)i + c(s)j + d(s)k.
```

To define `F`, the four coefficient functions `a,b,c,d` must be supplied,
including their scale, ordering, orientation and behavior under each sign
flip. A valid candidate must also state which source relations it intends to
preserve: adjacency in the four-cube, a group action, an order, a metric, a
provenance relation or only a label correspondence.

The follow-on adopts the explicit coefficientwise sign action, ordered basis
`(1,i,j,k)` and all-positive Root-40 anchor. These axioms give

```text
F40(s0,s1,s2,s3)=2s0+2s1 i+4s2 j+4s3 k.
```

This defines all sixteen source states and never reaches zero. It is a minimal
equivariant candidate, not a recovered historical rule.

The registered record

```text
q0 = 2 + 2i + 4j + 4k,  N(q0) = 40
```

is a positive-control quaternion point. It does not define `F` on all sixteen
source states and does not show that the sign coordinates generate Hamilton
multiplication.

## 3. Normalization to S3

For a nonzero quaternion `q=a+bi+cj+dk`, define

```text
nu(q) = q / ||q||,
||q|| = sqrt(a^2+b^2+c^2+d^2).
```

Then `nu(q)` lies in the unit-quaternion three-sphere `S3`. For the registered
point,

```text
q_hat0 = nu(q0) = (1 + i + 2j + 2k) / sqrt(10).
```

Normalization is undefined at zero and removes positive radial scale. It does
not create the coefficient semantics or repair an underdefined `F`.

## 4. Hopf quotient

Using the convention `q_hat = z1 + z2 j`, with `z1,z2 in C`, the standard
Hopf map is

```text
pi_Hopf(z1,z2) =
  (2 Re(z1 conjugate(z2)),
   2 Im(z1 conjugate(z2)),
   |z1|^2 - |z2|^2) in S2.
```

Its fibers are common `U(1)` phase orbits. Under this convention the Root-40
positive control gives

```text
z1 = (1+i)/sqrt(10)
z2 = (2+2i)/sqrt(10)
Q0 = pi_Hopf(q_hat0) = (4/5, 0, -3/5).
```

Thus lowercase `q_hat0` is an internal representative in `S3`, while uppercase
`Q0` may denote its external base point or equivalence class in
`S3/U(1) ~= CP1 ~= S2`. This convention is local to this bridge and must not be
silently assigned to every historical `Q` glyph.

## 5. Observation maps to grid and PCA

The Hopf output is not yet a Grid or PCA record. At least one observation map
must be declared:

```text
O_grid : S2 -> G
```

for a named grid carrier `G`, including discretization, cell assignment,
orientation and collision behavior; or

```text
phi   : S2 -> R^m
P_V   : R^m -> R^k
O_PCA = P_V o phi,
```

where `phi` is a declared feature encoder and `P_V(x)=V_k^T(x-mu)` uses a PCA
basis fitted on a named population with a named preprocessing contract.

Therefore:

```text
S2 != PCA score space
Hopf fiber phase != PCA phase
Grid cell != Hopf equivalence class
```

Any screen or plot is a further rendering map from `G` or `R^k` into display
coordinates.

## 6. Complete bridge contract

The chain becomes mathematical only when the following tuple is versioned:

```text
B = (Sigma4, F, nu, pi_Hopf, O, R)
```

where `R` is the final rendering/record map. The record must state:

1. the exact source states and source relations;
2. formulas or lookup tables for `F`;
3. quaternion basis and multiplication convention;
4. norm and zero handling;
5. left/right `U(1)` action and Hopf convention;
6. grid or feature/PCA observation map;
7. preserved, lost, added and unavailable structure at every arrow;
8. a replay fixture and at least one negative control.

Recommended negative controls include permutation of sign coordinates,
replacement of `F` by a random injective assignment, radial rescaling before
normalization, global fiber-phase changes, and PCA refits on changed
populations. These distinguish genuine invariance from screen stability.

## 7. Current decision

The following are established locally:

- the `8 -> 16` Root7 sign-carrier extension;
- the Root-40 quaternion point and its norm;
- unit-quaternion normalization for nonzero quaternions;
- the standard Hopf map and the positive-control image of `q0` under the
  convention stated above;
- the existence of historical grid, PCA, phase-space and navigation records.

The following are now established conditionally by the exhaustive candidate:

- `F40` on all sixteen states under the declared coefficientwise axioms;
- four Hopf base points, each with a four-state discrete phase fiber;
- an injective `4 x 4` joint observation `(base point, phase index)`;
- an explicit five-coordinate base-plus-phase feature record.

The following remain open:

- independent source evidence for the coefficientwise basis assignment;
- identity, if any, with the P7 four-class quotient;
- a recovered historical OIL/RIS cross-base transport rule and its relation to
  the tested standard Hopf connection and requantization candidate;
- the historical fitted PCA population and replay contract;
- evidence that the historical screens used this chain.

Accordingly, this document registers a precise conditional bridge and its test
boundary. It does not promote the bridge into a historical or cross-domain
mechanism.

## Follow-on result

`04_F_AND_O_RECONSTRUCTION_FINDING.md` supplies a conditional source-wide map

```text
F40(s0,s1,s2,s3)=2s0+2s1 i+4s2 j+4s3 k
```

under three explicit bridge axioms. Exhaustive evaluation shows that its
sixteen normalized points project to four Hopf base points with four-state
discrete phase fibers. The joint record `(base point, phase index)` recovers
all sixteen states. Historical use, the P7 class identification and a global
cross-base return connection remain unverified.
