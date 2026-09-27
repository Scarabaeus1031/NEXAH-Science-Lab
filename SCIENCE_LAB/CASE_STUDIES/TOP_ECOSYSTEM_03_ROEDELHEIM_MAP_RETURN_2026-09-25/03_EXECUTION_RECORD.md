# 03 - Execution Record

## T1 - Source receipt

All eight selected records were found and SHA-256 bound in
`02_SOURCE_LEDGER.csv`. The primary map is a `3782 x 4000` JPEG. Its title and
visible content identify a Rödelheim Flur overview; the paired local Arcinsys
screenshot carries the custody label `3011:1, 9077 H`.

Result: `PASS_BYTES / PROVENANCE_PARTIAL`.

The bytes do not independently establish the map's date, scale, complete
catalogue description or chain from the archive server to the local file.

## T2 - Selection and representation

`Roedelheim_Fuenfschritt_Kartenpruefung.png` places a Flurkarte detail beside
two smaller-scale regional views. It explicitly labels the five stations and
records different outcomes rather than one uniform success:

| Station | Returned reading |
|---|---|
| Zufluss | visible at regional scale; source point outside or unresolved in detail |
| Teilung | several water lines visible; exact branch point not traced |
| Schleife | strong bends visible at more than one scale |
| Insel | local enclosed/encircled area and independent report support |
| Rückführung | exact confluence not isolated |

The companion water test marks three search windows and explicitly says that
the circles are not measured coordinates. The visual therefore remains a
bounded comparison view, not a geometric reconstruction.

Result: `PASS_BOUNDED_REPRESENTATION`.

## T3 - Interpretation comparison

The ten-page Gesamtreport and the two Markdown controls agree on the decisive
limits:

- water bends and the Rödelheim island context survive;
- a common pointwise location across map changes has not been demonstrated;
- straight triangle sides are not supported as continuous historical lines;
- map seams, frames, lettering and derived marks must not be read as terrain;
- former channels beneath named modern streets remain open;
- a controlled registration requires four distributed control points and two
  held-out check points with reported error.

The report's page 8 heading displacement is a layout residual only. It does not
change the content status.

Result: `SEMANTIC_RETURN_PASS_BOUNDED`.

## T4 - Negative-control return

The historical/modern overlay looks plausible as orientation, but its image
does not expose stable control points, held-out checks, transform parameters or
error. It cannot return as evidence that a historical line and a modern street
or terrain feature are the same location.

Result: `GEOREFERENCE_FAIL_TYPED / ILLUSTRATION_RETAINED`.

## T5 - Source return

Every retained claim was compared back to the declared source set:

- `PASS_BOUNDED`: curved water forms are directly visible in the primary map;
- `PASS_BOUNDED_LOCAL_SOURCE_SET`: the island reading is present in the map
  comparison and the report's named municipal reference;
- `UNRESOLVED`: exact split point, exact return/confluence and common
  pointwise geometry across maps;
- `FAIL_TYPED`: any exact modern-location or continuous hidden-geometry claim
  derived from the unregistered overlay.

No source was changed and no missing coordinate was inferred.
