# 04 — I-L-A-U and Return

## Aggregate I-L-A-U account

### I — retained

- the declared Science Lab question and bounded result;
- IEEE-9 development versus IEEE-14 evaluation without refit;
- exact quotient-plus-residual reconstruction within tolerance;
- measurable quotient-only information loss;
- PCA7 outperforming quotient-only for the tested compression comparison;
- protocol identity and source-frame hashes;
- negative claim boundaries;
- Science Lab result authority and Human decision authority.

### L — lost

- the Core bundle does not contain the complete Science Lab narrative and
  Phase-A genealogy;
- Mission Control does not hash-bind the Core implementation or evidence
  bundle in its AXIS08 controlling-source row;
- no Human-view, ORION-report, NEXAHEDRON Compare, or public Experience record
  exists for this chain;
- byte-identical replay is lost across the observed numerical environment.

### A — introduced

- Core adds typed contracts, canonical computation packaging, a verifier, and
  an explicit evidence-bundle schema;
- Mission Control adds currentness, routing, and portfolio summary language;
- this TOP execution adds the first explicit per-edge I-L-A-U and Return ledger
  for this artifact lineage.

### U — unresolved

- independent external reproduction;
- a platform-independent byte-canonical numerical representation;
- a hash-bound Core-to-Mission-Control edge receipt;
- Human-view usefulness, because its adapter remains governance-gated;
- generalization beyond this one lineage.

## Typed residuals

| ID | Residual | Type | Effect |
|---|---|---|---|
| R1 | Science Lab package manifest retains the pre-Core-integration hash for the result document | provenance/currentness | local package manifest fails 1/15 while Mission Control has the current hash |
| R2 | canonical versus replay JSON differs in 128 numerical fields, max `1.3031e-13` | numerical/platform | byte return fails; tolerance-bound semantic result remains unchanged |
| R3 | Mission Control binds the Science result but not the Core artifact hashes in the controlling-source row | edge provenance | Core integration is semantically registered, not fully artifact-bound |
| R4 | relevant Mission Control control files have local uncommitted changes | repository state | receipt is valid locally but not a clean-commit attestation |
| R5 | Human/public adapter is explicitly not implemented | governance/product | no Human-view or public-effect claim may be made |

## Return matrix

| Return dimension | Result | Basis |
|---|---|---|
| source receipt | `PASS` | Mission Control expected and observed Science result hashes match |
| bundle integrity | `PASS` | all bound Core evidence payloads verify |
| replay decision | `PASS` | status, decision, gate, protocol, and input bindings retained |
| byte identity | `FAIL_TYPED` | canonical and replay SHA-256 differ |
| numerical tolerance | `PASS` | maximum drift below `1e-12` |
| semantic return | `PASS_BOUNDED` | scientific conclusion and claim limits unchanged |
| authority return | `PASS_BOUNDED` | Science, Core, Mission Control, and Human roles remain distinct |
| ecosystem integration | `PARTIAL` | three roles tested; no shared edge receipt or Human/public adapter |

## Interpretation

This execution demonstrates why the NEXAH return must remain plural:

```text
byte return ≠ numerical return ≠ semantic return ≠ authority return
```

The lineage succeeds scientifically within its declared tolerance and claim
ceiling while retaining two concrete provenance gaps. Reporting a single
undifferentiated `PASS` would erase those gaps; reporting a single
undifferentiated `FAIL` would erase the retained semantic result.
