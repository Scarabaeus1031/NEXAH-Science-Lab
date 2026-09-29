# NEXAH √7 · INTAKT Record Experiment 01

Stand: 28.09.2026 · **PASS_BOUNDED**

Dieses kleine Paket führt den bestehenden E8-REP-03-Benchmark unverändert als Referenz aus und prüft daneben zwei ausdrücklich definierte Zustandsfolgen im gewöhnlichen euklidischen Gitter \(\mathbb Z^4\). Der E8-Code bleibt in seinem eigenen Archiv; der neue Code beansprucht keine E8-Identität.

## Ausführen

Voraussetzung: Python 3 und `numpy` (für den beigefügten E8-Referenzbenchmark).

```bash
python3 ROOT7_INTAKT_BENCHMARK.py
```

Dies erzeugt `RESULTS.json` neu. Der E8-Lauf entpackt das originale Benchmarkarchiv vorübergehend, führt dessen 19 Assertions aus und verwirft die temporären Dateien danach. Archiv und Skript enthalten keine Netzwerkaufrufe.

## Typen und Operatoren

| Symbol | Typ | Definition |
| --- | --- | --- |
| Zustand \(q\) | \(\mathbb Z^4\) | Start \(A=(1,1,0,0)\), Ziel \(D=(1,1,2,1)\) |
| \(S\) | Translation | \(q\mapsto q+(0,0,2,0)\) |
| \(L\) | Translation | \(q\mapsto q+(0,0,0,1)\) |
| \(\pi_3\) | Projektion | vierte Koordinate entfernen |
| Record | geordnete Liste | Schrittindex, Operator, Vor- und Nachzustand, 3D-Beobachtung, \(\Delta w\) |
| 4774 | Symbolcode | gleiche Rollenfolge in beiden Testfällen; keine metrische Längenangabe |
| E8-REP-03 | separater Referenztest | original 240-Wurzel-Modell, H4- und Coxeter-Projektionen, Negativkontrollen |

## Resultate

| Route | Quadrierte Radien ab Ursprung | Beobachtungen \(\pi_3\) | E8-Ganzzahlkoset nach Nullauffüllen |
| --- | --- | --- | --- |
| \(S\) dann \(L\) | 2 → 6 → 7 | (1,1,0) → (1,1,2) → (1,1,2) | ja → ja → nein |
| \(L\) dann \(S\) | 2 → 3 → 7 | (1,1,0) → (1,1,0) → (1,1,2) | ja → nein → nein |

Endpunkt und das statische Wort 4774 können die Schrittfolge **nicht** unterscheiden; ein zeitlich geordneter 3D-Record und die typisierte Operatorliste können es. Die beiden Translationen kommutieren und liefern denselben Endpunkt. Die vierte Koordinate ist in diesem Test euklidisch und kein physikalischer Zeitparameter.

Die Symbolabbildung \(1:2:1\mapsto 4|77|4\) teilt die mittlere Rolle in zwei Stellen und weist äußeren/inneren Stellen die Labels 4/7 zu. Als Zahlverhältnis ist \(4:77:4\) **nicht** proportional zu \(1:2:1\); nach Gruppierung von 4|7|7|4 liegt 4:14:4 vor. Die Hälften 47 und 74 haben arithmetischen Abstand 27.

## Vordefinierte 47/74-Regel und Gegenkontrollen

An die beigefügte Palindromplatte mit **47 links/blau** und **74 rechts/gold** angelehnt kodieren wir *vor dem Vergleich*: 47 = \(w=0\), 74 = \(w=1\). Dies sind Zustandslabels. Das ist keine Behauptung, dass die Ziffern 4 und 7 räumliche Längen oder Zeitdauern messen.

| Record | S→L | L→S | Trennt die Routen? |
| --- | --- | --- | --- |
| Statisches Ganzwort | 4774 | 4774 | nein |
| Geordnete Lagecodes | 47→47→74 | 47→74→74 | ja |
| Nur Anfang und Ende | 47→74 | 47→74 | nein |
| Gegenkontrolle, neutrale Labels A/B | A→A→B | A→B→B | ja |

**Folgerung:** Die Zwischenbeobachtung und die Unterscheidbarkeit der zwei Lagen tragen die Information. Die speziellen Ziffern 47/74 sind dafür nicht notwendig. Den Operator \(S\) oder \(L\) leiten wir nicht aus 47 oder 74 ab; er bleibt ein gesonderter Eintrag im typisierten Record.

## Primzahlfenster 37–41–43–47: vorab definierte Baseline

Die Indizes werden ab \(p_1=2\) gezählt: \(p_{12}=37\), \(p_{13}=41\), \(p_{14}=43\), \(p_{15}=47\). Die Einerziffern lauten 7–1–3–7; ab \(p_{13}\) also 1–3–7. Exakt gilt:

\[
\operatorname{reverse}(47)=74=2\cdot37,\qquad
37+47=41+43=84,\qquad
\Delta(37,41,43,47)=(4,2,4).
\]

Außerdem ist \(74-47=27=3^3\). Dies ist ein arithmetisches Netz zwischen den vier aufeinanderfolgenden Primzahlen und den beiden Rollenlabels. Die Gleichheit der Paar-Summen entspricht bei vier aufeinanderfolgenden Zahlen der Gleichheit der beiden äußeren Primzahllücken.

**Endliche Gegenkontrolle:** Vor dem Lauf wurden die ersten 1000 Primzahlen als Population festgelegt, mit 997 Viererfenstern und zwei Kriterien: (a) äußere Summe = innere Summe, (b) umgedrehte letzte Primzahl = 2 × erste Primzahl. 163 Fenster erfüllen (a), 1 Fenster erfüllt (b), und genau das Fenster ab \(p_{12}\) erfüllt beide. Das ist eine genaue Häufigkeit in dieser festgelegten Population; die Kriterien entstanden aus dem betrachteten 4774-Beispiel. Aus „1 von 997“ folgt deshalb kein unvoreingenommener Signifikanzwert oder universelles Gesetz.

Das Primzahlfenster liefert eine konkrete **Adressbeziehung** zu 47/74. Es bestimmt weder die Schrittfolge \(S,L\) noch eine Zeitdauer, E8-Koordinate oder √7-Länge. Solche Abbildungen müssten als gesonderte Operatoren definiert und geprüft werden.

Das mitgelieferte E8-REP-03 meldete 19/19 PASS, 240 Wurzeln mit Normquadrat 2 und die Ablehnung seiner generischen Projektions- und Modulargraph-Gegenkontrollen. E8 ist ein gerades Gitter: eine unskalierte Distanz √7 zwischen E8-Punkten ist ausgeschlossen. Die Aussage bleibt getrennt von der \(\mathbb Z^4\)-Konstruktion.

## Prüfpunkt 2: Vorzeichenkanal → räumliche Metrik

Wir testen eine **explizit gewählte** Brücke vom 8→16-Vorzeichengraphen zu 16 Gitterpunkten: \(b\in\{0,1\}^4\mapsto(b_0,b_1,2b_2,b_3)\). Die vierte Stelle trägt wie bisher 47 bei \(b_3=0\) und 74 bei \(b_3=1\). Die Verdoppelung der dritten Achse ist eine Konvention für den geometrischen Test; die Bezeichnung des dritten Vorzeichenkanals mit √5 erzwingt diese Streckung nicht.

| Exhaustiver Befund | Wert |
| --- | --- |
| Zustände / 47-Zustände / 74-Zustände | 16 / 8 / 8 |
| Diagonalquadrat des Einheits-Tesserakts | 4 |
| Diagonalquadrat der gewählten Box \(1\times1\times2\times1\) | 7 |
| Ganzzahlige positive Achslängen 1 oder 2 mit Diagonalquadrat 7 | vier Permutationen von \((2,1,1,1)\) |
| Normquadrate aller Punkte mit Code 47 | 0, 1, 2, 4, 5, 6 |
| Normquadrate aller Punkte mit Code 74 | 1, 2, 3, 5, 6, 7 |
| Gleiche erste drei Bits, Wechsel 47→74 | in allen acht Paaren Normquadrat +1 |
| Punkt der gewählten 16-Zustands-Box mit Normquadrat 7 | nur \((1,1,2,1)\), Code 74 |

Damit lässt sich der Vorzeichengraph **in eine gestreckte vierdimensionale Box einbetten**, deren lange Diagonale √7 misst. Die Box hat dieselbe Eckpunkt-Nachbarschaft wie der Tesserakt, aber längere Kanten in einer gewählten Achse. Der Vorzeichengraph und die Ziffern 47/74 allein wählen keine Metrik: Bereits der Code 74 fasst acht verschiedene Zustände zusammen und erlaubt hier Normquadrate von 1 bis 7 (mit Lücken). Das Ergebnis ist eine überprüfbare Konstruktion, keine Ableitung der √7-Länge aus dem Kanalnamen. Der separate E8-Referenztest bleibt bei 19/19 PASS; seine geraden Gitterabstände liefern weiterhin keine unskalierte √7-Strecke.

## Prüfpunkt 3: Wählt ein bestehendes Modul die lange Achse?

Quellenabgleich: Die ältere Datei `NEXAH_TESSERACT_ROOT_SPACE_8_TO_16 7.html` benennt die Vorzeichenkanäle X=√2, Y=√3, Z=√5 und den neu hinzugefügten vierten Kanal √7. Sie zeichnet eine gewählte Projektion, weist den Kanalnamen aber **keine euklidischen Kantenlängen** zu. `NEXAH_TESSAREC_Q_IOTA_PEARL(1).html` führt einen projizierten 4D-Träger mit einstellbarem Layer und diagonalem Schnitt vor, ohne eine feste ganzzahlige √7-Metrik zu definieren. Im bestehenden Open-Shell-OS10-Abschlussbericht ist 1:2:1 ausdrücklich eine Gewichtungsmaske (1/4:1/2:1/4), keine Seitenlängenregel. Das originale E8-REP-03 bleibt ein getrenntes gerades Gitter.

Als **zusätzliche Kandidatenregel** prüfen wir: „Der neu hinzugefügte vierte Kanal bekommt die lange Kante 2.“ Alle vier erlaubten ganzzahligen Achsenwahlen werden gerechnet:

| Lange Kante in Kanal | Seitenlängen | Ganze Diagonale | Normquadrat beim Wechsel 47→74 mit gleichen ersten drei Bits | Erhält vorherige feste S/L-Schritte? |
| --- | --- | --- | --- | --- |
| X / √2 | (2,1,1,1) | √7 | +1 | nein |
| Y / √3 | (1,2,1,1) | √7 | +1 | nein |
| Z / √5 | (1,1,2,1) | √7 | +1 | ja |
| vierter Vorzeichenkanal / √7 | (1,1,1,2) | √7 | +4 | nein |

Der neue vierte Kanal ist im Quellmodul ausgezeichnet; daraus folgt **keine** Längenzuweisung. Übernimmt man die Zusatzregel, ändert sich die metrische Definition des bisherigen Pfades: Seine Schrittvektoren S=(0,0,2,0) und L=(0,0,0,1) dürfen dann nicht unverändert als Kanten des alternativen 16-Zustands-Modells ausgegeben werden. Das 47/74-Bit meldet weiterhin die Lage im vierten Kanal, aber seine gepaarte Normänderung wird +4 statt +1. Die beiden Diagonalwerte √7 sind gleich; der geometrische und beobachtbare Weg dorthin ist verschieden.

**Entscheidung:** Keine der abgeglichenen Quellen erzwingt gerade die zuvor gewählte dritte Streckachse oder einen nächsten Transformationsoperator. Die Alternative „lange Kante im neuen Kanal“ ist ein klar definierbarer Kandidat mit anderem Messprotokoll. Beide bleiben Modelle, bis eine unabhängig definierte Achsenregel oder Beobachtung zwischen ihnen entscheidet.

## Prüfpunkt 4: Zwei beschriftete 3D-Schnitte

Wir fixieren **vor dem Vergleich** dieselben 16 Bitzustände \(b=(b_0,b_1,b_2,b_3)\) und zwei Metriken A=\((1,1,2,1)\), B=\((1,1,1,2)\). In beiden werden die Bits in der Reihenfolge S=Bit 2 und L=Bit 3 geschaltet. Die *metrischen* Schritte sind damit in A \(S^2=4,L^2=1\), in B \(S^2=1,L^2=4\); die alten festen Translationen gelten ausdrücklich nur für A. Die vorab benannten Schnitte sind \(C_{xyz}(x,y,z,w)=(x,y,z)\) und \(C_{xyw}(x,y,z,w)=(x,y,w)\). Achsenbezeichnungen und Längeneinheiten gelten in beiden Schnitten identisch.

| Modell | √7-Eckpunkt in 4D | Diagonalquadrat \(C_{xyz}\) | Diagonalquadrat \(C_{xyw}\) | S→L: 4D-Radien² | L→S: 4D-Radien² |
| --- | --- | ---: | ---: | --- | --- |
| A: dritte Achse lang | (1,1,2,1) | 6 | 3 | 2→6→7 | 2→3→7 |
| B: vierte Achse lang | (1,1,1,2) | 3 | 6 | 2→3→7 | 2→6→7 |

**Erschöpfende Kontrolle:** Jeder einzelne Schnitt fasst in jedem Modell je zwei der 16 Bitzustände zusammen (acht Bilder mit Fasergröße 2). Das **geordnete Paar beschrifteter Schnitte** rekonstruiert unter bekannter Kalibrierung jede der vier Koordinaten und trennt alle 16 Zustände. Bereits *ein* beschrifteter und metrisch kalibrierter Schnitt trennt hier die zwei vorher festgelegten Modelle am ausgewählten Eckpunkt (6 gegen 3); der zweite bestätigt die komplementäre Achse und behebt den Informationsverlust über einzelne Zustände. Der unbeschriftete Wertevorrat {3,6}, das volle 4D-Diagonalquadrat 7 und die 47/74-Folge für dieselbe Bitreihenfolge trennen A und B **nicht**. Mit x,y als gemeinsamer Referenz gilt \(\|q\|^2=\|C_{xyz}q\|^2+\|C_{xyw}q\|^2-x^2-y^2\).

**Grenze:** Die zwei Schnitte sind ein synthetischer Geometrietest mit vorgegebenen Achsen und Einheiten. Die ältere Shadow-Geometry-Arbeit motiviert die Frage nach Projektionsverlust; ihre optische Strahlrechnung wird hier nicht als Nachweis der Gittermetrik benutzt. Der Test macht Kandidaten unterscheidbar, entscheidet aber ohne unabhängige Achsenregel oder Messdaten nicht, welcher für NEXAH zutrifft. E8-REP-03 bleibt unverändert und besteht weiterhin 19/19 Assertions.

## Prüfpunkt 5: 6 · 720, E8-Kanten und H4-Schattenrelation

Hier bedeutet die Zahl `6 720` im ursprünglichen E8-Benchmark **sechstausendsiebenhundertzwanzig**, nicht `6 × 720 = 4 320`. In E8 zählen wir Paare der 240 Wurzeln mit 8D-Abstand² = 2. Nach der bestehenden E8→H4-Projektion liegen die 240 Punkte auf zwei Schalen mit je 120 Punkten. Innerhalb jeder Schale definieren wir ihre H4-Kanten separat als Paare mit *kleinstem nichtnull 4D-Abstand*.

| Gezählt | Anzahl | Bedeutung |
| --- | ---: | --- |
| E8-Kanten insgesamt | 6 720 | 240 Punkte × E8-Grad 56 / 2 |
| E8-Kanten innerhalb kleiner Schale | 1 920 | E8-Distanzregel auf Punkten dieser Schale |
| E8-Kanten innerhalb großer Schale | 1 920 | dieselbe E8-Distanzregel |
| E8-Kanten zwischen den Schalen | 2 880 | Paare mit einem Punkt pro Schale |
| H4-Nachbarschaftskanten pro Schale | 720 | 120 Punkte × H4-Grad 12 / 2 |

Die Partition ist **1 920 + 1 920 + 2 880 = 6 720**. Besonders nützlich für die Schattenfrage: Die 720 nächsten Nachbarpaare der **großen** H4-Schale sind sämtlich auch E8-Kanten; ihre ursprüngliche 8D-Distanz² ist 2. Die 720 nächsten Nachbarpaare der **kleinen** H4-Schale sind **keine** E8-Kanten; ihre ursprüngliche 8D-Distanz² ist 4. Die Punkte sind eindeutig zugeordnet, aber die Nachbarschaft ändert sich, wenn man nach der Projektion die 4D-Metrik und eine neue Kantenregel verwendet. Die kleinere H4-Schale enthält daneben 1 920 ursprüngliche E8-Kanten; „keine“ bezieht sich ausschließlich auf die Überlappung der jeweils **720 nächsten H4-Nachbarpaare**.

Deine arithmetischen Relationen sind exakt: \(6=2\cdot3=3+3\), \(2+3=5\), und in römischen Zahlen \(V+V=X\) für \(5+5=10\). Die **6 im √7-Schnitttest** bezeichnet jedoch einen quadrierten Abstand; die 720 zählen Kanten. Auch das wahre Zahlenspiel stellt daher noch keine typisierte Abbildung zwischen dem √7-Modell und dem E8→H4-Graphen bereit. Der neue Test `E8_H4_EDGE_RELATION.py` benutzt das mitgelieferte E8-Originalarchiv unverändert und schreibt die messbaren Zählungen in `E8_H4_EDGE_RESULTS.json`.

## Offene Anschlussfrage

Für einen stärkeren Anspruch braucht es eine unabhängig begründete Regel, die die gestreckte Achse auswählt oder aus einem beobachteten 47/74-Record den nächsten Operator bzw. Zustand vorhersagt. Ohne diese Regel sind 47/74 binäre Labels; das Primzahlfenster und E8 liefern sie in den hier getesteten Modellen nicht.

## Inhalt

- `ROOT7_INTAKT_BENCHMARK.py` — typisierte Record- und Kontrollrechnung sowie erschöpfender Test der 16 Vorzeichenzustände und beider 3D-Schnitte.
- `RESULTS.json` — Ergebnis eines reproduzierten Laufs.
- `E8_H4_EDGE_RELATION.py` und `E8_H4_EDGE_RESULTS.json` — eigener prüfbarer Kanten- und Überlappungstest.
- `NEXAH_E8_REP_03_BENCHMARK.zip` — unveränderter früherer E8-Positiv- und Negativbenchmark.
