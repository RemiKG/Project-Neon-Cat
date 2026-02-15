# AGENTS.md

## Mission
Build **The Ten Commandments V2**, a viral-ready physics maze game for the McGill Physics Hackathon, optimized for:
1. Visual impact in a short-form demo.
2. Clear explainability of each mechanic to judges.
3. Stable, deterministic interaction over physically exact simulation.

The target style is **Neon Nyan Puzzle + Cyberpunk Physics Lab** with two visual modes sharing identical gameplay physics.

## Authority And Workflow
1. Follow `plans.md` as the execution source of truth.
2. You may improve `plans.md` if a better path appears, but preserve end goals and record what changed and why.
3. After each milestone:
   1. Run concrete self-tests/checks that match the work.
   2. If passing, create a git commit immediately.
4. Keep rollback safety:
   1. Create backup tag/commit before major rewrites.
   2. Never use destructive git commands unless explicitly requested.

## Asset Authority (V2)
1. Canonical assets are in `assetsv2/`.
2. Legacy `Assets/` content is compatibility-only and does not define V2 visuals.
3. Centralize all asset paths in config/manifest code.
4. If an asset fails to load:
   1. Keep game functional using placeholders/silent fallback.
   2. Log the exact missing path.

## Non-Negotiable Technical Rules
1. Stack: **HTML5 Canvas + Vanilla ES6+ JavaScript**.
2. Physics: custom fake physics only. No Box2D, Matter.js, or other external physics engines.
3. Prioritize control and visual clarity over strict numerical realism.
4. Code quality:
   1. Modular classes/files.
   2. No giant god functions.
   3. Clear naming and bounded responsibilities.

## Core Visual Engineering Rules
1. Goal: believable cinematic physics language, not textbook simulation.
2. Two modes must exist and be toggleable:
   1. `normal`: colorful, cute neon presentation.
   2. `hacker`: muted, technical, professor-facing physics presentation.
3. Physics behavior is identical in both modes; only visuals/audio theme differ.
4. Lens mechanic remains:
   1. Physics overlays hidden by default.
   2. Overlays revealed only inside cursor lens while relevant tool context is active.
5. Overlay gating rule:
   1. Full physics overlays (heatmap, vectors, warped grid, vacuum lines, equations) render only in hacker mode.
   2. In normal mode, tools show lightweight pixel emissions around dropped tool icons.

## Functional Spec: 6 Sidebar Powers (No Extras)
Exactly 6 powers are available:

### I. Thermodynamics
1. **Heat**
   1. Visual: orange radial energy style.
   2. Logic: increases cat size.
   3. Duration: `2.0s` per deployment.
2. **Cold**
   1. Visual: icy blue/white crystalline style.
   2. Logic: shrinks cat size.
   3. Duration: up to `2.0s`, timer drains only while effect overlaps the cat.

### II. General Relativity
3. **Gravity**
   1. Visual: cyan warped grid/dimple in hacker mode.
   2. Logic: continuous attraction (weaker than pressure impulses).
   3. Duration: `7.0s`.

### III. Fluid Dynamics
4. **High Pressure**
   1. Visual: outward burst behavior.
   2. Logic: strong push impulse profile.
   3. Duration: `0.5s`.
5. **Vacuum**
   1. Visual: inward sink behavior.
   2. Logic: strong pull impulse profile.
   3. Duration: `0.5s`.

### IV. Quantum Mechanics
6. **Quantum Tunneling**
   1. Visual: targeted wall segment becomes noisy/wireframe.
   2. Logic: disable collision for targeted segment and apply drag while traversing.

## Input And Deployment Contract
1. Replace hold-to-apply with click-to-deploy.
2. On click in board with available ammo:
   1. Spawn one timed tool drop at cursor.
   2. Decrement ammo.
3. Dropped tool icon/PNG remains visible on board for active duration.
4. System must support limited ammo per power (`xN`), configurable in metadata.

## Gameplay Loop And Stage Rules
1. Player controls a **Neon Cat** that must reach a neon rod goal.
2. Stage progression updates rod color in rainbow sequence (red, orange, yellow, ...).
3. Cat trail must be stage-dependent (profile/palette changes by stage).
4. Maintain 16:9 showcase composition.

## Audio Contract
1. Background music by mode:
   1. normal mode: `theme.mp3`
   2. hacker mode: `Hacker_theme.mp3`
2. One-shot SFX on tool deployment:
   1. `Heat.mp3`
   2. `Cold.mp3`
   3. `Gravity.mp3`
   4. `quantum.mp3`
   5. `vacuum.mp3`
3. Handle browser audio gesture restrictions (start/resume on first user gesture).

## Architecture Contract
1. `GameLoop`: frame timing + update/render order.
2. `PhysicsEngine`: deterministic fake-physics forces, collisions, tunneling, active drop effects.
3. `Renderer`: mode-specific visuals, cat, trails, lens masking, overlays, drop icons, HUD.
4. `InputHandler`: cursor tracking, sidebar selection, click-to-deploy actions.
5. `AudioManager`: BGM switching/crossfade and SFX playback.
6. `StageManager` (or equivalent state module): stage progression and rod/trail profile mapping.
7. Config/constants module: tool metadata, durations, ammo, and asset manifest.

## UI Requirements
1. Sidebar lists exactly 6 powers with distinct visual states.
2. Active power is clearly highlighted.
3. Ammo count per power is visible (for example `x5`).
4. Mode toggle (`Normal` / `Hacker`) is visible and accessible.
5. HUD wording reflects V2 system (not legacy `X/10 constants` semantics).

## Verification Gates
At each milestone, run checks that match the work:
1. Syntax check affected JS modules.
2. Smoke-run in browser/static server environment.
3. Mechanic spot checks for all 6 powers.
4. Mode-gating check:
   1. hacker mode shows full physics overlays through lens.
   2. normal mode suppresses full overlays and shows pixel-style tool FX.
5. Audio checks:
   1. correct BGM on mode switch.
   2. correct SFX on power drop.

If gate passes, commit immediately with a milestone-scoped message.

## Definition Of Done (V2)
1. Exactly 6 powers implemented and selectable.
2. Click-to-deploy timed drops with visible dropped icons are functional.
3. Ammo system is functional and configurable.
4. Two visual modes are toggleable with identical physics behavior.
5. Lens reveal behavior is implemented and consistent.
6. Full physics overlays are hacker-only; normal mode uses simplified pixel FX.
7. Neon cat + stage-based trail + rainbow rod progression are implemented.
8. Audio system is integrated with mode BGM and power SFX.
9. Project runs from `index.html` or a local static server.
10. `plans.md` is updated with complete V2 migration milestones and verification notes.
