# NEXAH √7 · Prüfpunkt 02: explizite Brückenregel und zwei Schnitte

Stand: 28.09.2026 · Status: **MODELLREGEL FIXIERT; RECHNUNG BESTANDEN; QUELLENBINDUNG OFFEN**

## 1. Vor dem Vergleich festgelegte Regel

Die vier **Zeichenkanäle** des vorhandenen 8→16-Zustandsmodells heißen in dieser Reihenfolge √2, √3, √5, √7. Ihre Namen sind Zustandslabels, keine Kantenlängen. Für diesen Prüfpunkt gilt ausdrücklich folgende Einbettung in das euklidische Gitter \(\mathbb Z^4\):

| Kanal / Bit | Koordinate | Kantenlänge im Arbeitsmodell A | Lagewechsel |
| --- | --- | ---: | --- |
| √2 / \(b_0\) | \(x=b_0\) | 1 | \(x:0\to1\) |
| √3 / \(b_1\) | \(y=b_1\) | 1 | \(y:0\to1\) |
| √5 / \(b_2\) | \(z=2b_2\) | **2** | \(S:z:0\to2\) |
| √7 / \(b_3\) | \(w=b_3\) | 1 | \(L:w:0\to1\) |

Also \(f_A(b_0,b_1,b_2,b_3)=(b_0,b_1,2b_2,b_3)\). Die Zuordnung √5→\(z\)→2 ist eine **neue, offengelegte Modellfestlegung**, die den bisherigen INTAKT-Operator \(S\) bewahrt. Aus den Bildtafeln Plan H3–O, aus dem Primzahlwert 5 oder aus E8 wird sie nicht abgeleitet. Ebenso bleibt die Codekonvention \(b_3=0\mapsto47\) (blau), \(b_3=1\mapsto74\) (gold) eine benannte Symbolregel.

## 2. Prüfbare Vorhersagen

Wir fixieren den Anfangszustand \(b=(1,1,0,0)\), den Endzustand \(b=(1,1,1,1)\) und die **beschrifteten, in denselben euklidischen Einheiten kalibrierten** Schnitte \(C_{xyz}(x,y,z,w)=(x,y,z)\) sowie \(C_{xyw}(x,y,z,w)=(x,y,w)\). Die Alternative B streckt stattdessen den vierten Kanal: \(f_B(b)=(b_0,b_1,b_2,2b_3)\). Damit ist B ein vorab angegebener Gegenkandidat für die Frage der **Achsenwahl**; B ändert gegenüber dem bisherigen Operatorrecord die euklidischen Schrittlängen.

| Beobachtung | A: lange √5-Achse | B: lange √7-Achse | Trennschärfe |
| --- | --- | --- | --- |
| Endpunkt \(f(1,1,1,1)\) | (1,1,2,1) | (1,1,1,2) | Nur bei bekannter Achsenkalibrierung |
| Volle Diagonale \(\|f(1,1,1,1)\|^2\) | 7 | 7 | Keine |
| \(\|C_{xyz} f(1,1,1,1)\|^2\) | **6** | **3** | Ja, wenn der Schnitt `xyz` feststeht |
| \(\|C_{xyw} f(1,1,1,1)\|^2\) | **3** | **6** | Ja, wenn der Schnitt `xyw` feststeht |
| Bei gleichen \(b_0,b_1,b_2\): Änderung \(\|f\|^2\) von 47 zu 74 | **+1** | **+4** | Ja, wenn Paare und Norm kalibriert sind |
| \(S\to L\): Quadratradien | 2→6→7 | 2→3→7 | Ja, bei beobachteten Zwischenzuständen |
| \(L\to S\): Quadratradien | 2→3→7 | 2→6→7 | Ja, bei beobachteten Zwischenzuständen |
| \(S\to L\): Symbolrecord | 47→47→74 | 47→47→74 | Keine für die Achsenwahl |
| Nur 4774 oder ungeordnet {3,6} | gleich | gleich | Keine |

Beide beschrifteten Schnitte zusammen rekonstruieren einen vollständigen Zustand: Aus \((x,y,z)\) und \((x,y,w)\) folgt \((x,y,z,w)\). Ein einzelner Schnitt hat jeweils 8 zweielementige Fasern; das Schnittpaar unterscheidet alle 16 Bitzustände. Ohne **unabhängig** definierte Orientierung der Schnitte ist lediglich das ungeordnete Paar \(\{3,6\}\) verfügbar; es bevorzugt weder A noch B.

## 3. Herleitungsbilder, Zeit und Shadow Axis

Plan H3 zeigt im 11×11-Gitter die Folge 12,24,…,84: Der lineare **Index** wächst diagonal jeweils um 12. Unter einer üblichen Nummerierung mit 11 Spalten wäre der entsprechende plane Koordinatenschritt \((1,1)\) mit Länge √2 *bei Einheitsabstand*. Dieses Beispiel illustriert die notwendige Angabe des Trägers und der Einheit: Zahlendifferenz 12 und geometrische Diagonale √2 sind verschiedene Größen. TimeWheel sowie Pläne J–O beschriften Reihenfolge, Parität, Kreisrelationen und Winkel; sie liefern damit eine nachvollziehbare Grammatik für eine **Schatten-/Sequenzachse**, aber keine Messung der hier festgelegten Gitterkante 2. Der Schrittindex ist in diesem Modell „Zeit“ im Sinne einer **geordneten Folge**; er ist keine physikalische Zeitkoordinate.

## 4. Reproduzierter Test und unabhängige Kontrolle

Der bestehende Prüfstand `NEXAH_ROOT7_INTAKT_RECORD_TEST_01.zip` wurde unverändert erneut ausgeführt: `ROOT7_INTAKT_BENCHMARK.py` meldet **PASS_BOUNDED**, die angegebenen A/B-Schnittwerte, die 47/74-Records und **19/19** bestandene Original-Assertions von E8-REP-03. Der separat ausgeführte `E8_H4_EDGE_RELATION.py` meldet **PASS_BOUNDED**: 6 720 E8-Kanten, Partition 1 920+1 920+2 880 und Überlappung der je 720 H4-Nachbarpaare mit E8-Kanten **0** (kleine Schale) beziehungsweise **720** (große Schale). Diese Kontrolle liefert keinen Achsenwert für √7; sie prüft, dass wir Abstand, Projektion und Kantenregel nicht miteinander verwechseln.

**Urteil:** Die Regel A ist intern konsistent und reproduzierbar; eine beschriftete, kalibrierte Schnitttafel könnte A und B unterscheiden. Der vorliegende Quellenbestand enthält keine solche unabhängig vermessene Schnitttafel. Also ist „A ist die von NEXAH erzwungene Achse“ derzeit **nicht bestätigt**. Fände eine externe Definition oder Messung für die identischen Kanäle \(C_{xyz}\) den Wert 3 statt 6, wäre A unter dieser Definition verworfen; ergäbe sich 6, wäre B unter derselben Definition verworfen. Ein reines Umbenennen der Koordinaten darf nicht als Bestätigung zählen.

Nächster Datenbedarf für einen empirischen Test: eine unabhängig festgelegte Zuordnung zwischen den vier Zeichenkanälen und zwei **beschrifteten, einheitlich kalibrierten** 3D-Schnitten oder eine belegte Kantenlängenvorschrift aus einer älteren NEXAH-Quelle. Bis dahin bleibt der Mehrwert dieses Prüfpunkts die explizite, falsifizierbare Brückenregel samt dokumentierter Evidenzgrenze.
