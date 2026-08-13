# Historical materiality-filtered disposition backfill

Checked: 2026-08-11  
Scope: closed/pre-ledger work plausibly affecting architecture, authority,
product capability, interface contracts, ORION/NEXAH relations or navigation
semantics  
Scientific re-evaluation: not performed

## Method

The canonical Labreport Index was checked first. It contains one CLOSED
Labreport. A bounded set of older final reports was then selected only where
the title/result could plausibly be misread as current architecture or product
capability. PASS/FAIL/INVALID findings were preserved. No package was reopened,
re-scored or promoted.

Default disposition is `NOT_ADOPTED`. A later Owner decision may cite Research
evidence, but the Research record itself cannot supply that decision.

## Material dispositions

| ID | Closed source / SHA-256 | Preserved result | Plausible architecture surface | Adoption disposition | Canonical update |
|---|---|---|---|---|---|
| MHB-001 | `SCIENCE_LAB/LABREPORTS/ORION/LABREPORT_ORION_O8_B1_CYCLE_001.md` / `bb4aef6412c22c326f6e283aa7f5471e3d97ac4e3bb25086c6973dff422c12cf` | O8 infrastructure validated; B1.001 invalid; B1.002 uninformative; candidate routes closed | O8 capability, ambiguity/fibers, B2/navigation | `NOT_ADOPTED` by this Labreport | None. Later Interface/Master decisions remain separate Owner acts. |
| MHB-002 | L1 `6261a30809e92063f69f5a3905cc68d4e7d70961ff42bda94e15b7614c057229`; L2 `4985f5759bba8cfc4b8dd30450df0758c973fd30a8a2b286f5e406de442c10f9`; L3 `3f07bfdebb65d9e2d8156168c5db89bed011aaa25859869f27952680772da583` | Scoped PASS results | cross-representation invariance, observation models, navigation interpretation | `NOT_ADOPTED` | None; retained as External Research only. |
| MHB-003 | L4.001 `b029d3488d54cff6f9ba8d8ecdbd65e468bb3e53fb383bd8d0ee24b6e75d0314`; L4.003 `803af7bac6ccbd1461781e44ba946b70b37f0d4df036cc6e2e0380dcd767d604` | `INVALID_EXPERIMENT` retained in both | NEXAH candidate robustness, tie-aware relation comparison | `NOT_ADOPTED` | None; invalidity cannot establish a product class. |
| MHB-004 | Second-order relational stability `b65bfd7c2b92592cd425a092430fe7816f26c30f745268e30247099fb9c62158` | `INVALID_EXPERIMENT` | relational stability semantics | `NOT_ADOPTED` | None. |
| MHB-005 | Sparse-trace theory `dd911296d398c428448277a6a2b50f255e752a681be52bb3c79378125ddcdb47` | sparse-trace candidate eliminated; no experiment/B2 | path/equivalence/information fibers | `NOT_ADOPTED` | None; theory remains Research evidence. |
| MHB-006 | Information-boundary comparator audit `570a28a0f6e64c8d44cff105cc7253790c9a9b9141d92b2807835285ac483205` | `NO_NEW_EXPERIMENT`; `NO_B2` | interface information boundary and comparator feasibility | `NOT_ADOPTED` | None. |
| MHB-007 | O8 information-boundary integration `425f5fc97f5e7028b640086ced996234f9b2c830ff9232ced654ed43d39d9c9d` | current Research cycle closed; no new experiment | endpoint/product/path and ambiguity boundaries | `NOT_ADOPTED` | None. |

## Coverage result

The one canonical CLOSED Labreport has an explicit disposition. The seven
material groups above cover the pre-ledger result families most likely to be
mistaken for current architecture or product capability.

This is intentionally not a claim that every historical directory has been
normalized. The remaining queue is bounded to either:

1. a newly indexed CLOSED Labreport;
2. a pre-ledger final report later cited in an architecture, release,
   capability or interface proposal; or
3. a report selected for publication as current system evidence.

At that trigger, add one immutable row and default it to `NOT_ADOPTED` unless an
explicit Owner decision says otherwise. No directory-by-directory backfill is
required during normal maintenance.

`HISTORICAL_BACKFILL = MATERIAL_SET_COMPLETE / BOUNDED_TRIGGER_QUEUE_REMAINS`
