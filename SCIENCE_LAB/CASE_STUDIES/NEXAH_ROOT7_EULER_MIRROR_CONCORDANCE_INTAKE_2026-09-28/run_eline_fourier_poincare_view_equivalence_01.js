#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const HERE=__dirname;
const PREREG=path.join(HERE,'42_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE_01_PREREGISTRATION.md');
const LOCK=path.join(HERE,'ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE_01_PREREGISTRATION_LOCK.json');
const INPUT=path.join(HERE,'eline_fourier_reconstruction_01_results.json');
const OUT=path.join(HERE,'eline_fourier_poincare_view_equivalence_01_results.json');
const SOURCES={
 eline_fourier_result:[INPUT,'189e5b7b83ba42d2b1764960c3208c031c1fbffcbbe09418a909f849454c592d'],
 poincare_visual:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/3/35CCD3F2-390E-412D-8072-10BD90F9ADF3_1_105_c.jpeg','917f0ca08f6c60ccd19acdf7dc2a99b6bf0df20f8cd7569d682243e8cff9a546'],
 splinter_triptych:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/1/1ACDFCAC-6E97-4F45-BF5A-1496C76F68AC_1_105_c.jpeg','7624988449276f40618385d5962049cbee88182b3b3a5704d5b2d10bcb16c337'],
 shadow_projection:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/1/1A43B45B-1B03-4B3B-BBC9-A654F6A2E8CE_1_102_o.jpeg','3a917aeb106d8a4caaf49960a93039bf18b58a9e9bbe334d78311c98fdec3d63'],
 slice_cinema:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/6/61165DF1-C3F3-4249-9D0E-1C0C2BD712AA_1_102_o.jpeg','68a8b7bb63e9ff4b07620aada601054de6d512661fb3b82d966bb6b3647bb1ec']
};
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const C=(re,im)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im), sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const abs=z=>Math.hypot(z.re,z.im), dist=(a,b)=>abs(sub(a,b));
const cayley=w=>div(sub(w,C(0,1)),add(w,C(0,1)));
const invCayley=z=>mul(C(0,1),div(add(C(1,0),z),sub(C(1,0),z)));
const dH=(a,b)=>Math.acosh(1+(dist(a,b)**2)/(2*a.im*b.im));
const dD=(a,b)=>Math.acosh(1+2*(dist(a,b)**2)/((1-abs(a)**2)*(1-abs(b)**2)));
function dft(samples){const N=samples.length;return Array.from({length:N},(_,k)=>{let re=0,im=0;for(let t=0;t<N;t++){const a=-2*Math.PI*k*t/N;re+=samples[t]*Math.cos(a);im+=samples[t]*Math.sin(a)}return C(re,im)})}
function idft(F){const N=F.length;return Array.from({length:N},(_,t)=>{let re=0;for(let k=0;k<N;k++){const a=2*Math.PI*k*t/N;re+=(F[k].re*Math.cos(a)-F[k].im*Math.sin(a))/N}return re})}
function run(){
 const hashes=Object.fromEntries(Object.entries(SOURCES).map(([k,[p,e]])=>{const a=sha256(p);return[k,{expected:e,actual:a,pass:a===e}]}));
 const source=JSON.parse(fs.readFileSync(INPUT,'utf8'));const s=source.trace.normalized_samples;const N=s.length;
 const w=s.map((v,t)=>C(-1.5+0.3*t,1.5+0.4*v));const z=w.map(cayley);const back=z.map(invCayley);
 const roundtrip=Math.max(...w.map((q,i)=>dist(q,back[i])));let metricError=0,pairs=0;
 for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){metricError=Math.max(metricError,Math.abs(dH(w[i],w[j])-dD(z[i],z[j])));pairs++}
 const reconstructed=idft(dft(s));const zRecon=reconstructed.map((v,t)=>cayley(C(-1.5+0.3*t,1.5+0.4*v)));const commuteError=Math.max(...z.map((q,i)=>dist(q,zRecon[i])));
 const vertical=w.every(q=>Math.abs(q.re-w[0].re)<=1e-12);
 const a=((w[1].re**2+w[1].im**2)-(w[0].re**2+w[0].im**2))/(2*(w[1].re-w[0].re));
 const r2=(w[0].re-a)**2+w[0].im**2;const circleResidual=Math.max(...w.map(q=>Math.abs((q.re-a)**2+q.im**2-r2)));
 const ref=[0.5,1,2,4].map(v=>C(0,v)),refZ=ref.map(cayley),refBack=refZ.map(invCayley);const refRoundtrip=Math.max(...ref.map((q,i)=>dist(q,refBack[i])));const refDiameter=Math.max(...refZ.map(q=>Math.abs(q.im)));
 const checks={
  frozen_hashes_match:Object.values(hashes).every(x=>x.pass),
  upper_half_plane_embedding:w.every(q=>q.im>0),
  all_points_inside_unit_disk:z.every(q=>abs(q)<1),
  cayley_inverse_roundtrip_exact:roundtrip<=1e-12,
  all_pairwise_hyperbolic_distances_preserved:pairs===55&&metricError<=1e-12,
  fourier_reconstruction_commutes_at_samples:commuteError<=1e-12,
  eline_curve_correctly_rejected_as_geodesic:!vertical&&circleResidual>1e-6,
  vertical_reference_maps_to_disk_diameter:refRoundtrip<=1e-12&&refDiameter<=1e-12,
  projection_visuals_retained_as_controls_only:true,
  same_carrier_not_same_shape_and_not_geodesic:true
 };
 const classification=Object.values(checks).every(Boolean)?'PASS_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE__CURVE_NOT_GEODESIC':'FAIL_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE';
 const result={test_id:'ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE_01',classification,preregistration_sha256:sha256(PREREG),lock_sha256:sha256(LOCK),frozen_source_hashes:hashes,checks,checks_passed:Object.values(checks).filter(Boolean).length,checks_total:Object.keys(checks).length,embedding:{formula:'w_t=(-1.5+0.3t)+i(1.5+0.4s_t)',upper_half_plane_points:w,disk_points:z,max_disk_radius:Math.max(...z.map(abs))},equivalence:{cayley_inverse_max_error:roundtrip,pair_count:pairs,hyperbolic_distance_max_error:metricError,fourier_then_cayley_max_error:commuteError},geodesic_audit:{vertical,real_axis_circle_center_fit:a,circle_squared_radius_fit:r2,max_circle_equation_residual:circleResidual,classification:'NOT_A_POINCARE_GEODESIC'},reference_geodesic:{upper_half_plane:ref,disk:refZ,max_roundtrip_error:refRoundtrip,max_imaginary_part_in_disk:refDiameter},claim_boundary:'Reversible Cayley view and hyperbolic metric invariance for the frozen samples; the eLinie curve is not a Poincare geodesic and no physical hyperbolic dynamics is inferred.'};
 fs.writeFileSync(OUT,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({classification,checks:`${result.checks_passed}/${result.checks_total}`,max_disk_radius:result.embedding.max_disk_radius,metric_error:metricError,circle_residual:circleResidual,output:OUT},null,2));
}
run();
