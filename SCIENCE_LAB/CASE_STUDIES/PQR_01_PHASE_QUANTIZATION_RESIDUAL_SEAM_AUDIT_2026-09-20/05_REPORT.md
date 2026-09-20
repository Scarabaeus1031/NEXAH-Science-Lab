# PQR-01 — Phase Quantization & Residual-Seam Audit

## Status

**COMPLETE — POST-HOC EXPLORATORY REPRESENTATION AUDIT**

Die Analyse fragt nicht, ob eine beobachtete Ziffernfolge interessant aussieht, sondern ob sie eine robuste Eigenschaft des Messsignals ist. Die Wahl von drei Nachkommastellen erfolgte nach Sichtung von `393` und `696`; deshalb ist dieser Lauf explorativ und kein konfirmatorischer Test.

## Datengrundlage

- 72 zyklusweise Phasenwerte aus PHX-01
- 12 abgeleitete Zusammenfassungen: acht zirkuläre Cut-Mittel und vier gepaarte zirkuläre Mittelverschiebungen
- 5 Darstellungen: Grad, Radian/π, Zyklusanteil, φ-Skalierung als Kontrolle und √2-Skalierung als Kontrolle
- 2 Quantisierer: kaufmännisches Runden (`ROUND_HALF_UP`) und Abschneiden gegen null
- 5 Präzisionen: zwei bis sechs Nachkommastellen
- insgesamt 4.200 vorab spezifizierte Repräsentationsdatensätze

## Zentrales Resultat

Die beiden auffälligen Folgen existieren als wohldefinierte **Dezimalcodes**, aber nicht als darstellungsinvariante Eigenschaften der Phase.

| Träger | voller Messwert | Grad, 3 Stellen | Zerlegung des Codes | Stabilität desselben Codes im Bootstrap |
|---|---:|---:|---:|---:|
| P10, A, a2, Cut-Mittel | 5.392686782380991° | 393 | 3 × 131 | 1,175 % |
| P05, a1, gepaarte Verschiebung | −0.6962206653352894° | 696 | 2³ × 3 × 29 | 1,260 % |

Das Minuszeichen gehört zum physikalischen Messwert; `696` ist der Code des Betrags der drei Dezimalstellen. Messwert, Vorzeichen, Ziffernstring und daraus gebildete Ganzzahl bleiben getrennte Typen.

### Präzisionsschnitt

- `5.392686…°` wird bei Rundung zu `39`, `393`, `3927`, `39269`, `392687`. Nur der Drei-Ziffern-Schnitt ist palindromisch.
- `−0.696220…°` wird bei Rundung zu `70`, `696`, `6962`, `69622`, `696221`. Auch hier ist nur der Drei-Ziffern-Schnitt palindromisch.
- Beim Abschneiden wird der erste Wert schon bei drei Stellen zu `392`; das Palindrom `393` verschwindet. `696` bleibt bei drei Stellen erhalten, verschwindet aber bei zwei beziehungsweise vier bis sechs Stellen.

### Darstellungswechsel bei drei Stellen

- `−0.696…°`: Grad `696`, Radian/π `012`, Zyklusanteil `002`, φ-Kontrolle `430`, √2-Kontrolle `492`.
- `5.392…°`: Grad `393`, Radian/π `094`, Zyklusanteil `015`, φ-Kontrolle `333`, √2-Kontrolle `813`.

Damit sind `393` und `696` keine Einheiteninvarianten. Das zusätzliche `333` in der φ-Kontrolle ist erwartbar als weiterer darstellungsabhängiger Treffer und verleiht φ keine privilegierte physikalische Rolle.

## Populationsprüfung

Für Grad, Rundung und drei Stellen ergaben sich:

- 72 Zyklen: 13 Palindrome (18,06 %) gegenüber 10 % Uniform-Null; unbereinigt `p = 0,0254`, nach FDR `q = 0,5460`.
- 12 Zusammenfassungen: 2 Palindrome (16,67 %) gegenüber 10 % Uniform-Null; `p = 0,3410`, `q = 1,0`.
- Primcodes bei 72 Zyklen: 16/72 (22,22 %); `p = 0,1423`, `q = 1,0`.
- Primcodes bei 12 Zusammenfassungen: 2/12 (16,67 %); `p = 0,6234`, `q = 1,0`.

Über alle festgelegten Kombinationen aus Korpus, Darstellung, Quantisierer und Präzision übersteht weder eine Palindrom- noch eine Primcode-Anreicherung die Benjamini-Hochberg-Korrektur.

## Binary/Trinary und Seam

Die binäre und trinäre Lesart wurde als unabhängige modulare Projektion definiert:

- `binary = integer_code mod 2`
- `trinary = integer_code mod 3`

Für die beiden markierten Werte bleibt im Bootstrap die gleiche Parität nur ungefähr zur Hälfte erhalten (49,1–50,9 %), die gleiche Restklasse modulo 3 ungefähr zu einem Drittel (33,6–33,7 %). Das entspricht einer groben, instabilen Klassifikation und keiner gekoppelten binär-trinären Signatur.

Der mathematisch belastbare Seam ist dagegen exakt:

`view_value = quantized_value + residual`

Alle 4.200 Rekonstruktionen schließen exakt. Das Residuum ist daher der saubere Informationskanal zwischen kontinuierlichem Messwert und diskretem Zifferncode. Es ist kein Fehlerrest und kein Beleg für eine verborgene Primstruktur.

## Zulässige Interpretation

1. `393` und `696` sind echte, reproduzierbar berechnete **post-hoc Dezimalmuster** in zwei ausgewählten Zusammenfassungen.
2. Sie sind nützliche Marker für einen Repräsentationsaudit und für die Untersuchung des Quantisierungs-Seams.
3. Sie sind nicht robust gegenüber Präzision, Einheit oder teilweise der Rundungsregel.
4. Die Daten tragen keine Aussage, dass Palindrome, Primfaktoren, φ oder √2 die gemessene Phasendynamik verursachen.
5. Der Euler-Handle ist sachlich passend: `exp(iθ)` gibt alle Winkel bis besser als 10⁻¹² Grad zurück. Riemann-, Ramanujan- und Gauss-Handles wurden nicht generisch aufgesetzt, weil hierfür kein passender mathematischer Operator aus dem Experiment folgt.

## Entscheidung

**Klassifikation:** `REPRESENTATION_PATTERNS_AUDITED_NO_PHYSICAL_OR_PRIME_CAUSATION_AUTHORIZED`

Der interessante wissenschaftliche Gegenstand ist nicht das einzelne Palindrom, sondern die Grenze zwischen kontinuierlicher Phase und gewähltem diskretem Zahlencode. Genau dort ist die Seam/Residual-Analyse sinnvoll.

## Empfohlener nächster Test

Ein echter Bestätigungstest müsste vor neuen Daten versiegeln:

- exakt eine Einheit und eine Präzision,
- exakt einen Quantisierer,
- exakt definierte Zielmuster,
- unabhängige neue Zyklen oder eine neue Kampagne,
- eine Nullverteilung, die Messunsicherheit und Abhängigkeiten der Zyklen abbildet.

Ohne diese Vorregistrierung sollte jede weitere Ziffern-, Prim- oder Handle-Suche ausdrücklich explorativ bleiben.
