
import { createCanvasContext, resizeCanvas, clear, makeDodeca, makeIcosa, nearestIndices, transformPoints, projectPoints, drawEdges, drawGlowDot } from '../geometry.js';
import { clamp01 } from '../about.utils.js';
import { PALETTE } from '../about.constants.js';

export function createScene3(root) {
  const canvas = root.querySelector('canvas');
  const content = root.querySelector('.ct-about-scene__content');
  const target = createCanvasContext(canvas);
  const outer = makeDodeca();
  const inner = makeIcosa();
  const nearest = nearestIndices(outer.vertices, inner.vertices);

  function resize(w, h) { resizeCanvas(target, w, h); }

  function render(local, global, time) {
    const p = clamp01(local);
    const t = time * 0.001;
    const { ctx, width, height } = target;
    clear(ctx, width, height, p);

    const out = transformPoints(outer.vertices, {
      ry: t * 0.23 + p * 0.08,
      rx: 0.35,
      scale: Math.min(width, height) < 800 ? 1.35 : 1.6
    });
    const inn = transformPoints(inner.vertices, {
      ry: -t * 0.27,
      rx: 0.22,
      scale: Math.min(width, height) < 800 ? 0.82 : 1.0
    });
    const outProj = projectPoints(out, width, height);
    const inProj = projectPoints(inn, width, height);

    drawEdges(ctx, outProj, outer.edges, { stroke: PALETTE.line, alpha: 0.4 + p * 0.34, lineWidth: 1, glow: 8 });
    drawEdges(ctx, inProj, inner.edges, { stroke: 'rgba(180,208,255,0.82)', alpha: 0.42 + p * 0.3, lineWidth: 0.9, glow: 6 });

    ctx.save();
    ctx.strokeStyle = PALETTE.goldSoft;
    ctx.globalAlpha = 0.28 + p * 0.16;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    outProj.forEach((po, i) => {
      const pi = inProj[nearest[i]];
      ctx.moveTo(po.x, po.y);
      ctx.lineTo(pi.x, pi.y);
    });
    ctx.stroke();
    ctx.restore();

    drawGlowDot(ctx, width * 0.5, height * 0.5, Math.min(width, height) * 0.08, PALETTE.gold, 0.18);

    if (content) content.style.transform = `translate3d(0, ${Math.sin(t * 0.7) * 2}px, 0)`;
  }

  return { root, resize, render, destroy() {} };
}
