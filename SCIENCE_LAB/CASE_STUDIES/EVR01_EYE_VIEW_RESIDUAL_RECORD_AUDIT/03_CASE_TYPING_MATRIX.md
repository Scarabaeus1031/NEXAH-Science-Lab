# Case Typing Matrix

| Field | A — arithmetic | B — corrosion | C — melanin-associated response | D — representation difference | E — zero control |
|---|---|---|---|---|---|
| `CASE_ID` | `EVR-A` | `EVR-B` | `EVR-C` | `EVR-D` | `EVR-E` |
| `DOMAIN` | arithmetic | material/chemical | biological/biophysical observation | representation/information | formal reversible control |
| `SOURCE_STATE` | integer 8451 relative to consecutive multiples of 4 | iron at an interface exposed to water and oxygen | melanized fungi/melanin under the cited tested conditions | one held source state/relation exposed through two bounded representations | declared state `S` |
| `EXECUTION_OR_OPERATOR` | division/comparison to lower and upper quotient bounds; optional normalization | corrosion reaction and transport at an interface | ionizing-radiation exposure under the study conditions | declared projection/representation and comparison | declared reversible execution |
| `BOUNDARY_OR_CONSTRAINT` | divisor 4; quotients 2112 and 2113 | iron/water/oxygen interface; exact environment and product mixture not universalized | species, pigment condition, dose/exposure, nutrient and assay controls of the cited experiments | `P1_NE_P2`; one source relation; explicit view contracts | identity/reversibility contract; no declared loss |
| `REFERENCE_ORIENTATION` | from below: 2112; from above: 2113 | initial metal and stated exposure context; orientation `NOT_APPLICABLE` | irradiated/nonirradiated and melanized/nonmelanized comparators as reported; orientation `NOT_APPLICABLE` | view P1 versus view P2; neither privileged by default | initial `S` compared with endpoint `S`; orientation `NOT_APPLICABLE` |
| `OBSERVATION` | same integer position has `+3` from below and `−1` from above; normalized `+3/4`, `−1/4` | iron oxide/hydroxide corrosion products occur; exact phase mix depends on conditions | altered melanin electronic/electron-transfer properties and enhanced fungal growth under tested conditions | representations differ in what is retained, lost, introduced and unresolved | endpoint state equals `S`; no loss declared |
| `RESIDUAL_PRESENT` | yes | yes | yes, as bounded observed change | yes, when a difference is registered | no |
| `RESIDUAL_KIND` | `SIGNED_REMAINDER` | `MATERIAL_REACTION_PRODUCT` | `FUNCTIONAL_STATE_CHANGE` | `REPRESENTATION_DIFFERENCE` | `NOT_APPLICABLE` |
| `VALUE_SIGN_UNIT` | `+3`, `−1`; normalized `+3/4`, `−1/4`; dimensionless | qualitative; value/sign/unit not supplied | qualitative in this ledger; study-specific measurements remain at source | qualitative typed difference; sign/unit not applicable | value/sign/unit not applicable, not zero-filled |
| `RETAINED` | source integer, divisor and selected reference bound | material lineage and exposure context at the stated classification level | organism, pigment and exposure/comparator identities | source relation plus declared content retained by each view | state `S` under the declared identity contract |
| `LOST` | none forced by exact equation; choosing one orientation omits the other unless both are recorded | original metallic state is altered; quantitative material balance not supplied | no loss claim established by the cited observation | view-specific omitted source information | `NONE_DECLARED` |
| `INTRODUCED` | signed coordinate relative to the selected bound; normalization introduces a coordinate representation | oxide/hydroxide reaction products | observed exposure-associated property/growth differences; not a proven mechanism | view-specific structure or annotation where declared | `NONE_DECLARED` |
| `UNRESOLVED` | none for the exact arithmetic; no physical meaning inferred | exact product composition, rate and detailed mechanism for an unspecified environment | complete energy-capture/conversion mechanism; photosynthesis and autonomous carbon fixation not established | any source content not recoverable or not attested by the view records | whether any execution trace exists beyond the formal declaration |
| `TRACE` | explicit calculation statements | no complete reaction history attested by the bounded example | experimental trace remains in the cited paper; not reproduced here | only the closed records’ attested view/change trace | `NOT_ATTESTED`; formal transition declaration is not upgraded to trace evidence |
| `PROVENANCE` | owner-frozen EVR-01 relation | NIST corrosion source | Dadachova et al. 2007, DOI 10.1371/journal.pone.0000457 | closed NEXAH predecessor records | owner-frozen formal control |
| `REVERSIBILITY` | reversible if reference bound and signed residual are retained | not established by the bounded classification | underdefined/not established | depends on each representation map; not assumed | reversible by declared control |
| `EVIDENCE_STATUS` | exact formal relation | authoritative contextual source | primary empirical source | closed documentary/formal source | formal negative control |
| `CLAIM_BOUNDARY` | no physics | reaction product, not leftover iron; no universal rust law | fungus, not alga; no radiosynthesis/photosynthesis/carbon-fixation claim | views are not identical or independent confirmation | no residual and no invented trace |
| `SCHEMA_FIT` | core + arithmetic fields | core + material fields | core + biological fields | core + representation fields | core + zero-control rule |

## Cross-case evaluation

```text
CROSS_CASE_FIELD_SURVIVAL = YES_FOR_DOCUMENTARY_CORE
DOMAIN_SPECIFIC_FIELD_REQUIREMENT = YES_MANDATORY
FALSE_IDENTITY_RISK = HIGH_IF_KIND_DOMAIN_REFERENCE_OR_CLAIM_BOUNDARY_REMOVED
ZERO_CONTROL_RESULT = PASS_RESIDUAL_PRESENT_FALSE
NVC01_COMPATIBILITY = PASS_NO_CORE_CHANGE
```
