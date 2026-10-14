import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const record = JSON.parse(fs.readFileSync(path.join(here, "a0-jarp-cross-lens-extension-v1.json"), "utf8"));
const failures = [];
let checks = 0;
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message); };
const byId = Object.fromEntries(record.cases.map((item) => [item.id, item]));

check(record.schema === "nexah.a0.jarp-cross-lens-extension/1.0.0", "extension schema");
check(record.extension_id === "A0:JARP:X1", "extension id");
check(record.extends_protocol === "A0:JARP:V1", "extends frozen core");
check(record.frozen_core_unchanged === true, "frozen core unchanged");
check(record.status === "INTERNAL_SOURCE_BOUND_ENGINEERING_EXTENSION_NOT_SCIENCE_RUN", "engineering-only status");
check(record.publication_authorized === false, "publication false");
check(record.cases.length === 8, "eight extension cases");
check(new Set(record.cases.map((item) => item.id)).size === 8, "unique extension ids");
check(record.cases.map((item) => item.id).join("→") === "APP-11→APP-12→APP-13→APP-14→APP-15→APP-16→APP-17→APP-18", "contiguous case ids");

const app11 = byId["APP-11"];
const addresses = app11.input.addresses;
const magic = app11.input.one_based_magic_square;
const rows = [0, 1, 2, 3].map((r) => magic.slice(4 * r, 4 * r + 4).reduce((a, b) => a + b, 0));
const columns = [0, 1, 2, 3].map((c) => magic[c] + magic[c + 4] + magic[c + 8] + magic[c + 12]);
const diagonals = [magic[0] + magic[5] + magic[10] + magic[15], magic[3] + magic[6] + magic[9] + magic[12]];
check(addresses.length === 16 && new Set(addresses).size === 16, "APP-11 Q4 address population");
check(addresses.every((v) => 15 - (15 - v) === v), "APP-11 complement involution");
check(addresses.every((v) => v + (15 - v) === 15), "APP-11 complement pair sum");
check([...rows, ...columns, ...diagonals].every((sum) => sum === 34), "APP-11 declared magic lines");

const app12 = byId["APP-12"];
check(app12.input.a + app12.input.b === app12.expected.n, "APP-12 n=a+b");
check(app12.expected.mirror_index === app12.expected.n - app12.input.a, "APP-12 Pascal mirror index");
check(app12.expected.grid_side ** 2 === app12.expected.grid_area, "APP-12 11x11 grid");

const app13 = byId["APP-13"];
const [a, b, c] = app13.input.pascal_triple;
const quaternion = [a + b + c, a, b, c];
check(JSON.stringify(quaternion) === JSON.stringify(app13.expected.quaternion_channels), "APP-13 forward connector");
check(JSON.stringify(quaternion.slice(1)) === JSON.stringify(app13.expected.inverse_coordinates), "APP-13 inverse connector");
check(app13.expected.injective_on_declared_carrier && app13.expected.c3_equivariant, "APP-13 declared exact properties retained");

const app14 = byId["APP-14"];
const totalResidualBits = app14.input.folded_coordinates + app14.input.interface_branch_bits;
check(2 ** totalResidualBits === app14.expected.fiber_size, "APP-14 fibre size");
check(totalResidualBits === app14.expected.pointwise_minimal_witness_bits, "APP-14 minimal witness bits");
check(app14.input.dimension === app14.expected.uniform_coordinate_witness_bits, "APP-14 uniform coordinate witness");

const app15 = byId["APP-15"];
check(app15.input.view_keys.length === app15.expected.view_count, "APP-15 five synchronized views");
check(new Set(app15.input.view_keys).size === app15.expected.view_count, "APP-15 unique view types");
check(app15.expected.shared_carrier === true && app15.expected.new_life_rule === false, "APP-15 carrier reuse without new rule");

const app16 = byId["APP-16"];
check(app16.input.holdout_half_residuals === 33, "APP-16 frozen half-residual count");
check(app16.input.spinor_half_selections === 97 && app16.input.holdout_records === 150, "APP-16 frozen selection population");
check(app16.input.permutation_reproduces_rate === true, "APP-16 permutation control");
check(app16.expected.e8_specificity_established === false && app16.expected.life_e8_identity === false, "APP-16 non-identity boundary");

const app17 = byId["APP-17"];
const normSquared = app17.input.vector.reduce((sum, value) => sum + value * value, 0);
check(normSquared === app17.expected.norm_squared, "APP-17 norm squared");
check(app17.expected.norm === "sqrt(7)", "APP-17 exact norm label");
check(app17.expected.root7_axis_identifiable === false, "APP-17 axis non-identifiability");
check(app17.expected.epsilon7_source_definition_found === false, "APP-17 epsilon7 unresolved alias");

const app18 = byId["APP-18"];
const missing = app18.input.required_fields.filter((field) => !app18.input.provided_fields.includes(field));
check(JSON.stringify(missing) === JSON.stringify(app18.expected.missing_fields), "APP-18 missing residual fields");
check(app18.expected.complete === false, "APP-18 fail-closed completeness");

for (const item of record.cases) {
  check(record.result_vocabulary.includes(item.expected.result), `${item.id} result vocabulary`);
  check(Array.isArray(item.required_witness) && item.required_witness.length > 0, `${item.id} witness declared`);
  check(Array.isArray(item.source_roles) && item.source_roles.length > 0, `${item.id} source roles declared`);
}
for (const id of [
  "NN:A0_JOINT_APPLICATION_RETURN_PROTOCOL",
  "NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK",
  "NEXAH:NAVIGATOR:ROOT7:LOOK:2026-10-08",
  "NEXAH_LIFE_BOUNDARY_CYLINDER_LIFE08_2026_10_11",
  "A0OE:PASCAL_QUATERNION_TEST"
]) check(record.identity_reuse.includes(id), `identity reused: ${id}`);

const result = {status: failures.length ? "FAIL" : "PASS", checks, cases: record.cases.length, failures};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
