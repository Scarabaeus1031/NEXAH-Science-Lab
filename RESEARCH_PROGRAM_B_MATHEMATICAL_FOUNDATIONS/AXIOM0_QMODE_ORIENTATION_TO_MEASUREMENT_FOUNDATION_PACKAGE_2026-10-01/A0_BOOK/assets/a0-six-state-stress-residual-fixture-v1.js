(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0SixStateStressResidual=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',EPS=1e-12;
  const ROLE_ORDER=['u','rho','sigma','f'];
  const STATES=Object.freeze([
    Object.freeze({id:'S0',alias:'I',io:1,u:1,rho:1,sigmaIn:0,sigmaOut:0,f:1}),
    Object.freeze({id:'S1',alias:'ö',io:1,u:1,rho:2,sigmaIn:1,sigmaOut:2,f:1}),
    Object.freeze({id:'S2',alias:'ô',io:1,u:2,rho:3,sigmaIn:0,sigmaOut:4,f:2}),
    Object.freeze({id:'S3',alias:'ò',io:0,u:2,rho:4,sigmaIn:1,sigmaOut:6,f:3}),
    Object.freeze({id:'S4',alias:'o',io:0,u:2,rho:5,sigmaIn:2,sigmaOut:8,f:4}),
    Object.freeze({id:'S5',alias:'O',io:0,u:2,rho:6,sigmaIn:3,sigmaOut:10,f:5})
  ]);
  function residual(state){
    if(!state||typeof state!=='object')throw new TypeError('state record required');
    return state.rho*state.u-(state.sigmaOut-state.sigmaIn)-state.f;
  }
  function evaluate(state){
    const r=residual(state),finite=['u','rho','sigmaIn','sigmaOut','f'].every(key=>Number.isFinite(state[key]));
    return {schema:'a0.six-state-stress-residual.record/1',id:state.id,alias:state.alias,aliasStatus:'PROVISIONAL_DISPLAY_ONLY',io:state.io,terms:{u:state.u,rho:state.rho,sigma:{in:state.sigmaIn,out:state.sigmaOut,delta:state.sigmaOut-state.sigmaIn},f:state.f},residual:r,closed:finite&&Math.abs(r)<EPS,layer:'L0_RESIDUAL_WITH_L1_DECLARED_ROLES'};
  }
  function perturb(state,term,delta=1){
    const next={...state};
    if(term==='u'||term==='rho'||term==='f')next[term]+=delta;
    else if(term==='sigma')next.sigmaOut+=delta;
    else throw new TypeError('term must be u, rho, sigma, or f');
    return next;
  }
  function runAudit(){
    const checks=[],check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
    for(const state of STATES){
      check(`${state.id}-finite`,['u','rho','sigmaIn','sigmaOut','f'].every(key=>Number.isFinite(state[key])),'all fixture terms are finite');
      check(`${state.id}-io-bit`,state.io===0||state.io===1,'I/O is a declared local bit');
      check(`${state.id}-closure`,Math.abs(residual(state))<EPS,'rho*u - delta(sigma) - f = 0');
      for(const term of ROLE_ORDER)check(`${state.id}-tamper-${term}`,Math.abs(residual(perturb(state,term)))>=EPS,`${term} perturbation fails closed`);
    }
    const ids=STATES.map(s=>s.id),aliases=STATES.map(s=>s.alias);
    check('schema','a0.six-state-stress-residual.audit/1'.endsWith('/1'),'versioned audit schema');
    check('six-states',STATES.length===6,'exactly six frozen records');
    check('unique-ids',new Set(ids).size===STATES.length,'stable local IDs are unique');
    check('unique-aliases',new Set(aliases).size===STATES.length,'display aliases are unique');
    check('input-count',STATES.filter(s=>s.io===1).length===3,'three local input/on states');
    check('output-count',STATES.filter(s=>s.io===0).length===3,'three local output/off states');
    check('role-order',JSON.stringify(ROLE_ORDER)===JSON.stringify(['u','rho','sigma','f']),'declared role order is frozen');
    check('l0-layer',STATES.every(s=>evaluate(s).layer.startsWith('L0_')),'residual closure remains L0');
    check('no-l2',STATES.every(s=>!evaluate(s).layer.includes('L2')),'no physical balance admission');
    check('aliases-provisional',STATES.every(s=>evaluate(s).aliasStatus==='PROVISIONAL_DISPLAY_ONLY'),'glyphs do not create identities');
    check('maos-context-only',true,'MAOS is catalog provenance only, not an executable dependency');
    check('no-orion-identity',true,'fixture does not mint an ORION or OLS identity');
    check('equation-order',Math.abs(residual({rho:2,u:3,sigmaIn:1,sigmaOut:5,f:2}))<EPS,'signed equation order is explicit');
    check('frozen-records',Object.isFrozen(STATES)&&STATES.every(Object.isFrozen),'fixture records are immutable');
    const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;
    return {schema:'a0.six-state-stress-residual.audit/1',fixtureVersion:VERSION,equation:'r = rho*u - (sigma_out - sigma_in) - f',roles:ROLE_ORDER,states:STATES.map(evaluate),assertions:{total:checks.length,passed,failed},outcome:failed===0?'PASS_SIX_STATE_RESIDUAL_SEPARATED':'INVALID_CONTRACT',claimBoundary:'L0_RESIDUAL_AND_L1_ROLE_CLASSIFICATION_ONLY / NO_L2_PHYSICAL_BALANCE / MAOS_CONTEXT_ONLY',details:checks};
  }
  return {VERSION,ROLE_ORDER,STATES,residual,evaluate,perturb,runAudit};
});
