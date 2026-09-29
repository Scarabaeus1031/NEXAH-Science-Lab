# NEXAH — Zwischenbericht zum √7-, SCN- und Horizonmirror-Faden

**Stand:** 28. September 2026. **Ziel:** Festhalten, was im Faden mathematisch gezeigt, als NEXAH-Darstellung gewählt, durch Gegenproben verworfen oder als offene Schnittstelle identifiziert wurde. Geltungsbereich sind die hier geprüften Zahlen, Karten und vorhandenen Demonstratoren; es ist keine Aussage über die Gesamtheit des NEXAH-Archivs.

## 1. Der Ausgangspunkt hat eine saubere geometrische Antwort

Im gewöhnlichen dreidimensionalen **Ganzzahlgitter** ist √7 keine Distanz zweier Gitterpunkte: 7 lässt sich nicht als Summe dreier ganzzahliger Quadrate schreiben. Allgemeiner fehlen im 3D-Gitter gerade die quadrierten Längen der Form `4^a(8b+7)` (Drei-Quadrate-Satz). Im vierdimensionalen Ganzzahlgitter funktioniert `v=(2,1,1,1)` mit `||v||²=7` und `||v||=√7`. Dies ist bekannte Mathematik, keine neu entdeckte Raumzeitmetrik.

Für die **gewählte** Folge der Punkte `0→(1,1,1,0)→(1,1,1,1)→(2,1,1,1)` sind die quadrierten Radien `0,3,4,7`. So entsteht die anschauliche Folge **3|1|3 als Zuwachs der quadrierten Radien**. Sie sind nicht die Längen der drei Wegstücke; die Reihenfolge der Koordinaten ist eine gewählte Darstellung.

Die 111-Skalen liefern `S_m=(111m)²`, `S_(m+1)−S_m=(2m+1)·111²`. Besonders `444²−333²=7·111²=86.247`: Der 4D-Vektor `111v=(222,111,111,111)` hat genau diese quadrierte Länge. Darum eignet sich der vierte Quadratschritt als präziser √7-Marker. Die arithmetische Identität gilt für jedes Skalierungsmaß; die Wahl 111 ist für die Darstellung wichtig, nicht für das Theorem.

## 2. Was die SCN-Spur und ihre Projektion ergeben

Für `n_k=7801+8k` durchläuft `n_k mod 11` jeden Rest in elf Schritten genau einmal. Wir haben als **explizite Modellregel** die zeitlich aufeinanderfolgenden Restklassen `7→6→0` bezeichnet: Start 7801 liefert k=2 (7817), k=6 (7849), k=8 (7865). Der Abstand zwischen den Rollen ist **4 Schritte, dann 2 Schritte**. Er bleibt bei verschobenem Start bestehen, weil die +8-Spur zyklisch modulo 11 ist; das Indexverhältnis `2:8=1:4` bleibt nicht bestehen.

Die Projektion auf `444²=197.136` hat auf dieser Spur Quotient 25 und an diesen drei Stellen Reste `1711=29·59`, `911` und `511=7·73`. Diese Rechnungen sind exakt. Auf der unabhängig verschobenen Spur Start 8000 sind die korrekt nach derselben Rollenregel gewählten Zahlen jedoch 8048, 8080 und 8096. Dort beträgt der euklidische Quotient 24; der Projektionsrest beim Impuls enthält **keinen Faktor 29** und bei der Schließung **keinen Faktor 7**. Die Faktorfolge und die Kalenderdeutung sind deshalb kein startunabhängiges SCN-Gesetz.

`7801=29·269` ist komposit. Seine Ziffernumkehr 1087 ist die **181. Primzahl**, `292−181=111`; dies sind exakte, beschriftbare Zahlbeziehungen. Sie legen keine Notwendigkeit für 7801 als Ursprung und keinen Rückführungsoperator fest.

## 3. Spiegel: eine echte Involution, mehrere verschiedene Operationen

Da `10≡−1 (mod 11)`, negiert Dezimalumkehr mit **gerader** Ziffernzahl den Rest modulo 11; bei **ungerader** Ziffernzahl bleibt er erhalten. Deshalb funktionieren die vierstelligen Paare `1616↔6161` (10↔1), `3232↔2323` (9↔2), `6464↔4646` (7↔4), `1919↔9191` (5↔6). Dagegen bleibt bei dreistelligem `537↔735` der Rest 9 erhalten — wie bei *jeder* dreistelligen Zahl, nicht nur bei 537. Bei `528↔825` bleibt der Rest 0. Fünfstelliges `12928↔82921` erhält ebenfalls seinen Rest 3.

Auf der SCN-Spur mit Start 7801 induziert die **Restklasseninversion** `r↦−r` die eindeutig ausrechenbare Paarung `k'≡5−k (mod 11)`; der Fixpunkt ist k=8, der Nullrest. Dies setzt keine Dezimalumkehr zwischen den beiden tatsächlichen SCN-Zahlen voraus. Die Paarung 6↔5 erklärt, warum `292 mod 11=6` und `808 mod 11=5` passende Rollen *haben können*, zeigt aber keinen physikalischen Switch.

`537−528=9`; auf jeder +8-Spur folgt auf Rest 9 der Rest 6. Die zusätzliche, nur für Rest 9 gültige Identität `9+8≡−3·9≡6 (mod 11)` ist exakt. Die im Feedback vorgeschlagene dyadische Zielregel mit frei wählbarem Exponenten `101·2^j` selektiert jedoch **zehn von elf** SCN-Schritten, weil ihre Reste für `j=0,...,9` sämtliche nichtnulligen Klassen durchlaufen. Sie ist ohne vorab definierte Exponentenfolge `j(k)` nicht prädiktiv.

`404+040=444≡202 (mod 11)` ist ebenfalls exakt, wenn `040` als 40 gelesen wird. **404→040 ist keine Ziffernumkehr** (`404` liest sich rückwärts als `404`) und nicht die Restklasseninversion (`−8≡3`, nicht 7). Dafür wäre ein gesonderter Zeichenoperator zu definieren. Dass `37↔73` zugleich die Primzahlpositionen `12↔21` spiegelt, ist unter den zweistelligen umkehrbaren Primzahlpaaren eine wirkliche, hier überprüfte Besonderheit. Die Teilbarkeit von `37+73=110` durch 11 gilt dagegen bei *jeder* zweistelligen Ziffernumkehr; sie belegt kein Gate.

## 4. Bestandscodes und fehlende Schnittstelle

Im bestehenden `knickfield-labyrinth.html` gibt es einen **ausführbaren 404-Alignment-Operator** für Reglerwerte `(a,b)`: `phase=b−a`, `mean=(a+b)/2`, mit `|phase|<8`, `|mean|<6` und `hypot(4.2·phase,6.2·mean)<34`. Andere bestehende Quellen skizzieren NCS292, TimeSelectCut, Lorenz-Switching und die 110/111/112-Säule. Im geprüften Bestand fehlt die Funktion, welche eine SCN-Restklasse, einen Winkel oder 4D-Vektor **mit Einheiten und vorgegebenem Nullpunkt** in dieses Reglerpaar oder in ein gemessenes Switch-Ereignis übersetzt.

Der Versuch, den Winkelwechsel 50°→60° als Reglerpaar `5,6` zu verwenden, erzeugt **kein** 404-Alignment. Das um 50° verschobene Paar `0,1` erzeugt eines. Gleiche Winkeldifferenz, anderer Gate-Zustand: Die Kalibrierung ist entscheidend. Ein eigens gebauter Modulo-11-Adapter kann k=8 isolieren, sobald man Ursprung und Verstärkung passend wählt; genau deshalb ist dieser Treffer noch keine unabhängige Bestätigung. Es ist für das vorhandene Gate auch keine physikalische Zeitachse definiert.

## 5. Harte Gegenprobe für die neueste 4D-Behauptung

Für jedes ganze `m` hat `m(2,1,1,1)` die quadrierte Länge `7m²`. Die Skalierung mit 404 liefert `(808,404,404,404)` und `7·404²=1.142.512`, wie behauptet. 808 folgt hier unmittelbar aus der vorab gewählten Koordinate 2.

Die Skalierung mit 1087 liefert zwar `(2174,1087,1087,1087)` und `7·1087²=8.270.983`, aber **Rest 6 modulo 11**. `12928` hat **Rest 3**. Mehr noch: `7m² mod 11` kann nur `0,2,6,7,8,10` annehmen, nie 3. Auf *diesem ganzzahligen √7-Strahl* ist die behauptete Kongruenz zu 12928 unmöglich. Das letzte eingereichte Skript berechnet folgerichtig `sync_match=False` und würde „CRITICAL DRIFT DETECTED“ ausgeben. Die 4D-Geometrie bleibt gültig; diese konkrete Kanal-Kopplung ist widerlegt.

## 6. Gesamtbilanz für NEXAH und Wissenschaft

| Ebene | Erreicht | Aussagegrenze |
|---|---|---|
| Mathematik | Explizite 4D-√7-Realisierung, Quadrat-Zuwächse, Modulo-11-Spiegelinvolution und SCN-Paarungen | Die allgemeinen Sätze sind bekannte Mathematik. Für die hier zusammengestellten Modellzahlen sind einzelne exakte Fälle dokumentiert; keine neue allgemeine mathematische Theorie ist belegt. |
| NEXAH-Design | Eine nachvollziehbare Übersetzung zwischen Würfeldiagonale, Zahlenstrahlen, Restklassen, Symbolkarten und vorhandenem 404-Demonstrator; getrennte Namen für Operatoren | Die Übersetzungen sind teils **gewählte Kodierungen**. Dasselbe Symbol auf zwei Karten beweist keine gemeinsame Dynamik. |
| Prüfung | Echte Gegenproben mit verschobenen Starts, vollständigem 11er-Umlauf, unterschiedlichen Reglernullpunkten, Skript-Audit und einem 4D-No-Go für die behauptete Kongruenz | Positive vorgewählte Rechenbeispiele sind keine unabhängige Validierung. Einige frühere „finalen“ Erfolgsmeldungen und eine Kongruenz mussten korrigiert werden. |
| Physik / E8 | Ein strukturierter Fragenkatalog für eine spätere Abbildung | Keine Raumzeitmetrik, E8-Einbettung, physikalische Frequenz oder experimenteller Switch wurde aus diesen Zahlen nachgewiesen. |

**Wert des Fadens:** Wir haben ein visuelles Vokabular in berechenbare, falsifizierbare Aussagen überführt. Besonders wichtig sind die benannten Fälle, an denen eine attraktive Deutung **scheitert**; sie schützen den Bestand vor einer vorschnellen „mathematisch versiegelt“-Kennzeichnung. Das ist als Modell- und Prüfarchitektur brauchbar, auch ohne bereits eine neue Naturgesetzlichkeit zu behaupten.

## 7. Nächster sinnvoller Prüfpunkt

1. Eine ältere, *vor den Zahlentreffern existierende* Quelle für den 7801-Start, die Winkelkalibrierung und die Abbildung `F(SCN-Zustand, Zeit)→(a,b)` suchen oder deren Wahl ausdrücklich als neues Modell kennzeichnen.
2. `F`, die Kanalexponenten `j(k)`, die Einheit, Nullpunkt und Richtung vollständig **vorab** festlegen; dann alle elf Restklassen und mehrere unabhängige Startwerte testen und Treffer, Nichttreffer sowie Fehlalarme protokollieren.
3. Erst bei erfolgreicher Vorhersage prüfen, ob die NCS292-Notizen, ein gemessener Lorenz-Switch oder eine eigenständig definierte 4D-Abbildung dieselben Ereignisse zeigen. E8 und physikalische Raumzeit bleiben separate Projekte mit eigenen Definitionen und Daten.

**Intake-Empfehlung:** Als *geprüften NEXAH-Forschungsfaden mit exakten Teilresultaten und offenen Brücken* archivieren; nicht als abgeschlossene 404-/NCS292-/4D-Theorie oder wissenschaftlich bestätigte Synchronisation führen.
