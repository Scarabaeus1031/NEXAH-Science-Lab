# EXP-B02 — Complete Start/Direction Enumeration

Status: `SYNTHETIC ENGINEERING PROBE — SCIENTIFIC RESULT NONE`

> EXP‑B02 prüft, ob das richtungslose Zykluspaket einen vollständig
> enumerierbaren endlichen Raum kompatibler gerichteter Durchläufe zulässt.
> Es prüft weder, welcher Durchlauf ursprünglich war, noch ob einer davon
> eine physische Bewegung beschreibt.

## Persistente ungerichtete Geometrie

Eingang war ausschließlich die byte-identische Kopie des autorisierten
EXP-B01-Pakets: vier Koordinatenknoten, vier ungerichtete Kanten und ein
geschlossener Zyklus. Alle acht Vorwärtsprojektionen enthalten genau diese
Knoten und Kanten. Keine Quotienten- oder Äquivalenzregel wurde eingeführt.

## Acht orientierte Varianten

- `B02-S01-D01`: N00 → N01 → N03 → N02 → N00; XY-Referenz FAIL
- `B02-S01-D02`: N00 → N02 → N03 → N01 → N00; XY-Referenz PASS
- `B02-S02-D01`: N01 → N00 → N02 → N03 → N01; XY-Referenz FAIL
- `B02-S02-D02`: N01 → N03 → N02 → N00 → N01; XY-Referenz FAIL
- `B02-S03-D01`: N02 → N00 → N01 → N03 → N02; XY-Referenz FAIL
- `B02-S03-D02`: N02 → N03 → N01 → N00 → N02; XY-Referenz FAIL
- `B02-S04-D01`: N03 → N01 → N00 → N02 → N03; XY-Referenz FAIL
- `B02-S04-D02`: N03 → N02 → N00 → N01 → N03; XY-Referenz FAIL

Die Startknoten und ihre beiden ersten Nachbarn wurden lexikographisch
geordnet. Diese Ordnung ist ausschließlich eine technische
Serialisierungsentscheidung. Sie bevorzugt keinen Kandidaten.

Die vorhandene Track-A-XY-Zeilenreihenfolge wurde nur als exakte
Vergleichsreferenz verwendet. Eine Übereinstimmung belegt weder ursprüngliche
Richtung noch Zeit, Ursache oder physikalische Bewegung.

## Fehlende Informationen

Nicht rekonstruierbar bleiben insbesondere intrinsischer Startpunkt,
ursprüngliche Durchlaufrichtung, Zeit, Geschwindigkeit, Beschleunigung,
Source Order, Herkunft, Marker, `tau`, `sample_uuid` und physikalische Ursache.

## Architekturhypothese „No Slack“

Als begrenzte Architekturmetapher gilt hier: Wird ein Kandidat fokussiert,
bleiben die sieben anderen Kandidaten deterministisch referenzierbar.
`1 + 7 = 8` beschreibt nur den vollständig verorteten Kandidatenraum.
Es behauptet nicht, dass acht Bewegungen gleichzeitig physisch stattfinden.
Die Metaphern „Fühler“, „Flavor“ und „no slack“ sind keine kanonischen
Datenfelder und kein wissenschaftliches Ergebnis.

## Status

```text
TRACK_A_REFERENCE_INTEGRITY: PASS
TRACK_B_INPUT_BOUNDARY: PASS
N1_TRANSLATION_EXECUTED: PASS
EIGHT_CANDIDATES_ENUMERATED: PASS
CANDIDATE_IDENTITIES_UNIQUE: PASS
ALL_CANDIDATES_CLOSED: PASS
ALL_FORWARD_PROJECTIONS_EXECUTED: PASS
UNDIRECTED_GEOMETRY_PERSISTENT: PASS
ORDERED_XY_COMPARISON_EXECUTED: PASS
NO_EQUIVALENCE_RULE_INTRODUCED: PASS
ALTERNATIVE_SET_PRESERVED: PASS
DETERMINISTIC_REPLAY: PASS
AMBIGUITY_REPORTED: YES
INFORMATION_LOSS_REPORTED: YES
SCIENTIFIC_RESULT: NONE
HUMAN_ACQUISITION: PROHIBITED
```
