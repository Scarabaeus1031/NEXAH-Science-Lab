# Prüfpunkt 15 — 528/537, Horizonmirror und die behauptete SCN-Auswahlregel

**Stand:** 28. September 2026. **Status:** vollständiger Test der im Feedback formulierten Restklassenregel; keine Lösung für die fehlende SCN→404-Reglerabbildung.

## 1. Drei verschiedene Operatoren

- Dezimalumkehr einer dreistelligen Zahl erhält den Rest modulo 11 **immer**: `rev_3(N) ≡ N (mod 11)`. Deshalb gelten `528 ↔ 825` mit Rest `0` und `537 ↔ 735` mit Rest `9`; die zweite Paarung ist kein Sonderfall.
- Additiver Restklassen-Spiegel ist `H(r)=−r mod 11`: `H(9)=2`, `H(5)=6`, `H(0)=0`. Dieser Spiegel ist **nicht** die dreistellige Ziffernumkehr.
- Multiplikation mit 3 ist ein dritter Operator: `3·9 ≡ 5 (mod 11)`. Die saubere verkettete Operation ist `H(3·9)=H(5)=6`, also `H∘(×3)(9)=6`. Hingegen `3·H(9)=3·2=6`: hier fallen beide Verkettungen ebenfalls zusammen, weil H und die Multiplikation auf Restklassen kommutieren. Der Zwischenschritt `H(9)=2` gefolgt von **3·9=5** benutzt 9 erneut; er ist als solche Folge keine einzelne Transformationskette.

## 2. Die vorgeschlagene Auswahlformel vollständig ausgewertet

Das Feedback fordert sinngemäß `H(n_k mod 11)=(101·2^j) mod 11`, ohne `j` in Abhängigkeit von `k` festzulegen. Die dyadischen Kanäle für `j=0,…,9` haben die Reste

`2,4,8,5,10,9,7,3,6,1`.

Sie enthalten **jede von null verschiedene Restklasse genau einmal**. Für jeden SCN-Schritt mit `n_k mod 11 != 0` lässt sich deshalb nachträglich ein passendes `j` wählen. Der Nullrest hat keinen passenden Kanal. Die Formel wählt mit freiem Exponenten **10 der 11 Schritte**, nicht besonders k=2 und k=6.

| k | SCN-Zahl | Rest | Horizonmirror | passender dyadischer Exponent j |
|---:|---:|---:|---:|---:|
| 0 | 7801 | 2 | 9 | 5 |
| 1 | 7809 | 10 | 1 | 9 |
| 2 | 7817 | 7 | 4 | 1 (`202`) |
| 3 | 7825 | 4 | 7 | 6 |
| 4 | 7833 | 1 | 10 | 4 |
| 5 | 7841 | 9 | 2 | 0 |
| 6 | 7849 | 6 | 5 | 3 (`808`) |
| 7 | 7857 | 3 | 8 | 2 (`404`) |
| 8 | 7865 | 0 | 0 | keiner |
| 9 | 7873 | 8 | 3 | 7 |
| 10 | 7881 | 5 | 6 | 8 |

Eine mögliche *zusätzliche, bisher nicht belegte* Festlegung wäre `j=floor(k/2)`. Sie träfe in den ersten elf Schritten bei Start 7801 tatsächlich nur k=2 und k=6. Start 8000 liefert aber bei **unveränderter Regel** nur k=8 im ersten Zyklus. Dies zeigt die Abhängigkeit von der vorher zu begründenden Zeit- und Ursprungskalibrierung; es beweist keinen Switch.

## 3. Was am 537-Bogen tatsächlich bemerkenswert ist

Die Bogenweite `537−528=9` ist auch der Rest der 537. Auf **jeder** +8-Spur modulo 11 ist die Nachfolgerestklasse von `r=9` genau `9+8≡6`. Daneben gilt `H(3·9)=−27≡6`. Der Rest 9 ist sogar die **einzige** Lösung von `r+8≡−3r (mod 11)`, denn `4r≡3` ergibt `r≡9`.

Auf Start 7801 liegt Rest 9 bei k=5 (7841) unmittelbar vor Rest 6 bei k=6 (7849). Bei Start 8000 liegt Rest 9 bei k=9 (8072) vor Rest 6 bei k=10 (8080). Die **Adjazenz 9→6 ist startunabhängig**. Der Faktor 3 und der Bogen 528→537 sind bislang jedoch aus dem gewählten Beispiel entnommen, nicht aus einer unabhängig dokumentierten SCN- oder 404-Regel vorhergesagt.

## Prüfentscheidung

Korrekt sind die Rechnungen und die eindeutige lokale Kongruenz `r=9`. Nicht gezeigt ist, dass der 528/537-Bogen einen wirklichen Kanal schaltet. Die vorgeschlagene Auswahlformel ist mit frei wählbarem Exponenten nicht selektiv und enthält keine Abbildung auf die Regler `(a,b)` des bestehenden 404-Codes. Eine prüfbare nächste Fassung muss `j(k)` vorab festlegen und aus einer unabhängigen Quelle Winkel/Phasenwerte samt Nullpunkt auf `(a,b)` abbilden; danach sind Treffer **und** Nichttreffer auf neuen Spuren zu kontrollieren.

## Reproduktion

```python
S=7801
channels=[(101*2**j)%11 for j in range(10)]
assert sorted(channels)==list(range(1,11))
assert 528%11==825%11==0 and 537%11==735%11==9
assert (537-528)%11==9 and (-3*9)%11==(9+8)%11==6
assert [r for r in range(11) if (r+8)%11==(-3*r)%11]==[9]
rows=[(k,(S+8*k)%11) for k in range(11)]
assert [k for k,r in rows if (-r)%11 in channels]==[0,1,2,3,4,5,6,7,9,10]
for start, expected in ((7801,[2,6]),(8000,[8])):
    assert [k for k in range(11) if (-(start+8*k))%11==(101*2**(k//2))%11]==expected
```
