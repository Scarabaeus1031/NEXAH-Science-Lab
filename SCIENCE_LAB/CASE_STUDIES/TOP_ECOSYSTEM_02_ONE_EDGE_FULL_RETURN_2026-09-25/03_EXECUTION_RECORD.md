# 03 — Execution Record

## Environment

The successful replay used an existing local scientific Python environment:

```text
Python: /opt/anaconda3/bin/python3
NumPy: 1.26.4
scikit-learn: 1.5.1
```

System Python and the Codex bundled document runtime stopped before calculation
because required scientific dependencies were absent. No packages were
installed and no scientific result was emitted by those failed attempts.

## T1 — Science Lab package manifest

Command:

```text
shasum -a 256 -c SHA256_MANIFEST.txt
```

Result:

```text
14 entries: OK
06_PHASE_B_IEEE_RESULTS.md: FAILED
```

Manifest expectation:

```text
c8025beb383c110abdb4990bb43ea693b9180ed4b4fe69f9f5faf2aa525c5246
```

Observed current file:

```text
591a0c767f81002763267c8143a0d12614acf3f917cf742f29b4b06925a418e4
```

Git history identifies the later tracked change as `Record AXIS08 IEEE Core
integration` (`45ea0ed`). The selected Science Lab path itself has no local
uncommitted modification. Classification: `STALE_PACKAGE_MANIFEST`, not silent
source mutation.

## T2 — Core evidence-bundle verification

Result:

```text
status: PASS
decision: IEEE_PROJECTION_FIDELITY_CONFIRMED
classification: COMPUTATION_RESULT_ONLY
claim_ceiling: BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT
view_adapter_status: NOT_IMPLEMENTED_GOVERNANCE_GATED
```

All three bundle payloads matched their declared byte counts and SHA-256
digests. Human adoption and continuation remain explicitly Human-owned.

## T3 — Core canonical replay

Result:

```text
status: PASS
decision: IEEE_PROJECTION_FIDELITY_CONFIRMED
gate_passed: true
```

The replay retained the exact protocol and input hashes:

```text
protocol: b51144d61ddaa4954a24de4e215221498bcfc901d3152acb31d3114598629db1
case manifest: a6df815729abdb49c3d3f0e09f6fb786395523beb402b1582095436d41bcb566
development frames: 14744e193321398536529cb81c307968ab363510493265ff1e1cf1340f1224d1
evaluation frames: 0b0f8771eb775bfbb09f3e4fa92c860c30a9422f578ddcd40c23846d6410386b
```

## T4 — Canonical/replay byte and field comparison

```text
canonical SHA-256: b816d68088cc8aab17475fe2a7dd69acb77bda795104180bc0e885863e3f23e7
replay SHA-256:    40753e18b8851600e9a17d129002ec9bc6f955abb34d6ebaf06114861f2a6564
byte identity: FAIL
field differences: 128
numeric field differences: 128
non-numeric field differences: 0
maximum absolute numeric difference: 1.3030919621407877e-13
declared tolerance: 1e-12
```

All observed differences are numerical and below the declared tolerance.
Categorical status, decision, gate, protocol hash, input hashes, schema, and
claim semantics are retained.

Classification:

```text
BYTE_RETURN = FAIL_TYPED
NUMERIC_RETURN = PASS_WITHIN_DECLARED_TOLERANCE
SEMANTIC_RETURN = PASS_BOUNDED
```

## T5 — Mission Control source receipt

Mission Control row `AXIS08_QRR_01` resolves to the authoritative current
Science Lab result.

```text
registered SHA-256: 591a0c767f81002763267c8143a0d12614acf3f917cf742f29b4b06925a418e4
observed SHA-256:   591a0c767f81002763267c8143a0d12614acf3f917cf742f29b4b06925a418e4
match: true
```

The receipt correctly retains Science Lab as authority and the bounded claim
summary. The row does not independently bind the Core artifact or evidence
bundle hashes. Relevant Mission Control control files have pre-existing local
uncommitted changes, so this is a current local receipt, not a clean-commit
attestation.
