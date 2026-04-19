
import { CAMERA, PALETTE } from './about.constants.js';

export function createCanvasContext(canvas) {
  const ctx = canvas.getContext('2d');
  return { canvas, ctx, width: 0, height: 0, dpr: 1 };
}

export function resizeCanvas(target, width, height) {
  const isMobile = window.innerWidth < 768;
const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
  target.dpr = dpr;
  target.width = width;
  target.height = height;
  target.canvas.width = Math.round(width * dpr);
  target.canvas.height = Math.round(height * dpr);
  target.canvas.style.width = `${width}px`;
  target.canvas.style.height = `${height}px`;
  target.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function clear(ctx, width, height, alpha = 1) {
  ctx.clearRect(0, 0, width, height);
  if (alpha > 0) {
    const g = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 0,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.42
    );
    g.addColorStop(0, `rgba(244,211,106,${0.04 * alpha})`);
    g.addColorStop(0.4, `rgba(90,120,180,${0.03 * alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }
}

export function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function mixPoint(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t)
  };
}

export function rotateX(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

export function rotateY(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c - p.z * s, y: p.y, z: p.z * c + p.x * s };
}

export function rotateZ(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c - p.y * s, y: p.y * c + p.x * s, z: p.z };
}

export function transformPoints(points, opt = {}) {
  const { rx = 0, ry = 0, rz = 0, scale = 1, tx = 0, ty = 0, tz = 0 } = opt;
  return points.map((p) => {
    let q = { x: p.x * scale, y: p.y * scale, z: p.z * scale };
    if (rx) q = rotateX(q, rx);
    if (ry) q = rotateY(q, ry);
    if (rz) q = rotateZ(q, rz);
    q.x += tx; q.y += ty; q.z += tz;
    return q;
  });
}

export function project(point, width, height, camera = CAMERA) {
  const z = point.z + camera.fov;
  const scale = camera.fov / Math.max(0.25, z);
  return {
    x: width * 0.5 + point.x * scale * camera.size,
    y: height * 0.5 + point.y * scale * camera.size,
    scale
  };
}

export function projectPoints(points, width, height, camera = CAMERA) {
  return points.map((p) => project(p, width, height, camera));
}

export function drawEdges(ctx, projected, edges, style = {}) {
  const { stroke = PALETTE.line, alpha = 1, lineWidth = 1, glow = 0 } = style;
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = glow;
  ctx.shadowColor = stroke;
  ctx.beginPath();
  for (const [a, b] of edges) {
    const p1 = projected[a], p2 = projected[b];
    if (!p1 || !p2) continue;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawPolyline(ctx, points, style = {}) {
  const {
    stroke = PALETTE.line, alpha = 1, lineWidth = 1.2, glow = 0,
    dash = null, dashOffset = 0, close = false
  } = style;
  if (!points.length) return;
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  ctx.shadowBlur = glow;
  ctx.shadowColor = stroke;
  if (dash) ctx.setLineDash(dash);
  if (dashOffset) ctx.lineDashOffset = dashOffset;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
  if (close) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

export function drawTrail(ctx, points, stroke) {
  if (points.length < 2) return;
  ctx.save();
  ctx.lineWidth = 1.7;
  for (let i = 1; i < points.length; i += 1) {
    ctx.beginPath();
    ctx.globalAlpha = i / points.length;
    ctx.strokeStyle = stroke;
    ctx.shadowBlur = 12;
    ctx.shadowColor = stroke;
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawGlowDot(ctx, x, y, radius, color = PALETTE.gold, alpha = 1) {
  ctx.save();
  const rgb = color.replace(/rgba?\(([^)]+)\)/, '$1').split(',').slice(0,3).join(',');
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, `rgba(${rgb},${alpha})`);
  g.addColorStop(0.25, `rgba(${rgb},${alpha * 0.65})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawCross(ctx, x, y, size, stroke = PALETTE.amberDirty, alpha = 1) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
  ctx.restore();
}

export function drawSegments3D(ctx, segments, width, height, style = {}) {
  const { stroke = PALETTE.line, alpha = 1, lineWidth = 1, glow = 0, transform = {} } = style;
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  ctx.shadowBlur = glow;
  ctx.shadowColor = stroke;
  ctx.beginPath();
  for (const seg of segments) {
    const pts = projectPoints(transformPoints(seg, transform), width, height);
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
  }
  ctx.stroke();
  ctx.restore();
}

export function distance3D(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function generateUvSphere(latSteps = 12, lonSteps = 18) {
  const vertices = [];
  const edges = [];
  for (let y = 0; y <= latSteps; y += 1) {
    const v = y / latSteps;
    const phi = v * Math.PI;
    for (let x = 0; x < lonSteps; x += 1) {
      const u = x / lonSteps;
      const theta = u * Math.PI * 2;
      vertices.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta)
      });
      const idx = y * lonSteps + x;
      if (x < lonSteps - 1) edges.push([idx, idx + 1]);
      else edges.push([idx, y * lonSteps]);
      if (y > 0) edges.push([idx - lonSteps, idx]);
    }
  }
  return { vertices, edges };
}

export function mapSpherePointsToCube(vertices) {
  return vertices.map((p) => {
    const maxAbs = Math.max(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z), 1e-6);
    return { x: p.x / maxAbs, y: p.y / maxAbs, z: p.z / maxAbs };
  });
}

export function mapSpherePointsToOcta(vertices) {
  return vertices.map((p) => {
    const denom = Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z) || 1e-6;
    return { x: p.x / denom, y: p.y / denom, z: p.z / denom };
  });
}

// Platonic solids
export function makeCube() {
  const vertices = [
    { x:-1, y:-1, z:-1 }, { x: 1, y:-1, z:-1 }, { x: 1, y: 1, z:-1 }, { x:-1, y: 1, z:-1 },
    { x:-1, y:-1, z: 1 }, { x: 1, y:-1, z: 1 }, { x: 1, y: 1, z: 1 }, { x:-1, y: 1, z: 1 }
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];
  return { vertices, edges };
}

export function makeOcta() {
  const vertices = [
    {x:1,y:0,z:0},{x:-1,y:0,z:0},
    {x:0,y:1,z:0},{x:0,y:-1,z:0},
    {x:0,y:0,z:1},{x:0,y:0,z:-1}
  ];
  const edges = [
    [0,2],[0,3],[0,4],[0,5],
    [1,2],[1,3],[1,4],[1,5],
    [2,4],[2,5],[3,4],[3,5]
  ];
  return { vertices, edges };
}

export function makeIcosa() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = 1 / Math.sqrt(1 + phi * phi);
  const b = phi * a;
  const vertices = [
    {x:0,y:a,z:b},{x:0,y:-a,z:b},{x:0,y:a,z:-b},{x:0,y:-a,z:-b},
    {x:a,y:b,z:0},{x:-a,y:b,z:0},{x:a,y:-b,z:0},{x:-a,y:-b,z:0},
    {x:b,y:0,z:a},{x:-b,y:0,z:a},{x:b,y:0,z:-a},{x:-b,y:0,z:-a}
  ];
  const edges = [];
  const edgeLen = (() => {
    let min = Infinity;
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        min = Math.min(min, distance3D(vertices[i], vertices[j]));
      }
    }
    return min * 1.05;
  })();
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      if (distance3D(vertices[i], vertices[j]) <= edgeLen) edges.push([i, j]);
    }
  }
  return { vertices, edges };
}

export function makeDodeca() {
  // Derived as face centers of icosahedron
  const ico = makeIcosa();
  const faces = [];
  // find triangular faces from edge graph
  const adj = Array.from({ length: ico.vertices.length }, () => new Set());
  ico.edges.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });
  for (let i = 0; i < ico.vertices.length; i++) {
    for (const j of adj[i]) {
      if (j <= i) continue;
      for (const k of adj[j]) {
        if (k <= j || !adj[i].has(k)) continue;
        faces.push([i, j, k]);
      }
    }
  }
  const centers = faces.map(([a,b,c]) => {
    const v = {
      x: (ico.vertices[a].x + ico.vertices[b].x + ico.vertices[c].x) / 3,
      y: (ico.vertices[a].y + ico.vertices[b].y + ico.vertices[c].y) / 3,
      z: (ico.vertices[a].z + ico.vertices[b].z + ico.vertices[c].z) / 3
    };
    const l = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / l, y: v.y / l, z: v.z / l };
  });
  const edges = [];
  for (let i = 0; i < faces.length; i++) {
    for (let j = i + 1; j < faces.length; j++) {
      const shared = faces[i].filter((idx) => faces[j].includes(idx)).length;
      if (shared === 2) edges.push([i, j]);
    }
  }
  return { vertices: centers, edges };
}

export function nearestIndices(aPoints, bPoints) {
  return aPoints.map((a) => {
    let best = 0, bestD = Infinity;
    bPoints.forEach((b, i) => {
      const d = distance3D(a, b);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  });
}

export function createTorusKnotPoints(count = 300, p = 2, q = 3, radius = 1.4, tube = 0.45) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const ct = Math.cos(q * t), st = Math.sin(q * t);
    const r = radius + tube * Math.cos(p * t);
    pts.push({
      x: r * Math.cos(q * t),
      y: r * Math.sin(q * t),
      z: tube * Math.sin(p * t)
    });
  }
  return pts;
}

export function createRingAgents(count = 12, radius = 2) {
  return Array.from({ length: count }, (_, i) => ({
    phase: (i / count) * Math.PI * 2,
    radius: radius * (0.92 + (i % 3) * 0.04),
    tilt: (i % 5) * 0.37
  }));
}

export function createHoneycombLines(cols = 8, rows = 6, size = 0.34) {
  const segs = [];
  const h = Math.sqrt(3) * size;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c - cols / 2) * size * 1.5;
      const cy = (r - rows / 2) * h + (c % 2 ? h * 0.5 : 0);
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i + Math.PI / 6;
        pts.push({ x: cx + Math.cos(a) * size, y: cy + Math.sin(a) * size, z: 0 });
      }
      for (let i = 0; i < 6; i++) segs.push([pts[i], pts[(i + 1) % 6]]);
    }
  }
  return segs;
}
