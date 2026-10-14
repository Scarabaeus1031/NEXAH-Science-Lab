# A0 Tessarec Consecutive-Cube / Nexus-26 Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / RELATES TO PBM:MOD77 / NO NEW IDENTITY / NO NEW RELATION`

## 1. Bounded question

Can the owner-supplied `Tessarec_Split_Quadriptych` arithmetic be retained as
an exact, typed junction, and does adjoining the value `26^3` give a selective
result rather than a post-hoc numeral match?

The check freezes four questions:

1. Is the `23,24,25` consecutive-cube identity exact?
2. Is `41,616` simultaneously the stated square and triangular number?
3. What exactly changes when `26^3` is added?
4. Is the resulting Mod-77 projector hit unique under local and full-residue
   handle controls?

The labels `Tessarec`, `Nexus`, `Tesla beat`, `gate` and `field energy` are
historical or interpretative labels. They are not premises or pass conditions.

## 2. Exact centered-cube core

For integer `n`,

```text
(n-1)^3 + n^3 + (n+1)^3 = 3n(n^2+2).
```

At `n=24`:

```text
23^3 + 24^3 + 25^3 = 41,616.
```

The proposed factorizations are exact:

```text
41,616 = 204^2
       = T_288 = 288*289/2
       = 2^4 * 3^2 * 17^2
       = (12*17)^2.
```

The identities `17=26-9` and `26=2*13` are also exact. Their symbolic labels
do not add a causal mechanism.

## 3. The 26 extension

Adding the next-but-one cube gives

```text
26^3 = 17,576
41,616 + 26^3 = 59,192.
```

Equivalently, for the frozen center `n=24`, this is the sum of four consecutive
cubes `23^3+24^3+25^3+26^3`. The general closed form is

```text
(n-1)^3+n^3+(n+1)^3+(n+2)^3
= 2(2n+1)(n^2+n+4).
```

At `n=24`:

```text
59,192 = 2^3 * 7^2 * 151.
```

The extension no longer has the two special core types: `59,192` is neither a
square nor a triangular number.

## 4. Exact Mod-77 junction

The strongest reusable bridge to the already governed `PBM:MOD77` comparator
is not visual. It is the exact translation

```text
41,616 mod 77 = 36
26^3   mod 77 = 20
59,192 mod 77 = 56.
```

The four idempotents of `Z/77Z` are

```text
0, 1, 22, 56.
```

Therefore `56^2 = 56 (mod 77)`. Under the exact CRT coordinate
`Z/77Z -> Z/7Z x Z/11Z`, it is

```text
56 -> (0,1).
```

Thus adding `26^3` takes the core residue `(1,3)` to the nontrivial coordinate
projector `(0,1)`. This is an exact representation-level junction. It is not a
physical gate or an identity between Tessarec and Mod-77 objects.

## 5. Selectivity controls

### 5.1 Local handle window

In the frozen integer window `20..32`, the handles for which
`41,616+h^3 (mod 77)` is idempotent are:

| handle `h` | residue | CRT `(mod 7, mod 11)` |
|---:|---:|---:|
| 24 | 0 | `(0,0)` |
| 26 | 56 | `(0,1)` |

Hence `26` is the only nonzero-projector hit in that selected local window,
but it is not the only idempotent hit.

### 5.2 Full residue-class control

Across the complete handle residue system `0..76`, there are eight hits:

```text
13->0, 24->0, 26->56, 35->22,
48->56, 59->56, 68->0, 70->1.
```

So `26` is not globally unique, and even the target `56` is shared by the
handle residues `48` and `59`. The permitted conclusion is an exact selected
translation, not a privileged Nexus handle.

### 5.3 Center census

Within the declared comparison window `1<=n<=200`, the centered-cube sum
`3n(n^2+2)` is both square and triangular at:

```text
n=2  -> 36 = 6^2 = T_8
n=24 -> 41,616 = 204^2 = T_288.
```

This finite census shows that the property is selective in the window but not
unique there. It is not a global classification theorem.

## 6. Binding to the existing line

This record reuses `MOD:TESSAREC` for the consecutive-cube carrier and relates
the residue calculation to the existing `PBM:MOD77` comparison lens:

```text
23-24-25 centered cube carrier
-> exact integer value 41,616
-> add declared handle cube 26^3
-> exact integer value 59,192
-> project modulo 77
-> idempotent residue 56 / CRT coordinate (0,1).
```

The carrier, extension, quotient projection and CRT coordinate remain separate
objects. No canonical graph node or relation is added during Structure Freeze.

This also complements the prior `1->2->0->3` audit: the earlier record tested
loss and retained memory, whereas this record tests an integer extension before
a many-to-one modular projection. Equal vocabulary does not merge the maps.

## 7. Result vocabulary

- `PASS_EXACT_IDENTITY`
- `PASS_EXACT_SQUARE_AND_TRIANGULAR`
- `PASS_EXACT_FOURTH_CUBE_EXTENSION`
- `PASS_EXACT_TRANSLATION_TO_IDEMPOTENT_56`
- `PASS_NONUNIQUE_LOCAL_IDEMPOTENT_HIT`
- `PASS_NONUNIQUE_GLOBAL_RESIDUE_CLASS`
- `PASS_FINITE_CENSUS_NOT_GLOBAL_UNIQUENESS`

## 8. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_CONSECUTIVE_CUBE_NEXUS26_ENGINEERING_CHECK_001
PURPOSE: TEST_23_24_25_CORE_26_EXTENSION_AND_MOD77_SELECTIVITY
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-consecutive-cube-nexus26.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-consecutive-cube-nexus26.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: exact integer identities, declared finite censuses and Mod-77 representation only
AUTHORIZED_SCIENCE_RUN: false
```

## 9. Source junctions

- Owner-supplied `Tessarec_Split_Quadriptych.png` / attached raster supplies the historical panel and wording; it is not an independent scientific source.
- `36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md` owns Paper F's typed carrier/projection boundary.
- `44_A0_MOD77_TORUS_LIFT_THREE_TURN_ENGINEERING_CHECK_2026-10-13.md` owns the adjacent Mod-77 quotient and CRT-projector audit.
- `45_A0_TESSAREC_ZERO_SPLIT_MEMORY_LIFT_ENGINEERING_CHECK_2026-10-13.md` owns the distinct `1->2->0->3` operator audit.
- `MOD:TESSAREC` is reused; `PBM:MOD77` remains a related comparator only.

## 10. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `d7dbd09fcbd9277dc27ced860398ac4e4df8310635d014abfff95e82eae3fb28`  
Repeated stdout SHA-256: `4d3df31f85dead4c8396461582165baefe1e7f9bcf236e3297713315c3261e2c`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_EXACT_CORE_AND_MOD77_TRANSLATION_WITH_NONUNIQUE_HANDLE`

### Disposition

```text
23-24-25 CENTERED-CUBE IDENTITY: SUPPORTED / EXACT
SQUARE AND TRIANGULAR CORE: SUPPORTED / EXACT
26^3 EXTENSION TO 59,192: SUPPORTED / EXACT
MOD-77 TRANSLATION 36+20->56: SUPPORTED / EXACT
26 AS UNIQUE LOCAL NONZERO PROJECTOR IN 20..32: SUPPORTED / WINDOW-DEPENDENT
26 AS UNIQUE IDEMPOTENT HANDLE: REFUTED
PHYSICAL FIELD ENERGY / TESLA MECHANISM: NOT TESTED
NEW FINDING: NO
```

The next admissible test remains geometric: freeze an embedding and crossing
functional, then ask whether a projection crossing survives rotation and null
controls while the complete source record remains unchanged.
