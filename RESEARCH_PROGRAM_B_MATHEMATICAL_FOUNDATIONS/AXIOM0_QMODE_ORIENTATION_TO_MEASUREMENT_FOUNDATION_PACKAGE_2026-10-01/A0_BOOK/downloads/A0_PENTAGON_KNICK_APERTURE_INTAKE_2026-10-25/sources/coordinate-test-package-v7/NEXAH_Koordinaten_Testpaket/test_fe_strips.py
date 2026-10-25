from pathlib import Path
from decimal import Decimal,localcontext
import json,collections
OUT=Path(__file__).resolve().parent
def fib(n):
    a,b=0,1
    for _ in range(n):a,b=b,a+b
    return a
def termstrip(name,fn):
    text='';owners=[];terms=[];n=0
    while len(text)<97:
        s=str(fn(n));start=len(text)+1;text+=s;owners.extend([n]*len(s));terms.append({'n':n,'value':s,'start':start,'end':len(text)})
        n+=1
    return {'label':name,'kind':'term-concatenation','digits97':text[:97],'term_owner':owners[:97],'terms':terms,'last_term_truncated':len(text)>97,'first_term_index':0,'last_term_index':n-1}
def geometry_values(prec):
    with localcontext() as c:
        c.prec=prec
        vals={'pentagon_a':((5+Decimal(5).sqrt())/2).sqrt(),'root7_height_b':((11-Decimal(5).sqrt())/2).sqrt()}
        assert abs(vals['pentagon_a']**2+vals['root7_height_b']**2-8)<Decimal(10)**(-prec+3)
        return {k:{'integer':int(v),'digits97':(format(v,'f').partition('.')[2]+'0'*97)[:97]} for k,v in vals.items()}
a=geometry_values(160);assert a==geometry_values(220)
strips={'fibonacci':termstrip('Fibonacci F₀,F₁,…',fib),'euler_polynomial':termstrip('Euler E(n)=n²+n+41',lambda n:n*n+n+41)}
for k,v in a.items():strips[k]={**v,'label':'a = 1,902113…' if k=='pentagon_a' else 'b = 2,093314…','kind':'fractional-decimal'}
def rows_for(v):
    d=v['digits97'];rows=[]
    for i in range(96):
        aa,bb=map(int,d[i:i+2]);r=(bb-aa)%11;sg=r if r<=5 else r-11
        row={'position':i+1,'pair':d[i:i+2],'residue':r,'signed':sg,'seam':False}
        if 'term_owner' in v:
            row.update({'left_term':v['term_owner'][i],'right_term':v['term_owner'][i+1],'seam':v['term_owner'][i]!=v['term_owner'][i+1]})
        rows.append(row)
    return rows
def recover(seed,rows):
    digit=seed;s=str(seed)
    for row in rows:
        digit=(digit+row['residue'])%11
        if digit==10:return None
        s+=str(digit)
    return s
for k,v in strips.items():
    v['rows']=rows_for(v)
    v['summary']={'pairs':96,'seam_pairs':sum(x['seam'] for x in v['rows']),'repeat_within':sum(x['pair'][0]==x['pair'][1] and not x['seam'] for x in v['rows']),'repeat_at_seam':sum(x['pair'][0]==x['pair'][1] and x['seam'] for x in v['rows'])}
old=json.load(open(OUT/'NEXAH_Konstanten_11er_Map.json'))['constants']
recovery={}
for name,v in {**old,**strips}.items():
    rows=v['rows'];original=v['digits97'];rebuilt=recover(int(original[0]),rows);assert rebuilt==original
    candidates=[(seed,recover(seed,rows)) for seed in range(10)];candidates=[(seed,s) for seed,s in candidates if s is not None]
    recovery[name]={'with_first_digit':'PASS','valid_seed_count_without_first_digit':len(candidates),'valid_seeds':[seed for seed,s in candidates],'all_candidate_strings_constant':all(len(set(s))==1 for _,s in candidates)}
result={'rules':{'window':'97 characters, 96 overlapping pairs; leading zeros retained','Fibonacci':'F0=0, F1=1; full decimal terms concatenated in order; boundaries retained','Euler':'E(n)=n*n+n+41, starting n=0; full decimal terms concatenated in order; boundaries retained','geometry_a':'sqrt((5+sqrt5)/2)','geometry_b':'sqrt((11-sqrt5)/2)','encoding':'r=(b-a) mod11, signed representative -5..+5','recovery':'next_digit=(current_digit+r) mod11; reject digit10; ordered residues and first digit recover all digits; term boundaries require separate metadata'},'strips':strips,'recovery_all_12_strips':recovery,'geometry_identity':'a²+b²=8; this exact identity is independent of decimal encoding','scope':'No significance test or new primality claim. Digit position does not imply equal term index across the two concatenated sequences.'}
(OUT/'NEXAH_FE_Geometrie_Streifen.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
lines=['NEXAH Fibonacci Euler und Geometrie-Streifen','Stand 25. Oktober 2026','']
for name,v in strips.items():
    lines+=[v['label'],v.get('kind',''),v['digits97'],json.dumps(v['summary'],ensure_ascii=False),'Erste 8 Paare: '+', '.join(x['pair']+(' [NAHT]' if x['seam'] else '') for x in v['rows'][:8]),'']
lines+=['Rückgewinnung: Alle zwölf Streifen mit Startziffer exakt rekonstruiert. Ohne Startziffer bleibt im jeweiligen 97-Ziffernfenster außer der Kontrolle sqrt4 genau eine zulässige Startziffer; bei sqrt4 sind es zehn.','Allgemeiner bekannter Grund: Modulare Differenzen lassen sich bei bekannter Reihenfolge integrieren. Diese Rekonstruktion folgt aus der Codierung, nicht aus einer besonderen Eigenschaft irrationaler Zahlen.','Die Termgrenzen von F/E werden durch die Restfolge nicht gespeichert und müssen zusätzlich erhalten bleiben.','Die geometrischen Vergleichszahlen erfüllen a²+b²=8 exakt. Lokale Dezimalmuster sind davon getrennt.']
(OUT/'NEXAH_FE_Geometrie_Streifen_Testnotiz.txt').write_text('\n'.join(lines)+'\n')
print(json.dumps({'summary':{k:{**v['summary'],'first8':v['rows'][:8],'last_term':v.get('last_term_index'),'last_truncated':v.get('last_term_truncated')} for k,v in strips.items()},'recovery':recovery},ensure_ascii=False))
