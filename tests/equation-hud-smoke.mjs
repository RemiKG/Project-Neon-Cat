import { TOOLS } from "../src/config.js";
import { PhysicsEngine } from "../src/physicsEngine.js";
import { ParticleSystem } from "../src/particles.js";
import { getLiveEquation } from "../src/equationHud.js";

const engine = new PhysicsEngine();
const particles = new ParticleSystem();
const dt = 1 / 60;

const pointer = {
  pointerX: engine.balloon.x - 60,
  pointerY: engine.balloon.y - 30,
};

const expectedToken = {
  heat: "dT/dt",
  cold: "dT/dt",
  mass: "GMm",
  darkEnergy: "Lambda",
  highPressure: "∂p/∂t",
  vacuum: "u_r",
  tunneling: "P_tunnel",
  viscosity: "dv/dt",
  elasticity: "v_out/v_in",
  entropy: "dS/dt",
};

for (const tool of TOOLS) {
  for (let i = 0; i < 8; i += 1) {
    engine.update(
      dt,
      {
        activeTool: tool.id,
        applying: true,
        pointerX: pointer.pointerX,
        pointerY: pointer.pointerY,
        pointerInBoard: true,
        pointerPressed: i === 0,
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
