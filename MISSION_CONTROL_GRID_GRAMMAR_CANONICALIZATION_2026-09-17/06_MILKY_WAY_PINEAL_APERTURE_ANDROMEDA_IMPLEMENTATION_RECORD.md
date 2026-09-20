# Milky Way · Pineal Aperture · Andromeda — Implementation Record

Date: 2026-09-17  
Record: `Milky Way, Pineal Aperture and Andromeda HTML5 Instrument 01`  
Status: `Grid Grammar Conformance Level 2 / Executable Visual Fixture / No Runtime Adoption`

## Artifacts

- [Interactive HTML5 instrument](../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html)
- [Canonical machine-readable record](../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA_RECORD.json)
- [Download package](../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA_DOWNLOAD.zip)

## Searchable subject names

- **Milky Way** — the first independently rotating procedural carrier field.
- **Pineal Aperture** — the central observer-local selection aperture and
  comparison cut.
- **Andromeda** — the second independently rotating procedural carrier field.
- **Declared model source** — the address shown behind the central aperture.

## Bounded representation

```text
Milky Way carrier                 Andromeda carrier
independent rotation              independent rotation
          \                              /
           +---- Pineal Aperture -------+
                         |
              declared model source
                         |
             selected trace / residual
                         |
                       return
```

Milky Way and Andromeda are two procedural carrier fields. The Pineal
Aperture is the observer-local interface between them: it selects traces,
compares support and phase, and exposes a typed residual. It is not a third
galaxy or carrier.

## Controls and records

- whole-field, Milky Way, Pineal Aperture and Andromeda focus;
- both-carrier, single-carrier and difference masks;
- adjustable aperture, phase difference and pulse rate;
- optional streams, residual and address labels;
- observer-state export as JavaScript Object Notation.

All five figure presets are exposed as simultaneously visible controls in the
instrument: **Dreieck**, **Sechseck**, **Pentagramm**, **Trinity Bridge** and
**Lissajous 3:2**. Display labels use the full names **Milky Way**, **Pineal
Aperture** and **Andromeda** rather than project shorthand.

## Trinity and Polynomial Inspector

The optional inspector generates figures *from* the procedural clouds by a
declared and repeatable nearest-node rule. It does not merely draw an unrelated
shape over the field.

Available selection figures are triangle, hexagon, pentagram, Trinity Bridge
and a Lissajous curve with frequency ratio three to two. Each figure may be
selected in the Milky Way carrier, the Andromeda carrier or both carriers.

For every state record, the inspector exports:

- the selected node addresses;
- the complete edge list of the displayed graph;
- every trinity, defined here as a three-vertex clique;
- the characteristic polynomial of the displayed undirected adjacency matrix.

The characteristic polynomial is computed as
`determinant(lambda identity matrix minus adjacency matrix)`. Its meaning is
therefore bounded to the declared selection and edge rules.

## Inside Frame Navigator

The instrument now separates seven coordinate-frame orientations instead of
collapsing galactic, heliocentric and planetocentric structures into one
picture:

- **Outside Carrier View** preserves the original two-carrier observer model.
- **Earth Sky** treats the Milky Way as the background field, the Pineal
  Aperture as the observer window and Andromeda as a deep-sky object. Loaded
  right ascension and declination are used when available; otherwise the view
  is visibly marked as procedural.
- **Solar System** uses the Sun as the heliocentric origin, includes an Earth–
  Moon local subsystem and shows the Oort Cloud only as a schematic outer
  shell.
- **Saturn–Titan** uses Saturn as the local origin and its ring plane and moon
  orbits as the planetocentric grid.
- **Uranus–Moons** uses the tilted Uranian axis, ring plane and moon family as
  a separate planetocentric grid.
- **Green Bridge · Loki** projects the sixteen-state Q4 sign graph as two
  eight-state Q3 layers. Eight green bridge edges encode the independent
  fourth binary coordinate; Iota marks the directed cut and Pearl the local
  comparison aperture.
- **Closure Transit** exposes the declared transform, cut or address, hinge
  seam, return and comparator path. Its modes distinguish exact return,
  tolerance closure, near-closure with residual and visual alignment without
  comparator authority.

The solar and planetary views are orientation diagrams. Distances, body sizes
and animation rates are not scale measurements or ephemerides. The active
frame and its semantic boundary are included in every exported state record.
The Green Bridge is a mathematical projection and not a physical
four-dimensional object. Closure Transit is an executable grammar fixture;
its selected comparator mode is not an empirical finding.

## Stellar Node Mapper

The Stellar Node Mapper differentiates the carrier points without presenting
synthetic properties as measured astronomy. The default mode is **Procedural
Stellar Proxy**. No astronomical catalog is loaded in this implementation.

Each procedural stellar proxy receives a stable carrier-qualified address and
a deterministic test profile containing:

- spectral class from O through M;
- proxy apparent magnitude;
- normalized near, middle or far depth band;
- variability and multiple-system flags;
- proxy confidence and explicit procedural provenance.

The visible encoding maps magnitude to node size, spectral class to color,
variability to pulse and the multiple-system flag to an outer ring. Figure-
selected nodes retain a white core. Filters expose hot, solar-like, cool,
variable and multiple-system subsets. A separate Support Grid mode distinguishes
procedural construction nodes from stellar proxies.

Clicking a visible node opens its Stellar Node Record. The observer-state
export includes the selected node, active mapping mode, filter and provenance
boundary.

A catalog-backed mode must preserve raw measurements separately from
carrier-normalized comparison coordinates. Right ascension, declination,
distance, photometry, uncertainty and source identifiers may only be populated
from a named catalog; this fixture does not synthesize them.

## Star Map Importer

The instrument accepts a local comma-separated-values or JavaScript Object
Notation file. The file is parsed inside the browser and is not uploaded.
JavaScript Object Notation may be a top-level array, an object containing
`stars`, `data`, `rows`, `nodes`, `catalog`, `objects`, `entries`, `results`,
`features` or `N`, a nested object array, or an object map of star records.
Instrument records and exported observer-state records are rejected explicitly;
they describe the instrument and are not stellar catalogs. Missing or blank
coordinates remain absent and are never converted silently to zero.

Each row must provide either right ascension and declination in degrees or
normalized horizontal and vertical coordinates. The carrier must be declared
as Milky Way or Andromeda, either in the file or through the explicit fallback
selector. Recognized optional fields include source identifier, distance,
apparent magnitude, color index, spectral class, variability, multiple-system
status, uncertainty and confidence.

Imported sky coordinates are projected and normalized independently inside
each carrier. The original source fields remain attached to the selected node
record and are not overwritten by the comparison projection. Import is limited
to twenty thousand rows and fifteen megabytes per file.

The included
[`MIWA_PINEAP_STAR_MAP_TEMPLATE.csv`](../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_STAR_MAP_TEMPLATE.csv)
documents the accepted column schema. Its rows are explicitly labeled
demonstration data and are not astronomical measurements.

## Claim boundary

- The fixture does not establish a physical coupling between the Milky Way
  and the Andromeda Galaxy.
- The Pineal Aperture is an expression-layer aperture and observer operator,
  not a biological or pineal-gland measurement.
- Visual synchrony, pulsing and overlap are not causal evidence.
- The declared model source is an address inside this model, not a
  cosmological origin claim.
- The procedural fields are schematic carriers, not astronomical sky maps.
- A generated figure is a declared nearest-node selection, not a discovered
  astronomical object or natural law.
- Stellar proxy properties are deterministic test data, not astronomical
  measurements or catalog entries.
- Importing a file does not authenticate its astronomical provenance or
  measurement quality.

The fixture demonstrates a bounded observer grammar at Grid Grammar
Conformance Level 2. It does not alter the canonical grid grammar, activate a
shared runtime profile or raise an empirical claim.
