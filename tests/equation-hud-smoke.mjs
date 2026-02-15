import { TOOLS, createPowerDrop } from "../src/config.js";
import { PhysicsEngine } from "../src/physicsEngine.js";
import { ParticleSystem } from "../src/particles.js";
import { getLiveEquation } from "../src/equationHud.js";

const engine = new PhysicsEngine();
const particles = new ParticleSystem();
const dt = 1 / 60;

const pointer = {
  pointerX: engine.cat.x - 60,
  pointerY: engine.cat.y - 30,
};

const expectedToken = {
  heat: "dT/dt",
  cold: "dT/dt",
  gravity: "GMm",
  highPressure: "∂p/∂t",
  vacuum: "u_r",
  quantumTunneling: "P_tunnel",
};

for (const tool of TOOLS) {
  const drop = createPowerDrop(tool.id, pointer.pointerX, pointer.pointerY, 0);
  const activeDrops = [drop];

  for (let i = 0; i < 8; i += 1) {
    engine.update(
      dt,
      {
        activeTool: tool.id,
        activeDrops,
        pointerX: pointer.pointerX,
        pointerY: pointer.pointerY,
      },
      particles,
    );
    particles.update(dt);
  }

  const eq = getLiveEquation(tool.id, engine, pointer);
  if (typeof eq !== "string" || eq.length < 12) {
    throw new Error(`equation missing for tool ${tool.id}`);
  }

  if (!eq.includes(expectedToken[tool.id])) {
    throw new Error(`equation token missing for ${tool.id}: ${eq}`);
  }

  if (eq.includes("NaN") || eq.includes("undefined")) {
    throw new Error(`equation contains invalid value for ${tool.id}: ${eq}`);
  }
}

console.log("equation-hud-smoke: ok");
