(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0BluePinkDodecaCellReturn=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SATELLITE_COUNT=4;
  const FACES_PER_DODECA=12;
  const BODY_CELL_COUNT=SATELLITE_COUNT*FACES_PER_DODECA;
  const RETURN_CELL_COUNT=FACES_PER_DODECA;
  const TOTAL_CELL_COUNT=BODY_CELL_COUNT+RETURN_CELL_COUNT;
  const SHADOW_COUNT=SATELLITE_COUNT;
  const BODY_DEFS=[
    {id:'BLUE-01',side:'BLUE',observer:-1,role:'DAY_VIEW',offset:[-.72,-.28]},
    {id:'BLUE-02',side:'BLUE',observer:-1,role:'DAY_VIEW',offset:[-.46,.42]},
    {id:'PINK-01',side:'PINK',observer:1,role:'NIGHT_VIEW',offset:[.72,-.28]},
    {id:'PINK-02',side:'PINK',observer:1,role:'NIGHT_VIEW',offset:[.46,.42]}
  ];
  function buildLedger(){
    const bodies=BODY_DEFS.map((body,bodyIndex)=>({...body,faces:Array.from({length:FACES_PER_DODECA},(_,faceIndex)=>({
      cell_index:bodyIndex*FACES_PER_DODECA+faceIndex,
      cell_id:`${body.id}:F${String(faceIndex+1).padStart(2,'0')}`,
      layer:'BODY'
    }))}));
    const returnBody={id:'RETURN-00',side:'CENTER',observer:0,role:'RETURN_PIVOT',faces:Array.from({length:FACES_PER_DODECA},(_,faceIndex)=>({
      cell_index:BODY_CELL_COUNT+faceIndex,
      cell_id:`RETURN-00:F${String(faceIndex+1).padStart(2,'0')}`,
      layer:'RETURN'
    }))};
    return {bodies,returnBody,counts:{satellite_dodecahedra:SATELLITE_COUNT,faces_per_dodecahedron:FACES_PER_DODECA,body_cells:BODY_CELL_COUNT,return_cells:RETURN_CELL_COUNT,total_cells:TOTAL_CELL_COUNT}};
  }
  function cellAt(index){const ledger=buildLedger();if(!Number.isInteger(index)||index<0||index>=TOTAL_CELL_COUNT)return null;return index<BODY_CELL_COUNT?ledger.bodies[Math.floor(index/FACES_PER_DODECA)].faces[index%FACES_PER_DODECA]:ledger.returnBody.faces[index-BODY_CELL_COUNT];}
  function buildShadowLayer(){return BODY_DEFS.map((body,index)=>({shadow_id:`SHADOW-${String(index+1).padStart(2,'0')}`,source_body_id:body.id,role:'PROJECTED_VIEW_RESIDUAL',identity_effect:'NONE'}));}
  function validate(){const ledger=buildLedger(),bodyCells=ledger.bodies.flatMap(body=>body.faces);return {
    satelliteDodecahedra:ledger.bodies.length,
    facesPerDodecahedron:FACES_PER_DODECA,
    bodyCells:bodyCells.length,
    returnCells:ledger.returnBody.faces.length,
    totalCells:bodyCells.length+ledger.returnBody.faces.length,
    uniqueCells:new Set([...bodyCells,...ledger.returnBody.faces].map(cell=>cell.cell_id)).size,
    bilateral:ledger.bodies.filter(body=>body.side==='BLUE').length===2&&ledger.bodies.filter(body=>body.side==='PINK').length===2,
    shadowCount:buildShadowLayer().length,
    shadowSourcesUnique:new Set(buildShadowLayer().map(shadow=>shadow.source_body_id)).size===SHADOW_COUNT,
    exactLedger:SATELLITE_COUNT*FACES_PER_DODECA+RETURN_CELL_COUNT===TOTAL_CELL_COUNT
  };}
  return {SATELLITE_COUNT,FACES_PER_DODECA,BODY_CELL_COUNT,RETURN_CELL_COUNT,TOTAL_CELL_COUNT,SHADOW_COUNT,BODY_DEFS,buildLedger,buildShadowLayer,cellAt,validate};
});
