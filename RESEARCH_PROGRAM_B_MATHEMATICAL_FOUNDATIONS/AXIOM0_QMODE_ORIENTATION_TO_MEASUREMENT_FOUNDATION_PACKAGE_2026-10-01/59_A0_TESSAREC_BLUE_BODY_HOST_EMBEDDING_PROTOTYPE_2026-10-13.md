# Check 59 — Tessarec Blue Body host-embedding prototype

Date: `2026-10-13`  
Status: `INTERNAL DETERMINISTIC ENGINEERING PROTOTYPE · NOT A SCIENCE RUN`  
Identity: reuses `MOD:TESSAREC`; no new Family, Study or Navigator identity

## Question

Can the closed cubic `O2–P16–H8` shell serve as an inspectable spatial host
for the 48 states of the existing `Q4 × P3` Tessarec carrier without claiming
that the two graphs are identical?

## Declared objects

- Carrier: `Q4 cartesian-product P3`, `48` vertices and `128` edges.
- Host: a closed genus-zero cubic shell with `48` vertices, `72` edges and
  `26` faces: `2` octagons, `16` pentagons and `8` hexagons.
- Adapter: a vertex bijection. Carrier edges are routed over deterministic
  shortest paths in the host; they are not reclassified as host edges.
- Natural partition: `3 × 16` carrier layers map to paired `6 × 8` shell rings.

## Deterministic fixture

The implementation uses seeded simulated annealing and a sorted-BFS routing
tie-break. The fixed replay command is:

```bash
node A0_BOOK/a0-tessarec-blue-body-tests.cjs
```

| Mapping | Wirelength | Mean dilation | Max dilation | Max congestion | Direct edges | Layer addresses retained |
|---|---:|---:|---:|---:|---:|---:|
| Natural Gray-ring / layer-preserving | 280 | 2.1875 | 6 | 6 | 40 | 48/48 |
| Unconstrained candidate, seed 7 | 280 | 2.1875 | 6 | 6 | 45 | 14/48 |

## Bounded return

The natural adapter is not defeated by the recorded unconstrained candidate on
wirelength, dilation or congestion, while it preserves the complete declared
layer partition. The unconstrained candidate places five additional carrier
edges directly on host edges, but loses 34 of 48 layer addresses.

This is useful because it turns the proposed “blue body” into a measurable
representation contract: spatial locality and semantic layer retention can be
reported separately.

## What is not established

- no proof that wirelength `280` is globally minimal;
- no proof that this host is unique or best among 48-vertex shells;
- no graph isomorphism between the `128`-edge carrier and `72`-edge host;
- no new polyhedron, physical mechanism, Tessarec theorem or novelty claim;
- no scientific activation, publication authority or evidence promotion.

## Sources and surfaces

- Interactive surface: `A0_BOOK/A0_TESSAREC_BLUE_BODY_LAB.html`
- Machine record: `A0_BOOK/assets/a0-tessarec-blue-body-v1.json`
- Implementation: `A0_BOOK/assets/a0-tessarec-blue-body-v1.js`
- Owning paper: `A0_BOOK/A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html`

