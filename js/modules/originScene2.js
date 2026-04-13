/**
 * Scene 2 for the Origin homepage.
 * TV reveal + autoplaying video + cinematic staged copy.
 */
export function initOriginScene2() {
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

  if (
    !scene ||
    !layer ||
    !stage ||
    !media ||
    !glow ||
    !copy ||
    !fade ||
    !screenWrap ||
    !screenOverlay ||
    !screenGlow ||
    !video
  ) {
    console.warn('OriginScene2: Missing required DOM elements.');
    return null;
  }

  const acts = [
    'A SIGNAL APPEARS',
    'IT BEGINS TO MOVE',
    'IT TAKES FORM',
    'IT BECOMES TIME',
    'THIS IS CHRONOTALES'
  ];

  let activeActIndex = -1;
  let videoLoaded = false;
  let videoPlaybackUnlocked = false;

  function ensureVideoSource() {
    if (videoLoaded) return;
    const source = video.dataset.src;
    if (!source) return;

    video.src = source;
    video.load();
    videoLoaded = true;
  }

  function tryPlayVideo() {
    ensureVideoSource();

    try {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (err) {}
  }

  video.muted = true;
  video.autoplay = false;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';

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
    y: 18
  });
  gsap.set(fade, { opacity: 0 });
  gsap.set(screenWrap, { opacity: 1, scale: 1 });
  gsap.set(screenOverlay, { opacity: 0.10 });
  gsap.set(screenGlow, { opacity: 0.20, scale: 0.9 });

  copy.textContent = '';

  const ambientTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: 'sine.inOut' }
  });

  ambientTimeline
    .to(glow, { opacity: 0.36, scale: 1.04, duration: 2.6 }, 0)
    .to(screenGlow, { opacity: 0.42, scale: 1.06, duration: 2.2 }, 0.1)
    .to(screenOverlay, { opacity: 0.18, duration: 2.4 }, 0.12)
    .to(media, { y: 20, duration: 3.0 }, 0.2);

  function setAct(index) {
    if (index === activeActIndex) return;
    activeActIndex = index;

    const text = acts[index];
    if (!text) return;

    gsap.to(copy, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        copy.textContent = text;

        gsap.fromTo(
          copy,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: true
          }
        );
      }
    });
  }

  function unlockPlayback() {
    if (videoPlaybackUnlocked) return;
    videoPlaybackUnlocked = true;
    tryPlayVideo();
  }

  function updateReveal(progress) {
    const p = Math.max(0, Math.min(1, progress));

    gsap.set(layer, { opacity: 1 });
    gsap.set(media, {
      opacity: p,
      scale: 0.6 + (0.4 * p),
      y: 28 * (1 - p)
    });
    gsap.set(glow, {
      opacity: 0.32 * p,
      scale: 0.72 + (0.28 * p)
    });
    gsap.set(copy, {
      opacity: p > 0.58 ? ((p - 0.58) / 0.42) : 0,
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
    const p = Math.max(0, Math.min(1, progress));

    let index = 0;
    if (p < 0.18) {
      index = 0;
    } else if (p < 0.38) {
      index = 1;
    } else if (p < 0.60) {
      index = 2;
    } else if (p < 0.82) {
      index = 3;
    } else {
      index = 4;
    }

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

  return {
    scene,
    layer,
    fade,
    updateReveal,
    updateActs,
    video,
    ensureVideoSource,
    tryPlayVideo
  };
}
