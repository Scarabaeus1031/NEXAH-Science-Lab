import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Workbook } from "@oai/artifact-tool";

const packageRoot = process.env.LQE_PACKAGE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputs = [
  ["02_SOURCE_TO_CUSTODY_HASH_LEDGER.csv", "Source custody", "results/02_SOURCE_TO_CUSTODY_HASH_LEDGER_preview.png"],
  ["03_ARTIFACT_ROLE_AND_AUTHORITY_LEDGER.csv", "Artifact roles", "results/03_ARTIFACT_ROLE_AND_AUTHORITY_LEDGER_preview.png"]
];

for (const [inputName, sheetName, previewName] of outputs) {
  const csvText = await fs.readFile(path.join(packageRoot, inputName), "utf8");
  const workbook = await Workbook.fromCSV(csvText, { sheetName });
  const sheet = workbook.worksheets.getItem(sheetName);
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  const used = sheet.getUsedRange();
  used.format.font = { name: "Arial", size: 10, color: "#1F2937" };
  used.format.verticalAlignment = "top";
  used.format.wrapText = true;
  const header = used.getRow(0);
  header.format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, verticalAlignment: "center", horizontalAlignment: "center", wrapText: true };
  header.format.rowHeight = 34;
  used.format.autofitRows();
  const widths = inputName.startsWith("02_") ? [90, 250, 310, 75, 95, 275, 275, 85, 155] : [90, 245, 285, 190, 190, 210, 100, 220];
  widths.forEach((width, index) => used.getColumn(index).format.columnWidthPx = width);
  workbook.recalculate();
  const inspect = await workbook.inspect({ kind: "table", range: `${sheetName}!A1:${inputName.startsWith("02_") ? "I" : "H"}25`, include: "values", tableMaxRows: 25, tableMaxCols: 10, maxChars: 18000 });
  await fs.writeFile(path.join(packageRoot, "results", `${inputName}.inspect.ndjson`), inspect.ndjson + "\n");
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(path.join(packageRoot, previewName), new Uint8Array(await preview.arrayBuffer()));
}

console.log(JSON.stringify({ rendered: outputs.length, result: "PASS" }));
