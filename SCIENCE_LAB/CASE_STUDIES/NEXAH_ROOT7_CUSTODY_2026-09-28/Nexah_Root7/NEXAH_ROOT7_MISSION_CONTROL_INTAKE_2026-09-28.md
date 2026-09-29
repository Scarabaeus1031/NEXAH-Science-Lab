# NEXAH Root7 / SCN / 111-Grid — Abschluss und Mission-Control-Intake

**Stand:** 28. September 2026  
**Intake-Entscheidung:** Als **geprüften Forschungs- und Darstellungsfaden mit exakten Teilresultaten, korrigierten Behauptungen und offenen Übersetzungen** aufnehmen. Nicht als neue Raumzeitmetrik, SCN-Schaltgesetz, 404-Routingmaschine oder E8-Identifikation freigeben.

## Auftrag an Codex / Mission Control

Bitte den auf dem Ordner-Screenshot sichtbaren Bestand `Nexah_Root7` im **tatsächlichen Repository** lokalisieren und read-only gegen diesen Bericht abgleichen. Übernimm weder Dateinamen aus diesem Bericht als Garantie für den Repo-Pfad noch aus Bildern abgelesene Formeln als ausführbaren Code. Stelle zuerst kanonische Dateien, Versionen, Prüfresultate und die Herkunft der Visuals fest. Gib danach eine Intake-Empfehlung für die bestehende Mission-Control-Struktur ab. **Keine automatische Löschung oder Verschiebung von Kopien; keine Freigabe eines neuen RUN 05.**

### Suchanker im Ordner `Nexah_Root7`

| Typ | Auf Screenshot sichtbare Suchanker | Funktion |
|---|---|---|
| Zwischenstand | `NEXAH_ROOT7_SCN_HORIZONMIRROR_ZWISCHENBERICHT_2026-09-28.md`, `NEXAH_Root7_Sequenz_Abgleich_2026-09-28.md` | übergreifender Befund und Sequenz |
| Grid/CRT | `NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28-2.md` bis `-5.md` sowie das gleichnamige Grunddokument, falls im Repo vorhanden | Versionen/Dubletten auf Unterschiede prüfen; aktualisierte Fassung enthält Prüfungen bis Abschnitt 15 |
| Prüfserie | `NEXAH_ROOT7_AXIS_RULE_AUDIT_2026-09-28.md`, `NEXAH_ROOT7_BRUECKENREGEL_PRUEFPUNKT_02_2026-09-28.md`, die Ordner `NEXAH_ROOT7_313_PRUEFPUNKT_04`, `NEXAH_ROOT7_404_RETURN_PRUEFPUNKT_05`, `NEXAH_ROOT7_111_FIELD_PRUEFPUNKT_06`, sowie `NEXAH_SCN_*PRUEFPUNKT*` und `NEXAH_947_PACKET_ROUTING_AUDIT_PRUEFPUNKT_18_2026-09-28.md` | originalen Verlauf und Korrekturen rekonstruieren |
| Code und Daten | `root7_313_probe.py`, `ROOT7_404_RETURN_GATE.py`, `ROOT7_111_FIELD_BRIDGE.py`, `root7-check.js`, `ROOT7_*_RESULTS.json` und Beipackdateien in den Prüfpunkt-Ordnern, soweit im Repo vorhanden | Aussagen gegen implementierte Operatoren und tatsächliche Ausgaben halten |
| Anzeige | `NEXAH_MARKER_01_ROOT7_4D.png`, `NEXAH_MARKER_02_SCN_PRUEFSTAND.png`, `NEXAH_Root7_Tesseract_Bridge*.html`, `NEXAH_Root7_Shadow_Axis.svg` | Illustrationen und Interfaces, keine Messdaten |
| Referenz | `E8_REP_03_BENCHMARK` und seine `REPORT.md`/Ergebnisdateien, falls im Repo verfügbar | **separater** Positiv- und Negativkontrollmaßstab; nicht als bewiesene Root7-E8-Brücke umetikettieren |

Der Screenshot zeigt außerdem Dateien mit `copy`, `copy 2`, fortlaufende Grid-Suffixe sowie zwei Zwischenbericht-Namen mit und ohne `copy`. **Kopien nicht nach Namen „neuester gewinnt“ behandeln**: Inhaltshash, Dokumentstand, Teststatus, Referenzbeziehungen und Korrekturen gegenüberstellen; kanonische Fassung erst danach markieren. Auch unterschiedliche Dateinamen können inhaltliche Dubletten sein. Alle Varianten bis zur Entscheidung erhalten.

## Was nachgerechnet wurde

1. **Geometrie:** In `Z³` keine Gitterpunktdistanz `√7`; in `Z⁴` liefert `(2,1,1,1)` die Norm `√7`. Bekannte Zahlentheorie und euklidische Geometrie. Die gewählte `3|1|3`-Folge beschreibt Zuwächse **quadrierter Radien**, nicht Streckenlängen. Die gewählte 111-Skalierung ergibt `444²−333²=7·111²`.
2. **111er-Raster:** `n=i+111j` für `0≤i,j≤110`, `0≤n≤12320`. `111≡−1 mod 7`, `111≡1 mod 11`; somit `(n mod 7,n mod 11)=(i−j,i+j)`. Die CRT-Paarung rekonstruiert `n mod 77`, nicht den vollen Punkt. Die 180°-Drehung ist `R(n)=12320−n`; `12321` ist der **erste Punkt außerhalb** des endlichen Grids und hat Rest 1 mod 77. `111×111=12321` und `112×110=12320` sind unterschiedlich adressierte Formate.
3. **SCN und Spiegelung:** `n_k=7801+8k` besucht modulo 11 jede Klasse einmal in elf Schritten. Die benannten Rollen `7→6→0` liegen beim Start 7801 an `k=2,6,8`. Die Rollenabstände `4,2` sind modular fest; das Indexverhältnis `2:8` hängt vom Start ab. Ziffernumkehr, Restinversion, 404↔040-Zifferntausch und Rasterdrehung sind **verschiedene Operatoren**.
4. **Korrektur von Erfolgsbehauptungen:** `7·1087²=8.270.983≡6 mod 11`, `12928≡3 mod 11`. Für *keine ganzzahlige Skalierung* von `(2,1,1,1)` ist `7m²≡3 mod 11`: die behauptete Norm²-Synchronisation ist in diesem Modell unmöglich. Für Payload 947 ist `7·947²≡7 mod 11`, also `k=2`, **nicht** der angegebene 292-Switch bei `k=6`; der Demo-Code ist zudem keine Verschlüsselungs- oder Routingimplementierung.
5. **Neue Gatekontrollen:** `808+292=1100`; `1100` und `12320` sind beide 0 mod 11, jedoch `22` und `0` mod 77. Für die **ausdrücklich gewählte** gegenläufige Radregel mit Takten 7, 6 und 13 ergibt sich die volle Periode 546; `12320` ist gegenüber dem auf `1100` geeichten Zustand keine volle Wiederkehr. `1729/1770=0,976836…` (der Aufdruck `0,9774` auf CARD_08 ist unrichtig); weder der direkte noch der quadrierte Quotient ist exakt `12321/12928`. Der Kontrollzähler 1728 approximiert das Gateverhältnis quadriert sogar besser.
6. **E8 als Kalibrierung:** Der separat geprüfte E8-REP-03-Benchmark berichtet `E8 (8D) → H4∪φH4 (4D) → Coxeter-Ebene (2D)` mit passenden Invarianten und Negativkontrollen. Das beweist die Leistungsfähigkeit eines **Referenztests für Darstellungswechsel**, nicht die Gleichheit seines E8-Gitters mit dem hier gebauten 4D-√7-Gitter oder dem SCN-Kanal.

## Querverweis zu den RUN-Visuals

`RUN01_04_MASTER_MARKER`, `RUN03_VISUAL_B_ALIAS_MARGIN`, `RUN04_VISUAL_A_NEUTRAL_ARCHITECTURE`, `RUN04_VISUAL_B_PROJECTION_ALIASING`, `RUN04_VISUAL_C_LAYER_CONTRACTION` und `NEXAH HISTORICAL MAPPING AUDIT HMA-01` sind **methodische Bezüge**, keine zusätzlichen Root7-Nachweise. Sie trennen Träger → Einschränkung/Gate → Projektion → Beobachtung → Rekonstruktionsmenge. Eine gleiche Projektion kann verschiedene Zustände aliasieren; eine weitere unabhängige Beobachtung kann sie trennen. Beispiel: 1100 und 12320 haben denselben Rest mod 11, aber verschiedene Reste mod 7. Die HMA-01-Karte markiert historische Zuordnungen als `VISUAL ONLY` und `HISTORICAL_MAPPING_UPGRADE = NO`; die RUN-Serie ist als geschlossen/eingefroren beschriftet. Ihre Screenshots ersetzen keinen ausführbaren Quelltest.

## Abnahmefragen an Mission Control

1. Wo liegt im Repo die **kanonische** Fassung jedes Prüfpunktes 01–18, und welche Kopien sind bitgleich, ältere Stände oder verschiedene Inhalte? Bitte einen kurzen Versions-/Hash- und Quellenindex zurückgeben; bis dahin keine Bereinigung.
2. Lassen sich die konkreten Skripte mit den dokumentierten Parametern reproduzieren? Bitte nur Tests für verbleibende Unsicherheit wiederholen; ausgeführte Skripte und Ergebnisse genau nennen. Die negativen Gegenbefunde aus Prüfpunkt 17 und 18 müssen bestehen bleiben.
3. Gibt es **vor** den Zahlenbeobachtungen einen im Repo festgelegten Transformationsoperator `F`, der SCN-Rest, Reglerzustand `(a,b)`, 4D-Vektor, 7/6/13-Winkel und die Gatepaare verbindet? Wenn nicht: als `OPEN / NOT IDENTIFIED` dokumentieren, keinen aus passenden Beispielen zurückgerechneten Operator einsetzen.
4. Gibt es für Root7↔E8 eine definierte, invariantenbewahrende Abbildung mit passenden Negativkontrollen? Wenn nicht: nur die Referenz-/Methodenbeziehung verzeichnen.
5. Welche Mission-Control-Kategorie entspricht dem Bestand: **geprüfte Modell-/Orientierungsgrammatik und Testhistorie** mit deutlicher Evidenzgrenze? Bitte den bestehenden Katalogeintrag nennen oder eine minimale Aufnahme vorschlagen; keine automatische Hochstufung zu wissenschaftlicher Validierung.

## Operative Intake-Regel

- **Kern:** aktualisiertes `NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28.md`, Zwischenbericht und Prüfpunkt 17/18 als Korrekturanker; 01–16 und Code als Referenzkette, sofern im Repo tatsächlich vorhanden.
- **Visual-Auswahl:** zwei Marker als Einstieg; Tesseract-HTML/SVG als optionale Demonstratoren; CARD_08 und Gegenrotationsrad als *Hypothesengrafiken*; RUN/HMA-Visuals als methodische Querverweise. Frühere Fassungen nach Provenienz gruppieren, nicht jedes Visual als unabhängigen Befund zählen.
- **Statusvokabular:** `EXAKT NACHGERECHNET`, `DEKLARIERTE MODELLWAHL`, `NEGATIVKONTROLLE / WIDERLEGT`, `OFFEN / NICHT IDENTIFIZIERT`, `VISUAL ONLY`. Screenshots und Gemini-Zusammenfassungen bekommen ohne unabhängigen Operator/Test keinen höheren Status.
- **Ausgabe:** ein Intake-Manifest (kanonische Quelle, Hash/Version, Belegklasse, Korrekturbezug), eine kurze Entscheidung für Mission Control und höchstens **eine** vorab spezifizierte Anschlussfrage. Dies ist ein Archiv-/Review-Auftrag, keine Aufforderung zu einer neuen RUN-Serie.

### Herkunft dieses Berichts

Der neue Grid-/CRT-Teil bis Prüfpunkt 15 wurde in diesem Faden unabhängig nachgerechnet. Die angehängten Visuals und der Ordner-Screenshot wurden gesehen; die Repo-Dateien hinter dem Screenshot sind für Mission Control **noch zu finden und zu vergleichen**. Einige gleichnamige Arbeitsdateien und E8-Testausgaben lagen im Gesprächsarbeitsbereich und wurden für diese Übergabe als Orientierung gelesen; daraus folgt keine Aussage über ihren aktuellen Stand im Nutzer-Repository.
