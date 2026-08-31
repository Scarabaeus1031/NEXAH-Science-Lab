# GPT-01 Test Specification

## Frozen representation

- Font: `DejaVu Sans Mono Regular` from `/opt/codex/runtimes/codex-primary-runtime/dependencies/python/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf/DejaVuSansMono.ttf`.
- Glyph canvas: `256×256` pixels per character.
- Font size: `180` pixels; upright, centered by the font bounding box.
- Binary extraction: antialiased grayscale render thresholded at `128/255`.
- Path extraction: deterministic Zhang–Suen skeleton of the binary filled glyph.
- Components: 8-connected components of the filled mask.
- Endpoints: skeleton pixels with exactly one 8-neighbor.
- Junctions: connected clusters of skeleton pixels with at least three 8-neighbors.
- Segment evidence: counts of horizontal, vertical and diagonal skeleton edges.
- Direction: unresolved unless supplied by an external rule. No arrows are inferred.

## Frozen composition rule

Strings are typeset left-to-right at the font's fixed native advance on a common
baseline. The binary masks are unioned. No kerning optimization, overlap,
rotation, reflection, crop or connector is added. A continuous path requires a
single 8-connected filled component.

## Frozen 6/9 tolerance

Compare the 180° rotation of the frozen 6 mask with the frozen 9 mask using
intersection-over-union (IoU): `YES >= 0.98`, `APPROXIMATE >= 0.75`, otherwise
`NO`. No alignment is performed after rendering.

The target was not used to select the font, size, threshold, path extraction or
composition rule.
