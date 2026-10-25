NEXAH Sechserstreifen und A9 — Erweiterungsprüfung vom 25. Oktober 2026

NEXAH_Teiler_Streifen_Desk.html lokal im Browser öffnen.
Abschnitt 3 enthält die neuen Sechserkoordinaten, Blockrotation, mittlere Paarspiegelung,
Rückweg, getrennte Skalierung durch sqrt7 und den Mathfield-Return.

Tests (Node.js bzw. Python, ohne Zusatzpakete):
  node test_six_seams.cjs
  node test_desk.cjs
  python3 test_a9_candidate.py

Hauptergebnisse:
- 30 Ziffernumordnungen, 32 Schnittmuster, 960 vollständige Kettenprüfungen.
- Vorhandene A0-Operatoren: neun Repunit-Gates, 100 S45-Paarspiegelungen, sechs S3-Blockanordnungen.
- Die 111x111-Adress-/Returnformeln wurden für alle 12321 Adressen reproduziert.
- Die Projektion der Paar-Koordinaten auf G111 mit erhaltenem z-Residual bestand 30 Rückwege.
- Die Beispielkette 111213 -> 121311 -> 123111 kombiniert eine Blockrotation mit einer zusätzlichen Paarspiegelung.
- 11*(11^2+12^2+13^2)=4774 ist eine exakte arithmetische Identität der gewählten Paarcodierung.
- A9-Kandidat: projizierte elf Hüllenecken werden als neue ebene Basis benutzt.
  Die Spitzenhöhen +/-0.65 sind gewählt; V=13, E=33, F=22. Kein historischer A9-Mesh wurde rekonstruiert.
- A3*3 und G6/DE7/E8/F9 bleiben ohne vollständige Operatorbindung.

Das Controller-JavaScript ist der unveränderte öffentliche Quellschnappschuss.
mathfield-current.html dokumentiert die gelesene Quelle; es ist kein lokal vollständiger Website-Klon.
Browserabnahme offen: Bedienprüfungen verwenden simulierte DOM-Elemente.
