import { clamp01, mapRange, easeOutCubic, lerp } from '../creative.utils.js';

export function createScene4(root) {
  const img = root.querySelector('#impactFrame');
  const memoryBlock = root.querySelector('[data-block="memory"]');
  const feelingBlock = root.querySelector('[data-block="feeling"]');

  const pathFrames = [];
  const smileFrames = [];
  let loaded = false;

  function preload() {
    if (loaded) return;
    loaded = true;

    for (let i = 0; i <= 31; i += 1) {
      const frame = new Image();
      frame.src = `./assets/images/pen/path/pen_${String(i).padStart(5, '0')}.png`;
      pathFrames.push(frame);
    }

    for (let i = 48; i <= 93; i += 1) {
      const frame = new Image();
      frame.src = `./assets/images/pen/smiley/pen_${String(i).padStart(5, '0')}.png`;
      smileFrames.push(frame);
    }
  }

  function resize() {}

  function render(local) {
    preload();
    const p = clamp01(local);

    const firstHalf = p < 0.5;
    if (img) {
      if (firstHalf && pathFrames.length) {
        const t = easeOutCubic(mapRange(p, 0.00, 0.50, 0, 1));
        const index = Math.min(pathFrames.length - 1, Math.floor(t * (pathFrames.length - 1)));
        if (pathFrames[index]?.src) img.src = pathFrames[index].src;
      } else if (smileFrames.length) {
        const t = easeOutCubic(mapRange(p, 0.50, 1.00, 0, 1));
        const index = Math.min(smileFrames.length - 1, Math.floor(t * (smileFrames.length - 1)));
        if (smileFrames[index]?.src) img.src = smileFrames[index].src;
      }
    }

    const memoryVisible = p < 0.52
      ? easeOutCubic(mapRange(p, 0.18, 0.30, 0, 1))
      : 1 - easeOutCubic(mapRange(p, 0.52, 0.64, 0, 1));

    const feelingVisible = p < 0.64
      ? 0
      : easeOutCubic(mapRange(p, 0.64, 0.78, 0, 1));

    gsap.set(memoryBlock, {
      opacity: Math.max(0, Math.min(1, memoryVisible)),
      y: lerp(20, 0, Math.max(0, Math.min(1, memoryVisible))),
      filter: `blur(${lerp(2.5, 0, Math.max(0, Math.min(1, memoryVisible))).toFixed(2)}px)`
    });

    gsap.set(feelingBlock, {
      opacity: Math.max(0, Math.min(1, feelingVisible)),
      y: lerp(20, 0, Math.max(0, Math.min(1, feelingVisible))),
      filter: `blur(${lerp(2.5, 0, Math.max(0, Math.min(1, feelingVisible))).toFixed(2)}px)`
    });

    memoryBlock?.classList.toggle('is-active', memoryVisible > 0.45);
    feelingBlock?.classList.toggle('is-active', feelingVisible > 0.45);
  }

  return { root, resize, render, destroy() {} };
}
