# A0 CRT/QRT · Palindrome Closure · Return Joint — Engineering Check 53

Date: `2026-10-13`

Status: `SOURCE_BOUND_ENGINEERING_INSTRUMENT / EXACT_FINITE_ARITHMETIC`

Science Lab state: `STRUCTURE_FREEZE`

Identity disposition: reuses `MOD:TESSAREC`, `MOD:NUMBER_VIEW_SUITE` and the
source-bound Navigator lens `NN:CRT_QRT_37_CARRIER_LADDER`; creates no new
Navigator identity or relation.

## 1. Question

Can the existing Totient, CRT, QRT, palindrome, collision and Tessarec checks
be joined into one executable inspection path without treating equal numbers,
equal residues or visual similarity as object identity?

## 2. Joint contract

The instrument keeps the following views typed and separate:

```text
integer carrier n
  -> factorization / Euler totient profile
  -> QRT address (q,r), n = 20q+r, 0 <= r < 20
  -> CRT tuple (n mod 7, n mod 11, n mod 13, n mod 19)
  -> diagnostic fingerprint mod (7,11,13,19,20,29,37)
  -> decimal palindrome / pair-sum view
  -> optional Tessarec frame-layer record
```

The common record is an interface joint. None of the projections is declared
to generate another projection.

## 3. CRT/QRT application

The reconstruction moduli are pairwise coprime:

```text
M = 7 * 11 * 13 * 19 = 19019.
```

Therefore the four-coordinate CRT tuple uniquely reconstructs one residue in
the declared domain `0 <= n < 19019`. The QRT address is ordinary Euclidean
division by 20.

Examples retained from the source-bound carrier ladder:

| n | QRT `(q,r)` | CRT `(7,11,13,19)` |
|---:|:---:|:---:|
| 37 | `(1,17)` | `(2,4,11,18)` |
| 137 | `(6,17)` | `(4,5,7,4)` |
| 237 | `(11,17)` | `(6,6,3,9)` |
| 537 | `(26,17)` | `(5,9,4,5)` |
| 11357 | `(567,17)` | `(3,5,8,14)` |
| 11537 | `(576,17)` | `(1,9,6,4)` |

Equal `r=17` identifies one QRT column, not an equal integer, factorization or
CRT fingerprint.

### Withheld-address control

If `mod 13` is withheld while residues modulo `7`, `11` and `19` are kept,
the remaining modulus product is `1463`. In `0 <= n < 19019` there are exactly
13 compatible candidates. The correct result class is therefore `HOLD`, not
an invented unique reconstruction.

## 4. Three-digit palindrome closure

Freeze the domain to the 90 base-10 palindromes

```text
P(a,b) = 101a + 10b,
1 <= a <= 9,
0 <= b <= 9.
```

For two sources,

```text
P(a,b) + P(c,d) = 101(a+c) + 10(b+d).
```

The demonstrator exhaustively enumerates this declared finite domain and
reports ordered and unordered preimages for the observed sum.

Exact controls:

| Sources | Sum | Output closure | unordered / ordered preimages |
|:---:|---:|:---:|:---:|
| `404 + 707` | `1111` | palindrome | `4 / 8` |
| `444 + 767` | `1211` | not a palindrome | `36 / 72` |
| `444 + 777` | `1221` | palindrome | `32 / 64` |

The second row is the negative closure control. In particular,
`444+767` is not `1111`; it is `1211`.

Across all 4095 unordered pairs with repetition, 1036 pairs have palindromic
outputs. Thus one palindromic output is not by itself an unusualness result;
it is a closure classification inside the frozen population.

## 5. Totient shadow ladder

The following arithmetic is exact:

```text
n:          11 -> 121 -> 1111
phi(n):     10 -> 110 -> 1000
n-phi(n):    1 ->  11 ->  111
```

The repeating 9s in the ratios are factor-driven:

```text
phi(121)/121   = 10/11            = 0.909090...
phi(1111)/1111 = (10/11)(100/101) = 0.900090...
```

They are useful audit signatures of the chosen addresses, not independent
evidence of a physical resonance.

## 6. Concrete application

The expanded Joint Applications HTML now provides three operational tests:

1. **Address return:** compute QRT, CRT and diagnostic fingerprints; remove one
   coordinate and observe ambiguity rather than a fabricated return.
2. **Pair-sum return:** project two palindrome sources to a sum, enumerate all
   compatible sources and retain the ordered source pair as witness.
3. **Typed joint record:** assemble Number View, CRT/QRT, decimal closure and
   optional Tessarec layer fields without collapsing their namespaces.

These are practical fixtures for UI routing, provenance ledgers, serializer
tests and loss/return demonstrations.

## 7. Result

```text
CRT_RECONSTRUCTION_IN_DECLARED_DOMAIN: PASS_EXACT
WITHHELD_MOD13_UNIQUENESS: HOLD_13_CANDIDATES
QRT_R17_COLUMN_IDENTITY: REJECTED
PALINDROME_1111_CLOSURE: PASS_EXACT_4_UNORDERED_PREIMAGES
PALINDROME_1211_NEGATIVE_CONTROL: PASS_EXACT_NONPALINDROME
PALINDROME_1221_NEIGHBOR_CONTROL: PASS_EXACT_32_UNORDERED_PREIMAGES
JOINT_MECHANISM_CLASS: INFORMATION_INTERFACE_MECHANISM
PHYSICAL_MECHANISM: NOT_CLAIMED
```

## 8. Authority and claim ceiling

This record is a bounded engineering extension inside the existing A0 package.
It is not a scientific run, new Lab admission, new mathematical theorem,
natural-number privilege, physical resonance claim or publication authority.
Its authority is exact standard finite arithmetic, source-bound interface
design and explicit negative controls.

## 9. Sources

- `SCIENCE_LAB/NAVIGATION/EVIDENCE/CRT_QRT_37_CARRIER_LADDER_2026-10-11/README.md`
- `SCIENCE_LAB/NAVIGATION/EVIDENCE/CRT_QRT_37_CARRIER_LADDER_2026-10-11/CRT_QRT_37_CARRIER_LADDER_BINDER_V1_2026-10-11.json`
- `21_A0_MATHEMATICAL_JOINTS_11_GRID_ORIENTATION_2026-10-10.md`
- `44_A0_MOD77_TORUS_LIFT_THREE_TURN_ENGINEERING_CHECK_2026-10-13.md`
- `49_A0_SCARAB_TOTIENT_OPERATOR_SPINE_SOURCE_AUDIT_2026-10-13.md`
- `51_A0_4774_4114_8888_SNCE_404_SOURCE_BINDING_2026-10-13.md`
- `52_A0_RATH_49_51_PHI5_SHADOW_JOINT_SOURCE_AUDIT_2026-10-13.md`
- `A0_BOOK/A0_JOINT_APPLICATION_DEMONSTRATOR.html`
