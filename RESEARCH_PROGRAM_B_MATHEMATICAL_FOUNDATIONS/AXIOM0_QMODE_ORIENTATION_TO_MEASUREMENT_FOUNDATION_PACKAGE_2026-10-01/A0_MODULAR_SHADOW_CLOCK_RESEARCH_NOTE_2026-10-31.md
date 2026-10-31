# A0 Modular Shadow Clock — Residue images of one integer event

Date: `2026-10-31`
State: `R0_DOCUMENTED / FORMAL-DESIGN NOTE / IMPLEMENTED VIEW / NOT A STUDY / NO RESEARCH RUN / NO PUBLICATION AUTHORITY`
Existing identity: `MOD:NUMBER_VIEW_SUITE`
Instrument route: `A0_BOOK/A0_GAME_OF_WORLDS_PLAY.html?world=numbers&view=shadowclock&rule=sumlift#numbers`

## Question

How can the same retained integer event be shown on several residue clocks
without identifying the clocks, confusing a residue return with an integer
return, or treating a visual shadow as mathematical evidence?

The seed event is

\[
A=1836,\qquad B=1729,\qquad \Sigma=A+B=3565.
\]

## Declared projection

For every modulus `m >= 2`, define

\[
\pi_m(n)=[n]_m=n\bmod m
\]

and embed the residue on the unit circle by

\[
z_m(n)=\exp\!\left(2\pi i\frac{\pi_m(n)}{m}\right),
\qquad
\theta_m(n)=\frac{2\pi}{m}\pi_m(n).
\]

The term **modular shadow** names the image `pi_m(n)` of the retained integer
under one declared quotient projection. It does not name a geometric shadow,
reflection, affine image, causal trace or second integer identity.

The multi-clock reading is the product map

\[
\Pi_M(n)=\bigl(\pi_7(n),\pi_{11}(n),\pi_{12}(n),
\pi_{13}(n),\pi_{17}(n)\bigr).
\]

`Pi_M` is a tuple of views. The coordinates have different quotient spaces;
equal-looking angles or residues across them do not by themselves establish a
cross-modulus identity.

## Exact seed table

| clock | `pi_m(1836)` | `pi_m(1729)` | `pi_m(3565)` | shortest A/B separation |
|---|---:|---:|---:|---:|
| mod 7 | 2 | 0 | 2 | `2 steps = 102.857143 deg` |
| mod 11 | 10 (`-1`) | 2 | 1 | `3 steps = 98.181818 deg` |
| mod 12 | 0 | 1 | 1 | `1 step = 30 deg` |
| mod 13 | 3 | 0 | 3 | `3 steps = 83.076923 deg` |
| mod 17 | 0 | 12 (`-5`) | 12 | `5 steps = 105.882353 deg` |

Each row satisfies

\[
\pi_m(A)+\pi_m(B)\equiv\pi_m(A+B)\pmod m.
\]

This congruence is exact elementary arithmetic. The radial separation of the
five clocks, colors, connecting trails and glow are display choices only.

## Animated A0 fixture

The view reuses the existing Joint Lift record:

- co-running profile: `A_k=1836+11k`, `B_k=1729+11k`;
- counter-running profile: `A_k=1836+11k`, `B_k=1729-11k`;
- one saved cursor `k`; no clock-local state or hidden timer;
- Pink: `A`; Green: `B`; White: `A+B`;
- rings: `m in {7,11,12,13,17}`;
- front/back changes only the rendered side;
- JSON record and replay retain the complete integer frame.

In the counter-running profile, the white sum channel remains `3565`; its
residue point therefore remains fixed on each clock while Pink and Green move.
In the co-running profile, the difference remains `107` while the sum advances
by `22` per step. These are properties of the declared game fixture, not a
recovered historical operator.

## Relation to the Pinky-gon source

The local file `codex_polyptychon_4scene.ply` can be read as geometry and point
data. Its stored structure includes a large colored point population and a
small set of triangular faces; the pink and green point populations have equal
counts, but no simple affine mirror relation was established in the source
audit. The file does not contain the missing authorial generator or semantic
contract.

Therefore this note does **not** infer the Modular Shadow Clock from the PLY.
The PLY may remain an illustrative historical object. The clock is independently
defined by the equations above. The phrase `GREEN AFTERIMAGE` is editorial
language for a residue image in another declared clock, not a reconstruction
of the PLY's green field.

## Claim ceiling and controls

Established here:

1. exact finite residue calculations for the declared integers and moduli;
2. an inspectable circle embedding of those residues;
3. a synchronized A0 display over one retained Joint Lift frame;
4. replayable separation between integer state and residue view.

Not established:

- a new number law, prime generator or privileged modulus set;
- a geometric, optical or physical shadow mechanism;
- an identity between the five quotient clocks;
- a mathematical derivation of Pinky-gon geometry;
- novelty, empirical evidence, scientific activation or publication status.

Useful negative controls are adjacent integer pairs, another fixed sum, a
different preregistered modulus set and permutation of the display colors. A
pattern that vanishes under these controls remains an appearance, not a claim.

## Governance return

This work **extends one view** inside the existing `MOD:NUMBER_VIEW_SUITE` and
reuses the existing A0 package, Joint Lift and A0 evidence lens. It creates:

- new Navigator entities: `0`;
- new typed relations: `0`;
- new aliases or Families: `0`;
- new Study or Lab activation: `0`;
- publication authorization: `0`.

The canonical implementation remains in `A0_BOOK/`. Navigation placement and
visual similarity do not create scientific identity or evidence.
