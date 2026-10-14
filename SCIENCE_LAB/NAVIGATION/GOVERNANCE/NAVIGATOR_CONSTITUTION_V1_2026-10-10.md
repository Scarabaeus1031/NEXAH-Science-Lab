# Science Lab Navigator Constitutional Charter V1

Version: `1.1.0`  
Adopted: `2026-10-10`  
Status: `HUMAN_OWNER_ADOPTED / SUBORDINATE TO LAB CONSTITUTION / INTERNAL / NOT PUBLIC`

## 1. Constitutional role

The Science Navigator is the NEXAH Science Lab's canonical **source and
relation graph** for governed research objects. It records identity,
provenance, typed relations, evidence state, claim boundaries and navigable
returns to owning sources.

It is not a source warehouse, scientific authority, task queue, publication
engine or substitute for Mission Control. Original books, papers, studies,
code, HTML instruments, images and 3D assets remain in their owning
repositories.

## 2. Authority chain

```text
HUMAN OWNER
  -> MISSION CONTROL: currentness, priority, activation, lifecycle, release
  -> LAB REGISTER: study identity, lifecycle and disposition
  -> SCIENCE NAVIGATOR: object identity, provenance, relation, evidence boundary
  -> SOURCE REPOSITORIES: controlling content, implementation and evidence
```

Mission Control controls the Navigator's operational status and admission
gates. It does not rewrite scientific findings. The Navigator projects source
authority; it never acquires that authority by linking a record.

### 2.1 Lab Register integration

`SCIENCE_LAB/LAB_REGISTER.md` remains the canonical maintained register for
Science Lab study identity, lifecycle and disposition. The Navigator may
publish a generated, read-only register lens for search, orientation and
return to primary records. It may not create, rename, activate, close or
promote a study through that lens.

## 3. Single-graph rule

1. The validated internal registry manifest is the canonical base graph.
2. Separately admitted overlays may extend the composed internal view.
3. Source-bound lenses may connect and interpret existing sources without
   changing canonical entity, relation or Family counts.
4. Mission Control receives a generated control projection. It must not
   maintain a competing scientific graph.
5. The Mission Control Source Field remains the broad custody and discovery
   catalog. An item may be discoverable there without being admitted to the
   Source Graph.

## 4. Identity and non-duplication

Before a new book, paper, application, instrument, visual family, research
package or term is created, the operator must search the Source Graph and the
Mission Control Source Field.

A new node is permitted only when no existing stable identity can carry the
object. New representation, version, view, chapter or application roles should
normally attach to an existing object through a typed relation.

Path, filename, title, visual resemblance and shared vocabulary are discovery
signals. None alone establishes identity.

## 5. Minimum node contract

Every admitted object must expose:

- stable ID and human title;
- object type and owning repository;
- canonical path and source state;
- provenance receipt or declared absence;
- lifecycle and visibility;
- evidence state;
- authority or controlling record;
- Functional Family and typed-field placement where applicable;
- claim ceiling and explicit nonclaims;
- relation to predecessors, variants or collections where applicable.

## 6. Minimum relation contract

Every edge must state:

- source and target IDs;
- relation type and status;
- evidence or provenance basis;
- what the relation preserves;
- what it does not imply;
- whether it is exact, empirical, methodological, historical, negative,
  provisional or open.

Relation does not create identity. A connection cannot transfer evidence
strength, maturity, authority, activation or publication state.

## 7. Required working cycle

```text
SEARCH -> MATCH -> BIND -> BUILD -> RETURN -> GOVERN
```

- **SEARCH:** inspect the Source Graph, Source Field and current Mission
  Control projection.
- **MATCH:** reuse an existing identity or document why a new one is needed.
- **BIND:** add provenance, typed fields, relations and boundaries before or
  with the work.
- **BUILD:** create the bounded artifact in its owning repository.
- **RETURN:** return results, nulls, negatives, failures and changed hashes to
  the graph.
- **GOVERN:** refresh the Mission Control projection and obtain any required
  lifecycle, activation or release decision.

## 8. Fail-closed rules

- Missing authority means no activation.
- Missing source means provenance-only or unresolved, never verified.
- Missing relation boundary means the edge is invalid.
- Missing public allowlist means internal-only.
- A changed hash requires graph reconciliation.
- An unresolved duplicate blocks admission of the new identity.
- A negative or null result remains visible and cannot be deleted by a later
  attractive representation.

## 9. Change classes

The following require Human Owner governance through Mission Control:

- canonical node or relation admission;
- new Functional Family or normative vocabulary;
- activation or reopening of research;
- publication or external release;
- destructive merge, deletion or identity replacement;
- change to this Constitution.

Source-bound lens maintenance, hash repair, archaeology, alias consolidation
and generated projection refresh are permitted when they change no authority,
claim, lifecycle or public state.

## 10. Relationship to existing constitutions

This Charter specializes, and does not replace, the owner-adopted Science Lab
Constitution or the Mission Control Control Desk Constitution. The Navigator
is a Science Lab instrument. Scientific WIP, research admission and run
authority remain governed by the Lab Constitution.
Portfolio priority, currentness and release remain governed by Mission Control.

## 11. Machine-readable conclusion

```text
NAVIGATOR_CONSTITUTION_VERSION = 1.1.0
PARENT_CONSTITUTION = SCIENCE_LAB_CONSTITUTION_V1.1.0
OWNING_HOME = SCIENCE_LAB/NAVIGATION
CANONICAL_ROLE = SOURCE_AND_RELATION_GRAPH
SOURCE_WAREHOUSE = NO
MISSION_CONTROL_GOVERNS_CURRENTNESS = YES
SOURCE_REPOSITORIES_RETAIN_AUTHORITY = YES
LAB_REGISTER_RETAINS_STUDY_LIFECYCLE_AUTHORITY = YES
LAB_REGISTER_LENS = READ_ONLY_GENERATED
PREBUILD_SEARCH_REQUIRED = YES
DUPLICATE_IDENTITY_FAILS_CLOSED = YES
RELATION_REQUIRES_NONIMPLICATION = YES
AUTOMATIC_CLAIM_PROMOTION = NO
AUTOMATIC_PUBLICATION = NO
```
