# NEXAH √7 · Prüfpunkt 06: 101→202→404→808 im 11/111-Feld

Stand: 28.09.2026 · **PASS_BOUNDED — exakte Kodierung, nicht unabhängig belegte Kanal-Einbettung**

## Frage und Arbeitsdefinition

Die übermittelten v55-Tafeln zeigen ein lokales 11×11-Gitter (Mod 11, Reste 0…10), ein 111×111-Feld (Mod 111, Reste 0…110) und die Formulierung „each shift changes scale, not identity“. Wir prüfen, ob die im 404-Material vorhandene Verdopplungsfolge 101→202→404→808 auf beiden Skalen konsistent abgebildet werden kann. Die v55-Tafel selbst setzt **noch keine** Geometriepunkte des √7-Tests auf diese Marken.

Für den endlichen Abschnitt \(0\le n<111^2=12\,321\) wählen wir eine **explizite Zeilen/Spalten-Regel**:

\[
E(n)=(x,y)=\bigl(n\bmod111,\;\lfloor n/111\rfloor\bigr),\qquad n=x+111y.
\]

Dadurch ist die erste Koordinate exakt der Mod-111-Rest. Wegen \(111\equiv1\pmod{11}\) ist die Rückprojektion auf das lokale 11er-Feld **exakt**:

\[
n\bmod11=(x+y)\bmod11.
\]

Diese Identität wurde für **alle 12 321 Punkte** erschöpfend geprüft. Sie benutzt *beide* Feldkoordinaten; allein \(x\bmod11\) funktioniert schon innerhalb der vier Beispiele nicht durchgängig.

## Vorab offen gelegte Kopplung an die √7-Folge

| Dyadische Marke | Binärkern als Linksshift | Punkt (x,y) im 111×111-Feld | Mod 111 | Mod 11 | **zugewiesener** 4D-Punkt | Radius² |
| --- | --- | --- | ---: | ---: | --- | ---: |
| 101 | `1100101` | (101,0) | 101 | 2 | (0,0,0,0) | 0 |
| 202 | `11001010` | (91,1) | 91 | 4 | (1,1,1,0) | 3 |
| **404** | `110010100` | **(71,3)** | 71 | 8 | (1,1,1,1) | **4** |
| 808 | `1100101000` | (31,7) | 31 | 5 | (1,1,2,1) | **7** |

Der dyadische **Binärkern** 1100101 erhält unter reiner Multiplikation mit 2 rechts eine zusätzliche Null; die Anzahl gesetzter Bits bleibt hier 4. Die *Position* im Mod-11-Feld wandert dagegen 2→4→8→5, im Mod-111-Feld 101→91→71→31. Bei Fortsetzung hat die Verdopplungsfolge auf der Mod-11-Skala Periode 10 und auf der Mod-111-Skala Periode 36. „Identität“ kann in diesem Test die Regel oder ein getrackter Binärkern sein; sie ist **keine gleiche Restklasse** bei jedem Schritt.

Die auf die vier Marken gelegte 4D-Folge besitzt Radius² 0→3→4→7 und den gewählten 47→74-Wechsel von 202 nach 404. 404 kann damit **als designierter innerer Gate-Marker** geführt werden, 808 als √7-Endpunkt. Die Übereinstimmung kommt aus einer angegebenen Zuordnungsregel; die Verdopplung 101·2^k allein wählt keine 4D-Koordinate und keinen 404-Gate-Input.

## Feldrand: Warum ein zusätzlicher Record nötig ist

Die erste dyadische Marke außerhalb der 12 321 Feldplätze ist **12 928 = 101·2⁷**. Im ersten Feld wäre nur ihre *lokale* Lage sichtbar: \(12\,928=12\,321+607\), also Feldnummer \(t=1\) und \((x,y)=(52,5)\). Die lokalen Koordinaten geben \((52+5)\bmod11=2\), tatsächlich gilt aber \(12\,928\bmod11=3\). Der Grund: \(111^2\equiv1\pmod{11}\), also verändert ein Feldumlauf den lokalen 11er-Rest.

Mit einer getrackten **Feldnummer** \(t\) wird die korrekte Regel:

\[
n=111^2t+111y+x\quad\Longrightarrow\quad n\bmod11=(t+y+x)\bmod11.
\]

Für 12 928 liefert \((1+5+52)\bmod11=3\). Dieses \(t\) ist ein erforderlicher **Index-/Record-Anteil für eine fortlaufende Kodierung**, keine behauptete physikalische Zeitachse. Gerade weil ein lokaler Feldpunkt seine Herkunft nicht allein verrät, ist der Bezug zum früheren Return/Trace-Gedanken präzise, aber weiterhin modelliert.

## Negative Kontrollen und Korrektur der Bildunterschrift

- Die Projektion `nur x mod 11` scheitert; die Projektion `x + dyadischer Schrittindex` scheitert ebenfalls. Die Zeilenregel liefert den benötigten zweiten Anteil.
- `n mod 12 321` als periodisches Feld **ohne** Feldnummer ist kein konsistenter Lift zu `n mod 11`: Der erste zurückgefaltete Wert 12 321 wäre lokal 0, tatsächlich ist sein Rest mod 11 gleich **1**.
- Das auf v55 gezeigte Beispiel bezeichnet die Dezimalzahl **7801**, schreibt daneben aber `0001 1110 1000 0001₂` = **7809**. Richtig für 7801 ist `0001 1110 0111 1001₂`. Diese Beschriftung ist vor Übernahme in einen binären Prüfstand zu korrigieren.
- Die v55-Tafel bezeichnet `δ=±1/112` als Drift. Aus den Restklassen 0…110 oder der obigen Zeilenregel folgt dieser normierte Schritt **nicht**; dafür wäre eine gesonderte Skalendefinition nötig.

## Aussagekraft

**Exakt geprüft:** 111²=12 321, die vollständige Zeilen/Spalten-Zerlegung im ersten Feld, die kompatible Mod-11-Rückprojektion, die Restfolgen und Perioden, die erste Feldgrenze und die Binärkorrektur.

**Offen:** Warum aus den möglichen Einbettungen gerade die Zeilen/Spalten-Regel und die 4D-Zuordnung für das NEXAH-Bild gelten sollen. Die beigefügte CROSS-EMP-Audit-Tafel fordert für Identität bei mehreren kompatiblen Repräsentationen ausdrücklich **unabhängige Kontrastinformation**. Eine zweite Achse als gewählte Kodierung genügt noch nicht als solcher unabhängiger Nachweis.

## Reproduktion

`python3 ROOT7_111_FIELD_BRIDGE.py` erzeugt `ROOT7_111_FIELD_RESULTS.json`, prüft alle 12 321 Feldpunkte und alle oben genannten Kontrollen. Python-Standardbibliothek genügt. E8/H4 bleibt eine getrennte Referenz und wird durch diese Modulo-Feldabbildung nicht identifiziert.
