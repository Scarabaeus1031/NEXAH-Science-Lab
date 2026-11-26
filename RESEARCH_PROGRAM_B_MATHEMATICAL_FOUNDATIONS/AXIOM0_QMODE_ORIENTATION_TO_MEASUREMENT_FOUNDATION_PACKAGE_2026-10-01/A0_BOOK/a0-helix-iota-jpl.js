(() => {
  "use strict";

  const hours = 8760;
  const pairs = 12;
  const phaseCount = hours / pairs;
  const baseStart = phaseCount / 2;
  const dShift = 96;
  const lags = [0,12,24,36];
  const modulo = (hour) => (hour + hours) % hours;

  function deriveCrossings(ephemeris) {
    const [io, europa, ganymed] = ephemeris.satellites.map(({longitudes}) => longitudes);
    const crossings = [];
    let previous;
    for (let hour = 0; hour <= hours; hour++) {
      const angle = ((io[hour] - 3 * europa[hour] + 2 * ganymed[hour]) % 360 + 360) % 360;
      const deviation = angle - 180;
      if (!Number.isFinite(deviation) || deviation === 0) {
        throw new Error("Der Stundenwert lässt sich der 180°-Linie nicht eindeutig zuordnen.");
      }
      if (hour && previous * deviation < 0) crossings.push([hour, Math.sign(deviation)]);
      previous = deviation;
    }
    return crossings;
  }

  function lowerBound(values, target) {
    let left = 0;
    let right = values.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (values[mid] < target) left = mid + 1;
      else right = mid;
    }
    return left;
  }

  function bracketEvents(marks, start, crossings) {
    const shifted = marks.map((mark) => modulo(mark + start)).sort((a,b) => a-b);
    const indices = crossings.map(([hour]) => lowerBound(shifted, hour));
    return indices.map((i, event) => ({
      left: shifted[i-1],
      right: shifted[i],
      // One strict crossing and two marks imply opposite sides at the endpoints.
      captured: i > 0 && i < shifted.length && i !== indices[event-1] && i !== indices[event+1]
    }));
  }

  function createComparison(crossings, primes) {
    const uniform = primes.map((_, i) => Math.round(i * hours / primes.length));
    const grids = [primes, uniform];
    const tables = grids.map((marks) => {
      const counts = new Uint8Array(hours);
      const known = new Uint8Array(hours);
      return (start) => {
        if (!known[start]) {
          counts[start] = bracketEvents(marks, start, crossings).filter((row) => row.captured).length;
          known[start] = 1;
        }
        return counts[start];
      };
    });

    function startsFor(phase, pair) {
      return lags.map((lag) => modulo(baseStart + phaseCount * pair + dShift + phase + lag));
    }

    function compare(phase) {
      const rows = lags.map((lag) => ({lag, prime:0, uniform:0}));
      for (let pair = 0; pair < pairs; pair++) {
        startsFor(phase, pair).forEach((start, i) => {
          rows[i].prime += tables[0](start);
          rows[i].uniform += tables[1](start);
        });
      }
      const [base, plus12, plus24, plus36] = rows;
      for (const row of rows) {
        row.primeGain = row.prime - base.prime;
        row.adjusted = row.primeGain - (row.uniform - base.uniform);
      }
      const wins = plus24.adjusted > Math.max(plus12.adjusted, plus36.adjusted);
      const positive = plus24.primeGain > 0 && plus24.adjusted > 0;
      return {rows, wins, positive, tie:plus24.adjusted === Math.max(plus12.adjusted, plus36.adjusted)};
    }

    function inspect(phase, pair, event) {
      return startsFor(phase, pair).map((start,i) => ({
        start, lag:lags[i],
        brackets:grids.map((marks) => bracketEvents(marks, start, crossings)[event])
      }));
    }

    return {compare, inspect, startsFor};
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {createComparison, deriveCrossings, phaseCount};
    return;
  }

  const panel = document.getElementById("helix-iota-jpl");
  if (!panel) return;
  const find = (name) => panel.querySelector(`[data-iota-${name}]`);
  const year = find("year");
  const phase = find("phase");
  const base = find("base");
  const crossing = find("crossing");
  const unit = find("unit");
  const exampleYear = "2023";
  const examplePhase = 137;
  const examplePairs = {3:[5280,5301], 0:[5987,6010], 7:[5280,5301]};
  const pairButtons = [...panel.querySelectorAll("[data-iota-example-pair]")];
  const eventButtons = [...panel.querySelectorAll("[data-iota-example-event]")];
  const exact = new Intl.NumberFormat("de-DE", {maximumFractionDigits:7});
  const signed = new Intl.NumberFormat("de-DE", {maximumFractionDigits:3, signDisplay:"exceptZero"});
  const time = new Intl.DateTimeFormat("de-DE", {
    day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit", timeZone:"UTC"
  });
  const years = {
    2023: {crossings:globalThis.A0IotaJpl2023.crossings, strictPositive:36},
    2025: {crossings:deriveCrossings(globalThis.A0JupiterHorizons), strictPositive:161}
  };
  const primes = globalThis.A0PrimecubeModel.sieve(hours - 1);
  const models = new Map();
  const model = () => models.get(year.value);
  const selected = () => years[year.value];
  const phaseValue = () => Number(phase.value);
  const arrow = (direction) => direction > 0 ? "↑ aufwärts" : "↓ abwärts";
  const armLabel = (lag) => lag === 0 ? "D" : lag === 24 ? "+24 h · IOTA E" : `+${lag} h`;
  const crossingTime = (hour) => `${time.format(Date.UTC(Number(year.value),0,1,hour))} TDB`;

  function setRows(body, rows) {
    body.replaceChildren(...rows.map(({cells, primary}) => {
      const row = document.createElement("tr");
      if (primary) row.dataset.iotaPrimary = "";
      cells.forEach((value, i) => {
        const cell = document.createElement(i ? "td" : "th");
        if (!i) cell.scope = "row";
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    }));
  }

  function exampleIsActive() {
    return year.value === exampleYear && phaseValue() === examplePhase;
  }

  function selectExampleEvent(hour) {
    crossing.value = String(selected().crossings.findIndex(([referenceHour]) => referenceHour === hour));
  }

  function renderExample(hour) {
    const active = exampleIsActive();
    const matching = active ? examplePairs[base.value] : undefined;
    find("example").setAttribute("aria-pressed", String(active));
    find("example-slog").hidden = !active;
    find("example-events").hidden = !matching;
    if (!active) return;
    for (const button of pairButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.iotaExamplePair === base.value));
    }
    if (!matching) return;
    eventButtons.forEach((button, index) => {
      const referenceHour = matching[index];
      const [, direction] = selected().crossings.find(([h]) => h === referenceHour);
      button.textContent = `${arrow(direction)} · ${crossingTime(referenceHour)}`;
      button.setAttribute("aria-pressed", String(referenceHour === hour));
    });
  }

  function renderDetail() {
    const index = Number(crossing.value);
    const [hour, direction] = selected().crossings[index];
    renderExample(hour);
    find("event").textContent = `${arrow(direction)} · ${crossingTime(hour)} · Referenzstunde ${hour}`;
    setRows(find("slog"), model().inspect(phaseValue(),Number(base.value),index).map(({lag,start,brackets}) => ({
      primary:lag === 24,
      cells:[armLabel(lag),`${start} h`,...brackets.map(({left,right,captured}) =>
        left === undefined || right === undefined ? "Rand · verpasst" :
          `${left}–${right} h · ${captured ? "erfasst" : "verpasst"}`
      )]
    })));
  }

  function renderPhase() {
    const value = phaseValue();
    find("phase-label").textContent = `+${value} h`;
    const {rows,wins,positive,tie} = model().compare(value);
    const verdict = wins ? positive ? "+24 h schlägt beide Kontrollen und erfüllt die Gewinnbedingung." :
      "+24 h schlägt beide Kontrollen. Die ursprüngliche Gewinnbedingung ist nicht erfüllt." :
      tie ? "+24 h liegt gleichauf mit der besten Kontrolle." : "Eine Kontrolle schneidet besser ab als +24 h.";
    find("summary").textContent = `${year.value} · ${selected().crossings.length} Referenzwechsel · ${verdict}`;
    const baseline = rows[0];
    setRows(find("comparison"), rows.map(({lag,prime,uniform,adjusted}) => ({
      primary:lag === 24,
      cells:[armLabel(lag),lag ? `${baseline.prime} → ${prime}` : prime,
        lag ? `${baseline.uniform} → ${uniform}` : uniform,
        lag ? signed.format(adjusted / pairs) : "Referenz"]
    })));
    [...base.options].forEach((option, index) => {
      const starts = model().startsFor(value,index);
      option.textContent = `Paar ${index + 1} · D ${starts[0]} h → E ${starts[2]} h`;
    });
    renderDetail();
  }

  function renderScale() {
    const chance = selected().strictPositive / phaseCount;
    const gap = 5 / 365;
    const degrees = unit.value === "degrees";
    const scale = degrees ? 360 : 100;
    const suffix = degrees ? "°" : " %";
    find("original-values").textContent =
      `Erfolgsanteil ${exact.format(chance * 100)} % · IOTA-V-Gap ${exact.format(gap * 360)}°`;
    find("scale-values").textContent =
      `${year.value}: ${selected().strictPositive}/${phaseCount} Phasen = ${exact.format(chance * scale)}${suffix} · V-Gap: ${exact.format(gap * scale)}${suffix}`;
    find("success-bar").style.setProperty("--iota-width", `${chance * 100}%`);
    find("gap-bar").style.setProperty("--iota-width", `${gap * 100}%`);
  }

  function changeYear(examplePair) {
    const current = selected();
    if (!models.has(year.value)) models.set(year.value, createComparison(current.crossings,primes));
    crossing.replaceChildren(...current.crossings.map(([hour,direction],i) =>
      new Option(`${arrow(direction)} · ${crossingTime(hour)}`,i)
    ));
    if (year.value === exampleYear) {
      base.value = examplePair ?? "7";
      selectExampleEvent(examplePairs[base.value][0]);
    } else {
      base.value = "0";
    }
    renderPhase();
    renderScale();
  }

  base.replaceChildren(...Array.from({length:pairs},(_,i) => new Option("",i)));
  year.addEventListener("change",() => changeYear());
  find("example").addEventListener("click",() => {
    year.value = exampleYear;
    phase.value = String(examplePhase);
    find("details").open = true;
    changeYear("3");
    pairButtons[0].focus();
  });
  for (const button of pairButtons) {
    button.addEventListener("click",() => {
      base.value = button.dataset.iotaExamplePair;
      selectExampleEvent(examplePairs[base.value][0]);
      renderDetail();
    });
  }
  eventButtons.forEach((button,index) => {
    button.addEventListener("click",() => {
      selectExampleEvent(examplePairs[base.value][index]);
      renderDetail();
    });
  });
  phase.addEventListener("input",renderPhase);
  base.addEventListener("change",renderDetail);
  crossing.addEventListener("change",renderDetail);
  unit.addEventListener("change",renderScale);
  find("reset").addEventListener("click",() => {
    phase.value = "0";
    renderPhase();
  });
  changeYear();
  if (window.location.hash === "#helix-iota-jpl") panel.scrollIntoView();
})();
