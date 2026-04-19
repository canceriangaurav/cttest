
import { createCanvasContext, resizeCanvas, clear, makeIcosa, transformPoints, projectPoints, drawEdges, drawCross, drawGlowDot } from '../geometry.js';
import { clamp01, mapRange } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene2(root) {
  const canvas = root.querySelector('canvas');
  const content = root.querySelector('.ct-about-scene__content');
  const target = createCanvasContext(canvas);
  const core = makeIcosa();
  const fragments = Array.from({ length: 14 }, (_, i) => spawn(i));

  function spawn(i) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 3.8 + Math.random() * 2.4;
    return {
      x: Math.cos(angle) * dist,
      y: (Math.random() - 0.5) * 2.2,
      z: Math.sin(angle) * dist,
      vx: -Math.cos(angle) * (0.006 + Math.random() * 0.008),
      vy: (Math.random() - 0.5) * 0.002,
      vz: -Math.sin(angle) * (0.006 + Math.random() * 0.008),
      scale: 1,
      seed: i * 0.73
    };
  }

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const transformed = transformPoints(core.vertices, {
      ry: t * 0.35,
      rx: 0.45 + Math.sin(t * 0.4) * 0.06,
      scale: Math.min(width, height) < 800 ? 1.45 : 1.75,
      tx: width < 1100 ? 0 : 0.8
    });
    const projected = projectPoints(transformed, width, height);
    drawEdges(ctx, projected, core.edges, { stroke: PALETTE.line, alpha: 0.34 + p * 0.48, lineWidth: 1, glow: 9 });
    drawGlowDot(ctx, width * (width < 1100 ? 0.5 : 0.62), height * 0.5, Math.min(width, height) * 0.11, PALETTE.gold, 0.11);

    fragments.forEach((f, i) => {
      f.x += f.vx * (1 + p * 2.1);
      f.y += f.vy * 1.4;
      f.z += f.vz * (1 + p * 2.1);
      const d = Math.hypot(f.x - (width < 1100 ? 0 : 0.8), f.y, f.z);
      if (d < 1.75) f.scale *= 0.92;
      if (f.scale < 0.05 || Math.abs(f.x) > 7 || Math.abs(f.z) > 7) Object.assign(f, spawn(i));

      const pr = project({ x: f.x, y: f.y, z: f.z }, width, height);
      drawCross(ctx, pr.x, pr.y, (4 + 4 * pr.scale) * f.scale, PALETTE.amberDirty, 0.7 * f.scale);
    });

    if (content) {
      content.style.transform = `translate3d(${p > 0.8 ? -10 : 0}px, 0, 0)`;
    }
  }

  function project(point, width, height) {
    const z = point.z + 6.4;
    const s = 6.4 / Math.max(0.35, z);
    return { x: width * 0.5 + point.x * s * 190, y: height * 0.5 + point.y * s * 190, scale: s };
  }

  return { root, resize, render, destroy() {} };
}
