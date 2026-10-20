# A0-BL-024 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED_OPEN / NOT_ACTIVE / NOT_EXECUTED`

## Question

What can two explicit `Q106 -> O16` maps preserve, what must they lose, and
what additional residual is sufficient for exact Return? Does the C4 direction
cycle admit a nontrivial rotation intertwiner with the Q106 C5 action?

## Frozen carriers

```text
O16 = {N,E,S,W} x {spin+,spin-} x {up,down}
Q106 = the 106 indexed nodes in the frozen SCC-003 reference export
```

The carriers are not identified. Since `16 != 106`, no bijection exists.

## Map P1 — balanced index projection

For canonical Q106 row index `q in 0..105`, declare

```text
P1(q) = q mod 16.
```

This is an information-accounting baseline, not a natural state law. Record
coverage, fiber histogram, collision count, maximum fiber size, conditional
residual bits and exact Return using the rank of `q` inside its fiber.

## Map P2 — typed attribute readout

For each frozen node, declare:

```text
direction = level_n mod 4
spin      = 1 iff kind == interior, else 0
elevator  = parity(face if present, else seam if present, else 0)
P2(q)     = direction + 4*spin + 8*elevator.
```

This map is explicitly constructed for the audit. It is not claimed to be
canonical. Apply the same collision, residual and Return accounting as P1.

## Controls

1. **Cardinality:** every `Q106 -> O16` map has at least 90 collisions in the
   count `sum(|fiber|-1)`; no inverse exists without extra information.
2. **Representative lift:** selecting the lowest Q106 index in each nonempty
   fiber gives an injection from reached O16 states into Q106, never a
   surjection onto all 106 nodes.
3. **Fixed shuffle:** apply seed `240106` before the balanced projection. Its
   fiber sizes remain matched while its node assignments differ. Therefore
   balanced information cost alone cannot select P1.
4. **Rotation order:** a homomorphism from C4 to C5 is trivial because
   `gcd(4,5)=1`. No nontrivial map may be called a C4/C5 rotation intertwiner.
5. **Source integrity:** exactly 106 Q106 nodes and a declared order-five
   rotation must be present in the frozen sources.

## Decision semantics

- `INFORMATION_LOST_RESIDUAL_SUFFICIENT`: both projections collide, and their
  declared conditional residuals reconstruct all 106 nodes exactly;
- `NON_IDENTIFIABLE_NO_CANONICAL_MAP`: controls show that the tested costs or
  coverage do not select a unique/canonical map;
- `PARTIAL`: some finite gates pass but a registered nonfatal gate fails;
- `INVALID_DESIGN`: source, lock, schema, replay, residual or verifier failure;
- `UNINFORMATIVE`: a target, inverse or canonicality label is leaked or built
  into the evaluated map.

The final result may combine the first two statements if both are established.

## Claim ceiling

Finite internal relation and information accounting only. No canonical
O16/Q106 identity, geometric embedding, physical orientation mechanism,
utility, novelty, public release or publication claim.
