(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") === "en" ? "en" : "de";
  document.documentElement.lang = language;

  const main = document.querySelector("main");
  const humanView = document.getElementById("human-view");

  if (window.parent !== window) {
    // The public iframe projection enters through the experience. The local A0
    // owner page preserves source order: inventory and staging come first.
    if (main && humanView && main.firstElementChild !== humanView) main.prepend(humanView);
    document.documentElement.dataset.nexahedronProjection = "public-human-view";
    document.querySelectorAll("body > header, .mc-status, .a0-human-overview, body > footer").forEach((element) => {
      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
      element.style.setProperty("display", "none", "important");
    });
  }

  if (language !== "en") return;

  const translations = new Map([
    ["Inside", "Inside"],
    ["Story", "Story"],
    ["Questions", "Questions"],
    ["Journey", "Journey"],
    ["Inventory", "Inventory"],
    ["Public", "Public"],
    ["Return", "Return"],
    ["Schau", "Look"],
    ["noch einmal.", "again."],
    ["Eine Welt kann gleich bleiben –", "A world can remain the same —"],
    ["und doch völlig anders aussehen.", "and still look completely different."],
    ["Dreh einen Körper. Verändere den Blick.\nFolge einem Puls durch mehrere Welten.", "Turn a body. Change the view.\nFollow one pulse through several worlds."],
    ["Dreh einen Körper. Verändere den Blick.", "Turn a body. Change the view."],
    ["Folge einem Puls durch mehrere Welten.", "Follow one pulse through several worlds."],
    ["Was verändert sich,\nwenn du anders hinschaust?", "What changes\nwhen you look differently?"],
    ["Was verändert sich,", "What changes"],
    ["wenn du anders hinschaust?", "when you look differently?"],
    ["GEFÜHRT BEGINNEN", "START THE GUIDED PATH"],
    ["ODER: PLAY THE QUESTIONS", "OR: PLAY THE QUESTIONS"],
    ["Kein Vorwissen. Erst berühren, dann verstehen.", "No prior knowledge. Touch first, then understand."],
    ["Eine Ansicht braucht einen Beobachter. Ein Beobachter hat einen Körper. Ein Körper ist bereits in einem Feld. Bevor wir vergleichen, erklären wir deshalb Position, Grenze, Apertur und Frage.", "A view needs an observer. An observer has a body. A body is already inside a field. Before we compare, we therefore declare position, boundary, aperture and question."],
    ["Links hält eine Eiform einen situierten menschlichen Körper. Eine leuchtende Bruchfuge öffnet eine Apertur. Eine Spur führt zu einer Chicken-Darstellung rechts.", "On the left, an egg form holds a situated human body. A luminous crack opens an aperture. A trace leads to a chicken representation on the right."],
    ["Das Ei ist kein Gegenstand vor dir. Es ist zunächst die Welt, die den Körper hält. Orientierung beginnt, indem der Beobachter seine eigene Position im Feld erklärt.", "The egg is not an object in front of you. At first it is the world that holds the body. Orientation begins when the observer declares their own position in the field."],
    ["Adresse, Abstammung und die erklärte Beziehung zwischen A und A′.", "Address, lineage and the declared relation between A and A′."],
    ["Die ungebrochene Schale und der frühere Innen-/Außenvertrag.", "The unbroken shell and the former inside/outside contract."],
    ["Crack, Apertur, Exposition und die gewählte Darstellung der Passage.", "Crack, aperture, exposure and the chosen representation of the passage."],
    ["Erleben, genaue Zukunft und alles, was der gesetzte Frame nicht entscheiden kann.", "Experience, the exact future and everything the chosen frame cannot decide."],
    ["Vorheriger Human-View-Schritt", "Previous Human View step"],
    ["Nächster Human-View-Schritt", "Next Human View step"],
    ["Code-native Human-View-Darstellung von Ei, Grenze, Crack und Chicken", "Code-native Human View representation of egg, boundary, crack and chicken"],
    ["The Missing Condition Schritte", "The Missing Condition steps"],
    ["Sechs Stationen der Human Story", "Six stations of the Human Story"],
    ["Erst den situierten Menschen lokalisieren. Dann Observation, Difference, Time After Time und den Living Blueprint öffnen.", "First locate the situated human. Then open Observation, Difference, Time After Time and the Living Blueprint."],
    ["Sieben Human Questions ↓", "Seven Human Questions ↓"],
    ["Zu den Field Notes →", "Open the Field Notes →"],
    ["Ei, Chicken, Hedge, Hinge und LIT sind eine deklarierte Übergangsmetapher. Die Darstellung behauptet keine neue Biologie, Physik, Bewusstseinstheorie oder natürliche Q°–R°–T°-Gesetzmäßigkeit. Δgraph=0.", "Egg, chicken, hedge, hinge and LIT are a declared transition metaphor. This view claims no new biology, physics, theory of consciousness or natural Q°–R°–T° law. Δgraph=0."],
    ["Ei, Chicken, Hedge, Hinge und", "Egg, chicken, hedge, hinge and"],
    ["sind eine deklarierte Übergangsmetapher. Die Darstellung behauptet keine neue Biologie, Physik, Bewusstseinstheorie oder natürliche Q°–R°–T°-Gesetzmäßigkeit.", "are a declared transition metaphor. This view claims no new biology, physics, theory of consciousness or natural Q°–R°–T° law."],
    ["Ohne JavaScript bleibt der vollständige Receipt lesbar.", "Without JavaScript the complete receipt remains readable."],
    ["Weiter zu den Field Notes →", "Continue to the Field Notes →"],
    ["Das Huhn oder das Ei? Die Frage hat ohne Frame keine einzige Antwort. Das Ei kommt zuerst, wenn wir Entwicklung lesen. Das Chicken kommt zuerst, wenn wir Abstammung rückwärts erklären. NEXAH beginnt deshalb nicht mit einem Ding, sondern mit der deklarierten Relation.", "The chicken or the egg? Without a frame, the question has no single answer. The egg comes first when we read development. The chicken comes first when we trace ancestry backwards. NEXAH therefore begins not with a thing, but with the declared relation."],
    ["Das Huhn oder das Ei?", "The chicken or the egg?"],
    ["Die Frage hat ohne Frame keine einzige Antwort. Das Ei kommt zuerst, wenn wir Entwicklung lesen. Das Chicken kommt zuerst, wenn wir Abstammung rückwärts erklären. NEXAH beginnt deshalb nicht mit einem Ding, sondern mit der deklarierten Relation.", "Without a frame, the question has no single answer. The egg comes first when we read development. The chicken comes first when we trace ancestry backwards. NEXAH therefore begins not with a thing, but with the declared relation."],
    ["A und A′ sind zwei lesbare Zustände einer gehaltenen Geschichte. „Zuerst“ wird erst durch Cut, Richtung und Zweck bestimmbar.", "A and A′ are two legible states of one held story. ‘First’ becomes decidable only through cut, direction and purpose."],
    ["Die Hedge hält Potential. Die Hinge öffnet eine lokale Passage. Der Crack verändert den Grenzvertrag.", "The hedge holds potential. The hinge opens a local passage. The crack changes the boundary contract."],
    ["Der Vogel ist hier eine menschlich lesbare Orientierungsfigur: Körper, Feld, Richtung und erinnerte Spur – keine Behauptung über einen neuen biologischen Mechanismus.", "Here the bird is a human-readable figure of orientation: body, field, direction and remembered trace — not a claim about a new biological mechanism."],
    ["Licht wird zur Human View, sobald eine Bedingung unterscheidbar wird: Quelle, Material, Winkel, Körper oder Apertur.", "Light becomes a Human View as soon as a condition becomes distinguishable: source, material, angle, body or aperture."],
    ["Gold ist keine zusätzliche Spektralfarbe. Es markiert den erhaltenen Faden: Aufmerksamkeit, Relation und das, was nach dem Cut noch adressierbar bleibt.", "Gold is not an additional spectral colour. It marks the retained thread: attention, relation and what remains addressable after the cut."],
    ["Nach Licht und Passage folgt die Wahl: konsumieren, erinnern oder zurückkehren. Die Jukebox hält eine Spur, ohne das lebendige Ereignis mit seinem Record zu verwechseln.", "After light and passage comes a choice: consume, remember or return. The jukebox holds a trace without confusing the living event with its record."],
    ["LILO kann als leiser Human-Merksatz bleiben: Look In · Look Out. Nicht als neue Formel, sondern als Atembewegung zwischen Innen- und Außenansicht.", "LILO can remain a quiet human mnemonic: Look In · Look Out. Not as a new formula, but as a breathing movement between inside and outside views."],
    ["kann als leiser Human-Merksatz bleiben:", "can remain a quiet human mnemonic:"],
    ["Nicht als neue Formel, sondern als Atembewegung zwischen Innen- und Außenansicht.", "Not as a new formula, but as a breathing movement between inside and outside views."],
    ["Die sieben Fragen öffnen ↓", "Open the seven questions ↓"],
    ["Chicken, Egg, Bird, Rainbow, Gold, Stream und Jukebox sind Orientierungsbilder. Sie begründen keine Numerologie, Naturkonstante, Vogel-Navigationstheorie oder universelle Entwicklungsfolge.", "Chicken, egg, bird, rainbow, gold, stream and jukebox are orientation images. They establish no numerology, natural constant, theory of avian navigation or universal developmental sequence."],
    ["Den kuratierten Human-Weg ansehen", "See the curated Human path"],
    ["Erst erleben.\nDann unterscheiden.", "Experience first.\nThen distinguish."],
    ["Erst erleben.", "Experience first."],
    ["Dann unterscheiden.", "Then distinguish."],
    ["NEXAH zeigt nicht einfach ein weiteres Ding. Es macht lesbar, wie sich ein Bild verändert, wenn Bedingung, Blick oder Beziehung wechseln — und was dabei trotzdem dasselbe bleibt.", "NEXAH does not simply show another thing. It makes legible how an image changes when condition, view or relation changes — and what nevertheless remains the same."],
    ["DIE WELT BLEIBT.", "THE WORLD REMAINS."],
    ["Beginne bei einem vorhandenen Raum, Körper oder Takt. Noch keine Erklärung — erst wahrnehmen, was da ist.", "Begin with an existing room, body or rhythm. No explanation yet — first notice what is there."],
    ["DIE APERTUR WECHSELT.", "THE APERTURE CHANGES."],
    ["Verändere eine Bedingung: Licht, Blick, Maßstab, Nachbarschaft oder Weg. Die Ansicht antwortet.", "Change one condition: light, view, scale, neighbourhood or path. The view responds."],
    ["DER UNTERSCHIED WIRD LESBAR.", "THE DIFFERENCE BECOMES LEGIBLE."],
    ["Der Return trennt wieder Welt, Ansicht und Relation. So wird Veränderung vergleichbar, ohne alles gleichzusetzen.", "The return separates world, view and relation again. Change becomes comparable without equating everything."],
    ["Ein Lesepfad vor den Türen.", "A reading path before the doors."],
    ["Zuerst Dark Room, dann Look Again, dann Return. Spiele, Library und weitere Welten erscheinen erst danach als freiwillige Fortsetzungen.", "First Dark Room, then Look Again, then Return. Games, Library and further worlds appear only afterwards as optional continuations."],
    ["Lesepfad überspringen · zum Return ↓", "Skip the reading path · go to Return ↓"],
    ["Erst sehen, dann orientieren: drei vorhandene Maschinenkörper lassen sich im eigenen Viewer betreten und drehen. Sie bleiben drei getrennte Quellen; der Raum behauptet keine gemeinsame Physik.", "See first, then orient: three existing machine bodies can be entered and turned in their own viewer. They remain three separate sources; the room claims no shared physics."],
    ["Die Diamond Lens hält den White-Dodeca-Carrier fest und wechselt nur die deklarierte Ansicht: Yellow, Emerald Shadow, Rainbow Spectrum, Root/Shell oder Evil Twin. Daneben macht LOOK AGAIN fünf einzelne Display-Änderungen vergleichbar. Beides ist Erfahrung — kein Score, keine Diagnose.", "The Diamond Lens holds the White Dodeca carrier fixed and changes only the declared view: Yellow, Emerald Shadow, Rainbow Spectrum, Root/Shell or Evil Twin. Alongside it, LOOK AGAIN makes five individual display changes comparable. Both are experiences — not a score or diagnosis."],
    ["Fünf Ansichten laufen als kurze Tour. Erst sehen; Werkzeuge bleiben im Hintergrund.", "Five views run as a short tour. See first; tools remain in the background."],
    ["Fünf kurze Vorher-/Nachher-Runden. Du veränderst eine Ansicht und kehrst danach genau hierher zurück.", "Five short before/after rounds. You change one view and then return to this exact place."],
    ["Unterschiedliche Menschen können unterschiedliche Figuren bemerken. Hier gibt es keine richtige Antwort, keine Norm und keine Aussage über Sehfähigkeit. Bei visueller Belastung: sofort stoppen.", "Different people may notice different figures. There is no correct answer, norm or statement about visual ability here. If you experience visual strain, stop immediately."],
    ["WAS HAST DU VERÄNDERT — UND WAS BLIEB?", "WHAT DID YOU CHANGE — AND WHAT REMAINED?"],
    ["WEITER ZU DEN FREIEN TÜREN ↓", "CONTINUE TO THE OPEN DOORS ↓"],
    ["Animierte Apertur zwischen Regenbogen, Körperzelle und kosmischem Feld", "Animated aperture between rainbow, body cell and cosmic field"],
    ["Nicht alles, was vorhanden ist, ist für uns bereits sichtbar. Verändere die Lichtquelle, bewege deine Hand und beobachte, wie Material, Farbe und Schatten antworten.", "Not everything that exists is already visible to us. Change the light source, move your hand and observe how material, colour and shadow respond."],
    ["Keine Symbollehre und kein Test deines Wissens. Eine kleine Tour durch etwas Alltägliches: Sichtbarkeit entsteht nicht aus einem Ding allein. Quelle, Material, Weg und Blick wirken zusammen.", "No symbolic doctrine and no test of your knowledge. A short tour through something ordinary: visibility does not arise from a thing alone. Source, material, path and view work together."],
    ["Du siehst fast nichts.", "You see almost nothing."],
    ["Der Raum ist nicht verschwunden. Aber ohne Licht, das von seinen Oberflächen zu dir gelangt, entsteht kein sichtbares Bild.", "The room has not disappeared. But without light travelling from its surfaces to you, no visible image arises."],
    ["NICHT SICHTBAR ≠ NICHT VORHANDEN", "NOT VISIBLE ≠ NOT PRESENT"],
    ["BLACKLIGHT EINSCHALTEN →", "SWITCH ON BLACKLIGHT →"],
    ["Etwas antwortet.", "Something responds."],
    ["Ultraviolettes Licht liegt außerhalb des sichtbaren Bereichs. Bestimmte Materialien nehmen es auf und geben einen Teil als sichtbares Licht zurück: Fluoreszenz.", "Ultraviolet light lies outside the visible range. Certain materials absorb it and return part of it as visible light: fluorescence."],
    ["QUELLE × MATERIAL → SICHTBARE ANTWORT", "SOURCE × MATERIAL → VISIBLE RESPONSE"],
    ["DIE HAND INS LICHT HALTEN →", "PLACE YOUR HAND IN THE LIGHT →"],
    ["Du gehörst jetzt zum Bild.", "You are now part of the image."],
    ["Deine Hand unterbricht einen gerichteten Lichtweg. Der Schatten ist kein schwarzes Ding; er markiert einen Bereich, den weniger Licht erreicht.", "Your hand interrupts a directed light path. A shadow is not a black thing; it marks an area reached by less light."],
    ["KÖRPER × RICHTUNG → AUSLASSUNG", "BODY × DIRECTION → OMISSION"],
    ["FARBLICHTER ÖFFNEN →", "OPEN COLOURED LIGHTS →"],
    ["Farben teilen einen Raum.", "Colours share a room."],
    ["Rotes, grünes und blaues Licht können sich addieren. Wo ihre Wege überlagern, entstehen neue sichtbare Mischungen. Pigmente würden sich anders verhalten.", "Red, green and blue light can add together. Where their paths overlap, new visible mixtures appear. Pigments would behave differently."],
    ["LICHTMISCHUNG ≠ PIGMENTMISCHUNG", "LIGHT MIXING ≠ PIGMENT MIXING"],
    ["WEISSES LICHT AUFFÄCHERN →", "FAN OUT WHITE LIGHT →"],
    ["Ein Licht. Viele Wege.", "One light. Many paths."],
    ["Ein Prisma oder Regentropfen lenkt unterschiedliche Wellenlängen verschieden stark. Das Spektrum macht Unterschiede sichtbar, die im weißen Licht gemeinsam ankamen.", "A prism or raindrop deflects different wavelengths by different amounts. The spectrum makes visible differences that arrived together in white light."],
    ["EINE QUELLE → UNTERSCHEIDBARE FARBWEGE", "ONE SOURCE → DISTINGUISHABLE COLOUR PATHS"],
    ["ZUM RAUM ZURÜCKKEHREN →", "RETURN TO THE ROOM →"],
    ["Du siehst jetzt Bedingungen.", "You now see conditions."],
    ["Der Raum war nie nur Kulisse. Was sichtbar wurde, hing von Lichtquelle, Material, Weg und deiner Position ab. Verändere eine Bedingung – und lies das Bild noch einmal.", "The room was never merely a backdrop. What became visible depended on light source, material, path and your position. Change one condition — and read the image again."],
    ["SEHEN IST EINE BEZIEHUNG", "SEEING IS A RELATION"],
    ["WÄHLE, WIE DU MIT LICHT WEITERGEHST ↓", "CHOOSE HOW TO CONTINUE WITH LIGHT ↓"],
    ["Stationen der Rainbow Light Tour", "Stations of the Rainbow Light Tour"],
    ["Die Visualisierung ist eine anschauliche Tour. UV, Fluoreszenz, Schatten, additive Farbmischung und Dispersion bleiben unterschiedliche Vorgänge; die Tour setzt sie nicht gleich.", "This visualisation is an illustrative tour. UV, fluorescence, shadow, additive colour mixing and dispersion remain distinct processes; the tour does not equate them."],
    ["Wenn dir die kurze Rainbow-Tour reicht, gehst du direkt zu Look Again. Wenn du bei Licht bleiben möchtest, öffnest du genau eine der beiden Türen — als Bild oder als Erklärung.", "If the short Rainbow tour is enough, continue directly to Look Again. If you want to stay with light, open exactly one of the two doors — as an image or as an explanation."],
    ["Rainbow / Purple Rain führt visuell weiter: Prisma, Projektionen, Wheel und Return.", "Rainbow / Purple Rain continues visually: prism, projections, wheel and return."],
    ["Newton, Leibniz und Goethe halten Zerlegung, Relation und Erscheinung als drei verschiedene Lesarten offen.", "Newton, Leibniz and Goethe keep decomposition, relation and appearance open as three distinct readings."],
    ["Noch tiefer: Black Sun / Big Moon →", "Go deeper: Black Sun / Big Moon →"],
    ["Oder weiter zu Look Again ↓", "Or continue to Look Again ↓"],
    ["Du hast erst eine Bedingung verändert und dann bei einem Carrier die sichtbare Relation gewechselt. Jetzt wählst du genau eine Vertiefung: spielen, ein lebendes Feld betreten oder ruhig weiterlesen.", "You first changed one condition and then changed the visible relation of one carrier. Now choose exactly one continuation: play, enter a living field or read quietly."],
    ["Drei kuratierte Fortsetzungen", "Three curated continuations"],
    ["Kann ein Puls mehrere Welten tragen?", "Can one pulse carry several worlds?"],
    ["ONE PULSE macht einen gemeinsamen Takt in getrennten Welten erlebbar. Öffne nur dieses Spiel; die große technische Arcade bleibt in der Werkstatt.", "ONE PULSE makes one shared rhythm tangible in separate worlds. Open only this game; the large technical arcade remains in the workshop."],
    ["Was verändert sich innen?", "What changes inside?"],
    ["Betritt ein lebendes Feld und beobachte Nachbarschaft und Generation. Danach schließt du den Raum und setzt den Lesepfad hier fort.", "Enter a living field and observe neighbourhood and generation. Then close the room and continue the reading path here."],
    ["Was öffnet Staunen?", "What opens wonder?"],
    ["Eine menschliche Erzählung über Aufmerksamkeit, Spiel, Erinnerung und Zugehörigkeit — als ruhiger Ausstieg aus der visuellen Tour.", "A human story about attention, play, memory and belonging — as a quiet exit from the visual tour."],
    ["Warum nur drei?", "Why only three?"],
    ["NEXAHEDRON zeigt eine erzählte Auswahl. Weitere Spiele, Benches und technische Varianten bleiben im Builder auffindbar, ohne diesen Human View zu überladen.", "NEXAHEDRON presents a narrated selection. Further games, benches and technical variants remain discoverable in the Builder without overloading this Human View."],
    ["Fenster schließen und zum Lesepfad zurückkehren", "Close the window and return to the reading path"],
    ["Dieses Fenster ergänzt die Route. Schließen bringt dich an exakt dieselbe Lesestelle zurück.", "This window extends the route. Closing it returns you to the exact same place in the reading path."],
    ["Was du gesehen hast, hing nicht von einem Ding allein ab. Lichtquelle, Takt, Nachbarschaft, Erzählung, Karte und Beobachtungsposition öffneten unterschiedliche Erfahrungen. Der Return trennt Welt, Ansicht und gewählten Weg wieder, damit du bewusst weitergehen kannst.", "What you saw did not depend on one thing alone. Light source, rhythm, neighbourhood, story, map and observation position opened different experiences. The return separates world, view and chosen path again so you can continue deliberately."],
    ["Drei Körper in einem ruhigen Viewer.", "Three bodies in one quiet viewer."],
    ["Ein Carrier, eine andere sichtbare Relation.", "One carrier, another visible relation."],
    ["Sechs Stationen von Dark Room bis Return.", "Six stations from Dark Room to Return."],
    ["Drei kuratierte Fortsetzungen. Öffne nur eine.", "Three curated continuations. Open only one."],
    ["DEINE STRECKE", "YOUR PATH"],
    ["Deine Strecke durch Human View", "Your path through Human View"],
    ["Start", "Start"],
    ["Lesen", "Read"],
    ["Türen", "Doors"]
  ]);

  function translateTextNode(node) {
    const original = node.nodeValue || "";
    const trimmed = original.trim();
    if (!trimmed || !translations.has(trimmed)) return;
    node.nodeValue = original.replace(trimmed, translations.get(trimmed));
  }

  function translate(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (!(root instanceof Element) && root !== document) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    if (root instanceof Element) {
      for (const attribute of ["aria-label", "title"]) {
        const value = root.getAttribute(attribute);
        if (value && translations.has(value)) root.setAttribute(attribute, translations.get(value));
      }
    }
    root.querySelectorAll?.("[aria-label], [title]").forEach((element) => {
      for (const attribute of ["aria-label", "title"]) {
        const value = element.getAttribute(attribute);
        if (value && translations.has(value)) element.setAttribute(attribute, translations.get(value));
      }
    });
  }

  translate(document);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateTextNode(record.target);
      record.addedNodes.forEach(translate);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
