# A0 Tessarec +4 Affine Four-Rung / 3+1 Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

## 1. Bounded question

Does the proposed `+4` sequence form an exact four-stage structure? Is it
better described as a four-gear system or as `3+1`? Does the fourth stage have
an independently specified connection to the supplied Gon set
`{7,8,17,19,23,29}`? Does the resulting prime sequence continue, and is the
`+4` translation selective against nearby translations?

The owner shorthand **4 Gangschaltung** is retained as a reading aid. The
formal carrier in this check is a **four-rung affine ladder**, avoiding a name
collision with earlier gear constructions elsewhere in the corpus.

## 2. Frozen construction

The base ladder from the preceding check is

```text
 6 +  7 = 13
12 + 13 = 25
24 + 25 = 49
48 + 49 = 97
```

Let `tau_h(x)=x+h`. Translation does not preserve ordinary addition:

```text
tau_h(x) + tau_h(y) = tau_h(x+y) + h.
```

The transported joint therefore has to be affine:

```text
J_h(u,v) = u + v - h
tau_h(x+y) = J_h(tau_h(x),tau_h(y)).
```

For `h=4`, componentwise translation gives the exact ladder

```text
10 + 11 - 4 =  17
16 + 17 - 4 =  29
28 + 29 - 4 =  53
52 + 53 - 4 = 101
```

Therefore the last row is `52,53,101`; `52,51,101` would not be the same
componentwise `+4` construction.

## 3. Four gears and 3+1

The output states are

```text
17 -> 29 -> 53 -> 101
```

Their adjacent gaps are

```text
12, 24, 48.
```

As a graph this is the path `P4`: four vertices and three edges. Hence two
statements are exact but typed differently:

1. **four gears** = four rung states;
2. **3+1** = three transitions followed by a terminal fourth state.

Neither statement alone proves a physical gear mechanism, a fourth dimension,
or a Tessarec phase transition.

## 4. Frozen Gon cross-binding test

The Gon universe for this post-hoc check is frozen from the supplied sequence:

```text
G = {7,8,17,19,23,29}.
```

All unordered sums of two distinct members of `G` are enumerated and compared
with the translated left rail

```text
L = {10,16,28,52}.
```

There is exactly one intersection:

```text
23 + 29 = 52 = 13 * 2^2.
```

Thus, **within this frozen set**, the first three left-rail states are reached
only through the ladder construction, while the fourth additionally has the
independent `23+29` construction. This is a real finite-set distinction and is
the strongest current support for the `3+1` reading. It remains descriptive
because the Gon set and the question were selected after the pattern was seen.

## 5. Prime-run test and controls

The translated outputs obey

```text
c_n = 12 * 2^n + 5.
```

The first seven values are prime:

```text
17, 29, 53, 101, 197, 389, 773.
```

The next value falsifies an unrestricted prime-generator reading:

```text
c_7 = 1541 = 23 * 67.
```

The finite run includes the exact one-based prime-index readout `p_26=101`.

As a local post-hoc control, every even translation `h` from `-20` through
`+20` is evaluated for consecutive prime outputs of
`12*2^n+1+h`, beginning at `n=0`. The run lengths are:

```text
h:   -20 -18 -16 -14 -12 -10 -8 -6 -4 -2  0  2  4  6  8 10 12 14 16 18 20
run:   0   0   0   0   0   1  4  3  0  3  1  0  7  2  0  1  0  0  2  3  0
```

`h=4` is the unique local maximum in this frozen window. Since both the window
and the target were chosen post hoc, this is descriptive selectivity, not a
confirmatory significance result.

## 6. Mirror cue kept separate

The equalities

```text
reverse_decimal(79) = 97
p_22 = 79
p_25 = 97
```

are exact. No declared operator currently maps that decimal reversal to the
affine ladder, its Gon cross-binding, or a Tessarec state transition. The
`79 <-> 97` mirror remains an open orientation cue, not a passed binding.

## 7. Result vocabulary

- `PASS_EXACT`
- `PASS_GENERIC_AFFINE_IDENTITY`
- `PASS_EXACT_PATH_COUNT`
- `DESCRIPTIVE_UNIQUE_CROSS_BINDING_IN_FROZEN_SET`
- `DESCRIPTIVE_UNIQUE_LOCAL_MAXIMUM_POST_HOC`
- `PASS_FINITE_RUN_THEN_FAIL`
- `OPEN_NO_DECLARED_OPERATOR_MAP`

No visual similarity is a pass condition.

## 8. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_AFFINE_PLUS4_FOUR_RUNG_ENGINEERING_CHECK_001
PURPOSE: TEST_FOUR_RUNG_VERSUS_THREE_PLUS_ONE_READING
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-affine-plus4-four-rung.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-affine-plus4-four-rung.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: affine identities, finite path counts, finite Gon pair sums, prime run and local translation controls only
AUTHORIZED_SCIENCE_RUN: false
```

## 9. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `6c23b2d43596d5a44f44dddb3c0a371d4fff2f3cb42dd005b05c076f8cc4ac3f`  
Repeated stdout SHA-256: `abe5990433ba3372931fabf9e06722a376dd348d1d70831dcd7f3cb80fbc2a0e`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_WITH_DESCRIPTIVE_THREE_PLUS_ONE_AND_FINITE_PRIME_RUN`

| Check | Receipt | Bounded reading |
|---|---|---|
| `A1_AFFINE_TRANSLATION_INTERTWINER` | `PASS_GENERIC_AFFINE_IDENTITY` | translated addition requires `J_h(u,v)=u+v-h` |
| `A2_PLUS4_FOUR_RUNG_TRACE` | `PASS_EXACT` | four rows terminate at `52,53,101` |
| `A3_FOUR_STATES_THREE_TRANSITIONS` | `PASS_EXACT_PATH_COUNT` | `P4` has four states and three transitions |
| `A4_FOURTH_RUNG_GON_CROSS_BINDING` | `DESCRIPTIVE_UNIQUE_CROSS_BINDING_IN_FROZEN_SET` | only `52` is reconstructed as `23+29` |
| `A5_SHIFTED_OUTPUT_PRIME_RUN` | `PASS_FINITE_RUN_THEN_FAIL` | seven primes, then `1541=23*67` |
| `A6_LOCAL_SHIFT_CONTROLS` | `DESCRIPTIVE_UNIQUE_LOCAL_MAXIMUM_POST_HOC` | `h=4` is the unique maximum in the frozen local window |
| `A7_FOUR_GEAR_VERSUS_THREE_PLUS_ONE` | `SUPPORTED_AS_TWO_TYPED_READINGS` | exact graph readings; no physical mechanism established |
| `A8_MIRROR_79_97_BINDING` | `OPEN_NO_DECLARED_OPERATOR_MAP` | exact decimal cue, absent operator binding |

### Disposition

```text
FOUR-RUNG AFFINE LADDER: SUPPORTED / EXACT
FOUR STATES WITH THREE TRANSITIONS: SUPPORTED / EXACT
THREE LADDER-ONLY PLUS ONE CROSS-BOUND STATE: SUPPORTED DESCRIPTIVELY IN FROZEN SET
+4 LOCAL PRIME-RUN SELECTIVITY: SUPPORTED DESCRIPTIVELY / POST HOC
UNRESTRICTED PRIME GENERATOR: REFUTED AT 1541 = 23 * 67
PHYSICAL FOUR-GEAR OR 3+1 MECHANISM: NOT ESTABLISHED
79/97 MIRROR OPERATOR BINDING: NOT ESTABLISHED
NEW FINDING: NO
```

The next admissible step is a preregistered test in which the Gon universe,
the candidate cross-binding rule, the comparison shifts and a held-out rung
range are fixed before execution. Until then, the fourth-rung distinction is
a strong design hypothesis and a useful orientation structure, not a Science
Lab finding.
