# RID / OLS Gap Assessment

| Candidate | Classification | Construction |
|---|---|---|
| Environmental regime | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | context + parameter/constraint/state records + time/provenance |
| Contextual role | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | entity ref + context + typed relation/role vocabulary |
| Orientation cue | DERIVED_RECORD_SUFFICIENT | source/observable/relation + context and availability/status |
| State response | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | earlier/later state + event/operation + comparison/history |
| Realized form | EXISTING_TYPE_SUFFICIENT | state/form representation with identity and provenance |
| Regime boundary | DERIVED_RECORD_SUFFICIENT | condition-space relation/subset + criterion/evidence/uncertainty |

No genuine schema gap is found. A future profile could add convenience records for consistent interchange, but RPR-01 does not authorize or require RID/OLS modification. A bare enum called `regime` or `role` would reduce, rather than improve, the current evidence discipline.

RPR01 primary class: `C_CONTEXTUAL_ROLE_OR_REGIME_RECORD_USEFUL_BUT_NO_NEW_PRIMITIVE`.

