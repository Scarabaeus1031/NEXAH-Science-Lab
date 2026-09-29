# HTML instrument family source binding

Date: `2026-09-29`

Status: `SOURCE-BOUND / LOCAL EXECUTABLES RECOVERED / CLAIM CEILINGS PRESERVED`

## Purpose

This addendum binds the eight supplied screenshots to their original local
HTML instruments. The screenshots are evidence pointers, not instructions and
not independent mathematical evidence. Four HTML files account for all eight
screenshots.

## Exact source recovery

| Screenshots | Recovered source | SHA-256 | Binding |
|---|---|---|---|
| 1–4 | `SCIENCE_LAB/EXPORTS/NEXAH_FIVE_H_ONE_Q_CUT.html` | `8c733218dfd1ae6e8632653439877c059429286fa45e09889d0ccfdce0e123ca` | One instrument; READOUT, WEBSTUHL and TRIPTYCHON views plus the stepped Janus gate sequence |
| 5 | `SCIENCE_LAB/EXPORTS/NEXAH_COMMON_RUNTIME_ADAPTER.html` | `8d7c533db5f59139d09c9aa740a22d93df2f840226b317141ca469e317e812eb` | Interactive view of the common Cut A/B runtime adapter |
| 6 | `SCIENCE_LAB/EXPORTS/NEXAH_TESSERACT_ROOT_SPACE_8_TO_16.html` | `fcae2a8d1955be4102622747fb48d585c066352e784f0a749b424fa81fe25388` | Sign-state projection from an eight-state carrier to a paired sixteen-state display |
| 7–8 | `SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html` | `936708636b7193543bdc31e3069c7836b14057730f39633319e909e5e2f3fb84` | One multi-frame instrument; Closure Transit and Green Bridge · Loki modes |

The image-to-source hashes are frozen in `html_instrument_family_binding.json`.

## What is executable

### Five H · One Q°

The HTML implements five declared phase clocks, one common local cut, the view
switches, and the gate register

```text
3, 6, 9, 12, 24, 36, 42, 48 hours.
```

The displayed equality

```text
3 + 6 + 9 + 12 + 24 + 36 + 42 + 48 = 180
```

is exact arithmetic. It does not establish that the gate order is a natural
law or an independently measured dynamical switch. The corresponding synthesis
already declares the bounded follow-on experiment `H_Q_RECORD_01`.

### Common Runtime Adapter v0.1

The HTML is backed by the local runtime package
`SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/`. For the `five-h-q`
profile it provides:

- finite `t0_days` and `loop_days` validation;
- phase sampling for five declared periods;
- immutable Cut A and Cut B records;
- the binder `five-h-q:identity-by-clock-id-v1`;
- clock-ID alignment;
- phase-delta comparison;
- Euclidean phase-residual classification;
- canonical receipt hashing and verification.

The existing conformance test was rerun on `2026-09-29` with the bundled Node
runtime. Result: `18/18 PASS`, six profiles registered, four executable or
replayable, tampering rejected, duplicate Cut rejected, raw null rejected and
pending profiles fail closed. Receipt SHA-256:
`6d7219070adf748d2608927845504b4549925a31ae36d707afb2cf878d5ff494`.

This is executable local infrastructure. Its own package boundary remains
`PASS_LOCAL_PROTOTYPE_SCOPE`; it registers no new scientific capability.

### Emergent root space

The root-space HTML implements the sign-state construction

```text
Q(sqrt(2), sqrt(3), sqrt(5))       -> 2^3 = 8 states
Q(sqrt(2), sqrt(3), sqrt(5), sqrt(7)) -> 2^4 = 16 states
```

and draws eight pairing edges between two projected eight-state layers. This
is a valid algebraic/sign-state and projection fixture. It is not by itself a
metric proof that `sqrt(7)` is a uniquely identified physical fourth axis.

### Closure Transit and Green Bridge

The Closure Transit mode implements a declared transport chain and separates
four comparator outcomes: exact, tolerance, near and visual-only closure.
`EXACT RETURN` means zero residual on the complete *declared comparison
domain*; it does not mean reset or unrestricted identity.

The Green Bridge mode implements the four-bit sign graph with 16 nodes, 32
edges and eight edges for the fourth binary coordinate. The source explicitly
labels the drawing as a projected frame fixture, not a physical four-dimensional
object.

## Relation to the current SCN/NCS/404 question

These recovered instruments strengthen the available implementation layer:
cuts can be frozen, paired, bound, compared and returned with a typed residual;
sign-state carriers can be displayed as 8-to-16 and Q3-to-Q4 extensions.

They do **not** supply the missing source-bound bridge

```text
H: (SCN/NCS integer state, measurement state)
   -> Knickfield regulator pair (a,b) or another independently measured gate state.
```

No `404`, `SCN`, `NCS` or `292` mapping occurs in the runtime package. Therefore
the prior bridge status remains:

`NOT_EVALUABLE_WITHOUT_INDEPENDENT_SOURCE_BOUND_H`.

The correct integration is consequently:

```text
Five-H phase fixture
  -> immutable Cut A/B runtime records
  -> declared binder and comparator
  -> typed residual and receipt
```

not:

```text
Five-H display -> inferred 292 switch -> inferred 404 gate.
```

## Next bounded test opened by this recovery

The recovered family makes `H_Q_RECORD_01` the next independent executable
test: freeze one epoch and location, the five period definitions, the phase
convention and the eight gate times; emit the phase vector and observer record
at every gate; compare against shuffled-gate, phase-offset and no-return
controls; use reconstruction or prediction error as the primary metric.

That experiment tests the Five-H/record mechanism on its own terms. A later
404 bridge test still requires a separately sourced and frozen `H` interface.

## Decision

`ACCEPT_AS_RECOVERED_EXECUTABLE_INSTRUMENT_FAMILY_WITH_BOUNDED_CLAIMS`.

No existing bounded Root7 closeout is promoted, and no M-Class, astronomical,
physical-4D, NCS292 or 404-switch claim follows from this source binding.
