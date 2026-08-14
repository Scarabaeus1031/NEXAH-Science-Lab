# Focused prior-art and novelty audit

This is a focused comparison for the strongest candidate, not a systematic
review. Existing Lab literature audits were checked against current primary or
authoritative sources.

## Closest established work

| Candidate component | Closest prior art | Consequence |
| --- | --- | --- |
| robustness versus discrimination | Varma & Ray, [discriminative power–invariance trade-off](https://doi.org/10.1109/ICCV.2007.4408875) | broad trade-off is established |
| invariance with selectivity | Anselmi, Rosasco & Poggio, [invariance and selectivity](https://doi.org/10.1093/imaiai/iaw009) | an invariant representation must still separate relevant objects |
| Pareto framing | Zhao et al., [fundamental limits and Pareto frontiers](https://jmlr.org/papers/v23/21-1078.html) | a two-objective frontier is not new |
| state aggregation and recoverability | Geiger & Temmel, [Markov lumping and entropy preservation](https://doi.org/10.1239/jap/1421763331) | transition-state information loss has stronger formal baselines |
| preregistered outcome-neutral reporting | [Registered Reports](https://www.nature.com/articles/s41562-016-0034) and Nosek et al., [reproducible-science manifesto](https://doi.org/10.1038/s41562-016-0021) | preregistration, null retention and result-independent publication are established practice |
| research artifact stewardship | Wilkinson et al., [FAIR principles](https://doi.org/10.1038/sdata.2016.18) | persistent identifiers, metadata and reusable artifacts are established requirements |

## Residual contribution after prior art

No new theorem, invariant, Pareto principle, information-loss principle,
recovery theory or algorithm is supported. The exact synthetic measurements
are new relative to their frozen fixtures. The possibly distinctive residue is
the joint operational bundle:

- declared admissible representation changes;
- a finite transition-certificate ladder;
- separate representation robustness `R` and matched-counterfactual
  discrimination `D`;
- explicit collision and destroyed-distinction ledgers;
- non-scalarized reporting and fail-closed statuses;
- retained nonreplication and implementation dependence.

No exact prior-art duplicate was located, but absence in a focused search is
not proof of novelty. The bundle's incremental diagnostic utility has not been
externally established.

## Strongest-candidate novelty classification

```text
MATHEMATICAL_NOVELTY = NONE
ALGORITHMIC_NOVELTY = NONE
EMPIRICAL_NOVELTY = PARTIAL
METHODOLOGICAL_NOVELTY = PLAUSIBLE
ARCHITECTURAL_NOVELTY = NONE
DOCUMENTATION_SYNTHESIS = PLAUSIBLE
```

`PARTIAL` empirical novelty is limited to the exact preregistered synthetic
observations. `PLAUSIBLE` means a potentially distinctive operational package,
not a validated new method.

