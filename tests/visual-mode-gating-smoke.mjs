import { TOOLS } from "../src/config.js";
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

const renderer = new Renderer(createMockCtx());
let lensCalls = 0;
let normalPixelCalls = 0;

const originalLens = renderer._drawFieldLens.bind(renderer);
const originalPixels = renderer._drawNormalDropPixels.bind(renderer);

renderer._drawFieldLens = (...args) => {
  lensCalls += 1;
  return originalLens(...args);
};
renderer._drawNormalDropPixels = (...args) => {
  normalPixelCalls += 1;
  return originalPixels(...args);
};

const baseState = {
  activeTool: TOOLS[0].id,
  activeDrops: [],
  ammoState: {},
  powersReady: 10,
  maxAmmo: 32,
  titleText: "x",
  liveEquation: "eq",
  stageIndex: 0,
};

const input = {
  pointerX: 800,
  pointerY: 420,
};

const physics = {
  time: 0,
  walls: [],
  disabledWalls: new Map(),
  trail: [],
  cat: { x: 500, y: 400, vx: 0, vy: 0, radius: 34, tunnelGhost: 0 },
  thermo: {
    cellSize: 20,
    temp: new Float32Array([1]),
    pressure: new Float32Array([1]),
    forEachCellInRadius(_x, _y, _r, fn) {
      fn(0, 0, 0, 1);
    },
    cellToWorld() {
      return { x: 0, y: 0 };
    },
  },
};

renderer.render(physics, input, { ...baseState, visualMode: "normal" }, { items: [] });
renderer.render(physics, input, { ...baseState, visualMode: "hacker" }, { items: [] });

if (normalPixelCalls < 1) {
  throw new Error("normal mode should render simplified drop pixels");
}
if (lensCalls < 1) {
  throw new Error("hacker mode should call lens overlay renderer");
}

console.log("visual-mode-gating-smoke: ok");
