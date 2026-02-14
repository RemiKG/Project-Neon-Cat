import { COLORS, LAYOUT, TOOL_BY_ID, TOOLS, WORLD_HEIGHT, WORLD_WIDTH } from "./config.js";
import { clamp, lerp, valueNoise2D } from "./math.js";
import { getSidebarItemRect, pointInBoard } from "./uiLayout.js";
import { TOOL_OVERLAY_KIND } from "./fieldModes.js";

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(physics, input, gameState) {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this._drawBackground();
    this._drawTitle(gameState);

    this._drawFieldLens(
      gameState.activeTool,
      input.pointerX,
      input.pointerY,
      gameState.applyingTool || pointInBoard(input.pointerX, input.pointerY),
    );

    this._drawBoardFrame();
    this._drawWalls(physics.walls, physics.disabledWalls);
    this._drawTrail(physics.trail);
    this._drawBalloon(physics.balloon);

    this._drawCrosshair(input.pointerX, input.pointerY, TOOL_BY_ID[gameState.activeTool].accent);
    this._drawSidebar(gameState.activeTool);
    this._drawCornerDiamond();
  }

  _drawBackground() {
    const ctx = this.ctx;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const vignette = ctx.createRadialGradient(
      WORLD_WIDTH * 0.5,
      WORLD_HEIGHT * 0.45,
      WORLD_WIDTH * 0.05,
      WORLD_WIDTH * 0.5,
      WORLD_HEIGHT * 0.5,
      WORLD_WIDTH * 0.63,
    );
    vignette.addColorStop(0, "rgba(255,255,255,0.06)");
    vignette.addColorStop(0.6, "rgba(255,255,255,0.012)");
    vignette.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.save();
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 1200; i += 1) {
      const x = (i * 97.31) % WORLD_WIDTH;
      const y = (i * 189.17) % WORLD_HEIGHT;
      const size = i % 3 === 0 ? 2 : 1;
      ctx.fillStyle = i % 7 === 0 ? "rgba(100,200,255,0.15)" : "rgba(255,255,255,0.26)";
      ctx.fillRect(x, y, size, size);
    }
    ctx.restore();
  }

  _drawFieldLens(activeTool, cx, cy, visible) {
    if (!visible || !pointInBoard(cx, cy)) {
      return;
    }

    const ctx = this.ctx;
    const lensRadius = LAYOUT.lensRadius;

    ctx.save();
    this._clipBoardLens(cx, cy, lensRadius);

    const overlayKind = TOOL_OVERLAY_KIND[activeTool];

    switch (overlayKind) {
      case "thermal_out":
        this._drawThermalField(cx, cy, true);
        break;
      case "thermal_in":
        this._drawThermalField(cx, cy, false);
        break;
      case "gravity_in":
        this._drawGravityField(cx, cy, true);
        break;
      case "gravity_out":
        this._drawGravityField(cx, cy, false);
        break;
      case "pressure_out":
        this._drawPressureField(cx, cy, false);
        break;
      case "pressure_in":
        this._drawPressureField(cx, cy, true);
        break;
      case "noise_purple":
        this._drawNoiseCloud(cx, cy, "rgba(205,76,255,0.55)");
        break;
      case "noise_cold":
        this._drawNoiseCloud(cx, cy, "rgba(180,220,255,0.42)");
        break;
      case "rings":
        this._drawRingField(cx, cy, "rgba(255,255,255,0.5)");
        break;
      case "entropy":
        this._drawEntropyField(cx, cy);
        break;
      default:
        break;
    }

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = TOOL_BY_ID[activeTool].accent;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.55;
    ctx.shadowColor = TOOL_BY_ID[activeTool].accent;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  _clipBoardLens(cx, cy, radius) {
    const ctx = this.ctx;
    const board = LAYOUT.board;

    ctx.beginPath();
    ctx.rect(board.x, board.y, board.width, board.height);
    ctx.clip();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
  }

  _drawThermalField(cx, cy, isHeat) {
    const ctx = this.ctx;
    const radius = LAYOUT.lensRadius;
    const color = isHeat ? "255,122,40" : "145,219,255";

    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.06, cx, cy, radius * 1.05);
    gradient.addColorStop(0, `rgba(${color},0.72)`);
    gradient.addColorStop(0.52, `rgba(${color},0.22)`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(LAYOUT.board.x, LAYOUT.board.y, LAYOUT.board.width, LAYOUT.board.height);

    this._drawVectorField(cx, cy, {
      inward: !isHeat,
      color: `rgba(${color},0.95)`,
      spacing: 42,
      length: 10,
      alphaMultiplier: 0.9,
    });
  }

  _drawGravityField(cx, cy, inward) {
    this._drawWarpedGrid(cx, cy, {
      color: "rgba(89,236,255,0.6)",
      inward,
    });

    this._drawVectorField(cx, cy, {
      inward,
      color: "rgba(89,236,255,0.9)",
      spacing: 42,
      length: 11,
      alphaMultiplier: 0.9,
    });
  }

  _drawPressureField(cx, cy, inward) {
    const color = inward ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)";
    this._drawVectorField(cx, cy, {
      inward,
      color,
      spacing: inward ? 32 : 38,
      length: inward ? 26 : 18,
      alphaMultiplier: 1,
      streakMode: true,
    });
  }

  _drawEntropyField(cx, cy) {
    const ctx = this.ctx;
    const board = LAYOUT.board;
    const spacing = 36;
    const radius = LAYOUT.lensRadius;

    ctx.save();
    for (let y = board.y + spacing * 0.5; y < board.y + board.height; y += spacing) {
      for (let x = board.x + spacing * 0.5; x < board.x + board.width; x += spacing) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius * 1.05) {
          continue;
        }

        const influence = clamp(1 - dist / radius, 0, 1);
        const noise = valueNoise2D(x * 0.04, y * 0.04);
        const angle = noise * Math.PI * 2;
        const len = lerp(4, 16, influence);
        const ex = x + Math.cos(angle) * len;
        const ey = y + Math.sin(angle) * len;

        ctx.strokeStyle = `rgba(255,255,255,${0.18 + influence * 0.72})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _drawNoiseCloud(cx, cy, tint) {
    const ctx = this.ctx;
    const radius = LAYOUT.lensRadius;

    const cloud = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius);
    cloud.addColorStop(0, tint);
    cloud.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cloud;
    ctx.fillRect(LAYOUT.board.x, LAYOUT.board.y, LAYOUT.board.width, LAYOUT.board.height);

    ctx.save();
    ctx.globalAlpha = 0.65;
    for (let i = 0; i < 450; i += 1) {
      const angle = i * 0.41;
      const ring = ((i * 73) % 1000) / 1000;
      const r = ring * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const w = i % 2 === 0 ? 1 : 2;
      const h = i % 3 === 0 ? 2 : 1;
      ctx.fillStyle = i % 4 === 0 ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.24)";
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  _drawRingField(cx, cy, color) {
    const ctx = this.ctx;
    ctx.save();
    for (let i = 0; i < 4; i += 1) {
      const radius = 36 + i * 44;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.55 - i * 0.1;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawWarpedGrid(cx, cy, { color, inward }) {
    const ctx = this.ctx;
    const board = LAYOUT.board;
    const spacing = 40;
    const warpRadius = LAYOUT.lensRadius * 1.1;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;

    const warp = (x, y) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const influence = clamp(1 - dist / warpRadius, 0, 1);
      const direction = inward ? -1 : 1;
      const offset = direction * influence * influence * 52;
      return {
        x: x + (dx / dist) * offset,
        y: y + (dy / dist) * offset,
      };
    };

    for (let x = board.x; x <= board.x + board.width; x += spacing) {
      ctx.beginPath();
      for (let y = board.y; y <= board.y + board.height; y += 12) {
        const p = warp(x, y);
        if (y === board.y) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    for (let y = board.y; y <= board.y + board.height; y += spacing) {
      ctx.beginPath();
      for (let x = board.x; x <= board.x + board.width; x += 12) {
        const p = warp(x, y);
        if (x === board.x) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawVectorField(cx, cy, options) {
    const ctx = this.ctx;
    const board = LAYOUT.board;
    const radius = LAYOUT.lensRadius;

    const spacing = options.spacing ?? 42;
    const baseLength = options.length ?? 12;
    const inward = Boolean(options.inward);
    const streakMode = Boolean(options.streakMode);

    ctx.save();
    for (let y = board.y + spacing * 0.5; y < board.y + board.height; y += spacing) {
      for (let x = board.x + spacing * 0.5; x < board.x + board.width; x += spacing) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > radius * 1.08 || dist < 1.5) {
          continue;
        }

        const influence = clamp(1 - dist / radius, 0, 1);
        const alpha = clamp(influence * (options.alphaMultiplier ?? 1), 0, 1);

        if (alpha <= 0.03) {
          continue;
        }

        const invDist = 1 / dist;
        const dir = inward ? -1 : 1;
        const nx = dx * invDist * dir;
        const ny = dy * invDist * dir;

        const len = baseLength * (0.38 + influence * (streakMode ? 2.2 : 1.4));
        const startX = streakMode ? x - nx * len * 0.15 : x;
        const startY = streakMode ? y - ny * len * 0.15 : y;
        const endX = x + nx * len;
        const endY = y + ny * len;

        ctx.strokeStyle = withAlpha(options.color, clamp(alpha, 0.04, 0.98));
        ctx.lineWidth = streakMode ? 1.4 : 1.7;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        if (!streakMode) {
          const head = 3.2;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - nx * head + ny * head * 0.8, endY - ny * head - nx * head * 0.8);
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - nx * head - ny * head * 0.8, endY - ny * head + nx * head * 0.8);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  _drawTitle(gameState) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = COLORS.lineWhite;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "58px Times New Roman";
    ctx.fillText(gameState.titleText, LAYOUT.title.x, LAYOUT.title.y);

    ctx.font = "26px Times New Roman";
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillText(`Constants Remaining: ${gameState.constantsRemaining}/10`, LAYOUT.title.x, LAYOUT.title.y + 38);
    ctx.restore();
  }

  _drawBoardFrame() {
    const ctx = this.ctx;
    const board = LAYOUT.board;

    ctx.save();
    ctx.strokeStyle = COLORS.lineWhite;
    ctx.lineWidth = 2;
    ctx.strokeRect(board.x, board.y, board.width, board.height);
    ctx.restore();
  }

  _drawWalls(walls, disabledWalls) {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 2;

    for (const wall of walls) {
      if (wall.isFrame) {
        continue;
      }

      const disabled = disabledWalls.has(wall.id);
      ctx.strokeStyle = disabled ? "rgba(255,255,255,0.35)" : COLORS.lineWhite;
      ctx.setLineDash(disabled ? [5, 6] : []);

      ctx.beginPath();
      ctx.moveTo(wall.a.x, wall.a.y);
      ctx.lineTo(wall.b.x, wall.b.y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.restore();
  }

  _drawTrail(trail) {
    if (trail.length < 2) {
      return;
    }

    const ctx = this.ctx;

    ctx.save();
    for (let i = 1; i < trail.length; i += 1) {
      const prev = trail[i - 1];
      const node = trail[i];
      const alpha = clamp(node.life, 0, 1) * 0.86;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1.2 + alpha * 4.8;
      ctx.shadowColor = "rgba(255,255,255,0.58)";
      ctx.shadowBlur = 16 * alpha;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawBalloon(balloon) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(252,252,252,0.985)";
    ctx.shadowColor = "rgba(255,255,255,0.98)";
    ctx.shadowBlur = 56;
    ctx.fill();

    const spec = ctx.createRadialGradient(
      balloon.x - balloon.radius * 0.24,
      balloon.y - balloon.radius * 0.35,
      balloon.radius * 0.05,
      balloon.x,
      balloon.y,
      balloon.radius,
    );
    spec.addColorStop(0, "rgba(255,255,255,0.56)");
    spec.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.fillStyle = spec;
    ctx.fill();
    ctx.restore();
  }

  _drawCrosshair(x, y, accent) {
    const ctx = this.ctx;
    const size = LAYOUT.crosshairSize;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.93)";
    ctx.shadowColor = accent;
    ctx.shadowBlur = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - 5, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y - 5);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.restore();
  }

  _drawSidebar(activeTool) {
    const ctx = this.ctx;
    const sidebar = LAYOUT.sidebar;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.fillStyle = "rgba(4, 9, 12, 0.86)";
    roundRect(ctx, sidebar.x, sidebar.y, sidebar.width, sidebar.height, sidebar.radius);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < TOOLS.length; i += 1) {
      const tool = TOOLS[i];
      const rect = getSidebarItemRect(i);
      const isActive = tool.id === activeTool;

      if (isActive) {
        const glow = ctx.createRadialGradient(
          rect.x + rect.width * 0.5,
          rect.y + rect.height * 0.5,
          2,
          rect.x + rect.width * 0.5,
          rect.y + rect.height * 0.5,
          rect.width * 0.7,
        );
        glow.addColorStop(0, `${tool.accent}cc`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.moveTo(rect.x + 8, rect.y);
      ctx.lineTo(rect.x + rect.width - 8, rect.y);
      ctx.stroke();

      ctx.fillStyle = isActive ? tool.accent : "rgba(255,255,255,0.9)";
      ctx.font = "35px Times New Roman";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tool.glyph, rect.x + rect.width * 0.5, rect.y + rect.height * 0.54);
    }

    ctx.restore();
  }

  _drawCornerDiamond() {
    const ctx = this.ctx;
    const cx = WORLD_WIDTH - 54;
    const cy = WORLD_HEIGHT - 56;
    const size = 19;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function withAlpha(color, alpha) {
  if (color.startsWith("rgba(")) {
    const inner = color.slice(5, -1);
    const parts = inner.split(",").map((part) => part.trim());
    return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
  }

  if (color.startsWith("rgb(")) {
    const inner = color.slice(4, -1);
    return `rgba(${inner},${alpha})`;
  }

  return `rgba(255,255,255,${alpha})`;
}
function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}







