# Gate 3 — Identifiability

## Formal target

For external state/truth `Z`, common loss `L`, sample budget `n` and resource
budget `b`, define:

```text
R_N(n,b)  = E[L(delta_N,Z)]
R_B8(n,b) = E[L(delta_B8,Z)]
Delta(n,b) = R_N(n,b) - R_B8(n,b)
```

Positive `Delta` favors B8; negative `Delta` favors NEXAH. The unit of inference
must be an independently generated system or trajectory bundle, not correlated
time points within one trajectory.

## What is identifiable in principle

If the process distribution, task contract, two algorithms, budgets and scorer
law are fully frozen, mean external loss and `Delta(n,b)` are identifiable from
independent held-out systems. Scorer-only access to the sealed law or an evaluation
sample of prespecified precision can establish the optimal action without leaking
truth to diagnostics.

The public finite sample does not definitionally reveal population risk. Genuine
inference is required. `UNKNOWN` is a common action and observational equivalence
is a legitimate case outcome.

## Three required regimes

- **Null:** both use sufficient common evidence and produce practically equivalent
  risk. Equivalence must be concluded by a prespecified interval/margin, not by
  failure to reject a point null.
- **NEXAH loss:** certificate bias, false collision evidence, forced cross-stage
  structure or excessive remeasurement increases loss.
- **B8 loss:** a prespecified structural restriction happens to reduce finite-
  sample variance enough to offset its bias relative to direct estimation.

All three are plausible, but plausibility is not demonstrated coverage. No frozen
family presently guarantees that each regime occurs naturally with non-negligible
probability. Nor are `delta_N` and `delta_B8` algorithmically specified enough to
show that their outputs can differ after B8 receives full conventional structure.

## Verdict

`GATE_3_CONDITIONAL`

The risk contrast is identifiable in a completed design, but finite-sample method
separation is currently `UNCLEAR`. Gate 3 cannot pass before Gates 1 and 2 fix the
effect scale and population, and before method-level distinctness is established
without executing the benchmark.

