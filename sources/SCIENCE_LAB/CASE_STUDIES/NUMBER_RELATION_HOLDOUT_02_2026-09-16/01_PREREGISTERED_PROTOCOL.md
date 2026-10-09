# NRS01 Palindrome Holdout 02 — matched preregistration

Protocol: `NRS01-PAL-HOLDOUT-02`  
Status: `PRESEAL_READY_AWAITING_EXTERNAL_WITNESS`  
Date: 2026-09-16

## Question

Within a new integer interval, are decimal-palindromic roots more likely to
have decimal-palindromic squares than two locally magnitude-matched,
non-palindromic controls selected without reading any square outcome?

This is a base-10 representation test. It is not a physics test and does not
test a universal significance of `12321`.

## Holdout boundary

The earlier work inspected roots no larger than `999999`. Holdout 02 freezes:

```text
2000002 <= root <= 98999989
```

No `PAL10(root²)` outcome in this interval may be evaluated before the external
witness has attested the preseal digest and the final seal has been built.

## Targets and matched controls

Eligible targets are decimal palindromes whose complete lower and upper
matching windows remain inside the frozen range. For target `r`:

```text
W(r) = max(100, floor(0.005 * r))
```

One lower and one upper control are selected by SHA-256 rejection sampling with
the fixed salt `NRS01-PAL-HOLDOUT-02-CONTROL-V1`. Each distance lies in
`[10, W(r)]`. A candidate is rejected unless it:

- stays inside the frozen interval;
- has the same decimal width as its target;
- is not a decimal palindrome;
- is not another eligible target; and
- has not been assigned to any earlier triplet.

Targets are processed in increasing integer order. The lower and upper roles
are separate deterministic hash streams. Control selection uses root identity
only and never reads `root²` or its palindrome status.

## Matched endpoint

For every triplet `(lower, target, upper)` define:

```text
Y(n) = PAL10(n²)
D = mean[Y(target) - (Y(lower)+Y(upper))/2]
```

The exact one-sided null conditions on the number `s` of successes in each
triplet and treats the target label as exchangeable among the three members.
Its conditional success probability is `s/3`. Convolving these Bernoulli terms
gives the exact Poisson-binomial tail probability for the observed number of
target successes. No asymptotic independent-group interval decides the gate.

## Frozen decision rule

`PASS` requires all of:

1. at least `10000` complete, valid triplets;
2. matched risk difference `D >= 0.002`; and
3. exact one-sided conditional randomization `p <= 0.001`.

Otherwise the scientific decision is `FAIL`. A contract, integrity, witness or
receipt failure returns `FAIL_CLOSED` without an empirical decision.

## External witness requirement

Execution is prohibited until an external witness receipt binds the SHA-256 of
`PRESEAL_MANIFEST.json`. The receipt must identify the witness, method,
timestamp and independently retrievable evidence. A local timestamp, an
unsigned local file or a self-authored receipt does not satisfy this rule.

`finalize_external_seal.py` binds the witnessed preseal and receipt into the
final manifest. It does not itself prove that the witness is external; that
fact must be independently verified from the declared evidence.

## Interpretation boundary

A pass supports only a matched decimal-representation enrichment in this
interval and design. It does not establish a universal integer invariant,
privileged ontology, causal mechanism, physical cycle, NEXAH profile or product
capability.
