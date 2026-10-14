# Orientation method

Status: `METHOD_PRECURSOR / DEFINITION_REVIEW_REQUIRED`

## Minimal current interpretation

The historical material is most useful when read as a precursor to a method,
not as a universal ontology.

For an object or process `x`, a representation procedure may be described by a
declared frame `r`, a partial map `F_r`, an output `y_r`, and metadata `m_r`:

```text
(x, r) --F_r--> (y_r, m_r)
```

Different frames may produce different records without implying that one
record is arbitrary or that all records are equivalent. Comparison therefore
requires at least:

1. declared source and target representations;
2. a domain on which the mapping is defined;
3. identity or correspondence rules;
4. known preserved and lost properties;
5. uncertainty, censoring and failure semantics;
6. a comparison rule that does not silently identify unlike objects.

## Observer boundary

`Observer` is used here operationally: the local frame, selection,
instrumentation and comparison procedure through which a record is produced.
It is not automatically a conscious subject, a physical field or an external
cause.

## Measurement boundary

Measurement requires a declared procedure and comparison structure. This
package does not assert the stronger historical claim that topological closure
is universally necessary for every measurement. That claim remains open until
`closure` and `measurement` are defined for a specific setting.

## Cartographic consequence

A map is neither the source object nor a neutral duplicate. It can preserve
selected relations while changing scale, coordinates, adjacency, orientation
or visibility. A NEXAH cartography should therefore expose:

- its frame and purpose;
- what it preserves;
- what it suppresses;
- its uncertainty and unavailable regions;
- the transformations used;
- whether comparisons are invariant, equivariant, lossy or undefined.
