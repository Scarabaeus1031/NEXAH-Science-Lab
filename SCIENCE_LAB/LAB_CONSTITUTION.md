# NEXAH Science Lab Constitution V1

Version: `1.0.0`

Adoption date: `2026-08-14`

Status: `OWNER_ADOPTED`

Operating state at adoption: `STRUCTURE_FREEZE`

## 1. Purpose

The NEXAH Science Lab exists to turn bounded questions into inspectable,
reproducible and honestly classified research records.

The Lab is not a folder collection, an idea archive, an architecture generator,
a claim amplifier or an automatic publication pipeline. File presence does not
create a Lab, evidence, adoption or authority.

The controlling grammar is:

```text
QUESTION
→ ADMISSION
→ DECLARED OBJECT AND METHOD
→ FREEZE OR FORMAL DESIGN
→ EXECUTION / DERIVATION
→ RESULT
→ AUDIT AND REPLAY WHERE REQUIRED
→ INTEGRATION
→ LABREPORT
→ CLOSED / STOP / EXPLICIT NEXT QUESTION
```

## 2. Authority and roles

### Human Owner

The Human Owner alone may:

- admit or reject a maintained research question;
- set Lab priority and reopen the Lab after a structure freeze;
- authorize execution, external publication, destructive disposition or
  scientific adoption;
- accept a final disposition as the Lab's maintained record;
- appoint another Human owner or qualified domain reviewer.

### Science Lab Research Director

The Research Director may:

- maintain the Lab Register, Active Work surface and queues;
- enforce WIP, admission, run, audit and closure gates;
- perform read-only inventory, integrity and reproducibility checks;
- prepare bounded commits and owner decisions;
- stop work that lacks authority, scope, environment or evidence boundaries.

The Research Director does not autonomously create scientific truth, admit a
question, promote a claim, authorize an experiment or transfer authority.

### Study Owner

Every admitted Lab or Study has one named Study Owner. In the current solo
operation the Human Owner may also be the Study Owner. The role must still be
recorded explicitly so it can later be transferred without ambiguity.

### Independent Reviewer

A reviewer tests protocol, evidence, implementation, interpretation and claim
boundaries. A reviewer may recommend a disposition but does not become the
scientific owner by performing the review.

### External Contributor or Replicator

An external contributor receives only the authority stated in a specific Run
Contract or contribution task. A reproduction, issue or pull request does not
silently change the Lab's maintained scientific status.

## 3. One maintained navigation surface

`LAB_REGISTER.md` is the single maintained question→Lab/Study→report pointer.
It contains identity, owner, state, canonical home, evidence endpoint and next
permitted action. It copies no scientific result beyond a bounded disposition.

There is no separate universal Question registry, Lab catalog or automatic
historical import in V1. Existing research indexes and package reports retain
their own scope and authority.

## 4. Admission gate

No new top-level research package or active Lab may be created until one intake
record is accepted by the Human Owner. Admission requires:

1. one bounded and falsifiable or formally decidable question;
2. one Study Owner;
3. declared scientific object, inputs and information boundary;
4. method class: empirical, theoretical, infrastructure or design feasibility;
5. baseline/comparator and controls where applicable;
6. expected result vocabulary including negative, invalid and uninformative
   outcomes;
7. data, privacy, license and external-dependency disposition;
8. minimal reproducibility class and intended Run Contract;
9. STOP condition;
10. canonical home and reason a new package is necessary;
11. required reviewer or audit path;
12. next permitted action.

An idea, image, chat, notebook, draft or repeated motif fails admission unless
these fields are accepted.

## 5. Work-in-progress limit

The Lab permits:

- at most **one `ACTIVE` research cycle**;
- at most **two admitted `OPEN` cycles** awaiting activation;
- unlimited `CLOSED`, `SUPERSEDED`, `BLOCKED` and provenance records, provided
  they create no active maintenance burden.

Structure, storage or governance maintenance does not consume the scientific
ACTIVE slot, but it must be authorized in the private Research Director Desk
and cannot be used to open research indirectly. The public repository records
only the resulting bounded status or governance change.

When the WIP limit is full, new ideas go to Mission Control/Incoming or remain
unadmitted. They do not receive a new Lab folder.

## 6. Lifecycle and status

The common Lab statuses are:

`OPEN`, `ACTIVE`, `BLOCKED`, `AWAITING_AUDIT`, `AWAITING_INTEGRATION`,
`READY_FOR_LABREPORT`, `CLOSED`, `SUPERSEDED`.

Existing native statuses such as `FROZEN`, `STOP_AND_RETAIN` or
`SCIENCE_LAB_NOT_ADOPTED` remain unchanged. The Lab Register may map them to a
common operational status for navigation, but the mapping never rewrites the
source status.

`INVALID_EXPERIMENT`, `VALIDATED_NEGATIVE_RESULT`,
`UNINFORMATIVE_BENCHMARK`, `INFORMATION_LOST`, `UNDEFINED_CONTRACT` and other
result classes defined by the Science Lab Protocol remain distinct.

## 7. Reproducibility classes

Every admitted record carries one class:

- `R0_DOCUMENTED`: readable scope/report; no runnable claim.
- `R1_VERIFY_EXISTING`: tracked evidence can be hash-verified without rerunning
  science.
- `R2_LOCAL_REPLAY`: exact commands, environment and local data permit replay.
- `R3_PORTABLE_REPLAY`: a clean checkout plus declared dependencies permits an
  independent replay.
- `R4_EXTERNAL_REPLICATION`: an independent implementation or external task
  owner has reproduced the bounded result.

Higher classes imply the lower documentation requirements but do not strengthen
the scientific claim. A failed exact replay is preserved as evidence.

## 8. Run Contract

No command is presented as a Lab run unless the Study provides the fields in
`RUN_CONTRACT.md`: source revision, environment, data access, command,
expected outputs, hashes/tolerances, resource bounds, side effects, failure
semantics and claim boundary.

If any required field is absent, the Study is `R0_DOCUMENTED` or
`R1_VERIFY_EXISTING`, not runnable.

## 9. Data and privacy

Git stores source, protocols, small evidence, manifests and reports. Large raw
or generated data remain in declared external artifacts.

No local data copy may be deleted until:

1. an authorized durable destination exists;
2. upload is complete;
3. the remote object hash matches;
4. retrieval is tested;
5. clean reconstruction is verified;
6. the Human Owner separately authorizes local disposition.

Private, licensed, personal or sensitive data require an explicit access and
publication boundary before admission.

## 10. Reports and closure

Existing historical report forms remain valid and are not rewritten merely to
fit V1. The canonical Labreport schema is mandatory for:

- cycles admitted after this Constitution takes effect; and
- historical cycles explicitly selected for retrospective Lab closure.

Every closure must update the Lab Register and follow `LAB_CLOSE_PROTOCOL.md`.
A result without audit/integration is not `CLOSED`. A report without evidence
does not become scientific authority through formatting.

## 11. Relationship to other Desks and authorities

- **Mission Control** selects priorities, records owner decisions and receives
  closeout. It does not determine scientific truth.
- **The Eye** maintains ecosystem-wide strategic orientation, not Lab evidence.
- **Canonical NEXAH and ORION** retain their own architecture and implementation
  authority. Lab evidence does not modify them automatically.
- **Publishing** receives only owner-approved, claim-bounded release objects.
- **Outreach/Experience** presents approved material and cannot upgrade its
  scientific status.

## 12. Directory policy

Existing package paths remain stable until a separate path-impact audit proves
movement safe. New top-level folders require an admitted Register record and a
documented reason not to use an existing canonical home.

The root `README.md` is the public entrance, not a task list. Public readers
move from the README through the Lab Register to one owning package. Private
work begins in `00_LAB_RESEARCH_DIRECTOR_DESK/` in NEXAH Mission Control.

## 13. Structure Freeze

At adoption, all scientific work is paused. During `STRUCTURE_FREEZE`:

- no experiment or scientific replay is executed;
- no new question or Lab is admitted;
- no existing research line is activated;
- no evidence is repaired or reinterpreted;
- only bounded constitution, navigation, reproducibility and repository-control
  work is permitted.

Exit requires the private Research Director gate, a separate Human Owner reopen
decision and a synchronized public status update. Passing an internal gate does
not automatically activate any Study.

## 14. Amendment rule

Constitutional amendments require:

1. an explicit problem statement;
2. exact proposed changes;
3. compatibility review against NEXAH authority boundaries;
4. Human Owner adoption;
5. a version increment and immutable decision record.

Operational details may be refined in protocols without changing ownership,
WIP, admission, promotion or closure authority.

## 15. Machine-readable conclusion

```text
SCIENCE_LAB_CONSTITUTION_VERSION = 1.0.0
OWNER_ADOPTED = YES
LAB_OPERATIONS_STATE = STRUCTURE_FREEZE
ACTIVE_RESEARCH_CYCLES_ALLOWED_NOW = 0
NORMAL_WIP_LIMIT_ACTIVE = 1
NORMAL_WIP_LIMIT_OPEN = 2
CENTRAL_NAVIGATOR = SCIENCE_LAB/LAB_REGISTER.md
PUBLIC_ENTRY = README.md
PRIVATE_BACKSTAGE = NEXAH_MISSION_CONTROL/00_LAB_RESEARCH_DIRECTOR_DESK
AUTOMATIC_HISTORICAL_IMPORT = NO
AUTOMATIC_CLAIM_PROMOTION = NO
EXTERNAL_RUN_REQUIRES_RUN_CONTRACT = YES
REOPEN_REQUIRES_SEPARATE_OWNER_DECISION = YES
```
