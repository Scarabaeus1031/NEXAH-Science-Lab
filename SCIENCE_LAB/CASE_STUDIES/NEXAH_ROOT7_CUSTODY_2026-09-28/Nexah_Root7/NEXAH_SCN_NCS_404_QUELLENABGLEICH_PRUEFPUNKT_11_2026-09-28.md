# Prüfpunkt 11 — vorhandene Gate-Operatoren gegen SCN/NCS abgeglichen

**Datum:** 28. September 2026. Ziel: Vor dem heutigen +8-Zahlentest definierte Umschaltregel oder unabhängige Gate-Ereignisse finden. Gelesene Bestandsquellen: `knickfield-labyrinth.html` (ausführbares 404-Alignment), `janus_switching_prediction.py` und `BUILDING_LOG_01.md` (JANUS EXP-3), `nexah_notes_pink_axis.rtf` (NCS292/Yugo), `Nexah Orientation Dynamics Section.pdf` (Beobachtersäule 110–111–112), die im Faden vorgelegte TimeSelectCut/CXXXI-Karte. Die Quellen wurden vor den heutigen SCN-Tests angelegt; der Abgleich ändert sie nicht.

## Ausführbare 404-Bedingung aus dem Knickfield-Labyrinth

Zwei Reglerwerte `a,b` liefern `phase=b−a`, `mean=(a+b)/2`. Der Code definiert:

```text
open    := |phase|<8 und |mean|<6
aligned := hypot(4.2·phase, 6.2·mean)<34
404     := open und aligned
```

Die angezeigte Größe `error=hypot(phase/90,mean/45)` ist ein **Messwert im UI**, kein zusätzlicher Gate-Schwellwert. An diesen Testpunkten sind die Koordinaten-Clamps des Originals inaktiv:

| a | b | Phase | Mean | Distanz | Ergebnis |
|---:|---:|---:|---:|---:|---|
| 0 | 0 | 0 | 0 | 0 | 404 / Alignment |
| 5 | 5 | 0 | 5 | 31 | 404 / Alignment |
| 5 | 6 | 1 | 5,5 | 34,36 | nur offen |
| 6 | 6 | 0 | 6 | 37,2 | geschlossen |
| −4 | 4 | 8 | 0 | 33,6 | geschlossen (strenges `<8`) |
| −3 | 4 | 7 | 0,5 | 29,56 | 404 / Alignment |

Das Gate ist somit ein kleiner Bereich im zweidimensionalen **Reglerraum**, nicht eine Bedingung `phase=tilt=error=0`. Dieses konkrete Testprotokoll betrifft den **404-Demonstrator**; im geprüften Code gibt es keine Variable `n`, `k`, `292` oder definierte Abbildung von `101·2^j`/`7801+8k` auf `(a,b)`.

## Weitere eigenständige Operatoren

- `janus_switching_prediction.py` erkennt Lorenz-Lobenwechsel per Vorzeichenwechsel der ersten Zustandskomponente: `sign(x[i]) != sign(x[i+1])`. `BUILDING_LOG_01.md` berichtet Ereigniscluster bei Kohärenzminima. Das ist ein definierter Ereignis-Detektor in einer **kontinuierlich simulierten Zeitreihe**, keine Modulo-11-Regel für Zahlen und auch keine 292-NCS-Kalibrierung. Der zugehörige Script-Konfigurationswert `switch_window=180` bezeichnet das Auswertefenster, nicht die Schaltzahl 292.
- `nexah_notes_pink_axis.rtf` nennt NCS292/Yugo eine zentrale Faser und schreibt **heuristisch** `G(x)=(1−ρ̂)(1−Ĉ)(1−R̂)` sowie `|Δθ| ≫ 0` als Iota-Moment. Die Datei nennt die konkrete Gate-Wirkung und Parameterdefinition selbst als offene Arbeit. Das Produkt ist derzeit keine ausführbare booleanische oder zeitliche NCS-Schwelle.
- `Nexah Orientation Dynamics Section.pdf` skizziert 110/111/112 als Beobachter-/Driftsäule und die Vorzeichen `±1/12`, `±1/112`. Es liefert eine räumliche und dynamische Analogie, keine exakte Abbildung der SCN-Spur auf die Säule.
- CXXXI/TimeSelectCut zeigt die Reihenfolge `STATE → SELECT → CUT → RECORD → MIRROR → RETURN`, aber keinen numerisch eindeutigen `SELECT`-Prädikator. **Vorsicht:** In der vorliegenden NEXAH-Kartenserie bezeichnet ein Visual 7801 als Prime; `7801=29·269` ist komposit.

## Testergebnis und fehlende Schnittstelle

Es gibt damit eine **unabhängige, vorbestehende 404-Gate-Bedingung** und einen **unabhängigen Lorenz-Switch-Detektor**. In den geprüften Quellen fehlt die Schnittstelle, die aus einer SCN-Phase `n_k mod 11` ein Reglerpaar `(a,b)`, einen Lorenz-Zustand `x(t)` oder eine NCS292-Aktion ableitet. Eine solche Schnittstelle `F(n_k, Messzustand)→(a,b,x(t))` muss mit Einheiten, Zeit-/Schrittbezug und Quellen **vor** einer Übereinstimmungsprüfung festgelegt werden; beliebig gewählte Reglerwerte wären kein unabhängiger Test.

**Status:** Das frühere „es gibt keinen ausführbaren Gate-Operator“ wäre zu pauschal: für 404 gibt es einen. Die engere Aussage „in den geprüften Vorquellen keine unabhängig definierte Verknüpfung SCN(+8/11) → NCS292 → 404-Ereignis“ bleibt bestehen. Bis eine solche Zuordnung existiert, ist 4→2 ein gesicherter Abstand der gewählten Modulo-11-Rollen, keine gemessene Rückkehr in einer Dynamik.
