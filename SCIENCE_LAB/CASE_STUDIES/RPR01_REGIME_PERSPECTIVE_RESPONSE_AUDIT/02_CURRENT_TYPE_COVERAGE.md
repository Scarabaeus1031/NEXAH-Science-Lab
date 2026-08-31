# Current Type Coverage

| Needed distinction | Current coverage | Finding |
|---|---|---|
| Entity/system identity | RID global/revision IDs; OLS identity declaration | Existing |
| Context | OLS primitive/declaration; RID provenance and referenced records | Existing |
| Perspective/view | OLS perspective; RID `View` and tagged `ViewSource` | Existing |
| Frame | RID `frame_ref`; AREV/ETRI/GLF frame records | Existing |
| Constraints | RID constraint records and operation inputs | Existing |
| State and transition | OLS state/transition; RID state refs/events | Existing |
| History | RID execution/history refs; RRR preservation rules | Existing |
| Environmental regime | Context + parameter/constraint/state/reference records | Composition sufficient |
| Orientation cue | Typed source/observable/relation within context | Derived record sufficient |
| State response | Earlier/later state + event/operation + comparison + provenance | Composition sufficient |
| Realized form/behavior | State/form representation plus observation/view | Existing composition |
| Contextual role | Entity + context + relation + role label/source | Representable; dedicated convenience record useful |
| Regime boundary | Parameter-space subset/relation + criterion + evidence | Derived record sufficient |

The corpus lacks convenient named `EnvironmentalRegime` and `ContextualRole` records, but no information-bearing primitive is absent. A label-only field would be insufficient; any such record must retain context, criteria, parameters, provenance, uncertainty and applicable time.

