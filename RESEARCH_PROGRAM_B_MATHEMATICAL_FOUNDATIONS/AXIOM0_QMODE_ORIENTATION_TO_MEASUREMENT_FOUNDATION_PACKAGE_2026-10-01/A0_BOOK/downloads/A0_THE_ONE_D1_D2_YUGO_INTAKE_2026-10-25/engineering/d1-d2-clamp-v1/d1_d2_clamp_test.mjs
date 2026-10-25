#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(here, "../../sources/the-one-d1-d2-package-v1/analysis/koerper_due_diligence");
const model = JSON.parse(fs.readFileSync(path.join(sourceDir, "models.json"), "utf8"));
const native = JSON.parse(fs.readFileSync(path.join(sourceDir, "native_contact_results.json"), "utf8"));
const ref = model.reference;

const P = Object.freeze({
  sourceUnitMillimetres: 100,
  angleMinDeg: -34,
  angleMaxDeg: 34,
  sampleStepDeg: 0.05,
  z0: 0.19,
  triangleRadius: 0.65,
  panelThickness: 0.008,
  shaftRadius: 0.008,
  shaftEndOverhang: 0.06,
  boreRadius: 0.011,
  housingOuterRadius: 0.024,
  housingWidth: 0.05,
  housingOpeningHalfAngleDeg: 60,
  bearingX: [-0.16, 0.16],
  movingSleeveHalfLength: 0.12,
  movingSleeveOuterRadius: 0.014,
  hingeExclusionWidth: 0.02,
  fixedRail: { xHalf: 0.22, y: -0.055, yHalf: 0.018, z: 0.182, zHalf: 0.008 },
  pedestalRadius: 0.012,
  pedestalY0: -0.055,
  pedestalY1: -0.024,
  linerBoreRadius: 0.0083,
  linerOuterRadius: 0.0108,
  linerOpeningHalfAngleDeg: 68,
  thrustWasherWidth: 0.013,
  thrustWasherOuterRadius: 0.014,
  collarCenterX: 0.414,
  collarWidth: 0.018,
  collarOuterRadius: 0.014,
  fastenerRadius: 0.004,
  fastenerXOffsets: [-0.012, 0.012],
  fastenerZ0: 0.166,
  fastenerZ1: 0.196,
  pinRadius: 0.04,
  frameBarRadius: 0.014,
  numericTolerance: 1e-9,
});

const add = (a,b) => a.map((v,i)=>v+b[i]);
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const mul = (a,s) => a.map(v=>v*s);
const dot = (a,b) => a.reduce((s,v,i)=>s+v*b[i],0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm = a => Math.sqrt(dot(a,a));
const unit = a => mul(a,1/norm(a));
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const deg = r => r*180/Math.PI;
const rad = d => d*Math.PI/180;
const rotX = (p,a,origin=[0,0,P.z0]) => {
  const q=sub(p,origin), c=Math.cos(a), s=Math.sin(a);
  return add([q[0],q[1]*c-q[2]*s,q[1]*s+q[2]*c],origin);
};

function pointSegment(p,a,b){
  const d=sub(b,a), t=clamp(dot(sub(p,a),d)/dot(d,d),0,1);
  return norm(sub(p,add(a,mul(d,t))));
}

function pointTriangle(p,t){
  const [a,b,c]=t, u=sub(b,a), v=sub(c,a), n=cross(u,v), nn=dot(n,n);
  const signed=dot(sub(p,a),n)/nn, q=sub(p,mul(n,signed));
  const uu=dot(u,u), uv=dot(u,v), vv=dot(v,v), qu=dot(sub(q,a),u), qv=dot(sub(q,a),v);
  const det=uu*vv-uv*uv;
  const x=(qu*vv-qv*uv)/det, y=(qv*uu-qu*uv)/det;
  if(x>=-1e-12 && y>=-1e-12 && x+y<=1+1e-12) return Math.abs(dot(sub(p,a),n))/Math.sqrt(nn);
  return Math.min(pointSegment(p,a,b),pointSegment(p,b,c),pointSegment(p,c,a));
}

function segmentSegment(a,b,c,d){
  const u=sub(b,a), v=sub(d,c), w=sub(a,c);
  const aa=dot(u,u), bb=dot(u,v), cc=dot(v,v), dd=dot(u,w), ee=dot(v,w), det=aa*cc-bb*bb;
  const values=[pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b)];
  if(det>1e-20){
    const s=(bb*ee-cc*dd)/det, t=(aa*ee-bb*dd)/det;
    if(s>=0&&s<=1&&t>=0&&t<=1) values.push(norm(sub(add(w,mul(u,s)),mul(v,t))));
  }
  return Math.min(...values);
}

function segmentTriangle(a,b,t){
  const n=cross(sub(t[1],t[0]),sub(t[2],t[0])), den=dot(sub(b,a),n);
  if(Math.abs(den)>1e-14){
    const u=dot(sub(t[0],a),n)/den;
    if(u>=0&&u<=1&&pointTriangle(add(a,mul(sub(b,a),u)),t)<1e-10) return 0;
  }
  return Math.min(pointTriangle(a,t),pointTriangle(b,t),...t.map((_,i)=>segmentSegment(a,b,t[i],t[(i+1)%3])));
}

function triangleTriangle(a,b){
  const values=[];
  for(let i=0;i<3;i++) values.push(segmentTriangle(a[i],a[(i+1)%3],b),segmentTriangle(b[i],b[(i+1)%3],a));
  return Math.min(...values);
}

const half=P.triangleRadius/Math.sqrt(3);
const left=[-half,0,P.z0], right=[half,0,P.z0], tip=[0,P.triangleRadius,P.z0];
const upper=[left,right,tip];
const lower=[left,[-Math.sqrt(3)*P.triangleRadius/2,-P.triangleRadius/2,P.z0],[Math.sqrt(3)*P.triangleRadius/2,-P.triangleRadius/2,P.z0],right];
const fixedTriangles=[[lower[0],lower[1],lower[2]],[lower[0],lower[2],lower[3]]];
const trimY=P.hingeExclusionWidth, trimHalf=half*(1-trimY/P.triangleRadius);
const trimmedUpper=[[-trimHalf,trimY,P.z0],[trimHalf,trimY,P.z0],tip];
const folded = aDeg => upper.map(p=>rotX(p,rad(aDeg)));
const foldedTrimmed = aDeg => trimmedUpper.map(p=>rotX(p,rad(aDeg)));

const A=ref.A, B=ref.B, M=ref.M;
const bars=[];
for(let i=0;i<5;i++){
  for(const [name,v,w] of [["A",A[i],A[(i+1)%5]],["B",B[i],B[(i+1)%5]],["M",M[i],M[(i+1)%5]],["lower",A[i],M[i]],["upper",M[i],B[i]]]) bars.push({name:`${name}${i}`,a:v,b:w});
}
const pin=[0,0,ref.h/2];
const roof=native.pentagonExtension;
const flapFold=rad(roof.contactFoldDegrees)/2;
const crownFaces=[];
for(let i=0;i<5;i++){
  const v=B[i], w=B[(i+1)%5], center=mul(add(v,w),.5), tangent=unit(sub(w,v));
  let outward=[center[0],center[1],0]; outward=unit(outward);
  if(Math.abs(dot(tangent,outward))>1e-10) throw new Error("invalid crown hinge basis");
  crownFaces.push([v,w,add(add(center,mul(outward,roof.flapAltitude*Math.cos(flapFold))),[0,0,roof.flapAltitude*Math.sin(flapFold)])]);
}

const panelHalf=P.panelThickness/2;
const rows=[];
const steps=Math.round((P.angleMaxDeg-P.angleMinDeg)/P.sampleStepDeg);
for(let i=0;i<=steps;i++){
  const angle=P.angleMinDeg+i*P.sampleStepDeg, tri=folded(angle), trimmed=foldedTrimmed(angle);
  const frameValues=bars.map(b=>({name:b.name,value:segmentTriangle(b.a,b.b,tri)-P.frameBarRadius-panelHalf}));
  const frame=frameValues.reduce((a,b)=>a.value<b.value?a:b);
  const pinClearance=pointTriangle(pin,tri)-P.pinRadius-panelHalf;
  const crownClearance=Math.min(...crownFaces.map(q=>triangleTriangle(tri,q)-panelHalf));
  const fixedPanelClearance=Math.min(...fixedTriangles.map(q=>triangleTriangle(trimmed,q)-P.panelThickness));
  const baseMaxY=-P.housingOuterRadius;
  const plateMinY=-panelHalf*Math.abs(Math.sin(rad(angle)));
  const baseClearance=plateMinY-baseMaxY;
  const openingMarginDeg=P.housingOpeningHalfAngleDeg-(Math.abs(angle)+deg(Math.asin(panelHalf/P.boreRadius)));
  const minimum=Math.min(pinClearance,frame.value,crownClearance,fixedPanelClearance,baseClearance);
  rows.push({angleDeg:angle,pinClearance,frameClearance:frame.value,nearestFrameBar:frame.name,crownClearance,fixedPanelClearanceOutsideHingeZone:fixedPanelClearance,holderBaseClearance:baseClearance,housingOpeningAngularMarginDeg:openingMarginDeg,minimumNonHousingClearance:minimum});
}

const motionBound=2*P.triangleRadius*Math.sin(rad(P.sampleStepDeg/4));
function boundedMinimum(key){
  const item=rows.reduce((a,b)=>a[key]<b[key]?a:b);
  return {sampled:item[key],angleDeg:item.angleDeg,continuousLowerBound:item[key]-motionBound-P.numericTolerance};
}
const pathBounds={
  pin:boundedMinimum("pinClearance"),
  frame:boundedMinimum("frameClearance"),
  fixedCrown:boundedMinimum("crownClearance"),
  fixedPanelOutsideHingeZone:boundedMinimum("fixedPanelClearanceOutsideHingeZone"),
  holderBase:boundedMinimum("holderBaseClearance"),
};
const openingMargin=rows.reduce((a,b)=>a.housingOpeningAngularMarginDeg<b.housingOpeningAngularMarginDeg?a:b);

const shaft=[[-half-P.shaftEndOverhang,0,P.z0],[half+P.shaftEndOverhang,0,P.z0]];
const sleeve=[[-P.movingSleeveHalfLength,0,P.z0],[P.movingSleeveHalfLength,0,P.z0]];
const hardwareCapsules=[
  {name:"shaft",a:shaft[0],b:shaft[1],radius:P.shaftRadius,attachment:"INTENDED_HINGE_MEMBER"},
  {name:"moving sleeve envelope",a:sleeve[0],b:sleeve[1],radius:P.movingSleeveOuterRadius,attachment:"INTENDED_MOVING_SHAFT_CONTACT"},
  {name:"fixed rail",a:[-P.fixedRail.xHalf,P.fixedRail.y,P.fixedRail.z],b:[P.fixedRail.xHalf,P.fixedRail.y,P.fixedRail.z],radius:Math.hypot(P.fixedRail.yHalf,P.fixedRail.zHalf),attachment:"INTENDED_FIXED_PANEL_ATTACHMENT"},
];
const washerCenters=[-(P.movingSleeveHalfLength+P.thrustWasherWidth/2),P.movingSleeveHalfLength+P.thrustWasherWidth/2];
for(const x of washerCenters) hardwareCapsules.push({name:`POM-C thrust washer ${x<0?"D1":"D2"}`,a:[x-P.thrustWasherWidth/2,0,P.z0],b:[x+P.thrustWasherWidth/2,0,P.z0],radius:P.thrustWasherOuterRadius,attachment:"INTENDED_AXIAL_SLEEVE_CONTACT"});
for(const sign of [-1,1]){
  const x=sign*P.collarCenterX;
  hardwareCapsules.push({name:`shaft collar ${sign<0?"D1":"D2"}`,a:[x-P.collarWidth/2,0,P.z0],b:[x+P.collarWidth/2,0,P.z0],radius:P.collarOuterRadius,attachment:"SHAFT_AXIAL_RETENTION"});
}
for(const x of P.bearingX){
  hardwareCapsules.push({name:`housing ${x<0?"D1":"D2"}`,a:[x-P.housingWidth/2,0,P.z0],b:[x+P.housingWidth/2,0,P.z0],radius:P.housingOuterRadius,attachment:"C_HOUSING_CONSERVATIVE_EXTERNAL_ENVELOPE"});
  hardwareCapsules.push({name:`pedestal ${x<0?"D1":"D2"}`,a:[x,P.pedestalY0,P.z0],b:[x,P.pedestalY1,P.z0],radius:P.pedestalRadius,attachment:"INTENDED_FIXED_RAIL_ATTACHMENT"});
  for(const dx of P.fastenerXOffsets) hardwareCapsules.push({name:`M1.4 rail screw ${x<0?"D1":"D2"} ${dx<0?"A":"B"}`,a:[x+dx,P.fixedRail.y,P.fastenerZ0],b:[x+dx,P.fixedRail.y,P.fastenerZ1],radius:P.fastenerRadius,attachment:"RAIL_FASTENER"});
}

const hardwareChecks=[];
for(const part of hardwareCapsules){
  const pinGap=pointSegment(pin,part.a,part.b)-P.pinRadius-part.radius;
  const frameGaps=bars.map(bar=>({name:bar.name,gap:segmentSegment(part.a,part.b,bar.a,bar.b)-part.radius-P.frameBarRadius}));
  const frameGap=frameGaps.reduce((a,b)=>a.gap<b.gap?a:b);
  const crownGap=Math.min(...crownFaces.map(q=>segmentTriangle(part.a,part.b,q)-part.radius));
  hardwareChecks.push({part:part.name,attachmentClass:part.attachment,pinGap,frameGap:frameGap.gap,nearestFrameBar:frameGap.name,crownGap,minimumExternalGap:Math.min(pinGap,frameGap.gap,crownGap)});
}

const bearingAxialGap=Math.abs(P.bearingX[0])-P.housingWidth/2-P.movingSleeveHalfLength;
const shaftBoreRadialClearance=P.boreRadius-P.shaftRadius;
const linerShaftRadialClearance=P.linerBoreRadius-P.shaftRadius;
const totalAxialFloat=2*bearingAxialGap-2*P.thrustWasherWidth;
const linerOpeningMarginDeg=P.linerOpeningHalfAngleDeg-(P.angleMaxDeg+deg(Math.asin(panelHalf/P.linerBoreRadius)));
const retentionParts=hardwareCapsules.filter(part=>part.attachment==="SHAFT_AXIAL_RETENTION"||part.attachment==="RAIL_FASTENER");
const retentionMotionChecks=retentionParts.map(part=>{
  const values=rows.map(row=>segmentTriangle(part.a,part.b,folded(row.angleDeg))-part.radius-panelHalf);
  const sampled=Math.min(...values), index=values.indexOf(sampled);
  return {part:part.name,sampledClearance:sampled,angleDeg:rows[index].angleDeg,continuousLowerBound:sampled-motionBound-P.numericTolerance};
});

const SI={unitMetres:.1,shaftDiameterMetres:2*P.shaftRadius*.1,bearingSpanMetres:(P.bearingX[1]-P.bearingX[0])*.1,bearingWidthMetres:P.housingWidth*.1};
const design={
  serviceRadialLoadN:.5,
  proofRadialLoadN:1.5,
  serviceAxialLoadN:.1,
  proofAxialLoadN:.3,
  actuatorDesignTorqueNm:.001,
  shaftElasticModulusPa:193e9,
  shaftDeclaredMinimumYieldPa:800e6,
  linerDeclaredAllowableBearingPressurePa:8e6,
  linerDryFrictionCoefficient:.15,
  thrustDryFrictionCoefficient:.12,
  fastenerCount:4,
  fastenerNominalDiameterMm:1.4,
  fastenerAssumedPreloadN:20,
  railInterfaceFrictionCoefficient:.2,
  housingAndRailDeclaredMinimumYieldPa:240e6,
  coaxialityToleranceMm:.05,
  mountingFlatnessToleranceMm:.05,
  shaftDiameterToleranceMm:[1.59,1.61],
  linerDiameterToleranceMm:[1.66,1.68],
  sleeveLengthToleranceMm:[23.95,24.05],
  innerBearingFaceSpanToleranceMm:[26.92,27.08],
  washerWidthToleranceMm:[1.27,1.33],
};
const d=SI.shaftDiameterMetres,L=SI.bearingSpanMetres,F=design.proofRadialLoadN;
const maxMoment=F*L/4;
const shaftBendingStress=32*maxMoment/(Math.PI*d**3);
const shaftSecondMoment=Math.PI*d**4/64;
const shaftDeflection=F*L**3/(48*design.shaftElasticModulusPa*shaftSecondMoment);
const bearingPressure=(F/2)/(SI.shaftDiameterMetres*SI.bearingWidthMetres);
const radialFrictionTorque=design.linerDryFrictionCoefficient*F*(d/2);
const thrustMeanRadiusMetres=((P.shaftRadius+P.thrustWasherOuterRadius)/2)*.1;
const thrustFrictionTorque=design.thrustDryFrictionCoefficient*design.proofAxialLoadN*thrustMeanRadiusMetres;
const totalFrictionTorque=radialFrictionTorque+thrustFrictionTorque;
const fastenerSlipResistance=design.fastenerCount*design.fastenerAssumedPreloadN*design.railInterfaceFrictionCoefficient;
const axialFloatToleranceMm={minimum:design.innerBearingFaceSpanToleranceMm[0]-design.sleeveLengthToleranceMm[1]-2*design.washerWidthToleranceMm[1],maximum:design.innerBearingFaceSpanToleranceMm[1]-design.sleeveLengthToleranceMm[0]-2*design.washerWidthToleranceMm[0]};
const engineeringChecks={
  shaftMaxBendingMomentNm:maxMoment,
  shaftBendingStressPa:shaftBendingStress,
  shaftYieldFactor:design.shaftDeclaredMinimumYieldPa/shaftBendingStress,
  shaftMidspanDeflectionMetres:shaftDeflection,
  minimumToleranceRadialClearanceMetres:(design.linerDiameterToleranceMm[0]-design.shaftDiameterToleranceMm[1])/2/1000,
  deflectionReserveMetres:(design.linerDiameterToleranceMm[0]-design.shaftDiameterToleranceMm[1])/2/1000-shaftDeflection,
  projectedBearingPressurePa:bearingPressure,
  bearingPressureFactor:design.linerDeclaredAllowableBearingPressurePa/bearingPressure,
  radialFrictionTorqueNm:radialFrictionTorque,
  thrustFrictionTorqueNm:thrustFrictionTorque,
  totalFrictionTorqueNm:totalFrictionTorque,
  actuatorTorqueFactor:design.actuatorDesignTorqueNm/totalFrictionTorque,
  railFastenerSlipResistanceN:fastenerSlipResistance,
  railSlipFactor:fastenerSlipResistance/F,
  axialFloatToleranceMm,
};
const fullRingBaseline={
  status:"COLLISION",
  reason:"A closed 360-degree housing occupies the annulus crossed by the unnotched finite-thickness moving leaf at both D1 and D2.",
  firstSampleAngleDeg:P.angleMinDeg,
  affectedSamples:rows.length,
  smallestChange:"Open the existing housing toward +y; retain axis, bearings, shaft, panel thickness and all other dimensions.",
};

const forceMomentAt=a=>0.55*P.triangleRadius*(Math.cos(rad(a))-1);
const result={
  schema:"nexah.a0.d1-d2-clamp-engineering-test/1",
  date:"2026-10-25",
  classification:"BOUNDED_SOURCE_BOUND_ENGINEERING_TEST / NO SCIENCE RUN",
  identity:{reuses:["NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1","MOD:TESSAREC","NEXAH_A0_ORIENTATION_CONTROLLER_BENCH"],newCanonicalIds:[],relationChanges:[]},
  question:"Can the received D1-D2 axis be mounted to the fixed lower frame with finite-thickness panels and move continuously from -34 to +34 degrees while the crown and lid remain fixed?",
  parameters:P,
  geometry:{hingeEndpoints:[left,right],bearingLocations:P.bearingX.map(x=>[x,0,P.z0]),upperTriangle:upper,fixedLowerTrapezoid:lower,shaft,movingSleeve:sleeve,crownState:"FIXED_AT_HALF_CONTACT_FOLD",lidState:"FIXED / NO ADDED LID BODY",sourceUnitMetres:.1},
  intendedContacts:["shaft to moving sleeve pivot interface","shaft within replaceable D1/D2 POM-C liners with declared radial clearance","POM-C thrust washers to sleeve and bearing inner faces","split shaft collars to shaft beyond moving leaf edges","D1/D2 pedestals and rail fastened to fixed lower frame","moving and fixed panels inside the declared 0.02 u hinge exclusion strip"],
  unwantedCollisionTargets:["central pin","25 frame bars","fixed crown faces","fixed lower panel outside hinge strip","D1/D2 housing outside its +y opening","fixed rail and pedestals"],
  method:{sampleCount:rows.length,sampleStepDeg:P.sampleStepDeg,betweenSamplePointMotionBound:motionBound,numericTolerance:P.numericTolerance,distanceModel:"segment-triangle, triangle-triangle and capsule envelopes; finite panel thickness subtracted from mid-surface distances; housing opening also certified analytically by angular envelope",formalIntervalCertification:false},
  negativeBaseline:fullRingBaseline,
  candidate:{type:"TWO_FIXED_C_OPEN_BEARINGS_PLUS_CROSS_RAIL",status:"PASS_BOUNDED_CONSTRUCTIVE_CANDIDATE",openingMargin:{sampledDeg:openingMargin.housingOpeningAngularMarginDeg,angleDeg:openingMargin.angleDeg,analyticRequiredHalfAngleDeg:P.angleMaxDeg+deg(Math.asin(panelHalf/P.boreRadius))},linerOpeningMarginDeg,shaftBoreRadialClearance,linerShaftRadialClearance,bearingToMovingSleeveAxialGap:bearingAxialGap,totalAxialFloat,pathBounds,hardwareChecks,retentionMotionChecks,minimumHardwareExternalGap:Math.min(...hardwareChecks.map(x=>x.minimumExternalGap))},
  construction:{status:"ASSUMPTION_BOUND / NOT FABRICATION RELEASE",materials:{shaft:"hardened stainless steel; declared minimum yield only",housingAndRail:"6061-T6-like aluminium; declared minimum yield only",linersAndWashers:"POM-C; dry friction and allowable pressure are declared design assumptions",collarsAndFasteners:"stainless split collars and M1.4 A4-70-class screws; supplier data not yet bound"},designLoads:design,engineeringChecks,fasteners:{rail:"4 × M1.4, two per pedestal; preload-controlled slip calculation",shaftCollars:"2 split collars, one per shaft end; one M1 set screw each; torque remains supplier-open"},assemblySequence:["fasten cross rail and pedestals to the fixed lower frame","seat relieved POM-C liners in both C-housings and verify opening orientation","insert shaft through D1 liner","place D1 thrust washer, moving sleeve and D2 thrust washer","continue shaft through D2 liner","install split collars outside both moving-leaf edges and witness-mark set screws","verify axial float and free dry rotation","sweep unloaded from -34 to +34 degrees and back","apply service then proof loads and repeat full sweep"],openLimits:["no supplier certificates or measured material coupons","no screw tightening torque or thread-strip test","no wear, temperature, contamination or cycle-life test","no actuator or sensor selected","no prototype metrology or physical proof-load test","dimensionless source geometry converted with declared 0.1 m/u scale only"]},
  forceBoundary:{resultantVerticalForce:"0 under received 3x1 - 2x1.5 scaling",hingeMomentAtMinus34:forceMomentAt(-34),hingeMomentAtZero:forceMomentAt(0),hingeMomentAtPlus34:forceMomentAt(34),interpretation:"Zero resultant force does not imply zero hinge moment after folding."},
  rows,
  conclusion:"The existing D1-D2 C-bearing candidate now includes radial POM-C liners, axial thrust washers and split collars, four rail fasteners, a tolerance stack, declared proof loads, friction torque and an assembly sequence. All newly modelled retention envelopes remain collision-free over -34 to +34 degrees, and the bounded calculations pass under the stated assumptions. Supplier data, tightening torque, fatigue/wear and physical prototype proof remain open; this is not a fabrication release.",
};

for(const [name,b] of Object.entries(pathBounds)) if(!(b.continuousLowerBound>0)) throw new Error(`continuous ${name} clearance failed`);
if(!(openingMargin.housingOpeningAngularMarginDeg>0)) throw new Error("housing opening margin failed");
if(!(shaftBoreRadialClearance>0&&bearingAxialGap>0)) throw new Error("bearing clearance failed");
if(!(linerShaftRadialClearance>0&&totalAxialFloat>0&&linerOpeningMarginDeg>0)) throw new Error("liner or axial retention clearance failed");
for(const item of retentionMotionChecks) if(!(item.continuousLowerBound>0)) throw new Error(`retention motion clearance failed: ${item.part}`);
if(!(engineeringChecks.shaftYieldFactor>2&&engineeringChecks.deflectionReserveMetres>0&&engineeringChecks.bearingPressureFactor>2&&engineeringChecks.actuatorTorqueFactor>2&&engineeringChecks.railSlipFactor>2&&engineeringChecks.axialFloatToleranceMm.minimum>0)) throw new Error("engineering assumption check failed");
if(!(result.candidate.minimumHardwareExternalGap>0)) throw new Error("hardware external collision");
if(fullRingBaseline.status!=="COLLISION") throw new Error("negative baseline not preserved");

fs.writeFileSync(path.join(here,"D1_D2_CLAMP_TEST_RESULTS.json"),JSON.stringify(result,null,2)+"\n");

function fmt(x,n=3){ return Number(x).toFixed(n).replace(".",","); }
const mm=x=>fmt(x*P.sourceUnitMillimetres,2);
const plotRows=rows.filter((_,i)=>i%10===0||i===rows.length-1);
const W=1500,H=920, plot={x:770,y:260,w:650,h:360};
const plotMin=0,plotMax=Math.max(...plotRows.flatMap(r=>[r.pinClearance,r.frameClearance,r.crownClearance]));
const px=a=>plot.x+(a-P.angleMinDeg)/(P.angleMaxDeg-P.angleMinDeg)*plot.w;
const py=v=>plot.y+plot.h-(v-plotMin)/(plotMax-plotMin)*plot.h;
const line=key=>plotRows.map((r,i)=>`${i?"L":"M"}${px(r.angleDeg).toFixed(1)} ${py(r[key]).toFixed(1)}`).join(" ");
const openArc=(cx,cy,ri,ro,start,end)=>{
  const pt=(r,a)=>[cx+r*Math.cos(rad(a)),cy-r*Math.sin(rad(a))];
  const a=pt(ro,start),b=pt(ro,end),c=pt(ri,end),d=pt(ri,start),large=end-start>180?1:0;
  return `M${a[0]} ${a[1]} A${ro} ${ro} 0 ${large} 0 ${b[0]} ${b[1]} L${c[0]} ${c[1]} A${ri} ${ri} 0 ${large} 1 ${d[0]} ${d[1]} Z`;
};
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#f3f6f8"/><style>text{font-family:Inter,Arial,sans-serif;fill:#173048}.mono{font-family:ui-monospace,monospace}.small{font-size:18px}.label{font-size:16px;font-weight:700;letter-spacing:1.3px}.title{font-size:38px;font-weight:800}.sub{font-size:22px}.dim{font-size:17px}.grid{stroke:#cbd7df;stroke-width:1}.axis{stroke:#173048;stroke-width:2}.gold{stroke:#e0aa32}.cyan{stroke:#31bcd2}.pink{stroke:#d84d93}.green{stroke:#39a976}.red{stroke:#c94b5f}</style>
<text x="54" y="64" class="title">D1–D2 KLEMMTEST · ENDLICHE DICKE</text><text x="54" y="103" class="sub">Zwei feste C-Lager · eine Achse · −34° bis +34° · Krone fest</text>
<g transform="translate(75 205)">
  <text x="0" y="-38" class="label">KANDIDAT · SEITENSCHNITT Y/Z</text>
  <line x1="40" y1="330" x2="590" y2="330" stroke="#23384c" stroke-width="18"/><text x="40" y="300" class="small">feste untere Fläche · t=${mm(P.panelThickness)} mm</text>
  <rect x="195" y="350" width="240" height="18" fill="#31bcd2" opacity=".8"/><text x="195" y="400" class="small">Querrail am festen Rahmen</text>
  <line x1="315" y1="80" x2="315" y2="330" class="pink" stroke-width="12" transform="rotate(-34 315 330)"/><line x1="315" y1="80" x2="315" y2="330" class="pink" stroke-width="12" opacity=".28" transform="rotate(34 315 330)"/>
  <circle cx="315" cy="330" r="16" fill="#e9b541"/><path d="${openArc(315,330,44,24,60,300)}" fill="#173048"/>
  <rect x="300" y="350" width="30" height="35" fill="#173048"/><path d="M315 330 L420 190" class="pink" stroke-width="3" stroke-dasharray="8 8"/><path d="M315 330 L210 190" class="pink" stroke-width="3" stroke-dasharray="8 8"/>
  <text x="335" y="320" class="dim">Achse Ø ${mm(P.shaftRadius*2)} mm</text><text x="360" y="275" class="dim">C-Öffnung ±${P.housingOpeningHalfAngleDeg}°</text><text x="335" y="430" class="dim">Lager außen Ø ${mm(P.housingOuterRadius*2)} mm</text>
  <text x="78" y="475" class="label">NEGATIVE BASIS</text><circle cx="125" cy="540" r="44" fill="#173048"/><circle cx="125" cy="540" r="24" fill="#f3f6f8"/><line x1="125" y1="540" x2="205" y2="455" class="red" stroke-width="12"/><text x="70" y="610" class="small">geschlossener Ring kollidiert</text>
  <text x="330" y="475" class="label">KLEINSTE ÄNDERUNG</text><path d="${openArc(420,540,44,24,60,300)}" fill="#173048"/><line x1="420" y1="540" x2="500" y2="455" class="green" stroke-width="12"/><text x="345" y="610" class="small">C-Öffnung gibt Blatt frei</text>
</g>
<g><text x="${plot.x}" y="205" class="label">VOLLSTÄNDIGER WEG · ${rows.length} PROBEN + BEWEGUNGSGRENZE</text>
${[0,.05,.10,.15,.20].map(v=>`<line x1="${plot.x}" y1="${py(v)}" x2="${plot.x+plot.w}" y2="${py(v)}" class="grid"/><text x="${plot.x-58}" y="${py(v)+6}" class="mono small">${fmt(v,2)}</text>`).join("")}
<line x1="${plot.x}" y1="${plot.y}" x2="${plot.x}" y2="${plot.y+plot.h}" class="axis"/><line x1="${plot.x}" y1="${plot.y+plot.h}" x2="${plot.x+plot.w}" y2="${plot.y+plot.h}" class="axis"/>
${[-34,-17,0,17,34].map(v=>`<line x1="${px(v)}" y1="${plot.y+plot.h}" x2="${px(v)}" y2="${plot.y+plot.h+8}" class="axis"/><text x="${px(v)-18}" y="${plot.y+plot.h+34}" class="mono small">${v}°</text>`).join("")}
<path d="${line("pinClearance")}" fill="none" class="gold" stroke-width="4"/><path d="${line("frameClearance")}" fill="none" class="cyan" stroke-width="4"/><path d="${line("crownClearance")}" fill="none" class="pink" stroke-width="4"/>
<text x="${plot.x}" y="${plot.y+plot.h+85}" class="small" fill="#e0aa32">— Pin</text><text x="${plot.x+150}" y="${plot.y+plot.h+85}" class="small">— Rahmen</text><text x="${plot.x+340}" y="${plot.y+plot.h+85}" class="small">— feste Krone</text>
</g>
<g transform="translate(770 720)"><text class="label">ERGEBNIS</text><text y="42" class="sub">PASS · konstruktiver Annahmen-Kandidat</text><text y="82" class="small">kleinste Wegschranke: ${fmt(Math.min(...Object.values(pathBounds).map(x=>x.continuousLowerBound)),6)} u · Retention: ${fmt(Math.min(...retentionMotionChecks.map(x=>x.continuousLowerBound)),6)} u</text><text y="116" class="small">Liner-Winkelreserve: ${fmt(linerOpeningMarginDeg,3)}° · Axialspiel nominal ${mm(totalAxialFloat)} mm</text><text y="150" class="small">Proof: ${fmt(design.proofRadialLoadN,1)} N · Reibmoment ${fmt(totalFrictionTorque*1000,3)} Nmm · kein Fabrication Release</text></g>
<text x="54" y="904" class="small">Material-, Last- und Toleranzwerte sind deklarierte Konstruktionsannahmen; Lieferantendaten, Verschleiß und physischer Proof bleiben offen.</text></svg>`;
fs.writeFileSync(path.join(here,"D1_D2_CLAMP_VISUAL.svg"),svg);

// Minimal animated GLB. Geometry is generated from the same parameter object.
const gltf={asset:{version:"2.0",generator:"NEXAH D1-D2 clamp bounded engineering candidate 2026-10-25"},scene:0,scenes:[{name:"D1-D2 clamp candidate",nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[],extras:{classification:result.classification,sourceUnitMetres:.1,angleRangeDegrees:[-34,34],crown:"fixed",lid:"fixed",newCanonicalIds:[],relationChanges:[]}};
const chunks=[]; let byteLength=0;
function appendBuffer(buffer,target){
  const pad=(4-byteLength%4)%4; if(pad){chunks.push(Buffer.alloc(pad));byteLength+=pad;}
  const offset=byteLength;chunks.push(buffer);byteLength+=buffer.length;
  const view={buffer:0,byteOffset:offset,byteLength:buffer.length};if(target)view.target=target;
  gltf.bufferViews.push(view);return gltf.bufferViews.length-1;
}
function accessor(values,type,componentType,target){
  const arity={SCALAR:1,VEC3:3,VEC4:4}[type], arr=componentType===5123?Uint16Array.from(values):Float32Array.from(values);
  const view=appendBuffer(Buffer.from(arr.buffer),target), count=values.length/arity, out={bufferView:view,componentType,count,type};
  if(componentType===5126){out.min=[];out.max=[];for(let k=0;k<arity;k++){const vals=[];for(let i=k;i<values.length;i+=arity)vals.push(values[i]);out.min.push(Math.min(...vals));out.max.push(Math.max(...vals));}}
  gltf.accessors.push(out);return gltf.accessors.length-1;
}
function material(name,color,metal=.1,rough=.45){gltf.materials.push({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[...color,1],metallicFactor:metal,roughnessFactor:rough}});return gltf.materials.length-1;}
const Q=p=>[p[0]*.1,p[2]*.1,-p[1]*.1];
function addMesh(name,sourceVertices,faces,mat){
  const vertices=sourceVertices.map(Q), normals=vertices.map(()=>[0,0,0]);
  for(const f of faces){const n=unit(cross(sub(vertices[f[1]],vertices[f[0]]),sub(vertices[f[2]],vertices[f[0]])));for(const i of f)normals[i]=add(normals[i],n);}
  const flatN=normals.map(n=>norm(n)?unit(n):[0,1,0]).flat();
  gltf.meshes.push({name,primitives:[{attributes:{POSITION:accessor(vertices.flat(),"VEC3",5126,34962),NORMAL:accessor(flatN,"VEC3",5126,34962)},indices:accessor(faces.flat(),"SCALAR",5123,34963),material:mat}]});return gltf.meshes.length-1;
}
function addNode(name,mesh,translation,rotation,extras){const n={name,mesh};if(translation)n.translation=translation;if(rotation)n.rotation=rotation;if(extras)n.extras=extras;gltf.nodes.push(n);gltf.scenes[0].nodes.push(gltf.nodes.length-1);return gltf.nodes.length-1;}
function prism(poly,t){const n=poly.length,v=poly.flatMap(p=>[[p[0],p[1],p[2]-t/2],[p[0],p[1],p[2]+t/2]]),f=[];for(let i=1;i<n-1;i++)f.push([0,2*i,2*(i+1)],[1,2*(i+1)+1,2*i+1]);for(let i=0;i<n;i++){const j=(i+1)%n;f.push([2*i,2*j,2*j+1],[2*i,2*j+1,2*i+1]);}return {v,f};}
function box(center,size){const [x,y,z]=center,[sx,sy,sz]=size.map(v=>v/2),v=[];for(const dx of [-sx,sx])for(const dy of [-sy,sy])for(const dz of [-sz,sz])v.push([x+dx,y+dy,z+dz]);const f=[[0,4,6],[0,6,2],[1,3,7],[1,7,5],[0,1,5],[0,5,4],[2,6,7],[2,7,3],[0,2,3],[0,3,1],[4,5,7],[4,7,6]];return {v,f};}
function cylinderX(a,b,r,n=20){const v=[],f=[];for(const x of [a[0],b[0]])for(let i=0;i<n;i++){const th=2*Math.PI*i/n;v.push([x,a[1]+r*Math.cos(th),a[2]+r*Math.sin(th)]);}for(let i=0;i<n;i++){const j=(i+1)%n;f.push([i,j,n+j],[i,n+j,n+i]);}return {v,f};}
function cRing(x,width,ri,ro,open,n=28){const angles=[];for(let i=0;i<=n;i++)angles.push(rad(open+(360-2*open)*i/n));const v=[];for(const xx of [x-width/2,x+width/2])for(const rr of [ri,ro])for(const th of angles)v.push([xx,rr*Math.cos(th),P.z0+rr*Math.sin(th)]);const m=angles.length,f=[];for(let side=0;side<2;side++){const base=side*2*m;for(let i=0;i<m-1;i++){f.push([base+i,base+i+1,base+m+i+1],[base+i,base+m+i+1,base+m+i]);}}for(let ring=0;ring<2;ring++){const a=ring*m,b=2*m+ring*m;for(let i=0;i<m-1;i++)f.push([a+i,b+i,b+i+1],[a+i,b+i+1,a+i+1]);}for(const i of [0,m-1])f.push([i,m+i,3*m+i],[i,3*m+i,2*m+i]);return {v,f};}
const dark=material("fixed lower frame",[.08,.13,.2],.25,.5),pink=material("moving finite panel",[.82,.12,.43],.15,.35),gold=material("shaft and sleeve",[.88,.62,.18],.5,.3),cyan=material("C-open bearings",[.12,.64,.72],.35,.35),pom=material("POM-C liners and washers",[.93,.93,.88],.02,.65),steel=material("retention steel",[.45,.5,.55],.75,.25),ghost=material("fixed crown reference",[.72,.25,.52],.1,.55);
let g=prism(lower,P.panelThickness);addNode("fixed lower trapezoid",addMesh("fixed lower trapezoid",g.v,g.f,dark));
const localUpper=upper.map(p=>sub(p,[0,0,P.z0]));g=prism(localUpper,P.panelThickness);const movingNode=addNode("D1-D2 moving finite panel",addMesh("moving panel",g.v,g.f,pink),Q([0,0,P.z0]),[Math.sin(rad(-34)/2),0,0,Math.cos(rad(-34)/2)],{intendedAxis:"D1-D2"});
for(const [name,part] of [["shaft",cylinderX(shaft[0],shaft[1],P.shaftRadius)],["moving sleeve",cylinderX(sleeve[0],sleeve[1],P.movingSleeveOuterRadius)]])addNode(name,addMesh(name,part.v,part.f,gold));
for(const x of P.bearingX){const ring=cRing(x,P.housingWidth,P.boreRadius,P.housingOuterRadius,P.housingOpeningHalfAngleDeg);addNode(x<0?"D1 C-open bearing":"D2 C-open bearing",addMesh("C-open bearing",ring.v,ring.f,cyan));const pedestal=box([x,(P.pedestalY0+P.pedestalY1)/2,P.z0],[P.housingWidth,P.pedestalY1-P.pedestalY0,P.pedestalRadius*2]);addNode(x<0?"D1 pedestal":"D2 pedestal",addMesh("pedestal",pedestal.v,pedestal.f,cyan));}
for(const x of P.bearingX){const liner=cRing(x,P.housingWidth,P.linerBoreRadius,P.linerOuterRadius,P.linerOpeningHalfAngleDeg);addNode(x<0?"D1 relieved POM-C liner":"D2 relieved POM-C liner",addMesh("relieved POM-C liner",liner.v,liner.f,pom));}
for(const x of washerCenters){const washer=cylinderX([x-P.thrustWasherWidth/2,0,P.z0],[x+P.thrustWasherWidth/2,0,P.z0],P.thrustWasherOuterRadius);addNode(x<0?"D1 thrust washer":"D2 thrust washer",addMesh("POM-C thrust washer",washer.v,washer.f,pom));}
for(const sign of [-1,1]){const x=sign*P.collarCenterX,collar=cylinderX([x-P.collarWidth/2,0,P.z0],[x+P.collarWidth/2,0,P.z0],P.collarOuterRadius);addNode(sign<0?"D1 split shaft collar":"D2 split shaft collar",addMesh("split shaft collar",collar.v,collar.f,steel));}
for(const x of P.bearingX) for(const dx of P.fastenerXOffsets){const screw=cylinderX([P.fastenerZ0,0,x+dx],[P.fastenerZ1,0,x+dx],P.fastenerRadius);const screwVertices=screw.v.map(v=>[v[2],P.fixedRail.y+(v[1]||0),v[0]]);addNode(`M1.4 rail screw ${x<0?"D1":"D2"} ${dx<0?"A":"B"}`,addMesh("M1.4 rail screw",screwVertices,screw.f,steel));}
const rail=box([0,P.fixedRail.y,P.fixedRail.z],[2*P.fixedRail.xHalf,2*P.fixedRail.yHalf,2*P.fixedRail.zHalf]);addNode("fixed cross rail",addMesh("fixed rail",rail.v,rail.f,cyan));
for(let i=0;i<crownFaces.length;i++)addNode(`fixed crown face ${i+1}`,addMesh("fixed crown face",crownFaces[i],[[0,1,2]],ghost));
const times=[0,2,4,6,8],angles=[-34,0,34,0,-34].map(rad),quats=angles.flatMap(a=>[Math.sin(a/2),0,0,Math.cos(a/2)]);
gltf.animations=[{name:"D1-D2 minus34 to plus34 and return",samplers:[{input:accessor(times,"SCALAR",5126),output:accessor(quats,"VEC4",5126),interpolation:"LINEAR"}],channels:[{sampler:0,target:{node:movingNode,path:"rotation"}}]}];
const bin=Buffer.concat(chunks);gltf.buffers=[{byteLength:bin.length}];let json=Buffer.from(JSON.stringify(gltf));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]);const binPad=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);const header=Buffer.alloc(12),jhead=Buffer.alloc(8),bhead=Buffer.alloc(8);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+json.length+8+binPad.length,8);jhead.writeUInt32LE(json.length,0);jhead.writeUInt32LE(0x4e4f534a,4);bhead.writeUInt32LE(binPad.length,0);bhead.writeUInt32LE(0x004e4942,4);fs.writeFileSync(path.join(here,"NEXAH_D1_D2_CLAMP_CANDIDATE_2026-10-25.glb"),Buffer.concat([header,jhead,json,bhead,binPad]));

console.log(JSON.stringify({status:result.candidate.status,samples:rows.length,motionBound,pathBounds,openingMarginDeg:openingMargin.housingOpeningAngularMarginDeg,minimumHardwareExternalGap:result.candidate.minimumHardwareExternalGap,negativeBaseline:fullRingBaseline.status,outputs:["D1_D2_CLAMP_TEST_RESULTS.json","D1_D2_CLAMP_VISUAL.svg","NEXAH_D1_D2_CLAMP_CANDIDATE_2026-10-25.glb"]},null,2));
