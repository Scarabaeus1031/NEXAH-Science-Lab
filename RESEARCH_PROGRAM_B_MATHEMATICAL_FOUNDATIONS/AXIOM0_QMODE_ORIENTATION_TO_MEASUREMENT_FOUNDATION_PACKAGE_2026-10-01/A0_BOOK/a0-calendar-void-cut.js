'use strict';

const G=require('./a0-gh-hinge.js');
const DAY_MS=86400000;

function pad(value){return String(value).padStart(2,'0');}
function format(day,month,year){return `${pad(day)}.${pad(month)}.${year}`;}
function daysInYear(year){return G.isLeapYear(year)?366:365;}
function strictDate(day,month,year){
  const witness=G.calendarWitness(day,month,year);
  return {...witness,label:format(day,month,year)};
}
function utcDate(witness){
  if(!witness.valid)throw new RangeError('a valid calendar witness is required');
  return new Date(Date.UTC(witness.year,witness.month-1,witness.day));
}
function fromUtc(date){return strictDate(date.getUTCDate(),date.getUTCMonth()+1,date.getUTCFullYear());}
function addDays(witness,days){
  if(!Number.isInteger(days))throw new TypeError('days must be an integer');
  return fromUtc(new Date(utcDate(witness).getTime()+days*DAY_MS));
}
function addCalendarYears(witness,years){
  if(!Number.isInteger(years))throw new TypeError('years must be an integer');
  return strictDate(witness.day,witness.month,witness.year+years);
}
function addCalendarMonths(witness,months){
  if(!Number.isInteger(months))throw new TypeError('months must be an integer');
  const serial=witness.year*12+(witness.month-1)+months;
  const year=Math.floor(serial/12),month=serial-year*12+1;
  return strictDate(witness.day,month,year);
}
function dayOfYear(witness){
  const start=Date.UTC(witness.year,0,1);
  return Math.floor((utcDate(witness).getTime()-start)/DAY_MS)+1;
}
function calendarAngle(witness){
  if(!witness.valid)return null;
  const ordinal=dayOfYear(witness),denominator=daysInYear(witness.year);
  return {convention:'theta = 360 degrees * (day_of_year - 1) / days_in_year',day_of_year:ordinal,days_in_year:denominator,degrees:360*(ordinal-1)/denominator};
}
function gcd(a,b){while(b){[a,b]=[b,a%b];}return Math.abs(a);}
function rollingRatio(R,r){
  if(!Number.isInteger(R)||!Number.isInteger(r)||R<=r||r<=0)throw new RangeError('integer radii require R > r > 0');
  const whole=gcd(R,r),split=gcd(R-r,r);
  return {R,r,reduced:[R/whole,r/whole],inner_split:[(R-r)/split,r/split],cusps:R/whole,carrier_circuits_per_return:r/whole,closure:'rational finite return'};
}
function buildReturn(){
  const seed=strictDate(29,2,1972),after12=addDays(seed,12),alpha=addCalendarYears(after12,2),beta=addCalendarMonths(alpha,2);
  const voidDate=strictDate(29,2,1974),minus=strictDate(28,2,1974),plus=strictDate(1,3,1974);
  const elapsed=(utcDate(alpha)-utcDate(seed))/DAY_MS;
  return {
    schema:'a0.calendar-void-cut-return/1',
    date:'2026-11-06',
    status:'PASS_EXACT_FINITE_CALENDAR_AND_RATIO_CHECK_NO_OPERATOR_PROMOTION',
    identity_reuse:['MOD:NUMBER_VIEW_SUITE','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1'],
    graph_effect:{new_ids:0,new_relations:0,new_aliases:0},
    calendar:{
      seed,after_12_days:after12,after_12_days_and_2_calendar_years:alpha,after_2_more_calendar_months:beta,
      elapsed_seed_to_alpha_days:elapsed,
      void_date:voidDate,
      lawful_cut_sides:{minus,plus},
      controls:[strictDate(11,3,1974),strictDate(13,3,1974),strictDate(12,4,1974)]
    },
    angle_readout:{seed:calendarAngle(seed),alpha:calendarAngle(alpha),beta:calendarAngle(beta),minus:calendarAngle(minus),void_date:null,plus:calendarAngle(plus),cut_width_degrees:calendarAngle(plus).degrees-calendarAngle(minus).degrees},
    ratio_sidecar:rollingRatio(12,3),
    interpretation:{
      q_sides:'minus and plus are two lawful calendar readouts bracketing one invalid civil-date label',
      transverse_plane:'declared comparison cut only',
      ratio_bridge:null,
      date_to_motion:null,
      resonance_claim:null
    },
    claim_boundary:'Exact proleptic-Gregorian arithmetic, declared annual phase readout and rational rolling-ratio sidecar only. The shared display does not identify dates, angles, ratios, resonance, physical rotation or a new operator.'
  };
}

module.exports={strictDate,addDays,addCalendarYears,addCalendarMonths,dayOfYear,calendarAngle,rollingRatio,buildReturn};
