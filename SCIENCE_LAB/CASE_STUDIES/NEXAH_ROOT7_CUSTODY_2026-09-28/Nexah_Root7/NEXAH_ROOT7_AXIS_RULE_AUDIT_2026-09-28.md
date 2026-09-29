# NEXAH √7 — Prüfpunkt 1: Achsenregel und Quellenabgleich

Stand: 28.09.2026 · Ergebnis: **keine aus den geprüften Quellen abgeleitete eindeutige Streckachse**

## Präzise Frage

Der Vorzeichengraph besitzt 16 Zustände aus vier unterscheidbaren Kanälen √2, √3, √5, √7. Eine euklidische Einbettung mit ganzzahligen positiven Seitenlängen und langer Diagonale √7 benötigt Seitenlängen als eine Permutation von `(2,1,1,1)`. Welche Quelle setzt verbindlich die Seite 2 auf welchen der vier Kanäle? Ein gezeichnetes Segment oder die Kennzeichnung „√7-Kanal“ reicht ohne eine Längenabbildung nicht.

## Quellen und Befund

| Quelle | Tatsächlich spezifizierte Beziehung | Wählt sie eine Streckachse für den Vorzeichengraphen? |
| --- | --- | --- |
| `NEXAH_TESSERACT_ROOT_SPACE_8_TO_16 7.html` (bestehender Upload) | Drei unabhängige Wurzelzeichen √2, √3, √5 werden um √7 erweitert; 8→16 Zustände. X/Y/Z sind gezeichnete Projektionsrichtungen; √7 ist die vierte Zeichenrolle. | **Nein:** Weder Kantenlängenskala noch Zuordnung des gezeichneten Abstandes zu euklidischer 4D-Metrik. |
| `NEXAH_TESSAREC_Q_IOTA_PEARL(1).html` (bestehender Upload) | Projizierter 4D-Träger; einstellbare Q-Lage, Iota-Schnittrichtung und Tiefe. | **Nein:** variable Projektion, keine festgelegten Gitterseiten 1 oder 2. |
| `NEXAH_OS10_Open_Shell_Abschlussbericht_2026-09-13.docx` | Die 1:2:1-Struktur ist ausdrücklich eine Gewichtungsmaske 1/4:1/2:1/4; Transformation, Cut, Record und Return sind getrennte Rollen. | **Nein:** keine metrische Seitenlängenregel. |
| `NEXAH_Root7_Tesseract_Bridge.html` (unser Arbeitsvisual) | Definiert einen **gewählten** 3D-Doppelwürfel `(2,1,1)` und einen Einheitsschritt auf `w`; an anderer Stelle nutzt es die dazu achsenvertauschte Folge `(1,1,0,0)→(1,1,2,0)→(1,1,2,1)`. Es erklärt selbst, dass `(2,1,1)` und `(1,1,2)` vertauschte Achsen sind. | **Als Modell ja, als unabhängige Ableitung nein:** der Text setzt die lange Achse in der Zeichnung auf `x`, im Folgenbeispiel auf `z`; die Gleichheit der Längen ist rotationsbedingt, nicht die Auswahl einer namentlich festgelegten Wurzelzeichenachse. |
| `NEXAH_E8_REP_03_BENCHMARK.zip` und unser unverändertes E8-Referenzarchiv | E8/H4-Projektion und Kantentests mit 19/19 PASS; E8 als gerades Gitter hat keine unskalierte √7-Gitterdistanz. | **Nein:** andere Trägerklasse und Metrik; liefert Kontrollen für Repräsentationswechsel. |
| `Plan_H5_Prime_Connectors(1).png` (neuer Upload) | Gezeichnete Verbindungen zwischen u. a. 37–113, 44–7 und 59–118 sowie eine markierte 111.11-Achse. | **Nein:** keine Definition einer Funktion von diesen Markern auf die vier Gitterachsen oder deren Längen. Insbesondere sind 44 und 118 keine Primzahlen; der Bildtitel allein ist keine Primzahlauswahlregel. |
| `APPENDIX D EVIDENCE & EXPERIMENTS BUILDING EVIDENCE FOR ORIENTATION THEORY(1).png` (neuer Upload) | Forderung nach Beobachtung, Experiment, Replikation und messbarem Nutzen. | **Nein:** hilfreiches Evidenzprotokoll, keine geometrische Definition. |
| `369572ac-8d7d-4d44-8057-fb0bb16f3f53.png` (neuer Upload, Ori’n-Tafel) | Hypothese, dass kritische Strukturen Re-Skalierung und Projektion überstehen; geplante Kontrollwechsel. | **Nein:** Anforderung an Invarianztests, keine √7-Achsenwahl. |

## Vergleich zweier klar formulierter Varianten

Sei `b=(b0,b1,b2,b3) ∈ {0,1}⁴`, mit Rolle `b3=0→47`, `b3=1→74`.

| Modellregel | Einbettung `f(b)` | 47→74 bei gleichen ersten Bits: Änderung von Norm² | Beschriftete Diagonalquadrate der Schnitte `(xyz,xyw)` |
| --- | --- | ---: | --- |
| **A, gewählte lange dritte Achse** | `(b0,b1,2b2,b3)` | +1 | `(6,3)` |
| **B, gewählte lange vierte Achse** | `(b0,b1,b2,2b3)` | +4 | `(3,6)` |

Beide Endpunkte besitzen Norm² 7. Die zwei vorab beschrifteten, metrisch kalibrierten Schnitte unterscheiden die Regeln. Das ist eine **Folge der zwei Definitionen**, kein Beweis, dass eine der Quellen A oder B fordert. Auch `x` statt `z` als lange Achse bleibt eine zulässige dritte Koordinatenwahl mit derselben √7-Diagonale. Die Primzahlkette 2,3,5,7 ordnet Namen, gibt ihnen jedoch weder räumliche Kantenlängen noch Einheiten.

## Entscheidung für den INTAKT-Fall

**Status: OPEN AXIS BINDING.** Für den bisherigen Test wird A als explizite Arbeitskonvention geführt. B bleibt eigenständiger, prüfbarer Kandidat; die `x`-Achse des frühen Visuals ist eine weitere Permutation, kein dritter mathematischer √7-Mechanismus. Die neuen Tafeln liefern Prüfprinzipien und visuelle Relationen, jedoch keine fehlende Brückenabbildung.

Nächste zulässige Festlegung: eine Quelle oder ein neues, vor einem Folgetest registriertes Mapping `Kanal → Achse → Länge`, mit benanntem Referenzrahmen und gemessener oder ausdrücklich nur modellierter Längeneinheit. Eine bloße Wahl darf als Designentscheidung getroffen werden; dann muss sie als **Definition**, nicht als aus E8, Primzahlen oder dem Bildmaterial abgeleitete Notwendigkeit ausgewiesen werden.

Reproduktion der Aussagen zu 16 Zuständen, zwei Schnitten und E8/H4-Kanten: `NEXAH_ROOT7_INTAKT_RECORD_TEST_01.zip`, Version des Prüfstands vom 28.09.2026.

## Nachtrag: Herleitungspaket Plan H3 bis O (20 Bildtafeln)

Die zusätzlich übermittelten Tafeln präzisieren eine **Abfolge von Ordnungs- und Projektionsschritten**. Die Übersicht ordnet die auf den Bildern lesbaren Regeln nach ihrem jeweiligen mathematischen Träger; „Achse“ bezeichnet dort je nach Tafel eine gezeichnete Richtung, eine Zahlengerade oder eine zeitliche Kreisposition und deshalb noch keine 4D-Koordinate.

| Tafelgruppe | Explizit erkennbarer Übergang | Träger und Aussagekraft für √7 |
| --- | --- | --- |
| `PlanH3_IO_Spine_Resonance_QSpace(1).png` | Im 11×11-Zahlengitter folgt die markierte Diagonale 12, 24, 36, …, 84 dem Schritt +12; zusätzlich sind 7 und 44 markiert. | Ganzzahliges 2D-Gitter mit Indexfolge. Eine diagonale **Indexänderung** ist ohne Maßstabsangabe keine euklidische Strecke 12 und legt keine vierte Würfelkante fest. |
| `TimeWheel_TAO_DAO(2).png`, `PlanJ_North_South_Symmetry(1).png`, `Retrograde_Parity_Closure(1).png` | Woche Θ(7), Monate TAO(12), AM/PM und Nord/Süd bzw. Rücklauf werden zu periodischen und vorzeichenbehafteten Lagen geordnet. | Sequenz, Zeitmarkierung und Parität sind sinnvoll beschriftet; der Übergang von Zeitschritt/Spiegelung zu 4D-Kantenlänge ist nicht angegeben. |
| `Plan K – DAO · Θ(9) · Resonanz-Zirkelpunkt (161.111)(2).png`, Screenshot, `PlanK1_DAO_Clean.png`, `PlanK2_DAO_Resonant.png` | Neun beschriftete Punkte Θ1–Θ9 liegen auf einem Kreis, mit Sehnen, Zentrum 111 und Marker 161.111. | Ein definierter planarer Beziehungsgraph; gezeichnete Sehnen liefern ohne Radius und Zuordnungsregel keine √7-Gitterstrecke. |
| `PlanK3_Ratio_Bridge(1).png`, `PlanK3b_Tangent_Marker(1).png`, `PlanK4_MacroMicro_Drift(1).png` | Zahlenbrücken und dimensionslose Quotienten wie 161/161111 ≈ 1/1001 sowie eine Tangentenmarkierung um 37,3° verbinden die Kreisbilder. | Die Faktorisierung 1001 = 7·11·13 enthält die Zahl 7, bestimmt aber keine 4D-Längenquadrate; Quotienten und Winkel brauchen eine gesonderte metrische Einbettung. |
| `PlanL_V0_90_Elements_Folding.png`, `PlanL_V0_90_Minimal.png`, `PlanL_V0_90_ThetaRing(1).png` | Strahlen und Faltung markieren u. a. 0°, 90°, 33° und 45°. | Planare Winkelordnung. Ein Winkel von 45° kann in einem Einheitsquadrat eine √2-Diagonale illustrieren; die Tafel spezifiziert jedoch keine Einheit und keine √7-Achsenbindung. |
| `PlanO_Mobius_Order(2).png` | Kreisordnung M→N→O und beschriftete Verhältnisse 1:1, 2:3 und 4:3 sowie Prim-/Zahlmarker 23, 42, 11. | Eine benannte Folge von Achsenverhältnissen im Bild; weder vier orthogonale Koordinaten noch vier Seitenlängen (1,1,2,1) werden festgesetzt. 42 ist zusammengesetzt. |
| `Resonanz-Achse_mit_Prime-Paar_97–103_und_Zentrum_111.png`, `resonance_ratio_246_420.png`, `square_234211.png`, `prime_234211.png`, `totient_234211.png` | Zahlengerade, Verhältnisbild und arithmetische Kennzahlen ergänzen die Folgelesart. | Keine im Bild ausgeschriebene Abbildung der arithmetischen Marker auf die vier Vorzeichenkanäle und ihre euklidischen Kantenlängen. |

**Ergebnis des Nachtrags:** Die Bilder liefern eine nachvollziehbare Herkunft für Reihenfolge, Spiegelung und projektive „Schattenachsen“. Damit ist die Interpretation der Zustandsfolge als *modellierte Zeitordnung* konkreter belegt. Die geprüften Tafeln enthalten weiterhin keine Regel `√2/√3/√5/√7-Kanal → Koordinatenachse → Kantenlänge`. Insbesondere folgt aus dem Marker 7, aus einer neunfachen Kreisordnung oder aus dem Verhältnis 1:2:1 nicht, welcher namentlich fixierte Kanal im Vektor `(1,1,2,1)` die Länge 2 erhält. Die zwei oben formulierten Modelle A und B bleiben nach diesem Quellenabgleich unterscheidbare, mit den Bildern vereinbare **Arbeitsdefinitionen**, nicht konkurrierende aus den Bildern bewiesene Aussagen.

**Konkreter nächster Prüfpunkt:** Eine einzige explizite Brückenregel mitsamt Typen angeben, etwa `Kanal √5 ↦ z ↦ Länge 2`, plus die Längen der drei übrigen Kanäle. Danach lassen sich beide beschrifteten 3D-Schnitte, der 47→74-Wechsel und die E8/H4-Kontrollen gegen dieselbe vorab registrierte Regel prüfen. Eine solche Wahl wäre ein legitimer Aufbau des NEXAH-Modells, solange ihre Herkunft als Festlegung gekennzeichnet wird.
