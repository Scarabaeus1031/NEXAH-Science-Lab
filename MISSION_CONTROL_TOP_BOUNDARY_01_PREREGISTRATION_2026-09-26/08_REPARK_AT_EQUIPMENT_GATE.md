# 08 — Repark at Physical Equipment Gate

**Decision basis:** bounded digital scope completed; physical equipment absent  
**State:** `DIGITAL_RUN_COMPLETE / PARKED_AT_EQUIPMENT_GATE`

The Human Owner's resume instruction has been fulfilled for the complete
digital interaction analysis. No further digital control is required before
apparatus binding.

```text
DRY_03                         = COMPLETE
SYNTHETIC_OPERATOR            = VALIDATED
PHYSICAL_EXECUTION_PACKET     = COMPLETE
EQUIPMENT_RECORD              = ABSENT
ACTIVE_DIGITAL_GATE           = NONE
ACTIVE_PHYSICAL_GATE          = NONE_UNTIL_HUMAN_RESUME_WITH_EQUIPMENT
PORTFOLIO_STATE               = PARKED_AT_EQUIPMENT_GATE
```

Resume requires an explicit Human Owner instruction plus the bindings listed
in the physical execution packet. Until then:

```text
STOP_EQUIPMENT_NOT_BOUND
```

