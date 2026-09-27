# Number–Glyph Operator Register

Date: 2026-09-16  
Status: documentary and exploratory; no theory promotion

## Purpose

This register keeps exact arithmetic, prime indices, numeral notation, local OLS
glyph readings and observed HZ/FZ coordinates in separate typed layers. A bridge
is usable only when its operator and decoder are stated.

## Exact arithmetic layer

- `6 = 2 * 3`
- `9 = 3^2`
- `6 + 9 = 15`
- with `p1=2, p2=3, p3=5`, `p2 * p3 = 3 * 5 = 15`
- `Roman(15) = XV`
- `91 = 13 * 7`, `Roman(13) = XIII`, and `Roman(7) = VII`
- `72 = 2^3 * 3^2` and `72^3 = 373248`
- `97 = p25`

These are exact identities. They do not by themselves specify a physical,
geometric or causal relation.

## Typed local operators

| Operator | Input type | Output type | Current use | Boundary |
|---|---|---|---|---|
| `ROMAN(n)` | positive integer | Roman numeral string | `ROMAN(15)=XV`, `ROMAN(13)=XIII`, `ROMAN(7)=VII` | notation only |
| `PRIME_INDEX(k)` | positive integer index | kth prime | `PRIME_INDEX(2)=3`, `PRIME_INDEX(3)=5`, `PRIME_INDEX(25)=97` | index is not the prime value |
| `CONCAT10(a,b)` | decimal digit strings | decimal digit string | `CONCAT10(2,3)=23` | representation-dependent, not multiplication |
| `OLS_GLYPH(XV)` | source-local glyph string | mnemonic sequence | `X -> CROSS`, `V -> SPLIT` | local decoder, not Roman semantics |
| `Q1000(x)` | real number | rounded integer | candidate `Q1000(0.056191592)=56` | must be declared before a test |

The pair `(2,3)` may therefore be retained as a prime-index address for
`(p2,p3)=(3,5)`. Its product is `15`; its decimal concatenation is `23`. These
are two different operations and must not be collapsed.

## HZ/FZ join–cross–split observation

The existing active-order interpolation reports a crossing at
`x*=7.556191592015567`. Relative to the descriptive midpoint `7.5`, the
residual is `+0.056191592015567`. The bracketing labels `6` and `9` can be
stored as the exploratory sequence

`JOIN(6,9) -> CROSS(x*) -> SPLIT`

only after the two curves, alignment rule and interpolation are named. The
crossing is alignment-sensitive and is not a universal recurrence.

## Open bridge: 91 to 15

`91=13*7` and `XIII*VII=91` are exact. No currently declared operator maps
that identity to `15` or to `3+2`. Consequently the proposed
`91 <-> 15 / 3+2` connection remains `UNRESOLVED_BRIDGE`. It may be searched
as a hypothesis key, but it is not used as an equality, prediction or physical
claim.

Likewise, reading `69` as a counter-orientation or return-loop glyph is a local
mnemonic. The exact digit statement is `6+9=15`; “alternating current” requires
measured periodic sign reversal and cannot be inferred from the digits.

## Promotion rule

A number/glyph bridge may move from documentary to tested only when it has:

1. a frozen decoder;
2. a declared carrier and units;
3. a nontrivial preregistered prediction;
4. an untouched test target; and
5. a destruction control showing what breaks the prediction.

