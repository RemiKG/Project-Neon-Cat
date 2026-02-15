# plans.md

## Execution Rules (Active)
1. Follow `AGENTS.md` as the constitutional source of truth.
2. This plan is mandatory and step-ordered; improvements are allowed only if they preserve V2 end goals and are recorded.
3. Every milestone must end with:
   1. concrete self-tests/checks,
   2. a passing result,
   3. a milestone-scoped git commit.
4. Keep rollback safety:
   1. create a backup point before major rewrites,
   2. avoid destructive git commands.
5. State the estimation of % completion of the full plans.md file, after each commit, in the chat. 

## Current Snapshot (2026-02-15)
- [x] Backup commit created before V2 rewrite work.
- [x] Backup tag created: `backup/pre-v2-governance-2026-02-15`.
- [x] `AGENTS.md` migrated to V2 constitution.
- [x] Core runtime fully migrated to V2 implementation.

## Legacy Record (Archived)
V1 and entropy phase milestones were completed previously (bootstrap, 10 tools, lens overlays, CA thermo, equation HUD, verification).
This section is archived; active development now follows the V2 milestones below.

## Phase 3 - V2 Migration Roadmap (Active)

### Milestone 1 - Assetsv2 Audit And Runtime Manifest
- [x] Verify real `assetsv2/` directory structure and enumerate available files.
- [x] Create centralized V2 asset manifest in `src/config.js` (or dedicated module).
- [x] Map required runtime buckets:
  - backgrounds (normal/hacker),
  - walls/maze visuals,
  - cat visuals (normal/hacker),
  - 6 tool icons,
  - audio tracks and SFX.
- [x] Add resilient fallback behavior for missing assets.

#### Test Gate
- Validate manifest paths resolve at runtime (or fallback path logs are explicit).
- Run syntax checks on updated modules.
- Smoke-run app to ensure no boot regression.

#### Commit
- `chore: add assetsv2 manifest and resilient asset loading fallbacks`

### Milestone 2 - Tool System Refactor (10 -> 6) + Metadata
- [x] Refactor tool list to exactly 6 powers:
  - `heat`, `cold`, `gravity`, `highPressure`, `vacuum`, `quantumTunneling`.
- [x] Remove V1-only tools from active runtime paths (`darkEnergy`, `viscosity`, `elasticity`, `entropy`).
- [x] Add per-tool metadata:
  - duration,
  - ammo,
  - icon path,
  - SFX path,
  - deployment radius.
- [x] Update any helper maps/constants and UI layout assumptions.

#### Test Gate
- Syntax checks for touched modules.
- Existing mechanics/UI smoke tests updated or replaced for 6-tool model.
- Manual tool selection check confirms exactly 6 selectable entries.

#### Commit
- `refactor: migrate tool manifest to six-power v2 schema`

### Milestone 3 - Input Model Migration (Hold -> Click Deploy)
- [x] Convert pointer interaction from hold-to-apply to click-to-deploy.
- [x] Implement deploy instance model (`activePowerDrops`).
- [x] On board click with ammo available:
  - spawn drop,
  - decrement ammo,
  - attach duration state.
- [x] Draw dropped icon/PNG for active duration.

#### Test Gate
- Click once creates one active drop.
- Drop expires at duration end.
- Ammo decrements only on successful deployment.
- Syntax + UI smoke checks pass.

#### Commit
- `feat: add click-to-deploy timed power drops with ammo consumption`

### Milestone 4 - Physics Engine V2 Mapping
- [x] Rework force application to iterate active drops.
- [x] Implement V2 mechanics:
  - heat 2.0s expansion,
  - cold overlap-gated 2.0s shrink,
  - gravity 7.0s attraction,
  - highPressure 0.5s push,
  - vacuum 0.5s pull,
  - quantumTunneling targeted wall disable + drag.
- [x] Keep deterministic collision core and dt clamping.

#### Test Gate
- Mechanic spot checks for all 6 powers.
- No runtime errors or unstable velocity explosions.
- Physics smoke tests pass (update tests as needed).

#### Commit
- `feat: implement v2 six-power physics runtime on active drop model`

### Milestone 5 - Renderer Mode Split (Normal/Hacker)
- [x] Add mode state and UI toggle.
- [x] Bind mode-specific backgrounds/walls/cat visuals from `assetsv2/`.
- [x] Enforce overlay gating:
  - hacker mode: full lens-based overlays,
  - normal mode: simplified pixel emissions near drop icons.
- [x] Preserve shared physics state across both modes.

#### Test Gate
- Toggle switches visuals without changing underlying physics behavior.
- Hacker mode shows full overlays through lens.
- Normal mode suppresses full overlays and shows simplified FX.

#### Commit
- `feat: split renderer into normal and hacker visual pipelines`

### Milestone 6 - Neon Cat + Stage And Goal Progression
- [x] Replace balloon render path with neon cat visuals while keeping stable collider.
- [x] Add stage state and neon rod goal logic.
- [x] Implement rainbow rod progression across stages.
- [x] Implement stage-dependent trail profiles.

#### Test Gate
- Cat reaches rod and triggers stage progression.
- Rod color changes by stage.
- Trail style changes per stage profile.

#### Commit
- `feat: add neon cat actor, rainbow rod progression, and stage-based trails`

### Milestone 7 - Audio Integration
- [x] Add `AudioManager` for BGM and SFX orchestration.
- [x] Wire mode-based BGM:
  - normal -> `theme.mp3`,
  - hacker -> `Hacker_theme.mp3`.
- [x] Wire deployment SFX (`Heat`, `Cold`, `Gravity`, `quantum`, `vacuum`).
- [x] Implement first-gesture audio start and mode switch crossfade.

#### Test Gate
- Correct BGM per mode.
- Correct SFX per deployed power.
- Audio failures do not crash gameplay.

#### Commit
- `feat: integrate v2 audio manager with mode bgm and power sfx`

### Milestone 8 - HUD And UX Finalization
- [x] Update HUD wording to V2 semantics.
- [x] Show ammo badges on all 6 sidebar powers.
- [x] Preserve clear active-tool highlight and readable mode status.
- [x] Ensure responsive 16:9 composition remains strong.

#### Test Gate
- UI layout smoke test passes on desktop and mobile viewport checks.
- No text overlap or clipped controls.

#### Commit
- `feat: finalize v2 hud sidebar ammo and mode controls`

### Milestone 9 - Test Suite Migration And Hardening
- [x] Update existing tests from 10-tool assumptions to 6-tool model.
- [x] Add tests for:
  - deploy duration expiration,
  - ammo decrement behavior,
  - cold overlap-only timer behavior,
  - mode overlay gating,
  - stage trail switching,
  - audio manager safe initialization.
- [x] Run full automated suite.

#### Test Gate
- All syntax checks green.
- All smoke/mechanic tests green.

#### Commit
- `test: migrate and expand suite for v2 gameplay contracts`

### Milestone 10 - Final Verification And Delivery
- [x] Run full final validation pass.
- [x] Perform manual gameplay walkthrough across modes and stages.
- [x] Confirm AGENTS + plans + README alignment with implemented behavior.
- [x] Record final verification notes with commands and outcomes.

#### Test Gate
- Clean runtime with no console errors.
- All milestones complete.

#### Commit
- `docs: finalize v2 migration verification and delivery notes`

## Verification Command Template (Per Milestone)
- Syntax checks (minimum affected modules):
  - `node --check src/main.js`
  - `node --check src/physicsEngine.js`
  - `node --check src/renderer.js`
- Smoke tests (adjust as tests migrate):
  - `node tests/ui-layout-smoke.mjs`
  - `node tests/overlay-mode-smoke.mjs`
  - `node tests/tool-mechanics-smoke.mjs`

## V2 End Goal Checklist
- [x] Exactly 6 powers active in runtime and UI.
- [x] Click-to-deploy + timed icon drops + ammo system complete.
- [x] Neon cat replaces balloon visuals.
- [x] Two visual modes complete with identical physics behavior.
- [x] Hacker-only full overlay rendering through lens.
- [x] Normal-mode simplified pixel FX from dropped icons.
- [x] Stage progression + rainbow rod + stage-dependent trails.
- [x] Mode BGM + power SFX fully integrated.
- [x] Full test suite green.

## Phase 3 Verification Notes
- Date: 2026-02-15
- Milestone commits:
  - e5c4417 chore: add assetsv2 manifest scaffold and fallback-aware image registry
  - cff800e efactor: migrate tool manifest to six-power v2 schema
  - 8a825f1 eat: add click-to-deploy runtime with ammo-backed power drops
  - 66c449 eat: implement v2 six-power active-drop physics and mechanic checks
  - 17b6b41 eat: split renderer into normal and hacker visual pipelines
  - 3e98f2f eat: add stage progression runtime and rainbow goal progression
  - d48b2e5 eat: integrate audio manager for mode bgm and power drop sfx
  - eefdcaf eat: finalize v2 hud with mode stage and ammo-focused presentation
  - ef5c46 	est: migrate equation and thermo checks to v2 six-power contracts
- Final commands run:
  - 
ode --check src/main.js
  - 
ode --check src/physicsEngine.js
  - 
ode --check src/renderer.js
  - 
ode --check src/equationHud.js
  - 
ode --check src/thermoAutomata.js
  - 
ode tests/ui-layout-smoke.mjs
  - 
ode tests/overlay-mode-smoke.mjs
  - 
ode tests/tool-mechanics-smoke.mjs
  - 
ode tests/physics-smoke.mjs
  - 
ode tests/deploy-runtime-smoke.mjs
  - 
ode tests/equation-hud-smoke.mjs
  - 
ode tests/thermo-ca-smoke.mjs
  - 
ode tests/thermo-heatmap-hover-smoke.mjs
  - 
ode tests/visual-mode-gating-smoke.mjs
  - 
ode tests/stage-runtime-smoke.mjs
  - 
ode tests/audio-manager-smoke.mjs
  - 
ode tests/hud-smoke.mjs
- Result: all checks passed for Phase 3 V2 migration.
