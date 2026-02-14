export const TOOL_OVERLAY_KIND = {
  heat: "thermal_out",
  cold: "thermal_in",
  mass: "gravity_in",
  darkEnergy: "gravity_out",
  highPressure: "pressure_out",
  vacuum: "pressure_in",
  tunneling: "noise_purple",
  viscosity: "noise_cold",
  elasticity: "rings",
  entropy: "entropy",
};

export function toolUsesGrid(toolId) {
  return toolId === "mass" || toolId === "darkEnergy";
}
