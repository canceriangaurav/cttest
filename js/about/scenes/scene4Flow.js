
import { createCanvasContext, resizeCanvas, clear, createTorusKnotPoints, transformPoints, projectPoints, drawPolyline } from '../geometry.js';
import { clamp01, mapRange } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene4(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const points = createTorusKnotPoints(420, 2, 3);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const transformed = transformPoints(points, {
      ry: t * 0.18 + 0.35,
      rx: 0.55,
      scale: Math.min(width, height) < 800 ? 1.0 : 1.25,
      tx: width < 1100 ? 0 : 0.8
    });
    const projected = projectPoints(transformed, width, height);

    drawPolyline(ctx, projected, {
      stroke: 'rgba(210,226,255,0.32)',
      alpha: 0.28,
      lineWidth: 1,
      dash: [10, 18],
      dashOffset: -time * 0.02
    });
    drawPolyline(ctx, projected, {
      stroke: PALETTE.gold,
      alpha: 0.38 + p * 0.36,
      lineWidth: 1.5,
      glow: 10,
      dash: [22, 44],
      dashOffset: -time * 0.055
    });
  }

  return { root, resize, render, destroy() {} };
}
