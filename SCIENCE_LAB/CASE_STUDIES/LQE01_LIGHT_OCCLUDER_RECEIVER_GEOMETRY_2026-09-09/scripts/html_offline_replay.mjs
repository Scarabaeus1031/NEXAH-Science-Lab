import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(packageRoot, "SOURCE_SNAPSHOT", "GB_Shadow Geometry LQE 01", "NEXAH_Light_Three_Shadows_Destruction_Test.html");
const outputPath = path.join(packageRoot, "results", "html_offline_replay.json");
const htmlHash = createHash("sha256").update(await readFile(htmlPath)).digest("hex");
const blockedRequests = [];

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--disable-background-networking", "--disable-component-update", "--disable-sync"]
});

try {
  const context = await browser.newContext();
  await context.route(/^https?:\/\//, async route => {
    blockedRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  const frame = page.frames().find(candidate => candidate !== page.mainFrame());
  if (!frame) throw new Error("EMBEDDED_DEMONSTRATOR_FRAME_NOT_FOUND");
  await frame.waitForSelector("#ang");

  async function signature() {
    return frame.evaluate(() => ({
      angle: document.querySelector("#angv")?.textContent,
      sourceWidth: document.querySelector("#srcv")?.textContent,
      receiverDistance: document.querySelector("#distv")?.textContent,
      sourceX1: document.querySelector("#source")?.getAttribute("x1"),
      sourceX2: document.querySelector("#source")?.getAttribute("x2"),
      terminatorX1: document.querySelector("#term")?.getAttribute("x1"),
      terminatorX2: document.querySelector("#term")?.getAttribute("x2"),
      shadowMarkup: document.querySelector("#shadow")?.innerHTML,
      labels: document.querySelector("#labels")?.textContent,
      result: document.querySelector("#result")?.textContent
    }));
  }

  async function change(id, value) {
    const before = await signature();
    await frame.locator(`#${id}`).evaluate((element, next) => {
      element.value = String(next);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    const after = await signature();
    return { id, value, changed: JSON.stringify(before) !== JSON.stringify(after), before, after };
  }

  const controls = await frame.locator('input[type="range"]').evaluateAll(elements => elements.map(element => ({
    id: element.id,
    min: element.min,
    max: element.max,
    step: element.step,
    value: element.value
  })));
  const checks = [await change("ang", -35), await change("src", 1.10), await change("dist", 3.20)];
  const result = {
    record_type: "LQE01_CUSTODY_HTML_OFFLINE_REPLAY",
    test_scope: "LOCAL_INTERFACE_REPLAY_ONLY_NO_NEW_DESTRUCTION_TEST",
    html_path: htmlPath,
    html_sha256: htmlHash,
    browser_mode: "LOCAL_FILE_WITH_ALL_HTTP_AND_HTTPS_REQUESTS_BLOCKED",
    loaded: true,
    controls,
    controls_verified: `${checks.filter(check => check.changed).length}_OF_3`,
    state_changes: checks.map(({ id, value, changed }) => ({ id, value, changed })),
    core_requires_remote_network: false,
    blocked_optional_remote_requests: [...new Set(blockedRequests)].sort(),
    result: checks.every(check => check.changed) ? "PASS" : "FAIL"
  };
  await writeFile(outputPath, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result));
  if (result.result !== "PASS" || controls.length !== 3) process.exitCode = 1;
  await context.close();
} finally {
  await browser.close();
}
