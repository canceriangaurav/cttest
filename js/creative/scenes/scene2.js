import { clamp01, mapRange, easeOutCubic, easeInOutCubic, lerp } from '../creative.utils.js';

export function createScene2(root) {
  const visual = root.querySelector('.ct-expression');
  const labels = Array.from(root.querySelectorAll('.ct-expression-copy__mode-label'));
  const blocks = Array.from(root.querySelectorAll('.ct-expression-copy__block'));

  const filmLayer = root.querySelector('.ct-expression__layer--film');
  const vfxLayer = root.querySelector('.ct-expression__layer--vfx');
  const motionLayer = root.querySelector('.ct-expression__layer--motion');
  const frameLines = root.querySelector('.ct-expression__frame-lines');
  const orbital = root.querySelector('.ct-expression__orbital');
  const rings = Array.from(root.querySelectorAll('.ct-expression__ring'));
  const particles = Array.from(root.querySelectorAll('.ct-expression__particle'));
  const pulseGrid = root.querySelector('.ct-expression__pulse-grid');
  const pulseLines = Array.from(root.querySelectorAll('.ct-expression__pulse-line'));
  const pulseDot = root.querySelector('.ct-expression__pulse-dot');

  function setMode(modeKey) {
    visual?.setAttribute('data-mode', modeKey);
    labels.forEach((label) => label.classList.toggle('is-active', label.dataset.label === modeKey));
    blocks.forEach((block) => block.classList.toggle('is-active', block.dataset.block === modeKey));
  }

  function resize() {}

  function render(local) {
    const p = clamp01(local);

    let mode = 'film';
    if (p >= 0.75) mode = 'motion';
    else if (p >= 0.38) mode = 'vfx';
    setMode(mode);

    const filmMain = mapRange(p, 0.00, 0.28, 0, 1);
    const filmOut = mapRange(p, 0.28, 0.38, 0, 1);
    const vfxIn = mapRange(p, 0.28, 0.38, 0, 1);
    const vfxMain = mapRange(p, 0.38, 0.65, 0, 1);
    const vfxOut = mapRange(p, 0.65, 0.75, 0, 1);
    const motionIn = mapRange(p, 0.65, 0.75, 0, 1);
    const motionMain = mapRange(p, 0.75, 1.00, 0, 1);

    const filmAlpha = p < 0.28 ? easeOutCubic(filmMain) : 1 - easeInOutCubic(filmOut);
    const vfxAlpha = p < 0.28 ? 0 : p < 0.38 ? easeOutCubic(vfxIn) : p < 0.65 ? 1 : 1 - easeInOutCubic(vfxOut);
    const motionAlpha = p < 0.65 ? 0 : p < 0.75 ? easeOutCubic(motionIn) : Math.max(0.85, motionMain);

    gsap.set(filmLayer, { opacity: Math.max(0, Math.min(1, filmAlpha)) * 0.95 });
    gsap.set(vfxLayer, { opacity: Math.max(0, Math.min(1, vfxAlpha)) * 0.95 });
    gsap.set(motionLayer, { opacity: Math.max(0, Math.min(1, motionAlpha)) * 0.95 });

    gsap.set(frameLines, {
      opacity: Math.max(0, Math.min(1, filmAlpha)) * 0.82,
      scale: lerp(1.02, 1, easeOutCubic(Math.max(filmMain, filmOut)))
    });

    gsap.set(orbital, {
      opacity: Math.max(0, Math.min(1, vfxAlpha)) * 0.92,
      scale: lerp(0.94, 1.04, easeOutCubic(Math.max(vfxIn, vfxMain))),
      rotation: lerp(-10, 8, easeInOutCubic(vfxMain))
    });

    rings.forEach((ring, i) => {
      const ringOffset = i * 0.06;
      const ringP = Math.max(0, Math.min(1, vfxMain + ringOffset));
      gsap.set(ring, {
        opacity: Math.max(0, Math.min(1, vfxAlpha)) * (0.45 + i * 0.12),
        scale: lerp(0.92 + i * 0.03, 1.02 + i * 0.04, easeOutCubic(ringP))
      });
    });

    particles.forEach((particle, i) => {
      const xAmp = 8 + i * 3;
      const yAmp = 6 + i * 2;
      const angle = (p * 360) + (i * 45);
      gsap.set(particle, {
        opacity: Math.max(0, Math.min(1, vfxAlpha)) * (0.45 + ((i % 2) * 0.2)),
        x: Math.sin(angle * (Math.PI / 180)) * xAmp,
        y: Math.cos(angle * (Math.PI / 180)) * yAmp,
        scale: lerp(0.8, 1.18, easeInOutCubic(vfxMain))
      });
    });

    gsap.set(pulseGrid, {
      opacity: Math.max(0, Math.min(1, motionAlpha)),
      scale: lerp(0.96, 1.02, easeOutCubic(motionMain))
    });

    pulseLines.forEach((line, i) => {
      const lineP = Math.max(0, Math.min(1, motionMain + i * 0.06));
      gsap.set(line, {
        opacity: Math.max(0, Math.min(1, motionAlpha)) * (0.32 + i * 0.12),
        scaleX: lerp(0.78, 1.04, easeOutCubic(lineP))
      });
    });

    gsap.set(pulseDot, {
      opacity: Math.max(0, Math.min(1, motionAlpha)),
      scale: lerp(0.72, 1.1, easeOutCubic(motionMain))
    });

    blocks.forEach((block) => {
      let blockAlpha = 0;
      if (block.dataset.block === 'film') {
        const a = p < 0.34 ? easeOutCubic(mapRange(p, 0.03, 0.20, 0, 1)) : 1 - easeInOutCubic(mapRange(p, 0.28, 0.38, 0, 1));
        blockAlpha = Math.max(0, Math.min(1, a));
      } else if (block.dataset.block === 'vfx') {
        const a = p < 0.28 ? 0 : p < 0.40 ? easeOutCubic(mapRange(p, 0.28, 0.40, 0, 1)) : p < 0.68 ? 1 : 1 - easeInOutCubic(mapRange(p, 0.65, 0.76, 0, 1));
        blockAlpha = Math.max(0, Math.min(1, a));
      } else if (block.dataset.block === 'motion') {
        const a = p < 0.66 ? 0 : easeOutCubic(mapRange(p, 0.66, 0.84, 0, 1));
        blockAlpha = Math.max(0, Math.min(1, a));
      }

      gsap.set(block, {
        opacity: blockAlpha,
        y: lerp(20, 0, blockAlpha),
        filter: `blur(${lerp(8, 0, blockAlpha).toFixed(2)}px)`
      });
    });
  }

  return { root, resize, render, destroy() {} };
}
