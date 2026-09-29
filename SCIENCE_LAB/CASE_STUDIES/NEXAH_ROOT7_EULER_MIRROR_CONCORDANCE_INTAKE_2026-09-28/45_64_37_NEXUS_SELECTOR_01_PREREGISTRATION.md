# 64/37 Nexus Selector 01 — preregistration

Date: `2026-09-29`

Status: `PREREGISTERED / BOUNDED INTEGER CONTRACT / NOT YET EXECUTED`

## Question

Can the previously external `101` carrier choice be bound by one finite,
deterministic selector contract that joins the already registered decimal
boundary and prime hinge with the Human Owner supplied `64+37` Nexus route?

## Frozen sources

1. `NEXAH_ZERO_GLYPH_IOTA_BOUNDARY_TEST_2026-09-28/FINAL_REPORT.md`:
   `99 -> 100` is the decimal two-to-three-digit boundary.
2. `NEXAH_ROOT7_CUSTODY_2026-09-28/DELTA_19_RECONCILIATION.md`:
   `97–99–101` is an exact prime hinge and
   `404=(101-97)*101` is an exact identity under a declared scale rule.
3. Human Owner return of `2026-09-29`:
   `64+37=101`, `37=P_12`, `73=P_21`, and the proposed nonconsecutive
   Nexus triad `[101,127,137]` over the common base `64=2^6`.
4. Existing consecutive-prime control:
   `[127,131,137]=[P_31,P_32,P_33]`.

No result produced by this execution may change these inputs.

## Frozen definitions

For positive integer `n`:

- `P_i` is the `i`th prime with one-based indexing;
- `rev(n)` reverses the base-10 digits of `n` and discards leading zeroes;
- `next_prime(n)` is the least prime strictly greater than `n`;
- the decimal boundary is the ordered edge `99|100`;
- the upper/outward side of that edge is the three-digit side.

The three declared selector routes are:

```text
S_digit = next_prime(99) = 101
S_hinge = upper endpoint of the symmetric prime hinge 97–99–101
S_nexus = 64 + P_12 = 64 + 37
```

Pass requires `S_digit=S_hinge=S_nexus=101`.

## Frozen tests

### T1 — base and prime addresses

Verify:

```text
64 = 2^6
37 = P_12
73 = P_21
101 = P_26
127 = P_31
131 = P_32
137 = P_33
173 = P_40
```

### T2 — prior binding of 37

Enumerate every two-digit prime `p` whose digit reversal is prime and whose
one-based prime index also reverses to the index of `rev(p)`. Excluding the
palindromic fixed point `11`, the only unordered pair must be `{37,73}`.

This establishes a finite prior-binding property. It does not establish an
information-theoretic optimum, physical law or uniqueness outside the frozen
two-digit domain.

### T3 — selector convergence

Evaluate the three frozen selector routes. All must return `101`.

### T4 — Nexus triad

Verify that `[101,127,137]` is prime, nonconsecutive by prime index, and obeys:

```text
64+37=101
64+63=127
64+73=137
```

### T5 — finite checksums

Verify:

```text
3*64=192
37+63+73=173=P_40
101+127+137=365
192+173=365
```

`365` is classified only as a finite arithmetic checksum and common-year
mnemonic. It is not a physical or cosmological constant and not a universal
calendar invariant.

### T6 — consecutive-triad separation

Verify that `[101,127,137]` differs from `[127,131,137]`, that the latter has
consecutive indices `[31,32,33]`, and that the exact intersection is
`[127,137]`.

### T7 — mirror-square negative control

Verify:

```text
37^2=1369; 64^2=4096; sum=5465
73^2=5329; 46^2=2116; sum=7445
```

Pass requires the two sums to be unequal. Digit reversal is reversible; the
quadratic checksum is not invariant.

### T8 — arbitrary-residual negative control

Enumerate every `r` in `1..99` for which `64+r` is prime. Pass requires more
than one candidate and inclusion of `r=37`. Therefore `64+r` alone is not a
selector; the frozen prior binding of `37` is essential.

## Decision rule

- `PASS / MULTI_PATH_SELECTOR_CONTRACT_BOUND` if T1–T8 pass.
- `FAIL / SELECTOR_NOT_BOUND` otherwise.

A pass changes the former finding `MISSING_SELECTION_CONTRACT` to
`SELECTOR_CONTRACT_PRESENT`. It does not make `101` intrinsic to `F_50`, does
not create a state-update operator, and does not activate a Builder task,
research result ID or capability.

## Claim ceiling

`FINITE_INTEGER_MULTI_PATH_SELECTOR / NO_PHYSICAL_INFORMATION_THEORETIC_OR_UNIVERSAL_CALENDAR_CLAIM`
