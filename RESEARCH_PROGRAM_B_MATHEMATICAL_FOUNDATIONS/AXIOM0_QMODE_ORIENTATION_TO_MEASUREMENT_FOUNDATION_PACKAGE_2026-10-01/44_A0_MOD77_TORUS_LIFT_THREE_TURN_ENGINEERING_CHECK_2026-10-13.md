# A0 Mod-77 Torus Lift / 23–67 Three-Turn Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES PBM:MOD77 AND MOD:TESSAREC / NO NEW IDENTITY / NO NEW RELATION`

## 1. Bounded question

Does the first composite value `1541=23*67` of the `+4` affine sequence have
an exact relation to the existing `7 x 11 = 77` product carrier? Do the factors
`23` and `67` define a reproducible turn on that carrier? Can the resulting
structure distinguish quotient state, lifted path and geometric crossing?

The audit keeps five objects separate:

1. the CRT carrier `Z_77 ~= Z_7 x Z_11`;
2. a declared discrete-torus adjacency graph;
3. additive and multiplicative operators on the carrier;
4. an integer lift and its winding count;
5. a separately declared geometric embedding or crossing observable.

## 2. Existing carrier and declared torus graph

The existing Mod-77 reconstruction uses

```text
P(n) = (n mod 7, n mod 11)
n = 22a + 56b mod 77.
```

This is an exact bijection between 77 residues and the 77 product coordinates.
The product set alone is not yet a torus graph. For this check the adjacency is
declared explicitly as

```text
(a,b) ~ (a+/-1 mod 7,b)
(a,b) ~ (a,b+/-1 mod 11).
```

The resulting graph is the Cartesian product `C7 square C11` with

```text
77 vertices
154 undirected edges
degree 4 at every vertex.
```

Under the additive operator `n -> n+1 mod 77`, the CRT coordinate moves by
`(a,b)->(a+1,b+1)`. Since 7 and 11 are coprime, this diagonal path visits all
77 states exactly once before return: a Hamiltonian cycle on the carrier.

## 3. The exact 23/67 three-turn

The factor pair satisfies

```text
23 * 67 = 1541
23 * 67 = 1 mod 77
23^2 = 67 mod 77
23^3 = 1 mod 77.
```

Therefore multiplication by 23 is an order-three permutation. Starting at
the identity state:

```text
1 -> 23 -> 67 -> 1.
```

In CRT coordinates:

```text
1  -> (1,1)
23 -> (2,1)
67 -> (4,1)
1  -> (1,1).
```

The Mod-11 coordinate is fixed; the Mod-7 coordinate follows the cycle
`1->2->4->1`. Across the complete carrier the permutation decomposes into

```text
11 fixed points
22 cycles of length 3.
```

The fixed points are precisely the residues divisible by 7. This supplies an
exact meaning for a fiberwise **three-turn**. It does not by itself establish
a physical rotation, temporal process, corridor or crossing.

## 4. Sum, product and Return readouts

The factor pair also satisfies

```text
23 + 67 = 90 = 13 mod 77
6 + 7 = 13.
```

Equivalently, `23` and `67` are roots modulo 77 of

```text
x^2 - 13x + 1 = 0.
```

Thus the product is the multiplicative Return `1`, while the sum carries the
additive readout `13`. These are exact arithmetic relations on the declared
carrier; they do not identify the operators with the Tessarec animation.

## 5. Lifted Return and winding

The key integer identity is

```text
1541 = 20 * 77 + 1.
```

Hence `1541` and `1` are the same quotient state, including the same CRT
coordinate `(1,1)`, while the integer lift retains the nonzero winding count
`20`. This yields the exact typed distinction

```text
same quotient state
different integer lift
different accumulated winding/history.
```

It supports the phrase **Return without loss of path-history in the lift**.
It is not yet a geometric crossing. A crossing requires an embedding and an
event rule that can distinguish transverse intersection, self-contact,
projection collision or a regime boundary.

## 6. Affine trajectory on the carrier

The `+4` ladder outputs obey

```text
c_n = 12*2^n + 5
c_(n+1) = 2*c_n - 5.
```

Projected modulo 77, the first residues are

```text
17, 29, 53, 24, 43, 4, 3, 1, ...
```

The quotient orbit has exact period 30. At rung 7:

```text
c_7 = 1541
c_7 mod 77 = 1.
```

This is the precise connection between the finite prime run and the Mod-77
carrier: the first composite value lands at the quotient identity after a
20-winding integer lift. It does not make all points of the prime trajectory
prime residues or turn the 30-cycle into the 77-state additive orbit.

## 7. The `t=36` boundary

No source-bound map currently identifies the visual time variable `t` with
the affine rung index `n`. If that identification were declared, then the
period-30 quotient implies

```text
r_36 = r_6 = 3 mod 77.
```

This is only a conditional alias. It does not select `t=36` as a crossing,
regime-change trigger or special torus event. Those readings remain open.

## 8. The decimal `15|41` cue

Splitting the decimal spelling `1541` into `15|41` is representation-dependent.
Its additive readout nevertheless meets an existing CRT object:

```text
15 + 41 = 56
56^2 = 56 mod 77.
```

Together with the complementary CRT projector `22`:

```text
22^2 = 22
56^2 = 56
22*56 = 0
22+56 = 1 mod 77.
```

This is an exact projector identity, but the route through the decimal split
was selected after observation. It remains a descriptive cue rather than an
operator derivation.

## 9. Result vocabulary

- `PASS_EXACT_BIJECTION`
- `PASS_EXACT_UNDER_DECLARED_ADJACENCY`
- `PASS_EXACT_HAMILTONIAN_CYCLE`
- `PASS_EXACT_ORDER_THREE_PERMUTATION`
- `PASS_EXACT_QUOTIENT_RETURN`
- `PASS_EXACT_PERIOD_30`
- `OPEN_CONDITIONAL_ALIAS_ONLY`
- `OPEN_REQUIRES_TYPED_EMBEDDING_AND_EVENT_RULE`

No visual similarity is a pass condition.

## 10. Execution contract

```yaml
RECORD_ID: A0_MOD77_TORUS_LIFT_THREE_TURN_ENGINEERING_CHECK_001
PURPOSE: VERIFY_MOD77_TORUS_LIFT_AND_23_67_THREE_TURN
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/mod77-torus-lift-three-turn.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/mod77-torus-lift-three-turn.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: finite CRT carrier, declared torus graph, exact modular operators, integer lift and conditional time alias only
AUTHORIZED_SCIENCE_RUN: false
```

## 11. Source junctions

- `SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/Operator Test Results/HMA01_DOWNLOAD/HMA01_MOD77_RECONSTRUCTION_TEST.md` owns the independent exact CRT carrier and inverse.
- `SCIENCE_LAB/NAVIGATION/EVIDENCE/PRIME_BASE_MODE_2026-10-10/PRIME_BASE_MODE_BINDER_V1_2026-10-10.json` registers `PBM:MOD77` as the existing exact carrier with heuristic-application boundary.
- `43_A0_TESSAREC_AFFINE_PLUS4_FOUR_RUNG_ENGINEERING_CHECK_2026-10-13.md` owns the post-hoc `+4` affine ladder and the finite prime-run failure at `1541=23*67`.
- `MOD:TESSAREC` remains a related representation family only; this check does not create a carrier identity between Mod-77 and Tessarec.

## 12. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `65764eceab443c577f03a0e177aae29da40995e7fcb7edb5da0e4d7356d92dd9`  
Repeated stdout SHA-256: `4944ab34bae462040b8449aeda64fafc15ec18a5aeb4ab98766de7e95bc2be69`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_EXACT_MOD77_TORUS_LIFT_WITH_OPEN_CROSSING_BINDING`

| Check | Receipt | Bounded reading |
|---|---|---|
| `B1_CRT77_CARRIER` | `PASS_EXACT_BIJECTION` | 77 residues and 77 product coordinates reconstruct exactly |
| `B2_DISCRETE_TORUS_GRAPH` | `PASS_EXACT_UNDER_DECLARED_ADJACENCY` | `C7 square C11`: 77 vertices, 154 edges, degree 4 |
| `B3_ADDITIVE_DIAGONAL_ORBIT` | `PASS_EXACT_HAMILTONIAN_CYCLE` | `+1` visits all 77 quotient states before return |
| `B4_MULTIPLICATIVE_THREE_TURN` | `PASS_EXACT_ORDER_THREE_PERMUTATION` | `1->23->67->1`; 11 fixed points and 22 three-cycles |
| `B5_FACTOR_SUM_RETURN` | `PASS_EXACT` | product `1`, sum `13` modulo 77 |
| `B6_NONZERO_LIFT_RETURN` | `PASS_EXACT_QUOTIENT_RETURN` | `1541=20*77+1`: same state, winding 20 |
| `B7_AFFINE_TRAJECTORY_PROJECTION` | `PASS_EXACT_PERIOD_30` | affine quotient orbit reaches `1` at rung 7 |
| `B8_TIME_36_BINDING` | `OPEN_CONDITIONAL_ALIAS_ONLY` | `t=36` gives residue 3 only if `t=n` is declared |
| `B9_DECIMAL_SPLIT_CRT_PROJECTOR` | `DESCRIPTIVE_REPRESENTATION_DEPENDENT` | `15+41=56`, an existing CRT idempotent |
| `B10_CROSSING_VERSUS_STATE_CHANGE` | `OPEN_REQUIRES_TYPED_EMBEDDING_AND_EVENT_RULE` | lift history is exact; geometric crossing is not yet defined |

### Disposition

```text
MOD-77 CRT PRODUCT CARRIER: SUPPORTED / EXACT STANDARD MATHEMATICS
DISCRETE TORUS: SUPPORTED AFTER EXPLICIT ADJACENCY DECLARATION
23/67 THREE-TURN: SUPPORTED / EXACT
1541 -> 1 WITH WINDING 20: SUPPORTED / EXACT
AFFINE MOD-77 PERIOD 30: SUPPORTED / EXACT
STATE VERSUS LIFTED PATH DISTINCTION: SUPPORTED / EXACT
t=36 CROSSING OR REGIME CHANGE: NOT ESTABLISHED
VISUAL TORUS / SPIRAL / TESSAREC IDENTITY: NOT ESTABLISHED
NEW FINDING: NO
```

The next admissible test must freeze one embedding of `C7 square C11`, one
lift convention and one crossing functional before execution. Hubs,
corridors, bridges and dead zones additionally require a declared transition
ensemble or edge-weight process; they are not properties of the unweighted
carrier alone.
