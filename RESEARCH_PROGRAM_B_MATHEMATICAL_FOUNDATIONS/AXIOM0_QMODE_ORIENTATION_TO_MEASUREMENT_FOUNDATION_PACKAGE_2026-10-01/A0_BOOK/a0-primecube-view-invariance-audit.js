(function(){
  'use strict';
  const M=window.A0PrimecubeModel;
  document.querySelectorAll('[data-pc-view-invariance]').forEach(root=>{
    if(!M)return;
    let control='BASELINE',selected=null;
    const matrix=root.querySelector('[data-via-matrix]');
    const detail=root.querySelector('[data-via-detail]');
    const summary=root.querySelector('[data-via-summary]');
    const status=root.querySelector('[data-via-status]');
    const render=()=>{
      const record=M.viewInvarianceAuditRecord(control);
      status.textContent=`${record.control.label.toUpperCase()} · ${record.observedBreaks}/${record.control.expectedBreaks} EXPECTED BREAKS · ${record.controlPass?'PASS':'FAIL'}`;
      summary.innerHTML=['RETAINED','LOST','ADDED','UNRESOLVED'].map(key=>`<span class="via-${key.toLowerCase()}"><b>${record.counts[key]}</b>${key}</span>`).join('');
      const header=`<div class="via-corner">OBSERVABLE ↓ / VIEW →</div>${record.views.map(view=>`<div class="via-view" title="${view.label}">${view.id}</div>`).join('')}`;
      const rows=record.observables.map(observable=>{
        const cells=record.views.map(view=>{
          const cell=record.matrix.find(item=>item.view===view.id&&item.observable===observable.id);
          return `<button type="button" class="via-cell via-${cell.outcome.toLowerCase()}" data-view="${view.id}" data-observable="${observable.id}" title="${cell.note}">${cell.outcome[0]}</button>`;
        }).join('');
        return `<div class="via-observable"><b>${observable.label}</b><small>${observable.value}</small></div>${cells}`;
      }).join('');
      matrix.innerHTML=header+rows;
      matrix.style.setProperty('--via-cols',record.views.length);
      matrix.querySelectorAll('.via-cell').forEach(button=>button.addEventListener('click',()=>{
        selected={view:button.dataset.view,observable:button.dataset.observable};
        renderDetail(record);
      }));
      if(!selected)selected={view:'AM',observable:'CARRIER_ID'};
      renderDetail(record);
    };
    const renderDetail=record=>{
      const view=record.views.find(item=>item.id===selected.view);
      const observable=record.observables.find(item=>item.id===selected.observable);
      const cell=record.matrix.find(item=>item.view===selected.view&&item.observable===selected.observable);
      detail.innerHTML=`<div class="pc-eyebrow">Selected comparison cell</div><h3>${observable.label} × ${view.id}</h3><strong class="via-pill via-${cell.outcome.toLowerCase()}">${cell.outcome}</strong><dl><dt>VIEW</dt><dd>${view.label}</dd><dt>VALUE</dt><dd>${observable.value}</dd><dt>READING</dt><dd>${cell.note}</dd><dt>CONTROL</dt><dd>${record.control.target}</dd></dl><p>${record.boundary}</p>`;
    };
    root.querySelectorAll('[data-via-control]').forEach(button=>button.addEventListener('click',()=>{
      control=button.dataset.viaControl;selected=null;
      root.querySelectorAll('[data-via-control]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      render();
    }));
    render();
  });
})();
