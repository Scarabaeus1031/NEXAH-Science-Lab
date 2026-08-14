# Gate 2 — Method-Contamination Audit

## Counterfactual rule

For every generator choice, ask whether the same choice would be made if NEXAH
did not exist. The current status is below.

| Design choice | Independent rationale available? | Contamination risk | Required control |
|---|---|---|---|
| finite observations | yes: acquisition is limited | low | owner fixes sample budget |
| hidden states | yes for HMM/POMDP settings | low/medium | use established family |
| multiple aggregations | potentially: storage/sensor resolutions | medium | derive from application or published abstraction rule |
| anonymous labels | sometimes operationally real | medium | include only if externally present |
| unknown correspondence | not yet established | high | remove unless application requires it |
| explicit collisions | consequence of maps, not a parameter target | high | never quota collision cases |
| rare strata/transitions | scientifically possible | high | prevalence from external family, never tuned |
| graph structure | unnecessary for primary task | high | omit unless native to selected family |
| near-threshold cases | useful for power but manipulable | high | sample natural population; do not enrich by method outputs |
| train/test shift | operationally possible | high | named external shift only |
| held-out maps | tests generalization | medium/high | distribution fixed independently |

## Anti-contamination rules

1. Select the task owner and source family before specifying NEXAH certificates.
2. Seal generator distributions before implementing either method.
3. Do not screen cases using either method, certificate presence or B8 error.
4. Give B8 the same stage order, pairings and representation-aware covariates.
5. Permit B8 to use statistical structure normally available in the domain.
6. Use a separate scorer specification; never derive truth from a NEXAH ledger.
7. Treat natural scarcity of informative cases as a power finding, not permission
   to manufacture collision-heavy fixtures.

## Reversal audit

Mixing time, rare-state prevalence, map severity, noise and sample budget can all
reverse rankings through ordinary bias–variance behavior. Until their distribution
is externally fixed, researcher degrees of freedom are unacceptable.

Current finding: no demonstrated oracle leakage, but substantial prospective
method-contamination risk remains in the unspecified process family.

