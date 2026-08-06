# TRACK B — REVERSAL RELATION UND I-L-A-U-AUDIT

Status: `DOCUMENTATION-ONLY AUDIT VIEW`

Datum: 2026-08-06

Operational effect: `NONE`

```text
NO NEW EQUIVALENCE RULE
NO CANDIDATE MERGE
SCIENTIFIC RESULT: NONE
HUMAN ACQUISITION: PROHIBITED
```

## 1. Zweck

Diese Audit-Sicht beschreibt eine bereits in EXP-B02 vorhandene endliche
Relation: Zu jedem verwurzelten gerichteten Durchlauf existiert der Durchlauf
mit demselben Startknoten und entgegengesetzter Richtung.

Der bestehende EXP-B02-Freeze, die acht Kandidatenidentitäten, die
Serialisierung und alle Statuswerte bleiben unverändert. Die Relation
identifiziert keinen ursprünglichen Durchlauf und führt keinen Quotienten ein.

## 2. Track-B Reversal Involution

Auf dem achtteiligen Kandidatenraum wird `R_B` definiert durch

```text
R_B(S_i,D_1) = (S_i,D_2)
R_B(S_i,D_2) = (S_i,D_1).
```

Damit gilt exakt

```text
R_B composed with R_B = id.
```

Die vier Reversal-Paare sind:

| Paar | Kandidat A | Kandidat B |
| --- | --- | --- |
| RB-01 | `B02-S01-D01` | `B02-S01-D02` |
| RB-02 | `B02-S02-D01` | `B02-S02-D02` |
| RB-03 | `B02-S03-D01` | `B02-S03-D02` |
| RB-04 | `B02-S04-D01` | `B02-S04-D02` |

Diese Wirkung ist gruppentheoretisch eine `C_2`-Wirkung. `C_2` bezeichnet
hier ausschließlich die zweielementige Gruppe. Sie ist nicht das
NAVIGATION_ENGINE-Regimelabel `C2`.

## 3. Kandidaten bleiben einzeln erhalten

Die Reversal-Relation erlaubt keine der folgenden Operationen:

- Zusammenlegen eines Paares;
- Einführung einer Reversal-Äquivalenzklasse;
- Löschung einer technischen Kandidaten-ID;
- Auswahl eines Kandidaten als ursprüngliche Bewegung;
- Übertragung auf Zeit, Geschwindigkeit oder physikalische Bewegung.

Der bestehende Status `NO_EQUIVALENCE_RULE_INTRODUCED: PASS` bleibt gültig.

## 4. I-L-A-U Comparison Card

Die folgende Karte gilt für jedes der vier Reversal-Paare unter der bereits
deklarierten Track-B-Rückprojektion auf die gemeinsame ungerichtete Geometrie.

| Feld | Deklarierter Track-B-Inhalt |
| --- | --- |
| Objects | zwei verwurzelte, gerichtete Durchläufe mit demselben Startknoten |
| Source support | eingefrorene vier Knoten und vier ungerichtete Kanten |
| Cut | Entfernung von Zeit, Source Order, Markern, UUIDs und Richtung aus dem Track-B-Eingang |
| Map | gerichteter Kandidat zur ungerichteten Knoten-/Kantengeometrie |
| Reflection | `R_B`, Wechsel zwischen den beiden Richtungen bei festem Startknoten |
| I — retained | Knotenmenge, ungerichtete Kanten, räumlicher Support, Zyklusabschluss |
| L — lost | gerichtete Reihenfolge nach der ungerichteten Rückprojektion |
| A — introduced | gesetzter Startknoten, technische Direction-ID, unitless Phase und Enumerationsordnung |
| U — unknown | ursprünglicher Start, ursprüngliche Richtung, Zeit, Geschwindigkeit, Ursache und Herkunft |
| Confidence | exakt für die eingefrorene synthetische Fixture und die ausgeführte Rückprojektion |
| Decision relevance | beide Kandidaten bleiben kompatibel; keiner wird als Ursprung identifiziert |

`L`, `A` und `U` sind verschiedene Klassen. Verlust unter einer konkreten Map
bedeutet nicht automatisch, dass der verlorene Inhalt niemals aus zusätzlichen
Quellen rekonstruierbar wäre. `U` bezeichnet hier, was aus den verglichenen
Track-B-Records nicht rekonstruiert werden kann.

## 5. Invarianzstatus

Für die deklarierte ungerichtete Rückprojektion sind folgende technische
Prädikate bereits durch EXP-B02 geprüft:

```text
node_set(candidate) = node_set(R_B(candidate))
undirected_edges(candidate) = undirected_edges(R_B(candidate))
closure(candidate) = closure(R_B(candidate)).
```

Die geordnete Knotenfolge ist richtungssensitiv und deshalb nicht unter `R_B`
invariant.

Diese Aussagen sind Conformance-Eigenschaften der konstruierten Enumeration.
Sie sind kein empirischer Symmetriefund.

## 6. Warum kein Janus-Score berichtet wird

EXP-B02 erzeugt die beiden Richtungen konstruktiv und prüft ihre gemeinsame
ungerichtete Rückprojektion. Ein Symmetriescore auf genau dieser Rückprojektion
wäre daher durch das Design auf perfekte Übereinstimmung festgelegt.

Ein solcher Wert würde nur bestätigen, dass die Implementierung ihre eigene
Konstruktionsregel eingehalten hat. Er würde keine neue Eigenschaft einer
Quelle, Bewegung oder physikalischen Dynamik messen. Deshalb wird in diesem
Appendix kein numerischer Janus- oder Reflection-Score eingeführt.

## 7. Evidence Boundary

Primäre technische Referenzen bleiben:

- `dry_run/track_b_exp_b02/EXP_B02_INPUT_PACKET.json`;
- `dry_run/track_b_exp_b02/EXP_B02_MOTION_CANDIDATES.json`;
- `dry_run/track_b_exp_b02/EXP_B02_FORWARD_PROJECTIONS.json`;
- `dry_run/track_b_exp_b02/EXP_B02_CANDIDATE_RELATIONS.json`;
- `dry_run/track_b_exp_b02/EXP_B02_REPORT.json`.

Dieser Appendix kopiert keine neue Ergebnisautorität über diese Artefakte und
ändert den Status `TRACK_B_SCIENTIFIC_IDENTIFIABILITY: BLOCKED` nicht.

