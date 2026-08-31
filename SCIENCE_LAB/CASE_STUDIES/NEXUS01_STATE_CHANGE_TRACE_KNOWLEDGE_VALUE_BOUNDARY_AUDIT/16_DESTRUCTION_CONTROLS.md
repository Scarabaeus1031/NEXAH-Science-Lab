# Destruction Controls

| Unsupported collapse | Result | Reason |
|---|---|---|
| ENTITY = STATE | REJECTED | Entity identity persists across state revisions. |
| STATE = COORDINATE | REJECTED | A representation map selects coordinates. |
| COORDINATE = POINT | REJECTED | Point identity includes scope, frame, time and provenance. |
| POINT = PATH | REJECTED | One location supplies no ordered route. |
| POINT = TRAJECTORY | REJECTED | A trajectory requires an ordered parameterized sequence. |
| TRAJECTORY = HISTORY | REJECTED | Representation path omits event/rule lineage in general. |
| STATE = TRACE | REJECTED | Observation channel transforms and loses information. |
| TRACE = EVIDENCE | REJECTED | Evidential role is claim- and scope-dependent. |
| EVIDENCE = TRUTH | REJECTED | Evidence supports/contradicts under a method; it is not truth. |
| OBSERVATION = KNOWLEDGE | REJECTED | Interpretation and epistemic assessment intervene. |
| KNOWLEDGE = VALUE | REJECTED | Epistemic status is not normative preference. |
| MEASUREMENT VALUE = NORMATIVE VALUE | REJECTED | Policy/criterion/authority is required. |
| DIFFERENCE = ERROR | REJECTED | Error requires a reference/model/criterion. |
| DIFFERENCE = IMPORTANCE | REJECTED | Importance requires an objective or value criterion. |
| INVARIANT = IDENTITY | REJECTED | A property may persist across distinct objects/states. |
| SAME ENDPOINT = SAME PATH | REJECTED | Different ordered sequences may share endpoint. |
| SAME VIEW = SAME SOURCE | REJECTED | Projection/rendering can be many-to-one. |
| SAME READOUT = SAME STATE | REJECTED | OSR/OTC ambiguity preserved. |
| STABLE PIN = STABLE SYSTEM | REJECTED | Sampling/integration can hide change. |
| DERIVATIVE = CAUSE | REJECTED | Rate representation does not establish causation. |
| DC = ENERGY | REJECTED | Letters carry no physical semantics. |
| NEXUS = PHYSICAL CENTER | REJECTED | Candidate is a binding record only. |
| NEXUS = UNIVERSAL ORIGIN | REJECTED | No origin or universal claim follows. |
| Q° = ABSOLUTE ORIENTATION | REJECTED | Symbol is quarantined and underdefined. |
| HISTORICAL PHILOSOPHY = FORMAL NEXAH EVIDENCE | REJECTED | Expression contributes zero evidence. |

All 25 required collapses are rejected without changing the architecture.
