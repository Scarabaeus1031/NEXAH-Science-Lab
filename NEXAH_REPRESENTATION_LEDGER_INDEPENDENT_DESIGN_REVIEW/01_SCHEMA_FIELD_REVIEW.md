# Schema Field Review

| Field | Classification | Independent-review finding |
|---|---|---|
| `schema_version` | `ROBUST` | clear compatibility identifier |
| `translation_id` | `ROBUST` | syntactically clear; stable identity policy is not defined |
| `source` / `target` | `UNDERDEFINED` | type plus free-form subtype and mandatory artifacts do not provide a representation contract |
| endpoint `artifacts` | `AMBIGUOUS` | concrete instances are useful, but `minItems: 1` rejects legitimate abstract transformations |
| `operator.kind` | `ROBUST` | four broad kinds are understandable |
| operator `name/version/definition_ref` | `AMBIGUOUS` | version semantics and boundary between callable and composite pipeline are unspecified |
| `parameters` | `UNDERDEFINED` | unconstrained object; effective defaults/environment may be omitted |
| `assumptions` | `AMBIGUOUS` | machine key helps, but completeness and judgment provenance are unspecified |
| `claims.preservation` | `MISSING_CRITICAL_FIELD` | lacks explicit equivalence relation, metric/test, tolerance, and assessment mode |
| `claims.loss` | `MISSING_CRITICAL_FIELD` | lacks source-distinction criterion, instance witness, and explicit structural/instance/task scope |
| `claims.collisions` | `AMBIGUOUS` | target criterion exists, but source distinction criterion is only implied by two refs |
| `claims.introduced` | `UNDERDEFINED` | prose object/assertion cannot distinguish generated labels from scientific structure reliably |
| `uncertainty` | `AMBIGUOUS` | state vocabulary is useful; no epistemic source, applicability rule, or qualitative/empirical distinction |
| `invertibility` | `AMBIGUOUS` | classes are usable, but declared domain/codomain and inverse/reconstructor reference are absent |
| `task_relevance` | `ROBUST` | `UNDEFINED` is first-class; defined tasks require owner and criterion |
| `evidence` | `AMBIGUOUS` | basis is categorical, but `verification` can mean locator integrity or claim support |
| `provenance` | `MISSING_CRITICAL_FIELD` | repository and commit are forced; unknown/not-applicable origin cannot be represented honestly |
| `status` | `MISSING_CRITICAL_FIELD` | one state conflates execution, reproduction, provenance, and scientific interpretation |
| `content_status` | `AMBIGUOUS` | useful barrier, but a symbolic artifact can simply be mislabeled technical |
| `component_edges` | `UNDERDEFINED` | no order, compatibility, or composition assertion |
| `negative_results` | `MISSING_CRITICAL_FIELD` | content can be encoded but later deletion/overwrite is not prevented; no revision lineage |
| evidence-reference integrity | `MISSING_CRITICAL_FIELD` | IDs need not be unique or resolvable under the schema |
| judgment provenance | `MISSING_CRITICAL_FIELD` | claims do not identify deterministic/rule-guided/expert assessment or assessor |

The schema represents `UNKNOWN` for artifacts, uncertainty, invertibility, and edge status, but not for provenance origin. It does not force nonempty preservation/loss claims, which is good; it does force at least one artifact on every endpoint, which is not.

