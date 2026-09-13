# Minimum Test Specification — Specification Only

Status: optional future gate; **not authorized for execution**.

## Question

Under the same plant, initial state/energy, task boundary, contact model, and accounted input, does condition 4 improve preregistered task loss versus condition 3?

## Minimum design

- Start with a reproducible simulation or benchtop two-link/two-axis plant before human-subject interpretation.
- Preregister plant parameters, axis conventions, objective, input/work budget, four conditions, perturbations, exclusions, and analysis.
- Randomize condition order; blind analysis labels where practical.
- Measure generalized state, actuator torque/work, `K(t)` and `Kdot`, contact force/pressure geometry, external impulse, brake onset, release `t_r`, delayed observations, and endpoint residual.
- Use repetitions sufficient for interval estimates and plant variability; sample size follows an a priori variance/effect calculation, not a fixed number invented here.
- Report effect and uncertainty for 4−3 first; 1 and 2 are calibration/mechanism controls.

## Pass/fail logic

Provisional support requires: (i) positive preregistered 4−3 improvement, (ii) closed energy/work/impulse ledger within tolerance, (iii) robustness across declared perturbations, and (iv) no dependence on relabeling coordinate frames.

Fail or revise if: gains disappear after actuator/stiffness work matching; pressure labels cannot be tied to units/geometry; axis angle is frame-artifact; release cannot be detected reliably; or results depend on post hoc corridor selection.

## Biology boundary

No cell or immune experiment follows from the mechanical result. A later biological comparison would require a separate biological hypothesis, assay, ethics/authority path, and domain-specific variables. Mechanical success cannot validate cellular transport or immunological identity.

