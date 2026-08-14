# A5X Executable Validity Predicates

Every gate is the named pure function in `contract_validation/validate_a5x_contract.py`, bound by `validity_gates.<gate>.function`. Inputs are raw JSON objects; exact keys are required, Python JSON scalar types are checked, missing/malformed fields return false, dependencies must pass first, and any false gate yields `INVALID EXPERIMENT` after authorization or blocks authorization before it.

The functions derive: authority from recomputed bytes; binding from exact artifact dictionaries; train/test isolation from exact seed arrays, source split fields and ordered access events; parity from exact T/F records; distinctness from exact family/response/label/cache fields; leakage from raw import/call/access lists; support from raw fractions and per-seed row counts; N5/null/bootstrap/per-seed/carrier completeness from exact record sets and finite values; provenance from exact IDs/hashes; post-access immutability from ordered events; P1–P5 from derived Boolean records. `evaluate_sensitivities` is the sensitivity gate.

There are no caller-supplied gate tokens. A caller supplies raw artifacts; the sealed function alone returns the Boolean.

