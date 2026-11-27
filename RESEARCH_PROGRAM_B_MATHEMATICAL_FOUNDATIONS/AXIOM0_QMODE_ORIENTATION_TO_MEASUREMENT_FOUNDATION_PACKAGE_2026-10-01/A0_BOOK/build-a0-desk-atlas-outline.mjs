import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// node build-a0-desk-atlas-outline.mjs "/path/to/NEXAH-Experience"
const experience = process.argv[2];
if (!experience) throw new Error("Pass the path to the local NEXAH-Experience repository.");

const { atlasSections, atlasSectionHref } = await import(
  pathToFileURL(resolve(experience, "src/data/atlas-of-atlases.ts")).href
);
const titleNotes = JSON.parse(await readFile(new URL("assets/desk-atlas/plate-titles.json", import.meta.url), "utf8"));
const escape = (value) => value.replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
);
const localOrigin = "http://127.0.0.1:8890";
const plateLink = (section, plate, index) =>
  `<a href="${localOrigin}${atlasSectionHref(section.slug)}#plate-${index + 1}">${escape(titleNotes[plate.file] ?? plate.title)}</a>`;
const subjectLists = [
  { id: "atlas-chemistry", title: "Chemie", files: ["031-48120050.jpg", "034-48120057.jpg"] },
  { id: "atlas-biology", title: "Biologie", files: ["030-48120056.jpg", "034-48120057.jpg", "035-48120053.jpg"] },
];

const linksByFile = new Map();
let position = 1;
const sections = atlasSections.map((section, sectionIndex) => {
  const start = position;
  const rows = section.plates.map((plate, index) => {
    const link = plateLink(section, plate, index);
    if (linksByFile.has(plate.file)) throw new Error(`Duplicate plate: ${plate.file}`);
    linksByFile.set(plate.file, link);
    position += 1;
    return `            <li>${link}</li>`;
  });
  return [
    `        <details${sectionIndex === 0 ? " open" : ""}>`,
    `          <summary><strong>${escape(section.title)}</strong> · ${start}–${position - 1}</summary>`,
    `          <ol start="${start}">`,
    ...rows,
    "          </ol>",
    "        </details>",
  ].join("\n");
});

const subjects = subjectLists.map(({ id, title, files }) => {
  const links = files.map((file) => {
    if (!linksByFile.has(file)) throw new Error(`Missing ${title} plate: ${file}`);
    return `            <li>${linksByFile.get(file)}</li>`;
  });
  return [
    `        <article id="${id}"><h4>${title}</h4><ul>`,
    ...links,
    "        </ul></article>",
  ].join("\n");
});

const outline = [
  `        <p class="sub">${position - 1} Tafeln in ${sections.length} Abschnitten. Die Tafellinks öffnen den lokalen Experience-Reader auf Port 8890.</p>`,
  '        <div class="definition">',
  ...subjects,
  "        </div>",
  ...sections,
].join("\n");
const deskPath = new URL("A0_RESEARCH_DESK.html", import.meta.url);
const desk = await readFile(deskPath, "utf8");
const region = /(<!-- BEGIN GENERATED ATLAS OUTLINE -->\n)[\s\S]*?(^[ \t]*<!-- END GENERATED ATLAS OUTLINE -->)/m;
if (!region.test(desk)) throw new Error("Missing generated outline region in the Science Desk.");
await writeFile(deskPath, desk.replace(region, (_, start, end) => start + outline + "\n" + end));
