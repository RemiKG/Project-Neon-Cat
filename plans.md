# plans.md

## Execution Rules
1. Follow `AGENTS.md` as constitution.
2. This plan is mandatory, but may be improved if a better path appears.
3. Every milestone ends with:
   1. A concrete test/check.
   2. A git commit when passing.

## Milestone 1 - Project Bootstrap
- [x] Initialize git repo if needed.
- [x] Create core files:
  - `index.html`
  - `styles.css`
  - `src/main.js`
  - `src/config.js`
  - `src/gameLoop.js`
  - `src/inputHandler.js`
  - `src/physicsEngine.js`
  - `src/renderer.js`
  - `src/math.js`
  - `src/particles.js`
- [x] Wire modules and confirm canvas boots.

### Test Gate
- Run JS syntax checks.
- Open app (or launch local static server) and verify no runtime error.

### Commit
- `chore: bootstrap canvas architecture and module wiring`

## Milestone 2 - Core World And Baseline Physics
- [x] Build 16:9 board and white maze walls matching references.
- [x] Implement balloon state:
  - position, velocity, radius, mass proxy, glow.
- [x] Implement wall collision system with tunable elasticity.
- [x] Implement linked-list style fading trail.
- [x] Add baseline gravity/damping defaults.

### Test Gate
- Balloon moves and bounces stably in maze.
- Trail renders and fades.
- No tunneling through walls in normal mode.

### Commit
- `feat: add maze, balloon dynamics, collisions, and trail`

## Milestone 3 - Sidebar + Tool Selection + HUD
- [x] Build left sidebar with 10 constants (icon-like labels).
- [x] Add active tool highlight.
- [x] Add title text and frame ornament style.
- [x] Add `"Constants Remaining: X/10"` display logic.
- [x] Hook pointer input for selecting tools and applying effects in board area.

### Test Gate
- All 10 tools selectable.
- HUD updates without layout break on common resolutions.

### Commit
- `feat: implement themed sidebar, tool selection, and constants HUD`

## Milestone 4 - Lens System + Field Overlay Pipeline
- [x] Implement cursor lens radius system.
- [x] Restrict field overlays to lens mask (`ctx.clip()` pipeline).
- [x] Add generic vector field renderer.
- [x] Add optional grid renderer (only for Mass/Dark Energy).

### Test Gate
- Field visuals are hidden outside lens.
- Mass mode uniquely shows grid.

### Commit
- `feat: add lens-based reveal system for field overlays`

## Milestone 5 - Implement 10 Mechanics (Physics + VFX)
- [x] Heat: orange radial glow + outward vectors + balloon expansion + outward push.
- [x] Cold: icy texture + shrink + denser/heavier behavior.
- [x] Mass: inward warped cyan grid + attraction force.
- [x] Dark Energy: outward warped cyan grid + repulsion force.
- [x] High Pressure: outward impulse burst particles.
- [x] Vacuum: inward sink-flow star streak particles.
- [x] Tunneling: wall segment static/wireframe + collision bypass + drag + RGB ghost balloon.
- [x] Viscosity: heavy damping.
- [x] Elasticity: high bounce conservation.
- [x] Entropy: smooth noise perturbation in velocity.

### Test Gate
- Manual mechanic checklist passes for all 10 tools.
- No tool crashes loop or breaks input.

### Commit
- `feat: implement all ten constants mechanics and visual effects`

## Milestone 6 - Visual Polish To Match References
- [x] Tune glow intensities, line weights, and spacing to image style.
- [x] Tune title typography and composition.
- [x] Add subtle cyber-lab ambience (grain/vignette/light bloom approximations).
- [x] Ensure Heat/Mass/Vacuum/Tunneling resemble `1.png`-`4.png` one-to-one logic.
- [x] Verify desktop and mobile fit.

### Test Gate
- Side-by-side visual check with the four reference images.
- Basic responsiveness check at 1366x768 and mobile portrait.

### Commit
- `style: polish visuals for reference parity and responsive layout`

## Milestone 7 - Final Validation And Delivery
- [x] Run final syntax/test checks.
- [x] Run final manual playthrough.
- [x] Update `plans.md` checkboxes to complete.
- [x] Provide concise run instructions in `README.md`.

### Test Gate
- Clean run with no console errors.
- All milestones marked complete.

### Commit
- `docs: finalize plan completion and usage instructions`

## Final Verification Notes
- Date: 2026-02-14
- Commands run:
  - `node --check` on all source modules.
  - `node tests/physics-smoke.mjs`
  - `node tests/ui-layout-smoke.mjs`
  - `node tests/overlay-mode-smoke.mjs`
  - `node tests/tool-mechanics-smoke.mjs`
  - Local static server smoke test via python -m http.server + Invoke-WebRequest.
- Result: all gates passed and all milestones committed.

## Phase 2 - Thermodynamic Entropy Recode

### Milestone 8 - Plan Extension And Baseline Snapshot
- [x] Add a second-phase plan for thermodynamic entropy + equation HUD.
- [x] Capture current baseline with a full test pass before recode.

#### Test Gate
- Run current smoke tests and ensure green baseline.

#### Commit
- `docs: extend plan for thermodynamic entropy recode`

### Milestone 9 - Cellular Automata Thermo Field
- [x] Add a cellular-automata thermo grid over the board.
- [x] Track per-cell temperature, pressure, and entropy proxies.
- [x] Implement diffusion, relaxation, and local forcing from tools.
- [x] Sample field at balloon position and drive balloon thermo state from field.
- [x] Recode entropy tool to use pressure/temperature disorder instead of pure velocity noise.

#### Test Gate
- Add/extend tests to verify CA updates and entropy behavior are stable and meaningful.
- Keep physics and mechanic smoke tests passing.

#### Commit
- `feat: recode entropy and thermo behavior using cellular automata field`

### Milestone 10 - Temperature Heatmap Hover Visuals
- [x] Render temperature heatmap overlay inside lens when hovering/applying heat-related commands.
- [x] Make heat/cold/vacuum/highPressure/entropy visuals draw from CA field data.
- [x] Keep gravity-only grid rule intact for Mass/Dark Energy modes.

#### Test Gate
- Overlay mode tests pass.
- Manual hover check confirms visible heatmap color response.

#### Commit
- `feat: add thermo heatmap hover overlays driven by CA field`

### Milestone 11 - Live Equation HUD For All 10 Commandments
- [x] Add a per-commandment live equation string in 3Blue1Brown style.
- [x] Update equations every frame with live values (cursor/balloon/field terms).
- [x] Keep equations decoupled from true simulation fidelity (display layer only).

#### Test Gate
- Add tests to ensure each commandment has a live equation and updates safely.
- Full smoke suite remains green.

#### Commit
- `feat: add live equation HUD for all commandments`

### Milestone 12 - Final Phase 2 Closeout
- [x] Run full syntax checks.
- [x] Run full smoke test suite.
- [x] Run local server smoke check.
- [x] Mark all Phase 2 checkboxes complete with verification notes.

#### Test Gate
- Clean run with no errors.
- All Phase 2 tasks checked.

#### Commit
- `docs: finalize thermodynamic phase and verification notes`

## Phase 2 Verification Notes
- Date: 2026-02-14
- Commands run:
  - `node --check src/main.js`
  - `node --check src/physicsEngine.js`
  - `node --check src/renderer.js`
  - `node --check src/thermoAutomata.js`
  - `node --check src/equationHud.js`
  - `node --check tests/thermo-ca-smoke.mjs`
  - `node --check tests/equation-hud-smoke.mjs`
  - `node --check tests/thermo-heatmap-hover-smoke.mjs`
  - `node tests/physics-smoke.mjs`
  - `node tests/ui-layout-smoke.mjs`
  - `node tests/overlay-mode-smoke.mjs`
  - `node tests/tool-mechanics-smoke.mjs`
  - `node tests/thermo-ca-smoke.mjs`
  - `node tests/equation-hud-smoke.mjs`
  - `node tests/thermo-heatmap-hover-smoke.mjs`
  - Python inline `ThreadingHTTPServer` + `urllib.request.urlopen` (`http-status: 200`)
- Result: all Phase 2 gates passed.

