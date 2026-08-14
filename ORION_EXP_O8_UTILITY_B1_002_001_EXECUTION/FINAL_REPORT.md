# ORION O8 UTILITY B1.002 — FINAL SCIENTIFIC REPORT

1. **REVIEWED HASH VERIFIED?** YES — `07a845934178467b6f708ccb77c7ef1762e4c65e65d5665148cbf35e65aec5d3`.
2. **LOCKED BEFORE IMPLEMENTATION/RESULT EXPOSURE?** YES / YES.
3. **LOCK SHA-256?** `cd802753e547c9e3048238e9919d21207c4696ebba41d63798e8e69b97b71fb6`.
4. **IMPLEMENTATION FROZEN?** YES. Implementation `6cf3f0699d4a4a1020fca1ace9906e65cd5e77aac82bc500a25aa83d2c9db9c6`; adapter `15fe3a3a1ec737b9313f4dcca9e188464f009349750469bc92339b061c7b6759`; schema `d83f9d4d0ca2d4e7c7bfc93ede7b2ecd07e58323c8260e737c4369931fee6987`; generator `ad1ab0c19b7a75448388afa489984c867b1a13221f46863d5d1368f8b7257c25`; baseline provider `04209f4fb65e95172c81e0e4c37e1f109c24e21f1dba4e09765e8af2bd185e47`; PLUS provider `325e1520c9fff04851682bf81778f5a1ced69352768206fa676cab7103ef949a`; evaluator `0a8185384b339019a034e2baa913a35fba80bb92cd0929e19d2fbadc84a4f6d8`.
5. **CONTROLLING O8 HASH VERIFIED?** YES — `cfea693c746c0ab16515b7ee716ba5d2ebe6f15ec84fdbd9e41f7b0585e5f0e5`; transformation and canonicalizer hashes also exact.
6. **O8 CONFORMANCE MISMATCHES?** 0 over 1,024 DEVELOPMENT action checks.
7. **NEGATIVE FIXTURES x/total?** 11/11 rejected before Primary.
8. **SOURCE / PROVENANCE VALIDATION?** PASS — fresh counter generation, zero B1.001 overlap, schema integrity, and two-sided hashed provenance comparisons passed.
9. **TEST-FRAME N?** 640.
10. **IDENTIFIABLE N?** 640.
11. **AMBIGUOUS N?** 0.
12. **N_PRIMARY?** 640.
13. **EXACT OPERATOR BALANCE?** YES — 80 cases for each of 8 operators.
14. **SHARED INPUT BYTE EQUALITY?** YES.
15. **L1?** PASS — accuracy 0.125; exact binomial p `0.52527896682146297155…`.
16. **L2?** PASS — accuracy 0.000; exact binomial p 1.
17. **L3?** PASS — inputs/schedules/predictions/commits unchanged after truth derangement.
18. **L4?** PASS — semantic predictions and match counts order-invariant.
19. **L5?** PASS — 0 forbidden occurrences.
20. **L6?** PASS — independent shadow-truth schedule bytes identical.
21. **L7?** PASS — both committed prediction hashes precede first truth-open event.
22. **BASELINE COVERAGE OF TRUE OPERATOR?** 640/640 (100%).
23. **COMPUTE-BUDGET FAIRNESS?** PASS — every per-case ledger within every frozen cap; duplicate and uninstrumented counts zero.
24. **BASELINE B joint success?** 640/640 = 1.000.
25. **PLUS_O8 joint success?** 640/640 = 1.000.
26. **Delta_hat?** 0.000.
27. **FROZEN MARGIN PASS?** NO — 0.000 < 0.20.
28. **McNemar discordant counts?** baseline-only 0; PLUS-only 0; total discordant 0. Both-success 640; both-fail 0.
29. **Exact p-value?** 1 (one-sided exact paired McNemar; does not pass alpha 0.01).
30. **D1?** PASS — shifted-truth joint success 0 in both arms; prediction hashes unchanged.
31. **D2?** PASS — corrupted-registry PLUS joint success 0; corruption detected.
32. **D3?** PASS — 640 zero-match pairs; false identifications 0 and accepted recoveries 0 in both arms.
33. **D4?** PASS — predictions, match counts, and recovery behavior byte-identical after metadata stripping.
34. **D5-G / D5-B / D5-Z?** PASS / PASS / PASS — 96/96/96 executed; false identifications 0/0/0.
35. **D6?** PASS — 96 lossy-sort fixtures; false identification/recovery 0; loss boundary recorded.
36. **TRIVIALITY / CEILING AUDIT?** UNINFORMATIVE triggers: BASELINE B ceiling (1.000 >= 0.95) and no informative discordance. No validity failure.
37. **PRIMARY HASH?** `6b59d76711974bfb191225090adcd978cb3f1c3ce9b380d530a1b4e0b8a4cc85`.
38. **REPLAY HASH?** `6b59d76711974bfb191225090adcd978cb3f1c3ce9b380d530a1b4e0b8a4cc85`.
39. **REPLAY IDENTICAL?** YES — scientific bytes and every registered stage hash identical; final gate count 27/27 PASS.
40. **FINAL CLASS?** `UNINFORMATIVE_BENCHMARK`.
41. **O8_UTILITY_DEMONSTRATED YES/NO?** NO.
42. **WHAT B1.002 ESTABLISHES.** On this fresh held-out domain, both the validated O8 provider and the strong O8-unaware generic affine baseline identify and exactly recover every admissible case under the registered controls and budgets. The run is valid and deterministically reproducible.
43. **WHAT B1.002 DOES NOT ESTABLISH.** It does not establish incremental O8 hypothesis-space compression/disambiguation utility, because BASELINE B already achieves the ceiling and there are no discordant cases. It also does not establish learning, navigation, control, physical truth, domain transfer, NEXAH validity, or utility beyond this protocol.
44. **SINGLE RECOMMENDED NEXT ACTION.** Stop utility claims from B1.002 and perform a design-only ceiling analysis before proposing any new benchmark; do not rerun or tune B1.002.
