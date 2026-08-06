# Hypothesis

## Primary hypothesis

> With mask width and removed-information exposure matched, a constant-velocity moving mask produces a reproducible difference in estimation error or reacquisition behavior compared with a static mask for the same fixed history-dependent weighted estimator.

This is a difference hypothesis. It does not prescribe that motion must improve or worsen performance in every run.

## Null hypothesis

> After controlling the amount of information removed, mask motion produces no reproducible difference in estimation error or reacquisition behavior relative to the static-mask condition.

## Status

The hypothesis is extracted from the handoff's H0, H2, and H5. It is not a new mathematical claim.

## Required preregistration

Before any run, a protocol must freeze:

- the exact estimator;
- the static and moving mask schedules;
- the information-matching rule;
- paired seeds;
- error summaries;
- reacquisition tolerance and persistence rule;
- uncertainty or equivalence criterion;
- the decision rule for supporting or failing to support the hypothesis.

Without these values, the hypothesis remains scientifically understandable but is not execution-ready.

## Non-claims

Support would establish only a temporal-mask effect for the frozen synthetic benchmark and estimator. It would not establish Q°, a general observability theorem, estimator superiority, causal effects in an external domain, or domain-independent validity.
