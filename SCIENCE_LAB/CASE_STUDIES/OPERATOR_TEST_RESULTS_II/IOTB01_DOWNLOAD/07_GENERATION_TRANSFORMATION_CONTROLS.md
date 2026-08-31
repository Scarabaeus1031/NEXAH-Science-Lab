# 07 — Generation / Transformation Controls

| Case | Identity changed? | Observable state changed? | Orientation changed? | Provenance changed? | Generation changed? | Trace if attested? |
|---|---|---|---|---|---|---|
| A: in-place U | NO | YES | operator-dependent; frozen NO here | NO | NO | YES |
| B: COPY child | YES | NO | preserved here | YES | YES, +1 | YES |
| C: TRANSFORM child | YES | YES | operator-dependent | YES | YES, +1 | YES |

Transformation does not imply generation. Generation changes only when the
operator execution is declared derivational and creates a new provenance node.
Conversely COPY demonstrates a new generation without visible change.

```text
TRANSFORMATION_IMPLIES_NEW_GENERATION=NO
GENERATION_REQUIRES_DERIVATION=YES
STATE_CHANGE_IMPLIES_IDENTITY_CHANGE=NO
```
