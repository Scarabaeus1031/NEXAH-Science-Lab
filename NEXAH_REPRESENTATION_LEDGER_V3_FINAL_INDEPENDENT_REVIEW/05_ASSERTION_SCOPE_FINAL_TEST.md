# Assertion-Scope Final Test

## Result: PASS

Every substantive V3 assertion type inspected—preservation, loss, collision, uncertainty, invertibility, overall claim support, and claim history—requires an explicit scope. The closed alternatives distinguish:

- `WHOLE_EDGE`;
- exactly one `COMPONENT`;
- an ordered multi-component `SUBPATH`;
- a `DERIVED_PROJECTION` with source-scope and projection contract;
- `SCOPE_UNRESOLVED` with a reason.

The four samples use operator IDs and component IDs referentially consistently. Case C correctly binds round-trip properties to `C.C1 -> C.C2` and projected-label loss to a projection of the full target. Case D uses `SCOPE_UNRESOLVED` for aggregate invertibility.

There is no structural rule that promotes a component, subpath, or projection assertion to the whole edge. A future referential checker can verify edge membership, component existence, uniqueness, and subpath order.

As expected, an author can still falsely label a component fact as `WHOLE_EDGE` and cite plausible evidence. Neither schema nor referential validation can decide whether evidence semantically warrants that scope. This is the truth-boundary limitation, not structural scope leakage.

`ASSERTION_SCOPE_FINAL_TEST = PASS`
