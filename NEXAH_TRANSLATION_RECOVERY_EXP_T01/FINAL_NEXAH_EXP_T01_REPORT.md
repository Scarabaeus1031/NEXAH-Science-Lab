# Final NEXAH EXP-T01 Report

## Decision

`TRANSLATION_RECOVERY_RESULT = EXP_T01_TRANSLATION_CLASSIFIER_SUPPORTED`  
`STILLPOINT_RESULT = STILLPOINT_OPERATIONAL_EQUILIBRIUM_CONFIRMED`

These are narrow dispositions for a deterministic synthetic software test. H0
was not rejected, and no result exceeded standard inverse/reconstruction and
information-loss mathematics.

## The 25 required answers

1. **Exact/bijective runs tested:** 5.
2. **Recovered exactly:** 4 at arithmetic zero; all 5 within the frozen numerical tolerance.
3. **Maximum exact-control numerical error:** `2.220446049250313e-16`.
4. **Certificates that survived:** after successful inverse, all applicable structural certificates survived; rotation C0 differed only by floating error. Under perturbation, C3/C4 survived two noise levels; C1/C2/C3/C5 survived two fine quantization levels; only C3 survived coarse quantization.
5. **Certificates surviving only because coarse:** C5 most clearly; also C1/C2 collided for the reflected F2 pair.
6. **Collision counts:** C0=0, C1=1, C2=1, C3=0, C4=0, C5=3.
7. **Lossy maps declared unidentifiable:** signed square was `UNIDENTIFIABLE`; projection, coarse quantization, and edge deletion were `INFORMATION_LOST`.
8. **False recoveries:** 0.
9. **Perturbation scaling:** additive-noise E_rec tracked epsilon essentially 1:1; quantization E_rec increased monotonically (`0.0004468`, `0.0308657`, `0.3`) across the frozen steps.
10. **Stable certificate despite changed counterfactual:** yes; C1/C2/C5 for F2 reflection and C5 for all three pairs.
11. **Prior robustness-versus-information-loss observation replicated:** yes, narrowly on designed synthetic controls; not as external validation.
12. **High-fidelity and high-discrimination certificate:** C3 and C4 had zero applicable-pair collisions and good positive-control preservation in this small battery; the sample is insufficient for a general claim.
13. **Purely mathematical/definitional findings:** invertibility of declared bijections, non-injectivity/destruction in registered lossy maps, and fixed-point identity `F(0)=0`.
14. **Software checks:** cell completeness, status assignment, null handling, frozen-hash enforcement, and byte-identical replay.
15. **Empirical synthetic observations:** measured errors, certificate comparisons/collisions, and RK4 return/non-return traces.
16. **What was falsified:** unique identification by coarse certificates and the sufficiency of recovery error alone, on the designed fixtures. No preregistered H1 software falsifier fired.
17. **Beyond standard inverse/recovery mathematics:** no. H0 was not rejected.
18. **Stable control returned:** yes, all 3 perturbations.
19. **Unstable control failed to return:** yes, both perturbations.
20. **Stillpoint operationally justified:** yes, only as the selected synthetic equilibrium label.
21. **Physical claim established:** NO.
22. **New mathematical invariant discovered:** NO.
23. **Canonical NEXAH/ORION operators changed:** NO.
24. **Post-result retuning:** NO.
25. **Most informative next experiment:** freeze a larger out-of-sample fixture suite with certificate applicability separated from C0, then estimate certificate collision and misclassification rates under unseen composite perturbations using an independently implemented evaluator.

## Reproducibility and boundaries

- Protocol bundle SHA-256: `6f0b807d1d18c9db3825dbaa98dd413cba0d52ea5f8e9bc319aa137865119b53`
- T01-A result/replay SHA-256: `0f860a7986476f63125d7832187e3b02367485ecbd10b1820173eabc647b8aac`
- Combined result/replay SHA-256: `8902aa6253025249429179a63fb3323f06c0e607bfba84824d9521f02f2e87dc`
- Frozen files unchanged after result generation: yes
- Canonical baseline: NEXAH `main` at `724814ea40351141350a1822d7c559a308ac0cfa`, inspected read-only
- Authority: `SCIENCE_LAB_NOT_ADOPTED`

The strict C0-inclusive rule made all six nonzero perturbed runs
`STRUCTURE_CHANGED`, even where coarser certificates survived. This limitation
is retained rather than repaired post hoc.

## Required machine-readable conclusion

`PROTOCOL_FROZEN = YES`  
`POST_RESULT_RETUNING = NO`  
`CANONICAL_NEXAH_CHANGED = NO`  
`IEEE_PEGASE_EXECUTED = NO`  
`PHYSICAL_EXPERIMENT_EXECUTED = NO`  
`NEW_MATHEMATICAL_INVARIANT_ESTABLISHED = NO`  
`TRANSLATION_RECOVERY_RESULT = EXP_T01_TRANSLATION_CLASSIFIER_SUPPORTED`  
`STILLPOINT_RESULT = STILLPOINT_OPERATIONAL_EQUILIBRIUM_CONFIRMED`  
`NEXT_ACTION = PREREGISTER_LARGER_OUT_OF_SAMPLE_CERTIFICATE_DISCRIMINATION_TEST`
