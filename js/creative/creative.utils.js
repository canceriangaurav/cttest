export function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export function lerp(a, b, t) {
  return a + ((b - a) * t);
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = clamp01((value - inMin) / (inMax - inMin));
  return outMin + ((outMax - outMin) * t);
}

export function getLocalProgress(globalProgress, start, end) {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

export function phaseAlpha(local) {
  const p = clamp01(local);
  const inAlpha = p < 0.12 ? mapRange(p, 0, 0.12, 0, 1) : 1;
  const outAlpha = p > 0.86 ? mapRange(p, 0.86, 1, 1, 0) : 1;
  return Math.min(inAlpha, outAlpha);
}

export function easeOutCubic(t) {
  const p = clamp01(t);
  return 1 - Math.pow(1 - p, 3);
}

export function easeInOutCubic(t) {
  const p = clamp01(t);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

export function scenePhase(local) {
  const p = clamp01(local);
  if (p < 0.18) return 'entry';
  if (p < 0.68) return 'hold';
  if (p < 0.86) return 'release';
  return 'handoff';
}
