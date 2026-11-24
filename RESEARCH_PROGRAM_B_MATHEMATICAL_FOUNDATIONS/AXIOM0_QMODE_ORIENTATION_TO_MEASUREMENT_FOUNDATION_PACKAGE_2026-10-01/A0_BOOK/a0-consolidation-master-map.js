(function(){
  "use strict";
  const root=document.getElementById("a0ConsolidationMasterMap");
  if(!root)return;
  const setPressed=(buttons,active)=>buttons.forEach(button=>button.setAttribute("aria-pressed",String(button===active)));
  const claimButtons=[...root.querySelectorAll("[data-amm-claim-filter]")];
  const cards=[...root.querySelectorAll("[data-amm-claims]")];
  const rows=[...root.querySelectorAll("[data-amm-claim-row]")];
  const count=root.querySelector("[data-amm-route-count]");
  const filterClaims=button=>{
    const filter=button.dataset.ammClaimFilter;
    setPressed(claimButtons,button);
    cards.forEach(card=>card.hidden=filter!=="all"&&!card.dataset.ammClaims.split(" ").includes(filter));
    rows.forEach(row=>row.hidden=filter!=="all"&&row.dataset.ammClaimRow!==filter);
    const visible=cards.filter(card=>!card.hidden).length;
    if(count)count.textContent=`${visible} / ${cards.length} SICHTBAR`;
  };
  claimButtons.forEach(button=>button.addEventListener("click",()=>filterClaims(button)));
  const assetButtons=[...root.querySelectorAll("[data-amm-asset-filter]")];
  const assets=[...root.querySelectorAll("[data-amm-asset-role]")];
  const assetCount=root.querySelector("[data-amm-asset-count]");
  assetButtons.forEach(button=>button.addEventListener("click",()=>{
    const filter=button.dataset.ammAssetFilter;
    setPressed(assetButtons,button);
    assets.forEach(asset=>asset.hidden=filter!=="all"&&!asset.dataset.ammAssetRole.split(" ").includes(filter));
    const visible=assets.filter(asset=>!asset.hidden).length;
    if(assetCount)assetCount.textContent=`${visible} / ${assets.length} SICHTBAR`;
  }));
  filterClaims(claimButtons[0]);
})();
