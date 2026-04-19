
import { createCanvasContext, resizeCanvas, clear, makeOcta, projectPoints, drawEdges, drawSegments3D, drawGlowDot } from '../geometry.js';
import { clamp01 } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene5(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const octa = makeOcta();
  const scanLines = [];

  for (let i = 0; i < 8; i += 1) {
    scanLines.push([{ x: -3, y: -2 + i * 0.55, z: 0 }, { x: 3, y: -2 + i * 0.55, z: 0 }]);
  }

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const waveX = Math.sin(t * 0.45) * 1.4;
    const distorted = octa.vertices.map((v) => {
      let q = { ...v };
      const dist = Math.abs(q.x - waveX);
      if (dist < 0.75) q.y += Math.sin((t * 3) + q.z * 2.2) * (0.42 * (1 - dist / 0.75));
      return q;
    }).map((v) => rotate(v, 0.44, t * 0.3, 0));

    const projected = projectPoints(distorted.map((v) => ({ x: v.x * 1.75, y: v.y * 1.75, z: v.z * 1.75 })), width, height);
    drawEdges(ctx, projected, octa.edges, { stroke: PALETTE.line, alpha: 0.5 + p * 0.28, lineWidth: 1.2, glow: 10 });

    drawSegments3D(ctx, scanLines, width, height, {
      stroke: PALETTE.goldSoft,
      alpha: 0.18,
      lineWidth: 1,
      glow: 8,
      transform: { tx: waveX, ry: 0.25, scale: 1.2 }
    });

    drawGlowDot(ctx, width * 0.5, height * 0.5, Math.min(width, height) * 0.12, PALETTE.gold, 0.09);
  }

  function rotate(v, rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    let x = v.x, y = v.y * cx - v.z * sx, z = v.y * sx + v.z * cx;
    const xx = x * cy - z * sy, zz = z * cy + x * sy;
    return { x: xx, y, z: zz };
  }

  return { root, resize, render, destroy() {} };
}
