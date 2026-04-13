/**
 * Scene 2 for the Origin homepage.
 * TV reveal + autoplaying video + cinematic staged copy.
 *
 * Designed to support both:
 * - continuous progress updates
 * - discrete step/act control
 */

export function initOriginScene2() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('OriginScene2: Browser environment not available.');
    return null;
  }

  if (typeof gsap === 'undefined') {
    console.warn('OriginScene2: GSAP not available.');
    return null;
  }

  const scene = document.getElementById('origin-cinematic');
  const layer = document.getElementById('origin-scene-2-layer');
  const stage = document.getElementById('tvStage');
  const media = document.getElementById('tvMedia');
  const glow = document.getElementById('tvGlow');
  const copy = document.getElementById('tvCopy');
  const fade = document.getElementById('originFade');

  const screenWrap = document.getElementById('tvGeo');
  const screenOverlay = document.getElementById('tvGeoGrid');
  const screenGlow = document.getElementById('tvGeoOrb');
  const video = document.getElementById('tvSceneVideo');

  const required = {
    scene,
    layer,
    stage,
    media,
    glow,
    copy,
    fade,
    screenWrap,
    screenOverlay,
    screenGlow,
    video
  };

  const missing = Object.entries(required)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(`OriginScene2: Missing required DOM elements: ${missing.join(', ')}`);
    return null;
  }

  const acts = [
    'A SIGNAL APPEARS',
    'IT BEGINS TO MOVE',
    'IT TAKES FORM',
    'IT BECOMES TIME',
    'THIS IS CHRONOTALES'
  ];

  let destroyed = false;
  let activeActIndex = -1;
  let lastRevealProgress = -1;
  let lastActsProgress = -1;
  let videoLoaded = false;
  let videoPlaybackUnlocked = false;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + ((b - a) * t);
  }

  function progressToActIndex(progress) {
    const p = clamp01(progress);

    if (p < 0.18) return 0;
    if (p < 0.38) return 1;
    if (p < 0.60) return 2;
    if (p < 0.82) return 3;
    return 4;
  }

  function ensureVideoSource() {
    if (videoLoaded || destroyed) return;

    const source = video.dataset.src;
    if (!source) return;

    video.src = source;
    video.load();
    videoLoaded = true;
  }

  function tryPlayVideo() {
    if (destroyed) return;

    ensureVideoSource();

    try {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (error) {
      // no-op
    }
  }

  function unlockPlayback() {
    if (videoPlaybackUnlocked || destroyed) return;
    videoPlaybackUnlocked = true;
    tryPlayVideo();
  }

  video.muted = true;
  video.autoplay = false;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';

  function setBaseState() {
    gsap.killTweensOf([media, glow, copy, screenOverlay, screenGlow, stage, fade]);

    gsap.set(layer, { opacity: 0 });
    gsap.set(stage, { opacity: 1 });

    gsap.set(media, {
      opacity: 0,
      scale: 0.6,
      y: 28,
      transformOrigin: 'center center'
    });

    gsap.set(glow, {
      opacity: 0,
      scale: 0.72,
      transformOrigin: 'center center'
    });

    gsap.set(copy, {
      opacity: 0,
      y: 18,
      scale: 1
    });

    gsap.set(fade, { opacity: 0 });
    gsap.set(screenWrap, { opacity: 1, scale: 1 });
    gsap.set(screenOverlay, { opacity: 0.10 });
    gsap.set(screenGlow, { opacity: 0.20, scale: 0.9 });

    copy.textContent = '';
    activeActIndex = -1;
    lastRevealProgress = 0;
    lastActsProgress = 0;
  }

  const ambientTimeline = gsap.timeline({
    paused: false,
    repeat: -1,
    yoyo: true,
    defaults: { ease: 'sine.inOut' }
  });

  ambientTimeline
    .to(glow, { opacity: 0.36, scale: 1.04, duration: 2.6 }, 0)
    .to(screenGlow, { opacity: 0.42, scale: 1.06, duration: 2.2 }, 0.1)
    .to(screenOverlay, { opacity: 0.18, duration: 2.4 }, 0.12)
    .to(media, { y: 20, duration: 3.0 }, 0.2);

  function animateCopyIn(text) {
    copy.textContent = text;

    gsap.fromTo(
      copy,
      { opacity: 0, y: 30, scale: 0.985 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true
      }
    );
  }

  function setAct(index, options = {}) {
    if (destroyed) return;

    const safeIndex = Math.max(0, Math.min(acts.length - 1, index));
    const text = acts[safeIndex];
    if (!text) return;

    const { immediate = false } = options;

    if (safeIndex === activeActIndex && !immediate) return;
    activeActIndex = safeIndex;

    gsap.killTweensOf(copy);

    if (immediate) {
      copy.textContent = text;
      gsap.set(copy, {
        opacity: 1,
        y: 0,
        scale: safeIndex === acts.length - 1 ? 1.05 : 1
      });
      return;
    }

    gsap.to(copy, {
      opacity: 0,
      y: 20,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        animateCopyIn(text);
      }
    });
  }

  function updateReveal(progress) {
    if (destroyed) return;

    const p = clamp01(progress);
    if (p === lastRevealProgress) return;
    lastRevealProgress = p;

    gsap.set(layer, { opacity: 1 });

    gsap.set(media, {
      opacity: p,
      scale: lerp(0.6, 1, p),
      y: lerp(28, 0, p)
    });

    gsap.set(glow, {
      opacity: 0.32 * p,
      scale: lerp(0.72, 1, p)
    });

    gsap.set(copy, {
      opacity: p > 0.58 ? (p - 0.58) / 0.42 : 0,
      y: 18 * (1 - p)
    });

    gsap.set(screenOverlay, {
      opacity: 0.08 + (0.10 * p)
    });

    gsap.set(screenGlow, {
      opacity: 0.18 + (0.20 * p),
      scale: 0.9 + (0.10 * p)
    });

    if (p > 0.04) {
      unlockPlayback();
    }
  }

  function updateActs(progress) {
    if (destroyed) return;

    const p = clamp01(progress);
    if (p === lastActsProgress) return;
    lastActsProgress = p;

    const index = progressToActIndex(p);
    setAct(index);

    gsap.set(screenOverlay, {
      opacity: 0.12 + (p * 0.10)
    });

    gsap.set(screenGlow, {
      opacity: 0.24 + (p * 0.18),
      scale: 0.92 + (p * 0.12)
    });

    gsap.set(copy, {
      scale: index === acts.length - 1 ? 1.05 : 1
    });

    gsap.set(glow, {
      opacity: index === acts.length - 1 ? 0.55 : 0.32 + (p * 0.12)
    });

    unlockPlayback();
  }

  function reset() {
    if (destroyed) return;

    gsap.killTweensOf([media, glow, copy, screenOverlay, screenGlow, stage, fade]);
    ambientTimeline.pause(0);
    setBaseState();
    ambientTimeline.play(0);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;

    ambientTimeline.kill();
    gsap.killTweensOf([media, glow, copy, screenOverlay, screenGlow, stage, fade]);

    try {
      video.pause();
    } catch (error) {
      // no-op
    }
  }

  setBaseState();

  return {
    scene,
    layer,
    fade,
    video,
    acts,
    updateReveal,
    updateActs,
    setAct,
    ensureVideoSource,
    tryPlayVideo,
    unlockPlayback,
    reset,
    destroy
  };
}