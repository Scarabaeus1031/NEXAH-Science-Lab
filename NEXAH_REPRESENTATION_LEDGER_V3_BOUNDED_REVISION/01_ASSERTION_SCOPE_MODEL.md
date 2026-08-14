# Assertion-Scope Model

Every preservation, loss, collision, uncertainty, invertibility, and claim-history assertion contains one `scope` object.

| Type | Required reference |
|---|---|
| `WHOLE_EDGE` | edge ID; no component/projection reference |
| `COMPONENT` | exactly one declared component ID |
| `SUBPATH` | two or more declared component IDs in execution order |
| `DERIVED_PROJECTION` | explicit projection contract and source scope |
| `SCOPE_UNRESOLVED` | reason; cannot support the strongest claim status |

The schema constrains the shape of each scope. Referential checking must additionally confirm component IDs occur in the current operator and preserve declared order. A component/subpath/projection assertion cannot be read as a whole-edge property.

