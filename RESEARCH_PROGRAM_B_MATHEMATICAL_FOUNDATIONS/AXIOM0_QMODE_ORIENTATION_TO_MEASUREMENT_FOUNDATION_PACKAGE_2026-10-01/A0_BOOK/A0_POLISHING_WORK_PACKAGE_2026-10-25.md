# A0 Polishing · Arbeitspaket

Stand: 25.10.2026  
Modus: begrenzte UI-, Navigations- und Lesefluss-Pflege  
Ziel: A0 soll direkt lesbar sein, zuverlässig rendern und immer einen sichtbaren Rückweg anbieten.

## Grenze

Dieses Paket verwendet die bestehende A0-Identität und die vorhandenen Seiten. Es erzeugt keine neue Navigator-ID, Relation, Study, Finding, Publikation oder wissenschaftliche Autorität.

Parallel betreute Flächen bleiben unberührt: `A0_BUILDER_LOG.html`, `A0_CROWN_SHADOW_CONTACT_BENCH.*`, Contact-Bench-Receipt, A0-Lineage-Binder und Source-Graph-Index.

## Review-Snapshot

- Startseite, OPIUM, Game of Worlds, Werkbank, Typed Crosswalk und Crown/Shadow Contact Bench wurden im lokalen Browser sichtbar geladen.
- Der direkte Einstieg `A0_ORIENTATION_CONTROLLER_BENCH.html#coupledWindowHub` konnte einen schwarzen, inhaltlich aber vorhandenen Viewport zeigen. Ursache war ein veralteter Scroll-Offset während mehrerer später Layoutverschiebungen. Der Einstieg wird nun nach den Layoutwellen absolut neu positioniert; direkte visuelle Wiederholung: sichtbar.
- Der Coupled-Window-Hub steht nun vor dem großen generierten Katalog und Schaltbild. Im Fenster trennt eine sichtbare Route zwei Aktionen: `SOURCE ZEIGEN` führt bewusst zum Modul; `SCHLIESSEN` kehrt zur vorherigen Lesestelle und zum auslösenden Knopf zurück. Öffnen und beide Return-Informationen wurden im Browser geprüft.
- Die bestehenden Runtime-, Human-Journey-, ARKADE-, ONE-PULSE-, Game-of-Worlds-, OCB-, Orientation-, Toy-Store- und OPIUM-Prüfungen sind grün.
- Drei Restpunkte sind echte Polishing-Aufgaben: neue Top-Level-Seiten vollständig in den Reader einordnen, den semantisch veralteten Current-Reading-Test angleichen und den Toy-Store-Overflow bei mittlerer Breite beseitigen.
- Der Coverage-Link-Audit meldet einen GLB-Link mit `&amp;`; die Zieldatei existiert lokal. Audit und HTML-Dekodierung müssen hier dieselbe URL-Normalisierung verwenden.

## P0 · Kein schwarzes oder unerklärtes Fenster

1. Bench-Deep-Links auf direktem Seitenaufruf sichtbar halten.
2. Für GLB, Canvas und eingebettete Instrumente immer mindestens Status, erklärenden Fallback und direkten Quellenlink zeigen.
3. Ladefehler dürfen kein leeres dunkles Rechteck hinterlassen.

Abnahme:

- Direktaufruf von `#coupledWindowHub` zeigt Überschrift und Fensterkarten.
- Fehlerfall zeigt Text und Alternativlink.
- Desktop, mittlere Breite und Telefonbreite bleiben bedienbar.

## P1 · Lesefluss und Navigation

1. Die neuen Top-Level-Seiten `A0_7_11_TYPED_CROSSWALK.html` und `A0_CROWN_SHADOW_CONTACT_BENCH.html` in der gemeinsamen Reader-Abdeckung berücksichtigen; Umsetzung mit dem zuständigen parallelen Faden abstimmen.
2. Current-Reading-Test auf die aktuelle Pause-Semantik statt auf die alte Wortfolge `Bench-Bau pausiert` ausrichten.
3. Horizontalen Body-Overflow im Builder Toy Store bei etwa 804 px beheben, sobald dessen laufende Bearbeitung abgeschlossen ist.
4. Jeder Hauptweg braucht einen sichtbaren Return: Start → Perspektive → Inhalt → Desk/Start.

## P2 · Abschlussrunde

Diese direkten Lesewege einmal ohne interne Kenntnis durchlaufen:

- A0 Start → Human → ARKADE/Club → zurück
- A0 Start → Science → Science Desk → Instrument → zurück
- A0 Start → Builder/Werkbank → Toy Store/MACHINA → zurück
- A0 Start → Werkbank → Coupled Windows → Fenster schließen → zurück

## Prüfmatrix

```sh
node a0-bench-polish-tests.cjs
node a0-reader-navigation-tests.cjs
node a0-current-reading-tests.cjs
node a0-compact-navigation-runtime-tests.cjs
node a0-human-flagship-journey-tests.cjs
node a0-game-of-worlds-play-tests.cjs
node a0-opium-entry-tests.cjs
node a0-coverage-link-audit.mjs
```

Zusätzlich visuell bei 1440 px, etwa 820 px und 390 px prüfen:

- `index.html`
- `A0_ORIENTATION_CONTROLLER_BENCH.html#coupledWindowHub`
- `A0_OPIUM.html#entrance`
- `A0_GAME_OF_WORLDS_PLAY.html?world=domains#domains`
- `A0_BUILDER_TOY_STORE.html`
- `A0_WERKBANK.html`

## Done

- Kein primärer Einstieg bleibt schwarz oder leer.
- Kein unerklärter GLB-/Canvas-/Embed-Ausfall.
- Kein horizontaler Body-Overflow an den drei Prüfbreiten.
- Alle Top-Level-Seiten sind erreichbar und besitzen einen verständlichen Rückweg.
- Prüfmatrix grün; verbleibende bewusste Grenzen stehen sichtbar im UI oder im Testbericht.

