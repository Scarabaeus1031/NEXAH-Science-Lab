# A0 Four-Number Projection / Null Model — Preregistration Candidate

Date: `2026-10-13`  
Status: `PREREGISTERED CANDIDATE / NOT EXECUTED / NOT AUTHORIZED`  
Lab state: `STRUCTURE_FREEZE`  
Identity effect: `REUSES A0 + MOD:NUMBER_VIEW_SUITE / NO NEW STUDY / NO NEW NAVIGATOR IDENTITY / NO NEW RELATION`

## 1. Bounded question

For the Human-Owner-selected quartet

```text
T = {1087, 7801, 2929, 12321},
```

does any arithmetic coherence remain after the already visible decimal
representation structure is held fixed, and does the same conclusion survive
a second null model that instead holds scale and factor-count profile fixed?

This is a post-hoc calibration question. It is not a discovery test for a
natural quartet and cannot establish NCS, CRT/QRT, Möbius, sphere or physical
resonance mechanisms.

## 2. Frozen exact input facts

| `n` | factorization | `phi(n)` | decimal reversal | `n mod 20` |
|---:|---|---:|---:|---:|
| 1087 | prime | 1086 | 7801 | 7 |
| 7801 | `29 * 269` | 7504 | 1087 | 1 |
| 2929 | `29 * 101` | 2800 | 2929 | 9 |
| 12321 | `3^2 * 37^2 = 111^2` | 7992 | 12321 | 1 |

The quartet therefore has a complete decimal-reversal orbit signature:

```text
one 2-cycle: 1087 <-> 7801
two fixed points: 2929 and 12321
```

The nontrivial pair additionally has the exact carry-free decimal relation:

```text
  1087
+ 7801
------
  8888

aligned digit sums = (1+7, 0+8, 8+0, 7+1) = (8,8,8,8)
```

The orbit signature and `8888` relation are known before execution and are
not scored as new evidence. The runner asserts them as representation
controls, then excludes them from the four-block coherence statistic.

## 3. Frozen arithmetic channels

Four blocks receive equal weight:

1. **Totient:** `phi(n)/n`;
2. **factor profile:** `omega(n)` and `Omega(n)`;
3. **CRT:** cyclic residue distances for the pre-existing moduli
   `7, 11, 13, 19`;
4. **QRT elevator:** the remainder `r` in `n=20q+r`, `0<=r<20`.

For every unordered pair, each block produces a squared normalized distance.
The pair score is the mean of the four block distances; the quartet score is
the mean over its six unordered pairs. Lower means more coherent. No weights
may be fitted after seeing the result.

The CRT product is

```text
7 * 11 * 13 * 19 = 19019,
```

which exceeds every target value. The implementation must reconstruct all
four integers exactly from these residues before a result is accepted.

## 4. Declared visual projection

The visualization is derived from fixed channels and is not the primary test
statistic:

```text
theta(n) = 2*pi*(n mod 360)/360
radius(n) = phi(n)/n
z(n) = 2*(n mod 20)/19 - 1
x(n) = radius(n)*cos(theta(n))
y(n) = radius(n)*sin(theta(n))

R = (n mod 7)/6
G = (n mod 11)/10
B = (n mod 13)/12
outline = (n mod 19)/18
```

This supplies one reproducible ring/sphere-compatible view. It does not claim
that a sphere, Möbius strip or RGB assignment is intrinsic to the integers.

## 5. Two frozen null models

### N1 — representation matched

Each null quartet contains:

- one distinct odd four-digit reversal pair;
- one distinct odd four-digit palindrome;
- one distinct odd five-digit palindrome in `[10000,19999]`.

This preserves the target's visible decimal-orbit structure while scoring
only the four independent arithmetic blocks.

### N2 — factor and scale matched

For each target slot, draw an odd replacement with:

- the same decimal digit length;
- the same `omega` and `Omega`;
- a value within `+/-20%` of the target;
- none of the four target values.

This preserves scale and factor-count profile but does not enforce reversal
closure.

Both nulls use `100000` deterministic draws from `xorshift32` with unsigned
seed `10547280`. Fewer than `10000` unique quartets under either null yields
`UNINFORMATIVE_NULL_POOL`.

## 6. Frozen decisions

Primary support requires a lower-tail empirical `p<=0.01` under **both** N1
and N2. Robust support additionally requires `p<=0.05` under both nulls after
separately removing each of the four score blocks.

Permitted results are:

- `ROBUST_BOTH_NULLS_PASS`;
- `PRIMARY_BOTH_NULLS_PASS_NOT_ROBUST`;
- `REPRESENTATION_MATCHED_ONLY`;
- `FACTOR_SCALE_MATCHED_ONLY`;
- `NO_UNUSUAL_COHERENCE`;
- `UNINFORMATIVE_NULL_POOL`;
- `INVALID_IMPLEMENTATION`.

No visual appearance is a pass condition. A low empirical p-value means only
"unusual under this declared null" and not "natural law" or "mechanism".

## 7. Run contract candidate

```yaml
RECORD_ID: A0_FOUR_NUMBER_PROJECTION_NULL_MODEL_001_CANDIDATE
PURPOSE: POST_HOC_CALIBRATION_UNDER_TWO_FROZEN_NULLS
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: bd3277e34c908edf96fe97f542103a2ddb2c9dc4 plus the two hash-bound untracked candidate files below
ENTRYPOINT: A0_BOOK/assets/a0-four-number-projection-null-model.mjs
SPECIFICATION: A0_BOOK/assets/a0-four-number-projection-null-model-spec.json
WORKING_DIRECTORY: RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01
ENVIRONMENT_SPEC: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/a0-four-number-projection-null-model.mjs --verify
EXPECTED_OUTPUTS: stdout-only JSON receipt; no result file
EXPECTED_HASHES_OR_TOLERANCES: source and specification SHA-256 frozen below; exact integer arithmetic; projection-radius tolerance 1e-12
RESOURCE_BOUNDS: under 30 seconds; under 512 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: nonzero exit, failed assertion, inadequate null pool or non-deterministic replay stops interpretation
RESULT_REPORT: NOT_APPLICABLE_UNTIL_SEPARATE_OWNER_AUTHORIZED_SCIENCE_RUN
OWNER: Human Owner
SCIENTIFIC_CLAIM_BOUNDARY: post-hoc calibration of one selected quartet; no natural geometry, NCS mechanism, universal CRT/QRT operator, physical resonance or publication claim
AUTHORIZED_SCIENCE_RUN: false
```

## 8. Governance and source relation

Reused without identity merger:

- A0 Master Protocol and `MOD:NUMBER_VIEW_SUITE`;
- `NN:CRT_QRT_37_CARRIER_LADDER` for the typed `n=20q+r` elevator and the
  existing CRT/QRT non-identity boundary;
- `NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK` as contextual NCS custody only;
- Check 49 for the exact `1087`, `7801` and totient corrections.

The design creates no Navigator node or relation. `2929` is not identified
with the existing `NCS_292` source merely by decimal extension, and `12321` is
not identified with a QRT operator merely because it contains `3`, `37`, or a
palindromic spelling.

## 9. Freeze gate

The source and specification may be completed, syntax-checked and hash-bound
during `STRUCTURE_FREEZE`. The command in the Run Contract must not be executed
as a scientific run until all of the following are present:

1. private Research Director reopen gate;
2. separate explicit Human Owner run authorization;
3. synchronized public Lab-state update;
4. frozen source/spec hashes and runtime;
5. a declared result-return destination.

Current next permitted action: static review and hash lock only.

## 10. Static review and hash lock

No scientific command was executed. Static repository checks only:

```text
Node.js runtime: v24.19.0
node --check a0-four-number-projection-null-model.mjs: PASS
JSON specification parse: PASS

source SHA-256:
8217a6fd9de1769e625b35017e1c5035071c39c1d62c07a980926a5f641f26b3

specification SHA-256:
79016df33226deff0092c26bd712bef4b970ab70b2eea33cc9a6215e669d0371
```

Any change to either file invalidates this preregistration hash lock and must
be recorded before an authorized run.
