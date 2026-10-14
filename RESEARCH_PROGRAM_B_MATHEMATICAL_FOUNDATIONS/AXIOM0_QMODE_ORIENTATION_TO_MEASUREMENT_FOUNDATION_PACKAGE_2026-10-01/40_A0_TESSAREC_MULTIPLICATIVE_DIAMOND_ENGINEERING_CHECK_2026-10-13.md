# A0 Tessarec 24–48–72–144 Multiplicative Diamond — Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

## 1. Bounded question

Does the existing typed prime seed `(p1,p2)=(2,3)` generate the exact
multiplicative diamond `24–48–72–144`, and does the sorted Gon quartet
`7,17,19,29` bind to its first three values by row sums and total?

The audit separates:

1. the exponent rectangle, which may be a generic algebraic construction;
2. the Gon-sum cross-binding, which is an exact numeric coincidence to be
   measured against complete finite control universes;
3. any future carrier/operator interpretation, which is not tested here.

## 2. Frozen construction

For `p1=2` and `p2=3`:

```text
B = p1^p2     * p2    = 2^3 * 3   = 24
C = p1^(p2+1) * p2    = 2^4 * 3   = 48
X = p1^p2     * p2^p1 = 2^3 * 3^2 = 72
K = p1^(p2+1) * p2^p1 = 2^4 * 3^2 = 144
```

The proposed diamond is:

```text
24 --x2--> 48
 |           |
x3          x3
 |           |
 v           v
72 --x2--> 144
```

It also requires `gcd(48,72)=24` and `lcm(48,72)=144`.

## 3. Frozen Gon layout

The quartet is sorted and placed row-major:

```text
 7  17   -> 24
19  29   -> 48
total    -> 72
diagonals: 7+29 = 17+19 = 36
```

Changing the order after seeing results is not permitted inside this audit.

## 4. Controls

Two complete finite universes are enumerated:

1. every four-element subset of primes from `5..47`, sorted ascending;
2. every four-element subset of odd integers from `5..47`, sorted ascending.

Each quartet is checked for:

- equal diagonals / central balance;
- upper-row sum equal to twice the lower-row sum;
- exact row sums `24` and `48`;
- the conjunction of all three properties.

The bounds and properties were selected after the target pattern was noticed.
Reported frequencies are therefore descriptive, not confirmatory p-values.

## 5. Genericity control

The same exponent-rectangle construction is evaluated for additional seeds
`(2,5)`, `(3,5)` and `(3,7)`. If both paths commute for these seeds as well,
the diamond form itself is classified as generic rather than novel. Only the
cross-binding to independently supplied Gon sums remains a candidate relation.

## 6. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_MULTIPLICATIVE_DIAMOND_ENGINEERING_CHECK_001
PURPOSE: VERIFY_POST_HOC_FORMAL_CANDIDATE
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-multiplicative-diamond.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-multiplicative-diamond.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: finite arithmetic and post-hoc control enumeration only
AUTHORIZED_SCIENCE_RUN: false
```

## 7. Interpretation ceiling

An exact numeric cross-binding does not establish that Gon order generates the
Tessarec carrier, that equal values have equal roles, or that the construction
describes physical resonance. `24` as a sum, `48` as a carrier cardinality and
`72` as a cross-power product remain differently typed records.

## 8. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `3ec4130e00106c151262a7d1324935beeb380d14fe0a410fd8aeba2679e9cf14`  
Repeated stdout SHA-256: `ab4b89cdd81f3a43fd1b00c17d25b09d92e1be0d652231ee63f4f7089009277b`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_POST_HOC_FORMAL_AUDIT`

| Check | Receipt | Bounded reading |
|---|---|---|
| `M1_EXPONENT_DIAMOND` | `PASS` | `24 -> 48`, `24 -> 72`, common closure `144`; `gcd(48,72)=24`, `lcm(48,72)=144` |
| `M2_GON_SUM_BINDING` | `PASS_NUMERIC_IDENTITY` | sorted rows give `24` and `48`, total `72`, diagonals `36/36` |
| `M3_PRIME_QUARTET_CONTROL_UNDER_48` | `DESCRIPTIVE_EXACT_ENUMERATION` | one joint hit among `715`: exactly `7,17,19,29` |
| `M4_ODD_QUARTET_CONTROL_UNDER_48` | `DESCRIPTIVE_EXACT_ENUMERATION` | three joint hits among `7,315`; target plus `9,15,21,27` and `11,13,23,25` |
| `M5_GENERICITY_CONTROL` | `NEGATIVE_NOVELTY_RESULT` | the commuting exponent diamond also occurs for other seeds and is algebraically generic |

Descriptive joint rates in the frozen universes are `1/715 ~= 0.0013986`
for prime quartets and `3/7315 ~= 0.0004101` for odd quartets. These are
enumeration frequencies, not confirmatory p-values.

### Disposition

```text
24–48–72–144 ARITHMETIC DIAMOND: SUPPORTED
GON-SUM CROSS-BINDING: SUPPORTED AS EXACT NUMERIC IDENTITY
UNIQUE JOINT HIT IN FROZEN PRIME CONTROL: YES, DESCRIPTIVE ONLY
NOVELTY OF THE EXPONENT DIAMOND ITSELF: REFUTED / GENERIC
TESSAREC OPERATOR BINDING: NOT TESTED / NOT ESTABLISHED
NEW FINDING: NO
```

The retained candidate is therefore not “a new multiplicative diamond.” It is
the typed coincidence that one sorted prime quartet simultaneously supplies
the `24/48/72` values and central balance while `48` already has a separately
declared role as the optional `Q4 x P3` carrier cardinality. Equality of values
does not yet establish equality of operators or objects.
