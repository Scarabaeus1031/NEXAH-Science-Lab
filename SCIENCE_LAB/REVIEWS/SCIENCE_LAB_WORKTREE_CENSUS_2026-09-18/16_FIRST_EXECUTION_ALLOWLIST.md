# First Execution Allowlist — Pass 2 / Step 6

Status: `PREPARED / NOT EXECUTED`

## Purpose

This document converts the completed `tmp`, loose-root and export
classifications into a narrow first execution boundary. It is deliberately
smaller than the classified corpus: an object is executable only when its
exact path, SHA-256, destination or counterpart, precondition and recovery
method are known.

The machine-readable authority for this step is
[`17_FIRST_EXECUTION_ALLOWLIST.csv`](17_FIRST_EXECUTION_ALLOWLIST.csv).

## Accounting

The three classified sets contain `137` files:

| Source set | Files |
| --- | ---: |
| `tmp` | 105 |
| loose repository root | 20 |
| untracked exports | 12 |
| **Total** | **137** |

The first allowlist contains only `11` files:

| Operation | Files | Readiness |
| --- | ---: | --- |
| verified local duplicate removal | 7 | ready after one final same-hash preflight |
| byte-preserving local archive move | 4 | ready with destination-absence and locator preflight |
| **First allowlist** | **11** | prepared, not executed |

The remaining `126` files are held behind explicit gates below.

## Package A — verified duplicate removal

Seven local files have byte-identical recoverable counterparts:

- one helper script already sealed in Mission Control;
- one normalized framework-freeze image already tracked in Science Lab;
- two outreach images already held by Mission Control;
- three unpacked MIWA release files already tracked individually and inside
  the tracked ZIP.

Execution rule:

1. recompute the source SHA-256;
2. recompute the named counterpart SHA-256;
3. require equality with the allowlist value;
4. remove only the exact source path;
5. record the removal and counterpart in a receipt;
6. verify that no other path changed.

Recovery is by copying the named counterpart back to the original path. No
directory-wide wildcard deletion is permitted.

## Package B — local archive moves

Four files can move within the Science Lab repository without crossing a
repository boundary:

- the August session closure;
- the preliminary translation-audit finding;
- the SVG source and PNG render of the 2026-09-15 status plate.

Execution rule:

1. require the source hash in the allowlist;
2. require that the exact destination path does not exist;
3. create only the named destination directory;
4. move byte-preserving;
5. recompute the destination hash and require equality;
6. add a short locator or receipt in the receiving package;
7. commit this package independently from duplicate removal.

Recovery is a byte-preserving move back to the recorded source path followed
by removal of the locator introduced by the same commit.

## Explicitly blocked packages

| Held set | Files | Gate before execution |
| --- | ---: | --- |
| Mission Control Outreach and Builder source move | 11 | target repository has extensive unrelated local changes; establish an isolated commit boundary and rebind current links atomically |
| root maintenance-report family | 3 | include the tracked Pass 1 report in one later family move and update historical references |
| Mission Control one-shot scripts in `tmp` | 13 | choose exact cutover archive, add script manifest and execute in Mission Control's own commit boundary |
| superseded Mission Control staging material in `tmp` | 29 | generate and review one aggregate comparison receipt against current Mission Control authority |
| Math Asset Matrix provenance in `tmp` | 17 | select retained previews and reconstruct before/after workbook hash chain |
| PDF/render holding area in `tmp` | 46 | owner review and private-custody decision; never publish by default |
| demonstrator and concept-art export adoption | 7 | adopt atomically with runtime, synthesis or case-study source package |
| **Held total** | **126** | **not on the first execution allowlist** |

The target Mission Control repository was observed on branch
`codex/mission-control-status-sync` with unrelated modified and untracked
material. That is a hard reason not to perform the cross-repository source
move in this step.

## Commit boundaries

The first execution, when authorized, should produce two commits:

1. `chore: remove verified local duplicates`
2. `docs: archive dated local review artifacts`

The removal receipt belongs in this census package. The move locators belong
in their receiving packages. A failure in one package must not trigger or
partially apply the other.

## Prevention consequence

After execution, new local objects must enter the delta register before they
can accumulate in the root, `tmp` or `EXPORTS`. This allowlist is a one-time
cleanup control, not a replacement for the continuing intake register.
