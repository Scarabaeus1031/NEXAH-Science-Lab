# Primecube Control Plane · Coupled return, C6 adapter and colon probe

Date: `2026-11-23`  
Status: `BOUNDED ENGINEERING / FORMAL-DESIGN FIXTURE`  
Predecessor: `A0_PRIMECUBE_CONTROL_PLANE_BASELINE_2026-11-23.md`

## Scope and authority

This record implements requested steps 4–6 without changing the visible
Primecube page:

1. exact product return for Q60, LOKI56 and Fold2;
2. a typed Splinter-C6 to Q-Cube adapter investigation;
3. a falsifiable colon-as-phase-line probe.

It is not presented as an admitted Lab run. It reuses the existing A0,
Mathematical Joints, Number View Suite, Tessarec and Orientation Controller
Bench identities. New canonical IDs and Source Graph relations are both zero.

## 4 · Coupled return

At step `k`, the fixture records

```text
Q(k)     = 20^k mod 1001
LOKI(k)  = (k mod 7, k mod 8)
FOLD(k)  = k mod 2
MZ24(k)  = ((Q(k) mod 11) + (Q(k) mod 13)) mod 24
```

The first complete return is

```text
lcm(60,56,2) = 840.
```

All 840 product states before the return are distinct. At step 840 the Q
register is `1`, LOKI is `(0,0)` and Fold parity is `0`.

This is synchronization of retained independent periods. It is not evidence
of a common natural clock or physical coupling.

## 5 · Splinter-C6 to Q adapter

Direct `T20` does not close on the six Splinter anchors. The smallest positive
power of the order-60 operator having order six is `T20^10`:

```text
g = 20^10 mod 1001 = 771
ord_1001(g) = 6.
```

Using the already declared Splinter boundary order

```text
[1, 8, 11, 22, 27, 33]
```

and assigning anchor `1` to the Q identity state `1` gives:

| Splinter anchor | Q adapter state | MZ24 tick |
|---:|---:|---:|
| 1 | 1 | 2 |
| 8 | 771 | 5 |
| 11 | 848 | 4 |
| 22 | 155 | 13 |
| 27 | 386 | 10 |
| 33 | 309 | 11 |

The adapter is injective, closes after six steps and satisfies

```text
A(R(a)) = 771 A(a) mod 1001.
```

The reverse orientation uses `T20^50` with generator `309`. Forward and
reverse are both valid; the construction is therefore not claimed unique.

### Fold transfer

On the six boundary positions, the existing fold

```text
F = (1 11)(33 22)(8)(27)
```

acts as the reflection

```text
F(i) = 2-i mod 6.
```

It fixes the `8↔27` axis and, together with the cyclic rotation, satisfies the
dihedral relation

```text
F R F = R^-1.
```

This is the strongest positive result of the adapter test: the Splinter C6
rotation and Fold reflection transfer exactly to a six-state sample of the Q
orbit. It remains a declared adapter, not a natural identity of root labels and
CRT residues.

## 6 · Colon phase-line probe

As an explicitly selected **Q-state edge**, a colon connector can carry

```text
q' = 771q mod 1001
```

with inverse `q'=309q mod 1001` and exact return after six edges.

As a **uniform MZ24 phase line**, however, it fails. The six phase increments
are

```text
[3, 23, 9, 21, 1, 15] mod 24.
```

They sum to zero modulo 24, so the readout closes after the cycle, but there is
no single phase increment `Δ` transported by every edge.

The resulting disposition is therefore:

```text
PASS  · explicit reversible Q-state edge
FAIL  · uniform MZ24 phase transport
HOLD  · colon remains OPEN_TYPED_JOINT by default
```

The glyph `:` acquires no universal phase meaning. A Q-state edge may be
selected locally only when its source, target, direction, payload, update law,
inverse and return contract are all displayed.

## Replay

```bash
node a0-primecube-control-plane-coupling-tests.cjs
```

Expected status: `PASS_STEPS_4_TO_6_WITH_PHASE_LINE_NEGATIVE`.

## Claim boundary and next gate

Exact finite modular and permutation statements only. No Study, Finding,
physical carrier, energy channel, phase wire, shared natural clock, causal
mechanism or publication state is created.

The next possible step is a visible Control Plane panel on the Primecube page.
That interface work should display the positive C6/dihedral adapter and the
negative uniform-phase result together; it must not relabel the colon globally.
