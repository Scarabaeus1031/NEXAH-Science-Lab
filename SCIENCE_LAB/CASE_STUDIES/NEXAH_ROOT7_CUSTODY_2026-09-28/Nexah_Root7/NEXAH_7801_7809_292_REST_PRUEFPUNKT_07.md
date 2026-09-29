# NEXAH: 7801 / 7809 / 292 — Rest und Schaltregel

Stand: 28. September 2026. Anschluss an `ROOT7_111_FIELD_README.md` (Prüfpunkt 06) und die vier Karten CARD_08, Core Architecture, Mirror Iteration v9.6 und Master Overview v9.5.

## 1. Beobachtungen und Rechnungen

| Zahl | Exakte Zerlegung | Binär (16 Bit) | `(x,y)` im 111×111-Feld | `n mod 11` | `n mod 112` |
|---|---|---|---|---:|---:|
| 7801 | 29·269 | `0001 1110 0111 1001` | (31,70) | 2 | 73 |
| 7809 | 3·19·137 | `0001 1110 1000 0001` | (39,70) | 10 | 81 |

Feldabbildung wie in Prüfpunkt 06 **gewählt**: `n=x+111y`, `0≤x,y<111`. Damit liegen beide Zahlen in derselben Zeile und acht Spalten auseinander: `7809−7801=8`. Ihre Verschiedenheit erklärt den Fehler der älteren Binärbeschriftung; sie ist kein nachgewiesener zusätzlicher Jahresschritt. Beide sind `1 mod 8`, daher zeigt die Differenz keine verschiedene Klasse im ursprünglichen √7-Ausschluss `4^a(8b+7)`.

Die Zeile der 7809 enthält auch den Faktor 137, der in CARD_08 als Winkel vorkommt. Faktor 137 und Winkel 137° sind verschiedene Größen; ohne Abbildungsregel besteht daraus keine Winkelresonanz.

## 2. Was die vier Karten tatsächlich festlegen

- Core Architecture und Mirror Iteration markieren `292` als „NCS Switch“ in einer 2×2-Zeichnung. CARD_08 zeichnet ihn als kritische Kreuzung vor dem „Gap Jump“ und Rückweg. Das sind **Rollen und Reihenfolgen**, keine aus den Karten ablesbare arithmetische Schaltfunktion.
- Die Karten schreiben die Folge `404→808→1616→3232→6464→12928`. Diese Glieder sind exakte Verdoppelungen: `12928=101·2^7`.
- CARD_08 nennt an `12928` einen Sprung und eine spätere Rückverbindung. Im gewählten **endlichen** Zeilenmodell ist `12928=12321+607` und der lokale Punkt `(52,5)` in Kachel 1. Damit ist eine Kachelgrenze überschritten; das bestätigt keine physikalische Lücke.
- Die Beschriftung „12928 = 292 NCS“ in Core Architecture kann keine Gleichheit ganzer Zahlen meinen: `12928 mod 292=80`. Wenn das Gleichheitszeichen eine Zustandszuweisung meint, braucht sie eine definierte Funktion, etwa `S(n)=292` für nachweisbar spezifizierte Übergänge.
- `2^n−0−2^n` ergibt als arithmetischer Ausdruck 0; in der Karte kann er als Spiegelnotation gelesen werden. Beides sollte getrennt beschriftet sein.

## 3. Rest versus Schaltjahr

Ein **Rest** ist erst nach Angabe der Periode bestimmt: Beispielsweise `7801 mod 11=2`, `7809 mod 11=10`; im gewählten 111-Feld liegen beide acht Spalten auseinander; `12928 mod 12321=607`. Keiner dieser Reste ist automatisch ein Schaltjahr oder die 292-Schaltung. Ein Schaltjahr ist ein gutes *Modellbild*: periodischer Phasenfehler sammelt sich, und ein festgelegter Schwellwert löst eine Korrektur aus. Eine mathematische Verbindung braucht die Periodenlänge, die akkumulierte Drift, die Schwelle und die konkrete Korrekturregel. `δ=1/112` in Core Architecture gibt zwar eine Zahl an, aber weder Zeiteinheit noch Abbildung auf den Index 292/12928. Beispielsweise `112·δ=1` per Definition; daraus folgt allein noch kein Schaltzyklus.

## 4. Nächster unterscheidender Test

Die 292-Schaltung als expliziten Operator `S(state,phase)` definieren, dessen Ein- und Ausgabe aus vorhandenen NEXAH-Daten **unabhängig** markiert sind. Vorhersage vor Einsicht in weitere Zustände fixieren: Soll bei `7801→7809` der Switch auslösen, und weshalb genau bei diesem Schritt? Dasselbe auf Nachbarn `7793→7801` und `7809→7817` anwenden (ebenfalls `+8`). Nur wenn die Regel den behaupteten Übergang von Kontrollen trennt, wird aus dem gemeinsamen Bild eine geprüfte Verbindung. Zweiter Test: `12928` am Kachelrand gegen andere Verdopplungsfolgen gleicher Länge; die gewählte 101-Folge allein beweist keine einzigartige Gap-Dynamik.

**Status:** Die Zahlenkorrektur, Faktoren und Feldpositionen sind exakt; „Rest/Schaltjahr/Stretch“ ist derzeit eine plausible Konstruktionsanalogie; `292` ist auf den Karten ein benannter Switch ohne getestete Eingabe-Ausgabe-Regel.
