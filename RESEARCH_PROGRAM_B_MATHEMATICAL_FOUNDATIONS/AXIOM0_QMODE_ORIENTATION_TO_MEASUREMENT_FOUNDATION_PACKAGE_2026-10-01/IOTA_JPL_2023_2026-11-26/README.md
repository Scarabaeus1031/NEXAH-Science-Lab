# IOTA/JPL · Prüfbelege für das Jahresfenster 2023

Dieses Paket gehört zum [IOTA/JPL-Draft](../A0_BOOK/A0_DRAFT_DRIFT_HOUSING_112_NOTE_2026-11-23.md). Es dokumentiert die dort beschriebenen Vergleiche des Primzahlrasters mit dem gleichmäßigen Raster und den Versätzen +12, +24 und +36 Stunden. Der Stand bleibt ein begrenzter Draft-Befund.

| Beleg | Inhalt |
| --- | --- |
| [Prüfprotokoll](protocol.json) und [Ergebnisse je Startpaar](result.json) | Auswahl des Jahresfensters, Raster, Trefferregel und Vergleich der zwölf Startpaare in der Ausgangsphase |
| [Quellabrufe](sources.json) | JPL Horizons API-Abfragen und SHA-256 der entpackten Antworten für [Io](horizons-501.txt.gz), [Europa](horizons-502.txt.gz) und [Ganymed](horizons-503.txt.gz) |
| [Phasenprotokoll](phase-sweep/protocol.json), [Phasenergebnisse](phase-sweep/phases.csv) und [Zusammenfassung](phase-sweep/summary.json) | 730 verschiedene gemeinsame Phasen, davon 113 Siege gegen beide Kontrollen und 36 mit zusätzlich erfüllter Ausgangsregel |
| [SLog herunterladen (CSV, gzip)](phase-sweep/slog.csv.gz) | 332.880 Zeilen mit Referenzzeit in TDB, Wechselrichtung, Abtastintervallen und Trefferstatus |
| [SHA-256](SHA256SUMS) | Prüfsummen der archivierten Dateien, bei gzip-Dateien über die komprimierten Bytes |

Für das Beispiel **+137 h** die SLog-Zeilen nach `phase_h=137` und `grid=prime` filtern. Die im Draft besprochenen Startpaare 4, 1 und 8 stehen unter `base_h=2555`, `365` und `5475`. `first_hour_after` identifiziert den Referenzwechsel. Die vier Spalten mit der Endung `_captured` geben den Trefferstatus je Versatz an.

## Offline nachrechnen

Die Skripte verwenden die Python-Standardbibliothek. Die folgenden Befehle aus diesem Ordner ausführen. Die Berechnung läuft in einer temporären Kopie und lässt die archivierten Dateien im Checkout bestehen. Der Vergleich prüft bei der SLog-Datei den entpackten CSV-Inhalt, damit die Kompression von der installierten Bibliothek abhängen darf.

```sh
shasum -a 256 -c SHA256SUMS
evidence_dir=$(pwd)
replay_dir=$(mktemp -d)
cp -R . "$replay_dir/"
python3 -B "$replay_dir/evaluate.py" ../A0_BOOK/assets/a0-jupiter-horizons-2025.js
python3 -B "$replay_dir/phase-sweep/sweep.py"
cmp "$evidence_dir/result.json" "$replay_dir/result.json"
cmp "$evidence_dir/phase-sweep/phases.csv" "$replay_dir/phase-sweep/phases.csv"
cmp "$evidence_dir/phase-sweep/summary.json" "$replay_dir/phase-sweep/summary.json"
gzip -dc "$evidence_dir/phase-sweep/slog.csv.gz" > "$replay_dir/slog-expected.csv"
gzip -dc "$replay_dir/phase-sweep/slog.csv.gz" > "$replay_dir/slog-replayed.csv"
cmp "$replay_dir/slog-expected.csv" "$replay_dir/slog-replayed.csv"
```

Die [2025-Reihe](../A0_BOOK/assets/a0-jupiter-horizons-2025.js) dient im ersten Skript als Referenz für den bereits bekannten Baseline-Vergleich. Der hier archivierte vollständige Phasen-SLog gehört zum Fenster 2023.
