# A0 Tessarec 6–7 / 25–97 Operator Ladder — Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

## 1. Bounded question

Does the seed pair `6,7` generate the exact doubled operator ladder
`6/7 -> 12/13 -> 24/25 -> 48/49 -> 96/97`, and does that ladder contain the
prime-index closure `p_25=97`? Is the observed seed `6` selective under a
complete finite seed enumeration and nearby affine controls? Can the exact
`C6 x C7` return `42` already be identified with the separately declared
observer angle `+/-42 degrees`?

The audit keeps four roles separate:

1. generic arithmetic operator identities;
2. one-based prime-index readouts;
3. finite cyclic return measured in steps;
4. observer projection measured in degrees.

## 2. Frozen operator ladder

For seed `s`, define

```text
a_n = s * 2^n
b_n = a_n + 1
```

Then the cross-joint is the generic identity

```text
a_n + b_n = 2*a_n + 1 = b_(n+1)
Add(id,Succ) = Succ(Double)
```

At `s=6` the first four joints are

```text
 6 +  7 = 13
12 + 13 = 25 = 5^2
24 + 25 = 49 = 7^2
48 + 49 = 97
```

The prime-index candidate is

```text
b_2 = 25
b_4 = 97
p_(b_2) = p_25 = 97 = b_4
```

One-based prime indexing is frozen: `p_1=2`.

## 3. Frozen controls

### 3.1 Seed enumeration

The complete integer seed universe is fixed as `1 <= s <= 10,000`. Every
seed is evaluated against

```text
p_(4s+1) = 16s+1.
```

The bounds and formula were selected after the `s=6` relation was noticed.
The resulting frequency is descriptive and is not a confirmatory p-value.

### 3.2 Nearby-formula controls

Two symmetric local control families are evaluated over the same seed range:

```text
p_(4s+1+d) = 16s+1,  d in {-3,-2,-1,0,1,2,3}
p_(4s+1)   = 16s+1+e, e in {-6,-4,-2,0,2,4,6}
```

The primary formula is retained at shift zero in both families so the receipt
shows it in context. Nearby hits do not refute the exact identity, but they do
limit any claim of specificity.

## 4. Return and observer separation

On `C6 x C7`, with `T(a,b)=(a+1 mod 6,b+1 mod 7)`, the audit verifies

```text
T^13(0,0) = (1,6)
ord(T) = lcm(6,7) = 42
```

The Tessarec observer contract separately uses the declared map

```text
pi_theta([x,y]) =
  [cos(theta)x - 0.5 sin(theta)y,
   0.5 sin(theta)x + cos(theta)y]
```

and includes `theta=+/-42 degrees`. With reflection `S(x,y)=(x,-y)`, the
operator identity `S*pi_theta*S=pi_-theta` is checked numerically. That mirror
conjugacy holds for every angle; it does not bind `42 steps` to `42 degrees`.

The geometric binding gate remains open until a typed map from the wheel step
or state to an observer angle and envelope observable is declared.

## 5. Result vocabulary

- `PASS_EXACT`
- `PASS_GENERIC_IDENTITY`
- `DESCRIPTIVE_UNIQUE_HIT_IN_FROZEN_RANGE`
- `NO_CONFIRMATORY_SPECIFICITY`
- `OPEN_NO_DECLARED_MAP`
- `INVALID_ENGINEERING_CHECK`

No visual similarity is a pass condition.

## 6. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_OPERATOR_LADDER_PRIME_INDEX_ENGINEERING_CHECK_001
PURPOSE: VERIFY_POST_HOC_OPERATOR_AND_PRIME_INDEX_CANDIDATE
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-operator-ladder-prime-index.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-operator-ladder-prime-index.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: exact finite arithmetic, complete bounded enumeration, nearby affine controls and observer-map algebra only
AUTHORIZED_SCIENCE_RUN: false
```

## 7. Interpretation ceiling

The ladder identity is elementary and generic. A unique hit inside a post-hoc
finite universe does not establish a prime generator, preferred seed,
physical resonance, Tessarec transition or geometric mechanism. Equal numeric
labels retain different units and types: `42 steps != 42 degrees` unless a
separate source-bound map is supplied and tested.

## 8. Source junctions

- `00_INCOMING/THE_PRIME_GENESIS_DUAL_GENERATOR_RETURN_GATE_01_2026-09-08/09_LOCAL_LENS_12_13_23_26.md` records `12+13=25=5^2` with documentary/mnemonic status.
- `10 NEXAH CORE/NEXAH/RESEARCH/HISTORY/PASCAL_FIBONACCI_MOBIUS_LEO_LILITH_ARCHAEOLOGY_2026-10-10/OPERATOR_ORDER_RETURN_ARCHAEOLOGY_ADDENDUM.md` records the typed `C6 x C7` return at `42` and additive readout `13`.
- `10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/NCS_292_Q106_INTERTWINER_RETURN_PACKAGE_2026-10-11/Q106_PRIME_INDEX_RADIX_ROOT_GROWTH_AUDIT_2026-10-11/README.md` independently records `p_25=97`.
- `36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md` and `37_A0_TESSAREC_ENVELOPE_VALIDATION_PACKAGE_R0_2026-10-12.md` own the intrinsic/observed envelope distinction and the frozen observer-angle candidates.

## 9. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `807bdb1d67837229ae9f95e1f969794bd6405a3ef105e909caa203633e79fb36`  
Repeated stdout SHA-256: `852e8b03e1d922e9bf59412fc427b5bc87b652cc373472e067b03bd6670f61ec`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_WITH_POST_HOC_UNIQUENESS_AND_OPEN_GEOMETRIC_BINDING`

| Check | Receipt | Bounded reading |
|---|---|---|
| `L1_OPERATOR_IDENTITY` | `PASS_GENERIC_IDENTITY` | `x+(x+1)=2x+1`; exact but elementary and generic |
| `L2_SEED_SIX_TRACE` | `PASS_EXACT` | `6/7/13`, `12/13/25`, `24/25/49`, `48/49/97` |
| `L3_PRIME_INDEX_CLOSURE` | `PASS_EXACT_NUMERIC_IDENTITY` | `b_2=25`, `p_25=97=b_4` |
| `L4_FROZEN_SEED_ENUMERATION` | `DESCRIPTIVE_UNIQUE_HIT_IN_FROZEN_RANGE` | exactly one hit among `10,000` seeds: `s=6` |
| `L5_NEARBY_FORMULA_CONTROLS` | `NO_CONFIRMATORY_SPECIFICITY` | nearby index shifts also hit at `s=7` and `s=1`; nearby target shifts hit at `s=1,4,7` |
| `L6_C6_C7_RETURN` | `PASS_EXACT_FIRST_RETURN` | step `13` gives `(1,6)`; first joint return is step `42` |
| `L7_OBSERVER_MIRROR_CONJUGACY` | `PASS_GENERIC_OPERATOR_IDENTITY` | `S*pi_42*S=pi_-42` within frozen tolerance; identity holds for all angles |
| `L8_RETURN_TO_ANGLE_BINDING` | `OPEN_NO_DECLARED_MAP` | no typed map yet connects the `42`-step wheel to the `42-degree` observer parameter |

The zero-shift primary seed hit is:

```text
s=6
4s+1=25
16s+1=97
p_25=97
```

The neighboring index-shift controls have hit counts
`[0,0,0,1,1,1,0]` for shifts `-3..+3`. The neighboring target-shift
controls have hit counts `[2,1,0,1,0,0,0]` for shifts
`-6,-4,-2,0,+2,+4,+6`. Sparse nearby hits show that rarity alone does not
authorize a specificity claim.

### Disposition

```text
OPERATOR LADDER: SUPPORTED / GENERIC
p_25 = 97 CLOSURE: SUPPORTED AS EXACT NUMERIC IDENTITY
SEED 6 UNIQUE IN FROZEN 1..10,000 SEARCH: YES / DESCRIPTIVE ONLY
CONFIRMATORY SPECIFICITY: NOT ESTABLISHED
C6 x C7 FIRST RETURN AT 42: SUPPORTED
+/-42-DEGREE OBSERVER MIRROR: SUPPORTED AS GENERIC CONJUGACY
42 STEPS = 42 DEGREES: NOT ESTABLISHED / TYPED NON-IDENTITY
TESSAREC STATE OR EDGE BINDING: NOT TESTED / NOT ESTABLISHED
NEW FINDING: NO
```

The next admissible step is to freeze a candidate map from a wheel state or
step to one observer angle and one envelope observable, together with at least
the already frozen `+/-45`, `+/-90` and `180` degree controls. Without that
map, the identical numeric label `42` is an orientation cue rather than an
operator binding.
