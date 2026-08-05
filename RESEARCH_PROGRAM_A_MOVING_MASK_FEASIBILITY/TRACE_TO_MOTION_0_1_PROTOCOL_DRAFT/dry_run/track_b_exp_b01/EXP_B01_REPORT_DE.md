# EXP-B01 — Trace-to-Motion Direction Change

Status: `SYNTHETIC ENGINEERING PROBE — SCIENTIFIC RESULT NONE`

## Was Track B erhalten hat

Track B erhielt ein Richtungsloses Zykluspaket mit vier Koordinatenknoten,
vier ungerichteten Kanten und einer opaque Packet-ID. Zeit, Richtung,
Source Order, `sample_uuid`, `trace_index`, `s_norm`, Marker, Branch- und
Derivationsinformationen wurden nicht übergeben.

## Was n₁ verändert hat

`n₁` wurde ausschließlich als technische Übersetzungsgrenze verwendet.
Aus einer ungerichteten Trace-Geometrie wurden mögliche geordnete,
unitless parametrisierte Bewegungskandidaten. Es wurde keine physikalische
oder symbolische Bedeutung zugewiesen.

## Rekonstruktion und Mehrdeutigkeit

Zwei entgegengesetzte Zyklusdurchläufe wurden konstruiert. Beide sind mit
dem Richtungslosen Paket vereinbar. Bei vier möglichen Startknoten und zwei
Durchlaufrichtungen existieren bereits mindestens acht kompatible
Start-/Richtungskombinationen.

Direkt rekonstruierbar waren Knotenkoordinaten, ungerichtete Nachbarschaft
und geschlossene Zyklusstruktur. Nur unter provisorischer Annahme entstanden
Startpunkt, Durchlaufrichtung und unitless Phase. Nicht rekonstruierbar waren
Zeit, Geschwindigkeit, physikalische Bewegung, ursprünglicher Start,
Source Direction, `tau`, Marker und `sample_uuid`.

## Vorwärtsprojektion

- `MOTION-CANDIDATE-01`: ordered XY `FAIL`, sample set `PASS`, closure `PASS`.
- `MOTION-CANDIDATE-02`: ordered XY `PASS`, sample set `PASS`, closure `PASS`.

Beide Kandidaten projizierten auf dieselbe ungerichtete Trace-Geometrie
zurück. Nur einer reproduzierte die vorhandene Zeilenreihenfolge direkt.
Ein Reversal- oder Cyclic-Origin-Quotientenvergleich wurde nicht ausgeführt,
weil kein governing comparison method vorliegt.

## Frühester Informationsverlust

Der erste konkrete Verlust liegt am ersten gerichteten Schritt: Am gewählten
Startknoten sind zwei Nachbarn geometrisch kompatibel, und keine autorisierte
Track-B-Information entscheidet, welcher Nachbar zuerst durchlaufen wurde.
Noch davor fehlt ein intrinsischer Startpunkt. Zeitinformation fehlt vollständig.

## Architektonische Hypothesen

`n₁`, der `(β-m|j)η`-Split und die `RA–TH Bridge` bleiben ausschließlich
unbewertete architektonische Hypothesen. Dieses Experiment definiert sie
nicht als Physik, Symbolik oder Wissenschaft.

## Ergebnis

Der erste kontrollierte Repräsentationswechsel wurde technisch ausgeführt.
Er zeigt Existenz kompatibler Bewegungskandidaten, nicht deren Eindeutigkeit
oder physikalische Wahrheit.

```text
TRACK_A_REFERENCE_INTEGRITY: PASS
TRACK_B_INPUT_BOUNDARY: PASS
N1_TRANSLATION_EXECUTED: PASS
MOTION_CANDIDATE_CREATED: PASS
ALTERNATIVE_CANDIDATE_CREATED: PASS
FORWARD_PROJECTION_EXECUTED: PASS
TRACE_COMPARISON_EXECUTED: PARTIAL
AMBIGUITY_REPORTED: YES
INFORMATION_LOSS_REPORTED: YES
DETERMINISTIC_REPLAY: PASS
FIRST_DIRECTION_CHANGE: PASS
SCIENTIFIC_RESULT: NONE
HUMAN_ACQUISITION: PROHIBITED
```
