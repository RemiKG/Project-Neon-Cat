import { LAYOUT } from "./config.js";

export function getLiveEquation(toolId, physics, input) {
  const c = physics.cat || physics.balloon;
  const px = input.pointerX;
  const py = input.pointerY;
  const dx = px - c.x;
  const dy = py - c.y;
  const r = Math.hypot(dx, dy);
  const speed = Math.hypot(c.vx, c.vy);
  const thermo = physics.thermo?.sample(px, py) ?? {
    temperature: 1,
    pressure: 1,
    gradTempX: 0,
    gradTempY: 0,
    gradPressureX: 0,
    gradPressureY: 0,
  };

  switch (toolId) {
    case "heat":
      return `dT/dt = k∇²T + Q_h ; T=${f(thermo.temperature)} p=${f(thermo.pressure)} V~T/p=${f(
        thermo.temperature / Math.max(0.2, thermo.pressure),
      )}`;
    case "cold":
      return `dT/dt = k∇²T - Q_c ; T=${f(thermo.temperature)} p=${f(thermo.pressure)} rho~sqrt(p/T)=${f(
        Math.sqrt(thermo.pressure / Math.max(0.25, thermo.temperature)),
      )}`;
    case "gravity":
      return `F = -GMm/r^2 ; r=${f(r)} a~1/r^2=${f(1 / Math.max(1, r * r))} v=${f(speed)}`;
    case "highPressure":
      return `∂p/∂t = c²∇·u + S_p ; p=${f(thermo.pressure)} |∇p|=${f(
        Math.hypot(thermo.gradPressureX, thermo.gradPressureY),
      )}`;
    case "vacuum":
      return `u_r = -k/r^2 ; p=${f(thermo.pressure)} sink=${f(1 / Math.max(1, r * r * 0.1))} |v|=${f(speed)}`;
    case "quantumTunneling":
      return `P_tunnel ~ exp(-2kappaL) ; L=${f(Math.abs(dx) + Math.abs(dy))} ghost=${f(c.tunnelGhost)} v=${f(speed)}`;
    default:
      return "dX/dt = f(X,t)";
  }
}

function f(value) {
  return Number.isFinite(value) ? value.toFixed(3) : "0.000";
}

export function pointerInsideBoard(input) {
  return (
    input.pointerX >= LAYOUT.board.x &&
    input.pointerX <= LAYOUT.board.x + LAYOUT.board.width &&
    input.pointerY >= LAYOUT.board.y &&
    input.pointerY <= LAYOUT.board.y + LAYOUT.board.height
  );
}
