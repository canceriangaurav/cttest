/**
 * Scene 1 hero module for the lightweight Origin homepage.
 * Progress-driven version for PNG hourglass sequence.
 */
export function initOriginHero() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('OriginHero: Browser environment not available.');
    return null;
  }

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

  if (
    !scene ||
    !layer ||
    !hero ||
    !titleTop ||
    !titleBottom ||
    !titleBottomGhost ||
    !mediaWrap ||
    !hourglass ||
    !support ||
    !kicker
  ) {
    console.warn('OriginHero: Missing required DOM elements.');
    return null;
  }

  const FRAME_COUNT = 26;
  const FRAME_PATH = './assets/images/hourglass';

  let lastFrame = -1;
  let preloadStarted = false;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + ((b - a) * t);
  }

  function mapProgress(value, start, end) {
    if (end <= start) return 0;
    return clamp01((value - start) / (end - start));
  }

  function easeOut(t) {
    const p = clamp01(t);
    return 1 - Math.pow(1 - p, 3);
  }

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

  function setFrame(frameNumber) {
    const safeFrame = Math.max(1, Math.min(FRAME_COUNT, frameNumber));
    if (safeFrame === lastFrame) return;
    hourglass.src = getFrameSrc(safeFrame);
    lastFrame = safeFrame;
  }

  function reset() {
    gsap.set(hero, { opacity: 1 });
    gsap.set(layer, { opacity: 1 });

    gsap.set(titleTop, { x: -220, opacity: 0 });
    gsap.set(titleBottom, { x: 220, opacity: 0 });
    gsap.set(titleBottomGhost, { x: 220, opacity: 0 });

    gsap.set(mediaWrap, {
      scale: 1,
      opacity: 1,
      transformOrigin: 'center center'
    });

    gsap.set(support, { opacity: 0, y: 10 });
    gsap.set(kicker, { opacity: 0, y: -8 });

    setFrame(1);
  }

  function update(progress) {
    const p = clamp01(progress);

    if (p > 0.08) preloadFrames();

    // 0.00 -> 0.20 : only hourglass
    // 0.20 -> 0.45 : text enters
    // 0.45 -> 1.00 : text exits + full sequence + zoom out

    const enterP = easeOut(mapProgress(p, 0.20, 0.45));
    const exitP = mapProgress(p, 0.45, 1.00);

    // top from left to center, then out left
    const topX = p < 0.45
      ? lerp(-220, 0, enterP)
      : lerp(0, -220, exitP);

    const topOpacity = p < 0.45
      ? enterP
      : 1 - exitP;

    // bottom + ghost from right to center, then out right
    const bottomX = p < 0.45
      ? lerp(220, 0, enterP)
      : lerp(0, 220, exitP);

    const bottomOpacity = p < 0.45
      ? 0.96 * enterP
      : 0.96 * (1 - exitP);

    const ghostOpacity = p < 0.45
      ? 0.38 * enterP
      : 0.38 * (1 - exitP);

    gsap.set(titleTop, {
      x: topX,
      opacity: topOpacity
    });

    gsap.set(titleBottom, {
      x: bottomX,
      opacity: bottomOpacity
    });

    gsap.set(titleBottomGhost, {
      x: bottomX,
      opacity: ghostOpacity
    });

    const supportFadeIn = mapProgress(p, 0.26, 0.42);
    const supportFadeOut = mapProgress(p, 0.55, 0.88);
    const hourglassFadeOut = mapProgress(p, 0.88, 1);

    gsap.set(support, {
      opacity: supportFadeIn * (1 - supportFadeOut),
      y: lerp(10, 0, supportFadeIn) + lerp(0, 24, supportFadeOut)
    });

    gsap.set(kicker, {
      opacity: supportFadeIn * (1 - supportFadeOut),
      y: lerp(-8, 0, supportFadeIn) + lerp(0, -10, supportFadeOut)
    });

    // Sequence starts with Act 2 region
    const sequenceP = mapProgress(p, 0.45, 1.00);
    const frame = Math.min(
      FRAME_COUNT,
      Math.max(1, Math.floor(sequenceP * (FRAME_COUNT - 1)) + 1)
    );
    setFrame(frame);

    gsap.set(mediaWrap, {
      scale: lerp(1, 0.82, sequenceP),
      opacity: 1 - hourglassFadeOut,
      transformOrigin: 'center center'
    });
  }

  reset();

  return {
    scene,
    layer,
    hero,
    update,
    reset
  };
}