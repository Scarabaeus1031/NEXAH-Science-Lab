# Minimum publishable object

```text
TITLE_WORKING = Collision-Aware Evaluation of Representation Robustness and Counterfactual Discrimination in Synthetic Transition-Graph Pipelines
OBJECT_TYPE = REPRODUCIBILITY_AND_NEGATIVE_RESULTS_TECHNICAL_REPORT_WITH_VERSIONED_ARTIFACT
PRIMARY_QUESTION = How should preservation under representation changes be interpreted when coarse transition certificates collide on distinct counterfactual systems?
PRIMARY_CONTRIBUTION = A bounded collision-aware dual-axis evaluation protocol plus three frozen synthetic studies showing qualified reproduction, exact-hierarchy failure, and decoder dependence.
```

## Core evidence

- Study 1 result `69aa9f65…`: minimal controlled observation;
- Study 2 result `589c2195…`: 576 cells, byte-identical replay, support
  `R=0.906/D=0.344`, weighted graph approximately `R=0.444/D=0.922`;
- Study 3 result `36657449…`: independent decoder, correlations
  detail–R `-0.808`, detail–D `+0.741`, R–D `-0.838`, exact hierarchy failure;
- Study-3 worked case: mapping accuracy `0.7896`, 20 collision pairs, edge
  recall `0.6081`, delay C1-C6 `0/20`;
- existing literature/novelty audits and all negative-result ledgers;
- 61 manifest/source hashes independently matched in this audit.

## Required presentation objects

### Figures

1. certificate-level `R` versus `D` scatter/Pareto view with no universal fit;
2. robustness, discrimination and collision counts by certificate level;
3. Study-3 source → representation → decoder → transition/certificate
   first-loss diagram.

All figures must be generated only from frozen JSON and marked descriptive.

### Tables

1. cross-study design and result matrix;
2. certificate definitions, information discarded, `R`, `D` and collisions;
3. preregistered hypotheses/falsifiers and outcomes;
4. claims allowed/prohibited and implementation limitations;
5. artifact identities, hashes and replay environments.

### Code and data

Only the frozen Study 1–3 protocols, runners, primary result JSON, manifests and
replay records are required. EXP-T01, Ledger V3 and the representation case map
are optional supplements. Level-1C, T02, ORION, EXP-00-R and Codex material are
excluded.

Candidate source roots, to be reduced to a release allowlist rather than copied
wholesale, are:

- `NEXAH_OPERATOR_INVARIANCE_BATTERY/` (Study 1);
- `NEXAH_TRANSLATION_INVARIANT_REPLICATION/` (Study 2);
- `NEXAH_TRANSLATION_FIDELITY_EXPERIMENT/` (Study 3);
- `NEXAH_TRANSLATION_FIDELITY_SYNTHESIS/`;
- `NEXAH_TRANSLATION_FIDELITY_LITERATURE_AUDIT/` and
  `NEXAH_TRANSLATION_FIDELITY_RECOVERY_LITERATURE_GAP_AUDIT/`.

## Claims allowed

- the exact internal synthetic measurements and byte-identical local replays;
- the exact hierarchy failed independent-decoder replication;
- coarse certificates can appear robust while collapsing tested distinctions;
- collision-aware joint reporting changed interpretation of the frozen results;
- the operational bundle merits external evaluation.

## Claims prohibited

New mathematics, a new general trade-off, universality, inevitable monotonicity,
optimality/sufficiency of count rank, causal explanation, external replication,
domain performance, prediction, early warning, stability, risk, control,
physical meaning, ORION capability, or NEXAH superiority.
