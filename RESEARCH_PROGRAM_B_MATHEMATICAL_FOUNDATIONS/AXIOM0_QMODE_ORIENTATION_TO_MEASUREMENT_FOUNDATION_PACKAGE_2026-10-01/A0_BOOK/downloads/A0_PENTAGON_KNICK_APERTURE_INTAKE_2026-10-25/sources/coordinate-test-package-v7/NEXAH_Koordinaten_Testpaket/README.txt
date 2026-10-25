NEXAH Koordinaten und Verbindungstests — 25. Oktober 2026

1. NEXAH_Pentagon_Knick_Lab.html lokal im Browser öffnen.
   Neue Bedienung: zwölf Folgen einschließlich Fibonacci, Euler und Geometriezahlen; Paarposition wählen; RGB-Schritte ablaufen. Termnähte und zusätzliche Teileradressen werden angezeigt.
   Checkbox „Spitze im Verhältnis √7 : 2 : √11 führen“ aktiviert die geometrische Referenz.
   Einzelne T-Presets lösen diese Bindung wieder. JSON enthält Sequenzquelle und Referenzzustand.

2. Geometrie- und Bedientests (Node.js, keine Zusatzpakete):
   node run_all_tests.cjs
   node test_new_controls.cjs
   node test_regression.cjs
   node test_divisor_adapter.cjs
   python3 test_fe_strips.py

3. Hashimoto- und Zufallskontrolle (Python mit NumPy):
   python3 test_nonbacktracking.py
   python3 test_sequence_null.py

Die Node-Bedientests verwenden einen simulierten DOM. Eine vollständige Browserabnahme ist offen.
run_all_tests.cjs schreibt die Geometrieergebnisse neu; test_nonbacktracking.py ergänzt danach die Matrixprüfung.
Die Python-Zufallskontrolle ist explorativ und war nicht vorregistriert.

Die Dateien a0-*.js sind unveränderte öffentliche Quellschnappschüsse und werden für den Abgleich mitgeliefert.
Die Ansichts-/Phasenabbildung ist ein neuer Vergleichsadapter, keine native A0-Dynamik.
Die ausgewählte Graph-Unterteilung benutzt 23 Knoten / 33 Kanten und schließt acht weitere native Kanten aus.
Ihre Ihara-Dynamik ist nicht identisch mit dem vollständigen nativen Teilgraphen.
Keine Änderungen an öffentlicher Website, Repository oder Mission Control vorgenommen.
A9 sowie genaue Coil-/Alpha-/Kappa-Bindung bleiben quellenbezogen offen.
