# Acquisition and Analysis Protocol

Status: `DRAFT — OWNER APPROVAL REQUIRED`

Protocol ID: `TTM-0.1-DRAFT-01`

## 1. Bounded question

> Which declared geometric relations remain available when a time-indexed
> planar trajectory becomes a direction-free trace, and how does a moving
> spatial mask change deterministic reconstruction relative to an
> exposure-matched static mask?

The protocol evaluates only the declared representation and mask system. It
does not generalize to handwriting meaning, human intention or another domain.

## 2. Design

The proposed acquisition contains exactly twelve single-stroke samples:

```text
P01-F  P01-R
P02-F  P02-R
P03-F  P03-R
P04-F  P04-R
P05-F  P05-R
P06-F  P06-R
```

`F` follows increasing template parameter `u`. `R` follows the same template
under `u -> 1-u`. Sample order is fixed:

```text
P03-R, P01-F, P05-R, P02-F, P06-F, P04-R,
P01-R, P05-F, P03-F, P06-R, P02-R, P04-F
```

The order was chosen once for the draft and must not be changed after
acquisition begins. It alternates neither path nor direction systematically.

## 3. Coordinate frame

The drawing domain is:

\[
D=[0,200]\times[0,200]\ \mathrm{mm}.
\]

- origin: lower-left calibration fiducial;
- positive `x`: right;
- positive `y`: up;
- unit: millimetre;
- time: seconds from contact-down;
- normalized time: `tau=(t-t0)/(t1-t0)`;
- template parameter: `u` in `[0,1]`.

All geometry is evaluated in this calibrated frame. Screen pixels or device
units are not scientific coordinates.

## 4. Six planar path geometries

The printed or displayed template uses a `0.50 mm` neutral grey centerline.
Coordinates below are in millimetres.

### P01 — Straight line

\[
x(u)=30+140u,\qquad y(u)=100.
\]

Diagnostic role: zero-curvature baseline, endpoint handling and direction
non-identifiability without shape complexity.

### P02 — Semicircular arc

\[
x(u)=100+70\cos(\pi(1-u)),\qquad
y(u)=100+70\sin(\pi u).
\]

Diagnostic role: smooth, nonzero, single-sign curvature and open-curve
canonicalization.

### P03 — S-curve

\[
x(u)=30+140u,\qquad y(u)=100+45\sin(2\pi u).
\]

Diagnostic role: smooth curvature sign change and an interior transition near
`u=0.5`.

### P04 — Hinge polyline

\[
x(u)=30+140u,
\]

\[
y(u)=
\begin{cases}
150-200u,&0\le u\le0.5,\\
-50+200u,&0.5<u\le1.
\end{cases}
\]

Diagnostic role: one declared discontinuity in tangent direction at `u=0.5`.

### P05 — Circle

\[
x(u)=100+60\cos(2\pi u),\qquad
y(u)=100+60\sin(2\pi u).
\]

Diagnostic role: closed-curve start-point removal and clockwise/counterclockwise
ambiguity.

### P06 — Figure-eight

\[
x(u)=100+65\sin(2\pi u),\qquad
y(u)=100+45\sin(4\pi u).
\]

Diagnostic role: self-intersection, two lobes and loss of temporal branch order
in an un-timed representation.

## 5. Device requirements

The acquisition device must provide:

- one planar stylus or pen-tip channel;
- native sample rate at least `120 Hz`;
- monotonic timestamps with resolution at most `1 ms`;
- spatial resolution at most `0.10 mm`;
- declared manufacturer, model, firmware, operating system and acquisition
  software version;
- raw `x`, `y`, timestamp and contact state without adaptive smoothing;
- export of every native sample before resampling;
- no pressure, tilt or orientation channel in the primary analysis.

Pressure or tilt may be retained in a sealed auxiliary file if the device
cannot disable them. They must not enter the analysis or reviewer packet.

The proposed feasibility acquisition uses one adult Human participant to
produce all twelve samples. The participant is `UNASSIGNED`; no recruitment,
consent or acquisition action is authorized. Results may describe only this
bounded acquisition and support no population inference.

## 6. Calibration

Before the twelve samples, record four fiducials at:

```text
C00 = (0, 0)
C10 = (200, 0)
C11 = (200, 200)
C01 = (0, 200)
```

Fit one affine map from device coordinates to millimetres by least squares.
Calibration passes only when:

- RMS fiducial residual is at most `0.25 mm`;
- maximum fiducial residual is at most `0.50 mm`;
- determinant of the linear part is positive;
- no calibration parameter changes during the twelve samples.

Failure blocks the run. Recalibration starts a new run ID.

## 7. Acquisition

For each sample:

1. show only the assigned path and direction arrow;
2. begin at the declared endpoint;
3. record one continuous contact-down stroke;
4. follow the centerline once without deliberate retracing;
5. end at the opposite endpoint, or the same endpoint for P05/P06;
6. preserve the native record immediately;
7. record deviations and technical events without deleting the sample.

Sample duration must be between `1.0 s` and `8.0 s`. Native timestamps must be
strictly increasing. A gap above `25 ms`, a contact break, a missing endpoint or
an extra stroke makes the sample `INVALID_ACQUISITION`.

Template-adherence QC is computed after a rigid 2D fit used only for QC:

- RMS distance to the template at most `5.0 mm`;
- 95th percentile distance at most `10.0 mm`;
- maximum distance at most `15.0 mm`.

The QC fit must not be used for source/trace registration or scoring.

Exactly one replacement attempt is permitted for a technically invalid sample.
Both attempts remain in provenance. A second failure blocks the run.

## 8. Source normalization

The scientific source record is produced from calibrated native samples:

1. retain the original native record unchanged;
2. remove no valid sample and apply no spatial smoothing;
3. linearly interpolate `x(t)` and `y(t)` to exactly `1001` uniformly spaced
   normalized-time values `tau=0,0.001,...,1`;
4. serialize coordinates to six decimal places in millimetres;
5. retain the native duration separately.

The normalized record is not raw evidence. It is a deterministic analysis
input derived from the raw record.

## 9. Direction-free trace representation

The source is resampled again at `1001` equally spaced cumulative-arc-length
positions. Consecutive native positions less than `0.01 mm` apart are collapsed
before arc-length interpolation.

Open traces are canonicalized from the endpoint with the lexicographically
smaller `(x,y)` coordinate. Closed traces are canonicalized from the
lexicographically smallest vertex and use the orientation whose next distinct
vertex is lexicographically smaller than its previous distinct vertex.

Closure is declared only for P05 and P06 and passes when source endpoint
distance is at most `2.0 mm`. Other paths remain open.

The canonical trace file contains geometry order but no acquisition direction,
timestamps, velocity, pressure, sample direction label or original source row
number. This is the scored `TRACE_ONLY` representation.

### Frozen rendering

Create one deterministic 8-bit binary PGM rendering from the canonical
polyline:

- canvas: `2000 x 2000` pixels;
- scale: exactly `10 pixels/mm`;
- pixel center `(i,j)` represents `((i+0.5)/10,(j+0.5)/10) mm` with image rows
  inverted so positive scientific `y` remains visually upward;
- foreground: value `0` when the pixel-center distance to any canonical line
  segment is at most `0.50 mm`;
- background: value `255`;
- header bytes: `P5\n2000 2000\n255\n`;
- pixels: row-major from displayed top-left;
- no anti-aliasing, color profile, compression or metadata.

The PGM is a visual representation derived from `trace_canonical.csv`.
Scientific geometry metrics use the canonical CSV, not pixels extracted back
from the rendering. The renderer implementation and hash must freeze before
acquisition.

## 10. Source/trace identity rule

Every derived record carries the same opaque `sample_uuid` as its source. The
mapping between `sample_uuid` and `Pxx-F/R` is stored only in the sealed truth
table.

Identity is established only by the signed derivation record and file hashes.
Geometric similarity, filename similarity or reviewer inference never creates
identity.

## 11. Static and moving masks

Both masks operate in calibrated space and hide a closed vertical strip of
width `40.0 mm`.

Static mask:

\[
M_s(\tau)=\{(x,y)\in D:|x-c_s|\le20\}.
\]

`c_s` is fixed for the complete sample but selected separately for each sample
by the exact matching rule below.

Moving mask:

\[
c(\tau)=20+55\tau,
\]

\[
M_m(\tau)=\{(x,y)\in D:|x-c(\tau)|\le20\}.
\]

A source sample on a mask boundary is masked. Masks are applied after source
normalization. The original source remains unchanged.

### Exact exposure matching

Exposure is frozen as masked spatiotemporal area, not the number of trajectory
samples intercepted:

\[
E(M)=\frac{1}{|D|}\int_0^1 |M(\tau)\cap D|\,d\tau.
\]

Both strips remain fully inside `D`, have area `40*200 mm^2` for every `tau`
and therefore have exact masked-area exposure:

\[
E(M_s)=E(M_m)=0.20.
\]

Trajectory-sample exposure is also matched exactly. For each normalized source:

1. apply the moving mask and record its masked-sample count `K_m`;
2. construct critical static centers from `20`, `180`, and every clipped
   `x_i-20` and `x_i+20`;
3. add the midpoint of every consecutive pair of sorted critical centers;
4. retain centers in `[20,180]` whose static strip masks exactly `K_m` samples;
5. choose the retained center minimizing `|c_s-100|`; on a tie choose the lower
   center;
6. if no center exists, set the sample and run to `BLOCKED`.

The selected `c_s`, candidate-set hash and exact count are sealed before
reconstruction. The estimator receives the masks, not the unmasked source used
to select `c_s`.

This matches masked area and masked sample count. It does not match the temporal
arrangement, gap count or geometric location of withheld samples; those
differences are the bounded contrast under test.

## 12. Reconstruction

Use one deterministic baseline only.

- visible normalized samples retain their measured coordinates;
- a masked interval bounded by visible samples on both sides is reconstructed
  by coordinate-wise linear interpolation in `tau`;
- a masked prefix or suffix is `UNKNOWN`;
- a completely masked record is `UNKNOWN`;
- no template, paired sample, trace-only geometry or future sample may enter
  reconstruction.

Static and moving conditions use identical code and parameters.

## 13. Segmentation

Ground-truth transition markers are fixed in template parameter:

| Path | Markers | Role |
|---|---|---|
| P01 | none | baseline |
| P02 | none | smooth curvature |
| P03 | `u=0.5` | curvature-sign transition |
| P04 | `u=0.5` | hinge |
| P05 | none | closed curve |
| P06 | `u=0.5` | return through self-intersection |

For source and reconstructed time series, estimate markers as follows:

1. compute centered tangent vectors over a `10`-sample half-window;
2. P03 marker: nearest interior sign change of signed turning angle to
   normalized time `0.5` within `[0.35,0.65]`;
3. P04 marker: maximum absolute turning angle within `[0.35,0.65]`;
4. P06 marker: minimum Euclidean distance to the start coordinate within
   `[0.35,0.65]`;
5. return `UNKNOWN` if required window samples are masked or reconstructed from
   an unbounded gap.

Trace-only geometry receives geometric segment boundaries but no temporal
direction or branch-order label.

Reconstruction is completed and sealed without access to path identity.
Path-specific marker evaluation occurs only afterwards, when the evaluator
opens the sealed identity table. Path identity may not alter reconstructed
coordinates.

## 14. Registration

Primary source, trace and mask records already share the calibrated coordinate
frame. Primary registration is therefore the identity transformation.

No Procrustes fit, scale fit, reflection, non-rigid registration or
sample-specific alignment is allowed for scoring. The rigid template fit in
Section 7 is QC only.

## 15. Metrics

### Representation metrics

- symmetric mean nearest-neighbour distance between source arc-length points
  and canonical trace points;
- symmetric 95th-percentile nearest-neighbour distance;
- relative path-length difference;
- endpoint distance for declared closed paths;
- self-intersection presence for P06 under a `1.0 mm` crossing tolerance.

### Reconstruction metrics

- RMSE in millimetres over masked samples that have bounded interpolation;
- maximum error over the same samples;
- fraction of all normalized samples reported `UNKNOWN`;
- masked trajectory-sample fraction;
- transition-marker localization error in normalized time;
- false reconstruction count: any unbounded masked sample assigned a numeric
  coordinate.

### Pair metrics

- forward/reverse template identity check;
- difference between F/R canonical-trace geometric metrics;
- trace-only direction field presence, which must be zero;
- static-minus-moving paired metric delta, reported descriptively for six
  pairs without population inference.

## 16. Tolerances and decision rules

| Check | Pass tolerance | Failure behavior |
|---|---:|---|
| calibration RMS | `<=0.25 mm` | `BLOCKED` |
| calibration maximum | `<=0.50 mm` | `BLOCKED` |
| native median rate | `>=120 Hz` | sample invalid |
| native timestamp gap | `<=25 ms` | sample invalid |
| sample duration | `1.0–8.0 s` | sample invalid |
| template QC RMS | `<=5.0 mm` | sample invalid |
| template QC p95 | `<=10.0 mm` | sample invalid |
| template QC maximum | `<=15.0 mm` | sample invalid |
| H1 symmetric mean distance | `<=0.25 mm` | H1 fails for sample |
| H1 symmetric p95 distance | `<=0.50 mm` | H1 fails for sample |
| H1 relative path length | `<=1.0%` | H1 fails for sample |
| closed endpoint distance | `<=2.0 mm` | sample invalid |
| transition localization | `<=0.05 tau` | marker not recovered |
| exposure-area difference | exact `0` | `BLOCKED` |
| masked-sample-count difference | exact `0` per sample | `BLOCKED` |
| false reconstruction count | exact `0` | `BLOCKED` |
| direction-bearing fields in trace packet | exact `0` | leakage; `BLOCKED` |

H1 is `SUPPORTED WITHIN THIS REPRESENTATION` only if all twelve valid samples
pass all three primary H1 tolerances. Otherwise it is `NOT SUPPORTED`.

H2 is a protocol-level non-identifiability boundary. A trace-only direction
claim is `UNSUPPORTED INFERENCE` unless a separately declared directional cue
exists. No directional cue is permitted in this protocol.

H3 result classes are:

- `DIFFERENCE OBSERVED`: for either unknown fraction or bounded-gap RMSE, at
  least four of the six F/R path-pair means exceed the metric threshold in the
  same direction;
- `NO DIFFERENCE OBSERVED`: the difference criterion is not met and at least
  four path pairs remain evaluable for both declared primary metrics;
- `LIMITING`: a difference is confined to prefix/suffix `UNKNOWN` handling or
  another preregistered simpler diagnostic and does not survive the bounded-gap
  comparison;
- `BLOCKED`: integrity or exposure requirements fail.

For each path, the path-pair mean is the arithmetic mean of its F and R
static-minus-moving deltas. The frozen non-zero thresholds are:

- unknown-fraction pair-mean magnitude: `0.02`;
- bounded-gap RMSE pair-mean magnitude: `1.00 mm`;
- transition-localization pair-mean magnitude: `0.02 tau`, reported as a
  secondary diagnostic only.

An RMSE pair is evaluable only when both conditions yield numeric bounded-gap
RMSE for both F and R. Unknown values are never converted to numeric penalties.
If fewer than four path pairs are evaluable for both unknown fraction and RMSE,
the H3 disposition is `BLOCKED`.

No significance test or population claim is permitted with six path pairs.

## 17. Serialization tolerance

- coordinates: decimal, six places, absolute comparison tolerance `0.000001 mm`;
- normalized time: decimal, three places, exact sequence `0.000` to `1.000`;
- metric JSON: decimal, nine places;
- hashes, identifiers, labels and status values: exact string equality;
- missing numeric values: empty CSV field plus explicit status `UNKNOWN`;
- NaN and infinity: prohibited.

## 18. Leakage checks

Before analysis, verify that `TRACE_ONLY`, `STATIC_MASK` and `MOVING_MASK`
review inputs contain none of:

- `F` / `R` direction label;
- raw or normalized timestamps in `TRACE_ONLY`;
- velocity or pressure;
- source row number;
- template ID exposed through filename;
- paired-sample mapping;
- evaluator transition markers;
- source coordinates inside masked intervals;
- Owner explanation or expected result.

Any leak blocks the affected run. Repair requires a new packet ID and complete
rehash before review.

## 19. Negative controls

1. exact synthetic F/R reversal for all six templates;
2. P01 zero-curvature baseline;
3. P05 closed-loop direction ambiguity;
4. P06 self-intersection branch-order ambiguity;
5. unbounded masked prefix/suffix, which must remain `UNKNOWN`;
6. tampered hash fixture, which the validator must reject;
7. trace packet containing a direction field, which the validator must reject.

## 20. BLOCKED conditions

The full run is `BLOCKED` when:

- authority, scientific owner, data owner or independent reviewer is missing;
- calibration fails;
- more than one sample requires a replacement;
- a required file or hash is absent or mismatched;
- normalization, rendering, registration, mask or metric implementation differs
  from the frozen protocol;
- static and moving masked-area exposure differs;
- source truth leaks into a review or reconstruction input;
- numeric values replace an `UNKNOWN` prefix or suffix;
- results are inspected before the protocol and implementation hashes freeze;
- an excluded interpretation enters the protocol or result.

No blocked run may be classified as support, null or falsification.

## 21. Explicit exclusions

The protocol contains no LANIF, ZERO, Fugenformel, handwriting-meaning, golf,
body-motion or energy variable, claim or interpretation. It creates no OLS
term, operator, Lab number or general theory.
