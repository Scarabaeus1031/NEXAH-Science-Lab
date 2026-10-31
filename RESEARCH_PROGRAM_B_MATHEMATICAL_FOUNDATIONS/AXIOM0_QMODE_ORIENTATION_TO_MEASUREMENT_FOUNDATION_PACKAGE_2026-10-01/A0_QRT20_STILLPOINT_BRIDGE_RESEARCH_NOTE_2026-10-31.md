# A0 QRT20 Stillpoint Bridge — one integer, three exact readings

Date: 2026-10-31
State: `R0_DOCUMENTED / FORMAL-DESIGN NOTE / IMPLEMENTED VIEW / NOT A STUDY / NO RUN / NO PUBLICATION`

## Exact carrier and views

The retained integer is read through three lossless representations:

\[
N \longleftrightarrow \operatorname{bin}(N) \longleftrightarrow (q,r),
\qquad N=20q+r,\quad 0\le r<20.
\]

For the declared Sevenword source rule

\[
N_0=978,\qquad N_{k+1}=10N_k-2,
\]

the seed is

\[
978_{10}=1111010010_2=20\cdot48+18.
\]

Because `N_k ≡ 18 (mod 20)` implies

\[
10N_k-2\equiv10\cdot18-2\equiv18\pmod{20},
\]

the declared family retains the QRT20 remainder:

| Integer | Binary | QRT20 address |
|---:|---|---|
| 978 | 1111010010 | q48 / r18 |
| 9778 | 10011000110010 | q488 / r18 |
| 97778 | 10111110111110010 | q4888 / r18 |

`r18` is therefore called the **Stillpoint** only inside this finite declared
recurrence and exact QRT20 address view.

## Pascal Step Pyramid and coupling window

The decimal words have the exact concatenation grammar

\[
N_k=\overline{9\,\underbrace{77\ldots7}_{k+1}\,8}.
\]

Every step keeps the boundary digits `9` and `8` and inserts one additional
inner `7`. Centering the first finite rows therefore produces a stepped,
triangular silhouette. The instrument calls this the **Pascal Step Pyramid**:
the name describes the row-and-branch display grammar only. It does not identify
the sequence with Pascal's triangle or with binomial coefficients.

The optional **Verschränkungsfenster / Digit Lattice** connects retained digit
positions and the newly inserted inner position between adjacent rows. In this
note, *Verschränkung* means a geometric coupling view over one stored integer
sequence. It is not quantum entanglement, a physical interaction or an
additional recurrence.

The visual morphology may be read as follows, without changing the exact
contract:

- growing quotient and word length → step field / pyramid;
- invariant `r18` → horizon pin / stillpoint;
- cyan `+5 / 90°` comparator → moon arm / offset marker.

These are editorial names for visible roles, not evidence-bearing identities.

## Eightfold Terrace — Pyramid of Plates

The next display level addresses the sequence index by Euclidean division:

\[
k=8b+s,
\qquad 0\le s<8,
\qquad 0\le b<8.
\]

`s` is the local step inside one eight-row plate; `b` is the plate index. The
resulting 8×8 field contains 64 exact index addresses. Its cell classes remain
separate:

- visited: an already stored Sevenword frame;
- declared: reachable inside the existing finite `n=0…16` run;
- projection: an address in the 8×8 display field beyond that run;
- active: the currently selected stored frame.

The **Eightfold Terrace / Pyramid of Plates** therefore does not silently
extend the recurrence horizon from 16 to 63. It is an index projection over the
existing record. A separate run-contract decision would be required before
additional sequence frames could become evidence-bearing states.

## Quarter-turn sidecar

On a 20-sector residue circle, a quarter-turn is five sectors:

\[
\Phi_{90}(N)=N+5,
\qquad r\mapsto(r+5)\bmod20,
\]

with the quotient carry retained. At the seed:

\[
978\mapsto983,
\qquad (48,18)\mapsto(49,3).
\]

This `+5 / 90°` view operator is not the `+11 Joint Lift`. It is not a physical
phase, temporal claim or new recurrence.

## Instrument contract

- source/carrier: the complete retained integer frame;
- rule: the declared Sevenword recurrence;
- views: decimal, exact binary encoding and Euclidean QRT20 address;
- optional sidecar: declared `+5 / 90°` residue-circle comparison;
- optional visual sidecar: Pascal-style digit lattice over adjacent decimal rows;
- optional index sidecar: Eightfold Terrace with exact `k=8b+s` addresses;
- return: normal saved-frame replay; view changes never rewrite the carrier;
- boundary: no visual pattern creates a new number identity or number law.

Route:
`A0_GAME_OF_WORLDS_PLAY.html?world=numbers&view=qrt20&rule=sevenword&rev=qrt20-r1#numbers`

Governance: existing `MOD:NUMBER_VIEW_SUITE` and A0 evidence identities reused.
New IDs `0`; relations `0`; aliases `0`; Study `0`; Finding `0`; publication
effect `0`.
