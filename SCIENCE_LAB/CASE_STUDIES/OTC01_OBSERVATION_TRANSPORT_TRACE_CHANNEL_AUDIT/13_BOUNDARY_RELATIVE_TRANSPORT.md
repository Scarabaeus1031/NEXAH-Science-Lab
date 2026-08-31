# Boundary-Relative Transport

For a declared oriented boundary with unit normal `n`, where a vector flux `J`
is physically valid:

```text
J_normal_scalar = J · n
J_normal_vector = (J · n)n
J_tangential    = J - (J · n)n
```

The sign of `J · n` distinguishes inward/outward only after the normal convention
is declared. “Across” refers to the normal component; “along” refers to the
tangential component. Blocked/non-transmitted means the applicable transmitted
component is zero or below a declared threshold for the stated boundary model.

This decomposition does not apply automatically to every notion of transport.
For non-vector transfer, the record must state the domain-specific relation,
direction convention and criterion. A boundary need not be a barrier; it may
transmit, reflect, absorb, scatter, transform or conditionally admit.

`BOUNDARY_RELATIVE_TRANSPORT_STATUS=DERIVED_RECORD_SUFFICIENT`

No universal OLS primitives for `IN/OUT/ACROSS/ALONG` are required.
