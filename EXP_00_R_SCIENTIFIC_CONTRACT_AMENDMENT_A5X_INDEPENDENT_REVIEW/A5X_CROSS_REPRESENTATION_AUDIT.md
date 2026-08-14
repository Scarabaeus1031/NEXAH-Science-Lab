# A5X Cross-Representation Audit

The chain is not isomorphic:

- scientific prose requires exact N1/N4/N5 transforms, dominance and P1–P5 derivation;
- machine fingerprints mention many rules, but `validate_machine` does not assert several of them;
- raw schemas omit matrices/transforms/dominance/required null statistic identity;
- validator accepts producer P Booleans and caller-provided provenance expectations;
- tests establish selected schemas and root attacks but encode successful counterexamples as no failure.

The authority root faithfully seals these representations; it cannot make nonequivalent representations equivalent. **Cross-representation equivalence: FAIL (Class B).**

