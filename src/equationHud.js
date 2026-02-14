import { LAYOUT } from "./config.js";

export function getLiveEquation(toolId, physics, input) {
  const b = physics.balloon;
  const px = input.pointerX;
  const py = input.pointerY;
  const dx = px - b.x;
  const dy = py - b.y;
  const r = Math.hypot(dx, dy);
  const speed = Math.hypot(b.vx, b.vy);
  const thermo = physics.thermo?.sample(px, py) ?? {
    temperature: 1,
    pressure: 1,
    entropy: 0,
    gradTempX: 0,
    gradTempY: 0,
    gradPressureX: 0,
    gradPressureY: 0,
  };

  switch (toolId) {
    case "heat":
      return `dT/dt = k∇²T + Q_h ;  T=${f(thermo.temperature)}  p=${f(thermo.pressure)}  V~T/p=${f(thermo.temperature / Math.max(0.2, thermo.pressure))}`;
    case "cold":
      return `dT/dt = k∇²T - Q_c ;  T=${f(thermo.temperature)}  p=${f(thermo.pressure)}  rho~sqrt(p/T)=${f(
        Math.sqrt(thermo.pressure / Math.max(0.25, thermo.temperature)),
      )}`;
    case "mass":
      return `F = -GMm/r^2 ;  r=${f(r)}  a~1/r^2=${f(1 / Math.max(1, r * r))}  v=${f(speed)}`;
    case "darkEnergy":
      return `a = +Lambda r ;  r=${f(r)}  Lambda_eff=${f(r * 0.0012)}  v=${f(speed)}`;
    case "highPressure":
      return `∂p/∂t = c²∇·u + S_p ;  p=${f(thermo.pressure)}  |∇p|=${f(
        Math.hypot(thermo.gradPressureX, thermo.gradPressureY),
      )}`;
    case "vacuum":
      return `u_r = -k/r^2 ;  p=${f(thermo.pressure)}  sink=${f(1 / Math.max(1, r * r * 0.1))}  |v|=${f(speed)}`;
    case "tunneling":
      return `P_tunnel ~ exp(-2kappaL) ;  L=${f(Math.abs(dx) + Math.abs(dy))}  ghost=${f(b.tunnelGhost)}  v=${f(speed)}`;
    case "viscosity":
      return `dv/dt = -nu v ;  nu_eff=${f(0.12 + b.localDamping)}  |v|=${f(speed)}  Re~${f(speed / Math.max(1, 20 * (0.12 + b.localDamping)))}`;
    case "elasticity":
      return `e = v_out/v_in ;  e_set=${f(b.elasticity)}  KE~v^2=${f(speed * speed)}  m_eff=${f(b.massFactor)}`;
    case "entropy":
      return `dS/dt = alpha|∇T| + beta|∇P| ;  S=${f(thermo.entropy)}  |∇T|=${f(
        Math.hypot(thermo.gradTempX, thermo.gradTempY),
      )}  |∇P|=${f(Math.hypot(thermo.gradPressureX, thermo.gradPressureY))}`;
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
