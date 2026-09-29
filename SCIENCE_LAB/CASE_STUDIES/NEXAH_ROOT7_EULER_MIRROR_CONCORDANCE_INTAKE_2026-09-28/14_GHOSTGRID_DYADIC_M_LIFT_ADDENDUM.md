# Ghostgrid dyadic lift and bounded M-candidate

Date: `2026-09-28`

## Result

The Owner-supplied Ghostgrid Master supplies the missing process connection:

```text
source -> two cuts -> relation -> reconstructed grid -> return with trace.
```

For the already established return/cut sequence, define

```text
A_k = 97*2^k
B_k = 101*2^k
S_k = A_k+B_k
Delta_k = B_k-A_k.
```

The Ghostgrid record `G_k=(S_k,Delta_k,trace)` reconstructs the two channels
exactly by

```text
R(G_k)=((S_k-Delta_k)/2,(S_k+Delta_k)/2).
```

Thus `101 -> 202 -> 404 -> 808 -> 1616` is not merely a list of doubled
integers. It is the B-channel of a paired relation lift:

```text
(97,101) -> (194,202) -> (388,404) -> (776,808) -> (1552,1616).
```

At every tested scale,

```text
A_k/B_k = 97/101
Delta_k/S_k = 2/99
midpoint = 99*2^k.
```

The two-node, one-relation graph is therefore scale-equivariant. This is the
exact mathematical content that can be connected to the Prime Topology / nested
shell imagery.

## Boundaries found by the test

- Operator order matters: `D(C4(97))=202`, while `C4(D(97))=198`.
- The decimal palindromes are a finite visible window `101,202,404,808`.
  The next lift `1616` crosses the carry boundary.
- `404` is an exact dyadic lift state but not a mod-11 return: its residue is 8,
  whereas 101 has residue 2.
- The dyadic residue first returns to 2 after ten lifts, in agreement with the
  existing Root7 custody audit.
- Equal normalized relation topology does not establish resonance, physical
  causality or identical histories. The trace remains part of the state.

## M-class decision

The result justifies a bounded **M-lift candidate** meaning
`multiplicative scale-equivariant relation morphology`. It does not promote the
historical `M-Class`: the controlling register still classifies the C/E/S/M
labels as `EXPRESSION_ONLY` with evidential weight zero. Promotion would require
a separate class contract, discriminating examples and negative controls.

## Visual provenance

- Ghost Grid Master overview SHA-256:
  `f80e817f64636ca8e1ee84d35139634cdfdc15b5e60c9f184a75538999e024e3`;
- Ghost Grid process plate SHA-256:
  `85cb2d11baed7aef0267da38079dbc8f730793a7fb52744a226b420e67301c9a`;
- Ghost Grid interactive plate SHA-256:
  `59ff82f010f7526dd27d67c2ce7614c3b9bd11c609c74d3ad8f8790a1c53f1f7`;
- Matryoshka/MA visual SHA-256:
  `f9c3800af0012b4c5d5248ae1b3484904b176097afcca6e1c6a1a1187e898cdb`;
- experimental phase-map visual SHA-256:
  `399a6eee985116d77fea0c81b11ab9c32b8ca3f6de0c693a32c876883ae76a8f`.

The last two images are provenance for terminology and visual context only;
their resonance and physical-field statements are not imported into the test.

## Reproducibility

Three consecutive executions were byte-identical:

```text
checks:          17/17 passed
result SHA-256:  5fc78226ea4f4ebcdb116fc1ce561776fe7a2308cebbd80e0a9886f9bbcc41d5
scientific hash: f71a4776258f15e2da6dc8f32525b98315433924d0fefda30f61aff40eb6b410
```
