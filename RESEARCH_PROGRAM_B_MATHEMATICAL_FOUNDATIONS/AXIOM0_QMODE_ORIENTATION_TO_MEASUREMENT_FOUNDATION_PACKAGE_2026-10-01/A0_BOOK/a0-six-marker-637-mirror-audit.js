(function(root,factory){
  const api=factory(
    typeof module==='object'&&module.exports?require('./a0-six-marker-grid-views.js'):root.A0SixMarkerGridViews
  );
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0SixMarker637MirrorAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(SixMarker){
  'use strict';
  if(!SixMarker)throw new Error('A0_637_MIRROR_AUDIT_SOURCE_REQUIRED');

  const SCHEMA='a0.six-marker-637-mirror-audit/1.1.0';
  const CENTER=637;
  const NUMERIC_SUM=2*CENTER;
  const MODULUS=37;
  const MARKERS=Object.freeze([...SixMarker.data.markers]);
  const LAYERS=Object.freeze(['slot','numeric','residue']);

  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function normalize(value,modulus){return((value%modulus)+modulus)%modulus}
  function numericMirror(n){return NUMERIC_SUM-n}
  function residueNegation(n){return normalize(-normalize(n,MODULUS),MODULUS)}
  function slotMirrorIndex(index){return SixMarker.slot(index,true)}
  function markerIndex(marker){return MARKERS.indexOf(Number(marker))}
  function slotMirrorMarker(marker){
    const index=markerIndex(marker);
    ensure(index>=0,'MIRROR_AUDIT_MARKER_UNKNOWN');
    return MARKERS[slotMirrorIndex(index)];
  }
  function inspect(marker){
    const value=Number(marker);
    const index=markerIndex(value);
    ensure(index>=0,'MIRROR_AUDIT_MARKER_UNKNOWN');
    const residue=normalize(value,MODULUS);
    const slotImage=slotMirrorMarker(value);
    const numericImage=numericMirror(value);
    const residueImage=residueNegation(value);
    return{
      marker:value,
      slot:{input:index,output:slotMirrorIndex(index),marker:slotImage,fixed:slotImage===value},
      numeric:{input:value,output:numericImage,fixed:numericImage===value,inside_marker_set:MARKERS.includes(numericImage)},
      residue:{input:residue,output:residueImage,fixed:residueImage===residue,pair:[residue,residueImage]},
      coincidences:{
        slot_and_numeric:slotImage===numericImage,
        same_marker_after_slot:slotImage===value,
        same_number_after_numeric:numericImage===value,
        same_residue_after_negation:residueImage===residue
      }
    };
  }
  function buildReceipt(){
    const rows=MARKERS.map(inspect);
    return validate({
      schema:SCHEMA,
      status:'PASS_BOUNDED_OPERATOR_COMPARISON',
      source:'A0_NUMBERMAGICK_GRID_RESEARCH.html#six-marker-comparison',
      carrier:{markers:MARKERS,selected_center:CENTER},
      operators:{
        slot:{symbol:'J6',definition:'J6(i)=-i mod 6',namespace:'SLOT_INDEX',involution:true},
        numeric:{symbol:'R637',definition:'R637(n)=1274-n',namespace:'INTEGER_VALUE',involution:true,fixed_point:CENTER},
        residue:{symbol:'N37',definition:'N37(r)=-r mod 37',namespace:'RESIDUE_CLASS_Z37',involution:true,fixed_point:0,selected_pair:[18,19]}
      },
      rows,
      exact_overlap:{
        slot_numeric_markers:rows.filter(row=>row.coincidences.slot_and_numeric).map(row=>row.marker),
        all_three_fixed_markers:rows.filter(row=>row.slot.fixed&&row.numeric.fixed&&row.residue.fixed).map(row=>row.marker),
        mod37_pair_18_19:{witness_marker:537,residue:normalize(537,MODULUS),image:residueNegation(537)}
      },
      boundary:{
        ij_half_seam_identity:false,
        score_mirror_identity:false,
        statement:'J6 acts on six display slots; R637 acts on integer values; N37 acts on residue classes. Equal readouts do not merge these namespaces.'
      },
      authority:{
        identity_reuse:['MOD:NUMBER_VIEW_SUITE','NN:CRT_QRT_37_CARRIER_LADDER'],
        new_canonical_ids:[],relation_changes:[],aliases:[],study_activation:false,
        claim_boundary:'Finite arithmetic and operator comparison only; no new Mod-37 identity, seam identity, graph relation or scientific claim.'
      }
    });
  }
  function validate(record){
    ensure(record?.schema===SCHEMA,'MIRROR_AUDIT_SCHEMA_INVALID');
    ensure(record.status==='PASS_BOUNDED_OPERATOR_COMPARISON','MIRROR_AUDIT_STATUS_INVALID');
    ensure(record.operators.slot.namespace==='SLOT_INDEX','MIRROR_AUDIT_SLOT_NAMESPACE_INVALID');
    ensure(record.operators.numeric.namespace==='INTEGER_VALUE','MIRROR_AUDIT_NUMERIC_NAMESPACE_INVALID');
    ensure(record.operators.residue.namespace==='RESIDUE_CLASS_Z37','MIRROR_AUDIT_RESIDUE_NAMESPACE_INVALID');
    ensure(record.rows.length===6&&record.rows.every(row=>slotMirrorMarker(row.slot.marker)===row.marker),'MIRROR_AUDIT_SLOT_INVOLUTION_INVALID');
    ensure(record.rows.every(row=>numericMirror(row.numeric.output)===row.marker),'MIRROR_AUDIT_NUMERIC_INVOLUTION_INVALID');
    ensure(record.rows.every(row=>residueNegation(row.residue.output)===row.residue.input),'MIRROR_AUDIT_RESIDUE_INVOLUTION_INVALID');
    ensure(record.exact_overlap.slot_numeric_markers.join(',')==='337,537,637,737,937','MIRROR_AUDIT_OVERLAP_INVALID');
    ensure(record.exact_overlap.all_three_fixed_markers.length===0,'MIRROR_AUDIT_FALSE_COMMON_FIX');
    ensure(record.exact_overlap.mod37_pair_18_19.residue===19&&record.exact_overlap.mod37_pair_18_19.image===18,'MIRROR_AUDIT_MOD37_PAIR_INVALID');
    ensure(record.boundary.ij_half_seam_identity===false&&record.boundary.score_mirror_identity===false,'MIRROR_AUDIT_BOUNDARY_INVALID');
    ensure(record.authority.new_canonical_ids.length===0&&record.authority.relation_changes.length===0&&record.authority.aliases.length===0&&!record.authority.study_activation,'MIRROR_AUDIT_AUTHORITY_INVALID');
    return record;
  }

  function mount(host){
    if(!host)return null;
    const receipt=buildReceipt();
    const carrierHost=host.closest('#six-marker-comparison');
    let selected=537;
    const active=new Set(LAYERS);
    const q=selector=>host.querySelector(selector);
    const qa=selector=>[...host.querySelectorAll(selector)];
    function operatorText(layer,row){
      if(layer==='slot')return`Slot ${row.slot.input} → ${row.slot.output} · Marker ${row.marker} → ${row.slot.marker}`;
      if(layer==='numeric')return`${row.numeric.input} → ${row.numeric.output}${row.numeric.inside_marker_set?' · im Sechser-Set':' · außerhalb des Sechser-Sets'}`;
      return`${row.residue.input} → ${row.residue.output} in ℤ₃₇`;
    }
    function verdict(row){
      const enabled=[...active];
      if(!enabled.length)return'Keine Ebene aktiv — der Quellmarker bleibt unverändert.';
      const notes=[];
      if(active.has('slot')&&active.has('numeric'))notes.push(row.coincidences.slot_and_numeric?'J₆ und R₆₃₇ landen hier auf derselben Zahl.':'J₆ und R₆₃₇ landen hier auf verschiedenen Zahlen.');
      if(active.has('residue'))notes.push(row.residue.input===19?'537 trifft die ausgewählte Z37-Gegenklasse 19↔18.':`Die Z37-Gegenklasse lautet ${row.residue.input}↔${row.residue.output}.`);
      notes.push('Die Operator-Typen bleiben getrennt.');
      return notes.join(' ');
    }
    function render(){
      const row=inspect(selected);
      qa('[data-audit-marker]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.auditMarker)===selected)));
      qa('[data-audit-layer]').forEach(button=>{
        const layer=button.dataset.auditLayer;
        button.setAttribute('aria-pressed',String(active.has(layer)));
        const lane=q(`[data-audit-lane="${layer}"]`);
        if(lane){lane.hidden=!active.has(layer);q(`[data-audit-output="${layer}"]`).textContent=operatorText(layer,row)}
      });
      q('[data-audit-selected]').textContent=String(selected);
      q('[data-audit-verdict]').textContent=verdict(row);
      q('[data-audit-slot-pairs]').textContent=receipt.rows.map(item=>`${item.marker}↔${item.slot.marker}`).join(' · ');
      q('[data-audit-numeric-pairs]').textContent='337↔937 · 537↔737 · 637 fest · 237↔1037 (außen)';
      q('[data-audit-residue-pair]').textContent=`${row.residue.input}↔${row.residue.output} · Fixpunkt 0`;
    }
    host.addEventListener('click',event=>{
      const markerButton=event.target.closest('[data-audit-marker]');
      if(markerButton){selected=Number(markerButton.dataset.auditMarker);render();return}
      const layerButton=event.target.closest('[data-audit-layer]');
      if(layerButton){const layer=layerButton.dataset.auditLayer;active.has(layer)?active.delete(layer):active.add(layer);render()}
    });
    carrierHost?.addEventListener('click',event=>{
      const source=event.target.closest('[data-grid-marker]');
      if(!source||host.contains(source))return;
      selected=Number(source.dataset.gridMarker);
      render();
    });
    render();
    return{receipt,inspect,select(marker){selected=Number(marker);render()},get state(){return{selected,layers:[...active]}}};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-six-marker-637-audit]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}

  return{SCHEMA,CENTER,NUMERIC_SUM,MODULUS,MARKERS,LAYERS,normalize,numericMirror,residueNegation,slotMirrorIndex,slotMirrorMarker,inspect,buildReceipt,validate,mount,mountAll};
});
