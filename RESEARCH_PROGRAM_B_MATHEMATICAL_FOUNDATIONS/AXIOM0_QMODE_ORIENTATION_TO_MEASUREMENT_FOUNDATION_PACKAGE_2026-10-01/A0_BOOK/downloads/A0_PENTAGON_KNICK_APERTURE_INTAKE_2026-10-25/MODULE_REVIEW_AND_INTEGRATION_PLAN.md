# Körper / Fünflaschenkrone · Modulreview und Integrationsplan

Stand: 25. Oktober 2026  
Status: `PARKED_SOURCE_BOUND_MODULE_INTAKE / REVIEW_REQUIRED`

## Zweck

Dieser Nachtrag hält den Körper-Due-Diligence-Bericht, das Quellenpaket der
Fünflaschenkrone und die daran anschließenden Prüf-, Build- und
Integrationsaufgaben gemeinsam fest. Er erweitert den bestehenden
Pentagon/Knick/Apertur-Intake. Er eröffnet keine neue Study, Finding-Nummer,
Family, Navigator-Identität oder Publikation.

Die fünf Mechanismen beziehungsweise Schnittstellen bleiben getrennt:

1. vollständig triangulierte und verklebte Laternenhaut;
2. fünf getrennte Schieberebenen der Iris;
3. fünf offene starre Laschen der Fünflaschenkrone;
4. festes Shadow Triangle mit drei Aufwärts- und zwei Abwärtseingängen;
5. späterer Gehäuse-, Pin-, Lager- und Antriebsverbund.

Kontakt, Projektion, visuelle Ähnlichkeit und gemeinsamer Zahlenwert sind
keine Identität dieser Mechanismen.

## Empfang und Review

| Objekt | Ergebnis | Disposition |
|---|---|---|
| `NEXAH_Koerper_Due_Diligence_2026-10-25.txt` | lesbarer Quelltext, SHA-256 gebunden | Review-Quelle |
| `NEXAH_Koerper_Due_Diligence_2026-10-25.docx` | 11/11 Seiten gerendert und visuell geprüft; keine Clipping-, Überlappungs- oder Tabellenfehler | Review-Quelle |
| abgeleitetes PDF | aus dem unveränderten DOCX gerendert | Lesekopie, keine neue Quelle |
| `NEXAH_Fuenflaschenkrone_Quellen_2026-10-25.zip` | sichere relative Pfade; fünf Einträge; Quellen unverändert und zusätzlich entpackt | Paketprovenienz |
| `NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb` | vom Desktop wiederhergestellt; GLB-2.0-Struktur, Chunks, BufferViews und fünf Animationskanäle lokal geprüft | `DELIVERED / STRUCTURAL_PASS / INDEPENDENT_VALIDATOR_OPEN` |
| `NEXAH_Shadow_Triangle_3plus2_Quellen_2026-10-25.zip` | sichere relative Pfade; sieben Einträge; unverändert und zusätzlich entpackt | Paketprovenienz |
| `NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb` | vom Desktop wiederhergestellt; GLB-2.0-Struktur, Chunks, BufferViews und fünf Animationskanäle lokal geprüft | `DELIVERED / STRUCTURAL_PASS / INDEPENDENT_VALIDATOR_OPEN` |
| `NEXAH_Shadow_Triangle_3plus2_2026-10-25.png` | 2720 × 1530 Pixel; 3+2-Kontakt- und Lastfallübersicht | Visual- und Quellenkontext |

Das ZIP enthält den Builder, `models.json`, `native_contact_results.json`,
README und einen leeren `deliverables/.keep`-Platzhalter. Es enthält keine GLB,
kein PNG, keine STL-Dateien und keine separate `audit_results.json`. Der
Gesamtbericht beschreibt einen größeren Auditbestand; dieser kleine Crown-ZIP
ist daher nicht allein die vollständige Reproduktionsbeilage des Berichts.

Beide GLBs wurden nach der Wiederherstellung aus dem Papierkorb bytegenau in
Repository-Custody übernommen. Eine lokale, unabhängige Strukturprüfung
bestätigt glTF 2.0, JSON-/BIN-Chunks, deklarierte Buffergrenzen und jeweils eine
achtsekündige Animation mit fünf Kanälen. Ein externer Khronos-/glTF-Validator
und der reproduzierbare Source-Build bleiben offen. Der lokale Buildversuch
stoppt weiterhin vor einer Ausgabe, weil `numpy`/`scipy` in der verfügbaren
Review-Umgebung fehlen. Das ist ein Umgebungs-Gap, kein Geometriebefund.

## Shadow Triangle 3+2

- Das dunkle Dreieck ist eine neue feste Kontaktfläche unter der offenen
  Krone, keine wiedergewonnene metrische A0-Originalfläche.
- Drei Punkte `U1–U3` liegen symmetrisch als Aufwärtseingänge, zwei Punkte
  `D1–D2` symmetrisch als Abwärtseingänge strikt innerhalb des Dreiecks.
- Bei fünf gleich starken Eingängen bleibt eine resultierende Einheitskraft
  nach oben. Erst die gewählte Gewichtung `3 × 1 − 2 × 1,5 = 0` liefert im
  idealisierten Modell Nullresultierende und numerisch verschwindendes Moment
  um den Schwerpunkt.
- Nullresultierende bedeutet weder Stabilität noch Kraftübertragung. Lager,
  Reaktionen, Reibung, Steifigkeit, Material, Antrieb und Kopplung an Krone
  oder Laterne sind nicht modelliert.
- Die gesicherten Detailansichten zeigen obere/untere Seite, White Pearl,
  schwarze Teilflächen, äußere Stützen und Laschen als Beobachtungsansichten;
  daraus wird kein zusätzlicher Operator abgeleitet.

## Equation- und Address-Track

Die heutige Arbeit berührt zusätzlich den bereits vorhandenen, aber getrennt
typisierten Adressraum aus `pi`, `phi/Phi`, `sqrt(2)`, Primzahlindex,
Euler-Totient, Fibonacci und Euclid-Geometrie. Dieser Track wird nicht als
Mechanik des Shadow Triangle oder der Krone gelesen:

- Paper E §8.4 führt `phi`, `Theta`, `pi` und `sqrt(2)` als historische,
  typisierte Adressachsen einer Darstellung, nicht automatisch als
  kartesische Raumachsen;
- Paper E §8.6 trennt Euler-Totient `φ(n)`, goldenen Quotienten `Φ` und
  Drehphase `φ` trotz ähnlicher Zeichen;
- Check 88 hält den negativen Kontrollbefund
  `FIBONACCI_NOT_PRIVILEGED`; strukturierte Fibonacci-Abtastung ersetzt keine
  passende Baseline;
- die Typed-Coupling-Workbench zeigt Fibonacci/Euler parallel, aber ohne
  gemeinsamen Generator, gemeinsame Uhr oder Prime-Metrik;
- `Equations Part Iii.pdf` bleibt im Source Manifest als repräsentativ
  gesichtete Quelle verzeichnet; vor einer Kopier-Ingestion fehlen weiterhin
  Dateiinventar, Hash, genaue Fundstelle, Lizenz-/Custody-Klärung und
  Claim-Bindung.

## Gebundener Erkenntnisstand

- Die neue Fünfererweiterung verwendet fünf offene, starre, gleichschenklige
  Laschen an einem regelmäßigen Pentagonrand.
- Der deklarierte Spitzenkontakt liegt bei `151.830500786°`; die Spitzenhöhe
  beträgt `0.368533211 u` über dem Rand.
- Der Bericht trennt ausdrücklich Kontakt von Verklebung und die offene Krone
  von der starren triangulierten Laternenhaut.
- Der definierte Controllerwechsel erhält Kantenlängen und Pinabstände unter
  der angegebenen Isometrie, nicht aber alle Rollenlabels oder Höhenreadouts.
- Wissenschaftliche Neuheit, Patentneuheit, materielle Tragfähigkeit,
  Kollisionsfreiheit des Gesamtwegs, Antrieb, Dichtheit und optische Funktion
  sind nicht bestätigt.

## Testmatrix vor einer Build-Abnahme

### T0 · Custody und Dokument

- Hashprüfung aller empfangenen Dateien und entpackten Quellen;
- ZIP-Pfad- und Paketvollständigkeitsprüfung;
- DOCX-Renderprüfung aller Seiten;
- beide wiederhergestellten GLB-Originale mit Herkunft und Hash erhalten.

### T1 · Reproduzierbarer Source-Build

- deklarierte Python-Version und Abhängigkeiten (`numpy`, `scipy`,
  `matplotlib`) einfrieren;
- `build_crown_visual.py` in sauberer Umgebung ausführen;
- PNG und GLB erzeugen und ihre Hashes als Receipt sichern;
- GLB-Header, Chunk-Längen, BufferViews und fünf Animationskanäle prüfen
  (`STRUCTURAL_PASS` für beide wiederhergestellten GLBs);
- GLB zusätzlich mit einem unabhängigen glTF-Validator prüfen.

### T2 · Geometrie und Animation

- 121 Stellungen: beide Schenkellängen je Lasche konstant;
- zentralen Kontakt aller fünf Spitzen am Endzustand prüfen;
- Quaternionpfade gegen direkte Koordinaten prüfen;
- offene, mittlere und geschlossene Stellung als getrennte Frames sichern;
- keine freie Kantenverklebung vor Kontakt unterstellen.

### T3 · Mechanik und Kollision

- Laschendicke, Gelenkspiel und reale Lagerachsen ergänzen;
- den gesamten Weg gegen Pin, Schieberdeckel, Laternenhaut, Zwischenrahmen und
  Gehäuse mit endlichen Dicken prüfen;
- direkte Koordinatenanimation gegen einen Zwangsbedingungslöser vergleichen;
- Restfehler, Mindestabstände und erste Kollision ausgeben;
- Gegenplatte, Bügel und genau einen Antriebsparameter festlegen.
- für Shadow Triangle zusätzlich Auflagerreaktionen, Steifigkeit und einen
  expliziten Transmissionspfad definieren; Gleichgewicht allein genügt nicht.

### T4 · Browser- und GLB-Abnahme

- GLB in mindestens zwei echten Viewern öffnen;
- Animation Start/Pause/Loop/Reset sowie Kamera und mobile Ansicht prüfen;
- zentralen Pin und alle fünf Laschen im gesamten Zyklus sichtbar halten;
- reduzierte Bewegung und statische Fallback-Ansicht anbieten;
- keine visuelle Endstellung als mechanische Freigabe beschriften.

### T5 · Integration

- die Krone zuerst als eigenes, austauschbares Crown-Modul führen;
- Laterne, Schiebeiris und Krone über explizite Adapter verbinden, nicht durch
  gemeinsame Farbe, Zahl oder Overlay;
- Typed-Coupling-Workbench nur als benachbarte View-/Sequence-Linse
  referenzieren; kein E8-, Pink-Strip- oder Green-Star-Mechanismus wird in die
  Krone importiert;
- erst nach T1–T4 über Einbau in Bench, 3D-Atlas oder Guided Tour entscheiden.

### T6 · Prototyp und Science Gate

- maßstäblichen Karton- oder Lagerprototyp bauen und messen;
- erst danach Kraft, Takt, Verschleiß, Lichtabschluss oder Materialverhalten
  untersuchen;
- Literatur- und gegebenenfalls Patentneuheitsprüfung mit vollständigem Graphen
  und Zwangsbedingungen durchführen;
- nur ein Owner-admittierter Run Contract kann daraus eine Science-Lab-Study
  oder einen höheren Evidenzstatus machen.

## Verwertung in Desk, Papers/Notes und Builder Log

- **Science Desk:** Intake, Mechanismustrennung, Reviewstatus und nächste Gates.
- **Findings/Papers/Notes:** paper-worthy Kandidaten und Claim-Grenzen; noch
  keine Paper-Promotion.
- **Builder Log:** konkrete Build-, Validator-, Browser- und Integrationsarbeit.
- **NSN:** Wiederverwendung der bestehenden A0-Orientation-Evidence-Lineage;
  keine neue Node oder Relation.
- **Typed Coupling Workbench:** verwandter heutiger Build mit eigener
  `ART:E8:TYPED_COUPLING`-Autorität; nur Cross-Link, keine Identitätsfusion.

## Nächster erlaubter Schritt

Beide GLBs sind nun gesichert. Der source-bound
[Crown → Shadow Contact Bench](../../A0_CROWN_SHADOW_CONTACT_BENCH.html) ist als
Engineering-Adapter implementiert und lokal im echten Browser für
`OPEN/CONTACT/RETURN`, `FRONT/BACK/SECTION`, beide Modellquellen sowie
`EQUAL/BALANCED` geprüft. Seine 88 lokalen Engineering-Prüfungen bestehen.

Dieser Build schließt T1–T4 nicht stillschweigend: Der nächste wissenschaftlich
belastbare Schritt bleibt ein reproduzierbarer Source-Build in deklarierter
Umgebung, Vergleich der erzeugten Hashes, unabhängige glTF-Validierung,
Source→GLB-Vertexresiduum, mobile Zweitansicht und kontinuierliche
Kollisionsprüfung. Für das Shadow Triangle folgen Reaktions-/Stabilitätsmodell
und definierter Transmissionspfad. Der Bench markiert den Gesamtstatus daher
als `PARTIAL`; Krone und 3+2-Dreieck bleiben klar parametrisierte
Modellkandidaten und kein integrierter Mechanismus.
