# Repository update matrix

An update trigger starts assessment and queueing. It never authorizes a write.

| Repository / authority | Authoritative for | Reads from | May reference | Must not own | Update trigger |
|---|---|---|---|---|---|
| **Science Lab** | Research protocol/results, closure status, negative evidence, immutable report provenance | Its preregistrations, executions and review records | ORION/NEXAH contracts as experimental context; product status only as external fact | Product adoption, ORION certification, NEXAH normative semantics, interface implementation, Human meaning | Labreport closure; correction to closed-report provenance; adopted research finding requiring architecture review |
| **ORION** | Declared ORION objects, Certified Core, ADRs, ownership, release/classification and explicitly adopted profiles | NEXAH/OLS released contracts; Owner decisions; interface records | Research as non-authoritative evidence; Experience constraints | Human meaning/decision, NEXAH/OLS authority, Experience ownership, automatic Research promotion | Owner-adopted change to ORION responsibility/object/profile/release; certified boundary change; interface contract/status change affecting ORION |
| **NEXAH** | Ecosystem constitution, Framework/Orientation Space, OLS normative contracts, Kernel boundary, Library/Atlas ownership relationships | Owner ecosystem decisions; released source/governance records | ORION status and Research evidence with classifications | ORION certification/product ownership, Human meaning/decision, Experience presentation, Research-to-product promotion | Adopted change to normative semantics, Framework boundary, Kernel contract, Library/Atlas ownership or NEXAH-side interface obligation |
| **NEXAHEDRON / Experience** | Presentation, encounter, bounded session flow, explicit confirmation and temporary Human-controlled interaction state | Adopted architecture/status contracts and exact read-only artifacts | ORION/NEXAH results with provenance; inactive/future concepts with labels | Scientific/normative meaning, certification, autonomous decision, source mutation, LUCY authority | Adopted presentation/interaction/session contract change; new authority claim; new formal-system call; reflection/context/persistence change; upstream artifact contract change affecting rendering |
| **Interface records** | Approved cross-boundary schema/authority obligations and implementation status | Explicit Owner decisions and both endpoint contracts | Endpoint release/status evidence | Endpoint internals, product adoption, Human authority | Interface adoption/revision, endpoint contract change, implementation/release evidence |

## When no repository update is required

- A Labreport closes with `NO_ARCHITECTURE_IMPACT`.
- Research produces a candidate, negative result or contradiction that has not
  been adopted.
- An existing status is merely cited accurately.
- A derived visual is refreshed without changing source meaning.
- Human reflection occurs inside an already adopted Experience contract.

## Target-selection rules

### NEXAH

Update NEXAH only when an adopted decision changes NEXAH-owned semantics,
Framework/OLS/Kernel boundaries, Library/Atlas ownership or NEXAH's interface
obligation. ORION experiments and Labreports alone do not trigger a NEXAH
update.

### ORION

Update ORION only when an adopted decision changes ORION-owned objects,
Certified Core, profile set, ownership, release classification or ORION-side
interface obligation. Research results alone do not trigger an ORION update.

### Experience / NEXAHEDRON

Update when an adopted change alters what is rendered, requested, confirmed,
stored or called, or when a public/current document claims authority outside
the presentation/session boundary. LUCY conceptual adoption alone does not
rename existing UI.

## Cross-repository rule

One adopted decision may create several target checks, but should produce one
coherent queue item with a checklist of exact targets. Each repository retains
its own authority and requires its own authorized change/verification. A green
state in one repository cannot mark another repository current.

