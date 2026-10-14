# Orientation Catalog Lens

This directory contains the governed, read-only Science Navigator projection
of the existing NEXAH Experience Publication Catalog.

The lens reuses `arena:*`, `NX-*` and `NX-OP-*` identities. It does not create
books, Connection Families, scientific evidence or publication authority.

Build and validate from this directory:

```sh
node build_orientation_catalog_lens.mjs
node validate_orientation_catalog_lens.mjs
```

