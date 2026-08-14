# Formal Translation Model

The frozen chain is

```text
x_* --R--> X --T--> Y --T^-1/reconstructor--> X_hat --R^-1--> x^*
```

For these fixtures, `R` and `R^-1` are explicit identity encodings, so they add
no information. `T^-1` exists only for transformations registered as bijective.
A perturbed inverse reconstructs an estimate; a lossy map has no inverse and the
evaluator must not fabricate `x^*`.

Primary state error is the maximum absolute coordinate error for numeric states
and exact edge-set mismatch for graphs. Certificate error is exact equality of
canonical certificate payloads. `E_rec=0` does not alone establish forward
structural preservation, uniqueness outside the declared domain, scientific
utility, or dynamical stability.

Primary recovery statuses are exactly:

`EXACT_RECOVERY`, `TOLERANCE_RECOVERY`,
`STRUCTURE_PRESERVED_STATE_CHANGED`, `STRUCTURE_CHANGED`, `INFORMATION_LOST`,
`UNIDENTIFIABLE`, `INVALID`.

Loss classification rule: `UNIDENTIFIABLE` is used when the output has at least
two explicitly exhibited source preimages and the evaluator cannot choose one;
`INFORMATION_LOST` is used when a registered destructive map deletes/collapses a
declared relation and no inverse is offered. Undefined recovery error remains
JSON `null`, never zero.

