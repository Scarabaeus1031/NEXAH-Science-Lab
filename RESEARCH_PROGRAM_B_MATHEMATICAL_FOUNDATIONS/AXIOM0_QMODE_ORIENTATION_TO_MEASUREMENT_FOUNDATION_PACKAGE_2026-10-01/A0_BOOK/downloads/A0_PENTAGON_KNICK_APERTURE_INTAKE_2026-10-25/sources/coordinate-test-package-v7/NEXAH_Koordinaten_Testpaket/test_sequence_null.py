import json,numpy as np
from pathlib import Path
ROOT=Path(__file__).resolve().parent
r=json.load(open(ROOT/'NEXAH_Konstanten_11er_Map.json'))
rng=np.random.default_rng(20261025);B=5000;tests=[]
def stats(d):
    raw=(d[1:]-d[:-1])%11;signed=np.where(raw<=5,raw,raw-11)
    return np.array([np.count_nonzero(signed==0),abs(np.sign(signed).sum()),np.count_nonzero(np.abs(signed[1:])==np.abs(signed[:-1]))])
for name,v in r['constants'].items():
    if name=='sqrt4':continue
    d=np.array(list(map(int,v['digits97'])));obs=stats(d);sim=np.array([stats(rng.permutation(d)) for _ in range(B)]);center=sim.mean(axis=0)
    for j,metric in enumerate(['Schnapszahlenpaare','Betrag Vorzeichenbilanz','Gleiche Betragsrolle in benachbarten Paaren']):
        p=(1+np.count_nonzero(np.abs(sim[:,j]-center[j])>=abs(obs[j]-center[j])-1e-12))/(B+1)
        tests.append({'constant':name,'metric':metric,'observed':int(obs[j]),'shuffle_mean':float(center[j]),'p_two_sided':float(p)})
order=sorted(range(len(tests)),key=lambda i:tests[i]['p_two_sided']);running=0
for rank,i in enumerate(order):
    running=max(running,(len(tests)-rank)*tests[i]['p_two_sided']);tests[i]['holm_adjusted_p']=min(1,running)
out={'seed':20261025,'shuffles_per_constant':B,'hypotheses':len(tests),'null':'Digit-count-preserving permutations of each 97-digit prefix; overlapping pairs recomputed after each shuffle. Exploratory, selected after viewing the map; not a preregistered test and not a test of normality or independence of constants.','tests':tests,'significant_after_holm':sum(x['holm_adjusted_p']<.05 for x in tests),'minimum_adjusted_p':min(x['holm_adjusted_p'] for x in tests)}
(ROOT/'nexah-sequence-null.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='tests'},ensure_ascii=False))
