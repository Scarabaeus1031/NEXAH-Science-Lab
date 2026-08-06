# Scientific Roles

Status: `PREPARED — ALL ASSIGNMENTS UNASSIGNED`

## Authority rule

Authorization of Phase B documentation does not assign a scientific,
custodial, review or execution role.

No person, repository, module or software system acquires a role by authorship,
proximity, prior work or technical capability.

## Role register

| Role | Assignment | Responsibility | Explicit exclusions | Required evidence before appointment |
|---|---|---|---|---|
| Scientific Owner | `UNASSIGNED` | accountable ownership of the bounded inverse-problems question, scientific scope and interpretation boundary | source custody, implementation self-validation, automatic execution authority, novelty decision | named Human acceptance; relevant scientific competence; conflict declaration |
| Freeze Owner | `UNASSIGNED` | custody of the immutable source, protocol and manifest freeze transaction | scientific-result determination, source modification after freeze, execution authority | custody location; integrity procedure; rollback and supersession rule |
| Input Custodian | `UNASSIGNED` | preserve canonical CSV bytes, dictionary, export evidence and access record | changing source values, thresholds or scientific definitions | accepted custody procedure; exact file and hash responsibility |
| Protocol Reviewer | `UNASSIGNED` | independent pre-execution review of definitions, completeness, ordinary scientific language and implementability | writing the originating execution implementation; approving own unresolved definitions | independence declaration; completed protocol-review record |
| Validation Reviewer | `UNASSIGNED` | independently validate a later implementation, run evidence and terminal decision | modifying inputs, implementation, thresholds or outputs; acting as execution author | independence from implementation; validation competence; signed gate record |
| Independent Replay Team | `UNASSIGNED` | create an independent implementation and return a frozen replay package | access to originating code, outputs or expected results; authority to alter protocol | documented independence; environment and dependency disclosure; conflict review |

## Supporting roles not assigned by this package

| Supporting role | Assignment | Purpose |
|---|---|---|
| Human Owner Decision | `UNASSIGNED FOR SOURCE FREEZE` | adopt, reject or return the future freeze package |
| Export Operator | `UNASSIGNED` | perform the separately authorized deterministic CSV export |
| Export Reviewer | `UNASSIGNED` | verify source-to-CSV fidelity and serialization independently |
| Execution Owner | `UNASSIGNED` | conduct one later authorized originating run |
| Comparison Reviewer | `UNASSIGNED` | compare frozen originating and replay results |
| External Release Authority | `UNASSIGNED` | decide whether a complete package may leave the repository boundary |

## Independence constraints

- The Protocol Reviewer shall not author the originating execution
  implementation.
- The Validation Reviewer shall not author the implementation being validated.
- The Independent Replay Team shall not inspect originating code or results
  before its result freeze.
- The Comparison Reviewer shall not reveal either result before both packages
  are frozen.
- The Scientific Owner may not convert architectural authority into scientific
  validity.
- The Freeze Owner and Input Custodian may overlap only through an explicit
  owner decision; overlap must be recorded.
- The same Human may hold more than one non-independent role only where the
  checklist permits it and the overlap is disclosed.

## Appointment record template

Every appointment must record:

```text
ROLE
PERSON OR TEAM
MANDATE
SCOPE
EXCLUSIONS
DEPENDENCIES
CONFLICTS
INDEPENDENCE STATUS
ACCEPTANCE
DATE
SIGNATURE OR OWNER RECORD
```

Until that record exists, the assignment remains `UNASSIGNED`.
