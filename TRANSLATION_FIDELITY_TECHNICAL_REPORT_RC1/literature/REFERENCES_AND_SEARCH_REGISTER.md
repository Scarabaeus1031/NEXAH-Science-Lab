# References and Search Register

Search date: 2026-08-13. Searches covered representation learning, information
theory, machine learning robustness, signal processing, TDA, graph learning,
dynamical reconstruction, statistics, measurement theory and explicit
invariance–discriminability formulations. Primary papers and publisher/
proceedings records were preferred. This is a targeted audit, not a claim of
systematic-review completeness.

## Core sources

**R1. Manik Varma and Debajyoti Ray. “Learning the Discriminative
Power–Invariance Trade-Off.” 2007, IEEE ICCV, pp. 1–8.**
DOI: [10.1109/ICCV.2007.4408875](https://doi.org/10.1109/ICCV.2007.4408875).
Directly states that descriptors differ by their invariance/discriminative-power
trade-off, uses the constant descriptor as the fully invariant/non-discriminative
extreme, and learns a task-specific combination. Closest conceptual precedent.

**R2. Han Zhao, Chen Dan, Bryon Aragam, Tommi S. Jaakkola, Geoffrey J.
Gordon, and Pradeep Ravikumar. “Fundamental Limits and Tradeoffs in Invariant
Representation Learning.” 2022, JMLR 23(340):1–49.**
[Stable article](https://jmlr.org/papers/v23/21-1078.html).
Information-theoretic feasible region and Pareto frontier between target
accuracy/information and invariance. Closest formal Pareto precedent.

**R3. Alessandro Achille and Stefano Soatto. “Emergence of Invariance and
Disentanglement in Deep Representations.” 2018, JMLR 19(50):1–34.**
[Stable article](https://jmlr.org/papers/v19/17-646.html).
Relates nuisance invariance to information minimality for sufficient
representations; directly supports an information-removal interpretation.

**R4. Naftali Tishby, Fernando C. Pereira, and William Bialek. “The
Information Bottleneck Method.” 1999, 37th Allerton Conference.**
[arXiv:physics/0004057](https://arxiv.org/abs/physics/0004057).
Formalizes short representations that preserve information relevant to a target;
generalizes rate-distortion and minimal sufficiency.

**R5. Jörn-Henrik Jacobsen, Jens Behrmann, Richard Zemel, and Matthias
Bethge. “Excessive Invariance Causes Adversarial Vulnerability.” 2019, ICLR.**
[OpenReview](https://openreview.net/forum?id=BkfbpsAcF7).
Shows representations can be invariant to task-relevant changes; separates
sensitivity failures from excessive-invariance failures.

**R6. Fabio Anselmi, Lorenzo Rosasco, and Tomaso Poggio. “On Invariance and
Selectivity in Representation Learning.” 2016, Information and Inference
5(2):134–158.** DOI:
[10.1093/imaiai/iaw009](https://doi.org/10.1093/imaiai/iaw009).
Defines the desired combination of invariance and selectivity: equality should
occur only along the intended transformation orbit.

**R7. Krystian Mikolajczyk and Cordelia Schmid. “A Performance Evaluation of
Local Descriptors.” 2005, IEEE TPAMI 27(10):1615–1630.** DOI:
[10.1109/TPAMI.2005.188](https://doi.org/10.1109/TPAMI.2005.188).
Evaluates descriptors expected to be both robust to viewing/detection changes
and distinctive. Strong precedent for dual empirical evaluation.

**R8. Bernhard C. Geiger and Christoph Temmel. “Information-Preserving Markov
Aggregation.” 2013, IEEE Information Theory Workshop, pp. 258–262.** DOI:
[10.1109/ITW.2013.6691265](https://doi.org/10.1109/ITW.2013.6691265).
Studies when non-injective Markov state aggregation preserves entropy rate;
closest state-transition/coarse-graining precedent.

**R9. Joan Bruna and Stéphane Mallat. “Invariant Scattering Convolution
Networks.” 2013, IEEE TPAMI 35(8):1872–1886.** DOI:
[10.1109/TPAMI.2012.230](https://doi.org/10.1109/TPAMI.2012.230).
Constructs representations that are invariant/stable while retaining
high-frequency information useful for discrimination; counters inevitability.

**R10. Keyulu Xu, Weihua Hu, Jure Leskovec, and Stefanie Jegelka. “How
Powerful Are Graph Neural Networks?” 2019, ICLR.**
[Official ICLR page](https://iclr.cc/virtual/2019/poster/791).
Characterizes collisions/indistinguishability and graph-representation
expressivity through the Weisfeiler–Lehman bound.

## Additional primary precedents

**R11. Ian Goodfellow, Honglak Lee, Quoc V. Le, Andrew Saxe, and Andrew Y. Ng.
“Measuring Invariances in Deep Networks.” 2009, NeurIPS 22.**
[Proceedings](https://proceedings.neurips.cc/paper/2009/hash/428fca9bc1921c25c5121f9da7815cde-Abstract.html).
Introduces empirical invariance tests and explicitly notes tension between
selectivity and robustness.

**R12. Tongzhou Wang and Phillip Isola. “Understanding Contrastive
Representation Learning through Alignment and Uniformity on the Hypersphere.”
2020, ICML, PMLR 119:9929–9939.**
[PMLR](https://proceedings.mlr.press/v119/wang20k.html).
Separates alignment of transformed pairs from distributional uniformity that
avoids collapse and supports downstream separation.

**R13. Adrien Bardes, Jean Ponce, and Yann LeCun. “VICReg:
Variance–Invariance–Covariance Regularization for Self-Supervised Learning.”
2022, ICLR.** [OpenReview](https://openreview.net/forum?id=xm6YD62D1Ub).
Combines invariance with explicit variance/covariance terms to prevent constant
or informational collapse.

**R14. Stéphane Mallat. “Group Invariant Scattering.” 2012, Communications on
Pure and Applied Mathematics 65:1331–1398.** DOI:
[10.1002/cpa.21413](https://doi.org/10.1002/cpa.21413).
Proves group invariance and deformation stability while retaining higher-order
statistics capable of discriminating processes.

**R15. David G. Lowe. “Distinctive Image Features from Scale-Invariant
Keypoints.” 2004, IJCV 60(2):91–110.** DOI:
[10.1023/B:VISI.0000029664.99615.94](https://doi.org/10.1023/B:VISI.0000029664.99615.94).
Classic construction/evaluation of features intended to be invariant, robust
and distinctive.

**R16. Christopher Morris et al. “Weisfeiler and Leman Go Neural:
Higher-Order Graph Neural Networks.” 2019, AAAI 33:4602–4609.** DOI:
[10.1609/aaai.v33i01.33014602](https://doi.org/10.1609/aaai.v33i01.33014602).
Shows standard GNN expressivity shares 1-WL limits and higher-order structure
improves discrimination.

**R17. Kenta Oono and Taiji Suzuki. “Graph Neural Networks Exponentially Lose
Expressive Power for Node Classification.” 2020, ICLR.**
[OpenReview](https://openreview.net/forum?id=S1ldO2EFPr).
Formalizes representation collapse toward component/degree information under
specified graph-network dynamics.

**R18. Bernhard C. Geiger, Tatjana Petrov, Gernot Kubin, and Heinz Koeppl.
“Optimal Kullback–Leibler Aggregation via Information Bottleneck.” 2015, IEEE
Transactions on Automatic Control 60(4):1010–1022.** DOI:
[10.1109/TAC.2014.2364971](https://doi.org/10.1109/TAC.2014.2364971).
Optimizes reduced Markov models using KL divergence rate and information
bottleneck machinery.

**R19. Floris Takens. “Detecting Strange Attractors in Turbulence.” 1981,
Lecture Notes in Mathematics 898:366–381.** DOI:
[10.1007/BFb0091924](https://doi.org/10.1007/BFb0091924).
Gives generic conditions for faithful delay reconstruction; it does not imply
that arbitrary finite-sample clustering/certificates are delay-stable.

**R20. David Cohen-Steiner, Herbert Edelsbrunner, and John Harer. “Stability of
Persistence Diagrams.” 2007, Discrete & Computational Geometry 37:103–120.**
DOI: [10.1007/s00454-006-1276-5](https://doi.org/10.1007/s00454-006-1276-5).
Separates formal stability of a summary from completeness/expressive content.

**R21. David Blackwell. “Equivalent Comparisons of Experiments.” 1953, Annals
of Mathematical Statistics 24(2):265–272.** DOI:
[10.1214/aoms/1177729032](https://doi.org/10.1214/aoms/1177729032).
Orders experiments by decision-relevant informativeness; garbling cannot create
decision information.

**R22. Claude E. Shannon. “Coding Theorems for a Discrete Source With a
Fidelity Criterion.” 1959, IRE National Convention Record 7:142–163.**
[IEEE record](https://ieeexplore.ieee.org/document/5311476).
Foundational rate–distortion formulation: compression is evaluated against a
declared fidelity criterion.

**R23. Donald T. Campbell and Donald W. Fiske. “Convergent and Discriminant
Validation by the Multitrait–Multimethod Matrix.” 1959, Psychological Bulletin
56(2):81–105.** DOI: [10.1037/h0046016](https://doi.org/10.1037/h0046016).
Separates agreement across methods from discriminant validity across traits.

**R24. William Meredith. “Measurement Invariance, Factor Analysis and
Factorial Invariance.” 1993, Psychometrika 58:525–543.** DOI:
[10.1007/BF02294825](https://doi.org/10.1007/BF02294825).
Formal measurement-invariance tradition; related to cross-condition
comparability but not the same as graph-certificate preservation.

**R25. Gordon H. Guyatt, Bram Kirshner, and Roman Jaeschke. “Measuring Health
Status: What Are the Necessary Measurement Properties?” 1992, Journal of
Clinical Epidemiology 45(12):1341–1345.** DOI:
[10.1016/0895-4356(92)90194-R](https://doi.org/10.1016/0895-4356(92)90194-R).
Distinguishes discriminative instruments from responsiveness to change.

**R26. Dimitris Tsipras, Shibani Santurkar, Logan Engstrom, Alexander Turner,
and Aleksander Madry. “Robustness May Be at Odds with Accuracy.” 2019, ICLR.**
[arXiv:1805.12152](https://arxiv.org/abs/1805.12152).
Proves a robustness–accuracy tension in a specific adversarial classification
setting; related analogy, not equivalent to certificate translation.

**R27. Manik Varma and Debajyoti Ray's setting is complemented by quantitative
descriptor characterization: C. Schmid and coauthors' literature explicitly
measures distinctiveness and robustness.** The primary representative used here
is R7; a direct later example is P. Moreels and P. Perona, “Evaluation of
Features Detectors and Descriptors Based on 3D Objects,” 2007, IJCV 73:263–284,
DOI [10.1007/s11263-006-9967-1](https://doi.org/10.1007/s11263-006-9967-1).

**R28. Martin Arjovsky, Léon Bottou, Ishaan Gulrajani, and David Lopez-Paz.
“Invariant Risk Minimization.” 2019.**
[arXiv:1907.02893](https://arxiv.org/abs/1907.02893).
Targets predictors invariant across environments; relevant terminology but not
equivalent to certificate equality versus counterfactual discrimination.

## Coverage conclusion

All ten requested areas have direct coverage. The strongest novelty-destroying
sources are R1–R6 and R21–R22; R8/R18 and R10/R16/R17 locate the question in
state aggregation and graph expressivity. No source located the exact frozen
combination of synthetic state-sequence translation, certificate ladder,
matched graph counterfactuals and collision ledger, but the conceptual pieces
are well established.
