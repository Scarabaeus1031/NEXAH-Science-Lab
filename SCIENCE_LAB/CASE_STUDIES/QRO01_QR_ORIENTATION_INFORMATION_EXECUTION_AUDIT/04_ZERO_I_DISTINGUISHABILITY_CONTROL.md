# QRO-01 — 0 | I Distinguishability Control

`0 | I` is treated only as two visually/logically distinguishable labels under a declared discrimination rule.

| Question | Result | Reason |
|---|---|---|
| Is binary distinguishability sufficient for a representation? | CONDITIONAL | It can represent two module states, but not a spatial QR symbol without indexed positions and rules. |
| Is position required to distinguish arrangements? | YES | Equal state counts with permuted coordinates generally encode a different matrix. |
| Is reference/orientation required for reliable reading? | YES/CONDITIONAL | A decoder needs a recoverable reference structure or equivalent compensating metadata/algorithm. |
| Does a binary mark carry semantics intrinsically? | NO | State meaning follows the encoding and location rule. |
| Does decoded information imply execution? | NO | Plain text can be decoded and retained without dispatch or runtime action. |

```text
DISTINGUISHABILITY != SEMANTICS
POSITION != MEANING
ORIENTATION != PAYLOAD
INFORMATION != EXECUTION
```

The labels are not assigned “background/information,” “empty/active,” or “false/true” semantics intrinsically.
