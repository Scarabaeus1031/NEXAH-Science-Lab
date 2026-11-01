# A0-BL-057 — preregistration

Date frozen: `2026-11-01`

## Primary question

Can the pair

```text
alpha = 63/64
beta  =  1/64
```

be converted by the declared centering map `S(x)=2x-1` into exact signed
opposites and then into reciprocal positive zoom channels with exact one-cycle
Return?

## Secondary question

In the recovered synthetic Core scenario, does replacing the discontinuous
indicator `I(t<25)` with the preregistered logistic window reduce the local
cutoff pulse while preserving the same baseline, exponential term, sinusoid,
cutoff center and sampling grid?

## Frozen construction

```text
alpha = 63/64
beta  = 1/64
A = 2 alpha - 1 = 31/32
B = 2 beta  - 1 = -31/32
q = alpha - 1/2 = 31/64

s_alpha(t) = exp(+q W(t) sin(omega t))
s_beta(t)  = exp(-q W(t) sin(omega t))
```

The mirror view is multiplicative. Therefore `s_alpha*s_beta=1` is the exact
analytic target. It is a view/zoom relation, not a physical expansion law.

The scalar carrier is

```text
b(t) = 1 - 0.002 t - 0.0005 t^2
e(t) = 0.015 exp((t-16)/4)
p(t) = 0.01 sin(0.8 t)
c(t) = b(t) + W(t) [e(t)+p(t)]
```

with `t=0..100`, `dt=0.02`, `t0=25`, and:

```text
W_hard(t)   = 1 if t < 25 else 0
W_smooth(t) = 1 / (1 + exp((t-25)/1))
```

## Frozen gates

1. exact rational complement `alpha+beta=1`;
2. exact signed opposition `S(alpha)=-S(beta)=31/32`;
3. sampled reciprocal error `max|s_alpha*s_beta-1| <= 1e-12`;
4. pure-carrier one-cycle state Return error `<=1e-12`;
5. reversed labels swap the two channels within `1e-12`;
6. equal weights produce zero centered amplitude and unit scales;
7. hard-cutoff local maximum absolute second derivative is at least five
   times the smooth-cutoff value in `24<=t<=26`;
8. the adjacent hard-cutoff value jump is greater than `0.1`, while the smooth
   adjacent jump is below `0.01`.

Gates 1–6 define the mirror/Return result. Gates 7–8 define cutoff
sensitivity. Rotation-angle peaks are reported descriptively because their
ratio is discretization-sensitive and is not a classification gate.

## Classification

- gates 1–8 pass →
  `PASS_EXACT_COMPLEMENT_MIRROR_RETURN_WITH_CUTOFF_SENSITIVITY`;
- gates 1–6 pass but either 7 or 8 fails →
  `MIXED_EXACT_MIRROR_RETURN_CUTOFF_SENSITIVITY_NOT_ESTABLISHED`;
- any of gates 1–6 fails → `FAIL_MIRROR_RETURN`;
- lock, source, schema or execution-contract mismatch →
  `INVALID_SOURCE_OR_CONTRACT`.

## Claim boundary

The test can establish an exact dimensionless complement/involution and a
declared reciprocal display-scale Return. It cannot establish biological
breathing, physical dilation, energy, universal Alpha/Beta roles, a golden-
ratio relation, predictive utility, cross-domain mechanism or publication
authority. The prior negative `CA-IDENT-05` classification result remains
unchanged.
