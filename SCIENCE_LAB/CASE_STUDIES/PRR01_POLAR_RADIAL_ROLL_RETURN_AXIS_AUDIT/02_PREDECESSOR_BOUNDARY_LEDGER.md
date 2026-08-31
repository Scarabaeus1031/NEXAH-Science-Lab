# 02 — Predecessor Boundary Ledger

| frozen boundary | PRR-01 application | preserved |
|---|---|---|
| `STICK_REQUIRES_QUATERNION_DIMENSION=NO` | stick is typed as line/axis/connector only when source permits | YES |
| `MULTIVIEW_EQUALS_MULTIDIMENSIONAL_STATE=NO` | vehicle/ground views do not add state dimensions | YES |
| `OBJECT != REPRESENTATION` | a drawn axis/wheel is not the mechanism | YES |
| `LOCAL_FRAME != GLOBAL_OBJECT` | local component frame is not the full moving assembly | YES |
| `TRACE != ACTION` | rotation/trajectory record is not the generating action | YES |
| `OPERATOR != EXECUTION` | a return or rotation rule is not an executed event | YES |
| `RETURN != INVERSE` | return is context-dependent; an inverse rule can exist without executed return | YES |
| `RETURN_TO_STATE != RETURN_TO_HISTORY` | a closed path retains added event history | YES |
| `AXIS != OBJECT/MOTION` | geometric reference is separately typed | YES |
| `COUPLING != IDENTITY` | linked rotational/translational quantities remain distinct | YES |

All named predecessors remain closed and unmodified.

