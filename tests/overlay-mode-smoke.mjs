import { TOOL_OVERLAY_KIND } from "../src/fieldModes.js";
import { TOOLS } from "../src/config.js";

const ids = TOOLS.map((tool) => tool.id);
for (const id of ids) {
  if (!TOOL_OVERLAY_KIND[id]) {
    throw new Error(`missing overlay kind for tool: ${id}`);
  }
}

const gridTools = ids.filter((id) => id === "mass" || id === "darkEnergy");
if (gridTools.length !== 2) {
  throw new Error("expected exactly two grid tools");
}

const gravityKinds = [TOOL_OVERLAY_KIND.mass, TOOL_OVERLAY_KIND.darkEnergy];
if (!gravityKinds.includes("gravity_in") || !gravityKinds.includes("gravity_out")) {
  throw new Error("mass and darkEnergy must map to gravity grid overlay kinds");
}

console.log("overlay-mode-smoke: ok");
