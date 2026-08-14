# Baseline Registry

All baselines are independently implemented in `diagnostics_baselines.py`. They
receive the same public case object as NEXAH but use no NEXAH intermediate or
Boolean.

| ID | Raw input / output | Rule | Blind spot |
|---|---|---|---|
| B0 whole equality | full left/right stage JSON → survival vector | canonical exact inequality | nuisance differences |
| B1 feature Hamming | unlabeled feature-value multisets → count distance | changed iff multiset differs | identity/correspondence |
| B2 cardinality | feature counts → difference | changed iff counts differ | values and identity |
| B3 weighted graph | canonical weighted edge multisets → L1/exact | changed iff weights/support differ | target features |
| B4 directed support | directed edge sets → symmetric difference | changed iff nonempty | weights/features |
| B5 undirected support | undirected edge sets → symmetric difference | changed iff nonempty | direction/weights/features |
| B6 components | component-size multiset → equality | changed iff unequal | within-component structure |

Each converts its own survival vector to the first monotone `1→0`; nonmonotone or
initially zero becomes `UNRESOLVED`. There are no primary numeric thresholds.

The comparator pool for H1 includes B0–B6 and N0–N3. “Strongest comparator” is
the method with maximum held-out exact accuracy, ties broken by lower stage error
then lexicographic method ID. This conservative post-score maximum is frozen and
favors the null.

## Fatal comparator omission found in self-review

A fair conventional comparator must also receive the public task query and
correspondence and apply the exact registered survival predicate sequentially:

```text
B7_TASK_AWARE_EXACT:
  s_k = exact inequality of the corresponding target values
  prediction = first monotone 1->0, else NO_LOSS
```

This is not a NEXAH-specific operation; it is the direct plug-in estimator of the
estimand. It is mathematically identical to N4's prediction rule in
`09_NEXAH_DIAGNOSTIC_SPEC.md`. Omitting B7 makes the comparator set unfair;
including B7 makes H1-A and H1-B impossible by construction. This unresolved
dilemma is fatal and blocks freeze.
