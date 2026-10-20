# A0-BL-049 — IOTA/THOOTH operator typing result

Date: `2026-10-18`  
Status: `CLOSED / OWNER_ACCEPTED_TYPED_LOSSY_PROJECTIONS_WITH_JOINT_EXACT_RETURN_2026-10-18`

The source lock passes `10/10`. Primary and Replay are byte-identical at
SHA-256 `1f52cb0aee0a7417b862c39467ea2187b6e18194ef8d7c91d7e7f6efcac7aef5`.
Both structural verifiers pass `17/17`; all ten preregistered gates pass.

## Result

- `IOTA_EXISTING` is retained as the already supported parameterized directed
  classifier `C_alpha: sample -> {I,O,M}`; it is not globally an index,
  injection, state, generator or residual identity;
- `THOOTH_EXISTING` remains a provenance/title label and manual comparison
  card. It has no schema, input contract, executable map, scoring rule or
  result corpus and is not an operator;
- over all `9000` four-digit decimal strings, deleting the first position has
  `1000` outputs, each with fibre size `9`, hence `8000` collisions;
- deleting the second position has `900` outputs, each with fibre size `10`,
  hence `8100` collisions;
- each single projection returns all `9000/9000` sources only with its removed
  digit as residual; a uniform record needs four bits;
- the ordered pair `(delete second, delete first)` has `9000` distinct outputs
  and reconstructs `9000/9000` sources with no additional residual;
- the registered witness is exact: `1737→137` and `1737→737`;
- explicit collision witnesses are `1737/1837→137` and
  `1737/2737→737`;
- neither deletion is an endomorphism of the four-digit carrier and therefore
  neither is an iterative generator. The middle-position swap control is a
  bijective endomorphism on all `9000` sources.

## Interpretation

The two decimal views are individually lossy but jointly sufficient. Their
relation is an exact paired encoding/Return contract, not a historical decoder
or glyph-derived algebra. The pre-existing Iota classifier and THOOTH visual
label remain separate from these decimal functions.

Not established: a universal Iota/Thoth operator, `IOTA=RESIDUAL`, THOOTH as
an executable method, historical semantics, a dynamical generator, physical
mechanism, prediction, novelty or publication readiness. The Human Owner
accepted this bounded result on `2026-10-18`; the cycle is closed.

