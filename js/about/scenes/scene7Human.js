
import { createCanvasContext, resizeCanvas, clear, generateUvSphere, createRingAgents, transformPoints, projectPoints, drawEdges, drawGlowDot, drawPolyline } from '../geometry.js';
import { clamp01 } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene7(root) {
  const canvas = root.querySelector('canvas');
  const target = createCanvasContext(canvas);
  const core = generateUvSphere(10, 16);
  const agents = createRingAgents(12, 2.05);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const corePts = transformPoints(core.vertices, { ry: t * 0.18, rx: 0.24, scale: 0.95 });
    drawEdges(ctx, projectPoints(corePts, width, height), core.edges, { stroke: PALETTE.line, alpha: 0.42 + p * 0.32, lineWidth: 1, glow: 10 });
    drawGlowDot(ctx, width * 0.5, height * 0.5, Math.min(width, height) * 0.1, PALETTE.gold, 0.12);

    const orbitPoints = [];
    agents.forEach((a, i) => {
      const ang = a.phase + t * (0.35 + (i % 3) * 0.07);
      const point = {
        x: Math.cos(ang) * a.radius,
        y: Math.sin(ang * 0.8 + a.tilt) * 0.42,
        z: Math.sin(ang) * a.radius * 0.5
      };
      const pr = projectPoints([point], width, height)[0];
      orbitPoints.push(pr);

      const size = 8 + pr.scale * 10;
      ctx.save();
      ctx.translate(pr.x, pr.y);
      ctx.rotate(ang + Math.PI / 4);
      ctx.globalAlpha = 0.42 + 0.24 * Math.sin(ang * 2);
      ctx.strokeStyle = 'rgba(242,237,227,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.75, size);
      ctx.lineTo(-size * 0.75, size);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    for (let i = 1; i < orbitPoints.length; i += 3) {
      drawPolyline(ctx, [orbitPoints[i - 1], orbitPoints[i]], { stroke: PALETTE.goldSoft, alpha: 0.18, lineWidth: 1, glow: 8 });
    }
  }

  return { root, resize, render, destroy() {} };
}
