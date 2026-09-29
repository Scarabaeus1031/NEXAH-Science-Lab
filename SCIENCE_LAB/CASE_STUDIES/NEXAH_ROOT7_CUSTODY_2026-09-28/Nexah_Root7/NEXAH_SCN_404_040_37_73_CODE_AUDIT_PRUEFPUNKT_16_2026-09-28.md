# Prüfpunkt 16 — 404/040, 37/73 und Audit der „System-Simulation“

**Stand:** 28. September 2026. **Gegenstand:** Die vom Nutzer eingereichten zwei längeren Python-Varianten und der kurze SCN-Test sowie die begleitenden Behauptungen. Die Rechenbefunde sind unabhängig nachgerechnet. „Gate“ und „Closure“ sind Modellbezeichnungen, solange keine unabhängige Zustands-/Reglerregel definiert ist.

## 1. Die Zeichenoperation 404 ↔ 040

`404 mod 11=8`, `040` als Dezimalschreibweise von 40 hat Rest `7`; die Summe `8+7≡4 (mod 11)` ist korrekt. Der eigentliche arithmetische Zusammenhang ist `404+40=444` und `444−202=242=22·11`, also `404+40≡202 (mod 11)`.

**Wichtig:** Die übliche Ziffernumkehr ist `rev_3(404)=404` und `rev_3(040)=040` (bei festgehaltener führender Null). **404→040 ist keine Ziffernumkehr.** Man kann es als eigenen dreistelligen Operator, etwa Zifferntausch `4↔0`, definieren. Der bisherige Horizonmirror `H(r)=−r mod 11` tut hier ebenfalls etwas anderes: `H(8)=3`, nicht 7. Die drei Operationen müssen im Modell getrennt bleiben.

## 2. Was an 37 ↔ 73 besonders ist

Die 37 ist die 12. Primzahl, die 73 die 21. Primzahl. Beide Zahlen und ihre einbasierten Primzahlpositionen stehen jeweils in Ziffernumkehr. Unter den zweistelligen Umkehrpaaren mit **beiden Primzahlen** `(13,31), (17,71), (37,73), (79,97)` ist `(37,73)` das einzige mit zusätzlich umgekehrten zweistelligen Primzahlpositionen. Das ist eine korrekte, eingegrenzte Besonderheit.

Die Nullsumme `37+73=110≡0 (mod 11)` ist dagegen **für jedes umgekehrte zweistellige Ziffernpaar** zwangsläufig: `(10a+b)+(10b+a)=11(a+b)`. `13+31=44` oder `79+97=176` liefern dieselbe Eigenschaft. Die angebliche 404-Kopplung `110·3,6727…=404` definiert den Faktor bloß rückwärts als `404/110=202/55`; eine unabhängige Herleitung fehlt. Der in der früheren Projektion geprüfte Rest `444²−25·7865=511=7·73` ist exakt, begründet aber keinen 404-Schaltvorgang.

## 3. Was die Skripte tatsächlich prüfen

- Der kurze Code wählt vorab ausschließlich `k in [2,6]` und ordnet ihnen bereits `202` beziehungsweise `808` zu. `MATCH: True` prüft dann die zuvor ausgewählten Restgleichheiten; alle anderen Schritte und Fehlalarme bleiben ungetestet.
- Die „integrale“ Variante wählt ebenso vorab `[2,6,8]`; die sogenannte Validierung von 971 als 164. Primzahl besteht aus einer **fest eingetragenen Zahl**, keiner Berechnung des Primzahlindex. Ihr `success` prüft nur die Ziffernsumme `1+6+4`, den arithmetischen Rest `971` und meldet eine Systemschließung, ohne die SCN-Matches oder das vorhandene 404-Labyrinth einzubeziehen.
- Die zuletzt eingereichte „finale“ Variante ist **in der sichtbaren Form kein lauffähiges Python**: Sie enthält `for k in:` ohne Iterationsausdruck sowie HTML-Escapes/Backslashes. Ihre Erfolgsbedingung beruht ausschließlich auf `(404+40)%11==4`, dem hart vorgegebenen Indexpaar `12,21` und `(37+73)%11==0`. Sie verwendet weder `start_val` noch `step` in der Erfolgsbedingung.

Gegenprobe: Bei Start 7801 ergeben sich für `k=2,6,8` die Reste `7,6,0` und gespiegelten Reste `4,5,0`. Bei dem ebenfalls ungeraden Start **8001** ergeben sich `9,8,2` und gespiegelte Reste `2,3,9` – keine der drei beanspruchten Treffergleichheiten. Die drei Konstanten in der Erfolgsbedingung bleiben unverändert und würden weiterhin `KONSISTENT UND GESCHLOSSEN` drucken. Die Ausgabe ist deshalb **keine prädiktive Validierung**.

## Reproduzierbare Gegenprobe

```python
from math import isqrt

primes=[n for n in range(2,1000) if all(n%d for d in range(2,isqrt(n)+1))]
reverse_prime_pairs=[]
for p in primes:
    if not 10<=p<=99: continue
    q=int(str(p)[::-1])
    if q not in primes or p>=q: continue
    reverse_prime_pairs.append((p,q,primes.index(p)+1,primes.index(q)+1))
assert reverse_prime_pairs==[(13,31,6,11),(17,71,7,20),(37,73,12,21),(79,97,22,25)]
assert [(p,q) for p,q,i,j in reverse_prime_pairs
        if len(str(i))==len(str(j))==2 and str(i)==str(j)[::-1]]==[(37,73)]
assert str(404)[::-1]=='404' and '040'[::-1]=='040'
assert 404+40==444 and (444-202)%11==0
assert 404%11==8 and 40%11==7 and (-404)%11==3
assert 37+73==110 and 13+31==44 and 79+97==176
assert 444**2-25*(7801+8*8)==7*73
def mirrors(start):
    return [(-(start+8*k))%11 for k in (2,6,8)]
assert mirrors(7801)==[4,5,0]
assert mirrors(8001)==[2,3,9]
assert ((404%11+40%11)%11==4 and str(12)==str(21)[::-1]
        and (37+73)%11==0) # bleibt bei verschobenem Start True
```

## Entscheidung und nächster Schritt

**Behalten:** Die genaue doppelte Ziffernumkehr 37↔73 und 12↔21 als beschrifteten Zahlentheorie-Befund; die weiteren Gleichungen als nachvollziehbare Identitäten. **Nicht als bestätigt markieren:** HH Mirror Loop als Ziffernumkehr oder die behauptete SCN→404-„Vollendung“. Ein weiterer erfolgreicher Test verlangt eine vorher festgelegte Operation für 404→040, Kanalziele für **alle** `k`, und die aus einer unabhängigen Quelle kalibrierte Abbildung auf beide alten Gate-Regler `(a,b)`. Erst dann die komplette Treffer-/Fehlalarmtabelle auf unabhängigen Starts auswerten.
