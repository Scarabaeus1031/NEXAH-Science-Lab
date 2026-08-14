# Falsifiable Hypothesis

Status: `PROPOSED / NOT_ADOPTED`

## Primary hypothesis

> Under a prospectively frozen stress protocol, a phase-coherence indicator
> computed causally from state samples available up to time `t`, with its
> warning rule calibrated only on a disjoint development set, provides greater
> pre-event lead time than a similarly calibrated center-of-inertia-relative
> speed-deviation comparator on held-out evaluation runs, without materially
> worse false-positive rate or event detection recall.

This wording does not call the statistic uniquely NEXAH, assume that an event
will occur, or equate a numerical/synthetic event with physical grid collapse.

## Null and alternatives

- `H0`: median paired lead improvement `ΔL <= 0`, or any lead improvement is
  purchased with unacceptable false positives/false negatives.
- `H1`: `ΔL > 0` under the preregistered joint utility gates.
- A result may also be inconclusive because too few events occur, numerical
  validity fails or uncertainty is too wide.

## Permitted terminal outcomes

```text
PASS
FAIL
INCONCLUSIVE
```

`FAIL` is a scientifically successful execution when the preregistered
protocol runs correctly and finds no useful advantage.

## What remains scientifically interesting

Phase coherence is a real state-derived statistic that may degrade as coupled
oscillators lose synchrony. The testable question is not whether a shaped curve
can cross early, but whether a frozen, causal threshold provides repeatable
incremental warning information over a fair baseline across held-out event and
non-event paths.

The Level-1 candidate and terminal proxy both depend on rotor angles. This is a
declared construct-proximity limitation, not hidden independence. A Level-1
PASS would establish anticipation of that frozen synthetic proxy only; Level 2
must use domain-reviewed outcomes not defined by the candidate threshold.

## Independence constraints

- no curve shaping or retrospective time assignment;
- no threshold selection on evaluation runs;
- event definition independent of warning thresholds;
- identical causal information horizon for candidate and comparator;
- explicit non-event controls;
- distributions across seeds/stress paths, never one chosen trace;
- no claim beyond the synthetic system at Level 1.
