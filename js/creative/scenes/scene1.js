import { clamp01, mapRange, easeOutCubic, easeInOutCubic, lerp } from '../creative.utils.js';

export function createScene1(root) {
  const content = root.querySelector('.ct-perception-copy');
  const lines = Array.from(root.querySelectorAll('.ct-perception-copy__line'));
  const video = root.querySelector('.ct-perception-visual__video');
  const overlay = root.querySelector('.ct-perception-visual__overlay');
  const rings = root.querySelector('.ct-perception-visual__focus-rings');

  function resize() {}

  function render(local) {
    const p = clamp01(local);

    gsap.set(video, {
      scale: lerp(1.085, 1.03, easeInOutCubic(mapRange(p, 0, 0.92, 0, 1))),
      filter: `saturate(${lerp(0.78, 1.02, p).toFixed(3)}) contrast(${lerp(0.88, 1.04, p).toFixed(3)}) brightness(${lerp(0.68, 0.92, p).toFixed(3)}) blur(${lerp(7.5, 0.3, easeOutCubic(mapRange(p, 0, 0.82, 0, 1))).toFixed(2)}px)`
    });

    gsap.set(overlay, { opacity: lerp(1, 0.82, mapRange(p, 0.22, 0.82, 0, 1)) });
    gsap.set(rings, {
      opacity: lerp(0.55, 0.22, mapRange(p, 0.12, 0.84, 0, 1)),
      scale: lerp(1.04, 1, easeOutCubic(mapRange(p, 0, 0.75, 0, 1)))
    });

    const lineWindows = [
      [0.10, 0.28],
      [0.25, 0.43],
      [0.40, 0.62],
      [0.60, 0.82]
    ];

    lines.forEach((line, index) => {
      const [start, end] = lineWindows[index];
      const lp = mapRange(p, start, end, 0, 1);
      const visible = p >= start ? 1 : 0;
      const resolved = easeOutCubic(lp);

      let scale = lerp(0.985, 1, resolved);
      let blur = lerp(8, 0, resolved);
      let y = lerp(24, 0, resolved);
      let opacity = visible * resolved;

      if (index === 2) {
        const hit = mapRange(p, 0.43, 0.53, 0, 1);
        const hitScale = hit < 0.5 ? lerp(0.94, 1.05, hit / 0.5) : lerp(1.05, 1, (hit - 0.5) / 0.5);
        scale = Math.max(scale, hitScale);
      }

      gsap.set(line, {
        opacity,
        y,
        scale,
        filter: `blur(${blur.toFixed(2)}px)`
      });
    });

    gsap.set(content, { opacity: lerp(0.92, 1, p) });
  }

  return { root, resize, render, destroy() {} };
}
