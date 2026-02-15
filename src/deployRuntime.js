import { TOOL_BY_ID, createPowerDrop } from "./config.js";

export function tryDeployPower({ toolId, pointerX, pointerY, pointerInBoard, time, ammoState, activeDrops }) {
  if (!pointerInBoard) {
    return null;
  }

  const tool = TOOL_BY_ID[toolId];
  if (!tool) {
    return null;
  }

  const remaining = ammoState[toolId] ?? 0;
  if (remaining <= 0) {
    return null;
  }

  const drop = createPowerDrop(toolId, pointerX, pointerY, time);
  if (!drop) {
    return null;
  }

  ammoState[toolId] = remaining - 1;
  activeDrops.push(drop);
  return drop;
}

export function totalAmmo(ammoState) {
  return Object.values(ammoState).reduce((sum, value) => sum + Math.max(0, value), 0);
}
