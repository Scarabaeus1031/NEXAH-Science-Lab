(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0PascalJointBookFold=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const CHANNELS=['R','G','B'];
  const FOLD_DIRECTIONS=['RL','LR'];
  const HOLD_STATES=['LL','RR'];
  const TOP_MODES=['OPERATOR','WITNESS'];
  const T3_NODE_COUNT=6;
  const T5_NODE_COUNT=15;
  const RAW_T3_COUNT=3*T3_NODE_COUNT;
  const SHARED_JOINT_COUNT=RAW_T3_COUNT-T5_NODE_COUNT;

  const mod=(value,base)=>((Number(value)%base)+base)%base;
  const foldSign=direction=>direction==='RL'?1:direction==='LR'?-1:0;
  const rotateOrder=(values,step)=>values.map((_,index)=>values[mod(index-step,values.length)]);
  const channelOrder=(direction,phase=0)=>{
    const base=direction==='LR'?[...CHANNELS].reverse():[...CHANNELS];
    return rotateOrder(base,phase);
  };
  const createState=()=>({page:'OPEN',phase:0,topMode:'OPERATOR',steps:0,history:[]});
  const applyFold=(input,direction)=>{
    if(!FOLD_DIRECTIONS.includes(direction))throw new RangeError('fold direction must be RL or LR');
    const state={...input,history:[...(input.history||[])]};
    const closes=state.page!=='OPEN'&&state.page!==direction;
    state.page=closes?'OPEN':direction;
    state.phase=mod(state.phase+foldSign(direction),CHANNELS.length);
    state.steps+=1;
    state.history.push(direction);
    return state;
  };
  const applyHold=(input,hold)=>{
    if(!HOLD_STATES.includes(hold))throw new RangeError('hold state must be LL or RR');
    return {...input,history:[...(input.history||[]),hold],steps:Number(input.steps||0)+1};
  };
  const toggleTop=input=>({...input,topMode:input.topMode==='WITNESS'?'OPERATOR':'WITNESS'});
  const returnHome=()=>createState();
  const isHome=state=>state.page==='OPEN'&&mod(state.phase,3)===0;
  const carrierCount=state=>T5_NODE_COUNT+(state.topMode==='WITNESS'?1:0);
  const bookContract=()=>({
    rawSubpyramidNodes:RAW_T3_COUNT,
    sharedJoints:SHARED_JOINT_COUNT,
    uniqueCarrierNodes:T5_NODE_COUNT,
    witnessCarrierNodes:T5_NODE_COUNT+1,
    leftPage:'RL',
    rightPage:'LR',
    commonBorder:'TOP_TO_RETURN_SPINE',
    rgbCycles:{RL:['R','G','B'],LR:['B','G','R']}
  });

  const svgEl=(name,attributes={})=>{
    const node=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,String(value)));
    return node;
  };
  const point=(row,column)=>({x:380+(2*column-row)*46,y:120+row*70});
  const scaledPoint=(pointValue,scale)=>({x:380+(pointValue.x-380)*scale,y:pointValue.y});
  const pageBase=side=>side==='LEFT'
    ? [{x:380,y:100},{x:270,y:150},{x:220,y:280},{x:285,y:420},{x:380,y:455}]
    : [{x:380,y:100},{x:490,y:150},{x:540,y:280},{x:475,y:420},{x:380,y:455}];
  const pageScale=(state,side)=>{
    if(state.page==='RL'&&side==='RIGHT')return -1;
    if(state.page==='LR'&&side==='LEFT')return -1;
    return 1;
  };
  const pageGeometry=(state,side)=>pageBase(side).map(value=>scaledPoint(value,pageScale(state,side)));
  const pathString=points=>points.map(value=>`${value.x},${value.y}`).join(' ');

  const createHost=()=>{
    const anchor=document.querySelector('#pascalJointLoop .pjl-frequency')||document.getElementById('pascalJointLoop');
    if(!anchor)return null;
    const section=document.createElement('section');
    section.id='pascalJointBookFold';
    section.className='pjbf';
    section.setAttribute('aria-labelledby','pjbfTitle');
    section.innerHTML=`<header class="pjbf-head"><div><span class="eyebrow">OPEN BOOK · DUAL PENTAGON · RGB COUNTERFOLD</span><h4 id="pjbfTitle">Three T₃ Pascal fields → two pages → one spine → exact RL/LR return</h4><p>The fifteen-node T₅ carrier is read as three overlapping six-node Pascal subpyramids. Two pentagonal pages share the top-to-return spine while RGB phase and page geometry remain separate registers.</p></div><code data-pjbf-record>OPEN · φRGB=0 · 15 CARRIERS</code></header><div class="pjbf-grid"><div class="pjbf-stage"><svg viewBox="0 0 760 520" role="img" aria-labelledby="pjbfSvgTitle pjbfSvgDesc"><title id="pjbfSvgTitle">Pascal Joint dual-pentagon book-fold adapter</title><desc id="pjbfSvgDesc">Three overlapping six-node Pascal triangles form fifteen unique carrier nodes. Two pentagonal book pages share one spine. RL and LR fold the page geometry and advance inverse RGB display cycles.</desc><g data-pjbf-static></g><g data-pjbf-pages></g></svg><div class="pjbf-stage-caption"><b data-pjbf-readout="state">OPEN BOOK · HOME</b><span data-pjbf-readout="count">18 raw → 15 unique</span></div></div><aside class="pjbf-panel"><div class="pjbf-stats"><div><small>SUBPYRAMIDS</small><b>3 × T₃/6</b></div><div><small>UNIQUE CARRIER</small><b>15</b></div><div><small>PAGES / SPINE</small><b>2 / 1</b></div><div><small>ACTIVE FOLDS</small><b>RL ↔ LR</b></div></div><div class="pjbf-controls" role="group" aria-label="Book fold controls"><button type="button" data-pjbf-action="RL" aria-pressed="false">FOLD RL</button><button type="button" data-pjbf-action="LR" aria-pressed="false">FOLD LR</button><button type="button" data-pjbf-action="RETURN">RETURN</button><button type="button" data-pjbf-action="TOP" aria-pressed="false">+ OPERATOR</button></div><div class="pjbf-register"><small>PAGE / RGB REGISTERS</small><code data-pjbf-readout="page">PAGE OPEN · SPINE HELD</code><code data-pjbf-readout="rgb">RL: R→G→B · LR: B→G→R</code><code data-pjbf-readout="history">HISTORY · ∅</code></div><div class="pjbf-holds"><b>SAME-SIDE CONTROLS</b><button type="button" data-pjbf-hold="LL">LL HOLD</button><button type="button" data-pjbf-hold="RR">RR HOLD</button></div><div class="pjbf-count"><small>COUNT CONTRACT</small><b><code>3×6=18</code> raw</b><b><code>18−3=15</code> unique</b><b data-pjbf-readout="top-count"><code>+ operator</code> · still 15</b></div><p><b>Boundary:</b> Fold changes page-side geometry; RGB changes a separate three-channel display phase. “Spin” means an oriented finite permutation, not physical angular momentum. The adapter reuses the frozen Leaf Fold/Open Book sources and creates no Book, operator, Study, Finding, graph identity or relation.</p><div class="pjbf-links"><a href="../../../DRAFTS/A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#leaf-fold-tour">Leaf Fold ↗</a><a href="../../../DRAFTS/IOI_PRIME_OPEN_BOOK_COMPOSITION.html#letterSyllableLens">Open Book ↗</a><a href="../../../DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html">Common Start ↗</a></div></aside></div></section>`;
    anchor.insertAdjacentElement('afterend',section);
    return section;
  };

  const drawStatic=host=>{
    const layer=host.querySelector('[data-pjbf-static]');
    layer.replaceChildren();
    const triangles=[
      [point(0,0),point(2,0),point(2,2)],
      [point(2,0),point(4,0),point(4,2)],
      [point(2,2),point(4,2),point(4,4)]
    ];
    triangles.forEach((points,index)=>layer.append(svgEl('polygon',{points:pathString(points),class:`pjbf-t3 t${index+1}`})));
    for(let row=0;row<5;row+=1){
      for(let column=0;column<=row;column+=1){
        const current=point(row,column);
        if(row<4){
          [point(row+1,column),point(row+1,column+1)].forEach(next=>layer.append(svgEl('line',{x1:current.x,y1:current.y,x2:next.x,y2:next.y,class:'pjbf-pascal-link'})));
        }
        layer.append(svgEl('circle',{cx:current.x,cy:current.y,r:5,class:'pjbf-pascal-node'}));
      }
    }
    layer.append(svgEl('line',{x1:380,y1:66,x2:380,y2:100,class:'pjbf-source-line'}));
  };

  const render= (host,state)=>{
    const layer=host.querySelector('[data-pjbf-pages]');
    layer.replaceChildren();
    const orders={LEFT:channelOrder('RL',state.phase),RIGHT:channelOrder('LR',state.phase)};
    ['LEFT','RIGHT'].forEach(side=>{
      const points=pageGeometry(state,side);
      const active=(state.page==='LR'&&side==='LEFT')||(state.page==='RL'&&side==='RIGHT');
      layer.append(svgEl('polygon',{points:pathString(points),class:`pjbf-page ${side.toLowerCase()}${active?' is-active':''}`}));
      layer.append(svgEl('polyline',{points:pathString(points.slice(0,5)),class:`pjbf-page-route ${side.toLowerCase()}`}));
      [1,2,3].forEach((pointIndex,index)=>{
        const location=points[pointIndex],channel=orders[side][index];
        layer.append(svgEl('circle',{cx:location.x,cy:location.y,r:13,class:`pjbf-channel is-${channel.toLowerCase()}`}));
        const label=svgEl('text',{x:location.x,y:location.y+4,class:'pjbf-channel-label'});label.textContent=channel;layer.append(label);
      });
    });
    layer.append(svgEl('line',{x1:380,y1:100,x2:380,y2:455,class:'pjbf-spine'}));
    const top=svgEl('text',{x:380,y:57,class:`pjbf-top ${state.topMode.toLowerCase()}`});top.textContent=state.topMode==='WITNESS'?'+1':'+';layer.append(top);
    const topLabel=svgEl('text',{x:380,y:82,class:'pjbf-top-label'});topLabel.textContent=state.topMode==='WITNESS'?'WITNESS NODE':'SOURCE OPERATOR';layer.append(topLabel);
    const returnLabel=svgEl('text',{x:380,y:484,class:'pjbf-return-label'});returnLabel.textContent='COMMON RETURN';layer.append(returnLabel);
    const home=isHome(state);
    host.querySelector('[data-pjbf-readout="state"]').textContent=`${state.page} BOOK · ${home?'HOME':'ACTIVE'}`;
    host.querySelector('[data-pjbf-readout="count"]').textContent=`18 raw → 15 unique${state.topMode==='WITNESS'?' → 16 with witness':''}`;
    host.querySelector('[data-pjbf-readout="page"]').textContent=`PAGE ${state.page} · SPINE HELD`;
    host.querySelector('[data-pjbf-readout="rgb"]').textContent=`φRGB=${state.phase} · RL: ${orders.LEFT.join('→')} · LR: ${orders.RIGHT.join('→')}`;
    host.querySelector('[data-pjbf-readout="history"]').textContent=`HISTORY · ${state.history.length?state.history.join(' · '):'∅'}`;
    host.querySelector('[data-pjbf-readout="top-count"]').innerHTML=state.topMode==='WITNESS'?'<code>15+1=16</code> · witness counted':'<code>+ operator</code> · still 15';
    host.querySelector('[data-pjbf-action="TOP"]').textContent=state.topMode==='WITNESS'?'+1 WITNESS':'+ OPERATOR';
    host.querySelector('[data-pjbf-action="TOP"]').setAttribute('aria-pressed',String(state.topMode==='WITNESS'));
    host.querySelectorAll('[data-pjbf-action="RL"],[data-pjbf-action="LR"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjbfAction===state.page)));
    host.querySelector('[data-pjbf-record]').textContent=`${state.page} · φRGB=${state.phase} · ${carrierCount(state)} CARRIERS · ${home?'EXACT HOME':'RESIDUAL'}`;
  };

  const mount=()=>{
    const host=document.getElementById('pascalJointBookFold')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    let state=createState();
    drawStatic(host);
    host.querySelectorAll('[data-pjbf-action="RL"],[data-pjbf-action="LR"]').forEach(button=>button.addEventListener('click',()=>{state=applyFold(state,button.dataset.pjbfAction);render(host,state);}));
    host.querySelector('[data-pjbf-action="RETURN"]').addEventListener('click',()=>{state=returnHome();render(host,state);});
    host.querySelector('[data-pjbf-action="TOP"]').addEventListener('click',()=>{state=toggleTop(state);render(host,state);});
    host.querySelectorAll('[data-pjbf-hold]').forEach(button=>button.addEventListener('click',()=>{state=applyHold(state,button.dataset.pjbfHold);render(host,state);}));
    render(host,state);
  };

  return {CHANNELS,FOLD_DIRECTIONS,HOLD_STATES,TOP_MODES,T3_NODE_COUNT,T5_NODE_COUNT,RAW_T3_COUNT,SHARED_JOINT_COUNT,mod,foldSign,rotateOrder,channelOrder,createState,applyFold,applyHold,toggleTop,returnHome,isHome,carrierCount,bookContract,pageGeometry,createHost,mount};
});
