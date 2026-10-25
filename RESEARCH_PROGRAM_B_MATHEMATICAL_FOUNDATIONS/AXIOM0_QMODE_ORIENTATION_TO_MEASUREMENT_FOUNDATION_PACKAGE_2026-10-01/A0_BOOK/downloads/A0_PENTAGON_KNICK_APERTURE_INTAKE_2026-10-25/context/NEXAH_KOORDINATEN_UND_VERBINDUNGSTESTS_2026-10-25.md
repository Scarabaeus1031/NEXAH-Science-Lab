Stand 25. Oktober 2026. **Arbeitsfokus:** Koordinaten, Punktadressen und Verbindungen zwischen dem Pentagon-Tubus und vorhandenen A0-Instrumenten prüfen. „∆@œ“ bleibt der gemeinsame Arbeitstitel; die Zeichenfolge besitzt noch keine festgelegte mathematische Operatorbedeutung. Die bisherigen Ideen bleiben im [Forschungsdokument](https://chatgpt.com/space/page_5b458ac0ac44819187ead8623da419af).

# Ausgangszustand und Koordinaten

Referenz aus der Aufnahme mit elf Hüllenecken: θ=−65,8°, Innenwinkel γ=137°, Abknickung β=43°, Pentagonseite s=1, gesamte Verbindungslänge L=1. Ansichtswinkel ψ=10°. Koordinaten sind normierte Längen; Winkel werden in Grad eingegeben. Die koaxiale, parallele Führung und radial nach außen gerichteten Mittelgelenke sind Modellvorgaben. Drei Gruppen A, M und B mit je fünf Punkten werden geprüft; Ringpunkte C und Spitze T sind in diesem ersten Test nicht enthalten.

| Punkt | x | y | z |
| - | -: | -: | -: |
| A0 | −0,462052 | 0,714223 | 0 |
| M0 | 0 | 0,897474 | 0,054105 |
| B0 | 0,462052 | 0,714223 | 0,108210 |
| A4 | 0,536485 | 0,660145 | 0 |
| M4 | 0,853548 | 0,277335 | 0,054105 |
| B4 | 0,822049 | −0,218730 | 0,108210 |

# Ausgeführte Verbindungstests

Geprüft wurden θ∈{36°; −65,8°} und ψ∈{10°; 90°; 180°; 270°}: acht Zustände mit jeweils 15 Punkten. Die Tests verwenden die Berechnungsfunktion des bestehenden Pentagon-HTML und den heruntergeladenen CRT16-Quelladapter. Es handelt sich um numerische Funktionstests.

| Prüfung | Ergebnis | Reichweite |
| - | - | - |
| Feste Halbstablängen Aᵢ–Mᵢ und Mᵢ–Bᵢ | Größter Fehler gegenüber 0,5: 1,67·10⁻¹⁶ | Alle acht Zustände |
| Projektion und Rückrechnung bei bekanntem ψ und z | 120 Rückrechnungen; größter Abstand 3,68·10⁻¹⁶ | Erhält Koordinaten innerhalb numerischer Genauigkeit |
| Unterscheidbarkeit der 15 projizierten Modellpunkte | Keine Kollision; kleinster Punktabstand ≈0,004927 | Nur die acht geprüften Zustände und diese endliche Punktliste |
| Partieller A0-Adressadapter | 15 verschiedene Quelladressen | Neu deklarierte Zuordnung, keine Live-Kopplung |
| Erhaltung der Gelenkstreben | 10 von 10 | Quellkanten zwischen benachbarten Decks |
| Erhaltung der Rahmenkanten | 8 von 10 | Beide Fünferringe schließen im gewählten Adapter nicht |

# Ansicht und Rückweg

Nach einer Drehung um ψ verwendet das HTML die Schrägprojektion X=x′+0,42y′ und Y=0,32y′−z. Ist z bekannt, folgt y′=(Y+z)/0,32 und x′=X−0,42y′; die inverse Drehung liefert x und y. Ohne Ebeneninformation ist die allgemeine räumliche Projektion mehrdeutig: Eine Verschiebung proportional zu (−0,42; 1; 0,32) in den gedrehten Koordinaten lässt X und Y unverändert.

Ein berechnetes Gegenbeispiel besitzt räumlichen Punktabstand ≈0,113084, aber Bildabstand nur 5,55·10⁻¹⁷. Das zweite Beispiel ist ein allgemeiner Raumpunkt, kein zusätzlicher Knoten des Tubus. Eine bekannte endliche Adresstabelle kann trotzdem eindeutig lesbar sein, solange keine ihrer Projektionen kollidieren.

**Return-Record:** Modellversion, Parameter θ/γ/s/L, Ansichtswinkel ψ, Darstellungsmodus, Punktadresse und Einheit gemeinsam erhalten. Für die rechnerische Rückgewinnung zusätzlich die Quellkoordinate oder die zugehörige Höhenebene bewahren. Elf Randnummern allein ersetzen diese Angaben nicht.

# Der erste A0 Anschluss

Die neue Vergleichsregel lautet J(Aᵢ)=bind(0,i), J(Mᵢ)=bind(1,i), J(Bᵢ)=bind(2,i) für i=0…4. Die nativen Decks besitzen je 16 Adressen. Diese Teilzuordnung nutzt davon fünf pro Deck. Der Quellgraph Q4×P3 ist bipartit; ein geschlossener Fünferring kann daher nicht durch fünf einzelne Quellkanten abgebildet werden. Die beiden fehlenden Rahmenkanten müssen ausdrücklich als Mehrschrittwege oder als getrennte Geometriekanten behandelt werden.

Quellen: [A0 Blue Pink Dodeca Cell Return](https://scarabaeus1031.github.io/NEXAH-Science-Lab/book/A0_BLUE_PINK_DODECA_CELL_RETURN.html?rev=20261023-build-flagships-r3), [CRT16-Adapter](https://scarabaeus1031.github.io/NEXAH-Science-Lab/book/assets/a0-blue-body-interior-crt16-v1.js?rev=shared-controller-20261017), [Pentagon-Modell](https://chatgpt.com/library?file_id=libfile_eb6956d3ed648191ad658654f2231461\&account_id=f2569140-2908-4933-a5ef-39275eb891c2).

# Zweiziffernkarte mit elf Restklassen

**Neue deklarierte Testkarte:** Eine Dezimaladresse wird als geordnetes Ziffernpaar (a,b) mit a,b∈{0,…,9} gehalten, einschließlich führender Null. Der Spiegeloperator vertauscht die Ziffern. Für n=10a+b gilt n mod 11=(b−a) mod 11; Spiegelung negiert die Restklasse. Alle 100 Paare bestanden die Restregel, Spiegelinvolution, Summenregel n+Spiegel(n)=11(a+b) und Teilbarkeit der Verkettung abba durch 11.

Die Schnapszahlen 00,11,…,99 bilden die zehn Fixpunkte der Spiegelung und die Diagonale a=b im 10×10-Ziffernfeld. Die elf Restklassen gliedern sich in den Nullzustand und fünf Gegenpaare: {1,10}, {2,9}, {3,8}, {4,7}, {5,6}. Damit entsteht ein konkreter Kandidat für fünf Gelenkrollen mit je zwei Vorzeichenrollen plus einer separaten Nullklasse. Eine Zuordnung zu M0…M4 wäre eine neue Konstruktionswahl, noch keine bestätigte historische A0-Markierung. Dass 11 die fünfte Primzahl ist, ist korrekt; die Gegenpaarzerlegung folgt bereits aus dem ungeraden Modul.

**Marker 47↔74:** Die Restklassen sind 3 und 8≡−3. Die Summe 47+74=121=11², die Differenz 74−47=27=3³. Die Verkettung 4774 ist ein Dezimalpalindrom und 4774=11·434=2·7·11·31. Diese Beziehungen sind exakt, aber an die gewählte Dezimalschreibweise und die definierten Operationen gebunden. Als Bruch gilt 7/11=0,636363…; ob Thomas mit „7/11“ stattdessen zwei Marker bezeichnet, bleibt offen.

**Erhaltungsgrenze:** Die Ziffernpaar-Adresse bleibt gespeichert. Eine Reduktion von 100 Paaren auf elf Restklassen ist allein nicht umkehrbar. Nächster Test für diesen Anschluss: die fünf Restklassenpaare ausdrücklich an fünf Gelenkrollen binden und prüfen, ob Spiegelung, Rückweg und vorhandene Marker dieselbe Zuordnung tragen.

# Konstantenfolgen und die Wurzeln sieben vier elf

**Ausgeführte Sequenzkarte:** π, φ, √2, √7, √11, √19 und √29 sowie √4=2 als rationale Kontrolle wurden mit jeweils 97 Nachkommastellen abgebildet. Es entstehen je 96 überlappende Ziffernpaare, insgesamt 768 Einträge. Zwei Rechnungen mit 160 und 220 Dezimalstellen lieferten dieselben 97-stelligen Präfixe. Die Regel lautet r=(b−a) mod11, mit vorzeichenbehaftetem Vertreter −5…+5. Als neue Codierung wird ±k der Rolle M(k−1) zugeordnet; Rest null bleibt separat. Dies bindet noch keine mechanische Bewegung an A0.

| Folge | Erste fünf Ziffernpaare | Zugeordnete Kanäle | Schnapszahlenpaare unter 96 |
| - | - | - | -: |
| π | 14, 41, 15, 59, 92 | +3, −3, +4, +4, +4 | 6 |
| φ | 61, 18, 80, 03, 33 | −5, −4, +3, +3, 0 | 8 |
| √2 | 41, 14, 42, 21, 13 | −3, +3, −2, −1, +2 | 5 |
| √7 | 64, 45, 57, 75, 51 | −2, +1, +2, −2, −4 | 6 |
| √11 | 31, 16, 66, 62, 24 | −2, +5, 0, −4, +2 | 12 |
| √4=2 | 00, 00, 00, 00, 00 | 0, 0, 0, 0, 0 | 96 |
| √19 | 35, 58, 88, 89, 98 | +2, +3, 0, +1, −1 | 10 |
| √29 | 38, 85, 51, 16, 64 | +5, −3, −4, +5, −2 | 9 |

π und √2 beginnen in dieser Lesart mit den entgegengesetzten Paarfolgen 14→41 beziehungsweise 41→14. Das ist eine überprüfte lokale Präfixbeobachtung, keine globale Beziehung der Konstanten. √4=2 liefert wie erwartet ausschließlich Nullkanäle. Die Karte ist kein Irrationalitätstest: Auch 1/3 mit seiner Folge 33,33,… würde nur Nullkanäle liefern. Die 96 überlappenden Paare sind abhängig; Häufigkeiten wurden nicht auf statistische Besonderheit geprüft. [Sequenzbild](https://chatgpt.com/library?file_id=libfile_03c35c5602588191b06ca19d9e1b89bb\&account_id=f2569140-2908-4933-a5ef-39275eb891c2), [vollständige Paaradressen als JSON](https://chatgpt.com/library?file_id=libfile_cb3451748e90819198ed48e31d237dfc\&account_id=f2569140-2908-4933-a5ef-39275eb891c2).

**Direkte geometrische Verbindung:** Für genau die drei genannten Wurzeln gilt die bekannte pythagoreische Beziehung (√7)²+(√4)²=7+4=11=(√11)². Eine exakte Referenzkarte ist O=(0,0), A=(√7,0), B=(√7,2): OA=√7, AB=2 und OB=√11. Diese Geometrie ist unabhängig von Dezimalbasis und Ziffernfenster. Sie ist ein zusätzliches Referenzdreieck, noch keine nachgewiesene Teilfigur des vorhandenen Pentagon-Tubus. Der erweiterte Test unten prüft das Verhältnis an vorhandenen Punkten und über eine gezielte Einstellung der Spitze.

# Erweiterte Tests und Abgleich mit dem Bestand

1. **Rahmenwege und Ring C geprüft:** Zusätzlich gilt J(Cᵢ)=bind(1,i+8). Alle 20 Grundpunkte erhalten verschiedene Quelladressen. Die drei bisher fehlenden Ringschlüsse werden über P0:0110→P0:0100→P0:0000, P2:0110→P2:0100→P2:0000 und P1:1110→P1:1100→P1:1000 geführt. So bildet sich eine Unterteilung des Vergleichsgraphen mit 23 Knoten und 33 Kanten im nativen Träger ab. Auf diesen 23 Adressen besitzt der native Graph zusätzlich acht unbenutzte Kanten. Die ausgewählten Wege sind gültig; eine Gleichheit mit dem vollständigen nativen Teilgraphen besteht nicht. C ist damit als Graphrolle angebunden, nicht durch eine gemeinsame maßstabsgetreue Raumabbildung.

2. **Neue Phasenabbildung geprüft:** Die deklarierte Referenzfolge θ(p)=65,8°·sin(2πp/12) verbindet zwölf native Phasen mit zulässigen Tubusstellungen. Um die native Gegenrotation in die Tubusgeometrie zu übertragen, werden für A, M und B getrennte Drehkorrekturen, radiale Skalierungen und neue Höhen z=l·h/2 verwendet. Das ist ein zusätzlicher Ansichtsadapter. 180 Punktabbildungen und ihre inversen Koordinaten bestanden; maximaler Rückrechnungsfehler ≈2,24·10⁻¹⁶. Der vollständige Umlauf schließt mit Koordinatenfehler ≈1,89·10⁻¹⁶; die Halbstablängen bleiben erhalten. Dieser Adapter wurde numerisch geprüft, aber nicht als Live-Verbindung mit der öffentlichen A0-Seite installiert.

3. **Spitze und Wurzeldreieck geprüft:** Im ursprünglichen Punktbestand einschließlich Pin P ergeben die beiden Referenzstellungen θ=36° und −65,8° bei δ=0,75 keinen Treffer für das rechtwinklige Seitenverhältnis √7:2:√11 innerhalb einer dimensionslosen Toleranz von 10⁻¹⁰; geprüft wurden 9.240 Tripel mit ausgezeichneter Winkelecke. Mit der gezielten Vorgabe δ=2ρ/√7 bildet P–Mᵢ–T dagegen an allen fünf Gelenken beider Stellungen das gewünschte ähnliche Dreieck: zehn Fälle, maximaler normierter Längenfehler ≈4,44·10⁻¹⁶. Bei θ=36° genügt δ≈0,750083806885, bei θ=−65,8° ist δ≈0,678426521861 nötig. Das HTML führt diese Referenz auf Wunsch automatisch nach. Die radiale Messlinie P–M schneidet den Ring; sie ist kein neuer materieller Stab. Für T existiert unter der festgelegten J-Zuordnung kein nativer Knoten, der mit allen fünf M-Adressen durch je eine Quellkante verbunden ist.

4. **Konstanten an Wege gekoppelt und kontrolliert:** Die 768 Paaradressen der acht Folgen steuern im eigenständigen HTML nun die vorhandenen RGB-Wege: +k wählt Aᵢ→Mᵢ→Bᵢ, −k den exakten Rückweg, i=k−1. 616 Einträge besitzen einen Weg; 152 Nullkanäle bleiben Referenzmarker am Pin ohne Graphschritt. Sämtliche 768 Bedienfälle, Vorwärts-/Rückwärtsschritte, manuelle Übersteuerung und JSON-Ausgabe bestanden in einer Node-Umgebung mit simulierten DOM-Elementen. Die umfassende Browserabnahme bleibt offen. Ein explorativer Vergleich mit je 5.000 ziffernhäufigkeitserhaltenden Mischungen prüfte für jede der sieben irrationalen Folgen drei Kennwerte: Schnapszahlenpaare, Betrag der Vorzeichenbilanz und benachbarte gleiche Betragsrollen. Nach Holm-Korrektur über 21 Vergleiche war kein Ergebnis auffällig; kleinstes korrigiertes p=1. Überlappende Paare wurden nach jeder Mischung neu gebildet. Dies ist kein Test auf Normalität oder Unabhängigkeit der Konstanten.

**Bestandsabgleich:** Die öffentlichen CRT16- und One-Flow-Skripte wurden erneut geladen und sind bytegleich mit den geprüften Quellschnappschüssen. Tip/Contact, drei Schalen, die drei Hin-/Rückwegrollen und TESA sind dort bereits vorhanden. Neu sind unser ausgewählter Graphanschluss, die konstruierte Phasenabbildung sowie die Sequenzsteuerung und Dreiecksreferenz im eigenständigen HTML. Der öffentliche A0-Code wurde nicht verändert.

**Offene Bindungen:** A9 konnte weder über die gesuchten Dateinamen noch in den geprüften Quellbeständen eindeutig einem ausführbaren Modul zugeordnet werden. Historische Hinweise auf Parallaxen-/Zeitprogressionsdarstellungen reichen für einen technischen Abgleich nicht aus. Die genaue 0–28-Coil-Regel, α≈5,25 und κ bleiben ebenfalls ungebunden.

**Arbeitsurteil:** Die Verbindungen lassen sich jetzt als konkrete Adresswege und parametrisierte Geometrie prüfen. Die Tests stützen diese deklarierten Konstruktionen; die Ziffernkarte hat bisher keinen statistischen Sonderbefund geliefert.
