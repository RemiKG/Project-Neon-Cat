import { LAYOUT } from "../src/config.js";
import { Renderer } from "../src/renderer.js";

function createMockCtx() {
  const target = {
    lineWidth: 1,
    globalAlpha: 1,
    strokeStyle: "#fff",
    fillStyle: "#fff",
    shadowColor: "transparent",
    shadowBlur: 0,
    lineCap: "round",
    globalCompositeOperation: "source-over",
    font: "12px serif",
    textAlign: "center",
    textBaseline: "middle",
  };

  return new Proxy(target, {
    get(obj, prop) {
      if (prop === "createRadialGradient" || prop === "createLinearGradient") {
        return () => ({ addColorStop() {} });
      }
      if (!(prop in obj)) {
        obj[prop] = () => {};
      }
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    },
  });
}

function createMockThermo() {
  return {
    cellSize: 20,
    temp: new Float32Array([1.45]),
    pressure: new Float32Array([0.82]),
    entropy: new Float32Array([0.9]),
    calls: 0,
    forEachCellInRadius(_x, _y, _r, fn) {
      this.calls += 1;
      fn(0, 0, 0, 1);
    },
    cellToWorld() {
      return {
        x: LAYOUT.board.x + 16,
        y: LAYOUT.board.y + 16,
      };
    },
    sample() {
      return {
        temperature: 1.2,
        pressure: 0.9,
        entropy: 0.8,
        gradTempX: 0.1,
        gradTempY: -0.1,
        gradPressureX: -0.06,
        gradPressureY: 0.05,
      };
    },
  };
}

const renderer = new Renderer(createMockCtx());
const cx = LAYOUT.board.x + 120;
const cy = LAYOUT.board.y + 120;

for (const toolId of ["heat", "cold"]) {
  const thermo = createMockThermo();
  renderer._drawFieldLens(toolId, cx, cy, true, { thermo });
  if (thermo.calls === 0) {
    throw new Error(`${toolId} should trigger thermo heatmap draw on hover`);
  }
}

{
  const thermo = createMockThermo();
  renderer._drawFieldLens("gravity", cx, cy, true, { thermo });
  if (thermo.calls !== 0) {
    throw new Error("gravity should not trigger thermo heatmap draw");
  }
}

console.log("thermo-heatmap-hover-smoke: ok");
