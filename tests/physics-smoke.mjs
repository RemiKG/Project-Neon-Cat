import { LAYOUT } from "../src/config.js";
import { PhysicsEngine } from "../src/physicsEngine.js";
import { closestPointOnSegment } from "../src/math.js";

const engine = new PhysicsEngine();
const dt = 1 / 60;

for (let i = 0; i < 2400; i += 1) {
  engine.update(dt);

  const c = engine.cat;

  if (!Number.isFinite(c.x) || !Number.isFinite(c.y) || !Number.isFinite(c.vx) || !Number.isFinite(c.vy)) {
    throw new Error(`non-finite state at step ${i}`);
  }

  const left = LAYOUT.board.x + c.radius - 0.01;
  const right = LAYOUT.board.x + LAYOUT.board.width - c.radius + 0.01;
  const top = LAYOUT.board.y + c.radius - 0.01;
  const bottom = LAYOUT.board.y + LAYOUT.board.height - c.radius + 0.01;

  if (c.x < left || c.x > right || c.y < top || c.y > bottom) {
    throw new Error(`cat escaped board at step ${i}`);
  }

  for (const wall of engine.walls) {
    if (wall.isFrame || engine.disabledWalls.has(wall.id)) {
      continue;
    }
    const cp = closestPointOnSegment(c.x, c.y, wall.a.x, wall.a.y, wall.b.x, wall.b.y);
    const dx = c.x - cp.x;
    const dy = c.y - cp.y;
    const dist = Math.hypot(dx, dy);
    if (dist < c.radius - 0.8) {
      throw new Error(`wall penetration on ${wall.id} at step ${i}`);
    }
  }
}

console.log("physics-smoke: ok");
