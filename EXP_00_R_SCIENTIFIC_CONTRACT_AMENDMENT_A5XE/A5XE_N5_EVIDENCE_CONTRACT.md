# A5XE N5 Evidence Contract

Both tiers contain the exact first 12 determinant-`+1` signed-permutation matrices in accepted order, a fixed population of at least 20 synthetic queries, transformed query/B/target evidence, explicit T/F refit records and one original/transformed five-action rank comparison for every transform × representation × query.

A5XE independently checks `Q`, determinant/order, `Qx`, `QB`, target transformation without reselection, refit completeness, population identity and `Qᵀ` inverse registration. Kendall tau-b is recomputed from ranks; supplied tau/pass fields are forbidden. The tier statistic is the minimum over the complete comparison universe and passes at `>=.99`.

N5-SYNTH false returns `IMPLEMENTATION_FAILURE` and prohibits release. N5-RUN false returns `INVALID_EXPERIMENT`. Neither becomes P1 failure or nonreplication. RUN uses structurally identical synthetic evidence here; no registered data is opened.
