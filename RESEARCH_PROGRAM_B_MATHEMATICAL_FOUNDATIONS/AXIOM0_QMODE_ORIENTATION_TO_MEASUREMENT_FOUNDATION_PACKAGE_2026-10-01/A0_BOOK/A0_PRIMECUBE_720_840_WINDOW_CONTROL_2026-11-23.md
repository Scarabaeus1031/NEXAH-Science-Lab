# Primecube 720/840 Window Control

Date: 2026-11-23  
Disposition: `PASS_EXACT_MODULAR_RECURRENCE / CUBE_DERIVATION_NOT_ESTABLISHED`  
Identity: reuse `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`, `ART:A0:MATHEMATICAL_JOINTS`, `MOD:NUMBER_VIEW_SUITE`, `MOD:TESSAREC`

## Question

Does the arithmetic pair `840−120=720` and `840+600=1440` reveal a stable relation between the Q unit-group window and the existing Q60 × LOKI56 × Fold2 return?

## Exact result

Two periods must remain typed separately:

- `720 = φ(1001) = φ(7·11·13) = 6·10·12`: size of the unit group modulo 1001;
- `840 = lcm(60,56,2)`: first joint return of Q60, LOKI56 and Fold2.

Their difference is 120 and their least common multiple is 5040:

`7·720 = 6·840 = 5040`.

For the 720-step window:

- `720 mod 60 = 0`: Q60 returns;
- `720 mod 2 = 0`: Fold2 returns;
- `720 mod 8 = 0`: the LOKI orientation returns;
- `720 mod 7 = 6 = −1`: the LOKI station moves backward by one;
- `720 mod 56 = 48 = −8`: the combined LOKI offset is minus eight.

The observed sequence is therefore exact and stable:

| Window | Step | mod 56 | LOKI state |
|---:|---:|---:|---:|
| 0 | 0 | 0 | S0 · O0 |
| 1 | 720 | 48 | S6 · O0 |
| 2 | 1440 | 40 | S5 · O0 |
| 3 | 2160 | 32 | S4 · O0 |
| 4 | 2880 | 24 | S3 · O0 |
| 5 | 3600 | 16 | S2 · O0 |
| 6 | 4320 | 8 | S1 · O0 |
| 7 | 5040 | 0 | S0 · O0 |

Thus `1440=2·720=840+600` is the second window state, not a joint return: Q60 and Fold2 close, while LOKI is at `S5 · O0`, or `−16 mod 56`.

## Cube boundary

The number eight has an internal role here: `gcd(720,56)=8`, and the retained LOKI display is typed as `C7×C8`. It is also numerically true that `8=2³`.

What is not established is a derivation of the modular residue from cube geometry. The safe statement is:

`EXACT_NUMERIC_CROSSWALK_ONLY: 8 = 2³ = LOKI orientation count = gcd(720,56)`.

No spatial cube mechanism, natural clock, physical phase line or identity merge follows from these equal integers.

## Return

The Prime Cube Control Plane now displays the seven-window recurrence and the return at 5040. All model and UI controls are executable. New canonical IDs, graph relations, Study, Finding and publication effects remain zero.

