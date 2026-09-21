# PTF-01 Preregistered Protocol

Protocol: `PTF-01`

Version: `1.0-design`

Status: `FROZEN_DESIGN_AWAITING_IMPLEMENTATION_REVIEW_AND_AUTHORIZATION`

Date: `2026-09-21`

## 1. Question

For a declared Janus reflection, do three injective view encodings preserve the
same quotient-orbit record while all three necessarily fail to recover the
original side, and does one explicit side-bearing binder restore exact source
reconstruction?

This is a deterministic representation-conformance question. It is not a
statistical palindrome test.

## 2. Source carrier and operators

For each registered grid size `n`, define:

```text
X_n = {(x,y) : 0 <= x,y < n}
G_n = ordinary four-neighbor grid graph on X_n, without wraparound
J_n(x,y) = (n-1-x, y)
```

Define the canonical orbit record and side label:

```text
Q_n(x,y) = (min(x,n-1-x), y)

side_n(x,y) = L  if x < (n-1)/2
              C  if 2x = n-1
              R  if x > (n-1)/2
```

For even `n`, `C` is unavailable. The reconstruction rule is:

```text
R_n((a,y), L) = (a,y)
R_n((a,y), R) = (n-1-a,y)
R_n((a,y), C) = (a,y), valid only when 2a=n-1
```

Invalid orbit/side combinations must return a typed error and must not be
silently coerced.

## 3. Registered carriers

| Role | Carrier/operator | Purpose |
|---|---|---|
| primary | `n=111`, `J_111` | `12321`-state fixture |
| small replay | `n=11`, `J_11` | complete human-inspectable replay |
| even control | `n=10`, `J_10` | removal of the fixed axis |
| operator control | `n=11`, `H_11(x,y)=(10-x,10-y)` | replace reflection by half-turn |

The expected counts are frozen in `02_EXPECTED_DECISION_LEDGER.md`.

## 4. Three view encodings

Each quotient orbit receives a stable integer identifier `k` by sorting all
canonical pairs `(a,y)` lexicographically, starting at zero. Let `N_Q` be the
number of quotient orbits and

```text
theta_k = 2*pi*k/N_Q.
```

The three registered views are:

```text
V_line(k)   = k
V_circle(k) = (cos(theta_k), sin(theta_k))
V_oval(k)   = (2*cos(theta_k), sin(theta_k))
```

The implementation must retain the exact symbolic `k` beside any floating
rendering. Equality and decoding are evaluated from `k`, never from rounded
pixels or approximate trigonometric coordinates. Circle and oval are therefore
declared embeddings, not inferred geometry and not a physical claim.

All three views encode the quotient orbit and deliberately omit `side`.

## 5. The `+1` binder

The binder record must contain:

```text
fixture_id
protocol_version
n
operator_id
orbit_ordering_rule
k
side in {L,C,R}
inverse_rule_id
source_record_digest
```

`k` alone is not the binder. Exact return is evaluated only from a valid,
provenance-bound record containing both `k` and `side` under the declared
operator and inverse.

## 6. Frozen relation ledger

The implementation must evaluate separately:

1. involution: `J_n(J_n(p)) = p`;
2. fixed status;
3. orbit size;
4. distance to the Janus axis where that axis exists;
5. degree in `G_n`;
6. adjacency under `J_n`;
7. induced quotient adjacency;
8. quotient edge multiplicity;
9. absolute side;
10. exact source identity `(x,y)`;
11. exact return from the binder.

No aggregate score may replace this itemized ledger. In particular, stable
orbit counts do not imply stable local adjacency, edge multiplicity, side or
source identity.

## 7. Primary checks

For every source state in the primary and small-replay carriers:

- all three views must decode to the same exact orbit identifier `k`;
- mirror partners must collide in every view-only record;
- fixed-axis states must have one-element fibers;
- non-fixed states must have two-element fibers;
- a view-only record must be marked `NON_IDENTIFIABLE` for the original side
  on a two-element fiber;
- a valid binder must reconstruct the exact source state;
- a corrupted or incompatible binder must fail closed.

The implementation must report fiber sizes and collision pairs exactly. It
must not select an arbitrary representative and call that reconstruction.

## 8. Frozen counterfactuals

| ID | Intervention | Required diagnostic |
|---|---|---|
| CF-01 | remove `side` from every binder | exact source return becomes `NON_IDENTIFIABLE` on every two-orbit |
| CF-02 | use `n=10` reflection | fixed-set count changes from the odd-grid rule to zero |
| CF-03 | replace `J_11` by `H_11` | fixed count and quotient count change from `11,66` to `1,61` |
| CF-04 | delete the lexicographically first horizontal edge not incident to the axis | edge count/degree/adjacency ledger detects the edit; orbit count may remain unchanged |
| CF-05 | collapse quotient edge multiplicity to a simple edge flag | multiplicity ledger detects loss; simple quotient adjacency may remain unchanged |
| CF-06 | alter one non-fixed image so the operator is no longer involutive | involution check fails and dependent return claims are invalidated |

Counterfactual selection is deterministic. “First” always means
lexicographic order on endpoint pairs after each undirected edge is written
with its smaller endpoint first.

## 9. Decision rule

`PASS_CONFORMANCE` requires all of the following:

1. every baseline arithmetic, orbit and fiber count equals the frozen ledger;
2. all three views decode to the identical `k` for every state;
3. every view-only two-orbit is reported as non-identifiable by side;
4. every valid binder returns the exact source state;
5. every invalid binder fails closed;
6. every counterfactual produces exactly the registered diagnostic pattern;
7. primary and independent replay outputs are byte-identical after canonical
   JSON serialization.

Any mismatch returns `FAIL_CONFORMANCE`. Missing implementation provenance,
hash mismatch, unavailable replay or unauthorized execution returns
`FAIL_CLOSED` without an empirical or scientific decision.

## 10. Interpretation boundary

A conformance pass would demonstrate only that the implemented fixture obeys
the declared loss-and-return contract. It would not establish:

- a novel mathematical theorem;
- a privileged property of `111` or `12321`;
- identity of line, circle and oval;
- an eight-state projection;
- a CRT/QRT identity;
- a physical, cosmological, biological or psychological mechanism;
- external usefulness or scientific novelty.

## 11. Activation prerequisites

Execution remains prohibited until all are present:

1. implementation and independent replay runner;
2. canonical input and output schemas;
3. implementation, fixture and protocol hashes;
4. independent review of the non-overlap claim;
5. Mission Control authorization of one bounded execution;
6. an explicit statement that NRS01 Holdout 02 remains separate and sealed.

No outcome file belongs in this directory before those gates are satisfied.
