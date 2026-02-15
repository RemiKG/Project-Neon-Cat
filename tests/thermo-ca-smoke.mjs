import { LAYOUT } from "../src/config.js";
import { ThermoAutomata } from "../src/thermoAutomata.js";

const field = new ThermoAutomata(LAYOUT.board, 20);
const cx = LAYOUT.board.x + LAYOUT.board.width * 0.5;
const cy = LAYOUT.board.y + LAYOUT.board.height * 0.5;
const dt = 1 / 60;

function step(toolId, steps) {
  for (let i = 0; i < steps; i += 1) {
    field.injectTool(toolId, cx, cy, dt);
    field.update(dt);
  }
}

function assertFiniteArray(name, arr) {
  for (let i = 0; i < arr.length; i += 1) {
    const value = arr[i];
    if (!Number.isFinite(value)) {
      throw new Error(`${name} contains non-finite value at ${i}`);
    }
  }
}

const baseline = field.sample(cx, cy);
if (Math.abs(baseline.temperature - 1) > 1e-6 || Math.abs(baseline.pressure - 1) > 1e-6) {
  throw new Error("thermo baseline should start at ambient state");
}

step("heat", 30);
const heated = field.sample(cx, cy);
if (heated.temperature <= 1.12) {
  throw new Error(`heat forcing too weak: T=${heated.temperature.toFixed(3)}`);
}
if (heated.pressure >= 0.99) {
  throw new Error(`heat should reduce local pressure: p=${heated.pressure.toFixed(3)}`);
}

step("cold", 30);
const cooled = field.sample(cx, cy);
if (cooled.temperature >= 0.95) {
  throw new Error(`cold forcing too weak: T=${cooled.temperature.toFixed(3)}`);
}
if (cooled.pressure <= 1.02) {
  throw new Error(`cold should increase local pressure: p=${cooled.pressure.toFixed(3)}`);
}

step("highPressure", 25);
const pressurized = field.sample(cx, cy);
if (pressurized.pressure <= 1.2) {
  throw new Error(`highPressure forcing too weak: p=${pressurized.pressure.toFixed(3)}`);
}

step("vacuum", 25);
const evacuated = field.sample(cx, cy);
if (evacuated.pressure >= pressurized.pressure - 0.2) {
  throw new Error("vacuum should meaningfully lower pressure after highPressure");
}

const beforeGravity = field.sample(cx, cy);
step("gravity", 20);
const afterGravity = field.sample(cx, cy);
if (Math.abs(afterGravity.temperature - beforeGravity.temperature) > 0.2 || Math.abs(afterGravity.pressure - beforeGravity.pressure) > 0.2) {
  throw new Error("gravity should not directly inject thermal field forcing");
}

assertFiniteArray("temperature", field.temp);
assertFiniteArray("pressure", field.pressure);
assertFiniteArray("entropy", field.entropy);

console.log("thermo-ca-smoke: ok");
