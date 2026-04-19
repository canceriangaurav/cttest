/**
 * Scene 1 hero module for the lightweight Origin homepage.
 * Clean transform-owned version:
 * - GSAP owns centering and motion
 * - no CSS translateX centering dependency for text elements
 * - same public API, so other scenes remain untouched
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

  function easeOutCubic(t) {
    const p = clamp01(t);
    return 1 - Math.pow(1 - p, 3);
  }

  function easeInOutCubic(t) {
    const p = clamp01(t);
    return p < 0.5
      ? 4 * p * p * p
      : 1 - Math.pow(-2 * p + 2, 3) / 2;
  }

  function easeInCubic(t) {
    const p = clamp01(t);
    return p * p * p;
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

  function setCenterOwnedTransforms() {
    gsap.set([titleTop, titleBottom, titleBottomGhost, kicker, support], {
      xPercent: -50,
      force3D: true
    });

    gsap.set(mediaWrap, {
      force3D: true,
      transformOrigin: 'center center'
    });
  }

  function reset() {
    setCenterOwnedTransforms();

    gsap.set(hero, { opacity: 1 });
    gsap.set(layer, { opacity: 1 });

    gsap.set(titleTop, {
      x: -180,
      y: 0,
      opacity: 0
    });

    gsap.set(titleBottom, {
      x: 180,
      y: 0,
      opacity: 0
    });

    gsap.set(titleBottomGhost, {
      x: 180,
      y: 0,
      opacity: 0
    });

    gsap.set(mediaWrap, {
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      y: 0,
      opacity: 1
    });

    gsap.set(kicker, {
      x: 0,
      y: -14,
      opacity: 0
    });

    gsap.set(support, {
      x: 0,
      y: 14,
      opacity: 0
    });

    setFrame(1);
  }

  function update(progress) {
    const p = clamp01(progress);

    if (p > 0.08) preloadFrames();

    /**
     * Structure
     * 0.00 -> 0.18 : hourglass hold / atmospheric stillness
     * 0.18 -> 0.42 : titles + supporting copy enter
     * 0.42 -> 0.62 : centered hold / brand statement breathes
     * 0.62 -> 1.00 : sequence advances, text leaves, image recedes
     */

    const textEnterRaw = mapProgress(p, 0.18, 0.42);
    const textHoldRaw = mapProgress(p, 0.42, 0.62);
    const textExitRaw = mapProgress(p, 0.62, 1.00);

    const textEnter = easeOutCubic(textEnterRaw);
    const textHold = easeInOutCubic(textHoldRaw);
    const textExit = easeInCubic(textExitRaw);

    const sequenceP = easeInOutCubic(mapProgress(p, 0.42, 1.00));
    const hourglassFadeOut = mapProgress(p, 0.90, 1.00);

    // Film-style micro drift
    const centerFloatY = lerp(0, -6, textHold) + lerp(0, -10, textExit);

    // Top title: enters from left, settles, then exits left softly
    const topX = p < 0.62
      ? lerp(-180, 0, textEnter)
      : lerp(0, -120, textExit);

    const topY = centerFloatY;
    const topOpacity = p < 0.62
      ? textEnter
      : 1 - textExit;

    // Bottom title: enters from right, settles, then exits right
    const bottomX = p < 0.62
      ? lerp(180, 0, textEnter)
      : lerp(0, 120, textExit);

    const bottomY = centerFloatY;
    const bottomOpacity = p < 0.62
      ? 0.96 * textEnter
      : 0.96 * (1 - textExit);

    const ghostOpacity = p < 0.62
      ? 0.30 * textEnter
      : 0.30 * (1 - textExit);

    // Kicker/support timings
    const kickerIn = easeOutCubic(mapProgress(p, 0.20, 0.34));
    const kickerOut = easeInCubic(mapProgress(p, 0.68, 0.94));

    const supportIn = easeOutCubic(mapProgress(p, 0.24, 0.38));
    const supportOut = easeInCubic(mapProgress(p, 0.70, 0.96));

    gsap.set(titleTop, {
      xPercent: -50,
      x: topX,
      y: topY,
      opacity: topOpacity
    });

    gsap.set(titleBottom, {
      xPercent: -50,
      x: bottomX,
      y: bottomY,
      opacity: bottomOpacity
    });

    gsap.set(titleBottomGhost, {
      xPercent: -50,
      x: bottomX,
      y: bottomY,
      opacity: ghostOpacity
    });

    gsap.set(kicker, {
      xPercent: -50,
      x: 0,
      y: lerp(-14, 0, kickerIn) + lerp(0, -12, kickerOut),
      opacity: kickerIn * (1 - kickerOut)
    });

    gsap.set(support, {
      xPercent: -50,
      x: 0,
      y: lerp(14, 0, supportIn) + lerp(0, 18, supportOut),
      opacity: supportIn * (1 - supportOut)
    });

    const frame = Math.min(
      FRAME_COUNT,
      Math.max(1, Math.floor(sequenceP * (FRAME_COUNT - 1)) + 1)
    );
    setFrame(frame);

    gsap.set(mediaWrap, {
      xPercent: -50,
      yPercent: -50,
      y: lerp(0, -10, sequenceP),
      scale: lerp(1, 0.84, sequenceP),
      opacity: 1 - hourglassFadeOut
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