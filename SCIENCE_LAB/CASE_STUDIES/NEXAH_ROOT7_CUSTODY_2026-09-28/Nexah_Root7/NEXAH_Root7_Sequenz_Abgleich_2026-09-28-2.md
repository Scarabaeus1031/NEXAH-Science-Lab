# NEXAH: √7, Sequenz und Träger — Abgleich vor weiteren Tests

Stand: 28.09.2026 · Status: begrenzter Modelltest, keine neue mathematische oder physikalische Behauptung

## 1. Bereits festgelegt

| Arbeit | Verwendeter Gegenstand | Grenze für diese Prüfung |
| --- | --- | --- |
| Root Space 8→16 | Unabhängige Vorzeichen von √2, √3, √5 und √7: 8→16 Zustände; Zustandsgraph eines Tesserakts | Die Kante des vierten Kanals hat dadurch keine festgelegte metrische Länge √7. |
| TESSAREC Q°×ι Pearl | Projizierter 4D-Träger, 3D-Schnitt, veränderlicher Layer und diagonaler Cut | Keine Definition eines ganzzahligen 4D-Gitters oder einer festen √7-Strecke. |
| Open Shell OS 10/11 | State, Transform, Cut, Record, Comparison, Residual, Return; keine erzwungene Closure | Dort ist 1:2:1 eine Gewichtungsmaske 1/4:1/2:1/4, hier sind es Seitenlängen. |
| E8-REP-03 | Reproduzierbarer E8→H4→Coxeter-Projektionsbenchmark, mit positiven und negativen Invariantentests | E8 ist kein √7-Würfel; E8-Vektoren haben gerade quadrierte Norm. |

## 2. Trennschärfetest: dieselben Endpunkte, andere Reihenfolge

Euklidischer Träger: \(\mathbb Z^4\). Ursprung \(O=(0,0,0,0)\). Ausgang \(A=(1,1,0,0)\). Ziel \(D=(1,1,2,1)\). Zwei Translationen:

- \(S(x)=x+(0,0,2,0)\): Stretch.
- \(L(x)=x+(0,0,0,1)\): Lift.

| Route | Zustände | Quadrierte Abstände von O | Quadrierte **Schritt**längen | 3D-Projektion ohne w |
| --- | --- | --- | --- | --- |
| S, dann L | A→B=(1,1,2,0)→D | 2→6→7 | 4→1 | (1,1,0)→(1,1,2)→(1,1,2) |
| L, dann S | A→C=(1,1,0,1)→D | 2→3→7 | 1→4 | (1,1,0)→(1,1,0)→(1,1,2) |

**Befund:** Beide Routen erreichen genau denselben √7-Endpunkt. Die Endkoordinate, die quadrierte Endlänge 7 und die ungerichtete Menge der Schrittlängen {1,2} bleiben erhalten. Zwischenradien, Schrittordnung und der Zeitpunkt, an dem sich der projizierte 3D-Punkt verändert, unterscheiden sich. \(S\) und \(L\) kommutieren: \(S(L(A))=L(S(A))=D\). Aus dem Endpunkt allein lässt sich die Folge deshalb nicht zurückgewinnen.

Eine Nachfolger-Relation \(R_\sigma=\{(q_i,q_{i+1})\}\) entsteht erst nach Wahl einer Folge \(\sigma\). Die Folge liefert einen diskreten Zeitindex, jedoch keine Dauer. Ein Beobachtungsrecord muss die Zwischenschritte festhalten, wenn die Reihenfolge erhalten bleiben soll.

## 3. E8 als Negativkontrolle

Nach Ergänzung um vier Nullen erfüllen A (Koordinatensumme 2) und B (Summe 4) die ganzzahlige E8-Paritätsbedingung. C hat Summe 3, D Summe 5: Sie liegen in dieser Einbettung nicht im E8-Gitter. Allgemeiner sind quadrierte Normen aller E8-Gittervektoren gerade; auch Differenzen zweier E8-Gitterpunkte sind E8-Vektoren. Eine unskalierte E8-Gitterdistanz √7 ist ausgeschlossen. Die 8D-Umgebung \(\mathbb Z^8\) dagegen enthält √7-Strecken. Diese Unterscheidung gilt unabhängig von Bildern einer Projektion.

## 4. Entscheidung und nächste Schritte

**Entscheidung:** Die √7-Konstruktion ist ein explizites euklidisches Beispiel für die INTAKT-Frage, was eine Projektion von einer zeitlich geordneten Zustandsfolge verliert. Sie ist keine identische Fortsetzung von E8, TESSAREC-Schnitt und Open-Shell-Gewichtung.

1. **Typen fixieren:** Zustandsraum der Wurzelzeichen, \(\mathbb Z^4\)-Gitter, E8-Gitter, Schnittbild und Sequenzrecord als unterschiedliche Träger deklarieren.
2. **Brückenoperator definieren:** Gibt es eine benannte Abbildung vom binären √7-Kanal zum Koordinatenwert \(w\) mit festgelegter Skala, Metrik und Verlustbeschreibung? Die bisherige Wahl \(w=(s+1)/2\) ist eine Kodierung, kein aus den anderen Arbeiten abgeleiteter Satz.
3. **Record testen:** Für beide oben berechneten Routen dieselbe Beobachtungsregel anwenden. Prüfen, ob der Record die Reihenfolge rekonstruiert und welcher Rest bei der 3D-Projektion bleibt. Ohne Zwischenrecord kann die Endlage S und L nicht unterscheiden.
4. **Erst danach INTAKT-Bindung prüfen:** Für Open Shell einen Zustands-, Transform-, Cut-, Record- und Residual-Eintrag ausfüllen. Das 1:2:1 der Gewichtungen und das 1:2:1 der Seitenlängen getrennt führen.

Quellen im eigenen Bestand: `NEXAH_TESSERACT_ROOT_SPACE_8_TO_16 7.html`; `NEXAH_TESSAREC_Q_IOTA_PEARL(1).html`; `NEXAH_OS10_Open_Shell_Abschlussbericht_2026-09-13.docx`; `NEXAH_E8_REP_03_BENCHMARK.zip` (`README.md`, `REPORT.md`, `REPRESENTATION_LEDGER.md`, `outputs/results.json`).

## 5. Nachtrag: 1:2:1 → 4|77|4 und der Record-Test

Die vom Nutzer beigefügten Platten zeigen 4774 als Spiegelwort (4·7·7·4), dessen Hälften 47 und 74 verschieden sind. Eine Platte bezeichnet die Verbindung zum historischen Code ausdrücklich als ungelöst; eine andere leitet für jede vierstellige Palindromzahl \(abba\) die Hälften \(10a+b\), \(10b+a\) und den Abstand \(9(b-a)\) her. Für \(a=4,b=7\) ist dieser Abstand 27.

**Zwei mögliche Lesarten, strikt getrennt:**

| Lesart | Rechnung | Entscheidung |
| --- | --- | --- |
| Geometrisches Verhältnis 1:2:1 → 4:77:4 | \((1,2,1)/4=(1/4,1/2,1/4)\) und \((4,77,4)/85=(4/85,77/85,4/85)\) | Keine proportionale Abbildung; dies darf nicht als gleiche Geometrie gelten. Skalierung mit 4 ergäbe 4:8:4. |
| Rollenbezogener Code | Äußere Rolle je „4“, zwei innere Rollen je „7“: \((1,2,1)\xrightarrow{\text{Mitte teilen}}(1,1,1,1)\xrightarrow{\text{Rollenlabels}}(4,7,7,4)\) | Definierte Symbolübersetzung. Das Gruppieren ergibt 4:14:4 = 2:7:2, nicht 1:2:1. Die ursprünglichen Längen gehen verloren. |

4774 bleibt unter Umkehrung gleich. Der vollständige vierstellige Code unterscheidet daher **Stretch→Lift** nicht von **Lift→Stretch**. Mit einer zusätzlichen Leseregel können die Hälften 47 und 74 als gerichtete Marker dienen; die Zuordnung einer Hälfte zu einer konkreten Operation ist aber noch nicht durch die bisherigen Gitterdaten bestimmt. Die Zahl 27 ist eine korrekte Differenz zwischen den Hälften, keine beobachtete Zeitdauer oder √7-Metrik.

**Record-Test mit expliziter Beobachtungsregel:**

| Record | Route S→L | Route L→S | Reihenfolge unterscheidbar? |
| --- | --- | --- | --- |
| Nur Endzustand \(D\) | (1,1,2,1) | (1,1,2,1) | Nein |
| Statischer Code 4774 | 4774 | 4774 | Nein |
| Folge der 3D-Projektionen \(\pi_3(q_i)\) | (1,1,0)→(1,1,2)→(1,1,2) | (1,1,0)→(1,1,0)→(1,1,2) | Ja: Reihenfolge der sichtbaren Änderung; w-Wert dabei nicht direkt sichtbar |
| Typisierter Operatorrecord | [S,L] | [L,S] | Ja, per Definition des Records |

Der sinnvolle nächste Versuch ist deshalb eine **vorab festgelegte** Abbildung von Ereignissen und Schnitten auf 47/74. Nur wenn diese Abbildung unabhängig von der gewünschten Antwort definiert und auch an Gegenbeispielen geprüft ist, taugt der Code als brauchbarer INTAKT-Record. Die beigefügten EXP-31-, CRT- und Spektralbilder belegen jeweils andere Operatoren und tragen ohne solche Abbildung keine Aussage über die hier berechneten Gitterstrecken.
