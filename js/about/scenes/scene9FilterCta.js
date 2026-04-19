
import { createCanvasContext, resizeCanvas, clear, generateUvSphere, transformPoints, projectPoints, drawEdges, createHoneycombLines, drawSegments3D } from '../geometry.js';
import { clamp01, mapRange } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene9(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const sphere = generateUvSphere(11, 18);
  const honey = createHoneycombLines(8, 6, 0.34);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const jitter = mapRange(p, 0, 0.75, 0.02, 0.18);
    const leftVerts = sphere.vertices.map((v) => ({
      x: v.x + Math.sin(t * 3.2 + v.y * 10) * jitter,
      y: v.y + Math.cos(t * 4.1 + v.z * 7) * jitter,
      z: v.z + Math.sin(t * 2.7 + v.x * 9) * jitter
    }));
    const left = transformPoints(leftVerts, { ry: t * 0.12, rx: 0.25, scale: 0.88, tx: -1.6 });
    drawEdges(ctx, projectPoints(left, width, height), sphere.edges, {
      stroke: PALETTE.amberDirty,
      alpha: 0.52,
      lineWidth: 1,
      glow: 7
    });

    drawSegments3D(ctx, honey, width, height, {
      stroke: 'rgba(242,237,227,0.56)',
      alpha: 0.26 + p * 0.42,
      lineWidth: 1,
      glow: 9,
      transform: { tx: 1.65, scale: 1.05, ry: 0.08 }
    });

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.18);
    ctx.lineTo(width * 0.5, height * 0.82);
    ctx.stroke();
    ctx.restore();
  }

  return { root, resize, render, destroy() {} };
}
