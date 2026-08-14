# Preservation and Loss Criteria V2

Preservation requires object, criterion type, criterion text, result, evidence references, and judgment basis. Permitted criteria are exact equality, tolerance, equivalence relation, deterministic property test, empirical comparison, external task, and `PRESERVATION_NOT_ESTABLISHED`.

Loss categories are `STRUCTURAL`, `OBSERVED_INSTANCE`, `POTENTIAL`, `TASK_RELEVANT`, and `UNKNOWN`. Every loss names the distinction, criterion, result, evidence, and judgment. Task-relevant loss additionally requires a task reference, and the enclosing task must be independently defined.

Collision records require two distinct source references, a source distinction criterion, target equivalence criterion, evidence, and judgment. Collision does not imply task harm.

Invertibility is separately criterion-bound. A future checker must reject exact invertibility when an accepted collision for the same declared domain exists. V2 does not infer additive loss or automatic chain preservation.

