
import { createCanvasContext, resizeCanvas, clear, generateUvSphere, mapSpherePointsToCube, mixPoint, transformPoints, projectPoints, drawEdges, drawGlowDot, drawPolyline } from '../geometry.js';
import { easeInOutCubic, clamp01, mapRange } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene1(root) {
  const canvas = root.querySelector('canvas');
  const content = root.querySelector('.ct-about-scene__content');
  const target = createCanvasContext(canvas);
  const sphere = generateUvSphere(13, 20);
  const cubeVerts = mapSpherePointsToCube(sphere.vertices);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);
    const mix = 0.5 + 0.28 * Math.sin(t * 0.7);
    const verts = sphere.vertices.map((v, i) => mixPoint(v, cubeVerts[i], mix));
    const transformed = transformPoints(verts, {
      ry: t * 0.42 + p * 0.1,
      rx: 0.25 + Math.sin(t * 0.35) * 0.1,
      scale: Math.min(width, height) < 800 ? 1.5 : 1.85
    });
    const projected = projectPoints(transformed, width, height);
    drawEdges(ctx, projected, sphere.edges, {
      stroke: PALETTE.line,
      alpha: 0.18 + p * 0.8,
      lineWidth: 1,
      glow: 8
    });

    const ring = [];
    const rr = Math.min(width, height) * 0.18;
    for (let i = 0; i <= 90; i += 1) {
      const a = (i / 90) * Math.PI * 2;
      ring.push({ x: width * 0.5 + Math.cos(a) * rr, y: height * 0.5 + Math.sin(a) * rr });
    }
    drawPolyline(ctx, ring, { stroke: PALETTE.goldSoft, alpha: 0.18, lineWidth: 1, glow: 10, close: true });
    drawGlowDot(ctx, width * 0.5, height * 0.5, Math.min(width, height) * 0.14, PALETTE.gold, 0.12);

    if (content) {
      const y = p < 0.3 ? mapRange(p, 0, 0.3, 22, 0) : p > 0.78 ? mapRange(p, 0.78, 1, 0, -18) : 0;
      content.style.transform = `translate3d(0, ${y}px, 0)`;
      content.style.filter = `blur(${p > 0.86 ? mapRange(p, 0.86, 1, 0, 6) : 0}px)`;
    }
  }

  return { root, resize, render, destroy() {} };
}
