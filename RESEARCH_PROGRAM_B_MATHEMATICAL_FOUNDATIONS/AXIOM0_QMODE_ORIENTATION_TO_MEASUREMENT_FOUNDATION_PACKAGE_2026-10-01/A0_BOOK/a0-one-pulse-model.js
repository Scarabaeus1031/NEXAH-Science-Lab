(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0OnePulseModel=api;
})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const LENSES=Object.freeze([
    Object.freeze({id:'chemistry',row:'CARRIER',label:'Chemistry',boundary:'independent Gray–Scott operator'}),
    Object.freeze({id:'life',row:'CARRIER',label:'Life',boundary:'independent Three-Domain LIFE operator'}),
    Object.freeze({id:'physics',row:'CARRIER',label:'Physics',boundary:'independent spin operator'}),
    Object.freeze({id:'euler',row:'PATTERN',label:'Euler',boundary:'phase address; no feedback'}),
    Object.freeze({id:'fibonacci',row:'PATTERN',label:'Fibonacci',boundary:'exact (0,1) recurrence'}),
    Object.freeze({id:'ihara',row:'PATTERN',label:'Ihara',boundary:'finite graph address; no shared edge cursor'}),
    Object.freeze({id:'joint',row:'RETURN',label:'Joint · +1',boundary:'derived arithmetic readout; no fourth domain'}),
    Object.freeze({id:'k-teller',row:'RETURN',label:'k·NEG Teller',boundary:'counts require full checkpoint for return'}),
    Object.freeze({id:'blue-body',row:'RETURN',label:'Blue Body · 48',boundary:'declared address schedule; not body runtime'})
  ]);
  const integer=value=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0?value:null;
  function fibonacciPair(index){
    if(!Number.isInteger(index)||index<0||index>30)throw new RangeError('Fibonacci address must be 0..30');
    let a=0n,b=1n;for(let i=0;i<index;i++)[a,b]=[b,a+b];return[String(a),String(b)];
  }
  function project(generation,life={},domains={}){
    if(!Number.isInteger(generation)||generation<0||generation>240)throw new RangeError('ONE PULSE generation must be 0..240');
    const phase=generation%8,fibIndex=generation%31,fib=fibonacciPair(fibIndex),focus=generation%LENSES.length;
    const events=id=>integer(domains[id+'Events']),residual=id=>integer(domains[id+'Residual']);
    const lifeValid=['live','events','residual'].every(k=>integer(life[k])!==null),domainValid=['chemistry','life','physics'].every(id=>events(id)!==null&&residual(id)!==null)&&integer(domains.kTellerTotal)!==null&&['jointRe','jointIm'].every(k=>typeof domains[k]==='string'&&domains[k].trim()!==''&&Number.isFinite(Number(domains[k])))&&typeof domains.iharaState==='string'&&domains.iharaState.length>0;
    const synchronized=domains.generation===generation&&lifeValid&&domainValid;
    const values={
      chemistry:`${events('chemistry')} events · Δ${residual('chemistry')}`,
      life:`${events('life')} events · Δ${residual('life')}`,
      physics:`${events('physics')} events · Δ${residual('physics')}`,
      euler:`n${phase} · ${(phase*45)%360}° · g mod 8`,
      fibonacci:`F${fibIndex} / F${fibIndex+1} = ${fib[0]} / ${fib[1]}`,
      ihara:`address g${generation}${domains.iharaState?' · '+domains.iharaState:''}`,
      joint:domains.jointRe!==undefined?`Z̄ = ${domains.jointRe} ${String(domains.jointIm||'0').startsWith('-')?'−':'+'} ${String(domains.jointIm||'0').replace(/^-/,'')}i`:'awaiting joint readout',
      'k-teller':`${integer(domains.kTellerTotal)} negative events · typed by domain`,
      'blue-body':`station ${generation%48}/47 · g mod 48`
    };
    return Object.freeze({
      schema:'a0.one-pulse-view/2',generation,focus,focusId:LENSES[focus].id,
      source:Object.freeze({kind:'LIFE_GENERATION_CLOCK',generation,live:integer(life.live),events:integer(life.events),residual:integer(life.residual)}),
      cards:Object.freeze(LENSES.map((lens,index)=>Object.freeze({...lens,value:synchronized?values[lens.id]:'HOLD · kein bestätigter gemeinsamer Lesestand',active:synchronized&&index===focus,status:synchronized?'CONFIRMED_READOUT':'HOLD'}))),
      clock:Object.freeze({life:generation,domains:Number.isInteger(domains.generation)?domains.generation:null,addressesMatch:domains.generation===generation,synchronized}),
      boundary:'LIFE supplies the generation address. Three native domain operators remain distinct. Nine lenses read; none writes back. Focus g mod 9 is presentation only.'
    });
  }
  return Object.freeze({LENSES,fibonacciPair,project});
});
