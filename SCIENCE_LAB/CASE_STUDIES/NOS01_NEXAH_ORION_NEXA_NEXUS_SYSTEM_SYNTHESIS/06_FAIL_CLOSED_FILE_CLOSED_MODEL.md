# Fail-Closed / File-Closed Model

Two independent axes are required.

| Decision behavior | Meaning |
|---|---|
| `PASS` | declared acceptance condition satisfied |
| `FAIL_CLOSED` | system refuses an unsupported or invalid claim/action |
| `UNRESOLVED` | admissible alternatives remain without selection |
| `UNDEFINED` | the requested quantity/status has no value under the declared domain |

| Document status | Meaning |
|---|---|
| `OPEN` | audit work remains authorized and incomplete |
| `CLOSED` | bounded audit ended with a documented decision |
| `CLOSED_WITH_TECHNICAL_ERROR` | audit ended, but a technical execution/file defect is explicitly retained |

Required separations:

`UNDEFINED != 0`; `UNRESOLVED != 0`; `FAIL_CLOSED != AUDIT_FAILURE`; `FILE_CLOSED != FAIL_CLOSED`.

Control: reference point on curve → winding is `UNDEFINED` → the evaluator correctly `FAIL_CLOSED` → the destructive control `PASS`es → WNI-01 closes successfully as `CLOSED`.

“Fail closed” describes decision behavior. “File closed” describes documentary lifecycle. “Closed with technical error” is appropriate only when a retained technical/file defect exists; it is not the label for a scientifically correct refusal.

