(() => {
  const bridge = document.querySelector('#alpha-rath-bridge');
  if (!bridge) return;

  const routes = {
    direct: ['Alpha', 'Rath'],
    cathedral: ['Alpha', 'Cathedral', 'Rath']
  };
  const labels = {direct: 'AH', cathedral: 'TB / TßR'};
  const outboundButtons = [...bridge.querySelectorAll('[data-rath-out]')];
  const returnButtons = [...bridge.querySelectorAll('[data-rath-back]')];
  const arrival = bridge.querySelector('[data-rath-arrival]');
  const result = bridge.querySelector('[data-rath-result]');
  let outbound = null;
  let returnChoice = null;

  function render() {
    for (const button of outboundButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.rathOut === outbound));
    }
    for (const button of returnButtons) {
      button.disabled = outbound === null;
      button.setAttribute('aria-pressed', String(button.dataset.rathBack === returnChoice));
    }

    if (outbound === null) {
      arrival.textContent = 'Wähle den Hinweg. Hier erscheint die Kantenfolge der Ankunft.';
      result.textContent = 'Der Rückweg wird am Lesepunkt verfügbar.';
      return;
    }

    const outward = routes[outbound];
    const edgeCount = outward.length - 1;
    arrival.textContent = `Rath (7×7) erreicht über ${labels[outbound]} · ${outward.join(' → ')} · ${edgeCount === 1 ? '1 Kante' : '2 Kanten'}`;
    if (returnChoice === null) {
      result.textContent = 'Wähle in Rath den Rückweg.';
      return;
    }

    const opposite = outbound === 'direct' ? 'cathedral' : 'direct';
    const backRoute = returnChoice === 'same' ? outbound : opposite;
    const backward = [...routes[backRoute]].reverse();
    const journey = [...outward, ...backward.slice(1)];
    const reading = returnChoice === 'same' ? 'Gleiche Kanten in umgekehrter Folge' : 'Alle drei Kanten des Dreiecks';
    result.textContent = `Rückweg über ${labels[backRoute]} · ${backward.join(' → ')}. ${reading}. Gesamtweg: ${journey.join(' → ')}.`;
  }

  for (const button of outboundButtons) {
    button.addEventListener('click', () => {
      outbound = button.dataset.rathOut;
      returnChoice = null;
      render();
    });
  }
  for (const button of returnButtons) {
    button.addEventListener('click', () => {
      returnChoice = button.dataset.rathBack;
      render();
    });
  }
  bridge.querySelector('[data-rath-reset]').addEventListener('click', () => {
    outbound = null;
    returnChoice = null;
    render();
  });
  render();
})();
