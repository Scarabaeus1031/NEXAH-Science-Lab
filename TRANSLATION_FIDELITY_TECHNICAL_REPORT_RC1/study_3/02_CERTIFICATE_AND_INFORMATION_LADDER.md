# Frozen Certificate and Information Ladder

All graph certificates use the preregistered source-state alignment. Exact
equality of the serialized certificate is the preservation rule.

| Level | ID | Retains | Discards / expected behavior |
|---:|---|---|---|
| 0 | C0_components | node count and sorted SCC/WCC sizes | labels, edges, counts, weights; likely saturated |
| 1 | C1_support | aligned directed binary support including self-loops | multiplicity and weights; robust but potentially blind |
| 2 | C2_counts_exact | aligned integer transition-count matrix | chronology; sampling-sensitive |
| 3 | C3_count_ranks | support plus tie-aware rank order of positive counts | count scale and gaps; intermediate candidate |
| 4 | C4_probability_bins | aligned row probabilities in frozen bins | within-bin differences; intermediate candidate |
| 5 | C5_probabilities_2dp | aligned probabilities rounded to 2 decimals | sub-cent precision |
| 6 | C6_probabilities_12dp | aligned probabilities rounded to 12 decimals | chronology and absolute row totals; finest graph layer |

Bin edges are `[0, 0.05, 0.15, 0.35, 0.65, 0.85, 0.95, 1.01]` with zero
encoded separately. Rank ties receive the same integer rank.

## Information accounting

For every decoded system/representation the runner records:

- aligned sample accuracy and per-state recall;
- dominant-cluster collisions between source states;
- oracle-versus-derived support true/false positives and false negatives;
- edge recall and precision;
- mean absolute transition-probability error;
- number of distinct positive count and weight values.

For every certificate and representation it records unique certificates among
the 20 base/counterfactual systems, induced collision pairs, and the number of
matched counterfactual distinctions destroyed. These transparent discrete
counts are used instead of claiming Shannon information without a probability
model. The certificate level (0–6) is the preregistered retained-detail order;
Spearman associations are descriptive, not a theorem or causal estimate.
