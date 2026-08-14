# License Status

The repository-root `LICENSE` was copied byte-for-byte into this bundle and is
Apache License 2.0 text. The copied research source directories were untracked
at assembly time, so this task does not assert that repository-level licensing
unambiguously covers every research artifact.

The historical dependency repository provides a more specific `LICENSES.md`:
original software/implementation code is Apache-2.0, while original
documentation and research material is CC BY 4.0. The compatibility snapshot
contains only the transitively imported software source, its Apache-2.0 license,
the scope statement, and its dependency declaration. Its provenance is recorded
in `compat/HISTORICAL_DEPENDENCY_PROVENANCE.md`.

Runtime packages are not vendored. Existing package metadata identifies NumPy,
scikit-learn, SciPy, joblib, threadpoolctl, and pandas as BSD-family; pytz and
six as MIT; tzdata as Apache-2.0; and python-dateutil as dual-licensed. Their
upstream notices must be reviewed if a future distribution vendors packages.

The owner must still confirm the license scope and attribution for the RC's
research prose/artifacts before public release. No legal conclusion is inferred
beyond the repository evidence above.

`LICENSE_STATUS = OWNER_CONFIRMATION_REQUIRED`
