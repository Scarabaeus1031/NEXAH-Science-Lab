# Final NEXAH Translation Fidelity Experiment Report

Disposition: `RESEARCH / NOT_ADOPTED`  
Scientific disposition: `ROBUSTNESS_INFORMATION_TRADEOFF_CANDIDATE`

## Executive conclusion

The broader robustness–information–discrimination pattern survived an
independent, domain-neutral implementation, but the exact v0.7 hierarchy did
not. In the new decoder, binary support was MEDIUM/MEDIUM (0.780 robustness,
0.767 discrimination), not HIGH/LOW. Progressively richer certificates became
more discriminative and less representation-robust, with preregistered
Spearman associations of -0.808 for detail versus robustness, +0.741 for detail
versus discrimination and -0.838 between the two axes.

No HIGH/HIGH certificate was found. This is evidence for a methodological
trade-off candidate across the frozen synthetic substrate, not a universal
law, mathematical invariant, physical claim or NEXAH discovery.

## Required answers

1. **Does the hierarchy replicate independently?** The broader ordered pattern
   does; the exact coarse-support/weighted categorical split does not.
2. **What was v0.7/KMeans-specific?** Exact rates, HIGH/LOW support behavior,
   window-induced support saturation, anonymous local labels and strong prior
   delay preservation. The new delay result is the opposite.
3. **Effect of explicit correspondence?** It exposes whether failure is a label
   permutation or lost state identity. Delay's 0.7896 mapping accuracy, 20
   collision pairs and 0.6081 edge recall demonstrate genuine fidelity loss.
4. **Most representation-robust?** C0 components at 0.990, but saturated. C1
   support is the richest relatively robust layer at 0.780.
5. **Most discriminative?** Exact counts and both probability certificates at
   1.000; C3 count ranks reached 0.950.
6. **Any HIGH/HIGH?** No. C1 is 0.020/0.033 below the two thresholds but has
   zero delay preservation, so the nontrivial gate is not close. C3 is 0.040
   below HIGH robustness and 0.150 above HIGH discrimination.
7. **Is robustness associated with information loss?** Yes descriptively in
   this ladder; all three preregistered rank associations pass their gates.
8. **Are robust summaries saturated?** Yes. C0 had only 2 values over 20 R0
   systems, 154 collapsed system pairs and 0/10 R0 detections.
9. **Where does information disappear?** Components erase edges; support erases
   multiplicity; ranks erase scale; bins erase within-bin changes; normalized
   probabilities erase absolute totals and chronology. The decoder can first
   lose state/edge identity, especially under delay.
10. **Greatest fidelity loss?** Delay, followed by factor-two for exact weighted
    equality. Nonlinear injection preserved every certificate.
11. **Hardest structural changes?** Rare and asymmetric transition-frequency
    changes were completely invisible to support; asymmetric change was also
    difficult for probability bins.
12. **Best intermediate certificate?** C3 count ranks is the clearest Pareto
    compromise: 0.760/0.950. It improves robustness over full probabilities
    and discrimination over support, without strictly dominating both.
13. **Can robustness rise without equal discrimination loss?** Locally yes:
    C3 greatly improves robustness over full weights for a small sensitivity
    loss, and nonlinear injection preserved all levels. The aggregate negative
    association is not a prohibition or law.
14. **Mathematical/definitional observations?** Relabeling/alignment under a
    bijection and the declared global centering/scalar normalization behavior.
15. **Implementation-specific observations?** k-medoids partitions, known-k
    oracle, prototype geometry, delay collision mechanism and exact rates.
16. **Empirical and reproducible observations?** All frozen rates, errors and
    correlations; the replay was byte-identical.
17. **What needs external replication?** Alternative independent decoders,
    unknown-state-count settings, new structures/prototypes, multiple noise
    levels and independently designed delay/sampling transforms.
18. **Paper-level hypothesis?** There is enough preregistered synthetic evidence
    to motivate a narrowly framed methodological hypothesis and external
    replication. There is not enough for a universal or domain claim.

## Adversarial qualifications

Lossy maps were not automatically destructive: sign retained all information
when orthants encoded source identity, and factor-five sampling retained
topology on long dwells. Conversely, a formally faithful delay embedding
substantially destabilized the independent decoder. These negative results are
central: transformation class alone does not determine observed fidelity.

The independent implementation requirement was met. The prior defective
`family_outcomes.*.structural` field was never used. No post-result tuning,
canonical changes, IEEE/PEGASE, Early Warning, Level-1C or Application 001 work
occurred.

```text
CANONICAL_NEXAH_IMPORTED = NO
CANONICAL_REPOSITORIES_CHANGED = NO
IEEE_PEGASE_EXECUTED = NO
EARLY_WARNING_REOPENED = NO
APPLICATION_001_CHANGED = NO
POST_RESULT_RETUNING = NO
```

ROBUSTNESS_INFORMATION_TRADEOFF_CANDIDATE
