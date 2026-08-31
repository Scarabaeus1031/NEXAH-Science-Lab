# Minimal Epistemic Pipeline

```text
REGISTER
  -> OBSERVE
  -> MEASURE
  -> TRACE/VIEW
  -> COMPARE under criterion
  -> EVIDENCE ASSESSMENT
  -> INTERPRET | AMBIGUOUS | ABSTAIN
  -> DECIDE under declared criterion and authority
  -> APPEND HISTORY + PROVENANCE
```

## Existing SWM/RID expression

| Review stage | Existing records |
|---|---|
| Register | ObjectId, RevisionRef, StateRef, ProvenanceRecord |
| Observe/measure | ObservationMap, ObservableDefinition, MeasurementEvent/Value |
| Trace/view | Readout, typed ViewSource, View, declared losses |
| Compare | ComparisonCriterion/Event/Outcome |
| Assess evidence | Evidence/provenance refs + ambiguity/residual/uncertainty |
| Interpret/abstain | Derived claim/status + AmbiguityRecord/AbstainResult |
| Decide | DecisionRule/Event/Result with authority |
| Retain | Execution, append-only History and ProvenanceRecord |

The diagram is review order, not forced execution linearity. Stages can branch,
repeat or stop. Observation does not require decision, and insufficient evidence
must permit abstention. No SWM/RID modification is required.

## Socratic-method analogy

The recurring questions “what is X?”, “which relation?”, “what changed?”, “what
remained?”, “what follows?” and “what does not follow?” form a useful audit
checklist. This is a methodological analogy only; no Socratic operator exists.
