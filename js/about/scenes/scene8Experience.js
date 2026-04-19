
import { createCanvasContext, resizeCanvas, clear, generateUvSphere, mapSpherePointsToCube, mapSpherePointsToOcta, mixPoint, transformPoints, projectPoints, drawEdges, drawTrail, drawGlowDot } from '../geometry.js';
import { clamp01 } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene8(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const sphere = generateUvSphere(11, 18);
  const cube = mapSpherePointsToCube(sphere.vertices);
  const octa = mapSpherePointsToOcta(sphere.vertices);
  const trail = [];

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const cycle = (Math.sin(t * 0.35) + 1) * 0.5;
    const phase = (Math.sin(t * 0.18) + 1) * 1.5;
    let targetVerts;
    if (phase < 1) {
      targetVerts = sphere.vertices.map((v, i) => mixPoint(v, cube[i], phase));
    } else {
      targetVerts = sphere.vertices.map((v, i) => mixPoint(cube[i], octa[i], phase - 1));
    }
    const transformed = transformPoints(targetVerts, { ry: t * 0.22, rx: 0.3, scale: 0.9 });
    const projected = projectPoints(transformed, width, height);

    drawEdges(ctx, projected, sphere.edges, {
      stroke: 'rgba(242,237,227,0.55)',
      alpha: 0.28 + p * 0.36,
      lineWidth: 1,
      glow: 9
    });

    const lead = projected[0];
    trail.push({ x: lead.x, y: lead.y });
    if (trail.length > 24) trail.shift();
    drawTrail(ctx, trail, 'rgba(244,211,106,0.75)');
    drawGlowDot(ctx, lead.x, lead.y, 12, PALETTE.gold, 0.28);
  }

  return { root, resize, render, destroy() {} };
}
