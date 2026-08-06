# Equivalence Criterion

## Pair discrepancy

For view `θ` and distinct sources `s,s'`, define the finite displayed-record discrepancy:

```text
D_θ(s,s') = max over j=0,…,120 of
                max(|y_θ,sj,1 - y_θ,s'j,1|,
                    |y_θ,sj,2 - y_θ,s'j,2|)
```

where `y_θ,sj=H_θ x_sj`.

This is the maximum norm over all matched displayed samples. Sample correspondence is determined only by `sample_index`.

## Observational equivalence

```text
s ~_θ s'  iff  D_θ(s,s') ≤ τ_sci
```

with:

```text
τ_sci = 1×10^-9
```

displayed-coordinate units.

The relation is evaluated only on the four fixed source identities and the complete 121-sample records.

## Distinguishability

```text
s and s' are distinguishable under θ iff D_θ(s,s') > τ_sci.
```

No statistical confidence, probability, reconstruction accuracy, or physical separation is inferred.

## Partition construction

For each view:

1. begin with the four persistent source labels;
2. apply all six pair decisions;
3. verify reflexivity, symmetry, and transitivity;
4. construct the unique equivalence classes;
5. encode the partition canonically.

If pair decisions are not transitive, do not repair them by clustering or threshold adjustment. Assign `invalid protocol` and STOP because the frozen criterion did not produce the required partition.

## Source identity rule

Source identity is supplied by the canonical label and never inferred from projected coordinates. Equivalent displayed records do not merge source records.

## Finite-scope rule

The criterion states nothing about parameter values between the 121 samples. `Equivalent` means equivalent over the frozen finite displayed records only.

## Null decision

- reject the null when at least one validated view partition contains a class of size greater than one;
- do not reject the null when all four validated partitions contain four singleton classes;
- do not decide the null for inconclusive or invalid-protocol outcomes.

## Prohibited substitutions

- mean, median, root-mean-square, Hausdorff, dynamic-time-warping, or integrated discrepancy;
- approximate index matching;
- curve registration;
- visual coincidence;
- depth-assisted separation;
- source-space distance as the observation criterion;
- result-driven tolerance selection.
