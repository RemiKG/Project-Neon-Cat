# The Ten Commandments V2

Physics-based neon cat maze game for the McGill Physics Hackathon.

## Stack
- HTML5 Canvas
- Vanilla ES6 modules
- Custom fake-physics engine (no external physics library)

## Run
1. From the project root, start a static server:
   - `python -m http.server 4173`
2. Open `http://127.0.0.1:4173` in a browser.

You can also open `index.html` directly, but using a local server is recommended for module loading consistency.

## Controls
- Move mouse: aim lens/crosshair.
- Left click sidebar: select one of the 6 powers.
- Left click on board: deploy a timed power drop (consumes ammo).
- Left click mode toggle: switch between `Normal` and `Hacker` visuals/audio.

## Modes
- `Normal`: colorful neon look, simplified pixel power FX.
- `Hacker`: technical presentation with full lens-gated physics overlays and live equations.

## Powers (6)
1. Heat
2. Cold
3. Gravity
4. High Pressure
5. Vacuum
6. Quantum Tunneling

## Gameplay
- Control a neon cat through the maze to reach the neon rod goal.
- Stage clears advance rainbow rod progression.
- Trail color profile changes by stage.

## Audio
- Normal mode BGM: `theme.mp3`
- Hacker mode BGM: `Hacker_theme.mp3`
- Power drop SFX: Heat, Cold, Gravity, quantum, vacuum

## Assets
- Canonical V2 assets: `assetsv2/`
- Runtime includes fallback behavior if assets fail to load.

## Project Files
- `AGENTS.md`: V2 constitution/specification.
- `plans.md`: V2 migration milestones and verification notes.
- `src/main.js`: orchestration and input/deploy flow.
- `src/physicsEngine.js`: fake-physics and active-drop mechanics.
- `src/renderer.js`: normal/hacker visual pipelines.
- `src/audioManager.js`: BGM and SFX management.
