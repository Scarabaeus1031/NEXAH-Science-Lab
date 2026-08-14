# Independent Translation Fidelity Protocol

Status: prospective; freeze before execution.

## Independent substrate

The runner is a standalone NumPy implementation. It does not import NEXAH,
v0.7, scikit-learn, KMeans or sliding windows. It uses explicit discrete latent
states, deterministic state-conditioned observations and a from-scratch,
graph-blind deterministic k-medoids decoder. The state count is supplied by
the synthetic ground truth and is therefore an oracle assumption, disclosed
rather than estimated. Input rows are centered and divided by one global RMS
scalar; features are not standardized separately.

Cluster-to-source correspondence is solved after decoding by the permutation
that maximizes sample overlap. This mapping is used for semantic graph
alignment and fidelity measurement, never to fit medoids or alter assignments.
Every retained sample records source index, latent state, local cluster and
aligned graph node.

## Frozen matrix

Ten base structures and ten matched counterfactuals cover directed chain,
reversible chain, directed cycle, branch, merge, bridge/bottleneck, shortcut,
rare transition, asymmetric transition and near-degenerate observation
regimes. Parameters and exact walks are in `experiment_protocol.json`.

Faithful transformations are baseline plus:

- invertible affine coordinates with a redundant feature;
- nonlinear injective coordinates retaining both source coordinates;
- one-step delay embedding aligned to the current source sample;
- seeded Gaussian noise (`PCG64`, sigma 0.01);
- factor-two sampling.

The first two are injective on samples; delay retains the current observation;
noise is stochastic but small relative to prototype separation; factor two is
declared moderate for the frozen dwell lengths. None guarantees decoder or
certificate preservation.

Lossy controls, excluded from Axis A, are a scalar even-power projection,
factor-five sampling and a two-coordinate sign projection. They respectively
destroy injectivity, temporal events and within-orthant magnitude.

## Axes and decisions

Axis A is exact certificate preservation from R0 to each of five faithful
transformations over all 20 systems. Axis B is exact base/counterfactual
inequality within each of six faithful representations over ten pairs.
`NOT_TESTABLE` comparisons are retained and excluded from denominators.

- HIGH: rate >= 0.80
- MEDIUM: 0.50 <= rate < 0.80
- LOW: rate < 0.50

A HIGH/HIGH candidate must additionally have: at least 0.90 mean aligned-state
accuracy across faithful cells; at least 0.60 unique-certificate fraction over
the 20 R0 systems; R0 detection in at least 8/10 counterfactuals; and at least
0.70 preservation separately for nonlinear, delay and factor-two transforms.
The component-summary certificate is ineligible because it is definitionally
coarse. These gates reject saturation and trivial affine-only stability.

Decision order:

1. qualifying candidate -> `HIGH_HIGH_CERTIFICATE_CANDIDATE_FOUND`;
2. otherwise, if Spearman(detail, robustness) <= -0.50,
   Spearman(detail, discrimination) >= 0.50 and
   Spearman(robustness, discrimination) <= -0.50 ->
   `ROBUSTNESS_INFORMATION_TRADEOFF_CANDIDATE`;
3. otherwise, if support is HIGH/LOW and full probabilities are LOW/HIGH ->
   `TRADEOFF_REPLICATED_BUT_IMPLEMENTATION_SPECIFIC`;
4. otherwise -> `TRADEOFF_NOT_REPLICATED`.

If more than 10% of faithful cells are `NOT_TESTABLE`, the result is
`INCONCLUSIVE`. No threshold, transformation, fixture, certificate or decision
rule may change after freeze.

## Firewall

No IEEE/PEGASE, Early Warning, Application 001 or canonical repository is
executed or modified. Synthetic structure has no physical interpretation.
