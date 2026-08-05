# LAB REPORT — TRACE-TO-MOTION 0.1 RETURN BRIEF

Status: `TECHNICAL PLATEAU — SCIENTIFIC RESULT NONE`

Berichtsstand: Commit `260fdef5b4e12821836e16a17755d9e1aa1f20c5`

Human data: `NONE`

Human Acquisition: `PROHIBITED`

## 1. Forschungsgegenstand

Der aktive technische Strang untersucht in begrenzter Form:

> Welche Relationen bleiben erhalten, wenn eine beobachtete Trace in mögliche
> gerichtete Durchläufe übersetzt und anschließend wieder in den Trace-Raum
> projiziert wird?

Der Strang untersucht derzeit keine Bewegungsphysik. `n₁` bezeichnet nur die
technische Repräsentationsgrenze zwischen einer ungerichteten Trace und einem
Raum möglicher gerichteter Durchläufe.

## 2. Ausgeführte Architektur

```text
frozen synthetic input
        ↓
operational trace derivation
        ↓
trace-connectivity assessment
        ↓
closure_status assignment
        ↓
six-column byte-stable serialization
        ↓
SHA-256 and clean replay
        ↓
direction-free Track-B packet
        ↓
n₁ — technical translation boundary
        ↓
eight start/direction candidates
        ↓
forward projections
        ↓
ordered-XY and undirected-geometry checks
```

### Track A — minimaler technischer Pfad

Die Referenzdatei ist:

- 324 Bytes groß;
- SHA‑256
  `8aadeeec4b4c8cd591a597aef59b8390585db7e8f6a5346e88b37bd41cbc71ce`;
- durch Python und eine getrennte Node.js-Implementierung byteidentisch
  reproduziert.

Dieser Erfolg gilt nur für den eingefrorenen minimalen Serialisierungs- und
Replay-Pfad. Er hebt die breitere offene Robustheitsfrage der
Closed-Trace-Kanonisierung nicht auf.

### Track B — ausgeführtes Plateau

EXP‑B01 erzeugte aus dem richtungslosen Paket zwei gegensinnige Kandidaten und
projizierte beide zurück in den Trace-Raum.

EXP‑B02 enumerierte den vollständigen Raum:

```text
4 technische Startknoten × 2 erste Richtungen = 8 Kandidaten
```

Alle acht Kandidaten:

- besitzen stabile technische IDs;
- sind geschlossen;
- verwenden alle vier Knoten und vier Kanten einmal pro Umlauf;
- projizieren auf dieselbe ungerichtete Geometrie;
- behalten für jeden Fokus sieben deterministisch referenzierbare Alternativen;
- wurden in zwei vollständigen Wiederholungen byteidentisch erzeugt.

`B02-S01-D02` ist der einzige direkte Treffer der vorhandenen
Track‑A-XY-Zeilenreihenfolge. Diese Übereinstimmung ist keine Identifikation
der ursprünglichen Bewegung.

Primäre Evidenz:

- [EXP‑B01 Machine Report](dry_run/track_b_exp_b01/EXP_B01_REPORT.json)
- [EXP‑B02 Machine Report](dry_run/track_b_exp_b02/EXP_B02_REPORT.json)
- [Track B Plateau View](TRACK_B_PLATEAU_REPORT_DE.md)

## 3. Erhaltene und verlorene Information

| Klasse | Inhalt |
| --- | --- |
| Direkt erhalten | Koordinatenknoten, ungerichtete Kanten, Zyklusabschluss, Segmentgeometrie |
| Vollständig enumeriert | technische Startwahl und beide Durchlaufrichtungen |
| Technisch gesetzt | lexikographische Reihenfolge, Kandidaten-ID, stückweise lineare Verbindung, unitless Phase |
| Nicht rekonstruierbar | intrinsischer Start, ursprüngliche Richtung, Zeit, Geschwindigkeit, Beschleunigung, Source Order, Marker, `tau`, `sample_uuid`, Herkunft, Ursache |
| Nicht untersucht | physikalische Bewegung, Kräfte, Energie, biologische oder körperliche Interpretation |

Die früheste gerichtete Ambiguität tritt bei der Wahl der ersten ausgehenden
Kante auf. Das autorisierte Paket enthält keine Information, die eine der
beiden Richtungen auswählt.

## 4. Verifikationsstatus

| Prüfebene | Status | Grenze |
| --- | --- | --- |
| Track‑A-Referenzintegrität | `PASS` | eingefrorenes synthetisches Artefakt |
| Python-/Node-Byteübereinstimmung | `PASS` | Serialisierung, nicht Gesamtprotokoll |
| EXP‑B01 Repräsentationswechsel | `PASS` | technische Existenz kompatibler Kandidaten |
| EXP‑B02 Enumeration | `PASS` | spezifischer ungerichteter Vier-Zyklus |
| gemeinsame ungerichtete Rückprojektion | `PASS` | exakte Knoten-/Kantenprüfung |
| deterministischer Replay | `PASS` | erzeugte synthetische Artefakte |
| ursprüngliche Richtung | `UNKNOWN` | aus Paket nicht identifizierbar |
| vollständige Canonicalization-Robustheit | `UNRESOLVED` | breiter Revision‑2-Validator zuvor 33/34 |
| unabhängiger wissenschaftlicher Track‑B-Test | `BLOCKED` | Evaluator und Regel fehlen |
| Track‑C-Vergleich | `BLOCKED` | Design und Owner-Entscheidungen fehlen |
| wissenschaftliches Ergebnis | `NONE` | keine entsprechende Ausführung |
| Human Acquisition | `PROHIBITED` | Pflichtblocker offen |

## 5. Geplante Architektur

### 5.1 Vollständiger Track A

Noch geplant beziehungsweise offen:

- Gerätequalifikation und Sampling-Anforderungen;
- unabhängige Kalibrierung und Error Budget;
- robuste Segmentierung;
- abschließende Canonicalization-/Repräsentationsmethode;
- geometrische Vergleichsverträge und begründete Toleranzen;
- unabhängige Gesamtvalidierung.

### 5.2 Wissenschaftlicher Track B

Der geplante Direction-Identifiability-Test benötigt:

```text
sealed exact-reversal pair
→ randomized direction-free packets
→ independent evaluator
→ response or UNKNOWN
→ scoring against sealed truth
```

Nicht festgelegt sind Evaluator, Unabhängigkeitsnachweis, Sample Count,
Antwortregel, Chance Criterion, Accuracy Threshold und Aggregation.

### 5.3 Track C

Geplant, aber nicht gebaut sind vorab eingefrorene statische und bewegliche
Masken mit getrennten Auswertungen für:

- Availability;
- hidden count/fraction;
- gap structure;
- bounded support;
- common evaluable support;
- conditional error;
- common-support error.

Kausale Aussagen über Bewegung bleiben ohne zusätzliche Identifikation
verboten.

### 5.4 Jenseits des aktuellen Plateaus

Nur architektonisch sichtbar sind:

- EXP‑B03;
- ein möglicher zweiter Übergang `n₂`;
- Zeit-, Geschwindigkeits- und Beschleunigungsmodelle;
- wissenschaftliche Bewegungsmetrik;
- Generalisierung auf andere Graphen oder Systeme;
- empirische und physische Validierung;
- Human Acquisition.

Diese Elemente sind weder implementiert noch durch diesen Report autorisiert.

## 6. Offene Entscheidungen und Abhängigkeiten

Die größten offenen Blöcke sind:

1. **Statusnavigation:** README, Experimentlog und Owner Queue bilden die
   späteren Track‑A/B-Meilensteine noch nicht vollständig ab.
2. **Canonicalization:** intrinsische Repräsentation symmetrischer geschlossener
   Traces und robuste Störungsbehandlung bleiben ungelöst.
3. **Geometrischer Vergleich:** keine autorisierte Reversal-, Rotations- oder
   Cyclic-Origin-Vergleichsmethode.
4. **Track‑B-Evaluator:** O‑11 bleibt für den wissenschaftlichen Test offen.
5. **Metriken und Toleranzen:** O‑10 und O‑13 bleiben offen.
6. **Track C:** Masken, Exposure Matching und Common Support sind nicht
   freigegeben.
7. **Unabhängige Gesamtvalidierung:** Die zweite Serialisierung ist nicht mit
   einer unabhängigen Validierung des gesamten Protokolls gleichzusetzen.
8. **Human Acquisition:** Ethik, Datenschutz, Rollen, Gerätequalifikation und
   Owner-Freigabe sind nicht abgeschlossen.
9. **Repositoryzustand:** 504 vorbestehende untracked Dateien bleiben außerhalb
   der Track‑A/B-Checkpoints und müssen bei jedem künftigen Commit geschützt
   werden.

## 7. Wiederanlaufprozedur

Bei Wiederaufnahme zuerst read-only prüfen:

1. `git rev-parse HEAD` entspricht dem erwarteten Rückkehr-Checkpoint;
2. tracked Working Tree ist sauber;
3. Track‑A-Referenz besitzt 324 Bytes und den eingefrorenen SHA‑256;
4. EXP‑B01- und EXP‑B02-Artefakte zeigen keinen Diff;
5. Anzahl und Status der vorbestehenden untracked Dateien wurden nur gelesen;
6. der Owner wählt genau eine nächste Forschungsfrage.

Danach einen bounded Mission Prompt erstellen. Nicht aus einer allgemeinen
Roadmap direkt in Implementierung oder Human Acquisition springen.

## 8. Lab Disposition

```text
ARCHITECTURAL_ORIENTATION: YES
TRACK_A_MINIMAL_TECHNICAL_MILESTONE: REACHED
TRACK_B_ENGINEERING_PLATEAU: REACHED
TRACK_B_SCIENTIFIC_IDENTIFIABILITY: BLOCKED
TRACK_C_IMPLEMENTED: NO
FULL_PROTOCOL_VALIDATION: NO
SCIENTIFIC_RESULT: NONE
HUMAN_DATA: NONE
HUMAN_ACQUISITION: PROHIBITED
NEXT_STATE: OWNER PRIORITY DECISION
```

Bis zur nächsten Owner-Entscheidung ist der korrekte Laborzustand:
`HOLD CURRENT PLATEAU`.
