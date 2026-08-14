# Implementation Correction Before Primary Seal

The first generated attempt was rejected before primary seal because the reference-to-saved checkpoint mapping used floating multiplication followed by truncation. Seven of 201 reference rows were compared to the preceding source checkpoint. The entire rejected attempt, its INVALID result, its disposition, and its code/output manifest are retained under `failed_attempts/attempt_001/`.

The sole correction replaced the mapping with exact integer alignment `reference_step // 20`, implementing the already locked 20 half-steps per saved 0.01 checkpoint. No source equation, state, parameter, integration path, representation, graph, estimator, candidate, class, threshold, claimant boundary, control, undefined rule, or interpretation changed.

The valid primary run was regenerated from an empty directory after this correction. No failed-attempt generated output was reused.

