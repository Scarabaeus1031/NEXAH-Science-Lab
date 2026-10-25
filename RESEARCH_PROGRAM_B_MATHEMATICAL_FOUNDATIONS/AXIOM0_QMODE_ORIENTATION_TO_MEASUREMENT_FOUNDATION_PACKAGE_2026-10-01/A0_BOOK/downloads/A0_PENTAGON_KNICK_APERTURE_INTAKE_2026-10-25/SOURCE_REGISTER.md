# Source Register

## Interaktiver Bestand

| Datei | Rolle | Disposition |
|---|---|---|
| `NEXAH_PENTAGON_KNICK_APERTURE_LAB.html` | jüngster eindeutiger Instrumentstand | Intake-Kandidat, keine Admission |
| `sources/html-history/01-base.html` | frühe Pentagon/Knick-Fassung | Provenienz |
| `sources/html-history/02-ring.html` | Ring-/Apertur-Fassung | Provenienz |
| `sources/html-history/03-graph.html` | Graph-/Routen-Fassung | Provenienz |
| `sources/html-history/04-tip-and-coordinate-controls.html` | zusätzliche Spitze-/Koordinaten-Fassung aus Downloads | Provenienz |
| `sources/coordinate-test-package-v7/NEXAH_Koordinaten_Testpaket/NEXAH_Pentagon_Knick_Lab.html` | jüngster empfangener v7-Stand mit Koordinaten, Sequenzen und Teileradapter | geparkter Review-Kandidat; ersetzt den Intake-Entry noch nicht |
| `sources/standalone/NEXAH_TEILER_STREIFEN_DESK.html` | eigenständiger Teiler-/Streifen-Desk | geparkter Instrumentkandidat; Browserabnahme offen |
| `sources/html-history/05-curtain-preflight.html` | Zwischenstand vor dem vollständigen Curtain-Nahttest | Provenienz |
| `sources/curtain/NEXAH_PENTAGON_KNICK_CURTAIN_LAB.html` | jüngster Curtain-/Scharnier-Instrumentstand | geparkter Review-Kandidat; keine Admission |
| `sources/curtain/NEXAH_CURTAIN_SCHARNIER_NAHTTEST_2026-10-25.txt` | 242 lokale Faltzustände und Fugenabstände | empfangener Testrecord; noch kein unabhängiger Lab-Replay |
| `sources/lantern/NEXAH_PENTAGON_GELENKLATERNE_LAB.html` | Modell 11 mit gemeinsamem Cockpit, Curtain-Overlay und getrennter Schiebeiris | jüngster source-bound Engineering-Prüfstand; vollständige Browserabnahme offen |
| `reports/NEXAH_PENTAGON_GELENKLATERNE_ABSCHLUSSBERICHT_2026-10-25.docx` | Bericht über Irisflächen, Pin-Freiraum und Rangprüfung der starren Haut | empfangener, visuell geprüfter Abschlussbericht; keine F-A0-Promotion |
| `sources/standalone/NEXAH_TEILER_STREIFEN_DESK_V4.html` | jüngster Teiler-/Streifen-Desk mit 13/17-Loop | geparkter Instrumentkandidat; Browserabnahme offen |
| `reports/body-due-diligence/NEXAH_Koerper_Due_Diligence_2026-10-25.txt` | vollständiger lesbarer Berichtstext über Platte, Körper, Laterne, Schieber, Crown und Controllerwechsel | empfangene Review-Quelle |
| `reports/body-due-diligence/NEXAH_Koerper_Due_Diligence_2026-10-25.docx` | elfseitige formatierte Due-Diligence-Fassung | 11/11 Seiten visuell geprüft; keine Paper-Promotion |
| `reports/body-due-diligence/NEXAH_Koerper_Due_Diligence_2026-10-25.pdf` | lokale Renderkopie des unveränderten DOCX | Lesekopie, keine selbstständige Quelle |

Die Datei `NEXAH_Pentagon_Knick_Lab-2 copy.html` war byte-identisch mit dem übernommenen jüngsten Stand und wurde deshalb nicht doppelt abgelegt.

## Empfangene Testpakete

| Datei | Modellstand | Disposition |
|---|---|---|
| `sources/packages/NEXAH_Koordinaten_Testpaket_v6_2026-10-25.zip` | `pentagon-coordinate-sequence-lab/6` | unveränderte Paketprovenienz |
| `sources/packages/NEXAH_Koordinaten_Testpaket_v7_2026-10-25.zip` | `pentagon-coordinate-sequence-lab/7` | unveränderte jüngste Paketprovenienz |
| `sources/coordinate-test-package-v7/` | vollständig entpackter v7-Inhalt | lokale Inspektion und spätere reproduzierbare Prüfung |
| `sources/packages/NEXAH_Sechserstreifen_A9_Testpaket_2026-10-25.zip` | empfangener A9-/Sechserstreifen-Stand | unveränderte Paketprovenienz |
| `sources/a9-six-strip-package/` | vollständig entpackter A9-Paketinhalt | lokale Inspektion; kein historisch wiedergefundenes A9-Mesh |
| `sources/packages/NEXAH_Fuenflaschenkrone_Quellen_2026-10-25.zip` | Builder, Modelle und Kontaktresultate der fünf offenen Laschen | unveränderte Paketprovenienz; GLB separat vom Desktop wiederhergestellt |
| `sources/five-flap-crown/` | vollständig entpackter Crown-Quellenstand | Review-Quelle; Source-Build und unabhängige GLB-Validierung offen |
| `deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb` | animierter Crown-Entwurf mit fünf Kanälen | vom Desktop wiederhergestellt; glTF-2.0-Struktur lokal lesbar, unabhängiger Validator und Source-Rebuild offen |
| `sources/packages/NEXAH_Shadow_Triangle_3plus2_Quellen_2026-10-25.zip` | Builder, Modell und native Kontaktresultate für drei aufwärts- und zwei abwärtsgerichtete Eingänge | unveränderte Paketprovenienz; sichere Pfade geprüft |
| `sources/shadow-triangle-3plus2/` | vollständig entpackter Shadow-Triangle-Quellenstand | Review-Quelle; kein bestätigter Mechanismus oder Stabilitätsnachweis |
| `deliverables/glb/NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb` | animierter 3+2-Entwurf mit fester Dreiecksebene | vom Desktop wiederhergestellt; glTF-2.0-Struktur lokal lesbar, unabhängiger Validator und Source-Rebuild offen |

Die im Paket enthaltenen Tests und Ergebnisdateien bleiben empfangene
Source-Records. Sie wurden durch die Ablage nicht als Science-Lab-Run
reklassifiziert oder unabhängig reproduziert.

Die beiden GLBs wurden nach der Wiederherstellung aus dem Papierkorb auf dem
Desktop gefunden und bytegetreu in Repository-Custody kopiert. Die Originale
auf dem Desktop blieben unangetastet. Beide Container sind als glTF 2.0 lesbar:
die Krone enthält 31 Nodes, 4 Meshes und eine Animation mit 5 Kanälen; das
Shadow Triangle enthält 37 Nodes, 7 Meshes und ebenfalls 5 Animationskanäle.
Das ist ein `STRUCTURAL_PASS`, kein unabhängiger Khronos-Validator-Pass und
keine mechanische Bestätigung. Der dokumentierte Source-Rebuild bleibt wegen
der in der Review-Umgebung fehlenden deklarierten `numpy`/`scipy`-Abhängigkeiten
offen.

## Direkte Visuals

| Datei | Lesart | Grenze |
|---|---|---|
| `01-central-ring-five-windows.png` | zentrale Öffnung und fünf äußere Zwischenräume | virtuelle Messflächen |
| `02-lab-reference-preset.png` | interaktiver Referenzzustand | keine Stabilitätsaussage |
| `03-lab-flat-preset.png` | flacher zulässiger Zustand | keine Mechanikbehauptung |
| `04-ten-fields-rgb-route.png` | zehn Teilfelder und Zwei-Schritt-Weg | Ansichtsregel, keine neue Graphkante |
| `05-11-winds-reference.png` | elf adressierte Pin→Hüllenecke-Richtungen | ungleich verteilt, keine Elfer-Symmetrie |

## Neue Kandidatenvisuals

| Datei | Lesart | Grenze |
|---|---|---|
| `visuals/candidates/NEXAH_PENTAGON_CURTAIN_CONSTRUCTION_STUDY.png` | Curtain, Ghostpentagon, Apertur und Spitzenvariante | konzeptuelle Visualisierung; keine maßstäbliche Geometrie oder Mechaniksimulation |
| `visuals/candidates/NEXAH_PENTAGON_GELENKLATERNE_TESTED_GEOMETRY_OPEN_MECHANISM_2026-10-25.png` | gemeinsame Übersicht von Curtain, getrennter Fünf-Ebenen-Iris, Adressweg, Pin-Freiraum und starrer Haut | source-bound Konzeptvisual; Teilmodelle getestet, Gesamtmechanismus, Führung, Antrieb und Gehäuse offen |
| `visuals/candidates/NEXAH_13_17_OFFSET_LOOP.png` | getrennte 13er-/17er-Register und gemeinsamer Return | gewähltes Referenzmodell; Glyphenzuordnung offen |
| `sources/a9-six-strip-package/NEXAH_Sechser_A9_Paket/NEXAH_A9_11_12_13_Kandidat.png` | elf Randpunkte plus zwei gewählte Spitzen | neuer Kandidat, kein rekonstruiertes A9-Quellmesh |
| `visuals/candidates/NEXAH_Shadow_Triangle_3plus2_2026-10-25.png` | Draufsicht, fünf innere Kontaktpunkte und die deklarierte 3+2-Lastlesart | konstruktiver Entwurf; Gleichgewicht ist nicht Stabilität |

## Kontext

`context/NEXAH_Arbeitsstand_2026-10-24.txt`,
`context/NEXAH_KOORDINATEN_UND_VERBINDUNGSTESTS_2026-10-25.md` und
`context/NEXAH_A0_FORSCHUNGSKANDIDATEN_UND_VERTIEFUNGSFRAGEN_2026-10-24.md`
sind datierte Arbeitsstände und ausschließlich Kontext. Sie ersetzen weder
aktuelle Registry, Binder, Desk noch Source Graph.

Die Dateien in `visuals/context/` bewahren D-Spalt/Horizont, gegensinnige Pentagon-Drehung, Zwischenraum, Fibonacci/Euler-Ziffernschnitt, Spur/Projektion und die zusätzliche FE-Geometrieberechnung als benachbarte Arbeitsspuren. Sie sind keine Quellen für die Lab-Geometrie und werden durch die gemeinsame Ablage nicht zu einem Operator oder Mechanismus verbunden. Zwei zusätzliche Photos-Library-Dateien waren byte-identisch mit `01-central-ring-five-windows.png` und `04-ten-fields-rgb-route.png` und wurden nicht doppelt abgelegt. Weitere Paketvisuals bleiben mit ihrem Originalnamen unter `sources/coordinate-test-package-v7/` erhalten.

Die fünf Dateien in `visuals/shadow-triangle-context/` bewahren die vom User
markierten Vorder-/Rückseiten-, White-Pearl-, 1+3-, Kleinpyramiden- und
Pillar/Laschen-Ansichten. Sie sind visuelle Kontextbelege für spätere
Geometrie- und Viewer-Tests, nicht selbst Messdaten oder eine Gleichung.

Die genaue Übernahme loose→Repository und alle Duplikatentscheidungen stehen
im [Custody Index](CUSTODY_INDEX.md).
