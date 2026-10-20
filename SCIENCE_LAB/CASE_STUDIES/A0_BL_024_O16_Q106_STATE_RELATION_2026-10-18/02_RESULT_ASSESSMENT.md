# A0-BL-024 — O16 / Q106 State Relation result

Date: `2026-10-18`  
Status: `RESULT_READY / INFORMATION_LOST_RESIDUAL_SUFFICIENT_AND_NO_CANONICAL_MAP / EXECUTION_STOPPED / AWAITING_OWNER_DISPOSITION`

## Registered result

`INFORMATION_LOST_RESIDUAL_SUFFICIENT_AND_NO_CANONICAL_MAP`

The exact pre-execution lock passes for four package files and three parent
sources. Primary and Replay are byte-identical. Their artifact-file SHA-256 is
`7d6683d989d2abab76c9864698a21af2a2b84ca8bd3cf993700d53cf4f431014`;
the registered result SHA-256 is
`6e71cce8b373627366eef9569ee25198369226263abef91c7077ccec5e24604e`.
Both verifier invocations pass `18/18` checks.

## Gate results

All seven frozen gates pass.

1. **Source integrity.** The frozen source contains exactly `106` Q106 nodes
   and the declared order-five rotation.
2. **Cardinality obstruction.** A bijection between `16` O16 states and `106`
   Q106 nodes is impossible.
3. **Collision accounting.** Both preregistered maps reach all 16 O16 states
   and have exactly `90` collisions.
4. **Conditional residual Return.** With the within-fiber rank retained, both
   maps reconstruct `106/106` Q106 nodes exactly.
5. **Representative lift.** Choosing one representative per O16 state returns
   only 16 Q106 nodes and is not surjective.
6. **Matched shuffle nonselection.** The fixed shuffle has the same balanced
   `6×6 + 10×7` fiber histogram as P1, while `100/106` assignments differ.
   Balanced information cost therefore does not select P1 as canonical.
7. **Rotation-order obstruction.** `gcd(4,5)=1`; the only homomorphism from the
   O16 C4 direction cycle to the Q106 C5 rotation is trivial. No nontrivial
   C4/C5 rotation intertwiner exists.

## Information accounting

| Map | Fiber profile | Maximum fiber | Mean conditional residual | Exact Return |
|---|---:|---:|---:|---:|
| P1 balanced index | 6 states of size 6; 10 of size 7 | 7 | `3.0` bits | `106/106` |
| P2 typed attribute | heterogeneous sizes `2..18` | 18 | `3.396226415094` bits | `106/106` |
| Fixed shuffled control | same profile as P1 | 7 | `3.0` bits | `106/106` |

The residual is not an optional implementation detail: it is the information
required to invert each many-to-one projection on the frozen source set.

## Interpretation

The two declared maps are valid finite projections, not identities. Each loses
Q106 source information, and each becomes exactly invertible only after adding
the conditional within-fiber residual. Equal fiber balance does not establish
canonicality because the matched shuffle achieves the same information cost
with different assignments.

The result therefore supports a typed projection-plus-residual Return pattern
while positively ruling out the tested canonical-map inference and the
nontrivial C4/C5 rotation intertwiner.

## Claim boundary

Not established: a canonical O16/Q106 map, bijection or identity; geometric
embedding; physical orientation mechanism; application utility; novelty;
public release or publication readiness.

Execution stopped after the authorized Primary, Replay and verifier. Structure
Freeze resumed. The result awaits Human Owner acceptance, revision request or
rejection. No successor is activated automatically.
