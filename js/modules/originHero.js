/**
 * Scene 1 hero module for the lightweight Origin homepage.
 * Owns only Scene 1 internal choreography.
 */
export function initOriginHero() {
  if (typeof gsap === 'undefined') {
    console.warn('OriginHero: GSAP not available.');
    return null;
  }

  const scene = document.getElementById('origin-cinematic');
  const layer = document.getElementById('origin-scene-1-layer');
  const hero = document.getElementById('heroOrigin');
  const titleTop = document.getElementById('heroTitleTop');
  const titleBottom = document.getElementById('heroTitleBottom');
  const titleBottomGhost = document.getElementById('heroTitleBottomGhost');
  const mediaWrap = document.getElementById('heroMediaWrap');
  const hourglass = document.getElementById('heroHourglass');
  const support = document.getElementById('heroSupport');
  const kicker = document.getElementById('heroKicker');

  if (!scene || !layer || !hero || !titleTop || !titleBottom || !titleBottomGhost || !mediaWrap || !hourglass || !support || !kicker) {
    console.warn('OriginHero: Missing required DOM elements.');
    return null;
  }

  const FRAME_COUNT = 26;
  const FRAME_PATH = './assets/images/hourglass';
  let lastFrame = -1;
  let preloadStarted = false;

  function getFrameSrc(frameNumber) {
    const padded = String(frameNumber).padStart(5, '0');
    return `${FRAME_PATH}/hourglass_${padded}.webp`;
  }

  function preloadFrames() {
    if (preloadStarted) return;
    preloadStarted = true;

    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(() => {
      for (let i = 2; i <= FRAME_COUNT; i += 1) {
        const img = new Image();
        img.decoding = 'async';
        img.src = getFrameSrc(i);
      }
    });
  }

  gsap.set(titleTop, { x: -220, opacity: 0 });
  gsap.set(titleBottom, { x: 220, opacity: 0 });
  gsap.set(titleBottomGhost, { x: 220, opacity: 0 });
  gsap.set(mediaWrap, { scale: 0.92, opacity: 0, transformOrigin: 'center center' });
  gsap.set([support, kicker], { opacity: 0 });
  gsap.set(hero, { opacity: 1 });

  const introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  introTimeline
    .to(kicker, { opacity: 1, duration: 0.45 }, 0.05)
    .to(titleTop, { x: 0, opacity: 1, duration: 1.05 }, 0.1)
    .to(titleBottom, { x: 0, opacity: 0.96, duration: 1.05 }, 0.18)
    .to(titleBottomGhost, { x: 0, opacity: 0.38, duration: 1.05 }, 0.18)
    .to(mediaWrap, { scale: 1, opacity: 1, duration: 1.0 }, 0.22)
    .to(support, { opacity: 1, duration: 0.7 }, 0.5)
    .call(preloadFrames, null, 0.8);

  function update(progress) {
    const p = Math.max(0, Math.min(1, progress));

    if (p > 0.08) {
      preloadFrames();
    }

    const frame = Math.min(
      FRAME_COUNT,
      Math.max(1, Math.floor(p * (FRAME_COUNT - 1)) + 1)
    );

    if (frame !== lastFrame) {
      hourglass.src = getFrameSrc(frame);
      lastFrame = frame;
    }

    gsap.set(titleTop, {
      x: -120 * Math.max(0, (p - 0.35) / 0.55),
      opacity: 1 - Math.max(0, (p - 0.35) / 0.45)
    });

    const bottomP = Math.max(0, (p - 0.35) / 0.45);
    gsap.set([titleBottom, titleBottomGhost], { x: 120 * bottomP });
    gsap.set(titleBottom, { opacity: 0.96 * (1 - bottomP) });
    gsap.set(titleBottomGhost, { opacity: 0.38 * (1 - bottomP) });

    const supportP = Math.max(0, (p - 0.45) / 0.35);
    gsap.set(support, { opacity: 1 - supportP, y: 24 * supportP });
    gsap.set(kicker, { opacity: 1 - supportP, y: -10 * supportP });

    const mediaP = Math.max(0, (p - 0.35) / 0.55);
    gsap.set(mediaWrap, {
      scale: 1 + (0.4 * mediaP),
      opacity: 1 - Math.max(0, (p - 0.82) / 0.18)
    });
  }

  return { scene, layer, hero, introTimeline, update };
}
