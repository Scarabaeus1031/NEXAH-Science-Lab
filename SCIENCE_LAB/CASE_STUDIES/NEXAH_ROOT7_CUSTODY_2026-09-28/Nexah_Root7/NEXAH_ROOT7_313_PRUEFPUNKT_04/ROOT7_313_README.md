# NEXAH √7 · Prüfpunkt 04: 3|1|3, Spalt und V→X

Stand: 28.09.2026 · **PASS_BOUNDED / geometrische Spiegelung nicht bestätigt**

## Frage

Lässt sich die vom Nutzer vorgeschlagene Reihenfolge **3|1|3** als Veränderung des quadrierten Ursprungsabstands \(r^2\) in der gestreckten 4D-Box 2×1×1×1 realisieren? Liegt der Schritt **1** in der Mitte als Wechsel des 47/74-Zustands? Erzwingt das eine bestimmte Streckachse oder eine echte geometrische V→X-Spiegelung?

## Ein expliziter Treffer für Arbeitsmodell A (lange z-Achse)

| Folge | (x,y,z,w) | Abstand² vom Ursprung | Zustand |
| --- | --- | ---: | --- |
| Q0 | (0,0,0,0) | 0 | 47 |
| Q1 | (1,1,1,0) | 3 | 47 |
| Q2 | (1,1,1,1) | 4 | 74 |
| Q3 | (1,1,2,1) | 7 | 74 |

Die **Differenzen von Abstand²** lauten exakt **3|1|3**. Die eigentlichen **Streckenlängen² der drei Schritte** lauten **3|1|1**. Der letzte Schritt z:1→2 hat räumliche Länge 1, erhöht aber \(z^2\) von 1 auf 4, also den Ursprungsabstand² um 3. Der zentrale 1-Schritt w:0→1 realisiert hier das gewählte blaue 47→goldene 74. Diese Typentrennung ist der Kern des Tests.

## Erschöpfende Gegenprobe

Für jede der vier möglichen Streckachsen werden alle 24 Punkte der ganzzahligen Box (drei Koordinaten 0/1, eine 0/1/2) vollständig durchsucht. Start ist 0, Ziel die gegenüberliegende Ecke. Gesucht sind Folgen mit Ursprungsabstand² **0→3→4→7**, wobei die letzten beiden Schritte positive Einheitsachsen-Schritte sind. Der erste Sprung ist eine √3-Diagonale. Das beigefügte Skript prüft auch die Schrittstrecken und die 16 äußeren Eckzustände.

| Lange Achse | Passende 3|1|3-Folgen | Davon mittlerer Wechsel w:0→1 **mit ursprünglichen Endpoint-Codes** | Vollständig in den 16 äußeren Zuständen? | Punktspiegelung Q0↔Q3, Q1↔Q2? |
| --- | ---: | ---: | ---: | ---: |
| x / √2-Kanal | 4 | 1 | 0 | 0 |
| y / √3-Kanal | 4 | 1 | 0 | 0 |
| z / √5-Kanal | 4 | 1 | 0 | 0 |
| w / √7-Kanal | 4 | 0 | 0 | 0 |

Im w-langen Fall ist w=1 eine **neue innere Lage**, während der alte 74-Code am äußeren w-Endpunkt w=2 hängt. Ihn bereits bei w=1 zu vergeben würde die Codierregel ändern. Der Endpunkt Q3 und der Anfang Q0 liegen dagegen immer an äußeren Ecken. Dass keine vollständige Folge in den 16 Zuständen bleibt, folgt aus der Lage Q2: Bei der langen Achse steht sie auf 1 von 2.

Die Punktspiegelung wurde präzise getestet als \(Q\mapsto Q_3-Q\). In keinem der gefundenen Fälle wird dadurch Q1 auf Q2 abgebildet. Das **Palindrome 3|1|3** ist also eine Spiegelung der *Zahlenfolge der Radialzuwächse*, kein Beleg für kongruente V-Arme oder eine geometrische X-Relation. Die beigefügte NEXAH-v9-Tafel zeigt eine Beobachterprojektion mit gekreuzten Linien; ohne Punktzuordnung und Projektionsvorschrift ist sie keine geprüfte Abbildung dieses Gitterwegs.

## Entscheidung

**Ja:** Eine klare 3|1|3-Spaltfolge existiert mit zentralem 47→74-Wechsel in A und benötigt ein 24-Punkte-Gitter. Das ist eine nützliche Erweiterung des Zustandsraums für die Modellierung von Übergängen.

**Nein:** Die 3|1|3-Folge allein wählt A nicht gegenüber x/y aus; die Spiegelung der Radialzuwächse ist keine geometrische Spiegelung. Der Schrittindex darf als geordnete Modellzeit gelesen werden, nicht als gemessene Dauer.

**Neuer überprüfbarer Anschluss:** Zuerst festlegen, ob die innere Lage der gestreckten Achse überhaupt ein zulässiger NEXAH-Zustand sein soll (24 Zustände statt 16 Ecken), und dann eine explizite Abbildung der Knoten und Kanten der V/X-Tafel auf diese Punkte registrieren. Erst danach können Kantenerhaltung, Spiegelung und 47→74 gemeinsam getestet werden. Die E8/H4-Referenz bleibt von dieser Erweiterung getrennt.

## Reproduktion

`python3 root7_313_probe.py` schreibt `root7_313_results.json`. Der Code benutzt nur die Python-Standardbibliothek, durchsucht alle Kandidaten und bricht bei einer verletzten Behauptung mit `AssertionError` ab. Die vier Ergebnispaare (3|1|3-Folgen, davon originalgetreue mittlere 47→74-Übergänge) sind `(4,1)`, `(4,1)`, `(4,1)`, `(4,0)` für x,y,z,w.
