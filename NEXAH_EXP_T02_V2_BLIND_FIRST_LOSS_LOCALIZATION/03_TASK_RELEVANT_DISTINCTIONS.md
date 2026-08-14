# Task-Relevant Distinctions

Each case publicly names one source observable `target_feature_id` and asks
whether its exact left/right value distinction survives. Public correspondence
maps that source observable to stage-local aliases; aliases alone never encode
whether values differ.

The oracle predicate is:

```text
s_k = 1 iff corresponding target values exist at stage k and differ exactly
```

Both missing or equal means `s_k=0`; one-sided missing invalidates the fixture.
Values are integers, so no numerical tolerance exists.

Nuisance observables and graph structures are not part of Delta. Their differences
may persist and intentionally confound whole-representation baselines. This makes
task specificity necessary and prevents generic inequality from defining truth.

Fixed instrumentation controls additionally cover relabeling equivalence,
constructed `T1`–`T6` losses and `NO_LOSS`. They are excluded from hypotheses.

