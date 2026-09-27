# Five H, Q-Cut, Triptychon and Rainbow Loom Synthesis

Date: `2026-09-15`

Status: `OWNER_SYNTHESIS_READY_FOR_EXPERIMENT_DESIGN_NO_NEW_PHYSICS_CLAIM`

## Result in one line

The current NEXAH thread now has one coherent representation pipeline: five
physical base periods generate base phases and declared beat clocks; each
selected rhythm can be normalized for comparison; one local `Q°(t0)` event
cuts all rhythms at different phases; projection, diagonal cut, shadow, mask
and trace create a record; the record may then be routed back as an explicitly
declared return or re-feed.

```text
base periods T_j
  -> base phases and declared beats
  -> normalized display rhythms H_j
  -> one local event Q°(t0)
  -> observer projection Pi_Q
  -> diagonal cut iota
  -> shadow / representation mask
  -> retained trace / T^3(q) record
  -> return / re-feed
```

This is the consolidated operator grammar. It is not a claim that the visual
machine exists physically, that all displayed colors are measured radiation,
or that the gate sequence defines a new astronomical law.

## 1. Astronomical anchor: five clocks plus one observer

The executable Test 04C supplies the strongest local anchor. Its five base
periods are:

| base clock | period used by Test 04C | role |
|---|---:|---|
| sidereal Earth rotation | `0.9972695663 d` | base phase |
| annual orbit | `365.256363004 d` | base phase |
| sidereal lunar orbit | `27.321661 d` | base phase |
| lunar node regression | `18.613 y` | base phase |
| axial precession | `25,772 y` | base phase |

`Q` is not a sixth physical clock in this test. It is the local observer,
sampling event or projection operator. It has no independent frequency.

Naming repair remains open in the implementation: the source currently calls
the `18.613 y` term `T_NUTATION` and serializes it as `principal_nutation`.
Within this synthesis it is named `lunar node regression`; nutation may be a
related observable effect but is not an interchangeable clock label. A later
code revision should rename the field without changing the frozen value.

The code and preregistration use beat relations of the form

```text
f_beat = |f_a - f_b|
T_beat = 1 / f_beat.
```

The reproduced values are:

| derived clock | relation | result |
|---|---|---:|
| mean solar day | sidereal spin minus annual orbit | `0.9999998937 d` |
| synodic month | sidereal Moon minus annual orbit | `29.530588214 d` |
| lunar day | sidereal spin minus sidereal Moon | `1.035049987 d` |

The distinction between base clocks and derived clocks is mandatory. The
five displayed breaths may use day, synodic month, year, nodes and precession,
but the first two then belong to a derived presentation set rather than the
five-clock base set.

## 2. `H_j` and the one-hertz display clock

For a rhythm with real period `T_j`, use a physical phase coordinate

```text
phi_j(t) = 2*pi*((t - t_ref)/T_j mod 1).
```

For comparison and interaction only, define the normalized coordinate

```text
u_j(t) = ((t - t_ref)/T_j mod 1).
```

The interface may replay each `H_j` through one complete normalized cycle in
one second of display time `tau`:

```text
du_j/dtau = 1 cycle/s = 1 display-Hz.
```

This does not replace the real period `T_j` and does not synchronize the
physical clocks. It means:

```text
one display second per normalized H_j cycle,
not one physical second per astronomical cycle.
```

At a fixed local event `t0`, the five values `phi_j(t0)` normally differ. That
is the content of the five-rhythm cut:

```text
same local now != same phase in every rhythm.
```

## 3. `Q°`, `Pi_Q`, `iota` and the record

The operators are now separated as follows:

| symbol or term | current typed role |
|---|---|
| `T_j` | real period of clock `j` |
| `H_j` | phase rhythm selected for comparison or replay |
| `Q°(t0)` | one local observation event and common time cut |
| `Pi_Q` | observer-relative projection |
| `iota` | oriented diagonal cut through the projected carrier |
| shadow | source/body/receiver-dependent projection profile |
| mask | declared representation layer: visible, withheld or recoverable |
| trace | retained time-ordered output |
| `T^3(q)` | current label for the projected record state |
| return / re-feed | declared routing of a record into a later comparison |

The prior closed orbit

```text
T^4 <-> T^3(q)
```

remains useful as a visual shorthand for carrier/record return. It is no
longer the canonical location of the one-hertz display clock. The time-normalized
turn belongs to the individual `H_j`; `Q°` then cuts their current phases.

## 4. Two days and the Janus half-turn

The current 48-hour demonstrator uses two schematic day/night cycles:

```text
DAY 1 -> NIGHT 1 -> DAY 2 -> NIGHT 2.
```

The gate increments are

```text
3, 6, 9, 12, 24, 36, 42, 48.
```

Their sum is exactly

```text
3 + 6 + 9 + 12 + 24 + 36 + 42 + 48 = 180.
```

Within the current visual grammar this supports a half-turn or shadow-side
layout. `24 h` is both an explicit gate and the internal Janus hinge. `42 h`
is the midpoint between `36 h` and `48 h` and remains on the six-hour grid.

The arithmetic is exact. The interpretation is not yet a measured law. No
privileged astronomical, biological or dynamical status follows from the sum
without a frozen decoder, an input record and an external comparator.

The day/night halves are schematic twelve-hour display partitions. They are
not calculated sunrise and sunset intervals for a declared location and date.

## 5. Three views of one operator system

The apparent two-version split in the responsive HTML is now formalized as
multiple projections rather than competing models:

### Readout

The five rhythm clocks, `Q°` cut, projected carrier and record are placed on a
horizontal reading axis. This is the clearest analytical representation.

### Webstuhl / Loom

The five colored phase channels appear as threads routed from the clock bank
through `Q°` into the projected carrier. The record is visibly returned to the
loom. This view emphasizes connection and recurrence.

### Triptychon

```text
I   LIGHT / WEAVE
II  SHADOW / MASK
III RECORD / RETURN.
```

The shadow is the required middle state. It is neither the source nor the
record; it is the projection produced by a declared source, body, geometry and
receiver. The triptych prevents the record from being mistaken for the field
itself.

## 6. Beginning of the rainbow

The machine visual consolidates the color path as

```text
white source
  -> prism / aperture
  -> separated channels
  -> loom / cut
  -> shadow and mask
  -> recorded grooves and traces
  -> return manifold
  -> re-feed.
```

The rainbow is a representation of channel differentiation. Unless an input
is explicitly spectrally measured, it does not prove that the modeled channels
are literal wavelengths.

The current stable color contract remains:

| color role | representation meaning |
|---|---|
| cyan / blue | inflow, expansion or generated channel |
| magenta / violet | memory, echo or cut |
| gold / yellow | gate, aperture decision or `Q°` marker |
| green | retained link, return or re-feed |
| red | exterior witness or boundary |

## 7. Record-player and machine metaphors

The owner metaphors can be retained as a mnemonic layer:

| metaphor | bounded operator reading |
|---|---|
| plate / record player | rotating carrier and retained groove |
| needle / sickle / alchemist | oriented sampling and transformation cut |
| Clockwork Orange | amber mechanical time and record mechanism |
| yellow `Q°` | observer marker or witness axis, not a claimed Planet X |
| loom threads | distinct channels with declared ports |
| replay | record used as input to a later operation |

Named literary or comic figures remain private memory aids. They are not
scientific entities and are not required by the formal operator grammar.

Earlier biological analogies involving carbon, bone, DNA/RNA, protein folding
and a skeleton/build plan remain outside the present typed module. They may be
revisited only after a correspondence table states the source domain, target
domain, preserved relation and failure condition. No biology claim is adopted
here.

## 8. Current artifacts

| artifact | role |
|---|---|
| `SCIENCE_LAB/EXPORTS/NEXAH_FIVE_H_ONE_Q_CUT.html` | interactive Readout, Webstuhl and Triptychon demonstrator |
| `SCIENCE_LAB/EXPORTS/NEXAH_TESSAREC_Q_IOTA_PEARL.html` | earlier Tessarec/Q/iota/pearl demonstrator |
| `SCIENCE_LAB/EXPORTS/NEXAH_RAINBOW_LOOM_I_FIELD_WEAVE.png` | machine overview: source, weave, cut, record and return |
| `SCIENCE_LAB/EXPORTS/NEXAH_RAINBOW_LOOM_II_SHADOW_CUT.png` | optical side cut with controlled shadow |
| `SCIENCE_LAB/EXPORTS/NEXAH_RAINBOW_LOOM_III_RECORD_RETURN.png` | rear record, mask/audit and re-feed view |

The machine images are generated concept illustrations. They are visual design
records, not apparatus photographs or evidence that the depicted machine was
built.

## 9. Evidence and claim ledger

| statement | status |
|---|---|
| beat identities used in Test 04C | `EXACT_RELATION_AND_EXECUTABLE_CHECK` |
| reproduced solar-day, synodic-month and lunar-day values | `NUMERICALLY_REPRODUCED` |
| `Q` has no independent frequency in Test 04C | `DECLARED_MODEL_BOUNDARY` |
| one normalized `H_j` cycle in one display second | `EXACT_INTERFACE_CLOCK` |
| physical astronomical clocks all run at `1 Hz` | `FALSE` |
| same `t0` produces the same phase in all five clocks | `FALSE_IN_GENERAL` |
| gate sum equals `180` | `EXACT_ARITHMETIC` |
| gate sequence is a new natural law | `NOT_ESTABLISHED` |
| shadow is required between cut and record in the triptych | `REPRESENTATION_CONTRACT` |
| rainbow colors identify measured wavelengths | `NOT_ESTABLISHED_WITHOUT_SPECTRAL_INPUT` |
| record can be routed into a later operation | `DECLARED_RETURN_OPERATOR` |
| re-feed proves physical feedback or causation | `NOT_ESTABLISHED` |
| machine visuals depict built hardware | `FALSE_CONCEPT_ART` |

## 10. Minimal next experiment

A scientific continuation should freeze one question rather than validate the
whole machine metaphor. The smallest coherent package is:

```text
Experiment: H_Q_RECORD_01

Input:
  one declared epoch and location;
  five declared base periods;
  one observation horizon;
  one phase convention.

Operators:
  beat derivation -> H_j normalization -> Q°(t0) cut -> Pi_Q projection.

Gate register:
  3, 6, 9, 12, 24, 36, 42, 48 hours.

Outputs:
  phase vector at every gate;
  projected observer record;
  retained/masked/lost field ledger;
  replay reconstruction error.

Comparators:
  direct astronomical calculation;
  shuffled gate order;
  phase-offset null;
  representation without re-feed.

Primary metric:
  reconstruction or prediction error fixed before execution.

Stop rule:
  one frozen run plus declared sensitivity checks.
```

The machine and rainbow visuals may explain this package. They may not replace
the frozen input, comparator, metric or result.

## Source locators

- `17_CATALAN_EXIT_OPEN_RETURN_NAVIGATION.md`
- `18_JANUS_COLOR_INFLOW_AND_VISUAL_PROVENANCE_REVIEW.md`
- `14_CLOSURE_LIGHT_SHADOW_ARITHMETIC_AUDIT.md`
- `15_TRINITY_MASK_ZERO_ANCHOR_APERTURE.md`
- `SCIENCE_LAB/CASE_STUDIES/Orion_POLAR:Pass Maastricht/Polar-Janus-Test-04C-Five-Clocks-One-Observer/polar_janus_five_clocks_test_04c.py`
- `SCIENCE_LAB/CASE_STUDIES/Orion_POLAR:Pass Maastricht/Polar-Janus-Test-04C-Five-Clocks-One-Observer/test_04c_preregistration_de.md`
- `SCIENCE_LAB/CASE_STUDIES/Orion_POLAR:Pass Maastricht/Polar-Janus-Test-04C-Five-Clocks-One-Observer/test_04c_report_de.md`
- current owner-supplied gyroscope, five-rhythm, double-cut, shadow, groove,
  machine-room and representation-register visual sets
