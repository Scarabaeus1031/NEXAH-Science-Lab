# Required Mathematics

## AP-09 — Representation-loss and reconstruction analysis

### Definitions required

- source and representation spaces;
- declared forward and reverse maps without assuming invertibility;
- equivalence of source states under an observation family;
- known information-loss model;
- comparison metric and coordinate admissibility;
- identifiability, underdetermination, and impossibility conditions;
- relationship between round-trip discrepancy and erased distinctions.

### Existing constraints

Labs 0.3 and 0.4 supply counterexamples. They show that boundary interpolation can miss hidden switches and that selected views can collapse distinct source threads. They do not supply a general loss metric or theorem.

### Stop condition

Do not build a general analysis method if the comparison rule cannot distinguish information loss from reconstruction prior or coordinate choice.

## AP-10 — Relation-derived observable comparison

### Definitions required

- finite field and relation construction;
- exact output components instead of one opaque score;
- encoding equivalence that preserves the declared relations;
- stability norm under relation perturbation;
- field-only and simple graph baselines;
- nontriviality and insufficiency conditions.

### Existing constraints

B FQ-04 and RQ-04 recover the question. C-48 records that no defined output, relation rule, baseline, or result exists.

### Stop condition

Do not implement while `g(F,RR)` or its output is undefined. Do not claim invariance under an unnamed encoding relation.

## Mathematics not required first

- AP-08 requires a protocol freeze and parameter choices, not a new theorem.
- AP-11 requires definition alignment and empirical comparison before further theory.
- AP-12 requires a typed interchange contract and conformance evidence; it does not justify new OLS semantics.
