
import { createCanvasContext, resizeCanvas, clear, generateUvSphere, mapSpherePointsToCube, mapSpherePointsToOcta, mixPoint, transformPoints, projectPoints, drawEdges } from '../geometry.js';
import { clamp01, mapRange } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene6(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const sphere = generateUvSphere(11, 18);
  const cube = mapSpherePointsToCube(sphere.vertices);
  const octa = mapSpherePointsToOcta(sphere.vertices);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const merge = mapRange(p, 0.34, 0.82, 0, 1);
    const leftPos = 1.85 * (1 - merge);
    const rightPos = -1.85 * (1 - merge);
    const strat = transformPoints(sphere.vertices, { ry: t * 0.28, rx: 0.35, scale: 0.95, tx: -leftPos });
    const creat = transformPoints(cube, { ry: -t * 0.22, rx: 0.2, scale: 0.9 });
    const exec = transformPoints(octa, { ry: t * 0.32, rx: -0.28, scale: 0.9, tx: -rightPos });

    drawEdges(ctx, projectPoints(strat, width, height), sphere.edges, { stroke: 'rgba(210,226,255,0.42)', alpha: 0.46 * (1 - merge), lineWidth: 1, glow: 8 });
    drawEdges(ctx, projectPoints(creat, width, height), sphere.edges, { stroke: PALETTE.goldSoft, alpha: 0.7 * (1 - merge), lineWidth: 1, glow: 8 });
    drawEdges(ctx, projectPoints(exec, width, height), sphere.edges, { stroke: 'rgba(206,188,255,0.38)', alpha: 0.46 * (1 - merge), lineWidth: 1, glow: 8 });

    const hybridVerts = sphere.vertices.map((v, i) => mixPoint(mixPoint(v, cube[i], 0.5), octa[i], 0.32 + 0.18 * Math.sin(t * 0.4)));
    const hybrid = transformPoints(hybridVerts, { ry: t * 0.28, rx: 0.32, scale: 1.18 });
    drawEdges(ctx, projectPoints(hybrid, width, height), sphere.edges, {
      stroke: PALETTE.line,
      alpha: 0.18 + merge * 0.78,
      lineWidth: 1.15,
      glow: 11
    });
  }

  return { root, resize, render, destroy() {} };
}
