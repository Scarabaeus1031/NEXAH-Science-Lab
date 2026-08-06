# V39 — Controlled Return ist kein freies Basin

Status: `BOUNDED METHOD NOTE — NO TRANSFER CLAIM`

Datum: 2026-08-06

## Kernaussage

Die in `navigator_v39_fixpoint_extraction.py` berechnete Return-Frac misst die
Retention unter einem zielgerichteten Controller. Sie misst nicht den
Basin-Radius des freien kombinierten Vektorfeldes.

## Warum

Jeder v39-Schritt enthält:

```text
combined_field
+ 0.35 * (target - x)
+ capture_hook_field(x, target).
```

Der resultierende Vektor wird anschließend normiert und mit konstanter
Schrittweite angewandt. Ziel-Bias, Capture-Hook, endlicher Horizont,
Schrittweite und Return-Toleranz bestimmen daher gemeinsam das Ergebnis.

## Zulässige Bezeichnungen

| Statt | Verwenden |
| --- | --- |
| Fixpoint | controlled endpoint center oder controlled fixpoint estimate |
| Basin radius | largest tested controlled-retention radius |
| Return fraction | controlled return fraction |
| attractor stability | controller-dependent finite-horizon retention |

Die bisherigen Feldnamen können aus Reproduktionsgründen in
maschinenlesbaren Artefakten erhalten bleiben, müssen aber im Bericht durch
die Methodengrenze qualifiziert werden.

## Aktueller Messstand

Unter dem gepaarten v39-Protokoll:

| Radius | C2 controlled return | C3 controlled return |
| ---: | ---: | ---: |
| 0.2 | 1.00 | 1.00 |
| 0.4 | 1.00 | 1.00 |
| 0.6 | 1.00 | 1.00 |
| 0.8 | 1.00 | 1.00 |
| 1.0 | 1.00 | 1.00 |
| 1.2 | 1.00 | 0.75 |

Damit ist C3 unter diesem Controller bis zum getesteten Radius `1.0`
vollständig retiniert. Bei `r=1.2` verfehlen 10 von 40 Seeds das deklarierte
Return-Kriterium. Eine freie Basin-Grenze folgt daraus nicht.

## Freie Felddiagnostik

Die deklarierten C2- und C3-Zentren sind keine Nullstellen von
`combined_field`. Eine lokale Jacobi-Matrix an diesen Punkten ist deshalb kein
Fixpunkt-Stabilitätszertifikat. Der niedrigere Scalar-Field-Wert bei C3 ist
ebenfalls kein Nachweis eines attraktiven Potentialminimums, weil die
implementierte freie Dynamik `+grad(scalar_field)` verwendet.

## Nächster separater Test

Der Übergang C3 nach C2 muss als eigener Versuch mit mindestens folgenden
Bedingungen ausgeführt werden:

1. freies kombiniertes Feld;
2. deklarierter minimaler Control-Term;
3. Capture-Hook;
4. Regime-Lock an und aus.

Pro Bedingung sind Erfolgsrate, Übergangszeit, Kontrollkosten und Rückfallrate
zu berichten. Die v39-Retention darf nicht als vorweggenommener
Übergangsnachweis verwendet werden.

