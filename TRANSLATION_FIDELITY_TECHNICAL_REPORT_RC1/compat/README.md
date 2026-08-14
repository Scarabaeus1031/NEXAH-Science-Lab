# Compatibility Layer

This directory is a non-scientific release-engineering layer. It does not alter
the frozen protocols, runners, or results.

Studies 1 and 2 contain one absolute historical dependency path. The portable
harness copies each complete frozen study into a temporary directory, verifies
the bundled dependency snapshot, and changes only that path literal in the
temporary runner copy. The scientific source runner remains byte-identical.

`historical_dependency/` is the minimal transitively imported Python source
snapshot from Git commit
`923362e141170f06f2f0f26992136b5979047c42`. It contains `nexah/core.py`,
`nexah/backends/`, `nexah/orientation/`, and `nexah/sources/`, plus the historical
software license and dependency declaration. Unrelated repository material was
excluded.

