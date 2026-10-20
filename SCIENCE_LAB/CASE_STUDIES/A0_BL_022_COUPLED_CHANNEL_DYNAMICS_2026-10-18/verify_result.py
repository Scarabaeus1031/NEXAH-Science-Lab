#!/usr/bin/env python3
import argparse,json
from pathlib import Path
def main():
    ap=argparse.ArgumentParser();ap.add_argument('result');a=ap.parse_args();x=json.loads(Path(a.result).read_text())
    c=[x['decision']=='EXACT_PERIODIC_CHANNEL_WITH_PERTURBATION_MEMORY_AND_NONCANONICAL_PORTS',all(x['gates'].values()),len(x['gates'])==7,x['state_count']==60,x['equivariant_direct_maps']==0,x['coupled_period_histogram']=={'60':60},x['uncoupled_period_histogram']=={'30':60},x['events_per_60_histogram']=={'2':60},x['kick_summary']=={'cases':60,'detected':60,'period60':60,'recovered':0},x['natural_event_states']!=x['shuffled_event_states'],'FINITE_AUTOMATON_NOT_PHYSICAL_FLOW' in x['boundaries']]
    n=sum(c);print(f'verifier: {n}/{len(c)} PASS' if n==len(c) else f'verifier: {n}/{len(c)} FAIL');return 0 if n==len(c) else 1
if __name__=='__main__':raise SystemExit(main())
