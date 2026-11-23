(function(){
  'use strict';
  const M=window.A0PrimecubeModel;
  if(!M)return;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const point={1:[150,105],8:[380,105],11:[610,105],33:[150,395],27:[380,395],22:[610,395]};
  const sailColors=['#4fd1c5','#ae50ef','#f2c84b','#48a8f7'];
  function boot(){
    const root=document.querySelector('[data-pc-loki]');
    if(!root)return;
    const record=M.buildDataset().lokiChassis,stage=root.querySelector('[data-pc-loki-stage]'),detail=root.querySelector('[data-pc-loki-detail]'),buttons=[...root.querySelectorAll('[data-pc-loki-insert]')];
    let selected=record.qctrl.defaultInsert;
    function xy(n){return point[n].join(',')}
    function renderStage(){
      const selectedIndex=record.inserts.findIndex(item=>item.id===selected);
      const sails=record.topology.sails.map((item,index)=>`<polygon points="${item.roots.map(xy).join(' ')}" fill="${sailColors[index]}" fill-opacity="${index===selectedIndex?'.28':'.11'}" stroke="${sailColors[index]}" stroke-opacity="${index===selectedIndex?'1':'.48'}" stroke-width="${index===selectedIndex?'3':'1.5'}"/>`).join('');
      const edges=[...record.topology.gridEdges,...record.topology.diagonals].map(item=>`<line x1="${point[item.a][0]}" y1="${point[item.a][1]}" x2="${point[item.b][0]}" y2="${point[item.b][1]}" stroke="${item.role.includes('SPLINTER')?'#7887a0':'#596b83'}" stroke-width="${item.role==='CENTRAL_RUNG'?'4':'2'}" ${item.role.includes('SPLINTER')?'stroke-dasharray="8 7"':''}/>`).join('');
      const nodes=record.anchors.map(item=>{const [x,y]=point[item.root],color=item.colorRole==='GOLD'?'#f2c84b':'#43d39e';return `<g><circle cx="${x}" cy="${y}" r="15" fill="#09111d" stroke="${color}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="5" fill="${color}"/><text class="pc-loki-svg-label" x="${x}" y="${y-27}" text-anchor="middle">√${item.n} = ${item.root}</text><text class="pc-loki-svg-sub" x="${x}" y="${y+34}" text-anchor="middle">${item.register.replaceAll('_',' ')}</text></g>`}).join('');
      stage.innerHTML=`<svg viewBox="0 0 760 520" role="img" aria-label="Splinter Sail Grid mit sechs Root-Ankern, C6-Rand und vier triangulierten Segeln"><text class="pc-loki-svg-role" x="28" y="34">ROOT CHASSIS · SAME SIX ANCHORS · QCTRL INSERT ${selected}</text><text class="pc-loki-svg-role" x="732" y="34" text-anchor="end">C₆ ≠ REGULAR HEXAGON · SCREEN TRIANGULATION</text>${sails}${edges}<path d="M150 105 L380 105 L610 105 L610 395 L380 395 L150 395 Z" fill="none" stroke="#f2c84b" stroke-width="3" stroke-dasharray="10 8"/>${nodes}<g><circle cx="380" cy="250" r="25" fill="#101a28" stroke="#f5f7fa" stroke-width="2"/><text class="pc-loki-svg-label" x="380" y="247" text-anchor="middle">17</text><text class="pc-loki-svg-sub" x="380" y="264" text-anchor="middle">ROOT MEAN</text></g><text class="pc-loki-svg-role" x="380" y="493" text-anchor="middle">1 → 8 → 11 → 22 → 27 → 33 → 1 · FOUR SAILS · CENTRAL RUNG 8↔27</text></svg>`;
    }
    function renderDetail(){
      const item=record.inserts.find(candidate=>candidate.id===selected),inside=item.carrierStatus==='INSIDE_1111';
      detail.innerHTML=`<div class="pc-eyebrow">QCTRL · INSERT ${esc(item.id)} / 4</div><h3>${esc(item.label)}</h3><span class="pc-loki-status ${inside?'':'is-out'}">${inside?'INSIDE CARRIER':'OUTSIDE 1111'}</span><code class="pc-loki-equation">${esc(item.equation)}</code><dl><dt>Value</dt><dd>${esc(item.value)}</dd><dt>Factors</dt><dd>${esc(item.factorization)}</dd><dt>Role</dt><dd>${esc(item.role.replaceAll('_',' '))}</dd>${inside?`<dt>Base 11 n</dt><dd>${esc(item.base11)}₁₁</dd><dt>Address n−1</dt><dd>${esc(item.addressBase11)}₁₁</dd><dt>Cube</dt><dd>[${item.cube.x}, ${item.cube.y}, ${item.cube.z}]</dd>`:''}<dt>Return</dt><dd>${esc(record.return.replaceAll('_',' '))}</dd></dl><p class="pc-detail-boundary"><b>QCTRL:</b> wählt nur Einschub und Hervorhebung. Chassis, Root-Anker und Source-Records bleiben unverändert.</p>`;
    }
    function select(id){selected=id;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcLokiInsert===id)));renderStage();renderDetail()}
    buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.pcLokiInsert)));
    select(selected);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
