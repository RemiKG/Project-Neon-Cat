import { TOOL_BY_ID, initialAmmoState } from "../src/config.js";
import { totalAmmo, tryDeployPower } from "../src/deployRuntime.js";

const ammo = initialAmmoState();
const drops = [];

const failOutside = tryDeployPower({
  toolId: "heat",
  pointerX: 0,
  pointerY: 0,
  pointerInBoard: false,
  time: 0,
  ammoState: ammo,
  activeDrops: drops,
});
if (failOutside !== null || drops.length !== 0) {
  throw new Error("deployment should fail when pointer is outside board");
}

const initialHeatAmmo = ammo.heat;
const success = tryDeployPower({
  toolId: "heat",
  pointerX: 500,
  pointerY: 300,
  pointerInBoard: true,
  time: 1.25,
  ammoState: ammo,
  activeDrops: drops,
});

if (!success || success.toolId !== "heat") {
  throw new Error("deployment should succeed for heat in board");
}
if (ammo.heat !== initialHeatAmmo - 1) {
  throw new Error("ammo should decrement on successful deploy");
}
if (drops.length !== 1 || drops[0].id !== success.id) {
  throw new Error("active drops should include deployed drop");
}
if (Math.abs(success.remaining - TOOL_BY_ID.heat.durationSec) > 1e-6) {
  throw new Error("drop remaining should initialize to tool duration");
}

ammo.cold = 0;
const failNoAmmo = tryDeployPower({
  toolId: "cold",
  pointerX: 510,
  pointerY: 305,
  pointerInBoard: true,
  time: 1.3,
  ammoState: ammo,
  activeDrops: drops,
});
if (failNoAmmo !== null) {
  throw new Error("deployment should fail when ammo is depleted");
}

if (totalAmmo(ammo) <= 0) {
  throw new Error("total ammo helper should report positive remaining ammo");
}

console.log("deploy-runtime-smoke: ok");
