# Phase B preregistration — local orientation and quaternion audit

Status: `FROZEN_BEFORE_PHASE_B_EXECUTION`

## Question

After the Phase-A global C-alpha body-frame alignment, how much local backbone
orientation variability remains across the 1XQQ conformer ensemble, and do the
frame, quaternion, double-cover and Hopf-view implementations respect their
declared mathematical boundaries?

Model index remains an unordered conformer index, not time.

## Frozen carrier and local frame

- source and global body-frame carrier: unchanged from Phase A;
- residues: chain-A integer addresses `1..76` present in all 128 models;
- required atoms per residue: `N`, `CA`, `C`;
- missing or duplicate atom: fail closed;
- reference local frames: model `1` after Phase-A global alignment.

At each residue, with origin `CA`:

```text
e1 = normalize(C - CA)
v  = (N - CA) - dot(N - CA, e1)e1
e2 = normalize(v)
e3 = e1 cross e2
F  = [e1 e2 e3]
```

`F` stores the basis vectors as columns and must be orthonormal with
`det(F)=+1`. A norm below `1e-8 Å` is degenerate and rejected.

## Relative orientation and quaternion convention

```text
R_local(m,i) = F(1,i)^T F(m,i)
d_SO3        = acos(clamp((trace(R_local)-1)/2,-1,1))
```

Quaternion convention: scalar-first `q=(w,x,y,z)`, Hamilton product/right-hand
rotation, unit norm. Canonical sign is the hemisphere `w>0`; when `w=0` within
`1e-15`, the first nonzero element of `(x,y,z)` is positive. Rotation identity
is always the equivalence class `q ~ -q`, never the raw signed tuple.

## Hopf boundary

The recorded noninvertible view is:

```text
h(q) = (2(wy+xz), 2(xy-wz), w^2+x^2-y^2-z^2) in S2.
```

The frozen fiber action uses `alpha=0.73 rad` and complex pairs
`z1=w+ix`, `z2=y+iz`:

```text
(z1,z2) -> (exp(i alpha)z1, exp(i alpha)z2).
```

It must preserve `h(q)` while generally changing the represented SO(3)
rotation. No inverse Hopf reconstruction is claimed and no fiber coordinate is
discarded from the controlling SO(3)/quaternion records.

## Frozen controls and gates

1. all `128*76=9,728` local frames valid;
2. maximum frame orthonormality error `<=1e-12`;
3. maximum `|det(F)-1| <=1e-12`;
4. quaternion norm error and matrix roundtrip error `<=1e-12`;
5. `q` and `-q` produce identical rotation matrices and Hopf views within
   `1e-12`;
6. Hopf output unit-norm error `<=1e-12`;
7. frozen S1 action preserves the Hopf view within `1e-12` and changes the
   represented rotation by at least `0.1 rad`;
8. applying the Phase-A frozen global proper rotation to model 64 changes no
   local SO(3) angle by more than `1e-10 rad` after body-frame alignment;
9. a reflected model-1 carrier cannot collapse to the original local
   orientation record: mean local difference at least `0.1 rad`;
10. synthetic missing-atom and degenerate-frame cases are rejected.

Descriptive outputs are the per-residue mean, median, p95 and maximum SO(3)
angle relative to model 1. They cannot rescue a failed mathematical gate.

## Claim ceiling

Allowed: bounded local backbone-frame variability and verified representation
properties for the bound ensemble.

Prohibited: temporal dynamics, folding path, causal Hopf mechanism, protein
prediction, new topology, Phase-C AXIS08 admission or new capability.
