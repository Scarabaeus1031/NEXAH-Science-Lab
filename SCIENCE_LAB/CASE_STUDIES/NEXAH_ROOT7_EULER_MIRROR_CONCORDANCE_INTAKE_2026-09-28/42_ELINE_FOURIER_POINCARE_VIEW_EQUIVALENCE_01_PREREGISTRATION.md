# ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / CAYLEY VIEW-EQUIVALENCE TEST`

## Single question

Can the eleven source-bound eLinie/Fourier samples be embedded in the upper
half-plane and mapped bijectively into the Poincare disk by a frozen Cayley
transform while preserving hyperbolic distances; and does the resulting curve
remain correctly distinguished from a hyperbolic geodesic?

## Frozen sources

| Source | SHA-256 |
|---|---|
| eLinie/Fourier machine result | `189e5b7b83ba42d2b1764960c3208c031c1fbffcbbe09418a909f849454c592d` |
| Historical Poincare-disk visual | `917f0ca08f6c60ccd19acdf7dc2a99b6bf0df20f8cd7569d682243e8cff9a546` |
| Splinter triptych visual | `7624988449276f40618385d5962049cbee88182b3b3a5704d5b2d10bcb16c337` |
| Shadow-projection visual | `3a917aeb106d8a4caaf49960a93039bf18b58a9e9bbe334d78311c98fdec3d63` |
| Slice-cinema visual | `68a8b7bb63e9ff4b07620aada601054de6d512661fb3b82d966bb6b3647bb1ec` |

The last four images supply geometric/projection provenance only.

## Frozen embedding and transform

For normalized eLinie sample `s_t`, `t=0..10`, define

```text
u_t = -1.5 + 0.3 t
v_t =  1.5 + 0.4 s_t
w_t = u_t + i v_t                 (upper half-plane)
z_t = C(w_t) = (w_t-i)/(w_t+i)    (unit disk)
C^-1(z) = i(1+z)/(1-z).
```

Upper-half-plane distance:

```text
d_H(w1,w2) = acosh(1 + |w1-w2|^2 / (2 Im(w1) Im(w2))).
```

Disk distance:

```text
d_D(z1,z2) = acosh(1 + 2|z1-z2|^2 /
                   ((1-|z1|^2)(1-|z2|^2))).
```

An upper-half-plane geodesic must be either a vertical line or a circle with
center on the real axis. The sampled eLinie curve is not preregistered as a
geodesic.

## Mandatory checks

1. all frozen source hashes match;
2. every `v_t` is positive;
3. every mapped point satisfies `|z_t|<1`;
4. Cayley inverse roundtrip maximum error is `<=1e-12`;
5. all 55 pairwise hyperbolic distances agree to `<=1e-12`;
6. mapping the full Fourier reconstruction yields the same disk points to
   `<=1e-12` as mapping the original samples;
7. the eLinie upper-half-plane points are neither vertical nor concyclic about
   a center on the real axis, with frozen circle residual `>1e-6`;
8. a vertical reference geodesic maps to a disk diameter and roundtrips to
   `<=1e-12`;
9. retain Splinter/Shadow/Slice as representation controls only;
10. classify the disk curve as the same sampled carrier under a bijective view,
    but not as the same Euclidean shape and not as a Poincare geodesic.

## Decision rule

- `PASS_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE__CURVE_NOT_GEODESIC` if all ten
  checks pass;
- `FAIL_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE` otherwise.

## Stop rule

One primary execution and two byte-identical replays. Do not change embedding,
transform, tolerances or geodesic criterion after execution.

## Claim boundary

This test establishes a reversible Cayley view and hyperbolic metric
invariance for the frozen sampled carrier. It does not make the eLinie itself a
geodesic, prove physical hyperbolic dynamics or identify the historical visual
as the source of the modern carrier.
