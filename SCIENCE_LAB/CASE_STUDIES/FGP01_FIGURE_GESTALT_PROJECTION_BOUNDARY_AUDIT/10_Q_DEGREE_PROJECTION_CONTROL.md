# Q° Projection Control

Q° is classified as `DERIVED_PROJECTION_RELATIVE_ORIENTATION_MARKER_NO_NEW_PRIMITIVE`.

For a source/state `X`, a projection/view may declare a reference marker `Q°` using an existing frame, orientation rule, view, projection reference and provenance:

```text
X --[P1 + frame/view rule]--> (F1, Q°1)
X --[P2 + frame/view rule]--> (F2, Q°2)
X --[P3 + frame/view rule]--> (F3, Q°3)
```

Different valid projections may assign different marker coordinates or roles without changing X. The marker is located **in the declared view/frame record**, not in the object unless a separate sourced relation says so.

Mandatory rejections: `Q° != X`, source, object, physical center, universal origin, zero, observer or truth. Q° is projection-relative in this bounded model only. No Q° implementation or universal observation theory follows.
