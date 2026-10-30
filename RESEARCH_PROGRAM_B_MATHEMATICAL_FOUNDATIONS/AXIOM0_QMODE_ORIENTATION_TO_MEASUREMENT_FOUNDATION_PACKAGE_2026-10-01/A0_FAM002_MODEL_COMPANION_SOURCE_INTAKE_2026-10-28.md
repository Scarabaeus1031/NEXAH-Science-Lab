# Science-Desk-Intake — FAM-002 Modelle und direkte Begleitquellen

**Datum:** 28. Oktober 2026
**Disposition:** `PASS_SOURCE_CUSTODY / HELPS_TEST / NO SCIENCE ADMISSION`
**Familie:** `FAM-002`
**Wiederverwendete Identität:** `NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1`

## Kurzurteil

Die historischen GLB/GLTF/PLY-Modelle sind nicht als isolierte Bilder zu
lesen. In denselben Ordnern liegen technische PDFs, READMEs, CSVs und JSONs,
die eine beabsichtigte Formatbrücke dokumentieren:

- CSV/JSON: Knoten, Gruppen, Farben, Koordinaten, Ticks und Klassen;
- GLB/GLTF/PLY: geometrische Ansichten dieser Daten;
- PNG/PDF: ausgewählte Projektionen und Katalogansichten;
- README/Log: Status, Fehler, Erklärung und offene Arbeit.

Diese Quellenlage macht die Modelle für A0 wesentlich nützlicher. Sie erlaubt
quellengebundene Tests von Ansicht, Achse, Cut, Ring, Marker, Retention und
Return. Sie rechtfertigt aber keine Gleichsetzung der historischen Labels mit
einem mathematischen oder physikalischen Mechanismus.

## Custody-Resultat

Der bestehende FAM-002-Atlas wurde begrenzt wieder geöffnet. Gebunden sind:

- `12` ausgewählte Modellträger;
- `20` direkte Begleitquellen;
- `2` externe BIN-Abhängigkeiten der ausgewählten glTF-Dateien.

Für alle `34` Dateien sind aktueller Pfad, Byte-Größe und SHA-256 festgehalten.
Der Validator besteht. Es wurde keine neue Familie, Navigator-Identität,
Graphrelation, Study oder Finding-Nummer angelegt.

Zusätzlich wurde der gesamte Dokumentbestand im exakten historischen
Modulbaum inventarisiert und textuell geprüft: `26` PDFs und `2`
TXT-READMEs; `.md`-Dateien liegen dort nicht. Acht dieser PDFs sind als
direkte Quellen im ausgewählten Modellmanifest gebunden. Die übrigen `18`
PDFs und zwei TXT-Dateien sind als Kontextbestand mit Pfad, Größe, Hash und
Dokumentklasse in einem separaten Ordnerregister erfasst. Kontextpräsenz
erhöht weder Evidenzstatus noch Claim ceiling.

Atlas-Intake:
`SCIENCE_LAB/REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/FAM_002_A0_ORIENTATION_INTAKE_2026-10-28/`

## NSN- und Mission-Control-Abgleich

Die Fundstelle ist im Navigator nicht als neue Modulidentität zu behandeln:

- der historische 3D-Census führt den Träger bereits als `FAM-002` mit
  `173` 3D-Dateien und `18` HTML-Kandidaten;
- das NSN-Modulregister delegiert die Autorität für den eingefrorenen
  3D-Bereich an den `CONSTELLATION_REVIEW_REGISTER.csv`;
- dort liegt `FAM-002` in `C-08` (*Scarabaeus 1033 CIKADA release chains*)
  weiterhin unter `PROVENANCE_INTAKE_PARTIAL_LINEAGE_OPEN`;
- der aktuelle Intake schließt für die ausgewählten 12 Modelle die lokale
  Pfad-/Hash-/Begleitquellen-Custody, aber nicht die gesamte release- und
  familienübergreifende C-08-Lineage.

Damit ist der richtige Anschluss: bestehende Familie und bestehende
Orientation-Evidence-Line wiederverwenden, Science Desk und A0-Backlog mit dem
begrenzten Intake verlinken und keine zusätzliche Navigator-Route anlegen.

## Science-Desk-Bewertung

| Quellenklasse | Status | Zulässige Verwendung |
|---|---|---|
| Node-Map, Gruppen, Palette | `MACHINE_READABLE_SOURCE` | Marker-/Farb-/Gruppenansicht gegen deklarierte Quelle prüfen |
| Lens-, Axis-, Clock-, Overlay- und Anchor-CSV/JSON | `MACHINE_READABLE_SOURCE` | Koordinaten, Winkel, Ticks und Klassen reproduzieren |
| Master README, DREEM Bundle README, CRO README | `SOURCE_BOUND_TECHNICAL_NOTE` | Paketstruktur, Formatrollen und bekannte Grenzen lesen |
| CRO Export Log | `SOURCE_BOUND_TECHNICAL_VERIFICATION` | bekannte Export-/Material-/CSV-Fehler und Hotfixstatus berücksichtigen |
| Gallery III | `SOURCE_BOUND_DRAFT_CATALOG` | Visualnummern und vorgeschlagene Crosswalks als Draft behandeln |
| Master Bridge Log | `SOURCE_BOUND_HISTORICAL_PLAN` | beabsichtigte Single-Source-Brücke dokumentieren, nicht ihre vollständige Umsetzung voraussetzen |
| Manifest-Kurzfassung | `CLAIM_BOUNDARY` | ausdrücklich: Spielraum/Erkundung, keine Beweisführung |
| DREEM Last Log | `RELATED_ONLY_UNRESOLVED` | Owner-Sprache und offene Ideen erhalten, nicht als Definition hochstufen |

## Vollständiger Ordner-Sweep der Begleitdokumente

Der zusätzliche Sweep bestätigt die vom Human Owner erinnerte
Dokumentstruktur. Der historische Ordner enthält neben den Modellen:

- technische Paket- und Mapping-READMEs;
- Export- und Hotfix-Logs;
- Bridge-Pläne mit noch offenen Builder-, Statistik- und Monte-Carlo-Schritten;
- Visual Galleries, darunter ausdrücklich als `Draft` gekennzeichnete
  Fassungen;
- Zahlenlogs, Essence- und Logbook-Dokumente mit Arbeitsnotizen;
- zwei Klartext-READMEs, die CSV/JSON als Mapping- beziehungsweise
  Palettenquelle und GLB/GLTF als davon abgeleitete Ansicht beschreiben.

Materiell ist vor allem die interne Evidenzgrammatik der Quantum-Grid-READMEs:
`Fact`, `Measured/Numerical`, `Derived`, `Heuristic`, `Conjecture` und
`Metaphor` werden dort ausdrücklich unterschieden. Die Dokumente markieren
zahlreiche Gamma-, Lilith-, Event-Horizon-, Resonanz-, kosmologische und
Numbermagick-Anschlüsse selbst als `Conjecture`, `Heuristic`, `Metaphor`,
`Arbeitshypothese`, Draft oder offenen nächsten Schritt. Diese Selbstklassifikation
ist für den Science Desk verbindlicher als die bildliche Ähnlichkeit der
Visuals.

Ebenso wichtig: Formulierungen wie „fertig“, „abgeschlossen“ oder „bereit für
Finalisierung“ bezeichnen in diesen Quellen überwiegend Paket-, Export- oder
Galeriezustände. Sie sind keine externe wissenschaftliche Validierung. Die
Bridge-Dokumente fordern selbst noch Signifikanztests, Monte-Carlo-Vergleiche,
vereinheitlichte CSVs und einen generischen Builder. Damit bleibt der Bestand
ein wertvoller historischer Modell- und Testkorpus, aber kein bestätigtes
gemeinsames Natur- oder Zahlengesetz.

Vollständiges Dokumentregister:
`SCIENCE_LAB/REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/FAM_002_A0_ORIENTATION_INTAKE_2026-10-28/FAM_002_FOLDER_DOCUMENT_REGISTER_2026-10-28.json`

## Materielle Konflikte und Grenzen

1. Die beiden DREEM-Dokumente lösen das Akronym unterschiedlich auf. Beide
   Fassungen bleiben erhalten; keine wird ohne weitere Autorität kanonisch.
2. Der Master Bridge Log beschreibt einen gewünschten generischen Builder und
   einen Node-29-Piloten. Das belegt nicht, dass jedes ausgewählte Modell aus
   genau diesem Builder erzeugt wurde.
3. Gallery III ist als Draft gekennzeichnet. Visualnummern und Bezeichnungen
   sind daher Kataloghinweise, keine endgültige Ontologie.
4. Ein korrektes CSV/JSON↔GLB-Mapping kann Darstellungs- und Returnfragen testen.
   Es validiert keine Riemann-, Zeitdilatations-, Feld-, Resonanz- oder
   Numbermagick-Deutung.
5. Die zwei externen glTF-BIN-Dateien sind vorhanden und hashgebunden. Damit
   ist die technische Abhängigkeit geschlossen; die Semantik bleibt offen.
6. Die Visual Galleries und Zahlenlogs dokumentieren einen wachsenden
   Interpretationsraum. Sie sind keine zusätzliche Maschinenquelle für die
   Geometrie, solange keine explizite CSV/JSON- oder Builder-Bindung vorliegt.
7. Die zwei TXT-READMEs stärken die konkrete 24-Ringknoten-plus-Zentrum-
   Rekonstruktion. Sie autorisieren nicht die wissenschaftlichen Namen oder
   metaphorischen Rollen der Knoten.

## A0-Anschluss

Die Modelle werden als `SOURCE_BOUND_ORIENTATION_FIXTURE_ONLY` an die bestehende
Orientation-Evidence-Line gebunden. Der stärkste erlaubte nächste Test ist:

1. eine maschinenlesbare Quellzeile auswählen;
2. dieselbe Adresse in mindestens zwei Modell-/Projektionsansichten lokalisieren;
3. Retained, Lost, Introduced und Unresolved protokollieren;
4. einen Return nur dann akzeptieren, wenn Quelle, View-Operator und Witness
   zusammen die Quelladresse eindeutig rekonstruieren;
5. bei bloßer Form- oder Farbähnlichkeit `RELATED_ONLY` beziehungsweise `HOLD`
   zurückgeben.

## Konsolidierte Orientierungsnotiz — Three Tracks / Paired Plates / Joint / Gap

Status: `DOCUMENTARY_SYNTHESIS / BENCH_OUTPUT_PROVENANCE / PREPARATION_ONLY`

Diese Notiz bindet die jüngste Bench-Lesart an den ursprünglichen FAM-002-
Intake zurück. Die dafür gezeigten Bench-Screenshots sind interne Ausgaben der
`NEXAH_A0_ORIENTATION_CONTROLLER_BENCH`. Sie sind nützliche Ansichten, aber
keine unabhängige Bestätigung der Geometrie, die dieselbe Bench rendert.

### Minimales Vokabular

- **Carrier/Plate:** ein Träger mit eigener Quelle und eigener Adresse;
- **Track:** eine deklarierte Spur auf einem Carrier; drei sichtbare Spuren
  bedeuten nicht automatisch drei neue Zustandsräume;
- **Seam/Gap:** die adressierbare Schnittstelle zwischen zwei Carriern, nicht
  ohne weiteren Vertrag ein vierter Track oder ein physischer Zwischenraum;
- **Pascal Joint/Diamond:** lokale Korrespondenz an der Naht. Er überträgt nur
  die im konkreten Joint-Vertrag genannten Daten;
- **TESA strip:** ein Adress-/Boundary-Overlay. Die bestehende Bench bezeichnet
  ihre Tür ausdrücklich als `ADDRESS ONLY` und trennt den Facelet-Trapdoor-
  Vertrag von einem Zustandstransfer;
- **Ghostgrid:** alternative, verborgene oder abgeleitete Orientierung einer
  Darstellung. Es ist nicht stillschweigend dieselbe State Space wie ein
  Generatorzustand;
- **Cut / Witness / Return:** Cut wählt eine Ansicht, Witness bindet die für den
  Rückweg nötige Zusatzinformation, Return rekonstruiert nur innerhalb dieses
  deklarierten Vertrags.

Die Owner-Ausdrücke „Tesa-Rec“, „Versiegelung“ und „Gap“ bleiben als hilfreiche
Lesarten erhalten. Sie werden hier nicht zu neuer Identität, Kraft, Material
oder kanonischem Operator hochgestuft.

### Vier nicht äquivalente Gleichheiten

Für zwei angezeigte Punkte `x` und `y` werden vier Fragen getrennt:

1. `D(x,y)`: gleiche Displayposition;
2. `A(x,y)`: gleiche deklarierte Grid-/Carrier-Adresse;
3. `S(x,y)`: gleicher gebundener Quellpunkt beziehungsweise Quellzustand;
4. `R_W(x,y)`: gleicher rekonstruierter Punkt unter einem benannten Witness
   `W`.

Im Allgemeinen gilt weder `D⇒A` noch `D⇒S` oder `D⇒R_W`. Auch `A⇒S` gilt nur,
wenn die Adressabbildung für den betrachteten Bereich injektiv und
quellengebunden ist. Eine Lissajous-Kreuzung kann daher dieselbe 2D-Position zu
verschiedenen Parameterwerten zeigen, ohne denselben Quellzustand zu belegen.
Der Pascal-Thread-Return verwendet folgerichtig sichtbaren Record und, falls
nötig, Faserordinal statt Pixelkoordinaten.

### Exakte Arithmetik und offene geometrische Lesart

Die Gap Card enthält exakte Identitäten:

- `206²−204²=820=41·20`;
- `204²=41616=23³+24³+25³=(12·17)²`;
- `41616+26³=59192=2³·7²·151` mit genau `24` positiven Teilern.

Diese Rechnungen dürfen als exakte Marker oder Testdaten verwendet werden.
Bezeichnungen wie „torsion bridge“, „Nexus“, „Versiegelung“ oder ein
mechanischer Zusammenhang zwischen den Zahlen und den Platten bleiben dagegen
Interpretationen, bis Operator, Domäne, Einheiten und Falsifikationskriterium
gebunden sind.

### Konsolidiertes Resultat

Der belastbare Gewinn ist eine Testgrammatik: gleiche Pixel, gleiche Adresse,
gleiche Quelle und gleicher Return werden nicht mehr vermischt. Der Intake
bewahrt Quellen und Grenzen; der A0-Backlog führt nur noch den dazugehörigen
offenen Vierfachvergleich. Es entsteht keine neue Family, Navigator-Identität,
Relation, Study oder Finding-Kandidatur.

## Claim ceiling

`SOURCE_BOUND_ORIENTATION_FIXTURE_ONLY`

Kein neuer Satz, kein Physikclaim, kein Beweis zur Riemannschen Vermutung,
keine kanonische DREEM-Auflösung, keine neue A0-Relation und keine aktive
Verständnisstudie.
