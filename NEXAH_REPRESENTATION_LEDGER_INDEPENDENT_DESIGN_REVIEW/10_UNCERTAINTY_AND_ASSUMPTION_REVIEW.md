# Uncertainty and Assumption Review

The state vocabulary correctly separates `UNKNOWN`, `NOT_QUANTIFIED`, and `NOT_APPLICABLE`, and does not require a probability distribution. This avoids false precision.

Remaining ambiguity:

- `NOT_QUANTIFIED` can mean known qualitative effect, unmeasured magnitude, or measurement omitted.
- no field identifies epistemic source (`MEASURED`, `ANALYTIC_BOUND`, `MODEL_JUDGMENT`, `UNKNOWN`);
- evidence references are optional for uncertainty;
- empty uncertainty arrays allow omission without an explicit applicability judgment.

Case A needs discretization/classification `NOT_QUANTIFIED` and historical input `UNKNOWN`. Case B needs grid/border sensitivity `NOT_QUANTIFIED`. Case C has bounded numerical error with frozen metric/tolerance. Case D has empirical finite-sample/decoder dependence, not numerical uncertainty.

Assumption keys are helpful, but completeness is judgment-based. Effective defaults and environment assumptions can be omitted. All selection of “material” assumptions is `EXPERT_JUDGMENT`; the schema does not record who made it or under which rubric.

