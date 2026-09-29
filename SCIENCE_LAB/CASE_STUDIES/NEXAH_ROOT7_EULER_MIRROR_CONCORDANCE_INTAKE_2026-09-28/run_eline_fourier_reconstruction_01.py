#!/usr/bin/env python3
import hashlib,json,math,sys
from pathlib import Path
import numpy as np
from PIL import Image

HERE=Path(__file__).resolve().parent
PREREG=HERE/'40_ELINE_FOURIER_RECONSTRUCTION_01_PREREGISTRATION.md'
LOCK=HERE/'ELINE_FOURIER_RECONSTRUCTION_01_PREREGISTRATION_LOCK.json'
OUT=HERE/'eline_fourier_reconstruction_01_results.json'
ELINE=Path('/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/masters/9/98D2FDAA-3E30-4FD4-B704-6C9335A5F349_4_5005_c.jpeg')
SOURCES={
 'descartes_result':(HERE/'descartes_6_power_substitution_01_results.json','5246683edd7301c3e9136a5963f0a7e166f36c73ea551a80ff320372f8fa9b60'),
 'fourier_visual':(Path('/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/6/64A03D4F-E1B0-4036-8D71-9EEAA774D883_1_105_c.jpeg'),'ea895bb471c434b73d4ae8a28bf97e80803f4d549d4384aec682a66ca9ca06ad'),
 'eline_visual':(ELINE,'553e606a47aeb0e242c25046f145d5df6dbc7c85e71c710bb38c1b6541b969b3')
}
def sha256(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def trace_curve(gray):
 x0,x1,y0,y1=40,708,45,342
 pix=gray[y0:y1+1,x0:x1+1].astype(float)/255.0
 cost=np.where(pix<0.35,pix*0.1,2.0+pix)
 H,X=cost.shape
 dp=np.full((H,X),np.inf);back=np.zeros((H,X),dtype=np.int16)
 dp[:,0]=50.0;dp[212-y0,0]=cost[212-y0,0]
 for xi in range(1,X):
  for y in range(H):
   lo=max(0,y-4);hi=min(H,y+5)
   candidates=dp[lo:hi,xi-1]+0.08*np.abs(np.arange(lo,hi)-y)
   j=int(np.argmin(candidates));dp[y,xi]=candidates[j]+cost[y,xi];back[y,xi]=lo+j
 ys=np.zeros(X,dtype=int);ys[-1]=142-y0
 for xi in range(X-1,0,-1):ys[xi-1]=back[ys[xi],xi]
 return ys+y0
def run():
 hashes={}
 for k,(p,e) in SOURCES.items():
  a=sha256(p);hashes[k]={'expected':e,'actual':a,'pass':a==e}
 im=Image.open(ELINE).convert('L');gray=np.array(im)
 ys=trace_curve(gray);xs=[40,107,174,240,307,374,441,508,574,641,708]
 sample_y=[int(ys[x-40]) for x in xs]
 expected_y=[212,103,55,82,164,260,327,334,286,209,142]
 mid=(max(sample_y)+min(sample_y))/2.0;amp=(max(sample_y)-min(sample_y))/2.0
 s=np.array([(mid-y)/amp for y in sample_y],dtype=float);N=len(s)
 F=np.fft.fft(s);recon=np.fft.ifft(F).real
 time_energy=float(np.sum(np.abs(s)**2));freq_energy=float(np.sum(np.abs(F)**2)/N)
 keep1=np.zeros_like(F);keep1[0]=F[0];keep1[1]=F[1];keep1[-1]=F[-1]
 recon1=np.fft.ifft(keep1).real
 frac1=float(np.sum(np.abs(keep1)**2)/np.sum(np.abs(F)**2))
 rmse1=float(np.sqrt(np.mean((s-recon1)**2)))
 keep2=keep1.copy();keep2[2]=F[2];keep2[-2]=F[-2]
 frac2=float(np.sum(np.abs(keep2)**2)/np.sum(np.abs(F)**2))
 symmetry=max(abs(F[k]-np.conj(F[-k])) for k in range(1,(N+1)//2))
 checks={
  'frozen_hashes_match':all(v['pass'] for v in hashes.values()),
  'source_dimensions_and_trace_exact':im.size==(748,360) and sample_y==expected_y,
  'normalization_spans_minus_one_to_plus_one':float(s.min())==-1.0 and float(s.max())==1.0,
  'full_dft_roundtrip_exact':float(np.max(np.abs(s-recon)))<=1e-12,
  'parseval_exact':abs(time_energy-freq_energy)/time_energy<=1e-12,
  'conjugate_symmetry_exact':float(symmetry)<=1e-12,
  'first_harmonic_energy_in_frozen_band':0.82<=frac1<=0.85,
  'one_harmonic_dominant_but_not_exact':0.25<=rmse1<=0.30,
  'two_harmonics_exceed_94_percent_energy':frac2>0.94,
  'finite_representation_claim_only':True
 }
 classification='PASS_ELINE_FOURIER_RECONSTRUCTION__FINITE_VIEW_EQUIVALENCE' if all(checks.values()) else 'FAIL_ELINE_FOURIER_RECONSTRUCTION'
 result={
  'test_id':'ELINE_FOURIER_RECONSTRUCTION_01','classification':classification,
  'preregistration_sha256':sha256(PREREG),'lock_sha256':sha256(LOCK),'frozen_source_hashes':hashes,
  'runtime':{'python':sys.version.split()[0],'numpy':np.__version__,'pillow':Image.__version__},
  'checks':checks,'checks_passed':sum(checks.values()),'checks_total':len(checks),
  'trace':{'source_size':list(im.size),'sample_x':xs,'sample_y':sample_y,'normalized_samples':[round(float(v),15) for v in s]},
  'fourier':{'coefficients':[{'k':k,'real':round(float(z.real),15),'imag':round(float(z.imag),15)} for k,z in enumerate(F)],'max_roundtrip_error':float(np.max(np.abs(s-recon))),'parseval_relative_error':abs(time_energy-freq_energy)/time_energy,'conjugate_symmetry_max_error':float(symmetry),'first_harmonic_energy_fraction':frac1,'first_harmonic_rmse':rmse1,'through_second_harmonic_energy_fraction':frac2},
  'claim_boundary':'Lossless finite Fourier coordinates for eleven source-bound samples; no unique continuous curve, causal dynamics or physical spectrum.'
 }
 OUT.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
 print(json.dumps({'classification':classification,'checks':f"{result['checks_passed']}/{result['checks_total']}",'sample_y':sample_y,'first_harmonic_energy_fraction':frac1,'first_harmonic_rmse':rmse1,'output':str(OUT)},indent=2))
run()
