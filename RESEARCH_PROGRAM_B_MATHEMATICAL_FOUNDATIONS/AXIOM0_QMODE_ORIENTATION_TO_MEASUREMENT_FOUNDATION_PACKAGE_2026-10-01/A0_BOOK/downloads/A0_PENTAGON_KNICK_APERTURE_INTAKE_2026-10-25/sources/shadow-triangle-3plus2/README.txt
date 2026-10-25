NEXAH Shadow Triangle 3+2 · 25.10.2026
Neue geometrische Kopplungsvariante auf Wunsch des Autors; keine Wiedergewinnung einer metrisch bestimmten A0 Originalfläche.
Pink: fünf animierte Kronenlaschen. Cyan: feste Laternenreferenz und drei Aufwärtseingänge U1 bis U3. Orange: zwei Abwärtseingänge D1 und D2. Dunkel: neues festes Shadow Triangle.
Die drei Aufwärtspunkte sind symmetrisch zur Mitte. Die zwei Abwärtspunkte liegen symmetrisch auf der x Achse. Alle fünf Punkte liegen strikt im Dreieck. Damit ist das Moment beider Gruppen um den Dreiecksschwerpunkt null.
Bei gleichen Kräften 1 pro Eingang ist die Nettokraft +1 nach oben. Bei Stärke 1 der drei und 1,5 der zwei ist sie null. Kräfte sind relative Einheiten; keine Kalibrierung in Newton. Weitere Lasten und Reaktionen sind nicht berücksichtigt.
Das Dreieck bleibt bewusst fest. Keine Kraftübertragung aus der Krone behauptet. Eine künftige bewegliche Version braucht Lager, Zwangsbedingungen und einen definierten Antrieb. Gleichgewicht allein bedeutet keine Stabilität.
Animation der Krone: 8 Sekunden offen zu Spitzenkontakt und zurück, Kontaktwinkel 151,830500786 Grad. GLB Y up, 1 u entspricht .1 m. Pfeile sind geometrische Eingangssymbole und zeigen keine simulierten Materialdrücke.
Reproduktion: Python 3 mit numpy scipy matplotlib. Beide Python Skripte sowie models.json und native_contact_results.json im Ordner analysis/koerper_due_diligence belassen; build_shadow_triangle.py ausführen.
Prüfungen: Kontaktpunkte im Dreieck; Kraft und Moment; ursprüngliche starre Laschenkinematik; GLB Header und Puffergrenzen. Kein unabhängiger glTF Validator, kein visueller GLB Viewer und keine vollständige Kollisionsprüfung.
