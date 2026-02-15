import { createPowerDrop, LAYOUT } from "../src/config.js";
import { ParticleSystem } from "../src/particles.js";
import { PhysicsEngine } from "../src/physicsEngine.js";

const dt = 1 / 60;

function createHarness() {
  return {
    engine: new PhysicsEngine(),
    particles: new ParticleSystem(),
  };
}

function runSteps(engine, particles, steps, activeDrops = []) {
  for (let i = 0; i < steps; i += 1) {
    engine.update(
      dt,
      {
        activeDrops,
        pointerInBoard: true,
      },
      particles,
    );
    particles.update(dt);

    for (const drop of activeDrops) {
      if (drop.remaining <= 0) {
        drop.remaining = 0;
      }
    }
  }
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function speedOf(cat) {
  return Math.hypot(cat.vx, cat.vy);
}

{
  const { engine, particles } = createHarness();
  engine.cat.vx = 0;
  engine.cat.vy = 0;

  const drop = createPowerDrop("heat", engine.cat.x - 90, engine.cat.y, 0);
  runSteps(engine, particles, 35, [drop]);

  if (engine.cat.radius <= 35) {
    throw new Error("heat did not meaningfully expand cat");
  }
  if (engine.cat.vx <= 20) {
    throw new Error("heat did not produce outward push");
  }
}

{
  const { engine, particles } = createHarness();
  engine.cat.vx = 220;
  engine.cat.vy = -70;

  const farCold = createPowerDrop("cold", engine.cat.x + 300, engine.cat.y + 200, 0);
  const startRemain = farCold.remaining;
  runSteps(engine, particles, 30, [farCold]);

  if (Math.abs(farCold.remaining - startRemain) > 0.001) {
    throw new Error("cold timer should not drain while not overlapping cat");
  }

  farCold.x = engine.cat.x;
  farCold.y = engine.cat.y;
  runSteps(engine, particles, 30, [farCold]);

  if (farCold.remaining >= startRemain - 0.2) {
    throw new Error("cold timer should drain while overlapping cat");
  }
  if (engine.cat.radius >= 34) {
    throw new Error("cold did not shrink cat");
  }
}

{
  const { engine, particles } = createHarness();
  engine.cat.x = LAYOUT.board.x + 420;
  engine.cat.y = LAYOUT.board.y + 340;
  engine.cat.vx = 0;
  engine.cat.vy = 0;

  const gravity = createPowerDrop("gravity", engine.cat.x + 260, engine.cat.y - 30, 0);
  const startDist = distance(engine.cat.x, engine.cat.y, gravity.x, gravity.y);

  runSteps(engine, particles, 60, [gravity]);

  const endDist = distance(engine.cat.x, engine.cat.y, gravity.x, gravity.y);
  if (endDist >= startDist - 20) {
    throw new Error("gravity did not meaningfully attract cat");
  }
}

{
  const { engine, particles } = createHarness();
  engine.cat.x = LAYOUT.board.x + 660;
  engine.cat.y = LAYOUT.board.y + 360;
  engine.cat.vx = 0;
  engine.cat.vy = 0;

  const drop = createPowerDrop("highPressure", engine.cat.x - 85, engine.cat.y, 0);
  runSteps(engine, particles, 6, [drop]);

  if (engine.cat.vx <= 140) {
    throw new Error("highPressure did not create strong outward impulse");
  }
  if (particles.items.length < 10) {
    throw new Error("highPressure did not spawn burst particles");
  }
}

{
  const { engine, particles } = createHarness();
  engine.cat.x = LAYOUT.board.x + 660;
  engine.cat.y = LAYOUT.board.y + 360;
  engine.cat.vx = 0;
  engine.cat.vy = 0;

  const drop = createPowerDrop("vacuum", engine.cat.x - 85, engine.cat.y, 0);
  runSteps(engine, particles, 6, [drop]);

  if (engine.cat.vx >= -140) {
    throw new Error("vacuum did not create strong inward pull");
  }
  if (particles.items.length < 10) {
    throw new Error("vacuum did not spawn sink particles");
  }
}

{
  const wallX = LAYOUT.board.x + LAYOUT.board.width - 300;
  const y = LAYOUT.board.y + 520;

  const blocked = createHarness();
  blocked.engine.cat.x = wallX - 95;
  blocked.engine.cat.y = y;
  blocked.engine.cat.vx = 420;
  blocked.engine.cat.vy = 0;

  runSteps(blocked.engine, blocked.particles, 90, []);

  const blockedX = blocked.engine.cat.x;

  const tunnel = createHarness();
  tunnel.engine.cat.x = wallX - 95;
  tunnel.engine.cat.y = y;
  tunnel.engine.cat.vx = 420;
  tunnel.engine.cat.vy = 0;

  const drop = createPowerDrop("quantumTunneling", wallX, y, 0);
  runSteps(tunnel.engine, tunnel.particles, 90, [drop]);

  const tunnelX = tunnel.engine.cat.x;
  const radius = tunnel.engine.cat.radius;

  if (blockedX > wallX - radius + 2) {
    throw new Error("baseline collision check failed");
  }
  if (tunnelX <= wallX + radius + 10) {
    throw new Error("quantum tunneling did not pass through wall");
  }
  if (tunnel.engine.disabledWalls.size === 0 && !tunnel.engine.tunnelPreview) {
    throw new Error("quantum tunneling did not target a wall segment");
  }
}

{
  const { engine, particles } = createHarness();
  const tools = ["heat", "cold", "gravity", "highPressure", "vacuum", "quantumTunneling"];

  for (const tool of tools) {
    const drop = createPowerDrop(tool, engine.cat.x, engine.cat.y, 0);
    runSteps(engine, particles, 5, [drop]);
  }

  if (!Number.isFinite(speedOf(engine.cat))) {
    throw new Error("cat speed became non-finite");
  }
}

console.log("tool-mechanics-smoke: ok");
