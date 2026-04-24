import { clamp01, mapRange, easeOutCubic, lerp } from '../creative.utils.js';

export function createScene5(root) {
  const video = root.querySelector('.ct-cta-visual__video');
  const overlay = root.querySelector('.ct-cta-visual__overlay');
  const beam = root.querySelector('.ct-cta-visual__beam');
  const eyebrow = root.querySelector('.ct-creative-copy__eyebrow');
  const title = root.querySelector('.ct-creative-copy__title');
  const body = root.querySelector('.ct-creative-copy__body');
  const actions = root.querySelector('.ct-cta-copy__actions');

  function resize() {}

  function render(local) {
    const p = clamp01(local);

    gsap.set(video, {
      scale: lerp(1.07, 1.03, easeOutCubic(mapRange(p, 0, 0.75, 0, 1))),
      filter: `saturate(${lerp(0.75, 0.96, p).toFixed(3)}) contrast(${lerp(0.94, 1.05, p).toFixed(3)}) brightness(${lerp(0.66, 0.88, p).toFixed(3)})`
    });

    gsap.set(overlay, {
      opacity: lerp(1, 0.82, mapRange(p, 0.16, 0.82, 0, 1))
    });

    gsap.set(beam, {
      opacity: lerp(0.25, 0.76, easeOutCubic(mapRange(p, 0.04, 0.30, 0, 1))),
      scale: lerp(0.96, 1, easeOutCubic(mapRange(p, 0.05, 0.48, 0, 1)))
    });

    const titleP = easeOutCubic(mapRange(p, 0.20, 0.45, 0, 1));
    const bodyP = easeOutCubic(mapRange(p, 0.45, 0.70, 0, 1));
    const actionsP = easeOutCubic(mapRange(p, 0.70, 0.90, 0, 1));

    gsap.set(eyebrow, {
      opacity: titleP,
      y: lerp(18, 0, titleP),
      filter: `blur(${lerp(8, 0, titleP).toFixed(2)}px)`
    });

    gsap.set(title, {
      opacity: titleP,
      y: lerp(22, 0, titleP),
      filter: `blur(${lerp(8, 0, titleP).toFixed(2)}px)`
    });

    gsap.set(body, {
      opacity: bodyP,
      y: lerp(14, 0, bodyP),
      filter: `blur(${lerp(8, 0, bodyP).toFixed(2)}px)`
    });

    gsap.set(actions, {
      opacity: actionsP,
      y: lerp(12, 0, actionsP),
      filter: `blur(${lerp(6, 0, actionsP).toFixed(2)}px)`
    });
  }

  return { root, resize, render, destroy() {} };
}
