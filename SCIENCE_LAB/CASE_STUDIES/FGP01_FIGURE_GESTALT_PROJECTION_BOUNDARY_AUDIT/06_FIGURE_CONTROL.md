# Figure Control

Operational definition:

> A Figure is a bounded represented configuration available in a declared view.

Minimum composition:

```text
View {
  typed source,
  geometry/marks/contours/coordinates/topology as applicable,
  frame and render rule,
  declared losses,
  projection/source provenance
}
```

Figure therefore requires no primitive. It is a `View` plus its representation-bearing records. A figure may omit source variables and may be pixel-identical to a figure from another source. Figure identity is view/revision/provenance identity, not source identity or visual equality.

`FIGURE_STATUS=COMPOSITION_OF_EXISTING_TYPES`. A figure is not the generating object, projection rule, observer, perceptual grouping, invariant or interpretation.
