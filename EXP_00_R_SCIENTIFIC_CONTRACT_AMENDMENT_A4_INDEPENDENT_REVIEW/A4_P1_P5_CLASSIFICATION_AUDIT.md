# A4 P1–P5 and Classification Audit

## Proposition reconstruction

- **P1:** mean coherence and top-action agreement each pass N1, N2, N3, N4_T, N4_F at `k<=4` — complete.
- **P2:** both carriers' standardized coefficient `>0` and 500-seed-cluster bootstrap lower endpoint `>0`; coefficient nulls diagnostic — complete.
- **P3:** both carriers' log-loss gain `>0`, augmented Brier nonworse, N1/N2/N3 plus matching N4 null pass — complete.
- **P4:** carrier direction/gain, score/margin controls, 21/30 per-seed direction, and exact dominance are encoded; attribution scope is not acceptable because A4 silently makes T-only/F-only report-only — **FAIL**.
- **P5:** both amplitude values require positive coefficient/gain for both carriers; primary-only interval rule and non-rescue are encoded — complete. Other sensitivities are listed but their machine completeness schema is missing.

## Independent classification enumeration

The review independently enumerated validity, P1–P5, two carrier positive cores, and two resolved-negative flags. Internally consistent states map to exactly one of the four labels. Invalidity has first precedence. Positive cores with P1/null failure map uniquely to partial, as A4 explicitly permits. All propositions plus both positive cores/no negative map to replicated. The remainder maps to not replicated.

The exact encoded Rössler decision tree is mutually exclusive and exhaustive. That does not validate the inputs: the P4 definition is scientifically unresolved and several validity predicates are not executable.

The cross-system function never emits strict `CROSS-SYSTEM REPLICATION`; a fully positive Rössler result is capped at `PARTIAL CROSS-SYSTEM REPLICATION` because Lorenz v2 P4 remains false.

