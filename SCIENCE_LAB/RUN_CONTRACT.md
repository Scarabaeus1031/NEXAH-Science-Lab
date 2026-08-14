# Science Lab Run Contract

Status: `V1 REQUIRED FOR RUNNABLE CLAIMS`

A Study is not advertised as runnable until every required field below is
present in its owning package or an attached run record.

## Required fields

```yaml
RECORD_ID:
PURPOSE: VERIFY_EXISTING | REPLAY | REPLICATE
SOURCE_REPOSITORY:
SOURCE_REVISION:
ENTRYPOINT:
WORKING_DIRECTORY:
ENVIRONMENT_SPEC:
RUNTIME_VERSION:
DEPENDENCIES:
INPUTS:
DATA_ACCESS:
LICENSE_AND_PRIVACY:
COMMAND:
EXPECTED_OUTPUTS:
EXPECTED_HASHES_OR_TOLERANCES:
RESOURCE_BOUNDS:
NETWORK_REQUIRED:
FILESYSTEM_SIDE_EFFECTS:
FAILURE_SEMANTICS:
SCIENTIFIC_CLAIM_BOUNDARY:
RESULT_REPORT:
ISSUE_ROUTE:
OWNER:
LAST_VERIFIED:
```

Use `NOT_APPLICABLE` explicitly. Do not omit a field.

## Run modes

- `VERIFY_EXISTING` checks hashes, schemas or already produced evidence and
  must not regenerate scientific results.
- `REPLAY` reruns the frozen implementation under the declared environment.
- `REPLICATE` uses an independent implementation or external task owner and
  must distinguish replication from replay.

## Fail-closed rules

- A runtime mismatch stops the run before scientific interpretation.
- Missing private/external data yields `DATA_UNAVAILABLE`, not a failed result.
- Hash divergence is preserved and reported; outputs are never silently
  repaired.
- A command that mutates tracked evidence must not be advertised as a verifier.
- Passing software tests does not validate the scientific claim.
- A successful replay does not establish cross-system or physical validity.

## Current Structure Freeze

This contract is being established during `STRUCTURE_FREEZE`. It authorizes no
current command. The first runnable candidate must receive a separate owner
selection after the Lab is reopened.
