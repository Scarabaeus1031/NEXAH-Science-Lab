# Candidate Residual Schema

## Revised record

```text
ResidualRecord {
  record_id
  source_object_or_state
  source_domain
  operator_or_execution
  boundary_or_constraint
  reference
  orientation
  observation
  residual_present
  residual_kind
  residual_value
  sign
  unit
  retained
  lost
  introduced
  unresolved
  reversibility_status
  trace
  provenance
  evidence_status
  claim_boundary
  domain_fields
}
```

`domain_fields` is the sole structural revision. It is a container for declared domain-specific fields, not a new NVC-01 type or semantic primitive.

## Field classification

| Field | Classification | Rule |
|---|---|---|
| `record_id` | `REQUIRED` | unique documentary identity |
| `source_object_or_state` | `REQUIRED` | what the record is about; does not infer identity from state |
| `source_domain` | `REQUIRED` | arithmetic, material, biological, representation or formal control |
| `operator_or_execution` | `REQUIRED` | typed declaration or explicit `NONE_DECLARED`; operator ≠ execution |
| `boundary_or_constraint` | `REQUIRED` | admissibility, interface or test boundary |
| `reference` | `REQUIRED` | comparator, bound or baseline |
| `orientation` | `DOMAIN_SPECIFIC` | required where sign/view depends on orientation; otherwise `NOT_APPLICABLE` |
| `observation` | `REQUIRED` | what is recorded, not an inferred mechanism |
| `residual_present` | `REQUIRED` | Boolean; `false` is not `NOT_APPLICABLE` |
| `residual_kind` | `OPTIONAL` | required only when `residual_present=true`; otherwise `NOT_APPLICABLE` |
| `residual_value` | `DOMAIN_SPECIFIC` | numeric only where defined; qualitative records do not receive invented values |
| `sign` | `DOMAIN_SPECIFIC` | meaningful only relative to a declared orientation/reference |
| `unit` | `DOMAIN_SPECIFIC` | required for dimensional numeric values; `NOT_APPLICABLE` for dimensionless/qualitative cases |
| `retained` | `REQUIRED` | explicit list or `NONE_DECLARED` |
| `lost` | `REQUIRED` | explicit list, `NONE_DECLARED`, or `UNDERDEFINED` |
| `introduced` | `REQUIRED` | explicit list or `NONE_DECLARED` |
| `unresolved` | `REQUIRED` | explicit list or `NONE` |
| `reversibility_status` | `REQUIRED` | `REVERSIBLE`, `NOT_ESTABLISHED`, `IRREVERSIBLE_IN_DECLARED_MODEL`, or `UNDERDEFINED` |
| `trace` | `REQUIRED` | attested trace, declared formal transition, or `NOT_ATTESTED`; never inferred |
| `provenance` | `REQUIRED` | source of the record; not interchangeable with trace |
| `evidence_status` | `REQUIRED` | formal, authoritative contextual, primary empirical, closed record, or control |
| `claim_boundary` | `REQUIRED` | strongest permitted interpretation and explicit exclusions |
| `domain_fields` | `DOMAIN_SPECIFIC` | typed extension map; empty only when no extension is needed |

`NOT_APPLICABLE` denotes absence of applicability. It is never encoded as numeric zero.

## Residual-kind decisions

| Candidate | Decision | Reason |
|---|---|---|
| `SIGNED_REMAINDER` | `RETAIN` | well-defined for Case A with reference orientation |
| `MATERIAL_REACTION_PRODUCT` | `RETAIN` | required to keep Case B material/product status distinct |
| `ENERGY_DISSIPATION` | `UNDERDEFINED_NOT_TESTED` | no required case supplies a bounded dissipation record |
| `STRUCTURAL_TRACE` | `REJECT_AS_CURRENT_KIND` | no primary case defines it adequately; must remain distinct from NVC `TRACE` |
| `FUNCTIONAL_STATE_CHANGE` | `RETAIN` | bounded description of Case C observations, not a mechanism |
| `REPRESENTATION_DIFFERENCE` | `RETAIN` | captures Case D without independent-confirmation inference |
| `UNRESOLVED_INFORMATION` | `MOVE_TO_UNRESOLVED_OR_EVIDENCE_STATUS` | uncertainty is not itself a residual phenomenon |
| `NO_RESIDUAL` | `REMOVE_AS_KIND` | represented by `residual_present=false`; kind becomes `NOT_APPLICABLE` |

The retained labels are record values local to EVR-01. They are not new Core Types or Operators.

## Required domain extensions

- Arithmetic: divisor/modulus, quotient, lower/upper reference bound, normalization convention.
- Material: reactants/material identities, interface/environment, product phase/composition status, measured amount and unit if present.
- Biological: organism/strain, pigment condition, exposure condition, comparator, assay/endpoint, measurement unit if a value is cited.
- Representation: representation IDs/maps, source relation, explicit retained/lost/introduced/unresolved definitions.
- Zero control: reversibility contract and trace-attestation status.
