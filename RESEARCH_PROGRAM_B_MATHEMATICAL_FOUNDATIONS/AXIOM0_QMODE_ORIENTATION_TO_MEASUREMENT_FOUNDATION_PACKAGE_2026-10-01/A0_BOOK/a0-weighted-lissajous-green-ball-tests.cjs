'use strict';
const assert=require('assert');
const green=require('./assets/a0-weighted-lissajous-green-ball.js');

let assertions=0;
function equal(actual,expected){assert.strictEqual(actual,expected);assertions+=1;}
function deep(actual,expected){assert.deepStrictEqual(actual,expected);assertions+=1;}
function close(actual,expected,tolerance=1e-10){assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);assertions+=1;}

equal(green.SCHEMA,'a0.weighted-lissajous-green-ball.v1');
equal(green.SOURCE_CARRIER,'THREE_SIGNAL_CARRIER');
deep(green.normalizeWeights([1,1,1]),[1/3,1/3,1/3]);
deep(green.normalizeWeights([2,1,1]),[.5,.25,.25]);
assert.throws(()=>green.normalizeWeights([0,0,0]),/positive/);assertions+=1;
assert.throws(()=>green.normalizeWeights([1,-1,1]),/non-negative/);assertions+=1;
assert.throws(()=>green.normalizeWeights([1,1]),/exactly three/);assertions+=1;

const time=.731,a=3,b=2,phase=Math.PI/2,equalWeight=green.sample(time,a,b,phase,[1,1,1]);
deep(equalWeight.axisGains,[1,1,1]);
equalWeight.position.forEach((value,index)=>close(value,equalWeight.signals[index]));
close(equalWeight.vertical,equalWeight.signals.reduce((sum,value)=>sum+value,0)/3);
equal(equalWeight.sourceCarrier,'THREE_SIGNAL_CARRIER');
equal(equalWeight.status,'BOUND_DISPLAY_WEIGHT_VIEW');
assert.match(equalWeight.boundary,/NOT_MASS_PROBABILITY_PRESSURE_OR_BOLTZMANN_CONSTANT/);assertions+=1;
assert.match(equalWeight.boundary,/NOT_CARO_GREEN_MIRROR_BALL/);assertions+=1;

const weighted=green.sample(time,a,b,phase,[2,1,1]);
deep(weighted.normalizedWeights,[.5,.25,.25]);
deep(weighted.axisGains,[1.5,.75,.75]);
close(weighted.vertical,.5*weighted.signals[0]+.25*weighted.signals[1]+.25*weighted.signals[2]);
deep(green.project(weighted,[2,0]),[weighted.position[2],weighted.position[0]]);

const epsilon=1e-6;
const before=green.sample(time-epsilon,a,b,phase,[2,1,1]).vertical;
const after=green.sample(time+epsilon,a,b,phase,[2,1,1]).vertical;
close(weighted.verticalGradient,(after-before)/(2*epsilon),2e-9);

const period=green.sample(time+Math.PI*2,a,b,phase,[2,1,1]);
weighted.signals.forEach((value,index)=>close(period.signals[index],value));
weighted.position.forEach((value,index)=>close(period.position[index],value));
close(period.vertical,weighted.vertical);
close(period.verticalGradient,weighted.verticalGradient);
equal(green.sample(0,1,1,0,[1,1,1]).direction,'UP');
equal(green.sample(Math.PI,1,1,0,[1,1,1]).direction,'DOWN');

console.log(JSON.stringify({status:'PASS',assertions,schema:green.SCHEMA,view:green.VIEW_ID,sourceCarrier:green.SOURCE_CARRIER,boundary:equalWeight.boundary},null,2));
