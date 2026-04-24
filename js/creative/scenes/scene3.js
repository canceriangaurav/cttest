import { clamp01, mapRange, easeOutCubic, lerp } from '../creative.utils.js';

export function createScene3(root) {
  const oldColumn = root.querySelector('.ct-difference-copy__column--old');
  const newColumn = root.querySelector('.ct-difference-copy__column--new');
  const merge = root.querySelector('.ct-difference-copy__merge');
  const split = root.querySelector('.ct-difference-visual__split');
  const oldPanel = root.querySelector('.ct-difference-visual__panel--old');
  const newPanel = root.querySelector('.ct-difference-visual__panel--new');
  const mergeLine = root.querySelector('.ct-difference-visual__merge-line');

  function resize() {}

  function render(local) {
    const p = clamp01(local);

    const splitIn = mapRange(p, 0.00, 0.15, 0, 1);
    const oldMain = mapRange(p, 0.15, 0.45, 0, 1);
    const newMain = mapRange(p, 0.45, 0.75, 0, 1);
    const mergeIn = mapRange(p, 0.75, 1.00, 0, 1);

    gsap.set(split, {
      opacity: lerp(0, 0.65, easeOutCubic(splitIn)) * (1 - mergeIn * 0.65)
    });

    gsap.set(oldPanel, {
      opacity: lerp(0.5, 0.9, oldMain) * (1 - mergeIn * 0.25),
      x: lerp(-16, 0, easeOutCubic(splitIn))
    });

    gsap.set(newPanel, {
      opacity: lerp(0.45, 0.8, newMain),
      x: lerp(16, 0, easeOutCubic(splitIn))
    });

    gsap.set(oldColumn, {
      opacity: p < 0.10 ? 0 : p < 0.45 ? easeOutCubic(mapRange(p, 0.10, 0.32, 0, 1)) : 1 - (mergeIn * 0.2),
      x: lerp(-22, 0, easeOutCubic(mapRange(p, 0.00, 0.22, 0, 1))),
      filter: `blur(${lerp(10, 0, easeOutCubic(mapRange(p, 0.08, 0.24, 0, 1))).toFixed(2)}px)`
    });

    gsap.set(newColumn, {
      opacity: p < 0.40 ? 0 : p < 0.75 ? easeOutCubic(mapRange(p, 0.42, 0.60, 0, 1)) : 1 - (mergeIn * 0.08),
      x: lerp(22, 0, easeOutCubic(mapRange(p, 0.36, 0.56, 0, 1))),
      filter: `blur(${lerp(10, 0, easeOutCubic(mapRange(p, 0.42, 0.60, 0, 1))).toFixed(2)}px)`
    });

    gsap.set(mergeLine, {
      opacity: easeOutCubic(mergeIn) * 0.9,
      scaleX: lerp(0.5, 1, easeOutCubic(mergeIn))
    });

    gsap.set(merge, {
      opacity: easeOutCubic(mapRange(p, 0.75, 0.90, 0, 1)),
      y: lerp(22, 0, easeOutCubic(mapRange(p, 0.75, 0.90, 0, 1))),
      filter: `blur(${lerp(8, 0, easeOutCubic(mapRange(p, 0.75, 0.90, 0, 1))).toFixed(2)}px)`
    });
  }

  return { root, resize, render, destroy() {} };
}
