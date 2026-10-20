#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, itertools, json
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def step(x,left,right,coupled=True):
    a,b,q=x; a=(a+1)%5; b=(b+1)%6
    event=int(left[a]==right[b])
    return (a,b,q^(event if coupled else 0)),event

def orbit(x,left,right,coupled=True,n=60):
    states=[x]; events=[]
    for _ in range(n):
        x,e=step(x,left,right,coupled); states.append(x); events.append(e)
    return states,events

def first_period(x,left,right,coupled=True,limit=120):
    y=x
    for t in range(1,limit+1):
        y,_=step(y,left,right,coupled)
        if y==x:return t
    return None

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--mode',required=True); ap.add_argument('--output',required=True); a=ap.parse_args()
    p=json.loads((ROOT/'FROZEN_PROTOCOL.json').read_text()); L=p['left_ports']; R=p['right_ports']; S=p['shuffled_right_ports']
    states=list(itertools.product(range(5),range(6),range(2)))
    equivariant=0
    for f in itertools.product(range(6),repeat=5):
        if all(f[(k+1)%5]==(f[k]+1)%6 for k in range(5)):equivariant+=1
    periods=[first_period(x,L,R,True) for x in states]; unperiods=[first_period(x,L,R,False) for x in states]
    event_counts=[sum(orbit(x,L,R,True,60)[1]) for x in states]
    carrier30=[]; full30=[]
    for x in states:
        st,_=orbit(x,L,R,True,30); carrier30.append(st[-1][:2]==x[:2]); full30.append(st[-1]==x)
    kick_checks=[]
    for x in states:
        base,_=orbit(x,L,R,True,7); kicked=((base[-1][0]+1)%5,base[-1][1],base[-1][2])
        bs,_=orbit(base[-1],L,R,True,60); ks,_=orbit(kicked,L,R,True,60)
        kick_checks.append({'seed':x,'detected':kicked!=base[-1],'recovered':any(bs[t]==ks[t] for t in range(61)),'kicked_period':first_period(kicked,L,R,True)})
    natural_event_states={(x[0],x[1]) for x in states for y,e in [step(x,L,R,True)] if e}
    shuffled_periods=[first_period(x,L,S,True) for x in states]
    shuffled_event_states={(x[0],x[1]) for x in states for y,e in [step(x,L,S,True)] if e}
    gates={
      'G1_TYPED_PORT_INTEGRITY':len(set(L))==5 and len(set(R))==6 and len(set(L)&set(R))==1,
      'G2_DIRECT_MAP_OBSTRUCTION':equivariant==0,
      'G3_COUPLED_RETURN_60':set(periods)=={60} and all(carrier30) and not any(full30),
      'G4_UNCOUPLED_RETURN_30':set(unperiods)=={30},
      'G5_EVENT_ACCOUNTING':set(event_counts)=={2},
      'G6_PHASE_KICK_MEMORY':all(c['detected'] and not c['recovered'] and c['kicked_period']==60 for c in kick_checks),
      'G7_SHUFFLED_PORT_NONSELECTION':set(shuffled_periods)=={60} and natural_event_states!=shuffled_event_states
    }
    decision=p['expected_decision'] if all(gates.values()) else 'PARTIAL'
    result={'study_id':p['study_id'],'decision':decision,'gates':gates,'state_count':len(states),'equivariant_direct_maps':equivariant,
      'coupled_period_histogram':{str(v):periods.count(v) for v in sorted(set(periods))},
      'uncoupled_period_histogram':{str(v):unperiods.count(v) for v in sorted(set(unperiods))},
      'events_per_60_histogram':{str(v):event_counts.count(v) for v in sorted(set(event_counts))},
      'natural_event_states':sorted(natural_event_states),'shuffled_event_states':sorted(shuffled_event_states),
      'kick_summary':{'cases':len(kick_checks),'detected':sum(c['detected'] for c in kick_checks),'recovered':sum(c['recovered'] for c in kick_checks),'period60':sum(c['kicked_period']==60 for c in kick_checks)},
      'boundaries':['C5_NOT_C6','PORT_PERIOD_NOT_CANONICAL_PORT_SELECTION','FINITE_AUTOMATON_NOT_PHYSICAL_FLOW','NO_MONAD_OR_OCO_MECHANISM']}
    result['registered_result_sha256']=hashlib.sha256(json.dumps(result,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    Path(a.output).write_text(json.dumps(result,indent=2,sort_keys=True)+'\n'); print(f"{a.mode}: {decision}; gates {sum(gates.values())}/{len(gates)}")
if __name__=='__main__':main()
