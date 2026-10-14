(function renderLifeOrbitCandidate() {
  "use strict";
  const record = window.NEXAH_LIFE_ORBIT_ROUTE;
  const candidate = record.candidate;
  const $ = (id) => document.getElementById(id);
  $("candidate-status").textContent = record.status.replaceAll("_", " ");
  $("result-status").textContent = candidate.result.replaceAll("_", " ");
  $("family-count").textContent = String(candidate.family_route.length);
  $("relation-count").textContent = String(candidate.relations.length);
  $("route-spine").replaceChildren(...candidate.family_route.map((step, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${step.family_id.replace("CF:", "")}</span><strong>${step.role}</strong>`;
    item.style.setProperty("--delay", `${index * 70}ms`);
    return item;
  }));
  $("relation-cards").replaceChildren(...candidate.relations.map((relation) => {
    const article = document.createElement("article");
    article.innerHTML = `<div><span>${relation.relation_type}</span><b>${relation.status}</b></div><h3>${relation.relation_id.replace("CAND:REL:", "").replaceAll("_", " ")}</h3><p>${relation.explanation}</p><small>Does not imply: ${relation.does_not_imply.join(" · ")}</small>`;
    return article;
  }));
  $("claim-ceiling").textContent = candidate.claim_ceiling;
  if (location.hash !== candidate.route) history.replaceState(null, "", candidate.route);
}());
