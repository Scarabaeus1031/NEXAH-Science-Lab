# Literature Survey

## Survey set

The count below includes twelve review or broad survey papers. Textbooks, standards, benchmark papers, and individual methods are listed separately and are not included in `NUMBER_OF_SURVEY_PAPERS`.

| ID | Survey or review | Field | Relevance |
|---|---|---|---|
| S-01 | Stuart, [Inverse Problems: A Bayesian Perspective](https://doi.org/10.1017/S0962492910000061), Acta Numerica, 2010 | Inverse Problems | Well-posed Bayesian formulation, regularization, uncertainty |
| S-02 | Arridge et al., [Solving Inverse Problems Using Data-Driven Models](https://doi.org/10.1017/S0962492919000059), Acta Numerica, 2019 | Inverse Problems | Survey of model- and data-driven inverse methods |
| S-03 | Khaleghi et al., [Multisensor Data Fusion: A Review of the State-of-the-Art](https://doi.org/10.1016/j.inffus.2011.08.001), Information Fusion, 2013 | Sensor Fusion | Aggregation architectures, uncertainty, fusion methodology |
| S-04 | Schafer and Graham, [Missing Data: Our View of the State of the Art](https://doi.org/10.1037/1082-989X.7.2.147), Psychological Methods, 2002 | Statistics | Missingness mechanisms and valid analysis |
| S-05 | Olfati-Saber, Fax, and Murray, [Consensus and Cooperation in Networked Multi-Agent Systems](https://doi.org/10.1109/JPROC.2006.887293), Proceedings of the IEEE, 2007 | Control / Networks | Consensus and graph-dependent aggregation |
| S-06 | Shuman et al., [The Emerging Field of Signal Processing on Graphs](https://doi.org/10.1109/MSP.2012.2235192), IEEE Signal Processing Magazine, 2013 | Graph Signal Processing | Signals and operators on irregular domains |
| S-07 | Newman, [The Structure and Function of Complex Networks](https://doi.org/10.1137/S003614450342480), SIAM Review, 2003 | Network Science | Standard network models, statistics, and dynamics |
| S-08 | Boccaletti et al., [Complex Networks: Structure and Dynamics](https://doi.org/10.1016/j.physrep.2005.10.009), Physics Reports, 2006 | Network Science | Structural and dynamical network methods |
| S-09 | Fortunato, [Community Detection in Graphs](https://doi.org/10.1016/j.physrep.2009.11.002), Physics Reports, 2010 | Network Science | Reduction/community methods and evaluation problems |
| S-10 | Truong, Oudre, and Vayatis, [Selective Review of Offline Change Point Detection Methods](https://doi.org/10.1016/j.sigpro.2019.107299), Signal Processing, 2020 | Signal Processing | Cost/search/constraint framework and evaluation metrics |
| S-11 | Haller, [Lagrangian Coherent Structures](https://doi.org/10.1146/annurev-fluid-010313-141322), Annual Review of Fluid Mechanics, 2015 | Dynamical Systems | Material transport structures and diagnostic boundaries |
| S-12 | Marwan et al., [Recurrence Plots for the Analysis of Complex Systems](https://doi.org/10.1016/j.physrep.2006.11.001), Physics Reports, 2007 | Dynamical Systems | Recurrence-based trajectory analysis and pitfalls |

`NUMBER_OF_SURVEY_PAPERS: 12`

## Standard textbooks and monographs

| Reference | Use |
|---|---|
| Cover and Thomas, [Elements of Information Theory](https://doi.org/10.1002/047174882X) | Data-processing inequality, sufficient statistics, information loss |
| Baier and Katoen, [Principles of Model Checking](https://mitpress.mit.edu/9780262026499/principles-of-model-checking/) | Labelled transition systems, traces, verification |
| Hartley and Zisserman, [Multiple View Geometry in Computer Vision](https://doi.org/10.1017/CBO9780511811685) | Projective observations, multi-view identifiability, reconstruction |
| Hansen, [Rank-Deficient and Discrete Ill-Posed Problems](https://www2.compute.dtu.dk/~pcha/Book/mm04.html) | Linear inversion, regularization, numerical benchmarks |

## Standards and community specifications

| Standard | Relevance |
|---|---|
| [W3C PROV family](https://www.w3.org/TR/prov-overview/) | Provenance model, serializations, constraints, interoperability |
| [SBGN Process Description](https://sbgn.github.io/specifications) | Domain-specific typed process representation in systems biology |
| [MATPOWER case format](https://matpower.org/docs/ref/matpower7.0/lib/caseformat.html) | Standard power-flow benchmark representation |

## Foundational and benchmark methods

| Reference | Method boundary |
|---|---|
| Rubin, [Inference and Missing Data](https://doi.org/10.1093/biomet/63.3.581) | Conditions for ignorability; not a general failure taxonomy |
| Kalman, [Linear Filtering and Prediction](https://doi.org/10.1115/1.3662552) | Linear Gaussian state estimation |
| Hermann and Krener, [Nonlinear Controllability and Observability](https://doi.org/10.1109/TAC.1977.1101601) | Nonlinear state distinguishability |
| Sinopoli et al., [Kalman Filtering With Intermittent Observations](https://doi.org/10.1109/TAC.2004.834121) | Estimation under observation dropout |
| Karcher, [Riemannian Center of Mass](https://doi.org/10.1002/cpa.3160300502) | Non-Euclidean barycenters |
| Pennec, [Intrinsic Statistics on Riemannian Manifolds](https://doi.org/10.1007/s10851-006-6228-4) | Geometric statistics and uncertainty |
| Spielman and Teng, [Spectral Sparsification of Graphs](https://doi.org/10.1137/08074489X) | Spectral graph preservation |
| Loukas, [Graph Reduction with Spectral and Cut Guarantees](https://www.jmlr.org/papers/v20/18-680.html) | Coarsening with declared approximation guarantees |
| Zhu et al., [CycleGAN](https://arxiv.org/abs/1703.10593) | Cycle consistency as a learned constraint; not proof of information preservation |

## Literature conclusion

The repository is not adjacent to one new discipline. It intersects established work in inverse problems, state estimation, formal transition systems, missing data, barycenters/data fusion, graph invariance and reduction, and dynamical diagnostics. Scientific work should enter through those literatures directly.
