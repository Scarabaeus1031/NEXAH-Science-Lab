# Falsification Ledger

| Prospective falsifier / challenge | Observation | Decision |
|---|---|---|
| lossy map reported recovered | 0 false recoveries | not triggered |
| exact bijection fails without numerical reason | 4 exact; rotation error `2.22e-16` within frozen tolerance | not triggered |
| independent replay differs | A and combined replay byte-identical | not triggered |
| undefined recovery coerced to zero | all four lossy errors remained null | not triggered |
| registered cell omitted | 15 recovery + 7 dynamics cells present | not triggered |
| classification changed without protocol change | frozen bundle verified on every run | not triggered |
| coarse certificate uniquely identifies source | C1, C2 and C5 collisions observed | falsified on the designed pairs |
| recovery error alone proves structure | fine perturbations changed C0 while some coarse certificates survived | falsified on the designed cells |

H1 received narrow software-level support: the evaluator separated recovered,
changed, lost, and unidentifiable cases without a false inverse. H0 was **not
rejected**: the outcomes add no demonstrated information beyond the frozen
transformations, certificates, and standard inverse/information-loss rules.

The absence of an observed software falsifier is not proof of correctness,
novelty, completeness, or domain validity. In particular, the strict primary
rule collapses partial certificate preservation into `STRUCTURE_CHANGED`
whenever C0 changes; this is a documented resolution limitation, not retuned.
