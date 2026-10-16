const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "A0_BUILDER_TOY_STORE.html"), "utf8");
const css = fs.readFileSync(path.join(root, "a0-builder-toy-store.css"), "utf8");
const js = fs.readFileSync(path.join(root, "a0-builder-toy-store.js"), "utf8");

function requireText(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

requireText(html, /href="#benches"/, "Toy Store navigation must expose the benches section");
requireText(html, /id="benches"/, "Toy Store must contain a benches section");
requireText(html, /Orientation Controller Bench/, "OCB must be named in the Toy Store");
requireText(html, /65<\/b> deterministic checks/, "OCB check count must remain visible");
requireText(html, /M3<\/b> measurement trace open/, "OCB measurement boundary must remain visible");
requireText(html, /A0_ORIENTATION_CONTROLLER_BENCH\.html/, "Toy Store must link to the OCB");
requireText(html, /100_A0_ORIENTATION_CONTROLLER_BENCH_GAP_REGISTER_2026-10-16\.md/, "Toy Store must link to the OCB gap register");
requireText(css, /\.bench-card/, "OCB bench must have an explicit layout");
requireText(js, /title:"Orientation Controller Bench"/, "OCB must be available on the flagship shelf");
requireText(js, /kind:"Engineering bench"/, "OCB must remain typed as an engineering bench");

console.log("PASS a0-builder-toy-store-tests");
