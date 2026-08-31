# 01 — IPG-01 Test Specification

## Synthetic bounded model

The model uses no historical or numerical evidence.

- Original object: `O`, ID `O-001`.
- Specification: `S`, derived by recorded edge `O→S`.
- Required specification fields: `pattern=D1`, `color=navy`, `size=M`,
  `material=cotton`.
- Conforming manufactured instances: `I1`, `I2`, `I3`, each with a unique ID
  and recorded parent `S`.
- Similarity control `I4`: matches exactly three of four fields but has
  `material=polyester`; it does not conform.
- Provenance control `I5`: has the same four observable fields as I1 and
  conforms observationally, but has no recorded derivation edge.
- Similarity: defined only for instance records and true when at least three of
  four declared fields match.
- Generation: shortest directed derivation-edge distance from root O.

Temporal order, names, numbers and visual resemblance never create a derivation
edge.
