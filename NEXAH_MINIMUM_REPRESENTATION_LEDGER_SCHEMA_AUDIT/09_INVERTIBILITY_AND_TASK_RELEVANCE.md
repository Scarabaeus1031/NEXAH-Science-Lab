# Invertibility and Task Relevance

Invertibility is one of `EXACTLY_INVERTIBLE`, `CONDITIONALLY_INVERTIBLE`, `APPROXIMATELY_RECOVERABLE`, `MANY_TO_ONE`, `NONINVERTIBLE`, or `UNKNOWN`. It requires an assertion and evidence references. Visual resemblance has no role.

`MANY_TO_ONE` states known non-injectivity. `NONINVERTIBLE` states no inverse exists within the declared domain/contract. `APPROXIMATELY_RECOVERABLE` requires a reconstructor, metric, and scope; it does not imply source identity.

Task relevance is optional and defaults to:

```yaml
task_relevance:
  state: UNDEFINED
```

If `DEFINED`, it requires `task_id`, `task_source`, `task_owner`, `adequacy_criterion`, and `decision_consequence`. An internally invented task cannot be labeled external. Neither the legacy chain nor EXP-T01 has an external downstream task, so their sample entries use `UNDEFINED`.

