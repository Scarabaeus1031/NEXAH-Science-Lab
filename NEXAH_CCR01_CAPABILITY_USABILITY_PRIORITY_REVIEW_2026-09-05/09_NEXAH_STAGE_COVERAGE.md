# NEXAH Stage Coverage

## Compressed workflow

```text
1. RECEIVE  — accept views, sources or records
2. ORIENT   — declare frame, cut, aperture and relation
3. COMPARE  — classify retained, lost, added and unresolved
4. PRESERVE — retain residual, provenance and uncertainty
5. DECIDE   — present a bounded result to Human Authority
```

## Coverage map

| Stage | Supporting capability families | Coverage | What actually works | Primary weakness |
|---|---|---|---|---|
| RECEIVE | CAP-01, 07, 08, 09, 12, 13, 16, 17 | MODERATE | Structured records, graph/IEEE inputs, Human text/material fields, sealed fixtures and lab packages can be received | No general multi-format intake, upload or common schema across public and scientific paths |
| ORIENT | CAP-01, 05, 06, 07, 12, 13, 22 | STRONG | Frames, purposes, scopes, boundaries, perspectives, uncertainty and Human confirmation are well documented and partly executable | Many advanced terms still depend on expert interpretation; public sessions are largely Human-authored |
| COMPARE | CAP-02, 03, 08, 09, 10, 15, 16, 18 | MODERATE | A2/THE EYE sealed comparison, network comparisons, benchmark probes and contract validation work in bounded scopes | No public general comparator; ILAU is not a generic automatic classifier for arbitrary materials |
| PRESERVE | CAP-03, 04, 05, 10, 15, 16, 17, 21 | STRONG | Hashes, immutable artifacts, manifests, residuals, unknowns, receipts, claim ceilings and STOP states are repeatedly preserved | Cross-repository lineage and durable public user records remain fragmented or absent |
| DECIDE | CAP-05, 12, 13, 15, 17, 22 | MODERATE | Human confirmation, Rest, STOP and bounded final decisions are visible | Actionability is inconsistent; many outputs need Owner/Codex interpretation and no single result-to-next-action route exists |

## Capability-to-stage summary

| Capability | RECEIVE | ORIENT | COMPARE | PRESERVE | DECIDE |
|---|---|---|---|---|---|
| Multi-view intake and frame declaration | primary | primary | supporting | supporting | supporting |
| ILAU sealed comparison | input | supporting | primary | primary | supporting |
| Residual and ReturnTest | input | supporting | primary | primary | supporting |
| Provenance and manifest verification | supporting | — | supporting | primary | supporting |
| Claim Ceiling and Human Authority | — | primary | supporting | primary | primary |
| OLS 1.0 | supporting | primary | supporting | supporting | supporting |
| Kernel and source adapters | primary | supporting | primary | primary | supporting |
| Network Orientation | primary | primary | primary | primary | supporting |
| IEEE benchmark orientation | primary | primary | primary | primary | supporting |
| ORION certified structural chain | input | primary | primary | primary | supporting |
| ORION historical Runtime/Gateway | primary | supporting | supporting | supporting | supporting |
| NEXAHEDRON Workspace | primary | primary | supporting | session-local | primary |
| Curated reference cases | supporting | primary | editorial | supporting | primary |
| Public Library/Living Atlas | supporting | primary | editorial | provenance | supporting |
| THE EYE result projection | input | supporting | primary | primary | primary |
| NRRC candidate validation | primary | supporting | validation | primary | supporting |
| Science Lab execution governance | primary | primary | primary | primary | primary |
| HTML orientation instruments | input | primary | illustrative | partial | weak |
| Rödelheim/visual research | input | primary | illustrative | partial | weak |
| Builder Lab prototypes | input | supporting | prototype | weak | weak |
| Archive and genealogy | primary | supporting | supporting | primary | supporting |
| Orientation Translation/report synthesis | primary | primary | primary | primary | primary |
| Reproducible GLB builders | primary | supporting | structural parity | primary | weak |

## Empty or weak stages

No stage is completely empty. Three weak links matter:

1. **RECEIVE lacks a common public intake contract.** A user can type into NEXAHEDRON, but arbitrary sources cannot be safely bound to Kernel, NRRC, ORION or THE EYE.
2. **COMPARE is not publicly exposed.** The strongest comparator is sealed and internally integrated, while public NEXAHEDRON presently routes to Human work and reference cases.
3. **DECIDE is Human-correct but operationally thin.** STOP and Rest are clear, but results do not consistently state the next bounded action or route to it.

The central architectural residual is therefore not a missing idea. It is a missing governed connection between RECEIVE, COMPARE and a Human-readable DECIDE surface.

